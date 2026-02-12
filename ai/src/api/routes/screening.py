"""Screening and candidate evaluation endpoints."""
from fastapi import APIRouter, Depends, HTTPException
from src.models.ai_requests import ScreeningScoreRequest, AIResponse
from src.services.llm_service import LLMService
from src.api.dependencies import verify_api_key
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/screening", tags=["Screening Operations"])


@router.post("/score", response_model=AIResponse, dependencies=[Depends(verify_api_key)])
async def score_candidates(request: ScreeningScoreRequest):
    """
    Score candidate(s) for screening session.
    
    Handles:
    - Single CV scoring
    - Bulk CV scoring
    - Talent profile scoring (no CV)
    
    Returns:
    - Fit scores
    - Ranking
    - Strengths/weaknesses
    - Recommendations
    """
    try:
        llm_service = LLMService()
        
        session_id = request.meta_data.screening_session_id
        logger.info(f"Scoring candidates for session: {session_id}")
        
        results = []
        
        # Handle multiple files
        if request.has_multiple_files and request.files:
            for file_info in request.files:
                # TODO: Download and parse each CV
                cv_text = f"Mock CV from {file_info.url}"
                
                score = await llm_service.score_candidate(
                    cv_text=cv_text,
                    criteria=request.meta_data.active_criteria or {},
                    metadata=request.meta_data.dict()
                )
                
                results.append({
                    "file_name": file_info.original_name,
                    "score": score
                })
        
        # Handle single file
        elif request.has_file and request.file:
            cv_text = f"Mock CV from {request.file.url}"
            
            score = await llm_service.score_candidate(
                cv_text=cv_text,
                criteria=request.meta_data.active_criteria or {},
                metadata=request.meta_data.dict()
            )
            
            results.append({
                "file_name": request.file.original_name,
                "score": score
            })
        
        # Handle talent ID screening (no file)
        else:
            score = await llm_service.score_candidate(
                cv_text=None,
                criteria=request.meta_data.active_criteria or {},
                metadata=request.meta_data.dict()
            )
            
            results.append({"score": score})
        
        return AIResponse(
            success=True,
            message=f"Scored {len(results)} candidate(s)",
            data={"results": results},
            status=200
        )
    
    except Exception as e:
        logger.error(f"Screening scoring failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))
