from datetime import datetime
from typing import List, Dict, Any, Optional

class QMSService:
    def __init__(self):
        # In-memory storage for hackathon
        self.capas = [
            {
                "id": "CAPA-001",
                "title": "Replace corroded flange gasket on E-103",
                "description": "Inspection revealed significant corrosion on the inlet flange. Needs immediate replacement to prevent leak.",
                "type": "corrective",
                "status": "in_progress",
                "severity": "high",
                "equipment_id": "E-103",
                "created_at": "2024-06-10T10:00:00Z",
                "due_date": "2024-07-15",
                "assigned_to": "Maint-Mech-01"
            },
            {
                "id": "CAPA-002",
                "title": "Install vibration monitoring on P-101A",
                "description": "Recurring bearing failures suggest need for continuous condition monitoring.",
                "type": "preventive",
                "status": "open",
                "severity": "medium",
                "equipment_id": "P-101A",
                "created_at": "2024-06-12T14:30:00Z",
                "due_date": "2024-08-01",
                "assigned_to": "Reliability-Eng-02"
            },
            {
                "id": "CAPA-003",
                "title": "Update SOP for CDU startup sequence",
                "description": "Recent startup incident highlights need for clearer instructions on heating rate.",
                "type": "preventive",
                "status": "closed",
                "severity": "low",
                "equipment_id": "C-101",
                "created_at": "2024-05-20T09:15:00Z",
                "due_date": "2024-06-30",
                "assigned_to": "Ops-Manager"
            },
            {
                "id": "CAPA-004",
                "title": "Repair fire water header pressure drop",
                "description": "Pressure drop observed during weekly test. Suspect partial blockage or leak.",
                "type": "corrective",
                "status": "open",
                "severity": "critical",
                "equipment_id": "FWH-201",
                "created_at": "2024-06-20T16:45:00Z",
                "due_date": "2024-07-05",
                "assigned_to": "Safety-Maint"
            },
            {
                "id": "CAPA-005",
                "title": "Calibrate PSV-103 relief valve",
                "description": "Overdue for annual calibration per OISD-117.",
                "type": "preventive",
                "status": "in_progress",
                "severity": "high",
                "equipment_id": "PSV-103",
                "created_at": "2024-06-22T08:00:00Z",
                "due_date": "2024-07-20",
                "assigned_to": "Inst-Tech-04"
            }
        ]
        
        self.audit_trail = [
            {"id": "AT-008", "event": "Compliance gap detected in OISD-117", "timestamp": "2024-06-24T15:30:00Z", "user": "System (ComplianceAgent)"},
            {"id": "AT-007", "event": "AI RCA performed on P-101A", "timestamp": "2024-06-24T14:15:00Z", "user": "R. Sharma"},
            {"id": "AT-006", "event": "Document BPL-MAINT-2024-0147 uploaded", "timestamp": "2024-06-24T10:05:00Z", "user": "A. Rao"},
            {"id": "AT-005", "event": "CAPA-005 created", "timestamp": "2024-06-22T08:05:00Z", "user": "Safety-Officer"},
            {"id": "AT-004", "event": "Document API-610-Pumps uploaded", "timestamp": "2024-06-21T11:20:00Z", "user": "Reliability-Eng"},
            {"id": "AT-003", "event": "CAPA-004 status changed to Open", "timestamp": "2024-06-20T16:50:00Z", "user": "Ops-Shift-Lead"},
            {"id": "AT-002", "event": "MOC-002 submitted for review", "timestamp": "2024-06-18T09:30:00Z", "user": "Process-Eng"},
            {"id": "AT-001", "event": "System initialized", "timestamp": "2024-06-01T00:00:00Z", "user": "Admin"}
        ]
        
        self.mocs = [
            {
                "id": "MOC-001",
                "equipment_id": "P-101A",
                "description": "Replace P-101A impeller material from CI to SS316",
                "status": "approved",
                "risk_level": "medium",
                "approver": "Chief Engineer"
            },
            {
                "id": "MOC-002",
                "equipment_id": "CDU-Overhead",
                "description": "Reroute CDU overhead vapor line",
                "status": "pending_review",
                "risk_level": "high",
                "approver": "Plant Manager"
            },
            {
                "id": "MOC-003",
                "equipment_id": "C-101",
                "description": "Install additional PSV on C-101 overhead",
                "status": "implemented",
                "risk_level": "low",
                "approver": "Safety Head"
            }
        ]

    def list_capas(self) -> List[Dict[str, Any]]:
        return self.capas

    def create_capa(self, capa_data: Dict[str, Any]) -> Dict[str, Any]:
        new_id = f"CAPA-{len(self.capas) + 1:03d}"
        capa_data["id"] = new_id
        capa_data["created_at"] = datetime.utcnow().isoformat() + "Z"
        if "status" not in capa_data:
            capa_data["status"] = "open"
        self.capas.insert(0, capa_data)
        self.log_event(f"{new_id} created", "System")
        return capa_data
        
    def update_capa_status(self, capa_id: str, new_status: str) -> Optional[Dict[str, Any]]:
        for capa in self.capas:
            if capa["id"] == capa_id:
                capa["status"] = new_status
                self.log_event(f"{capa_id} status changed to {new_status}", "System")
                return capa
        return None

    def get_audit_trail(self) -> List[Dict[str, Any]]:
        return self.audit_trail
        
    def log_event(self, event: str, user: str = "System"):
        new_id = f"AT-{len(self.audit_trail) + 1:03d}"
        entry = {
            "id": new_id,
            "event": event,
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "user": user
        }
        self.audit_trail.insert(0, entry)
        return entry

    def list_mocs(self) -> List[Dict[str, Any]]:
        return self.mocs
        
    def create_moc(self, moc_data: Dict[str, Any]) -> Dict[str, Any]:
        new_id = f"MOC-{len(self.mocs) + 1:03d}"
        moc_data["id"] = new_id
        if "status" not in moc_data:
            moc_data["status"] = "pending_review"
        self.mocs.insert(0, moc_data)
        self.log_event(f"{new_id} submitted for review", "System")
        return moc_data

    def get_dashboard_stats(self) -> Dict[str, Any]:
        open_capas = sum(1 for c in self.capas if c["status"] in ["open", "in_progress"])
        active_mocs = sum(1 for m in self.mocs if m["status"] not in ["implemented", "rejected"])
        return {
            "open_capas": open_capas,
            "active_mocs": active_mocs,
            "audit_events": len(self.audit_trail)
        }

qms_service = QMSService()
