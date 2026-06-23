from fastapi import APIRouter

from app.models.schemas import SuccessResponse, ComplianceOverview, AuditDetail, ComplianceStatus, ComplianceCheckItem
from app.services.agents import compliance_agent

router = APIRouter(prefix="/compliance", tags=["Compliance"])

@router.get("/overview", response_model=SuccessResponse)
async def get_overview():
    """Get top-level compliance overview."""
    overview = ComplianceOverview(
        total_checks=450,
        compliant=410,
        partial=25,
        non_compliant=15,
        not_assessed=0,
        overall_score=91.1,
        regulations=[
            {"name": "OISD-117", "description": "Fire Protection Facilities", "score": 85.0},
            {"name": "ASME B31.3", "description": "Process Piping", "score": 98.0},
            {"name": "API 610", "description": "Centrifugal Pumps", "score": 92.5}
        ]
    )
    return SuccessResponse(data=overview.model_dump())

@router.get("/gaps", response_model=SuccessResponse)
async def list_gaps():
    """Use AI Agent to identify compliance gaps from recent docs."""
    gaps = await compliance_agent.identify_gaps()
    return SuccessResponse(data=[g.model_dump() for g in gaps])

@router.get("/audit/{regulation}", response_model=SuccessResponse)
async def get_audit_detail(regulation: str):
    """Get detailed audit status for a specific regulation."""
    detail = AuditDetail(
        regulation=regulation,
        title=f"{regulation} Compliance Audit",
        status=ComplianceStatus.PARTIAL,
        score=85.0,
        summary="Recent audit identified gaps in fire water systems and foam proportioners.",
        last_audit_date="2024-10-15",
        checks=[
            ComplianceCheckItem(
                item_id="CHK-001", description="Fire Water Pump Capacity",
                regulation=regulation, status=ComplianceStatus.COMPLIANT,
                finding="100% capacity verified"
            ),
            ComplianceCheckItem(
                item_id="CHK-002", description="Foam System Proportioning",
                regulation=regulation, status=ComplianceStatus.PARTIAL,
                finding="Concentration at 2.5%, target 3.0%",
                corrective_action="Recalibrate by Nov 15", due_date="2024-11-15"
            ),
            ComplianceCheckItem(
                item_id="CHK-003", description="Hydrant Flow Test",
                regulation=regulation, status=ComplianceStatus.NON_COMPLIANT,
                finding="H-204 pressure low",
                corrective_action="Flush header", due_date="2024-11-20"
            )
        ]
    )
    return SuccessResponse(data=detail.model_dump())
