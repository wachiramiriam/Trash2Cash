import { useId, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

export default function FormField({ label, error, hint, trailing, ...inputProps }) {
  const id = useId()
  const noteId = error ? `${id}-error` : hint ? `${id}-hint` : undefined

  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          aria-invalid={Boolean(error)}
          aria-describedby={noteId}
          className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition focus:ring-2 ${
            error
              ? 'border-red-400 focus:ring-red-200'
              : 'border-gray-200 focus:border-brand-500 focus:ring-brand-500/20'
          } ${trailing ? 'pr-11' : ''}`}
          {...inputProps}
        />
        {trailing}
      </div>

      {error ? (
        <p id={noteId} className="mt-1 text-xs text-red-500">
          {error}
        </p>
      ) : (
        hint && (
          <p id={noteId} className="mt-1 text-xs text-gray-400">
            {hint}
          </p>
        )
      )}
    </div>
  )
}

export function PasswordField(props) {
  const [show, setShow] = useState(false)

  return (
    <FormField
      {...props}
      type={show ? 'text' : 'password'}
      trailing={
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? 'Hide password' : 'Show password'}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      }
    />
  )
}