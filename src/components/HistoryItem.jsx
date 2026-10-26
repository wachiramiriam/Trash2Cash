import { GlassWater, Cylinder, FileText, Wine, Leaf } from 'lucide-react'

const icons = {
  plastic: GlassWater,
  metal: Cylinder,
  paper: FileText,
  glass: Wine,
  organic: Leaf,
}

export default function HistoryItem({ item }) {
  const Icon = icons[item.type] ?? Leaf

  return (
    <div className="flex items-center gap-3 rounded-2xl bg-gray-50 p-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-100">
        <Icon size={20} className="text-brand-600" />
      </div>

      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-900">{item.name}</p>
        <p className="text-xs text-gray-500">
          {item.kg} kg · {item.when}
        </p>
      </div>

      <p className="text-xs font-semibold text-brand-600">+{item.points} PTS</p>
    </div>
  )
}