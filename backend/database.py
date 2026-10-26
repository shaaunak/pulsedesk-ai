import os
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy import select, text
from backend.config import settings
from backend.models.database import Base, Workspace, Connection, Memory

# Normalize sqlite URL to use aiosqlite for async engine if needed
db_url = settings.DATABASE_URL
if db_url.startswith("sqlite:///"):
    db_url = db_url.replace("sqlite:///", "sqlite+aiosqlite:///")

connect_args = {"check_same_thread": False} if "sqlite" in db_url else {}

engine = create_async_engine(
    db_url,
    echo=settings.DEBUG and False,
    future=True,
    connect_args=connect_args,
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
)

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()

async def init_db():
    async with engine.begin() as conn:
        # Create all tables
        await conn.run_sync(Base.metadata.create_all)
    
    # Initialize default demo workspace if it doesn't exist
    async with AsyncSessionLocal() as session:
        result = await session.execute(
            select(Workspace).where(Workspace.id == "demo-workspace")
        )
        workspace = result.scalar_one_or_none()
        if not workspace:
            workspace = Workspace(
                id="demo-workspace",
                display_name="Project Alpha",
            )
            session.add(workspace)
            
            # Add default connections
            github_conn = Connection(
                id="conn-github",
                workspace_id="demo-workspace",
                provider="github",
                status="connected",
                config_json='{"repo": "shaaunak/1resumeproject", "mode": "demo_and_live"}',
            )
            gmail_conn = Connection(
                id="conn-gmail",
                workspace_id="demo-workspace",
                provider="gmail",
                status="connected",
                config_json='{"email": "demo.user@example.com", "mode": "demo_fixture"}',
            )
            notion_conn = Connection(
                id="conn-notion",
                workspace_id="demo-workspace",
                provider="notion",
                status="not_connected",
                config_json='{"status": "coming_soon"}',
            )
            session.add_all([github_conn, gmail_conn, notion_conn])

            # Seed demo durable memory
            initial_memory = Memory(
                id="fixture:memory:priority",
                workspace_id="demo-workspace",
                type="explicit_user_request",
                content="Project Alpha presentation is higher priority than documentation polish this week.",
                provenance="explicit_user_request",
            )
            session.add(initial_memory)
            await session.commit()

