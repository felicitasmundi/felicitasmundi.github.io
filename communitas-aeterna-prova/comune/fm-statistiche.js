/* ═══════════════════════════════════════════════════════════════
   FELICITASMUNDI · LE STATISTICHE DI LETTURA · comune/fm-statistiche.js
   Gab, 11 ottobre 2026: «mettere associato al database i dati di statistica
   rispetto alla lettura … minutaggio di quanto tempo uno ci sta dentro, tutti i
   dati di quante persone pigiano i vari tasti e tutto il resto».

   Si carica in fondo a una pagina così:
     <script src="comune/fm-statistiche.js" data-pagina="festival-trame"></script>

   Cosa manda al database (tavola letture_pagine, via fm_segna_lettura — SQL 53):
     apre    · quando la pagina si apre: da dove si arriva (solo il sito, non l'indirizzo
               intero), la larghezza dello schermo, la lingua del telefono
     vede    · ogni sezione che entra nello schermo, una volta sola
     tocca   · ogni tasto o collegamento toccato (il suo nome, o il testo)
     lingua  · la lingua scelta per l'invito
     resta   · ogni 30 secondi e quando si esce: i secondi passati con la pagina
               davanti (lo sfondo non conta). Vale l'ultimo valore per sessione.

   Cosa NON manda: nessun nome, nessuna mail, nessun indirizzo IP, nessun cookie.
   La sessione è un numero a caso che vive solo finché la scheda è aperta
   (sessionStorage): chiusa la scheda, non esiste più.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  var FM_URL = "https://gfnveesogkfvkrdudpfg.supabase.co";
  var FM_CHIAVE = "sb_publishable_4_kJlYwWuqsahMBw7Um2mg_lsYH9ogU";
  var me = document.currentScript;
  var pagina = (me && me.getAttribute("data-pagina")) || location.pathname.split("/").pop().replace(/\.html$/, "");

  /* la sessione: un numero a caso finché la scheda è aperta */
  var sessione;
  try {
    sessione = sessionStorage.getItem("fm_sessione");
    if (!sessione) { sessione = Math.random().toString(36).slice(2, 10) + Date.now().toString(36); sessionStorage.setItem("fm_sessione", sessione); }
  } catch (e) { sessione = Math.random().toString(36).slice(2, 10) + Date.now().toString(36); }

  var daDove = "";
  try { daDove = document.referrer ? new URL(document.referrer).hostname : ""; } catch (e) {}
  var lingua = (navigator.language || "").slice(0, 5);
  var larghezza = Math.round(window.innerWidth || 0);

  function manda(evento, dettaglio, secondi, ultimo) {
    var corpo = JSON.stringify({ p_pagina: pagina, p_sessione: sessione, p_evento: evento, p_dettaglio: dettaglio || null, p_secondi: secondi == null ? null : Math.round(secondi), p_larghezza: larghezza, p_lingua: lingua, p_da: daDove });
    var dove = FM_URL + "/rest/v1/rpc/fm_segna_lettura";
    try {
      /* ⭐ 12 ott (controllo): sendBeacon manda i cookie e il server risponde «*» → il navigatore lo blocca (CORS).
         fetch con keepalive parte lo stesso all'uscita, senza cookie. */
      fetch(dove, { method: "POST", keepalive: true, credentials: "omit", headers: { "Content-Type": "application/json", "apikey": FM_CHIAVE, "Authorization": "Bearer " + FM_CHIAVE }, body: corpo }).catch(function () {});
    } catch (e) {}
  }

  /* il tempo con la pagina davanti */
  var secondi = 0, da = Date.now(), davanti = !document.hidden;
  function conta() { if (davanti) { secondi += (Date.now() - da) / 1000; } da = Date.now(); }
  document.addEventListener("visibilitychange", function () { conta(); davanti = !document.hidden; if (document.hidden) manda("resta", null, secondi, true); });
  window.addEventListener("pagehide", function () { conta(); manda("resta", null, secondi, true); });
  setInterval(function () { conta(); if (davanti) manda("resta", null, secondi); }, 30000);

  /* si apre */
  manda("apre", (document.title || "").slice(0, 80));

  /* le sezioni che entrano nello schermo, una volta sola */
  if ("IntersectionObserver" in window) {
    var viste = {};
    var oss = new IntersectionObserver(function (voci) {
      voci.forEach(function (v) { if (v.isIntersecting) { var id = v.target.id; if (!viste[id]) { viste[id] = true; manda("vede", id); } } });
    }, { threshold: 0.3 });
    Array.prototype.forEach.call(document.querySelectorAll("section[id], div[id].apertura, [data-vede]"), function (s) { oss.observe(s); });
  }

  /* i tasti e i collegamenti */
  document.addEventListener("click", function (e) {
    var t = e.target.closest("button, a, .fm-chip, .fm-tasto");
    if (!t) return;
    var nome = t.getAttribute("data-s") || t.getAttribute("aria-label") || (t.textContent || "").replace(/\s+/g, " ").trim().slice(0, 40);
    if (!nome) return;
    if (t.closest(".lingue")) { manda("lingua", nome); return; }
    manda("tocca", nome);
  }, true);
})();
