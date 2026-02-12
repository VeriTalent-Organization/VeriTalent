"""
Fit Scoring Engine

Calculates candidate-job fit scores with explainability.
"""
from typing import Optional

from src.models.fit_score import (
    FitScoreResult,
    ScoreBreakdown,
    ExplainabilityFactor,
    JobRequirement,
    CandidateData,
)
from src.services.llm_service import LLMService
from src.services.embedding_service import EmbeddingService


class FitScoringEngine:
    """Engine for calculating fit scores between candidates and jobs."""

    def __init__(self):
        self.llm_service = LLMService()
        self.embedding_service = EmbeddingService()
        
        # Default weights for scoring components
        self.weights = {
            "skills": 0.40,
            "experience": 0.30,
            "education": 0.15,
            "culture": 0.15,
        }

    async def score(
        self,
        talent_id: str,
        job_id: str,
        job_requirements: JobRequirement,
        candidate_data: CandidateData,
    ) -> dict:
        """
        Calculate fit score for a candidate-job pair.
        
        Args:
            talent_id: Candidate identifier
            job_id: Job identifier
            job_requirements: Job requirements specification
            candidate_data: Candidate data for scoring
            
        Returns:
            Dictionary with fit_score, breakdown, and explainability
        """
        # Calculate component scores
        skills_score = self._calculate_skills_score(
            job_requirements.required_skills,
            job_requirements.preferred_skills,
            candidate_data.skills,
        )
        
        experience_score = self._calculate_experience_score(
            job_requirements.min_experience_years,
            candidate_data.experience_years,
        )
        
        education_score = self._calculate_education_score(
            job_requirements.education_requirements,
            candidate_data.education,
        )
        
        culture_score = await self._calculate_culture_score(
            job_requirements.culture_keywords,
            candidate_data,
        )
        
        # Calculate weighted total
        fit_score = int(
            skills_score * self.weights["skills"] +
            experience_score * self.weights["experience"] +
            education_score * self.weights["education"] +
            culture_score * self.weights["culture"]
        )
        
        # Generate explainability factors
        explainability = self._generate_explainability(
            skills_score, experience_score, education_score, culture_score
        )
        
        # Find matched and missing skills
        matched_skills = [
            s for s in candidate_data.skills
            if s.lower() in [r.lower() for r in job_requirements.required_skills]
        ]
        missing_skills = [
            s for s in job_requirements.required_skills
            if s.lower() not in [c.lower() for c in candidate_data.skills]
        ]
        
        # Generate recommendations
        recommendations = self._generate_recommendations(
            fit_score, matched_skills, missing_skills, job_requirements
        )
        
        return {
            "fit_score": fit_score,
            "breakdown": ScoreBreakdown(
                skills_match=skills_score,
                experience_match=experience_score,
                education_match=education_score,
                culture_fit=culture_score,
            ),
            "explainability": explainability,
            "matched_skills": matched_skills,
            "missing_skills": missing_skills,
            "recommendations": recommendations,
        }

    def _calculate_skills_score(
        self,
        required_skills: list[str],
        preferred_skills: list[str],
        candidate_skills: list[str],
    ) -> float:
        """Calculate skills match score."""
        if not required_skills:
            return 100.0
        
        candidate_skills_lower = [s.lower() for s in candidate_skills]
        
        # Required skills match (70% weight)
        required_matches = sum(
            1 for s in required_skills
            if s.lower() in candidate_skills_lower
        )
        required_score = (required_matches / len(required_skills)) * 100 if required_skills else 100
        
        # Preferred skills match (30% weight)
        preferred_matches = sum(
            1 for s in preferred_skills
            if s.lower() in candidate_skills_lower
        )
        preferred_score = (preferred_matches / len(preferred_skills)) * 100 if preferred_skills else 100
        
        return required_score * 0.7 + preferred_score * 0.3

    def _calculate_experience_score(
        self,
        required_years: int,
        candidate_years: float,
    ) -> float:
        """Calculate experience match score."""
        if required_years == 0:
            return 100.0
        
        if candidate_years >= required_years:
            return 100.0
        elif candidate_years >= required_years * 0.75:
            return 85.0
        elif candidate_years >= required_years * 0.5:
            return 70.0
        elif candidate_years >= required_years * 0.25:
            return 50.0
        else:
            return 30.0

    def _calculate_education_score(
        self,
        requirements: list[str],
        candidate_education: list[str],
    ) -> float:
        """Calculate education match score."""
        if not requirements:
            return 100.0
        
        candidate_edu_lower = [e.lower() for e in candidate_education]
        
        matches = sum(
            1 for req in requirements
            if any(req.lower() in edu for edu in candidate_edu_lower)
        )
        
        return (matches / len(requirements)) * 100

    async def _calculate_culture_score(
        self,
        culture_keywords: list[str],
        candidate_data: CandidateData,
    ) -> float:
        """Calculate culture fit score using semantic similarity."""
        if not culture_keywords:
            return 75.0  # Default neutral score
        
        # TODO: Use embeddings for semantic matching
        # For now, use simple keyword matching
        candidate_text = " ".join(candidate_data.skills)
        
        matches = sum(
            1 for keyword in culture_keywords
            if keyword.lower() in candidate_text.lower()
        )
        
        return min(100, (matches / len(culture_keywords)) * 100 + 50)

    def _generate_explainability(
        self,
        skills_score: float,
        experience_score: float,
        education_score: float,
        culture_score: float,
    ) -> list[ExplainabilityFactor]:
        """Generate explainability factors for the fit score."""
        return [
            ExplainabilityFactor(
                factor="Skills Match",
                weight=self.weights["skills"],
                contribution=skills_score * self.weights["skills"],
                description=f"Candidate matches {skills_score:.0f}% of required skills",
            ),
            ExplainabilityFactor(
                factor="Experience",
                weight=self.weights["experience"],
                contribution=experience_score * self.weights["experience"],
                description=f"Experience alignment score: {experience_score:.0f}%",
            ),
            ExplainabilityFactor(
                factor="Education",
                weight=self.weights["education"],
                contribution=education_score * self.weights["education"],
                description=f"Education match: {education_score:.0f}%",
            ),
            ExplainabilityFactor(
                factor="Culture Fit",
                weight=self.weights["culture"],
                contribution=culture_score * self.weights["culture"],
                description=f"Culture alignment: {culture_score:.0f}%",
            ),
        ]

    def _generate_recommendations(
        self,
        fit_score: int,
        matched_skills: list[str],
        missing_skills: list[str],
        job_requirements: JobRequirement,
    ) -> list[str]:
        """Generate recommendations based on scoring results."""
        recommendations = []
        
        if fit_score >= 80:
            recommendations.append("Strong candidate - recommend for interview")
        elif fit_score >= 60:
            recommendations.append("Good potential - consider for initial screening")
        elif fit_score >= 40:
            recommendations.append("Partial match - may need skill development")
        else:
            recommendations.append("Limited match - consider for different role")
        
        if missing_skills:
            recommendations.append(
                f"Missing skills: {', '.join(missing_skills[:3])}"
            )
        
        if len(matched_skills) >= len(job_requirements.required_skills) * 0.8:
            recommendations.append("Excellent skills coverage")
        
        return recommendations

    async def batch_score(
        self,
        job_id: str,
        job_requirements: JobRequirement,
        candidates: list[CandidateData],
    ) -> list[FitScoreResult]:
        """Score multiple candidates for a job."""
        results = []
        
        for candidate in candidates:
            score_data = await self.score(
                talent_id=candidate.talent_id,
                job_id=job_id,
                job_requirements=job_requirements,
                candidate_data=candidate,
            )
            
            results.append(
                FitScoreResult(
                    talent_id=candidate.talent_id,
                    job_id=job_id,
                    **score_data,
                )
            )
        
        return results

    async def rank_candidates(
        self,
        job_id: str,
        job_requirements: JobRequirement,
        candidates: list[CandidateData],
    ) -> list[dict]:
        """Rank candidates by fit score."""
        results = await self.batch_score(job_id, job_requirements, candidates)
        
        # Sort by fit score descending
        ranked = sorted(results, key=lambda x: x.fit_score, reverse=True)
        
        return [
            {
                "rank": i + 1,
                "talent_id": r.talent_id,
                "fit_score": r.fit_score,
                "recommendations": r.recommendations,
            }
            for i, r in enumerate(ranked)
        ]

    async def get_stored_score(
        self,
        talent_id: str,
        job_id: str,
    ) -> Optional[dict]:
        """Retrieve a stored fit score."""
        # TODO: Implement database retrieval
        return None
