/* ============================================================
   VeriCert – admin.js
   All admin dashboard logic: issue, list, students, catalogue
   ============================================================ */

// ── AUTH GUARD ────────────────────────────────────────────
// (In production this would be a real JWT check.)
// For demo: if they navigated here without going through login.html
// there's nothing to guard, but we keep the pattern clean.

function adminLogout() {
  window.location.href = 'index.html';
}

// ── TAB SWITCHING ─────────────────────────────────────────
function switchTab(tabId, el) {
  document.querySelectorAll('.dash-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
  el.classList.add('active');

  if (tabId === 'tab-certs')     renderCertsTable();
  if (tabId === 'tab-students')  renderStudentsTable();
  if (tabId === 'tab-catalogue') renderCatTable();
}

// ── ISSUE CERTIFICATE ─────────────────────────────────────
function populateStudentSelect() {
  const sel = document.getElementById('f-student');
  const students = getStudents();
  sel.innerHTML = '<option value="">— Select student —</option>'
    + students.map(s => `<option value="${s.id}">${s.name} (${s.email})</option>`).join('');
}

function refreshId() {
  document.getElementById('f-id').value = vcGenId();
}

function issueCert() {
  const sid    = document.getElementById('f-student').value;
  const course = document.getElementById('f-course').value.trim();
  const inst   = document.getElementById('f-inst').value.trim();
  const date   = document.getElementById('f-date').value;
  const id     = document.getElementById('f-id').value.trim();

  if (!sid || !course || !inst || !date || !id) {
    vcToast('⚠ Please fill all fields');
    return;
  }

  const students = getStudents();
  const student  = students.find(s => s.id === sid);
  const cert = {
    certificate_id:      id,
    student_id:          sid,
    student_name:        student.name,
    course_name:         course,
    issuing_institution: inst,
    issue_date:          date,
    certificate_hash:    '',
    status:              'valid',
  };
  cert.certificate_hash = vcCertHash(cert);

  const certs = getCerts();
  certs.push(cert);
  saveCerts(certs);

  // Reset form
  document.getElementById('f-student').value = '';
  document.getElementById('f-course').value  = '';
  document.getElementById('f-inst').value    = '';
  refreshId();

  vcToast(`✓ Certificate issued: ${id}`);
}

// ── ALL CERTIFICATES TABLE ────────────────────────────────
function renderCertsTable() {
  const tbody = document.getElementById('certs-tbody');
  const certs = getCerts();

  if (certs.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="color:var(--muted);text-align:center;padding:28px;">No certificates yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = certs.map((c, i) => `
    <tr>
      <td style="color:var(--accent)">${c.certificate_id}</td>
      <td>${c.student_name}</td>
      <td>${c.course_name}</td>
      <td>${c.issuing_institution}</td>
      <td>${c.issue_date}</td>
      <td><span class="tbl-status ${c.status === 'valid' ? 'tbl-valid' : 'tbl-revoked'}">${c.status}</span></td>
      <td>
        <div class="td-actions">
          <button class="btn btn-ghost btn-sm" onclick="vcShowQR('${c.certificate_id}')">QR</button>
          ${c.status === 'valid'
            ? `<button class="btn btn-danger btn-sm" onclick="revokeCert(${i})">Revoke</button>`
            : ''}
        </div>
      </td>
    </tr>`).join('');
}

function revokeCert(i) {
  const certs = getCerts();
  certs[i].status = 'revoked';
  saveCerts(certs);
  renderCertsTable();
  vcToast(`Certificate ${certs[i].certificate_id} revoked`);
}

// ── STUDENTS TABLE ────────────────────────────────────────
function renderStudentsTable() {
  const tbody    = document.getElementById('students-tbody');
  const students = getStudents();
  const certs    = getCerts();

  if (students.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="color:var(--muted);text-align:center;padding:28px;">No students yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = students.map(s => {
    const count = certs.filter(c => c.student_id === s.id).length;
    return `
      <tr>
        <td>${s.name}</td>
        <td style="color:var(--accent)">${s.email}</td>
        <td style="font-family:var(--mono);font-size:.7rem;color:var(--muted)">${s.password}</td>
        <td><span style="font-family:var(--mono);font-size:.78rem;color:var(--valid)">${count}</span></td>
      </tr>`;
  }).join('');
}

function addStudent() {
  const name  = document.getElementById('s-name').value.trim();
  const email = document.getElementById('s-email').value.trim();

  if (!name || !email) { vcToast('⚠ Name and email required'); return; }

  const students = getStudents();
  if (students.find(s => s.email === email)) { vcToast('⚠ Email already exists'); return; }

  students.push({ id: 's' + Date.now(), name, email, password: 'pass123' });
  saveStudents(students);
  populateStudentSelect();

  document.getElementById('s-name').value  = '';
  document.getElementById('s-email').value = '';

  renderStudentsTable();
  vcToast(`✓ Student added: ${name} (password: pass123)`);
}

// ── CATALOGUE ─────────────────────────────────────────────
function renderCatTable() {
  const tbody = document.getElementById('cat-tbody');
  const items = getCatalogue();

  tbody.innerHTML = items.map((c, i) => `
    <tr>
      <td>${c.icon} ${c.title}</td>
      <td>${c.institution}</td>
      <td><span class="cat-tag">${c.tag}</span></td>
      <td><button class="btn btn-danger btn-sm" onclick="deleteCatItem(${i})">Remove</button></td>
    </tr>`).join('');
}

function addCatItem() {
  const title = document.getElementById('cat-title').value.trim();
  const inst  = document.getElementById('cat-inst').value.trim();
  const desc  = document.getElementById('cat-desc').value.trim();
  const icon  = document.getElementById('cat-icon').value.trim() || '🎓';
  const tag   = document.getElementById('cat-tag').value.trim()  || 'General';

  if (!title || !inst) { vcToast('⚠ Title and institution required'); return; }

  const cat = getCatalogue();
  cat.push({ id: 'cat' + Date.now(), title, institution: inst, desc, icon, tag });
  saveCatalogue(cat);

  ['cat-title','cat-inst','cat-desc','cat-icon','cat-tag'].forEach(id => {
    document.getElementById(id).value = '';
  });

  renderCatTable();
  vcToast(`✓ Added to catalogue: ${title}`);
}

function deleteCatItem(i) {
  const cat = getCatalogue();
  cat.splice(i, 1);
  saveCatalogue(cat);
  renderCatTable();
  vcToast('Catalogue item removed');
}

// ── INIT ──────────────────────────────────────────────────
document.getElementById('f-date').value = new Date().toISOString().split('T')[0];
refreshId();
populateStudentSelect();
