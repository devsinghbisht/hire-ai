import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Info, 
  Tag, 
  ListChecks, 
  ShieldAlert,
  ArrowRight,
  Upload,
  RefreshCw,
  Loader2
} from 'lucide-react'
import { useAnalysisContext } from '../context/AnalysisContext'
import ScoreRing from '../components/common/ScoreRing'
import { api, APIError } from '../services/api'
import type { ATSAnalysis } from '../types'

export default function ATSPage() {
  const { analysis } = useAnalysisContext()

  // Local state for standalone check if no context analysis is present
  const [standaloneResult, setStandaloneResult] = useState<ATSAnalysis | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [jd, setJd] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const activeAts = standaloneResult || analysis?.ats_analysis

  const handleStandaloneSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      setError('Please select a PDF resume file to evaluate.')
      return
    }
    setError(null)
    setLoading(true)
    try {
      const res = await api.atsCheck(file, jd || undefined)
      setStandaloneResult(res)
    } catch (err) {
      if (err instanceof APIError) {
        setError(err.message)
      } else {
        setError('Failed to complete ATS check. Please ensure you upload a text-based PDF.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <FileText className="text-brand-600" size={30} />
          Applicant Tracking System (ATS) Diagnostic
        </h1>
        <p className="text-slate-600 text-sm sm:text-base">
          Analyze document structure, formatting compatibility, section coverage, and contextual keyword density.
        </p>
      </div>

      {/* Standalone Upload Form when no active analysis or to check another file */}
      {!activeAts && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Upload size={18} className="text-brand-600" />
              Upload Resume for Instant ATS Check
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              No account required. Upload a text-based PDF to check readability and structural parsing heuristics.
            </p>
          </div>

          <form onSubmit={handleStandaloneSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                PDF Resume File *
              </label>
              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) setFile(f)
                }}
                className="w-full text-sm text-slate-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 cursor-pointer border border-slate-200 rounded-xl p-2 bg-slate-50/50"
              />
              {file && (
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                Target Job Description (Optional)
              </label>
              <textarea
                rows={4}
                value={jd}
                onChange={(e) => setJd(e.target.value)}
                placeholder="Paste the job description here to check term coverage and relevance..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                <AlertTriangle size={14} className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !file}
              className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Evaluating Structure & Keywords...</span>
                </>
              ) : (
                <>
                  <FileText size={16} />
                  <span>Run Standalone ATS Diagnostic</span>
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Render Findings if activeAts exists */}
      {activeAts && (
        <>
          {/* Action row */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">
              Diagnostic Mode: Heuristic ATS Validation
            </span>
            <button
              onClick={() => {
                setStandaloneResult(null)
                setFile(null)
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-brand-600 hover:bg-slate-100 transition-colors"
            >
              <RefreshCw size={12} />
              Check Another Resume
            </button>
          </div>

          {/* ATS Score Banner */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <ScoreRing score={activeAts.readability_score} size={140} label="Readability Score" />
            </div>

            <div className="flex-1 space-y-3 text-center sm:text-left">
              <h2 className="text-xl font-bold text-slate-900">
                {activeAts.readability_score >= 80 ? 'Excellent ATS Formatting' : activeAts.readability_score >= 60 ? 'Moderate ATS Readability' : 'ATS Formatting Needs Attention'}
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Applicant Tracking Systems read resumes sequentially as raw text. Clean single-column hierarchies, standard section headers, and semantic bullets ensure your experiences parse accurately.
              </p>
              <div className="pt-1 flex flex-wrap gap-2 justify-center sm:justify-start">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 size={12} />
                  {activeAts.section_completeness.filter(s => s.present).length} of {activeAts.section_completeness.length} Core Sections Detected
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  <Tag size={12} />
                  {activeAts.keyword_coverage.filter(k => k.status.startsWith('present')).length} Keywords Present
                </span>
              </div>
            </div>
          </div>

          {/* Section Completeness & Warnings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Section Completeness */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ListChecks size={18} className="text-brand-600" />
                Standard Resume Sections
              </h3>
              <div className="divide-y divide-slate-100">
                {activeAts.section_completeness.map((sec, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      {sec.present ? (
                        <CheckCircle2 size={16} className="text-emerald-500" />
                      ) : (
                        <XCircle size={16} className="text-red-400" />
                      )}
                      <span className={`text-sm ${sec.present ? 'font-medium text-slate-800' : 'text-slate-400'}`}>
                        {sec.name}
                      </span>
                    </div>
                    {sec.notes && (
                      <span className="text-xs text-slate-400">{sec.notes}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Formatting Warnings */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle size={18} className="text-amber-500" />
                Formatting Warnings
              </h3>
              {activeAts.formatting_warnings.length === 0 ? (
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
                  <span>No major formatting anomalies or complex multi-column tables detected.</span>
                </div>
              ) : (
                <ul className="space-y-2.5">
                  {activeAts.formatting_warnings.map((warn, i) => (
                    <li key={i} className="flex items-start gap-2.5 p-3 rounded-lg bg-amber-50/60 border border-amber-200/80 text-xs text-amber-900">
                      <AlertTriangle size={14} className="text-amber-600 mt-0.5 flex-shrink-0" />
                      <span>{warn}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Keyword Coverage */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Tag size={18} className="text-brand-600" />
              Job Keyword Coverage
            </h3>
            <p className="text-xs text-slate-500">
              Evaluates how closely key terminology from the job description is mirrored in your resume text.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {activeAts.keyword_coverage.map((kw, i) => {
                const isStrong = kw.status === 'present_strong'
                const isWeak = kw.status === 'present_weak'
                const isRelated = kw.status === 'related_found'
                
                const badgeClasses = isStrong
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : isWeak
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : isRelated
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-slate-100 text-slate-500 border-slate-200'

                return (
                  <span
                    key={i}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border ${badgeClasses}`}
                    title={kw.context || kw.status}
                  >
                    {isStrong && '✓'}
                    {isWeak && '~'}
                    {isRelated && '≈'}
                    {!isStrong && !isWeak && !isRelated && '✕'}
                    {kw.keyword}
                  </span>
                )
              })}
            </div>
          </div>

          {/* Structural Recommendations */}
          {activeAts.structural_recommendations.length > 0 && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Info size={18} className="text-brand-600" />
                Structural Optimization Tips
              </h3>
              <ul className="space-y-2">
                {activeAts.structural_recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 flex-shrink-0" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ATS Myth-Busting Notice */}
          <div className="bg-slate-100 rounded-2xl p-6 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
              <ShieldAlert size={16} className="text-slate-600" />
              The Truth About ATS "Auto-Rejection"
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {activeAts.limitations || "Contrary to widespread marketing claims, modern ATS software does not automatically reject resumes based on arbitrary keyword counts. Human recruiters review applicants; ATS systems merely parse text and facilitate indexing. Focus on clarity, quantifiable accomplishments, and genuine relevance rather than keyword stuffing."}
            </p>
          </div>
        </>
      )}
    </div>
  )
}
