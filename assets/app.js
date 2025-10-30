<<<<<<< HEAD
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
=======
(function(){
    // Base64 encoded secrets (Base64 is NOT encryption, which is part of the CTF challenge)
    const D_U_B64 = 'R09PREpPQg==';
    const D_P1_B64 = 'Qm9tYkdpcmw=';   
    const D_P2_B64 = 'cmV6ZS4=';     
    const D_P3_B64 = 'MTY=';         
    
    // Decoded Constants
    const C_U = atob('R09PREpPQg=='); // 'GOODJOB' - Value used for the 'user' cookie
    const D_U = atob(D_U_B64);
    const D_P1 = atob(D_P1_B64);
    const D_P2 = atob(D_P2_B64);
    const D_P3 = atob(D_P3_B64);

    const L_K = 'c_l_a_v1';
    const T_K = 's_t_v1';
    const U_K = 's_u';
    
    // Global utility functions for Base64 encoding/decoding
    window.e_u = function(s){return btoa(s);};
    window.d_u = function(e){return atob(e);};

    // Log functions (unchanged)
    function l_a(){try{return JSON.parse(localStorage.getItem(L_K)||'[]');}catch(e){return[];}}
    function s_a(a){localStorage.setItem(L_K,JSON.stringify(a));}
    function a_a(u,p,ok){const a=l_a();a.unshift({t:new Date().toISOString(),u,p,ok,ua:navigator.userAgent});s_a(a.slice(0,200));}
    function r_a(){
        const l=l_a();
        const o=l.map(a=>`${a.t.substring(11, 19)} - U:${a.u.substring(0,5)} P:${a.p.substring(0,5)}... ok=${a.ok}`).join('\n')||atob('bm8gYXR0ZW1wdHM=');
        const e=document.getElementById('attemptLog');
        if(e)e.textContent=o;
>>>>>>> ebd470b (Updated site design, fixed cart popup, replaced background and added merch images)
    }

<<<<<<< HEAD
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
=======
    const f=document.getElementById('loginForm');
    if(f){
        r_a();
        f.addEventListener('submit',function(ev){
            ev.preventDefault();
            // Get values from the login.html form
            const u = document.getElementById('username').value.trim();
            const p1 = document.getElementById('pw1').value;
            const p2 = document.getElementById('pw2').value;
            const p3 = document.getElementById('pw3').value;

            // 1. Set the Base64 Cookie (part of the hint)
            const eC = e_u(C_U);
            document.cookie = 'user=' + eC + '; path=/';

            // 2. Probe request (unchanged, just sends one password)
            const pU='/probe';
            const pL={action:'login_probe',username:u,password:p1,ts:Date.now()};
            fetch(pU,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(pL),credentials:'same-origin'}).catch(()=>{});

            // 3. Constant-Time Password Check (Prevents Timing Attack)
            // Combined check for all three passwords
            const isCorrect = (u === D_U && p1 === D_P1 && p2 === D_P2 && p3 === D_P3);
            
            // Fixed, safe delay (e.g., 500ms) to prevent timing attacks
            const d = 500; 

            setTimeout(()=>{
                a_a(u, 'P1:' + p1, isCorrect); // Log attempt
                r_a();
                const n = document.getElementById('notice');
                
                if(isCorrect){
                    sessionStorage.setItem(T_K,btoa(u+':'+Date.now()));
                    sessionStorage.setItem(U_K,u);
                    n.textContent = atob('TG9naW4gc3VjY2Vzc2Z1bCAtLSByZWRpcmVjdGluZyB0byBBZG1pbiBQYW5lbC4uLg=='); // 'Login successful -- redirecting to Admin Panel...'
                    n.className = 'notice success';
                    setTimeout(()=>location.assign('admin/panel.html'), 800);
                }else{
                    n.textContent = atob('SW52YWxpZCBjcmVkZW50aWFscw=='); // 'Invalid credentials'
                    n.className = 'notice error';
                }
            }, d);
        });
        
        // Clear Log Button (unchanged)
        const cB=document.getElementById('btnClear');
        if(cB){cB.addEventListener('click',function(){localStorage.removeItem(L_K);r_a();});}
>>>>>>> ebd470b (Updated site design, fixed cart popup, replaced background and added merch images)
    }
    
    // Global functions (unchanged)
    window.s={rA:l_a,cA:()=>{localStorage.removeItem(L_K);},lO:()=>{sessionStorage.removeItem(T_K);sessionStorage.removeItem(U_K);document.cookie='user=; path=/; max-age=0';}};
})();