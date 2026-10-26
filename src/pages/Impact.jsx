import { useState } from 'react'
import { Leaf } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import ImpactSummary from '../components/ImpactSummary'
import WeeklyChart from '../components/WeeklyChart'
import { Loading, ErrorMessage } from '../components/Status'
import useFetch from '../hooks/useFetch'
import { getImpact } from '../api'

export default function Impact() {
  const [range, setRange] = useState('week')
  const { data, loading, error } = useFetch(() => getImpact(range), [range])

  return (
    <div className="space-y-5 p-5 md:p-8">
      <PageHeader title="Your Impact" />

      <div className="flex justify-end">
        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700"
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="all">All Time</option>
        </select>
      </div>

      {loading && <Loading />}
      {error && <ErrorMessage />}

      {data && (
        <div className="grid gap-5 md:grid-cols-2 md:gap-6">
          <ImpactSummary
            wasteKg={data.summary.wasteRecycledKg}
            co2Kg={data.summary.co2SavedKg}
            trees={data.summary.trees}
          />

          <section className="md:row-span-2">
            <h2 className="mb-2 text-sm font-semibold text-gray-900">Your Weekly Activity</h2>
            <WeeklyChart data={data.weekly} />
          </section>

          <div className="flex items-center gap-3 rounded-2xl bg-brand-50 p-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100">
              <Leaf size={20} className="text-brand-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-900">
                Great job! You're in the top {data.summary.topPercent}%
              </p>
              <p className="text-[11px] text-gray-500">of active recyclers in your area.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}