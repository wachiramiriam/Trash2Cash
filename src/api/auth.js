import { normalizeEmail, normalizePhone, validateRegister } from '../utils/validation'

/* ------------------------------------------------------------------
   Error type. The real implementation should throw the same shape
   (see docs/auth-api-contract.md) so the pages keep working.
------------------------------------------------------------------- */
export class ApiError extends Error {
  constructor(code, message, fields = {}) {
    super(message)
    this.name = 'ApiError'
    this.code = code // 'VALIDATION' | 'EMAIL_TAKEN' | 'INVALID_CREDENTIALS' | ...
    this.fields = fields // { email: 'message', phone: 'message', ... }
  }
}

/* ------------------------------------------------------------------
   MOCK BACKEND. Everything below this line is a stand-in that stores
   users in the browser. Delete it when the real API exists.
------------------------------------------------------------------- */
const USERS_KEY = 'trash2cash-mock-users'
const SESSION_KEY = 'trash2cash-mock-session'

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms))

const read = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback
  } catch {
    return fallback
  }
}
const write = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // storage full or blocked: nothing we can do in a mock
  }
}

const toHex = (bytes) => Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
const makeSalt = () => toHex(crypto.getRandomValues(new Uint8Array(16)))

// Needs a secure context: works on localhost and https, not on http://192.168.x.x
async function hashPassword(password, salt) {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits'])
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: enc.encode(salt), iterations: 100000, hash: 'SHA-256' },
    key,
    256
  )
  return toHex(new Uint8Array(bits))
}

const publicUser = ({ id, name, email, phone, role }) => ({ id, name, email, phone, role })

// First run: create one demo admin so you can see the admin dashboard.
async function loadUsers() {
  const existing = read(USERS_KEY, null)
  if (existing) return existing

  const salt = makeSalt()
  const seeded = [
    {
      id: 'u-admin',
      name: 'Demo Admin',
      email: 'admin@example.com',
      phone: '+254700000000',
      role: 'admin',
      salt,
      hash: await hashPassword('Admin12345', salt),
    },
  ]
  write(USERS_KEY, seeded)
  return seeded
}

/* ------------------------------------------------------------------
   The four functions the app uses.
------------------------------------------------------------------- */

// Creates the account. Does NOT log the person in: the app sends them to the login page.
export async function register({ name, email, phone, password }) {
  await delay(600)

  const fields = validateRegister({ name, email, phone, password })
  if (Object.keys(fields).length) {
    throw new ApiError('VALIDATION', 'Please fix the highlighted fields.', fields)
  }

  const cleanEmail = normalizeEmail(email)
  const users = await loadUsers()
  if (users.some((u) => u.email === cleanEmail)) {
    const message = 'An account with this email already exists.'
    throw new ApiError('EMAIL_TAKEN', message, { email: message })
  }

  const salt = makeSalt()
  const user = {
    id: `u-${Date.now()}`,
    name: String(name).trim(),
    email: cleanEmail,
    phone: normalizePhone(phone),
    role: 'citizen', // always decided by the server, never by the form
    salt,
    hash: await hashPassword(password, salt),
  }

  write(USERS_KEY, [...users, user])
  return publicUser(user)
}

// Checks the credentials and starts a session. Returns the user.
export async function login({ email, password }) {
  await delay(500)

  const cleanEmail = normalizeEmail(email)
  const users = await loadUsers()
  const user = users.find((u) => u.email === cleanEmail)

  // Same message whether the email or the password was wrong, so the form
  // can't be used to discover which emails have accounts.
  const hash = await hashPassword(String(password ?? ''), user?.salt ?? 'no-such-user')
  if (!user || hash !== user.hash) {
    throw new ApiError('INVALID_CREDENTIALS', 'Incorrect email or password.')
  }

  write(SESSION_KEY, user.id)
  return publicUser(user)
}

export async function logout() {
  await delay(150)
  try {
    localStorage.removeItem(SESSION_KEY)
  } catch {
    // ignore
  }
}

// Who is logged in right now? Returns the user, or null if nobody.
export async function getCurrentUser() {
  await delay(200)
  return getSessionUser()
}

// Synchronous lookup used by the other mock endpoints (Home, Profile) so the
// greeting matches the logged-in person. Not part of the contract: a real
// backend simply knows who is asking from the session.
export function getSessionUser() {
  const id = read(SESSION_KEY, null)
  const user = (read(USERS_KEY, []) ?? []).find((u) => u.id === id)
  return user ? publicUser(user) : null
}