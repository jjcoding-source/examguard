import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard,
  ClipboardList,
  MonitorPlay,
  BarChart2,
  Bell,
  Settings,
  LogOut,
  Shield,
} from 'lucide-react'

const NAV_ITEMS = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/dashboard',
    roles: ['Student', 'Instructor', 'Admin'],
  },
  {
    label: 'Exams',
    icon: ClipboardList,
    path: '/exams',
    roles: ['Student', 'Instructor'],
  },
  {
    label: 'Live Monitor',
    icon: MonitorPlay,
    path: '/monitor',
    roles: ['Instructor'],
  },
  {
    label: 'Reports',
    icon: BarChart2,
    path: '/reports',
    roles: ['Instructor', 'Admin'],
  },
  {
    label: 'Alerts',
    icon: Bell,
    path: '/alerts',
    roles: ['Instructor', 'Admin'],
  },
  {
    label: 'Settings',
    icon: Settings,
    path: '/settings',
    roles: ['Student', 'Instructor', 'Admin'],
  },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const visibleItems = NAV_ITEMS.filter(item =>
    item.roles.includes(user?.role)
  )

  return (
    <aside className="w-[220px] min-h-screen flex flex-col
                      bg-[#070f20]
                      border-r border-[rgba(0,229,255,0.08)]">

      <div className="flex items-center gap-2 px-5 py-6
                      border-b border-[rgba(0,229,255,0.08)]">
        <Shield
          size={20}
          className="text-[#00e5ff]"
          strokeWidth={2}
        />
        <span className="font-['Syne'] text-lg font-bold
                         text-[#e8f0f8] tracking-tight">
          ExamGuard
        </span>
      </div>

      <div className="mx-3 mt-5 mb-2 px-3 py-3 rounded-lg
                      bg-[#0c1829]
                      border border-[rgba(0,229,255,0.08)]">
        <p className="text-sm font-medium text-[#e8f0f8]
                      truncate">
          {user?.name}
        </p>
        <p className="font-['JetBrains_Mono'] text-[10px]
                      text-[#00e5ff] mt-0.5 tracking-wide">
          {user?.role?.toUpperCase()}
        </p>
      </div>

      <nav className="flex flex-col gap-0.5 px-3 mt-4 flex-1">

        <p className="font-['JetBrains_Mono'] text-[10px]
                      text-[#8899b0] tracking-[1px] px-2 mb-2">
          NAVIGATION
        </p>

        {visibleItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`
                flex items-center gap-3 px-3 py-2.5
                rounded-lg text-sm w-full text-left
                transition-all duration-150 cursor-pointer
                border-l-2
                ${isActive
                  ? 'bg-[rgba(0,229,255,0.08)] text-[#00e5ff] border-[#00e5ff]'
                  : 'bg-transparent text-[#8899b0] border-transparent hover:text-[#e8f0f8] hover:bg-[rgba(255,255,255,0.03)]'
                }
              `}
            >
              <Icon size={15} strokeWidth={1.75} />
              {item.label}
            </button>
          )
        })}
      </nav>

      <div className="px-3 pb-5">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5
                     rounded-lg text-sm w-full text-left
                     text-[#8899b0] border-transparent border-l-2
                     hover:text-[#ff3b5c]
                     hover:bg-[rgba(255,59,92,0.06)]
                     transition-all duration-150 cursor-pointer"
        >
          <LogOut size={15} strokeWidth={1.75} />
          Logout
        </button>
      </div>

    </aside>
  )
}