"""Agent Orchestrator - Routes messages to the appropriate specialized agent"""
from typing import Dict, Any, Optional
from app.agents.acquisition import AcquisitionAgent
from app.agents.adoption import AdoptionAgent
from app.agents.engagement_agent import EngagementAgent
from app.agents.wellness import WellnessAgent
from app.agents.life_events import LifeEventAgent
from app.agents.relationship import RelationshipAgent
from app.config import settings


class AgentOrchestrator:
    """
    Supervisor agent that routes user messages to the appropriate specialist agent.
    In production, this would use LangGraph for stateful multi-agent coordination.
    """

    def __init__(self):
        mode = settings.AI_MODE
        self.agents = {
            "acquisition": AcquisitionAgent(mode=mode),
            "adoption": AdoptionAgent(mode=mode),
            "engagement": EngagementAgent(mode=mode),
            "wellness": WellnessAgent(mode=mode),
            "life_events": LifeEventAgent(mode=mode),
            "relationship": RelationshipAgent(mode=mode),
        }

        # Intent detection keywords
        self.intent_map = {
            "acquisition": [
                "open account", "new account", "create account", "register",
                "kyc", "verify", "onboard", "join", "signup", "sign up",
                "eligibility", "eligible", "apply",
            ],
            "adoption": [
                "yono", "upi", "mobile banking", "internet banking",
                "app", "digital", "setup", "activate", "install",
                "net banking", "online banking",
            ],
            "engagement": [
                "offer", "reward", "cashback", "points", "loyalty",
                "deal", "discount", "coupon", "promo",
            ],
            "wellness": [
                "budget", "spend", "expense", "savings", "save",
                "invest", "sip", "mutual fund", "wealth", "financial health",
                "portfolio", "fd", "fixed deposit", "ppf", "nps",
                "tax", "goal", "plan",
            ],
            "life_events": [
                "salary", "income", "raise", "promotion",
                "marriage", "wedding", "child", "baby",
                "house", "home", "property", "car", "vehicle",
                "retire", "education", "business",
            ],
        }

    def _classify_intent(self, message: str) -> str:
        """Classify user intent and route to appropriate agent"""
        message_lower = message.lower()

        # Score each agent based on keyword matches
        scores = {}
        for agent_type, keywords in self.intent_map.items():
            score = sum(1 for kw in keywords if kw in message_lower)
            if score > 0:
                scores[agent_type] = score

        if scores:
            return max(scores, key=scores.get)

        # Default to relationship manager for general queries
        return "relationship"

    async def process_message(
        self,
        message: str,
        customer_id: Optional[str] = None,
        language: str = "english",
        session_id: str = "",
        db=None,
    ) -> Dict[str, Any]:
        """Process a message through the appropriate agent"""
        # Classify intent
        agent_type = self._classify_intent(message)
        agent = self.agents.get(agent_type, self.agents["relationship"])

        # Build context
        context = {
            "customer_id": customer_id,
            "language": language,
            "session_id": session_id,
        }

        # Process through selected agent
        result = await agent.process(message, context)
        return result
