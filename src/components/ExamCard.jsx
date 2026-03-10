import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  Users,
  Clock,
  Calendar,
  Radio,
  Monitor,
  PlayCircle,
  Eye,
  Plus,
} from 'lucide-react'

function getStatusBadge(status) {
  if (status === 'Live') {
    return (
      <span className="flex items-center gap-1.5
                       font-['JetBrains_Mono'] text-[10px]
                       text-[#00e5ff] px-2 py-0.5 rounded
                       bg-[rgba(0,229,255,0.08)]
                       border border-[rgba(0,229,255,0.20)]">
        <Radio size={8} strokeWidth={2.5}
               className="animate-live-pulse" />
        LIVE
      </span>
    )
  }
  if (status === 'Upcoming') {
    return (
      <span className="font-['JetBrains_Mono'] text-[10px]
                       px-2 py-0.5 rounded
                       bg-[rgba(255,176,32,0.10)]
                       text-[#ffb020]
                       border border-[rgba(255,176,32,0.25)]">
        UPCOMING
      </span>
    )
  }
  return (
    <span className="font-['JetBrains_Mono'] text-[10px]
                     px-2 py-0.5 rounded
                     bg-[#0f2040] text-[#8899b0]
                     border border-[rgba(0,229,255,0.08)]">
      ENDED
    </span>
  )
}

function getBorderColor(status) {
  if (status === 'Live')     return 'border-[rgba(0,229,255,0.20)]'
  if (status === 'Upcoming') return 'border-[rgba(255,176,32,0.20)]'
  return 'border-[rgba(0,229,255,0.08)]'
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', {
    day:   'numeric',
    month: 'short',
    year:  'numeric',
  })
}

function formatDuration(mins) {
  if (!mins) return '—'
  const h = Math.floor(mins / 60)
  const m = mins % 60
  if (h === 0) return `${m} mins`
  if (m === 0) return `${h} hr${h > 1 ? 's' : ''}`
  return `${h}h ${m}m`
}

export default function ExamCard({ exam }) {
  const navigate     = useNavigate()
  const { user }     = useAuth()
  const isInstructor = user?.role === 'Instructor'
  const isStudent    = user?.role === 'Student'

  return (
    <div className={`
      flex flex-col bg-[#0c1829] rounded-xl p-5
      border transition-all duration-150
      hover:border-[rgba(0,229,255,0.25)]
      ${getBorderColor(exam.status)}
    `}>

      {/* Header row */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0 pr-3">
          <p className="font-['JetBrains_Mono'] text-[10px]
                        text-[#00e5ff] mb-1">
            {exam.code}
          </p>
          <h3 className="font-['Syne'] text-sm font-semibold
                         text-[#e8f0f8] leading-snug">
            {exam.title}
          </h3>
        </div>
        {getStatusBadge(exam.status)}
      </div>

      {/* Instructor name */}
      {exam.instructorName && (
        <p className="text-[11px] text-[#8899b0] mb-3">
          {exam.instructorName}
        </p>
      )}

      {/* Meta row */}
      <div className="flex items-center gap-4 mb-4">
        <span className="flex items-center gap-1.5
                         font-['JetBrains_Mono'] text-[11px]
                         text-[#8899b0]">
          <Users size={12} strokeWidth={1.75} />
          {exam.studentCount ?? 0} students
        </span>
        <span className="flex items-center gap-1.5
                         font-['JetBrains_Mono'] text-[11px]
                         text-[#8899b0]">
          <Clock size={12} strokeWidth={1.75} />
          {formatDuration(exam.durationMinutes)}
        </span>
        <span className="flex items-center gap-1.5
                         font-['JetBrains_Mono'] text-[11px]
                         text-[#8899b0]">
          <Calendar size={12} strokeWidth={1.75} />
          {formatDate(exam.startTime)}
        </span>
      </div>

      {/* Divider */}
      <div className="h-[1px] bg-[rgba(0,229,255,0.06)] mb-4" />

      {/* Action buttons */}
      <div className="flex gap-2 mt-auto">

        {/* Instructor — Live */}
        {isInstructor && exam.status === 'Live' && (
          <>
            <button
              onClick={() => navigate(`/exam/${exam.id}/monitor`)}
              className="flex-1 flex items-center justify-center
                         gap-1.5 py-2 rounded-lg text-xs
                         font-semibold font-['Syne']
                         bg-[#00e5ff] text-[#040d1a]
                         border-none cursor-pointer
                         hover:opacity-90 transition-opacity"
            >
              <Monitor size={12} strokeWidth={2} />
              Monitor
            </button>
            <button
              onClick={() => navigate(`/exam/${exam.id}/questions`)}
              className="px-3 py-2 rounded-lg text-xs
                         bg-transparent text-[#8899b0]
                         border border-[rgba(0,229,255,0.08)]
                         cursor-pointer hover:text-[#e8f0f8]
                         transition-colors"
            >
              Questions
            </button>
          </>
        )}

        {/* Instructor — Upcoming */}
        {isInstructor && exam.status === 'Upcoming' && (
          <>
            <button
              onClick={() => navigate(`/exam/${exam.id}/questions`)}
              className="flex-1 flex items-center justify-center
                         gap-1.5 py-2 rounded-lg text-xs
                         font-semibold font-['Syne']
                         bg-[rgba(0,229,255,0.08)]
                         text-[#00e5ff]
                         border border-[rgba(0,229,255,0.20)]
                         cursor-pointer hover:opacity-80
                         transition-opacity"
            >
              <Plus size={12} strokeWidth={2} />
              Questions
            </button>
            <button
              className="px-3 py-2 rounded-lg text-xs
                         bg-transparent text-[#8899b0]
                         border border-[rgba(0,229,255,0.08)]
                         cursor-pointer hover:text-[#e8f0f8]
                         transition-colors"
            >
              Edit
            </button>
          </>
        )}

        {/* Instructor — Ended */}
        {isInstructor && exam.status === 'Ended' && (
          <>
            <button
              onClick={() => navigate(`/session/${exam.id}/report`)}
              className="flex-1 flex items-center justify-center
                         gap-1.5 py-2 rounded-lg text-xs
                         font-semibold font-['Syne']
                         bg-transparent text-[#8899b0]
                         border border-[rgba(0,229,255,0.08)]
                         cursor-pointer hover:text-[#e8f0f8]
                         transition-colors"
            >
              <Eye size={12} strokeWidth={1.75} />
              View Report
            </button>
            <button
              onClick={() => navigate(`/exam/${exam.id}/questions`)}
              className="px-3 py-2 rounded-lg text-xs
                         bg-transparent text-[#8899b0]
                         border border-[rgba(0,229,255,0.08)]
                         cursor-pointer hover:text-[#e8f0f8]
                         transition-colors"
            >
              Questions
            </button>
          </>
        )}

        {/* Student — Live */}
        {isStudent && exam.status === 'Live' && (
          <button
            onClick={() => navigate(`/exam/${exam.id}/take`)}
            className="flex-1 flex items-center justify-center
                       gap-1.5 py-2 rounded-lg text-xs
                       font-semibold font-['Syne']
                       bg-[#00e676] text-[#040d1a]
                       border-none cursor-pointer
                       hover:opacity-90 transition-opacity"
          >
            <PlayCircle size={12} strokeWidth={2} />
            Join Exam
          </button>
        )}

        {/* Student — Upcoming */}
        {isStudent && exam.status === 'Upcoming' && (
          <div className="flex-1 py-2 rounded-lg text-xs
                          text-center text-[#8899b0]
                          font-['JetBrains_Mono']
                          bg-[#070f20]
                          border border-[rgba(0,229,255,0.08)]">
            Starts {formatDate(exam.startTime)}
          </div>
        )}

        {/* Student — Ended */}
        {isStudent && exam.status === 'Ended' && (
          <button
            className="flex-1 flex items-center justify-center
                       gap-1.5 py-2 rounded-lg text-xs
                       font-semibold font-['Syne']
                       bg-transparent text-[#8899b0]
                       border border-[rgba(0,229,255,0.08)]
                       cursor-pointer hover:text-[#e8f0f8]
                       transition-colors"
          >
            <Eye size={12} strokeWidth={1.75} />
            View Result
          </button>
        )}

      </div>
    </div>
  )
}