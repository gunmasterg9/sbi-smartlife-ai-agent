"""Digital Twin API endpoints"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.digital_twin import DigitalTwin
from app.schemas.schemas import DigitalTwinResponse

router = APIRouter(prefix="/digital-twin", tags=["Digital Twin"])


@router.get("/{customer_id}", response_model=DigitalTwinResponse)
async def get_digital_twin(customer_id: str, db: AsyncSession = Depends(get_db)):
    """Get customer's digital twin profile"""
    result = await db.execute(
        select(DigitalTwin).where(DigitalTwin.customer_id == customer_id)
    )
    twin = result.scalar_one_or_none()
    if not twin:
        raise HTTPException(status_code=404, detail="Digital twin not found")
    return DigitalTwinResponse.model_validate(twin)


@router.get("/{customer_id}/predictions")
async def get_predictions(customer_id: str, db: AsyncSession = Depends(get_db)):
    """Get AI predictions for a customer"""
    result = await db.execute(
        select(DigitalTwin).where(DigitalTwin.customer_id == customer_id)
    )
    twin = result.scalar_one_or_none()
    if not twin:
        raise HTTPException(status_code=404, detail="Digital twin not found")

    return {
        "customer_id": str(customer_id),
        "predicted_needs": twin.predicted_needs or [],
        "predicted_life_events": twin.predicted_life_events or [],
        "investment_affinity": twin.investment_affinity or {},
        "churn_probability": twin.churn_probability,
        "risk_score": twin.risk_score,
        "confidence": twin.confidence,
    }


@router.get("/")
async def list_digital_twins(
    limit: int = 20,
    db: AsyncSession = Depends(get_db),
):
    """List all digital twins with scores"""
    result = await db.execute(select(DigitalTwin).limit(limit))
    twins = result.scalars().all()
    return {
        "twins": [
            {
                "customer_id": str(t.customer_id),
                "financial_health_score": t.financial_health_score,
                "risk_score": t.risk_score,
                "engagement_score": t.engagement_score,
                "churn_probability": t.churn_probability,
                "digital_maturity_score": t.digital_maturity_score,
            }
            for t in twins
        ]
    }
