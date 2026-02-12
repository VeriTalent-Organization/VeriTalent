"""Profile enhancement and cover letter generation endpoints."""
from fastapi import APIRouter, Depends, HTTPException
from src.models.ai_requests import (
    ProfileEnhanceRequest,
    CoverLetterRequest,
    AIResponse
)
from src.services.llm_service import LLMService
from src.api.dependencies import verify_api_key
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/profile", tags=["Profile Operations"])


@router.post("/enhance", response_model=AIResponse, dependencies=[Depends(verify_api_key)])
async def enhance_profile(request: ProfileEnhanceRequest):
    """
    Provide AI-powered profile enhancement suggestions.
    
    Returns:
    - Missing skills to add
    - Profile completeness score
    - Suggested improvements
    - Industry-specific recommendations
    """
    try:
        llm_service = LLMService()
        
        logger.info(f"Enhancing profile: {request.meta_data.veritalent_id}")
        
        # Get profile data
        cv_text = None
        if request.file:
            # TODO: Download from Cloudinary
            cv_text = f"Mock CV from {request.file.url}"
        
        # Generate enhancement suggestions
        suggestions = await llm_service.enhance_profile(
            cv_text=cv_text,
            metadata=request.meta_data.dict()
        )
        
        return AIResponse(
            success=True,
            message="Profile enhancement suggestions generated",
            data=suggestions,
            status=200
        )
    
    except Exception as e:
        logger.error(f"Profile enhancement failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/generate-cover-letter", response_model=AIResponse, dependencies=[Depends(verify_api_key)])
async def generate_cover_letter(request: CoverLetterRequest):
    """
    Generate AI-assisted cover letter.
    
    Returns:
    - Personalized cover letter
    - Key highlights to emphasize
    - Tone suggestions
    """
    try:
        llm_service = LLMService()
        
        logger.info(f"Generating cover letter for: {request.meta_data.veritalent_id}")
        
        # Get CV text if provided
        cv_text = None
        if request.file:
            cv_text = f"Mock CV from {request.file.url}"
        
        # Generate cover letter
        cover_letter = await llm_service.generate_cover_letter(
            cv_text=cv_text,
            job_title=request.meta_data.job_title,
            job_description=request.meta_data.job_description,
            metadata=request.meta_data.dict()
        )
        
        return AIResponse(
            success=True,
            message="Cover letter generated successfully",
            data=cover_letter,
            status=200
        )
    
    except Exception as e:
        logger.error(f"Cover letter generation failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))
