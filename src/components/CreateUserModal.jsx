import { useState } from 'react'
import { X } from 'lucide-react'
import { adminAPI } from '../services/api'

const ROLES = ['Student', 'Instructor', 'Admin']

export default function CreateUserModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    name:     '',
    email:    '',
    role:     'Student',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  async function handleSubmit(e) {
  e.preventDefault()

  if (!form.name.trim())     return setError('Name is required.')
  if (!form.email.trim())    return setError('Email is required.')
  if (!form.password.trim()) return setError('Password is required.')

  setLoading(true)
  try {
    await adminAPI.createUser({
      name:     form.name,
      email:    form.email,
      password: form.password,
      role:     form.role,
    })
    onCreated()
    onClose()
  } catch {
    setError('Failed to create user. Please try again.')
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
        className="w-full max-w-md bg-[#0c1829]
                   rounded-2xl p-6 animate-page-enter
                   border border-[rgba(0,229,255,0.12)]"
        onClick={e => e.stopPropagation()}
      >

        <div className="flex items-center justify-between mb-6">
          <h2 className="font-['Syne'] text-lg font-bold
                         text-[#e8f0f8]">
            Create New User
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

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <div className="flex flex-col gap-1.5">
            <label className="font-['JetBrains_Mono'] text-[10px]
                              text-[#8899b0] tracking-[0.5px]">
              FULL NAME
            </label>
            <input
              name="name"
              type="text"
              placeholder="e.g. Riya Sharma"
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

          <div className="flex flex-col gap-1.5">
            <label className="font-['JetBrains_Mono'] text-[10px]
                              text-[#8899b0] tracking-[0.5px]">
              EMAIL ADDRESS
            </label>
            <input
              name="email"
              type="email"
              placeholder="e.g. riya@university.edu"
              value={form.email}
              onChange={handleChange}
              className="w-full px-3 py-2.5 rounded-lg text-sm
                         bg-[#070f20] text-[#e8f0f8]
                         border border-[rgba(0,229,255,0.08)]
                         outline-none placeholder-[#8899b0]
                         focus:border-[#00b8cc]
                         transition-colors duration-200"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-['JetBrains_Mono'] text-[10px]
                              text-[#8899b0] tracking-[0.5px]">
              ROLE
            </label>
            <div className="flex rounded-lg overflow-hidden
                            border border-[rgba(0,229,255,0.08)]">
              {ROLES.map((role, i) => (
                <button
                  key={role}
                  type="button"
                  onClick={() =>
                    setForm(prev => ({ ...prev, role }))
                  }
                  className={`
                    flex-1 py-2 text-xs font-['JetBrains_Mono']
                    cursor-pointer transition-all duration-150
                    ${i < ROLES.length - 1
                      ? 'border-r border-[rgba(0,229,255,0.08)]'
                      : ''}
                    ${form.role === role
                      ? 'bg-[rgba(0,229,255,0.12)] text-[#00e5ff]'
                      : 'bg-transparent text-[#8899b0] hover:text-[#e8f0f8]'}
                  `}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-['JetBrains_Mono'] text-[10px]
                              text-[#8899b0] tracking-[0.5px]">
              INITIAL PASSWORD
            </label>
            <input
              name="password"
              type="password"
              placeholder="••••••••••"
              value={form.password}
              onChange={handleChange}
              className="w-full px-3 py-2.5 rounded-lg text-sm
                         bg-[#070f20] text-[#e8f0f8]
                         border border-[rgba(0,229,255,0.08)]
                         outline-none placeholder-[#8899b0]
                         focus:border-[#00b8cc]
                         transition-colors duration-200"
            />
          </div>

          {error && (
            <div className="px-3 py-2.5 rounded-lg text-sm
                            bg-[rgba(255,59,92,0.10)]
                            border border-[rgba(255,59,92,0.30)]
                            text-[#ff3b5c]">
              {error}
            </div>
          )}

          <div className="flex gap-3 mt-1">
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
              {loading ? 'Creating...' : 'Create User'}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}