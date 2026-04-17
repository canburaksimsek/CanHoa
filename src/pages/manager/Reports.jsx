import React, { useState } from 'react'
import { useToast } from '../../context/AppContext.jsx'
import { generatePDF, generateExcel } from '../../utils/reportGenerator.js'
import { BarChart3, Download, FileText, TrendingUp, DollarSign, AlertTriangle, Shield, Clock, Calendar, Wrench, BookOpen, LayoutDashboard } from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { FINANCIAL_SUMMARY, MONTHLY_COLLECTIONS, EXPENSE_CATEGORIES, DELINQUENCY_AGING, COMMUNITY } from '../../data/mockData.js'

const COLORS = ['#16a34a','#22c55e','#4ade80','#86efac','#bbf7d0','#dcfce7']

const REPORTS = [
  { id:'income', title:'Income Statement (P&L)', desc:'Revenue, expenses, and net income with monthly breakdown', icon:DollarSign, color:'#16a34a', category:'Financial', hasPDF:true, hasExcel:true },
  { id:'balance', title:'Balance Sheet', desc:'Assets, liabilities, and fund balance as of today', icon:LayoutDashboard, color:'#0284c7', category:'Financial', hasPDF:true, hasExcel:false },
  { id:'cashflow', title:'Cash Flow Statement', desc:'Monthly cash inflows, outflows, and ending balance', icon:TrendingUp, color:'#7c3aed', category:'Financial', hasPDF:true, hasExcel:false },
  { id:'budget', title:'Budget vs. Actual', desc:'Compare budgeted vs actual expenses by category', icon:BarChart3, color:'#d97706', category:'Financial', hasPDF:true, hasExcel:true },
  { id:'aging', title:'AR Aging Report', desc:'Accounts receivable aging — 30/60/90/120+ day buckets', icon:Clock, color:'#dc2626', category:'Collections', hasPDF:true, hasExcel:true },
  { id:'delinquency', title:'Delinquency Report', desc:'All delinquent units with balances and recommended actions', icon:AlertTriangle, color:'#ef4444', category:'Collections', hasPDF:true, hasExcel:true },
  { id:'reserve', title:'Reserve Fund Analysis', desc:'Reserve balance, funding %, and component schedule', icon:Shield, color:'#0d9488', category:'Financial', hasPDF:true, hasExcel:false },
  { id:'maintenance', title:'Maintenance Report', desc:'All work orders with status, cost, and vendor assignments', icon:Wrench, color:'#f59e0b', category:'Operations', hasPDF:true, hasExcel:false },
  { id:'violations', title:'Violations Report', desc:'CC&R violations with enforcement actions and compliance status', icon:AlertTriangle, color:'#dc2626', category:'Operations', hasPDF:true, hasExcel:false },
  { id:'board_packet', title:'Board Meeting Packet', desc:'Comprehensive multi-section packet — ready for board meetings', icon:BookOpen, color:'#4f46e5', category:'Executive', hasPDF:true, hasExcel:false, featured:true },
  { id:'annual', title:'Annual Community Report', desc:'Full-year financial + operational summary — multi-page PDF', icon:Calendar, color:'#052e16', category:'Executive', hasPDF:true, hasExcel:true, featured:true },
]

const CT = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background:'var(--bg-card)', border:'1px solid var(--border-color)', borderRadius:10, padding:'10px 14px', boxShadow:'var(--shadow-lg)' }}>
      <div style={{ fontSize:11, fontWeight:700, color:'var(--text-muted)', marginBottom:5 }}>{label}</div>
      {payload.map(p => (
        <div key={p.name} style={{ fontSize:12, fontWeight:600, color:p.color||'var(--accent-primary)' }}>
          {p.name}: ${(p.value||0).toLocaleString()}
        </div>
      ))}
    </div>
  )
}

const Spinner = () => (
  <span style={{ width:13, height:13, border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'white', borderRadius:'50%', display:'inline-block', animation:'spin 0.8s linear infinite' }} />
)

export default function Reports() {
  const { addToast } = useToast()
  const [tab, setTab] = useState('dashboard')
  const [loading, setLoading] = useState({})
  const [catFilter, setCatFilter] = useState('All')
  const [dateRange, setDateRange] = useState({ from:'2026-01-01', to:'2026-04-14' })

  const handlePDF = async (id) => {
    setLoading(l => ({ ...l, [`${id}_pdf`]:true }))
    try {
      await generatePDF(id)
      addToast('PDF downloaded successfully!', 'success')
    } catch(e) {
      addToast(`PDF error: ${e.message}`, 'error')
    } finally {
      setLoading(l => ({ ...l, [`${id}_pdf`]:false }))
    }
  }

  const handleExcel = async (id) => {
    setLoading(l => ({ ...l, [`${id}_xlsx`]:true }))
    try {
      await generateExcel(id)
      addToast('Excel file downloaded!', 'success')
    } catch(e) {
      addToast(`Excel error: ${e.message}`, 'error')
    } finally {
      setLoading(l => ({ ...l, [`${id}_xlsx`]:false }))
    }
  }

  const categories = ['All','Financial','Collections','Operations','Executive']
  const filtered = catFilter === 'All' ? REPORTS : REPORTS.filter(r => r.category === catFilter)

  return (
    <div>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:28, flexWrap:'wrap', gap:16 }}>
        <div>
          <h2 style={{ marginBottom:4 }}>Reports & Analytics</h2>
          <p>Generate professional PDF and Excel reports for {COMMUNITY.name}</p>
        </div>
        <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
          <button className="btn btn-primary btn-sm" onClick={() => handlePDF('board_packet')} disabled={loading['board_packet_pdf']}>
            {loading['board_packet_pdf'] ? <Spinner /> : <FileText size={14} />} Board Packet PDF
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => handlePDF('annual')} disabled={loading['annual_pdf']}>
            {loading['annual_pdf'] ? <Spinner /> : <Calendar size={14} />} Annual Report PDF
          </button>
        </div>
      </div>

      <div className="grid-4" style={{ marginBottom:24 }}>
        {[
          { label:'YTD Collections', value:`$${FINANCIAL_SUMMARY.ytdCollected.toLocaleString()}`, sub:`${FINANCIAL_SUMMARY.collectionRate}% collection rate`, color:'#16a34a' },
          { label:'YTD Expenses', value:`$${FINANCIAL_SUMMARY.ytdExpenses.toLocaleString()}`, sub:'vs $146,160 budget', color:'#dc2626' },
          { label:'Reserve Balance', value:`$${(FINANCIAL_SUMMARY.reserveBalance/1000).toFixed(0)}K`, sub:'62% of target funded', color:'#0284c7' },
          { label:'Net Income YTD', value:`$${(FINANCIAL_SUMMARY.ytdCollected-FINANCIAL_SUMMARY.ytdExpenses).toLocaleString()}`, sub:'Operating surplus', color:'#7c3aed' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div style={{ fontSize:24, fontFamily:'var(--font-display)', fontWeight:900, color:s.color, marginBottom:3 }}>{s.value}</div>
            <div style={{ fontSize:13, fontWeight:700, color:'var(--text-primary)', marginBottom:2 }}>{s.label}</div>
            <div style={{ fontSize:11, color:'var(--text-muted)' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="tabs">
        {[['dashboard','📊 Dashboard'],['generate','📄 Generate Reports'],['charts','📈 Charts']].map(([id,label]) => (
          <div key={id} className={`tab ${tab===id?'active':''}`} onClick={() => setTab(id)}>{label}</div>
        ))}
      </div>

      {tab === 'dashboard' && (
        <div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 360px', gap:20, marginBottom:20 }}>
            <div className="card">
              <div className="card-header">
                <div className="card-title">Monthly Revenue vs. Target</div>
                <div style={{ display:'flex', gap:8 }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => handleExcel('income')} disabled={loading['income_xlsx']}>{loading['income_xlsx'] ? <Spinner /> : <Download size={12} />} Excel</button>
                  <button className="btn btn-primary btn-sm" onClick={() => handlePDF('income')} disabled={loading['income_pdf']}>{loading['income_pdf'] ? <Spinner /> : <Download size={12} />} PDF</button>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={MONTHLY_COLLECTIONS} margin={{ top:5, right:10, left:0, bottom:0 }}>
                  <defs>
                    <linearGradient id="cg2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#16a34a" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis dataKey="month" tick={{ fontSize:10, fill:'var(--text-muted)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize:10, fill:'var(--text-muted)' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v/1000}K`} />
                  <Tooltip content={<CT />} />
                  <Area type="monotone" dataKey="target" name="Target" stroke="var(--border-strong)" strokeDasharray="4 2" strokeWidth={1.5} fill="none" />
                  <Area type="monotone" dataKey="collected" name="Collected" stroke="#16a34a" strokeWidth={2.5} fill="url(#cg2)" dot={{ fill:'#16a34a', r:3 }} activeDot={{ r:5 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="card">
              <div className="card-header">
                <div className="card-title">Expense Distribution</div>
                <button className="btn btn-primary btn-sm" onClick={() => handlePDF('budget')} disabled={loading['budget_pdf']}>{loading['budget_pdf'] ? <Spinner /> : <Download size={12} />} PDF</button>
              </div>
              <ResponsiveContainer width="100%" height={190}>
                <PieChart>
                  <Pie data={EXPENSE_CATEGORIES} dataKey="amount" nameKey="name" cx="50%" cy="50%" outerRadius={68} innerRadius={32}>
                    {EXPENSE_CATEGORIES.map((_,i) => <Cell key={i} fill={COLORS[i%COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={v => [`$${v.toLocaleString()}`, '']} />
                  <Legend iconSize={8} wrapperStyle={{ fontSize:10 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid-2" style={{ marginBottom:20 }}>
            <div className="card">
              <div className="card-header">
                <div className="card-title">Budget vs. Actual</div>
                <div style={{ display:'flex', gap:8 }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => handleExcel('budget')} disabled={loading['budget_xlsx']}>{loading['budget_xlsx'] ? <Spinner /> : <Download size={12} />} Excel</button>
                  <button className="btn btn-primary btn-sm" onClick={() => handlePDF('budget')} disabled={loading['budget_pdf']}>{loading['budget_pdf'] ? <Spinner /> : <Download size={12} />} PDF</button>
                </div>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {EXPENSE_CATEGORIES.map(cat => (
                  <div key={cat.name}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4, fontSize:12 }}>
                      <span style={{ fontWeight:600 }}>{cat.name}</span>
                      <span style={{ color:'var(--text-muted)' }}>
                        <strong style={{ color:cat.amount>cat.budget?'var(--danger)':'var(--success)' }}>${cat.amount.toLocaleString()}</strong>{' / '}${cat.budget.toLocaleString()}
                      </span>
                    </div>
                    <div className="progress-bar" style={{ height:7 }}>
                      <div className="progress-fill" style={{ width:`${Math.min((cat.amount/cat.budget)*100,100)}%`, background:cat.amount>cat.budget?'var(--danger)':cat.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <div className="card-title">AR Aging Summary</div>
                <div style={{ display:'flex', gap:8 }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => handleExcel('aging')} disabled={loading['aging_xlsx']}>{loading['aging_xlsx'] ? <Spinner /> : <Download size={12} />} Excel</button>
                  <button className="btn btn-primary btn-sm" onClick={() => handlePDF('aging')} disabled={loading['aging_pdf']}>{loading['aging_pdf'] ? <Spinner /> : <Download size={12} />} PDF</button>
                </div>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {DELINQUENCY_AGING.map(row => (
                  <div key={row.bucket} style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <div style={{ width:76, fontSize:12, fontWeight:600, color:'var(--text-muted)', flexShrink:0 }}>{row.bucket}</div>
                    <div style={{ flex:1 }}>
                      <div className="progress-bar" style={{ height:8 }}>
                        <div className="progress-fill" style={{ width:`${row.pct}%`, background:row.bucket==='Current'?'var(--success)':row.bucket==='1-30 days'?'var(--warning)':'var(--danger)' }} />
                      </div>
                    </div>
                    <span style={{ fontSize:12, fontWeight:700, width:46, textAlign:'right' }}>{row.units} units</span>
                    <span style={{ fontSize:12, color:'var(--text-muted)', width:68, textAlign:'right' }}>${row.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop:14, padding:'10px 14px', background:'var(--bg-secondary)', borderRadius:10, display:'flex', justifyContent:'space-between' }}>
                <span style={{ fontSize:13, fontWeight:700 }}>Total Overdue</span>
                <span style={{ fontSize:16, fontWeight:900, fontFamily:'var(--font-display)', color:'var(--danger)' }}>${FINANCIAL_SUMMARY.totalUnpaid.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'generate' && (
        <div>
          <div className="card" style={{ marginBottom:20, padding:'14px 18px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:16, flexWrap:'wrap' }}>
              <span style={{ fontSize:13, fontWeight:700 }}>Date Range:</span>
              <input type="date" className="form-input" style={{ width:155, fontSize:13 }} value={dateRange.from} onChange={e => setDateRange(r=>({...r,from:e.target.value}))} />
              <span style={{ color:'var(--text-muted)', fontSize:13 }}>to</span>
              <input type="date" className="form-input" style={{ width:155, fontSize:13 }} value={dateRange.to} onChange={e => setDateRange(r=>({...r,to:e.target.value}))} />
              <div style={{ display:'flex', gap:8, marginLeft:'auto' }}>
                {[['YTD','2026-01-01','2026-04-14'],['Q1 2026','2026-01-01','2026-03-31'],['Last 12mo','2025-04-15','2026-04-14']].map(([l,f,t]) => (
                  <button key={l} className="btn btn-secondary btn-sm" onClick={() => setDateRange({from:f,to:t})}>{l}</button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display:'flex', gap:8, marginBottom:20, flexWrap:'wrap' }}>
            {categories.map(c => (
              <button key={c} onClick={() => setCatFilter(c)} className="btn btn-sm" style={{ background:catFilter===c?'var(--accent-primary)':'var(--bg-card)', color:catFilter===c?'white':'var(--text-muted)', border:'1px solid var(--border-color)' }}>{c}</button>
            ))}
          </div>

          {catFilter === 'All' && (
            <div className="grid-2" style={{ marginBottom:20 }}>
              {REPORTS.filter(r=>r.featured).map(report => (
                <div key={report.id} className="card" style={{ border:'2px solid var(--accent-primary)', background:'var(--accent-subtle)', padding:24 }}>
                  <div style={{ display:'flex', alignItems:'flex-start', gap:14, marginBottom:16 }}>
                    <div style={{ width:48, height:48, background:report.color+'18', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <report.icon size={22} color={report.color} />
                    </div>
                    <div>
                      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                        <h4 style={{ fontSize:15, margin:0 }}>{report.title}</h4>
                        <span className="badge badge-green" style={{ fontSize:10 }}>FEATURED</span>
                      </div>
                      <p style={{ fontSize:13, margin:0 }}>{report.desc}</p>
                    </div>
                  </div>
                  <div style={{ display:'flex', gap:10 }}>
                    {report.hasPDF && (
                      <button className="btn btn-primary" onClick={() => handlePDF(report.id)} disabled={loading[`${report.id}_pdf`]} style={{ flex:1, justifyContent:'center' }}>
                        {loading[`${report.id}_pdf`] ? <Spinner /> : <FileText size={15} />}
                        {loading[`${report.id}_pdf`] ? 'Generating...' : 'Download PDF'}
                      </button>
                    )}
                    {report.hasExcel && (
                      <button className="btn btn-secondary" onClick={() => handleExcel(report.id)} disabled={loading[`${report.id}_xlsx`]} style={{ flex:1, justifyContent:'center' }}>
                        {loading[`${report.id}_xlsx`] ? <Spinner /> : <Download size={15} />}
                        {loading[`${report.id}_xlsx`] ? 'Generating...' : 'Download Excel'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:16 }}>
            {filtered.filter(r => catFilter==='All' ? !r.featured : true).map(report => (
              <div key={report.id} className="card" style={{ padding:20 }}>
                <div style={{ display:'flex', alignItems:'flex-start', gap:12, marginBottom:14 }}>
                  <div style={{ width:40, height:40, background:report.color+'15', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <report.icon size={18} color={report.color} />
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700, fontSize:14, marginBottom:3 }}>{report.title}</div>
                    <div style={{ fontSize:12, color:'var(--text-muted)', marginBottom:6 }}>{report.desc}</div>
                    <span className="badge badge-gray" style={{ fontSize:10 }}>{report.category}</span>
                  </div>
                </div>
                <div style={{ display:'flex', gap:8 }}>
                  {report.hasPDF && (
                    <button className="btn btn-primary btn-sm" onClick={() => handlePDF(report.id)} disabled={loading[`${report.id}_pdf`]} style={{ flex:1, justifyContent:'center' }}>
                      {loading[`${report.id}_pdf`] ? <Spinner /> : <FileText size={13} />}
                      {loading[`${report.id}_pdf`] ? 'Generating...' : 'PDF'}
                    </button>
                  )}
                  {report.hasExcel && (
                    <button className="btn btn-secondary btn-sm" onClick={() => handleExcel(report.id)} disabled={loading[`${report.id}_xlsx`]} style={{ flex:1, justifyContent:'center' }}>
                      {loading[`${report.id}_xlsx`] ? <Spinner /> : <Download size={13} />}
                      {loading[`${report.id}_xlsx`] ? 'Generating...' : 'Excel'}
                    </button>
                  )}
                  {!report.hasExcel && <div style={{ flex:1 }} />}
                </div>
              </div>
            ))}
          </div>

          <div className="card" style={{ marginTop:20, padding:24 }}>
            <div className="card-header">
              <div className="card-title">📅 Monthly Excel Package</div>
              <span style={{ fontSize:12, color:'var(--text-muted)' }}>All reports in one workbook</span>
            </div>
            <p style={{ fontSize:14, marginBottom:18 }}>Download a comprehensive Excel workbook with Income Statement, Budget vs Actual, AR Aging, Transactions, and Resident Directory — all in separate tabs.</p>
            <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
              <button className="btn btn-primary" onClick={() => handleExcel('annual')} disabled={loading['annual_xlsx']}>
                {loading['annual_xlsx'] ? <Spinner /> : <Download size={16} />} Full Excel Package
              </button>
              <button className="btn btn-secondary" onClick={() => handleExcel('income')} disabled={loading['income_xlsx']}>
                {loading['income_xlsx'] ? <Spinner /> : <Download size={16} />} Income Report
              </button>
              <button className="btn btn-secondary" onClick={() => handleExcel('aging')} disabled={loading['aging_xlsx']}>
                {loading['aging_xlsx'] ? <Spinner /> : <Download size={16} />} AR Aging
              </button>
              <button className="btn btn-secondary" onClick={() => handleExcel('budget')} disabled={loading['budget_xlsx']}>
                {loading['budget_xlsx'] ? <Spinner /> : <Download size={16} />} Budget vs Actual
              </button>
            </div>
          </div>
        </div>
      )}

      {tab === 'charts' && (
        <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
          <div className="card">
            <div className="card-header">
              <div className="card-title">12-Month Revenue Trend</div>
              <button className="btn btn-primary btn-sm" onClick={() => handlePDF('income')} disabled={loading['income_pdf']}>{loading['income_pdf'] ? <Spinner /> : <Download size={12} />} PDF</button>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={MONTHLY_COLLECTIONS} margin={{ top:5, right:10, left:0, bottom:0 }}>
                <defs>
                  <linearGradient id="rg2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="month" tick={{ fontSize:11, fill:'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize:11, fill:'var(--text-muted)' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v/1000}K`} />
                <Tooltip content={<CT />} />
                <Area type="monotone" dataKey="target" name="Target" stroke="var(--border-strong)" strokeDasharray="5 3" strokeWidth={1.5} fill="none" />
                <Area type="monotone" dataKey="collected" name="Collected" stroke="#16a34a" strokeWidth={2.5} fill="url(#rg2)" dot={{ fill:'#16a34a', r:3 }} activeDot={{ r:6 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid-2">
            <div className="card">
              <div className="card-header">
                <div className="card-title">Expenses by Category</div>
                <button className="btn btn-primary btn-sm" onClick={() => handlePDF('budget')} disabled={loading['budget_pdf']}>{loading['budget_pdf'] ? <Spinner /> : <Download size={12} />} PDF</button>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={EXPENSE_CATEGORIES} margin={{ top:5, right:10, left:0, bottom:0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis dataKey="name" tick={{ fontSize:9, fill:'var(--text-muted)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize:10, fill:'var(--text-muted)' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v/1000}K`} />
                  <Tooltip formatter={v => [`$${v.toLocaleString()}`, '']} />
                  <Bar dataKey="budget" name="Budget" fill="#bbf7d0" radius={[3,3,0,0]} />
                  <Bar dataKey="amount" name="Actual" fill="#16a34a" radius={[3,3,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="card">
              <div className="card-header">
                <div className="card-title">Reserve Fund Components</div>
                <button className="btn btn-primary btn-sm" onClick={() => handlePDF('reserve')} disabled={loading['reserve_pdf']}>{loading['reserve_pdf'] ? <Spinner /> : <Download size={12} />} PDF</button>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {[
                  { name:'Roofing', funded:62, color:'#16a34a' },
                  { name:'HVAC Systems', funded:38, color:'#dc2626' },
                  { name:'Pool Equipment', funded:75, color:'#16a34a' },
                  { name:'Parking Lot', funded:82, color:'#16a34a' },
                  { name:'Elevator', funded:70, color:'#16a34a' },
                  { name:'Landscaping Equip.', funded:55, color:'#d97706' },
                ].map(item => (
                  <div key={item.name} style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <span style={{ fontSize:12, fontWeight:500, width:130, flexShrink:0 }}>{item.name}</span>
                    <div style={{ flex:1 }}>
                      <div className="progress-bar" style={{ height:8 }}>
                        <div className="progress-fill" style={{ width:`${item.funded}%`, background:item.color }} />
                      </div>
                    </div>
                    <span style={{ fontSize:12, fontWeight:700, color:item.color, width:38, textAlign:'right' }}>{item.funded}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card" style={{ background:'var(--accent-subtle)', border:'2px solid var(--accent-primary)', padding:24 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
              <div>
                <h3 style={{ marginBottom:6, fontSize:16 }}>Export All Reports — Full Board Packet PDF</h3>
                <p style={{ fontSize:14, margin:0 }}>All financial summaries, charts, and operational data in one professionally formatted multi-page PDF.</p>
              </div>
              <button className="btn btn-primary btn-lg" onClick={() => handlePDF('board_packet')} disabled={loading['board_packet_pdf']}>
                {loading['board_packet_pdf'] ? <Spinner /> : <Download size={18} />}
                {loading['board_packet_pdf'] ? 'Generating PDF...' : 'Export Board Packet PDF'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
