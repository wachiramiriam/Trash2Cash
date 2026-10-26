import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { Loading } from '../components/Status'

// Only allow in-app paths, never "//evil.com" or full URLs
const safePath = (p) => (typeof p === 'string' && p.startsWith('/') && !p.startsWith('//') ? p : null)

export default function GuestOnly({ children }) {
  const { user, status } = useAuth()
  const location = useLocation()

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loading />
      </div>
    )
  }

  if (user) {
    const fallback = user.role === 'admin' ? '/admin' : '/'
    return <Navigate to={safePath(location.state?.from) ?? fallback} replace />
  }

  return children
}