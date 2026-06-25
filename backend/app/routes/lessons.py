from fastapi import APIRouter, Query, Path
from typing import Dict, Any, List, Optional
from app.services.lessons import lessons_service

router = APIRouter()

@router.get("/")
async def list_lessons(search: Optional[str] = Query(None, description="Search term")) -> Dict[str, Any]:
    if search:
        lessons = lessons_service.search_lessons(search)
    else:
        lessons = lessons_service.get_all_lessons()
    return {"success": True, "data": lessons}

@router.get("/recommend/{query}")
async def recommend_lessons(query: str = Path(..., description="Failure description to match")) -> Dict[str, Any]:
    recommendations = lessons_service.recommend_lessons(query)
    return {"success": True, "data": recommendations}

@router.get("/equipment/{equipment_id}")
async def get_lessons_by_equipment(equipment_id: str = Path(...)) -> Dict[str, Any]:
    lessons = lessons_service.get_lessons_by_equipment(equipment_id)
    return {"success": True, "data": lessons}

@router.get("/{lesson_id}")
async def get_lesson(lesson_id: str = Path(...)) -> Dict[str, Any]:
    all_lessons = lessons_service.get_all_lessons()
    for lesson in all_lessons:
        if lesson["id"] == lesson_id:
            return {"success": True, "data": lesson}
    return {"success": False, "error": "Lesson not found"}

@router.post("/")
async def create_lesson(lesson_data: Dict[str, Any]) -> Dict[str, Any]:
    new_lesson = lessons_service.add_lesson(lesson_data)
    return {"success": True, "data": new_lesson}
