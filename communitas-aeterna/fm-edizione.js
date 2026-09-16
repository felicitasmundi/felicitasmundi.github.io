/* ═══════════════════════════════════════════════════════════════
   L'EDIZIONE — la stanza dell'aria.

   ⛔ IL DISEGNO E LA LOGICA SONO DI DESIGN, presi verbatim da
      `stanza-edizione.html`. ⭐ Il motore qui sotto legge il suo
      linguaggio: nessuna riga riscritta, nessun bagliore perso.

   ⭐ È LA PAGINA ESTERNA: chi entra e non sa come funziona un'orma
      tocca una famiglia, e da lì nasce l'orma. Il configuratore —
      formato, carta, copie, il file, l'ordine, il corriere — sta
      dentro l'orma, non qui.

   ⚠️ I valori veri dei formati e delle carte li dà il configuratore
      di Flyeralarm quando ci sarà la chiave.

   Espone: SpazioVivo.edizione(dove)
   ═══════════════════════════════════════════════════════════════ */

"use strict";

var ED_CORPO = "<div data-screen-label=\"L'Edizione\" style=\"position:relative;isolation:isolate;font-size:16px;min-height:100vh;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,24rem),1fr));align-items:start;gap:2rem 3rem;padding:2rem clamp(1.25rem,5vw,5rem);box-sizing:border-box;font-family:'DM Sans',system-ui,sans-serif;color:#F5F0E6;background:radial-gradient(ellipse at 22% 20%,rgba(38,64,120,.5),transparent 58%),radial-gradient(ellipse at 84% 84%,rgba(60,44,110,.42),transparent 60%),radial-gradient(ellipse at 40% 45%,#0a1428 0%,#060c1c 46%,#02040c 100%)\">\n  <ak-cosmo aria-hidden=\"true\" style=\"position:absolute;inset:0;z-index:0;pointer-events:none\"></ak-cosmo>\n  <div aria-hidden=\"true\" style=\"position:absolute;inset:0;z-index:0;pointer-events:none;background:radial-gradient(ellipse 55% 70% at 50% 50%,rgba(2,4,12,.55),transparent 100%)\"></div>\n\n  <!-- sinistra: il giorno, il cubo coll'icosaedro, l'invito -->\n  <div style=\"position:sticky;top:2rem;z-index:1;display:grid;grid-template-columns:minmax(0,1fr);justify-items:center;gap:1.2rem;width:100%;justify-self:center\">\n    <div style=\"display:flex;gap:.55rem;width:100%;max-width:24rem\">\n      <div style=\"flex:1;border:1px solid rgba(184,150,62,.22);border-radius:.75rem;background:rgba(8,11,26,.4);padding:.65rem .5rem;text-align:center\">\n        <b style=\"display:block;font-family:'Cinzel',serif;font-weight:400;font-size:1rem;line-height:1.2;color:#D4AF6A\">[ giorno ]</b>\n        <span style=\"display:block;font-size:.84rem;color:rgba(245,240,230,.45);margin-top:.25rem\">[ mese ]</span>\n      </div>\n      <div style=\"flex:1;border:1px solid rgba(184,150,62,.22);border-radius:.75rem;background:rgba(8,11,26,.4);padding:.65rem .5rem;text-align:center\">\n        <b style=\"display:block;font-family:'Cinzel',serif;font-weight:400;font-size:1.4rem;line-height:1.2;color:#D4AF6A\">\ud83c\udf11</b>\n        <span style=\"display:block;font-size:.84rem;color:rgba(245,240,230,.45);margin-top:.25rem\">[ la luna ]</span>\n      </div>\n      <div style=\"flex:1;border:1px solid rgba(184,150,62,.22);border-radius:.75rem;background:rgba(8,11,26,.4);padding:.65rem .5rem;text-align:center\">\n        <b style=\"display:block;font-family:'Cinzel',serif;font-weight:400;font-size:1rem;line-height:1.2;color:#D4AF6A\">[ il santo ]</b>\n        <span style=\"display:block;font-size:.84rem;color:rgba(245,240,230,.45);margin-top:.25rem\">il santo</span>\n      </div>\n    </div>\n\n    <div style=\"position:relative;width:100%;max-width:min(24rem,58vh);aspect-ratio:1\">\n      <div style=\"position:absolute;inset:8%;pointer-events:none;background:radial-gradient(circle at 50% 50%,rgba(102,153,68,.18),transparent 70%)\"></div>\n      <svg sc-camel-view-box=\"-128 -128 256 256\" aria-hidden=\"true\" style=\"position:absolute;inset:0;width:100%;height:100%;overflow:visible\">\n        <g fill=\"none\" stroke=\"#D4AF6A\" stroke-linejoin=\"round\">\n          <g stroke-width=\".7\" opacity=\".34\">\n            <sc-for list=\"{{ linee }}\" as=\"l\" hint-placeholder-count=\"0\"><line x1=\"{{ l.x1 }}\" y1=\"{{ l.y1 }}\" x2=\"{{ l.x2 }}\" y2=\"{{ l.y2 }}\"></line></sc-for>\n          </g>\n          <g stroke-width=\"1\" opacity=\".3\" stroke=\"#C9A6E0\">\n            <sc-for list=\"{{ centri }}\" as=\"c\" hint-placeholder-count=\"0\"><circle cx=\"{{ c.x }}\" cy=\"{{ c.y }}\" r=\"23\"></circle></sc-for>\n          </g>\n          <circle r=\"115\" stroke-width=\"1\" opacity=\".5\"></circle>\n          <rect x=\"-115\" y=\"-115\" width=\"230\" height=\"230\" stroke-width=\".8\" stroke-dasharray=\"3 3.6\" opacity=\".34\"></rect>\n        </g>\n      </svg>\n      <ak-solido tipo=\"ottaedro\" colore=\"#669944\" aria-hidden=\"true\"></ak-solido>\n    </div>\n    <div style=\"font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1.15rem;color:#A6D07E;text-align:center;margin-top:-.4rem\">ottaedro \u00b7 aria</div>\n\n    <div style=\"display:flex;justify-content:center;width:100%;max-width:24rem\">\n      <a href=\"invito.html\" style=\"min-height:3.5rem;min-width:16rem;padding:.7rem 1rem;border-radius:.9rem;border:1px solid rgba(212,175,106,.45);background:rgba(8,11,26,.5);color:#F5F0E6;text-decoration:none;font-family:'Cinzel',serif;font-size:.95rem;letter-spacing:.1em;line-height:1.3;display:flex;align-items:center;justify-content:space-between;gap:.6rem;transition:border-color .3s,background .3s\" style-hover=\"border-color:#D4AF6A;background:rgba(212,175,106,.1)\">\n        <span>invita chi risuona</span>\n        <svg aria-hidden=\"true\" sc-camel-view-box=\"0 0 24 24\" fill=\"none\" stroke=\"#D4AF6A\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"flex:none;width:1.5rem;height:1.5rem\"><path d=\"M4 12h15\"></path><path d=\"M13 5l7 7-7 7\"></path></svg>\n      </a>\n    </div>\n  </div>\n\n  <!-- destra: l'Edizione \u2014 le famiglie della stampa -->\n  <div style=\"position:relative;z-index:1;display:flex;flex-direction:column;gap:1.3rem;max-width:34rem;width:100%;min-width:0;justify-self:start\">\n    <div style=\"display:flex;flex-wrap:wrap;align-items:baseline;gap:.4rem 1.4rem\">\n      <h1 style=\"margin:0;font-family:'Cinzel',serif;font-weight:400;font-size:clamp(2rem,3.6vw,2.9rem);line-height:1.1;letter-spacing:.06em;color:#F5F0E6\">L\u2019Edizione</h1>\n      <div style=\"font-family:'Cinzel',serif;font-size:.84rem;letter-spacing:.28em;text-transform:uppercase;color:#A6D07E\">aria</div>\n    </div>\n    <div style=\"font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1.3rem;line-height:1.45;color:rgba(245,240,230,.8);text-wrap:pretty\">quello che fai, stampato e portato dove serve</div>\n\n    <div style=\"display:flex;align-items:center;gap:.7rem\">\n      <span style=\"font-family:'Cinzel',serif;font-size:.84rem;letter-spacing:.2em;text-transform:uppercase;color:rgba(212,175,106,.85);white-space:nowrap\">stampa</span>\n      <span style=\"flex:1;height:1px;background:rgba(212,175,106,.25)\"></span>\n      <span style=\"font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1rem;color:rgba(245,240,230,.45)\">e ti arriva a casa</span>\n    </div>\n    <div style=\"font-family:'Cormorant Garamond',serif;font-size:1.15rem;line-height:1.5;color:rgba(245,240,230,.75);text-wrap:pretty;margin-top:-.6rem\">Oltre alla stampa proponiamo supporti per l\u2019esposizione fieristica e altri prodotti utili alla comunicazione. Scegli la famiglia, poi il formato, la carta e quante copie.</div>\n\n    <!-- le otto famiglie: si toccano, aprono la propria pagina -->\n    <div style=\"display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,13rem),1fr));gap:.7rem\">\n      <a href=\"#\" style=\"position:relative;display:flex;flex-direction:column;gap:.35rem;min-height:5.5rem;padding:1rem 1rem .9rem;border-radius:.9rem;border:1px solid #66994455;border-left:3px solid #669944;background:#66994412;color:inherit;text-decoration:none;transition:border-color .3s,background .3s\" style-hover=\"border-color:#669944;background:#66994422\">\n        <b style=\"font-family:'Cinzel',serif;font-weight:400;font-size:1rem;line-height:1.3;color:#F5F0E6\">Carta stampata</b>\n        <span style=\"font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1.05rem;line-height:1.4;color:rgba(245,240,230,.65)\">volantini, manifesti, locandine, biglietti da visita, cartelline, adesivi</span>\n      </a>\n      <a href=\"#\" style=\"position:relative;display:flex;flex-direction:column;gap:.35rem;min-height:5.5rem;padding:1rem 1rem .9rem;border-radius:.9rem;border:1px solid #66994455;border-left:3px solid #669944;background:#66994412;color:inherit;text-decoration:none;transition:border-color .3s,background .3s\" style-hover=\"border-color:#669944;background:#66994422\">\n        <b style=\"font-family:'Cinzel',serif;font-weight:400;font-size:1rem;line-height:1.3;color:#F5F0E6\">Libri e cataloghi</b>\n        <span style=\"font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1.05rem;line-height:1.4;color:rgba(245,240,230,.65)\">libri, riviste, cataloghi, fascicoli</span>\n      </a>\n      <a href=\"#\" style=\"position:relative;display:flex;flex-direction:column;gap:.35rem;min-height:5.5rem;padding:1rem 1rem .9rem;border-radius:.9rem;border:1px solid #AA884455;border-left:3px solid #AA8844;background:#AA884412;color:inherit;text-decoration:none;transition:border-color .3s,background .3s\" style-hover=\"border-color:#AA8844;background:#AA884422\">\n        <b style=\"font-family:'Cinzel',serif;font-weight:400;font-size:1rem;line-height:1.3;color:#F5F0E6\">Agende e calendari</b>\n        <span style=\"font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1.05rem;line-height:1.4;color:rgba(245,240,230,.65)\">agende, calendari, quaderni e taccuini</span>\n      </a>\n      <a href=\"#\" style=\"position:relative;display:flex;flex-direction:column;gap:.35rem;min-height:5.5rem;padding:1rem 1rem .9rem;border-radius:.9rem;border:1px solid #CC664455;border-left:3px solid #CC6644;background:#CC664412;color:inherit;text-decoration:none;transition:border-color .3s,background .3s\" style-hover=\"border-color:#CC6644;background:#CC664422\">\n        <b style=\"font-family:'Cinzel',serif;font-weight:400;font-size:1rem;line-height:1.3;color:#F5F0E6\">Esposizione e fiere</b>\n        <span style=\"font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1.05rem;line-height:1.4;color:rgba(245,240,230,.65)\">totem, roll-up, striscioni, stand, insegne, pellicole per vetrine</span>\n      </a>\n      <a href=\"#\" style=\"position:relative;display:flex;flex-direction:column;gap:.35rem;min-height:5.5rem;padding:1rem 1rem .9rem;border-radius:.9rem;border:1px solid #AA884455;border-left:3px solid #AA8844;background:#AA884412;color:inherit;text-decoration:none;transition:border-color .3s,background .3s\" style-hover=\"border-color:#AA8844;background:#AA884422\">\n        <b style=\"font-family:'Cinzel',serif;font-weight:400;font-size:1rem;line-height:1.3;color:#F5F0E6\">Confezioni e imballaggi</b>\n        <span style=\"font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1.05rem;line-height:1.4;color:rgba(245,240,230,.65)\">shopper, imballaggi, bicchieri, tovaglioli, confezioni regalo</span>\n      </a>\n      <a href=\"#\" style=\"position:relative;display:flex;flex-direction:column;gap:.35rem;min-height:5.5rem;padding:1rem 1rem .9rem;border-radius:.9rem;border:1px solid #4488BB55;border-left:3px solid #4488BB;background:#4488BB12;color:inherit;text-decoration:none;transition:border-color .3s,background .3s\" style-hover=\"border-color:#4488BB;background:#4488BB22\">\n        <b style=\"font-family:'Cinzel',serif;font-weight:400;font-size:1rem;line-height:1.3;color:#F5F0E6\">Gadget e regali</b>\n        <span style=\"font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1.05rem;line-height:1.4;color:rgba(245,240,230,.65)\">penne, cordini, portabadge, borse, borracce</span>\n      </a>\n      <a href=\"#\" style=\"position:relative;display:flex;flex-direction:column;gap:.35rem;min-height:5.5rem;padding:1rem 1rem .9rem;border-radius:.9rem;border:1px solid #4488BB55;border-left:3px solid #4488BB;background:#4488BB12;color:inherit;text-decoration:none;transition:border-color .3s,background .3s\" style-hover=\"border-color:#4488BB;background:#4488BB22\">\n        <b style=\"font-family:'Cinzel',serif;font-weight:400;font-size:1rem;line-height:1.3;color:#F5F0E6\">Abbigliamento</b>\n        <span style=\"font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1.05rem;line-height:1.4;color:rgba(245,240,230,.65)\">magliette, felpe, tessuti personalizzati</span>\n      </a>\n      <a href=\"#\" style=\"position:relative;display:flex;flex-direction:column;gap:.35rem;min-height:5.5rem;padding:1rem 1rem .9rem;border-radius:.9rem;border:1px solid #B8733355;border-left:3px solid #B87333;background:#B8733312;color:inherit;text-decoration:none;transition:border-color .3s,background .3s\" style-hover=\"border-color:#B87333;background:#B8733322\">\n        <b style=\"font-family:'Cinzel',serif;font-weight:400;font-size:1rem;line-height:1.3;color:#F5F0E6\">I servizi</b>\n        <span style=\"font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1.05rem;line-height:1.4;color:rgba(245,240,230,.65)\">stampa a impatto climatico zero, campionario carta</span>\n      </a>\n    </div>\n\n    <!-- la carta che scegliamo -->\n    <div style=\"display:flex;flex-direction:column;gap:.5rem;padding:1.1rem 1.2rem;border-radius:.9rem;border:1px solid rgba(110,158,90,.5);background:rgba(110,158,90,.09)\">\n      <b style=\"font-family:'Cinzel',serif;font-weight:400;font-size:1rem;color:#8FBF7A\">La carta che scegliamo</b>\n      <p style=\"margin:0;font-family:'Cormorant Garamond',serif;font-size:1.15rem;line-height:1.55;color:rgba(245,240,230,.8);text-wrap:pretty\">Cerchiamo materiali naturali: volantini in carta riciclata o naturale, riciclabili al 100%. Manifesti su cartoncino con oltre il 90% di fibre di legno riciclate. Bicchieri, tovaglioli e confezioni per alimenti biodegradabili, che si smaltiscono nell\u2019organico.</p>\n      <p style=\"margin:0;font-family:'Cormorant Garamond',serif;font-size:1.15rem;line-height:1.55;color:rgba(245,240,230,.8);text-wrap:pretty\">E dove si pu\u00f2, la stampa a impatto climatico zero: un piccolo sovrapprezzo che va in progetti di protezione del clima certificati.</p>\n      <div style=\"margin-top:.4rem;padding-top:.6rem;border-top:1px solid rgba(110,158,90,.24);font-size:.95rem;color:rgba(245,240,230,.7)\">Il campionario della carta \u00e8 [ in attesa ].</div>\n    </div>\n  </div>\n</div>\n\n</x-dc>\n";

/* ── il motore che legge il linguaggio di Design ─────────────
   ⭐ Lo stesso dell’Emporio: sc-for · sc-if · {{ }} ·
      sc-camel-view-box → viewBox · sc-camel-on-click → il gesto.
   ⛔ Niente eval su dati esterni: si legge solo dall’oggetto che
      renderVals ha appena costruito. */

function edVal(esp, d){
  esp = String(esp).trim();
  if(esp === "true") return true;
  if(esp === "false") return false;
  if(/^-?[\d.]+$/.test(esp)) return Number(esp);
  var neg = false;
  if(esp.charAt(0) === "!"){ neg = true; esp = esp.slice(1).trim(); }
  var v = d, pezzi = esp.split(".");
  for(var i = 0; i < pezzi.length; i++){
    if(v === null || v === undefined) return neg ? true : undefined;
    v = v[pezzi[i]];
  }
  return neg ? !v : v;
}
function edTesto(t, d){
  return String(t).replace(/\{\{([^}]*)\}\}/g, function(_, e){
    var v = edVal(e, d);
    return (v === undefined || v === null) ? "" : String(v);
  });
}

function edNodo(n, d, doc, dentroSvg){
  /* il testo */
  if(n.nodeType === 3){
    var t = edTesto(n.nodeValue, d);
    return t.trim() === "" && n.nodeValue.indexOf("{{") > -1
      ? null : doc.createTextNode(t);
  }
  if(n.nodeType !== 1) return null;
  var tag = n.tagName.toLowerCase();

  /* ⭐ sc-for: ripete il contenuto per ogni voce */
  if(tag === "sc-for"){
    var lista = edVal((n.getAttribute("list") || "")
      .replace(/[{}]/g, ""), d) || [];
    var nome = n.getAttribute("as") || "v";
    var f = doc.createDocumentFragment();
    lista.forEach(function(voce){
      var d2 = Object.create(d);
      d2[nome] = voce;
      for(var i = 0; i < n.childNodes.length; i++){
        var c = edNodo(n.childNodes[i], d2, doc, dentroSvg || tag === "svg");
        if(c) f.appendChild(c);
      }
    });
    return f;
  }

  /* ⭐ sc-if: mostra solo se vero */
  if(tag === "sc-if"){
    var v = edVal((n.getAttribute("value") || "").replace(/[{}]/g, ""), d);
    if(!v) return null;
    var f2 = doc.createDocumentFragment();
    for(var j = 0; j < n.childNodes.length; j++){
      var c2 = edNodo(n.childNodes[j], d, doc, dentroSvg || tag === "svg");
      if(c2) f2.appendChild(c2);
    }
    return f2;
  }

  /* un nodo vero */
  /* \u2b50 dentro un <svg> TUTTO \u00e8 SVG: un <symbol> o un <image>
     creati come HTML non si disegnano mai. */
  var el = (dentroSvg || tag === "svg" ||
            n.namespaceURI === "http://www.w3.org/2000/svg" ||
            ["svg","g","line","circle","path","rect","text","polygon",
             "polyline","ellipse","defs","use","clipPath","symbol","image",
             "marker","pattern","mask","filter","linearGradient",
             "radialGradient","stop","tspan","textPath","foreignObject",
             "animate","animateTransform","desc","title","switch","view",
             "feGaussianBlur","feOffset","feMerge","feMergeNode","feBlend",
             "feColorMatrix","feFlood","feComposite"].indexOf(tag) > -1)
    ? doc.createElementNS("http://www.w3.org/2000/svg", tag)
    : doc.createElement(tag);

  for(var k = 0; k < n.attributes.length; k++){
    var a = n.attributes[k], nome2 = a.name, val = a.value;
    if(nome2.indexOf("hint-") === 0) continue;
    /* ⭐ sc-camel-view-box → viewBox */
    if(nome2.indexOf("sc-camel-") === 0){
      var vero = nome2.slice(9).replace(/-([a-z])/g, function(_, c3){
        return c3.toUpperCase();
      });
      if(vero === "onClick"){
        var f3 = edVal(val.replace(/[{}]/g, ""), d);
        if(typeof f3 === "function") el.onclick = f3;
        continue;
      }
      el.setAttribute(vero, edTesto(val, d));
      continue;
    }
    el.setAttribute(nome2, edTesto(val, d));
  }
  for(var m = 0; m < n.childNodes.length; m++){
    var c4 = edNodo(n.childNodes[m], d, doc, dentroSvg || tag === "svg");
    if(c4) el.appendChild(c4);
  }
  return el;
}

/* ── la logica di Design, verbatim ───────────────────────── */
function EdLogica(){
  this.state = { scaffale: null, aperto: null, ruolo: "guarda", chiuse: {} };
  this.setState = function(x){
    var n = typeof x === "function" ? x(this.state) : x;
    for(var k in n) this.state[k] = n[k];
    if(this.suDisegna) this.suDisegna();
  };
}
EdLogica.prototype.renderVals = function() {
    const d = 46, N = v => Math.round(v * 100) / 100;
    const C = [[0, 0]];
    for (let k = 0; k < 6; k++) { const a = (-90 + k * 60) * Math.PI / 180; C.push([N(d * Math.cos(a)), N(d * Math.sin(a))]); }
    for (let k = 0; k < 6; k++) { const a = (-90 + k * 60) * Math.PI / 180; C.push([N(2 * d * Math.cos(a)), N(2 * d * Math.sin(a))]); }
    const linee = [];
    for (let i = 0; i < C.length; i++) for (let j = i + 1; j < C.length; j++) linee.push({ x1: C[i][0], y1: C[i][1], x2: C[j][0], y2: C[j][1] });
    return { linee, centri: C.map(q => ({ x: q[0], y: q[1] })) };
  };

/* ── le opere pubblicate, dal database ───────────────────────────
   ⚠️ `opere` ha quattro stati: in_lavorazione · in_cura · pronta ·
      pubblicata. Solo l'ultimo si vede. */
async function edLeggi(){
  var fuori = [];
  try{
    var r = await db.from("opere")
      .select("id,titolo,genere,persona_id,creata_il")
      .eq("stato", "pubblicata").order("creata_il");
    if(!r.error) (r.data || []).forEach(function(o){
      fuori.push({ g: 1, cat: o.genere || "", titolo: o.titolo || "",
                   chi: "", dove: "", prezzo: "", pratica: false, piene: [] });
    });
  }catch(e){ console.warn("edizione:", e); }
  return fuori;
}

var edBox = null, edLog = null;

function edDisegna(){
  if(!edBox || !edLog) return;
  var d = edLog.renderVals();
  var tmp = document.createElement("div");
  tmp.innerHTML = ED_CORPO;
  edBox.innerHTML = "";
  /* \u26d4 la griglia sta sul div di Design, ma dentro il guscio quel
     div perde il posto: la si porta sul nodo che la contiene, cos\u00ec
     le due colonne restano affiancate sul computer e una sopra
     l\u2019altra sul telefono. */
  for(var i = 0; i < tmp.childNodes.length; i++){
    var n = edNodo(tmp.childNodes[i], d, document);
    if(n) edBox.appendChild(n);
  }
  /* \u26d4 la griglia sta sul div di Design, ma dentro il guscio quel div
     si ritrova in un contenitore che gliela toglie, e le due colonne
     finiscono una sopra l\u2019altra. Si porta la griglia sul nodo che lo
     contiene e il div dentro sparisce: i suoi figli diventano le
     colonne vere. Sul computer affiancate, sul telefono in fila. */
  var d1 = edBox.firstElementChild;
  if(d1 && d1.getAttribute && (d1.getAttribute("style") || "").indexOf("grid") > -1){
    edBox.setAttribute("style", d1.getAttribute("style"));
    while(d1.firstChild) edBox.appendChild(d1.firstChild);
    edBox.removeChild(d1);
  }
}

async function edizione(dove){
  var box = typeof dove === "string" ? document.querySelector(dove) : dove;
  if(!box) return;
  edBox = box;
  edLog = new EdLogica();
  edLog.suDisegna = edDisegna;
  edDisegna();
  var veri = await edLeggi();
  if(veri.length){ edLog.daiDatabase = veri; edDisegna(); }
}

window.SpazioVivo = window.SpazioVivo || {};
window.SpazioVivo.edizione = edizione;
