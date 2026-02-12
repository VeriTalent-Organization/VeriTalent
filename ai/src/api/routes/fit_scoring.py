"""
Fit Scoring API Routes

Endpoints for calculating candidate-job fit scores.
"""
from fastapi import APIRouter, HTTPException, status

from src.models.fit_score import (
    FitScoreRequest,
    FitScoreResponse,
    BatchFitScoreRequest,
    BatchFitScoreResponse,
)
from src.core.fit_scoring.scorer import FitScoringEngine

router = APIRouter()

# Initialize service
fit_scorer = FitScoringEngine()


@router.post("/score", response_model=FitScoreResponse)
async def calculate_fit_score(request: FitScoreRequest):
    """
    Calculate fit score between a candidate and a job.
    
    Analyzes:
    - Skills match
    - Experience alignment
    - Education requirements
    - Culture fit indicators
    
    Returns overall score with breakdown and explainability.
    """
    try:
        result = await fit_scorer.score(
            talent_id=request.talent_id,
            job_id=request.job_id,
            job_requirements=request.job_requirements,
            candidate_data=request.candidate_data,
        )
        
        return FitScoreResponse(
            success=True,
            talent_id=request.talent_id,
            job_id=request.job_id,
            fit_score=result["fit_score"],
            breakdown=result["breakdown"],
            explainability=result["explainability"],
            recommendations=result.get("recommendations", []),
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to calculate fit score: {str(e)}",
        )


@router.post("/batch-score", response_model=BatchFitScoreResponse)
async def batch_calculate_fit_scores(request: BatchFitScoreRequest):
    """
    Calculate fit scores for multiple candidates against a job.
    
    Returns ranked list of candidates with scores and explanations.
    """
    try:
        results = await fit_scorer.batch_score(
            job_id=request.job_id,
            job_requirements=request.job_requirements,
            candidates=request.candidates,
        )
        
        return BatchFitScoreResponse(
            success=True,
            job_id=request.job_id,
            total_candidates=len(request.candidates),
            results=results,
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to batch calculate fit scores: {str(e)}",
        )


@router.post("/rank")
async def rank_candidates(request: BatchFitScoreRequest):
    """
    Rank candidates by fit score for a specific job.
    
    Returns ordered list from best to worst fit.
    """
    try:
        ranked = await fit_scorer.rank_candidates(
            job_id=request.job_id,
            job_requirements=request.job_requirements,
            candidates=request.candidates,
        )
        
        return {
            "success": True,
            "job_id": request.job_id,
            "ranked_candidates": ranked,
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to rank candidates: {str(e)}",
        )


@router.get("/score/{talent_id}/{job_id}")
async def get_stored_fit_score(talent_id: str, job_id: str):
    """
    Retrieve a previously calculated fit score.
    """
    try:
        score = await fit_scorer.get_stored_score(talent_id, job_id)
        
        if not score:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Fit score not found for this talent-job combination",
            )
        
        return score
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve fit score: {str(e)}",
        )
