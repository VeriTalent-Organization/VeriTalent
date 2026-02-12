"""
Backend Integration Models
Pydantic models matching the backend's request/response format.
"""
from typing import Any, Literal, Optional
from pydantic import BaseModel, Field


# Operation types supported
OperationType = Literal[
    "resume_parse",
    "job_match",
    "generate_job_description",
    "profile_enhance",
    "screening_score",
    "cover_letter",
    "talent_search",
    "competency_verify",
]


class FileMetadata(BaseModel):
    """Single file metadata from Cloudinary."""
    
    original_name: str
    mime_type: str
    size_bytes: int
    url: str  # Cloudinary secure_url
    public_id: str
    hash: Optional[str] = None


class AIRequestMetadata(BaseModel):
    """Metadata accompanying AI requests from backend."""
    
    # Required fields
    user_id: str
    veritalent_id: Optional[str] = None
    role: Optional[Literal["talent", "recruiter", "org_admin"]] = None
    location: str = "Port Harcourt"
    
    # Context-specific fields
    job_id: Optional[str] = None
    job_title: Optional[str] = None
    company_name: Optional[str] = None
    job_description: Optional[str] = None
    required_skills: Optional[list[str]] = None
    preferred_skills: Optional[list[str]] = None
    budget_range: Optional[dict[str, Any]] = None
    experience_level: Optional[str] = None
    
    # Talent context
    talent_profile: Optional[dict[str, Any]] = None
    target_role: Optional[str] = None
    career_goals: Optional[str] = None
    current_skills: Optional[list[str]] = None
    
    # Screening context
    session_id: Optional[str] = None
    screening_criteria: Optional[dict[str, Any]] = None
    
    # Additional context
    extra: Optional[dict[str, Any]] = None


class AIRequest(BaseModel):
    """Unified AI request payload from backend."""
    
    operation_type: OperationType
    has_file: bool = False
    has_multiple_files: bool = False
    
    # Single file
    file: Optional[FileMetadata] = None
    
    # Multiple files
    files: list[FileMetadata] = Field(default_factory=list)
    
    # Contextual metadata
    meta_data: AIRequestMetadata


class BackendResponse(BaseModel):
    """Response format matching backend's ApiResponse."""
    
    success: bool
    message: str
    status: int = 200
    data: Optional[dict[str, Any]] = None
    errors: Optional[dict[str, Any]] = None
    
    @classmethod
    def success_response(
        cls,
        message: str,
        data: Optional[dict[str, Any]] = None,
        status: int = 200,
    ) -> "BackendResponse":
        """Create success response."""
        return cls(
            success=True,
            message=message,
            status=status,
            data=data or {},
        )
    
    @classmethod
    def error_response(
        cls,
        message: str,
        errors: Optional[dict[str, Any]] = None,
        status: int = 500,
    ) -> "BackendResponse":
        """Create error response."""
        return cls(
            success=False,
            message=message,
            status=status,
            errors=errors or {},
        )


# Specific response models for different operations

class CVParseResult(BaseModel):
    """CV parsing result."""
    
    personal_info: dict[str, Any]
    skills: list[str]
    experience: list[dict[str, Any]]
    education: list[dict[str, Any]]
    competency_signals: list[dict[str, Any]]
    summary: str


class JobMatchResult(BaseModel):
    """Job matching result."""
    
    fit_score: int = Field(..., ge=0, le=100)
    match_level: str
    matching_skills: list[str]
    missing_skills: list[str]
    strengths: list[str]
    recommendations: list[str]
    explanation: str


class ScreeningScoreResult(BaseModel):
    """Screening score result."""
    
    overall_score: int = Field(..., ge=0, le=100)
    technical_score: int = Field(..., ge=0, le=100)
    experience_score: int = Field(..., ge=0, le=100)
    education_score: int = Field(..., ge=0, le=100)
    fit_assessment: str
    strengths: list[str]
    concerns: list[str]
    recommendation: str
