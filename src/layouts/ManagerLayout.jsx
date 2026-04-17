import React, { useState, useEffect } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth, useTheme } from '../context/AppContext.jsx'
import {
  LayoutDashboard, Users, CreditCard, Wrench, AlertTriangle,
  FileText, Megaphone, Vote, Dumbbell, BarChart3, Settings,
  Truck, Sun, Moon, Bell, Menu, X, LogOut, ChevronDown,
  Home, Shield, HelpCircle, ExternalLink, Search, Zap
} from 'lucide-react'
import { COMMUNITY, FINANCIAL_SUMMARY, ACTIVITY_FEED } from '../data/mockData.js'

const NAV_ITEMS = [
  { label:'Overview', items:[
    { to:'/dashboard', icon:LayoutDashboard, label:'Dashboard', end:true },
    { to:'/dashboard/residents', icon:Users, label:'Residents' },
    { to:'/dashboard/payments', icon:CreditCard, label:'Payments & Finance' },
  ]},
  { label:'Operations', items:[
    { to:'/dashboard/maintenance', icon:Wrench, label:'Maintenance' },
    { to:'/dashboard/violations', icon:AlertTriangle, label:'Violations' },
    { to:'/dashboard/announcements', icon:Megaphone, label:'Announcements' },
    { to:'/dashboard/vendors', icon:Truck, label:'Vendors' },
  ]},
  { label:'Community', items:[
    { to:'/dashboard/voting', icon:Vote, label:'Voting & Surveys' },
    { to:'/dashboard/amenities', icon:Dumbbell, label:'Amenities' },
    { to:'/dashboard/documents', icon:FileText, label:'Documents' },
    { to:'/dashboard/website', icon:Home, label:'HOA Website Builder' },
  ]},
  { label:'Administration', items:[
    { to:'/dashboard/reports', icon:BarChart3, label:'Reports' },
    { to:'/dashboard/integrations', icon:Zap, label:'Integrations' },
    { to:'/dashboard/settings', icon:Settings, label:'Settings' },
  ]},
]

export default function ManagerLayout() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [globalSearch, setGlobalSearch] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/') }

  const notifications = [
    { id:1, text:'Robert Johnson (9A) autopay failed — NSF', time:'1 hour ago', unread:true, type:'alert' },
    { id:2, text:'New maintenance request from Unit 7C — HVAC', time:'2 hours ago', unread:true, type:'request' },
    { id:3, text:'Pool Hours vote is 78% complete — quorum met', time:'3 hours ago', unread:false, type:'info' },
    { id:4, text:'TechElectric Pro contract expires in 74 days', time:'1 day ago', unread:false, type:'warning' },
    { id:5, text:'Unit 3B violation escalated to Level 2', time:'2 days ago', unread:false, type:'violation' },
  ]
  const unreadCount = notifications.filter(n=>n.unread).length

  // Close menus on route change
  useEffect(() => {
    setSidebarOpen(false)
    setUserMenuOpen(false)
    setNotifOpen(false)
  }, [location.pathname])

  return (
    <div className="app-layout">
      {sidebarOpen && <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',zIndex:99 }} onClick={()=>setSidebarOpen(false)}/>}

      {/* ── SIDEBAR ── */}
      <nav className={'sidebar ' + (sidebarOpen?'open':'')} style={{ zIndex:100 }}>
        {/* Logo */}
        <div style={{ padding:'20px 16px 16px', borderBottom:'1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:36, height:36, background:'rgba(255,255,255,0.15)', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', border:'1px solid rgba(255,255,255,0.2)' }}>
                <Home size={18} color="white"/>
              </div>
              <div>
                <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:18, color:'white' }}>
                  Can<span style={{ color:'#e8c060' }}>Hoa</span>
                </div>
                <div style={{ fontSize:10, color:'rgba(255,255,255,0.45)', fontWeight:500, marginTop:-2 }}>Manager Portal</div>
              </div>
            </div>
          </div>
        </div>

        {/* Community Info */}
        <div style={{ padding:'10px 16px', margin:'12px 8px 4px', background:'rgba(255,255,255,0.08)', borderRadius:'var(--radius-md)', border:'1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:4 }}>Community</div>
          <div style={{ fontSize:13, fontWeight:700, color:'white', lineHeight:1.3 }}>{COMMUNITY.name}</div>
          <div style={{ fontSize:11, color:'rgba(255,255,255,0.5)', marginTop:2 }}>{COMMUNITY.totalUnits} units · {COMMUNITY.state}</div>
          <div style={{ marginTop:8, display:'flex', gap:6 }}>
            <span style={{ fontSize:10, padding:'2px 8px', background:'rgba(232,192,96,0.2)', color:'#e8c060', borderRadius:20, fontWeight:700, border:'1px solid rgba(232,192,96,0.3)' }}>Growth Plan</span>
            <span style={{ fontSize:10, padding:'2px 8px', background:'rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.7)', borderRadius:20, fontWeight:600 }}>v4.0</span>
          </div>
        </div>

        {/* Nav */}
        <div style={{ flex:1, overflowY:'auto', padding:'4px 0' }}>
          {NAV_ITEMS.map(section=>(
            <div key={section.label}>
              <div className="nav-section-label">{section.label}</div>
              {section.items.map(item=>(
                <NavLink key={item.to} to={item.to} end={item.end} className={({isActive})=>'nav-item' + (isActive?' active':'')}>
                  <item.icon size={16}/>{item.label}
                </NavLink>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div style={{ padding:'12px 8px', borderTop:'1px solid rgba(255,255,255,0.1)' }}>
          <NavLink to="/board" className="nav-item"><Shield size={16}/>Board Portal</NavLink>
          <div className="nav-item" onClick={()=>window.open('/','_blank')}><ExternalLink size={16}/>Public Site</div>
          <div className="nav-item" onClick={handleLogout} style={{ color:'rgba(255,100,100,0.9)' }}><LogOut size={16}/>Sign Out</div>
        </div>
      </nav>

      {/* ── MAIN ── */}
      <div className="main-content">
        <header className="top-bar">
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <button className="btn btn-ghost btn-icon" onClick={()=>setSidebarOpen(true)}><Menu size={20}/></button>
            <div style={{ padding:'4px 12px', background:'var(--accent-subtle)', borderRadius:'var(--radius-full)', fontSize:12, fontWeight:700, color:'var(--accent-primary)', display:'flex', alignItems:'center', gap:5 }}>
              <span>🏢</span> {user?.plan||'Growth'} Plan
            </div>
          </div>

          {/* Global Search */}
          <div style={{ flex:1, maxWidth:400, margin:'0 20px' }}>
            <div style={{ position:'relative', display:'flex', alignItems:'center' }}>
              <Search size={15} style={{ position:'absolute', left:10, color:'var(--text-muted)', pointerEvents:'none' }}/>
              <input
                className="form-input"
                placeholder="Search residents, units, violations..."
                style={{ paddingLeft:34, fontSize:13, height:36 }}
                value={globalSearch}
                onChange={e=>setGlobalSearch(e.target.value)}
                onFocus={()=>setSearchOpen(true)}
                onBlur={()=>setTimeout(()=>setSearchOpen(false),200)}
              />
              {searchOpen && globalSearch && (
                <div style={{ position:'absolute', top:'calc(100% + 4px)', left:0, right:0, background:'var(--bg-card)', border:'1px solid var(--border-color)', borderRadius:12, boxShadow:'var(--shadow-xl)', zIndex:200, overflow:'hidden' }}>
                  {['Residents','Units','Violations','Documents','Payments'].map(cat=>(
                    <div key={cat} style={{ padding:'8px 14px', fontSize:12, color:'var(--text-muted)', cursor:'pointer', display:'flex', alignItems:'center', gap:8 }}
                      onMouseDown={()=>{ setGlobalSearch(''); setSearchOpen(false) }}>
                      <Search size={12}/> Search "{globalSearch}" in {cat}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <button className="btn btn-ghost btn-icon" onClick={toggleTheme} title="Toggle theme">
              {theme==='light'?<Moon size={18}/>:<Sun size={18}/>}
            </button>

            {/* Notifications */}
            <div className="dropdown">
              <button className="btn btn-ghost btn-icon" style={{ position:'relative' }} onClick={()=>{ setNotifOpen(!notifOpen); setUserMenuOpen(false) }}>
                <Bell size={18}/>
                {unreadCount>0 && <span style={{ position:'absolute', top:6, right:6, width:8, height:8, background:'var(--danger)', borderRadius:'50%', border:'2px solid var(--bg-card)' }}/>}
              </button>
              {notifOpen && (
                <div className="dropdown-menu" style={{ width:340 }}>
                  <div style={{ padding:'14px 16px', borderBottom:'1px solid var(--border-color)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <span style={{ fontWeight:700, fontSize:14 }}>Notifications</span>
                    {unreadCount>0 && <span className="badge badge-navy">{unreadCount} new</span>}
                  </div>
                  {notifications.map(n=>(
                    <div key={n.id} className="dropdown-item" style={{ borderBottom:'1px solid var(--border-color)', padding:'12px 16px', background:n.unread?'var(--bg-hover)':'transparent' }}>
                      <div>
                        <div style={{ fontSize:13, fontWeight:n.unread?600:400 }}>{n.text}</div>
                        <div style={{ fontSize:11, color:'var(--text-muted)', marginTop:2 }}>{n.time}</div>
                      </div>
                    </div>
                  ))}
                  <div style={{ padding:'10px 16px', textAlign:'center' }}>
                    <span style={{ fontSize:13, color:'var(--accent-primary)', fontWeight:600, cursor:'pointer' }}>View all notifications</span>
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="dropdown">
              <button onClick={()=>{ setUserMenuOpen(!userMenuOpen); setNotifOpen(false) }}
                style={{ display:'flex', alignItems:'center', gap:8, padding:'6px 12px', background:'var(--bg-hover)', border:'1px solid var(--border-color)', borderRadius:'var(--radius-md)', cursor:'pointer' }}>
                <div className="avatar avatar-sm" style={{ background:'var(--accent-primary)', color:'white' }}>{user?.avatar}</div>
                <span style={{ fontSize:13, fontWeight:600, color:'var(--text-primary)' }}>{user?.name?.split(' ')[0]}</span>
                <ChevronDown size={14} color="var(--text-muted)"/>
              </button>
              {userMenuOpen && (
                <div className="dropdown-menu">
                  <div style={{ padding:'12px 16px', borderBottom:'1px solid var(--border-color)' }}>
                    <div style={{ fontWeight:700, fontSize:14 }}>{user?.name}</div>
                    <div style={{ fontSize:12, color:'var(--text-muted)' }}>{user?.email}</div>
                    <span className="badge badge-navy" style={{ marginTop:4, display:'inline-flex' }}>HOA Manager</span>
                  </div>
                  <div className="dropdown-item" onClick={()=>{ navigate('/dashboard/settings'); setUserMenuOpen(false) }}><Settings size={15}/>Settings</div>
                  <div className="dropdown-item" onClick={()=>navigate('/board')}><Shield size={15}/>Board Portal</div>
                  <div className="dropdown-item"><HelpCircle size={15}/>Help Center</div>
                  <div className="dropdown-divider"/>
                  <div className="dropdown-item danger" onClick={handleLogout}><LogOut size={15}/>Sign Out</div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="page-content"><Outlet/></main>
      </div>
    </div>
  )
}
