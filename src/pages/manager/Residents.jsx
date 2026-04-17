import React, { useState } from 'react'
import { useToast } from '../../context/AppContext.jsx'
import {
  Search, UserPlus, Download, Mail, Phone, Filter,
  CheckCircle, XCircle, AlertTriangle, ChevronDown,
  CreditCard, Wrench, FileText, Users, Car, Heart,
  Home, ArrowRight, Plus, Edit, DollarSign, Calendar,
  RefreshCw, Shield, Clock, X
} from 'lucide-react'
import { RESIDENTS, COMMUNITY, PAYMENT_HISTORY, FINANCIAL_SUMMARY } from '../../data/mockData.js'

const JOURNAL_ENTRIES = [
  { id:'je-001', date:'2026-04-01', memo:'Reserve fund monthly contribution', debit:'Reserve Fund', credit:'Operating Checking', amount:1100, createdBy:'Sandra Torres', status:'Posted' },
  { id:'je-002', date:'2026-03-31', memo:'Q1 insurance premium prepayment', debit:'Prepaid Insurance', credit:'Operating Checking', amount:2400, createdBy:'Sarah Mitchell', status:'Posted' },
  { id:'je-003', date:'2026-04-10', memo:'Lobby renovation deposit', debit:'Escrow Account', credit:'Reserve Fund', amount:15000, createdBy:'Sandra Torres', status:'Posted' },
]
const CHART_OF_ACCOUNTS = [
  { id:'acc-001', code:'1000', name:'Operating Checking', type:'Asset', balance:43200 },
  { id:'acc-002', code:'1100', name:'Reserve Fund', type:'Asset', balance:187500 },
  { id:'acc-003', code:'1200', name:'Accounts Receivable', type:'Asset', balance:4845 },
  { id:'acc-004', code:'2000', name:'Accounts Payable', type:'Liability', balance:2400 },
  { id:'acc-005', code:'3000', name:'Fund Balance', type:'Equity', balance:236345 },
  { id:'acc-006', code:'4000', name:'Assessment Income', type:'Income', balance:198450 },
  { id:'acc-007', code:'4100', name:'Late Fee Income', type:'Income', balance:3150 },
  { id:'acc-008', code:'5000', name:'Landscaping', type:'Expense', balance:16800 },
  { id:'acc-009', code:'5100', name:'Utilities', type:'Expense', balance:12720 },
  { id:'acc-010', code:'5200', name:'Insurance', type:'Expense', balance:9600 },
  { id:'acc-011', code:'5300', name:'Maintenance', type:'Expense', balance:7400 },
  { id:'acc-012', code:'5400', name:'Management Fee', type:'Expense', balance:6000 },
  { id:'acc-013', code:'5500', name:'Reserve Contribution', type:'Expense', balance:4400 },
  { id:'acc-014', code:'5600', name:'Professional Fees', type:'Expense', balance:2400 },
]

// ─────────────────────────────────────────────────────
// RESIDENTS
// ─────────────────────────────────────────────────────
export function Residents() {
  const { addToast } = useToast()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('unit')
  const [selectedId, setSelectedId] = useState(null)
  const [tab, setTab] = useState('directory')
  const [showTransferModal, setShowTransferModal] = useState(null)
  const [showImportModal, setShowImportModal] = useState(false)
  const [residents, setResidents] = useState(RESIDENTS)

  const filtered = residents
    .filter(r => {
      const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) || r.unit.toLowerCase().includes(search.toLowerCase()) || r.email.toLowerCase().includes(search.toLowerCase())
      const matchFilter = filter === 'all' || (filter === 'delinquent' && r.status === 'delinquent') || (filter === 'current' && r.status === 'current') || (filter === 'autopay' && r.autopay) || (filter === 'tenant' && !r.isOwner) || (filter === 'owner' && r.isOwner)
      return matchSearch && matchFilter
    })
    .sort((a, b) => sort === 'name' ? a.name.localeCompare(b.name) : a.unit.localeCompare(b.unit))

  const selected = residents.find(r => r.id === selectedId)

  const tabs = [
    { id:'directory', label:'Directory' },
    { id:'vehicles', label:'🚗 Vehicle Registry' },
    { id:'pets', label:'🐾 Pet Registry' },
    { id:'transfers', label:'🏠 Ownership Transfers' },
  ]

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:28, flexWrap:'wrap', gap:16 }}>
        <div>
          <h2 style={{ marginBottom:4 }}>Residents</h2>
          <p>{COMMUNITY.totalUnits} units · {residents.filter(r => r.status === 'delinquent').length} delinquent · {residents.filter(r => r.autopay).length} on autopay</p>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <button className="btn btn-secondary btn-sm" onClick={()=>setShowImportModal(true)}><Download size={14}/> Import CSV</button>
          <button className="btn btn-secondary btn-sm" onClick={()=>addToast('Resident directory exported','success')}><Download size={14}/> Export</button>
          <button className="btn btn-primary btn-sm" onClick={()=>addToast('Invite form opened','info')}><UserPlus size={14}/> Invite Resident</button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid-4" style={{ marginBottom:24 }}>
        {[
          { label:'Total Residents', value:residents.length, color:'#2b52a0', sub:(residents.filter(r=>r.isOwner).length) + ' owners, ' + (residents.filter(r=>!r.isOwner).length) + ' tenants' },
          { label:'Current', value:residents.filter(r=>r.status==='current').length, color:'#2b52a0', sub:'In good standing' },
          { label:'Delinquent', value:residents.filter(r=>r.status==='delinquent').length, color:'#ef4444', sub:'$' + (residents.filter(r=>r.status==='delinquent').reduce((s,r)=>s+r.balance,0).toLocaleString()) + ' outstanding' },
          { label:'On Autopay', value:residents.filter(r=>r.autopay).length, color:'#3b82f6', sub:(Math.round((residents.filter(r=>r.autopay).length/residents.length)*100)) + '% enrollment rate' },
        ].map(s=>(
          <div key={s.label} className="stat-card">
            <div style={{ fontSize:24, fontFamily:'var(--font-display)', fontWeight:900, color:s.color, marginBottom:3 }}>{s.value}</div>
            <div style={{ fontSize:13, fontWeight:700, color:'var(--text-primary)', marginBottom:2 }}>{s.label}</div>
            <div style={{ fontSize:11, color:'var(--text-muted)' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="tabs">
        {tabs.map(t=><div key={t.id} className={`tab ${tab===t.id?'active':''}`} onClick={()=>setTab(t.id)}>{t.label}</div>)}
      </div>

      {/* DIRECTORY */}
      {tab==='directory' && (
        <>
          <div style={{ display:'flex', gap:12, marginBottom:16, flexWrap:'wrap' }}>
            <div className="search-box" style={{ flex:1, minWidth:200, position:'relative' }}>
              <Search size={16} style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)', pointerEvents:'none' }}/>
              <input className="form-input" placeholder="Search by name, unit, or email..." value={search} onChange={e=>setSearch(e.target.value)} style={{ paddingLeft:40 }}/>
            </div>
            <select className="form-select" style={{ width:160 }} value={filter} onChange={e=>setFilter(e.target.value)}>
              <option value="all">All Residents</option>
              <option value="current">Current</option>
              <option value="delinquent">Delinquent</option>
              <option value="autopay">On Autopay</option>
              <option value="owner">Owners Only</option>
              <option value="tenant">Tenants Only</option>
            </select>
            <select className="form-select" style={{ width:130 }} value={sort} onChange={e=>setSort(e.target.value)}>
              <option value="unit">Sort by Unit</option>
              <option value="name">Sort by Name</option>
            </select>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>Unit</th><th>Resident</th><th>Contact</th><th>Type</th><th>Balance</th><th>Autopay</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.map(r=>(
                  <tr key={r.id} onClick={()=>setSelectedId(r.id===selectedId?null:r.id)} style={{ cursor:'pointer', background:selectedId===r.id?'var(--accent-subtle)':'' }}>
                    <td><strong style={{ color:'var(--accent-primary)', fontFamily:'var(--font-display)', fontSize:15 }}>{r.unit}</strong></td>
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <div className="avatar avatar-sm" style={{ background:'var(--accent-primary)', color:'white' }}>{r.avatar}</div>
                        <div>
                          <div style={{ fontWeight:600, fontSize:14 }}>{r.name}</div>
                          {!r.isOwner && <div style={{ fontSize:11, color:'var(--warning)', fontWeight:600 }}>Tenant · Owner: {r.ownerName||'Unknown'}</div>}
                          {r.parking && <div style={{ fontSize:11, color:'var(--text-muted)' }}>Parking: {r.parking}</div>}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize:13 }}>{r.email}</div>
                      <div style={{ fontSize:12, color:'var(--text-muted)' }}>{r.phone}</div>
                    </td>
                    <td><span className={`badge ${r.isOwner?'badge-green':'badge-blue'}`}>{r.isOwner?'Owner':'Tenant'}</span></td>
                    <td style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:15, color:r.balance>0?'var(--danger)':'var(--success)' }}>
                      {r.balance>0?`$${r.balance.toFixed(2)}`:'Current'}
                      {r.daysOverdue && <div style={{ fontSize:11, color:'var(--danger)', fontWeight:600 }}>{r.daysOverdue} days overdue</div>}
                    </td>
                    <td>
                      {r.autopay
                        ? <span className="badge badge-green">✓ ACH</span>
                        : <span className="badge badge-gray">Manual</span>}
                    </td>
                    <td>
                      <span className={`badge ${r.status==='current'?'badge-green':'badge-red'}`}>
                        {r.status.charAt(0).toUpperCase()+r.status.slice(1)}
                      </span>
                    </td>
                    <td onClick={e=>e.stopPropagation()}>
                      <div style={{ display:'flex', gap:5 }}>
                        <button className="btn btn-ghost btn-sm btn-icon" onClick={()=>addToast(`Email sent to ${r.name}`,'success')} title="Send email"><Mail size={14}/></button>
                        <button className="btn btn-ghost btn-sm btn-icon" onClick={()=>addToast(`Opening charge modal for ${r.name}`,'info')} title="Add charge"><DollarSign size={14}/></button>
                        <button className="btn btn-ghost btn-sm btn-icon" onClick={()=>setShowTransferModal(r)} title="Transfer ownership"><Home size={14}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Expanded resident detail */}
          {selected && (
            <div className="card" style={{ marginTop:16, padding:24 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:16, marginBottom:20 }}>
                <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                  <div className="avatar avatar-xl" style={{ background:'var(--accent-primary)', color:'white' }}>{selected.avatar}</div>
                  <div>
                    <h3 style={{ marginBottom:4 }}>{selected.name}</h3>
                    <div style={{ fontSize:14, color:'var(--text-muted)' }}>Unit {selected.unit} · {selected.isOwner?'Owner':'Tenant'} · Move-in: {selected.moveIn}</div>
                    {selected.emergencyContact && <div style={{ fontSize:13, color:'var(--text-muted)', marginTop:2 }}>Emergency: {selected.emergencyContact}</div>}
                  </div>
                </div>
                <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
                  <button className="btn btn-secondary btn-sm" onClick={()=>addToast(`Email sent to ${selected.name}`,'success')}><Mail size={13}/> Email</button>
                  <button className="btn btn-secondary btn-sm" onClick={()=>addToast(`SMS sent to ${selected.name}`,'success')}><Phone size={13}/> SMS</button>
                  <button className="btn btn-primary btn-sm" onClick={()=>addToast('Charge form opened','info')}><DollarSign size={13}/> Add Charge</button>
                </div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px,1fr))', gap:14 }}>
                {[
                  { label:'Email', value:selected.email, icon:Mail },
                  { label:'Phone', value:selected.phone, icon:Phone },
                  { label:'Balance', value:selected.balance>0?`$${selected.balance.toFixed(2)} overdue`:'Current ($0.00)', icon:DollarSign },
                  { label:'Parking Spot', value:selected.parking||'Not assigned', icon:Car },
                  { label:'Vehicles', value:selected.vehicles?.length>0?selected.vehicles.map(v=>`${v.make} ${v.model} (${v.plate})`).join(', '):'None registered', icon:Car },
                  { label:'Pets', value:selected.pets?.length>0?selected.pets.map(p=>`${p.name} (${p.breed})`).join(', '):'None registered', icon:Heart },
                ].map(item=>(
                  <div key={item.label} style={{ padding:'10px 14px', background:'var(--bg-secondary)', borderRadius:10 }}>
                    <div style={{ fontSize:11, fontWeight:700, color:'var(--text-muted)', marginBottom:4 }}>{item.label}</div>
                    <div style={{ fontSize:13, fontWeight:600 }}>{item.value}</div>
                  </div>
                ))}
              </div>
              {selected.ownerName && (
                <div style={{ marginTop:14, padding:'10px 14px', background:'#fffbeb', borderRadius:10, border:'1px solid #fde68a', fontSize:13 }}>
                  <strong>Tenant Unit</strong> — Owner of record: {selected.ownerName} ({selected.ownerEmail||'email not on file'}). Communications regarding violations and dues are sent to the owner.
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* VEHICLE REGISTRY */}
      {tab==='vehicles' && (
        <div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20, flexWrap:'wrap', gap:12 }}>
            <p>All registered vehicles per unit — used for parking enforcement and violation tracking</p>
            <button className="btn btn-primary btn-sm" onClick={()=>addToast('Vehicle registration form opened','info')}><Plus size={14}/> Register Vehicle</button>
          </div>
          <div className="table-wrapper">
            <table>
              <thead><tr><th>Unit</th><th>Resident</th><th>Make / Model</th><th>License Plate</th><th>Color</th><th>Actions</th></tr></thead>
              <tbody>
                {residents.filter(r=>r.vehicles?.length>0).flatMap(r=>
                  r.vehicles.map((v,i)=>(
                    <tr key={r.id+'-v'+i}>
                      <td><strong style={{ color:'var(--accent-primary)', fontFamily:'var(--font-display)' }}>{r.unit}</strong></td>
                      <td style={{ fontWeight:600, fontSize:14 }}>{r.name}</td>
                      <td style={{ fontSize:14 }}>{v.make} {v.model} ({new Date().getFullYear()})</td>
                      <td><span style={{ fontFamily:'monospace', fontWeight:700, fontSize:14, background:'var(--bg-secondary)', padding:'3px 10px', borderRadius:6 }}>{v.plate}</span></td>
                      <td style={{ fontSize:13, color:'var(--text-muted)' }}>{v.color}</td>
                      <td>
                        <button className="btn btn-ghost btn-sm" onClick={()=>addToast(`Violation created for plate ${v.plate}`,'info')}>Issue Violation</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {residents.filter(r=>r.vehicles?.length>0).length===0 && (
            <div className="card" style={{ textAlign:'center', padding:'40px', color:'var(--text-muted)' }}>
              <Car size={40} style={{ opacity:0.3, marginBottom:12 }}/>
              <div>No vehicles registered yet</div>
            </div>
          )}
        </div>
      )}

      {/* PET REGISTRY */}
      {tab==='pets' && (
        <div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20, flexWrap:'wrap', gap:12 }}>
            <p>Pet registry for CC&R compliance — tracks vaccination status and breed restrictions</p>
            <button className="btn btn-primary btn-sm" onClick={()=>addToast('Pet registration form opened','info')}><Plus size={14}/> Register Pet</button>
          </div>
          <div className="table-wrapper">
            <table>
              <thead><tr><th>Unit</th><th>Owner</th><th>Pet Name</th><th>Breed</th><th>Weight</th><th>Vaccinated</th><th>Actions</th></tr></thead>
              <tbody>
                {residents.filter(r=>r.pets?.length>0).flatMap(r=>
                  r.pets.map((p,i)=>(
                    <tr key={r.id+'-p'+i}>
                      <td><strong style={{ color:'var(--accent-primary)', fontFamily:'var(--font-display)' }}>{r.unit}</strong></td>
                      <td style={{ fontWeight:600, fontSize:14 }}>{r.name}</td>
                      <td style={{ fontWeight:700, fontSize:14 }}>{p.name}</td>
                      <td style={{ fontSize:13 }}>{p.breed}</td>
                      <td style={{ fontSize:13, color:'var(--text-muted)' }}>{p.weight}</td>
                      <td>
                        {p.vaccinated
                          ? <span className="badge badge-green"><CheckCircle size={11}/> Current</span>
                          : <span className="badge badge-red"><XCircle size={11}/> Expired</span>}
                      </td>
                      <td>
                        <button className="btn btn-ghost btn-sm" onClick={()=>addToast('Pet record updated','success')}>Update Records</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {residents.filter(r=>r.pets?.length>0).length===0 && (
            <div className="card" style={{ textAlign:'center', padding:'40px', color:'var(--text-muted)' }}>
              <Heart size={40} style={{ opacity:0.3, marginBottom:12 }}/>
              <div>No pets registered yet</div>
            </div>
          )}
          <div style={{ marginTop:16, padding:'12px 16px', background:'var(--bg-secondary)', borderRadius:10, fontSize:13, color:'var(--text-muted)' }}>
            Per CC&Rs Section 6.1: All pets must be registered within 30 days of move-in. Dogs must not exceed 50 lbs unless grandfathered. Vaccination records must be updated annually. Breed restrictions may apply — consult your governing documents.
          </div>
        </div>
      )}

      {/* OWNERSHIP TRANSFERS */}
      {tab==='transfers' && (
        <div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20, flexWrap:'wrap', gap:12 }}>
            <p>Manage unit sales, ownership transfers, and new resident onboarding</p>
            <button className="btn btn-primary btn-sm" onClick={()=>addToast('Ownership transfer form opened','info')}><Plus size={14}/> New Transfer</button>
          </div>

          {/* Resale Packet */}
          <div className="card" style={{ marginBottom:20, padding:24, background:'var(--accent-subtle)', border:'1px solid var(--accent-primary)' }}>
            <div style={{ display:'flex', alignItems:'flex-start', gap:16, flexWrap:'wrap' }}>
              <div style={{ flex:1 }}>
                <h3 style={{ marginBottom:8, fontSize:16 }}>📦 Resale Packet Service</h3>
                <p style={{ fontSize:14, margin:0 }}>Generate a complete resale packet for title companies and realtors. Includes: financial status, outstanding dues, governing documents, pending violations, meeting minutes, and insurance certificate.</p>
              </div>
              <button className="btn btn-primary" onClick={()=>addToast('Resale packet generating — includes financials, docs, violations, and insurance cert. Will be ready in 2 minutes.','success')}>
                Generate Resale Packet
              </button>
            </div>
          </div>

          {/* Transfer steps */}
          <div className="card" style={{ padding:24 }}>
            <div className="card-title" style={{ marginBottom:16 }}>Transfer Workflow — 5 Steps</div>
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {[
                { step:1, label:'Verify Outstanding Dues', desc:'Collect all unpaid dues, late fees, and special assessments before transfer closes', status:'required' },
                { step:2, label:'Collect Move-In Fee', desc:`Collect $150 move-in processing fee from new owner at closing`, status:'required' },
                { step:3, label:'Archive Current Resident', desc:'Set old owner status to "Former Resident", preserve violation and payment history linked to property', status:'auto' },
                { step:4, label:'Create New Resident Account', desc:'Invite new owner via email, send welcome letter and community documents package', status:'auto' },
                { step:5, label:'Transfer Amenity Access', desc:'Update key fob, gate codes, and amenity access for new owner', status:'manual' },
              ].map(s=>(
                <div key={s.step} style={{ display:'flex', gap:16, padding:'12px 16px', background:'var(--bg-secondary)', borderRadius:10 }}>
                  <div style={{ width:28, height:28, background:'var(--accent-primary)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize:13, fontWeight:700, flexShrink:0 }}>{s.step}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700, fontSize:14, marginBottom:2 }}>{s.label}</div>
                    <div style={{ fontSize:13, color:'var(--text-muted)' }}>{s.desc}</div>
                  </div>
                  <span className={`badge ${s.status==='required'?'badge-red':s.status==='auto'?'badge-green':'badge-yellow'}`} style={{ fontSize:10, alignSelf:'flex-start', flexShrink:0 }}>
                    {s.status==='required'?'Required':s.status==='auto'?'Automatic':'Manual'}
                  </span>
                </div>
              ))}
            </div>
            <button className="btn btn-primary" style={{ marginTop:16 }} onClick={()=>addToast('Ownership transfer wizard started','info')}>
              Start Transfer Wizard <ArrowRight size={15}/>
            </button>
          </div>
        </div>
      )}

      {/* Transfer Modal */}
      {showTransferModal && (
        <div className="modal-backdrop" onClick={()=>setShowTransferModal(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-header">
              <h3>Initiate Ownership Transfer — Unit {showTransferModal.unit}</h3>
              <button className="btn btn-ghost btn-icon" onClick={()=>setShowTransferModal(null)}><X size={16}/></button>
            </div>
            <div className="modal-body">
              <div style={{ padding:'12px 16px', background:'#fffbeb', borderRadius:10, marginBottom:16, fontSize:13 }}>
                Current owner: <strong>{showTransferModal.name}</strong> · Balance: <strong style={{ color:showTransferModal.balance>0?'var(--danger)':'var(--success)' }}>${showTransferModal.balance.toFixed(2)}</strong>
                {showTransferModal.balance>0 && <span style={{ color:'var(--danger)', fontWeight:700 }}> — Outstanding dues must be settled before transfer</span>}
              </div>
              <div className="form-group"><label className="form-label">New Owner Full Name *</label><input className="form-input" placeholder="Full legal name"/></div>
              <div className="form-group"><label className="form-label">New Owner Email *</label><input type="email" className="form-input" placeholder="email@example.com"/></div>
              <div className="form-group"><label className="form-label">New Owner Phone</label><input type="tel" className="form-input" placeholder="(512) 555-0000"/></div>
              <div className="form-group"><label className="form-label">Transfer / Closing Date *</label><input type="date" className="form-input"/></div>
              <div className="form-group"><label className="form-label">Is New Occupant an Owner or Tenant?</label>
                <select className="form-select"><option>Owner (purchasing property)</option><option>Tenant (renting from new owner)</option></select>
              </div>
              <div style={{ padding:'10px 14px', background:'var(--bg-secondary)', borderRadius:8, fontSize:12, color:'var(--text-muted)' }}>
                A welcome email with community documents, portal login, and autopay setup instructions will be sent to the new owner automatically.
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={()=>setShowTransferModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={()=>{ setShowTransferModal(null); addToast(`Transfer initiated for Unit ${showTransferModal.unit}. Welcome email sent to new owner.`,'success') }}>
                <ArrowRight size={15}/> Complete Transfer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="modal-backdrop" onClick={()=>setShowImportModal(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-header">
              <h3>Bulk Import Residents (CSV)</h3>
              <button className="btn btn-ghost btn-icon" onClick={()=>setShowImportModal(false)}><X size={16}/></button>
            </div>
            <div className="modal-body">
              <p style={{ marginBottom:16 }}>Upload a CSV file to import multiple residents at once. Supports imports from PayHOA, AppFolio, Buildium, and TOPS.</p>
              <div style={{ padding:'24px', border:'2px dashed var(--border-color)', borderRadius:12, textAlign:'center', background:'var(--bg-secondary)', marginBottom:16, cursor:'pointer' }}
                onClick={()=>addToast('File picker opened — select your CSV file','info')}>
                <div style={{ fontSize:32, marginBottom:8 }}>📁</div>
                <div style={{ fontWeight:600, marginBottom:4 }}>Click to upload CSV file</div>
                <div style={{ fontSize:13, color:'var(--text-muted)' }}>Or drag and drop · Max 5MB · .csv or .xlsx</div>
              </div>
              <div style={{ padding:'12px', background:'var(--bg-secondary)', borderRadius:8, fontSize:12 }}>
                <strong>Required columns:</strong> unit, name, email, phone, moveIn, isOwner<br/>
                <strong>Optional:</strong> balance, autopay, parking, emergencyContact
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={()=>setShowImportModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={()=>{ setShowImportModal(false); addToast('CSV imported: 42 residents added, 3 duplicates skipped, 0 errors','success') }}>
                Import & Validate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────
// PAYMENTS & FINANCE
// ─────────────────────────────────────────────────────
export function Payments() {
  const { addToast } = useToast()
  const [tab, setTab] = useState('transactions')
  const [showChargeModal, setShowChargeModal] = useState(false)
  const [showPlanModal, setShowPlanModal] = useState(false)
  const [showAssessmentModal, setShowAssessmentModal] = useState(false)
  const [showReconcileModal, setShowReconcileModal] = useState(false)
  const [showJournalModal, setShowJournalModal] = useState(false)
  const [chargeForm, setChargeForm] = useState({ unit:'', amount:'', type:'Monthly Dues', memo:'' })

  const totalCollected = PAYMENT_HISTORY.filter(p=>p.status==='Completed').reduce((s,p)=>s+p.amount,0)
  const totalFailed = PAYMENT_HISTORY.filter(p=>p.status==='Failed').reduce((s,p)=>s+p.amount,0)

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:28, flexWrap:'wrap', gap:16 }}>
        <div>
          <h2 style={{ marginBottom:4 }}>Payments & Finance</h2>
          <p>Transactions, payment plans, special assessments, reconciliation, and journal entries</p>
        </div>
        <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
          <button className="btn btn-secondary btn-sm" onClick={()=>setShowReconcileModal(true)}><RefreshCw size={14}/> Reconcile</button>
          <button className="btn btn-secondary btn-sm" onClick={()=>setShowJournalModal(true)}><FileText size={14}/> Journal Entry</button>
          <button className="btn btn-secondary btn-sm" onClick={()=>setShowAssessmentModal(true)}><DollarSign size={14}/> Special Assessment</button>
          <button className="btn btn-primary btn-sm" onClick={()=>setShowChargeModal(true)}><Plus size={14}/> Add Charge</button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid-4" style={{ marginBottom:24 }}>
        {[
          { label:'MTD Collected', value:'$' + (FINANCIAL_SUMMARY.mtdCollected.toLocaleString()), color:'#2b52a0', sub:(FINANCIAL_SUMMARY.collectionRate) + '% rate' },
          { label:'Outstanding', value:'$' + (FINANCIAL_SUMMARY.totalUnpaid.toLocaleString()), color:'#ef4444', sub:(FINANCIAL_SUMMARY.delinquentUnits) + ' units delinquent' },
          { label:'Book Balance', value:'$' + (FINANCIAL_SUMMARY.bookBalance.toLocaleString()), color:'#0284c7', sub:FINANCIAL_SUMMARY.reconciliationDiff>0?`$${FINANCIAL_SUMMARY.reconciliationDiff} diff from bank`:'Reconciled ✓' },
          { label:'Reserve Fund', value:'$' + ((FINANCIAL_SUMMARY.reserveBalance/1000).toFixed(0)) + 'K', color:'#7c3aed', sub:'62% of target funded' },
        ].map(s=>(
          <div key={s.label} className="stat-card">
            <div style={{ fontSize:24, fontFamily:'var(--font-display)', fontWeight:900, color:s.color, marginBottom:3 }}>{s.value}</div>
            <div style={{ fontSize:13, fontWeight:700, color:'var(--text-primary)', marginBottom:2 }}>{s.label}</div>
            <div style={{ fontSize:12, color:'var(--text-muted)' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="tabs">
        {[['transactions','Transactions'],['paymentplans','Payment Plans'],['assessments','Special Assessments'],['ledger','General Ledger'],['reconciliation','Reconciliation']].map(([id,label])=>(
          <div key={id} className={`tab ${tab===id?'active':''}`} onClick={()=>setTab(id)}>{label}</div>
        ))}
      </div>

      {/* TRANSACTIONS */}
      {tab==='transactions' && (
        <div>
          <div className="table-wrapper">
            <table>
              <thead><tr><th>Date</th><th>Unit</th><th>Resident</th><th>Type</th><th>Method</th><th>Amount</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {PAYMENT_HISTORY.map(p=>(
                  <tr key={p.id}>
                    <td style={{ fontSize:13 }}>{p.date}</td>
                    <td><strong style={{ color:'var(--accent-primary)', fontFamily:'var(--font-display)' }}>{p.unit}</strong></td>
                    <td style={{ fontWeight:600, fontSize:14 }}>{p.resident}</td>
                    <td><span className="badge badge-gray">{p.type}</span></td>
                    <td style={{ fontSize:13, color:'var(--text-muted)' }}>{p.method}</td>
                    <td style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:15, color:p.status==='Failed'?'var(--danger)':'var(--text-primary)' }}>
                      ${p.amount.toFixed(2)}
                    </td>
                    <td>
                      <span className={`badge ${p.status==='Completed'?'badge-green':p.status==='Failed'?'badge-red':'badge-yellow'}`}>{p.status}</span>
                      {p.status==='Failed' && p.failReason && <div style={{ fontSize:10, color:'var(--danger)' }}>{p.failReason}</div>}
                    </td>
                    <td>
                      <div style={{ display:'flex', gap:5 }}>
                        {p.receipt && <button className="btn btn-ghost btn-sm btn-icon" onClick={()=>addToast('Receipt PDF downloaded','success')} title="Download receipt"><Download size={13}/></button>}
                        {p.status==='Failed' && <button className="btn btn-secondary btn-sm" onClick={()=>addToast(`NSF fee of $${COMMUNITY.lateFee} applied to ${p.resident}`,'success')}>Apply NSF Fee</button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop:12, display:'flex', gap:16, padding:'12px 16px', background:'var(--bg-secondary)', borderRadius:10, fontSize:13, flexWrap:'wrap' }}>
            <span>Total Collected: <strong style={{ color:'var(--success)' }}>${totalCollected.toLocaleString()}</strong></span>
            <span>Failed Payments: <strong style={{ color:'var(--danger)' }}>${totalFailed.toLocaleString()}</strong></span>
            <span>Transactions: <strong>{PAYMENT_HISTORY.length}</strong></span>
          </div>
        </div>
      )}

      {/* PAYMENT PLANS */}
      {tab==='paymentplans' && (
        <div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
            <p>Structured installment plans for delinquent residents — FDCPA compliant</p>
            <button className="btn btn-primary btn-sm" onClick={()=>setShowPlanModal(true)}><Plus size={14}/> Create Plan</button>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {[
              { unit:'2A', resident:'Maria Rodriguez', total:855, paid:285, installments:3, next:'2026-05-01', status:'Active' },
              { unit:'8D', resident:'Jennifer Lee', total:1140, paid:380, installments:3, next:'2026-05-01', status:'Active' },
            ].map(plan=>(
              <div key={plan.unit} className="card" style={{ padding:20 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:12, marginBottom:14 }}>
                  <div>
                    <div style={{ fontWeight:700, fontSize:16 }}>Unit {plan.unit} — {plan.resident}</div>
                    <div style={{ fontSize:13, color:'var(--text-muted)', marginTop:2 }}>Total balance: ${plan.total} · {plan.installments} installments of ${Math.round((plan.total-plan.paid)/plan.installments)}/mo</div>
                  </div>
                  <span className="badge badge-green">{plan.status}</span>
                </div>
                <div className="progress-bar" style={{ height:10, marginBottom:8 }}>
                  <div className="progress-fill" style={{ width:`${(plan.paid/plan.total)*100}%` }}/>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:13 }}>
                  <span style={{ color:'var(--success)', fontWeight:700 }}>Paid: ${plan.paid}</span>
                  <span style={{ color:'var(--text-muted)' }}>Remaining: ${plan.total-plan.paid} · Next: {plan.next}</span>
                </div>
                <div style={{ marginTop:12, display:'flex', gap:8 }}>
                  <button className="btn btn-secondary btn-sm" onClick={()=>addToast('Plan agreement PDF downloaded','success')}>Plan Agreement PDF</button>
                  <button className="btn btn-ghost btn-sm" onClick={()=>addToast('Plan modified','success')}>Modify Plan</button>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop:16, padding:'12px 16px', background:'var(--bg-secondary)', borderRadius:10, fontSize:13 }}>
            <strong>FDCPA Notice:</strong> Payment plans and collection activities must comply with the Fair Debt Collection Practices Act (15 U.S.C. § 1692). All communications must include required disclosures. Consult your HOA attorney before initiating legal action.
          </div>
        </div>
      )}

      {/* SPECIAL ASSESSMENTS */}
      {tab==='assessments' && (
        <div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
            <p>One-time assessments charged to all or specific units for capital improvements</p>
            <button className="btn btn-primary btn-sm" onClick={()=>setShowAssessmentModal(true)}><Plus size={14}/> New Assessment</button>
          </div>
          <div className="table-wrapper">
            <table>
              <thead><tr><th>Assessment</th><th>Per Unit</th><th>Total</th><th>Units Billed</th><th>Collected</th><th>Status</th></tr></thead>
              <tbody>
                {[
                  { name:'Lobby Renovation', amount:450, total:55980, units:124, collected:50820, status:'Active', dueDate:'2026-05-15' },
                  { name:'Parking Lot Resurfacing 2025', amount:185, total:22940, units:124, collected:22940, status:'Completed', dueDate:'2025-11-30' },
                ].map(a=>(
                  <tr key={a.name}>
                    <td>
                      <div style={{ fontWeight:700, fontSize:14 }}>{a.name}</div>
                      <div style={{ fontSize:12, color:'var(--text-muted)' }}>Due: {a.dueDate}</div>
                    </td>
                    <td style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:15 }}>${a.amount}/unit</td>
                    <td style={{ fontFamily:'var(--font-display)', fontWeight:900 }}>${a.total.toLocaleString()}</td>
                    <td>{a.units} units</td>
                    <td>
                      <div style={{ fontWeight:700, color:a.collected>=a.total?'var(--success)':'var(--warning)' }}>${a.collected.toLocaleString()}</div>
                      <div className="progress-bar" style={{ height:5, marginTop:4 }}>
                        <div className="progress-fill" style={{ width:`${(a.collected/a.total)*100}%` }}/>
                      </div>
                      <div style={{ fontSize:10, color:'var(--text-muted)', marginTop:2 }}>{Math.round((a.collected/a.total)*100)}% collected</div>
                    </td>
                    <td><span className={`badge ${a.status==='Completed'?'badge-green':'badge-yellow'}`}>{a.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* GENERAL LEDGER */}
      {tab==='ledger' && (
        <div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
            <p>Chart of accounts and journal entries — fund accounting (operating vs. reserve)</p>
            <button className="btn btn-primary btn-sm" onClick={()=>setShowJournalModal(true)}><Plus size={14}/> New Journal Entry</button>
          </div>
          <div className="card" style={{ marginBottom:20, padding:20 }}>
            <div className="card-title" style={{ marginBottom:14 }}>Chart of Accounts</div>
            <div className="table-wrapper">
              <table>
                <thead><tr><th>Code</th><th>Account Name</th><th>Type</th><th>Balance</th></tr></thead>
                <tbody>
                  {CHART_OF_ACCOUNTS.map(a=>(
                    <tr key={a.id}>
                      <td style={{ fontFamily:'monospace', fontSize:13, color:'var(--text-muted)' }}>{a.code}</td>
                      <td style={{ fontWeight:600, fontSize:14 }}>{a.name}</td>
                      <td><span className={`badge ${a.type==='Asset'?'badge-green':a.type==='Income'?'badge-blue':a.type==='Expense'?'badge-red':a.type==='Liability'?'badge-yellow':'badge-gray'}`}>{a.type}</span></td>
                      <td style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:14, color:a.type==='Expense'?'var(--danger)':a.type==='Income'?'var(--success)':'var(--text-primary)' }}>${a.balance.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="card" style={{ padding:20 }}>
            <div className="card-title" style={{ marginBottom:14 }}>Recent Journal Entries</div>
            <div className="table-wrapper">
              <table>
                <thead><tr><th>Date</th><th>Memo</th><th>Debit</th><th>Credit</th><th>Amount</th><th>Posted By</th><th>Status</th></tr></thead>
                <tbody>
                  {JOURNAL_ENTRIES.map(je=>(
                    <tr key={je.id}>
                      <td style={{ fontSize:13 }}>{je.date}</td>
                      <td style={{ fontSize:13, maxWidth:200 }}>{je.memo}</td>
                      <td style={{ fontSize:13, color:'var(--danger)' }}>{je.debit}</td>
                      <td style={{ fontSize:13, color:'var(--success)' }}>{je.credit}</td>
                      <td style={{ fontFamily:'var(--font-display)', fontWeight:900 }}>${je.amount.toLocaleString()}</td>
                      <td style={{ fontSize:12, color:'var(--text-muted)' }}>{je.createdBy}</td>
                      <td><span className="badge badge-green">{je.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* BANK RECONCILIATION */}
      {tab==='reconciliation' && (
        <div>
          <div style={{ marginBottom:20, display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
            <p>Match your CanHoa ledger to your bank statement monthly</p>
            <button className="btn btn-primary btn-sm" onClick={()=>setShowReconcileModal(true)}><RefreshCw size={14}/> Start Reconciliation</button>
          </div>

          <div className="grid-2" style={{ marginBottom:20 }}>
            <div className="card" style={{ padding:24, background:FINANCIAL_SUMMARY.reconciliationDiff===0?'var(--accent-subtle)':'#fffbeb', border:`1px solid ${FINANCIAL_SUMMARY.reconciliationDiff===0?'var(--accent-primary)':'#fde68a'}` }}>
              <div style={{ fontSize:13, fontWeight:700, color:'var(--text-muted)', marginBottom:8 }}>BOOK BALANCE (CanHoa Ledger)</div>
              <div style={{ fontFamily:'var(--font-display)', fontSize:36, fontWeight:900, color:'var(--text-primary)', marginBottom:4 }}>${FINANCIAL_SUMMARY.bookBalance.toLocaleString()}</div>
              <div style={{ fontSize:13, color:'var(--text-muted)' }}>As of {FINANCIAL_SUMMARY.lastReconciled}</div>
            </div>
            <div className="card" style={{ padding:24 }}>
              <div style={{ fontSize:13, fontWeight:700, color:'var(--text-muted)', marginBottom:8 }}>BANK BALANCE (Statement)</div>
              <div style={{ fontFamily:'var(--font-display)', fontSize:36, fontWeight:900, color:'var(--text-primary)', marginBottom:4 }}>${FINANCIAL_SUMMARY.bankBalance.toLocaleString()}</div>
              <div style={{ fontSize:13, color:FINANCIAL_SUMMARY.reconciliationDiff>0?'var(--warning)':'var(--text-muted)' }}>
                {FINANCIAL_SUMMARY.reconciliationDiff>0?`$${FINANCIAL_SUMMARY.reconciliationDiff} difference — investigation required`:'Balanced ✓'}
              </div>
            </div>
          </div>

          <div className="card" style={{ padding:24 }}>
            <div className="card-title" style={{ marginBottom:16 }}>Reconciliation Detail</div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {[
                { label:'Ending Bank Balance', amount:FINANCIAL_SUMMARY.bankBalance, sign:'' },
                { label:'Add: Outstanding Deposits (in-transit)', amount:1240, sign:'+' },
                { label:'Less: Outstanding Checks', amount:-420, sign:'-' },
                { label:'Adjusted Bank Balance', amount:FINANCIAL_SUMMARY.bankBalance+1240-420, sign:'', bold:true },
                { label:'', amount:null, sign:'' },
                { label:'Book Balance (CanHoa)', amount:FINANCIAL_SUMMARY.bookBalance, sign:'' },
                { label:'Add: Interest Earned', amount:180, sign:'+' },
                { label:'Less: Bank Service Fees', amount:-160, sign:'-' },
                { label:'Adjusted Book Balance', amount:FINANCIAL_SUMMARY.bookBalance+180-160, sign:'', bold:true },
                { label:'', amount:null, sign:'' },
                { label:'RECONCILIATION DIFFERENCE', amount:FINANCIAL_SUMMARY.reconciliationDiff, sign:'', bold:true, color:FINANCIAL_SUMMARY.reconciliationDiff===0?'var(--success)':'var(--danger)' },
              ].map((row, i)=> row.amount===null ? <div key={i} className="divider"/> : (
                <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'8px 12px', background:row.bold?'var(--bg-secondary)':'transparent', borderRadius:6 }}>
                  <span style={{ fontSize:13, fontWeight:row.bold?700:400, color:row.color||'var(--text-primary)' }}>{row.label}</span>
                  <span style={{ fontFamily:'var(--font-display)', fontWeight:row.bold?900:600, fontSize:14, color:row.color||(row.sign==='-'?'var(--danger)':row.sign==='+'?'var(--success)':'var(--text-primary)') }}>
                    {row.sign}{row.sign==='-'?'':''} ${Math.abs(row.amount).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
            <div style={{ marginTop:16, display:'flex', gap:10 }}>
              <button className="btn btn-primary" onClick={()=>addToast('Reconciliation marked complete. Report saved.','success')}>Mark Reconciled</button>
              <button className="btn btn-secondary" onClick={()=>addToast('Reconciliation report PDF downloaded','success')}>Download PDF Report</button>
            </div>
          </div>
        </div>
      )}

      {/* ADD CHARGE MODAL */}
      {showChargeModal && (
        <div className="modal-backdrop" onClick={()=>setShowChargeModal(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-header"><h3>Add Charge</h3><button className="btn btn-ghost btn-icon" onClick={()=>setShowChargeModal(false)}><X size={16}/></button></div>
            <div className="modal-body">
              <div className="form-group"><label className="form-label">Unit *</label><select className="form-select" value={chargeForm.unit} onChange={e=>setChargeForm(f=>({...f,unit:e.target.value}))}>
                <option value="">Select unit...</option>{RESIDENTS.map(r=><option key={r.id} value={r.unit}>Unit {r.unit} — {r.name}</option>)}
              </select></div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div className="form-group"><label className="form-label">Charge Type</label>
                  <select className="form-select" value={chargeForm.type} onChange={e=>setChargeForm(f=>({...f,type:e.target.value}))}>
                    {['Monthly Dues','Late Fee','NSF Fee','Special Assessment','Violation Fine','Maintenance Charge','Move-In Fee','Other'].map(t=><option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group"><label className="form-label">Amount ($)</label><input type="number" className="form-input" value={chargeForm.amount} onChange={e=>setChargeForm(f=>({...f,amount:e.target.value}))} placeholder="0.00"/></div>
              </div>
              <div className="form-group"><label className="form-label">Memo / Reference</label><input className="form-input" placeholder="Optional description" value={chargeForm.memo} onChange={e=>setChargeForm(f=>({...f,memo:e.target.value}))}/></div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={()=>setShowChargeModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={()=>{ setShowChargeModal(false); addToast(`$${chargeForm.amount} ${chargeForm.type} charge added to Unit ${chargeForm.unit}`,'success'); setChargeForm({unit:'',amount:'',type:'Monthly Dues',memo:''}) }}>
                <Plus size={15}/> Apply Charge
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PAYMENT PLAN MODAL */}
      {showPlanModal && (
        <div className="modal-backdrop" onClick={()=>setShowPlanModal(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-header"><h3>Create Payment Plan</h3><button className="btn btn-ghost btn-icon" onClick={()=>setShowPlanModal(false)}><X size={16}/></button></div>
            <div className="modal-body">
              <div className="form-group"><label className="form-label">Delinquent Unit *</label><select className="form-select">
                {RESIDENTS.filter(r=>r.status==='delinquent').map(r=><option key={r.id}>Unit {r.unit} — {r.name} (${r.balance.toFixed(2)} owed)</option>)}
              </select></div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div className="form-group"><label className="form-label">Number of Installments</label><select className="form-select"><option>2 payments</option><option>3 payments</option><option>4 payments</option><option>6 payments</option><option>12 payments</option></select></div>
                <div className="form-group"><label className="form-label">First Payment Date</label><input type="date" className="form-input" defaultValue="2026-05-01"/></div>
              </div>
              <div className="form-group"><label className="form-label">Down Payment Required ($)</label><input type="number" className="form-input" placeholder="e.g. 100" defaultValue="0"/></div>
              <div style={{ padding:'10px 14px', background:'#fffbeb', borderRadius:8, fontSize:13 }}>
                <strong>FDCPA Compliance:</strong> Payment plan agreement must be in writing and signed by both parties. Include: total amount owed, payment schedule, consequences of default, and FDCPA required disclosures.
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={()=>setShowPlanModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={()=>{ setShowPlanModal(false); addToast('Payment plan created. Agreement PDF sent to resident for signature.','success') }}>
                Create Plan & Send Agreement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SPECIAL ASSESSMENT MODAL */}
      {showAssessmentModal && (
        <div className="modal-backdrop" onClick={()=>setShowAssessmentModal(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-header"><h3>Create Special Assessment</h3><button className="btn btn-ghost btn-icon" onClick={()=>setShowAssessmentModal(false)}><X size={16}/></button></div>
            <div className="modal-body">
              <div className="form-group"><label className="form-label">Assessment Name *</label><input className="form-input" placeholder="e.g. Emergency Roof Repair 2026"/></div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div className="form-group"><label className="form-label">Amount Per Unit ($)</label><input type="number" className="form-input" placeholder="450"/></div>
                <div className="form-group"><label className="form-label">Due Date</label><input type="date" className="form-input"/></div>
              </div>
              <div className="form-group"><label className="form-label">Units to Charge</label><select className="form-select"><option>All units (124)</option><option>Owner-occupied only</option><option>Specific building</option></select></div>
              <div className="form-group"><label className="form-label">Allow Installments?</label><select className="form-select"><option>No — full payment required</option><option>Yes — up to 3 installments</option><option>Yes — up to 6 installments</option></select></div>
              <div className="form-group"><label className="form-label">Description / Reason</label><textarea className="form-textarea" placeholder="Explain the reason for this special assessment and what the funds will be used for..."/></div>
              <div style={{ padding:'10px 14px', background:'var(--bg-secondary)', borderRadius:8, fontSize:12, color:'var(--text-muted)' }}>
                Board approval required before creating special assessment over $X per unit (see your CC&Rs). Texas Property Code § 209.0094 applies to special assessment notice requirements.
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={()=>setShowAssessmentModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={()=>{ setShowAssessmentModal(false); addToast('Special assessment created and charged to 124 units. Email notifications sent.','success') }}>
                Create Assessment & Notify Residents
              </button>
            </div>
          </div>
        </div>
      )}

      {/* JOURNAL ENTRY MODAL */}
      {showJournalModal && (
        <div className="modal-backdrop" onClick={()=>setShowJournalModal(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-header"><h3>New Journal Entry</h3><button className="btn btn-ghost btn-icon" onClick={()=>setShowJournalModal(false)}><X size={16}/></button></div>
            <div className="modal-body">
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div className="form-group"><label className="form-label">Entry Date *</label><input type="date" className="form-input" defaultValue={new Date().toISOString().slice(0,10)}/></div>
                <div className="form-group"><label className="form-label">Amount ($) *</label><input type="number" className="form-input" placeholder="0.00"/></div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div className="form-group"><label className="form-label">Debit Account *</label>
                  <select className="form-select">{CHART_OF_ACCOUNTS.map(a=><option key={a.id}>{a.code} — {a.name}</option>)}</select>
                </div>
                <div className="form-group"><label className="form-label">Credit Account *</label>
                  <select className="form-select">{CHART_OF_ACCOUNTS.map(a=><option key={a.id}>{a.code} — {a.name}</option>)}</select>
                </div>
              </div>
              <div className="form-group"><label className="form-label">Memo / Description *</label><input className="form-input" placeholder="Describe the purpose of this journal entry"/></div>
              <div style={{ padding:'10px 14px', background:'var(--bg-secondary)', borderRadius:8, fontSize:12 }}>
                Journal entries are permanently logged with your name and timestamp. Posted entries cannot be deleted — use a reversal entry to correct errors.
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={()=>setShowJournalModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={()=>{ setShowJournalModal(false); addToast('Journal entry posted to general ledger','success') }}>
                <FileText size={15}/> Post Journal Entry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RECONCILE MODAL */}
      {showReconcileModal && (
        <div className="modal-backdrop" onClick={()=>setShowReconcileModal(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-header"><h3>Start Bank Reconciliation</h3><button className="btn btn-ghost btn-icon" onClick={()=>setShowReconcileModal(false)}><X size={16}/></button></div>
            <div className="modal-body">
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div className="form-group"><label className="form-label">Statement End Date *</label><input type="date" className="form-input"/></div>
                <div className="form-group"><label className="form-label">Bank Statement Ending Balance *</label><input type="number" className="form-input" placeholder="0.00"/></div>
              </div>
              <div style={{ padding:'12px 14px', background:'var(--bg-secondary)', borderRadius:8, fontSize:13 }}>
                <strong>How it works:</strong> Enter your bank statement ending balance. CanHoa will compare it to your book balance and show you any outstanding deposits or checks to reconcile.
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={()=>setShowReconcileModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={()=>{ setShowReconcileModal(false); setTab('reconciliation'); addToast('Reconciliation started','info') }}>
                Start Reconciliation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
