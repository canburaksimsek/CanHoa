import React, { useState } from 'react'
import { useToast } from '../../context/AppContext.jsx'
import { Search, Plus, Filter, Clock, CheckCircle, AlertTriangle, Wrench, Camera, User, Download, MoreHorizontal } from 'lucide-react'
import { MAINTENANCE_REQUESTS, VENDORS } from '../../data/mockData.js'

const PRIORITY_COLORS = { Emergency: '#ef4444', High: '#f97316', Normal: '#3b82f6', Low: '#6b7280' }
const STATUS_COLORS = { New: '#6366f1', Assigned: '#f59e0b', Scheduled: '#3b82f6', 'In Progress': '#f97316', 'Pending Approval': '#8b5cf6', Resolved: '#22c55e', Closed: '#6b7280' }

export default function Maintenance() {
  const { addToast } = useToast()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [selected, setSelected] = useState(null)
  const [showNewModal, setShowNewModal] = useState(false)
  const [newRequest, setNewRequest] = useState({ title: '', category: 'Plumbing', priority: 'Normal', unit: '', description: '' })

  const filtered = MAINTENANCE_REQUESTS.filter(r => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) || r.unit.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || r.status === statusFilter
    const matchPriority = priorityFilter === 'all' || r.priority === priorityFilter
    return matchSearch && matchStatus && matchPriority
  })

  const counts = {
    total: MAINTENANCE_REQUESTS.length,
    open: MAINTENANCE_REQUESTS.filter(r => r.status === 'New').length,
    inProgress: MAINTENANCE_REQUESTS.filter(r => ['Assigned', 'In Progress', 'Scheduled'].includes(r.status)).length,
    emergency: MAINTENANCE_REQUESTS.filter(r => r.priority === 'Emergency').length,
    resolved: MAINTENANCE_REQUESTS.filter(r => r.status === 'Resolved').length,
  }

  const handleCreate = () => {
    addToast('New work order created and assigned!', 'success')
    setShowNewModal(false)
    setNewRequest({ title: '', category: 'Plumbing', priority: 'Normal', unit: '', description: '' })
  }

  const selectedRequest = MAINTENANCE_REQUESTS.find(r => r.id === selected)

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ marginBottom: 4 }}>Maintenance & Work Orders</h2>
          <p>{counts.open} new · {counts.inProgress} in progress · {counts.emergency} emergency</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary btn-sm" onClick={() => addToast('Report exported', 'success')}><Download size={14} /> Export</button>
          <button className="btn btn-primary btn-sm" onClick={() => setShowNewModal(true)}><Plus size={14} /> New Request</button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        {[
          { label: 'Open / New', value: counts.open, color: '#6366f1' },
          { label: 'In Progress', value: counts.inProgress, color: '#f97316' },
          { label: 'Emergency', value: counts.emergency, color: '#ef4444' },
          { label: 'Resolved (30d)', value: counts.resolved, color: '#22c55e' },
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
          <input className="form-input" placeholder="Search by title or unit..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 40 }} />
        </div>
        <select className="form-select" style={{ width: 160 }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">All Statuses</option>
          {['New', 'Assigned', 'Scheduled', 'In Progress', 'Pending Approval', 'Resolved'].map(s => <option key={s}>{s}</option>)}
        </select>
        <select className="form-select" style={{ width: 140 }} value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}>
          <option value="all">All Priorities</option>
          {['Emergency', 'High', 'Normal', 'Low'].map(p => <option key={p}>{p}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="table-wrapper" style={{ marginBottom: selected ? 24 : 0 }}>
        <table>
          <thead>
            <tr>
              <th>Request</th>
              <th>Unit</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Assigned To</th>
              <th>Created</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r.id} style={{ cursor: 'pointer', background: selected === r.id ? 'var(--bg-hover)' : 'transparent' }} onClick={() => setSelected(selected === r.id ? null : r.id)}>
                <td>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{r.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{r.resident}</div>
                </td>
                <td><strong style={{ color: 'var(--accent-primary)', fontFamily: 'var(--font-display)' }}>{r.unit}</strong></td>
                <td><span className="badge badge-gray">{r.category}</span></td>
                <td>
                  <span style={{ fontWeight: 700, fontSize: 13, color: PRIORITY_COLORS[r.priority] || '#6b7280' }}>
                    {r.priority === 'Emergency' ? '🚨 ' : r.priority === 'High' ? '⚠️ ' : ''}{r.priority}
                  </span>
                </td>
                <td>
                  <span className="badge" style={{ background: (STATUS_COLORS[r.status] || '#6b7280') + '20', color: STATUS_COLORS[r.status] || '#6b7280' }}>
                    {r.status}
                  </span>
                </td>
                <td style={{ fontSize: 13 }}>{r.assignedTo || <span style={{ color: 'var(--text-muted)' }}>Unassigned</span>}</td>
                <td style={{ fontSize: 13, color: 'var(--text-muted)' }}>{r.created}</td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {!r.assignedTo && (
                      <button className="btn btn-primary btn-sm" onClick={e => { e.stopPropagation(); addToast(`Assigned to vendor!`, 'success') }}>Assign</button>
                    )}
                    <button className="btn btn-ghost btn-sm btn-icon" onClick={e => e.stopPropagation()}>
                      <MoreHorizontal size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Panel */}
      {selectedRequest && (
        <div className="card" style={{ padding: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
            <div>
              <h3 style={{ marginBottom: 4 }}>{selectedRequest.title}</h3>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>ID: {selectedRequest.id}</span>
                <span className="badge" style={{ background: (STATUS_COLORS[selectedRequest.status] || '#6b7280') + '20', color: STATUS_COLORS[selectedRequest.status] || '#6b7280' }}>{selectedRequest.status}</span>
                <span style={{ fontWeight: 700, fontSize: 13, color: PRIORITY_COLORS[selectedRequest.priority] }}>{selectedRequest.priority}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <select className="form-select" style={{ width: 200, fontSize: 13 }} onChange={e => addToast(`Status updated to ${e.target.value}`, 'success')} defaultValue={selectedRequest.status}>
                {['New', 'Assigned', 'Scheduled', 'In Progress', 'Pending Approval', 'Resolved', 'Closed'].map(s => <option key={s}>{s}</option>)}
              </select>
              <button className="btn btn-primary btn-sm" onClick={() => addToast('Work order PDF downloaded', 'success')}><Download size={14} /> Export PDF</button>
            </div>
          </div>

          <div className="grid-3">
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Request Details</div>
              <div style={{ fontSize: 14, marginBottom: 8, lineHeight: 1.6, color: 'var(--text-primary)' }}>{selectedRequest.description}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Submitted: {selectedRequest.created}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Photos: {selectedRequest.photos} attached</div>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Assignment</div>
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 13, marginBottom: 8 }}>Assigned to: <strong>{selectedRequest.assignedTo || 'Unassigned'}</strong></div>
                <select className="form-select" style={{ fontSize: 13 }} onChange={e => addToast(`Assigned to ${e.target.value}`, 'success')}>
                  <option>Select vendor...</option>
                  {VENDORS.map(v => <option key={v.id}>{v.name} ({v.category})</option>)}
                </select>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Cost Tracking</div>
              <div style={{ fontSize: 14, marginBottom: 8 }}>Estimated Cost: <strong>{selectedRequest.cost > 0 ? `$${selectedRequest.cost}` : 'TBD'}</strong></div>
              <div style={{ fontSize: 14, marginBottom: 12 }}>Unit: <strong style={{ color: 'var(--accent-primary)' }}>{selectedRequest.unit}</strong></div>
              <button className="btn btn-secondary btn-sm w-full" onClick={() => addToast('Internal note added', 'success')}>+ Add Internal Note</button>
            </div>
          </div>
        </div>
      )}

      {/* New Request Modal */}
      {showNewModal && (
        <div className="modal-backdrop" onClick={() => setShowNewModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create Work Order</h3>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowNewModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Title *</label>
                <input className="form-input" placeholder="Brief description of the issue" value={newRequest.title} onChange={e => setNewRequest(r => ({ ...r, title: e.target.value }))} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-select" value={newRequest.category} onChange={e => setNewRequest(r => ({ ...r, category: e.target.value }))}>
                    {['Plumbing', 'Electrical', 'HVAC', 'Landscaping', 'Appliance', 'Safety', 'Pest Control', 'Common Area', 'Other'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select className="form-select" value={newRequest.priority} onChange={e => setNewRequest(r => ({ ...r, priority: e.target.value }))}>
                    {['Emergency', 'High', 'Normal', 'Low'].map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Unit / Location</label>
                <input className="form-input" placeholder="e.g. 4B or Common Area - Pool" value={newRequest.unit} onChange={e => setNewRequest(r => ({ ...r, unit: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-textarea" placeholder="Detailed description of the issue..." value={newRequest.description} onChange={e => setNewRequest(r => ({ ...r, description: e.target.value }))} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowNewModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleCreate}>Create Work Order</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
