/* ═══════════════════════════════════════════════════════════════
   FM-PERCORSO-TALENTI — i cinque solidi, dalla versione piatta.

   ⭐ Disegno di Design: percorso-talenti-piatto.html.
      Le cinque stanze sono segnate coll'ELEMENTO (terra, acqua…):
      il codice le traduce nella stanza del database.
   ⭐ PRENDERE un talento fa nascere la sua RADICE — un'orma
      tipo 'talento_radice' col talento dentro. LASCIARLO stacca il
      talento, ma l'orma resta: la storia non si cancella.
   ⭐ Nessun tetto: si prendono quanti talenti si vuole, e sotto ognuno
      si aprono quante orme si vuole.
   ⭐ Ogni talento preso accende un punto sul cubo: i tredici centri
      del cubo di Metatron, uno per talento.

   Vuole:   fm-piatto.js prima · `db` · `vai`
   Espone:  SpazioVivo.percorsoDeiTalenti(dove) · SpazioVivo.stanze(dove)
   ═══════════════════════════════════════════════════════════════ */
(function () {
  "use strict";
  var INDIRIZZO = "APP.FELICITASMUNDI/piatti/percorso-talenti-piatto.html";
  var STANZA = {
    terra: { k: "vicinati",   nome: "I Vicinati" },
    acqua: { k: "emporio",    nome: "L\u2019Emporio" },
    fuoco: { k: "assistenza", nome: "L\u2019Assistenza" },
    aria:  { k: "edizione",   nome: "L\u2019Edizione" },
    etere: { k: "scuola",     nome: "La Scuola" }
  };
  var CENTRI = [[0,0],[0,-46],[39.84,-23],[39.84,23],[0,46],[-39.84,23],[-39.84,-23],
                [0,-92],[79.67,-46],[79.67,46],[0,92],[-79.67,46],[-79.67,-46]];
  var F = function () { return window.FMPiatto; };
  function vaiA(r) { if (typeof window.vai === "function") window.vai(r); }

  async function leggi() {
    var d = { io: null, gruppi: [], talenti: [], presi: {} };
    try {
      var u = await db.auth.getUser();
      d.io = u && u.data && u.data.user && u.data.user.id;
      var g = await db.from("talenti_gruppi").select("id,nome,descrizione,ordine").order("ordine");
      var t = await db.from("talenti").select("id,nome,gruppo_id,stanza,elemento,svg")
        .eq("attivo", true).order("nome");
      d.gruppi = g.error ? [] : (g.data || []);
      d.talenti = t.error ? [] : (t.data || []);
      if (d.io) {
        var o = await db.from("orme").select("id,talento_id")
          .eq("persona_id", d.io).not("talento_id", "is", null);
        (o.error ? [] : o.data || []).forEach(function (r) { d.presi[r.talento_id] = r.id; });
      }
    } catch (e) { console.warn("percorso:", e); }
    return d;
  }

  async function prendi(d, t) {
    if (!d.io) return;
    if (d.presi[t.id]) {
      var r = await db.from("orme").update({ talento_id: null }).eq("id", d.presi[t.id]);
      if (r.error) throw r.error;
      delete d.presi[t.id];
    } else {
      var n = await db.from("orme").insert({
        persona_id: d.io, tipo: "talento_radice", talento_id: t.id,
        titolo: t.nome, contenuto: t.nome, elemento: t.elemento, visibilita: "pubblico"
      }).select("id").single();
      if (n.error) throw n.error;
      d.presi[t.id] = n.data.id;
    }
  }

  function disegna(R, d, el) {
    var P = F(), st = STANZA[el] || STANZA.terra;
    var qui = d.talenti.filter(function (t) { return t.stanza === st.k; });
    var presi = Object.keys(d.presi).length;

    P.riempi(R, {
      stanza: { nome: st.nome },
      conto: { talenti: String(qui.length), presi: String(presi) }
    });
    P.stato(R, "stanza-vuota", qui.length === 0);
    P.stato(R, "ha-talenti", presi > 0);
    P.stato(R, "nessun-talento", presi === 0);

    /* i gruppi della stanza, e i loro talenti */
    var gruppi = d.gruppi.filter(function (g) {
      return qui.some(function (t) { return t.gruppo_id === g.id; });
    });
    var sciolti = qui.filter(function (t) {
      return !gruppi.some(function (g) { return g.id === t.gruppo_id; });
    });
    if (sciolti.length) gruppi.push({ id: null, nome: "", descrizione: "" });

    P.stampa(R, "gruppo", gruppi, function (c, g) {
      P.riempi(c, { gruppo: { nome: g.nome || "", sotto: g.descrizione || "" } });
      var suoi = g.id ? qui.filter(function (t) { return t.gruppo_id === g.id; }) : sciolti;
      P.stampa(c, "talento", suoi, function (tc, t) {
        P.riempi(tc, { talento: { nome: t.nome, svg: t.svg, stanza: st.nome,
                                  elemento: t.elemento || el } });
        tc.setAttribute("aria-pressed", d.presi[t.id] ? "true" : "false");
        P.gesto(tc, "prendi-talento", async function () {
          tc.disabled = true;
          try { await prendi(d, t); } catch (e) { console.warn("percorso:", e); }
          tc.disabled = false;
          disegna(R, d, el);
        });
      });
    });

    /* i punti accesi: uno per talento preso */
    P.stampa(R, "acceso", Object.keys(d.presi).slice(0, CENTRI.length), function (c, x, i) {
      c.setAttribute("cx", CENTRI[i][0]); c.setAttribute("cy", CENTRI[i][1]);
    });
  }

  async function percorsoDeiTalenti(dove) {
    var box = typeof dove === "string" ? document.querySelector(dove) : dove;
    if (!box || !window.FMPiatto) return;
    var R = await F().monta(box, INDIRIZZO);
    if (R && R.body) R = R.body;
    var d = await leggi(), P = F();
    var scelta = (R.querySelector('[data-g="scegli-stanza"][aria-pressed="true"]') || {}).getAttribute
      ? R.querySelector('[data-g="scegli-stanza"][aria-pressed="true"]').getAttribute("data-stanza") : "terra";
    disegna(R, d, scelta);
    /* ⭐ lo script di Design cambia solido e colore; qui si cambiano i talenti */
    Array.prototype.forEach.call(R.querySelectorAll('[data-g="scegli-stanza"]'), function (b) {
      b.addEventListener("click", function () { disegna(R, d, b.getAttribute("data-stanza")); });
    });
    P.gesto(R, "avanti", function () { vaiA("orme"); });
  }

  window.SpazioVivo = window.SpazioVivo || {};
  window.SpazioVivo.percorsoDeiTalenti = percorsoDeiTalenti;
  window.SpazioVivo.stanze = percorsoDeiTalenti;
  window.FMPercorso = { disegna: disegna };
})();
