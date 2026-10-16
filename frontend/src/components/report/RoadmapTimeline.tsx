import React, { useState } from 'react'
import { Clock, CheckSquare, Lightbulb, Code2, ChevronDown, ChevronUp } from 'lucide-react'
import type { RoadmapItem } from '../../types'

export default function RoadmapTimeline({ items }: { items: RoadmapItem[] }) {
  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <RoadmapCard key={i} item={item} index={i} />
      ))}
    </div>
  )
}

function RoadmapCard({ item, index }: { item: RoadmapItem; index: number }) {
  const [open, setOpen] = useState(index === 0)

  return (
    <div className="card overflow-hidden">
      <button
        className="w-full flex items-center gap-4 p-4 text-left hover:bg-slate-50 transition-colors"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
          {item.priority}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900">{item.skill}</h3>
          <p className="text-xs text-slate-500 mt-0.5">{item.estimated_effort}</p>
        </div>
        {open ? <ChevronUp size={16} className="text-slate-400 flex-shrink-0" /> : <ChevronDown size={16} className="text-slate-400 flex-shrink-0" />}
      </button>

      {open && (
        <div className="px-4 pb-4 border-t border-slate-100 space-y-3">
          {item.why_it_matters && (
            <div className="bg-brand-50 rounded-xl p-3">
              <p className="text-xs font-bold text-brand-700 mb-1">Why it matters</p>
              <p className="text-sm text-slate-700">{item.why_it_matters}</p>
            </div>
          )}
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="flex items-start gap-2">
              <CheckSquare size={14} className="text-brand-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-slate-700">Objective</p>
                <p className="text-sm text-slate-600">{item.objective}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Code2 size={14} className="text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-slate-700">Practice Task</p>
                <p className="text-sm text-slate-600">{item.practice_task}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Lightbulb size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-slate-700">Project Idea</p>
                <p className="text-sm text-slate-600">{item.project_idea}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Clock size={14} className="text-slate-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-slate-700">Completion Criteria</p>
                <p className="text-sm text-slate-600">{item.completion_criteria}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
