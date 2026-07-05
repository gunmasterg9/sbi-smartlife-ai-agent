"""
LangGraph Workflow — Multi-Agent Banking AI Orchestration
Implements a StateGraph-based workflow for intelligent agent routing.
"""
from typing import TypedDict, Literal, Optional, Dict, Any, List
from langgraph.graph import StateGraph, END
from app.agents.acquisition import AcquisitionAgent
from app.agents.adoption import AdoptionAgent
from app.agents.engagement_agent import EngagementAgent
from app.agents.wellness import WellnessAgent
from app.agents.life_events import LifeEventAgent
from app.agents.relationship import RelationshipAgent
from app.config import settings
import logging

logger = logging.getLogger("sbi_langgraph")

AgentType = Literal[
    "acquisition", "adoption", "engagement",
    "wellness", "life_events", "relationship"
]


class AgentState(TypedDict):
    """State that flows through the LangGraph workflow"""
    message: str
    customer_id: Optional[str]
    language: str
    session_id: str
    intent: str
    agent_type: AgentType
    confidence: float
    response: str
    suggestions: List[str]
    products_mentioned: List[Dict[str, Any]]
    agent_used: str
    reasoning: str


# ─── Intent Classification Keywords ───
INTENT_KEYWORDS: Dict[str, List[str]] = {
    "acquisition": [
        "open account", "new account", "create account", "register",
        "kyc", "verify", "onboard", "join", "signup", "sign up",
        "eligibility", "eligible", "apply", "new customer",
    ],
    "adoption": [
        "yono", "upi", "mobile banking", "internet banking",
        "app", "digital", "setup", "activate", "install",
        "net banking", "online banking", "how to use",
    ],
    "engagement": [
        "offer", "reward", "cashback", "points", "loyalty",
        "deal", "discount", "coupon", "promo", "notification",
    ],
    "wellness": [
        "budget", "spend", "expense", "savings", "save",
        "invest", "sip", "mutual fund", "wealth", "financial health",
        "portfolio", "fd", "fixed deposit", "ppf", "nps",
        "tax", "goal", "plan", "wellness", "financial score",
    ],
    "life_events": [
        "salary", "income", "raise", "promotion",
        "marriage", "wedding", "child", "baby",
        "house", "home", "property", "car", "vehicle",
        "retire", "education", "business", "life event",
    ],
}


def classify_intent_node(state: AgentState) -> AgentState:
    """Node 1: Classify user intent based on message content"""
    message_lower = state["message"].lower()

    scores: Dict[str, int] = {}
    for agent_type, keywords in INTENT_KEYWORDS.items():
        score = sum(1 for kw in keywords if kw in message_lower)
        if score > 0:
            scores[agent_type] = score

    if scores:
        best_agent = max(scores, key=scores.get)  # type: ignore
        confidence = min(0.95, 0.7 + (max(scores.values()) * 0.08))
        reasoning = f"Matched {max(scores.values())} keywords for {best_agent} agent"
    else:
        best_agent = "relationship"
        confidence = 0.8
        reasoning = "No specific intent keywords matched — routing to general Relationship Manager"

    state["intent"] = best_agent
    state["agent_type"] = best_agent  # type: ignore
    state["confidence"] = confidence
    state["reasoning"] = reasoning
    state["agent_used"] = {
        "acquisition": "Customer Acquisition Agent",
        "adoption": "Digital Adoption Agent",
        "engagement": "Customer Engagement Agent",
        "wellness": "Financial Wellness Agent",
        "life_events": "Life Event Prediction Agent",
        "relationship": "AI Relationship Manager",
    }.get(best_agent, "AI Relationship Manager")

    logger.info(f"Intent classified: {best_agent} (confidence: {confidence:.2f}) — {reasoning}")
    return state


async def route_to_agent_node(state: AgentState) -> AgentState:
    """Node 2: Route to the specialist agent and generate response"""
    mode = settings.AI_MODE
    agents = {
        "acquisition": AcquisitionAgent(mode=mode),
        "adoption": AdoptionAgent(mode=mode),
        "engagement": EngagementAgent(mode=mode),
        "wellness": WellnessAgent(mode=mode),
        "life_events": LifeEventAgent(mode=mode),
        "relationship": RelationshipAgent(mode=mode),
    }

    agent = agents.get(state["agent_type"], agents["relationship"])
    context = {
        "customer_id": state.get("customer_id"),
        "language": state.get("language", "english"),
        "session_id": state.get("session_id", ""),
    }

    result = await agent.process(state["message"], context)

    state["response"] = result["response"]
    state["suggestions"] = result.get("suggestions", [])
    state["products_mentioned"] = result.get("products_mentioned", [])
    state["confidence"] = result.get("confidence", state["confidence"])
    return state


def format_output_node(state: AgentState) -> AgentState:
    """Node 3: Format the final output with metadata"""
    # Add agent attribution
    if state.get("language", "english") != "english":
        state["response"] = (
            f"*[Language: {state['language'].title()}]*\n\n{state['response']}"
        )
    return state


def should_escalate(state: AgentState) -> str:
    """Conditional edge: determine if human escalation is needed"""
    if state.get("confidence", 1.0) < 0.5:
        return "escalate"
    return "continue"


def escalation_node(state: AgentState) -> AgentState:
    """Handle low-confidence situations with escalation"""
    state["response"] = (
        "🔄 **Connecting you to a relationship manager...**\n\n"
        "Your query has been flagged for priority human review. "
        "A senior relationship manager will reach out within 30 minutes.\n\n"
        f"**Query:** {state['message']}\n"
        f"**Reference:** {state.get('session_id', 'N/A')}\n\n"
        "In the meantime, here are some helpful resources:\n"
        "• Visit your nearest SBI branch\n"
        "• Call SBI helpline: 1800-11-2211\n"
        "• Use YONO app for self-service"
    )
    state["agent_used"] = "Escalation Handler"
    state["suggestions"] = ["Track my request", "Try another question", "Contact branch"]
    return state


def build_agent_graph() -> StateGraph:
    """Build the LangGraph workflow for multi-agent orchestration"""
    workflow = StateGraph(AgentState)

    # Add nodes
    workflow.add_node("classify_intent", classify_intent_node)
    workflow.add_node("route_to_agent", route_to_agent_node)
    workflow.add_node("format_output", format_output_node)
    workflow.add_node("escalation", escalation_node)

    # Set entry point
    workflow.set_entry_point("classify_intent")

    # Add edges
    workflow.add_conditional_edges(
        "classify_intent",
        should_escalate,
        {
            "continue": "route_to_agent",
            "escalate": "escalation",
        },
    )
    workflow.add_edge("route_to_agent", "format_output")
    workflow.add_edge("format_output", END)
    workflow.add_edge("escalation", END)

    return workflow


# ─── Pre-compile the graph ───
agent_graph = build_agent_graph()
compiled_graph = agent_graph.compile()


async def run_agent_workflow(
    message: str,
    customer_id: str = None,
    language: str = "english",
    session_id: str = "",
) -> Dict[str, Any]:
    """Execute the LangGraph workflow for a given message"""
    initial_state: AgentState = {
        "message": message,
        "customer_id": customer_id,
        "language": language,
        "session_id": session_id,
        "intent": "",
        "agent_type": "relationship",
        "confidence": 0.0,
        "response": "",
        "suggestions": [],
        "products_mentioned": [],
        "agent_used": "",
        "reasoning": "",
    }

    # Run the compiled graph
    final_state = await compiled_graph.ainvoke(initial_state)

    return {
        "response": final_state["response"],
        "agent_used": final_state["agent_used"],
        "confidence": final_state["confidence"],
        "suggestions": final_state.get("suggestions", []),
        "products_mentioned": final_state.get("products_mentioned", []),
        "intent": final_state.get("intent", ""),
        "reasoning": final_state.get("reasoning", ""),
    }
