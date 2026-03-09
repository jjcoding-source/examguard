import { X, AlertTriangle, Clock, Eye, Layers } from 'lucide-react'

const VIOLATION_ICONS = {
  TAB_SWITCH:      Clock,
  FULLSCREEN_EXIT: Layers,
  NO_FACE:         Eye,
  MULTIPLE_FACES:  AlertTriangle,
  LOOKING_AWAY:    Eye,
  COPY_PASTE:      AlertTriangle,
  RIGHT_CLICK:     AlertTriangle,
}

const VIOLATION_COLORS = {
  HIGH:   '#ff3b5c',
  MEDIUM: '#ffb020',
  LOW:    '#8899b0',
}

export default function StudentDetailModal({ student, onClose }) {
  if (!student) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center
                 justify-center px-4
                 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-[#0c1829] rounded-2xl
                   border border-[rgba(0,229,255,0.12)] p-6
                   animate-page-enter max-h-[85vh]
                   overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >

        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="font-['Syne'] text-lg font-bold
                           text-[#e8f0f8] mb-0.5">
              {student.name}
            </h2>
            <p className="font-['JetBrains_Mono'] text-[11px]
                          text-[#8899b0]">
              {student.studentId} · {student.examCode}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#8899b0] hover:text-[#e8f0f8]
                       transition-colors cursor-pointer
                       bg-transparent border-none p-1"
          >
            <X size={18} strokeWidth={1.75} />
          </button>
        </div>

        {/* Trust score */}
        <div className="flex items-center gap-4 mb-6
                        p-4 rounded-xl bg-[#070f20]
                        border border-[rgba(0,229,255,0.08)]">
          <div>
            <p className="font-['JetBrains_Mono'] text-[10px]
                          text-[#8899b0] mb-1">
              TRUST SCORE
            </p>
            <p
              className="font-['Syne'] text-3xl font-bold"
              style={{
                color: student.trustScore >= 75
                  ? '#00e676'
                  : student.trustScore >= 40
                    ? '#ffb020'
                    : '#ff3b5c',
              }}
            >
              {student.trustScore}%
            </p>
          </div>

          <div className="flex-1">
            <div className="h-2 bg-[#0f2040] rounded-full
                            overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${student.trustScore}%`,
                  background: student.trustScore >= 75
                    ? '#00e676'
                    : student.trustScore >= 40
                      ? '#ffb020'
                      : '#ff3b5c',
                }}
              />
            </div>
            <p className="font-['JetBrains_Mono'] text-[10px]
                          text-[#8899b0] mt-1.5">
              {student.violations} violation{student.violations !== 1 ? 's' : ''} recorded
            </p>
          </div>
        </div>

        {/* Violation timeline */}
        <p className="font-['Syne'] text-xs font-semibold
                      text-[#8899b0] mb-4 tracking-wide">
          VIOLATION TIMELINE
        </p>

        {student.violationLog?.length > 0 ? (
          <div className="relative pl-5">

            <div className="absolute left-[7px] top-0 bottom-0
                            w-[2px] bg-[rgba(0,229,255,0.08)]" />

            {student.violationLog.map((v, i) => {
              const VIcon = VIOLATION_ICONS[v.type] || AlertTriangle
              const dotColor = VIOLATION_COLORS[v.severity] || '#8899b0'

              return (
                <div key={i} className="relative mb-5 last:mb-0">

                  <span
                    className="absolute -left-5 top-1
                               w-3 h-3 rounded-full
                               border-2 border-[#0c1829]"
                    style={{ background: dotColor }}
                  />

                  <p className="font-['JetBrains_Mono'] text-[10px]
                                text-[#8899b0] mb-0.5">
                    {new Date(v.timestamp).toLocaleTimeString()}
                  </p>
                  <div className="flex items-start gap-2">
                    <VIcon
                      size={13}
                      strokeWidth={1.75}
                      style={{ color: dotColor }}
                      className="mt-0.5 flex-shrink-0"
                    />
                    <div>
                      <p className="text-sm text-[#e8f0f8]">
                        {v.message}
                      </p>
                      <p
                        className="font-['JetBrains_Mono'] text-[10px]
                                   mt-0.5"
                        style={{ color: dotColor }}
                      >
                        {v.severity} severity
                      </p>
                    </div>
                  </div>

                </div>
              )
            })}

          </div>
        ) : (
          <p className="text-sm text-[#8899b0] text-center py-8">
            No violations recorded for this student.
          </p>
        )}

      </div>
    </div>
  )
}