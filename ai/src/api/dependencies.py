"""
API Dependencies - Shared dependencies for route handlers
"""
from typing import Annotated

from fastapi import Depends, Header, HTTPException, status

from src.config import settings


async def verify_api_key(
    x_api_key: Annotated[str | None, Header()] = None
) -> str:
    """
    Verify API key for backend requests.
    
    Backend must include 'X-API-Key' header with configured AI_API_KEY.
    """
    if not settings.ai_api_key:
        # No API key configured, skip verification in development
        return "dev-mode"
    
    if x_api_key != settings.ai_api_key:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid or missing API key. Backend must include 'X-API-Key' header.",
        )
    return x_api_key


ApiKeyDep = Annotated[str, Depends(verify_api_key)]
