"""Base Agent class - Foundation for all AI agents"""
from typing import Dict, Any, Optional
from datetime import datetime
import random


class AgentResponse:
    def __init__(self, response: str, confidence: float = 0.85, 
                 suggestions: list = None, products: list = None):
        self.response = response
        self.confidence = confidence
        self.suggestions = suggestions or []
        self.products = products or []


class BaseAgent:
    """Base class for all SBI SmartLife AI agents"""
    
    AGENT_TYPE = "base"
    AGENT_NAME = "Base Agent"

    def __init__(self, mode: str = "simulated"):
        self.mode = mode  # "simulated" or "live"

    async def process(self, message: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """Process a message and return a response"""
        start_time = datetime.utcnow()

        if self.mode == "live":
            result = await self._llm_process(message, context)
        else:
            result = await self._simulated_process(message, context)

        duration = (datetime.utcnow() - start_time).total_seconds() * 1000

        return {
            "response": result.response,
            "agent_used": self.AGENT_NAME,
            "agent_type": self.AGENT_TYPE,
            "confidence": result.confidence,
            "suggestions": result.suggestions,
            "products_mentioned": result.products,
            "duration_ms": int(duration),
        }

    async def _llm_process(self, message: str, context: Dict[str, Any] = None) -> AgentResponse:
        """Process using real Gemini LLM"""
        import uuid
        from app.config import settings
        from app.database import AsyncSessionLocal
        from sqlalchemy import select
        from app.models.customer import CustomerProfile
        from app.models.digital_twin import DigitalTwin
        from app.models.account import Account
        import json
        
        # Verify API key is present
        api_key = settings.GEMINI_API_KEY
        if not api_key:
            return await self._simulated_process(message, context)
            
        # 1. Fetch customer details if customer_id exists
        customer_info = {}
        customer_id = (context or {}).get("customer_id")
        if customer_id:
            try:
                async with AsyncSessionLocal() as session:
                    # Convert string to UUID object
                    cust_uuid = uuid.UUID(str(customer_id))
                    
                    # Query customer profile
                    stmt = select(CustomerProfile).where(CustomerProfile.id == cust_uuid)
                    res = await session.execute(stmt)
                    profile = res.scalar_one_or_none()
                    
                    if profile:
                        customer_info["name"] = f"{profile.first_name} {profile.last_name}"
                        customer_info["segment"] = profile.segment.value if hasattr(profile.segment, "value") else str(profile.segment)
                        customer_info["city"] = profile.city
                        customer_info["email"] = profile.email
                        
                        # Query digital twin
                        twin_stmt = select(DigitalTwin).where(DigitalTwin.customer_id == cust_uuid)
                        twin_res = await session.execute(twin_stmt)
                        twin = twin_res.scalar_one_or_none()
                        if twin:
                            customer_info["risk_score"] = twin.risk_score
                            customer_info["wellness_score"] = twin.financial_health_score
                            customer_info["engagement_score"] = twin.engagement_score
                            customer_info["digital_maturity"] = twin.digital_maturity_score
                            customer_info["spending_profile"] = twin.spending_profile
                            customer_info["predicted_needs"] = twin.predicted_needs
                            customer_info["predicted_life_events"] = twin.predicted_life_events
                            
                        # Query accounts
                        acc_stmt = select(Account).where(Account.customer_id == cust_uuid)
                        acc_res = await session.execute(acc_stmt)
                        accounts = acc_res.scalars().all()
                        customer_info["accounts"] = [
                            {
                                "type": acc.account_type.value if hasattr(acc.account_type, "value") else str(acc.account_type),
                                "balance": float(acc.balance),
                                "status": acc.status.value if hasattr(acc.status, "value") else str(acc.status),
                                "account_number": acc.account_number
                            }
                            for acc in accounts
                        ]
            except Exception as e:
                # Log but proceed without database details
                print(f"Error fetching database details for LLM context: {e}")

        # 2. Build system prompt for Gemini
        system_prompt = f"""You are the {self.AGENT_NAME} for the SBI (State Bank of India) SmartLife banking platform.
Your Role type: {self.AGENT_TYPE}.
Adopt a friendly, supportive, and highly professional banking tone.
Provide clear, structured answers with headings, bullet points, or markdown tables if helpful.

Customer Profile & Context:
{json.dumps(customer_info, indent=2) if customer_info else "No authenticated customer context (answering as general SBI representative)."}

You MUST return your output strictly in JSON format as follows:
{{
  "response": "Your markdown formatted response text to the user",
  "confidence": 0.95,
  "suggestions": ["A list of 3-4 clickable next steps or follow-up questions"],
  "products": [
    {{
      "type": "mutual_fund",
      "name": "SBI Bluechip Fund",
      "match_score": 0.92
    }}
  ]
}}
Do NOT output anything other than raw valid JSON. Do NOT wrap it in HTML. Ensure suggestions are relevant to this user's question and your agent type. If mentioning products, use real SBI products.
"""
        try:
            from langchain_google_genai import ChatGoogleGenerativeAI
            from langchain_core.messages import SystemMessage, HumanMessage
            
            model_name = settings.AI_MODEL or "gemini-2.5-flash"
            llm = ChatGoogleGenerativeAI(
                model=model_name,
                google_api_key=api_key,
                temperature=settings.AI_TEMPERATURE or 0.7
            )
            
            response = await llm.ainvoke([
                SystemMessage(content=system_prompt),
                HumanMessage(content=message)
            ])
            
            # Clean up response content if wrapped in markdown formatting
            content = response.content.strip()
            if content.startswith("```"):
                if content.startswith("```json"):
                    content = content[7:]
                else:
                    content = content[3:]
                if content.endswith("```"):
                    content = content[:-3]
            content = content.strip()
            
            data = json.loads(content)
            return AgentResponse(
                response=data.get("response", "I could not generate a response."),
                confidence=data.get("confidence", 0.90),
                suggestions=data.get("suggestions", []),
                products=data.get("products", [])
            )
        except Exception as e:
            print(f"Error calling live Gemini API in {self.AGENT_NAME}: {e}")
            # Fallback to simulated process
            return await self._simulated_process(message, context)

    async def _simulated_process(self, message: str, context: Dict[str, Any] = None) -> AgentResponse:
        """Simulated response - override in subclasses"""
        return AgentResponse(
            response="I'm your SBI SmartLife AI assistant. How can I help you today?",
            confidence=0.85,
        )

    def _get_confidence(self) -> float:
        """Generate a realistic confidence score"""
        return round(random.uniform(0.82, 0.97), 2)
