/* Torna all'app — 25/10/2026, Gab: «se entro nell'evento festival esco dalla schermata app e poi non è scontato tornarci».
   Un tasto fisso in alto a sinistra, sulle pagine che si aprono dall'app. Uso: <script src="comune/fm-torna.js"></script> */
(function(){
  if(window.fmTorna) return; window.fmTorna = 1;
  function monta(){
    if(document.querySelector('.ft-torna')) return;
    var st = document.createElement('style');
    st.textContent = '.ft-torna{position:fixed;top:calc(10px + env(safe-area-inset-top,0px));left:10px;z-index:9999;display:inline-flex;align-items:center;gap:6px;'+
      'padding:10px 16px;border-radius:999px;background:#0A0C1A;color:#d6b56c;border:1.5px solid #d6b56c;font:600 17px system-ui,-apple-system,sans-serif;'+
      'text-decoration:none;box-shadow:0 4px 16px rgba(0,0,0,.35)}body{padding-top:calc(52px + env(safe-area-inset-top,0px))!important}.ft-torna span{font-size:22px;line-height:1}';
    document.head.appendChild(st);
    var a = document.createElement('a');
    a.className = 'ft-torna'; a.href = 'strumento.html?v=azione'; a.setAttribute('data-conta', 'tasto:torna_app');
    a.innerHTML = '<span>‹</span> Torna all\'app';
    document.body.appendChild(a);
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', monta); else monta();
})();
