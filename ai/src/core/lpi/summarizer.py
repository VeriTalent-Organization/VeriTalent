"""
LPI Summarizer

Processes learner submissions and generates summaries.
"""
from datetime import datetime
from typing import Optional
import uuid

from src.services.llm_service import LLMService


class LPISummarizer:
    """Service for processing and summarizing learner submissions."""

    def __init__(self):
        self.llm_service = LLMService()
        # In-memory storage for demo (replace with database)
        self._submissions = []
        self._processing_stats = {
            "processed": 0,
            "in_queue": 0,
            "failed": 0,
        }

    async def submit(
        self,
        learner_name: str,
        learner_email: str,
        program: str,
        submission_type: str,
        content: Optional[bytes] = None,
        filename: Optional[str] = None,
        link: Optional[str] = None,
        notes: Optional[str] = None,
    ) -> dict:
        """
        Submit learner work for processing.
        
        Args:
            learner_name: Name of the learner
            learner_email: Email of the learner
            program: Program/course name
            submission_type: Type of submission (Project, Report, etc.)
            content: File content as bytes
            filename: Original filename
            link: External link to work
            notes: Additional notes
            
        Returns:
            Dictionary with submission_id
        """
        submission_id = str(uuid.uuid4())
        
        submission = {
            "id": submission_id,
            "learner_name": learner_name,
            "learner_email": learner_email,
            "program": program,
            "submission_type": submission_type,
            "submitted_at": datetime.utcnow().isoformat(),
            "status": "queued",
            "filename": filename,
            "link": link,
            "notes": notes,
            "has_file": content is not None,
        }
        
        self._submissions.append(submission)
        self._processing_stats["in_queue"] += 1
        
        # TODO: Queue for async processing
        # For now, process immediately
        await self._process_submission(submission_id, content)
        
        return {"submission_id": submission_id}

    async def _process_submission(
        self,
        submission_id: str,
        content: Optional[bytes],
    ) -> None:
        """Process a submission asynchronously."""
        submission = next(
            (s for s in self._submissions if s["id"] == submission_id),
            None
        )
        
        if not submission:
            return
        
        try:
            submission["status"] = "processing"
            
            # Extract text from content
            text = ""
            if content:
                text = content.decode("utf-8", errors="ignore")
            elif submission.get("link"):
                text = f"External link: {submission['link']}"
            
            if submission.get("notes"):
                text += f"\n\nNotes: {submission['notes']}"
            
            # Generate summary using LLM
            summary = await self.llm_service.summarize_submission(text)
            
            submission["summary"] = summary
            submission["status"] = "completed"
            
            self._processing_stats["in_queue"] -= 1
            self._processing_stats["processed"] += 1
            
        except Exception as e:
            submission["status"] = "failed"
            submission["failure_reason"] = str(e)
            
            self._processing_stats["in_queue"] -= 1
            self._processing_stats["failed"] += 1

    async def list_submissions(
        self,
        program: Optional[str] = None,
        status: Optional[str] = None,
        page: int = 1,
        limit: int = 20,
    ) -> list[dict]:
        """List submissions with optional filters."""
        filtered = self._submissions
        
        if program:
            filtered = [s for s in filtered if s["program"] == program]
        
        if status:
            filtered = [s for s in filtered if s["status"] == status]
        
        # Pagination
        start = (page - 1) * limit
        end = start + limit
        
        return filtered[start:end]

    async def get_submission(self, submission_id: str) -> Optional[dict]:
        """Get a specific submission by ID."""
        return next(
            (s for s in self._submissions if s["id"] == submission_id),
            None
        )

    async def retry_submission(self, submission_id: str) -> dict:
        """Retry a failed submission."""
        submission = await self.get_submission(submission_id)
        
        if not submission:
            raise ValueError(f"Submission not found: {submission_id}")
        
        if submission["status"] != "failed":
            raise ValueError("Can only retry failed submissions")
        
        submission["status"] = "queued"
        self._processing_stats["failed"] -= 1
        self._processing_stats["in_queue"] += 1
        
        # Re-process
        await self._process_submission(submission_id, None)
        
        return {"success": True}

    async def get_processing_status(self) -> dict:
        """Get current processing status."""
        return {
            **self._processing_stats,
            "last_updated": datetime.utcnow().isoformat(),
        }
