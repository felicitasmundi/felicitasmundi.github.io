/* ═══════════════════════════════════════════════════════════════
   FM-SETTIMANA — «La settimana»: gli obiettivi per elemento.

   ⭐ Il disegno è di Design: la-settimana-piatto.html.
      Questo file apre la pagina nel guscio, legge il database e mette i dati.

   COSA MOSTRA: una settimana (lunedì → domenica) e, per ognuno dei sei
   elementi, gli obiettivi con la scadenza in quella settimana — le orme di
   tipo «obiettivo» — coi loro passi (le orme figlie), chi ci sta dentro, e
   lo stadio: seme (in_coda) · in cammino (in_avanzamento) · impronta (sviluppato).
   In cima, i tre conti della settimana; le frecce vanno alla settimana prima
   e dopo. È il ragionamento che vive nell'app: cosa è aperto, cosa è in
   lavorazione, cosa si è chiuso — deciso da Gab il 28 settembre 2026.

   ⛔ Non scrive niente: si apre l'obiettivo e da lì si prende, si chiude,
      si parla — «dentro un'orma» è la base di ogni orma.
   ⚠️ Chi vede cosa (nucleo · ceppo · miceli) aspetta le righe di Gab: oggi
      si vede quello che le regole di riga di `orme` lasciano vedere.

   Vuole:   fm-piatto.js prima · `db` (Supabase) · `vai`
   Espone:  SpazioVivo.settimana(dove, lunedì?)
   ═══════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  var INDIRIZZO = "APP.FELICITASMUNDI/piatti/la-settimana-piatto.html";
  var MESI = ["gennaio","febbraio","marzo","aprile","maggio","giugno","luglio",
              "agosto","settembre","ottobre","novembre","dicembre"];
  var ELEMENTI = [
    { el: "nexus", nome: "⊕ Nexus",  stanza: "Antahkarana · le orme, le squadre" },
    { el: "terra", nome: "🟤 Terra", stanza: "i Vicinati" },
    { el: "acqua", nome: "🔵 Acqua", stanza: "l’Emporio" },
    { el: "fuoco", nome: "🔴 Fuoco", stanza: "l’Assistenza" },
    { el: "aria",  nome: "🟢 Aria",  stanza: "l’Edizione" },
    { el: "etere", nome: "🟣 Etere", stanza: "la Scuola" }
  ];
  var F = function () { return window.FMPiatto; };
  function getdb() { return window.db || (window.parent && window.parent.db) || null; }

  /* ── il tempo ──────────────────────────────────────────────────── */
  function lunediDi(d) {
    var x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    var g = (x.getDay() + 6) % 7;            /* lunedì = 0 */
    x.setDate(x.getDate() - g);
    return x;
  }
  function piu(d, n) { var x = new Date(d); x.setDate(x.getDate() + n); return x; }
  function iso(d) {
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" +
           String(d.getDate()).padStart(2, "0");
  }
  function giornoMese(d) {
    if (!d) return "";
    var x = (d instanceof Date) ? d : new Date(d);
    return isNaN(x) ? "" : x.getDate() + " " + MESI[x.getMonth()];
  }
  function numeroSettimana(d) {           /* ISO 8601 */
    var x = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    var g = x.getUTCDay() || 7;
    x.setUTCDate(x.getUTCDate() + 4 - g);
    var inizio = new Date(Date.UTC(x.getUTCFullYear(), 0, 1));
    return Math.ceil(((x - inizio) / 86400000 + 1) / 7);
  }
  function stadio(s) {
    return s === "sviluppato" ? "impronta" : s === "in_avanzamento" ? "cammino" : "seme";
  }
  function parola(s) {
    return s === "impronta" ? "impronta" : s === "cammino" ? "in cammino" : "seme";
  }
  function titolo(o) {
    if (o && o.titolo) return o.titolo;
    var s = String((o && o.contenuto) || "").trim().split("\n")[0];
    return s.length > 80 ? s.slice(0, 78).trim() + "…" : s;
  }

  /* ── leggere ───────────────────────────────────────────────────── */
  async function leggi(lun) {
    var dom = piu(lun, 6), da = iso(lun), a = iso(dom);
    var d = { obiettivi: [], passi: {}, dentro: {} };
    var db = getdb();
    if (!db) return d;
    try {
      /* gli obiettivi: scadenza nella settimana, oppure senza scadenza e nati nella settimana */
      var o = await db.from("orme")
        .select("id,titolo,contenuto,tipo,elemento,stadio,entro_il,momento,persona_id,dorme_dal,orma_madre_id")
        .eq("tipo", "obiettivo")
        .is("orma_madre_id", null)      /* ⛔ i passi (le figlie) non sono obiettivi: stanno dentro la madre */
        .or("and(entro_il.gte." + da + ",entro_il.lte." + a + ")," +
            "and(entro_il.is.null,momento.gte." + da + "T00:00:00,momento.lte." + a + "T23:59:59)")
        .order("elemento").order("entro_il");
      d.obiettivi = o.error ? [] : (o.data || []).filter(function (x) { return !x.dorme_dal; });
      var ids = d.obiettivi.map(function (x) { return x.id; });
      if (!ids.length) return d;

      /* i passi: le orme figlie */
      var f = await db.from("orme")
        .select("id,titolo,contenuto,stadio,entro_il,orma_madre_id,dorme_dal")
        .in("orma_madre_id", ids).order("momento");
      (f.error ? [] : f.data || []).forEach(function (x) {
        if (x.dorme_dal) return;
        (d.passi[x.orma_madre_id] = d.passi[x.orma_madre_id] || []).push(x);
      });

      /* chi c'è dentro, obiettivi e passi */
      var tutti = ids.slice();
      Object.keys(d.passi).forEach(function (k) { d.passi[k].forEach(function (x) { tutti.push(x.id); }); });
      var p = await db.from("orma_persone")
        .select("orma_id,nome,preso_il,lasciato_il").in("orma_id", tutti);
      (p.error ? [] : p.data || []).forEach(function (r) {
        if (!r.preso_il || r.lasciato_il) return;
        (d.dentro[r.orma_id] = d.dentro[r.orma_id] || []).push(r.nome || "");
      });
    } catch (e) { console.warn("la settimana:", e); }
    return d;
  }

  /* ── dove si va ────────────────────────────────────────────────── */
  function apri(id) {
    if (window.SpazioVivo && typeof window.SpazioVivo.apriOrma === "function")
      return window.SpazioVivo.apriOrma(id);
    if (typeof window.vai === "function") return window.vai("orma", { id: id });
  }

  /* ── disegnare ─────────────────────────────────────────────────── */
  function disegna(R, d, lun, ricarica) {
    var P = F(), dom = piu(lun, 6), oggi = new Date(); oggi.setHours(0, 0, 0, 0);
    var questa = lunediDi(new Date()).getTime() === lun.getTime();

    P.riempi(R, { settimana: {
      date: "dal " + giornoMese(lun) + " al " + giornoMese(dom),
      numero: String(numeroSettimana(lun)), anno: String(dom.getFullYear()) } });
    P.stato(R, "non-oggi", !questa);

    /* i conti: obiettivi e passi insieme */
    var conto = { seme: 0, cammino: 0, impronta: 0 };
    d.obiettivi.forEach(function (o) {
      conto[stadio(o.stadio)]++;
      (d.passi[o.id] || []).forEach(function (x) { conto[stadio(x.stadio)]++; });
    });
    P.riempi(R, { conto: { seme: String(conto.seme), cammino: String(conto.cammino), impronta: String(conto.impronta) } });
    P.stato(R, "vuota", d.obiettivi.length === 0);

    /* i sei elementi, sempre tutti */
    P.stampa(R, "elemento", ELEMENTI, function (c, E) {
      var suoi = d.obiettivi.filter(function (o) { return (o.elemento || "nexus") === E.el; });
      P.riempi(c, { elemento: { elemento: E.el, nome: E.nome, stanza: E.stanza,
                                conto: suoi.length ? String(suoi.length) : "" } });
      P.stato(c, "senza-obiettivi", suoi.length === 0);
      P.stampa(c, "obiettivo", suoi, function (co, o) {
        var st = stadio(o.stadio), passi = d.passi[o.id] || [];
        var fatti = passi.filter(function (x) { return stadio(x.stadio) === "impronta"; }).length;
        var tardi = o.entro_il && new Date(o.entro_il) < oggi && st !== "impronta";
        var chi = d.dentro[o.id] || [];
        P.riempi(co, { obiettivo: {
          titolo: titolo(o),
          stadio: tardi ? "in ritardo" : parola(st),
          entro: o.entro_il ? "entro " + giornoMese(o.entro_il) : "",
          chi: chi.length ? chi.join(" · ") : "nessuno dentro",
          passi: passi.length ? fatti + "/" + passi.length + " passi" : "" } });
        var pill = co.querySelector("[data-pill]");
        if (pill) pill.className = "pill " + (tardi ? "tardi" : st);
        P.stato(co, "ha-passi", passi.length > 0);
        P.stampa(co, "passo", passi, function (cp, x) {
          var sx = stadio(x.stadio), chi2 = d.dentro[x.id] || [];
          cp.setAttribute("data-stadio", sx);
          P.riempi(cp, { passo: { titolo: titolo(x), segno: sx === "impronta" ? "✓" : "",
                                  chi: chi2.join(" · ") } });
        });
        P.gesto(co, "apri", function () { apri(o.id); });
      });
    });

    /* le frecce */
    P.gesto(R, "prima", function () { ricarica(piu(lun, -7)); });
    P.gesto(R, "dopo",  function () { ricarica(piu(lun, 7)); });
    P.gesto(R, "oggi",  function () { ricarica(lunediDi(new Date())); });
  }

  /* ── la porta ──────────────────────────────────────────────────── */
  async function settimana(dove, lun) {
    var box = typeof dove === "string" ? document.querySelector(dove) : dove;
    if (!box || !window.FMPiatto) return;
    var R = await F().monta(box, INDIRIZZO);
    if (R && R.body) R = R.body;
    lun = lunediDi(lun || new Date());
    async function ricarica(l) {
      if (l) lun = l;
      disegna(R, await leggi(lun), lun, ricarica);
    }
    await ricarica();
  }

  window.SpazioVivo = window.SpazioVivo || {};
  window.SpazioVivo.settimana = settimana;
  window.FMSettimana = { disegna: disegna, leggi: leggi };   /* per le prove */
})();
