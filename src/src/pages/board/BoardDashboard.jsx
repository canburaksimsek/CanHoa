import React, { useState } from 'react'
import { useAuth, useToast } from '../../context/AppContext.jsx'
import { generatePDF, generateExcel } from '../../utils/reportGenerator.js'
import {
  Shield, FileText, Vote, DollarSign, AlertTriangle, CheckCircle,
  Download, Plus, Users, Clock, BarChart3, Lock, Bell, Calendar,
  ChevronRight, Eye, Gavel, BookOpen, TrendingUp, Star, ArrowRight
} from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts'
import {
  COMMUNITY, FINANCIAL_SUMMARY, MONTHLY_COLLECTIONS, EXPENSE_CATEGORIES,
  DELINQUENCY_AGING, VOTES, VIOLATIONS, MAINTENANCE_REQUESTS
} from '../../data/mockData.js'

const BOARD_MEMBERS = [
  { id:'bm-001', name:'Patricia Williams', role:'President', email:'p.williams@oakwoodhoa.com', termStart:'2024-01-01', termEnd:'2027-12-31', phone:'(512) 555-0201', avatar:'PW', committee:'Finance' },
  { id:'bm-002', name:'Marcus Reynolds', role:'Vice President', email:'m.reynolds@oakwoodhoa.com', termStart:'2024-01-01', termEnd:'2027-12-31', phone:'(512) 555-0202', avatar:'MR', committee:'Maintenance' },
  { id:'bm-003', name:'Sandra Torres', role:'Treasurer', email:'s.torres@oakwoodhoa.com', termStart:'2023-01-01', termEnd:'2026-12-31', phone:'(512) 555-0203', avatar:'ST', committee:'Finance' },
  { id:'bm-004', name:'Kevin Park', role:'Secretary', email:'k.park@oakwoodhoa.com', termStart:'2023-01-01', termEnd:'2026-12-31', phone:'(512) 555-0204', avatar:'KP', committee:'Communications' },
  { id:'bm-005', name:'Rachel Adams', role:'Member at Large', email:'r.adams@oakwoodhoa.com', termStart:'2024-01-01', termEnd:'2027-12-31', phone:'(512) 555-0205', avatar:'RA', committee:'ARC' },
]
const PENDING_APPROVALS = [
  { id:'pa-001', type:'ARC Request', title:'Solar panel installation — Unit 4B', submittedBy:'James Chen', unit:'4B', date:'2026-04-10', status:'Pending Committee', priority:'Normal' },
  { id:'pa-002', type:'Vendor Payment', title:'GreenScape April Invoice', submittedBy:'Sarah Mitchell', vendor:'GreenScape Austin', date:'2026-04-12', status:'Pending Board', priority:'High' },
  { id:'pa-003', type:'Maintenance Approval', title:'Dryer vent cleaning', submittedBy:'System', unit:'2A', date:'2026-04-08', status:'Pending Manager', priority:'Normal' },
]
const COMMUNITY_EVENTS = [
  { id:'ev-001', title:'Board Meeting April 2026', date:'2026-04-23', time:'7:00 PM', location:'Clubhouse', type:'Meeting', rsvpCount:28, capacity:80, description:'Monthly board meeting.' },
  { id:'ev-002', title:'Pool Opening Party', date:'2026-05-23', time:'10:00 AM', location:'Community Pool', type:'Social', rsvpCount:45, capacity:80, description:'Celebrate pool season.' },
]

const Spinner = () => (
  <span style={{ width:13, height:13, border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'white', borderRadius:'50%', display:'inline-block', animation:'spin 0.8s linear infinite' }} />
)

const CT = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background:'var(--bg-card)', border:'1px solid var(--border-color)', borderRadius:10, padding:'10px 14px', boxShadow:'var(--shadow-lg)' }}>
      <div style={{ fontSize:11, fontWeight:700, color:'var(--text-muted)', marginBottom:5 }}>{label}</div>
      {payload.map(p => <div key={p.name} style={{ fontSize:12, fontWeight:600, color:p.color||'var(--accent-primary)' }}>{p.name}: ${(p.value||0).toLocaleString()}</div>)}
    </div>
  )
}

export default function BoardDashboard() {
  const { user } = useAuth()
  const { addToast } = useToast()
  const [tab, setTab] = useState('overview')
  const [loading, setLoading] = useState({})
  const [showResolutionModal, setShowResolutionModal] = useState(false)
  const [resolution, setResolution] = useState({ title:'', description:'', type:'Policy Change' })
  const [dateRange] = useState({ from:'2026-01-01', to:'2026-04-14' })

  const handlePDF = async (id) => {
    setLoading(l=>({...l,[id+'_pdf']:true}))
    try { await generatePDF(id, dateRange); addToast('PDF downloaded!','success') }
    catch(e) { addToast('PDF error: '+e.message,'error') }
    finally { setLoading(l=>({...l,[id+'_pdf']:false})) }
  }

  const handleExcel = async (id) => {
    setLoading(l=>({...l,[id+'_xlsx']:true}))
    try { await generateExcel(id, dateRange); addToast('Excel downloaded!','success') }
    catch(e) { addToast('Excel error: '+e.message,'error') }
    finally { setLoading(l=>({...l,[id+'_xlsx']:false})) }
  }

  const boardMember = BOARD_MEMBERS.find(b => b.role === 'President') || BOARD_MEMBERS[0]
  const termExpiring = BOARD_MEMBERS.filter(b => new Date(b.termEnd) < new Date('2027-01-01'))
  const openVotes = VOTES.filter(v => v.status === 'Active')
  const pendingItems = PENDING_APPROVALS.length
  const openViolations = VIOLATIONS.filter(v => v.status === 'Open' || v.status === 'Hearing Scheduled').length

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom:28 }}>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
              <div style={{ padding:'4px 12px', background:'var(--accent-subtle)', borderRadius:'var(--radius-full)', fontSize:12, fontWeight:700, color:'var(--accent-primary)', border:'1px solid var(--accent-primary)' }}>
                🏛 Board Portal — {boardMember?.role}
              </div>
            </div>
            <h2 style={{ marginBottom:4 }}>Board of Directors Dashboard</h2>
            <p>{COMMUNITY.name} · {COMMUNITY.state} · {COMMUNITY.type}</p>
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <button className="btn btn-secondary btn-sm" onClick={() => handlePDF('board_packet')} disabled={loading['board_packet_pdf']}>
              {loading['board_packet_pdf'] ? <Spinner /> : <FileText size={14} />} Board Packet PDF
            </button>
            <button className="btn btn-primary btn-sm" onClick={() => setShowResolutionModal(true)}>
              <Gavel size={14} /> New Resolution
            </button>
          </div>
        </div>
      </div>

      {/* Alert Banner */}
      {pendingItems > 0 && (
        <div style={{ padding:'14px 20px', background:'#fffbeb', border:'1px solid #fde68a', borderLeft:'4px solid #d97706', borderRadius:12, marginBottom:24, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <Bell size={18} color="#d97706" />
            <span style={{ fontWeight:700, fontSize:14, color:'#92400e' }}>
              {pendingItems} items require board action
            </span>
            <span style={{ fontSize:13, color:'#92400e' }}>— {PENDING_APPROVALS.map(p=>p.title).join(' · ')}</span>
          </div>
          <button className="btn btn-sm" style={{ background:'#d97706', color:'white' }} onClick={() => setTab('approvals')}>
            Review Now <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* KPI Row */}
      <div className="grid-4" style={{ marginBottom:24 }}>
        {[
          { label:'Operating Fund', value:'$' + (FINANCIAL_SUMMARY.operatingBalance.toLocaleString()), sub:'Book balance', color:'#1A365D', icon:DollarSign },
          { label:'Reserve Fund', value:'$' + ((FINANCIAL_SUMMARY.reserveBalance/1000).toFixed(0)) + 'K', sub:'62% funded of $' + ((COMMUNITY.reserveTarget/1000).toFixed(0)) + 'K', color:'#0284c7', icon:Shield },
          { label:'Collection Rate', value:(FINANCIAL_SUMMARY.collectionRate) + '%', sub:(FINANCIAL_SUMMARY.delinquentUnits) + ' units delinquent', color:FINANCIAL_SUMMARY.collectionRate>=90?'#1A365D':'#d97706', icon:TrendingUp },
          { label:'Open Violations', value:openViolations, sub:(VIOLATIONS.filter(v=>v.status==='Hearing Scheduled').length) + ' hearings scheduled', color:'#ef4444', icon:AlertTriangle },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
              <div style={{ width:38, height:38, background:s.color+'18', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <s.icon size={18} color={s.color} />
              </div>
            </div>
            <div style={{ fontSize:24, fontFamily:'var(--font-display)', fontWeight:900, color:s.color, marginBottom:3 }}>{s.value}</div>
            <div style={{ fontSize:13, fontWeight:700, color:'var(--text-primary)', marginBottom:2 }}>{s.label}</div>
            <div style={{ fontSize:12, color:'var(--text-muted)' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="tabs">
        {[['overview','📊 Overview'],['financials','💰 Financials'],['approvals','✅ Approvals'],['governance','🏛 Governance'],['reports','📄 Reports']].map(([id,label]) => (
          <div key={id} className={'tab ' + (tab===id?'active':'')} onClick={()=>setTab(id)}>
            {label}
            {id==='approvals' && pendingItems>0 && <span style={{ marginLeft:6, background:'var(--danger)', color:'white', fontSize:10, padding:'1px 6px', borderRadius:10, fontWeight:700 }}>{pendingItems}</span>}
          </div>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {tab === 'overview' && (
        <div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 360px', gap:20, marginBottom:20 }}>
            <div className="card">
              <div className="card-header">
                <div className="card-title">Financial Performance — Last 12 Months</div>
                <button className="btn btn-primary btn-sm" onClick={()=>handlePDF('income')} disabled={loading['income_pdf']}>
                  {loading['income_pdf']?<Spinner/>:<Download size={12}/>} PDF
                </button>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={MONTHLY_COLLECTIONS} margin={{top:5,right:10,left:0,bottom:0}}>
                  <defs>
                    <linearGradient id="bg1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1A365D" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#1A365D" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)"/>
                  <XAxis dataKey="month" tick={{fontSize:10,fill:'var(--text-muted)'}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fontSize:10,fill:'var(--text-muted)'}} axisLine={false} tickLine={false} tickFormatter={v=>`$${v/1000}K`}/>
                  <Tooltip content={<CT/>}/>
                  <Area type="monotone" dataKey="target" name="Target" stroke="var(--border-strong)" strokeDasharray="4 2" strokeWidth={1.5} fill="none"/>
                  <Area type="monotone" dataKey="collected" name="Collected" stroke="#1A365D" strokeWidth={2.5} fill="url(#bg1)" dot={{fill:'#1A365D',r:3}} activeDot={{r:5}}/>
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              {/* Active Votes */}
              <div className="card" style={{ padding:20 }}>
                <div className="card-header" style={{ marginBottom:12 }}>
                  <div className="card-title">Active Votes</div>
                  <span className="badge badge-green">{openVotes.length} open</span>
                </div>
                {openVotes.map(v => {
                  const total = v.yesVotes+v.noVotes+v.abstain
                  const pctNum = v.eligible>0?Math.round((total/v.eligible)*100):0
                  return (
                    <div key={v.id} style={{ marginBottom:12, padding:'10px 12px', background:'var(--bg-secondary)', borderRadius:10 }}>
                      <div style={{ fontWeight:700, fontSize:13, marginBottom:4 }}>{v.title}</div>
                      <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:'var(--text-muted)', marginBottom:6 }}>
                        <span>Deadline: {v.deadline}</span>
                        <span>{pctNum}% voted</span>
                      </div>
                      <div className="progress-bar" style={{height:6}}>
                        <div className="progress-fill" style={{width:(pctNum)+"%", background: pctNum>=v.quorum?'var(--success)':'var(--warning)'}}/>
                      </div>
                      <div style={{ fontSize:11, marginTop:4, color: pctNum>=v.quorum?'var(--success)':'var(--warning)', fontWeight:600 }}>
                        {pctNum>=v.quorum?'✓ Quorum Met':`Need ${v.quorum}% quorum`}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Upcoming Events */}
              <div className="card" style={{ padding:20 }}>
                <div className="card-title" style={{ marginBottom:12 }}>Upcoming Events</div>
                {COMMUNITY_EVENTS.slice(0,2).map(ev => (
                  <div key={ev.id} style={{ display:'flex', gap:12, marginBottom:10, padding:'8px 10px', background:'var(--bg-secondary)', borderRadius:8 }}>
                    <div style={{ width:36, height:36, background:'var(--accent-subtle)', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <Calendar size={16} color="var(--accent-primary)"/>
                    </div>
                    <div>
                      <div style={{ fontWeight:600, fontSize:13 }}>{ev.title}</div>
                      <div style={{ fontSize:11, color:'var(--text-muted)' }}>{ev.date} · {ev.time} · {ev.location}</div>
                      <div style={{ fontSize:11, color:'var(--accent-primary)', fontWeight:600 }}>{ev.rsvpCount} RSVPs</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Board Members */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Board of Directors</div>
              {termExpiring.length > 0 && <span className="badge badge-yellow">{termExpiring.length} terms expiring soon</span>}
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px, 1fr))', gap:16 }}>
              {BOARD_MEMBERS.map(bm => {
                const expiringSoon = new Date(bm.termEnd) < new Date('2027-01-01')
                return (
                  <div key={bm.id} style={{ padding:'16px', background:'var(--bg-secondary)', borderRadius:12, border:'1px solid '+(expiringSoon?'#fde68a':'var(--border-color)') }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
                      <div className="avatar avatar-md" style={{ background:'var(--accent-primary)', color:'white' }}>{bm.avatar}</div>
                      <div>
                        <div style={{ fontWeight:700, fontSize:14 }}>{bm.name}</div>
                        <div style={{ fontSize:12, color:'var(--accent-primary)', fontWeight:600 }}>{bm.role}</div>
                      </div>
                    </div>
                    <div style={{ fontSize:12, color:'var(--text-muted)', marginBottom:4 }}>Committee: {bm.committee}</div>
                    <div style={{ fontSize:12, color:'var(--text-muted)' }}>Term ends: <strong style={{ color:expiringSoon?'var(--warning)':'var(--text-primary)' }}>{bm.termEnd}</strong></div>
                    {expiringSoon && <div style={{ fontSize:10, color:'var(--warning)', fontWeight:700, marginTop:4 }}>⚠️ Election needed</div>}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* FINANCIALS TAB */}
      {tab === 'financials' && (
        <div>
          <div className="grid-2" style={{ marginBottom:20 }}>
            {/* Budget vs Actual */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">Budget vs. Actual — Current Month</div>
                <div style={{ display:'flex', gap:8 }}>
                  <button className="btn btn-secondary btn-sm" onClick={()=>handleExcel('budget')} disabled={loading['budget_xlsx']}>{loading['budget_xlsx']?<Spinner/>:<Download size={12}/>} Excel</button>
                  <button className="btn btn-primary btn-sm" onClick={()=>handlePDF('budget')} disabled={loading['budget_pdf']}>{loading['budget_pdf']?<Spinner/>:<Download size={12}/>} PDF</button>
                </div>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {EXPENSE_CATEGORIES.map(cat => (
                  <div key={cat.name}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4, fontSize:12 }}>
                      <span style={{ fontWeight:600 }}>{cat.name}</span>
                      <span>
                        <strong style={{ color:cat.amount>cat.budget?'var(--danger)':'var(--success)' }}>${cat.amount.toLocaleString()}</strong>
                        {' / '}${cat.budget.toLocaleString()}
                      </span>
                    </div>
                    <div className="progress-bar" style={{ height:7 }}>
                      <div className="progress-fill" style={{ width:(Math.min((cat.amount/cat.budget)*100,100))+"%", background:cat.amount>cat.budget?'var(--danger)':cat.color }}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reserve Fund Status */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">Reserve Fund Status</div>
                <button className="btn btn-primary btn-sm" onClick={()=>handlePDF('reserve')} disabled={loading['reserve_pdf']}>{loading['reserve_pdf']?<Spinner/>:<Download size={12}/>} PDF</button>
              </div>
              <div style={{ textAlign:'center', padding:'20px 0', marginBottom:16 }}>
                <div style={{ position:'relative', width:120, height:120, margin:'0 auto' }}>
                  <svg viewBox="0 0 120 120" style={{ transform:'rotate(-90deg)' }}>
                    <circle cx="60" cy="60" r="50" fill="none" stroke="var(--bg-tertiary)" strokeWidth="12"/>
                    <circle cx="60" cy="60" r="50" fill="none" stroke="#1A365D" strokeWidth="12"
                      strokeDasharray={(0.62*314)+' ${(1-0.62)*314}'} strokeLinecap="round"/>
                  </svg>
                  <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
                    <div style={{ fontSize:22, fontFamily:'var(--font-display)', fontWeight:900, color:'var(--accent-primary)' }}>62%</div>
                    <div style={{ fontSize:10, color:'var(--text-muted)' }}>Funded</div>
                  </div>
                </div>
                <div style={{ marginTop:12 }}>
                  <div style={{ fontSize:20, fontFamily:'var(--font-display)', fontWeight:900, color:'var(--text-primary)' }}>${FINANCIAL_SUMMARY.reserveBalance.toLocaleString()}</div>
                  <div style={{ fontSize:13, color:'var(--text-muted)' }}>of ${COMMUNITY.reserveTarget.toLocaleString()} target</div>
                </div>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {[['Monthly Contribution','$1,100/mo'],['Shortfall',`$${(COMMUNITY.reserveTarget-FINANCIAL_SUMMARY.reserveBalance).toLocaleString()}`],['At Current Rate','Fully funded by 2034']].map(([k,v])=>(
                  <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'8px 12px', background:'var(--bg-secondary)', borderRadius:8 }}>
                    <span style={{ fontSize:13, color:'var(--text-muted)' }}>{k}</span>
                    <span style={{ fontSize:13, fontWeight:700 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AR Aging */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Delinquency Aging — Board View</div>
              <div style={{ display:'flex', gap:8 }}>
                <button className="btn btn-secondary btn-sm" onClick={()=>handleExcel('aging')} disabled={loading['aging_xlsx']}>{loading['aging_xlsx']?<Spinner/>:<Download size={12}/>} Excel</button>
                <button className="btn btn-primary btn-sm" onClick={()=>handlePDF('aging')} disabled={loading['aging_pdf']}>{loading['aging_pdf']?<Spinner/>:<Download size={12}/>} PDF</button>
              </div>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {DELINQUENCY_AGING.map(row => (
                <div key={row.bucket} style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <div style={{ width:80, fontSize:12, fontWeight:600, color:'var(--text-muted)', flexShrink:0 }}>{row.bucket}</div>
                  <div style={{ flex:1 }}>
                    <div className="progress-bar" style={{ height:8 }}>
                      <div className="progress-fill" style={{ width:(row.pct)+"%", background:row.bucket==='Current'?'var(--success)':row.bucket==='1-30 days'?'var(--warning)':'var(--danger)'}}/>
                    </div>
                  </div>
                  <span style={{ fontSize:12, fontWeight:700, width:50, textAlign:'right' }}>{row.units} units</span>
                  <span style={{ fontSize:12, color:'var(--text-muted)', width:72, textAlign:'right' }}>${row.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop:14, padding:'12px 16px', background:'var(--bg-secondary)', borderRadius:10, display:'flex', justifyContent:'space-between' }}>
              <span style={{ fontSize:13, fontWeight:700 }}>Total Outstanding</span>
              <span style={{ fontSize:16, fontWeight:900, fontFamily:'var(--font-display)', color:'var(--danger)' }}>${FINANCIAL_SUMMARY.totalUnpaid.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}

      {/* APPROVALS TAB */}
      {tab === 'approvals' && (
        <div>
          <div style={{ marginBottom:20, padding:'14px 20px', background:'var(--bg-secondary)', borderRadius:12, border:'1px solid var(--border-color)' }}>
            <div style={{ fontWeight:700, fontSize:14, marginBottom:6 }}>Pending Board Actions</div>
            <p style={{ fontSize:13, margin:0 }}>The following items require board review and approval. Board actions are logged with timestamps for governance compliance (Texas Property Code § 209.014).</p>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:16, marginBottom:24 }}>
            {PENDING_APPROVALS.map(item => (
              <div key={item.id} className="card" style={{ padding:24 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:12, marginBottom:14 }}>
                  <div>
                    <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6, flexWrap:'wrap' }}>
                      <h3 style={{ fontSize:16, margin:0 }}>{item.title}</h3>
                      <span className={'badge ' + (item.priority==='High'?'badge-red':'badge-yellow')}>{item.priority}</span>
                      <span className="badge badge-blue">{item.type}</span>
                    </div>
                    <div style={{ fontSize:13, color:'var(--text-muted)' }}>Submitted by {item.submittedBy} · {item.date}</div>
                    <div style={{ fontSize:13, marginTop:4 }}>Status: <strong style={{ color:'var(--warning)' }}>{item.status}</strong></div>
                  </div>
                </div>
                <div style={{ display:'flex', gap:10 }}>
                  <button className="btn btn-primary" onClick={() => addToast((item.title)+' — Approved! Action logged.', 'success')}>
                    <CheckCircle size={15} /> Approve
                  </button>
                  <button className="btn btn-danger" onClick={() => addToast((item.title)+' — Rejected. Resident notified.', 'warning')}>
                    Reject
                  </button>
                  <button className="btn btn-secondary" onClick={() => addToast('Deferred to next meeting', 'info')}>
                    Defer to Meeting
                  </button>
                  <button className="btn btn-ghost" onClick={() => addToast('Request more information sent', 'info')}>
                    Request Info
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Violation Hearings */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Scheduled Violation Hearings</div>
              <span className="badge badge-yellow">{VIOLATIONS.filter(v=>v.status==='Hearing Scheduled').length} scheduled</span>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {VIOLATIONS.filter(v=>v.status==='Hearing Scheduled').map(v => (
                <div key={v.id} style={{ padding:'14px 18px', background:'#fffbeb', borderRadius:10, border:'1px solid #fde68a' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:12 }}>
                    <div>
                      <div style={{ fontWeight:700, fontSize:14, marginBottom:4 }}>Unit {v.unit} — {v.resident}</div>
                      <div style={{ fontSize:13, color:'var(--text-primary)', marginBottom:4 }}>{v.description}</div>
                      <div style={{ fontSize:12, color:'var(--text-muted)' }}>Type: {v.type} · Fine: ${v.fine} · Hearing: {v.hearingDate || 'TBD'}</div>
                    </div>
                    <div style={{ display:'flex', gap:8 }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => addToast('Hearing notes opened', 'info')}>View Details</button>
                      <button className="btn btn-primary btn-sm" onClick={() => addToast('Hearing outcome recorded', 'success')}>Record Outcome</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop:14, padding:'12px 16px', background:'var(--bg-secondary)', borderRadius:10, fontSize:13 }}>
              <strong>Due Process Notice:</strong> Per Texas Property Code § 209.007, residents must receive at least 10 days written notice before a hearing. All hearing outcomes must be documented and provided in writing to the homeowner within 10 business days.
            </div>
          </div>
        </div>
      )}

      {/* GOVERNANCE TAB */}
      {tab === 'governance' && (
        <div>
          <div className="grid-2" style={{ gap:20, marginBottom:20 }}>
            {/* Resolutions */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">Board Resolutions</div>
                <button className="btn btn-primary btn-sm" onClick={() => setShowResolutionModal(true)}>
                  <Plus size={13} /> New Resolution
                </button>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {[
                  { res:'Res. 2026-001', title:'Approve Q1 Financial Report', date:'2026-04-01', passed:true, votes:'5-0' },
                  { res:'Res. 2026-002', title:'Engage GreenScape Austin for 2026', date:'2026-03-15', passed:true, votes:'4-1' },
                  { res:'Res. 2026-003', title:'Lobby Renovation Special Assessment', date:'2026-03-31', passed:true, votes:'4-0-1' },
                  { res:'Res. 2026-004', title:'Update Pool Rules — 2026 Season', date:'2026-04-10', passed:true, votes:'5-0' },
                ].map(r => (
                  <div key={r.res} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 12px', background:'var(--bg-secondary)', borderRadius:8 }}>
                    <CheckCircle size={16} color={r.passed?'var(--success)':'var(--danger)'} />
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:600, fontSize:13 }}>{r.res}: {r.title}</div>
                      <div style={{ fontSize:11, color:'var(--text-muted)' }}>{r.date} · Vote: {r.votes} · {r.passed?'PASSED':'FAILED'}</div>
                    </div>
                    <button className="btn btn-ghost btn-sm" onClick={() => addToast('Resolution PDF downloaded', 'success')}>
                      <Download size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Log */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">Board Action Log</div>
                <span style={{ fontSize:12, color:'var(--text-muted)' }}>Audit trail — all actions timestamped</span>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {[
                  { action:'Patricia Williams approved vendor payment — GreenScape $4,200', time:'2026-04-12 2:34 PM', type:'approval' },
                  { action:'Sandra Torres posted Q1 Financial Report to document library', time:'2026-04-05 10:15 AM', type:'document' },
                  { action:'Kevin Park sent violation notice to Unit 3B — parking', time:'2026-04-08 3:22 PM', type:'violation' },
                  { action:'Marcus Reynolds scheduled maintenance — fire extinguisher inspection', time:'2026-04-01 9:00 AM', type:'maintenance' },
                  { action:'Patricia Williams created Board Resolution 2026-004 — Pool Rules', time:'2026-04-10 11:45 AM', type:'resolution' },
                ].map((log, i) => (
                  <div key={i} style={{ display:'flex', gap:10, padding:'8px 0', borderBottom:'1px solid var(--border-color)', fontSize:12 }}>
                    <div style={{ width:6, height:6, borderRadius:'50%', background:'var(--accent-primary)', marginTop:4, flexShrink:0 }}/>
                    <div style={{ flex:1 }}>
                      <div style={{ color:'var(--text-primary)' }}>{log.action}</div>
                      <div style={{ color:'var(--text-muted)', marginTop:2 }}>{log.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Board-Only Documents */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <Lock size={16} style={{ display:'inline', marginRight:6 }} />
                Confidential Board Documents
              </div>
              <button className="btn btn-primary btn-sm" onClick={() => addToast('Document uploaded to board folder', 'success')}>
                <Plus size={13} /> Upload
              </button>
            </div>
            <div style={{ padding:'12px 16px', background:'#fef2f2', border:'1px solid #fecaca', borderRadius:10, marginBottom:16, fontSize:13 }}>
              🔒 These documents are visible to board members only. Executive session minutes and legal correspondence are protected under state HOA law.
            </div>
            <div className="table-wrapper">
              <table>
                <thead><tr><th>Document</th><th>Type</th><th>Uploaded</th><th>Actions</th></tr></thead>
                <tbody>
                  {[
                    { name:'Executive Session Minutes — March 2026', type:'Confidential', date:'2026-04-01' },
                    { name:'Legal Counsel Letter — Unit 8D Collections', type:'Legal', date:'2026-03-28' },
                    { name:'Insurance Claim — Pool Equipment 2025', type:'Insurance', date:'2026-01-15' },
                    { name:'Conflict of Interest Declarations 2026', type:'Governance', date:'2026-01-05' },
                  ].map(doc => (
                    <tr key={doc.name}>
                      <td style={{ fontWeight:600, fontSize:13 }}>
                        <Lock size={12} style={{ marginRight:6, color:'var(--text-muted)' }} />
                        {doc.name}
                      </td>
                      <td><span className="badge badge-red">{doc.type}</span></td>
                      <td style={{ fontSize:13, color:'var(--text-muted)' }}>{doc.date}</td>
                      <td>
                        <button className="btn btn-ghost btn-sm btn-icon" onClick={() => addToast('Document viewed', 'info')}><Eye size={13} /></button>
                        <button className="btn btn-ghost btn-sm btn-icon" onClick={() => addToast('Downloaded', 'success')}><Download size={13} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* REPORTS TAB */}
      {tab === 'reports' && (
        <div>
          <div style={{ marginBottom:20, padding:'16px 20px', background:'var(--bg-secondary)', borderRadius:12, border:'1px solid var(--border-color)' }}>
            <div style={{ fontWeight:700, fontSize:14, marginBottom:6 }}>Board Financial Reports</div>
            <p style={{ fontSize:13, margin:0 }}>All reports generated with current data. Board members have read-only access to all financial reports. Export as PDF for board meetings or Excel for detailed analysis.</p>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:16 }}>
            {[
              {id:'income', title:'Income Statement (P&L)', desc:'Revenue, expenses, net income', icon:DollarSign, color:'#1A365D', hasExcel:true},
              {id:'balance', title:'Balance Sheet', desc:'Assets, liabilities, fund balance', icon:BarChart3, color:'#0284c7', hasExcel:true},
              {id:'cashflow', title:'Cash Flow Statement', desc:'Monthly inflows and outflows', icon:TrendingUp, color:'#7c3aed', hasExcel:true},
              {id:'budget', title:'Budget vs. Actual', desc:'Budgeted vs actual by category', icon:CheckCircle, color:'#d97706', hasExcel:true},
              {id:'aging', title:'AR Aging Report', desc:'30/60/90+ day delinquency', icon:Clock, color:'#ef4444', hasExcel:true},
              {id:'reserve', title:'Reserve Fund Analysis', desc:'Balance, funding %, components', icon:Shield, color:'#0d9488', hasExcel:false},
              {id:'ledger', title:'General Ledger', desc:'All accounts and transactions', icon:BookOpen, color:'#6366f1', hasExcel:true},
              {id:'annual', title:'Annual Report', desc:'Full year — PDF + Excel package', icon:Star, color:'#070d1a', hasExcel:true},
              {id:'board_packet', title:'Board Meeting Packet', desc:'Complete multi-section packet', icon:FileText, color:'#4f46e5', hasExcel:false},
              {id:'reconciliation', title:'Bank Reconciliation', desc:'Book vs bank balance', icon:CheckCircle, color:'#0284c7', hasExcel:false},
              {id:'vendor', title:'Vendor & 1099 Report', desc:'Vendor spending + IRS 1099', icon:Users, color:'#f59e0b', hasExcel:true},
              {id:'violations', title:'Violations Report', desc:'CC&R enforcement summary', icon:AlertTriangle, color:'#dc2626', hasExcel:true},
            ].map(report => (
              <div key={report.id} className="card" style={{ padding:20 }}>
                <div style={{ display:'flex', alignItems:'flex-start', gap:12, marginBottom:14 }}>
                  <div style={{ width:38, height:38, background:report.color+'15', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <report.icon size={18} color={report.color}/>
                  </div>
                  <div>
                    <div style={{ fontWeight:700, fontSize:14, marginBottom:3 }}>{report.title}</div>
                    <div style={{ fontSize:12, color:'var(--text-muted)' }}>{report.desc}</div>
                  </div>
                </div>
                <div style={{ display:'flex', gap:8 }}>
                  <button className="btn btn-primary btn-sm" onClick={()=>handlePDF(report.id)} disabled={loading[report.id+'_pdf']} style={{ flex:1, justifyContent:'center' }}>
                    {loading[report.id+'_pdf']?<Spinner/>:<FileText size={13}/>}
                    {loading[report.id+'_pdf']?'...':'PDF'}
                  </button>
                  {report.hasExcel && (
                    <button className="btn btn-secondary btn-sm" onClick={()=>handleExcel(report.id)} disabled={loading[report.id+'_xlsx']} style={{ flex:1, justifyContent:'center' }}>
                      {loading[report.id+'_xlsx']?<Spinner/>:<Download size={13}/>}
                      {loading[report.id+'_xlsx']?'...':'Excel'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resolution Modal */}
      {showResolutionModal && (
        <div className="modal-backdrop" onClick={()=>setShowResolutionModal(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create Board Resolution</h3>
              <button className="btn btn-ghost btn-icon" onClick={()=>setShowResolutionModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ padding:'10px 14px', background:'#fffbeb', border:'1px solid #fde68a', borderRadius:8, marginBottom:16, fontSize:13 }}>
                Board resolutions become part of official HOA records. All resolutions are logged with date, time, and board member name for governance compliance.
              </div>
              <div className="form-group">
                <label className="form-label">Resolution Title *</label>
                <input className="form-input" placeholder="e.g. Approve 2026 Landscaping Contract" value={resolution.title} onChange={e=>setResolution(r=>({...r,title:e.target.value}))}/>
              </div>
              <div className="form-group">
                <label className="form-label">Resolution Type</label>
                <select className="form-select" value={resolution.type} onChange={e=>setResolution(r=>({...r,type:e.target.value}))}>
                  {['Policy Change','Budget Approval','Vendor Contract','Rule Amendment','Special Assessment','Emergency Action','Other'].map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Description / Whereas Clauses *</label>
                <textarea className="form-textarea" placeholder="WHEREAS, the Board finds it necessary to... NOW THEREFORE, BE IT RESOLVED that..." value={resolution.description} onChange={e=>setResolution(r=>({...r,description:e.target.value}))}/>
              </div>
              <div className="form-group">
                <label className="form-label">Voting Method</label>
                <select className="form-select">
                  <option>Board Meeting Vote (in-person)</option>
                  <option>Electronic Vote (email ballot)</option>
                  <option>Emergency Resolution (without meeting)</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={()=>setShowResolutionModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={()=>{ addToast('Resolution created and logged! ID: Res. 2026-005', 'success'); setShowResolutionModal(false) }}>
                <Gavel size={15} /> Create & Log Resolution
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
