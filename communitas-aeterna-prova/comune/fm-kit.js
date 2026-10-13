/* ═══ FM-KIT · il Kit fiera, quattro righe fisse coi formati scritti, un pagamento solo · 13 ottobre 2026 ═══
   Gab, 19:54: «2500 volantini A5 · 1 roll-up 85 × 200 · 2 striscioni 200 × 100 · 30 maglie (10 M · 10 L · 10 XL), ognuna col prezzo
   vero di Flyeralarm, il totale sotto, i quattro file, Ordina che paga il kit intero. Il formato di ogni riga si può cambiare lì …
   con la possibilità di cambiare il numero e quello può far variare il costo finale … è una prova sperimentale».
   Ogni riga è un prodotto vero di Flyeralarm: si cerca la variante che risponde ai formati, si legge la quantità col prezzo.
   Uso: <div id="fm-kit"></div> + fm-cassa.js prima. */
(function () {
  "use strict";
  var URL_FA = "https://gfnveesogkfvkrdudpfg.supabase.co/functions/v1/flyeralarm?p=";
  /* le righe: gruppo Flyeralarm · scelte (nome attributo → valore, con regex) · quante · quali voci si possono cambiare */
  var RIGHE = [
    { nome: "Volantini", gruppo: 5756, scelte: { "Modello": /formato DIN/i, "Formato": /DIN A5 \(/i, "Materiale": /^135 g carta patinata opaca$|^170 g carta patinata opaca$|^130 g carta patinata/i, "Rifinitura": /^nessuna/i, "Stampa": /4\/4/i }, quanti: 2500, cambia: ["Formato", "Materiale"], file: "il volantino, fronte e retro (PDF, 2 pagine)" },
    { nome: "Roll-up", gruppo: 100, scelte: { "Formato": /^85 x 200/i, "Materiale": /500 g telo in PVC|PVC/i, "Rifinitura": /^nessuna/i }, quanti: 1, cambia: ["Formato", "Materiale"], file: "il roll-up (PDF)" },
    { nome: "Striscioni", gruppo: 141, scelte: { "Modello": /orlatura e occhielli lungo tutto/i, "Formato": /^200 x 100/i, "Materiale": /500 g telo in PVC/i }, quanti: 2, cambia: ["Formato", "Materiale"], file: "lo striscione (PDF)" },
    { nome: "Maglie", gruppo: 6344, scelte: { "Colore di fondo": /blu navy/i, "Rifinitura": /Stampa transfer digitale/i, "Posizione 1": /davanti al centro/i, "Posizione 2": /nessuna ulteriore/i }, quanti: 30, cambia: ["Colore di fondo", "Rifinitura", "Posizione 1"], file: "la grafica della maglia (PDF)", taglie: { M: 10, L: 10, XL: 10 } }
  ];
  var box, stato = [], files = {};
  function esc(t) { return String(t == null ? "" : t).replace(/[&<>"]/g, function (k) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[k]; }); }
  function eur(n) { return Number(n).toLocaleString("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €"; }
  function h(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function fetchJ(p) { return fetch(URL_FA + p).then(function (r) { return r.json(); }); }
  function css() {
    var s = document.createElement("style");
    s.textContent =
      "#fm-kit .riga{background:var(--carta,#1a2148);border:1px solid var(--riga,rgba(245,240,230,.14));border-radius:16px;padding:12px 14px;margin-bottom:8px}" +
      "#fm-kit .riga .capo{display:flex;justify-content:space-between;align-items:baseline;gap:10px}#fm-kit .riga .capo b{font-size:15px}#fm-kit .riga .capo .pr{color:var(--oro,#D4AF6A);font-family:'Cormorant Garamond',serif;font-size:22px;white-space:nowrap}" +
      "#fm-kit .riga .sotto{font-size:12.5px;color:var(--grigio,#9A978F);margin-top:2px;line-height:1.45}" +
      "#fm-kit .riga .scelte{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:8px}" +
      "#fm-kit select{width:100%;min-height:40px;padding:0 10px;border-radius:10px;border:1px solid rgba(245,240,230,.2);background:#0A0C1A;color:#F5F0E6;font:13px 'DM Sans',system-ui,sans-serif}" +
      "#fm-kit label{font-size:11px;color:var(--grigio,#9A978F);display:block;margin-bottom:3px;letter-spacing:.04em}" +
      "#fm-kit .tot{background:var(--carta,#1a2148);border:1px solid var(--oro,#D4AF6A);border-radius:18px;padding:14px 16px;margin-top:12px}" +
      "#fm-kit .tot .g{font-family:'Cormorant Garamond',serif;font-size:34px;color:var(--oro,#D4AF6A);line-height:1}#fm-kit .tot .g small{font-family:'DM Sans',sans-serif;font-size:12px;color:var(--grigio,#9A978F);margin-left:6px}" +
      "#fm-kit .tot .r{font-size:12.5px;color:var(--grigio,#9A978F);margin-top:6px;line-height:1.5}" +
      "#fm-kit .file{margin-top:10px;font-size:13px;line-height:1.5}#fm-kit .file input{display:block;margin-top:4px;font-size:12.5px;color:var(--grigio,#9A978F)}" +
      "#fm-kit .paga{margin-top:12px;display:flex;width:100%;justify-content:center;font:600 15px 'DM Sans',system-ui,sans-serif;padding:13px 18px;border-radius:980px;background:var(--oro,#D4AF6A);color:#0A0C1A;border:0;cursor:pointer}#fm-kit .paga:disabled{opacity:.5}" +
      "#fm-kit .attesa{font-size:13px;color:var(--grigio,#9A978F);padding:8px 0}";
    document.head.appendChild(s);
  }
  function configura(gid, scelteIds) { return fetch(URL_FA + "/v2/catalog/groups/" + gid + "/configurator", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(scelteIds || {}) }).then(function (r) { return r.json(); }); }
  /* si risolve una riga: attributo per attributo, il primo valore che risponde alla regola (o alle scelte fatte a mano), finché resta una variante sola */
  function risolvi(r, mano) {
    var scelteIds = {}, nomi = {}, tutte = null;
    function passo(conf) {
      if (!tutte) tutte = conf.attributes || {};
      var attrs = conf.attributes || {}, ids = Object.keys(attrs);
      for (var k = 0; k < ids.length; k++) {
        var aid = ids[k]; if (scelteIds[aid] != null) continue;
        var at = attrs[aid], vals = at.values || {}, vids = Object.keys(vals); if (!vids.length) continue;
        var voluto = (mano && mano[at.name]) || r.scelte[at.name];
        var scelto = null;
        if (voluto) { for (var q = 0; q < vids.length; q++) { if (voluto.test(vals[vids[q]])) { scelto = vids[q]; break; } } }
        if (!scelto) scelto = vids[0];
        scelteIds[aid] = scelto; nomi[at.name] = vals[scelto];
        return configura(r.gruppo, scelteIds).then(passo);
      }
      return { id: conf.variants && conf.variants.result, nomi: nomi, tutte: tutte };
    }
    return configura(r.gruppo, {}).then(passo);
  }
  function disegnaRiga(i) {
    var r = RIGHE[i], s = stato[i], el = s.el; el.innerHTML = "";
    el.appendChild(h("div", "capo", "<b>" + s.quantita.q.quantity + " " + esc(r.nome.toLowerCase()) + (r.taglie ? " · " + Object.keys(r.taglie).map(function (k) { return r.taglie[k] + " " + k; }).join(" · ") : "") + "</b><span class=\"pr\">" + eur(s.quantita.sp.msrp_price) + "</span>"));
    var descr = Object.keys(s.nomi).filter(function (k) { return !/^Stampa$/i.test(k); }).map(function (k) { return s.nomi[k]; }).join(" · ");
    el.appendChild(h("div", "sotto", esc(s.gruppo.n) + " · " + esc(descr) + " · consegna " + esc(s.quantita.sp.type) + " " + s.quantita.sp.from + "–" + s.quantita.sp.to + " gg"));
    var sc = h("div", "scelte");
    r.cambia.forEach(function (nome) {
      var aid = Object.keys(s.tutte).filter(function (k) { return s.tutte[k].name === nome; })[0]; if (!aid) return;
      var vals = s.tutte[aid].values || {}, vids = Object.keys(vals); if (vids.length < 2) return;
      var w = h("div"); w.appendChild(h("label", null, esc(nome)));
      var sel = h("select"); vids.forEach(function (id) { var o = document.createElement("option"); o.value = vals[id]; o.textContent = vals[id]; if (vals[id] === s.nomi[nome]) o.selected = true; sel.appendChild(o); });
      sel.onchange = function () {
        s.mano = s.mano || {}; s.mano[nome] = new RegExp("^" + sel.value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "$", "i");
        el.innerHTML = '<div class="attesa">rileggo il prezzo…</div>';
        risolvi(r, s.mano).then(function (x) { s.variante = { id: x.id }; s.nomi = x.nomi; return quantitaDi(i, s.quantita ? s.quantita.q.quantity : r.quanti); });
      };
      w.appendChild(sel); sc.appendChild(w);
    });
    if (r.taglie) {
      Object.keys(r.taglie).forEach(function (tg) {
        var w = h("div"); w.appendChild(h("label", null, "taglia " + tg));
        var inp = document.createElement("input"); inp.type = "number"; inp.min = "0"; inp.step = "1"; inp.value = r.taglie[tg]; inp.style.cssText = "width:100%;min-height:40px;padding:0 10px;border-radius:10px;border:1px solid rgba(245,240,230,.2);background:#0A0C1A;color:#F5F0E6;font:13px 'DM Sans',system-ui,sans-serif";
        inp.onchange = function () { r.taglie[tg] = Math.max(0, parseInt(inp.value || "0", 10)); var tot = 0; Object.keys(r.taglie).forEach(function (k) { tot += r.taglie[k]; }); if (tot < 1) return; el.innerHTML = '<div class="attesa">rileggo il prezzo…</div>'; quantitaDi(i, tot); };
        w.appendChild(inp); sc.appendChild(w);
      });
    } else {
      var w2 = h("div"); w2.appendChild(h("label", null, "quante"));
      var selq = h("select"); s.quantitaTutte.forEach(function (q) { var o = document.createElement("option"); o.value = q.id; var sp = (q.shippings || []).filter(function (x) { return x.type === "Standard"; })[0] || (q.shippings || [])[0]; o.textContent = q.quantity + (sp ? " · " + eur(sp.msrp_price) : ""); if (q.id === s.quantita.q.id) o.selected = true; selq.appendChild(o); });
      selq.onchange = function () { var q = s.quantitaTutte.filter(function (x) { return String(x.id) === selq.value; })[0]; if (!q) return; var sp = (q.shippings || []).filter(function (x) { return x.type === "Standard"; })[0] || (q.shippings || [])[0]; s.quantita = { q: q, sp: sp, vat: q.vat || 22 }; disegnaRiga(i); totale(); };
      w2.appendChild(selq); sc.appendChild(w2);
    }
    el.appendChild(sc);
  }
  function quantitaDi(i, vuole) {
    var s = stato[i];
    return fetchJ("/v2/catalog/variants/" + s.variante.id).then(function (v) {
      var qs = (v && v.quantities) || [];
      s.quantitaTutte = qs;
      var q = qs.filter(function (x) { return x.quantity >= vuole; })[0] || qs[qs.length - 1];
      if (!q) { s.el.innerHTML = '<div class="attesa">' + esc(RIGHE[i].nome) + ': nessuna quantità disponibile</div>'; return; }
      var sp = (q.shippings || []).filter(function (x) { return x.type === "Standard"; })[0] || (q.shippings || [])[0];
      s.quantita = { q: q, sp: sp, vat: q.vat || 22 };
      disegnaRiga(i); totale();
    });
  }
  function totale() {
    var t = document.getElementById("kit-tot"); if (!t) return;
    var pronte = stato.filter(function (s) { return s && s.quantita; });
    if (pronte.length < stato.length) { t.querySelector(".g").innerHTML = '<small>leggo i prezzi…</small>'; return; }
    var netto = 0, iva = 22; pronte.forEach(function (s) { netto += Number(s.quantita.sp.msrp_price); iva = s.quantita.vat || iva; });
    netto = Math.round(netto * 100) / 100; var tot = Math.round(netto * (1 + iva / 100) * 100) / 100;
    t.querySelector(".g").innerHTML = eur(tot) + "<small>IVA inclusa</small>";
    try { localStorage.setItem("fm_kit_prezzo", JSON.stringify({ tot: tot, netto: netto, t: Date.now() })); } catch (e) { }
    t.querySelector(".r").textContent = eur(netto) + " + IVA " + iva + " % · " + pronte.length + " righe · consegna Standard compresa · prezzo pubblico Flyeralarm";
    var b = document.getElementById("kit-paga"); b.disabled = false; b.textContent = "Ordina e paga " + eur(tot);
    b.onclick = function () {
      var righe = stato.map(function (s, i) { var r = RIGHE[i]; return { nome: r.nome + " · " + (s.nomi["Formato"] || s.nomi["Colore di fondo"] || "") + (r.taglie ? " · " + Object.keys(r.taglie).map(function (k) { return r.taglie[k] + " " + k; }).join(" ") : ""), variante: String(s.variante.id), quantita_id: String(s.quantita.q.id) }; });
      var elencoFile = Object.keys(files).map(function (k) { return files[k]; }).join(" ; ");
      if (!window.__kitIndirizzo) { alert("Scegli o aggiungi l'indirizzo di consegna."); return; }
      FMCassa.apri({ azione: "kit", corpo: { righe: righe, file: elencoFile, indirizzo: window.__kitIndirizzo }, titolo: "Kit fiera", sotto: "IVA inclusa · consegna Standard",
        righe: righe.map(function (r, i) { return stato[i].quantita.q.quantity + " × " + r.nome + " · " + eur(stato[i].quantita.sp.msrp_price); }),
        grazie: "Pagato. Il kit è in mano a chi coordina: manda in stampa le quattro righe coi tuoi file e ti scrive.",
        dopo: function () { b.disabled = true; b.textContent = "Pagato"; } });
    };
  }
  /* solo il prezzo del kit, in un'altra pagina (la Stampa): <div data-kit-prezzo></div> — 13 ott 22:40, Gab: «In stampa non si legge il costo kit».
     Le quattro righe coi formati fissi, la quantità di base, la consegna Standard, l'IVA: lo stesso conto della pagina del kit. Si ricorda 6 ore. */
  function soloPrezzo(el) {
    function scrivi(tot) { el.innerHTML = eur(tot) + ' <small style="font-size:12px;color:var(--grigio,#9A978F)">IVA inclusa · consegna compresa · cambiando le righe cambia</small>'; }
    try { var c = JSON.parse(localStorage.getItem("fm_kit_prezzo") || "null"); if (c && c.tot && Date.now() - c.t < 6 * 3600 * 1000) { scrivi(c.tot); return; } } catch (e) { }
    el.innerHTML = '<small style="font-size:12px;color:var(--grigio,#9A978F)">leggo il prezzo da Flyeralarm…</small>';
    Promise.all(RIGHE.map(function (r) {
      return risolvi(r, null).then(function (x) { if (!x.id) throw new Error(r.nome); return fetchJ("/v2/catalog/variants/" + x.id); }).then(function (v) {
        var qs = (v && v.quantities) || [], q = qs.filter(function (x) { return x.quantity >= r.quanti; })[0] || qs[qs.length - 1]; if (!q) throw new Error(r.nome);
        var sp = (q.shippings || []).filter(function (x) { return x.type === "Standard"; })[0] || (q.shippings || [])[0];
        return { netto: Number(sp.msrp_price), vat: q.vat || 22 };
      });
    })).then(function (righe) {
      var netto = 0, iva = 22; righe.forEach(function (r) { netto += r.netto; iva = r.vat || iva; });
      netto = Math.round(netto * 100) / 100; var tot = Math.round(netto * (1 + iva / 100) * 100) / 100;
      try { localStorage.setItem("fm_kit_prezzo", JSON.stringify({ tot: tot, netto: netto, t: Date.now() })); } catch (e) { }
      scrivi(tot);
    }).catch(function () { el.innerHTML = '<small style="font-size:12px;color:var(--grigio,#9A978F)">il prezzo lo vedi nella pagina del kit, riga per riga</small>'; });
  }
  function avvia() {
    var solo = document.querySelector("[data-kit-prezzo]"); if (solo && !document.getElementById("fm-kit")) { soloPrezzo(solo); return; }
    box = document.getElementById("fm-kit"); if (!box) return; css();
    RIGHE.forEach(function (r, i) {
      var el = h("div", "riga", '<div class="attesa">' + esc(r.nome) + ': leggo formati e prezzi…</div>'); box.appendChild(el);
      stato[i] = { el: el };
      fetchJ("/v2/catalog/groups/" + r.gruppo).then(function (g) { stato[i].gruppo = g || { n: r.nome }; return risolvi(r, null); })
        .then(function (x) { if (!x.id) { el.innerHTML = '<div class="attesa">' + esc(r.nome) + ': Flyeralarm non dà una variante per questi formati</div>'; return; } stato[i].variante = { id: x.id }; stato[i].nomi = x.nomi; stato[i].tutte = x.tutte; return quantitaDi(i, r.quanti); })
        .catch(function () { el.innerHTML = '<div class="attesa">' + esc(r.nome) + ': Flyeralarm non risponde</div>'; });
    });
    var t = h("div", "tot", '<div class="g"><small>leggo i prezzi…</small></div><div class="r"></div>'); t.id = "kit-tot";
    var fb = h("div", "file", "<b>I file di stampa</b> (PDF): li puoi caricare ora o dopo il pagamento.");
    RIGHE.filter(function (r) { return r.file; }).forEach(function (r) {
      var inp = document.createElement("input"); inp.type = "file"; inp.accept = "application/pdf,.pdf,application/zip,.zip"; inp.title = r.file;
      var lab = h("label", null, esc(r.file)); fb.appendChild(lab); fb.appendChild(inp);
      var st = h("div", "attesa", ""); fb.appendChild(st);
      inp.onchange = function () {
        var fl = inp.files && inp.files[0]; if (!fl) return; st.textContent = "carico " + fl.name + "…";
        FMCassa.sessione().then(function (sess) {
          if (!sess) { location.href = "accesso.html"; return; }
          var nome = sess.user.id + "/kit-" + Date.now() + "-" + fl.name.replace(/[^\w.\-]+/g, "_");
          return FMCassa.client().storage.from("stampa").upload(nome, fl, { contentType: fl.type || "application/pdf", upsert: false }).then(function (r2) {
            if (r2.error) { st.textContent = "non sono riuscito a caricare il file: " + r2.error.message; return; }
            files[r.nome] = "stampa/" + nome; st.textContent = "caricato: " + fl.name;
            var i = RIGHE.indexOf(r), s = stato[i];
            if (s && s.variante && s.quantita) { var ver = h("div", "attesa", ""); st.parentNode.insertBefore(ver, st.nextSibling); FMCassa.verifica({ file: files[r.nome], variante: String(s.variante.id), quantita: s.quantita.q.quantity }, ver, function (esito) { if (esito === 2) { delete files[r.nome]; st.textContent = "respinto: carica un file corretto"; } }); }
          });
        });
      };
    });
    t.appendChild(fb);
    var indBox = h("div", "file", "<b>Dove va consegnato</b>"); var indSc = h("div"); indBox.appendChild(indSc); t.appendChild(indBox);
    window.__kitIndirizzo = ""; FMCassa.indirizzi(indSc, function (x) { window.__kitIndirizzo = x; });
    var b = h("button", "paga", "Ordina e paga"); b.type = "button"; b.id = "kit-paga"; b.disabled = true; t.appendChild(b);
    t.appendChild(h("div", "attesa", "Pagato, chi coordina manda in stampa le righe del kit coi tuoi file; ti arrivano col corriere."));
    box.appendChild(t);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", avvia); else avvia();
})();
