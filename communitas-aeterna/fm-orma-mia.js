/* ═══════════════════════════════════════════════════════════════
   LA MIA ORMA — le tre soglie, il micelio, gli strumenti.

   ⛔ Disegno di Design del 14 settembre, preso riga per riga:
      la data col santo e la luna · il cubo di Metatron col micelio
      · «invita chi risuona» e «dove sei?» · le tre soglie
      · l'orma d'esempio · «Da collegare» · i quattro strumenti.

   ⭐ IL COLORE DEI NODI viene dall'ORMA che lega, non dalla
      persona: una persona può avere tre elementi, e ne mostreresti
      uno a caso. Se lavoriamo nei Vicinati il punto è ambra.

   ⭐ LA MATRICE: una radice per talento, e sotto le orme. Ogni
      scheda dice chi c'è dentro, dove, la stanza, lo stadio,
      quante ne sono nate, e le relazioni — nata da, ancorata a.

   ⚠️ LA MAPPA È VUOTA finché nessuno dichiara il comune: il tasto
      «dove sei?» lo posa, e da lì ogni orma nasce col suo punto.

   ⭐ I QUATTRO STRUMENTI chiamano i file che esistono già:
      fm-antahkarana.js e fm-strumenti.js.

   Espone: SpazioVivo.ormaMia(dove)
   ═══════════════════════════════════════════════════════════════ */

"use strict";

var EL = { terra:"#AA8844", acqua:"#4488BB", fuoco:"#CC6644",
           aria:"#669944", etere:"#9966CC", svil:"#5A7A8C" };
var STANZA_EL = { vicinati:"terra", emporio:"acqua", assistenza:"fuoco",
                  edizione:"aria", scuola:"etere" };
var MESI = ["gennaio","febbraio","marzo","aprile","maggio","giugno","luglio",
            "agosto","settembre","ottobre","novembre","dicembre"];
var LUNE = ["\ud83c\udf11 luna nuova","\ud83c\udf12 crescente","\ud83c\udf13 primo quarto",
            "\ud83c\udf14 gibbosa","\ud83c\udf15 luna piena","\ud83c\udf16 calante",
            "\ud83c\udf17 ultimo quarto","\ud83c\udf18 calante"];

var omBox = null, omSoglia = "talenti", omIo = null,
    omTalenti = [], omAttese = [], omSquadre = [], omMicelio = [], omGiorno = null;

function omVeste(){
  if(document.getElementById("fm-om-veste")) return;
  var s = document.createElement("style");
  s.id = "fm-om-veste";
  s.textContent =
    ".fm-om{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,24rem),1fr));" +
      "align-items:start;gap:2rem 3rem;padding:2rem clamp(1.25rem,5vw,5rem);" +
      "min-height:100vh;font-family:'DM Sans',system-ui,sans-serif;color:#F5F0E6;" +
      "background:radial-gradient(ellipse at 22% 20%,rgba(38,64,120,.5),transparent 58%)," +
      "radial-gradient(ellipse at 84% 84%,rgba(60,44,110,.42),transparent 60%)," +
      "radial-gradient(ellipse at 40% 45%,#0a1428 0%,#060c1c 46%,#02040c 100%)}" +
    ".fm-om *{box-sizing:border-box}" +

    /* ── il tempo: giorno, luna, santo ── */
    ".fm-om .tempo{display:flex;gap:.5rem;margin-bottom:1.4rem}" +
    ".fm-om .tempo .q{flex:1;border:1px solid rgba(212,175,106,.24);border-radius:.8rem;" +
      "background:rgba(4,8,20,.55);padding:.65rem .4rem;text-align:center}" +
    ".fm-om .tempo .q b{display:block;font-family:'Cinzel',serif;font-weight:400;" +
      "font-size:1.18rem;line-height:1.1;color:#D4AF6A}" +
    ".fm-om .tempo .q span{display:block;font-size:.66rem;letter-spacing:.06em;" +
      "color:rgba(245,240,230,.4);margin-top:.22rem}" +

    /* ── il cubo di Metatron, col micelio ── */
    ".fm-om .cubo{position:relative;width:100%;max-width:24rem;margin:0 auto}" +
    ".fm-om .cubo svg{width:100%;height:auto;display:block}" +
    ".fm-om .gesti{display:flex;flex-direction:column;gap:.5rem;width:100%;" +
      "max-width:24rem;margin:1rem auto 0}" +
    ".fm-om .gesti a,.fm-om .gesti button{display:flex;align-items:center;" +
      "justify-content:space-between;gap:.6rem;min-height:3.5rem;padding:0 1.1rem;" +
      "border-radius:1.75rem;cursor:pointer;text-decoration:none;" +
      "font-family:'Cormorant Garamond',serif;font-size:1.06rem;letter-spacing:.06em;" +
      "border:1px solid rgba(212,175,106,.42);background:rgba(4,8,20,.55);" +
      "color:#F5F0E6;transition:border-color .3s,background .3s}" +
    ".fm-om .gesti a:hover,.fm-om .gesti button:hover{border-color:#D4AF6A;" +
      "background:rgba(212,175,106,.1)}" +
    ".fm-om .gesti .fr{flex:none;color:#D4AF6A;font-size:1.1rem}" +
    ".fm-om .sotto{font-family:'Cormorant Garamond',serif;font-style:italic;" +
      "font-size:.94rem;color:rgba(245,240,230,.38);text-align:center;" +
      "margin-top:.6rem;line-height:1.45}" +

    /* ── la testa: nome e soglie ── */
    ".fm-om h1{font-family:'Cinzel',serif;font-weight:400;font-size:1.5rem;" +
      "line-height:1.2;margin:0 0 .12rem}" +
    ".fm-om .mio{font-family:'Cormorant Garamond',serif;font-style:italic;" +
      "font-size:1.06rem;color:#C8A055;opacity:.85;margin-bottom:1rem}" +
    ".fm-om .soglie{display:flex;gap:.4rem;margin-bottom:1.2rem;flex-wrap:wrap}" +
    ".fm-om .soglie button{min-height:2.5rem;padding:0 1.1rem;border-radius:1.4rem;" +
      "cursor:pointer;font-family:inherit;font-size:.92rem;background:transparent;" +
      "border:1px solid rgba(245,240,230,.16);color:rgba(245,240,230,.55);transition:.18s}" +
    ".fm-om .soglie button.su{border-color:#C8A055;background:rgba(200,160,85,.16);" +
      "color:#D4AF6A}" +

    /* ── la nota di Antahkarana ── */
    ".fm-om .nota{border:1px dashed rgba(212,175,106,.32);border-radius:.9rem;" +
      "background:rgba(212,175,106,.05);padding:1rem 1.1rem;margin-bottom:.9rem}" +
    ".fm-om .nota .et{font-size:.6rem;letter-spacing:.2em;text-transform:uppercase;" +
      "color:#C8A055;margin-bottom:.3rem}" +
    ".fm-om .nota p{font-family:'Cormorant Garamond',serif;font-size:1.06rem;" +
      "line-height:1.5;color:rgba(245,240,230,.7)}" +

    /* ── i talenti, e le orme dentro ── */
    ".fm-om .rad{margin-bottom:1.3rem}" +
    ".fm-om .rad .cap{display:flex;align-items:baseline;gap:.5rem;margin-bottom:.5rem;" +
      "padding-bottom:.35rem;border-bottom:1px solid color-mix(in srgb,var(--c) 28%,transparent)}" +
    ".fm-om .rad .cap b{flex:1;min-width:0;font-family:'Cormorant Garamond',serif;" +
      "font-weight:400;font-size:1.14rem;line-height:1.3;color:var(--c);filter:brightness(1.3)}" +
    ".fm-om .rad .cap .st{flex:none;font-size:.74rem;color:rgba(245,240,230,.34)}" +
    ".fm-om .rad .cap .n{flex:none;font-family:'Cinzel',serif;font-size:.86rem;" +
      "color:rgba(245,240,230,.42)}" +

    ".fm-om .orma{display:block;width:100%;text-align:left;cursor:pointer;" +
      "border-radius:.8rem;padding:.7rem .85rem;margin-bottom:.4rem;font-family:inherit;" +
      "color:inherit;transition:.18s;" +
      "border:1px solid color-mix(in srgb,var(--c) 24%,transparent);" +
      "border-left:3px solid color-mix(in srgb,var(--c) 58%,transparent);" +
      "background:color-mix(in srgb,var(--c) 7%,rgba(4,8,20,.5))}" +
    ".fm-om .orma:hover{background:color-mix(in srgb,var(--c) 15%,rgba(4,8,20,.5));" +
      "border-color:color-mix(in srgb,var(--c) 52%,transparent)}" +
    ".fm-om .orma .alto{display:flex;align-items:center;gap:.5rem;" +
      "font-size:.78rem;color:rgba(245,240,230,.42);margin-bottom:.15rem}" +
    ".fm-om .orma .alto .v{display:flex;gap:-.3rem}" +
    ".fm-om .orma .alto .vv{width:1.2rem;height:1.2rem;border-radius:50%;flex:none;" +
      "display:grid;place-items:center;font-size:.58rem;margin-right:-.3rem;" +
      "border:1px solid color-mix(in srgb,var(--c) 45%,transparent);" +
      "background:color-mix(in srgb,var(--c) 18%,#0a1428);color:#F5F0E6}" +
    ".fm-om .orma .tit{font-family:'Cormorant Garamond',serif;font-size:1.12rem;" +
      "line-height:1.3;color:rgba(245,240,230,.92)}" +
    ".fm-om .orma .sub{font-family:'Cormorant Garamond',serif;font-style:italic;" +
      "font-size:.94rem;color:rgba(245,240,230,.42);margin-top:.05rem}" +
    ".fm-om .orma .basso{display:flex;align-items:center;gap:.4rem;flex-wrap:wrap;" +
      "margin-top:.35rem;font-size:.78rem;color:rgba(245,240,230,.4)}" +
    ".fm-om .orma .basso .sz{color:var(--c);filter:brightness(1.3)}" +
    ".fm-om .orma .basso .fr{margin-left:auto;color:rgba(245,240,230,.28)}" +
    ".fm-om .orma .da{font-family:'Cormorant Garamond',serif;font-style:italic;" +
      "font-size:.88rem;color:rgba(245,240,230,.34);margin-top:.3rem;" +
      "padding-top:.3rem;border-top:1px solid rgba(245,240,230,.07)}" +
    ".fm-om .orma.spenta{opacity:.42;filter:grayscale(.5)}" +
    ".fm-om .cosi{font-family:'Cormorant Garamond',serif;font-style:italic;" +
      "font-size:.9rem;color:rgba(245,240,230,.3);margin:.2rem 0 .3rem .2rem}" +
    /* \u26d4 la veste di Design, verbatim: il filo tratteggiato a
       sinistra, il corsivo, le misure sue. */
    ".fm-om .filo{position:relative;padding-left:1.4rem;margin-left:.9rem;" +
      "display:flex;flex-direction:column;gap:.45rem}" +
    ".fm-om .filo.vuoto{border-left:1px dashed color-mix(in srgb,var(--c) 40%,transparent)}" +
    ".fm-om .filo.pieno{border-left:1px solid color-mix(in srgb,var(--c) 40%,transparent)}" +
    ".fm-om .apri{display:flex;align-items:center;gap:.8rem;min-height:3rem;" +
      "padding:.6rem .9rem;border-radius:.9rem;text-align:left;cursor:pointer;" +
      "border:1px dashed rgba(212,175,106,.45);background:transparent;" +
      "color:rgba(212,175,106,.9);font-family:'Cormorant Garamond',serif;" +
      "font-style:italic;font-size:1.15rem}" +
    ".fm-om .apri:hover{border-color:#D4AF6A;background:rgba(212,175,106,.06)}" +
    ".fm-om .apri .pi{flex:none;width:1.7rem;height:1.7rem;border-radius:50%;" +
      "display:grid;place-items:center;font-style:normal;font-size:1rem;" +
      "font-family:'DM Sans',system-ui,sans-serif;color:#D4AF6A;" +
      "border:1px solid rgba(212,175,106,.6)}" +
    ".fm-om .altre{font-size:.84rem;color:rgba(245,240,230,.34);" +
      "padding:.3rem .2rem;cursor:pointer;background:none;border:0;font-family:inherit}" +

    ".fm-om .vuoto{font-family:'Cormorant Garamond',serif;font-style:italic;" +
      "font-size:1rem;color:rgba(245,240,230,.32);padding:1.2rem .2rem;line-height:1.5}" +
    ".fm-om .tasto{display:block;width:100%;min-height:3rem;margin-top:.6rem;" +
      "border-radius:1.5rem;cursor:pointer;font-family:inherit;font-size:.98rem;" +
      "border:1px solid rgba(212,175,106,.45);background:rgba(212,175,106,.13);color:#D4AF6A}" +

    /* ── gli strumenti ── */
    ".fm-om .stru{display:flex;flex-direction:column;gap:.9rem}" +
    ".fm-om .stru a{display:flex;flex-direction:column;gap:.35rem;min-height:5.5rem;" +
      "padding:1rem 1.2rem;border-radius:1rem;text-decoration:none;color:#F5F0E6;" +
      "border:1px solid rgba(212,175,106,.35);background:rgba(8,11,26,.5);" +
      "transition:border-color .25s,background .25s;cursor:pointer}" +
    ".fm-om .stru a:hover{border-color:rgba(212,175,106,.8);background:rgba(212,175,106,.08)}" +
    ".fm-om .stru .n{display:flex;align-items:center;gap:.5rem;font-family:'Cinzel',serif;" +
      "font-size:1rem;letter-spacing:.14em;text-transform:uppercase;color:#D4AF6A}" +
    ".fm-om .stru .n i{font-style:normal;font-size:1.1rem;line-height:1;" +
      "color:rgba(212,175,106,.8)}" +
    ".fm-om .stru .d{font-family:'Cormorant Garamond',serif;font-size:1.45rem;" +
      "line-height:1.25;margin-top:auto}" +
    ".fm-om .stru .s{font-size:.84rem;color:rgba(245,240,230,.45)}" +
    "@media (prefers-reduced-motion:reduce){.fm-om *{transition:none}}";
  document.head.appendChild(s);
}

/* ── leggere ────────────────────────────────────────────────────── */
async function omLeggi(){
  var d = { io:null, talenti:[], attese:[], squadre:[], micelio:[], giorno:null };
  try{
    var u = await db.auth.getUser();
    var id = u && u.data && u.data.user && u.data.user.id;
    if(!id) return d;

    var p = await db.from("persone")
      .select("id,nome,grado,livello_n,talenti,foto_url,comune_cod,vicinato_id")
      .eq("id", id).single();
    if(!p.error) d.io = p.data;

    /* ⭐ le orme: le mie, colle relazioni e lo stadio */
    var o = await db.from("orme")
      .select("id,titolo,contenuto,sottotitolo,elemento,stadio,luogo,accaduto_il," +
              "entro_il,talento_id,orma_madre_id,destinazione")
      .eq("persona_id", id).order("momento", { ascending:false }).limit(120);
    var orme = o.error ? [] : (o.data || []);

    /* i talenti scelti */
    var t = await db.from("orme")
      .select("talento_id,talenti(id,nome,stanza,elemento)")
      .eq("persona_id", id).not("talento_id","is",null);
    var visti = {};
    (t.error ? [] : t.data || []).forEach(function(r){
      if(r.talenti && !visti[r.talenti.id]) visti[r.talenti.id] = r.talenti;
    });
    Object.keys(visti).forEach(function(k){
      var tl = visti[k];
      d.talenti.push({
        id: tl.id, nome: tl.nome,
        stanza: tl.stanza || "",
        el: tl.elemento || STANZA_EL[(tl.stanza||"").toLowerCase()] || "terra",
        orme: orme.filter(function(x){ return x.talento_id === tl.id; })
      });
    });
    /* ⚠️ le orme senza talento: quelle da collegare */
    d.attese = orme.filter(function(x){ return !x.talento_id; });

    /* le squadre vive */
    try{
      var sq = await db.rpc("fm_mie_squadre");
      if(!sq.error) d.squadre = sq.data || [];
    }catch(e){}

    /* ⭐ il micelio: chi lavora colle mie orme, col colore dell'ORMA */
    var ids = orme.map(function(x){ return x.id; }).slice(0, 60);
    if(ids.length){
      var op = await db.from("orma_persone")
        .select("persona_id,orma_id").in("orma_id", ids).is("lasciato_il", null);
      var per = {};
      (op.error ? [] : op.data || []).forEach(function(r){
        if(r.persona_id === id) return;
        var orm = orme.filter(function(x){ return x.id === r.orma_id; })[0];
        if(!per[r.persona_id])
          per[r.persona_id] = { id:r.persona_id, el: (orm && orm.elemento) || "terra", orme:[] };
        per[r.persona_id].orme.push(r.orma_id);
      });
      d.micelio = Object.keys(per).map(function(k){ return per[k]; });
    }

    /* il santo e la luna */
    try{
      var oggi = new Date();
      var mm = String(oggi.getMonth()+1).padStart(2,"0");
      var gg = String(oggi.getDate()).padStart(2,"0");
      var sa = await db.from("santi").select("nome").eq("giorno", mm+"-"+gg).limit(1);
      d.giorno = { santo: (!sa.error && sa.data && sa.data[0]) ? sa.data[0].nome : null };
    }catch(e){}
  }catch(e){ console.warn("la mia orma:", e); }
  return d;
}

/* ── il cubo di Metatron, col micelio dentro ────────────────────── */
function omCubo(){
  var d = 46, C = [[0,0]];
  for(var k = 0; k < 6; k++){
    var a = (-90 + k*60) * Math.PI/180;
    C.push([+(d*Math.cos(a)).toFixed(2), +(d*Math.sin(a)).toFixed(2)]);
  }
  for(var k2 = 0; k2 < 6; k2++){
    var a2 = (-90 + k2*60) * Math.PI/180;
    C.push([+(2*d*Math.cos(a2)).toFixed(2), +(2*d*Math.sin(a2)).toFixed(2)]);
  }
  var lin = "";
  for(var i = 0; i < C.length; i++)
    for(var j = i+1; j < C.length; j++)
      lin += '<line x1="'+C[i][0]+'" y1="'+C[i][1]+'" x2="'+C[j][0]+'" y2="'+C[j][1]+'"/>';

  /* ⭐ i nodi: io al centro, ognuno col colore dell'orma che ci lega */
  var nodi = '<circle cx="0" cy="0" r="4.2" fill="#D4AF6A"' +
    ' style="filter:drop-shadow(0 0 6px rgba(212,175,106,.8))"/>';
  var fili = "";
  omMicelio.slice(0, 12).forEach(function(p, n){
    var c = C[1 + (n % 12)];
    var col = EL[p.el] || EL.terra;
    fili += '<line x1="0" y1="0" x2="'+c[0]+'" y2="'+c[1]+'" stroke="'+col+
      '" stroke-width=".7" opacity=".4"/>';
    nodi += '<circle cx="'+c[0]+'" cy="'+c[1]+'" r="3" fill="'+col+
      '" opacity=".9" style="filter:drop-shadow(0 0 4px '+col+'99)"/>';
  });

  return '<svg viewBox="-115 -115 230 230" fill="none" stroke-linejoin="round"' +
    ' aria-hidden="true">' +
    '<g stroke="#D4AF6A" stroke-width=".5" opacity="' +
      (omMicelio.length ? ".2" : ".13") + '">' + lin + '</g>' +
    '<circle r="104" stroke="#D4AF6A" stroke-width=".9" opacity="' +
      (omMicelio.length ? ".3" : ".2") + '"/>' +
    '<g>' + fili + '</g><g>' + nodi + '</g></svg>';
}

/* ── i mattoni ──────────────────────────────────────────────────── */
function omEl(t, c, x){
  var n = document.createElement(t);
  if(c) n.className = c;
  if(x !== undefined) n.innerHTML = x;
  return n;
}
function omStadio(s){
  return s === "sviluppato" ? "chiusa" :
         s === "in_avanzamento" ? "in corso" : "in coda";
}
function omQuando(o){
  if(o.luogo) return o.luogo;
  if(o.accaduto_il){
    var g = new Date(o.accaduto_il);
    return g.getDate() + " " + MESI[g.getMonth()].slice(0,3);
  }
  return "";
}

/* ⭐ la scheda dell'orma: lo schema di Gab, riga per riga */
function omOrma(o, el, spenta){
  var b = omEl("button", "orma" + (spenta ? " spenta" : ""));
  b.type = "button";
  b.style.setProperty("--c", "var(--" + (el || "terra") + ", " + (EL[el]||EL.terra) + ")");
  b.style.setProperty("--c", EL[el] || EL.terra);

  var alto = omEl("div", "alto");
  var quanti = o.quanti_dentro || 0;
  if(quanti){
    var v = omEl("span", "v");
    for(var i = 0; i < Math.min(3, quanti); i++)
      v.appendChild(omEl("span", "vv", "\u2014"));
    alto.appendChild(v);
    alto.appendChild(omEl("span", null,
      quanti === 1 ? "una persona" : quanti + " persone"));
  }
  var q = omQuando(o);
  if(q){
    if(quanti) alto.appendChild(omEl("span", null, "\u00b7"));
    alto.appendChild(omEl("span", null, q));
  }
  if(alto.children.length) b.appendChild(alto);

  var t = omEl("div", "tit");
  t.textContent = o.titolo || o.contenuto || "";
  b.appendChild(t);
  if(o.sottotitolo){
    var s = omEl("div", "sub"); s.textContent = o.sottotitolo; b.appendChild(s);
  }

  var basso = omEl("div", "basso");
  if(o.destinazione){
    var sz = omEl("span", "sz"); sz.textContent = o.destinazione; basso.appendChild(sz);
    basso.appendChild(omEl("span", null, "\u00b7"));
  }
  basso.appendChild(omEl("span", null, omStadio(o.stadio)));
  if(o.nate){
    basso.appendChild(omEl("span", null, "\u00b7"));
    basso.appendChild(omEl("span", null, o.nate + " dentro"));
  }
  if(o.entro_il){
    var e = new Date(o.entro_il);
    basso.appendChild(omEl("span", null, "\u00b7"));
    basso.appendChild(omEl("span", null,
      "entro " + e.getDate() + " " + MESI[e.getMonth()].slice(0,3)));
  }
  basso.appendChild(omEl("span", "fr", "\u203a"));
  b.appendChild(basso);

  if(o.da){
    var da = omEl("div", "da"); da.textContent = o.da; b.appendChild(da);
  }
  b.onclick = function(){
    if(spenta || typeof vai !== "function") return;
    vai("orma", { id: o.id });
  };
  return b;
}

/* ── le tre soglie ──────────────────────────────────────────────── */
function omTalentiSoglia(box){
  /* ⚠️ le orme senza talento vanno in cima: sono quelle da collegare */
  if(omAttese.length){
    var r = omEl("div", "rad");
    r.style.setProperty("--c", EL.svil);
    var c = omEl("div", "cap");
    c.appendChild(omEl("b", null, "Da collegare"));
    c.appendChild(omEl("span", "n", String(omAttese.length)));
    r.appendChild(c);
    omAttese.slice(0, 3).forEach(function(o){
      o.da = "\u21b3 da collegare a un talento";
      r.appendChild(omOrma(o, "svil"));
    });
    if(omAttese.length > 3)
      r.appendChild(omEl("button", "altre", (omAttese.length - 3) + " altre"));
    box.appendChild(r);
  }

  /* ⭐ QUANTE ORME HO IN TUTTO: l'esempio sparisce colla prima orma
     vera, non col primo talento. Chi sceglie un talento e non ha
     ancora scritto niente è il primo giorno di TUTTI, non un caso
     raro: deve trovare com'è fatta un'orma, non un buco. */
  var quante = omAttese.length;
  omTalenti.forEach(function(t){ quante += t.orme.length; });

  if(!omTalenti.length){
    /* ⭐ la nota, e l'orma d'esempio spenta */
    var n = omEl("div", "nota");
    n.appendChild(omEl("div", "et", "una nota da Anta\u1e25kara\u1e47a"));
    n.appendChild(omEl("p", null,
      "Per scrivere la tua prima orma usa lo spazio in basso."));
    box.appendChild(n);
    box.appendChild(omEl("div", "cosi", "cos\u00ec sar\u00e0 la tua"));
    box.appendChild(omOrma({
      titolo:"Mercatino di dicembre",
      luogo:"piazza del paese \u00b7 sabato 14 dicembre, dalle 10 alle 19",
      quanti_dentro:6, destinazione:"I Vicinati", stadio:"in_avanzamento", nate:4
    }, "terra", true));
    return;
  }

  var giaMostrato = false;
  omTalenti.forEach(function(t){
    var r = omEl("div", "rad");
    r.style.setProperty("--c", EL[t.el] || EL.terra);
    var c = omEl("div", "cap");
    c.appendChild(omEl("b", null, t.nome));
    if(t.stanza) c.appendChild(omEl("span", "st", t.stanza));
    c.appendChild(omEl("span", "n", String(t.orme.length)));
    r.appendChild(c);
    /* ⚠️ al massimo tre, le ultime — dentro il filo */
    var fl = omEl("div", "filo " + (t.orme.length ? "pieno" : "vuoto"));
    t.orme.slice(0, 3).forEach(function(o){
      if(o.orma_madre_id) o.da = "\u21b3 nata da un\u2019altra orma";
      fl.appendChild(omOrma(o, o.elemento || t.el));
    });
    if(!t.orme.length){
      if(!quante && !giaMostrato){
        giaMostrato = true;
        r.appendChild(omEl("div", "cosi", "cos\u00ec sar\u00e0 la tua"));
        /* ⭐ il primo giorno: si vede com'è fatta un'orma */
        fl.appendChild(omOrma({
          titolo:"Mercatino di dicembre",
          luogo:"piazza del paese \u00b7 sabato 14 dicembre, dalle 10 alle 19",
          quanti_dentro:6, destinazione:"I Vicinati",
          stadio:"in_avanzamento", nate:4
        }, "terra", true));
      }
      /* ⭐ e il posto dove cominciare */
      var n = omEl("button", "apri");
      n.type = "button";
      n.innerHTML = '<span class="pi">+</span>';
      var sp = document.createElement("span");
      sp.textContent = "Apri la prima orma di questo talento";
      n.appendChild(sp);
      n.onclick = function(){
        if(typeof vai === "function") vai("orma-nuova", { talento: t.id });
      };
      fl.appendChild(n);
    }
    else if(t.orme.length > 3)
      fl.appendChild(omEl("button", "altre", (t.orme.length - 3) + " altre"));
    r.appendChild(fl);
    box.appendChild(r);
  });
}

function omSquadreSoglia(box){
  if(!omSquadre.length){
    var n = omEl("div", "nota");
    n.appendChild(omEl("div", "et", "una nota da Anta\u1e25kara\u1e47a"));
    n.appendChild(omEl("p", null,
      "Qua vengono segnate le squadre a cui partecipi."));
    box.appendChild(n);
    return;
  }
  omSquadre.forEach(function(q){
    var r = omEl("div", "rad");
    r.style.setProperty("--c", EL[q.elemento] || EL.terra);
    var c = omEl("div", "cap");
    c.appendChild(omEl("b", null, q.nome || ""));
    if(q.quante) c.appendChild(omEl("span", "n", String(q.quante)));
    r.appendChild(c);
    box.appendChild(r);
  });
}

/* ⭐ i quattro strumenti: chiamano i file che esistono già */
function omStrumenti(box){
  var io = omIo || {};
  var S = [
    { n:"Anta\u1e25kara\u1e47a", sg:"\u2726", d: io.grado || "\u2014",
      s: io.talenti ? io.talenti + " talenti" : "", r:"anthakarana" },
    { n:"Conti", sg:"\u20ac", d:"\u2014", s:"le spese e le entrate", r:"costi" },
    { n:"Calendario", sg:"\u25a4", d:"\u2014", s:"le orme che hanno un giorno", r:"calendario" },
    { n:"Rubrica", sg:"\u2609", d:"\u2014", s:"le persone che incontri", r:"rubrica" }
  ];
  var w = omEl("div", "stru");
  S.forEach(function(x){
    var a = omEl("a");
    a.href = "#" + x.r;
    a.innerHTML = '<span class="n"><i>'+x.sg+'</i>'+x.n+'</span>' +
      '<span class="d"></span><span class="s"></span>';
    a.querySelector(".d").textContent = x.d;
    a.querySelector(".s").textContent = x.s;
    a.onclick = function(e){
      e.preventDefault();
      if(typeof vai === "function") vai(x.r);
    };
    w.appendChild(a);
  });
  box.appendChild(w);
}

/* ── il disegno ─────────────────────────────────────────────────── */
function omDisegna(){
  var box = omBox;
  if(!box) return;
  box.className = "fm-om";
  box.innerHTML = "";

  /* ══ colonna di sinistra ══ */
  var sx = omEl("div");
  var oggi = new Date();
  var tp = omEl("div", "tempo");
  tp.innerHTML =
    '<div class="q"><b>'+oggi.getDate()+'</b><span>'+MESI[oggi.getMonth()]+'</span></div>' +
    '<div class="q"><b>'+LUNE[0].slice(0,2)+'</b><span>'+LUNE[0].slice(3)+'</span></div>' +
    '<div class="q"><b class="sn"></b><span>il santo</span></div>';
  tp.querySelector(".sn").textContent =
    (omGiorno && omGiorno.santo) ? omGiorno.santo : "\u2014";
  sx.appendChild(tp);

  var cb = omEl("div", "cubo", omCubo());
  sx.appendChild(cb);

  var g = omEl("div", "gesti");
  /* ⭐ dove sei: posa il comune, e da lì le orme nascono col punto */
  var dv = omEl("button");
  dv.type = "button";
  dv.innerHTML = '<span class="tx"></span><span class="fr">\u2192</span>';
  dv.querySelector(".tx").textContent =
    (omIo && omIo.comune_cod) ? "sei nel tuo comune" : "dove sei?";
  dv.onclick = function(){
    if(window.SpazioVivo && SpazioVivo.doveSei) SpazioVivo.doveSei();
    else if(typeof vai === "function") vai("account");
  };
  g.appendChild(dv);

  var iv = omEl("button");
  iv.type = "button";
  iv.innerHTML = '<span>invita chi risuona</span><span class="fr">\u2192</span>';
  iv.onclick = function(){
    if(window.SpazioVivo && SpazioVivo.invito) SpazioVivo.invito();
  };
  g.appendChild(iv);
  sx.appendChild(g);
  sx.appendChild(omEl("div", "sotto",
    "Inizi a scrivere le orme e attivarti nel vicinato"));
  box.appendChild(sx);

  /* ══ colonna di destra ══ */
  var dx = omEl("div");
  dx.appendChild(omEl("h1", null, "La mia orma"));
  dx.appendChild(omEl("div", "mio",
    (omIo && omIo.nome) ? omIo.nome : ""));

  var sg = omEl("div", "soglie");
  [["talenti","Talenti"],["squadre","Squadre"],["strumenti","Strumenti"]]
    .forEach(function(x){
      var b = omEl("button");
      b.type = "button"; b.textContent = x[1];
      if(omSoglia === x[0]) b.className = "su";
      b.onclick = function(){ omSoglia = x[0]; omDisegna(); };
      sg.appendChild(b);
    });
  dx.appendChild(sg);

  var d = omEl("div");
  if(omSoglia === "talenti") omTalentiSoglia(d);
  if(omSoglia === "squadre") omSquadreSoglia(d);
  if(omSoglia === "strumenti") omStrumenti(d);
  dx.appendChild(d);
  box.appendChild(dx);
}

async function ormaMia(dove){
  var box = typeof dove === "string" ? document.querySelector(dove) : dove;
  if(!box) return;
  omVeste();
  omBox = box;
  omDisegna();
  var d = await omLeggi();
  omIo = d.io; omTalenti = d.talenti; omAttese = d.attese;
  omSquadre = d.squadre; omMicelio = d.micelio; omGiorno = d.giorno;
  omDisegna();
}

window.SpazioVivo = window.SpazioVivo || {};
window.SpazioVivo.ormaMia = ormaMia;
