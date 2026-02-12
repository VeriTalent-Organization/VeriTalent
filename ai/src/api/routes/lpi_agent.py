"""
LPI Agent API Routes

Endpoints for Learning & Performance Intelligence processing.
"""
from fastapi import APIRouter, File, HTTPException, UploadFile, status

from src.models.lpi import (
    LPISubmissionRequest,
    LPISubmissionResponse,
    LPIReportResponse,
    ProcessingStatusResponse,
)
from src.core.lpi.summarizer import LPISummarizer
from src.core.lpi.report_generator import LPIReportGenerator

router = APIRouter()

# Initialize services
lpi_summarizer = LPISummarizer()
report_generator = LPIReportGenerator()


@router.post("/submit", response_model=LPISubmissionResponse)
async def submit_learner_work(
    learner_name: str,
    learner_email: str,
    program: str,
    submission_type: str = "Project",
    file: UploadFile = File(None),
    link: str = None,
    notes: str = None,
):
    """
    Submit learner work for AI processing.
    
    Accepts:
    - File uploads (PDF, DOCX, TXT)
    - Links to external work
    - Notes/descriptions
    
    Returns submission ID for tracking.
    """
    if not file and not link:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Either file or link must be provided",
        )
    
    try:
        content = None
        filename = None
        
        if file:
            content = await file.read()
            filename = file.filename
        
        result = await lpi_summarizer.submit(
            learner_name=learner_name,
            learner_email=learner_email,
            program=program,
            submission_type=submission_type,
            content=content,
            filename=filename,
            link=link,
            notes=notes,
        )
        
        return LPISubmissionResponse(
            success=True,
            submission_id=result["submission_id"],
            status="queued",
            message="Submission received and queued for processing",
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to submit learner work: {str(e)}",
        )


@router.get("/submissions")
async def list_submissions(
    program: str = None,
    status: str = None,
    page: int = 1,
    limit: int = 20,
):
    """
    List learner submissions with optional filters.
    """
    try:
        submissions = await lpi_summarizer.list_submissions(
            program=program,
            status=status,
            page=page,
            limit=limit,
        )
        
        return {
            "success": True,
            "page": page,
            "limit": limit,
            "submissions": submissions,
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to list submissions: {str(e)}",
        )


@router.get("/submissions/{submission_id}")
async def get_submission(submission_id: str):
    """
    Get details of a specific submission.
    """
    try:
        submission = await lpi_summarizer.get_submission(submission_id)
        
        if not submission:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Submission not found: {submission_id}",
            )
        
        return {"success": True, "submission": submission}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get submission: {str(e)}",
        )


@router.post("/submissions/{submission_id}/retry")
async def retry_submission(submission_id: str):
    """
    Retry a failed submission.
    """
    try:
        result = await lpi_summarizer.retry_submission(submission_id)
        
        return {
            "success": True,
            "submission_id": submission_id,
            "message": "Submission queued for retry",
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retry submission: {str(e)}",
        )


@router.get("/processing-status", response_model=ProcessingStatusResponse)
async def get_processing_status():
    """
    Get current processing status summary.
    """
    try:
        status = await lpi_summarizer.get_processing_status()
        
        return ProcessingStatusResponse(
            processed=status["processed"],
            in_queue=status["in_queue"],
            failed=status["failed"],
            last_updated=status.get("last_updated"),
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get processing status: {str(e)}",
        )


@router.get("/reports")
async def list_reports(
    learner_email: str = None,
    program: str = None,
    report_type: str = None,
):
    """
    List generated LPI reports.
    """
    try:
        reports = await report_generator.list_reports(
            learner_email=learner_email,
            program=program,
            report_type=report_type,
        )
        
        return {"success": True, "reports": reports}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to list reports: {str(e)}",
        )


@router.get("/reports/{report_id}", response_model=LPIReportResponse)
async def get_report(report_id: str):
    """
    Get a specific LPI report with full details.
    """
    try:
        report = await report_generator.get_report(report_id)
        
        if not report:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Report not found: {report_id}",
            )
        
        return LPIReportResponse(
            success=True,
            report=report,
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get report: {str(e)}",
        )


@router.post("/reports/generate-weekly")
async def generate_weekly_reports(program: str = None):
    """
    Trigger generation of weekly summary reports.
    """
    try:
        result = await report_generator.generate_weekly(program=program)
        
        return {
            "success": True,
            "message": "Weekly report generation initiated",
            "job_id": result.get("job_id"),
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate weekly reports: {str(e)}",
        )


@router.post("/reports/generate-monthly")
async def generate_monthly_reports(program: str = None):
    """
    Trigger generation of monthly aggregated reports.
    """
    try:
        result = await report_generator.generate_monthly(program=program)
        
        return {
            "success": True,
            "message": "Monthly report generation initiated",
            "job_id": result.get("job_id"),
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate monthly reports: {str(e)}",
        )
