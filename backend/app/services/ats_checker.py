"""ATS heuristic checker (reuses analysis pipeline)."""
from typing import Optional
from app.schemas.analysis import ATSAnalysis, AnalysisResponse
from app.services.analysis_service import run_full_analysis
from app.core.logging_config import get_logger

logger = get_logger(__name__)


async def run_ats_check(
    resume_text: str,
    job_description: Optional[str] = None,
) -> ATSAnalysis:
    """Run ATS-focused analysis. Reuses full pipeline but returns only ATS section."""
    jd = job_description or "General professional role. Looking for well-structured, clearly written resume."
    result = await run_full_analysis(
        resume_text=resume_text,
        job_description=jd,
        include_roadmap=False,
        include_interview_questions=False,
    )
    return result.ats_analysis
