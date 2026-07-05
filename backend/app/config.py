"""
SBI SmartLife AI Agent - Configuration
Pydantic Settings for environment variable management
"""
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # Application
    APP_NAME: str = "SBI SmartLife AI Agent"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # Database
    DATABASE_URL: str = "postgresql+asyncpg://sbi_user:sbi_password@localhost:5432/sbi_smartlife"
    DATABASE_SYNC_URL: str = "postgresql://sbi_user:sbi_password@localhost:5432/sbi_smartlife"

    # JWT Authentication
    JWT_SECRET_KEY: str = "sbi-smartlife-super-secret-key-change-in-production-2026"
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    JWT_REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # AI Configuration
    AI_MODE: str = "simulated"  # "simulated" | "live"
    GEMINI_API_KEY: Optional[str] = None
    OPENAI_API_KEY: Optional[str] = None
    AI_MODEL: str = "gemini-2.5-flash"
    AI_TEMPERATURE: float = 0.7

    # ChromaDB
    CHROMA_HOST: str = "localhost"
    CHROMA_PORT: int = 8100
    CHROMA_COLLECTION: str = "sbi_customer_embeddings"

    # CORS
    CORS_ORIGINS: str = "http://localhost:3000,http://localhost:3001"

    # Security
    ENCRYPTION_KEY: str = "sbi-encryption-key-change-in-production"
    RATE_LIMIT_PER_MINUTE: int = 100

    # Frontend URL
    FRONTEND_URL: str = "http://localhost:3000"

    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"


settings = Settings()
