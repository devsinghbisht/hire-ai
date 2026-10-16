import type { AnalysisResponse, ATSAnalysis, InterviewQuestion } from '../types';

const BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:8000';

export class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'APIError';
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let detail = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      detail = body.detail || detail;
    } catch {
      // ignore parse errors
    }
    throw new APIError(res.status, detail);
  }
  return res.json() as Promise<T>;
}

export const api = {
  async health(): Promise<{ status: string; ai_configured: boolean; model: string }> {
    const res = await fetch(`${BASE_URL}/health`);
    return handleResponse(res);
  },

  async analyze(
    file: File,
    jobDescription: string,
    jobTitle?: string,
    companyName?: string,
    includeRoadmap = true,
    includeInterviewQuestions = true,
  ): Promise<AnalysisResponse> {
    const form = new FormData();
    form.append('resume', file);
    form.append('job_description', jobDescription);
    if (jobTitle) form.append('job_title', jobTitle);
    if (companyName) form.append('company_name', companyName);
    form.append('include_roadmap', String(includeRoadmap));
    form.append('include_interview_questions', String(includeInterviewQuestions));

    const res = await fetch(`${BASE_URL}/api/v1/analyze`, {
      method: 'POST',
      body: form,
    });
    return handleResponse<AnalysisResponse>(res);
  },

  async atsCheck(file: File, jobDescription?: string): Promise<ATSAnalysis> {
    const form = new FormData();
    form.append('resume', file);
    if (jobDescription) form.append('job_description', jobDescription);
    const res = await fetch(`${BASE_URL}/api/v1/ats-check`, {
      method: 'POST',
      body: form,
    });
    return handleResponse<ATSAnalysis>(res);
  },

  async generateInterviewQuestions(
    file: File,
    jobDescription: string,
    categories?: string[],
    count = 12,
  ): Promise<InterviewQuestion[]> {
    const form = new FormData();
    form.append('resume', file);
    form.append('job_description', jobDescription);
    if (categories?.length) form.append('categories', categories.join(','));
    form.append('question_count', String(count));
    const res = await fetch(`${BASE_URL}/api/v1/interview-questions`, {
      method: 'POST',
      body: form,
    });
    return handleResponse<InterviewQuestion[]>(res);
  },

  async improveResume(
    resumeText: string,
    jobDescription: string,
    section?: string,
  ) {
    const res = await fetch(`${BASE_URL}/api/v1/resume-improve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        resume_text: resumeText,
        job_description: jobDescription,
        section: section || null,
      }),
    });
    return handleResponse<any[]>(res);
  },

  async saveAnalysis(
    analysis: AnalysisResponse,
    jobTitle?: string,
    companyName?: string,
  ): Promise<{ id: string; access_token: string; message: string }> {
    const res = await fetch(`${BASE_URL}/api/v1/analyses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        analysis,
        job_title: jobTitle || null,
        company_name: companyName || null,
      }),
    });
    return handleResponse<{ id: string; access_token: string; message: string }>(res);
  },

  async getSavedAnalysis(analysisId: string, accessToken: string): Promise<AnalysisResponse> {
    const res = await fetch(`${BASE_URL}/api/v1/analyses/${analysisId}`, {
      headers: { 'X-Access-Token': accessToken },
    });
    return handleResponse<AnalysisResponse>(res);
  },

  async deleteSavedAnalysis(analysisId: string, accessToken: string): Promise<{ message: string }> {
    const res = await fetch(`${BASE_URL}/api/v1/analyses/${analysisId}`, {
      method: 'DELETE',
      headers: { 'X-Access-Token': accessToken },
    });
    return handleResponse<{ message: string }>(res);
  },
};

