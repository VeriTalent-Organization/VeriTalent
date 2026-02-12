"""
CV Data Extractors

Functions for extracting specific components from CV data.
"""
from typing import Any

from src.models.cv import (
    PersonalInfo,
    Education,
    WorkExperience,
    Certification,
    Project,
)


def extract_personal_info(data: dict[str, Any]) -> PersonalInfo:
    """Extract personal information from parsed data."""
    return PersonalInfo(
        name=data.get("name", "Unknown"),
        email=data.get("email"),
        phone=data.get("phone"),
        location=data.get("location"),
        linkedin=data.get("linkedin"),
        github=data.get("github"),
        portfolio=data.get("portfolio"),
    )


def extract_education(data: list[dict[str, Any]]) -> list[Education]:
    """Extract education entries from parsed data."""
    education_list = []
    
    for entry in data:
        education_list.append(
            Education(
                institution=entry.get("institution", "Unknown"),
                degree=entry.get("degree"),
                field_of_study=entry.get("field_of_study") or entry.get("field"),
                start_date=entry.get("start_date"),
                end_date=entry.get("end_date"),
                grade=entry.get("grade") or entry.get("gpa"),
                description=entry.get("description"),
            )
        )
    
    return education_list


def extract_work_experience(data: list[dict[str, Any]]) -> list[WorkExperience]:
    """Extract work experience entries from parsed data."""
    experience_list = []
    
    for entry in data:
        experience_list.append(
            WorkExperience(
                company=entry.get("company", "Unknown"),
                role=entry.get("role") or entry.get("title", "Unknown"),
                start_date=entry.get("start_date"),
                end_date=entry.get("end_date"),
                is_current=entry.get("is_current", False),
                location=entry.get("location"),
                responsibilities=entry.get("responsibilities", []),
                achievements=entry.get("achievements", []),
                technologies=entry.get("technologies", []),
            )
        )
    
    return experience_list


def extract_skills(data: list[Any]) -> list[str]:
    """Extract skills from parsed data."""
    skills = []
    
    for item in data:
        if isinstance(item, str):
            skills.append(item)
        elif isinstance(item, dict):
            skills.append(item.get("name") or item.get("skill", ""))
    
    return [s for s in skills if s]


def extract_certifications(data: list[dict[str, Any]]) -> list[Certification]:
    """Extract certifications from parsed data."""
    certs = []
    
    for entry in data:
        certs.append(
            Certification(
                name=entry.get("name", "Unknown"),
                issuer=entry.get("issuer") or entry.get("organization"),
                date_obtained=entry.get("date_obtained") or entry.get("date"),
                expiry_date=entry.get("expiry_date"),
                credential_id=entry.get("credential_id"),
                url=entry.get("url"),
            )
        )
    
    return certs


def extract_projects(data: list[dict[str, Any]]) -> list[Project]:
    """Extract projects from parsed data."""
    projects = []
    
    for entry in data:
        projects.append(
            Project(
                name=entry.get("name", "Unknown"),
                description=entry.get("description"),
                role=entry.get("role"),
                technologies=entry.get("technologies", []),
                url=entry.get("url"),
                start_date=entry.get("start_date"),
                end_date=entry.get("end_date"),
            )
        )
    
    return projects
