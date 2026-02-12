"""
AI Insights API Routes

Endpoints for career insights and recommendations.
"""
from fastapi import APIRouter, HTTPException, status

from src.models.talent import InsightsRequest, InsightsResponse
from src.core.insights.career_recommender import CareerRecommender

router = APIRouter()

# Initialize service
career_recommender = CareerRecommender()


@router.post("/career", response_model=InsightsResponse)
async def generate_career_insights(request: InsightsRequest):
    """
    Generate AI-powered career insights for a talent.
    
    Analyzes:
    - Competency signals
    - Market trends
    - Career trajectory
    
    Returns:
    - Suggested roles
    - Growth areas
    - Recommendations
    """
    try:
        insights = await career_recommender.generate(
            talent_id=request.talent_id,
            competency_signals=request.competency_signals,
            career_history=request.career_history,
        )
        
        return InsightsResponse(
            success=True,
            talent_id=request.talent_id,
            insights=insights,
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate career insights: {str(e)}",
        )


@router.get("/career/{talent_id}")
async def get_career_insights(talent_id: str):
    """
    Retrieve stored career insights for a talent.
    """
    try:
        insights = await career_recommender.get_stored_insights(talent_id)
        
        if not insights:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No career insights found for talent: {talent_id}",
            )
        
        return {"success": True, "talent_id": talent_id, "insights": insights}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve career insights: {str(e)}",
        )


@router.get("/roles/trending")
async def get_trending_roles(
    industry: str = None,
    location: str = None,
    limit: int = 10,
):
    """
    Get trending job roles based on market data.
    """
    try:
        roles = await career_recommender.get_trending_roles(
            industry=industry,
            location=location,
            limit=limit,
        )
        
        return {"success": True, "trending_roles": roles}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get trending roles: {str(e)}",
        )


@router.get("/skills/in-demand")
async def get_in_demand_skills(
    role: str = None,
    industry: str = None,
    limit: int = 20,
):
    """
    Get in-demand skills based on market trends.
    """
    try:
        skills = await career_recommender.get_in_demand_skills(
            role=role,
            industry=industry,
            limit=limit,
        )
        
        return {"success": True, "in_demand_skills": skills}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get in-demand skills: {str(e)}",
        )


@router.post("/growth-plan/{talent_id}")
async def generate_growth_plan(talent_id: str):
    """
    Generate a personalized growth plan for a talent.
    """
    try:
        plan = await career_recommender.generate_growth_plan(talent_id)
        
        return {
            "success": True,
            "talent_id": talent_id,
            "growth_plan": plan,
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate growth plan: {str(e)}",
        )
