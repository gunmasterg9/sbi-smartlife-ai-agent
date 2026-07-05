"""Insurance model - Insurance policies"""
import uuid
from datetime import datetime, date
from sqlalchemy import Column, String, Float, DateTime, Date, ForeignKey, Enum as SQLEnum
from sqlalchemy import Uuid as UUID
from sqlalchemy.orm import relationship
from app.database import Base
import enum


class InsuranceType(str, enum.Enum):
    LIFE = "life"
    HEALTH = "health"
    VEHICLE = "vehicle"
    HOME = "home"
    TRAVEL = "travel"
    TERM = "term"
    ENDOWMENT = "endowment"
    ULIP = "ulip"


class Insurance(Base):
    __tablename__ = "insurance"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    customer_id = Column(UUID(as_uuid=True), ForeignKey("customer_profiles.id"), nullable=False)

    insurance_type = Column(SQLEnum(InsuranceType), nullable=False)
    provider = Column(String(200), default="SBI Life")
    policy_number = Column(String(50), nullable=True)
    
    premium_amount = Column(Float, nullable=False)
    premium_frequency = Column(String(20), default="annual")  # monthly, quarterly, annual
    coverage_amount = Column(Float, nullable=False)
    
    start_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)
    
    nominee_name = Column(String(200), nullable=True)
    status = Column(String(20), default="active")
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    customer = relationship("CustomerProfile", back_populates="insurance_policies")
