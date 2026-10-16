import React from 'react'
import { CheckCircle2, Circle, XCircle, HelpCircle } from 'lucide-react'
import type { EvidenceStatus } from '../../types'

const config = {
  demonstrated: { label: 'Demonstrated', icon: CheckCircle2, cls: 'badge-green' },
  partial: { label: 'Partial', icon: Circle, cls: 'badge-amber' },
  not_found: { label: 'Evidence Not Found', icon: XCircle, cls: 'badge-red' },
  unclear: { label: 'Unclear', icon: HelpCircle, cls: 'badge-slate' },
}

export default function EvidenceBadge({ status }: { status: EvidenceStatus }) {
  const { label, icon: Icon, cls } = config[status] ?? config.unclear
  return (
    <span className={cls}>
      <Icon size={11} />
      {label}
    </span>
  )
}
