/* ═══════════════════════════════════════════════════════════════
   IL MEGAFONO — estratto dal guscio il 12 settembre 2026
   per ordine di Gab, che da qui in poi lo scrive direttamente.

   ⭐ SPOSTATO E BASTA: i tre pezzi sono quelli del guscio, tali e
      quali — la veste (righe 924-1008), il disegno (1689-1748) e la
      logica (6016-6842) dello spazio-vivo-prova.html del 12 settembre
      (a85ce56f73f7a48b1f7e42add848d865). Niente è stato corretto.

   ⭐ COME SI CARICA: il guscio lo richiama NEL PUNTO ESATTO dove la
      logica viveva — lo script grande si chiude, questo file passa,
      lo script grande riprende. Così l'ordine di esecuzione è
      identico a prima del taglio.

   ⛔ Niente involucro: come ogni fm-*.js legge quello che il guscio
      mette in comune ($, db, io, vai...), e le sue funzioni — parla()
      compresa — restano visibili al guscio.
   ═══════════════════════════════════════════════════════════════ */

"use strict";

/* ══ ① LA VESTE — nel guscio era nel <style>, qui si posa da sé ══ */
var fmMgVeste = document.createElement("style");
fmMgVeste.id = "fm-mg-veste";
fmMgVeste.textContent = `  /* ⭐ TOCCATO NEL GUSCIO ㊶ — LA VESTE DEL MEGAFONO NUOVO, dal modello di
     Gab megafono-innesto.html · 15.951 byte · 082a37465a0ef33eb3ed9b9c39df1c30.
     Un quadrante solo: il campo dentro un riquadro, i simboli sotto, fermi
     — il tondino del tipo, i tre segni (quando · dove · con chi), la
     graffa, la freccia. Quello che si apre sale SOPRA il quadrante in
     .mg-pan: la pagina non viene mai schiacciata.
     ⚠️ Le misure del modello stavano sotto --t-eti: qui nessun carattere
        scende sotto --t-eti, come da canone. E i tocchi stanno a 2.75rem
        — la regola ⑯ del guscio, confermata da Gab il 10 settembre. */
  .mg-box{background:rgba(245,240,230,0.05);border:1px solid rgba(245,240,230,0.14);
    border-radius:1.4rem;padding:0.75rem 0.75rem 0.6rem;transition:border-color .2s}
  .mg-box:focus-within{border-color:rgba(200,160,85,0.45)}
  .mg-box #campo{background:transparent;border:0;border-radius:0;
    min-height:2.4rem;padding:0.1rem 0.4rem 0.35rem;font-style:italic}
  /* \u26d4 LA RIGA NON DEBORDA. Il conto di prima non tornava: tipo 6.2 +
     tre segni 8.25 + graffa 2.75 + invio 2.75 + sei spazi 2.4 = 22.35rem,
     e su un telefono ce ne stanno circa 16. Ora il tondino del tipo \u00e8
     l'unica cosa che si stringe: prende quello che avanza e taglia il nome
     coi puntini. I tocchi restano tutti a 2.75rem. */
  .mg-sotto{display:flex;align-items:center;gap:0.3rem;margin-top:0.35rem;
    height:2.75rem;min-width:0}
  .mg-vuoto{display:none}
  .mg-tipo{--c:var(--oro);flex:1 1 auto;min-width:2.75rem;max-width:9rem;
    overflow:hidden;text-overflow:ellipsis;height:2.75rem;
    font-family:'DM Sans',sans-serif;font-size:var(--t-eti);
    padding:0 0.7rem;border-radius:1.2rem;display:block;line-height:2.65rem;
    text-align:center;cursor:pointer;white-space:nowrap;
    border:1px solid color-mix(in srgb,var(--c) 55%,transparent);
    background:color-mix(in srgb,var(--c) 16%,transparent);
    color:var(--c);filter:brightness(1.25);transition:border-color .2s,background .2s}
  .mg-vsg,.mg-gf,.mg-inv{width:2.75rem;height:2.75rem;border-radius:50%;flex:none;
    display:grid;place-items:center;cursor:pointer;
    border:1px solid rgba(245,240,230,0.16);background:transparent;
    color:rgba(245,240,230,0.5);
    transition:border-color .18s,background .18s,color .18s}
  .mg-vsg svg{width:1.05rem;height:1.05rem;display:block}
  .mg-vsg.on{border-color:var(--oro);background:rgba(200,160,85,0.2);color:var(--oro-ch)}
  .mg-gf{border-color:rgba(200,160,85,0.35);color:var(--oro-ch);font-size:0.95rem}
  .mg-gf.on{border-color:var(--oro);background:rgba(200,160,85,0.2)}
  .mg-inv{background:var(--oro);border-color:var(--oro);color:#0A0C1A;font-size:1.05rem}
  .mg-inv.pronto{box-shadow:0 0 0.7rem rgba(200,160,85,0.5)}
  .mg-inv:not(.pronto){opacity:0.35}

  /* \u26d4 Sotto i 26.5rem i cinque tocchi da 2.75rem non ci stanno pi\u00f9
     in riga: 265 px di tondini pi\u00f9 gli spazi, contro una riga di 305.
     Allora il tondino del tipo va a capo, largo quanto serve. I tocchi
     non si rimpiccioliscono mai. */
  @media (max-width:26.5rem){
    .mg-sotto{flex-wrap:wrap;height:auto;row-gap:0.4rem}
    .mg-tipo{flex:0 0 100%;max-width:none;order:-1}
  }

  /* quello che si apre — il tipo, il calendarietto, i comuni, i nomi */
  .mg-pan{position:absolute;left:0.65rem;right:0.65rem;bottom:calc(100% + 0.4rem);
    background:#0E1224;border:1px solid rgba(200,160,85,0.35);border-radius:1rem;
    padding:0.5rem;display:none;max-height:15rem;overflow-y:auto;
    box-shadow:0 -0.5rem 1.4rem rgba(0,0,0,0.5);z-index:3}
  .mg-pan.si{display:block}
  .mg-pan .et2{font-family:'DM Sans',sans-serif;font-size:var(--t-eti);
    letter-spacing:0.14em;text-transform:uppercase;
    color:rgba(245,240,230,0.35);padding:0.2rem 0.5rem 0.35rem}
  .mg-pan .campoP{width:100%;background:rgba(245,240,230,0.05);
    border:1px solid rgba(245,240,230,0.14);border-radius:0.7rem;
    padding:0.45rem 0.7rem;color:var(--ivory);font-family:'DM Sans',sans-serif;
    font-size:0.9rem;outline:none;margin-bottom:0.3rem}
  .mg-pan button{display:block;width:100%;text-align:left;background:transparent;
    border:0;border-radius:0.6rem;padding:0.42rem 0.6rem;color:rgba(245,240,230,0.85);
    font-family:'DM Sans',sans-serif;font-size:0.9rem;cursor:pointer}
  .mg-pan button:hover{background:rgba(200,160,85,0.14);color:var(--oro-ch)}
  .mg-pan .due2{display:grid;grid-template-columns:1fr 1fr;gap:0.3rem;padding:0.15rem}
  .mg-pan .tb{display:flex;align-items:center;gap:0.5rem;width:100%;text-align:left;
    border:1px solid color-mix(in srgb,var(--c) 32%,transparent);border-radius:0.7rem;
    background:color-mix(in srgb,var(--c) 8%,transparent);padding:0.5rem 0.6rem;
    color:rgba(245,240,230,0.85);font-size:var(--t-eti);cursor:pointer}
  .mg-pan .tb:hover{background:color-mix(in srgb,var(--c) 18%,transparent)}
  .mg-pan .tb.on{border-color:var(--c);background:color-mix(in srgb,var(--c) 22%,transparent)}
  .mg-pan .tb i{width:0.7rem;height:0.7rem;flex:none;font-style:normal;
    border:1.5px solid var(--c);display:block;filter:brightness(1.3)}
  .mg-pan .tb.nex i{width:1.45rem;height:1.45rem;border:0;background:none;margin:-0.3rem 0}
  .mg-pan .tb.nex .nx{width:100%;height:100%;display:block}
  .mg-pan .tb.cerchio i{border-radius:50%}
  .mg-pan .tb.quadro i{border-radius:0.1rem}
  .mg-pan .tb.rombo i{transform:rotate(45deg);border-radius:0.06rem}
  .mg-pan .tb.tondo i{border-radius:50%;background:var(--c)}
  .mg-pan .gg2{display:grid;grid-template-columns:repeat(7,1fr);gap:0.15rem;padding:0.2rem}
  .mg-pan .gg2 b{text-align:center;font-family:'DM Sans',sans-serif;
    font-size:var(--t-eti);font-weight:400;color:rgba(245,240,230,0.3);padding:0.2rem 0}
  .mg-pan .gg2 span{text-align:center;font-family:'DM Sans',sans-serif;
    font-size:var(--t-eti);padding:0.35rem 0;border-radius:0.5rem;
    cursor:pointer;color:rgba(245,240,230,0.75)}
  .mg-pan .gg2 span:hover{background:rgba(200,160,85,0.18);color:var(--oro-ch)}
  .mg-pan .gg2 span.oggi{border:1px solid rgba(200,160,85,0.5);color:var(--oro-ch)}

  /* «è nata un'orma»: il cartiglio verde che sale e svanisce */
  .mg-nato{position:absolute;left:0.9rem;right:0.9rem;bottom:calc(100% + 0.5rem);
    border:1px solid rgba(102,153,68,0.5);border-radius:0.75rem;
    background:rgba(102,153,68,0.14);padding:0.6rem 0.8rem;
    font-family:'DM Sans',sans-serif;font-size:var(--t-eti);
    color:#8FBF6A;opacity:0;transform:translateY(0.4rem);
    transition:opacity .25s,transform .25s;pointer-events:none;z-index:3}
  .mg-nato.si{opacity:1;transform:none}`;
document.head.appendChild(fmMgVeste);

/* ══ ② IL DISEGNO — nel guscio stava subito dopo <main id="centro">,
      e torna esattamente lì ══ */
document.getElementById("centro").insertAdjacentHTML("afterend", `<div id="mg">
  <!-- ⭐ TOCCATO NEL GUSCIO ㊶ — il foglio «dove lo porti» (.vele) se n'è
       andato: era già senza maniglia dal ㉓, e con lui i tre tasti della
       visibilità e «Dov'è successo / Quando». La visibilità dell'orma
       nuova è sempre \`solo_me\` alla nascita. -->
  <div class="parola" id="parola"><p id="parola-tx"></p></div>
  <!-- ⭐ TOCCATO NEL GUSCIO ⑮ — L'ONDA È UN SVG SOLO, quello dello studio.
       Prima la disegnava il guscio, riga per riga, da --onda-amp e --onda-len:
       un'onda regolare, sempre uguale, rifatta a ogni resize. Questa è
       irregolare come una riva, e sta ferma. -->
  <svg class="onda" id="onda" viewBox="0 0 1200 26" preserveAspectRatio="none" aria-hidden="true">
    <path d="M0,15 C120,4 210,24 330,16 C450,8 520,22 640,17
             C760,12 840,3 960,11 C1080,19 1140,9 1200,13
             L1200,26 L0,26 Z" fill="var(--scafo)" opacity=".96"/>
    <path d="M0,15 C120,4 210,24 330,16 C450,8 520,22 640,17
             C760,12 840,3 960,11 C1080,19 1140,9 1200,13"
          fill="none" stroke="rgba(212,175,106,.34)" stroke-width="1"/>
  </svg>
  <div class="ponte">
    <div class="dentro">
      <!-- ⭐ TOCCATO NEL GUSCIO ⑯ — LA FORMA A RIPOSO, presa dallo studio
           megafono-riposo.html · 10.846 byte · afcbe0ad73bc573ed61bfa57cbed87ce
           ⛔ Nessun tasto si perde e nessun gesto cambia: sono gli stessi
              tasti, con gli stessi id e gli stessi ascolti. Cambia soltanto
              QUANDO si vedono.
           · a riposo: il segno dell'orma a sinistra, il campo, la graffa
           · con del testo: il segno si accende, la freccia d'oro compare,
             e sotto il campo scendono i cinque segni e la riga di prima -->
      <!-- ⭐ TOCCATO NEL GUSCIO ㊶ — IL MEGAFONO NUOVO, dal modello di Gab
           megafono-innesto.html · 15.951 byte · 082a37465a0ef33eb3ed9b9c39df1c30.
           Sostituisce la riga vecchia, non la affianca. Un quadrante solo,
           incollato in basso: il campo si alza man mano che aumentano le
           frasi, i simboli sotto stanno fermi, e quello che si apre sale
           SOPRA in .mg-pan — la pagina non viene mai schiacciata.
           · il tondino dice che cosa è, e i tipi sono cinque, karma yoga
             per primo: karma yoga · obiettivo · contatto · spesa · racconto.
             \`n\` è quello che si legge, \`d\` quello che si scrive nella tavola.
           · niente tasto «+», niente scelta di visibilità o destinazione:
             quando detti stai catturando, non organizzando. L'orma nasce
             \`solo_me\` e va da sé in «Da collegare».
           ⛔ Il contenitore di prova del modello NON è stato copiato: la
              pagina vera è il #centro qui sopra. -->
      <div class="mg-nato" id="mg-nato"></div>
      <div class="mg-pan" id="mg-pan"></div>
      <div class="mg-box">
        <textarea id="campo" rows="1" placeholder="scrivi la tua orma"></textarea>
        <div class="mg-sotto">
          <span class="mg-tipo" id="mg-tipo">karma yoga</span>
          <button type="button" class="mg-vsg" data-p="quando" title="oggi"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg></button>
          <button type="button" class="mg-vsg" data-p="dove" title="dove"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z"/><circle cx="12" cy="10" r="2.4"/></svg></button>
          <button type="button" class="mg-vsg" data-p="chi" title="con chi"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8.5" r="3.2"/><path d="M3 20c0-3.3 2.7-5.4 6-5.4s6 2.1 6 5.4"/><path d="M16 5.6a3.2 3.2 0 0 1 0 5.8M17.5 14.9c2 .7 3.5 2.5 3.5 5.1"/></svg></button>
          <span class="mg-vuoto"></span>
          <button type="button" class="mg-gf" id="mg-gf" title="Allegato">&#128206;&#xFE0E;</button>
          <input type="file" id="mg-file" multiple hidden>
          <button type="button" class="mg-inv" id="mg-inv" title="Manda">&#8594;</button>
        </div>
      </div>
    </div>
  </div>
</div>`);

/* ══ ③ LA LOGICA ══ */
  /* ══ IL MEGAFONO ══ */
  var campo=$("campo");
  /* ⭐ TOCCATO NEL GUSCIO ㉖ — A CAMPO VUOTO NON SI SCRIVE NESSUNA ALTEZZA.
     Il difetto: si mandava un'orma lunga e il campo restava alto, vuoto.
     Non era l'invio. Era la misura. `scrollHeight` di un textarea vuoto
     conta anche il segnaposto, e il segnaposto va a capo quando il campo
     è stretto. Sul telefono, nel momento in cui si misura, il campo è
     largo 160 e non 242: `mg-pieno` è ancora addosso al corpo — cresci()
     corre PRIMA di mgAggiorna() — e il segno dell'orma e la freccia
     stanno ancora prendendo il loro posto. Lì «scrivi la tua orma» sta su
     tre righe: 98 invece di 62. Quei 98 finivano scritti nello stile del
     campo, e ci restavano anche dopo che la riga si era riallargata.
     Misurato: a riposo 62, dopo l'invio 98 — il Megafono 150 invece di 114.
     Sul computer il campo è largo 835 e il segnaposto ci sta in una riga:
     stesso errore, ma non si vedeva.
     ⭐ La cura: a campo vuoto l'altezza non la scrive nessuno. Si toglie
        lo stile e comanda il foglio — min-height 2.9rem, rows="1" — che è
        esattamente la forma a riposo. Così non conta più né quanto è largo
        il campo quando si misura, né quanto è lungo il segnaposto.
     ⚠️ Vale anche per chi cancella tutto a mano: stessa strada, stesso
        punto. */
  function cresci(){
    if(!campo.value){ campo.style.height=""; return; }
    campo.style.height="auto"; campo.style.height=campo.scrollHeight+"px";
  }

  /* ⭐ TOCCATO NEL GUSCIO ㊶ — IL MEGAFONO NUOVO. La forma è quella del
     modello di Gab (megafono-innesto.html · 082a37465a0ef33eb3ed9b9c39df1c30);
     i gesti sono quelli di sempre: l'insert su `orme`, le righe «proposto»
     su `orma_persone`. I dati finti del modello qui sono le tavole vere:
     `territori` per i comuni, `orma_persone` per i nomi già usati. */
  /* ⭐ i cinque tipi del modello del 10 settembre (082a37465a0ef33eb3ed9b9c39df1c30):
     karma yoga per primo, ed è lui il difetto. `n` è quello che si legge,
     `d` quello che si scrive nella tavola. Il segno di karma yoga è il
     Nexus della legenda — due cerchi e l'esagono col raggio — preso tale
     e quale dal modello, non ridisegnato. */
  var MG_TIPI = [
    {n:"karma yoga", d:"karma_yoga", c:"var(--nexus)", f:"nex"},
    {n:"obiettivo",  d:"obiettivo",  c:"var(--fuoco)", f:"rombo"},
    {n:"contatto",   d:"contatto",   c:"var(--oro)",   f:"cerchio"},
    {n:"spesa",      d:"spesa",      c:"var(--acqua)", f:"quadro"},
    {n:"racconto",   d:"racconto",   c:"var(--aria)",  f:"tondo"}
  ];
  var MG_NEX = '<svg class="nx" viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.9"><circle cx="20" cy="20" r="14"></circle><circle cx="20" cy="20" r="11.2"></circle><path d="M20 12.5 L26 15.7 L26 24.3 L20 27.5 L14 24.3 L14 15.7 Z"></path><path d="M20 12.5 L20 20 M20 20 L26 15.7 M20 20 L14 15.7 M20 20 L20 27.5"></path></svg>';
  var mgStato = {tipo:"karma yoga", quando:null, dove:null, persone:[], file:[]};
  var mgPan = $("mg-pan"), mgTipo = $("mg-tipo"), mgInv = $("mg-inv"),
      mgNato = $("mg-nato");

  function mgChiudi(){
    if(!mgPan) return;
    mgPan.classList.remove("si"); mgPan.innerHTML=""; mgPan.dataset.q="";
  }
  function mgApri(q){
    mgPan.innerHTML=""; mgPan.classList.add("si"); mgPan.dataset.q=q;
  }
  function mgEtichetta(t){
    var e=document.createElement("div"); e.className="et2"; e.textContent=t;
    mgPan.appendChild(e); return e;
  }

  function mgAggiorna(){
    if(mgInv) mgInv.classList.toggle("pronto", campo.value.trim().length>0);
    var tt = MG_TIPI.filter(function(x){ return x.n===mgStato.tipo; })[0];
    if(mgTipo){
      mgTipo.textContent = mgStato.tipo;
      mgTipo.style.setProperty("--c", tt ? tt.c : "var(--oro)");
    }
    var g = document.querySelectorAll("#mg .mg-vsg");
    if(g.length === 3){
      g[0].classList.toggle("on", !!mgStato.quando);
      g[1].classList.toggle("on", !!mgStato.dove);
      g[2].classList.toggle("on", mgStato.persone.length>0);
      g[0].title = mgStato.quando ? inItaliano(mgStato.quando) : "oggi";
      g[1].title = mgStato.dove ? mgStato.dove.nome : "dove";
      g[2].title = mgStato.persone.length
        ? mgStato.persone.map(function(x){ return x.nome; }).join(", ")
        : "con chi";
    }
    var gf = $("mg-gf");
    if(gf){
      gf.classList.toggle("on", mgStato.file.length > 0);
      gf.title = mgStato.file.length
        ? mgStato.file.map(function(f){ return f.name; }).join(", ")
        : "Allegato";
    }
  }
  campo.addEventListener("input", function(){ cresci(); mgAggiorna(); });

  /* il cartiglio verde — per gli errori resta parla() */
  var mgNatoTempo = null;
  function mgAvvisa(t){
    if(!mgNato){ parla(t); return; }
    mgNato.textContent = t; mgNato.classList.add("si");
    clearTimeout(mgNatoTempo);
    mgNatoTempo = setTimeout(function(){ mgNato.classList.remove("si"); }, 2600);
  }

  /* il tondino: che cosa è. ⛔ Niente tasto «+». */
  if(mgTipo) mgTipo.addEventListener("click", function(e){
    e.stopPropagation();
    if(mgPan.dataset.q === "tipo") return mgChiudi();
    mgApri("tipo");
    mgEtichetta("che cosa \u00e8");
    var due=document.createElement("div"); due.className="due2";
    MG_TIPI.forEach(function(t){
      var b=document.createElement("button"); b.type="button";
      b.className="tb "+t.f+(t.n===mgStato.tipo?" on":"");
      b.style.setProperty("--c", t.c);
      var i=document.createElement("i");
      if(t.f==="nex") i.innerHTML = MG_NEX;   /* il Nexus della legenda, tale e quale */
      b.appendChild(i);
      b.appendChild(document.createTextNode(t.n));
      b.addEventListener("click", function(){
        mgStato.tipo = t.n; mgChiudi(); mgAggiorna();
      });
      due.appendChild(b);
    });
    mgPan.appendChild(due);
  });

  /* quando: il calendarietto del mese */
  function mgQuando(){
    if(mgPan.dataset.q === "quando") return mgChiudi();
    mgApri("quando");
    var o=new Date(), a=o.getFullYear(), m=o.getMonth();
    var primo=new Date(a,m,1).getDay()||7, ultimo=new Date(a,m+1,0).getDate();
    mgEtichetta(MESI_BREVI[m]+" "+a);
    var g=document.createElement("div"); g.className="gg2";
    ["lun","mar","mer","gio","ven","sab","dom"].forEach(function(x){
      var b=document.createElement("b"); b.textContent=x; g.appendChild(b);
    });
    for(var k=1;k<primo;k++) g.appendChild(document.createElement("span"));
    for(var d=1;d<=ultimo;d++)(function(d){
      var s=document.createElement("span"); s.textContent=d;
      if(d===o.getDate()) s.className="oggi";
      s.addEventListener("click", function(){
        mgStato.quando = a+"-"+String(m+1).padStart(2,"0")+"-"+String(d).padStart(2,"0");
        mgChiudi(); mgAggiorna();
      });
      g.appendChild(s);
    })(d);
    mgPan.appendChild(g);
  }

  /* dove: i comuni, dalla tavola `territori` — la strada di cercaComune */
  function mgDove(){
    if(mgPan.dataset.q === "dove") return mgChiudi();
    mgApri("dove");
    mgEtichetta("dove");
    var q=document.createElement("input");
    q.className="campoP"; q.placeholder="scrivi un comune";
    q.autocomplete="off";
    mgPan.appendChild(q);
    var lista=document.createElement("div"); mgPan.appendChild(lista);
    var attesa=null;
    q.addEventListener("input", function(){
      clearTimeout(attesa);
      var v=q.value.trim();
      lista.innerHTML="";
      if(v.length<2) return;
      attesa=setTimeout(function(){
        db.from("territori").select("codice,nome")
          .ilike("nome", v+"%").order("nome").limit(8)
          .then(function(r){
            lista.innerHTML="";
            ((r&&r.data)||[]).forEach(function(t){
              var b=document.createElement("button"); b.type="button";
              b.textContent=t.nome;
              b.addEventListener("click", function(){
                mgStato.dove={codice:t.codice, nome:t.nome};
                mgChiudi(); mgAggiorna();
              });
              lista.appendChild(b);
            });
          }).catch(function(){ lista.innerHTML=""; });
      }, 220);
    });
    setTimeout(function(){ q.focus(); }, 60);
  }

  /* con chi: i nomi già usati in `orma_persone`; se non c'è, «+ nome · nuovo» */
  function mgChi(){
    if(mgPan.dataset.q === "chi") return mgChiudi();
    mgApri("chi");
    mgEtichetta("con chi"+(mgStato.persone.length
      ? " \u00b7 "+mgStato.persone.map(function(x){ return x.nome; }).join(", ") : ""));
    var q=document.createElement("input");
    q.className="campoP"; q.placeholder="scrivi un nome";
    q.autocomplete="off";
    mgPan.appendChild(q);
    var lista=document.createElement("div"); mgPan.appendChild(lista);
    function giaPreso(n){
      return mgStato.persone.some(function(x){ return x.nome===n; });
    }
    var attesa=null;
    q.addEventListener("input", function(){
      clearTimeout(attesa);
      var v=q.value.trim();
      lista.innerHTML="";
      if(!v) return;
      attesa=setTimeout(function(){
        db.from("orma_persone").select("nome,persona_id")
          .ilike("nome", v+"%").limit(20)
          .then(function(r){
            lista.innerHTML="";
            var visti={}, righe=[];
            ((r&&r.data)||[]).forEach(function(x){
              if(visti[x.nome] || giaPreso(x.nome)) return;
              visti[x.nome]=1; righe.push(x);
            });
            righe.slice(0,6).forEach(function(x){
              var b=document.createElement("button"); b.type="button";
              b.textContent=x.nome;
              b.addEventListener("click", function(){
                mgStato.persone.push({nome:x.nome, persona_id:x.persona_id||null});
                mgChiudi(); mgAggiorna();
              });
              lista.appendChild(b);
            });
            var n=q.value.trim();
            if(n && !giaPreso(n)){
              var b2=document.createElement("button"); b2.type="button";
              b2.appendChild(document.createTextNode("+ "+n+"  "));
              var i2=document.createElement("i");
              i2.style.cssText="color:rgba(245,240,230,.35);font-style:normal";
              i2.textContent="nuovo";
              b2.appendChild(i2);
              b2.addEventListener("click", function(){
                mgStato.persone.push({nome:n, persona_id:null});
                mgChiudi(); mgAggiorna();
              });
              lista.appendChild(b2);
            }
          }).catch(function(){ lista.innerHTML=""; });
      }, 220);
    });
    setTimeout(function(){ q.focus(); }, 60);
  }

  document.querySelectorAll("#mg .mg-vsg").forEach(function(b){
    b.addEventListener("click", function(e){
      e.stopPropagation();
      if(b.dataset.p==="quando") mgQuando();
      else if(b.dataset.p==="dove") mgDove();
      else mgChi();
    });
  });

  /* il tocco fuori chiude quello che è aperto */
  document.addEventListener("click", function(e){
    if(mgPan && mgPan.classList.contains("si") && !mgPan.contains(e.target)) mgChiudi();
  });

  /* ⭐ TOCCATO NEL GUSCIO ㊶ — LA GRAFFA È CUCITA ALLA CATENA DEGLI
     ALLEGATI (le parole di Gab, 10 settembre 2026). Il contenitore è
     `riservato`, il percorso è `<orma_id>/<nome del file>` — quindi il
     file scelto qui ASPETTA: sale solo quando l'orma è nata e ha un id.
     La riga in `orma_file` si scrive con `da_conversazione:false` —
     ⛔ solo false: il vero lo scrive il trigger della conversazione.
     ⛔ il `tipo` non si manda: lo calcola il database con fm_famiglia_file().
     I tre tetti (25 MB a file · 10 per orma · 500 MB a persona) li fa
     rispettare il database: qui si traducono solo gli errori in parole. */
  var MG_FILE_TETTO = 25 * 1024 * 1024;
  function mgParoleFile(messaggio){
    var m = String(messaggio || "");
    if(/payload too large|too large|exceeded.*size|maximum.*size|25/i.test(m))
      return "il file supera i 25 MB";
    if(/10|dieci/i.test(m))
      return "questa orma ha già dieci allegati";
    if(/500/i.test(m))
      return "hai finito lo spazio: i tuoi file occupano già 500 MB";
    return "l'allegato non è passato";
  }
  if($("mg-gf")) $("mg-gf").addEventListener("click", function(){
    var i = $("mg-file"); if(i) i.click();
  });
  if($("mg-file")) $("mg-file").addEventListener("change", function(){
    var scelti = [].slice.call(this.files || []);
    this.value = "";
    if(!scelti.length) return;
    for(var k = 0; k < scelti.length; k++){
      if(scelti[k].size > MG_FILE_TETTO){
        parla("il file supera i 25 MB · " + scelti[k].name);
        return;
      }
    }
    if(mgStato.file.length + scelti.length > 10){
      parla("questa orma ha già dieci allegati");
      return;
    }
    mgStato.file = mgStato.file.concat(scelti);
    mgAggiorna();
    mgAvvisa("📎  " + mgStato.file.map(function(f){ return f.name; }).join("  ·  "));
  });

  mgAggiorna();

  function parla(t){
    var p=$("parola"); $("parola-tx").textContent=t;
    p.classList.add("su"); setTimeout(function(){ p.classList.remove("su"); },3400);
  }

  function bollo(o){
    if(o.el==="nexus") return '<img src="'+NEXUS_IMG+'" alt="">';
    return o.el ? sg(o.el) : "";
  }

  /* ⭐ TOCCATO NEL GUSCIO ㉓ — il gestore di «Dove lo porti» se ne va col
     suo tasto. Restando, $("s-dove") sarebbe null e la riga solleverebbe
     prima ancora che il Megafono si apra. */

  /* ── il luogo dell'orma ── */
  var luoghi = [], luogoScelto = null;

  /* ⭐ TOCCATO NEL GUSCIO ⑲ — `quandoScelto` non era dichiarato da nessuna
     parte, e il tasto che manda lo leggeva. Su un nome che non esiste si
     solleva: la riga si rompeva PRIMA dell'insert, e l'orma non partiva.
     Non è una cosa di oggi — è così anche nella copia in linea.
     ⚠️ «Quando» resta una forma senza gesto: né #s-quando né #q-ok hanno
        un ascolto, e nessuno scrive qui dentro. Finché non ne ha uno,
        `accaduto_il` è oggi — che è quello che deve essere. */
  var quandoScelto = null;

  function disegnaLuoghi(){
    var box = $("l-luoghi"); if(!box) return;
    box.innerHTML = "";

    var mio = document.createElement("button");
    mio.className = "rigo";
    mio.style.setProperty("--vc","var(--oro-ch)");
    mio.style.setProperty("--vf","var(--nexus-f)");
    mio.innerHTML = '<span class="bollo"></span><span class="tx">Dove sono io'
                  + '<small>il tuo vicinato — è quello che prende in automatico</small></span>';
    mio.addEventListener("click", function(){
      luogoScelto = null;
      $("s-luogo-v").textContent = "Dove sono io";
      $("v-luogo").classList.remove("on");
    });
    box.appendChild(mio);

    luoghi.slice().sort(function(a,b){
      return (a.nome||"").localeCompare(b.nome||"");
    }).forEach(function(v){
      var b = document.createElement("button");
      b.className = "rigo";
      b.style.setProperty("--vc","var(--terra)");
      b.style.setProperty("--vf","var(--terra-f)");
      b.innerHTML = '<span class="bollo"></span><span class="tx"></span>';
      var tx = b.querySelector(".tx");
      tx.appendChild(document.createTextNode(v.nome));
      if(v.territorio){
        var sm=document.createElement("small"); sm.textContent=v.territorio; tx.appendChild(sm);
      }
      b.addEventListener("click", function(){ scegliLuogo(v); });
      box.appendChild(b);
    });
  }

  db.from("vicinati").select("id,nome,territorio,lat,lon").order("nome")
    .then(function(r){ luoghi = (r.data)||[]; disegnaLuoghi(); });


  /* ── un luogo nuovo: lo può far nascere chiunque ──
     Il vicinato no: quello lo apre chi fa praticantato.                        */
  function scegliLuogo(v){
    luogoScelto = v;
    $("s-luogo-v").textContent = v.nome;
    $("v-luogo").classList.remove("on");
  }

  $("nl-crea").addEventListener("click", function(){
    if(ospite){ chiediAccesso("Per far nascere un luogo serve l'accesso"); return; }
    var nome = $("nl-nome").value.trim();
    if(!nome){ return; }
    var terr = $("nl-terr").value.trim();
    var b = this;
    b.disabled = true; b.textContent = "Un momento…";

    /* ⭐ Il nome viene dalla mappa, non da chi scrive.
       Così «quartu», «Quartu S. Elena» e «QUARTU SANT ELENA» diventano
       tutti lo stesso luogo, col nome ufficiale e senza refusi.          */
    function cercaSullaCarta(){
      var q = encodeURIComponent(nome + (terr ? ", " + terr : "") + ", Italia");
      return fetch("https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1"
                   + "&addressdetails=1&accept-language=it&q=" + q,
                   {headers:{"Accept":"application/json"}})
        .then(function(r){ return r.json(); })
        .then(function(d){
          if(!d || !d.length) return null;
          var t = d[0], a = t.address || {};
          /* il nome ufficiale del posto */
          var uff = a.village || a.town || a.city || a.hamlet
                  || a.municipality || a.suburb || t.name || nome;
          /* il territorio: il comune, e la provincia se c'è */
          var com = a.city || a.town || a.village || a.municipality || "";
          var pro = a.county || a.state_district || "";
          var territorio = com && com !== uff
            ? com + (pro ? " (" + pro + ")" : "")
            : (pro || null);
          return {
            nome: uff,
            territorio: territorio,
            lat: parseFloat(t.lat),
            lon: parseFloat(t.lon)
          };
        })
        .catch(function(){ return null; });
    }

    cercaSullaCarta().then(function(co){
      /* il nome ufficiale se la carta lo conosce, altrimenti quello scritto */
      var nomeVero = co ? co.nome : nome;
      var terrVero = co ? (co.territorio || terr || null) : (terr || null);

      /* con quel nome, esiste già? allora si sceglie quello */
      return db.from("vicinati").select("id,nome,territorio,lat,lon")
        .ilike("nome", nomeVero).maybeSingle()
        .then(function(g){
          if(g && g.data){
            scegliLuogo(g.data);
            $("nl-nome").value = ""; $("nl-terr").value = "";
            $("nl-esito").innerHTML =
              '<p style="color:rgba(245,240,230,0.82);font-family:\'Cormorant Garamond\',serif;'
              + 'font-style:italic">Questo luogo c\'era gi&agrave;: &egrave; '
              + esc(g.data.nome) + '.</p>';
            return null;
          }
          var riga = { nome: nomeVero, territorio: terrVero, stato: "proposto" };
          if(co){ riga.lat = co.lat; riga.lon = co.lon; }
          return db.from("vicinati")
            .insert(riga)
            .select("id,nome,territorio,lat,lon").single()
          .then(function(r){
            if(r.error){
              $("nl-esito").innerHTML =
                '<p style="color:#f0b0a6">Non &egrave; nato: ' + r.error.message + '</p>';
              return null;
            }
            luoghi.push(r.data);
            scegliLuogo(r.data);
            $("nl-nome").value = ""; $("nl-terr").value = "";
            $("nl-esito").innerHTML = co
              ? ""
              : '<p style="color:rgba(245,240,230,0.8);font-family:\'Cormorant Garamond\',serif;'
                + 'font-style:italic">Il luogo &egrave; nato. Non sono riuscito a trovarlo sulla carta: '
                + 'comparir&agrave; sulla mappa quando qualcuno ne segna la posizione.</p>';
            disegnaLuoghi();
            return null;
          });
        });
      })
      .catch(function(e){
        $("nl-esito").innerHTML = '<p style="color:#f0b0a6">' + (e.message||e) + '</p>';
      })
      .then(function(){ b.disabled = false; b.textContent = "Fai nascere il luogo"; });
  });

  /* ══════════════════════════════════════════════════════════════
     ⭐ TOCCATO NEL GUSCIO ㉒ — I TRE DATI DELL'ORMA
     quando · dove · con chi. Tre parole sotto i segni che portano già
     dentro la loro risposta. Ognuna apre il suo foglio.
     ══════════════════════════════════════════════════════════════ */

  var luogoDato = null;      /* {nome, lat, lon, cod} */
  var conChi    = [];        /* [{nome, persona_id}] */

  var MESI_BREVI = ["gennaio","febbraio","marzo","aprile","maggio","giugno",
                    "luglio","agosto","settembre","ottobre","novembre","dicembre"];
  function inItaliano(iso){
    var d = new Date(iso + "T12:00:00");
    return d.getDate() + " " + MESI_BREVI[d.getMonth()];
  }
  function dataDiOggi(){
    var d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,"0")
                           + "-" + String(d.getDate()).padStart(2,"0");
  }

  /* le tre parole dicono quello che c'è, non quello che si può scegliere */
  function aggiornaTreDati(){
    var q = $("d-quando");
    if(q){
      q.textContent = quandoScelto ? inItaliano(quandoScelto) : "oggi";
      q.classList.toggle("scelta", !!quandoScelto);
      q.classList.remove("vuota");
    }
    var d = $("d-dove");
    if(d){
      d.textContent = luogoDato && luogoDato.nome ? luogoDato.nome : "[ dove ]";
      d.classList.toggle("scelta", !!(luogoDato && luogoDato.nome));
      d.classList.toggle("vuota", !(luogoDato && luogoDato.nome));
    }
    var c = $("d-chi");
    if(c){
      c.textContent = !conChi.length ? "[ con chi ]"
        : conChi.length === 1 ? conChi[0].nome
        : conChi.length + " persone";
      c.classList.toggle("scelta", conChi.length > 0);
      c.classList.toggle("vuota", conChi.length === 0);
    }
    aggiornaAttesa();
  }

  /* ⛔ LA REGOLA DEL CANONE, quella di le-regole.html e della 4g:
     un'orma che nomina un'altra persona resta privata finché quella persona
     non conferma. Finché una riga di `orma_persone` non è «confermato», la
     visibilità non può essere né «tutti» né «il mio vicinato».
     Alla nascita ogni riga è «proposto», quindi basta un nome. */
  function chiAspetta(){
    return conChi.filter(function(x){ return x.stato !== "confermato"; });
  }
  function frasePerChiAspetta(chi){
    if(chi.length === 1) return "Aspetta che " + chi[0].nome + " confermi.";
    if(chi.length === 2) return "Aspetta che " + chi[0].nome + " e " + chi[1].nome + " confermino.";
    return "Aspetta che " + chi[0].nome + " e altri " + (chi.length-1) + " confermino.";
  }
  function aggiornaAttesa(){
    var chi = chiAspetta(), chiusa = chi.length > 0;
    var r = $("mg-attesa");
    if(r){
      r.textContent = chiusa ? frasePerChiAspetta(chi) : "";
      r.hidden = !chiusa;
    }
    document.querySelectorAll(".v-t").forEach(function(x){
      var bloccato = chiusa && x.dataset.v !== "solo_me";
      x.classList.toggle("chiusa", bloccato);
      x.setAttribute("aria-disabled", bloccato ? "true" : "false");
    });
    /* e se una era già accesa, torna al difetto: privata */
    if(chiusa && visibilita !== "solo_me"){
      visibilita = "solo_me";
      document.querySelectorAll(".v-t").forEach(function(x){
        x.classList.toggle("on", x.dataset.v === "solo_me");
      });
    }
  }

  /* ── ① QUANDO ──
     `momento` è quando l'hai scritta e non si tocca. `accaduto_il` è quando
     è successo, ed è questa che si sposta. Il difetto resta oggi. */
  function apriQuando(){
    var i = $("q-data");
    if(i) i.value = quandoScelto || dataDiOggi();
    $("v-quando").classList.add("on");
  }
  if($("d-quando"))  $("d-quando").addEventListener("click", apriQuando);
  if($("s-quando"))  $("s-quando").addEventListener("click", apriQuando);
  if($("q-ok")) $("q-ok").addEventListener("click", function(){
    var v = ($("q-data")||{}).value || "";
    quandoScelto = v || null;
    var e = $("s-quando-v"); if(e) e.textContent = quandoScelto ? inItaliano(quandoScelto) : "Oggi";
    aggiornaTreDati();
    $("v-quando").classList.remove("on");
  });
  if($("q-oggi")) $("q-oggi").addEventListener("click", function(){
    quandoScelto = null;
    var e = $("s-quando-v"); if(e) e.textContent = "Oggi";
    aggiornaTreDati();
    $("v-quando").classList.remove("on");
  });

  /* ── ② DOVE ──
     ⛔ Non si chiede mai da solo: si chiede toccando «dove».
     ⚠️ Un no vale per sempre: non si richiede più, e il nome si scrive
        a mano lo stesso. */
  var NO_AL_PUNTO = "fm_luogo_no";
  function puntoNegato(){
    try{ return localStorage.getItem(NO_AL_PUNTO) === "1"; }catch(e){ return false; }
  }
  function segnaIlNo(){ try{ localStorage.setItem(NO_AL_PUNTO,"1"); }catch(e){} }

  function apriDove(){
    if(!luogoDato) luogoDato = {nome:"", lat:null, lon:null, cod:null};
    var n = $("dv-nome"); if(n) n.value = luogoDato.nome || "";
    var t = $("dv-terr"); if(t) t.textContent = luogoDato.cod ? ("comune: " + luogoDato.cod) : "";
    var e = $("dv-esito");
    if(e) e.textContent = puntoNegato()
      ? "Il punto non si chiede più: hai già detto di no. Il nome si scrive lo stesso."
      : (luogoDato.lat != null ? "punto preso" : "");
    var b = $("dv-punto"); if(b) b.hidden = puntoNegato();
    $("v-dove").classList.add("on");
  }
  if($("d-dove")) $("d-dove").addEventListener("click", apriDove);

  if($("dv-punto")) $("dv-punto").addEventListener("click", function(){
    var e = $("dv-esito");
    if(!navigator.geolocation){ if(e) e.textContent = "Questo navigatore non sa dire dove sei."; return; }
    if(e) e.textContent = "sto guardando…";
    navigator.geolocation.getCurrentPosition(function(pos){
      luogoDato.lat = pos.coords.latitude;
      luogoDato.lon = pos.coords.longitude;
      if(e) e.textContent = "punto preso";
      cercaIlComune(luogoDato.lat, luogoDato.lon);
    }, function(err){
      if(err && err.code === 1){ segnaIlNo(); var b=$("dv-punto"); if(b) b.hidden = true;
        if(e) e.textContent = "Va bene. Il punto non te lo chiedo più: scrivi il nome."; return; }
      if(e) e.textContent = "Il punto non è arrivato. Il nome si scrive lo stesso.";
    }, {enableHighAccuracy:false, timeout:10000, maximumAge:600000});
  });

  /* dal punto al comune, e dal comune al codice: `territori` ha i 7.896 comuni */
  function cercaIlComune(lat, lon){
    var t = $("dv-terr"); if(t) t.textContent = "cerco il comune…";
    fetch("https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=10&lat="+lat+"&lon="+lon,
          {headers:{"Accept":"application/json"}})
      .then(function(r){ return r.json(); })
      .then(function(d){
        var a = (d && d.address) || {};
        var nome = a.city || a.town || a.village || a.municipality || a.county || "";
        if(!nome){ if(t) t.textContent = ""; return; }
        var n = $("dv-nome"); if(n && !n.value) { n.value = nome; luogoDato.nome = nome; }
        return db.from("territori").select("codice,nome").ilike("nome", nome).limit(1)
          .then(function(r2){
            var riga = (r2 && r2.data && r2.data[0]) || null;
            luogoDato.cod = riga ? riga.codice : null;
            if(t) t.textContent = riga ? ("comune: " + riga.nome + " · " + riga.codice)
                                       : ("«" + nome + "» non è fra i comuni: resta il nome e il punto");
          });
      })
      .catch(function(){ if(t) t.textContent = "Il comune non è arrivato. Il nome e il punto restano."; });
  }

  if($("dv-ok")) $("dv-ok").addEventListener("click", function(){
    luogoDato.nome = (($("dv-nome")||{}).value || "").trim();
    if(!luogoDato.nome && luogoDato.lat == null) luogoDato = null;
    aggiornaTreDati();
    $("v-dove").classList.remove("on");
  });
  if($("dv-via")) $("dv-via").addEventListener("click", function(){
    luogoDato = null; aggiornaTreDati(); $("v-dove").classList.remove("on");
  });

  /* ── ③ CON CHI ── */
  function disegnaConChi(){
    var box = $("cc-lista"); if(!box) return;
    box.innerHTML = "";
    conChi.forEach(function(x, i){
      var r = document.createElement("div"); r.className = "cc-riga";
      var b = document.createElement("b"); b.textContent = x.nome;
      var e = document.createElement("i");
      e.textContent = x.persona_id ? "ha un conto qui" : "non ancora fra noi";
      var v = document.createElement("button");
      v.type = "button"; v.className = "cc-via"; v.textContent = "\u00d7";
      v.setAttribute("aria-label", "Togli " + x.nome);
      v.addEventListener("click", function(){ conChi.splice(i,1); disegnaConChi(); aggiornaTreDati(); });
      r.appendChild(b); r.appendChild(e); r.appendChild(v);
      box.appendChild(r);
    });
    aggiornaTreDati();
  }
  if($("d-chi")) $("d-chi").addEventListener("click", function(){
    disegnaConChi(); $("v-conchi").classList.add("on");
  });
  if($("cc-nome")) $("cc-nome").addEventListener("input", function(){
    var q = this.value.trim(), box = $("cc-trovati"); if(!box) return;
    box.innerHTML = "";
    if(q.length < 2) return;
    db.from("persone_pubbliche").select("id,nome").ilike("nome","%"+q+"%").limit(5)
      .then(function(r){
        ((r && r.data) || []).forEach(function(pp){
          var b = document.createElement("button");
          b.type = "button"; b.className = "mini"; b.style.marginRight = "0.35rem";
          b.textContent = pp.nome;
          b.addEventListener("click", function(){
            conChi.push({nome:pp.nome, persona_id:pp.id});
            $("cc-nome").value = ""; box.innerHTML = ""; disegnaConChi();
          });
          box.appendChild(b);
        });
      }).catch(function(){});
  });
  if($("cc-agg")) $("cc-agg").addEventListener("click", function(){
    var q = (($("cc-nome")||{}).value || "").trim(); if(!q) return;
    conChi.push({nome:q, persona_id:null});
    $("cc-nome").value = ""; $("cc-trovati").innerHTML = ""; disegnaConChi();
  });

  /* i tre tasti della visibilità */
  var visibilita = "solo_me";
  document.querySelectorAll(".v-t").forEach(function(b){
    b.addEventListener("click", function(){
      /* ⛔ finché un nome aspetta, questi due non si accendono */
      if(b.classList.contains("chiusa")){
        var chi = chiAspetta();
        if(chi.length) parla(frasePerChiAspetta(chi));
        return;
      }
      visibilita = b.dataset.v;
      document.querySelectorAll(".v-t").forEach(function(x){
        x.classList.toggle("on", x===b);
      });
      campo.focus();
    });
  });
  aggiornaTreDati();

  /* l'invito: parte dall'ultima orma scritta */
  var ultimaOrma = null;

  /* ⭐ TOCCATO NEL GUSCIO ㊶ — LA FRECCIA DEL MEGAFONO NUOVO.
     ⛔ L'orma nasce `solo_me` e senza `destinazione`: quando detti stai
        catturando, non organizzando (Gab, 10 settembre 2026). La
        visibilità si decide dopo, quando l'orma si apre e si collega —
        e così la regola del canone è servita alla radice: un'orma che
        nomina qualcuno nasce comunque privata.
     ⭐ `talento_id` e `filo_id` restano vuoti: è il segno che la manda
        in «Da collegare» — fm-orma-mia.js li guarda, non serve altro.
     ⭐ il dove è un comune di `territori`: scrive `territorio_cod`, e il
        nome del comune in `luogo` perché le schede lo mostrino. */
  $("mg-inv").addEventListener("click", function(){
    var t=campo.value.trim();
    if(!t){ campo.focus(); return; }
    if(ospite){ chiediAccesso("Per lasciare un'orma serve l'accesso"); return; }

    var tt = MG_TIPI.filter(function(x){ return x.n===mgStato.tipo; })[0];
    var riga = {persona_id:io.id, contenuto:t,
      tipo: tt ? tt.d : "karma_yoga",
      visibilita:"solo_me",
      accaduto_il: mgStato.quando || dataDiOggi()};
    if(mgStato.dove){
      riga.territorio_cod = mgStato.dove.codice;
      riga.luogo = mgStato.dove.nome;
    }
    var nominati = mgStato.persone.slice();
    var alleg = mgStato.file.slice();
    var dettagli = [mgStato.tipo];
    if(mgStato.quando) dettagli.push(inItaliano(mgStato.quando));
    if(mgStato.dove) dettagli.push(mgStato.dove.nome);
    if(nominati.length) dettagli.push("con "+nominati.map(function(x){ return x.nome; }).join(", "));
    if(alleg.length) dettagli.push(alleg.length === 1 ? "un allegato" : alleg.length + " allegati");

    db.from("orme").insert(riga)
      .select("id,contenuto").single().then(function(r){
      if(r.error){ parla("Non è stata conservata: "+r.error.message); return; }
      ultimaOrma = r.data;

      /* le persone nominate: una riga a testa, stato «proposto».
         ⛔ Il legame si propone, non si impone: diventa «confermato» solo
            per mano di chi è stato nominato.
         ⚠️ Senza persona_id la riga vale lo stesso: il nome da solo basta, e
            diventerà un collegamento vero il giorno che quella persona entra. */
      if(nominati.length && r.data && r.data.id){
        db.from("orma_persone").insert(nominati.map(function(x){
          return {orma_id:r.data.id, persona_id:x.persona_id || null,
                  nome:x.nome, stato:"proposto"};
        })).then(function(q){
          if(q && q.error) parla("L'orma c'è, i nomi no: " + q.error.message);
        }).catch(function(){});
      }

      /* ── gli allegati: prima il file in `riservato` al percorso
         `<orma_id>/<nome>`, poi la riga in `orma_file`. In fila, uno
         dopo l'altro; se uno non passa, si dice in parole e si va
         avanti col prossimo. ── */
      if(alleg.length && r.data && r.data.id){
        var ormaId = r.data.id;
        alleg.reduce(function(fila, f){
          return fila.then(function(){
            return db.storage.from("riservato")
              .upload(ormaId + "/" + f.name, f)
              .then(function(u){
                if(u && u.error){
                  parla("L'orma c'è, l'allegato no: " + mgParoleFile(u.error.message));
                  return;
                }
                return db.from("orma_file").insert({
                  orma_id: ormaId, nome: f.name,
                  indirizzo: ormaId + "/" + f.name,
                  dimensione: f.size,
                  chi_lo_ha_messo: io.id,
                  da_conversazione: false
                }).then(function(q2){
                  if(q2 && q2.error) parla("L'orma c'è, l'allegato no: " + mgParoleFile(q2.error.message));
                });
              });
          }).catch(function(){});
        }, Promise.resolve());
      }

      campo.value=""; cresci();
      mgStato = {tipo:"karma yoga", quando:null, dove:null, persone:[], file:[]};
      mgChiudi(); mgAggiorna();
      mgAvvisa("\u2713  \u00e8 nata un\u2019orma  \u00b7  " + dettagli.join("  \u00b7  "));
      if(vista==="orme") caricaOrme(); else contaOrme();
    });
  });

  /* ⭐ TOCCATO NEL GUSCIO ㉕ — via il gestore della lente col suo tasto.
     Restando, $("s-cerca") sarebbe null e la riga solleverebbe all'avvio.
     ⚠️ `cerca` resta dichiarata e da qui in poi non può che essere false:
        l'invio la guarda ancora (`if(cerca) vai("incontro")`) e quel ramo
        semplicemente non si prende più. */

  /* i fogli */
  function rigo(o, poi){
    var b=document.createElement("button");
    b.className="rigo"+(o.sg?" spenta":"");
    b.style.setProperty("--vc","var("+(o.c||"--oro-ch")+")");
    b.style.setProperty("--vf","var("+(o.f||"--nexus-f")+")");
    b.innerHTML='<span class="bollo"><span class="sg">'+(o.el?sg(o.el):"")+'</span></span>'
               +'<span class="tx"></span>';
    var tx=b.querySelector(".tx");
    tx.appendChild(document.createTextNode(o.n));
    if(o.s){ var s=document.createElement("small"); s.textContent=o.s; tx.appendChild(s); }
    if(o.sg){ var g=document.createElement("span"); g.className="sgl-i"; g.textContent=o.sg; b.appendChild(g); }
    else if(poi) b.addEventListener("click", function(){ poi(o); });
    return b;
  }

  ACCOUNT.forEach(function(o){
    $("l-acc").appendChild(rigo(o, function(x){
      if(x.n==="Esci"){
        try{ db.removeAllChannels(); }catch(e){}
        db.auth.signOut().then(function(){ location.replace("accesso.html"); });
        return;
      }
      $("v-acc").classList.remove("on");
      if(ospite){ vaiAdEntrare(""); return; }
      if(x.n==="Privacy e consensi"){ apriPrivacy();  return; }
      if(x.n==="Fatturazione")       { apriFatturazione(); return; }
      if(x.n==="Autorizzazioni")     { apriAutorizzazioni(); return; }
      if(x.n==="Notifiche")          { try{ FelicitasApp.notifiche(); }catch(e){} return; } /* la voce esiste solo dentro l'app */
      if(x.n==="Segnala")            { apriSegnala(); return; }
      if(x.n==="Colore del sito")    { apriColore(); return; }
      parla("[ " + x.n + " — questa voce aspetta ]");
    }));
  });
