import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useProctor from '../hooks/useProctor'
import TrustScoreMeter from '../components/TrustScoreMeter'
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Camera,
  Clock,
  CheckCircle2,
  XCircle,
} from 'lucide-react'

const MOCK_EXAM = {
  id:       1,
  title:    'Data Structures Midterm',
  code:     'CS301',
  duration: 120, 
  questions: [
    {
      id:      1,
      text:    'Which of the following best describes the time complexity of searching in a balanced Binary Search Tree with n nodes?',
      options: [
        'O(n) — Linear time in worst case',
        'O(n²) — Quadratic due to recursive calls',
        'O(log n) — Logarithmic due to halving at each step',
        'O(1) — Constant time with hashing',
      ],
      correct: 2,
    },
    {
      id:      2,
      text:    'Which data structure uses LIFO (Last In First Out) ordering?',
      options: ['Queue', 'Stack', 'Linked List', 'Heap'],
      correct: 1,
    },
    {
      id:      3,
      text:    'What is the worst-case time complexity of QuickSort?',
      options: ['O(n log n)', 'O(n)', 'O(n²)', 'O(log n)'],
      correct: 2,
    },
  ],
}

function formatTime(secs) {
  const m = Math.floor(secs / 60).toString().padStart(2, '0')
  const s = (secs % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

const LETTERS = ['A', 'B', 'C', 'D']

export default function TakeExamPage() {
  const { examId }  = useParams()
  const navigate    = useNavigate()

  const [currentQ, setCurrentQ]   = useState(0)
  const [answers, setAnswers]     = useState({})
  const [timeLeft, setTimeLeft]   = useState(MOCK_EXAM.duration * 60)
  const [submitted, setSubmitted] = useState(false)
  const [sessionId]               = useState('mock-session-001')

  const videoRef  = useRef(null)
  const canvasRef = useRef(null)

  const {
    trustScore,
    violations,
    lastAlert,
    enterFullscreen,
  } = useProctor({
    sessionId,
    videoRef,
    canvasRef,
    enabled: !submitted,
  })

  useEffect(() => {
    enterFullscreen()
  }, [enterFullscreen])

  useEffect(() => {
    if (submitted) return

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [submitted])

  function selectAnswer(qId, optionIndex) {
    setAnswers(prev => ({ ...prev, [qId]: optionIndex }))
  }

  const handleSubmit = useCallback(async () => {
    if (submitted) return
    setSubmitted(true)
    navigate('/dashboard')
  }, [submitted, navigate])

  const question     = MOCK_EXAM.questions[currentQ]
  const totalQ       = MOCK_EXAM.questions.length
  const answeredCount = Object.keys(answers).length
  const isLowTime    = timeLeft < 300 

  return (
    <div className="flex min-h-screen bg-[#040d1a]">

      <div className="flex-1 flex flex-col p-6
                      border-r border-[rgba(0,229,255,0.08)]">

        
        <div className="flex items-center justify-between
                        mb-6 pb-5
                        border-b border-[rgba(0,229,255,0.08)]">
          <div>
            <h1 className="font-['Syne'] text-lg font-bold
                           text-[#e8f0f8] mb-0.5">
              {MOCK_EXAM.title}
            </h1>
            <p className="font-['JetBrains_Mono'] text-[11px]
                          text-[#8899b0]">
              {MOCK_EXAM.code} · Question {currentQ + 1} of {totalQ}
              · Proctoring Active
            </p>
          </div>

          
          <div
            className={`
              font-['JetBrains_Mono'] text-2xl font-medium
              px-5 py-2 rounded-lg border
              ${isLowTime
                ? 'text-[#ff3b5c] bg-[rgba(255,59,92,0.10)] border-[rgba(255,59,92,0.30)]'
                : 'text-[#00e5ff] bg-[rgba(0,229,255,0.08)] border-[rgba(0,229,255,0.20)]'
              }
            `}
          >
            <div className="flex items-center gap-2">
              <Clock size={16} strokeWidth={1.75} />
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>

        
        <div className="h-[3px] bg-[#0f2040] rounded-full mb-7">
          <div
            className="h-full bg-[#00e5ff] rounded-full
                       transition-all duration-500"
            style={{ width: `${((currentQ + 1) / totalQ) * 100}%` }}
          />
        </div>

        {lastAlert && (
          <div className="flex items-start gap-3 px-4 py-3
                          rounded-lg mb-5
                          bg-[rgba(255,59,92,0.10)]
                          border border-[rgba(255,59,92,0.30)]
                          text-[#ff3b5c] animate-page-enter">
            <AlertTriangle
              size={16}
              strokeWidth={2}
              className="flex-shrink-0 mt-0.5"
            />
            <div>
              <p className="text-sm font-semibold font-['Syne']">
                Warning
              </p>
              <p className="text-xs mt-0.5 text-[#ff3b5c]/80">
                {lastAlert.message} — This has been logged and
                reported to your instructor.
              </p>
            </div>
          </div>
        )}

        <div className="bg-[#0c1829] rounded-xl p-7
                        border border-[rgba(0,229,255,0.08)] mb-5">

          <p className="font-['JetBrains_Mono'] text-[11px]
                        text-[#00e5ff] mb-4 tracking-wide">
            QUESTION {String(currentQ + 1).padStart(2, '0')} / {String(totalQ).padStart(2, '0')}
          </p>

          <p className="text-[#e8f0f8] text-base leading-relaxed
                        font-medium mb-7">
            {question.text}
          </p>

          <div className="flex flex-col gap-3">
            {question.options.map((option, i) => {
              const isSelected = answers[question.id] === i

              return (
                <button
                  key={i}
                  onClick={() => selectAnswer(question.id, i)}
                  className={`
                    flex items-center gap-4 px-5 py-4
                    rounded-lg text-left text-sm w-full
                    border transition-all duration-150 cursor-pointer
                    ${isSelected
                      ? 'bg-[rgba(0,229,255,0.08)] border-[rgba(0,229,255,0.40)] text-[#e8f0f8]'
                      : 'bg-[#070f20] border-[rgba(0,229,255,0.08)] text-[#b0c2d8] hover:border-[rgba(0,229,255,0.20)]'
                    }
                  `}
                >
                 
                  <span
                    className={`
                      w-7 h-7 rounded-full flex-shrink-0 flex
                      items-center justify-center
                      font-['JetBrains_Mono'] text-xs border
                      transition-all duration-150
                      ${isSelected
                        ? 'bg-[#00e5ff] text-[#040d1a] border-[#00e5ff]'
                        : 'bg-transparent text-[#8899b0] border-[rgba(0,229,255,0.20)]'
                      }
                    `}
                  >
                    {LETTERS[i]}
                  </span>
                  {option}
                </button>
              )
            })}
          </div>

        </div>

        <div className="flex items-center justify-between mt-auto">

          <button
            onClick={() => setCurrentQ(prev => Math.max(0, prev - 1))}
            disabled={currentQ === 0}
            className={`
              flex items-center gap-2 px-5 py-2.5
              rounded-lg text-sm border cursor-pointer
              transition-all duration-150
              ${currentQ === 0
                ? 'opacity-30 cursor-not-allowed text-[#8899b0] border-[rgba(0,229,255,0.08)]'
                : 'text-[#b0c2d8] border-[rgba(0,229,255,0.08)] hover:text-[#e8f0f8]'
              }
              bg-transparent
            `}
          >
            <ChevronLeft size={16} strokeWidth={1.75} />
            Previous
          </button>

          <div className="flex gap-1.5">
            {MOCK_EXAM.questions.map((q, i) => (
              <button
                key={i}
                onClick={() => setCurrentQ(i)}
                className={`
                  w-2 h-2 rounded-full transition-all
                  duration-150 cursor-pointer border-none
                  ${i === currentQ
                    ? 'bg-[#00e5ff]'
                    : answers[q.id] !== undefined
                      ? 'bg-[rgba(0,229,255,0.40)]'
                      : 'bg-[#0f2040]'
                  }
                `}
              />
            ))}
          </div>

          {currentQ < totalQ - 1 ? (
            <button
              onClick={() => setCurrentQ(prev => Math.min(totalQ - 1, prev + 1))}
              className="flex items-center gap-2 px-5 py-2.5
                         rounded-lg text-sm font-semibold
                         font-['Syne'] bg-[#00e5ff] text-[#040d1a]
                         border-none cursor-pointer
                         hover:opacity-90 transition-opacity"
            >
              Next
              <ChevronRight size={16} strokeWidth={2} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 px-5 py-2.5
                         rounded-lg text-sm font-semibold
                         font-['Syne'] bg-[#00e676] text-[#040d1a]
                         border-none cursor-pointer
                         hover:opacity-90 transition-opacity"
            >
              <CheckCircle2 size={16} strokeWidth={2} />
              Submit Exam
            </button>
          )}

        </div>
      </div>

      <div className="w-[300px] flex flex-col gap-5 p-5
                      bg-[#070f20]">

        {/* Webcam feed */}
        <div>
          <p className="font-['JetBrains_Mono'] text-[10px]
                        text-[#8899b0] mb-2 tracking-[0.5px]">
            WEBCAM FEED
          </p>

          <div className="relative w-full aspect-[4/3]
                          bg-black rounded-xl overflow-hidden
                          border border-[rgba(0,229,255,0.08)]">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />

            {/* Hidden canvas for frame capture */}
            <canvas
              ref={canvasRef}
              className="hidden"
            />

            {/* REC badge */}
            <div className="absolute bottom-2 left-2
                            flex items-center gap-1.5
                            px-2 py-1 rounded
                            bg-black/60
                            font-['JetBrains_Mono'] text-[10px]
                            text-[#00e5ff]">
              <span className="w-1.5 h-1.5 rounded-full
                               bg-[#ff3b5c] animate-live-pulse" />
              REC
            </div>

            <div className="absolute inset-0 flex items-center
                            justify-center pointer-events-none">
              <Camera
                size={32}
                strokeWidth={1}
                className="text-[#8899b0] opacity-20"
              />
            </div>

          </div>
        </div>

        {/* Trust score meter */}
        <TrustScoreMeter score={trustScore} />

        {/* Violation log */}
        <div className="flex-1 flex flex-col
                        bg-[#0c1829] rounded-xl p-4
                        border border-[rgba(0,229,255,0.08)]">

          <p className="font-['Syne'] text-xs font-semibold
                        text-[#8899b0] mb-3 tracking-wide">
            VIOLATION LOG
          </p>

          {violations.length === 0 ? (
            <div className="flex flex-col items-center
                            justify-center flex-1 gap-2">
              <CheckCircle2
                size={20}
                strokeWidth={1.5}
                className="text-[#00e676] opacity-50"
              />
              <p className="font-['JetBrains_Mono'] text-[10px]
                            text-[#8899b0] text-center">
                No violations recorded
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-0
                            divide-y divide-[rgba(0,229,255,0.06)]">
              {violations.slice(0, 6).map((v, i) => (
                <div key={i}
                     className="flex items-start gap-2 py-2.5">
                  <span
                    className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                    style={{
                      background: v.severity === 'HIGH'
                        ? '#ff3b5c'
                        : '#ffb020'
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-[#b0c2d8]
                                  leading-snug">
                      {v.message}
                    </p>
                    <p className="font-['JetBrains_Mono'] text-[10px]
                                  text-[#8899b0] mt-0.5">
                      {new Date(v.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Proctoring status indicators */}
        <div className="bg-[#0c1829] rounded-xl p-4
                        border border-[rgba(0,229,255,0.08)]">

          <p className="font-['JetBrains_Mono'] text-[10px]
                        text-[#8899b0] mb-3 tracking-[0.5px]">
            MONITORING STATUS
          </p>

          <div className="flex flex-col gap-2.5">
            {[
              { label: 'Face Detection',  status: 'ACTIVE',   color: '#00e676' },
              { label: 'Tab Monitor',     status: 'ACTIVE',   color: '#00e676' },
              { label: 'Fullscreen',      status: 'ENFORCED', color: '#00e676' },
              { label: 'Copy / Paste',    status: 'BLOCKED',  color: '#ff3b5c' },
            ].map(item => (
              <div key={item.label}
                   className="flex items-center justify-between">
                <span className="text-[12px] text-[#b0c2d8]">
                  {item.label}
                </span>
                <span
                  className="font-['JetBrains_Mono'] text-[10px]
                             flex items-center gap-1"
                  style={{ color: item.color }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: item.color }}
                  />
                  {item.status}
                </span>
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  )
}