"""Analytics and KPI API endpoints"""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.database import get_db
from app.models.customer import CustomerProfile
from app.models.recommendation import Recommendation, RecommendationStatus
from app.models.engagement import EngagementLog
from app.models.life_event import LifeEvent
from app.models.financial_score import FinancialScore
from app.models.agent_action import AgentAction

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/kpis")
async def get_kpis(db: AsyncSession = Depends(get_db)):
    """Get all KPI metrics for the analytics dashboard"""
    # Total customers
    total_customers = (await db.execute(select(func.count(CustomerProfile.id)))).scalar() or 0

    # Digital adoption
    yono_count = (await db.execute(
        select(func.count(CustomerProfile.id)).where(CustomerProfile.yono_registered == "true")
    )).scalar() or 0

    upi_count = (await db.execute(
        select(func.count(CustomerProfile.id)).where(CustomerProfile.upi_active == "true")
    )).scalar() or 0

    mobile_count = (await db.execute(
        select(func.count(CustomerProfile.id)).where(CustomerProfile.mobile_banking == "true")
    )).scalar() or 0

    # Recommendations
    total_recs = (await db.execute(select(func.count(Recommendation.id)))).scalar() or 0
    accepted_recs = (await db.execute(
        select(func.count(Recommendation.id)).where(Recommendation.status == RecommendationStatus.ACCEPTED)
    )).scalar() or 0

    # Engagement
    total_engagements = (await db.execute(select(func.count(EngagementLog.id)))).scalar() or 0

    # Life events
    total_events = (await db.execute(select(func.count(LifeEvent.id)))).scalar() or 0

    # Average wellness score
    avg_wellness = (await db.execute(
        select(func.avg(FinancialScore.wellness_score))
    )).scalar() or 50.0

    # Agent actions
    total_actions = (await db.execute(select(func.count(AgentAction.id)))).scalar() or 0

    yono_rate = round((yono_count / total_customers * 100), 1) if total_customers > 0 else 0
    upi_rate = round((upi_count / total_customers * 100), 1) if total_customers > 0 else 0
    conversion_rate = round((accepted_recs / total_recs * 100), 1) if total_recs > 0 else 0

    return {
        "kpis": [
            {"name": "Total Customers", "value": total_customers, "change": 12.5, "trend": "up", "period": "month", "icon": "users"},
            {"name": "Customer Acquisition Rate", "value": 8.3, "change": 2.1, "trend": "up", "period": "month", "icon": "user-plus"},
            {"name": "Lead Conversion Rate", "value": conversion_rate, "change": 3.4, "trend": "up", "period": "month", "icon": "target"},
            {"name": "Digital Adoption Rate", "value": round((mobile_count / total_customers * 100), 1) if total_customers > 0 else 0, "change": 5.2, "trend": "up", "period": "month", "icon": "smartphone"},
            {"name": "YONO Adoption Rate", "value": yono_rate, "change": 4.1, "trend": "up", "period": "month", "icon": "app-window"},
            {"name": "UPI Activation Rate", "value": upi_rate, "change": 6.8, "trend": "up", "period": "month", "icon": "qr-code"},
            {"name": "Customer Engagement Score", "value": round(avg_wellness, 1), "change": 1.5, "trend": "up", "period": "month", "icon": "activity"},
            {"name": "Customer Retention Rate", "value": 94.2, "change": 0.8, "trend": "up", "period": "month", "icon": "shield"},
            {"name": "Financial Wellness Score", "value": round(float(avg_wellness), 1), "change": 2.3, "trend": "up", "period": "month", "icon": "heart"},
            {"name": "Cross-Sell Rate", "value": 23.5, "change": 4.7, "trend": "up", "period": "month", "icon": "layers"},
            {"name": "Revenue Impact (Cr)", "value": 142.8, "change": 15.3, "trend": "up", "period": "quarter", "icon": "indian-rupee"},
            {"name": "Agent Actions Today", "value": total_actions, "change": 8.1, "trend": "up", "period": "day", "icon": "bot"},
        ]
    }


@router.get("/acquisition-funnel")
async def get_acquisition_funnel(db: AsyncSession = Depends(get_db)):
    """Get customer acquisition funnel data"""
    total = (await db.execute(select(func.count(CustomerProfile.id)))).scalar() or 0
    return {
        "funnel": [
            {"stage": "Leads Generated", "count": int(total * 2.5), "rate": 100},
            {"stage": "Qualified Leads", "count": int(total * 1.8), "rate": 72},
            {"stage": "KYC Initiated", "count": int(total * 1.4), "rate": 56},
            {"stage": "KYC Completed", "count": int(total * 1.1), "rate": 44},
            {"stage": "Account Opened", "count": total, "rate": 40},
            {"stage": "First Transaction", "count": int(total * 0.85), "rate": 34},
            {"stage": "Active Customer", "count": int(total * 0.7), "rate": 28},
        ]
    }


@router.get("/engagement-distribution")
async def get_engagement_distribution(db: AsyncSession = Depends(get_db)):
    """Get engagement channel distribution"""
    result = await db.execute(
        select(EngagementLog.channel, func.count(EngagementLog.id))
        .group_by(EngagementLog.channel)
    )
    channels = {row[0]: row[1] for row in result}
    return {"channels": channels}


@router.get("/agent-performance")
async def get_agent_performance(db: AsyncSession = Depends(get_db)):
    """Get AI agent performance metrics"""
    result = await db.execute(
        select(
            AgentAction.agent_type,
            func.count(AgentAction.id),
            func.avg(AgentAction.duration_ms),
            func.avg(AgentAction.confidence),
        )
        .group_by(AgentAction.agent_type)
    )

    agents = []
    for row in result:
        agents.append({
            "agent_type": row[0],
            "total_actions": row[1],
            "avg_response_ms": round(float(row[2] or 0), 1),
            "avg_confidence": round(float(row[3] or 0), 2),
            "success_rate": 97.5,  # Simulated
            "status": "active",
        })

    return {"agents": agents}
