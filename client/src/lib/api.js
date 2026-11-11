// Small fetch wrapper used by every component that talks to the Express API.
//
// - Base URL: empty in development (Vite proxies /api to http://localhost:5000);
//   set VITE_API_URL in client/.env for a deployed backend.
// - Adds "Authorization: Bearer <token>" when the user is signed in.
// - Turns non-2xx responses into an ApiError carrying the status and any
//   field-level validation details returned by the server.

const BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

// ---- Token storage ---------------------------------------------------------
// The JWT and the public user profile are kept in localStorage under one key so
// a page refresh does not sign the user out. No secrets other than the user's
// own short-lived token are ever stored in the browser. See README
// "Token storage" for the trade-offs of this approach.
const STORAGE_KEY = 'portfolio.auth'

export function getStoredAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function storeAuth(auth) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(auth))
  } catch {
    // Storage can be unavailable (private mode); the session then lasts until refresh
  }
}

export function clearAuth() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}

// ---- Errors ----------------------------------------------------------------
export class ApiError extends Error {
  constructor(message, status, details = []) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details // [{ field, message }]
  }
}

// AuthContext registers a callback so an expired/invalid token anywhere in the
// app signs the user out instead of leaving a broken session behind.
let unauthorizedHandler = null
export function setUnauthorizedHandler(fn) {
  unauthorizedHandler = fn
}

// ---- Request helper ----------------------------------------------------------
export async function request(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { Accept: 'application/json' }
  if (body !== undefined) headers['Content-Type'] = 'application/json'

  const token = auth ? getStoredAuth()?.token : null
  if (token) headers.Authorization = `Bearer ${token}`

  let res
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError('Cannot reach the server. Check that the backend is running.', 0)
  }

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    if (res.status === 401 && token && unauthorizedHandler) unauthorizedHandler()
    const message =
      res.status === 403
        ? data?.error || 'You do not have permission to do that.'
        : data?.error || `Request failed (${res.status})`
    throw new ApiError(message, res.status, data?.details || [])
  }
  return data
}

export const api = {
  get: (path, options) => request(path, { ...options, method: 'GET' }),
  post: (path, body, options) => request(path, { ...options, method: 'POST', body }),
  put: (path, body, options) => request(path, { ...options, method: 'PUT', body }),
  del: (path, options) => request(path, { ...options, method: 'DELETE' }),
}
