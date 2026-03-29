# VeriCert – Secure Digital Certificate Verification System

A fully working, multi-file frontend web application for issuing and verifying digital certificates.

---

## Project Structure

```
vericert/
├── index.html          ← Home / landing page
├── verify.html         ← Public certificate verification (no login needed)
├── login.html          ← Shared login page (Student + Admin tabs)
├── student.html        ← Student portal (My Certs + Catalogue)
├── admin.html          ← Admin dashboard
│
├── css/
│   └── style.css       ← All shared styles, design tokens, components
│
└── js/
    ├── data.js         ← Shared data layer: localStorage, hashing, seed data, toast, QR
    ├── verify.js       ← Public verification logic
    ├── login.js        ← Login / auth routing
    ├── student.js      ← Student portal logic
    └── admin.js        ← Admin dashboard logic
```

---

## How to Run

Just open `index.html` in any modern browser. No server, build step, or install required.

All data is stored in `localStorage` and persists between sessions.

---

## Demo Credentials

| Role    | Email                  | Password  |
|---------|------------------------|-----------|
| Admin   | admin@vericert.io      | admin123  |
| Student | aisha@uni.edu          | pass123   |
| Student | rahul@uni.edu          | pass123   |
| Student | priya@uni.edu          | pass123   |

---

## Demo Certificate IDs (for public verify page)

| ID                  | Status  |
|---------------------|---------|
| VC-2026-DEMO0001    | Valid   |
| VC-2026-DEMO0002    | Valid   |
| VC-2026-DEMO0003    | Revoked |

---

## Features

### Public
- Verify any certificate by ID — no login required
- Hash integrity check on every verification

### Student Portal
- View all personally issued certificates
- Generate QR code for any certificate
- Browse the full catalogue of available programmes
- "✓ Earned" badge on programmes already completed

### Admin Dashboard
- Issue certificates and assign to any student
- Auto-generate unique certificate IDs
- View and manage the full certificate registry
- Revoke certificates
- Generate QR codes
- Add / remove students (default password: `pass123`)
- Manage the certificate programme catalogue

---

## Technology

- Plain HTML, CSS, JavaScript — no frameworks or dependencies
- QR codes via [qrcodejs](https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js)
- Google Fonts: Syne + Space Mono
- Data: `localStorage` (swap for a real backend in production)
- Hashing: FNV-1a 32-bit (swap for HMAC-SHA256 in production)

---

## Next Steps (Production Roadmap)

1. Replace `localStorage` with a real backend (Node.js + PostgreSQL or Python + Django)
2. Replace FNV hash with HMAC-SHA256 signed by a server secret key
3. Add JWT-based session authentication
4. Add email notification when a certificate is issued
5. Add PDF certificate export
6. Host on a domain with HTTPS so QR scans go to a live URL