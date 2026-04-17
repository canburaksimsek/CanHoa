import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth, useToast } from '../context/AppContext.jsx'
import { Home, ArrowRight, CheckCircle, Shield, Eye, EyeOff } from 'lucide-react'

export default function RegisterPage() {
  const { register, loading } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [showPw, setShowPw] = useState(false)
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    community: '', units: '', state: '', type: 'HOA',
    agreeTerms: false
  })
  const [errors, setErrors] = useState({})

  const US_STATES = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming']

  const update = (field, val) => setForm(f => ({ ...f, [field]: val }))

  const validateStep1 = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Full name is required'
    if (!form.email.includes('@')) e.email = 'Valid email is required'
    if (form.password.length < 8) e.password = 'Password must be at least 8 characters'
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const validateStep2 = () => {
    const e = {}
    if (!form.community.trim()) e.community = 'Community name is required'
    if (!form.state) e.state = 'State is required'
    if (!form.agreeTerms) e.agreeTerms = 'You must agree to the Terms of Service'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleNext = () => {
    if (validateStep1()) setStep(2)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateStep2()) return
    const result = await register(form)
    if (result.success) {
      addToast('Account created! Welcome to CanHoa 🎉', 'success')
      setTimeout(() => navigate('/dashboard'), 500)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ width: '100%', maxWidth: 520 }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 32, textDecoration: 'none' }}>
          <div style={{ width: 36, height: 36, background: 'var(--accent-primary)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Home size={18} color="white" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color: 'var(--text-primary)' }}>
            Can<span style={{ color: 'var(--accent-primary)' }}>Hoa</span>
          </span>
        </Link>

        <div className="card" style={{ padding: 40 }}>
          {/* Progress */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent-primary)' }}>Step {step} of 2</span>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{step === 1 ? 'Your Account' : 'Your Community'}</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: step === 1 ? '50%' : '100%' }} />
            </div>
          </div>

          <h2 style={{ marginBottom: 8 }}>
            {step === 1 ? 'Create your account' : 'Set up your community'}
          </h2>
          <p style={{ marginBottom: 28, fontSize: 15 }}>
            {step === 1 ? 'Start your 14-day free trial — no credit card required.' : 'Tell us about your HOA community.'}
          </p>

          <form onSubmit={step === 2 ? handleSubmit : (e) => { e.preventDefault(); handleNext() }}>
            {step === 1 && (
              <>
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input type="text" className="form-input" placeholder="Sarah Mitchell" value={form.name} onChange={e => update('name', e.target.value)} />
                  {errors.name && <div className="form-error">{errors.name}</div>}
                </div>
                <div className="form-group">
                  <label className="form-label">Work Email *</label>
                  <input type="email" className="form-input" placeholder="sarah@myhoa.com" value={form.email} onChange={e => update('email', e.target.value)} />
                  {errors.email && <div className="form-error">{errors.email}</div>}
                </div>
                <div className="form-group">
                  <label className="form-label">Password *</label>
                  <div style={{ position: 'relative' }}>
                    <input type={showPw ? 'text' : 'password'} className="form-input" placeholder="Minimum 8 characters" value={form.password} onChange={e => update('password', e.target.value)} style={{ paddingRight: 44 }} />
                    <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                      {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && <div className="form-error">{errors.password}</div>}
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm Password *</label>
                  <input type="password" className="form-input" placeholder="Re-enter your password" value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)} />
                  {errors.confirmPassword && <div className="form-error">{errors.confirmPassword}</div>}
                </div>
                <button type="submit" className="btn btn-primary w-full btn-lg" style={{ justifyContent: 'center', marginTop: 8 }}>
                  Continue <ArrowRight size={18} />
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <div className="form-group">
                  <label className="form-label">Community / HOA Name *</label>
                  <input type="text" className="form-input" placeholder="Oakwood Heights HOA" value={form.community} onChange={e => update('community', e.target.value)} />
                  {errors.community && <div className="form-error">{errors.community}</div>}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Association Type</label>
                    <select className="form-select" value={form.type} onChange={e => update('type', e.target.value)}>
                      <option>HOA</option>
                      <option>COA (Condo)</option>
                      <option>POA</option>
                      <option>Townhome Association</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Number of Units</label>
                    <input type="number" className="form-input" placeholder="e.g. 124" min="1" value={form.units} onChange={e => update('units', e.target.value)} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">State *</label>
                  <select className="form-select" value={form.state} onChange={e => update('state', e.target.value)}>
                    <option value="">Select your state</option>
                    {US_STATES.map(s => <option key={s}>{s}</option>)}
                  </select>
                  {errors.state && <div className="form-error">{errors.state}</div>}
                </div>

                <div style={{ padding: 16, background: 'var(--bg-secondary)', borderRadius: 10, marginBottom: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <input type="checkbox" id="terms" checked={form.agreeTerms} onChange={e => update('agreeTerms', e.target.checked)} style={{ accentColor: 'var(--accent-primary)', marginTop: 2 }} />
                    <label htmlFor="terms" style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, cursor: 'pointer' }}>
                      I agree to the <Link to="/legal/terms" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Terms of Service</Link> and <Link to="/legal/privacy" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Privacy Policy</Link>. I understand CanHoa is CCPA compliant and my community's data will never be sold to third parties.
                    </label>
                  </div>
                  {errors.agreeTerms && <div className="form-error" style={{ marginTop: 8 }}>{errors.agreeTerms}</div>}
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setStep(1)} style={{ flex: 1, justifyContent: 'center' }}>
                    Back
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 2, justifyContent: 'center' }}>
                    {loading ? 'Creating account...' : 'Create Free Account'}
                    {!loading && <ArrowRight size={16} />}
                  </button>
                </div>
              </>
            )}
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 24, justifyContent: 'center' }}>
            <Shield size={14} color="var(--text-muted)" />
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>14-day free trial · No credit card · Cancel anytime</span>
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
