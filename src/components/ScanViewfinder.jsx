import { ScanLine } from 'lucide-react'

function Corner({ className }) {
  return <span className={`absolute h-8 w-8 border-brand-500 ${className}`} />
}

export default function ScanViewfinder() {
  return (
    <div className="relative mx-auto flex h-56 w-56 items-center justify-center rounded-3xl bg-gray-900">
      <Corner className="left-3 top-3 rounded-tl-xl border-l-4 border-t-4" />
      <Corner className="right-3 top-3 rounded-tr-xl border-r-4 border-t-4" />
      <Corner className="bottom-3 left-3 rounded-bl-xl border-b-4 border-l-4" />
      <Corner className="bottom-3 right-3 rounded-br-xl border-b-4 border-r-4" />
      <ScanLine size={56} className="text-brand-500/60" />
    </div>
  )
}