import React, { useState } from 'react'
import { useToast } from '../../context/AppContext.jsx'
import { CheckCircle, XCircle, ExternalLink, Zap, RefreshCw, Plus, Settings, Lock } from 'lucide-react'

const INTEGRATIONS = [
  {
    category: 'Payments & Banking',
    items: [
      { id:'stripe', name:'Stripe Connect', logo:'💳', desc:'Accept ACH, credit/debit cards, Apple Pay, Google Pay. Funds deposited directly to your HOA bank account. PCI DSS Level 1.', status:'connected', color:'#635bff', features:['ACH bank transfer ($2.45 flat)','Credit/debit cards (3.5%+$0.50)','Apple Pay / Google Pay','Recurring autopay','Stripe Customer Portal for residents'] },
      { id:'plaid', name:'Plaid Bank Sync', logo:'🏦', desc:'Connect your HOA checking account to automatically import bank transactions into CanHoa for reconciliation.', status:'connected', color:'#00b887', features:['Real-time transaction import','Auto-categorization via rules','Bank reconciliation matching','ACH verification for residents'] },
      { id:'alliance', name:'Alliance Association Bank', logo:'🏛', desc:'Direct HOA banking integration with Alliance Association Bank — the leading bank built for community associations.', status:'disconnected', color:'#1A365D', features:['Checking & savings for HOAs','Reserve fund management','Lockbox check processing','Same-day settlement on dues'] },
      { id:'paynearme', name:'PayNearMe', logo:'💵', desc:'Allow residents to pay HOA dues with cash at 35,000+ retail locations including CVS, 7-Eleven, and Dollar General.', status:'disconnected', color:'#e85d26', features:['Cash payments at retail stores','Barcoded payment slips','No bank account required','Automatic ledger posting'] },
    ]
  },
  {
    category: 'Communication',
    items: [
      { id:'twilio', name:'Twilio SMS & Voice', logo:'📱', desc:'Send SMS text messages and automated phone calls to all residents. Unlimited messaging included in plan.', status:'connected', color:'#f22f46', features:['Mass SMS announcements','Automated phone call blasts','SMS violation notices','TCPA-compliant opt-out handling','International number support'] },
      { id:'sendgrid', name:'SendGrid Email', logo:'📧', desc:'Professional email delivery with open/click tracking, bounce handling, and beautiful templates.', status:'connected', color:'#1a82e2', features:['Deliverability optimization','Open & click rate tracking','Template editor','Unsubscribe management (CAN-SPAM)','Monthly email analytics'] },
      { id:'lob', name:'Lob.com Physical Mail', logo:'✉️', desc:'Send printed letters, violation notices, and invoices via USPS directly from CanHoa. Trackable delivery.', status:'connected', color:'#0084d1', features:['USPS First Class and Certified Mail','Return envelope included','Delivery tracking','Merge templates with resident data','$1.05 per letter (First Class)'] },
      { id:'gcal', name:'Google Calendar', logo:'📅', desc:'Sync HOA events, board meetings, and deadlines with Google Calendar. Residents can subscribe.', status:'disconnected', color:'#4285f4', features:['Two-way event sync','iCal feed for residents','Meeting reminders','Holiday blackout dates'] },
    ]
  },
  {
    category: 'Accounting & Finance',
    items: [
      { id:'quickbooks', name:'QuickBooks Online', logo:'📊', desc:'Two-way sync between CanHoa and QuickBooks Online. Post transactions, reconcile, and prepare financials.', status:'disconnected', color:'#2ca01c', features:['Chart of accounts mapping','Transaction sync (both directions)','Vendor payment sync','Budget import/export','1099 preparation export'] },
      { id:'payabli', name:'Payabli AP Automation', logo:'🧾', desc:'Scan vendor invoices via email, auto-code transactions, request approvals, and pay vendors digitally.', status:'disconnected', color:'#6366f1', features:['Email invoice capture','AI-powered coding suggestions','Multi-step approval workflows','Digital ACH vendor payment','90% time savings on AP'] },
      { id:'condoworks', name:'CondoWorks AP', logo:'⚡', desc:'Alternative AP automation focused on invoice management for community associations.', status:'disconnected', color:'#0ea5e9', features:['Invoice scanning & OCR','Vendor management','Payment processing','Buildium compatible'] },
    ]
  },
  {
    category: 'Legal & Compliance',
    items: [
      { id:'docusign', name:'DocuSign eSignature', logo:'✍️', desc:'Send documents for electronic signature. Legally binding under ESIGN Act and UETA.', status:'disconnected', color:'#ffb900', features:['ARC request approvals','Board resolution signatures','Vendor contract signing','Welcome letter signatures','Audit trail & certificate'] },
      { id:'homewisedocs', name:'HomeWiseDocs', logo:'📋', desc:'Automated resale document packages for title companies and realtors. Collect fees automatically.', status:'disconnected', color:'#1A365D', features:['Resale disclosure packages','Title company portal access','Lender questionnaires (Fannie Mae)','Certificate of insurance generation','$150-350 fee collection'] },
    ]
  },
  {
    category: 'Security & Access',
    items: [
      { id:'openpath', name:'Openpath / LenelS2', logo:'🔐', desc:'Gate and door access control integration. Manage fob access, visitor passes, and entry logs from CanHoa.', status:'disconnected', color:'#374151', features:['Fob access management','Visitor pre-registration','Entry/exit audit log','Automatic revocation on move-out','Mobile key support'] },
      { id:'verkada', name:'Verkada Security Cameras', logo:'📷', desc:'Cloud-based security camera management. View footage, manage alerts, and share clips with police.', status:'disconnected', color:'#111827', features:['HD cloud camera management','AI motion detection','License plate recognition','Incident clip sharing','Pool occupancy monitoring'] },
    ]
  },
  {
    category: 'Developer & Automation',
    items: [
      { id:'zapier', name:'Zapier / Make.com', logo:'⚡', desc:'Connect CanHoa to 5,000+ apps via Zapier or Make.com. Build custom automations without code.', status:'disconnected', color:'#ff4a00', features:['Trigger on new payment','Trigger on violation created','Post to Slack on maintenance','Create Asana task from request','3,000+ available apps'] },
      { id:'api', name:'CanHoa Open API', logo:'🔌', desc:'RESTful API for developers. Build custom integrations, mobile apps, or connect enterprise systems.', status:'coming_soon', color:'#6366f1', features:['RESTful JSON API','Webhook events','OAuth 2.0 authentication','Sandbox environment','Rate limit: 1,000 req/min'] },
    ]
  },
]

export default function Integrations() {
  const { addToast } = useToast()
  const [connecting, setConnecting] = useState({})
  const [filter, setFilter] = useState('All')

  const handleConnect = async (id, name, status) => {
    if (status==='connected') {
      addToast(name+' disconnected','warning')
      return
    }
    if (status==='coming_soon') {
      addToast(name+' — Coming soon! Join waitlist.','info')
      return
    }
    setConnecting(c=>({...c,[id]:true}))
    await new Promise(r=>setTimeout(r,1500))
    setConnecting(c=>({...c,[id]:false}))
    if (id==='quickbooks') addToast('QuickBooks Online connected! Chart of accounts mapped.','success')
    else if (id==='docusign') addToast('DocuSign connected! eSignature enabled for ARC requests and contracts.','success')
    else if (id==='homewisedocs') addToast('HomeWiseDocs connected! Resale packet service active.','success')
    else if (id==='gcal') addToast('Google Calendar synced! HOA events will appear in resident calendars.','success')
    else addToast(name+' integration connected successfully!','success')
  }

  const categories = ['All', ...INTEGRATIONS.map(g=>g.category)]
  const filtered = filter==='All' ? INTEGRATIONS : INTEGRATIONS.filter(g=>g.category===filter)
  const connectedCount = INTEGRATIONS.flatMap(g=>g.items).filter(i=>i.status==='connected').length

  return (
    <div>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:28, flexWrap:'wrap', gap:16 }}>
        <div>
          <h2 style={{ marginBottom:4 }}>Integrations</h2>
          <p>Connect CanHoa with your banking, accounting, communication, and legal tools</p>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <div style={{ padding:'8px 16px', background:'var(--accent-subtle)', borderRadius:10, fontSize:13, fontWeight:700, color:'var(--accent-primary)' }}>
            <CheckCircle size={14} style={{ verticalAlign:'middle', marginRight:5 }}/>{connectedCount} Active Integrations
          </div>
        </div>
      </div>

      {/* Category filter */}
      <div style={{ display:'flex', gap:8, marginBottom:24, flexWrap:'wrap' }}>
        {categories.map(cat=>(
          <button key={cat} onClick={()=>setFilter(cat)} className="btn btn-sm" style={{ background:filter===cat?'var(--accent-primary)':'var(--bg-secondary)', color:filter===cat?'white':'var(--text-muted)', border:'1px solid var(--border-color)', fontSize:12 }}>{cat}</button>
        ))}
      </div>

      {filtered.map(group=>(
        <div key={group.category} style={{ marginBottom:32 }}>
          <h3 style={{ fontSize:15, marginBottom:16, color:'var(--text-muted)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em' }}>{group.category}</h3>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))', gap:16 }}>
            {group.items.map(intg=>(
              <div key={intg.id} className="card" style={{ padding:20, borderTop:'3px solid '+(intg.status==='connected'?'var(--success)':intg.status==='coming_soon'?'var(--text-muted)':intg.color) }}>
                <div style={{ display:'flex', alignItems:'flex-start', gap:12, marginBottom:14 }}>
                  <div style={{ width:44, height:44, background:intg.color+'15', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>{intg.logo}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4, flexWrap:'wrap' }}>
                      <span style={{ fontWeight:700, fontSize:15 }}>{intg.name}</span>
                      {intg.status==='connected' && <span className="badge badge-green" style={{ fontSize:10 }}>✓ Connected</span>}
                      {intg.status==='coming_soon' && <span className="badge badge-gray" style={{ fontSize:10 }}>Coming Soon</span>}
                    </div>
                    <p style={{ fontSize:13, margin:0, lineHeight:1.5 }}>{intg.desc}</p>
                  </div>
                </div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:5, marginBottom:14 }}>
                  {intg.features.map(f=>(
                    <span key={f} style={{ fontSize:11, padding:'2px 8px', background:'var(--bg-secondary)', borderRadius:20, color:'var(--text-muted)', fontWeight:500 }}>{f}</span>
                  ))}
                </div>
                <div style={{ display:'flex', gap:8 }}>
                  <button
                    className={`btn btn-sm ${intg.status==='connected'?'btn-secondary':'btn-primary'}`}
                    style={{ flex:1, justifyContent:'center', ...(intg.status==='coming_soon'?{opacity:0.6}:{}) }}
                    onClick={()=>handleConnect(intg.id, intg.name, intg.status)}
                    disabled={connecting[intg.id]}
                  >
                    {connecting[intg.id] ? (
                      <span style={{ width:13,height:13,border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'white',borderRadius:'50%',display:'inline-block',animation:'spin 0.8s linear infinite' }}/>
                    ) : intg.status==='connected' ? (
                      <><XCircle size={13}/> Disconnect</>
                    ) : intg.status==='coming_soon' ? (
                      <><Zap size={13}/> Join Waitlist</>
                    ) : (
                      <><Plus size={13}/> Connect</>
                    )}
                  </button>
                  {intg.status==='connected' && (
                    <button className="btn btn-ghost btn-sm btn-icon" onClick={()=>addToast(intg.name+' settings opened','info')}><Settings size={14}/></button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* API Section */}
      <div className="card" style={{ background:'linear-gradient(135deg,var(--accent-primary),var(--accent-mid))', color:'white', padding:28, marginTop:8 }}>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
              <Lock size={20} color="rgba(255,255,255,0.8)"/>
              <h3 style={{ color:'white', margin:0 }}>CanHoa Open API</h3>
              <span style={{ padding:'2px 8px', background:'rgba(255,255,255,0.2)', borderRadius:20, fontSize:11, fontWeight:700 }}>Coming Q3 2026</span>
            </div>
            <p style={{ color:'rgba(255,255,255,0.75)', fontSize:14, margin:0 }}>Build custom integrations, mobile apps, and enterprise connections with our RESTful API. OAuth 2.0, webhooks, and full CRUD operations on all CanHoa data.</p>
          </div>
          <button className="btn btn-white btn-sm" onClick={()=>addToast('Added to API waitlist! You\'ll be notified at launch.','success')}>Join API Waitlist</button>
        </div>
      </div>
    </div>
  )
}
