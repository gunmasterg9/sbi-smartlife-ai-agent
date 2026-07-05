"""AI Chat API endpoint - Main entry point for the AI banking assistant"""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.schemas.schemas import ChatMessage, ChatResponse
from app.agents.orchestrator import AgentOrchestrator
import uuid

router = APIRouter(prefix="/chat", tags=["AI Chat"])

orchestrator = AgentOrchestrator()


@router.post("/", response_model=ChatResponse)
async def chat(message: ChatMessage, db: AsyncSession = Depends(get_db)):
    """Process a chat message through the AI agent system"""
    session_id = message.session_id or str(uuid.uuid4())

    result = await orchestrator.process_message(
        message=message.message,
        customer_id=message.customer_id,
        language=message.language,
        session_id=session_id,
        db=db,
    )

    return ChatResponse(
        response=result["response"],
        agent_used=result["agent_used"],
        confidence=result["confidence"],
        suggestions=result.get("suggestions", []),
        products_mentioned=result.get("products_mentioned", []),
        session_id=session_id,
    )


@router.get("/history/{session_id}")
async def get_chat_history(session_id: str):
    """Get chat history for a session"""
    # In production, this would be stored in the database
    return {
        "session_id": session_id,
        "messages": [],
        "note": "Chat history is maintained per session"
    }
