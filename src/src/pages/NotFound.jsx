import React from 'react'
import { Link } from 'react-router-dom'
import { Home, ArrowLeft, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg-primary)', padding:24 }}>
      <div style={{ textAlign:'center', maxWidth:480 }}>
        <div style={{ fontFamily:'var(--font-display)', fontSize:120, fontWeight:900, color:'var(--accent-primary)', lineHeight:1, marginBottom:0, opacity:0.15 }}>404</div>
        <div style={{ marginTop:-20, marginBottom:24 }}>
          <div style={{ width:72, height:72, background:'var(--accent-subtle)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
            <Home size={32} color="var(--accent-primary)"/>
          </div>
          <h2 style={{ marginBottom:12 }}>Page Not Found</h2>
          <p style={{ fontSize:16, marginBottom:28 }}>The page you're looking for doesn't exist or has been moved. Let's get you back to your community.</p>
        </div>
        <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
          <Link to="/" className="btn btn-primary"><Home size={16}/> Go Home</Link>
          <Link to="/login" className="btn btn-secondary"><ArrowLeft size={16}/> Sign In</Link>
        </div>
        <div style={{ marginTop:32, fontSize:13, color:'var(--text-muted)' }}>
          Need help? Contact us at <a href="mailto:support@canhoa.com">support@canhoa.com</a>
        </div>
      </div>
    </div>
  )
}
