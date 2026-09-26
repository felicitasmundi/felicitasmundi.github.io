/* ═══════════════════════════════════════════════════════════════
   FM-ORMA-MIA — «La mia orma», dalla versione piatta di Design.

   ⭐ Il disegno è tutto di Design: la-mia-orma-piatto.html.
      Questo file non disegna niente. Apre la pagina in una finestra
      dentro il guscio (FMPiatto.monta), legge il database e mette
      i dati nei buchi.

   ⭐ Lo script di Design gira da solo dentro la finestra: il passaggio
      fra Talenti · Squadre · Strumenti e l'apertura del pannello
      «dove sei» li fa lui. ⛔ Qui non si toccano, se no scattano due volte.

   COME SI RAGGRUPPANO LE ORME — dal canone, perché il vecchio codice
   non l'aveva mai fatto:
     · la RADICE di un talento è l'orma con talento_id = quel talento:
       nasce quando lo si sceglie
     · le orme DI quel talento sono quelle legate alla radice
       (filo_id o orma_madre_id = la radice)
     · «Da collegare» sono le orme senza talento, senza filo e senza
       madre — fino a tre
     · un talento è FERMO se sotto la radice non c'è niente
   LE SQUADRE: le orme dove sono dentro con altre persone
     (fm_mie_squadre_dettaglio), e le stanze dove hanno pubblicato
     (fm_squadra_stanze).

   Vuole:   fm-piatto.js caricato prima · `db` (Supabase) · `vai`
   Espone:  SpazioVivo.ormaMia(dove)
   ═══════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  /* ⚠️ dove sta la pagina, da index.html — cambia se cambia la cartella */
  var INDIRIZZO = "APP.FELICITASMUNDI/piatti/la-mia-orma-piatto.html";

  var STANZE = {
    vicinati:   { nome: "I Vicinati",    el: "terra" },
    emporio:    { nome: "L\u2019Emporio",    el: "acqua" },
    assistenza: { nome: "L\u2019Assistenza", el: "fuoco" },
    edizione:   { nome: "L\u2019Edizione",   el: "aria"  },
    scuola:     { nome: "La Scuola",     el: "etere" }
  };
  var MESI = ["gennaio","febbraio","marzo","aprile","maggio","giugno","luglio",
              "agosto","settembre","ottobre","novembre","dicembre"];

  var F = function () { return window.FMPiatto; };

  function giornoMese(d) {
    if (!d) return "";
    var x = (d instanceof Date) ? d : new Date(d);
    if (isNaN(x)) return "";
    return x.getDate() + " " + MESI[x.getMonth()];
  }
  function nOrme(n) { return n === 1 ? "1 orma" : n + " orme"; }

  /* ⭐ il Megafono scrive il testo e non il titolo: dove il titolo manca,
     si vede l'inizio del testo — la prima riga, al massimo 70 caratteri */
  function titolo(o) {
    if (o && o.titolo) return o.titolo;
    var s = String((o && o.contenuto) || "").trim().split("\n")[0];
    return s.length > 70 ? s.slice(0, 68).trim() + "\u2026" : s;
  }


  /* ⭐ la luna di oggi: nel database non c'è, è un conto astronomico.
     Si parte da una luna nuova nota (6 gennaio 2000, 18:14 UTC) e si
     contano i mesi lunari di 29,53 giorni. */
  var LUNE = [[1.84566,"luna nuova","\uD83C\uDF11"],[5.53699,"luna crescente","\uD83C\uDF12"],
              [9.22831,"primo quarto","\uD83C\uDF13"],[12.91963,"gibbosa crescente","\uD83C\uDF14"],
              [16.61096,"luna piena","\uD83C\uDF15"],[20.30228,"gibbosa calante","\uD83C\uDF16"],
              [23.99361,"ultimo quarto","\uD83C\uDF17"],[27.68493,"luna calante","\uD83C\uDF18"],
              [99,"luna nuova","\uD83C\uDF11"]];
  function luna(quando) {
    var giorni = ((quando || new Date()) - Date.UTC(2000, 0, 6, 18, 14)) / 86400000;
    var eta = ((giorni % 29.530588853) + 29.530588853) % 29.530588853;
    for (var i = 0; i < LUNE.length; i++) if (eta < LUNE[i][0]) return { nome: LUNE[i][1], segno: LUNE[i][2] };
  }

  /* ── leggere ───────────────────────────────────────────────────── */
  async function leggi() {
    var d = { io: null, orme: [], talenti: {}, micelio: [], santo: "",
              comune: "", squadre: [], rubrica: null };
    try {
      var u = await db.auth.getUser();
      var id = u && u.data && u.data.user && u.data.user.id;
      if (!id) return d;

      var p = await db.from("persone")
        .select("id,nome,grado,foto_url,comune_cod").eq("id", id).single();
      if (!p.error) d.io = p.data;

      var o = await db.from("orme")
        .select("id,titolo,contenuto,sottotitolo,elemento,stadio,luogo,accaduto_il," +
                "talento_id,orma_madre_id,filo_id,tipo,momento")
        .eq("persona_id", id).order("momento", { ascending: false }).limit(200);
      d.orme = o.error ? [] : (o.data || []);

      /* i talenti delle radici, col loro segno */
      var tid = d.orme.filter(function (x) { return x.talento_id; })
                      .map(function (x) { return x.talento_id; });
      if (tid.length) {
        var t = await db.from("talenti")
          .select("id,nome,stanza,elemento,svg").in("id", tid);
        (t.error ? [] : t.data || []).forEach(function (r) { d.talenti[r.id] = r; });
      }

      /* il micelio: chi lavora colle mie orme, col colore dell'orma */
      var ids = d.orme.map(function (x) { return x.id; }).slice(0, 60);
      if (ids.length) {
        var op = await db.from("orma_persone")
          .select("persona_id,orma_id").in("orma_id", ids).is("lasciato_il", null);
        var per = {};
        (op.error ? [] : op.data || []).forEach(function (r) {
          if (!r.persona_id || r.persona_id === id || per[r.persona_id]) return;
          var orm = d.orme.filter(function (x) { return x.id === r.orma_id; })[0];
          per[r.persona_id] = { elemento: (orm && orm.elemento) || "terra" };
        });
        d.micelio = Object.keys(per).map(function (k) { return per[k]; });
      }

      /* il santo di oggi */
      var oggi = new Date();
      var mmgg = String(oggi.getMonth() + 1).padStart(2, "0") + "-" +
                 String(oggi.getDate()).padStart(2, "0");
      var sa = await db.from("santi").select("nome").eq("giorno", mmgg).limit(1);
      if (!sa.error && sa.data && sa.data[0]) d.santo = sa.data[0].nome;

      /* il nome del comune */
      if (d.io && d.io.comune_cod) {
        var c = await db.from("territori").select("nome")
          .eq("codice", d.io.comune_cod).limit(1);
        if (!c.error && c.data && c.data[0]) d.comune = c.data[0].nome;
      }

      /* le squadre, e dove hanno pubblicato */
      var sq = await db.rpc("fm_mie_squadre_dettaglio");
      d.squadre = sq.error ? [] : (sq.data || []);
      for (var i = 0; i < d.squadre.length; i++) {
        var st = await db.rpc("fm_squadra_stanze", { p_orma: d.squadre[i].id });
        d.squadre[i].stanze = st.error ? [] : (st.data || []).map(function (r) { return r.stanza; });
      }

      /* l'ultimo contatto della rubrica */
      var rb = await db.from("contatti").select("nome,creato_il")
        .eq("proprietario_id", id).order("creato_il", { ascending: false }).limit(1);
      if (!rb.error && rb.data && rb.data[0]) d.rubrica = rb.data[0];
    } catch (e) { console.warn("la mia orma:", e); }
    return d;
  }

  /* ── raggruppare le orme sotto i talenti ───────────────────────── */
  function raggruppa(d) {
    var perId = {};
    d.orme.forEach(function (o) { perId[o.id] = o; });

    var talenti = [];
    d.orme.forEach(function (o) {
      if (!o.talento_id || !d.talenti[o.talento_id]) return;
      if (talenti.some(function (t) { return t.id === o.talento_id; })) return;
      var tal = d.talenti[o.talento_id];
      var sue = d.orme.filter(function (x) {
        return !x.talento_id && (x.filo_id === o.id || x.orma_madre_id === o.id);
      });
      talenti.push({ id: tal.id, t: tal, radice: o, orme: sue });
    });

    var attese = d.orme.filter(function (x) {
      return !x.talento_id && !x.filo_id && !x.orma_madre_id;
    });

    function figlie(o) {
      return d.orme.filter(function (x) { return x.orma_madre_id === o.id; }).length;
    }
    function da(o, radice) {
      if (!o.orma_madre_id || (radice && o.orma_madre_id === radice.id)) return "";
      var m = perId[o.orma_madre_id];
      return m ? titolo(m) : "";
    }
    return { talenti: talenti, attese: attese, figlie: figlie, da: da };
  }

  /* ── aprire un'orma o una squadra ──────────────────────────────── */
  /* ⚠️ la chiamata giusta la conferma il GUSCIO */
  function apri(id) {
    if (!id) return;
    if (window.SpazioVivo && typeof window.SpazioVivo.apriOrma === "function")
      return window.SpazioVivo.apriOrma(id);
    if (typeof window.vai === "function") return window.vai("orma", { id: id });
    location.search = "?o=" + encodeURIComponent(id);
  }
  function vaiA(rotta) {
    if (typeof window.vai === "function") window.vai(rotta);
  }

  /* ── una riga d'orma ───────────────────────────────────────────── */
  function rigaOrma(c, o, g, radice) {
    var P = F(), n = g.figlie(o), dd = g.da(o, radice);
    P.riempi(c, {
      orma: { titolo: titolo(o), sottotitolo: o.sottotitolo || "",
              luogo: o.luogo || "", accaduto_il: giornoMese(o.accaduto_il),
              stadio: o.stadio || "", tipo: o.tipo || "", elemento: o.elemento,
              da: dd },
      conto: { figlie: n ? (n === 1 ? "1 orma figlia" : n + " orme figlie") : "" }
    });
    P.stato(c, "ha-da", !!dd);
    P.gesto(c, "apri-orma", function () { apri(o.id); });
  }

  /* ── disegnare ─────────────────────────────────────────────────── */
  function disegna(R, d) {
    var P = F(), g = raggruppa(d);
    var io = d.io || {};
    var tutteVuote = g.talenti.every(function (t) { return !t.orme.length; });

    /* la testata, chi sei, la nota */
    P.riempi(R, {
      giorno:  { data: giornoMese(new Date()), luna: luna().nome, santo: d.santo },
      persona: { nome: io.nome || "", grado: io.grado || "ospite",
                 foto_url: io.foto_url || "" },
      nota:    { testo: "" }
    });
    var sl = R.querySelector("b.luna");
    if (sl) sl.textContent = luna().segno;
    /* ⭐ «dove sei?» resta, se il comune non c'è */
    if (d.comune) {
      Array.prototype.forEach.call(R.querySelectorAll('[data-c="persona.comune_cod"]'),
        function (el) { el.textContent = d.comune; });
    }

    /* lo stato della pagina */
    P.stato(R, "vuota", g.talenti.length === 0);
    P.stato(R, "appena-scelti", g.talenti.length > 0 && tutteVuote);
    P.stato(R, "centro-acceso", g.talenti.length > 0);

    /* il micelio */
    P.stampa(R, "micelio", d.micelio, function (c, m) { P.riempi(c, { micelio: m }); });

    /* ─ Talenti ─ */
    P.stampa(R, "talento", g.talenti, function (c, T, i) {
      var viste = T.orme.slice(0, 3);
      P.riempi(c, {
        talento: { nome: T.t.nome, svg: T.t.svg,
                   stanza: (STANZE[T.t.stanza] || {}).nome || "",
                   elemento: T.t.elemento || (STANZE[T.t.stanza] || {}).el },
        conto: { orme: T.orme.length ? nOrme(T.orme.length) : "senza orme",
                 altre: T.orme.length > 3 ? (T.orme.length - 3) + " altre" : "" }
      });
      P.stato(c, "ha-orme", T.orme.length > 0);
      P.stato(c, "talento-vuoto", !T.orme.length);
      P.stato(c, "ha-altre", T.orme.length > 3);
      P.stato(c, "mostra-esempio", i === 0 && tutteVuote);
      P.stampa(c, "orma", viste, function (oc, o) { rigaOrma(oc, o, g, T.radice); });
      P.gesto(c, "apri-prima-orma", function () { apri(T.radice.id); });
    });

    /* Da collegare */
    var attese = g.attese.slice(0, 3);
    P.stato(R, "ha-attese", attese.length > 0);
    P.stampa(R, "attesa", attese, function (c, o) { rigaOrma(c, o, g, null); });

    /* i talenti fermi */
    var ferme = tutteVuote ? [] : g.talenti.filter(function (t) { return !t.orme.length; });
    P.stato(R, "ha-ferme", ferme.length > 0);

    /* ─ Squadre ─ */
    P.stato(R, "senza-squadre", d.squadre.length === 0);
    P.stampa(R, "squadra", d.squadre, function (c, s) {
      P.riempi(c, {
        squadra: { nome: s.titolo || "", progetto: "", stato: "",
                   dal: s.esiste_dal ? "dal " + giornoMese(s.esiste_dal) : "" },
        conto: { dentro: s.quanti_dentro ? (s.quanti_dentro === 1 ? "1 persona" : s.quanti_dentro + " persone") : "" }
      });
      P.stato(c, "ha-dal", !!s.esiste_dal);
      P.stato(c, "squadra-senza-data", !s.esiste_dal);
      P.stampa(c, "stanza", (s.stanze || []).map(function (k) {
        return { nome: (STANZE[k] || {}).nome || k, elemento: (STANZE[k] || {}).el };
      }), function (sc, st) { P.riempi(sc, { stanza: st }); });
      P.gesto(c, "apri-squadra", function () { apri(s.id); });
    });

    /* ─ i conti della pagina, e gli strumenti ─
       ⛔ quello che non c'è ancora resta vuoto: il segnaposto non si vede */
    P.riempi(R, {
      conto: { attese: nOrme(g.attese.length),
               ferme: ferme.length === 1 ? "1 talento non ha ancora un\u2019orma"
                                         : ferme.length + " talenti non hanno ancora un\u2019orma",
               entrate: "", uscite: "", aggiornato: "" },
      ferme: { nomi: ferme.map(function (t) { return t.t.nome; }).join(" \u00b7 ") },
      antahkarana: { puntata: "" },
      calendario:  { data: "", cosa: "" },
      rubrica: { contatto: d.rubrica ? (d.rubrica.nome || "") : "",
                 quando: d.rubrica ? giornoMese(d.rubrica.creato_il) : "" }
    });

    /* ─ i tasti ─ */
    P.gesto(R, "invita", function () {
      if (window.SpazioVivo && typeof window.SpazioVivo.invito === "function")
        return window.SpazioVivo.invito();
      vaiA("invito");
    });
    P.gesto(R, "aggiungi-talento", function () { vaiA("talenti"); });
    Array.prototype.forEach.call(R.querySelectorAll('a[href="#antahkarana"]'), function (a) {
      a.onclick = function (e) { e.preventDefault(); vaiA("antahkarana"); };
    });
  }

  /* ── il comune: si cerca scrivendo ─────────────────────────────── */
  function comune(R) {
    var P = F(), campo = R.querySelector("#ak-cerca"), tempo = null;
    if (!campo) return;
    campo.oninput = function () {
      clearTimeout(tempo);
      var q = campo.value.trim();
      tempo = setTimeout(async function () {
        var trovati = [];
        if (q.length >= 2) {
          try {
            var r = await db.from("territori").select("codice,nome")
              .eq("tipo", "comune").ilike("nome", q + "%").order("nome").limit(8);
            trovati = r.error ? [] : (r.data || []);
          } catch (e) { trovati = []; }
        }
        P.stampa(R, "comune", trovati, function (c, x) {
          P.riempi(c, { comune: { nome: x.nome, prov: "" } });
          P.gesto(c, "scegli-comune", async function () {
            try {
              var u = await db.auth.getUser();
              var id = u && u.data && u.data.user && u.data.user.id;
              if (!id) return;
              await db.from("persone").update({ comune_cod: x.codice }).eq("id", id);
              Array.prototype.forEach.call(R.querySelectorAll('[data-c="persona.comune_cod"]'),
                function (el) { el.textContent = x.nome; });
              var pan = R.querySelector('[data-stato="comune-aperto"]');
              if (pan) pan.hidden = true;
            } catch (e) { console.warn("dove sei:", e); }
          });
        });
      }, 250);
    };
  }

  /* ── la porta ──────────────────────────────────────────────────── */
  async function ormaMia(dove) {
    var box = typeof dove === "string" ? document.querySelector(dove) : dove;
    if (!box || !window.FMPiatto) return;
    var R = await F().monta(box, INDIRIZZO);
    if (R && R.body) R = R.body;           /* monta torna il documento: si lavora sul corpo */
    var d = await leggi();
    disegna(R, d);
    comune(R);
  }

  window.SpazioVivo = window.SpazioVivo || {};
  window.SpazioVivo.ormaMia = ormaMia;
  window.FMOrmaMia = { disegna: disegna, raggruppa: raggruppa, luna: luna };   /* per le prove */
})();
