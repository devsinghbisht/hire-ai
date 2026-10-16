// Shared TypeScript types mirroring the backend Pydantic schemas

export interface EducationItem {
  degree?: string;
  institution?: string;
  year?: string;
  field_of_study?: string;
}

export interface ExperienceItem {
  role?: string;
  company?: string;
  duration?: string;
  highlights: string[];
}

export interface ProjectItem {
  name?: string;
  description?: string;
  technologies: string[];
  highlights: string[];
}

export interface CandidateProfile {
  summary?: string;
  education: EducationItem[];
  skills: string[];
  projects: ProjectItem[];
  certifications: string[];
  experience: ExperienceItem[];
  tools_and_technologies: string[];
}

export interface JobRequirement {
  name: string;
  requirement_type: string;
  importance: 'required' | 'preferred' | 'nice_to_have';
  explicitly_stated: boolean;
  evidence_from_jd?: string;
}

export interface JobRequirements {
  job_title?: string;
  essential_skills: JobRequirement[];
  preferred_skills: JobRequirement[];
  qualifications: JobRequirement[];
  experience_requirements: JobRequirement[];
  responsibilities: string[];
  tools_and_technologies: JobRequirement[];
}

export type EvidenceStatus = 'demonstrated' | 'partial' | 'not_found' | 'unclear';

export interface EvidenceMatch {
  requirement: string;
  evidence_status: EvidenceStatus;
  resume_evidence?: string;
  confidence: number;
}

export interface ScoreBreakdown {
  essential_skills_score: number;
  experience_projects_score: number;
  qualifications_score: number;
  preferred_skills_score: number;
  essential_skills_weight: number;
  experience_projects_weight: number;
  qualifications_weight: number;
  preferred_skills_weight: number;
}

export interface MatchAnalysis {
  overall_score: number;
  score_label: string;
  score_explanation: string;
  score_breakdown: ScoreBreakdown;
  matched_requirements: EvidenceMatch[];
  partial_matches: EvidenceMatch[];
  missing_evidence: EvidenceMatch[];
  strengths: string[];
  recommendations: string[];
  confidence_notes: string[];
}

export interface ATSSection {
  name: string;
  present: boolean;
  notes?: string;
}

export interface KeywordResult {
  keyword: string;
  status: 'present_strong' | 'present_weak' | 'related_found' | 'not_found';
  context?: string;
}

export interface ATSAnalysis {
  readability_score: number;
  section_completeness: ATSSection[];
  formatting_warnings: string[];
  keyword_coverage: KeywordResult[];
  missing_relevant_keywords: string[];
  structural_recommendations: string[];
  limitations: string;
}

export interface ResumeSuggestion {
  section: string;
  original_text: string;
  suggested_text: string;
  reason: string;
  supporting_evidence?: string;
  requires_user_confirmation: boolean;
}

export interface SkillGap {
  skill: string;
  importance: string;
  evidence_status: EvidenceStatus;
  reason: string;
  suggested_action: string;
  related_job_requirement?: string;
}

export interface RoadmapItem {
  skill: string;
  why_it_matters: string;
  objective: string;
  practice_task: string;
  project_idea: string;
  estimated_effort: string;
  completion_criteria: string;
  priority: number;
}

export interface InterviewQuestion {
  question: string;
  category: 'technical' | 'project' | 'behavioral' | 'role_specific' | 'hr';
  difficulty: 'easy' | 'medium' | 'hard';
  reason: string;
  answer_points: string[];
  follow_up_question?: string;
}

export interface AnalysisResponse {
  analysis_id?: string;
  candidate_profile: CandidateProfile;
  job_requirements: JobRequirements;
  match_analysis: MatchAnalysis;
  ats_analysis: ATSAnalysis;
  resume_improvements: ResumeSuggestion[];
  skill_gaps: SkillGap[];
  learning_roadmap: RoadmapItem[];
  interview_questions: InterviewQuestion[];
  processing_time_seconds?: number;
  model_used?: string;
  disclaimer: string;
}

export interface AnalysisFormData {
  jobDescription: string;
  jobTitle?: string;
  companyName?: string;
  includeRoadmap: boolean;
  includeInterviewQuestions: boolean;
}

export interface APIError {
  detail: string;
}
