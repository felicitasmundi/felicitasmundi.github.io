/* ═══════════════════════════════════════════════════════════════
   FM-CARRELLO — le tre facce, dalla versione piatta di Design.

   ⭐ Disegno di Design: carrello-piatto.html.
   TRE FACCE, una sola tavola: `carrello`, colla colonna `faccia`.
     in_corso  → il Carrello
     ricevuto  → quello che è arrivato: le righe non si cambiano più,
                 e si vede il prezzo_pagato, congelato al momento giusto
     desideri  → la Lista dei desideri: niente numero, o c'è o non c'è.
                 Da lì, «nel carrello» cambia faccia alla riga: la stessa
                 riga passa fra i desideri e il carrello, non se ne crea
                 un'altra.

   ⛔ IL PAGAMENTO NON C'È: il tasto «paga» non porta ancora da nessuna
      parte. Stripe non è aperto.
   ⚠️ `prodotti.disponibilita` non esiste ancora: «esaurito» e «su
      ordinazione» restano spenti.

   Vuole:   fm-piatto.js prima · `db` · `vai`
   Espone:  SpazioVivo.carrello(dove)
   ═══════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  var INDIRIZZO = "APP.FELICITASMUNDI/piatti/carrello-piatto.html";
  var MESI = ["gennaio","febbraio","marzo","aprile","maggio","giugno","luglio",
              "agosto","settembre","ottobre","novembre","dicembre"];
  var FACCE = { "faccia-carrello": "in_corso", "faccia-ricevuto": "ricevuto",
                "faccia-desideri": "desideri" };
  var F = function () { return window.FMPiatto; };

  function euro(n) {
    if (n === null || n === undefined || n === "") return "";
    return Number(n).toFixed(2).replace(".", ",") + " \u20ac";
  }
  function giornoMese(s) {
    if (!s) return "";
    var x = new Date(s);
    return isNaN(x) ? "" : x.getDate() + " " + MESI[x.getMonth()];
  }

  async function leggi() {
    var d = { io: null, righe: [], prodotti: {}, chi: {} };
    try {
      var u = await db.auth.getUser();
      d.io = u && u.data && u.data.user && u.data.user.id;
      if (!d.io) return d;

      var c = await db.from("carrello")
        .select("id,prodotto_id,servizio_id,classe_id,nome,faccia,quante,quando,arrivata_il,prezzo_pagato")
        .eq("persona_id", d.io).order("quando", { ascending: false });
      d.righe = c.error ? [] : (c.data || []);

      var pid = d.righe.map(function (r) { return r.prodotto_id; }).filter(Boolean);
      if (pid.length) {
        var p = await db.from("prodotti")
          .select("id,nome,foto,prezzo,nome_url,persona_id").in("id", pid);
        (p.error ? [] : p.data || []).forEach(function (r) { d.prodotti[r.id] = r; });
        var qid = Object.keys(d.prodotti).map(function (k) { return d.prodotti[k].persona_id; })
                        .filter(Boolean);
        if (qid.length) {
          var pp = await db.from("persone_pubbliche").select("id,nome").in("id", qid);
          (pp.error ? [] : pp.data || []).forEach(function (r) { d.chi[r.id] = r; });
        }
      }
    } catch (e) { console.warn("carrello:", e); }
    return d;
  }

  async function cambia(d, riga, quante) {
    if (quante <= 0) {
      var x = await db.from("carrello").delete().eq("id", riga.id);
      if (x.error) throw x.error;
      d.righe = d.righe.filter(function (r) { return r.id !== riga.id; });
      return;
    }
    var u = await db.from("carrello").update({ quante: quante }).eq("id", riga.id);
    if (u.error) throw u.error;
    riga.quante = quante;
  }

  function disegna(R, d, stato) {
    var P = F();

    Object.keys(FACCE).forEach(function (k) {
      P.stato(R, k, stato.faccia === k);
      var b = R.querySelector('[data-g="' + k + '"]');
      if (b) {
        b.setAttribute("aria-pressed", stato.faccia === k ? "true" : "false");
        b.onclick = function () { stato.faccia = k; disegna(R, d, stato); };
      }
    });

    var dentro = R.querySelector('[data-stato="' + stato.faccia + '"]');
    if (!dentro) return;
    var righe = d.righe.filter(function (r) { return r.faccia === FACCE[stato.faccia]; });

    /* il vuoto di questa faccia */
    var vuoti = { "faccia-carrello": "carrello-vuoto", "faccia-ricevuto": "ricevuto-vuoto",
                  "faccia-desideri": "desideri-vuoto" };
    P.stato(dentro, vuoti[stato.faccia], righe.length === 0);

    var quante = 0, totale = 0;
    righe.forEach(function (r) {
      var p = d.prodotti[r.prodotto_id] || {};
      quante += (r.quante || 1);
      totale += (Number(r.prezzo_pagato != null ? r.prezzo_pagato : p.prezzo) || 0) * (r.quante || 1);
    });
    P.riempi(R, { conto: { quante: String(quante), totale: euro(totale) } });

    P.stampa(dentro, "riga", righe, function (c, r) {
      var p = d.prodotti[r.prodotto_id] || {};
      var chi = d.chi[p.persona_id] || {};
      P.riempi(c, {
        riga: { nome: r.nome || p.nome || "", foto: p.foto || "",
                prezzo: euro(p.prezzo), quante: String(r.quante || 1),
                totale: euro((Number(p.prezzo) || 0) * (r.quante || 1)),
                prezzo_pagato: euro(r.prezzo_pagato),
                arrivata_il: giornoMese(r.arrivata_il) },
        persona: { nome: chi.nome || "" }
      });
      /* ⚠️ la disponibilità non esiste ancora: i due bollini restano spenti */
      P.stato(c, "esaurito", false);
      P.stato(c, "su-ordinazione", false);

      P.gesto(c, "apri-prodotto", function () {
        if (!p.id) return;
        if (typeof window.vai === "function") window.vai("emporio", { prodotto: p.nome_url || p.id });
      });
      /* ⛔ sul ricevuto non si tocca niente */
      if (stato.faccia === "faccia-ricevuto") return;
      /* ⭐ sui desideri non c'è numero: o c'è o non c'è */
      if (stato.faccia === "faccia-carrello") {
        P.gesto(c, "piu", async function () {
          try { await cambia(d, r, (r.quante || 1) + 1); } catch (e) { console.warn("carrello:", e); }
          disegna(R, d, stato);
        });
        P.gesto(c, "meno", async function () {
          try { await cambia(d, r, (r.quante || 1) - 1); } catch (e) { console.warn("carrello:", e); }
          disegna(R, d, stato);
        });
      }
      /* ⭐ dai desideri al carrello: la riga cambia faccia */
      P.gesto(c, "nel-carrello", async function () {
        try {
          var u = await db.from("carrello").update({ faccia: "in_corso", quante: 1 })
            .eq("id", r.id);
          if (u.error) throw u.error;
          r.faccia = "in_corso"; r.quante = 1;
        } catch (e) { console.warn("carrello:", e); }
        disegna(R, d, stato);
      });
      P.gesto(c, "togli", async function () {
        try { await cambia(d, r, 0); } catch (e) { console.warn("carrello:", e); }
        disegna(R, d, stato);
      });
    });

    /* ⛔ il pagamento non è aperto */
    P.gesto(R, "paga", function () {});
  }

  async function carrello(dove) {
    var box = typeof dove === "string" ? document.querySelector(dove) : dove;
    if (!box || !window.FMPiatto) return;
    var R = await F().monta(box, INDIRIZZO);
    if (R && R.body) R = R.body;
    var d = await leggi();
    disegna(R, d, { faccia: "faccia-carrello" });
  }

  window.SpazioVivo = window.SpazioVivo || {};
  window.SpazioVivo.carrello = carrello;
  window.FMCarrello = { disegna: disegna };
})();
