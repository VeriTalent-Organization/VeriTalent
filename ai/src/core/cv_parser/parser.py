"""
CV Parser Service

Main service for parsing CVs and extracting structured data.
"""
from typing import Optional

from src.models.cv import ParsedCV, PersonalInfo
from src.core.cv_parser.extractors import (
    extract_personal_info,
    extract_education,
    extract_work_experience,
    extract_skills,
)
from src.core.cv_parser.normalizers import normalize_dates, normalize_skills
from src.services.llm_service import LLMService
from src.utils.document_loader import load_document


class CVParserService:
    """Service for parsing CV documents."""

    def __init__(self):
        self.llm_service = LLMService()

    async def parse(
        self,
        content: bytes,
        filename: str,
        content_type: str,
    ) -> ParsedCV:
        """
        Parse a CV document and extract structured data.
        
        Args:
            content: Raw file content as bytes
            filename: Original filename
            content_type: MIME type of the file
            
        Returns:
            ParsedCV with extracted information
        """
        # Step 1: Extract raw text from document
        raw_text = await load_document(content, filename, content_type)
        
        # Step 2: Parse using LLM
        return await self.parse_text(raw_text)

    async def parse_text(self, text: str) -> ParsedCV:
        """
        Parse CV from raw text.
        
        Args:
            text: Raw CV text
            
        Returns:
            ParsedCV with extracted information
        """
        # Use LLM to extract structured data
        extracted = await self.llm_service.extract_cv_data(text)
        
        # Extract individual components
        personal_info = extract_personal_info(extracted.get("personal_info", {}))
        education = extract_education(extracted.get("education", []))
        work_experience = extract_work_experience(extracted.get("work_experience", []))
        skills = extract_skills(extracted.get("skills", []))
        
        # Normalize data
        education = normalize_dates(education)
        work_experience = normalize_dates(work_experience)
        skills = normalize_skills(skills)
        
        return ParsedCV(
            personal_info=personal_info,
            summary=extracted.get("summary"),
            education=education,
            work_experience=work_experience,
            skills=skills,
            certifications=extracted.get("certifications", []),
            projects=extracted.get("projects", []),
            languages=extracted.get("languages", []),
            raw_text=text,
            confidence_score=extracted.get("confidence", 0.8),
        )
