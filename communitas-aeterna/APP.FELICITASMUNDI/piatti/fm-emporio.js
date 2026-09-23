/* ═══════════════════════════════════════════════════════════════
   FM-EMPORIO — la stanza dell'Emporio, dalla versione piatta.

   ⭐ Disegno di Design: stanza-emporio-piatto.html.
   TRE FACCE nella stessa pagina: l'elenco · la scheda di un prodotto ·
   il carrello. Il codice accende una faccia alla volta.

   I GESTI, come li ha scritti Design nella pagina:
     vendi  → mette nel carrello
     scrivi → scrive a chi tiene il prodotto (quelli che non si comprano
              in linea: «richiedi al responsabile»)

   ⭐ TRE GRUPPI FISSI, in quest'ordine: Antaḥkaraṇa — quello che il
      praticantato propone, di ogni scaffale — poi più vicino, poi più
      lontano. Vicino è quello che viene dai tuoi vicinati.
   ⭐ LA LUNA DEI DESIDERI: `desidero` mette e toglie dalla lista, che è
      la stessa tavola del carrello, colla faccia `desideri`.

   ⚠️ TRE COSE ASPETTANO, e sono segnate qui sotto:
     · la tavola `carrello` è viva: le colonne sono `quante` e
       `prezzo_pagato`, che si scrive solo quando la cosa arriva
     · `prodotti.disponibilita` non esiste ancora (fm_prodotti_03)
     · `prodotti.antahkarana` non esiste ancora: finché non c'è, il primo
       gruppo resta vuoto. Il codice la legge già, se c'è.
     · il comune di chi vende non passa dalla vista delle persone, e la
       quota dello scaffale non è nel database: restano vuoti

   ⚠️ LE LINGUETTE della scheda: quali colonne riempiono quali linguette
      non me l'ha detto nessuno. La mappa è qui sotto, in chiaro: se è
      sbagliata si cambiano due righe.

   Vuole:   fm-piatto.js prima · `db` · `vai`
   Espone:  SpazioVivo.emporio(dove)
   ═══════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  var INDIRIZZO = "APP.FELICITASMUNDI/piatti/stanza-emporio-piatto.html";
  var QUANTI = 6;                 /* quanti prodotti per gruppo, prima di «altri» */

  /* ⚠️ da confermare: l'occhiello è il nome della linguetta, l'altra colonna il testo */
  var LINGUETTE = [
    { nome: "occhiello_a",        testo: "quadrante_uno" },
    { nome: "occhiello_corpo",    testo: "testo_lungo" },
    { nome: "occhiello_come",     testo: "nota" },
    { nome: "occhiello_domande",  testo: "domande" }
  ];

  var F = function () { return window.FMPiatto; };
  var MESI = ["gennaio","febbraio","marzo","aprile","maggio","giugno","luglio",
              "agosto","settembre","ottobre","novembre","dicembre"];

  function euro(n) {
    if (n === null || n === undefined || n === "") return "";
    return Number(n).toFixed(2).replace(".", ",") + " \u20ac";
  }
  function oggi() { var d = new Date(); return d.getDate() + " " + MESI[d.getMonth()]; }

  /* ── leggere ───────────────────────────────────────────────────── */
  async function leggi() {
    var d = { io: null, prodotti: [], chi: {}, carrello: [], desideri: [],
              vicinati: [], santo: "" };
    try {
      var u = await db.auth.getUser();
      d.io = u && u.data && u.data.user && u.data.user.id;

      var COLONNE = "id,nome,racconto,scaffale,sottoscaffale,prezzo,si_compra,si_scambia," +
        "si_dona,accetto,foto,foto_secondaria,nome_url,nota,testo_lungo,domande," +
        "quadrante_uno,occhiello_a,occhiello_corpo,occhiello_come,occhiello_domande," +
        "biografia,foto_autore,autore,editore,isbn,formato,persona_id,stato,vicinato_id";
      /* ⭐ la colonna antahkarana arriva dopo: se non c'è, si legge senza */
      var p = await db.from("prodotti").select(COLONNE + ",antahkarana")
        .eq("stato", "pubblico").order("creato_il", { ascending: false }).limit(300);
      if (p.error) p = await db.from("prodotti").select(COLONNE)
        .eq("stato", "pubblico").order("creato_il", { ascending: false }).limit(300);
      d.prodotti = p.error ? [] : (p.data || []);

      /* i miei vicinati: quello che ne viene è «più vicino» */
      try {
        var v = await db.rpc("fm_miei_vicinati");
        if (!v.error) d.vicinati = (v.data || []).map(function (x) {
          return (x && (x.vicinato_id || x.id)) || x;
        });
      } catch (e) {}

      var pid = d.prodotti.map(function (x) { return x.persona_id; }).filter(Boolean);
      if (pid.length) {
        var pp = await db.from("persone_pubbliche").select("id,nome,nome_url").in("id", pid);
        (pp.error ? [] : pp.data || []).forEach(function (r) { d.chi[r.id] = r; });
      }

      /* il carrello: se la tavola non c'è ancora, resta vuoto */
      if (d.io) {
        try {
          var c = await db.from("carrello").select("id,prodotto_id,quante,faccia")
            .eq("persona_id", d.io).in("faccia", ["in_corso", "desideri"]);
          if (!c.error) {
            d.carrello = (c.data || []).filter(function (r) { return r.faccia === "in_corso"; });
            d.desideri = (c.data || []).filter(function (r) { return r.faccia === "desideri"; });
          }
        } catch (e) {}
      }

      var da = new Date();
      var mmgg = String(da.getMonth() + 1).padStart(2, "0") + "-" + String(da.getDate()).padStart(2, "0");
      var sa = await db.from("santi").select("nome").eq("giorno", mmgg).limit(1);
      if (!sa.error && sa.data && sa.data[0]) d.santo = sa.data[0].nome;
    } catch (e) { console.warn("emporio:", e); }
    return d;
  }

  /* ── il carrello ───────────────────────────────────────────────── */
  async function metti(d, prodotto, quanti) {
    if (!d.io) return;
    var riga = d.carrello.filter(function (r) { return r.prodotto_id === prodotto.id; })[0];
    var n = (riga ? riga.quante || 1 : 0) + quanti;
    if (riga && n <= 0) {
      var x = await db.from("carrello").delete().eq("id", riga.id);
      if (x.error) throw x.error;
      d.carrello = d.carrello.filter(function (r) { return r.id !== riga.id; });
      return;
    }
    if (riga) {
      var u = await db.from("carrello").update({ quante: n }).eq("id", riga.id);
      if (u.error) throw u.error;
      riga.quante = n;
      return;
    }
    /* ⭐ prezzo_pagato NON si scrive adesso: si congela quando arriva */
    var i = await db.from("carrello").insert({
      persona_id: d.io, prodotto_id: prodotto.id, nome: prodotto.nome,
      quante: Math.max(1, quanti), faccia: "in_corso"
    }).select("id,prodotto_id,quante,faccia").single();
    if (i.error) throw i.error;
    d.carrello.push(i.data);
  }

  /* ⭐ la luna: mette e toglie dalla lista dei desideri */
  async function desidera(d, prodotto) {
    if (!d.io) { if (typeof window.vai === "function") window.vai("accesso"); return; }
    var riga = d.desideri.filter(function (r) { return r.prodotto_id === prodotto.id; })[0];
    if (riga) {
      var x = await db.from("carrello").delete().eq("id", riga.id);
      if (x.error) throw x.error;
      d.desideri = d.desideri.filter(function (r) { return r.id !== riga.id; });
      return;
    }
    var i = await db.from("carrello").insert({
      persona_id: d.io, prodotto_id: prodotto.id, nome: prodotto.nome,
      quante: 1, faccia: "desideri"
    }).select("id,prodotto_id,quante,faccia").single();
    if (i.error) throw i.error;
    d.desideri.push(i.data);
  }
  function desiderato(d, p) {
    return (d.desideri || []).some(function (r) { return r.prodotto_id === p.id; });
  }
  /* ⭐ la luna non si accende e si spegne come gli altri stati: è un segno
     SUL TASTO — Design la colora con .st-des[data-stato="desiderato"] */
  function accendiLuna(dove, acceso) {
    Array.prototype.forEach.call(dove.querySelectorAll('[data-g="desidero"]'), function (b) {
      if (acceso) b.setAttribute("data-stato", "desiderato");
      else b.removeAttribute("data-stato");
      b.setAttribute("aria-pressed", acceso ? "true" : "false");
    });
  }

  /* ── disegnare ─────────────────────────────────────────────────── */
  function disegna(R, d, stato) {
    var P = F();
    var faccia = stato.faccia, scelto = stato.prodotto;

    P.riempi(R, { giorno: { data: oggi(), luna: "", santo: d.santo } });
    P.stato(R, "elenco", faccia === "elenco");
    P.stato(R, "scheda", faccia === "scheda");
    P.stato(R, "carrello", faccia === "carrello");
    P.riempi(R, { conto: { carrello: d.carrello.length ? String(d.carrello.length) : "" } });

    if (faccia === "elenco") elenco(R, d, stato);
    if (faccia === "scheda" && scelto) scheda(R, d, stato, scelto);
    if (faccia === "carrello") carrello(R, d, stato);

    /* i tasti che valgono sempre */
    P.gesto(R, "chiudi", function () { stato.faccia = "elenco"; disegna(R, d, stato); });
    P.gesto(R, "chiudi-carrello", function () { stato.faccia = "elenco"; disegna(R, d, stato); });
    P.gesto(R, "invita", function () {
      if (window.SpazioVivo && typeof window.SpazioVivo.invito === "function")
        return window.SpazioVivo.invito({});
      if (typeof window.vai === "function") window.vai("invito");
    });
  }

  /* ── l'elenco: tre gruppi fissi ───────────────────────────────── */
  function elenco(R, d, stato) {
    var P = F();
    var scaffali = [];
    d.prodotti.forEach(function (p) {
      var k = p.scaffale || "";
      var s = scaffali.filter(function (x) { return x.nome === k; })[0];
      if (s) s.quanti++; else if (k) scaffali.push({ nome: k, quanti: 1 });
    });

    P.riempi(R, { conto: { prodotti: String(d.prodotti.length) } });
    P.stampa(R, "scaffale", scaffali, function (c, s) {
      /* ⚠️ scaffale.quota: nel database non c'è, resta vuota */
      P.riempi(c, { scaffale: { nome: s.nome, quota: "" }, conto: { prodotti: String(s.quanti) } });
      c.setAttribute("aria-pressed", stato.scaffale === s.nome ? "true" : "false");
      P.gesto(c, "scegli-scaffale", function () {
        stato.scaffale = s.nome; stato.aperti = {}; disegna(R, d, stato);
      });
    });
    P.gesto(R, "tutti", function () { stato.scaffale = null; stato.aperti = {}; disegna(R, d, stato); });

    var qui = stato.scaffale
      ? d.prodotti.filter(function (p) { return p.scaffale === stato.scaffale; })
      : d.prodotti;
    P.stato(R, "senza-prodotti", qui.length === 0);

    /* i tre gruppi: prima il praticantato, poi il vicino, poi il lontano */
    function mio(p) { return !!(p.vicinato_id && (d.vicinati || []).indexOf(p.vicinato_id) >= 0); }
    var gruppi = [
      { k: "antahkarana", dentro: qui.filter(function (p) { return !!p.antahkarana; }) },
      { k: "vicino",      dentro: qui.filter(function (p) { return !p.antahkarana && mio(p); }) },
      { k: "lontano",     dentro: qui.filter(function (p) { return !p.antahkarana && !mio(p); }) }
    ];

    gruppi.forEach(function (g) {
      var box = R.querySelector('[data-gruppo="' + g.k + '"]');
      if (!box) return;
      P.stato(R, "ha-" + g.k, g.dentro.length > 0);
      var conto = {}; conto[g.k] = String(g.dentro.length);
      P.riempi(box, { conto: conto });

      var tutti = stato.aperti && stato.aperti[g.k];
      var visti = tutti ? g.dentro : g.dentro.slice(0, QUANTI);
      P.stampa(box, "prodotto", visti, function (pc, p) { riga(R, d, stato, pc, p); });

      var restano = g.dentro.length - visti.length;
      P.stato(box, "altri", restano > 0);
      var ca = {}; ca["altri_" + g.k] = String(restano);
      P.riempi(box, { conto: ca });
      P.gesto(box, "altri", function () {
        stato.aperti = stato.aperti || {}; stato.aperti[g.k] = true; disegna(R, d, stato);
      });
    });
  }

  /* una riga di prodotto, uguale in tutti e tre i gruppi */
  function riga(R, d, stato, pc, p) {
    var P = F(), chi = d.chi[p.persona_id] || {};
    P.riempi(pc, {
      prodotto: { nome: p.nome || "", foto: p.foto || "", prezzo: euro(p.prezzo),
                  nome_url: p.nome_url ? "?prodotto=" + p.nome_url : "#" },
      /* ⚠️ il comune di chi vende non passa dalla vista delle persone */
      persona: { nome: chi.nome || "", comune_cod: "" }
    });
    P.stato(pc, "senza-foto", !p.foto);
    P.stato(pc, "si-compra", !!p.si_compra);
    P.stato(pc, "si-scrive", !p.si_compra);
    P.stato(pc, "si-scambia", !!p.si_scambia);
    P.stato(pc, "si-dona", !!p.si_dona);
    P.stato(pc, "antahkarana", !!p.antahkarana);
    accendiLuna(pc, desiderato(d, p));
    P.gesto(pc, "apri-prodotto", function () {
      stato.faccia = "scheda"; stato.prodotto = p; stato.linguetta = 0;
      disegna(R, d, stato);
    });
    P.gesto(pc, "vendi", async function (e, b) { await alCarrello(R, d, stato, p, b); });
    P.gesto(pc, "scrivi", function () { scriviA(d, p); });
    P.gesto(pc, "desidero", async function () {
      try { await desidera(d, p); } catch (e) { console.warn("desideri:", e); }
      disegna(R, d, stato);
    });
  }

  /* ── la scheda ─────────────────────────────────────────────────── */
  function scheda(R, d, stato, p) {
    var P = F(), chi = d.chi[p.persona_id] || {};
    P.riempi(R, {
      prodotto: { nome: p.nome || "", foto: p.foto || "", racconto: p.racconto || "",
                  prezzo: euro(p.prezzo), nota: p.nota || "", scaffale: p.scaffale || "",
                  /* ⚠️ la colonna disponibilita non esiste ancora */
                  disponibilita: "" },
      persona: { nome: chi.nome || "", comune_cod: "",
                 nome_url: chi.nome_url ? "?p=" + chi.nome_url : "#" },
      scaffale: { quota: "" }
    });
    P.stato(R, "senza-foto", !p.foto);
    P.stato(R, "si-compra", !!p.si_compra);
    P.stato(R, "si-scrive", !p.si_compra);

    /* la galleria: la seconda foto */
    var foto = p.foto_secondaria ? [p.foto_secondaria] : [];
    P.stato(R, "ha-galleria", foto.length > 0);
    P.stampa(R, "foto", foto, function (c, f) {
      P.riempi(c, { prodotto: { foto_secondaria: f } });
    });

    /* le linguette: quelle che hanno qualcosa dentro, più le mie vuote */
    var mio = d.io && p.persona_id === d.io;
    var ling = LINGUETTE.filter(function (l) { return p[l.testo] || (mio && p[l.nome]); });
    P.stampa(R, "linguetta", ling, function (c, l, i) {
      var testo = p[l.testo] || "";
      P.riempi(c, { linguetta: { nome: p[l.nome] || "", gesto: "racconta" } });
      P.stato(c, "piena", !!testo);
      P.stato(c, "aperta", stato.linguetta === i);
      P.stato(c, "vuota-mia", !testo && mio);
      P.stampa(c, "blocco", testo ? [{ et: p[l.nome] || "", testo: testo }] : [],
        function (bc, b) { P.riempi(bc, { blocco: { et: b.et, testo: b.testo } }); });
      P.gesto(c, "apri-linguetta", function () {
        stato.linguetta = (stato.linguetta === i) ? -1 : i; disegna(R, d, stato);
      });
      P.gesto(c, "racconta", async function () {
        var t = prompt("Racconta");
        if (t === null || !t.trim()) return;
        var agg = {}; agg[l.testo] = t.trim();
        try {
          var r = await db.from("prodotti").update(agg).eq("id", p.id);
          if (r.error) throw r.error;
          p[l.testo] = t.trim(); disegna(R, d, stato);
        } catch (e) { console.warn("emporio:", e); }
      });
    });

    P.stato(R, "antahkarana", !!p.antahkarana);
    accendiLuna(R.querySelector('[data-stato="scheda"]') || R, desiderato(d, p));
    P.gesto(R, "vendi", async function (e, b) { await alCarrello(R, d, stato, p, b); });
    P.gesto(R, "scrivi", function () { scriviA(d, p); });
    P.gesto(R, "desidero", async function () {
      try { await desidera(d, p); } catch (e) { console.warn("desideri:", e); }
      disegna(R, d, stato);
    });
    /* condividere: il collegamento a questo prodotto */
    var dove = location.origin + location.pathname + "?prodotto=" + (p.nome_url || p.id);
    var a = R.querySelector('[data-g="condividi-mail"]');
    if (a) a.setAttribute("href", "mailto:?subject=" + encodeURIComponent(p.nome || "") +
                                  "&body=" + encodeURIComponent(dove));
    var m = R.querySelector('[data-g="condividi-messaggio"]');
    if (m) m.setAttribute("href", "sms:?&body=" + encodeURIComponent((p.nome || "") + " " + dove));
  }

  /* ── il carrello ───────────────────────────────────────────────── */
  function carrello(R, d, stato) {
    var P = F();
    var righe = d.carrello.map(function (r) {
      return { r: r, p: d.prodotti.filter(function (x) { return x.id === r.prodotto_id; })[0] };
    }).filter(function (x) { return x.p; });

    P.stato(R, "carrello-vuoto", righe.length === 0);
    var quanti = 0, totale = 0;
    righe.forEach(function (x) {
      quanti += (x.r.quante || 1);
      totale += (Number(x.p.prezzo) || 0) * (x.r.quante || 1);
    });

    P.stampa(R, "nel-carrello", righe, function (c, x) {
      var chi = d.chi[x.p.persona_id] || {};
      P.riempi(c, {
        prodotto: { nome: x.p.nome || "", foto: x.p.foto || "", prezzo: euro(x.p.prezzo) },
        persona: { nome: chi.nome || "" },
        conto: { quanti: String(x.r.quante || 1) }
      });
      P.gesto(c, "piu", async function () {
        try { await metti(d, x.p, 1); } catch (e) { console.warn("carrello:", e); }
        disegna(R, d, stato);
      });
      P.gesto(c, "meno", async function () {
        try { await metti(d, x.p, -1); } catch (e) { console.warn("carrello:", e); }
        disegna(R, d, stato);
      });
    });
    P.riempi(R, { conto: { quanti: String(quanti), totale: euro(totale) } });

    /* ⛔ il pagamento non è aperto: il tasto non porta ancora da nessuna parte */
    P.gesto(R, "paga", function () {
      if (typeof window.vai === "function") window.vai("carrello");
    });
  }

  async function alCarrello(R, d, stato, p, b) {
    if (!d.io) { if (typeof window.vai === "function") window.vai("accesso"); return; }
    var era = b && b.textContent;
    if (b) { b.disabled = true; b.textContent = "un momento\u2026"; }
    try { await metti(d, p, 1); }
    catch (e) { console.warn("carrello:", e); }
    if (b) { b.textContent = era; b.disabled = false; }
    disegna(R, d, stato);
  }

  /* scrivere a chi tiene il prodotto: oggi si va al suo profilo */
  function scriviA(d, p) {
    var chi = d.chi[p.persona_id] || {};
    if (chi.nome_url && typeof window.vai === "function") return window.vai("persona", { id: chi.nome_url });
    if (chi.nome_url) location.search = "?p=" + chi.nome_url;
  }

  /* ── la porta ──────────────────────────────────────────────────── */
  async function emporio(dove) {
    var box = typeof dove === "string" ? document.querySelector(dove) : dove;
    if (!box || !window.FMPiatto) return;
    var R = await F().monta(box, INDIRIZZO);
    if (R && R.body) R = R.body;
    var d = await leggi();
    disegna(R, d, { faccia: "elenco", scaffale: null, prodotto: null, linguetta: -1, aperti: {} });
  }

  window.SpazioVivo = window.SpazioVivo || {};
  window.SpazioVivo.emporio = emporio;
  window.FMEmporio = { disegna: disegna };
})();
