import Panel from './Panel'
import { Loading, ErrorMessage } from '../../components/Status'
import useFetch from '../../hooks/useFetch'
import { getTopAreas } from '../../api'

// Bar color reflects how good the rate is
const barColor = (rate) => {
  if (rate >= 80) return 'bg-emerald-500'
  if (rate >= 65) return 'bg-lime-500'
  if (rate >= 50) return 'bg-amber-500'
  return 'bg-red-500'
}

export default function TopAreas() {
  const { data, loading, error } = useFetch(getTopAreas)

  let body
  if (loading) {
    body = <Loading />
  } else if (error) {
    body = <ErrorMessage />
  } else {
    // Highest first, regardless of the order the API returns them in
    const areas = [...data].sort((a, b) => b.rate - a.rate)

    body = (
      <ol className="space-y-3">
        {areas.map((area, i) => (
          <li
            key={area.id}
            className="grid grid-cols-[1.25rem_6rem_1fr_2.5rem] items-center gap-3 text-sm"
          >
            <span className="text-gray-400">{i + 1}</span>
            <span className="truncate text-gray-200">{area.name}</span>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className={`h-full rounded-full ${barColor(area.rate)}`}
                style={{ width: `${area.rate}%` }}
              />
            </div>
            <span className="text-right text-gray-300">{area.rate}%</span>
          </li>
        ))}
      </ol>
    )
  }

  return <Panel title="Top Performing Areas">{body}</Panel>
}