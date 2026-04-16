import React, { useState } from 'react'
import { useAuth, useToast } from '../../context/AppContext.jsx'
import {
  CreditCard, CheckCircle, Download, Plus, Clock, Wrench,
  FileText, Megaphone, Vote, AlertTriangle, ArrowRight,
  Calendar, Star, Shield, DollarSign, Bell, Eye
} from 'lucide-react'
import {
  COMMUNITY, ANNOUNCEMENTS, DOCUMENTS, VOTES, AMENITIES,
  MAINTENANCE_REQUESTS, PAYMENT_HISTORY
} from '../../data/mockData.js'

// ─────────────────────────────────────────────────────
// RESIDENT DASHBOARD
// ─────────────────────────────────────────────────────
export function ResidentDashboard() {
  const { user } = useAuth()
  const { addToast } = useToast()

  const balance = user?.balance || 0
  const dueDate = user?.dueDate || '2026-05-01'
  const myRequests = MAINTENANCE_REQUESTS.filter(r => r.unit === user?.unit)
  const activeVotes = VOTES.filter(v => v.status === 'Active')

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ marginBottom: 4 }}>Welcome back, {user?.name?.split(' ')[0]}! 👋</h2>
        <p>Unit {user?.unit} · {COMMUNITY.name}</p>
      </div>

      {/* Balance Card */}
      <div style={{ marginBottom: 24, padding: 28, background: balance > 0 ? 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)' : 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)', borderRadius: 20, color: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, opacity: 0.85, marginBottom: 8 }}>
              {balance > 0 ? 'Amount Due' : 'Account Balance'}
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 48, fontWeight: 900, lineHeight: 1, marginBottom: 8 }}>
              ${balance.toFixed(2)}
            </div>
            <div style={{ fontSize: 14, opacity: 0.8 }}>
              {balance > 0 ? `Due by ${dueDate}` : 'All payments current — Thank you!'}
            </div>
          </div>
          {balance > 0 && (
            <button className="btn btn-xl" style={{ background: 'white', color: '#16a34a', fontWeight: 700 }} onClick={() => addToast('Opening payment portal...', 'info')}>
              Pay Now <ArrowRight size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid-4" style={{ marginBottom: 28 }}>
        {[
          { label: 'Monthly Dues', value: `$${COMMUNITY.monthlyDues}`, sub: 'Per month', icon: DollarSign, color: '#22c55e' },
          { label: 'Open Requests', value: myRequests.filter(r => r.status !== 'Resolved').length, sub: 'Maintenance tickets', icon: Wrench, color: '#f59e0b' },
          { label: 'Active Votes', value: activeVotes.length, sub: 'Awaiting your vote', icon: Vote, color: '#8b5cf6' },
          { label: 'Autopay', value: 'Enabled', sub: 'ACH Bank Transfer', icon: CheckCircle, color: '#3b82f6' },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ width: 36, height: 36, background: s.color + '20', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <s.icon size={18} color={s.color} />
              </div>
            </div>
            <div style={{ fontSize: 22, fontFamily: 'var(--font-display)', fontWeight: 900, color: 'var(--text-primary)', marginBottom: 2 }}>{s.value}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 1 }}>{s.label}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        {/* Latest Announcements */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Recent Announcements</div>
            <a href="/portal/announcements" style={{ fontSize: 13, color: 'var(--accent-primary)', fontWeight: 600 }}>View all</a>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {ANNOUNCEMENTS.slice(0, 3).map(ann => (
              <div key={ann.id} style={{ padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: ann.type === 'Emergency' ? 'var(--danger)' : 'var(--accent-primary)', marginTop: 5, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{ann.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{ann.sent}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* My Maintenance Requests */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">My Requests</div>
            <a href="/portal/requests" style={{ fontSize: 13, color: 'var(--accent-primary)', fontWeight: 600 }}>New request</a>
          </div>
          {myRequests.length === 0 ? (
            <div className="empty-state" style={{ padding: '28px 16px' }}>
              <div className="empty-state-icon" style={{ width: 48, height: 48, marginBottom: 12 }}><Wrench size={20} /></div>
              <p style={{ fontSize: 14 }}>No maintenance requests</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {myRequests.map(r => (
                <div key={r.id} style={{ padding: '12px 14px', background: 'var(--bg-secondary)', borderRadius: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{r.title}</div>
                    <span className="badge badge-yellow" style={{ fontSize: 11 }}>{r.status}</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Submitted {r.created}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Active Votes */}
      {activeVotes.length > 0 && (
        <div className="card" style={{ marginTop: 24, padding: 24, border: '2px solid var(--accent-primary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <Bell size={18} color="var(--accent-primary)" />
            <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--accent-primary)' }}>Your Vote is Needed!</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {activeVotes.map(v => (
              <div key={v.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, padding: '12px 16px', background: 'var(--bg-secondary)', borderRadius: 10 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{v.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Deadline: {v.deadline}</div>
                </div>
                <button className="btn btn-primary btn-sm" onClick={() => addToast('Voting page opened!', 'info')}>Cast Your Vote</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────
// RESIDENT PAYMENTS
// ─────────────────────────────────────────────────────
export function ResidentPayments() {
  const { user } = useAuth()
  const { addToast } = useToast()
  const [tab, setTab] = useState('overview')
  const [payMethod, setPayMethod] = useState('ach')
  const [processing, setProcessing] = useState(false)

  const handlePay = async () => {
    setProcessing(true)
    await new Promise(r => setTimeout(r, 1500))
    setProcessing(false)
    addToast('Payment of $285.00 submitted successfully! Receipt emailed.', 'success')
  }

  const myPayments = PAYMENT_HISTORY.filter(p => p.unit === user?.unit)

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ marginBottom: 4 }}>Payments</h2>
        <p>Manage dues, view payment history, and set up autopay</p>
      </div>

      <div className="tabs">
        {['overview', 'history', 'autopay'].map(t => <div key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{t.charAt(0).toUpperCase() + t.slice(1)}</div>)}
      </div>

      {tab === 'overview' && (
        <div className="grid-2" style={{ gap: 24 }}>
          {/* Pay Now */}
          <div className="card" style={{ padding: 28 }}>
            <h3 style={{ marginBottom: 20 }}>Make a Payment</h3>
            <div style={{ padding: '16px 20px', background: 'var(--bg-secondary)', borderRadius: 12, marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>Monthly Dues (May 2026)</span>
                <span style={{ fontWeight: 700, fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--text-primary)' }}>${COMMUNITY.monthlyDues}.00</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Due by May 1, 2026 · Grace period: {COMMUNITY.gracePeriod} days</div>
            </div>

            <div className="form-group">
              <label className="form-label">Payment Method</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { id: 'ach', label: 'ACH Bank Transfer', sub: '$2.45 flat fee', icon: '🏦' },
                  { id: 'card', label: 'Credit / Debit Card', sub: '3.5% + $0.50 fee', icon: '💳' },
                ].map(m => (
                  <label key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', border: `2px solid ${payMethod === m.id ? 'var(--accent-primary)' : 'var(--border-color)'}`, borderRadius: 10, cursor: 'pointer', background: payMethod === m.id ? 'var(--accent-light)' : 'var(--bg-card)', transition: 'all 0.15s' }}>
                    <input type="radio" name="payMethod" checked={payMethod === m.id} onChange={() => setPayMethod(m.id)} style={{ accentColor: 'var(--accent-primary)' }} />
                    <span style={{ fontSize: 18 }}>{m.icon}</span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{m.label}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{m.sub}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div style={{ padding: '14px 16px', background: 'var(--bg-secondary)', borderRadius: 10, marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 6 }}>
                <span style={{ color: 'var(--text-muted)' }}>Monthly dues</span>
                <span>${COMMUNITY.monthlyDues}.00</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 8 }}>
                <span style={{ color: 'var(--text-muted)' }}>Processing fee</span>
                <span>{payMethod === 'ach' ? '$2.45' : `$${(COMMUNITY.monthlyDues * 0.035 + 0.50).toFixed(2)}`}</span>
              </div>
              <div style={{ height: 1, background: 'var(--border-color)', margin: '8px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 700 }}>
                <span>Total</span>
                <span style={{ color: 'var(--accent-primary)' }}>${payMethod === 'ach' ? (COMMUNITY.monthlyDues + 2.45).toFixed(2) : (COMMUNITY.monthlyDues * 1.035 + 0.50).toFixed(2)}</span>
              </div>
            </div>

            <button className="btn btn-primary w-full btn-lg" disabled={processing} onClick={handlePay} style={{ justifyContent: 'center' }}>
              {processing ? 'Processing...' : `Pay $${COMMUNITY.monthlyDues}.00 Securely`}
              {!processing && <Shield size={16} />}
            </button>

            <div style={{ textAlign: 'center', marginTop: 12 }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                <Shield size={12} /> Secured by Stripe · PCI DSS Level 1
              </div>
            </div>
          </div>

          {/* Account Summary */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ marginBottom: 16 }}>Account Summary</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  ['Current Balance', `$${user?.balance || 0}`, user?.balance > 0 ? 'var(--danger)' : 'var(--success)'],
                  ['Monthly Dues', `$${COMMUNITY.monthlyDues}`, 'var(--text-primary)'],
                  ['Due Date', 'May 1, 2026', 'var(--text-primary)'],
                  ['Late Fee (if late)', `$${COMMUNITY.lateFee}`, 'var(--warning)'],
                  ['Grace Period', `${COMMUNITY.gracePeriod} days`, 'var(--text-muted)'],
                ].map(([k, v, color]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-color)' }}>
                    <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>{k}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card" style={{ padding: 20, border: '2px solid var(--accent-primary)', background: 'var(--accent-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <CheckCircle size={18} color="var(--accent-primary)" />
                <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--accent-primary)' }}>Autopay Active</span>
              </div>
              <p style={{ fontSize: 13, margin: '0 0 12px' }}>Your dues are automatically charged via ACH on the 1st of each month.</p>
              <button className="btn btn-secondary btn-sm" onClick={() => addToast('Autopay settings updated', 'success')}>Manage Autopay</button>
            </div>
          </div>
        </div>
      )}

      {tab === 'history' && (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr><th>Date</th><th>Description</th><th>Method</th><th>Amount</th><th>Status</th><th>Receipt</th></tr>
            </thead>
            <tbody>
              {(myPayments.length > 0 ? myPayments : PAYMENT_HISTORY.slice(0, 5)).map(p => (
                <tr key={p.id}>
                  <td style={{ fontSize: 13, color: 'var(--text-muted)' }}>{p.date}</td>
                  <td style={{ fontWeight: 500 }}>{p.type}</td>
                  <td><span className="badge badge-gray">{p.method}</span></td>
                  <td><span style={{ fontWeight: 700, fontFamily: 'var(--font-display)', fontSize: 15 }}>${p.amount.toFixed(2)}</span></td>
                  <td><span className={`badge ${p.status === 'Completed' ? 'badge-green' : 'badge-red'}`}>{p.status}</span></td>
                  <td>
                    {p.receipt
                      ? <button className="btn btn-ghost btn-sm" onClick={() => addToast('Receipt downloaded', 'success')}><Download size={13} /> PDF</button>
                      : <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>—</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'autopay' && (
        <div className="card" style={{ maxWidth: 520, padding: 32 }}>
          <h3 style={{ marginBottom: 20 }}>Autopay Settings</h3>
          <div style={{ padding: '16px 20px', background: 'var(--accent-light)', borderRadius: 12, marginBottom: 24, border: '1px solid var(--accent-primary)' }}>
            <div style={{ fontWeight: 700, marginBottom: 4, color: 'var(--accent-primary)' }}>✓ Autopay Enabled</div>
            <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>ACH Bank Transfer · Charged on the 1st of each month</div>
          </div>
          <div className="form-group">
            <label className="form-label">Payment Method</label>
            <div style={{ padding: '14px 16px', background: 'var(--bg-secondary)', borderRadius: 10, fontSize: 14 }}>
              🏦 Bank of America ····4523 (Checking)
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Notification</label>
            <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>You receive an email 3 days before each autopay charge.</div>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn btn-secondary" onClick={() => addToast('Bank account updated', 'success')}>Update Bank Account</button>
            <button className="btn btn-danger" onClick={() => addToast('Autopay paused', 'warning')}>Pause Autopay</button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────
// RESIDENT REQUESTS
// ─────────────────────────────────────────────────────
export function ResidentRequests() {
  const { user } = useAuth()
  const { addToast } = useToast()
  const [showNew, setShowNew] = useState(false)
  const [form, setForm] = useState({ title: '', category: 'Plumbing', priority: 'Normal', description: '' })

  const myRequests = MAINTENANCE_REQUESTS.filter(r => r.unit === user?.unit)

  const STATUS_COLORS = { New: '#6366f1', Assigned: '#f59e0b', Scheduled: '#3b82f6', 'In Progress': '#f97316', 'Pending Approval': '#8b5cf6', Resolved: '#22c55e', Closed: '#6b7280' }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ marginBottom: 4 }}>Maintenance Requests</h2>
          <p>Submit and track work orders for Unit {user?.unit}</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowNew(true)}><Plus size={14} /> New Request</button>
      </div>

      {myRequests.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><Wrench size={28} /></div>
          <h3>No maintenance requests</h3>
          <p>Submit a request and we'll get it taken care of.</p>
          <button className="btn btn-primary" onClick={() => setShowNew(true)}>Submit Request</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {myRequests.map(r => (
            <div key={r.id} className="card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14, flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <h3 style={{ fontSize: 16, marginBottom: 6 }}>{r.title}</h3>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <span className="badge badge-gray">{r.category}</span>
                    <span className="badge" style={{ background: (STATUS_COLORS[r.status] || '#6b7280') + '20', color: STATUS_COLORS[r.status] || '#6b7280' }}>{r.status}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right', fontSize: 13, color: 'var(--text-muted)' }}>Submitted {r.created}</div>
              </div>
              <p style={{ fontSize: 14, marginBottom: 14 }}>{r.description}</p>
              {r.assignedTo && (
                <div style={{ fontSize: 13, padding: '10px 14px', background: 'var(--bg-secondary)', borderRadius: 8 }}>
                  Assigned to: <strong>{r.assignedTo}</strong>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showNew && (
        <div className="modal-backdrop" onClick={() => setShowNew(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h3>Submit Maintenance Request</h3><button className="btn btn-ghost btn-icon" onClick={() => setShowNew(false)}>✕</button></div>
            <div className="modal-body">
              <div className="form-group"><label className="form-label">Issue Title *</label><input className="form-input" placeholder="Brief description of the problem" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-select" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                    {['Plumbing', 'Electrical', 'HVAC', 'Appliance', 'Pest Control', 'Safety Concern', 'Other'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select className="form-select" value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}>
                    {['Emergency', 'High', 'Normal', 'Low'].map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Detailed Description *</label>
                <textarea className="form-textarea" placeholder="Please provide as much detail as possible..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>
              <div style={{ padding: '10px 14px', background: 'var(--bg-secondary)', borderRadius: 8, fontSize: 13, color: 'var(--text-muted)' }}>
                📷 Photo upload available in the CanHoa mobile app
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowNew(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => { addToast('Request submitted! We\'ll be in touch soon.', 'success'); setShowNew(false) }}>Submit Request</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────
// RESIDENT DOCUMENTS
// ─────────────────────────────────────────────────────
export function ResidentDocuments() {
  const { addToast } = useToast()
  const publicDocs = DOCUMENTS.filter(d => d.access === 'Residents' || d.access === 'Public')

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ marginBottom: 4 }}>Community Documents</h2>
        <p>Access governing documents, meeting minutes, and community resources</p>
      </div>

      <div className="grid-2" style={{ gap: 16 }}>
        {publicDocs.map(doc => (
          <div key={doc.id} className="card" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, background: '#fef2f2', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: '#dc2626', flexShrink: 0 }}>
              {doc.type}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{doc.folder} · {doc.size}</div>
            </div>
            <button className="btn btn-ghost btn-sm btn-icon" onClick={() => addToast('Document downloaded', 'success')}>
              <Download size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────
// RESIDENT ANNOUNCEMENTS
// ─────────────────────────────────────────────────────
export function ResidentAnnouncements() {
  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ marginBottom: 4 }}>Announcements</h2>
        <p>Stay informed about your community</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {ANNOUNCEMENTS.map(ann => (
          <div key={ann.id} className="card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
                  <h3 style={{ fontSize: 16, margin: 0 }}>{ann.title}</h3>
                  <span className={`badge ${ann.type === 'Emergency' ? 'badge-red' : ann.type === 'Meeting' ? 'badge-blue' : 'badge-green'}`}>{ann.type}</span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{ann.sent} · From {COMMUNITY.name}</div>
              </div>
            </div>
            <p style={{ fontSize: 15, lineHeight: 1.7 }}>{ann.body}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────
// RESIDENT VOTING
// ─────────────────────────────────────────────────────
export function ResidentVoting() {
  const { addToast } = useToast()
  const [voted, setVoted] = useState({})

  const castVote = (voteId, choice) => {
    setVoted(v => ({ ...v, [voteId]: choice }))
    addToast(`Your vote has been recorded! ${VOTES.find(v => v.id === voteId)?.anonymous ? '(Anonymous)' : ''}`, 'success')
  }

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ marginBottom: 4 }}>Voting & Surveys</h2>
        <p>Your voice matters — participate in community decisions</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {VOTES.map(vote => {
          const hasVoted = voted[vote.id]
          const total = vote.yesVotes + vote.noVotes + vote.abstain
          const pct = vote.eligible > 0 ? Math.round((total / vote.eligible) * 100) : 0

          return (
            <div key={vote.id} className="card" style={{ padding: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
                    <h3 style={{ fontSize: 17, margin: 0 }}>{vote.title}</h3>
                    <span className={`badge ${vote.status === 'Active' ? 'badge-green' : 'badge-gray'}`}>{vote.status}</span>
                    {vote.anonymous && <span className="badge badge-purple">Anonymous Ballot</span>}
                  </div>
                  <p style={{ fontSize: 14, margin: '0 0 8px', maxWidth: 520 }}>{vote.description}</p>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                    Deadline: <strong>{vote.deadline}</strong> · {pct}% participation · Quorum: {vote.quorum}% required
                  </div>
                </div>
              </div>

              {vote.status === 'Active' && !hasVoted ? (
                <div>
                  <div style={{ marginBottom: 12, fontSize: 14, fontWeight: 600 }}>Cast Your Vote:</div>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    <button className="btn btn-primary" onClick={() => castVote(vote.id, 'yes')} style={{ background: '#16a34a' }}>
                      ✓ Yes / Support
                    </button>
                    <button className="btn btn-danger" onClick={() => castVote(vote.id, 'no')}>
                      ✕ No / Oppose
                    </button>
                    <button className="btn btn-secondary" onClick={() => castVote(vote.id, 'abstain')}>
                      — Abstain
                    </button>
                  </div>
                </div>
              ) : hasVoted ? (
                <div style={{ padding: '14px 18px', background: 'var(--accent-light)', borderRadius: 10, border: '1px solid var(--accent-primary)', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <CheckCircle size={18} color="var(--accent-primary)" />
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--accent-primary)' }}>
                    You voted: <strong>{hasVoted.charAt(0).toUpperCase() + hasVoted.slice(1)}</strong>
                    {vote.anonymous && ' (Anonymous)'}
                  </span>
                </div>
              ) : (
                <div style={{ padding: '12px 16px', background: 'var(--bg-secondary)', borderRadius: 10, fontSize: 14 }}>
                  {vote.passed !== undefined ? (
                    <span className={`badge ${vote.passed ? 'badge-green' : 'badge-red'}`} style={{ padding: '6px 14px', fontSize: 13 }}>
                      {vote.passed ? '✓ PASSED' : '✕ DID NOT PASS'}
                    </span>
                  ) : 'Voting closed'}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
