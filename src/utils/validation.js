export const PASSWORD_MIN = 8
export const PASSWORD_MAX = 128

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE_RE = /^(?:\+?254|0)([17]\d{8})$/

// Returns the cleaned email, or null if it isn't valid
export function normalizeEmail(value) {
  const email = String(value ?? '').trim().toLowerCase()
  return email.length <= 254 && EMAIL_RE.test(email) ? email : null
}

// "0712 345 678" / "+254712345678" / "254712345678" -> "+254712345678", or null
export function normalizePhone(value) {
  const match = PHONE_RE.exec(String(value ?? '').replace(/[\s-]/g, ''))
  return match ? `+254${match[1]}` : null
}

export function validateRegister({ name, email, phone, password }) {
  const errors = {}
  const cleanName = String(name ?? '').trim()
  const pw = String(password ?? '')

  if (!cleanName) errors.name = 'Enter your full name.'
  else if (cleanName.length > 100) errors.name = 'That name is too long.'

  if (!normalizeEmail(email)) errors.email = 'Enter a valid email address.'
  if (!normalizePhone(phone)) errors.phone = 'Enter a valid Kenyan mobile number.'

  if (pw.length < PASSWORD_MIN) errors.password = `Use at least ${PASSWORD_MIN} characters.`
  else if (pw.length > PASSWORD_MAX) errors.password = `Use at most ${PASSWORD_MAX} characters.`

  return errors
}

export function validateLogin({ email, password }) {
  const errors = {}
  if (!normalizeEmail(email)) errors.email = 'Enter a valid email address.'
  if (!password) errors.password = 'Enter your password.'
  return errors
}