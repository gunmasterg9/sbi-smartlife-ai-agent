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
        """Process using real LLM - to be implemented with Gemini/GPT"""
        # This would use LangChain/LangGraph with Gemini 2.5 Flash
        # For now, fallback to simulated
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
