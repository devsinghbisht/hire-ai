"""Analysis API routes."""
import time
from typing import List, Optional

from fastapi import APIRouter, File, Form, Header, HTTPException, Query, UploadFile, status
from fastapi.responses import JSONResponse

from app.core.config import get_settings
from app.core.logging_config import get_logger
from app.database.client import delete_analysis_record, get_analysis_record, save_analysis_record
from app.schemas.analysis import (
    AnalysisResponse,
    ATSAnalysis,
    InterviewQuestion,
    ResumeImproveRequest,
    ResumeSuggestion,
    SaveAnalysisRequest,
)
from app.services.ai_provider import AIProviderError
from app.services.analysis_service import generate_interview_questions, run_full_analysis
from app.services.ats_checker import run_ats_check
from app.services.job_parser import JobParserError, validate_job_description
from app.services.resume_improver import generate_resume_improvements
from app.services.resume_parser import ResumeParserError, parse_resume

router = APIRouter(prefix="/api/v1", tags=["analysis"])
logger = get_logger(__name__)
settings = get_settings()


def _handle_error(exc: Exception) -> HTTPException:
    if isinstance(exc, (ResumeParserError, JobParserError)):
        return HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_CONTENT, detail=str(exc))
    if isinstance(exc, AIProviderError):
        return HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(exc))
    logger.error("Unexpected error: %s", exc, exc_info=True)
    return HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="An unexpected error occurred. Please try again.")


@router.post("/analyze", response_model=AnalysisResponse, summary="Full resume analysis")
async def analyze_resume(
    resume: UploadFile = File(..., description="PDF resume file"),
    job_description: str = Form(..., description="Full job description text"),
    job_title: Optional[str] = Form(None),
    company_name: Optional[str] = Form(None),
    include_roadmap: bool = Form(True),
    include_interview_questions: bool = Form(True),
):
    """
    Analyze a resume against a job description.
    Returns structured analysis with match score, ATS findings,
    improvements, skill gaps, roadmap, and interview questions.
    """
    try:
        content = await resume.read()
        resume_text = parse_resume(resume.filename or "resume.pdf", content)
        jd_clean = validate_job_description(job_description)
    except (ResumeParserError, JobParserError) as exc:
        raise _handle_error(exc)

    try:
        result = await run_full_analysis(
            resume_text=resume_text,
            job_description=jd_clean,
            job_title=job_title,
            company_name=company_name,
            include_roadmap=include_roadmap,
            include_interview_questions=include_interview_questions,
        )
        return result
    except AIProviderError as exc:
        raise _handle_error(exc)
    except Exception as exc:
        raise _handle_error(exc)


@router.post("/ats-check", response_model=ATSAnalysis, summary="ATS heuristic check")
async def ats_check(
    resume: UploadFile = File(...),
    job_description: Optional[str] = Form(None),
):
    """Check resume structure, readability, and keyword relevance."""
    try:
        content = await resume.read()
        resume_text = parse_resume(resume.filename or "resume.pdf", content)
        jd = validate_job_description(job_description) if job_description else None
    except (ResumeParserError, JobParserError) as exc:
        raise _handle_error(exc)

    try:
        return await run_ats_check(resume_text=resume_text, job_description=jd)
    except AIProviderError as exc:
        raise _handle_error(exc)
    except Exception as exc:
        raise _handle_error(exc)


@router.post("/resume-improve", response_model=List[ResumeSuggestion], summary="Generate resume improvements")
async def improve_resume(payload: ResumeImproveRequest):
    """
    Generate truthful, evidence-grounded resume improvement suggestions
    tailored to the target job description without inventing achievements.
    """
    try:
        jd_clean = validate_job_description(payload.job_description)
        suggestions = await generate_resume_improvements(
            resume_text=payload.resume_text,
            job_description=jd_clean,
            section=payload.section,
        )
        return suggestions
    except (ResumeParserError, JobParserError) as exc:
        raise _handle_error(exc)
    except AIProviderError as exc:
        raise _handle_error(exc)
    except Exception as exc:
        raise _handle_error(exc)


@router.post("/interview-questions", response_model=list, summary="Generate interview questions")
async def interview_questions(
    resume: UploadFile = File(...),
    job_description: str = Form(...),
    categories: Optional[str] = Form(None),
    question_count: int = Form(12),
):
    """Generate tailored interview questions from resume and job description."""
    try:
        content = await resume.read()
        resume_text = parse_resume(resume.filename or "resume.pdf", content)
        jd_clean = validate_job_description(job_description)
    except (ResumeParserError, JobParserError) as exc:
        raise _handle_error(exc)

    cats = [c.strip() for c in categories.split(",")] if categories else None
    count = max(5, min(20, question_count))

    try:
        questions = await generate_interview_questions(
            resume_text=resume_text,
            job_description=jd_clean,
            categories=cats,
            count=count,
        )
        return [q.model_dump() for q in questions]
    except AIProviderError as exc:
        raise _handle_error(exc)
    except Exception as exc:
        raise _handle_error(exc)


# ── Optional Anonymous Saved Analyses ─────────────────────────

@router.post("/analyses", summary="Explicitly save analysis report")
async def save_analysis(payload: SaveAnalysisRequest):
    """
    Save an analysis report after explicit user action.
    Generates and returns an anonymous cryptographic access token.
    Save this token to retrieve or delete the report later.
    """
    try:
        report_dict = payload.analysis.model_dump()
        match_score = payload.analysis.match_analysis.overall_score
        analysis_id, access_token = save_analysis_record(
            report_json=report_dict,
            job_title=payload.job_title,
            company_name=payload.company_name,
            match_score=match_score,
        )
        return {
            "id": analysis_id,
            "access_token": access_token,
            "message": "Report saved successfully. Store your access token securely to view or delete it later.",
        }
    except Exception as exc:
        logger.error("Save analysis failed: %s", exc, exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to save analysis report.")


@router.get("/analyses/{analysis_id}", summary="Retrieve saved analysis")
async def get_saved_analysis(
    analysis_id: str,
    x_access_token: Optional[str] = Header(None, alias="X-Access-Token"),
    token: Optional[str] = Query(None),
):
    """
    Retrieve a previously saved analysis.
    Requires the secret access token returned at save time.
    """
    access_token = x_access_token or token
    if not access_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Access token required. Provide X-Access-Token header or ?token= parameter.",
        )

    record = get_analysis_record(analysis_id, access_token)
    if record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found or access token invalid.",
        )
    return record


@router.delete("/analyses/{analysis_id}", summary="Delete saved analysis")
async def delete_saved_analysis(
    analysis_id: str,
    x_access_token: Optional[str] = Header(None, alias="X-Access-Token"),
    token: Optional[str] = Query(None),
):
    """
    Delete a previously saved analysis.
    Requires the secret access token returned at save time.
    """
    access_token = x_access_token or token
    if not access_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Access token required to delete report.",
        )

    deleted = delete_analysis_record(analysis_id, access_token)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found or access token invalid.",
        )
    return {"message": "Saved analysis successfully deleted."}
