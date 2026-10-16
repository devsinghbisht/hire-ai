import React from 'react'
import { BookOpen, Calendar, CheckSquare, Target, Sparkles } from 'lucide-react'
import { useAnalysisContext } from '../context/AnalysisContext'
import RoadmapTimeline from '../components/report/RoadmapTimeline'
import EmptyState from '../components/common/EmptyState'

export default function RoadmapPage() {
  const { analysis } = useAnalysisContext()

  if (!analysis) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 animate-fade-in">
        <EmptyState
          title="No Learning Roadmap Available"
          description="Analyze your resume with a target job description to generate a prioritized 30-day learning curriculum."
          action={{ label: "Go to Analyzer", href: "/analyze" }}
        />
      </div>
    )
  }

  const items = analysis.learning_roadmap || []

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <BookOpen className="text-brand-600" size={30} />
          Personalized 30-Day Learning Roadmap
        </h1>
        <p className="text-slate-600 text-sm sm:text-base">
          A phased, objective-oriented plan designed to close your critical skill gaps through practical tasks and tangible portfolio projects.
        </p>
      </div>

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-brand-50 to-indigo-50 border border-brand-200/80 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-bold text-brand-900 text-sm">
            <Calendar size={16} className="text-brand-600" />
            Structured for Fast Execution
          </div>
          <p className="text-xs text-brand-700 leading-relaxed max-w-xl">
            Each item specifies a practice task, a portfolio-ready project concept, estimated hours, and verifiable completion criteria.
          </p>
        </div>
        <div className="px-4 py-2 bg-white rounded-xl border border-brand-200 text-xs font-bold text-brand-700 shadow-sm">
          {items.length} Structured Milestones
        </div>
      </div>

      {/* Roadmap Component */}
      {items.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500">
          No learning roadmap items were generated for this match.
        </div>
      ) : (
        <RoadmapTimeline items={items} />
      )}
    </div>
  )
}
