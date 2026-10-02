/* ═══════════════════════════════════════════════════════════════
   FM-SCARICA — il tasto «scarica l'app», in ogni orma e in ogni evento.
   ⭐ 2 ottobre 2026, Gab: «inserisci scarica l'app prima di entra nel villaggio,
      questo deve valere in ogni orma, compreso in questa eventi / se scarichi app
      poi devi tornare nella pagina in cui eri».
   Il tasto porta a felicitas-app.html?torna=<la pagina>, che offre «torna dove eri».
   Dentro l'app il tasto non c'è.
   Espone: window.FMScarica = { metti(R, torna, prima | null, dopo | null) }
   ═══════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  function dentroApp() {
    return !!window.FelicitasApp || /FelicitasApp\//.test(navigator.userAgent || "");
  }

  function metti(R, torna, prima, dopo) {
    if (!R) return null;
    var vecchio = R.querySelector("#fm-scarica"); if (vecchio) vecchio.remove();
    if (dentroApp()) return null;
    var doc = R.ownerDocument || document;
    var a = doc.createElement("a");
    a.id = "fm-scarica"; a.href = "#";
    a.setAttribute("style", "align-self:flex-start;min-height:3rem;display:inline-flex;align-items:center;gap:.6rem;padding:.6rem 1.3rem;margin:.6rem 0;border-radius:999px;border:1px solid rgba(212,175,106,.55);background:rgba(212,175,106,.08);font-family:'Cinzel',serif;font-size:.9rem;letter-spacing:.12em;text-transform:uppercase;color:#D4AF6A;text-decoration:none;width:fit-content");
    a.innerHTML = "scarica l&rsquo;app <span aria-hidden=\"true\">&rsaquo;</span>";
    a.onclick = function (e) {
      e.preventDefault(); e.stopPropagation();
      var url = "felicitas-app.html?torna=" + encodeURIComponent(torna || "index.html");
      try { (window.top || window).location.href = url; } catch (er) { location.href = url; }
    };
    if (prima && prima.parentNode) prima.parentNode.insertBefore(a, prima);
    else if (dopo && dopo.parentNode) dopo.parentNode.insertBefore(a, dopo.nextSibling);
    else return null;
    return a;
  }

  window.FMScarica = { metti: metti };
})();
