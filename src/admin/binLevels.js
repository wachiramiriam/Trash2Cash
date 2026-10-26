export const LEVELS = {
  high: {
    label: 'High',
    color: '#ef4444',
    badge: 'bg-red-500/15 text-red-400',
    bar: 'bg-red-500',
  },
  medium: {
    label: 'Medium',
    color: '#f59e0b',
    badge: 'bg-amber-500/15 text-amber-400',
    bar: 'bg-amber-500',
  },
  low: {
    label: 'Low',
    color: '#22c55e',
    badge: 'bg-emerald-500/15 text-emerald-400',
    bar: 'bg-emerald-500',
  },
}

// Returns a function: fill % -> 'high' | 'medium' | 'low'
export const makeLevelOf =
  ({ medium, high }) =>
  (fill) =>
    fill >= high ? 'high' : fill >= medium ? 'medium' : 'low'

// "Westlands-05" -> "Westlands"
export const areaOf = (bin) => bin.name.replace(/-\d+$/, '')