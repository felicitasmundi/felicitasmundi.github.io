/* ═══════════════════════════════════════════════════════════════
   FM-VETRINA — pubblicare da dentro un'orma.

   ⭐ La vetrina la costruisce lo script di Design mentre la si usa: i
      campi nascono quando si sceglie il tipo. Per questo il codice
      NON si collega una volta sola — sta in ascolto sul documento, e
      raccoglie i valori nel momento in cui si tocca «pubblica».

   COME LEGGE: Design marca ogni campo — data-c="vet.<chiave>" per le
   caselle, lo stesso sulle file di scelte (la scelta fatta ha la
   classe «su» e il suo data-v), data-stampo="vet-foto" per le foto,
   data-stampo="vet-tipo" per i cinque tipi.

   ⛔ LA DICHIARAZIONE DEI DIRITTI è obbligatoria quando c'è una foto:
      senza la casella spuntata non si pubblica, e appena pubblicato
      si scrive fm_dichiaro_diritti sulla cosa nata.

   DOVE FINISCE QUELLO CHE PUBBLICHI:
     prodotto   → prodotti      (Emporio)
     assistenza → servizi       (Assistenza)
     lezione    → classi        (Scuola)
     vicinato   → un'orma pubblica legata a questa (Vicinati)
     stampa     → il configuratore, e lo apre già Design

   ⭐ LE FOTO vanno nel magazzino `pubblico` — si vedono senza account —
      dentro le cartelle ammesse: prodotti · bacheche. Gli allegati
      privati di un'orma restano nel magazzino `riservato`.
   ⚠️ DA CONFERMARE: in quale cartella vanno le foto dei servizi e
      delle lezioni. Per ora vanno in «prodotti».

   Vuole:   fm-piatto.js · `db` · `vai`
   Espone:  SpazioVivo.vetrina(R, ormaId, dopo)
   ═══════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  var BUCKET = "pubblico";              /* il magazzino aperto: si vede senza account */
  /* ⭐ il magazzino pubblico ammette tre cartelle: prodotti · bacheche · articoli.
     Scrivere nella radice viene rifiutato. */
  var CARTELLE = { prodotto: "prodotti", assistenza: "prodotti",
                   lezione: "prodotti", vicinato: "bacheche" };
  var VERSIONE_DIRITTI = "2026-09-23";  /* la versione del testo dichiarato */
  var F = function () { return window.FMPiatto; };

  /* ── raccogliere quello che è stato scritto ────────────────────── */
  function raccogli(R) {
    var d = { tipo: null, campi: {}, foto: [], dichiaro: false };

    var t = R.querySelector('[data-stampo="vet-tipo"].su');
    d.tipo = t ? t.getAttribute("data-tipo") : null;

    Array.prototype.forEach.call(R.querySelectorAll('[data-c^="vet."]'), function (el) {
      var k = el.getAttribute("data-c").slice(4);
      if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") d.campi[k] = el.value.trim();
      else {                                   /* una fila di scelte */
        var s = el.querySelector("button.su");
        if (s) d.campi[k] = s.getAttribute("data-v") || s.textContent.trim();
      }
    });

    Array.prototype.forEach.call(R.querySelectorAll('[data-stampo="vet-foto"]'), function (m) {
      var u = (m.style.backgroundImage || "").replace(/^url\(["']?/, "").replace(/["']?\)$/, "");
      if (u) d.foto.push(u);
    });

    var cb = R.querySelector('[data-c="diritti.dichiaro"]');
    d.dichiaro = !!(cb && cb.checked);
    return d;
  }

  /* ── le foto: dal telefono al magazzino ────────────────────────── */
  async function salvaFoto(urls, chi, tipo) {
    var dentro = [];
    for (var i = 0; i < urls.length; i++) {
      var u = urls[i];
      if (/^https?:/.test(u)) { dentro.push(u); continue; }   /* già in rete */
      try {
        var b = await (await fetch(u)).blob();
        var nome = (CARTELLE[tipo] || "prodotti") + "/" + chi + "/" +
                   Date.now() + "-" + i + "." + ((b.type.split("/")[1]) || "jpg");
        var s = await db.storage.from(BUCKET).upload(nome, b, { contentType: b.type });
        if (s.error) throw s.error;
        var p = db.storage.from(BUCKET).getPublicUrl(nome);
        dentro.push((p.data && p.data.publicUrl) || nome);
      } catch (e) { console.warn("vetrina, foto:", e); }
    }
    return dentro;
  }

  /* ── scrivere la cosa ──────────────────────────────────────────── */
  async function pubblica(d, io, ormaId, foto) {
    var c = d.campi, prezzo = parseFloat(String(c.prezzo || "").replace(",", ".")) || null;

    if (d.tipo === "prodotto") {
      var p = await db.from("prodotti").insert({
        persona_id: io, orma_id: ormaId, nome: c.titolo || "", racconto: c.racconto || "",
        prezzo: prezzo, foto: foto[0] || null, foto_secondaria: foto[1] || null,
        scaffale: c.scaffale || null, stato: "pubblico",
        si_compra: true, si_scambia: c.stato === "scambio", si_dona: c.stato === "dono"
      }).select("id").single();
      if (p.error) throw p.error;
      return { tavola: "prodotti", id: p.data.id };
    }

    if (d.tipo === "assistenza") {
      var s = await db.from("servizi").insert({
        persona_id: io, orma_id: ormaId, titolo: c.titolo || "",
        descrizione: c.racconto || "", tipo: c.categoria || null,
        durata_minuti: parseInt(c.quanti, 10) || null, prezzo_euro: prezzo,
        dono: c.stato === "dono", a_distanza: c.dove === "a distanza", attivo: true
      }).select("id").single();
      if (s.error) throw s.error;
      return { tavola: "servizi", id: s.data.id };
    }

    if (d.tipo === "lezione") {
      /* ⚠️ classi non ha orma_id: la lezione non sa da quale orma nasce */
      var l = await db.from("classi").insert({
        persona_id: io, titolo: c.titolo || "", occhiello: c.chi || "",
        racconto: c.racconto || "", prezzo: prezzo, stato: "pubblica"
      }).select("id").single();
      if (l.error) throw l.error;
      return { tavola: "classi", id: l.data.id };
    }

    if (d.tipo === "vicinato") {
      /* ⭐ nel vicinato non si vende: nasce un'orma pubblica, figlia di questa */
      var o = await db.from("orme").insert({
        persona_id: io, orma_madre_id: ormaId, titolo: c.titolo || "",
        contenuto: c.racconto || "", tipo: c.forma || "richiesta_aiuto",
        elemento: "terra", luogo: c.dove || null, immagine_url: foto[0] || null,
        visibilita: "pubblico"
      }).select("id").single();
      if (o.error) throw o.error;
      return { tavola: "orme", id: o.data.id };
    }
    return null;
  }

  /* ── la porta: si mette in ascolto, e resta ────────────────────── */
  function vetrina(R, ormaId, dopo) {
    var doc = R.ownerDocument || R;
    if (doc._fmVetrina) return;            /* una volta sola per pagina */
    doc._fmVetrina = true;

    doc.addEventListener("click", async function (e) {
      var b = e.target && e.target.closest && e.target.closest('[data-g="vet-pubblica"]');
      if (!b) return;
      e.preventDefault(); e.stopPropagation();

      var body = doc.body || R;
      var d = raccogli(body);
      if (!d.tipo || d.tipo === "stampa") return;     /* la stampa la apre Design */

      /* ⛔ con una foto, senza dichiarazione non si pubblica */
      if (d.foto.length && !d.dichiaro) {
        var lb = body.querySelector('[data-stato="serve-dichiarazione"]');
        if (lb && lb.scrollIntoView) lb.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
      if (!d.campi.titolo) return;

      var era = b.textContent;
      b.disabled = true; b.textContent = "un momento\u2026";
      try {
        var u = await db.auth.getUser();
        var io = u && u.data && u.data.user && u.data.user.id;
        if (!io) throw new Error("nessuna sessione");

        var foto = await salvaFoto(d.foto, io, d.tipo);
        var nata = await pubblica(d, io, ormaId, foto);
        if (!nata) throw new Error("tipo sconosciuto");

        /* ⭐ la dichiarazione dei diritti si scrive sulla cosa nata */
        if (foto.length && d.dichiaro) {
          try { await db.rpc("fm_dichiaro_diritti", { p_cosa: nata.id, p_versione: VERSIONE_DIRITTI }); }
          catch (err) { console.warn("diritti:", err); }
        }
        b.textContent = "fatto";
        if (typeof dopo === "function") await dopo(nata);
      } catch (err) {
        console.warn("vetrina:", err);
        b.textContent = era; b.disabled = false;
      }
    }, true);
  }

  window.SpazioVivo = window.SpazioVivo || {};
  window.SpazioVivo.vetrina = vetrina;
  window.FMVetrina = { raccogli: raccogli, vetrina: vetrina };
})();
