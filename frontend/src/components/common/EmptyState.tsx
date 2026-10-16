import React from 'react'
import { Link } from 'react-router-dom'
import { FileSearch } from 'lucide-react'

interface Props {
  title?: string
  description?: string
  action?: { label: string; href: string }
}

export default function EmptyState({
  title = 'No analysis yet',
  description = 'Upload your resume and paste a job description to get started.',
  action = { label: 'Analyze My Resume', href: '/' },
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-4">
      <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center mb-4">
        <FileSearch size={28} className="text-brand-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-500 max-w-sm mb-6">{description}</p>
      <Link to={action.href} className="btn-primary">{action.label}</Link>
    </div>
  )
}
