/* ═══════════════════════════════════════════════════════════════
   LA BARRA — il cassetto che si apre dal tasto a tre righe.

   ⛔ Disegno di Design del 13 settembre (`barra.html`), preso riga
      per riga: la testata, le due voci, le cinque stanze, il piede.

   ⭐ Il difetto corretto: il marchio aveva un margine negativo e
      copriva il nome. Ora sta in riga.

   ⭐ Le voci vengono dalla tavola `stanze`, come prima. Il SEME le
      disegna al primo istante, poi il database ridisegna sopra.

   ⭐ IL PIEDE è nuovo: il tasto dell'account. L'arco attorno al
      volto è il grado dal database — `persone.grado` e `livello_n`.

   Espone: SpazioVivo.apriBarra() · chiudiBarra() · barraQui(rotta)
   ═══════════════════════════════════════════════════════════════ */

"use strict";

/* ── il seme: le voci al primo istante, senza aspettare il database ── */
var BR_SEME = {
  voci: [
    { id:"orme",     nome:"La mia orma",  rotta:"orme" },
    { id:"sentiero", nome:"Antaḥkaraṇa", rotta:"anthakarana" }
  ],
  stanze: [
    { id:"vicinati",   nome:"Vicinati",   rotta:"vicinati",   c:"--terra" },
    { id:"emporio",    nome:"Emporio",    rotta:"emporio",    c:"--acqua" },
    { id:"assistenza", nome:"Assistenza", rotta:"assistenza", c:"--fuoco" },
    { id:"edizione",   nome:"Edizione",   rotta:"edizione",   c:"--aria"  },
    { id:"scuola",     nome:"Scuola",     rotta:"scuola",     c:"--etere" }
  ]
};

var brAperta = false, brQui = "orme", brChi = null;

function brVeste(){
  if(document.getElementById("fm-br-veste")) return;
  var s = document.createElement("style");
  s.id = "fm-br-veste";
  s.textContent =
    "#sv-apri-barra{position:fixed;top:.9rem;left:.9rem;z-index:64;" +
      "width:2.6rem;height:2.6rem;border-radius:.55rem;cursor:pointer;" +
      "border:1px solid rgba(245,240,230,.16);background:rgba(23,28,54,.9);" +
      "display:flex;flex-direction:column;justify-content:center;" +
      "align-items:center;gap:.28rem;transition:.2s}" +
    "#sv-apri-barra i{display:block;width:1.35rem;height:.11rem;" +
      "border-radius:1rem;background:#F5F0E6}" +
    "#sv-velo-barra{position:fixed;inset:0;z-index:65;background:rgba(4,6,14,.55);" +
      "opacity:0;pointer-events:none;transition:opacity .22s}" +
    "#sv-velo-barra.si{opacity:1;pointer-events:auto}" +

    ".sv-barra{position:fixed;top:0;left:0;bottom:0;z-index:66;width:79%;" +
      "max-width:19rem;background:#171C36;display:flex;flex-direction:column;" +
      "box-shadow:.4rem 0 2rem rgba(0,0,0,.45);" +
      "transform:translateX(-100%);transition:transform .22s ease;" +
      "font-family:'DM Sans',system-ui,sans-serif;color:#F5F0E6;" +
      "overflow-y:auto;scrollbar-width:none}" +
    ".sv-barra::-webkit-scrollbar{display:none}" +
    ".sv-barra.aperta{transform:none}" +
    ".sv-barra *{box-sizing:border-box}" +

    /* ⛔ la testata: il marchio NON ha più il margine negativo che
       copriva il nome. Difetto visto da Gab il 13 settembre. */
    ".sv-barra .testa{background:#1B2140;padding:1.1rem 1rem;" +
      "display:flex;align-items:center;gap:.7rem;flex:none;" +
      "border-bottom:1px solid rgba(245,240,230,.06)}" +
    ".sv-barra .tre{flex:none;width:2.6rem;height:2.6rem;border-radius:.55rem;" +
      "border:1px solid rgba(245,240,230,.16);background:rgba(245,240,230,.06);" +
      "display:flex;flex-direction:column;justify-content:center;" +
      "align-items:center;gap:.28rem;cursor:pointer;transition:.2s}" +
    ".sv-barra .tre i{display:block;width:1.35rem;height:.11rem;" +
      "border-radius:1rem;background:#F5F0E6}" +
    ".sv-barra .marchio{flex:none;width:2.2rem;height:2.2rem;border-radius:.5rem;" +
      "overflow:hidden;border:1px dashed rgba(245,240,230,.22)}" +
    ".sv-barra .marchio img{width:100%;height:100%;object-fit:contain}" +
    ".sv-barra .nome{min-width:0;flex:1}" +
    ".sv-barra .nome b{display:block;font-family:'Cinzel',serif;font-weight:400;" +
      "font-size:1.16rem;line-height:1.1;white-space:nowrap;" +
      "overflow:hidden;text-overflow:ellipsis}" +
    ".sv-barra .nome span{display:block;font-family:'Cormorant Garamond',serif;" +
      "font-style:italic;font-size:.96rem;color:#C8A055;opacity:.85;margin-top:.1rem}" +

    ".sv-barra .voci{flex:none;border-bottom:1px solid rgba(245,240,230,.06)}" +
    ".sv-barra .vo{display:flex;align-items:center;gap:.8rem;width:100%;" +
      "min-height:3.2rem;padding:.95rem 1rem;border:0;border-left:3px solid transparent;" +
      "background:transparent;color:inherit;text-align:left;cursor:pointer;" +
      "font-family:inherit;transition:.18s}" +
    ".sv-barra .vo:hover,.sv-barra .vo:focus-visible{background:rgba(245,240,230,.045)}" +
    ".sv-barra .vo.qui{background:rgba(245,240,230,.07);border-left-color:#C8A055}" +
    ".sv-barra .vo .sg{flex:none;width:1.7rem;height:1.7rem;border-radius:.35rem;" +
      "border:1px dashed rgba(245,240,230,.2)}" +
    ".sv-barra .vo b{font-family:'Cinzel',serif;font-weight:400;font-size:1.08rem;" +
      "color:rgba(245,240,230,.82)}" +
    ".sv-barra .vo.qui b{color:#F5F0E6}" +

    ".sv-barra .cosa{flex:none;padding:1.1rem 1rem .5rem;font-size:.86rem;" +
      "letter-spacing:.22em;text-transform:uppercase;color:rgba(245,240,230,.34)}" +
    ".sv-barra .stanze{flex:none;padding:0 1rem 1rem;display:flex;" +
      "flex-direction:column;gap:.55rem}" +
    ".sv-barra .st{display:flex;align-items:center;gap:.7rem;width:100%;" +
      "min-height:2.9rem;padding:.72rem .9rem;cursor:pointer;text-align:left;" +
      "border-radius:.7rem;font-family:inherit;" +
      "border:1px solid color-mix(in srgb,var(--c) 26%,transparent);" +
      "background:color-mix(in srgb,var(--c) 9%,rgba(245,240,230,.03));transition:.18s}" +
    ".sv-barra .st:hover,.sv-barra .st:focus-visible{" +
      "background:color-mix(in srgb,var(--c) 18%,rgba(245,240,230,.03));" +
      "border-color:color-mix(in srgb,var(--c) 55%,transparent)}" +
    ".sv-barra .st i{flex:none;width:.5rem;height:.5rem;border-radius:50%;background:var(--c)}" +
    ".sv-barra .st b{font-family:'Cormorant Garamond',serif;font-style:italic;" +
      "font-weight:400;font-size:1.28rem;line-height:1;color:var(--c)}" +

    /* ⭐ il piede: il tasto dell'account */
    ".sv-barra .conto{margin-top:auto;flex:none;padding:.9rem 1rem 1.1rem;" +
      "border-top:1px solid rgba(245,240,230,.07);background:rgba(8,11,26,.3)}" +
    ".sv-barra .conto button{display:flex;align-items:center;gap:.75rem;width:100%;" +
      "min-height:3.2rem;padding:.6rem .7rem;border-radius:.7rem;cursor:pointer;" +
      "text-align:left;border:1px solid rgba(245,240,230,.09);" +
      "background:rgba(245,240,230,.03);color:inherit;font-family:inherit;transition:.18s}" +
    ".sv-barra .conto button:hover,.sv-barra .conto button:focus-visible{" +
      "background:rgba(200,160,85,.1);border-color:rgba(200,160,85,.4)}" +
    ".sv-barra .conto .segno{flex:none;width:2.6rem;height:2.6rem;" +
      "position:relative;display:grid;place-items:center}" +
    ".sv-barra .conto .segno svg{position:absolute;inset:0;width:100%;height:100%}" +
    ".sv-barra .conto .volto{width:1.9rem;height:1.9rem;border-radius:50%;" +
      "overflow:hidden;border:1px dashed rgba(245,240,230,.2);" +
      "background:rgba(245,240,230,.04)}" +
    ".sv-barra .conto .volto img{width:100%;height:100%;object-fit:cover}" +
    ".sv-barra .conto .tx{flex:1;min-width:0}" +
    ".sv-barra .conto .tx b{display:block;font-weight:400;font-size:.96rem;" +
      "color:rgba(245,240,230,.9);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}" +
    ".sv-barra .conto .tx span{display:block;font-family:'Cormorant Garamond',serif;" +
      "font-style:italic;font-size:.86rem;color:#C8A055;opacity:.8;margin-top:.05rem}" +
    ".sv-barra .conto .fr{flex:none;color:rgba(245,240,230,.25);font-size:.9rem}" +

    "@media (min-width:52rem){" +
      "#sv-apri-barra,#sv-velo-barra{display:none}" +
      ".sv-barra{position:sticky;transform:none;max-width:17.5rem;box-shadow:none}}" +
    "@media (prefers-reduced-motion:reduce){.sv-barra{transition:none}}";
  document.head.appendChild(s);
}

/* ── il disegno ─────────────────────────────────────────────────── */
function brDisegna(){
  var n = document.getElementById("sv-barra");
  if(!n) return;
  n.innerHTML = "";

  var testa = document.createElement("div");
  testa.className = "testa";
  var tre = document.createElement("button");
  tre.type = "button"; tre.className = "tre";
  tre.setAttribute("aria-label", "Chiudi la barra");
  tre.innerHTML = "<i></i><i></i><i></i>";
  tre.onclick = chiudiBarra;
  var mar = document.createElement("span");
  mar.className = "marchio"; mar.setAttribute("aria-hidden", "true");
  var nm = document.createElement("div");
  nm.className = "nome";
  nm.innerHTML = "<b>FelicitasMundi</b><span>Comunit\u00e0 Eterna</span>";
  testa.appendChild(tre); testa.appendChild(mar); testa.appendChild(nm);
  n.appendChild(testa);

  var voci = document.createElement("div");
  voci.className = "voci";
  BR_SEME.voci.forEach(function(v){
    var b = document.createElement("button");
    b.type = "button";
    b.className = "vo" + (brQui === v.rotta ? " qui" : "");
    if(brQui === v.rotta) b.setAttribute("aria-current", "page");
    b.innerHTML = '<span class="sg" aria-hidden="true"></span>';
    var t = document.createElement("b"); t.textContent = v.nome;
    b.appendChild(t);
    b.onclick = function(){ brVai(v.rotta); };
    voci.appendChild(b);
  });
  n.appendChild(voci);

  var cosa = document.createElement("div");
  cosa.className = "cosa"; cosa.textContent = "Cosa incontri";
  n.appendChild(cosa);

  var stz = document.createElement("div");
  stz.className = "stanze";
  BR_SEME.stanze.forEach(function(s){
    var b = document.createElement("button");
    b.type = "button"; b.className = "st";
    b.style.setProperty("--c", "var(" + s.c + ")");
    b.innerHTML = '<i aria-hidden="true"></i>';
    var t = document.createElement("b"); t.textContent = s.nome;
    b.appendChild(t);
    b.onclick = function(){ brVai(s.rotta); };
    stz.appendChild(b);
  });
  n.appendChild(stz);

  /* ⭐ il piede: l'arco è il grado, non un completamento */
  var chi = brChi || {};
  var gr = Math.max(0, Math.min(1, (chi.livello_n || 0) / 7));
  var conto = document.createElement("div");
  conto.className = "conto";
  var b = document.createElement("button");
  b.type = "button";
  b.innerHTML =
    '<span class="segno"><svg viewBox="0 0 100 100" aria-hidden="true">' +
    '<circle cx="50" cy="50" r="44" fill="none" stroke="rgba(245,240,230,.08)" stroke-width="4"/>' +
    '<circle cx="50" cy="50" r="44" fill="none" stroke="#C8A055" stroke-width="4"' +
    ' stroke-linecap="round" transform="rotate(-90 50 50)" stroke-dasharray="276"' +
    ' stroke-dashoffset="' + (276 - 276 * gr).toFixed(0) + '"' +
    ' style="filter:drop-shadow(0 0 3px rgba(212,175,106,.55))"/></svg>' +
    '<span class="volto" aria-hidden="true">' +
    (chi.foto_url ? '<img src="' + chi.foto_url + '" alt="">' : '') +
    '</span></span>';
  var tx = document.createElement("span");
  tx.className = "tx";
  var nb = document.createElement("b"); nb.textContent = chi.nome || "Il tuo account";
  var ng = document.createElement("span"); ng.textContent = chi.grado || "";
  tx.appendChild(nb); if(chi.grado) tx.appendChild(ng);
  b.appendChild(tx);
  var fr = document.createElement("span");
  fr.className = "fr"; fr.setAttribute("aria-hidden","true"); fr.textContent = "\u203a";
  b.appendChild(fr);
  b.onclick = function(){ brVai("account"); };
  conto.appendChild(b);
  n.appendChild(conto);
}

function brVai(rotta){
  brQui = rotta;
  chiudiBarra();
  if(typeof vai === "function") vai(rotta);
}

function apriBarra(){
  brAperta = true;
  var n = document.getElementById("sv-barra");
  var v = document.getElementById("sv-velo-barra");
  if(n) n.classList.add("aperta");
  if(v) v.classList.add("si");
}
function chiudiBarra(){
  brAperta = false;
  var n = document.getElementById("sv-barra");
  var v = document.getElementById("sv-velo-barra");
  if(n) n.classList.remove("aperta");
  if(v) v.classList.remove("si");
}
function barraQui(rotta){ brQui = rotta; brDisegna(); }

/* ── chi sono, dal database ─────────────────────────────────────── */
async function brChiSono(){
  try{
    var u = await db.auth.getUser();
    var id = u && u.data && u.data.user && u.data.user.id;
    if(!id) return;
    var r = await db.from("persone")
      .select("nome,grado,livello_n,talenti,foto_url")
      .eq("id", id).single();
    if(!r.error && r.data){ brChi = r.data; brDisegna(); }
  }catch(e){ console.warn("barra:", e); }
}

/* ── l'innesto ──────────────────────────────────────────────────── */
(function(){
  brVeste();
  var t = document.createElement("button");
  t.id = "sv-apri-barra"; t.type = "button";
  t.setAttribute("aria-label", "Apri la barra");
  t.innerHTML = "<i></i><i></i><i></i>";
  t.onclick = apriBarra;

  var v = document.createElement("div");
  v.id = "sv-velo-barra";
  v.onclick = chiudiBarra;

  var n = document.createElement("nav");
  n.className = "sv-barra"; n.id = "sv-barra";
  n.setAttribute("aria-label", "Le pagine");

  document.body.insertBefore(n, document.body.firstChild);
  document.body.insertBefore(v, document.body.firstChild);
  document.body.insertBefore(t, document.body.firstChild);

  brDisegna();
  brChiSono();

  document.addEventListener("keydown", function(e){
    if(e.key === "Escape" && brAperta) chiudiBarra();
  });
})();

window.SpazioVivo = window.SpazioVivo || {};
/* ⭐ IL GUSCIO CHIAMA disegnaBarra() in sei punti — i passaggi di
   sessione: entra, esce, primo istante. Qui si espone lo stesso
   gesto: la barra si ridisegna e rilegge chi è dentro.
   ⛔ Così i sei richiami del guscio non si toccano: se domani
      cambia la barra, cambia un file solo. */
function ridisegnaBarra(){ brDisegna(); brChiSono(); }

window.SpazioVivo.ridisegnaBarra = ridisegnaBarra;
window.disegnaBarra = ridisegnaBarra;
window.SpazioVivo.apriBarra   = apriBarra;
window.SpazioVivo.chiudiBarra = chiudiBarra;
window.SpazioVivo.barraQui    = barraQui;
