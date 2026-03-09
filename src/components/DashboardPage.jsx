import { useAuth } from '../context/AuthContext'
import Sidebar from '../components/Sidebar'
import StatCard from '../components/StatCard'
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Users,
  Eye,
} from 'lucide-react'

const MOCK_EXAMS = [
  {
    id: 1,
    name: 'Data Structures Midterm',
    code: 'CS301',
    students: 48,
    remaining: '01:12',
    status: 'live',
  },
  {
    id: 2,
    name: 'Algorithm Analysis',
    code: 'CS402',
    students: 31,
    remaining: '00:47',
    status: 'live',
  },
  {
    id: 3,
    name: 'Database Systems',
    code: 'CS505',
    students: 22,
    remaining: null,
    startsAt: '16:00 today',
    status: 'upcoming',
  },
  {
    id: 4,
    name: 'Operating Systems Final',
    code: 'CS601',
    students: 55,
    remaining: null,
    status: 'ended',
  },
]

const MOCK_ALERTS = [
  {
    id: 1,
    type: 'error',
    text: 'Riya Sharma — Multiple faces detected',
    meta: 'CS301 · 14:31:08',
  },
  {
    id: 2,
    type: 'warn',
    text: 'Kevin Park — Tab switched 3 times',
    meta: 'CS402 · 14:29:52',
  },
  {
    id: 3,
    type: 'warn',
    text: 'Priya Nair — Looking away repeatedly',
    meta: 'CS301 · 14:28:15',
  },
  {
    id: 4,
    type: 'warn',
    text: 'Tom Walsh — Exited fullscreen',
    meta: 'CS402 · 14:26:40',
  },
]

const MOCK_TRUST = [
  { name: 'Meera Pillai',  score: 94 },
  { name: 'Akhil Das',     score: 88 },
  { name: 'Kevin Park',    score: 61 },
  { name: 'Riya Sharma',   score: 34 },
]

function getStatusBadge(status) {
  if (status === 'live') {
    return (
      <span className="flex items-center gap-1.5
                       font-['JetBrains_Mono'] text-[10px]
                       text-[#00e5ff]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#00e5ff]
                         animate-live-pulse" />
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

function getTrustColor(score) {
  if (score >= 75) return 'bg-[#00e676]'
  if (score >= 50) return 'bg-[#ffb020]'
  return 'bg-[#ff3b5c]'
}

function getTrustTextColor(score) {
  if (score >= 75) return 'text-[#00e676]'
  if (score >= 50) return 'text-[#ffb020]'
  return 'text-[#ff3b5c]'
}

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className="flex min-h-screen bg-[#040d1a]">

      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">

        <div className="mb-8">
          <h1 className="font-['Syne'] text-2xl font-bold
                         text-[#e8f0f8] mb-1">
            {user?.role} Dashboard
          </h1>
          <p className="text-sm text-[#8899b0]">
            Monday, 09 March 2026 · 3 exams scheduled today
          </p>
        </div>

        {/* ── Stats row ──────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4
                        gap-4 mb-8">
          <StatCard
            label="ACTIVE EXAMS"
            value="3"
            sub="2 with live students"
            valueColor="text-[#00e5ff]"
          />
          <StatCard
            label="STUDENTS ONLINE"
            value="142"
            sub="18 joined recently"
            valueColor="text-[#00e676]"
          />
          <StatCard
            label="ALERTS TODAY"
            value="27"
            sub="5 flagged sessions"
            valueColor="text-[#ffb020]"
          />
          <StatCard
            label="FLAGGED SESSIONS"
            value="5"
            sub="Requires review"
            valueColor="text-[#ff3b5c]"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2
                        gap-6 mb-6">

          {/* Active exams list */}
          <div className="bg-[#0c1829] rounded-xl p-5
                          border border-[rgba(0,229,255,0.08)]">

            <div className="flex items-center justify-between mb-5">
              <h2 className="font-['Syne'] text-sm font-semibold
                             text-[#e8f0f8]">
                Active Exams
              </h2>
              <span className="font-['JetBrains_Mono'] text-[10px]
                               px-2 py-0.5 rounded
                               bg-[rgba(0,229,255,0.12)]
                               text-[#00e5ff]
                               border border-[rgba(0,229,255,0.25)]">
                LIVE
              </span>
            </div>

            <div className="flex flex-col divide-y
                            divide-[rgba(0,229,255,0.08)]">
              {MOCK_EXAMS.map((exam) => (
                <div key={exam.id}
                     className="flex items-center justify-between
                                py-3 first:pt-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium
                                  text-[#e8f0f8] mb-0.5">
                      {exam.name}
                    </p>
                    <p className="font-['JetBrains_Mono'] text-[10px]
                                  text-[#8899b0]">
                      {exam.code} ·{' '}
                      {exam.students} students ·{' '}
                      {exam.remaining
                        ? `${exam.remaining} remaining`
                        : exam.startsAt
                          ? `Starts ${exam.startsAt}`
                          : 'Yesterday'}
                    </p>
                  </div>
                  {getStatusBadge(exam.status)}
                </div>
              ))}
            </div>

          </div>

          <div className="bg-[#0c1829] rounded-xl p-5
                          border border-[rgba(0,229,255,0.08)]">

            <div className="flex items-center justify-between mb-5">
              <h2 className="font-['Syne'] text-sm font-semibold
                             text-[#e8f0f8]">
                Recent Alerts
              </h2>
              <span className="font-['JetBrains_Mono'] text-[10px]
                               px-2 py-0.5 rounded
                               bg-[rgba(255,59,92,0.10)]
                               text-[#ff3b5c]">
                5 new
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {MOCK_ALERTS.map((alert) => (
                <div key={alert.id}
                     className="flex items-start gap-3">

                  {alert.type === 'error' ? (
                    <AlertTriangle
                      size={14}
                      className="text-[#ff3b5c] mt-0.5 flex-shrink-0"
                      strokeWidth={2}
                    />
                  ) : (
                    <Clock
                      size={14}
                      className="text-[#ffb020] mt-0.5 flex-shrink-0"
                      strokeWidth={2}
                    />
                  )}

                  <div>
                    <p className="text-sm text-[#b0c2d8]">
                      {alert.text}
                    </p>
                    <p className="font-['JetBrains_Mono'] text-[10px]
                                  text-[#8899b0] mt-0.5">
                      {alert.meta}
                    </p>
                  </div>

                </div>
              ))}
            </div>

          </div>

        </div>

        <div className="bg-[#0c1829] rounded-xl p-5
                        border border-[rgba(0,229,255,0.08)]">

          <div className="flex items-center justify-between mb-5">
            <h2 className="font-['Syne'] text-sm font-semibold
                           text-[#e8f0f8]">
              Student Trust Scores — CS301 Midterm
            </h2>
            <Eye
              size={14}
              className="text-[#8899b0]"
              strokeWidth={1.75}
            />
          </div>

          <div className="flex flex-col gap-4">
            {MOCK_TRUST.map((s) => (
              <div key={s.name}>

                <div className="flex justify-between
                                text-sm mb-1.5">
                  <span className="text-[#b0c2d8]">
                    {s.name}
                  </span>
                  <span className={`font-['JetBrains_Mono']
                                    text-[11px]
                                    ${getTrustTextColor(s.score)}`}>
                    {s.score}%
                  </span>
                </div>

                <div className="h-1.5 bg-[#0f2040] rounded-full
                                overflow-hidden">
                  <div
                    className={`h-full rounded-full
                                transition-all duration-500
                                ${getTrustColor(s.score)}`}
                    style={{ width: `${s.score}%` }}
                  />
                </div>

              </div>
            ))}
          </div>

        </div>

      </main>

    </div>
  )
}