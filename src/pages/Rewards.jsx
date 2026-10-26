import { useNavigate } from 'react-router-dom'
import { Gift, Banknote } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import PointsCard from '../components/PointsCard'
import RewardRow from '../components/RewardRow'
import { Loading, ErrorMessage } from '../components/Status'
import useFetch from '../hooks/useFetch'
import { getRewards } from '../api'

export default function Rewards() {
  const navigate = useNavigate()
  const { data, loading, error } = useFetch(getRewards)

  if (loading) return <Loading />
  if (error) return <ErrorMessage />

  const { points, mpesa, partners } = data

  return (
    <div className="space-y-5 p-5 md:p-8">
      <PageHeader title="Redeem Rewards" />

      <div className="md:max-w-md">
        <PointsCard points={points} label="Your Points" icon={Gift} iconClass="text-yellow-300" />
      </div>

      <div className="grid gap-5 md:grid-cols-2 md:gap-8">
        <section>
          <h2 className="mb-3 text-sm font-semibold text-gray-900">Redeem via M-Pesa</h2>
          <RewardRow
            title={mpesa.label}
            subtitle={mpesa.rate}
            onClick={() => navigate('/redeem/mpesa')}
            leading={
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100">
                <Banknote size={20} className="text-brand-600" />
              </div>
            }
          />
        </section>

        <section>
          <h2 className="mb-3 text-sm font-semibold text-gray-900">Partner Rewards</h2>
          <div className="space-y-3">
            {partners.map((p) => (
              <RewardRow
                key={p.id}
                title={p.name}
                subtitle={p.offer}
                onClick={() => navigate(`/redeem/${p.id}`)}
                leading={
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white ${p.color}`}
                  >
                    {p.initial}
                  </div>
                }
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}