/* ═══════════════════════════════════════════════════════════════
   FM-ASSISTENZA — la stanza dell'Assistenza, dalla versione piatta.

   ⭐ Disegno di Design: stanza-assistenza-piatto.html.
   DUE FACCE: l'elenco dei servizi, raccolti per tipo · la scheda di uno.
   ⭐ Si vedono solo i servizi ATTIVI.
   ⭐ Un servizio può essere a distanza, in dono, o pagabile in talenti:
      sono stati, non testi.

   ⚠️ DUE COSE ASPETTANO:
     · «prenota» — una prenotazione nel database non esiste ancora:
       oggi il tasto porta da chi offre il servizio
     · le linguette della scheda: i servizi hanno una sola colonna di
       racconto (descrizione), quindi non ci sono linguette da riempire

   Vuole:   fm-piatto.js prima · `db` · `vai`
   Espone:  SpazioVivo.assistenza(dove)
   ═══════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  var INDIRIZZO = "APP.FELICITASMUNDI/piatti/stanza-assistenza-piatto.html";
  var QUANTI = 6;
  var MESI = ["gennaio","febbraio","marzo","aprile","maggio","giugno","luglio",
              "agosto","settembre","ottobre","novembre","dicembre"];
  var F = function () { return window.FMPiatto; };

  function euro(n) {
    if (n === null || n === undefined || n === "") return "";
    return Number(n).toFixed(2).replace(".", ",") + " \u20ac";
  }
  function minuti(n) { return n ? n + " min" : ""; }
  function oggi() { var d = new Date(); return d.getDate() + " " + MESI[d.getMonth()]; }

  async function leggi() {
    var d = { io: null, servizi: [], chi: {}, santo: "" };
    try {
      var u = await db.auth.getUser();
      d.io = u && u.data && u.data.user && u.data.user.id;

      var s = await db.from("servizi")
        .select("id,titolo,descrizione,tipo,durata_minuti,a_distanza,prezzo_euro," +
                "accetta_talenti,quanti_talenti,dono,attivo,nome_url,persona_id")
        .eq("attivo", true).order("creato_il", { ascending: false }).limit(300);
      d.servizi = s.error ? [] : (s.data || []);

      var pid = d.servizi.map(function (x) { return x.persona_id; }).filter(Boolean);
      if (pid.length) {
        var pp = await db.from("persone_pubbliche").select("id,nome,nome_url,foto_url").in("id", pid);
        (pp.error ? [] : pp.data || []).forEach(function (r) { d.chi[r.id] = r; });
      }

      var da = new Date();
      var mmgg = String(da.getMonth() + 1).padStart(2, "0") + "-" + String(da.getDate()).padStart(2, "0");
      var sa = await db.from("santi").select("nome").eq("giorno", mmgg).limit(1);
      if (!sa.error && sa.data && sa.data[0]) d.santo = sa.data[0].nome;
    } catch (e) { console.warn("assistenza:", e); }
    return d;
  }

  /* chi offre il servizio */
  function suo(R, d, s, dove) {
    var chi = d.chi[s.persona_id] || {};
    F().riempi(dove, {
      persona: { nome: chi.nome || "", foto_url: chi.foto_url || "",
                 /* ⚠️ il comune non passa dalla vista delle persone */
                 comune_cod: "", nome_url: chi.nome_url ? "?p=" + chi.nome_url : "#",
                 descrizione_cuore: "" }
    });
  }
  function vaiDa(d, s) {
    var chi = d.chi[s.persona_id] || {};
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
    if (stato.faccia === "scheda" && stato.servizio) scheda(R, d, stato, stato.servizio);

    P.gesto(R, "chiudi", function () { stato.faccia = "elenco"; disegna(R, d, stato); });
    P.gesto(R, "invita", function () {
      if (window.SpazioVivo && typeof window.SpazioVivo.invito === "function")
        return window.SpazioVivo.invito({});
      if (typeof window.vai === "function") window.vai("invito");
    });
  }

  function elenco(R, d, stato) {
    var P = F(), tipi = [];
    d.servizi.forEach(function (s) {
      var k = s.tipo || "";
      var t = tipi.filter(function (x) { return x.tipo === k; })[0];
      if (t) t.quanti++; else if (k) tipi.push({ tipo: k, quanti: 1 });
    });

    P.riempi(R, { conto: { servizi: String(d.servizi.length) } });
    P.stampa(R, "tipo", tipi, function (c, t) {
      P.riempi(c, { servizio: { tipo: t.tipo }, conto: { servizi: String(t.quanti) } });
      c.setAttribute("aria-pressed", stato.tipo === t.tipo ? "true" : "false");
      P.gesto(c, "scegli-tipo", function () {
        stato.tipo = t.tipo; stato.aperti = {}; disegna(R, d, stato);
      });
    });
    P.gesto(R, "tutti", function () { stato.tipo = null; stato.aperti = {}; disegna(R, d, stato); });

    var qui = stato.tipo
      ? d.servizi.filter(function (s) { return s.tipo === stato.tipo; })
      : d.servizi;
    P.stato(R, "senza-servizi", qui.length === 0);

    var gruppi = [];
    qui.forEach(function (s) {
      var k = s.tipo || "";
      var g = gruppi.filter(function (x) { return x.nome === k; })[0];
      if (g) g.dentro.push(s); else gruppi.push({ nome: k, dentro: [s] });
    });

    P.stampa(R, "gruppo", gruppi, function (c, g) {
      P.riempi(c, { gruppo: { nome: g.nome }, conto: { servizi: String(g.dentro.length) } });
      var tutti = stato.aperti && stato.aperti[g.nome];
      var visti = tutti ? g.dentro : g.dentro.slice(0, QUANTI);
      P.stampa(c, "servizio", visti, function (sc, s) {
        P.riempi(sc, { servizio: {
          titolo: s.titolo || "", durata_minuti: minuti(s.durata_minuti),
          prezzo_euro: euro(s.prezzo_euro),
          quanti_talenti: s.quanti_talenti ? String(s.quanti_talenti) : "",
          nome_url: s.nome_url ? "?servizio=" + s.nome_url : "#" } });
        suo(R, d, s, sc);
        P.stato(sc, "a-distanza", !!s.a_distanza);
        P.stato(sc, "dono", !!s.dono);
        P.stato(sc, "accetta-talenti", !!s.accetta_talenti);
        P.stato(sc, "si-paga", !s.dono && !!s.prezzo_euro);
        P.gesto(sc, "apri-servizio", function () {
          stato.faccia = "scheda"; stato.servizio = s; stato.linguetta = -1;
          disegna(R, d, stato);
        });
        /* ⚠️ prenotare non esiste ancora: si va da chi offre */
        P.gesto(sc, "prenota", function () { vaiDa(d, s); });
      });
      var restano = g.dentro.length - visti.length;
      P.stato(c, "altri", restano > 0);
      P.riempi(c, { conto: { altri: String(restano) } });
      P.gesto(c, "altri", function () {
        stato.aperti = stato.aperti || {}; stato.aperti[g.nome] = true; disegna(R, d, stato);
      });
    });
  }

  function scheda(R, d, stato, s) {
    var P = F();
    P.riempi(R, { servizio: {
      titolo: s.titolo || "", descrizione: s.descrizione || "", tipo: s.tipo || "",
      durata_minuti: minuti(s.durata_minuti), prezzo_euro: euro(s.prezzo_euro),
      quanti_talenti: s.quanti_talenti ? String(s.quanti_talenti) : "" } });
    suo(R, d, s, R);
    P.stato(R, "a-distanza", !!s.a_distanza);
    P.stato(R, "dono", !!s.dono);
    P.stato(R, "accetta-talenti", !!s.accetta_talenti);
    P.stato(R, "si-paga", !s.dono && !!s.prezzo_euro);
    P.stato(R, "attivo", !!s.attivo);
    /* ⚠️ nessuna linguetta: i servizi hanno un racconto solo */
    P.stampa(R, "linguetta", [], function () {});

    P.gesto(R, "prenota", function () { vaiDa(d, s); });
    P.gesto(R, "scrivi", function () { vaiDa(d, s); });

    var dove = location.origin + location.pathname + "?servizio=" + (s.nome_url || s.id);
    var a = R.querySelector('[data-g="condividi-mail"]');
    if (a) a.setAttribute("href", "mailto:?subject=" + encodeURIComponent(s.titolo || "") +
                                  "&body=" + encodeURIComponent(dove));
    var m = R.querySelector('[data-g="condividi-messaggio"]');
    if (m) m.setAttribute("href", "sms:?&body=" + encodeURIComponent((s.titolo || "") + " " + dove));
  }

  async function assistenza(dove) {
    var box = typeof dove === "string" ? document.querySelector(dove) : dove;
    if (!box || !window.FMPiatto) return;
    var R = await F().monta(box, INDIRIZZO);
    if (R && R.body) R = R.body;
    var d = await leggi();
    disegna(R, d, { faccia: "elenco", tipo: null, servizio: null, linguetta: -1, aperti: {} });
  }

  window.SpazioVivo = window.SpazioVivo || {};
  window.SpazioVivo.assistenza = assistenza;
  window.FMAssistenza = { disegna: disegna };
})();
