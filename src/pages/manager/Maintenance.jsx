import React, { useState } from 'react'
import { useToast } from '../../context/AppContext.jsx'
import {
  Search, Plus, Clock, CheckCircle, AlertTriangle, Wrench,
  Download, Star, Calendar, DollarSign, Users, RefreshCw,
  BarChart3, ArrowRight, X, Filter, Edit
} from 'lucide-react'
import { MAINTENANCE_REQUESTS, VENDORS, COMMUNITY } from '../../data/mockData.js'

const SLA_CONFIG = { Emergency:4, High:24, Normal:72, Low:168 }

export default function Maintenance() {
  const { addToast } = useToast()
  const [view, setView] = useState('list')
  const [tab, setTab] = useState('requests')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [priorityFilter, setPriorityFilter] = useState('All')
  const [requests, setRequests] = useState(MAINTENANCE_REQUESTS)
  const [showModal, setShowModal] = useState(false)
  const [showRecurringModal, setShowRecurringModal] = useState(false)
  const [form, setForm] = useState({ unit:'', resident:'', category:'Plumbing', title:'', description:'', priority:'Normal', vendor:'', estimatedCost:'' })

  const STATUS_COLS = ['New', 'Assigned', 'In Progress', 'Scheduled', 'Resolved']
  const STATUS_COLOR = { New:'badge-red', Assigned:'badge-blue', 'In Progress':'badge-yellow', Scheduled:'badge-blue', Resolved:'badge-green', 'Pending Approval':'badge-yellow' }
  const PRIORITY_COLOR = { Emergency:'badge-red', High:'badge-yellow', Normal:'badge-gray', Low:'badge-green' }

  const getSLAStatus = (req) => {
    if (req.status === 'Resolved') return null
    const slaHrs = SLA_CONFIG[req.priority] || 72
    const createdAt = new Date(req.created)
    const hoursElapsed = (Date.now() - createdAt.getTime()) / 3600000
    const pct = Math.min((hoursElapsed / slaHrs) * 100, 100)
    const breached = hoursElapsed > slaHrs
    return { pct, breached, hoursLeft: Math.max(slaHrs - hoursElapsed, 0), slaHrs }
  }

  const filtered = requests.filter(r => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) || r.unit.toLowerCase().includes(search.toLowerCase()) || r.category.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'All' || r.status === statusFilter
    const matchPriority = priorityFilter === 'All' || r.priority === priorityFilter
    return matchSearch && matchStatus && matchPriority
  })

  const updateStatus = (id, status) => {
    setRequests(rs => rs.map(r => r.id === id ? { ...r, status } : r))
    addToast('Work order updated to: '+(status), 'success')
  }

  const assignVendor = (id, vendor) => {
    setRequests(rs => rs.map(r => r.id === id ? { ...r, assignedTo: vendor, status: 'Assigned' } : r))
    addToast('Assigned to '+(vendor)+' — notification sent', 'success')
  }

  const RECURRING_SCHEDULES = [
    { name:'HVAC Filter Replacement', frequency:'Monthly', nextDue:'2026-05-01', vendor:'CleanVent Services', cost:180 },
    { name:'Fire Extinguisher Inspection', frequency:'Annual', nextDue:'2027-04-01', vendor:'SafetyFirst Inc', cost:320 },
    { name:'Elevator Maintenance', frequency:'Quarterly', nextDue:'2026-07-01', vendor:'OtisOne Elevators', cost:450 },
    { name:'Pool Chemical Check', frequency:'Weekly', nextDue:'2026-04-20', vendor:'AquaCare Pool Services', cost:95 },
    { name:'Pest Control', frequency:'Quarterly', nextDue:'2026-06-15', vendor:'BugFree Pro', cost:280 },
  ]

  return (
    <div>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:28, flexWrap:'wrap', gap:16 }}>
        <div>
          <h2 style={{ marginBottom:4 }}>Maintenance & Work Orders</h2>
          <p>{requests.filter(r=>r.status!=='Resolved').length} open · {requests.filter(r=>r.priority==='Emergency'&&r.status!=='Resolved').length} emergency · {requests.filter(r=>r.status==='Resolved').length} resolved</p>
        </div>
        <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
          <div style={{ display:'flex', border:'1px solid var(--border-color)', borderRadius:10, overflow:'hidden' }}>
            {[['list','☰ List'],['kanban','⬜ Kanban']].map(([v,label])=>(
              <button key={v} onClick={()=>setView(v)} className="btn btn-sm" style={{ borderRadius:0, background:view===v?'var(--accent-primary)':'transparent', color:view===v?'white':'var(--text-muted)', border:'none' }}>{label}</button>
            ))}
          </div>
          <button className="btn btn-secondary btn-sm" onClick={()=>setShowRecurringModal(true)}><RefreshCw size={14}/> Recurring</button>
          <button className="btn btn-primary btn-sm" onClick={()=>setShowModal(true)}><Plus size={14}/> New Work Order</button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid-4" style={{ marginBottom:20 }}>
        {[
          { label:'Total Open', value:requests.filter(r=>r.status!=='Resolved').length, color:'var(--text-primary)', sub:'Active work orders' },
          { label:'Emergency', value:requests.filter(r=>r.priority==='Emergency'&&r.status!=='Resolved').length, color:'#ef4444', sub:'4-hr SLA target' },
          { label:'Resolved 30d', value:requests.filter(r=>r.status==='Resolved').length, color:'#2b52a0', sub:'Avg '+Math.round(requests.filter(r=>r.status==='Resolved').length)+'d resolution' },
          { label:'Total Cost', value:'$' + (requests.reduce((s,r)=>s+r.cost,0).toLocaleString()), color:'#7c3aed', sub:'Open + resolved' },
        ].map(s=>(
          <div key={s.label} className="stat-card">
            <div style={{ fontSize:24, fontFamily:'var(--font-display)', fontWeight:900, color:s.color, marginBottom:3 }}>{s.value}</div>
            <div style={{ fontSize:13, fontWeight:700, color:'var(--text-primary)', marginBottom:2 }}>{s.label}</div>
            <div style={{ fontSize:12, color:'var(--text-muted)' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* SLA Breach Alerts */}
      {requests.filter(r=>r.status!=='Resolved').some(r=>getSLAStatus(r)?.breached) && (
        <div style={{ padding:'12px 18px', background:'#fef2f2', border:'1px solid #fecaca', borderLeft:'4px solid var(--danger)', borderRadius:12, marginBottom:20 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <AlertTriangle size={16} color="var(--danger)"/>
            <strong style={{ fontSize:14, color:'#991b1b' }}>SLA Breach Alert: </strong>
            <span style={{ fontSize:13, color:'#991b1b' }}>
              {requests.filter(r=>r.status!=='Resolved'&&getSLAStatus(r)?.breached).map(r=>''+(r.id)+' (${r.priority})').join(', ')} — immediate action required
            </span>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="tabs">
        {[['requests','Work Orders'],['analytics','Analytics'],['recurring','Recurring']].map(([id,label])=>(
          <div key={id} className={'tab ' + (tab===id?'active':'')} onClick={()=>setTab(id)}>{label}</div>
        ))}
      </div>

      {tab==='requests' && (
        <>
          {/* Filters */}
          <div style={{ display:'flex', gap:12, marginBottom:16, flexWrap:'wrap' }}>
            <div className="search-box" style={{ flex:1, minWidth:200, position:'relative' }}>
              <Search size={16} style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)', pointerEvents:'none' }}/>
              <input className="form-input" placeholder="Search work orders..." value={search} onChange={e=>setSearch(e.target.value)} style={{ paddingLeft:40 }}/>
            </div>
            <select className="form-select" style={{ width:150 }} value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}>
              <option value="All">All Statuses</option>
              {STATUS_COLS.map(s=><option key={s}>{s}</option>)}
            </select>
            <select className="form-select" style={{ width:130 }} value={priorityFilter} onChange={e=>setPriorityFilter(e.target.value)}>
              <option value="All">All Priorities</option>
              {['Emergency','High','Normal','Low'].map(p=><option key={p}>{p}</option>)}
            </select>
          </div>

          {/* LIST VIEW */}
          {view==='list' && (
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              {filtered.map(req=>{
                const sla = getSLAStatus(req)
                return (
                  <div key={req.id} className="card" style={{ padding:20, borderLeft:req.priority==='Emergency'?'4px solid var(--danger)':req.priority==='High'?'4px solid var(--warning)':'1px solid var(--border-color)' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:12, marginBottom:12 }}>
                      <div>
                        <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap', marginBottom:6 }}>
                          <span style={{ fontSize:11, color:'var(--text-muted)', fontFamily:'monospace' }}>{req.id}</span>
                          <h3 style={{ fontSize:16, margin:0 }}>{req.title}</h3>
                          <span className={'badge ' + (PRIORITY_COLOR[req.priority]||'badge-gray')}>{req.priority}</span>
                          <span className={'badge ' + (STATUS_COLOR[req.status]||'badge-gray')}>{req.status}</span>
                        </div>
                        <div style={{ fontSize:13, color:'var(--text-muted)' }}>Unit {req.unit} · {req.category} · {req.created} · {req.photos>0?''+(req.photos)+' photos':''}</div>
                      </div>
                    </div>
                    <p style={{ fontSize:14, marginBottom:12 }}>{req.description}</p>

                    {/* SLA Tracker */}
                    {sla && (
                      <div style={{ marginBottom:12, padding:'8px 12px', background:sla.breached?'#fef2f2':'var(--bg-secondary)', borderRadius:8, border:sla.breached?'1px solid #fecaca':'1px solid var(--border-color)' }}>
                        <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, marginBottom:5 }}>
                          <span style={{ fontWeight:700, color:sla.breached?'var(--danger)':'var(--text-muted)' }}>
                            SLA: {SLA_CONFIG[req.priority]}hr target {sla.breached?'— ⚠️ BREACHED':''}
                          </span>
                          <span style={{ color:sla.breached?'var(--danger)':'var(--text-muted)' }}>
                            {sla.breached?'Overdue':'~'+Math.round(sla.hoursLeft)+'h remaining'}
                          </span>
                        </div>
                        <div className="progress-bar" style={{ height:6 }}>
                          <div className="progress-fill" style={{ width:(sla.pct)+"%", background:sla.pct>100?'var(--danger)':sla.pct>75?'var(--warning)':'var(--success)' }}/>
                        </div>
                      </div>
                    )}

                    {/* Vendor + Cost */}
                    <div style={{ display:'flex', gap:12, marginBottom:12, flexWrap:'wrap' }}>
                      {req.assignedTo && <span style={{ fontSize:13, color:'var(--accent-primary)', fontWeight:600 }}>🔧 {req.assignedTo}</span>}
                      {req.cost>0 && <span style={{ fontSize:13, color:'var(--text-muted)' }}>Cost: <strong>${req.cost}</strong></span>}
                    </div>

                    {/* Internal Notes */}
                    {req.internalNotes?.length>0 && (
                      <div style={{ marginBottom:12, padding:'8px 12px', background:'#fffbeb', borderRadius:8, fontSize:13 }}>
                        <strong style={{ fontSize:11, textTransform:'uppercase', color:'var(--text-muted)' }}>Internal Notes:</strong>
                        {req.internalNotes.map((n,i)=><div key={i} style={{ color:'var(--text-primary)', marginTop:2 }}>{n}</div>)}
                      </div>
                    )}

                    {/* Actions */}
                    <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                      {req.status==='New' && (
                        <div style={{ display:'flex', gap:6 }}>
                          <select className="form-select" style={{ fontSize:12, height:34, padding:'0 10px' }} onChange={e=>e.target.value&&assignVendor(req.id, e.target.value)} defaultValue="">
                            <option value="">Assign vendor...</option>
                            {VENDORS.map(v=><option key={v.id} value={v.name}>{v.name}</option>)}
                          </select>
                        </div>
                      )}
                      {req.status==='New' && <button className="btn btn-secondary btn-sm" onClick={()=>updateStatus(req.id,'In Progress')}>Start Work</button>}
                      {req.status==='In Progress' && <button className="btn btn-secondary btn-sm" onClick={()=>updateStatus(req.id,'Scheduled')}>Schedule</button>}
                      {['Assigned','In Progress','Scheduled'].includes(req.status) && <button className="btn btn-primary btn-sm" onClick={()=>{ updateStatus(req.id,'Resolved'); addToast('Work order resolved! Resident will be asked to rate the repair.','success') }}>Mark Resolved</button>}
                      {req.status==='Resolved' && req.satisfactionRating && <span style={{ fontSize:13, color:'var(--accent-primary)' }}>{'⭐'.repeat(req.satisfactionRating)} Resident rating: {req.satisfactionRating}/5</span>}
                      <button className="btn btn-ghost btn-sm" onClick={()=>addToast('Internal note added','success')}>Add Note</button>
                      <button className="btn btn-ghost btn-sm" onClick={()=>addToast('Photo uploaded','success')}>📷 Photos ({req.photos})</button>
                    </div>
                  </div>
                )
              })}
              {filtered.length===0 && (
                <div className="card" style={{ textAlign:'center', padding:'48px' }}>
                  <Wrench size={48} style={{ color:'var(--text-muted)', opacity:0.3, marginBottom:16 }}/>
                  <h3>No work orders found</h3>
                  <p>Adjust your filters or create a new work order.</p>
                </div>
              )}
            </div>
          )}

          {/* KANBAN VIEW */}
          {view==='kanban' && (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:14, overflowX:'auto' }}>
              {STATUS_COLS.map(status=>(
                <div key={status}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'8px 10px', background:'var(--bg-secondary)', borderRadius:10, marginBottom:10 }}>
                    <span style={{ fontWeight:700, fontSize:13 }}>{status}</span>
                    <span style={{ background:'var(--bg-card)', border:'1px solid var(--border-color)', borderRadius:'50%', width:22, height:22, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700 }}>
                      {requests.filter(r=>r.status===status).length}
                    </span>
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', gap:10, minHeight:100 }}>
                    {requests.filter(r=>r.status===status).map(req=>(
                      <div key={req.id} style={{ padding:'12px 14px', background:'var(--bg-card)', border:'1px solid var(--border-color)', borderTop:'3px solid '+(req.priority==='Emergency'?'#ef4444':req.priority==='High'?'#f59e0b':'var(--accent-primary)'), borderRadius:10, cursor:'pointer', transition:'var(--transition)', boxShadow:'var(--shadow-sm)' }}
                        onMouseEnter={e=>e.currentTarget.style.boxShadow='var(--shadow-md)'}
                        onMouseLeave={e=>e.currentTarget.style.boxShadow='var(--shadow-sm)'}>
                        <div style={{ fontSize:11, color:'var(--text-muted)', fontFamily:'monospace', marginBottom:4 }}>{req.id}</div>
                        <div style={{ fontWeight:700, fontSize:13, marginBottom:6 }}>{req.title}</div>
                        <div style={{ fontSize:11, color:'var(--text-muted)', marginBottom:6 }}>Unit {req.unit} · {req.category}</div>
                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                          <span className={'badge ' + (PRIORITY_COLOR[req.priority]||'badge-gray')} style={{ fontSize:10 }}>{req.priority}</span>
                          {req.cost>0 && <span style={{ fontSize:11, fontWeight:700 }}>${req.cost}</span>}
                        </div>
                        {req.assignedTo && <div style={{ fontSize:10, color:'var(--accent-primary)', marginTop:6, fontWeight:600 }}>→ {req.assignedTo}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ANALYTICS TAB */}
      {tab==='analytics' && (
        <div className="grid-2">
          <div className="card" style={{ padding:24 }}>
            <div className="card-title" style={{ marginBottom:16 }}>Work Orders by Category</div>
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {['Plumbing','Electrical','HVAC','Landscaping','Appliance','Safety'].map(cat=>{
                const count = requests.filter(r=>r.category===cat).length
                const total = requests.length
                return (
                  <div key={cat}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4, fontSize:13 }}>
                      <span style={{ fontWeight:600 }}>{cat}</span>
                      <span style={{ color:'var(--text-muted)' }}>{count} requests</span>
                    </div>
                    <div className="progress-bar" style={{ height:7 }}>
                      <div className="progress-fill" style={{ width:(total>0?(count/total)*100:0)+"%" }}/>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="card" style={{ padding:24 }}>
            <div className="card-title" style={{ marginBottom:16 }}>Key Metrics</div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {[
                { label:'Total Work Orders', value:requests.length },
                { label:'Emergency Response Rate', value:'100% ≤4hr' },
                { label:'Avg Resolution Time', value:'2.3 days' },
                { label:'Total Maintenance Cost', value:'$' + (requests.reduce((s,r)=>s+r.cost,0).toLocaleString()) },
                { label:'Resident Satisfaction', value:(requests.filter(r=>r.satisfactionRating>=4).length) + '/' + (requests.filter(r=>r.satisfactionRating).length) + ' rated ≥4★' },
                { label:'SLA Compliance Rate', value:'92%' },
                { label:'Cost per Work Order', value:'$' + (Math.round(requests.reduce((s,r)=>s+r.cost,0)/(requests.filter(r=>r.cost>0).length||1))) },
              ].map(m=>(
                <div key={m.label} style={{ display:'flex', justifyContent:'space-between', padding:'8px 12px', background:'var(--bg-secondary)', borderRadius:8 }}>
                  <span style={{ fontSize:13, color:'var(--text-muted)' }}>{m.label}</span>
                  <span style={{ fontSize:13, fontWeight:700 }}>{m.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* RECURRING TAB */}
      {tab==='recurring' && (
        <div>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:20 }}>
            <p>Automated recurring maintenance schedules — tickets created automatically on due date</p>
            <button className="btn btn-primary btn-sm" onClick={()=>setShowRecurringModal(true)}><Plus size={14}/> Add Schedule</button>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {RECURRING_SCHEDULES.map((s,i)=>(
              <div key={i} className="card" style={{ padding:20, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
                <div>
                  <div style={{ fontWeight:700, fontSize:15, marginBottom:4 }}>{s.name}</div>
                  <div style={{ fontSize:13, color:'var(--text-muted)' }}>{s.frequency} · Vendor: {s.vendor} · Est. cost: ${s.cost}</div>
                  <div style={{ fontSize:13, marginTop:4, fontWeight:600, color:new Date(s.nextDue)<new Date(Date.now()+14*86400000)?'var(--warning)':'var(--accent-primary)' }}>
                    Next due: {s.nextDue} {new Date(s.nextDue)<new Date(Date.now()+14*86400000)?'⚠️ Soon':''}
                  </div>
                </div>
                <div style={{ display:'flex', gap:8 }}>
                  <span className="badge badge-green">Active</span>
                  <button className="btn btn-ghost btn-sm" onClick={()=>addToast('Schedule updated','success')}><Edit size={14}/></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NEW WORK ORDER MODAL */}
      {showModal && (
        <div className="modal-backdrop" onClick={()=>setShowModal(false)}>
          <div className="modal modal-lg" onClick={e=>e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create Work Order</h3>
              <button className="btn btn-ghost btn-icon" onClick={()=>setShowModal(false)}><X size={16}/></button>
            </div>
            <div className="modal-body">
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div className="form-group"><label className="form-label">Unit *</label><input className="form-input" placeholder="e.g. 4B or Common Area" value={form.unit} onChange={e=>setForm(f=>({...f,unit:e.target.value}))}/></div>
                <div className="form-group"><label className="form-label">Resident/Reporter</label><input className="form-input" placeholder="Name or 'Building Mgmt'" value={form.resident} onChange={e=>setForm(f=>({...f,resident:e.target.value}))}/></div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div className="form-group"><label className="form-label">Category *</label>
                  <select className="form-select" value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}>
                    {['Plumbing','Electrical','HVAC','Appliance','Structural','Landscaping','Pest Control','Safety','Common Area','Other'].map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group"><label className="form-label">Priority</label>
                  <select className="form-select" value={form.priority} onChange={e=>setForm(f=>({...f,priority:e.target.value}))}>
                    {['Emergency','High','Normal','Low'].map(p=><option key={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group"><label className="form-label">Title *</label><input className="form-input" placeholder="Brief description" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))}/></div>
              <div className="form-group"><label className="form-label">Description</label><textarea className="form-textarea" placeholder="Detailed description of the issue..." value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))}/></div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div className="form-group"><label className="form-label">Assign Vendor</label>
                  <select className="form-select" value={form.vendor} onChange={e=>setForm(f=>({...f,vendor:e.target.value}))}>
                    <option value="">Assign later...</option>
                    {VENDORS.map(v=><option key={v.id} value={v.name}>{v.name} ({v.category})</option>)}
                  </select>
                </div>
                <div className="form-group"><label className="form-label">Estimated Cost ($)</label><input type="number" className="form-input" placeholder="0" value={form.estimatedCost} onChange={e=>setForm(f=>({...f,estimatedCost:e.target.value}))}/></div>
              </div>
              {form.priority==='Emergency' && (
                <div style={{ padding:'12px 16px', background:'#fef2f2', border:'1px solid #fecaca', borderRadius:10, fontSize:13 }}>
                  🚨 Emergency priority triggers automatic SMS blast to all residents and board members.
                </div>
              )}
              <div style={{ padding:'10px 14px', background:'var(--bg-secondary)', borderRadius:8, fontSize:12 }}>
                SLA targets: Emergency 4hr · High 24hr · Normal 72hr · Low 7 days. Resident receives SMS/email updates on every status change.
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={()=>setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={()=>{
                const newReq = { id:'maint-'+Date.now(), unit:form.unit||'N/A', resident:form.resident||'Management', category:form.category, title:form.title||'Untitled', description:form.description, priority:form.priority, status:form.vendor?'Assigned':'New', created:new Date().toISOString().slice(0,10), assignedTo:form.vendor||null, cost:+form.estimatedCost||0, photos:0, slaHours:SLA_CONFIG[form.priority]||72, satisfactionRating:null, internalNotes:[], resolutionDate:null }
                setRequests(rs=>[newReq,...rs])
                setShowModal(false)
                addToast('Work order #'+(newReq.id)+' created. Resident notified via SMS/email.','success')
                setForm({ unit:'',resident:'',category:'Plumbing',title:'',description:'',priority:'Normal',vendor:'',estimatedCost:'' })
              }}>
                <Plus size={15}/> Create Work Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RECURRING MODAL */}
      {showRecurringModal && (
        <div className="modal-backdrop" onClick={()=>setShowRecurringModal(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-header"><h3>Add Recurring Schedule</h3><button className="btn btn-ghost btn-icon" onClick={()=>setShowRecurringModal(false)}><X size={16}/></button></div>
            <div className="modal-body">
              <div className="form-group"><label className="form-label">Task Name *</label><input className="form-input" placeholder="e.g. Monthly HVAC Filter Replacement"/></div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div className="form-group"><label className="form-label">Frequency</label>
                  <select className="form-select"><option>Weekly</option><option>Monthly</option><option>Quarterly</option><option>Semi-Annual</option><option>Annual</option></select>
                </div>
                <div className="form-group"><label className="form-label">First Due Date</label><input type="date" className="form-input"/></div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div className="form-group"><label className="form-label">Assign Vendor</label>
                  <select className="form-select"><option value="">Unassigned</option>{VENDORS.map(v=><option key={v.id}>{v.name}</option>)}</select>
                </div>
                <div className="form-group"><label className="form-label">Estimated Cost ($)</label><input type="number" className="form-input" placeholder="0"/></div>
              </div>
              <div className="form-group"><label className="form-label">Priority</label>
                <select className="form-select"><option>Normal</option><option>High</option><option>Emergency</option><option>Low</option></select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={()=>setShowRecurringModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={()=>{ setShowRecurringModal(false); addToast('Recurring schedule created! First work order will auto-generate on due date.','success') }}>Create Schedule</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
