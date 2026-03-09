import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ShieldX, ArrowLeft, LogOut } from 'lucide-react'

export default function UnauthorizedPage() {
  const navigate = useNavigate()
  const { logout } = useAuth()

  return (
    <div className="min-h-screen flex flex-col items-center
                    justify-center bg-[#040d1a] gap-5
                    text-center px-6">

      <ShieldX
        size={48}
        strokeWidth={1.25}
        className="text-[#ff3b5c]"
      />

      <div>
        <h1 className="font-['Syne'] text-3xl font-bold
                       text-[#e8f0f8] mb-2">
          Access Denied
        </h1>
        <p className="text-sm text-[#8899b0] max-w-xs
                      leading-relaxed">
          You don't have permission to view this page.
          Contact your administrator if you think
          this is a mistake.
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-5 py-2.5
                     rounded-lg text-sm font-semibold
                     font-['Syne'] bg-[#00e5ff] text-[#040d1a]
                     border-none cursor-pointer
                     hover:opacity-90 transition-opacity"
        >
          <ArrowLeft size={15} strokeWidth={2} />
          Go Back
        </button>

        <button
          onClick={logout}
          className="flex items-center gap-2 px-5 py-2.5
                     rounded-lg text-sm cursor-pointer
                     bg-transparent text-[#8899b0]
                     border border-[rgba(0,229,255,0.08)]
                     hover:text-[#ff3b5c]
                     hover:border-[rgba(255,59,92,0.30)]
                     transition-all duration-150"
        >
          <LogOut size={15} strokeWidth={1.75} />
          Logout
        </button>
      </div>

    </div>
  )
}