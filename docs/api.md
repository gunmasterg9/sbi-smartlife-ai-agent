# 🔌 API Specification: SBI SmartLife Platform

This document describes the REST API endpoints available on the FastAPI backend server (`http://localhost:8000/api/v1`).

---

## 🔐 Authentication

All private endpoints require a Bearer JWT Token in the request headers:
`Authorization: Bearer <your_jwt_token>`

### `POST /api/v1/auth/register`
Creates a new system user profile.
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "strongpassword123",
    "role": "customer"
  }
  ```
- **Response**: `201 Created`
  ```json
  {
    "id": 12,
    "email": "user@example.com",
    "role": "customer",
    "is_active": true
  }
  ```

### `POST /api/v1/auth/login`
Authenticates a user and returns an access token.
- **Request Body**:
  ```json
  {
    "username": "user@example.com",
    "password": "strongpassword123"
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "access_token": "eyJhbGciOi...",
    "token_type": "bearer"
  }
  ```

---

## 🧬 Customer Digital Twin

### `GET /api/v1/digital-twin/{customer_id}`
Retrieves the complete 360-degree digital twin representation.
- **Response**: `200 OK`
  ```json
  {
    "customer_id": 1,
    "name": "Aarav Sharma",
    "segment": "Affluent",
    "financial_health_score": 82,
    "risk_score": 65,
    "spending_profile": {
      "Rent/EMI": 35.3,
      "Food & Dining": 13.6,
      "Shopping": 12.5,
      "Others": 38.6
    },
    "behavior_metrics": {
      "digital_maturity": 85,
      "savings_discipline": 72,
      "investment_activity": 68
    },
    "last_updated": "2026-06-21T02:00:00Z"
  }
  ```

### `POST /api/v1/digital-twin/{customer_id}/recalculate`
Forces the AI engine to recalculate the twin metrics from the latest transaction logs.
- **Response**: `200 OK`
  ```json
  {
    "status": "success",
    "updated_at": "2026-06-21T02:24:00Z",
    "changes_detected": ["Wellness score increased by +1", "Credit score updated"]
  }
  ```

---

## 💬 AI Banking Assistant

### `POST /api/v1/chat/`
Submits a user query to the LangGraph orchestrator.
- **Request Body**:
  ```json
  {
    "message": "Recommend investment options for me",
    "language": "english"
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "response": "Based on your Digital Twin surplus savings of **₹28,000/month**, I recommend starting a **SIP Mutual Fund** with SBI Bluechip Fund. This aligns with your moderate risk score of **65**.",
    "agent_used": "AI Wellness Agent",
    "confidence": 0.94,
    "suggestions": [
      "SBI Bluechip Fund performance",
      "How to set up a SIP?",
      "View my wellness score"
    ]
  }
  ```

---

## 📈 Analytics & Financial Wellness

### `GET /api/v1/analytics/kpis`
Retrieves the main key performance indicators for the management dashboard.
- **Response**: `200 OK`
  ```json
  {
    "total_customers": 500,
    "acquisition_rate": "8.3%",
    "digital_adoption_rate": "72.4%",
    "revenue_impact_cr": 142.8,
    "active_agents": 6
  }
  ```

### `GET /api/v1/wellness/{customer_id}`
Retrieves the detailed financial health breakdown, goals, and savings progress.
- **Response**: `200 OK`
  ```json
  {
    "wellness_score": 72.5,
    "debt_to_income_ratio": "24%",
    "savings_rate": "28.5%",
    "goals": [
      {
        "id": 4,
        "type": "Car Purchase",
        "target_amount": 800000,
        "current_amount": 320000,
        "progress_pct": 40.0
      }
    ]
  }
  ```

---

## 🛡️ Compliance & Auditing

### `GET /api/v1/compliance/audit-logs`
Returns the recent audit logs (Admin/Staff only).
- **Response**: `200 OK`
  ```json
  [
    {
      "id": 104,
      "timestamp": "2026-06-21T02:22:15Z",
      "user_email": "admin@sbi.co.in",
      "action": "View Customer Digital Twin",
      "resource": "customer_profiles/1",
      "ip_address": "192.168.1.52"
    }
  ]
  ```
