"""Pydantic schemas for request/response validation"""
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime, date
from uuid import UUID
from enum import Enum


# ============== Auth Schemas ==============

class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    first_name: str
    last_name: str
    phone: Optional[str] = None

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int
    user: Dict[str, Any]

class UserResponse(BaseModel):
    id: UUID
    email: str
    role: str
    is_active: bool
    last_login: Optional[datetime] = None

    class Config:
        from_attributes = True


# ============== Customer Schemas ==============

class CustomerSummary(BaseModel):
    id: UUID
    first_name: str
    last_name: str
    segment: str
    annual_income: Optional[float] = None
    city: Optional[str] = None
    kyc_status: str = "pending"
    yono_registered: str = "false"
    upi_active: str = "false"

    class Config:
        from_attributes = True

class CustomerDetail(CustomerSummary):
    date_of_birth: Optional[date] = None
    gender: Optional[str] = None
    marital_status: Optional[str] = None
    occupation: Optional[str] = None
    monthly_income: Optional[float] = None
    risk_appetite: str = "moderate"
    preferred_language: str = "english"
    mobile_banking: str = "false"
    internet_banking: str = "false"
    customer_since: Optional[date] = None
    state: Optional[str] = None
    pincode: Optional[str] = None

class CustomerListResponse(BaseModel):
    customers: List[CustomerSummary]
    total: int
    page: int
    page_size: int


# ============== Digital Twin Schemas ==============

class DigitalTwinResponse(BaseModel):
    id: UUID
    customer_id: UUID
    spending_profile: Dict[str, Any] = {}
    saving_pattern: Dict[str, Any] = {}
    risk_score: float = 50.0
    financial_health_score: float = 50.0
    engagement_score: float = 50.0
    digital_maturity_score: float = 50.0
    churn_probability: float = 0.1
    predicted_needs: List[Any] = []
    predicted_life_events: List[Any] = []
    personality_traits: Dict[str, Any] = {}
    last_computed: Optional[datetime] = None

    class Config:
        from_attributes = True


# ============== Transaction Schemas ==============

class TransactionResponse(BaseModel):
    id: UUID
    transaction_type: str
    category: str
    amount: float
    description: Optional[str] = None
    merchant_name: Optional[str] = None
    timestamp: datetime

    class Config:
        from_attributes = True

class SpendingAnalytics(BaseModel):
    total_income: float
    total_expenses: float
    savings: float
    savings_rate: float
    category_breakdown: Dict[str, float]
    monthly_trend: List[Dict[str, Any]]


# ============== Recommendation Schemas ==============

class RecommendationResponse(BaseModel):
    id: UUID
    recommendation_type: str
    title: str
    description: Optional[str] = None
    reasoning: Optional[str] = None
    match_score: float
    priority: str
    status: str
    agent_type: str
    created_at: datetime

    class Config:
        from_attributes = True


# ============== Life Event Schemas ==============

class LifeEventResponse(BaseModel):
    id: UUID
    event_type: str
    description: Optional[str] = None
    confidence_score: float
    action_taken: str
    recommendations_generated: List[Any] = []
    detected_at: datetime

    class Config:
        from_attributes = True


# ============== Financial Score Schemas ==============

class FinancialScoreResponse(BaseModel):
    wellness_score: float
    credit_score: float
    engagement_score: float
    risk_score: float
    digital_score: float
    savings_ratio: Optional[float] = None
    debt_to_income: Optional[float] = None
    investment_diversity: Optional[float] = None
    insurance_coverage: Optional[float] = None
    emergency_fund_months: Optional[float] = None
    score_trend: str = "stable"
    improvement_suggestions: List[Any] = []
    computed_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ============== Chat Schemas ==============

class ChatMessage(BaseModel):
    message: str
    customer_id: Optional[str] = None
    language: str = "english"
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    agent_used: str
    confidence: float
    suggestions: List[str] = []
    products_mentioned: List[Dict[str, Any]] = []
    session_id: str


# ============== Analytics Schemas ==============

class KPIMetric(BaseModel):
    name: str
    value: float
    change: float  # % change
    trend: str  # up, down, stable
    period: str

class AnalyticsDashboard(BaseModel):
    kpis: List[KPIMetric]
    acquisition_funnel: Dict[str, int]
    engagement_distribution: Dict[str, int]
    revenue_impact: Dict[str, float]


# ============== Agent Schemas ==============

class AgentStatus(BaseModel):
    agent_name: str
    agent_type: str
    status: str  # active, idle, error
    actions_today: int
    avg_response_ms: float
    success_rate: float
    last_action: Optional[datetime] = None

class AgentActionResponse(BaseModel):
    id: UUID
    agent_type: str
    agent_name: str
    action: str
    status: str
    duration_ms: Optional[int] = None
    timestamp: datetime

    class Config:
        from_attributes = True
