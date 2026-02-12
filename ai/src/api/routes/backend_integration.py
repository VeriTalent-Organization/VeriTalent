"""
Backend Integration Router
Unified endpoint for processing AI requests from the backend.
"""
import logging
from fastapi import APIRouter, Depends, HTTPException, status

from src.api.dependencies import ApiKeyDep
from src.models.backend_integration import AIRequest, BackendResponse
from src.core.ai_operations import ai_handler

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/ai", tags=["Backend Integration"])


@router.post("/process", response_model=BackendResponse)
async def process_ai_request(
    request: AIRequest,
    api_key: ApiKeyDep,
) -> BackendResponse:
    """
    Unified AI processing endpoint for backend integration.
    
    Accepts requests from the backend with standardized payload format
    and routes to appropriate AI operation handler.
    
    **Operation Types:**
    - `resume_parse` - Parse CV and extract structured data
    - `job_match` - Calculate talent-to-job fit score
    - `generate_job_description` - AI-generate job descriptions
    - `profile_enhance` - Suggest profile improvements
    - `screening_score` - Score candidate for screening
    - `cover_letter` - Generate cover letter
    - `talent_search` - Semantic talent search
    - `competency_verify` - Verify skills from activity
    
    **Authentication:**
    - Requires `X-API-Key` header with configured API key
    
    **Request Format:**
    ```json
    {
      "operation_type": "resume_parse",
      "has_file": true,
      "file": {
        "url": "cloudinary_url",
        "original_name": "cv.pdf",
        "mime_type": "application/pdf",
        ...
      },
      "meta_data": {
        "user_id": "...",
        "veritalent_id": "VT/001",
        "role": "talent",
        ...
      }
    }
    ```
    
    **Response Format:**
    ```json
    {
      "success": true,
      "message": "Operation completed successfully",
      "status": 200,
      "data": { ... }
    }
    ```
    """
    try:
        logger.info(
            f"Processing AI request: {request.operation_type} "
            f"for user {request.meta_data.user_id}"
        )
        
        # Route to appropriate handler
        result_data = None
        
        if request.operation_type == "resume_parse":
            result_data = await ai_handler.handle_resume_parse(request)
            message = "CV parsed successfully"
            
        elif request.operation_type == "job_match":
            result_data = await ai_handler.handle_job_match(request)
            message = "Job match calculated successfully"
            
        elif request.operation_type == "screening_score":
            result_data = await ai_handler.handle_screening_score(request)
            message = "Screening score calculated successfully"
            
        elif request.operation_type == "generate_job_description":
            result_data = await ai_handler.handle_generate_job_description(request)
            message = "Job description generated successfully"
            
        elif request.operation_type == "profile_enhance":
            result_data = await ai_handler.handle_profile_enhance(request)
            message = "Profile enhancement suggestions generated"
            
        elif request.operation_type == "cover_letter":
            result_data = await ai_handler.handle_cover_letter(request)
            message = "Cover letter generated successfully"
            
        elif request.operation_type == "talent_search":
            result_data = await ai_handler.handle_talent_search(request)
            message = "Talent search completed"
            
        elif request.operation_type == "competency_verify":
            result_data = await ai_handler.handle_competency_verify(request)
            message = "Competency verification completed"
            
        else:
            raise ValueError(f"Unknown operation type: {request.operation_type}")
        
        logger.info(f"AI operation {request.operation_type} completed successfully")
        
        return BackendResponse.success_response(
            message=message,
            data=result_data,
            status=200,
        )
        
    except ValueError as e:
        logger.error(f"Validation error: {e}")
        return BackendResponse.error_response(
            message=str(e),
            status=400,
            errors={"validation_error": str(e)},
        )
        
    except Exception as e:
        logger.error(f"AI operation failed: {e}", exc_info=True)
        return BackendResponse.error_response(
            message="AI operation failed",
            status=500,
            errors={"error": str(e)},
        )


@router.get("/health", response_model=BackendResponse)
async def health_check() -> BackendResponse:
    """
    Health check endpoint for backend integration.
    
    No authentication required.
    """
    return BackendResponse.success_response(
        message="AI service is healthy and ready for backend integration",
        data={
            "status": "healthy",
            "supported_operations": [
                "resume_parse",
                "job_match",
                "screening_score",
                "generate_job_description",
                "profile_enhance",
                "cover_letter",
                "talent_search",
                "competency_verify",
            ],
        },
    )
