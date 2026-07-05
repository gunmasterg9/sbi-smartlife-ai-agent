"""Recommendation model - AI-generated product recommendations"""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, DateTime, ForeignKey, Enum as SQLEnum, Text
from sqlalchemy import Uuid as UUID, JSON as JSONB
from sqlalchemy.orm import relationship
from app.database import Base
import enum


class RecommendationType(str, enum.Enum):
    SAVINGS_ACCOUNT = "savings_account"
    FIXED_DEPOSIT = "fixed_deposit"
    MUTUAL_FUND = "mutual_fund"
    SIP = "sip"
    INSURANCE = "insurance"
    CREDIT_CARD = "credit_card"
    PERSONAL_LOAN = "personal_loan"
    HOME_LOAN = "home_loan"
    VEHICLE_LOAN = "vehicle_loan"
    PPF = "ppf"
    NPS = "nps"
    YONO = "yono"
    UPI = "upi"
    DEMAT = "demat"
    TAX_SAVING = "tax_saving"


class RecommendationStatus(str, enum.Enum):
    PENDING = "pending"
    VIEWED = "viewed"
    ACCEPTED = "accepted"
    REJECTED = "rejected"
    EXPIRED = "expired"


class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    customer_id = Column(UUID(as_uuid=True), ForeignKey("customer_profiles.id"), nullable=False)
    
    agent_type = Column(String(50), nullable=False)  # Which agent generated this
    recommendation_type = Column(SQLEnum(RecommendationType), nullable=False)
    status = Column(SQLEnum(RecommendationStatus), default=RecommendationStatus.PENDING)
    
    title = Column(String(300), nullable=False)
    description = Column(Text, nullable=True)
    reasoning = Column(Text, nullable=True)  # Explainable AI - why this recommendation
    
    match_score = Column(Float, default=0.5)  # 0-1 relevance score
    priority = Column(String(10), default="medium")
    
    product_details = Column(JSONB, default=dict)  # Product-specific details
    expected_benefit = Column(JSONB, default=dict)  # Expected financial benefit
    
    trigger_event = Column(String(100), nullable=True)  # What triggered this recommendation
    
    expires_at = Column(DateTime, nullable=True)
    viewed_at = Column(DateTime, nullable=True)
    acted_at = Column(DateTime, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)

    customer = relationship("CustomerProfile", back_populates="recommendations")
