/* ============================================================
   VeriCert – verify.js
   Handles public certificate lookup and result rendering
   ============================================================ */

function doVerify() {
  const raw = document.getElementById('verify-input').value.trim();
  const id  = raw.toUpperCase();
  const el  = document.getElementById('verify-result');

  if (!id) { el.innerHTML = ''; return; }

  const certs = getCerts();
  const cert  = certs.find(c => c.certificate_id.toUpperCase() === id);

  if (!cert) {
    el.innerHTML = `
      <div class="result-card result-notfound">
        <div class="result-header">
          <span class="status-badge badge-notfound">Not Found</span>
        </div>
        <div style="font-family:var(--mono);font-size:.82rem;color:var(--muted);">
          No certificate found for ID: <span style="color:var(--text)">${id}</span>
        </div>
      </div>`;
    return;
  }

  const hashMatch = vcCertHash(cert) === cert.certificate_hash;

  if (cert.status === 'revoked') {
    el.innerHTML = `
      <div class="result-card result-revoked">
        <div class="result-header">
          <span class="status-badge badge-revoked">Revoked</span>
          <div class="result-title">${cert.course_name}</div>
        </div>
        <div class="result-grid">
          <div class="result-field"><label>Student</label><div class="val">${cert.student_name}</div></div>
          <div class="result-field"><label>Institution</label><div class="val">${cert.issuing_institution}</div></div>
        </div>
        <div class="cert-id-display">This certificate has been revoked and is no longer valid.</div>
      </div>`;
    return;
  }

  el.innerHTML = `
    <div class="result-card result-valid">
      <div class="result-header">
        <span class="status-badge badge-valid">✓ Valid</span>
        <div class="result-title">${cert.course_name}</div>
      </div>
      <div class="result-grid">
        <div class="result-field"><label>Student Name</label><div class="val">${cert.student_name}</div></div>
        <div class="result-field"><label>Issuing Institution</label><div class="val">${cert.issuing_institution}</div></div>
        <div class="result-field"><label>Issue Date</label><div class="val">${cert.issue_date}</div></div>
        <div class="result-field"><label>Status</label><div class="val" style="color:var(--valid)">● Valid</div></div>
      </div>
      <div class="cert-id-display">
        ID: ${cert.certificate_id}<br>
        HASH: ${cert.certificate_hash}
        ${hashMatch
          ? '<span style="color:var(--valid)"> ✓ Integrity OK</span>'
          : '<span style="color:var(--revoked)"> ⚠ Hash mismatch</span>'}
      </div>
    </div>`;
}

// Allow Enter key to trigger verify
document.getElementById('verify-input')
  .addEventListener('keyup', e => { if (e.key === 'Enter') doVerify(); });