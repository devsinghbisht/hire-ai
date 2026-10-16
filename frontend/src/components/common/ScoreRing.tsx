import React from 'react'

interface Props {
  score: number
  size?: number
  strokeWidth?: number
  label?: string
}

export default function ScoreRing({ score, size = 120, strokeWidth = 10, label }: Props) {
  const r = (size - strokeWidth) / 2
  const circ = 2 * Math.PI * r
  const dash = (score / 100) * circ

  const color = score >= 75 ? '#15803d' : score >= 50 ? '#b45309' : '#dc2626'
  const textColor = score >= 75 ? 'text-emerald-700' : score >= 50 ? 'text-amber-700' : 'text-red-700'

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }} aria-hidden="true">
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={strokeWidth} />
        <circle
          cx={size/2} cy={size/2} r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.8s ease-out' }}
        />
      </svg>
      <div className="text-center -mt-24">
        <div className={`text-4xl font-black ${textColor}`}>{score}</div>
        <div className="text-xs text-slate-500 font-medium">/100</div>
      </div>
      {label && <div className="text-sm font-semibold text-slate-700 mt-16">{label}</div>}
    </div>
  )
}
