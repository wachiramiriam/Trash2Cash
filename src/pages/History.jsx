import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import HistoryItem from '../components/HistoryItem'
import { Loading, ErrorMessage } from '../components/Status'
import useFetch from '../hooks/useFetch'
import { getHistory } from '../api'

const filters = [
  { value: 'all', label: 'All Time' },
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
]

export default function History() {
  const [filter, setFilter] = useState('all')
  const { data: items, loading, error } = useFetch(() => getHistory(filter), [filter])

  return (
    <div className="mx-auto max-w-xl space-y-5 p-5">
      <PageHeader title="History" />

      <div className="flex justify-end">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700"
        >
          {filters.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
      </div>

      {loading && <Loading />}
      {error && <ErrorMessage />}

      {items && items.length === 0 && (
        <p className="py-10 text-center text-sm text-gray-400">
          No recycling activity for this period yet.
        </p>
      )}

      {items && items.length > 0 && (
        <div className="space-y-3">
          {items.map((item) => (
            <HistoryItem key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}