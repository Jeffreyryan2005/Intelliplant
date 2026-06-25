import json
from datetime import datetime
from typing import List, Dict, Any, Optional
from app.services.rag_pipeline import rag_pipeline

class LessonsService:
    def __init__(self):
        # In-memory storage for hackathon
        self.lessons = [
            {
                "id": "LL-001",
                "title": "Pump P-101A bearing failure due to misalignment after maintenance",
                "incident_date": "2024-03-15",
                "equipment_id": "P-101A",
                "equipment_name": "Crude Charge Pump",
                "failure_type": "Mechanical",
                "root_cause": "Improper laser alignment during reassembly led to excess vibration and premature bearing wear.",
                "lesson_text": "Always ensure secondary verification of laser alignment values by a senior technician before returning high-criticality pumps to service.",
                "corrective_actions": [
                    "Update pump maintenance SOP to require secondary sign-off on alignment.",
                    "Conduct refresher training on laser alignment tool calibration."
                ],
                "tags": ["P-101A", "bearing", "vibration", "alignment"],
                "severity": "high",
                "created_by": "Reliability-Eng-01"
            },
            {
                "id": "LL-002",
                "title": "Heat exchanger E-103 tube leak from chloride stress corrosion",
                "incident_date": "2024-02-28",
                "equipment_id": "E-103",
                "equipment_name": "Overhead Condenser",
                "failure_type": "Process",
                "root_cause": "Accumulation of chlorides in the overhead circuit combined with temperature excursions during feed changeover.",
                "lesson_text": "Maintain overhead wash water injection rates strictly within the operating window during feed changes.",
                "corrective_actions": [
                    "Automate wash water injection based on chloride content analyzer.",
                    "Inspect E-103 bundle during next turnaround."
                ],
                "tags": ["E-103", "corrosion", "chloride", "leak"],
                "severity": "critical",
                "created_by": "Process-Eng-02"
            },
            {
                "id": "LL-003",
                "title": "CDU column C-101 tray damage during startup",
                "incident_date": "2024-01-20",
                "equipment_id": "C-101",
                "equipment_name": "Crude Distillation Unit",
                "failure_type": "Process",
                "root_cause": "Rapid heating rate caused water pockets to vaporize suddenly (steam explosion), lifting trays 12-15.",
                "lesson_text": "Strict adherence to the 10-degree-per-hour heating curve is critical when crossing the boiling point of water.",
                "corrective_actions": [
                    "Implement hard interlock on furnace heating rate.",
                    "Update startup SOP."
                ],
                "tags": ["C-101", "startup", "steam explosion", "tray damage"],
                "severity": "high",
                "created_by": "Ops-Manager"
            },
            {
                "id": "LL-004",
                "title": "Fire water pump FWP-201 failed to start during drill",
                "incident_date": "2024-04-10",
                "equipment_id": "FWP-201",
                "equipment_name": "Diesel Fire Water Pump",
                "failure_type": "Safety",
                "root_cause": "Dead battery in the starting circuit. Battery charger was inadvertently disconnected.",
                "lesson_text": "Critical safety systems must have local alarms for power loss to auxiliary components.",
                "corrective_actions": [
                    "Install local audible alarm for battery charger power loss.",
                    "Add battery voltage check to daily operator rounds."
                ],
                "tags": ["FWP-201", "safety", "pump", "battery"],
                "severity": "critical",
                "created_by": "Safety-Officer"
            },
            {
                "id": "LL-005",
                "title": "Instrument air compressor K-301 tripped on high discharge temp",
                "incident_date": "2024-03-22",
                "equipment_id": "K-301",
                "equipment_name": "Instrument Air Compressor",
                "failure_type": "Mechanical",
                "root_cause": "Fouling of the intercooler cooling water tubes due to biological growth in the CW system.",
                "lesson_text": "Seasonal changes in cooling water temperature require adjustment of biocide dosing rates.",
                "corrective_actions": [
                    "Review and adjust CW chemical dosing schedule.",
                    "Clean intercooler."
                ],
                "tags": ["K-301", "compressor", "temperature", "fouling"],
                "severity": "medium",
                "created_by": "Utilities-Eng"
            },
            {
                "id": "LL-006",
                "title": "LPG sphere S-101 relief valve PSV-103 failed to reseat",
                "incident_date": "2024-05-05",
                "equipment_id": "S-101",
                "equipment_name": "LPG Storage Sphere",
                "failure_type": "Safety",
                "root_cause": "Debris lodged in the valve seat during a lifting event.",
                "lesson_text": "Piping upstream of safety relief valves must be thoroughly flushed prior to commissioning.",
                "corrective_actions": [
                    "Replace PSV-103.",
                    "Update commissioning procedures for pressure vessels."
                ],
                "tags": ["S-101", "PSV-103", "safety", "valve"],
                "severity": "high",
                "created_by": "Mech-Eng-03"
            },
            {
                "id": "LL-007",
                "title": "Crude oil feed pump P-102B seal leak due to dry running",
                "incident_date": "2024-04-18",
                "equipment_id": "P-102B",
                "equipment_name": "Crude Booster Pump",
                "failure_type": "Mechanical",
                "root_cause": "Operator started pump with the suction valve inadvertently left closed.",
                "lesson_text": "Always verify valve line-up physically before starting high-energy rotating equipment.",
                "corrective_actions": [
                    "Implement pre-startup checklist for all pumps.",
                    "Install suction pressure low-low trip."
                ],
                "tags": ["P-102B", "seal", "leak", "dry run"],
                "severity": "high",
                "created_by": "Ops-Shift-Lead"
            },
            {
                "id": "LL-008",
                "title": "DCS communication failure during CDU unit trip",
                "incident_date": "2024-02-10",
                "equipment_id": "DCS-01",
                "equipment_name": "Distributed Control System",
                "failure_type": "Electrical",
                "root_cause": "Network switch overload due to broadcast storm during the trip event.",
                "lesson_text": "Control networks must be properly segmented to handle peak alarm loads.",
                "corrective_actions": [
                    "Implement network segmentation for DCS switches.",
                    "Review alarm rationalization to reduce flood during trips."
                ],
                "tags": ["DCS-01", "electrical", "network", "trip"],
                "severity": "medium",
                "created_by": "Inst-Eng-01"
            }
        ]

    def get_all_lessons(self) -> List[Dict[str, Any]]:
        return self.lessons

    def search_lessons(self, query: str) -> List[Dict[str, Any]]:
        query = query.lower()
        results = []
        for lesson in self.lessons:
            if (query in lesson["title"].lower() or 
                query in lesson["equipment_id"].lower() or 
                query in lesson["root_cause"].lower() or 
                query in lesson["failure_type"].lower() or 
                any(query in tag.lower() for tag in lesson["tags"])):
                results.append(lesson)
        return results

    def get_lessons_by_equipment(self, equipment_id: str) -> List[Dict[str, Any]]:
        equipment_id = equipment_id.lower()
        return [l for l in self.lessons if equipment_id in l["equipment_id"].lower() or equipment_id in [t.lower() for t in l["tags"]]]

    def add_lesson(self, lesson_data: Dict[str, Any]) -> Dict[str, Any]:
        new_id = f"LL-{len(self.lessons) + 1:03d}"
        lesson_data["id"] = new_id
        if "created_by" not in lesson_data:
            lesson_data["created_by"] = "System"
        if "incident_date" not in lesson_data:
            lesson_data["incident_date"] = datetime.utcnow().strftime("%Y-%m-%d")
        self.lessons.insert(0, lesson_data)
        return lesson_data

    def recommend_lessons(self, query: str) -> List[Dict[str, Any]]:
        # For the hackathon, we combine simple keyword search and return the top 2
        results = self.search_lessons(query)
        # If no direct matches, return the first 2 as a fallback
        if not results:
            results = self.lessons[:2]
            
        # Add a mock 'confidence' score for UI display
        for idx, res in enumerate(results[:2]):
            res["confidence"] = 0.95 - (idx * 0.1)
            
        return results[:2]

lessons_service = LessonsService()
