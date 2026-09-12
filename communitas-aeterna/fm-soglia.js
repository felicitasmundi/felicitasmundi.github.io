/* ═══════════════════════════════════════════════════════════════
   ANTAḤKARAṆA · LA PRIMA SOGLIA

   La schermata che si apre subito dopo il Nexus, la prima volta.
   Il disegno viene da `antahkarana-soglia.html` (Design, 12 set):
   il cubo di Metatron che gira, tredici centri e le linee fra tutti.

   ⭐ CHI LA VEDE: solo chi non ha ancora scelto i talenti. Chi li ha
      già non la rivede mai, nemmeno entrando da un altro telefono —
      la risposta viene dal database, non da questo apparecchio.

   ⭐ È GRATUITA e aperta a chiunque entri. Il praticantato costa
      80 € al mese, questa soglia no.

   ⛔ Le tre righe sono un cartello, non tasti: qui non si sceglie.
   ⛔ E sono parole di Gab, verbatim. Non si riscrivono.

   Espone:  window.SpazioVivo.soglia(dove)      disegna
            window.SpazioVivo.soglaServe()      vero se va mostrata
   ═══════════════════════════════════════════════════════════════ */

"use strict";


/* le tre righe — parole di Gab, 12 settembre. ⛔ verbatim */
var SOG_RIGHE = [
  ["Quello che fai",
   "tenere traccia della giornata, attivare squadre, proporre attivit\u00e0, " +
   "espandere la comunit\u00e0"],
  ["Quello che condividi",
   "ricerca, formazioni, racconti, persone e luoghi in risonanza, " +
   "assistenza terapeutica, i tuoi prodotti in scambio o in vendita"],
  ["Quello che ricevi",
   "karma yoga, ospitalit\u00e0, pubblicazione e stampa, lezioni, " +
   "strumenti di coscienza, alimenti, rimedi, prenotazioni e pagamenti"]
];

/* ── il cubo di Metatron: tredici centri ─────────────────────────
   uno al centro, sei attorno, sei più fuori. Le linee vanno da
   ognuno a tutti gli altri: è quello che lo rende un cubo. */
function sogCentri(){
  var R = 46, c = [{x:0, y:0}], i, a;
  for(i = 0; i < 6; i++){
    a = Math.PI / 6 + i * Math.PI / 3;
    c.push({ x: R * Math.cos(a), y: R * Math.sin(a) });
  }
  for(i = 0; i < 6; i++){
    a = Math.PI / 6 + i * Math.PI / 3;
    c.push({ x: 2 * R * Math.cos(a), y: 2 * R * Math.sin(a) });
  }
  return c;
}

function sogVeste(){
  if(document.getElementById("fm-sog-veste")) return;
  var s = document.createElement("style");
  s.id = "fm-sog-veste";
  s.textContent =
    ".fm-sog{position:relative;isolation:isolate;font-size:16px;min-height:100vh;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);align-items:center;gap:2rem;padding:3rem clamp(1.25rem,5vw,5rem);box-sizing:border-box;font-family:'DM Sans',system-ui,sans-serif;color:#F5F0E6}.fm-sog *{box-sizing:border-box}.fm-sog .velo{position:absolute;inset:0;z-index:0;grid-area:1/1/2/3;pointer-events:none;background:radial-gradient(ellipse 55% 70% at 50% 50%,rgba(2,4,12,.55),transparent 100%)}.fm-sog .sin{position:relative;z-index:1;width:100%;max-width:30rem;margin:0 auto;justify-self:center}.fm-sog .alone{position:absolute;inset:-8%;pointer-events:none;animation:akPuls 14s ease-in-out infinite;background:radial-gradient(ellipse 60% 52% at 50% 50%,rgba(212,175,106,.14),transparent 70%)}.fm-sog .dis{position:absolute;left:50%;top:50%;width:142%;aspect-ratio:1;transform:translate(-50%,-50%);pointer-events:none;overflow:visible}.fm-sog .col{position:relative;z-index:1;display:flex;flex-direction:column;gap:2.2rem;max-width:30rem;justify-self:start}@media (max-width:52rem){.fm-sog{grid-template-columns:1fr;padding:2rem 1.2rem 3rem}.fm-sog .sin{grid-row:1;max-width:22rem}.fm-sog .col{grid-row:2;justify-self:center}}" +
    "@keyframes akGira{to{transform:rotate(360deg)}}" +
    "@keyframes akPuls{0%,100%{opacity:.8}50%{opacity:1}}" +
    ".fm-sog .ret{transform-origin:0 0;animation:akGira 150s linear infinite}" +
    "@media (prefers-reduced-motion:reduce){.fm-sog .ret,.fm-sog .alone{animation:none}}" +
    ".fm-sog h1{margin:0;font-family:'Cinzel',serif;font-weight:400;" +
      "font-size:clamp(2rem,3.6vw,2.5rem);line-height:1.1;letter-spacing:.01em}" +
    ".fm-sog .capo{display:flex;flex-wrap:wrap;align-items:baseline;" +
      "gap:.4rem 1.4rem}" +
    ".fm-sog .apert{font-family:'Cinzel',serif;font-size:.84rem;" +
      "letter-spacing:.28em;text-transform:uppercase;color:#D4AF6A;opacity:.8}" +

    ".fm-sog .tre{display:flex;flex-direction:column;gap:1.5rem}" +
    ".fm-sog .rg b{display:block;font-family:'Cinzel',serif;font-weight:400;" +
      "font-size:1.12rem;color:#D4AF6A;margin-bottom:.3rem}" +
    ".fm-sog .rg p{margin:0;font-family:'Cormorant Garamond',serif;" +
      "font-style:italic;font-size:1.06rem;line-height:1.5;" +
      "color:rgba(245,240,230,.66)}" +

    ".fm-sog .giu{display:flex;flex-direction:column;gap:.9rem;" +
      "align-items:center}" +
    ".fm-sog .avvia{min-height:3.25rem;padding:0 2rem;border:0;cursor:pointer;" +
      "border-radius:2rem;background:#C8A055;color:#0A0C1A;font-weight:500;" +
      "font-size:1rem;font-family:'DM Sans',sans-serif;" +
      "box-shadow:0 .4rem 1.6rem rgba(200,160,85,.28);transition:.2s}" +
    ".fm-sog .avvia:hover{background:#D4AF6A;transform:translateY(-1px)}" +
    ".fm-sog .piede{font-family:'Cinzel',serif;font-size:.84rem;" +
      "letter-spacing:.2em;text-transform:uppercase;" +
      "color:rgba(245,240,230,.34);text-align:center;line-height:1.6}";
  document.head.appendChild(s);
}

/* ── il disegno ──────────────────────────────────────────────── */
function sogDisegno(){
  var C = sogCentri(), NS = "http://www.w3.org/2000/svg";
  var svg = document.createElementNS(NS, "svg");
  svg.setAttribute("viewBox", "-125 -125 250 250");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("class", "dis");

  var g = document.createElementNS(NS, "g");
  g.setAttribute("fill", "none");
  g.setAttribute("stroke", "#D4AF6A");
  g.setAttribute("stroke-linejoin", "round");

  var ret = document.createElementNS(NS, "g");
  ret.setAttribute("class", "ret");

  /* le linee: da ogni centro a tutti gli altri */
  var lin = document.createElementNS(NS, "g");
  lin.setAttribute("stroke-width", ".7");
  lin.setAttribute("opacity", ".5");
  for(var i = 0; i < C.length; i++){
    for(var j = i + 1; j < C.length; j++){
      var l = document.createElementNS(NS, "line");
      l.setAttribute("x1", C[i].x.toFixed(2));
      l.setAttribute("y1", C[i].y.toFixed(2));
      l.setAttribute("x2", C[j].x.toFixed(2));
      l.setAttribute("y2", C[j].y.toFixed(2));
      lin.appendChild(l);
    }
  }
  ret.appendChild(lin);

  /* i tredici cerchi */
  var cer = document.createElementNS(NS, "g");
  cer.setAttribute("stroke-width", "1");
  cer.setAttribute("opacity", ".46");
  cer.setAttribute("stroke", "#C9A6E0");
  C.forEach(function(c){
    var o = document.createElementNS(NS, "circle");
    o.setAttribute("cx", c.x.toFixed(2));
    o.setAttribute("cy", c.y.toFixed(2));
    o.setAttribute("r", "23");
    cer.appendChild(o);
  });
  ret.appendChild(cer);
  g.appendChild(ret);

  /* il cerchio grande, che respira */
  var fuori = document.createElementNS(NS, "circle");
  fuori.setAttribute("r", "115");
  fuori.setAttribute("stroke-width", "1");
  fuori.setAttribute("opacity", ".5");
  g.appendChild(fuori);

  /* ⛔ il quadrato tratteggiato, da Design: -115 -115, 230×230 */
  var quad = document.createElementNS(NS, "rect");
  quad.setAttribute("x", "-115"); quad.setAttribute("y", "-115");
  quad.setAttribute("width", "230"); quad.setAttribute("height", "230");
  quad.setAttribute("stroke-width", ".8");
  quad.setAttribute("stroke-dasharray", "3 3.6");
  quad.setAttribute("opacity", ".34");
  g.appendChild(quad);
  var _fatto = 1;
  fuori.setAttribute("class", "puls");
  g.appendChild(fuori);

  svg.appendChild(g);
  return svg;
}

/* ── LA DOMANDA: questa soglia serve? ─────────────────────────────
   ⭐ La risposta viene dal database, non da questo apparecchio: chi
      ha già i talenti non la rivede mai, nemmeno da un altro telefono. */
async function sogliaServe(){
  try{
    if(typeof db === "undefined" || !db) return true;
    var u = await db.auth.getUser();
    var chi = u && u.data && u.data.user && u.data.user.id;
    if(!chi) return true;
    var r = await db.from("orme")
      .select("id", { count: "exact", head: true })
      .eq("persona_id", chi)
      .not("talento_id", "is", null);
    if(r.error) throw r.error;
    return !r.count;                    /* nessun talento → la soglia serve */
  }catch(e){
    console.warn("soglia:", e);
    return false;        /* ⛔ nel dubbio non si sbarra la strada */
  }
}

/* ── la porta ─────────────────────────────────────────────────── */
function soglia(dove){
  var box = typeof dove === "string" ? document.querySelector(dove) : dove;
  if(!box) return;
  sogVeste();
  box.className = "fm-sog";
  box.innerHTML = "";

  var velo = document.createElement("div");
  velo.className = "velo"; velo.setAttribute("aria-hidden","true");
  box.appendChild(velo);

  /* ⭐ il cosmo di Design, dietro tutto */
  var cos = document.createElement("ak-cosmo");
  cos.setAttribute("aria-hidden", "true");
  cos.style.cssText = "position:absolute;inset:0;z-index:0;grid-area:1/1/2/3;pointer-events:none";
  box.insertBefore(cos, box.firstChild);

  /* ⛔ a sinistra il disegno col suo alone — la colonna di Design */
  var sin = document.createElement("div");
  sin.className = "sin";
  var alone = document.createElement("div");
  alone.className = "alone"; alone.setAttribute("aria-hidden","true");
  sin.appendChild(alone);
  sin.appendChild(sogDisegno());

  /* ⭐ la figura di Design, accanto agli altri file in SPAZIO VIVO */
  var fig = document.createElement("img");
  fig.src = "ak-fig.webp"; fig.alt = "";
  fig.setAttribute("aria-hidden", "true");
  fig.style.cssText = "position:relative;z-index:1;display:block;width:100%;height:auto;mix-blend-mode:screen;-webkit-mask-image:radial-gradient(ellipse 62% 74% at 50% 50%,#000 0,#000 52%,rgba(0,0,0,.55) 74%,transparent 92%);mask-image:radial-gradient(ellipse 62% 74% at 50% 50%,#000 0,#000 52%,rgba(0,0,0,.55) 74%,transparent 92%)";
  sin.appendChild(fig);
  box.appendChild(sin);

  var col = document.createElement("div");
  col.className = "col";

  var capo = document.createElement("div");
  capo.className = "capo";
  var h1 = document.createElement("h1");
  h1.textContent = "Anta\u1e25kara\u1e47a";
  var ap = document.createElement("div");
  ap.className = "apert";
  ap.textContent = "Prima soglia \u00b7 aperta a tutti";
  capo.appendChild(h1); capo.appendChild(ap);
  col.appendChild(capo);

  var tre = document.createElement("div");
  tre.className = "tre";
  SOG_RIGHE.forEach(function(r){
    var d = document.createElement("div");
    d.className = "rg";
    var b = document.createElement("b"); b.textContent = r[0];
    var p = document.createElement("p"); p.textContent = r[1];
    d.appendChild(b); d.appendChild(p);
    tre.appendChild(d);
  });
  col.appendChild(tre);

  var giu = document.createElement("div");
  giu.className = "giu";
  var b = document.createElement("button");
  b.type = "button"; b.className = "avvia";
  b.textContent = "inizia il percorso dei talenti";
  b.onclick = function(){
    /* ⭐ 12 settembre, parola di Gab: prima dei talenti viene IL CAMMINO */
    if(typeof vai === "function") vai("cammino");
    else if(window.SpazioVivo && SpazioVivo.percorsoDeiTalenti)
      SpazioVivo.percorsoDeiTalenti(box);
  };
  var pi = document.createElement("div");
  pi.className = "piede";
  pi.textContent = "Ponte verso l\u2019Evoluzione della Specie Umana";
  giu.appendChild(b); giu.appendChild(pi);
  col.appendChild(giu);

  box.appendChild(col);
}

window.SpazioVivo = window.SpazioVivo || {};
window.SpazioVivo.soglia = soglia;
window.SpazioVivo.sogliaServe = sogliaServe;
