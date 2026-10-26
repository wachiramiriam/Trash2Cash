import { ChevronRight } from 'lucide-react'

export default function RewardRow({ title, subtitle, leading, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3 text-left shadow-sm active:bg-gray-50"
    >
      {leading}
      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-900">{title}</p>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>
      <ChevronRight size={18} className="text-gray-400" />
    </button>
  )
}