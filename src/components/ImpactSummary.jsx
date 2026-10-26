import { Sprout } from 'lucide-react'

function Stat({ value, unit, label }) {
  return (
    <div className="flex-1 text-center">
      <p className="text-2xl font-bold">
        {value}
        {unit && <span className="ml-0.5 text-xs font-medium">{unit}</span>}
      </p>
      <p className="mt-0.5 text-[10px] text-white/80">{label}</p>
    </div>
  )
}

export default function ImpactSummary({ wasteKg, co2Kg, trees }) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-brand-600 to-brand-900 p-4 text-white shadow-md">
      <p className="text-sm text-white/90">You are making</p>
      <p className="flex items-center gap-1 text-lg font-bold">
        a real difference! <Sprout size={18} className="text-green-300" />
      </p>

      <div className="mt-4 flex divide-x divide-white/20">
        <Stat value={wasteKg} unit="kg" label="Waste Recycled" />
        <Stat value={co2Kg} unit="kg" label="CO₂ Saved" />
        <Stat value={trees} label="Trees Equivalent" />
      </div>
    </div>
  )
}