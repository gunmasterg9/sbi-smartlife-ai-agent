"""Digital Twin model - AI-powered customer behavior profile"""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, Integer, DateTime, ForeignKey, Text
from sqlalchemy import Uuid as UUID, JSON as JSONB
from sqlalchemy.orm import relationship
from app.database import Base


class DigitalTwin(Base):
    __tablename__ = "digital_twins"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    customer_id = Column(UUID(as_uuid=True), ForeignKey("customer_profiles.id"), unique=True, nullable=False)

    # Behavioral Analysis
    spending_profile = Column(JSONB, default=dict)  # Category-wise spending breakdown
    saving_pattern = Column(JSONB, default=dict)     # Monthly savings trend
    income_trend = Column(JSONB, default=dict)       # Income changes over time
    transaction_frequency = Column(JSONB, default=dict)  # Transaction patterns

    # Risk & Scores
    risk_score = Column(Float, default=50.0)          # 0-100
    financial_health_score = Column(Float, default=50.0)  # 0-100
    engagement_score = Column(Float, default=50.0)    # 0-100
    digital_maturity_score = Column(Float, default=50.0)  # 0-100
    churn_probability = Column(Float, default=0.1)    # 0-1

    # Predictions
    predicted_needs = Column(JSONB, default=list)       # Next likely products
    predicted_life_events = Column(JSONB, default=list) # Upcoming life events
    investment_affinity = Column(JSONB, default=dict)   # Product type affinities
    
    # Behavior Vectors
    behavior_embedding = Column(Text, nullable=True)  # Serialized vector for ChromaDB
    personality_traits = Column(JSONB, default=dict)   # Inferred traits
    preferred_channels = Column(JSONB, default=list)   # Communication preferences
    active_hours = Column(JSONB, default=dict)         # When they're most active

    # Metadata
    model_version = Column(String(20), default="v1.0")
    confidence = Column(Float, default=0.5)
    last_computed = Column(DateTime, default=datetime.utcnow)
    computation_count = Column(Integer, default=0)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    customer = relationship("CustomerProfile", back_populates="digital_twin")
