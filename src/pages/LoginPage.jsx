import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authAPI } from '../services/api'

const ROLE_REDIRECT = {
  Student:    '/dashboard',
  Instructor: '/dashboard',
  Admin:      '/admin',
}

const ROLES = ['Student', 'Instructor', 'Admin']

export default function LoginPage() {
  const { login }  = useAuth()
  const navigate   = useNavigate()
  const location   = useLocation()

  const from = location.state?.from?.pathname || null

  const [selectedRole, setSelectedRole] = useState('Student')
  const [form, setForm]     = useState({ email: '', password: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('') 
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!form.email.trim())    return setError('Email is required.')
    if (!form.password.trim()) return setError('Password is required.')

    setLoading(true)
    try {
      const res = await authAPI.login({
        email:    form.email.trim(),
        password: form.password,
        role:     selectedRole,
      })
e
      login(res.data)

      navigate(from || ROLE_REDIRECT[res.data.user.role], { replace: true })

    } catch (err) {
      const msg =
        err.response?.data?.message ||
        'Invalid credentials. Please try again.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">


      <div className="hidden lg:flex flex-col justify-center
                      px-16 py-20 relative overflow-hidden
                      bg-[#070f20]
                      border-r border-[rgba(0,229,255,0.08)]">

        <div className="absolute inset-0 opacity-100 pointer-events-none
                        [background-image:linear-gradient(rgba(0,229,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.08)_1px,transparent_1px)]
                        [background-size:40px_40px]" />

        <div className="absolute -top-24 -left-24 w-96 h-96
                        rounded-full pointer-events-none
                        bg-[radial-gradient(circle,rgba(0,229,255,0.06)_0%,transparent_70%)]" />

        <div className="absolute -bottom-20 -right-20 w-80 h-80
                        rounded-full pointer-events-none
                        bg-[radial-gradient(circle,rgba(0,229,255,0.04)_0%,transparent_70%)]" />

        <div className="relative z-10">

          <div className="w-16 h-16 rounded-2xl flex items-center
                          justify-center mb-10 text-3xl
                          bg-[rgba(0,229,255,0.12)]
                          border border-[rgba(0,229,255,0.25)]">
            🛡️
          </div>

          <p className="font-['Syne'] text-2xl font-bold mb-1
                        text-[#00e5ff] tracking-tight">
            ExamGuard
          </p>

          {/* Headline */}
          <h1 className="font-['Syne'] text-5xl font-extrabold
                         leading-tight mb-6 text-[#e8f0f8]
                         tracking-tight">
            AI-Powered<br />
            Exam{' '}
            <span className="text-[#00e5ff]">Proctoring</span>
            <br />System
          </h1>

          {/* Description */}
          <p className="text-[15px] leading-relaxed mb-12
                        text-[#8899b0] max-w-sm">
            Real-time behavioral monitoring, webcam face detection,
            and intelligent alerts — ensuring exam integrity at scale.
          </p>

          {/* Feature list */}
          <ul className="flex flex-col gap-4">
            {[
              'Webcam AI face detection via face-api.js',
              'Tab switching & fullscreen monitoring',
              'Live trust score per student',
              'Real-time instructor alerts via SignalR',
              'Detailed post-exam session reports',
            ].map((feat) => (
              <li
                key={feat}
                className="flex items-center gap-3 text-sm
                           text-[#b0c2d8]"
              >
                <span className="w-2 h-2 rounded-full flex-shrink-0
                                 bg-[#00e5ff]
                                 shadow-[0_0_8px_#00e5ff]" />
                {feat}
              </li>
            ))}
          </ul>

        </div>
      </div>

      <div className="flex items-center justify-center
                      px-6 py-12 lg:px-16 bg-[#040d1a]">

        <div className="w-full max-w-md">

          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <span className="text-2xl">🛡️</span>
            <span className="font-['Syne'] text-xl font-bold
                             text-[#00e5ff]">
              ExamGuard
            </span>
          </div>

          {/* Heading */}
          <h2 className="font-['Syne'] text-3xl font-bold
                         text-[#e8f0f8] mb-2">
            Welcome back
          </h2>
          <p className="text-sm text-[#8899b0] mb-8">
            Sign in to access your proctoring portal
          </p>

          {/* ── Role Selector Tabs ─────────────────────── */}
          <div className="flex rounded-lg overflow-hidden mb-8
                          border border-[rgba(0,229,255,0.08)]">
            {ROLES.map((role, i) => (
              <button
                key={role}
                type="button"
                onClick={() => setSelectedRole(role)}
                className={`
                  flex-1 py-2.5 text-xs font-mono
                  transition-all duration-200 cursor-pointer
                  ${i !== ROLES.length - 1
                    ? 'border-r border-[rgba(0,229,255,0.08)]'
                    : ''}
                  ${selectedRole === role
                    ? 'bg-[rgba(0,229,255,0.12)] text-[#00e5ff] border border-[rgba(0,229,255,0.25)]'
                    : 'bg-transparent text-[#8899b0]'}
                `}
              >
                {role}
              </button>
            ))}
          </div>

          {/* ── Form ──────────────────────────────────── */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {/* Email field */}
            <div className="flex flex-col gap-2">
              <label className="font-mono text-[11px] text-[#8899b0]
                                tracking-[0.5px]">
                EMAIL ADDRESS
              </label>
              <input
                name="email"
                type="email"
                autoComplete="email"
                placeholder={`${selectedRole.toLowerCase()}@university.edu`}
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg text-sm
                           bg-[#0c1829] text-[#e8f0f8]
                           border border-[rgba(0,229,255,0.08)]
                           outline-none
                           focus:border-[#00b8cc]
                           placeholder:text-[#8899b0]
                           transition-colors duration-200"
              />
            </div>

            {/* Password field */}
            <div className="flex flex-col gap-2">
              <label className="font-mono text-[11px] text-[#8899b0]
                                tracking-[0.5px]">
                PASSWORD
              </label>
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••••"
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg text-sm
                           bg-[#0c1829] text-[#e8f0f8]
                           border border-[rgba(0,229,255,0.08)]
                           outline-none
                           focus:border-[#00b8cc]
                           placeholder:text-[#8899b0]
                           transition-colors duration-200"
              />
            </div>

            {/* Error message — shows when error exists */}
            {error && (
              <div className="flex items-center gap-2 px-4 py-3
                              rounded-lg text-sm
                              bg-[rgba(255,59,92,0.10)]
                              border border-[rgba(255,59,92,0.30)]
                              text-[#ff3b5c]">
                <span>⚠</span>
                <span>{error}</span>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className={`
                w-full py-3 rounded-lg text-sm font-semibold
                font-['Syne'] tracking-wide border-none
                transition-opacity duration-200
                bg-[#00e5ff] text-[#040d1a]
                ${loading
                  ? 'opacity-60 cursor-not-allowed'
                  : 'cursor-pointer hover:opacity-90'}
              `}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  {/* Spinner */}
                  <span className="w-4 h-4 rounded-full border-2
                                   border-[#040d1a]
                                   border-t-transparent
                                   animate-spin" />
                  Signing in...
                </span>
              ) : (
                `Sign in as ${selectedRole} →`
              )}
            </button>

          </form>

          {/* ── System Status Bar ─────────────────────── */}
          <div className="flex items-center gap-3 mt-8 px-4 py-3
                          rounded-lg bg-[#0c1829]
                          border border-[rgba(0,229,255,0.08)]">

            <span className="w-[7px] h-[7px] rounded-full flex-shrink-0
                             bg-[#00e676]
                             shadow-[0_0_6px_#00e676]" />

            <span className="font-mono text-[11px] text-[#8899b0]">
              All systems operational · ExamGuard v1.0.0
            </span>

          </div>

        </div>
      </div>

    </div>
  )
}
