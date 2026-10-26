export function Loading() {
  return (
    <div className="flex h-64 items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-100 border-t-brand-600" />
    </div>
  )
}

export function ErrorMessage({ message = 'Something went wrong. Please try again.' }) {
  return <p className="py-10 text-center text-sm text-red-500">{message}</p>
}