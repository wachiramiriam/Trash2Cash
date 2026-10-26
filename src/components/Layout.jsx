import { Outlet } from 'react-router-dom'
import TopNav from './TopNav'
import BottomNav from './BottomNav'

export default function Layout() {
  return (
    <div className="min-h-screen bg-white">
      <TopNav />

      {/* pb-24 leaves room for the fixed bottom nav on phones */}
      <main className="mx-auto w-full max-w-5xl pb-24 md:pb-10">
        <Outlet />
      </main>

      <BottomNav />
    </div>
  )
}