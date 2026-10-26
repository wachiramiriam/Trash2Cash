import { ArrowUp, ArrowDown } from 'lucide-react'

function Trend({ value, label }) {
  const up = value >= 0
  const Icon = up ? ArrowUp : ArrowDown

  return (
    <p className={`mt-3 flex items-center gap-1 text-xs ${up ? 'text-green-400' : 'text-red-400'}`}>
      <Icon size={13} />
      <span className="font-semibold">{Math.abs(value)}</span>
      <span className="text-gray-400">{label}</span>
    </p>
  )
}

export default function AdminStatCard({ label, value, unit, suffix, trend, trendLabel, footer }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-ink-900 p-5">
      <p className="text-sm text-gray-300">{label}</p>

      <p className="mt-3 text-3xl font-bold text-white">
        {value}
        {unit && <span className="ml-1 text-xl font-semibold text-gray-300">{unit}</span>}
        {suffix && <span className="ml-2 text-xl font-semibold text-green-400">{suffix}</span>}
      </p>

      {trend !== undefined && <Trend value={trend} label={trendLabel} />}
      {footer && <p className="mt-3 text-xs text-gray-400">{footer}</p>}
    </div>
  )
}