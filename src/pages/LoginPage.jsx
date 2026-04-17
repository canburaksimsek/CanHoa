import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth, useToast } from '../context/AppContext.jsx'
import { Home, Eye, EyeOff, ArrowRight, Shield, CheckCircle } from 'lucide-react'

// ── LOGIN PAGE ────────────────────────────────────────
export default function LoginPage() {
  const { login, loading } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '', remember: false })
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const result = await login(form.email, form.password)
    if (result.success) {
      addToast('Welcome back! Redirecting...', 'success')
      setTimeout(() => {
        navigate(result.user.role === 'resident' ? '/portal' : '/dashboard')
      }, 400)
    } else {
      setError(result.error)
    }
  }

  const fillDemo = (type) => {
    const creds = {
      manager: { email: 'manager@canhoa.com', password: 'demo123' },
      resident: { email: 'resident@canhoa.com', password: 'demo123' },
      board: { email: 'board@canhoa.com', password: 'demo123' },
    }
    setForm(f => ({ ...f, ...creds[type] }))
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg-primary)' }}>
      {/* Left panel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 48px', maxWidth: 500 }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 40, textDecoration: 'none' }}>
            <div style={{ width: 36, height: 36, background: 'var(--accent-primary)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Home size={18} color="white" />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color: 'var(--text-primary)' }}>
              Can<span style={{ color: 'var(--accent-primary)' }}>Hoa</span>
            </span>
          </Link>

          <h2 style={{ marginBottom: 8 }}>Welcome back</h2>
          <p style={{ marginBottom: 32 }}>Sign in to your community management portal</p>

          {/* Demo shortcuts */}
          <div style={{ marginBottom: 24, padding: 16, background: 'var(--bg-secondary)', borderRadius: 12, border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Quick Demo Login</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {[['Manager', 'manager'], ['Resident', 'resident'], ['Board Member', 'board']].map(([label, type]) => (
                <button key={type} onClick={() => fillDemo(type)} className="btn btn-secondary btn-sm" style={{ fontSize: 12 }}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{ padding: '12px 16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, marginBottom: 20, fontSize: 14, color: '#dc2626' }}>
                {error}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email" className="form-input" placeholder="you@example.com" required
                value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              />
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label className="form-label" style={{ margin: 0 }}>Password</label>
                <a href="#" style={{ fontSize: 13, color: 'var(--accent-primary)' }}>Forgot password?</a>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPw ? 'text' : 'password'} className="form-input" placeholder="Enter your password" required
                  value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  style={{ paddingRight: 44 }}
                />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
              <input type="checkbox" id="remember" checked={form.remember} onChange={e => setForm(f => ({ ...f, remember: e.target.checked }))} style={{ accentColor: 'var(--accent-primary)' }} />
              <label htmlFor="remember" style={{ fontSize: 14, color: 'var(--text-muted)', cursor: 'pointer' }}>Remember me for 30 days</label>
            </div>

            <button type="submit" className="btn btn-primary w-full btn-lg" disabled={loading} style={{ justifyContent: 'center' }}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="animate-spin" style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block' }} />
                  Signing in...
                </span>
              ) : (
                <>Sign In <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14 }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Start free trial</Link>
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 28, justifyContent: 'center' }}>
            <Shield size={14} color="var(--text-muted)" />
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>256-bit encrypted · PCI DSS Compliant</span>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={{ flex: 1, background: 'linear-gradient(135deg, #070d1a 0%, #0a1628 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(74,222,128,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(74,222,128,0.05) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 440, textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 20 }}>🏡</div>
          <h2 style={{ color: 'white', marginBottom: 20, fontFamily: 'var(--font-display)' }}>Manage Your HOA with Confidence</h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 16, lineHeight: 1.7, marginBottom: 36 }}>
            Join 5,000+ communities across America using CanHoa to automate payments, streamline communication, and keep their communities thriving.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {['Automated dues collection & late fees', 'Mass email, SMS & phone alerts', 'Online voting & board elections', '30+ financial reports & exports', 'Fair Housing Act compliant enforcement'].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left' }}>
                <CheckCircle size={18} color="#5c84d6" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: 15, color: 'rgba(255,255,255,0.8)' }}>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
