/* ═══════════════════════════════════════════════════════════════
   L'EVENTO PUBBLICO — quello che vede chi riceve il collegamento.

   ⛔ IL DISEGNO E LA LOGICA SONO DI DESIGN, presi verbatim da
      `evento-pubblico.html`. ⭐ Il motore qui sotto legge il suo
      linguaggio: nessuna riga riscritta a mano.

   ⭐ CHI LA APRE NON HA UN ACCOUNT, e la vede lo stesso. È la porta
      per chi arriva da fuori: oggi nessuno arriva alla cieca — si
      viene da un invito o da un evento, e quello è già il racconto.

   ⭐ «CI SARÒ» porta dentro l'orma dell'evento. Chi ha l'account
      entra subito; chi non ce l'ha passa dal Nexus e torna qui.

   ⛔ E dentro NON c'è la vetrina: l'orma non è sua. Chi entra trova
      i karma yoga, cosa serve, le novità della squadra e la
      conversazione — non un posto dove pubblicare un prodotto suo.

   ⭐ «INVITA CHI RISUONA» qui invita a QUESTO evento: il
      collegamento porta lo slug di chi invita e l'id dell'evento,
      così chi arriva entra col tuo nome e su questa festa.

   Espone: SpazioVivo.evento(dove, id)
   ═══════════════════════════════════════════════════════════════ */

"use strict";

var EV_CORPO = "<div data-screen-label=\"Evento pubblico\" style=\"position:relative;isolation:isolate;font-size:16px;min-height:100vh;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,24rem),1fr));align-items:start;gap:2rem 3rem;padding:2rem clamp(1.25rem,5vw,5rem) 4rem;box-sizing:border-box;font-family:'DM Sans',system-ui,sans-serif;color:#F5F0E6;background:radial-gradient(ellipse at 22% 20%,rgba(38,64,120,.5),transparent 58%),radial-gradient(ellipse at 84% 84%,rgba(60,44,110,.42),transparent 60%),radial-gradient(ellipse at 40% 45%,#0a1428 0%,#060c1c 46%,#02040c 100%)\">\n  <ak-cosmo aria-hidden=\"true\" style=\"position:absolute;inset:0;z-index:0;pointer-events:none\"></ak-cosmo>\n  <div aria-hidden=\"true\" style=\"position:absolute;inset:0;z-index:0;pointer-events:none;background:radial-gradient(ellipse 55% 70% at 50% 50%,rgba(2,4,12,.55),transparent 100%)\"></div>\n\n  <!-- sinistra: il cubo col solido terra -->\n  <div style=\"position:sticky;top:2rem;z-index:1;display:grid;grid-template-columns:minmax(0,1fr);justify-items:center;gap:1.2rem;width:100%;justify-self:center\">\n    <div style=\"position:relative;width:100%;max-width:min(24rem,58vh);aspect-ratio:1\">\n      <div style=\"position:absolute;inset:8%;pointer-events:none;background:radial-gradient(circle at 50% 50%,rgba(170,136,68,.18),transparent 70%)\"></div>\n      <svg sc-camel-view-box=\"-128 -128 256 256\" aria-hidden=\"true\" style=\"position:absolute;inset:0;width:100%;height:100%;overflow:visible\">\n        <g fill=\"none\" stroke=\"#D4AF6A\" stroke-linejoin=\"round\">\n          <g stroke-width=\".7\" opacity=\".34\">\n            <sc-for list=\"{{ linee }}\" as=\"l\" hint-placeholder-count=\"0\"><line x1=\"{{ l.x1 }}\" y1=\"{{ l.y1 }}\" x2=\"{{ l.x2 }}\" y2=\"{{ l.y2 }}\"></line></sc-for>\n          </g>\n          <g stroke-width=\"1\" opacity=\".3\" stroke=\"#C9A6E0\">\n            <sc-for list=\"{{ centri }}\" as=\"c\" hint-placeholder-count=\"0\"><circle cx=\"{{ c.x }}\" cy=\"{{ c.y }}\" r=\"23\"></circle></sc-for>\n          </g>\n          <circle r=\"115\" stroke-width=\"1\" opacity=\".5\"></circle>\n          <rect x=\"-115\" y=\"-115\" width=\"230\" height=\"230\" stroke-width=\".8\" stroke-dasharray=\"3 3.6\" opacity=\".34\"></rect>\n        </g>\n      </svg>\n      <ak-solido tipo=\"cubo\" colore=\"#AA8844\" aria-hidden=\"true\"></ak-solido>\n    </div>\n    <div style=\"font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1.15rem;color:rgba(170,136,68,.95);filter:brightness(1.25);text-align:center;margin-top:-.4rem\">cubo \u00b7 terra \u00b7 i Vicinati</div>\n    <div style=\"display:flex;justify-content:center;width:100%;max-width:24rem\">\n      <a href=\"invito.html\" style=\"min-height:3.5rem;min-width:16rem;padding:.7rem 1rem;border-radius:.9rem;border:1px solid rgba(212,175,106,.45);background:rgba(8,11,26,.5);color:#F5F0E6;font-family:'Cinzel',serif;font-size:.95rem;letter-spacing:.1em;line-height:1.3;display:flex;align-items:center;justify-content:space-between;gap:.6rem;transition:border-color .3s,background .3s\" style-hover=\"border-color:#D4AF6A;background:rgba(212,175,106,.1)\">\n        <span>invita chi risuona</span>\n        <svg aria-hidden=\"true\" sc-camel-view-box=\"0 0 24 24\" fill=\"none\" stroke=\"#D4AF6A\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"flex:none;width:1.5rem;height:1.5rem\"><path d=\"M4 12h15\"></path><path d=\"M13 5l7 7-7 7\"></path></svg>\n      </a>\n    </div>\n  </div>\n\n  <!-- destra: l'evento -->\n  <div style=\"position:relative;z-index:1;display:flex;flex-direction:column;gap:1.3rem;max-width:34rem;width:100%;min-width:0;justify-self:start\">\n    <!-- \u2460 cosa si vede -->\n    <div style=\"aspect-ratio:16/9;border-radius:.9rem;background:linear-gradient(135deg,rgba(170,136,68,.3),rgba(8,11,26,.6));border:1px solid rgba(245,240,230,.1);display:grid;place-items:center;font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1rem;color:rgba(245,240,230,.4)\">[ la foto ]</div>\n    <div style=\"display:flex;flex-direction:column;gap:.5rem\">\n      <span style=\"font-family:'Cinzel',serif;font-size:.84rem;letter-spacing:.24em;text-transform:uppercase;color:rgba(170,136,68,.95);filter:brightness(1.25)\">festa \u00b7 i Vicinati</span>\n      <h1 style=\"margin:0;font-family:'Cinzel',serif;font-weight:400;font-size:clamp(1.8rem,3.2vw,2.6rem);line-height:1.12;letter-spacing:.04em;color:#F5F0E6;text-wrap:pretty\">[ il titolo dell\u2019evento ]</h1>\n      <div style=\"display:flex;flex-wrap:wrap;gap:.3rem 1.2rem;font-size:1rem;color:rgba(245,240,230,.75)\">\n        <span>[ quando ]</span>\n        <span>[ dove ]</span>\n      </div>\n      <div style=\"display:flex;align-items:center;gap:.6rem;font-size:.95rem;color:rgba(245,240,230,.7)\">\n        <span style=\"width:2rem;height:2rem;border-radius:50%;border:1px solid rgba(212,175,106,.6);background:rgba(212,175,106,.12);display:grid;place-items:center;font-family:'Cinzel',serif;font-size:.84rem;color:#D4AF6A\">[ g ]</span>\n        <span>lo organizza <b style=\"font-weight:500;color:#F5F0E6\">[ chi lo organizza ]</b></span>\n      </div>\n    </div>\n    <div style=\"font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1.3rem;line-height:1.45;color:rgba(245,240,230,.85);text-wrap:pretty;padding:.9rem 1.1rem;border-left:2px solid rgba(170,136,68,.7);background:rgba(170,136,68,.07);border-radius:0 .8rem .8rem 0\">[ il racconto, colle parole di chi l\u2019ha fatto ]</div>\n    <!-- quante persone ci sono gi\u00e0 -->\n    <div style=\"display:flex;align-items:center;gap:.7rem;font-size:1rem;color:rgba(245,240,230,.7)\">\n      <span style=\"display:flex\">\n        <span style=\"width:1.7rem;height:1.7rem;border-radius:50%;border:1px solid rgba(8,11,26,1);background:#C9707A;display:grid;place-items:center;font-family:'Cinzel',serif;font-size:.84rem;color:#0A0C1A\">l</span>\n        <span style=\"width:1.7rem;height:1.7rem;border-radius:50%;border:1px solid rgba(8,11,26,1);background:#4A88B8;margin-left:-.5rem;display:grid;place-items:center;font-family:'Cinzel',serif;font-size:.84rem;color:#0A0C1A\">r</span>\n        <span style=\"width:1.7rem;height:1.7rem;border-radius:50%;border:1px solid rgba(8,11,26,1);background:#AA8844;margin-left:-.5rem;display:grid;place-items:center;font-family:'Cinzel',serif;font-size:.84rem;color:#0A0C1A\">m</span>\n      </span>\n      <span>[ n ] persone ci saranno</span>\n    </div>\n\n    <!-- \u2461 il tasto, e \u2462 cosa si trova dentro -->\n    <div style=\"display:flex;flex-direction:column;gap:.9rem;padding:1.1rem 1.2rem;border-radius:.9rem;border:1px solid rgba(170,136,68,.45);background:rgba(8,11,26,.55)\">\n      <a href=\"dentro-orma-esempio.html?da=evento\" style=\"min-height:3.5rem;padding:.7rem 1.4rem;border-radius:.9rem;border:1px solid #D4AF6A;background:rgba(212,175,106,.18);color:#F5F0E6;font-family:'Cinzel',serif;font-size:1.05rem;letter-spacing:.14em;text-transform:uppercase;display:flex;align-items:center;justify-content:space-between;gap:.6rem;transition:background .3s\" style-hover=\"background:rgba(212,175,106,.32)\">\n        <span>ci sar\u00f2</span>\n        <svg aria-hidden=\"true\" sc-camel-view-box=\"0 0 24 24\" fill=\"none\" stroke=\"#D4AF6A\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"flex:none;width:1.5rem;height:1.5rem\"><path d=\"M4 12h15\"></path><path d=\"M13 5l7 7-7 7\"></path></svg>\n      </a>\n      <div style=\"display:flex;flex-direction:column;gap:.35rem;font-family:'Cormorant Garamond',serif;font-size:1.15rem;line-height:1.4;color:rgba(245,240,230,.75)\">\n        <span style=\"font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1.05rem;color:rgba(245,240,230,.7);margin-bottom:.35rem\">Toccando entri nell\u2019orma della festa. L\u00e0 c\u2019\u00e8:</span><span>\u00b7 la conversazione, e quello che serve sapere</span><span>\u00b7 i bisogni aperti \u2014 e chi lo sente pu\u00f2 dare una mano</span><span>\u00b7 gli aggiornamenti dalla squadra organizzativa</span>\n      </div>\n      <!-- \u26d4 tolta la riga tecnica: chi ha l\u2019account non se ne accorge, e chi non ce l\u2019ha lo scopre toccando. -->\n    </div>\n\n    <!-- \u2463 cos'\u00e8 FelicitasMundi, piccolo -->\n    <div style=\"display:flex;flex-direction:column;gap:.4rem;padding-top:1rem;border-top:1px solid rgba(212,175,106,.22)\">\n      <span style=\"font-family:'Cinzel',serif;font-size:.84rem;letter-spacing:.2em;text-transform:uppercase;color:rgba(212,175,106,.75)\">FelicitasMundi</span>\n      <div style=\"display:flex;flex-direction:column;gap:.5rem;font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1.1rem;line-height:1.45;color:rgba(245,240,230,.65);text-wrap:pretty\">\n        <span>Questa festa \u00e8 un\u2019orma: qualcuno l\u2019ha aperta, e chi entra ci lavora dentro.</span>\n        <span>Toccando \u00abci sar\u00f2\u00bb entri dove si parla \u2014 chi viene, cosa portare, cosa serve ancora. E se qualcosa manca, lo puoi fare tu.</span>\n        <span>\u00c8 il modo in cui FelicitasMundi tiene traccia di quello che si fa insieme.</span>\n      </div>\n      <a href=\"antahkarana-soglia.html\" style=\"align-self:flex-start;min-height:2.75rem;display:inline-flex;align-items:center;gap:.4rem;font-family:'Cinzel',serif;font-size:.84rem;letter-spacing:.1em;color:#D4AF6A\">la soglia <svg aria-hidden=\"true\" sc-camel-view-box=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"width:1rem;height:1rem\"><path d=\"M4 12h15\"></path><path d=\"M13 5l7 7-7 7\"></path></svg></a>\n    </div>\n  </div>\n</div>\n</x-dc>\n";

/* ── il motore che legge il linguaggio di Design ───────────────── */

function evVal(esp, d){
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
function evTesto(t, d){
  return String(t).replace(/\{\{([^}]*)\}\}/g, function(_, e){
    var v = evVal(e, d);
    return (v === undefined || v === null) ? "" : String(v);
  });
}

function evNodo(n, d, doc, dentroSvg){
  /* il testo */
  if(n.nodeType === 3){
    var t = evTesto(n.nodeValue, d);
    return t.trim() === "" && n.nodeValue.indexOf("{{") > -1
      ? null : doc.createTextNode(t);
  }
  if(n.nodeType !== 1) return null;
  var tag = n.tagName.toLowerCase();

  /* ⭐ sc-for: ripete il contenuto per ogni voce */
  if(tag === "sc-for"){
    var lista = evVal((n.getAttribute("list") || "")
      .replace(/[{}]/g, ""), d) || [];
    var nome = n.getAttribute("as") || "v";
    var f = doc.createDocumentFragment();
    lista.forEach(function(voce){
      var d2 = Object.create(d);
      d2[nome] = voce;
      for(var i = 0; i < n.childNodes.length; i++){
        var c = evNodo(n.childNodes[i], d2, doc, dentroSvg || tag === "svg");
        if(c) f.appendChild(c);
      }
    });
    return f;
  }

  /* ⭐ sc-if: mostra solo se vero */
  if(tag === "sc-if"){
    var v = evVal((n.getAttribute("value") || "").replace(/[{}]/g, ""), d);
    if(!v) return null;
    var f2 = doc.createDocumentFragment();
    for(var j = 0; j < n.childNodes.length; j++){
      var c2 = evNodo(n.childNodes[j], d, doc, dentroSvg || tag === "svg");
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
        var f3 = evVal(val.replace(/[{}]/g, ""), d);
        if(typeof f3 === "function") el.onclick = f3;
        continue;
      }
      el.setAttribute(vero, evTesto(val, d));
      continue;
    }
    el.setAttribute(nome2, evTesto(val, d));
  }
  for(var m = 0; m < n.childNodes.length; m++){
    var c4 = evNodo(n.childNodes[m], d, doc, dentroSvg || tag === "svg");
    if(c4) el.appendChild(c4);
  }
  return el;
}

/* ── la logica di Design, verbatim ──────────────────────────────── */
function EvLogica(){
  this.state = {};
  this.setState = function(x){
    var n = typeof x === "function" ? x(this.state) : x;
    for(var k in n) this.state[k] = n[k];
    if(this.suDisegna) this.suDisegna();
  };
}
EvLogica.prototype.renderVals = function() {
    const d = 46, N = v => Math.round(v * 100) / 100, C = [[0, 0]];
    for (let k = 0; k < 6; k++) { const a = (-90 + k * 60) * Math.PI / 180; C.push([N(d * Math.cos(a)), N(d * Math.sin(a))]); }
    for (let k = 0; k < 6; k++) { const a = (-90 + k * 60) * Math.PI / 180; C.push([N(2 * d * Math.cos(a)), N(2 * d * Math.sin(a))]); }
    const linee = [];
    for (let i = 0; i < C.length; i++) for (let j = i + 1; j < C.length; j++) linee.push({ x1: C[i][0], y1: C[i][1], x2: C[j][0], y2: C[j][1] });
    return { linee, centri: C.map(q => ({ x: q[0], y: q[1] })) };
  };

var evBox = null, evLog = null, evId = null, evDati = null, evIo = null;

/* ── leggere l'evento ───────────────────────────────────────────── */
async function evLeggi(id){
  var d = { orma:null, quanti:0, io:null };
  try{
    var u = await db.auth.getUser();
    d.io = u && u.data && u.data.user && u.data.user.id;
    var o = await db.from("orme")
      .select("id,titolo,contenuto,elemento,luogo,accaduto_il,entro_il," +
              "persona_id,destinazione,tipo")
      .eq("id", id).single();
    if(!o.error) d.orma = o.data;
    var p = await db.from("orma_persone")
      .select("id").eq("orma_id", id).not("preso_il", "is", null);
    if(!p.error) d.quanti = (p.data || []).length;
  }catch(e){ console.warn("evento:", e); }
  return d;
}

/* ⭐ «ci sarò»: chi ha l'account entra, chi no passa dal Nexus e
   torna qui. ⛔ Non un modulo d'iscrizione: si entra in un posto
   dove si parla. */
async function evCiSaro(){
  if(!evIo){
    /* ⚠️ accesso.html conserva «da dove si veniva» e riporta qui */
    location.href = "accesso.html?torna=" +
      encodeURIComponent(location.pathname + location.search);
    return;
  }
  try{
    await db.rpc("fm_prendi_orma", { p_orma: evId });
  }catch(e){ console.warn("evento:", e); }
  if(typeof vai === "function") vai("orma", { id: evId });
}

/* ⭐ l'invito qui invita a QUESTO evento: il collegamento porta lo
   slug di chi invita e l'id della festa. */
function evInvita(){
  if(window.SpazioVivo && SpazioVivo.invito)
    SpazioVivo.invito({ evento: evId,
      titolo: evDati && evDati.orma ? evDati.orma.titolo : null });
}

function evDisegna(){
  if(!evBox || !evLog) return;
  var d = evLog.renderVals();
  /* ⭐ i dati veri prendono il posto dei segnaposti */
  if(evDati && evDati.orma){
    d.titolo = evDati.orma.titolo || d.titolo;
    d.quando = evDati.orma.accaduto_il || d.quando;
    d.dove = evDati.orma.luogo || d.dove;
    d.racconto = evDati.orma.contenuto || d.racconto;
    d.quanti = evDati.quanti;
  }
  d.ciSaro = evCiSaro;
  d.invita = evInvita;
  var tmp = document.createElement("div");
  tmp.innerHTML = EV_CORPO;
  evBox.innerHTML = "";
  for(var i = 0; i < tmp.childNodes.length; i++){
    var n = evNodo(tmp.childNodes[i], d, document);
    if(n) evBox.appendChild(n);
  }
  /* ⛔ la griglia di Design si perde dentro il guscio: si porta fuori */
  var d1 = evBox.firstElementChild;
  if(d1 && d1.getAttribute && (d1.getAttribute("style") || "").indexOf("grid") > -1){
    evBox.setAttribute("style", d1.getAttribute("style"));
    while(d1.firstChild) evBox.appendChild(d1.firstChild);
    evBox.removeChild(d1);
  }
}

async function evento(dove, id){
  var box = typeof dove === "string" ? document.querySelector(dove) : dove;
  if(!box) return;
  evBox = box; evId = id;
  evLog = new EvLogica();
  evLog.suDisegna = evDisegna;
  evDisegna();
  evDati = await evLeggi(id);
  evIo = evDati.io;
  evDisegna();
}

window.SpazioVivo = window.SpazioVivo || {};
window.SpazioVivo.evento = evento;
