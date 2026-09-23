/* ═══════════════════════════════════════════════════════════════
   FM-PIATTO — i tre gesti che servono a tutte le pagine piatte.

   ⭐ Design disegna l'HTML. Questo file non ridisegna niente:
      trova i buchi e ci mette i dati.

   I QUATTRO SEGNI, dal vocabolario:
     data-c="cosa.campo"     un buco da riempire
     data-stampo="nome"      la riga da copiare — una sola nel file
     data-stato="nome"       un pezzo che a volte c'è: si accende e si spegne
     data-g="nome"           un tasto

   COSA FA COI BUCHI, a seconda di cosa sono:
     <img>              → cambia l'immagine; se manca, la toglie
                          (e il disegno mostra l'iniziale)
     <a>                → cambia dove porta
     <input>, <textarea>→ cambia il valore scritto dentro
     campo «elemento»   → cambia il COLORE, non scrive la parola:
                          --c:var(--terra) o color:var(--terra),
                          quello che Design ha usato
     campo «grado»      → mette data-grado sull'elemento: la
                          lucentezza la disegna il CSS
                          ⛔ il numero del livello non si scrive MAI
     campo «svg»        → mette il disegno del segno
     campo «iniziale»   → se non arriva, la ricava dal nome
     tutto il resto     → il testo
   ⛔ Si riempie SOLO quello che il codice manda. Per svuotare un
      segnaposto — «[ il titolo ]» non deve arrivare a chi guarda —
      il codice manda "" apposta. Quello che non manda, resta com'è
      nel disegno: «dove sei?» resta «dove sei?».

   ⭐ GLI STAMPI SI ANNIDANO: ogni gesto tocca solo i segni del suo
      livello. Un talento non riempie i buchi delle sue orme: quelli
      li riempie lo stampo «orma», dentro.

   ⭐ UN FILE SOLO, unito il 23 settembre: la finestra è del GUSCIO,
      i quattro gesti di riempimento sono della penna.

   Espone:  FMPiatto.monta(box, indirizzo)   apre la pagina in una finestra → il documento
            FMPiatto.smonta(box)             toglie la finestra
            FMPiatto.riempi(dove, cose)
            FMPiatto.stampa(dove, nome, elenco, perOgni)
            FMPiatto.stato(dove, nome, acceso)
            FMPiatto.gesto(dove, nome, fai)
   ═══════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  /* ── di chi è un segno: del livello di «dove», o di uno stampo dentro ── */
  function suoi(dove, sel) {
    var tutti = Array.prototype.slice.call(dove.querySelectorAll(sel));
    if (dove.matches && dove.matches(sel)) tutti.unshift(dove);
    return tutti.filter(function (el) {
      if (el === dove) return true;
      if (el.hasAttribute("data-stampo")) return false;      /* è uno stampo dentro */
      for (var p = el.parentElement; p && p !== dove; p = p.parentElement)
        if (p.hasAttribute("data-stampo")) return false;     /* sta dentro uno stampo */
      return true;
    });
  }

  function iniziale(nome) {
    var s = String(nome || "").trim();
    return s ? s.charAt(0).toUpperCase() : "";
  }

  /* ── il colore dell'elemento: come l'ha scritto Design ── */
  function colora(el, v) {
    if (!v) return;
    var colore = "var(--" + v + ")";
    var st = el.getAttribute("style") || "";
    if (/--c\s*:/.test(st)) el.style.setProperty("--c", colore);
    else if (/(^|;)\s*color\s*:/.test(st)) el.style.color = colore;
    else el.style.setProperty("--c", colore);
    el.setAttribute("data-el", v);
  }

  /* ── un buco ── */
  function metti(el, campo, v, cosa) {
    if (campo === "elemento") {
      colora(el, v);
      /* dove il disegno aspetta la parola — «[ l'elemento ]» — la si scrive */
      if (v && !el.children.length && /^\s*\[.*\]\s*$/.test(el.textContent)) el.textContent = v;
      return;
    }
    if (campo === "grado") { if (v) el.setAttribute("data-grado", v); return; }
    if (campo === "svg") {
      if (typeof v === "string" && /^\s*<svg[\s>]/i.test(v)) el.innerHTML = v;
      return;
    }
    if (campo === "iniziale" && !v) v = iniziale(cosa && cosa.nome);

    var tag = el.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA") {       /* una casella: il valore */
      el.value = (v === null || v === undefined) ? "" : String(v);
      return;
    }
    if (tag === "IMG") {
      if (v) el.setAttribute("src", v); else el.removeAttribute("src");
      return;
    }
    if (tag === "A" && /^(https?:|#|\?|\/)/.test(String(v || ""))) {
      el.setAttribute("href", v);
      return;
    }
    /* ⛔ un buco che contiene altri pezzi non si svuota MAI: su un
       collegamento-contenitore si cambia solo dove porta */
    if (el.children.length) return;
    el.textContent = (v === null || v === undefined) ? "" : String(v);
  }

  /* ── riempire i buchi di un livello ──
     cose = { persona:{…}, orma:{…}, conto:{…} } */
  function riempi(dove, cose) {
    cose = cose || {};
    suoi(dove, "[data-c]").forEach(function (el) {
      var nome = el.getAttribute("data-c"), k = nome.indexOf(".");
      if (k < 0) return;
      var cosa = nome.slice(0, k), campo = nome.slice(k + 1);
      if (!(cosa in cose)) return;                 /* non è di questo giro */
      var o = cose[cosa] || {};
      /* ⭐ si tocca solo quello che arriva: il testo di Design resta
         se il codice non manda niente. L'iniziale si ricava sempre. */
      if (!(campo in o) && campo !== "iniziale") return;
      metti(el, campo, o[campo], o);
    });
  }

  /* ── copiare una riga per ogni voce ── */
  function stampa(dove, nome, elenco, perOgni) {
    var tpl = suoi(dove, '[data-stampo="' + nome + '"]').filter(function (el) {
      return el !== dove;
    })[0];
    if (!tpl) {
      /* lo stampo è un livello sotto: si cerca il primo che non è una copia */
      tpl = dove.querySelector('[data-stampo="' + nome + '"]:not([data-fm-copia])');
    }
    if (!tpl) { console.warn("fm-piatto: manca lo stampo", nome); return []; }

    tpl.setAttribute("data-fm-stampo", "");
    tpl.hidden = true;

    /* via le copie di prima */
    var gen = tpl.parentNode;
    Array.prototype.slice.call(gen.children).forEach(function (c) {
      if (c.getAttribute("data-fm-copia") === nome) gen.removeChild(c);
    });

    var copie = [], dopo = tpl;
    (elenco || []).forEach(function (voce, i) {
      var c = tpl.cloneNode(true);
      c.hidden = false;
      c.removeAttribute("data-fm-stampo");
      c.setAttribute("data-fm-copia", nome);
      gen.insertBefore(c, dopo.nextSibling);
      dopo = c;
      if (perOgni) perOgni(c, voce, i);
      copie.push(c);
    });
    return copie;
  }

  /* ── accendere o spegnere un pezzo ── */
  function stato(dove, nome, acceso) {
    suoi(dove, '[data-stato="' + nome + '"]').forEach(function (el) {
      el.hidden = !acceso;
    });
  }

  /* ── un tasto ── */
  function gesto(dove, nome, fai) {
    suoi(dove, '[data-g="' + nome + '"]').forEach(function (el) {
      el.onclick = function (e) {
        if (e && e.preventDefault) e.preventDefault();
        /* ⭐ un tasto dentro un altro tasto non passa il tocco a chi sta
           sopra: la luna dei desideri non deve aprire anche la scheda */
        if (e && e.stopPropagation) e.stopPropagation();
        fai(e, el);
      };
    });
  }

  /* ── la finestra dei piatti dentro il guscio ──
     ⭐ Questa parte è del GUSCIO (23 settembre): un iframe pigro sul
        modello di apriMappa(). La pagina di Design si apre intera, coi
        suoi script — il cosmo e i solidi partono da soli.
     ⭐ Barra · Megafono · radio · muro restano FUORI dalla finestra.
        Stesso indirizzo: il codice delle pagine, che resta nel guscio,
        riempie la pagina dentro col documento che monta() restituisce. */

  /* la veste, una volta sola: #centro centra i figli a 56rem, un piatto no */
  function fmpVeste() {
    if (document.getElementById("fm-piatto-veste")) return;
    var s = document.createElement("style");
    s.id = "fm-piatto-veste";
    s.textContent = "iframe.fm-piatto{display:block;width:100%;border:0;background:transparent;" +
                    "max-width:none!important;margin:0!important}";
    document.head.appendChild(s);
  }
  /* #centro scrolla: si misura il box, e il piatto scrolla dentro */
  function fmpAltezza(box, f) {
    var h = box.clientHeight;
    if (h > 0) f.style.height = h + "px";
  }
  /* un <a href> dentro la finestra la porterebbe via: si frena la fuga.
     I tasti veri li collega il codice delle pagine. */
  function fmpFrenaLink(doc) {
    if (!doc || !doc.addEventListener) return;
    doc.addEventListener("click", function (e) {
      var a = e.target && e.target.closest && e.target.closest("a[href]");
      if (!a) return;
      if ((a.getAttribute("href") || "").charAt(0) === "#") return;
      e.preventDefault();
    }, true);
  }
  function smonta(box) {
    if (!box || !box.querySelectorAll) return;
    var vecchi = box.querySelectorAll("iframe.fm-piatto");
    for (var i = 0; i < vecchi.length; i++) {
      if (typeof vecchi[i]._fmpChiudi === "function") vecchi[i]._fmpChiudi();
      if (vecchi[i].parentNode) vecchi[i].parentNode.removeChild(vecchi[i]);
    }
  }
  /* torna il documento della pagina, pronto da riempire */
  function monta(box, indirizzo) {
    return new Promise(function (risolvi, rifiuta) {
      if (!box) { rifiuta(new Error("FMPiatto.monta: box mancante")); return; }
      if (!indirizzo) { rifiuta(new Error("FMPiatto.monta: indirizzo mancante")); return; }
      fmpVeste();
      smonta(box);
      var f = document.createElement("iframe");
      f.className = "fm-piatto";
      f.setAttribute("title", "");
      fmpAltezza(box, f);
      var chiuso = false, ro = null;
      f._fmpChiudi = function () { chiuso = true; if (ro) { ro.disconnect(); ro = null; } };
      f.addEventListener("load", function () {
        if (chiuso) return;
        try {
          if (f.contentWindow && f.contentWindow.location &&
              f.contentWindow.location.href === "about:blank") return;
        } catch (e) {}
        var doc = null;
        try { doc = f.contentDocument || (f.contentWindow && f.contentWindow.document); }
        catch (e) { rifiuta(e); return; }
        if (!doc) { rifiuta(new Error("FMPiatto: la pagina non è leggibile")); return; }
        fmpFrenaLink(doc);
        risolvi(doc);
      });
      f.addEventListener("error", function () {
        if (!chiuso) rifiuta(new Error("FMPiatto: la pagina non si carica — " + indirizzo));
      });
      box.appendChild(f);
      f.src = indirizzo;
      if (window.ResizeObserver) {
        ro = new ResizeObserver(function () { if (!chiuso) fmpAltezza(box, f); });
        ro.observe(box);
      }
    });
  }

  window.FMPiatto = { monta: monta, smonta: smonta, riempi: riempi, stampa: stampa,
                      stato: stato, gesto: gesto, iniziale: iniziale };
})();
