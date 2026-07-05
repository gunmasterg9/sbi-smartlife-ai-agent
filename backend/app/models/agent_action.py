"""Agent Action model - AI agent activity logging"""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, Integer, DateTime, ForeignKey, Text
from sqlalchemy import Uuid as UUID, JSON as JSONB
from app.database import Base


class AgentAction(Base):
    __tablename__ = "agent_actions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    agent_type = Column(String(50), nullable=False)  # acquisition, adoption, engagement, wellness, life_events, relationship
    agent_name = Column(String(100), nullable=False)
    
    customer_id = Column(UUID(as_uuid=True), ForeignKey("customer_profiles.id"), nullable=True)
    
    action = Column(String(200), nullable=False)
    input_context = Column(JSONB, default=dict)
    output = Column(Text, nullable=True)
    
    status = Column(String(20), default="completed")  # processing, completed, failed
    duration_ms = Column(Integer, nullable=True)
    
    tokens_used = Column(Integer, nullable=True)
    model_used = Column(String(50), nullable=True)
    confidence = Column(Float, nullable=True)
    
    error_message = Column(Text, nullable=True)
    
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
