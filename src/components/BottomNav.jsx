import { Link, useLocation } from 'react-router-dom'
import { ScanLine } from 'lucide-react'
import { navItems, isItemActive } from './navItems'

function Tab({ item, pathname }) {
  const active = isItemActive(item, pathname)
  const Icon = item.icon

  return (
    <Link
      to={item.to}
      className={`flex flex-col items-center gap-0.5 text-[11px] ${
        active ? 'font-semibold text-brand-600' : 'text-gray-400'
      }`}
    >
      <Icon size={22} />
      {item.label}
    </Link>
  )
}

export default function BottomNav() {
  const { pathname } = useLocation()
  const [home, impact, rewards, profile] = navItems

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-gray-100 bg-white px-5 pb-3 pt-2 md:hidden">
      <div className="flex items-end justify-between">
        <Tab item={home} pathname={pathname} />
        <Tab item={impact} pathname={pathname} />

        <Link
          to="/scan"
          className="-mt-8 flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-white shadow-lg ring-4 ring-white"
          aria-label="Scan or drop"
        >
          <ScanLine size={26} />
        </Link>

        <Tab item={rewards} pathname={pathname} />
        <Tab item={profile} pathname={pathname} />
      </div>
    </nav>
  )
}