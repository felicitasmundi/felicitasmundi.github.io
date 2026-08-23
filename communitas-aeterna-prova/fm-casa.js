/* ════════════════════════════════════════════════════════════════
   Comunità Eterna FelicitasMundi · LA CASA — la home dello Spazio Vivo

   Il disegno è di Design: casa-spazio-vivo.html
   115.104 byte · MD5 b96a69a04995b04273c3c3a05fc82539

   ⭐ Aggiornare la home vuol dire sostituire questo file, e basta.

   Non contiene: la barra, la plancia della radio, il Megafono, la
   mappa a tutto schermo, il piede. Quelle sono del guscio.

   Chiede al guscio due cose:
     · mappa-ferma.html accanto, con la sua cartella mappa-dati/
     · una funzione che apra la mappa a tutto schermo: la casa chiama
       window.SpazioVivo.apriMappa() se c'è, altrimenti lancia
       l'evento 'spazio-vivo:apri-mappa' sul documento.

   IL VELO SOPRA IL LIBRO. Il telaio ha pointer-events:none — serve,
   perché il velo raccolga il trascinamento e il dito continui a
   scorrere la pagina. Quindi il tocco sui segni non arriverebbe mai
   alla mappa: il velo glielo chiede.
     · il velo manda   postMessage({q:"tocca", x, y})   in coordinate del telaio
     · la mappa risponde postMessage({q:"toccato", trovato:true|false})
       e se ha trovato manda anche {q:"vicinato"}, che fa salire la scheda

   IL VUOTO HA DUE TEMPI. Con `trovato` falso — o senza risposta entro
   220 ms — il velo guarda la scheda: se è aperta la chiude e si ferma,
   perché chi legge merita che il tocco fuori chiuda la finestra. Se è
   già giù, apre la mappa a tutto schermo.

   ⚠️ Questo strato del velo — il ⭐ dentro il punto ⑦ — nessuna consegna
      di Design lo porta, nemmeno quella del 23 agosto 2026: nel
      disegno il tocco apre e basta. È rimesso qui parola per parola
      come stava. Il giorno che Design lo scrive nel disegno, questa
      nota cade.

   IL QUADRANTE DELLA MAPPA — legenda, formula, pratica. Arriva con la
   consegna del 22 agosto 2026, dentro il secondo foglio di Design:
     · window.SpazioVivo.mappaLegenda({simboli:[{segno,nome,cosa}],
                                       pratica:[{nome,riga} ×3]})
     · la formula è fissa e sta nel disegno: non cambia, non arriva
       da fuori
     · i sette nomi entrano dentro [data-leg], la legenda disegnata
       sopra la formula: senza dato quella resta com'è

   LA SCHEDA DEL LUOGO è una forma vuota: nel disegno non è scritto
   nessun dato. Design la fa salire e scendere, questo file la riempie.

     · window.SpazioVivo.mostraLuogo(record)
       la forma breve; con {piena:true} quella intera
     · window.SpazioVivo.chiudiLuogo()
     · window.SpazioVivo.formaPunto(svgDelSegno, nomeDelLuogo)
     · window.SpazioVivo.mostraVicinato(riga, piena)
       ⭐ la aggiunge questo file: prende una riga della tabella
       `vicinati`, legge cosa c'è dentro e chiama mostraLuogo()
     · dalla mappa in iframe:
       postMessage({q:"luogo",    luogo:record, piena:true})
       postMessage({q:"vicinato", vicinato:riga, piena:true})  ⭐
     · «vedi tutto» non naviga: lancia l'evento
       'spazio-vivo:vedi-tutto' con {luogo, elemento} — la rotta è
       del guscio, che oggi non l'ascolta ancora.

   LA VIA DI RITORNO, per chi entra nella mappa da una porta:
     · window.SpazioVivo.porta({nome, torna})   — mostra il tasto
     · window.SpazioVivo.chiudiPorta()          — lo toglie
     · senza 'torna' il tasto lancia 'spazio-vivo:torna'
     · dalla mappa in iframe: postMessage({q:"porta", porta:{nome}})

   Il record della scheda del luogo:
     { segno, occhiello, nome, luogo, descrizione, foto,
       elementi: [ { chiave, nome, colore, quante,
                     righe: [ { testo, etichetta, valore, foto } ] } ] }
   Da zero a cinque elementi; quello che manca diventa [ in attesa ].

   ⭐ LE DUE SCHEDE DEL CONTENUTO, sotto la mappa. Nuove col disegno del
      15 agosto 2026, e anch'esse forma vuota:
     · window.SpazioVivo.mostraContenuto(record, 1|2)
     · record: { radice, radiceNome, foto, cosa:[prima, seconda],
                 titolo, sottotitolo, chi, quando, collegatoDa,
                 stanze:[{segno, nome}] }   — da una a cinque stanze
     · i segni li disegna Design leggendo window.SpazioVivo.segni
     · quello che manca diventa [ in attesa ]: la forma se ne occupa
       da sé, e a vuoto si legge lo stesso

   ⭐ IL DATO ENTRA NELLE DUE SCHEDE. leOrme() legge le tre tabelle
      come prima, costruisce il record nella forma di Design e lo
      passa a mostraContenuto(). Nessun aggancio nuovo nel disegno:
      la scheda si trova da sé con `data-cont`. Il dettaglio — campo
      per campo, tabella per tabella — sta in fondo al file.

   ⛔ DUE FAMIGLIE DI SEGNI, e non si mescolano.
      I sette della legenda — orma, connessione, talenti, vicinato,
      ritmo, incontro, tempio — sono le FASI DI CRESCITA sulla mappa,
      e nella scheda del contenuto non entrano.
      Le STANZE sono le voci della barra a sinistra, e portano i
      simboli della barra: SIMBOLI del guscio, uno per elemento.
      Quelli vanno nel cerchio grande in cima e nella riga in fondo.
      segniDelleStanze() li aggiunge a window.SpazioVivo.segni sotto
      la chiave dell'elemento, e la funzione di Design non si tocca.

   ⛔ Niente involucro (function(){ … })(): il guscio mette tutto in
      comune e questo file legge da lì. Rimettendolo, home() non vede
      più le variabili del guscio e la pagina non si apre.
   ════════════════════════════════════════════════════════════════ */

/* il disegno, come consegnato: lo stile della casa e il suo corpo */

var CASA = `<style>
  .sv-casa,.sv-casa *,.sv-casa *::before,.sv-casa *::after{box-sizing:border-box}
  .sv-casa > section{min-width:0;max-width:100%}
  .sv-casa [data-scelta]:hover{border-color:rgba(200,160,85,0.5);color:#F5F0E6}
  .sv-casa [data-leg]{grid-template-columns:repeat(4,minmax(0,1fr))}
  .sv-casa [data-leg] > div{min-width:0;grid-template-columns:2.4rem minmax(0,1fr)}
  .sv-casa [data-leg] > div > span{min-width:0}
  .sv-casa [data-leg] b,.sv-casa [data-leg] i{min-width:0;overflow-wrap:break-word;hyphens:auto}
  .sv-casa button{font-family:'DM Sans',sans-serif}
  @media(max-width:40rem){
    .sv-casa [data-cappello] p{padding:0.9rem 1rem;font-size:var(--t-eti);line-height:1.5}
    .sv-casa [data-cappello] [data-luna-cap]{width:7rem;height:7rem;right:-2.2rem;top:-1.8rem;box-shadow:none}
    .sv-casa [data-cappello] canvas{opacity:0.3}
  }
  @media(max-width:34rem){ .sv-casa [data-porte]{gap:1rem} .sv-casa #sv-come{flex:1 1 100%} }
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
</style>

<div class="sv-casa" style="--scala:1.4;--navy:#0A0C1A;--oro:#C8A055;--oro-ch:#D4AF6A;--ivory:#F5F0E6;--line:rgba(184,150,62,0.2);--t-eti:calc(0.8125rem * var(--scala));--t-tas:calc(0.9375rem * var(--scala));--t-cor:calc(1.0625rem * var(--scala));--t-scr:calc(1.125rem * var(--scala));--t-tit:calc(1.5rem * var(--scala));--t-big:calc(1.9rem * var(--scala));max-width:56rem;width:100%;margin:0 auto;display:flex;flex-direction:column;color:#F5F0E6;font-family:'DM Sans',sans-serif;-webkit-font-smoothing:antialiased">

  <!-- IL CAPPELLO SOPRA LA MAPPA -->
  <section style="order:0;margin-top:1.2rem;min-width:0">
    <div data-cappello="1" style="position:relative;overflow:hidden;border:1px solid rgba(184,150,62,0.24);border-radius:0.8rem;background:rgba(10,12,26,0.34);backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px)">
      <!-- ③ la rete, dietro -->
      <canvas id="sv-rete0" style="position:absolute;inset:0;width:100%;height:100%;z-index:0;opacity:0.5"></canvas>
      <!-- ② la luna, tagliata dal bordo -->
      <span data-luna-cap="1" style="position:absolute;z-index:1;right:-3.4rem;top:-2.6rem;width:11rem;height:11rem;border-radius:50%;pointer-events:none;background:radial-gradient(circle at 38% 34%,rgba(245,240,230,0.14),rgba(245,240,230,0.05) 58%,transparent 72%);box-shadow:inset -0.6rem -0.4rem 2.4rem rgba(2,4,12,0.55)"></span>
      <div style="position:absolute;inset:0;z-index:2;pointer-events:none;background:linear-gradient(90deg,rgba(2,4,12,0.62),rgba(2,4,12,0.24))"></div>
      <!-- ① la scritta, davanti -->
      <div style="position:relative;z-index:3;padding:1.5rem 1.4rem 1.4rem;max-width:38rem">
        <p style="margin:0;font-family:'Cinzel',serif;font-weight:500;font-size:var(--t-cor);letter-spacing:0.05em;line-height:1.4;color:var(--oro-ch);text-shadow:0 2px 14px rgba(2,4,12,0.95)">FelicitasMundi è come una rete di miceli</p>
        <p style="margin:0.4rem 0 0;font-family:'Cormorant Garamond',serif;font-style:italic;font-size:var(--t-cor);line-height:1.55;color:var(--ivory);text-shadow:0 2px 14px rgba(2,4,12,0.95)">Persone reali che condividono da luoghi connessi.</p>
      </div>
    </div>
  </section>

  <!-- IL LIBRO CON LA MAPPA -->
  <section style="order:1;margin-top:1.2rem">
    <h2 style="font-family:'Cinzel',serif;font-weight:500;font-size:var(--t-tit);letter-spacing:0.08em;text-transform:uppercase;color:var(--ivory);margin:0 0 0.9rem">Collega le tue orme</h2>
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
      <div data-rete="1" style="position:relative;min-width:0;margin-top:0.75rem;border:1px solid rgba(184,150,62,0.28);border-radius:0.6rem;overflow:hidden;background:rgba(10,12,26,0.34);backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px)">
      <canvas id="sv-rete3" style="position:absolute;inset:0;width:100%;height:100%;z-index:0;opacity:0.85"></canvas>
      <div style="position:absolute;inset:0;z-index:1;pointer-events:none;background:radial-gradient(ellipse at 50% 50%,rgba(2,4,12,0.5),rgba(2,4,12,0.14) 70%)"></div>
      <div style="position:relative;z-index:2;min-width:0;padding:1.2rem 1.1rem 1.1rem">
        <div style="font-family:'DM Sans',sans-serif;font-size:var(--t-eti);letter-spacing:0.2em;text-transform:uppercase;color:var(--oro-ch);margin-bottom:0.9rem">Legenda</div>
        <div data-leg="1" style="display:grid;gap:0.8rem 1.6rem">
    
            <div style="display:grid;grid-template-columns:2.9rem minmax(0,1fr);gap:0.8rem;align-items:center;min-width:0">
              <span style="width:2.4rem;height:2.4rem;color:var(--oro-ch)"><svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" style="width:100%;height:100%;display:block"><path d="M24.5 20C24.5 22.54 22.54 24.5 20 24.5C17.46 24.5 15.5 22.54 15.5 20C15.5 17.46 17.46 15.5 20 15.5C22.54 15.5 24.5 17.46 24.5 20Z"></path><path d="M31 20C31 26.21 26.21 31 20 31C13.79 31 9 26.21 9 20C9 13.79 13.79 9 20 9C26.21 9 31 13.79 31 20Z"></path></svg></span>
              <span><b style="display:block;font-size:var(--t-tas);font-weight:500;line-height:1.25;text-shadow:0 2px 14px rgba(2,4,12,0.95)">orma</b><i style="display:block;font-family:'Cormorant Garamond',serif;font-size:var(--t-cor);color:rgba(245,240,230,0.86);line-height:1.35;text-shadow:0 2px 14px rgba(2,4,12,0.95)">le tracce del sentiero</i></span>
            </div>
    
            <div style="display:grid;grid-template-columns:2.9rem minmax(0,1fr);gap:0.8rem;align-items:center;min-width:0">
              <span style="width:2.4rem;height:2.4rem;color:var(--oro-ch)"><svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" style="width:100%;height:100%;display:block"><path d="M14 20C14 22.26 12.26 24 10 24C7.74 24 6 22.26 6 20C6 17.74 7.74 16 10 16C12.26 16 14 17.74 14 20Z"></path><path d="M34 20C34 22.26 32.26 24 30 24C27.74 24 26 22.26 26 20C26 17.74 27.74 16 30 16C32.26 16 34 17.74 34 20Z"></path><path d="M14 20L26 20"></path></svg></span>
              <span><b style="display:block;font-size:var(--t-tas);font-weight:500;line-height:1.25;text-shadow:0 2px 14px rgba(2,4,12,0.95)">connessione</b><i style="display:block;font-family:'Cormorant Garamond',serif;font-size:var(--t-cor);color:rgba(245,240,230,0.86);line-height:1.35;text-shadow:0 2px 14px rgba(2,4,12,0.95)">espandere la rete</i></span>
            </div>
    
            <div style="display:grid;grid-template-columns:2.9rem minmax(0,1fr);gap:0.8rem;align-items:center;min-width:0">
              <span style="width:2.4rem;height:2.4rem;color:var(--oro-ch)"><svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" style="width:100%;height:100%;display:block"><circle cx="20" cy="20" r="14"></circle><circle cx="20" cy="20" r="11.2"></circle><path d="M20 12.5 L26 15.7 L26 24.3 L20 27.5 L14 24.3 L14 15.7 Z"></path><path d="M20 12.5 L20 20 M20 20 L26 15.7 M20 20 L14 15.7 M20 20 L20 27.5"></path></svg></span>
              <span><b style="display:block;font-size:var(--t-tas);font-weight:500;line-height:1.25;text-shadow:0 2px 14px rgba(2,4,12,0.95)">talenti</b><i style="display:block;font-family:'Cormorant Garamond',serif;font-size:var(--t-cor);color:rgba(245,240,230,0.86);line-height:1.35;text-shadow:0 2px 14px rgba(2,4,12,0.95)">lo scambio comune</i></span>
            </div>
    
            <div style="display:grid;grid-template-columns:2.9rem minmax(0,1fr);gap:0.8rem;align-items:center;min-width:0">
              <span style="width:2.4rem;height:2.4rem;color:var(--oro-ch)"><svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" style="width:100%;height:100%;display:block"><path d="M23.4 10C23.4 11.92 21.92 13.4 20 13.4C18.08 13.4 16.6 11.92 16.6 10C16.6 8.08 18.08 6.6 20 6.6C21.92 6.6 23.4 8.08 23.4 10Z"></path><path d="M13.9 27C13.9 28.92 12.42 30.4 10.5 30.4C8.58 30.4 7.1 28.92 7.1 27C7.1 25.08 8.58 23.6 10.5 23.6C12.42 23.6 13.9 25.08 13.9 27Z"></path><path d="M32.9 27C32.9 28.92 31.42 30.4 29.5 30.4C27.58 30.4 26.1 28.92 26.1 27C26.1 25.08 27.58 23.6 29.5 23.6C31.42 23.6 32.9 25.08 32.9 27Z"></path><path d="M20 13.4L20 19M13 25.2L17.4 20.8M27 25.2L22.6 20.8"></path><path d="M22 20C22 21.13 21.13 22 20 22C18.87 22 18 21.13 18 20C18 18.87 18.87 18 20 18C21.13 18 22 18.87 22 20Z" fill="currentColor" stroke="none"></path></svg></span>
              <span><b style="display:block;font-size:var(--t-tas);font-weight:500;line-height:1.25;text-shadow:0 2px 14px rgba(2,4,12,0.95)">vicinato</b><i style="display:block;font-family:'Cormorant Garamond',serif;font-size:var(--t-cor);color:rgba(245,240,230,0.86);line-height:1.35;text-shadow:0 2px 14px rgba(2,4,12,0.95)">la forza comune</i></span>
            </div>
    
            <div style="display:grid;grid-template-columns:2.9rem minmax(0,1fr);gap:0.8rem;align-items:center;min-width:0">
              <span style="width:2.4rem;height:2.4rem;color:var(--oro-ch)"><svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" style="width:100%;height:100%;display:block"><path d="M33 20C33 27.33 27.33 33 20 33C12.67 33 7 27.33 7 20C7 12.67 12.67 7 20 7C27.33 7 33 12.67 33 20Z"></path><path d="M22.4 7C22.4 8.35 21.35 9.4 20 9.4C18.65 9.4 17.6 8.35 17.6 7C17.6 5.65 18.65 4.6 20 4.6C21.35 4.6 22.4 5.65 22.4 7Z" fill="currentColor" stroke="none"></path><path d="M33.7 26.5C33.7 27.85 32.65 28.9 31.3 28.9C29.95 28.9 28.9 27.85 28.9 26.5C28.9 25.15 29.95 24.1 31.3 24.1C32.65 24.1 33.7 25.15 33.7 26.5Z" fill="currentColor" stroke="none"></path><path d="M11.1 26.5C11.1 27.85 10.05 28.9 8.7 28.9C7.35 28.9 6.3 27.85 6.3 26.5C6.3 25.15 7.35 24.1 8.7 24.1C10.05 24.1 11.1 25.15 11.1 26.5Z" fill="currentColor" stroke="none"></path><path d="M23.2 20C23.2 21.81 21.81 23.2 20 23.2C18.19 23.2 16.8 21.81 16.8 20C16.8 18.19 18.19 16.8 20 16.8C21.81 16.8 23.2 18.19 23.2 20Z"></path></svg></span>
              <span><b style="display:block;font-size:var(--t-tas);font-weight:500;line-height:1.25;text-shadow:0 2px 14px rgba(2,4,12,0.95)">ritmo</b><i style="display:block;font-family:'Cormorant Garamond',serif;font-size:var(--t-cor);color:rgba(245,240,230,0.86);line-height:1.35;text-shadow:0 2px 14px rgba(2,4,12,0.95)">feste, formazioni, esperienze</i></span>
            </div>
    
            <div style="display:grid;grid-template-columns:2.9rem minmax(0,1fr);gap:0.8rem;align-items:center;min-width:0">
              <span style="width:2.4rem;height:2.4rem;color:var(--oro-ch)"><svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" style="width:100%;height:100%;display:block"><path d="M23 20C23 25.08 19.08 29 14 29C8.92 29 5 25.08 5 20C5 14.92 8.92 11 14 11C19.08 11 23 14.92 23 20Z"></path><path d="M35 20C35 25.08 31.08 29 26 29C20.92 29 17 25.08 17 20C17 14.92 20.92 11 26 11C31.08 11 35 14.92 35 20Z"></path><path d="M20 12.9C22 17.63 22 22.37 20 27.1C18 22.37 18 17.63 20 12.9Z"></path></svg></span>
              <span><b style="display:block;font-size:var(--t-tas);font-weight:500;line-height:1.25;text-shadow:0 2px 14px rgba(2,4,12,0.95)">incontro</b><i style="display:block;font-family:'Cormorant Garamond',serif;font-size:var(--t-cor);color:rgba(245,240,230,0.86);line-height:1.35;text-shadow:0 2px 14px rgba(2,4,12,0.95)">relazione tra vicinati</i></span>
            </div>
    
            <div style="display:grid;grid-template-columns:2.9rem minmax(0,1fr);gap:0.8rem;align-items:center;min-width:0">
              <span style="width:2.4rem;height:2.4rem;color:var(--oro-ch)"><svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" style="width:100%;height:100%;display:block"><path d="M4 14L20 5L36 14Z"></path><path d="M5 16.5L35 16.5M8.5 19L8.5 31M16 19L16 31M24 19L24 31M31.5 19L31.5 31M5 33.5L35 33.5"></path><path d="M20 29.5C17.67 26.83 17.33 23.67 19 20C19.4 22.27 20 23.6 20.8 24C22.13 22.8 22.63 21.47 22.3 20C23.97 22.67 24.37 25.07 23.5 27.2C22.9 28.47 21.73 29.23 20 29.5Z" fill="currentColor" stroke="none"></path></svg></span>
              <span><b style="display:block;font-size:var(--t-tas);font-weight:500;line-height:1.25;text-shadow:0 2px 14px rgba(2,4,12,0.95)">tempio</b><i style="display:block;font-family:'Cormorant Garamond',serif;font-size:var(--t-cor);color:rgba(245,240,230,0.86);line-height:1.35;text-shadow:0 2px 14px rgba(2,4,12,0.95)">luoghi sacri custoditi</i></span>
            </div>
        </div>

          <div class="sv-mleg" style="max-width:none;margin:0">
            <!-- LA FORMULA -->
          <div class="liv">
            <div class="occhio">La formula</div>
            <div class="form">
              <div class="sopra">
                <span class="gruppo"><span class="par">(</span><span class="cinque">
                  <span class="el" style="--c:var(--terra)">Terra</span>
                  <span class="piu">+</span>
                  <span class="el" style="--c:var(--acqua)">Acqua</span>
                  <span class="piu">+</span>
                  <span class="el" style="--c:var(--fuoco)">Fuoco</span>
                  <span class="piu">+</span>
                  <span class="el" style="--c:var(--aria)">Aria</span>
                  <span class="piu">+</span>
                  <span class="el" style="--c:var(--etere)">Etere</span>
                  <span class="piu">+</span>
                  <span class="el" style="--c:var(--svil)">Sviluppo</span>
                </span><span class="par">)</span></span>
                <span class="volte"><span class="per">&times;</span><span class="nexus">Nexus</span></span>
              </div>
              <div class="barra"></div>
              <div class="sotto">falso ego</div>
            </div>
          </div>

            <!-- IN PRATICA -->
          <div class="liv">
            <div class="occhio">In pratica</div>
            <div class="pratica">

              <div class="pr" data-pr="0">
                <span class="sg"><svg viewBox="0 0 60 60" fill="none" stroke="currentColor"
                  stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M2 50 C14 45 26 52 38 47 C46 44 52 48 58 45" opacity=".65"/>
                  <path d="M2 56 C14 51 26 58 38 53 C46 50 52 54 58 51" opacity=".25"/>
                  <g transform="translate(-4,4) scale(0.9)">
                    <path d="M28 51 C22 51 19 47 20 43 C21 39 26 38 26 34 C26 29 21 27 21 24 C21 20 25 18 30 18 C35 18 39 20 39 24 C39 29 36 33 36 38 C36 44 34 51 28 51Z"/>
                    <circle cx="22" cy="12" r="3.2"/>
                    <circle cx="28.5" cy="9.6" r="2.4"/>
                    <circle cx="33.5" cy="10" r="2.1"/>
                    <circle cx="37.5" cy="11.6" r="1.8"/>
                    <circle cx="40.5" cy="14.2" r="1.5"/>
                  </g>
                  <g transform="translate(33,3) scale(0.5)" opacity=".45">
                    <path d="M28 51 C22 51 19 47 20 43 C21 39 26 38 26 34 C26 29 21 27 21 24 C21 20 25 18 30 18 C35 18 39 20 39 24 C39 29 36 33 36 38 C36 44 34 51 28 51Z"/>
                    <circle cx="22" cy="12" r="3.2"/>
                    <circle cx="28.5" cy="9.6" r="2.4"/>
                    <circle cx="33.5" cy="10" r="2.1"/>
                    <circle cx="37.5" cy="11.6" r="1.8"/>
                    <circle cx="40.5" cy="14.2" r="1.5"/>
                  </g>
                  <g transform="translate(20,-2) scale(0.3)" opacity=".2">
                    <path d="M28 51 C22 51 19 47 20 43 C21 39 26 38 26 34 C26 29 21 27 21 24 C21 20 25 18 30 18 C35 18 39 20 39 24 C39 29 36 33 36 38 C36 44 34 51 28 51Z"/>
                    <circle cx="22" cy="12" r="3.2"/>
                    <circle cx="28.5" cy="9.6" r="2.4"/>
                    <circle cx="33.5" cy="10" r="2.1"/>
                  </g>
                </svg></span>
                <b>L&rsquo;intreccio di orme</b>
                <span data-riga="0"></span>
              </div>

              <div class="pr" data-pr="1">
                <span class="sg"><svg viewBox="0 0 60 60" fill="none" stroke="currentColor"
                  stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M5 10 L55 10 L55 44 L5 44Z"/>
                  <path d="M21.7 10 L21.7 44 M38.3 10 L38.3 44" opacity=".45"/>
                  <path d="M5 19 L55 19" opacity=".45"/>
                  <path d="M10 27 L17 27 M26 27 L34 27 M43 27 L50 27" opacity=".28"/>
                  <path d="M10 35 L17 35 M26 35 L34 35" opacity=".28"/>
                  <path d="M3 51 L11 43 C13 41 16 43 14 45 L19 40 C21 38 24 40 22 42 L18 46 C15 50 9 52 5 52Z"/>
                  <path d="M57 51 L49 43 C47 41 44 43 46 45 L41 40 C39 38 36 40 38 42 L42 46 C45 50 51 52 55 52Z" opacity=".65"/>
                </svg></span>
                <b>Gestionale condiviso, per cooperare</b>
                <span data-riga="1"></span>
              </div>

              <div class="pr" data-pr="2">
                <span class="sg"><svg viewBox="0 0 60 60" fill="none" stroke="currentColor"
                  stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M11 22 C19 19 24 24 26 31"/>
                  <path d="M26 31 C33 26 41 27 45 33" opacity=".9"/>
                  <path d="M45 33 C50 28 52 22 50 15" opacity=".75"/>
                  <path d="M26 31 C24 39 27 45 34 48" opacity=".85"/>
                  <path d="M11 22 C7 28 8 35 13 40" opacity=".7"/>
                  <path d="M13 40 C19 43 24 43 27 40" opacity=".55"/>
                  <path d="M45 33 C46 40 43 45 38 47" opacity=".6"/>
                  <path d="M11 22 C13 16 18 12 24 11" opacity=".55"/>
                  <path d="M50 15 C52 11 55 9 58 9" opacity=".35"/>
                  <path d="M34 48 C36 52 40 54 44 54" opacity=".35"/>
                  <path d="M13 40 C10 45 6 47 2 47" opacity=".3"/>
                  <circle cx="11" cy="22" r="2.6" fill="currentColor" stroke="none"/>
                  <circle cx="26" cy="31" r="3" fill="currentColor" stroke="none"/>
                  <circle cx="45" cy="33" r="2.6" fill="currentColor" stroke="none" opacity=".9"/>
                  <circle cx="50" cy="15" r="2.2" fill="currentColor" stroke="none" opacity=".8"/>
                  <circle cx="34" cy="48" r="2.4" fill="currentColor" stroke="none" opacity=".85"/>
                  <circle cx="13" cy="40" r="2.2" fill="currentColor" stroke="none" opacity=".8"/>
                  <circle cx="24" cy="11" r="1.9" fill="currentColor" stroke="none" opacity=".6"/>
                </svg></span>
                <b>Contenuti interconnessi</b>
                <span data-riga="2"></span>
              </div>

            </div>
          </div>
          </div>
    
        </div>
      </div>

    </div>
  </section>

  <!-- LE DUE PORTE — la prima è la porta, la seconda una soglia di servizio -->
  <section data-porte="1" style="order:3;margin:2rem 0 0.4rem;min-width:0;display:flex;align-items:center;gap:1.4rem;flex-wrap:wrap">
    <a id="sv-come" href="come-funziona.html" style="flex:0 1 auto;display:flex;align-items:center;justify-content:space-between;gap:1.4rem;min-width:0;text-decoration:none;border:1px solid var(--oro);border-radius:0.8rem;background:linear-gradient(135deg,rgba(200,160,85,0.26),rgba(200,160,85,0.1));box-shadow:0 0.6rem 1.6rem rgba(2,4,12,0.5),inset 0 1px 0 rgba(245,240,230,0.16);padding:1.15rem 1.6rem">
      <span style="min-width:0;font-family:'Cinzel',serif;font-weight:500;font-size:var(--t-cor);letter-spacing:0.04em;color:var(--ivory);line-height:1.25">Come funziona</span>
      <span style="flex:none;font-size:var(--t-cor);color:var(--oro-ch);line-height:1">→</span>
    </a>
    <a id="sv-spazio" href="come-funziona.html" style="flex:none;font-family:'DM Sans',sans-serif;font-size:var(--t-eti);color:rgba(245,240,230,0.7);text-decoration:none;border-bottom:1px solid rgba(200,160,85,0.28);padding-bottom:0.15rem;white-space:nowrap">Il tuo spazio →</a>
  </section>

  <!-- COSA INCONTRI · le due pastiglie -->
  <section style="order:4;margin-top:2.6rem">
    <div style="display:flex;gap:0.9rem;flex-wrap:wrap;align-items:center">
      <h2 style="font-family:'Cinzel',serif;font-weight:500;font-size:var(--t-tit);letter-spacing:0.08em;text-transform:uppercase;color:var(--ivory);margin:0">Cosa incontri</h2>
      <div style="display:flex;align-items:center;gap:0.55rem;border:1px solid var(--line);border-radius:999px;padding:0.34rem 0.7rem;background:rgba(245,240,230,0.03)">
        <span style="font-family:'DM Sans',sans-serif;font-size:var(--t-eti);letter-spacing:0.16em;text-transform:uppercase;color:var(--oro-ch);line-height:1">il tempo</span>
        <span style="font-family:'Cinzel',serif;font-size:var(--t-eti);color:var(--ivory);line-height:1" id="sv-mese"></span>
      </div>
      <div style="display:flex;align-items:center;gap:0.55rem;border:1px solid var(--line);border-radius:999px;padding:0.34rem 0.7rem;background:rgba(245,240,230,0.03)">
        <span style="font-family:'DM Sans',sans-serif;font-size:var(--t-eti);letter-spacing:0.16em;text-transform:uppercase;color:var(--oro-ch);line-height:1">il cielo</span>
        <span style="flex:0 0 auto;width:1.15rem;height:1.15rem;color:var(--oro-ch);display:block">
          <svg viewBox="0 0 40 40" style="width:100%;height:100%;display:block">
            <circle cx="20" cy="20" r="15" fill="none" stroke="rgba(200,160,85,0.35)" stroke-width="2"></circle>
            <path id="sv-luna" fill="currentColor" opacity="0.92"></path>
          </svg>
        </span>
      </div>
    </div>
  </section>

  <!-- LA RIGA CHE SCEGLIE -->
  <section style="order:5;margin-top:1.6rem;display:flex;flex-direction:column;gap:0.7rem">
    <div style="display:flex;align-items:center;gap:0.9rem;flex-wrap:wrap">
      <span style="flex:0 0 4.5rem;font-size:var(--t-eti);letter-spacing:0.2em;text-transform:uppercase;color:var(--oro-ch)">cosa</span>
      <div style="display:flex;gap:0.45rem;flex-wrap:wrap">
        <button style="border:1px solid var(--oro);background:rgba(200,160,85,0.18);color:var(--ivory);border-radius:999px;padding:0.4rem 0.9rem;font-family:'DM Sans',sans-serif;font-size:var(--t-eti);cursor:pointer">tutto</button>
        <button style="border:1px solid var(--line);background:none;color:rgba(245,240,230,0.82);border-radius:999px;padding:0.4rem 0.9rem;font-family:'DM Sans',sans-serif;font-size:var(--t-eti);cursor:pointer" data-scelta="1">prodotti</button>
        <button style="border:1px solid var(--line);background:none;color:rgba(245,240,230,0.82);border-radius:999px;padding:0.4rem 0.9rem;font-family:'DM Sans',sans-serif;font-size:var(--t-eti);cursor:pointer" data-scelta="1">feste</button>
        <button style="border:1px solid var(--line);background:none;color:rgba(245,240,230,0.82);border-radius:999px;padding:0.4rem 0.9rem;font-family:'DM Sans',sans-serif;font-size:var(--t-eti);cursor:pointer" data-scelta="1">lezioni</button>
        <button style="border:1px solid var(--line);background:none;color:rgba(245,240,230,0.82);border-radius:999px;padding:0.4rem 0.9rem;font-family:'DM Sans',sans-serif;font-size:var(--t-eti);cursor:pointer" data-scelta="1">assistenza</button>
        <button style="border:1px solid var(--line);background:none;color:rgba(245,240,230,0.82);border-radius:999px;padding:0.4rem 0.9rem;font-family:'DM Sans',sans-serif;font-size:var(--t-eti);cursor:pointer" data-scelta="1">orme</button>
      </div>
    </div>
    <div style="display:flex;align-items:center;gap:0.9rem;flex-wrap:wrap">
      <span style="flex:0 0 4.5rem;font-size:var(--t-eti);letter-spacing:0.2em;text-transform:uppercase;color:var(--oro-ch)">quando</span>
      <div style="display:flex;gap:0.45rem;flex-wrap:wrap">
        <button style="border:1px solid var(--oro);background:rgba(200,160,85,0.18);color:var(--ivory);border-radius:999px;padding:0.4rem 0.9rem;font-family:'DM Sans',sans-serif;font-size:var(--t-eti);cursor:pointer">questa settimana</button>
        <button style="border:1px solid var(--line);background:none;color:rgba(245,240,230,0.82);border-radius:999px;padding:0.4rem 0.9rem;font-family:'DM Sans',sans-serif;font-size:var(--t-eti);cursor:pointer" data-scelta="1">quest'anno</button>
        <button style="border:1px solid var(--line);background:none;color:rgba(245,240,230,0.82);border-radius:999px;padding:0.4rem 0.9rem;font-family:'DM Sans',sans-serif;font-size:var(--t-eti);cursor:pointer" data-scelta="1">sempre</button>
      </div>
    </div>
  </section>

  <!-- LE SCHEDE DEI CONTENUTI — forma vuota: le riempie il dato -->
  <section style="order:6;display:grid;grid-template-columns:repeat(auto-fit,minmax(19rem,1fr));gap:1.1rem;margin-top:1.8rem;align-items:stretch">

    <article data-cont="1" style="border:1px solid var(--line);border-radius:0.9rem;overflow:hidden;background:rgba(245,240,230,0.03);display:flex;flex-direction:column;min-width:0">

      <!-- ② l'immagine — se manca, il riquadro resta -->
      <div data-c-foto="1" style="position:relative;height:15rem;background:repeating-linear-gradient(135deg,rgba(245,240,230,0.05) 0 8px,rgba(245,240,230,0.02) 8px 16px);display:flex;align-items:center;justify-content:center;font-family:ui-monospace,monospace;font-size:var(--t-eti);color:rgba(245,240,230,0.55);text-align:center;padding:0 1rem"></div>

      <div style="display:flex;gap:0.9rem;align-items:flex-start;padding:1rem 1.1rem 0;min-width:0">

        <!-- ① il cerchio della radice: il segno dell'elemento da cui il contenuto nasce -->
        <span data-c-radice="1" title="" style="flex:0 0 auto;width:2.6rem;height:2.6rem;border-radius:50%;border:1px solid rgba(200,160,85,0.45);background:rgba(200,160,85,0.08);color:var(--oro-ch);display:grid;place-items:center;padding:0.45rem"></span>

        <div style="min-width:0;display:flex;flex-direction:column;gap:0.2rem">
          <!-- ③ che cosa è — due parole, la seconda può mancare -->
          <span data-c-cosa="1" style="font-family:'DM Sans',sans-serif;font-size:var(--t-eti);letter-spacing:0.14em;text-transform:uppercase;color:var(--oro-ch);line-height:1.4"></span>
          <!-- ④ il titolo -->
          <b data-c-titolo="1" style="font-family:'Cinzel',serif;font-weight:500;font-size:var(--t-cor);color:var(--ivory);line-height:1.3"></b>
          <!-- ⑤ il sottotitolo -->
          <i data-c-sotto="1" style="font-family:'Cormorant Garamond',serif;font-style:italic;font-size:var(--t-cor);color:rgba(245,240,230,0.88);line-height:1.45"></i>
          <!-- ⑥ chi è · ⑦ quando -->
          <span data-c-chi="1" style="font-family:'DM Sans',sans-serif;font-size:var(--t-eti);color:rgba(245,240,230,0.86);line-height:1.45;margin-top:0.25rem"></span>
          <span data-c-quando="1" style="font-family:'DM Sans',sans-serif;font-size:var(--t-eti);color:rgba(245,240,230,0.7);line-height:1.45"></span>
        </div>
      </div>

      <div style="margin-top:auto;padding:1rem 1.1rem 1.1rem 4.6rem;min-width:0">
        <!-- ⑧ collegato da -->
        <div data-c-collegato="1" style="display:flex;align-items:center;gap:0.5rem;font-family:'DM Sans',sans-serif;font-size:var(--t-eti);color:rgba(245,240,230,0.78);line-height:1.4;min-width:0"></div>
        <!-- ⑨ a quali stanze è collegato — da uno a cinque -->
        <div data-c-stanze="1" style="display:flex;gap:0.4rem;flex-wrap:wrap;align-items:center;margin-top:0.7rem;padding-top:0.7rem;border-top:1px solid rgba(184,150,62,0.16)"></div>
      </div>
    </article>

    <article data-cont="2" style="border:1px solid var(--line);border-radius:0.9rem;overflow:hidden;background:rgba(245,240,230,0.03);display:flex;flex-direction:column;min-width:0">

      <!-- ② l'immagine — se manca, il riquadro resta -->
      <div data-c-foto="1" style="position:relative;height:15rem;background:repeating-linear-gradient(135deg,rgba(245,240,230,0.05) 0 8px,rgba(245,240,230,0.02) 8px 16px);display:flex;align-items:center;justify-content:center;font-family:ui-monospace,monospace;font-size:var(--t-eti);color:rgba(245,240,230,0.55);text-align:center;padding:0 1rem"></div>

      <div style="display:flex;gap:0.9rem;align-items:flex-start;padding:1rem 1.1rem 0;min-width:0">

        <!-- ① il cerchio della radice: il segno dell'elemento da cui il contenuto nasce -->
        <span data-c-radice="1" title="" style="flex:0 0 auto;width:2.6rem;height:2.6rem;border-radius:50%;border:1px solid rgba(200,160,85,0.45);background:rgba(200,160,85,0.08);color:var(--oro-ch);display:grid;place-items:center;padding:0.45rem"></span>

        <div style="min-width:0;display:flex;flex-direction:column;gap:0.2rem">
          <!-- ③ che cosa è — due parole, la seconda può mancare -->
          <span data-c-cosa="1" style="font-family:'DM Sans',sans-serif;font-size:var(--t-eti);letter-spacing:0.14em;text-transform:uppercase;color:var(--oro-ch);line-height:1.4"></span>
          <!-- ④ il titolo -->
          <b data-c-titolo="1" style="font-family:'Cinzel',serif;font-weight:500;font-size:var(--t-cor);color:var(--ivory);line-height:1.3"></b>
          <!-- ⑤ il sottotitolo -->
          <i data-c-sotto="1" style="font-family:'Cormorant Garamond',serif;font-style:italic;font-size:var(--t-cor);color:rgba(245,240,230,0.88);line-height:1.45"></i>
          <!-- ⑥ chi è · ⑦ quando -->
          <span data-c-chi="1" style="font-family:'DM Sans',sans-serif;font-size:var(--t-eti);color:rgba(245,240,230,0.86);line-height:1.45;margin-top:0.25rem"></span>
          <span data-c-quando="1" style="font-family:'DM Sans',sans-serif;font-size:var(--t-eti);color:rgba(245,240,230,0.7);line-height:1.45"></span>
        </div>
      </div>

      <div style="margin-top:auto;padding:1rem 1.1rem 1.1rem 4.6rem;min-width:0">
        <!-- ⑧ collegato da -->
        <div data-c-collegato="1" style="display:flex;align-items:center;gap:0.5rem;font-family:'DM Sans',sans-serif;font-size:var(--t-eti);color:rgba(245,240,230,0.78);line-height:1.4;min-width:0"></div>
        <!-- ⑨ a quali stanze è collegato — da uno a cinque -->
        <div data-c-stanze="1" style="display:flex;gap:0.4rem;flex-wrap:wrap;align-items:center;margin-top:0.7rem;padding-top:0.7rem;border-top:1px solid rgba(184,150,62,0.16)"></div>
      </div>
    </article>

  </section>


  <!-- IL PRATICANTATO -->
  <section data-antah="1" style="order:7;margin-top:2.6rem;min-width:0">
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

  <section style="order:9;margin-top:2.6rem;min-width:0">
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

</div>
`;

function home(c){
  c.innerHTML = CASA;
  avviaCasa();
  avviaLegenda();       /* il quadrante della mappa: legenda, formula, pratica */
  segniDelleStanze();   /* i simboli della barra entrano fra quelli di Design */
  legaLuoghi();
  contaOrme();          /* il cenno delle orme vive nella barra, non nella casa */
  leOrme();             /* le due schede sotto la mappa: il dato entra nella forma */
}

/* ── il codice della casa, come l'ha scritto Design: non si tocca ──
   Chiede al guscio window.SpazioVivo.apriMappa(), e se non la trova
   lancia 'spazio-vivo:apri-mappa' sul documento. Qui dentro nascono
   la scheda del luogo e le due schede del contenuto: salgono, scendono,
   e si riempiono con quello che viene passato loro.
   L'unica mano su questo blocco è lo strato ⭐ del velo, dentro il
   punto ⑦: sta scritto in testa al file. */
function avviaCasa(){
(function () {
  "use strict";

  /* ① il tempo — il mese di quello che si sta guardando */
  var MESI = ["gennaio","febbraio","marzo","aprile","maggio","giugno","luglio",
              "agosto","settembre","ottobre","novembre","dicembre"];
  var ora = new Date();
  var eMese = document.getElementById("sv-mese");
  if (eMese) eMese.textContent = MESI[ora.getMonth()] + " " + ora.getFullYear();

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

  /* ④ LA SCHEDA DEL CONTENUTO. Nessun dato scritto qui: la forma si riempie.
        window.SpazioVivo.mostraContenuto(record, quale)  — quale: 1 o 2
        record = {
          radice,                  // ① uno dei sette: orma connessione talenti
                                   //    vicinato ritmo incontro tempio
          radiceNome,              //    come si chiama la stanza radice
          foto,                    // ②
          cosa: [prima, seconda],  // ③ la seconda può mancare
          titolo,                  // ④
          sottotitolo,             // ⑤
          chi,                     // ⑥ l'autore
          quando,                  // ⑦
          collegatoDa,             // ⑧
          stanze: [ {segno, nome} ]// ⑨ da uno a cinque
        }
        Quello che manca diventa [ in attesa ]; il posto resta. */
  (function () {
    var SEGNI = {
      orma:'<path d="M24.5 20C24.5 22.54 22.54 24.5 20 24.5C17.46 24.5 15.5 22.54 15.5 20C15.5 17.46 17.46 15.5 20 15.5C22.54 15.5 24.5 17.46 24.5 20Z"/><path d="M31 20C31 26.21 26.21 31 20 31C13.79 31 9 26.21 9 20C9 13.79 13.79 9 20 9C26.21 9 31 13.79 31 20Z"/>',
      connessione:'<path d="M14 20C14 22.26 12.26 24 10 24C7.74 24 6 22.26 6 20C6 17.74 7.74 16 10 16C12.26 16 14 17.74 14 20Z"/><path d="M34 20C34 22.26 32.26 24 30 24C27.74 24 26 22.26 26 20C26 17.74 27.74 16 30 16C32.26 16 34 17.74 34 20Z"/><path d="M14 20L26 20"/>',
      talenti:'<circle cx="20" cy="20" r="14"/><circle cx="20" cy="20" r="11.2"/><path d="M20 12.5 L26 15.7 L26 24.3 L20 27.5 L14 24.3 L14 15.7 Z"/><path d="M20 12.5 L20 20 M20 20 L26 15.7 M20 20 L14 15.7 M20 20 L20 27.5"/>',
      vicinato:'<path d="M23.4 10C23.4 11.92 21.92 13.4 20 13.4C18.08 13.4 16.6 11.92 16.6 10C16.6 8.08 18.08 6.6 20 6.6C21.92 6.6 23.4 8.08 23.4 10Z"/><path d="M13.9 27C13.9 28.92 12.42 30.4 10.5 30.4C8.58 30.4 7.1 28.92 7.1 27C7.1 25.08 8.58 23.6 10.5 23.6C12.42 23.6 13.9 25.08 13.9 27Z"/><path d="M32.9 27C32.9 28.92 31.42 30.4 29.5 30.4C27.58 30.4 26.1 28.92 26.1 27C26.1 25.08 27.58 23.6 29.5 23.6C31.42 23.6 32.9 25.08 32.9 27Z"/><path d="M20 13.4L20 19M13 25.2L17.4 20.8M27 25.2L22.6 20.8"/><path d="M22 20C22 21.13 21.13 22 20 22C18.87 22 18 21.13 18 20C18 18.87 18.87 18 20 18C21.13 18 22 18.87 22 20Z" fill="currentColor" stroke="none"/>',
      ritmo:'<path d="M33 20C33 27.33 27.33 33 20 33C12.67 33 7 27.33 7 20C7 12.67 12.67 7 20 7C27.33 7 33 12.67 33 20Z"/><path d="M22.4 7C22.4 8.35 21.35 9.4 20 9.4C18.65 9.4 17.6 8.35 17.6 7C17.6 5.65 18.65 4.6 20 4.6C21.35 4.6 22.4 5.65 22.4 7Z" fill="currentColor" stroke="none"/><path d="M33.7 26.5C33.7 27.85 32.65 28.9 31.3 28.9C29.95 28.9 28.9 27.85 28.9 26.5C28.9 25.15 29.95 24.1 31.3 24.1C32.65 24.1 33.7 25.15 33.7 26.5Z" fill="currentColor" stroke="none"/><path d="M11.1 26.5C11.1 27.85 10.05 28.9 8.7 28.9C7.35 28.9 6.3 27.85 6.3 26.5C6.3 25.15 7.35 24.1 8.7 24.1C10.05 24.1 11.1 25.15 11.1 26.5Z" fill="currentColor" stroke="none"/><path d="M23.2 20C23.2 21.81 21.81 23.2 20 23.2C18.19 23.2 16.8 21.81 16.8 20C16.8 18.19 18.19 16.8 20 16.8C21.81 16.8 23.2 18.19 23.2 20Z"/>',
      incontro:'<path d="M23 20C23 25.08 19.08 29 14 29C8.92 29 5 25.08 5 20C5 14.92 8.92 11 14 11C19.08 11 23 14.92 23 20Z"/><path d="M35 20C35 25.08 31.08 29 26 29C20.92 29 17 25.08 17 20C17 14.92 20.92 11 26 11C31.08 11 35 14.92 35 20Z"/><path d="M20 12.9C22 17.63 22 22.37 20 27.1C18 22.37 18 17.63 20 12.9Z"/>',
      tempio:'<path d="M4 14L20 5L36 14Z"/><path d="M5 16.5L35 16.5M8.5 19L8.5 31M16 19L16 31M24 19L24 31M31.5 19L31.5 31M5 33.5L35 33.5"/><path d="M20 29.5C17.67 26.83 17.33 23.67 19 20C19.4 22.27 20 23.6 20.8 24C22.13 22.8 22.63 21.47 22.3 20C23.97 22.67 24.37 25.07 23.5 27.2C22.9 28.47 21.73 29.23 20 29.5Z" fill="currentColor" stroke="none"/>'
    };
    var ATTESA = "[ in attesa ]";
    var vuoto = function (v) { return v === undefined || v === null || v === ""; };
    var testo = function (v) { return vuoto(v) ? ATTESA : String(v); };
    function svuota(n) { while (n && n.firstChild) n.removeChild(n.firstChild); }

    function disegnaSegno(chiave, lato) {
      var d = SEGNI[chiave];
      if (!d) return null;
      var s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      s.setAttribute("viewBox", "0 0 40 40");
      s.setAttribute("fill", "none");
      s.setAttribute("stroke", "currentColor");
      s.setAttribute("stroke-width", "1.4");
      s.setAttribute("stroke-linecap", "round");
      s.setAttribute("stroke-linejoin", "round");
      s.style.cssText = "width:" + lato + ";height:" + lato + ";display:block";
      s.innerHTML = d;
      return s;
    }

    function riempi(rec, quale) {
      rec = rec || {};
      var card = document.querySelector('[data-cont="' + (quale || 1) + '"]');
      if (!card) return;
      var q = function (n) { return card.querySelector('[data-c-' + n + ']'); };

      /* ① la radice */
      var rad = q("radice");
      svuota(rad);
      var segno = disegnaSegno(rec.radice, "100%");
      if (segno) { rad.appendChild(segno); rad.title = testo(rec.radiceNome); }
      else {
        rad.style.border = "1px dashed rgba(200,160,85,0.45)";
        rad.title = ATTESA;
      }

      /* ② l'immagine */
      var f = q("foto");
      svuota(f);
      if (rec.foto) {
        var g = document.createElement("img");
        g.src = rec.foto; g.alt = "";
        g.style.cssText = "position:absolute;inset:0;width:100%;height:100%;object-fit:cover";
        f.appendChild(g);
      } else {
        f.appendChild(document.createTextNode(ATTESA));
      }

      /* ③ che cosa è — due parole, la seconda può mancare */
      var cosa = rec.cosa || [];
      var prima = vuoto(cosa[0]) ? ATTESA : cosa[0];
      q("cosa").textContent = vuoto(cosa[1]) ? prima : prima + " · " + cosa[1];

      q("titolo").textContent  = testo(rec.titolo);
      q("sotto").textContent   = testo(rec.sottotitolo);
      q("chi").textContent     = testo(rec.chi);
      q("quando").textContent  = testo(rec.quando);

      /* ⑧ collegato da */
      var col = q("collegato");
      svuota(col);
      var pall = document.createElement("span");
      pall.style.cssText = "flex:0 0 auto;width:1.5rem;height:1.5rem;border-radius:50%;border:1px dashed rgba(200,160,85,0.45)";
      col.appendChild(pall);
      col.appendChild(document.createTextNode("Collegato da " + testo(rec.collegatoDa)));

      /* ⑨ le stanze — da uno a cinque */
      var st = q("stanze");
      svuota(st);
      var stanze = rec.stanze || [];
      if (!stanze.length) {
        var v = document.createElement("span");
        v.style.cssText = "font-family:'DM Sans',sans-serif;font-size:var(--t-eti);color:rgba(245,240,230,0.5)";
        v.textContent = ATTESA;
        st.appendChild(v);
      } else stanze.forEach(function (s) {
        var p = document.createElement("span");
        p.title = testo(s.nome);
        p.style.cssText = "display:inline-flex;align-items:center;gap:0.35rem;border:1px solid var(--line);border-radius:999px;padding:0.28rem 0.7rem 0.28rem 0.5rem;color:var(--oro-ch)";
        var ic = disegnaSegno(s.segno, "1.15rem");
        if (ic) p.appendChild(ic);
        var et = document.createElement("span");
        et.style.cssText = "font-family:'DM Sans',sans-serif;font-size:var(--t-eti);color:rgba(245,240,230,0.86);line-height:1";
        et.textContent = testo(s.nome);
        p.appendChild(et);
        st.appendChild(p);
      });
    }

    /* a vuoto la forma si legge lo stesso */
    riempi({}, 1); riempi({}, 2);

    window.SpazioVivo = window.SpazioVivo || {};
    window.SpazioVivo.mostraContenuto = riempi;
    window.SpazioVivo.segni = SEGNI;
  })();

  /* ⑤ la scheda del luogo. NESSUN DATO QUI: la forma si riempie da sé.
        Il guscio (o la mappa) chiama window.SpazioVivo.mostraLuogo(record).
        I DUE TASTI sotto la mappa: «Come funziona» porta sempre a
     come-funziona.html; «Il tuo spazio» pure, finché il guscio non dice
     che si è dentro — window.SpazioVivo.dentro(rottaDellOrma), e
     window.SpazioVivo.fuori() lo riporta alla prima volta.

     IL QUADRANTE DELLA MAPPA — legenda, formula, pratica:
       · window.SpazioVivo.mappaLegenda({simboli:[{segno,nome,cosa}],
                                         pratica:[{nome,riga} ×3]})
       · la formula è fissa e sta nel disegno: non cambia, non arriva da fuori

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

    function tastoVedi(el, rec) {
      var b = document.createElement("button");
      b.type = "button";
      b.style.cssText = "display:inline-block;margin-top:0.8rem;font-family:'DM Sans',sans-serif;font-size:var(--t-eti);" +
        "color:var(--oro-ch);border:1px solid rgba(200,160,85,0.4);border-radius:999px;padding:0.45rem 1rem;cursor:pointer;background:none";
      b.textContent = "vedi tutto →";
      b.addEventListener("click", function () {   /* l'unica cosa che esce */
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
        dentro.appendChild(tastoVedi(null, rec));
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
            dentro.appendChild(tastoVedi(el, rec));   /* i simboli non portano via */
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

  /* ⑥ la via di ritorno. Chi entra nella mappa da una porta può tornare
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

    /* ⭐ il tocco breve non apre più da solo: prima chiede alla mappa se
       sotto quel punto c'è un segno.
         · c'è  → la mappa dice il luogo, la scheda sale, e qui non si apre nulla
         · vuoto → il velo fa il suo lavoro di sempre: la mappa a tutto schermo
       Se la mappa tace — non ancora caricata, o dato geografico mancato —
       dopo RISPOSTA si fa lo stesso: il velo non lascia mai il dito a vuoto. */
    var RISPOSTA = 220, atteso = null;

    var apri = function () {
      if (window.SpazioVivo && typeof window.SpazioVivo.apriMappa === "function") {
        window.SpazioVivo.apriMappa();
      } else {
        document.dispatchEvent(new CustomEvent("spazio-vivo:apri-mappa"));
      }
    };

    /* ⭐ IL VUOTO HA DUE TEMPI, come una finestra. Chi ha una scheda aperta
       la sta leggendo: il tocco fuori la chiude, e si ferma lì. Il tocco
       dopo, senza scheda aperta, apre la mappa a tutto schermo.
       Il nodo si tiene, non si ricerca: il guscio lo sposta dentro la mappa
       piena quando la apre, e quello resta lo stesso nodo. */
    var scheda = document.getElementById("sv-scheda");

    var sulVuoto = function () {
      if (scheda && scheda.getAttribute("aria-hidden") === "false") {
        if (window.SpazioVivo && typeof window.SpazioVivo.chiudiLuogo === "function") {
          window.SpazioVivo.chiudiLuogo();
        }
        return;
      }
      apri();
    };

    window.addEventListener("message", function (e) {
      var d = e.data;
      if (!d || d.q !== "toccato" || atteso === null) return;
      clearTimeout(atteso); atteso = null;
      if (!d.trovato) sulVuoto();
    });

    velo.addEventListener("click", function (e) {
      if (salta) { salta = false; return; }
      if (atteso !== null) return;            /* una domanda alla volta */
      var r = velo.getBoundingClientRect();
      atteso = setTimeout(function () { atteso = null; sulVuoto(); }, RISPOSTA);
      parla({ q: "tocca", x: e.clientX - r.left, y: e.clientY - r.top });
    });

    /* «Esplora» è una porta dichiarata: apre sempre, anche se sotto c'è un segno */
    var esplora = velo.querySelector("span");
    if (esplora) esplora.addEventListener("click", function (e) {
      e.stopPropagation();
      if (salta) { salta = false; return; }
      apri();
    });
  }
})();
}

/* ⭐ il secondo foglio di Design — il quadrante della mappa: legenda,
   formula, pratica. Nel disegno gira da sé appena la pagina è letta;
   qui la casa nasce dentro home(), quindi lo si chiama lì. Il codice
   dentro è quello consegnato, parola per parola. */
function avviaLegenda(){
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
