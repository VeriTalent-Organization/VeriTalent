"""
Cover Letter Generation Routes
"""
from fastapi import APIRouter, Depends, HTTPException, status
from typing import Any, Optional

from src.api.dependencies import verify_api_key
from src.models.ai_requests import AIResponse, FileInfo, MetaData
from src.services.llm_service import LLMService
from pydantic import BaseModel

router = APIRouter(prefix="/api/cover-letter", tags=["Cover Letter"])


class CoverLetterRequest(BaseModel):
    """Request for cover letter generation."""
    file: Optional[FileInfo] = None
    meta_data: MetaData


@router.post("/generate", response_model=AIResponse, dependencies=[Depends(verify_api_key)])
async def generate_cover_letter(request: CoverLetterRequest) -> AIResponse:
    """
    Generate AI cover letter for job application.
    
    Expects:
    - file: CV file info
    - meta_data: job_title, company_name, job_description, user context
    """
    try:
        llm_service = LLMService()
        
        # Extract metadata - use dict access for AIRequestMetadata
        job_title = getattr(request.meta_data, "job_title", None) or "the position"
        company_name = getattr(request.meta_data, "company_name", None) or "your company"
        job_description = getattr(request.meta_data, "job_description", None) or ""
        
        # Convert metadata to dict for passing to LLM
        candidate_info = request.meta_data.model_dump()
        
        # For now, generate a template-based cover letter
        # TODO: Parse CV and personalize based on candidate's experience
        cover_letter_data = await llm_service.generate_cover_letter(
            job_title=job_title,
            company_name=company_name,
            job_description=job_description,
            candidate_info=candidate_info,
        )
        
        return AIResponse(
            success=True,
            message="Cover letter generated successfully",
            data=cover_letter_data,
            status=200,
        )
    
    except Exception as e:
        return AIResponse(
            success=False,
            message="Cover letter generation failed",
            data={"error": str(e)},
            status=500,
        )
