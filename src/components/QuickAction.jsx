import { Link } from 'react-router-dom'

export default function QuickAction({ to, icon: Icon, label }) {
  return (
    <Link
      to={to}
      className="flex flex-1 flex-col items-center gap-2 rounded-2xl border border-gray-100 bg-white p-3 text-center shadow-sm active:scale-95 transition"
    >
      <Icon size={24} className="text-brand-500" />
      <span className="text-xs font-medium text-gray-700">{label}</span>
    </Link>
  )
}