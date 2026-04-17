import React, { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth, useTheme } from '../context/AppContext.jsx'
import {
  LayoutDashboard, CreditCard, Wrench, FileText,
  Megaphone, Vote, Sun, Moon, Bell, LogOut, Home,
  Menu, X, ChevronDown, HelpCircle
} from 'lucide-react'
import { COMMUNITY } from '../data/mockData.js'

const NAV_ITEMS = [
  { to: '/portal', icon: LayoutDashboard, label: 'My Dashboard', end: true },
  { to: '/portal/payments', icon: CreditCard, label: 'Payments' },
  { to: '/portal/requests', icon: Wrench, label: 'Maintenance' },
  { to: '/portal/announcements', icon: Megaphone, label: 'Announcements' },
  { to: '/portal/documents', icon: FileText, label: 'Documents' },
  { to: '/portal/voting', icon: Vote, label: 'Voting' },
]

export default function ResidentLayout() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <div className="app-layout">
      {sidebarOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 99 }} onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <nav className={`sidebar ${sidebarOpen ? 'open' : ''}`} style={{ zIndex: 100 }}>
        <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, background: 'var(--bg-sidebar)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Home size={18} color="white" />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, color: 'var(--text-primary)' }}>
                Can<span style={{ color: 'var(--accent-primary)' }}>Hoa</span>
              </div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.65)', fontWeight: 500 }}>Resident Portal</div>
            </div>
          </div>
        </div>

        {/* Resident info */}
        <div style={{ padding: '12px 16px', margin: '12px 8px 4px', background: 'var(--accent-light)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="avatar avatar-md" style={{ background: 'var(--bg-sidebar)', color: 'white' }}>{user?.avatar}</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{user?.name}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)' }}>Unit {user?.unit} · {COMMUNITY.name.split(' ')[0]}</div>
            </div>
          </div>
        </div>

        <div style={{ flex: 1, padding: '8px 0' }}>
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon size={16} />
              {item.label}
            </NavLink>
          ))}
        </div>

        <div style={{ padding: '12px 8px', borderTop: '1px solid var(--border-color)' }}>
          <div className="nav-item"><HelpCircle size={16} /> Help & Support</div>
          <div className="nav-item" onClick={handleLogout} style={{ color: 'var(--danger)' }}>
            <LogOut size={16} /> Sign Out
          </div>
        </div>
      </nav>

      {/* Main */}
      <div className="main-content">
        <header className="top-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="btn btn-ghost btn-icon" onClick={() => setSidebarOpen(true)}>
              <Menu size={20} />
            </button>
            <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', display: 'none' }}>
              {COMMUNITY.name}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button className="btn btn-ghost btn-icon" onClick={toggleTheme}>
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <button className="btn btn-ghost btn-icon">
              <Bell size={18} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', background: 'var(--bg-hover)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div className="avatar avatar-sm">{user?.avatar}</div>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{user?.name?.split(' ')[0]}</span>
            </div>
          </div>
        </header>
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
