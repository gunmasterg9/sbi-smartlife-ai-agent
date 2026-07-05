"""Goal model - Financial goals and tracking"""
import uuid
from datetime import datetime, date
from sqlalchemy import Column, String, Float, DateTime, Date, ForeignKey, Enum as SQLEnum
from sqlalchemy import Uuid as UUID
from sqlalchemy.orm import relationship
from app.database import Base
import enum


class GoalType(str, enum.Enum):
    EMERGENCY_FUND = "emergency_fund"
    HOME_PURCHASE = "home_purchase"
    VEHICLE = "vehicle"
    EDUCATION = "education"
    RETIREMENT = "retirement"
    WEDDING = "wedding"
    VACATION = "vacation"
    BUSINESS = "business"
    WEALTH_BUILDING = "wealth_building"
    DEBT_FREE = "debt_free"
    CUSTOM = "custom"


class GoalStatus(str, enum.Enum):
    ACTIVE = "active"
    COMPLETED = "completed"
    PAUSED = "paused"
    CANCELLED = "cancelled"


class Goal(Base):
    __tablename__ = "goals"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    customer_id = Column(UUID(as_uuid=True), ForeignKey("customer_profiles.id"), nullable=False)

    name = Column(String(200), nullable=False)
    goal_type = Column(SQLEnum(GoalType), nullable=False)
    status = Column(SQLEnum(GoalStatus), default=GoalStatus.ACTIVE)

    target_amount = Column(Float, nullable=False)
    current_amount = Column(Float, default=0.0)
    monthly_contribution = Column(Float, nullable=True)

    deadline = Column(Date, nullable=True)
    priority = Column(String(10), default="medium")  # low, medium, high

    ai_suggestion = Column(String(500), nullable=True)
    progress_percentage = Column(Float, default=0.0)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    customer = relationship("CustomerProfile", back_populates="goals")
