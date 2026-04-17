import React, { useState } from 'react'
import { useAuth, useToast } from '../../context/AppContext.jsx'
import { generatePDF, generateExcel } from '../../utils/reportGenerator.js'
import {
  CreditCard, CheckCircle, Download, Plus, Clock, Wrench,
  FileText, Megaphone, Vote, AlertTriangle, ArrowRight,
  Calendar, Shield, DollarSign, Bell, Eye, Edit, X,
  Home, MessageSquare, Star, Bookmark, Car, Heart,
  Lock, Phone, Mail, User, ChevronRight, RefreshCw
} from 'lucide-react'
import {
  COMMUNITY, ANNOUNCEMENTS, DOCUMENTS, VOTES, AMENITIES,
  MAINTENANCE_REQUESTS, PAYMENT_HISTORY, VIOLATIONS
} from '../../data/mockData.js'

const Spinner = () => (
  <span style={{ width:13,height:13,border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'white',borderRadius:'50%',display:'inline-block',animation:'spin 0.8s linear infinite'}} />
)

// ─────────────────────────────────────────────────────
// RESIDENT DASHBOARD
// ─────────────────────────────────────────────────────
export function ResidentDashboard() {
  const { user } = useAuth()
  const { addToast } = useToast()
  const [payModalOpen, setPayModalOpen] = useState(false)
  const [payMethod, setPayMethod] = useState('ach')
  const [payLoading, setPayLoading] = useState(false)

  const balance = user?.balance || 285
  const dueDate = user?.dueDate || '2026-05-01'
  const myRequests = MAINTENANCE_REQUESTS.filter(r=>r.unit===user?.unit)
  const activeVotes = VOTES.filter(v=>v.status==='Active')
  const myViolations = VIOLATIONS.filter(v=>v.unit===user?.unit)

  const handlePay = async () => {
    setPayLoading(true)
    await new Promise(r=>setTimeout(r,1500))
    setPayLoading(false)
    setPayModalOpen(false)
    addToast('Payment of $285.00 processed successfully! Receipt sent to '+user?.email,'success')
  }

  return (
    <div>
      <div style={{ marginBottom:28 }}>
        <h2 style={{ marginBottom:4 }}>Welcome back, {user?.name?.split(' ')[0]}! 👋</h2>
        <p>Unit {user?.unit} · {COMMUNITY.name} · {COMMUNITY.address.split(',')[1]?.trim()}</p>
      </div>

      {/* Balance Card */}
      <div style={{ marginBottom:24, padding:28, background:balance>0?'linear-gradient(135deg,#dc2626 0%,#b91c1c 100%)':'linear-gradient(135deg,#16a34a 0%,#15803d 100%)', borderRadius:20, color:'white', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-20, right:-20, width:120, height:120, borderRadius:'50%', background:'rgba(255,255,255,0.08)' }}/>
        <div style={{ position:'absolute', bottom:-30, right:40, width:80, height:80, borderRadius:'50%', background:'rgba(255,255,255,0.05)' }}/>
        <div style={{ position:'relative', display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:16 }}>
          <div>
            <div style={{ fontSize:14, fontWeight:600, opacity:0.85, marginBottom:8 }}>{balance>0?'Amount Due':'Account Balance'}</div>
            <div style={{ fontFamily:'var(--font-display)', fontSize:48, fontWeight:900, lineHeight:1, marginBottom:8 }}>${balance.toFixed(2)}</div>
            <div style={{ fontSize:14, opacity:0.8 }}>{balance>0?`Due by ${dueDate} · Grace period: ${COMMUNITY.gracePeriod} days`:'All payments current — Thank you!'}</div>
            {balance>0 && <div style={{ fontSize:12, opacity:0.7, marginTop:4 }}>Late fee of ${COMMUNITY.lateFee} applies after {COMMUNITY.gracePeriod}-day grace period</div>}
          </div>
          {balance>0 && (
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              <button className="btn btn-xl" style={{ background:'white', color:'#16a34a', fontWeight:700 }} onClick={()=>setPayModalOpen(true)}>
                Pay Now <ArrowRight size={18}/>
              </button>
              <button style={{ background:'rgba(255,255,255,0.2)', border:'1px solid rgba(255,255,255,0.4)', color:'white', padding:'8px 16px', borderRadius:10, cursor:'pointer', fontSize:13, fontWeight:600 }}
                onClick={()=>addToast('Autopay enrollment opened','info')}>
                Set Up Autopay
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid-4" style={{ marginBottom:28 }}>
        {[
          { label:'Monthly Dues', value:`$${COMMUNITY.monthlyDues}`, sub:'Per month', icon:DollarSign, color:'#22c55e' },
          { label:'Open Requests', value:myRequests.filter(r=>r.status!=='Resolved').length, sub:'Maintenance tickets', icon:Wrench, color:'#f59e0b' },
          { label:'Active Votes', value:activeVotes.length, sub:'Awaiting your vote', icon:Vote, color:'#8b5cf6' },
          { label:'My Violations', value:myViolations.filter(v=>v.status==='Open').length, sub:myViolations.length===0?'None — great!':'Open cases', icon:AlertTriangle, color:myViolations.length>0?'#ef4444':'#22c55e' },
        ].map(s=>(
          <div key={s.label} className="card" style={{ padding:'18px 20px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
              <div style={{ width:36, height:36, background:s.color+'20', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <s.icon size={18} color={s.color}/>
              </div>
            </div>
            <div style={{ fontSize:22, fontFamily:'var(--font-display)', fontWeight:900, color:'var(--text-primary)', marginBottom:2 }}>{s.value}</div>
            <div style={{ fontSize:13, fontWeight:600, color:'var(--text-primary)', marginBottom:1 }}>{s.label}</div>
            <div style={{ fontSize:12, color:'var(--text-muted)' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="card" style={{ marginBottom:24, padding:20 }}>
        <div className="card-title" style={{ marginBottom:14 }}>Quick Actions</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(140px,1fr))', gap:10 }}>
          {[
            { label:'Pay Dues', icon:CreditCard, color:'#16a34a', action:()=>setPayModalOpen(true) },
            { label:'New Request', icon:Wrench, color:'#f59e0b', action:()=>addToast('Maintenance request form opened','info') },
            { label:'ARC Request', icon:Home, color:'#8b5cf6', action:()=>addToast('ARC application form opened — upload plans and description','info') },
            { label:'Book Amenity', icon:Calendar, color:'#0284c7', action:()=>addToast('Amenity booking calendar opened','info') },
            { label:'Send Message', icon:MessageSquare, color:'#f97316', action:()=>addToast('Direct message to manager opened','info') },
            { label:'View Statement', icon:FileText, color:'#6366f1', action:()=>addToast('Generating your payment statement PDF...','info') },
          ].map(qa=>(
            <button key={qa.label} onClick={qa.action} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8, padding:'14px 10px', background:'var(--bg-secondary)', border:'1px solid var(--border-color)', borderRadius:12, cursor:'pointer', transition:'var(--transition)' }}
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

      <div className="grid-2">
        {/* Recent Announcements */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Recent Announcements</div>
            <a href="/portal/announcements" style={{ fontSize:13, color:'var(--accent-primary)', fontWeight:600 }}>View all</a>
          </div>
          {ANNOUNCEMENTS.slice(0,3).map(ann=>(
            <div key={ann.id} style={{ padding:'12px 0', borderBottom:'1px solid var(--border-color)' }}>
              <div style={{ display:'flex', alignItems:'flex-start', gap:10 }}>
                <div style={{ width:8, height:8, borderRadius:'50%', marginTop:6, flexShrink:0, background:ann.type==='Emergency'?'var(--danger)':ann.type==='Meeting'?'var(--info)':'var(--accent-primary)' }}/>
                <div>
                  <div style={{ fontWeight:600, fontSize:14, marginBottom:3 }}>{ann.title}</div>
                  <div style={{ fontSize:13, color:'var(--text-muted)', marginBottom:4, lineHeight:1.5 }}>{ann.body.slice(0,80)}...</div>
                  <div style={{ fontSize:11, color:'var(--text-muted)' }}>{ann.sent}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* My Maintenance Requests */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">My Maintenance Requests</div>
            <a href="/portal/requests" style={{ fontSize:13, color:'var(--accent-primary)', fontWeight:600 }}>View all</a>
          </div>
          {myRequests.length===0 ? (
            <div style={{ textAlign:'center', padding:'24px', color:'var(--text-muted)' }}>
              <Wrench size={32} style={{ opacity:0.3, marginBottom:8 }}/>
              <div style={{ fontSize:14 }}>No maintenance requests</div>
              <button className="btn btn-primary btn-sm" style={{ marginTop:12 }} onClick={()=>addToast('New request form opened','info')}>
                <Plus size={13}/> Submit Request
              </button>
            </div>
          ) : myRequests.map(req=>(
            <div key={req.id} style={{ padding:'10px 0', borderBottom:'1px solid var(--border-color)' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:8 }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:600, fontSize:14, marginBottom:3 }}>{req.title}</div>
                  <div style={{ fontSize:12, color:'var(--text-muted)' }}>{req.category} · {req.created}</div>
                </div>
                <span className={`badge ${req.status==='Resolved'?'badge-green':req.status==='New'?'badge-gray':'badge-yellow'}`} style={{ fontSize:11, flexShrink:0 }}>{req.status}</span>
              </div>
            </div>
          ))}
          <button className="btn btn-primary btn-sm" style={{ marginTop:14, width:'100%', justifyContent:'center' }} onClick={()=>addToast('New request form opened','info')}>
            <Plus size={13}/> New Request
          </button>
        </div>
      </div>

      {/* Pay Modal */}
      {payModalOpen && (
        <div className="modal-backdrop" onClick={()=>setPayModalOpen(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-header">
              <h3>Pay HOA Dues</h3>
              <button className="btn btn-ghost btn-icon" onClick={()=>setPayModalOpen(false)}><X size={16}/></button>
            </div>
            <div className="modal-body">
              <div style={{ padding:'14px 18px', background:'var(--accent-subtle)', border:'1px solid var(--accent-primary)', borderRadius:12, marginBottom:20 }}>
                <div style={{ fontSize:24, fontFamily:'var(--font-display)', fontWeight:900, color:'var(--accent-primary)' }}>${balance.toFixed(2)}</div>
                <div style={{ fontSize:13, color:'var(--text-muted)' }}>Due by {dueDate} · Unit {user?.unit} · {COMMUNITY.name}</div>
              </div>
              <div className="form-group">
                <label className="form-label">Payment Method</label>
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  {[{id:'ach',label:'ACH Bank Transfer',sub:'Free · 2-3 business days',icon:'🏦'},{id:'card',label:'Credit/Debit Card',sub:'3.5% processing fee + $0.50',icon:'💳'},{id:'apple',label:'Apple Pay / Google Pay',sub:'3.5% processing fee',icon:'📱'}].map(m=>(
                    <div key={m.id} onClick={()=>setPayMethod(m.id)} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px', border:`2px solid ${payMethod===m.id?'var(--accent-primary)':'var(--border-color)'}`, borderRadius:10, cursor:'pointer', background:payMethod===m.id?'var(--accent-subtle)':'var(--bg-card)' }}>
                      <span style={{ fontSize:20 }}>{m.icon}</span>
                      <div style={{ flex:1 }}>
                        <div style={{ fontWeight:600, fontSize:14 }}>{m.label}</div>
                        <div style={{ fontSize:12, color:'var(--text-muted)' }}>{m.sub}</div>
                      </div>
                      {payMethod===m.id && <CheckCircle size={18} color="var(--accent-primary)"/>}
                    </div>
                  ))}
                </div>
              </div>
              {payMethod==='ach' && (
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                  <div className="form-group"><label className="form-label">Routing Number</label><input className="form-input" placeholder="021000021"/></div>
                  <div className="form-group"><label className="form-label">Account Number</label><input className="form-input" placeholder="000123456789" type="password"/></div>
                </div>
              )}
              <div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 14px', background:'var(--bg-secondary)', borderRadius:8, fontSize:13 }}>
                <Shield size={14} color="var(--accent-primary)"/>
                <span style={{ color:'var(--text-muted)' }}>256-bit encrypted · PCI DSS Level 1 via Stripe · No card data stored</span>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={()=>setPayModalOpen(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handlePay} disabled={payLoading}>
                {payLoading?<Spinner/>:<CreditCard size={15}/>}
                {payLoading?'Processing...':'Pay $'+balance.toFixed(2)}
              </button>
            </div>
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
  const [loading, setLoading] = useState({})
  const [tab, setTab] = useState('history')
  const [autopay, setAutopay] = useState(true)
  const [showAutopayModal, setShowAutopayModal] = useState(false)

  const downloadReceipt = async (payment) => {
    setLoading(l=>({...l,[payment.id]:true}))
    try {
      const { jsPDF } = await import('jspdf')
      const doc = new jsPDF({orientation:'portrait',unit:'mm',format:'letter'})
      const W = doc.internal.pageSize.getWidth()
      doc.setFillColor(22,101,52); doc.rect(0,0,W,28,'F')
      doc.setFont('helvetica','bold'); doc.setFontSize(18); doc.setTextColor(255,255,255)
      doc.text('CanHoa', 14, 13)
      doc.setFontSize(10); doc.setFont('helvetica','normal'); doc.setTextColor(134,239,172)
      doc.text('Payment Receipt', 14, 20)
      doc.setFontSize(12); doc.setFont('helvetica','bold'); doc.setTextColor(255,255,255)
      doc.text('OFFICIAL RECEIPT', W-14, 13, {align:'right'})
      doc.setFontSize(8); doc.setTextColor(187,247,208)
      doc.text(payment.receipt||'RCP-'+Date.now(), W-14, 20, {align:'right'})
      doc.setFillColor(240,253,244); doc.rect(0,28,W,10,'F')
      doc.setFontSize(8); doc.setFont('helvetica','normal'); doc.setTextColor(22,101,52)
      doc.text(`${COMMUNITY.name} | ${COMMUNITY.address} | EIN: ${COMMUNITY.ein}`, 14, 34)
      let y=46
      doc.setFontSize(28); doc.setFont('helvetica','bold'); doc.setTextColor(22,101,52)
      doc.text(`$${payment.amount.toFixed(2)}`, W/2, y+10, {align:'center'}); y+=20
      doc.setFontSize(10); doc.setFont('helvetica','normal'); doc.setTextColor(75,122,94)
      doc.text('Payment Received', W/2, y, {align:'center'}); y+=12
      const rows = [['Payment Date',payment.date],['Resident',payment.resident],['Unit',payment.unit],['Payment Type',payment.type],['Method',payment.method],['Status',payment.status],['Receipt #',payment.receipt||'RCP-'+Date.now()]]
      rows.forEach(([k,v])=>{ doc.setFont('helvetica','bold'); doc.setTextColor(22,101,52); doc.text(k+':', 40,y); doc.setFont('helvetica','normal'); doc.setTextColor(15,31,20); doc.text(v,130,y); y+=9 })
      doc.setFillColor(240,253,244); doc.rect(14,y+4,W-28,14,'F')
      doc.setFontSize(8); doc.setTextColor(75,122,94)
      doc.text('Thank you for your payment. This is your official receipt from '+COMMUNITY.name+'.', W/2, y+12, {align:'center'})
      doc.save('CanHoa_Receipt_' + (payment.receipt||payment.id) + '_' + payment.date + '.pdf')
      addToast('Receipt PDF downloaded!','success')
    } catch(e) { addToast('Error: '+e.message,'error') }
    finally { setLoading(l=>({...l,[payment.id]:false})) }
  }

  const downloadStatement = async () => {
    setLoading(l=>({...l,'statement':true}))
    try {
      const { jsPDF } = await import('jspdf')
      const { default: autoTable } = await import('jspdf-autotable')
      const doc = new jsPDF()
      const W = doc.internal.pageSize.getWidth()
      doc.setFillColor(22,101,52); doc.rect(0,0,W,28,'F')
      doc.setFont('helvetica','bold'); doc.setFontSize(16); doc.setTextColor(255,255,255)
      doc.text('CanHoa — Payment Statement', 14, 13)
      doc.setFontSize(8); doc.setFont('helvetica','normal'); doc.setTextColor(187,247,208)
      doc.text(`${user?.name} · Unit ${user?.unit} · ${COMMUNITY.name}`, 14, 20)
      autoTable(doc, {
        startY:35,
        head:[['Date','Type','Method','Amount','Status','Receipt']],
        body:PAYMENT_HISTORY.map(p=>[p.date,p.type,p.method,`$${p.amount.toFixed(2)}`,p.status,p.receipt||'—']),
        foot:[['TOTAL PAID','','',`$${PAYMENT_HISTORY.filter(p=>p.status==='Completed').reduce((s,p)=>s+p.amount,0).toFixed(2)}','','']],
        headStyles:{fillColor:[22,101,52],textColor:255,fontStyle:'bold'},
        alternateRowStyles:{fillColor:[240,253,244]},
        footStyles:{fillColor:[22,101,52],textColor:255,fontStyle:'bold'},
      })
      doc.save('CanHoa_Statement_' + (user?.unit||'unit') + '_' + new Date().getFullYear() + '.pdf')
      addToast('Statement PDF downloaded!','success')
    } catch(e) { addToast('Error: '+e.message,'error') }
    finally { setLoading(l=>({...l,'statement':false})) }
  }

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:28, flexWrap:'wrap', gap:16 }}>
        <div>
          <h2 style={{ marginBottom:4 }}>Payments</h2>
          <p>Payment history, autopay, and account statements</p>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <button className="btn btn-secondary btn-sm" onClick={downloadStatement} disabled={loading['statement']}>
            {loading['statement']?<Spinner/>:<Download size={14}/>} Download Statement PDF
          </button>
          <button className="btn btn-primary btn-sm" onClick={()=>addToast('Opening secure payment portal...','info')}>
            <CreditCard size={14}/> Pay Now
          </button>
        </div>
      </div>

      {/* Account Summary */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:16, marginBottom:24 }}>
        {[
          { label:'Current Balance', value:`$${(user?.balance||285).toFixed(2)}`, sub:'Due May 1, 2026', color:'var(--danger)' },
          { label:'Total Paid YTD', value:`$${PAYMENT_HISTORY.filter(p=>p.status==='Completed').reduce((s,p)=>s+p.amount,0).toFixed(2)}`, sub:`${PAYMENT_HISTORY.filter(p=>p.status==='Completed').length} transactions`, color:'var(--success)' },
          { label:'Monthly Dues', value:`$${COMMUNITY.monthlyDues}/mo`, sub:'Annual: $'+COMMUNITY.monthlyDues*12, color:'var(--text-primary)' },
        ].map(s=>(
          <div key={s.label} className="stat-card">
            <div style={{ fontSize:22, fontFamily:'var(--font-display)', fontWeight:900, color:s.color, marginBottom:3 }}>{s.value}</div>
            <div style={{ fontSize:13, fontWeight:700, color:'var(--text-primary)', marginBottom:2 }}>{s.label}</div>
            <div style={{ fontSize:12, color:'var(--text-muted)' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="tabs">
        {[['history','Payment History'],['autopay','Autopay Settings'],['statements','Tax Statements']].map(([id,label])=>(
          <div key={id} className={`tab ${tab===id?'active':''}`} onClick={()=>setTab(id)}>{label}</div>
        ))}
      </div>

      {tab==='history' && (
        <div className="table-wrapper">
          <table>
            <thead><tr><th>Date</th><th>Description</th><th>Method</th><th>Amount</th><th>Status</th><th>Receipt</th></tr></thead>
            <tbody>
              {PAYMENT_HISTORY.map(p=>(
                <tr key={p.id}>
                  <td style={{ fontSize:13 }}>{p.date}</td>
                  <td><div style={{ fontWeight:600, fontSize:14 }}>{p.type}</div><div style={{ fontSize:12, color:'var(--text-muted)' }}>Unit {p.unit}</div></td>
                  <td><span className="badge badge-gray">{p.method}</span></td>
                  <td style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:15, color:p.status==='Failed'?'var(--danger)':'var(--text-primary)' }}>${p.amount.toFixed(2)}</td>
                  <td><span className={`badge ${p.status==='Completed'?'badge-green':p.status==='Failed'?'badge-red':'badge-yellow'}`}>{p.status}</span></td>
                  <td>
                    {p.receipt ? (
                      <button className="btn btn-ghost btn-sm" onClick={()=>downloadReceipt(p)} disabled={loading[p.id]}>
                        {loading[p.id]?<Spinner/>:<Download size={13}/>} PDF
                      </button>
                    ) : <span style={{ fontSize:12, color:'var(--text-muted)' }}>—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab==='autopay' && (
        <div className="card" style={{ maxWidth:560, padding:28 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
            <div>
              <h3 style={{ marginBottom:4 }}>Autopay Status</h3>
              <p style={{ margin:0, fontSize:14 }}>Automatically pay dues on the {COMMUNITY.dueDay}st of each month</p>
            </div>
            <button className={`toggle ${autopay?'on':''}`} onClick={()=>{ setAutopay(!autopay); addToast(autopay?'Autopay disabled':'Autopay enabled!',autopay?'warning':'success') }}/>
          </div>
          {autopay ? (
            <div>
              <div style={{ padding:'14px 18px', background:'var(--accent-subtle)', border:'1px solid var(--accent-primary)', borderRadius:12, marginBottom:20 }}>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <CheckCircle size={20} color="var(--accent-primary)"/>
                  <div>
                    <div style={{ fontWeight:700, fontSize:14, color:'var(--accent-primary)' }}>Autopay is Active</div>
                    <div style={{ fontSize:13, color:'var(--text-muted)' }}>ACH Bank Transfer · Charges on the 1st of each month</div>
                  </div>
                </div>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:20 }}>
                {[['Bank','Chase Bank (****4821)'],['Account Type','Checking'],['Next Charge',`${COMMUNITY.dueDay < 10 ? '0'+COMMUNITY.dueDay : COMMUNITY.dueDay}/01/2026`],['Amount','$'+COMMUNITY.monthlyDues+'.00']].map(([k,v])=>(
                  <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'10px 14px', background:'var(--bg-secondary)', borderRadius:8 }}>
                    <span style={{ fontSize:13, color:'var(--text-muted)' }}>{k}</span>
                    <span style={{ fontSize:13, fontWeight:700 }}>{v}</span>
                  </div>
                ))}
              </div>
              <div style={{ display:'flex', gap:10 }}>
                <button className="btn btn-secondary" onClick={()=>addToast('Bank account update flow opened','info')}>Update Bank Account</button>
                <button className="btn btn-danger" onClick={()=>{ setAutopay(false); addToast('Autopay cancelled. Please pay manually each month.','warning') }}>Cancel Autopay</button>
              </div>
            </div>
          ) : (
            <div>
              <p style={{ marginBottom:20, fontSize:14 }}>Set up autopay to never miss a payment. ACH bank transfers are free.</p>
              <div className="form-group"><label className="form-label">Bank Routing Number</label><input className="form-input" placeholder="021000021"/></div>
              <div className="form-group"><label className="form-label">Bank Account Number</label><input className="form-input" placeholder="Account number" type="password"/></div>
              <div className="form-group"><label className="form-label">Account Type</label><select className="form-select"><option>Checking</option><option>Savings</option></select></div>
              <button className="btn btn-primary" onClick={()=>{ setAutopay(true); addToast('Autopay enrolled! First charge on May 1, 2026','success') }}>
                <CheckCircle size={15}/> Enable Autopay
              </button>
            </div>
          )}
        </div>
      )}

      {tab==='statements' && (
        <div>
          <div style={{ padding:'14px 18px', background:'var(--bg-secondary)', borderRadius:12, marginBottom:20, fontSize:14 }}>
            Your annual HOA dues payment statement is useful for tax records. HOA dues are generally not tax-deductible for primary residences but may be deductible for rental properties. Consult your tax advisor.
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {[2026,2025,2024].map(year=>(
              <div key={year} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 20px', background:'var(--bg-card)', border:'1px solid var(--border-color)', borderRadius:12 }}>
                <div>
                  <div style={{ fontWeight:700, fontSize:15 }}>HOA Dues Statement — {year}</div>
                  <div style={{ fontSize:13, color:'var(--text-muted)' }}>Unit {user?.unit} · {COMMUNITY.name} · {year==='2026'?'YTD':year+' Full Year'}</div>
                  <div style={{ fontSize:13, fontWeight:700, color:'var(--accent-primary)', marginTop:4 }}>Total Paid: ${year===2026?'1,140':year===2025?'3,420':'3,120'}.00</div>
                </div>
                <button className="btn btn-primary btn-sm" onClick={downloadStatement} disabled={loading['statement']}>
                  {loading['statement']?<Spinner/>:<Download size={13}/>} Download PDF
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────
// RESIDENT MAINTENANCE REQUESTS
// ─────────────────────────────────────────────────────
export function ResidentRequests() {
  const { user } = useAuth()
  const { addToast } = useToast()
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ category:'Plumbing', title:'', description:'', priority:'Normal', availableFrom:'', availableTo:'' })
  const myRequests = MAINTENANCE_REQUESTS.filter(r=>r.unit===user?.unit)

  const STATUS_COLOR = { New:'badge-gray', 'In Progress':'badge-yellow', Assigned:'badge-blue', Resolved:'badge-green', 'Pending Approval':'badge-yellow', Scheduled:'badge-blue' }
  const PRIORITY_COLOR = { Emergency:'badge-red', High:'badge-yellow', Normal:'badge-gray', Low:'badge-green' }

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:28, flexWrap:'wrap', gap:16 }}>
        <div>
          <h2 style={{ marginBottom:4 }}>Maintenance Requests</h2>
          <p>Submit and track work orders for your unit and common areas</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={()=>setShowModal(true)}><Plus size={14}/> New Request</button>
      </div>

      <div className="grid-4" style={{ marginBottom:24 }}>
        {[
          { label:'Total', value:myRequests.length, color:'var(--text-primary)' },
          { label:'Open', value:myRequests.filter(r=>r.status==='New'||r.status==='Assigned').length, color:'#ef4444' },
          { label:'In Progress', value:myRequests.filter(r=>r.status==='In Progress'||r.status==='Scheduled').length, color:'#f59e0b' },
          { label:'Resolved', value:myRequests.filter(r=>r.status==='Resolved').length, color:'#22c55e' },
        ].map(s=>(
          <div key={s.label} className="card" style={{ padding:'16px 20px', textAlign:'center' }}>
            <div style={{ fontSize:28, fontFamily:'var(--font-display)', fontWeight:900, color:s.color }}>{s.value}</div>
            <div style={{ fontSize:13, color:'var(--text-muted)', fontWeight:500 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {myRequests.length===0 ? (
        <div className="card" style={{ textAlign:'center', padding:'48px 24px' }}>
          <Wrench size={48} style={{ color:'var(--text-muted)', opacity:0.3, marginBottom:16 }}/>
          <h3>No maintenance requests yet</h3>
          <p>Submit a request for any issues in your unit or common areas.</p>
          <button className="btn btn-primary" style={{ marginTop:16 }} onClick={()=>setShowModal(true)}><Plus size={15}/> Submit First Request</button>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {myRequests.map(req=>(
            <div key={req.id} className="card" style={{ padding:20 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:12, marginBottom:12 }}>
                <div>
                  <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap', marginBottom:6 }}>
                    <h3 style={{ fontSize:16, margin:0 }}>{req.title}</h3>
                    <span className={`badge ${PRIORITY_COLOR[req.priority]||'badge-gray'}`}>{req.priority}</span>
                    <span className={`badge ${STATUS_COLOR[req.status]||'badge-gray'}`}>{req.status}</span>
                  </div>
                  <div style={{ fontSize:13, color:'var(--text-muted)' }}>{req.category} · Submitted {req.created} · ID: {req.id}</div>
                </div>
              </div>
              <p style={{ fontSize:14, marginBottom:12 }}>{req.description}</p>
              {req.assignedTo && <div style={{ fontSize:13, color:'var(--accent-primary)', fontWeight:600, marginBottom:8 }}>🔧 Assigned to: {req.assignedTo}</div>}
              {req.cost>0 && <div style={{ fontSize:13, color:'var(--text-muted)', marginBottom:8 }}>Estimated cost: <strong>${req.cost}</strong></div>}
              {req.status==='Resolved' && !req.satisfactionRating && (
                <div style={{ marginTop:12, padding:'12px 16px', background:'var(--bg-secondary)', borderRadius:10 }}>
                  <div style={{ fontSize:13, fontWeight:600, marginBottom:8 }}>How would you rate this repair?</div>
                  <div style={{ display:'flex', gap:8 }}>
                    {[1,2,3,4,5].map(star=>(
                      <button key={star} className="btn btn-secondary btn-sm" onClick={()=>addToast(`Thank you for rating ${star} stars!`,'success')}>{'⭐'.repeat(star)} {star}</button>
                    ))}
                  </div>
                </div>
              )}
              {req.satisfactionRating && <div style={{ fontSize:13, color:'var(--accent-primary)' }}>Your rating: {'⭐'.repeat(req.satisfactionRating)} — Thank you!</div>}
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-backdrop" onClick={()=>setShowModal(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-header">
              <h3>Submit Maintenance Request</h3>
              <button className="btn btn-ghost btn-icon" onClick={()=>setShowModal(false)}><X size={16}/></button>
            </div>
            <div className="modal-body">
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select className="form-select" value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}>
                    {['Plumbing','Electrical','HVAC','Appliance','Structural','Pest Control','Landscaping','Safety','Other'].map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select className="form-select" value={form.priority} onChange={e=>setForm(f=>({...f,priority:e.target.value}))}>
                    {['Normal','High','Emergency','Low'].map(p=><option key={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Issue Title *</label>
                <input className="form-input" placeholder="Brief description e.g. 'Kitchen faucet leaking'" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))}/>
              </div>
              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea className="form-textarea" placeholder="Describe the issue in detail. Include when it started, how severe it is, and any steps you've already taken..." value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))}/>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div className="form-group"><label className="form-label">Available From</label><input type="time" className="form-input" value={form.availableFrom} onChange={e=>setForm(f=>({...f,availableFrom:e.target.value}))}/></div>
                <div className="form-group"><label className="form-label">Available To</label><input type="time" className="form-input" value={form.availableTo} onChange={e=>setForm(f=>({...f,availableTo:e.target.value}))}/></div>
              </div>
              {form.priority==='Emergency' && (
                <div style={{ padding:'12px 16px', background:'#fef2f2', border:'1px solid #fecaca', borderRadius:10, fontSize:13, color:'#dc2626', fontWeight:600 }}>
                  🚨 Emergency requests trigger immediate SMS notification to management and target 4-hour response time.
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={()=>setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={()=>{ setShowModal(false); addToast('Request submitted! You\'ll receive SMS/email updates as it progresses.','success') }}>
                <Plus size={15}/> Submit Request
              </button>
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
  const [search, setSearch] = useState('')
  const [folder, setFolder] = useState('All')
  const folders = ['All',...[...new Set(DOCUMENTS.filter(d=>d.access==='Residents').map(d=>d.folder))]]
  const docs = DOCUMENTS.filter(d=>d.access==='Residents' && (folder==='All'||d.folder===folder) && (search===''||d.name.toLowerCase().includes(search.toLowerCase())))

  const ICON_COLOR = { PDF:'#ef4444', Excel:'#22c55e', Word:'#2563eb' }

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:28, flexWrap:'wrap', gap:16 }}>
        <div><h2 style={{ marginBottom:4 }}>Community Documents</h2><p>Governing documents, meeting minutes, forms, and more</p></div>
        <button className="btn btn-secondary btn-sm" onClick={()=>addToast('All documents downloading as ZIP...','info')}><Download size={14}/> Download All (ZIP)</button>
      </div>

      <div style={{ display:'flex', gap:12, marginBottom:20, flexWrap:'wrap' }}>
        <div className="search-box" style={{ flex:1, minWidth:240 }}>
          <span className="search-icon" style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)' }}>🔍</span>
          <input className="form-input" placeholder="Search documents..." value={search} onChange={e=>setSearch(e.target.value)} style={{ paddingLeft:38 }}/>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          {folders.map(f=>(
            <button key={f} onClick={()=>setFolder(f)} className="btn btn-sm" style={{ background:folder===f?'var(--accent-primary)':'var(--bg-secondary)', color:folder===f?'white':'var(--text-muted)', border:'1px solid var(--border-color)' }}>{f}</button>
          ))}
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(240px,1fr))', gap:16 }}>
        {docs.map(doc=>(
          <div key={doc.id} className="card" style={{ padding:18 }}>
            <div style={{ display:'flex', alignItems:'flex-start', gap:12, marginBottom:14 }}>
              <div style={{ width:40, height:40, background:(ICON_COLOR[doc.type]||'#6366f1')+'18', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>
                {doc.type==='PDF'?'📄':doc.type==='Excel'?'📊':'📝'}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700, fontSize:13, marginBottom:4, lineHeight:1.4 }}>{doc.name}</div>
                <div style={{ fontSize:11, color:'var(--text-muted)' }}>{doc.folder} · {doc.size}</div>
                <div style={{ fontSize:11, color:'var(--text-muted)', marginTop:2 }}>Updated: {doc.uploaded} · v{doc.version} · {doc.downloads} downloads</div>
              </div>
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <button className="btn btn-primary btn-sm" style={{ flex:1, justifyContent:'center' }} onClick={()=>addToast('Opening '+doc.name,'info')}>
                <Eye size={13}/> View
              </button>
              <button className="btn btn-secondary btn-sm" style={{ flex:1, justifyContent:'center' }} onClick={()=>addToast(doc.name+' downloaded','success')}>
                <Download size={13}/> Download
              </button>
            </div>
          </div>
        ))}
      </div>

      {docs.length===0 && (
        <div className="card" style={{ textAlign:'center', padding:'48px 24px' }}>
          <FileText size={48} style={{ color:'var(--text-muted)', opacity:0.3, marginBottom:16 }}/>
          <h3>No documents found</h3>
          <p>Try adjusting your search or folder filter.</p>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────
// RESIDENT ANNOUNCEMENTS
// ─────────────────────────────────────────────────────
export function ResidentAnnouncements() {
  const { addToast } = useToast()
  const [filter, setFilter] = useState('All')
  const types = ['All','Emergency','Community','Meeting','Maintenance']
  const filtered = ANNOUNCEMENTS.filter(a=>filter==='All'||a.type===filter)

  const TYPE_STYLE = {
    Emergency: { bg:'#fef2f2', border:'#ef4444', badge:'badge-red' },
    Meeting: { bg:'#eff6ff', border:'#3b82f6', badge:'badge-blue' },
    Community: { bg:'var(--bg-card)', border:'var(--border-color)', badge:'badge-green' },
    Maintenance: { bg:'#fffbeb', border:'#f59e0b', badge:'badge-yellow' },
  }

  return (
    <div>
      <div style={{ marginBottom:28 }}>
        <h2 style={{ marginBottom:4 }}>Announcements</h2>
        <p>Community updates, alerts, and important notices</p>
      </div>

      <div style={{ display:'flex', gap:8, marginBottom:24, flexWrap:'wrap' }}>
        {types.map(t=>(
          <button key={t} onClick={()=>setFilter(t)} className="btn btn-sm" style={{ background:filter===t?'var(--accent-primary)':'var(--bg-secondary)', color:filter===t?'white':'var(--text-muted)', border:'1px solid var(--border-color)' }}>{t}</button>
        ))}
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
        {filtered.map(ann=>{
          const style = TYPE_STYLE[ann.type] || TYPE_STYLE.Community
          return (
            <div key={ann.id} style={{ background:style.bg, border:`1px solid ${style.border}`, borderLeft:`4px solid ${style.border}`, borderRadius:14, padding:22 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:12, marginBottom:12 }}>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap', marginBottom:6 }}>
                    <h3 style={{ fontSize:16, margin:0 }}>{ann.title}</h3>
                    <span className={`badge ${style.badge}`}>{ann.type}</span>
                  </div>
                  <div style={{ fontSize:12, color:'var(--text-muted)' }}>Posted by {ann.author} · {ann.sent} · Sent via {ann.channels.join(', ')}</div>
                </div>
              </div>
              <p style={{ fontSize:14, lineHeight:1.7, margin:0 }}>{ann.body}</p>
            </div>
          )
        })}
      </div>

      {filtered.length===0 && (
        <div className="card" style={{ textAlign:'center', padding:'48px 24px' }}>
          <Megaphone size={48} style={{ color:'var(--text-muted)', opacity:0.3, marginBottom:16 }}/>
          <h3>No announcements in this category</h3>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────
// RESIDENT VOTING
// ─────────────────────────────────────────────────────
export function ResidentVoting() {
  const { user } = useAuth()
  const { addToast } = useToast()
  const [voted, setVoted] = useState({})
  const [proxyModal, setProxyModal] = useState(null)

  const handleVote = (voteId, choice) => {
    setVoted(v=>({...v,[voteId]:choice}))
    addToast(`Vote recorded: ${choice}. Your vote is anonymous and encrypted.`,'success')
  }

  return (
    <div>
      <div style={{ marginBottom:28 }}>
        <h2 style={{ marginBottom:4 }}>Voting & Elections</h2>
        <p>Cast your vote on HOA resolutions, elections, and surveys</p>
      </div>

      {/* Active Votes */}
      <h3 style={{ fontSize:16, marginBottom:16, color:'var(--accent-primary)' }}>Active Votes ({VOTES.filter(v=>v.status==='Active').length})</h3>

      <div style={{ display:'flex', flexDirection:'column', gap:20, marginBottom:32 }}>
        {VOTES.filter(v=>v.status==='Active').map(vote=>{
          const total=vote.yesVotes+vote.noVotes+vote.abstain
          const pctVoted=vote.eligible>0?Math.round((total/vote.eligible)*100):0
          const alreadyVoted = voted[vote.id]
          return (
            <div key={vote.id} className="card" style={{ padding:24 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:12, marginBottom:16 }}>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap', marginBottom:6 }}>
                    <h3 style={{ fontSize:17, margin:0 }}>{vote.title}</h3>
                    <span className="badge badge-green">Active</span>
                    <span className="badge badge-blue">{vote.type}</span>
                    {vote.anonymous && <span className="badge badge-gray">Anonymous</span>}
                  </div>
                  <p style={{ fontSize:14, margin:0, marginBottom:8 }}>{vote.description}</p>
                  <div style={{ fontSize:12, color:'var(--text-muted)' }}>Deadline: {vote.deadline} · Eligible voters: {vote.eligible} · Quorum: {vote.quorum}%</div>
                </div>
              </div>

              {/* Progress */}
              <div style={{ marginBottom:16 }}>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, marginBottom:6 }}>
                  <span style={{ fontWeight:600 }}>Participation: {pctVoted}%</span>
                  <span style={{ color:pctVoted>=vote.quorum?'var(--success)':'var(--warning)', fontWeight:700 }}>
                    {pctVoted>=vote.quorum?'✓ Quorum Met':'Need '+vote.quorum+'% quorum'}
                  </span>
                </div>
                <div className="progress-bar" style={{ height:10 }}>
                  <div className="progress-fill" style={{ width:`${pctVoted}%`, background:pctVoted>=vote.quorum?'var(--success)':'var(--warning)'}}/>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10, marginTop:12 }}>
                  {[['Yes',vote.yesVotes,'#22c55e'],['No',vote.noVotes,'#ef4444'],['Abstain',vote.abstain,'#9ca3af']].map(([label,count,color])=>(
                    <div key={label} style={{ textAlign:'center', padding:'10px', background:'var(--bg-secondary)', borderRadius:8 }}>
                      <div style={{ fontSize:18, fontWeight:900, fontFamily:'var(--font-display)', color }}>{count}</div>
                      <div style={{ fontSize:12, color:'var(--text-muted)' }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {alreadyVoted ? (
                <div style={{ padding:'12px 16px', background:'var(--accent-subtle)', border:'1px solid var(--accent-primary)', borderRadius:10, display:'flex', alignItems:'center', gap:10 }}>
                  <CheckCircle size={18} color="var(--accent-primary)"/>
                  <span style={{ fontWeight:600, fontSize:14, color:'var(--accent-primary)' }}>You voted: {alreadyVoted}</span>
                  {vote.anonymous && <span style={{ fontSize:12, color:'var(--text-muted)' }}>· Anonymous & encrypted</span>}
                </div>
              ) : (
                <div>
                  <div style={{ fontSize:13, fontWeight:600, marginBottom:10 }}>Cast Your Vote:</div>
                  <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
                    <button className="btn btn-primary" onClick={()=>handleVote(vote.id,'Yes')}><CheckCircle size={15}/> Vote Yes</button>
                    <button className="btn btn-danger" onClick={()=>handleVote(vote.id,'No')}><X size={15}/> Vote No</button>
                    <button className="btn btn-secondary" onClick={()=>handleVote(vote.id,'Abstain')}>Abstain</button>
                    <button className="btn btn-ghost" onClick={()=>setProxyModal(vote.id)}>Assign Proxy</button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Past Votes */}
      <h3 style={{ fontSize:16, marginBottom:16, color:'var(--text-muted)' }}>Closed Votes</h3>
      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {VOTES.filter(v=>v.status==='Closed').map(vote=>(
          <div key={vote.id} className="card" style={{ padding:20, opacity:0.85 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:12 }}>
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap', marginBottom:6 }}>
                  <h3 style={{ fontSize:15, margin:0 }}>{vote.title}</h3>
                  <span className={`badge ${vote.passed?'badge-green':'badge-red'}`}>{vote.passed?'PASSED':'FAILED'}</span>
                </div>
                <div style={{ fontSize:13, color:'var(--text-muted)' }}>Closed: {vote.deadline} · Yes: {vote.yesVotes} · No: {vote.noVotes} · Abstain: {vote.abstain}</div>
                {vote.certifiedDate && <div style={{ fontSize:12, color:'var(--accent-primary)', fontWeight:600, marginTop:4 }}>Certified: {vote.certifiedDate}</div>}
              </div>
              <button className="btn btn-secondary btn-sm" onClick={()=>addToast('Certified results PDF downloaded','success')}><Download size={13}/> Results PDF</button>
            </div>
          </div>
        ))}
      </div>

      {/* Proxy Modal */}
      {proxyModal && (
        <div className="modal-backdrop" onClick={()=>setProxyModal(null)}>
          <div className="modal" style={{ maxWidth:440 }} onClick={e=>e.stopPropagation()}>
            <div className="modal-header"><h3>Assign Proxy Vote</h3><button className="btn btn-ghost btn-icon" onClick={()=>setProxyModal(null)}><X size={16}/></button></div>
            <div className="modal-body">
              <p style={{ fontSize:14, marginBottom:16 }}>Designate another homeowner to vote on your behalf. Your proxy must be a registered homeowner in {COMMUNITY.name}.</p>
              <div className="form-group"><label className="form-label">Proxy Holder Name *</label><input className="form-input" placeholder="Full name of homeowner"/></div>
              <div className="form-group"><label className="form-label">Proxy Holder Unit *</label><input className="form-input" placeholder="e.g. 6C"/></div>
              <div className="form-group"><label className="form-label">Your Vote Direction</label>
                <select className="form-select"><option>Vote Yes on my behalf</option><option>Vote No on my behalf</option><option>Use their own judgment</option></select>
              </div>
              <div style={{ padding:'10px 14px', background:'var(--bg-secondary)', borderRadius:8, fontSize:12, color:'var(--text-muted)' }}>
                By submitting a proxy, you authorize the named homeowner to vote on your behalf. This proxy is recorded per your HOA bylaws and Texas Property Code § 209.00592.
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={()=>setProxyModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={()=>{ setProxyModal(null); addToast('Proxy assignment submitted and recorded!','success') }}>Submit Proxy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
