"""PDF resume text extraction and validation."""
import io
import re
import tempfile
import os
from pathlib import Path
from typing import Tuple

from pypdf import PdfReader
from pypdf.errors import PdfReadError

from app.core.config import get_settings
from app.core.logging_config import get_logger

logger = get_logger(__name__)
settings = get_settings()

ALLOWED_EXTENSIONS = {".pdf"}
PDF_MAGIC_BYTES = b"%PDF"
MIN_TEXT_CHARS = 50


class ResumeParserError(Exception):
    """Raised when resume processing fails."""
    pass


def validate_file_extension(filename: str) -> None:
    ext = Path(filename).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise ResumeParserError(
            f"Unsupported file type '{ext}'. Please upload a PDF file."
        )


def validate_file_size(content: bytes) -> None:
    if len(content) > settings.max_upload_bytes:
        raise ResumeParserError(
            f"File exceeds the {settings.max_upload_mb} MB limit. "
            "Please upload a smaller file."
        )


def validate_pdf_signature(content: bytes) -> None:
    if not content.startswith(PDF_MAGIC_BYTES):
        raise ResumeParserError(
            "The uploaded file does not appear to be a valid PDF."
        )


def extract_text_from_pdf(content: bytes) -> str:
    """Extract and normalize text from PDF bytes."""
    try:
        reader = PdfReader(io.BytesIO(content))
    except PdfReadError as exc:
        raise ResumeParserError(f"Could not read PDF: {exc}") from exc
    except Exception as exc:
        raise ResumeParserError(f"Unexpected error reading PDF: {exc}") from exc

    if len(reader.pages) == 0:
        raise ResumeParserError("The PDF appears to be empty.")

    pages_text: list[str] = []
    for page in reader.pages:
        try:
            text = page.extract_text() or ""
            pages_text.append(text)
        except Exception:
            pages_text.append("")

    full_text = "\n".join(pages_text)
    return normalize_text(full_text)


def normalize_text(text: str) -> str:
    """Clean up extracted PDF text while preserving structure."""
    # Collapse excessive blank lines (max 2 consecutive)
    text = re.sub(r"\n{3,}", "\n\n", text)
    # Normalize Windows line endings
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    # Remove non-printable characters except newlines/tabs
    text = re.sub(r"[^\x09\x0A\x20-\x7E\u00A0-\uFFFF]", " ", text)
    # Collapse excessive spaces within lines
    lines = []
    for line in text.split("\n"):
        line = re.sub(r" {3,}", "  ", line)
        lines.append(line.rstrip())
    return "\n".join(lines).strip()


def check_extracted_text(text: str) -> None:
    """Validate that enough text was extracted."""
    clean = text.strip()
    if len(clean) < MIN_TEXT_CHARS:
        raise ResumeParserError(
            "Very little text could be extracted from this PDF. "
            "This may be a scanned/image-based PDF. "
            "HireAI currently requires a text-based PDF. "
            "Please export your resume as a text-based PDF from a word processor."
        )


def truncate_resume_text(text: str) -> str:
    """Truncate to configured max chars to stay within model limits."""
    if len(text) > settings.max_resume_text_chars:
        logger.warning(
            "Resume text truncated from %d to %d chars",
            len(text),
            settings.max_resume_text_chars,
        )
        return text[: settings.max_resume_text_chars]
    return text


def parse_resume(filename: str, content: bytes) -> str:
    """
    Full pipeline: validate → extract → normalize → check → truncate.
    Returns clean resume text ready for AI analysis.
    """
    validate_file_extension(filename)
    validate_file_size(content)
    validate_pdf_signature(content)
    text = extract_text_from_pdf(content)
    check_extracted_text(text)
    text = truncate_resume_text(text)
    logger.info(
        "Resume parsed successfully: %d chars extracted",
        len(text),
    )
    return text
