/* Torna all'app — 25/10/2026, Gab: «se entro nell'evento festival esco dalla schermata app e poi non è scontato tornarci».
   Un tasto fisso in alto a sinistra, sulle pagine che si aprono dall'app. Uso: <script src="comune/fm-torna.js"></script>
   28/10/2026, Gab: «se uno entra da home deve tornare in home, se entra in app deve tornare in app».
   La home (accoglienza.html) segna sessionStorage fm_origine=home, l'app (strumento.html) fm_origine=app; ?da=home vale come home.
   Senza origine (link aperto da WhatsApp ecc.) vale data-ignoto sul tag script: "home" sulle pagine pubbliche, altrimenti app. */
(function(){
  if(window.fmTorna) return; window.fmTorna = 1;
  var cs = document.currentScript, ignoto = cs && cs.getAttribute('data-ignoto') === 'home';
  var home = false;
  try{
    if(/[?&]da=home(&|$)/.test(location.search)) sessionStorage.setItem('fm_origine','home');
    var o = sessionStorage.getItem('fm_origine');
    home = o ? o === 'home' : ignoto;
  }catch(e){ home = /[?&]da=home(&|$)/.test(location.search) || ignoto; }
  function monta(){
    if(document.querySelector('.ft-torna')) return;
    var st = document.createElement('style');
    st.textContent = '.ft-torna{position:fixed;top:calc(10px + env(safe-area-inset-top,0px));left:10px;z-index:9999;display:inline-flex;align-items:center;gap:6px;'+
      'padding:10px 16px;border-radius:999px;background:#0A0C1A;color:#d6b56c;border:1.5px solid #d6b56c;font:600 17px system-ui,-apple-system,sans-serif;'+
      'text-decoration:none;box-shadow:0 4px 16px rgba(0,0,0,.35)}body{padding-top:calc(52px + env(safe-area-inset-top,0px))!important}.ft-torna span{font-size:22px;line-height:1}';
    document.head.appendChild(st);
    var a = document.createElement('a');
    a.className = 'ft-torna'; a.href = home ? 'accoglienza.html' : 'strumento.html?v=azione'; a.setAttribute('data-conta', home ? 'tasto:torna_home' : 'tasto:torna_app');
    a.innerHTML = home ? '<span>‹</span> Torna alla home' : '<span>‹</span> Torna all\'app';
    document.body.appendChild(a);
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', monta); else monta();
})();
