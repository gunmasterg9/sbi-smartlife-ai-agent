"""Compliance API endpoints"""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.database import get_db
from app.models.audit_log import AuditLog
from app.models.kyc_document import KYCDocument
from app.models.customer import CustomerProfile

router = APIRouter(prefix="/compliance", tags=["Compliance"])


@router.get("/audit-trail")
async def get_audit_trail(
    page: int = 1,
    page_size: int = 50,
    risk_level: str = None,
    db: AsyncSession = Depends(get_db),
):
    """Get audit trail for compliance"""
    query = select(AuditLog)
    if risk_level:
        query = query.where(AuditLog.risk_level == risk_level)
    
    query = query.order_by(AuditLog.timestamp.desc()).offset((page - 1) * page_size).limit(page_size)
    result = await db.execute(query)
    logs = result.scalars().all()

    return {
        "audit_logs": [
            {
                "id": str(l.id),
                "action": l.action,
                "resource_type": l.resource_type,
                "status": l.status,
                "risk_level": l.risk_level,
                "ip_address": l.ip_address,
                "timestamp": l.timestamp.isoformat() if l.timestamp else None,
            }
            for l in logs
        ]
    }


@router.get("/kyc-status")
async def get_kyc_status(db: AsyncSession = Depends(get_db)):
    """Get KYC verification status overview"""
    result = await db.execute(
        select(KYCDocument.status, func.count(KYCDocument.id))
        .group_by(KYCDocument.status)
    )
    status_dist = {row[0]: row[1] for row in result}

    total_customers = (await db.execute(select(func.count(CustomerProfile.id)))).scalar() or 0
    kyc_complete = (await db.execute(
        select(func.count(CustomerProfile.id)).where(CustomerProfile.kyc_status == "verified")
    )).scalar() or 0

    return {
        "total_customers": total_customers,
        "kyc_completed": kyc_complete,
        "kyc_rate": round((kyc_complete / total_customers * 100), 1) if total_customers > 0 else 0,
        "document_status": status_dist,
    }


@router.get("/compliance-checklist")
async def get_compliance_checklist():
    """Get regulatory compliance checklist"""
    return {
        "checklist": [
            {"id": 1, "regulation": "RBI KYC Guidelines 2025", "status": "compliant", "last_audit": "2026-06-01", "details": "Full e-KYC and Video KYC supported"},
            {"id": 2, "regulation": "DPDP Act 2023", "status": "compliant", "last_audit": "2026-05-15", "details": "Consent management and data minimization implemented"},
            {"id": 3, "regulation": "RBI Data Localization", "status": "compliant", "last_audit": "2026-06-10", "details": "All data stored on Indian servers"},
            {"id": 4, "regulation": "PCI-DSS Compliance", "status": "compliant", "last_audit": "2026-04-20", "details": "Card data encryption and tokenization active"},
            {"id": 5, "regulation": "RBI IT Governance Framework", "status": "compliant", "last_audit": "2026-05-01", "details": "IT risk management framework implemented"},
            {"id": 6, "regulation": "SEBI AI/ML Guidelines", "status": "compliant", "last_audit": "2026-06-05", "details": "Explainable AI for all recommendations"},
            {"id": 7, "regulation": "AML/CFT Guidelines", "status": "compliant", "last_audit": "2026-05-20", "details": "Transaction monitoring and suspicious activity reporting"},
            {"id": 8, "regulation": "Cyber Security Framework", "status": "compliant", "last_audit": "2026-06-15", "details": "SOC monitoring, incident response, and encryption"},
        ]
    }
