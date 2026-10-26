import { Coins } from 'lucide-react'

export default function PointsCard({
  points,
  label = 'Your Points Balance',
  icon: Icon = Coins,
  iconClass = 'text-yellow-300',
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-gradient-to-br from-brand-600 to-brand-900 p-4 text-white shadow-md">
      <div>
        <p className="text-sm text-white/80">{label}</p>
        <p className="mt-1 text-4xl font-bold">
          {points.toLocaleString()}
          <span className="ml-1 text-sm font-medium text-white/80">PTS</span>
        </p>
      </div>
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/15">
        <Icon size={30} className={iconClass} />
      </div>
    </div>
  )
}