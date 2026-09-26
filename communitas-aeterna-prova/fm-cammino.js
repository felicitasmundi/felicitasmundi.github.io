/* ═══════════════════════════════════════════════════════════════
   ANTAḤKARAṆA · IL CAMMINO — il primo dei tre momenti

   Disegno da `antahkarana-cammino.html` (Design, 12 settembre).
   Il cubo di Metatron della soglia non sparisce: dentro si forma
   il simbolo dell'orma, e da lì escono le due parole.

   ⭐ NON FILTRA I TALENTI: sono gli stessi per tutti. Dichiara a
      che punto si è, e serve dentro Antahkarana — quando qualcuno
      chiede karma yoga o propone un progetto o un prodotto.
      Chi è ai primi passi viene accompagnato; chi è in cammino
      può portare.

   ⭐ LA DICHIARAZIONE LA FA LA PERSONA. Ma il karma yoga la
      cambia da sé: chi prende un karma yoga passa «in cammino»
      senza doverlo dire. ⛔ E non si torna indietro da soli:
      quello che si è fatto resta fatto.

   ⚠️ Vuole una colonna: `persone.cammino` — 'primi_passi' o
      'in_cammino'. Il blocco SQL è nella posta del ② DATABASE.

   Espone:  SpazioVivo.cammino(dove)     disegna
            SpazioVivo.camminoDi()       la parola di chi è entrato
   ═══════════════════════════════════════════════════════════════ */

"use strict";


var CAM_SCELTE = [
  ["primi_passi", "primi passi"],
  ["in_cammino",  "in cammino"]
];

function camVeste(){
  if(document.getElementById("fm-cam-veste")) return;
  var s = document.createElement("style");
  s.id = "fm-cam-veste";
  s.textContent =
    ".fm-cam{position:relative;isolation:isolate;font-size:16px;min-height:100vh;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);align-items:center;gap:2rem;padding:3rem clamp(1.25rem,5vw,5rem);box-sizing:border-box;font-family:'DM Sans',system-ui,sans-serif;color:#F5F0E6}.fm-cam *{box-sizing:border-box}.fm-cam .velo{position:absolute;inset:0;z-index:0;grid-area:1/1/2/3;pointer-events:none;background:radial-gradient(ellipse 55% 70% at 50% 50%,rgba(2,4,12,.55),transparent 100%)}.fm-cam .sin{position:relative;z-index:1;width:100%;max-width:30rem;margin:0 auto;justify-self:center}.fm-cam .alone{position:absolute;inset:-8%;pointer-events:none;animation:akPuls 14s ease-in-out infinite;background:radial-gradient(ellipse 60% 52% at 50% 50%,rgba(212,175,106,.14),transparent 70%)}.fm-cam .dis{position:absolute;left:50%;top:50%;width:142%;aspect-ratio:1;transform:translate(-50%,-50%);pointer-events:none;overflow:visible}.fm-cam .col{position:relative;z-index:1;display:flex;flex-direction:column;gap:1.6rem;max-width:30rem;justify-self:start}@media (max-width:52rem){.fm-cam{grid-template-columns:1fr;padding:2rem 1.2rem 3rem}.fm-cam .sin{grid-row:1;max-width:22rem}.fm-cam .col{grid-row:2;justify-self:center}}" +
    "@keyframes akGira{to{transform:rotate(360deg)}}" +
    "@keyframes akPuls{0%,100%{opacity:.8}50%{opacity:1}}" +
    ".fm-cam .ret{transform-origin:0 0;animation:akGira 150s linear infinite}" +
    "@media (prefers-reduced-motion:reduce){.fm-cam .ret,.fm-cam .alone{animation:none}}" +
    ".fm-cam h1{margin:0;font-family:'Cinzel',serif;font-weight:400;" +
      "font-size:clamp(1.9rem,3.4vw,2.4rem);line-height:1.12}" +
    ".fm-cam .dentro{display:flex;flex-direction:column;gap:1.1rem;" +
      "border-left:1px solid rgba(212,175,106,.28);padding-left:1.4rem}" +
    ".fm-cam .dentro p{margin:0;font-family:'Cormorant Garamond',serif;" +
      "font-style:italic;font-size:1.06rem;line-height:1.55;" +
      "color:rgba(245,240,230,.66)}" +
    ".fm-cam .dentro p.forte{color:rgba(245,240,230,.82);font-style:normal;" +
      "font-family:'DM Sans',sans-serif;font-size:.96rem}" +

    ".fm-cam .due{display:flex;flex-wrap:wrap;gap:.9rem;margin-top:.4rem}" +
    ".fm-cam .due button{min-height:3.25rem;padding:0 1.9rem;cursor:pointer;" +
      "border-radius:2rem;border:1px solid rgba(212,175,106,.45);" +
      "background:transparent;color:#D4AF6A;font-size:1rem;" +
      "font-family:'DM Sans',sans-serif;transition:.2s}" +
    ".fm-cam .due button:hover{border-color:#D4AF6A;" +
      "background:rgba(212,175,106,.1)}" +
    ".fm-cam .due button.on{background:rgba(212,175,106,.18);" +
      "border-color:#D4AF6A;color:#F5F0E6;" +
      "box-shadow:0 0 1.2rem rgba(212,175,106,.3)}" +

    ".fm-cam .avanti{align-self:flex-start;min-height:3.25rem;padding:0 2rem;" +
      "border:0;border-radius:2rem;background:#C8A055;color:#0A0C1A;" +
      "font-weight:500;font-size:1rem;font-family:'DM Sans',sans-serif;" +
      "cursor:pointer;opacity:.28;pointer-events:none;transition:.25s;" +
      "box-shadow:0 .4rem 1.6rem rgba(200,160,85,.28)}" +
    ".fm-cam .avanti.viva{opacity:1;pointer-events:auto}" +
    ".fm-cam .piede{margin-top:.6rem;font-family:'Cinzel',serif;font-size:.84rem;" +
      "letter-spacing:.2em;text-transform:uppercase;color:rgba(245,240,230,.34);line-height:1.6}";
  document.head.appendChild(s);
}

/* i tredici centri del cubo di Metatron, come nella soglia */
function camCentri(){
  var R = 46, c = [{x:0,y:0}], i, a;
  for(i = 0; i < 6; i++){
    a = Math.PI/6 + i*Math.PI/3;
    c.push({ x: R*Math.cos(a), y: R*Math.sin(a) });
  }
  for(i = 0; i < 6; i++){
    a = Math.PI/6 + i*Math.PI/3;
    c.push({ x: 2*R*Math.cos(a), y: 2*R*Math.sin(a) });
  }
  return c;
}

function camDisegno(){
  var C = camCentri(), NS = "http://www.w3.org/2000/svg";
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
  var lin = document.createElementNS(NS, "g");
  lin.setAttribute("stroke-width", ".6");
  lin.setAttribute("opacity", ".34");     /* più tenue: davanti c'è l'orma */
  for(var i = 0; i < C.length; i++)
    for(var j = i+1; j < C.length; j++){
      var l = document.createElementNS(NS, "line");
      l.setAttribute("x1", C[i].x.toFixed(2)); l.setAttribute("y1", C[i].y.toFixed(2));
      l.setAttribute("x2", C[j].x.toFixed(2)); l.setAttribute("y2", C[j].y.toFixed(2));
      lin.appendChild(l);
    }
  ret.appendChild(lin);
  var cer = document.createElementNS(NS, "g");
  cer.setAttribute("stroke-width", ".9");
  cer.setAttribute("opacity", ".3");
  cer.setAttribute("stroke", "#C9A6E0");
  C.forEach(function(c){
    var o = document.createElementNS(NS, "circle");
    o.setAttribute("cx", c.x.toFixed(2)); o.setAttribute("cy", c.y.toFixed(2));
    o.setAttribute("r", "23");
    cer.appendChild(o);
  });
  ret.appendChild(cer);
  g.appendChild(ret);

  /* ⭐ il simbolo dell'orma, al centro: l'esagono col raggio */
  var orma = document.createElementNS(NS, "g");
  orma.setAttribute("class", "orma");
  orma.setAttribute("stroke-width", "1.6");
  orma.setAttribute("opacity", ".85");
  var es = document.createElementNS(NS, "path");
  var P = [], k;
  for(k = 0; k < 6; k++){
    var an = Math.PI/6 + k*Math.PI/3;
    P.push((46*Math.cos(an)).toFixed(2) + "," + (46*Math.sin(an)).toFixed(2));
  }
  es.setAttribute("d", "M" + P.join("L") + "Z");
  orma.appendChild(es);
  var raggi = document.createElementNS(NS, "path");
  var d = "";
  for(k = 0; k < 6; k += 2){
    var a2 = Math.PI/6 + k*Math.PI/3;
    d += "M0,0L" + (46*Math.cos(a2)).toFixed(2) + "," + (46*Math.sin(a2)).toFixed(2);
  }
  raggi.setAttribute("d", d);
  raggi.setAttribute("opacity", ".7");
  orma.appendChild(raggi);
  var c1 = document.createElementNS(NS, "circle");
  c1.setAttribute("r", "56"); c1.setAttribute("stroke-width", "1.1");
  c1.setAttribute("opacity", ".6");
  orma.appendChild(c1);
  g.appendChild(orma);

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

  svg.appendChild(g);
  return svg;
}

/* ── la parola di chi è entrato ──────────────────────────────── */
async function camminoDi(){
  try{
    if(typeof db === "undefined" || !db) return null;
    var u = await db.auth.getUser();
    var chi = u && u.data && u.data.user && u.data.user.id;
    if(!chi) return null;
    var r = await db.from("persone").select("cammino").eq("id", chi).single();
    if(r.error) throw r.error;
    return (r.data && r.data.cammino) || null;
  }catch(e){ console.warn("cammino:", e); return null; }
}

async function camScrivi(q){
  try{
    if(typeof db === "undefined" || !db) return false;
    var u = await db.auth.getUser();
    var chi = u && u.data && u.data.user && u.data.user.id;
    if(!chi) return false;
    var r = await db.from("persone").update({ cammino: q }).eq("id", chi);
    if(r.error) throw r.error;
    return true;
  }catch(e){ console.warn("cammino:", e); return false; }
}

/* ── la porta ─────────────────────────────────────────────────── */
function cammino(dove){
  var box = typeof dove === "string" ? document.querySelector(dove) : dove;
  if(!box) return;
  camVeste();
  box.className = "fm-cam";
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
  var al = document.createElement("div");
  al.className = "alone"; al.setAttribute("aria-hidden","true");
  sin.appendChild(al);
  sin.appendChild(camDisegno());

  /* ⭐ la figura di Design, accanto agli altri file in SPAZIO VIVO */
  var fig = document.createElement("img");
  fig.src = "ak-fig.webp"; fig.alt = "";
  fig.setAttribute("aria-hidden", "true");
  fig.style.cssText = "position:relative;z-index:1;display:block;width:100%;height:auto;mix-blend-mode:screen;-webkit-mask-image:radial-gradient(ellipse 62% 74% at 50% 50%,#000 0,#000 52%,rgba(0,0,0,.55) 74%,transparent 92%);mask-image:radial-gradient(ellipse 62% 74% at 50% 50%,#000 0,#000 52%,rgba(0,0,0,.55) 74%,transparent 92%)";
  sin.appendChild(fig);
  box.appendChild(sin);

  var col = document.createElement("div");
  col.className = "col";

  var h1 = document.createElement("h1");
  h1.textContent = "A che punto sei?";
  col.appendChild(h1);

  var dentro = document.createElement("div");
  dentro.className = "dentro";
  var p1 = document.createElement("p");
  p1.textContent = "Ci\u00f2 che sceglierai former\u00e0 la radice delle orme " +
    "con cui traccerai il tuo percorso di crescita e sviluppo su Felicitas.";
  var p2 = document.createElement("p");
  p2.className = "forte";
  p2.textContent = "Riconosci il tuo talento ed evolvi col supporto delle squadre";
  dentro.appendChild(p1); dentro.appendChild(p2);
  col.appendChild(dentro);

  var scelto = null;
  var due = document.createElement("div");
  due.className = "due";
  var av;
  CAM_SCELTE.forEach(function(s){
    var b = document.createElement("button");
    b.type = "button"; b.textContent = s[1];
    b.onclick = function(){
      scelto = s[0];
      due.querySelectorAll("button").forEach(function(x){ x.classList.remove("on"); });
      b.classList.add("on");
      av.classList.add("viva");
    };
    due.appendChild(b);
  });
  col.appendChild(due);

  av = document.createElement("button");
  av.type = "button"; av.className = "avanti";
  av.textContent = "avanti \u00b7 i cinque solidi";
  av.onclick = async function(){
    if(!scelto) return;
    av.classList.remove("viva");
    await camScrivi(scelto);
    /* ⭐ 12 settembre, parola di Gab: dopo il cammino vengono LE STANZE */
    if(typeof vai === "function") vai("stanze");
    else if(window.SpazioVivo && SpazioVivo.percorsoDeiTalenti)
      SpazioVivo.percorsoDeiTalenti(box);
  };
  col.appendChild(av);

  var pi = document.createElement("div");
  pi.className = "piede";
  pi.textContent = "Ponte verso l\u2019Evoluzione della Specie Umana";
  col.appendChild(pi);

  box.appendChild(col);
}

window.SpazioVivo = window.SpazioVivo || {};
window.SpazioVivo.cammino   = cammino;
window.SpazioVivo.camminoDi = camminoDi;
