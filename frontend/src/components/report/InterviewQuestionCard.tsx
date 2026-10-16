import React, { useState } from 'react'
import { ChevronDown, ChevronUp, MessageSquare, ArrowRight } from 'lucide-react'
import type { InterviewQuestion } from '../../types'

const CATEGORY_COLORS: Record<string, string> = {
  technical: 'badge-blue',
  project: 'badge-green',
  behavioral: 'badge-amber',
  role_specific: 'badge-red',
  hr: 'badge-slate',
}

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: 'text-emerald-600',
  medium: 'text-amber-600',
  hard: 'text-red-600',
}

export default function InterviewQuestionCard({ question: q, index }: { question: InterviewQuestion; index: number }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="card overflow-hidden">
      <button
        className="w-full flex items-start gap-3 p-4 text-left hover:bg-slate-50 transition-colors"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        <div className="w-7 h-7 rounded-lg bg-brand-50 flex items-center justify-center flex-shrink-0 mt-0.5">
          <MessageSquare size={14} className="text-brand-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
            <span className={CATEGORY_COLORS[q.category] || 'badge-slate'}>{q.category}</span>
            <span className={`text-xs font-medium ${DIFFICULTY_COLORS[q.difficulty] || ''}`}>{q.difficulty}</span>
          </div>
          <p className="text-sm font-medium text-slate-800 leading-relaxed">{q.question}</p>
        </div>
        {open ? <ChevronUp size={16} className="text-slate-400 flex-shrink-0 mt-1" /> : <ChevronDown size={16} className="text-slate-400 flex-shrink-0 mt-1" />}
      </button>

      {open && (
        <div className="px-4 pb-4 border-t border-slate-100 space-y-3">
          {q.reason && (
            <p className="text-xs text-slate-500 italic">{q.reason}</p>
          )}
          {q.answer_points.length > 0 && (
            <div>
              <p className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">Key Answer Points</p>
              <ul className="space-y-1.5">
                {q.answer_points.map((pt, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                    <ArrowRight size={13} className="text-brand-500 mt-0.5 flex-shrink-0" />
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {q.follow_up_question && (
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-xs font-semibold text-slate-600 mb-1">Follow-up:</p>
              <p className="text-sm text-slate-700 italic">"{q.follow_up_question}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
