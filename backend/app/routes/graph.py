from fastapi import APIRouter, HTTPException

from app.models.schemas import SuccessResponse, GraphData, NodeDetail
from app.services.knowledge_graph import knowledge_graph

router = APIRouter(prefix="/graph", tags=["Knowledge Graph"])

@router.get("", response_model=SuccessResponse)
async def get_full_graph():
    """Get the full knowledge graph (nodes and edges)."""
    data = knowledge_graph.get_graph_data()
    return SuccessResponse(data=data.model_dump())

@router.get("/search", response_model=SuccessResponse)
async def search_graph(query: str):
    """Search for nodes in the graph by label or ID."""
    nodes = knowledge_graph.search_nodes(query)
    return SuccessResponse(data=[n.model_dump() for n in nodes])

@router.get("/node/{node_id}", response_model=SuccessResponse)
async def get_node_detail(node_id: str):
    """Get a specific node and its connected neighbours."""
    detail = knowledge_graph.get_node_details(node_id)
    if not detail:
        raise HTTPException(status_code=404, detail="Node not found in graph")
    return SuccessResponse(data=detail.model_dump())
