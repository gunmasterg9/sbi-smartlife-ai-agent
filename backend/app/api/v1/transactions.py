"""Transaction and spending analytics API endpoints"""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, extract
from typing import Optional
from datetime import datetime, timedelta
from app.database import get_db
from app.models.transaction import Transaction
from app.models.account import Account

router = APIRouter(prefix="/transactions", tags=["Transactions"])


@router.get("/{customer_id}")
async def get_transactions(
    customer_id: str,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    category: Optional[str] = None,
    transaction_type: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
):
    """Get customer transactions with pagination"""
    # Get customer's account IDs
    acct_result = await db.execute(
        select(Account.id).where(Account.customer_id == customer_id)
    )
    account_ids = [row[0] for row in acct_result]

    if not account_ids:
        return {"transactions": [], "total": 0, "page": page, "page_size": page_size}

    query = select(Transaction).where(Transaction.account_id.in_(account_ids))

    if category:
        query = query.where(Transaction.category == category)
    if transaction_type:
        query = query.where(Transaction.transaction_type == transaction_type)

    # Count
    count_q = select(func.count()).select_from(query.subquery())
    total = (await db.execute(count_q)).scalar()

    # Fetch
    query = query.order_by(Transaction.timestamp.desc()).offset((page - 1) * page_size).limit(page_size)
    result = await db.execute(query)
    transactions = result.scalars().all()

    return {
        "transactions": [
            {
                "id": str(t.id),
                "type": t.transaction_type.value if t.transaction_type else None,
                "category": t.category.value if t.category else None,
                "amount": t.amount,
                "description": t.description,
                "merchant": t.merchant_name,
                "timestamp": t.timestamp.isoformat() if t.timestamp else None,
            }
            for t in transactions
        ],
        "total": total,
        "page": page,
        "page_size": page_size,
    }


@router.get("/{customer_id}/analytics")
async def get_spending_analytics(customer_id: str, db: AsyncSession = Depends(get_db)):
    """Get spending analytics for a customer"""
    acct_result = await db.execute(
        select(Account.id).where(Account.customer_id == customer_id)
    )
    account_ids = [row[0] for row in acct_result]

    if not account_ids:
        return {"total_income": 0, "total_expenses": 0, "savings": 0, "category_breakdown": {}}

    # Last 6 months
    six_months_ago = datetime.utcnow() - timedelta(days=180)

    # Total income (credits)
    income_result = await db.execute(
        select(func.coalesce(func.sum(Transaction.amount), 0))
        .where(Transaction.account_id.in_(account_ids))
        .where(Transaction.transaction_type == "credit")
        .where(Transaction.timestamp >= six_months_ago)
    )
    total_income = float(income_result.scalar() or 0)

    # Total expenses (debits)
    expense_result = await db.execute(
        select(func.coalesce(func.sum(Transaction.amount), 0))
        .where(Transaction.account_id.in_(account_ids))
        .where(Transaction.transaction_type == "debit")
        .where(Transaction.timestamp >= six_months_ago)
    )
    total_expenses = float(expense_result.scalar() or 0)

    # Category breakdown
    cat_result = await db.execute(
        select(Transaction.category, func.sum(Transaction.amount))
        .where(Transaction.account_id.in_(account_ids))
        .where(Transaction.transaction_type == "debit")
        .where(Transaction.timestamp >= six_months_ago)
        .group_by(Transaction.category)
    )
    category_breakdown = {
        (row[0].value if row[0] else "other"): float(row[1])
        for row in cat_result
    }

    return {
        "total_income": total_income,
        "total_expenses": total_expenses,
        "savings": total_income - total_expenses,
        "savings_rate": round((total_income - total_expenses) / total_income * 100, 1) if total_income > 0 else 0,
        "category_breakdown": category_breakdown,
    }
