import React from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'

interface Props {
  message: string
  onRetry?: () => void
}

export default function ErrorMessage({ message, onRetry }: Props) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-4 flex gap-3">
      <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-red-800">Analysis Error</p>
        <p className="text-sm text-red-700 mt-0.5">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-red-700 hover:text-red-900 transition-colors"
          >
            <RefreshCw size={14} />
            Try Again
          </button>
        )}
      </div>
    </div>
  )
}
