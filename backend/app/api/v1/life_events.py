"""Life Events API endpoints"""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.database import get_db
from app.models.life_event import LifeEvent

router = APIRouter(prefix="/life-events", tags=["Life Events"])


@router.get("/{customer_id}")
async def get_life_events(customer_id: str, db: AsyncSession = Depends(get_db)):
    """Get detected life events for a customer"""
    result = await db.execute(
        select(LifeEvent)
        .where(LifeEvent.customer_id == customer_id)
        .order_by(LifeEvent.detected_at.desc())
    )
    events = result.scalars().all()

    return {
        "events": [
            {
                "id": str(e.id),
                "event_type": e.event_type.value if e.event_type else None,
                "description": e.description,
                "confidence": e.confidence_score,
                "detection_method": e.detection_method,
                "evidence": e.evidence,
                "action_taken": e.action_taken,
                "recommendations": e.recommendations_generated,
                "detected_at": e.detected_at.isoformat() if e.detected_at else None,
            }
            for e in events
        ]
    }


@router.get("/stats/overview")
async def get_life_event_stats(db: AsyncSession = Depends(get_db)):
    """Get life event detection statistics"""
    result = await db.execute(
        select(LifeEvent.event_type, func.count(LifeEvent.id))
        .group_by(LifeEvent.event_type)
    )
    type_dist = {row[0].value if row[0] else "unknown": row[1] for row in result}

    total = (await db.execute(select(func.count(LifeEvent.id)))).scalar() or 0
    avg_confidence = (await db.execute(select(func.avg(LifeEvent.confidence_score)))).scalar() or 0

    return {
        "total_events": total,
        "average_confidence": round(float(avg_confidence), 2),
        "type_distribution": type_dist,
    }
