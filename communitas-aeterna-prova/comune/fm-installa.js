/* Metti l'app sullo schermo — 24/10/2026, Gabriele Dettori: «fai in modo che nell'accesso o da qualche parte funzionale,
   l'utente possa scaricare l'app» · «se uno ha i phone, crea un tasto per far in automatico l'estensione della pagina come app esterna».
   Su iPhone l'aggiunta automatica non esiste: il tasto mostra i due gesti di Safari (Condividi, poi Aggiungi alla schermata Home).
   Su Android e sul computer, quando il browser lo permette, il tasto installa l'app con un tocco.
   Uso: <div data-fm-installa></div>. Chi ha già l'app aperta dalla schermata non vede niente. */
(function(){
  if(window.fmInstalla) return; window.fmInstalla = 1;
  var giaApp = (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true;
  var ua = navigator.userAgent || "";
  var iphone = /iPhone|iPad|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  var safari = iphone && !/CriOS|FxiOS|EdgiOS|GSA\//.test(ua);
  var android = /Android/.test(ua);
  var invito = null;
  window.addEventListener('beforeinstallprompt', function(e){ e.preventDefault(); invito = e; });
  window.addEventListener('appinstalled', function(){ document.querySelectorAll('.fi-box').forEach(function(b){ b.innerHTML = '<p class="fi-ok">L\'app è sul tuo schermo.</p>'; }); });

  var CSS = '.fi-box{margin:14px 0}'+
    '.fi-tasto{width:100%;display:flex;align-items:center;justify-content:center;gap:12px;padding:16px 20px;border-radius:999px;border:2px solid #d6b56c;background:none;color:#d6b56c;font-family:DM Sans,system-ui,-apple-system,sans-serif;font-weight:600;font-size:19px;cursor:pointer}'+
    '.fi-tasto img{width:30px;height:30px;border-radius:50%}'+
    '.fi-guida{margin-top:12px;border:1px solid rgba(214,181,108,.35);border-radius:20px;padding:18px;background:rgba(15,18,38,.92);color:#F5F0E6}'+
    '.fi-guida ol{margin:0;padding-left:26px}.fi-guida li{font-size:20px;line-height:1.5;margin:0 0 10px}'+
    '.fi-guida b{color:#d6b56c}.fi-ic{display:inline-block;vertical-align:-4px;width:24px;height:24px}'+
    '.fi-ok{font-size:19px;color:#d6b56c;text-align:center;margin:0}'+
    '.fi-freccia{position:fixed;left:50%;bottom:8px;transform:translateX(-50%);z-index:50;display:flex;flex-direction:column;align-items:center;gap:4px;padding:12px 16px;border-radius:18px;background:#d6b56c;color:#1A1405;font:600 17px system-ui,-apple-system,sans-serif;box-shadow:0 6px 24px rgba(0,0,0,.4);animation:fi-su 1.2s ease-in-out infinite alternate}'+
    '.fi-freccia span{font-size:30px;line-height:1}'+
    '@keyframes fi-su{from{transform:translate(-50%,0)}to{transform:translate(-50%,-8px)}}';
  var st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);

  var CONDIVIDI = '<svg class="fi-ic" viewBox="0 0 24 24" fill="none" stroke="#d6b56c" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12M8 7l4-4 4 4"/><path d="M6 11H5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-1"/></svg>';
  var PIU = '<svg class="fi-ic" viewBox="0 0 24 24" fill="none" stroke="#d6b56c" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="4"/><path d="M12 8v8M8 12h8"/></svg>';

  function guidaIphone(){
    if(!safari) return '<ol><li>Apri questa pagina con <b>Safari</b>: solo Safari mette l\'app sullo schermo dell\'iPhone.</li>'+
      '<li>Poi tocca di nuovo questo tasto.</li></ol>';
    return '<ol><li>Tocca '+CONDIVIDI+' <b>Condividi</b>, in basso al centro.</li>'+
      '<li>Scorri e tocca '+PIU+' <b>Aggiungi alla schermata Home</b>.</li>'+
      '<li>Tocca <b>Aggiungi</b>, in alto a destra.</li></ol>';
  }
  function guidaAltro(){
    if(android) return '<ol><li>Tocca il menu <b>⋮</b>, in alto a destra.</li><li>Tocca <b>Installa app</b> oppure <b>Aggiungi a schermata Home</b>.</li></ol>';
    return '<ol><li>Nella barra dell\'indirizzo tocca l\'icona <b>Installa</b>, a destra.</li><li>Oppure dal menu del browser scegli <b>Installa FelicitasMundi</b>.</li></ol>';
  }
  function freccia(){
    if(!safari || document.querySelector('.fi-freccia')) return;
    var f = document.createElement('div'); f.className = 'fi-freccia'; f.innerHTML = 'Condividi<span>↓</span>';
    f.onclick = function(){ f.remove(); };
    document.body.appendChild(f);
    setTimeout(function(){ f.remove(); }, 12000);
  }
  function monta(box){
    /* 24/10 13:21, Gab: «riconoscendo il terminale […] in modo da non farlo vedere ad uno che ha android» → il tasto si vede solo su iPhone e iPad */
    if(giaApp || !iphone) return;
    box.classList.add('fi-box');
    box.innerHTML = '<button class="fi-tasto" type="button" data-conta="tasto:installa_app"><img src="icona-felicitas-192.png?v=1024" alt="">Metti l\'app sullo schermo</button><div class="fi-guida" hidden></div>';
    var g = box.querySelector('.fi-guida');
    box.querySelector('.fi-tasto').onclick = function(){
      if(invito){ var e = invito; invito = null; e.prompt(); e.userChoice.then(function(r){ if(r && r.outcome === 'accepted') box.innerHTML = '<p class="fi-ok">L\'app è sul tuo schermo.</p>'; }); return; }
      g.innerHTML = iphone ? guidaIphone() : guidaAltro();
      g.hidden = !g.hidden;
      if(!g.hidden && iphone) freccia();
    };
  }
  function avvia(){ document.querySelectorAll('[data-fm-installa]').forEach(function(b){ if(!b._fi){ b._fi = 1; monta(b); } }); }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', avvia); else avvia();
  window.fmInstallaAvvia = avvia;
})();
