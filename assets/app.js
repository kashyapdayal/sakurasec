// assets/app.js
(function(){
  // Credentials (encoded below for easy tweaks)
  const D_U = atob('R09PREpPQg==');   // "GOODJOB"
  const D_P = atob('dGVzdA==');        // "test"

  // Local/session storage keys
  const L_K = 'c_l_a_v1';
  const T_K = 's_t_v1';
  const U_K = 's_u';

  // Simple helpers (exposed for students to poke if needed)
  window.e_u = s => btoa(s);
  window.d_u = e => atob(e);

  // Attempt log utilities
  function l_a() {
    try { return JSON.parse(localStorage.getItem(L_K) || '[]'); }
    catch { return []; }
  }
  function s_a(a) {
    try { localStorage.setItem(L_K, JSON.stringify(a)); } catch {}
  }
  function a_a(u, p, ok) {
    const a = l_a();
    a.unshift({ t: new Date().toISOString(), u, p, ok, ua: navigator.userAgent });
    s_a(a.slice(0, 200));
  }
  function r_a() {
    const l = l_a();
    const o = l.map(a => `${a.t} - ${a.u} ${a.p} ok=${a.ok}`).join('\n') || atob('bm8gYXR0ZW1wdHM=');
    const e = document.getElementById('attemptLog');
    if (e) e.textContent = o;
  }

  // Timing model:
  // - Wrong username → 220 ms (longer)
  // - Correct username, wrong password → 120 ms (shorter)
  // - Both correct → near-immediate redirect (fastest)
  function t_delay(u, p) {
    const uOk = (u === D_U);
    const pOk = (p === D_P);
    if (uOk && pOk) return 0;
    if (uOk && !pOk) return 120;
    return 220;
  }

  // Hook up login form
  const f = document.getElementById('loginForm');
  if (f) {
    r_a();
    f.addEventListener('submit', function(ev){
      ev.preventDefault();

      const u = (document.getElementById('username') || {}).value?.trim() || '';
      const p = (document.getElementById('password') || {}).value || '';

      // 1) Set Base64 cookie BEFORE probe so Burp/ZAP sees Cookie: user=<base64>
      document.cookie = 'user=' + btoa(D_U) + '; path=/';

      // 2) Fire a probe request (static hosts may 405; that’s fine for timing labs)
      const probeUrl = '/probe';
      const payload = { action:'login_probe', username:'', password:p, ts:Date.now() };
      fetch(probeUrl, {
        method:'POST',
        headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify(payload),
        credentials:'same-origin'
      }).catch(()=>{ /* expected on static lab */ });

      // 3) Timing-based response observable by Intruder sort-by-time
      const d = t_delay(u, p);
      setTimeout(() => {
        const success = (u === D_U && p === D_P);
        a_a(u, p, success);
        r_a();

        const n = document.getElementById('notice');
        if (success) {
          try {
            sessionStorage.setItem(T_K, btoa(u + ':' + Date.now()));
            sessionStorage.setItem(U_K, u);
          } catch {}
          if (n) {
            n.textContent = atob('TG9naW4gc3VjY2Vzc2Z1bCAtLSByZWRpcmVjdGluZyB0byBBZG1pbiBQYW5lbC4uLg==');
            n.className = 'notice success';
          }
          // Keep redirect fast to create a clear “fastest” signature
          setTimeout(() => location.assign('admin/panel.html'), 100);
        } else {
          if (n) {
            n.textContent = atob('SW52YWxpZCBjcmVkZW50aWFscyAtLSBpbnRlcmNlcHQgdGhlIHJlcXVlc3QgYW5kIGluc3BlY3QgQ29va2llOiB1c2VyPS4uLg==');
            n.className = 'notice error';
          }
        }
      }, d);
    });

    const cB = document.getElementById('btnClear');
    if (cB) {
      cB.addEventListener('click', function(){
        localStorage.removeItem(L_K);
        r_a();
      });
    }
  }

  // Instructor utilities
  window.s = {
    rA: l_a,
    cA: () => { localStorage.removeItem(L_K); },
    lO: () => {
      try {
        sessionStorage.removeItem(T_K);
        sessionStorage.removeItem(U_K);
      } catch {}
      document.cookie = 'user=; path=/; max-age=0';
    }
  };
})();
