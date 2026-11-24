/* Le notifiche sul telefono · 24/10/2026, Gab: «crea anche le notifiche dell'app» (SQL 117, funzione «notifiche», sw.js).
   8/11/2026, Gab: «voglio che sia di default un utente al massimo può toglierla, ma non possiamo aspettare che uno pensi di volersi attivare una notifica».
   Da ora: chi è entrato, al primo tocco sulla pagina, riceve la domanda del telefono (al massimo una volta al giorno finché non risponde).
   15/11: prima della domanda del sistema si apre una finestrella dell'app con «Attiva le notifiche» e «Non ora».
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
      /* 24/11 (Gab: «ho messo la password ma mi ha rifatto entrare nella schermata dicendomi ancora entra»): l'apk teneva un accesso
         vecchio, già spento, e qui prendeva il posto di quello appena fatto col codice: si restava ospiti a ogni ingresso.
         Ora si prende quello dell'apk solo se è più nuovo di quello del sito. Se è più vecchio resta quello del sito,
         che poco dopo passa all'apk (passaAllApp) e prende il posto del suo vecchio. */
      var expSito = scadenza(g.access_token || '') || +g.expires_at || 0;
      if(exp <= expSito) return;
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
    db.auth.getSession().then(function(x){
      var s = x && x.data && x.data.session;
      passaAllApp(s);
      /* 16/11 (Gab: «se installo whatsapp quello inizia di default a dirmi che ci sono dei messaggi»): su Android 13 e oltre ogni app
         deve chiedere una volta il permesso delle notifiche. L'apk lo chiede solo dentro promemoria(): con un'ora già passata
         chiede il permesso e non programma niente. Se il permesso c'è già, il telefono non mostra nulla. Al massimo una volta al giorno. */
      if(s && typeof APP.promemoria === 'function'){
        var ult = +leggi('fm_apk_permesso') || 0;
        if(Date.now() - ult > 864e5){ scrivi('fm_apk_permesso', String(Date.now())); try{ APP.promemoria('fm-permesso-notifiche', '', '0'); }catch(e){} }
      }
    }).catch(function(){});
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
    /* 15/11 (Gab: «Ok richiesta pemesso»): prima una finestrella dell'app che dice a cosa servono, poi la domanda del telefono o del computer.
       La finestrella aspetta che non ci sia un'altra finestra aperta (Praticantato, benvenuto). «Non ora» = si rivede domani. */
    function altraAperta(){ return !!document.querySelector('#fp-velo,.tc-foglio,#cmp-f,#fn-velo'); }
    function finestra(){
      if(Notification.permission !== 'default' || leggi(SPENTE)) return;
      if(altraAperta()){ setTimeout(finestra, 2000); return; }
      if(!document.getElementById('fn-css2')){ var st=document.createElement('style'); st.id='fn-css2'; st.textContent=
        '#fn-velo{position:fixed;inset:0;z-index:9998;background:rgba(5,10,30,.72);display:flex;align-items:center;justify-content:center;padding:16px;box-sizing:border-box;overflow-y:auto}#fn-velo *{box-sizing:border-box}'+
        '.fn-f{width:100%;max-width:420px;background:#1a2148;border:1px solid rgba(212,175,106,.7);border-radius:22px;padding:26px 22px 22px;color:#F5F0E6;margin:auto;text-align:center;font-family:DM Sans,system-ui,sans-serif}'+
        '.fn-f svg{width:46px;height:46px;stroke:#D4AF6A;fill:none;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round;margin:0 auto 10px;display:block}'+
        '.fn-f h2{font-family:Georgia,serif;font-size:24px;line-height:1.25;font-weight:600;margin:0 0 12px;color:#F5F0E6}.fn-f p{font-size:18px;line-height:1.5;margin:0 0 8px;color:rgba(245,240,230,.85)}'+
        '.fn-si{display:block;width:100%;margin-top:18px;padding:15px;border-radius:999px;background:#D4AF6A;color:#0a1430;font-weight:700;font-size:18px;border:0;cursor:pointer;font-family:inherit}'+
        '.fn-no{display:block;width:100%;margin-top:10px;padding:14px;border-radius:999px;background:transparent;border:1px solid rgba(245,240,230,.35);color:#F5F0E6;font-size:18px;cursor:pointer;font-family:inherit}';
        document.head.appendChild(st); }
      scrivi(CHIESTO, String(Date.now()));
      var v = document.createElement('div'); v.id = 'fn-velo';
      v.innerHTML = '<div class="fn-f" role="dialog" aria-modal="true" aria-labelledby="fn-tit"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/></svg>'+
        '<h2 id="fn-tit">Attiva le notifiche</h2><p>Gli avvisi dell\'app arrivano anche sul telefono e sul computer.</p><p>Si spengono da I miei dati.</p>'+
        '<button type="button" class="fn-si">Attiva le notifiche</button><button type="button" class="fn-no">Non ora</button></div>';
      document.body.appendChild(v);
      v.querySelector('.fn-no').onclick = function(){ v.remove(); };
      v.querySelector('.fn-si').onclick = function(){
        v.remove();
        Notification.requestPermission().then(function(p){       /* il tocco sul tasto è il gesto che il sistema vuole */
          if(p !== 'granted') return;
          return iscrivi().then(function(s){ return salva(db, s); });
        }).then(aggiornaTasti, aggiornaTasti);
      };
      try{ v.querySelector('.fn-si').focus(); }catch(e){}
    }
    setTimeout(finestra, 2500);
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
    /* 16/11: in strumento.html db non è window.db, quindi partiDaSolo non passava mai l'accesso all'app Android scaricata
       e il suo servizio degli avvisi non partiva (Gab: «continuo a non vedere notifica e numerino»). Si collega qui, prima di tutto:
       dentro l'app scaricata il telefono non ha PushManager, e la riga dopo uscirebbe subito. */
    collegaApp(db);
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
