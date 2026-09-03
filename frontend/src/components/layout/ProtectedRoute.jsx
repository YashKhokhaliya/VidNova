import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

function ProtectedRoute() {
  const { isAuthenticated, authChecked } = useSelector((state) => state.auth)

  // While fetchCurrentUser() is still resolving on initial app load, we
  // don't yet know if the user is logged in — avoid redirecting too early.
  if (!authChecked) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <p className="text-[var(--color-text-secondary)]">Loading...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default ProtectedRoute