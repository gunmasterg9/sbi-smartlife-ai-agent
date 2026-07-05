"""Transaction model - Financial transactions"""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, DateTime, ForeignKey, Enum as SQLEnum, Text
from sqlalchemy import Uuid as UUID, JSON as JSONB
from sqlalchemy.orm import relationship
from app.database import Base
import enum


class TransactionType(str, enum.Enum):
    CREDIT = "credit"
    DEBIT = "debit"
    TRANSFER = "transfer"
    UPI = "upi"
    NEFT = "neft"
    RTGS = "rtgs"
    IMPS = "imps"
    ATM = "atm"
    POS = "pos"
    EMI = "emi"
    STANDING_INSTRUCTION = "standing_instruction"


class TransactionCategory(str, enum.Enum):
    SALARY = "salary"
    FOOD = "food"
    GROCERIES = "groceries"
    SHOPPING = "shopping"
    UTILITIES = "utilities"
    RENT = "rent"
    EMI = "emi"
    INSURANCE = "insurance"
    INVESTMENT = "investment"
    ENTERTAINMENT = "entertainment"
    TRAVEL = "travel"
    HEALTHCARE = "healthcare"
    EDUCATION = "education"
    FUEL = "fuel"
    TRANSFER = "transfer"
    ATM_WITHDRAWAL = "atm_withdrawal"
    OTHER = "other"


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    account_id = Column(UUID(as_uuid=True), ForeignKey("accounts.id"), nullable=False)
    
    transaction_type = Column(SQLEnum(TransactionType), nullable=False)
    category = Column(SQLEnum(TransactionCategory), default=TransactionCategory.OTHER)
    
    amount = Column(Float, nullable=False)
    balance_after = Column(Float, nullable=True)
    currency = Column(String(3), default="INR")
    
    description = Column(Text, nullable=True)
    merchant_name = Column(String(200), nullable=True)
    merchant_category = Column(String(100), nullable=True)
    
    reference_number = Column(String(50), nullable=True)
    upi_id = Column(String(100), nullable=True)
    
    # Location
    location = Column(String(200), nullable=True)
    
    # AI-tagged metadata
    ai_category = Column(String(50), nullable=True)  # AI-refined category
    sentiment = Column(String(20), nullable=True)      # spending sentiment
    is_recurring = Column(String(5), default="false")
    tags = Column(JSONB, default=list)
    
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    account = relationship("Account", back_populates="transactions")
