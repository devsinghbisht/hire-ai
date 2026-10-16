import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Brain, Filter, ArrowRight, BookOpen, AlertCircle } from 'lucide-react'
import { useAnalysisContext } from '../context/AnalysisContext'
import SkillGapCard from '../components/report/SkillGapCard'
import EmptyState from '../components/common/EmptyState'

export default function SkillGapsPage() {
  const { analysis } = useAnalysisContext()
  const [filterImportance, setFilterImportance] = useState<string>('all')

  if (!analysis) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 animate-fade-in">
        <EmptyState
          title="No Skill Gaps Identified"
          description="Analyze your resume against a target job description to discover missing competencies and actionable steps to bridge them."
          action={{ label: "Go to Analyzer", href: "/analyze" }}
        />
      </div>
    )
  }

  const gaps = analysis.skill_gaps || []
  const filtered = filterImportance === 'all'
    ? gaps
    : gaps.filter(g => g.importance.toLowerCase() === filterImportance.toLowerCase())

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Brain className="text-brand-600" size={30} />
            Identified Skill Gaps
          </h1>
          <p className="text-slate-600 text-sm sm:text-base">
            Competencies from the job description that lack explicit proof in your resume, accompanied by suggested bridging projects.
          </p>
        </div>

        {analysis.learning_roadmap && analysis.learning_roadmap.length > 0 && (
          <Link
            to="/roadmap"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-sm transition-all"
          >
            <BookOpen size={14} />
            View 30-Day Learning Roadmap
            <ArrowRight size={14} />
          </Link>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
          <Filter size={13} />
          Importance:
        </span>
        {['all', 'required', 'preferred'].map(imp => (
          <button
            key={imp}
            onClick={() => setFilterImportance(imp)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
              filterImportance === imp
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {imp}
          </button>
        ))}
      </div>

      {/* Gaps List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500">
            No skill gaps match the selected filter.
          </div>
        ) : (
          filtered.map((gap, i) => (
            <SkillGapCard key={i} gap={gap} />
          ))
        )}
      </div>
    </div>
  )
}
