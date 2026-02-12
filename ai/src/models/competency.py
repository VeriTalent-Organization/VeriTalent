"""
Competency Signal Data Models
"""
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class Evidence(BaseModel):
    """Evidence supporting a competency signal."""
    
    source: str = Field(..., description="Source: CV, PR, V.Cert, TAPI, Ref")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Confidence score")
    snippet: str = Field(..., description="Relevant text snippet")
    date: Optional[datetime] = None
    weight_contribution: float = Field(default=0.0, ge=0.0, le=100.0, description="Contribution to final score")


class SourceBreakdown(BaseModel):
    """Breakdown of score contributions by source."""
    
    cv_analysis: float = Field(default=0.0, ge=0.0, le=15.0, description="CV/Profile contribution (max 15%)")
    professional_recommendations: float = Field(default=0.0, ge=0.0, le=15.0, description="PR contribution (max 15%)")
    verified_certifications: float = Field(default=0.0, ge=0.0, le=20.0, description="V.Cert contribution (max 20%)")
    tapi_intelligence: float = Field(default=0.0, ge=0.0, le=20.0, description="TAPI contribution (max 20%)")
    work_references: float = Field(default=0.0, ge=0.0, le=20.0, description="Ref contribution (max 20%)")
    base_signal: float = Field(default=10.0, ge=0.0, le=10.0, description="Base credibility (10%)")


class CompetencySignal(BaseModel):
    """Individual competency signal with multi-source validation."""
    
    skill: str
    score: int = Field(..., ge=0, le=100, description="Competency score 0-100")
    level: str = Field(..., description="Poor, Low, Good, Very Good, Excellent")
    evidence: list[Evidence] = Field(default_factory=list)
    source_breakdown: SourceBreakdown = Field(default_factory=SourceBreakdown)
    confidence: float = Field(default=0.0, ge=0.0, le=1.0)
    verified: bool = False
    verified_by: Optional[str] = None
    last_updated: Optional[datetime] = None


class BehavioralIndicator(BaseModel):
    """Behavioral indicator scores."""
    
    collaboration: float = Field(default=0.0, ge=0.0, le=1.0)
    consistency: float = Field(default=0.0, ge=0.0, le=1.0)
    problem_solving: float = Field(default=0.0, ge=0.0, le=1.0)
    communication: float = Field(default=0.0, ge=0.0, le=1.0)
    adaptability: float = Field(default=0.0, ge=0.0, le=1.0)


class CompetencyRequest(BaseModel):
    """Request model for generating competency signals."""
    
    talent_id: str
    cv_data: Optional[dict] = None
    professional_recommendations: list[dict] = Field(default_factory=list, description="Verified endorsements")
    verified_certifications: list[dict] = Field(default_factory=list, description="Authenticated credentials")
    tapi_data: list[dict] = Field(default_factory=list, description="TAPI performance data")
    work_references: list[dict] = Field(default_factory=list, description="Employment references")
    work_samples: list[dict] = Field(default_factory=list, description="Project evidence")
    courses: list[dict] = Field(default_factory=list, description="Course completions")


class CompetencyResponse(BaseModel):
    """Response model for competency signals."""
    
    success: bool
    talent_id: str
    signals: list[CompetencySignal] = Field(default_factory=list)
    behavioral_indicators: Optional[BehavioralIndicator] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
