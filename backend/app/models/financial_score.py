"""Financial Score model - Composite financial health metrics"""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, DateTime, ForeignKey
from sqlalchemy import Uuid as UUID, JSON as JSONB
from sqlalchemy.orm import relationship
from app.database import Base


class FinancialScore(Base):
    __tablename__ = "financial_scores"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    customer_id = Column(UUID(as_uuid=True), ForeignKey("customer_profiles.id"), nullable=False)

    # Core Scores (0-100)
    wellness_score = Column(Float, default=50.0)
    credit_score = Column(Float, default=650.0)  # 300-900 CIBIL scale
    engagement_score = Column(Float, default=50.0)
    risk_score = Column(Float, default=50.0)
    digital_score = Column(Float, default=50.0)
    
    # Component Breakdown
    savings_ratio = Column(Float, nullable=True)
    debt_to_income = Column(Float, nullable=True)
    investment_diversity = Column(Float, nullable=True)
    insurance_coverage = Column(Float, nullable=True)
    emergency_fund_months = Column(Float, nullable=True)
    
    # Trends
    score_trend = Column(String(10), default="stable")  # improving, stable, declining
    previous_wellness_score = Column(Float, nullable=True)
    
    # AI Analysis
    score_breakdown = Column(JSONB, default=dict)
    improvement_suggestions = Column(JSONB, default=list)
    
    computed_at = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)

    customer = relationship("CustomerProfile", back_populates="financial_scores")
