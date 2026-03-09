import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

import LoginPage          from './pages/LoginPage'
import DashboardPage      from './pages/DashboardPage'
import ExamsListPage      from './pages/ExamsListPage'
import TakeExamPage       from './pages/TakeExamPage'
import MonitorPage        from './pages/MonitorPage'
import SessionReportPage  from './pages/SessionReportPage'
import AdminPage          from './pages/AdminPage'
import UnauthorizedPage   from './pages/UnauthorizedPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route path="/dashboard" element={
            <ProtectedRoute roles={['Student', 'Instructor', 'Admin']}>
              <DashboardPage />
            </ProtectedRoute>
          } />

          <Route path="/exams" element={
            <ProtectedRoute roles={['Student', 'Instructor']}>
              <ExamsListPage />
            </ProtectedRoute>
          } />

          <Route path="/exam/:examId/take" element={
            <ProtectedRoute roles={['Student']}>
              <TakeExamPage />
            </ProtectedRoute>
          } />

          <Route path="/exam/:examId/monitor" element={
            <ProtectedRoute roles={['Instructor']}>
              <MonitorPage />
            </ProtectedRoute>
          } />

          <Route path="/session/:sessionId/report" element={
            <ProtectedRoute roles={['Instructor', 'Admin']}>
              <SessionReportPage />
            </ProtectedRoute>
          } />

          {/* Admin only */}
          <Route path="/admin" element={
            <ProtectedRoute roles={['Admin']}>
              <AdminPage />
            </ProtectedRoute>
          } />

          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}