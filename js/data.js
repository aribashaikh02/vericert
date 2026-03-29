/* ============================================================
   VeriCert – Shared Data Store & Utilities
   js/data.js  —  loaded on every page
   ============================================================ */

// ── STORAGE HELPERS ──────────────────────────────────────
function vcLoad(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) || fallback; }
  catch { return fallback; }
}
function vcSave(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// ── HASH (FNV-1a 32-bit, hex-padded to 32 chars) ─────────
function vcHash(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = (h * 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, '0').repeat(4).substring(0, 32).toUpperCase();
}

function vcCertHash(cert) {
  return vcHash(
    `${cert.certificate_id}|${cert.student_name}|${cert.course_name}|` +
    `${cert.issuing_institution}|${cert.issue_date}`
  );
}

// ── SEED DEMO DATA ────────────────────────────────────────
(function seedIfEmpty() {
  if (!vcLoad('vc_students', null)) {
    vcSave('vc_students', [
      { id: 's1', name: 'Aisha Patel',   email: 'aisha@uni.edu',  password: 'pass123' },
      { id: 's2', name: 'Rahul Sharma',  email: 'rahul@uni.edu',  password: 'pass123' },
      { id: 's3', name: 'Priya Nair',    email: 'priya@uni.edu',  password: 'pass123' },
    ]);
  }

  if (!vcLoad('vc_catalogue', null)) {
    vcSave('vc_catalogue', [
      { id:'c1', title:'Full Stack Development',         institution:'Tech University',       desc:'Master front-end and back-end technologies including React, Node.js, and databases.', icon:'💻', tag:'Technology' },
      { id:'c2', title:'Data Science & Machine Learning',institution:'Institute of Technology',desc:'Learn data analysis, Python, statistics, and build real ML models.',                  icon:'🧠', tag:'Data'       },
      { id:'c3', title:'Cybersecurity Fundamentals',     institution:'CyberAcademy',          desc:'Understand network security, ethical hacking, and modern threat landscapes.',          icon:'🔐', tag:'Security'   },
      { id:'c4', title:'UI/UX Design',                   institution:'Design School',         desc:'Principles of human-centered design, Figma, and product thinking.',                   icon:'🎨', tag:'Design'     },
      { id:'c5', title:'Cloud Architecture',             institution:'CloudInstitute',        desc:'AWS, Azure, and GCP — design scalable, resilient cloud systems.',                     icon:'☁️',  tag:'Infra'      },
      { id:'c6', title:'Blockchain Development',         institution:'Web3 Academy',          desc:'Smart contracts, Solidity, and decentralised application development.',               icon:'⛓️',  tag:'Web3'       },
    ]);
  }

  if (!vcLoad('vc_certs', null)) {
    const raw = [
      { certificate_id:'VC-2026-DEMO0001', student_id:'s1', student_name:'Aisha Patel',  course_name:'Full Stack Development',         issuing_institution:'Tech University',        issue_date:'2026-01-15', status:'valid'   },
      { certificate_id:'VC-2026-DEMO0002', student_id:'s2', student_name:'Rahul Sharma', course_name:'Data Science & ML',              issuing_institution:'Institute of Technology', issue_date:'2026-02-20', status:'valid'   },
      { certificate_id:'VC-2026-DEMO0003', student_id:'s3', student_name:'Priya Nair',   course_name:'Cybersecurity Fundamentals',      issuing_institution:'CyberAcademy',           issue_date:'2026-03-01', status:'revoked' },
    ];
    raw.forEach(c => { c.certificate_hash = vcCertHash(c); });
    vcSave('vc_certs', raw);
  }
})();

// ── LIVE ACCESSORS ────────────────────────────────────────
function getCerts()     { return vcLoad('vc_certs',     []); }
function getStudents()  { return vcLoad('vc_students',  []); }
function getCatalogue() { return vcLoad('vc_catalogue', []); }

function saveCerts(d)     { vcSave('vc_certs',     d); }
function saveStudents(d)  { vcSave('vc_students',  d); }
function saveCatalogue(d) { vcSave('vc_catalogue', d); }

// ── SESSION (simple in-memory) ────────────────────────────
const vcSession = {
  _data: {},
  set(key, val) { this._data[key] = val; },
  get(key)      { return this._data[key]; },
  clear()       { this._data = {}; },
};

// ── TOAST ─────────────────────────────────────────────────
function vcToast(msg) {
  let t = document.getElementById('vc-toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'vc-toast';
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 3000);
}

// ── QR MODAL ──────────────────────────────────────────────
function vcShowQR(certId) {
  document.getElementById('qr-modal-id').textContent = certId;
  const container = document.getElementById('qr-output');
  container.innerHTML = '';
  new QRCode(container, { text: certId, width: 170, height: 170, colorDark: '#000', colorLight: '#fff' });
  document.getElementById('qr-modal').classList.add('open');
}
function vcCloseQR() {
  document.getElementById('qr-modal').classList.remove('open');
}

// ── ID GENERATOR ──────────────────────────────────────────
function vcGenId() {
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase()
             + Math.floor(1000 + Math.random() * 9000);
  return `VC-2026-${rand}`;
}