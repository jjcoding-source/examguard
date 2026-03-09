import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import CreateUserModal from '../components/CreateUserModal'
import {
  Shield,
  Users,
  GraduationCap,
  BookOpen,
  UserX,
  Search,
  Plus,
  LogOut,
  ToggleLeft,
  ToggleRight,
  BarChart2,
} from 'lucide-react'

const INITIAL_USERS = [
  {
    id:         1,
    name:       'Alex Johnson',
    email:      'alex@university.edu',
    role:       'Instructor',
    joined:     'Jan 2024',
    lastActive: 'Today',
    active:     true,
  },
  {
    id:         2,
    name:       'Riya Sharma',
    email:      'riya@student.edu',
    role:       'Student',
    joined:     'Aug 2024',
    lastActive: 'Today',
    active:     true,
  },
  {
    id:         3,
    name:       'Kevin Park',
    email:      'kpark@student.edu',
    role:       'Student',
    joined:     'Aug 2024',
    lastActive: 'Today',
    active:     true,
  },
  {
    id:         4,
    name:       'Dr. Maria Chen',
    email:      'mchen@university.edu',
    role:       'Instructor',
    joined:     'Jan 2023',
    lastActive: 'Yesterday',
    active:     true,
  },
  {
    id:         5,
    name:       'Sam Okafor',
    email:      'sokafor@student.edu',
    role:       'Student',
    joined:     'Aug 2024',
    lastActive: '5 Mar 2026',
    active:     false,
  },
  {
    id:         6,
    name:       'Meera Pillai',
    email:      'meera@student.edu',
    role:       'Student',
    joined:     'Aug 2024',
    lastActive: 'Today',
    active:     true,
  },
  {
    id:         7,
    name:       'System Admin',
    email:      'admin@examguard.io',
    role:       'Admin',
    joined:     'System',
    lastActive: 'Today',
    active:     true,
  },
]

const ROLE_STYLES = {
  Student: {
    color:  '#00e676',
    bg:     'rgba(0,230,118,0.10)',
    border: 'rgba(0,230,118,0.25)',
  },
  Instructor: {
    color:  '#00e5ff',
    bg:     'rgba(0,229,255,0.10)',
    border: 'rgba(0,229,255,0.25)',
  },
  Admin: {
    color:  '#ffb020',
    bg:     'rgba(255,176,32,0.10)',
    border: 'rgba(255,176,32,0.25)',
  },
}

function RoleTag({ role }) {
  const s = ROLE_STYLES[role]
  return (
    <span
      className="font-['JetBrains_Mono'] text-[10px]
                 px-2 py-0.5 rounded border"
      style={{ color: s.color, background: s.bg, borderColor: s.border }}
    >
      {role}
    </span>
  )
}

export default function AdminPage() {
  const { logout }   = useAuth()
  const navigate     = useNavigate()

  const [users, setUsers]         = useState(INITIAL_USERS)
  const [search, setSearch]       = useState('')
  const [showModal, setShowModal] = useState(false)

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  )

  function toggleUser(id) {
    setUsers(prev =>
      prev.map(u =>
        u.id === id ? { ...u, active: !u.active } : u
      )
    )
  }

  // ── Summary counts ────────────────────────────────────
  const totalUsers   = users.length
  const instructors  = users.filter(u => u.role === 'Instructor').length
  const students     = users.filter(u => u.role === 'Student').length
  const inactive     = users.filter(u => !u.active).length

  return (
    <div className="min-h-screen bg-[#040d1a]">

      <header className="flex items-center justify-between
                         px-8 py-4 bg-[#070f20]
                         border-b border-[rgba(0,229,255,0.08)]
                         sticky top-0 z-10">

        <div className="flex items-center gap-2">
          <Shield
            size={20}
            strokeWidth={2}
            className="text-[#00e5ff]"
          />
          <span className="font-['Syne'] text-lg font-bold
                           text-[#e8f0f8]">
            ExamGuard
          </span>
          <span className="font-['JetBrains_Mono'] text-[10px]
                           text-[#ffb020] px-2 py-0.5 rounded
                           bg-[rgba(255,176,32,0.10)]
                           border border-[rgba(255,176,32,0.25)]
                           ml-2">
            ADMIN
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-3 py-2
                       rounded-lg text-sm text-[#8899b0]
                       hover:text-[#e8f0f8] cursor-pointer
                       bg-transparent border-none
                       transition-colors duration-150"
          >
            <BarChart2 size={15} strokeWidth={1.75} />
            Dashboard
          </button>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-3 py-2
                       rounded-lg text-sm text-[#8899b0]
                       hover:text-[#ff3b5c] cursor-pointer
                       bg-transparent border-none
                       transition-colors duration-150"
          >
            <LogOut size={15} strokeWidth={1.75} />
            Logout
          </button>
        </div>

      </header>

      <div className="p-8">

        {/* Page title */}
        <div className="mb-8">
          <h1 className="font-['Syne'] text-2xl font-bold
                         text-[#e8f0f8] mb-1">
            Admin Control Panel
          </h1>
          <p className="text-sm text-[#8899b0]">
            Manage users, roles, and system configuration
          </p>
        </div>

        {/* ── Stats row ──────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4
                        gap-4 mb-8">

          {/* Total users */}
          <div className="bg-[#0c1829] rounded-xl p-5
                          border border-[rgba(0,229,255,0.08)]">
            <div className="flex items-center gap-2 mb-3">
              <Users
                size={14}
                strokeWidth={1.75}
                className="text-[#00e5ff]"
              />
              <p className="font-['JetBrains_Mono'] text-[10px]
                            text-[#8899b0] tracking-[0.5px]">
                TOTAL USERS
              </p>
            </div>
            <p className="font-['Syne'] text-3xl font-bold
                          text-[#00e5ff]">
              {totalUsers}
            </p>
          </div>

          {/* Instructors */}
          <div className="bg-[#0c1829] rounded-xl p-5
                          border border-[rgba(0,229,255,0.08)]">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen
                size={14}
                strokeWidth={1.75}
                className="text-[#00e676]"
              />
              <p className="font-['JetBrains_Mono'] text-[10px]
                            text-[#8899b0] tracking-[0.5px]">
                INSTRUCTORS
              </p>
            </div>
            <p className="font-['Syne'] text-3xl font-bold
                          text-[#00e676]">
              {instructors}
            </p>
          </div>

          {/* Students */}
          <div className="bg-[#0c1829] rounded-xl p-5
                          border border-[rgba(0,229,255,0.08)]">
            <div className="flex items-center gap-2 mb-3">
              <GraduationCap
                size={14}
                strokeWidth={1.75}
                className="text-[#e8f0f8]"
              />
              <p className="font-['JetBrains_Mono'] text-[10px]
                            text-[#8899b0] tracking-[0.5px]">
                STUDENTS
              </p>
            </div>
            <p className="font-['Syne'] text-3xl font-bold
                          text-[#e8f0f8]">
              {students}
            </p>
          </div>

          {/* Inactive */}
          <div className="bg-[#0c1829] rounded-xl p-5
                          border border-[rgba(0,229,255,0.08)]">
            <div className="flex items-center gap-2 mb-3">
              <UserX
                size={14}
                strokeWidth={1.75}
                className="text-[#ffb020]"
              />
              <p className="font-['JetBrains_Mono'] text-[10px]
                            text-[#8899b0] tracking-[0.5px]">
                INACTIVE
              </p>
            </div>
            <p className="font-['Syne'] text-3xl font-bold
                          text-[#ffb020]">
              {inactive}
            </p>
          </div>

        </div>

        {/* ── Users table ────────────────────────────── */}
        <div className="bg-[#0c1829] rounded-2xl
                        border border-[rgba(0,229,255,0.08)]
                        overflow-hidden">

          {/* Table header */}
          <div className="flex items-center justify-between
                          px-6 py-4
                          border-b border-[rgba(0,229,255,0.08)]">
            <h2 className="font-['Syne'] text-sm font-semibold
                           text-[#e8f0f8]">
              User Management
            </h2>

            <div className="flex items-center gap-3">

              <div className="relative">
                <Search
                  size={13}
                  strokeWidth={1.75}
                  className="absolute left-3 top-1/2 -translate-y-1/2
                             text-[#8899b0] pointer-events-none"
                />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-8 pr-4 py-2 rounded-lg text-sm
                             bg-[#070f20] text-[#e8f0f8]
                             border border-[rgba(0,229,255,0.08)]
                             outline-none placeholder-[#8899b0]
                             focus:border-[#00b8cc]
                             transition-colors duration-200
                             w-[200px]"
                />
              </div>

              {/* Add user */}
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-1.5 px-4 py-2
                           rounded-lg text-sm font-semibold
                           font-['Syne'] cursor-pointer
                           bg-[#00e5ff] text-[#040d1a]
                           border-none hover:opacity-90
                           transition-opacity duration-150"
              >
                <Plus size={14} strokeWidth={2.5} />
                Add User
              </button>

            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">

              <thead>
                <tr className="bg-[#070f20]
                               border-b border-[rgba(0,229,255,0.08)]">
                  {['NAME', 'EMAIL', 'ROLE', 'JOINED',
                    'LAST ACTIVE', 'STATUS', 'ACTIONS'].map(h => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left
                                 font-['JetBrains_Mono'] text-[10px]
                                 text-[#8899b0] tracking-[0.5px]
                                 font-medium"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y
                                divide-[rgba(0,229,255,0.05)]">
                {filtered.map(user => (
                  <tr
                    key={user.id}
                    className="hover:bg-[rgba(255,255,255,0.02)]
                               transition-colors duration-100"
                  >

                    <td className="px-5 py-4">
                      <p className="text-sm font-medium
                                    text-[#e8f0f8]">
                        {user.name}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-['JetBrains_Mono'] text-[11px]
                                    text-[#8899b0]">
                        {user.email}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <RoleTag role={user.role} />
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm text-[#8899b0]">
                        {user.joined}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-['JetBrains_Mono'] text-[11px]
                                    text-[#e8f0f8]">
                        {user.lastActive}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <button
                        onClick={() =>
                          user.role !== 'Admin' && toggleUser(user.id)
                        }
                        className={`
                          flex items-center gap-1.5 text-xs
                          font-['JetBrains_Mono'] cursor-pointer
                          bg-transparent border-none
                          transition-colors duration-150
                          ${user.role === 'Admin'
                            ? 'opacity-40 cursor-not-allowed'
                            : ''}
                          ${user.active
                            ? 'text-[#00e676]'
                            : 'text-[#8899b0]'}
                        `}
                      >
                        {user.active ? (
                          <ToggleRight size={18} strokeWidth={1.75} />
                        ) : (
                          <ToggleLeft size={18} strokeWidth={1.75} />
                        )}
                        {user.active ? 'Active' : 'Inactive'}
                      </button>
                    </td>

                    <td className="px-5 py-4">
                      {user.role !== 'Admin' ? (
                        <button
                          className="font-['JetBrains_Mono'] text-[11px]
                                     text-[#00e5ff] cursor-pointer
                                     bg-transparent border-none
                                     hover:text-[#00b8cc]
                                     transition-colors duration-150"
                        >
                          Edit
                        </button>
                      ) : (
                        <span className="font-['JetBrains_Mono']
                                         text-[11px] text-[#8899b0]">
                          —
                        </span>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>

            {filtered.length === 0 && (
              <div className="py-16 text-center">
                <p className="font-['Syne'] text-base
                              font-semibold text-[#8899b0] mb-1">
                  No users found
                </p>
                <p className="text-sm text-[#8899b0]">
                  Try a different search term
                </p>
              </div>
            )}

          </div>

          <div className="px-6 py-3
                          border-t border-[rgba(0,229,255,0.08)]">
            <p className="font-['JetBrains_Mono'] text-[10px]
                          text-[#8899b0]">
              Showing {filtered.length} of {users.length} users
            </p>
          </div>

        </div>
      </div>

      {showModal && (
        <CreateUserModal
          onClose={() => setShowModal(false)}
          onCreated={() => setShowModal(false)}
        />
      )}

    </div>
  )
}