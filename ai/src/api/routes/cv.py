"""CV parsing endpoints."""
from fastapi import APIRouter, Depends, HTTPException
from src.models.ai_requests import CVParseRequest, AIResponse
from src.services.llm_service import LLMService
from src.api.dependencies import verify_api_key
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/cv", tags=["CV Operations"])


@router.post("/parse", response_model=AIResponse, dependencies=[Depends(verify_api_key)])
async def parse_cv(request: CVParseRequest):
    """
    Parse a CV and extract structured information.
    
    Extracts:
    - Personal info (name, email, phone)
    - Skills and competencies
    - Work experience
    - Education
    - Certifications
    """
    try:
        llm_service = LLMService()
        
        logger.info(f"Parsing CV: {request.file.original_name}")
        
        # Use pre-extracted text if available, otherwise download from URL
        if request.file.extracted_text:
            cv_text = request.file.extracted_text
            logger.info("Using pre-extracted text from request")
        else:
            # TODO: Implement file download and text extraction from URL
            cv_text = f"Mock CV content from {request.file.url}"
            logger.warning("No extracted_text provided, using mock content")
        
        # Parse CV using LLM
        parsed_data = await llm_service.parse_cv(cv_text, request.meta_data.dict())
        
        return AIResponse(
            success=True,
            message="CV parsed successfully",
            data=parsed_data,
            status=200
        )
    
    except Exception as e:
        logger.error(f"CV parsing failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))
