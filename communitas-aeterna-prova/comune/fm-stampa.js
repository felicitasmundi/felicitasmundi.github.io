/* ═══ FM-STAMPA · il configuratore, come su Flyeralarm · 13 ottobre 2026, v2 ═══
   Gab, 19:51: «tu tocchi il prodotto "volantino": prima ti crea la descrizione del prodotto, subito la configurazione dove scegli
   con delle card il modello, poi le altre voci poste su un menu a tendina, quindi vedi cosa stai scegliendo, non hai l'elenco
   completo di tutti, ma lo scegli … 1 Modello · 2 Formato · 3 Materiale · 4 Rifinitura · 5 Stampa · 6 Prezzo base · 7 Opzioni ·
   8 Checkout e upload … e vale per tutte le famiglie».
   Tre livelli: famiglia → i tipi di prodotto (quadranti) → il prodotto: descrizione, poi i passi numerati.
   Dentro una famiglia le altre famiglie non si vedono; si torna col tasto ‹ in alto.
   I dati sono quelli veri di Flyeralarm (catalogo, varianti, quantità coi prezzi, opzioni), letti dalla funzione «flyeralarm».
   ⛔ Nessun ordine parte da qui verso Flyeralarm: paga la persona, l'ordine vero lo fa chi coordina col file.
   Uso: <div id="fm-stampa" data-famiglia="carta" data-nome="Carta stampata"></div> + fm-cassa.js prima di questo file. */
(function () {
  "use strict";
  var URL_FA = "https://gfnveesogkfvkrdudpfg.supabase.co/functions/v1/flyeralarm?p=";
  var IMG = "stampa/"; var IMGV = "?v=10132030";
  /* i tipi di prodotto, per famiglia: nome · quali gruppi di Flyeralarm (per nome) · quale versione si apre per prima · immagine */
  var TIPI = {
    carta: [
      ["Volantini", /^Volantini/i, /classici/i, "volantino"], ["Manifesti e locandine", /^Manifesti|^Poster|^Locandin/i, /stampa digitale e offset|classici/i, "poster"],
      ["Biglietti da visita", /^Biglietti da visita/i, /classici/i, "biglietti"], ["Pieghevoli", /^Pieghevoli|^Depliant/i, /classici/i, "pieghevole"],
      ["Cartoline", /^Cartoline/i, /classiche|classici/i, "volantino"], ["Adesivi", /^Adesivi|^Etichette/i, /classici|su foglio/i, "adesivi"],
      ["Cartelline", /^Cartelline|^Folder/i, /classiche|classici/i, "pieghevole"], ["Buste e carta intestata", /^Buste|^Carta intestata|^Blocchi/i, /classic/i, "volantino"]
    ],
    libri: [
      ["Riviste", /^Riviste/i, /classiche|punto metallico/i, "rivista"], ["Brochure e cataloghi", /^Brochure|^Catalog/i, /classic|budget/i, "rivista"],
      ["Libri", /^Libri/i, /brossura|classic/i, "rivista"], ["Opuscoli e fascicoli", /^Opuscol|^Fascicol|^Pieghevoli/i, /classic/i, "pieghevole"], ["Menù", /^Men[uù]/i, /classic/i, "rivista"]
    ],
    agende: [
      ["Agende", /^Agende/i, /classic/i, "agenda"], ["Calendari", /^Calendari/i, /parete|classic/i, "poster"],
      ["Quaderni e taccuini", /^Quadern|^Taccuin|^Notes/i, /classic/i, "agenda"], ["Blocchi per appunti", /^Blocc/i, /classic/i, "agenda"]
    ],
    fiere: [
      ["Roll-up", /^Roll-?up/i, /Classic, sistema incl/i, "rollup"], ["Striscioni e banner", /^Striscion|^Banner/i, /classic|PVC/i, "bandiera"],
      ["Bandiere", /^Bandier/i, /classic|beach/i, "bandiera"], ["Totem e display", /^Totem|^Display|^Espositor/i, /classic/i, "rollup"],
      ["Stand e fondali", /^Stand|^Fondal|^Pop[- ]?up|^Parete/i, /classic/i, "rollup"], ["Banconi", /^Bancon|^Desk/i, /classic/i, "rollup"],
      ["Insegne e pannelli", /^Insegn|^Pannell|^Targh|^Cartell/i, /classic/i, "poster"], ["Pellicole per vetrine", /^Pellicol/i, /classic/i, "adesivi"]
    ],
    confezioni: [
      ["Shopper e borse", /^Shopper|^Borse|^Sacchett|^Buste/i, /cotone|carta|classic/i, "shopper"], ["Scatole e confezioni", /^Scatol|^Box|^Confezion|^Astucc/i, /classic/i, "scatola"],
      ["Bicchieri e coppette", /^Bicchier|^Coppett/i, /carta|classic/i, "tazza"], ["Tovaglioli", /^Tovagliol/i, /classic/i, "volantino"], ["Imballaggi", /^Imballag|^Nastr|^Carta da imball/i, /classic/i, "scatola"]
    ],
    gadget: [
      ["Penne", /^Penn/i, /a sfera classic|a sfera/i, "penne"], ["Matite", /^Matit/i, /classic/i, "penne"], ["Borracce e bottiglie", /^Borracc|^Bottigl/i, /classic/i, "tazza"],
      ["Tazze", /^Tazz/i, /classic/i, "tazza"], ["Portachiavi", /^Portachiav/i, /classic/i, "penne"], ["Cordini e portabadge", /^Cordin|^Portabadge|^Lanyard/i, /classic/i, "penne"],
      ["Zaini e sacche", /^Zain|^Sacc/i, /classic/i, "shopper"], ["Ombrelli", /^Ombrell/i, /classic/i, "shopper"]
    ],
    abiti: [
      ["T-shirt", /^T-shirt|^Magliett/i, /classic|basic/i, "tshirt"], ["Polo", /^Polo/i, /classic/i, "tshirt"], ["Felpe", /^Felp/i, /classic/i, "tshirt"],
      ["Giacche e gilet", /^Giacc|^Gilet/i, /classic/i, "tshirt"], ["Cappelli", /^Cappell|^Berrett/i, /classic/i, "tshirt"], ["Grembiuli", /^Grembiul/i, /classic/i, "tshirt"]
    ],
    foto: [
      ["Fotolibri", /^Fotolibr/i, /copertina rigida/i, "rivista"], ["Foto da parete", /^Foto da parete|^Stampe fotografiche/i, /./, "poster"],
      ["Calendari fotografici", /^Calendari fotografici/i, /./, "poster"], ["Cornici per foto", /^Cornici per foto/i, /./, "poster"]
    ]
  };
  var box, fam, nomeFam, catalogo = null, tipo = null, gruppo = null, scelte = {}, variante = null, quantita = null, opzioni = {}, opzScelte = {}, file = null, descr = null;

  function esc(t) { return String(t == null ? "" : t).replace(/[&<>"]/g, function (k) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[k]; }); }
  function eur(n) { return Number(n).toLocaleString("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €"; }
  function h(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function css() {
    var s = document.createElement("style");
    s.textContent =
      "#fm-stampa .fms-indietro{display:inline-flex;align-items:center;gap:6px;font:13px 'DM Sans',system-ui,sans-serif;color:var(--oro,#D4AF6A);background:none;border:0;cursor:pointer;padding:0;margin-bottom:10px}" +
      "#fm-stampa .fms-tipi{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}@media (min-width:700px){#fm-stampa .fms-tipi{grid-template-columns:repeat(3,minmax(0,1fr))}}" +
      "#fm-stampa .fms-tipo{background:var(--carta,#1a2148);border:1px solid var(--riga,rgba(245,240,230,.14));border-radius:16px;overflow:hidden;text-align:left;color:inherit;cursor:pointer;padding:0}" +
      "#fm-stampa .fms-tipo img{width:100%;aspect-ratio:1;object-fit:cover;display:block}#fm-stampa .fms-tipo .t{padding:9px 11px 11px;font-size:14px;font-weight:600}#fm-stampa .fms-tipo .t small{display:block;font-weight:400;font-size:11.5px;color:var(--grigio,#9A978F);margin-top:2px}" +
      "#fm-stampa .fms-prod h2{font-family:'Cormorant Garamond',serif;font-weight:500;font-size:26px;line-height:1.1;margin:0 0 6px}" +
      "#fm-stampa .fms-descr{font-size:13.5px;line-height:1.5;color:rgba(245,240,230,.85);margin-bottom:6px}#fm-stampa .fms-descr ul{margin:6px 0 0 18px;padding:0}#fm-stampa .fms-descr li{margin:2px 0}#fm-stampa .fms-descr p{margin:0 0 6px}" +
      "#fm-stampa .fms-versione{margin:10px 0 14px}" +
      "#fm-stampa select{width:100%;min-height:44px;padding:0 12px;border-radius:12px;border:1px solid rgba(245,240,230,.2);background:#0A0C1A;color:#F5F0E6;font:14px 'DM Sans',system-ui,sans-serif;appearance:none;-webkit-appearance:none;background-image:linear-gradient(45deg,transparent 50%,#D4AF6A 50%),linear-gradient(135deg,#D4AF6A 50%,transparent 50%);background-position:calc(100% - 18px) 50%,calc(100% - 13px) 50%;background-size:5px 5px;background-repeat:no-repeat}" +
      "#fm-stampa .fms-passi{display:flex;flex-direction:column;gap:8px}" +
      "#fm-stampa .fms-passo{background:var(--carta,#1a2148);border:1px solid var(--riga,rgba(245,240,230,.14));border-radius:16px;padding:12px 14px}" +
      "#fm-stampa .fms-passo.spento{opacity:.45}" +
      "#fm-stampa .fms-passo .capo{display:flex;align-items:baseline;justify-content:space-between;gap:10px}" +
      "#fm-stampa .fms-passo .capo b{font-family:'Cinzel',serif;font-weight:500;font-size:11px;letter-spacing:.14em;color:var(--oro,#D4AF6A)}" +
      "#fm-stampa .fms-passo .capo span{font-size:13px;color:rgba(245,240,230,.9);text-align:right}" +
      "#fm-stampa .fms-passo .corpo{margin-top:10px}" +
      "#fm-stampa .fms-card{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}" +
      "#fm-stampa .fms-card button{background:#0A0C1A;border:1px solid rgba(245,240,230,.14);border-radius:12px;padding:10px 8px;color:inherit;font:13px 'DM Sans',system-ui,sans-serif;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:6px}" +
      "#fm-stampa .fms-card button.on{border-color:var(--oro,#D4AF6A);box-shadow:0 0 0 1px rgba(212,175,106,.35)}" +
      "#fm-stampa .fms-card button i{display:block;width:34px;height:34px;border:1.5px solid var(--oro,#D4AF6A);border-radius:4px}" +
      "#fm-stampa .fms-card button small{font-size:10.5px;color:var(--grigio,#9A978F);line-height:1.25}" +
      "#fm-stampa .fms-sped{display:flex;gap:6px;margin-bottom:10px}#fm-stampa .fms-sped button{flex:1;font:13px 'DM Sans',system-ui,sans-serif;border:1px solid var(--riga,rgba(245,240,230,.14));border-radius:12px;padding:8px 6px;color:rgba(245,240,230,.9);background:none;cursor:pointer;display:flex;flex-direction:column;align-items:center}#fm-stampa .fms-sped button small{font-size:11px;color:var(--grigio,#9A978F)}#fm-stampa .fms-sped button.on{border-color:var(--oro,#D4AF6A);background:rgba(212,175,106,.12)}" +
      "#fm-stampa .fms-avanti{margin-top:12px;display:flex;width:100%;justify-content:center;font:600 14px 'DM Sans',system-ui,sans-serif;padding:11px 16px;border-radius:980px;background:none;color:var(--oro,#D4AF6A);border:1px solid var(--oro,#D4AF6A);cursor:pointer}" +
      "#fm-stampa .fms-card button i.q{width:34px;height:34px}#fm-stampa .fms-card button i.r{width:40px;height:28px}#fm-stampa .fms-card button i.o{border-radius:50%}#fm-stampa .fms-card button i.d{width:30px;height:40px}#fm-stampa .fms-card button i.s{border-style:dashed}" +
      "#fm-stampa table.fms-prezzi{width:100%;border-collapse:collapse;font-size:13.5px}#fm-stampa table.fms-prezzi th{font-family:'Cinzel',serif;font-weight:500;font-size:10px;letter-spacing:.12em;color:var(--grigio,#9A978F);text-align:right;padding:4px 6px}#fm-stampa table.fms-prezzi th:first-child{text-align:left}" +
      "#fm-stampa table.fms-prezzi td{padding:8px 6px;border-top:1px solid rgba(245,240,230,.08);text-align:right;cursor:pointer}#fm-stampa table.fms-prezzi td:first-child{text-align:left;font-weight:600}" +
      "#fm-stampa table.fms-prezzi tr.on td{background:rgba(212,175,106,.14);color:#F5F0E6}#fm-stampa table.fms-prezzi tr.on td:first-child{color:var(--oro,#D4AF6A)}" +
      "#fm-stampa .fms-opz{margin-bottom:10px}#fm-stampa .fms-opz .nome{font-size:12.5px;color:var(--grigio,#9A978F);margin-bottom:5px}" +
      "#fm-stampa .fms-opz label{display:flex;justify-content:space-between;gap:8px;font-size:13px;padding:6px 0;border-top:1px solid rgba(245,240,230,.06);cursor:pointer}#fm-stampa .fms-opz label input{margin-right:8px}#fm-stampa .fms-opz label .pr{color:var(--oro,#D4AF6A);white-space:nowrap}" +
      "#fm-stampa .fms-tot .g{font-family:'Cormorant Garamond',serif;font-size:32px;color:var(--oro,#D4AF6A);line-height:1}#fm-stampa .fms-tot .g small{font-family:'DM Sans',sans-serif;font-size:12px;color:var(--grigio,#9A978F);margin-left:6px}" +
      "#fm-stampa .fms-tot .r{font-size:12.5px;color:var(--grigio,#9A978F);margin-top:6px;line-height:1.5}" +
      "#fm-stampa .fms-file{margin-top:10px;font-size:13px;line-height:1.5}#fm-stampa .fms-file input{display:block;margin-top:6px;font-size:13px;color:var(--grigio,#9A978F)}" +
      "#fm-stampa .fms-paga{margin-top:12px;display:flex;width:100%;justify-content:center;font:600 15px 'DM Sans',system-ui,sans-serif;padding:13px 18px;border-radius:980px;background:var(--oro,#D4AF6A);color:#0A0C1A;border:0;cursor:pointer}#fm-stampa .fms-paga:disabled{opacity:.5}" +
      "#fm-stampa .fms-nota{font-size:12.5px;color:var(--grigio,#9A978F);line-height:1.5;margin-top:8px}" +
      "#fm-stampa .fms-attesa{font-size:13px;color:var(--grigio,#9A978F);padding:10px 0}";
    document.head.appendChild(s);
  }
  function fetchJ(p) { return fetch(URL_FA + p).then(function (r) { return r.json(); }); }
  /* il configuratore di Flyeralarm: si manda {attributo: valore} e torna, per ogni attributo, i valori ancora possibili;
     quando resta una variante sola, torna il suo id (variants.result) */
  function configura(g, scelteIds) { return fetch(URL_FA + "/v2/catalog/groups/" + g.id + "/configurator", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(scelteIds || {}) }).then(function (r) { return r.json(); }); }
  function gruppiDi(t) { return catalogo.filter(function (g) { return t[1].test(g.n) && !/campion/i.test(g.n); }).sort(function (a, b) { return a.n.localeCompare(b.n, "it"); }); }

  /* ── livello 1 · i tipi di prodotto, a quadranti */
  function tipi() {
    tipo = null; gruppo = null;
    box.innerHTML = "";
    var torna = h("a", "fms-indietro", "‹ Stampa"); torna.href = "stampa-bozza.html"; box.appendChild(torna);
    var griglia = h("div", "fms-tipi");
    (TIPI[fam] || []).forEach(function (t) {
      var gs = gruppiDi(t); if (!gs.length) return;
      var b = h("button", "fms-tipo", '<img src="' + IMG + t[3] + '.jpg' + IMGV + '" alt=""><div class="t">' + esc(t[0]) + '<small>' + gs.length + (gs.length === 1 ? " versione" : " versioni") + '</small></div>'); b.type = "button";
      b.onclick = function () { apriTipo(t, gs); };
      griglia.appendChild(b);
    });
    box.appendChild(griglia);
    window.scrollTo({ top: 0 });
  }
  /* ── livello 2 · il prodotto: descrizione, versione, passi */
  function apriTipo(t, gs) {
    tipo = t; box.innerHTML = "";
    var torna = h("button", "fms-indietro", "‹ " + esc(nomeFam)); torna.type = "button"; torna.onclick = tipi; box.appendChild(torna);
    var prod = h("div", "fms-prod"); box.appendChild(prod);
    var primo = gs.filter(function (g) { return t[2].test(g.n); })[0] || gs[0];
    var sel = h("select"); gs.forEach(function (g) { var o = document.createElement("option"); o.value = g.id; o.textContent = g.n; if (g === primo) o.selected = true; sel.appendChild(o); });
    var vers = h("div", "fms-versione"); if (gs.length > 1) { vers.appendChild(h("div", "fms-opz nome", "la versione")); vers.appendChild(sel); }
    sel.onchange = function () { var g = gs.filter(function (x) { return String(x.id) === sel.value; })[0]; if (g) apriGruppo(g, prod, vers); };
    apriGruppo(primo, prod, vers);
    window.scrollTo({ top: 0 });
  }
  function apriGruppo(g, prod, vers) {
    gruppo = g; scelte = {}; variante = null; quantita = null; opzioni = {}; opzScelte = {}; file = null; descr = null;
    prod.innerHTML = ""; prod.appendChild(h("h2", null, esc(g.n)));
    var d = h("div", "fms-descr", '<div class="fms-attesa">leggo la descrizione…</div>'); prod.appendChild(d);
    prod.appendChild(vers);
    var passi = h("div", "fms-passi", '<div class="fms-attesa">leggo formati, materiali e prezzi…</div>'); prod.appendChild(passi);
    fetchJ("/v2/catalog/groups/" + g.id).then(function (j) {
      descr = j; d.innerHTML = j && j.description_html ? j.description_html.replace(/<strong>Informazioni obbligatorie:<\/strong>[\s\S]*$/i, "") : esc((j && j.description) || "");
    }).catch(function () { d.innerHTML = ""; });
    configura(g, {}).then(function (j) {
      conf = j; ordine = Object.keys((j && j.attributes) || {});
      if (!ordine.length) { passi.innerHTML = '<div class="fms-attesa">per questa versione Flyeralarm non dà scelte da qui: prova un\'altra versione</div>'; return; }
      disegnaPassi(passi);
    }).catch(function () { passi.innerHTML = '<div class="fms-attesa">Flyeralarm non risponde: riprova fra un momento</div>'; });
  }
  var conf = null, ordine = [], nomiScelti = {};
  /* la spiegazione sotto il modello (Gab, 20:15: «cosa vuol dire formato din?») */
  function spiega(nome) {
    var n = nome.toLowerCase();
    if (/formato din/.test(n)) return "A3 · A4 · A5 · A6 · A7 · DIN lungo";
    if (/rettangol/.test(n)) return "altre misure rettangolari";
    if (/quadrat/.test(n)) return "9,8 · 14,8 · 21 cm";
    if (/rotond|oval/.test(n)) return "tondo o ovale";
    if (/special|personalizz/.test(n)) return "cuore, stella, albero…";
    if (/misura/.test(n)) return "la misura la dici tu";
    return "";
  }
  function forma(nome) { /* il disegnino della card del modello */
    var n = nome.toLowerCase();
    if (/quadrat/.test(n)) return "q"; if (/rotond|oval|cerch/.test(n)) return "o"; if (/lungo|vertical|alto/.test(n)) return "d"; if (/special|personalizz|misura|forma/.test(n)) return "s"; return "r";
  }
  function disegnaPassi(passi) {
    passi.innerHTML = "";
    var attrs = conf.attributes || {}, n = 0, fermo = false;
    nomiScelti = {};
    ordine.forEach(function (aid, i) {
      n = i + 1;
      var at = attrs[aid], valori = at.values || {}, ids = Object.keys(valori);
      if (ids.length === 1 && scelte[aid] == null) scelte[aid] = ids[0];
      if (scelte[aid] != null && !valori[scelte[aid]]) delete scelte[aid];
      if (scelte[aid] != null) nomiScelti[at.name] = valori[scelte[aid]];
      var p = h("div", "fms-passo" + (fermo ? " spento" : ""));
      p.appendChild(h("div", "capo", "<b>" + n + ". " + esc(String(at.name).toUpperCase()) + "</b><span>" + (scelte[aid] != null ? esc(valori[scelte[aid]]) : (fermo ? "" : "scegli")) + "</span>"));
      var corpo = h("div", "corpo");
      if (!fermo) {
        if (i === 0 && ids.length <= 9) {
          var cards = h("div", "fms-card");
          ids.forEach(function (id) {
            var sp = spiega(valori[id]);
            var b = h("button", String(scelte[aid]) === String(id) ? "on" : "", "<i class=\"" + forma(valori[id]) + "\"></i><span>" + esc(valori[id]) + "</span>" + (sp ? "<small>" + esc(sp) + "</small>" : "")); b.type = "button";
            b.onclick = function () { scegliAttr(aid, id, passi); };
            cards.appendChild(b);
          });
          corpo.appendChild(cards);
        } else {
          var sel = h("select"); var o0 = document.createElement("option"); o0.value = ""; o0.textContent = "scegli…"; sel.appendChild(o0);
          ids.forEach(function (id) { var o = document.createElement("option"); o.value = id; o.textContent = valori[id]; if (String(scelte[aid]) === String(id)) o.selected = true; sel.appendChild(o); });
          sel.onchange = function () { if (sel.value) scegliAttr(aid, sel.value, passi); };
          corpo.appendChild(sel);
        }
      }
      p.appendChild(corpo); passi.appendChild(p);
      if (scelte[aid] == null) fermo = true;
    });
    var pp = h("div", "fms-passo" + (fermo ? " spento" : "")); pp.id = "fms-prezzo";
    pp.appendChild(h("div", "capo", "<b>" + (n + 1) + ". PREZZO BASE</b><span>" + (quantita ? quantita.q.quantity + " copie · " + eur(quantita.sp.msrp_price) : (fermo ? "" : "scegli le copie")) + "</span>"));
    passi.appendChild(pp);
    var po = h("div", "fms-passo spento"); po.id = "fms-opzioni"; po.appendChild(h("div", "capo", "<b>" + (n + 2) + ". OPZIONI</b><span></span>")); passi.appendChild(po);
    var pc = h("div", "fms-passo spento"); pc.id = "fms-checkout"; pc.appendChild(h("div", "capo", "<b>" + (n + 3) + ". CHECKOUT E UPLOAD</b><span></span>")); passi.appendChild(pc);
    if (!fermo && conf.variants && conf.variants.count === 1 && conf.variants.result) { variante = { id: conf.variants.result }; prezzoBase(pp, n); }
    else if (!fermo && conf.variants && conf.variants.count > 1) pp.querySelector(".capo span").textContent = conf.variants.count + " combinazioni: manca una scelta";
  }
  function scegliAttr(aid, id, passi) {
    scelte[aid] = id; var dopo = false;
    ordine.forEach(function (a2) { if (dopo) delete scelte[a2]; if (a2 === aid) dopo = true; });
    variante = null; quantita = null; opzScelte = {};
    passi.querySelectorAll(".fms-passo").forEach(function (x) { x.classList.add("spento"); });
    configura(gruppo, scelte).then(function (j) { conf = j; disegnaPassi(passi); })
      .catch(function () { passi.insertBefore(h("div", "fms-attesa", "Flyeralarm non risponde: riprova fra un momento"), passi.firstChild); });
  }
  function prezzoBase(pp, n) {
    var corpo = h("div", "corpo", '<div class="fms-attesa">leggo le copie e i prezzi…</div>'); pp.appendChild(corpo);
    fetchJ("/v2/catalog/variants/" + variante.id).then(function (v) {
      var qs = (v && v.quantities) || [];
      variante.data_sheet = v && v.data_sheet; variante.attributes = (v && v.attributes) || [];
      if (!qs.length) { corpo.innerHTML = '<div class="fms-attesa">nessuna quantità disponibile per questa scelta</div>'; return; }
      var tipiSp = []; qs.forEach(function (q) { (q.shippings || []).forEach(function (s) { if (!tipiSp.some(function (x) { return x.type === s.type; })) tipiSp.push({ type: s.type, from: s.from, to: s.to }); }); });
      var spedScelta = (tipiSp.filter(function (x) { return x.type === "Standard"; })[0] || tipiSp[0]).type;
      corpo.innerHTML = "";
      /* prima la consegna (Standard · Express…), poi le copie col prezzo di quella consegna */
      var sped = h("div", "fms-sped"); corpo.appendChild(sped);
      var tab = h("table", "fms-prezzi"); corpo.appendChild(tab);
      corpo.appendChild(h("div", "fms-nota", "il prezzo comprende la consegna scelta · IVA " + (qs[0].vat || 22) + " % a parte · tocca le copie che vuoi"));
      function disegnaTab() {
        sped.innerHTML = "";
        tipiSp.forEach(function (ts) {
          var b = h("button", ts.type === spedScelta ? "on" : "", "<span>" + esc(ts.type) + "</span><small>" + ts.from + "–" + ts.to + " giorni lavorativi</small>"); b.type = "button";
          b.onclick = function () { spedScelta = ts.type; quantita = null; pp.querySelector(".capo span").textContent = "scegli le copie"; document.getElementById("fms-opzioni").classList.add("spento"); document.getElementById("fms-checkout").classList.add("spento"); disegnaTab(); };
          sped.appendChild(b);
        });
        tab.innerHTML = "<tr><th>copie</th><th>prezzo · " + esc(spedScelta) + "</th></tr>";
        qs.forEach(function (q) {
          var s = (q.shippings || []).filter(function (x) { return x.type === spedScelta; })[0]; if (!s) return;
          var tr = document.createElement("tr"); tr.innerHTML = "<td>" + q.quantity + "</td><td>" + eur(s.msrp_price) + "</td>";
          if (quantita && quantita.q.id === q.id) tr.classList.add("on");
          tr.onclick = function () {
            Array.prototype.forEach.call(tab.querySelectorAll("tr"), function (r) { r.classList.remove("on"); }); tr.classList.add("on");
            quantita = { q: q, sp: s, vat: q.vat || 22 };
            pp.querySelector(".capo span").textContent = q.quantity + " copie · " + s.type + " · " + eur(s.msrp_price);
            opzioniPasso(n);
          };
          tab.appendChild(tr);
        });
      }
      disegnaTab();
    }).catch(function () { corpo.innerHTML = '<div class="fms-attesa">Flyeralarm non risponde: riprova fra un momento</div>'; });
  }
  /* 7 · opzioni (verifica del file, contributo per il clima, angoli…) */
  function opzioniPasso(n) {
    var po = document.getElementById("fms-opzioni"), pc = document.getElementById("fms-checkout");
    po.classList.remove("spento"); pc.classList.add("spento"); pc.querySelector(".capo span").textContent = "";
    var old = po.querySelector(".corpo"); if (old) old.remove();
    var corpo = h("div", "corpo", '<div class="fms-attesa">leggo le opzioni…</div>'); po.appendChild(corpo);
    opzScelte = {};
    fetchJ("/v2/catalog/options/variant/" + variante.id + "/amount/" + quantita.q.quantity + "/shipping/" + encodeURIComponent(quantita.sp.type)).then(function (j) {
      opzioni = j || {}; corpo.innerHTML = "";
      /* via il contributo per il clima (Gab, 20:21: «togli contributo finanziario a clima … flyeralarm neanche lo deve sapere») */
      var chiavi = Object.keys(opzioni).filter(function (k) { return !/clima|climate/i.test((opzioni[k] || {}).name || ""); });
      if (!chiavi.length) { corpo.innerHTML = '<div class="fms-nota">nessuna opzione per questo prodotto</div>'; checkout(n); return; }
      chiavi.forEach(function (k) {
        var g = opzioni[k], blocco = h("div", "fms-opz", '<div class="nome">' + esc(g.name) + '</div>');
        var ids = Object.keys(g.options || {});
        ids.forEach(function (oid, i) {
          var o = g.options[oid], lab = h("label", null, '<span><input type="radio" name="opz-' + esc(k) + '" value="' + esc(oid) + '"' + (i === 0 ? " checked" : "") + '>' + esc(o.name) + '</span><span class="pr">' + (Number(o.msrpRawNettoPrice) ? "+ " + eur(o.msrpRawNettoPrice) : "compreso") + '</span>');
          lab.querySelector("input").onchange = function () { opzScelte[k] = oid; var pc = document.getElementById("fms-checkout"); if (!pc.classList.contains("spento")) checkout(n); };
          if (i === 0) opzScelte[k] = oid;
          blocco.appendChild(lab);
        });
        corpo.appendChild(blocco);
      });
      var av = h("button", "fms-avanti", "Avanti → checkout e upload"); av.type = "button"; av.onclick = function () { checkout(n); }; corpo.appendChild(av);
      po.scrollIntoView({ block: "start", behavior: "smooth" });
    }).catch(function () { corpo.innerHTML = '<div class="fms-nota">le opzioni non si sono caricate: si va avanti senza</div>'; opzioni = {}; checkout(n); });
  }
  function descrizione() {
    var parti = [gruppo.n];
    Object.keys(nomiScelti).forEach(function (k) { if (!/^stampa$/i.test(k)) parti.push(nomiScelti[k]); });
    return parti.join(" · ");
  }
  function costoOpzioni() { var s = 0; Object.keys(opzScelte).forEach(function (k) { var o = opzioni[k] && opzioni[k].options && opzioni[k].options[opzScelte[k]]; if (o) s += Number(o.msrpRawNettoPrice) || 0; }); return s; }
  /* 8 · checkout e upload */
  function checkout(n) {
    var pc = document.getElementById("fms-checkout"); pc.classList.remove("spento");
    var old = pc.querySelector(".corpo"); if (old) old.remove();
    var netto = Number(quantita.sp.msrp_price) + costoOpzioni(), iva = Number(quantita.vat), tot = Math.round(netto * (1 + iva / 100) * 100) / 100;
    pc.querySelector(".capo span").textContent = eur(tot);
    var corpo = h("div", "corpo");
    var t = h("div", "fms-tot", '<div class="g">' + eur(tot) + '<small>IVA inclusa</small></div><div class="r">' + esc(descrizione()) + ' · ' + quantita.q.quantity + ' copie<br>' + eur(netto) + ' + IVA ' + iva + ' % · consegna ' + esc(quantita.sp.type) + ' in ' + quantita.sp.from + '–' + quantita.sp.to + ' giorni lavorativi' + (costoOpzioni() ? ' · opzioni ' + eur(costoOpzioni()) : '') + '</div>');
    var indBox = h("div", "fms-file", "<b>Dove va consegnato</b>"); var indSc = h("div"); indBox.appendChild(indSc); t.appendChild(indBox);
    var indirizzo = ""; FMCassa.indirizzi(indSc, function (x) { indirizzo = x; });
    var fileBox = h("div", "fms-file", "<b>Il file di stampa</b> (PDF, fino a 100 MB)" + (variante.data_sheet ? ' · <a href="' + esc(variante.data_sheet) + '" target="_blank" rel="noopener" style="color:var(--oro,#D4AF6A)">le misure del file ›</a>' : ""));
    var inp = document.createElement("input"); inp.type = "file"; inp.accept = "application/pdf,.pdf,application/zip,.zip"; fileBox.appendChild(inp);
    var stato = h("div", "fms-nota", "lo puoi caricare ora o dopo il pagamento: senza il file l'ordine non parte"); fileBox.appendChild(stato);
    t.appendChild(fileBox);
    var paga = h("button", "fms-paga", "Ordina e paga " + eur(tot)); paga.type = "button"; t.appendChild(paga);
    t.appendChild(h("div", "fms-nota", "Pagato, l'ordine lo manda in stampa chi coordina, col tuo file; ti arriva col corriere."));
    corpo.appendChild(t); pc.appendChild(corpo);
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
      if (!indirizzo) { alert("Scegli o aggiungi l'indirizzo di consegna."); return; }
      var opz = Object.keys(opzScelte).map(function (k) { return { gruppo: k, id: opzScelte[k], nome: (opzioni[k].options[opzScelte[k]] || {}).name || "" }; });
      FMCassa.apri({
        azione: "stampa",
        corpo: { gruppo: String(gruppo.id), variante: String(variante.id), quantita_id: String(quantita.q.id), spedizione: quantita.sp.type, opzioni: opz, descrizione: descrizione(), file: file || "", indirizzo: indirizzo },
        titolo: gruppo.n, sotto: "IVA inclusa · consegna " + quantita.sp.type,
        righe: [descrizione(), quantita.q.quantity + " copie", eur(netto) + " + IVA " + iva + " %"].concat(opz.filter(function (o) { return o.nome; }).map(function (o) { return o.nome; })).concat(["consegna a: " + indirizzo, file ? "file caricato" : "file da caricare dopo"]),
        grazie: "Pagato. L'ordine è arrivato a chi coordina" + (file ? ", col tuo file." : ": carica il file appena puoi, oppure mandalo a chi coordina."),
        dopo: function () { paga.disabled = true; paga.textContent = "Pagato"; }
      });
    };
    pc.scrollIntoView({ block: "start", behavior: "smooth" });
  }
  function avvia() {
    box = document.getElementById("fm-stampa"); if (!box) return;
    fam = box.getAttribute("data-famiglia") || "carta"; nomeFam = box.getAttribute("data-nome") || "la famiglia"; css();
    box.innerHTML = '<div class="fms-attesa">leggo il catalogo…</div>';
    fetch("stampa/catalogo.json").then(function (r) { return r.json(); }).then(function (c) { catalogo = c; tipi(); })
      .catch(function () { box.innerHTML = '<div class="fms-attesa">il catalogo non si è caricato: ricarica la pagina</div>'; });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", avvia); else avvia();
})();
