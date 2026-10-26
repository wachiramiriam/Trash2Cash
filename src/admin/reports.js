import { getWasteByType, getBins, getUsers, getAdminRewards, getTopAreas } from '../api'
import { LEVELS, areaOf } from './binLevels'

export const reports = [
  {
    id: 'waste',
    title: 'Waste by Type',
    description: 'Weight and share of each material collected today.',
    async build({ levelOf }) {
      const data = await getWasteByType()
      const total = data.reduce((sum, d) => sum + d.kg, 0)
      return {
        name: 'waste-by-type',
        headers: ['Material', 'Weight (kg)', 'Share (%)'],
        rows: data.map((d) => [d.label, d.kg, Math.round((d.kg / total) * 100)]),
      }
    },
  },
  {
    id: 'bins',
    title: 'Bin Status',
    description: 'Every bin with its area, fill level and status, fullest first.',
    async build() {
      const bins = await getBins()
      return {
        name: 'bin-status',
        headers: ['Bin', 'Area', 'Fill level (%)', 'Status', 'Type'],
        rows: [...bins]
          .sort((a, b) => b.fill - a.fill)
          .map((b) => [
            b.name,
            areaOf(b),
            b.fill,
            LEVELS[levelOf(b.fill)].label,
            b.smart ? 'Smart' : 'Standard',
          ]),
      }
    },
  },
  {
    id: 'areas',
    title: 'Area Performance',
    description: 'Recycling rate for each area, best first.',
    async build() {
      const areas = await getTopAreas()
      return {
        name: 'area-performance',
        headers: ['Rank', 'Area', 'Recycling rate (%)'],
        rows: [...areas].sort((a, b) => b.rate - a.rate).map((a, i) => [i + 1, a.name, a.rate]),
      }
    },
  },
  {
    id: 'users',
    title: 'User Activity',
    description: 'Items, weight and points per user. Contains personal data.',
    async build() {
      const users = await getUsers()
      return {
        name: 'user-activity',
        headers: ['Name', 'Area', 'Items recycled', 'Waste (kg)', 'Points', 'Joined'],
        rows: users.map((u) => [u.name, u.area, u.items, u.kg, u.points, u.joined]),
      }
    },
  },
  {
    id: 'redemptions',
    title: 'Recent Redemptions',
    description: 'M-Pesa cash-outs and partner vouchers. Contains personal data.',
    async build() {
      const { recent } = await getAdminRewards()
      return {
        name: 'redemptions',
        headers: ['User', 'Type', 'Reward', 'Points', 'Time'],
        rows: recent.map((r) => [
          r.user,
          r.kind === 'mpesa' ? 'M-Pesa cash-out' : 'Partner voucher',
          r.label,
          r.points,
          r.time,
        ]),
      }
    },
  },
]