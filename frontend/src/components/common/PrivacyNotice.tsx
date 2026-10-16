import React from 'react'
import { Shield } from 'lucide-react'

export default function PrivacyNotice() {
  return (
    <div className="flex items-start gap-2.5 text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-xl p-3">
      <Shield size={14} className="text-brand-500 flex-shrink-0 mt-0.5" />
      <p>
        Your resume content is sent to Google's Gemini API for analysis. Uploaded files are
        not permanently stored. No account or personal information is collected.{' '}
        <a href="/privacy" className="text-brand-600 hover:underline font-medium">Learn more →</a>
      </p>
    </div>
  )
}
