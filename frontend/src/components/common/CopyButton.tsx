import React, { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { copyToClipboard } from '../../utils/export'

interface Props {
  text: string
  label?: string
  className?: string
}

export default function CopyButton({ text, label = 'Copy', className = '' }: Props) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const ok = await copyToClipboard(text)
    if (ok) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className={`btn-ghost ${className}`}
      aria-label={copied ? 'Copied!' : `Copy ${label}`}
    >
      {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
      <span>{copied ? 'Copied!' : label}</span>
    </button>
  )
}
