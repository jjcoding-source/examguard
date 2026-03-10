import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { examAPI } from '../services/api'
import {
  ArrowLeft,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
} from 'lucide-react'

const LETTERS = ['A', 'B', 'C', 'D']

export default function QuestionsPage() {
  const { examId }  = useParams()
  const navigate    = useNavigate()

  const [exam, setExam]           = useState(null)
  const [questions, setQuestions] = useState([])
  const [loading, setLoading]     = useState(true)
  const [showForm, setShowForm]   = useState(false)
  const [saving, setSaving]       = useState(false)
  const [error, setError]         = useState('')

  const [form, setForm] = useState({
    text:         '',
    options:      ['', '', '', ''],
    correctIndex: 0,
  })

  useEffect(() => {
    fetchData()
  }, [examId])

  async function fetchData() {
    try {
      const res = await examAPI.getById(examId)
      setExam(res.data)
      const qRes = await examAPI.getQuestions(examId)
      setQuestions(qRes.data)
    } catch {
      console.error('Failed to fetch questions')
    } finally {
      setLoading(false)
    }
  }

  function handleOptionChange(index, value) {
    const updated = [...form.options]
    updated[index] = value
    setForm(prev => ({ ...prev, options: updated }))
  }

  async function handleAddQuestion(e) {
    e.preventDefault()
    setError('')

    if (!form.text.trim())
      return setError('Question text is required.')
    if (form.options.some(o => !o.trim()))
      return setError('All 4 options are required.')

    setSaving(true)
    try {
      await examAPI.addQuestion(examId, {
        text:         form.text,
        options:      form.options,
        correctIndex: form.correctIndex,
      })
      setForm({ text: '', options: ['', '', '', ''], correctIndex: 0 })
      setShowForm(false)
      fetchData()
    } catch {
      setError('Failed to add question.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(questionId) {
    try {
      await examAPI.deleteQuestion(examId, questionId)
      setQuestions(prev => prev.filter(q => q.id !== questionId))
    } catch {
      console.error('Failed to delete question')
    }
  }

  return (
    <div className="flex min-h-screen bg-[#040d1a]">

      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => navigate('/exams')}
            className="text-[#8899b0] hover:text-[#e8f0f8]
                       transition-colors cursor-pointer
                       bg-transparent border-none p-0"
          >
            <ArrowLeft size={16} strokeWidth={1.75} />
          </button>
          <div>
            <h1 className="font-['Syne'] text-2xl font-bold
                           text-[#e8f0f8] mb-0.5">
              Manage Questions
            </h1>
            <p className="text-sm text-[#8899b0]">
              {exam?.title} · {exam?.code} · {questions.length} questions
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="ml-auto flex items-center gap-2
                       px-4 py-2.5 rounded-lg text-sm
                       font-semibold font-['Syne']
                       bg-[#00e5ff] text-[#040d1a]
                       border-none cursor-pointer
                       hover:opacity-90 transition-opacity"
          >
            <Plus size={15} strokeWidth={2.5} />
            Add Question
          </button>
        </div>

        {/* Add question form */}
        {showForm && (
          <div className="bg-[#0c1829] rounded-2xl p-6 mb-6
                          border border-[rgba(0,229,255,0.12)]">

            <h2 className="font-['Syne'] text-sm font-semibold
                           text-[#e8f0f8] mb-5">
              New Question
            </h2>

            <form onSubmit={handleAddQuestion}
                  className="flex flex-col gap-4">

              {/* Question text */}
              <div className="flex flex-col gap-1.5">
                <label className="font-['JetBrains_Mono'] text-[10px]
                                  text-[#8899b0] tracking-[0.5px]">
                  QUESTION TEXT
                </label>
                <textarea
                  rows={3}
                  placeholder="Enter your question here..."
                  value={form.text}
                  onChange={e =>
                    setForm(prev => ({ ...prev, text: e.target.value }))
                  }
                  className="w-full px-3 py-2.5 rounded-lg text-sm
                             bg-[#070f20] text-[#e8f0f8]
                             border border-[rgba(0,229,255,0.08)]
                             outline-none placeholder-[#8899b0]
                             focus:border-[#00b8cc]
                             transition-colors duration-200
                             resize-none"
                />
              </div>

              {/* Options */}
              <div className="flex flex-col gap-2">
                <label className="font-['JetBrains_Mono'] text-[10px]
                                  text-[#8899b0] tracking-[0.5px]">
                  OPTIONS — click the circle to mark correct answer
                </label>
                {form.options.map((option, i) => (
                  <div key={i}
                       className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setForm(prev => ({ ...prev, correctIndex: i }))
                      }
                      className="flex-shrink-0 bg-transparent
                                 border-none cursor-pointer p-0"
                    >
                      {form.correctIndex === i ? (
                        <CheckCircle2
                          size={18}
                          strokeWidth={2}
                          className="text-[#00e676]"
                        />
                      ) : (
                        <Circle
                          size={18}
                          strokeWidth={1.75}
                          className="text-[#8899b0]"
                        />
                      )}
                    </button>

                    <span className="font-['JetBrains_Mono'] text-xs
                                     text-[#8899b0] w-5 flex-shrink-0">
                      {LETTERS[i]}
                    </span>

                    <input
                      type="text"
                      placeholder={`Option ${LETTERS[i]}`}
                      value={option}
                      onChange={e => handleOptionChange(i, e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg text-sm
                                 bg-[#070f20] text-[#e8f0f8]
                                 border border-[rgba(0,229,255,0.08)]
                                 outline-none placeholder-[#8899b0]
                                 focus:border-[#00b8cc]
                                 transition-colors duration-200"
                    />
                  </div>
                ))}
              </div>

              {/* Error */}
              {error && (
                <p className="text-sm text-[#ff3b5c]">{error}</p>
              )}

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setError('')
                    setForm({
                      text: '', options: ['', '', '', ''], correctIndex: 0
                    })
                  }}
                  className="flex-1 py-2.5 rounded-lg text-sm
                             bg-transparent text-[#8899b0]
                             border border-[rgba(0,229,255,0.08)]
                             cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className={`
                    flex-1 py-2.5 rounded-lg text-sm
                    font-semibold font-['Syne']
                    bg-[#00e5ff] text-[#040d1a]
                    border-none cursor-pointer
                    transition-opacity duration-150
                    ${saving ? 'opacity-60' : 'opacity-100'}
                  `}
                >
                  {saving ? 'Saving...' : 'Save Question'}
                </button>
              </div>

            </form>
          </div>
        )}

        {/* Questions list */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <p className="text-sm text-[#8899b0]">Loading questions...</p>
          </div>
        ) : questions.length === 0 ? (
          <div className="flex flex-col items-center
                          justify-center py-24 text-center">
            <p className="font-['Syne'] text-lg font-semibold
                          text-[#8899b0] mb-2">
              No questions yet
            </p>
            <p className="text-sm text-[#8899b0]">
              Click "Add Question" to get started
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {questions.map((q, index) => (
              <div
                key={q.id}
                className="bg-[#0c1829] rounded-xl p-5
                           border border-[rgba(0,229,255,0.08)]"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3 flex-1">
                    <span className="font-['JetBrains_Mono'] text-[11px]
                                     text-[#00e5ff] mt-0.5 flex-shrink-0">
                      Q{index + 1}
                    </span>
                    <p className="text-sm text-[#e8f0f8] leading-relaxed">
                      {q.text}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(q.id)}
                    className="text-[#8899b0] hover:text-[#ff3b5c]
                               transition-colors cursor-pointer
                               bg-transparent border-none p-1
                               ml-3 flex-shrink-0"
                  >
                    <Trash2 size={14} strokeWidth={1.75} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {q.options.map((option, i) => (
                    <div
                      key={i}
                      className={`
                        flex items-center gap-2.5 px-3 py-2
                        rounded-lg text-sm border
                        ${q.correctIndex === i
                          ? 'bg-[rgba(0,230,118,0.08)] border-[rgba(0,230,118,0.25)] text-[#00e676]'
                          : 'bg-[#070f20] border-[rgba(0,229,255,0.06)] text-[#8899b0]'
                        }
                      `}
                    >
                      <span className="font-['JetBrains_Mono'] text-[11px]
                                       flex-shrink-0">
                        {LETTERS[i]}
                      </span>
                      {option}
                      {q.correctIndex === i && (
                        <CheckCircle2
                          size={12}
                          strokeWidth={2}
                          className="ml-auto flex-shrink-0"
                        />
                      )}
                    </div>
                  ))}
                </div>

              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  )
}