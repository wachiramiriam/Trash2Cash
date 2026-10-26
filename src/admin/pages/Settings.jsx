import { useState } from 'react'
import Panel from '../components/Panel'
import PageTitle from '../components/PageTitle'
import Toggle from '../components/Toggle'
import { useSettings } from '../SettingsContext'

// The form keeps numbers as text while typing, so a field can be cleared without jumping to 0
const toDraft = (s) => ({
  name: s.profile.name,
  title: s.profile.title,
  medium: String(s.thresholds.medium),
  high: String(s.thresholds.high),
  notifications: { ...s.notifications },
})

const fromDraft = (d) => ({
  profile: { name: d.name.trim(), title: d.title.trim() },
  thresholds: { medium: Number(d.medium), high: Number(d.high) },
  notifications: d.notifications,
})

function validate(d) {
  const medium = Number(d.medium)
  const high = Number(d.high)
  if (!d.name.trim()) return 'Enter your name.'
  if (!Number.isInteger(medium) || !Number.isInteger(high)) return 'Fill levels must be whole numbers.'
  if (medium < 1 || high > 100) return 'Fill levels must be between 1 and 100.'
  if (medium >= high) return 'Medium must be lower than High.'
  return null
}

const inputClass =
  'w-full rounded-lg border border-white/10 bg-ink-800 px-3 py-2 text-sm text-gray-200 placeholder:text-gray-500'

function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-gray-200">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-gray-500">{hint}</span>}
    </label>
  )
}

export default function Settings() {
  const { settings, save } = useSettings()
  const [draft, setDraft] = useState(() => toDraft(settings))
  const [saving, setSaving] = useState(false)
  const [result, setResult] = useState(null)

  const problem = validate(draft)
  const dirty = JSON.stringify(draft) !== JSON.stringify(toDraft(settings))

  const update = (patch) => {
    setDraft((d) => ({ ...d, ...patch }))
    setResult(null)
  }
  const setNotification = (key) => (value) =>
    update({ notifications: { ...draft.notifications, [key]: value } })

  const handleSave = async () => {
    setSaving(true)
    setResult(null)
    try {
      const saved = await save(fromDraft(draft))
      setDraft(toDraft(saved))
      setResult({ ok: true, text: 'Settings saved.' })
    } catch (err) {
      setResult({ ok: false, text: err.message })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <PageTitle title="Settings" subtitle="Your profile, alert levels and notifications" />

      <Panel title="Profile">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Your name">
            <input
              value={draft.name}
              onChange={(e) => update({ name: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Job title">
            <input
              value={draft.title}
              onChange={(e) => update({ title: e.target.value })}
              className={inputClass}
            />
          </Field>
        </div>
      </Panel>

      <Panel title="Bin Alert Levels">
        <p className="mb-4 text-sm text-gray-400">
          Decide how full a bin must be before it counts as Medium or High. This changes the maps,
          badges, tables, the Needs Attention list and the Bin Status report.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Medium from (% full)">
            <input
              type="number"
              inputMode="numeric"
              min="1"
              max="99"
              value={draft.medium}
              onChange={(e) => update({ medium: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="High from (% full)">
            <input
              type="number"
              inputMode="numeric"
              min="2"
              max="100"
              value={draft.high}
              onChange={(e) => update({ high: e.target.value })}
              className={inputClass}
            />
          </Field>
        </div>

        {!problem && (
          <p className="mt-3 text-xs text-gray-400">
            Low: under {draft.medium}% · Medium: {draft.medium}–{Number(draft.high) - 1}% · High:{' '}
            {draft.high}% and above
          </p>
        )}
      </Panel>

      <Panel title="Notifications">
        <div className="divide-y divide-white/5">
          <Toggle
            label="Alert me when a bin reaches High"
            description="Get told as soon as a bin needs collecting."
            checked={draft.notifications.highFill}
            onChange={setNotification('highFill')}
          />
          <Toggle
            label="Daily summary"
            description="A short overview of yesterday's collections."
            checked={draft.notifications.dailySummary}
            onChange={setNotification('dailySummary')}
          />
          <Toggle
            label="Weekly report"
            description="The week's totals and area rankings."
            checked={draft.notifications.weeklyReport}
            onChange={setNotification('weeklyReport')}
          />
        </div>
        <p className="mt-3 text-xs text-gray-500">
          These choices are saved, but nothing is sent yet. Sending email or SMS needs the backend.
        </p>
      </Panel>

      <div className="flex flex-wrap items-center gap-4">
        <button
          onClick={handleSave}
          disabled={!dirty || Boolean(problem) || saving}
          className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:bg-white/10 disabled:text-gray-500"
        >
          {saving ? 'Saving...' : 'Save changes'}
        </button>

        {problem && dirty && <p className="text-sm text-red-400">{problem}</p>}
        {result && (
          <p className={`text-sm ${result.ok ? 'text-green-400' : 'text-red-400'}`}>{result.text}</p>
        )}
      </div>
    </div>
  )
}