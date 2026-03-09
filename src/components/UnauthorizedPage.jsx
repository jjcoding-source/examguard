import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function UnauthorizedPage() {
  const navigate  = useNavigate()
  const { logout } = useAuth()

  return (
    <div className="min-h-screen flex flex-col items-center
                    justify-center bg-[#040d1a] gap-4
                    text-center px-6">

      <span className="text-5xl">🔒</span>

      <h1 className="font-['Syne'] text-3xl font-bold
                     text-[#e8f0f8] m-0">
        Access Denied
      </h1>

      <p className="text-sm text-[#8899b0] max-w-xs leading-relaxed">
        You don't have permission to view this page.
        Contact your administrator if you think this is a mistake.
      </p>

      <div className="flex gap-3 mt-2">

        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2.5 rounded-lg text-sm font-semibold
                     font-['Syne'] bg-[#00e5ff] text-[#040d1a]
                     border-none cursor-pointer"
        >
          Go Back
        </button>

        <button
          onClick={logout}
          className="px-5 py-2.5 rounded-lg text-sm cursor-pointer
                     bg-transparent text-[#b0c2d8]
                     border border-[rgba(0,229,255,0.08)]"
        >
          Logout
        </button>

      </div>
    </div>
  )
}