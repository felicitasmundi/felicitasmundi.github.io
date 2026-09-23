/* ═══════════════════════════════════════════════════════════════
   FM-COSTI — quello che esce e quello che entra, dalla piatta.

   ⭐ Disegno di Design: costi-piatto.html.
   ⭐ La tavola è `spese`: importo, giorno, categoria, descrizione,
      l'orma da cui nasce, `verso` (entrata o uscita) e `ricorrente`.
   ⭐ QUANTO RENDE UN TALENTO: ogni spesa nasce da un'orma; l'orma sta su
      un filo, e in cima al filo c'è il talento. Così si somma per talento.
   ⚠️ Oggi le spese sono zero: la pagina si apre e dice zero.

   Vuole:   fm-piatto.js prima · `db` · `vai`
   Espone:  SpazioVivo.costi(dove)
   ═══════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  var INDIRIZZO = "APP.FELICITASMUNDI/piatti/costi-piatto.html";
  var MESI = ["gennaio","febbraio","marzo","aprile","maggio","giugno","luglio",
              "agosto","settembre","ottobre","novembre","dicembre"];
  var STANZE = { terra: "I Vicinati", acqua: "L\u2019Emporio", fuoco: "L\u2019Assistenza",
                 aria: "L\u2019Edizione", etere: "La Scuola" };
  var F = function () { return window.FMPiatto; };

  function euro(n) {
    var v = Number(n) || 0;
    var s = Math.abs(v).toFixed(2).replace(".", ",") + " \u20ac";
    return v < 0 ? "\u2212 " + s : s;      /* il segno meno vero, non il trattino */
  }
  function piu(n) { return "+ " + euro(Math.abs(n)); }
  function meno(n) { return "\u2212 " + euro(Math.abs(n)); }
  function entrata(s) { return String(s.verso || "").toLowerCase() === "entrata"; }

  async function leggi() {
    var d = { io: null, spese: [], orme: {}, talenti: {}, radici: {} };
    try {
      var u = await db.auth.getUser();
      d.io = u && u.data && u.data.user && u.data.user.id;
      if (!d.io) return d;

      var s = await db.from("spese")
        .select("id,descrizione,importo,giorno,categoria,verso,ricorrente,orma_id")
        .eq("persona_id", d.io).order("giorno", { ascending: false }).limit(500);
      d.spese = s.error ? [] : (s.data || []);

      /* le orme delle spese, e il talento in cima al loro filo */
      var oid = d.spese.map(function (x) { return x.orma_id; }).filter(Boolean);
      if (oid.length) {
        var o = await db.from("orme").select("id,titolo,elemento,talento_id,filo_id").in("id", oid);
        (o.error ? [] : o.data || []).forEach(function (r) { d.orme[r.id] = r; });
        var fili = Object.keys(d.orme).map(function (k) {
          return d.orme[k].talento_id ? null : d.orme[k].filo_id;
        }).filter(Boolean);
        if (fili.length) {
          var r2 = await db.from("orme").select("id,talento_id").in("id", fili);
          (r2.error ? [] : r2.data || []).forEach(function (r) { d.radici[r.id] = r.talento_id; });
        }
        var tid = [];
        Object.keys(d.orme).forEach(function (k) {
          var t = d.orme[k].talento_id || d.radici[d.orme[k].filo_id];
          if (t && tid.indexOf(t) < 0) tid.push(t);
        });
        if (tid.length) {
          var tt = await db.from("talenti").select("id,nome,simbolo,elemento").in("id", tid);
          (tt.error ? [] : tt.data || []).forEach(function (r) { d.talenti[r.id] = r; });
        }
      }
    } catch (e) { console.warn("costi:", e); }
    return d;
  }

  function talentoDi(d, s) {
    var o = d.orme[s.orma_id];
    if (!o) return null;
    var t = o.talento_id || d.radici[o.filo_id];
    return t ? d.talenti[t] : null;
  }
  function mesiDi(spese) {
    var m = [];
    spese.forEach(function (s) {
      if (!s.giorno) return;
      var x = new Date(s.giorno), k = x.getFullYear() + "-" + x.getMonth();
      if (!m.filter(function (y) { return y.k === k; })[0])
        m.push({ k: k, nome: MESI[x.getMonth()] + " " + x.getFullYear(), anno: x.getFullYear(), mese: x.getMonth() });
    });
    return m;
  }

  function disegna(R, d, stato) {
    var P = F();
    var mesi = mesiDi(d.spese);
    if (!stato.mese && !stato.anno && mesi.length) stato.mese = mesi[0].k;

    P.stampa(R, "mese", mesi.slice(0, 3), function (c, m) {
      P.riempi(c, { mese: { nome: m.nome } });
      c.setAttribute("aria-pressed", !stato.anno && stato.mese === m.k ? "true" : "false");
      P.gesto(c, "scegli-mese", function () {
        stato.mese = m.k; stato.anno = null; disegna(R, d, stato);
      });
    });
    P.gesto(R, "scegli-anno", function () {
      stato.anno = new Date().getFullYear(); stato.mese = null; disegna(R, d, stato);
    });

    function dentro(s) {
      if (!s.giorno) return false;
      var x = new Date(s.giorno);
      if (stato.anno) return x.getFullYear() === stato.anno;
      return (x.getFullYear() + "-" + x.getMonth()) === stato.mese;
    }
    var qui = d.spese.filter(dentro);

    var entrate = 0, uscite = 0;
    qui.forEach(function (s) {
      var v = Math.abs(Number(s.importo) || 0);
      if (entrata(s)) entrate += v; else uscite += v;
    });
    /* quanto restava il mese prima */
    var prima = 0;
    if (!stato.anno && stato.mese) {
      var p = stato.mese.split("-"), anno = +p[0], mese = +p[1] - 1;
      if (mese < 0) { mese = 11; anno--; }
      d.spese.forEach(function (s) {
        if (!s.giorno) return;
        var x = new Date(s.giorno);
        if (x.getFullYear() !== anno || x.getMonth() !== mese) return;
        var v = Math.abs(Number(s.importo) || 0);
        prima += entrata(s) ? v : -v;
      });
    }
    P.riempi(R, { conto: {
      entrate: piu(entrate), uscite: meno(uscite), resta: euro(entrate - uscite),
      resta_prima: prima ? "il mese prima " + euro(prima) : "" } });

    /* quanto rende un talento */
    var perT = [];
    qui.forEach(function (s) {
      var t = talentoDi(d, s); if (!t) return;
      var r = perT.filter(function (x) { return x.t.id === t.id; })[0];
      if (!r) { r = { t: t, rende: 0, speso: 0, orme: [], spese: 0 }; perT.push(r); }
      var v = Math.abs(Number(s.importo) || 0);
      if (entrata(s)) r.rende += v; else { r.rende -= v; r.speso += v; }
      r.spese++;
      if (s.orma_id && r.orme.indexOf(s.orma_id) < 0) r.orme.push(s.orma_id);
    });
    P.riempi(R, { conto: { talenti: String(perT.length) } });
    P.stato(R, "senza-talenti", perT.length === 0);
    P.stampa(R, "talento", perT, function (c, r) {
      P.riempi(c, {
        talento: { nome: r.t.nome || "", simbolo: r.t.simbolo || "", elemento: r.t.elemento },
        conto: { orme: String(r.orme.length), spese: String(r.spese),
                 rende: r.rende >= 0 ? piu(r.rende) : meno(r.rende), speso: meno(r.speso) }
      });
      P.stato(c, "guadagno", r.rende >= 0);
      P.stato(c, "perdita", r.rende < 0);
    });

    /* quello che torna ogni mese */
    var ric = qui.filter(function (s) { return s.ricorrente; });
    var ricMese = 0; ric.forEach(function (s) { ricMese += Math.abs(Number(s.importo) || 0); });
    P.riempi(R, { conto: { ricorrenti: String(ric.length), ricorrenti_mese: meno(ricMese) } });
    P.stato(R, "ha-ricorrenti", ric.length > 0);
    P.stato(R, "senza-ricorrenti", ric.length === 0);
    P.stampa(R, "ricorrente", ric, function (c, s) {
      P.riempi(c, { spesa: { titolo: s.descrizione || s.categoria || "",
                             importo: meno(s.importo) } });
    });

    /* le voci, mese per mese */
    var gruppi = [];
    qui.forEach(function (s) {
      var x = new Date(s.giorno), k = x.getFullYear() + "-" + x.getMonth();
      var g = gruppi.filter(function (y) { return y.k === k; })[0];
      if (!g) { g = { k: k, nome: MESI[x.getMonth()] + " " + x.getFullYear(), dentro: [] }; gruppi.push(g); }
      g.dentro.push(s);
    });
    P.stato(R, "senza-voci", qui.length === 0);
    P.stampa(R, "mese-voci", gruppi, function (c, g) {
      P.riempi(c, { mese: { nome: g.nome } });
      P.stampa(c, "spesa", g.dentro, function (sc, s) {
        var x = new Date(s.giorno), o = d.orme[s.orma_id], t = talentoDi(d, s);
        P.riempi(sc, {
          spesa: { titolo: s.descrizione || s.categoria || "",
                   importo: entrata(s) ? piu(s.importo) : meno(s.importo),
                   giorno: String(x.getDate()),
                   mese: String(x.getMonth() + 1).padStart(2, "0") },
          orma: { titolo: (o && o.titolo) || "" },
          stanza: { nome: (o && STANZE[o.elemento]) || (t && t.nome) || "" }
        });
        P.stato(sc, "entrata", entrata(s));
        P.stato(sc, "uscita", !entrata(s));
        P.stato(sc, "ricorrente", !!s.ricorrente);
        P.stato(sc, "ha-orma", !!o);
        P.gesto(sc, "apri-spesa", function () {
          if (!o) return;
          if (window.SpazioVivo && typeof window.SpazioVivo.apriOrma === "function")
            return window.SpazioVivo.apriOrma(o.id);
          if (typeof window.vai === "function") window.vai("orma", { id: o.id });
        });
      });
    });
  }

  async function costi(dove) {
    var box = typeof dove === "string" ? document.querySelector(dove) : dove;
    if (!box || !window.FMPiatto) return;
    var R = await F().monta(box, INDIRIZZO);
    if (R && R.body) R = R.body;
    var d = await leggi();
    disegna(R, d, { mese: null, anno: null });
  }

  window.SpazioVivo = window.SpazioVivo || {};
  window.SpazioVivo.costi = costi;
  window.FMCosti = { disegna: disegna };
})();
