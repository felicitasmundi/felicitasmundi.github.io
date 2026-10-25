/* Le notifiche sul telefono · 24/10/2026, Gab: «crea anche le notifiche dell'app» (SQL 117, funzione «notifiche», sw.js).
   Uso: <div data-fm-notifiche></div>, solo per chi è entrato: fmNotifiche(db).
   Su iPhone le notifiche esistono solo con l'app messa sullo schermo (iOS 16.4 o più). */
(function(){
  if(window.fmNotifiche) return;
  var VAPID = "BB6GhoQTLwM0w2Cs7PhOSkOvFeUMqqvkmsPlorbnaXO0m6Y03EBZ3NkPUG0W5p_TQ41EKK4fYbWP-GGampqrhXc";   /* la chiave pubblica che crea Gab con chiavi-notifiche.html: finché manca, il tasto non si vede */
  var ok = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
  var ua = navigator.userAgent || "";
  var iphone = /iPhone|iPad|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  var giaApp = (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true;
  var CSS = '.fn-box{margin:14px 0}.fn-tasto{width:100%;padding:16px 20px;border-radius:999px;border:2px solid #d6b56c;background:none;color:#d6b56c;font-family:DM Sans,system-ui,sans-serif;font-weight:600;font-size:19px;cursor:pointer}'+
    '.fn-esito{font-size:18px;color:#F5F0E6;margin:10px 0 0;text-align:center}.fn-mini{display:block;margin:10px auto 0;background:none;border:0;color:#c9c3d6;font-size:16px;text-decoration:underline;cursor:pointer}';
  function chiave(b){ var p = '='.repeat((4 - b.length % 4) % 4), s = atob((b + p).replace(/-/g,'+').replace(/_/g,'/')), a = new Uint8Array(s.length); for(var i=0;i<s.length;i++) a[i]=s.charCodeAt(i); return a; }
  function salva(db, sub){ var j = sub.toJSON(); return db.rpc('fm_push_salva', { p_endpoint: j.endpoint, p_p256dh: j.keys.p256dh, p_auth: j.keys.auth }); }
  function registra(){ return navigator.serviceWorker.register('sw.js'); }
  window.fmNotifiche = function(db){
    if(!VAPID || !ok || !db) return;
    if(!document.getElementById('fn-css')){ var st=document.createElement('style'); st.id='fn-css'; st.textContent=CSS; document.head.appendChild(st); }
    /* chi le ha già attivate: l'iscrizione si rinnova da sola (anche quando cambia l'indirizzo dell'app) */
    if(Notification.permission === 'granted') registra().then(function(r){ return r.pushManager.getSubscription(); }).then(function(s){ if(s) salva(db, s); }).catch(function(){});
    document.querySelectorAll('[data-fm-notifiche]').forEach(function(box){
      if(box._fn) return; box._fn = 1; box.classList.add('fn-box');
      if(iphone && !giaApp){ box.innerHTML = ''; return; }   /* su iPhone prima va messa l'app sullo schermo: lì c'è già il tasto */
      if(Notification.permission === 'denied'){ box.innerHTML = '<p class="fn-esito">Le notifiche sono spente nelle impostazioni del telefono.</p>'; return; }
      var attive = Notification.permission === 'granted';
      box.innerHTML = '<button class="fn-tasto" type="button">'+(attive ? 'Notifiche attive · prova' : 'Attiva le notifiche')+'</button><p class="fn-esito" aria-live="polite"></p>';
      var b = box.querySelector('.fn-tasto'), e = box.querySelector('.fn-esito');
      b.onclick = function(){
        b.disabled = true; e.textContent = 'Un momento…';
        Notification.requestPermission().then(function(p){
          if(p !== 'granted') throw new Error('no');
          return registra().then(function(r){ return navigator.serviceWorker.ready; }).then(function(r){
            return r.pushManager.getSubscription().then(function(s){ return s || r.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: chiave(VAPID) }); });
          });
        }).then(function(s){ return salva(db, s); }).then(function(r){
          if(r && r.error) throw r.error;
          if(r && r.data && r.data !== 'ok'){ e.textContent = r.data; b.disabled = false; return; }
          b.textContent = 'Notifiche attive · prova';
          return db.rpc('fm_notifica_prova').then(function(x){ b.disabled = false; e.textContent = x && x.data === 'ok' ? 'Tra poco arriva una notifica di prova.' : ((x && x.data) || ''); });
        }).catch(function(x){ b.disabled = false; e.textContent = x && x.message === 'no' ? 'Senza il permesso del telefono le notifiche non arrivano.' : 'Non si sono attivate. Si può riprovare.'; });
      };
    });
  };
})();
