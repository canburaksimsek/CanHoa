import React, { useState } from 'react'
import { useToast } from '../../context/AppContext.jsx'
import {
  AlertTriangle, Plus, Search, Download, FileText,
  Megaphone, Vote, BarChart3, Truck, Settings as SettingsIcon,
  CheckCircle, XCircle, Mail, Phone, MessageSquare, Eye,
  Calendar, Clock, DollarSign, Shield, Globe, Bell, Users,
  ArrowRight, Star, Lock, TrendingUp, Wrench
} from 'lucide-react'
import {
  VIOLATIONS, DOCUMENTS, ANNOUNCEMENTS, VOTES, AMENITIES,
  VENDORS, COMMUNITY, FINANCIAL_SUMMARY, MONTHLY_COLLECTIONS,
  EXPENSE_CATEGORIES, DELINQUENCY_AGING
} from '../../data/mockData.js'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend
} from 'recharts'

// ─────────────────────────────────────────────────────
// VIOLATIONS
// ─────────────────────────────────────────────────────
export function Violations() {
  const { addToast } = useToast()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [typeFilter, setTypeFilter] = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [showEscalateModal, setShowEscalateModal] = useState(null)
  const [showHearingModal, setShowHearingModal] = useState(null)
  const [violations, setViolations] = useState(VIOLATIONS)
  const [form, setForm] = useState({ unit:'', resident:'', type:'Parking', description:'', fine:75, sendUSPS:false, sendEmail:true, sendSMS:false })

  const ESCALATION_STEPS = [
    { level:1, label:'1st Notice', action:'Email + Portal notification', days:14 },
    { level:2, label:'2nd Certified Notice', action:'USPS Certified Mail + Email', days:14 },
    { level:3, label:'Board Hearing', action:'10-day hearing notice required (TX § 209.007)', days:10 },
    { level:4, label:'Fine Applied', action:'Fine charged to account, appears on statement', days:0 },
    { level:5, label:'Lien Filed', action:'Attorney referral + lien on property (90+ days)', days:0 },
  ]

  const filtered = violations.filter(v => {
    const matchSearch = v.unit.toLowerCase().includes(search.toLowerCase()) || v.type.toLowerCase().includes(search.toLowerCase()) || v.resident.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'All' || v.status === statusFilter
    const matchType = typeFilter === 'All' || v.type === typeFilter
    return matchSearch && matchStatus && matchType
  })

  const STATUS_COLORS = { Open:'#ef4444', 'Hearing Scheduled':'#f59e0b', Resolved:'#2b52a0', Appealed:'#8b5cf6' }
  const types = ['All', 'Parking', 'Noise', 'Landscaping', 'Modification', 'Pet', 'Trash', 'Other']
  const statuses = ['All', 'Open', 'Hearing Scheduled', 'Resolved', 'Appealed']

  const resolveViolation = (id) => {
    setViolations(vs => vs.map(v => v.id===id ? {...v, status:'Resolved', resolvedDate: new Date().toISOString().slice(0,10)} : v))
    addToast('Violation resolved and homeowner notified', 'success')
  }

  const escalate = (viol) => {
    const nextLevel = (viol.escalationLevel || 1) + 1
    const nextStep = ESCALATION_STEPS[nextLevel - 1]
    setViolations(vs => vs.map(v => v.id===viol.id ? {...v, escalationLevel:nextLevel, noticesSent:(v.noticesSent||0)+1, status:nextLevel>=3?'Hearing Scheduled':'Open'} : v))
    setShowEscalateModal(null)
    addToast(`Escalated to Level ${nextLevel}: ${nextStep?.label} — ${viol.resident} notified`, 'success')
  }

  const getDaysRemaining = (dueDate) => {
    if (!dueDate) return null
    const days = Math.ceil((new Date(dueDate) - new Date()) / 86400000)
    return days
  }

  return (
    <div>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:28, flexWrap:'wrap', gap:16 }}>
        <div>
          <h2 style={{ marginBottom:4 }}>Violation Management</h2>
          <p>CC&R enforcement with due process compliance — Fair Housing Act monitored</p>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <button className="btn btn-secondary btn-sm" onClick={()=>addToast('Violations report exporting...','info')}><Download size={14}/> Export PDF</button>
          <button className="btn btn-primary btn-sm" onClick={()=>setShowModal(true)}><Plus size={14}/> New Violation</button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid-4" style={{ marginBottom:24 }}>
        {[
          { label:'Open', value:violations.filter(v=>v.status==='Open').length, color:'#ef4444' },
          { label:'Hearing Scheduled', value:violations.filter(v=>v.status==='Hearing Scheduled').length, color:'#f59e0b' },
          { label:'Resolved (30d)', value:violations.filter(v=>v.status==='Resolved').length, color:'#2b52a0' },
          { label:'Fines Assessed', value:'$' + (violations.reduce((s,v)=>s+v.fine,0)), color:'#3b82f6' },
        ].map(s=>(
          <div key={s.label} className="card" style={{ padding:'16px 20px' }}>
            <div style={{ fontSize:26, fontFamily:'var(--font-display)', fontWeight:900, color:s.color }}>{s.value}</div>
            <div style={{ fontSize:13, color:'var(--text-muted)', fontWeight:500 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Escalation Pipeline Visual */}
      <div className="card" style={{ marginBottom:20, padding:20 }}>
        <div className="card-title" style={{ marginBottom:14 }}>Escalation Pipeline — Texas Property Code § 209.006/209.007</div>
        <div style={{ display:'flex', alignItems:'center', gap:0, overflowX:'auto' }}>
          {ESCALATION_STEPS.map((step, i) => (
            <React.Fragment key={step.level}>
              <div style={{ minWidth:140, padding:'12px 14px', background:i===0?'var(--accent-subtle)':i>=3?'#fef2f2':'var(--bg-secondary)', border:`1px solid ${i===0?'var(--accent-primary)':i>=3?'#fecaca':'var(--border-color)'}`, borderRadius:10, textAlign:'center' }}>
                <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', color:i>=3?'var(--danger)':'var(--accent-primary)', marginBottom:4 }}>Level {step.level}</div>
                <div style={{ fontWeight:700, fontSize:12, marginBottom:4, color:'var(--text-primary)' }}>{step.label}</div>
                <div style={{ fontSize:10, color:'var(--text-muted)', lineHeight:1.4 }}>{step.action}</div>
                {step.days>0 && <div style={{ fontSize:10, fontWeight:700, color:'var(--accent-primary)', marginTop:4 }}>{step.days}-day window</div>}
              </div>
              {i<ESCALATION_STEPS.length-1 && <div style={{ width:20, height:2, background:'var(--border-strong)', flexShrink:0 }}><span style={{ display:'block', textAlign:'center', marginTop:-8, fontSize:14 }}>→</span></div>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div style={{ display:'flex', gap:12, marginBottom:16, flexWrap:'wrap' }}>
        <div className="search-box" style={{ flex:1, minWidth:200 }}>
          <Search size={16} className="search-icon"/>
          <input className="form-input" placeholder="Search violations..." value={search} onChange={e=>setSearch(e.target.value)} style={{ paddingLeft:40 }}/>
        </div>
        <select className="form-select" style={{ width:140 }} value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}>
          {statuses.map(s=><option key={s}>{s}</option>)}
        </select>
        <select className="form-select" style={{ width:130 }} value={typeFilter} onChange={e=>setTypeFilter(e.target.value)}>
          {types.map(t=><option key={t}>{t}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table>
          <thead><tr><th>Unit</th><th>Resident</th><th>Type</th><th>Status</th><th>Escalation Level</th><th>Fine</th><th>Cure Deadline</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.map(v=>{
              const daysLeft = getDaysRemaining(v.dueDate)
              return (
                <tr key={v.id}>
                  <td><strong style={{ color:'var(--accent-primary)', fontFamily:'var(--font-display)' }}>{v.unit}</strong></td>
                  <td style={{ fontWeight:600, fontSize:14 }}>{v.resident}</td>
                  <td><span className="badge badge-yellow">{v.type}</span></td>
                  <td><span className="badge" style={{ background:(STATUS_COLORS[v.status]||'#6b7280')+'20', color:STATUS_COLORS[v.status]||'#6b7280' }}>{v.status}</span></td>
                  <td>
                    <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                      <span style={{ fontSize:12, fontWeight:700, color:'var(--text-muted)' }}>Level {v.escalationLevel||1}</span>
                      <span style={{ fontSize:11, color:'var(--accent-primary)' }}>— {ESCALATION_STEPS[(v.escalationLevel||1)-1]?.label}</span>
                    </div>
                    <div style={{ fontSize:10, color:'var(--text-muted)', marginTop:2 }}>Notices sent: {v.noticesSent}</div>
                  </td>
                  <td style={{ fontWeight:700, fontFamily:'var(--font-display)', color:v.fine>0?'var(--danger)':'var(--text-muted)' }}>${v.fine}</td>
                  <td>
                    {v.status!=='Resolved' && daysLeft!==null && (
                      <div style={{ display:'flex', flex:'column', gap:2 }}>
                        <span style={{ fontSize:12, fontWeight:700, color:daysLeft<=3?'var(--danger)':daysLeft<=7?'var(--warning)':'var(--text-muted)' }}>
                          {daysLeft>0?`${daysLeft} days left`:'OVERDUE'}
                        </span>
                        <div style={{ fontSize:11, color:'var(--text-muted)' }}>{v.dueDate}</div>
                      </div>
                    )}
                    {v.status==='Resolved' && <span className="badge badge-green">Resolved {v.resolvedDate||''}</span>}
                  </td>
                  <td>
                    <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
                      {v.status!=='Resolved' && (
                        <>
                          <button className="btn btn-secondary btn-sm" onClick={()=>setShowEscalateModal(v)}>Escalate</button>
                          {v.status==='Hearing Scheduled' && <button className="btn btn-primary btn-sm" onClick={()=>setShowHearingModal(v)}>Record Outcome</button>}
                          <button className="btn btn-ghost btn-sm" style={{ color:'var(--success)' }} onClick={()=>resolveViolation(v.id)}>Resolve</button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Fair Housing Notice */}
      <div style={{ marginTop:20, padding:'14px 20px', background:'var(--bg-secondary)', border:'1px solid var(--border-color)', borderLeft:'4px solid var(--accent-primary)', borderRadius:10 }}>
        <div style={{ display:'flex', alignItems:'flex-start', gap:10 }}>
          <Shield size={18} color="var(--accent-primary)" style={{ flexShrink:0, marginTop:2 }}/>
          <div>
            <div style={{ fontWeight:700, fontSize:14, marginBottom:4 }}>Fair Housing Act Compliance (42 U.S.C. § 3604)</div>
            <p style={{ fontSize:13, margin:0 }}>CanHoa automatically monitors violation patterns across protected classes. All enforcement actions are applied consistently. Texas Property Code § 209.006 requires written notice before hearings. § 209.007 requires board hearings within a reasonable time at resident request. Retain all violation records for 7 years.</p>
          </div>
        </div>
      </div>

      {/* New Violation Modal */}
      {showModal && (
        <div className="modal-backdrop" onClick={()=>setShowModal(false)}>
          <div className="modal modal-lg" onClick={e=>e.stopPropagation()}>
            <div className="modal-header">
              <h3>Record New Violation</h3>
              <button className="btn btn-ghost btn-icon" onClick={()=>setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div className="form-group"><label className="form-label">Unit *</label><input className="form-input" placeholder="e.g. 4B" value={form.unit} onChange={e=>setForm(f=>({...f,unit:e.target.value}))}/></div>
                <div className="form-group"><label className="form-label">Resident Name</label><input className="form-input" placeholder="Auto-filled from unit" value={form.resident} onChange={e=>setForm(f=>({...f,resident:e.target.value}))}/></div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div className="form-group">
                  <label className="form-label">Violation Type *</label>
                  <select className="form-select" value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}>
                    {['Parking','Noise','Landscaping','Modification','Pet','Trash','Commercial Activity','Short-Term Rental','Other'].map(t=><option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group"><label className="form-label">Fine Amount ($)</label><input type="number" className="form-input" value={form.fine} onChange={e=>setForm(f=>({...f,fine:+e.target.value}))}/></div>
              </div>
              <div className="form-group">
                <label className="form-label">Description (CC&R Reference) *</label>
                <textarea className="form-textarea" placeholder="Describe the violation and reference the specific CC&R section. Example: 'Vehicle parked in fire lane for 24+ hours in violation of CC&Rs Section 7.2.1'" value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))}/>
              </div>
              <div className="form-group">
                <label className="form-label">Photo Evidence (optional)</label>
                <div style={{ padding:'16px', border:'2px dashed var(--border-color)', borderRadius:10, textAlign:'center', background:'var(--bg-secondary)', cursor:'pointer' }}
                  onClick={()=>addToast('Photo upload: attach up to 5 photos as evidence','info')}>
                  <div style={{ fontSize:24, marginBottom:6 }}>📷</div>
                  <div style={{ fontSize:13, color:'var(--text-muted)' }}>Click to attach photos (JPG, PNG · max 5MB each)</div>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Notification Channels</label>
                <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
                  {[['sendEmail','Email (free)'],['sendSMS','SMS ($0.02/msg)'],['sendUSPS','USPS Certified Mail ($7.50)']].map(([key,label])=>(
                    <label key={key} style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer', fontSize:13 }}>
                      <input type="checkbox" checked={form[key]} onChange={e=>setForm(f=>({...f,[key]:e.target.checked}))} style={{ accentColor:'var(--accent-primary)' }}/>{label}
                    </label>
                  ))}
                </div>
                {form.sendUSPS && <div style={{ fontSize:12, color:'var(--warning)', marginTop:6, fontWeight:600 }}>⚠️ USPS Certified Mail satisfies Texas § 209.006 formal notice requirement for hearings</div>}
              </div>
              <div style={{ padding:'10px 14px', background:'#fef2f2', border:'1px solid #fecaca', borderRadius:8, fontSize:13 }}>
                <strong>Due Process Reminder:</strong> Resident has the right to request a board hearing within the cure period per Texas Property Code § 209.007. The board must schedule the hearing within 30 days of request.
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={()=>setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={()=>{
                const newViolation = { id:'vio-'+Date.now(), unit:form.unit||'N/A', resident:form.resident||'Unknown', type:form.type, description:form.description, status:'Open', fine:form.fine, created:new Date().toISOString().slice(0,10), dueDate:new Date(Date.now()+14*86400000).toISOString().slice(0,10), noticesSent:1, escalationLevel:1, photos:0, hearingRequested:false }
                setViolations(vs=>[newViolation,...vs])
                setShowModal(false)
                addToast(`Violation recorded for Unit ${form.unit}. 1st notice sent via ${[form.sendEmail&&'email',form.sendSMS&&'SMS',form.sendUSPS&&'USPS'].filter(Boolean).join(', ')||'portal'}.`,'success')
                setForm({ unit:'',resident:'',type:'Parking',description:'',fine:75,sendUSPS:false,sendEmail:true,sendSMS:false })
              }}>
                <Plus size={15}/> Record Violation & Send Notice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Escalate Modal */}
      {showEscalateModal && (
        <div className="modal-backdrop" onClick={()=>setShowEscalateModal(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-header">
              <h3>Escalate Violation</h3>
              <button className="btn btn-ghost btn-icon" onClick={()=>setShowEscalateModal(null)}>✕</button>
            </div>
            <div className="modal-body">
              <p style={{ marginBottom:16 }}>Current level: <strong>Level {showEscalateModal.escalationLevel||1} — {ESCALATION_STEPS[(showEscalateModal.escalationLevel||1)-1]?.label}</strong></p>
              <p style={{ marginBottom:16, fontSize:14 }}>Unit <strong>{showEscalateModal.unit}</strong> — {showEscalateModal.resident}</p>
              {(showEscalateModal.escalationLevel||1) < ESCALATION_STEPS.length ? (
                <>
                  <div style={{ padding:'14px 18px', background:'#fffbeb', border:'1px solid #fde68a', borderRadius:10, marginBottom:16 }}>
                    <strong>Next Step — Level {(showEscalateModal.escalationLevel||1)+1}:</strong> {ESCALATION_STEPS[(showEscalateModal.escalationLevel||1)]?.label}
                    <div style={{ fontSize:13, color:'var(--text-muted)', marginTop:4 }}>{ESCALATION_STEPS[(showEscalateModal.escalationLevel||1)]?.action}</div>
                  </div>
                  {(showEscalateModal.escalationLevel||1) >= 2 && (
                    <div style={{ padding:'12px 16px', background:'#fef2f2', border:'1px solid #fecaca', borderRadius:10, marginBottom:16, fontSize:13 }}>
                      <strong>Legal Notice:</strong> Texas Property Code § 209.007 requires providing at least 10 days notice before a board hearing. Ensure USPS certified mail is sent.
                    </div>
                  )}
                </>
              ) : (
                <div style={{ padding:'14px 18px', background:'#fef2f2', borderRadius:10, marginBottom:16 }}>
                  Maximum escalation reached. Consider attorney referral for lien filing.
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={()=>setShowEscalateModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={()=>escalate(showEscalateModal)} disabled={(showEscalateModal.escalationLevel||1)>=ESCALATION_STEPS.length}>
                Escalate to Level {(showEscalateModal.escalationLevel||1)+1}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hearing Outcome Modal */}
      {showHearingModal && (
        <div className="modal-backdrop" onClick={()=>setShowHearingModal(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-header">
              <h3>Record Hearing Outcome</h3>
              <button className="btn btn-ghost btn-icon" onClick={()=>setShowHearingModal(null)}>✕</button>
            </div>
            <div className="modal-body">
              <p style={{ marginBottom:16 }}>Unit {showHearingModal.unit} — {showHearingModal.resident} · {showHearingModal.type} violation</p>
              <div className="form-group"><label className="form-label">Hearing Date</label><input type="date" className="form-input" defaultValue={showHearingModal.hearingDate}/></div>
              <div className="form-group"><label className="form-label">Board Members Present</label><input className="form-input" placeholder="e.g. Patricia Williams, Sandra Torres, Kevin Park"/></div>
              <div className="form-group"><label className="form-label">Outcome</label>
                <select className="form-select">
                  <option>Fine upheld — violation confirmed</option>
                  <option>Fine reduced — partial violation</option>
                  <option>Fine waived — violation dismissed</option>
                  <option>Continued — more evidence needed</option>
                </select>
              </div>
              <div className="form-group"><label className="form-label">Board Decision Notes</label><textarea className="form-textarea" placeholder="Record the board's written decision. Texas § 209.007 requires written decision within 10 business days."/></div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={()=>setShowHearingModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={()=>{ resolveViolation(showHearingModal.id); setShowHearingModal(null); addToast('Hearing outcome recorded. Written decision will be mailed to resident within 10 business days.','success') }}>
                Record Outcome & Close Case
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────
// DOCUMENTS
// ─────────────────────────────────────────────────────
export function Documents() {
  const { addToast } = useToast()
  const [folder, setFolder] = useState('All')
  const [search, setSearch] = useState('')

  const FOLDERS = ['All', 'Governing Documents', 'Meeting Minutes', 'Financial Records', 'Insurance', 'Vendor Contracts']
  const filtered = DOCUMENTS.filter(d =>
    (folder === 'All' || d.folder === folder) &&
    d.name.toLowerCase().includes(search.toLowerCase())
  )

  const getTypeColor = t => ({ PDF: '#ef4444', Excel: '#2b52a0', Word: '#3b82f6' }[t] || '#6b7280')

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ marginBottom: 4 }}>Document Library</h2>
          <p>Secure cloud storage for all HOA documents</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary btn-sm" onClick={() => addToast('All documents downloaded as ZIP', 'success')}><Download size={14} /> Download All</button>
          <button className="btn btn-primary btn-sm" onClick={() => addToast('Upload dialog opened', 'info')}><Plus size={14} /> Upload Document</button>
        </div>
      </div>

      {/* Storage indicator */}
      <div className="card" style={{ marginBottom: 24, padding: '16px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontWeight: 600, fontSize: 14 }}>Storage Used</span>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>11.0 MB of Unlimited</span>
        </div>
        <div className="progress-bar"><div className="progress-fill" style={{ width: '2%' }} /></div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>Unlimited storage included in your Growth plan</div>
      </div>

      <div style={{ display: 'flex', gap: 16 }}>
        {/* Folder sidebar */}
        <div style={{ width: 200, flexShrink: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: 8 }}>Folders</div>
          {FOLDERS.map(f => (
            <div key={f} onClick={() => setFolder(f)} style={{ padding: '10px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: folder === f ? 700 : 500, background: folder === f ? 'var(--accent-light)' : 'transparent', color: folder === f ? 'var(--accent-primary)' : 'var(--text-muted)', marginBottom: 2, transition: 'all 0.15s' }}>
              📁 {f}
            </div>
          ))}
          <button className="btn btn-ghost btn-sm" style={{ marginTop: 8, width: '100%', justifyContent: 'flex-start', fontSize: 13 }} onClick={() => addToast('New folder created!', 'success')}>
            <Plus size={14} /> New Folder
          </button>
        </div>

        {/* Document list */}
        <div style={{ flex: 1 }}>
          <div className="search-box" style={{ marginBottom: 16 }}>
            <Search size={16} className="search-icon" />
            <input className="form-input" placeholder="Search documents..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 40 }} />
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>Name</th><th>Folder</th><th>Type</th><th>Access</th><th>Uploaded</th><th>Version</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.map(doc => (
                  <tr key={doc.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 32, height: 32, background: getTypeColor(doc.type) + '20', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: getTypeColor(doc.type) }}>
                          {doc.type}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 14 }}>{doc.name}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{doc.size}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: 13, color: 'var(--text-muted)' }}>{doc.folder}</td>
                    <td><span className="badge" style={{ background: getTypeColor(doc.type) + '20', color: getTypeColor(doc.type) }}>{doc.type}</span></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        {doc.access === 'Admin' ? <Lock size={13} /> : <Globe size={13} />}
                        <span style={{ fontSize: 12 }}>{doc.access}</span>
                      </div>
                    </td>
                    <td style={{ fontSize: 13, color: 'var(--text-muted)' }}>{doc.uploaded}</td>
                    <td><span className="badge badge-gray">v{doc.version}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-ghost btn-sm btn-icon" onClick={() => addToast('Document downloaded', 'success')}><Download size={14} /></button>
                        <button className="btn btn-ghost btn-sm btn-icon" onClick={() => addToast('Document viewed', 'info')}><Eye size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────
// ANNOUNCEMENTS
// ─────────────────────────────────────────────────────
export function Announcements() {
  const { addToast } = useToast()
  const [showCompose, setShowCompose] = useState(false)
  const [compose, setCompose] = useState({ title: '', body: '', channels: ['Email'], type: 'Community', scheduled: false, scheduledDate: '' })

  const toggleChannel = (ch) => {
    setCompose(c => ({
      ...c,
      channels: c.channels.includes(ch) ? c.channels.filter(x => x !== ch) : [...c.channels, ch]
    }))
  }

  const handleSend = () => {
    addToast(`Announcement sent via ${compose.channels.join(', ')}!`, 'success')
    setShowCompose(false)
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ marginBottom: 4 }}>Announcements & Communication</h2>
          <p>Email, SMS, phone calls, and USPS physical mail</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-danger btn-sm" onClick={() => addToast('🚨 Emergency alert sent to all channels!', 'error')}>
            🚨 Emergency Alert
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => setShowCompose(true)}>
            <Megaphone size={14} /> Compose
          </button>
        </div>
      </div>

      {/* Channels overview */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        {[
          { label: 'Email', icon: Mail, count: '118 residents', color: '#3b82f6', rate: '78% open rate' },
          { label: 'SMS', icon: MessageSquare, count: '94 opted in', color: '#2b52a0', rate: 'Unlimited included' },
          { label: 'Phone Call', icon: Phone, count: 'Emergency use', color: '#f59e0b', rate: 'Twilio powered' },
          { label: 'USPS Mail', icon: FileText, count: 'Via Lob.com', color: '#8b5cf6', rate: '$1.05/piece' },
        ].map(ch => (
          <div key={ch.label} className="card" style={{ padding: '16px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <div style={{ width: 36, height: 36, background: ch.color + '20', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ch.icon size={18} color={ch.color} />
              </div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{ch.label}</div>
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{ch.count}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{ch.rate}</div>
          </div>
        ))}
      </div>

      {/* Message Boards */}
      <div className="card" style={{ marginBottom: 24, padding: '18px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontWeight: 700, fontSize: 15 }}>Community Message Boards</div>
          <button className="btn btn-secondary btn-sm">Open Board Manager</button>
        </div>
        <p style={{ fontSize: 14, margin: 0 }}>Private discussion threads for residents. All messages are visible in the homeowner portal and sent to email. Only logged-in residents can view and reply.</p>
      </div>

      {/* Recent announcements */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {ANNOUNCEMENTS.map(ann => (
          <div key={ann.id} className="card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14, flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                  <h3 style={{ fontSize: 16, margin: 0 }}>{ann.title}</h3>
                  <span className={`badge ${ann.type === 'Emergency' ? 'badge-red' : ann.type === 'Meeting' ? 'badge-blue' : 'badge-green'}`}>{ann.type}</span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Sent {ann.sent} by {ann.author}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 20, fontFamily: 'var(--font-display)', fontWeight: 900, color: 'var(--accent-primary)' }}>{ann.openRate}%</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>open rate</div>
              </div>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.7, marginBottom: 14 }}>{ann.body.slice(0, 200)}...</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
              <div style={{ display: 'flex', gap: 6 }}>
                {ann.channels.map(ch => <span key={ch} className="badge badge-gray">{ch}</span>)}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-ghost btn-sm" onClick={() => addToast('Announcement viewed', 'info')}>View Full</button>
                <button className="btn btn-secondary btn-sm" onClick={() => addToast('Resent!', 'success')}>Resend</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Compose Modal */}
      {showCompose && (
        <div className="modal-backdrop" onClick={() => setShowCompose(false)}>
          <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>New Announcement</h3>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowCompose(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Subject / Title *</label>
                  <input className="form-input" placeholder="Announcement subject..." value={compose.title} onChange={e => setCompose(c => ({ ...c, title: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Type</label>
                  <select className="form-select" value={compose.type} onChange={e => setCompose(c => ({ ...c, type: e.target.value }))}>
                    {['Community', 'Meeting', 'Emergency', 'Maintenance', 'Financial', 'Social'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Message Body *</label>
                <textarea className="form-textarea" style={{ minHeight: 140 }} placeholder="Write your announcement..." value={compose.body} onChange={e => setCompose(c => ({ ...c, body: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Delivery Channels</label>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {['Email', 'SMS', 'Phone Call', 'USPS Mail', 'Portal'].map(ch => (
                    <label key={ch} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', border: `1.5px solid ${compose.channels.includes(ch) ? 'var(--accent-primary)' : 'var(--border-color)'}`, borderRadius: 8, cursor: 'pointer', background: compose.channels.includes(ch) ? 'var(--accent-light)' : 'transparent', transition: 'all 0.15s' }}>
                      <input type="checkbox" checked={compose.channels.includes(ch)} onChange={() => toggleChannel(ch)} style={{ accentColor: 'var(--accent-primary)' }} />
                      <span style={{ fontSize: 14, fontWeight: 500, color: compose.channels.includes(ch) ? 'var(--accent-primary)' : 'var(--text-primary)' }}>{ch}</span>
                    </label>
                  ))}
                </div>
                {compose.channels.includes('USPS Mail') && (
                  <div style={{ marginTop: 10, padding: '10px 14px', background: 'var(--bg-secondary)', borderRadius: 8, fontSize: 13, color: 'var(--text-muted)' }}>
                    📬 Physical USPS mail: ~$1.05/letter. Estimated cost: ${(118 * 1.05).toFixed(2)} for 118 units. Delivery tracking included.
                  </div>
                )}
              </div>
              <div className="form-group">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input type="checkbox" id="schedule" checked={compose.scheduled} onChange={e => setCompose(c => ({ ...c, scheduled: e.target.checked }))} style={{ accentColor: 'var(--accent-primary)' }} />
                  <label htmlFor="schedule" style={{ fontSize: 14, fontWeight: 500 }}>Schedule for later</label>
                </div>
                {compose.scheduled && (
                  <input type="datetime-local" className="form-input" style={{ marginTop: 8, maxWidth: 260 }} value={compose.scheduledDate} onChange={e => setCompose(c => ({ ...c, scheduledDate: e.target.value }))} />
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowCompose(false)}>Cancel</button>
              {compose.scheduled
                ? <button className="btn btn-primary" onClick={() => { addToast('Announcement scheduled!', 'success'); setShowCompose(false) }}>Schedule</button>
                : <button className="btn btn-primary" onClick={handleSend}>Send Now ({compose.channels.length} channels)</button>
              }
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────
// VOTING
// ─────────────────────────────────────────────────────
export function Voting() {
  const { addToast } = useToast()
  const [showNew, setShowNew] = useState(false)

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ marginBottom: 4 }}>Voting & Surveys</h2>
          <p>Board elections, resolutions, and community surveys</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowNew(true)}><Plus size={14} /> New Vote / Survey</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {VOTES.map(vote => {
          const total = vote.yesVotes + vote.noVotes + vote.abstain
          const pct = vote.eligible > 0 ? Math.round((total / vote.eligible) * 100) : 0
          const quorumMet = pct >= vote.quorum
          const yesPct = total > 0 ? Math.round((vote.yesVotes / total) * 100) : 0

          return (
            <div key={vote.id} className="card" style={{ padding: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
                    <h3 style={{ fontSize: 17, margin: 0 }}>{vote.title}</h3>
                    <span className={`badge ${vote.status === 'Active' ? 'badge-green' : 'badge-gray'}`}>{vote.status}</span>
                    <span className="badge badge-blue">{vote.type}</span>
                    {vote.anonymous && <span className="badge badge-purple">Anonymous</span>}
                  </div>
                  <p style={{ fontSize: 14, margin: 0, maxWidth: 560 }}>{vote.description}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Deadline: <strong>{vote.deadline}</strong></div>
                  {vote.status === 'Active' && <button className="btn btn-secondary btn-sm" style={{ marginTop: 8 }} onClick={() => addToast('Reminder sent to non-voters!', 'success')}>Send Reminder</button>}
                </div>
              </div>

              <div className="grid-3" style={{ gap: 20, marginBottom: 20 }}>
                <div style={{ textAlign: 'center', padding: '16px', background: 'var(--bg-secondary)', borderRadius: 12 }}>
                  <div style={{ fontSize: 28, fontFamily: 'var(--font-display)', fontWeight: 900, color: 'var(--accent-primary)' }}>{pct}%</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Participation Rate</div>
                  <div style={{ fontSize: 11, color: quorumMet ? 'var(--success)' : 'var(--warning)', fontWeight: 600, marginTop: 4 }}>
                    {quorumMet ? '✓ Quorum Met' : `Need ${vote.quorum}% quorum`}
                  </div>
                </div>
                <div style={{ textAlign: 'center', padding: '16px', background: '#dfe8fa', borderRadius: 12 }}>
                  <div style={{ fontSize: 28, fontFamily: 'var(--font-display)', fontWeight: 900, color: 'var(--success)' }}>{vote.yesVotes}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Yes / For</div>
                  {total > 0 && <div style={{ fontSize: 11, color: 'var(--success)', fontWeight: 600, marginTop: 4 }}>{yesPct}%</div>}
                </div>
                <div style={{ textAlign: 'center', padding: '16px', background: '#fef2f2', borderRadius: 12 }}>
                  <div style={{ fontSize: 28, fontFamily: 'var(--font-display)', fontWeight: 900, color: 'var(--danger)' }}>{vote.noVotes}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>No / Against</div>
                  {total > 0 && <div style={{ fontSize: 11, color: 'var(--danger)', fontWeight: 600, marginTop: 4 }}>{total > 0 ? Math.round((vote.noVotes / total) * 100) : 0}%</div>}
                </div>
              </div>

              {total > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
                    <span style={{ color: 'var(--success)', fontWeight: 600 }}>Yes: {vote.yesVotes}</span>
                    <span style={{ color: 'var(--danger)', fontWeight: 600 }}>No: {vote.noVotes}</span>
                  </div>
                  <div style={{ height: 10, background: 'var(--bg-tertiary)', borderRadius: 100, overflow: 'hidden', display: 'flex' }}>
                    <div style={{ height: '100%', background: 'var(--success)', width: `${yesPct}%`, transition: 'width 0.6s ease' }} />
                    <div style={{ height: '100%', background: 'var(--danger)', width: `${total > 0 ? Math.round((vote.noVotes / total) * 100) : 0}%` }} />
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: 10 }}>
                {vote.passed !== undefined && (
                  <span className={`badge ${vote.passed ? 'badge-green' : 'badge-red'}`} style={{ padding: '6px 14px' }}>
                    {vote.passed ? '✓ PASSED' : '✕ FAILED'}
                  </span>
                )}
                <button className="btn btn-secondary btn-sm" onClick={() => addToast('Certified results PDF downloaded', 'success')}>Download Results PDF</button>
                {vote.status === 'Active' && <button className="btn btn-secondary btn-sm" onClick={() => addToast('Vote closed!', 'warning')}>Close Voting</button>}
              </div>
            </div>
          )
        })}
      </div>

      {showNew && (
        <div className="modal-backdrop" onClick={() => setShowNew(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h3>New Vote / Survey</h3><button className="btn btn-ghost btn-icon" onClick={() => setShowNew(false)}>✕</button></div>
            <div className="modal-body">
              <div className="form-group"><label className="form-label">Title *</label><input className="form-input" placeholder="e.g. Board Election 2026" /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group"><label className="form-label">Type</label><select className="form-select"><option>Resolution</option><option>Election</option><option>Survey</option><option>Assessment</option></select></div>
                <div className="form-group"><label className="form-label">Deadline</label><input type="date" className="form-input" /></div>
              </div>
              <div className="form-group"><label className="form-label">Description</label><textarea className="form-textarea" placeholder="Describe what residents are voting on..." /></div>
              <div style={{ display: 'flex', gap: 16 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, cursor: 'pointer' }}>
                  <input type="checkbox" style={{ accentColor: 'var(--accent-primary)' }} /> Anonymous ballot
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, cursor: 'pointer' }}>
                  <input type="checkbox" style={{ accentColor: 'var(--accent-primary)' }} /> Allow proxy voting
                </label>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowNew(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => { addToast('Vote created and notice sent!', 'success'); setShowNew(false) }}>Create & Notify Residents</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────
// AMENITIES
// ─────────────────────────────────────────────────────
export function Amenities() {
  const { addToast } = useToast()

  const ICONS = { Pool: '🏊', Gym: '💪', 'Event Space': '🎉', Sports: '🎾', Outdoor: '🌿' }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ marginBottom: 4 }}>Amenity Management</h2>
          <p>Manage bookings, capacity limits, and facility schedules</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => addToast('New amenity created!', 'success')}><Plus size={14} /> Add Amenity</button>
      </div>

      <div className="grid-2" style={{ gap: 20 }}>
        {AMENITIES.map(am => (
          <div key={am.id} className="card" style={{ padding: 24, opacity: am.available ? 1 : 0.7 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ fontSize: 36 }}>{ICONS[am.type] || '🏢'}</div>
                <div>
                  <h3 style={{ fontSize: 16, margin: 0, marginBottom: 4 }}>{am.name}</h3>
                  <span className="badge badge-gray">{am.type}</span>
                </div>
              </div>
              <span className={`badge ${am.available ? 'badge-green' : 'badge-red'}`}>
                {am.available ? 'Available' : 'Unavailable'}
              </span>
            </div>

            {!am.available && am.unavailableReason && (
              <div style={{ padding: '8px 12px', background: '#fef2f2', borderRadius: 8, fontSize: 13, color: '#7f1d1d', marginBottom: 14 }}>
                ⚠️ {am.unavailableReason}
              </div>
            )}

            <div className="grid-2" style={{ gap: 12, marginBottom: 16 }}>
              {[
                ['Max Capacity', `${am.capacity} guests`],
                ['Max Hours', `${am.maxBookingHours} hrs/booking`],
                ['Advance Booking', `${am.advanceBookingDays} days`],
                ['Hours', am.hours],
              ].map(([label, val]) => (
                <div key={label} style={{ padding: '10px 14px', background: 'var(--bg-secondary)', borderRadius: 8 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>{label}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{val}</div>
                </div>
              ))}
            </div>

            {am.requiresDeposit && (
              <div style={{ padding: '8px 14px', background: 'var(--accent-light)', borderRadius: 8, fontSize: 13, color: 'var(--accent-primary)', fontWeight: 600, marginBottom: 14 }}>
                💳 ${am.depositAmount} refundable deposit required
              </div>
            )}

            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-secondary btn-sm" onClick={() => addToast('Calendar opened', 'info')}>View Calendar</button>
              <button className="btn btn-secondary btn-sm" onClick={() => addToast('Settings opened', 'info')}>Edit Rules</button>
              <button className="btn btn-secondary btn-sm" onClick={() => addToast(`${am.name} ${am.available ? 'blocked' : 'enabled'}`, am.available ? 'warning' : 'success')}>
                {am.available ? 'Block Dates' : 'Enable'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


// ─────────────────────────────────────────────────────
// VENDORS
// ─────────────────────────────────────────────────────
export function Vendors() {
  const { addToast } = useToast()
  const { VENDORS } = { VENDORS: [
    { id:'v1', name:"GreenScape Austin", category:"Landscaping", contact:"Tom Green", phone:"(512) 555-0301", email:"info@greenscape.com", rating:4.8, contractEnd:"2026-12-31", insured:true, licensed:true },
    { id:'v2', name:"Mike's Plumbing", category:"Plumbing", contact:"Mike Johnson", phone:"(512) 555-0302", email:"mike@mikesplumbing.com", rating:4.6, contractEnd:null, insured:true, licensed:true },
    { id:'v3', name:"TechElectric Pro", category:"Electrical", contact:"Sarah Tech", phone:"(512) 555-0303", email:"service@techelectric.com", rating:4.9, contractEnd:"2026-06-30", insured:true, licensed:true },
    { id:'v4', name:"CleanVent Services", category:"HVAC", contact:"Dan Clean", phone:"(512) 555-0304", email:"dan@cleanvent.com", rating:4.5, contractEnd:null, insured:true, licensed:false },
    { id:'v5', name:"SafetyFirst Inc", category:"Fire Safety", contact:"Lisa Safe", phone:"(512) 555-0305", email:"lisa@safetyfirst.com", rating:5.0, contractEnd:"2026-12-31", insured:true, licensed:true },
  ]}
  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:28, flexWrap:'wrap', gap:16 }}>
        <div>
          <h2 style={{ marginBottom:4 }}>Vendor Management</h2>
          <p>Approved vendors with licensing and insurance tracking</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => addToast('New vendor form opened', 'info')}><Plus size={14} /> Add Vendor</button>
      </div>
      <div className="table-wrapper">
        <table>
          <thead><tr><th>Vendor</th><th>Category</th><th>Contact</th><th>Rating</th><th>Licensed</th><th>Insured</th><th>Contract End</th><th>Actions</th></tr></thead>
          <tbody>
            {VENDORS.map(v => (
              <tr key={v.id}>
                <td>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <div className="avatar avatar-sm" style={{ background:'var(--bg-tertiary)', color:'var(--accent-primary)', fontSize:13 }}>{v.name[0]}</div>
                    <div style={{ fontWeight:600, fontSize:14 }}>{v.name}</div>
                  </div>
                </td>
                <td><span className="badge badge-gray">{v.category}</span></td>
                <td><div style={{ fontSize:13 }}><div style={{ fontWeight:500 }}>{v.contact}</div><div style={{ color:'var(--text-muted)' }}>{v.phone}</div></div></td>
                <td><div style={{ display:'flex', alignItems:'center', gap:4 }}><Star size={13} color="#f59e0b" fill="#f59e0b" /><span style={{ fontWeight:700, fontSize:13 }}>{v.rating}</span></div></td>
                <td>{v.licensed ? <CheckCircle size={16} color="var(--success)" /> : <XCircle size={16} color="var(--danger)" />}</td>
                <td>{v.insured ? <CheckCircle size={16} color="var(--success)" /> : <XCircle size={16} color="var(--danger)" />}</td>
                <td style={{ fontSize:13, color:v.contractEnd?'var(--text-primary)':'var(--text-muted)' }}>
                  {v.contractEnd || 'No contract'}
                  {v.contractEnd && new Date(v.contractEnd) < new Date(Date.now() + 60*24*3600*1000) && <div style={{ fontSize:11, color:'var(--warning)', fontWeight:600 }}>Expiring soon</div>}
                </td>
                <td>
                  <button className="btn btn-ghost btn-sm btn-icon" onClick={() => addToast(`Email sent to ${v.name}`, 'success')}><Mail size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────
// SETTINGS
// ─────────────────────────────────────────────────────
export function Settings() {
  const { addToast } = useToast()
  const [tab, setTab] = useState('community')
  const [settings, setSettings] = useState({
    communityName: 'Oakwood Heights HOA',
    address: '1200 Oakwood Drive, Austin, TX 78701',
    monthlyDues: 285, dueDay: 1, gracePeriod: 10, lateFee: 35,
    processingFeePassthrough: false, autopayEnabled: true,
    smsEnabled: true, emailEnabled: true, phoneCallEnabled: false,
    twoFaRequired: true, sessionTimeout: 30,
  })
  const update = (k,v) => setSettings(s => ({ ...s, [k]:v }))
  const TABS = [{ id:'community', label:'Community' },{ id:'payments', label:'Payments' },{ id:'notifications', label:'Notifications' },{ id:'security', label:'Security' },{ id:'billing', label:'Subscription' }]

  return (
    <div>
      <div style={{ marginBottom:28 }}>
        <h2 style={{ marginBottom:4 }}>Settings</h2>
        <p>Configure your community's CanHoa settings</p>
      </div>
      <div className="tabs">
        {TABS.map(t => <div key={t.id} className={`tab ${tab===t.id?'active':''}`} onClick={() => setTab(t.id)}>{t.label}</div>)}
      </div>

      {tab === 'community' && (
        <div className="card" style={{ maxWidth:640 }}>
          <div className="card-header"><div className="card-title">Community Information</div></div>
          <div className="form-group"><label className="form-label">Community Name</label><input className="form-input" value={settings.communityName} onChange={e => update('communityName', e.target.value)} /></div>
          <div className="form-group"><label className="form-label">Address</label><input className="form-input" value={settings.address} onChange={e => update('address', e.target.value)} /></div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            <div className="form-group"><label className="form-label">HOA Type</label><select className="form-select"><option>HOA</option><option>COA (Condo)</option><option>POA</option></select></div>
            <div className="form-group"><label className="form-label">State</label><select className="form-select"><option>Texas</option><option>California</option><option>Florida</option></select></div>
          </div>
          <div className="form-group"><label className="form-label">EIN / Tax ID</label><input className="form-input" defaultValue="83-1234567" /></div>
          <button className="btn btn-primary" onClick={() => addToast('Community settings saved!', 'success')}>Save Changes</button>
        </div>
      )}

      {tab === 'payments' && (
        <div className="card" style={{ maxWidth:640 }}>
          <div className="card-header"><div className="card-title">Payment Configuration</div></div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:16 }}>
            <div className="form-group"><label className="form-label">Monthly Dues ($)</label><input type="number" className="form-input" value={settings.monthlyDues} onChange={e => update('monthlyDues', e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Due Day</label><input type="number" className="form-input" min="1" max="28" value={settings.dueDay} onChange={e => update('dueDay', e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Grace Period (days)</label><input type="number" className="form-input" value={settings.gracePeriod} onChange={e => update('gracePeriod', e.target.value)} /></div>
          </div>
          <div className="form-group"><label className="form-label">Late Fee ($)</label><input type="number" className="form-input" style={{ maxWidth:160 }} value={settings.lateFee} onChange={e => update('lateFee', e.target.value)} /></div>
          <div style={{ display:'flex', flexDirection:'column', gap:12, marginTop:8 }}>
            {[['processingFeePassthrough','Pass processing fees to residents (ACH: $2.45, Card: 3.5%+$0.50)'],['autopayEnabled','Allow residents to set up autopay']].map(([key,label]) => (
              <div key={key} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 16px', background:'var(--bg-secondary)', borderRadius:10 }}>
                <span style={{ fontSize:14, fontWeight:500 }}>{label}</span>
                <button className={`toggle ${settings[key]?'on':''}`} onClick={() => update(key, !settings[key])} />
              </div>
            ))}
          </div>
          <div style={{ marginTop:20, padding:'14px 18px', background:'var(--bg-secondary)', borderRadius:10, border:'1px solid var(--border-color)' }}>
            <div style={{ fontWeight:700, fontSize:14, marginBottom:4 }}>Stripe Connection</div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div style={{ fontSize:13, color:'var(--text-muted)' }}>Connected · Funds routed directly to HOA bank account</div>
              <span className="badge badge-green">✓ Active</span>
            </div>
          </div>
          <button className="btn btn-primary" style={{ marginTop:20 }} onClick={() => addToast('Payment settings saved!', 'success')}>Save Changes</button>
        </div>
      )}

      {tab === 'notifications' && (
        <div className="card" style={{ maxWidth:640 }}>
          <div className="card-header"><div className="card-title">Notification Channels</div></div>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {[['emailEnabled','Email Notifications','Via SendGrid — 118 residents enrolled'],['smsEnabled','SMS Text Messages','Via Twilio — 94 residents opted in · Unlimited included'],['phoneCallEnabled','Automated Phone Calls','Via Twilio — Emergency use only']].map(([key,label,sub]) => (
              <div key={key} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 20px', background:'var(--bg-secondary)', borderRadius:12 }}>
                <div>
                  <div style={{ fontWeight:700, fontSize:14, marginBottom:2 }}>{label}</div>
                  <div style={{ fontSize:12, color:'var(--text-muted)' }}>{sub}</div>
                </div>
                <button className={`toggle ${settings[key]?'on':''}`} onClick={() => update(key, !settings[key])} />
              </div>
            ))}
          </div>
          <button className="btn btn-primary" style={{ marginTop:20 }} onClick={() => addToast('Notification settings saved!', 'success')}>Save Changes</button>
        </div>
      )}

      {tab === 'security' && (
        <div className="card" style={{ maxWidth:640 }}>
          <div className="card-header"><div className="card-title">Security Settings</div></div>
          <div style={{ display:'flex', flexDirection:'column', gap:12, marginBottom:20 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 20px', background:'var(--bg-secondary)', borderRadius:12 }}>
              <div>
                <div style={{ fontWeight:700, fontSize:14, marginBottom:2 }}>Require 2FA for all admin accounts</div>
                <div style={{ fontSize:12, color:'var(--text-muted)' }}>TOTP or SMS — strongly recommended</div>
              </div>
              <button className={`toggle ${settings.twoFaRequired?'on':''}`} onClick={() => update('twoFaRequired', !settings.twoFaRequired)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Auto-logout after (minutes)</label>
            <input type="number" className="form-input" style={{ maxWidth:160 }} value={settings.sessionTimeout} onChange={e => update('sessionTimeout', e.target.value)} min="5" max="120" />
          </div>
          <div style={{ padding:'14px 18px', background:'#f0f5ff', border:'1px solid #c5d4f2', borderRadius:10, marginBottom:20 }}>
            <div style={{ fontWeight:700, fontSize:14, marginBottom:8 }}>Security Status</div>
            {['256-bit AES encryption at rest','TLS 1.3 in transit','AWS multi-zone backup every 4 hours','PCI DSS Level 1 via Stripe','Cloudflare DDoS protection'].map(item => (
              <div key={item} style={{ display:'flex', alignItems:'center', gap:8, fontSize:13, marginBottom:5 }}>
                <CheckCircle size={14} color="var(--success)" /> {item}
              </div>
            ))}
          </div>
          <button className="btn btn-primary" onClick={() => addToast('Security settings saved!', 'success')}>Save Changes</button>
        </div>
      )}

      {tab === 'billing' && (
        <div className="card" style={{ maxWidth:640 }}>
          <div className="card-header"><div className="card-title">Subscription & Billing</div></div>
          <div style={{ padding:'20px', background:'var(--accent-subtle)', border:'2px solid var(--accent-primary)', borderRadius:12, marginBottom:24 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:12 }}>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:'var(--accent-primary)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:4 }}>Current Plan</div>
                <div style={{ fontFamily:'var(--font-display)', fontSize:26, fontWeight:900, color:'var(--text-primary)', marginBottom:4 }}>Growth Plan</div>
                <div style={{ fontSize:14, color:'var(--text-muted)' }}>$199/month · Up to 200 units · Renews May 1, 2026</div>
              </div>
              <button className="btn btn-primary" onClick={() => addToast('Plan upgrade options shown', 'info')}>Upgrade to Enterprise</button>
            </div>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:24 }}>
            {[['Units Used','124 of 200'],['Storage','Unlimited'],['Messaging','Unlimited email + SMS'],['Support','Phone + chat + 1-on-1 screenshare']].map(([k,v]) => (
              <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'12px 16px', background:'var(--bg-secondary)', borderRadius:8 }}>
                <span style={{ fontSize:14, color:'var(--text-muted)' }}>{k}</span>
                <span style={{ fontSize:14, fontWeight:600 }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <button className="btn btn-secondary" onClick={() => addToast('Billing portal opened', 'info')}>Manage Billing</button>
            <button className="btn btn-secondary" onClick={() => addToast('Invoices downloaded', 'success')}>Download Invoices</button>
          </div>
        </div>
      )}
    </div>
  )
}
