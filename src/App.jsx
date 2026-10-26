import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import { AuthProvider } from './auth/AuthContext'
import RequireAuth from './auth/RequireAuth'
import GuestOnly from './auth/GuestOnly'
import ScrollToTop from './components/ScrollToTop'

// Auth pages
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

// Citizen site
import Layout from './components/Layout'
import Home from './pages/Home'
import Impact from './pages/Impact'
import Rewards from './pages/Rewards'
import History from './pages/History'
import Scan from './pages/Scan'
import Redeem from './pages/Redeem'
import Profile from './pages/Profile'

// Admin dashboard
import AdminLayout from './admin/AdminLayout'
import Dashboard from './admin/pages/Dashboard'
import LiveMap from './admin/pages/LiveMap'
import Bins from './admin/pages/Bins'
import Users from './admin/pages/Users'
import AdminRewards from './admin/pages/Rewards'
import Analytics from './admin/pages/Analytics'
import Reports from './admin/pages/Reports'
import Settings from './admin/pages/Settings'

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<GuestOnly><Login /></GuestOnly>} />
          <Route path="/register" element={<GuestOnly><Register /></GuestOnly>} />

          {/* Citizen site: needs a login */}
          <Route element={<RequireAuth><Layout /></RequireAuth>}>
            <Route path="/" element={<Home />} />
            <Route path="/impact" element={<Impact />} />
            <Route path="/rewards" element={<Rewards />} />
            <Route path="/history" element={<History />} />
            <Route path="/scan" element={<Scan />} />
            <Route path="/redeem/:rewardId" element={<Redeem />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Admin dashboard: needs an admin login */}
          <Route path="/admin" element={<RequireAuth role="admin"><AdminLayout /></RequireAuth>}>
            <Route index element={<Dashboard />} />
            <Route path="live-map" element={<LiveMap />} />
            <Route path="bins" element={<Bins />} />
            <Route path="users" element={<Users />} />
            <Route path="rewards" element={<AdminRewards />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}