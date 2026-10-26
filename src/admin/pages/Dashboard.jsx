import { useState } from 'react'
import { Download } from 'lucide-react'
import AdminStatCard from '../components/AdminStatCard'
import WasteByType from '../components/WasteByType'
import TopAreas from '../components/TopAreas'
import CollectionTrend from '../components/CollectionTrend'
import ActivityFeed from '../components/ActivityFeed'
import HotspotMap from '../components/HotspotMap'
import { Loading, ErrorMessage } from '../../components/Status'
import { useSettings } from '../SettingsContext'
import { downloadCsvSections } from '../csv'
import { buildDashboardExport } from '../dashboardExport'
import useFetch from '../../hooks/useFetch'
import { getAdminOverview } from '../../api'

const today = new Date().toLocaleDateString('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

export default function Dashboard() {
  const { data: overview, loading, error } = useFetch(getAdminOverview)
  const { levelOf, settings } = useSettings()

  const [exporting, setExporting] = useState(false)
  const [exportError, setExportError] = useState(null)

  const handleExport = async () => {
    setExporting(true)
    setExportError(null)
    try {
      const { name, sections } = await buildDashboardExport({
        levelOf,
        thresholds: settings.thresholds,
      })
      downloadCsvSections(name, sections)
    } catch {
      setExportError('Could not export the data. Please try again.')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
          <p className="mt-1 text-sm text-gray-400">Real-time waste intelligence for a cleaner city</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="rounded-lg border border-white/10 bg-ink-800 px-4 py-2 text-sm text-gray-200">
            {today}
          </span>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
          >
            <Download size={16} />
            {exporting ? 'Exporting...' : 'Export Data'}
          </button>
        </div>
      </div>

      {exportError && <p className="text-sm text-red-400">{exportError}</p>}

      {loading && <Loading />}
      {error && <ErrorMessage />}

      {overview && (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <AdminStatCard
            label="Total Waste Today"
            value={overview.totalWasteKg.toLocaleString()}
            unit="kg"
            trend={overview.totalWasteChange}
            trendLabel="% from yesterday"
          />
          <AdminStatCard
            label="Active Bins"
            value={overview.activeBins}
            suffix={`/ ${overview.totalBins}`}
            footer="Online"
          />
          <AdminStatCard
            label="Recycling Rate"
            value={overview.recyclingRate}
            unit="%"
            trend={overview.recyclingRateChange}
            trendLabel="% from yesterday"
          />
          <AdminStatCard
            label="Total Users"
            value={overview.totalUsers.toLocaleString()}
            trend={overview.newUsers}
            trendLabel="new users"
          />
        </section>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <HotspotMap />
          <ActivityFeed />
        </div>

        <div className="space-y-4">
          <WasteByType />
          <TopAreas />
          <CollectionTrend />
        </div>
      </div>
    </div>
  )
}