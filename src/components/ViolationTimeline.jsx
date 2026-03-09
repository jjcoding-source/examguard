import {
  Eye,
  Users,
  Layout,
  MousePointerClick,
  Copy,
  PlayCircle,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react'

const TYPE_CONFIG = {
  SESSION_START: {
    Icon:  PlayCircle,
    color: '#00e5ff',
    label: 'Session Started',
  },
  SESSION_END: {
    Icon:  CheckCircle2,
    color: '#8899b0',
    label: 'Session Ended',
  },
  NO_FACE: {
    Icon:  Eye,
    color: '#ff3b5c',
    label: 'No Face Detected',
  },
  MULTIPLE_FACES: {
    Icon:  Users,
    color: '#ff3b5c',
    label: 'Multiple Faces Detected',
  },
  LOOKING_AWAY: {
    Icon:  Eye,
    color: '#ffb020',
    label: 'Looking Away',
  },
  TAB_SWITCH: {
    Icon:  Layout,
    color: '#ffb020',
    label: 'Tab Switch Detected',
  },
  FULLSCREEN_EXIT: {
    Icon:  Layout,
    color: '#ffb020',
    label: 'Exited Fullscreen',
  },
  COPY_PASTE: {
    Icon:  Copy,
    color: '#ffb020',
    label: 'Copy / Paste Attempt',
  },
  RIGHT_CLICK: {
    Icon:  MousePointerClick,
    color: '#8899b0',
    label: 'Right Click Blocked',
  },
}

function formatTimestamp(ts) {
  return new Date(ts).toLocaleTimeString('en-US', {
    hour:   '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

export default function ViolationTimeline({ events }) {
  return (
    <div className="relative pl-6">

      <div className="absolute left-[9px] top-0 bottom-0
                      w-[2px]
                      bg-[rgba(0,229,255,0.08)]" />

      {events.map((event, i) => {
        const config = TYPE_CONFIG[event.type] || {
          Icon:  AlertTriangle,
          color: '#8899b0',
          label: event.type,
        }
        const { Icon } = config

        return (
          <div key={i} className="relative mb-6 last:mb-0">

            <span
              className="absolute -left-6 top-[3px]
                         w-[14px] h-[14px] rounded-full
                         border-2 border-[#0c1829]
                         flex-shrink-0"
              style={{ background: config.color }}
            />

            {/* Time */}
            <p className="font-['JetBrains_Mono'] text-[10px]
                          text-[#8899b0] mb-1">
              {formatTimestamp(event.timestamp)}
            </p>

            {/* Event row */}
            <div className="flex items-start gap-2">
              <Icon
                size={14}
                strokeWidth={1.75}
                className="mt-0.5 flex-shrink-0"
                style={{ color: config.color }}
              />
              <div>
                <p className="text-sm font-medium text-[#e8f0f8]
                              mb-0.5">
                  {config.label}
                </p>
                <p className="text-[12px] text-[#8899b0]
                              leading-relaxed">
                  {event.detail}
                </p>
              </div>
            </div>

          </div>
        )
      })}

    </div>
  )
}