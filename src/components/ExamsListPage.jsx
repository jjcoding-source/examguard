import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Sidebar from '../components/Sidebar'
import ExamCard from '../components/ExamCard'
import CreateExamModal from '../components/CreateExamModal'
import { Plus } from 'lucide-react'

const FILTERS = ['All', 'Live', 'Upcoming', 'Ended']

const MOCK_EXAMS = [
  {
    id: 1,
    name: 'Data Structures Midterm',
    code: 'CS301',
    instructor: 'Prof. Alex Johnson',
    students: '48 / 52',
    duration: 2,
    date: 'Today',
    status: 'live',
    avgTrust: 78,
  },
  {
    id: 2,
    name: 'Algorithm Analysis',
    code: 'CS402',
    instructor: 'Prof. Alex Johnson',
    students: '31 / 35',
    duration: 1.5,
    date: 'Today',
    status: 'live',
    avgTrust: 65,
  },
  {
    id: 3,
    name: 'Database Systems',
    code: 'CS505',
    instructor: 'Prof. Alex Johnson',
    students: '22 enrolled',
    duration: 2.5,
    date: '16:00 today',
    status: 'upcoming',
  },
  {
    id: 4,
    name: 'Operating Systems Final',
    code: 'CS601',
    instructor: 'Prof. Alex Johnson',
    students: '55 appeared',
    duration: 3,
    date: '08 Mar 2026',
    status: 'ended',
  },
  {
    id: 5,
    name: 'Computer Networks',
    code: 'CS504',
    instructor: 'Prof. Alex Johnson',
    students: '38 enrolled',
    duration: 2,
    date: '12 Mar 2026',
    status: 'upcoming',
  },
  {
    id: 6,
    name: 'Software Engineering',
    code: 'CS503',
    instructor: 'Prof. Alex Johnson',
    students: '41 appeared',
    duration: 2,
    date: '05 Mar 2026',
    status: 'ended',
  },
]

export default function ExamsListPage() {
  const { user } = useAuth()
  const isInstructor = user?.role === 'Instructor'

  const [activeFilter, setActiveFilter] = useState('All')
  const [showModal, setShowModal]       = useState(false)

  const filtered = MOCK_EXAMS.filter(exam => {
    if (activeFilter === 'All')      return true
    if (activeFilter === 'Live')     return exam.status === 'live'
    if (activeFilter === 'Upcoming') return exam.status === 'upcoming'
    if (activeFilter === 'Ended')    return exam.status === 'ended'
    return true
  })

  return (
    <div className="flex min-h-screen bg-[#040d1a]">

      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">

        {/* Page header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="font-['Syne'] text-2xl font-bold
                           text-[#e8f0f8] mb-1">
              Exams
            </h1>
            <p className="text-sm text-[#8899b0]">
              Manage and monitor all examination sessions
            </p>
          </div>

          {isInstructor && (
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2.5
                         rounded-lg text-sm font-semibold
                         font-['Syne'] bg-[#00e5ff] text-[#040d1a]
                         border-none cursor-pointer
                         hover:opacity-90 transition-opacity"
            >
              <Plus size={15} strokeWidth={2.5} />
              Create Exam
            </button>
          )}
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {FILTERS.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`
                px-4 py-1.5 rounded-full text-xs cursor-pointer
                font-['JetBrains_Mono'] transition-all duration-150
                border
                ${activeFilter === filter
                  ? 'bg-[rgba(0,229,255,0.12)] text-[#00e5ff] border-[rgba(0,229,255,0.25)]'
                  : 'bg-transparent text-[#8899b0] border-[rgba(0,229,255,0.08)] hover:text-[#e8f0f8]'
                }
              `}
            >
              {filter}
            </button>
          ))}

          <span className="ml-auto font-['JetBrains_Mono'] text-[11px]
                           text-[#8899b0] self-center">
            {filtered.length} exams
          </span>
        </div>

        {/* Exams grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2
                          xl:grid-cols-3 gap-4">
            {filtered.map(exam => (
              <ExamCard key={exam.id} exam={exam} />
            ))}
          </div>
        ) : (
   
          <div className="flex flex-col items-center justify-center
                          py-24 text-center">
            <p className="font-['Syne'] text-lg font-semibold
                          text-[#8899b0] mb-2">
              No exams found
            </p>
            <p className="text-sm text-[#8899b0]">
              Try a different filter or create a new exam
            </p>
          </div>
        )}

      </main>

      {showModal && (
        <CreateExamModal
          onClose={() => setShowModal(false)}
          onCreated={() => {
            setShowModal(false)
          }}
        />
      )}

    </div>
  )
}