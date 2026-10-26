import { Leaf } from 'lucide-react'

export default function AuthLayout({ title, subtitle, footer, children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-50 to-white p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-center gap-2 text-2xl font-bold text-brand-700">
          <Leaf size={28} className="text-brand-500" />
          Trash2Cash
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-black/5 md:p-8">
          <h1 className="text-xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </div>

        <p className="mt-4 text-center text-sm text-gray-500">{footer}</p>
      </div>
    </div>
  )
}