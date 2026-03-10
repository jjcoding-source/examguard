import { useState } from 'react'
import { X } from 'lucide-react'
import { examAPI } from '../services/api'

export default function CreateExamModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    name:      '',
    code:      '',
    duration:  '',
    date:      '',
    startTime: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (!form.name.trim())      return setError('Exam name is required.')
    if (!form.code.trim())      return setError('Course code is required.')
    if (!form.duration)         return setError('Duration is required.')
    if (!form.date)             return setError('Date is required.')
    if (!form.startTime)        return setError('Start time is required.')

    setLoading(true)
    try {
      const startTime = new Date(`${form.date}T${form.startTime}`)
      const endTime   = new Date(
        startTime.getTime() + Number(form.duration) * 60 * 1000
      )

      await examAPI.create({
        title:           form.name,
        code:            form.code,
        durationMinutes: Number(form.duration),
        startTime:       startTime.toISOString(),
        endTime:         endTime.toISOString(),
      })

      onCreated()
      onClose()
    } catch {
      setError('Failed to create exam. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center
                 justify-center px-4
                 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#0c1829] rounded-2xl
                   border border-[rgba(0,229,255,0.08)] p-6
                   animate-page-enter"
        onClick={e => e.stopPropagation()}
      >

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-['Syne'] text-lg font-bold
                         text-[#e8f0f8]">
            Create New Exam
          </h2>
          <button
            onClick={onClose}
            className="text-[#8899b0] hover:text-[#e8f0f8]
                       transition-colors cursor-pointer
                       bg-transparent border-none p-1"
          >
            <X size={18} strokeWidth={1.75} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Exam name */}
          <div className="flex flex-col gap-1.5">
            <label className="font-['JetBrains_Mono'] text-[10px]
                              text-[#8899b0] tracking-[0.5px]">
              EXAM NAME
            </label>
            <input
              name="name"
              type="text"
              placeholder="e.g. Data Structures Midterm"
              value={form.name}
              onChange={handleChange}
              className="w-full px-3 py-2.5 rounded-lg text-sm
                         bg-[#070f20] text-[#e8f0f8]
                         border border-[rgba(0,229,255,0.08)]
                         outline-none placeholder-[#8899b0]
                         focus:border-[#00b8cc]
                         transition-colors duration-200"
            />
          </div>

          {/* Course code */}
          <div className="flex flex-col gap-1.5">
            <label className="font-['JetBrains_Mono'] text-[10px]
                              text-[#8899b0] tracking-[0.5px]">
              COURSE CODE
            </label>
            <input
              name="code"
              type="text"
              placeholder="e.g. CS301"
              value={form.code}
              onChange={handleChange}
              className="w-full px-3 py-2.5 rounded-lg text-sm
                         bg-[#070f20] text-[#e8f0f8]
                         border border-[rgba(0,229,255,0.08)]
                         outline-none placeholder-[#8899b0]
                         focus:border-[#00b8cc]
                         transition-colors duration-200"
            />
          </div>

          {/* Duration */}
          <div className="flex flex-col gap-1.5">
            <label className="font-['JetBrains_Mono'] text-[10px]
                              text-[#8899b0] tracking-[0.5px]">
              DURATION (MINS)
            </label>
            <input
              name="duration"
              type="number"
              placeholder="120"
              min="1"
              value={form.duration}
              onChange={handleChange}
              className="w-full px-3 py-2.5 rounded-lg text-sm
                         bg-[#070f20] text-[#e8f0f8]
                         border border-[rgba(0,229,255,0.08)]
                         outline-none placeholder-[#8899b0]
                         focus:border-[#00b8cc]
                         transition-colors duration-200"
            />
          </div>

          {/* Date + Time row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="font-['JetBrains_Mono'] text-[10px]
                                text-[#8899b0] tracking-[0.5px]">
                EXAM DATE
              </label>
              <input
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                className="w-full px-3 py-2.5 rounded-lg text-sm
                           bg-[#070f20] text-[#e8f0f8]
                           border border-[rgba(0,229,255,0.08)]
                           outline-none
                           focus:border-[#00b8cc]
                           transition-colors duration-200"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-['JetBrains_Mono'] text-[10px]
                                text-[#8899b0] tracking-[0.5px]">
                START TIME
              </label>
              <input
                name="startTime"
                type="time"
                value={form.startTime}
                onChange={handleChange}
                className="w-full px-3 py-2.5 rounded-lg text-sm
                           bg-[#070f20] text-[#e8f0f8]
                           border border-[rgba(0,229,255,0.08)]
                           outline-none
                           focus:border-[#00b8cc]
                           transition-colors duration-200"
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 px-3 py-2.5
                            rounded-lg text-sm
                            bg-[rgba(255,59,92,0.10)]
                            border border-[rgba(255,59,92,0.3)]
                            text-[#ff3b5c]">
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg text-sm
                         bg-transparent text-[#8899b0]
                         border border-[rgba(0,229,255,0.08)]
                         cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`
                flex-1 py-2.5 rounded-lg text-sm
                font-semibold font-['Syne']
                bg-[#00e5ff] text-[#040d1a]
                border-none cursor-pointer
                transition-opacity duration-150
                ${loading ? 'opacity-60' : 'opacity-100'}
              `}
            >
              {loading ? 'Creating...' : 'Create Exam'}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}