/* ═══════════════════════════════════════════════════════════════
   FM-SCUOLA — la stanza della Scuola, dalla versione piatta.

   ⭐ Disegno di Design: stanza-scuola-piatto.html.
   DUE VOCI: le lezioni in presenza · quelle online.
      Una classe è ONLINE se almeno un suo incontro si tiene online.
   DUE FACCE: l'elenco delle classi · la scheda, cogli incontri in fila.

   ⚠️ DUE COSE ASPETTANO:
     · «iscrivi» — l'iscrizione a una classe nel database non esiste:
       oggi il tasto porta da chi insegna
     · le linguette: una classe ha un racconto solo, quindi restano vuote

   Vuole:   fm-piatto.js prima · `db` · `vai`
   Espone:  SpazioVivo.scuola(dove)
   ═══════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  var INDIRIZZO = "APP.FELICITASMUNDI/piatti/stanza-scuola-piatto.html";
  var QUANTI = 6;
  var MESI = ["gennaio","febbraio","marzo","aprile","maggio","giugno","luglio",
              "agosto","settembre","ottobre","novembre","dicembre"];
  var F = function () { return window.FMPiatto; };

  function euro(n) {
    if (n === null || n === undefined || n === "") return "";
    return Number(n).toFixed(2).replace(".", ",") + " \u20ac";
  }
  function quando(s) {
    if (!s) return "";
    var x = new Date(s);
    if (isNaN(x)) return "";
    return x.getDate() + " " + MESI[x.getMonth()] + ", " +
           String(x.getHours()).padStart(2, "0") + ":" + String(x.getMinutes()).padStart(2, "0");
  }
  function oggi() { var d = new Date(); return d.getDate() + " " + MESI[d.getMonth()]; }
  function online(i) { return /online|distanza|zoom|diretta/i.test(String(i.sala || "")); }

  async function leggi() {
    var d = { io: null, classi: [], incontri: {}, chi: {}, santo: "" };
    try {
      var u = await db.auth.getUser();
      d.io = u && u.data && u.data.user && u.data.user.id;

      var c = await db.from("classi")
        .select("id,titolo,occhiello,racconto,chi_entra,prezzo,stato,persona_id")
        .order("creata_il", { ascending: false }).limit(200);
      d.classi = c.error ? [] : (c.data || []);

      if (d.classi.length) {
        var ii = await db.from("classi_incontri")
          .select("id,classe_id,ordine,titolo,quando,durata_min,sala,registrazione,stato")
          .in("classe_id", d.classi.map(function (x) { return x.id; }))
          .order("ordine");
        (ii.error ? [] : ii.data || []).forEach(function (r) {
          (d.incontri[r.classe_id] = d.incontri[r.classe_id] || []).push(r);
        });
      }

      var pid = d.classi.map(function (x) { return x.persona_id; }).filter(Boolean);
      if (pid.length) {
        var pp = await db.from("persone_pubbliche").select("id,nome,nome_url,foto_url").in("id", pid);
        (pp.error ? [] : pp.data || []).forEach(function (r) { d.chi[r.id] = r; });
      }

      var da = new Date();
      var mmgg = String(da.getMonth() + 1).padStart(2, "0") + "-" + String(da.getDate()).padStart(2, "0");
      var sa = await db.from("santi").select("nome").eq("giorno", mmgg).limit(1);
      if (!sa.error && sa.data && sa.data[0]) d.santo = sa.data[0].nome;
    } catch (e) { console.warn("scuola:", e); }
    return d;
  }

  function suoi(d, c) { return d.incontri[c.id] || []; }
  function eOnline(d, c) { return suoi(d, c).some(online); }
  function vaiDa(d, c) {
    var chi = d.chi[c.persona_id] || {};
    if (!chi.nome_url) return;
    if (typeof window.vai === "function") return window.vai("persona", { id: chi.nome_url });
    location.search = "?p=" + chi.nome_url;
  }

  function disegna(R, d, stato) {
    var P = F();
    P.riempi(R, { giorno: { data: oggi(), luna: "", santo: d.santo } });
    P.stato(R, "elenco", stato.faccia === "elenco");
    P.stato(R, "scheda", stato.faccia === "scheda");
    if (stato.faccia === "elenco") elenco(R, d, stato);
    if (stato.faccia === "scheda" && stato.classe) scheda(R, d, stato, stato.classe);

    P.gesto(R, "chiudi", function () { stato.faccia = "elenco"; disegna(R, d, stato); });
    P.gesto(R, "invita", function () {
      if (window.SpazioVivo && typeof window.SpazioVivo.invito === "function")
        return window.SpazioVivo.invito({});
      if (typeof window.vai === "function") window.vai("invito");
    });
  }

  function elenco(R, d, stato) {
    var P = F();
    var online_ = d.classi.filter(function (c) { return eOnline(d, c); });
    var presenza = d.classi.filter(function (c) { return !eOnline(d, c); });
    P.riempi(R, { conto: { classi: String(presenza.length), online: String(online_.length) } });

    var qui = stato.voce === "online" ? online_ : presenza;
    P.stato(R, "senza-classi", qui.length === 0);
    Array.prototype.forEach.call(R.querySelectorAll('[data-g="voce-lezioni"],[data-g="voce-online"]'),
      function (b) {
        var mia = b.getAttribute("data-g") === (stato.voce === "online" ? "voce-online" : "voce-lezioni");
        b.setAttribute("aria-pressed", mia ? "true" : "false");
      });
    P.gesto(R, "voce-lezioni", function () { stato.voce = "lezioni"; stato.aperti = {}; disegna(R, d, stato); });
    P.gesto(R, "voce-online", function () { stato.voce = "online"; stato.aperti = {}; disegna(R, d, stato); });

    var nome = stato.voce === "online" ? "Online" : "Le lezioni";
    P.stampa(R, "gruppo", qui.length ? [{ nome: nome, dentro: qui }] : [], function (c, g) {
      P.riempi(c, { gruppo: { nome: g.nome }, conto: { classi: String(g.dentro.length) } });
      var visti = (stato.aperti && stato.aperti[g.nome]) ? g.dentro : g.dentro.slice(0, QUANTI);
      P.stampa(c, "classe", visti, function (cc, cl) {
        var chi = d.chi[cl.persona_id] || {}, primo = suoi(d, cl)[0] || {};
        P.riempi(cc, {
          classe: { titolo: cl.titolo || "", prezzo: euro(cl.prezzo) },
          persona: { nome: chi.nome || "", foto_url: chi.foto_url || "" },
          incontro: { sala: primo.sala || "", quando: quando(primo.quando) }
        });
        P.stato(cc, "online", eOnline(d, cl));
        P.stato(cc, "si-paga", !!cl.prezzo);
        P.stato(cc, "dono", !cl.prezzo);
        P.gesto(cc, "apri-classe", function () {
          stato.faccia = "scheda"; stato.classe = cl; stato.linguetta = -1; disegna(R, d, stato);
        });
        /* ⚠️ iscriversi non esiste ancora: si va da chi insegna */
        P.gesto(cc, "iscrivi", function () { vaiDa(d, cl); });
      });
      var restano = g.dentro.length - visti.length;
      P.stato(c, "altri", restano > 0);
      P.riempi(c, { conto: { altri: String(restano) } });
      P.gesto(c, "altri", function () {
        stato.aperti = stato.aperti || {}; stato.aperti[g.nome] = true; disegna(R, d, stato);
      });
    });
  }

  function scheda(R, d, stato, cl) {
    var P = F(), chi = d.chi[cl.persona_id] || {}, inc = suoi(d, cl);
    P.riempi(R, {
      classe: { titolo: cl.titolo || "", occhiello: cl.occhiello || "",
                racconto: cl.racconto || "", chi_entra: cl.chi_entra || "",
                prezzo: euro(cl.prezzo), stato: cl.stato || "" },
      persona: { nome: chi.nome || "", foto_url: chi.foto_url || "",
                 nome_url: chi.nome_url ? "?p=" + chi.nome_url : "#" },
      conto: { incontri: String(inc.length) }
    });
    P.stato(R, "si-paga", !!cl.prezzo);
    P.stato(R, "dono", !cl.prezzo);

    P.stampa(R, "incontro", inc, function (c, i) {
      P.riempi(c, { incontro: {
        ordine: i.ordine ? String(i.ordine) : "", titolo: i.titolo || "",
        quando: quando(i.quando), durata_min: i.durata_min ? i.durata_min + " min" : "",
        sala: i.sala || "", stato: i.stato || "",
        registrazione: i.registrazione || "#" } });
      P.stato(c, "ha-registrazione", !!i.registrazione);
    });

    /* ⚠️ nessuna linguetta: una classe ha un racconto solo */
    P.stampa(R, "linguetta", [], function () {});

    P.gesto(R, "iscrivi", function () { vaiDa(d, cl); });
    P.gesto(R, "scrivi", function () { vaiDa(d, cl); });

    var dove = location.origin + location.pathname + "?classe=" + cl.id;
    var a = R.querySelector('[data-g="condividi-mail"]');
    if (a) a.setAttribute("href", "mailto:?subject=" + encodeURIComponent(cl.titolo || "") +
                                  "&body=" + encodeURIComponent(dove));
    var m = R.querySelector('[data-g="condividi-messaggio"]');
    if (m) m.setAttribute("href", "sms:?&body=" + encodeURIComponent((cl.titolo || "") + " " + dove));
  }

  async function scuola(dove) {
    var box = typeof dove === "string" ? document.querySelector(dove) : dove;
    if (!box || !window.FMPiatto) return;
    var R = await F().monta(box, INDIRIZZO);
    if (R && R.body) R = R.body;
    var d = await leggi();
    disegna(R, d, { faccia: "elenco", voce: "lezioni", classe: null, linguetta: -1, aperti: {} });
  }

  window.SpazioVivo = window.SpazioVivo || {};
  window.SpazioVivo.scuola = scuola;
  window.FMScuola = { disegna: disegna };
})();
