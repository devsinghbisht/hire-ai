"""Test resume parsing."""
import pytest
from app.services.resume_parser import (
    ResumeParserError,
    normalize_text,
    validate_file_extension,
    validate_file_size,
    validate_pdf_signature,
    check_extracted_text,
    truncate_resume_text,
)
from app.core.config import get_settings

settings = get_settings()


def test_validate_extension_pdf_ok():
    validate_file_extension("resume.pdf")


def test_validate_extension_docx_fails():
    with pytest.raises(ResumeParserError, match="Unsupported"):
        validate_file_extension("resume.docx")


def test_validate_extension_case_insensitive():
    validate_file_extension("RESUME.PDF")


def test_validate_file_size_ok():
    validate_file_size(b"x" * 100)


def test_validate_file_size_too_large():
    oversized = b"x" * (settings.max_upload_bytes + 1)
    with pytest.raises(ResumeParserError, match="exceeds"):
        validate_file_size(oversized)


def test_validate_pdf_signature_ok():
    validate_pdf_signature(b"%PDF-1.4 rest of file")


def test_validate_pdf_signature_fails():
    with pytest.raises(ResumeParserError, match="valid PDF"):
        validate_pdf_signature(b"PK\x03\x04zip file content")


def test_check_extracted_text_too_short():
    with pytest.raises(ResumeParserError, match="little text"):
        check_extracted_text("short")


def test_check_extracted_text_ok():
    check_extracted_text("A" * 100)


def test_normalize_text_collapses_blank_lines():
    text = "line1\n\n\n\n\nline2"
    result = normalize_text(text)
    assert "\n\n\n" not in result


def test_truncate_resume_text():
    long_text = "A" * (settings.max_resume_text_chars + 1000)
    result = truncate_resume_text(long_text)
    assert len(result) == settings.max_resume_text_chars
