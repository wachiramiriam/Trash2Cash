import { LEVELS } from '../binLevels'
import { useSettings } from '../SettingsContext'

export default function LevelBadge({ fill }) {
  const { levelOf } = useSettings()
  const { label, badge } = LEVELS[levelOf(fill)]

  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${badge}`}>
      {label}
    </span>
  )
}