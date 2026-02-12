"""
Competency Signal Tests
"""
import pytest
from src.models.competency import CompetencySignal, Evidence


class TestCompetencySignal:
    """Tests for CompetencySignal model."""

    def test_create_signal(self):
        """Test creating a competency signal."""
        signal = CompetencySignal(
            skill="Python",
            score=85,
            level="Advanced",
            confidence=0.9,
        )
        
        assert signal.skill == "Python"
        assert signal.score == 85
        assert signal.level == "Advanced"

    def test_signal_with_evidence(self):
        """Test signal with evidence."""
        evidence = Evidence(
            source="CV",
            confidence=0.8,
            snippet="5 years of Python development",
        )
        
        signal = CompetencySignal(
            skill="Python",
            score=85,
            level="Advanced",
            evidence=[evidence],
        )
        
        assert len(signal.evidence) == 1
        assert signal.evidence[0].source == "CV"

    def test_score_bounds(self):
        """Test score validation."""
        # Valid score
        signal = CompetencySignal(skill="Test", score=50, level="Intermediate")
        assert signal.score == 50
        
        # Edge cases
        signal_min = CompetencySignal(skill="Test", score=0, level="Beginner")
        signal_max = CompetencySignal(skill="Test", score=100, level="Expert")
        
        assert signal_min.score == 0
        assert signal_max.score == 100
