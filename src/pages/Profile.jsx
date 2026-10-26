import { useNavigate } from 'react-router-dom'
import { History as HistoryIcon, TrendingUp, LogOut } from 'lucide-react'
import RewardRow from '../components/RewardRow'
import { Loading, ErrorMessage } from '../components/Status'
import useFetch from '../hooks/useFetch'
import { getProfile, } from '../api'
import { useAuth } from '../auth/AuthContext'


function LifetimeStat({ value, label }) {
  return (
    <div className="rounded-2xl bg-brand-50 p-4">
      <p className="text-xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  )
}

function MenuIcon({ icon: Icon }) {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100">
      <Icon size={20} className="text-brand-600" />
    </div>
  )
}

export default function Profile() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const { data, loading, error } = useFetch(getProfile)

  if (loading) return <Loading />
  if (error) return <ErrorMessage />

  const { user, profile } = data
  const { lifetime } = profile

  const handleLogout = async () => {
    if (!window.confirm('Log out of Trash2Cash?')) return
    await logout()
  }

  return (
    <div className="mx-auto max-w-xl space-y-5 p-5">
      {/* Identity */}
      <header className="flex flex-col items-center gap-1 pt-4 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-100 text-3xl font-bold text-brand-700">
          {user.name[0]}
        </div>
        <h1 className="mt-2 text-lg font-bold text-gray-900">{profile.fullName}</h1>
        <p className="text-xs text-gray-500">{profile.phone}</p>
        <p className="text-xs text-gray-400">
          {profile.area} · Member since {profile.memberSince}
        </p>
      </header>

      {/* Lifetime stats */}
      <section>
        <h2 className="mb-3 text-sm font-semibold text-gray-900">Lifetime Impact</h2>
        <div className="grid grid-cols-2 gap-3">
          <LifetimeStat value={lifetime.itemsRecycled} label="Items Recycled" />
          <LifetimeStat value={`${lifetime.wasteKg} kg`} label="Waste Recycled" />
          <LifetimeStat value={`${lifetime.co2Kg} kg`} label="CO₂ Saved" />
          <LifetimeStat value={lifetime.pointsEarned.toLocaleString()} label="Points Earned" />
        </div>
      </section>

      {/* Menu */}
      <section className="space-y-3">
        <RewardRow
          title="Recycling History"
          subtitle="See everything you've recycled"
          onClick={() => navigate('/history')}
          leading={<MenuIcon icon={HistoryIcon} />}
        />
        <RewardRow
          title="Your Impact"
          subtitle="Weekly activity and rankings"
          onClick={() => navigate('/impact')}
          leading={<MenuIcon icon={TrendingUp} />}
        />
      </section>

      <button
        onClick={handleLogout}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 py-3 text-sm font-semibold text-red-600 active:bg-red-50"
      >
        <LogOut size={18} />
        Log out
      </button>
    </div>
  )
}