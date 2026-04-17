import React, { useState } from 'react'
import { useToast } from '../../context/AppContext.jsx'
import { Globe, Edit, Eye, Plus, Save, Palette, Layout, MessageSquare, CheckCircle, ExternalLink, Bot, Image, FileText, Calendar, Phone } from 'lucide-react'
import { COMMUNITY } from '../../data/mockData.js'

const THEMES = [
  { id:'navy', name:'Deep Sapphire', primary:'#1A365D', accent:'#2b52a0', preview:'linear-gradient(135deg,#1A365D,#2b52a0)' },
  { id:'green', name:'Emerald HOA', primary:'#166534', accent:'#16a34a', preview:'linear-gradient(135deg,#166534,#16a34a)' },
  { id:'slate', name:'Professional Gray', primary:'#334155', accent:'#64748b', preview:'linear-gradient(135deg,#334155,#64748b)' },
  { id:'burgundy', name:'Classic Burgundy', primary:'#7f1d1d', accent:'#991b1b', preview:'linear-gradient(135deg,#7f1d1d,#991b1b)' },
]

const SECTIONS = [
  { id:'hero', label:'Hero Banner', icon:'🏠', enabled:true, content:'Welcome to '+COMMUNITY.name },
  { id:'about', label:'About Our Community', icon:'ℹ️', enabled:true, content:'A thriving community of '+COMMUNITY.totalUnits+' homes in '+COMMUNITY.city+', '+COMMUNITY.state },
  { id:'announcements', label:'Latest Announcements', icon:'📢', enabled:true, content:'Auto-synced from CanHoa announcements' },
  { id:'amenities', label:'Amenities', icon:'🏊', enabled:true, content:'Pool, Gym, Clubhouse, Tennis' },
  { id:'documents', label:'Community Documents', icon:'📄', enabled:true, content:'CC&Rs, Bylaws, Meeting Minutes' },
  { id:'events', label:'Events Calendar', icon:'📅', enabled:false, content:'Community events and meetings' },
  { id:'board', label:'Board of Directors', icon:'👔', enabled:true, content:'Meet your board members' },
  { id:'contact', label:'Contact & Hours', icon:'📞', enabled:true, content:'management@oakwoodhoa.com · (512) 555-0100' },
  { id:'faq', label:'FAQ / HOA Rules', icon:'❓', enabled:false, content:'Frequently asked questions' },
  { id:'forum', label:'Community Forum', icon:'💬', enabled:false, content:'Resident discussions (moderated)' },
]

export default function WebsiteBuilder() {
  const { addToast } = useToast()
  const [tab, setTab] = useState('design')
  const [selectedTheme, setSelectedTheme] = useState('navy')
  const [sections, setSections] = useState(SECTIONS)
  const [customDomain, setCustomDomain] = useState('')
  const [chatbotEnabled, setChatbotEnabled] = useState(true)
  const [chatbotName, setChatbotName] = useState('Canna')
  const [heroTitle, setHeroTitle] = useState('Welcome to '+COMMUNITY.name)
  const [heroSubtitle, setHeroSubtitle] = useState('Your premier residential community in '+COMMUNITY.city+', '+COMMUNITY.state)
  const [showPreview, setShowPreview] = useState(false)
  const [published, setPublished] = useState(false)

  const siteUrl = customDomain || COMMUNITY.website || 'oakwoodheights.canhoa.app'
  const theme = THEMES.find(t=>t.id===selectedTheme)

  const toggleSection = (id) => setSections(ss=>ss.map(s=>s.id===id?{...s,enabled:!s.enabled}:s))

  const handlePublish = () => {
    setPublished(true)
    addToast('🌐 HOA website published at '+siteUrl+' — all residents notified!', 'success')
  }

  return (
    <div>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:28, flexWrap:'wrap', gap:16 }}>
        <div>
          <h2 style={{ marginBottom:4 }}>HOA Website Builder</h2>
          <p>Build your community's public website — no code required. Includes AI chatbot, document library, and resident portal link.</p>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <button className="btn btn-secondary btn-sm" onClick={()=>setShowPreview(!showPreview)}><Eye size={14}/> {showPreview?'Edit Mode':'Preview'}</button>
          <button className="btn btn-secondary btn-sm" onClick={()=>window.open('https://'+siteUrl,'_blank')}><ExternalLink size={14}/> Open Site</button>
          <button className="btn btn-primary btn-sm" onClick={handlePublish}><Globe size={14}/> {published?'Re-Publish':'Publish Site'}</button>
        </div>
      </div>

      {/* Status Banner */}
      <div style={{ padding:'12px 18px', background:published?'#f0fdf4':'#fffbeb', border:'1px solid '+(published?'#bbf7d0':'#fde68a'), borderRadius:12, marginBottom:24, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:10, height:10, borderRadius:'50%', background:published?'#16a34a':'#d97706' }}/>
          <span style={{ fontWeight:700, fontSize:14 }}>{published?'Site is Live':'Site is in Draft'}</span>
          <span style={{ fontSize:13, color:'var(--text-muted)' }}>→ <a href={'https://'+siteUrl} target="_blank" rel="noreferrer" style={{ color:'var(--accent-primary)' }}>{siteUrl}</a></span>
        </div>
        <div style={{ fontSize:12, color:'var(--text-muted)' }}>
          {published?'Last published: Today · Auto-updates with announcements':'Save changes and publish to go live'}
        </div>
      </div>

      <div className="tabs">
        {[['design','🎨 Design & Theme'],['sections','📐 Page Sections'],['chatbot','🤖 AI Chatbot'],['domain','🌐 Domain & SEO'],['florida','⚖️ Florida Compliance']].map(([id,label])=>(
          <div key={id} className={`tab ${tab===id?'active':''}`} onClick={()=>setTab(id)}>{label}</div>
        ))}
      </div>

      {/* DESIGN TAB */}
      {tab==='design' && (
        <div className="grid-2" style={{ gap:24 }}>
          <div>
            <div className="card" style={{ marginBottom:20 }}>
              <div className="card-header"><div className="card-title">Color Theme</div></div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                {THEMES.map(t=>(
                  <div key={t.id} onClick={()=>setSelectedTheme(t.id)} style={{ padding:'14px', border:'2px solid '+(selectedTheme===t.id?t.primary:'var(--border-color)'), borderRadius:12, cursor:'pointer', transition:'var(--transition)' }}>
                    <div style={{ height:40, background:t.preview, borderRadius:8, marginBottom:10 }}/>
                    <div style={{ fontWeight:700, fontSize:13 }}>{t.name}</div>
                    <div style={{ fontSize:11, color:'var(--text-muted)', fontFamily:'monospace', marginTop:2 }}>{t.primary}</div>
                    {selectedTheme===t.id && <div style={{ marginTop:6 }}><CheckCircle size={14} color={t.primary}/></div>}
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="card-header"><div className="card-title">Hero Section</div></div>
              <div className="form-group">
                <label className="form-label">Main Headline</label>
                <input className="form-input" value={heroTitle} onChange={e=>setHeroTitle(e.target.value)}/>
              </div>
              <div className="form-group">
                <label className="form-label">Subheadline</label>
                <textarea className="form-textarea" style={{ minHeight:70 }} value={heroSubtitle} onChange={e=>setHeroSubtitle(e.target.value)}/>
              </div>
              <div className="form-group">
                <label className="form-label">Hero Background</label>
                <div style={{ display:'flex', gap:8 }}>
                  {['Community Photo','Gradient','Illustration'].map(opt=>(
                    <button key={opt} className="btn btn-secondary btn-sm" onClick={()=>addToast(opt+' background selected','success')}>{opt}</button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Call-to-Action Button</label>
                <input className="form-input" defaultValue="Pay Dues · Report Issue · Book Amenity"/>
              </div>
              <button className="btn btn-primary" onClick={()=>addToast('Design saved!','success')}><Save size={15}/> Save Design</button>
            </div>
          </div>

          {/* Live Preview */}
          <div>
            <div className="card" style={{ overflow:'hidden', padding:0 }}>
              <div style={{ padding:'12px 16px', background:'var(--bg-secondary)', borderBottom:'1px solid var(--border-color)', display:'flex', gap:6, alignItems:'center' }}>
                <div style={{ width:10, height:10, borderRadius:'50%', background:'#ff5f57' }}/>
                <div style={{ width:10, height:10, borderRadius:'50%', background:'#febc2e' }}/>
                <div style={{ width:10, height:10, borderRadius:'50%', background:'#28c840' }}/>
                <div style={{ flex:1, margin:'0 10px', background:'white', borderRadius:6, padding:'3px 10px', fontSize:11, color:'var(--text-muted)', textAlign:'center' }}>{siteUrl}</div>
              </div>
              {/* Mini preview */}
              <div style={{ background:theme?.preview||'var(--accent-primary)', padding:'24px 20px', textAlign:'center', color:'white' }}>
                <div style={{ fontSize:16, fontFamily:'var(--font-display)', fontWeight:800, marginBottom:6 }}>{heroTitle}</div>
                <div style={{ fontSize:12, opacity:0.85, marginBottom:14 }}>{heroSubtitle}</div>
                <div style={{ display:'flex', gap:8, justifyContent:'center' }}>
                  <div style={{ padding:'6px 14px', background:'white', color:theme?.primary||'#1A365D', borderRadius:8, fontSize:11, fontWeight:700 }}>Resident Portal</div>
                  <div style={{ padding:'6px 14px', background:'rgba(255,255,255,0.2)', color:'white', borderRadius:8, fontSize:11, fontWeight:600, border:'1px solid rgba(255,255,255,0.3)' }}>Learn More</div>
                </div>
              </div>
              {/* Preview sections */}
              {sections.filter(s=>s.enabled).slice(0,4).map(s=>(
                <div key={s.id} style={{ padding:'12px 20px', borderBottom:'1px solid var(--border-color)', display:'flex', alignItems:'center', gap:10 }}>
                  <span style={{ fontSize:16 }}>{s.icon}</span>
                  <div>
                    <div style={{ fontWeight:700, fontSize:13 }}>{s.label}</div>
                    <div style={{ fontSize:11, color:'var(--text-muted)' }}>{s.content}</div>
                  </div>
                </div>
              ))}
              <div style={{ padding:'10px 20px', textAlign:'center', fontSize:11, color:'var(--text-muted)' }}>Powered by CanHoa · {siteUrl}</div>
            </div>
          </div>
        </div>
      )}

      {/* SECTIONS TAB */}
      {tab==='sections' && (
        <div>
          <p style={{ marginBottom:20, fontSize:14 }}>Toggle which sections appear on your public HOA website. Drag to reorder (coming soon).</p>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {sections.map(section=>(
              <div key={section.id} style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 18px', background:'var(--bg-card)', border:'1px solid '+(section.enabled?'var(--accent-primary)':'var(--border-color)'), borderRadius:12 }}>
                <span style={{ fontSize:20 }}>{section.icon}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, fontSize:14 }}>{section.label}</div>
                  <div style={{ fontSize:12, color:'var(--text-muted)' }}>{section.content}</div>
                </div>
                <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                  <button className="btn btn-ghost btn-sm btn-icon" onClick={()=>addToast('Edit section opened for '+section.label,'info')}><Edit size={14}/></button>
                  <button className={`toggle ${section.enabled?'on':''}`} onClick={()=>toggleSection(section.id)}/>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop:16, padding:'12px 16px', background:'var(--bg-secondary)', borderRadius:10, fontSize:13 }}>
            <strong>Florida HB 1203 Compliance:</strong> Florida HOAs with 100+ units must maintain a website with: current bylaws, rules, board meeting notices, budgets, and financial reports. CanHoa auto-publishes required documents to your site. <span style={{ color:'var(--accent-primary)', fontWeight:700 }}>✓ Compliant</span>
          </div>
        </div>
      )}

      {/* CHATBOT TAB */}
      {tab==='chatbot' && (
        <div className="grid-2" style={{ gap:24 }}>
          <div>
            <div className="card" style={{ marginBottom:20 }}>
              <div className="card-header">
                <div className="card-title">AI Chatbot Settings</div>
                <div className="ai-badge">✦ AI Powered</div>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20, padding:'14px 16px', background:chatbotEnabled?'var(--accent-subtle)':'var(--bg-secondary)', borderRadius:10 }}>
                <div>
                  <div style={{ fontWeight:700, fontSize:14 }}>Enable AI Chatbot on Website</div>
                  <div style={{ fontSize:13, color:'var(--text-muted)' }}>Answers resident questions 24/7 based on your HOA documents</div>
                </div>
                <button className={`toggle ${chatbotEnabled?'on':''}`} onClick={()=>setChatbotEnabled(!chatbotEnabled)}/>
              </div>
              {chatbotEnabled && (
                <>
                  <div className="form-group">
                    <label className="form-label">Chatbot Name</label>
                    <input className="form-input" value={chatbotName} onChange={e=>setChatbotName(e.target.value)} placeholder="e.g. Canna, Oak, Aria"/>
                    <div className="form-helper">This name appears in the chat bubble on your HOA website</div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Welcome Message</label>
                    <textarea className="form-textarea" style={{ minHeight:70 }} defaultValue={'Hi! I\'m '+chatbotName+', the '+COMMUNITY.name+' AI assistant. Ask me anything about HOA rules, dues, amenities, or community events!'}/>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Knowledge Sources (auto-synced)</label>
                    <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                      {['CC&Rs and Bylaws','Rules & Regulations 2026','FAQ Document','Pool Rules','Pet Policy','Parking Policy'].map(doc=>(
                        <div key={doc} style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 12px', background:'var(--bg-secondary)', borderRadius:8 }}>
                          <CheckCircle size={14} color="var(--success)"/>
                          <span style={{ fontSize:13 }}>{doc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Escalation — When chatbot can't answer:</label>
                    <select className="form-select">
                      <option>Show manager email and phone</option>
                      <option>Submit a support ticket automatically</option>
                      <option>Show office hours and contact info</option>
                    </select>
                  </div>
                  <button className="btn btn-primary" onClick={()=>addToast(chatbotName+' AI chatbot settings saved!','success')}><Save size={15}/> Save Chatbot Settings</button>
                </>
              )}
            </div>
          </div>

          {/* Chatbot Preview */}
          <div>
            <div style={{ fontWeight:700, fontSize:14, marginBottom:12 }}>Chatbot Preview</div>
            <div style={{ border:'1px solid var(--border-color)', borderRadius:16, overflow:'hidden', boxShadow:'var(--shadow-lg)' }}>
              <div style={{ padding:'12px 16px', background:'var(--accent-primary)', color:'white', display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:32, height:32, borderRadius:'50%', background:'rgba(255,255,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>🤖</div>
                <div>
                  <div style={{ fontWeight:700, fontSize:14 }}>{chatbotName}</div>
                  <div style={{ fontSize:11, opacity:0.8 }}>{COMMUNITY.name} AI Assistant · Online 24/7</div>
                </div>
              </div>
              <div style={{ padding:16, minHeight:200, background:'var(--bg-secondary)' }}>
                <div style={{ background:'var(--accent-primary)', color:'white', padding:'10px 14px', borderRadius:'18px 18px 18px 4px', fontSize:13, maxWidth:'80%', marginBottom:12 }}>
                  Hi! I'm {chatbotName}. Ask me anything about {COMMUNITY.name} — rules, dues, amenities, or events!
                </div>
                <div style={{ background:'white', border:'1px solid var(--border-color)', padding:'10px 14px', borderRadius:'18px 18px 4px 18px', fontSize:13, maxWidth:'80%', marginLeft:'auto', marginBottom:12 }}>
                  When is the pool open?
                </div>
                <div style={{ background:'var(--accent-primary)', color:'white', padding:'10px 14px', borderRadius:'18px 18px 18px 4px', fontSize:13, maxWidth:'85%' }}>
                  The community pool is open daily from 8 AM to 10 PM (extended to 11 PM on weekends Jun-Aug). Per CC&Rs Section 8.2, guests must be accompanied by a resident at all times. Need to book the pool for an event?
                </div>
              </div>
              <div style={{ padding:'10px 14px', background:'white', borderTop:'1px solid var(--border-color)', display:'flex', gap:8 }}>
                <input style={{ flex:1, border:'1px solid var(--border-color)', borderRadius:20, padding:'8px 14px', fontSize:13, outline:'none' }} placeholder="Ask a question..."/>
                <button style={{ background:'var(--accent-primary)', color:'white', border:'none', borderRadius:'50%', width:36, height:36, cursor:'pointer' }}>→</button>
              </div>
            </div>
            <div style={{ marginTop:12, padding:'10px 14px', background:'var(--bg-secondary)', borderRadius:10, fontSize:12, color:'var(--text-muted)' }}>
              Powered by CanHoa AI · Trained on your community documents · CCPA compliant · Escalates to manager when needed
            </div>
          </div>
        </div>
      )}

      {/* DOMAIN TAB */}
      {tab==='domain' && (
        <div style={{ maxWidth:640 }}>
          <div className="card" style={{ marginBottom:20 }}>
            <div className="card-header"><div className="card-title">Custom Domain</div></div>
            <div style={{ padding:'12px 16px', background:'var(--accent-subtle)', borderRadius:10, marginBottom:20, fontSize:13 }}>
              Your free CanHoa domain: <strong style={{ color:'var(--accent-primary)' }}>https://{COMMUNITY.website}</strong>
              {' '}<CheckCircle size={14} color="var(--success)" style={{ verticalAlign:'middle' }}/> Active
            </div>
            <div className="form-group">
              <label className="form-label">Connect Your Own Domain (optional)</label>
              <div style={{ display:'flex', gap:10 }}>
                <input className="form-input" placeholder="e.g. oakwoodheights.com" value={customDomain} onChange={e=>setCustomDomain(e.target.value)}/>
                <button className="btn btn-primary" onClick={()=>addToast('Domain verification email sent. Add CNAME record: canhoa.app','info')}>Connect</button>
              </div>
              <div className="form-helper">Add a CNAME record pointing to canhoa.app at your DNS provider. Free SSL included.</div>
            </div>
          </div>

          <div className="card" style={{ marginBottom:20 }}>
            <div className="card-header"><div className="card-title">SEO Settings</div></div>
            <div className="form-group"><label className="form-label">Site Title</label><input className="form-input" defaultValue={COMMUNITY.name+' — Official HOA Website'}/></div>
            <div className="form-group"><label className="form-label">Meta Description</label><textarea className="form-textarea" style={{ minHeight:70 }} defaultValue={'Official website of '+COMMUNITY.name+' in '+COMMUNITY.city+', '+COMMUNITY.state+'. Pay dues, view documents, and connect with your community.'}/></div>
            <div className="form-group"><label className="form-label">Keywords</label><input className="form-input" defaultValue={'HOA, '+COMMUNITY.name+', '+COMMUNITY.city+', homeowners association, community'}/></div>
            <button className="btn btn-primary" onClick={()=>addToast('SEO settings saved!','success')}><Save size={15}/> Save SEO</button>
          </div>

          <div className="card">
            <div className="card-header"><div className="card-title">Analytics</div></div>
            <div className="form-group"><label className="form-label">Google Analytics ID</label><input className="form-input" placeholder="G-XXXXXXXXXX"/></div>
            <div className="form-group"><label className="form-label">Google Tag Manager</label><input className="form-input" placeholder="GTM-XXXXXXX"/></div>
            <button className="btn btn-primary" onClick={()=>addToast('Analytics connected!','success')}><Save size={15}/> Save Analytics</button>
          </div>
        </div>
      )}

      {/* FLORIDA COMPLIANCE TAB */}
      {tab==='florida' && (
        <div>
          <div style={{ padding:'16px 20px', background:'#eff6ff', border:'1px solid #bfdbfe', borderRadius:12, marginBottom:24 }}>
            <div style={{ fontWeight:700, fontSize:15, marginBottom:6 }}>Florida HB 1203 (Effective 2025) — HOA Website Requirements</div>
            <p style={{ fontSize:14, margin:0 }}>Florida HOAs with 100+ units must maintain a website with a password-protected section for residents. CanHoa auto-generates all required pages.</p>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {[
              { req:'Current bylaws and articles of incorporation', status:'✓', note:'Auto-published from Documents' },
              { req:'Current rules and regulations', status:'✓', note:'Auto-published from Documents' },
              { req:'Notice of upcoming board meetings (48hr notice)', status:'✓', note:'Auto-published from Announcements' },
              { req:'Meeting agendas', status:'✓', note:'Auto-published from Voting module' },
              { req:'Board meeting minutes (within 7 days)', status:'✓', note:'Auto-published after upload' },
              { req:'Current annual budget', status:'✓', note:'Auto-published from Reports' },
              { req:'Financial report (quarterly)', status:'✓', note:'Auto-generated and published' },
              { req:'List of current board members and officers', status:'✓', note:'Auto-published from Board Portal' },
              { req:'Contracts with vendors ($5,000+)', status:'⚠', note:'Upload required manually' },
              { req:'Password-protected resident portal', status:'✓', note:'CanHoa resident login handles this' },
              { req:'HOA website accessible to all residents', status:'✓', note:'WCAG 2.1 AA compliant design' },
            ].map((item,i)=>(
              <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px', background:'var(--bg-card)', border:'1px solid var(--border-color)', borderRadius:10 }}>
                <span style={{ fontSize:16, color:item.status==='✓'?'var(--success)':'var(--warning)', fontWeight:700 }}>{item.status}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:600, fontSize:13 }}>{item.req}</div>
                  <div style={{ fontSize:12, color:'var(--text-muted)' }}>{item.note}</div>
                </div>
                <span className={`badge ${item.status==='✓'?'badge-green':'badge-yellow'}`}>{item.status==='✓'?'Compliant':'Action Needed'}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop:16, display:'flex', gap:10 }}>
            <button className="btn btn-primary" onClick={()=>addToast('Compliance report downloaded!','success')}>Download Compliance Report PDF</button>
            <button className="btn btn-secondary" onClick={()=>addToast('Compliance check complete — 10/11 requirements met','success')}>Run Compliance Check</button>
          </div>
        </div>
      )}
    </div>
  )
}
