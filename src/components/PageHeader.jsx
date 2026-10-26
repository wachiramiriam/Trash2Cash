import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function PageHeader({ title }) {
  const navigate = useNavigate()

  return (
    <header className="relative flex items-center justify-center pt-2">
      <button
        onClick={() => navigate(-1)}
        className="absolute left-0 rounded-full p-1 text-gray-700 active:bg-gray-100"
        aria-label="Go back"
      >
        <ArrowLeft size={22} />
      </button>
      <h1 className="text-base font-semibold text-gray-900">{title}</h1>
    </header>
  )
}