"""Engagement API endpoints"""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.database import get_db
from app.models.engagement import EngagementLog

router = APIRouter(prefix="/engagement", tags=["Engagement"])


@router.get("/{customer_id}")
async def get_engagement(customer_id: str, db: AsyncSession = Depends(get_db)):
    """Get engagement data for a customer"""
    result = await db.execute(
        select(EngagementLog)
        .where(EngagementLog.customer_id == customer_id)
        .order_by(EngagementLog.timestamp.desc())
        .limit(50)
    )
    logs = result.scalars().all()

    # Channel breakdown
    channel_result = await db.execute(
        select(EngagementLog.channel, func.count(EngagementLog.id))
        .where(EngagementLog.customer_id == customer_id)
        .group_by(EngagementLog.channel)
    )
    channels = {row[0]: row[1] for row in channel_result}

    return {
        "recent_activity": [
            {
                "id": str(l.id),
                "channel": l.channel,
                "action": l.action,
                "page": l.page,
                "device": l.device_type,
                "timestamp": l.timestamp.isoformat() if l.timestamp else None,
            }
            for l in logs
        ],
        "channel_breakdown": channels,
    }


@router.get("/stats/overview")
async def get_engagement_overview(db: AsyncSession = Depends(get_db)):
    """Get overall engagement statistics"""
    total = (await db.execute(select(func.count(EngagementLog.id)))).scalar() or 0

    channel_result = await db.execute(
        select(EngagementLog.channel, func.count(EngagementLog.id))
        .group_by(EngagementLog.channel)
    )
    channels = {row[0]: row[1] for row in channel_result}

    action_result = await db.execute(
        select(EngagementLog.action, func.count(EngagementLog.id))
        .group_by(EngagementLog.action)
        .order_by(func.count(EngagementLog.id).desc())
        .limit(10)
    )
    top_actions = {row[0]: row[1] for row in action_result}

    return {
        "total_engagements": total,
        "channel_distribution": channels,
        "top_actions": top_actions,
    }
