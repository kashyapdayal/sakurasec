// assets/app.js

(function(){
  // Challenge credentials
  const DEMO_USER  = 'GOODJOB';     // derived from cookie via decoding
  const DEMO_PASS  = 'test';        // to be brute-forced/guessed
  const COOKIE_USER_VALUE = 'GOODJOB';

  // Keys
  const LS_KEY    = 'cyberlearn_login_attempts_v1';
  const TOKEN_KEY = 'sakura_token_v1';
  const USER_KEY  = 'sakura_user';

  // --- Minimal “base256-style” encoder (shift bytes by +3, then hex) ---
  function toUtf8Bytes(str){ return new TextEncoder().encode(str); }
  function fromUtf8Bytes(bytes){ return new TextDecoder().decode(new Uint8Array(bytes)); }
  function shiftBytes(bytes, k){
    const out = new Uint8Array(bytes.length);
    for(let i=0;i<bytes.length;i++){ out[i] = (bytes[i] + k) & 0xff; }
    return out;
  }
  function toHex(bytes){
    let s = '';
    for(const b of bytes){ s += b.toString(16).padStart(2,'0'); }
    return s;
  }
  function fromHex(hex){
    const out = new Uint8Array(hex.length/2);
    for(let i=0;i<out.length;i++){ out[i] = parseInt(hex.substr(i*2,2),16); }
    return out;
  }
  window.ctfEncodeUsername = function(str){
    return toHex(shiftBytes(toUtf8Bytes(str), 3));
  };
  window.ctfDecodeUsername = function(hex){
    const bytes = fromHex(hex);
    const unshift = new Uint8Array(bytes.length);
    for(let i=0;i<bytes.length;i++){ unshift[i] = (bytes[i] - 3 + 256) & 0xff; }
    return fromUtf8Bytes(unshift);
  };

  // Storage helpers
  function loadAttempts(){
    try{ return JSON.parse(localStorage.getItem(LS_KEY) || '[]'); }
    catch(e){ return []; }
  }
  function saveAttempts(a){ localStorage.setItem(LS_KEY, JSON.stringify(a)); }
  function addAttempt(u,p,ok){
    const arr = loadAttempts();
    arr.unshift({ t: new Date().toISOString(), u, p, ok, ua: navigator.userAgent });
    saveAttempts(arr.slice(0,200));
  }

  // Render attempts log
  function renderAttempts(){
    const list = loadAttempts();
    const out = list.map(a => `${a.t} — ${a.u} ${a.p} ok=${a.ok}`).join('\n') || 'no attempts';
    const el = document.getElementById('attemptLog');
    if(el) el.textContent = out;
  }

  // Login form wiring
  const loginForm = document.getElementById('loginForm');
  if(loginForm){
    renderAttempts();

    loginForm.addEventListener('submit', function(ev){
      ev.preventDefault();
      const u = document.getElementById('username').value.trim();
      const p = document.getElementById('password').value;

      // Set cookie BEFORE sending the outbound probe so the proxy captures it
      const encodedUser = ctfEncodeUsername(COOKIE_USER_VALUE);
      document.cookie = 'user=' + encodedUser + '; path=/';

      // Probe request for interception
      const probeUrl = '/probe';
      const payload = { action:'login_probe', username: u, password: p, ts: Date.now() };
      fetch(probeUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'same-origin'
      }).catch(()=>{ /* expected in static lab */ });

      // Slight timing skew to hint username existence, but require both creds
      const usernameExists = (u === DEMO_USER);
      const delay = usernameExists ? 120 : 220;

      setTimeout(() => {
        const success = (u === DEMO_USER && p === DEMO_PASS);
        addAttempt(u, p, success);
        renderAttempts();

        const notice = document.getElementById('notice');
        if(success){
          sessionStorage.setItem(TOKEN_KEY, btoa(u + ':' + Date.now()));
          sessionStorage.setItem(USER_KEY, u);
          notice.textContent = 'Login successful — redirecting to Admin Panel...';
          notice.className = 'notice success';
          setTimeout(()=> location.assign('admin/panel.html'), 800);
        } else {
          notice.textContent = 'Invalid credentials — intercept the request and inspect Cookie: user=...';
          notice.className = 'notice error';
        }
      }, delay);
    });

    const clearBtn = document.getElementById('btnClear');
    if(clearBtn){
      clearBtn.addEventListener('click', function(){
        localStorage.removeItem(LS_KEY);
        renderAttempts();
      });
    }
  }

  // Instructor helpers
  window.sakura = {
    readAttempts: loadAttempts,
    clearAttempts: ()=> { localStorage.removeItem(LS_KEY); },
    logout: ()=> {
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(USER_KEY);
      document.cookie = 'user=; path=/; max-age=0';
    }
  };
})();
