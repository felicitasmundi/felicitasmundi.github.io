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

    /* ⭐ 1 ottobre, Gab: «se uno acquista deve andare su carrello e completare l'ordine» —
       «per il pagamento ora usi il mio iban». «paga» conferma l'ordine (fm_conferma_ordine:
       prezzi congelati, causale, carrello svuotato) e mostra i dati del bonifico, che si
       leggono da impostazioni (li scrive Gab, non passano dal codice). */
    P.gesto(R, "paga", async function (e, b) {
      var era = b.textContent; b.disabled = true; b.textContent = "un momento\u2026";
      try {
        var o = await db.rpc("fm_conferma_ordine");
        if (o.error) throw o.error;
        var x = Array.isArray(o.data) ? o.data[0] : o.data;
        var im = await db.from("impostazioni").select("chiave,valore").in("chiave", ["pagamento_iban", "pagamento_intestatario"]);
        var v = {}; (im.error ? [] : im.data || []).forEach(function (r) { v[r.chiave] = r.valore; });
        bonifico(R, x, v);
      } catch (err) {
        console.warn("ordine:", err);
        b.textContent = era; b.disabled = false;
        alert("L\u2019ordine non \u00e8 partito: " + (err.message || err));
      }
    });
  }

  function bonifico(R, x, v) {
    var esc = function (t) { return String(t == null ? "" : t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
    var tot = Number(x.totale || 0).toFixed(2).replace(".", ",") + " \u20ac";
    var riga = function (et, val, copia) {
      return '<div style="display:flex;justify-content:space-between;gap:1rem;align-items:baseline;padding:.55rem 0;border-top:1px solid rgba(212,175,106,.18)">' +
        '<span style="font-size:.78rem;letter-spacing:.14em;text-transform:uppercase;color:rgba(245,240,230,.55)">' + esc(et) + '</span>' +
        '<b style="font-weight:400;font-family:\'Cormorant Garamond\',serif;font-size:1.15rem;text-align:right;word-break:break-all">' + esc(val || "\u2014") + '</b>' +
        (copia && val ? '<button type="button" data-copia="' + esc(val) + '" style="all:unset;cursor:pointer;font-size:.72rem;color:#D4AF6A;border:1px solid rgba(212,175,106,.5);border-radius:999px;padding:.2rem .6rem">copia</button>' : '') + '</div>';
    };
    var box = R.ownerDocument.createElement("div");
    box.setAttribute("style", "margin:1.2rem 0;padding:1.3rem 1.2rem;border:1px solid rgba(212,175,106,.5);border-radius:1rem;background:rgba(212,175,106,.07);color:#F5F0E6;font-family:'DM Sans',sans-serif");
    box.innerHTML = '<div style="font-family:\'Cinzel\',serif;letter-spacing:.2em;text-transform:uppercase;font-size:.8rem;color:#D4AF6A;margin-bottom:.6rem">ordine n. ' + esc(x.numero) + ' confermato</div>' +
      '<p style="margin:0 0 .8rem;font-family:\'Cormorant Garamond\',serif;font-size:1.15rem;line-height:1.5">Per completarlo fai un bonifico con questi dati. L\u2019ordine parte quando il bonifico arriva.</p>' +
      riga("importo", tot, false) + riga("intestato a", v.pagamento_intestatario, true) + riga("IBAN", v.pagamento_iban, true) + riga("causale", x.causale, true);
    var fondo = R.querySelector(".ca-fondo");
    var lista = fondo ? fondo.parentNode : R;
    lista.insertBefore(box, lista.firstChild);
    if (fondo) fondo.setAttribute("hidden", "");
    Array.prototype.forEach.call(R.querySelectorAll('[data-stampo]:not([data-fm-stampo])[data-fm-copia]'), function (c) { c.setAttribute("hidden", ""); });
    Array.prototype.forEach.call(box.querySelectorAll("[data-copia]"), function (bt) {
      bt.onclick = function () { try { navigator.clipboard.writeText(bt.getAttribute("data-copia")); bt.textContent = "copiato"; } catch (e) {} };
    });
    if (box.scrollIntoView) box.scrollIntoView({ behavior: "smooth", block: "start" });
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
