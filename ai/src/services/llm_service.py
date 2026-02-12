"""
LLM Service

Service for interacting with Azure AI (Grok model via Azure OpenAI-compatible endpoint)
Uses streaming for reasoning model to get fast responses.
"""
import json
import logging
from typing import Any
import requests
from concurrent.futures import ThreadPoolExecutor

from src.config import settings

logger = logging.getLogger(__name__)

# Thread pool for running sync requests in async context
_executor = ThreadPoolExecutor(max_workers=10)


def _parse_sse_stream(response: requests.Response) -> str:
    """
    Parse Server-Sent Events (SSE) stream and accumulate content.
    
    Args:
        response: Streaming response from requests
        
    Returns:
        Accumulated content from all chunks
    """
    content_parts = []
    
    for line in response.iter_lines(decode_unicode=True):
        if not line:
            continue
        
        # SSE format: "data: {json}"
        if line.startswith("data: "):
            data_str = line[6:]  # Remove "data: " prefix
            
            # Check for stream end
            if data_str == "[DONE]":
                break
            
            try:
                data = json.loads(data_str)
                choices = data.get("choices", [])
                
                for choice in choices:
                    delta = choice.get("delta", {})
                    content = delta.get("content")
                    if content:
                        content_parts.append(content)
                        
            except json.JSONDecodeError:
                # Skip malformed JSON chunks
                continue
    
    return "".join(content_parts)


class LLMService:
    """Service for Azure AI (Grok) interactions using streaming."""

    def __init__(self):
        # Azure AI endpoint already includes the full path /models/chat/completions
        # Use streaming for reasoning model to get immediate responses
        self.endpoint = settings.azure_ai_endpoint
        self.api_key = settings.azure_ai_api_key
        self.model = settings.azure_ai_model
        self.timeout = 300  # 5 minutes timeout for reasoning model
        self.headers = {
            "api-key": self.api_key,
            "Content-Type": "application/json",
            "Accept": "text/event-stream"  # Required for streaming
        }
        logger.info(f"Initialized Azure AI client with endpoint: {self.endpoint} (streaming enabled)")

    async def _call_llm(
        self,
        system_prompt: str,
        user_content: str,
        temperature: float = 0.7,
    ) -> str:
        """
        Make a streaming LLM call and return the accumulated response.
        
        Args:
            system_prompt: System instructions
            user_content: User message content
            temperature: Sampling temperature
            
        Returns:
            Accumulated response text from the model
        """
        import asyncio
        
        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_content},
            ],
            "temperature": temperature,
            "stream": True,
        }
        
        def make_streaming_request():
            with requests.post(
                self.endpoint,
                headers=self.headers,
                json=payload,
                timeout=self.timeout,
                stream=True
            ) as response:
                if response.status_code != 200:
                    error_text = response.text
                    raise Exception(f"Azure AI returned {response.status_code}: {error_text}")
                
                return _parse_sse_stream(response)
        
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(_executor, make_streaming_request)

    def _parse_json_response(self, content: str) -> dict:
        """Parse JSON from LLM response, handling markdown code blocks."""
        if not content:
            return {}
        
        # Try to extract JSON if wrapped in markdown
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0].strip()
        elif "```" in content:
            content = content.split("```")[1].split("```")[0].strip()
        
        return json.loads(content)

    async def parse_cv(self, cv_text: str, metadata: dict | None = None) -> dict:
        """Parse CV and extract structured information (alias for extract_cv_data)."""
        return await self.extract_cv_data(cv_text)

    async def extract_cv_data(self, text: str) -> dict[str, Any]:
        """
        Extract structured data from CV text using Azure AI (Grok).
        
        Args:
            text: Raw CV text
            
        Returns:
            Dictionary with extracted CV components
        """
        system_prompt = """You are an expert CV parser. Extract structured information from the CV text.
Return a JSON object with these fields:
- personal_info: {name, email, phone, location, linkedin, github, portfolio}
- summary: brief professional summary
- education: [{institution, degree, field_of_study, start_date, end_date, grade}]
- work_experience: [{company, role, start_date, end_date, is_current, location, responsibilities[], achievements[], technologies[]}]
- skills: [skill names]
- certifications: [{name, issuer, date_obtained}]
- projects: [{name, description, technologies[], url}]
- languages: [language names]
- confidence: float 0-1 indicating extraction confidence

Be thorough but only include information actually present in the CV."""

        try:
            logger.info(f"Calling Azure AI for CV parsing with model: {self.model} (streaming)")
            
            # Prepare request payload with streaming enabled
            payload = {
                "model": self.model,
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": f"Parse this CV:\n\n{text}"},
                ],
                "temperature": 0.7,
                "stream": True,  # Enable streaming for reasoning model
            }
            
            # Make streaming HTTP POST request to Azure AI
            # Run sync request in thread pool to avoid blocking async loop
            import asyncio
            loop = asyncio.get_event_loop()
            
            def make_streaming_request():
                with requests.post(
                    self.endpoint,
                    headers=self.headers,
                    json=payload,
                    timeout=self.timeout,
                    stream=True  # Enable response streaming
                ) as response:
                    if response.status_code != 200:
                        error_text = response.text
                        raise Exception(f"Azure AI returned {response.status_code}: {error_text}")
                    
                    return _parse_sse_stream(response)
            
            content = await loop.run_in_executor(_executor, make_streaming_request)
            
            logger.info("Received streaming response from Azure AI")
            
            # Parse JSON from response
            if content:
                # Try to extract JSON if wrapped in markdown
                if "```json" in content:
                    content = content.split("```json")[1].split("```")[0].strip()
                elif "```" in content:
                    content = content.split("```")[1].split("```")[0].strip()
                
                return json.loads(content)
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse JSON from Azure AI response: {e}")
            return {
                "personal_info": {"name": "Unable to parse - Invalid JSON"},
                "education": [],
                "work_experience": [],
                "skills": [],
                "confidence": 0.0,
                "error": f"JSON parsing error: {str(e)}",
                "fallback": True
            }
        except Exception as e:
            logger.error(f"Azure AI CV parsing failed: {e}", exc_info=True)
            return {
                "personal_info": {"name": "Unable to parse - Azure AI error"},
                "education": [],
                "work_experience": [],
                "skills": [],
                "confidence": 0.0,
                "error": str(e),
                "fallback": True
            }

    async def summarize_submission(self, text: str) -> dict[str, Any]:
        """
        Summarize a learner submission.
        
        Args:
            text: Submission text content
            
        Returns:
            Dictionary with summary and analysis
        """
        system_prompt = """You are an expert at analyzing learner work submissions.
Analyze the submission and return a JSON object with:
- highlights: [3-5 key accomplishments or demonstrations]
- skills_demonstrated: [list of skills shown]
- areas_for_improvement: [1-3 areas to work on]
- quality_score: integer 0-100
- recommendations: [2-3 actionable recommendations]

Be constructive and specific."""

        try:
            content = await self._call_llm(
                system_prompt=system_prompt,
                user_content=f"Analyze this submission:\n\n{text}",
                temperature=0.3,
            )
            return self._parse_json_response(content)
            
        except Exception as e:
            logger.error(f"LLM summarization error: {e}")
            return {
                "highlights": ["Submission received"],
                "skills_demonstrated": [],
                "areas_for_improvement": [],
                "quality_score": 50,
                "recommendations": ["Continue practicing"],
            }

    async def generate_career_insights(
        self,
        skills: list[str],
        experience: list[dict],
    ) -> dict[str, Any]:
        """
        Generate career insights based on skills and experience.
        
        Args:
            skills: List of skills
            experience: List of work experience
            
        Returns:
            Dictionary with career insights
        """
        system_prompt = """You are a career advisor AI.
Based on the skills and experience provided, return a JSON object with:
- suggested_roles: [5 suitable job roles]
- growth_areas: [skills to develop]
- market_readiness: float 0-1
- career_trajectory: brief description of career path
- recommendations: [3-5 actionable career recommendations]

Be realistic and practical."""

        try:
            user_content = f"""
Skills: {', '.join(skills)}

Experience:
{json.dumps(experience, indent=2)}
"""
            
            content = await self._call_llm(
                system_prompt=system_prompt,
                user_content=user_content,
                temperature=0.4,
            )
            return self._parse_json_response(content)
            
        except Exception as e:
            logger.error(f"LLM career insights error: {e}")
            return {
                "suggested_roles": [],
                "growth_areas": [],
                "market_readiness": 0.5,
                "recommendations": [],
            }

    async def calculate_fit_score_explanation(
        self,
        job_requirements: dict,
        candidate_data: dict,
        score: int,
    ) -> str:
        """
        Generate human-readable explanation for a fit score.
        
        Args:
            job_requirements: Job requirements
            candidate_data: Candidate data
            score: Calculated fit score
            
        Returns:
            Human-readable explanation
        """
        system_prompt = """Generate a brief, professional explanation for why a candidate 
received a particular fit score for a job. Be specific about strengths and gaps.
Keep it to 2-3 sentences."""

        try:
            user_content = f"""
Job Requirements: {json.dumps(job_requirements)}
Candidate Data: {json.dumps(candidate_data)}
Fit Score: {score}/100
"""
            
            content = await self._call_llm(
                system_prompt=system_prompt,
                user_content=user_content,
                temperature=0.3,
            )
            return content or f"Candidate scored {score}/100 based on skills and experience alignment."
            
        except Exception as e:
            logger.error(f"LLM explanation error: {e}")
            return f"Candidate scored {score}/100 based on skills and experience alignment."

    async def calculate_job_fit(
        self,
        talent_profile: dict[str, Any],
        job_details: dict[str, Any],
    ) -> dict[str, Any]:
        """
        Calculate talent-to-job fit score.
        
        Args:
            talent_profile: Talent skills, experience, etc.
            job_details: Job requirements and details
            
        Returns:
            Job match result with fit score
        """
        system_prompt = """You are an expert job matching AI.
Calculate how well a talent matches a job and return JSON with:
- fit_score: int 0-100
- match_level: "poor" | "fair" | "good" | "excellent"
- matching_skills: [skills that match]
- missing_skills: [required skills not present]
- strengths: [3-5 key strengths for this role]
- recommendations: [2-3 suggestions to improve fit]
- explanation: brief explanation of the score

Be objective and thorough."""

        try:
            user_content = f"""
Talent Profile:
{json.dumps(talent_profile, indent=2)}

Job Details:
{json.dumps(job_details, indent=2)}
"""
            
            content = await self._call_llm(
                system_prompt=system_prompt,
                user_content=user_content,
                temperature=0.2,
            )
            return self._parse_json_response(content)
            
        except Exception as e:
            logger.error(f"Job match error: {e}")
            return self._default_job_match()

    async def score_candidate(
        self,
        cv_data: dict[str, Any],
        criteria: dict[str, Any],
    ) -> dict[str, Any]:
        """
        Score candidate against screening criteria.
        
        Args:
            cv_data: Parsed CV data
            criteria: Screening criteria
            
        Returns:
            Screening score result
        """
        system_prompt = """You are a candidate screening AI.
Score the candidate against the criteria and return JSON with:
- overall_score: int 0-100
- technical_score: int 0-100
- experience_score: int 0-100
- education_score: int 0-100
- fit_assessment: brief assessment paragraph
- strengths: [3-5 strengths]
- concerns: [1-3 concerns if any]
- recommendation: "reject" | "maybe" | "interview" | "strong_yes"

Be thorough and objective."""

        try:
            user_content = f"""
Candidate CV:
{json.dumps(cv_data, indent=2)}

Screening Criteria:
{json.dumps(criteria, indent=2)}
"""
            
            content = await self._call_llm(
                system_prompt=system_prompt,
                user_content=user_content,
                temperature=0.1,
            )
            return self._parse_json_response(content)
            
        except Exception as e:
            logger.error(f"Screening error: {e}")
            return self._default_screening_score()

    async def generate_job_description_from_params(self, params: dict[str, Any]) -> dict[str, Any]:
        """
        Generate job description using AI.
        
        Args:
            params: Job parameters (title, skills, level, etc.)
            
        Returns:
            Generated job description
        """
        system_prompt = """You are an expert job description writer.
Generate a professional job description and return JSON with:
- description: compelling job overview paragraph
- responsibilities: [5-8 key responsibilities]
- requirements: [must-have qualifications]
- nice_to_have: [preferred qualifications]

Be specific and professional."""

        try:
            content = await self._call_llm(
                system_prompt=system_prompt,
                user_content=f"Generate job description for:\n{json.dumps(params, indent=2)}",
                temperature=0.5,
            )
            return self._parse_json_response(content)
            
        except Exception as e:
            logger.error(f"JD generation error: {e}")
            return {}

    async def suggest_profile_improvements(
        self,
        profile: dict[str, Any],
    ) -> dict[str, Any]:
        """
        Suggest profile enhancement for talent.
        
        Args:
            profile: Talent profile
            
        Returns:
            Enhancement suggestions
        """
        system_prompt = """You are a career development AI.
Analyze the talent profile and suggest improvements. Return JSON with:
- missing_skills: [important skills to add]
- skill_gaps: [areas needing development]
- recommendations: [3-5 actionable improvements]
- suggested_courses: [relevant courses/certifications]

Be constructive and practical."""

        try:
            content = await self._call_llm(
                system_prompt=system_prompt,
                user_content=f"Analyze profile:\n{json.dumps(profile, indent=2)}",
                temperature=0.3,
            )
            return self._parse_json_response(content)
            
        except Exception as e:
            logger.error(f"Profile enhancement error: {e}")
            return {}

    async def generate_cover_letter_for_job(
        self,
        talent_profile: dict[str, Any],
        job_details: dict[str, Any],
    ) -> dict[str, Any]:
        """
        Generate cover letter for job application.
        
        Args:
            talent_profile: Talent background
            job_details: Job information
            
        Returns:
            Generated cover letter
        """
        system_prompt = """You are a professional cover letter writer.
Write a compelling cover letter and return JSON with:
- text: the full cover letter
- tone: the tone used ("professional" | "enthusiastic" | "formal")
- word_count: approximate word count

Keep it to 250-350 words."""

        try:
            user_content = f"""
Talent Profile:
{json.dumps(talent_profile, indent=2)}

Job Details:
{json.dumps(job_details, indent=2)}
"""
            
            content = await self._call_llm(
                system_prompt=system_prompt,
                user_content=user_content,
                temperature=0.6,
            )
            return self._parse_json_response(content)
            
        except Exception as e:
            logger.error(f"Cover letter error: {e}")
            return {}

    def _default_job_match(self) -> dict[str, Any]:
        """Default job match result on error."""
        return {
            "fit_score": 50,
            "match_level": "fair",
            "matching_skills": [],
            "missing_skills": [],
            "strengths": [],
            "recommendations": [],
            "explanation": "Unable to calculate detailed match",
        }

    def _default_screening_score(self) -> dict[str, Any]:
        """Default screening score on error."""
        return {
            "overall_score": 50,
            "technical_score": 50,
            "experience_score": 50,
            "education_score": 50,
            "fit_assessment": "Unable to complete screening assessment",
            "strengths": [],
            "concerns": [],
            "recommendation": "maybe",
        }
    
    async def calculate_fit_score(
        self,
        cv_text: str | None,
        job_description: str | None,
        required_skills: list[str],
        metadata: dict | None = None
    ) -> dict:
        """Calculate talent-to-job fit score."""
        metadata = metadata or {}
        
        prompt = f"""Analyze the fit between this candidate and job.

Job Title: {metadata.get('job_title', 'N/A')}
Required Skills: {', '.join(required_skills)}
Job Description: {job_description or 'N/A'}

Candidate CV: {cv_text or 'Profile data from metadata'}

Return JSON:
{{
  "overall_score": 0-100,
  "skill_matches": [{{"skill": "", "match": true}}],
  "missing_skills": ["skill1"],
  "strengths": ["strength1"],
  "recommendations": ["rec1"]
}}"""
        
        try:
            content = await self._call_llm(
                system_prompt="You are an expert at matching candidates to jobs.",
                user_content=prompt,
                temperature=0.3,
            )
            return self._parse_json_response(content)
        except Exception as e:
            logger.error(f"Fit score calculation error: {e}")
            return self._default_job_match()
    
    async def score_candidate_for_screening(
        self,
        cv_text: str | None,
        criteria: dict,
        metadata: dict | None = None
    ) -> dict:
        """Score candidate for screening session."""
        
        prompt = f"""Score this candidate against screening criteria.

Criteria: {json.dumps(criteria, indent=2)}
CV: {cv_text or 'Talent profile from system'}

Return JSON:
{{
  "total_score": 0-100,
  "criteria_scores": {{}},
  "strengths": [],
  "weaknesses": [],
  "recommendation": "shortlist/review/reject"
}}"""
        
        try:
            content = await self._call_llm(
                system_prompt="You are a candidate screening expert.",
                user_content=prompt,
                temperature=0.2,
            )
            return self._parse_json_response(content)
        except Exception as e:
            logger.error(f"Candidate scoring error: {e}")
            return self._default_screening_score()
    
    async def generate_job_description(
        self,
        job_title: str | None,
        metadata: dict | None = None
    ) -> dict:
        """Generate AI-powered job description."""
        
        prompt = f"""Generate a professional job description.

Job Title: {job_title}
Additional Context: {json.dumps(metadata or {}, indent=2)}

Return JSON:
{{
  "title": "",
  "summary": "",
  "responsibilities": [],
  "requirements": [],
  "preferred_qualifications": [],
  "about_role": ""
}}"""
        
        try:
            content = await self._call_llm(
                system_prompt="You are an expert job description writer.",
                user_content=prompt,
                temperature=0.7,
            )
            return self._parse_json_response(content)
        except Exception as e:
            logger.error(f"JD generation error: {e}")
            return {"error": str(e)}
    
    async def enhance_profile(
        self,
        cv_text: str | None,
        metadata: dict | None = None
    ) -> dict:
        """Provide profile enhancement suggestions."""
        
        prompt = f"""Analyze this profile and suggest improvements.

Profile: {cv_text or 'User metadata'}
Context: {json.dumps(metadata or {}, indent=2)}

Return JSON:
{{
  "completeness_score": 0-100,
  "missing_sections": [],
  "skill_suggestions": [],
  "formatting_tips": [],
  "industry_recommendations": []
}}"""
        
        try:
            content = await self._call_llm(
                system_prompt="You are a career development expert.",
                user_content=prompt,
                temperature=0.5,
            )
            return self._parse_json_response(content)
        except Exception as e:
            logger.error(f"Profile enhancement error: {e}")
            return {"error": str(e)}
    
    async def generate_cover_letter(
        self,
        cv_text: str | None = None,
        job_title: str | None = None,
        job_description: str | None = None,
        company_name: str | None = None,
        candidate_info: dict | None = None,
        metadata: dict | None = None
    ) -> dict:
        """Generate personalized cover letter."""
        
        prompt = f"""Generate a professional cover letter.

Job Title: {job_title}
Company: {company_name or 'N/A'}
Job Description: {job_description}
Candidate CV: {cv_text or 'Profile data'}
Additional Context: {json.dumps(candidate_info or metadata or {}, indent=2)}

Return JSON:
{{
  "cover_letter": "full text",
  "cover_letter_text": "full text",
  "key_highlights": [],
  "tone": "professional"
}}"""
        
        try:
            content = await self._call_llm(
                system_prompt="You are a professional cover letter writer.",
                user_content=prompt,
                temperature=0.7,
            )
            return self._parse_json_response(content)
        except Exception as e:
            logger.error(f"Cover letter generation error: {e}")
            return {
                "cover_letter_text": f"Dear Hiring Manager,\n\nI am writing to express my interest in the {job_title} position...",
                "key_highlights": ["Relevant experience", "Strong skills match"],
                "tone": "professional",
                "error": str(e)
            }


# Singleton instance
llm_service = LLMService()
