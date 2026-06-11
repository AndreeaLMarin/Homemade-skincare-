// src/components/common/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

// Redirects unauthenticated users to /login
export const RequireAuth = ({ redirectTo = '/login' }) => {
  const { user, loading } = useAuth()
  if (loading) return <PageLoader />
  return user ? <Outlet /> : <Navigate to={redirectTo} replace />
}

// Redirects non-admins away
export const RequireAdmin = ({ redirectTo = '/' }) => {
  const { user, isAdmin, loading } = useAuth()
  if (loading) return <PageLoader />
  if (!user) return <Navigate to="/login" replace />
  return isAdmin ? <Outlet /> : <Navigate to={redirectTo} replace />
}

const PageLoader = () => (
  <div style={{
    minHeight: '100vh', display: 'flex', alignItems: 'center',
    justifyContent: 'center', background: 'var(--color-cream)'
  }}>
    <div className="loader" />
  </div>
)
