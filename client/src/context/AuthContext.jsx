import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { api, clearAuth, getStoredAuth, setUnauthorizedHandler, storeAuth } from '../lib/api.js'

// Global authentication state: who is signed in, their role, and the actions
// to sign up, sign in and sign out. Wrap the app in <AuthProvider>.
const AuthContext = createContext(null)

// Reads the "exp" claim (seconds since epoch) from a JWT without verifying it.
// Verification happens on the server; this is only used to drop tokens that
// have obviously expired and to schedule an automatic sign-out.
function tokenExpiry(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
    return typeof payload.exp === 'number' ? payload.exp * 1000 : null
  } catch {
    return null
  }
}

function loadInitialAuth() {
  const stored = getStoredAuth()
  if (!stored?.token) return null
  const exp = tokenExpiry(stored.token)
  if (exp && exp <= Date.now()) {
    clearAuth()
    return null
  }
  return stored
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(loadInitialAuth)
  // True while a stored token is being re-checked with the server on page load
  const [checking, setChecking] = useState(() => Boolean(loadInitialAuth()))

  const saveSession = useCallback((data) => {
    const next = { token: data.token, user: data.user }
    storeAuth(next)
    setAuth(next)
    return data.user
  }, [])

  const endSession = useCallback(() => {
    clearAuth()
    setAuth(null)
  }, [])

  // Any 401 from the API (expired/invalid token) ends the local session
  useEffect(() => {
    setUnauthorizedHandler(endSession)
    return () => setUnauthorizedHandler(null)
  }, [endSession])

  // On first load, confirm the stored token is still accepted and refresh the profile/role
  useEffect(() => {
    const stored = getStoredAuth()
    if (!stored?.token) {
      setChecking(false)
      return
    }
    let cancelled = false
    api
      .get('/api/auth/me')
      .then((user) => {
        if (cancelled) return
        const next = { token: stored.token, user }
        storeAuth(next)
        setAuth(next)
      })
      .catch(() => {
        // 401 is handled by the unauthorized handler; network errors keep the cached session
      })
      .finally(() => !cancelled && setChecking(false))
    return () => {
      cancelled = true
    }
  }, [])

  // Sign out automatically the moment the token expires
  useEffect(() => {
    if (!auth?.token) return undefined
    const exp = tokenExpiry(auth.token)
    if (!exp) return undefined
    const ms = exp - Date.now()
    if (ms <= 0) {
      endSession()
      return undefined
    }
    const timer = setTimeout(endSession, Math.min(ms, 2 ** 31 - 1))
    return () => clearTimeout(timer)
  }, [auth?.token, endSession])

  const signIn = useCallback(
    async ({ email, password }) => saveSession(await api.post('/api/auth/signin', { email, password }, { auth: false })),
    [saveSession]
  )

  const signUp = useCallback(
    async ({ name, email, password }) =>
      saveSession(await api.post('/api/auth/signup', { name, email, password }, { auth: false })),
    [saveSession]
  )

  // Stateless JWT sign-out: tell the server (optional confirmation), then
  // delete the token locally. The local delete happens even if the call fails.
  const signOut = useCallback(async () => {
    try {
      await api.post('/api/auth/signout')
    } catch {
      // ignore: the token is discarded either way
    } finally {
      endSession()
    }
  }, [endSession])

  const value = useMemo(
    () => ({
      user: auth?.user ?? null,
      isAuthenticated: Boolean(auth?.token),
      isAdmin: auth?.user?.role === 'admin',
      checking,
      signIn,
      signUp,
      signOut,
    }),
    [auth, checking, signIn, signUp, signOut]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
