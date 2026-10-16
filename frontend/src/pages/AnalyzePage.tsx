import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Target, Sparkles, AlertCircle, FileText, Briefcase, Building2, CheckSquare } from 'lucide-react'
import ResumeUpload from '../components/upload/ResumeUpload'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'
import { useAnalysisContext } from '../context/AnalysisContext'
import { useAnalysis } from '../hooks/useAnalysis'

const SAMPLE_JD_FULLSTACK = `Senior Full-Stack Engineer — Platform & AI
TechForward Inc. | Remote / Hybrid

ABOUT THE ROLE:
We are looking for a Senior Full-Stack Engineer to join our core Platform team. You will build high-throughput APIs, intuitive user interfaces, and collaborate closely with our machine learning engineers to integrate generative AI models into customer workflows.

RESPONSIBILITIES:
• Design, implement, and maintain scalable APIs using Python (FastAPI/Django) and Node.js.
• Develop responsive, performant web applications using React, TypeScript, and modern CSS.
• Deploy and maintain cloud infrastructure on AWS/GCP with Docker and Kubernetes.
• Collaborate on system design, database schemas, and microservice architecture.
• Write comprehensive unit, integration, and end-to-end tests.

REQUIREMENTS:
• 5+ years of software engineering experience in modern full-stack environments.
• Strong proficiency in Python and modern TypeScript/React.
• Hands-on experience with relational databases (PostgreSQL preferred) and query optimization.
• Solid background with containerization (Docker) and cloud deployments (AWS or GCP).
• Familiarity with CI/CD automation pipelines and test-driven development.
• Strong communication skills and enthusiasm for mentoring fellow engineers.

NICE TO HAVE:
• Experience with LLM APIs (OpenAI, Anthropic, Gemini) or vector databases.
• Experience with GraphQL or gRPC microservices.`

const SAMPLE_JD_DATA = `Senior Data Analyst / BI Engineer
FinMetrics Global | New York, NY (Hybrid)

ABOUT THE ROLE:
We are seeking a Senior Data Analyst with deep SQL and data modeling expertise to transform raw financial transaction data into high-leverage executive dashboards and actionable automated insights.

RESPONSIBILITIES:
• Author complex analytical SQL queries against Snowflake and PostgreSQL warehouses.
• Build, maintain, and optimize executive KPI dashboards in Tableau and Power BI.
• Partner with product and finance leaders to define core retention and revenue metrics.
• Implement reproducible ETL data transformation pipelines using Python and dbt.

REQUIREMENTS:
• 4+ years of data analytics or business intelligence experience.
• Advanced SQL skills (window functions, CTEs, query performance tuning).
• Strong hands-on experience with Python for data manipulation (pandas, numpy).
• Experience building production dashboards in Tableau or PowerBI.
• Solid grasp of statistical concepts (A/B testing, cohort analysis).`

export default function AnalyzePage() {
  const navigate = useNavigate()
  const {
    jobDescription,
    setJobDescription,
    jobTitle,
    companyName,
    setJobInfo,
    resumeFile,
    setResumeFile,
    setAnalysis,
  } = useAnalysisContext()

  const { state, analyze, reset } = useAnalysis()
  const [includeRoadmap, setIncludeRoadmap] = useState(true)
  const [includeInterview, setIncludeInterview] = useState(true)
  const [validationError, setValidationError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError(null)

    if (!resumeFile) {
      setValidationError('Please upload a resume file (PDF, DOCX, or TXT).')
      return
    }

    if (!jobDescription.trim() || jobDescription.trim().length < 50) {
      setValidationError('Please provide a complete job description (at least 50 characters).')
      return
    }

    const result = await analyze(
      resumeFile,
      jobDescription,
      jobTitle || undefined,
      companyName || undefined,
      includeRoadmap,
      includeInterview,
    )

    if (result) {
      setAnalysis(result)
      navigate('/report')
    }
  }

  const handleApplySample = (type: 'fullstack' | 'data') => {
    if (type === 'fullstack') {
      setJobDescription(SAMPLE_JD_FULLSTACK)
      setJobInfo('Senior Full-Stack Engineer — Platform & AI', 'TechForward Inc.')
    } else {
      setJobDescription(SAMPLE_JD_DATA)
      setJobInfo('Senior Data Analyst / BI Engineer', 'FinMetrics Global')
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <Target className="text-brand-600" size={30} />
          Analyze Resume & Match Job Description
        </h1>
        <p className="text-slate-600 text-sm sm:text-base">
          Upload your resume alongside target job requirements to generate an explainable score, ATS diagnosis, skill gaps, and custom career roadmap.
        </p>
      </div>

      {/* Loading Overlay */}
      {state.status === 'loading' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 shadow-sm text-center">
          <LoadingSpinner stage={state.stage} />
        </div>
      )}

      {/* Error Display */}
      {state.status === 'error' && (
        <ErrorMessage message={state.message} onRetry={reset} />
      )}

      {/* Form */}
      {state.status !== 'loading' && (
        <form onSubmit={handleSubmit} className="space-y-8">
          {validationError && (
            <div className="flex items-center gap-2.5 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 text-sm">
              <AlertCircle size={18} className="flex-shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column: Resume Upload */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <FileText size={18} className="text-brand-600" />
                    1. Upload Resume
                  </h2>
                  <span className="text-xs text-slate-500 font-medium">PDF, DOCX, TXT (Max 10MB)</span>
                </div>

                <ResumeUpload
                  file={resumeFile}
                  onChange={f => {
                    setResumeFile(f)
                    if (validationError) setValidationError(null)
                  }}
                  error={validationError && !resumeFile ? 'Resume file is required' : undefined}
                />

                <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-500 border border-slate-200/60 flex items-start gap-2">
                  <Sparkles size={14} className="text-brand-500 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Privacy Guarantee:</strong> Resumes are processed in memory and never stored or retained on disk.
                  </span>
                </div>
              </div>

              {/* Target Job Meta Details */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-slate-500">
                  Optional Job Details
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                      <Briefcase size={13} className="text-slate-400" />
                      Job Title
                    </label>
                    <input
                      type="text"
                      value={jobTitle}
                      onChange={e => setJobInfo(e.target.value, companyName)}
                      placeholder="e.g. Senior Full-Stack Engineer"
                      className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                      <Building2 size={13} className="text-slate-400" />
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={e => setJobInfo(jobTitle, e.target.value)}
                      placeholder="e.g. Acme Corporation"
                      className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Job Description */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-4 flex flex-col h-full">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Briefcase size={18} className="text-brand-600" />
                    2. Job Description
                  </h2>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-slate-400">Sample:</span>
                    <button
                      type="button"
                      onClick={() => handleApplySample('fullstack')}
                      className="text-xs text-brand-600 hover:text-brand-800 font-medium underline px-1"
                    >
                      Full-Stack
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                      type="button"
                      onClick={() => handleApplySample('data')}
                      className="text-xs text-brand-600 hover:text-brand-800 font-medium underline px-1"
                    >
                      Data Analyst
                    </button>
                  </div>
                </div>

                <div className="flex-1 flex flex-col">
                  <textarea
                    rows={14}
                    value={jobDescription}
                    onChange={e => {
                      setJobDescription(e.target.value)
                      if (validationError) setValidationError(null)
                    }}
                    placeholder="Paste the full job posting here (including requirements, responsibilities, and qualifications)..."
                    className="w-full flex-1 p-3.5 text-sm rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition-all font-mono leading-relaxed"
                  />
                  <div className="flex justify-between items-center mt-2 text-xs text-slate-400">
                    <span>Markdown and raw text supported</span>
                    <span>{jobDescription.length} characters</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Configuration Options */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-900">Analysis Features</h3>
              <p className="text-xs text-slate-500">Toggle personalized AI recommendations included in your report.</p>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeRoadmap}
                  onChange={e => setIncludeRoadmap(e.target.checked)}
                  className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4 cursor-pointer"
                />
                <span className="flex items-center gap-1.5">
                  <CheckSquare size={14} className="text-brand-500" />
                  30-Day Learning Roadmap
                </span>
              </label>

              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeInterview}
                  onChange={e => setIncludeInterview(e.target.checked)}
                  className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4 cursor-pointer"
                />
                <span className="flex items-center gap-1.5">
                  <CheckSquare size={14} className="text-brand-500" />
                  Targeted Interview Prep
                </span>
              </label>
            </div>
          </div>

          {/* Action CTA */}
          <div className="flex justify-center pt-2">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-md hover:shadow-lg transition-all text-base"
            >
              <Target size={18} />
              Run Complete Match & ATS Analysis
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
