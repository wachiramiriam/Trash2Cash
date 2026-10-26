import { Recycle, TrendingUp, Gift, Trash2, Leaf } from 'lucide-react'
import PointsCard from '../components/PointsCard'
import StatCard from '../components/StatCard'
import QuickAction from '../components/QuickAction'
import { Loading, ErrorMessage } from '../components/Status'
import useFetch from '../hooks/useFetch'
import { getHome } from '../api'

export default function Home() {
  const { data, loading, error } = useFetch(getHome)

  if (loading) return <Loading />
  if (error) return <ErrorMessage />

  const { user, today } = data

  return (
    <div className="space-y-5 p-5 md:p-8">
      {/* Greeting */}
      <header className="flex items-center justify-between pt-2">
        <div>
          <h1 className="text-xl font-bold text-gray-900 md:text-3xl">Hi, {user.name}! 👋</h1>
          <p className="mt-1 text-xs text-gray-500 md:text-sm">
            Together, let's build a cleaner and greener city.
          </p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-lg font-bold text-brand-700">
          {user.name[0]}
        </div>
      </header>

      <div className="grid gap-5 md:grid-cols-2 md:gap-6">
        <PointsCard points={user.points} />

        <section>
          <h2 className="mb-3 text-sm font-semibold text-gray-900">Today's Impact</h2>
          <div className="flex gap-3">
            <StatCard value={today.itemsRecycled} label="Items Recycled" icon={Trash2} />
            <StatCard value={today.co2SavedKg} unit="kg" label="CO₂ Saved" icon={Leaf} />
          </div>
        </section>

        <section className="md:col-span-2">
          <h2 className="mb-3 text-sm font-semibold text-gray-900">Quick Actions</h2>
          <div className="flex gap-3 md:max-w-lg">
            <QuickAction to="/scan" icon={Recycle} label="Scan / Drop" />
            <QuickAction to="/impact" icon={TrendingUp} label="View Impact" />
            <QuickAction to="/rewards" icon={Gift} label="Redeem Rewards" />
          </div>
        </section>
      </div>
    </div>
  )
}