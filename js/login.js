/* ============================================================
   VeriCert – login.js
   Handles Student / Admin login and role-tab switching
   ============================================================ */

// Read ?role= param from URL to pre-select tab
const _urlRole = new URLSearchParams(location.search).get('role');
let _mode = (_urlRole === 'admin') ? 'admin' : 'student';
setMode(_mode);

function setMode(mode) {
  _mode = mode;
  document.getElementById('ltab-student').classList.toggle('active', mode === 'student');
  document.getElementById('ltab-admin').classList.toggle('active',   mode === 'admin');

  if (mode === 'student') {
    document.getElementById('login-title').textContent = 'Student Portal';
    document.getElementById('login-sub').textContent   = '// Log in to view your certificates';
    document.getElementById('login-hint').innerHTML    =
      'Demo: aisha@uni.edu / pass123 &nbsp;|&nbsp; rahul@uni.edu / pass123';
    document.getElementById('login-email').placeholder = 'student@university.edu';
  } else {
    document.getElementById('login-title').textContent = 'Admin Login';
    document.getElementById('login-sub').textContent   = '// Restricted — authorised personnel only';
    document.getElementById('login-hint').textContent  = 'Demo: admin@vericert.io / admin123';
    document.getElementById('login-email').placeholder = 'admin@institution.edu';
  }
  document.getElementById('login-err').style.display = 'none';
}

function doLogin() {
  const email = document.getElementById('login-email').value.trim();
  const pass  = document.getElementById('login-pass').value;
  const err   = document.getElementById('login-err');

  if (_mode === 'admin') {
    if (email === 'admin@vericert.io' && pass === 'admin123') {
      err.style.display = 'none';
      window.location.href = 'admin.html';
    } else {
      err.textContent    = 'Invalid credentials. Try admin@vericert.io / admin123';
      err.style.display  = 'block';
    }
  } else {
    const students = getStudents();
    const student  = students.find(s => s.email === email && s.password === pass);
    if (student) {
      err.style.display = 'none';
      // Store current student in sessionStorage so portal page can read it
      sessionStorage.setItem('vc_current_student', JSON.stringify(student));
      window.location.href = 'student.html';
    } else {
      err.textContent   = 'Invalid credentials. Check the demo hint below.';
      err.style.display = 'block';
    }
  }
}

// Allow Enter key
document.getElementById('login-pass')
  .addEventListener('keyup', e => { if (e.key === 'Enter') doLogin(); });