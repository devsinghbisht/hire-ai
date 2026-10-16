import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import type { EvidenceMatch } from '../../types'
import EvidenceBadge from './EvidenceBadge'

interface Props {
  title: string
  items: EvidenceMatch[]
  defaultOpen?: boolean
  emptyMessage?: string
}

export default function RequirementList({ title, items, defaultOpen = true, emptyMessage }: Props) {
  const [open, setOpen] = useState(defaultOpen)

  if (items.length === 0 && !emptyMessage) return null

  return (
    <div className="card overflow-hidden">
      <button
        className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-800">{title}</span>
          <span className="badge-slate">{items.length}</span>
        </div>
        {open ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-2 border-t border-slate-100">
          {items.length === 0 ? (
            <p className="text-sm text-slate-500 py-2">{emptyMessage}</p>
          ) : (
            items.map((item, i) => (
              <div key={i} className="flex items-start gap-3 py-2 border-b border-slate-50 last:border-0">
                <EvidenceBadge status={item.evidence_status} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800">{item.requirement}</p>
                  {item.resume_evidence && (
                    <p className="text-xs text-slate-500 mt-0.5 italic">"{item.resume_evidence}"</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
