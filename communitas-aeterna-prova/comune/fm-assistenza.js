/* Assistenza in fondo a ogni pagina — 5/11/2026, thread «Aprire un canale di assistenza nell'app».
   Gab 10:47: «forse è un contesto che dobrebbe essere in fondo, in ogni pagina?» · 11:08 «procedi su tutto».
   Un solo file: le pagine lo caricano con <script src="comune/fm-assistenza.js" defer></script>
   (dalla pagina del Festival: ../communitas-aeterna-prova/comune/fm-assistenza.js).
   Apre strumento.html?v=assistenza: chi è dentro scrive subito; chi non è entrato scrive con la sua mail e poi entra col Nexus (SQL 167). */
(function(){
  if(window.fmAssistenza) return; window.fmAssistenza = 1;
  var cs = document.currentScript, dove = 'strumento.html?v=assistenza';
  try{ dove = new URL('../strumento.html?v=assistenza', cs.src).href; }catch(e){}
  function monta(){
    if(document.querySelector('.fa-assistenza')) return;
    var st = document.createElement('style');
    st.textContent = '.fa-assistenza{display:flex;justify-content:center;padding:28px max(16px,env(safe-area-inset-left,0px)) calc(28px + env(safe-area-inset-bottom,0px)) max(16px,env(safe-area-inset-right,0px));background:transparent}'+
      '.fa-assistenza a{display:inline-flex;align-items:center;gap:10px;padding:12px 22px;border-radius:999px;border:1.5px solid #D4AF6A;color:#F5F0E6;background:#1a2148;'+
      'font:600 18px system-ui,-apple-system,"Segoe UI",sans-serif;text-decoration:none}'+
      '.fa-assistenza a:focus-visible{outline:2px solid #D4AF6A;outline-offset:3px}';
    document.head.appendChild(st);
    var d = document.createElement('div');
    d.className = 'fa-assistenza';
    d.innerHTML = '<a href="' + dove + '" data-conta="tasto:assistenza">Assistenza</a>';
    document.body.appendChild(d);
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', monta); else monta();
})();
