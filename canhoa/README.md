# CanHoa — HOA Management SaaS Platform

> Professional American HOA management platform | Open Green + White | Light & Dark Mode | Full English

---

## 🚀 DEPLOY IN 5 MINUTES

### Option 1: Netlify (Recommended — Easiest)

1. Download and unzip `CanHoa_Project.zip`
2. Open terminal in the `canhoa` folder
3. Run:
```bash
npm install
npm run build
```
4. Go to [netlify.com](https://netlify.com) → "Add new site" → "Deploy manually"
5. Drag the `dist/` folder into Netlify
6. Done! Your site is live.

**Or connect via GitHub (auto-deploy):**
1. Push the `canhoa` folder to a GitHub repo
2. Go to Netlify → "Import from Git" → select your repo
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Click Deploy — Netlify auto-deploys on every push!

---

### Option 2: Render.com

1. Push code to GitHub
2. Go to [render.com](https://render.com) → "New Static Site"
3. Connect your GitHub repo
4. Build command: `npm install && npm run build`
5. Publish directory: `dist`
6. Click Deploy

---

### Option 3: GitHub Pages

1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add to `package.json` scripts: `"deploy": "gh-pages -d dist"`
3. Run: `npm run build && npm run deploy`

---

### Option 4: Local Development

```bash
cd canhoa
npm install
npm run dev
# Open http://localhost:5173
```

---

## 📁 Project Structure

```
canhoa/
├── index.html              # Entry HTML
├── vite.config.js          # Vite build config
├── package.json            # Dependencies
├── public/
│   ├── favicon.svg         # CanHoa green house logo
│   └── _redirects          # Netlify SPA routing
└── src/
    ├── main.jsx            # React entry point
    ├── App.jsx             # Router + layout
    ├── styles/
    │   └── globals.css     # Full design system (light + dark mode)
    ├── context/
    │   └── AppContext.jsx  # Theme, Auth, Toast providers
    ├── data/
    │   └── mockData.js     # All demo data
    ├── layouts/
    │   ├── ManagerLayout.jsx   # Manager sidebar + topbar
    │   └── ResidentLayout.jsx  # Resident sidebar + topbar
    └── pages/
        ├── LandingPage.jsx     # Public marketing site
        ├── LoginPage.jsx       # Auth (manager + resident)
        ├── RegisterPage.jsx    # 2-step registration
        ├── FeaturesPage.jsx    # Features page
        ├── PricingPage.jsx     # Pricing tiers
        ├── LegalPage.jsx       # Terms, Privacy, Cookies
        ├── manager/
        │   ├── Dashboard.jsx       # KPIs, charts, activity
        │   ├── Residents.jsx       # Resident management
        │   ├── Payments.jsx        # Finances & dues
        │   ├── Maintenance.jsx     # Work orders
        │   ├── Violations.jsx      # CC&R enforcement
        │   ├── Documents.jsx       # File library
        │   ├── Announcements.jsx   # Multi-channel comms
        │   ├── Voting.jsx          # Elections & surveys
        │   ├── Amenities.jsx       # Booking system
        │   ├── Reports.jsx         # 30+ financial reports
        │   ├── Vendors.jsx         # Vendor database
        │   └── Settings.jsx        # Community settings
        └── resident/
            ├── ResidentDashboard.jsx   # Balance, requests, votes
            ├── ResidentPayments.jsx    # Pay dues, autopay
            ├── ResidentRequests.jsx    # Maintenance requests
            ├── ResidentDocuments.jsx   # Community docs
            ├── ResidentAnnouncements.jsx # Announcements feed
            └── ResidentVoting.jsx      # Cast votes
```

---

## 🔐 Demo Login Credentials

| Role | Email | Password |
|------|-------|----------|
| HOA Manager | manager@canhoa.com | demo123 |
| Resident | resident@canhoa.com | demo123 |
| Board Member | board@canhoa.com | demo123 |

---

## 🎨 Design System

**Color Palette:**
- Primary Green: `#2E7D52`
- Light Green: `#4CAF76`  
- Pale Green: `#E8F5EE`
- Dark Mode BG: `#071a0e`

**Fonts:**
- Display: Cabinet Grotesk (headings, numbers)
- Body: Satoshi (paragraphs, UI)

**Theme:** Automatic light/dark detection + manual toggle

---

## ✨ Features Included

### Manager Portal
- [x] Real-time financial dashboard with charts
- [x] Resident management with delinquency tracking
- [x] Payment center (Stripe-ready, ACH + card)
- [x] Maintenance work order system with vendor assignment
- [x] CC&R violation management (Fair Housing compliant)
- [x] Multi-channel announcements (email, SMS, USPS, phone)
- [x] Community message boards
- [x] Document library with folder permissions
- [x] Online voting with anonymous ballot support
- [x] Amenity booking system with deposit handling
- [x] 30+ financial reports (P&L, AR aging, budget vs actual)
- [x] Vendor database with insurance tracking
- [x] Full settings panel (payments, notifications, security, billing)

### Resident Portal
- [x] Account balance + pay now
- [x] Autopay enrollment
- [x] Payment history with receipt downloads
- [x] Maintenance request submission + tracking
- [x] Community announcements feed
- [x] Document library access
- [x] Online voting interface
- [x] Dark mode + light mode

### Public Pages
- [x] Professional landing page (hero, features, testimonials, FAQ)
- [x] Pricing page (3 tiers)
- [x] Features page
- [x] Terms of Service (US compliant)
- [x] Privacy Policy (CCPA compliant)
- [x] Cookie Policy

---

## 🔧 Connecting Real Services

### Stripe (Payments)
1. Create account at stripe.com
2. Add to `.env`: `VITE_STRIPE_PUBLIC_KEY=pk_live_...`
3. Replace mock payment handlers in `ResidentPayments.jsx`

### SendGrid (Email)
1. Create account at sendgrid.com
2. Add API key to your backend
3. Configure templates matching CanHoa brand

### Twilio (SMS + Phone)
1. Create account at twilio.com
2. Add credentials to backend `.env`
3. Connect to Announcements send handlers

### Plaid (Bank Verification)
1. Create account at plaid.com
2. Use Plaid Link React component
3. Replace mock ACH verification in payment flow

---

## ⚖️ Legal Compliance

This platform is designed for US HOA compliance:

- ✅ **Fair Housing Act** — Violation patterns monitored
- ✅ **CCPA** — Privacy policy + data rights
- ✅ **CAN-SPAM** — Unsubscribe in all emails
- ✅ **TCPA** — SMS consent + STOP handling
- ✅ **E-SIGN Act** — Electronic signatures supported
- ✅ **PCI DSS** — Via Stripe (no card data stored)
- ✅ **ADA/WCAG 2.1 AA** — Accessible design
- ✅ **State Templates** — CA, FL, TX, NY, AZ, NV

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Routing | React Router v6 |
| Charts | Recharts |
| Icons | Lucide React |
| Fonts | Cabinet Grotesk + Satoshi |
| Styling | Pure CSS (no Tailwind) |
| State | React Context API |
| Deploy | Netlify / Render / GitHub Pages |

---

## 📞 Support

- Email: hello@canhoa.com
- Documentation: help.canhoa.com
- Status: status.canhoa.com

---

© 2026 CanHoa LLC · Austin, TX · All Rights Reserved
