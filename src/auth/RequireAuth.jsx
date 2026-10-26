import { Link, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { Loading } from '../components/Status'

function NoAccess() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-gray-50 p-6 text-center">
      <h1 className="text-xl font-bold text-gray-900">You don't have access to this page</h1>
      <p className="text-sm text-gray-500">This area is only for Trash2Cash administrators.</p>
      <Link to="/" className="mt-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white">
        Back to home
      </Link>
    </div>
  )
}

export default function RequireAuth({ role, children }) {
  const { user, status, loggedOut } = useAuth()
  const location = useLocation()

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loading />
      </div>
    )
  }

  if (!user) {
    // Remember where they were headed, unless they just chose to log out
    const from = loggedOut ? null : location.pathname + location.search
    return <Navigate to="/login" replace state={from ? { from } : null} />
  }

  if (role && user.role !== role) return <NoAccess />

  return children
}