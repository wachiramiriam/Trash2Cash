import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import { SettingsProvider, SettingsGate } from './SettingsContext'

export default function AdminLayout() {
  const [open, setOpen] = useState(() => window.innerWidth >= 1024)

  return (
    <SettingsProvider>
      <div className="flex min-h-screen bg-ink-950 text-gray-100">
        <Sidebar open={open} />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar onToggle={() => setOpen((o) => !o)} />
          <main className="flex-1 p-6">
            <SettingsGate>
              <Outlet />
            </SettingsGate>
          </main>
        </div>
      </div>
    </SettingsProvider>
  )
}