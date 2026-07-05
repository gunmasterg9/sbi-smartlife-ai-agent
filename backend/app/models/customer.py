"""Customer Profile model - Core customer information"""
import uuid
from datetime import datetime, date
from sqlalchemy import Column, String, Date, Float, Integer, DateTime, ForeignKey, Enum as SQLEnum, Text
from sqlalchemy import Uuid as UUID, JSON as JSONB
from sqlalchemy.orm import relationship
from app.database import Base
import enum


class CustomerSegment(str, enum.Enum):
    MASS = "mass"
    MASS_AFFLUENT = "mass_affluent"
    AFFLUENT = "affluent"
    HNI = "hni"
    ULTRA_HNI = "ultra_hni"
    YOUTH = "youth"
    SENIOR = "senior"
    NRI = "nri"
    BUSINESS = "business"


class CustomerProfile(Base):
    __tablename__ = "customer_profiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), unique=True, nullable=False)
    
    # Personal Info
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    date_of_birth = Column(Date, nullable=True)
    gender = Column(String(10), nullable=True)
    marital_status = Column(String(20), nullable=True)
    
    # Contact
    address = Column(Text, nullable=True)
    city = Column(String(100), nullable=True)
    state = Column(String(100), nullable=True)
    pincode = Column(String(10), nullable=True)
    
    # KYC
    pan_number = Column(String(10), nullable=True)
    aadhaar_hash = Column(String(255), nullable=True)  # Hashed for security
    kyc_status = Column(String(20), default="pending")
    
    # Financial
    occupation = Column(String(100), nullable=True)
    employer = Column(String(200), nullable=True)
    annual_income = Column(Float, nullable=True)
    monthly_income = Column(Float, nullable=True)
    
    # Segmentation
    segment = Column(SQLEnum(CustomerSegment), default=CustomerSegment.MASS)
    risk_appetite = Column(String(20), default="moderate")  # conservative, moderate, aggressive
    preferred_language = Column(String(20), default="english")
    
    # Digital
    yono_registered = Column(String(5), default="false")
    upi_active = Column(String(5), default="false")
    mobile_banking = Column(String(5), default="false")
    internet_banking = Column(String(5), default="false")
    
    # Metadata
    customer_since = Column(Date, nullable=True)
    relationship_manager = Column(String(200), nullable=True)
    branch_code = Column(String(20), nullable=True)
    tags = Column(JSONB, default=list)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="customer_profile")
    digital_twin = relationship("DigitalTwin", back_populates="customer", uselist=False)
    accounts = relationship("Account", back_populates="customer")
    goals = relationship("Goal", back_populates="customer")
    investments = relationship("Investment", back_populates="customer")
    insurance_policies = relationship("Insurance", back_populates="customer")
    loans = relationship("Loan", back_populates="customer")
    life_events = relationship("LifeEvent", back_populates="customer")
    recommendations = relationship("Recommendation", back_populates="customer")
    engagement_logs = relationship("EngagementLog", back_populates="customer")
    notifications = relationship("Notification", back_populates="customer")
    kyc_documents = relationship("KYCDocument", back_populates="customer")
    support_interactions = relationship("SupportInteraction", back_populates="customer")
    financial_scores = relationship("FinancialScore", back_populates="customer")
