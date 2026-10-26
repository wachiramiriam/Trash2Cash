import { getAdminOverview, getWasteByType, getTopAreas, getBins } from '../api'
import { LEVELS } from './binLevels'

// Worded as "Up 12%" rather than "+12%": a cell starting with + would get the
// spreadsheet-safety apostrophe added by csv.js.
const change = (n) => (n >= 0 ? `Up ${n}%` : `Down ${Math.abs(n)}%`)

export async function buildDashboardExport({ levelOf, thresholds }) {
  const [overview, wasteByType, areas, bins] = await Promise.all([
    getAdminOverview(),
    getWasteByType(),
    getTopAreas(),
    getBins(),
  ])

  const totalKg = wasteByType.reduce((sum, d) => sum + d.kg, 0)

  const counts = { high: 0, medium: 0, low: 0 }
  bins.forEach((b) => counts[levelOf(b.fill)]++)

  const rules = {
    high: `${thresholds.high}% full and above`,
    medium: `${thresholds.medium}% to ${thresholds.high - 1}% full`,
    low: `under ${thresholds.medium}% full`,
  }

  return {
    name: 'dashboard-export',
    sections: [
      {
        title: 'Export details',
        headers: ['Item', 'Value'],
        rows: [['Exported on', new Date().toLocaleString('en-GB')]],
      },
      {
        title: 'Dashboard overview',
        headers: ['Metric', 'Value', 'Unit', 'Note'],
        rows: [
          ['Total waste today', overview.totalWasteKg, 'kg', `${change(overview.totalWasteChange)} vs yesterday`],
          ['Active bins', overview.activeBins, 'bins', `${overview.totalBins} bins in total`],
          ['Recycling rate', overview.recyclingRate, '%', `${change(overview.recyclingRateChange)} vs yesterday`],
          ['Total users', overview.totalUsers, 'users', `${overview.newUsers} new users`],
        ],
      },
      {
        title: 'Waste by type',
        headers: ['Material', 'Weight (kg)', 'Share (%)'],
        rows: wasteByType.map((d) => [d.label, d.kg, Math.round((d.kg / totalKg) * 100)]),
      },
      {
        title: 'Top performing areas',
        headers: ['Rank', 'Area', 'Recycling rate (%)'],
        rows: [...areas].sort((a, b) => b.rate - a.rate).map((a, i) => [i + 1, a.name, a.rate]),
      },
      {
        title: 'Bin status summary',
        headers: ['Status', 'Bins', 'Rule'],
        rows: ['high', 'medium', 'low'].map((key) => [LEVELS[key].label, counts[key], rules[key]]),
      },
    ],
  }
}