"""Financial Wellness API endpoints"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.financial_score import FinancialScore
from app.models.goal import Goal
from app.models.loan import Loan

router = APIRouter(prefix="/wellness", tags=["Financial Wellness"])


@router.get("/{customer_id}")
async def get_wellness_score(customer_id: str, db: AsyncSession = Depends(get_db)):
    """Get financial wellness score and breakdown"""
    result = await db.execute(
        select(FinancialScore)
        .where(FinancialScore.customer_id == customer_id)
        .order_by(FinancialScore.computed_at.desc())
    )
    score = result.scalar_one_or_none()

    if not score:
        return {
            "wellness_score": 50.0,
            "components": {},
            "suggestions": ["Complete your financial profile for personalized insights"],
        }

    return {
        "wellness_score": score.wellness_score,
        "credit_score": score.credit_score,
        "engagement_score": score.engagement_score,
        "risk_score": score.risk_score,
        "digital_score": score.digital_score,
        "components": {
            "savings_ratio": score.savings_ratio,
            "debt_to_income": score.debt_to_income,
            "investment_diversity": score.investment_diversity,
            "insurance_coverage": score.insurance_coverage,
            "emergency_fund_months": score.emergency_fund_months,
        },
        "score_trend": score.score_trend,
        "improvement_suggestions": score.improvement_suggestions or [],
        "computed_at": score.computed_at.isoformat() if score.computed_at else None,
    }


@router.get("/{customer_id}/goals")
async def get_goals(customer_id: str, db: AsyncSession = Depends(get_db)):
    """Get customer's financial goals"""
    result = await db.execute(
        select(Goal).where(Goal.customer_id == customer_id)
    )
    goals = result.scalars().all()

    return {
        "goals": [
            {
                "id": str(g.id),
                "name": g.name,
                "type": g.goal_type.value if g.goal_type else None,
                "target_amount": g.target_amount,
                "current_amount": g.current_amount,
                "progress": g.progress_percentage,
                "monthly_contribution": g.monthly_contribution,
                "deadline": g.deadline.isoformat() if g.deadline else None,
                "status": g.status.value if g.status else None,
                "priority": g.priority,
                "ai_suggestion": g.ai_suggestion,
            }
            for g in goals
        ]
    }


@router.get("/{customer_id}/debts")
async def get_debt_analysis(customer_id: str, db: AsyncSession = Depends(get_db)):
    """Get debt analysis for a customer"""
    result = await db.execute(
        select(Loan).where(Loan.customer_id == customer_id)
    )
    loans = result.scalars().all()

    total_outstanding = sum(l.outstanding_amount or 0 for l in loans)
    total_emi = sum(l.emi_amount or 0 for l in loans)

    return {
        "total_outstanding": total_outstanding,
        "total_monthly_emi": total_emi,
        "loans": [
            {
                "id": str(l.id),
                "type": l.loan_type.value if l.loan_type else None,
                "principal": l.principal_amount,
                "outstanding": l.outstanding_amount,
                "emi": l.emi_amount,
                "rate": l.interest_rate,
                "remaining_tenure": l.remaining_tenure,
                "status": l.status.value if l.status else None,
            }
            for l in loans
        ],
    }
