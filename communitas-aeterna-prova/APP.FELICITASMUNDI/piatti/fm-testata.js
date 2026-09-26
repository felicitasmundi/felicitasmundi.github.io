/* ═══════════════════════════════════════════════════════════════
   FM-TESTATA — la testata del guscio, da testata-guscio.html.

   ⭐ La testata è UNA SOLA per tutte le pagine e sta nel guscio,
      FUORI dalla finestra delle pagine piatte. Per questo la radio
      continua a suonare mentre si cambia pagina.

   LA RADIO — «Come Natura Crea FM», su AzuraCast:
     ascolto:        radio.felicitasmundi.com/listen/radio_felicitasmundi/radio.mp3
     cosa suona:     radio.felicitasmundi.com/api/nowplaying/radio_felicitasmundi
     · si tocca il tasto → suona; si ritocca → si ferma
     · mentre suona, il segno diventa la pausa, e il titolo del tasto dice
       cosa sta passando
     · ⛔ non parte mai da sola: parte solo quando qualcuno la tocca
     · se la radio non risponde, il segno torna al play e basta

   IL CARRELLO: il numero delle cose nel carrello, se ce ne sono.
     ⚠️ La tavola del carrello è scritta ma non ancora lanciata: finché
        non c'è, il numero non si vede.

   ⚠️ ASPETTA: il ☰ apre la barra — la chiamata giusta la conferma il GUSCIO.

   Vuole:   fm-piatto.js prima · `db` (Supabase) · `vai`
   Espone:  SpazioVivo.testata(dove)   — dove: la <header class="gs-testa">
            SpazioVivo.radio            — { suona, ferma, suonando }
   ═══════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  var ASCOLTO = "https://radio.felicitasmundi.com/listen/radio_felicitasmundi/radio.mp3";
  var ORA     = "https://radio.felicitasmundi.com/api/nowplaying/radio_felicitasmundi";
  var NOME    = "Come Natura Crea FM";
  var PLAY    = "M9.5 7.5v9l7-4.5z";
  var PAUSA   = "M9 7.5h2.2v9H9zM12.8 7.5H15v9h-2.2z";

  var F = function () { return window.FMPiatto; };
  var audio = null, tasto = null, giro = null;

  /* ── la radio ──────────────────────────────────────────────────── */
  function segno(suona) {
    if (!tasto) return;
    var p = tasto.querySelector("svg path");
    if (p) p.setAttribute("d", suona ? PAUSA : PLAY);
    tasto.setAttribute("aria-pressed", suona ? "true" : "false");
  }

  async function cosaSuona() {
    try {
      var r = await fetch(ORA, { cache: "no-store" });
      if (!r.ok) return;
      var j = await r.json();
      var s = j && j.now_playing && j.now_playing.song;
      var t = s ? [s.artist, s.title].filter(Boolean).join(" \u2014 ") : "";
      if (tasto) tasto.setAttribute("title", t ? NOME + " \u00b7 " + t : NOME);
    } catch (e) { /* se non risponde, il titolo resta il nome */ }
  }

  function suona() {
    if (!audio) {
      audio = new Audio();
      audio.preload = "none";
      audio.addEventListener("error", function () { segno(false); });
      audio.addEventListener("pause", function () { segno(false); });
      audio.addEventListener("playing", function () { segno(true); });
    }
    /* ⭐ un indirizzo nuovo ogni volta: la diretta riparte da ADESSO,
       non da dove era rimasta nella memoria del telefono */
    audio.src = ASCOLTO + "?t=" + Date.now();
    var p = audio.play();
    if (p && p.catch) p.catch(function () { segno(false); });
    segno(true);
    cosaSuona();
    clearInterval(giro);
    giro = setInterval(cosaSuona, 30000);
  }

  function ferma() {
    if (audio) { audio.pause(); audio.removeAttribute("src"); audio.load && audio.load(); }
    clearInterval(giro);
    segno(false);
    if (tasto) tasto.setAttribute("title", NOME);
  }

  function suonando() { return !!(audio && !audio.paused && audio.src); }

  /* ── il carrello: quante cose ci sono dentro ───────────────────── */
  async function contaCarrello(T) {
    var n = 0;
    try {
      var u = await db.auth.getUser();
      var id = u && u.data && u.data.user && u.data.user.id;
      if (id) {
        var r = await db.from("carrello").select("id", { count: "exact", head: true })
          .eq("persona_id", id).eq("faccia", "in_corso");
        if (!r.error) n = r.count || 0;
      }
    } catch (e) { n = 0; }
    /* il numero si vede solo se c'è qualcosa dentro */
    F().riempi(T, { conto: { carrello: n > 0 ? String(n) : "" } });
  }

  /* ── la porta ──────────────────────────────────────────────────── */
  function testata(dove) {
    var T = typeof dove === "string" ? document.querySelector(dove)
          : (dove || document.querySelector(".gs-testa"));
    if (!T || !window.FMPiatto) return;
    var P = F();

    tasto = T.querySelector('[data-g="apri-radio"]');
    if (tasto) tasto.setAttribute("title", NOME);
    segno(suonando());

    P.gesto(T, "apri-radio", function () { suonando() ? ferma() : suona(); });
    P.gesto(T, "apri-carrello", function () {
      if (typeof window.vai === "function") window.vai("carrello");
    });
    P.gesto(T, "apri-menu", function () {
      if (window.SpazioVivo && typeof window.SpazioVivo.apriBarra === "function")
        return window.SpazioVivo.apriBarra();
      document.body.classList.toggle("barra-aperta");
    });

    contaCarrello(T);
  }

  window.SpazioVivo = window.SpazioVivo || {};
  window.SpazioVivo.testata = testata;
  window.SpazioVivo.radio = { suona: suona, ferma: ferma, suonando: suonando };
})();
