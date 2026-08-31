/* ═══════════════════════════════════════════════════════════════
   Comunità Eterna FelicitasMundi · IL NUCLEO — chi tiene la piattaforma

   Il disegno è di Design: nucleo-spazio-vivo.html
   21.414 byte · MD5 a879b780e6fd14526877aec10615fce9

   ⭐ Aggiornare la pagina vuol dire sostituire questo file, e basta.

   ⚠️ La consegna è una PAGINA INTERA. Qui dentro ne entrano tre pezzi
      soli — il foglio di stile, il corpo con le sue finestre, e il
      codice. Testa, caratteri e fondo restano fuori: quelli li porta
      il guscio, e metterli due volte li rifarebbe litigare.

   Ci si arriva dalla quinta voce della barra: la riga `nucleo` della
   tabella `stanze`. Quella riga è `chiusa`, quindi nella barra la voce
   si vede spenta e non si tocca.

   ⛔ IL CONTROLLO D'INGRESSO STA QUI DENTRO, e non nella barra.
      `chiusa` agisce solo sul disegno della barra: il vocabolario
      BARRA contiene la voce lo stesso, e l'indirizzo ?p=nucleo chiama
      vai("nucleo") senza guardarla. Quindi il controllo lo fa questa
      funzione: si legge `persone.nucleo`, e chi non è del nucleo non
      vede nascere nemmeno un nodo.
      ⚠️ Si disegna DOPO la risposta, mai prima: disegnare e poi
         togliere vorrebbe dire averla fatta vedere.
      ⚠️ E se nel frattempo si è cambiata stanza, non si disegna più
         niente: la risposta arriva tardi e il centro è già di un altro.

   ⛔ NESSUNA PROTEZIONE SUL DATABASE, ed è voluto. «La regola della
      Plancia» non è ancora definita: qui c'è solo il controllo sul
      disegno. Chi sapesse leggere il database di suo lo leggerebbe
      lo stesso. Il giorno che la regola c'è, si aggiunge — e questa
      nota cade.

   ⭐ NESSUN DATO SCRITTO QUI. Le righe arrivano da fuori:

        window.SpazioVivo.nucleo({
          chi:      { … le persone dei cinque elementi … },
          economia: { quante, righe|lista },
          flussi:   { … }, specifica: { … },
          lavagna:  { quante, righe:[{chi, cosa, punto|quando}] },
          chat:     { … }
        })

      e due porte per le finestre: .nucleoApri e .nucleoChiudi.

   ⚠️ OGGI QUELLA CHIAMATA NON PORTA NIENTE. Il disegno si chiama da sé
      con {} appena nasce, e ogni riga legge [ in attesa ]. Nessuno gli
      passa dati: il giorno che ci sono, si accende `datiDelNucleo()`
      qui sotto — e nient'altro.

   ⚠️ I SEI TASTI aprono finestre dentro la pagina, non indirizzi.
      Niente da aggiungere al magazzino.

   ⭐ IL SESTO È L'ANNALE, ed è aggiunto qui — non sta nella consegna
      di Design. Il 24 agosto 2026 l'Annale è uscito dalla barra ed è
      entrato nel nucleo. Le mani sul codice di Design sono quattro,
      tutte segnate sul posto col commento «⭐ TOCCATO»: la carta nel
      corpo, la riga in FIN, il ramo in apri(), la voce in conta().
      Il disegno dell'Annale non è qui: sta in fm-annale.js, e questo
      file lo chiama per nome — annaleDentro(dentro).
      ⛔ fm-annale.js va caricato PRIMA di questo file nel guscio.

   ⭐ E AL POSTO DELLE REGOLE C'È «LA SPECIFICA». Dal 28 agosto 2026 la
      finestra non porta più le sole regole: porta la specifica intera —
      dodici funzioni su cinque strati col semaforo, e le 67 regole nei
      loro dieci gruppi, sotto il secondo tasto. Stesse parole, stesse
      etichette: le regole non sono andate perse, sono lì dentro.
      ⛔ fm-regole.js e le-regole.html sono usciti con la voce vecchia.
      ⚠️ Il disegno NON è un file .js: è un pezzo di Design che sta nel
         parcheggio del guscio e si disegna da sé. Qui lo si sposta
         soltanto, come le Dinamiche e «In lavorazione».

   ⚠️ `sv-velo` è anche l'id del velo sopra la mappa, nella casa. Non si
      pestano i piedi: le due stanze non stanno mai nel centro insieme.

   ⛔ Niente involucro (function(){ … })() attorno al file: il guscio
      mette tutto in comune e questo file legge da lì. L'involucro di
      Design resta dov'è, dentro avviaNucleo().
   ═══════════════════════════════════════════════════════════════ */

"use strict";

/* il disegno, come consegnato: lo stile della pagina, il corpo e le finestre */
var NUCLEO = `<style>
  .sv-nucleo,.sv-nucleo *,.sv-nucleo *::before,.sv-nucleo *::after,
  .sv-fin,.sv-fin *{box-sizing:border-box}
  .sv-nucleo,.sv-fin{--scala:1.4;--ivory:#F5F0E6;--oro:#C8A055;--oro-ch:#D4AF6A;
    --verde:#6E9E5A;--rosso:#C9707A;
    --nexus:#8C2F39;--terra:#AA8844;--acqua:#4488BB;
    --fuoco:#CC6644;--aria:#669944;--etere:#9966CC;--svil:#B87333;
    --riga:rgba(245,240,230,0.09);
    --t-eti:calc(0.8125rem * var(--scala));
    --t-tas:calc(0.9375rem * var(--scala));
    --t-cor:calc(1.0625rem * var(--scala));
    --t-tit:calc(1.5rem * var(--scala));
    color:var(--ivory);font-family:'DM Sans',system-ui,sans-serif;
    font-size:var(--t-eti);-webkit-font-smoothing:antialiased}
  .sv-nucleo{max-width:60rem;margin:0 auto;padding:3rem 1.6rem 6rem;
    display:flex;flex-direction:column;gap:2.6rem}
  .sv-nucleo a{text-decoration:none;color:var(--oro-ch)}
  .sv-nucleo a:hover{color:var(--ivory)}

  /* ── la testa ── */
  .sv-nucleo .testa{display:flex;flex-direction:column;gap:0.7rem;
    padding-bottom:1.8rem;border-bottom:1px solid rgba(184,150,62,0.2)}
  .sv-nucleo .occ{font-size:var(--t-eti);letter-spacing:0.26em;
    text-transform:uppercase;color:var(--oro-ch)}
  .sv-nucleo h1{font-family:'Cinzel',serif;font-weight:500;
    font-size:var(--t-tit);line-height:1.1;margin:0}
  .sv-nucleo .arco{font-family:'Cormorant Garamond',serif;font-style:italic;
    font-size:var(--t-cor);color:rgba(245,240,230,0.62);line-height:1.5;
    max-width:38rem;margin:0;text-wrap:pretty}

  /* ── chi c'è ── */
  .sv-nucleo .chi{display:flex;gap:0.7rem;flex-wrap:wrap}
  .sv-nucleo .p{display:flex;align-items:center;gap:0.6rem;
    border:1px solid var(--riga);border-radius:999px;
    background:rgba(10,12,26,0.5);padding:0.4rem 1.05rem 0.4rem 0.4rem}
  .sv-nucleo .p .es{flex:none;width:2rem;height:2.3rem;
    clip-path:polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%);
    background:linear-gradient(145deg,rgba(200,160,85,0.5),rgba(200,160,85,0.16));
    display:grid;place-items:center;font-family:'Cinzel',serif;
    font-size:var(--t-eti)}
  .sv-nucleo .p b{font-weight:500;font-size:var(--t-tas)}
  .sv-nucleo .p span{font-family:'Cormorant Garamond',serif;font-style:italic;
    font-size:var(--t-eti);color:rgba(245,240,230,0.42)}

  /* ── i gruppi ── */
  .sv-nucleo .gruppo{display:flex;flex-direction:column;gap:0.9rem}
  .sv-nucleo .gh{display:flex;align-items:center;gap:0.7rem;
    padding-bottom:0.7rem;border-bottom:1px solid var(--riga)}
  .sv-nucleo .gh .pt{width:0.6rem;height:0.6rem;border-radius:0.12rem;
    background:var(--c);flex:none}
  .sv-nucleo .gh b{font-family:'Cinzel',serif;font-weight:500;
    font-size:var(--t-tas);letter-spacing:0.08em;color:var(--c)}
  .sv-nucleo .gh i{margin-left:auto;font-family:'Cormorant Garamond',serif;
    font-size:var(--t-eti);color:rgba(245,240,230,0.35)}

  /* ── le card ── */
  .sv-nucleo .cards{display:grid;
    grid-template-columns:repeat(auto-fit,minmax(17rem,1fr));gap:0.9rem}
  .sv-nucleo .cd{position:relative;display:flex;flex-direction:column;
    gap:0.45rem;width:100%;text-align:left;
    border:1px solid color-mix(in srgb,var(--c) 30%,transparent);
    border-radius:0.9rem;
    background:color-mix(in srgb,var(--c) 9%,rgba(245,240,230,0.035));
    backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);
    padding:1.5rem 1.5rem 1.6rem;cursor:pointer;
    transition:border-color 0.18s,transform 0.18s;
    color:inherit;font-family:inherit}
  .sv-nucleo .cd:hover{border-color:color-mix(in srgb,var(--c) 60%,transparent);
    transform:translateY(-2px)}
  .sv-nucleo .cd:focus-visible{outline:1px solid var(--oro-ch);
    outline-offset:3px}
  .sv-nucleo .cd .sg{width:2.6rem;height:2.6rem;margin-bottom:0.5rem;
    color:var(--c);filter:brightness(1.3)}
  .sv-nucleo .cd .sg svg{width:100%;height:100%;display:block}
  .sv-nucleo .cd b{font-family:'Cinzel',serif;font-weight:500;
    font-size:var(--t-tas);color:var(--ivory);line-height:1.25}
  .sv-nucleo .cd span.de{font-family:'Cormorant Garamond',serif;
    font-size:var(--t-eti);line-height:1.45;color:rgba(245,240,230,0.6);
    max-width:22rem;text-wrap:pretty}
  .sv-nucleo .cd .vn{position:absolute;top:1.3rem;right:1.4rem;
    font-family:'Cinzel',serif;font-size:var(--t-tas);
    color:rgba(245,240,230,0.34)}

  /* ══ LE FINESTRE ══ */
  .sv-velo{display:none;position:fixed;inset:0;z-index:80;
    background:rgba(2,4,12,0.78);backdrop-filter:blur(4px);
    -webkit-backdrop-filter:blur(4px);
    padding:3rem 1.6rem;overflow-y:auto}
  .sv-velo.on{display:block}
  .sv-fin{max-width:54rem;margin:0 auto;background:#0c1020;
    border:1px solid rgba(184,150,62,0.35);border-radius:1rem;
    padding:2rem 2.2rem 2.4rem;position:relative}
  .sv-fin .x{position:absolute;top:1.2rem;right:1.2rem;
    width:2.6rem;height:2.6rem;border-radius:50%;
    border:1px solid var(--riga);background:rgba(2,4,12,0.5);
    color:rgba(245,240,230,0.55);cursor:pointer;font-size:var(--t-tas);
    line-height:1;transition:0.18s}
  .sv-fin .x:hover{border-color:rgba(201,112,122,0.6);color:var(--rosso)}
  .sv-fin .fh{display:flex;flex-direction:column;gap:0.3rem;
    margin-bottom:1.6rem;padding-bottom:1rem;padding-right:3rem;
    border-bottom:1px solid rgba(184,150,62,0.22)}
  .sv-fin .fh b{font-family:'Cinzel',serif;font-weight:500;
    font-size:var(--t-cor);color:var(--c,var(--oro-ch));line-height:1.2}
  .sv-fin .fh span{font-family:'Cormorant Garamond',serif;font-style:italic;
    font-size:var(--t-eti);color:rgba(245,240,230,0.5)}
  .sv-fin .dentro{font-family:'Cormorant Garamond',serif;
    font-size:var(--t-eti);line-height:1.6;color:rgba(245,240,230,0.75)}
  .sv-fin .attesa{font-style:italic;color:rgba(245,240,230,0.3);
    padding:3rem 0;text-align:center;display:block;font-size:var(--t-eti)}

  /* gli elementi dentro una finestra */
  .sv-fin .el{display:grid;
    grid-template-columns:repeat(auto-fit,minmax(15rem,1fr));gap:0.8rem}
  .sv-fin .ee{display:flex;flex-direction:column;gap:0.35rem;
    border-left:2px solid var(--e);border-radius:0 0.7rem 0.7rem 0;
    background:rgba(2,4,12,0.4);padding:1.1rem 1.3rem}
  .sv-fin .ee b{font-family:'Cinzel',serif;font-weight:500;
    font-size:var(--t-tas);color:var(--e);filter:brightness(1.3)}
  .sv-fin .ee span{font-family:'Cormorant Garamond',serif;
    font-size:var(--t-eti);line-height:1.45;color:rgba(245,240,230,0.55)}
  .sv-fin .ee .n{font-family:'Cinzel',serif;font-size:var(--t-eti);
    color:rgba(245,240,230,0.32);margin-top:0.15rem}

  /* le righe: task e voci della chat */
  .sv-fin .righe{display:flex;flex-direction:column;gap:0.55rem}
  .sv-fin .ri{display:flex;align-items:baseline;gap:0.9rem;
    background:rgba(2,4,12,0.4);border:1px solid var(--riga);
    border-radius:0.7rem;padding:0.9rem 1.2rem}
  .sv-fin .ri b{font-weight:500;font-family:'DM Sans',system-ui,sans-serif;
    font-size:var(--t-eti);color:var(--ivory);line-height:1.4}
  .sv-fin .ri .qu{margin-left:auto;flex:none;font-family:'Cinzel',serif;
    font-size:var(--t-eti);color:var(--c,var(--oro-ch));opacity:0.8;
    white-space:nowrap}
  .sv-fin .ri .ch{flex:none;font-family:'Cinzel',serif;font-size:var(--t-eti);
    color:rgba(245,240,230,0.4);min-width:5rem}

  /* i flussi: una fila di passaggi, e dove si interrompe */
  .sv-fin .fls{display:flex;flex-direction:column;gap:1.5rem}
  .sv-fin .fl{display:flex;flex-direction:column;gap:0.7rem;
    padding-bottom:1.5rem;border-bottom:1px solid var(--riga)}
  .sv-fin .fl:last-child{padding-bottom:0;border-bottom:0}
  .sv-fin .fl .fn{display:flex;align-items:baseline;gap:0.8rem;flex-wrap:wrap}
  .sv-fin .fl .fn b{font-family:'Cinzel',serif;font-weight:500;
    font-size:var(--t-tas);color:var(--e);filter:brightness(1.3);
    line-height:1.25}
  .sv-fin .fl .fn i{font-family:'Cormorant Garamond',serif;
    font-size:var(--t-eti);color:rgba(245,240,230,0.4)}
  .sv-fin .fila{display:flex;flex-wrap:wrap;align-items:stretch;
    gap:0.3rem 0.45rem}
  .sv-fin .fr{align-self:center;flex:none;color:rgba(245,240,230,0.24);
    font-size:var(--t-eti);line-height:1}
  .sv-fin .pa{display:flex;flex-direction:column;gap:0.2rem;
    border-radius:0.55rem;padding:0.6rem 0.95rem;
    font-size:var(--t-eti);line-height:1.3;min-width:0}
  .sv-fin .pa em{font-family:'Cormorant Garamond',serif;font-style:italic;
    font-size:var(--t-eti);opacity:0.7;line-height:1.35}
  .sv-fin .pa.s-c{background:color-mix(in srgb,var(--e) 52%,#0c1020);
    border:1px solid color-mix(in srgb,var(--e) 68%,transparent);
    color:var(--ivory)}
  .sv-fin .pa.s-m{background:transparent;
    border:1px solid color-mix(in srgb,var(--e) 42%,transparent);
    color:rgba(245,240,230,0.62)}
  .sv-fin .pa.s-x{background:transparent;
    border:1px dashed rgba(245,240,230,0.2);
    color:rgba(245,240,230,0.3)}

  @media(max-width:40rem){
    .sv-nucleo{padding:2rem 1.1rem 4rem;gap:2rem}
    .sv-velo{padding:1rem 0.7rem}
    .sv-fin{padding:1.6rem 1.2rem 2rem}
    .sv-fin .ri{flex-wrap:wrap;gap:0.4rem}
    .sv-fin .ri .qu{margin-left:0}
    .sv-fin .fila{flex-direction:column;align-items:stretch}
    .sv-fin .fr{align-self:flex-start;margin-left:0.9rem;
      transform:rotate(90deg)}
  }
</style>

<div class="sv-nucleo">

  <!-- ══ LA TESTA ══ -->
  <div class="testa">
    <div class="occ">Comunità Eterna FelicitasMundi</div>
    <h1>Il nucleo</h1>
    <p class="arco">Dove si tiene il conto di quello che entra e di quello che
       esce, si scrivono le regole, e si guarda a che punto è il lavoro.</p>
  </div>

  <!-- ══ CHI C'È ══ -->
  <div class="chi" id="n-chi"></div>

  <!-- ══ I QUADRANTI ══ -->
  <div class="gruppo">
    <div class="cards">

      <button class="cd" type="button" style="--c:var(--acqua)" data-fin="economia">
        <span class="vn" id="v-economia"></span>
        <span class="sg"><svg viewBox="0 0 48 48" fill="none"
          stroke="currentColor" stroke-width="1.4" stroke-linecap="round"
          stroke-linejoin="round">
          <path d="M6 34 C10 30 14 36 18 32 C22 28 26 34 30 30 C34 26 38 32 42 28"/>
          <path d="M6 40 C10 36 14 42 18 38 C22 34 26 40 30 36 C34 32 38 38 42 34"
                opacity=".45"/>
          <path d="M24 24 L24 8"/>
          <path d="M18 14 L24 8 L30 14"/>
          <circle cx="24" cy="24" r="2.4" fill="currentColor" stroke="none"/>
        </svg></span>
        <b>I flussi economici</b>
        <span class="de">quanto serve, quanto entra, da dove</span>
      </button>

      <button class="cd" type="button" style="--c:var(--nexus)" data-fin="flussi">
        <span class="vn" id="v-flussi"></span>
        <span class="sg"><svg viewBox="0 0 48 48" fill="none"
          stroke="currentColor" stroke-width="1.4" stroke-linecap="round"
          stroke-linejoin="round">
          <circle cx="9" cy="24" r="3.4"/>
          <circle cx="24" cy="13" r="3.4"/>
          <circle cx="24" cy="35" r="3.4"/>
          <circle cx="39" cy="24" r="3.4"/>
          <path d="M12 22 L21 15 M12 26 L21 33 M27 15 L36 22 M27 33 L36 26"
                opacity=".55"/>
          <path d="M24 17 L24 31" opacity=".3" stroke-dasharray="2 3"/>
        </svg></span>
        <b>Dinamiche</b>
        <span class="de">come i contenuti interagiscono e creano movimento</span>
      </button>

      <button class="cd" type="button" style="--c:var(--terra)" data-fin="specifica">
        <span class="vn" id="v-specifica"></span>
        <span class="sg"><svg viewBox="0 0 48 48" fill="none"
          stroke="currentColor" stroke-width="1.4" stroke-linecap="round"
          stroke-linejoin="round">
          <path d="M12 6 L36 6 L36 42 L12 42Z"/>
          <path d="M18 15 L30 15 M18 22 L30 22 M18 29 L26 29" opacity=".55"/>
          <path d="M12 6 C9 8 9 40 12 42" opacity=".4"/>
          <path d="M33 34 C36 34 38 36 37 38 C36 40 32 39 32 36
                   C32 33 37 32 39 35" opacity=".7"/>
        </svg></span>
        <b>La specifica</b>
        <span class="de">ogni funzione, dalla superficie al dato</span>
      </button>

      <!-- ⭐ AGGIUNTO — LA SESTA FINESTRA: L'ANNALE.
           Era la voce in fondo alla barra; ora vive qui dentro, dietro
           il controllo del nucleo. Il disegno lo porta fm-annale.js.
           ⛔ Il colore è «--oro», non un elemento: l'Annale non è una
              delle cinque stanze, è la memoria di tutte. La struttura
              resta oro, come vuole la veste.
           ⛔ Il segno non è disegnato qui: lo mette avviaNucleo() con
              sg("annale"), lo stesso che la barra portava. Non si
              ridisegna un segno che esiste già.
           ⭐ Il nome e la riga sono le parole che stavano nella riga
              «annale» di «stanze» — quella che esce dalla barra. Sono
              di Gab, e si spostano intere: non se ne scrivono altre. -->
      <button class="cd" type="button" style="--c:var(--oro)" data-fin="annale">
        <span class="vn" id="v-annale"></span>
        <span class="sg" id="sg-annale"></span>
        <b>L&rsquo;Annale</b>
        <span class="de">la memoria: tutto quello che &egrave; stato scritto, in ordine di tempo</span>
      </button>

    </div>
  </div>

  <!-- ══ IL LAVORO ══ -->
  <div class="gruppo">
    <div class="cards">

      <button class="cd" type="button" style="--c:var(--svil)" data-fin="lavagna">
        <span class="vn" id="v-lavagna"></span>
        <span class="sg"><svg viewBox="0 0 48 48" fill="none"
          stroke="currentColor" stroke-width="1.4" stroke-linecap="round"
          stroke-linejoin="round">
          <rect x="6" y="9" width="36" height="30" rx="2"/>
          <path d="M18 9 L18 39 M30 9 L30 39" opacity=".5"/>
          <path d="M9 15 L15 15 M9 21 L15 21" opacity=".7"/>
          <path d="M21 15 L27 15" opacity=".7"/>
          <path d="M33 15 L39 15 M33 21 L39 21 M33 27 L37 27" opacity=".4"/>
        </svg></span>
        <b>Integrator</b>
        <span class="de">le task, e a che punto sono</span>
      </button>

      <button class="cd" type="button" style="--c:var(--etere)" data-fin="chat">
        <span class="vn" id="v-chat"></span>
        <span class="sg"><svg viewBox="0 0 48 48" fill="none"
          stroke="currentColor" stroke-width="1.4" stroke-linecap="round"
          stroke-linejoin="round">
          <path d="M6 12 C6 10 8 8 10 8 L32 8 C34 8 36 10 36 12 L36 24
                   C36 26 34 28 32 28 L16 28 L8 34 L8 28 C7 28 6 27 6 24Z"/>
          <path d="M36 16 L38 16 C40 16 42 18 42 20 L42 30
                   C42 32 41 33 40 33 L40 39 L33 33 L22 33" opacity=".55"/>
          <path d="M13 15 L29 15 M13 21 L24 21" opacity=".5"/>
        </svg></span>
        <b>La chat</b>
        <span class="de">quello che ci si dice qui dentro</span>
      </button>

      <!-- ⭐ TOCCATO — la settima finestra: l'orma in lavorazione.
           Il segno è quello scelto — orma-simbolo-scelto.html,
           77158e33c54f50acea03893800b805ff — preso verbatim, non
           ridisegnato: è il passo che continua. -->
      <button class="cd" type="button" style="--c:var(--terra)" data-fin="lavorazione">
        <span class="vn" id="v-lavorazione"></span>
        <span class="sg"><svg viewBox="0 0 60 60" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"><path d="M2 50 C14 45 26 52 38 47 C46 44 52 48 58 45" opacity=".55"/><path d="M2 56 C14 51 26 58 38 53 C46 50 52 54 58 51" opacity=".22"/><g transform="translate(-4,4) scale(0.9)"><path d="M28 51 C22 51 19 47 20 43 C21 39 26 38 26 34 C26 29 21 27 21 24 C21 20 25 18 30 18 C35 18 39 20 39 24 C39 29 36 33 36 38 C36 44 34 51 28 51Z"/><circle cx="22" cy="12" r="3.2"/><circle cx="28.5" cy="9.6" r="2.4"/><circle cx="33.5" cy="10" r="2.1"/><circle cx="37.5" cy="11.6" r="1.8"/><circle cx="40.5" cy="14.2" r="1.5"/></g><g transform="translate(33,3) scale(0.5)" opacity=".45"><path d="M28 51 C22 51 19 47 20 43 C21 39 26 38 26 34 C26 29 21 27 21 24 C21 20 25 18 30 18 C35 18 39 20 39 24 C39 29 36 33 36 38 C36 44 34 51 28 51Z"/><circle cx="22" cy="12" r="3.2"/><circle cx="28.5" cy="9.6" r="2.4"/><circle cx="33.5" cy="10" r="2.1"/><circle cx="37.5" cy="11.6" r="1.8"/><circle cx="40.5" cy="14.2" r="1.5"/></g><g transform="translate(20,-2) scale(0.3)" opacity=".2"><path d="M28 51 C22 51 19 47 20 43 C21 39 26 38 26 34 C26 29 21 27 21 24 C21 20 25 18 30 18 C35 18 39 20 39 24 C39 29 36 33 36 38 C36 44 34 51 28 51Z"/><circle cx="22" cy="12" r="3.2"/><circle cx="28.5" cy="9.6" r="2.4"/><circle cx="33.5" cy="10" r="2.1"/><circle cx="37.5" cy="11.6" r="1.8"/><circle cx="40.5" cy="14.2" r="1.5"/></g></svg></span>
        <b>In lavorazione</b>
        <span class="de">l&rsquo;orma mentre si scrive</span>
      </button>

    </div>
  </div>

</div>

<!-- ══════════ LE FINESTRE ══════════ -->
<div class="sv-velo" id="sv-velo">
  <div class="sv-fin" id="sv-fin" role="dialog" aria-modal="true"
       aria-labelledby="f-tit">
    <button class="x" type="button" id="sv-x" aria-label="Chiudi">&times;</button>
    <div class="fh"><b id="f-tit">—</b><span id="f-sot"></span></div>
    <div class="dentro" id="f-dentro"></div>
  </div>
</div>
`;

function nucleo(c){
  /* ⛔ prima di tutto: niente. Il centro resta vuoto finché non si sa
     chi sta guardando. Disegnare e poi togliere sarebbe averla mostrata. */
  c.innerHTML = "";
  if(ospite || !io || !io.id) return;

  db.from("persone").select("nucleo").eq("id", io.id).maybeSingle()
    .then(function(r){
      if(vista !== "nucleo") return;              /* si è già altrove */
      if(!r || !r.data || r.data.nucleo !== true) return;   /* non è del nucleo */
      c.innerHTML = NUCLEO;
      avviaNucleo();
      datiDelNucleo();
    })
    .catch(function(){ /* nel dubbio non si disegna */ });
}

/* ── il codice della pagina, come l'ha scritto Design ──
   Nel disegno l'involucro gira da sé appena la pagina è letta; qui la
   pagina nasce dentro nucleo(), quindi lo si chiama lì.
   ⚠️ Qui dentro ci sono QUATTRO mani, e sono le sole: la riga di FIN,
      il ramo in apri() e la voce in conta() — tutte e tre per la sesta
      finestra, l'Annale — e il ramo «regole» in apri(), che ora porta
      la pagina delle regole invece dei cinque elementi.
      Ognuna è segnata col commento «⭐ TOCCATO». Nient'altro si tocca. */
function avviaNucleo(){
(function () {
  "use strict";

  var ATTESA = "[ in attesa ]";
  var velo = document.getElementById("sv-velo");
  var fin  = document.getElementById("sv-fin");
  var apert = null;

  var ELEM = [
    ["terra","Terra","var(--terra)","i vicinati, i luoghi, quello che si coltiva"],
    ["acqua","Acqua","var(--acqua)","l'Emporio: vendita, dono e scambio"],
    ["fuoco","Fuoco","var(--fuoco)","l'assistenza, il mutuo aiuto"],
    ["aria","Aria","var(--aria)","la voce, la radio, quello che si stampa"],
    ["etere","Etere","var(--etere)","la Scuola, le lezioni, la ricerca"]
  ];

  var FIN = {
    economia:["I flussi economici","quanto serve, quanto entra, da dove",
             "var(--acqua)"],
    flussi: ["Dinamiche","come i contenuti interagiscono e creano movimento",
             "var(--nexus)"],
    specifica:["La specifica","ogni funzione, dalla superficie al dato",
             "var(--terra)"],
    lavagna:["Integrator","le task, e a che punto sono","var(--svil)"],
    chat:   ["La chat","quello che ci si dice qui dentro","var(--etere)"],
    /* ⭐ TOCCATO — la sesta finestra */
    annale: ["L\u2019Annale",
             "la memoria: tutto quello che \u00e8 stato scritto, in ordine di tempo",
             "var(--oro)"],
    /* ⭐ TOCCATO — la settima */
    lavorazione: ["In lavorazione", "l\u2019orma mentre si scrive",
             "var(--terra)"]
  };

  /* ⭐ TOCCATO — il segno dell'Annale, quello che portava la barra.
     Sta nei SIMBOLI del guscio e non si ridisegna. */
  var sgAnnale = document.getElementById("sg-annale");
  if (sgAnnale && typeof sg === "function") sgAnnale.innerHTML = sg("annale");

  function el(tag, cls, testo){
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (testo !== undefined && testo !== null) n.textContent = testo;
    return n;
  }

  function vuota(n){ while (n.firstChild) n.removeChild(n.firstChild); }

  function attesa(){ return el("span","attesa",ATTESA); }

  /* i due quadranti che si aprono sui cinque elementi */
  function elementi(dati){
    var d = el("div","el");
    ELEM.forEach(function (e) {
      var v = (dati && dati[e[0]]) || {};
      var q = el("div","ee");
      q.style.setProperty("--e", e[2]);
      q.appendChild(el("b", null, e[1]));
      q.appendChild(el("span", null, e[3]));
      q.appendChild(el("span","n",
        v.conto === undefined || v.conto === null
          ? (v.quante === undefined || v.quante === null ? ATTESA : v.quante)
          : v.conto));
      d.appendChild(q);
    });
    return d;
  }

  /* le righe: task della lavagna, voci della chat */
  function righe(dati, campoDx){
    var lista = (dati && dati.righe) || [];
    if (!lista.length) return attesa();
    var d = el("div","righe");
    lista.forEach(function (r) {
      var n = el("div","ri");
      if (r.chi) n.appendChild(el("span","ch", r.chi));
      n.appendChild(el("b", null, r.cosa || ATTESA));
      n.appendChild(el("span","qu", r[campoDx] || ATTESA));
      d.appendChild(n);
    });
    return d;
  }

  var COL = {nexus:"var(--nexus)",terra:"var(--terra)",acqua:"var(--acqua)",
             fuoco:"var(--fuoco)",aria:"var(--aria)",etere:"var(--etere)",
             svil:"var(--svil)"};

  function flussi(dati){
    var lista = (dati && dati.lista) || [];
    if (!lista.length) return attesa();
    var d = el("div","fls");
    lista.forEach(function (f) {
      var b = el("div","fl");
      b.style.setProperty("--e", COL[f.elemento] || "var(--oro)");

      var t = el("div","fn");
      t.appendChild(el("b", null, f.nome || ATTESA));
      if (f.nota) t.appendChild(el("i", null, f.nota));
      b.appendChild(t);

      var passi = f.passi || [];
      if (!passi.length) { b.appendChild(attesa()); d.appendChild(b); return; }

      var fila = el("div","fila");
      passi.forEach(function (p, i) {
        if (i) fila.appendChild(el("span","fr","\u2192"));
        var st = p.stato === "c" || p.stato === "m" ? p.stato : "x";
        var n = el("div","pa s-" + st);
        n.appendChild(el("span", null, p.nome || ATTESA));
        if (p.nota) n.appendChild(el("em", null, p.nota));
        fila.appendChild(n);
      });
      b.appendChild(fila);
      d.appendChild(b);
    });
    return d;
  }

  /* ⭐ TOCCATO — I PEZZI TORNANO AL PARCHEGGIO, INTERI.
     «Dinamiche» e «In lavorazione» non sono liste di righe: sono due
     consegne che si reggono da sé, con la loro veste e il loro codice, e
     vivono in #sv-parcheggio dentro il guscio. Qui si spostano dentro la
     finestra; a finestra chiusa tornano a casa.
     ⛔ Questo va chiamato PRIMA di vuota(): vuota() svuota #f-dentro, e un
        pezzo rimasto lì se ne andrebbe per sempre — la volta dopo la
        finestra sarebbe muta e non ci sarebbe modo di accorgersene. */
  function riponi(){
    var casa = document.getElementById("sv-parcheggio");
    if (!casa) return;
    ["svDin","svOrma"].forEach(function (q) {
      var e = document.getElementById(q);
      if (e && e.parentNode !== casa) casa.appendChild(e);
    });
    /* ⭐ TOCCATO — anche la specifica torna a casa. Va per classe e non
       per id: quello che si sposta è il suo fondo, che id non ne ha. */
    var s = document.querySelector(".sv-spec-fondo");
    if (s && s.parentNode !== casa) casa.appendChild(s);
  }

  function apri(id, dati){
    var f = FIN[id];
    if (!f) return;
    apert = document.activeElement;
    fin.style.setProperty("--c", f[2]);
    document.getElementById("f-tit").textContent = f[0];
    document.getElementById("f-sot").textContent = f[1];
    var dentro = document.getElementById("f-dentro");
    riponi();
    vuota(dentro);

    /* ⭐ TOCCATO — l'Annale non è una lista di righe: porta una pagina
       intera, e se la disegna da sé. fm-annale.js legge le orme vere.
       Se quel file non c'è, la finestra si apre e dice che aspetta —
       non resta muta e non solleva. */
    /* ⭐ TOCCATO — ⑤ «Dinamiche»: il pezzo di Design prende il posto della
       lista di righe che c'era. Se il pezzo non c'è si torna a quella:
       la finestra non resta mai vuota. */
    var SV = window.SpazioVivo || {};
    var pezzoDin  = document.getElementById("svDin");
    var pezzoOrma = document.getElementById("svOrma");
    /* ⭐ TOCCATO — «La specifica». Si prende il FONDO, non #svSpec: il
       pezzo di Design porta il proprio sfondo in un involucro esterno
       che non ha id, e spostando solo il figlio lo sfondo resterebbe
       nel parcheggio. ⛔ La specifica è un file di Gab e non si tocca:
       ci si adatta da qui. */
    var pezzoSpec = document.querySelector(".sv-spec-fondo");

    if (id === "flussi" && pezzoDin) {
      dentro.appendChild(pezzoDin);
      if (typeof SV.dinamiche === "function") SV.dinamiche();
    /* ⭐ TOCCATO — ④ «In lavorazione», la settima finestra. Il pezzo porta
       dentro la sua fotografia e non va a prendere niente da fuori. */
    } else if (id === "lavorazione") {
      if (pezzoOrma) {
        dentro.appendChild(pezzoOrma);
        if (typeof SV.orma === "function") SV.orma();
      } else dentro.appendChild(attesa());
    } else if (id === "annale") {
      if (typeof annaleDentro === "function") annaleDentro(dentro);
      else dentro.appendChild(attesa());
    /* ⭐ TOCCATO — «La specifica» prende il posto di «Le regole». Il pezzo
       si è già disegnato da sé nel parcheggio: qui lo si sposta soltanto,
       come le Dinamiche. Non c'è niente da chiamare — window.SpazioVivo
       .specifica() restituisce i dati, non ridisegna.
       Se il pezzo non c'è, la finestra si apre e dice che aspetta —
       non resta muta e non solleva. */
    } else if (id === "specifica") {
      if (pezzoSpec) dentro.appendChild(pezzoSpec);
      else dentro.appendChild(attesa());
    } else if (id === "flussi") {
      dentro.appendChild(flussi(dati));
    } else if (id === "economia") {
      dentro.appendChild(elementi(dati));
    } else {
      dentro.appendChild(righe(dati, id === "lavagna" ? "punto" : "quando"));
    }
    velo.classList.add("on");
    document.body.style.overflow = "hidden";
    document.getElementById("sv-x").focus();
  }

  function chiudi(){
    riponi();                       /* ⭐ TOCCATO — i pezzi tornano a casa */
    velo.classList.remove("on");
    document.body.style.overflow = "";
    if (apert && apert.focus) apert.focus();
    apert = null;
  }

  [].forEach.call(document.querySelectorAll(".cd"), function (b) {
    b.addEventListener("click", function () {
      var tutti = (window.SpazioVivo || {}).nucleoDati || {};
      apri(b.dataset.fin, tutti[b.dataset.fin]);
    });
  });

  document.getElementById("sv-x").addEventListener("click", chiudi);
  velo.addEventListener("click", function (e) {
    if (e.target === velo) chiudi();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && velo.classList.contains("on")) chiudi();
  });

  /* chi fa parte del nucleo */
  function persone(lista){
    var c = document.getElementById("n-chi");
    vuota(c);
    if (!lista || !lista.length) return;
    lista.forEach(function (p) {
      var e = el("span","p");
      e.appendChild(el("span","es",
        p.iniziale || (p.nome || "·").charAt(0)));
      e.appendChild(el("b", null, p.nome || ATTESA));
      if (p.ruolo) e.appendChild(el("span", null, p.ruolo));
      c.appendChild(e);
    });
  }

  /* il numero in alto a destra: quanto è pieno quel posto */
  function conta(d){
    /* ⭐ TOCCATO — «annale» in coda: senza un numero resta vuoto, come gli altri */
    ["economia","specifica","flussi","lavagna","chat","annale"].forEach(function (k) {
      var e = document.getElementById("v-" + k);
      if (!e) return;
      var q = d && d[k] ? d[k].quante : undefined;
      if (q === undefined || q === null) {
        var s = d && d[k];
        if (s && s.righe) q = s.righe.length;
        else if (s && s.lista) q = s.lista.length;
      }
      e.textContent = (q === undefined || q === null) ? "" : q;
    });
  }

  window.SpazioVivo = window.SpazioVivo || {};
  window.SpazioVivo.nucleo = function (dati) {
    dati = dati || {};
    window.SpazioVivo.nucleoDati = dati;
    persone(dati.chi);
    conta(dati);
  };
  window.SpazioVivo.nucleoApri   = apri;
  window.SpazioVivo.nucleoChiudi = chiudi;

  /* a vuoto la forma si legge lo stesso */
  window.SpazioVivo.nucleo({});
})();
}

/* ── le righe del nucleo ──
   ⚠️ In attesa. Finché non si chiama niente, il disegno resta quello
      che si è già dato da sé con {}: ogni riga dice [ in attesa ] e i
      contatori restano vuoti.
   ⭐ Il giorno che i dati ci sono, qui si chiama
      window.SpazioVivo.nucleo({chi, economia, flussi, specifica, lavagna, chat})
      — e nient'altro.
   ⛔ Non si inventano né tabelle né colonne: si chiede. */
function datiDelNucleo(){
  return;
}
