import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import ScanViewfinder from '../components/ScanViewfinder'
import { Loading, ErrorMessage } from '../components/Status'
import useFetch from '../hooks/useFetch'
import { getWasteTypes, submitDrop } from '../api'

export default function Scan() {
  const { data: types, loading, error } = useFetch(getWasteTypes)

  const [type, setType] = useState(null)
  const [kg, setKg] = useState('0.2')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [result, setResult] = useState(null)

  const weight = parseFloat(kg)
  const selected = types?.find((t) => t.id === type)
  const valid = Boolean(selected) && weight > 0 && weight <= 50
  const preview = valid ? Math.max(1, Math.round(selected.pointsPerKg * weight)) : 0

  const handleSubmit = async () => {
    setSubmitting(true)
    setSubmitError(null)
    try {
      setResult(await submitDrop({ type, kg: weight }))
    } catch {
      setSubmitError('Could not log your drop. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const reset = () => {
    setResult(null)
    setType(null)
    setKg('0.2')
  }

  if (loading) return <Loading />
  if (error) return <ErrorMessage />

  // Success state
  if (result) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-8 text-center">
        <CheckCircle2 size={64} className="text-brand-500" />
        <h1 className="text-xl font-bold text-gray-900">Drop logged!</h1>
        <p className="text-3xl font-bold text-brand-600">+{result.points} PTS</p>
        <p className="text-sm text-gray-500">
          New balance: {result.newBalance.toLocaleString()} PTS
        </p>
        <div className="mt-4 flex w-full gap-3">
          <button
            onClick={reset}
            className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-700 active:bg-gray-50"
          >
            Log another
          </button>
          <Link
            to="/"
            className="flex-1 rounded-xl bg-brand-600 py-3 text-center text-sm font-semibold text-white active:bg-brand-700"
          >
            Done
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-xl space-y-5 p-5">
      <PageHeader title="Scan / Drop" />

      <ScanViewfinder />
      <p className="text-center text-xs text-gray-500">
        Point your camera at the QR code on the bin
      </p>

      <div className="flex items-center gap-3 text-xs text-gray-400">
        <span className="h-px flex-1 bg-gray-200" />
        or log a drop manually
        <span className="h-px flex-1 bg-gray-200" />
      </div>

      {/* Material */}
      <section>
        <h2 className="mb-2 text-sm font-semibold text-gray-900">Material</h2>
        <div className="grid grid-cols-3 gap-2">
          {types.map((t) => (
            <button
              key={t.id}
              onClick={() => setType(t.id)}
              className={`rounded-xl border py-2 text-xs font-medium transition ${
                type === t.id
                  ? 'border-brand-600 bg-brand-50 text-brand-700'
                  : 'border-gray-200 text-gray-600'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </section>

      {/* Weight */}
      <section>
        <h2 className="mb-2 text-sm font-semibold text-gray-900">Weight (kg)</h2>
        <input
          type="number"
          inputMode="decimal"
          min="0.1"
          max="50"
          step="0.1"
          value={kg}
          onChange={(e) => setKg(e.target.value)}
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm"
        />
      </section>

      {submitError && <p className="text-center text-xs text-red-500">{submitError}</p>}

      <button
        onClick={handleSubmit}
        disabled={!valid || submitting}
        className="w-full rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white disabled:bg-gray-300"
      >
        {submitting ? 'Logging...' : valid ? `Log drop (+${preview} PTS)` : 'Log drop'}
      </button>
    </div>
  )
}