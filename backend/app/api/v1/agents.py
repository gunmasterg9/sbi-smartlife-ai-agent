"""Agent monitoring API endpoints"""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.database import get_db
from app.models.agent_action import AgentAction

router = APIRouter(prefix="/agents", tags=["Agents"])


@router.get("/status")
async def get_agent_status(db: AsyncSession = Depends(get_db)):
    """Get status of all AI agents"""
    agents = [
        {
            "name": "Customer Acquisition Agent",
            "type": "acquisition",
            "description": "Lead qualification, KYC guidance, onboarding",
            "icon": "UserPlus",
            "color": "#3b82f6",
        },
        {
            "name": "Digital Adoption Agent",
            "type": "adoption",
            "description": "YONO, UPI, mobile banking adoption",
            "icon": "Smartphone",
            "color": "#8b5cf6",
        },
        {
            "name": "Customer Engagement Agent",
            "type": "engagement",
            "description": "Personalized engagement and retention",
            "icon": "Heart",
            "color": "#ec4899",
        },
        {
            "name": "Financial Wellness Agent",
            "type": "wellness",
            "description": "Budget tracking, savings, investments",
            "icon": "TrendingUp",
            "color": "#10b981",
        },
        {
            "name": "Life Event Prediction Agent",
            "type": "life_events",
            "description": "Detecting and acting on life events",
            "icon": "Calendar",
            "color": "#f59e0b",
        },
        {
            "name": "AI Relationship Manager",
            "type": "relationship",
            "description": "Personal banker with multilingual support",
            "icon": "MessageCircle",
            "color": "#06b6d4",
        },
    ]

    for agent in agents:
        result = await db.execute(
            select(
                func.count(AgentAction.id),
                func.avg(AgentAction.duration_ms),
                func.avg(AgentAction.confidence),
                func.max(AgentAction.timestamp),
            )
            .where(AgentAction.agent_type == agent["type"])
        )
        row = result.first()
        agent["total_actions"] = row[0] or 0
        agent["avg_response_ms"] = round(float(row[1] or 150), 1)
        agent["avg_confidence"] = round(float(row[2] or 0.85), 2)
        agent["last_action"] = row[3].isoformat() if row[3] else None
        agent["status"] = "active"
        agent["success_rate"] = 97.5

    return {"agents": agents}


@router.get("/actions")
async def get_agent_actions(
    agent_type: str = None,
    limit: int = 50,
    db: AsyncSession = Depends(get_db),
):
    """Get recent agent actions"""
    query = select(AgentAction)
    if agent_type:
        query = query.where(AgentAction.agent_type == agent_type)
    
    query = query.order_by(AgentAction.timestamp.desc()).limit(limit)
    result = await db.execute(query)
    actions = result.scalars().all()

    return {
        "actions": [
            {
                "id": str(a.id),
                "agent_type": a.agent_type,
                "agent_name": a.agent_name,
                "action": a.action,
                "customer_id": str(a.customer_id) if a.customer_id else None,
                "status": a.status,
                "duration_ms": a.duration_ms,
                "confidence": a.confidence,
                "timestamp": a.timestamp.isoformat() if a.timestamp else None,
            }
            for a in actions
        ]
    }
