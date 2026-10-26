export const user = {
  name: 'Phoenix',
  points: 1250,
}

export const today = {
  itemsRecycled: 3,
  co2SavedKg: 1.6,
}

export const impact = {
  wasteRecycledKg: 5.6,
  co2SavedKg: 4.2,
  trees: 2,
  topPercent: 15,
}

export const weeklyActivity = [
  { day: 'Mon', items: 1.5 },
  { day: 'Tue', items: 3.8 },
  { day: 'Wed', items: 3.0 },
  { day: 'Thu', items: 5.0 },
  { day: 'Fri', items: 7.5 },
  { day: 'Sat', items: 2.5 },
  { day: 'Sun', items: 3.5 },
]

export const mpesa = {
  label: 'Convert to M-Pesa Cash',
  rate: '100 PTS = KES 1',
  pointsPerKes: 100,
}

export const partners = [
  { id: 1, name: 'Naivas Supermarket', offer: '200 PTS = KES 20 off', cost: 200, reward: 'KES 20 off', initial: 'N', color: 'bg-orange-500' },
  { id: 2, name: 'KFC Kenya', offer: '300 PTS = KES 30 off', cost: 300, reward: 'KES 30 off', initial: 'K', color: 'bg-red-600' },
  { id: 3, name: 'Java House', offer: '250 PTS = Free Coffee', cost: 250, reward: 'Free Coffee', initial: 'J', color: 'bg-amber-900' },
]

export const history = [
  { id: 1, type: 'plastic', name: 'Plastic Bottle', kg: 0.2, when: 'Today, 10:45 AM', daysAgo: 0, points: 10 },
  { id: 2, type: 'metal', name: 'Aluminium Can', kg: 0.1, when: 'Today, 10:30 AM', daysAgo: 0, points: 8 },
  { id: 3, type: 'paper', name: 'Paper', kg: 0.3, when: 'Today, 09:15 AM', daysAgo: 0, points: 6 },
  { id: 4, type: 'glass', name: 'Glass Bottle', kg: 0.2, when: 'Yesterday, 04:45 PM', daysAgo: 1, points: 8 },
  { id: 5, type: 'organic', name: 'Organic Waste', kg: 0.5, when: 'Yesterday, 01:20 PM', daysAgo: 1, points: 5 },
]

export const wasteTypes = [
  { id: 'plastic', label: 'Plastic', itemName: 'Plastic Bottle', pointsPerKg: 50 },
  { id: 'metal', label: 'Metal', itemName: 'Aluminium Can', pointsPerKg: 80 },
  { id: 'paper', label: 'Paper', itemName: 'Paper', pointsPerKg: 20 },
  { id: 'glass', label: 'Glass', itemName: 'Glass Bottle', pointsPerKg: 40 },
  { id: 'organic', label: 'Organic', itemName: 'Organic Waste', pointsPerKg: 10 },
]

export const profile = {
  fullName: 'Phoenix Wambui',
  phone: '0712 345 678',
  area: 'Westlands',
  memberSince: 'March 2024',
  lifetime: {
    itemsRecycled: 148,
    wasteKg: 62.4,
    co2Kg: 31.2,
    pointsEarned: 4380,
  },
}

