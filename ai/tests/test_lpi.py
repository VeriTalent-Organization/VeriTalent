"""
LPI Agent Tests
"""
import pytest
from src.core.lpi.summarizer import LPISummarizer
from src.core.lpi.report_generator import LPIReportGenerator


class TestLPISummarizer:
    """Tests for LPISummarizer."""

    @pytest.fixture
    def summarizer(self):
        """Create summarizer instance."""
        return LPISummarizer()

    @pytest.mark.asyncio
    async def test_submit_with_notes(self, summarizer):
        """Test submitting with notes only."""
        result = await summarizer.submit(
            learner_name="Test Learner",
            learner_email="test@example.com",
            program="Python 101",
            submission_type="Project",
            notes="Completed the data analysis project",
        )
        
        assert "submission_id" in result
        assert result["submission_id"] is not None

    @pytest.mark.asyncio
    async def test_list_submissions(self, summarizer):
        """Test listing submissions."""
        # Add a submission first
        await summarizer.submit(
            learner_name="Test Learner",
            learner_email="test@example.com",
            program="Python 101",
            submission_type="Project",
            notes="Test submission",
        )
        
        submissions = await summarizer.list_submissions()
        
        assert len(submissions) >= 1

    @pytest.mark.asyncio
    async def test_get_processing_status(self, summarizer):
        """Test getting processing status."""
        status = await summarizer.get_processing_status()
        
        assert "processed" in status
        assert "in_queue" in status
        assert "failed" in status


class TestLPIReportGenerator:
    """Tests for LPIReportGenerator."""

    @pytest.fixture
    def generator(self):
        """Create generator instance."""
        return LPIReportGenerator()

    @pytest.mark.asyncio
    async def test_generate_weekly(self, generator):
        """Test generating weekly reports."""
        result = await generator.generate_weekly(program="Test Program")
        
        assert "job_id" in result
        assert result["reports_generated"] >= 0

    @pytest.mark.asyncio
    async def test_generate_monthly(self, generator):
        """Test generating monthly reports."""
        result = await generator.generate_monthly(program="Test Program")
        
        assert "job_id" in result

    @pytest.mark.asyncio
    async def test_list_reports(self, generator):
        """Test listing reports."""
        # Generate a report first
        await generator.generate_weekly()
        
        reports = await generator.list_reports()
        
        assert isinstance(reports, list)
