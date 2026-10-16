import React from 'react'

interface Props {
  stage?: string
  className?: string
}

export default function LoadingSpinner({ stage, className = '' }: Props) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 gap-4 ${className}`} role="status" aria-live="polite">
      <div className="relative">
        <div className="w-14 h-14 rounded-full border-4 border-brand-100 border-t-brand-600 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 rounded-full bg-brand-50" />
        </div>
      </div>
      {stage && (
        <p className="text-sm font-medium text-slate-600 animate-pulse">{stage}</p>
      )}
    </div>
  )
}
