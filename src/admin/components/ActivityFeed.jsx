import { Recycle, User, Trash2 } from 'lucide-react'
import Panel from './Panel'
import { Loading, ErrorMessage } from '../../components/Status'
import useFetch from '../../hooks/useFetch'
import { getActivityFeed } from '../../api'

const kinds = {
  detect: { icon: Recycle, style: 'bg-emerald-500/15 text-emerald-400' },
  points: { icon: User, style: 'bg-amber-500/15 text-amber-400' },
  full: { icon: Trash2, style: 'bg-red-500/15 text-red-400' },
}

export default function ActivityFeed() {
  const { data, loading, error } = useFetch(getActivityFeed)

  let body
  if (loading) {
    body = <Loading />
  } else if (error) {
    body = <ErrorMessage />
  } else {
    body = (
      <ul className="max-h-72 divide-y divide-white/5 overflow-y-auto">
        {data.map((item) => {
          const { icon: Icon, style } = kinds[item.kind] ?? kinds.detect

          return (
            <li key={item.id} className="flex items-center gap-3 py-3">
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${style}`}>
                <Icon size={16} />
              </div>
              <p className="flex-1 text-sm text-gray-200">{item.text}</p>
              <span className="shrink-0 text-xs text-gray-400">{item.time}</span>
            </li>
          )
        })}
      </ul>
    )
  }

  return <Panel title="Live Activity Feed">{body}</Panel>
}