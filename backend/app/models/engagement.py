"""Engagement Log model - Customer interaction tracking"""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Text
from sqlalchemy import Uuid as UUID, JSON as JSONB
from sqlalchemy.orm import relationship
from app.database import Base


class EngagementLog(Base):
    __tablename__ = "engagement_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    customer_id = Column(UUID(as_uuid=True), ForeignKey("customer_profiles.id"), nullable=False)

    channel = Column(String(50), nullable=False)  # app, web, sms, email, whatsapp, branch, call
    action = Column(String(100), nullable=False)   # login, transaction, product_view, etc.
    
    page = Column(String(200), nullable=True)
    session_id = Column(String(100), nullable=True)
    duration_seconds = Column(String(20), nullable=True)
    
    device_type = Column(String(20), nullable=True)  # mobile, desktop, tablet
    os = Column(String(50), nullable=True)
    
    extra_data = Column(JSONB, default=dict)
    
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    customer = relationship("CustomerProfile", back_populates="engagement_logs")
