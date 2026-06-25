import uuid
import json
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

from app.models.schemas import SuccessResponse, ChatRequest, ChatResponse, SuggestedQuestion
from app.services.rag_pipeline import rag_pipeline
from app.services.agents import orchestrator

router = APIRouter(prefix="/copilot", tags=["Copilot"])

# In-memory conversation history (for hackathon)
conversation_store = {}


async def _streaming_with_agent(query: str, history: list):
    """Wrap the RAG streaming generator with an agent identification event."""
    # Emit agent routing info before anything else
    routing = orchestrator.route_query(query)
    yield f"data: {json.dumps({'type': 'agent', 'agent_name': routing['agent_name']})}\n\n"

    # Then stream citations + LLM chunks from the RAG pipeline
    async for event in rag_pipeline.stream_chat_response(query, history):
        yield event


@router.post("/chat")
async def chat_with_copilot(request: ChatRequest):
    """
    Chat endpoint for IntelliPlant Copilot.
    Uses SSE for streaming responses if a stream query param is True,
    but standard FastAPI pattern usually returns StreamingResponse directly.
    We'll assume frontend handles SSE.
    """
    conv_id = request.conversation_id or str(uuid.uuid4())
    
    if conv_id not in conversation_store:
        conversation_store[conv_id] = []
        
    history = conversation_store[conv_id]
    
    # Return streaming response with agent routing
    return StreamingResponse(
        _streaming_with_agent(request.query, history),
        media_type="text/event-stream"
    )


@router.post("/chat/fallback", response_model=SuccessResponse)
async def chat_fallback(request: ChatRequest):
    """Non-streaming fallback for chat."""
    conv_id = request.conversation_id or str(uuid.uuid4())
    if conv_id not in conversation_store:
        conversation_store[conv_id] = []
        
    history = conversation_store[conv_id]
    
    result = await rag_pipeline.generate_chat_response(request.query, history)
    
    # Update history
    conversation_store[conv_id].append({"role": "user", "content": request.query})
    conversation_store[conv_id].append({"role": "assistant", "content": result["answer"]})
    
    return SuccessResponse(data={
        "answer": result["answer"],
        "citations": [c.model_dump() for c in result["citations"]],
        "conversation_id": conv_id,
        "suggested_followups": result["suggested_followups"]
    })

@router.get("/suggestions", response_model=SuccessResponse)
async def get_suggestions():
    """Get dynamic suggestions based on ingested data."""
    suggestions = [
        SuggestedQuestion(question="What are the recent failures for pump P-101A?", category="Maintenance"),
        SuggestedQuestion(question="Show me the startup procedure for the CDU Atmospheric Column.", category="Operations"),
        SuggestedQuestion(question="Are there any compliance gaps in OISD-117?", category="Compliance"),
        SuggestedQuestion(question="What is the root cause of the heat exchanger leak?", category="Troubleshooting")
    ]
    return SuccessResponse(data=[s.model_dump() for s in suggestions])
