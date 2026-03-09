import { ShieldCheck, ShieldAlert, ShieldX } from 'lucide-react'

function getScheme(score) {
  if (score >= 75) return {
    color:  '#00e676',
    bg:     'rgba(0,230,118,0.10)',
    border: 'rgba(0,230,118,0.25)',
    Icon:   ShieldCheck,
    label:  'Good Standing',
  }
  if (score >= 40) return {
    color:  '#ffb020',
    bg:     'rgba(255,176,32,0.10)',
    border: 'rgba(255,176,32,0.25)',
    Icon:   ShieldAlert,
    label:  'Under Review',
  }
  return {
    color:  '#ff3b5c',
    bg:     'rgba(255,59,92,0.10)',
    border: 'rgba(255,59,92,0.30)',
    Icon:   ShieldX,
    label:  'Flagged',
  }
}

export default function TrustScoreMeter({ score }) {
  const scheme = getScheme(score)
  const { Icon } = scheme

  return (
    <div
      className="rounded-xl p-4 border"
      style={{
        background:   scheme.bg,
        borderColor:  scheme.border,
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon
            size={14}
            strokeWidth={2}
            style={{ color: scheme.color }}
          />
          <span className="font-['Syne'] text-xs font-semibold
                           text-[#e8f0f8]">
            Trust Score
          </span>
        </div>
        <span
          className="font-['JetBrains_Mono'] text-xl font-medium"
          style={{ color: scheme.color }}
        >
          {score}%
        </span>
      </div>

      <div className="h-2 bg-[#0f2040] rounded-full overflow-hidden mb-2">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width:      `${score}%`,
            background: scheme.color,
            boxShadow:  `0 0 8px ${scheme.color}`,
          }}
        />
      </div>

      <p
        className="font-['JetBrains_Mono'] text-[10px]
                   tracking-wide"
        style={{ color: scheme.color }}
      >
        {scheme.label}
      </p>

    </div>
  )
}