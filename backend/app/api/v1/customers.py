"""Customer management API endpoints"""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import Optional
from app.database import get_db
from app.models.customer import CustomerProfile
from app.schemas.schemas import CustomerSummary, CustomerDetail, CustomerListResponse

router = APIRouter(prefix="/customers", tags=["Customers"])


@router.get("/", response_model=CustomerListResponse)
async def list_customers(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    segment: Optional[str] = None,
    city: Optional[str] = None,
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
):
    """List customers with pagination and filtering"""
    query = select(CustomerProfile)

    if segment:
        query = query.where(CustomerProfile.segment == segment)
    if city:
        query = query.where(CustomerProfile.city.ilike(f"%{city}%"))
    if search:
        query = query.where(
            (CustomerProfile.first_name.ilike(f"%{search}%")) |
            (CustomerProfile.last_name.ilike(f"%{search}%"))
        )

    # Count total
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar()

    # Paginate
    query = query.offset((page - 1) * page_size).limit(page_size)
    result = await db.execute(query)
    customers = result.scalars().all()

    return CustomerListResponse(
        customers=[CustomerSummary.model_validate(c) for c in customers],
        total=total,
        page=page,
        page_size=page_size,
    )


@router.get("/segments")
async def get_segments(db: AsyncSession = Depends(get_db)):
    """Get customer segment distribution"""
    result = await db.execute(
        select(CustomerProfile.segment, func.count(CustomerProfile.id))
        .group_by(CustomerProfile.segment)
    )
    segments = {row[0].value if row[0] else "unknown": row[1] for row in result}
    return {"segments": segments}


@router.get("/{customer_id}", response_model=CustomerDetail)
async def get_customer(customer_id: str, db: AsyncSession = Depends(get_db)):
    """Get customer details"""
    result = await db.execute(
        select(CustomerProfile).where(CustomerProfile.id == customer_id)
    )
    customer = result.scalar_one_or_none()
    if not customer:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Customer not found")
    return CustomerDetail.model_validate(customer)
