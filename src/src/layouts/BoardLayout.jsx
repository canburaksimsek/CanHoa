import React, { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth, useTheme } from '../context/AppContext.jsx'
import { LayoutDashboard, BarChart3, Sun, Moon, Bell, LogOut, Home, Menu, ChevronDown, HelpCircle, Settings, Shield, ExternalLink } from 'lucide-react'
import { COMMUNITY } from '../data/mockData.js'

const NAV_ITEMS = [
  { to:'/board', icon:LayoutDashboard, label:'Board Dashboard', end:true },
  { to:'/board/reports', icon:BarChart3, label:'Financial Reports' },
]

export default function BoardLayout() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <div className="app-layout">
      {sidebarOpen && <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:99 }} onClick={()=>setSidebarOpen(false)}/>}

      <nav className={'sidebar ' + (sidebarOpen?'open':'')} style={{ zIndex:100 }}>
        <div style={{ padding:'20px 16px 16px', borderBottom:'1px solid var(--border-color)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:36, height:36, background:'var(--accent-primary)', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Shield size={18} color="white"/>
            </div>
            <div>
              <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:18, color:'var(--text-primary)' }}>
                Can<span style={{ color:'var(--accent-primary)' }}>Hoa</span>
              </div>
              <div style={{ fontSize:10, color:'var(--text-muted)', fontWeight:500 }}>Board of Directors</div>
            </div>
          </div>
        </div>

        <div style={{ padding:'12px 16px', margin:'12px 8px 4px', background:'var(--accent-subtle)', borderRadius:'var(--radius-md)', border:'1px solid var(--accent-primary)' }}>
          <div style={{ fontSize:11, fontWeight:700, color:'var(--accent-primary)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:4 }}>Community</div>
          <div style={{ fontSize:13, fontWeight:700, color:'var(--text-primary)', lineHeight:1.3 }}>{COMMUNITY.name}</div>
          <div style={{ fontSize:11, color:'var(--text-muted)', marginTop:2 }}>{COMMUNITY.totalUnits} units · {COMMUNITY.state}</div>
        </div>

        {/* Board member info */}
        <div style={{ padding:'10px 16px', margin:'8px 8px 4px', background:'var(--bg-hover)', borderRadius:'var(--radius-md)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div className="avatar avatar-sm" style={{ background:'var(--accent-primary)', color:'white' }}>{user?.avatar}</div>
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:'var(--text-primary)' }}>{user?.name}</div>
              <div style={{ fontSize:11, color:'var(--accent-primary)', fontWeight:600 }}>Board Member</div>
            </div>
          </div>
        </div>

        <div style={{ flex:1, padding:'8px 0' }}>
          <div className="nav-section-label">Board Portal</div>
          {NAV_ITEMS.map(item=>(
            <NavLink key={item.to} to={item.to} end={item.end} className={({isActive})=>`nav-item ${isActive?'active':''}`} onClick={()=>setSidebarOpen(false)}>
              <item.icon size={16}/>{item.label}
            </NavLink>
          ))}
          <div className="nav-section-label" style={{ marginTop:8 }}>Quick Links</div>
          <div className="nav-item" onClick={()=>navigate('/dashboard')}><ExternalLink size={16}/>Manager Portal</div>
        </div>

        <div style={{ padding:'12px 8px', borderTop:'1px solid var(--border-color)' }}>
          <div className="nav-item"><HelpCircle size={16}/>Help & Support</div>
          <div className="nav-item" onClick={handleLogout} style={{ color:'var(--danger)' }}><LogOut size={16}/>Sign Out</div>
        </div>
      </nav>

      <div className="main-content">
        <header className="top-bar">
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <button className="btn btn-ghost btn-icon" onClick={()=>setSidebarOpen(true)}><Menu size={20}/></button>
            <div style={{ padding:'4px 10px', background:'var(--accent-subtle)', borderRadius:'var(--radius-full)', fontSize:12, fontWeight:700, color:'var(--accent-primary)' }}>
              🏛 Board of Directors Portal
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <button className="btn btn-ghost btn-icon" onClick={toggleTheme}>{theme==='light'?<Moon size={18}/>:<Sun size={18}/>}</button>
            <button className="btn btn-ghost btn-icon"><Bell size={18}/></button>
            <div style={{ display:'flex', alignItems:'center', gap:8, padding:'6px 12px', background:'var(--bg-hover)', border:'1px solid var(--border-color)', borderRadius:'var(--radius-md)', cursor:'pointer' }} onClick={()=>setUserMenuOpen(!userMenuOpen)}>
              <div className="avatar avatar-sm">{user?.avatar}</div>
              <span style={{ fontSize:13, fontWeight:600, color:'var(--text-primary)' }}>{user?.name?.split(' ')[0]}</span>
              <ChevronDown size={14} color="var(--text-muted)"/>
            </div>
            {userMenuOpen && (
              <div className="dropdown-menu" style={{ position:'absolute', top:56, right:16 }}>
                <div style={{ padding:'12px 16px', borderBottom:'1px solid var(--border-color)' }}>
                  <div style={{ fontWeight:700, fontSize:14 }}>{user?.name}</div>
                  <div style={{ fontSize:12, color:'var(--text-muted)' }}>{user?.email}</div>
                  <span className="badge badge-purple" style={{ marginTop:4, display:'inline-flex' }}>Board Member</span>
                </div>
                <div className="dropdown-item" onClick={handleLogout}><LogOut size={15}/>Sign Out</div>
              </div>
            )}
          </div>
        </header>
        <main className="page-content"><Outlet/></main>
      </div>
    </div>
  )
}
