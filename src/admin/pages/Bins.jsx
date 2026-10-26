import { useState } from 'react'
import { Search } from 'lucide-react'
import Panel from '../components/Panel'
import PageTitle from '../components/PageTitle'
import LevelBadge from '../components/LevelBadge'
import { LEVELS, areaOf } from '../binLevels'
import { useSettings } from '../SettingsContext'
import { Loading, ErrorMessage } from '../../components/Status'
import useFetch from '../../hooks/useFetch'
import { getBins } from '../../api'

export default function Bins() {
  const { levelOf } = useSettings()
  const { data: bins, loading, error } = useFetch(getBins)
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')

  let body
  if (loading) {
    body = <Loading />
  } else if (error) {
    body = <ErrorMessage />
  } else {
    const counts = { all: bins.length, high: 0, medium: 0, low: 0 }
    bins.forEach((b) => counts[levelOf(b.fill)]++)

    const q = query.trim().toLowerCase()
    const visible = bins
      .filter((b) => filter === 'all' || levelOf(b.fill) === filter)
      .filter((b) => `${b.name} ${areaOf(b)}`.toLowerCase().includes(q))
      .sort((a, b) => b.fill - a.fill)

    const chips = [
      { value: 'all', label: 'All' },
      ...Object.entries(LEVELS).map(([value, { label }]) => ({ value, label })),
    ]

    body = (
      <>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {chips.map((c) => (
              <button
                key={c.value}
                onClick={() => setFilter(c.value)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                  filter === c.value
                    ? 'border-green-500 bg-green-500/15 text-green-400'
                    : 'border-white/10 text-gray-400 hover:text-gray-200'
                }`}
              >
                {c.label} ({counts[c.value]})
              </button>
            ))}
          </div>

          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search bin or area"
              className="w-56 rounded-lg border border-white/10 bg-ink-800 py-2 pl-9 pr-3 text-sm text-gray-200 placeholder:text-gray-500"
            />
          </div>
        </div>

        {visible.length === 0 ? (
          <p className="py-10 text-center text-sm text-gray-400">No bins match your search.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[34rem] text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-gray-400">
                <tr className="border-b border-white/10">
                  <th className="py-2 pr-4 font-medium">Bin</th>
                  <th className="py-2 pr-4 font-medium">Area</th>
                  <th className="py-2 pr-4 font-medium">Fill level</th>
                  <th className="py-2 pr-4 font-medium">Status</th>
                  <th className="py-2 font-medium">Type</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((bin) => (
                  <tr key={bin.id} className="border-b border-white/5 last:border-0">
                    <td className="py-3 pr-4 font-medium text-gray-200">{bin.name}</td>
                    <td className="py-3 pr-4 text-gray-400">{areaOf(bin)}</td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-24 overflow-hidden rounded-full bg-white/10">
                          <div
                            className={`h-full rounded-full ${LEVELS[levelOf(bin.fill)].bar}`}
                            style={{ width: `${bin.fill}%` }}
                          />
                        </div>
                        <span className="w-9 text-gray-300">{bin.fill}%</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <LevelBadge fill={bin.fill} />
                    </td>
                    <td className="py-3 text-gray-400">{bin.smart ? 'Smart' : 'Standard'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </>
    )
  }

  return (
    <div className="space-y-6">
      <PageTitle title="Bins" subtitle="Every bin in the network and how full it is" />
      <Panel title="All Bins">{body}</Panel>
    </div>
  )
}