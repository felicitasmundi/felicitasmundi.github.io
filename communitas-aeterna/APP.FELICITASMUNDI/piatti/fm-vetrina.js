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

    /* ⭐ 1 ottobre — lo scaffale (la categoria scelta), il ritratto e i legami */
    var cs = R.querySelector('[data-stampo="vet-categoria"].su [data-c="categoria.nome"]');
    if (cs) d.campi.scaffale = cs.textContent.trim();
    var W = (R.ownerDocument || R).defaultView || window;
    d.ritratto = (W.dati && W.dati.ritratto) || null;
    d.legami = (W.leg && W.leg.lista) ? W.leg.lista.slice() : [];

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

  /* ⭐ l'indirizzo della pagina: dal titolo, senza accenti; se c'è già, un numero in coda */
  async function nomeUrl(t) {
    var b = String(t).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
      .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 50) || "prodotto";
    for (var i = 0; i < 20; i++) {
      var n = i ? b + "-" + (i + 1) : b;
      var r = await db.from("prodotti").select("id").eq("nome_url", n).limit(1);
      if (!r.error && (!r.data || !r.data.length)) return n;
    }
    return b + "-" + Date.now();
  }

  /* ⭐ «condividi, è necessario la vetrina lo crei» — appena pubblicato: il link e i tasti */
  function condividi(body, nata) {
    if (!nata || !nata.nome_url) return;
    var base = (window.BASE_INDIRIZZO || (location.origin + location.pathname));
    var ind = base + "?p=pagina&n=" + encodeURIComponent(nata.nome_url);
    var doc = body.ownerDocument || document;
    var w = doc.createElement("div");
    w.setAttribute("style", "margin:1rem 0;padding:1rem 1.1rem;border:1px solid rgba(212,175,106,.55);border-radius:1rem;background:rgba(212,175,106,.08)");
    var e = function (x) { return String(x).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
    w.innerHTML = '<div style="font-family:Cinzel,serif;font-size:.75rem;letter-spacing:.2em;text-transform:uppercase;color:#D4AF6A;margin-bottom:.5rem">\u00e8 uscito nell\u2019Emporio</div>' +
      '<a href="' + e(ind) + '" target="_top" style="color:#F5F0E6;word-break:break-all">' + e(ind) + '</a>' +
      '<div style="display:flex;gap:.5rem;flex-wrap:wrap;margin-top:.7rem">' +
      '<a target="_blank" rel="noopener" href="https://wa.me/?text=' + encodeURIComponent((nata.nome || "") + " \u2014 " + ind) + '" style="color:#D4AF6A;border:1px solid rgba(212,175,106,.5);border-radius:999px;padding:.3rem .8rem;text-decoration:none">WhatsApp</a>' +
      '<a href="mailto:?subject=' + encodeURIComponent(nata.nome || "") + '&body=' + encodeURIComponent(ind) + '" style="color:#D4AF6A;border:1px solid rgba(212,175,106,.5);border-radius:999px;padding:.3rem .8rem;text-decoration:none">email</a>' +
      '<button type="button" data-copia style="all:unset;cursor:pointer;color:#D4AF6A;border:1px solid rgba(212,175,106,.5);border-radius:999px;padding:.3rem .8rem">copia il collegamento</button></div>';
    var dove = body.querySelector(".vetr-f") || body;
    dove.insertBefore(w, dove.firstChild);
    var cp = w.querySelector("[data-copia]");
    cp.onclick = function () { try { navigator.clipboard.writeText(ind); cp.textContent = "copiato"; } catch (x) {} };
  }

  /* ── scrivere la cosa ──────────────────────────────────────────── */
  async function pubblica(d, io, ormaId, foto) {
    var c = d.campi, prezzo = parseFloat(String(c.prezzo || "").replace(",", ".")) || null;

    if (d.tipo === "prodotto") {
      /* ⭐ 1 ottobre, Gab: la pagina di Anima Vagabonda è la matrice — testa (titolo,
         sottotitolo, autore o produttore), il libro (foto, racconto), ordina (prezzo,
         editore, formato, ISBN), chi scrive (biografia, ritratto, video), collegamenti,
         condividi (l'indirizzo ?p=pagina&n=<nome_url>). */
      var url = await nomeUrl(c.titolo || "prodotto");
      var rit = d.ritratto ? (await salvaFoto([d.ritratto], io, "prodotto"))[0] || null : null;
      var riga = {
        persona_id: io, orma_id: ormaId, nome: c.titolo || "", nome_url: url,
        sottotitolo: c.sottotitolo || null, autore: c.autore || null,
        racconto: c.racconto || "", prezzo: prezzo,
        foto: foto[0] || null, foto_secondaria: foto[1] || null,
        scaffale: c.scaffale || null, stato: "pubblico",
        editore: c.editore || null, formato: c.formato || null, isbn: c.isbn || null,
        biografia: c.biografia || null, foto_autore: rit, video_url: c.video || null,
        /* ⭐ in vendita → passa per FelicitasMundi (Ordina); in dono / in scambio → si scrive a chi lo fa */
        si_compra: (c.modo || "in vendita") === "in vendita",
        si_scambia: c.modo === "in scambio", si_dona: c.modo === "in dono"
      };
      var p = await db.from("prodotti").insert(riga).select("id,nome_url").single();
      if (p.error) throw p.error;
      /* i collegamenti: una porta per ogni legame */
      var ELEM = { vicinati: "terra", emporio: "acqua", assistenza: "fuoco", edizione: "aria", scuola: "etere" };
      var porte = (d.legami || []).map(function (L, i) {
        return { da_tipo: "prodotto", da_id: p.data.id, a_tipo: L.a_tipo || L.tipo, a_id: L.id,
                 url: L.url || null, elemento: ELEM[L.st] || null, titolo: L.titolo || "",
                 testo: L.testo || null, ordine: i + 1 };
      });
      if (porte.length) {
        var cl = await db.from("collegamenti").insert(porte);
        if (cl.error) console.warn("collegamenti:", cl.error);
      }
      return { tavola: "prodotti", id: p.data.id, nome_url: p.data.nome_url, nome: riga.nome };
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
        condividi(doc.body || R, nata);
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
