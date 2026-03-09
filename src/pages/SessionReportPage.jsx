import { useParams, useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import ViolationTimeline from '../components/ViolationTimeline'
import VerdictCard from '../components/VerdictCard'
import {
  ArrowLeft,
  ShieldX,
  Eye,
  Layout,
  Clock,
  FileText,
  Camera,
} from 'lucide-react'

const MOCK_SESSION = {
  id:           'sess-001',
  studentName:  'Riya Sharma',
  studentId:    'STU-2024-0341',
  examName:     'Data Structures Midterm',
  examCode:     'CS301',
  seat:         '14B',
  startTime:    '2026-03-09T14:00:12',
  endTime:      '2026-03-09T16:00:00',
  duration:     '01:59:48',
  trustScore:   34,
  examScore:    72,
  totalViolations: 6,
  faceAbsent:   3,
  tabSwitches:  2,
  verdict:      'FLAGGED',
  events: [
    {
      type:      'SESSION_START',
      timestamp: '2026-03-09T14:00:12',
      detail:    'Webcam connected · Fullscreen enforced · Proctoring active',
    },
    {
      type:      'TAB_SWITCH',
      timestamp: '2026-03-09T14:18:44',
      detail:    'Student left the exam tab · Trust score reduced by 8 points',
    },
    {
      type:      'LOOKING_AWAY',
      timestamp: '2026-03-09T14:26:11',
      detail:    'Head pose off-center for 4.2 seconds · Trust score reduced by 5 points',
    },
    {
      type:      'MULTIPLE_FACES',
      timestamp: '2026-03-09T14:31:08',
      detail:    '2 faces detected in webcam frame · Trust score reduced by 20 points · Snapshot captured',
    },
    {
      type:      'NO_FACE',
      timestamp: '2026-03-09T14:42:30',
      detail:    'Student absent from frame for 12 seconds · Trust score reduced by 10 points · Snapshot captured',
    },
    {
      type:      'TAB_SWITCH',
      timestamp: '2026-03-09T14:55:17',
      detail:    'Second tab switch detected · Trust score reduced by 8 points',
    },
    {
      type:      'COPY_PASTE',
      timestamp: '2026-03-09T15:12:44',
      detail:    'Ctrl+V paste attempt intercepted and blocked',
    },
    {
      type:      'SESSION_END',
      timestamp: '2026-03-09T16:00:00',
      detail:    'Exam auto-submitted at time limit',
    },
  ],
  snapshots: [
    { label: 'Multiple faces',  time: '14:31:08', type: 'MULTIPLE_FACES' },
    { label: 'Face absent',     time: '14:42:30', type: 'NO_FACE'        },
    { label: 'Looking away',    time: '14:26:11', type: 'LOOKING_AWAY'   },
    { label: 'Tab returned',    time: '14:55:22', type: 'TAB_SWITCH'     },
  ],
}

function ReportStat({ label, value, color }) {
  return (
    <div className="bg-[#0c1829] rounded-xl p-4
                    border border-[rgba(0,229,255,0.08)]">
      <p className="font-['JetBrains_Mono'] text-[10px]
                    text-[#8899b0] mb-2 tracking-[0.5px]">
        {label}
      </p>
      <p
        className="font-['Syne'] text-2xl font-bold"
        style={{ color: color || '#e8f0f8' }}
      >
        {value}
      </p>
    </div>
  )
}

function SnapshotThumb({ snapshot }) {
  const snapshotColors = {
    MULTIPLE_FACES: '#ff3b5c',
    NO_FACE:        '#ffb020',
    LOOKING_AWAY:   '#ffb020',
    TAB_SWITCH:     '#8899b0',
  }
  const color = snapshotColors[snapshot.type] || '#8899b0'

  return (
    <div className="relative aspect-[4/3] rounded-xl
                    bg-[#070f20] overflow-hidden
                    border border-[rgba(0,229,255,0.08)]
                    flex items-center justify-center">

      <Camera
        size={28}
        strokeWidth={1}
        className="opacity-10"
        style={{ color }}
      />

      <div className="absolute bottom-0 left-0 right-0
                      px-2 py-1.5
                      bg-gradient-to-t from-black/80 to-transparent">
        <p
          className="font-['JetBrains_Mono'] text-[9px]"
          style={{ color }}
        >
          {snapshot.label}
        </p>
        <p className="font-['JetBrains_Mono'] text-[9px]
                      text-[#8899b0]">
          {snapshot.time}
        </p>
      </div>

    </div>
  )
}

export default function SessionReportPage() {
  const { sessionId } = useParams()
  const navigate      = useNavigate()

  const session = MOCK_SESSION

  function handleApprove() {
    navigate('/exams')
  }

  function handleEscalate() {
    navigate('/exams')
  }

  return (
    <div className="flex min-h-screen bg-[#040d1a]">

      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">

        <div className="flex items-center gap-3 mb-7">
          <button
            onClick={() => navigate(-1)}
            className="text-[#8899b0] hover:text-[#e8f0f8]
                       transition-colors cursor-pointer
                       bg-transparent border-none p-0"
          >
            <ArrowLeft size={16} strokeWidth={1.75} />
          </button>
          <div>
            <h1 className="font-['Syne'] text-2xl font-bold
                           text-[#e8f0f8]">
              Session Report
            </h1>
            <p className="text-sm text-[#8899b0]">
              {session.studentName} · {session.examName} ·{' '}
              09 Mar 2026
            </p>
          </div>
        </div>

        {/* ── Hero card ───────────────────────────────── */}
        <div className="bg-[#0c1829] rounded-2xl p-6 mb-6
                        border border-[rgba(0,229,255,0.08)]">

          <div className="grid grid-cols-1 lg:grid-cols-2
                          gap-6 items-start">

            {/* Student info */}
            <div>
              <p className="font-['JetBrains_Mono'] text-[10px]
                            text-[#8899b0] mb-1 tracking-[0.5px]">
                STUDENT
              </p>
              <h2 className="font-['Syne'] text-2xl font-bold
                             text-[#e8f0f8] mb-0.5">
                {session.studentName}
              </h2>
              <p className="font-['JetBrains_Mono'] text-[12px]
                            text-[#8899b0] mb-6">
                {session.studentId} · {session.examCode} · Seat {session.seat}
              </p>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Session Start', value: new Date(session.startTime).toLocaleTimeString() },
                  { label: 'Session End',   value: new Date(session.endTime).toLocaleTimeString()   },
                  { label: 'Duration',      value: session.duration                                  },
                ].map(item => (
                  <div key={item.label}>
                    <p className="text-[11px] text-[#8899b0] mb-1">
                      {item.label}
                    </p>
                    <p className="font-['JetBrains_Mono'] text-sm
                                  text-[#e8f0f8]">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Verdict */}
            <VerdictCard
              verdict={session.verdict}
              onApprove={handleApprove}
              onEscalate={handleEscalate}
            />

          </div>
        </div>

        {/* ── Stats row ───────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-5
                        gap-3 mb-6">
          <ReportStat
            label="TRUST SCORE"
            value={`${session.trustScore}%`}
            color="#ff3b5c"
          />
          <ReportStat
            label="VIOLATIONS"
            value={session.totalViolations}
            color="#ffb020"
          />
          <ReportStat
            label="FACE ABSENT"
            value={`${session.faceAbsent}x`}
            color="#e8f0f8"
          />
          <ReportStat
            label="TAB SWITCHES"
            value={`${session.tabSwitches}x`}
            color="#e8f0f8"
          />
          <ReportStat
            label="EXAM SCORE"
            value={`${session.examScore}%`}
            color="#00e5ff"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Violation timeline */}
          <div className="bg-[#0c1829] rounded-2xl p-6
                          border border-[rgba(0,229,255,0.08)]">

            <div className="flex items-center gap-2 mb-6">
              <Clock size={14} strokeWidth={1.75}
                     className="text-[#8899b0]" />
              <h3 className="font-['Syne'] text-sm font-semibold
                             text-[#e8f0f8]">
                Violation Timeline
              </h3>
            </div>

            <ViolationTimeline events={session.events} />

          </div>

          <div className="flex flex-col gap-6">

            {/* Snapshots */}
            <div className="bg-[#0c1829] rounded-2xl p-6
                            border border-[rgba(0,229,255,0.08)]">

              <div className="flex items-center gap-2 mb-4">
                <Camera size={14} strokeWidth={1.75}
                        className="text-[#8899b0]" />
                <h3 className="font-['Syne'] text-sm font-semibold
                               text-[#e8f0f8]">
                  Captured Snapshots
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {session.snapshots.map((snap, i) => (
                  <SnapshotThumb key={i} snapshot={snap} />
                ))}
              </div>

            </div>

            <div className="bg-[#0c1829] rounded-2xl p-6
                            border border-[rgba(0,229,255,0.08)]">

              <div className="flex items-center gap-2 mb-4">
                <FileText size={14} strokeWidth={1.75}
                          className="text-[#8899b0]" />
                <h3 className="font-['Syne'] text-sm font-semibold
                               text-[#e8f0f8]">
                  Proctor Recommendation
                </h3>
              </div>

              <p className="text-sm text-[#8899b0] leading-relaxed
                            mb-4">
                This session contains{' '}
                <span className="text-[#ff3b5c] font-medium">
                  {session.totalViolations} violations
                </span>{' '}
                including multiple-face detection and extended
                face absence. Trust score dropped to{' '}
                <span className="text-[#ff3b5c] font-medium">
                  {session.trustScore}%
                </span>.
                Manual review is strongly recommended before
                validating exam results.
              </p>

              <VerdictCard
                verdict={session.verdict}
                onApprove={handleApprove}
                onEscalate={handleEscalate}
              />

            </div>

          </div>
        </div>

      </main>
    </div>
  )
}