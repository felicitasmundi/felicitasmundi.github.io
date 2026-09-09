/* ═══════════════════════════════════════════════════════════════
   Comunità Eterna FelicitasMundi · LA MIA ORMA — la matrice

   Il disegno è quello di `matrice-orma.html` (in linea, MD5
   abe8939c08b5939fee81d4c4a7d0c3b8, verificato prima di leggere):
   qui si riproduce leggendo i dati veri. Sostituisce la home di
   fm-mia-orma.js (3 settembre), che è intera in PRECEDENTI.

   DALL'ALTO: il riquadro del tempo (data · luna · santo) · la
   testa col cerchio, il livello da fm_livello e il vicinato
   radice · i tre gesti · i talenti presi che SONO I FILTRI ·
   Antahkarana, tasto fisso · LE MIE ORME · le squadre.

   ⭐ IL FILO — versato dal ⑤ e dal database:
      la radice ha `talento_id` pieno e `filo_id` vuoto;
      ogni figlia ha `talento_id` vuoto e `filo_id` = radice.
      `orma_madre_id` è la madre immediata: dà «↳ nata da …»
      e il conto «[ n ] dentro». ⛔ Le orme NON si annidano:
      sotto ogni radice stanno in fila.

   ⚠️ [ in attesa ] L'ÀNCORA DEL SECONDO TALENTO — «⚓ ancorata
      anche a …» — non ha ancora una colonna nel database:
      scritto al database, la cucitura è UNA (ormaAncoraDi).

   ⛔ I GESTI SONO DUE, e portano a due pagine — non aprono campi.
      «+ nuova orma» NON c'è: il Megafono è fisso in basso e si vede
      sempre — scrivere dentro è già fare un'orma, e un tasto che
      apre una seconda strada per la stessa cosa è un doppione.
      · «contatto» → matrice-rubrica.html
      · «costi» → la pagina dei costi (fm-costi.js, rotta «costi»).
      Parole di Gab, 8 settembre: «ore e note non sono più
      necessarie, anche perché ogni orma di per sé è una nota».

   ⚠️ [ in attesa ] LE SQUADRE non hanno ancora una tavola da cui
      riempirsi: resta il riquadro del modello, con le sue parole.

   ⛔ La biografia NON sta qui: è il profilo pubblico.
   ⛔ Da ospite si vedono solo la data e il riquadro del tempo.

   ⚠️ Le misure: il modello scala l'intera pagina a 1.2 — qui i
      rem sono scritti già moltiplicati, così la resa è identica
      al modello in linea. Zero px nei caratteri.

   Il guscio chiama `laMatriceDellOrma(contenitore)` da vai().

   ⛔ Niente involucro (function(){ … })(): il guscio mette tutto
      in comune e questo file legge da lì.
   ═══════════════════════════════════════════════════════════════ */

"use strict";

/* i cinque elementi → la stanza e il colore: la mappa versata
   (memoria del Cruscotto, la stessa di fm-ordinamenti.js) */
var MAT_STANZE = {
  terra: { stanza: "Vicinati",   colore: "#AA8844" },
  acqua: { stanza: "Emporio",    colore: "#4488BB" },
  aria:  { stanza: "Edizione",   colore: "#669944" },
  etere: { stanza: "Scuola",     colore: "#9966CC" },
  fuoco: { stanza: "Assistenza", colore: "#CC6644" }
};
var MAT_SVIL = "#5A7A8C";

/* ── la veste: quella del modello, sotto il nome .fm-mat ── */
function matVeste(){
  if(document.getElementById("fm-mat-veste")) return;
  var s = document.createElement("style");
  s.id = "fm-mat-veste";
  s.textContent =
    ".fm-mat{width:100%;max-width:36rem;margin:0 auto;position:relative;" +
      "padding:0 0 2.4rem;font-family:'DM Sans',system-ui,sans-serif;color:#F5F0E6}" +
    ".fm-mat *{box-sizing:border-box}" +
    ".fm-mat .corpo{padding:0 1.2rem}" +

    /* il riquadro del tempo */
    ".fm-mat .tempo{display:flex;gap:.66rem;padding:1.68rem 1.2rem .36rem}" +
    ".fm-mat .tempo .q{flex:1;border:1px solid rgba(184,150,62,.22);" +
      "border-radius:.9rem;background:rgba(8,11,26,.4);" +
      "padding:.66rem .6rem;text-align:center}" +
    ".fm-mat .tempo .q b{display:block;font-family:'Cinzel',serif;font-weight:400;" +
      "font-size:.98rem;color:#D4AF6A;line-height:1.2}" +
    ".fm-mat .tempo .q span{display:block;font-size:.74rem;" +
      "color:rgba(245,240,230,.4);margin-top:.24rem}" +
    ".fm-mat .tempo .q .lu{font-size:1.38rem;line-height:1}" +

    /* la testa: chi sei, e a che livello */
    ".fm-mat .io{display:flex;align-items:center;gap:.72rem;padding:1.08rem 1.2rem .36rem}" +
    ".fm-mat .io .av{width:3.6rem;height:3.6rem;border-radius:50%;flex:none;" +
      "display:grid;place-items:center;font-family:'Cinzel',serif;font-size:1.14rem;" +
      "color:#D4AF6A;border:2px solid #C8A055;background:rgba(200,160,85,.2);" +
      "position:relative;box-shadow:0 0 1.2rem rgba(200,160,85,.45)," +
      "0 0 0 .3rem rgba(200,160,85,.12)}" +
    ".fm-mat .io .av::after{content:'\\2726';position:absolute;top:-.36rem;" +
      "right:-.36rem;font-size:.74rem;color:#C8A055}" +
    ".fm-mat .io .nm b{display:block;font-family:'Cinzel',serif;font-weight:400;" +
      "font-size:1.32rem;color:#D4AF6A}" +
    ".fm-mat .io .nm span{display:block;font-size:.89rem;" +
      "color:rgba(245,240,230,.45);margin-top:.12rem}" +

    /* i tre gesti */
    ".fm-mat .gesti{display:flex;gap:.48rem;padding:.84rem 1.2rem .24rem;flex-wrap:wrap}" +
    ".fm-mat .ge{display:inline-flex;align-items:center;gap:.42rem;" +
      "font-family:'DM Sans',sans-serif;font-size:.96rem;padding:.48rem .96rem;" +
      "border-radius:1.68rem;cursor:pointer;background:transparent;" +
      "border:1px solid rgba(245,240,230,.16);color:rgba(245,240,230,.7)}" +
    ".fm-mat .ge i{font-style:normal;font-size:1.08rem;line-height:1;" +
      "color:rgba(245,240,230,.5)}" +

    /* i talenti presi: i filtri */
    ".fm-mat .et3{font-size:.7rem;letter-spacing:.14em;text-transform:uppercase;" +
      "color:rgba(245,240,230,.35);margin:.84rem 1.2rem .42rem}" +
    ".fm-mat .segni{display:flex;gap:.42rem;flex-wrap:wrap;padding:0 1.2rem .24rem}" +
    ".fm-mat .segni .sg{display:inline-flex;align-items:center;gap:.38rem;" +
      "font-size:.91rem;padding:.26rem .72rem;border-radius:1.2rem;cursor:pointer;" +
      "border:1px solid color-mix(in srgb,var(--c,#C8A055) 45%,transparent);" +
      "background:color-mix(in srgb,var(--c,#C8A055) 12%,transparent);" +
      "color:rgba(245,240,230,.85);transition:border-color .2s,background .2s,opacity .2s}" +
    ".fm-mat .segni .sg i{width:.48rem;height:.48rem;border-radius:50%;" +
      "background:var(--c,#C8A055);display:block}" +
    ".fm-mat .segni .sg.on{border-color:#C8A055;background:rgba(200,160,85,.2);" +
      "color:#D4AF6A;box-shadow:0 0 .72rem rgba(200,160,85,.3)}" +
    ".fm-mat .segni .sg.vu{opacity:.45;border-style:dashed}" +
    ".fm-mat .segni .piu{font-size:.91rem;padding:.26rem .72rem;border-radius:1.2rem;" +
      "border:1px dashed rgba(245,240,230,.2);color:rgba(245,240,230,.35);cursor:pointer}" +

    ".fm-mat h2{font-family:'Cinzel',serif;font-weight:400;font-size:1.14rem;" +
      "color:#D4AF6A;margin:1.8rem 0 .6rem;padding-top:1.08rem;" +
      "border-top:1px solid rgba(184,150,62,.22)}" +
    ".fm-mat h2 small{display:block;font-family:'Cormorant Garamond',serif;" +
      "font-style:italic;font-size:.98rem;color:rgba(245,240,230,.4);" +
      "margin-top:.12rem;letter-spacing:0}" +

    /* Antahkarana: il tasto fisso */
    ".fm-mat .prat{display:flex;align-items:center;gap:.72rem;" +
      "border:1px solid rgba(200,160,85,.5);border-radius:1.02rem;" +
      "background:rgba(200,160,85,.09);padding:.96rem 1.02rem;margin:.72rem 0;" +
      "cursor:pointer}" +
    ".fm-mat .prat .sg{width:2.64rem;height:2.64rem;border-radius:50%;flex:none;" +
      "display:grid;place-items:center;border:1px solid #C8A055;" +
      "color:#D4AF6A;font-size:1.2rem}" +
    ".fm-mat .prat .tx{flex:1}" +
    ".fm-mat .prat .tx b{display:block;font-family:'Cinzel',serif;font-weight:400;" +
      "font-size:1.1rem;color:#D4AF6A}" +
    ".fm-mat .prat .tx span{display:block;font-size:.94rem;" +
      "color:rgba(245,240,230,.5);margin-top:.12rem}" +

    /* un'orma: la forma fissata */
    ".fm-mat .orma{border:1px solid color-mix(in srgb,var(--c,#C8A055) 26%,transparent);" +
      "border-left:3px solid color-mix(in srgb,var(--c,#C8A055) 60%,transparent);" +
      "border-radius:1.08rem;background:color-mix(in srgb,var(--c,#C8A055) 9%,rgba(8,11,26,.5));" +
      "margin-bottom:.6rem;cursor:pointer;transition:transform .22s,border-color .22s}" +
    ".fm-mat .orma:hover{transform:translateX(3px);" +
      "border-color:color-mix(in srgb,var(--c,#C8A055) 56%,transparent)}" +
    ".fm-mat .orma > .den{padding:1.02rem}" +
    ".fm-mat .testa{display:flex;align-items:center;gap:.48rem;margin-bottom:.54rem}" +
    ".fm-mat .ce{width:1.8rem;height:1.8rem;border-radius:50%;flex:none;" +
      "display:grid;place-items:center;font-size:.67rem;color:#F5F0E6;" +
      "border:1px solid color-mix(in srgb,var(--c,#C8A055) 55%,transparent);" +
      "background:color-mix(in srgb,var(--c,#C8A055) 18%,transparent)}" +
    ".fm-mat .ce+.ce{margin-left:-.62rem}" +
    ".fm-mat .ce.osp{border-style:dashed;opacity:.65}" +
    ".fm-mat .testa .nn{font-size:.98rem;color:rgba(245,240,230,.72);" +
      "margin-left:.3rem;flex:1;min-width:0;overflow:hidden;" +
      "text-overflow:ellipsis;white-space:nowrap}" +
    ".fm-mat .testa .qd{flex:none;font-size:.84rem;color:rgba(245,240,230,.44)}" +
    ".fm-mat .ti{font-family:'Cormorant Garamond',serif;font-size:1.34rem;line-height:1.32}" +
    ".fm-mat .sub{font-family:'Cormorant Garamond',serif;font-style:italic;" +
      "font-size:1.1rem;color:rgba(245,240,230,.48);margin-top:.14rem;line-height:1.35}" +
    ".fm-mat .piede{display:flex;gap:.38rem;align-items:center;flex-wrap:wrap;" +
      "margin-top:.6rem;font-size:.9rem;color:rgba(245,240,230,.52)}" +
    ".fm-mat .st{display:inline-flex;align-items:center;gap:.36rem;font-size:.72rem;" +
      "letter-spacing:.05em;padding:.11rem .58rem;border-radius:1.2rem;" +
      "border:1px solid rgba(245,240,230,.16);color:rgba(245,240,230,.8)}" +
    ".fm-mat .st i{width:.43rem;height:.43rem;border-radius:50%;display:block}" +
    ".fm-mat .st.coda i{background:rgba(245,240,230,.4)}" +
    ".fm-mat .st.avanz{border-color:rgba(170,136,68,.55)}" +
    ".fm-mat .st.avanz i{background:#AA8844}" +
    ".fm-mat .st.svil{border-color:rgba(110,158,90,.55);color:#6E9E5A}" +
    ".fm-mat .st.svil i{background:#6E9E5A}" +
    ".fm-mat .piede .fr{margin-left:auto;color:rgba(245,240,230,.3);flex:none}" +
    ".fm-mat .piede .dentro2{color:#D4AF6A}" +
    ".fm-mat .orma .da{margin-top:.48rem;font-size:.91rem;" +
      "color:rgba(245,240,230,.42);line-height:1.4}" +
    ".fm-mat .orma .da b{color:rgba(245,240,230,.74);font-weight:400}" +
    ".fm-mat .da.vuoto2{color:" + MAT_SVIL + ";filter:brightness(1.35);" +
      "border:1px dashed rgba(90,122,140,.5);border-radius:1.2rem;" +
      "padding:.17rem .66rem;display:inline-block}" +

    /* «da collegare», e la radice con le orme in fila */
    ".fm-mat .collegare,.fm-mat .radice{margin-bottom:.72rem}" +
    ".fm-mat .collegare > .capo{display:flex;align-items:center;gap:.6rem;" +
      "border:1px dashed rgba(90,122,140,.6);border-radius:.96rem;" +
      "background:rgba(90,122,140,.1);padding:.72rem .96rem}" +
    ".fm-mat .collegare > .capo i{width:.54rem;height:.54rem;border-radius:50%;" +
      "background:" + MAT_SVIL + ";display:block;flex:none}" +
    ".fm-mat .collegare > .capo b{font-family:'Cinzel',serif;font-weight:400;" +
      "font-size:1.08rem;color:" + MAT_SVIL + ";filter:brightness(1.4);flex:1}" +
    ".fm-mat .collegare > .capo em{font-style:normal;font-size:.82rem;" +
      "color:rgba(245,240,230,.4)}" +
    ".fm-mat .radice > .capo{display:flex;align-items:center;gap:.6rem;" +
      "border:2px solid color-mix(in srgb,var(--c,#C8A055) 55%,transparent);" +
      "border-radius:.96rem;" +
      "background:color-mix(in srgb,var(--c,#C8A055) 14%,rgba(8,11,26,.5));" +
      "padding:.72rem .96rem;" +
      "box-shadow:0 0 .96rem color-mix(in srgb,var(--c,#C8A055) 22%,transparent)}" +
    ".fm-mat .radice > .capo .sgt{width:2.88rem;height:2.88rem;flex:none;" +
      "color:var(--c,#C8A055);filter:brightness(1.25) " +
      "drop-shadow(0 0 .6rem color-mix(in srgb,var(--c,#C8A055) 40%,transparent))}" +
    ".fm-mat .radice > .capo .sgt svg{width:100%;height:100%;display:block}" +
    ".fm-mat .radice > .capo b{font-family:'Cinzel',serif;font-weight:400;" +
      "font-size:1.1rem;color:var(--c,#C8A055);filter:brightness(1.35);flex:1}" +
    ".fm-mat .radice > .capo em{font-style:normal;font-size:.82rem;" +
      "color:rgba(245,240,230,.4)}" +
    ".fm-mat .sotto{position:relative;padding-left:1.62rem;margin:.48rem 0 0 1.08rem}" +
    ".fm-mat .sotto::before{content:'';position:absolute;left:.48rem;top:-.24rem;" +
      "bottom:1.2rem;width:1px;" +
      "background:color-mix(in srgb,var(--c,#C8A055) 45%,transparent)}" +
    ".fm-mat .sotto > .orma{position:relative}" +
    ".fm-mat .sotto > .orma::before{content:'';position:absolute;left:-1.18rem;" +
      "top:1.38rem;width:.74rem;height:1px;" +
      "background:color-mix(in srgb,var(--c,#C8A055) 45%,transparent)}" +
    ".fm-mat .collegare .sotto::before," +
    ".fm-mat .collegare .sotto > .orma::before{background:rgba(90,122,140,.5)}" +

    /* i talenti che aspettano, le squadre, il vuoto */
    ".fm-mat .ferme{border:1px dashed rgba(245,240,230,.16);border-radius:.96rem;" +
      "background:rgba(8,11,26,.35);padding:.72rem .96rem;margin-bottom:.6rem}" +
    ".fm-mat .ferme b{display:block;font-weight:400;font-size:1.02rem;" +
      "color:rgba(245,240,230,.55)}" +
    ".fm-mat .ferme span{display:block;font-family:'Cormorant Garamond',serif;" +
      "font-size:1.02rem;color:rgba(245,240,230,.32);margin-top:.18rem;line-height:1.4}" +
    ".fm-mat .sq{border:1px solid rgba(184,150,62,.22);border-radius:1.02rem;" +
      "background:rgba(8,11,26,.45);padding:.9rem 1.02rem;margin-bottom:.54rem}" +
    ".fm-mat .sq b{font-family:'Cinzel',serif;font-weight:400;font-size:1.08rem;" +
      "color:#D4AF6A}" +
    ".fm-mat .sq .d{font-size:.98rem;color:rgba(245,240,230,.5);" +
      "margin-top:.24rem;line-height:1.4}" +
    ".fm-mat .sq.vuota{border-style:dashed;opacity:.65}" +
    ".fm-mat .sq.vuota .d{font-family:'Cormorant Garamond',serif;font-style:italic}";
  document.head.appendChild(s);
}

/* ── lo stato del modulo ── */
var matParti = null;
var matFiltro = "tutti";

function matGiornoDi(o){
  if(typeof giornoDi === "function") return giornoDi(o);
  if(o && o.accaduto_il) return String(o.accaduto_il).slice(0,10);
  return String(o && o.momento || "").slice(0,10);
}
function matIniziali(nome){
  var p = String(nome || "").trim().split(/\s+/);
  var due = (p[0] ? p[0][0] : "") + (p[1] ? p[1][0] : "");
  return due.toUpperCase() || "—";
}
function matElemento(o){
  if(typeof DOVE === "undefined" || !DOVE || !o || !o.tipo) return null;
  var q = DOVE.filter(function(x){ return x.tipo === o.tipo; })[0];
  return (q && q.el) || null;
}

/* ⚠️ [ in attesa ] l'àncora del secondo talento: quando il database
   le darà una casa, si legge qui — un punto solo */
function ormaAncoraDi(o){ return null; }

/* ── l'unica porta: la chiama il guscio da vai() ── */
function laMatriceDellOrma(c){
  matVeste();
  var r = document.createElement("div");
  r.className = "fm-mat";
  c.appendChild(r);
  matParti = { radice: r, caselle: null };

  /* ① il riquadro del tempo: la data, la luna, il santo */
  var tempo = document.createElement("div");
  tempo.className = "tempo";
  var caselle = {};
  [["data"],["luna"],["santo"]].forEach(function(k){
    var q = document.createElement("div"); q.className = "q";
    var b = document.createElement("b");
    var s = document.createElement("span");
    q.appendChild(b); q.appendChild(s); tempo.appendChild(q);
    caselle[k[0]] = { b: b, s: s };
  });
  caselle.luna.b.className = "lu";
  r.appendChild(tempo);
  matParti.caselle = caselle;

  var oggi = new Date();
  caselle.data.b.textContent = String(oggi.getDate());
  caselle.data.s.textContent = oggi.toLocaleDateString("it-IT", { month: "long" });
  matTempo(typeof GIORNO !== "undefined" ? GIORNO : null);
  matAscoltaIlGiorno();

  /* ⛔ da ospite si vedono solo la data e il riquadro del tempo */
  if(typeof ospite !== "undefined" && ospite) return;
  if(typeof io === "undefined" || !io || !io.id) return;

  /* ② la testa: il cerchio, il nome, il livello, il vicinato radice */
  var testa = document.createElement("div");
  testa.className = "io";
  var av = document.createElement("span"); av.className = "av"; av.textContent = "—";
  var nm = document.createElement("span"); nm.className = "nm";
  var nmb = document.createElement("b");
  var nms = document.createElement("span");
  nm.appendChild(nmb); nm.appendChild(nms);
  testa.appendChild(av); testa.appendChild(nm);
  r.appendChild(testa);
  matTesta(av, nmb, nms);

  /* ③ i due gesti: portano a due pagine, non aprono campi.
     «+ nuova orma» non c'è — il Megafono in basso è già quella strada */
  var gesti = document.createElement("div");
  gesti.className = "gesti";
  [ ["☉", "contatto", "", function(){
       if(typeof location !== "undefined") location.href = "matrice-rubrica.html";
     }],
    ["€", "costi", "", function(){
       /* la pagina dei costi ora c'è: fm-costi.js, rotta del guscio */
       if(typeof vai === "function") vai("costi");
     }] ].forEach(function(g){
    var b = document.createElement("button");
    b.type = "button";
    b.className = "ge" + (g[2] ? " " + g[2] : "");
    var i = document.createElement("i"); i.textContent = g[0];
    b.appendChild(i);
    b.appendChild(document.createTextNode(g[1]));
    b.addEventListener("click", g[3]);
    gesti.appendChild(b);
  });
  r.appendChild(gesti);

  /* ④ i filtri, ⑤ Antahkarana, ⑥ le orme, ⑦ le squadre: coi dati */
  var et3 = document.createElement("div");
  et3.className = "et3";
  et3.textContent = "i miei talenti · toccane uno per filtrare";
  r.appendChild(et3);
  var segni = document.createElement("div"); segni.className = "segni";
  r.appendChild(segni);

  var corpo = document.createElement("div"); corpo.className = "corpo";
  r.appendChild(corpo);

  var prat = document.createElement("div");
  prat.className = "prat";
  var psg = document.createElement("span"); psg.className = "sg"; psg.textContent = "✦";
  var ptx = document.createElement("span"); ptx.className = "tx";
  var ptb = document.createElement("b"); ptb.textContent = "Antahkarana";
  ptx.appendChild(ptb);
  var pfr = document.createElement("span");
  pfr.style.color = "rgba(245,240,230,.3)"; pfr.textContent = "›";
  prat.appendChild(psg); prat.appendChild(ptx); prat.appendChild(pfr);
  prat.addEventListener("click", function(){
    if(typeof vai === "function") vai("sentiero");
  });
  corpo.appendChild(prat);

  var h2 = document.createElement("h2");
  h2.textContent = "Le mie orme";
  var sm = document.createElement("small");
  sm.textContent = "una radice per talento, e sotto tutto quello che ne è venuto";
  h2.appendChild(sm);
  corpo.appendChild(h2);

  var orme = document.createElement("div");
  corpo.appendChild(orme);

  var h2s = document.createElement("h2");
  h2s.textContent = "Le squadre";
  var sms = document.createElement("small");
  sms.textContent = "i riquadri si riempiono in base a chi guarda";
  h2s.appendChild(sms);
  corpo.appendChild(h2s);
  var sq = document.createElement("div");
  sq.className = "sq vuota";
  var sqd = document.createElement("div");
  sqd.className = "d";
  sqd.textContent = "Compare quando ti chiamano dentro.";
  sq.appendChild(sqd);
  corpo.appendChild(sq);

  matParti.segni = segni;
  matParti.orme = orme;
  matFiltro = "tutti";
  matLeggi();
}

/* ── il riquadro del tempo si riempie: la stessa strada della home ── */
function matTempo(g){
  var p = matParti;
  if(!p || !p.caselle) return;
  p.caselle.luna.b.textContent = "🌑";
  p.caselle.luna.s.textContent = (g && g.fase) || "—";
  p.caselle.santo.b.textContent = (g && g.santo) || "—";
  p.caselle.santo.s.textContent = "il santo";
}
function matAscoltaIlGiorno(){
  window.SpazioVivo = window.SpazioVivo || {};
  var prima = window.SpazioVivo.oggi;
  if(!prima || !prima.fmMat){
    var mio = function(g){
      if(typeof prima === "function") prima(g);
      matTempo(g);
    };
    mio.fmMat = true;
    window.SpazioVivo.oggi = mio;
  }
  if(typeof riempiIlGiorno === "function") riempiIlGiorno();
}

/* ── la testa: nome da persone_pubbliche, livello da fm_livello,
   vicinato dalla propria riga ── */
function matTesta(av, nmb, nms){
  var pezzi = { livello: null, vicinato: null };
  function versa(){
    var riga = [];
    if(pezzi.livello) riga.push(pezzi.livello);
    if(pezzi.vicinato) riga.push(pezzi.vicinato);
    nms.textContent = riga.join(" · ");
  }
  db.from("persone_pubbliche").select("nome").eq("id", io.id).maybeSingle()
    .then(function(r){
      var nome = r && r.data && r.data.nome;
      if(nome){ nmb.textContent = nome; av.textContent = matIniziali(nome); }
    })
    .catch(function(){});
  db.rpc("fm_livello", { p_persona: io.id })
    .then(function(r){
      if(r && !r.error && r.data){ pezzi.livello = String(r.data); versa(); }
    })
    .catch(function(){});
  db.from("persone").select("vicinato_id").eq("id", io.id).maybeSingle()
    .then(function(r){
      var vid = r && r.data && r.data.vicinato_id;
      if(!vid) return;
      db.from("vicinati").select("nome").eq("id", vid).maybeSingle()
        .then(function(v){
          if(v && v.data && v.data.nome){ pezzi.vicinato = v.data.nome; versa(); }
        })
        .catch(function(){});
    })
    .catch(function(){});
}

/* ── le letture della matrice ── */
var matRighe = null;      /* le mie orme */
var matTalenti = null;    /* id → {nome, svg, colore} dei talenti presi */
var matGente = {};        /* orma_id → [righe di orma_persone] */

function matLeggi(){
  if(typeof db === "undefined" || !db) return;
  db.from("orme")
    .select("id,titolo,sottotitolo,contenuto,tipo,destinazione,momento," +
            "accaduto_il,luogo,stadio,talento_id,filo_id,orma_madre_id")
    .eq("persona_id", io.id)
    .order("momento", { ascending: false })
    .limit(300)
    .then(function(r){
      if(!r || r.error){
        console.warn("fm-orma-mia: le orme non rispondono — " +
          (r && r.error && r.error.message || "senza motivo"));
        return;
      }
      matRighe = (r.data) || [];
      matTalentiLeggi(function(){
        matGenteLeggi(function(){ matDisegna(); });
      });
    })
    .catch(function(e){
      console.warn("fm-orma-mia: le orme non rispondono — " + (e && e.message));
    });
}

function matTalentiLeggi(poi){
  var ids = [];
  (matRighe || []).forEach(function(o){
    if(o.talento_id != null && ids.indexOf(o.talento_id) < 0) ids.push(o.talento_id);
  });
  if(!ids.length){ matTalenti = {}; poi(); return; }
  db.from("talenti").select("id,nome,svg,gruppo_id").in("id", ids)
    .then(function(rt){
      var talenti = {};
      ((rt && rt.data) || []).forEach(function(t){
        talenti[t.id] = { nome: t.nome, svg: t.svg || "", colore: null };
      });
      db.from("talenti_gruppi").select("id,sezione_id")
        .then(function(rg){
          var sez = {};
          ((rg && rg.data) || []).forEach(function(g){ sez[g.id] = g.sezione_id; });
          db.from("talenti_famiglie").select("id,colore")
            .then(function(rf){
              var col = {};
              ((rf && rf.data) || []).forEach(function(f){ col[f.id] = f.colore; });
              ((rt && rt.data) || []).forEach(function(t){
                talenti[t.id].colore = col[sez[t.gruppo_id]] || null;
              });
              matTalenti = talenti; poi();
            })
            .catch(function(){ matTalenti = talenti; poi(); });
        })
        .catch(function(){ matTalenti = talenti; poi(); });
    })
    .catch(function(){ matTalenti = {}; poi(); });
}

function matGenteLeggi(poi){
  matGente = {};
  var ids = (matRighe || []).map(function(o){ return o.id; });
  if(!ids.length){ poi(); return; }
  db.from("orma_persone").select("orma_id,nome,stato").in("orma_id", ids)
    .then(function(r){
      ((r && r.data) || []).forEach(function(x){
        (matGente[x.orma_id] = matGente[x.orma_id] || []).push(x);
      });
      poi();
    })
    .catch(function(){ poi(); });
}

/* ── la forma fissata di un'orma: testa · titolo · riga · piede ── */
function matOrma(o, colore){
  var d = document.createElement("div");
  d.className = "orma";
  if(colore) d.style.setProperty("--c", colore);
  var den = document.createElement("div");
  den.className = "den";

  var testa = document.createElement("div");
  testa.className = "testa";
  var gente = matGente[o.id] || [];
  gente.slice(0, 4).forEach(function(x){
    var ce = document.createElement("span");
    ce.className = "ce" + (x.stato === "confermato" ? "" : " osp");
    ce.textContent = matIniziali(x.nome);
    testa.appendChild(ce);
  });
  if(gente.length){
    var nn = document.createElement("span");
    nn.className = "nn";
    nn.textContent = gente.map(function(x){ return x.nome; }).join(" · ");
    testa.appendChild(nn);
  }
  var qd = document.createElement("span");
  qd.className = "qd";
  qd.textContent = o.luogo ||
    (typeof nomeDelGiorno === "function" ? nomeDelGiorno(matGiornoDi(o)) : matGiornoDi(o));
  testa.appendChild(qd);
  den.appendChild(testa);

  var ti = document.createElement("div");
  ti.className = "ti";
  ti.textContent = o.titolo || String(o.contenuto || "").split("\n")[0].slice(0, 80);
  den.appendChild(ti);
  if(o.sottotitolo){
    var sub = document.createElement("div");
    sub.className = "sub";
    sub.textContent = o.sottotitolo;
    den.appendChild(sub);
  }

  var piede = document.createElement("div");
  piede.className = "piede";
  var el = matElemento(o);
  var stanza = el && MAT_STANZE[el];
  if(stanza){
    var st = document.createElement("span");
    st.style.color = stanza.colore;
    st.style.filter = "brightness(1.3)";
    st.textContent = stanza.stanza;
    piede.appendChild(st);
  }
  if(o.stadio){
    var mappa = { in_coda: ["in coda", "coda"],
                  in_avanzamento: ["in avanzamento", "avanz"],
                  sviluppato: ["sviluppato", "svil"] };
    var m = mappa[o.stadio];
    if(m){
      if(piede.children.length) piede.appendChild(matPunto());
      var pill = document.createElement("span");
      pill.className = "st " + m[1];
      var i = document.createElement("i");
      pill.appendChild(i);
      pill.appendChild(document.createTextNode(m[0]));
      piede.appendChild(pill);
    }
  }
  var nate = (matRighe || []).filter(function(x){
    return x.orma_madre_id === o.id;
  }).length;
  if(nate){
    if(piede.children.length) piede.appendChild(matPunto());
    var den2 = document.createElement("span");
    den2.className = "dentro2";
    den2.textContent = nate + " dentro";
    piede.appendChild(den2);
  }
  var fr = document.createElement("span");
  fr.className = "fr"; fr.textContent = "›";
  piede.appendChild(fr);
  den.appendChild(piede);

  /* le righe sotto il piede: nata da · ancorata · da collegare */
  if(o.orma_madre_id){
    var madre = (matRighe || []).filter(function(x){ return x.id === o.orma_madre_id; })[0];
    if(madre){
      var da = document.createElement("div");
      da.className = "da";
      da.appendChild(document.createTextNode("↳ nata da "));
      var b = document.createElement("b");
      b.textContent = madre.titolo || String(madre.contenuto || "").split("\n")[0].slice(0, 60);
      da.appendChild(b);
      den.appendChild(da);
    }
  }
  var ancora = ormaAncoraDi(o);
  if(ancora){
    var an = document.createElement("div");
    an.className = "da";
    an.appendChild(document.createTextNode("⚓ ancorata anche a "));
    var ab = document.createElement("b"); ab.textContent = ancora;
    an.appendChild(ab);
    den.appendChild(an);
    d.style.borderStyle = "dashed";
  }
  if(o.talento_id == null && o.filo_id == null){
    var vu = document.createElement("div");
    vu.className = "da vuoto2";
    vu.textContent = "↳ da collegare a un talento";
    den.appendChild(vu);
  }

  d.appendChild(den);
  d.addEventListener("click", function(){
    window.ormaChiesta = o.id;
    if(typeof vai === "function") vai("orma");
  });
  return d;
}
function matPunto(){
  var s = document.createElement("span");
  s.textContent = "·";
  return s;
}

/* ── il disegno delle orme e dei filtri ── */
function matDisegna(){
  var p = matParti;
  if(!p || !matRighe || !matTalenti) return;

  var radici = matRighe.filter(function(o){ return o.talento_id != null; });
  var daCollegare = matRighe.filter(function(o){
    return o.talento_id == null && o.filo_id == null;
  });
  var figlieDi = {};
  matRighe.forEach(function(o){
    if(o.filo_id != null)
      (figlieDi[o.filo_id] = figlieDi[o.filo_id] || []).push(o);
  });

  /* ④ i filtri: «tutti», poi un segno per talento preso */
  p.segni.innerHTML = "";
  function chip(testo, colore, chiave, vu){
    var sg = document.createElement("span");
    sg.className = "sg" + (matFiltro === chiave ? " on" : "") + (vu ? " vu" : "");
    if(colore) sg.style.setProperty("--c", colore);
    var i = document.createElement("i");
    sg.appendChild(i);
    sg.appendChild(document.createTextNode(testo));
    sg.addEventListener("click", function(){
      matFiltro = chiave;
      matDisegna();
    });
    p.segni.appendChild(sg);
  }
  chip("tutti", "#C8A055", "tutti", false);
  radici.forEach(function(rad){
    var t = matTalenti[rad.talento_id] || {};
    var senza = !(figlieDi[rad.id] || []).length;
    chip(t.nome || rad.contenuto || "", t.colore, String(rad.talento_id), senza);
  });
  var piu = document.createElement("span");
  piu.className = "piu";
  piu.textContent = "+ aggiungi";
  piu.addEventListener("click", function(){
    if(typeof vai === "function") vai("percorso");
  });
  p.segni.appendChild(piu);

  /* ⑥ le mie orme */
  p.orme.innerHTML = "";

  /* «Da collegare» in cima, se ce ne sono — e solo su «tutti» */
  if(daCollegare.length && matFiltro === "tutti"){
    var col = document.createElement("div");
    col.className = "collegare";
    var capo = document.createElement("div");
    capo.className = "capo";
    var ci = document.createElement("i");
    var cb = document.createElement("b"); cb.textContent = "Da collegare";
    var ce = document.createElement("em"); ce.textContent = String(daCollegare.length);
    capo.appendChild(ci); capo.appendChild(cb); capo.appendChild(ce);
    col.appendChild(capo);
    var sotto = document.createElement("div");
    sotto.className = "sotto";
    daCollegare.forEach(function(o){ sotto.appendChild(matOrma(o, MAT_SVIL)); });
    col.appendChild(sotto);
    p.orme.appendChild(col);
  }

  /* una radice per talento, col segno; sotto le sue orme IN FILA */
  var ferme = [];
  radici.forEach(function(rad){
    var t = matTalenti[rad.talento_id] || {};
    var figlie = figlieDi[rad.id] || [];
    if(!figlie.length){ ferme.push(t.nome || rad.contenuto || ""); return; }
    if(matFiltro !== "tutti" && matFiltro !== String(rad.talento_id)) return;

    var blocco = document.createElement("div");
    blocco.className = "radice";
    if(t.colore) blocco.style.setProperty("--c", t.colore);
    var capo = document.createElement("div");
    capo.className = "capo";
    var sgt = document.createElement("span");
    sgt.className = "sgt";
    sgt.innerHTML = t.svg || "";
    var b = document.createElement("b");
    b.textContent = t.nome || rad.contenuto || "";
    var em = document.createElement("em");
    em.textContent = figlie.length === 1 ? "un’orma" : figlie.length + " orme";
    capo.appendChild(sgt); capo.appendChild(b); capo.appendChild(em);
    blocco.appendChild(capo);

    var sotto = document.createElement("div");
    sotto.className = "sotto";
    figlie.forEach(function(o){
      var el = matElemento(o);
      var colore = (el && MAT_STANZE[el] && MAT_STANZE[el].colore) || t.colore;
      sotto.appendChild(matOrma(o, colore));
    });
    blocco.appendChild(sotto);
    p.orme.appendChild(blocco);
  });

  /* le radici senza orme: una riga sola, che non occupa spazio */
  var fermeViste = (matFiltro === "tutti") ||
    ferme.length && radici.some(function(rad){
      return String(rad.talento_id) === matFiltro && !(figlieDi[rad.id] || []).length;
    });
  if(ferme.length && fermeViste){
    var fe = document.createElement("div");
    fe.className = "ferme";
    var fb = document.createElement("b");
    fb.textContent = ferme.length === 1
      ? "un talento non ha ancora un’orma"
      : ferme.length + " talenti non hanno ancora un’orma";
    var fs = document.createElement("span");
    fs.textContent = ferme.join(" · ");
    fe.appendChild(fb); fe.appendChild(fs);
    p.orme.appendChild(fe);
  }
}
