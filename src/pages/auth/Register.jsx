import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from './AuthLayout'
import FormField, { PasswordField } from './FormField'
import { useAuth } from '../../auth/AuthContext'
import { PASSWORD_MIN, validateRegister } from '../../utils/validation'

const empty = { name: '', email: '', phone: '', password: '', confirm: '' }

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [values, setValues] = useState(empty)
  const [fieldErrors, setFieldErrors] = useState({})
  const [formError, setFormError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const set = (name) => (e) => {
    setValues((v) => ({ ...v, [name]: e.target.value }))
    setFieldErrors((f) => ({ ...f, [name]: undefined }))
    setFormError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const errors = validateRegister(values)
    if (!errors.password && values.password !== values.confirm) {
      errors.confirm = 'Passwords do not match.'
    }
    if (Object.keys(errors).length) {
      setFieldErrors(errors)
      return
    }

    setSubmitting(true)
    setFormError(null)
        try {
      await register({
        name: values.name,
        email: values.email,
        phone: values.phone,
        password: values.password,
      })
      navigate('/login', {
        replace: true,
        state: { registered: true, email: values.email.trim() },
      })
      // On success the route guard moves us to the home page
    } catch (err) {
      // The server can reject a field too (e.g. email already registered)
      if (err.fields && Object.keys(err.fields).length) setFieldErrors(err.fields)
      else setFormError('Something went wrong. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Turn your recycling into rewards."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-brand-600 hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {formError && (
          <div role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {formError}
          </div>
        )}

        <FormField
          label="Full name"
          autoComplete="name"
          value={values.name}
          onChange={set('name')}
          error={fieldErrors.name}
        />

        <FormField
          label="Email"
          type="email"
          autoComplete="email"
          inputMode="email"
          value={values.email}
          onChange={set('email')}
          error={fieldErrors.email}
        />

        <FormField
          label="Phone number"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          placeholder="07XX XXX XXX"
          hint="Used for M-Pesa payouts when you redeem points."
          value={values.phone}
          onChange={set('phone')}
          error={fieldErrors.phone}
        />

        <PasswordField
          label="Password"
          autoComplete="new-password"
          hint={`At least ${PASSWORD_MIN} characters.`}
          value={values.password}
          onChange={set('password')}
          error={fieldErrors.password}
        />

        <PasswordField
          label="Confirm password"
          autoComplete="new-password"
          value={values.confirm}
          onChange={set('confirm')}
          error={fieldErrors.confirm}
        />

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {submitting ? 'Creating account...' : 'Create account'}
        </button>
      </form>
    </AuthLayout>
  )
}