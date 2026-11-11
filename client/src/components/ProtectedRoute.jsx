import { Link, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { Loading } from './Status.jsx'

// Guards a route on the client:
//   <ProtectedRoute>               -> any signed-in user
//   <ProtectedRoute requireAdmin>  -> administrators only
// The API enforces the same rules server-side; this only controls what is shown.
function ProtectedRoute({ children, requireAdmin = false }) {
  const { isAuthenticated, isAdmin, checking, user } = useAuth()
  const location = useLocation()

  if (checking) return <Loading label="Checking your session…" />

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace state={{ from: location.pathname + location.search }} />
  }

  if (requireAdmin && !isAdmin) {
    return (
      <section className="status-page">
        <h1>Access denied</h1>
        <p>
          This area is for administrators only. You are signed in as <strong>{user?.email}</strong> with
          the <strong>{user?.role}</strong> role, which can view records but not change them.
        </p>
        <Link to="/" className="btn-primary">
          Back to home
        </Link>
      </section>
    )
  }

  return children
}

export default ProtectedRoute
