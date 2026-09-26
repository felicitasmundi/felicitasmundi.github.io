/* ═══════════════════════════════════════════════════════════════
   Comunità Eterna FelicitasMundi · I COSTI — la matrice

   Il disegno è quello di `costi-matrice.html` (consegna del 10
   settembre, 8.884 · 8e81517e209433aeadff5bddebf7f011, MD5
   verificato prima di leggere). Si disegna DENTRO il contenitore
   che il guscio gli passa: niente pagina, niente fondo.

   ⛔ LA REGOLA DELLA PAGINA: un costo è un'orma figlia, e questa
      pagina è una vista che le raccoglie. Le categorie sono i
      talenti.

   ⚠️ [ in attesa ] I CAMPI DELL'ORMA-SPESA — importo, segno,
      ricorrente — NON sono ancora nel database. Quindi:
      · il conto del mese (entrato · uscito · resta) porta
        [ in attesa ] al posto dei numeri
      · «quanto rende un talento» e «quello che torna ogni mese»
        NON si disegnano: senza importi non c'è niente da contare
      · le voci si disegnano per data, con «↳ da …» e la stanza,
        senza la cifra.
      Quando i campi arrivano, i punti da riempire sono segnati
      con [ in attesa ] qui dentro.

   ⛔ Da ospite non si disegna niente oltre il titolo: i costi
      sono di chi guarda.
   ⛔ Niente involucro (function(){ … })(): il guscio mette tutto
      in comune e questo file legge da lì.
   ═══════════════════════════════════════════════════════════════ */

"use strict";

var COSTI_STANZE = {
  terra: "Vicinati", acqua: "Emporio", aria: "Edizione",
  etere: "Scuola", fuoco: "Assistenza"
};

function costiVeste(){
  if(document.getElementById("fm-costi-veste")) return;
  var s = document.createElement("style");
  s.id = "fm-costi-veste";
  s.textContent =
    ".fm-costi{width:100%;max-width:37rem;margin:0 auto;" +
      "padding:1.8rem 1.2rem 3.6rem;" +
      "font-family:'DM Sans',system-ui,sans-serif;color:#F5F0E6}" +
    ".fm-costi *{box-sizing:border-box}" +
    ".fm-costi .oc{font-size:.77rem;letter-spacing:.2em;text-transform:uppercase;" +
      "color:#C8A055;margin-bottom:.36rem}" +
    ".fm-costi h1{font-family:'Cinzel',serif;font-weight:400;font-size:1.7rem;" +
      "line-height:1.2;margin:0 0 1.08rem}" +

    ".fm-costi .mesi{display:flex;gap:.36rem;overflow-x:auto;margin-bottom:1.08rem;" +
      "padding-bottom:.24rem;scrollbar-width:none}" +
    ".fm-costi .mesi::-webkit-scrollbar{display:none}" +
    ".fm-costi .mesi button{font-family:'DM Sans',sans-serif;font-size:.94rem;" +
      "padding:.36rem .96rem;border-radius:1.68rem;cursor:pointer;" +
      "background:transparent;white-space:nowrap;" +
      "border:1px solid rgba(245,240,230,.16);color:rgba(245,240,230,.55)}" +
    ".fm-costi .mesi button.on{border-color:#C8A055;" +
      "background:rgba(200,160,85,.18);color:#D4AF6A}" +

    /* il conto del mese */
    ".fm-costi .conto{border:1px solid rgba(200,160,85,.4);border-radius:1.08rem;" +
      "background:linear-gradient(160deg,rgba(200,160,85,.12),rgba(8,11,26,.5));" +
      "padding:1.2rem;margin-bottom:.72rem}" +
    ".fm-costi .conto .rt{display:flex;justify-content:space-between;" +
      "align-items:baseline;padding:.36rem 0;font-size:1.08rem;" +
      "color:rgba(245,240,230,.65)}" +
    ".fm-costi .conto .rt b{font-family:'Cinzel',serif;font-size:1.26rem;font-weight:400}" +
    ".fm-costi .conto .rt.entrato b{color:#6E9E5A;filter:brightness(1.2)}" +
    ".fm-costi .conto .rt.uscito b{color:#C9707A;filter:brightness(1.15)}" +
    ".fm-costi .conto .resta{display:flex;justify-content:space-between;" +
      "align-items:baseline;margin-top:.6rem;padding-top:.72rem;" +
      "border-top:1px solid rgba(200,160,85,.28)}" +
    ".fm-costi .conto .resta span{font-size:.86rem;letter-spacing:.12em;" +
      "text-transform:uppercase;color:rgba(245,240,230,.42)}" +
    ".fm-costi .conto .resta b{font-family:'Cinzel',serif;font-size:1.8rem;" +
      "color:#D4AF6A;font-weight:400}" +
    ".fm-costi .conto .attesa{font-family:'Cormorant Garamond',serif;" +
      "font-style:italic;font-size:1rem;color:rgba(245,240,230,.45)}" +

    ".fm-costi .tit{font-size:.72rem;letter-spacing:.15em;text-transform:uppercase;" +
      "color:#C8A055;margin:1.8rem 0 .6rem;padding-top:1.2rem;" +
      "border-top:1px solid rgba(184,150,62,.22)}" +
    ".fm-costi .tit span{color:rgba(245,240,230,.34);letter-spacing:.06em}" +

    /* le righe */
    ".fm-costi .gg{font-size:.82rem;letter-spacing:.1em;text-transform:uppercase;" +
      "color:rgba(245,240,230,.32);margin:1.08rem 0 .42rem .12rem}" +
    ".fm-costi .rg{display:flex;align-items:center;gap:.72rem;" +
      "padding:.66rem .84rem;margin-bottom:.36rem;cursor:pointer;" +
      "border:1px solid rgba(245,240,230,.1);border-radius:.84rem;" +
      "background:rgba(8,11,26,.4)}" +
    ".fm-costi .rg .dd{flex:none;width:2.88rem;text-align:center}" +
    ".fm-costi .rg .dd b{display:block;font-family:'Cinzel',serif;" +
      "font-size:1.14rem;line-height:1;font-weight:400}" +
    ".fm-costi .rg .dd span{display:block;font-size:.72rem;" +
      "color:rgba(245,240,230,.35);letter-spacing:.06em}" +
    ".fm-costi .rg .tx{flex:1;min-width:0}" +
    ".fm-costi .rg .tx b{display:block;font-weight:400;font-size:1.08rem;" +
      "line-height:1.25}" +
    ".fm-costi .rg .tx .da{display:block;font-size:.89rem;" +
      "color:rgba(245,240,230,.4);margin-top:.12rem;line-height:1.35}" +
    ".fm-costi .rg .tx .da em{font-style:normal;color:rgba(245,240,230,.62)}" +
    ".fm-costi .rg .im{flex:none;font-family:'Cormorant Garamond',serif;" +
      "font-style:italic;font-size:.89rem;color:rgba(245,240,230,.35)}";
  document.head.appendChild(s);
}

/* ── lo stato del modulo ── */
var costiParti = null;
var costiMese  = null;    /* "AAAA-MM", oppure "anno" */
var costiRighe = null;
var costiMadri = {};

function costiGiornoDi(o){
  if(typeof giornoDi === "function") return giornoDi(o);
  if(o.accaduto_il) return String(o.accaduto_il).slice(0,10);
  return String(o.momento || "").slice(0,10);
}
function costiMeseDi(o){ return costiGiornoDi(o).slice(0,7); }
function costiOggiMese(){
  var d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,"0");
}
function costiNomeMese(m){
  return new Date(m + "-15T12:00:00").toLocaleDateString("it-IT",
    { month: "long", year: "numeric" });
}
function costiStanzaDi(o){
  if(typeof DOVE === "undefined" || !DOVE || !o.tipo) return null;
  var q = DOVE.filter(function(x){ return x.tipo === o.tipo; })[0];
  return (q && q.el && COSTI_STANZE[q.el]) || null;
}

/* ── l'unica porta: la chiama il guscio da vai() ── */
function iCosti(c){
  costiVeste();
  var r = document.createElement("div");
  r.className = "fm-costi";
  c.appendChild(r);
  costiParti = { radice: r, mesi: null, conto: null, lista: null };

  var oc = document.createElement("div");
  oc.className = "oc";
  oc.textContent = "quello che esce e quello che entra";
  r.appendChild(oc);
  var h1 = document.createElement("h1");
  h1.textContent = "I costi";
  r.appendChild(h1);

  /* ⛔ i costi sono di chi guarda: da fuori non si disegna altro */
  if(typeof ospite !== "undefined" && ospite) return;
  if(typeof io === "undefined" || !io || !io.id) return;

  var mesi = document.createElement("div");
  mesi.className = "mesi";
  r.appendChild(mesi);
  costiParti.mesi = mesi;

  var conto = document.createElement("div");
  r.appendChild(conto);
  costiParti.conto = conto;

  var lista = document.createElement("div");
  r.appendChild(lista);
  costiParti.lista = lista;

  if(costiMese == null) costiMese = costiOggiMese();
  costiLeggi();
}

/* ── le letture: le orme-spesa, e le madri per il «da» ── */
function costiLeggi(){
  if(typeof db === "undefined" || !db) return;
  db.from("orme")
    .select("id,titolo,contenuto,tipo,momento,accaduto_il,orma_madre_id,filo_id")
    .eq("persona_id", io.id)
    .eq("tipo", "spesa")
    .order("momento", { ascending: false })
    .then(function(r){
      if(!r || r.error){
        console.warn("fm-costi: le voci non rispondono — " +
          (r && r.error && r.error.message || "senza motivo"));
        return;
      }
      costiRighe = (r.data) || [];
      var ids = [];
      costiRighe.forEach(function(o){
        var m = o.orma_madre_id || o.filo_id;
        if(m && !costiMadri[m] && ids.indexOf(m) < 0) ids.push(m);
      });
      if(!ids.length){ costiDisegna(); return; }
      db.from("orme").select("id,titolo,contenuto").in("id", ids)
        .then(function(rm){
          ((rm && rm.data) || []).forEach(function(o){
            costiMadri[o.id] = o.titolo ||
              String(o.contenuto || "").split("\n")[0].slice(0, 60);
          });
          costiDisegna();
        })
        .catch(function(){ costiDisegna(); });
    })
    .catch(function(e){
      console.warn("fm-costi: le voci non rispondono — " + (e && e.message));
    });
}

/* ── il disegno ── */
function costiDisegna(){
  var p = costiParti;
  if(!p || !costiRighe) return;

  /* i mesi che hanno voci, più quello di oggi, più l'anno */
  var mesi = [costiOggiMese()];
  costiRighe.forEach(function(o){
    var m = costiMeseDi(o);
    if(m && mesi.indexOf(m) < 0) mesi.push(m);
  });
  mesi.sort();
  p.mesi.innerHTML = "";
  mesi.forEach(function(m){
    var b = document.createElement("button");
    b.type = "button";
    b.textContent = (m === costiOggiMese()) ? "questo mese" : costiNomeMese(m);
    if(m === costiMese) b.className = "on";
    b.addEventListener("click", function(){ costiMese = m; costiDisegna(); });
    p.mesi.appendChild(b);
  });
  var anno = document.createElement("button");
  anno.type = "button";
  anno.textContent = "l’anno";
  if(costiMese === "anno") anno.className = "on";
  anno.addEventListener("click", function(){ costiMese = "anno"; costiDisegna(); });
  p.mesi.appendChild(anno);

  /* il conto del mese — ⚠️ [ in attesa ] di importo e segno */
  p.conto.innerHTML = "";
  var conto = document.createElement("div");
  conto.className = "conto";
  [ ["entrato", "entrato"], ["uscito", "uscito"] ].forEach(function(v){
    var rt = document.createElement("div");
    rt.className = "rt " + v[1];
    var sp = document.createElement("span"); sp.textContent = v[0];
    var b = document.createElement("b");
    b.className = "attesa"; b.textContent = "[ in attesa ]";
    rt.appendChild(sp); rt.appendChild(b);
    conto.appendChild(rt);
  });
  var resta = document.createElement("div");
  resta.className = "resta";
  var rs = document.createElement("span"); rs.textContent = "resta";
  var rb = document.createElement("b");
  rb.className = "attesa"; rb.textContent = "[ in attesa ]";
  resta.appendChild(rs); resta.appendChild(rb);
  conto.appendChild(resta);
  p.conto.appendChild(conto);

  /* ⚠️ [ in attesa ] «Quanto rende un talento» e «Quello che torna
     ogni mese» si disegnano quando ci sono importo e ricorrente:
     senza, non c'è niente da contare e il riquadro non compare */

  /* le voci, in ordine di data */
  p.lista.innerHTML = "";
  var voci = costiRighe.filter(function(o){
    if(costiMese === "anno")
      return costiGiornoDi(o).slice(0,4) === String(new Date().getFullYear());
    return costiMeseDi(o) === costiMese;
  }).sort(function(a, b){
    return costiGiornoDi(a) < costiGiornoDi(b) ? 1 : -1;
  });
  if(!voci.length) return;   /* un mese senza voci non mostra righe */

  var tit = document.createElement("div");
  tit.className = "tit";
  tit.appendChild(document.createTextNode("Le voci "));
  var ts = document.createElement("span");
  ts.textContent = "· in ordine di data";
  tit.appendChild(ts);
  p.lista.appendChild(tit);

  var meseScritto = null;
  voci.forEach(function(o){
    var m = costiMeseDi(o);
    if(m !== meseScritto){
      meseScritto = m;
      var gg = document.createElement("div");
      gg.className = "gg";
      gg.textContent = costiNomeMese(m);
      p.lista.appendChild(gg);
    }
    var rg = document.createElement("div");
    rg.className = "rg";
    var dd = document.createElement("span");
    dd.className = "dd";
    var g = costiGiornoDi(o);
    var db1 = document.createElement("b");
    db1.textContent = String(parseInt(g.slice(8,10), 10) || "");
    var ds = document.createElement("span");
    ds.textContent = new Date(g + "T12:00:00")
      .toLocaleDateString("it-IT", { month: "short" });
    dd.appendChild(db1); dd.appendChild(ds);
    var tx = document.createElement("span");
    tx.className = "tx";
    var b = document.createElement("b");
    b.textContent = o.titolo || String(o.contenuto || "").split("\n")[0].slice(0, 80);
    tx.appendChild(b);
    var madre = costiMadri[o.orma_madre_id || o.filo_id];
    var stanza = costiStanzaDi(o);
    if(madre || stanza){
      var da = document.createElement("span");
      da.className = "da";
      if(madre){
        da.appendChild(document.createTextNode("↳ da "));
        var em = document.createElement("em");
        em.textContent = madre;
        da.appendChild(em);
      }
      if(madre && stanza) da.appendChild(document.createTextNode(" · "));
      if(stanza) da.appendChild(document.createTextNode(stanza));
      tx.appendChild(da);
    }
    /* ⚠️ [ in attesa ] la cifra: arriva col campo `importo` */
    var im = document.createElement("span");
    im.className = "im";
    im.textContent = "[ in attesa ]";
    rg.appendChild(dd); rg.appendChild(tx); rg.appendChild(im);
    rg.addEventListener("click", function(){
      window.ormaChiesta = o.id;
      if(typeof vai === "function") vai("orma");
    });
    p.lista.appendChild(rg);
  });
}
