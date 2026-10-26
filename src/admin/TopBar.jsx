import { Menu, Bell } from 'lucide-react'
import { useSettings } from './SettingsContext'

export default function TopBar({ onToggle }) {
  const { settings } = useSettings()
  const name = settings?.profile.name ?? 'Admin'
  const title = settings?.profile.title ?? 'City Manager'

  return (
    <header className="sticky top-0 z-[1000] flex items-center justify-between border-b border-white/5 bg-ink-950/90 px-6 py-3 backdrop-blur">
      <button
        onClick={onToggle}
        className="rounded-lg p-2 text-gray-300 hover:bg-white/5"
        aria-label="Toggle sidebar"
      >
        <Menu size={20} />
      </button>

      <div className="flex items-center gap-5">
        <button className="relative rounded-lg p-2 text-gray-300 hover:bg-white/5" aria-label="Notifications">
          <Bell size={20} />
        </button>

        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
            {name[0]?.toUpperCase()}
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-white">{name}</p>
            <p className="text-xs text-gray-400">{title}</p>
          </div>
        </div>
      </div>
    </header>
  )
}