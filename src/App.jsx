import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider, AuthProvider, ToastProvider, SidebarProvider, useAuth } from './context/AppContext.jsx'

// Layouts
import ManagerLayout from './layouts/ManagerLayout.jsx'
import ResidentLayout from './layouts/ResidentLayout.jsx'

// Public Pages
import LandingPage from './pages/LandingPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import { FeaturesPage, PricingPage, LegalPage } from './pages/FeaturesPage.jsx'

// Manager Pages — all from single file to avoid re-export issues
import Dashboard from './pages/manager/Dashboard.jsx'
import { Residents, Payments } from './pages/manager/Residents.jsx'
import Maintenance from './pages/manager/Maintenance.jsx'
import Reports from './pages/manager/Reports.jsx'
import { Violations, Documents, Announcements, Voting, Amenities, Vendors, Settings } from './pages/manager/Violations.jsx'

// Resident Pages — all from single file
import { ResidentDashboard, ResidentPayments, ResidentRequests, ResidentDocuments, ResidentAnnouncements, ResidentVoting } from './pages/resident/ResidentDashboard.jsx'

function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return user.role === 'resident' ? <Navigate to="/portal" replace /> : <Navigate to="/dashboard" replace />
  }
  return children
}

function AppRoutes() {
  const { user } = useAuth()
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/features" element={<FeaturesPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/legal/:type" element={<LegalPage />} />
      <Route path="/login" element={user ? <Navigate to={user.role === 'resident' ? '/portal' : '/dashboard'} /> : <LoginPage />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <RegisterPage />} />

      <Route path="/dashboard" element={
        <ProtectedRoute allowedRoles={['manager', 'board', 'super_admin']}>
          <ManagerLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="residents" element={<Residents />} />
        <Route path="payments" element={<Payments />} />
        <Route path="maintenance" element={<Maintenance />} />
        <Route path="violations" element={<Violations />} />
        <Route path="documents" element={<Documents />} />
        <Route path="announcements" element={<Announcements />} />
        <Route path="voting" element={<Voting />} />
        <Route path="amenities" element={<Amenities />} />
        <Route path="reports" element={<Reports />} />
        <Route path="vendors" element={<Vendors />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="/portal" element={
        <ProtectedRoute allowedRoles={['resident']}>
          <ResidentLayout />
        </ProtectedRoute>
      }>
        <Route index element={<ResidentDashboard />} />
        <Route path="payments" element={<ResidentPayments />} />
        <Route path="requests" element={<ResidentRequests />} />
        <Route path="documents" element={<ResidentDocuments />} />
        <Route path="announcements" element={<ResidentAnnouncements />} />
        <Route path="voting" element={<ResidentVoting />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <SidebarProvider>
              <AppRoutes />
            </SidebarProvider>
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
