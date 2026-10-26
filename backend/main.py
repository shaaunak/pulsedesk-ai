"""
PulseDesk Main Application Entry Point
FastAPI server configuration, CORS middleware, database lifecycle management,
and routing registration.
"""

from contextlib import asynccontextmanager
import logging
import os
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from backend.config import settings
from backend.database import init_db
from backend.api.routes import api_router, chat_endpoint
from backend.models.schemas import AgentResponse

logging.basicConfig(
    level=logging.INFO if settings.DEBUG else logging.WARNING,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("pulsedesk")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize DB tables & seed demo workspace
    logger.info("Initializing PulseDesk database tables & default seeds...")
    await init_db()
    logger.info("PulseDesk backend ready to serve requests.")
    yield
    logger.info("Shutting down PulseDesk backend...")

app = FastAPI(
    title=settings.APP_NAME,
    description="Intelligent Agentic RAG Workspace Assistant with verified citations, LangGraph orchestration, and MCP tool execution.",
    version="1.0.0",
    lifespan=lifespan,
    redirect_slashes=True,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes under /api
app.include_router(api_router)

# Direct root aliases for /chat and /chat/ to prevent 404 when clients call without /api
app.add_api_route("/chat", chat_endpoint, methods=["POST"], response_model=AgentResponse, include_in_schema=False)
app.add_api_route("/chat/", chat_endpoint, methods=["POST"], response_model=AgentResponse, include_in_schema=False)

# Mount Frontend static assets and SPA HTML fallback
dist_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend", "dist")
if os.path.exists(dist_dir):
    assets_dir = os.path.join(dist_dir, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        # Do not catch /api routes - let them return 404 JSON
        if full_path.startswith("api/"):
            raise HTTPException(status_code=404, detail=f"API route '/{full_path}' not found")
        
        # Check if the exact static file exists in dist_dir (e.g., favicon.ico, robots.txt)
        file_path = os.path.join(dist_dir, full_path)
        if full_path and os.path.isfile(file_path):
            return FileResponse(file_path)
            
        # Fallback to index.html for all client-side SPA paths (/overview, /ask, /stream, etc.)
        index_file = os.path.join(dist_dir, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
        return JSONResponse(status_code=404, content={"detail": "Frontend index.html not found"})
else:
    @app.get("/")
    async def root():
        return {
            "app": settings.APP_NAME,
            "tagline": "Your workspace. Connected. Remembered. Understood.",
            "docs_url": "/docs",
            "api_health": "/api/health",
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
