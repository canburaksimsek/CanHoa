import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AppContext.jsx'
import {
  TrendingUp, Users, Wrench, AlertTriangle, CreditCard,
  Megaphone, ArrowRight, ArrowUp, ArrowDown, Clock,
  CheckCircle, XCircle, AlertCircle, DollarSign,
  BarChart3, FileText, Vote, Activity
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell
} from 'recharts'
import {
  COMMUNITY, FINANCIAL_SUMMARY, MONTHLY_COLLECTIONS,
  EXPENSE_CATEGORIES, ACTIVITY_FEED, MAINTENANCE_REQUESTS,
  RESIDENTS, DELINQUENCY_AGING
} from '../../data/mockData.js'

function StatCard({ icon: Icon, label, value, change, changeDir, sub, color = 'var(--accent-primary)', to }) {
  const card = (
    <div className="stat-card" style={{ cursor: to ? 'pointer' : 'default' }}>
      <div className="stat-icon" style={{ background: color + '18', color }}>
        <Icon size={20} />
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      {(change || sub) && (
        <div className={`stat-change ${changeDir || ''}`} style={{ color: changeDir === 'up' ? 'var(--success)' : changeDir === 'down' ? 'var(--danger)' : 'var(--text-muted)' }}>
          {changeDir === 'up' && <ArrowUp size={12} style={{ display: 'inline' }} />}
          {changeDir === 'down' && <ArrowDown size={12} style={{ display: 'inline' }} />}
          {change || sub}
        </div>
      )}
    </div>
  )
  return to ? <Link to={to} style={{ textDecoration: 'none' }}>{card}</Link> : card
}

const ACTIVITY_ICONS = {
  payment: { icon: CreditCard, color: '#22c55e', bg: '#dcfce7' },
  request: { icon: Wrench, color: '#f59e0b', bg: '#fef3c7' },
  vote: { icon: Vote, color: '#8b5cf6', bg: '#f5f3ff' },
  violation: { icon: AlertTriangle, color: '#ef4444', bg: '#fef2f2' },
  document: { icon: FileText, color: '#3b82f6', bg: '#eff6ff' },
  announcement: { icon: Megaphone, color: '#0d9488', bg: '#f0fdfa' },
  alert: { icon: AlertCircle, color: '#ef4444', bg: '#fef2f2' },
  move: { icon: Users, color: '#6366f1', bg: '#eef2ff' },
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 10, padding: '10px 14px', boxShadow: 'var(--shadow-lg)' }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>{label}</div>
      {payload.map(p => (
        <div key={p.name} style={{ fontSize: 13, fontWeight: 600, color: p.color }}>
          {p.name}: ${p.value.toLocaleString()}
        </div>
      ))}
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const openRequests = MAINTENANCE_REQUESTS.filter(r => r.status !== 'Resolved').length
  const delinquentCount = RESIDENTS.filter(r => r.status === 'delinquent').length
  const urgentRequest = MAINTENANCE_REQUESTS.find(r => r.priority === 'Emergency')

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h2 style={{ marginBottom: 4 }}>Good morning, {user?.name?.split(' ')[0]} 👋</h2>
            <p style={{ fontSize: 15 }}>{COMMUNITY.name} · {COMMUNITY.totalUnits} units · {COMMUNITY.state}</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Link to="/dashboard/announcements" className="btn btn-secondary btn-sm">
              <Megaphone size={14} /> New Announcement
            </Link>
            <Link to="/dashboard/payments" className="btn btn-primary btn-sm">
              <DollarSign size={14} /> View Payments
            </Link>
          </div>
        </div>
      </div>

      {/* Emergency Alert */}
      {urgentRequest && (
        <div style={{ padding: '14px 20px', background: '#fef2f2', border: '1px solid #fecaca', borderLeft: '4px solid var(--danger)', borderRadius: 12, marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <AlertCircle size={18} color="var(--danger)" />
            <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--danger)' }}>Emergency: </span>
            <span style={{ fontSize: 14, color: '#7f1d1d' }}>{urgentRequest.title} — Unit {urgentRequest.unit}</span>
          </div>
          <Link to="/dashboard/maintenance" className="btn btn-danger btn-sm">View Now</Link>
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid-4" style={{ marginBottom: 28 }}>
        <StatCard icon={DollarSign} label="MTD Collected" value={`$${FINANCIAL_SUMMARY.mtdCollected.toLocaleString()}`} change={`${FINANCIAL_SUMMARY.collectionRate}% collection rate`} changeDir="up" color="#22c55e" to="/dashboard/payments" />
        <StatCard icon={Users} label="Delinquent Units" value={delinquentCount} change={`$${FINANCIAL_SUMMARY.totalUnpaid.toLocaleString()} overdue`} changeDir="down" color="var(--danger)" to="/dashboard/payments" />
        <StatCard icon={Wrench} label="Open Requests" value={openRequests} change="2 need assignment" color="#f59e0b" to="/dashboard/maintenance" />
        <StatCard icon={TrendingUp} label="Reserve Balance" value={`$${(FINANCIAL_SUMMARY.reserveBalance/1000).toFixed(0)}K`} change="+$1,100 this month" changeDir="up" color="#3b82f6" to="/dashboard/reports" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24, marginBottom: 24 }}>
        {/* Collections Chart */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Monthly Collections vs Target</div>
            <span className="badge badge-green">93.2% avg</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={MONTHLY_COLLECTIONS} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="collectGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v/1000}K`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="target" stroke="var(--border-strong)" strokeDasharray="4 2" strokeWidth={1.5} fill="none" name="Target" />
              <Area type="monotone" dataKey="collected" stroke="#22c55e" strokeWidth={2.5} fill="url(#collectGrad)" name="Collected" dot={{ fill: '#22c55e', strokeWidth: 2 }} activeDot={{ r: 6 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Expense Breakdown */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">April Expenses</div>
            <Link to="/dashboard/reports" style={{ fontSize: 13, color: 'var(--accent-primary)', fontWeight: 600 }}>Full Report →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {EXPENSE_CATEGORIES.map(cat => (
              <div key={cat.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{cat.name}</span>
                  <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>${cat.amount.toLocaleString()} / ${cat.budget.toLocaleString()}</span>
                </div>
                <div className="progress-bar" style={{ height: 6 }}>
                  <div className="progress-fill" style={{ width: `${(cat.amount/cat.budget)*100}%`, background: cat.color }} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, padding: '12px 16px', background: 'var(--bg-secondary)', borderRadius: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, fontWeight: 700 }}>Total Expenses</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent-primary)' }}>
                ${FINANCIAL_SUMMARY.mtdExpenses.toLocaleString()} / ${(EXPENSE_CATEGORIES.reduce((s, c) => s + c.budget, 0)).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        {/* Recent Activity */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Recent Activity</div>
            <span style={{ fontSize: 13, color: 'var(--accent-primary)', fontWeight: 600, cursor: 'pointer' }}>View all</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {ACTIVITY_FEED.slice(0, 6).map(item => {
              const conf = ACTIVITY_ICONS[item.type] || ACTIVITY_ICONS.payment
              return (
                <div key={item.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border-color)' }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: conf.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <conf.icon size={15} color={conf.color} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.4 }}>{item.text}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{item.time}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Delinquency & Quick Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Delinquency Aging */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Delinquency Aging</div>
              <Link to="/dashboard/payments" style={{ fontSize: 13, color: 'var(--accent-primary)', fontWeight: 600 }}>Manage →</Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {DELINQUENCY_AGING.map(row => (
                <div key={row.bucket} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 80, fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', flexShrink: 0 }}>{row.bucket}</div>
                  <div style={{ flex: 1 }}>
                    <div className="progress-bar" style={{ height: 6 }}>
                      <div className="progress-fill" style={{ width: `${row.pct}%`, background: row.bucket === 'Current' ? 'var(--success)' : row.bucket === '1-30 days' ? 'var(--warning)' : 'var(--danger)' }} />
                    </div>
                  </div>
                  <div style={{ width: 60, textAlign: 'right', fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{row.units} units</div>
                  <div style={{ width: 70, textAlign: 'right', fontSize: 12, color: 'var(--text-muted)' }}>${row.amount.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Quick Actions</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { label: 'Collect Dues', icon: CreditCard, to: '/dashboard/payments', color: '#22c55e' },
                { label: 'Send Alert', icon: Megaphone, to: '/dashboard/announcements', color: '#3b82f6' },
                { label: 'New Ticket', icon: Wrench, to: '/dashboard/maintenance', color: '#f59e0b' },
                { label: 'Run Report', icon: BarChart3, to: '/dashboard/reports', color: '#8b5cf6' },
              ].map(a => (
                <Link key={a.label} to={a.to} style={{ textDecoration: 'none', padding: '12px 14px', background: 'var(--bg-secondary)', borderRadius: 10, border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s', color: 'var(--text-primary)', fontWeight: 600, fontSize: 13 }} onMouseEnter={e => { e.currentTarget.style.borderColor = a.color; e.currentTarget.style.color = a.color }} onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.color = 'var(--text-primary)' }}>
                  <a.icon size={16} color={a.color} />
                  {a.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
