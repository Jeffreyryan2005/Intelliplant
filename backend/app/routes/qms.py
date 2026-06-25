from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any, List
from app.services.qms import qms_service

router = APIRouter()

@router.get("/dashboard")
async def get_dashboard() -> Dict[str, Any]:
    stats = qms_service.get_dashboard_stats()
    return {"success": True, "data": stats}

@router.get("/capas")
async def list_capas() -> Dict[str, Any]:
    capas = qms_service.list_capas()
    return {"success": True, "data": capas}

@router.post("/capas")
async def create_capa(capa_data: Dict[str, Any]) -> Dict[str, Any]:
    new_capa = qms_service.create_capa(capa_data)
    return {"success": True, "data": new_capa}

@router.get("/audit-trail")
async def get_audit_trail() -> Dict[str, Any]:
    trail = qms_service.get_audit_trail()
    return {"success": True, "data": trail}

@router.get("/mocs")
async def list_mocs() -> Dict[str, Any]:
    mocs = qms_service.list_mocs()
    return {"success": True, "data": mocs}

@router.post("/mocs")
async def create_moc(moc_data: Dict[str, Any]) -> Dict[str, Any]:
    new_moc = qms_service.create_moc(moc_data)
    return {"success": True, "data": new_moc}
