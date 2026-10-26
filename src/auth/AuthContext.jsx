import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  getCurrentUser,
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
} from '../api/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [status, setStatus] = useState('loading') // 'loading' | 'authed' | 'anon'
  const [loggedOut, setLoggedOut] = useState(false) // true after a deliberate logout

  // On first load, ask "who am I?" so a refresh keeps you logged in
  useEffect(() => {
    let cancelled = false
    getCurrentUser()
      .then((u) => {
        if (cancelled) return
        setUser(u)
        setStatus(u ? 'authed' : 'anon')
      })
      .catch(() => {
        if (cancelled) return
        setUser(null)
        setStatus('anon')
      })
    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(async (credentials) => {
    const u = await apiLogin(credentials)
    setUser(u)
    setStatus('authed')
    setLoggedOut(false)
    return u
  }, [])

  // Creates the account only. The person logs in afterwards, so no session starts here.
  const register = useCallback((details) => apiRegister(details), [])

  const logout = useCallback(async () => {
    try {
      await apiLogout()
    } finally {
      // Clear the local state even if the request failed
      setUser(null)
      setStatus('anon')
      setLoggedOut(true)
    }
  }, [])

  const value = useMemo(
    () => ({ user, status, loggedOut, login, register, logout }),
    [user, status, loggedOut, login, register, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}