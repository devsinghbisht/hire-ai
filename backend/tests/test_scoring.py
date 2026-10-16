"""Test deterministic scoring engine."""
from app.services.scoring import calculate_match_score, _score_label
from app.schemas.analysis import EvidenceMatch


def _em(req: str, status: str) -> EvidenceMatch:
    return EvidenceMatch(requirement=req, evidence_status=status, confidence=0.8)


def test_all_demonstrated():
    matched = [_em("Python", "demonstrated"), _em("FastAPI", "demonstrated")]
    result = calculate_match_score(matched, [], [], {})
    assert result.overall_score == 100


def test_all_missing():
    missing = [_em("Python", "not_found"), _em("Docker", "not_found")]
    result = calculate_match_score([], [], missing, {})
    assert result.overall_score == 0


def test_mixed_evidence():
    matched = [_em("Python", "demonstrated")]
    partial = [_em("FastAPI", "partial")]
    missing = [_em("Docker", "not_found")]
    result = calculate_match_score(matched, partial, missing, {})
    assert 0 <= result.overall_score <= 100


def test_empty_requirements():
    result = calculate_match_score([], [], [], {})
    assert result.overall_score == 0


def test_score_bounds_clamped():
    matched = [_em(f"Skill{i}", "demonstrated") for i in range(20)]
    result = calculate_match_score(matched, [], [], {})
    assert 0 <= result.overall_score <= 100


def test_score_label_strong():
    assert _score_label(80) == "Strong Evidence Alignment"


def test_score_label_moderate():
    assert _score_label(60) == "Moderate Evidence Alignment"


def test_score_label_limited():
    assert _score_label(30) == "Limited Evidence Alignment"
