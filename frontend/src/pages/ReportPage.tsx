import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  BarChart2, 
  Download, 
  Share2, 
  FileText, 
  Brain, 
  BookOpen, 
  Mic, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  Clock, 
  Cpu, 
  Printer, 
  FileCode,
  ShieldCheck,
  ChevronRight
} from 'lucide-react'
import { useAnalysisContext } from '../context/AnalysisContext'
import ScoreCard from '../components/report/ScoreCard'
import RequirementList from '../components/report/RequirementList'
import EmptyState from '../components/common/EmptyState'
import { exportHTMLReport, copyToClipboard } from '../utils/export'

export default function ReportPage() {
  const { analysis, jobTitle, companyName } = useAnalysisContext()
  const [activeTab, setActiveTab] = useState<'all' | 'matched' | 'partial' | 'missing'>('all')
  const [copied, setCopied] = useState(false)

  const handleCopyJSON = async () => {
    if (!analysis) return
    const ok = await copyToClipboard(JSON.stringify(analysis, null, 2))
    if (ok) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!analysis) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 animate-fade-in space-y-6">
        <EmptyState
          title="No Analysis Report Found"
          description="Upload your resume and paste a job description to generate a full explainable match analysis."
          action={{ label: "Go to Analyzer", href: "/analyze" }}
        />
      </div>
    )
  }

  const { match_analysis, ats_analysis, candidate_profile, job_requirements } = analysis

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8 animate-fade-in">
      {/* Top Meta Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {jobTitle || job_requirements.job_title || 'Match Analysis Report'}
            </h1>
            {companyName && (
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
                {companyName}
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
            {analysis.processing_time_seconds && (
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {analysis.processing_time_seconds.toFixed(2)}s processing time
              </span>
            )}
            {analysis.model_used && (
              <span className="flex items-center gap-1">
                <Cpu size={12} />
                Engine: {analysis.model_used}
              </span>
            )}
            <span className="flex items-center gap-1 text-emerald-600 font-medium">
              <ShieldCheck size={12} />
              Verifiable Evidence
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => exportHTMLReport(analysis, jobTitle)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-brand-50 text-brand-700 hover:bg-brand-100 transition-colors border border-brand-200"
          >
            <Download size={14} />
            Export HTML
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <Printer size={14} />
            Print / PDF
          </button>
          <button
            onClick={handleCopyJSON}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <FileCode size={14} />
            {copied ? 'Copied JSON!' : 'Copy JSON'}
          </button>
        </div>
      </div>

      {/* Main Score & Breakdown */}
      <ScoreCard matchAnalysis={match_analysis} />

      {/* Quick Navigation Cards to Deep-Dive Pages */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link
          to="/ats-check"
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-brand-300 hover:shadow-sm transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400 group-hover:text-brand-600 mb-2">
            <FileText size={18} />
            <ChevronRight size={16} />
          </div>
          <div className="text-xl font-bold text-slate-900">{ats_analysis.readability_score}/100</div>
          <div className="text-xs text-slate-500 font-medium">ATS Readability</div>
        </Link>

        <Link
          to="/skill-gaps"
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-brand-300 hover:shadow-sm transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400 group-hover:text-brand-600 mb-2">
            <Brain size={18} />
            <ChevronRight size={16} />
          </div>
          <div className="text-xl font-bold text-slate-900">{analysis.skill_gaps.length}</div>
          <div className="text-xs text-slate-500 font-medium">Skill Gaps Found</div>
        </Link>

        <Link
          to="/roadmap"
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-brand-300 hover:shadow-sm transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400 group-hover:text-brand-600 mb-2">
            <BookOpen size={18} />
            <ChevronRight size={16} />
          </div>
          <div className="text-xl font-bold text-slate-900">{analysis.learning_roadmap.length} Steps</div>
          <div className="text-xs text-slate-500 font-medium">30-Day Roadmap</div>
        </Link>

        <Link
          to="/interview-prep"
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-brand-300 hover:shadow-sm transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400 group-hover:text-brand-600 mb-2">
            <Mic size={18} />
            <ChevronRight size={16} />
          </div>
          <div className="text-xl font-bold text-slate-900">{analysis.interview_questions.length} Qs</div>
          <div className="text-xs text-slate-500 font-medium">Mock Questions</div>
        </Link>
      </div>

      {/* Strengths & Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 size={18} className="text-emerald-500" />
            Top Key Strengths
          </h2>
          <ul className="space-y-2.5">
            {match_analysis.strengths.map((str, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Strategic Recommendations */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <AlertTriangle size={18} className="text-amber-500" />
            Strategic Recommendations
          </h2>
          <ul className="space-y-2.5">
            {match_analysis.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Requirement Breakdown Tabs */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Job Requirement Evidence Matches</h2>
            <p className="text-xs text-slate-500">Every requirement evaluated against demonstrated resume evidence.</p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs font-medium">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'all' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({match_analysis.matched_requirements.length + match_analysis.partial_matches.length + match_analysis.missing_evidence.length})
            </button>
            <button
              onClick={() => setActiveTab('matched')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'matched' ? 'bg-white text-emerald-700 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Demonstrated ({match_analysis.matched_requirements.length})
            </button>
            <button
              onClick={() => setActiveTab('partial')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'partial' ? 'bg-white text-amber-700 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Partial ({match_analysis.partial_matches.length})
            </button>
            <button
              onClick={() => setActiveTab('missing')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'missing' ? 'bg-white text-red-700 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Missing ({match_analysis.missing_evidence.length})
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {(activeTab === 'all' || activeTab === 'matched') && match_analysis.matched_requirements.length > 0 && (
            <RequirementList
              title="Demonstrated Requirements"
              items={match_analysis.matched_requirements}
              defaultOpen={true}
            />
          )}

          {(activeTab === 'all' || activeTab === 'partial') && match_analysis.partial_matches.length > 0 && (
            <RequirementList
              title="Partially Demonstrated Requirements"
              items={match_analysis.partial_matches}
              defaultOpen={true}
            />
          )}

          {(activeTab === 'all' || activeTab === 'missing') && match_analysis.missing_evidence.length > 0 && (
            <RequirementList
              title="Missing Requirements / Gaps"
              items={match_analysis.missing_evidence}
              defaultOpen={true}
            />
          )}
        </div>
      </div>

      {/* Confidence Notes */}
      {match_analysis.confidence_notes.length > 0 && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 space-y-1.5">
          <div className="font-semibold text-slate-800 flex items-center gap-1.5">
            <HelpCircle size={14} className="text-slate-500" />
            Scoring Transparency & Confidence Notes:
          </div>
          <ul className="list-disc list-inside space-y-1 pl-1">
            {match_analysis.confidence_notes.map((note, idx) => (
              <li key={idx}>{note}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Legal & Educational Disclaimer */}
      <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-800 space-y-1">
        <p className="font-semibold">Important Transparency Notice:</p>
        <p className="leading-relaxed">{analysis.disclaimer}</p>
      </div>
    </div>
  )
}
