/* ═══════════════════════════════════════════════════════════════
   Comunità Eterna FelicitasMundi · IL PERCORSO DEI TALENTI

   Il disegno è quello di `il-percorso-dei-talenti.html` (quinta
   consegna, 91.337 · 55b126ef4825aab7e151abcbb4e04ded, MD5
   verificato prima di leggere): qui non si reinventa, si
   riproduce leggendo i dati veri.

   COSA LEGGE — aperto anche a chi non è entrato:
     talenti_famiglie   le 6 sezioni (nome, sottotitolo, colore)
     talenti_gruppi     i 20 gruppi (nome, descrizione, ordine)
     talenti            i segni dentro i gruppi — solo `attivo`
     talenti_mosse      le 21 mosse: fai (7) · condividi (9) · ricevi (5)

   COSA FA: i tre quadranti delle mosse in cima, che si aprono ·
   i gruppi chiusi che al tocco mostrano i talenti · ogni talento
   ha la casella: si prende e si toglie.
   ⭐ PRENDERE APRE L'ORMA RADICE, subito: nasce come in fm-radice.js
      (tipo `talento_radice`, PUBBLICA — decisione del 2 settembre).
   ⭐ TOGLIERE LASCIA L'ORMA E STACCA IL TALENTO: `talento_id`
      torna vuoto, la riga resta. Niente si cancella.

   ⛔ L'ORDINE: i gruppi in ordine alfabetico dentro la sezione, i
      talenti in ordine alfabetico dentro il gruppo. IL CAMMINO NO:
      è una sequenza — Primi passi, poi In cammino — e va col suo
      `ordine`. Le righe poetiche non si mostrano: bastano il nome
      del gruppo e la sua riga (`descrizione`).

   ⚠️ QUESTO FILE PRENDE IL NOME DEI CREDITI, per ordine di Gab del
      7 settembre. Il file di prima — saldo, sigillo, gettone `?t=`,
      talentiApri()/talentiChiudi() — è INTERO in
      PRECEDENTI/fm-talenti_2026-09-07_crediti-prima-del-percorso.js
      (23.919 · d18568db936134bfbadade770e2a6d6c). ⛔ Il guscio lo
      carica già col vecchio mestiere: prima del prossimo /pubblica
      il GUSCIO decide la casa nuova dei crediti — scritto nella
      sua posta.

   ⚠️ La barra in fondo del modello è `fixed`: dentro il guscio
      coprirebbe il Megafono, che non si copre (legge dei margini).
      Qui è `sticky` dentro la colonna — unica deviazione, detta.

   Il guscio chiama `percorsoDeiTalenti(contenitore)` da vai().

   ⛔ Niente involucro (function(){ … })(): il guscio mette tutto
      in comune e questo file legge da lì.
   ═══════════════════════════════════════════════════════════════ */

"use strict";

/* ── la veste: quella del modello, sotto il nome .fm-perc ── */
function percVeste(){
  if(document.getElementById("fm-perc-veste")) return;
  var s = document.createElement("style");
  s.id = "fm-perc-veste";
  s.textContent =
    ".fm-perc{width:100%;max-width:30rem;margin:0 auto;position:relative;" +
      "padding:1.5rem 1rem 6rem;font-family:'DM Sans',system-ui,sans-serif;" +
      "color:#F5F0E6}" +
    ".fm-perc *{box-sizing:border-box}" +
    ".fm-perc .oc{font-size:.6rem;letter-spacing:.2em;text-transform:uppercase;" +
      "color:#C8A055;margin-bottom:.3rem}" +
    ".fm-perc h1{font-family:'Cinzel',serif;font-weight:400;font-size:1.4rem;" +
      "line-height:1.15;margin:0 0 .25rem}" +
    ".fm-perc .sot{font-family:'Cormorant Garamond',serif;font-style:italic;" +
      "font-size:.95rem;color:rgba(245,240,230,.5);line-height:1.45;margin-bottom:1.1rem}" +
    ".fm-perc h2{font-family:'Cinzel',serif;font-weight:400;font-size:.92rem;" +
      "color:#D4AF6A;margin:1.6rem 0 .5rem;padding-top:.9rem;" +
      "border-top:1px solid rgba(184,150,62,.2)}" +
    ".fm-perc h2 small{display:block;font-family:'Cormorant Garamond',serif;" +
      "font-style:italic;font-size:.82rem;color:rgba(245,240,230,.4);" +
      "margin-top:.1rem;letter-spacing:0}" +

    ".fm-perc .base{border:1px solid rgba(200,160,85,.45);border-radius:.85rem;" +
      "background:rgba(200,160,85,.07);padding:.9rem;margin-bottom:1.2rem}" +
    ".fm-perc .base p{font-size:.92rem;line-height:1.55;" +
      "color:rgba(245,240,230,.8);margin:0 0 .4rem}" +
    ".fm-perc .base p:last-child{margin-bottom:0}" +
    ".fm-perc .base b{color:#D4AF6A;font-weight:500}" +

    /* i tre quadranti delle mosse: si toccano e si aprono */
    ".fm-perc .qd{border:1px solid color-mix(in srgb,var(--c) 28%,transparent);" +
      "border-radius:.9rem;overflow:hidden;margin-bottom:.5rem;" +
      "background:linear-gradient(160deg,color-mix(in srgb,var(--c) 11%,rgba(2,4,12,.5)),rgba(2,4,12,.55));" +
      "transition:border-color .25s}" +
    ".fm-perc .qd .capo{display:flex;align-items:baseline;gap:.55rem;" +
      "padding:.8rem .85rem;cursor:pointer}" +
    ".fm-perc .qd .capo b{font-family:'Cinzel',serif;font-weight:400;" +
      "font-size:1rem;color:var(--c);filter:brightness(1.35)}" +
    ".fm-perc .qd .capo em{font-style:normal;font-family:'Cormorant Garamond',serif;" +
      "font-size:.8rem;color:rgba(245,240,230,.42);flex:1;min-width:0}" +
    ".fm-perc .qd .capo i{font-style:normal;flex:none;font-family:'Cinzel',serif;" +
      "font-size:.78rem;color:color-mix(in srgb,var(--c) 75%,transparent);" +
      "filter:brightness(1.3);width:1.5rem;height:1.5rem;border-radius:50%;" +
      "display:grid;place-items:center;" +
      "border:1px solid color-mix(in srgb,var(--c) 35%,transparent);align-self:center}" +
    ".fm-perc .qd .mm{display:grid;grid-template-rows:0fr;" +
      "transition:grid-template-rows .35s ease}" +
    ".fm-perc .qd.on .mm{grid-template-rows:1fr}" +
    ".fm-perc .qd .mm > div{overflow:hidden}" +
    ".fm-perc .qd .m{padding:.5rem .85rem;" +
      "border-top:1px solid color-mix(in srgb,var(--c) 12%,transparent)}" +
    ".fm-perc .qd .m b{display:block;font-weight:400;font-size:.88rem;" +
      "line-height:1.3;color:rgba(245,240,230,.92)}" +
    ".fm-perc .qd .m span{display:block;font-family:'Cormorant Garamond',serif;" +
      "font-size:.82rem;line-height:1.35;color:rgba(245,240,230,.44);margin-top:.05rem}" +

    ".fm-perc .sbl{border:1px solid rgba(200,160,85,.3);border-radius:.8rem;" +
      "background:rgba(200,160,85,.05);padding:.7rem .85rem;margin:.2rem 0 1.4rem;" +
      "font-size:.8rem;line-height:1.45;color:rgba(245,240,230,.5)}" +
    ".fm-perc .sbl b{color:#D4AF6A;font-weight:400}" +

    /* un gruppo */
    ".fm-perc .gr{border:1px solid color-mix(in srgb,var(--c) 24%,transparent);" +
      "border-left:3px solid color-mix(in srgb,var(--c) 58%,transparent);" +
      "border-radius:.8rem;background:color-mix(in srgb,var(--c) 5%,rgba(2,4,12,.42));" +
      "margin-bottom:.45rem;overflow:hidden;transition:border-color .2s}" +
    ".fm-perc .gr .capo{display:flex;align-items:center;gap:.55rem;" +
      "padding:.7rem .75rem;cursor:pointer}" +
    ".fm-perc .gr .capo .num{flex:none;width:1.4rem;height:1.4rem;border-radius:50%;" +
      "border:1px solid color-mix(in srgb,var(--c) 45%,transparent);color:var(--c);" +
      "filter:brightness(1.3);display:grid;place-items:center;" +
      "font-family:'Cinzel',serif;font-size:.66rem}" +
    ".fm-perc .gr .capo .tx{flex:1;min-width:0}" +
    ".fm-perc .gr .capo .tx b{display:block;font-family:'Cinzel',serif;" +
      "font-weight:400;font-size:.95rem;color:var(--c);filter:brightness(1.3);line-height:1.2}" +
    ".fm-perc .gr .capo .tx em{display:block;font-style:normal;" +
      "font-family:'Cormorant Garamond',serif;font-size:.8rem;" +
      "color:rgba(245,240,230,.4);margin-top:.05rem}" +
    ".fm-perc .gr .capo .q{flex:none;font-size:.62rem;color:rgba(245,240,230,.3)}" +
    ".fm-perc .gr .capo .fr{flex:none;color:rgba(245,240,230,.3);transition:transform .2s}" +
    ".fm-perc .gr.on .capo .fr{transform:rotate(90deg)}" +
    ".fm-perc .gr .dentro{display:none;padding:0 .75rem .65rem}" +
    ".fm-perc .gr.on .dentro{display:block}" +

    /* un talento, con la casella */
    ".fm-perc .tl{display:flex;align-items:center;gap:.5rem;padding:.5rem 0;" +
      "cursor:pointer;border-top:1px solid color-mix(in srgb,var(--c) 12%,transparent)}" +
    ".fm-perc .tl .s{flex:none;width:1.7rem;height:1.7rem;display:grid;place-items:center}" +
    ".fm-perc .tl .s svg{width:1.5rem;height:1.5rem;color:var(--c);filter:brightness(1.3)}" +
    ".fm-perc .tl .nn{flex:1;min-width:0}" +
    ".fm-perc .tl .nn b{display:block;font-weight:400;font-size:.9rem;line-height:1.25}" +
    ".fm-perc .tl .sp{flex:none;width:1.15rem;height:1.15rem;border-radius:.32rem;" +
      "border:1px solid color-mix(in srgb,var(--c) 40%,transparent)}" +
    ".fm-perc .tl.presa .sp{background:var(--c);border-color:var(--c)}" +
    ".fm-perc .tl.presa .sp::after{content:'\\2713';color:#0A0C1A;font-size:.72rem;" +
      "display:grid;place-items:center;height:100%}" +
    ".fm-perc .tl.presa .nn b{color:var(--c);filter:brightness(1.35)}" +

    /* la barra in fondo — sticky, non copre il Megafono */
    ".fm-perc .pi{position:sticky;bottom:0;z-index:5;transform:translateY(120%);" +
      "background:#0A0C1A;border-top:1px solid #C8A055;" +
      "padding:.8rem 1rem 1rem;transition:transform .3s;margin-top:1rem}" +
    ".fm-perc .pi.su{transform:none}" +
    ".fm-perc .pi .in{display:flex;align-items:center;gap:.6rem}" +
    ".fm-perc .pi .q{font-family:'Cinzel',serif;font-size:1.15rem;color:#D4AF6A}" +
    ".fm-perc .pi .t{flex:1;font-size:.76rem;line-height:1.3;color:rgba(245,240,230,.55)}" +
    ".fm-perc .pi .t b{display:block;color:#F5F0E6;font-weight:400;font-size:.84rem}" +
    ".fm-perc .pi button{background:#C8A055;color:#0A0C1A;border:0;" +
      "border-radius:.65rem;padding:.6rem .85rem;font-family:'Cinzel',serif;" +
      "font-size:.72rem;letter-spacing:.08em;cursor:pointer}";
  document.head.appendChild(s);
}

/* ── lo stato del modulo ── */
var percDati  = null;   /* {sezioni, gruppi, talenti, mosse} — letti una volta */
var percPrese = {};     /* talento_id → 1: le mie radici vive */
var percParti = null;   /* i pezzi del disegno corrente */
var percInCorso = {};   /* la briglia sul doppio tocco, per talento */

/* i tre quadranti: le parole del modello, i colori delle tre famiglie */
var PERC_QUADRANTI = [
  { famiglia: "fai",       nome: "Quello che fai",
    riga: "la tua giornata, i tuoi luoghi, le tue squadre",      colore: "#AA8844" },
  { famiglia: "condividi", nome: "Quello che condividi",
    riga: "quello che esce da te e raggiunge gli altri",         colore: "#669944" },
  { famiglia: "ricevi",    nome: "Quello che ricevi",
    riga: "sostegno, formazione, e quello che ti viene pagato",  colore: "#CC6644" }
];

/* ── l'unica porta: la chiama il guscio da vai() ── */
function percorsoDeiTalenti(c){
  percVeste();

  var r = document.createElement("div");
  r.className = "fm-perc";
  c.appendChild(r);
  percParti = { radice: r, corpo: null, pi: null, q: null, t: null };

  if(percDati){ percDisegna(); return; }
  percLeggi();
}

/* ── la lettura: le quattro tavole, una volta — e le mie radici, sempre ── */
function percLeggi(){
  if(typeof db === "undefined" || !db){
    console.warn("fm-talenti: il database non c’è — niente da disegnare");
    return;
  }
  var colto = { sezioni: null, gruppi: null, talenti: null, mosse: null };
  function forse(){
    if(!colto.sezioni || !colto.gruppi || !colto.talenti || !colto.mosse) return;
    percDati = colto;
    percRadiciLeggi(function(){ percDisegna(); });
  }
  function chiedi(tavola, campi, dove){
    db.from(tavola).select(campi).order("ordine")
      .then(function(r){
        if(!r || r.error){
          console.warn("fm-talenti: `" + tavola + "` non risponde — " +
            (r && r.error && r.error.message || "senza motivo"));
          return;
        }
        colto[dove] = (r.data) || [];
        forse();
      })
      .catch(function(e){
        console.warn("fm-talenti: `" + tavola + "` non risponde — " + (e && e.message));
      });
  }
  chiedi("talenti_famiglie", "id,chiave,nome,sottotitolo,colore,ordine", "sezioni");
  chiedi("talenti_gruppi",   "id,sezione_id,nome,descrizione,ordine",    "gruppi");
  chiedi("talenti_mosse",    "ordine,famiglia,testo,dettaglio",          "mosse");
  db.from("talenti").select("id,gruppo_id,nome,svg,ordine")
    .eq("attivo", true)
    .then(function(r){
      if(!r || r.error){
        console.warn("fm-talenti: `talenti` non risponde — " +
          (r && r.error && r.error.message || "senza motivo"));
        return;
      }
      colto.talenti = (r.data) || [];
      forse();
    })
    .catch(function(e){
      console.warn("fm-talenti: `talenti` non risponde — " + (e && e.message));
    });
}

/* le radici vive di chi guarda: il segno è `talento_id` pieno */
function percRadiciLeggi(poi){
  percPrese = {};
  if(typeof ospite !== "undefined" && ospite){ poi(); return; }
  if(typeof io === "undefined" || !io || !io.id){ poi(); return; }
  db.from("orme").select("talento_id")
    .eq("persona_id", io.id)
    .not("talento_id", "is", null)
    .then(function(r){
      if(r && !r.error) ((r.data) || []).forEach(function(x){
        if(x && x.talento_id != null) percPrese[x.talento_id] = 1;
      });
      poi();
    })
    .catch(function(){ poi(); });
}

/* ── il disegno: il modello, coi dati veri ── */
function percDisegna(){
  var p = percParti;
  if(!p || !percDati) return;
  var d = percDati;
  var r = p.radice;
  r.innerHTML = "";

  var oc = document.createElement("div");
  oc.className = "oc";
  oc.textContent = "i simboli dell’esperienza";
  r.appendChild(oc);
  var h1 = document.createElement("h1");
  h1.textContent = "Il percorso dei talenti";
  r.appendChild(h1);
  var sot = document.createElement("div");
  sot.className = "sot";
  sot.textContent = "Riconosci la radice della realizzazione.";
  r.appendChild(sot);

  /* il riquadro in cima: le parole del modello, esatte */
  var base = document.createElement("div");
  base.className = "base";
  var b1 = document.createElement("p");
  b1.innerHTML = "<b>Ciò che sceglierai formerà la radice delle orme</b> " +
    "con cui traccerai il tuo percorso di crescita e sviluppo su Felicitas.";
  var b2 = document.createElement("p");
  b2.innerHTML = "<b>Riconosci il tuo talento ed evolvi col supporto delle squadre.</b>";
  base.appendChild(b1); base.appendChild(b2);
  r.appendChild(base);

  /* i tre quadranti delle mosse: si aprono UNO PER VOLTA,
     e il primo è aperto all'arrivo */
  var quadranti = [];
  PERC_QUADRANTI.forEach(function(f, i){
    var mosse = d.mosse.filter(function(m){ return m.famiglia === f.famiglia; });
    if(!mosse.length) return;   /* il vuoto non si disegna */
    var qd = document.createElement("div");
    qd.className = "qd" + (i === 0 ? " on" : "");
    qd.style.setProperty("--c", f.colore);
    quadranti.push(qd);
    var capo = document.createElement("div");
    capo.className = "capo";
    var cb = document.createElement("b"); cb.textContent = f.nome;
    var ce = document.createElement("em"); ce.textContent = f.riga;
    var ci = document.createElement("i"); ci.textContent = String(mosse.length);
    capo.appendChild(cb); capo.appendChild(ce); capo.appendChild(ci);
    capo.addEventListener("click", function(){
      var era = qd.classList.toggle("on");
      if(era) quadranti.forEach(function(x){
        if(x !== qd) x.classList.remove("on");
      });
    });
    qd.appendChild(capo);
    var mm = document.createElement("div"); mm.className = "mm";
    var dentro = document.createElement("div");
    mosse.forEach(function(m){
      var riga = document.createElement("div");
      riga.className = "m";
      var mb = document.createElement("b"); mb.textContent = m.testo;
      riga.appendChild(mb);
      if(m.dettaglio){
        var ms = document.createElement("span"); ms.textContent = m.dettaglio;
        riga.appendChild(ms);
      }
      dentro.appendChild(riga);
    });
    mm.appendChild(dentro);
    qd.appendChild(mm);
    r.appendChild(qd);
  });

  /* la riga d'avviso sotto il blocco: regola, non mossa — parole del modello */
  var sbl = document.createElement("div");
  sbl.className = "sbl";
  sbl.innerHTML = "⛔ Le orme pubbliche, le squadre, il luogo sulla mappa, " +
    "formazioni e prodotti <b>si aprono col karma yoga o col praticantato</b>.";
  r.appendChild(sbl);

  /* le sezioni, e dentro i gruppi ordinati */
  var perSezione = {};
  d.gruppi.forEach(function(g){
    (perSezione[g.sezione_id] = perSezione[g.sezione_id] || []).push(g);
  });
  var perGruppo = {};
  d.talenti.forEach(function(t){
    if(t.gruppo_id == null) return;
    (perGruppo[t.gruppo_id] = perGruppo[t.gruppo_id] || []).push(t);
  });

  d.sezioni.forEach(function(sz){
    var gruppi = (perSezione[sz.id] || []).filter(function(g){
      return (perGruppo[g.id] || []).length;
    });
    if(!gruppi.length) return;   /* una sezione vuota non si disegna */

    /* ⛔ i gruppi in ordine alfabetico — il cammino no: è una sequenza */
    if(sz.chiave === "nexus"){
      gruppi.sort(function(a, b){ return a.ordine - b.ordine; });
    } else {
      gruppi.sort(function(a, b){
        return String(a.nome).localeCompare(String(b.nome), "it");
      });
    }

    var h2 = document.createElement("h2");
    h2.textContent = sz.nome || "";
    if(sz.sottotitolo){
      var sm = document.createElement("small");
      sm.textContent = sz.sottotitolo;
      h2.appendChild(sm);
    }
    r.appendChild(h2);

    gruppi.forEach(function(g, gi){
      var talenti = perGruppo[g.id].slice().sort(function(a, b){
        return String(a.nome).localeCompare(String(b.nome), "it");
      });
      var gr = document.createElement("div");
      gr.className = "gr";
      if(sz.colore) gr.style.setProperty("--c", sz.colore);
      var capo = document.createElement("div");
      capo.className = "capo";
      var num = document.createElement("span");
      num.className = "num"; num.textContent = String(gi + 1);
      var tx = document.createElement("span");
      tx.className = "tx";
      var tb = document.createElement("b"); tb.textContent = g.nome || "";
      tx.appendChild(tb);
      if(g.descrizione){
        var te = document.createElement("em"); te.textContent = g.descrizione;
        tx.appendChild(te);
      }
      var q = document.createElement("span");
      q.className = "q"; q.textContent = String(talenti.length);
      var fr = document.createElement("span");
      fr.className = "fr"; fr.textContent = "›";
      capo.appendChild(num); capo.appendChild(tx);
      capo.appendChild(q); capo.appendChild(fr);
      capo.addEventListener("click", function(){ gr.classList.toggle("on"); });
      gr.appendChild(capo);

      var dentro = document.createElement("div");
      dentro.className = "dentro";
      talenti.forEach(function(t){ dentro.appendChild(percTalento(t)); });
      gr.appendChild(dentro);
      r.appendChild(gr);
    });
  });

  /* la barra in fondo: sale solo quando si è preso qualcosa */
  var pi = document.createElement("div");
  pi.className = "pi";
  var pin = document.createElement("div"); pin.className = "in";
  var pq = document.createElement("span"); pq.className = "q";
  var pt = document.createElement("span"); pt.className = "t";
  var ptb = document.createElement("b");
  pt.appendChild(ptb);
  pt.appendChild(document.createTextNode("si consigliano cinque o dieci"));
  var pb = document.createElement("button");
  pb.type = "button";
  pb.textContent = "Apri le tue orme";
  pb.addEventListener("click", function(){
    if(typeof vai === "function") vai("orme");
  });
  pin.appendChild(pq); pin.appendChild(pt); pin.appendChild(pb);
  pi.appendChild(pin);
  r.appendChild(pi);
  p.pi = pi; p.q = pq; p.t = ptb;

  percConta();
}

/* ── un talento: il segno, il nome, la casella ── */
function percTalento(t){
  var riga = document.createElement("div");
  riga.className = "tl" + (percPrese[t.id] ? " presa" : "");
  var s = document.createElement("span");
  s.className = "s";
  s.innerHTML = t.svg || "";   /* senza segno resta lo spazio: vuoto, non inventato */
  var nn = document.createElement("span");
  nn.className = "nn";
  var nb = document.createElement("b"); nb.textContent = t.nome || "";
  nn.appendChild(nb);
  var sp = document.createElement("span");
  sp.className = "sp";
  riga.appendChild(s); riga.appendChild(nn); riga.appendChild(sp);
  riga.addEventListener("click", function(e){
    e.stopPropagation();
    percTocco(t, riga);
  });
  return riga;
}

/* il conto nella barra: le parole del modello */
function percConta(){
  var p = percParti;
  if(!p || !p.pi) return;
  var n = Object.keys(percPrese).length;
  p.q.textContent = String(n);
  p.t.textContent = (n === 1) ? "un segno preso" : n + " segni presi";
  p.pi.classList.toggle("su", n > 0);
}

/* ── il tocco sulla casella ──
   ⭐ prendere apre l'orma radice, subito; togliere lascia l'orma e
      stacca il talento. Da fuori il gesto passa la porta, come in
      fm-radice.js: la scelta viaggia in `?scelta=` e al ritorno
      quel file completa il gesto. */
function percTocco(t, riga){
  if(typeof ospite !== "undefined" && ospite){
    var qui = "spazio-vivo.html?scelta=" + encodeURIComponent(t.nome);
    location.href = "accesso.html?torna=" + encodeURIComponent(qui);
    return;
  }
  if(typeof io === "undefined" || !io || !io.id) return;
  if(percInCorso[t.id]) return;
  percInCorso[t.id] = 1;

  function fine(){ delete percInCorso[t.id]; }

  if(percPrese[t.id]){
    /* togliere: la riga resta, il talento si stacca */
    db.from("orme").update({ talento_id: null })
      .eq("persona_id", io.id)
      .eq("talento_id", t.id)
      .then(function(r){
        fine();
        if(r && r.error){
          console.warn("fm-talenti: il talento non si è staccato — " + r.error.message);
          return;
        }
        delete percPrese[t.id];
        riga.classList.remove("presa");
        percConta();
      })
      .catch(function(e){
        fine();
        console.warn("fm-talenti: il talento non si è staccato — " + (e && e.message));
      });
    return;
  }

  /* prendere: nasce l'orma radice — la stessa forma di fm-radice.js,
     PUBBLICA per decisione del 2 settembre */
  db.from("orme").insert({
      persona_id: io.id, talento_id: t.id, contenuto: t.nome,
      tipo: "talento_radice", visibilita: "pubblico"
    })
    .then(function(r){
      fine();
      if(r && r.error){
        console.warn("fm-talenti: la radice non è nata — " + r.error.message);
        return;
      }
      percPrese[t.id] = 1;
      riga.classList.add("presa");
      percConta();
    })
    .catch(function(e){
      fine();
      console.warn("fm-talenti: la radice non è nata — " + (e && e.message));
    });
}
