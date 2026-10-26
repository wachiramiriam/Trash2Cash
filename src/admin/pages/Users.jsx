import { useState } from 'react'
import { Search } from 'lucide-react'
import Panel from '../components/Panel'
import PageTitle from '../components/PageTitle'
import { Loading, ErrorMessage } from '../../components/Status'
import useFetch from '../../hooks/useFetch'
import { getUsers } from '../../api'

const sorters = {
  points: (a, b) => b.points - a.points,
  recycled: (a, b) => b.kg - a.kg,
  newest: (a, b) => new Date(b.joined) - new Date(a.joined),
}

const formatJoined = (iso) =>
  new Date(iso).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })

export default function Users() {
  const { data: users, loading, error } = useFetch(getUsers)
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('points')

  let body
  if (loading) {
    body = <Loading />
  } else if (error) {
    body = <ErrorMessage />
  } else {
    const q = query.trim().toLowerCase()
    const visible = users
      .filter((u) => `${u.name} ${u.area}`.toLowerCase().includes(q))
      .sort(sorters[sort])

    body = (
      <>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name or area"
              className="w-60 rounded-lg border border-white/10 bg-ink-800 py-2 pl-9 pr-3 text-sm text-gray-200 placeholder:text-gray-500"
            />
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-lg border border-white/10 bg-ink-800 px-3 py-2 text-sm text-gray-200"
          >
            <option value="points">Most points</option>
            <option value="recycled">Most recycled</option>
            <option value="newest">Newest</option>
          </select>
        </div>

        {visible.length === 0 ? (
          <p className="py-10 text-center text-sm text-gray-400">No users match your search.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[40rem] text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-gray-400">
                <tr className="border-b border-white/10">
                  <th className="py-2 pr-4 font-medium">User</th>
                  <th className="py-2 pr-4 font-medium">Area</th>
                  <th className="py-2 pr-4 text-right font-medium">Items</th>
                  <th className="py-2 pr-4 text-right font-medium">Waste (kg)</th>
                  <th className="py-2 pr-4 text-right font-medium">Points</th>
                  <th className="py-2 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((u) => (
                  <tr key={u.id} className="border-b border-white/5 last:border-0">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-600/30 text-xs font-bold text-green-300">
                          {u.name[0]}
                        </div>
                        <span className="font-medium text-gray-200">{u.name}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-gray-400">{u.area}</td>
                    <td className="py-3 pr-4 text-right text-gray-300">{u.items}</td>
                    <td className="py-3 pr-4 text-right text-gray-300">{u.kg.toFixed(1)}</td>
                    <td className="py-3 pr-4 text-right font-semibold text-green-400">
                      {u.points.toLocaleString()}
                    </td>
                    <td className="py-3 text-gray-400">{formatJoined(u.joined)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="mt-4 text-xs text-gray-500">
          Showing {visible.length} of {users.length} sample users
        </p>
      </>
    )
  }

  return (
    <div className="space-y-6">
      <PageTitle title="Users" subtitle="People recycling with Trash2Cash" />
      <Panel title="All Users">{body}</Panel>
    </div>
  )
}