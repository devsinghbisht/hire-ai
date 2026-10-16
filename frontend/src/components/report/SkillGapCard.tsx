import React from 'react'
import { Target, ArrowRight } from 'lucide-react'
import type { SkillGap } from '../../types'
import EvidenceBadge from './EvidenceBadge'

export default function SkillGapCard({ gap }: { gap: SkillGap }) {
  return (
    <div className="card p-4 flex gap-4 hover:shadow-md transition-shadow">
      <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0">
        <Target size={18} className="text-brand-600" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <h3 className="font-semibold text-slate-900">{gap.skill}</h3>
          <EvidenceBadge status={gap.evidence_status} />
          {gap.importance === 'required' && <span className="badge-red text-xs">Required</span>}
          {gap.importance === 'preferred' && <span className="badge-amber text-xs">Preferred</span>}
        </div>
        <p className="text-sm text-slate-600 mb-2">{gap.reason}</p>
        {gap.suggested_action && (
          <div className="flex items-start gap-1.5 text-sm text-brand-700 bg-brand-50 rounded-lg px-3 py-2">
            <ArrowRight size={14} className="mt-0.5 flex-shrink-0" />
            <span>{gap.suggested_action}</span>
          </div>
        )}
      </div>
    </div>
  )
}
