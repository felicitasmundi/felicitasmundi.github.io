/* ════════════════════════════════════════════════════════════════
   Comunità Eterna FelicitasMundi · IL DISEGNATORE DELLE PAGINE

   ⭐ UN FILE SOLO, non uno per pagina. Legge un record dal database
      e lo disegna nella forma della pagina modello di Design.
      Cinquecento pagine, cinquecento record — un file.

   Il disegno è di Design: pagina-modello.html
   40101 byte · MD5 9a75902e9bf1582ee906869c842e265e
   ⚠️ Il suo <style> e il suo corpo vanno dentro MODELLO qui sotto,
      esattamente come fm-praticantato.js fa con PRATICANTATO.
      Il suo <script> sta più sotto, in paginaAccendi().

   Si apre da indirizzo: ?p=pagina&n=nome-url
      esempio: ?p=pagina&n=anima-vagabonda

   Non contiene: la barra, la radio, il Megafono, il piede.
   Quelle sono del guscio.

   ⛔ Niente involucro (function(){ … })(): il guscio mette tutto in
      comune e questo file legge da lì.
   ════════════════════════════════════════════════════════════════ */


/* ⚠️ QUI VA IL DISEGNO DI DESIGN: il <style> e tutto quello che sta
   dentro <div class="fm-pag"> … </div>.
   ⛔ Non riscriverlo: si incolla verbatim, come per il Praticantato. */
var MODELLO = `<style>
  .fm-pag,.fm-pag *,.fm-pag *::before,.fm-pag *::after{box-sizing:border-box}
  .fm-pag > *{min-width:0;max-width:100%}
  .fm-pag img{max-width:100%;display:block}

  /* ⛔ QUESTA RIGA NON SI TOGLIE.
     Chi disegna la pagina toglie di mezzo le parti senza dato marcandole
     hidden. Qui gli stili stanno dentro l'attributo style, e lo stile
     scritto sull'elemento batte il display:none del navigatore: senza
     questa riga 24 elementi marcati hidden resterebbero sotto gli occhi. */
  .fm-pag [hidden]{display:none !important}

  /* ⑤ quadranti — le porte dell'azione */
  .fm-pag [data-quad] a:hover,.fm-pag [data-quad] a[data-on]{background:var(--oro-ch);color:var(--navy)}

  /* ⑦ porte · ⑧ vie */
  .fm-pag [data-porta]:hover{border-color:rgba(200,160,85,0.55)}
  .fm-pag [data-porta]:hover [data-rimando]{color:var(--ivory)}
  .fm-pag [data-via]:hover{border-color:rgba(200,160,85,0.55);background:rgba(200,160,85,0.10)}
  .fm-pag [data-tasto]:hover{background:var(--oro)}
  .fm-pag [data-video]:hover [data-velo]{background:rgba(2,4,12,0.18)}

  /* le schede che si piegano */
  .fm-pag [data-copertina]{grid-template-columns:14rem minmax(0,1fr)}
  .fm-pag [data-bio]{grid-template-columns:8.5rem minmax(0,1fr)}
  @media(max-width:44rem){
    .fm-pag [data-copertina]{grid-template-columns:minmax(0,1fr)}
    .fm-pag [data-copertina] [data-im]{max-width:16rem}
  }
  @media(max-width:36rem){
    .fm-pag [data-bio]{grid-template-columns:minmax(0,1fr)}
    .fm-pag [data-riga]{flex-direction:column;align-items:flex-start;gap:0.5rem}
    .fm-pag [data-riga] [data-dato]{text-align:left}
  }
  @media(max-width:52rem){ .fm-pag{padding-left:1.1rem;padding-right:1.1rem} }

  @media print{
    .fm-pag [data-quad],.fm-pag [data-vie],.fm-pag [data-tasto]{display:none}
    .fm-pag [data-scheda],.fm-pag [data-porta]{background:none;box-shadow:none;border-color:#ccc;
      backdrop-filter:none;-webkit-backdrop-filter:none}
  }
</style>

<div class="fm-pag" style="--scala:1.4;--navy:#0A0C1A;--oro:#C8A055;--oro-ch:#D4AF6A;--ivory:#F5F0E6;--line:rgba(184,150,62,0.2);--velina:rgba(10,12,26,0.58);--t-eti:calc(0.8125rem * var(--scala));--t-tas:calc(0.9375rem * var(--scala));--t-cor:calc(1.0625rem * var(--scala));--t-scr:calc(1.125rem * var(--scala));--t-tit:calc(1.5rem * var(--scala));--t-big:calc(1.9rem * var(--scala));max-width:56rem;width:100%;margin:0 auto;display:flex;flex-direction:column;color:#F5F0E6;font-family:'DM Sans',sans-serif;-webkit-font-smoothing:antialiased">

  <!-- ①②③④ LA TESTA -->
  <header style="margin-top:1.2rem;display:flex;flex-direction:column;gap:0.6rem">
    <!-- ① occhiello · dove sta la pagina. Una o due parole. -->
    <div data-occhiello="1" style="font-family:'DM Sans',sans-serif;font-size:var(--t-eti);letter-spacing:0.2em;text-transform:uppercase;color:var(--oro-ch)">[ in attesa ]</div>
    <!-- ② titolo -->
    <h1 data-titolo="1" style="font-family:'Cinzel',serif;font-weight:500;font-size:var(--t-big);line-height:1.16;letter-spacing:0.03em;color:var(--ivory);margin:0;text-wrap:pretty">[ in attesa ]</h1>
    <!-- ③ sottotitolo · può essere lungo due righe -->
    <p data-sottotitolo="1" style="font-family:'Cormorant Garamond',serif;font-style:italic;font-size:var(--t-scr);line-height:1.45;color:rgba(245,240,230,0.86);margin:0;max-width:40rem;text-wrap:pretty">[ in attesa ]</p>
    <!-- ④ firma · FACOLTATIVA: si può togliere questa riga intera -->
    <div data-firma="1" style="font-family:'Cinzel',serif;font-size:var(--t-eti);letter-spacing:0.2em;text-transform:uppercase;color:rgba(212,175,106,0.72);margin-top:0.2rem">[ in attesa ]</div>
  </header>

  <!-- ⑤ QUADRANTI · la barra d'oro, appiccicata in alto mentre si scorre.
       Sono le porte dell'azione, non l'indice: da 2 a 5 voci.
       FACOLTATIVI: se il corpo ha una sola sezione, si toglie il <nav> intero. -->
  <nav data-quad="1" style="position:sticky;top:0;z-index:40;margin-top:1.6rem;display:flex;gap:0.35rem;flex-wrap:wrap;padding:0.6rem 0.5rem;background:rgba(10,12,26,0.9);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border-top:1px solid var(--line);border-bottom:1px solid var(--line);border-radius:0.2rem">
    <a href="#sez-1" style="font-family:'DM Sans',sans-serif;font-size:var(--t-eti);letter-spacing:0.16em;text-transform:uppercase;color:rgba(245,240,230,0.82);text-decoration:none;padding:0.4rem 0.9rem;border-radius:999px;transition:0.2s">[ in attesa ]</a>
    <a href="#sez-2" style="font-family:'DM Sans',sans-serif;font-size:var(--t-eti);letter-spacing:0.16em;text-transform:uppercase;color:rgba(245,240,230,0.82);text-decoration:none;padding:0.4rem 0.9rem;border-radius:999px;transition:0.2s">[ in attesa ]</a>
    <a href="#sez-3" style="font-family:'DM Sans',sans-serif;font-size:var(--t-eti);letter-spacing:0.16em;text-transform:uppercase;color:rgba(245,240,230,0.82);text-decoration:none;padding:0.4rem 0.9rem;border-radius:999px;transition:0.2s">[ in attesa ]</a>
    <a href="#collegato" style="font-family:'DM Sans',sans-serif;font-size:var(--t-eti);letter-spacing:0.16em;text-transform:uppercase;color:rgba(245,240,230,0.82);text-decoration:none;padding:0.4rem 0.9rem;border-radius:999px;transition:0.2s">[ in attesa ]</a>
    <a href="#condividi" style="font-family:'DM Sans',sans-serif;font-size:var(--t-eti);letter-spacing:0.16em;text-transform:uppercase;color:rgba(245,240,230,0.82);text-decoration:none;padding:0.4rem 0.9rem;border-radius:999px;transition:0.2s">[ in attesa ]</a>
  </nav>

  <!-- ⑥ IL CORPO ═══════════════════════════════════════════════ -->

  <!-- SEZIONE · scheda A (immagine grande a fianco del testo + elenco di righe) -->
  <section id="sez-1" style="margin-top:2.4rem;scroll-margin-top:4.5rem">
    <!-- fondale cosmico/neuronale — come nella casa -->
    <div data-rete="1" style="position:relative;border:1px solid rgba(184,150,62,0.28);border-radius:1rem;overflow:hidden;background:rgba(10,12,26,0.34);backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px)">
      <canvas data-tela="1" style="position:absolute;inset:0;width:100%;height:100%;z-index:0;opacity:0.85"></canvas>
      <div style="position:absolute;inset:0;z-index:1;pointer-events:none;background:radial-gradient(ellipse at 50% 50%,rgba(2,4,12,0.5),rgba(2,4,12,0.14) 70%)"></div>
      <div style="position:relative;z-index:2;padding:1.5rem 1.3rem 1.7rem;min-width:0">

    <div style="font-family:'Cinzel',serif;font-size:var(--t-eti);letter-spacing:0.24em;text-transform:uppercase;color:rgba(212,175,106,0.72);margin-bottom:0.9rem">[ in attesa ]</div>

    <div data-scheda="1" style="border:1px solid var(--line);border-radius:1rem;background:var(--velina);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);box-shadow:0 0.9rem 2.4rem rgba(2,4,12,0.35);padding:1.4rem">
      <div data-copertina="1" style="display:grid;gap:1.4rem;align-items:start">
        <!-- l'immagine grande. Se manca, il riquadro a righe resta e si legge. -->
        <div data-im="1" style="border:1px solid var(--line);border-radius:0.5rem;overflow:hidden;background:repeating-linear-gradient(135deg,rgba(245,240,230,0.05) 0 8px,rgba(245,240,230,0.02) 8px 16px);aspect-ratio:2/3;display:flex;align-items:center;justify-content:center">
          <span style="font-family:ui-monospace,monospace;font-size:var(--t-eti);color:rgba(245,240,230,0.55);text-align:center;padding:0 0.8rem">l'immagine grande<br>[ in attesa ]</span>
        </div>
        <div style="min-width:0">
          <p style="font-family:'Cormorant Garamond',serif;font-size:var(--t-cor);line-height:1.62;color:var(--ivory);margin:0 0 0.9rem">[ in attesa ]</p>
          <p style="font-family:'Cormorant Garamond',serif;font-size:var(--t-cor);line-height:1.62;color:var(--ivory);margin:0">[ in attesa ]</p>

          <!-- elenco di righe · i dati. Da 1 a molte righe. Si può togliere. -->
          <ul style="list-style:none;margin:1.2rem 0 0;padding:0.9rem 0 0;border-top:1px solid var(--line);display:flex;flex-direction:column;gap:0.15rem">
            <li data-riga="1" style="display:flex;justify-content:space-between;align-items:baseline;gap:1rem;padding:0.35rem 0">
              <span style="font-family:'DM Sans',sans-serif;font-size:var(--t-eti);letter-spacing:0.08em;color:rgba(245,240,230,0.62)">[ in attesa ]</span>
              <b data-dato="1" style="font-family:'DM Sans',sans-serif;font-size:var(--t-eti);font-weight:400;color:var(--ivory);text-align:right">[ in attesa ]</b>
            </li>
            <li data-riga="1" style="display:flex;justify-content:space-between;align-items:baseline;gap:1rem;padding:0.35rem 0">
              <span style="font-family:'DM Sans',sans-serif;font-size:var(--t-eti);letter-spacing:0.08em;color:rgba(245,240,230,0.62)">[ in attesa ]</span>
              <b data-dato="1" style="font-family:'DM Sans',sans-serif;font-size:var(--t-eti);font-weight:400;color:var(--ivory);text-align:right">[ in attesa ]</b>
            </li>
            <li data-riga="1" style="display:flex;justify-content:space-between;align-items:baseline;gap:1rem;padding:0.35rem 0">
              <span style="font-family:'DM Sans',sans-serif;font-size:var(--t-eti);letter-spacing:0.08em;color:rgba(245,240,230,0.62)">[ in attesa ]</span>
              <b data-dato="1" style="font-family:'DM Sans',sans-serif;font-size:var(--t-eti);font-weight:400;color:var(--ivory);text-align:right">[ in attesa ]</b>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- scheda C · solo testo lungo. Sotto lo stesso occhiello o con uno nuovo. -->
    <div style="font-family:'Cinzel',serif;font-size:var(--t-eti);letter-spacing:0.24em;text-transform:uppercase;color:rgba(212,175,106,0.72);margin:2rem 0 0.9rem">[ in attesa ]</div>
    <div data-scheda="1" style="border:1px solid var(--line);border-radius:1rem;background:var(--velina);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);box-shadow:0 0.9rem 2.4rem rgba(2,4,12,0.35);padding:1.4rem;display:flex;flex-direction:column;gap:0.9rem">
      <p data-racconto="1" style="font-family:'Cormorant Garamond',serif;font-size:var(--t-cor);line-height:1.62;color:var(--ivory);margin:0">[ in attesa ]</p>
      <p style="font-family:'Cormorant Garamond',serif;font-size:var(--t-cor);line-height:1.62;color:var(--ivory);margin:0">[ in attesa ]</p>
    </div>

    <!-- scheda B · elenco in evidenza (le domande) -->
    <div style="font-family:'Cinzel',serif;font-size:var(--t-eti);letter-spacing:0.24em;text-transform:uppercase;color:rgba(212,175,106,0.72);margin:2rem 0 0.9rem">[ in attesa ]</div>
    <div data-scheda="1" style="border:1px solid var(--line);border-radius:1rem;background:var(--velina);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);box-shadow:0 0.9rem 2.4rem rgba(2,4,12,0.35);padding:1.4rem">
      <ul style="list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:0.2rem">
        <li style="display:grid;grid-template-columns:1rem minmax(0,1fr);gap:0.6rem;font-family:'Cinzel',serif;font-size:var(--t-cor);line-height:1.45;letter-spacing:0.02em;color:var(--oro-ch);padding:0.45rem 0">
          <span style="color:var(--oro)">·</span><span>[ in attesa ]</span>
        </li>
        <li style="display:grid;grid-template-columns:1rem minmax(0,1fr);gap:0.6rem;font-family:'Cinzel',serif;font-size:var(--t-cor);line-height:1.45;letter-spacing:0.02em;color:var(--oro-ch);padding:0.45rem 0">
          <span style="color:var(--oro)">·</span><span>[ in attesa ]</span>
        </li>
        <li style="display:grid;grid-template-columns:1rem minmax(0,1fr);gap:0.6rem;font-family:'Cinzel',serif;font-size:var(--t-cor);line-height:1.45;letter-spacing:0.02em;color:var(--oro-ch);padding:0.45rem 0">
          <span style="color:var(--oro)">·</span><span>[ in attesa ]</span>
        </li>
      </ul>
      <p style="font-family:'Cormorant Garamond',serif;font-style:italic;font-size:var(--t-cor);line-height:1.6;color:rgba(245,240,230,0.86);margin:1.2rem 0 0;padding-top:1rem;border-top:1px solid var(--line)">[ in attesa ]</p>
    </div>
      </div>
    </div>

  </section>

  <!-- SEZIONE · scheda E (riga con prezzo e tasto)
       FACOLTATIVA. Senza prezzo: si toglie il <span> del prezzo, il tasto regge da solo. -->
  <section id="sez-2" style="margin-top:2.6rem;scroll-margin-top:4.5rem">
    <div style="font-family:'Cinzel',serif;font-size:var(--t-eti);letter-spacing:0.24em;text-transform:uppercase;color:rgba(212,175,106,0.72);margin-bottom:0.9rem">[ in attesa ]</div>
    <div data-scheda="1" style="border:1px solid var(--line);border-radius:1rem;background:var(--velina);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);box-shadow:0 0.9rem 2.4rem rgba(2,4,12,0.35);padding:1.4rem">
      <div style="display:flex;align-items:center;gap:1.1rem;flex-wrap:wrap;padding:0.2rem 0">
        <span style="flex:1 1 12rem;min-width:0;font-family:'Cormorant Garamond',serif;font-size:var(--t-scr);line-height:1.3;color:var(--ivory)">[ in attesa ]
          <small style="display:block;font-family:'DM Sans',sans-serif;font-size:var(--t-eti);color:rgba(245,240,230,0.62);margin-top:0.2rem">[ in attesa ]</small></span>
        <span data-prezzo="1" style="font-family:'Cinzel',serif;font-size:var(--t-scr);color:var(--oro-ch);white-space:nowrap">[ in attesa ]</span>
        <a data-tasto="1" href="#" style="font-family:'Cinzel',serif;font-size:var(--t-eti);letter-spacing:0.16em;text-transform:uppercase;font-weight:600;color:var(--navy);background:var(--oro-ch);border:1px solid var(--oro-ch);border-radius:999px;padding:0.7rem 1.5rem;text-decoration:none;white-space:nowrap;transition:0.2s">[ in attesa ]</a>
      </div>
      <p style="font-family:'DM Sans',sans-serif;font-size:var(--t-eti);color:rgba(245,240,230,0.62);margin:1rem 0 0;padding-top:0.9rem;border-top:1px solid var(--line)">[ in attesa ]</p>
    </div>
  </section>

  <!-- SEZIONE · scheda D (ritratto tondo col testo) + scheda F (miniatura di video)
       Entrambe FACOLTATIVE. Senza ritratto: si toglie la prima colonna. -->
  <section id="sez-3" style="margin-top:2.6rem;scroll-margin-top:4.5rem">
    <!-- fondale cosmico/neuronale — come nella casa -->
    <div data-rete="1" style="position:relative;border:1px solid rgba(184,150,62,0.28);border-radius:1rem;overflow:hidden;background:rgba(10,12,26,0.34);backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px)">
      <canvas data-tela="1" style="position:absolute;inset:0;width:100%;height:100%;z-index:0;opacity:0.85"></canvas>
      <div style="position:absolute;inset:0;z-index:1;pointer-events:none;background:radial-gradient(ellipse at 50% 50%,rgba(2,4,12,0.5),rgba(2,4,12,0.14) 70%)"></div>
      <div style="position:relative;z-index:2;padding:1.5rem 1.3rem 1.7rem;min-width:0">

    <div style="font-family:'Cinzel',serif;font-size:var(--t-eti);letter-spacing:0.24em;text-transform:uppercase;color:rgba(212,175,106,0.72);margin-bottom:0.9rem">[ in attesa ]</div>
    <div data-scheda="1" style="border:1px solid var(--line);border-radius:1rem;background:var(--velina);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);box-shadow:0 0.9rem 2.4rem rgba(2,4,12,0.35);padding:1.4rem">
      <div data-bio="1" style="display:grid;gap:1.2rem;align-items:start">
        <div style="width:8.5rem;height:8.5rem;border-radius:50%;overflow:hidden;border:1px solid var(--line);background:repeating-linear-gradient(135deg,rgba(245,240,230,0.05) 0 8px,rgba(245,240,230,0.02) 8px 16px);display:flex;align-items:center;justify-content:center">
          <span style="font-family:ui-monospace,monospace;font-size:var(--t-eti);color:rgba(245,240,230,0.55);text-align:center;padding:0 0.6rem">il ritratto</span>
        </div>
        <div style="min-width:0;display:flex;flex-direction:column;gap:0.9rem">
          <p style="font-family:'Cormorant Garamond',serif;font-size:var(--t-cor);line-height:1.62;color:var(--ivory);margin:0">[ in attesa ]</p>
          <p style="font-family:'Cormorant Garamond',serif;font-size:var(--t-cor);line-height:1.62;color:var(--ivory);margin:0">[ in attesa ]</p>
          <p style="font-family:'Cormorant Garamond',serif;font-style:italic;font-size:var(--t-cor);line-height:1.6;color:rgba(245,240,230,0.86);margin:0;padding-top:0.9rem;border-top:1px solid var(--line)">[ in attesa ]</p>
        </div>
      </div>

      <!-- scheda F · miniatura di video -->
      <a data-video="1" href="#" style="display:block;position:relative;margin-top:1.4rem;border:1px solid var(--line);border-radius:0.8rem;overflow:hidden;aspect-ratio:16/9;background:repeating-linear-gradient(135deg,rgba(245,240,230,0.05) 0 8px,rgba(245,240,230,0.02) 8px 16px);text-decoration:none">
        <span data-velo="1" style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0.7rem;transition:0.25s">
          <span style="width:3.4rem;height:3.4rem;color:var(--oro-ch)">
            <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.4" style="width:100%;height:100%;display:block">
              <circle cx="20" cy="20" r="14"></circle>
              <path d="M16.5 13.5 L27 20 L16.5 26.5 Z" fill="currentColor" stroke="none"></path>
            </svg>
          </span>
          <span style="font-family:ui-monospace,monospace;font-size:var(--t-eti);color:rgba(245,240,230,0.55);text-align:center;padding:0 1rem">la miniatura del video<br>[ in attesa ]</span>
        </span>
      </a>
    </div>
      </div>
    </div>

  </section>

  <!-- ⑦ A COSA È COLLEGATO ═════════════════════════════════════
       Da 1 a 6 porte. I testi sono di lunghezza molto diversa:
       la forma regge una riga e regge dieci.
       Il filo a sinistra prende il colore della sezione a cui porta.
       FACOLTATIVA: senza porte si toglie la <section> intera. -->
  <section id="collegato" style="margin-top:3rem;scroll-margin-top:4.5rem">
    <div data-segno="1" style="display:flex;flex-direction:column;align-items:center;gap:0.8rem;margin-bottom:1.6rem;padding:1.1rem 1.2rem;background:rgba(10,12,26,0.9);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border-top:1px solid var(--line);border-bottom:1px solid var(--line);border-radius:0.2rem">
      <img src="nexus-segno.png" alt="Il segno del Nexus" width="512" height="512" style="width:4.2rem;height:auto;display:block;border-radius:0.35rem;border:1px solid #1E5B3A;box-shadow:0 0 0.55rem rgba(46,170,105,0.55),0 0 1.6rem rgba(46,170,105,0.26)">
      <span style="font-family:'Cinzel',serif;font-size:var(--t-eti);letter-spacing:0.24em;text-transform:uppercase;color:rgba(212,175,106,0.72);text-align:center">A cosa è collegato</span>
    </div>

    <div style="display:flex;flex-direction:column;gap:0.8rem">

      <!-- porta · testo corto -->
      <a data-porta="1" href="#" style="display:block;text-decoration:none;border:1px solid var(--line);border-left:3px solid #8C2F39;border-radius:0.8rem;padding:1.2rem 1.3rem;background:var(--velina);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);transition:0.2s">
        <span data-occhiello="1" style="display:block;font-family:'DM Sans',sans-serif;font-size:var(--t-eti);letter-spacing:0.18em;text-transform:uppercase;color:#8C2F39;margin-bottom:0.45rem">[ in attesa ]</span>
        <b style="display:block;font-family:'Cinzel',serif;font-weight:500;font-size:var(--t-cor);letter-spacing:0.02em;color:var(--ivory);line-height:1.35">[ in attesa ]</b>
        <i style="display:block;font-family:'Cormorant Garamond',serif;font-size:var(--t-cor);color:rgba(245,240,230,0.86);line-height:1.55;margin-top:0.35rem">[ in attesa ]</i>
        <span data-rimando="1" style="display:inline-block;margin-top:0.8rem;font-family:'DM Sans',sans-serif;font-size:var(--t-eti);letter-spacing:0.04em;color:var(--oro-ch);transition:0.2s">[ in attesa ] →</span>
      </a>

      <!-- porta · testo lungo, anche su più capoversi -->
      <a data-porta="1" href="#" style="display:block;text-decoration:none;border:1px solid var(--line);border-left:3px solid #AA8844;border-radius:0.8rem;padding:1.2rem 1.3rem;background:var(--velina);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);transition:0.2s">
        <span data-occhiello="1" style="display:block;font-family:'DM Sans',sans-serif;font-size:var(--t-eti);letter-spacing:0.18em;text-transform:uppercase;color:#AA8844;margin-bottom:0.45rem">[ in attesa ]</span>
        <b style="display:block;font-family:'Cinzel',serif;font-weight:500;font-size:var(--t-cor);letter-spacing:0.02em;color:var(--ivory);line-height:1.35">[ in attesa ]</b>
        <i style="display:block;font-family:'Cormorant Garamond',serif;font-size:var(--t-cor);color:rgba(245,240,230,0.86);line-height:1.55;margin-top:0.35rem">[ in attesa ]</i>
        <i style="display:block;font-family:'Cormorant Garamond',serif;font-size:var(--t-cor);color:rgba(245,240,230,0.86);line-height:1.55;margin-top:0.6rem">[ in attesa ]</i>
        <span data-rimando="1" style="display:inline-block;margin-top:0.8rem;font-family:'DM Sans',sans-serif;font-size:var(--t-eti);letter-spacing:0.04em;color:var(--oro-ch);transition:0.2s">[ in attesa ] →</span>
      </a>

      <!-- porta · gli altri fili: #4488BB #669944 #9966CC #CC6644 -->
      <a data-porta="1" href="#" style="display:block;text-decoration:none;border:1px solid var(--line);border-left:3px solid #4488BB;border-radius:0.8rem;padding:1.2rem 1.3rem;background:var(--velina);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);transition:0.2s">
        <span data-occhiello="1" style="display:block;font-family:'DM Sans',sans-serif;font-size:var(--t-eti);letter-spacing:0.18em;text-transform:uppercase;color:#4488BB;margin-bottom:0.45rem">[ in attesa ]</span>
        <b style="display:block;font-family:'Cinzel',serif;font-weight:500;font-size:var(--t-cor);letter-spacing:0.02em;color:var(--ivory);line-height:1.35">[ in attesa ]</b>
        <i style="display:block;font-family:'Cormorant Garamond',serif;font-size:var(--t-cor);color:rgba(245,240,230,0.86);line-height:1.55;margin-top:0.35rem">[ in attesa ]</i>
        <span data-rimando="1" style="display:inline-block;margin-top:0.8rem;font-family:'DM Sans',sans-serif;font-size:var(--t-eti);letter-spacing:0.04em;color:var(--oro-ch);transition:0.2s">[ in attesa ] →</span>
      </a>

      <!-- PORTA CON MAPPA — stessa forma della porta semplice: cambia solo
           che sotto il testo c'è un rettangolo di mappa vera.
           Il luogo arriva dal database: data-lat, data-lon, data-zoom,
           data-nome (il luogo) e data-torna (la pagina di partenza).
           Senza lat/lon il rettangolo resta a righe e la porta si legge intera.
           È un <div> e non un <a> perché dentro si viaggia: il rimando è il
           collegamento in fondo. -->
      <div data-porta="1" style="display:block;text-decoration:none;border:1px solid var(--line);border-left:3px solid #669944;border-radius:0.8rem;padding:1.2rem 1.3rem;background:var(--velina);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);transition:0.2s">
        <span data-occhiello="1" style="display:block;font-family:'DM Sans',sans-serif;font-size:var(--t-eti);letter-spacing:0.18em;text-transform:uppercase;color:#669944;margin-bottom:0.45rem">[ in attesa ]</span>
        <b style="display:block;font-family:'Cinzel',serif;font-weight:500;font-size:var(--t-cor);letter-spacing:0.02em;color:var(--ivory);line-height:1.35">[ in attesa ]</b>
        <i style="display:block;font-family:'Cormorant Garamond',serif;font-size:var(--t-cor);color:rgba(245,240,230,0.86);line-height:1.55;margin-top:0.35rem">[ in attesa ]</i>

        <!-- LA MAPPA — è la mappa della casa, la stessa: mappa-ferma.html
             dentro la cornice del libro, solo ristretta su un punto.
             Il luogo arriva dal database: data-lat, data-lon, data-k (lo zoom),
             data-nome e data-torna (la pagina di partenza).
             Senza lat e lon il riquadro resta vuoto e la porta si legge intera. -->
        <div data-mappa="1" data-lat="" data-lon="" data-k="17" data-nome="" data-torna="" style="margin-top:1rem">
          <div data-libro="1" style="position:relative;border:1px solid rgba(200,160,85,0.5);border-radius:0.5rem;padding:0.75rem;background:linear-gradient(160deg,rgba(30,24,16,0.9),rgba(10,12,26,0.95));box-shadow:0 1.2rem 2.6rem rgba(2,4,12,0.55),inset 0 0 0 1px rgba(2,4,12,0.6)">
            <div style="position:relative;border:1px solid rgba(200,160,85,0.32);border-radius:0.25rem;overflow:hidden;background:#070c1a">
              <div style="position:relative;height:24rem">
                <iframe data-telaio="1" title="La mappa" loading="lazy" style="position:absolute;inset:0;width:100%;height:100%;border:0"></iframe>
                <div data-piega="1" style="position:absolute;top:0;bottom:0;left:50%;width:3.4rem;transform:translateX(-50%);pointer-events:none;background:linear-gradient(to right,rgba(2,4,12,0) 0%,rgba(2,4,12,0.45) 42%,rgba(245,240,230,0.07) 50%,rgba(2,4,12,0.45) 58%,rgba(2,4,12,0) 100%)"></div>
                <!-- LA VIA DI RITORNO — discreta, sempre visibile sopra la mappa -->
                <div data-ritorno="1" style="position:absolute;top:0;left:0;right:0;z-index:60;display:flex;align-items:center;gap:0.7rem;flex-wrap:wrap;padding:0.5rem 0.8rem;background:rgba(10,12,26,0.82);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);border-bottom:1px solid rgba(200,160,85,0.32)">
                  <span style="font-family:'DM Sans',sans-serif;font-size:var(--t-eti);color:rgba(245,240,230,0.72)">sei arrivato da <b data-donde="1" style="font-weight:400;color:var(--oro-ch)">[ in attesa ]</b></span>
                  <button type="button" data-indietro="1" style="margin-left:auto;font-family:'DM Sans',sans-serif;font-size:var(--t-eti);letter-spacing:0.04em;color:var(--ivory);background:rgba(10,12,26,0.5);border:1px solid rgba(200,160,85,0.5);border-radius:999px;padding:0.3rem 0.9rem;cursor:pointer">torna indietro</button>
                </div>
                <span data-attesa="1" style="position:absolute;inset:0;z-index:2;display:flex;align-items:center;justify-content:center;font-family:ui-monospace,monospace;font-size:var(--t-eti);color:rgba(245,240,230,0.55);text-align:center;padding:0 1rem;pointer-events:none">la mappa · [ in attesa ]</span>
              </div>
            </div>
          </div>
        </div>
        <a data-rimando="1" href="#" style="display:inline-block;margin-top:0.8rem;font-family:'DM Sans',sans-serif;font-size:var(--t-eti);letter-spacing:0.04em;color:var(--oro-ch);text-decoration:none;transition:0.2s">[ in attesa ] →</a>
      </div>


    </div>
  </section>

  <!-- ⑧ CONDIVIDI ═════════════════════════════════════════════ -->
  <section id="condividi" style="margin-top:3rem;margin-bottom:1.2rem;scroll-margin-top:4.5rem">
    <div style="font-family:'Cinzel',serif;font-size:var(--t-eti);letter-spacing:0.24em;text-transform:uppercase;color:rgba(212,175,106,0.72);margin-bottom:0.9rem">Condividi</div>
    <div data-vie="1" style="display:flex;gap:0.6rem;flex-wrap:wrap">
      <a data-via="1" data-wa="1" href="#" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:0.5rem;text-decoration:none;font-family:'DM Sans',sans-serif;font-size:var(--t-eti);color:var(--ivory);border:1px solid var(--line);border-radius:999px;padding:0.65rem 1.2rem;background:rgba(10,12,26,0.4);transition:0.2s">WhatsApp</a>
      <a data-via="1" data-ml="1" href="#" style="display:inline-flex;align-items:center;gap:0.5rem;text-decoration:none;font-family:'DM Sans',sans-serif;font-size:var(--t-eti);color:var(--ivory);border:1px solid var(--line);border-radius:999px;padding:0.65rem 1.2rem;background:rgba(10,12,26,0.4);transition:0.2s">Per email</a>
      <a data-via="1" data-cp="1" href="#" style="display:inline-flex;align-items:center;gap:0.5rem;text-decoration:none;font-family:'DM Sans',sans-serif;font-size:var(--t-eti);color:var(--ivory);border:1px solid var(--line);border-radius:999px;padding:0.65rem 1.2rem;background:rgba(10,12,26,0.4);transition:0.2s">Copia il collegamento</a>
      <a data-via="1" href="mailto:felicitasmundi@protonmail.com" style="display:inline-flex;align-items:center;gap:0.5rem;text-decoration:none;font-family:'DM Sans',sans-serif;font-size:var(--t-eti);color:var(--ivory);border:1px solid var(--line);border-radius:999px;padding:0.65rem 1.2rem;background:rgba(10,12,26,0.4);transition:0.2s">Proponi qualcosa</a>
    </div>
  </section>

  <!-- ⑨ IL PIEDE lo mette il guscio: non va qui. -->

</div>`;


/* ══ COME SI ACCENDE ════════════════════════════════════════════
   Il <script> di pagina-modello.html, verbatim: i quadranti, le tele
   del fondale, la mappa dentro la porta.

   ⭐ Sta qui e non dentro MODELLO perché gli <script> messi con
      innerHTML non partono mai. Il modello la definisce e non la
      chiama; la chiama pagina(), qui sopra. */
/* ══════════════════════════════════════════════════════════════════
   COME SI ACCENDE LA PAGINA — i quadranti, le tele, la mappa.

   ⛔ Non parte da sola: la chiama chi disegna la pagina, e le passa
      il contenitore. Nel guscio è fm-pagina.js. Lasciata in avvio
      automatico girerebbe due volte.

   È lo stesso codice di prima, chiuso in una funzione: dove cercava
   .fm-pag dentro document, adesso usa il contenitore che riceve.
   ══════════════════════════════════════════════════════════════════ */
function paginaAccendi(pag){
  if (!pag) return;

  (function () {
    "use strict";
    /* ⑤ i quadranti si accendono su dove sei */
    var barra = pag.querySelector("[data-quad]");
    if (barra) {
      var voci = [].slice.call(barra.querySelectorAll("a"));
      var sezioni = voci.map(function (a) {
        var id = a.getAttribute("href");
        return id && id.charAt(0) === "#" ? pag.querySelector(id) : null;
      });
      /* ⚠️ IL PUNTO CHE DIVERGE dal file di Design, come in
         fm-praticantato.js: nel guscio la finestra non scorre — scorre
         il quadrante centrale, #centro. Ascoltando window i quadranti
         non si accendevano mai. Il modello da solo ricade su window. */
      var scorre = document.getElementById("centro") || window;
      var spia = function () {
        var alto = scorre === window ? window.scrollY : scorre.scrollTop + scorre.offsetTop;
        var y = alto + 90, att = -1;
        sezioni.forEach(function (s, i) { if (s && s.offsetTop <= y) att = i; });
        voci.forEach(function (a, i) {
          if (i === att) a.setAttribute("data-on", "1"); else a.removeAttribute("data-on");
        });
      };
      scorre.addEventListener("scroll", spia, { passive: true });
      spia();
    }

    /* ⑧ condividi — prende titolo e indirizzo dalla pagina stessa */
    var h1 = pag.querySelector("h1");
    var titolo = (h1 ? h1.textContent.trim() : document.title) || "FelicitasMundi";
    var url = location.href;
    var wa = pag.querySelector("[data-wa]");
    if (wa) wa.href = "https://wa.me/?text=" + encodeURIComponent(titolo + " — " + url);
    var ml = pag.querySelector("[data-ml]");
    if (ml) ml.href = "mailto:?subject=" + encodeURIComponent(titolo) +
                      "&body=" + encodeURIComponent(url);
    /* ⚠️ IL SECONDO PUNTO CHE DIVERGE: l'indirizzo si prende da [data-ml],
       che chi disegna la pagina riempie dopo, e al momento del tocco porta
       già quello giusto. location.href a quel punto il guscio l'ha ripulito,
       e si copierebbe la home invece della pagina. */
    var indirizzo = function () {
      var h = ml ? ml.getAttribute("href") || "" : "";
      var b = h.match(/[?&]body=([^&]*)/);
      return b ? decodeURIComponent(b[1]) : url;
    };
    var cp = pag.querySelector("[data-cp]");
    if (cp) cp.addEventListener("click", function (e) {
      e.preventDefault();
      var t = this, prima = t.textContent;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(indirizzo()).then(function () {
          t.textContent = "copiato";
          setTimeout(function () { t.textContent = prima; }, 1800);
        });
      }
    });
  })();

  /* IL FONDALE COSMICO — i punti e i fili dietro il vetro delle sezioni
     [data-rete]. Ferma per chi ha il movimento ridotto. */
  (function () {
    "use strict";
    var fondali = [], t = 0;
    var fermo = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    [].slice.call(pag.querySelectorAll("canvas[data-tela]")).forEach(function (cv) {
      if (cv.getContext) fondali.push({ cv: cv, cx: cv.getContext("2d"), W: 0, H: 0, punti: [] });
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
      fondali.forEach(unFondale);
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
    if (window.ResizeObserver) fondali.forEach(function (f) {
      new ResizeObserver(function(){ misura(); }).observe(f.cv.parentNode);
    });
    misura();
    if (!fermo) disegna();
  })();

  /* LA MAPPA DENTRO LA PORTA — è la mappa della casa (mappa-ferma.html),
     ristretta sul luogo che arriva dal database. Nessun disegno nuovo:
     il telaio la apre viva (?vivo=1) sul punto (#lat,lon,k).
     La riga in cima è la via di ritorno: rimette la vista di partenza. */
  (function () {
    "use strict";
    [].slice.call(pag.querySelectorAll("[data-mappa]")).forEach(function (m) {
      var lat = parseFloat(m.dataset.lat), lon = parseFloat(m.dataset.lon);
      var k = parseFloat(m.dataset.k) || 12;
      var telaio = m.querySelector("[data-telaio]");
      var attesa = m.querySelector("[data-attesa]");
      var donde = m.querySelector("[data-donde]");
      if (donde && m.dataset.torna) donde.textContent = m.dataset.torna;
      if (!isFinite(lat) || !isFinite(lon) || !telaio) return;  /* senza luogo il riquadro resta vuoto */

      telaio.src = "mappa-ferma.html?vivo=1#" + lat + "," + lon + "," + k;
      telaio.addEventListener("load", function () {
        if (attesa) attesa.style.display = "none";
      });

      var indietro = m.querySelector("[data-indietro]");
      if (indietro) indietro.addEventListener("click", function (e) {
        e.preventDefault();
        if (telaio.contentWindow) {
          telaio.contentWindow.postMessage({ q: "posa", lat: lat, lon: lon, k: k }, "*");
        }
      });
    });
  })();
}


/* i colori dei fili delle porte, per elemento */
var FILO_ELEMENTO = {
  nexus:    "#8C2F39",
  terra:    "#AA8844",
  acqua:    "#4488BB",
  fuoco:    "#CC6644",
  aria:     "#669944",
  etere:    "#9966CC",
  sviluppo: "#B87333"
};

/* l'occhiello che una porta mostra, per elemento */
var PORTA_OCCHIELLO = {
  terra:    "Vicinati",
  acqua:    "Emporio",
  fuoco:    "Assistenza",
  aria:     "Edizione",
  etere:    "Scuola",
  nexus:    "Nexus",
  sviluppo: "Sviluppo"
};


/* ══ LA STANZA ══════════════════════════════════════════════════ */

function pagina(c, nome){
  nome = nome || pagineNomeChiesto || null;

  c.innerHTML = MODELLO;
  var pag = c.querySelector(".fm-pag");
  if(!pag) return;

  if(!nome){ paginaVuota(pag, "Nessuna pagina chiesta."); return; }

  paginaLeggi(nome, function(d){
    if(!d){ paginaVuota(pag, "Questa pagina non si trova."); return; }
    paginaRiempi(pag, d);
    if(typeof paginaAccendi === "function") paginaAccendi(pag);
    /* ⭐ ultimo, e dopo paginaAccendi: il modello scrive quei due href
       con location.href, che a quel punto il guscio ha già ripulito.
       Chi condivide deve arrivare al libro, non alla home. */
    paginaCondividi(pag, d);
  });
}


/* ══ LEGGERE ═══════════════════════════════════════════════════ */

function paginaLeggi(nome, poi){
  db.from("prodotti")
    .select("id,nome,nome_url,sottotitolo,autore,editore,isbn,formato," +
            "racconto,scaffale,prezzo,si_compra,si_scambia,si_dona," +
            "accetta_talenti,quanti_talenti,foto,foto_secondaria," +
            "stato,vicinato_id")
    .eq("nome_url", nome).single().then(function(r){

    if(r.error || !r.data){ poi(null); return; }
    var d = r.data;

    /* le porte, e per quelle che puntano a un vicinato anche il luogo */
    db.from("collegamenti")
      .select("id,a_tipo,a_id,url,elemento,titolo,testo,ordine")
      .eq("da_tipo", "prodotto").eq("da_id", d.id)
      .order("ordine", { ascending: true }).then(function(rc){

      d.porte = (rc.error || !rc.data) ? [] : rc.data;

      var idLuoghi = d.porte
        .filter(function(p){ return p.a_tipo === "vicinato" && p.a_id; })
        .map(function(p){ return p.a_id; });

      if(!idLuoghi.length){ poi(d); return; }

      db.from("vicinati").select("id,nome,territorio,lat,lon")
        .in("id", idLuoghi).then(function(rv){
        var per = {};
        if(!rv.error && rv.data) rv.data.forEach(function(v){ per[v.id] = v; });
        d.porte.forEach(function(p){ if(per[p.a_id]) p.luogo = per[p.a_id]; });
        poi(d);
      });
    });
  });
}


/* ══ RIEMPIRE ══════════════════════════════════════════════════ */

function paginaRiempi(pag, d){
  var q = function(s){ return pag.querySelector(s); };
  var qq = function(s){ return [].slice.call(pag.querySelectorAll(s)); };

  /* ① la testa */
  paginaScrivi(q("[data-occhiello]"), paginaOcchiello(d));
  paginaScrivi(q("[data-titolo]"), d.nome);
  paginaScrivi(q("[data-sottotitolo]"), d.sottotitolo);
  paginaScrivi(q("[data-firma]"), d.autore);

  /* ② la copertina e il racconto */
  var im = q("[data-copertina] [data-im]");
  if(im){
    if(d.foto) im.innerHTML = '<img src="' + paginaPulisci(d.foto) +
      '" alt="' + paginaPulisci(d.nome) + '" style="display:block;width:100%;height:auto">';
    else im.setAttribute("hidden", "");
  }
  paginaScrivi(q("[data-racconto]"), d.racconto);

  /* ③ i dati: solo quelli che ci sono */
  var righe = qq("[data-riga]");
  var dati = [];
  if(d.editore) dati.push(["editore", d.editore]);
  if(d.formato) dati.push(["formato", d.formato]);
  if(d.isbn)    dati.push(["ISBN", d.isbn]);

  righe.forEach(function(r, i){
    if(i >= dati.length){ r.setAttribute("hidden", ""); return; }
    var et = r.querySelector("span, [data-etichetta]");
    var va = r.querySelector("[data-dato]");
    if(et) et.textContent = dati[i][0];
    if(va) va.textContent = dati[i][1];
    r.removeAttribute("hidden");
  });

  /* ④ il prezzo */
  var pz = q("[data-prezzo]");
  var tasto = q("[data-tasto]");
  if(d.si_compra && d.prezzo){
    if(pz) pz.textContent = paginaEuro(d.prezzo);
    if(tasto) tasto.textContent = "Ordina";
  } else {
    var sez = pz ? pz.closest("[data-scheda]") : null;
    if(sez) sez.setAttribute("hidden", "");
  }

  /* ⑤ la biografia — solo se c'è.
     ⭐ Sparisce il ritratto e basta. Nel disegno la miniatura del video
        abita la stessa [data-scheda] del ritratto, quindi salendo alla
        scheda se ne andrebbe anche il video: sono due cose diverse. */
  var bio = q("[data-bio]");
  if(bio && !d.biografia) bio.setAttribute("hidden", "");

  /* ⑥ le porte */
  paginaPorte(pag, d);
}


/* ══ CONDIVIDI ═════════════════════════════════════════════════ */

/* ⭐ Si chiama per ultimo, dopo paginaAccendi: quei due href li scrive
   anche il modello, con location.href, e vince chi scrive dopo. */
function paginaCondividi(pag, d){
  var ind = BASE_INDIRIZZO + "?p=pagina&n=" + encodeURIComponent(d.nome_url);
  var wa = pag.querySelector("[data-wa]"), ml = pag.querySelector("[data-ml]");
  if(wa) wa.setAttribute("href",
    "https://wa.me/?text=" + encodeURIComponent(d.nome + " — " + ind));
  if(ml) ml.setAttribute("href",
    "mailto:?subject=" + encodeURIComponent(d.nome) +
    "&body=" + encodeURIComponent(ind));
}


/* ══ LE PORTE ══════════════════════════════════════════════════ */

function paginaPorte(pag, d){
  var tutte = [].slice.call(pag.querySelectorAll("[data-porta]"));
  if(!tutte.length) return;

  /* una porta con la mappa, e una senza: sono i due stampi */
  var conMappa = null, senzaMappa = null;
  tutte.forEach(function(p){
    if(p.querySelector("[data-mappa]")){ if(!conMappa) conMappa = p; }
    else if(!senzaMappa) senzaMappa = p;
  });

  var dove = tutte[0].parentNode;
  var dopo = tutte[tutte.length - 1].nextSibling;
  tutte.forEach(function(p){ p.parentNode.removeChild(p); });

  if(!d.porte || !d.porte.length){
    var seg = pag.querySelector("[data-segno]");
    if(seg && seg.parentNode) seg.parentNode.setAttribute("hidden", "");
    return;
  }

  d.porte.forEach(function(p){
    var stampo = (p.luogo && p.luogo.lat && p.luogo.lon && conMappa)
      ? conMappa : (senzaMappa || conMappa);
    if(!stampo) return;

    var n = stampo.cloneNode(true);
    var filo = FILO_ELEMENTO[p.elemento] || FILO_ELEMENTO.nexus;
    n.style.borderLeftColor = filo;

    var occ = n.querySelector("[data-occhiello], [data-k]");
    if(occ){
      occ.textContent = PORTA_OCCHIELLO[p.elemento] || "";
      occ.style.color = filo;
    }
    paginaScrivi(n.querySelector("b"), p.titolo);
    paginaScrivi(n.querySelector("i"), p.testo);

    /* dove porta */
    var vai = p.url || "#";
    if(n.tagName === "A") n.setAttribute("href", vai);
    var rim = n.querySelector("[data-rimando]");
    if(rim && rim.tagName === "A") rim.setAttribute("href", vai);

    /* la mappa, se la porta ha un luogo */
    var mp = n.querySelector("[data-mappa]");
    if(mp){
      if(p.luogo && p.luogo.lat && p.luogo.lon){
        mp.setAttribute("data-lat", p.luogo.lat);
        mp.setAttribute("data-lon", p.luogo.lon);
        mp.setAttribute("data-nome", p.luogo.nome || "");
        mp.setAttribute("data-torna", d.nome || "");
      } else {
        mp.parentNode.removeChild(mp);
      }
    }

    dove.insertBefore(n, dopo);
  });
}


/* ══ MINUZIE ═══════════════════════════════════════════════════ */

function paginaScrivi(e, testo){
  if(!e) return;
  if(testo === null || testo === undefined || testo === ""){
    e.setAttribute("hidden", ""); return;
  }
  e.textContent = testo;
  e.removeAttribute("hidden");
}

function paginaOcchiello(d){
  var v = [];
  if(d.si_compra || d.si_scambia || d.si_dona) v.push("Emporio");
  if(d.scaffale) v.push(d.scaffale.charAt(0).toUpperCase() + d.scaffale.slice(1));
  return v.join(" · ");
}

function paginaEuro(n){
  return Number(n).toFixed(2).replace(".", ",") + " €";
}

function paginaPulisci(s){
  return String(s).replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

function paginaVuota(pag, testo){
  pag.innerHTML = '<p style="font-family:\'Cormorant Garamond\',serif;' +
    'font-style:italic;color:rgba(245,240,230,.45);text-align:center;' +
    'padding:4rem 1rem">' + testo + '</p>';
}


/* ══ IL NOME CHIESTO DALL'INDIRIZZO ════════════════════════════ */

var pagineNomeChiesto = (function(){
  var m = location.search.match(/[?&]n=([A-Za-z0-9_-]{1,60})/);
  return m ? m[1] : null;
})();
