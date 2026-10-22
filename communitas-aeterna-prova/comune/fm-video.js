/* I video come nei feed — 22/10/2026, Gabriele Dettori: niente parte ferma con «Guarda»; il video parte da solo,
   «come se si dezoomano … mentre passi, così gli dà un movimento» (modello: apple.com/it/privacy).
   Uso: <div class="fm-vid"><iframe data-fm-video="video/villaggi-e-vicinati.html" title="…"></iframe></div>
   - quando il riquadro entra nello schermo il video si carica e parte dal primo quadro, in ciclo (senza #pagina);
     i comandi (Pausa, avanti, indietro) compaiono al tocco, dentro il video;
   - quando esce dallo schermo si toglie: niente batteria consumata, e al ritorno riparte dall'inizio;
   - mentre si scorre il riquadro cresce da piccolo a pieno (scala 0,86 → 1), salvo «riduci movimento». */
(function(){
  if(window.fmVideo) return;
  var fermo = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var visti = [];
  var io = ('IntersectionObserver' in window) ? new IntersectionObserver(function(es){
    es.forEach(function(x){
      var f = x.target, src = f.getAttribute('data-fm-video');
      if(x.isIntersecting && x.intersectionRatio >= .35){ if(f.getAttribute('src') !== src) f.setAttribute('src', src); }
      else if(!x.isIntersecting){ if(f.getAttribute('src') && f.getAttribute('src') !== 'about:blank') f.setAttribute('src', 'about:blank'); }
    });
  }, {threshold:[0, .35]}) : null;

  function cresci(){
    var h = window.innerHeight || 800;
    visti.forEach(function(f){
      var box = f.parentNode; if(!box || !box.classList.contains('fm-vid')) return;
      var r = box.getBoundingClientRect();
      if(r.bottom < 0 || r.top > h) return;
      /* 0 quando la cima del riquadro è in fondo allo schermo, 1 quando arriva a un terzo dall'alto */
      var p = Math.max(0, Math.min(1, (h - r.top) / (h * .67)));
      box.style.transform = 'scale(' + (.86 + .14 * p).toFixed(4) + ')';
      box.style.opacity = (.55 + .45 * p).toFixed(3);
    });
  }
  var inCoda = false;
  function scorri(){ if(inCoda) return; inCoda = true; requestAnimationFrame(function(){ inCoda = false; cresci(); }); }

  function cerca(radice){
    (radice || document).querySelectorAll('iframe[data-fm-video]').forEach(function(f){
      if(f._fmv) return; f._fmv = 1; visti.push(f);
      if(io) io.observe(f); else f.setAttribute('src', f.getAttribute('data-fm-video'));
    });
    if(!fermo) cresci();
  }
  window.fmVideo = { cerca: cerca };
  if(!fermo){ addEventListener('scroll', scorri, {passive:true}); addEventListener('resize', scorri, {passive:true});
    document.addEventListener('scroll', scorri, {passive:true, capture:true}); }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function(){ cerca(); }); else cerca();
  /* le pagine che disegnano dopo (l'app) */
  if('MutationObserver' in window) new MutationObserver(function(){ if(cerca._c) return; cerca._c = setTimeout(function(){ cerca._c = 0; cerca(); }, 120); }).observe(document.documentElement, {childList:true, subtree:true});
})();
