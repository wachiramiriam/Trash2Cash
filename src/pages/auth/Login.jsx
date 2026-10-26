import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import AuthLayout from './AuthLayout'
import FormField, { PasswordField } from './FormField'
import { useAuth } from '../../auth/AuthContext'
import { validateLogin } from '../../utils/validation'

export default function Login() {
  const { login } = useAuth()
  const location = useLocation()

  // Set when the person has just come from the register page
  const justRegistered = Boolean(location.state?.registered)

  const [values, setValues] = useState({
    email: justRegistered ? String(location.state?.email ?? '') : '',
    password: '',
  })
  const [notice, setNotice] = useState(justRegistered)
  const [fieldErrors, setFieldErrors] = useState({})
  const [formError, setFormError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const set = (name) => (e) => {
    setValues((v) => ({ ...v, [name]: e.target.value }))
    setFieldErrors((f) => ({ ...f, [name]: undefined }))
    setFormError(null)
    setNotice(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const errors = validateLogin(values)
    if (Object.keys(errors).length) {
      setFieldErrors(errors)
      return
    }

    setSubmitting(true)
    setFormError(null)
    try {
      await login({ email: values.email, password: values.password })
      // On success the route guard moves us on; nothing else to do here
    } catch (err) {
      setFormError(
        err.code === 'INVALID_CREDENTIALS' ? err.message : 'Something went wrong. Please try again.'
      )
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to see your points and impact."
      footer={
        <>
          New to Trash2Cash?{' '}
          <Link to="/register" className="font-semibold text-brand-600 hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {notice && !formError && (
          <div role="status" className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
            Account created! Log in to get started.
          </div>
        )}

        {formError && (
          <div role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {formError}
          </div>
        )}

        <FormField
          label="Email"
          type="email"
          autoComplete="email"
          inputMode="email"
          value={values.email}
          onChange={set('email')}
          error={fieldErrors.email}
        />

        <PasswordField
          label="Password"
          autoComplete="current-password"
          value={values.password}
          onChange={set('password')}
          error={fieldErrors.password}
        />

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {submitting ? 'Logging in...' : 'Log in'}
        </button>
      </form>
    </AuthLayout>
  )
}