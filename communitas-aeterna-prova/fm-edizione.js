/* ═══════════════════════════════════════════════════════════════
   Comunità Eterna FelicitasMundi · EDIZIONE — raccogli · cura · distribuisci

   Il disegno è di Design: edizione-spazio-vivo.html
   25.647 byte · MD5 7ae08ebd90f53b245f24a657d948cfb1

   ⭐ Aggiornare la pagina vuol dire sostituire questo file, e basta.

   Non contiene: la barra, la plancia della radio, il Megafono, il
   piede. Quelle sono del guscio.

   Ci si arriva dalla quarta voce di «Cosa incontri»: la riga
   `edizione` della tabella `stanze`, gruppo `incontro`, che porta
   rotta `edizione` — il guscio la legge e chiama vai("edizione").

   ⭐ NESSUN PREZZO, ROTTA O CAMPIONARIO SCRITTO QUI. Li porta il dato,
      per la strada che Design dichiara:

        window.SpazioVivo.edizione({
          rotte:  { raccogli, cura, informazioni,
                    famiglie:{ carta, libri, agende, fiere,
                               confezioni, gadget, abiti, servizi } },
          prezzi: { "dalla-voce", bozze, editing, traduzione,
                    impaginazione, copertina },
          campionario: "quando arriva / come si chiede"
        })

   ⚠️ OGGI QUELLA CHIAMATA NON PARTE, ed è giusto così: la tabella dei
      prezzi dell'Edizione non esiste. La pagina si disegna vuota e
      regge il vuoto — senza prezzi le righe non compaiono, senza rotte
      i quadranti restano fermi e leggibili, senza campionario resta
      [ in attesa ]. Il giorno che la tabella c'è, si accende
      `prezziEdizione()` qui sotto — e nient'altro.

   ⚠️ IL RIPARTO. Nel disegno la riga del riparto è scritta nel corpo:
      «tolto il costo di stampa: 70% all'autore, 30% a FelicitasMundi».
      Il codice di Design tratta `riparto` come un prezzo — cioè lo
      APPENDE alla riga, non la sostituisce. Finché resta così, un
      valore dal database si sommerebbe alle due cifre già scritte
      invece di prenderne il posto. Serve la mano di Design.

   ⚠️ «CHIEDI INFORMAZIONI» è spento. La rotta `informazioni` non ha
      destinazione: nessuna riga di `stanze` la dichiara, e nel disegno
      il tasto senza rotta resta href="#" e senza `data-viva`. Si accende
      da sé il giorno che il dato porta la rotta.

   ⚠️ QUELLO CHE LA PAGINA VECCHIA FACEVA — comporre un'opera dalle
      proprie orme, l'elenco delle proprie opere, i tre pannelli
      ordina · stampa · distribuisci — questo disegno non lo porta.
      Il guscio chiama ancora portaInEdizione(cosa) da un articolo e
      dalle orme: la variabile si riempie e qui nessuno la legge.
      La copia sta in PRECEDENTI/fm-edizione_2026-08-22_prima-del-disegno-nuovo.js

   ⛔ Niente involucro (function(){ … })() attorno al file: il guscio
      mette tutto in comune e questo file legge da lì. L'involucro di
      Design resta dov'è, dentro avviaEdizione().
   ═══════════════════════════════════════════════════════════════ */

"use strict";

/* il disegno, come consegnato: lo stile della pagina e il suo corpo */
var EDIZIONE = `<style>
  .sv-ediz,.sv-ediz *,.sv-ediz *::before,.sv-ediz *::after{box-sizing:border-box}
  .sv-ediz{--scala:1.4;--ivory:#F5F0E6;--oro:#C8A055;--oro-ch:#D4AF6A;
    --verde:#6E9E5A;--terra:#AA8844;--acqua:#4488BB;--fuoco:#CC6644;
    --aria:#669944;--etere:#9966CC;--svil:#B87333;--nexus:#8C2F39;
    --line:rgba(184,150,62,0.2);--riga:rgba(245,240,230,0.09);
    --t-eti:calc(0.8125rem * var(--scala));--t-tas:calc(0.9375rem * var(--scala));
    --t-cor:calc(1.0625rem * var(--scala));--t-scr:calc(1.125rem * var(--scala));
    --t-tit:calc(1.5rem * var(--scala));--t-big:calc(1.9rem * var(--scala));
    max-width:52rem;width:100%;margin:0 auto;min-width:0;
    color:var(--ivory);font-family:'DM Sans',system-ui,sans-serif;font-size:var(--t-eti);
    -webkit-font-smoothing:antialiased}
  .sv-ediz a{text-decoration:none;color:inherit}

  /* la testa */
  .sv-ediz .testa{text-align:center;padding-bottom:1.6rem;margin-bottom:1.6rem;
    border-bottom:1px solid var(--line)}
  .sv-ediz .occ{font-size:var(--t-eti);letter-spacing:0.24em;text-transform:uppercase;
    color:var(--oro-ch);margin-bottom:0.6rem}
  .sv-ediz h1{font-family:'Cinzel',serif;font-weight:500;font-size:var(--t-big);
    line-height:1.15;margin:0 0 0.85rem}
  .sv-ediz .arco{font-family:'Cinzel',serif;font-size:var(--t-eti);letter-spacing:0.16em;
    text-transform:uppercase;line-height:1.65;color:rgba(212,175,106,0.85);
    max-width:32rem;margin:0 auto}

  /* il capitolo */
  .sv-ediz .cap{margin-bottom:2.2rem;min-width:0}
  .sv-ediz .ch{display:flex;align-items:baseline;gap:0.7rem;flex-wrap:wrap;
    margin-bottom:0.7rem;padding-bottom:0.5rem;border-bottom:1px solid var(--riga)}
  .sv-ediz .ch .n{flex:none;width:2rem;height:2rem;border-radius:50%;
    border:1px solid var(--c);color:var(--c);display:grid;place-items:center;
    font-family:'Cinzel',serif;font-size:var(--t-eti);filter:brightness(1.3);
    align-self:center}
  .sv-ediz .ch b{font-family:'Cinzel',serif;font-weight:500;font-size:var(--t-cor);
    color:var(--c);filter:brightness(1.15)}
  .sv-ediz .ch i{margin-left:auto;font-family:'Cormorant Garamond',serif;
    font-size:var(--t-eti);color:rgba(245,240,230,0.4)}
  .sv-ediz p.c{font-family:'Cormorant Garamond',serif;font-size:var(--t-tas);
    line-height:1.62;color:rgba(245,240,230,0.84);margin:0 0 0.9rem;max-width:40rem}
  .sv-ediz p.c b{color:var(--ivory);font-weight:400}

  /* i due quadranti */
  .sv-ediz .due-q{display:grid;grid-template-columns:repeat(auto-fit,minmax(19rem,1fr));
    gap:0.8rem;align-items:stretch}
  .sv-ediz .q{position:relative;display:flex;flex-direction:column;min-width:0;
    border:1px solid color-mix(in srgb,var(--c) 34%,transparent);border-radius:1rem;
    overflow:hidden;background:color-mix(in srgb,var(--c) 10%,rgba(245,240,230,0.035));
    backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);
    padding:1.5rem 1.3rem 1.25rem;transition:0.2s}
  .sv-ediz .q::before{content:'';position:absolute;inset:0;pointer-events:none;
    background:radial-gradient(ellipse 66% 40% at 50% 20%,
      color-mix(in srgb,var(--c) 20%,transparent),transparent 70%)}
  .sv-ediz a.q:hover{border-color:color-mix(in srgb,var(--c) 62%,transparent);
    transform:translateY(-2px)}
  /* la prima in evidenza */
  .sv-ediz .q.spicca{border-color:color-mix(in srgb,var(--c) 58%,transparent);
    box-shadow:0 0 0 1px color-mix(in srgb,var(--c) 22%,transparent),
      0 0.8rem 2rem rgba(2,4,12,0.4)}
  .sv-ediz .q .sg{position:relative;width:3.6rem;height:3.6rem;margin:0 0 0.9rem;
    color:var(--c);filter:brightness(1.35)
      drop-shadow(0 0 0.75rem color-mix(in srgb,var(--c) 55%,transparent))}
  .sv-ediz .q .sg svg{width:100%;height:100%;display:block}
  .sv-ediz .q b{position:relative;display:block;font-family:'Cinzel',serif;
    font-weight:500;font-size:var(--t-tas);color:var(--ivory);line-height:1.3;
    margin-bottom:0.45rem}
  .sv-ediz .q > p{position:relative;font-family:'Cormorant Garamond',serif;
    font-size:var(--t-eti);line-height:1.58;color:rgba(245,240,230,0.74);
    margin:0 0 0.8rem}
  .sv-ediz .q ul{position:relative;list-style:none;margin:0 0 1rem;padding:0}
  .sv-ediz .q li{font-family:'Cormorant Garamond',serif;font-size:var(--t-eti);
    line-height:1.58;color:rgba(245,240,230,0.72);padding-left:0.95rem;
    position:relative;margin-bottom:0.4rem;min-width:0}
  .sv-ediz .q li::before{content:'\\2022';position:absolute;left:0.12rem;
    color:var(--c);opacity:0.8}
  .sv-ediz .q li b{display:inline;color:var(--ivory);font-family:inherit;
    font-weight:400;font-size:inherit}
  .sv-ediz .q li .pr{display:inline-block;margin-left:0.4rem;font-family:'Cinzel',serif;
    font-size:var(--t-eti);color:var(--oro-ch);white-space:nowrap}
  .sv-ediz .q .va{position:relative;margin-top:auto;align-self:flex-start;
    border:1px solid color-mix(in srgb,var(--c) 50%,transparent);border-radius:999px;
    padding:0.6rem 1.5rem;color:var(--c);font-family:'Cinzel',serif;
    font-size:var(--t-eti);letter-spacing:0.06em;filter:brightness(1.3)}
  .sv-ediz a.q:hover .va{background:color-mix(in srgb,var(--c) 20%,transparent);
    color:var(--ivory)}

  /* le otto famiglie della stampa */
  .sv-ediz .fam{display:grid;grid-template-columns:repeat(auto-fit,minmax(12rem,1fr));
    gap:0.7rem}
  .sv-ediz .fa{position:relative;display:block;min-width:0;
    border:1px solid color-mix(in srgb,var(--c) 32%,transparent);border-radius:1rem;
    overflow:hidden;background:color-mix(in srgb,var(--c) 10%,rgba(245,240,230,0.035));
    backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);
    padding:1.4rem 1rem 1.1rem;text-align:center;transition:0.2s}
  .sv-ediz .fa::before{content:'';position:absolute;inset:0;pointer-events:none;
    background:radial-gradient(ellipse 70% 46% at 50% 28%,
      color-mix(in srgb,var(--c) 20%,transparent),transparent 70%)}
  .sv-ediz a.fa:hover{border-color:color-mix(in srgb,var(--c) 62%,transparent);
    transform:translateY(-2px)}
  .sv-ediz a.fa:hover::before{background:radial-gradient(ellipse 70% 46% at 50% 28%,
      color-mix(in srgb,var(--c) 34%,transparent),transparent 70%)}
  .sv-ediz .fa .sg{position:relative;width:3.4rem;height:3.4rem;margin:0 auto 0.8rem;
    color:var(--c);filter:brightness(1.35)
      drop-shadow(0 0 0.75rem color-mix(in srgb,var(--c) 55%,transparent))}
  .sv-ediz .fa .sg svg{width:100%;height:100%;display:block}
  .sv-ediz .fa b{position:relative;display:block;font-family:'Cinzel',serif;
    font-weight:500;font-size:var(--t-eti);color:var(--ivory);line-height:1.3;
    margin-bottom:0.3rem;letter-spacing:0.02em}
  .sv-ediz .fa span{position:relative;display:block;font-family:'Cormorant Garamond',serif;
    font-style:italic;font-size:var(--t-eti);line-height:1.5;color:rgba(245,240,230,0.6)}

  /* la carta che scegliamo — in evidenza */
  .sv-ediz .nat{border:1px solid rgba(110,158,90,0.5);border-radius:0.9rem;
    background:rgba(110,158,90,0.09);padding:1.4rem 1.4rem;margin-top:1rem;
    box-shadow:0 0 0 1px rgba(110,158,90,0.16),0 0.8rem 2rem rgba(2,4,12,0.4)}
  .sv-ediz .nat b{display:block;font-family:'Cinzel',serif;font-weight:500;
    font-size:var(--t-tas);color:var(--verde);filter:brightness(1.25);
    margin-bottom:0.5rem}
  .sv-ediz .nat p{font-family:'Cormorant Garamond',serif;font-size:var(--t-tas);
    line-height:1.62;color:rgba(245,240,230,0.8);max-width:40rem;margin:0}
  .sv-ediz .nat p b{display:inline;font-family:'Cormorant Garamond',serif;
    font-weight:400;font-size:inherit;color:var(--ivory);filter:none;margin:0}
  .sv-ediz .nat .camp{margin-top:0.9rem;padding-top:0.8rem;
    border-top:1px solid rgba(110,158,90,0.24);font-family:'DM Sans',sans-serif;
    font-size:var(--t-eti);color:rgba(245,240,230,0.78);line-height:1.5}

  /* la distribuzione */
  .sv-ediz .dist{display:grid;grid-template-columns:repeat(auto-fit,minmax(17rem,1fr));
    gap:0.7rem;margin-bottom:1rem;align-items:stretch}
  .sv-ediz .dd{min-width:0;border:1px solid color-mix(in srgb,var(--c) 30%,transparent);
    border-radius:0.9rem;background:color-mix(in srgb,var(--c) 9%,rgba(245,240,230,0.035));
    padding:1.15rem 1.25rem}
  .sv-ediz .dd b{display:block;font-family:'Cinzel',serif;font-weight:500;
    font-size:var(--t-tas);color:var(--c);filter:brightness(1.4);margin-bottom:0.55rem}
  .sv-ediz .dd p{font-family:'Cormorant Garamond',serif;font-size:var(--t-eti);
    line-height:1.6;color:rgba(245,240,230,0.78);margin:0 0 0.55rem}
  .sv-ediz .dd p:last-child{margin-bottom:0}
  .sv-ediz .dd p b,.sv-ediz .dd li b{display:inline;font-family:inherit;font-weight:400;
    font-size:inherit;color:var(--ivory);filter:none;margin:0}
  .sv-ediz .dd ul{list-style:none;margin:0;padding:0}
  .sv-ediz .dd li{font-family:'Cormorant Garamond',serif;font-size:var(--t-eti);
    line-height:1.58;color:rgba(245,240,230,0.74);padding-left:0.95rem;position:relative;
    margin-bottom:0.35rem;min-width:0}
  .sv-ediz .dd li::before{content:'\\2022';position:absolute;left:0.12rem;
    color:var(--c);opacity:0.8}
  .sv-ediz .dd li .pr{display:inline-block;margin-left:0.4rem;font-family:'Cinzel',serif;
    font-size:var(--t-eti);color:var(--oro-ch);white-space:nowrap}
  .sv-ediz .chiedi{display:flex;justify-content:center;padding:0.3rem 0}
  .sv-ediz .chiedi .va{border-radius:999px;background:var(--oro);color:#0A0C1A;
    padding:0.8rem 1.9rem;font-family:'Cinzel',serif;font-size:var(--t-eti);
    letter-spacing:0.07em}
  .sv-ediz .chiedi .va:hover{background:var(--oro-ch);color:#0A0C1A}

  @media(max-width:40rem){
    .sv-ediz .ch i{margin-left:0;width:100%}
  }
</style>

<div class="sv-ediz">

  <div class="testa">
    <div class="occ">Comunità Eterna FelicitasMundi</div>
    <h1>Edizione</h1>
    <p class="arco">da un&rsquo;orma a un&rsquo;opera<br>e da un&rsquo;opera alla
      distribuzione</p>
  </div>

  <!-- ① CREA O RIORDINA LA TUA OPERA -->
  <div class="cap" style="--c:var(--aria)">
    <div class="ch"><span class="n">&#9312;</span>
      <b>Crea o riordina la tua opera</b><i>da orma a libro</i></div>
    <p class="c">Quello che hai già scritto <b>è più di quanto pensi</b>. Le orme di un
      anno sono un libro che non sapevi di avere: qui si mettono in ordine, si
      scelgono, e diventano un&rsquo;opera.</p>

    <div class="due-q">

      <a class="q spicca" style="--c:var(--aria)" data-rotta="raccogli" href="#">
        <span class="sg"><svg viewBox="0 0 60 60" fill="none" stroke="currentColor"
          stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 40 C14 37 26 37 31 40 C36 37 48 37 53 40"/>
          <path d="M9 40 L9 48 C14 45 26 45 31 48 C36 45 48 45 53 48 L53 40" opacity=".8"/>
          <path d="M31 40 L31 48" opacity=".55"/>
          <path d="M40 33 C43 25 45 15 44 8 C41 13 38 23 37 32"/>
          <path d="M44 8 C46 11 46 15 44 18" opacity=".55"/>
          <path d="M37 32 L34 36"/>
        </svg></span>
        <b>Metti insieme le tue opere</b>
        <p>Scegli il periodo, l&rsquo;elemento, o l&rsquo;argomento: quello che hai
          scritto si dispone in ordine di tempo, e da lì si comincia a lavorare.</p>
        <ul>
          <li>le orme di un periodo, raccolte</li>
          <li>scegliere cosa entra e cosa resta fuori</li>
          <li>l&rsquo;indice che nasce da sé</li>
          <li><b>imparare a raccontarti</b> &mdash; ti guidiamo verso la creazione di
            contenuti non finti: come si racconta quello che fai senza fingersi un
            altro</li>
        </ul>
        <span class="va">Comincia</span>
      </a>

      <a class="q" style="--c:var(--etere)" data-rotta="cura" href="#">
        <span class="sg"><svg viewBox="0 0 60 60" fill="none" stroke="currentColor"
          stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
          <path d="M13 47 L20 45 L45 20 C47 18 47 15 45 13 L43 11 C41 9 38 9 36 11 L11 36 L9 43 Z" opacity=".9"/>
          <path d="M34 13 L43 22" opacity=".6"/>
          <path d="M11 36 L20 45" opacity=".5"/>
          <path d="M17 52 L49 52" opacity=".45"/>
          <path d="M40 30 C42 26 46 25 49 27" opacity=".35"/>
          <circle cx="50" cy="34" r="1.6" fill="currentColor" stroke="none" opacity=".5"/>
        </svg></span>
        <b>Cura e grafica dell&rsquo;opera</b>
        <p>Quello che serve perché il testo diventi un libro: la lingua, la forma, la
          copertina.</p>
        <ul>
          <li data-voce="dalla-voce"><b>dalla voce allo scritto</b> &mdash; mandi
            l&rsquo;audio di una lezione, di un incontro, di un pensiero detto
            camminando: torna scritto</li>
          <li data-voce="bozze"><b>correzione bozze</b> &mdash; refusi, punteggiatura,
            forma. Si toglie l&rsquo;inciampo, non la voce</li>
          <li data-voce="editing"><b>editing</b> &mdash; struttura, coerenza, ritmo:
            dove il discorso si perde e dove invece tiene</li>
          <li data-voce="traduzione"><b>traduzione</b> &mdash; per arrivare dove non
            arrivi. Fatta a macchina e riletta da una persona</li>
          <li data-voce="impaginazione"><b>impaginazione</b> &mdash; il libro pronto per
            la stampa, in maniera automatica o attraverso esseri umani</li>
          <li data-voce="copertina"><b>copertina e grafiche</b> &mdash; copertine,
            brochure, locandine: ci mandi il materiale, torna impaginato</li>
        </ul>
        <span class="va">Vedi i servizi</span>
      </a>

    </div>
  </div>

  <!-- ② STAMPA -->
  <div class="cap" style="--c:var(--terra)">
    <div class="ch"><span class="n">&#9313;</span>
      <b>Stampa</b><i>e ti arriva a casa</i></div>
    <p class="c">Oltre alla stampa proponiamo <b>supporti per l&rsquo;esposizione
      fieristica</b> e altri prodotti utili alla comunicazione. Scegli la famiglia, poi
      il formato, la carta e quante copie.</p>

    <div class="fam">

      <a class="fa" style="--c:var(--aria)" data-rotta="carta" href="#">
        <span class="sg"><svg viewBox="0 0 60 60" fill="none" stroke="currentColor"
          stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
          <path d="M17 13 L43 13 L43 44 L17 44Z" opacity=".9"/>
          <path d="M23 22 L37 22 M23 29 L37 29 M23 36 L32 36" opacity=".45"/>
          <path d="M30 13 L30 8" opacity=".6"/>
          <circle cx="30" cy="7" r="2.2"/>
          <path d="M43 44 C41 48 38 51 34 52 L26 52 C22 51 19 48 17 44" opacity=".5"/>
          <path d="M11 52 L49 52" opacity=".3"/>
        </svg></span>
        <b>Carta stampata</b>
        <span>volantini, manifesti, locandine, biglietti da visita, cartelline,
          adesivi</span>
      </a>

      <a class="fa" style="--c:var(--aria)" data-rotta="libri" href="#">
        <span class="sg"><svg viewBox="0 0 60 60" fill="none" stroke="currentColor"
          stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 40 C14 37 26 37 31 40 C36 37 48 37 53 40"/>
          <path d="M9 40 L9 48 C14 45 26 45 31 48 C36 45 48 45 53 48 L53 40" opacity=".8"/>
          <path d="M31 40 L31 48" opacity=".55"/>
          <path d="M40 33 C43 25 45 15 44 8 C41 13 38 23 37 32"/>
          <path d="M44 8 C46 11 46 15 44 18" opacity=".55"/>
          <path d="M37 32 L34 36"/>
          <path d="M15 43 C18 42 24 42 27 43" opacity=".35"/>
        </svg></span>
        <b>Libri e cataloghi</b>
        <span>libri, riviste, cataloghi, fascicoli</span>
      </a>

      <a class="fa" style="--c:var(--terra)" data-rotta="agende" href="#">
        <span class="sg"><svg viewBox="0 0 60 60" fill="none" stroke="currentColor"
          stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="30" cy="30" r="21" opacity=".55"/>
          <circle cx="30" cy="30" r="14" opacity=".28"/>
          <circle cx="30" cy="9" r="3" fill="currentColor" stroke="none"/>
          <path d="M51 30 A3 3 0 0 0 45 30 A3 3 0 0 0 51 30" opacity=".85"/>
          <path d="M30 51 A3 3 0 0 1 30 45 A3 3 0 0 1 30 51" fill="currentColor" stroke="none" opacity=".5"/>
          <circle cx="9" cy="30" r="3" opacity=".85"/>
          <path d="M30 16 L30 30 L38 35"/>
          <g opacity=".3"><path d="M45 15 L41 19 M15 45 L19 41 M45 45 L41 41 M15 15 L19 19"/></g>
        </svg></span>
        <b>Agende e calendari</b>
        <span>agende, calendari, quaderni e taccuini</span>
      </a>

      <a class="fa" style="--c:var(--fuoco)" data-rotta="fiere" href="#">
        <span class="sg"><svg viewBox="0 0 60 60" fill="none" stroke="currentColor"
          stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 52 L19 8"/>
          <path d="M19 10 C27 7 37 13 45 10 L45 30 C37 33 27 27 19 30Z"/>
          <path d="M19 20 C27 17 37 23 45 20" opacity=".4"/>
          <path d="M19 6 C17 4 17 1 19 -1 C21 1 21 4 19 6Z"/>
          <path d="M11 55 C14 51 24 51 27 55" opacity=".55"/>
          <path d="M33 48 L33 30" opacity=".3"/>
          <path d="M28 52 C31 49 36 49 39 52" opacity=".25"/>
        </svg></span>
        <b>Esposizione e fiere</b>
        <span>totem, roll-up, striscioni, stand, insegne, pellicole per vetrine</span>
      </a>

      <a class="fa" style="--c:var(--terra)" data-rotta="confezioni" href="#">
        <span class="sg"><svg viewBox="0 0 60 60" fill="none" stroke="currentColor"
          stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
          <path d="M23 18 C15 24 13 35 18 44 C22 50 38 50 42 44 C47 35 45 24 37 18"/>
          <path d="M23 18 L37 18"/>
          <path d="M25 18 L25 13 C25 11 35 11 35 13 L35 18"/>
          <path d="M25 14 C21 15 18 19 19 23" opacity=".6"/>
          <path d="M35 14 C39 15 42 19 41 23" opacity=".6"/>
          <path d="M30 11 C27 8 27 4 30 1 C33 4 33 8 30 11Z" opacity=".75"/>
          <path d="M20 36 C25 33 35 33 40 36" opacity=".38"/>
          <path d="M22 52 L38 52" opacity=".3"/>
        </svg></span>
        <b>Confezioni e imballaggi</b>
        <span>shopper, imballaggi, bicchieri, tovaglioli, confezioni regalo</span>
      </a>

      <a class="fa" style="--c:var(--acqua)" data-rotta="gadget" href="#">
        <span class="sg"><svg viewBox="0 0 60 60" fill="none" stroke="currentColor"
          stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
          <path d="M11 36 C13 33 18 31 24 32 L36 34 C41 35 45 38 46 42 C46 46 41 48 36 47 L20 45 C14 44 11 41 11 36Z"/>
          <path d="M17 40 C21 38 27 38 32 40" opacity=".35"/>
          <path d="M30 27 C26 27 22 24 23 20 C25 16 30 19 30 27Z"/>
          <path d="M30 27 C34 27 38 24 37 20 C35 16 30 19 30 27Z"/>
          <circle cx="30" cy="18" r="2.4"/>
          <path d="M30 12 L30 6" opacity=".45"/>
          <path d="M23 13 L20 8 M37 13 L40 8" opacity=".3"/>
        </svg></span>
        <b>Gadget e regali</b>
        <span>penne, cordini, portabadge, borse, borracce</span>
      </a>

      <a class="fa" style="--c:var(--acqua)" data-rotta="abiti" href="#">
        <span class="sg"><svg viewBox="0 0 60 60" fill="none" stroke="currentColor"
          stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 8 L12 52 M48 8 L48 52"/>
          <path d="M9 11 L51 11 M9 49 L51 49" opacity=".7"/>
          <g opacity=".55"><path d="M19 11 L19 49 M26 11 L26 49 M34 11 L34 49 M41 11 L41 49"/></g>
          <path d="M12 24 C19 21 26 27 34 24 C41 21 48 27 48 24" opacity=".85"/>
          <path d="M12 31 C19 34 26 28 34 31 C41 34 48 28 48 31" opacity=".85"/>
          <path d="M12 38 C19 35 26 41 34 38 C41 35 48 41 48 38" opacity=".6"/>
          <circle cx="30" cy="4" r="2.2" opacity=".6"/>
        </svg></span>
        <b>Abbigliamento</b>
        <span>magliette, felpe, tessuti personalizzati</span>
      </a>

      <a class="fa" style="--c:var(--svil)" data-rotta="servizi" href="#">
        <span class="sg"><svg viewBox="0 0 60 60" fill="none" stroke="currentColor"
          stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
          <path d="M15 27 C13 22 14 17 17 15 C20 14 22 17 23 21 L25 27"/>
          <path d="M25 27 L22 15 C21 12 25 10 27 13 L31 26"/>
          <path d="M31 26 L30 14 C30 11 34 11 35 14 L37 27"/>
          <path d="M37 27 L38 19 C39 16 42 17 42 20 L43 33 C43 41 38 46 32 46 L24 46 C18 46 14 41 13 35 C12 31 13 28 15 27Z"/>
          <path d="M18 52 C23 49 33 49 38 52" opacity=".4"/>
          <path d="M28 34 C31 34 33 36 32 38 C31 40 27 39 27 36 C27 33 32 32 34 35" opacity=".7"/>
        </svg></span>
        <b>I servizi</b>
        <span>stampa a impatto climatico zero, campionario carta</span>
      </a>

    </div>

    <div class="nat">
      <b>La carta che scegliamo</b>
      <p>Cerchiamo <b>materiali naturali</b>: volantini in <b>carta riciclata o
        naturale</b>, riciclabili al 100%. Manifesti su cartoncino con <b>oltre il 90%
        di fibre di legno riciclate</b>. Bicchieri, tovaglioli e confezioni per alimenti
        <b>biodegradabili</b>, che si smaltiscono nell&rsquo;organico.<br><br>
        E dove si può, <b>la stampa a impatto climatico zero</b>: un piccolo
        sovrapprezzo che va in progetti di protezione del clima certificati.</p>
      <div class="camp" id="sv-ediz-camp"></div>
    </div>
  </div>

  <!-- ③ DISTRIBUISCI -->
  <div class="cap" style="--c:var(--nexus)">
    <div class="ch"><span class="n">&#9314;</span>
      <b>Distribuisci</b><i>con FelicitasMundi</i></div>
    <p class="c">Il tuo libro esce <b>edizione FelicitasMundi</b>, entra
      nell&rsquo;Emporio, e arriva nelle librerie che si uniscono ai vicinati.</p>

    <div class="dist">

      <div class="dd" style="--c:var(--nexus)">
        <b>Come scegliamo</b>
        <p>Selezioniamo le opere che <b>risuonano con la filosofia proposta in
          FelicitasMundi</b>. Ogni testo viene letto da persone del nostro staff, che ne
          accolgono la voce e la mettono accanto alle altre.</p>
        <p>Si distribuisce così <b>sull&rsquo;Emporio</b> e <b>attraverso le librerie che
          si uniscono ai vicinati</b>.</p>
      </div>

      <div class="dd" style="--c:var(--oro)">
        <b>Cosa ti diamo</b>
        <ul>
          <li><b>il marchio sull&rsquo;opera</b> &mdash; edizione FelicitasMundi</li>
          <li><b>lo spazio nell&rsquo;Emporio</b>, con la scheda e le immagini</li>
          <li><b>la proposta alle librerie</b> dei vicinati</li>
          <li><b>la ricerca di chi vuole leggerlo</b></li>
          <li data-voce="riparto"><b>tolto il costo di stampa: 70%
            all&rsquo;autore</b>, 30% a FelicitasMundi</li>
        </ul>
      </div>

    </div>

    <div class="chiedi">
      <a class="va" data-rotta="informazioni" href="#">Chiedi informazioni</a>
    </div>
  </div>

</div>
`;

function edizione(c){
  c.innerHTML = EDIZIONE;
  avviaEdizione();
  prezziEdizione();
}

/* ── il codice della pagina, come l'ha scritto Design: non si tocca ──
   Nel disegno l'involucro gira da sé appena la pagina è letta; qui la
   pagina nasce dentro edizione(), quindi lo si chiama lì.
   ⚠️ L'unica mano sul disegno è il raddoppio della barra rovescia in
      content:'\\2022' — dentro un template la sequenza \2 non passa.
      Nella pagina il carattere che esce è lo stesso. */
function avviaEdizione(){
(function () {
  "use strict";

  var ATTESA = "[ in attesa ]";
  var vuoto = function (v) { return v === undefined || v === null || v === ""; };

  function riempi(dati) {
    dati = dati || {};
    var rotte = dati.rotte || {};
    var prezzi = dati.prezzi || {};

    /* le rotte: senza, il quadrante resta fermo e leggibile */
    var tutte = {};
    Object.keys(rotte).forEach(function (k) {
      if (k !== "famiglie") tutte[k] = rotte[k];
    });
    var fam = rotte.famiglie || {};
    Object.keys(fam).forEach(function (k) { tutte[k] = fam[k]; });

    [].forEach.call(document.querySelectorAll("[data-rotta]"), function (a) {
      var r = tutte[a.getAttribute("data-rotta")];
      if (vuoto(r)) { a.setAttribute("href", "#"); a.removeAttribute("data-viva"); }
      else { a.setAttribute("href", r); a.setAttribute("data-viva", "1"); }
    });

    /* i prezzi dei servizi: senza, la riga non compare */
    [].forEach.call(document.querySelectorAll("[data-voce]"), function (li) {
      var vecchio = li.querySelector(".pr");
      if (vecchio) vecchio.parentNode.removeChild(vecchio);
      var p = prezzi[li.getAttribute("data-voce")];
      if (vuoto(p)) return;
      var s = document.createElement("span");
      s.className = "pr";
      s.textContent = String(p);
      li.appendChild(s);
    });

    var camp = document.getElementById("sv-ediz-camp");
    camp.textContent = vuoto(dati.campionario)
      ? "Il campionario della carta è " + ATTESA + "."
      : String(dati.campionario);
  }

  /* a vuoto la pagina si legge intera */
  riempi({});

  window.SpazioVivo = window.SpazioVivo || {};
  window.SpazioVivo.edizione = riempi;
})();
}

/* ── i prezzi, le rotte e il campionario ──
   ⚠️ In attesa della tabella. Finché non c'è, non si chiama niente:
      la pagina resta com'è, le righe dei prezzi non compaiono e i
      quadranti restano fermi.
   ⛔ Non si inventano né tabella né colonne: si chiede. */
function prezziEdizione(){
  return;
}
