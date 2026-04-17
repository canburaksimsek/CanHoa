import React, { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth, useTheme } from '../context/AppContext.jsx'
import {
  LayoutDashboard, Users, CreditCard, Wrench, AlertTriangle,
  FileText, Megaphone, Vote, Dumbbell, BarChart3, Settings,
  Truck, Sun, Moon, Bell, Menu, X, LogOut, ChevronDown,
  Home, Shield, HelpCircle, ExternalLink
} from 'lucide-react'
import { COMMUNITY, FINANCIAL_SUMMARY } from '../data/mockData.js'

const NAV_ITEMS = [
  { label: 'Overview', items: [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/dashboard/residents', icon: Users, label: 'Residents' },
    { to: '/dashboard/payments', icon: CreditCard, label: 'Payments & Finance' },
  ]},
  { label: 'Operations', items: [
    { to: '/dashboard/maintenance', icon: Wrench, label: 'Maintenance' },
    { to: '/dashboard/violations', icon: AlertTriangle, label: 'Violations' },
    { to: '/dashboard/announcements', icon: Megaphone, label: 'Announcements' },
    { to: '/dashboard/vendors', icon: Truck, label: 'Vendors' },
  ]},
  { label: 'Community', items: [
    { to: '/dashboard/voting', icon: Vote, label: 'Voting & Surveys' },
    { to: '/dashboard/amenities', icon: Dumbbell, label: 'Amenities' },
    { to: '/dashboard/documents', icon: FileText, label: 'Documents' },
  ]},
  { label: 'Administration', items: [
    { to: '/dashboard/reports', icon: BarChart3, label: 'Reports' },
    { to: '/dashboard/settings', icon: Settings, label: 'Settings' },
  ]},
]

export default function ManagerLayout() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const notifications = [
    { id: 1, text: 'Robert Johnson (9A) autopay failed', time: '1 hour ago', unread: true, type: 'alert' },
    { id: 2, text: 'New maintenance request from Unit 7C', time: '2 hours ago', unread: true, type: 'request' },
    { id: 3, text: 'Pool Hours vote is 78% complete', time: '3 hours ago', unread: false, type: 'info' },
    { id: 4, text: 'Insurance certificate expires in 30 days', time: '1 day ago', unread: false, type: 'warning' },
  ]
  const unreadCount = notifications.filter(n => n.unread).length

  return (
    <div className="app-layout">
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 99 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── SIDEBAR ── */}
      <nav className={`sidebar ${sidebarOpen ? 'open' : ''}`} style={{ zIndex: 100 }}>
        {/* Logo */}
        <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36, height: 36,
                background: 'var(--accent-primary)',
                borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Home size={18} color="white" />
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, color: 'var(--text-primary)' }}>
                  Can<span style={{ color: 'var(--accent-primary)' }}>Hoa</span>
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 500, marginTop: -2 }}>Manager Portal</div>
              </div>
            </div>
            <button className="btn btn-ghost btn-icon" style={{ display: 'none' }} onClick={() => setSidebarOpen(false)}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Community Info */}
        <div style={{ padding: '12px 16px', margin: '12px 8px 4px', background: 'var(--bg-hover)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Community</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3 }}>{COMMUNITY.name}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{COMMUNITY.totalUnits} units • {COMMUNITY.state}</div>
        </div>

        {/* Nav */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '4px 0' }}>
          {NAV_ITEMS.map(section => (
            <div key={section.label}>
              <div className="nav-section-label">{section.label}</div>
              {section.items.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/dashboard'}
                  className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon size={16} />
                  {item.label}
                </NavLink>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div style={{ padding: '12px 8px', borderTop: '1px solid var(--border-color)' }}>
          <div className="nav-item" onClick={() => window.open('/', '_blank')}>
            <ExternalLink size={16} />
            View Public Site
          </div>
          <div className="nav-item" onClick={handleLogout} style={{ color: 'var(--danger)' }}>
            <LogOut size={16} />
            Sign Out
          </div>
        </div>
      </nav>

      {/* ── MAIN CONTENT ── */}
      <div className="main-content">
        {/* Top Bar */}
        <header className="top-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="btn btn-ghost btn-icon" onClick={() => setSidebarOpen(true)} style={{ display: 'none' }}>
              <Menu size={20} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                padding: '4px 10px',
                background: 'var(--accent-light)',
                borderRadius: 'var(--radius-full)',
                fontSize: 12,
                fontWeight: 700,
                color: 'var(--accent-primary)'
              }}>
                {user?.plan || 'Growth'} Plan
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Theme Toggle */}
            <button className="btn btn-ghost btn-icon" onClick={toggleTheme} title="Toggle theme">
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {/* Notifications */}
            <div className="dropdown">
              <button className="btn btn-ghost btn-icon" style={{ position: 'relative' }} onClick={() => { setNotifOpen(!notifOpen); setUserMenuOpen(false) }}>
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute', top: 6, right: 6,
                    width: 8, height: 8,
                    background: 'var(--danger)',
                    borderRadius: '50%',
                    border: '2px solid var(--bg-card)'
                  }} />
                )}
              </button>
              {notifOpen && (
                <div className="dropdown-menu" style={{ width: 340 }}>
                  <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: 14 }}>Notifications</span>
                    {unreadCount > 0 && <span className="badge badge-green">{unreadCount} new</span>}
                  </div>
                  {notifications.map(n => (
                    <div key={n.id} className="dropdown-item" style={{ borderBottom: '1px solid var(--border-color)', padding: '12px 16px', background: n.unread ? 'var(--bg-hover)' : 'transparent' }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: n.unread ? 600 : 400, color: 'var(--text-primary)' }}>{n.text}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{n.time}</div>
                      </div>
                    </div>
                  ))}
                  <div style={{ padding: '10px 16px', textAlign: 'center' }}>
                    <span style={{ fontSize: 13, color: 'var(--accent-primary)', fontWeight: 600, cursor: 'pointer' }}>View all notifications</span>
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="dropdown">
              <button
                onClick={() => { setUserMenuOpen(!userMenuOpen); setNotifOpen(false) }}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', background: 'var(--bg-hover)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}
              >
                <div className="avatar avatar-sm">{user?.avatar}</div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{user?.name?.split(' ')[0]}</div>
                </div>
                <ChevronDown size={14} color="var(--text-muted)" />
              </button>
              {userMenuOpen && (
                <div className="dropdown-menu">
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)' }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>{user?.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{user?.email}</div>
                    <div style={{ fontSize: 11, marginTop: 4 }}><span className="badge badge-green">HOA Manager</span></div>
                  </div>
                  <div className="dropdown-item" onClick={() => { navigate('/dashboard/settings'); setUserMenuOpen(false) }}>
                    <Settings size={15} /> Settings
                  </div>
                  <div className="dropdown-item">
                    <HelpCircle size={15} /> Help Center
                  </div>
                  <div className="dropdown-divider" />
                  <div className="dropdown-item danger" onClick={handleLogout}>
                    <LogOut size={15} /> Sign Out
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="page-content">
          <Outlet />
        </main>
      </div>

      {/* Mobile sidebar toggle */}
      <style>{`
        @media (max-width: 1024px) {
          .app-layout .sidebar { transform: translateX(-100%); }
          .app-layout .sidebar.open { transform: translateX(0); }
          .app-layout .main-content { margin-left: 0 !important; }
          .top-bar button[style*="display: none"] { display: flex !important; }
        }
      `}</style>
    </div>
  )
}
