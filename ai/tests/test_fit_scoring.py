"""
Fit Scoring Tests
"""
import pytest
from src.core.fit_scoring.scorer import FitScoringEngine
from src.models.fit_score import JobRequirement, CandidateData


class TestFitScoringEngine:
    """Tests for FitScoringEngine."""

    @pytest.fixture
    def engine(self):
        """Create engine instance."""
        return FitScoringEngine()

    @pytest.fixture
    def sample_job(self):
        """Sample job requirements."""
        return JobRequirement(
            title="Software Engineer",
            required_skills=["Python", "JavaScript", "SQL"],
            preferred_skills=["React", "Docker"],
            min_experience_years=3,
            education_requirements=["Computer Science", "Engineering"],
        )

    @pytest.fixture
    def strong_candidate(self):
        """Strong candidate data."""
        return CandidateData(
            talent_id="VT/001",
            name="John Doe",
            skills=["Python", "JavaScript", "SQL", "React", "Docker"],
            experience_years=5,
            education=["BSc Computer Science"],
        )

    @pytest.fixture
    def weak_candidate(self):
        """Weak candidate data."""
        return CandidateData(
            talent_id="VT/002",
            name="Jane Doe",
            skills=["HTML", "CSS"],
            experience_years=1,
            education=["Marketing"],
        )

    def test_calculate_skills_score_perfect_match(self, engine):
        """Test skills score with perfect match."""
        score = engine._calculate_skills_score(
            required_skills=["Python", "JavaScript"],
            preferred_skills=["Docker"],
            candidate_skills=["Python", "JavaScript", "Docker"],
        )
        
        assert score == 100.0

    def test_calculate_skills_score_partial_match(self, engine):
        """Test skills score with partial match."""
        score = engine._calculate_skills_score(
            required_skills=["Python", "JavaScript", "SQL"],
            preferred_skills=[],
            candidate_skills=["Python"],
        )
        
        # 1/3 required = ~33%
        assert score < 50

    def test_calculate_experience_score_exceeds(self, engine):
        """Test experience score when candidate exceeds requirement."""
        score = engine._calculate_experience_score(
            required_years=3,
            candidate_years=5,
        )
        
        assert score == 100.0

    def test_calculate_experience_score_partial(self, engine):
        """Test experience score with partial experience."""
        score = engine._calculate_experience_score(
            required_years=4,
            candidate_years=2,
        )
        
        # 50% of required = 70%
        assert score == 70.0

    @pytest.mark.asyncio
    async def test_score_strong_candidate(self, engine, sample_job, strong_candidate):
        """Test scoring a strong candidate."""
        result = await engine.score(
            talent_id=strong_candidate.talent_id,
            job_id="JOB-001",
            job_requirements=sample_job,
            candidate_data=strong_candidate,
        )
        
        assert result["fit_score"] >= 80
        assert len(result["matched_skills"]) >= 3

    @pytest.mark.asyncio
    async def test_score_weak_candidate(self, engine, sample_job, weak_candidate):
        """Test scoring a weak candidate."""
        result = await engine.score(
            talent_id=weak_candidate.talent_id,
            job_id="JOB-001",
            job_requirements=sample_job,
            candidate_data=weak_candidate,
        )
        
        assert result["fit_score"] < 50
        assert len(result["missing_skills"]) >= 2
