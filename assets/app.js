(function(){
    // Base64 encoded secrets (Base64 is NOT encryption, which is part of the CTF challenge)
    const D_U_B64 = 'R09PREpPQg==';      // GOODJOB
    const D_P1_B64 = 'Qm9tYkdpcmw=';     // BombGirl
    const D_P2_B64 = 'cmV6ZS4=';         // reze.
    const D_P3_B64 = 'MTY=';             // 16
    
    // Decoded Constants
    const C_U = atob('R09PREpPQg=='); // 'GOODJOB' - Value used for the 'user' cookie
    const D_U = atob(D_U_B64);
    const D_P1 = atob(D_P1_B64);
    const D_P2 = atob(D_P2_B64);
    const D_P3 = atob(D_P3_B64);

    const L_K = 'c_l_a_v1';
    const T_K = 's_t_v1';
    const U_K = 's_u';
    const MODE = 'ctf'; // 'ctf' | 'hardened'
    
    // Global utility functions for Base64 encoding/decoding
    window.e_u = function(s){return btoa(s);};
    window.d_u = function(e){return atob(e);};

    // Log functions
    function l_a(){
        try{
            return JSON.parse(localStorage.getItem(L_K)||'[]');
        }catch(e){
            return[];
        }
    }
    
    function s_a(a){
        localStorage.setItem(L_K,JSON.stringify(a));
    }
    
    function a_a(u,p,ok){
        const a=l_a();
        a.unshift({t:new Date().toISOString(),u,p,ok,ua:navigator.userAgent});
        s_a(a.slice(0,200));
    }
    
    function r_a(){
        const l=l_a();
        const o=l.map(a=>`${a.t.substring(11, 19)} - U:${a.u.substring(0,5)} P:${a.p.substring(0,5)}... ok=${a.ok}`).join('\n')||atob('bm8gYXR0ZW1wdHM=');
        const e=document.getElementById('attemptLog');
        if(e)e.textContent=o;
    }

    // Login form handler
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

            // 1. Set cookie (CTF: encoded username; Hardened: non-sensitive)
            const eC = e_u(C_U);
            if (MODE === 'ctf') {
                document.cookie = 'user=' + eC + '; path=/; max-age=1800; SameSite=Lax';
            } else {
                document.cookie = 'user=guest; path=/; max-age=1800; SameSite=Lax';
            }
            // Debug
            console.log('Cookie set: ' + (MODE==='ctf' ? ('user='+eC) : 'user=guest'));

            // 2. Probe request (for CTF challenge - intercept this)
            const pU='/probe';
            const pL={action:'login_probe',username:u,password:p1,ts:Date.now()};
            fetch(pU,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(pL),credentials:'same-origin'}).catch(()=>{});

            // 3. Timing-mode logic (CTF: differential; Hardened: constant time)
            let d = 500; // Hardened default
            const uOk = (u === D_U);
            const pOk = (p1 === D_P1 && p2 === D_P2 && p3 === D_P3);
            if (MODE === 'ctf') {
                d = uOk ? (pOk ? 0 : 120) : 220;
            }

            setTimeout(()=>{
                const isCorrect = uOk && pOk;
                // Mask sensitive data in logs
                a_a(u, 'masked', isCorrect);
                r_a();
                const n = document.getElementById('notice');
                
                if(isCorrect){
                    sessionStorage.setItem(T_K,btoa(u+':'+Date.now()));
                    sessionStorage.setItem(U_K,u);
                    sessionStorage.setItem('sakura_token_v1', btoa(u+':'+Date.now()));
                    sessionStorage.setItem('sakura_user', u);
                    n.textContent = atob('TG9naW4gc3VjY2Vzc2Z1bCAtLSByZWRpcmVjdGluZyB0byBBZG1pbiBQYW5lbC4uLg=='); // 'Login successful -- redirecting to Admin Panel...'
                    n.className = 'notice success';
                    setTimeout(()=>location.assign('admin/panel.html'), 100);
                }else{
                    n.textContent = atob('SW52YWxpZCBjcmVkZW50aWFscyAtLSBpbnRlcmNlcHQgdGhlIHJlcXVlc3QgYW5kIGluc3BlY3QgQ29va2llOiB1c2VyPS4uLg=='); // 'Invalid credentials -- intercept the request and inspect Cookie: user=...'
                    n.className = 'notice error';
                }
            }, d);
        });
        
        // Clear Log Button
        const cB=document.getElementById('btnClear');
        if(cB){
            cB.addEventListener('click',function(){
                localStorage.removeItem(L_K);
                r_a();
            });
        }
    }
    
    // Global utility functions
    window.s={
        rA:l_a,
        cA:()=>{
            localStorage.removeItem(L_K);
        },
        lO:()=>{
            sessionStorage.removeItem(T_K);
            sessionStorage.removeItem(U_K);
            document.cookie='user=; path=/; max-age=0';
        }
    };
})();