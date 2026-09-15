from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.database import get_database
from app.models.schemas import SchemeResponse

router = APIRouter(prefix="/api/schemes", tags=["Government Schemes"])

@router.get("", response_model=List[SchemeResponse])
async def list_schemes(
    search: Optional[str] = None,
    category: Optional[str] = None,
    verified_only: Optional[bool] = None
):
    db = get_database()
    query = {}
    if search:
        query["$or"] = [
            {"scheme_name": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}},
            {"target_users": {"$regex": search, "$options": "i"}},
            {"category": {"$regex": search, "$options": "i"}}
        ]
    if category and category != "All":
        query["category"] = category
    if verified_only is True:
        query["is_verified"] = True
        
    schemes = await db.government_schemes.find(query).to_list(100)
    results = []
    for s in schemes:
        s["id"] = s.pop("_id")
        results.append(SchemeResponse(**s))
    return results

@router.get("/{scheme_id}", response_model=SchemeResponse)
async def get_scheme(scheme_id: str):
    db = get_database()
    s = await db.government_schemes.find_one({"_id": scheme_id})
    if not s:
        raise HTTPException(status_code=404, detail="Government scheme not found.")
    s["id"] = s.pop("_id")
    return SchemeResponse(**s)
