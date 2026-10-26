import { Home, BarChart3, Gift, User } from 'lucide-react'

export const navItems = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/impact', label: 'Impact', icon: BarChart3 },
  { to: '/rewards', label: 'Rewards', icon: Gift, also: ['/redeem'] },
  { to: '/profile', label: 'Profile', icon: User, also: ['/history'] },
]

const under = (pathname, base) => pathname === base || pathname.startsWith(`${base}/`)

// `also` keeps a tab highlighted on its child pages (History under Profile, Redeem under Rewards)
export function isItemActive(item, pathname) {
  const self = item.end ? pathname === item.to : under(pathname, item.to)
  return self || (item.also ?? []).some((base) => under(pathname, base))
}