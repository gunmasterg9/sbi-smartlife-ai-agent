"""Recommendations API endpoints"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import Optional
from app.database import get_db
from app.models.recommendation import Recommendation, RecommendationStatus
from app.schemas.schemas import RecommendationResponse

router = APIRouter(prefix="/recommendations", tags=["Recommendations"])


@router.get("/{customer_id}")
async def get_recommendations(
    customer_id: str,
    status: Optional[str] = None,
    limit: int = 20,
    db: AsyncSession = Depends(get_db),
):
    """Get personalized recommendations for a customer"""
    query = select(Recommendation).where(Recommendation.customer_id == customer_id)
    
    if status:
        query = query.where(Recommendation.status == status)
    
    query = query.order_by(Recommendation.match_score.desc()).limit(limit)
    result = await db.execute(query)
    recs = result.scalars().all()

    return {
        "recommendations": [
            {
                "id": str(r.id),
                "type": r.recommendation_type.value if r.recommendation_type else None,
                "title": r.title,
                "description": r.description,
                "reasoning": r.reasoning,
                "match_score": r.match_score,
                "priority": r.priority,
                "status": r.status.value if r.status else None,
                "agent_type": r.agent_type,
                "product_details": r.product_details,
                "created_at": r.created_at.isoformat() if r.created_at else None,
            }
            for r in recs
        ]
    }


@router.post("/{recommendation_id}/accept")
async def accept_recommendation(recommendation_id: str, db: AsyncSession = Depends(get_db)):
    """Accept a recommendation"""
    result = await db.execute(
        select(Recommendation).where(Recommendation.id == recommendation_id)
    )
    rec = result.scalar_one_or_none()
    if not rec:
        raise HTTPException(status_code=404, detail="Recommendation not found")
    
    rec.status = RecommendationStatus.ACCEPTED
    from datetime import datetime
    rec.acted_at = datetime.utcnow()
    await db.commit()
    return {"status": "accepted", "id": str(rec.id)}


@router.post("/{recommendation_id}/reject")
async def reject_recommendation(recommendation_id: str, db: AsyncSession = Depends(get_db)):
    """Reject a recommendation"""
    result = await db.execute(
        select(Recommendation).where(Recommendation.id == recommendation_id)
    )
    rec = result.scalar_one_or_none()
    if not rec:
        raise HTTPException(status_code=404, detail="Recommendation not found")
    
    rec.status = RecommendationStatus.REJECTED
    await db.commit()
    return {"status": "rejected", "id": str(rec.id)}


@router.get("/stats/overview")
async def get_recommendation_stats(db: AsyncSession = Depends(get_db)):
    """Get recommendation statistics"""
    result = await db.execute(
        select(Recommendation.status, func.count(Recommendation.id))
        .group_by(Recommendation.status)
    )
    stats = {row[0].value if row[0] else "unknown": row[1] for row in result}
    
    # Type distribution
    type_result = await db.execute(
        select(Recommendation.recommendation_type, func.count(Recommendation.id))
        .group_by(Recommendation.recommendation_type)
    )
    type_dist = {row[0].value if row[0] else "unknown": row[1] for row in type_result}
    
    return {"status_distribution": stats, "type_distribution": type_dist}
