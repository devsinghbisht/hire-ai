"""Main analysis orchestration service."""
import time
import uuid
from typing import Any, Dict, List, Optional

from app.core.config import get_settings
from app.core.logging_config import get_logger
from app.prompts.analysis_prompt import build_analysis_prompt, build_interview_questions_prompt
from app.schemas.analysis import (
    AnalysisResponse,
    ATSAnalysis,
    ATSSection,
    CandidateProfile,
    EducationItem,
    EvidenceMatch,
    ExperienceItem,
    InterviewQuestion,
    JobRequirement,
    JobRequirements,
    KeywordResult,
    MatchAnalysis,
    ProjectItem,
    ResumeSuggestion,
    RoadmapItem,
    SkillGap,
)
from app.services.ai_provider import call_ai, AIProviderError
from app.services.scoring import calculate_match_score

logger = get_logger(__name__)
settings = get_settings()


def _safe_str(val: Any, default: str = "") -> str:
    return str(val) if val is not None else default


def _safe_list(val: Any) -> list:
    return val if isinstance(val, list) else []


def _parse_candidate_profile(data: Dict) -> CandidateProfile:
    cp = data.get("candidate_profile", {}) or {}
    return CandidateProfile(
        summary=cp.get("summary"),
        skills=_safe_list(cp.get("skills")),
        certifications=_safe_list(cp.get("certifications")),
        tools_and_technologies=_safe_list(cp.get("tools_and_technologies")),
        education=[
            EducationItem(**{k: v for k, v in e.items() if k in EducationItem.model_fields})
            for e in _safe_list(cp.get("education"))
            if isinstance(e, dict)
        ],
        experience=[
            ExperienceItem(**{k: v for k, v in e.items() if k in ExperienceItem.model_fields})
            for e in _safe_list(cp.get("experience"))
            if isinstance(e, dict)
        ],
        projects=[
            ProjectItem(**{k: v for k, v in p.items() if k in ProjectItem.model_fields})
            for p in _safe_list(cp.get("projects"))
            if isinstance(p, dict)
        ],
    )


def _parse_job_requirements(data: Dict) -> JobRequirements:
    jr = data.get("job_requirements", {}) or {}

    def parse_reqs(lst: Any) -> List[JobRequirement]:
        result = []
        for item in _safe_list(lst):
            if isinstance(item, dict):
                try:
                    result.append(JobRequirement(
                        name=_safe_str(item.get("name"), "Unknown"),
                        requirement_type=_safe_str(item.get("requirement_type"), "skill"),
                        importance=_safe_str(item.get("importance"), "required"),
                        explicitly_stated=bool(item.get("explicitly_stated", True)),
                        evidence_from_jd=item.get("evidence_from_jd"),
                    ))
                except Exception:
                    pass
        return result

    return JobRequirements(
        job_title=jr.get("job_title"),
        essential_skills=parse_reqs(jr.get("essential_skills")),
        preferred_skills=parse_reqs(jr.get("preferred_skills")),
        qualifications=parse_reqs(jr.get("qualifications")),
        experience_requirements=parse_reqs(jr.get("experience_requirements")),
        responsibilities=_safe_list(jr.get("responsibilities")),
        tools_and_technologies=parse_reqs(jr.get("tools_and_technologies")),
    )


def _parse_evidence_matches(raw: Dict) -> tuple:
    """Returns (matched, partial, missing) lists of EvidenceMatch."""
    def parse_list(lst: Any) -> List[EvidenceMatch]:
        result = []
        for item in _safe_list(lst):
            if isinstance(item, dict):
                try:
                    result.append(EvidenceMatch(
                        requirement=_safe_str(item.get("requirement"), "Unknown"),
                        evidence_status=_safe_str(item.get("evidence_status"), "unclear"),
                        resume_evidence=item.get("resume_evidence"),
                        confidence=float(item.get("confidence", 0.0)),
                    ))
                except Exception:
                    pass
        return result

    raw_matches = raw.get("raw_matches", {}) or {}
    return (
        parse_list(raw_matches.get("matched")),
        parse_list(raw_matches.get("partial")),
        parse_list(raw_matches.get("missing")),
    )


def _parse_ats_analysis(data: Dict) -> ATSAnalysis:
    sections = [
        ATSSection(
            name=_safe_str(s.get("name"), "Unknown"),
            present=bool(s.get("present", False)),
            notes=s.get("notes"),
        )
        for s in _safe_list(data.get("ats_sections"))
        if isinstance(s, dict)
    ]

    kw_coverage = [
        KeywordResult(
            keyword=_safe_str(k.get("keyword"), ""),
            status=_safe_str(k.get("status"), "not_found"),
            context=k.get("context"),
        )
        for k in _safe_list(data.get("keyword_coverage"))
        if isinstance(k, dict)
    ]

    present_count = sum(1 for s in sections if s.present)
    total_sections = len(sections) if sections else 1
    readability_score = min(100, int((present_count / total_sections) * 100))

    missing_kws = [k.keyword for k in kw_coverage if k.status == "not_found"]

    return ATSAnalysis(
        readability_score=readability_score,
        section_completeness=sections,
        formatting_warnings=_safe_list(data.get("formatting_warnings")),
        keyword_coverage=kw_coverage,
        missing_relevant_keywords=missing_kws,
        structural_recommendations=_safe_list(data.get("structural_recommendations")),
    )


def _parse_improvements(data: List) -> List[ResumeSuggestion]:
    result = []
    for item in _safe_list(data):
        if isinstance(item, dict):
            try:
                result.append(ResumeSuggestion(
                    section=_safe_str(item.get("section"), "General"),
                    original_text=_safe_str(item.get("original_text"), ""),
                    suggested_text=_safe_str(item.get("suggested_text"), ""),
                    reason=_safe_str(item.get("reason"), ""),
                    supporting_evidence=item.get("supporting_evidence"),
                    requires_user_confirmation=bool(item.get("requires_user_confirmation", True)),
                ))
            except Exception:
                pass
    return result


def _parse_skill_gaps(data: List) -> List[SkillGap]:
    result = []
    for item in _safe_list(data):
        if isinstance(item, dict):
            try:
                result.append(SkillGap(
                    skill=_safe_str(item.get("skill"), "Unknown"),
                    importance=_safe_str(item.get("importance"), "required"),
                    evidence_status=_safe_str(item.get("evidence_status"), "not_found"),
                    reason=_safe_str(item.get("reason"), ""),
                    suggested_action=_safe_str(item.get("suggested_action"), ""),
                    related_job_requirement=item.get("related_job_requirement"),
                ))
            except Exception:
                pass
    return result


def _parse_roadmap(data: List) -> List[RoadmapItem]:
    result = []
    for i, item in enumerate(_safe_list(data)):
        if isinstance(item, dict):
            try:
                result.append(RoadmapItem(
                    skill=_safe_str(item.get("skill"), "Unknown"),
                    why_it_matters=_safe_str(item.get("why_it_matters"), ""),
                    objective=_safe_str(item.get("objective"), ""),
                    practice_task=_safe_str(item.get("practice_task"), ""),
                    project_idea=_safe_str(item.get("project_idea"), ""),
                    estimated_effort=_safe_str(item.get("estimated_effort"), ""),
                    completion_criteria=_safe_str(item.get("completion_criteria"), ""),
                    priority=int(item.get("priority", i + 1)),
                ))
            except Exception:
                pass
    return sorted(result, key=lambda x: x.priority)


def _parse_interview_questions(data: List) -> List[InterviewQuestion]:
    result = []
    for item in _safe_list(data):
        if isinstance(item, dict):
            try:
                result.append(InterviewQuestion(
                    question=_safe_str(item.get("question"), ""),
                    category=_safe_str(item.get("category"), "general"),
                    difficulty=_safe_str(item.get("difficulty"), "medium"),
                    reason=_safe_str(item.get("reason"), ""),
                    answer_points=_safe_list(item.get("answer_points")),
                    follow_up_question=item.get("follow_up_question"),
                ))
            except Exception:
                pass
    return result


async def run_full_analysis(
    resume_text: str,
    job_description: str,
    job_title: Optional[str] = None,
    company_name: Optional[str] = None,
    include_roadmap: bool = True,
    include_interview_questions: bool = True,
) -> AnalysisResponse:
    """Run the full AI analysis pipeline."""
    t_start = time.time()

    prompt = build_analysis_prompt(
        resume_text=resume_text,
        job_description=job_description,
        job_title=job_title or "",
        company_name=company_name or "",
    )

    raw = await _async_call_ai(prompt)

    # Parse structured components
    candidate_profile = _parse_candidate_profile(raw)
    job_requirements = _parse_job_requirements(raw)
    matched, partial, missing = _parse_evidence_matches(raw)

    # Deterministic scoring (backend-calculated)
    jr_dict = raw.get("job_requirements", {}) or {}
    match_analysis = calculate_match_score(matched, partial, missing, jr_dict)
    match_analysis.strengths = _safe_list(raw.get("strengths"))
    match_analysis.recommendations = _safe_list(raw.get("recommendations", []))
    match_analysis.score_explanation = _safe_str(raw.get("score_explanation"), "")
    match_analysis.confidence_notes = _safe_list(raw.get("confidence_notes"))

    ats_analysis = _parse_ats_analysis(raw)
    resume_improvements = _parse_improvements(raw.get("resume_improvements", []))
    skill_gaps = _parse_skill_gaps(raw.get("skill_gaps", []))
    roadmap = _parse_roadmap(raw.get("learning_roadmap", [])) if include_roadmap else []
    interview_qs = _parse_interview_questions(raw.get("interview_questions", [])) if include_interview_questions else []

    elapsed = time.time() - t_start

    return AnalysisResponse(
        analysis_id=str(uuid.uuid4()),
        candidate_profile=candidate_profile,
        job_requirements=job_requirements,
        match_analysis=match_analysis,
        ats_analysis=ats_analysis,
        resume_improvements=resume_improvements,
        skill_gaps=skill_gaps,
        learning_roadmap=roadmap,
        interview_questions=interview_qs,
        processing_time_seconds=round(elapsed, 2),
        model_used=settings.gemma_model,
    )


async def generate_interview_questions(
    resume_text: str,
    job_description: str,
    categories: Optional[List[str]] = None,
    count: int = 12,
) -> List[InterviewQuestion]:
    """Generate a fresh set of interview questions."""
    prompt = build_interview_questions_prompt(
        resume_text=resume_text,
        job_description=job_description,
        categories=categories or [],
        count=count,
    )
    raw = await _async_call_ai(prompt)
    if isinstance(raw, list):
        return _parse_interview_questions(raw)
    # Model may wrap it
    for key in ("interview_questions", "questions"):
        if key in raw:
            return _parse_interview_questions(raw[key])
    return []


import asyncio


async def _async_call_ai(prompt: str) -> Dict:
    """Run synchronous AI call in thread pool."""
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, call_ai, prompt)


from typing import Dict
