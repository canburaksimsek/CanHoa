# CanHOA — Vercel Deployment (ÖNEMLİ OKU)

## ⚠️ DİKKAT — Önceki hataların sebebi

Eğer GitHub'da React/.jsx dosyaları varsa **SİL**. Bu proje **saf HTML** — build gerektirmez.

GitHub repo'n şu anda `.jsx`, `package.json`, `vite.config.js` içeriyorsa Vercel React projesi sanıp derlemeye çalışıyor ve hata veriyor.

---

## ✅ Doğru Deployment — 2 Yol

### YOL 1: En Kolay — ZIP sürükle bırak (önerilen)

1. **Vercel GitHub entegrasyonunu yapmayın** bu aşamada
2. https://vercel.com/new → scroll down → **"Import Third-Party Git Repository"** değil
3. Onun yerine: https://app.netlify.com/drop ya da Vercel CLI kullan
4. Ya da: GitHub repo'yu sıfırla, **sadece** bu 5 dosyayı yükle:
   - `index.html`
   - `app.html`
   - `privacy.html`
   - `terms.html`
   - `vercel.json`

### YOL 2: GitHub'ı temizle, yeniden deploy et

```
1. github.com/canburaksimsek/CanHoa aç
2. TÜM .jsx dosyalarını sil (App.jsx, ResidentDashboard.jsx, Violations.jsx, vs.)
3. package.json, vite.config.js, globals.css SİL
4. Bu ZIP'teki 5 dosyayı yükle (index.html, app.html, privacy.html, terms.html, vercel.json)
5. Vercel otomatik yeniden deploy eder — bu sefer build ERROR vermez
```

---

## 📁 Bu ZIP'te Ne Var?

| Dosya | Açıklama |
|-------|----------|
| `index.html` | Ana landing page (pazarlama sitesi) |
| `app.html` | Tam çalışan demo app (login + 3 portal) |
| `privacy.html` | Gizlilik politikası |
| `terms.html` | Kullanım koşulları |
| `vercel.json` | Vercel'e "BU STATIC HTML, BUILD ETME" diyor |

---

## 🔗 Siteyi Kullanırken

- Ana sayfa: `https://canhoa.vercel.app/`
- Demo App: `https://canhoa.vercel.app/app` (veya `/app.html`)

---

## 🧪 Demo Hesaplar

| Rol | Email | Şifre |
|-----|-------|-------|
| Resident | resident@demo.com | demo123 |
| Board | board@demo.com | demo123 |
| Manager | manager@demo.com | demo123 |

---

## 🆘 Hâlâ Hata Alıyorsan

1. Vercel dashboard → Project Settings → **Framework Preset: Other**
2. Build Command: **boş bırak**
3. Output Directory: **.**
4. Install Command: **boş bırak**
5. Redeploy

Eğer `canhoa.vercel.app` alan adı bozulmuşsa:
- Settings → Domains → eski domain'i sil → yeni bir project oluştur
