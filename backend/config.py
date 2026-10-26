import os
from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    APP_NAME: str = "PulseDesk"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    # Server configuration
    HOST: str = "0.0.0.0"
    PORT: int = 8008
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:8008",
        "http://127.0.0.1:8008",
        "http://localhost:3000",
    ]
    
    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./pulsedesk.db"
    
    # LLM Settings
    DEFAULT_LLM_PROVIDER: str = "auto"  # auto, openai, gemini, or demo
    OPENAI_API_KEY: Optional[str] = None
    OPENAI_MODEL: str = "gpt-4o"
    GEMINI_API_KEY: Optional[str] = None
    GEMINI_MODEL: str = "gemini-1.5-pro"
    
    # Embeddings
    EMBEDDING_PROVIDER: str = "local"  # local, openai, or gemini
    EMBEDDING_MODEL: str = "text-embedding-3-small"
    
    # GitHub Integration
    GITHUB_TOKEN: Optional[str] = None
    DEFAULT_GITHUB_REPO: str = "shaaunak/1resumeproject"
    
    # Gmail Integration
    GOOGLE_CLIENT_ID: Optional[str] = None
    GOOGLE_CLIENT_SECRET: Optional[str] = None
    GOOGLE_REDIRECT_URI: str = "http://localhost:8000/api/connections/gmail/callback"
    
    # Observability
    LANGSMITH_TRACING: bool = False
    LANGSMITH_API_KEY: Optional[str] = None
    LANGSMITH_PROJECT: str = "pulsedesk"
    
    # Demo Mode Default
    DEMO_MODE_DEFAULT: bool = True

settings = Settings()
