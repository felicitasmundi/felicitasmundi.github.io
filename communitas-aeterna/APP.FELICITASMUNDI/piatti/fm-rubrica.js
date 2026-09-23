/* ═══════════════════════════════════════════════════════════════
   FM-RUBRICA — i contatti, dalla versione piatta di Design.

   ⭐ Disegno di Design: rubrica-piatto.html.
   ⭐ I gruppi sono le cinque stanze: `contatti.stanza` — vicinati,
      emporio, assistenza, edizione, scuola. Un gruppo vuoto non si vede.
   ⭐ Chi ha un account porta al suo profilo e mostra la foto; chi non
      ce l'ha resta un nome coll'iniziale.
   ⚠️ Il cognome: la tavola dei contatti ha un nome solo. Se dentro c'è
      nome e cognome, si divide alla prima spaziatura.

   Vuole:   fm-piatto.js prima · `db` · `vai`
   Espone:  SpazioVivo.rubrica(dove)
   ═══════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  var INDIRIZZO = "APP.FELICITASMUNDI/piatti/rubrica-piatto.html";
  var STANZE = [
    { el: "terra", k: "vicinati",   nome: "I Vicinati" },
    { el: "acqua", k: "emporio",    nome: "L\u2019Emporio" },
    { el: "fuoco", k: "assistenza", nome: "L\u2019Assistenza" },
    { el: "aria",  k: "edizione",   nome: "L\u2019Edizione" },
    { el: "etere", k: "scuola",     nome: "La Scuola" }
  ];
  var F = function () { return window.FMPiatto; };

  function nomeCognome(s) {
    var p = String(s || "").trim().split(/\s+/);
    return { nome: p.shift() || "", cognome: p.join(" ") };
  }

  async function leggi() {
    var d = { io: null, contatti: [], chi: {} };
    try {
      var u = await db.auth.getUser();
      d.io = u && u.data && u.data.user && u.data.user.id;
      if (!d.io) return d;

      var c = await db.from("contatti")
        .select("id,nome,telefono,dove,come_conosciuto,note,stato,stanza,persona_id,creato_il")
        .eq("proprietario_id", d.io).order("nome");
      d.contatti = c.error ? [] : (c.data || []);

      var pid = d.contatti.map(function (x) { return x.persona_id; }).filter(Boolean);
      if (pid.length) {
        var pp = await db.from("persone_pubbliche").select("id,nome,nome_url,foto_url").in("id", pid);
        (pp.error ? [] : pp.data || []).forEach(function (r) { d.chi[r.id] = r; });
      }
    } catch (e) { console.warn("rubrica:", e); }
    return d;
  }

  function disegna(R, d, stato) {
    var P = F();
    var cerca = String(stato.cerca || "").trim().toLowerCase();
    var tutti = d.contatti.filter(function (c) {
      if (!cerca) return true;
      return (c.nome || "").toLowerCase().indexOf(cerca) >= 0;
    });

    P.riempi(R, { conto: { contatti: String(tutti.length) } });
    P.stato(R, "senza-contatti", tutti.length === 0);

    /* i gruppi: solo le stanze che hanno qualcuno */
    var gruppi = [];
    STANZE.forEach(function (s) {
      var dentro = tutti.filter(function (c) { return (c.stanza || "") === s.k; });
      if (stato.stanza && stato.stanza !== "tutti" && stato.stanza !== s.el) return;
      if (dentro.length) gruppi.push({ s: s, dentro: dentro });
    });
    /* chi non ha ancora una stanza, quando si guardano tutti */
    if (!stato.stanza || stato.stanza === "tutti") {
      var senza = tutti.filter(function (c) {
        return !STANZE.some(function (s) { return s.k === (c.stanza || ""); });
      });
      if (senza.length) gruppi.push({ s: { el: "", nome: "" }, dentro: senza });
    }

    P.stampa(R, "stanza", gruppi, function (c, g) {
      P.riempi(c, { stanza: { nome: g.s.nome, elemento: g.s.el, riga: "" },
                    conto: { contatti: String(g.dentro.length) } });
      P.stampa(c, "contatto", g.dentro, function (cc, x) {
        var nc = nomeCognome(x.nome), chi = d.chi[x.persona_id] || {};
        var legame = x.come_conosciuto || x.note || "";
        P.riempi(cc, { contatto: {
          nome: nc.nome, cognome: nc.cognome, iniziale: (nc.nome || "?").charAt(0).toUpperCase(),
          foto_url: chi.foto_url || "", comune_cod: x.dove || "", legame: legame,
          telefono: x.telefono ? "tel:" + x.telefono : "",
          nome_url: chi.nome_url ? "?p=" + chi.nome_url : "#" } });
        P.stato(cc, "ha-dettagli", !!(x.dove || legame));
        P.stato(cc, "ha-telefono", !!x.telefono);
        P.gesto(cc, "apri-contatto", function () {
          if (!chi.nome_url) return;
          if (typeof window.vai === "function") window.vai("persona", { id: chi.nome_url });
        });
        /* ⭐ il telefono è un collegamento vero: lo apre il telefono */
        var t = cc.querySelector('[data-g="chiama"]');
        if (t && x.telefono) t.onclick = null;
      });
    });

    /* i cinque filtri, e la ricerca */
    Array.prototype.forEach.call(R.querySelectorAll('[data-g="filtra-stanza"]'), function (b) {
      var k = b.getAttribute("data-stanza");
      b.setAttribute("aria-pressed", (stato.stanza || "tutti") === k ? "true" : "false");
      b.onclick = function () { stato.stanza = k; disegna(R, d, stato); };
    });
    var campo = R.querySelector('[data-c="rubrica.cerca"]');
    if (campo && !campo._fm) {
      campo._fm = true;
      campo.oninput = function () { stato.cerca = campo.value; disegna(R, d, stato); };
    }
  }

  async function rubrica(dove) {
    var box = typeof dove === "string" ? document.querySelector(dove) : dove;
    if (!box || !window.FMPiatto) return;
    var R = await F().monta(box, INDIRIZZO);
    if (R && R.body) R = R.body;
    var d = await leggi();
    disegna(R, d, { stanza: "tutti", cerca: "" });
  }

  window.SpazioVivo = window.SpazioVivo || {};
  window.SpazioVivo.rubrica = rubrica;
  window.FMRubrica = { disegna: disegna };
})();
