import {
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  CheckCircle2,
  Flag,
} from 'lucide-react'

const VERDICT_CONFIG = {
  CLEAN: {
    Icon:       ShieldCheck,
    color:      '#00e676',
    bg:         'rgba(0,230,118,0.08)',
    border:     'rgba(0,230,118,0.25)',
    label:      'Clean',
    sublabel:   'No significant violations detected.',
    actionBg:   'rgba(0,230,118,0.12)',
    actionText: '#00e676',
  },
  REVIEW: {
    Icon:       ShieldAlert,
    color:      '#ffb020',
    bg:         'rgba(255,176,32,0.08)',
    border:     'rgba(255,176,32,0.25)',
    label:      'Review Required',
    sublabel:   'Moderate violations detected. Manual review recommended.',
    actionBg:   'rgba(255,176,32,0.12)',
    actionText: '#ffb020',
  },
  FLAGGED: {
    Icon:       ShieldX,
    color:      '#ff3b5c',
    bg:         'rgba(255,59,92,0.08)',
    border:     'rgba(255,59,92,0.25)',
    label:      'Flagged',
    sublabel:   'Serious violations found. Immediate review required.',
    actionBg:   'rgba(255,59,92,0.12)',
    actionText: '#ff3b5c',
  },
}

export default function VerdictCard({ verdict, onApprove, onEscalate }) {
  const config    = VERDICT_CONFIG[verdict]
  const { Icon }  = config

  return (
    <div
      className="rounded-xl p-5 border"
      style={{
        background:  config.bg,
        borderColor: config.border,
      }}
    >

      {/* Icon + label */}
      <div className="flex items-center gap-3 mb-3">
        <Icon
          size={22}
          strokeWidth={1.75}
          style={{ color: config.color }}
        />
        <div>
          <p
            className="font-['Syne'] text-base font-bold"
            style={{ color: config.color }}
          >
            {config.label}
          </p>
          <p className="text-[12px] text-[#8899b0] mt-0.5">
            {config.sublabel}
          </p>
        </div>
      </div>

      <div className="h-[1px] bg-[rgba(0,229,255,0.08)] mb-4" />

      {/* Action buttons */}
      <div className="flex gap-2">
        <button
          onClick={onApprove}
          className="flex-1 flex items-center justify-center
                     gap-1.5 py-2 rounded-lg text-xs
                     font-semibold font-['Syne']
                     cursor-pointer border-none
                     transition-opacity duration-150
                     hover:opacity-80
                     bg-[rgba(0,230,118,0.12)]
                     text-[#00e676]"
        >
          <CheckCircle2 size={13} strokeWidth={2} />
          Approve Result
        </button>

        <button
          onClick={onEscalate}
          className="flex-1 flex items-center justify-center
                     gap-1.5 py-2 rounded-lg text-xs
                     font-semibold font-['Syne']
                     cursor-pointer
                     transition-opacity duration-150
                     hover:opacity-80
                     bg-[rgba(255,59,92,0.10)]
                     text-[#ff3b5c]
                     border border-[rgba(255,59,92,0.25)]"
        >
          <Flag size={13} strokeWidth={2} />
          Escalate
        </button>
      </div>

    </div>
  )
}