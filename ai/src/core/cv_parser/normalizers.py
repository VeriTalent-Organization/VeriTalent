"""
CV Data Normalizers

Functions for normalizing and cleaning extracted CV data.
"""
from datetime import date, datetime
from typing import Any, TypeVar

T = TypeVar("T")


def normalize_dates(items: list[T]) -> list[T]:
    """
    Normalize date fields in a list of items.
    
    Converts string dates to date objects where applicable.
    """
    for item in items:
        if hasattr(item, "start_date") and isinstance(item.start_date, str):
            item.start_date = parse_date(item.start_date)
        if hasattr(item, "end_date") and isinstance(item.end_date, str):
            item.end_date = parse_date(item.end_date)
    
    return items


def parse_date(date_str: str) -> date | None:
    """Parse a date string into a date object."""
    if not date_str:
        return None
    
    # Common date formats
    formats = [
        "%Y-%m-%d",
        "%Y/%m/%d",
        "%d/%m/%Y",
        "%d-%m-%Y",
        "%B %Y",
        "%b %Y",
        "%Y",
    ]
    
    for fmt in formats:
        try:
            return datetime.strptime(date_str.strip(), fmt).date()
        except ValueError:
            continue
    
    return None


def normalize_skills(skills: list[str]) -> list[str]:
    """
    Normalize a list of skills.
    
    - Remove duplicates (case-insensitive)
    - Strip whitespace
    - Remove empty strings
    - Capitalize properly
    """
    seen = set()
    normalized = []
    
    for skill in skills:
        if not skill:
            continue
        
        skill = skill.strip()
        skill_lower = skill.lower()
        
        if skill_lower not in seen:
            seen.add(skill_lower)
            # Capitalize first letter of each word
            normalized.append(skill.title())
    
    return normalized


def normalize_location(location: str | None) -> str | None:
    """Normalize location string."""
    if not location:
        return None
    
    # Remove extra whitespace
    location = " ".join(location.split())
    
    # Common abbreviations
    replacements = {
        "US": "United States",
        "USA": "United States",
        "UK": "United Kingdom",
        "UAE": "United Arab Emirates",
    }
    
    for abbr, full in replacements.items():
        if location.upper() == abbr:
            return full
    
    return location


def normalize_phone(phone: str | None) -> str | None:
    """Normalize phone number format."""
    if not phone:
        return None
    
    # Remove all non-digit characters except +
    digits = "".join(c for c in phone if c.isdigit() or c == "+")
    
    return digits if digits else None


def calculate_experience_years(work_experience: list[Any]) -> float:
    """Calculate total years of experience from work history."""
    total_months = 0
    
    for exp in work_experience:
        start = getattr(exp, "start_date", None)
        end = getattr(exp, "end_date", None) or date.today()
        
        if start:
            if isinstance(start, str):
                start = parse_date(start)
            if isinstance(end, str):
                end = parse_date(end)
            
            if start and end:
                months = (end.year - start.year) * 12 + (end.month - start.month)
                total_months += max(0, months)
    
    return round(total_months / 12, 1)
