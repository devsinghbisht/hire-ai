import React, { useState } from 'react'
import { Sparkles, CheckCircle2, Copy, Filter, ShieldCheck } from 'lucide-react'
import { useAnalysisContext } from '../context/AnalysisContext'
import ResumeSuggestionCard from '../components/report/ResumeSuggestionCard'
import EmptyState from '../components/common/EmptyState'

export default function ImprovePage() {
  const { analysis } = useAnalysisContext()
  const [selectedSection, setSelectedSection] = useState<string>('all')

  if (!analysis) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 animate-fade-in">
        <EmptyState
          title="No Resume Suggestions Available"
          description="Analyze your resume with a job posting to view targeted accomplishment-driven bullet improvements."
          action={{ label: "Go to Analyzer", href: "/analyze" }}
        />
      </div>
    )
  }

  const suggestions = analysis.resume_improvements || []
  const sections = ['all', ...Array.from(new Set(suggestions.map(s => s.section)))]

  const filtered = selectedSection === 'all'
    ? suggestions
    : suggestions.filter(s => s.section === selectedSection)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <Sparkles className="text-brand-600" size={30} />
          High-Impact Resume Rewrites
        </h1>
        <p className="text-slate-600 text-sm sm:text-base">
          Side-by-side bullet enhancements using action verbs and quantifiable metrics. Every suggestion requires your confirmation to prevent false claims.
        </p>
      </div>

      {/* Safety Notice */}
      <div className="p-4 bg-blue-50/80 rounded-xl border border-blue-200 text-xs text-blue-900 flex items-start gap-2.5">
        <ShieldCheck size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
        <span>
          <strong>Anti-Hallucination Policy:</strong> HireAI will never invent companies, dates, or false achievements. Suggested metrics (e.g. percentages or benchmarks) reflect standard industry framing and should only be adopted if they accurately match your actual contribution.
        </span>
      </div>

      {/* Filter Tabs */}
      {sections.length > 2 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
            <Filter size={13} />
            Filter Section:
          </span>
          {sections.map(sec => (
            <button
              key={sec}
              onClick={() => setSelectedSection(sec)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                selectedSection === sec
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {sec}
            </button>
          ))}
        </div>
      )}

      {/* Suggestions List */}
      <div className="space-y-6">
        {filtered.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500">
            No suggestions found for this section.
          </div>
        ) : (
          filtered.map((sug, i) => (
            <ResumeSuggestionCard key={i} suggestion={sug} />
          ))
        )}
      </div>
    </div>
  )
}
