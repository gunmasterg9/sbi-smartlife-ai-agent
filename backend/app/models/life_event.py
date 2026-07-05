"""Life Event model - AI-detected life events"""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, DateTime, ForeignKey, Enum as SQLEnum, Text
from sqlalchemy import Uuid as UUID, JSON as JSONB
from sqlalchemy.orm import relationship
from app.database import Base
import enum


class LifeEventType(str, enum.Enum):
    SALARY_INCREASE = "salary_increase"
    JOB_CHANGE = "job_change"
    MARRIAGE = "marriage"
    CHILD_BIRTH = "child_birth"
    CHILD_EDUCATION = "child_education"
    HOME_PURCHASE = "home_purchase"
    VEHICLE_PURCHASE = "vehicle_purchase"
    RETIREMENT_PLANNING = "retirement_planning"
    BUSINESS_EXPANSION = "business_expansion"
    HEALTH_EVENT = "health_event"
    RELOCATION = "relocation"
    INHERITANCE = "inheritance"


class LifeEvent(Base):
    __tablename__ = "life_events"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    customer_id = Column(UUID(as_uuid=True), ForeignKey("customer_profiles.id"), nullable=False)

    event_type = Column(SQLEnum(LifeEventType), nullable=False)
    description = Column(Text, nullable=True)
    
    confidence_score = Column(Float, default=0.5)  # 0-1 how confident the AI is
    detection_method = Column(String(50), default="transaction_analysis")
    
    # Evidence that triggered detection
    evidence = Column(JSONB, default=dict)
    
    # Actions taken
    action_taken = Column(String(20), default="pending")  # pending, notified, acted, dismissed
    recommendations_generated = Column(JSONB, default=list)
    
    detected_at = Column(DateTime, default=datetime.utcnow)
    acknowledged_at = Column(DateTime, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)

    customer = relationship("CustomerProfile", back_populates="life_events")
