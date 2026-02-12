"""
Talent Data Models
"""
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class CareerInsight(BaseModel):
    """Career insight for a talent."""
    
    suggested_roles: list[str] = Field(default_factory=list)
    growth_areas: list[str] = Field(default_factory=list)
    market_readiness: float = Field(default=0.0, ge=0.0, le=1.0)
    skill_gaps: list[str] = Field(default_factory=list)
    career_trajectory: Optional[str] = None


class GrowthRecommendation(BaseModel):
    """Growth recommendation for talent."""
    
    title: str
    description: str
    priority: str = Field(default="medium", description="low, medium, high")
    category: str = Field(default="skill", description="skill, certification, experience")
    resources: list[str] = Field(default_factory=list)


class TalentProfile(BaseModel):
    """Complete talent profile."""
    
    talent_id: str
    name: str
    veritalent_id: str
    verified: bool = False
    location: Optional[str] = None
    current_role: Optional[str] = None
    target_role: Optional[str] = None
    bio: Optional[str] = None
    education_summary: Optional[str] = None
    work_experience_summary: Optional[str] = None
    skills: list[dict] = Field(default_factory=list)
    competency_signals: list[dict] = Field(default_factory=list)
    career_insights: Optional[CareerInsight] = None
    recommendations: list[GrowthRecommendation] = Field(default_factory=list)
    ai_fit_score: Optional[int] = None
    matched_roles: list[str] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class InsightsRequest(BaseModel):
    """Request model for generating insights."""
    
    talent_id: str
    competency_signals: list[dict] = Field(default_factory=list)
    career_history: list[dict] = Field(default_factory=list)


class InsightsResponse(BaseModel):
    """Response model for insights."""
    
    success: bool
    talent_id: str
    insights: CareerInsight
    recommendations: list[GrowthRecommendation] = Field(default_factory=list)
    timestamp: datetime = Field(default_factory=datetime.utcnow)
