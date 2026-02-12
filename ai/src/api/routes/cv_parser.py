"""
CV Parser API Routes

Endpoints for parsing and extracting structured data from CVs.
"""
from fastapi import APIRouter, File, HTTPException, UploadFile, status

from src.models.cv import CVParseRequest, CVParseResponse, ParsedCV
from src.core.cv_parser.parser import CVParserService

router = APIRouter()

# Initialize service
cv_parser_service = CVParserService()


@router.post("/parse", response_model=CVParseResponse)
async def parse_cv(file: UploadFile = File(...)):
    """
    Parse an uploaded CV file and extract structured data.
    
    Supports: PDF, DOCX, TXT
    Max size: 10MB
    
    Returns structured CV data including:
    - Personal information
    - Education history
    - Work experience
    - Skills
    - Certifications
    """
    # Validate file type
    allowed_types = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
    ]
    
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file type: {file.content_type}. Allowed: PDF, DOCX, TXT",
        )
    
    # Read file content
    content = await file.read()
    
    # Validate file size (10MB max)
    max_size = 10 * 1024 * 1024
    if len(content) > max_size:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File too large. Maximum size is 10MB.",
        )
    
    try:
        # Parse the CV
        parsed_data = await cv_parser_service.parse(
            content=content,
            filename=file.filename or "unknown",
            content_type=file.content_type or "application/octet-stream",
        )
        
        return CVParseResponse(
            success=True,
            message="CV parsed successfully",
            data=parsed_data,
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to parse CV: {str(e)}",
        )


@router.post("/parse-text", response_model=CVParseResponse)
async def parse_cv_text(request: CVParseRequest):
    """
    Parse CV from raw text input.
    
    Useful for:
    - LinkedIn profile text
    - Copy-pasted CV content
    - Pre-extracted text
    """
    try:
        parsed_data = await cv_parser_service.parse_text(request.text)
        
        return CVParseResponse(
            success=True,
            message="CV text parsed successfully",
            data=parsed_data,
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to parse CV text: {str(e)}",
        )


@router.post("/batch-parse")
async def batch_parse_cvs(files: list[UploadFile] = File(...)):
    """
    Parse multiple CV files in batch.
    
    Returns list of parsed CVs with status for each.
    Maximum 50 files per batch.
    """
    if len(files) > 50:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Maximum 50 files per batch",
        )
    
    results = []
    for file in files:
        try:
            content = await file.read()
            parsed = await cv_parser_service.parse(
                content=content,
                filename=file.filename or "unknown",
                content_type=file.content_type or "application/octet-stream",
            )
            results.append({
                "filename": file.filename,
                "success": True,
                "data": parsed,
            })
        except Exception as e:
            results.append({
                "filename": file.filename,
                "success": False,
                "error": str(e),
            })
    
    return {
        "total": len(files),
        "successful": sum(1 for r in results if r["success"]),
        "failed": sum(1 for r in results if not r["success"]),
        "results": results,
    }
