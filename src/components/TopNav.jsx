import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Leaf, Menu, ScanLine, X } from 'lucide-react'
import { navItems, isItemActive } from './navItems'

export default function TopNav() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  // Let Escape close the menu
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <header className="sticky top-0 z-30 hidden border-b border-gray-100 bg-white/95 backdrop-blur md:block">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              className="rounded-lg p-2 text-gray-700 hover:bg-gray-100"
            >
              <Menu size={22} />
            </button>

            <Link to="/" className="flex items-center gap-2 text-lg font-bold text-brand-700">
              <Leaf size={24} className="text-brand-500" />
              Trash2Cash
            </Link>
          </div>

          <Link
            to="/scan"
            className="flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          >
            <ScanLine size={18} />
            Scan / Drop
          </Link>
        </div>
      </header>

      {/* Slide-out menu */}
      {open && (
        <div className="fixed inset-0 z-40 hidden md:block">
          <div onClick={close} className="absolute inset-0 bg-black/40" />

          <aside className="absolute left-0 top-0 flex h-full w-64 flex-col bg-white p-4 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <span className="flex items-center gap-2 text-lg font-bold text-brand-700">
                <Leaf size={22} className="text-brand-500" />
                Trash2Cash
              </span>
              <button
                onClick={close}
                aria-label="Close menu"
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="space-y-1">
              {navItems.map((item) => {
                const active = isItemActive(item, pathname)
                const Icon = item.icon

                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={close}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                      active
                        ? 'bg-brand-50 font-semibold text-brand-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={18} />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </aside>
        </div>
      )}
    </>
  )
}