/* ════════════════════════════════════════════════════════════════
   Comunità Eterna FelicitasMundi · L'ANNALE — la memoria, in ordine di tempo

   Il disegno è di Design: annale-spazio-vivo.html
   22.031 byte · MD5 551e6908961288ec699712c2a0304c90
   (a sua volta tradotto da Annale_FelicitasMundi_dc.html, MD5
   c747331ec45570fc07dc0753340c7154 — sciolti x-dc, helmet, sc-for,
   sc-if, i 49 punti {{ }} e DCLogic. support.js non serve più.)

   ⭐ Aggiornare l'Annale vuol dire sostituire questo file, e basta.

   ⚠️ La consegna è un PEZZO DA INCOLLARE, già senza testa, corpo e
      fondo proprio. Qui dentro entra intera: il foglio di stile, il
      corpo, il pannello, e il codice.

   ══ DOVE VIVE ══
   L'Annale non è più una voce della barra: è la SESTA FINESTRA DEL
   NUCLEO, accanto a economia, flussi, regole, lavagna e chat.
   Ci si arriva da lì, e il controllo d'ingresso è quello del nucleo:
   si legge `persone.nucleo`, e chi non ne fa parte non vede nascere
   nemmeno un nodo. Qui dentro non c'è nessun secondo controllo, ed è
   voluto: il disegno nasce solo dentro una finestra già sorvegliata.

   ══ LE TRE MANI SUL CODICE DI DESIGN, e sono tutte qui ══
   ① `window.FM_DB` → `db`. Nel guscio il collegamento a Supabase si
      chiama `db`; `FM_DB` era il nome che aveva nella pagina a sé.
   ② `window.scrollTo` → `scrollIntoView`. Nel guscio la finestra non
      scorre: scorre il contenitore.
   ③ il pannello di un contenuto passa da z-index 60 a 95, perché la
      finestra del nucleo che lo ospita sta a 80.
   Ogni mano è segnata sul posto col commento «⭐ TOCCATO».

   ⭐ LEGGE LE ORME VERE, dalla tavola `orme`, e le ordina per la data
      dell'ACCADUTO — non per quella in cui sono state scritte.
      Un record, due viste, mai copie.

   ⚠️ I QUADRANTI, GLI ANNI E LE LORO RIGHE sono scritti nel codice di
      Design. Non sono dati del database e qui non si toccano: quando
      arriveranno da una tavola, si sostituisce questo file.

   ⚠️ IL PANNELLO DI UN CONTENUTO VIVE SUL `body`, non dentro la
      finestra: è fisso a tutto schermo, e da dentro un contenitore che
      fa stacking context resterebbe prigioniero.

   ⛔ Niente involucro (function(){ … })() attorno al file: il guscio
      mette tutto in comune e questo file legge da lì. L'involucro di
      Design resta dov'è, dentro avviaAnnale().

   ════════════════════════════════════════════════════════════════ */

"use strict";

/* il foglio di stile, come consegnato — con la sola riga ③ */
var ANNALE_STILE = `<style>
  .sv-annale{--scala:1.4;
    --t-eti:calc(0.62rem * var(--scala));
    --t-pic:calc(0.70rem * var(--scala));
    --t-tas:calc(0.80rem * var(--scala));
    --t-cor:calc(0.95rem * var(--scala));
    --t-tit:calc(1.30rem * var(--scala));
    --oro-a:#D4AF6A; --bordo:rgba(212,175,106,0.30);
    max-width:70rem;margin:0 auto;padding:0 1.1rem 3rem;
    font-family:'DM Sans',system-ui,sans-serif;color:#F5F0E6}
  .sv-annale *{box-sizing:border-box}

  .sv-annale .occ{font-family:'Cinzel',serif;font-size:var(--t-eti);
    letter-spacing:0.22em;text-transform:uppercase;color:var(--oro-a)}
  .sv-annale h2.tt{font-family:'Cinzel',serif;font-weight:500;
    font-size:var(--t-tit);letter-spacing:0.06em;color:#F5F0E6;
    margin:0.6rem 0 0}
  .sv-annale .sot{font-family:'Cormorant Garamond',serif;
    font-size:var(--t-cor);line-height:1.62;color:rgba(245,240,230,0.78);
    margin:0.5rem 0 0;max-width:40rem}

  /* i quattro tasti dello storico */
  .sv-annale .nav{display:flex;gap:0.25rem;justify-content:center;
    flex-wrap:wrap;padding:0.7rem 0.4rem;margin-top:1.4rem;
    border-top:1px solid var(--bordo);border-bottom:1px solid var(--bordo)}
  .sv-annale .nav button{background:transparent;border:0;border-radius:999px;
    padding:0.35rem 0.9rem;cursor:pointer;font-family:'DM Sans',sans-serif;
    font-size:var(--t-pic);letter-spacing:0.18em;text-transform:uppercase;
    color:rgba(245,240,230,0.82);transition:.25s}
  .sv-annale .nav button:hover{color:#0A0C1A;background:var(--oro-a)}

  /* il leggio: sotto la fila, non incollato in fondo allo schermo */
  .sv-annale .leggio{margin:0.6rem auto 0;max-width:52rem;
    border:1px solid var(--bordo);border-radius:0.7rem;
    background:rgba(2,4,12,0.45);padding:0.6rem 1.1rem;text-align:center;
    font-size:var(--t-eti);letter-spacing:0.18em;text-transform:uppercase;
    color:rgba(245,240,230,0.82);transition:opacity .18s;min-height:2.1rem}

  .sv-annale .cap{display:flex;align-items:baseline;justify-content:space-between;
    gap:1.5rem;border-bottom:1px solid var(--bordo);padding-bottom:0.75rem;
    margin-top:2.6rem}
  .sv-annale .cap h3{font-family:'Cinzel',serif;font-weight:500;
    font-size:var(--t-pic);letter-spacing:0.24em;text-transform:uppercase;
    color:var(--oro-a);margin:0}
  .sv-annale .cap span{font-size:var(--t-eti);letter-spacing:0.2em;
    text-transform:uppercase;color:rgba(245,240,230,0.6);text-align:right}

  /* un anno */
  .sv-annale .anno{border-bottom:1px solid var(--bordo)}
  .sv-annale .anno > button{width:100%;background:none;border:0;
    padding:1.25rem 0.25rem;display:grid;
    grid-template-columns:auto 1fr auto;align-items:center;gap:1.5rem;
    cursor:pointer;text-align:left}
  .sv-annale .anno > button:hover{background:rgba(212,175,106,0.09)}
  .sv-annale .anno .nn{font-family:'Cinzel',serif;font-weight:500;
    font-size:calc(1.55rem * var(--scala));letter-spacing:0.08em;
    min-width:6.5rem}
  .sv-annale .anno .rg{font-size:var(--t-eti);letter-spacing:0.2em;
    text-transform:uppercase;color:rgba(245,240,230,0.66)}
  .sv-annale .anno .sg{font-size:var(--t-cor);line-height:1;color:var(--oro-a)}

  .sv-annale .dentro{display:none;padding:0 0.25rem 2.4rem}
  .sv-annale .anno.on .dentro{display:block}

  .sv-annale .salienti{border-left:3px solid rgba(212,175,106,0.6);
    background:rgba(2,4,12,0.5);border-radius:0.6rem;
    padding:1rem 1.3rem;margin-bottom:1.7rem}
  .sv-annale .salienti b{display:block;font-weight:400;font-size:var(--t-eti);
    letter-spacing:0.22em;text-transform:uppercase;color:var(--oro-a);
    margin-bottom:0.5rem}
  .sv-annale .salienti p{margin:0;font-family:'Cormorant Garamond',serif;
    font-size:var(--t-cor);line-height:1.62;font-style:italic;
    color:rgba(245,240,230,0.82);max-width:45rem}

  .sv-annale .mesi{display:grid;
    grid-template-columns:repeat(auto-fill,minmax(19rem,1fr));gap:0 2.5rem}
  .sv-annale .mese{display:grid;grid-template-columns:6.2rem 1fr;
    align-items:center;gap:1rem;padding:0.6rem 0;
    border-bottom:1px solid rgba(212,175,106,0.16)}
  .sv-annale .mese > .nm{font-size:var(--t-eti);letter-spacing:0.2em;
    text-transform:uppercase}
  .sv-annale .segnali{display:flex;flex-wrap:wrap;align-items:center;
    gap:0.45rem;min-height:1.25rem}
  .sv-annale .segnali button{height:1.15rem;min-width:1.15rem;padding:0 0.32rem;
    cursor:pointer;display:flex;align-items:center;justify-content:center;
    font-family:'DM Sans',sans-serif;font-size:calc(0.56rem * var(--scala));
    letter-spacing:0.08em;transition:transform .18s}
  .sv-annale .segnali button:hover{transform:translateY(-2px)}
  .sv-annale .vuoto{font-size:calc(0.58rem * var(--scala));letter-spacing:0.16em;
    text-transform:uppercase;color:rgba(245,240,230,0.42)}

  /* lo storico */
  .sv-annale .storico{margin-top:3rem}
  .sv-annale .storico > .occ{display:block;text-align:center;
    font-size:var(--t-pic);letter-spacing:0.24em;margin-bottom:1.3rem}
  .sv-annale .qd > button{display:flex;align-items:center;gap:0.9rem;
    width:100%;text-align:left;cursor:pointer;background:rgba(2,4,12,0.45);
    border:1px solid var(--bordo);border-radius:1rem;padding:1.15rem 1.3rem;
    margin-top:0.9rem;transition:border-color .2s}
  .sv-annale .qd > button:hover{border-color:var(--oro-a)}
  .sv-annale .qd .tx{flex:1;min-width:0}
  .sv-annale .qd .tx b{display:block;font-family:'Cinzel',serif;
    font-weight:500;font-size:var(--t-tas);color:#F5F0E6;letter-spacing:0.02em}
  .sv-annale .qd .tx i{display:block;font-family:'Cormorant Garamond',serif;
    font-style:italic;font-size:var(--t-tas);
    color:rgba(245,240,230,0.82);margin-top:0.2rem}
  .sv-annale .qd .fr{color:var(--oro-a);font-size:var(--t-tas);
    display:inline-block;transition:transform .3s}
  .sv-annale .qd.on .fr{transform:rotate(180deg)}
  .sv-annale .qd .corpo{max-height:0;overflow:hidden;transition:max-height .7s ease}
  .sv-annale .qd.on .corpo{max-height:60rem}
  .sv-annale .qd .corpo p{margin:0;max-width:45rem;padding:1rem 1.5rem 0.5rem;
    font-family:'Cormorant Garamond',serif;font-size:var(--t-cor);
    line-height:1.74;font-style:italic;color:rgba(245,240,230,0.82)}

  .sv-annale .pie{margin-top:3rem;padding-top:1.1rem;
    border-top:1px solid var(--bordo);display:flex;flex-wrap:wrap;
    gap:1rem 2.5rem;align-items:center;justify-content:space-between;
    font-size:var(--t-eti);letter-spacing:0.2em;text-transform:uppercase;
    color:rgba(245,240,230,0.58)}
  .sv-annale .pie .leg{display:flex;gap:1.4rem;flex-wrap:wrap;align-items:center}
  .sv-annale .pie .leg > span{display:flex;align-items:center;gap:0.5rem}

  /* il pannello di un contenuto */
  /* ⭐ TOCCATO — z-index da 60 a 95. Nella pagina a se il 60 bastava;
     qui l'Annale vive DENTRO la finestra del nucleo, che sta a 80. A 60
     il pannello di un contenuto sarebbe nato sotto la finestra che lo ha
     aperto. 95 sta sopra tutto quello che il guscio alza: il velo (90),
     la mappa a tutto schermo (90), la fascia della radio (92). */
  .sv-annale-fondo{position:fixed;inset:0;z-index:95;
    background:rgba(5,7,16,0.86);backdrop-filter:blur(8px);
    display:none;align-items:center;justify-content:center;padding:2.5rem 1.2rem}
  .sv-annale-fondo.on{display:flex}
  .sv-annale-fin{max-width:44rem;width:100%;max-height:82vh;overflow:auto;
    background:#0E1424;border:1px solid rgba(212,175,106,0.34);
    border-radius:1rem;box-shadow:0 14px 40px rgba(0,0,0,.4);
    padding:2.6rem 2.8rem 2.8rem;position:relative;
    font-family:'DM Sans',system-ui,sans-serif;color:#F5F0E6}
  .sv-annale-fin .chiudi{position:absolute;top:1rem;right:1.1rem;
    background:none;border:0;cursor:pointer;font-family:'DM Sans',sans-serif;
    font-size:0.68rem;letter-spacing:0.22em;text-transform:uppercase;
    color:rgba(245,240,230,0.72)}
  .sv-annale-fin .chiudi:hover{color:#D4AF6A}
  .sv-annale-fin .tp{font-family:'Cinzel',serif;font-size:0.7rem;
    letter-spacing:0.22em;text-transform:uppercase}
  .sv-annale-fin h3{font-family:'Cinzel',serif;font-weight:500;
    font-size:1.35rem;letter-spacing:0.04em;color:#F5F0E6;margin:0.9rem 0 0.4rem}
  .sv-annale-fin .att{font-size:0.65rem;letter-spacing:0.2em;
    text-transform:uppercase;color:rgba(245,240,230,0.66);margin-bottom:1.5rem}
  .sv-annale-fin .cp{margin:0 0 1.8rem;font-family:'Cormorant Garamond',serif;
    font-size:1.05rem;line-height:1.62;font-style:italic;
    color:rgba(245,240,230,0.82)}
  .sv-annale-fin .rif{border-top:1px solid rgba(212,175,106,0.34);
    padding-top:1rem;font-size:0.65rem;letter-spacing:0.18em;
    text-transform:uppercase;color:rgba(245,240,230,0.58)}
  .sv-annale-fin .rif code{text-transform:none;letter-spacing:0.06em;
    color:#D4AF6A;font-family:'DM Sans',sans-serif}

  @media (max-width:52rem){
    .sv-annale{--scala:1.15}
    .sv-annale .anno > button{gap:0.8rem;grid-template-columns:auto 1fr auto}
    .sv-annale .anno .nn{min-width:4.2rem;font-size:calc(1.2rem * var(--scala))}
    .sv-annale .anno .rg{display:none}
    .sv-annale .mese{grid-template-columns:5rem 1fr}
    .sv-annale-fin{padding:2.2rem 1.3rem 1.6rem}
  }
</style>`;

/* il corpo, come consegnato */
var ANNALE_CORPO = `<div class="sv-annale">

  <span class="occ">Comunità Eterna FelicitasMundi</span>
  <h2 class="tt">L&rsquo;Annale</h2>
  <p class="sot">La radice. Un contenuto vive una volta sola e da qui gli altri
     lo collegano: un record, due viste, mai copie.</p>

  <div class="nav" data-nav></div>
  <div class="leggio" data-leggio></div>

  <div class="cap">
    <h3>Gli anni</h3>
    <span>2026 &mdash; 2021 &middot; un anno alla volta</span>
  </div>
  <div data-anni></div>

  <div class="storico">
    <span class="occ">Lo storico</span>
    <div data-storico></div>
  </div>

  <div class="pie">
    <div class="leg">
      <span><span style="width:0.9rem;height:0.7rem;border:1px solid #5FC2F5;border-radius:2px;display:inline-block"></span>Articoli</span>
      <span><span style="width:0.7rem;height:0.7rem;background:#FF8A4C;border-radius:50%;display:inline-block"></span>Interviste &middot; audio</span>
      <span style="opacity:.6"><span style="width:0.62rem;height:0.62rem;border:1px solid #C08CFF;transform:rotate(45deg);display:inline-block"></span>Memoria &middot; in un secondo tempo</span>
    </div>
    <div>Ogni contenuto ha un indirizzo proprio</div>
  </div>

</div>`;

/* il pannello di un contenuto: vive sul body, non dentro la finestra */
var ANNALE_FONDO = `<div class="sv-annale-fondo" data-annale-fondo>
  <div class="sv-annale-fin" data-annale-fin></div>
</div>`;

/* ⭐ lo stile entra una volta sola. La finestra del nucleo si apre e si
   chiude quante volte si vuole, e il foglio non si accumula. */
function stileDellAnnale(){
  if(document.getElementById("sv-annale-stile")) return;
  var d = document.createElement("div");
  d.innerHTML = ANNALE_STILE;
  var st = d.firstElementChild;
  st.id = "sv-annale-stile";
  document.head.appendChild(st);
}

/* ⭐ il pannello sta sul body, e ce n'è uno solo per tutta la sessione */
function fondoDellAnnale(){
  if(document.querySelector("[data-annale-fondo]")) return;
  var d = document.createElement("div");
  d.innerHTML = ANNALE_FONDO;
  document.body.appendChild(d.firstElementChild);
}

/* ══ LA PORTA ══
   `c` è il contenitore in cui l'Annale nasce: nel nucleo è il dentro
   della sesta finestra. Chi chiama è già passato dal controllo. */
function annaleDentro(c){
  if(!c) return;
  stileDellAnnale();
  fondoDellAnnale();
  c.innerHTML = ANNALE_CORPO;
  avviaAnnale();
}

/* ── il codice della pagina, come l'ha scritto Design ──
   Nel disegno l'involucro gira da sé appena la pagina è letta; qui la
   pagina nasce dentro annaleDentro(), quindi lo si chiama lì. */
function avviaAnnale(){
(function () {
  "use strict";

  var MESI = ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno',
              'Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'];
  var ANNI = [2026, 2025, 2024, 2023, 2022, 2021];

  var RIGHE = {
    2026: 'Sviluppo degli ultimi mesi',
    2025: 'Aplomb · ROL · reti regionali',
    2024: 'Hare Krishna · Toscana, Sardegna',
    2023: 'Emilia-Romagna · Abruzzo',
    2022: 'Tour · interviste dal 2022',
    2021: 'Primi articoli'
  };

  /* Il colore vive nel contenuto: acqua, fuoco, etere. La struttura resta oro. */
  var TIPI = {
    articolo:  { sigla:'A', colore:'#5FC2F5', riempimento:'transparent', coloreSigla:'#5FC2F5', raggio:'2px', nome:'Articolo' },
    intervista:{ sigla:'',  colore:'#FF8A4C', riempimento:'#FF8A4C',     coloreSigla:'#0A0C1A', raggio:'50%', nome:'Intervista · audio' },
    memoria:   { sigla:'M', colore:'#C08CFF', riempimento:'transparent', coloreSigla:'#C08CFF', raggio:'2px', nome:'Memoria' },

    /* ── le orme, coi cinque colori del canone ── */
    racconto:      { sigla:'',  colore:'#669944', riempimento:'#669944', coloreSigla:'#0A0C1A', raggio:'50%', nome:'Un racconto' },
    testimonianza: { sigla:'T', colore:'#CC6644', riempimento:'transparent', coloreSigla:'#CC6644', raggio:'2px', nome:'Una testimonianza' },
    bisogno:       { sigla:'',  colore:'#AA8844', riempimento:'#AA8844', coloreSigla:'#0A0C1A', raggio:'50%', nome:'Un bisogno' },
    scambio_dono:  { sigla:'',  colore:'#4488BB', riempimento:'#4488BB', coloreSigla:'#0A0C1A', raggio:'50%', nome:'Uno scambio o un dono' },
    contatto:      { sigla:'C', colore:'#AA8844', riempimento:'transparent', coloreSigla:'#AA8844', raggio:'50%', nome:'Un contatto' },
    idea_nota:     { sigla:'N', colore:'#AA8844', riempimento:'transparent', coloreSigla:'#AA8844', raggio:'2px', nome:'Un\u2019idea o una nota' },
    obiettivo:     { sigla:'O', colore:'#AA8844', riempimento:'transparent', coloreSigla:'#AA8844', raggio:'2px', nome:'Un obiettivo' },
    spesa:         { sigla:'\u20AC', colore:'#AA8844', riempimento:'transparent', coloreSigla:'#AA8844', raggio:'2px', nome:'Una spesa' },
    registro_ore:  { sigla:'h', colore:'#AA8844', riempimento:'transparent', coloreSigla:'#AA8844', raggio:'2px', nome:'Ore di lavoro' },
    link:          { sigla:'L', colore:'#9966CC', riempimento:'transparent', coloreSigla:'#9966CC', raggio:'2px', nome:'Un link' },
    prodotto:      { sigla:'P', colore:'#4488BB', riempimento:'transparent', coloreSigla:'#4488BB', raggio:'2px', nome:'Un prodotto' },
    ricerca:       { sigla:'R', colore:'#9966CC', riempimento:'transparent', coloreSigla:'#9966CC', raggio:'2px', nome:'Una ricerca' },
    anthakarana:   { sigla:'',  colore:'#C8A055', riempimento:'#F5F0E6', coloreSigla:'#0A0C1A', raggio:'50%', nome:'Un passo sul filo' }
  };

  var QUADRANTI = [
    { id:'la-descrizione', tasto:'La descrizione', occhiello:'Lo sviluppo', titolo:'La descrizione', segnaposto:"[Che cos'è FelicitasMundi e come è nata — in attesa.]" },
    { id:'il-tour-2022',   tasto:'Il tour 2022',   occhiello:'2022',        titolo:'Il tour',        segnaposto:'[Il tour del 2022 — in attesa.]' },
    { id:'l-inizio',       tasto:"L'inizio",       occhiello:'Le origini',  titolo:"L'inizio",       segnaposto:'[L\u2019inizio — in attesa.]' },
    { id:'il-fondatore',   tasto:'Il fondatore',   occhiello:'Chi ha cominciato', titolo:'La bio del fondatore', segnaposto:'[La bio del fondatore — in attesa.]' }
  ];

  var ATTESA = "In attesa del CSV d'archivio · id, data, titolo, autore, tipo, tema, porta, url";

  var stato = { anno: 2026, quadrante: null };

  function q(s, dove) { return (dove || document).querySelector(s); }

  /* ── le orme vere, dallo stesso dato che legge la mappa ── */
  function leggiLeOrme(poi) {
    if (window.FM_ORME && window.FM_ORME.length) { poi(); return; }
    /* ⭐ TOCCATO — nel guscio il collegamento a Supabase si chiama `db`.
       `window.FM_DB` non esiste da nessuna parte: la consegna lo chiama
       col nome che aveva nella pagina a sé. Cambia il nome, non il gesto. */
    if (!window.db) { poi(); return; }
    db
      .from("orme")
      .select("id,contenuto,tipo,destinazione,momento,accaduto_il,vicinato_id")
      .order("momento", { ascending: false })
      .limit(2000)
      .then(function (r) {
        var righe = (r && r.data) || [];
        window.FM_ORME = righe.map(function (o) {
          /* ⭐ la data che conta è quella dell'accaduto */
          var d = new Date(o.accaduto_il ? o.accaduto_il + "T12:00:00" : o.momento);
          return {
            id: o.id,
            anno: d.getFullYear(),
            mese: d.getMonth(),
            tipo: o.tipo || "articolo",
            testo: o.contenuto || "",
            dove: o.destinazione || ""
          };
        });
        poi();
      })
      .catch(function () { poi(); });
  }

  function contenuti() {
    return (window.FM_ORME && window.FM_ORME.length) ? window.FM_ORME : [];
  }

  /* ── il leggio ── */
  function leggio(testo) {
    var l = q("[data-leggio]");
    if (!l) return;
    l.textContent = testo || ATTESA;
    l.style.opacity = testo ? 1 : 0.55;
  }

  /* ── il pannello di un contenuto ── */
  function apri(c) {
    var t = TIPI[c.tipo] || TIPI.articolo;
    var f = q("[data-annale-fin]");
    f.innerHTML =
      '<button class="chiudi" data-chiudi>Chiudi</button>' +
      '<div class="tp" style="color:' + t.colore + '"></div>' +
      '<h3></h3><div class="att"></div><p class="cp"></p>' +
      '<div class="rif">Riferimento &middot; <code></code></div>';
    q(".tp", f).textContent  = t.nome;
    q("h3", f).textContent   = "[titolo del contenuto]";
    q(".att", f).textContent = "[autore / operatore intervistato] — attribuzione obbligatoria";
    q(".cp", f).textContent  = c.tipo === "intervista"
      ? "[Qui il lettore audio dell'intervista, servita dal server della radio — non da Supabase.]"
      : "[Il testo del contenuto, dal record unico dell\u2019Annale.]";
    q("code", f).textContent = String(c.id);
    q("[data-chiudi]", f).addEventListener("click", chiudi);
    q("[data-annale-fondo]").classList.add("on");
  }

  function chiudi() {
    var s = q("[data-annale-fondo]");
    if (s) s.classList.remove("on");
  }

  /* ── il disegno ── */
  function disegna() {
    var tutti = contenuti();

    /* i quattro tasti */
    var nav = q("[data-nav]");
    nav.innerHTML = "";
    QUADRANTI.forEach(function (qd) {
      var b = document.createElement("button");
      b.textContent = qd.tasto;
      b.addEventListener("click", function () { vaiA(qd.id); });
      nav.appendChild(b);
    });

    /* gli anni */
    var box = q("[data-anni]");
    box.innerHTML = "";
    ANNI.forEach(function (anno) {
      var aperto = anno === stato.anno;
      var d = document.createElement("article");
      d.className = "anno" + (aperto ? " on" : "");

      var t = document.createElement("button");
      t.innerHTML =
        '<span class="nn"></span><span class="rg"></span><span class="sg"></span>';
      q(".nn", t).textContent = String(anno);
      q(".nn", t).style.color = aperto ? "#F5F0E6" : "rgba(245,240,230,0.7)";
      q(".rg", t).textContent = RIGHE[anno] || "";
      q(".sg", t).textContent = aperto ? "\u2212" : "+";
      t.addEventListener("click", function () {
        stato.anno = aperto ? null : anno;
        disegna();
      });
      d.appendChild(t);

      var dentro = document.createElement("div");
      dentro.className = "dentro";

      var sal = document.createElement("div");
      sal.className = "salienti";
      sal.innerHTML = "<b>Momenti salienti</b><p></p>";
      q("p", sal).textContent = "[I momenti salienti del " + anno + " — in attesa.]";
      dentro.appendChild(sal);

      var mesi = document.createElement("div");
      mesi.className = "mesi";
      MESI.forEach(function (nome, idx) {
        var segnali = tutti.filter(function (c) {
          return c.anno === anno && c.mese === idx;
        });
        var m = document.createElement("div");
        m.className = "mese";
        m.innerHTML = '<div class="nm"></div><div class="segnali"></div>';
        q(".nm", m).textContent = nome;
        q(".nm", m).style.color = segnali.length ? "#F5F0E6" : "rgba(245,240,230,0.45)";

        var riga = q(".segnali", m);
        segnali.forEach(function (c) {
          var tp = TIPI[c.tipo] || TIPI.articolo;
          var b = document.createElement("button");
          b.textContent = tp.sigla;
          b.style.cssText =
            "border:1px solid " + tp.colore + ";background:" + tp.riempimento +
            ";border-radius:" + tp.raggio + ";color:" + tp.coloreSigla;
          b.addEventListener("click", function () { apri(c); });
          b.addEventListener("mouseenter", function () {
            leggio(tp.nome + " · [titolo] · [autore] · " + c.id);
          });
          b.addEventListener("focus", function () {
            leggio(tp.nome + " · [titolo] · [autore] · " + c.id);
          });
          riga.appendChild(b);
        });
        if (!segnali.length) {
          var v = document.createElement("span");
          v.className = "vuoto";
          v.textContent = "in attesa del CSV";
          riga.appendChild(v);
        }
        m.addEventListener("mouseleave", function () { leggio(""); });
        mesi.appendChild(m);
      });
      dentro.appendChild(mesi);
      d.appendChild(dentro);
      box.appendChild(d);
    });

    /* lo storico */
    var st = q("[data-storico]");
    st.innerHTML = "";
    QUADRANTI.forEach(function (qd) {
      var aperto = stato.quadrante === qd.id;
      var d = document.createElement("div");
      d.className = "qd" + (aperto ? " on" : "");
      d.id = qd.id;
      d.style.scrollMarginTop = "4rem";
      d.innerHTML =
        '<button><span class="tx"><b></b><i></i></span><span class="fr">\u2304</span></button>' +
        '<div class="corpo"><p></p></div>';
      q("b", d).textContent = qd.titolo;
      q("i", d).textContent = qd.occhiello;
      q("p", d).textContent = qd.segnaposto;
      q("button", d).addEventListener("click", function () {
        stato.quadrante = aperto ? null : qd.id;
        disegna();
      });
      st.appendChild(d);
    });

    leggio("");
  }

  function vaiA(id) {
    stato.quadrante = id;
    disegna();
    var el = document.getElementById(id);
    if (!el) return;
    /* ⭐ TOCCATO — nel guscio la finestra NON scorre: scorre il contenitore.
       `window.scrollTo` non muoveva niente. `scrollIntoView` scorre chi
       di dovere, qualunque esso sia, e si appoggia allo scrollMarginTop
       di 4rem che Design ha gia messo su ogni quadrante qui sotto. */
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /* il fondo si tocca e si chiude */
  var fondo = q("[data-annale-fondo]");
  if (fondo) {
    fondo.addEventListener("click", function (e) {
      if (e.target === fondo) chiudi();
    });
  }

  function parti() {
    disegna();
    leggiLeOrme(disegna);
  }

  window.SpazioVivo = window.SpazioVivo || {};
  window.SpazioVivo.annale = parti;
  window.SpazioVivo.annaleChiudi = chiudi;

  parti();
})();
}

/* ⛔ NESSUNA PORTA SU window.SpazioVivo, ed è voluto.
   La consegna, in fondo al suo codice, scrive già
   `window.SpazioVivo.annale = parti` — la sua porta per la pagina a sé.
   Se questo file ne mettesse un'altra con lo stesso nome, il primo
   disegno gliela sovrascriverebbe: da lì in poi «annale» vorrebbe dire
   `parti()`, che ridisegna dentro un corpo che intanto è stato svuotato.
   Chi chiama è fm-nucleo.js, che sta in comune col guscio: chiama
   `annaleDentro(dentro)` per nome, come chiama `nucleo(c)`. */
