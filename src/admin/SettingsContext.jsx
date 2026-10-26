import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { makeLevelOf } from './binLevels'
import { Loading, ErrorMessage } from '../components/Status'
import { getSettings, saveSettings } from '../api'

const SettingsContext = createContext(null)

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(null)
  const [status, setStatus] = useState('loading') // 'loading' | 'ready' | 'error'

  useEffect(() => {
    let cancelled = false
    getSettings()
      .then((s) => {
        if (cancelled) return
        setSettings(s)
        setStatus('ready')
      })
      .catch(() => {
        if (!cancelled) setStatus('error')
      })
    return () => {
      cancelled = true
    }
  }, [])

  const save = useCallback(async (next) => {
    const saved = await saveSettings(next)
    setSettings(saved)
    return saved
  }, [])

  const value = useMemo(
    () => ({
      settings,
      status,
      save,
      levelOf: settings ? makeLevelOf(settings.thresholds) : null,
    }),
    [settings, status, save]
  )

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used inside <SettingsProvider>')
  return ctx
}

// Wrap page content in this so pages never see "no settings yet"
export function SettingsGate({ children }) {
  const { status } = useSettings()
  if (status === 'loading') return <Loading />
  if (status === 'error') return <ErrorMessage />
  return children
}