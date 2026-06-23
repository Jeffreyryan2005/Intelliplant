import os
import aiofiles
from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks
from typing import List

from app.config import get_settings
from app.models.schemas import (
    SuccessResponse, DocumentListItem, DocumentDetail, DocumentMetadata, DocumentStatus
)
from app.services.document_processor import doc_processor
from app.services.rag_pipeline import rag_pipeline
from app.services.knowledge_graph import knowledge_graph

router = APIRouter(prefix="/documents", tags=["Documents"])
settings = get_settings()

@router.post("/upload", response_model=SuccessResponse)
async def upload_document(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...)
):
    """Upload a document and start background processing."""
    if file.size and file.size > settings.max_upload_mb * 1024 * 1024:
        raise HTTPException(status_code=400, detail=f"File too large. Max {settings.max_upload_mb} MB.")
        
    # Save file
    file_path = settings.UPLOAD_DIR / file.filename
    async with aiofiles.open(file_path, 'wb') as out_file:
        content = await file.read()
        await out_file.write(content)
        
    # Create initial metadata
    metadata = DocumentMetadata(
        filename=file.filename,
        file_size=len(content),
        mime_type=file.content_type or "application/pdf"
    )
    
    # Store in memory (for hackathon purposes, normally a DB)
    doc_processor._metadata_store[metadata.doc_id] = metadata
    
    # Process in background
    background_tasks.add_task(process_document_task, file_path, metadata.doc_id)
    
    return SuccessResponse(data=metadata.model_dump(), message="Document uploaded and processing started.")

async def process_document_task(file_path, doc_id: str):
    """Background task to process PDF, extract entities, embed, and build graph."""
    try:
        # 1. Parse text and extract entities
        doc_detail = await doc_processor.process_file(file_path, doc_id)
        
        # 2. Add to Knowledge Graph
        knowledge_graph.add_document_entities(doc_detail)
        
        # 3. Add to RAG pipeline
        chunks = doc_detail.sections if doc_detail.sections else [doc_detail.text_content]
        # Minimal chunking strategy for fallback
        if not doc_detail.sections:
            chunk_size = settings.chunk_size
            chunks = [doc_detail.text_content[i:i+chunk_size] for i in range(0, len(doc_detail.text_content), chunk_size)]
            
        metadatas = [{"section": f"Chunk {i}"} for i in range(len(chunks))]
        rag_pipeline.add_documents(doc_id, doc_detail.metadata.filename, chunks, metadatas)
        
    except Exception as e:
        print(f"Error processing document {doc_id}: {e}")
        if doc_id in doc_processor._metadata_store:
            doc_processor._metadata_store[doc_id].status = DocumentStatus.FAILED

@router.get("", response_model=SuccessResponse)
async def list_documents():
    """List all processed documents."""
    docs = []
    for doc_id, meta in doc_processor._metadata_store.items():
        doc_detail = doc_processor.get_document(doc_id)
        docs.append(DocumentListItem(
            doc_id=doc_id,
            filename=meta.filename,
            page_count=meta.page_count,
            entity_count=len(doc_detail.entities) if doc_detail else 0,
            status=meta.status,
            upload_time=meta.upload_time,
            file_size=meta.file_size
        ))
    return SuccessResponse(data=docs)

@router.get("/{doc_id}", response_model=SuccessResponse)
async def get_document(doc_id: str):
    """Get full details of a processed document."""
    doc = doc_processor.get_document(doc_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return SuccessResponse(data=doc.model_dump())

@router.delete("/{doc_id}", response_model=SuccessResponse)
async def delete_document(doc_id: str):
    """Delete a document from all stores."""
    # Delete from memory
    doc = doc_processor.get_document(doc_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
        
    # Remove from processor
    doc_processor.delete_document(doc_id)
    
    # Remove from Chroma
    rag_pipeline.delete_document(doc_id)
    
    # Remove from Graph (simplistic removal for hackathon)
    # Ideally we'd remove edges specifically related to this document
    
    return SuccessResponse(message="Document deleted successfully.")
