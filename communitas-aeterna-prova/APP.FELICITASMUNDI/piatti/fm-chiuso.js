/* ═══════════════════════════════════════════════════════════════
   FM-CHIUSO — quando una pagina non si può vedere.
   ⭐ 2 ottobre 2026 21:41, Gab: «non deve succedere in nessuna pagina che quando uno non ha una
      visibilità si veda così… al limite va settata una finestra che spiega che si accede attraverso
      il praticantato». Al posto della pagina vuota, una finestra sola.
   Testi: le parole di Gab (21:41) e la regola del canone (fm-regole.js).
   Espone: window.FMChiuso(dove, io)
   ═══════════════════════════════════════════════════════════════ */
(function () {
  "use strict";
  function accesso() {
    var inv = ""; try { var v = new URLSearchParams(location.search).get("invito"); if (v) inv = "&invito=" + encodeURIComponent(v); } catch (e) {}
    return "accesso.html?torna=" + encodeURIComponent(location.pathname + location.search) + inv;
  }
  window.FMChiuso = function (dove, io) {
    var box = typeof dove === "string" ? document.querySelector(dove) : dove;
    if (!box) return;
    var T = "font-family:'Cinzel',serif;letter-spacing:.12em;text-transform:uppercase";
    box.innerHTML =
      '<div style="min-height:60vh;display:flex;align-items:center;justify-content:center;padding:1.5rem 1rem;box-sizing:border-box">' +
      '<div style="width:min(30rem,100%);border:1px solid rgba(212,175,106,.45);border-radius:1.2rem;background:rgba(8,11,26,.75);padding:1.6rem 1.3rem;display:flex;flex-direction:column;gap:1rem;text-align:center;color:#F5F0E6">' +
      '<svg viewBox="0 0 40 60" width="34" height="50" style="align-self:center" fill="none" stroke="#D4AF6A" stroke-width="2.2"><circle cx="9" cy="8" r="4.5"/><circle cx="18" cy="5" r="3.6"/><circle cx="26" cy="6" r="3"/><circle cx="32" cy="9" r="2.5"/><path d="M14 18c9-2 17 3 15 13-1 6-6 9-5 16 1 6-4 10-9 9-6-1-8-7-6-13 2-7-3-11-3-17 0-4 3-7 8-8z"/></svg>' +
      '<div style="' + T + ';font-size:.95rem;color:#D4AF6A">Si accede attraverso il praticantato</div>' +
      '<div style="font-family:\'Cormorant Garamond\',Georgia,serif;font-size:1.2rem;line-height:1.45;color:rgba(245,240,230,.85)">Servire per almeno quattro ore dà accesso al praticantato e agli scambi. Supportare in un bisogno pubblico è già servizio.</div>' +
      (io
        ? '<a href="#" data-chiuso-torna style="' + T + ';font-size:.8rem;padding:.85rem 1rem;border-radius:999px;border:1px solid rgba(212,175,106,.55);color:#D4AF6A;text-decoration:none">torna</a>'
        : '<a href="' + accesso() + '" style="' + T + ';font-size:.8rem;padding:.85rem 1rem;border-radius:999px;background:#D4AF6A;color:#0A0C1A;text-decoration:none">entra</a>') +
      '</div></div>';
    var t = box.querySelector("[data-chiuso-torna]");
    if (t) t.onclick = function (e) {
      e.preventDefault();
      if (typeof window.vai === "function") return window.vai(window.ormaDa || "orme");
      history.back();
    };
  };
})();
