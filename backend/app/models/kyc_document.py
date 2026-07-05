"""KYC Document model - Know Your Customer verification"""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Text
from sqlalchemy import Uuid as UUID
from sqlalchemy.orm import relationship
from app.database import Base


class KYCDocument(Base):
    __tablename__ = "kyc_documents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    customer_id = Column(UUID(as_uuid=True), ForeignKey("customer_profiles.id"), nullable=False)

    document_type = Column(String(50), nullable=False)  # aadhaar, pan, passport, voter_id, driving_license
    document_number_hash = Column(String(255), nullable=True)  # Hashed for security
    
    status = Column(String(20), default="pending")  # pending, verified, rejected, expired
    verification_method = Column(String(50), nullable=True)  # e_kyc, video_kyc, in_person, digilocker
    
    verified_by = Column(String(200), nullable=True)
    rejection_reason = Column(Text, nullable=True)
    
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    verified_at = Column(DateTime, nullable=True)
    expires_at = Column(DateTime, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)

    customer = relationship("CustomerProfile", back_populates="kyc_documents")
