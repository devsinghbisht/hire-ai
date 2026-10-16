"""Pydantic schemas for the full analysis pipeline."""
from __future__ import annotations
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field, field_validator


# ── Sub-schemas ──────────────────────────────────────────────

class EducationItem(BaseModel):
    degree: Optional[str] = None
    institution: Optional[str] = None
    year: Optional[str] = None
    field_of_study: Optional[str] = None


class ExperienceItem(BaseModel):
    role: Optional[str] = None
    company: Optional[str] = None
    duration: Optional[str] = None
    highlights: List[str] = Field(default_factory=list)


class ProjectItem(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    technologies: List[str] = Field(default_factory=list)
    highlights: List[str] = Field(default_factory=list)


class CandidateProfile(BaseModel):
    summary: Optional[str] = None
    education: List[EducationItem] = Field(default_factory=list)
    skills: List[str] = Field(default_factory=list)
    projects: List[ProjectItem] = Field(default_factory=list)
    certifications: List[str] = Field(default_factory=list)
    experience: List[ExperienceItem] = Field(default_factory=list)
    tools_and_technologies: List[str] = Field(default_factory=list)


class JobRequirement(BaseModel):
    name: str
    requirement_type: str = "skill"   # skill | qualification | experience | tool
    importance: str = "required"      # required | preferred | nice_to_have
    explicitly_stated: bool = True
    evidence_from_jd: Optional[str] = None


class JobRequirements(BaseModel):
    job_title: Optional[str] = None
    essential_skills: List[JobRequirement] = Field(default_factory=list)
    preferred_skills: List[JobRequirement] = Field(default_factory=list)
    qualifications: List[JobRequirement] = Field(default_factory=list)
    experience_requirements: List[JobRequirement] = Field(default_factory=list)
    responsibilities: List[str] = Field(default_factory=list)
    tools_and_technologies: List[JobRequirement] = Field(default_factory=list)


class EvidenceMatch(BaseModel):
    requirement: str
    evidence_status: str   # demonstrated | partial | not_found | unclear
    resume_evidence: Optional[str] = None
    confidence: float = 0.0


class ScoreBreakdown(BaseModel):
    essential_skills_score: float = 0.0
    experience_projects_score: float = 0.0
    qualifications_score: float = 0.0
    preferred_skills_score: float = 0.0
    essential_skills_weight: float = 0.45
    experience_projects_weight: float = 0.25
    qualifications_weight: float = 0.15
    preferred_skills_weight: float = 0.15


class MatchAnalysis(BaseModel):
    overall_score: int = Field(0, ge=0, le=100)
    score_label: str = "Limited Evidence Alignment"
    score_explanation: str = ""
    score_breakdown: ScoreBreakdown = Field(default_factory=ScoreBreakdown)
    matched_requirements: List[EvidenceMatch] = Field(default_factory=list)
    partial_matches: List[EvidenceMatch] = Field(default_factory=list)
    missing_evidence: List[EvidenceMatch] = Field(default_factory=list)
    strengths: List[str] = Field(default_factory=list)
    recommendations: List[str] = Field(default_factory=list)
    confidence_notes: List[str] = Field(default_factory=list)


class ATSSection(BaseModel):
    name: str
    present: bool
    notes: Optional[str] = None


class KeywordResult(BaseModel):
    keyword: str
    status: str   # present_strong | present_weak | related_found | not_found
    context: Optional[str] = None


class ATSAnalysis(BaseModel):
    readability_score: int = Field(0, ge=0, le=100)
    section_completeness: List[ATSSection] = Field(default_factory=list)
    formatting_warnings: List[str] = Field(default_factory=list)
    keyword_coverage: List[KeywordResult] = Field(default_factory=list)
    missing_relevant_keywords: List[str] = Field(default_factory=list)
    structural_recommendations: List[str] = Field(default_factory=list)
    limitations: str = (
        "This report provides resume structure, readability, and job-relevance "
        "heuristics. Different applicant tracking systems use different parsing "
        "and ranking methods, so this score is not an exact ATS simulation or "
        "a guarantee of selection."
    )


class ResumeSuggestion(BaseModel):
    section: str
    original_text: str
    suggested_text: str
    reason: str
    supporting_evidence: Optional[str] = None
    requires_user_confirmation: bool = True


class SkillGap(BaseModel):
    skill: str
    importance: str = "required"
    evidence_status: str = "not_found"
    reason: str = ""
    suggested_action: str = ""
    related_job_requirement: Optional[str] = None


class RoadmapItem(BaseModel):
    skill: str
    why_it_matters: str = ""
    objective: str = ""
    practice_task: str = ""
    project_idea: str = ""
    estimated_effort: str = ""
    completion_criteria: str = ""
    priority: int = 1


class InterviewQuestion(BaseModel):
    question: str
    category: str   # technical | project | behavioral | role_specific | hr
    difficulty: str = "medium"   # easy | medium | hard
    reason: str = ""
    answer_points: List[str] = Field(default_factory=list)
    follow_up_question: Optional[str] = None


# ── Top-level response ───────────────────────────────────────

class AnalysisResponse(BaseModel):
    analysis_id: Optional[str] = None
    candidate_profile: CandidateProfile = Field(default_factory=CandidateProfile)
    job_requirements: JobRequirements = Field(default_factory=JobRequirements)
    match_analysis: MatchAnalysis = Field(default_factory=MatchAnalysis)
    ats_analysis: ATSAnalysis = Field(default_factory=ATSAnalysis)
    resume_improvements: List[ResumeSuggestion] = Field(default_factory=list)
    skill_gaps: List[SkillGap] = Field(default_factory=list)
    learning_roadmap: List[RoadmapItem] = Field(default_factory=list)
    interview_questions: List[InterviewQuestion] = Field(default_factory=list)
    processing_time_seconds: Optional[float] = None
    model_used: Optional[str] = None
    disclaimer: str = (
        "This analysis measures alignment between the supplied resume and job "
        "description. It is not a prediction of hiring outcomes, interview "
        "selection, or the candidate's overall ability. Always verify AI "
        "suggestions before acting on them."
    )


# ── Request models ───────────────────────────────────────────

class AnalysisRequest(BaseModel):
    job_description: str = Field(..., min_length=50)
    job_title: Optional[str] = None
    company_name: Optional[str] = None
    include_roadmap: bool = True
    include_interview_questions: bool = True

    @field_validator("job_description")
    @classmethod
    def jd_not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Job description cannot be empty.")
        return v.strip()


class InterviewQuestionsRequest(BaseModel):
    resume_text: str = Field(..., min_length=100)
    job_description: str = Field(..., min_length=50)
    categories: Optional[List[str]] = None
    question_count: int = Field(12, ge=5, le=20)


class ATSCheckRequest(BaseModel):
    job_description: Optional[str] = None


class SaveAnalysisRequest(BaseModel):
    analysis: AnalysisResponse
    job_title: Optional[str] = None
    company_name: Optional[str] = None


class ResumeImproveRequest(BaseModel):
    resume_text: str = Field(..., min_length=50)
    job_description: str = Field(..., min_length=30)
    section: Optional[str] = None

