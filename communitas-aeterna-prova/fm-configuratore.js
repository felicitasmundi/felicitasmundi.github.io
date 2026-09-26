/* ═══════════════════════════════════════════════════════════════
   IL CONFIGURATORE DI STAMPA — dentro l'orma dell'Edizione.

   ⛔ IL DISEGNO E LA LOGICA SONO DI DESIGN, presi verbatim da
      `configuratore-stampa.html`. ⭐ Il motore qui sotto legge il
      suo linguaggio: nessuna riga riscritta a mano.

   ⭐ CINQUE PASSI, dentro la stessa orma:
      ① scegliere — formato, carta, copie, e il prezzo che cambia
      ② il file — si carica il PDF, e si controlla prima di ordinare
      ③ la conferma — cosa hai ordinato, quanto, come arriva
      ④ dove siamo — in lavorazione, stampato, partito, consegnato
      ⑤ il corriere — col numero di tracciatura quando c'è

   ⚠️ I VALORI VERI li dà il configuratore di Flyeralarm quando ci
      sarà la chiave: formati, carte, quantità possibili, prezzi.
      ⛔ Le copie non si scrivono: si sceglie fra quelle che si
         possono davvero fare.

   ⚠️ SENZA IL FILE l'ordine si annulla da sé dopo un po': è l'API
      che lo fa, non noi.

   ⭐ E VALE ANCHE FUORI DALL'EDIZIONE: chi entra dalla propria orma
      e tocca «stampa» nella vetrina trova lo stesso configuratore.
      Una forma sola, due porte.

   Espone: SpazioVivo.configuratore(dove, ormaId)
   ═══════════════════════════════════════════════════════════════ */

"use strict";

var CF_CORPO = "<div data-screen-label=\"Dentro l'orma \u00b7 stampa\" style=\"position:relative;isolation:isolate;font-size:16px;min-height:100vh;padding:2rem clamp(1.25rem,5vw,5rem) 4rem;box-sizing:border-box;font-family:'DM Sans',system-ui,sans-serif;color:#F5F0E6;background:radial-gradient(ellipse at 22% 20%,rgba(38,64,120,.5),transparent 58%),radial-gradient(ellipse at 84% 84%,rgba(60,44,110,.42),transparent 60%),radial-gradient(ellipse at 40% 45%,#0a1428 0%,#060c1c 46%,#02040c 100%)\">\n  <ak-cosmo aria-hidden=\"true\" style=\"position:absolute;inset:0;z-index:0;pointer-events:none\"></ak-cosmo>\n  <div style=\"position:relative;z-index:1;max-width:40rem;margin:0 auto;display:flex;flex-direction:column;gap:1.4rem\">\n\n    <!-- la testa dell'orma -->\n    <div style=\"display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap\">\n      <a href=\"la-mia-orma.html\" style=\"min-height:2.75rem;padding:0 .9rem 0 .5rem;border-radius:999px;border:1px solid rgba(212,175,106,.35);background:transparent;color:#D4AF6A;font-family:'Cinzel',serif;font-size:.84rem;letter-spacing:.1em;display:inline-flex;align-items:center;gap:.4rem\" style-hover=\"border-color:#D4AF6A;background:rgba(212,175,106,.08)\"><svg aria-hidden=\"true\" sc-camel-view-box=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"width:1.2rem;height:1.2rem\"><path d=\"M20 12H5\"></path><path d=\"M11 5l-7 7 7 7\"></path></svg>la mia orma</a>\n      <span style=\"font-family:'Cinzel',serif;font-size:.84rem;letter-spacing:.24em;text-transform:uppercase;color:#A6D07E\">Edizione \u00b7 aria</span>\n    </div>\n    <div style=\"display:flex;flex-direction:column;gap:.4rem\">\n      <span style=\"font-family:'Cinzel',serif;font-size:.84rem;letter-spacing:.2em;text-transform:uppercase;color:rgba(245,240,230,.45)\">un\u2019orma \u00b7 {{ stadio }}</span>\n      <h1 style=\"margin:0;font-family:'Cinzel',serif;font-weight:400;font-size:clamp(1.6rem,3vw,2.3rem);line-height:1.15;letter-spacing:.04em;color:#F5F0E6\">[ il titolo dell\u2019orma ]</h1>\n      <span style=\"font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1.2rem;color:rgba(245,240,230,.6)\">stampa \u00b7 {{ famiglia }}</span>\n    </div>\n\n    <!-- i quattro passi -->\n    <div style=\"display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:.4rem\">\n      <sc-for list=\"{{ passi }}\" as=\"s\" hint-placeholder-count=\"4\">\n        <button type=\"button\" sc-camel-on-click=\"{{ s.vai }}\" style=\"min-height:2.75rem;padding:.4rem .3rem;border-radius:.6rem;border:1px solid {{ s.bordo }};background:{{ s.fondo }};color:{{ s.colore }};cursor:pointer;font-family:'Cinzel',serif;font-size:.84rem;letter-spacing:.06em;display:flex;flex-direction:column;align-items:center;gap:.1rem;line-height:1.2\"><span style=\"opacity:.6\">{{ s.n }}</span><span>{{ s.nome }}</span></button>\n      </sc-for>\n    </div>\n\n    <!-- \u2460 scegliere -->\n    <sc-if value=\"{{ passo1 }}\" hint-placeholder-val=\"{{ true }}\">\n      <div style=\"display:flex;flex-direction:column;gap:1.1rem;animation:ak-alza .3s ease both\">\n        <sc-for list=\"{{ scelte }}\" as=\"c\" hint-placeholder-count=\"3\">\n          <div style=\"display:flex;flex-direction:column;gap:.5rem\">\n            <span style=\"font-family:'Cinzel',serif;font-size:.84rem;letter-spacing:.2em;text-transform:uppercase;color:rgba(212,175,106,.8)\">{{ c.nome }}</span>\n            <div style=\"display:flex;flex-wrap:wrap;gap:.4rem\">\n              <sc-for list=\"{{ c.voci }}\" as=\"v\" hint-placeholder-count=\"4\">\n                <button type=\"button\" sc-camel-on-click=\"{{ v.vai }}\" style=\"min-height:2.75rem;padding:0 .9rem;border-radius:999px;border:1px solid {{ v.bordo }};background:{{ v.fondo }};color:{{ v.colore }};cursor:pointer;font-family:'DM Sans',system-ui,sans-serif;font-size:.95rem\" style-hover=\"border-color:rgba(102,153,68,.9)\">{{ v.nome }}</button>\n              </sc-for>\n            </div>\n          </div>\n        </sc-for>\n        <div style=\"font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1.05rem;color:rgba(245,240,230,.45)\">le copie si scelgono fra quelle che si possono davvero fare \u00b7 i valori veri li d\u00e0 il configuratore quando c\u2019\u00e8 la chiave</div>\n        <!-- il prezzo si aggiorna mentre scegli -->\n        <div style=\"display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap;padding:.9rem 1.1rem;border-radius:.9rem;border:1px solid rgba(102,153,68,.4);background:rgba(8,11,26,.55)\">\n          <div style=\"display:flex;flex-direction:column;gap:.15rem\">\n            <span style=\"font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1.05rem;color:rgba(245,240,230,.55)\">{{ riassunto }}</span>\n            <span style=\"font-family:'Cinzel',serif;font-size:1.5rem;color:#F5F0E6\">{{ prezzo }}</span>\n            <span style=\"font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1rem;color:rgba(245,240,230,.45)\">[ IVA e trasporto a parte ]</span>\n          </div>\n          <button type=\"button\" sc-camel-on-click=\"{{ avanti }}\" style=\"min-height:2.75rem;padding:0 1.3rem;border-radius:999px;border:1px solid rgba(102,153,68,.9);background:rgba(102,153,68,.3);color:#F5F0E6;cursor:pointer;font-family:'Cinzel',serif;font-size:.9rem;letter-spacing:.12em;text-transform:uppercase\" style-hover=\"filter:brightness(1.2)\">il file</button>\n        </div>\n      </div>\n    </sc-if>\n\n    <!-- \u2461 il file e il controllo -->\n    <sc-if value=\"{{ passo2 }}\" hint-placeholder-val=\"{{ false }}\">\n      <div style=\"display:flex;flex-direction:column;gap:1rem;animation:ak-alza .3s ease both\">\n        <button type=\"button\" sc-camel-on-click=\"{{ scegliFile }}\" style=\"display:flex;align-items:center;gap:1rem;min-height:5rem;padding:1rem 1.1rem;border-radius:.9rem;border:1px dashed rgba(212,175,106,.45);background:rgba(8,11,26,.4);color:#F5F0E6;cursor:pointer;text-align:left;font:inherit\" style-hover=\"border-color:#D4AF6A;background:rgba(212,175,106,.06)\">\n          <span style=\"flex:none;width:3.2rem;height:3.2rem;border-radius:.55rem;border:1px dashed rgba(212,175,106,.5);display:grid;place-items:center;font-family:'Cinzel',serif;font-size:.84rem;color:#D4AF6A\">PDF</span>\n          <span style=\"display:flex;flex-direction:column;gap:.15rem;min-width:0\">\n            <b style=\"font-family:'Cinzel',serif;font-weight:400;font-size:1rem\">{{ fileNome }}</b>\n            <i style=\"font-family:'Cormorant Garamond',serif;font-size:1.05rem;color:rgba(245,240,230,.5)\">{{ fileSotto }}</i>\n          </span>\n        </button>\n        <!-- i tre stati del controllo -->\n        <div style=\"display:flex;flex-direction:column;gap:.6rem;padding:1rem 1.1rem;border-radius:.9rem;border:1px solid {{ ctrlBordo }};background:rgba(8,11,26,.5)\">\n          <div style=\"display:flex;align-items:center;gap:.6rem\">\n            <span style=\"width:.7rem;height:.7rem;border-radius:50%;background:{{ ctrlPunto }};animation:{{ ctrlAnim }}\"></span>\n            <span style=\"font-family:'Cinzel',serif;font-size:1rem;letter-spacing:.06em;color:{{ ctrlColore }}\">{{ ctrlNome }}</span>\n            <span style=\"margin-left:auto;font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1rem;color:rgba(245,240,230,.45)\">risoluzione \u00b7 margini \u00b7 colori</span>\n          </div>\n          <sc-if value=\"{{ ctrlProblemi }}\" hint-placeholder-val=\"{{ false }}\">\n            <div style=\"display:flex;flex-direction:column;gap:.3rem;padding-left:1.3rem;font-family:'Cormorant Garamond',serif;font-size:1.1rem;line-height:1.45;color:rgba(245,240,230,.8)\">\n              <sc-for list=\"{{ problemi }}\" as=\"p\" hint-placeholder-count=\"2\"><span>\u00b7 {{ p.testo }}</span></sc-for>\n            </div>\n          </sc-if>\n          <div style=\"display:flex;gap:.5rem;flex-wrap:wrap\">\n            <button type=\"button\" sc-camel-on-click=\"{{ controlla }}\" style=\"min-height:2.75rem;padding:0 1rem;border-radius:999px;border:1px solid rgba(212,175,106,.5);background:rgba(212,175,106,.1);color:#F5F0E6;cursor:pointer;font-family:'Cinzel',serif;font-size:.84rem;letter-spacing:.1em\" style-hover=\"border-color:#D4AF6A\">controlla</button>\n            <button type=\"button\" sc-camel-on-click=\"{{ simulaProblemi }}\" style=\"min-height:2.75rem;padding:0 1rem;border-radius:999px;border:1px dashed rgba(245,240,230,.2);background:transparent;color:rgba(245,240,230,.5);cursor:pointer;font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1rem\">prova: ci sono problemi</button>\n          </div>\n        </div>\n        <div style=\"font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1.05rem;color:rgba(245,240,230,.45)\">senza il file l\u2019ordine si annulla da s\u00e9 dopo [ quanto ]</div>\n        <div style=\"display:flex;justify-content:flex-end\">\n          <button type=\"button\" sc-camel-on-click=\"{{ avanti }}\" disabled=\"{{ nonVaBene }}\" style=\"min-height:2.75rem;padding:0 1.3rem;border-radius:999px;border:1px solid rgba(102,153,68,.9);background:rgba(102,153,68,.3);color:#F5F0E6;cursor:pointer;font-family:'Cinzel',serif;font-size:.9rem;letter-spacing:.12em;text-transform:uppercase;opacity:{{ avantiOpacita }}\" style-hover=\"filter:brightness(1.2)\">la conferma</button>\n        </div>\n      </div>\n    </sc-if>\n\n    <!-- \u2462 la conferma -->\n    <sc-if value=\"{{ passo3 }}\" hint-placeholder-val=\"{{ false }}\">\n      <div style=\"display:flex;flex-direction:column;gap:1rem;animation:ak-alza .3s ease both\">\n        <div style=\"display:flex;flex-direction:column;gap:.45rem;padding:1rem 1.1rem;border-radius:.9rem;border:1px solid rgba(212,175,106,.25);background:rgba(8,11,26,.5);font-size:.95rem;color:rgba(245,240,230,.75)\">\n          <div style=\"display:flex;justify-content:space-between;gap:1rem\"><span>cosa</span><span style=\"text-align:right\">{{ riassunto }}</span></div>\n          <div style=\"display:flex;justify-content:space-between;gap:1rem\"><span>il file</span><span>{{ fileNome }}</span></div>\n          <div style=\"display:flex;justify-content:space-between;gap:1rem\"><span>stampa</span><span>{{ prezzo }}</span></div>\n          <div style=\"display:flex;justify-content:space-between;gap:1rem\"><span>trasporto</span><span>{{ consegnaPrezzo }}</span></div>\n          <div style=\"display:flex;justify-content:space-between;gap:1rem;padding-top:.5rem;margin-top:.2rem;border-top:1px solid rgba(212,175,106,.22);font-family:'Cinzel',serif;font-size:1.15rem;color:#F5F0E6\"><span>totale</span><span>[ totale ]</span></div>\n        </div>\n        <div style=\"display:flex;flex-direction:column;gap:.5rem\">\n          <span style=\"font-family:'Cinzel',serif;font-size:.84rem;letter-spacing:.2em;text-transform:uppercase;color:rgba(212,175,106,.8)\">come te lo mandiamo</span>\n          <div style=\"display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,8rem),1fr));gap:.4rem\">\n            <sc-for list=\"{{ consegne }}\" as=\"k\" hint-placeholder-count=\"4\">\n              <button type=\"button\" sc-camel-on-click=\"{{ k.vai }}\" style=\"min-height:3.25rem;padding:.5rem .6rem;border-radius:.7rem;border:1px solid {{ k.bordo }};background:{{ k.fondo }};color:{{ k.colore }};cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:.1rem;font:inherit\" style-hover=\"border-color:rgba(102,153,68,.9)\"><b style=\"font-family:'Cinzel',serif;font-weight:400;font-size:.9rem\">{{ k.nome }}</b><span style=\"font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1rem;opacity:.7\">{{ k.quando }}</span></button>\n            </sc-for>\n          </div>\n        </div>\n        <div style=\"display:flex;flex-direction:column;gap:.5rem\">\n          <span style=\"font-family:'Cinzel',serif;font-size:.84rem;letter-spacing:.2em;text-transform:uppercase;color:rgba(212,175,106,.8)\">dove arriva</span>\n          <input type=\"text\" placeholder=\"[ nome e indirizzo ]\" style=\"width:100%;box-sizing:border-box;min-height:2.75rem;padding:.6rem .9rem;border-radius:.7rem;border:1px solid rgba(212,175,106,.35);background:rgba(8,11,26,.6);color:#F5F0E6;font-family:'DM Sans',system-ui,sans-serif;font-size:1rem;outline:none\" style-focus=\"border-color:#D4AF6A\">\n        </div>\n        <div style=\"display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap\">\n          <span style=\"font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1.1rem;color:rgba(245,240,230,.6)\">arriva {{ consegnaQuando }}</span>\n          <button type=\"button\" sc-camel-on-click=\"{{ ordina }}\" style=\"min-height:3.25rem;padding:0 1.5rem;border-radius:.9rem;border:1px solid #6E9E5A;background:#6E9E5A;color:#0A0C1A;cursor:pointer;font-family:'Cinzel',serif;font-size:.95rem;letter-spacing:.12em;text-transform:uppercase;font-weight:500\" style-hover=\"filter:brightness(1.1)\">stampa</button>\n        </div>\n      </div>\n    </sc-if>\n\n    <!-- \u2463 dove siamo: l'ordine resta dentro l'orma -->\n    <sc-if value=\"{{ passo4 }}\" hint-placeholder-val=\"{{ false }}\">\n      <div style=\"display:flex;flex-direction:column;gap:1rem;animation:ak-alza .3s ease both\">\n        <div style=\"display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:.3rem;align-items:start\">\n          <sc-for list=\"{{ stati }}\" as=\"t\" hint-placeholder-count=\"4\">\n            <div style=\"display:flex;flex-direction:column;align-items:center;gap:.4rem;text-align:center\">\n              <span style=\"width:100%;height:.35rem;border-radius:999px;background:{{ t.barra }}\"></span>\n              <span style=\"font-family:'Cinzel',serif;font-size:.84rem;letter-spacing:.04em;line-height:1.2;color:{{ t.colore }}\">{{ t.nome }}</span>\n              <span style=\"font-family:'Cormorant Garamond',serif;font-style:italic;font-size:.95rem;color:rgba(245,240,230,.4)\">{{ t.quando }}</span>\n            </div>\n          </sc-for>\n        </div>\n        <div style=\"display:flex;flex-direction:column;gap:.45rem;padding:1rem 1.1rem;border-radius:.9rem;border:1px solid rgba(102,153,68,.35);background:rgba(8,11,26,.5);font-size:.95rem;color:rgba(245,240,230,.75)\">\n          <div style=\"display:flex;justify-content:space-between;gap:1rem\"><span>ordine</span><span>[ numero ]</span></div>\n          <div style=\"display:flex;justify-content:space-between;gap:1rem\"><span>cosa</span><span style=\"text-align:right\">{{ riassunto }}</span></div>\n          <div style=\"display:flex;justify-content:space-between;gap:1rem\"><span>consegna</span><span>{{ consegnaNome }} \u00b7 {{ consegnaQuando }}</span></div>\n          <div style=\"display:flex;justify-content:space-between;gap:1rem\"><span>tracciatura</span><span style=\"color:{{ tracciaColore }}\">{{ traccia }}</span></div>\n        </div>\n        <div style=\"display:flex;gap:.5rem;flex-wrap:wrap\">\n          <button type=\"button\" sc-camel-on-click=\"{{ avanzaStato }}\" style=\"min-height:2.75rem;padding:0 1rem;border-radius:999px;border:1px dashed rgba(245,240,230,.2);background:transparent;color:rgba(245,240,230,.5);cursor:pointer;font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1rem\">prova: il passo dopo</button>\n        </div>\n        <div style=\"font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1.05rem;color:rgba(245,240,230,.45)\">l\u2019ordine resta dentro l\u2019orma da cui \u00e8 partito</div>\n      </div>\n    </sc-if>\n\n    <!-- il finale di colonna -->\n    <div style=\"display:flex;align-items:center;gap:.8rem;padding-top:1rem;border-top:1px solid rgba(212,175,106,.22);font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1.05rem;color:rgba(245,240,230,.45)\">\n      <span style=\"font-family:'Cinzel',serif;font-style:normal;font-size:.84rem;letter-spacing:.2em;text-transform:uppercase;color:rgba(212,175,106,.75)\">due porte</span>\n      <span>dall\u2019<a href=\"Stanza Edizione.dc.html\">Edizione</a>, o da \u00abstampa\u00bb nella vetrina della tua orma \u2014 una forma sola</span>\n    </div>\n  </div>\n</div>\n</x-dc>\n";

/* ── il motore che legge il linguaggio di Design ─────────────────
   ⭐ Lo stesso delle stanze: sc-for · sc-if · {{ }} ·
      sc-camel-view-box → viewBox · sc-camel-on-click → il gesto.
   ⛔ Niente eval su dati esterni: si legge solo dall'oggetto che
      renderVals ha appena costruito. */

function cfVal(esp, d){
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
function cfTesto(t, d){
  return String(t).replace(/\{\{([^}]*)\}\}/g, function(_, e){
    var v = cfVal(e, d);
    return (v === undefined || v === null) ? "" : String(v);
  });
}

function cfNodo(n, d, doc, dentroSvg){
  /* il testo */
  if(n.nodeType === 3){
    var t = cfTesto(n.nodeValue, d);
    return t.trim() === "" && n.nodeValue.indexOf("{{") > -1
      ? null : doc.createTextNode(t);
  }
  if(n.nodeType !== 1) return null;
  var tag = n.tagName.toLowerCase();

  /* ⭐ sc-for: ripete il contenuto per ogni voce */
  if(tag === "sc-for"){
    var lista = cfVal((n.getAttribute("list") || "")
      .replace(/[{}]/g, ""), d) || [];
    var nome = n.getAttribute("as") || "v";
    var f = doc.createDocumentFragment();
    lista.forEach(function(voce){
      var d2 = Object.create(d);
      d2[nome] = voce;
      for(var i = 0; i < n.childNodes.length; i++){
        var c = cfNodo(n.childNodes[i], d2, doc, dentroSvg || tag === "svg");
        if(c) f.appendChild(c);
      }
    });
    return f;
  }

  /* ⭐ sc-if: mostra solo se vero */
  if(tag === "sc-if"){
    var v = cfVal((n.getAttribute("value") || "").replace(/[{}]/g, ""), d);
    if(!v) return null;
    var f2 = doc.createDocumentFragment();
    for(var j = 0; j < n.childNodes.length; j++){
      var c2 = cfNodo(n.childNodes[j], d, doc, dentroSvg || tag === "svg");
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
        var f3 = cfVal(val.replace(/[{}]/g, ""), d);
        if(typeof f3 === "function") el.onclick = f3;
        continue;
      }
      el.setAttribute(vero, cfTesto(val, d));
      continue;
    }
    el.setAttribute(nome2, cfTesto(val, d));
  }
  for(var m = 0; m < n.childNodes.length; m++){
    var c4 = cfNodo(n.childNodes[m], d, doc, dentroSvg || tag === "svg");
    if(c4) el.appendChild(c4);
  }
  return el;
}

/* ── la logica di Design, verbatim ──────────────────────────────── */
function CfLogica(){
  /* ⛔ lo stato di partenza è quello di Design */
  this.state = { passo: 0, formato: 0, carta: 0, copie: 1, file: null, ctrl: 'attesa', consegna: 0, stato: 0 };
  this.setState = function(x){
    var n = typeof x === "function" ? x(this.state) : x;
    for(var k in n) this.state[k] = n[k];
    if(this.suDisegna) this.suDisegna();
  };
}
CfLogica.prototype.renderVals = function() {
    const V = '#669944', rgba = (hex, a) => { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };
    const s = this.state;
    const FAM = { carta: 'carta stampata', libri: 'libri e cataloghi', agende: 'agende e calendari', fiere: 'esposizione e fiere', confezioni: 'confezioni e imballaggi', gadget: 'gadget e regali', abiti: 'abbigliamento', servizi: 'i servizi' };
    const famiglia = FAM[s.famiglia] || '[ la famiglia ]';
    // ⚠️ segnaposti: i valori veri li dà il configuratore quando c'è la chiave
    const FORMATI = ['[ A6 ]', '[ A5 ]', '[ A4 ]', '[ A3 ]'];
    const CARTE = ['[ riciclata 120 g ]', '[ naturale 170 g ]', '[ cartoncino 300 g ]'];
    const COPIE = [50, 100, 250, 500, 1000, 2500];   // ⛔ fra quelle possibili, non libere
    const pill = (voci, chiave) => voci.map((n, i) => { const on = s[chiave] === i; return { nome: String(n), vai: () => this.setState({ [chiave]: i }), bordo: on ? rgba(V, .95) : 'rgba(245,240,230,.16)', fondo: on ? rgba(V, .22) : 'rgba(8,11,26,.4)', colore: on ? '#F5F0E6' : 'rgba(245,240,230,.65)' }; });
    const scelte = [{ nome: 'formato', voci: pill(FORMATI, 'formato') }, { nome: 'carta', voci: pill(CARTE, 'carta') }, { nome: 'quante copie', voci: pill(COPIE, 'copie') }];
    const riassunto = `${famiglia} · ${FORMATI[s.formato]} · ${CARTE[s.carta]} · ${COPIE[s.copie]} copie`;
    const prezzo = `[ ${(COPIE[s.copie] * (0.18 + s.formato * 0.12 + s.carta * 0.05)).toFixed(2)} € ]`;

    const PASSI = ['scegli', 'il file', 'la conferma', 'dove siamo'];
    const passi = PASSI.map((n, i) => { const on = s.passo === i, fatto = i < s.passo; return { n: ['①', '②', '③', '④'][i], nome: n, vai: () => { if (i <= s.passo || (i === 3 && s.stato > 0)) this.setState({ passo: i }); }, bordo: on ? rgba(V, .95) : fatto ? rgba(V, .45) : 'rgba(245,240,230,.1)', fondo: on ? rgba(V, .22) : 'rgba(4,8,20,.5)', colore: on ? '#F5F0E6' : fatto ? 'rgba(245,240,230,.75)' : 'rgba(245,240,230,.35)' }; });

    // ② il controllo: attesa · va bene · problemi
    const CTRL = { attesa: ['in attesa', 'rgba(245,240,230,.5)', 'rgba(245,240,230,.4)', 'ak-pulsa 1.6s ease-in-out infinite', 'rgba(245,240,230,.15)'], bene: ['va bene', '#8FBF7A', '#6E9E5A', 'none', 'rgba(110,158,90,.5)'], problemi: ['ci sono problemi', '#E0A0A8', '#C9707A', 'none', 'rgba(201,112,122,.5)'] };
    const c = CTRL[s.ctrl];
    const problemi = s.ctrl === 'problemi' ? [{ testo: '[ risoluzione sotto i 300 dpi ]' }, { testo: '[ margini al vivo mancanti ]' }] : [];

    const CONS = [['standard', '[ in 5 giorni ]', '[ euro ]'], ['espresso', '[ in 3 giorni ]', '[ euro ]'], ['domani', '[ entro domani ]', '[ euro ]'], ['in giornata', '[ oggi ]', '[ euro ]']];
    const consegne = CONS.map(([n, q], i) => { const on = s.consegna === i; return { nome: n, quando: q, vai: () => this.setState({ consegna: i }), bordo: on ? rgba(V, .95) : 'rgba(245,240,230,.14)', fondo: on ? rgba(V, .2) : 'rgba(8,11,26,.4)', colore: on ? '#F5F0E6' : 'rgba(245,240,230,.65)' }; });

    const STATI = ['in lavorazione', 'stampato', 'partito', 'consegnato'];
    const stati = STATI.map((n, i) => ({ nome: n, quando: i <= s.stato ? '[ quando ]' : '', barra: i <= s.stato ? (i === s.stato ? '#8FBF7A' : rgba(V, .8)) : 'rgba(245,240,230,.12)', colore: i <= s.stato ? '#F5F0E6' : 'rgba(245,240,230,.35)' }));

    return {
      famiglia, stadio: s.passo < 3 ? 'in lavorazione' : STATI[s.stato],
      passi, passo1: s.passo === 0, passo2: s.passo === 1, passo3: s.passo === 2, passo4: s.passo === 3,
      scelte, riassunto, prezzo,
      avanti: () => this.setState(t => ({ passo: Math.min(3, t.passo + 1) })),
      fileNome: s.file || '[ carica il PDF ]', fileSotto: s.file ? '[ peso ] · pronto per il controllo' : 'un file solo, in PDF',
      scegliFile: () => this.setState({ file: '[ il-tuo-file.pdf ]', ctrl: 'attesa' }),
      controlla: () => this.setState({ ctrl: s.file ? 'bene' : 'attesa' }),
      simulaProblemi: () => this.setState({ ctrl: 'problemi', file: s.file || '[ il-tuo-file.pdf ]' }),
      ctrlNome: c[0], ctrlColore: c[1], ctrlPunto: c[2], ctrlAnim: c[3], ctrlBordo: c[4], ctrlProblemi: s.ctrl === 'problemi', problemi,
      nonVaBene: s.ctrl !== 'bene', avantiOpacita: s.ctrl === 'bene' ? 1 : .4,
      consegne, consegnaNome: CONS[s.consegna][0], consegnaQuando: CONS[s.consegna][1], consegnaPrezzo: CONS[s.consegna][2],
      ordina: () => this.setState({ passo: 3, stato: 0 }),
      stati, traccia: s.stato >= 2 ? '[ il numero di tracciatura ]' : 'quando c’è', tracciaColore: s.stato >= 2 ? '#F5F0E6' : 'rgba(245,240,230,.4)',
      avanzaStato: () => this.setState(t => ({ stato: Math.min(3, t.stato + 1) }))
    };
  };

var cfBox = null, cfLog = null, cfOrma = null;

function cfDisegna(){
  if(!cfBox || !cfLog) return;
  var d = cfLog.renderVals();
  var tmp = document.createElement("div");
  tmp.innerHTML = CF_CORPO;
  cfBox.innerHTML = "";
  /* \u26d4 la griglia sta sul div di Design, ma dentro il guscio quel
     div perde il posto: la si porta sul nodo che la contiene, cos\u00ec
     le due colonne restano affiancate sul computer e una sopra
     l\u2019altra sul telefono. */
  for(var i = 0; i < tmp.childNodes.length; i++){
    var n = cfNodo(tmp.childNodes[i], d, document);
    if(n) cfBox.appendChild(n);
  }
  /* \u26d4 la griglia sta sul div di Design, ma dentro il guscio quel div
     si ritrova in un contenitore che gliela toglie, e le due colonne
     finiscono una sopra l\u2019altra. Si porta la griglia sul nodo che lo
     contiene e il div dentro sparisce: i suoi figli diventano le
     colonne vere. Sul computer affiancate, sul telefono in fila. */
  var d1 = cfBox.firstElementChild;
  if(d1 && d1.getAttribute && (d1.getAttribute("style") || "").indexOf("grid") > -1){
    cfBox.setAttribute("style", d1.getAttribute("style"));
    while(d1.firstChild) cfBox.appendChild(d1.firstChild);
    cfBox.removeChild(d1);
  }
}

/* ⭐ il file va in Supabase Storage, come gli altri allegati
   dell'orma: bucket riservato, percorso <orma_id>/<nome>. */
async function cfCarica(f){
  if(!cfOrma || !f) return;
  try{
    var su = await db.storage.from("riservato")
      .upload(cfOrma + "/" + f.name, f);
    if(su.error) throw su.error;
    await db.from("orma_file").insert({
      orma_id: cfOrma, nome: f.name, tipo: f.type,
      indirizzo: cfOrma + "/" + f.name
    });
  }catch(e){ console.warn("configuratore:", e); }
}

async function configuratore(dove, ormaId){
  var box = typeof dove === "string" ? document.querySelector(dove) : dove;
  if(!box) return;
  cfBox = box; cfOrma = ormaId || null;
  cfLog = new CfLogica();
  cfLog.suDisegna = cfDisegna;
  cfLog.carica = cfCarica;
  cfDisegna();
}

window.SpazioVivo = window.SpazioVivo || {};
window.SpazioVivo.configuratore = configuratore;
