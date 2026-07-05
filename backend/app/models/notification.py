"""Notification model - Multi-channel notifications"""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Text
from sqlalchemy import Uuid as UUID, JSON as JSONB
from sqlalchemy.orm import relationship
from app.database import Base


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    customer_id = Column(UUID(as_uuid=True), ForeignKey("customer_profiles.id"), nullable=False)

    notification_type = Column(String(50), nullable=False)  # recommendation, alert, reminder, promotion
    channel = Column(String(20), nullable=False)  # push, sms, email, whatsapp, in_app
    
    title = Column(String(300), nullable=False)
    message = Column(Text, nullable=False)
    
    status = Column(String(20), default="pending")  # pending, sent, delivered, read, failed
    priority = Column(String(10), default="normal")  # low, normal, high, urgent
    
    action_url = Column(String(500), nullable=True)
    extra_data = Column(JSONB, default=dict)
    
    scheduled_at = Column(DateTime, nullable=True)
    sent_at = Column(DateTime, nullable=True)
    read_at = Column(DateTime, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)

    customer = relationship("CustomerProfile", back_populates="notifications")
