/* ═══════════════════════════════════════════════════════════════
   ANTAHKARANA — la finestra del praticantato.

   ⛔ Disegno da `antahkarana-guscio.html` (13 settembre), preso
      riga per riga: le soglie, i blocchi, i lucchetti, le due carte.

   ⭐ LE QUATTRO SOGLIE non sono quattro pagine: è la stessa, e
      ogni blocco porta la sua soglia. Il livello — che `fm_livello`
      calcola da sé — apre quello che deve.
        1 ospite · 2 praticante · 3 operatore · 4 nucleo

   ⭐ LA DIFFERENZA FRA I DUE TIPI sta qui e non dentro le orme:
      ripeterla a ogni orma sarebbe rumore.

   ⚠️ I karma yoga veri vengono da `bisogni`; le lezioni dalla
      Scuola, richiamate — non copiate: una lezione non esiste due
      volte, e non si deve decidere di chi è.

   Espone: SpazioVivo.antahkarana(dove)
   ═══════════════════════════════════════════════════════════════ */

"use strict";

var akLiv = 1, akBox = null, akDati = null;

function akVeste(){
  if(document.getElementById("fm-ak-veste")) return;
  var s = document.createElement("style");
  s.id = "fm-ak-veste";
  s.textContent =
    ".fm-ak{width:100%;max-width:32rem;margin:0 auto;min-height:100vh;" +
      "background:#14172B;padding:1.5rem 1rem 3rem;position:relative;" +
      "overflow:hidden;font-family:'DM Sans',system-ui,sans-serif;color:#F5F0E6}" +
    ".fm-ak *{box-sizing:border-box}" +
    ".fm-ak::before{content:'';position:absolute;inset:0;pointer-events:none;" +
      "background:radial-gradient(ellipse at 22% 4%,rgba(58,88,160,.3),transparent 54%)," +
      "radial-gradient(ellipse at 82% 96%,rgba(70,52,120,.2),transparent 56%)}" +
    ".fm-ak > *{position:relative}" +

    ".fm-ak .oc{font-size:.64rem;letter-spacing:.2em;text-transform:uppercase;" +
      "color:#C8A055;margin-bottom:.3rem}" +
    ".fm-ak h1{font-family:'Cinzel',serif;font-weight:400;font-size:1.42rem;" +
      "line-height:1.2;margin:0 0 .25rem}" +
    ".fm-ak .sot{font-family:'Cormorant Garamond',serif;font-style:italic;" +
      "font-size:1rem;color:rgba(245,240,230,.6);line-height:1.5;margin-bottom:.9rem}" +
    ".fm-ak .tit{font-size:.6rem;letter-spacing:.15em;text-transform:uppercase;" +
      "color:#C8A055;margin:1.5rem 0 .5rem;padding-top:1rem;" +
      "border-top:1px solid rgba(184,150,62,.22)}" +
    ".fm-ak .tit span{color:rgba(245,240,230,.34);letter-spacing:.06em}" +

    /* ⭐ i due riquadri della differenza */
    ".fm-ak .dif{display:grid;gap:.4rem;margin:0 0 .6rem}" +
    "@media(min-width:27rem){.fm-ak .dif{grid-template-columns:1fr 1fr}}" +
    ".fm-ak .dif > div{border:1px solid rgba(245,240,230,.1);border-radius:.7rem;" +
      "background:rgba(8,11,26,.3);padding:.55rem .7rem}" +
    ".fm-ak .dif b{display:block;font-family:'Cinzel',serif;font-weight:400;" +
      "font-size:.9rem;color:#D4AF6A}" +
    ".fm-ak .dif span{display:block;font-family:'Cormorant Garamond',serif;" +
      "font-size:.9rem;line-height:1.4;color:rgba(245,240,230,.6);margin-top:.1rem}" +

    ".fm-ak .lucc{display:flex;align-items:center;gap:.5rem;" +
      "border:1px dashed rgba(245,240,230,.18);border-radius:.75rem;" +
      "background:rgba(8,11,26,.35);padding:.7rem .8rem;" +
      "font-size:.86rem;color:rgba(245,240,230,.42);line-height:1.45}" +
    ".fm-ak .lucc b{color:#D4AF6A;font-weight:400}" +
    ".fm-ak .lucc i{font-style:normal;font-size:1rem;color:rgba(245,240,230,.3)}" +

    ".fm-ak .rg{display:flex;align-items:flex-start;gap:.65rem;" +
      "border:1px solid rgba(200,160,85,.2);border-radius:.75rem;" +
      "background:rgba(200,160,85,.05);padding:.6rem .75rem;margin-bottom:.35rem}" +
    ".fm-ak .rg .tx{flex:1;min-width:0}" +
    ".fm-ak .rg .q{display:inline-block;font-size:.64rem;padding:.08rem .48rem;" +
      "border-radius:1rem;border:1px solid rgba(245,240,230,.18);" +
      "color:rgba(245,240,230,.55);margin-bottom:.25rem}" +
    ".fm-ak .rg .tx b{display:block;font-weight:400;font-size:.94rem;line-height:1.3}" +
    ".fm-ak .rg .tx i{display:block;font-style:normal;" +
      "font-family:'Cormorant Garamond',serif;font-size:.86rem;" +
      "color:rgba(245,240,230,.45);margin-top:.1rem}" +
    ".fm-ak .rg .pr{flex:none;align-self:center;font-size:.76rem;min-height:2.2rem;" +
      "padding:0 .8rem;border-radius:1rem;cursor:pointer;white-space:nowrap;" +
      "font-family:inherit;border:1px solid rgba(110,158,90,.55);color:#6E9E5A;" +
      "filter:brightness(1.2);background:rgba(110,158,90,.12)}" +
    ".fm-ak .rg .pr[disabled]{opacity:.5;cursor:default}" +
    ".fm-ak .vuoto{font-family:'Cormorant Garamond',serif;font-style:italic;" +
      "font-size:.94rem;color:rgba(245,240,230,.35);padding:.6rem .2rem}" +

    ".fm-ak .lz{border:1px solid color-mix(in srgb,var(--c) 26%,transparent);" +
      "border-left:3px solid color-mix(in srgb,var(--c) 58%,transparent);" +
      "border-radius:.75rem;padding:.65rem .8rem;margin-bottom:.35rem;" +
      "background:color-mix(in srgb,var(--c) 7%,rgba(8,11,26,.42))}" +
    ".fm-ak .lz .dv{font-size:.62rem;letter-spacing:.12em;text-transform:uppercase;" +
      "color:var(--c);filter:brightness(1.3)}" +
    ".fm-ak .lz b{display:block;font-family:'Cormorant Garamond',serif;" +
      "font-weight:400;font-size:1.06rem;line-height:1.3;margin-top:.08rem}" +
    ".fm-ak .lz .me{display:flex;gap:.35rem;align-items:center;flex-wrap:wrap;" +
      "margin-top:.3rem;font-size:.78rem;color:rgba(245,240,230,.48)}" +
    ".fm-ak .lz .me .co{color:#D4AF6A}" +
    ".fm-ak .lz .me .pr2{font-size:.74rem;min-height:2.2rem;padding:0 .7rem;" +
      "border-radius:1rem;margin-left:auto;cursor:pointer;white-space:nowrap;" +
      "font-family:inherit;background:transparent;" +
      "border:1px solid color-mix(in srgb,var(--c) 50%,transparent);" +
      "color:var(--c);filter:brightness(1.3)}" +

    ".fm-ak .cards{display:grid;grid-template-columns:1fr;gap:.5rem}" +
    "@media(min-width:27rem){.fm-ak .cards{grid-template-columns:1fr 1fr}}" +
    ".fm-ak .cd{border:1px solid color-mix(in srgb,var(--c) 32%,transparent);" +
      "border-radius:.85rem;padding:.85rem;background:linear-gradient(160deg," +
      "color-mix(in srgb,var(--c) 12%,rgba(8,11,26,.5)),rgba(8,11,26,.5))}" +
    ".fm-ak .cd .n{font-family:'Cinzel',serif;font-weight:400;font-size:.95rem;" +
      "color:var(--c);filter:brightness(1.3)}" +
    ".fm-ak .cd .pz{font-family:'Cinzel',serif;font-size:1.5rem;" +
      "line-height:1.1;margin:.25rem 0 .1rem}" +
    ".fm-ak .cd .pz small{font-size:.7rem;color:rgba(245,240,230,.42);" +
      "font-family:'DM Sans',sans-serif}" +
    ".fm-ak .cd ul{list-style:none;margin:.45rem 0 .6rem;padding:0}" +
    ".fm-ak .cd li{font-size:.85rem;line-height:1.45;color:rgba(245,240,230,.7);" +
      "padding-left:.9rem;position:relative;margin-bottom:.15rem}" +
    ".fm-ak .cd li::before{content:'\\00B7';position:absolute;left:.15rem;" +
      "color:var(--c);filter:brightness(1.4);font-weight:700}" +
    ".fm-ak .cd li b{color:var(--c);filter:brightness(1.25);font-weight:400}" +
    ".fm-ak .cd .ts{display:block;width:100%;text-align:center;font-size:.82rem;" +
      "min-height:2.6rem;border-radius:1.2rem;cursor:pointer;font-family:inherit;" +
      "border:1px solid color-mix(in srgb,var(--c) 55%,transparent);" +
      "color:var(--c);filter:brightness(1.3);" +
      "background:color-mix(in srgb,var(--c) 10%,transparent)}" +
    ".fm-ak .cd .op{font-size:.76rem;color:rgba(245,240,230,.42);" +
      "text-align:center;margin-top:.4rem}" +
    ".fm-ak .cd .op b{color:#6E9E5A;filter:brightness(1.2);font-weight:400}" +

    ".fm-ak .nota{border:1px solid rgba(184,150,62,.22);border-radius:.85rem;" +
      "background:rgba(6,9,22,.5);padding:.9rem;margin:.9rem 0;font-size:.9rem;" +
      "line-height:1.55;color:rgba(245,240,230,.8)}" +
    ".fm-ak .nota b{color:#D4AF6A;font-weight:500}" +
    "@media (prefers-reduced-motion:reduce){.fm-ak *{transition:none}}";
  document.head.appendChild(s);
}

/* ── leggere ────────────────────────────────────────────────────── */
async function akLeggi(){
  var d = { liv:1, bisogni:[], chi:null };
  try{
    var u = await db.auth.getUser();
    var id = u && u.data && u.data.user && u.data.user.id;
    if(id){
      var p = await db.from("persone")
        .select("nome,grado,livello_n,cammino,karma_yoga,quota_attiva")
        .eq("id", id).single();
      if(!p.error && p.data){
        d.chi = p.data;
        d.liv = Math.max(1, Math.min(4, p.data.livello_n || 1));
      }
    }
    /* ⭐ i karma yoga veri: i bisogni ancora aperti */
    var b = await db.from("bisogni")
      .select("id,titolo,dettaglio,entro,quanti,presi")
      .is("preso_da", null).order("entro").limit(6);
    if(!b.error) d.bisogni = b.data || [];
  }catch(e){ console.warn("antahkarana:", e); }
  return d;
}

/* ⭐ prendere un karma yoga: il gesto che il database già conosce.
   Chi prende passa da sé a «in cammino», se era ai primi passi. */
async function akPrendi(id, tasto){
  tasto.disabled = true;
  tasto.textContent = "un momento\u2026";
  try{
    var r = await db.rpc("fm_prendi_bisogno", { p_bisogno: id });
    if(r.error) throw r.error;
    tasto.textContent = "\u00e8 tuo";
    setTimeout(function(){ antahkarana(akBox); }, 900);
  }catch(e){
    tasto.textContent = "non \u00e8 andata";
    tasto.disabled = false;
    console.warn("antahkarana:", e);
  }
}

/* ── i mattoni ──────────────────────────────────────────────────── */
function akTit(box, testo, coda){
  var d = document.createElement("div");
  d.className = "tit"; d.textContent = testo;
  if(coda){
    var s = document.createElement("span");
    s.textContent = " \u00b7 " + coda; d.appendChild(s);
  }
  box.appendChild(d);
  return d;
}
function akLucchetto(box, cosa, quando){
  var d = document.createElement("div");
  d.className = "lucc";
  d.innerHTML = '<i>\u2609</i><span><b></b><br></span>';
  d.querySelector("b").textContent = cosa;
  d.querySelector("span").appendChild(document.createTextNode(quando));
  box.appendChild(d);
}
function akLezione(box, dove, nome, quando, costo, tasto, colore){
  var d = document.createElement("div");
  d.className = "lz"; d.style.setProperty("--c", "var(" + colore + ")");
  d.innerHTML = '<div class="dv"></div><b></b><div class="me">' +
    '<span class="q1"></span><span>\u00b7</span><span class="co"></span></div>';
  d.querySelector(".dv").textContent = dove;
  d.querySelector("b").textContent = nome;
  d.querySelector(".q1").textContent = quando;
  d.querySelector(".co").textContent = costo;
  var b = document.createElement("button");
  b.type = "button"; b.className = "pr2"; b.textContent = tasto;
  d.querySelector(".me").appendChild(b);
  box.appendChild(d);
}

/* ── il disegno ─────────────────────────────────────────────────── */
function akDisegna(box){
  var d = akDati || { liv:1, bisogni:[] };
  akLiv = d.liv;
  box.className = "fm-ak";
  box.innerHTML = "";

  var oc = document.createElement("div");
  oc.className = "oc"; oc.textContent = "il praticantato";
  box.appendChild(oc);
  var h = document.createElement("h1"); h.textContent = "Anta\u1e25kara\u1e47a";
  box.appendChild(h);
  var so = document.createElement("div");
  so.className = "sot"; so.textContent = "[ la luna e la data ]";
  box.appendChild(so);

  /* ── ① karma yoga, aperto a tutti ── */
  akTit(box, "Karma yoga", "puoi prenderne uno adesso");

  /* ⭐ la differenza fra i due tipi: sta qui, non dentro le orme */
  var dif = document.createElement("div");
  dif.className = "dif";
  dif.innerHTML =
    '<div><b>obiettivo</b><span>comporta uno scambio nella squadra, ' +
    'anche a livello economico</span></div>' +
    '<div><b>karma yoga</b><span>\u00e8 servizio alla comunit\u00e0</span></div>';
  box.appendChild(dif);

  if(!d.bisogni.length){
    var v = document.createElement("div");
    v.className = "vuoto";
    v.textContent = "Non c\u2019\u00e8 niente da prendere in questo momento.";
    box.appendChild(v);
  }else d.bisogni.forEach(function(b){
    var r = document.createElement("div");
    r.className = "rg";
    r.innerHTML = '<div class="tx"><span class="q"></span><b></b><i></i></div>';
    var q = r.querySelector(".q");
    if(b.entro) q.textContent = "entro " + b.entro; else q.remove();
    r.querySelector("b").textContent = b.titolo || "";
    var i = r.querySelector("i");
    var coda = [];
    if(b.dettaglio) coda.push(b.dettaglio);
    if(b.quanti) coda.push((b.presi || 0) + " su " + b.quanti);
    if(coda.length) i.textContent = coda.join(" \u00b7 "); else i.remove();
    var t = document.createElement("button");
    t.type = "button"; t.className = "pr"; t.textContent = "lo prendo";
    t.onclick = function(){ akPrendi(b.id, t); };
    r.appendChild(t);
    box.appendChild(r);
  });

  /* ── ② assistenza spirituale ── */
  akTit(box, "Assistenza spirituale", "aperta a chi entra");
  akLezione(box, "Scuola \u00b7 online", "Il primo colloquio",
    "quando vuoi", "gratuito", "prenota", "--etere");
  akLezione(box, "Scuola \u00b7 ogni luna nuova", "Il cerchio d\u2019ascolto",
    "21:00, un\u2019ora", "gratuito", "prenota", "--etere");

  /* ── ③ come si sta dentro ── */
  akTit(box, "Come si sta dentro");
  var cds = document.createElement("div");
  cds.className = "cards";
  cds.innerHTML =
    '<div class="cd" style="--c:var(--terra)"><div class="n">La piattaforma</div>' +
    '<div class="pz">26 &euro; <small>al mese</small></div><ul>' +
    '<li>Le tue orme e i tuoi talenti</li><li>Le squadre e il calendario</li>' +
    '<li>La Rubrica dei contatti</li>' +
    '<li><b>Il gestionale della contabilit\u00e0 dei talenti</b>: quanto rende e quanto costa ognuno</li>' +
    '<li>L\u2019Emporio: metti quello che fai</li></ul>' +
    '<button type="button" class="ts">comincia</button>' +
    '<div class="op">oppure <b>fai karma yoga</b> e non paghi</div></div>' +
    '<div class="cd" style="--c:var(--etere)"><div class="n">Il praticantato</div>' +
    '<div class="pz">80 &euro; <small>al mese</small></div><ul>' +
    '<li>Ogni luned\u00ec parte qualcosa</li><li>L\u2019incontro dal vivo, a ogni luna</li>' +
    '<li>La scrittura e il disegno in geometria sacra</li>' +
    '<li>Il registro dei tuoi cicli</li><li>Le lezioni legate al ciclo</li></ul>' +
    '<button type="button" class="ts">prendi il tuo posto</button>' +
    '<div class="op">oppure <b>karma yoga per lo sviluppo</b></div></div>';
  box.appendChild(cds);

  /* ── ④ gli esercizi — soglia 2 ── */
  akTit(box, "Gli esercizi di questa settimana");
  if(akLiv >= 2){
    ["[ un esercizio ]","[ un altro ]","[ un terzo ]"].forEach(function(t){
      var r = document.createElement("div");
      r.className = "rg";
      r.innerHTML = '<div class="tx"><span class="q">[ quando ]</span><b></b>' +
        '<i>[ come si fa ]</i></div>';
      r.querySelector("b").textContent = t;
      box.appendChild(r);
    });
  }else akLucchetto(box, "Gli esercizi di questa settimana",
    "si aprono quando cominci il praticantato o il karma yoga");

  /* ── ⑤ le lezioni — soglia 2 ── */
  akTit(box, "Le lezioni di questa luna", "stanno nella Scuola, si aprono da qui");
  if(akLiv >= 2){
    akLezione(box, "Scuola \u00b7 [ ambito ]", "[ il titolo ]",
      "[ quando ]", "[ il costo ]", "entra", "--etere");
  }else akLucchetto(box, "Le lezioni di questa luna",
    "si aprono quando cominci il praticantato o il karma yoga");

  /* ── ⑥ portare un percorso — soglia 3 ── */
  akTit(box, "Portare un percorso tuo");
  if(akLiv >= 3){
    akLezione(box, "per chi ha passato il vaglio",
      "[ come si propone un percorso ]", "[ le parole di Gab ]", "", "", "--fuoco");
  }else akLucchetto(box, "Portare un percorso tuo",
    "si apre quando passi il vaglio");

  /* ── ⑦ il tema del ciclo — soglia 4 ── */
  akTit(box, "Il tema del ciclo");
  if(akLiv >= 4){
    akLezione(box, "chi tiene una stanza",
      "[ chi delibera il tema, e come ]", "[ le parole di Gab ]", "", "", "--nexus");
  }else akLucchetto(box, "Il tema del ciclo",
    "si apre a chi tiene una stanza");

  var n = document.createElement("div");
  n.className = "nota";
  n.innerHTML = "<b>Le lezioni stanno nella Scuola, e Antahkarana le richiama.</b> " +
    "Non le copia: dice <em>questa luna lavoriamo su questo, e c\u2019\u00e8 questo " +
    "corso</em>, e il collegamento porta l\u00e0. <b>Cos\u00ec una lezione non esiste " +
    "due volte, e non devi decidere di chi \u00e8.</b>";
  box.appendChild(n);
}

async function antahkarana(dove){
  var box = typeof dove === "string" ? document.querySelector(dove) : dove;
  if(!box) return;
  akVeste();
  akBox = box;
  akDisegna(box);
  akDati = await akLeggi();
  akDisegna(box);
}

window.SpazioVivo = window.SpazioVivo || {};
window.SpazioVivo.antahkarana = antahkarana;
