"""
Document processing service for IntelliPlant.

Handles PDF text extraction (via pdfplumber + PyMuPDF fallback),
text chunking for RAG embeddings, and regex-based named-entity
extraction tailored to industrial / refinery documents.
"""

from __future__ import annotations

import hashlib
import logging
import re
import time
import uuid
from datetime import datetime
from pathlib import Path
from typing import Optional

import pdfplumber
import fitz  # PyMuPDF

from app.config import UPLOAD_DIR, SAMPLE_DOCS_DIR
from app.models.schemas import (
    DocumentDetail,
    DocumentMetadata,
    DocumentStatus,
    EntityType,
    ExtractedEntity,
)

logger = logging.getLogger("intelliplant.document_processor")

# ═══════════════════════════════════════════════════════════════════════════
# Regex patterns for industrial entity extraction
# ═══════════════════════════════════════════════════════════════════════════

# Equipment tags — e.g. P-101A, E-103, C-101, H-101, TK-101, FCV-101, ACC-101, PSV-101A
_RE_EQUIPMENT = re.compile(
    r"\b([A-Z]{1,4}-\d{2,4}[A-Z]?(?:/[A-Z])?)\b"
)

# Document control numbers — e.g. BPL-MAINT-2024-0147, BPL-SOP-CDU-003
_RE_DOCUMENT = re.compile(
    r"\b(BPL-[A-Z]+-(?:[A-Z]+-)?[\d]+-?\d{2,4})\b"
)

# Regulation / standard references — e.g. OISD-STD-117, API 610, ASME B31.3, IS:2825
_RE_REGULATION = re.compile(
    r"\b((?:OISD[-\s]?(?:STD[-\s]?)?\d{2,3})|"
    r"(?:API\s*(?:RP\s*)?\d{2,4})|"
    r"(?:ASME\s*(?:Sec\.?\s*[IVX]+\s*(?:Div\.?\s*\d)?|B\d+\.\d+|PCC-\d))|"
    r"(?:IS[:\s]\d{3,5})|"
    r"(?:TEMA\s+[A-Z]{2,3})|"
    r"(?:ISO\s+\d{4,5}(?:-\d+)?))\b",
    re.IGNORECASE,
)

# Chemical / substance names
_CHEMICALS = [
    "crude oil", "naphtha", "kerosene", "diesel", "LPG", "ATF",
    "hydrogen sulfide", "H₂S", "H2S", "HCl", "NaCl", "MgCl₂", "CaCl₂",
    "methane", "ethane", "nitrogen", "AFFF", "caustic", "NaOH",
    "hydrocarbon", "fuel gas", "atmospheric residue", "gas oil",
]
_RE_CHEMICAL = re.compile(
    r"\b(" + "|".join(re.escape(c) for c in _CHEMICALS) + r")\b",
    re.IGNORECASE,
)

# Date patterns — dd-Mon-yyyy, yyyy-mm-dd, dd/mm/yyyy
_RE_DATE = re.compile(
    r"\b(\d{1,2}[-/]\w{3}[-/]\d{4}|\d{4}-\d{2}-\d{2}|\d{1,2}/\d{1,2}/\d{4})\b"
)

# Personnel names with employee IDs — e.g. R. Sharma (M-2045), A. Rao (M-1042)
_RE_PERSON = re.compile(
    r"\b([A-Z][a-z]*\.?\s+[A-Z][a-z]{2,})\b"
)

# Failure modes / incident keywords
_FAILURE_MODES = [
    "bearing failure", "seal leak", "high vibration", "misalignment",
    "corrosion", "erosion", "fouling", "cavitation", "fatigue",
    "overheating", "tube leak", "gasket degradation", "flange leak",
    "valve failure", "impeller erosion", "cracking", "emulsion",
    "thermal shock", "flame impingement", "pressure drop",
    "blocked nozzle", "contamination", "dry running",
]
_RE_FAILURE = re.compile(
    r"\b(" + "|".join(re.escape(f) for f in _FAILURE_MODES) + r")\b",
    re.IGNORECASE,
)

# Location patterns
_RE_LOCATION = re.compile(
    r"\b(CDU\s*(?:Area)?|Pump\s*House\s*PH-\d+|Bay\s*\d+|"
    r"Vizag|Visakhapatnam|Column\s*C-\d{3})\b",
    re.IGNORECASE,
)


# ═══════════════════════════════════════════════════════════════════════════
# Text extraction
# ═══════════════════════════════════════════════════════════════════════════

def extract_text_from_pdf(file_path: str | Path) -> tuple[str, int]:
    """
    Extract text content from a PDF file.

    Uses pdfplumber as the primary engine with PyMuPDF as fallback for
    pages that return little or no text (common with scanned documents).

    Args:
        file_path: Absolute path to the PDF file.

    Returns:
        Tuple of (full_text, page_count).
    """
    file_path = Path(file_path)
    full_text_parts: list[str] = []
    page_count = 0

    try:
        # Primary extraction with pdfplumber (better table handling)
        with pdfplumber.open(file_path) as pdf:
            page_count = len(pdf.pages)
            for i, page in enumerate(pdf.pages):
                text = page.extract_text() or ""
                # Also try table extraction for structured content
                tables = page.extract_tables()
                table_text = ""
                for table in tables:
                    for row in table:
                        if row:
                            cleaned = [str(cell).strip() if cell else "" for cell in row]
                            table_text += " | ".join(cleaned) + "\n"

                page_text = text
                if table_text and len(table_text) > len(text) * 0.3:
                    page_text = text + "\n" + table_text

                full_text_parts.append(f"--- Page {i + 1} ---\n{page_text}")

    except Exception as e:
        logger.warning("pdfplumber failed for %s: %s — falling back to PyMuPDF", file_path.name, e)

    # Fallback / supplement with PyMuPDF if pdfplumber got little text
    combined = "\n".join(full_text_parts)
    if len(combined.strip()) < 100:
        logger.info("Trying PyMuPDF fallback for %s", file_path.name)
        try:
            pdf_doc = fitz.open(str(file_path))
            page_count = len(pdf_doc)
            full_text_parts = []
            for i, page in enumerate(pdf_doc):
                text = page.get_text("text")
                full_text_parts.append(f"--- Page {i + 1} ---\n{text}")
            pdf_doc.close()
        except Exception as e2:
            logger.error("PyMuPDF also failed for %s: %s", file_path.name, e2)

    full_text = "\n\n".join(full_text_parts)
    logger.info("Extracted %d characters from %d pages of %s",
                len(full_text), page_count, file_path.name)
    return full_text, page_count


def extract_text_from_csv(file_path: str | Path) -> tuple[str, int]:
    """
    Read a CSV file and convert it to plain text representation.

    Args:
        file_path: Absolute path to the CSV file.

    Returns:
        Tuple of (text, 1) — CSVs are treated as single-page documents.
    """
    file_path = Path(file_path)
    text = file_path.read_text(encoding="utf-8")
    return text, 1


# ═══════════════════════════════════════════════════════════════════════════
# Text chunking
# ═══════════════════════════════════════════════════════════════════════════

def chunk_text(
    text: str,
    chunk_size: int = 1000,
    chunk_overlap: int = 200,
) -> list[str]:
    """
    Split text into overlapping chunks suitable for embedding.

    The algorithm prefers splitting at paragraph or sentence boundaries
    to keep semantic coherence.  Falls back to character-level splitting
    for very long runs without punctuation.

    Args:
        text:          Input text.
        chunk_size:    Target number of characters per chunk.
        chunk_overlap: Overlap between consecutive chunks.

    Returns:
        List of text chunks.
    """
    if not text or not text.strip():
        return []

    # Split on double newlines first (paragraph boundaries)
    paragraphs = re.split(r"\n{2,}", text)
    chunks: list[str] = []
    current_chunk = ""

    for para in paragraphs:
        para = para.strip()
        if not para:
            continue

        if len(current_chunk) + len(para) + 1 <= chunk_size:
            current_chunk += ("\n\n" + para) if current_chunk else para
        else:
            if current_chunk:
                chunks.append(current_chunk.strip())
            # If a single paragraph exceeds chunk_size, split by sentences
            if len(para) > chunk_size:
                sentences = re.split(r"(?<=[.!?])\s+", para)
                current_chunk = ""
                for sent in sentences:
                    if len(current_chunk) + len(sent) + 1 <= chunk_size:
                        current_chunk += (" " + sent) if current_chunk else sent
                    else:
                        if current_chunk:
                            chunks.append(current_chunk.strip())
                        # Handle extremely long sentences
                        if len(sent) > chunk_size:
                            for j in range(0, len(sent), chunk_size - chunk_overlap):
                                chunks.append(sent[j:j + chunk_size].strip())
                            current_chunk = ""
                        else:
                            current_chunk = sent
            else:
                current_chunk = para

    if current_chunk.strip():
        chunks.append(current_chunk.strip())

    # Apply overlap by prepending the tail of the previous chunk
    if chunk_overlap > 0 and len(chunks) > 1:
        overlapped: list[str] = [chunks[0]]
        for i in range(1, len(chunks)):
            prev_tail = chunks[i - 1][-chunk_overlap:]
            overlapped.append(prev_tail + " " + chunks[i])
        chunks = overlapped

    # Filter out tiny chunks
    chunks = [c for c in chunks if len(c.strip()) > 50]

    logger.debug("Chunked text into %d chunks (avg %d chars)",
                 len(chunks), sum(len(c) for c in chunks) // max(len(chunks), 1))
    return chunks


# ═══════════════════════════════════════════════════════════════════════════
# Entity extraction
# ═══════════════════════════════════════════════════════════════════════════

def extract_entities(text: str) -> list[ExtractedEntity]:
    """
    Extract named entities from industrial document text using
    domain-specific regex patterns.

    Returns a deduplicated list of ExtractedEntity objects.
    """
    entities: dict[tuple[str, str], ExtractedEntity] = {}

    def _add(text_val: str, etype: EntityType, confidence: float = 0.9):
        key = (text_val.strip(), etype.value)
        if key not in entities:
            entities[key] = ExtractedEntity(
                text=text_val.strip(),
                type=etype,
                confidence=confidence,
            )

    # Equipment tags
    for m in _RE_EQUIPMENT.finditer(text):
        tag = m.group(1)
        # Filter out false positives (very short or look like dates)
        if len(tag) >= 4 and not re.match(r"^\d{4}$", tag.replace("-", "")):
            _add(tag, EntityType.EQUIPMENT, 0.95)

    # Document references
    for m in _RE_DOCUMENT.finditer(text):
        _add(m.group(1), EntityType.DOCUMENT, 0.98)

    # Regulations & standards
    for m in _RE_REGULATION.finditer(text):
        _add(m.group(1).strip(), EntityType.REGULATION, 0.92)

    # Chemicals
    seen_chem: set[str] = set()
    for m in _RE_CHEMICAL.finditer(text):
        chem = m.group(1)
        chem_lower = chem.lower()
        if chem_lower not in seen_chem:
            seen_chem.add(chem_lower)
            _add(chem, EntityType.CHEMICAL, 0.85)

    # Failure modes
    seen_fail: set[str] = set()
    for m in _RE_FAILURE.finditer(text):
        fm = m.group(1)
        fm_lower = fm.lower()
        if fm_lower not in seen_fail:
            seen_fail.add(fm_lower)
            _add(fm, EntityType.FAILURE_MODE, 0.88)

    # Dates
    seen_dates: set[str] = set()
    for m in _RE_DATE.finditer(text):
        dt = m.group(1)
        if dt not in seen_dates:
            seen_dates.add(dt)
            _add(dt, EntityType.DATE, 0.80)

    # Locations
    seen_locs: set[str] = set()
    for m in _RE_LOCATION.finditer(text):
        loc = m.group(1)
        loc_lower = loc.lower()
        if loc_lower not in seen_locs:
            seen_locs.add(loc_lower)
            _add(loc, EntityType.LOCATION, 0.75)

    result = list(entities.values())
    logger.info("Extracted %d entities from text (%d chars)", len(result), len(text))
    return result


def detect_sections(text: str) -> list[str]:
    """
    Detect document section headings from the extracted text.

    Looks for numbered headings (e.g. '1. SCOPE', '3.2 Investigation Method')
    and standalone ALL-CAPS lines that likely denote sections.
    """
    sections: list[str] = []
    for line in text.split("\n"):
        line = line.strip()
        if not line:
            continue
        # Numbered section headings
        if re.match(r"^\d+(\.\d+)*\.?\s+[A-Z]", line) and len(line) < 120:
            sections.append(line)
        # ALL-CAPS lines (likely headers)
        elif line.isupper() and 4 < len(line) < 80:
            sections.append(line)
    return sections


# ═══════════════════════════════════════════════════════════════════════════
# Full document processing pipeline
# ═══════════════════════════════════════════════════════════════════════════

class DocumentProcessor:
    """
    Orchestrates the full document ingestion pipeline:
    extract text → chunk → extract entities → build metadata.

    This class is stateless — all state is in the returned DocumentDetail.
    """

    def __init__(self, chunk_size: int = 1000, chunk_overlap: int = 200):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self._metadata_store: dict[str, DocumentMetadata] = {}
        self._document_store: dict[str, DocumentDetail] = {}

    async def process_file(
        self,
        file_path: str | Path,
        doc_id: Optional[str] = None,
        filename: Optional[str] = None,
    ) -> DocumentDetail:
        """
        Process a single document file end-to-end.

        Args:
            file_path: Path to the uploaded / sample file.
            doc_id:    Optional pre-assigned document ID.
            filename:  Display filename (defaults to file basename).

        Returns:
            A fully populated DocumentDetail instance.
        """
        file_path = Path(file_path)
        start_time = time.time()

        if not doc_id:
            doc_id = hashlib.md5(file_path.name.encode()).hexdigest()[:12]
        if not filename:
            filename = file_path.name

        logger.info("Processing document: %s (id=%s)", filename, doc_id)

        # Determine file type and extract text
        suffix = file_path.suffix.lower()
        if suffix == ".pdf":
            text, page_count = extract_text_from_pdf(file_path)
        elif suffix == ".csv":
            text, page_count = extract_text_from_csv(file_path)
        elif suffix in (".txt", ".md"):
            text = file_path.read_text(encoding="utf-8")
            page_count = 1
        else:
            text = ""
            page_count = 0
            logger.warning("Unsupported file type: %s", suffix)

        # Chunk the text
        chunks = chunk_text(text, self.chunk_size, self.chunk_overlap)

        # Extract entities
        entities = extract_entities(text)

        # Detect sections
        sections = detect_sections(text)

        # Build metadata
        file_size = file_path.stat().st_size if file_path.exists() else 0
        elapsed_ms = int((time.time() - start_time) * 1000)

        metadata = DocumentMetadata(
            doc_id=doc_id,
            filename=filename,
            file_size=file_size,
            mime_type="application/pdf" if suffix == ".pdf" else f"text/{suffix.lstrip('.')}",
            page_count=page_count,
            upload_time=datetime.utcnow(),
            status=DocumentStatus.COMPLETED,
            processing_time_ms=elapsed_ms,
        )

        # Text preview — first 500 chars, cleaned
        preview = text[:500].replace("\n", " ").strip()

        detail = DocumentDetail(
            metadata=metadata,
            text_content=text,
            text_preview=preview,
            entities=entities,
            chunk_count=len(chunks),
            sections=sections,
        )

        self._metadata_store[doc_id] = metadata
        self._document_store[doc_id] = detail

        logger.info(
            "Document %s processed in %d ms — %d pages, %d chunks, %d entities",
            filename, elapsed_ms, page_count, len(chunks), len(entities),
        )
        return detail

    def get_chunks(self, text: str) -> list[str]:
        """Return text chunks for the given content."""
        return chunk_text(text, self.chunk_size, self.chunk_overlap)

    def get_document(self, doc_id: str) -> Optional[DocumentDetail]:
        return self._document_store.get(doc_id)

    def delete_document(self, doc_id: str):
        if doc_id in self._metadata_store:
            del self._metadata_store[doc_id]
        if doc_id in self._document_store:
            del self._document_store[doc_id]

# Singleton instance
doc_processor = DocumentProcessor()
