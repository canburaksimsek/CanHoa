import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

// ── THEME CONTEXT ─────────────────────────────────────
const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('canhoa-theme')
    if (saved) return saved
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('canhoa-theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light')

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)

// ── AUTH CONTEXT ──────────────────────────────────────
const AuthContext = createContext()

// Demo users for the prototype
const DEMO_USERS = {
  'manager@canhoa.com': { 
    id: '1', role: 'manager', name: 'Sarah Mitchell', email: 'manager@canhoa.com',
    community: 'Oakwood Heights HOA', units: 124, avatar: 'SM',
    plan: 'Growth', joined: '2023-01-15'
  },
  'resident@canhoa.com': { 
    id: '2', role: 'resident', name: 'James Chen', email: 'resident@canhoa.com',
    unit: '4B', community: 'Oakwood Heights HOA', avatar: 'JC',
    balance: 285.00, dueDate: '2026-05-01', joined: '2022-06-01'
  },
  'board@canhoa.com': {
    id: '3', role: 'board', name: 'Patricia Williams', email: 'board@canhoa.com',
    community: 'Oakwood Heights HOA', units: 124, avatar: 'PW',
    title: 'Board President', joined: '2021-03-10'
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('canhoa-user')
    return saved ? JSON.parse(saved) : null
  })
  const [loading, setLoading] = useState(false)

  const login = useCallback(async (email, password) => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    const found = DEMO_USERS[email.toLowerCase()]
    if (found && (password === 'demo123' || password === 'password')) {
      setUser(found)
      localStorage.setItem('canhoa-user', JSON.stringify(found))
      setLoading(false)
      return { success: true, user: found }
    }
    setLoading(false)
    return { success: false, error: 'Invalid email or password. Try demo123 as password.' }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem('canhoa-user')
  }, [])

  const register = useCallback(async (data) => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    const newUser = {
      id: Date.now().toString(),
      role: 'manager',
      name: data.name,
      email: data.email,
      community: data.community || 'My HOA Community',
      units: 0,
      avatar: data.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2),
      plan: 'Trial',
      joined: new Date().toISOString().split('T')[0]
    }
    setUser(newUser)
    localStorage.setItem('canhoa-user', JSON.stringify(newUser))
    setLoading(false)
    return { success: true, user: newUser }
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

// ── TOAST CONTEXT ─────────────────────────────────────
const ToastContext = createContext()

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, duration)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)

function ToastContainer({ toasts, onRemove }) {
  if (!toasts.length) return null
  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <div key={toast.id} className={`toast toast-${toast.type}`} onClick={() => onRemove(toast.id)}>
          <span style={{ fontSize: 18 }}>
            {toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : toast.type === 'warning' ? '!' : 'i'}
          </span>
          <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>{toast.message}</span>
        </div>
      ))}
    </div>
  )
}

// ── SIDEBAR STATE CONTEXT ─────────────────────────────
const SidebarContext = createContext()

export function SidebarProvider({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  return (
    <SidebarContext.Provider value={{ sidebarOpen, setSidebarOpen }}>
      {children}
    </SidebarContext.Provider>
  )
}

export const useSidebar = () => useContext(SidebarContext)

// ── COOKIE CONSENT ────────────────────────────────────
import { useEffect } from 'react'

export function CookieConsent() {
  const [visible, setVisible] = React.useState(false)
  const [analyticsConsent, setAnalyticsConsent] = React.useState(true)

  React.useEffect(() => {
    const consent = localStorage.getItem('canhoa-cookie-consent')
    if (!consent) {
      setTimeout(() => setVisible(true), 1500)
    }
  }, [])

  const accept = (all = true) => {
    localStorage.setItem('canhoa-cookie-consent', JSON.stringify({ essential: true, analytics: all ? true : analyticsConsent, marketing: false, timestamp: new Date().toISOString() }))
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div style={{ position:'fixed', bottom:0, left:0, right:0, background:'var(--bg-card)', borderTop:'1px solid var(--border-color)', padding:'16px 24px', zIndex:9998, boxShadow:'0 -4px 24px rgba(0,0,0,0.12)' }}>
      <div style={{ maxWidth:1200, margin:'0 auto', display:'flex', alignItems:'flex-start', gap:20, flexWrap:'wrap' }}>
        <div style={{ flex:1, minWidth:280 }}>
          <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:14, marginBottom:6 }}>🍪 Cookie Settings</div>
          <p style={{ fontSize:13, margin:0, color:'var(--text-muted)', lineHeight:1.6 }}>
            We use essential cookies for platform security and optional analytics cookies to improve your experience. We never sell your data. See our{' '}
            <a href="/legal/privacy" style={{ color:'var(--accent-primary)' }}>Privacy Policy</a> and{' '}
            <a href="/legal/cookies" style={{ color:'var(--accent-primary)' }}>Cookie Policy</a>.
            CCPA: California residents may request data deletion at any time.
          </p>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginTop:10 }}>
            <span style={{ fontSize:12, color:'var(--text-muted)' }}>Analytics cookies:</span>
            <button className={`toggle ${analyticsConsent?'on':''}`} onClick={()=>setAnalyticsConsent(!analyticsConsent)} style={{ transform:'scale(0.85)' }}/>
          </div>
        </div>
        <div style={{ display:'flex', gap:10, alignItems:'center', flexShrink:0 }}>
          <button className="btn btn-secondary btn-sm" onClick={()=>{ setAnalyticsConsent(false); accept(false) }}>Essential Only</button>
          <button className="btn btn-primary btn-sm" onClick={()=>accept(true)}>Accept All Cookies</button>
        </div>
      </div>
    </div>
  )
}
