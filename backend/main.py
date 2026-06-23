import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import get_settings
from app.models.schemas import SuccessResponse, SystemStats
from app.services.document_processor import doc_processor

from app.routes import documents, copilot, graph, maintenance, compliance

settings = get_settings()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle events for the FastAPI app."""
    print(f"Starting {settings.app_name}...")
    
    # Normally we would initialize RAG and Graph here,
    # and maybe preload the sample documents.
    # For hackathon, we can trigger background loading of sample docs.
    # To keep startup fast, we'll just print a message.
    print("Application ready.")
    yield
    print("Shutting down...")

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="Backend API for Industrial Knowledge Intelligence Platform.",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url, "http://localhost:3000", "*"], # Allow * for hackathon ease
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount routes
app.include_router(documents.router, prefix="/api")
app.include_router(copilot.router, prefix="/api")
app.include_router(graph.router, prefix="/api")
app.include_router(maintenance.router, prefix="/api")
app.include_router(compliance.router, prefix="/api")

@app.get("/api/health", tags=["System"])
async def health_check():
    """Basic health check endpoint."""
    return {"status": "ok", "version": settings.app_version}

@app.get("/api/stats", response_model=SuccessResponse, tags=["System"])
async def get_system_stats():
    """Get overall system statistics."""
    from app.services.knowledge_graph import knowledge_graph
    from app.services.rag_pipeline import rag_pipeline
    
    stats = SystemStats(
        document_count=len(doc_processor._metadata_store),
        total_chunks=rag_pipeline.collection.count(),
        entity_count=len(knowledge_graph.graph.nodes), # Approximate
        graph_nodes=len(knowledge_graph.graph.nodes),
        graph_edges=len(knowledge_graph.graph.edges),
        equipment_tracked=150,
        compliance_checks=450,
        uptime_seconds=3600.0 # Mock
    )
    return SuccessResponse(data=stats.model_dump())

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=settings.port, reload=settings.debug)
