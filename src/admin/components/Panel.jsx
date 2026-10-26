export default function Panel({ title, action, className = '', children }) {
  return (
    <section className={`rounded-2xl border border-white/5 bg-ink-900 p-5 ${className}`}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  )
}