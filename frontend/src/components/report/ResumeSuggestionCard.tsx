import React, { useState } from 'react'
import { ChevronDown, ChevronUp, Lightbulb, Check, X, ShieldAlert } from 'lucide-react'
import type { ResumeSuggestion } from '../../types'
import CopyButton from '../common/CopyButton'

export default function ResumeSuggestionCard({ suggestion }: { suggestion: ResumeSuggestion }) {
  const [open, setOpen] = useState(true)
  const [status, setStatus] = useState<'pending' | 'accepted' | 'rejected'>('pending')

  return (
    <div className={`card border transition-all overflow-hidden ${
      status === 'accepted' ? 'border-emerald-300 bg-emerald-50/20' : status === 'rejected' ? 'border-slate-200 opacity-60' : 'border-slate-200'
    }`}>
      <button
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-slate-50/80 transition-colors"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
          status === 'accepted' ? 'bg-emerald-100 text-emerald-700' : status === 'rejected' ? 'bg-slate-100 text-slate-400' : 'bg-amber-100 text-amber-600'
        }`}>
          {status === 'accepted' ? <Check size={16} /> : status === 'rejected' ? <X size={16} /> : <Lightbulb size={16} />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wide">{suggestion.section}</span>
            {status === 'accepted' && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                Accepted for local edit
              </span>
            )}
            {status === 'rejected' && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                Dismissed
              </span>
            )}
          </div>
          <p className="text-sm font-semibold text-slate-800 truncate mt-0.5">{suggestion.reason}</p>
        </div>
        {open ? <ChevronUp size={16} className="text-slate-400 flex-shrink-0" /> : <ChevronDown size={16} className="text-slate-400 flex-shrink-0" />}
      </button>

      {open && (
        <div className="px-4 pb-4 border-t border-slate-100 space-y-3">
          <div className="grid sm:grid-cols-2 gap-3 pt-3">
            <div className="bg-red-50/80 border border-red-100 rounded-xl p-3">
              <p className="text-xs font-bold text-red-600 mb-1.5 uppercase tracking-wide">Original Bullet</p>
              <p className="text-sm text-slate-700 leading-relaxed font-mono text-xs">{suggestion.original_text}</p>
            </div>
            <div className="bg-emerald-50/80 border border-emerald-100 rounded-xl p-3 flex flex-col justify-between">
              <div>
                <p className="text-xs font-bold text-emerald-700 mb-1.5 uppercase tracking-wide">Suggested Rewrite</p>
                <p className="text-sm text-slate-800 leading-relaxed font-medium">{suggestion.suggested_text}</p>
              </div>
              <div className="mt-3 flex items-center justify-between pt-2 border-t border-emerald-200/60">
                <CopyButton text={suggestion.suggested_text} label="Copy suggestion" />
              </div>
            </div>
          </div>

          {suggestion.supporting_evidence && (
            <p className="text-xs text-slate-600 italic bg-slate-50 border border-slate-100 rounded-lg p-2.5">
              <strong>Grounding Evidence:</strong> {suggestion.supporting_evidence}
            </p>
          )}

          {/* Accept / Reject controls for local editing session */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
            <p className="text-[11px] text-amber-700 bg-amber-50 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5">
              <ShieldAlert size={12} className="flex-shrink-0" />
              Confirm before using: Ensure metrics reflect your genuine experience.
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStatus('rejected')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                  status === 'rejected'
                    ? 'bg-slate-200 text-slate-700'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <X size={13} />
                Reject
              </button>
              <button
                type="button"
                onClick={() => setStatus('accepted')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                  status === 'accepted'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                }`}
              >
                <Check size={13} />
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
