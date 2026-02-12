"""
Competency Signal API Routes

Endpoints for generating and retrieving AI-backed competency signals.
"""
from fastapi import APIRouter, HTTPException, status

from src.models.competency import (
    CompetencyRequest,
    CompetencyResponse,
    CompetencySignal,
)
from src.core.competency.signal_generator import CompetencySignalGenerator

router = APIRouter()

# Initialize service
signal_generator = CompetencySignalGenerator()


@router.post("/signals", response_model=CompetencyResponse)
async def generate_competency_signals(request: CompetencyRequest):
    """
    Generate AI-backed competency signals from talent data using weighted multi-source validation.
    
    Analyzes (with weights):
    - CV / Profile Analysis (15%)
    - Professional Recommendations (15%)
    - Verified Certifications (20%)
    - TAPI Intelligence (20%)
    - Work Experience References (20%)
    - Base Signal Mark (10%)
    
    Returns skill-level assessments with explainable weighted scores.
    """
    try:
        signals = await signal_generator.generate(
            talent_id=request.talent_id,
            cv_data=request.cv_data,
            professional_recommendations=request.professional_recommendations,
            verified_certifications=request.verified_certifications,
            tapi_data=request.tapi_data,
            work_references=request.work_references,
            work_samples=request.work_samples,
        )
        
        return CompetencyResponse(
            success=True,
            talent_id=request.talent_id,
            signals=signals,
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate competency signals: {str(e)}",
        )


@router.get("/signals/{talent_id}", response_model=CompetencyResponse)
async def get_competency_signals(talent_id: str):
    """
    Retrieve stored competency signals for a talent.
    
    Returns latest computed signals from the database.
    """
    try:
        signals = await signal_generator.get_stored_signals(talent_id)
        
        if not signals:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No competency signals found for talent: {talent_id}",
            )
        
        return CompetencyResponse(
            success=True,
            talent_id=talent_id,
            signals=signals,
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve competency signals: {str(e)}",
        )


@router.post("/signals/{talent_id}/refresh")
async def refresh_competency_signals(talent_id: str):
    """
    Trigger a refresh of competency signals for a talent.
    
    Re-analyzes all available data sources and updates signals.
    """
    try:
        result = await signal_generator.refresh_signals(talent_id)
        
        return {
            "success": True,
            "talent_id": talent_id,
            "message": "Competency signals refresh initiated",
            "job_id": result.get("job_id"),
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to refresh competency signals: {str(e)}",
        )


@router.get("/skills/taxonomy")
async def get_skills_taxonomy():
    """
    Get the skills taxonomy used for competency mapping.
    
    Returns hierarchical skill categories and definitions.
    """
    # This would load from data/skills_taxonomy.json
    return {
        "version": "1.0",
        "categories": [
            {
                "name": "Technical Skills",
                "skills": [
                    {"id": "python", "name": "Python", "category": "Programming"},
                    {"id": "javascript", "name": "JavaScript", "category": "Programming"},
                    {"id": "data_analysis", "name": "Data Analysis", "category": "Data Science"},
                ]
            },
            {
                "name": "Soft Skills",
                "skills": [
                    {"id": "communication", "name": "Communication", "category": "Interpersonal"},
                    {"id": "leadership", "name": "Leadership", "category": "Management"},
                    {"id": "problem_solving", "name": "Problem Solving", "category": "Cognitive"},
                ]
            },
        ],
    }
