"""
Pydantic schemas for the IntelliPlant API.

Every request body, response envelope, and domain object used across the API
is defined here so that OpenAPI docs are complete and type-checking is strict.
"""

from __future__ import annotations

import uuid
from datetime import datetime
from enum import Enum
from typing import Any, Optional

from pydantic import BaseModel, Field


# ═══════════════════════════════════════════════════════════════════════════
# Generic response wrappers
# ═══════════════════════════════════════════════════════════════════════════

class SuccessResponse(BaseModel):
    """Standard success envelope returned by every endpoint."""
    success: bool = True
    data: Any = None
    message: str = ""


class ErrorResponse(BaseModel):
    """Standard error envelope."""
    success: bool = False
    error: str
    detail: str = ""


# ═══════════════════════════════════════════════════════════════════════════
# Enums
# ═══════════════════════════════════════════════════════════════════════════

class EntityType(str, Enum):
    """Types of named entities extracted from industrial documents."""
    EQUIPMENT = "Equipment"
    PERSON = "Person"
    PROCEDURE = "Procedure"
    CHEMICAL = "Chemical"
    REGULATION = "Regulation"
    DATE = "Date"
    FAILURE_MODE = "FailureMode"
    LOCATION = "Location"
    DOCUMENT = "Document"
    ORGANIZATION = "Organization"


class DocumentStatus(str, Enum):
    """Processing status of an uploaded document."""
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class EquipmentStatus(str, Enum):
    """Operational status of a piece of equipment."""
    HEALTHY = "healthy"
    WARNING = "warning"
    CRITICAL = "critical"
    OFFLINE = "offline"


class ComplianceStatus(str, Enum):
    """Compliance verdict for a regulation or check item."""
    COMPLIANT = "compliant"
    PARTIAL = "partial"
    NON_COMPLIANT = "non_compliant"
    NOT_ASSESSED = "not_assessed"


class SeverityLevel(str, Enum):
    """Severity classification for failures and incidents."""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


# ═══════════════════════════════════════════════════════════════════════════
# Document schemas
# ═══════════════════════════════════════════════════════════════════════════

class ExtractedEntity(BaseModel):
    """A single named entity extracted from a document."""
    text: str
    type: EntityType
    confidence: float = Field(default=1.0, ge=0.0, le=1.0)
    context: str = ""


class DocumentMetadata(BaseModel):
    """Metadata for a processed document."""
    doc_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    filename: str
    file_size: int = 0
    mime_type: str = "application/pdf"
    page_count: int = 0
    upload_time: datetime = Field(default_factory=datetime.utcnow)
    status: DocumentStatus = DocumentStatus.PENDING
    processing_time_ms: int = 0


class DocumentDetail(BaseModel):
    """Full detail view of a processed document."""
    metadata: DocumentMetadata
    text_content: str = ""
    text_preview: str = ""
    entities: list[ExtractedEntity] = []
    chunk_count: int = 0
    sections: list[str] = []


class DocumentListItem(BaseModel):
    """Lightweight summary for the document list endpoint."""
    doc_id: str
    filename: str
    page_count: int = 0
    entity_count: int = 0
    status: DocumentStatus
    upload_time: datetime
    file_size: int = 0


# ═══════════════════════════════════════════════════════════════════════════
# Copilot / Chat schemas
# ═══════════════════════════════════════════════════════════════════════════

class ChatRequest(BaseModel):
    """Incoming chat message from the frontend."""
    query: str = Field(..., min_length=1, max_length=2000)
    conversation_id: Optional[str] = None


class Citation(BaseModel):
    """A source citation attached to an answer chunk."""
    document: str
    section: str = ""
    relevance_score: float = 0.0
    text_snippet: str = ""


class ChatResponse(BaseModel):
    """Non-streaming chat response (fallback)."""
    answer: str
    citations: list[Citation] = []
    conversation_id: str = ""
    suggested_followups: list[str] = []


class SuggestedQuestion(BaseModel):
    """A suggested question for the copilot sidebar."""
    question: str
    category: str = "general"


# ═══════════════════════════════════════════════════════════════════════════
# Knowledge Graph schemas
# ═══════════════════════════════════════════════════════════════════════════

class GraphNode(BaseModel):
    """A node in the knowledge graph (for D3.js)."""
    id: str
    label: str
    type: str
    properties: dict[str, Any] = {}


class GraphLink(BaseModel):
    """An edge in the knowledge graph (for D3.js)."""
    source: str
    target: str
    type: str
    label: str = ""


class GraphData(BaseModel):
    """Full knowledge graph payload consumed by D3.js."""
    nodes: list[GraphNode] = []
    links: list[GraphLink] = []


class NodeDetail(BaseModel):
    """Detailed view of a single graph node plus its neighbours."""
    node: GraphNode
    connected_nodes: list[GraphNode] = []
    connected_links: list[GraphLink] = []


# ═══════════════════════════════════════════════════════════════════════════
# Maintenance schemas
# ═══════════════════════════════════════════════════════════════════════════

class EquipmentSummary(BaseModel):
    """Summary card for a single piece of equipment."""
    equipment_id: str
    name: str
    type: str = ""
    location: str = ""
    status: EquipmentStatus = EquipmentStatus.HEALTHY
    last_maintenance: Optional[datetime] = None
    failure_count: int = 0
    total_downtime_hours: float = 0.0
    health_score: float = Field(default=100.0, ge=0.0, le=100.0)


class FailureStat(BaseModel):
    """Aggregated failure statistics."""
    failure_mode: str
    count: int
    avg_downtime_hours: float = 0.0
    total_cost: float = 0.0


class DashboardData(BaseModel):
    """Maintenance dashboard aggregate view."""
    total_equipment: int = 0
    healthy_count: int = 0
    warning_count: int = 0
    critical_count: int = 0
    total_failures: int = 0
    avg_health_score: float = 0.0
    top_failure_modes: list[FailureStat] = []
    recent_failures: list[dict[str, Any]] = []


class RCAResult(BaseModel):
    """Result of an AI-driven Root Cause Analysis."""
    equipment_id: str
    equipment_name: str
    analysis: str
    root_causes: list[str] = []
    recommendations: list[str] = []
    confidence: float = 0.0
    supporting_evidence: list[Citation] = []


class TimelineEvent(BaseModel):
    """A single event on an equipment's maintenance timeline."""
    date: str
    event_type: str
    description: str
    severity: SeverityLevel = SeverityLevel.LOW
    details: dict[str, Any] = {}


# ═══════════════════════════════════════════════════════════════════════════
# Compliance schemas
# ═══════════════════════════════════════════════════════════════════════════

class ComplianceCheckItem(BaseModel):
    """Individual compliance checklist item."""
    item_id: str
    description: str
    regulation: str
    status: ComplianceStatus = ComplianceStatus.NOT_ASSESSED
    finding: str = ""
    corrective_action: str = ""
    due_date: Optional[str] = None


class ComplianceGap(BaseModel):
    """A detected compliance gap requiring attention."""
    gap_id: str
    regulation: str
    description: str
    severity: SeverityLevel
    affected_equipment: list[str] = []
    recommendation: str = ""
    status: ComplianceStatus = ComplianceStatus.NON_COMPLIANT


class ComplianceOverview(BaseModel):
    """Top-level compliance dashboard."""
    total_checks: int = 0
    compliant: int = 0
    partial: int = 0
    non_compliant: int = 0
    not_assessed: int = 0
    overall_score: float = 0.0
    regulations: list[dict[str, Any]] = []


class AuditDetail(BaseModel):
    """Detailed audit report for a specific regulation."""
    regulation: str
    title: str = ""
    status: ComplianceStatus = ComplianceStatus.NOT_ASSESSED
    score: float = 0.0
    checks: list[ComplianceCheckItem] = []
    summary: str = ""
    last_audit_date: Optional[str] = None


# ═══════════════════════════════════════════════════════════════════════════
# System stats
# ═══════════════════════════════════════════════════════════════════════════

class SystemStats(BaseModel):
    """Overall system statistics for the admin dashboard."""
    document_count: int = 0
    total_chunks: int = 0
    entity_count: int = 0
    graph_nodes: int = 0
    graph_edges: int = 0
    equipment_tracked: int = 0
    compliance_checks: int = 0
    uptime_seconds: float = 0.0
