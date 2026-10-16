"""Test job description validation."""
import pytest
from app.services.job_parser import JobParserError, validate_job_description
from app.core.config import get_settings

settings = get_settings()


def test_valid_jd():
    result = validate_job_description("A" * 100)
    assert len(result) == 100


def test_empty_jd():
    with pytest.raises(JobParserError, match="empty"):
        validate_job_description("")


def test_whitespace_only_jd():
    with pytest.raises(JobParserError, match="empty"):
        validate_job_description("   ")


def test_too_short_jd():
    with pytest.raises(JobParserError, match="too short"):
        validate_job_description("Hi")


def test_jd_truncation():
    long_jd = "x" * (settings.max_job_description_chars + 500)
    result = validate_job_description(long_jd)
    assert len(result) == settings.max_job_description_chars


def test_strips_whitespace():
    result = validate_job_description("  " + "A" * 100 + "  ")
    assert not result.startswith(" ")
    assert not result.endswith(" ")
