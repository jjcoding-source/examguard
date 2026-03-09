import { useState } from 'react'
import {
  AlertTriangle,
  ShieldX,
  ShieldAlert,
  ShieldCheck,
  XCircle,
} from 'lucide-react'

function getTrustScheme(score) {
  if (score >= 75) return {
    color:       '#00e676',
    border:      'rgba(0,230,118,0.20)',
    bg:          'rgba(0,230,118,0.04)',
    Icon:        ShieldCheck,
    label:       'Clean',
  }
  if (score >= 40) return {
    color:       '#ffb020',
    border:      'rgba(255,176,32,0.30)',
    bg:          'rgba(255,176,32,0.04)',
    Icon:        ShieldAlert,
    label:       'Warning',
  }
  return {
    color:       '#ff3b5c',
    border:      'rgba(255,59,92,0.35)',
    bg:          'rgba(255,59,92,0.06)',
    Icon:        ShieldX,
    label:       'Flagged',
  }
}

function initials(name) {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export default function StudentCard({ student, onViewDetail, onTerminate }) {
  const scheme     = getTrustScheme(student.trustScore)
  const { Icon }   = scheme

  return (
    <div
      className="relative flex flex-col bg-[#0c1829]
                 rounded-xl p-4 border cursor-pointer
                 transition-all duration-150
                 hover:border-[rgba(0,229,255,0.20)]"
      style={{
        borderColor: scheme.border,
        background:  scheme.bg,
      }}
      onClick={() => onViewDetail(student)}
    >

      <div
        className="absolute top-3 right-3
                   font-['JetBrains_Mono'] text-[9px]
                   px-1.5 py-0.5 rounded flex items-center gap-1"
        style={{
          color:      scheme.color,
          background: `${scheme.color}18`,
        }}
      >
        <Icon size={9} strokeWidth={2} />
        {scheme.label.toUpperCase()}
      </div>

      <div
        className="w-10 h-10 rounded-full flex items-center
                   justify-center mb-3
                   font-['Syne'] text-sm font-bold
                   border border-[rgba(0,229,255,0.15)]"
        style={{ background: '#0f2040', color: '#00e5ff' }}
      >
        {initials(student.name)}
      </div>

      <p className="text-sm font-medium text-[#e8f0f8] mb-0.5
                    truncate pr-12">
        {student.name}
      </p>
      <p className="font-['JetBrains_Mono'] text-[10px]
                    text-[#8899b0] mb-3">
        {student.studentId}
      </p>

      <div className="h-1 bg-[#0f2040] rounded-full mb-2
                      overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width:      `${student.trustScore}%`,
            background: scheme.color,
          }}
        />
      </div>

      <div className="flex justify-between items-center">
        <span
          className="font-['JetBrains_Mono'] text-[11px]"
          style={{ color: scheme.color }}
        >
          {student.trustScore}%
        </span>
        <span className="font-['JetBrains_Mono'] text-[10px]
                         text-[#8899b0]">
          {student.violations} violation{student.violations !== 1 ? 's' : ''}
        </span>
      </div>

      <button
        onClick={e => {
          e.stopPropagation()
          onTerminate(student)
        }}
        className="mt-3 w-full flex items-center justify-center
                   gap-1.5 py-1.5 rounded-lg text-[11px]
                   bg-transparent cursor-pointer
                   text-[#8899b0] border border-[rgba(255,59,92,0.15)]
                   hover:text-[#ff3b5c]
                   hover:border-[rgba(255,59,92,0.40)]
                   hover:bg-[rgba(255,59,92,0.06)]
                   transition-all duration-150"
      >
        <XCircle size={12} strokeWidth={1.75} />
        Terminate
      </button>

    </div>
  )
}