"""
SBI SmartLife AI Agent - Database Configuration
Async SQLAlchemy engine and session management
"""
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from app.config import settings


import logging

logger = logging.getLogger("sbi_database")

def create_db_engine(db_url: str):
    if db_url.startswith("sqlite"):
        return create_async_engine(db_url, echo=settings.DEBUG)
    return create_async_engine(
        db_url,
        echo=settings.DEBUG,
        pool_size=20,
        max_overflow=10,
        pool_pre_ping=True,
    )

engine = create_db_engine(settings.DATABASE_URL)

AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


class Base(DeclarativeBase):
    pass


async def get_db():
    """Dependency injection for database sessions"""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()


async def init_db():
    """Create all tables on startup"""
    global engine, AsyncSessionLocal
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        logger.info("Database initialized successfully.")
    except Exception as e:
        if "postgresql" in settings.DATABASE_URL:
            logger.warning(f"Failed to connect to PostgreSQL: {e}. Falling back to SQLite local database...")
            sqlite_url = "sqlite+aiosqlite:///./sbi_smartlife.db"
            engine = create_db_engine(sqlite_url)
            AsyncSessionLocal = async_sessionmaker(
                engine,
                class_=AsyncSession,
                expire_on_commit=False,
            )
            async with engine.begin() as conn:
                await conn.run_sync(Base.metadata.create_all)
            logger.info("Local SQLite database initialized successfully.")
        else:
            raise e


async def close_db():
    """Dispose engine on shutdown"""
    await engine.dispose()

