"""
Fit Score Data Models
"""
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class ScoreBreakdown(BaseModel):
    """Breakdown of fit score components."""
    
    skills_match: float = Field(default=0.0, ge=0.0, le=100.0)
    experience_match: float = Field(default=0.0, ge=0.0, le=100.0)
    education_match: float = Field(default=0.0, ge=0.0, le=100.0)
    culture_fit: float = Field(default=0.0, ge=0.0, le=100.0)


class ExplainabilityFactor(BaseModel):
    """Individual factor contributing to fit score."""
    
    factor: str
    weight: float = Field(..., ge=0.0, le=1.0)
    contribution: float
    description: Optional[str] = None


class JobRequirement(BaseModel):
    """Job requirement specification."""
    
    title: str
    required_skills: list[str] = Field(default_factory=list)
    preferred_skills: list[str] = Field(default_factory=list)
    min_experience_years: int = 0
    education_requirements: list[str] = Field(default_factory=list)
    description: Optional[str] = None
    culture_keywords: list[str] = Field(default_factory=list)


class CandidateData(BaseModel):
    """Candidate data for scoring."""
    
    talent_id: str
    name: str
    skills: list[str] = Field(default_factory=list)
    experience_years: float = 0.0
    education: list[str] = Field(default_factory=list)
    competency_signals: list[dict] = Field(default_factory=list)


class FitScoreResult(BaseModel):
    """Result of fit score calculation."""
    
    talent_id: str
    job_id: str
    fit_score: int = Field(..., ge=0, le=100)
    breakdown: ScoreBreakdown
    explainability: list[ExplainabilityFactor] = Field(default_factory=list)
    recommendations: list[str] = Field(default_factory=list)
    matched_skills: list[str] = Field(default_factory=list)
    missing_skills: list[str] = Field(default_factory=list)
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class FitScoreRequest(BaseModel):
    """Request model for calculating fit score."""
    
    talent_id: str
    job_id: str
    job_requirements: JobRequirement
    candidate_data: CandidateData


class FitScoreResponse(BaseModel):
    """Response model for fit score."""
    
    success: bool
    talent_id: str
    job_id: str
    fit_score: int
    breakdown: ScoreBreakdown
    explainability: list[ExplainabilityFactor] = Field(default_factory=list)
    recommendations: list[str] = Field(default_factory=list)


class BatchFitScoreRequest(BaseModel):
    """Request model for batch fit scoring."""
    
    job_id: str
    job_requirements: JobRequirement
    candidates: list[CandidateData]


class BatchFitScoreResponse(BaseModel):
    """Response model for batch fit scoring."""
    
    success: bool
    job_id: str
    total_candidates: int
    results: list[FitScoreResult] = Field(default_factory=list)
