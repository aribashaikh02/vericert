/* ============================================================
   VeriCert – student.js
   Student portal: My Certificates + Catalogue views
   ============================================================ */

// ── AUTH GUARD ────────────────────────────────────────────
const _raw = sessionStorage.getItem('vc_current_student');
if (!_raw) { window.location.href = 'login.html?role=student'; }

const currentStudent = JSON.parse(_raw);
document.getElementById('student-name').textContent = currentStudent.name.split(' ')[0];
document.getElementById('nav-email').textContent    = currentStudent.email;

function logout() {
  sessionStorage.removeItem('vc_current_student');
  window.location.href = 'index.html';
}

// ── TAB SWITCHING ─────────────────────────────────────────
function switchTab(panelId, el) {
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.getElementById(panelId).classList.add('active');
  el.classList.add('active');
  if (panelId === 'catalogue') renderCatalogue();
}

// ── MY CERTIFICATES ───────────────────────────────────────
function renderMyCerts() {
  const el    = document.getElementById('my-certs-list');
  const mine  = getCerts().filter(c => c.student_id === currentStudent.id);

  if (mine.length === 0) {
    el.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📜</div>
        <div class="empty-msg">No certificates issued to you yet.<br>Check the catalogue for available programmes.</div>
      </div>`;
    return;
  }

  el.innerHTML = mine.map(c => `
    <div class="cert-card">
      <div>
        <div class="cert-card-title">${c.course_name}</div>
        <div class="cert-card-meta">
          ${c.issuing_institution} &nbsp;·&nbsp; ${c.issue_date}
          &nbsp;·&nbsp; <span style="color:var(--accent)">${c.certificate_id}</span>
        </div>
      </div>
      <div class="cert-card-right">
        <span class="tbl-status ${c.status === 'valid' ? 'tbl-valid' : 'tbl-revoked'}">${c.status}</span>
        <button class="btn btn-ghost btn-sm" onclick="vcShowQR('${c.certificate_id}')">QR</button>
      </div>
    </div>`).join('');
}

// ── CATALOGUE ─────────────────────────────────────────────
function renderCatalogue() {
  const el     = document.getElementById('catalogue-grid');
  const myNames = getCerts()
    .filter(c => c.student_id === currentStudent.id)
    .map(c => c.course_name);

  el.innerHTML = getCatalogue().map(item => {
    const owned = myNames.includes(item.title);
    return `
      <div class="cat-card">
        <div class="cat-icon">${item.icon || '🎓'}</div>
        <div class="cat-title">${item.title}</div>
        <div class="cat-inst">${item.institution}</div>
        <div class="cat-desc">${item.desc}</div>
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
          <span class="cat-tag">${item.tag}</span>
          ${owned ? '<span class="owned-badge">✓ Earned</span>' : ''}
        </div>
      </div>`;
  }).join('');
}

// ── INIT ──────────────────────────────────────────────────
renderMyCerts();