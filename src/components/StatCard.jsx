export default function StatCard({ value, unit, label, icon: Icon }) {
  return (
    <div className="flex flex-1 items-center justify-between rounded-2xl bg-brand-50 p-4">
      <div>
        <p className="text-2xl font-bold text-gray-900">
          {value}
          {unit && <span className="ml-1 text-sm font-medium">{unit}</span>}
        </p>
        <p className="text-xs text-gray-500">{label}</p>
      </div>
      <Icon size={22} className="text-brand-500" />
    </div>
  )
}