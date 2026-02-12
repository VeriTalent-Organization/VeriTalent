"""
LPI Report Generator

Generates weekly, monthly, and final competency reports.
"""
from datetime import datetime, timedelta
from typing import Optional
import uuid

from src.models.lpi import LPIReport, WeeklySummary, CompetencySignalLPI
from src.services.llm_service import LLMService


class LPIReportGenerator:
    """Service for generating LPI reports."""

    def __init__(self):
        self.llm_service = LLMService()
        # In-memory storage for demo (replace with database)
        self._reports = []

    async def list_reports(
        self,
        learner_email: Optional[str] = None,
        program: Optional[str] = None,
        report_type: Optional[str] = None,
    ) -> list[dict]:
        """List generated reports with optional filters."""
        filtered = self._reports
        
        if learner_email:
            filtered = [r for r in filtered if r.learner_email == learner_email]
        
        if program:
            filtered = [r for r in filtered if r.program == program]
        
        if report_type:
            filtered = [r for r in filtered if r.report_type == report_type]
        
        return [r.model_dump() for r in filtered]

    async def get_report(self, report_id: str) -> Optional[LPIReport]:
        """Get a specific report by ID."""
        return next(
            (r for r in self._reports if r.id == report_id),
            None
        )

    async def generate_weekly(
        self,
        program: Optional[str] = None,
    ) -> dict:
        """Generate weekly summary reports for learners."""
        job_id = str(uuid.uuid4())
        
        # TODO: Implement actual report generation
        # This is a placeholder implementation
        
        now = datetime.utcnow()
        period_start = now - timedelta(days=7)
        
        # Create a sample report
        report = LPIReport(
            id=str(uuid.uuid4()),
            learner_id="sample-learner",
            learner_name="Sample Learner",
            learner_email="learner@example.com",
            program=program or "Default Program",
            period_start=period_start,
            period_end=now,
            report_type="weekly",
            weekly_summary=WeeklySummary(
                highlights=[
                    "Completed 3 project tasks on schedule",
                    "Demonstrated strong problem-solving skills",
                ],
                areas_for_improvement=[
                    "Time management on complex tasks",
                ],
                skills_demonstrated=["Python", "Data Analysis"],
                score_trend={"previous": 72, "current": 78},
                supervisor_recommendations=[
                    "Continue with advanced Python topics",
                ],
            ),
            competency_signals=[
                CompetencySignalLPI(
                    skill="Python",
                    level="Intermediate",
                    score=65,
                    improvement=8.0,
                ),
                CompetencySignalLPI(
                    skill="Data Analysis",
                    level="Beginner",
                    score=45,
                    improvement=12.0,
                ),
            ],
            growth_recommendations=[
                "Complete SQL fundamentals course",
                "Practice with real-world datasets",
            ],
            overall_score=68,
        )
        
        self._reports.append(report)
        
        return {"job_id": job_id, "reports_generated": 1}

    async def generate_monthly(
        self,
        program: Optional[str] = None,
    ) -> dict:
        """Generate monthly aggregated reports."""
        job_id = str(uuid.uuid4())
        
        now = datetime.utcnow()
        period_start = now - timedelta(days=30)
        
        # Create a sample monthly report
        report = LPIReport(
            id=str(uuid.uuid4()),
            learner_id="sample-learner",
            learner_name="Sample Learner",
            learner_email="learner@example.com",
            program=program or "Default Program",
            period_start=period_start,
            period_end=now,
            report_type="monthly",
            competency_signals=[
                CompetencySignalLPI(
                    skill="Python",
                    level="Intermediate",
                    score=72,
                    improvement=15.0,
                ),
                CompetencySignalLPI(
                    skill="Data Analysis",
                    level="Intermediate",
                    score=58,
                    improvement=20.0,
                ),
                CompetencySignalLPI(
                    skill="Problem Solving",
                    level="Advanced",
                    score=75,
                    improvement=10.0,
                ),
            ],
            growth_recommendations=[
                "Ready for intermediate-level projects",
                "Consider pair programming opportunities",
                "Start learning cloud technologies",
            ],
            overall_score=72,
        )
        
        self._reports.append(report)
        
        return {"job_id": job_id, "reports_generated": 1}

    async def generate_final(
        self,
        learner_id: str,
        program: str,
    ) -> LPIReport:
        """Generate final end-of-program competency report."""
        now = datetime.utcnow()
        # Assume 12-week program
        period_start = now - timedelta(weeks=12)
        
        report = LPIReport(
            id=str(uuid.uuid4()),
            learner_id=learner_id,
            learner_name="Program Graduate",
            learner_email="graduate@example.com",
            program=program,
            period_start=period_start,
            period_end=now,
            report_type="final",
            competency_signals=[
                CompetencySignalLPI(
                    skill="Python",
                    level="Advanced",
                    score=85,
                    improvement=40.0,
                ),
                CompetencySignalLPI(
                    skill="Data Analysis",
                    level="Advanced",
                    score=80,
                    improvement=45.0,
                ),
                CompetencySignalLPI(
                    skill="Problem Solving",
                    level="Advanced",
                    score=82,
                    improvement=25.0,
                ),
                CompetencySignalLPI(
                    skill="Communication",
                    level="Intermediate",
                    score=70,
                    improvement=20.0,
                ),
            ],
            growth_recommendations=[
                "Ready for junior developer roles",
                "Continue building portfolio projects",
                "Consider specialization in data engineering",
            ],
            overall_score=82,
        )
        
        self._reports.append(report)
        
        return report
