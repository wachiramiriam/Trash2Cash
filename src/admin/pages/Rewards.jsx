import { Banknote, Gift } from 'lucide-react'
import Panel from '../components/Panel'
import PageTitle from '../components/PageTitle'
import AdminStatCard from '../components/AdminStatCard'
import { Loading, ErrorMessage } from '../../components/Status'
import useFetch from '../../hooks/useFetch'
import { getAdminRewards } from '../../api'

const recentStyle = {
  mpesa: { icon: Banknote, style: 'bg-emerald-500/15 text-emerald-400' },
  partner: { icon: Gift, style: 'bg-amber-500/15 text-amber-400' },
}

export default function Rewards() {
  const { data, loading, error } = useFetch(getAdminRewards)

  return (
    <div className="space-y-6">
      <PageTitle title="Rewards" subtitle="How points are being redeemed" />

      {loading && <Loading />}
      {error && <ErrorMessage />}

      {data && <RewardsContent data={data} />}
    </div>
  )
}

function RewardsContent({ data }) {
  const { mpesa, offers, recent } = data

  // Computed from the raw numbers so there is one source of truth
  const voucherCount = offers.reduce((sum, o) => sum + o.redeemed, 0)
  const voucherPoints = offers.reduce((sum, o) => sum + o.redeemed * o.cost, 0)
  const pointsRedeemed = mpesa.pointsConverted + voucherPoints
  const kesPaid = mpesa.pointsConverted / mpesa.pointsPerKes
  const activeOffers = offers.filter((o) => o.active).length

  return (
    <>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard label="Points Redeemed" value={pointsRedeemed.toLocaleString()} unit="PTS" footer="This month" />
        <AdminStatCard label="M-Pesa Payouts" value={`KES ${kesPaid.toLocaleString()}`} footer="This month" />
        <AdminStatCard label="Vouchers Issued" value={voucherCount} footer="This month" />
        <AdminStatCard label="Active Offers" value={activeOffers} suffix={`/ ${offers.length}`} footer="Partner offers" />
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="Partner Offers" className="lg:col-span-2">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[30rem] text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-gray-400">
                <tr className="border-b border-white/10">
                  <th className="py-2 pr-4 font-medium">Partner</th>
                  <th className="py-2 pr-4 font-medium">Reward</th>
                  <th className="py-2 pr-4 text-right font-medium">Cost</th>
                  <th className="py-2 pr-4 text-right font-medium">Redeemed</th>
                  <th className="py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {offers.map((o) => (
                  <tr key={o.id} className="border-b border-white/5 last:border-0">
                    <td className="py-3 pr-4 font-medium text-gray-200">{o.partner}</td>
                    <td className="py-3 pr-4 text-gray-400">{o.reward}</td>
                    <td className="py-3 pr-4 text-right text-gray-300">{o.cost} PTS</td>
                    <td className="py-3 pr-4 text-right text-gray-300">{o.redeemed}</td>
                    <td className="py-3">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          o.active ? 'bg-emerald-500/15 text-emerald-400' : 'bg-gray-500/20 text-gray-400'
                        }`}
                      >
                        {o.active ? 'Active' : 'Paused'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title="Recent Redemptions">
          <ul className="divide-y divide-white/5">
            {recent.map((r) => {
              const { icon: Icon, style } = recentStyle[r.kind] ?? recentStyle.partner

              return (
                <li key={r.id} className="flex items-center gap-3 py-3">
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${style}`}>
                    <Icon size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-gray-200">
                      {r.user}{' '}
                      <span className="text-gray-400">
                        {r.kind === 'mpesa' ? 'cashed out' : 'redeemed'} {r.label}
                      </span>
                    </p>
                    <p className="text-xs text-gray-500">{r.time}</p>
                  </div>
                  <span className="shrink-0 text-xs font-medium text-gray-300">-{r.points.toLocaleString()} PTS</span>
                </li>
              )
            })}
          </ul>
        </Panel>
      </div>
    </>
  )
}