"""Request/Response models for AI operations."""
from typing import Optional, Any
from pydantic import BaseModel, Field


class FileInfo(BaseModel):
    """Single file information."""
    
    original_name: str
    mime_type: str
    size_bytes: int
    url: str
    public_id: str
    hash: Optional[str] = None
    extracted_text: Optional[str] = None  # Pre-extracted text from backend


class MetaData(BaseModel):
    """Common metadata for AI operations."""
    
    user_id: str
    veritalent_id: Optional[str] = None
    role: Optional[str] = Field(None, description="talent | recruiter | org_admin")
    location: Optional[str] = None
    
    # Job-related
    job_id: Optional[str] = None
    job_title: Optional[str] = None
    company_name: Optional[str] = None
    job_description: Optional[str] = None
    required_skills: Optional[list[str]] = None
    preferred_skills: Optional[list[str]] = None
    
    # Talent-related
    target_role: Optional[str] = None
    career_goals: Optional[str] = None
    current_skills: Optional[list[str]] = None
    
    # Screening-related
    screening_session_id: Optional[str] = None
    session_id: Optional[str] = None
    active_criteria: Optional[dict[str, Any]] = None
    screening_criteria: Optional[dict[str, Any]] = None
    
    # TAPI-related
    cohort_id: Optional[str] = None
    program_name: Optional[str] = None
    
    # Extra fields
    class Config:
        extra = "allow"


# === CV Parse Request ===
class CVParseRequest(BaseModel):
    """Request to parse a CV."""
    
    file: FileInfo
    meta_data: MetaData


# === Job Match Request ===
class JobMatchRequest(BaseModel):
    """Request to calculate job-talent fit score."""
    
    file: Optional[FileInfo] = None
    meta_data: MetaData


# === Screening Score Request ===
class ScreeningScoreRequest(BaseModel):
    """Request to score candidates for screening."""
    
    has_file: bool = False
    has_multiple_files: bool = False
    file: Optional[FileInfo] = None
    files: Optional[list[FileInfo]] = None
    meta_data: MetaData


# === Job Description Generation Request ===
class JobDescriptionRequest(BaseModel):
    """Request to generate job description."""
    
    meta_data: MetaData


# === Cover Letter Generation Request ===
class CoverLetterRequest(BaseModel):
    """Request to generate cover letter."""
    
    file: Optional[FileInfo] = None  # Optional CV
    meta_data: MetaData


# === Profile Enhancement Request ===
class ProfileEnhanceRequest(BaseModel):
    """Request to enhance talent profile."""
    
    file: Optional[FileInfo] = None
    meta_data: MetaData


# === Generic AI Response ===
class AIResponse(BaseModel):
    """Standard AI response format matching backend."""
    
    success: bool = True
    message: str
    data: dict[str, Any]
    status: int = 200
