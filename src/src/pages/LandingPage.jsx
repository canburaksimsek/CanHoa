import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTheme } from '../context/AppContext.jsx'
import {
  CreditCard, Wrench, FileText, Megaphone, Vote, BarChart3,
  Shield, Zap, Users, CheckCircle, ArrowRight, Star,
  Sun, Moon, Home, Menu, X, Phone, Mail, MapPin,
  ChevronDown, Play, TrendingUp, Clock, Award, Globe
} from 'lucide-react'

const FEATURES = [
  { icon: CreditCard, title: 'Automated Payments', desc: 'Collect dues, late fees, and special assessments automatically. ACH, credit card, and autopay support with full Stripe integration.', color: '#2b52a0' },
  { icon: Megaphone, title: 'Mass Communication', desc: 'Send email, SMS, and phone call alerts to all residents or targeted groups. Emergency broadcasts in one click.', color: '#3b82f6' },
  { icon: Wrench, title: 'Maintenance Tracking', desc: 'Custom request forms, vendor assignment, photo uploads, and real-time status updates for every work order.', color: '#f59e0b' },
  { icon: Vote, title: 'Online Voting', desc: 'Conduct board elections and resident surveys with anonymous ballot support and quorum tracking.', color: '#8b5cf6' },
  { icon: FileText, title: 'Document Library', desc: 'Store CC&Rs, bylaws, meeting minutes, and financial records with role-based access control.', color: '#ef4444' },
  { icon: BarChart3, title: '30+ Reports', desc: 'Income statements, balance sheets, delinquency aging, budget vs actual. Export to PDF or Excel.', color: '#0d9488' },
]

const STATS = [
  { value: '5,000+', label: 'HOA Communities', icon: Home },
  { value: '93%', label: 'Avg Collection Rate', icon: TrendingUp },
  { value: '< 10 min', label: 'Setup Time', icon: Clock },
  { value: '4.9★', label: 'Customer Rating', icon: Award },
]

const PRICING_PLANS = [
  {
    name: 'Starter',
    price: 49,
    units: 'Up to 50 units',
    desc: 'Perfect for small self-managed communities',
    features: ['Automated dues & invoicing', 'ACH + credit card payments', 'Email & SMS communication', 'Violation tracking', 'Document storage', 'Resident portal', 'Basic reporting', 'Email support'],
    cta: 'Start Free Trial',
    featured: false
  },
  {
    name: 'Growth',
    price: 199,
    units: 'Up to 200 units',
    desc: 'Everything a growing HOA needs',
    features: ['Everything in Starter', 'Online voting & surveys', 'Amenity booking system', 'Advanced financial reports', 'Vendor management', 'Maintenance workflows', 'USPS physical mailing', 'Phone & chat support', 'Onboarding specialist'],
    cta: 'Start Free Trial',
    featured: true,
    badge: 'Most Popular'
  },
  {
    name: 'Enterprise',
    price: 349,
    units: 'Unlimited units',
    desc: 'For large communities and management companies',
    features: ['Everything in Growth', 'Unlimited units & HOAs', 'REST API access', 'White-label option', 'SSO (SAML 2.0)', 'Custom integrations', 'Dedicated account manager', 'Priority phone support', 'Custom SLA'],
    cta: 'Contact Sales',
    featured: false
  }
]

const TESTIMONIALS = [
  { quote: "CanHoa saved us over $40,000 annually compared to our old management company. The automation alone is worth every penny.", name: "Patricia W.", role: "Board President", community: "Stonegate Ridge HOA, TX", rating: 5 },
  { quote: "Setup took less than 20 minutes. Our residents love the portal. Collection rate went from 76% to 97% in 3 months.", name: "Marcus R.", role: "HOA Manager", community: "Lakewood Villas, FL", rating: 5 },
  { quote: "The USPS mailing feature changed everything. We send violation notices directly from the portal with delivery tracking.", name: "Sandra T.", role: "Community Manager", community: "Oakview Commons, AZ", rating: 5 },
]

const FAQ_ITEMS = [
  { q: 'Is there a setup fee?', a: 'No setup fees ever. We handle all data migration including units, owners, and starting balances at no charge.' },
  { q: 'Can I import my existing data?', a: 'Yes. We import data from AppFolio, Buildium, PayHOA, TOPS, or any CSV export. Our onboarding specialists handle it for you.' },
  { q: 'How does payment processing work?', a: 'We use Stripe to process ACH/eCheck ($2.45 flat) and credit cards (3.5%+$0.50). You choose whether to absorb fees or pass them to residents. Funds go directly to your HOA bank account.' },
  { q: 'Is there a contract or minimum commitment?', a: 'No long-term contracts and no cancellation fees. Cancel anytime. We also offer a 30-day money-back guarantee for new customers.' },
  { q: 'How secure is resident financial data?', a: 'CanHoa uses 256-bit AES encryption at rest and TLS 1.3 in transit. Payment data is handled entirely by Stripe (PCI DSS Level 1) — we never store card numbers.' },
  { q: 'Do you support multiple HOA communities?', a: 'Yes. Property management companies can manage multiple communities under one login with a volume discount on Enterprise plans.' },
  { q: 'What states are you compliant with?', a: 'Our platform includes legal templates for CA (Davis-Stirling), FL, TX, NY, AZ, NV, CO, and WA. Our legal team updates state-specific requirements regularly.' },
  { q: 'Do you offer a mobile app?', a: 'Yes. Native iOS and Android apps are available for both managers and residents with full feature parity and biometric login support.' },
]

function Navbar({ scrolled }) {
  const { theme, toggleTheme } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      background: scrolled ? 'var(--bg-card)' : 'transparent',
      borderBottom: scrolled ? '1px solid var(--border-color)' : 'none',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      transition: 'all 0.3s ease',
      padding: '0 24px',
      height: 68,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
        <div style={{ width: 36, height: 36, background: 'var(--accent-primary)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Home size={18} color="white" />
        </div>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, color: scrolled ? 'var(--text-primary)' : 'white' }}>
          Can<span style={{ color: scrolled ? 'var(--accent-primary)' : '#5c84d6' }}>Hoa</span>
        </span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="desktop-nav">
        {[['Features', '/features'], ['Pricing', '/pricing']].map(([label, path]) => (
          <Link key={label} to={path} style={{ fontSize: 15, fontWeight: 500, color: scrolled ? 'var(--text-primary)' : 'rgba(255,255,255,0.9)', textDecoration: 'none', transition: 'color 0.2s' }}>
            {label}
          </Link>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={toggleTheme} className="btn btn-ghost btn-icon" style={{ color: scrolled ? 'var(--text-primary)' : 'white' }}>
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
        <Link to="/login" className="btn btn-ghost" style={{ color: scrolled ? 'var(--text-primary)' : 'white', fontSize: 14 }}>Sign In</Link>
        <Link to="/register" className="btn btn-primary btn-sm">Start Free Trial</Link>
      </div>

      <style>{`.desktop-nav { } @media(max-width:768px){.desktop-nav{display:none}}`}</style>
    </nav>
  )
}

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)
  const [billingAnnual, setBillingAnnual] = useState(false)
  const [openFaq, setOpenFaq] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar scrolled={scrolled} />

      {/* ── HERO ── */}
      <section className="hero-section">
        <div className="hero-grid" />
        <div className="container" style={{ position: 'relative', zIndex: 1, paddingTop: 120, paddingBottom: 80 }}>
          <div style={{ maxWidth: 780, margin: '0 auto', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', background: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.3)', borderRadius: 100, marginBottom: 24 }}>
              <Zap size={14} color="#5c84d6" />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#5c84d6' }}>Trusted by 5,000+ HOA Communities Nationwide</span>
            </div>

            <h1 style={{ color: 'white', marginBottom: 24, fontFamily: 'var(--font-display)' }}>
              The Smartest Way to<br />
              <span style={{ color: '#5c84d6' }}>Manage Your HOA</span>
            </h1>

            <p style={{ fontSize: 20, color: 'rgba(255,255,255,0.75)', marginBottom: 40, lineHeight: 1.6 }}>
              Automate dues collection, streamline communication, track violations, and run board elections — all from one platform built specifically for American homeowner associations.
            </p>

            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 20 }}>
              <Link to="/register" className="btn btn-primary btn-xl" style={{ background: '#2b52a0', fontSize: 17 }}>
                Start Free 14-Day Trial
                <ArrowRight size={18} />
              </Link>
              <button className="btn btn-xl" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1.5px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(10px)', fontSize: 17 }}>
                <Play size={16} />
                Watch Demo
              </button>
            </div>

            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
              No credit card required · Setup in under 10 minutes · Cancel anytime
            </p>
          </div>

          {/* Stats */}
          <div className="grid-4" style={{ marginTop: 72, maxWidth: 900, margin: '72px auto 0' }}>
            {STATS.map(s => (
              <div key={s.label} style={{ textAlign: 'center', padding: '20px 16px', background: 'rgba(255,255,255,0.07)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)' }}>
                <div style={{ fontSize: 32, fontFamily: 'var(--font-display)', fontWeight: 900, color: '#5c84d6', marginBottom: 4 }}>{s.value}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="section" style={{ background: 'var(--bg-primary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 14px', background: 'var(--accent-light)', borderRadius: 100, marginBottom: 16 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Everything You Need</span>
            </div>
            <h2 className="section-title">One Platform. Complete Control.</h2>
            <p className="section-subtitle" style={{ margin: '16px auto 0' }}>
              Replace spreadsheets, email chains, and paper forms with a single platform designed for HOA boards and professional managers.
            </p>
          </div>

          <div className="grid-3">
            {FEATURES.map(f => (
              <div key={f.title} className="feature-card">
                <div className="feature-icon" style={{ background: f.color + '18', color: f.color }}>
                  <f.icon size={24} />
                </div>
                <h3 style={{ fontSize: 18, marginBottom: 12 }}>{f.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEMO CTAS ── */}
      <section className="section-sm" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <Link to="/login" style={{ display: 'block', textDecoration: 'none', padding: 28, background: 'var(--bg-card)', border: '2px solid var(--border-color)', borderRadius: 20, transition: 'all 0.2s' }} onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-primary)'; e.currentTarget.style.transform = 'translateY(-2px)' }} onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.transform = 'none' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Manager Login</div>
              <div style={{ fontSize: 20, fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text-primary)', marginBottom: 6 }}>HOA Manager & Board Portal →</div>
              <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>Full dashboard: payments, residents, maintenance, reports, and more</div>
              <div style={{ marginTop: 16, fontSize: 12, color: 'var(--text-muted)', padding: '8px 12px', background: 'var(--bg-secondary)', borderRadius: 8 }}>
                Demo: manager@canhoa.com / demo123
              </div>
            </Link>
            <Link to="/login" style={{ display: 'block', textDecoration: 'none', padding: 28, background: 'var(--bg-card)', border: '2px solid var(--border-color)', borderRadius: 20, transition: 'all 0.2s' }} onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-primary)'; e.currentTarget.style.transform = 'translateY(-2px)' }} onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.transform = 'none' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Resident Login</div>
              <div style={{ fontSize: 20, fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text-primary)', marginBottom: 6 }}>Homeowner Resident Portal →</div>
              <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>Pay dues, submit requests, view documents, vote on community matters</div>
              <div style={{ marginTop: 16, fontSize: 12, color: 'var(--text-muted)', padding: '8px 12px', background: 'var(--bg-secondary)', borderRadius: 8 }}>
                Demo: resident@canhoa.com / demo123
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 className="section-title">Loved by HOA Managers Nationwide</h2>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 16 }}>
              <div style={{ display: 'flex', gap: 2 }}>
                {[1,2,3,4,5].map(i => <Star key={i} size={18} color="#f59e0b" fill="#f59e0b" />)}
              </div>
              <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>4.9/5 from 500+ verified reviews</span>
            </div>
          </div>

          <div className="grid-3">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="card" style={{ padding: 32 }}>
                <div style={{ display: 'flex', gap: 2, marginBottom: 20 }}>
                  {[1,2,3,4,5].map(s => <Star key={s} size={16} color="#f59e0b" fill="#f59e0b" />)}
                </div>
                <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--text-primary)', fontStyle: 'italic', marginBottom: 24 }}>
                  "{t.quote}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div className="avatar avatar-md" style={{ background: 'var(--accent-primary)', color: 'white', fontFamily: 'var(--font-display)' }}>
                    {t.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t.role}</div>
                    <div style={{ fontSize: 12, color: 'var(--accent-primary)', fontWeight: 600 }}>{t.community}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 className="section-title">Simple, Transparent Pricing</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: 28 }}>No hidden fees. No setup costs. Cancel anytime.</p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '8px 16px', background: 'var(--bg-card)', borderRadius: 100, border: '1px solid var(--border-color)' }}>
              <button onClick={() => setBillingAnnual(false)} style={{ padding: '6px 16px', borderRadius: 100, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13, background: !billingAnnual ? 'var(--accent-primary)' : 'transparent', color: !billingAnnual ? 'white' : 'var(--text-muted)' }}>Monthly</button>
              <button onClick={() => setBillingAnnual(true)} style={{ padding: '6px 16px', borderRadius: 100, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13, background: billingAnnual ? 'var(--accent-primary)' : 'transparent', color: billingAnnual ? 'white' : 'var(--text-muted)' }}>
                Annual <span style={{ fontSize: 11, background: '#fef3c7', color: '#92400e', padding: '2px 6px', borderRadius: 4, marginLeft: 4 }}>Save 10%</span>
              </button>
            </div>
          </div>

          <div className="grid-3">
            {PRICING_PLANS.map(plan => (
              <div key={plan.name} className={'pricing-card ' + (plan.featured ? 'featured' : '')} style={{ position: 'relative' }}>
                {plan.featured && (
                  <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: 'var(--accent-primary)', color: 'white', padding: '4px 16px', borderRadius: 100, fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap' }}>
                    {plan.badge}
                  </div>
                )}
                <div style={{ marginBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{plan.name}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, marginBottom: 4 }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 44, fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1 }}>
                    ${billingAnnual ? Math.round(plan.price * 0.9) : plan.price}
                  </span>
                  <span style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 6 }}>/month</span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent-primary)', marginBottom: 8 }}>{plan.units}</div>
                <p style={{ fontSize: 14, marginBottom: 28, lineHeight: 1.6 }}>{plan.desc}</p>
                <Link to={plan.name === 'Enterprise' ? '/contact' : '/register'} className={'btn w-full ' + (plan.featured ? 'btn-primary' : 'btn-outline')} style={{ marginBottom: 28, justifyContent: 'center' }}>
                  {plan.cta} <ArrowRight size={15} />
                </Link>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {plan.features.map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <CheckCircle size={16} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: 1 }} />
                      <span style={{ fontSize: 14, color: 'var(--text-primary)' }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 40, padding: '24px 32px', background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border-color)', maxWidth: 600, margin: '40px auto 0' }}>
            <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 16 }}>🔒 30-Day Money-Back Guarantee</div>
            <p style={{ fontSize: 14 }}>Try CanHoa risk-free. If you're not completely satisfied within the first 30 days, we'll refund your payment in full — no questions asked.</p>
          </div>
        </div>
      </section>

      {/* ── TRUST BADGES ── */}
      <section className="section-sm" style={{ borderTop: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Built for Compliance & Security</p>
          </div>
          <div className="grid-4">
            {[
              { label: 'PCI DSS Level 1', sub: 'via Stripe', icon: Shield },
              { label: '256-bit Encryption', sub: 'AES + TLS 1.3', icon: Shield },
              { label: 'Fair Housing Act', sub: 'Compliant', icon: CheckCircle },
              { label: 'CCPA Compliant', sub: 'Privacy Protected', icon: Globe },
            ].map(b => (
              <div key={b.label} style={{ textAlign: 'center', padding: '20px 16px', border: '1px solid var(--border-color)', borderRadius: 12 }}>
                <b.icon size={24} color="var(--accent-primary)" style={{ marginBottom: 8 }} />
                <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>{b.label}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{b.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container-sm">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 className="section-title">Frequently Asked Questions</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 12, overflow: 'hidden' }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: '100%', padding: '18px 22px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, textAlign: 'left' }}
                >
                  <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>{item.q}</span>
                  <ChevronDown size={18} color="var(--text-muted)" style={{ transform: openFaq === i ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }} />
                </button>
                {openFaq === i && (
                  <div style={{ padding: '0 22px 18px', fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7 }}>{item.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: 'linear-gradient(135deg, #070d1a 0%, #0a1628 100%)', padding: '96px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <h2 style={{ color: 'white', marginBottom: 20, fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            Ready to Modernize Your HOA?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 18, marginBottom: 40, lineHeight: 1.6 }}>
            Join 5,000+ communities that have transformed HOA management with CanHoa. Setup takes less than 10 minutes.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-xl" style={{ background: '#2b52a0', color: 'white', fontSize: 17 }}>
              Start Free 14-Day Trial <ArrowRight size={18} />
            </Link>
            <button className="btn btn-xl" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1.5px solid rgba(255,255,255,0.3)', fontSize: 17 }}>
              <Phone size={16} /> Schedule Demo
            </button>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, marginTop: 20 }}>
            No credit card · No contract · 30-day money-back guarantee
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: '#040f08', borderTop: '1px solid rgba(255,255,255,0.07)', padding: '64px 24px 32px' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 48 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 36, height: 36, background: 'var(--accent-primary)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Home size={18} color="white" />
                </div>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, color: 'white' }}>
                  Can<span style={{ color: '#5c84d6' }}>Hoa</span>
                </span>
              </div>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, marginBottom: 20, maxWidth: 280 }}>
                The all-in-one HOA management platform trusted by 5,000+ communities across America.
              </p>
              <div style={{ display: 'flex', gap: 12 }}>
                {['Twitter', 'LinkedIn', 'Facebook'].map(s => (
                  <div key={s} style={{ width: 36, height: 36, background: 'rgba(255,255,255,0.08)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 700 }}>
                    {s[0]}
                  </div>
                ))}
              </div>
            </div>

            {[
              { title: 'Product', links: ['Features', 'Pricing', 'Changelog', 'Roadmap', 'API Docs', 'Security'] },
              { title: 'Company', links: ['About', 'Careers', 'Blog', 'Press', 'Contact'] },
              { title: 'Legal', links: [['Privacy Policy', '/legal/privacy'], ['Terms of Service', '/legal/terms'], ['Cookie Policy', '/legal/cookies'], 'DMCA', 'Accessibility'] },
            ].map(col => (
              <div key={col.title}>
                <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.4)', marginBottom: 16 }}>{col.title}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {col.links.map(link => {
                    const [label, path] = Array.isArray(link) ? link : [link, '#']
                    return (
                      <Link key={label} to={path} style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#5c84d6'} onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.55)'}>
                        {label}
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>
              © 2026 CanHoa LLC. All rights reserved. · Austin, TX
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>
              Fair Housing Act Compliant · CCPA Compliant · PCI DSS Secured
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
