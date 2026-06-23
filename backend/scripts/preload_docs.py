import os
import asyncio
from pathlib import Path

from app.services.document_processor import doc_processor
from app.services.rag_pipeline import rag_pipeline
from app.services.knowledge_graph import knowledge_graph
from app.models.schemas import DocumentMetadata, DocumentStatus

async def preload():
    base_dir = Path(__file__).resolve().parent.parent
    sample_dir = base_dir / "data" / "sample_documents"
    
    print(f"Looking for PDFs in {sample_dir}")
    
    for pdf_file in sample_dir.glob("*.pdf"):
        print(f"Processing {pdf_file.name}...")
        
        # Mock metadata
        metadata = DocumentMetadata(
            filename=pdf_file.name,
            file_size=os.path.getsize(pdf_file),
            mime_type="application/pdf",
            status=DocumentStatus.COMPLETED
        )
        
        doc_processor._metadata_store[metadata.doc_id] = metadata
        
        # Process document
        doc_detail = await doc_processor.process_file(str(pdf_file), metadata.doc_id)
        
        # Graph
        knowledge_graph.add_document(
            doc_id=metadata.doc_id,
            filename=metadata.filename,
            entities=doc_detail.entities,
            sections=doc_detail.sections
        )
        
        # Embed
        chunks = doc_detail.sections if doc_detail.sections else [doc_detail.text_content]
        if not doc_detail.sections:
            chunk_size = 1000
            chunks = [doc_detail.text_content[i:i+chunk_size] for i in range(0, len(doc_detail.text_content), chunk_size)]
        
        if chunks:
            metadatas = [{"section": f"Chunk {i}"} for i in range(len(chunks))]
            rag_pipeline.add_documents(metadata.doc_id, metadata.filename, chunks, metadatas)
            
        print(f"Finished {pdf_file.name}")
        
    print("Preload complete. Vector DB and Graph populated.")
    
if __name__ == "__main__":
    asyncio.run(preload())
