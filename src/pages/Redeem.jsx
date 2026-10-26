import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CheckCircle2, Minus, Plus } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { Loading, ErrorMessage } from '../components/Status'
import useFetch from '../hooks/useFetch'
import { getRedeemOption, redeem } from '../api'

const PHONE_RE = /^(?:\+?254|0)[17]\d{8}$/

function SummaryRow({ label, value }) {
  return (
    <div className="flex justify-between py-2 text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-semibold text-gray-900">{value}</span>
    </div>
  )
}

export default function Redeem() {
  const { rewardId } = useParams()
  const { data: option, loading, error } = useFetch(() => getRedeemOption(rewardId), [rewardId])

  const [stage, setStage] = useState('form') // 'form' | 'review' | 'done'
  const [points, setPoints] = useState(100) // M-Pesa only
  const [phone, setPhone] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [result, setResult] = useState(null)

  if (loading) return <Loading />
  if (error || !option) return <ErrorMessage message="Reward not found." />

  const isMpesa = option.kind === 'mpesa'
  const step = option.pointsPerKes ?? 100
  const maxPoints = Math.floor(option.balance / step) * step
  const cost = isMpesa ? points : option.cost
  const shortBy = cost - option.balance
  const canAfford = shortBy <= 0
  const phoneOk = !isMpesa || PHONE_RE.test(phone.replace(/\s/g, ''))
  const valid = canAfford && phoneOk

  const adjust = (delta) =>
    setPoints((p) => Math.max(step, Math.min(maxPoints, p + delta)))

  const handleConfirm = async () => {
    setSubmitting(true)
    setSubmitError(null)
    try {
      setResult(await redeem({ id: rewardId, points: cost, phone }))
      setStage('done')
    } catch (err) {
      setSubmitError(err.message)
      setStage('form')
    } finally {
      setSubmitting(false)
    }
  }

  /* ---------- Success ---------- */
  if (stage === 'done') {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 p-8 text-center">
        <CheckCircle2 size={64} className="text-brand-500" />
        <h1 className="text-xl font-bold text-gray-900">Redeemed!</h1>

        {result.kind === 'mpesa' ? (
          <>
            <p className="text-3xl font-bold text-brand-600">KES {result.kes}</p>
            <p className="text-sm text-gray-500">is on its way to {result.phone}</p>
            <p className="text-xs text-gray-400">Ref: {result.reference}</p>
          </>
        ) : (
          <>
            <p className="text-2xl font-bold text-brand-600">{result.reward}</p>
            <p className="text-sm text-gray-500">Show this code at {option.name}</p>
            <p className="rounded-xl bg-brand-50 px-5 py-2 font-mono text-lg font-bold tracking-widest text-brand-700">
              {result.code}
            </p>
          </>
        )}

        <p className="mt-2 text-sm text-gray-500">
          New balance: {result.newBalance.toLocaleString()} PTS
        </p>

        <div className="mt-4 flex w-full gap-3">
          <Link
            to="/rewards"
            className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-700 active:bg-gray-50"
          >
            More rewards
          </Link>
          <Link
            to="/"
            className="flex-1 rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white active:bg-brand-700"
          >
            Done
          </Link>
        </div>
      </div>
    )
  }

  /* ---------- Review ---------- */
  if (stage === 'review') {
    return (
      <div className="mx-auto max-w-xl space-y-5 p-5">
        <PageHeader title="Confirm" />

        <div className="divide-y divide-gray-100 rounded-2xl border border-gray-100 p-4">
          <SummaryRow label="Reward" value={isMpesa ? 'M-Pesa cash' : option.name} />
          <SummaryRow label="Points used" value={`${cost.toLocaleString()} PTS`} />
          <SummaryRow
            label="You get"
            value={isMpesa ? `KES ${cost / step}` : option.reward}
          />
          {isMpesa && <SummaryRow label="Send to" value={phone} />}
          <SummaryRow
            label="Balance after"
            value={`${(option.balance - cost).toLocaleString()} PTS`}
          />
        </div>

        <p className="text-center text-xs text-gray-400">This can't be undone once confirmed.</p>

        <div className="flex gap-3">
          <button
            onClick={() => setStage('form')}
            disabled={submitting}
            className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-700"
          >
            Back
          </button>
          <button
            onClick={handleConfirm}
            disabled={submitting}
            className="flex-1 rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white disabled:bg-gray-300"
          >
            {submitting ? 'Processing...' : 'Confirm'}
          </button>
        </div>
      </div>
    )
  }

  /* ---------- Form ---------- */
  return (
    <div className="mx-auto max-w-xl space-y-5 p-5">
      <PageHeader title={isMpesa ? 'M-Pesa Cash' : option.name} />

      <p className="text-center text-sm text-gray-500">
        Your balance: <span className="font-semibold text-gray-900">{option.balance.toLocaleString()} PTS</span>
      </p>

      {isMpesa ? (
        <>
          <section className="rounded-2xl bg-brand-50 p-4 text-center">
            <div className="flex items-center justify-center gap-5">
              <button
                onClick={() => adjust(-step)}
                className="rounded-full bg-white p-2 shadow-sm active:scale-95"
                aria-label="Decrease"
              >
                <Minus size={18} />
              </button>
              <p className="text-3xl font-bold text-gray-900">
                {points.toLocaleString()}
                <span className="ml-1 text-sm font-medium text-gray-500">PTS</span>
              </p>
              <button
                onClick={() => adjust(step)}
                className="rounded-full bg-white p-2 shadow-sm active:scale-95"
                aria-label="Increase"
              >
                <Plus size={18} />
              </button>
            </div>
            <p className="mt-2 text-lg font-semibold text-brand-600">= KES {points / step}</p>
            <button
              onClick={() => setPoints(Math.max(step, maxPoints))}
              className="mt-2 text-xs font-medium text-brand-700 underline"
            >
              Use maximum
            </button>
          </section>

          <section>
            <h2 className="mb-2 text-sm font-semibold text-gray-900">M-Pesa number</h2>
            <input
              type="tel"
              inputMode="tel"
              placeholder="07XX XXX XXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm"
            />
            {phone && !phoneOk && (
              <p className="mt-1 text-xs text-red-500">Enter a valid Kenyan mobile number.</p>
            )}
          </section>
        </>
      ) : (
        <section className="space-y-2 rounded-2xl bg-brand-50 p-5 text-center">
          <p className="text-2xl font-bold text-brand-600">{option.reward}</p>
          <p className="text-sm text-gray-600">at {option.name}</p>
          <p className="text-sm font-semibold text-gray-900">{option.cost} PTS</p>
        </section>
      )}

      {!canAfford && (
        <p className="text-center text-xs text-red-500">
          You need {shortBy.toLocaleString()} more points for this.
        </p>
      )}
      {submitError && <p className="text-center text-xs text-red-500">{submitError}</p>}

      <button
        onClick={() => setStage('review')}
        disabled={!valid}
        className="w-full rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white disabled:bg-gray-300"
      >
        Continue
      </button>
    </div>
  )
}