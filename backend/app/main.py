from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import get_settings
from app.routes import documents, graph, copilot, maintenance, compliance

settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="Backend API for IntelliPlant Hackathon Project"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For hackathon, allow all
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(documents.router, prefix="/api", tags=["documents"])
app.include_router(graph.router, prefix="/api", tags=["graph"])
app.include_router(copilot.router, prefix="/api", tags=["copilot"])
app.include_router(maintenance.router, prefix="/api", tags=["maintenance"])
app.include_router(compliance.router, prefix="/api", tags=["compliance"])

@app.get("/api/health", tags=["health"])
async def health_check():
    return JSONResponse(content={
        "status": "healthy",
        "app": settings.app_name,
        "version": settings.app_version
    })

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=settings.port, reload=True)
