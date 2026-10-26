import HotspotMap from '../components/HotspotMap'
import Panel from '../components/Panel'
import PageTitle from '../components/PageTitle'
import LevelBadge from '../components/LevelBadge'
import { areaOf, } from '../binLevels'
import { useSettings } from '../SettingsContext'
import { Loading, ErrorMessage } from '../../components/Status'
import useFetch from '../../hooks/useFetch'
import { getBins } from '../../api'

function NeedsAttention() {
  const { levelOf } = useSettings()
  const { data: bins, loading, error } = useFetch(getBins)

  let body
  if (loading) {
    body = <Loading />
  } else if (error) {
    body = <ErrorMessage />
  } else {
    const urgent = bins.filter((b) => levelOf(b.fill) === 'high').sort((a, b) => b.fill - a.fill)

    body =
      urgent.length === 0 ? (
        <p className="py-4 text-center text-sm text-gray-400">No bins need collection right now.</p>
      ) : (
        <ul className="divide-y divide-white/5">
          {urgent.map((bin) => (
            <li key={bin.id} className="flex items-center gap-3 py-3 text-sm">
              <span className="flex-1 font-medium text-gray-200">{bin.name}</span>
              <span className="hidden text-gray-400 sm:inline">{areaOf(bin)}</span>
              <span className="w-12 text-right text-gray-300">{bin.fill}%</span>
              <LevelBadge fill={bin.fill} />
            </li>
          ))}
        </ul>
      )
  }

  return <Panel title="Needs Attention">{body}</Panel>
}

export default function LiveMap() {
  return (
    <div className="space-y-6">
      <PageTitle title="Live Map" subtitle="Where bins are filling up across the city" />
      <HotspotMap title="City Bin Map" heightClass="h-[60vh]" scrollZoom />
      <NeedsAttention />
    </div>
  )
}