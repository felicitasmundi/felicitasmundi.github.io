/* ═══ FM-STAMPA · il configuratore vero, dentro la pagina della famiglia · 13 ottobre 2026 ═══
   Gab, 18:32: «dopo che scegli carta stampata, non mi devi spiegare come funziona, ma me lo devi far funzionare,
   quindi mettimi subito i dati per scegliere formato carta copie e prezzo».
   1 il prodotto (dal catalogo Flyeralarm, stampa/catalogo.json, filtrato per famiglia)
   2 le scelte (formato, materiale, rifinitura, stampa…): le varianti vere di Flyeralarm, una scelta alla volta
   3 le copie, col prezzo vero (prezzo pubblico Flyeralarm, consegna Standard; + IVA)
   4 il file PDF (nel bucket «stampa», nella propria cartella) e il pagamento (FMCassa, azione «stampa»)
   Uso: <div id="fm-stampa" data-famiglia="carta"></div> + fm-cassa.js prima di questo file.
   ⛔ Nessun ordine parte da qui verso Flyeralarm: l'ordine vero lo fa chi coordina, col file e il pagamento già arrivati. */
(function () {
  "use strict";
  var URL_FA = "https://gfnveesogkfvkrdudpfg.supabase.co/functions/v1/flyeralarm?p=";
  var FAMIGLIE = {
    carta:      { cat: ["prodotti di stampa", "pieghevoli, depliant e opuscoli", "adesivi", "cartelline e folder", "buste da lettera", "menù e portamenù"], no: /fotolibr|calendar|agend|quadern|rivist|catalog|libr|cd e dvd/i },
    libri:      { cat: ["riviste", "libri", "cataloghi", "pieghevoli, depliant e opuscoli"], nome: /libr|rivist|catalog|opuscol|brochure|fascicol/i, no: /fotolibr/i },
    agende:     { cat: ["quaderni e blocchi per appunti", "calendari"], nome: /calendar|agend|quadern|taccuin|blocc/i, no: /fotograf/i },
    fiere:      { cat: ["elementi per stand fieristici", "roll-up e display", "bandiere & stendardi", "banconi / desk promozionali", "fondali e pop up per fiere", "display pubblicitari", "insegne e pannelli pubblicitari ", "insegne e pannelli pubblicitari", "pellicole e pellicole adesive"] },
    confezioni: { cat: ["scatole e confezioni", "imballaggi per prodotti", "sacchetti e buste in carta", "bicchieri in carta e coppette", "borse, buste e shopper"] },
    gadget:     { cat: ["gadget pubblicitari", "tazze", "penne e matite", "portachiavi", "borse, buste e shopper", "tazze, bicchieri e cucina"], no: /campion|dolci|snack|cioccolat|cookie|toblerone|frutta/i },
    abiti:      { cat: ["abbigliamento & tessuti", "abbigliamento promozionale", "t-shirts", "giacche", "prodotti tessili"] },
    foto:       { nome: /fotolibr|foto retro|foto da parete|calendari fotografici|stampe fotografiche|cornici per foto/i }
  };
  var ORDINE_ATTR = /formato|modello|materiale|carta|rifinitura|stampa|colore|taglia|pagine|facciate|copertina|rilegatura|dimension/i;
  var box, fam, catalogo = null, gruppo = null, varianti = null, scelte = {}, variante = null, quantita = null, file = null;

  function esc(t) { return String(t == null ? "" : t).replace(/[&<>"]/g, function (k) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[k]; }); }
  function eur(n) { return Number(n).toLocaleString("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €"; }
  function h(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function css() {
    var s = document.createElement("style");
    s.textContent =
      "#fm-stampa .fms-cerca{width:100%;min-height:44px;padding:0 14px;border-radius:980px;border:1px solid rgba(212,175,106,.5);background:rgba(8,11,26,.6);color:#F5F0E6;font:15px 'DM Sans',system-ui,sans-serif;box-sizing:border-box;margin-bottom:10px}" +
      "#fm-stampa .fms-lista{display:flex;flex-direction:column;gap:6px}" +
      "#fm-stampa .fms-prod{display:flex;justify-content:space-between;align-items:center;gap:10px;background:var(--carta,#1a2148);border:1px solid var(--riga,rgba(245,240,230,.14));border-radius:14px;padding:11px 12px;font-size:14px;text-align:left;color:inherit;cursor:pointer;width:100%}" +
      "#fm-stampa .fms-prod.on{border-color:var(--oro,#D4AF6A)}#fm-stampa .fms-prod .fr{color:var(--oro,#D4AF6A)}" +
      "#fm-stampa .fms-altri{margin-top:8px;font-size:13px;color:var(--oro,#D4AF6A);background:none;border:0;cursor:pointer}" +
      "#fm-stampa .fms-passo{margin-top:18px}#fm-stampa .fms-passo .fm-occ{color:var(--aria,#9ac296);margin-bottom:8px;display:block}" +
      "#fm-stampa .fms-attr{margin-bottom:10px}#fm-stampa .fms-attr .nome{font-size:12px;color:var(--grigio,#9A978F);margin-bottom:6px;letter-spacing:.04em}" +
      "#fm-stampa .fms-chips{display:flex;flex-wrap:wrap;gap:6px}" +
      "#fm-stampa .fms-chip{font:13px 'DM Sans',system-ui,sans-serif;border:1px solid var(--riga,rgba(245,240,230,.14));border-radius:980px;padding:6px 11px;color:rgba(245,240,230,.9);background:none;cursor:pointer}" +
      "#fm-stampa .fms-chip.on{background:var(--oro,#D4AF6A);border-color:var(--oro,#D4AF6A);color:#0A0C1A}" +
      "#fm-stampa .fms-chip.q{display:flex;flex-direction:column;align-items:flex-start;border-radius:14px;padding:8px 12px;min-width:92px}#fm-stampa .fms-chip.q b{font-size:15px}#fm-stampa .fms-chip.q small{font-size:12px;opacity:.85}" +
      "#fm-stampa .fms-tot{margin-top:12px;background:var(--carta,#1a2148);border:1px solid var(--oro,#D4AF6A);border-radius:16px;padding:12px 14px}" +
      "#fm-stampa .fms-tot .g{font-family:'Cormorant Garamond',serif;font-size:32px;color:var(--oro,#D4AF6A);line-height:1}#fm-stampa .fms-tot .g small{font-family:'DM Sans',sans-serif;font-size:12px;color:var(--grigio,#9A978F);margin-left:6px}" +
      "#fm-stampa .fms-tot .r{font-size:12.5px;color:var(--grigio,#9A978F);margin-top:6px;line-height:1.5}" +
      "#fm-stampa .fms-file{margin-top:10px;font-size:13px;line-height:1.5}#fm-stampa .fms-file input{display:block;margin-top:6px;font-size:13px;color:var(--grigio,#9A978F)}" +
      "#fm-stampa .fms-paga{margin-top:12px;display:flex;width:100%;justify-content:center;font:600 15px 'DM Sans',system-ui,sans-serif;padding:13px 18px;border-radius:980px;background:var(--oro,#D4AF6A);color:#0A0C1A;border:0;cursor:pointer}#fm-stampa .fms-paga:disabled{opacity:.5}" +
      "#fm-stampa .fms-nota{font-size:12.5px;color:var(--grigio,#9A978F);line-height:1.5;margin-top:8px}" +
      "#fm-stampa .fms-attesa{font-size:13px;color:var(--grigio,#9A978F);padding:10px 0}";
    document.head.appendChild(s);
  }
  function famiglia(g) {
    var F = FAMIGLIE[fam]; if (!F) return false;
    var cats = (g.c || []).map(function (x) { return String(x).trim().toLowerCase(); });
    var nome = g.n || "";
    if (F.no && F.no.test(nome)) return false;
    var c = F.cat ? cats.some(function (x) { return F.cat.indexOf(x) >= 0; }) : false;
    return c || (F.nome ? F.nome.test(nome) : false);
  }
  /* 1 · il prodotto */
  function prodotti() {
    box.innerHTML = "";
    var lista = catalogo.filter(famiglia).filter(function (g) { return !/campion/i.test(g.n); });
    lista.sort(function (a, b) { return a.n.localeCompare(b.n, "it"); });
    var cerca = h("input", "fms-cerca"); cerca.type = "search"; cerca.placeholder = "cerca fra " + lista.length + " prodotti";
    var ul = h("div", "fms-lista"), altri = h("button", "fms-altri", "mostra altri ›");
    var mostrati = 0, filtro = "";
    function render(reset) {
      if (reset) { ul.innerHTML = ""; mostrati = 0; }
      var vis = lista.filter(function (g) { return !filtro || g.n.toLowerCase().indexOf(filtro) >= 0; });
      var fetta = vis.slice(mostrati, mostrati + 24);
      fetta.forEach(function (g) {
        var b = h("button", "fms-prod", "<span>" + esc(g.n) + "</span><span class=\"fr\">›</span>"); b.type = "button";
        b.onclick = function () { Array.prototype.forEach.call(ul.children, function (x) { x.classList.remove("on"); }); b.classList.add("on"); scegli(g); };
        ul.appendChild(b);
      });
      mostrati += fetta.length; altri.hidden = mostrati >= vis.length;
      if (!vis.length) ul.innerHTML = '<div class="fms-attesa">niente con questo nome</div>';
    }
    cerca.oninput = function () { filtro = cerca.value.trim().toLowerCase(); render(true); };
    altri.onclick = function () { render(false); };
    var passo = h("div", "fms-passo", '<span class="fm-occ">IL PRODOTTO</span>');
    passo.appendChild(cerca); passo.appendChild(ul); passo.appendChild(altri);
    box.appendChild(passo); render(true);
    box.appendChild(h("div", "fms-passo", '<div id="fms-scelte"></div><div id="fms-copie"></div><div id="fms-fine"></div>'));
  }
  /* 2 · le scelte */
  function scegli(g) {
    gruppo = g; varianti = null; scelte = {}; variante = null; quantita = null;
    var s = document.getElementById("fms-scelte"); s.innerHTML = '<span class="fm-occ">' + esc(g.n.toUpperCase()) + '</span><div class="fms-attesa">leggo formati, carte e copie…</div>';
    document.getElementById("fms-copie").innerHTML = ""; document.getElementById("fms-fine").innerHTML = "";
    s.scrollIntoView({ block: "start", behavior: "smooth" });
    fetch(URL_FA + "/v2/catalog/groups/" + g.id + "/variants").then(function (r) { return r.json(); }).then(function (j) {
      varianti = (j && j.data) || [];
      if (!varianti.length) { s.innerHTML = '<span class="fm-occ">' + esc(g.n.toUpperCase()) + '</span><div class="fms-attesa">per questo prodotto Flyeralarm non dà scelte da qui: scrivi a chi coordina</div>'; return; }
      disegnaScelte();
    }).catch(function () { s.innerHTML = '<div class="fms-attesa">Flyeralarm non risponde: riprova fra un momento</div>'; });
  }
  function attributi() {
    var ordine = [], visti = {};
    varianti.forEach(function (v) { (v.attributes || []).forEach(function (a) { if (!visti[a.attribute_name_id]) { visti[a.attribute_name_id] = a.attribute_name; ordine.push({ id: a.attribute_name_id, nome: a.attribute_name }); } }); });
    return ordine;
  }
  function compatibili(fino) {
    return varianti.filter(function (v) {
      return Object.keys(scelte).every(function (k) {
        if (fino && fino.indexOf(Number(k)) < 0) return true;
        return (v.attributes || []).some(function (a) { return String(a.attribute_name_id) === String(k) && String(a.attribute_value_id) === String(scelte[k]); });
      });
    });
  }
  function disegnaScelte() {
    var s = document.getElementById("fms-scelte");
    s.innerHTML = '<span class="fm-occ">' + esc(gruppo.n.toUpperCase()) + ' · SCEGLI</span>';
    var attrs = attributi(), prima = [];
    attrs.forEach(function (at) {
      var comp = compatibili(prima);
      var valori = {}, ord = [];
      comp.forEach(function (v) { (v.attributes || []).forEach(function (a) { if (a.attribute_name_id === at.id && !valori[a.attribute_value_id]) { valori[a.attribute_value_id] = a.attribute_value; ord.push(a.attribute_value_id); } }); });
      if (ord.length === 1 && scelte[at.id] == null) scelte[at.id] = ord[0];
      if (scelte[at.id] != null && !valori[scelte[at.id]]) delete scelte[at.id];
      var blocco = h("div", "fms-attr", '<div class="nome">' + esc(at.nome) + '</div>');
      var chips = h("div", "fms-chips");
      ord.forEach(function (id) {
        var c = h("button", "fms-chip" + (String(scelte[at.id]) === String(id) ? " on" : ""), esc(valori[id])); c.type = "button";
        c.onclick = function () { scelte[at.id] = id; attrs.forEach(function (a2, i2) { if (i2 > attrs.indexOf(at)) delete scelte[a2.id]; }); variante = null; quantita = null; disegnaScelte(); };
        chips.appendChild(c);
      });
      blocco.appendChild(chips); s.appendChild(blocco);
      prima.push(at.id);
    });
    var rest = compatibili(null);
    var tutte = attrs.every(function (a) { return scelte[a.id] != null; });
    document.getElementById("fms-copie").innerHTML = ""; document.getElementById("fms-fine").innerHTML = "";
    if (tutte && rest.length) { variante = rest[0]; copie(); }
    else if (rest.length) document.getElementById("fms-copie").innerHTML = '<div class="fms-attesa">' + rest.length + ' combinazioni possibili: scegli le voci che restano</div>';
  }
  /* 3 · le copie col prezzo */
  function copie() {
    var c = document.getElementById("fms-copie"); c.innerHTML = '<div class="fms-attesa">leggo le copie e i prezzi…</div>';
    fetch(URL_FA + "/v2/catalog/variants/" + variante.id).then(function (r) { return r.json(); }).then(function (v) {
      var qs = (v && v.quantities) || [];
      if (!qs.length) { c.innerHTML = '<div class="fms-attesa">nessuna quantità disponibile per questa scelta</div>'; return; }
      c.innerHTML = '<span class="fm-occ">LE COPIE · COL PREZZO</span>';
      var chips = h("div", "fms-chips");
      qs.forEach(function (q) {
        var sp = (q.shippings || []).filter(function (x) { return x.type === "Standard"; })[0] || (q.shippings || [])[0];
        if (!sp) return;
        var b = h("button", "fms-chip q", "<b>" + q.quantity + "</b><small>" + eur(sp.msrp_price) + "</small>"); b.type = "button";
        b.onclick = function () { Array.prototype.forEach.call(chips.children, function (x) { x.classList.remove("on"); }); b.classList.add("on"); quantita = { q: q, sp: sp, vat: q.vat || 22 }; fine(); };
        chips.appendChild(b);
      });
      c.appendChild(chips);
      c.appendChild(h("div", "fms-nota", "prezzi con consegna " + ((qs[0].shippings || [])[0] ? (qs[0].shippings[0].type + ", " + qs[0].shippings[0].from + "–" + qs[0].shippings[0].to + " giorni lavorativi") : "Standard") + " · IVA " + (qs[0].vat || 22) + " % a parte"));
    }).catch(function () { c.innerHTML = '<div class="fms-attesa">Flyeralarm non risponde: riprova fra un momento</div>'; });
  }
  /* 4 · il file e il pagamento */
  function descrizione() {
    var parti = [gruppo.n];
    (variante.attributes || []).forEach(function (a) { if (/formato|materiale|carta|colore|taglia|rilegatura|copertina/i.test(a.attribute_name)) parti.push(a.attribute_value); });
    return parti.join(" · ");
  }
  function fine() {
    var f = document.getElementById("fms-fine"); f.innerHTML = "";
    var netto = Number(quantita.sp.msrp_price), iva = Number(quantita.vat), tot = Math.round(netto * (1 + iva / 100) * 100) / 100;
    var t = h("div", "fms-tot", '<div class="g">' + eur(tot) + '<small>IVA inclusa</small></div><div class="r">' + esc(descrizione()) + ' · ' + quantita.q.quantity + ' copie<br>' + eur(netto) + ' + IVA ' + iva + ' % · consegna ' + esc(quantita.sp.type) + ' in ' + quantita.sp.from + '–' + quantita.sp.to + ' giorni lavorativi</div>');
    var fileBox = h("div", "fms-file", "<b>Il file di stampa</b> (PDF, fino a 100 MB). Lo puoi caricare ora o dopo il pagamento: senza il file l'ordine non parte." + (variante.data_sheet ? ' <a href="' + esc(variante.data_sheet) + '" target="_blank" rel="noopener" style="color:var(--oro,#D4AF6A)">le misure del file ›</a>' : ""));
    var inp = document.createElement("input"); inp.type = "file"; inp.accept = "application/pdf,.pdf,application/zip,.zip"; fileBox.appendChild(inp);
    var stato = h("div", "fms-nota", ""); fileBox.appendChild(stato);
    t.appendChild(fileBox);
    var paga = h("button", "fms-paga", "Ordina e paga " + eur(tot)); paga.type = "button";
    t.appendChild(paga);
    t.appendChild(h("div", "fms-nota", "Pagato, l'ordine lo manda in stampa chi coordina, col tuo file; ti arriva a casa col corriere. Se qualcosa non va, ti scrive."));
    f.appendChild(t); f.scrollIntoView({ block: "start", behavior: "smooth" });
    file = null;
    inp.onchange = function () {
      var fl = inp.files && inp.files[0]; if (!fl) return;
      stato.textContent = "carico " + fl.name + "…";
      FMCassa.sessione().then(function (sess) {
        if (!sess) { location.href = "accesso.html"; return; }
        var nome = sess.user.id + "/" + Date.now() + "-" + fl.name.replace(/[^\w.\-]+/g, "_");
        return FMCassa.client().storage.from("stampa").upload(nome, fl, { contentType: fl.type || "application/pdf", upsert: false }).then(function (r) {
          if (r.error) { stato.textContent = "non sono riuscito a caricare il file: " + r.error.message; return; }
          file = "stampa/" + nome; stato.textContent = "file caricato: " + fl.name;
        });
      });
    };
    paga.onclick = function () {
      FMCassa.apri({
        azione: "stampa",
        corpo: { gruppo: String(gruppo.id), variante: String(variante.id), quantita_id: String(quantita.q.id), descrizione: descrizione(), file: file || "" },
        titolo: gruppo.n, sotto: "IVA inclusa · consegna " + quantita.sp.type,
        righe: [descrizione(), quantita.q.quantity + " copie", eur(netto) + " + IVA " + iva + " %", file ? "file caricato" : "file da caricare dopo"],
        grazie: "Pagato. L'ordine è arrivato a chi coordina" + (file ? ", col tuo file." : ": carica il file qui sotto appena puoi, oppure mandalo a chi coordina."),
        dopo: function () { paga.disabled = true; paga.textContent = "Pagato"; }
      });
    };
  }
  function avvia() {
    box = document.getElementById("fm-stampa"); if (!box) return;
    fam = box.getAttribute("data-famiglia") || "carta"; css();
    box.innerHTML = '<div class="fms-attesa">leggo il catalogo…</div>';
    fetch("stampa/catalogo.json").then(function (r) { return r.json(); }).then(function (c) { catalogo = c; prodotti(); })
      .catch(function () { box.innerHTML = '<div class="fms-attesa">il catalogo non si è caricato: ricarica la pagina</div>'; });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", avvia); else avvia();
})();
