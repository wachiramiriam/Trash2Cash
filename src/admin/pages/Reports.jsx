import { useState } from 'react'
import { FileText, Download } from 'lucide-react'
import Panel from '../components/Panel'
import PageTitle from '../components/PageTitle'
import { reports } from '../reports'
import { downloadCsv } from '../csv'
import { useSettings } from '../SettingsContext'

export default function Reports() {
    const { levelOf } = useSettings()
  const [busyId, setBusyId] = useState(null)
  const [lastRun, setLastRun] = useState({})
  const [error, setError] = useState(null)

  const handleDownload = async (report) => {
    setBusyId(report.id)
    setError(null)
    try {
      const { name, headers, rows } = await report.build({ levelOf })
      downloadCsv(name, headers, rows)
      const time = new Date().toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })
      setLastRun((prev) => ({ ...prev, [report.id]: time }))
    } catch {
      setError('Could not generate that report. Please try again.')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="space-y-6">
      <PageTitle title="Reports" subtitle="Download the current data as spreadsheets" />

      <Panel title="Available Reports">
        {error && <p className="mb-3 text-sm text-red-400">{error}</p>}

        <ul className="divide-y divide-white/5">
          {reports.map((report) => (
            <li key={report.id} className="flex flex-wrap items-center gap-4 py-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-500/15 text-green-400">
                <FileText size={20} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-100">{report.title}</p>
                <p className="text-xs text-gray-400">{report.description}</p>
                {lastRun[report.id] && (
                  <p className="mt-1 text-xs text-green-400">Downloaded at {lastRun[report.id]}</p>
                )}
              </div>

              <button
                onClick={() => handleDownload(report)}
                disabled={busyId === report.id}
                className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-gray-200 hover:bg-white/5 disabled:opacity-50"
              >
                <Download size={16} />
                {busyId === report.id ? 'Preparing...' : 'Download CSV'}
              </button>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  )
}