"""Audit Log model - Compliance and security audit trail"""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Text
from sqlalchemy import Uuid as UUID, JSON as JSONB
from sqlalchemy.orm import relationship
from app.database import Base


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)

    action = Column(String(100), nullable=False)  # login, data_access, data_modify, export, etc.
    resource_type = Column(String(50), nullable=True)  # customer, account, transaction, etc.
    resource_id = Column(String(50), nullable=True)
    
    details = Column(JSONB, default=dict)
    
    ip_address = Column(String(45), nullable=True)
    user_agent = Column(String(500), nullable=True)
    
    status = Column(String(20), default="success")  # success, failure, blocked
    risk_level = Column(String(10), default="low")   # low, medium, high, critical
    
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)

    user = relationship("User", back_populates="audit_logs")
