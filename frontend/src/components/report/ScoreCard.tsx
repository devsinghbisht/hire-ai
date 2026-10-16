import React from 'react'
import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import type { MatchAnalysis, ScoreBreakdown } from '../../types'
import { TrendingUp, Info } from 'lucide-react'

interface Props {
  matchAnalysis: MatchAnalysis
}

function scoreColor(score: number) {
  if (score >= 75) return { text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', bar: '#15803d' }
  if (score >= 50) return { text: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', bar: '#b45309' }
  return { text: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200', bar: '#dc2626' }
}

function BreakdownBar({ label, score, weight }: { label: string; score: number; weight: number }) {
  const colors = scoreColor(score)
  return (
    <div>
      <div className="flex justify-between text-xs text-slate-600 mb-1">
        <span className="font-medium">{label}</span>
        <span className={`font-bold ${colors.text}`}>{Math.round(score)}/100</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${score}%`, backgroundColor: colors.bar }}
        />
      </div>
      <p className="text-xs text-slate-400 mt-0.5">{Math.round(weight * 100)}% of total score</p>
    </div>
  )
}

export default function ScoreCard({ matchAnalysis }: Props) {
  const { overall_score, score_label, score_explanation, score_breakdown } = matchAnalysis
  const c = scoreColor(overall_score)
  const bd = score_breakdown

  return (
    <div className={`card p-6 border ${c.border} ${c.bg} animate-slide-up`}>
      <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
        {/* Big score */}
        <div className="flex-shrink-0 text-center">
          <div className={`text-7xl font-black ${c.text} leading-none`}>{overall_score}</div>
          <div className="text-lg text-slate-500 font-medium">/100</div>
          <div className={`mt-2 px-3 py-1 rounded-full text-xs font-semibold inline-block ${c.bg} ${c.text} border ${c.border}`}>
            {score_label}
          </div>
        </div>

        <div className="flex-1 space-y-4">
          {/* Explanation */}
          <div className="flex items-start gap-2">
            <Info size={14} className="text-slate-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-slate-700 leading-relaxed">{score_explanation}</p>
          </div>

          {/* Score breakdown bars */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Score Breakdown</h4>
            <BreakdownBar label="Essential Skills" score={bd.essential_skills_score} weight={bd.essential_skills_weight} />
            <BreakdownBar label="Projects & Experience" score={bd.experience_projects_score} weight={bd.experience_projects_weight} />
            <BreakdownBar label="Qualifications" score={bd.qualifications_score} weight={bd.qualifications_weight} />
            <BreakdownBar label="Preferred Skills & Tools" score={bd.preferred_skills_score} weight={bd.preferred_skills_weight} />
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-200">
        <div className="flex items-start gap-2">
          <TrendingUp size={14} className="text-brand-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-slate-500">
            Score measures alignment between the supplied resume and job description.
            It is not a prediction of hiring outcomes or interview selection.
          </p>
        </div>
      </div>
    </div>
  )
}
