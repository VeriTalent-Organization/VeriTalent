"""Job-related AI endpoints."""
from fastapi import APIRouter, Depends, HTTPException
from src.models.ai_requests import (
    JobMatchRequest,
    JobDescriptionRequest,
    AIResponse
)
from src.services.llm_service import LLMService
from src.api.dependencies import verify_api_key
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/job", tags=["Job Operations"])


@router.post("/match", response_model=AIResponse, dependencies=[Depends(verify_api_key)])
async def match_job(request: JobMatchRequest):
    """
    Calculate talent-to-job fit score.
    
    Returns:
    - Overall fit score (0-100)
    - Skill match breakdown
    - Missing skills
    - Recommendations
    """
    try:
        llm_service = LLMService()
        
        logger.info(f"Matching job for user: {request.meta_data.veritalent_id}")
        
        # Get CV text if file provided
        cv_text = None
        if request.file:
            # TODO: Download and extract from Cloudinary
            cv_text = f"Mock CV from {request.file.url}"
        
        # Calculate fit score
        fit_data = await llm_service.calculate_fit_score(
            cv_text=cv_text,
            job_description=request.meta_data.job_description,
            required_skills=request.meta_data.required_skills or [],
            metadata=request.meta_data.dict()
        )
        
        return AIResponse(
            success=True,
            message="Job match calculated successfully",
            data=fit_data,
            status=200
        )
    
    except Exception as e:
        logger.error(f"Job matching failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/generate-description", response_model=AIResponse, dependencies=[Depends(verify_api_key)])
async def generate_job_description(request: JobDescriptionRequest):
    """
    Generate AI-assisted job description.
    
    Returns:
    - Full job description
    - Responsibilities
    - Requirements
    - Preferred qualifications
    """
    try:
        llm_service = LLMService()
        
        logger.info(f"Generating job description: {request.meta_data.job_title}")
        
        # Generate JD using LLM
        jd_data = await llm_service.generate_job_description(
            job_title=request.meta_data.job_title,
            metadata=request.meta_data.dict()
        )
        
        return AIResponse(
            success=True,
            message="Job description generated successfully",
            data=jd_data,
            status=200
        )
    
    except Exception as e:
        logger.error(f"Job description generation failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))
