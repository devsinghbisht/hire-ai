"""Deterministic match scoring engine."""
from typing import Any, Dict, List, Tuple

from app.schemas.analysis import (
    EvidenceMatch,
    MatchAnalysis,
    ScoreBreakdown,
)
from app.core.logging_config import get_logger

logger = get_logger(__name__)

# Category weights (must sum to 1.0)
WEIGHTS = {
    "essential_skills": 0.45,
    "experience_projects": 0.25,
    "qualifications": 0.15,
    "preferred_skills": 0.15,
}

# Evidence values
EVIDENCE_VALUE = {
    "demonstrated": 1.0,
    "partial": 0.5,
    "not_found": 0.0,
    "unclear": 0.25,
}


def _score_items(items: List[EvidenceMatch]) -> Tuple[float, int]:
    """Return (raw_score 0-1, count of evaluable items)."""
    if not items:
        return 0.0, 0
    total = 0.0
    for item in items:
        total += EVIDENCE_VALUE.get(item.evidence_status, 0.0)
    return total / len(items), len(items)


def _score_label(score: int) -> str:
    if score >= 75:
        return "Strong Evidence Alignment"
    elif score >= 50:
        return "Moderate Evidence Alignment"
    else:
        return "Limited Evidence Alignment"


def calculate_match_score(
    matched: List[EvidenceMatch],
    partial: List[EvidenceMatch],
    missing: List[EvidenceMatch],
    job_req_data: Dict[str, Any],
) -> MatchAnalysis:
    """
    Calculate deterministic match score from AI-classified evidence.
    The AI classifies evidence; this engine does the math.
    """
    all_items = matched + partial + missing

    # Bucket items by requirement type
    def filter_by_types(items: List[EvidenceMatch], types: List[str]) -> List[EvidenceMatch]:
        # All items go to essential unless we have richer type info
        return items   # simplified for MVP

    # Use proportional weighting over available categories
    # Essential skills: matched + partial + missing that relate to core skills
    essential_items = [i for i in all_items if i.evidence_status in ("demonstrated", "partial", "not_found", "unclear") and i.evidence_status != ""]

    # Split by presence in job requirements lists
    essential_reqs = {r.get("name", "") for r in job_req_data.get("essential_skills", [])}
    preferred_reqs = {r.get("name", "") for r in job_req_data.get("preferred_skills", [])}
    qual_reqs = {r.get("name", "") for r in job_req_data.get("qualifications", [])}
    exp_reqs = {r.get("name", "") for r in job_req_data.get("experience_requirements", [])}
    tool_reqs = {r.get("name", "") for r in job_req_data.get("tools_and_technologies", [])}

    def bucket(items: List[EvidenceMatch], req_set: set) -> List[EvidenceMatch]:
        if not req_set:
            return []
        return [i for i in items if i.requirement in req_set]

    cat_essential = bucket(all_items, essential_reqs)
    cat_preferred = bucket(all_items, preferred_reqs | tool_reqs)
    cat_quals = bucket(all_items, qual_reqs)
    cat_exp = bucket(all_items, exp_reqs)

    # Items not bucketed into specific categories → fall to essential
    bucketed = set()
    for lst in (cat_essential, cat_preferred, cat_quals, cat_exp):
        for item in lst:
            bucketed.add(item.requirement)
    unbucketed = [i for i in all_items if i.requirement not in bucketed]
    cat_essential = cat_essential + unbucketed

    scores_raw = {
        "essential_skills": _score_items(cat_essential),
        "experience_projects": _score_items(cat_exp),
        "qualifications": _score_items(cat_quals),
        "preferred_skills": _score_items(cat_preferred),
    }

    # Normalize weights over categories that have data
    active_categories = {k: v for k, v in scores_raw.items() if v[1] > 0}
    if not active_categories:
        weighted_score = 0.0
    else:
        total_weight = sum(WEIGHTS[k] for k in active_categories)
        weighted_score = sum(
            (scores_raw[k][0] * WEIGHTS[k]) / total_weight
            for k in active_categories
        )

    final_score = max(0, min(100, round(weighted_score * 100)))

    breakdown = ScoreBreakdown(
        essential_skills_score=round(scores_raw["essential_skills"][0] * 100, 1),
        experience_projects_score=round(scores_raw["experience_projects"][0] * 100, 1),
        qualifications_score=round(scores_raw["qualifications"][0] * 100, 1),
        preferred_skills_score=round(scores_raw["preferred_skills"][0] * 100, 1),
        essential_skills_weight=WEIGHTS["essential_skills"],
        experience_projects_weight=WEIGHTS["experience_projects"],
        qualifications_weight=WEIGHTS["qualifications"],
        preferred_skills_weight=WEIGHTS["preferred_skills"],
    )

    return MatchAnalysis(
        overall_score=final_score,
        score_label=_score_label(final_score),
        score_breakdown=breakdown,
        matched_requirements=matched,
        partial_matches=partial,
        missing_evidence=missing,
    )
