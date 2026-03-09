import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, roles = [] }) {
  const { isAuthenticated, user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center
                      justify-center bg-[#040d1a] gap-3">

        {/* Spinner ring */}
        <div className="w-8 h-8 rounded-full border-2
                        border-[rgba(0,229,255,0.25)]
                        border-t-[#00e5ff] animate-spin" />

        <span className="font-mono text-[11px] text-[#8899b0]">
          Verifying session...
        </span>

      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <Navigate to="/login" state={{ from: location }} replace />
    )
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}