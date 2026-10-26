import * as mock from '../data/mock'
import * as adminMock from '../data/adminMock'
import { getSessionUser } from './auth'

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms))

const HISTORY_MAX_DAYS = { all: Infinity, today: 0, week: 6 }

export async function getHome() {
  await delay()
  const me = getSessionUser()
  const name = me ? me.name.split(' ')[0] : mock.user.name
  return { user: { ...mock.user, name }, today: mock.today }
}

export async function getProfile() {
  await delay()
  const me = getSessionUser()
  return {
    user: { ...mock.user, name: me ? me.name.split(' ')[0] : mock.user.name },
    profile: me ? { ...mock.profile, fullName: me.name, phone: me.phone } : mock.profile,
  }
}

export async function getImpact(range = 'week') {
  await delay()
  // `range` is accepted now so the signature won't change later.
  // A real API would return different numbers for week/month/all.
  return { summary: mock.impact, weekly: mock.weeklyActivity }
}

export async function getRewards() {
  await delay()
  return {
    points: mock.user.points,
    mpesa: mock.mpesa,
    partners: mock.partners,
  }
}

export async function getHistory(filter = 'all') {
  await delay()
  const maxDays = HISTORY_MAX_DAYS[filter] ?? Infinity
  return mock.history.filter((item) => item.daysAgo <= maxDays)
}

export async function getWasteTypes() {
  await delay(100)
  return mock.wasteTypes
}

export async function submitDrop({ type, kg }) {
  await delay()

  const wasteType = mock.wasteTypes.find((t) => t.id === type)
  if (!wasteType || !(kg > 0)) throw new Error('Invalid drop')

  const points = Math.max(1, Math.round(wasteType.pointsPerKg * kg))
  const time = new Date().toLocaleTimeString('en-KE', {
    hour: '2-digit',
    minute: '2-digit',
  })

  // Mock persistence: mutate the in-memory data so Home and History update.
  // A real backend would do this server-side and we would just return the result.
  mock.user.points += points
  mock.today.itemsRecycled += 1
  mock.today.co2SavedKg = Math.round((mock.today.co2SavedKg + kg * 0.5) * 10) / 10 // placeholder CO₂ factor
  mock.history.unshift({
    id: Date.now(),
    type,
    name: wasteType.itemName,
    kg,
    when: `Today, ${time}`,
    daysAgo: 0,
    points,
  })

  return { points, newBalance: mock.user.points }
}

const PHONE_RE = /^(?:\+?254|0)([17]\d{8})$/
const makeCode = () => Math.random().toString(36).slice(2, 8).toUpperCase()

export async function getRedeemOption(id) {
  await delay(150)
  const balance = mock.user.points

  if (id === 'mpesa') {
    return {
      kind: 'mpesa',
      title: mock.mpesa.label,
      pointsPerKes: mock.mpesa.pointsPerKes,
      balance,
    }
  }

  const partner = mock.partners.find((p) => String(p.id) === id)
  if (!partner) throw new Error('Reward not found')
  return { kind: 'partner', ...partner, balance }
}

export async function redeem({ id, points, phone }) {
  await delay(600)

  if (id === 'mpesa') {
    const { pointsPerKes } = mock.mpesa
    const match = PHONE_RE.exec((phone ?? '').replace(/\s/g, ''))

    if (!match) throw new Error('Enter a valid Kenyan mobile number.')
    if (!Number.isInteger(points) || points < pointsPerKes || points % pointsPerKes !== 0) {
      throw new Error('Invalid amount.')
    }
    if (points > mock.user.points) throw new Error('Not enough points.')

    mock.user.points -= points
    return {
      kind: 'mpesa',
      points,
      kes: points / pointsPerKes,
      phone: `+254${match[1]}`,
      reference: `T2C-${makeCode()}`,
      newBalance: mock.user.points,
    }
  }

  // Partner reward: the cost comes from our data, not from the client
  const partner = mock.partners.find((p) => String(p.id) === id)
  if (!partner) throw new Error('Reward not found')
  if (partner.cost > mock.user.points) throw new Error('Not enough points.')

  mock.user.points -= partner.cost
  return {
    kind: 'partner',
    points: partner.cost,
    reward: partner.reward,
    code: `${partner.name.slice(0, 3).toUpperCase()}-${makeCode()}`,
    newBalance: mock.user.points,
  }
}



export async function getAdminOverview() {
  await delay()
  return adminMock.overview
}

export async function getWasteByType() {
  await delay()
  return adminMock.wasteByType
}

export async function getTopAreas() {
  await delay()
  return adminMock.topAreas
}

export async function getCollectionTrend() {
  await delay()
  return adminMock.collectionTrend
}

export async function getActivityFeed() {
  await delay()
  return adminMock.activityFeed
}

export async function getBins() {
  await delay()
  return adminMock.bins
}

export async function getUsers() {
  await delay()
  return adminMock.users
}

export async function getAdminRewards() {
  await delay()
  return adminMock.adminRewards
}

export async function getAnalytics(range = 'monthly') {
  await delay()
  const data = adminMock.analytics[range]
  if (!data) throw new Error('Unknown range')
  return data
}

const SETTINGS_KEY = 'trash2cash-admin-settings'

// Fill in anything missing, so older saved settings still work if we add fields later
const mergeSettings = (saved) => ({
  profile: { ...adminMock.defaultSettings.profile, ...saved?.profile },
  thresholds: { ...adminMock.defaultSettings.thresholds, ...saved?.thresholds },
  notifications: { ...adminMock.defaultSettings.notifications, ...saved?.notifications },
})

export async function getSettings() {
  await delay(150)
  try {
    return mergeSettings(JSON.parse(localStorage.getItem(SETTINGS_KEY)))
  } catch {
    return mergeSettings(null) // nothing saved, or storage unavailable
  }
}

export async function saveSettings(input) {
  await delay(400)
  const next = mergeSettings(input)

  // Validate here as well as in the form. A real server must never trust the browser.
  const name = String(next.profile.name ?? '').trim()
  const { medium, high } = next.thresholds
  if (!name) throw new Error('Enter your name.')
  if (!Number.isInteger(medium) || !Number.isInteger(high) || medium < 1 || high > 100 || medium >= high) {
    throw new Error('Fill levels must be whole numbers, with Medium lower than High.')
  }

  next.profile = { name, title: String(next.profile.title ?? '').trim() }
  next.notifications = Object.fromEntries(
    Object.entries(next.notifications).map(([key, value]) => [key, Boolean(value)])
  )

  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(next))
  } catch {
    // Private mode or storage full: the settings still apply for this session
  }
  return next
}

