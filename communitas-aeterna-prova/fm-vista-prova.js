/* fm-vista-prova.js — SOLO NELLE VERSIONI PROVA.
   ⭐ 30 settembre, Gab: «d'ora in poi per ogni contesto di creazione, sviluppiamo sia visione
      computer che visione telefono … inseriscimi un bottone nelle versioni prova».
   Un bottone in basso a sinistra apre la stessa pagina dentro una cornice larga come un
   telefono (390 × 844): le regole per il telefono scattano davvero, come su un telefono vero.
   Dentro la cornice il bottone non compare. */
(function () {
  "use strict";
  if (window.top !== window.self) return;                 // dentro la cornice: niente bottone
  if (!/communitas-aeterna-prova|localhost|127\.0\.0\.1/.test(location.href)) return;

  var st = document.createElement("style");
  st.textContent =
    "#fm-vp-b{position:fixed;left:.8rem;bottom:.8rem;z-index:2147483000;display:flex;gap:.3rem;" +
    "padding:.3rem;border-radius:999px;background:rgba(8,11,26,.82);border:1px solid rgba(212,175,106,.5);" +
    "box-shadow:0 .4rem 1.2rem rgba(0,0,0,.4);font:500 .72rem/1 'DM Sans',system-ui,sans-serif}" +
    "#fm-vp-b button{all:unset;cursor:pointer;padding:.45rem .7rem;border-radius:999px;color:rgba(245,240,230,.7);letter-spacing:.06em}" +
    "#fm-vp-b button[aria-pressed=true]{background:#D4AF6A;color:#0A0C1A}" +
    "#fm-vp-v{position:fixed;inset:0;z-index:2147482999;background:rgba(2,4,12,.9);display:none;align-items:center;justify-content:center}" +
    "#fm-vp-v.on{display:flex}" +
    "#fm-vp-v .tel{width:390px;height:min(844px,calc(100vh - 2rem));border-radius:2.2rem;border:10px solid #1a1d2e;" +
    "box-shadow:0 0 0 1px rgba(212,175,106,.4),0 1.5rem 3rem rgba(0,0,0,.6);overflow:hidden;background:#000}" +
    "#fm-vp-v iframe{width:100%;height:100%;border:0;display:block}" +
    "@media(max-width:600px){#fm-vp-b{display:none}}";   // sul telefono vero non serve
  document.head.appendChild(st);

  var b = document.createElement("div");
  b.id = "fm-vp-b";
  b.innerHTML = '<button type="button" data-v="pc" aria-pressed="true">computer</button>' +
                '<button type="button" data-v="tel" aria-pressed="false">telefono</button>';
  var v = document.createElement("div");
  v.id = "fm-vp-v";
  v.innerHTML = '<div class="tel"><iframe title="la pagina vista dal telefono"></iframe></div>';

  function metti() {
    document.body.appendChild(v);
    document.body.appendChild(b);
  }
  function scegli(quale) {
    var tel = quale === "tel";
    b.querySelector('[data-v="pc"]').setAttribute("aria-pressed", tel ? "false" : "true");
    b.querySelector('[data-v="tel"]').setAttribute("aria-pressed", tel ? "true" : "false");
    var f = v.querySelector("iframe");
    if (tel) { f.src = location.href; v.classList.add("on"); }
    else { v.classList.remove("on"); f.removeAttribute("src"); }
  }
  b.addEventListener("click", function (e) {
    var x = e.target.closest("button");
    if (x) scegli(x.getAttribute("data-v"));
  });
  v.addEventListener("click", function (e) { if (e.target === v) scegli("pc"); });

  if (document.body) metti(); else document.addEventListener("DOMContentLoaded", metti);
})();
