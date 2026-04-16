// ── RESIDENTS PAGE ───────────────────────────────────
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useToast } from '../../context/AppContext.jsx'
import {
  Search, UserPlus, Download, Mail, Phone, Filter,
  CheckCircle, XCircle, AlertTriangle, MoreHorizontal,
  ChevronDown, CreditCard, Wrench, FileText, Users,
  ArrowUpDown
} from 'lucide-react'
import { RESIDENTS, COMMUNITY } from '../../data/mockData.js'

export function Residents() {
  const { addToast } = useToast()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('unit')
  const [selectedId, setSelectedId] = useState(null)

  const filtered = RESIDENTS
    .filter(r => {
      const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) || r.unit.toLowerCase().includes(search.toLowerCase()) || r.email.toLowerCase().includes(search.toLowerCase())
      const matchFilter = filter === 'all' || (filter === 'delinquent' && r.status === 'delinquent') || (filter === 'current' && r.status === 'current') || (filter === 'autopay' && r.autopay)
      return matchSearch && matchFilter
    })
    .sort((a, b) => sort === 'name' ? a.name.localeCompare(b.name) : a.unit.localeCompare(b.unit))

  const selected = RESIDENTS.find(r => r.id === selectedId)

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ marginBottom: 4 }}>Residents</h2>
          <p>{COMMUNITY.totalUnits} units · {RESIDENTS.filter(r => r.status === 'delinquent').length} delinquent · {RESIDENTS.filter(r => r.autopay).length} on autopay</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary btn-sm" onClick={() => addToast('CSV export started', 'success')}>
            <Download size={14} /> Export
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => addToast('Invite sent!', 'success')}>
            <UserPlus size={14} /> Invite Resident
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        {[
          { label: 'Total Residents', value: RESIDENTS.length, color: '#22c55e' },
          { label: 'Current (Paid)', value: RESIDENTS.filter(r => r.status === 'current').length, color: '#3b82f6' },
          { label: 'Delinquent', value: RESIDENTS.filter(r => r.status === 'delinquent').length, color: '#ef4444' },
          { label: 'On Autopay', value: RESIDENTS.filter(r => r.autopay).length, color: '#8b5cf6' },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: '16px 20px' }}>
            <div style={{ fontSize: 28, fontFamily: 'var(--font-display)', fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div className="search-box" style={{ flex: 1, minWidth: 200 }}>
          <Search size={16} className="search-icon" />
          <input type="text" className="form-input" placeholder="Search by name, unit, or email..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 40 }} />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[['All', 'all'], ['Current', 'current'], ['Delinquent', 'delinquent'], ['Autopay', 'autopay']].map(([label, val]) => (
            <button key={val} onClick={() => setFilter(val)} className="btn btn-sm" style={{ background: filter === val ? 'var(--accent-primary)' : 'var(--bg-card)', color: filter === val ? 'white' : 'var(--text-muted)', border: '1px solid var(--border-color)' }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Resident</th>
              <th>Unit</th>
              <th>Contact</th>
              <th>Balance</th>
              <th>Status</th>
              <th>Autopay</th>
              <th>Move-In</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedId(selectedId === r.id ? null : r.id)}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="avatar avatar-sm">{r.avatar}</div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{r.name}</div>
                    </div>
                  </div>
                </td>
                <td><span style={{ fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--accent-primary)' }}>{r.unit}</span></td>
                <td>
                  <div style={{ fontSize: 13 }}>
                    <div style={{ color: 'var(--text-muted)' }}>{r.email}</div>
                    <div style={{ color: 'var(--text-muted)' }}>{r.phone}</div>
                  </div>
                </td>
                <td>
                  <span style={{ fontWeight: 700, color: r.balance > 0 ? 'var(--danger)' : 'var(--success)', fontFamily: 'var(--font-display)', fontSize: 15 }}>
                    ${r.balance.toFixed(2)}
                  </span>
                  {r.daysOverdue && <div style={{ fontSize: 11, color: 'var(--danger)' }}>{r.daysOverdue} days overdue</div>}
                </td>
                <td>
                  <span className={`badge ${r.status === 'current' ? 'badge-green' : 'badge-red'}`}>
                    {r.status === 'current' ? '✓ Current' : '! Delinquent'}
                  </span>
                </td>
                <td>
                  {r.autopay
                    ? <CheckCircle size={16} color="var(--success)" />
                    : <XCircle size={16} color="var(--text-muted)" />
                  }
                </td>
                <td style={{ fontSize: 13, color: 'var(--text-muted)' }}>{r.moveIn}</td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-ghost btn-sm btn-icon" onClick={e => { e.stopPropagation(); addToast(`Email sent to ${r.name}`, 'success') }}>
                      <Mail size={14} />
                    </button>
                    <button className="btn btn-ghost btn-sm btn-icon">
                      <MoreHorizontal size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Expanded resident detail */}
      {selected && (
        <div className="card" style={{ marginTop: 20, padding: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div className="avatar avatar-xl">{selected.avatar}</div>
              <div>
                <h3 style={{ marginBottom: 4 }}>{selected.name}</h3>
                <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>Unit {selected.unit} · {COMMUNITY.name}</div>
                <span className={`badge ${selected.status === 'current' ? 'badge-green' : 'badge-red'}`} style={{ marginTop: 6, display: 'inline-flex' }}>
                  {selected.status === 'current' ? 'In Good Standing' : `Delinquent — ${selected.daysOverdue} days`}
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-secondary btn-sm" onClick={() => addToast('Message sent!', 'success')}>
                <Mail size={14} /> Send Message
              </button>
              {selected.balance > 0 && (
                <button className="btn btn-primary btn-sm" onClick={() => addToast('Payment reminder sent!', 'success')}>
                  <CreditCard size={14} /> Send Payment Reminder
                </button>
              )}
            </div>
          </div>
          <div className="grid-3">
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Contact</div>
              <div style={{ fontSize: 14, marginBottom: 6 }}><Mail size={13} style={{ display: 'inline', marginRight: 6 }} />{selected.email}</div>
              <div style={{ fontSize: 14 }}><Phone size={13} style={{ display: 'inline', marginRight: 6 }} />{selected.phone}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Account</div>
              <div style={{ fontSize: 14, marginBottom: 6 }}>Balance: <strong style={{ color: selected.balance > 0 ? 'var(--danger)' : 'var(--success)' }}>${selected.balance.toFixed(2)}</strong></div>
              <div style={{ fontSize: 14, marginBottom: 6 }}>Autopay: <strong>{selected.autopay ? 'Enabled' : 'Disabled'}</strong></div>
              <div style={{ fontSize: 14 }}>Move-in: <strong>{selected.moveIn}</strong></div>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Actions</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <button className="btn btn-secondary btn-sm" onClick={() => addToast('Adding charge...', 'info')}>+ Add Charge</button>
                <button className="btn btn-secondary btn-sm" onClick={() => addToast('Opening violations...', 'info')}>View Violations</button>
                <button className="btn btn-secondary btn-sm" onClick={() => addToast('Opening requests...', 'info')}>View Requests</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── PAYMENTS PAGE ─────────────────────────────────────
import { PAYMENT_HISTORY, FINANCIAL_SUMMARY as FIN } from '../../data/mockData.js'

export function Payments() {
  const { addToast } = useToast()
  const [tab, setTab] = useState('transactions')
  const [search, setSearch] = useState('')

  const filtered = PAYMENT_HISTORY.filter(p =>
    p.resident.toLowerCase().includes(search.toLowerCase()) ||
    p.unit.toLowerCase().includes(search.toLowerCase()) ||
    p.type.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ marginBottom: 4 }}>Payments & Finance</h2>
          <p>Manage dues, track collections, and view financial reports</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary btn-sm" onClick={() => addToast('Exporting transactions...', 'info')}>
            <Download size={14} /> Export
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => addToast('Charge added!', 'success')}>
            + Add Charge
          </button>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="grid-4" style={{ marginBottom: 28 }}>
        {[
          { label: 'MTD Collected', value: `$${FIN.mtdCollected.toLocaleString()}`, color: '#22c55e', sub: `${FIN.collectionRate}% rate` },
          { label: 'MTD Expenses', value: `$${FIN.mtdExpenses.toLocaleString()}`, color: '#ef4444', sub: 'vs $15k budget' },
          { label: 'Operating Balance', value: `$${FIN.operatingBalance.toLocaleString()}`, color: '#3b82f6', sub: 'Bank verified' },
          { label: 'Reserve Fund', value: `$${(FIN.reserveBalance/1000).toFixed(0)}K`, color: '#8b5cf6', sub: '62% funded' },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: '18px 22px' }}>
            <div style={{ fontSize: 26, fontFamily: 'var(--font-display)', fontWeight: 900, color: s.color, marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{s.label}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="tabs">
        {['transactions', 'delinquent', 'autopay', 'invoices'].map(t => (
          <div key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </div>
        ))}
      </div>

      {tab === 'transactions' && (
        <>
          <div style={{ marginBottom: 16 }}>
            <div className="search-box">
              <Search size={16} className="search-icon" />
              <input className="form-input" placeholder="Search transactions..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 40 }} />
            </div>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Resident / Unit</th>
                  <th>Type</th>
                  <th>Method</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Receipt</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id}>
                    <td style={{ fontSize: 13, color: 'var(--text-muted)' }}>{p.date}</td>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{p.resident}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Unit {p.unit}</div>
                    </td>
                    <td style={{ fontSize: 13 }}>{p.type}</td>
                    <td>
                      <span className="badge badge-gray">{p.method}</span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, fontFamily: 'var(--font-display)', fontSize: 15, color: p.status === 'Failed' ? 'var(--danger)' : 'var(--text-primary)' }}>
                        ${p.amount.toLocaleString()}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${p.status === 'Completed' ? 'badge-green' : p.status === 'Failed' ? 'badge-red' : 'badge-yellow'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td>
                      {p.receipt ? (
                        <button className="btn btn-ghost btn-sm" onClick={() => addToast(`Receipt ${p.receipt} downloaded`, 'success')}>
                          <Download size={13} /> PDF
                        </button>
                      ) : (
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === 'delinquent' && (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr><th>Resident</th><th>Unit</th><th>Balance</th><th>Days Overdue</th><th>Last Payment</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {RESIDENTS.filter(r => r.status === 'delinquent').map(r => (
                <tr key={r.id}>
                  <td><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><div className="avatar avatar-sm">{r.avatar}</div><span style={{ fontWeight: 600 }}>{r.name}</span></div></td>
                  <td><strong style={{ color: 'var(--accent-primary)' }}>{r.unit}</strong></td>
                  <td><strong style={{ color: 'var(--danger)', fontFamily: 'var(--font-display)', fontSize: 16 }}>${r.balance.toFixed(2)}</strong></td>
                  <td><span className="badge badge-red">{r.daysOverdue} days</span></td>
                  <td style={{ fontSize: 13, color: 'var(--text-muted)' }}>–</td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => addToast('Payment reminder sent!', 'success')}>Send Reminder</button>
                      <button className="btn btn-secondary btn-sm" onClick={() => addToast('Mail sent via USPS!', 'info')}>Mail Notice</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'autopay' && (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr><th>Resident</th><th>Unit</th><th>Autopay Method</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {RESIDENTS.map(r => (
                <tr key={r.id}>
                  <td><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><div className="avatar avatar-sm">{r.avatar}</div><span style={{ fontWeight: 600 }}>{r.name}</span></div></td>
                  <td><strong style={{ color: 'var(--accent-primary)' }}>{r.unit}</strong></td>
                  <td style={{ fontSize: 13 }}>{r.autopay ? 'ACH Bank Transfer' : '—'}</td>
                  <td>{r.autopay ? <span className="badge badge-green">Enrolled</span> : <span className="badge badge-gray">Not Enrolled</span>}</td>
                  <td>
                    <button className="btn btn-secondary btn-sm" onClick={() => addToast(r.autopay ? 'Autopay cancelled' : 'Enrollment invitation sent!', r.autopay ? 'warning' : 'success')}>
                      {r.autopay ? 'Cancel' : 'Invite to Enroll'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'invoices' && (
        <div style={{ textAlign: 'center', padding: '48px 24px' }}>
          <div style={{ width: 64, height: 64, background: 'var(--bg-secondary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <FileText size={28} color="var(--text-muted)" />
          </div>
          <h3 style={{ marginBottom: 12 }}>Invoice Center</h3>
          <p style={{ marginBottom: 24 }}>Send monthly invoices to all residents or create individual charges</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={() => addToast('Monthly invoices sent to all 124 residents!', 'success')}>Send Monthly Invoices</button>
            <button className="btn btn-secondary" onClick={() => addToast('Custom charge form opened', 'info')}>Create Custom Charge</button>
          </div>
        </div>
      )}
    </div>
  )
}
