/* ═══════════════════════════════════════════════════════════════
   FM-EDIZIONE — la stanza dell'Edizione, dalla versione piatta.

   ⭐ Disegno di Design: stanza-edizione-piatto.html.
   DUE FACCE: l'elenco delle opere pubblicate · l'opera aperta, coi suoi
   pezzi in fila. E le OTTO FAMIGLIE della stampa, che portano al
   configuratore.

   ⛔ LE OTTO FAMIGLIE della stampa non aprono ancora il configuratore:
      listino, controllo del file e ordini arrivano con Flyeralarm, in
      autunno. Si accende lo stato «in-autunno», che lo dice.

   ⭐ UN'OPERA SI VENDE ATTRAVERSO IL SUO PRODOTTO: il carrello punta ai
      prodotti (prodotti.opera_id). Se un'opera non ha il suo prodotto,
      non si può mettere nel carrello — e il tasto non c'è.

   Vuole:   fm-piatto.js prima · `db` · `vai`
   Espone:  SpazioVivo.edizione(dove)
   ═══════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  var INDIRIZZO = "APP.FELICITASMUNDI/piatti/stanza-edizione-piatto.html";
  var MESI = ["gennaio","febbraio","marzo","aprile","maggio","giugno","luglio",
              "agosto","settembre","ottobre","novembre","dicembre"];
  var F = function () { return window.FMPiatto; };

  function euro(n) {
    if (n === null || n === undefined || n === "") return "";
    return Number(n).toFixed(2).replace(".", ",") + " \u20ac";
  }
  function giornoMese(s) {
    if (!s) return "";
    var x = new Date(s);
    return isNaN(x) ? "" : x.getDate() + " " + MESI[x.getMonth()] + " " + x.getFullYear();
  }
  function oggi() { var d = new Date(); return d.getDate() + " " + MESI[d.getMonth()]; }

  async function leggi() {
    var d = { io: null, opere: [], pezzi: {}, chi: {}, prodotti: {}, santo: "" };
    try {
      var u = await db.auth.getUser();
      d.io = u && u.data && u.data.user && u.data.user.id;

      var o = await db.from("opere")
        .select("id,titolo,occhiello,racconto,genere,copertina,isbn,prezzo,stato," +
                "pubblicata_il,persona_id")
        .eq("stato", "pubblicata").order("pubblicata_il", { ascending: false }).limit(200);
      d.opere = o.error ? [] : (o.data || []);
      var ids = d.opere.map(function (x) { return x.id; });

      if (ids.length) {
        var pz = await db.from("opera_pezzi")
          .select("id,opera_id,ordine,tipo,titolo,contenuto,immagine,didascalia")
          .in("opera_id", ids).order("ordine");
        (pz.error ? [] : pz.data || []).forEach(function (r) {
          (d.pezzi[r.opera_id] = d.pezzi[r.opera_id] || []).push(r);
        });
        /* ⭐ il prodotto di ogni opera: è quello che va nel carrello */
        var pr = await db.from("prodotti").select("id,nome,prezzo,opera_id,stato")
          .in("opera_id", ids).eq("stato", "pubblico");
        (pr.error ? [] : pr.data || []).forEach(function (r) { d.prodotti[r.opera_id] = r; });
      }

      var pid = d.opere.map(function (x) { return x.persona_id; }).filter(Boolean);
      if (pid.length) {
        var pp = await db.from("persone_pubbliche").select("id,nome,nome_url").in("id", pid);
        (pp.error ? [] : pp.data || []).forEach(function (r) { d.chi[r.id] = r; });
      }

      var da = new Date();
      var mmgg = String(da.getMonth() + 1).padStart(2, "0") + "-" + String(da.getDate()).padStart(2, "0");
      var sa = await db.from("santi").select("nome").eq("giorno", mmgg).limit(1);
      if (!sa.error && sa.data && sa.data[0]) d.santo = sa.data[0].nome;
    } catch (e) { console.warn("edizione:", e); }
    return d;
  }

  /* mettere nel carrello il prodotto dell'opera */
  async function alCarrello(d, opera, b) {
    var p = d.prodotti[opera.id];
    if (!p) return;
    if (!d.io) { if (typeof window.vai === "function") window.vai("accesso"); return; }
    var era = b && b.textContent;
    if (b) { b.disabled = true; b.textContent = "un momento\u2026"; }
    try {
      var c = await db.from("carrello").select("id,quante")
        .eq("persona_id", d.io).eq("prodotto_id", p.id).eq("faccia", "in_corso").limit(1);
      var riga = (!c.error && c.data && c.data[0]) || null;
      if (riga) {
        var u = await db.from("carrello").update({ quante: (riga.quante || 1) + 1 }).eq("id", riga.id);
        if (u.error) throw u.error;
      } else {
        var i = await db.from("carrello").insert({
          persona_id: d.io, prodotto_id: p.id, nome: p.nome || opera.titolo,
          quante: 1, faccia: "in_corso"
        });
        if (i.error) throw i.error;
      }
      if (b) b.textContent = "nel carrello";
    } catch (e) {
      console.warn("edizione:", e);
      if (b) { b.textContent = era; }
    }
    if (b) b.disabled = false;
  }

  function disegna(R, d, stato) {
    var P = F();
    P.riempi(R, { giorno: { data: oggi(), luna: "", santo: d.santo } });
    P.stato(R, "elenco", stato.faccia === "elenco");
    P.stato(R, "opera", stato.faccia === "opera");
    if (stato.faccia === "elenco") elenco(R, d, stato);
    if (stato.faccia === "opera" && stato.opera) opera(R, d, stato, stato.opera);

    P.gesto(R, "chiudi", function () { stato.faccia = "elenco"; disegna(R, d, stato); });
    P.gesto(R, "invita", function () {
      if (window.SpazioVivo && typeof window.SpazioVivo.invito === "function")
        return window.SpazioVivo.invito({});
      if (typeof window.vai === "function") window.vai("invito");
    });
    /* ⛔ le otto famiglie non aprono ancora il configuratore: il listino, il
       controllo del file e gli ordini arrivano con Flyeralarm, in autunno.
       Toccarne una accende la riga che lo dice. */
    P.gesto(R, "scegli-famiglia", function (e, b) {
      Array.prototype.forEach.call(R.querySelectorAll('[data-g="scegli-famiglia"]'), function (x) {
        x.setAttribute("aria-pressed", x === b ? "true" : "false");
      });
      P.stato(R, "in-autunno", true);
    });
  }

  function elenco(R, d, stato) {
    var P = F();
    P.riempi(R, { conto: { opere: String(d.opere.length) } });
    P.stato(R, "senza-opere", d.opere.length === 0);
    P.stampa(R, "opera", d.opere, function (c, o) {
      var chi = d.chi[o.persona_id] || {}, pro = d.prodotti[o.id];
      P.riempi(c, {
        opera: { titolo: o.titolo || "", genere: o.genere || "", copertina: o.copertina || "",
                 prezzo: euro(o.prezzo), pubblicata_il: giornoMese(o.pubblicata_il) },
        persona: { nome: chi.nome || "" }
      });
      P.stato(c, "senza-copertina", !o.copertina);
      P.stato(c, "si-compra", !!(pro && o.prezzo));
      P.stato(c, "dono", !o.prezzo);
      P.gesto(c, "apri-opera", function () {
        stato.faccia = "opera"; stato.opera = o; disegna(R, d, stato);
      });
      P.gesto(c, "vendi", async function (e, b) { await alCarrello(d, o, b); });
    });
  }

  function opera(R, d, stato, o) {
    var P = F(), chi = d.chi[o.persona_id] || {}, pezzi = d.pezzi[o.id] || [];
    var pro = d.prodotti[o.id];
    P.riempi(R, {
      opera: { titolo: o.titolo || "", occhiello: o.occhiello || "", racconto: o.racconto || "",
               genere: o.genere || "", isbn: o.isbn || "", stato: o.stato || "",
               copertina: o.copertina || "", prezzo: euro(o.prezzo),
               pubblicata_il: giornoMese(o.pubblicata_il) },
      persona: { nome: chi.nome || "", nome_url: chi.nome_url ? "?p=" + chi.nome_url : "#" },
      conto: { pezzi: String(pezzi.length) }
    });
    P.stato(R, "senza-copertina", !o.copertina);
    P.stato(R, "si-compra", !!(pro && o.prezzo));
    P.stato(R, "dono", !o.prezzo);

    P.stampa(R, "pezzo", pezzi, function (c, p) {
      P.riempi(c, { pezzo: { tipo: p.tipo || "", titolo: p.titolo || "",
                             contenuto: p.contenuto || "", immagine: p.immagine || "",
                             didascalia: p.didascalia || "" } });
      P.stato(c, "ha-didascalia", !!p.didascalia);
    });

    P.gesto(R, "vendi", async function (e, b) { await alCarrello(d, o, b); });
  }

  async function edizione(dove) {
    var box = typeof dove === "string" ? document.querySelector(dove) : dove;
    if (!box || !window.FMPiatto) return;
    var R = await F().monta(box, INDIRIZZO);
    if (R && R.body) R = R.body;
    var d = await leggi();
    disegna(R, d, { faccia: "elenco", opera: null });
  }

  window.SpazioVivo = window.SpazioVivo || {};
  window.SpazioVivo.edizione = edizione;
  window.FMEdizione = { disegna: disegna };
})();
