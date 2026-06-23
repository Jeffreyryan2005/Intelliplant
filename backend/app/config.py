"""
Application configuration module for IntelliPlant.

Centralizes all environment variables, directory paths, and application
constants using Pydantic Settings for robust validation and type safety.
"""

import os
from pathlib import Path
from functools import lru_cache

from pydantic_settings import BaseSettings
from pydantic import Field


# ---------------------------------------------------------------------------
# Path constants (resolved relative to the backend/ root)
# ---------------------------------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent.parent  # backend/
UPLOAD_DIR = BASE_DIR / "uploads"
CHROMA_DIR = BASE_DIR / "chroma_db"
GRAPH_DIR = BASE_DIR / "graph_data"
SAMPLE_DOCS_DIR = BASE_DIR / "data" / "sample_documents"

# Ensure runtime directories exist on import
for _dir in (UPLOAD_DIR, CHROMA_DIR, GRAPH_DIR, SAMPLE_DOCS_DIR):
    _dir.mkdir(parents=True, exist_ok=True)


class Settings(BaseSettings):
    """
    Global application settings populated from environment variables.

    Attributes:
        app_name:         Human-readable application title.
        app_version:      Semantic version string shown in /api/health.
        debug:            Enable debug logging and detailed error responses.
        port:             Port the Uvicorn server binds to.
        frontend_url:     Allowed CORS origin for the frontend SPA.
        groq_api_key:     API key for Groq Cloud (required for LLM calls).
        llm_chat_model:   Model identifier for conversational / heavy tasks.
        llm_fast_model:   Model identifier for quick extraction tasks.
        llm_temperature:  Sampling temperature for LLM completions.
        llm_max_tokens:   Maximum tokens in LLM response.
        chroma_collection: Name of the default ChromaDB collection.
        chunk_size:       Number of characters per text chunk for embedding.
        chunk_overlap:    Character overlap between adjacent chunks.
        max_upload_mb:    Maximum upload file size in megabytes.
    """

    # ── Application ────────────────────────────────────────────────────
    app_name: str = "IntelliPlant — Industrial Knowledge Intelligence"
    app_version: str = "1.0.0"
    debug: bool = Field(default=False, alias="DEBUG")
    port: int = Field(default=8000, alias="PORT")

    # ── CORS ───────────────────────────────────────────────────────────
    frontend_url: str = Field(
        default="http://localhost:3000", alias="FRONTEND_URL"
    )

    # ── Groq LLM ──────────────────────────────────────────────────────
    groq_api_key: str = Field(default="", alias="GROQ_API_KEY")
    llm_chat_model: str = "llama-3.3-70b-versatile"
    llm_fast_model: str = "llama-3.1-8b-instant"
    llm_temperature: float = 0.3
    llm_max_tokens: int = 4096

    # ── ChromaDB / RAG ────────────────────────────────────────────────
    chroma_collection: str = "intelliplant_docs"
    chunk_size: int = 1000
    chunk_overlap: int = 200

    # ── Upload limits ─────────────────────────────────────────────────
    max_upload_mb: int = 50

    model_config = {
        "env_file": str(BASE_DIR / ".env"),
        "env_file_encoding": "utf-8",
        "extra": "ignore",
    }


@lru_cache()
def get_settings() -> Settings:
    """Return a cached singleton of the application settings."""
    return Settings()
