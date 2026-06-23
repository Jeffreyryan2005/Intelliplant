from datetime import datetime, timedelta
from fastapi import APIRouter, HTTPException

from app.models.schemas import SuccessResponse, EquipmentSummary, EquipmentStatus, DashboardData, TimelineEvent, SeverityLevel
from app.services.agents import maintenance_agent

router = APIRouter(prefix="/maintenance", tags=["Maintenance"])

# Mock data for hackathon
mock_equipment = {
    "P-101A": EquipmentSummary(
        equipment_id="P-101A", name="Centrifugal Pump P-101A", type="Pump", location="CDU",
        status=EquipmentStatus.WARNING, last_maintenance=datetime.now() - timedelta(days=45),
        failure_count=3, total_downtime_hours=48.5, health_score=65.0
    ),
    "E-103": EquipmentSummary(
        equipment_id="E-103", name="Heat Exchanger E-103", type="Heat Exchanger", location="CDU",
        status=EquipmentStatus.CRITICAL, last_maintenance=datetime.now() - timedelta(days=12),
        failure_count=1, total_downtime_hours=24.0, health_score=40.0
    ),
    "C-201": EquipmentSummary(
        equipment_id="C-201", name="Reciprocating Compressor C-201", type="Compressor", location="VDU",
        status=EquipmentStatus.HEALTHY, last_maintenance=datetime.now() - timedelta(days=180),
        failure_count=1, total_downtime_hours=72.0, health_score=92.0
    )
}

@router.get("/dashboard", response_model=SuccessResponse)
async def get_dashboard():
    """Get overall maintenance dashboard statistics."""
    dashboard = DashboardData(
        total_equipment=150,
        healthy_count=135,
        warning_count=10,
        critical_count=5,
        total_failures=24,
        avg_health_score=88.5,
        top_failure_modes=[
            {"failure_mode": "Seal Leak", "count": 8, "avg_downtime_hours": 12.5, "total_cost": 25000},
            {"failure_mode": "High Vibration", "count": 6, "avg_downtime_hours": 36.0, "total_cost": 45000},
            {"failure_mode": "Bearing Failure", "count": 4, "avg_downtime_hours": 48.0, "total_cost": 60000}
        ],
        recent_failures=[
            {"equipment_id": "E-103", "date": "2024-08-14", "issue": "Flange Leak"},
            {"equipment_id": "P-101A", "date": "2024-07-20", "issue": "High Vibration"}
        ]
    )
    return SuccessResponse(data=dashboard.model_dump())

@router.get("/equipment", response_model=SuccessResponse)
async def list_equipment():
    """List all tracked equipment."""
    data = [e.model_dump() for e in mock_equipment.values()]
    return SuccessResponse(data=data)

@router.get("/rca/{equipment_id}", response_model=SuccessResponse)
async def run_rca(equipment_id: str):
    """Run AI Root Cause Analysis on a specific equipment."""
    if equipment_id not in mock_equipment:
        # We can still run RCA if we don't have it in mock
        eq_name = f"Equipment {equipment_id}"
    else:
        eq_name = mock_equipment[equipment_id].name
        
    issue = "Recent failure or performance degradation"
    
    result = await maintenance_agent.perform_rca(equipment_id, eq_name, issue)
    return SuccessResponse(data=result.model_dump())

@router.get("/timeline/{equipment_id}", response_model=SuccessResponse)
async def get_timeline(equipment_id: str):
    """Get maintenance history timeline for an equipment."""
    # Mock data
    events = [
        TimelineEvent(date="2023-11-05", event_type="PM", description="Annual overhaul", severity=SeverityLevel.LOW),
        TimelineEvent(date="2024-04-12", event_type="Condition Monitoring", description="Vibration alert triggered", severity=SeverityLevel.MEDIUM),
        TimelineEvent(date="2024-07-20", event_type="Failure", description="High vibration trip", severity=SeverityLevel.CRITICAL),
        TimelineEvent(date="2024-07-22", event_type="CM", description="Replaced impeller and balanced", severity=SeverityLevel.LOW)
    ]
    return SuccessResponse(data=[e.model_dump() for e in events])
