"""
SBI SmartLife AI Agent - FastAPI Application Entry Point
The Autonomous Banking Growth Platform
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.config import settings
from app.database import init_db, close_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifecycle management"""
    # Startup
    await init_db()
    yield
    # Shutdown
    await close_db()


app = FastAPI(
    title=settings.APP_NAME,
    description="Autonomous AI-powered Banking Growth Platform for SBI - GFF 2026 Hackathon",
    version=settings.APP_VERSION,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Import and register routers
from app.api.v1.auth import router as auth_router
from app.api.v1.customers import router as customers_router
from app.api.v1.digital_twin import router as digital_twin_router
from app.api.v1.transactions import router as transactions_router
from app.api.v1.recommendations import router as recommendations_router
from app.api.v1.analytics import router as analytics_router
from app.api.v1.wellness import router as wellness_router
from app.api.v1.life_events import router as life_events_router
from app.api.v1.engagement import router as engagement_router
from app.api.v1.compliance import router as compliance_router
from app.api.v1.agents import router as agents_router
from app.api.v1.chat import router as chat_router

API_PREFIX = "/api/v1"

app.include_router(auth_router, prefix=API_PREFIX)
app.include_router(customers_router, prefix=API_PREFIX)
app.include_router(digital_twin_router, prefix=API_PREFIX)
app.include_router(transactions_router, prefix=API_PREFIX)
app.include_router(recommendations_router, prefix=API_PREFIX)
app.include_router(analytics_router, prefix=API_PREFIX)
app.include_router(wellness_router, prefix=API_PREFIX)
app.include_router(life_events_router, prefix=API_PREFIX)
app.include_router(engagement_router, prefix=API_PREFIX)
app.include_router(compliance_router, prefix=API_PREFIX)
app.include_router(agents_router, prefix=API_PREFIX)
app.include_router(chat_router, prefix=API_PREFIX)


@app.get("/")
async def root():
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "operational",
        "description": "Autonomous AI-powered Banking Growth Platform",
        "hackathon": "SBI @ GFF 2026",
        "ai_mode": settings.AI_MODE,
    }


@app.get("/health")
async def health():
    return {"status": "healthy", "ai_mode": settings.AI_MODE}
