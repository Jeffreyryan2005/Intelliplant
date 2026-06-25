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


class SafetyAgent:
    """
    AI Agent for Safety Analysis. Evaluates procedures for hazards,
    recommends PPE, and assigns risk levels using RAG-augmented LLM.
    """
    AGENT_NAME = "Safety Agent"

    def __init__(self):
        self.settings = get_settings()
        self.groq_client = AsyncGroq(api_key=self.settings.groq_api_key)

    async def analyze_safety(self, procedure_description: str) -> Dict[str, Any]:
        """
        Analyze a procedure description for safety risks.
        Returns structured JSON with hazards, precautions, PPE, and risk level.
        """
        # 1. Gather relevant safety documents via RAG
        query = f"{procedure_description} safety hazard risk PPE precaution permit"
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

        # 2. Prompt LLM for structured safety analysis
        prompt = f"""
        You are an expert Industrial Safety Engineer performing a safety analysis.

        Procedure / Activity Description:
        {procedure_description}

        Relevant Safety Context from Knowledge Base:
        {context_str}

        Analyze the procedure for safety risks. Return your response ONLY as a valid JSON object matching this schema:
        {{
            "hazards": ["Hazard 1", "Hazard 2"],
            "precautions": ["Precaution 1", "Precaution 2"],
            "ppe_required": ["Safety goggles", "Fire-resistant gloves"],
            "risk_level": "low | medium | high"
        }}
        Note: risk_level must be exactly one of: low, medium, high
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
            risk_level = content.get("risk_level", "medium").lower()
            if risk_level not in ("low", "medium", "high"):
                risk_level = "medium"
            return {
                "hazards": content.get("hazards", []),
                "precautions": content.get("precautions", []),
                "ppe_required": content.get("ppe_required", []),
                "risk_level": risk_level,
                "supporting_evidence": [c.model_dump() for c in citations]
            }
        except Exception as e:
            return {
                "hazards": [],
                "precautions": [],
                "ppe_required": [],
                "risk_level": "medium",
                "error": f"Failed to parse safety analysis: {str(e)}"
            }


class PIDAnalysisAgent:
    """
    AI Agent for P&ID (Piping & Instrumentation Diagram) analysis.
    Extracts equipment, instruments, connections, and process descriptions
    from textual descriptions of P&ID drawings.
    """
    AGENT_NAME = "P&ID Analysis Agent"

    def __init__(self):
        self.settings = get_settings()
        self.groq_client = AsyncGroq(api_key=self.settings.groq_api_key)

    async def analyze_pid_description(self, text_description: str) -> Dict[str, Any]:
        """
        Analyze text extracted from a P&ID drawing and identify
        equipment, connections, and instrumentation.
        """
        # 1. Optional RAG enrichment — look for related equipment docs
        query = f"{text_description} P&ID piping instrumentation equipment"
        search_results = rag_pipeline.search(query, n_results=3)

        context_parts = []
        for res in search_results:
            meta = res["metadata"]
            text = res["text"]
            filename = meta.get("filename", "Unknown")
            context_parts.append(f"Source: {filename}\n{text}\n")

        context_str = "\n".join(context_parts) if context_parts else "No additional context available."

        # 2. Prompt LLM for structured extraction
        prompt = f"""
        You are an expert Process Engineer specializing in reading P&ID diagrams.

        Text extracted from a P&ID drawing:
        {text_description}

        Additional context from Knowledge Base:
        {context_str}

        Identify all equipment, instruments, connections, and provide a brief process description.
        Return your response ONLY as a valid JSON object matching this schema:
        {{
            "equipment": [
                {{"tag": "P-101A", "type": "Centrifugal Pump", "description": "Feed pump for CDU"}},
            ],
            "instruments": [
                {{"tag": "FIC-101", "type": "Flow Indicating Controller", "description": "Controls feed flow"}},
            ],
            "connections": [
                {{"from": "P-101A", "to": "E-101", "type": "Process Line", "spec": "6\\" CS"}},
            ],
            "process_description": "A brief paragraph describing the process flow shown in the P&ID."
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
            max_tokens=1500
        )

        try:
            content = json.loads(response.choices[0].message.content)
            return {
                "equipment": content.get("equipment", []),
                "instruments": content.get("instruments", []),
                "connections": content.get("connections", []),
                "process_description": content.get("process_description", "")
            }
        except Exception as e:
            return {
                "equipment": [],
                "instruments": [],
                "connections": [],
                "process_description": f"Failed to parse P&ID analysis: {str(e)}"
            }


class AgentOrchestrator:
    """
    Multi-agent orchestrator that routes incoming queries to the appropriate
    specialist agent using a lightweight keyword classifier (no LLM cost).
    """

    # Keyword → agent mapping. Order matters: first match wins.
    ROUTING_TABLE = [
        {
            "keywords": ["rca", "failure", "breakdown", "repair", "vibration",
                         "troubleshoot", "root cause", "malfunction", "bearing"],
            "agent_name": "Maintenance Agent",
            "agent_key": "maintenance",
        },
        {
            "keywords": ["compliance", "regulation", "oisd", "audit", "gap",
                         "non-compliant", "asme", "statutory", "inspection"],
            "agent_name": "Compliance Agent",
            "agent_key": "compliance",
        },
        {
            "keywords": ["safety", "hazard", "ppe", "risk", "permit",
                         "work permit", "fire", "loto", "lockout", "tagout"],
            "agent_name": "Safety Agent",
            "agent_key": "safety",
        },
        {
            "keywords": ["p&id", "pid", "diagram", "piping", "instrument",
                         "instrumentation", "process flow", "line diagram"],
            "agent_name": "P&ID Analysis Agent",
            "agent_key": "pid",
        },
    ]

    def __init__(self):
        self.agents = {
            "maintenance": MaintenanceAgent(),
            "compliance": ComplianceAgent(),
            "safety": SafetyAgent(),
            "pid": PIDAnalysisAgent(),
        }

    def route_query(self, query: str) -> Dict[str, str]:
        """
        Determine which agent should handle a query using keyword matching.
        Returns {"agent_name": "...", "agent_key": "..."}.
        """
        query_lower = query.lower()
        for route in self.ROUTING_TABLE:
            if any(kw in query_lower for kw in route["keywords"]):
                return {
                    "agent_name": route["agent_name"],
                    "agent_key": route["agent_key"],
                }
        # Default — general RAG copilot
        return {
            "agent_name": "General Copilot",
            "agent_key": "general",
        }

    async def execute(self, query: str, context: dict = None) -> Dict[str, Any]:
        """
        Route a query to the appropriate agent and return the result
        together with agent metadata.
        """
        context = context or {}
        routing = self.route_query(query)
        agent_key = routing["agent_key"]
        agent_name = routing["agent_name"]

        try:
            if agent_key == "maintenance":
                agent: MaintenanceAgent = self.agents["maintenance"]
                result = await agent.perform_rca(
                    equipment_id=context.get("equipment_id", "UNKNOWN"),
                    equipment_name=context.get("equipment_name", "Unknown Equipment"),
                    failure_description=query,
                )
                return {
                    "agent_name": agent_name,
                    "agent_key": agent_key,
                    "result": result.model_dump() if hasattr(result, "model_dump") else result,
                }

            elif agent_key == "compliance":
                agent: ComplianceAgent = self.agents["compliance"]
                gaps = await agent.identify_gaps()
                return {
                    "agent_name": agent_name,
                    "agent_key": agent_key,
                    "result": [g.model_dump() for g in gaps],
                }

            elif agent_key == "safety":
                agent: SafetyAgent = self.agents["safety"]
                result = await agent.analyze_safety(procedure_description=query)
                return {
                    "agent_name": agent_name,
                    "agent_key": agent_key,
                    "result": result,
                }

            elif agent_key == "pid":
                agent: PIDAnalysisAgent = self.agents["pid"]
                result = await agent.analyze_pid_description(text_description=query)
                return {
                    "agent_name": agent_name,
                    "agent_key": agent_key,
                    "result": result,
                }

            else:
                # General copilot — delegate to RAG pipeline
                result = await rag_pipeline.generate_chat_response(query)
                return {
                    "agent_name": agent_name,
                    "agent_key": agent_key,
                    "result": {
                        "answer": result["answer"],
                        "citations": [c.model_dump() for c in result["citations"]],
                        "suggested_followups": result["suggested_followups"],
                    },
                }
        except Exception as e:
            return {
                "agent_name": agent_name,
                "agent_key": agent_key,
                "error": str(e),
            }


# Singleton instances
maintenance_agent = MaintenanceAgent()
compliance_agent = ComplianceAgent()
safety_agent = SafetyAgent()
pid_analysis_agent = PIDAnalysisAgent()
orchestrator = AgentOrchestrator()
