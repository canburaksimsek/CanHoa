import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { Home, CheckCircle, ArrowRight } from 'lucide-react'

// ── FEATURES PAGE ─────────────────────────────────────
export function FeaturesPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <nav style={{ padding: '20px 32px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 36, height: 36, background: 'var(--accent-primary)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Home size={18} color="white" /></div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color: 'var(--text-primary)' }}>Can<span style={{ color: 'var(--accent-primary)' }}>Hoa</span></span>
        </Link>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link to="/pricing" className="btn btn-ghost">Pricing</Link>
          <Link to="/register" className="btn btn-primary btn-sm">Start Free Trial</Link>
        </div>
      </nav>
      <div className="container section">
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <h1 style={{ marginBottom: 16 }}>Everything Your HOA Needs</h1>
          <p style={{ fontSize: 18, maxWidth: 560, margin: '0 auto' }}>One platform to replace spreadsheets, email chains, and paper forms.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
          {[
            { emoji: '💳', title: 'Automated Payments', items: ['ACH + credit card processing', 'Autopay enrollment', 'Late fee automation', 'NSF handling', 'Lockbox service', 'USPS physical invoicing', 'Payment plans', '1099 e-filing'] },
            { emoji: '📣', title: 'Communication', items: ['Email broadcasts', 'SMS/text messages', 'Automated phone calls', 'USPS physical mail', 'Emergency alerts', 'Community message boards', 'HOA website builder', 'AI chatbot (Canna)'] },
            { emoji: '🔧', title: 'Maintenance', items: ['Custom request forms', 'Vendor assignment', 'Status pipeline', 'Photo uploads', 'Satisfaction ratings', 'Recurring maintenance', 'Cost tracking', 'SLA management'] },
            { emoji: '📋', title: 'Violations', items: ['30+ violation categories', 'Custom statuses', 'USPS notice mailing', 'Fine automation', 'Hearing workflow', 'Fair Housing compliance', 'CC&R enforcement', 'Violation reports'] },
            { emoji: '📊', title: 'Financial Reports', items: ['Income statement (P&L)', 'Balance sheet', 'Bank reconciliation', 'AR aging report', 'Budget vs actual', 'Reserve fund report', '30+ total reports', 'PDF + Excel export'] },
            { emoji: '🗳️', title: 'Voting & Governance', items: ['Board elections', 'Anonymous ballots', 'Proxy voting', 'Quorum tracking', 'Meeting agendas', 'Virtual meetings', 'State-compliant rules', 'Certified results PDF'] },
          ].map(section => (
            <div key={section.title} className="card" style={{ padding: 28 }}>
              <div style={{ fontSize: 36, marginBottom: 14 }}>{section.emoji}</div>
              <h3 style={{ marginBottom: 16 }}>{section.title}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {section.items.map(item => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <CheckCircle size={14} color="var(--accent-primary)" style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: 14 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 64 }}>
          <Link to="/register" className="btn btn-primary btn-xl">Start Free Trial <ArrowRight size={18} /></Link>
          <p style={{ marginTop: 16, fontSize: 14 }}>No credit card · 14 days free · Setup in 10 minutes</p>
        </div>
      </div>
    </div>
  )
}

// ── PRICING PAGE ──────────────────────────────────────
export function PricingPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)' }}>
      <nav style={{ padding: '20px 32px', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 36, height: 36, background: 'var(--accent-primary)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Home size={18} color="white" /></div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color: 'var(--text-primary)' }}>Can<span style={{ color: 'var(--accent-primary)' }}>Hoa</span></span>
        </Link>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link to="/login" className="btn btn-ghost">Sign In</Link>
          <Link to="/register" className="btn btn-primary btn-sm">Start Free Trial</Link>
        </div>
      </nav>

      <div className="container section-sm" style={{ textAlign: 'center' }}>
        <h1 style={{ marginBottom: 12 }}>Simple, Transparent Pricing</h1>
        <p style={{ fontSize: 18, marginBottom: 48 }}>No hidden fees. No setup costs. No long-term contracts.</p>

        <div className="grid-3" style={{ marginBottom: 48 }}>
          {[
            { name: 'Starter', price: 49, units: 'Up to 50 units', color: '#2b52a0', features: ['All core features', 'Automated payments (ACH + card)', 'Email + SMS communication', 'Violation tracking', 'Document storage (unlimited)', 'Resident portal', 'Mobile app access', 'Email support'] },
            { name: 'Growth', price: 199, units: 'Up to 200 units', color: '#1A365D', featured: true, badge: 'Most Popular', features: ['Everything in Starter', 'Online voting & surveys', 'Amenity booking system', 'USPS physical mailing', 'HOA website builder + AI chatbot', '30+ financial reports', 'Vendor management', 'Onboarding specialist', 'Phone + chat support'] },
            { name: 'Enterprise', price: 349, units: 'Unlimited units', color: '#070d1a', features: ['Everything in Growth', 'Unlimited communities', 'REST API access', 'White-label option', 'SAML SSO', 'Custom integrations', 'Dedicated account manager', 'Priority phone support', 'Custom SLA'] },
          ].map(plan => (
            <div key={plan.name} style={{ background: 'var(--bg-card)', border: `2px solid ${plan.featured ? 'var(--accent-primary)' : 'var(--border-color)'}`, borderRadius: 20, padding: 32, position: 'relative', boxShadow: plan.featured ? '0 0 0 4px rgba(26,54,93,0.12)' : 'none' }}>
              {plan.badge && <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: 'var(--accent-primary)', color: 'white', padding: '4px 16px', borderRadius: 100, fontSize: 12, fontWeight: 700 }}>{plan.badge}</div>}
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{plan.name}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 52, fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1, marginBottom: 4 }}>${plan.price}</div>
              <div style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 8 }}>/month</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent-primary)', marginBottom: 24 }}>{plan.units}</div>
              <Link to="/register" className={`btn w-full ${plan.featured ? 'btn-primary' : 'btn-outline'}`} style={{ justifyContent: 'center', marginBottom: 24 }}>
                Start Free Trial
              </Link>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {plan.features.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, textAlign: 'left' }}>
                    <CheckCircle size={15} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: 1 }} />
                    <span style={{ fontSize: 14 }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ padding: '28px 40px', background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border-color)', maxWidth: 600, margin: '0 auto 48px', textAlign: 'center' }}>
          <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 8 }}>🔒 30-Day Money-Back Guarantee</div>
          <p style={{ fontSize: 15, margin: 0 }}>Not satisfied within 30 days? We'll refund your payment in full — no questions asked. Includes all plans.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, maxWidth: 800, margin: '0 auto' }}>
          {[['No setup fees', 'Free data migration included'], ['No contracts', 'Cancel or change plans anytime'], ['Unlimited storage', 'Documents, photos, records'], ['Free support', 'US-based team M-F 9am-5pm EST']].map(([title, sub]) => (
            <div key={title} style={{ padding: '16px 20px', background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border-color)', textAlign: 'center' }}>
              <CheckCircle size={20} color="var(--accent-primary)" style={{ margin: '0 auto 8px' }} />
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{title}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── LEGAL PAGE ────────────────────────────────────────
const LEGAL_CONTENT = {
  terms: {
    title: 'Terms of Service',
    date: 'April 1, 2026',
    content: [
      { heading: '1. Acceptance of Terms', body: 'By accessing or using CanHoa LLC ("CanHoa," "we," "us," or "our") services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.' },
      { heading: '2. Description of Service', body: 'CanHoa provides cloud-based homeowners association (HOA) management software including payment processing, communication tools, document storage, violation tracking, voting, and related services. All services are provided "as is" and CanHoa reserves the right to modify or discontinue any service at any time.' },
      { heading: '3. Payment Terms', body: 'Subscription fees are billed monthly or annually in advance. All fees are non-refundable except as provided in our 30-Day Money-Back Guarantee for new customers. Processing fees for resident payments are charged per transaction and may be passed through to residents at the HOA manager\'s discretion.' },
      { heading: '4. Data Privacy', body: 'CanHoa is committed to protecting your privacy. We will never sell your community\'s data to third parties. All financial data is processed through Stripe (PCI DSS Level 1 compliant). We maintain CCPA compliance and will respond to verified consumer requests within 45 days.' },
      { heading: '5. Fair Housing', body: 'CanHoa\'s software is designed to support Fair Housing Act compliance. Users are prohibited from using our platform to discriminate against any person on the basis of race, color, national origin, religion, sex, familial status, or disability. CanHoa reserves the right to terminate accounts found in violation of fair housing laws.' },
      { heading: '6. Limitation of Liability', body: 'In no event shall CanHoa be liable for any indirect, incidental, special, exemplary, or consequential damages, including but not limited to loss of profits, data, or goodwill, arising out of or in connection with these terms or the use of our services, even if CanHoa has been advised of the possibility of such damages.' },
      { heading: '7. Arbitration', body: 'Any disputes arising from these terms shall be resolved through binding arbitration in accordance with the American Arbitration Association rules, conducted in Austin, Texas. Class action lawsuits are expressly waived.' },
      { heading: '8. Governing Law', body: 'These terms are governed by the laws of the State of Texas, without regard to its conflict of law provisions. Any legal proceedings shall be conducted in Travis County, Texas.' },
    ]
  },
  privacy: {
    title: 'Privacy Policy',
    date: 'April 1, 2026',
    content: [
      { heading: '1. Information We Collect', body: 'We collect information you provide directly: name, email, payment information (processed by Stripe — we never store card numbers), community data, and usage information. We also collect automatically: IP address, browser type, pages visited, and device information through cookies and similar technologies.' },
      { heading: '2. How We Use Your Information', body: 'We use collected information to: provide and improve our services, process payments, send transactional emails, respond to support requests, send marketing communications (with consent), and comply with legal obligations. We do not sell, rent, or share your personal information with third parties for their marketing purposes.' },
      { heading: '3. California Consumer Privacy Act (CCPA)', body: 'California residents have the right to: know what personal information we collect, delete personal information (with exceptions), opt-out of the sale of personal information (we do not sell data), and non-discrimination for exercising these rights. To submit a request, email privacy@canhoa.com.' },
      { heading: '4. Data Security', body: 'We implement industry-standard security measures including TLS 1.3 encryption in transit, AES-256 encryption at rest, AWS multi-zone backups every 4 hours, two-factor authentication for admin accounts, regular security audits, and SOC 2 Type II certification in progress.' },
      { heading: '5. Cookies', body: 'We use essential cookies for authentication, analytics cookies (Google Analytics 4) to understand usage, and optional marketing cookies. You may opt out of non-essential cookies via our cookie preference center. We comply with the CAN-SPAM Act for all email communications.' },
      { heading: '6. Data Retention', body: 'We retain your data for the duration of your account and for 7 years thereafter for financial records (IRS requirement), 3 years for meeting minutes, and 30 days after account deletion for backups. You may request earlier deletion subject to legal retention requirements.' },
      { heading: '7. Contact', body: 'For privacy questions: privacy@canhoa.com | CanHoa LLC | 1200 S Congress Ave, Austin, TX 78704 | (512) 555-0100' },
    ]
  },
  cookies: {
    title: 'Cookie Policy',
    date: 'April 1, 2026',
    content: [
      { heading: 'What Are Cookies', body: 'Cookies are small text files stored on your device that help us provide a better experience. We use both session cookies (temporary) and persistent cookies (remain until deleted).' },
      { heading: 'Essential Cookies', body: 'Required for the site to function. Include authentication tokens, CSRF protection, and session management. Cannot be disabled without affecting site functionality.' },
      { heading: 'Analytics Cookies', body: 'Google Analytics 4 tracks page views, session duration, and feature usage to help us improve the platform. This data is anonymized and aggregated. You may opt out via Google Analytics Opt-out Browser Add-on.' },
      { heading: 'Your Choices', body: 'You may decline non-essential cookies via our cookie preference center. Most browsers allow you to control cookies through their settings. Note that disabling cookies may affect site functionality.' },
    ]
  }
}

export function LegalPage() {
  const { type } = useParams()
  const content = LEGAL_CONTENT[type] || LEGAL_CONTENT.terms

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)' }}>
      <nav style={{ padding: '20px 32px', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 36, height: 36, background: 'var(--accent-primary)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Home size={18} color="white" /></div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color: 'var(--text-primary)' }}>Can<span style={{ color: 'var(--accent-primary)' }}>Hoa</span></span>
        </Link>
        <div style={{ display: 'flex', gap: 8 }}>
          {[['terms', 'Terms'], ['privacy', 'Privacy'], ['cookies', 'Cookies']].map(([t, l]) => (
            <Link key={t} to={`/legal/${t}`} className="btn btn-ghost btn-sm" style={{ fontWeight: type === t ? 700 : 400, color: type === t ? 'var(--accent-primary)' : 'var(--text-muted)' }}>{l}</Link>
          ))}
        </div>
      </nav>
      <div className="container-sm" style={{ padding: '64px 24px' }}>
        <h1 style={{ marginBottom: 8 }}>{content.title}</h1>
        <p style={{ marginBottom: 48 }}>Last updated: {content.date}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {content.content.map(section => (
            <div key={section.heading}>
              <h3 style={{ marginBottom: 12, color: 'var(--accent-primary)' }}>{section.heading}</h3>
              <p style={{ lineHeight: 1.8, fontSize: 15 }}>{section.body}</p>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 64, padding: '24px 32px', background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border-color)', textAlign: 'center' }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Questions about our legal policies?</div>
          <p style={{ fontSize: 14, marginBottom: 16 }}>Contact our legal team at legal@canhoa.com or call (512) 555-0100</p>
          <Link to="/" className="btn btn-primary btn-sm">Back to Home</Link>
        </div>
      </div>
    </div>
  )
}

export default FeaturesPage
