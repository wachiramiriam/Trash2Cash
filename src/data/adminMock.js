export const overview = {
  totalWasteKg: 1248,
  totalWasteChange: 12, // % vs yesterday
  activeBins: 112,
  totalBins: 120,
  recyclingRate: 68,
  recyclingRateChange: 8, // % vs yesterday
  totalUsers: 2543,
  newUsers: 132,
}

export const wasteByType = [
  { id: 'plastic', label: 'Plastic', kg: 562, color: '#3b82f6' },
  { id: 'organic', label: 'Organic', kg: 374, color: '#22c55e' },
  { id: 'paper', label: 'Paper', kg: 187, color: '#84cc16' },
  { id: 'metal', label: 'Metal', kg: 87, color: '#f59e0b' },
  { id: 'glass', label: 'Glass', kg: 38, color: '#14b8a6' },
]

export const topAreas = [
  { id: 1, name: 'Westlands', rate: 85 },
  { id: 2, name: 'Kileleshwa', rate: 72 },
  { id: 3, name: 'Karen', rate: 68 },
  { id: 4, name: "Lang'ata", rate: 59 },
  { id: 5, name: 'Kibera', rate: 40 },
]

export const collectionTrend = [
  { day: 'Mon', kg: 420 },
  { day: 'Tue', kg: 760 },
  { day: 'Wed', kg: 880 },
  { day: 'Thu', kg: 1040 },
  { day: 'Fri', kg: 1180 },
  { day: 'Sat', kg: 1480 },
  { day: 'Sun', kg: 1250 },
]

// kind: 'detect' | 'points' | 'full'
export const activityFeed = [
  { id: 1, kind: 'detect', text: 'Bin Westlands-05 detected Plastic Waste', time: '10:45 AM' },
  { id: 2, kind: 'points', text: 'User Phoenix earned 10 points', time: '10:44 AM' },
  { id: 3, kind: 'detect', text: 'Bin Kibera-02 detected Organic Waste', time: '10:43 AM' },
  { id: 4, kind: 'points', text: 'User Mercy earned 8 points', time: '10:42 AM' },
  { id: 5, kind: 'full', text: 'Bin Donholm-07 is full', time: '10:41 AM' },
  { id: 6, kind: 'points', text: 'User Brian earned 6 points', time: '10:39 AM' },
  { id: 7, kind: 'detect', text: 'Bin Karen-03 detected Paper Waste', time: '10:37 AM' },
  { id: 8, kind: 'full', text: "Bin Lang'ata-01 is full", time: '10:35 AM' },
]

// Positions are approximate area centres, and the bins themselves are made up.
export const bins = [
  { id: 'westlands-05', name: 'Westlands-05', lat: -1.269, lng: 36.8095, fill: 92, smart: true },
  { id: 'westlands-02', name: 'Westlands-02', lat: -1.265, lng: 36.813, fill: 45, smart: false },
  { id: 'parklands-01', name: 'Parklands-01', lat: -1.2634, lng: 36.818, fill: 71, smart: true },
  { id: 'kilimani-03', name: 'Kilimani-03', lat: -1.29, lng: 36.785, fill: 28, smart: true },
  { id: 'kileleshwa-02', name: 'Kileleshwa-02', lat: -1.2833, lng: 36.7833, fill: 35, smart: false },
  { id: 'cbd-01', name: 'CBD-01', lat: -1.2864, lng: 36.8172, fill: 66, smart: true },
  { id: 'cbd-04', name: 'CBD-04', lat: -1.283, lng: 36.825, fill: 83, smart: false },
  { id: 'kibera-02', name: 'Kibera-02', lat: -1.3133, lng: 36.7889, fill: 88, smart: false },
  { id: 'kibera-05', name: 'Kibera-05', lat: -1.317, lng: 36.785, fill: 52, smart: false },
  { id: 'karen-03', name: 'Karen-03', lat: -1.3197, lng: 36.7073, fill: 22, smart: true },
  { id: 'donholm-07', name: 'Donholm-07', lat: -1.2975, lng: 36.8975, fill: 97, smart: false },
  { id: 'langata-01', name: "Lang'ata-01", lat: -1.355, lng: 36.755, fill: 90, smart: false },
]

export const users = [
  { id: 1, name: 'Phoenix Otieno', area: 'Westlands', items: 148, kg: 62.4, points: 1250, joined: '2024-03-04' },
  { id: 2, name: 'Mercy Wanjiru', area: 'Kileleshwa', items: 203, kg: 88.1, points: 2140, joined: '2024-01-18' },
  { id: 3, name: 'Brian Kiprop', area: 'Karen', items: 97, kg: 41.7, points: 780, joined: '2024-05-02' },
  { id: 4, name: 'Amina Yusuf', area: 'Kibera', items: 176, kg: 70.3, points: 1625, joined: '2024-02-11' },
  { id: 5, name: 'Daniel Mutua', area: "Lang'ata", items: 64, kg: 25.9, points: 410, joined: '2024-08-20' },
  { id: 6, name: 'Grace Achieng', area: 'CBD', items: 121, kg: 52.0, points: 990, joined: '2024-04-09' },
  { id: 7, name: 'Kevin Njoroge', area: 'Donholm', items: 38, kg: 14.2, points: 260, joined: '2024-09-30' },
  { id: 8, name: 'Faith Chebet', area: 'Parklands', items: 189, kg: 79.6, points: 1870, joined: '2024-01-27' },
  { id: 9, name: 'Samuel Odhiambo', area: 'Kilimani', items: 82, kg: 33.4, points: 640, joined: '2024-06-15' },
  { id: 10, name: 'Lucy Wambui', area: 'Westlands', items: 55, kg: 21.8, points: 355, joined: '2024-10-05' },
]

export const adminRewards = {
  mpesa: { pointsConverted: 31200, pointsPerKes: 100 },
  offers: [
    { id: 1, partner: 'Naivas Supermarket', reward: 'KES 20 off', cost: 200, redeemed: 64, active: true },
    { id: 2, partner: 'KFC Kenya', reward: 'KES 30 off', cost: 300, redeemed: 41, active: true },
    { id: 3, partner: 'Java House', reward: 'Free Coffee', cost: 250, redeemed: 37, active: true },
    { id: 4, partner: 'Quickmart', reward: 'KES 15 off', cost: 150, redeemed: 12, active: false },
  ],
  recent: [
    { id: 1, user: 'Mercy W.', kind: 'mpesa', label: 'KES 50', points: 5000, time: '10:12 AM' },
    { id: 2, user: 'Phoenix O.', kind: 'partner', label: 'Free Coffee at Java House', points: 250, time: '9:48 AM' },
    { id: 3, user: 'Faith C.', kind: 'partner', label: 'KES 20 off at Naivas Supermarket', points: 200, time: '9:20 AM' },
    { id: 4, user: 'Amina Y.', kind: 'mpesa', label: 'KES 30', points: 3000, time: 'Yesterday' },
    { id: 5, user: 'Grace A.', kind: 'partner', label: 'KES 30 off at KFC Kenya', points: 300, time: 'Yesterday' },
  ],
}


export const analytics = {
  weekly: [
    { label: 'Wk 1', plastic: 3050, organic: 2050, paper: 1020, metal: 460, glass: 210, rate: 61 },
    { label: 'Wk 2', plastic: 3200, organic: 2100, paper: 1050, metal: 470, glass: 200, rate: 62 },
    { label: 'Wk 3', plastic: 3100, organic: 2000, paper: 1000, metal: 440, glass: 190, rate: 60 },
    { label: 'Wk 4', plastic: 3350, organic: 2200, paper: 1100, metal: 500, glass: 220, rate: 64 },
    { label: 'Wk 5', plastic: 3450, organic: 2250, paper: 1120, metal: 510, glass: 230, rate: 65 },
    { label: 'Wk 6', plastic: 3600, organic: 2350, paper: 1150, metal: 530, glass: 240, rate: 66 },
    { label: 'Wk 7', plastic: 3700, organic: 2400, paper: 1200, metal: 560, glass: 250, rate: 67 },
    { label: 'Wk 8', plastic: 3900, organic: 2500, paper: 1250, metal: 580, glass: 260, rate: 68 },
  ],
  monthly: [
    { label: 'May', plastic: 12800, organic: 8600, paper: 4300, metal: 2000, glass: 900, rate: 58 },
    { label: 'Jun', plastic: 13400, organic: 9000, paper: 4500, metal: 2100, glass: 950, rate: 61 },
    { label: 'Jul', plastic: 14100, organic: 9300, paper: 4700, metal: 2200, glass: 1000, rate: 63 },
    { label: 'Aug', plastic: 14900, organic: 9800, paper: 4900, metal: 2350, glass: 1050, rate: 65 },
    { label: 'Sep', plastic: 15600, organic: 10200, paper: 5200, metal: 2450, glass: 1100, rate: 66 },
    { label: 'Oct', plastic: 16300, organic: 10800, paper: 5400, metal: 2600, glass: 1150, rate: 68 },
  ],
}

export const defaultSettings = {
  profile: { name: 'Admin', title: 'City Manager' },
  thresholds: { medium: 50, high: 80 },
  notifications: { highFill: true, dailySummary: true, weeklyReport: false },
}
