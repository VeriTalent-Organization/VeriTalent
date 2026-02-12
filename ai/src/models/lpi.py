"""
LPI (Learning & Performance Intelligence) Data Models
"""
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class LPISubmission(BaseModel):
    """Learner submission record."""
    
    id: str
    learner_name: str
    learner_email: str
    program: str
    submission_type: str
    submitted_at: datetime
    status: str = Field(default="queued", description="queued, processing, completed, failed")
    file_url: Optional[str] = None
    link: Optional[str] = None
    notes: Optional[str] = None
    failure_reason: Optional[str] = None


class WeeklySummary(BaseModel):
    """Weekly performance summary."""
    
    highlights: list[str] = Field(default_factory=list)
    areas_for_improvement: list[str] = Field(default_factory=list)
    skills_demonstrated: list[str] = Field(default_factory=list)
    score_trend: dict = Field(default_factory=dict)
    supervisor_recommendations: list[str] = Field(default_factory=list)


class CompetencySignalLPI(BaseModel):
    """Competency signal for LPI reports."""
    
    skill: str
    level: str
    score: int = Field(..., ge=0, le=100)
    improvement: Optional[float] = None


class LPIReport(BaseModel):
    """LPI report structure."""
    
    id: str
    learner_id: str
    learner_name: str
    learner_email: str
    program: str
    period_start: datetime
    period_end: datetime
    report_type: str = Field(default="weekly", description="weekly, monthly, final")
    weekly_summary: Optional[WeeklySummary] = None
    competency_signals: list[CompetencySignalLPI] = Field(default_factory=list)
    growth_recommendations: list[str] = Field(default_factory=list)
    overall_score: int = Field(default=0, ge=0, le=100)
    generated_at: datetime = Field(default_factory=datetime.utcnow)
    download_url: Optional[str] = None


class LPISubmissionRequest(BaseModel):
    """Request model for LPI submission."""
    
    learner_name: str
    learner_email: str
    program: str
    submission_type: str = "Project"
    link: Optional[str] = None
    notes: Optional[str] = None


class LPISubmissionResponse(BaseModel):
    """Response model for LPI submission."""
    
    success: bool
    submission_id: str
    status: str
    message: str


class ProcessingStatusResponse(BaseModel):
    """Response model for processing status."""
    
    processed: int
    in_queue: int
    failed: int
    last_updated: Optional[datetime] = None
    failed_items: list[dict] = Field(default_factory=list)


class LPIReportResponse(BaseModel):
    """Response model for LPI report."""
    
    success: bool
    report: LPIReport
