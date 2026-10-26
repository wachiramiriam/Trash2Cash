import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  MapPin,
  BarChart3,
  Trash2,
  Users,
  Gift,
  FileText,
  Settings,
  LogOut,
  Leaf,
} from 'lucide-react'
import { useAuth } from '../auth/AuthContext'

const items = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/live-map', label: 'Live Map', icon: MapPin },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/admin/bins', label: 'Bins', icon: Trash2 },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/rewards', label: 'Rewards', icon: Gift },
  { to: '/admin/reports', label: 'Reports', icon: FileText },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
]

const itemClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
    isActive
      ? 'bg-brand-500/15 font-semibold text-green-400'
      : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
  }`

export default function Sidebar({ open }) {
  const { logout } = useAuth()
  return (
    <aside
      className={`sticky top-0 h-screen shrink-0 overflow-hidden border-r border-white/5 bg-ink-900 transition-all duration-200 ${
        open ? 'w-60' : 'w-0'
      }`}
    >
      {/* Fixed inner width so content doesn't reflow while the sidebar animates */}
      <div className="flex h-full w-60 flex-col p-4">
        <div className="mb-8 flex items-center gap-2 px-2 pt-1">
          <Leaf className="text-green-500" size={26} />
          <span className="text-lg font-bold text-white">Trash2Cash</span>
        </div>

        <nav className="flex-1 space-y-1">
          {items.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={itemClass}>
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <button onClick={logout}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-400 hover:bg-white/5 hover:text-gray-200"
        >
          <LogOut size={18} />
          Logout
          
        </button>
      </div>
    </aside>
  )
}