/* ═══════════════════════════════════════════════════════════════
   FM-INVITO — «invita chi risuona», dalla pagina di Design.

   ⭐ Disegno di Design: invito-piatto.html, segnata col vocabolario.
   ⛔ COPIA, MESSAGGIO, POSTA e CONDIVIDI non si collegano qui: li fa già
      lo script della pagina. Collegarli vorrebbe dire spegnerli.
      Qui si mettono solo i dati, e il tasto che chiude.

   COSA METTE:
     · il collegamento col TUO nome: ?invito=<persone.nome_url>
     · quante persone sono arrivate dal tuo invito (persone.invitato_da)
     · nell'anteprima, «ti ha invitato [ il tuo nome ]»

   ⛔ NON È UN'ORMA: un invito non è lavoro, è una persona che manca.
   ⭐ Chi arriva accetta l'invito entrando: fm_accetta_invito scrive chi
      l'ha chiamato e lo mette nella rubrica di chi invita.

   Vuole:   `db` (Supabase) · fm-piatto.js se si apre come pagina piatta
   Espone:  SpazioVivo.invito(cosa)   — cosa: { evento, titolo } (facoltativi)
   ═══════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  var INDIRIZZO = "APP.FELICITASMUNDI/piatti/invito-piatto.html";
  var CASA = "felicitasmundi.com/";

  async function leggi() {
    var d = { io: null, nome: "", slug: "", quanti: 0 };
    try {
      var u = await db.auth.getUser();
      d.io = u && u.data && u.data.user && u.data.user.id;
      if (!d.io) return d;

      var p = await db.from("persone").select("nome,nome_url").eq("id", d.io).single();
      if (!p.error && p.data) { d.nome = p.data.nome || ""; d.slug = p.data.nome_url || ""; }

      var c = await db.from("persone").select("id", { count: "exact", head: true })
        .eq("invitato_da", d.io);
      if (!c.error) d.quanti = c.count || 0;
    } catch (e) { console.warn("invito:", e); }
    return d;
  }

  /* riempire la pagina, dovunque sia: la finestra o il documento */
  function disegna(R, d, cosa) {
    cosa = cosa || {};
    var url = CASA + "?invito=" + (d.slug || "");
    if (cosa.evento) url += "&evento=" + cosa.evento;

    var P = window.FMPiatto;
    var dati = { invito: { url: url }, conto: { invitati: String(d.quanti) },
                 persona: { nome: d.nome || "" } };
    if (P && P.riempi) P.riempi(R.body || R, dati);

    /* ⛔ solo «chiudi»: gli altri tasti sono della pagina */
    var x = (R.body || R).querySelector('[data-g="chiudi"]');
    if (x) x.onclick = function () {
      if (typeof window.vai === "function") return window.vai("orme");
      history.back();
    };
  }

  /* la porta: dentro il guscio si apre come le altre pagine piatte */
  async function invito(cosa) {
    cosa = cosa || {};
    var box = cosa.dove || document.querySelector("#centro") || document.body;
    var d = await leggi();
    if (window.FMPiatto && typeof window.FMPiatto.monta === "function" && cosa.dove !== null) {
      try {
        var R = await window.FMPiatto.monta(box, INDIRIZZO);
        if (R && R.body) R = R.body;
        disegna(R, d, cosa);
        return;
      } catch (e) { console.warn("invito:", e); }
    }
    disegna(document, d, cosa);
  }

  window.SpazioVivo = window.SpazioVivo || {};
  window.SpazioVivo.invito = invito;
  window.FMInvito = { disegna: disegna };
})();
