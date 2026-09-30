/* fm-tira.js — trascina giù dall'alto per aggiornare.
   ⭐ 30 settembre, Gab: «io non ho mai visto nessuna app che ha la scritta aggiorna» — il gesto di
   tutte le app: quando la pagina è in cima, si trascina giù; un cerchio d'oro si riempie, e lasciando
   la pagina si ricarica fresca, nella stessa stanza.
   Le stanze vivono in finestre interne: fm-piatto.js passa qui i loro tocchi (window.fmTira). */
(function () {
  "use strict";
  if (window.fmTira) return;
  var SOGLIA = 90, inizio = null, tirato = 0, attivo = false;
  var st = document.createElement("style");
  st.textContent =
    "#fm-tira{position:fixed;left:50%;top:.6rem;z-index:2147483200;width:2.6rem;height:2.6rem;margin-left:-1.3rem;border-radius:50%;" +
    "background:rgba(10,12,26,.92);border:1px solid rgba(212,175,106,.45);display:grid;place-items:center;pointer-events:none;" +
    "opacity:0;transform:translateY(-3rem);transition:opacity .15s}" +
    "#fm-tira svg{width:1.6rem;height:1.6rem}" +
    "#fm-tira.via svg{animation:fmTiraGira .8s linear infinite}" +
    "@keyframes fmTiraGira{to{transform:rotate(360deg)}}";
  document.head.appendChild(st);
  var el = document.createElement("div");
  el.id = "fm-tira";
  el.innerHTML = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="rgba(212,175,106,.2)" stroke-width="2"/>' +
    '<circle class="arco" cx="12" cy="12" r="9" fill="none" stroke="#D4AF6A" stroke-width="2" stroke-linecap="round" ' +
    'stroke-dasharray="56.5" stroke-dashoffset="56.5" transform="rotate(-90 12 12)"/></svg>';
  function metti() { if (!el.parentNode && document.body) document.body.appendChild(el); }
  function inCima() {
    var c = document.getElementById("centro");
    return (!c || c.scrollTop <= 0) && (window.scrollY || 0) <= 0 && !document.body.classList.contains("barra-aperta");
  }
  function mostra(d) {
    metti();
    var p = Math.min(1, d / SOGLIA);
    el.style.opacity = d > 8 ? "1" : "0";
    el.style.transform = "translateY(" + (Math.min(d, SOGLIA * 1.3) * .6 - 48) + "px)";
    el.querySelector(".arco").setAttribute("stroke-dashoffset", String(56.5 * (1 - p)));
  }
  function nascondi() { el.style.opacity = "0"; el.style.transform = "translateY(-3rem)"; }
  function ricarica() {
    el.classList.add("via");
    try {
      var u = new URL(location.href);
      u.searchParams.set("avvio", Date.now());
      location.replace(u.toString());
    } catch (x) { location.reload(); }
  }
  window.fmTira = {
    inizio: function (y) { attivo = inCima(); inizio = attivo ? y : null; tirato = 0; },
    muovi: function (y) {
      if (inizio === null) return;
      tirato = y - inizio;
      if (tirato <= 0) { nascondi(); return; }
      mostra(tirato);
    },
    fine: function () {
      if (inizio === null) return;
      if (tirato >= SOGLIA) ricarica(); else nascondi();
      inizio = null; tirato = 0;
    }
  };
  function lega(doc) {
    doc.addEventListener("touchstart", function (e) { window.fmTira.inizio(e.touches[0].screenY); }, { passive: true });
    doc.addEventListener("touchmove", function (e) { window.fmTira.muovi(e.touches[0].screenY); }, { passive: true });
    doc.addEventListener("touchend", function () { window.fmTira.fine(); }, { passive: true });
    doc.addEventListener("touchcancel", function () { window.fmTira.fine(); }, { passive: true });
  }
  window.fmTira.lega = lega;
  lega(document);
})();
