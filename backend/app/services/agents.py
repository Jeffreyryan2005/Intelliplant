import json
from typing import List, Dict, Any

from groq import AsyncGroq

from app.config import get_settings
from app.models.schemas import RCAResult, Citation, ComplianceGap, SeverityLevel, ComplianceStatus
from app.services.rag_pipeline import rag_pipeline

class MaintenanceAgent:
    """
    AI Agent for Maintenance tasks. Performs Root Cause Analysis (RCA) 
    by analyzing equipment history, logs, and manuals.
    """
    def __init__(self):
        self.settings = get_settings()
        self.groq_client = AsyncGroq(api_key=self.settings.groq_api_key)

    async def perform_rca(self, equipment_id: str, equipment_name: str, failure_description: str) -> RCAResult:
        """
        Run an RCA on a specific equipment failure.
        """
        # 1. Gather context from RAG
        query = f"{equipment_id} {equipment_name} {failure_description} troubleshooting maintenance"
        search_results = rag_pipeline.search(query, n_results=5)
        
        context_parts = []
        citations = []
        for res in search_results:
            meta = res["metadata"]
            text = res["text"]
            filename = meta.get("filename", "Unknown")
            context_parts.append(f"Source: {filename}\n{text}\n")
            
            citations.append(Citation(
                document=filename,
                section=meta.get("section", ""),
                relevance_score=res["score"],
                text_snippet=text[:100] + "..."
            ))
            
        context_str = "\n".join(context_parts)
        
        # 2. Prompt for structured RCA
        prompt = f"""
        You are an expert Reliability Engineer performing a Root Cause Analysis (RCA).
        
        Equipment: {equipment_id} ({equipment_name})
        Issue/Failure: {failure_description}
        
        Relevant Context from Knowledge Base:
        {context_str}
        
        Based on the context provided, perform an RCA.
        Return your response ONLY as a valid JSON object matching this schema:
        {{
            "analysis": "A paragraph explaining the failure mechanism.",
            "root_causes": ["Cause 1", "Cause 2"],
            "recommendations": ["Rec 1", "Rec 2"],
            "confidence": 0.85
        }}
        """
        
        response = await self.groq_client.chat.completions.create(
            model=self.settings.llm_chat_model,
            messages=[
                {"role": "system", "content": "You are an AI assistant that only outputs valid JSON."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"},
            temperature=0.2,
            max_tokens=1000
        )
        
        try:
            content = json.loads(response.choices[0].message.content)
            return RCAResult(
                equipment_id=equipment_id,
                equipment_name=equipment_name,
                analysis=content.get("analysis", "Analysis could not be generated."),
                root_causes=content.get("root_causes", []),
                recommendations=content.get("recommendations", []),
                confidence=content.get("confidence", 0.5),
                supporting_evidence=citations
            )
        except Exception as e:
            return RCAResult(
                equipment_id=equipment_id,
                equipment_name=equipment_name,
                analysis=f"Failed to parse RCA response. Error: {str(e)}",
                confidence=0.0
            )


class ComplianceAgent:
    """
    AI Agent for Compliance tasks. Identifies gaps based on recent audits
    and cross-references with regulatory standards.
    """
    def __init__(self):
        self.settings = get_settings()
        self.groq_client = AsyncGroq(api_key=self.settings.groq_api_key)

    async def identify_gaps(self) -> List[ComplianceGap]:
        """
        Query the RAG pipeline for audit reports and identify compliance gaps.
        """
        query = "non-compliant partial audit findings regulation OISD ASME"
        search_results = rag_pipeline.search(query, n_results=6)
        
        context_parts = []
        for res in search_results:
            context_parts.append(f"Document: {res['metadata'].get('filename', 'Unknown')}\nText: {res['text']}\n")
            
        context_str = "\n".join(context_parts)
        
        prompt = f"""
        You are a strict Industrial Compliance Auditor. Review the provided context 
        which contains extracts from safety and compliance audits.
        
        Context:
        {context_str}
        
        Identify all compliance gaps, non-compliances, or partial compliances.
        Return your response ONLY as a valid JSON object matching this schema:
        {{
            "gaps": [
                {{
                    "gap_id": "GAP-001",
                    "regulation": "OISD-117",
                    "description": "Hydrant pressure low",
                    "severity": "high",
                    "affected_equipment": ["H-204"],
                    "recommendation": "Flush header",
                    "status": "non_compliant"
                }}
            ]
        }}
        Note: severity must be one of: low, medium, high, critical
        status must be one of: non_compliant, partial
        """
        
        response = await self.groq_client.chat.completions.create(
            model=self.settings.llm_chat_model,
            messages=[
                {"role": "system", "content": "You are an AI assistant that only outputs valid JSON."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"},
            temperature=0.1,
            max_tokens=1500
        )
        
        try:
            content = json.loads(response.choices[0].message.content)
            gaps_data = content.get("gaps", [])
            
            gaps = []
            for g in gaps_data:
                gaps.append(ComplianceGap(
                    gap_id=g.get("gap_id", "GAP-UNKNOWN"),
                    regulation=g.get("regulation", "Unknown"),
                    description=g.get("description", ""),
                    severity=SeverityLevel(g.get("severity", "medium").lower()),
                    affected_equipment=g.get("affected_equipment", []),
                    recommendation=g.get("recommendation", ""),
                    status=ComplianceStatus(g.get("status", "non_compliant").lower())
                ))
            return gaps
        except Exception as e:
            print(f"Error parsing compliance gaps: {e}")
            return []

# Singleton instances
maintenance_agent = MaintenanceAgent()
compliance_agent = ComplianceAgent()
