import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  Clock,
  Users,
  CalendarDays,
  Radio,
  MonitorPlay,
  FileText,
  Pencil,
} from 'lucide-react'

function StatusBadge({ status }) {
  if (status === 'live') {
    return (
      <span className="flex items-center gap-1.5
                       font-['JetBrains_Mono'] text-[10px]
                       text-[#00e5ff]">
        <span className="w-1.5 h-1.5 rounded-full
                         bg-[#00e5ff] animate-live-pulse" />
        LIVE
      </span>
    )
  }
  if (status === 'upcoming') {
    return (
      <span className="font-['JetBrains_Mono'] text-[10px]
                       px-2 py-0.5 rounded
                       bg-[rgba(255,176,32,0.10)]
                       text-[#ffb020]">
        UPCOMING
      </span>
    )
  }
  return (
    <span className="font-['JetBrains_Mono'] text-[10px]
                     px-2 py-0.5 rounded
                     bg-[#0f2040] text-[#8899b0]">
      ENDED
    </span>
  )
}

function statusBarColor(status) {
  if (status === 'live')     return 'bg-[#00e5ff]'
  if (status === 'upcoming') return 'bg-[#ffb020]'
  return 'bg-[#8899b0]'
}

export default function ExamCard({ exam }) {
  const { user } = useAuth()
  const navigate = useNavigate()

  const isInstructor = user?.role === 'Instructor'
  const isStudent    = user?.role === 'Student'

  return (
    <div className="relative bg-[#0c1829] rounded-xl
                    border border-[rgba(0,229,255,0.08)]
                    overflow-hidden flex flex-col">

      <div className={`h-[3px] w-full ${statusBarColor(exam.status)}`} />

      <div className="p-5 flex flex-col flex-1">

        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-['Syne'] text-base font-bold
                           text-[#e8f0f8] mb-0.5">
              {exam.name}
            </h3>
            <p className="font-['JetBrains_Mono'] text-[11px]
                          text-[#8899b0]">
              {exam.code} · {exam.instructor}
            </p>
          </div>
          <StatusBadge status={exam.status} />
        </div>

        <div className="flex gap-5 mt-4 mb-5">
          <div className="flex items-center gap-1.5
                          text-[#8899b0]">
            <Users size={12} strokeWidth={1.75} />
            <span className="font-['JetBrains_Mono'] text-[11px]">
              {exam.students}
            </span>
          </div>

          <div className="flex items-center gap-1.5
                          text-[#8899b0]">
            <Clock size={12} strokeWidth={1.75} />
            <span className="font-['JetBrains_Mono'] text-[11px]">
              {exam.duration} hrs
            </span>
          </div>

          <div className="flex items-center gap-1.5
                          text-[#8899b0]">
            <CalendarDays size={12} strokeWidth={1.75} />
            <span className="font-['JetBrains_Mono'] text-[11px]">
              {exam.date}
            </span>
          </div>
        </div>

        {/* Trust bar (live exams only) */}
        {exam.status === 'live' && exam.avgTrust && (
          <div className="mb-5">
            <div className="flex justify-between mb-1.5">
              <span className="font-['JetBrains_Mono'] text-[10px]
                               text-[#8899b0]">
                Avg. trust
              </span>
              <span className="font-['JetBrains_Mono'] text-[10px]
                               text-[#00e676]">
                {exam.avgTrust}%
              </span>
            </div>
            <div className="h-1 bg-[#0f2040] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#00e676] rounded-full"
                style={{ width: `${exam.avgTrust}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex-1" />

        {/* Action buttons */}
        <div className="flex gap-2 mt-4">

          {/* Student actions */}
          {isStudent && exam.status === 'live' && (
            <button
              onClick={() => navigate(`/exam/${exam.id}/take`)}
              className="flex-1 py-2 rounded-lg text-xs
                         font-semibold font-['Syne']
                         bg-[#00e5ff] text-[#040d1a]
                         border-none cursor-pointer
                         transition-opacity duration-150
                         hover:opacity-90"
            >
              Join Exam
            </button>
          )}

          {isStudent && exam.status === 'ended' && (
            <button
              className="flex-1 py-2 rounded-lg text-xs
                         bg-transparent
                         text-[#8899b0] cursor-pointer
                         border border-[rgba(0,229,255,0.08)]">
              View Result
            </button>
          )}

          {isStudent && exam.status === 'upcoming' && (
            <p className="text-xs text-[#8899b0]
                          font-['JetBrains_Mono'] py-2">
              Starts {exam.date}
            </p>
          )}

          {/* Instructor actions */}
          {isInstructor && exam.status === 'live' && (
            <>
              <button
                onClick={() => navigate(`/exam/${exam.id}/monitor`)}
                className="flex-1 flex items-center justify-center
                           gap-1.5 py-2 rounded-lg text-xs
                           font-semibold font-['Syne']
                           bg-[#00e5ff] text-[#040d1a]
                           border-none cursor-pointer
                           hover:opacity-90 transition-opacity">
                <MonitorPlay size={12} strokeWidth={2} />
                Monitor
              </button>
              <button
                className="flex-1 flex items-center justify-center
                           gap-1.5 py-2 rounded-lg text-xs
                           bg-transparent text-[#b0c2d8]
                           border border-[rgba(0,229,255,0.08)]
                           cursor-pointer">
                <FileText size={12} strokeWidth={1.75} />
                Details
              </button>
            </>
          )}

          {isInstructor && exam.status === 'upcoming' && (
            <>
              <button
                className="flex-1 flex items-center justify-center
                           gap-1.5 py-2 rounded-lg text-xs
                           bg-transparent text-[#b0c2d8]
                           border border-[rgba(0,229,255,0.08)]
                           cursor-pointer">
                <Pencil size={12} strokeWidth={1.75} />
                Edit
              </button>
              <button
                className="flex-1 flex items-center justify-center
                           gap-1.5 py-2 rounded-lg text-xs
                           bg-transparent text-[#b0c2d8]
                           border border-[rgba(0,229,255,0.08)]
                           cursor-pointer">
                <FileText size={12} strokeWidth={1.75} />
                Preview
              </button>
            </>
          )}

          {isInstructor && exam.status === 'ended' && (
            <>
              <button
                className="flex-1 flex items-center justify-center
                           gap-1.5 py-2 rounded-lg text-xs
                           bg-transparent text-[#b0c2d8]
                           border border-[rgba(0,229,255,0.08)]
                           cursor-pointer">
                <FileText size={12} strokeWidth={1.75} />
                Reports
              </button>
            </>
          )}

        </div>
      </div>
    </div>
  )
}