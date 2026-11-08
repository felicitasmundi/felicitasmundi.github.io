/* Le notifiche sul telefono · 24/10/2026, Gab: «crea anche le notifiche dell'app» (SQL 117, funzione «notifiche», sw.js).
   8/11/2026, Gab: «voglio che sia di default un utente al massimo può toglierla, ma non possiamo aspettare che uno pensi di volersi attivare una notifica».
   Da ora: chi è entrato, al primo tocco sulla pagina, riceve la domanda del telefono (al massimo una volta al giorno finché non risponde).
   Detto sì, il telefono resta iscritto da solo. In I miei dati: «Notifiche attive · prova» e «Spegni le notifiche».
   Uso: <div data-fm-notifiche></div> (il tasto in I miei dati), fmNotifiche(db). La domanda automatica parte da sola dove c'è window.db.
   Su iPhone le notifiche esistono solo con l'app messa sullo schermo (iOS 16.4 o più). Dentro l'apk vecchio (webview) il telefono non le permette. */
(function(){
  if(window.fmNotifiche) return;

  /* ── L'apk Android (4/10 e 7/11) · 8/11 Gab «ok apk» ──
     L'apk ha un suo servizio che mostra gli avvisi (tabella notifiche, SQL 219), ma parte solo se il sito gli passa l'accesso:
     FelicitasApp.gettone(accesso, rinnovo); all'uscita FelicitasApp.filoVia(). L'apk rinnova l'accesso da sola anche a pagina chiusa,
     e Supabase cambia la chiave di rinnovo a ogni rinnovo: per questo, all'apertura e al ritorno sulla pagina, il sito riprende
     prima la chiave dell'apk (FelicitasApp.sessione()), così nessuno dei due fa uscire l'altro. */
  var APP = window.FelicitasApp && typeof window.FelicitasApp.gettone === 'function' ? window.FelicitasApp : null;
  var CHIAVE_SB = 'sb-gfnveesogkfvkrdudpfg-auth-token', ultimoPassato = '';
  function scadenza(jwt){ try{ var p = jwt.split('.')[1].replace(/-/g,'+').replace(/_/g,'/'); return JSON.parse(atob(p + '='.repeat((4 - p.length % 4) % 4))).exp || 0; }catch(e){ return 0; } }
  function riprendiDallApp(){
    if(!APP || typeof APP.sessione !== 'function') return;
    try{
      var a = APP.sessione(); if(!a) return;
      a = JSON.parse(a); if(!a || !a.access_token || !a.refresh_token) return;
      var g = localStorage.getItem(CHIAVE_SB); if(!g) return;      /* nel sito nessuno è entrato: non si crea niente */
      g = JSON.parse(g); if(!g || g.refresh_token === a.refresh_token) return;
      var exp = scadenza(a.access_token); if(!exp) return;
      g.access_token = a.access_token; g.refresh_token = a.refresh_token; g.expires_at = exp; g.expires_in = Math.max(0, exp - Math.floor(Date.now()/1000));
      localStorage.setItem(CHIAVE_SB, JSON.stringify(g)); ultimoPassato = a.refresh_token;
    }catch(e){}
  }
  function passaAllApp(s){
    if(!APP || !s || !s.access_token || !s.refresh_token || s.refresh_token === ultimoPassato) return;
    try{ APP.gettone(s.access_token, s.refresh_token); ultimoPassato = s.refresh_token; }catch(e){}
  }
  if(APP){
    riprendiDallApp();                                              /* prima che la pagina crei il collegamento a Supabase */
    window.addEventListener('visibilitychange', function(){ if(document.visibilityState === 'visible') riprendiDallApp(); }, true);
  }
  function collegaApp(db){
    if(!APP || !db || !db.auth || collegaApp.fatto) return; collegaApp.fatto = 1;
    db.auth.getSession().then(function(x){ passaAllApp(x && x.data && x.data.session); }).catch(function(){});
    try{ db.auth.onAuthStateChange(function(ev, s){
      if(ev === 'SIGNED_OUT'){ ultimoPassato = ''; try{ APP.filoVia(); }catch(e){} return; }
      passaAllApp(s);
    }); }catch(e){}
  }
  var VAPID = "BB6GhoQTLwM0w2Cs7PhOSkOvFeUMqqvkmsPlorbnaXO0m6Y03EBZ3NkPUG0W5p_TQ41EKK4fYbWP-GGampqrhXc";   /* la chiave pubblica che crea Gab con chiavi-notifiche.html: finché manca, il tasto non si vede */
  var ok = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
  var ua = navigator.userAgent || "";
  var iphone = /iPhone|iPad|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  var giaApp = (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true;
  var SPENTE = 'fm_notifiche_spente', CHIESTO = 'fm_notifiche_chiesto';
  var CSS = '.fn-box{margin:14px 0}.fn-tasto{width:100%;padding:16px 20px;border-radius:999px;border:2px solid #d6b56c;background:none;color:#d6b56c;font-family:DM Sans,system-ui,sans-serif;font-weight:600;font-size:19px;cursor:pointer}'+
    '.fn-esito{font-size:18px;color:#F5F0E6;margin:10px 0 0;text-align:center}.fn-mini{display:block;margin:10px auto 0;background:none;border:0;color:#c9c3d6;font-size:16px;text-decoration:underline;cursor:pointer}';
  function leggi(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } }
  function scrivi(k, v){ try{ if(v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); }catch(e){} }
  function chiave(b){ var p = '='.repeat((4 - b.length % 4) % 4), s = atob((b + p).replace(/-/g,'+').replace(/_/g,'/')), a = new Uint8Array(s.length); for(var i=0;i<s.length;i++) a[i]=s.charCodeAt(i); return a; }
  function salva(db, sub){ var j = sub.toJSON(); return db.rpc('fm_push_salva', { p_endpoint: j.endpoint, p_p256dh: j.keys.p256dh, p_auth: j.keys.auth }); }
  function registra(){ return navigator.serviceWorker.register('sw.js'); }
  function iscrivi(){
    return registra().then(function(){ return navigator.serviceWorker.ready; }).then(function(r){
      return r.pushManager.getSubscription().then(function(s){ return s || r.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: chiave(VAPID) }); });
    });
  }
  function possibile(){ return !!(VAPID && ok) && !(iphone && !giaApp); }
  function aggiornaTasti(){ document.querySelectorAll('[data-fm-notifiche]').forEach(function(box){ if(box._fn && box._fnDisegna) box._fnDisegna(); }); }

  /* chi è entrato: le notifiche sono di default, senza cercare il tasto */
  var autoFatto = false;
  function auto(db){
    if(autoFatto || !db || !possibile() || leggi(SPENTE)) return;
    autoFatto = true;
    if(Notification.permission === 'granted'){ iscrivi().then(function(s){ return salva(db, s); }).catch(function(){}); return; }
    if(Notification.permission !== 'default') return;
    var ultima = +leggi(CHIESTO) || 0;
    if(Date.now() - ultima < 864e5) return;                     /* chi ha chiuso la domanda senza rispondere la rivede domani */
    function tocco(){
      ['pointerup','keydown'].forEach(function(t){ document.removeEventListener(t, tocco, true); });
      if(Notification.permission !== 'default' || leggi(SPENTE)) return;
      scrivi(CHIESTO, String(Date.now()));
      Notification.requestPermission().then(function(p){
        if(p !== 'granted') return;
        return iscrivi().then(function(s){ return salva(db, s); });
      }).then(aggiornaTasti, aggiornaTasti);
    }
    ['pointerup','keydown'].forEach(function(t){ document.addEventListener(t, tocco, true); });   /* il telefono chiede il permesso solo dopo un gesto */
  }
  function partiDaSolo(){
    var db = window.db;
    collegaApp(db);
    if(!db || !db.auth || !possibile()) return;
    db.auth.getSession().then(function(s){ if(s && s.data && s.data.session) auto(db); }).catch(function(){});
    try{ db.auth.onAuthStateChange(function(ev){ if(ev === 'SIGNED_IN') auto(db); }); }catch(e){}
  }
  if(document.readyState === 'complete') setTimeout(partiDaSolo, 0); else window.addEventListener('load', partiDaSolo);

  /* il tasto in I miei dati */
  window.fmNotifiche = function(db){
    if(!VAPID || !ok || !db) return;
    if(!document.getElementById('fn-css')){ var st=document.createElement('style'); st.id='fn-css'; st.textContent=CSS; document.head.appendChild(st); }
    try{ db.auth.getSession().then(function(x){ if(x && x.data && x.data.session) auto(db); }).catch(function(){}); }catch(e){}
    document.querySelectorAll('[data-fm-notifiche]').forEach(function(box){
      if(box._fn) return; box._fn = 1; box.classList.add('fn-box');
      if(iphone && !giaApp){ box.innerHTML = ''; return; }   /* su iPhone prima va messa l'app sullo schermo: lì c'è già il tasto */
      box._fnDisegna = function(msg){
        if(Notification.permission === 'denied'){ box.innerHTML = '<p class="fn-esito">Le notifiche sono spente nelle impostazioni del telefono.</p>'; return; }
        var attive = Notification.permission === 'granted' && !leggi(SPENTE);
        box.innerHTML = '<button class="fn-tasto" type="button">'+(attive ? 'Notifiche attive · prova' : 'Attiva le notifiche')+'</button>'+
          (attive ? '<button class="fn-mini" type="button">Spegni le notifiche</button>' : '')+'<p class="fn-esito" aria-live="polite"></p>';
        var b = box.querySelector('.fn-tasto'), sp = box.querySelector('.fn-mini'), e = box.querySelector('.fn-esito');
        if(msg) e.textContent = msg;
        b.onclick = function(){
          b.disabled = true; e.textContent = 'Un momento…';
          scrivi(SPENTE, null);
          Notification.requestPermission().then(function(p){
            if(p !== 'granted') throw new Error('no');
            return iscrivi();
          }).then(function(s){ return salva(db, s); }).then(function(r){
            if(r && r.error) throw r.error;
            if(r && r.data && r.data !== 'ok'){ e.textContent = r.data; b.disabled = false; return; }
            return db.rpc('fm_notifica_prova').then(function(x){ box._fnDisegna(x && x.data === 'ok' ? 'Tra poco arriva una notifica di prova.' : ((x && x.data) || '')); });
          }).catch(function(x){ b.disabled = false; e.textContent = x && x.message === 'no' ? 'Senza il permesso del telefono le notifiche non arrivano.' : 'Non si sono attivate. Si può riprovare.'; });
        };
        if(sp) sp.onclick = function(){
          sp.disabled = true;
          scrivi(SPENTE, '1');
          navigator.serviceWorker.getRegistration().then(function(r){ return r && r.pushManager.getSubscription(); })
            .then(function(s){ return s && s.unsubscribe(); }).catch(function(){})
            .then(function(){ box._fnDisegna('Notifiche spente. Si riaccendono da qui.'); });
        };
      };
      box._fnDisegna();
    });
  };
})();
