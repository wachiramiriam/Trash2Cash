# Trash2Cash auth API contract

The React app calls four functions in `src/api/auth.js`. Today they use a fake
in-browser store. To go live, replace the function bodies with real requests
to the endpoints below. No page or component needs to change as long as the
request/response shapes match.

## Session handling (recommended)

Use an **httpOnly, Secure, SameSite=Lax session cookie**, set by the server on
register/login and cleared on logout. The frontend never sees or stores the
token, so a script injected into the page can't steal it. All requests are sent
with `credentials: 'include'`. If you use cookies, add CSRF protection for
state-changing requests (POST). If you prefer bearer tokens, tell the frontend
team: do not store them in localStorage.

## User object (returned by every endpoint that returns a user)

```json
{ "id": "123", "name": "Mercy Wanjiru", "email": "mercy@example.com",
  "phone": "+254712345678", "role": "citizen" }
```

`role` is `"citizen"` or `"admin"`. Never include the password or its hash.

## Endpoints

### POST /api/auth/register
Request:
```json
{ "name": "Mercy Wanjiru", "email": "mercy@example.com",
  "phone": "0712 345 678", "password": "at-least-8-chars" }
```
Success: `201` + user object, and the session cookie is set (the person is
logged in straight away).
Errors: `422 VALIDATION` (with per-field messages), `409 EMAIL_TAKEN`.

### POST /api/auth/login
Request: `{ "email": "mercy@example.com", "password": "..." }`
Success: `200` + user object, session cookie set.
Errors: `401 INVALID_CREDENTIALS`, `422 VALIDATION`, `429 RATE_LIMITED`.

### POST /api/auth/logout
Success: `204`, session invalidated on the server and cookie cleared.

### GET /api/auth/me
Success: `200` + user object when logged in.
Not logged in: `401`. The frontend treats this as "nobody is logged in".

## Error format (all non-2xx responses)

```json
{ "error": { "code": "EMAIL_TAKEN",
             "message": "An account with this email already exists.",
             "fields": { "email": "An account with this email already exists." } } }
```
`code` and `message` are always present. `fields` is optional and maps form
field names (`name`, `email`, `phone`, `password`) to messages shown under the
inputs.

## Rules the server must enforce

- **Validate everything again on the server.** The browser checks are only for
  convenience. Rules the frontend uses (`src/utils/validation.js`):
  - email: valid format, max 254 chars, lowercased and trimmed, unique
  - phone: Kenyan mobile, accepts `07..`, `01..`, `+2547..`, `+2541..`; store as `+254XXXXXXXXX`
  - password: 8 to 128 characters (no composition rules)
  - name: required, max 100 chars
- **Hash passwords** with argon2id or bcrypt. Never store or log plain text.
  (bcrypt only reads the first 72 bytes, so keep the 128 limit in mind.)
- **`role` is set by the server.** Registration always creates `citizen`. Ignore
  any `role` sent by a client. Admin accounts are created by an admin or a
  database seed, never by the public form.
- **Login errors must be identical** for "no such email" and "wrong password"
  (`INVALID_CREDENTIALS`), and take similar time.
- **Rate-limit** login and register per IP and per email.
- **Every protected endpoint checks the session**, and every admin endpoint
  checks `role === "admin"`. The React route guards are not security.
- Serve everything over HTTPS in production.
- Phone numbers, emails and names are personal data under Kenya's Data
  Protection Act: collect only what is needed, restrict who can read it, and
  plan for access/deletion requests.

## Not built yet (phase 2)
Email verification, forgot/reset password, change password, account deletion.

## Swapping the mock for the real thing (frontend)

In `src/api/auth.js`, keep `ApiError` and the four exported functions, delete
everything under the MOCK BACKEND banner, and use a helper like:

```js
const BASE = import.meta.env.VITE_API_URL // e.g. http://localhost:4000

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (res.status === 204) return null
  const body = await res.json().catch(() => null)
  if (!res.ok) {
    const e = body?.error
    throw new ApiError(e?.code ?? 'UNKNOWN', e?.message ?? 'Request failed.', e?.fields ?? {})
  }
  return body
}

export const register = (data) =>
  request('/api/auth/register', { method: 'POST', body: JSON.stringify(data) })
export const login = (data) =>
  request('/api/auth/login', { method: 'POST', body: JSON.stringify(data) })
export const logout = () => request('/api/auth/logout', { method: 'POST' })
export const getCurrentUser = () =>
  request('/api/auth/me').catch((err) => {
    if (err.code === 'UNAUTHENTICATED') return null // 401 from /me means "not logged in"
    throw err
  })
```
(The server should use code `UNAUTHENTICATED` on the 401 from `/me`.)
Also delete `getSessionUser` and the two places in `src/api/index.js` that
call it; the real Home/Profile endpoints know the user from the session.