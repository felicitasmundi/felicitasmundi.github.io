/* ════════════════════════════════════════════════════════════════
   Comunità Eterna FelicitasMundi · LA CASA — la home dello Spazio Vivo

   Il disegno è di Design: casa-spazio-vivo.html
   139.384 byte · MD5 57859be9aa0d5c2cc1f43ac09db34bf9
   (consegna del 26 agosto 2026, l'ultima — la precedente era
    630a0e0c…, 136.617 byte)

   ⭐ QUELLO CHE PORTA DI NUOVO QUESTA CONSEGNA
     · IL QUADRANTE «SIMBOLI DELL'ESPERIENZA» È VIVO: dentro il cerchio i
       sette segni si affacciano uno per volta, e un anello si allarga e
       svanisce. Ha un occhio suo e comincia quando entra nello schermo.
     · L'ORMA È TORNATA A 56rem sul computer, com'era prima.

   ⭐ Aggiornare la home vuol dire sostituire questo file, e basta.

   ⭐ LE OTTO PARTI DEL DISEGNO. La consegna è un HTML con otto fogli di
      codice. Da questa consegna nessuno resta fuori: ognuno diventa una
      funzione, e home() le chiama:

        avviaCasa()      il tempo, il cielo, il micelio, la mappa nel
                         libro, la scheda del luogo, il velo a due tempi
        avviaSegniDellaLegenda()  i sette segni — orma, connessione,
                         talenti, vicinato, ritmo, incontro, tempio —
                         messi in comune su window.SpazioVivo.segni
        avviaOrma()      la prova dell'orma, sotto la mappa
        avviaSoglia()    la voce che gira · SpazioVivo.soglia()
        avviaOrmaViva()  i dieci secondi · SpazioVivo.orma()
        avviaCinque()    i cinque quadranti · SpazioVivo.elementi()
        avviaFormula()   la formula · SpazioVivo.formula()
        avviaSoglieEMisure()  i sette segni che si affacciano, le due
                         misure, e l'occhio che ferma il disegno

      ⭐ In questa consegna Design ha messo tre cose nello stesso foglio:
         i sette segni della soglia, le due misure e l'IntersectionObserver
         che spegne soglia e orma. Prima erano due fogli. Qui restano
         insieme, come consegnati.
      ⛔ avviaSoglieEMisure() VA CHIAMATA PER ULTIMA. Il suo occhio prende
         SpazioVivo.soglia e SpazioVivo.orma nell'istante in cui gira, e se
         le trova non ancora poste non ferma più niente.

   ⭐ IL DISEGNO SI FERMA QUANDO ESCE DALLO SCHERMO, e lo fa da sé:
      l'IntersectionObserver è dentro la consegna, non aggiunto qui.
      Soglia e orma disegnano sessanta volte al secondo; fuori dallo
      sguardo si spengono, e riprendono quando tornano.

   ⛔ IL FOGLIO DELLA LEGENDA NON SI TOGLIE PIÙ, e questa consegna
      ribalta i due giri precedenti. Fin qui era codice vivo su un markup
      che non c'è — `data-leg`, `data-riga`, `data-pr` e `.sv-mleg` non
      compaiono ancora nemmeno una volta nel corpo — e lo si buttava.
      ⭐ Adesso quel foglio fa un'altra cosa, e serve: alla sua ultima riga
         mette i SETTE SEGNI DELLA LEGENDA in comune, su
         window.SpazioVivo.segni. È da lì che il quadrante nuovo di
         «Simboli dell'esperienza» li prende — legge (window.SpazioVivo
         || {}).segni e, se non li trova, esce senza disegnare niente.
         Toglierlo avrebbe spento in silenzio la cosa principale di questa
         consegna.
      ⛔ VA CHIAMATA PRESTO, e comunque PRIMA di avviaSoglieEMisure(): i
         sette segni devono essere in comune quando la giostra li cerca.
      ⚠️ Il resto di quel foglio gira ancora a vuoto e non rompe niente:
         riempi({}) ha la sua guardia — `if (box && simboli.length)` — e i
         due querySelectorAll non trovano nulla su cui girare.

   ⭐ LE DUE MANI SU QUESTO FILE, tutte e due dentro avviaCinque() e
      segnate sul posto:
        ③ i segni sono quelli del guscio — SIMBOLI — non quelli della
          consegna. Qui non si scrive nessun disegno.
        ④ le rotte vengono dalla tavola `stanze`, lette da ROTTE. Nella
          consegna sono `?p=vicinati`; la rotta vera è
          `?p=incontro:vicinati`, e quattro su cinque non aprivano niente.

   ⚠️ «SIMBOLI DELL'ESPERIENZA» PORTA A come-funziona.html, CHE NON ESISTE.
      Il file non è nella cartella di lavoro né nel magazzino pubblico:
      l'unica copia sta in PRECEDENTI/. Il guscio intercetta il tocco e
      chiama vai("come-funziona"), che non è una rotta conosciuta: si
      finisce su attesa(), una stanza vuota col nome del file per titolo.
      ⛔ Non si inventa dove deve portare, e non si tocca il disegno: il
         posto dove spegnerlo è collegaLePorteDellaCasa(), nel guscio.

   Non contiene: la barra, la plancia della radio, il Megafono, la mappa
   a tutto schermo. Quelle sono del guscio. Il piede invece sì.

   Chiede al guscio:
     · mappa-ferma.html accanto, con la sua cartella mappa-dati/
     · praticantato-figura.jpg accanto
     · figura-flauto.png accanto, per la soglia — se manca, niente
     · una funzione che apra la mappa a tutto schermo: la casa chiama
       window.SpazioVivo.apriMappa() se c'è, altrimenti lancia
       l'evento 'spazio-vivo:apri-mappa' sul documento.

   Quello che questo file espone al guscio:
     · mostraLuogo(record) · chiudiLuogo() · formaPunto(svg, nome)
     · mostraVicinato(riga, piena)
     · porta({nome, torna}) · chiudiPorta()
     · dentro(rotta) · fuori()
     · soglia() · sogliaFerma() · orma() · ormaFerma()
     · formula() · formulaFerma() · elementi()

   ⚠️ `SpazioVivo.orma` ESISTE ANCHE NEL GUSCIO, ed è un'altra cosa: il
      blocco fermo dell'orma del 21 agosto. Quando home() gira, il nome
      passa a questa. Non fa danno — quel blocco si è già disegnato da sé
      all'apertura, e nessuno, in nessun file, chiama SpazioVivo.orma().

   ⚠️ DUE QUADRANTI DEL DISEGNO SONO ANCORA SENZA MARKUP, e le loro
      funzioni escono al primo passo senza rompere niente:
      · LA PROVA DELL'ORMA — avviaOrma() cerca `sv-orma-testo` e
        `sv-orme-altri`: nessuno dei due sta nel corpo.
      · LA SCHEDA DEL CONTENUTO — `data-cont` non compare, e nessun foglio
        pone mostraContenuto. Di conseguenza SpazioVivo.segni non esiste.
      ⛔ NON SI TOGLIE NIENTE, ed è una decisione presa, non un'attesa:
         quelle informazioni devono vedersi ENTRANDO NELLA MAPPA, non
         sotto. In «Cosa incontri» c'erano finite per sbaglio, e sono
         uscite insieme a lei. Il disegno tornerà, dentro la mappa: il
         dato e le sue letture — leOrme(), ultimeCose(), schedaDi() e le
         loro compagne — restano scritti e pronti, e il giorno che il
         markup arriva funzionano senza rifare niente. Intanto girano a
         vuoto: hanno tutte la loro guardia, e nemmeno una lettura del
         database parte.

   ⚠️ `--scala` porta tre valori — 1.4, 1.2 e 1.15. Sono scelte prese
      guardando, non errori, e non si toccano.

   ⛔ Niente involucro (function(){ … })(): il guscio mette tutto in
      comune e questo file legge da lì. Rimettendolo, home() non vede più
      le variabili del guscio — SIMBOLI, ROTTE, db, io — e non si apre.
   ════════════════════════════════════════════════════════════════ */

/* il disegno, come consegnato: lo stile della casa e il suo corpo */
var CASA = `
<style>
  .sv-casa,.sv-casa *,.sv-casa *::before,.sv-casa *::after{box-sizing:border-box}
  .sv-casa > section{min-width:0;max-width:100%}
  .sv-casa [data-scelta]:hover{border-color:rgba(200,160,85,0.5);color:#F5F0E6}
  .sv-casa [data-leg]{grid-template-columns:repeat(4,minmax(0,1fr))}
  .sv-casa [data-leg] > div{min-width:0;grid-template-columns:2.4rem minmax(0,1fr)}
  .sv-casa [data-leg] > div > span{min-width:0}
  .sv-casa [data-leg] b,.sv-casa [data-leg] i{min-width:0;overflow-wrap:break-word;hyphens:auto}
  .sv-casa button{font-family:'DM Sans',sans-serif}
  .sv-casa .fp-link:hover{color:#D4AF6A}
  /* ⭐ la soglia non gira su di sé: fa passare. Dentro il cerchio i sette
     segni si affacciano uno per volta — la porta mostra quello che apre —
     e un anello si allarga piano, come una soglia che si apre. */
  .sv-casa [data-soglia] [data-anello]{position:absolute;inset:0;
    border-radius:50%;border:1px solid currentColor;opacity:0;
    animation:sv-apre 4.4s ease-out infinite}
  @keyframes sv-apre{
    0%{transform:scale(.62);opacity:0}
    28%{opacity:.34}
    100%{transform:scale(1.5);opacity:0}
  }
  .sv-casa [data-soglia] [data-passa]{position:absolute;inset:0;opacity:0;
    transform:scale(.86) translateY(0.2rem);
    transition:opacity .7s ease,transform .9s cubic-bezier(.16,.84,.28,1)}
  .sv-casa [data-soglia] [data-passa].viva{opacity:1;
    transform:none}
  .sv-casa [data-soglia] [data-passa] svg{width:100%;height:100%;display:block}
  .sv-casa [data-soglia]:hover [data-anello]{animation-duration:2s}

  /* la soglia si comporta come i cinque, ma in oro */
  .sv-casa [data-soglia]{position:relative;overflow:hidden;
    transition:border-color .3s ease,transform .3s ease,background .3s ease}
  .sv-casa [data-soglia]::before{content:'';position:absolute;inset:-30%;z-index:0;
    pointer-events:none;opacity:0;transition:opacity .5s ease;
    background:radial-gradient(circle at 50% 50%,rgba(200,160,85,.4) 0%,transparent 32%);
    background-size:200% 100%;background-repeat:no-repeat;background-position:-30% 0}
  .sv-casa [data-soglia]:hover,.sv-casa [data-soglia]:focus-visible{
    transform:translateY(-3px);border-color:rgba(200,160,85,.62);
    background:rgba(200,160,85,.13)}
  .sv-casa [data-soglia]:hover::before{opacity:.5;
    animation:sv-segnale 2.6s ease-in-out infinite}
  .sv-casa [data-soglia] > *{position:relative;z-index:1}
  .sv-casa [data-soglia] [data-sg]{transition:transform .8s cubic-bezier(.16,.84,.28,1),filter .5s ease}
  .sv-casa [data-soglia]:hover [data-sg]{transform:scale(1.12);
    filter:brightness(1.5) drop-shadow(0 0 1rem rgba(200,160,85,.6))}
  .sv-casa [data-soglia] [data-vai]{transition:letter-spacing .5s ease}
  .sv-casa [data-soglia]:hover [data-vai]{letter-spacing:.2em}
  @media(prefers-reduced-motion:reduce){
    .sv-casa [data-soglia],.sv-casa [data-soglia] [data-sg]{transition:none}
    .sv-casa [data-soglia]:hover{transform:none}
    .sv-casa [data-soglia]:hover::before{animation:none}
    .sv-casa [data-soglia] [data-anello]{animation:none;opacity:.3}
    .sv-casa [data-soglia] [data-passa]{transition:none}
  }
  @media(max-width:40rem){
    .sv-casa [data-cappello] p{padding:0.9rem 1rem;font-size:var(--t-eti);line-height:1.5}
    .sv-casa [data-cappello] [data-luna-cap]{width:7rem;height:7rem;right:-2.2rem;top:-1.8rem;box-shadow:none}
    .sv-casa [data-cappello] canvas{opacity:0.3}
  }
  @media(max-width:34rem){ .sv-casa [data-porte]{gap:1rem} .sv-casa #sv-come{flex:1 1 100%} }
  .sv-casa [data-tipi] button:hover,.sv-casa [data-attrezzo]:hover{border-color:rgba(200,160,85,0.55)}
  .sv-casa [data-tipi] button[data-su]{border-color:currentColor;background:rgba(245,240,230,0.07)}
  .sv-casa [data-attrezzo][data-su]{border-color:currentColor;background:rgba(245,240,230,0.07)}
  .sv-casa #sv-orma-testo:focus{outline:none;border-color:rgba(200,160,85,0.55)}
  .sv-casa #sv-orma-testo::placeholder{color:rgba(245,240,230,0.42);font-style:italic}
  .sv-casa [data-orma-altro]:hover{border-color:currentColor}
  @media(max-width:34rem){ .sv-casa [data-dove]{grid-template-columns:minmax(0,1fr)} }
  @keyframes sv-respira{0%,100%{transform:scale(1);opacity:0.75}50%{transform:scale(1.28);opacity:1}}
  @media(prefers-reduced-motion:reduce){ .sv-casa [style*="sv-respira"]{animation:none !important} }
  @media(max-width:62rem){ .sv-casa [data-leg]{grid-template-columns:repeat(2,minmax(0,1fr))} }
  @media(max-width:34rem){
    /* sotto i 34rem le schede a due colonne passano a una */
    .sv-casa [style*="minmax(19rem"]{grid-template-columns:minmax(0,1fr) !important}
  }
  @media(max-width:40rem){
    /* dal telefono il titolo sta al centro sopra la mappa */
    .sv-casa [data-libro]{margin-top:0}
    .sv-casa section[style*="order:1"] > h2{text-align:center}
    /* e la porta prende la stessa larghezza del quadrante della mappa */
    .sv-casa [data-porte]{display:block}
    .sv-casa [data-porte] > a{width:100%;margin-bottom:0.8rem}
    .sv-casa [data-porte] > a:last-child{margin-bottom:0}
  }
  @media(max-width:52rem){
    .sv-casa{padding-left:1.1rem;padding-right:1.1rem}
    .sv-casa [data-libro]{padding:0.3rem;border-width:1px;box-shadow:none}
    .sv-casa [data-piega]{opacity:0.28}
  }
  @media(max-width:34rem){
    .sv-casa [data-leg]{grid-template-columns:minmax(0,1fr);gap:0.9rem}
    .sv-casa [data-leg] > div{grid-template-columns:2.2rem minmax(0,1fr);gap:0.7rem}
  }

  .sv-mleg,.sv-mleg *,.sv-mleg *::before,.sv-mleg *::after{box-sizing:border-box}
  .sv-mleg,.sv-casa .liv{min-width:0}
  .sv-mleg{--scala:1.4;--ivory:#F5F0E6;--oro:#C8A055;--oro-ch:#D4AF6A;
    --terra:#AA8844;--acqua:#4488BB;--fuoco:#CC6644;--aria:#669944;--etere:#9966CC;
    --svil:#B87333;--nexus:#8C2F39;
    --line:rgba(184,150,62,0.2);--riga:rgba(245,240,230,0.09);
    --t-eti:calc(0.8125rem * var(--scala));--t-tas:calc(0.9375rem * var(--scala));
    --t-cor:calc(1.0625rem * var(--scala));--t-scr:calc(1.125rem * var(--scala));
    --t-tit:calc(1.5rem * var(--scala));--t-big:calc(1.9rem * var(--scala));
    max-width:46rem;width:100%;margin:0 auto;min-width:0;
    color:var(--ivory);font-family:'DM Sans',system-ui,sans-serif;font-size:var(--t-eti);
    -webkit-font-smoothing:antialiased}

  .sv-mleg .occhio{font-family:'DM Sans',sans-serif;font-size:var(--t-eti);
    letter-spacing:0.2em;text-transform:uppercase;color:var(--oro-ch);
    margin-bottom:0.9rem}
  .sv-mleg .liv{margin-bottom:1.6rem;min-width:0}
  .sv-mleg .liv:last-child{margin-bottom:0}
  .sv-casa .liv{margin-top:1.6rem;min-width:0;
    --terra:#AA8844;--acqua:#4488BB;--fuoco:#CC6644;--aria:#669944;
    --etere:#9966CC;--svil:#B87333;--nexus:#8C2F39}
  .sv-mleg .lh{display:flex;align-items:baseline;gap:0.7rem;flex-wrap:wrap;
    margin-bottom:0.9rem;padding-bottom:0.5rem;border-bottom:1px solid var(--riga)}
  .sv-mleg .lh .n{flex:none;width:1.9rem;height:1.9rem;border-radius:50%;
    border:1px solid var(--oro);color:var(--oro-ch);display:grid;place-items:center;
    font-family:'Cinzel',serif;font-size:var(--t-eti);align-self:center}
  .sv-mleg .lh b{font-family:'Cinzel',serif;font-weight:500;font-size:var(--t-cor);
    color:var(--ivory)}
  .sv-mleg .lh i{margin-left:auto;font-family:'Cormorant Garamond',serif;
    font-size:var(--t-eti);color:rgba(245,240,230,0.4)}

  /* ① i simboli */
  .sv-mleg .simboli{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));
    gap:0.85rem 1.6rem}
  .sv-mleg .sb{display:grid;grid-template-columns:2.6rem minmax(0,1fr);gap:0.8rem;
    align-items:center;min-width:0}
  .sv-mleg .sb .sg{width:2.2rem;height:2.2rem;color:var(--oro-ch)}
  .sv-mleg .sb .sg svg{width:100%;height:100%;display:block}
  .sv-mleg .sb b{display:block;font-family:'DM Sans',sans-serif;font-weight:500;
    font-size:var(--t-eti);line-height:1.3;min-width:0;overflow-wrap:break-word}
  .sv-mleg .sb i{display:block;font-family:'Cormorant Garamond',serif;
    font-size:var(--t-eti);line-height:1.45;color:rgba(245,240,230,0.78);min-width:0;
    overflow-wrap:break-word}
  .sv-mleg .attesa{font-family:'Cormorant Garamond',serif;font-style:italic;
    font-size:var(--t-eti);color:rgba(245,240,230,0.5);padding:0.5rem 0}

  /* ② la formula */
  .sv-mleg .form{border:1px solid var(--line);border-radius:1rem;
    background:rgba(10,12,26,0.42);padding:2rem 1.4rem;text-align:center;
    display:flex;flex-direction:column;align-items:center;gap:0.55rem}
  .sv-mleg .sopra{display:flex;align-items:center;justify-content:center;
    gap:0.4rem;flex-wrap:wrap;max-width:100%}
  .sv-mleg .par{font-family:'Cinzel',serif;font-size:var(--t-tit);
    color:rgba(245,240,230,0.55);line-height:1}
  .sv-mleg .gruppo{display:inline-flex;align-items:center;gap:0.4rem;min-width:0;
    flex:0 1 auto}
  .sv-mleg .volte{display:inline-flex;align-items:center;gap:0.4rem;white-space:nowrap;
    flex:none}
  .sv-mleg .cinque{display:flex;align-items:center;justify-content:center;
    gap:0.35rem 0.55rem;flex-wrap:wrap;min-width:0}
  .sv-mleg .el{font-family:'Cinzel',serif;font-size:var(--t-cor);line-height:1.2;
    color:var(--c);filter:brightness(1.35);white-space:nowrap}
  .sv-mleg .piu{font-family:'Cinzel',serif;font-size:var(--t-cor);
    color:rgba(245,240,230,0.45);line-height:1}
  .sv-mleg .per{font-family:'Cinzel',serif;font-size:var(--t-tit);
    color:rgba(245,240,230,0.6);line-height:1;padding:0 0.15rem}
  .sv-mleg .nexus{font-family:'Cinzel',serif;font-size:var(--t-tit);
    color:var(--nexus);filter:brightness(1.6);line-height:1.15;white-space:nowrap}
  .sv-mleg .barra{width:min(26rem,100%);height:0.2rem;border-radius:0.1rem;
    background:linear-gradient(90deg,rgba(200,160,85,0.35),var(--oro) 18%,
      var(--oro) 82%,rgba(200,160,85,0.35));margin:0.35rem 0}
  .sv-mleg .sotto{font-family:'Cinzel',serif;font-size:var(--t-cor);
    letter-spacing:0.1em;color:rgba(245,240,230,0.42);line-height:1.2}

  /* ③ in pratica */
  .sv-mleg .pratica{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:0.7rem}
  .sv-mleg .pratica[data-una]{grid-template-columns:minmax(0,1fr)}
  .sv-mleg .pratica[data-una] .pr{padding:1.8rem 1.4rem 1.6rem}
  .sv-mleg .pratica[data-una] .sg{width:5.2rem;height:5.2rem}
  .sv-mleg .pratica[data-una] b{font-size:var(--t-cor);margin-bottom:0.5rem}
  .sv-mleg .pratica[data-una] span{min-height:0;font-size:var(--t-cor);
    max-width:30rem;margin:0 auto}
  .sv-mleg .pr{position:relative;min-width:0;border:1px solid var(--line);
    border-radius:1rem;overflow:hidden;background:rgba(245,240,230,0.035);
    padding:1.4rem 1.05rem 1.15rem;text-align:center;transition:0.2s}
  .sv-mleg .pr .sg{position:relative;width:4.2rem;height:4.2rem;margin:0 auto 0.85rem;
    color:var(--oro-ch);transition:0.2s}
  .sv-mleg .pr .sg svg{width:100%;height:100%;display:block}
  .sv-mleg .pr:hover{border-color:rgba(200,160,85,0.5)}
  .sv-mleg .pr:hover .sg{filter:brightness(1.2)
    drop-shadow(0 0 0.85rem rgba(200,160,85,0.55))}
  .sv-mleg .pr b{position:relative;display:block;font-family:'Cinzel',serif;
    font-weight:500;font-size:var(--t-eti);color:var(--ivory);line-height:1.35;
    margin-bottom:0.4rem;min-width:0;overflow-wrap:break-word}
  /* il posto per la riga resta anche quando è vuota */
  .sv-mleg .pr span{position:relative;display:block;min-height:2.6rem;
    font-family:'Cormorant Garamond',serif;font-style:italic;font-size:var(--t-eti);
    line-height:1.5;color:rgba(245,240,230,0.62);min-width:0;overflow-wrap:break-word}

  @media(max-width:46rem){
    .sv-mleg .pratica{grid-template-columns:minmax(0,1fr)}
    .sv-mleg .pr span{min-height:0}
  }
  @media(max-width:34rem){
    .sv-mleg .simboli{grid-template-columns:minmax(0,1fr)}
    .sv-mleg .form{padding:1.5rem 1rem}
    .sv-mleg .barra{height:0.16rem}
  }

  .fm-ak{font-size:16px;font-family:inherit;box-sizing:border-box;margin:0;overflow:hidden;
    display:flex;justify-content:center;padding:2.4em 1.25em 2.6em;background:none}
  .fm-ak *,.fm-ak *::before{box-sizing:inherit}
  .fm-ak-col{width:100%;max-width:40em;text-align:center}
  .fm-ak-tit{font-family:'Cinzel',serif;font-weight:500;font-size:var(--t-tit);
    letter-spacing:0.08em;text-transform:uppercase;color:var(--ivory);
    line-height:1.2;margin:0 0 0.5rem}
  .fm-ak-fig{position:relative;width:100%;max-width:21em;margin:0 auto}
  .fm-ak-geo{position:absolute;left:50%;top:50%;width:142%;aspect-ratio:1;transform:translate(-50%,-50%);
    pointer-events:none}
  .fm-ak-geo .fm-ak-ret{animation:fm-ak-gira 150s linear infinite}
  .fm-ak-fig img{position:relative;z-index:1}
  .fm-ak-fig img{display:block;width:100%;height:auto;mix-blend-mode:screen;mask-image:radial-gradient(ellipse 62% 74% at 50% 50%,#000 0,#000 52%,rgba(0,0,0,.55) 74%,transparent 92%);
    -webkit-mask-image:radial-gradient(ellipse 62% 74% at 50% 50%,#000 0,#000 52%,rgba(0,0,0,.55) 74%,transparent 92%)}
  .fm-ak-fig::after{content:"";position:absolute;inset:-8%;pointer-events:none;
    background:radial-gradient(ellipse 60% 52% at 50% 50%,rgba(212,175,106,.14),transparent 70%);
    animation:fm-ak-puls 14s ease-in-out infinite}
  .fm-ak-leg{display:flex;justify-content:center;flex-wrap:wrap;gap:.6em 1.4em;margin:1.25em 0 0;
    padding:0;list-style:none}
  .fm-ak-leg li{display:flex;align-items:center;gap:.5em;font-size:.95em;letter-spacing:.14em;
    text-transform:uppercase;color:rgba(245,240,230,.74);font-family:Georgia,'Times New Roman',serif}
  .fm-ak-leg i{width:.45em;height:.45em;border-radius:50%;background:currentColor;
    box-shadow:0 0 .5em currentColor;flex:none}
  .fm-ak-cit{font-size:1.3em;line-height:1.6;font-style:italic;color:rgba(245,240,230,.76);
    margin:1.23em auto 0;max-width:26.15em;text-wrap:pretty;font-family:Georgia,'Times New Roman',serif}
  .fm-ak-att{font-size:.9em;line-height:1.4;letter-spacing:.18em;text-transform:uppercase;
    color:rgba(212,175,106,.72);margin:1.11em auto 0;font-family:Georgia,'Times New Roman',serif}
  @keyframes fm-ak-puls{0%,100%{opacity:.8}50%{opacity:1}}
  @keyframes fm-ak-gira{to{transform:rotate(360deg)}}
  @media (prefers-reduced-motion:reduce){.fm-ak-fig::after,.fm-ak-geo{animation:none}}

  .fm-ak-sot{font-family:'Cormorant Garamond',serif;font-style:italic;
    font-size:var(--t-cor);line-height:1.5;color:rgba(245,240,230,0.82);
    margin:0 0 2rem;text-wrap:pretty}

  /* ⭐ a tutta larghezza: la colonna la tiene, lo schermo no */
  .sv-casa [data-pieno]{flex:none;max-width:none;
    width:calc(100vw - var(--barra,0rem));
    margin-left:calc(50% - (100vw - var(--barra,0rem)) / 2);margin-top:0}
  .sv-casa [data-pieno]{display:flex;min-height:var(--sv-alt,calc(100svh - 14.5rem))}
  .sv-casa [data-pieno] .sv-soglia{border-radius:0;flex:1;min-height:0}
  @media(max-width:52rem){
    .sv-casa [data-pieno]{width:100vw;margin-left:calc(50% - 50vw)}
  }

  /* ── la soglia ── */
  .sv-soglia{position:relative;width:100%;
    display:flex;align-items:center;overflow:hidden;border-radius:1.1rem;
    padding:clamp(1.4rem,4.5vw,3rem);
    font-family:'DM Sans',system-ui,sans-serif;color:#F5F0E6}

  .sv-soglia .cielo{position:absolute;inset:0;z-index:0;pointer-events:none;
    background:
      radial-gradient(ellipse at 20% 16%,rgba(38,64,120,.42),transparent 58%),
      radial-gradient(ellipse at 86% 82%,rgba(60,44,110,.32),transparent 60%),
      #0A0C1A}
  .sv-soglia canvas{position:absolute;inset:0;z-index:1;
    width:100%;height:100%;display:block;pointer-events:none}

  .sv-soglia .figura{position:absolute;z-index:2;pointer-events:none;
    right:-2%;bottom:0;top:0;width:clamp(14rem,44%,32rem);
    display:flex;align-items:flex-end;justify-content:center}
  .sv-soglia .figura img{max-width:100%;max-height:92%;object-fit:contain;
    object-position:bottom;display:block;opacity:.9;
    filter:drop-shadow(0 0 5rem rgba(60,110,200,.4))}
  .sv-soglia .figura::after{content:'';position:absolute;inset:0;
    background:linear-gradient(100deg,#0A0C1A 0%,rgba(10,12,26,.82) 20%,
      rgba(10,12,26,.36) 52%,transparent 78%)}

  .sv-soglia .dentro{position:relative;z-index:3;width:100%}

  .sv-soglia .ora{font-family:'Cinzel',serif;font-weight:500;
    font-size:clamp(1.15rem,3.4vw,2.4rem);letter-spacing:.22em;
    text-transform:uppercase;color:var(--c,#D4AF6A);
    transition:color 1.2s ease;margin-bottom:.5rem;line-height:1.1;
    text-shadow:0 2px 26px rgba(4,6,16,.95)}

  /* la riga che cambia */
  .sv-soglia .giostra{position:relative;
    height:clamp(4.6rem,13.5vw,9.4rem)}
  .sv-soglia .voce{position:absolute;inset:0;
    display:flex;align-items:flex-start;
    font-family:'Cormorant Garamond',serif;font-weight:400;
    font-size:clamp(1.9rem,6.4vw,5rem);line-height:1.04;
    letter-spacing:-.014em;
    text-shadow:0 2px 50px rgba(4,6,16,.95),0 0 100px rgba(4,6,16,.7);
    opacity:0;transform:translateY(52%);
    transition:opacity .9s ease,transform 1.1s cubic-bezier(.16,.84,.28,1)}
  .sv-soglia .voce.viva{opacity:1;transform:none}
  .sv-soglia .voce.via{opacity:0;transform:translateY(-34%);
    transition:opacity .7s ease,transform .9s cubic-bezier(.5,0,.75,1)}

  /* i pallini, per capire che scorre */
  .sv-soglia .passi{display:flex;gap:.4rem;margin-top:clamp(1rem,3vw,1.8rem)}
  .sv-soglia .passi i{width:.34rem;height:.34rem;border-radius:50%;
    background:rgba(245,240,230,.2);transition:.5s;font-style:normal}
  .sv-soglia .passi i.qui{background:var(--c,#D4AF6A);width:1.5rem;
    border-radius:999px}

  @media (max-width:52rem){
    .sv-casa [data-pieno]{min-height:var(--sv-alt,calc(100svh - 18rem))}
    .sv-soglia{align-items:flex-start;
      padding-bottom:clamp(1.4rem,5vw,2.4rem)}
    .sv-soglia .figura{width:100%;top:auto;height:56%;right:0}
    .sv-soglia .figura::after{
      background:linear-gradient(#0A0C1A 0%,rgba(10,12,26,.7) 26%,
        transparent 62%)}
    .sv-soglia .giostra{height:clamp(5.4rem,25vw,8rem)}
  }
  @media (prefers-reduced-motion:reduce){
    .sv-soglia .voce{transition:opacity .4s ease}
    .sv-soglia .voce.viva,.sv-soglia .voce.via{transform:none}
  }

  /* ── l'orma ── */

  .sv-orma-vive{--scala:1.4;
    --t-eti:calc(0.66rem * var(--scala));
    --t-med:calc(0.80rem * var(--scala));
    --t-gr:clamp(1.3rem, 4.1vw, 2.15rem);
    --oro-a:#D4AF6A; --terra:#AA8844;
    position:relative;max-width:56rem;margin:0 auto;
    aspect-ratio:16/11;min-height:22rem;max-height:min(40rem,76svh);
    border-radius:1.1rem;overflow:hidden;
    font-family:'DM Sans',system-ui,sans-serif;color:#F5F0E6}
  .sv-orma-vive canvas{position:absolute;inset:0;width:100%;height:100%;
    display:block}

  /* ── il quadrante: la frase e il tasto ── */
  .sv-orma-vive .mega{position:absolute;left:5%;right:5%;top:5%;
    background:rgba(6,9,20,.88);backdrop-filter:blur(7px);
    border:1px solid rgba(212,175,106,.3);border-radius:1rem;
    padding:1.05rem 1.1rem;pointer-events:none;
    box-shadow:0 12px 44px rgba(0,0,0,.55);
    opacity:0;transform:translateY(-10px);
    transition:opacity 1s ease,transform 1s ease}
  .sv-orma-vive .mega.on{opacity:1;transform:none}

  .sv-orma-vive .riga{display:flex;align-items:flex-end;gap:.85rem}
  .sv-orma-vive .colonna{flex:1;min-width:0;text-align:left}
  .sv-orma-vive .campo b{display:block;font-family:'Cormorant Garamond',serif;
    font-weight:400;font-size:var(--t-gr);line-height:1.24}
  .sv-orma-vive .campo span{display:block;font-family:'Cormorant Garamond',serif;
    font-style:italic;font-size:var(--t-med);line-height:1.5;
    color:rgba(245,240,230,.6);margin-top:.5rem}
  .sv-orma-vive .manda{flex:none;width:2.9rem;height:2.9rem;
    border-radius:50%;background:var(--oro-a);
    color:#0A0C1A;display:grid;place-items:center;
    box-shadow:0 0 0 0 rgba(212,175,106,.5)}
  .sv-orma-vive .manda svg{width:1.25rem;height:1.25rem;display:block}
  .sv-orma-vive .mega.spinge .manda{animation:spinta .6s ease-out}
  @keyframes spinta{
    0%{box-shadow:0 0 0 0 rgba(212,175,106,.65)}
    100%{box-shadow:0 0 0 1.3rem rgba(212,175,106,0)}
  }


  /* ── la parola, quando l'orma resta ── */
  .sv-orma-vive .resta{position:absolute;left:0;right:0;top:44%;
    text-align:center;pointer-events:none;opacity:0;
    transition:opacity .8s ease}
  .sv-orma-vive .resta.on{opacity:1}
  .sv-orma-vive .resta em{display:block;font-family:'Cinzel',serif;
    font-style:normal;font-size:var(--t-med);letter-spacing:.3em;
    text-transform:uppercase;color:rgba(212,175,106,.9);
    text-shadow:0 2px 20px rgba(4,6,16,1)}

  /* ── i tre ancoraggi, in fondo ── */
  .sv-orma-vive .dati{position:absolute;left:5%;right:5%;bottom:6%;
    display:flex;justify-content:center;gap:clamp(.9rem,4.5vw,3rem);
    flex-wrap:wrap;pointer-events:none;
    opacity:0;transform:translateY(6px);
    transition:opacity 1.1s ease,transform 1.1s ease}
  .sv-orma-vive .dati.on{opacity:1;transform:none}
  .sv-orma-vive .dati span{display:block;text-align:center;
    font-size:var(--t-med);color:rgba(245,240,230,.92);
    text-shadow:0 2px 18px rgba(4,6,16,1)}
  .sv-orma-vive .dati span em{display:block;font-style:normal;
    font-size:var(--t-eti);letter-spacing:.22em;text-transform:uppercase;
    color:rgba(212,175,106,.72);margin-bottom:.2rem}

  /* ── la chiusa, che copre tutto ── */
  .sv-orma-vive .coda{position:absolute;inset:0;z-index:3;
    display:grid;place-items:center;pointer-events:none;padding:8%;
    background:radial-gradient(ellipse at 50% 50%,
      rgba(4,6,16,.72),rgba(4,6,16,.5) 60%,rgba(4,6,16,.34));
    opacity:0;transition:opacity 1.4s ease}
  .sv-orma-vive .coda.on{opacity:1}
  .sv-orma-vive .coda b{font-family:'Cinzel',serif;font-weight:500;
    font-size:clamp(1.5rem,6.2vw,3.1rem);line-height:1.2;
    letter-spacing:.06em;text-align:center;
    color:rgba(245,240,230,.95);
    text-shadow:0 2px 30px rgba(4,6,16,1),0 0 60px rgba(212,175,106,.28)}

  @media (max-width:52rem){
    .sv-orma-vive{--scala:1.05;aspect-ratio:3/4;max-height:none;
      min-height:26rem}
    .sv-orma-vive .mega{left:3.5%;right:3.5%;padding:.8rem .85rem .75rem}
    .sv-orma-vive .dati{gap:.5rem 1.4rem;bottom:5%}
    .sv-orma-vive .coda b{font-size:clamp(1.35rem,7.4vw,2.2rem)}
  }

  /* sul telefono l'orma prende la misura del quadrante della radio */
  @media (max-width:52rem){
    .sv-orma-vive{aspect-ratio:auto;
      height:var(--sv-orma-h,26rem);max-height:none;min-height:0;
      margin-left:-1.1rem;margin-right:-1.1rem;width:auto;max-width:none;
      border-radius:0.35rem}
  }

  /* ── i cinque elementi ── */
  .sv-cinque{--scala:1.4;
    --t-eti:calc(0.64rem * var(--scala));
    --t-cor:calc(0.80rem * var(--scala));
    --t-tit:clamp(1.28rem,3.2vw,1.9rem);
    --oro-a:#D4AF6A;
    max-width:64rem;margin:0 auto;padding:1rem 0 2.5rem;
    font-family:'DM Sans',system-ui,sans-serif;color:#F5F0E6}
  .sv-cinque *{box-sizing:border-box}

  .sv-cinque .griglia{display:grid;gap:.7rem;grid-template-columns:minmax(0,1fr)}

  .sv-cinque a.q{position:relative;display:block;overflow:hidden;
    text-decoration:none;color:inherit;
    border-radius:1.1rem;padding:1.3rem 1.3rem 1.2rem;
    background:color-mix(in srgb,var(--c) 8%,rgba(2,4,12,.5));
    border:1px solid color-mix(in srgb,var(--c) 28%,transparent);
    transition:border-color .3s ease,transform .3s ease,background .3s ease}
  .sv-cinque a.q:hover{transform:translateY(-3px);
    border-color:color-mix(in srgb,var(--c) 62%,transparent);
    background:color-mix(in srgb,var(--c) 14%,rgba(2,4,12,.5))}

  /* ⭐ al passaggio si accende la rete: una luce passa dentro il quadrante e i
     punti si illuminano uno dopo l'altro, come un segnale che arriva.
     Nessun nome grande: l'attenzione resta sulle frasi. */
  .sv-cinque a.q::before{content:'';position:absolute;inset:-30%;z-index:0;
    pointer-events:none;opacity:0;transition:opacity .5s ease;
    background:radial-gradient(circle at 50% 50%,
      color-mix(in srgb,var(--c) 45%,transparent) 0%,transparent 32%);
    background-size:200% 100%;background-repeat:no-repeat;
    background-position:-30% 0}
  .sv-cinque a.q:hover::before,.sv-cinque a.q:focus-visible::before{
    opacity:.5;animation:sv-segnale 2.6s ease-in-out infinite}
  @keyframes sv-segnale{
    0%{background-position:-30% 0}
    50%{background-position:130% 0}
    100%{background-position:-30% 0}
  }
  .sv-cinque a.q > *{position:relative;z-index:1}
  .sv-cinque .sg{transition:transform .8s cubic-bezier(.16,.84,.28,1),
    filter .5s ease}
  .sv-cinque a.q:hover .sg,.sv-cinque a.q:focus-visible .sg{
    transform:scale(1.14);
    filter:brightness(1.6) drop-shadow(0 0 1rem color-mix(in srgb,var(--c) 70%,transparent))}
  .sv-cinque a.q:hover .sg svg,.sv-cinque a.q:focus-visible .sg svg{
    animation-duration:5s,2.2s}
  .sv-cinque li i{transition:box-shadow .45s ease,transform .45s ease}
  .sv-cinque a.q:hover li i,.sv-cinque a.q:focus-visible li i{
    animation:sv-accende 2.6s ease-in-out infinite}
  .sv-cinque a.q li:nth-child(1) i{animation-delay:0s}
  .sv-cinque a.q li:nth-child(2) i{animation-delay:.22s}
  .sv-cinque a.q li:nth-child(3) i{animation-delay:.44s}
  .sv-cinque a.q li:nth-child(4) i{animation-delay:.66s}
  @keyframes sv-accende{
    0%,100%{box-shadow:none;transform:scale(1)}
    22%{box-shadow:0 0 .5rem .1rem currentColor;transform:scale(1.6)}
  }
  .sv-cinque a.q:hover .vai,.sv-cinque a.q:focus-visible .vai{
    letter-spacing:.2em}
  .sv-cinque .vai{transition:letter-spacing .5s ease}
  @media (prefers-reduced-motion:reduce){
    .sv-cinque a.q,.sv-cinque .sg,.sv-cinque .vai{transition:none}
    .sv-cinque a.q:hover{transform:none}
    .sv-cinque a.q:hover .sg{transform:none}
    .sv-cinque a.q:hover::before{animation:none}
    .sv-cinque a.q:hover li i{animation:none}
    .sv-cinque .sg svg{animation:none;opacity:1}
  }

  .sv-cinque .capo{display:flex;align-items:center;gap:.85rem;
    margin-bottom:.75rem}
  .sv-cinque .sg{flex:none;width:2.6rem;height:2.6rem;color:var(--c);
    filter:brightness(1.2)}
  .sv-cinque .sg svg{animation:sv-gira var(--giro,22s) linear infinite,
    sv-pulsa var(--battito,7s) ease-in-out infinite}
  .sv-cinque .q:nth-child(1) .sg svg{--giro:26s;--battito:6.5s}
  .sv-cinque .q:nth-child(2) .sg svg{--giro:19s;--battito:8s;animation-delay:-3s,-2s}
  .sv-cinque .q:nth-child(3) .sg svg{--giro:15s;--battito:5.5s;animation-delay:-7s,-1s}
  .sv-cinque .q:nth-child(4) .sg svg{--giro:22s;--battito:9s;animation-delay:-11s,-4s}
  .sv-cinque .q:nth-child(5) .sg svg{--giro:30s;--battito:7.5s;animation-delay:-5s,-6s}
  @keyframes sv-gira{
    0%{transform:rotate(0deg) scale(1)}
    50%{transform:rotate(180deg) scale(1.04)}
    100%{transform:rotate(360deg) scale(1)}
  }
  @keyframes sv-pulsa{
    0%,100%{opacity:.72}
    50%{opacity:1}
  }
  .sv-cinque .sg svg{width:100%;height:100%;display:block}
  .sv-cinque .capo .tx{flex:1;min-width:0}
  .sv-cinque .capo .el{display:block;font-size:var(--t-eti);
    letter-spacing:.24em;text-transform:uppercase;color:var(--c);
    filter:brightness(1.3)}
  .sv-cinque .capo b{display:block;font-family:'Cinzel',serif;
    font-weight:500;font-size:var(--t-tit);line-height:1.2;
    margin-top:.16rem}

  .sv-cinque .riga{font-family:'Cormorant Garamond',serif;
    font-size:var(--t-cor);line-height:1.5;color:rgba(245,240,230,.78);
    margin-bottom:.9rem}

  .sv-cinque ul{list-style:none;margin:0;padding:0;
    border-top:1px solid color-mix(in srgb,var(--c) 18%,transparent);
    padding-top:.7rem}
  .sv-cinque li{display:flex;align-items:flex-start;gap:.55rem;
    font-size:var(--t-eti);line-height:1.5;color:rgba(245,240,230,.66);
    padding:.16rem 0}
  .sv-cinque li i{flex:none;width:.34rem;height:.34rem;border-radius:50%;
    background:var(--c);margin-top:.55em;font-style:normal;
    filter:brightness(1.3)}

  .sv-cinque .vai{display:block;margin-top:.9rem;font-size:var(--t-eti);
    letter-spacing:.14em;color:color-mix(in srgb,var(--c) 70%,#F5F0E6);
    filter:brightness(1.15)}

  @media (max-width:52rem){ .sv-cinque{--scala:1.15} }


  /* ── la formula ── */

  .sv-formula{--scala:1.4;
    --t-eti:calc(0.62rem * var(--scala));
    --t-cor:calc(0.78rem * var(--scala));
    --t-num:clamp(1.1rem,3.6vw,2.05rem);
    --oro-a:#D4AF6A;
    max-width:44rem;margin:0 auto;padding:1.2rem 0 1.6rem;
    font-family:'DM Sans',system-ui,sans-serif;color:#F5F0E6;
    text-align:center}
  .sv-formula *{box-sizing:border-box}

  .sv-formula .et{font-family:'Cinzel',serif;font-size:var(--t-eti);
    letter-spacing:.26em;text-transform:uppercase;color:var(--oro-a);
    opacity:.82;margin-bottom:1.3rem}

  .sv-formula .quadro{border:1px solid rgba(212,175,106,.24);
    border-radius:1rem;padding:clamp(1.4rem,4vw,2.4rem) 1.2rem;
    cursor:pointer;transition:border-color .4s ease}
  .sv-formula .quadro:hover{border-color:rgba(212,175,106,.44)}

  /* la riga di sopra */
  .sv-formula .sopra{display:flex;align-items:center;justify-content:center;
    flex-wrap:wrap;gap:.1em;font-family:'Cormorant Garamond',serif;
    font-size:var(--t-num);line-height:1.5}
  .sv-formula .p{opacity:0;transform:translateY(.3em);
    transition:opacity .7s ease,transform .7s cubic-bezier(.16,.84,.28,1)}
  .sv-formula .p.on{opacity:1;transform:none}
  .sv-formula .p.seg{color:rgba(245,240,230,.44);padding:0 .18em}
  .sv-formula .p.par{color:rgba(212,175,106,.62);
    font-size:1.24em;line-height:.9}
  .sv-formula .p.nex{color:#8C2F39;filter:brightness(1.5);
    font-weight:400;letter-spacing:.01em}

  /* la linea e il denominatore */
  .sv-formula .sotto{overflow:hidden;max-height:0;
    transition:max-height .9s cubic-bezier(.16,.84,.28,1)}
  .sv-formula .sotto.on{max-height:7rem}
  .sv-formula .linea{height:1px;margin:.7em auto .6em;
    background:linear-gradient(90deg,transparent,rgba(212,175,106,.75),
      transparent);width:0;transition:width 1s cubic-bezier(.16,.84,.28,1)}
  .sv-formula .sotto.on .linea{width:min(22rem,72%)}
  .sv-formula .ego{font-family:'Cormorant Garamond',serif;
    font-size:calc(var(--t-num) * .78);letter-spacing:.14em;
    color:rgba(245,240,230,.72);
    opacity:0;transition:opacity .8s ease .3s}
  .sv-formula .sotto.on .ego{opacity:1}


  .sv-formula .ancora{margin-top:.6rem;font-size:var(--t-eti);
    letter-spacing:.16em;color:rgba(212,175,106,.5);
    opacity:0;transition:opacity .8s ease}
  .sv-formula .ancora.on{opacity:1}

  @media (max-width:52rem){
    .sv-formula{--scala:1.15}
  }
  @media (prefers-reduced-motion:reduce){
    .sv-formula .p{transition:opacity .3s ease}
    .sv-formula .p{transform:none}
  }
</style>

<div class="sv-casa" style="--scala:1.4;--navy:#0A0C1A;--oro:#C8A055;--oro-ch:#D4AF6A;--ivory:#F5F0E6;--line:rgba(184,150,62,0.2);--t-eti:calc(0.8125rem * var(--scala));--t-tas:calc(0.9375rem * var(--scala));--t-cor:calc(1.0625rem * var(--scala));--t-scr:calc(1.125rem * var(--scala));--t-tit:calc(1.5rem * var(--scala));--t-big:calc(1.9rem * var(--scala));max-width:56rem;width:100%;margin:0 auto;display:flex;flex-direction:column;color:#F5F0E6;font-family:'DM Sans',sans-serif;-webkit-font-smoothing:antialiased">

  <!-- LA SOGLIA — quello che si vede aprendo la casa -->
  <section data-pieno="1" style="order:0;min-width:0">
    <div class="sv-soglia" id="svSoglia">
      <div class="cielo"></div>
      <canvas data-tela></canvas>
      <div class="figura" data-figura><img data-img alt="" hidden></div>

      <div class="dentro">
        <div class="ora" data-ora>Ora puoi</div>
        <div class="giostra" data-giostra></div>
        <div class="passi" data-passi></div>
      </div>
    </div>
  </section>

  <!-- L'ORMA — prende due terzi dell'altezza: il bordo che si intravede fa continuare -->
  <section style="order:1;margin-top:1.4rem;min-width:0">
    <div class="sv-orma-vive" id="svOrmaVive">
      <canvas data-tela></canvas>

      <div class="mega" data-mega>
        <div class="riga">
          <span class="colonna campo">
            <b>Abbiamo trovato il terreno<br>dove creare il primo villaggio</b>
          </span>
          <span class="manda" data-manda></span>
        </div>
      </div>

      <div class="resta" data-resta><em>un&rsquo;orma</em></div>

      <div class="dati" data-dati>
        <span><em>Dove</em>Paulilatino, Pozzo Santa Cristina</span>
        <span><em>Quanto</em>30k</span>
        <span><em>Come</em>SuperAdobe</span>
      </div>

      <div class="coda" data-coda><b>Il tracciato che resta, e nutre.</b></div>
    </div>
  </section>

  <!-- IL LIBRO CON LA MAPPA -->
  <section style="order:2;margin-top:2.6rem">
    <h2 style="font-family:'Cinzel',serif;font-weight:500;font-size:var(--t-tit);letter-spacing:0.08em;text-transform:uppercase;color:var(--ivory);margin:0 0 0.9rem">Dove è già cominciato</h2>
    <div data-libro="1" style="position:relative;border:1px solid rgba(200,160,85,0.5);border-radius:0.5rem;padding:0.75rem;background:linear-gradient(160deg,rgba(30,24,16,0.9),rgba(10,12,26,0.95));box-shadow:0 1.2rem 2.6rem rgba(2,4,12,0.55),inset 0 0 0 1px rgba(2,4,12,0.6)">
      <div style="position:relative;border:1px solid rgba(200,160,85,0.32);border-radius:0.25rem;overflow:hidden;background:#070c1a">
        <div style="position:relative;height:26rem">
          <iframe id="sv-mappa" src="mappa-ferma.html" title="La mappa" loading="lazy" style="position:absolute;inset:0;width:100%;height:100%;border:0;pointer-events:none"></iframe>
          <div data-piega="1" style="position:absolute;top:0;bottom:0;left:50%;width:3.4rem;transform:translateX(-50%);pointer-events:none;background:linear-gradient(to right,rgba(2,4,12,0) 0%,rgba(2,4,12,0.45) 42%,rgba(245,240,230,0.07) 50%,rgba(2,4,12,0.45) 58%,rgba(2,4,12,0) 100%)"></div>
          <div id="sv-velo" style="position:absolute;inset:0;cursor:pointer;touch-action:pan-y;display:flex;align-items:flex-end;justify-content:center;padding-bottom:1.4rem;background:linear-gradient(to bottom,rgba(2,4,12,0) 58%,rgba(2,4,12,0.55))">
            <span style="background:rgba(10,12,26,0.88);border:1px solid rgba(200,160,85,0.5);color:var(--ivory);border-radius:999px;padding:0.55rem 1.2rem;font-size:var(--t-tas);letter-spacing:0.04em">Esplora</span>
          </div>
          <div id="sv-filo" style="position:absolute;inset:0;z-index:1;pointer-events:none;box-shadow:inset 0 0 0 2px rgba(212,175,106,0.75);opacity:0"></div>

          <!-- LA SCHEDA DEL LUOGO — forma vuota: la riempie il dato. Sale quando la mappa dice quale punto. -->
          <div id="sv-scheda" aria-hidden="true" style="position:absolute;left:0;right:0;bottom:0;z-index:5;max-height:88%;overflow-y:auto;background:rgba(6,9,20,0.93);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-top:1px solid rgba(200,160,85,0.4);transform:translateY(100%);transition:transform 0.34s cubic-bezier(.3,.8,.3,1)">
            <div style="padding:0.9rem 1.1rem 1.2rem;min-width:0">
              <div style="width:2.6rem;height:0.25rem;border-radius:99px;background:rgba(245,240,230,0.22);margin:0 auto 0.9rem"></div>
              <div style="display:flex;gap:0.9rem;align-items:flex-start;min-width:0">
                <div id="sv-sk-foto" style="flex:0 0 5.2rem;height:5.2rem;border-radius:0.5rem;overflow:hidden;border:1px solid var(--line);background:rgba(245,240,230,0.05);display:grid;place-items:center;text-align:center;padding:0.4rem;font-size:var(--t-eti);color:rgba(245,240,230,0.42)"></div>
                <div style="flex:1;min-width:0">
                  <span id="sv-sk-occ" style="display:block;font-family:'DM Sans',sans-serif;font-size:var(--t-eti);letter-spacing:0.14em;text-transform:uppercase;color:var(--oro-ch)"></span>
                  <b id="sv-sk-nome" style="display:block;font-family:'Cinzel',serif;font-weight:500;font-size:var(--t-cor);margin-top:0.2rem;line-height:1.3"></b>
                  <i id="sv-sk-luogo" style="display:block;font-family:'Cormorant Garamond',serif;font-style:italic;font-size:var(--t-eti);color:rgba(245,240,230,0.72);margin-top:0.2rem;line-height:1.4"></i>
                </div>
                <button id="sv-sk-chiudi" style="flex:none;background:none;border:1px solid var(--line);border-radius:999px;color:rgba(245,240,230,0.72);font-size:var(--t-eti);padding:0.35rem 0.8rem;cursor:pointer">chiudi</button>
              </div>
              <p id="sv-sk-desc" style="font-family:'Cormorant Garamond',serif;font-size:var(--t-cor);color:rgba(245,240,230,0.86);line-height:1.6;margin:0.9rem 0 0"></p>
              <div id="sv-sk-simboli" style="display:flex;gap:0.45rem;flex-wrap:wrap;margin-top:1rem;padding-top:0.9rem;border-top:1px solid rgba(184,150,62,0.18)"></div>
              <div id="sv-sk-dentro" style="margin-top:0.9rem;min-width:0"></div>
            </div>
          </div>
          <button id="sv-ritorno" type="button" hidden style="position:absolute;left:0.7rem;top:0.7rem;z-index:3;display:none;align-items:center;gap:0.4rem;max-width:70%;background:rgba(10,12,26,0.78);border:1px solid rgba(200,160,85,0.35);color:rgba(245,240,230,0.86);border-radius:999px;padding:0.4rem 0.85rem;font-family:'DM Sans',sans-serif;font-size:var(--t-eti);line-height:1;cursor:pointer;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);overflow:hidden;text-overflow:ellipsis;white-space:nowrap"><span style="color:var(--oro-ch)">←</span><span id="sv-ritorno-nome"></span></button>
          <div style="position:absolute;right:0.7rem;bottom:0.7rem;z-index:2;display:flex;gap:0.4rem">
            <button id="sv-meno" style="background:rgba(10,12,26,0.9);border:1px solid rgba(200,160,85,0.5);color:var(--ivory);border-radius:999px;width:2.4rem;height:2.4rem;font-size:var(--t-eti);line-height:1;cursor:pointer">−</button>
            <button id="sv-piu" style="background:rgba(10,12,26,0.9);border:1px solid rgba(200,160,85,0.5);color:var(--ivory);border-radius:999px;width:2.4rem;height:2.4rem;font-size:var(--t-eti);line-height:1;cursor:pointer">+</button>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- LA PORTA -->
  <section data-porte="1" style="order:3;margin-top:2.2rem;min-width:0">
    <a id="sv-come" href="come-funziona.html" data-soglia="1" style="display:block;text-decoration:none;color:inherit;border-radius:1.1rem;padding:1.3rem 1.3rem 1.2rem;min-width:0;background:rgba(200,160,85,0.07);border:1px solid rgba(200,160,85,0.3)">
      <span style="display:flex;align-items:center;gap:0.85rem;min-width:0">
        <span data-sg="1" style="position:relative;flex:none;width:3rem;height:3rem;color:var(--oro-ch)">
          <span data-anello="1"></span>
          <span data-giostra="1" style="position:absolute;inset:0"></span>
        </span>
        <span style="flex:1;min-width:0">
          <span style="display:block;font-family:'DM Sans',sans-serif;font-size:var(--t-eti);letter-spacing:0.24em;text-transform:uppercase;color:var(--oro-ch)">La soglia</span>
          <span style="display:block;font-family:'Cinzel',serif;font-weight:500;font-size:var(--t-tit);line-height:1.2;margin-top:0.16rem;color:var(--ivory)">Simboli dell&rsquo;esperienza</span>
        </span>
      </span>
      <span style="display:block;font-family:'Cormorant Garamond',serif;font-size:var(--t-cor);line-height:1.5;color:rgba(245,240,230,0.78);margin-top:0.75rem">Ti riconosci, e inizi</span>
      <span data-vai="1" style="display:block;margin-top:0.9rem;font-family:'DM Sans',sans-serif;font-size:var(--t-eti);letter-spacing:0.14em;color:var(--oro-ch)">Entra &rsaquo;</span>
    </a>
  </section>

  <!-- IL TEMPO · IL CIELO — l'almanacco: la luna di oggi e il giorno -->
  <section style="order:4;margin-top:2.6rem;min-width:0">
    <div style="display:flex;align-items:center;gap:1.2rem;border:1px solid var(--line);border-radius:1.1rem;padding:1.1rem 1.3rem;background:rgba(245,240,230,0.03);min-width:0">
      <span style="flex:none;width:3.4rem;height:3.4rem;color:var(--oro-ch);filter:drop-shadow(0 0 0.8rem rgba(200,160,85,0.28))">
        <svg viewBox="0 0 40 40" style="width:100%;height:100%;display:block">
          <circle cx="20" cy="20" r="15.5" fill="none" stroke="rgba(200,160,85,0.28)" stroke-width="0.9"></circle>
          <path id="sv-luna" fill="currentColor" opacity="0.9"></path>
        </svg>
      </span>
      <span style="min-width:0">
        <span id="sv-giorno" style="display:block;font-family:'Cinzel',serif;font-size:var(--t-cor);color:var(--ivory);line-height:1.2"></span>
        <span style="display:block;font-family:'Cormorant Garamond',serif;font-style:italic;font-size:var(--t-eti);color:rgba(245,240,230,0.66);margin-top:0.25rem">il cielo di oggi</span>
      </span>
    </div>
  </section>

  <!-- I CINQUE ELEMENTI — cosa trovi, uno sotto l'altro -->
  <section style="order:5;margin-top:1.4rem;min-width:0">
    <div class="sv-cinque" id="svCinque">
      <div class="griglia" data-griglia></div>
    </div>
  </section>

  <!-- IL PRATICANTATO -->
  <section data-antah="1" style="order:6;margin-top:2.6rem;min-width:0">
    <div class="fm-ak">
      <div class="fm-ak-col">
        <h2 class="fm-ak-tit">Il praticantato</h2>
        <p class="fm-ak-sot">dal progetto sogno<br>alla cooperazione per una civiltà evoluta</p>

        <div class="fm-ak-fig">
          <svg class="fm-ak-geo" viewBox="-125 -125 250 250" aria-hidden="true" focusable="false">
            <g fill="none" stroke="#D4AF6A" stroke-linejoin="round">
              <g class="fm-ak-ret">
                <g stroke-width=".7" opacity=".5"><line x1="0" y1="0" x2="0" y2="-46"/><line x1="0" y1="0" x2="39.84" y2="-23"/><line x1="0" y1="0" x2="39.84" y2="23"/><line x1="0" y1="0" x2="0" y2="46"/><line x1="0" y1="0" x2="-39.84" y2="23"/><line x1="0" y1="0" x2="-39.84" y2="-23"/><line x1="0" y1="0" x2="0" y2="-92"/><line x1="0" y1="0" x2="79.67" y2="-46"/><line x1="0" y1="0" x2="79.67" y2="46"/><line x1="0" y1="0" x2="0" y2="92"/><line x1="0" y1="0" x2="-79.67" y2="46"/><line x1="0" y1="0" x2="-79.67" y2="-46"/><line x1="0" y1="-46" x2="39.84" y2="-23"/><line x1="0" y1="-46" x2="39.84" y2="23"/><line x1="0" y1="-46" x2="0" y2="46"/><line x1="0" y1="-46" x2="-39.84" y2="23"/><line x1="0" y1="-46" x2="-39.84" y2="-23"/><line x1="0" y1="-46" x2="0" y2="-92"/><line x1="0" y1="-46" x2="79.67" y2="-46"/><line x1="0" y1="-46" x2="79.67" y2="46"/><line x1="0" y1="-46" x2="0" y2="92"/><line x1="0" y1="-46" x2="-79.67" y2="46"/><line x1="0" y1="-46" x2="-79.67" y2="-46"/><line x1="39.84" y1="-23" x2="39.84" y2="23"/><line x1="39.84" y1="-23" x2="0" y2="46"/><line x1="39.84" y1="-23" x2="-39.84" y2="23"/><line x1="39.84" y1="-23" x2="-39.84" y2="-23"/><line x1="39.84" y1="-23" x2="0" y2="-92"/><line x1="39.84" y1="-23" x2="79.67" y2="-46"/><line x1="39.84" y1="-23" x2="79.67" y2="46"/><line x1="39.84" y1="-23" x2="0" y2="92"/><line x1="39.84" y1="-23" x2="-79.67" y2="46"/><line x1="39.84" y1="-23" x2="-79.67" y2="-46"/><line x1="39.84" y1="23" x2="0" y2="46"/><line x1="39.84" y1="23" x2="-39.84" y2="23"/><line x1="39.84" y1="23" x2="-39.84" y2="-23"/><line x1="39.84" y1="23" x2="0" y2="-92"/><line x1="39.84" y1="23" x2="79.67" y2="-46"/><line x1="39.84" y1="23" x2="79.67" y2="46"/><line x1="39.84" y1="23" x2="0" y2="92"/><line x1="39.84" y1="23" x2="-79.67" y2="46"/><line x1="39.84" y1="23" x2="-79.67" y2="-46"/><line x1="0" y1="46" x2="-39.84" y2="23"/><line x1="0" y1="46" x2="-39.84" y2="-23"/><line x1="0" y1="46" x2="0" y2="-92"/><line x1="0" y1="46" x2="79.67" y2="-46"/><line x1="0" y1="46" x2="79.67" y2="46"/><line x1="0" y1="46" x2="0" y2="92"/><line x1="0" y1="46" x2="-79.67" y2="46"/><line x1="0" y1="46" x2="-79.67" y2="-46"/><line x1="-39.84" y1="23" x2="-39.84" y2="-23"/><line x1="-39.84" y1="23" x2="0" y2="-92"/><line x1="-39.84" y1="23" x2="79.67" y2="-46"/><line x1="-39.84" y1="23" x2="79.67" y2="46"/><line x1="-39.84" y1="23" x2="0" y2="92"/><line x1="-39.84" y1="23" x2="-79.67" y2="46"/><line x1="-39.84" y1="23" x2="-79.67" y2="-46"/><line x1="-39.84" y1="-23" x2="0" y2="-92"/><line x1="-39.84" y1="-23" x2="79.67" y2="-46"/><line x1="-39.84" y1="-23" x2="79.67" y2="46"/><line x1="-39.84" y1="-23" x2="0" y2="92"/><line x1="-39.84" y1="-23" x2="-79.67" y2="46"/><line x1="-39.84" y1="-23" x2="-79.67" y2="-46"/><line x1="0" y1="-92" x2="79.67" y2="-46"/><line x1="0" y1="-92" x2="79.67" y2="46"/><line x1="0" y1="-92" x2="0" y2="92"/><line x1="0" y1="-92" x2="-79.67" y2="46"/><line x1="0" y1="-92" x2="-79.67" y2="-46"/><line x1="79.67" y1="-46" x2="79.67" y2="46"/><line x1="79.67" y1="-46" x2="0" y2="92"/><line x1="79.67" y1="-46" x2="-79.67" y2="46"/><line x1="79.67" y1="-46" x2="-79.67" y2="-46"/><line x1="79.67" y1="46" x2="0" y2="92"/><line x1="79.67" y1="46" x2="-79.67" y2="46"/><line x1="79.67" y1="46" x2="-79.67" y2="-46"/><line x1="0" y1="92" x2="-79.67" y2="46"/><line x1="0" y1="92" x2="-79.67" y2="-46"/><line x1="-79.67" y1="46" x2="-79.67" y2="-46"/></g>
                <g stroke-width="1" opacity=".46" stroke="#C9A6E0"><circle cx="0" cy="0" r="23"/><circle cx="0" cy="-46" r="23"/><circle cx="39.84" cy="-23" r="23"/><circle cx="39.84" cy="23" r="23"/><circle cx="0" cy="46" r="23"/><circle cx="-39.84" cy="23" r="23"/><circle cx="-39.84" cy="-23" r="23"/><circle cx="0" cy="-92" r="23"/><circle cx="79.67" cy="-46" r="23"/><circle cx="79.67" cy="46" r="23"/><circle cx="0" cy="92" r="23"/><circle cx="-79.67" cy="46" r="23"/><circle cx="-79.67" cy="-46" r="23"/></g>
              </g>
              <circle r="115" stroke-width="1" opacity=".5"/>
              <rect x="-115" y="-115" width="230" height="230" stroke-width=".8"
                    stroke-dasharray="3 3.6" opacity=".34"/>
            </g>
          </svg>
          <img src="praticantato-figura.jpg" alt="Figura umana di luce entro tre involucri concentrici &mdash; fisico, emotivo, mentale &mdash; con i sette centri di luce lungo l'asse centrale">
        </div>

        <ul class="fm-ak-leg">
          <li style="color:#F5F0E6"><i></i><span style="color:rgba(245,240,230,.78)">fisico</span></li>
          <li style="color:#D67A5A"><i></i><span style="color:rgba(245,240,230,.78)">emotivo</span></li>
          <li style="color:#A370D6"><i></i><span style="color:rgba(245,240,230,.78)">mentale</span></li>
        </ul>

        <p class="fm-ak-cit">Gettiamo un ponte sul varco che esiste nella coscienza umana tra il mondo
          dell&rsquo;esperienza ordinaria, il triplice mondo del funzionamento fisico-emotivo-mentale,
          ed i livelli pi&ugrave; alti di sviluppo cosiddetto spirituale che sono il mondo delle idee,
          della percezione intuitiva, della comprensione spirituale.</p>
        <p class="fm-ak-att">Alice Bailey &middot; Educazione Nuova Era</p>
      </div>
    </div>
  </section>

  <section style="order:7;margin-top:2.6rem;min-width:0">
    <div data-rete="1" style="position:relative;border:1px solid rgba(184,150,62,0.28);border-radius:1rem;overflow:hidden;background:rgba(10,12,26,0.34);backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px)">
    <canvas id="sv-rete2" style="position:absolute;inset:0;width:100%;height:100%;z-index:0;opacity:0.85"></canvas>
    <div style="position:absolute;inset:0;z-index:1;pointer-events:none;background:radial-gradient(ellipse at 50% 50%,rgba(2,4,12,0.5),rgba(2,4,12,0.14) 70%)"></div>
    <div style="position:relative;z-index:2;padding:2.2rem 1.6rem 1.9rem;min-width:0">
    <h2 style="font-family:'Cinzel',serif;font-weight:500;font-size:var(--t-tit);color:var(--oro-ch);text-align:center;letter-spacing:0.03em;margin:0 0 1.6rem;text-shadow:0 2px 18px rgba(2,4,12,0.9)">Le domande dei Nuovi Arrivati</h2>

    <details style="border-top:1px solid var(--line)">
      <summary style="display:flex;gap:0.7rem;padding:0.9rem 0.1rem;cursor:pointer;font-family:'Cinzel',serif;font-size:var(--t-cor);line-height:1.4;list-style:none">
        <span style="color:var(--oro)">›</span><span>Cosa possiamo fare</span>
      </summary>
      <div style="padding:0 0.1rem 1.1rem 0.2rem;min-width:0">
          <div data-nodi="1" style="display:flex;flex-direction:column;gap:1px;margin-top:0.25rem;min-width:0">
            <div style="display:flex;gap:0.95rem;align-items:flex-start;padding:0.95rem 0.15rem;min-width:0;color:#8C2F39;border-bottom:1px solid rgba(184,150,62,0.12)">
              <span style="flex:none;width:2.1rem;height:2.1rem;border-radius:50%;border:1.5px solid currentColor;color:currentColor;display:grid;place-items:center;font-family:'Cinzel',serif;font-size:var(--t-tas);line-height:1;background:rgba(245,240,230,0.05)">1</span>
              <span style="min-width:0;display:block">
                <b style="display:block;font-family:'Cinzel',serif;font-weight:500;font-size:var(--t-tas);color:var(--ivory);line-height:1.35;margin-bottom:0.25rem;text-shadow:0 2px 14px rgba(2,4,12,0.95)">Un praticantato che unisce i punti</b>
                <i style="display:block;font-family:'Cormorant Garamond',serif;font-style:italic;font-size:var(--t-cor);line-height:1.55;color:rgba(245,240,230,0.72);text-shadow:0 2px 14px rgba(2,4,12,0.95)">la coscienza, scienza e tecnologia connettono risorse, territori ed il principio attivo di ognuno di noi</i>
              </span>
            </div>

            <div style="display:flex;gap:0.95rem;align-items:flex-start;padding:0.95rem 0.15rem;min-width:0;color:#AA8844;border-bottom:1px solid rgba(184,150,62,0.12)">
              <span style="flex:none;width:2.1rem;height:2.1rem;border-radius:50%;border:1.5px solid currentColor;color:currentColor;display:grid;place-items:center;font-family:'Cinzel',serif;font-size:var(--t-tas);line-height:1;background:rgba(245,240,230,0.05)">2</span>
              <span style="min-width:0;display:block">
                <b style="display:block;font-family:'Cinzel',serif;font-weight:500;font-size:var(--t-tas);color:var(--ivory);line-height:1.35;margin-bottom:0.25rem;text-shadow:0 2px 14px rgba(2,4,12,0.95)">Fissiamo quello di cui c’è bisogno nei vicinati</b>
                <i style="display:block;font-family:'Cormorant Garamond',serif;font-style:italic;font-size:var(--t-cor);line-height:1.55;color:rgba(245,240,230,0.72);text-shadow:0 2px 14px rgba(2,4,12,0.95)">ognuno potrà rispondere e dare supporto: produzione alimentare, rimedi naturali, assistenza spirituale, informazione dell’acqua, accompagnamento alla vita in genere</i>
              </span>
            </div>

            <div style="display:flex;gap:0.95rem;align-items:flex-start;padding:0.95rem 0.15rem;min-width:0;color:#4488BB;border-bottom:1px solid rgba(184,150,62,0.12)">
              <span style="flex:none;width:2.1rem;height:2.1rem;border-radius:50%;border:1.5px solid currentColor;color:currentColor;display:grid;place-items:center;font-family:'Cinzel',serif;font-size:var(--t-tas);line-height:1;background:rgba(245,240,230,0.05)">3</span>
              <span style="min-width:0;display:block">
                <b style="display:block;font-family:'Cinzel',serif;font-weight:500;font-size:var(--t-tas);color:var(--ivory);line-height:1.35;margin-bottom:0.25rem;text-shadow:0 2px 14px rgba(2,4,12,0.95)">Scambiamo anche senza usare denaro</b>
                <i style="display:block;font-family:'Cormorant Garamond',serif;font-style:italic;font-size:var(--t-cor);line-height:1.55;color:rgba(245,240,230,0.72);text-shadow:0 2px 14px rgba(2,4,12,0.95)">i talenti fanno circolare un’economia comunitaria e centralizzata</i>
              </span>
            </div>

            <div style="display:flex;gap:0.95rem;align-items:flex-start;padding:0.95rem 0.15rem;min-width:0;color:#669944;border-bottom:1px solid rgba(184,150,62,0.12)">
              <span style="flex:none;width:2.1rem;height:2.1rem;border-radius:50%;border:1.5px solid currentColor;color:currentColor;display:grid;place-items:center;font-family:'Cinzel',serif;font-size:var(--t-tas);line-height:1;background:rgba(245,240,230,0.05)">4</span>
              <span style="min-width:0;display:block">
                <b style="display:block;font-family:'Cinzel',serif;font-weight:500;font-size:var(--t-tas);color:var(--ivory);line-height:1.35;margin-bottom:0.25rem;text-shadow:0 2px 14px rgba(2,4,12,0.95)">Facciamo ordine nella memoria</b>
                <i style="display:block;font-family:'Cormorant Garamond',serif;font-style:italic;font-size:var(--t-cor);line-height:1.55;color:rgba(245,240,230,0.72);text-shadow:0 2px 14px rgba(2,4,12,0.95)">per pubblicare, stampare e distribuire opere evolutive</i>
              </span>
            </div>

            <div style="display:flex;gap:0.95rem;align-items:flex-start;padding:0.95rem 0.15rem;min-width:0;color:#D4AF6A;border-bottom:1px solid rgba(184,150,62,0.12)">
              <span style="flex:none;width:2.1rem;height:2.1rem;border-radius:50%;border:1.5px solid currentColor;color:currentColor;display:grid;place-items:center;font-family:'Cinzel',serif;font-size:var(--t-tas);line-height:1;background:rgba(245,240,230,0.05)">5</span>
              <span style="min-width:0;display:block">
                <b style="display:block;font-family:'Cinzel',serif;font-weight:500;font-size:var(--t-tas);color:var(--ivory);line-height:1.35;margin-bottom:0.25rem;text-shadow:0 2px 14px rgba(2,4,12,0.95)">Integrator accompagna il lavoro di chi partecipa</b>
                <i style="display:block;font-family:'Cormorant Garamond',serif;font-style:italic;font-size:var(--t-cor);line-height:1.55;color:rgba(245,240,230,0.72);text-shadow:0 2px 14px rgba(2,4,12,0.95)">obiettivi, scadenze e attività — dal percorso del singolo ai gruppi connessi, fino alle aziende che partecipano: chi se ne occupa, le ore, l’avanzamento, e il corrispettivo in euro o talenti</i>
              </span>
            </div>

            <div style="display:flex;gap:0.95rem;align-items:flex-start;padding:0.95rem 0.15rem;min-width:0;color:#9966CC">
              <span style="flex:none;width:2.1rem;height:2.1rem;border-radius:50%;border:1.5px solid currentColor;color:currentColor;display:grid;place-items:center;font-family:'Cinzel',serif;font-size:var(--t-tas);line-height:1;background:rgba(245,240,230,0.05)">6</span>
              <span style="min-width:0;display:block">
                <b style="display:block;font-family:'Cinzel',serif;font-weight:500;font-size:var(--t-tas);color:var(--ivory);line-height:1.35;margin-bottom:0.25rem;text-shadow:0 2px 14px rgba(2,4,12,0.95)">Navighiamo nella mappa</b>
                <i style="display:block;font-family:'Cormorant Garamond',serif;font-style:italic;font-size:var(--t-cor);line-height:1.55;color:rgba(245,240,230,0.72);text-shadow:0 2px 14px rgba(2,4,12,0.95)">per ritrovare la comunità, i luoghi di ospitalità, gli alimenti, i rimedi naturali, le feste e le lezioni, la vita nel tempio</i>
              </span>
            </div>
          </div>
      </div>
    </details>

    <details style="border-top:1px solid var(--line)">
      <summary style="display:flex;gap:0.7rem;padding:0.9rem 0.1rem;cursor:pointer;font-family:'Cinzel',serif;font-size:var(--t-cor);line-height:1.4;list-style:none">
        <span style="color:var(--oro)">›</span><span>Cos'è la Comunità Eterna?</span>
      </summary>
      <div style="padding:0 0.1rem 1.1rem 1.4rem;font-family:'Cormorant Garamond',serif;font-size:var(--t-cor);line-height:1.62;color:rgba(245,240,230,0.9);display:flex;flex-direction:column;gap:0.7rem;text-shadow:0 2px 14px rgba(2,4,12,0.95)">
        <p style="margin:0">Le persone stanno vivendo un cambiamento epocale. Cambia il mondo lavorativo, legato anche alla tecnologia — ma cambia soprattutto il linguaggio. Ci si relaziona unicamente attraverso il telefono. È tutto così social, tutto così estetico, e spesso manca la profondità dei contenuti.</p>
        <p style="margin:0">E intanto, negli ultimi sei anni, tutto quello che viene detto viene dopo un attimo smentito. Tanti sono lì che non capiscono più nulla. Non c'è più una chiarezza.</p>
        <p style="margin:0">Dietro c'è una grande paura. E c'è, in fondo, una mancanza: la conoscenza e la consapevolezza di essere l'anima.</p>
        <p style="margin:0">Da qui si passa dall'essere dipendenti all'imparare a essere autonomi e interdipendenti: imparare che fuori dai lavori ordinari si può riscoprire la propria tendenza, si può riscoprire una maniera per rimettere ordine nella propria mente, nelle proprie abitudini, nelle proprie dipendenze, per poter poi ritrovare la comunità.</p>
        <p style="margin:0">E quella comunità è basata su dei fare specifici, che sono sempre esistiti, e che sono quelli che guardano all'autosufficienza: la produzione di alimenti naturali, l'attenzione alle relazioni, il fare sacro, la produzione di rimedi naturali, l'educazione che parte dagli insegnamenti tramandati per via orale.</p>
        <p style="margin:0">La Comunità Eterna è sempre esistita, è già attorno a noi. Semplicemente FelicitasMundi cerca di ricreare la connessione e potenziare questa comunità.</p>
      </div>
    </details>

    <details style="border-top:1px solid var(--line)">
      <summary style="display:flex;gap:0.7rem;padding:0.9rem 0.1rem;cursor:pointer;font-family:'Cinzel',serif;font-size:var(--t-cor);line-height:1.4;list-style:none">
        <span style="color:var(--oro)">›</span><span>Quanto costa?</span>
      </summary>
      <div style="padding:0 0.1rem 1.1rem 1.4rem;font-family:'Cormorant Garamond',serif;font-size:var(--t-cor);line-height:1.62;color:rgba(245,240,230,0.9);display:flex;flex-direction:column;gap:0.7rem;text-shadow:0 2px 14px rgba(2,4,12,0.95)">
        <p style="margin:0">Entrare e servire la comunità è gratuito, sempre. Leggi, scrivi in bacheca, dichiari un ruolo e ti metti all'opera. Hai gli strumenti per collegare la tua orma: i contatti che incontri, le idee e le note, i racconti, le testimonianze, i bisogni che apri, quello che scambi e quello che doni, le spese, le ore di lavoro, i link e gli obiettivi. Nell'emporio puoi offrire quello che fai in scambio o in dono. Questo non scade e non è una prova: è la porta che resta aperta.</p>
        <p style="margin:0">Il praticantato costa 26 € al mese, e lo compri quando vuoi, un mese alla volta. Non è un abbonamento che si rinnova da solo.</p>
        <p style="margin:0">Cosa apre.</p>
        <p style="margin:0">Il tuo cammino diventa registrabile. Il filo del percorso lo vedono tutti — le pratiche, i passaggi, i momenti del ciclo. Con il praticantato cominci a segnarlo: quello che fai lungo il filo resta scritto, ed è tuo.</p>
        <p style="margin:0">Il tuo progetto prende forma. Qui sei accompagnato nella focalizzazione del tuo talento, e in come seguire direzioni chiare per portare a termine la tua opera. Trovi gli strumenti di scrittura strutturata, utili per i prodotti, le formazioni e i progetti che porti nella comunità — con la stessa cura di una pagina stampata, senza saper programmare.</p>
        <p style="margin:0">Quello che offri diventa vendibile. Nell'emporio si apre la vendita, e la scheda del tuo prodotto si veste: capitoli, porte, stampa. Vale per ciò che produci, per l'assistenza che dai, per il tuo insegnamento, per la gestione del tuo luogo.</p>
        <p style="margin:0">Gli approfondimenti del cammino. Gli esercizi, i materiali, i contatti con chi tiene le classi, gli spazi di confronto.</p>
        <p style="margin:0">Il metodo per usare l'intelligenza artificiale in maniera consapevole, e la formazione per diventare operatore.</p>
        <p style="margin:0">E il team, da tre persone in su. 26 € a persona, minimo tre. Un team può essere il team di un vicinato, il team che organizza un incontro, un evento, un ritiro, un festival, oppure il team degli operatori di un territorio. Quello che cambia è che gli strumenti diventano condivisi: quello che uno segna, gli altri lo vedono.</p>
      </div>
    </details>

    <details style="border-top:1px solid var(--line)">
      <summary style="display:flex;gap:0.7rem;padding:0.9rem 0.1rem;cursor:pointer;font-family:'Cinzel',serif;font-size:var(--t-cor);line-height:1.4;list-style:none">
        <span style="color:var(--oro)">›</span><span>Dove siete?</span>
      </summary>
      <div style="padding:0 0.1rem 1.1rem 1.4rem;font-family:'Cormorant Garamond',serif;font-size:var(--t-cor);line-height:1.62;color:rgba(245,240,230,0.9);display:flex;flex-direction:column;gap:0.7rem;text-shadow:0 2px 14px rgba(2,4,12,0.95)">
        <p style="margin:0">FelicitasMundi come piattaforma nasce in Sardegna. L'azienda che ne gestisce l'aspetto amministrativo, commerciale e legale ha sede a Sassari.</p>
        <p style="margin:0">Ma la Comunità vive dove sei tu. La piattaforma è collegata e interconnessa a gruppi, circuiti e comunità dei territori, e in questo modo copre già una buona parte delle regioni italiane.</p>
        <p style="margin:0">Lo sviluppo dei vicinati ha oggi maggiore attenzione in Sardegna, Abruzzo, Emilia-Romagna, Toscana e Lombardia.</p>
        <p style="margin:0">Il gruppo di riferimento della cultura indovedica — gli Hare Krishna — è una parte fondamentale del progetto dal punto di vista filosofico, ed è presente in vari centri in tutta Italia: Firenze, Bergamo, Piacenza, Savona, Bologna, Roma.</p>
      </div>
    </details>

    <details style="border-top:1px solid var(--line)">
      <summary style="display:flex;gap:0.7rem;padding:0.9rem 0.1rem;cursor:pointer;font-family:'Cinzel',serif;font-size:var(--t-cor);line-height:1.4;list-style:none">
        <span style="color:var(--oro)">›</span><span>Posso fare volontariato in un vicinato?</span>
      </summary>
      <div style="padding:0 0.1rem 1.1rem 1.4rem;font-family:'Cormorant Garamond',serif;font-size:var(--t-cor);line-height:1.62;color:rgba(245,240,230,0.9);display:flex;flex-direction:column;gap:0.7rem;text-shadow:0 2px 14px rgba(2,4,12,0.95)">
        <p style="margin:0">Il modo in cui la piattaforma fa incontrare le persone è rendere visibili i bisogni: quelli dei singoli, quelli dei team, quelli dei vicinati. Ci sono gruppi che hanno bisogno di qualcuno che dia una mano nelle pulizie, nell'orto, nella gestione della comunicazione, nell'organizzare attività, nel produrre rimedi naturali.</p>
        <p style="margin:0">Si parte da lì: i vicinati raccontano i loro bisogni. Abbiamo bisogno di questo, e diamo in cambio ospitalità, vitto e alloggio, la possibilità di proporre le proprie esperienze e i propri prodotti.</p>
        <p style="margin:0">Chi si iscrive può intanto partecipare a questo scambio e a questo dono — e fra le cose che può fare c'è proprio quella di partecipare come volontario nei luoghi, e dare una mano ai vicinati. Si dichiara un ruolo, e si comincia. Gratuito, sempre. Chi serve appartiene.</p>
        <p style="margin:0">La particolarità però risiede in un'altra cosa. Con la tua orma, con il praticantato, con questa scuola di comunità fatta come un gioco, diamo la possibilità di percorrere un sentiero introspettivo che fa ordine nel caos. E questo aiuta proprio a livello di karma yoga, perché ti purifica nelle attitudini, nella comunicazione, nel modo in cui fai le cose — con attenzione, con buon senso.</p>
        <p style="margin:0">Così lavorare con l'altro permette sia al volontario sia a chi ospita di fare un lavoro introspettivo.</p>
        <p style="margin:0">E questo è il vero karma yoga, che poi si evolve quando questo servizio lo si dà in offerta alla coscienza cosmica, all'esistenza, a Dio.</p>
      </div>
    </details>

    <details style="border-top:1px solid var(--line)">
      <summary style="display:flex;gap:0.7rem;padding:0.9rem 0.1rem;cursor:pointer;font-family:'Cinzel',serif;font-size:var(--t-cor);line-height:1.4;list-style:none">
        <span style="color:var(--oro)">›</span><span>Come posso creare un vicinato nella mia zona?</span>
      </summary>
      <div style="padding:0 0.1rem 1.1rem 1.4rem;font-family:'Cormorant Garamond',serif;font-size:var(--t-cor);line-height:1.62;color:rgba(245,240,230,0.9);display:flex;flex-direction:column;gap:0.7rem;text-shadow:0 2px 14px rgba(2,4,12,0.95)">
        <p style="margin:0">Il vicinato è un progetto, e si fa entrando nel praticantato: guardi le cose che potresti fare, e fra quelle c'è lo sviluppo di un vicinato.</p>
        <p style="margin:0">Creare un vicinato significa prendere un gruppo di lavoro — magari già esistente — e formalizzarlo dentro uno strumento che gli dà quello che gli serve.</p>
        <p style="margin:0">Con quegli strumenti puoi ricevere contatti; tenere traccia delle idee e delle note; raccontare le esperienze che si vivono; ricevere le testimonianze di chi ti viene a trovare; mostrare i bisogni di quel vicinato; incentivare lo scambio e il dono fra vicinati e fra le persone che partecipano, anche online; avere una gestione più attenta delle spese e del piano economico; tenere nota delle ore di lavoro; e tenere traccia dei link — quelli che nascono sui social e su YouTube legati al tuo vicinato, e in generale i link di cose che possono essere utili, dalle ricette alimentari alla bioedilizia alle pratiche terapeutiche.</p>
        <p style="margin:0">E poi la cosa più importante: lo strumento ti aiuta a tenere traccia degli obiettivi e delle priorità — le priorità di sviluppo e gli obiettivi settimanali. Grazie a quegli obiettivi capisci anche di che cosa hai bisogno. E così le persone che possono chiedere di venire a darti una mano sanno che cosa ti serve davvero, e sanno cosa tu puoi mettere a disposizione.</p>
        <p style="margin:0">Creare un vicinato è creare un'intesa che tiene conto di tanti aspetti, messi insieme da un'unica piattaforma. E in più ti dà la possibilità di entrare nella programmazione radiofonica.</p>
      </div>
    </details>

    <details style="border-top:1px solid var(--line)">
      <summary style="display:flex;gap:0.7rem;padding:0.9rem 0.1rem;cursor:pointer;font-family:'Cinzel',serif;font-size:var(--t-cor);line-height:1.4;list-style:none">
        <span style="color:var(--oro)">›</span><span>Cosa trovo nella piattaforma?</span>
      </summary>
      <div style="padding:0 0.1rem 1.1rem 1.4rem;font-family:'Cormorant Garamond',serif;font-size:var(--t-cor);line-height:1.62;color:rgba(245,240,230,0.9);display:flex;flex-direction:column;gap:0.7rem;text-shadow:0 2px 14px rgba(2,4,12,0.95)">
        <p style="margin:0">FelicitasMundi è un catalizzatore di comunità che integra più aspetti: quello filosofico, legato alla coscienza cosmica e alla cultura indovedica, che si unisce alla metafisica e alle tradizioni tramandate dai popoli — da tutti i popoli. A un certo livello le realtà autoctone, le piccole comunità ancora resilienti, quelle che resistono, sono tutte collegate a modelli di vita che nella quotidianità, nell'uso degli strumenti, nel canto, nel mangiare in una certa maniera, riconducono alla stessa essenza.</p>
        <p style="margin:0">Con questa piattaforma cerchiamo di far vivere qualcosa che è trascendentale, già esistente, eterno: legato a una coscienza e a un senso di beatitudine — quello che in sanscrito si chiama Sat-Cit-Ananda.</p>
        <p style="margin:0">La radio. Sempre in onda: musica popolare, musica sacra, la musica di chi la condivide. Con una programmazione e appuntamenti destinati al racconto dei vicinati, ad approfondimenti sul proprio percorso interiore, ai cicli lunari, alle pratiche legate alla ruota dell'anno, alla diffusione delle conoscenze di chi ha uno strumento e vuole farlo circolare. Non un programma: una stazione radiofonica con più programmi, che si possono anche scaricare.</p>
        <p style="margin:0">La scuola di comunità. Ci si gioca attraverso l'orma: un'orma giornaliera che ti aiuta a vedere, mese dopo mese e ciclo lunare dopo ciclo lunare, la tua evoluzione, gli obiettivi raggiunti, l'interconnessione con tutta la rete.</p>
        <p style="margin:0">E da lì nasce cosa incontri — e incontri qualcosa che in parte partecipi a scrivere.</p>
        <p style="margin:0">L'emporio, con i prodotti che si trovano in dono e in scambio, e con i prodotti negli scaffali che si possono acquistare: alimentazione, libri, abbigliamento, oggettistica sacra, strumenti energetici, rimedi naturali. Anche chi arriva da fuori può comprare — farà il suo account, e da lì entra.</p>
        <p style="margin:0">I calendari dei vicinati. Le formazioni della scuola. E la disponibilità degli assistenti: in ambito spirituale, nel mutuo aiuto, e per consulenze e trattamenti con operatori e dottori abilitati e qualificati. Passiamo il contatto: da lì l'accordo è fra le persone, e ciascun professionista risponde della propria pratica.</p>
        <p style="margin:0">Questo è il macro mondo che richiamiamo, e che poi si vede dentro l'Annale di FelicitasMundi.</p>
      </div>
    </details>

    <details style="border-top:1px solid var(--line);border-bottom:1px solid var(--line)">
      <summary style="display:flex;gap:0.7rem;padding:0.9rem 0.1rem;cursor:pointer;font-family:'Cinzel',serif;font-size:var(--t-cor);line-height:1.4;list-style:none">
        <span style="color:var(--oro)">›</span><span>È adatto ai bambini?</span>
      </summary>
      <div style="padding:0 0.1rem 1.1rem 1.4rem;font-family:'Cormorant Garamond',serif;font-size:var(--t-cor);line-height:1.62;color:rgba(245,240,230,0.9);display:flex;flex-direction:column;gap:0.7rem;text-shadow:0 2px 14px rgba(2,4,12,0.95)">
        <p style="margin:0">Tutto questo progetto nasce come progetto educativo: educare l'umanità a una cultura che indirizza verso una civiltà che evolve.</p>
        <p style="margin:0">Questo indirizzo lo si può dare partendo proprio dai bambini, che hanno bisogno di esempi. E gli esempi li si danno con adulti che mostrano il buon senso, che mostrano il reciproco aiuto, che gioiscono con la musica e con il buon cibo — un cibo naturale, raccolto con le mani dopo essersene presi cura.</p>
        <p style="margin:0">Il bambino impara a prendersi cura dell'esistenza grazie ad adulti che hanno imparato a loro volta.</p>
        <p style="margin:0">È questa la Comunità Eterna.</p>
      </div>
    </details>
    </div>
    </div>
  </section>

  <!-- LA FORMULA — la chiusa, prima delle informazioni -->
  <section style="order:8;margin-top:3rem;min-width:0">
    <div class="sv-formula" id="svFormula">
      <div class="et">La formula</div>

      <div class="quadro" data-quadro>
        <div class="sopra" data-sopra></div>
        <div class="sotto" data-sotto>
          <div class="linea"></div>
          <div class="ego">falso ego</div>
        </div>
        <div class="ancora" data-ancora>tocca per rivedere</div>
      </div>
    </div>
  </section>

  <!-- IL PIEDE — si vede se lo cerchi. La veste è del guscio: .fm-piede, .fp-* -->
  <footer class="fm-piede" style="order:9;margin-top:3rem;padding-top:1.4rem;border-top:1px solid var(--line);text-align:center;min-width:0">
    <div class="fp-riga" style="font-family:'DM Sans',sans-serif;font-size:var(--t-eti);color:rgba(245,240,230,0.62);line-height:1.6">Felicitas Omnia S.r.l.s. &middot; P.IVA 03075740906</div>
    <nav class="fp-rotte" style="display:flex;gap:0.35rem 1.1rem;flex-wrap:wrap;justify-content:center;margin-top:0.5rem">
      <a class="fp-link" href="privacy.html" style="font-family:'DM Sans',sans-serif;font-size:var(--t-eti);color:rgba(245,240,230,0.62);text-decoration:none;line-height:1.6">Informativa privacy</a>
      <a class="fp-link" href="cookie.html" style="font-family:'DM Sans',sans-serif;font-size:var(--t-eti);color:rgba(245,240,230,0.62);text-decoration:none;line-height:1.6">Cookie</a>
      <a class="fp-link" href="condizioni.html" style="font-family:'DM Sans',sans-serif;font-size:var(--t-eti);color:rgba(245,240,230,0.62);text-decoration:none;line-height:1.6">Condizioni d&rsquo;uso</a>
    </nav>
  </footer>

</div>

`;

function home(c){
  c.innerHTML = CASA;
  avviaCasa();              /* ① il tempo, il cielo, il micelio, la mappa, la scheda del luogo */
  avviaSegniDellaLegenda(); /* ② i sette segni in comune — ⛔ PRIMA della giostra */
  avviaOrma();              /* ③ la prova dell'orma (il markup non c'è ancora: esce da sé) */
  avviaSoglia();            /* ④ la voce che gira */
  avviaOrmaViva();          /* ⑤ i dieci secondi che si ripetono */
  avviaCinque();            /* ⑥ i cinque quadranti */
  avviaFormula();           /* ⑦ la formula */
  avviaSoglieEMisure();     /* ⑧ ⛔ PER ULTIMA: l'occhio prende le funzioni già poste */
  segniDelleStanze();       /* i simboli della barra, per la scheda del contenuto */
  legaLuoghi();
  contaOrme();              /* il cenno delle orme vive nella barra, non nella casa */
  leOrme();                 /* le due schede: il dato entra nella forma, quando la forma torna */
}

/* ── ① il codice della casa, come l'ha scritto Design: non si tocca ──
   Il tempo e il cielo, il micelio, il libro della mappa, la scheda del
   luogo, i due tasti e il velo a due tempi. Nessuna mano sopra. */
function avviaCasa(){
(function () {
  "use strict";

  /* ① il tempo — il mese di quello che si sta guardando */
  var MESI = ["gennaio","febbraio","marzo","aprile","maggio","giugno","luglio",
              "agosto","settembre","ottobre","novembre","dicembre"];
  var ora = new Date();
  var eMese = document.getElementById("sv-mese");
  if (eMese) eMese.textContent = MESI[ora.getMonth()] + " " + ora.getFullYear();
  var eGiorno = document.getElementById("sv-giorno");
  if (eGiorno) eGiorno.textContent = ora.getDate() + " " + MESI[ora.getMonth()];

  /* ② il cielo — la luna di oggi, ciclo sinodico 29.530588853 */
  var SINODICO = 29.530588853;
  var NUOVA = Date.UTC(2000, 0, 6, 18, 14);
  var f = (((ora.getTime() - NUOVA) / 86400000) / SINODICO) % 1;
  if (f < 0) f += 1;
  var r = 15, cos = Math.cos(2 * Math.PI * f), rx = Math.abs(cos) * r;
  var s1 = f < 0.5 ? 1 : 0;
  var s2 = cos > 0 ? s1 : 1 - s1;
  var eLuna = document.getElementById("sv-luna");
  if (eLuna) eLuna.setAttribute("d",
    "M20 " + (20 - r) + " A " + r + " " + r + " 0 0 " + s1 + " 20 " + (20 + r) +
    " A " + rx.toFixed(2) + " " + r + " 0 0 " + s2 + " 20 " + (20 - r));

  /* ② il micelio del cappello: filamenti che si ramificano dai bordi,
        e un nodo di luce a ogni bivio. Fermo per chi ha il movimento ridotto. */
  (function () {
    var cv = document.getElementById("sv-rete0");
    if (!cv || !cv.getContext) return;
    var cx = cv.getContext("2d");
    var W = 0, H = 0, fili = [], nodi = [], t = 0;
    var fermo = (window.matchMedia && window.matchMedia("(max-width: 40rem)").matches) ||
                (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

    function semina() {
      fili = []; nodi = [];
      var radici = Math.max(4, Math.round(W / 190));
      for (var i = 0; i < radici; i++) {
        var da = Math.random() < 0.5;
        var x = da ? (Math.random() < 0.5 ? -10 : W + 10) : Math.random() * W;
        var y = da ? Math.random() * H : (Math.random() < 0.5 ? -10 : H + 10);
        var ang = Math.atan2(H / 2 - y, W / 2 - x) + (Math.random() - 0.5) * 1.1;
        rama(x, y, ang, 42 + Math.random() * 34, 0);
      }
    }

    /* un filamento cresce, si piega, e a un certo punto si divide in due */
    function rama(x, y, ang, lung, gen) {
      if (gen > 4 || lung < 9) return;
      var passi = Math.max(4, Math.round(lung / 7));
      var punti = [[x, y]];
      for (var i = 0; i < passi; i++) {
        ang += (Math.random() - 0.5) * 0.62;
        x += Math.cos(ang) * (lung / passi);
        y += Math.sin(ang) * (lung / passi);
        punti.push([x, y]);
      }
      fili.push({ punti: punti, gen: gen, f: 0.5 + Math.random() * 0.8, s: Math.random() * 6.3 });
      nodi.push({ x: x, y: y, r: Math.max(0.7, 2.4 - gen * 0.42),
                  f: 0.35 + Math.random() * 0.7, s: Math.random() * 6.3 });
      var quanti = gen < 2 ? 2 : (Math.random() < 0.72 ? 2 : 1);
      for (var k = 0; k < quanti; k++) {
        rama(x, y, ang + (k === 0 ? 0.52 : -0.52) + (Math.random() - 0.5) * 0.42,
             lung * (0.6 + Math.random() * 0.2), gen + 1);
      }
    }

    function misura() {
      var r = cv.parentNode.getBoundingClientRect();
      var d = window.devicePixelRatio || 1;
      W = r.width; H = r.height;
      if (!W || !H) return;
      cv.width = W * d; cv.height = H * d;
      cx.setTransform(d, 0, 0, d, 0, 0);
      semina();
      disegna();
    }

    function disegna() {
      if (!W || !H) return;
      if (!fermo) t += 0.005;
      cx.clearRect(0, 0, W, H);

      cx.lineCap = "round";
      fili.forEach(function (f) {
        var onda = fermo ? 0.75 : 0.5 + 0.5 * Math.sin(t * f.f + f.s);
        cx.strokeStyle = "rgba(200,160,85," + (0.30 - f.gen * 0.045).toFixed(3) + ")";
        cx.lineWidth = Math.max(0.4, 1.5 - f.gen * 0.3);
        cx.globalAlpha = 0.55 + onda * 0.45;
        cx.beginPath();
        cx.moveTo(f.punti[0][0], f.punti[0][1]);
        for (var i = 1; i < f.punti.length; i++) cx.lineTo(f.punti[i][0], f.punti[i][1]);
        cx.stroke();
      });
      cx.globalAlpha = 1;

      nodi.forEach(function (n) {
        var battito = fermo ? 0.6 : 0.5 + 0.5 * Math.sin(t * n.f * 2 + n.s);
        var rr = n.r * (0.85 + battito * 0.45);
        var g = cx.createRadialGradient(n.x, n.y, 0, n.x, n.y, rr * 5);
        g.addColorStop(0, "rgba(212,175,106," + (0.45 + battito * 0.35).toFixed(3) + ")");
        g.addColorStop(1, "rgba(200,160,85,0)");
        cx.fillStyle = g;
        cx.beginPath(); cx.arc(n.x, n.y, rr * 5, 0, Math.PI * 2); cx.fill();
        cx.fillStyle = "rgba(245,240,230," + (0.3 + battito * 0.4).toFixed(3) + ")";
        cx.beginPath(); cx.arc(n.x, n.y, rr, 0, Math.PI * 2); cx.fill();
      });

      if (!fermo) requestAnimationFrame(disegna);
    }

    window.addEventListener("resize", misura);
    misura();
  })();

  /* ③ la rete dietro il vetro. Ferma per chi ha il movimento ridotto. */
  (function () {
    var fondali = [];
    var t = 0;
    var stretto = window.matchMedia && window.matchMedia("(max-width: 40rem)").matches;
    var fermo = stretto || (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    ["sv-rete", "sv-rete2", "sv-rete3"].forEach(function (id) {
      var cv = document.getElementById(id);
      if (cv && cv.getContext) fondali.push({ cv: cv, cx: cv.getContext("2d"), W: 0, H: 0, punti: [] });
    });
    if (!fondali.length) return;

    function semina(f) {
      f.punti = [];
      var quanti = Math.min(90, Math.max(26, Math.round(f.W * f.H / 9000)));
      for (var i = 0; i < quanti; i++) f.punti.push({
        x: Math.random() * f.W, y: Math.random() * f.H,
        vx: (Math.random() - 0.5) * 0.14, vy: (Math.random() - 0.5) * 0.14,
        r: 0.9 + Math.random() * 1.5,
        f: 0.4 + Math.random() * 0.9,
        s: Math.random() * Math.PI * 2
      });
    }

    function misura() {
      var d = window.devicePixelRatio || 1;
      fondali.forEach(function (f) {
        var r = f.cv.parentNode.getBoundingClientRect();
        f.W = r.width; f.H = r.height;
        f.cv.width = f.W * d; f.cv.height = f.H * d;
        f.cx.setTransform(d, 0, 0, d, 0, 0);
        semina(f);
      });
      if (fermo) disegna();
    }

    function disegna() {
      if (!fermo) t += 0.006;
      fondali.forEach(function (f) { unFondale(f); });
      if (!fermo) requestAnimationFrame(disegna);
    }

    function unFondale(f) {
      var cx = f.cx, punti = f.punti, W = f.W, H = f.H;
      cx.clearRect(0, 0, W, H);

      for (var i = 0; i < punti.length; i++) {
        var a = punti[i];
        for (var j = i + 1; j < punti.length; j++) {
          var b = punti[j];
          var dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy;
          if (d2 < 20000) {
            var op = (1 - d2 / 20000) * 0.30;
            var onda = fermo ? 0.8 : 0.55 + 0.45 * Math.sin(t * 1.6 + (a.x + a.y) * 0.006);
            cx.strokeStyle = "rgba(200,160,85," + (op * onda).toFixed(3) + ")";
            cx.lineWidth = 0.6;
            cx.beginPath(); cx.moveTo(a.x, a.y); cx.lineTo(b.x, b.y); cx.stroke();
          }
        }
      }

      for (var k = 0; k < punti.length; k++) {
        var p = punti[k];
        var battito = fermo ? 0.6 : 0.5 + 0.5 * Math.sin(t * p.f * 2 + p.s);
        var rr = p.r * (0.8 + battito * 0.5);
        var g = cx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rr * 5);
        g.addColorStop(0,   "rgba(212,175,106," + (0.5 + battito * 0.4).toFixed(3) + ")");
        g.addColorStop(0.4, "rgba(200,160,85,"  + (0.12 + battito * 0.1).toFixed(3) + ")");
        g.addColorStop(1,   "rgba(200,160,85,0)");
        cx.fillStyle = g;
        cx.beginPath(); cx.arc(p.x, p.y, rr * 5, 0, Math.PI * 2); cx.fill();
        cx.fillStyle = "rgba(245,240,230," + (0.35 + battito * 0.45).toFixed(3) + ")";
        cx.beginPath(); cx.arc(p.x, p.y, rr, 0, Math.PI * 2); cx.fill();
        if (!fermo) {
          p.x += p.vx; p.y += p.vy;
          if (p.x < -20) p.x = W + 20; if (p.x > W + 20) p.x = -20;
          if (p.y < -20) p.y = H + 20; if (p.y > H + 20) p.y = -20;
        }
      }
    }

    window.addEventListener("resize", misura);
    misura();
    if (!fermo) disegna();
  })();

  /* ④ la scheda del luogo. NESSUN DATO QUI: la forma si riempie da sé.
        Il guscio (o la mappa) chiama window.SpazioVivo.mostraLuogo(record).
        I DUE TASTI sotto la mappa: «Come funziona» porta sempre a
     come-funziona.html; «Il tuo spazio» pure, finché il guscio non dice
     che si è dentro — window.SpazioVivo.dentro(rottaDellOrma), e
     window.SpazioVivo.fuori() lo riporta alla prima volta.

     IL QUADRANTE DELLA MAPPA — legenda, formula, pratica:
       · window.SpazioVivo.mappaLegenda({simboli:[{segno,nome,cosa}],
                                         pratica:[{nome,riga}]})
       · la formula è fissa e sta nel disegno: non cambia, non arriva da fuori

     I DUE TEMPI DEL VELO — dentro il libro la mappa si sposta, ma non sempre:
       · col MOUSE il trascinamento prende subito, senza attesa
       · col DITO prende solo dopo 320 ms di pressione, e un filo d'oro attorno
         al riquadro lo dice; prima di quell'attimo il dito scorre la pagina
       · un trascinamento non apre la mappa: il tocco breve sì
     Serve perché sul telefono, senza i due tempi, la pagina sotto smette di
     scorrere e la persona resta incastrata sulla mappa.

     LA PROVA DELL'ORMA, sotto la mappa: si scrive prima di capire.
       · window.SpazioVivo.ultimeOrme([{testo, chi, dove, elemento, rotta}])
         elemento: terra · acqua · fuoco · aria · etere — dà il colore e la stanza
       · window.SpazioVivo.ormaScritta() restituisce {testo, tipi} quando serve
       · gli strumenti lanciano 'spazio-vivo:orma-attrezzo' con {attrezzo, testo}
       Senza orme dal dato resta [ in attesa ]: nessun testo è scritto qui.

     LA VIA DI RITORNO, quando si entra nella mappa da una porta:
       · window.SpazioVivo.porta({nome, torna})  — mostra il tasto discreto
       · window.SpazioVivo.chiudiPorta()         — lo toglie
       · senza 'torna' il tasto lancia l'evento 'spazio-vivo:torna'
       · dalla mappa in iframe: postMessage({q:"porta", porta:{nome}})

     LA SCHEDA DEL CONTENUTO, sotto la mappa — anch'essa forma vuota:
       · window.SpazioVivo.mostraContenuto(record, 1|2)
       · record: { radice, radiceNome, foto, cosa:[prima,seconda], titolo,
                   sottotitolo, chi, quando, collegatoDa,
                   stanze:[{segno,nome}] }   — da una a cinque stanze
       · radice e segno sono i sette della legenda: orma, connessione,
         talenti, vicinato, ritmo, incontro, tempio

     Il record: { segno, occhiello, nome, luogo, descrizione, foto,
                     elementi: [ { chiave, nome, colore, quante,
                                   righe: [ { testo, etichetta, valore, foto } ] } ] }
        Niente nel record? Il posto resta e si legge lo stesso. */
  (function () {
    var sk     = document.getElementById("sv-scheda");
    if (!sk) return;
    var foto   = document.getElementById("sv-sk-foto");
    var occ    = document.getElementById("sv-sk-occ");
    var nome   = document.getElementById("sv-sk-nome");
    var luogo  = document.getElementById("sv-sk-luogo");
    var desc   = document.getElementById("sv-sk-desc");
    var simb   = document.getElementById("sv-sk-simboli");
    var dentro = document.getElementById("sv-sk-dentro");
    var chiudi = document.getElementById("sv-sk-chiudi");
    var ATTESA = "[ in attesa ]";
    var corta  = true;   /* dentro il libro la scheda è la forma breve */

    var vuoto = function (v) { return v === undefined || v === null || v === ""; };
    var testo = function (v) { return vuoto(v) ? ATTESA : String(v); };

    function svuota(n) { while (n.firstChild) n.removeChild(n.firstChild); }

    function pastiglia(el, iSu, quando) {
      var b = document.createElement("button");
      b.type = "button";
      b.style.cssText = "display:flex;align-items:center;gap:0.45rem;border:1px solid " +
        (iSu ? "currentColor" : "var(--line)") + ";border-radius:999px;padding:0.4rem 0.8rem;cursor:pointer;" +
        "background:" + (iSu ? "rgba(245,240,230,0.07)" : "none") + ";font-family:'DM Sans',sans-serif;" +
        "font-size:var(--t-eti);color:" + (el.colore || "var(--oro-ch)");
      var et = document.createElement("span");
      et.style.color = "rgba(245,240,230,0.86)";
      et.textContent = testo(el.nome);
      b.appendChild(et);
      var n = document.createElement("span");   /* il numero è la ragione per cui si tocca */
      n.style.cssText = "font-family:'Cinzel',serif;font-size:var(--t-eti);color:currentColor";
      n.textContent = vuoto(el.quante) ? (el.righe ? el.righe.length : 0) : el.quante;
      b.appendChild(n);
      b.addEventListener("click", quando);
      return b;
    }

    function unaRiga(r) {
      var d = document.createElement("div");
      d.style.cssText = "display:flex;gap:0.7rem;align-items:center;padding:0.65rem 0;" +
        "border-top:1px solid rgba(184,150,62,0.11);font-size:var(--t-eti);color:rgba(245,240,230,0.9);min-width:0";
      if (r.foto) {
        var im = document.createElement("div");
        im.style.cssText = "flex:0 0 2.4rem;height:3rem;border-radius:0.3rem;overflow:hidden;border:1px solid var(--line);background:rgba(245,240,230,0.05)";
        var g = document.createElement("img");
        g.src = r.foto; g.alt = ""; g.style.cssText = "width:100%;height:100%;object-fit:cover";
        im.appendChild(g); d.appendChild(im);
      }
      var tx = document.createElement("div");
      tx.style.cssText = "flex:1;min-width:0;line-height:1.45";
      tx.appendChild(document.createTextNode(testo(r.testo)));
      if (!vuoto(r.etichetta)) {
        var em = document.createElement("em");
        em.style.cssText = "display:block;font-style:normal;color:rgba(245,240,230,0.6);font-size:var(--t-eti);margin-top:0.15rem";
        em.textContent = r.etichetta;
        tx.appendChild(em);
      }
      d.appendChild(tx);
      if (!vuoto(r.valore)) {          /* prezzo, talenti, data — o niente */
        var pz = document.createElement("div");
        pz.style.cssText = "flex:none;color:var(--oro-ch);font-family:'Cinzel',serif";
        pz.textContent = r.valore;
        d.appendChild(pz);
      }
      return d;
    }

    /* La stanza c'è solo se il guscio l'ha dichiarata: senza, il tasto
       non si offre. Un tasto che non porta da nessuna parte fa pensare
       che sia rotta la piattaforma, non il tasto. */
    function stanzaAperta() {
      return !!(window.SpazioVivo &&
        (typeof window.SpazioVivo.vediTutto === "function" ||
         window.SpazioVivo.stanzeAperte === true));
    }

    function tastoVedi(el, rec) {
      if (!stanzaAperta()) return null;
      var b = document.createElement("button");
      b.type = "button";
      b.style.cssText = "display:inline-block;margin-top:0.8rem;font-family:'DM Sans',sans-serif;font-size:var(--t-eti);" +
        "color:var(--oro-ch);border:1px solid rgba(200,160,85,0.4);border-radius:999px;padding:0.45rem 1rem;cursor:pointer;background:none";
      b.textContent = "vedi tutto →";
      b.addEventListener("click", function () {   /* l'unica cosa che esce */
        if (window.SpazioVivo && typeof window.SpazioVivo.vediTutto === "function") {
          window.SpazioVivo.vediTutto({ luogo: rec, elemento: el });
          return;
        }
        document.dispatchEvent(new CustomEvent("spazio-vivo:vedi-tutto", { detail: { luogo: rec, elemento: el } }));
      });
      return b;
    }

    function invito(parole) {
      var v = document.createElement("div");
      v.style.cssText = "font-family:'Cormorant Garamond',serif;font-style:italic;color:rgba(245,240,230,0.5);font-size:var(--t-eti);padding:0.7rem 0";
      v.textContent = parole;
      return v;
    }

    function mostra(rec, opzioni) {
      rec = rec || {};
      corta = !(opzioni && opzioni.piena);

      svuota(foto);
      if (rec.foto) {
        var g = document.createElement("img");
        g.src = rec.foto; g.alt = ""; g.style.cssText = "width:100%;height:100%;object-fit:cover";
        foto.appendChild(g);
      } else {
        foto.textContent = ATTESA;      /* se manca, il posto resta */
      }

      occ.textContent   = testo(rec.occhiello);
      nome.textContent  = testo(rec.nome);
      luogo.textContent = testo(rec.luogo);

      var d = testo(rec.descrizione);
      desc.textContent = d;
      desc.style.display = "";
      desc.style.webkitLineClamp = corta ? "2" : "";
      desc.style.display = corta ? "-webkit-box" : "block";
      desc.style.webkitBoxOrient = "vertical";
      desc.style.overflow = corta ? "hidden" : "";

      svuota(simb); svuota(dentro);
      var elementi = rec.elementi || [];

      if (corta) {                      /* dalla home: lo stesso record, mostrato meno */
        simb.style.display = "none";
        var v0 = tastoVedi(null, rec); if (v0) dentro.appendChild(v0);
      } else {
        simb.style.display = elementi.length ? "flex" : "none";
        elementi.forEach(function (el) {
          var b = pastiglia(el, false, function () {
            var eraSu = b.getAttribute("data-su") === "1";
            [].forEach.call(simb.children, function (x) {
              x.setAttribute("data-su", "0");
              x.style.borderColor = "var(--line)";
              x.style.background = "none";
            });
            svuota(dentro);
            if (eraSu) { dentro.appendChild(invito("Tocca un simbolo per vedere cosa c'è.")); return; }
            b.setAttribute("data-su", "1");
            b.style.borderColor = "currentColor";
            b.style.background = "rgba(245,240,230,0.07)";
            var righe = el.righe || [];
            if (!righe.length) { dentro.appendChild(invito(ATTESA)); }
            else righe.forEach(function (r) { dentro.appendChild(unaRiga(r)); });
            var v1 = tastoVedi(el, rec);   /* i simboli non portano via */
            if (v1) dentro.appendChild(v1);
          });
          simb.appendChild(b);
        });
        dentro.appendChild(invito(elementi.length ? "Tocca un simbolo per vedere cosa c'è." : ATTESA));
      }

      sk.style.transform = "translateY(0)";
      sk.setAttribute("aria-hidden", "false");
    }

    function nascondi() {
      sk.style.transform = "translateY(100%)";
      sk.setAttribute("aria-hidden", "true");
    }

    chiudi.addEventListener("click", function (e) { e.stopPropagation(); nascondi(); });
    sk.addEventListener("pointerdown", function (e) { e.stopPropagation(); });

    /* la mappa dice quale punto è stato toccato */
    window.addEventListener("message", function (e) {
      var d = e.data;
      if (d && d.q === "luogo") mostra(d.luogo, { piena: !!d.piena });
      if (d && d.q === "chiudi-luogo") nascondi();
    });

    window.SpazioVivo = window.SpazioVivo || {};
    window.SpazioVivo.mostraLuogo  = mostra;
    window.SpazioVivo.chiudiLuogo  = nascondi;
    /* la forma di un punto, per chi disegna la mappa: il segno arriva dal dato */
    window.SpazioVivo.formaPunto = function (segnoSvg, nomeLuogo) {
      return '<div style="position:absolute;transform:translate(-50%,-50%);width:2.1rem;height:2.1rem;' +
        'display:grid;place-items:center;cursor:pointer">' +
        '<span style="position:absolute;inset:0;border-radius:50%;background:radial-gradient(circle,rgba(200,160,85,0.34),transparent 68%);animation:sv-respira 3.4s ease-in-out infinite"></span>' +
        '<span style="position:relative;width:1.3rem;height:1.3rem;color:var(--oro-ch);filter:drop-shadow(0 0 6px rgba(200,160,85,0.6))">' + (segnoSvg || "") + '</span>' +
        '<span style="position:absolute;top:1.6rem;white-space:nowrap;font-family:\'DM Sans\',sans-serif;font-size:var(--t-eti);' +
        'color:rgba(245,240,230,0.86);text-shadow:0 2px 8px rgba(2,4,12,0.95);pointer-events:none">' + (nomeLuogo || "[ in attesa ]") + '</span></div>';
    };
  })();

  /* ⑤ la via di ritorno. Chi entra nella mappa da una porta può tornare
        al contenuto da cui è arrivato: il tasto riporta, non trattiene.
        Il guscio la dichiara con window.SpazioVivo.porta({nome, torna}),
        e la toglie con window.SpazioVivo.chiudiPorta(). */
  (function () {
    var b = document.getElementById("sv-ritorno");
    if (!b) return;
    var et = document.getElementById("sv-ritorno-nome");
    var da = null;

    function porta(d) {
      da = d || {};
      et.textContent = (da.nome === undefined || da.nome === null || da.nome === "") ? "[ in attesa ]" : String(da.nome);
      b.hidden = false;
      b.style.display = "inline-flex";
    }

    function chiudiPorta() { da = null; b.hidden = true; b.style.display = "none"; }

    b.addEventListener("pointerdown", function (e) { e.stopPropagation(); });
    b.addEventListener("click", function (e) {
      e.stopPropagation();
      if (da && typeof da.torna === "function") { da.torna(); return; }
      document.dispatchEvent(new CustomEvent("spazio-vivo:torna", { detail: da || {} }));
    });

    window.addEventListener("message", function (e) {
      var d = e.data;
      if (d && d.q === "porta") porta(d.porta || d);
      if (d && d.q === "chiudi-porta") chiudiPorta();
    });

    window.SpazioVivo = window.SpazioVivo || {};
    window.SpazioVivo.porta = porta;
    window.SpazioVivo.chiudiPorta = chiudiPorta;
  })();

  /* ⑦ i due tasti sotto la mappa. Chi non è ancora entrato finisce sempre
        in «Come funziona»; chi è dentro va diretto alla propria orma.
        Il guscio lo dichiara con window.SpazioVivo.dentro(rottaDellOrma). */
  (function () {
    var b = document.getElementById("sv-spazio");
    if (!b) return;
    var PRIMA = "come-funziona.html";

    function dentro(rotta) {
      b.setAttribute("href", (rotta === undefined || rotta === null || rotta === "") ? PRIMA : String(rotta));
    }
    function fuori() { b.setAttribute("href", PRIMA); }

    window.SpazioVivo = window.SpazioVivo || {};
    window.SpazioVivo.dentro = dentro;
    window.SpazioVivo.fuori  = fuori;
  })();

  /* ⑧ il libro: i tasti stringono e allargano, il trascinamento sposta,
        il tocco breve chiede al guscio di aprire la mappa.
        Col MOUSE si trascina subito. Col DITO solo dopo un attimo di pressione,
        altrimenti il dito continua a scorrere la pagina. */
  var telaio = document.getElementById("sv-mappa");
  var velo   = document.getElementById("sv-velo");
  var filo   = document.getElementById("sv-filo");
  var meno   = document.getElementById("sv-meno");
  var piu    = document.getElementById("sv-piu");

  var parla = function (m) {
    if (telaio && telaio.contentWindow) telaio.contentWindow.postMessage(m, "*");
  };

  if (meno) meno.addEventListener("click", function (e) { e.stopPropagation(); parla("meno"); });
  if (piu)  piu.addEventListener("click",  function (e) { e.stopPropagation(); parla("piu"); });

  if (velo) {
    var ATTESA = 320, SOGLIA = 8;
    var t = null, x0 = 0, y0 = 0, x = 0, y = 0, preso = false, salta = false, mosso = 0;

    var prendi = function () {
      preso = true;
      velo.style.touchAction = "none";
      if (filo) filo.style.opacity = "1";
    };

    var molla = function () {
      clearTimeout(t); t = null;
      if (preso) {
        preso = false;
        if (mosso > SOGLIA) salta = true;
        velo.style.touchAction = "pan-y";
        if (filo) filo.style.opacity = "0";
      }
    };

    velo.addEventListener("pointerdown", function (e) {
      x0 = x = e.clientX; y0 = y = e.clientY; mosso = 0;
      try { velo.setPointerCapture(e.pointerId); } catch (_) {}
      if (e.pointerType === "mouse") {
        prendi();                       /* il mouse prende subito */
        if (filo) filo.style.opacity = "0";
      } else {
        t = setTimeout(prendi, ATTESA); /* il dito, dopo un attimo, e il filo lo dice */
      }
    });

    velo.addEventListener("pointermove", function (e) {
      var dx = e.clientX - x, dy = e.clientY - y;
      if (preso) {
        e.preventDefault();
        mosso += Math.abs(dx) + Math.abs(dy);
        parla({ q: "sposta", dx: dx, dy: dy });
        x = e.clientX; y = e.clientY;
      } else if (Math.abs(e.clientX - x0) > SOGLIA || Math.abs(e.clientY - y0) > SOGLIA) {
        clearTimeout(t);                /* il dito sta scorrendo la pagina: si lascia stare */
      }
    });

    ["pointerup", "pointercancel", "pointerleave"].forEach(function (q) {
      velo.addEventListener(q, molla);
    });

    velo.addEventListener("click", function () {
      if (salta) { salta = false; return; }
      if (window.SpazioVivo && typeof window.SpazioVivo.apriMappa === "function") {
        window.SpazioVivo.apriMappa();
      } else {
        document.dispatchEvent(new CustomEvent("spazio-vivo:apri-mappa"));
      }
    });
  }
})();
}

/* ── ② i sette segni della legenda ──
   ⭐ QUESTO FOGLIO ERA STATO TOLTO NEI DUE GIRI PRECEDENTI, e torna.
      Il quadrante della legenda non c'è ancora — `data-leg`, `data-riga`,
      `data-pr` e `.sv-mleg` sono zero nel corpo del disegno — ma la sua
      ultima riga mette i sette segni in comune su SpazioVivo.segni, e da
      lì li prende la giostra di «Simboli dell'esperienza». Senza, quel
      cerchio resta vuoto.
   ⛔ VA CHIAMATA PRIMA di avviaSoglieEMisure().
   ⚠️ Il resto gira a vuoto e non rompe niente: riempi({}) è guardata. */
function avviaSegniDellaLegenda(){
(function () {
  "use strict";

  var ATTESA = "[ in attesa ]";
  var vuoto = function (v) { return v === undefined || v === null || v === ""; };
  var testo = function (v) { return vuoto(v) ? ATTESA : String(v); };
  function svuota(n) { while (n && n.firstChild) n.removeChild(n.firstChild); }

  var SEGNI = {
    orma:'<path d="M24.5 20C24.5 22.54 22.54 24.5 20 24.5C17.46 24.5 15.5 22.54 15.5 20C15.5 17.46 17.46 15.5 20 15.5C22.54 15.5 24.5 17.46 24.5 20Z"/><path d="M31 20C31 26.21 26.21 31 20 31C13.79 31 9 26.21 9 20C9 13.79 13.79 9 20 9C26.21 9 31 13.79 31 20Z"/>',
    connessione:'<path d="M14 20C14 22.26 12.26 24 10 24C7.74 24 6 22.26 6 20C6 17.74 7.74 16 10 16C12.26 16 14 17.74 14 20Z"/><path d="M34 20C34 22.26 32.26 24 30 24C27.74 24 26 22.26 26 20C26 17.74 27.74 16 30 16C32.26 16 34 17.74 34 20Z"/><path d="M14 20L26 20"/>',
    talenti:'<circle cx="20" cy="20" r="14"/><circle cx="20" cy="20" r="11.2"/><path d="M20 12.5 L26 15.7 L26 24.3 L20 27.5 L14 24.3 L14 15.7 Z"/><path d="M20 12.5 L20 20 M20 20 L26 15.7 M20 20 L14 15.7 M20 20 L20 27.5"/>',
    vicinato:'<path d="M23.4 10C23.4 11.92 21.92 13.4 20 13.4C18.08 13.4 16.6 11.92 16.6 10C16.6 8.08 18.08 6.6 20 6.6C21.92 6.6 23.4 8.08 23.4 10Z"/><path d="M13.9 27C13.9 28.92 12.42 30.4 10.5 30.4C8.58 30.4 7.1 28.92 7.1 27C7.1 25.08 8.58 23.6 10.5 23.6C12.42 23.6 13.9 25.08 13.9 27Z"/><path d="M32.9 27C32.9 28.92 31.42 30.4 29.5 30.4C27.58 30.4 26.1 28.92 26.1 27C26.1 25.08 27.58 23.6 29.5 23.6C31.42 23.6 32.9 25.08 32.9 27Z"/><path d="M20 13.4L20 19M13 25.2L17.4 20.8M27 25.2L22.6 20.8"/><path d="M22 20C22 21.13 21.13 22 20 22C18.87 22 18 21.13 18 20C18 18.87 18.87 18 20 18C21.13 18 22 18.87 22 20Z" fill="currentColor" stroke="none"/>',
    ritmo:'<path d="M33 20C33 27.33 27.33 33 20 33C12.67 33 7 27.33 7 20C7 12.67 12.67 7 20 7C27.33 7 33 12.67 33 20Z"/><path d="M22.4 7C22.4 8.35 21.35 9.4 20 9.4C18.65 9.4 17.6 8.35 17.6 7C17.6 5.65 18.65 4.6 20 4.6C21.35 4.6 22.4 5.65 22.4 7Z" fill="currentColor" stroke="none"/><path d="M33.7 26.5C33.7 27.85 32.65 28.9 31.3 28.9C29.95 28.9 28.9 27.85 28.9 26.5C28.9 25.15 29.95 24.1 31.3 24.1C32.65 24.1 33.7 25.15 33.7 26.5Z" fill="currentColor" stroke="none"/><path d="M11.1 26.5C11.1 27.85 10.05 28.9 8.7 28.9C7.35 28.9 6.3 27.85 6.3 26.5C6.3 25.15 7.35 24.1 8.7 24.1C10.05 24.1 11.1 25.15 11.1 26.5Z" fill="currentColor" stroke="none"/><path d="M23.2 20C23.2 21.81 21.81 23.2 20 23.2C18.19 23.2 16.8 21.81 16.8 20C16.8 18.19 18.19 16.8 20 16.8C21.81 16.8 23.2 18.19 23.2 20Z"/>',
    incontro:'<path d="M23 20C23 25.08 19.08 29 14 29C8.92 29 5 25.08 5 20C5 14.92 8.92 11 14 11C19.08 11 23 14.92 23 20Z"/><path d="M35 20C35 25.08 31.08 29 26 29C20.92 29 17 25.08 17 20C17 14.92 20.92 11 26 11C31.08 11 35 14.92 35 20Z"/><path d="M20 12.9C22 17.63 22 22.37 20 27.1C18 22.37 18 17.63 20 12.9Z"/>',
    tempio:'<path d="M4 14L20 5L36 14Z"/><path d="M5 16.5L35 16.5M8.5 19L8.5 31M16 19L16 31M24 19L24 31M31.5 19L31.5 31M5 33.5L35 33.5"/><path d="M20 29.5C17.67 26.83 17.33 23.67 19 20C19.4 22.27 20 23.6 20.8 24C22.13 22.8 22.63 21.47 22.3 20C23.97 22.67 24.37 25.07 23.5 27.2C22.9 28.47 21.73 29.23 20 29.5Z" fill="currentColor" stroke="none"/>'
  };

  /* i tre segni della pratica, per chi li vuole anche in legenda */
  [].forEach.call(document.querySelectorAll(".sv-mleg .pr"), function (p) {
    var chiavi = ["intreccio", "lavagna", "micelio"];
    SEGNI[chiavi[+p.getAttribute("data-pr")]] = p.querySelector("svg").innerHTML;
  });

  function disegna(chiave) {
    var d = SEGNI[chiave];
    if (!d) return null;
    var vb = ["intreccio", "lavagna", "micelio"].indexOf(chiave) >= 0
      ? "0 0 60 60" : "0 0 40 40";
    var s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    s.setAttribute("viewBox", vb);
    s.setAttribute("fill", "none");
    s.setAttribute("stroke", "currentColor");
    s.setAttribute("stroke-width", "1.4");
    s.setAttribute("stroke-linecap", "round");
    s.setAttribute("stroke-linejoin", "round");
    s.innerHTML = d;
    return s;
  }

  function riempi(dati) {
    dati = dati || {};

    /* i simboli: la legenda disegnata resta al suo posto finché non arriva un dato */
    var box = document.querySelector(".sv-casa [data-leg]")
           || document.getElementById("sv-mleg-simboli");
    var simboli = dati.simboli || [];
    if (box && simboli.length) {
      svuota(box);
      simboli.forEach(function (s) {
        var e = document.createElement("div");
        e.style.cssText = "display:grid;grid-template-columns:2.9rem minmax(0,1fr);" +
          "gap:0.8rem;align-items:center;min-width:0";
        var sg = document.createElement("span");
        sg.style.cssText = "width:2.4rem;height:2.4rem;color:var(--oro-ch)";
        var ic = disegna(s.segno);
        if (ic) { ic.style.cssText = "width:100%;height:100%;display:block"; sg.appendChild(ic); }
        e.appendChild(sg);
        var tx = document.createElement("span");
        tx.style.minWidth = "0";
        var n = document.createElement("b");
        n.style.cssText = "display:block;font-size:var(--t-tas);font-weight:500;" +
          "line-height:1.25;text-shadow:0 2px 14px rgba(2,4,12,0.95)";
        n.textContent = testo(s.nome);
        tx.appendChild(n);
        var q = document.createElement("i");
        q.style.cssText = "display:block;font-family:'Cormorant Garamond',serif;" +
          "font-size:var(--t-cor);color:rgba(245,240,230,0.86);line-height:1.35;" +
          "text-shadow:0 2px 14px rgba(2,4,12,0.95)";
        q.textContent = testo(s.cosa);
        tx.appendChild(q);
        e.appendChild(tx);
        box.appendChild(e);
      });
    }

    /* ③ le tre righe — il posto resta anche quando sono vuote */
    var pratica = dati.pratica || [];
    [].forEach.call(document.querySelectorAll("[data-riga]"), function (n, k) {
      var p = pratica[k] || {};
      n.textContent = vuoto(p.riga) ? "" : String(p.riga);
      if (!vuoto(p.nome)) {
        n.parentNode.querySelector("b").textContent = String(p.nome);
      }
    });
  }

  /* a vuoto il quadrante si legge intero */
  riempi({});

  window.SpazioVivo = window.SpazioVivo || {};
  window.SpazioVivo.mappaLegenda = riempi;
  window.SpazioVivo.segni = SEGNI;
})();
}

/* ── ③ la prova dell'orma, sotto la mappa ──
   ⚠️ Il suo markup non sta nella consegna: la funzione cerca
      `sv-orma-testo` e `sv-orme-altri`, non li trova, ed esce al primo
      passo. Resta scritta perché il quadrante deve tornare. */
function avviaOrma(){
(function () {
  "use strict";

  var ATTESA = "[ in attesa ]";
  var vuoto = function (v) { return v === undefined || v === null || v === ""; };
  var COLORI = {terra:"#AA8844", acqua:"#4488BB", fuoco:"#CC6644",
                aria:"#669944", etere:"#9966CC"};

  var campo = document.getElementById("sv-orma-testo");
  var box   = document.getElementById("sv-orme-altri");
  if (!campo || !box) return;

  /* i tipi: nessuno è obbligatorio, e si tolgono toccandoli di nuovo */
  [].forEach.call(document.querySelectorAll(".sv-casa [data-tipi] button"), function (b) {
    b.addEventListener("click", function () {
      if (b.hasAttribute("data-su")) b.removeAttribute("data-su");
      else b.setAttribute("data-su", "1");
    });
  });

  [].forEach.call(document.querySelectorAll(".sv-casa [data-attrezzo]"), function (b) {
    b.addEventListener("click", function () {
      document.dispatchEvent(new CustomEvent("spazio-vivo:orma-attrezzo",
        {detail: {attrezzo: b.getAttribute("data-attrezzo"), testo: campo.value}}));
    });
  });

  /* l'orma esce di qui: la raccoglie il guscio */
  window.SpazioVivo = window.SpazioVivo || {};
  window.SpazioVivo.ormaScritta = function () {
    var tipi = [];
    [].forEach.call(document.querySelectorAll(".sv-casa [data-tipi] button[data-su]"),
      function (b) { tipi.push(b.getAttribute("data-tipo")); });
    return {testo: campo.value, tipi: tipi};
  };

  /* ③ le ultime orme: tutte dal dato, e ognuna porta nella stanza del suo elemento */
  function ultime(righe) {
    while (box.firstChild) box.removeChild(box.firstChild);
    righe = righe || [];
    if (!righe.length) {
      var v = document.createElement("div");
      v.style.cssText = "font-family:'Cormorant Garamond',serif;font-style:italic;" +
        "font-size:var(--t-eti);color:rgba(245,240,230,0.5);padding:0.5rem 0";
      v.textContent = ATTESA;
      box.appendChild(v);
      return;
    }
    righe.forEach(function (o) {
      var col = COLORI[o.elemento] || "#C8A055";
      var a = document.createElement(vuoto(o.rotta) ? "div" : "a");
      a.setAttribute("data-orma-altro", "1");
      if (!vuoto(o.rotta)) { a.setAttribute("href", o.rotta); a.style.textDecoration = "none"; }
      a.style.cssText += ";display:block;min-width:0;border:1px solid var(--line);" +
        "border-left:0.18rem solid " + col + ";border-radius:0 0.7rem 0.7rem 0;" +
        "background:rgba(245,240,230,0.03);padding:0.8rem 0.9rem;color:" + col;
      var t = document.createElement("div");
      t.style.cssText = "font-family:'Cormorant Garamond',serif;font-size:var(--t-cor);" +
        "line-height:1.45;color:var(--ivory);min-width:0;overflow-wrap:break-word";
      t.textContent = vuoto(o.testo) ? ATTESA : String(o.testo);
      a.appendChild(t);
      var p = document.createElement("div");
      p.style.cssText = "display:flex;gap:0.5rem;align-items:center;flex-wrap:wrap;" +
        "margin-top:0.4rem;font-family:'DM Sans',sans-serif;font-size:var(--t-eti);" +
        "color:rgba(245,240,230,0.6)";
      var pt = document.createElement("span");
      pt.style.cssText = "flex:none;width:0.45rem;height:0.45rem;border-radius:50%;background:currentColor";
      p.appendChild(pt);
      p.appendChild(document.createTextNode(
        (vuoto(o.chi) ? ATTESA : o.chi) + " · " + (vuoto(o.dove) ? ATTESA : o.dove)));
      a.appendChild(p);
      box.appendChild(a);
    });
  }

  ultime([]);
  window.SpazioVivo.ultimeOrme = ultime;
})();
}

/* ── ④ la soglia: quello che si vede aprendo la casa ──
   Una riga per volta, e il colore cambia con l'elemento a cui la cosa
   appartiene. Le parole sono di Gab.
   Espone SpazioVivo.soglia() e SpazioVivo.sogliaFerma().
   Vuole figura-flauto.png accanto: se non c'è, non compare niente. */
function avviaSoglia(){
(function () {
  "use strict";

  var R = document.getElementById("svSoglia");
  if (!R) return;

  /* ⭐ le parole sono di Gab, verbatim. Il colore è l'elemento. */
  var VOCI = [
    ["Trovare chi risuona con te",                          "#8C2F39"],
    ["Conoscere chi ha scelto un'altra vita",               "#9966CC"],
    ["Partecipare a unire la rete vicino a casa tua",       "#AA8844"],
    ["Ricevere assistenza spirituale",                      "#CC6644"],
    ["Portare a casa cibo vero e rimedi naturali",          "#4488BB"],
    ["Imparare a farli da te",                              "#4488BB"],
    ["Creare i presupposti perché un bisogno trovi una mano","#CC6644"],
    ["Servire qualcosa di più grande di te",                "#8C2F39"],
    ["Lavorare in un altro modo",                           "#C8A055"],
    ["Guidare la tua azienda con altre regole",             "#C8A055"],
    ["Allenare l'attenzione",                               "#9966CC"],
    ["Frequentare una scuola itinerante",                   "#9966CC"],
    ["Insegnare quello che sai",                            "#9966CC"],
    ["Condividere cultura in diretta radio",                "#669944"],
    ["Trasmutare la tua idea in un'opera",                  "#669944"],
    ["Segnare una cosa e ritrovarla fra tre anni",          "#8C2F39"],
    ["Tenere traccia di idee, amicizie e luoghi",           "#8C2F39"],
    ["Sentirti accolto da chi cammina come te",             "#AA8844"]
  ];
  var TIENE = 3500;

  var giostra = R.querySelector("[data-giostra]");
  var passi   = R.querySelector("[data-passi]");
  var ora     = R.querySelector("[data-ora]");

  var righe = VOCI.map(function (v) {
    var e = document.createElement("div");
    e.className = "voce";
    e.textContent = v[0];
    giostra.appendChild(e);
    var p = document.createElement("i");
    passi.appendChild(p);
    return { e: e, p: p, col: v[1] };
  });

  var qui = -1, orologio = null;

  function vaiA(n) {
    if (qui >= 0) {
      var v = righe[qui];
      v.e.classList.remove("viva");
      v.e.classList.add("via");
      v.p.classList.remove("qui");
      setTimeout(function () { v.e.classList.remove("via"); }, 900);
    }
    qui = n % righe.length;
    var r = righe[qui];
    R.style.setProperty("--c", r.col);
    r.e.classList.add("viva");
    r.p.classList.add("qui");
  }

  function gira() {
    vaiA(qui + 1);
    orologio = setTimeout(gira, TIENE);
  }

  /* ── la figura, se c'è ── */
  var NOMI = ["figura-flauto.png", "figura-flauto.webp", "figura-flauto.jpg"];
  var img = R.querySelector("[data-img]");
  (function prova(i) {
    if (i >= NOMI.length) return;
    var p = new Image();
    p.onload = function () { img.src = NOMI[i]; img.hidden = false; };
    p.onerror = function () { prova(i + 1); };
    p.src = NOMI[i];
  })(0);

  /* ── il cielo che respira ── */
  var tela = R.querySelector("[data-tela]");
  var c = tela.getContext("2d");
  var L = 0, A = 0, anim = -1, STELLE = [];

  function caso(a, b) { return a + Math.random() * (b - a); }

  function misura() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    L = R.clientWidth; A = R.clientHeight;
    tela.width = L * dpr; tela.height = A * dpr;
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    STELLE = [];
    var q = Math.round(L * A / 2600);
    for (var i = 0; i < q; i++) {
      STELLE.push({ x: Math.random() * L, y: Math.random() * A,
                    r: caso(.3, 1.1), o: caso(.1, .42),
                    f: caso(0, 6.28), v: caso(.5, 1.7) });
    }
  }

  function disegna(t) {
    c.clearRect(0, 0, L, A);
    STELLE.forEach(function (s) {
      var b = .68 + .32 * Math.sin(s.f + t * .0011 * s.v);
      c.fillStyle = "rgba(245,240,230," + (s.o * b).toFixed(3) + ")";
      c.beginPath(); c.arc(s.x, s.y, s.r, 0, 6.2832); c.fill();
    });
    anim = requestAnimationFrame(disegna);
  }

  function parti() {
    misura();
    if (anim === -1) anim = requestAnimationFrame(disegna);
    if (orologio) clearTimeout(orologio);
    setTimeout(function () { gira(); }, 320);
  }
  function ferma() {
    if (anim !== -1) { cancelAnimationFrame(anim); anim = -1; }
    if (orologio) { clearTimeout(orologio); orologio = null; }
  }

  window.addEventListener("resize", misura);
  window.SpazioVivo = window.SpazioVivo || {};
  window.SpazioVivo.soglia = parti;
  window.SpazioVivo.sogliaFerma = ferma;

  parti();
})();
}

/* ── ⑤ l'orma viva: dieci secondi che si ripetono ──
   Il Megafono con dentro le parole, la card che cade su Paulilatino, i
   fili che raggiungono le persone, la rete che si muove. Sul computer
   torna larga 56rem, com'era prima.
   Espone SpazioVivo.orma() e SpazioVivo.ormaFerma(). */
function avviaOrmaViva(){
(function () {
  "use strict";

  var R = document.getElementById("svOrmaVive");
  if (!R) return;

  var tela  = R.querySelector("[data-tela]");
  var c     = tela.getContext("2d");
  var mega  = R.querySelector("[data-mega]");
  var tasto = R.querySelector("[data-manda]");
  var resta = R.querySelector("[data-resta]");
  var coda  = R.querySelector("[data-coda]");


  R.querySelector("[data-manda]").innerHTML =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5"/><path d="M5 12l7-7 7 7"/></svg>';


  var L = 0, A = 0, dpr = 1, anim = -1, t0 = 0;
  var GIRO = 10000;

  var CASA = { lon: 8.7519, lat: 40.0653 };          /* Paulilatino */
  var GENTE = [
    { chi: "Gabriele", lon:  9.4989, lat: 40.9236 },  /* Olbia */
    { chi: "Marco",    lon:  8.5915, lat: 39.9036, sotto: true },
    { chi: "Laura",    lon: 10.3106, lat: 43.5485 },  /* Livorno */
    { chi: "Giovanni", lon: 11.3426, lat: 44.4949 },  /* Bologna */
    { chi: "Roberta",  lon: 13.9556, lat: 42.7514 },  /* Giulianova */
    { chi: "Francesco", lon: 15.5540, lat: 38.1938 }  /* Messina */
  ];

  var PENISOLA = [
    [7.0,45.0],[6.8,45.9],[7.6,45.9],[8.6,46.4],[9.2,46.5],[10.1,46.6],
    [11.2,46.9],[12.2,46.7],[13.6,46.5],[13.7,45.8],[13.1,45.7],[12.3,45.4],
    [12.5,44.4],[13.5,43.6],[14.5,42.4],[15.1,41.9],[16.2,41.9],[15.9,41.4],
    [16.5,41.2],[17.3,40.8],[18.0,40.5],[18.5,40.1],[18.4,39.8],[17.9,40.3],
    [17.2,40.4],[16.6,40.1],[16.9,39.6],[17.1,39.0],[16.6,38.4],[16.1,37.9],
    [15.6,38.0],[15.8,38.7],[16.0,39.4],[15.5,40.0],[14.9,40.4],[14.2,40.6],
    [13.7,41.2],[12.9,41.4],[12.2,41.8],[11.2,42.4],[10.8,42.9],[10.3,43.5],
    [10.0,44.0],[9.1,44.3],[8.3,44.3],[7.6,43.8],[7.5,44.2],[6.9,44.4]
  ];
  var SARDEGNA = [
    [9.2,41.25],[9.6,40.9],[9.8,40.5],[9.7,40.0],[9.6,39.5],[9.3,39.2],
    [9.1,39.0],[8.6,38.9],[8.4,39.1],[8.5,39.5],[8.4,39.9],[8.2,40.3],
    [8.2,40.6],[8.4,40.8],[8.8,41.1]
  ];
  var SICILIA = [
    [12.44,37.80],[12.66,38.02],[13.36,38.19],[14.05,38.05],[14.75,38.03],
    [15.24,38.13],[15.65,38.27],[15.62,38.10],[15.29,37.85],[15.09,37.50],
    [15.29,37.06],[15.14,36.68],[14.50,36.79],[13.92,37.10],[13.58,37.31],
    [12.92,37.57]
  ];

  var LON0 = 6.4, LON1 = 18.9, LAT0 = 36.4, LAT1 = 47.2;
  var px = 0, py = 0, sc = 1;

  function proietta(lon, lat) {
    return [px + (lon - LON0) * sc, py + (LAT1 - lat) * sc * 1.42];
  }

  var NODI = [], FILI = [], SCAMBI = [], STELLE = [], TRAMA = [];
  function caso(a, b) { return a + Math.random() * (b - a); }

  function misura() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    L = R.clientWidth; A = R.clientHeight;
    tela.width = L * dpr; tela.height = A * dpr;
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    /* ⭐ La mappa non usa tutto il riquadro: sta in una fascia in
       mezzo. Sopra resta il cielo per la card, sotto per i dati,
       e la terra non viene mai coperta. */
    var stretto = L < 640;
    var alto  = stretto ? A * .30 : A * .23;
    var basso = stretto ? A * .17 : A * .17;
    var fascia = A - alto - basso;

    var sx = (L * .74) / (LON1 - LON0);
    var sy = fascia / ((LAT1 - LAT0) * 1.42);
    sc = Math.min(sx, sy);
    px = (L - (LON1 - LON0) * sc) / 2;
    py = alto + (fascia - (LAT1 - LAT0) * sc * 1.42) / 2;
    semina();
  }

  function semina() {
    STELLE = [];
    var q = Math.round(L * A / 3400);
    for (var s = 0; s < q; s++) {
      STELLE.push({ x: Math.random() * L, y: Math.random() * A,
                    r: caso(.3, 1), o: caso(.1, .36),
                    f: caso(0, 6.28), v: caso(.6, 1.8) });
    }
    var p = proietta(CASA.lon, CASA.lat);
    NODI = [{ x: p[0], y: p[1], r: 3.8, chi: "", luce: 0, mio: true }];
    GENTE.forEach(function (g) {
      var q2 = proietta(g.lon, g.lat);
      NODI.push({ x: q2[0], y: q2[1], r: 2.8, chi: g.chi, luce: 0,
                  sotto: !!g.sotto });
    });

    /* ⭐ la tessitura: quello che c'era già prima di questa orma.
       Sta dietro, vive per conto suo, e non aspetta nessuno. */
    TRAMA = [];
    var quanti = Math.max(26, Math.round(L * A / 9000));
    for (var k = 0; k < quanti; k++) {
      TRAMA.push({ x: Math.random() * L, y: Math.random() * A,
                   vx: (Math.random() - .5) * .12,
                   vy: (Math.random() - .5) * .12,
                   r: caso(.7, 1.5) });
    }
    /* e i sei nodi veri entrano nella trama, così i fili si innestano */
    NODI.forEach(function (n2) {
      TRAMA.push({ x: n2.x, y: n2.y, vx: 0, vy: 0, r: 0, fermo: true });
    });
    FILI = [];
    for (var i = 1; i < NODI.length; i++) FILI.push({ a: 0, b: i, v: 0 });
    SCAMBI = FILI.map(function (f, i) {
      return { filo: i, p: Math.random(), v: caso(.0024, .005),
               verso: Math.random() < .5 ? 1 : -1 };
    });
  }

  /* dove sta il tasto che manda, dentro il riquadro */
  function puntoTasto() {
    var a = tasto.getBoundingClientRect(), b = R.getBoundingClientRect();
    return [a.left - b.left + a.width / 2, a.top - b.top + a.height / 2];
  }

  function costa(punti, o) {
    c.beginPath();
    punti.forEach(function (p, i) {
      var q = proietta(p[0], p[1]);
      if (i === 0) c.moveTo(q[0], q[1]); else c.lineTo(q[0], q[1]);
    });
    c.closePath();
    c.fillStyle = "rgba(38,64,120," + (o * .38).toFixed(3) + ")";
    c.fill();
    c.strokeStyle = "rgba(120,164,214," + o.toFixed(3) + ")";
    c.lineWidth = 1; c.lineJoin = "round";
    c.stroke();
  }

  function disegna(ora) {
    if (!t0) t0 = ora;
    var t = ((ora - t0) % GIRO) / GIRO;

    c.clearRect(0, 0, L, A);
    c.fillStyle = "#04060F"; c.fillRect(0, 0, L, A);
    var g = c.createRadialGradient(L * .4, A * .35, 0, L * .5, A * .5,
                                   Math.max(L, A) * .9);
    g.addColorStop(0, "rgba(30,52,112,.4)");
    g.addColorStop(.6, "rgba(44,34,92,.24)");
    g.addColorStop(1, "rgba(4,6,16,0)");
    c.fillStyle = g; c.fillRect(0, 0, L, A);

    STELLE.forEach(function (s) {
      var b = .7 + .3 * Math.sin(s.f + ora * .0012 * s.v);
      c.fillStyle = "rgba(245,240,230," + (s.o * b).toFixed(3) + ")";
      c.beginPath(); c.arc(s.x, s.y, s.r, 0, 6.2832); c.fill();
    });

    var terra = Math.min(1, Math.max(0, (t - .02) / .14));
    costa(PENISOLA, .28 * terra);
    costa(SARDEGNA, .34 * terra);
    costa(SICILIA,  .24 * terra);

    /* la tessitura che c'era già */
    var tess = Math.min(1, Math.max(0, (t - .08) / .18));
    if (tess > 0) {
      c.lineWidth = .6;
      for (var i2 = 0; i2 < TRAMA.length; i2++) {
        var a2 = TRAMA[i2];
        if (!a2.fermo) {
          a2.x += a2.vx; a2.y += a2.vy;
          if (a2.x < 0 || a2.x > L) a2.vx *= -1;
          if (a2.y < 0 || a2.y > A) a2.vy *= -1;
        }
        for (var j2 = i2 + 1; j2 < TRAMA.length; j2++) {
          var b2 = TRAMA[j2];
          var dx = a2.x - b2.x, dy = a2.y - b2.y;
          var d2 = Math.sqrt(dx * dx + dy * dy);
          if (d2 > 108) continue;
          c.strokeStyle = "rgba(150,178,220," +
            ((1 - d2 / 108) * .11 * tess).toFixed(3) + ")";
          c.beginPath(); c.moveTo(a2.x, a2.y); c.lineTo(b2.x, b2.y); c.stroke();
        }
        if (a2.r > 0) {
          c.fillStyle = "rgba(180,204,238," + (.2 * tess).toFixed(3) + ")";
          c.beginPath(); c.arc(a2.x, a2.y, a2.r, 0, 6.2832); c.fill();
        }
      }
    }

    /* ① il Megafono · ② si manda */
    mega.classList.toggle("on", t >= .04);
    mega.classList.toggle("spinge", t >= .26 && t < .33);
    resta.classList.toggle("on", t > .40 && t < .52);

    /* ⭐ l'orma scende dal tasto che manda fino a Paulilatino */
    if (t >= .285 && t < .40) {
      var q = (t - .285) / .105;
      var e = q * q * (3 - 2 * q);              /* parte piano, arriva piano */
      var p0 = puntoTasto(), p1 = NODI[0];
      var mx = (p0[0] + p1.x) / 2 + (p1.x - p0[0]) * .22;
      var my = (p0[1] + p1.y) / 2 - Math.abs(p1.y - p0[1]) * .22;
      var u = 1 - e;
      var x = u * u * p0[0] + 2 * u * e * mx + e * e * p1.x;
      var y = u * u * p0[1] + 2 * u * e * my + e * e * p1.y;

      /* la scia */
      for (var s2 = 1; s2 <= 6; s2++) {
        var e2 = Math.max(0, e - s2 * .028);
        var u2 = 1 - e2;
        var sx2 = u2 * u2 * p0[0] + 2 * u2 * e2 * mx + e2 * e2 * p1.x;
        var sy2 = u2 * u2 * p0[1] + 2 * u2 * e2 * my + e2 * e2 * p1.y;
        c.fillStyle = "rgba(212,175,106," + (.2 * (1 - s2 / 7)).toFixed(3) + ")";
        c.beginPath(); c.arc(sx2, sy2, 2.4 * (1 - s2 / 8), 0, 6.2832); c.fill();
      }

      var raggio = 11 + 5 * Math.sin(e * Math.PI);
      var gc = c.createRadialGradient(x, y, 0, x, y, raggio);
      gc.addColorStop(0, "rgba(255,236,190,.95)");
      gc.addColorStop(.4, "rgba(212,175,106,.55)");
      gc.addColorStop(1, "rgba(212,175,106,0)");
      c.fillStyle = gc;
      c.beginPath(); c.arc(x, y, raggio, 0, 6.2832); c.fill();
      c.fillStyle = "rgba(255,244,214,.95)";
      c.beginPath(); c.arc(x, y, 2.6, 0, 6.2832); c.fill();
    }

    NODI[0].luce = t > .385 ? Math.min(1, (t - .385) / .05) : 0;

    /* ③ i fili */
    FILI.forEach(function (f, i) {
      var parte = .46 + i * .034;
      var q = Math.max(0, Math.min(1, (t - parte) / .12));
      f.v = q;
      if (q <= 0) { NODI[f.b].luce = 0; return; }
      var a = NODI[f.a], b = NODI[f.b];
      c.strokeStyle = "rgba(212,175,106," + (.38 * q).toFixed(3) + ")";
      c.lineWidth = 1.1;
      c.beginPath(); c.moveTo(a.x, a.y);
      c.lineTo(a.x + (b.x - a.x) * q, a.y + (b.y - a.y) * q);
      c.stroke();
      NODI[f.b].luce = q;
    });

    /* ④ la rete si muove */
    if (t > .72) {
      SCAMBI.forEach(function (s) {
        var f = FILI[s.filo];
        if (!f || f.v < 1) return;
        s.p += s.v * s.verso;
        if (s.p > 1) s.p = 0;
        if (s.p < 0) s.p = 1;
        var a = NODI[f.a], b = NODI[f.b];
        var x = a.x + (b.x - a.x) * s.p, y = a.y + (b.y - a.y) * s.p;
        var gg = c.createRadialGradient(x, y, 0, x, y, 7);
        gg.addColorStop(0, "rgba(255,232,180,.9)");
        gg.addColorStop(1, "rgba(212,175,106,0)");
        c.fillStyle = gg;
        c.beginPath(); c.arc(x, y, 7, 0, 6.2832); c.fill();
      });
    }
    R.querySelector("[data-dati]").classList.toggle("on", t > .56 && t < .84);
    coda.classList.toggle("on", t > .84);

    /* i nodi, e i soli nomi delle persone */
    var gran = Math.max(13, Math.round(Math.min(L, A) * .036));
    NODI.forEach(function (n) {
      if (n.luce <= .02) return;
      var raggio = 13 + n.luce * (n.mio ? 18 : 9);
      var gg = c.createRadialGradient(n.x, n.y, 0, n.x, n.y, raggio);
      gg.addColorStop(0, "rgba(212,175,106," + (.36 * n.luce).toFixed(3) + ")");
      gg.addColorStop(1, "rgba(212,175,106,0)");
      c.fillStyle = gg;
      c.beginPath(); c.arc(n.x, n.y, raggio, 0, 6.2832); c.fill();

      c.fillStyle = "rgba(245,240,230," + (.45 + n.luce * .5).toFixed(3) + ")";
      c.beginPath(); c.arc(n.x, n.y, n.r, 0, 6.2832); c.fill();

      if (n.chi && n.luce > .55) {
        var o = Math.min(1, (n.luce - .55) * 2.4);
        c.textAlign = "center";
        c.fillStyle = "rgba(245,240,230," + (o * .88).toFixed(3) + ")";
        c.font = "500 " + gran + "px 'DM Sans', system-ui, sans-serif";
        c.fillText(n.chi, n.x,
                   n.sotto ? n.y + n.r + gran + 2 : n.y - n.r - 9);
      }
    });

    anim = requestAnimationFrame(disegna);
  }

  function parti() {
    misura(); t0 = 0;
    if (anim === -1) anim = requestAnimationFrame(disegna);
  }
  function ferma() {
    if (anim !== -1) { cancelAnimationFrame(anim); anim = -1; }
  }

  window.addEventListener("resize", misura);
  window.SpazioVivo = window.SpazioVivo || {};
  window.SpazioVivo.orma = parti;
  window.SpazioVivo.ormaFerma = ferma;

  parti();
})();
}

/* ── ⑥ i cinque quadranti: cosa trovi, e dove si entra ──
   Espone SpazioVivo.elementi().
   Le due mani su questo file stanno qui dentro, scritte sul posto:
     ③ i segni sono quelli del guscio, non quelli della consegna
     ④ le rotte vengono dalla tavola `stanze`, non dal codice */
function avviaCinque(){
(function () {
  "use strict";

  var R = document.getElementById("svCinque");
  if (!R) return;

  /* ⭐ TOCCATO ③ — I SEGNI SONO QUELLI DEL GUSCIO.
     La consegna porta cinque solidi platonici suoi, in viewBox 100. Si
     buttano: le stesse cinque stanze hanno già i propri simboli nella
     barra a sinistra, e sono quelli di SIMBOLI. Due disegni per la stessa
     stanza, nella stessa schermata, sarebbero due cose.
     ⛔ Qui non si scrive nessun segno: si legge quello che c'è già.
     ⚠️ Il giro lento e il battito restano: sono regole su
        `.sv-cinque .sg svg`, e valgono per qualunque disegno le stia
        dentro. Ma quello che gira non sono più i solidi — sono i segni
        delle stanze.
     Se SIMBOLI non c'è, il cerchio resta vuoto e il quadrante regge. */
  function segnoDi(el) {
    if (typeof SIMBOLI === "undefined" || !SIMBOLI) return "";
    return SIMBOLI[el] || "";
  }

  /* ⭐ Riscritti dal testo operativo: il nome, una riga, quattro cose vere. */
  var CINQUE = [
    { el:"Terra", col:"#AA8844", segno:"terra", rotta:"vicinati",
      nome:"Vicinati",
      riga:"Chi c\u2019\u00E8 vicino a te, e cosa si fa insieme",
      cose:["I gruppi del tuo territorio",
            "I bisogni aperti, e chi li prende",
            "I calendari di quello che accade",
            "Chi ospita, e chi custodisce un luogo"] },

    { el:"Acqua", col:"#4488BB", segno:"acqua", rotta:"emporio",
      nome:"Emporio",
      riga:"Quello che si scambia, si dona e si compra",
      cose:["Cibo e rimedi che hanno passato il vaglio",
            "Libri, oggetti, abbigliamento",
            "I doni, e i talenti che passano di mano",
            "La distribuzione, dal produttore a casa"] },

    { el:"Fuoco", col:"#CC6644", segno:"fuoco", rotta:"assistenza",
      nome:"Assistenza",
      riga:"Chi ti accompagna quando serve",
      cose:["Assistenza spirituale, sugli insegnamenti indo-vedici",
            "Dottori e operatori che lavorano insieme",
            "Strutture di rigenerazione",
            "Consulenze, e formazioni per chi vuole imparare"] },

    { el:"Aria", col:"#669944", segno:"aria", rotta:"edizione",
      nome:"Edizione",
      riga:"L\u2019idea che diventa opera, e si sente",
      cose:["La radio, tutti i giorni",
            "I libri: dalle tracce alla stampa",
            "Lezioni audio, in diretta o quando vuoi",
            "Quello che si stampa, e dove arriva"] },

    { el:"Etere", col:"#9966CC", segno:"etere", rotta:"scuola",
      nome:"Scuola",
      riga:"Dove si impara, e dove si insegna",
      cose:["La scuola itinerante, che va dove serve",
            "Le lezioni a cui puoi partecipare",
            "La ricerca che le accompagna",
            "Il tuo talento che diventa un lavoro"] }
  ];

  var box = R.querySelector("[data-griglia]");

  CINQUE.forEach(function (q) {
    var a = document.createElement("a");
    a.className = "q";
    /* ⭐ TOCCATO ④ — LA ROTTA VIENE DALLA TAVOLA `stanze`, non da qui.
       `q.rotta` è l'ID della stanza; l'indirizzo vero lo tiene ROTTE, che
       il guscio riempie col seme al primo istante e poi rilegge dal
       database. `vicinati` da solo non è una rotta conosciuta:
       conosciuta() la rifiuta e si torna a casa. Quella buona è
       `incontro:vicinati`. Se l'id non si trova, resta com'era. */
    var indirizzo = (typeof ROTTE !== "undefined" && ROTTE && ROTTE[q.rotta])
                    ? ROTTE[q.rotta] : q.rotta;
    a.href = "?p=" + indirizzo;
    a.style.setProperty("--c", q.col);

    var cose = q.cose.map(function (c) {
      return "<li><i></i><span>" + c + "</span></li>";
    }).join("");

    a.innerHTML =
      '<div class="capo"><span class="sg">' + segnoDi(q.segno) + '</span>' +
      '<span class="tx"><span class="el">' + q.el + '</span>' +
      '<b>' + q.nome + '</b></span></div>' +
      '<div class="riga">' + q.riga + '</div>' +
      '<ul>' + cose + '</ul>' +
      '<span class="vai">Entra &rsaquo;</span>';

    box.appendChild(a);
  });

  window.SpazioVivo = window.SpazioVivo || {};
  window.SpazioVivo.elementi = function () { return CINQUE; };
})();
}

/* ── ⑦ la formula: si compone quando entra nello schermo ──
   Espone SpazioVivo.formula() e SpazioVivo.formulaFerma().
   Ha un occhio suo, e non dipende dall'ordine di chiamata. */
function avviaFormula(){
(function () {
  "use strict";

  var R = document.getElementById("svFormula");
  if (!R) return;

  /* i colori della tavola, non schiariti */
  var EL = [
    ["Terra", "#AA8844"], ["Acqua", "#4488BB"], ["Fuoco", "#CC6644"],
    ["Aria",  "#669944"], ["Etere", "#9966CC"]
  ];


  var sopra  = R.querySelector("[data-sopra]");
  var sotto  = R.querySelector("[data-sotto]");
  var ancora = R.querySelector("[data-ancora]");
  var quadro = R.querySelector("[data-quadro]");

  /* ── i pezzi della formula ── */
  var pezzi = [];
  function pezzo(testo, classe, colore) {
    var e = document.createElement("span");
    e.className = "p" + (classe ? " " + classe : "");
    e.textContent = testo;
    if (colore) { e.style.color = colore; e.style.filter = "brightness(1.35)"; }
    sopra.appendChild(e);
    pezzi.push(e);
    return e;
  }

  var apre = pezzo("(", "par");
  EL.forEach(function (x, i) {
    if (i) pezzo("+", "seg");
    pezzo(x[0], "", x[1]);
  });
  var chiude = pezzo(")", "par");
  var per    = pezzo("\u00D7", "seg");
  var nexus  = pezzo("Nexus", "nex");


  /* ── i cinque passi ── */
  var tempi = [];


  function accendi(da, a) {
    for (var i = da; i <= a && i < pezzi.length; i++) {
      (function (e, k) {
        tempi.push(setTimeout(function () { e.classList.add("on"); },
                              k * 130));
      })(pezzi[i], i - da);
    }
  }

  function parti() {
    tempi.forEach(clearTimeout);
    tempi = [];
    pezzi.forEach(function (e) { e.classList.remove("on"); });
    sotto.classList.remove("on");
    ancora.classList.remove("on");

    /* ① i cinque nomi, uno dietro l'altro */
    tempi.push(setTimeout(function () { accendi(1, 9); }, 500));

    /* ② le parentesi si chiudono intorno */
    tempi.push(setTimeout(function () {
      apre.classList.add("on");
      chiude.classList.add("on");
    }, 3400));

    /* ③ per Nexus */
    tempi.push(setTimeout(function () {
      per.classList.add("on");
      nexus.classList.add("on");
    }, 5200));

    /* ④ la linea scende, e sotto il falso ego */
    tempi.push(setTimeout(function () {
      sotto.classList.add("on");
    }, 7200));

    tempi.push(setTimeout(function () {
      ancora.classList.add("on");
    }, 9600));
  }

  function ferma() {
    tempi.forEach(clearTimeout);
    tempi = [];
  }

  quadro.addEventListener("click", parti);

  /* parte quando entra nello schermo, non prima */
  if ("IntersectionObserver" in window) {
    var visto = false;
    var occhio = new IntersectionObserver(function (righe2) {
      righe2.forEach(function (r) {
        if (r.isIntersecting && !visto) { visto = true; parti(); }
      });
    }, { threshold: 0.4 });
    occhio.observe(R);
  } else {
    parti();
  }

  window.SpazioVivo = window.SpazioVivo || {};
  window.SpazioVivo.formula = parti;
  window.SpazioVivo.formulaFerma = ferma;
})();
}

/* ── ⑧ la giostra dei sette segni, le due misure, e l'occhio ──
   Un foglio solo, come l'ha consegnato Design, con tre cose dentro:
     · dentro il cerchio di «Simboli dell'esperienza» i sette segni si
       affacciano uno per volta, e un anello si allarga e svanisce.
       Li legge da SpazioVivo.segni: se non ci sono, esce senza disegnare.
       Ha un occhio suo: gira quando è in vista, si ferma quando esce.
     · la soglia prende lo spazio fra la radio e il Megafono, misurato;
       sul telefono l'orma è alta come il quadrante della radio.
     · l'occhio che ferma il disegno: quello che disegna sessanta volte
       al secondo si spegne quando esce dallo schermo, e riprende.
   ⛔ VA CHIAMATA PER ULTIMA: prende SpazioVivo.soglia e .orma
      nell'istante in cui gira, e SpazioVivo.segni per la giostra. */
function avviaSoglieEMisure(){
(function () {
  "use strict";
  /* i sette segni si affacciano nella soglia, uno per volta, e si fermano
     quando la porta esce dallo schermo */
  (function () {
    var g = document.querySelector("[data-soglia] [data-giostra]");
    var S = (window.SpazioVivo || {}).segni;
    if (!g || !S) return;
    if (g.children.length) return;
    var ordine = ["orma","connessione","talenti","vicinato","ritmo","incontro","tempio"];
    var fogli = ordine.map(function (k, i) {
      var s = document.createElement("span");
      s.setAttribute("data-passa", "1");
      s.innerHTML = '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" ' +
        'stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' +
        (S[k] || "") + '</svg>';
      if (i === 0) s.className = "viva";
      g.appendChild(s);
      return s;
    });
    var i = 0, orologio = null;
    function passa() {
      fogli[i].classList.remove("viva");
      i = (i + 1) % fogli.length;
      fogli[i].classList.add("viva");
    }
    function vai()   { if (!orologio) orologio = setInterval(passa, 2200); }
    function sta()   { if (orologio) { clearInterval(orologio); orologio = null; } }
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (voci) {
        voci.forEach(function (v) { v.isIntersecting ? vai() : sta(); });
      }, {rootMargin: "80px"}).observe(g);
    } else vai();
  })();

  /* ⭐ la soglia prende esattamente lo spazio fra la radio e il Megafono:
     misurato, non indovinato — la radio è più alta sul telefono */
  (function () {
    var q = document.querySelector(".sv-casa [data-pieno]");
    var s = q || document.querySelector(".sv-soglia");
    if (!s) return;
    function alta() {
      var mg = document.querySelector("[data-mg]");
      var r = s.getBoundingClientRect();
      var sopra = r.top + window.scrollY;   /* dove comincia, a pagina ferma */
      var sotto = mg ? mg.getBoundingClientRect().height : 0;
      var h = window.innerHeight - sotto - Math.min(sopra, window.innerHeight * 0.5);
      if (h > 160) s.style.setProperty("--sv-alt", Math.round(h) + "px");
    }
    function misura() { if (window.scrollY < 4) alta(); }
    if (document.readyState === "complete") misura();
    else window.addEventListener("load", misura);
    document.addEventListener("DOMContentLoaded", misura);
    window.addEventListener("resize", function () {
      s.style.removeProperty("--sv-alt");
      requestAnimationFrame(misura);
    });
  })();

  /* ⭐ sul telefono l'orma è grande come il quadrante della radio: misurata su
     quello, non indovinata */
  (function () {
    var o = document.querySelector(".sv-orma-vive");
    if (!o) return;
    function pari() {
      if (window.innerWidth > 832) { o.style.removeProperty("--sv-orma-h"); return; }
      var l = document.querySelector("[data-lancetta]");
      var r = l && l.closest("div") ? l.closest("[style*='sticky']") : null;
      var q = r ? r.firstElementChild : null;
      if (!q) return;
      var h = Math.round(q.getBoundingClientRect().height);
      if (h > 120) o.style.setProperty("--sv-orma-h", h + "px");
    }
    if (document.readyState === "complete") pari();
    else window.addEventListener("load", pari);
    document.addEventListener("DOMContentLoaded", pari);
    window.addEventListener("resize", function () { requestAnimationFrame(pari); });
  })();

  /* quello che disegna sessanta volte al secondo si ferma quando esce dallo
     schermo, e riprende quando torna: fuori dallo sguardo non serve a nessuno */
  if (!("IntersectionObserver" in window)) return;
  var SV = window.SpazioVivo || {};
  var occhi = [
    {sel: ".sv-soglia",    parte: SV.soglia, ferma: SV.sogliaFerma},
    {sel: ".sv-orma-vive", parte: SV.orma,   ferma: SV.ormaFerma}
  ];
  occhi.forEach(function (o) {
    var n = document.querySelector(o.sel);
    if (!n || typeof o.parte !== "function") return;
    var dentro = true;
    new IntersectionObserver(function (voci) {
      voci.forEach(function (v) {
        if (v.isIntersecting && !dentro) { dentro = true; o.parte(); }
        else if (!v.isIntersecting && dentro) { dentro = false; o.ferma(); }
      });
    }, {rootMargin: "120px"}).observe(n);
  });
})();
}

/* ════════════════════════════════════════════════════════════════
   IL DATO CHE RIEMPIE LA FORMA

   Design consegna la scheda vuota. Qui si dice soltanto da dove
   arriva ogni parola.

     vicinati.nome        → il nome
     vicinati.territorio  → il luogo, sotto il nome
     vicinati.descrizione → il testo
     vicinati.foto        → la foto

   Gli elementi sono le pastiglie che si toccano. Cosa finisce nelle
   tre colonne di una riga:

     elemento   testo            etichetta           valore
     ───────────────────────────────────────────────────────────────
     prodotti   prodotti.nome    prodotti.scaffale   il prezzo in euro
     bisogni    bisogni.titolo   —                   bisogni.talenti

   ⭐ Le due scelte del 14 agosto 2026: l'etichetta dei prodotti è lo
      scaffale, il valore dei bisogni sono i talenti. Un bisogno senza
      talenti lascia la colonna vuota, e la forma di Design lo fa già
      da sé: una riga senza `valore` la terza colonna non la disegna.

   I bisogni sono quelli aperti — `stato` = `aperto`.
   I prodotti sono tutti quelli del vicinato: la tabella ha la colonna
   `stato`, e il filtro si mette qui il giorno che i valori ammessi
   sono fissati.
   ════════════════════════════════════════════════════════════════ */

var LUOGHI_LEGATI = false;

function legaLuoghi(){
  window.SpazioVivo = window.SpazioVivo || {};
  window.SpazioVivo.mostraVicinato = mostraVicinato;
  if(LUOGHI_LEGATI) return;   /* in home si torna più volte: un ascolto solo */
  LUOGHI_LEGATI = true;
  window.addEventListener("message", function(e){
    var d = e.data;
    if(d && d.q === "vicinato" && d.vicinato) mostraVicinato(d.vicinato, !!d.piena);
  });
}

/* la riga di `vicinati` diventa il record della scheda.
   Prima sale la scheda con quello che si sa già, poi arriva cosa c'è
   dentro: chi tocca un segno non aspetta il database per vedere il nome. */
function mostraVicinato(v, piena){
  if(!v || !window.SpazioVivo || typeof window.SpazioVivo.mostraLuogo !== "function") return;

  var rec = {
    occhiello:   "vicinato",
    nome:        v.nome,
    luogo:       v.territorio,
    descrizione: v.descrizione,
    foto:        v.foto,
    elementi:    []
  };

  window.SpazioVivo.mostraLuogo(rec, {piena: !!piena});
  if(!piena) return;          /* la forma breve non apre gli elementi */

  cosaCeDentro(v.id).then(function(elementi){
    if(!elementi.length) return;      /* niente da aggiungere: la scheda resta com'è */
    rec.elementi = elementi;
    window.SpazioVivo.mostraLuogo(rec, {piena:true});
  });
}

/* le due letture. Se una tace, il suo elemento non compare: meglio
   nessuna pastiglia che una pastiglia che mente sul numero. */
function cosaCeDentro(vicinatoId){
  return Promise.all([
    db.from("prodotti").select("nome,scaffale,prezzo,foto")
      .eq("vicinato_id", vicinatoId).order("nome"),
    db.from("bisogni").select("titolo,talenti")
      .eq("vicinato_id", vicinatoId).eq("stato", "aperto").order("creato_il", {ascending:false})
  ]).then(function(esiti){
    var elementi = [], p = esiti[0], b = esiti[1];

    if(!p.error && p.data && p.data.length) elementi.push({
      chiave: "prodotti",
      nome:   "prodotti",
      quante: p.data.length,
      righe:  p.data.map(function(r){
        return { testo: r.nome, etichetta: r.scaffale, valore: inEuro(r.prezzo), foto: r.foto };
      })
    });

    if(!b.error && b.data && b.data.length) elementi.push({
      chiave: "bisogni",
      nome:   "bisogni",
      quante: b.data.length,
      righe:  b.data.map(function(r){
        return { testo: r.titolo, valore: inTalenti(r.talenti) };
      })
    });

    return elementi;
  }).catch(function(err){
    if(window.console) console.error("la casa: cosa c'è dentro il vicinato —", err);
    return [];
  });
}

/* un prezzo che non c'è lascia la colonna vuota, come i talenti */
function inEuro(n){
  var q = Number(n);
  if(n === null || n === undefined || n === "" || !isFinite(q)) return "";
  return q.toLocaleString("it-IT", {
    style: "currency", currency: "EUR",
    minimumFractionDigits: q % 1 ? 2 : 0
  });
}

function inTalenti(n){
  var q = Number(n);
  if(n === null || n === undefined || n === "" || !isFinite(q) || q <= 0) return "";
  return q + (q === 1 ? " talento" : " talenti");
}


/* ════════════════════════════════════════════════════════════════
   LE DUE SCHEDE — le ultime cose arrivate

   ⭐ LA LEGGE: se una cosa esce sulla mappa, esce anche qui.
      Un record, tutte le viste. Tre tabelle, una sola riga di tempo.

   Le letture sono quelle di sempre: cambia dove si posano. Design ha
   scritto la forma e il modo di riempirla — mostraContenuto(record,
   1|2) — e questo file costruisce il record, campo per campo:

     campo         prodotto            vicinato          orma
     ─────────────────────────────────────────────────────────────────
     radice        il simbolo di       il simbolo di     il simbolo
                   Emporio             Vicinati          della sua stanza
     radiceNome    Emporio             Vicinati          il nome della
                                                         sua stanza
     foto          prodotti.foto       vicinati.foto     —
     cosa[0]       scaffale            «vicinato»        —
     cosa[1]       sottoscaffale       territorio        —
     titolo        nome                nome              titolo
     sottotitolo   sottotitolo         descrizione, e se sottotitolo, e
                                       manca territorio  se manca il
                                                         contenuto
     chi           autore              —                 —
     quando        creato_il           creato_il         momento
     collegatoDa   il nome dalla       il nome dalla     —
                   vista               vista
                   persone_pubbliche   persone_pubbliche
                   da persona_id       da creato_da
     stanze        i valori distinti di collegamenti.elemento dove
                   da_tipo è il genere e da_id è l'id di quel contenuto

   Cosa si legge, e con quale filtro:

     tabella    filtro                    data          nome       riga di testo
     ─────────────────────────────────────────────────────────────────────────────
     prodotti   stato = 'pubblico'        creato_il     nome       sottotitolo
     vicinati   stato = 'confermato'      creato_il     nome       descrizione,
                                                                   e se manca
                                                                   territorio
     orme       visibilita = 'pubblico'   momento       titolo     sottotitolo,
                                                                   e se manca
                                                                   contenuto

   ⚠️ `prodotti.stato` — nel database vivo il valore è `pubblico`, non
      `pubblicato`. Letto il 14 agosto 2026 su gfnveesogkfvkrdudpfg:
      l'unica riga presente, «Anima Vagabonda», porta `pubblico`.
      Il giorno che il valore cambia, si cambia PRODOTTI_PUBBLICO.

   ⚠️ `orme` non ha una colonna foto: un'orma non porta mai l'immagine,
      e il riquadro resta il segnaposto che ha disegnato Design.

   L'elemento di un'orma non sta nella sua riga: si ricava da `tipo`
   passando per DOVE, la tavola del guscio — `tipo` dice lo strumento,
   DOVE dice in quale elemento quello strumento vive.

   Toccando una scheda:
     prodotto → ?p=pagina&n=nome-url — la stessa strada che percorre
                l'indirizzo: si posa il nome e si chiama vai("pagina")
     vicinato → la mappa si posa sul punto e sale la sua scheda
     orma     → niente: resta com'è oggi

   Niente record? Le due schede restano come Design le lascia: la forma
   a vuoto, tutta [ in attesa ], che si legge lo stesso.

   Il testo entra sempre per mano di Design, che usa textContent: quello
   che arriva dal database non diventa mai marcatura.
   ════════════════════════════════════════════════════════════════ */

var ORME_QUANTE = 2;                    /* due schede, due cose */
var PRODOTTI_PUBBLICO = "pubblico";     /* il valore vivo della colonna `stato` */

/* ⛔ DUE FAMIGLIE DI SEGNI, e non si mescolano.

   I sette della legenda — orma · connessione · talenti · vicinato ·
   ritmo · incontro · tempio — sono le FASI DI CRESCITA sulla mappa.
   Nella scheda del contenuto non entrano.

   Le STANZE sono le voci della barra a sinistra, e portano i simboli
   della barra: quelli di SIMBOLI nel guscio, uno per elemento. Sono
   quelli che vanno nel cerchio grande in cima e nella riga in fondo.

   Il nome della stanza è quello della barra. ⛔ Il nome dell'elemento
   non compare mai: la chiave è interna, in pagina si legge «Emporio». */
var STANZA = {
  terra: "Vicinati",
  acqua: "Emporio",
  fuoco: "Assistenza",
  aria:  "Edizione",
  etere: "Scuola",
  nexus: "Nexus"
};

/* un prodotto nasce in Emporio, un vicinato nei Vicinati */
var ELEMENTO_DEL_GENERE = { prodotto: "acqua", vicinato: "terra" };

/* i simboli della barra entrano fra quelli che Design sa disegnare,
   sotto la chiave dell'elemento. La sua funzione non si tocca: lei
   scrive il contenuto dentro un <svg> suo, quindi qui si passa solo
   quello che sta dentro, senza l'involucro di SIMBOLI.

   ⚠️ SIMBOLI.nexus è nullo — il Nexus viene dal disegno a mano — e
      resta fuori: quel cerchio Design lo lascia tratteggiato. */
function segniDelleStanze(){
  if(!window.SpazioVivo || !window.SpazioVivo.segni) return;
  if(typeof SIMBOLI === "undefined" || !SIMBOLI) return;

  Object.keys(STANZA).forEach(function(el){
    var s = SIMBOLI[el];
    if(!s) return;
    window.SpazioVivo.segni[el] = String(s)
      .replace(/^[\s\S]*?<svg[^>]*>/, "")
      .replace(/<\/svg>\s*$/, "");
  });
}

function leOrme(){
  if(!window.SpazioVivo || typeof window.SpazioVivo.mostraContenuto !== "function") return;

  ultimeCose(ORME_QUANTE).then(function(cose){
    if(!cose.length) return;      /* le due schede restano come Design le lascia */

    return Promise.all([chiHaCollegato(cose), leStanze(cose)]).then(function(due){
      cose.forEach(function(cosa, i){
        window.SpazioVivo.mostraContenuto(schedaDi(cosa, due[0], due[1]), i + 1);
        apriColTocco(cosa, i + 1);
      });
    });
  });
}

/* le tre letture. Se una tace, le altre due si vedono lo stesso:
   meglio una scheda in meno che la casa vuota per un permesso mancato. */
function ultimeCose(quante){
  return Promise.all([
    db.from("prodotti")
      .select("id,nome,nome_url,sottotitolo,scaffale,sottoscaffale,autore,persona_id,foto,creato_il")
      .eq("stato", PRODOTTI_PUBBLICO)
      .order("creato_il", {ascending:false}).limit(quante),

    db.from("vicinati")
      .select("id,nome,territorio,descrizione,foto,creato_da,lat,lon,creato_il")
      .eq("stato", "confermato")
      .order("creato_il", {ascending:false}).limit(quante),

    db.from("orme")
      .select("id,titolo,sottotitolo,contenuto,tipo,momento")
      .eq("visibilita", "pubblico")
      .order("momento", {ascending:false}).limit(quante)
  ]).then(function(esiti){
    var cose = [], p = esiti[0], v = esiti[1], o = esiti[2];

    if(!p.error && p.data) p.data.forEach(function(r){
      cose.push({ genere:"prodotto", quando:r.creato_il, foto:r.foto,
                  nome:r.nome, riga:r.sottotitolo, dato:r });
    });

    if(!v.error && v.data) v.data.forEach(function(r){
      cose.push({ genere:"vicinato", quando:r.creato_il, foto:r.foto,
                  nome:r.nome, riga:r.descrizione || r.territorio, dato:r });
    });

    if(!o.error && o.data) o.data.forEach(function(r){
      cose.push({ genere:"orma", quando:r.momento, foto:null,
                  nome:r.titolo, riga:r.sottotitolo || r.contenuto, dato:r });
    });

    cose.sort(function(a, b){ return istante(b.quando) - istante(a.quando); });
    return cose.slice(0, quante);
  }).catch(function(err){
    if(window.console) console.error("la casa: le ultime cose arrivate —", err);
    return [];
  });
}

function istante(t){
  var q = t ? Date.parse(t) : NaN;
  return isFinite(q) ? q : 0;      /* senza data si finisce in fondo */
}

/* chi ha collegato: una lettura sola per tutte le schede.

   ⛔ `persone` resta chiusa — dentro ci sono il telefono, i recapiti
      e i talenti. Il nome si prende da `persone_pubbliche`, la vista
      che espone soltanto id, nome e foto_url.

   Se la vista tace, la riga resta [ in attesa ] e il resto si vede. */
function chiHaCollegato(cose){
  var ids = [];
  cose.forEach(function(c){
    var id = personaDi(c);
    if(id && ids.indexOf(id) < 0) ids.push(id);
  });
  if(!ids.length) return Promise.resolve({});

  return db.from("persone_pubbliche").select("id,nome").in("id", ids).then(function(r){
    var per = {};
    if(!r.error && r.data) r.data.forEach(function(p){ per[p.id] = p.nome; });
    return per;
  }).catch(function(){ return {}; });
}

function personaDi(cosa){
  if(cosa.genere === "prodotto") return cosa.dato.persona_id;
  if(cosa.genere === "vicinato") return cosa.dato.creato_da;
  return null;
}

/* le stanze: i valori distinti di `elemento` nei collegamenti che
   partono da quel contenuto. Una lettura sola per tutte le schede,
   e la chiave che tiene insieme le due colonne è `da_tipo:da_id`. */
function leStanze(cose){
  var ids = cose.map(function(c){ return c.dato.id; }).filter(Boolean);
  if(!ids.length) return Promise.resolve({});

  return db.from("collegamenti").select("da_tipo,da_id,elemento")
    .in("da_id", ids).then(function(r){
    var per = {};
    if(!r.error && r.data) r.data.forEach(function(c){
      if(!c.elemento) return;
      var k = c.da_tipo + ":" + c.da_id;
      if(!per[k]) per[k] = [];
      if(per[k].indexOf(c.elemento) < 0) per[k].push(c.elemento);
    });
    return per;
  }).catch(function(){ return {}; });
}

/* l'elemento da cui il contenuto nasce. Un'orma lo dice per via
   indiretta: il suo `tipo` sta in DOVE, e DOVE porta l'elemento. */
function elementoDi(cosa){
  if(ELEMENTO_DEL_GENERE[cosa.genere]) return ELEMENTO_DEL_GENERE[cosa.genere];
  if(typeof DOVE === "undefined" || !DOVE) return null;
  for(var i = 0; i < DOVE.length; i++){
    if(DOVE[i].tipo === cosa.dato.tipo) return DOVE[i].el;
  }
  return null;
}

/* una cosa diventa il record che Design si aspetta.
   Nessun controllo sul vuoto: quello che manca lo tratta la forma. */
function schedaDi(cosa, chi, stanzePer){
  var d   = cosa.dato;
  var el  = elementoDi(cosa);
  var elementi = stanzePer[cosa.genere + ":" + d.id] || [];

  return {
    radice:      el,
    radiceNome:  STANZA[el],
    foto:        cosa.foto,
    cosa:        cosa.genere === "prodotto" ? [d.scaffale, d.sottoscaffale]
               : cosa.genere === "vicinato" ? ["vicinato", d.territorio]
               : [],
    titolo:      cosa.nome,
    sottotitolo: cosa.riga,
    chi:         d.autore,
    quando:      quandoScritto(cosa.quando),
    collegatoDa: chi[personaDi(cosa)],
    stanze:      elementi.map(function(e){
                   return { segno: e, nome: STANZA[e] };
                 })
  };
}

/* la data come si legge in italiano, con la mano del guscio */
function quandoScritto(t){
  return typeof dataIt === "function" ? dataIt(t) : t;
}

/* il tocco sulla scheda. La forma non cambia: cambia solo che si apre. */
function apriColTocco(cosa, quale){
  if(cosa.genere === "orma") return;     /* un'orma non si apre: resta com'è oggi */
  var card = document.querySelector('.sv-casa [data-cont="' + quale + '"]');
  if(!card) return;
  card.style.cursor = "pointer";
  card.addEventListener("click", function(){ apriCosa(cosa); });
}

/* dove porta il tocco */
function apriCosa(cosa){
  if(cosa.genere === "prodotto"){
    if(!cosa.dato.nome_url) return;
    if(typeof pagina !== "function" || typeof vai !== "function") return;
    window.pagineNomeChiesto = cosa.dato.nome_url;
    vai("pagina");
    return;
  }

  if(cosa.genere === "vicinato"){
    var v = cosa.dato;

    /* prima si guarda il libro, poi la mappa si posa e la scheda sale:
       la scheda vive dentro il libro, e il libro sta in cima alla casa */
    var libro = document.querySelector(".sv-casa [data-libro]");
    if(libro) libro.scrollIntoView({behavior:"smooth", block:"center"});

    var telaio = document.getElementById("sv-mappa");
    if(telaio && telaio.contentWindow && isFinite(+v.lat) && isFinite(+v.lon)){
      telaio.contentWindow.postMessage({q:"posa", lat:+v.lat, lon:+v.lon, k:9}, "*");
    }

    mostraVicinato(v, true);
  }
}
