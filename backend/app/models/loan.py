"""Loan model - Loan products"""
import uuid
from datetime import datetime, date
from sqlalchemy import Column, String, Float, DateTime, Date, Integer, ForeignKey, Enum as SQLEnum
from sqlalchemy import Uuid as UUID
from sqlalchemy.orm import relationship
from app.database import Base
import enum


class LoanType(str, enum.Enum):
    HOME = "home"
    PERSONAL = "personal"
    VEHICLE = "vehicle"
    EDUCATION = "education"
    BUSINESS = "business"
    GOLD = "gold"
    AGRICULTURE = "agriculture"
    CREDIT_CARD = "credit_card"


class LoanStatus(str, enum.Enum):
    APPLIED = "applied"
    APPROVED = "approved"
    DISBURSED = "disbursed"
    ACTIVE = "active"
    CLOSED = "closed"
    DEFAULTED = "defaulted"
    REJECTED = "rejected"


class Loan(Base):
    __tablename__ = "loans"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    customer_id = Column(UUID(as_uuid=True), ForeignKey("customer_profiles.id"), nullable=False)

    loan_type = Column(SQLEnum(LoanType), nullable=False)
    status = Column(SQLEnum(LoanStatus), default=LoanStatus.APPLIED)
    
    principal_amount = Column(Float, nullable=False)
    disbursed_amount = Column(Float, nullable=True)
    outstanding_amount = Column(Float, nullable=True)
    
    interest_rate = Column(Float, nullable=False)
    emi_amount = Column(Float, nullable=True)
    tenure_months = Column(Integer, nullable=False)
    remaining_tenure = Column(Integer, nullable=True)
    
    collateral_type = Column(String(100), nullable=True)
    collateral_value = Column(Float, nullable=True)
    
    disbursement_date = Column(Date, nullable=True)
    next_emi_date = Column(Date, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    customer = relationship("CustomerProfile", back_populates="loans")
