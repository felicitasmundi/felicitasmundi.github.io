/* ═══════════════════════════════════════════════════════════════
   RUBRICA · CALENDARIO · I COSTI — le tre pagine degli strumenti.

   ⛔ LA REGOLA DEL VUOTO, che vale per tutte e tre: il vuoto dice
      cosa ci sarà, non che non c'è niente. E fa vedere la forma
      spenta, così chi arriva capisce cosa troverà invece di
      guardare una pagina bianca.

   ⛔ E la pagina non giudica quello che uno fa: dice da dove
      arrivano i numeri, e basta.

   ⚠️ I MESI si generano dall'iscrizione a oggi. Un mese prima di
      quando uno è entrato è un tasto che non porta da nessuna parte.

   ⭐ I COSTI sommano da `spese`: importo · verso · giorno · ricorrente,
      e `orma_id` che aggancia al talento da cui la voce è nata.
      Le voci ricorrenti contano nel mese anche se sono scritte una
      volta sola.

   Espone: SpazioVivo.rubrica(dove) · calendario(dove) · costi(dove)
   ═══════════════════════════════════════════════════════════════ */

"use strict";

var ST_EL = [
  { k:"terra", n:"Vicinati",   c:"--terra" },
  { k:"acqua", n:"Emporio",    c:"--acqua" },
  { k:"fuoco", n:"Assistenza", c:"--fuoco" },
  { k:"aria",  n:"Edizione",   c:"--aria"  },
  { k:"etere", n:"Scuola",     c:"--etere" }
];
var MESI = ["gennaio","febbraio","marzo","aprile","maggio","giugno",
  "luglio","agosto","settembre","ottobre","novembre","dicembre"];
var GIORNI = ["dom","lun","mar","mer","gio","ven","sab"];

function stVeste(){
  if(document.getElementById("fm-st-veste")) return;
  var s = document.createElement("style");
  s.id = "fm-st-veste";
  s.textContent =
    ".fm-st{width:100%;max-width:31rem;margin:0 auto;min-height:100vh;" +
      "background:#14172B;padding:1.5rem 1rem 3rem;position:relative;" +
      "overflow:hidden;font-family:'DM Sans',system-ui,sans-serif;color:#F5F0E6}" +
    ".fm-st *{box-sizing:border-box}" +
    ".fm-st::before{content:'';position:absolute;inset:0;pointer-events:none;" +
      "background:radial-gradient(ellipse at 22% 4%,rgba(58,88,160,.3),transparent 54%)," +
      "radial-gradient(ellipse at 82% 96%,rgba(70,52,120,.2),transparent 56%)}" +
    ".fm-st > *{position:relative}" +

    ".fm-st .oc{font-size:.64rem;letter-spacing:.2em;text-transform:uppercase;" +
      "color:#C8A055;margin-bottom:.3rem}" +
    ".fm-st h1{font-family:'Cinzel',serif;font-weight:400;font-size:1.42rem;" +
      "line-height:1.2;margin:0 0 .25rem}" +
    ".fm-st .sot{font-family:'Cormorant Garamond',serif;font-style:italic;" +
      "font-size:1rem;color:rgba(245,240,230,.6);line-height:1.5;margin-bottom:1.1rem}" +

    /* ⭐ la riga del vuoto */
    ".fm-st .dice{border:1px dashed rgba(200,160,85,.3);border-radius:.9rem;" +
      "background:rgba(200,160,85,.05);padding:1rem 1.1rem;margin-bottom:.7rem}" +
    ".fm-st .dice > b{display:block;font-family:'Cinzel',serif;font-weight:400;" +
      "font-size:1.05rem;color:#D4AF6A;margin-bottom:.3rem}" +
    ".fm-st .dice p{font-family:'Cormorant Garamond',serif;font-size:1.02rem;" +
      "line-height:1.55;color:rgba(245,240,230,.62)}" +
    ".fm-st .dice p + p{margin-top:.45rem}" +
    ".fm-st .dice .come{display:block;margin-top:.7rem;padding-top:.6rem;" +
      "border-top:1px solid rgba(200,160,85,.18);font-size:.9rem;" +
      "font-family:'DM Sans',sans-serif;color:rgba(245,240,230,.45)}" +
    ".fm-st .dice .come em{font-style:normal;color:#D4AF6A}" +
    ".fm-st .et{font-size:.6rem;letter-spacing:.18em;text-transform:uppercase;" +
      "color:rgba(245,240,230,.24);margin:1rem 0 .4rem .1rem}" +
    ".fm-st .spenta{opacity:.36;pointer-events:none;filter:grayscale(.55)}" +

    ".fm-st .cerca{width:100%;background:rgba(245,240,230,.05);" +
      "border:1px solid rgba(245,240,230,.13);border-radius:1.4rem;" +
      "min-height:2.7rem;padding:0 .95rem;color:#F5F0E6;font-family:inherit;" +
      "font-size:.92rem;margin-bottom:.6rem}" +
    ".fm-st .cerca::placeholder{color:rgba(245,240,230,.32)}" +
    ".fm-st .filtri{display:flex;gap:.35rem;flex-wrap:wrap;margin-bottom:1rem}" +
    ".fm-st .filtri button{font-family:inherit;font-size:.78rem;min-height:2.2rem;" +
      "padding:0 .75rem;border-radius:1.4rem;cursor:pointer;background:transparent;" +
      "border:1px solid color-mix(in srgb,var(--c) 40%,rgba(245,240,230,.16));" +
      "color:rgba(245,240,230,.6);display:inline-flex;align-items:center;gap:.35rem}" +
    ".fm-st .filtri button i{width:.4rem;height:.4rem;border-radius:50%;" +
      "background:var(--c);display:block;flex:none}" +
    ".fm-st .filtri button.on{border-color:var(--c);" +
      "background:color-mix(in srgb,var(--c) 18%,transparent);color:#F5F0E6}" +

    ".fm-st .gruppo{font-size:.6rem;letter-spacing:.15em;text-transform:uppercase;" +
      "color:var(--c);filter:brightness(1.35);margin:.9rem 0 .4rem .1rem}" +
    ".fm-st .ct{display:flex;align-items:center;gap:.7rem;" +
      "border:1px solid color-mix(in srgb,var(--c) 24%,transparent);" +
      "border-left:3px solid color-mix(in srgb,var(--c) 58%,transparent);" +
      "border-radius:.75rem;padding:.6rem .75rem;margin-bottom:.35rem;" +
      "background:color-mix(in srgb,var(--c) 7%,rgba(8,11,26,.42))}" +
    ".fm-st .ct .av{width:2.2rem;height:2.2rem;border-radius:50%;flex:none;" +
      "display:grid;place-items:center;font-size:.66rem;overflow:hidden;" +
      "border:1px solid color-mix(in srgb,var(--c) 50%,transparent);" +
      "background:color-mix(in srgb,var(--c) 16%,transparent)}" +
    ".fm-st .ct .av img{width:100%;height:100%;object-fit:cover}" +
    ".fm-st .ct .tx{flex:1;min-width:0}" +
    ".fm-st .ct .tx b{display:block;font-weight:400;font-size:.95rem;line-height:1.25}" +
    ".fm-st .ct .tx i{display:block;font-style:normal;font-size:.74rem;" +
      "color:rgba(245,240,230,.44);margin-top:.1rem}" +
    ".fm-st .ct .ch{flex:none;width:2.2rem;height:2.2rem;border-radius:50%;" +
      "display:grid;place-items:center;text-decoration:none;" +
      "border:1px solid rgba(110,158,90,.5);background:rgba(110,158,90,.12);" +
      "color:#6E9E5A;filter:brightness(1.2)}" +

    ".fm-st .tempo{display:flex;gap:.4rem;margin-bottom:1rem}" +
    ".fm-st .tempo .q{flex:1;border:1px solid rgba(184,150,62,.22);" +
      "border-radius:.75rem;background:rgba(8,11,26,.4);padding:.55rem .3rem;" +
      "text-align:center}" +
    ".fm-st .tempo .q b{display:block;font-family:'Cinzel',serif;font-size:1rem;" +
      "color:#D4AF6A;line-height:1.1;font-weight:400}" +
    ".fm-st .tempo .q span{display:block;font-size:.6rem;" +
      "color:rgba(245,240,230,.42);margin-top:.2rem}" +

    ".fm-st .mesi{display:flex;gap:.3rem;overflow-x:auto;margin-bottom:.8rem;" +
      "padding-bottom:.2rem;scrollbar-width:none}" +
    ".fm-st .mesi::-webkit-scrollbar{display:none}" +
    ".fm-st .mesi button{font-family:inherit;font-size:.78rem;min-height:2.2rem;" +
      "padding:0 .85rem;border-radius:1.4rem;cursor:pointer;background:transparent;" +
      "white-space:nowrap;border:1px solid rgba(245,240,230,.16);" +
      "color:rgba(245,240,230,.5)}" +
    ".fm-st .mesi button.on{border-color:#C8A055;background:rgba(200,160,85,.16);" +
      "color:#D4AF6A}" +

    ".fm-st .dt{display:flex;align-items:stretch;gap:.7rem;margin-bottom:.35rem}" +
    ".fm-st .dt .qd{flex:none;width:2.8rem;border-radius:.65rem;display:flex;" +
      "flex-direction:column;align-items:center;justify-content:center;padding:.4rem 0;" +
      "border:1px solid color-mix(in srgb,var(--c) 35%,transparent);" +
      "background:color-mix(in srgb,var(--c) 12%,transparent)}" +
    ".fm-st .dt .qd b{font-family:'Cinzel',serif;font-size:1.15rem;line-height:1;" +
      "color:var(--c);filter:brightness(1.3);font-weight:400}" +
    ".fm-st .dt .qd span{font-size:.58rem;color:rgba(245,240,230,.4);margin-top:.15rem}" +
    ".fm-st .dt .cr{flex:1;min-width:0;border-radius:.75rem;padding:.6rem .75rem;" +
      "border:1px solid color-mix(in srgb,var(--c) 24%,transparent);" +
      "border-left:3px solid color-mix(in srgb,var(--c) 55%,transparent);" +
      "background:color-mix(in srgb,var(--c) 6%,rgba(8,11,26,.42))}" +
    ".fm-st .dt .cr .e2{font-size:.62rem;letter-spacing:.1em;text-transform:uppercase;" +
      "color:var(--c);filter:brightness(1.3)}" +
    ".fm-st .dt .cr b{display:block;font-family:'Cormorant Garamond',serif;" +
      "font-weight:400;font-size:1.08rem;line-height:1.3;margin-top:.05rem}" +
    ".fm-st .dt .cr .me{display:flex;gap:.35rem;align-items:center;flex-wrap:wrap;" +
      "margin-top:.25rem;font-size:.76rem;color:rgba(245,240,230,.44)}" +

    ".fm-st .conto{border:1px solid rgba(200,160,85,.32);border-radius:.9rem;" +
      "padding:1rem;margin-bottom:.7rem;background:linear-gradient(160deg," +
      "rgba(200,160,85,.09),rgba(8,11,26,.5))}" +
    ".fm-st .conto .rt{display:flex;justify-content:space-between;align-items:baseline;" +
      "padding:.3rem 0;font-size:.9rem;color:rgba(245,240,230,.55)}" +
    ".fm-st .conto .rt b{font-family:'Cinzel',serif;font-size:1.05rem;font-weight:400;" +
      "color:rgba(245,240,230,.4)}" +
    ".fm-st .conto .resta{display:flex;justify-content:space-between;align-items:baseline;" +
      "margin-top:.5rem;padding-top:.6rem;border-top:1px solid rgba(200,160,85,.22)}" +
    ".fm-st .conto .resta span{font-size:.72rem;letter-spacing:.12em;" +
      "text-transform:uppercase;color:rgba(245,240,230,.42)}" +
    ".fm-st .conto .resta b{font-family:'Cinzel',serif;font-size:1.5rem;" +
      "color:rgba(245,240,230,.45);font-weight:400}" +
    ".fm-st .conto .prima{font-size:.78rem;color:rgba(245,240,230,.32);" +
      "margin-top:.4rem;text-align:right;font-family:'Cormorant Garamond',serif;" +
      "font-style:italic}" +

    ".fm-st .qt{font-size:.6rem;letter-spacing:.15em;text-transform:uppercase;" +
      "color:rgba(245,240,230,.3);margin:.9rem 0 .35rem .1rem}" +
    ".fm-st .tl{display:flex;align-items:center;gap:.6rem;border-radius:.75rem;" +
      "padding:.6rem .75rem;margin-bottom:.35rem;" +
      "border:1px solid color-mix(in srgb,var(--c) 26%,transparent);" +
      "border-left:3px solid color-mix(in srgb,var(--c) 58%,transparent);" +
      "background:color-mix(in srgb,var(--c) 7%,rgba(8,11,26,.42))}" +
    ".fm-st .tl .sg{width:1.9rem;height:1.9rem;border-radius:50%;flex:none;" +
      "display:grid;place-items:center;font-size:.8rem;" +
      "border:1px solid color-mix(in srgb,var(--c) 45%,transparent);" +
      "color:var(--c);filter:brightness(1.3)}" +
    ".fm-st .tl .tx{flex:1;min-width:0}" +
    ".fm-st .tl .tx b{display:block;font-weight:400;font-size:.9rem}" +
    ".fm-st .tl .nn b{font-family:'Cinzel',serif;font-size:.95rem;font-weight:400}" +
    ".fm-st .rg{display:flex;align-items:center;gap:.6rem;padding:.55rem .7rem;" +
      "margin-bottom:.3rem;border:1px solid rgba(245,240,230,.1);" +
      "border-radius:.7rem;background:rgba(8,11,26,.4)}" +
    ".fm-st .rg .dd{flex:none;width:2.4rem;text-align:center}" +
    ".fm-st .rg .dd b{display:block;font-family:'Cinzel',serif;font-size:.95rem;" +
      "line-height:1;font-weight:400}" +
    ".fm-st .rg .dd span{display:block;font-size:.6rem;color:rgba(245,240,230,.35)}" +
    ".fm-st .rg .tx{flex:1;min-width:0}" +
    ".fm-st .rg .im{flex:none;font-family:'Cinzel',serif;font-size:1rem}" +
    ".fm-st .rg .ric{flex:none;font-size:.6rem;padding:.08rem .45rem;" +
      "border-radius:1rem;border:1px solid rgba(245,240,230,.18);" +
      "color:rgba(245,240,230,.4)}";
  document.head.appendChild(s);
}

/* ── i mattoni comuni ───────────────────────────────────────────── */
function stCapo(box, occhiello, titolo, sotto){
  box.className = "fm-st";
  box.innerHTML = "";
  var o = document.createElement("div");
  o.className = "oc"; o.textContent = occhiello; box.appendChild(o);
  var h = document.createElement("h1"); h.textContent = titolo; box.appendChild(h);
  if(sotto){
    var s = document.createElement("div");
    s.className = "sot"; s.textContent = sotto; box.appendChild(s);
  }
}
/* ⭐ il vuoto dice cosa ci sarà, e come si comincia */
function stDice(box, titolo, righe, come, comeGrassetto){
  var d = document.createElement("div");
  d.className = "dice";
  var b = document.createElement("b"); b.textContent = titolo; d.appendChild(b);
  righe.forEach(function(r){
    var p = document.createElement("p"); p.textContent = r; d.appendChild(p);
  });
  if(come){
    var c = document.createElement("span");
    c.className = "come";
    var pezzi = come.split("{}");
    c.appendChild(document.createTextNode(pezzi[0]));
    if(comeGrassetto){
      var e = document.createElement("em");
      e.textContent = comeGrassetto; c.appendChild(e);
    }
    if(pezzi[1]) c.appendChild(document.createTextNode(pezzi[1]));
    d.appendChild(c);
  }
  box.appendChild(d);
}
function stSpenta(box, dentro){
  var e = document.createElement("div");
  e.className = "et"; e.textContent = "cos\u00ec sar\u00e0"; box.appendChild(e);
  var s = document.createElement("div");
  s.className = "spenta"; s.setAttribute("aria-hidden","true");
  s.innerHTML = dentro; box.appendChild(s);
}
/* ⚠️ i mesi: solo quelli che esistono per questa persona */
function stMesi(box, da){
  var oggi = new Date();
  var d = da ? new Date(da) : oggi;
  var v = [], y = d.getFullYear(), m = d.getMonth();
  while(y < oggi.getFullYear() || (y === oggi.getFullYear() && m <= oggi.getMonth())){
    v.push({ a:y, m:m }); m++; if(m > 11){ m = 0; y++; }
  }
  v.reverse();
  var n = document.createElement("div");
  n.className = "mesi";
  v.slice(0, 12).forEach(function(x, i){
    var b = document.createElement("button");
    b.type = "button"; b.textContent = MESI[x.m];
    if(!i) b.className = "on";
    b.onclick = function(){
      n.querySelectorAll("button").forEach(function(z){ z.classList.remove("on"); });
      b.classList.add("on");
    };
    n.appendChild(b);
  });
  var a = document.createElement("button");
  a.type = "button"; a.textContent = String(oggi.getFullYear());
  a.onclick = function(){
    n.querySelectorAll("button").forEach(function(z){ z.classList.remove("on"); });
    a.classList.add("on");
  };
  n.appendChild(a);
  box.appendChild(n);
  return v.length;
}

async function stChiSono(){
  try{
    var u = await db.auth.getUser();
    var id = u && u.data && u.data.user && u.data.user.id;
    if(!id) return null;
    var r = await db.from("persone").select("id,creata_il").eq("id", id).single();
    return r.error ? null : r.data;
  }catch(e){ return null; }
}

/* ══════════════════ LA RUBRICA ══════════════════ */
async function rubrica(dove){
  var box = typeof dove === "string" ? document.querySelector(dove) : dove;
  if(!box) return;
  stVeste();
  stCapo(box, "i contatti, per elemento", "Rubrica",
    "Le persone che incontri, ordinate per quello che fanno.");

  var righe = [];
  try{
    var u = await db.auth.getUser();
    var id = u && u.data && u.data.user && u.data.user.id;
    if(id){
      var r = await db.from("contatti")
        .select("id,nome,dove,come_conosciuto,telefono,stato")
        .eq("proprietario_id", id).order("nome");
      if(!r.error) righe = r.data || [];
    }
  }catch(e){ console.warn("rubrica:", e); }

  if(!righe.length){
    stDice(box, "Qui compaiono le persone che incontri", [
      "Ogni persona che entra da un tuo invito, o che aggiungi tu, prende " +
      "posto nella stanza del suo talento: chi coltiva nei Vicinati, chi cura " +
      "nell\u2019Assistenza, chi insegna nella Scuola.",
      "Da qui li chiami, e da qui li metti nelle tue orme."
    ], "Il primo arriva quando {} dalla tua orma.", "inviti qualcuno");
    stSpenta(box,
      '<div class="gruppo" style="--c:var(--terra)">Vicinati</div>' +
      '<div class="ct" style="--c:var(--terra)"><span class="av">\u2014</span>' +
      '<span class="tx"><b>&nbsp;</b><i>&nbsp;</i></span>' +
      '<span class="ch">\u260e</span></div>' +
      '<div class="ct" style="--c:var(--terra)"><span class="av">\u2014</span>' +
      '<span class="tx"><b>&nbsp;</b><i>&nbsp;</i></span>' +
      '<span class="ch">\u260e</span></div>' +
      '<div class="gruppo" style="--c:var(--etere)">Scuola</div>' +
      '<div class="ct" style="--c:var(--etere)"><span class="av">\u2014</span>' +
      '<span class="tx"><b>&nbsp;</b><i>&nbsp;</i></span>' +
      '<span class="ch">\u260e</span></div>');
    return;
  }

  var cerca = document.createElement("input");
  cerca.className = "cerca"; cerca.type = "search";
  cerca.placeholder = "cerca un nome";
  cerca.setAttribute("aria-label", "cerca");
  box.appendChild(cerca);

  var elenco = document.createElement("div");
  box.appendChild(elenco);

  function versa(q){
    elenco.innerHTML = "";
    var f = (q || "").toLowerCase().trim();
    var visti = righe.filter(function(c){
      return !f || (c.nome || "").toLowerCase().indexOf(f) > -1;
    });
    if(!visti.length){
      var v = document.createElement("div");
      v.className = "et"; v.textContent = "nessuno con questo nome";
      elenco.appendChild(v); return;
    }
    visti.forEach(function(c){
      var d = document.createElement("div");
      d.className = "ct"; d.style.setProperty("--c", "var(--terra)");
      var av = document.createElement("span");
      av.className = "av";
      av.textContent = (c.nome || "\u2014").trim().charAt(0).toUpperCase();
      var tx = document.createElement("span");
      tx.className = "tx";
      var b = document.createElement("b"); b.textContent = c.nome || "";
      tx.appendChild(b);
      var coda = [];
      if(c.dove) coda.push(c.dove);
      if(c.come_conosciuto) coda.push(c.come_conosciuto);
      if(coda.length){
        var i = document.createElement("i");
        i.textContent = coda.join(" \u00b7 "); tx.appendChild(i);
      }
      d.appendChild(av); d.appendChild(tx);
      if(c.telefono){
        var a = document.createElement("a");
        a.className = "ch"; a.href = "tel:" + c.telefono;
        a.textContent = "\u260e"; a.setAttribute("aria-label","chiama");
        d.appendChild(a);
      }
      elenco.appendChild(d);
    });
  }
  versa("");
  cerca.oninput = function(){ versa(cerca.value); };
}

/* ══════════════════ IL CALENDARIO ══════════════════ */
async function calendario(dove){
  var box = typeof dove === "string" ? document.querySelector(dove) : dove;
  if(!box) return;
  stVeste();
  stCapo(box, "le orme che hanno un giorno", "Il calendario",
    "Quello che hai in programma, e quello che accade intorno a te.");

  /* ⭐ il tempo di oggi c'è sempre, anche a vuoto */
  var oggi = new Date();
  var t = document.createElement("div");
  t.className = "tempo";
  t.innerHTML =
    '<div class="q"><b>' + oggi.getDate() + '</b><span>' +
      MESI[oggi.getMonth()] + '</span></div>' +
    '<div class="q"><b>\ud83c\udf11</b><span>[ la luna ]</span></div>' +
    '<div class="q"><b>[ il santo ]</b><span>il santo</span></div>';
  box.appendChild(t);

  var date = [];
  try{
    var u = await db.auth.getUser();
    var id = u && u.data && u.data.user && u.data.user.id;
    if(id){
      var r = await db.from("orme")
        .select("id,titolo,contenuto,accaduto_il,luogo,elemento")
        .eq("persona_id", id).not("accaduto_il","is",null)
        .order("accaduto_il").limit(40);
      if(!r.error) date = r.data || [];
    }
  }catch(e){ console.warn("calendario:", e); }

  if(!date.length){
    stDice(box, "Qui compaiono le date delle tue orme", [
      "Ogni orma che ha un giorno finisce qui: una festa, un laboratorio, " +
      "una consegna, un incontro. E accanto alle tue vedi quelle del tuo " +
      "vicinato, quando ce ne sono.",
      "Dal telefono le porti nel calendario di sistema, e le ritrovi dove " +
      "guardi ogni giorno."
    ], "La prima data arriva quando scrivi un\u2019orma con un {}.", "quando");
    stSpenta(box,
      '<div class="dt" style="--c:var(--terra)">' +
      '<span class="qd"><b>\u2014</b><span>&nbsp;</span></span>' +
      '<span class="cr"><span class="e2">&nbsp;</span><b>&nbsp;</b></span></div>' +
      '<div class="dt" style="--c:var(--etere)">' +
      '<span class="qd"><b>\u2014</b><span>&nbsp;</span></span>' +
      '<span class="cr"><span class="e2">&nbsp;</span><b>&nbsp;</b></span></div>');
    return;
  }

  var io = await stChiSono();
  stMesi(box, io && io.creata_il);
  date.forEach(function(o){
    var g = new Date(o.accaduto_il);
    var d = document.createElement("div");
    d.className = "dt";
    d.style.setProperty("--c", "var(--" + (o.elemento || "terra") + ")");
    var qd = document.createElement("span");
    qd.className = "qd";
    qd.innerHTML = "<b>" + g.getDate() + "</b><span>" + GIORNI[g.getDay()] + "</span>";
    var cr = document.createElement("span");
    cr.className = "cr";
    var e2 = document.createElement("span");
    e2.className = "e2"; e2.textContent = o.elemento || "";
    var b = document.createElement("b");
    b.textContent = o.titolo || o.contenuto || "";
    cr.appendChild(e2); cr.appendChild(b);
    if(o.luogo){
      var me = document.createElement("span");
      me.className = "me"; me.textContent = o.luogo;
      cr.appendChild(me);
    }
    d.appendChild(qd); d.appendChild(cr);
    box.appendChild(d);
  });
}

/* ══════════════════ I COSTI ══════════════════ */
function stEuro(n){
  var v = Math.abs(Number(n) || 0);
  return (v % 1 ? v.toFixed(2).replace(".", ",") : String(Math.round(v))) + " \u20ac";
}

async function costi(dove){
  var box = typeof dove === "string" ? document.querySelector(dove) : dove;
  if(!box) return;
  stVeste();
  stCapo(box, "la rendicontazione dei talenti", "I costi", null);

  var io = await stChiSono();
  var voci = [];
  try{
    if(io){
      var r = await db.from("spese")
        .select("id,descrizione,importo,verso,giorno,categoria,ricorrente,orma_id")
        .eq("persona_id", io.id).order("giorno", { ascending:false });
      if(!r.error) voci = r.data || [];
    }
  }catch(e){ console.warn("costi:", e); }

  stMesi(box, io && io.creata_il);

  /* ⭐ il conto del mese: le ricorrenti contano anche se scritte una volta */
  var ora = new Date();
  var dentro = voci.filter(function(v){
    if(v.ricorrente) return true;
    if(!v.giorno) return false;
    var g = new Date(v.giorno);
    return g.getMonth() === ora.getMonth() && g.getFullYear() === ora.getFullYear();
  });
  var su = 0, giu = 0;
  dentro.forEach(function(v){
    var n = Number(v.importo) || 0;
    if(v.verso === "entrata") su += n; else giu += n;
  });

  var c = document.createElement("div");
  c.className = "conto";
  c.innerHTML =
    '<div class="rt"><span>entrato</span><b>' + stEuro(su) + '</b></div>' +
    '<div class="rt"><span>uscito</span><b>' + stEuro(giu) + '</b></div>' +
    '<div class="resta"><span>resta</span><b>' + stEuro(su - giu) + '</b></div>';
  if(!voci.length){
    var pr = document.createElement("div");
    pr.className = "prima"; pr.textContent = "il tuo primo mese";
    c.appendChild(pr);
  }
  box.appendChild(c);

  if(!voci.length){
    stDice(box, "Qui arrivano le spese e le entrate delle tue orme", [
      "Ogni orma di tipo spesa porta qui il suo importo, e resta agganciata " +
      "al talento da cui \u00e8 nata.",
      "Le voci che tornano ogni mese si segnano una volta sola."
    ], "La prima voce arriva quando scrivi un\u2019orma di tipo {} dal Megafono.",
      "spesa");
    stSpenta(box,
      '<div class="qt">quanto rende un talento</div>' +
      '<div class="tl" style="--c:var(--terra)"><span class="sg">\u25cf</span>' +
      '<span class="tx"><b>&nbsp;</b></span><span class="nn"><b>\u2014</b></span></div>' +
      '<div class="tl" style="--c:var(--aria)"><span class="sg">\u25cf</span>' +
      '<span class="tx"><b>&nbsp;</b></span><span class="nn"><b>\u2014</b></span></div>' +
      '<div class="qt">le voci, in ordine di data</div>' +
      '<div class="rg"><span class="dd"><b>\u2014</b><span>&nbsp;</span></span>' +
      '<span class="tx"><b>&nbsp;</b></span><span class="im">\u2014</span></div>' +
      '<div class="rg"><span class="dd"><b>\u2014</b><span>&nbsp;</span></span>' +
      '<span class="tx"><b>&nbsp;</b></span><span class="ric">ogni mese</span>' +
      '<span class="im">\u2014</span></div>');
    return;
  }

  /* ⭐ le voci in ordine di data */
  var t = document.createElement("div");
  t.className = "qt"; t.textContent = "le voci, in ordine di data";
  box.appendChild(t);

  dentro.forEach(function(v){
    var g = v.giorno ? new Date(v.giorno) : null;
    var d = document.createElement("div");
    d.className = "rg";
    var dd = document.createElement("span");
    dd.className = "dd";
    dd.innerHTML = g
      ? "<b>" + g.getDate() + "</b><span>" + MESI[g.getMonth()].slice(0,3) + "</span>"
      : "<b>\u2014</b>";
    var tx = document.createElement("span");
    tx.className = "tx";
    var b = document.createElement("b");
    b.textContent = v.descrizione || v.categoria || "";
    tx.appendChild(b);
    d.appendChild(dd); d.appendChild(tx);
    if(v.ricorrente){
      var rc = document.createElement("span");
      rc.className = "ric"; rc.textContent = "ogni mese";
      d.appendChild(rc);
    }
    var im = document.createElement("span");
    im.className = "im";
    im.textContent = (v.verso === "entrata" ? "+ " : "\u2212 ") + stEuro(v.importo);
    im.style.color = v.verso === "entrata"
      ? "#6E9E5A" : "#C9707A";
    im.style.filter = "brightness(1.2)";
    d.appendChild(im);
    box.appendChild(d);
  });
}

window.SpazioVivo = window.SpazioVivo || {};
window.SpazioVivo.rubrica = rubrica;
window.SpazioVivo.calendario = calendario;
window.SpazioVivo.costi = costi;
