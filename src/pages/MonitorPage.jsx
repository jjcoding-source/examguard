import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import StudentCard from '../components/StudentCard'
import StudentDetailModal from '../components/StudentDetailModal'
import {
  Radio,
  Users,
  AlertTriangle,
  ShieldX,
  StopCircle,
  ArrowLeft,
} from 'lucide-react'

const MOCK_STUDENTS = [
  {
    id:         1,
    name:       'Riya Sharma',
    studentId:  'STU-2024-0341',
    examCode:   'CS301',
    trustScore: 34,
    violations: 6,
    status:     'flagged',
    violationLog: [
      { type: 'MULTIPLE_FACES', severity: 'HIGH',   message: 'Multiple faces detected in frame',    timestamp: '2026-03-09T14:31:08' },
      { type: 'TAB_SWITCH',     severity: 'MEDIUM', message: 'Tab switch detected (2x)',             timestamp: '2026-03-09T14:18:44' },
      { type: 'LOOKING_AWAY',   severity: 'MEDIUM', message: 'Student appears to be looking away',  timestamp: '2026-03-09T14:26:11' },
      { type: 'NO_FACE',        severity: 'HIGH',   message: 'No face detected for 12 seconds',     timestamp: '2026-03-09T14:42:30' },
    ],
  },
  {
    id:         2,
    name:       'Kevin Park',
    studentId:  'STU-2024-0218',
    examCode:   'CS301',
    trustScore: 61,
    violations: 3,
    status:     'warning',
    violationLog: [
      { type: 'TAB_SWITCH',     severity: 'MEDIUM', message: 'Tab switch detected (3x)',            timestamp: '2026-03-09T14:29:52' },
      { type: 'FULLSCREEN_EXIT',severity: 'MEDIUM', message: 'Exited fullscreen mode',              timestamp: '2026-03-09T14:35:10' },
    ],
  },
  {
    id:         3,
    name:       'Meera Pillai',
    studentId:  'STU-2024-0102',
    examCode:   'CS301',
    trustScore: 94,
    violations: 0,
    status:     'clean',
    violationLog: [],
  },
  {
    id:         4,
    name:       'Akhil Das',
    studentId:  'STU-2024-0089',
    examCode:   'CS301',
    trustScore: 88,
    violations: 1,
    status:     'clean',
    violationLog: [
      { type: 'LOOKING_AWAY', severity: 'MEDIUM', message: 'Student appears to be looking away', timestamp: '2026-03-09T14:20:05' },
    ],
  },
  {
    id:         5,
    name:       'Priya Nair',
    studentId:  'STU-2024-0277',
    examCode:   'CS301',
    trustScore: 55,
    violations: 4,
    status:     'warning',
    violationLog: [
      { type: 'LOOKING_AWAY',   severity: 'MEDIUM', message: 'Looking away detected',              timestamp: '2026-03-09T14:28:15' },
      { type: 'TAB_SWITCH',     severity: 'MEDIUM', message: 'Tab switch detected',                timestamp: '2026-03-09T14:33:40' },
      { type: 'COPY_PASTE',     severity: 'LOW',    message: 'Copy/paste attempt blocked',         timestamp: '2026-03-09T14:44:22' },
    ],
  },
  {
    id:         6,
    name:       'Amal Jose',
    studentId:  'STU-2024-0334',
    examCode:   'CS301',
    trustScore: 79,
    violations: 1,
    status:     'clean',
    violationLog: [
      { type: 'COPY_PASTE', severity: 'LOW', message: 'Paste attempt blocked', timestamp: '2026-03-09T14:25:11' },
    ],
  },
  {
    id:         7,
    name:       'Tom Walsh',
    studentId:  'STU-2024-0156',
    examCode:   'CS301',
    trustScore: 72,
    violations: 2,
    status:     'clean',
    violationLog: [
      { type: 'FULLSCREEN_EXIT', severity: 'MEDIUM', message: 'Exited fullscreen', timestamp: '2026-03-09T14:26:40' },
      { type: 'RIGHT_CLICK',     severity: 'LOW',    message: 'Right-click blocked', timestamp: '2026-03-09T14:38:55' },
    ],
  },
  {
    id:         8,
    name:       'Sara Kim',
    studentId:  'STU-2024-0201',
    examCode:   'CS301',
    trustScore: 91,
    violations: 0,
    status:     'clean',
    violationLog: [],
  },
]

const TICKER_ALERTS = [
  '14:31:08 · Riya Sharma — Multiple faces detected',
  '14:30:52 · Kevin Park — Tab switched',
  '14:29:15 · Priya Nair — Looking away',
  '14:28:40 · Tom Walsh — Exited fullscreen',
  '14:27:11 · Amal Jose — Paste attempt blocked',
]

export default function MonitorPage() {
  const { examId } = useParams()
  const navigate   = useNavigate()

  const [students, setStudents]         = useState(MOCK_STUDENTS)
  const [selectedStudent, setSelected]  = useState(null)
  const [tickerIndex, setTickerIndex]   = useState(0)

  // Summary counts
  const flagged  = students.filter(s => s.trustScore < 40).length
  const warnings = students.filter(s => s.trustScore >= 40 && s.trustScore < 75).length
  const clean    = students.filter(s => s.trustScore >= 75).length

  function handleTerminate(student) {
    setStudents(prev =>
      prev.filter(s => s.id !== student.id)
    )
  }

  return (
    <div className="flex min-h-screen bg-[#040d1a]">

      <Sidebar />

      <main className="flex-1 p-6 overflow-y-auto">

        {/* Page header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <button
                onClick={() => navigate('/exams')}
                className="text-[#8899b0] hover:text-[#e8f0f8]
                           transition-colors cursor-pointer
                           bg-transparent border-none p-0"
              >
                <ArrowLeft size={16} strokeWidth={1.75} />
              </button>
              <h1 className="font-['Syne'] text-2xl font-bold
                             text-[#e8f0f8]">
                Live Monitor
              </h1>
              {/* Live badge */}
              <span className="flex items-center gap-1.5
                               font-['JetBrains_Mono'] text-[10px]
                               text-[#00e5ff] px-2 py-0.5 rounded
                               bg-[rgba(0,229,255,0.08)]
                               border border-[rgba(0,229,255,0.20)]">
                <Radio size={9} strokeWidth={2.5} className="animate-live-pulse" />
                LIVE
              </span>
            </div>
            <p className="text-sm text-[#8899b0]">
              Data Structures Midterm · CS301 ·
              {students.length} students active
            </p>
          </div>

          {/* End exam button */}
          <button
            className="flex items-center gap-2 px-4 py-2.5
                       rounded-lg text-sm cursor-pointer
                       font-['Syne'] font-semibold
                       bg-[rgba(255,59,92,0.10)]
                       text-[#ff3b5c]
                       border border-[rgba(255,59,92,0.30)]
                       hover:bg-[rgba(255,59,92,0.18)]
                       transition-colors duration-150"
          >
            <StopCircle size={14} strokeWidth={2} />
            End Exam
          </button>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-3 mb-5">

          <div className="flex items-center gap-3 px-4 py-3
                          rounded-xl bg-[#0c1829]
                          border border-[rgba(0,229,255,0.08)]">
            <Users size={16} strokeWidth={1.75}
                   className="text-[#00e5ff]" />
            <div>
              <p className="font-['Syne'] text-xl font-bold
                            text-[#e8f0f8]">
                {students.length}
              </p>
              <p className="font-['JetBrains_Mono'] text-[10px]
                            text-[#8899b0]">
                Active
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 px-4 py-3
                          rounded-xl bg-[#0c1829]
                          border border-[rgba(255,176,32,0.15)]">
            <AlertTriangle size={16} strokeWidth={1.75}
                           className="text-[#ffb020]" />
            <div>
              <p className="font-['Syne'] text-xl font-bold
                            text-[#ffb020]">
                {warnings}
              </p>
              <p className="font-['JetBrains_Mono'] text-[10px]
                            text-[#8899b0]">
                Warnings
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 px-4 py-3
                          rounded-xl bg-[#0c1829]
                          border border-[rgba(255,59,92,0.20)]">
            <ShieldX size={16} strokeWidth={1.75}
                     className="text-[#ff3b5c]" />
            <div>
              <p className="font-['Syne'] text-xl font-bold
                            text-[#ff3b5c]">
                {flagged}
              </p>
              <p className="font-['JetBrains_Mono'] text-[10px]
                            text-[#8899b0]">
                Flagged
              </p>
            </div>
          </div>

        </div>

        {/* Alert ticker */}
        <div className="flex items-center gap-3 mb-6 px-4 py-3
                        rounded-xl bg-[#0c1829]
                        border border-[rgba(0,229,255,0.08)]
                        overflow-hidden">

          <span className="font-['JetBrains_Mono'] text-[10px]
                           text-[#ff3b5c] px-2 py-0.5 rounded
                           bg-[rgba(255,59,92,0.10)]
                           flex-shrink-0">
            LIVE ALERTS
          </span>

          <div className="overflow-hidden flex-1">
            <p className="font-['JetBrains_Mono'] text-[11px]
                          text-[#8899b0] truncate">
              {TICKER_ALERTS.join('   ·   ')}
            </p>
          </div>

        </div>

        {/* Students grid */}
        <div className="grid grid-cols-2 md:grid-cols-3
                        lg:grid-cols-4 gap-3">
          {students.map(student => (
            <StudentCard
              key={student.id}
              student={student}
              onViewDetail={setSelected}
              onTerminate={handleTerminate}
            />
          ))}
        </div>

      </main>

      {/* Student detail modal */}
      {selectedStudent && (
        <StudentDetailModal
          student={selectedStudent}
          onClose={() => setSelected(null)}
        />
      )}

    </div>
  )
}