"""Job description validation and preprocessing."""
import re
from app.core.config import get_settings
from app.core.logging_config import get_logger

logger = get_logger(__name__)
settings = get_settings()

MIN_JD_CHARS = 50


class JobParserError(Exception):
    pass


def validate_job_description(text: str) -> str:
    """Validate and clean a job description string."""
    if not text or not text.strip():
        raise JobParserError("Job description cannot be empty.")
    clean = text.strip()
    if len(clean) < MIN_JD_CHARS:
        raise JobParserError(
            f"Job description is too short (minimum {MIN_JD_CHARS} characters). "
            "Please paste the complete job description."
        )
    if len(clean) > settings.max_job_description_chars:
        logger.warning(
            "Job description truncated from %d to %d chars",
            len(clean),
            settings.max_job_description_chars,
        )
        clean = clean[: settings.max_job_description_chars]
    return clean
