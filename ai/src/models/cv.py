"""
CV Data Models
"""
from typing import Optional

from pydantic import BaseModel, EmailStr, Field


class PersonalInfo(BaseModel):
    """Personal information extracted from CV."""
    
    name: str
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    portfolio: Optional[str] = None


class Education(BaseModel):
    """Education entry from CV."""
    
    institution: str
    degree: Optional[str] = None
    field_of_study: Optional[str] = None
    start_date: Optional[str] = None  # String to handle various date formats from LLM
    end_date: Optional[str] = None  # String to handle various date formats from LLM
    grade: Optional[str] = None
    description: Optional[str] = None


class WorkExperience(BaseModel):
    """Work experience entry from CV."""
    
    company: str
    role: str
    start_date: Optional[str] = None  # String to handle various date formats from LLM
    end_date: Optional[str] = None  # String to handle various date formats from LLM
    is_current: bool = False
    location: Optional[str] = None
    responsibilities: list[str] = Field(default_factory=list)
    achievements: list[str] = Field(default_factory=list)
    technologies: list[str] = Field(default_factory=list)


class Certification(BaseModel):
    """Certification entry from CV."""
    
    name: str
    issuer: Optional[str] = None
    date_obtained: Optional[str] = None  # String to handle various date formats from LLM
    expiry_date: Optional[str] = None  # String to handle various date formats from LLM
    credential_id: Optional[str] = None
    url: Optional[str] = None


class Project(BaseModel):
    """Project entry from CV."""
    
    name: str
    description: Optional[str] = None
    role: Optional[str] = None
    technologies: list[str] = Field(default_factory=list)
    url: Optional[str] = None
    start_date: Optional[str] = None  # String to handle various date formats from LLM
    end_date: Optional[str] = None  # String to handle various date formats from LLM


class ParsedCV(BaseModel):
    """Complete parsed CV structure."""
    
    personal_info: PersonalInfo
    summary: Optional[str] = None
    education: list[Education] = Field(default_factory=list)
    work_experience: list[WorkExperience] = Field(default_factory=list)
    skills: list[str] = Field(default_factory=list)
    certifications: list[Certification] = Field(default_factory=list)
    projects: list[Project] = Field(default_factory=list)
    languages: list[str] = Field(default_factory=list)
    interests: list[str] = Field(default_factory=list)
    raw_text: Optional[str] = None
    confidence_score: float = Field(default=0.0, ge=0.0, le=1.0)


class CVParseRequest(BaseModel):
    """Request model for parsing CV text."""
    
    text: str = Field(..., min_length=50, description="Raw CV text to parse")
    source: Optional[str] = Field(default="text", description="Source of the text (text, linkedin, etc.)")


class CVParseResponse(BaseModel):
    """Response model for CV parsing."""
    
    success: bool
    message: str
    data: Optional[ParsedCV] = None
    errors: list[str] = Field(default_factory=list)
