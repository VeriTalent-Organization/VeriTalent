"""
AI Operation Handlers
Handlers for each AI operation type requested by the backend.
"""
import logging
from typing import Any

from src.models.backend_integration import (
    AIRequest,
    CVParseResult,
    JobMatchResult,
    ScreeningScoreResult,
)
from src.services.llm_service import llm_service
from src.services.file_downloader import file_downloader

logger = logging.getLogger(__name__)


class AIOperationHandler:
    """Handles different AI operation types."""
    
    async def handle_resume_parse(self, request: AIRequest) -> dict[str, Any]:
        """
        Parse CV and extract structured data.
        
        Args:
            request: AI request with CV file URL
            
        Returns:
            Parsed CV data with competency signals
        """
        logger.info(f"Handling resume_parse for user: {request.meta_data.user_id}")
        
        if not request.file:
            raise ValueError("No file provided for resume parsing")
        
        # Download CV from Cloudinary
        cv_content = await file_downloader.download_from_url(
            request.file.url,
            request.file.original_name,
        )
        
        if not cv_content:
            raise ValueError("Failed to download CV file")
        
        # Extract text from CV
        cv_text = self._extract_text_from_file(
            cv_content,
            request.file.mime_type,
        )
        
        # Use LLM to parse CV
        parsed_data = await llm_service.parse_cv(cv_text)
        
        # Add metadata
        result = CVParseResult(
            **parsed_data,
            summary=f"CV parsed for {parsed_data.get('personal_info', {}).get('name', 'Unknown')}"
        )
        
        return result.model_dump()
    
    async def handle_job_match(self, request: AIRequest) -> dict[str, Any]:
        """
        Calculate talent-to-job fit score.
        
        Args:
            request: AI request with talent profile and job details
            
        Returns:
            Job match score and analysis
        """
        logger.info(
            f"Handling job_match for user: {request.meta_data.user_id}, "
            f"job: {request.meta_data.job_id}"
        )
        
        # Get talent profile and job details from metadata
        talent_profile = request.meta_data.talent_profile or {}
        job_details = {
            "title": request.meta_data.job_title,
            "description": request.meta_data.job_description,
            "required_skills": request.meta_data.required_skills or [],
            "preferred_skills": request.meta_data.preferred_skills or [],
            "experience_level": request.meta_data.experience_level,
        }
        
        # Use LLM to calculate fit
        match_result = await llm_service.calculate_job_fit(
            talent_profile,
            job_details,
        )
        
        result = JobMatchResult(**match_result)
        return result.model_dump()
    
    async def handle_screening_score(self, request: AIRequest) -> dict[str, Any]:
        """
        Score candidate for screening session.
        
        Args:
            request: AI request with CV and screening criteria
            
        Returns:
            Screening score and assessment
        """
        logger.info(
            f"Handling screening_score for session: {request.meta_data.session_id}"
        )
        
        # Download and parse CV if provided
        cv_data = {}
        if request.file:
            cv_content = await file_downloader.download_from_url(
                request.file.url,
                request.file.original_name,
            )
            if cv_content:
                cv_text = self._extract_text_from_file(
                    cv_content,
                    request.file.mime_type,
                )
                cv_data = await llm_service.parse_cv(cv_text)
        
        # Get screening criteria
        criteria = request.meta_data.screening_criteria or {}
        
        # Score against criteria
        score_result = await llm_service.score_candidate(cv_data, criteria)
        
        result = ScreeningScoreResult(**score_result)
        return result.model_dump()
    
    async def handle_generate_job_description(
        self,
        request: AIRequest,
    ) -> dict[str, Any]:
        """
        Generate AI-assisted job description.
        
        Args:
            request: AI request with job details
            
        Returns:
            Generated job description
        """
        logger.info(f"Handling generate_job_description for: {request.meta_data.job_title}")
        
        job_params = {
            "title": request.meta_data.job_title,
            "required_skills": request.meta_data.required_skills or [],
            "experience_level": request.meta_data.experience_level,
            "location": request.meta_data.location,
            "extra": request.meta_data.extra or {},
        }
        
        jd = await llm_service.generate_job_description(job_params)
        
        return {
            "job_description": jd["description"],
            "responsibilities": jd["responsibilities"],
            "requirements": jd["requirements"],
            "nice_to_have": jd.get("nice_to_have", []),
        }
    
    async def handle_profile_enhance(self, request: AIRequest) -> dict[str, Any]:
        """
        Suggest profile enhancements for talent.
        
        Args:
            request: AI request with talent profile
            
        Returns:
            Enhancement suggestions
        """
        logger.info(f"Handling profile_enhance for user: {request.meta_data.user_id}")
        
        talent_profile = request.meta_data.talent_profile or {}
        
        suggestions = await llm_service.suggest_profile_improvements(talent_profile)
        
        return {
            "missing_skills": suggestions["missing_skills"],
            "skill_gaps": suggestions["skill_gaps"],
            "recommendations": suggestions["recommendations"],
            "suggested_courses": suggestions.get("suggested_courses", []),
        }
    
    async def handle_cover_letter(self, request: AIRequest) -> dict[str, Any]:
        """
        Generate AI-assisted cover letter.
        
        Args:
            request: AI request with talent and job details
            
        Returns:
            Generated cover letter
        """
        logger.info(
            f"Handling cover_letter for user: {request.meta_data.user_id}, "
            f"job: {request.meta_data.job_id}"
        )
        
        talent_profile = request.meta_data.talent_profile or {}
        job_details = {
            "title": request.meta_data.job_title,
            "description": request.meta_data.job_description,
            "company": request.meta_data.extra.get("company_name", "") if request.meta_data.extra else "",
        }
        
        cover_letter = await llm_service.generate_cover_letter(
            talent_profile,
            job_details,
        )
        
        return {
            "cover_letter": cover_letter["text"],
            "tone": cover_letter.get("tone", "professional"),
            "word_count": cover_letter.get("word_count", 0),
        }
    
    async def handle_talent_search(self, request: AIRequest) -> dict[str, Any]:
        """
        Semantic search for talents.
        
        Args:
            request: AI request with search criteria
            
        Returns:
            Matching talents
        """
        logger.info(f"Handling talent_search for user: {request.meta_data.user_id}")
        
        search_criteria = request.meta_data.extra or {}
        
        # TODO: Implement vector search with Cosmos DB
        # For now, return placeholder
        
        return {
            "talents": [],
            "total": 0,
            "message": "Talent search not yet implemented - vector DB integration pending",
        }
    
    async def handle_competency_verify(self, request: AIRequest) -> dict[str, Any]:
        """
        Verify competency signals from activity data.
        
        Args:
            request: AI request with activity logs
            
        Returns:
            Verified competencies
        """
        logger.info(f"Handling competency_verify for user: {request.meta_data.user_id}")
        
        # TODO: Implement activity analysis
        # For now, return placeholder
        
        return {
            "verified_skills": [],
            "confidence_scores": {},
            "message": "Competency verification not yet implemented",
        }
    
    def _extract_text_from_file(
        self,
        content: bytes,
        mime_type: str,
    ) -> str:
        """
        Extract text from file content.
        
        Args:
            content: Raw file bytes
            mime_type: MIME type of file
            
        Returns:
            Extracted text
        """
        # For now, simple text extraction
        # TODO: Add proper PDF, DOCX parsing
        
        if mime_type == "application/pdf":
            # Placeholder - add PyPDF2 or pdfplumber
            return content.decode("utf-8", errors="ignore")
        elif "word" in mime_type or "docx" in mime_type:
            # Placeholder - add python-docx
            return content.decode("utf-8", errors="ignore")
        else:
            return content.decode("utf-8", errors="ignore")


# Singleton instance
ai_handler = AIOperationHandler()
