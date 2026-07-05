"""Investment model - Investment products"""
import uuid
from datetime import datetime, date
from sqlalchemy import Column, String, Float, DateTime, Date, ForeignKey, Enum as SQLEnum
from sqlalchemy import Uuid as UUID
from sqlalchemy.orm import relationship
from app.database import Base
import enum


class InvestmentType(str, enum.Enum):
    SIP = "sip"
    MUTUAL_FUND = "mutual_fund"
    FIXED_DEPOSIT = "fixed_deposit"
    EQUITY = "equity"
    PPF = "ppf"
    NPS = "nps"
    GOLD = "gold"
    BONDS = "bonds"
    SUKANYA_SAMRIDDHI = "sukanya_samriddhi"


class Investment(Base):
    __tablename__ = "investments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    customer_id = Column(UUID(as_uuid=True), ForeignKey("customer_profiles.id"), nullable=False)

    investment_type = Column(SQLEnum(InvestmentType), nullable=False)
    name = Column(String(200), nullable=False)
    
    amount_invested = Column(Float, nullable=False)
    current_value = Column(Float, nullable=True)
    returns_percentage = Column(Float, nullable=True)
    
    monthly_sip_amount = Column(Float, nullable=True)
    maturity_date = Column(Date, nullable=True)
    
    risk_level = Column(String(20), default="moderate")
    status = Column(String(20), default="active")
    
    started_at = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    customer = relationship("CustomerProfile", back_populates="investments")
