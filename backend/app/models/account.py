"""Account model - Banking accounts"""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, DateTime, ForeignKey, Enum as SQLEnum, Boolean
from sqlalchemy import Uuid as UUID
from sqlalchemy.orm import relationship
from app.database import Base
import enum


class AccountType(str, enum.Enum):
    SAVINGS = "savings"
    CURRENT = "current"
    FIXED_DEPOSIT = "fixed_deposit"
    RECURRING_DEPOSIT = "recurring_deposit"
    SALARY = "salary"
    NRI = "nri"
    PPF = "ppf"


class AccountStatus(str, enum.Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    DORMANT = "dormant"
    CLOSED = "closed"
    FROZEN = "frozen"


class Account(Base):
    __tablename__ = "accounts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    customer_id = Column(UUID(as_uuid=True), ForeignKey("customer_profiles.id"), nullable=False)
    
    account_number = Column(String(20), unique=True, nullable=False)
    account_type = Column(SQLEnum(AccountType), nullable=False)
    status = Column(SQLEnum(AccountStatus), default=AccountStatus.ACTIVE)
    
    balance = Column(Float, default=0.0)
    available_balance = Column(Float, default=0.0)
    currency = Column(String(3), default="INR")
    
    branch_code = Column(String(20), nullable=True)
    ifsc_code = Column(String(11), nullable=True)
    
    interest_rate = Column(Float, nullable=True)
    maturity_date = Column(DateTime, nullable=True)
    
    is_primary = Column(Boolean, default=False)
    nominee_name = Column(String(200), nullable=True)
    
    opened_at = Column(DateTime, default=datetime.utcnow)
    last_transaction_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    customer = relationship("CustomerProfile", back_populates="accounts")
    transactions = relationship("Transaction", back_populates="account")
