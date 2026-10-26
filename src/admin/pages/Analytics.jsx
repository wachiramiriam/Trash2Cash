import { useState } from 'react'
import Panel from '../components/Panel'
import PageTitle from '../components/PageTitle'
import AdminStatCard from '../components/AdminStatCard'
import TopAreas from '../components/TopAreas'
import WasteStackedChart from '../components/WasteStackedChart'
import RateTrendChart from '../components/RateTrendChart'
import { WASTE_TYPES } from '../WasteTypes'
import { Loading, ErrorMessage } from '../../components/Status'
import useFetch from '../../hooks/useFetch'
import { getAnalytics } from '../../api'

const ranges = [
  { value: 'weekly', label: 'Last 8 weeks' },
  { value: 'monthly', label: 'Last 6 months' },
]

export default function Analytics() {
  const [range, setRange] = useState('monthly')
  const { data, loading, error } = useFetch(() => getAnalytics(range), [range])
  const rangeLabel = ranges.find((r) => r.value === range).label

  return (
    <div className="space-y-6">
      <PageTitle title="Analytics" subtitle="Trends in what the city collects and recycles">
        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="rounded-lg border border-white/10 bg-ink-800 px-4 py-2 text-sm text-gray-200"
        >
          {ranges.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </PageTitle>

      {loading && <Loading />}
      {error && <ErrorMessage />}
      {!loading && !error && data && <AnalyticsContent data={data} rangeLabel={rangeLabel} />}
    </div>
  )
}

function AnalyticsContent({ data, rangeLabel }) {
  // Everything below is computed from the raw rows
  const totals = WASTE_TYPES.map((t) => ({
    ...t,
    kg: data.reduce((sum, row) => sum + row[t.id], 0),
  }))
  const total = totals.reduce((sum, t) => sum + t.kg, 0)
  const top = [...totals].sort((a, b) => b.kg - a.kg)[0]
  const avgRate = Math.round(data.reduce((sum, row) => sum + row.rate, 0) / data.length)

  return (
    <>
      <section className="grid gap-4 sm:grid-cols-3">
        <AdminStatCard label="Total Collected" value={total.toLocaleString()} unit="kg" footer={rangeLabel} />
        <AdminStatCard label="Avg. Recycling Rate" value={avgRate} unit="%" footer={rangeLabel} />
        <AdminStatCard
          label="Top Material"
          value={top.label}
          footer={`${Math.round((top.kg / total) * 100)}% of everything collected`}
        />
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="Waste Collected by Type" className="lg:col-span-2">
          <WasteStackedChart data={data} />
        </Panel>
        <TopAreas />
      </div>

      <Panel title="Recycling Rate Trend">
        <RateTrendChart data={data} />
      </Panel>
    </>
  )
}