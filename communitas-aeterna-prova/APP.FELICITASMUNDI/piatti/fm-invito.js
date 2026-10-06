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
  var CASA = "app.felicitasmundi.com/";  /* 5 ottobre: felicitasmundi.com è il vecchio sito; la porta vera è app. */
  var APP = "app.felicitasmundi.com/communitas-aeterna/";
  /* le pagine d'anteprima fatte apposta per un evento (inviti/<nome>.html) */
  var PAGINE = { "1d8ba038-2393-49fb-9493-3511c9e3ded6": "villaggio-felicitas-sardegna/invito-11-ottobre.html?v=2" };
  /* ⭐ 2 ottobre 21:34, Gab: nel messaggio le righe che spiegano cosa si va a fare, il link alla fine */
  var TESTI = { "1d8ba038-2393-49fb-9493-3511c9e3ded6": "Villaggio Felicitas · 25 ottobre, ore 10:00 · al Cas'ale di Alessandra, Baratili (Oristano).\n\nIl primo incontro tra i vicinati della Sardegna. Mettiamo in piedi un contesto logistico per raccogliere la domanda del territorio — alimenti, energia, libri, produzioni in grande quantità — e dividerci il costo, con i punti di ritiro e i vicini che portano i pacchi.\n\nPrepariamo insieme il Felicitas Festival e partiamo col karma yoga: ognuno porta le sue proposte, e riconosciamo il talento e il valore di chi partecipa.\n\nAperto a chi punta all'autosufficienza alimentare ed energetica, ai gruppi solidali, alle terapie naturali, all'educazione, all'artigianato: a tutti i progetti che tengono viva la civiltà sarda." };

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
    /* ⭐ 2 ottobre 09:12, Gab: invitando da un evento, il collegamento apre QUELL'evento
       (si vede anche senza account) e porta con sé chi invita fino all'accesso. */
    /* ⭐ 16:51, Gab: «fai ora, invita chi risuona all'evento» — il collegamento passa da una pagina d'anteprima
       (foto con l'orma, titolo, descrizione) che WhatsApp sa leggere: quella dell'evento se c'è, se no quella di FelicitasMundi */
    /* 16:54, Gab: negli inviti agli eventi l'indirizzo dice il villaggio e l'evento, non chi lo manda */
    if (cosa.evento) url = PAGINE[cosa.evento] ? "app.felicitasmundi.com/" + PAGINE[cosa.evento] : APP + "inviti/evento.html?e=" + cosa.evento;

    var P = window.FMPiatto;
    var dati = { invito: { url: url }, conto: { invitati: String(d.quanti) },
                 persona: { nome: d.nome || "" } };
    if (P && P.riempi) P.riempi(R.body || R, dati);
    var ue = (R.body || R).querySelector("#url");
    if (ue) { if (cosa.evento && TESTI[cosa.evento]) ue.setAttribute("data-testo", TESTI[cosa.evento]); else ue.removeAttribute("data-testo"); }

    /* ⛔ solo «chiudi»: gli altri tasti sono della pagina */
    var x = (R.body || R).querySelector('[data-g="chiudi"]');
    if (x) x.onclick = function () {
      if (cosa.evento && typeof window.vai === "function") return window.vai("evento", { id: cosa.evento });
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
  /* ⭐ 3 ottobre 13:59, Gab: «invita chi risuona … toccando il tasto devi leggere copia o condividi via WhatsApp» —
     niente pagina a parte: sotto il tasto si apre una tendina con le tre strade, e il messaggio porta il link in fondo */
  function perEvento(id, titolo) {
    var u = PAGINE[id] ? "https://app.felicitasmundi.com/" + PAGINE[id] : "https://" + APP + "inviti/evento.html?e=" + id;
    return { url: u, testo: TESTI[id] || (titolo || "") };
  }
  function condividi(tasto, cosa) {
    if (!tasto) return;
    var D = tasto.ownerDocument, W = D.defaultView || window;
    var dove = tasto.closest("#ev-invita") || tasto.parentNode;
    var c = dove.parentNode.querySelector(":scope > .fm-condividi");
    if (c) { c.remove(); return; }
    var msg = (cosa.testo ? cosa.testo + "\n\n" : "") + cosa.url;
    c = D.createElement("div");
    c.className = "fm-condividi";
    c.style.cssText = "display:flex;flex-wrap:wrap;gap:.6rem;margin:.2rem 0 .4rem";
    var T = "min-height:2.9rem;padding:.6rem 1.1rem;border-radius:999px;font-family:'Cinzel',serif;font-size:.85rem;letter-spacing:.1em;text-transform:uppercase;display:inline-flex;align-items:center;gap:.5rem;cursor:pointer;text-decoration:none;box-sizing:border-box;";
    c.innerHTML =
      '<button type="button" data-c="copia" style="' + T + 'border:1px solid rgba(212,175,106,.6);background:rgba(8,11,26,.6);color:#D4AF6A">copia</button>' +
      '<a data-c="wa" target="_blank" rel="noopener" style="' + T + 'background:#25D366;color:#06210f;border:0">WhatsApp</a>' +
      (W.navigator.share ? '<button type="button" data-c="altro" style="' + T + 'border:1px solid rgba(212,175,106,.6);background:rgba(8,11,26,.6);color:#D4AF6A">altre app</button>' : '');
    c.querySelector('[data-c="wa"]').href = "https://wa.me/?text=" + encodeURIComponent(msg);
    c.querySelector('[data-c="copia"]').onclick = function () {
      var b = this, fatto = function () { b.textContent = "copiato"; setTimeout(function () { b.textContent = "copia"; }, 1800); };
      try { (W.navigator.clipboard || navigator.clipboard).writeText(msg).then(fatto, fatto); } catch (e) { fatto(); }
    };
    var al = c.querySelector('[data-c="altro"]');
    if (al) al.onclick = function () { W.navigator.share({ title: cosa.titolo || "FelicitasMundi", text: msg }).catch(function () {}); };
    dove.parentNode.insertBefore(c, dove.nextSibling);
  }

  window.FMInvito = { disegna: disegna, perEvento: perEvento, condividi: condividi };
})();
