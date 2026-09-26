/* ═══════════════════════════════════════════════════════════════
   FM-CONFIGURATORE — il configuratore della stampa, dalla piatta.

   ⭐ Disegno di Design: configuratore-stampa-piatto.html.
   QUATTRO PASSI: scegli · il file · conferma · dov'è.
   ⭐ La scelta si salva in `edizione_proposte`, legata all'orma da cui
      si è partiti: si può chiudere e riprendere.

   ⛔ TRE PEZZI NON ESISTONO NEL DATABASE, e restano vuoti:
     · il listino — formati, carte, pagine, copie, e quanto costano
     · il controllo del file da stampare
     · i modi di consegna, l'ordine e la tracciatura
     Finché non ci sono, i passi «il file», «conferma» e «dov'è» si
     aprono ma non hanno niente da mostrare.

   Vuole:   fm-piatto.js prima · `db` · `vai`
   Espone:  SpazioVivo.configuratore(dove, { orma, famiglia })
   ═══════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  var INDIRIZZO = "APP.FELICITASMUNDI/piatti/configuratore-stampa-piatto.html";
  var F = function () { return window.FMPiatto; };

  function euro(n) {
    if (n === null || n === undefined || n === "") return "";
    return Number(n).toFixed(2).replace(".", ",") + " \u20ac";
  }

  async function leggi(ormaId, famiglia) {
    var d = { io: null, orma: null, proposta: null };
    try {
      var u = await db.auth.getUser();
      d.io = u && u.data && u.data.user && u.data.user.id;

      if (ormaId) {
        var o = await db.from("orme").select("id,titolo,stadio").eq("id", ormaId).single();
        if (!o.error) d.orma = o.data;
      }
      /* la proposta di questa orma, se c'è già */
      if (d.io) {
        var q = db.from("edizione_proposte")
          .select("id,tipo,famiglia,formato,carta,pagine,copie,prezzo_copertina,costo,orma_id")
          .eq("persona_id", d.io);
        if (ormaId) q = q.eq("orma_id", ormaId);
        var p = await q.order("creata_il", { ascending: false }).limit(1);
        if (!p.error && p.data && p.data[0]) d.proposta = p.data[0];
      }
      if (!d.proposta) d.proposta = { famiglia: famiglia || "", tipo: "", formato: "",
                                      carta: "", pagine: null, copie: null, costo: null,
                                      orma_id: ormaId || null };
      else if (famiglia && !d.proposta.famiglia) d.proposta.famiglia = famiglia;
    } catch (e) { console.warn("configuratore:", e); }
    return d;
  }

  /* salvare la scelta: si scrive appena si tocca qualcosa */
  async function salva(d) {
    if (!d.io) return;
    var riga = {
      persona_id: d.io, orma_id: d.proposta.orma_id || null,
      tipo: d.proposta.tipo || null, famiglia: d.proposta.famiglia || null,
      formato: d.proposta.formato || null, carta: d.proposta.carta || null,
      pagine: d.proposta.pagine, copie: d.proposta.copie,
      prezzo_copertina: d.proposta.prezzo_copertina, costo: d.proposta.costo
    };
    try {
      if (d.proposta.id) {
        var u = await db.from("edizione_proposte").update(riga).eq("id", d.proposta.id);
        if (u.error) throw u.error;
      } else {
        var i = await db.from("edizione_proposte").insert(riga).select("id").single();
        if (i.error) throw i.error;
        d.proposta.id = i.data.id;
      }
    } catch (e) { console.warn("configuratore:", e); }
  }

  function disegna(R, d, stato) {
    var P = F(), p = d.proposta;

    P.riempi(R, {
      orma: { titolo: (d.orma && d.orma.titolo) || "", stadio: (d.orma && d.orma.stadio) || "" },
      proposta: { tipo: p.tipo || "", famiglia: p.famiglia || "", formato: p.formato || "",
                  carta: p.carta || "", pagine: p.pagine ? String(p.pagine) : "",
                  copie: p.copie ? String(p.copie) : "", costo: euro(p.costo) },
      /* ⛔ questi non hanno una fonte: restano vuoti */
      file: { nome: "", peso: "" },
      controllo: { esito: "" },
      consegna: { nome: "", quando: "", prezzo: "", modo: "", indirizzo: "" },
      ordine: { stato: "", quando: "", numero: "", tracciatura: "" },
      conto: { totale: euro(p.costo) }
    });

    ["passo-scegli", "passo-file", "passo-conferma", "passo-dove"].forEach(function (k) {
      P.stato(R, k, stato.passo === k);
      P.gesto(R, k, function () { stato.passo = k; disegna(R, d, stato); });
    });
    P.stato(R, "ha-pagine", !!(p.famiglia && /libr|agend|quadern/i.test(p.famiglia)));

    /* ⛔ il listino non c'è: nessuna scelta da mostrare */
    ["formato", "carta", "pagine", "copie", "consegna", "problema", "ordine-stato"]
      .forEach(function (s) { P.stampa(R, s, [], function () {}); });
    P.stato(R, "in-attesa", false);
    P.stato(R, "problemi", false);
    P.stato(R, "va-bene", false);
    P.stato(R, "ha-tracciatura", false);
    P.stato(R, "senza-tracciatura", true);

    P.gesto(R, "avanti-file", function () { stato.passo = "passo-file"; disegna(R, d, stato); });
    P.gesto(R, "avanti-conferma", function () { stato.passo = "passo-conferma"; disegna(R, d, stato); });
    P.gesto(R, "torna", function () {
      if (d.orma && window.SpazioVivo && typeof window.SpazioVivo.apriOrma === "function")
        return window.SpazioVivo.apriOrma(d.orma.id);
      if (typeof window.vai === "function") window.vai("edizione");
    });
    /* ⛔ mandare in stampa: l'ordine non esiste ancora */
    P.gesto(R, "stampa", function () {});
    P.gesto(R, "controlla", function () {});
    P.gesto(R, "scegli-file", function () {});

    /* le scelte: si salvano appena si toccano — quando il listino arriverà,
       questi gesti troveranno le righe già pronte */
    [["scegli-formato", "formato"], ["scegli-carta", "carta"],
     ["scegli-pagine", "pagine"], ["scegli-copie", "copie"],
     ["scegli-consegna", "consegna"]].forEach(function (x) {
      P.gesto(R, x[0], async function (e, b) {
        var v = b.getAttribute("data-v") || b.textContent.trim();
        if (x[1] === "pagine" || x[1] === "copie") v = parseInt(v, 10) || null;
        if (x[1] !== "consegna") { d.proposta[x[1]] = v; await salva(d); }
        disegna(R, d, stato);
      });
    });

    var ind = R.querySelector('input[data-c="consegna.indirizzo"]');
    if (ind) ind.value = "";
  }

  async function configuratore(dove, cosa) {
    cosa = cosa || {};
    var box = typeof dove === "string" ? document.querySelector(dove) : dove;
    if (!box || !window.FMPiatto) return;
    var R = await F().monta(box, INDIRIZZO);
    if (R && R.body) R = R.body;
    var d = await leggi(cosa.orma || cosa.ormaId || null, cosa.famiglia || "");
    disegna(R, d, { passo: "passo-scegli" });
  }

  window.SpazioVivo = window.SpazioVivo || {};
  window.SpazioVivo.configuratore = configuratore;
  window.FMConfiguratore = { disegna: disegna };
})();
