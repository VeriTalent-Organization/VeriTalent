"""
VeriTalent AI - Configuration Management
"""
import os
from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Azure AI Configuration (REQUIRED)
    azure_ai_endpoint: str = ""
    azure_ai_api_key: str = ""
    azure_ai_model: str = "grok-4-fast-reasoning"
    azure_embedding_model: str = "text-embedding-3-small"

    # Cosmos DB (MongoDB vCore - Vector Storage)
    cosmos_connection_string: str = ""
    cosmos_database_name: str = "veritalent_ai"
    cosmos_vectors_collection: str = "embeddings"

    # API Configuration
    ai_api_host: str = "0.0.0.0"
    ai_api_port: int = 8080
    ai_api_debug: bool = True

    # Security
    secret_key: str = "change-this-in-production"
    allowed_origins_str: str = "http://localhost:3000"
    ai_api_key: str = "dev-ai-secret-key-2026"  # API key for backend auth

    # Backend Integration
    backend_api_url: str = "https://veritalent-server.onrender.com/v1"
    ai_service_url: str = "http://localhost:8080"

    # Logging
    log_level: str = "INFO"

    # Limits
    max_cv_size_mb: int = 10
    max_tokens_per_request: int = 4000

    @property
    def allowed_origins(self) -> list[str]:
        """Parse allowed origins from comma-separated string."""
        return [origin.strip() for origin in self.allowed_origins_str.split(",")]

    class Config:
        # Look for .env.local in parent directory (project root)
        env_file = str(Path(__file__).parent.parent.parent / ".env.local")
        env_file_encoding = "utf-8"
        case_sensitive = False
        extra = "ignore"  # Ignore extra fields (like NEXT_PUBLIC_* from frontend)


@lru_cache
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()


settings = get_settings()
