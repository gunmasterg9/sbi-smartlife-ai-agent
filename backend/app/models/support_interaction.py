"""Support Interaction model - Customer support tracking"""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, Integer, DateTime, ForeignKey, Text
from sqlalchemy import Uuid as UUID, JSON as JSONB
from sqlalchemy.orm import relationship
from app.database import Base


class SupportInteraction(Base):
    __tablename__ = "support_interactions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    customer_id = Column(UUID(as_uuid=True), ForeignKey("customer_profiles.id"), nullable=False)

    channel = Column(String(20), nullable=False)  # chat, voice, email, branch
    query_type = Column(String(100), nullable=True)
    
    query = Column(Text, nullable=False)
    resolution = Column(Text, nullable=True)
    
    sentiment = Column(String(20), nullable=True)  # positive, neutral, negative
    satisfaction_score = Column(Float, nullable=True)  # 1-5
    
    status = Column(String(20), default="open")  # open, in_progress, resolved, escalated
    escalated_to = Column(String(200), nullable=True)
    
    agent_type = Column(String(50), nullable=True)  # ai or human
    response_time_seconds = Column(Integer, nullable=True)
    
    extra_data = Column(JSONB, default=dict)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)

    customer = relationship("CustomerProfile", back_populates="support_interactions")
