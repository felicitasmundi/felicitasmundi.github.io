/* ═══════════════════════════════════════════════════════════════
   ANTAḤKARAṆA · LE STANZE — il secondo momento

   ⛔ Disegno da `antahkarana-stanze.html` (Design, 12 settembre,
      MD5 dc1cad72a083305dfc45e87ce245a622). La geometria dei solidi
      è la sua, riga per riga: non è stata ricalcolata.

   Due colonne: a sinistra il solido della stanza scelta dentro il
   cubo di Metatron, a destra i suoi talenti raccolti per gruppo.

   ⭐ Ogni talento preso accende un punto del disegno.
   ⭐ Prendere apre l'orma radice, come in fm-radice.js.

   Espone:  SpazioVivo.stanze(dove)
   ═══════════════════════════════════════════════════════════════ */

"use strict";

/* le cinque stanze, coi loro solidi. ⛔ Chi costruisce sta dentro
   la terra insieme ai Vicinati: decisione di Gab, 12 settembre. */
var STZ = [
  { nome: "Chi accompagna", el: "fuoco", solido: "tetraedro",  col: "#CC6644" },
  { nome: "I Vicinati",     el: "terra", solido: "cubo",       col: "#AA8844" },
  { nome: "L\u2019Emporio", el: "acqua", solido: "icosaedro",  col: "#4488BB" },
  { nome: "L\u2019Edizione",el: "aria",  solido: "ottaedro",   col: "#669944" },
  { nome: "La Scuola",      el: "etere", solido: "dodecaedro", col: "#9966CC" }
];

/* ── la geometria: copiata da Design, d = 46 ─────────────────── */
function stzSolidi(){
  var d = 46, r3 = Math.sqrt(3);
  function P(a, r){ return [r*Math.cos(a*Math.PI/180), r*Math.sin(a*Math.PI/180)]; }
  function hex(k){ return P(-90 + k*60, d); }
  function HEX(k){ return P(-90 + k*60, 2*d); }
  var O = [0, 0];
  function L(a, b, o){ return { x1:a[0], y1:a[1], x2:b[0], y2:b[1], o: o || 1 }; }
  function anello(pts, o){
    return pts.map(function(p, i){ return L(p, pts[(i+1) % pts.length], o); });
  }
  var k, tetra = anello([HEX(0), HEX(2), HEX(4)]).concat(
        [L(HEX(0), O, .55), L(HEX(2), O, .55), L(HEX(4), O, .55)]);

  var cubo = anello([HEX(0),HEX(1),HEX(2),HEX(3),HEX(4),HEX(5)], .9).concat(
        [L(O,HEX(1),.9), L(O,HEX(3),.9), L(O,HEX(5),.9),
         L(HEX(0),hex(0),.45), L(HEX(2),hex(2),.45), L(HEX(4),hex(4),.45)]);

  var otta = anello([HEX(0),HEX(1),HEX(2),HEX(3),HEX(4),HEX(5)], .9)
        .concat(anello([HEX(0),HEX(2),HEX(4)], .55))
        .concat(anello([HEX(1),HEX(3),HEX(5)], .55));

  var ico = anello([HEX(0),HEX(1),HEX(2),HEX(3),HEX(4),HEX(5)], .9)
        .concat(anello([hex(0),hex(1),hex(2),hex(3),hex(4),hex(5)], .7));
  for(k = 0; k < 6; k++) ico.push(L(HEX(k), hex(k), .6));
  for(k = 0; k < 6; k++) ico.push(L(HEX(k), hex((k+1) % 6), .4));

  var dodeIn = [], dodeOut = [], dodeMid = [];
  for(k = 0; k < 6; k++){
    dodeIn.push(P(-60 + k*60, d*r3*.58));
    dodeOut.push(P(-90 + k*60, d*2));
    dodeMid.push(P(-60 + k*60, d*r3));
  }
  var dode = anello(dodeOut, .9).concat(anello(dodeIn, .7));
  for(k = 0; k < 6; k++) dode.push(L(dodeIn[k], dodeMid[k], .55));
  for(k = 0; k < 6; k++) dode.push(L(dodeMid[k], dodeOut[k], .55));
  for(k = 0; k < 6; k++) dode.push(L(dodeMid[k], dodeOut[(k+1) % 6], .55));

  return { tetraedro:tetra, cubo:cubo, ottaedro:otta, icosaedro:ico, dodecaedro:dode };
}

/* i tredici centri del cubo di Metatron */
function stzCentri(){
  var d = 46, C = [[0,0]], k, a;
  for(k = 0; k < 6; k++){ a = (-90 + k*60)*Math.PI/180;
    C.push([d*Math.cos(a), d*Math.sin(a)]); }
  for(k = 0; k < 6; k++){ a = (-90 + k*60)*Math.PI/180;
    C.push([2*d*Math.cos(a), 2*d*Math.sin(a)]); }
  return C;
}

function stzRgba(hex, a){
  var n = parseInt(hex.slice(1), 16);
  return "rgba(" + (n >> 16) + "," + ((n >> 8) & 255) + "," + (n & 255) + "," + a + ")";
}

function stzVeste(){
  if(document.getElementById("fm-stz-veste")) return;
  var s = document.createElement("style");
  s.id = "fm-stz-veste";
  s.textContent =
    ".fm-stz{position:relative;isolation:isolate;font-size:16px;min-height:100vh;" +
      "display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);" +
      "align-items:center;gap:2rem;padding:2rem clamp(1.25rem,5vw,5rem);" +
      "box-sizing:border-box;font-family:'DM Sans',system-ui,sans-serif;color:#F5F0E6}" +
    ".fm-stz *{box-sizing:border-box}" +
    ".fm-stz .velo{position:absolute;inset:0;z-index:0;grid-area:1/1/2/3;" +
      "pointer-events:none;background:radial-gradient(ellipse 55% 70% at 50% 50%," +
      "rgba(2,4,12,.55),transparent 100%)}" +

    ".fm-stz .sin{position:relative;z-index:1;display:flex;flex-direction:column;" +
      "gap:1.2rem;align-items:center;justify-self:center;width:100%;" +
      "max-width:min(22rem,52vh)}" +
    ".fm-stz .quadro{position:relative;width:100%;aspect-ratio:1}" +
    ".fm-stz .alone{position:absolute;inset:-10%;pointer-events:none;" +
      "background:radial-gradient(ellipse 60% 52% at 50% 50%," +
      "rgba(212,175,106,.14),transparent 70%)}" +
    ".fm-stz svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}" +
    ".fm-stz .ret{transform-origin:0 0;animation:stzGira 150s linear infinite}" +
    "@keyframes stzGira{to{transform:rotate(360deg)}}" +
    ".fm-stz .sol{transform-origin:0 0;animation:stzSol 42s linear infinite}" +
    "@keyframes stzSol{to{transform:rotate(-360deg)}}" +
    "@keyframes akPuls{0%,100%{opacity:.8}50%{opacity:1}}" +
    "@media (prefers-reduced-motion:reduce){" +
      ".fm-stz .ret,.fm-stz .sol{animation:none}}" +

    ".fm-stz .scelta{display:flex;flex-wrap:wrap;gap:.4rem;justify-content:center}" +
    ".fm-stz .scelta button{min-height:2.75rem;padding:0 .95rem;cursor:pointer;" +
      "border-radius:2rem;border:1px solid rgba(245,240,230,.16);" +
      "background:transparent;color:rgba(245,240,230,.55);font-size:.86rem;" +
      "font-family:'DM Sans',sans-serif;transition:.2s}" +
    ".fm-stz .scelta button.on{border-color:var(--c);color:var(--c);" +
      "background:color-mix(in srgb,var(--c) 14%,transparent);filter:brightness(1.25)}" +

    ".fm-stz .des{position:relative;z-index:1;display:flex;flex-direction:column;" +
      "gap:1.4rem;max-width:30rem;justify-self:start;" +
      "max-height:82vh;overflow-y:auto;scrollbar-width:none;padding-right:.3rem}" +
    ".fm-stz .des::-webkit-scrollbar{display:none}" +
    ".fm-stz h1{margin:0;font-family:'Cinzel',serif;font-weight:400;" +
      "font-size:clamp(1.7rem,3vw,2.1rem);line-height:1.14;color:var(--c);" +
      "filter:brightness(1.25)}" +
    ".fm-stz .sotto{font-family:'Cormorant Garamond',serif;font-style:italic;" +
      "font-size:1.02rem;color:rgba(245,240,230,.6);margin-top:.2rem}" +
    ".fm-stz .gr{display:flex;flex-direction:column;gap:.15rem}" +
    ".fm-stz .gr .cp b{display:block;font-family:'Cinzel',serif;font-weight:400;" +
      "font-size:.98rem;color:rgba(245,240,230,.9)}" +
    ".fm-stz .gr .cp em{display:block;font-style:normal;font-size:.8rem;" +
      "color:rgba(245,240,230,.4);margin-bottom:.4rem}" +
    ".fm-stz .tal{display:flex;align-items:center;gap:1rem;min-height:3.5rem;" +
      "padding:.4rem .6rem;margin:0 -.6rem;border:0;border-radius:.6rem;" +
      "cursor:pointer;text-align:left;width:calc(100% + 1.2rem);" +
      "background:transparent;color:rgba(245,240,230,.8);" +
      "font-family:'DM Sans',sans-serif;font-size:.95rem;transition:.18s}" +
    ".fm-stz .tal:hover{background:rgba(245,240,230,.05)}" +
    ".fm-stz .tal .box{flex:none;width:1.15rem;height:1.15rem;border-radius:.28rem;" +
      "border:1px solid rgba(245,240,230,.28);display:grid;place-items:center;" +
      "font-size:.7rem;transition:.18s}" +
    ".fm-stz .tal.preso .box{border-color:var(--c);background:var(--c);color:#0A0C1A}" +
    ".fm-stz .tal.preso{color:#F5F0E6}" +

    "@media (max-width:52rem){" +
      ".fm-stz{grid-template-columns:1fr;padding:1.5rem 1.2rem 3rem}" +
      ".fm-stz .sin{grid-row:1;max-width:18rem}" +
      ".fm-stz .des{grid-row:2;justify-self:center;max-height:none}}";
  document.head.appendChild(s);
}

/* ── stato ─────────────────────────────────────────────────────── */
var stzScelta = 1;          /* i Vicinati: la stanza più piena */
var stzPresi  = {};
var stzDati   = null;

async function stzLeggi(){
  if(stzDati) return stzDati;
  var fam = [], gru = [], tal = [], presi = [];
  try{
    var a = await db.from("talenti_famiglie").select("id,nome,colore,ordine").order("ordine");
    var b = await db.from("talenti_gruppi").select("id,nome,descrizione,famiglia_id,ordine").order("ordine");
    var c = await db.from("talenti").select("id,nome,gruppo_id,famiglia_id").eq("attivo", true).order("nome");
    if(a.error || b.error || c.error) throw (a.error || b.error || c.error);
    fam = a.data || []; gru = b.data || []; tal = c.data || [];
    var u = await db.auth.getUser();
    var chi = u && u.data && u.data.user && u.data.user.id;
    if(chi){
      var o = await db.from("orme").select("id,talento_id")
        .eq("persona_id", chi).not("talento_id", "is", null);
      if(!o.error) (o.data || []).forEach(function(r){ stzPresi[r.talento_id] = r.id; });
    }
  }catch(e){ console.warn("stanze:", e); }
  stzDati = { fam:fam, gru:gru, tal:tal };
  return stzDati;
}

/* ── il disegno ─────────────────────────────────────────────────── */
function stzDisegno(st){
  var NS = "http://www.w3.org/2000/svg", C = stzCentri();
  var svg = document.createElementNS(NS, "svg");
  svg.setAttribute("viewBox", "-125 -125 250 250");
  svg.setAttribute("aria-hidden", "true");

  var g = document.createElementNS(NS, "g");
  g.setAttribute("fill", "none");
  g.setAttribute("stroke-linejoin", "round");

  /* il cubo di Metatron, tenue, che gira */
  var ret = document.createElementNS(NS, "g");
  ret.setAttribute("class", "ret");
  ret.setAttribute("stroke", "#D4AF6A");
  var lin = document.createElementNS(NS, "g");
  lin.setAttribute("stroke-width", ".55"); lin.setAttribute("opacity", ".22");
  for(var i = 0; i < C.length; i++)
    for(var j = i+1; j < C.length; j++){
      var l = document.createElementNS(NS, "line");
      l.setAttribute("x1", C[i][0].toFixed(2)); l.setAttribute("y1", C[i][1].toFixed(2));
      l.setAttribute("x2", C[j][0].toFixed(2)); l.setAttribute("y2", C[j][1].toFixed(2));
      lin.appendChild(l);
    }
  ret.appendChild(lin);
  g.appendChild(ret);

  /* il solido della stanza, in evidenza, che gira al contrario */
  var sol = document.createElementNS(NS, "g");
  sol.setAttribute("class", "sol");
  sol.setAttribute("stroke", st.col);
  sol.setAttribute("stroke-width", "1.5");
  stzSolidi()[st.solido].forEach(function(s){
    var l = document.createElementNS(NS, "line");
    l.setAttribute("x1", s.x1.toFixed(2)); l.setAttribute("y1", s.y1.toFixed(2));
    l.setAttribute("x2", s.x2.toFixed(2)); l.setAttribute("y2", s.y2.toFixed(2));
    l.setAttribute("opacity", String(s.o));
    sol.appendChild(l);
  });
  g.appendChild(sol);

  /* ⭐ ogni talento preso accende un punto */
  var chiavi = Object.keys(stzPresi).sort();
  chiavi.forEach(function(k, i){
    var c = C[(i * 5) % 13];
    var a = ((i * 137) % 360) * Math.PI / 180;
    var r = i < 13 ? 0 : 23;
    var p = document.createElementNS(NS, "circle");
    p.setAttribute("cx", (c[0] + r*Math.cos(a)).toFixed(2));
    p.setAttribute("cy", (c[1] + r*Math.sin(a)).toFixed(2));
    p.setAttribute("r", "3.2");
    p.setAttribute("fill", "#D4AF6A");
    p.setAttribute("stroke", "none");
    p.setAttribute("opacity", ".85");
    g.appendChild(p);
  });

  var fuori = document.createElementNS(NS, "circle");
  fuori.setAttribute("r", "115"); fuori.setAttribute("stroke", "#D4AF6A");
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

/* ── prendere e lasciare ────────────────────────────────────────── */
async function stzPrendi(t, st){
  try{
    var u = await db.auth.getUser();
    var chi = u && u.data && u.data.user && u.data.user.id;
    if(!chi) return;
    if(stzPresi[t.id]){
      var r = await db.from("orme").update({ talento_id: null })
        .eq("id", stzPresi[t.id]);
      if(r.error) throw r.error;
      delete stzPresi[t.id];                /* ⛔ l'orma resta, si stacca il talento */
    }else{
      var n = await db.from("orme").insert({
        persona_id: chi, tipo: "talento_radice", talento_id: t.id,
        contenuto: t.nome, visibilita: "pubblico"
      }).select("id").single();
      if(n.error) throw n.error;
      stzPresi[t.id] = n.data.id;
    }
  }catch(e){ console.warn("stanze:", e); }
}

/* ── la porta ───────────────────────────────────────────────────── */
async function stanze(dove){
  var box = typeof dove === "string" ? document.querySelector(dove) : dove;
  if(!box) return;
  stzVeste();
  box.className = "fm-stz";
  await stzLeggi();
  stzDisegna(box);
}

function stzDisegna(box){
  var st = STZ[stzScelta];
  box.innerHTML = "";
  box.style.setProperty("--c", st.col);

  var velo = document.createElement("div");
  velo.className = "velo"; velo.setAttribute("aria-hidden","true");
  box.appendChild(velo);

  /* ⭐ il cosmo di Design, dietro tutto */
  var cos = document.createElement("ak-cosmo");
  cos.setAttribute("aria-hidden", "true");
  cos.style.cssText = "position:absolute;inset:0;z-index:0;grid-area:1/1/2/3;pointer-events:none";
  box.insertBefore(cos, box.firstChild);

  /* sinistra: il solido, e sotto le cinque stanze */
  var sin = document.createElement("div");
  sin.className = "sin";
  var q = document.createElement("div");
  q.className = "quadro";
  var al = document.createElement("div");
  al.className = "alone"; al.setAttribute("aria-hidden","true");
  q.appendChild(al);
  q.appendChild(stzDisegno(st));
  sin.appendChild(q);

  var sc = document.createElement("div");
  sc.className = "scelta";
  STZ.forEach(function(x, i){
    var b = document.createElement("button");
    b.type = "button"; b.textContent = x.nome;
    b.style.setProperty("--c", x.col);
    if(i === stzScelta) b.className = "on";
    b.onclick = function(){ stzScelta = i; stzDisegna(box); };
    sc.appendChild(b);
  });
  sin.appendChild(sc);
  box.appendChild(sin);

  /* destra: i talenti della stanza, raccolti per gruppo */
  var des = document.createElement("div");
  des.className = "des";

  var fam = stzDati.fam.filter(function(f){ return f.nome === st.nome; })[0];
  var miei = stzDati.tal.filter(function(t){
    return fam && t.famiglia_id === fam.id; });

  var capo = document.createElement("div");
  var h1 = document.createElement("h1"); h1.textContent = st.nome;
  var so = document.createElement("div"); so.className = "sotto";
  so.textContent = st.el + " \u00b7 " + st.solido + " \u00b7 " +
    miei.length + (miei.length === 1 ? " talento" : " talenti");
  capo.appendChild(h1); capo.appendChild(so);
  des.appendChild(capo);

  var perGr = {};
  miei.forEach(function(t){ (perGr[t.gruppo_id] = perGr[t.gruppo_id] || []).push(t); });
  stzDati.gru.forEach(function(g){
    var dentro = perGr[g.id];
    if(!dentro || !dentro.length) return;        /* ⛔ il vuoto non si disegna */
    var d = document.createElement("div");
    d.className = "gr";
    var cp = document.createElement("div");
    cp.className = "cp";
    var b = document.createElement("b"); b.textContent = g.nome || "";
    cp.appendChild(b);
    if(g.descrizione){
      var em = document.createElement("em"); em.textContent = g.descrizione;
      cp.appendChild(em);
    }
    d.appendChild(cp);
    dentro.forEach(function(t){
      var bt = document.createElement("button");
      bt.type = "button";
      bt.className = "tal" + (stzPresi[t.id] ? " preso" : "");
      bt.style.setProperty("--c", st.col);
      var bx = document.createElement("span");
      bx.className = "box"; bx.textContent = stzPresi[t.id] ? "\u2713" : "";
      var nm = document.createElement("span"); nm.textContent = t.nome;
      bt.appendChild(bx); bt.appendChild(nm);
      bt.onclick = async function(){
        bt.disabled = true;
        await stzPrendi(t, st);
        stzDisegna(box);
      };
      d.appendChild(bt);
    });
    des.appendChild(d);
  });

  box.appendChild(des);
}

window.SpazioVivo = window.SpazioVivo || {};
window.SpazioVivo.stanze = stanze;
