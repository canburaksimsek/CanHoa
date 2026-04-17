import React, { useState } from 'react'
import { useAuth, useToast } from '../../context/AppContext.jsx'
import { useNavigate } from 'react-router-dom'
import {
  DollarSign, Users, Wrench, AlertTriangle, TrendingUp, Shield,
  Bell, CheckCircle, Plus, ArrowRight, Calendar, Clock,
  Download, FileText, CreditCard, Megaphone, BarChart3
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import {
  COMMUNITY, FINANCIAL_SUMMARY, MONTHLY_COLLECTIONS, EXPENSE_CATEGORIES,
  DELINQUENCY_AGING, RESIDENTS, ACTIVITY_FEED, PENDING_APPROVALS, COMMUNITY_EVENTS,
  MAINTENANCE_REQUESTS, VIOLATIONS
} from '../../data/mockData.js'

const CT = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background:'var(--bg-card)', border:'1px solid var(--border-color)', borderRadius:10, padding:'10px 14px', boxShadow:'var(--shadow-lg)' }}>
      <div style={{ fontSize:11, fontWeight:700, color:'var(--text-muted)', marginBottom:5 }}>{label}</div>
      {payload.map(p=><div key={p.name} style={{ fontSize:12, fontWeight:600, color:p.color||'var(--accent-primary)' }}>{p.name}: ${(p.value||0).toLocaleString()}</div>)}
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()
  const COLORS = ['#16a34a','#22c55e','#4ade80','#86efac','#bbf7d0','#dcfce7','#6366f1','#f97316']

  const delinquent = RESIDENTS.filter(r=>r.status==='delinquent')
  const failedAutopay = RESIDENTS.filter(r=>r.autopay && r.status==='delinquent')
  const overdueMaint = MAINTENANCE_REQUESTS.filter(r=>r.status==='New' && r.priority==='Emergency')
  const openViolations = VIOLATIONS.filter(v=>v.status==='Open').length
  const expiringSoon = [
    { name:'TechElectric Pro', type:'Contract', expires:'2026-06-30' },
    { name:'CleanVent Services', type:'Insurance', expires:'2026-08-20' },
    { name:'Mike\'s Plumbing', type:'Insurance', expires:'2026-11-15' },
  ]

  return (
    <div>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:28, flexWrap:'wrap', gap:16 }}>
        <div>
          <h2 style={{ marginBottom:4 }}>Manager Dashboard</h2>
          <p>{COMMUNITY.name} · {COMMUNITY.totalUnits} units · {COMMUNITY.state}</p>
        </div>
        <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
          <button className="btn btn-secondary btn-sm" onClick={()=>addToast('New announcement composer opened','info')}><Megaphone size={14}/> Announcement</button>
          <button className="btn btn-primary btn-sm" onClick={()=>navigate('/dashboard/payments')}><DollarSign size={14}/> Add Charge</button>
        </div>
      </div>

      {/* Alert Banners */}
      {failedAutopay.length>0 && (
        <div style={{ padding:'12px 18px', background:'#fef2f2', border:'1px solid #fecaca', borderLeft:'4px solid var(--danger)', borderRadius:12, marginBottom:16, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <Bell size={16} color="var(--danger)"/>
            <strong style={{ fontSize:14, color:'#991b1b' }}>{failedAutopay.length} autopay failure{failedAutopay.length>1?'s':''} this cycle</strong>
            <span style={{ fontSize:13, color:'#991b1b' }}>— {failedAutopay.map(r=>r.name).join(', ')}</span>
          </div>
          <button className="btn btn-sm btn-danger" onClick={()=>navigate('/dashboard/payments')}>Review <ArrowRight size={13}/></button>
        </div>
      )}
      {PENDING_APPROVALS.length>0 && (
        <div style={{ padding:'12px 18px', background:'#fffbeb', border:'1px solid #fde68a', borderLeft:'4px solid #d97706', borderRadius:12, marginBottom:16, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <Clock size={16} color="#d97706"/>
            <strong style={{ fontSize:14, color:'#92400e' }}>{PENDING_APPROVALS.length} items awaiting approval</strong>
          </div>
          <button className="btn btn-sm" style={{ background:'#d97706', color:'white' }} onClick={()=>navigate('/board')}>Review <ArrowRight size={13}/></button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid-4" style={{ marginBottom:24 }}>
        {[
          { label:'MTD Collections', value:`$${FINANCIAL_SUMMARY.mtdCollected.toLocaleString()}`, sub:`${FINANCIAL_SUMMARY.collectionRate}% rate`, color:'#16a34a', icon:DollarSign, trend:'+2.3% vs last month', up:true },
          { label:'Operating Balance', value:`$${FINANCIAL_SUMMARY.operatingBalance.toLocaleString()}`, sub:`Book: $${FINANCIAL_SUMMARY.bookBalance.toLocaleString()}`, color:'#0284c7', icon:TrendingUp, trend:'Reconciliation needed', up:null },
          { label:'Delinquent Units', value:FINANCIAL_SUMMARY.delinquentUnits, sub:`$${FINANCIAL_SUMMARY.totalUnpaid.toLocaleString()} outstanding`, color:'#ef4444', icon:AlertTriangle, trend:'+1 from last month', up:false },
          { label:'Reserve Fund', value:`$${(FINANCIAL_SUMMARY.reserveBalance/1000).toFixed(0)}K`, sub:'62% of target funded', color:FINANCIAL_SUMMARY.reserveBalance/COMMUNITY.reserveTarget<0.6?'#d97706':'#16a34a', icon:Shield, trend:'On track for 2034', up:true },
        ].map(s=>(
          <div key={s.label} className="stat-card">
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
              <div style={{ width:38, height:38, background:s.color+'18', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <s.icon size={18} color={s.color}/>
              </div>
              {s.up!==null && <span style={{ fontSize:11, fontWeight:600, color:s.up?'var(--success)':'var(--danger)' }}>{s.up?'↑':'↓'} {s.trend}</span>}
            </div>
            <div style={{ fontSize:24, fontFamily:'var(--font-display)', fontWeight:900, color:s.color, marginBottom:3 }}>{s.value}</div>
            <div style={{ fontSize:13, fontWeight:700, color:'var(--text-primary)', marginBottom:2 }}>{s.label}</div>
            <div style={{ fontSize:12, color:'var(--text-muted)' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="card" style={{ marginBottom:24, padding:20 }}>
        <div className="card-title" style={{ marginBottom:14 }}>Quick Actions</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(130px,1fr))', gap:10 }}>
          {[
            { label:'Add Charge', icon:CreditCard, color:'#16a34a', to:'/dashboard/payments' },
            { label:'New Violation', icon:AlertTriangle, color:'#ef4444', to:'/dashboard/violations' },
            { label:'New Request', icon:Wrench, color:'#f59e0b', to:'/dashboard/maintenance' },
            { label:'Announcement', icon:Megaphone, color:'#8b5cf6', to:'/dashboard/announcements' },
            { label:'Reports', icon:BarChart3, color:'#0284c7', to:'/dashboard/reports' },
            { label:'New Resident', icon:Users, color:'#f97316', to:'/dashboard/residents' },
          ].map(qa=>(
            <button key={qa.label} onClick={()=>navigate(qa.to)} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8, padding:'14px 10px', background:'var(--bg-secondary)', border:'1px solid var(--border-color)', borderRadius:12, cursor:'pointer', transition:'var(--transition)' }}
              onMouseEnter={e=>e.currentTarget.style.borderColor='var(--accent-primary)'}
              onMouseLeave={e=>e.currentTarget.style.borderColor='var(--border-color)'}>
              <div style={{ width:36, height:36, background:qa.color+'18', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <qa.icon size={18} color={qa.color}/>
              </div>
              <span style={{ fontSize:12, fontWeight:600, color:'var(--text-primary)' }}>{qa.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Charts Row */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 360px', gap:20, marginBottom:20 }}>
        {/* Revenue chart */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Revenue vs. Target — Last 12 Months</div>
            <button className="btn btn-secondary btn-sm" onClick={()=>navigate('/dashboard/reports')}><BarChart3 size={13}/> Full Reports</button>
          </div>
          <ResponsiveContainer width="100%" height={210}>
            <AreaChart data={MONTHLY_COLLECTIONS} margin={{top:5,right:10,left:0,bottom:0}}>
              <defs>
                <linearGradient id="dg1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16a34a" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)"/>
              <XAxis dataKey="month" tick={{fontSize:10,fill:'var(--text-muted)'}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:10,fill:'var(--text-muted)'}} axisLine={false} tickLine={false} tickFormatter={v=>`$${v/1000}K`}/>
              <Tooltip content={<CT/>}/>
              <Area type="monotone" dataKey="target" name="Target" stroke="var(--border-strong)" strokeDasharray="4 2" strokeWidth={1.5} fill="none"/>
              <Area type="monotone" dataKey="collected" name="Collected" stroke="#16a34a" strokeWidth={2.5} fill="url(#dg1)" dot={{fill:'#16a34a',r:2}} activeDot={{r:5}}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Expense pie */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Monthly Expenses</div>
            <span style={{ fontSize:12, color:'var(--text-muted)' }}>${EXPENSE_CATEGORIES.reduce((s,c)=>s+c.amount,0).toLocaleString()} total</span>
          </div>
          <ResponsiveContainer width="100%" height={170}>
            <PieChart>
              <Pie data={EXPENSE_CATEGORIES} dataKey="amount" nameKey="name" cx="50%" cy="50%" outerRadius={65} innerRadius={30}>
                {EXPENSE_CATEGORIES.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}
              </Pie>
              <Tooltip formatter={v=>[`$${v.toLocaleString()}`,'Amount']}/>
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display:'flex', flexDirection:'column', gap:5, marginTop:4 }}>
            {EXPENSE_CATEGORIES.slice(0,4).map((c,i)=>(
              <div key={c.name} style={{ display:'flex', alignItems:'center', gap:8, fontSize:11 }}>
                <div style={{ width:8, height:8, borderRadius:'50%', background:COLORS[i], flexShrink:0 }}/>
                <span style={{ flex:1, color:'var(--text-muted)' }}>{c.name}</span>
                <span style={{ fontWeight:700, color:'var(--text-primary)' }}>${c.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:20 }}>
        {/* AR Aging */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">AR Aging</div>
            <button className="btn btn-primary btn-sm" onClick={()=>navigate('/dashboard/payments')}>View Details</button>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {DELINQUENCY_AGING.map(row=>(
              <div key={row.bucket} style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:76, fontSize:12, fontWeight:600, color:'var(--text-muted)', flexShrink:0 }}>{row.bucket}</div>
                <div style={{ flex:1 }}>
                  <div className="progress-bar" style={{ height:8 }}>
                    <div className="progress-fill" style={{ width:`${row.pct}%`, background:row.bucket==='Current'?'var(--success)':row.bucket==='1-30 days'?'var(--warning)':'var(--danger)'}}/>
                  </div>
                </div>
                <span style={{ fontSize:12, fontWeight:700, width:46, textAlign:'right' }}>{row.units}</span>
                <span style={{ fontSize:12, color:'var(--text-muted)', width:68, textAlign:'right' }}>${row.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop:14, padding:'10px 14px', background:'var(--bg-secondary)', borderRadius:10, display:'flex', justifyContent:'space-between' }}>
            <span style={{ fontSize:13, fontWeight:700 }}>Total Overdue</span>
            <span style={{ fontSize:16, fontWeight:900, fontFamily:'var(--font-display)', color:'var(--danger)' }}>${FINANCIAL_SUMMARY.totalUnpaid.toLocaleString()}</span>
          </div>
        </div>

        {/* Expiring Documents/Contracts Alert */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">⚠️ Expiring Soon</div>
            <span className="badge badge-yellow">{expiringSoon.length} items</span>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:16 }}>
            {expiringSoon.map((item,i)=>{
              const daysLeft = Math.ceil((new Date(item.expires)-new Date())/86400000)
              return (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 12px', background:daysLeft<60?'#fffbeb':'var(--bg-secondary)', borderRadius:10, border:`1px solid ${daysLeft<60?'#fde68a':'var(--border-color)'}` }}>
                  <Bell size={16} color={daysLeft<60?'#d97706':'var(--text-muted)'}/>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:600, fontSize:13 }}>{item.name}</div>
                    <div style={{ fontSize:12, color:'var(--text-muted)' }}>{item.type} · Expires {item.expires}</div>
                  </div>
                  <span style={{ fontSize:11, fontWeight:700, color:daysLeft<30?'var(--danger)':daysLeft<60?'#d97706':'var(--text-muted)' }}>{daysLeft}d</span>
                </div>
              )
            })}
          </div>
          {/* Upcoming events */}
          <div className="card-title" style={{ marginBottom:10, fontSize:13 }}>Upcoming Events</div>
          {COMMUNITY_EVENTS.slice(0,2).map(ev=>(
            <div key={ev.id} style={{ display:'flex', gap:10, padding:'8px 0', borderBottom:'1px solid var(--border-color)' }}>
              <Calendar size={14} color="var(--accent-primary)" style={{ flexShrink:0, marginTop:2 }}/>
              <div>
                <div style={{ fontWeight:600, fontSize:13 }}>{ev.title}</div>
                <div style={{ fontSize:11, color:'var(--text-muted)' }}>{ev.date} · {ev.time} · {ev.rsvpCount} RSVPs</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity + Open maintenance */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
        {/* Activity feed */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Recent Activity</div>
            <span style={{ fontSize:12, color:'var(--text-muted)' }}>Live feed</span>
          </div>
          <div style={{ display:'flex', flexDirection:'column' }}>
            {ACTIVITY_FEED.map(item=>(
              <div key={item.id} style={{ display:'flex', gap:12, padding:'10px 0', borderBottom:'1px solid var(--border-color)' }}>
                <div style={{ width:8, height:8, borderRadius:'50%', marginTop:5, flexShrink:0, background:item.type==='payment'?'var(--success)':item.type==='alert'?'var(--danger)':item.type==='violation'?'#d97706':'var(--accent-primary)' }}/>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, color:'var(--text-primary)', lineHeight:1.4 }}>{item.text}</div>
                  <div style={{ fontSize:11, color:'var(--text-muted)', marginTop:2 }}>{item.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Open Maintenance */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Open Maintenance</div>
            <button className="btn btn-primary btn-sm" onClick={()=>navigate('/dashboard/maintenance')}>View All</button>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {MAINTENANCE_REQUESTS.filter(r=>r.status!=='Resolved').slice(0,5).map(req=>(
              <div key={req.id} style={{ display:'flex', alignItems:'flex-start', gap:12, padding:'10px 12px', background:req.priority==='Emergency'?'#fef2f2':req.priority==='High'?'#fffbeb':'var(--bg-secondary)', borderRadius:10, border:`1px solid ${req.priority==='Emergency'?'#fecaca':req.priority==='High'?'#fde68a':'var(--border-color)'}` }}>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:3 }}>
                    <span style={{ fontWeight:700, fontSize:13 }}>{req.title}</span>
                    <span className={`badge ${req.priority==='Emergency'?'badge-red':req.priority==='High'?'badge-yellow':'badge-gray'}`} style={{ fontSize:10 }}>{req.priority}</span>
                  </div>
                  <div style={{ fontSize:12, color:'var(--text-muted)' }}>Unit {req.unit} · {req.status} · {req.assignedTo||'Unassigned'}</div>
                </div>
                <span className={`badge ${req.status==='New'?'badge-red':req.status==='Assigned'?'badge-blue':'badge-yellow'}`} style={{ fontSize:10, flexShrink:0 }}>{req.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
