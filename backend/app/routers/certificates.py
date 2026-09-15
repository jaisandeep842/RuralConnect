from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.database import get_database
from app.models.schemas import CertificateResponse
from app.routers.deps import get_current_user

router = APIRouter(prefix="/api/certificates", tags=["Certificates"])

@router.get("", response_model=List[CertificateResponse])
async def list_certificates(current_user: dict = Depends(get_current_user)):
    db = get_database()
    certs = await db.certificates.find({"user_id": current_user["_id"]}).to_list(100)
    results = []
    for c in certs:
        results.append(CertificateResponse(
            id=c["_id"],
            user_id=c["user_id"],
            user_name=c.get("user_name", current_user.get("full_name", "")),
            course_or_training_title=c.get("course_or_training_title", ""),
            certificate_number=c.get("certificate_number", ""),
            issue_date=c.get("issue_date", ""),
            cert_type=c.get("cert_type", "Course Completion"),
            verification_url=c.get("verification_url", "")
        ))
    return results

@router.get("/{cert_id}", response_model=CertificateResponse)
async def get_certificate(cert_id: str):
    db = get_database()
    c = await db.certificates.find_one({
        "$or": [{"_id": cert_id}, {"certificate_number": cert_id}]
    })
    if not c:
        raise HTTPException(status_code=404, detail="Certificate not found or invalid certificate ID.")
    return CertificateResponse(
        id=c["_id"],
        user_id=c["user_id"],
        user_name=c.get("user_name", ""),
        course_or_training_title=c.get("course_or_training_title", ""),
        certificate_number=c.get("certificate_number", ""),
        issue_date=c.get("issue_date", ""),
        cert_type=c.get("cert_type", "Course Completion"),
        verification_url=c.get("verification_url", "")
    )
