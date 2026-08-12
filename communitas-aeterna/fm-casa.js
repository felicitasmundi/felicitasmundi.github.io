/* ════════════════════════════════════════════════════════════════
   Comunità Eterna FelicitasMundi · LA CASA — la home dello Spazio Vivo

   Il disegno è di Design: casa-spazio-vivo.html
   40.424 byte · MD5 5e3d9fb30ea4fb1df64385484eed15c7

   ⭐ Aggiornare la home vuol dire sostituire questo file, e basta.

   Non contiene: la barra, la plancia della radio, il Megafono, la
   mappa a tutto schermo, il piede. Quelle sono del guscio.

   ⛔ Niente involucro (function(){ … })(): il guscio mette tutto in
      comune e questo file legge da lì. Rimettendolo, home() non vede
      più le variabili del guscio e la pagina non si apre.
   ════════════════════════════════════════════════════════════════ */

/* il disegno, come consegnato: lo stile della casa e il suo corpo */
var CASA = `<style>
  .sv-casa [data-scelta]:hover{border-color:rgba(200,160,85,0.5);color:#F5F0E6}
  .sv-casa [data-leg]{grid-template-columns:repeat(4,minmax(0,1fr))}
  .sv-casa [data-leg] > div{min-width:0}
  .sv-casa [data-leg] b,.sv-casa [data-leg] i{min-width:0;overflow-wrap:anywhere}
  .sv-casa button{font-family:'DM Sans',sans-serif}
  @media(max-width:62rem){ .sv-casa [data-leg]{grid-template-columns:repeat(2,minmax(0,1fr))} }
  @media(max-width:52rem){
    .sv-casa{padding-left:1.1rem;padding-right:1.1rem}
    .sv-casa [data-libro]{padding:0.3rem;border-width:1px;box-shadow:none}
    .sv-casa [data-piega]{opacity:0.28}
  }
  @media(max-width:34rem){ .sv-casa [data-leg]{grid-template-columns:minmax(0,1fr)} }
</style>

<div class="sv-casa" style="--scala:1.4;--navy:#0A0C1A;--oro:#C8A055;--oro-ch:#D4AF6A;--ivory:#F5F0E6;--line:rgba(184,150,62,0.2);--t-eti:calc(0.8125rem * var(--scala));--t-tas:calc(0.9375rem * var(--scala));--t-cor:calc(1.0625rem * var(--scala));--t-scr:calc(1.125rem * var(--scala));--t-tit:calc(1.5rem * var(--scala));--t-big:calc(1.9rem * var(--scala));max-width:56rem;margin:0 auto;display:flex;flex-direction:column;color:#F5F0E6;font-family:'DM Sans',sans-serif;-webkit-font-smoothing:antialiased">

  <!-- IL LIBRO CON LA MAPPA -->
  <section style="order:1;margin-top:1.2rem">
    <h2 style="font-family:'Cinzel',serif;font-weight:500;font-size:var(--t-tit);color:var(--ivory);margin:0 0 0.9rem">Collega le tue orme</h2>
    <div data-libro="1" style="position:relative;border:1px solid rgba(200,160,85,0.5);border-radius:0.5rem;padding:0.75rem;background:linear-gradient(160deg,rgba(30,24,16,0.9),rgba(10,12,26,0.95));box-shadow:0 1.2rem 2.6rem rgba(2,4,12,0.55),inset 0 0 0 1px rgba(2,4,12,0.6)">
      <div style="position:relative;border:1px solid rgba(200,160,85,0.32);border-radius:0.25rem;overflow:hidden;background:#070c1a">
        <div style="position:relative;height:26rem">
          <iframe id="sv-mappa" src="mappa-ferma.html" title="La mappa" loading="lazy" style="position:absolute;inset:0;width:100%;height:100%;border:0;pointer-events:none"></iframe>
          <div data-piega="1" style="position:absolute;top:0;bottom:0;left:50%;width:3.4rem;transform:translateX(-50%);pointer-events:none;background:linear-gradient(to right,rgba(2,4,12,0) 0%,rgba(2,4,12,0.45) 42%,rgba(245,240,230,0.07) 50%,rgba(2,4,12,0.45) 58%,rgba(2,4,12,0) 100%)"></div>
          <div id="sv-velo" style="position:absolute;inset:0;cursor:pointer;touch-action:pan-y;display:flex;align-items:flex-end;justify-content:center;padding-bottom:1.4rem;background:linear-gradient(to bottom,rgba(2,4,12,0) 58%,rgba(2,4,12,0.55))">
            <span style="background:rgba(10,12,26,0.88);border:1px solid rgba(200,160,85,0.5);color:var(--ivory);border-radius:999px;padding:0.55rem 1.2rem;font-size:var(--t-tas);letter-spacing:0.04em">Esplora</span>
          </div>
          <div id="sv-filo" style="position:absolute;inset:0;z-index:1;pointer-events:none;box-shadow:inset 0 0 0 2px rgba(212,175,106,0.75);opacity:0"></div>
          <div style="position:absolute;right:0.7rem;bottom:0.7rem;z-index:2;display:flex;gap:0.4rem">
            <button id="sv-meno" style="background:rgba(10,12,26,0.9);border:1px solid rgba(200,160,85,0.5);color:var(--ivory);border-radius:999px;width:2.4rem;height:2.4rem;font-size:var(--t-eti);line-height:1;cursor:pointer">−</button>
            <button id="sv-piu" style="background:rgba(10,12,26,0.9);border:1px solid rgba(200,160,85,0.5);color:var(--ivory);border-radius:999px;width:2.4rem;height:2.4rem;font-size:var(--t-eti);line-height:1;cursor:pointer">+</button>
          </div>
        </div>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:baseline;gap:1rem;flex-wrap:wrap;padding:0.7rem 0.3rem 0.1rem">
        <span style="font-family:'Cormorant Garamond',serif;font-style:italic;font-size:var(--t-cor);color:rgba(245,240,230,0.82)">Il dito che passa scorre la pagina. Si tiene premuto per spostare la mappa, si tocca per aprirla.</span>
        <span style="font-family:ui-monospace,monospace;font-size:var(--t-eti);color:rgba(245,240,230,0.55)">segni finti · i contesti veri sono [ in attesa ]</span>
      </div>
    </div>
  </section>

  <!-- COSA INCONTRI · le due pastiglie -->
  <section style="order:3;margin-top:1.8rem">
    <div style="display:flex;gap:0.8rem;flex-wrap:wrap;align-items:center">
      <h2 style="font-family:'Cinzel',serif;font-weight:500;font-size:var(--t-cor);letter-spacing:0.08em;text-transform:uppercase;color:var(--ivory);margin:0">Cosa incontri</h2>
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
  <section style="order:4;margin-top:1.6rem;display:flex;flex-direction:column;gap:0.7rem">
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

  <!-- LE DUE ORME -->
  <section style="order:5;display:grid;grid-template-columns:repeat(auto-fit,minmax(19rem,1fr));gap:1.1rem;margin-top:1.8rem;align-items:stretch">

    <div style="border:1px solid var(--line);border-radius:0.9rem;overflow:hidden;background:rgba(245,240,230,0.03);display:flex;flex-direction:column">
        <div>
          <div style="position:relative;height:15rem;background:repeating-linear-gradient(135deg,rgba(245,240,230,0.05) 0 8px,rgba(245,240,230,0.02) 8px 16px);display:flex;align-items:center;justify-content:center">
            <span style="font-family:ui-monospace,monospace;font-size:var(--t-eti);color:rgba(245,240,230,0.55);text-align:center;padding:0 1rem">la foto dell'orma<br>[ in attesa ]</span>
          </div>
          <div style="display:flex;gap:0.9rem;align-items:flex-start;padding:0.9rem 1.1rem 0">
            <span style="flex:0 0 auto;width:2.4rem;height:2.4rem;border-radius:50%;border:1px dashed rgba(200,160,85,0.5);display:block;cursor:pointer"></span>
            <div style="min-width:0;display:flex;flex-direction:column;gap:0.15rem">
              <b style="font-family:'Cinzel',serif;font-weight:500;font-size:var(--t-cor);color:var(--ivory);line-height:1.3">[ in attesa ]</b>
              <i style="font-family:'Cormorant Garamond',serif;font-size:var(--t-eti);color:rgba(245,240,230,0.88);line-height:1.4">[ in attesa ]</i>
              <span style="font-family:'DM Sans',sans-serif;font-size:var(--t-eti);color:rgba(245,240,230,0.78);line-height:1.4">[ in attesa ]</span>
            </div>
          </div>
          <div style="display:flex;gap:0.4rem;flex-wrap:wrap;padding:0.8rem 1.1rem 1.1rem 4.4rem">
            <span style="border:1px solid var(--line);border-radius:999px;padding:0.3rem 0.7rem;font-family:'DM Sans',sans-serif;font-size:var(--t-eti);color:rgba(245,240,230,0.86);cursor:pointer">[ in attesa ]</span>
            <span style="border:1px solid var(--line);border-radius:999px;padding:0.3rem 0.7rem;font-family:'DM Sans',sans-serif;font-size:var(--t-eti);color:rgba(245,240,230,0.86);cursor:pointer">[ in attesa ]</span>
            <span style="border:1px solid var(--line);border-radius:999px;padding:0.3rem 0.7rem;font-family:'DM Sans',sans-serif;font-size:var(--t-eti);color:rgba(245,240,230,0.86);cursor:pointer">[ in attesa ]</span>
          </div>
        </div>
    </div>

    <div style="border:1px solid var(--line);border-radius:0.9rem;overflow:hidden;background:rgba(245,240,230,0.03);display:flex;flex-direction:column">
        <div style="flex:1;min-height:20rem;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0.9rem;padding:2rem 1.6rem;text-align:center;border:1px dashed rgba(200,160,85,0.35);border-radius:0.9rem;margin:0.6rem">
          <span style="width:2.8rem;height:2.8rem;color:var(--oro-ch)"><svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" style="width:100%;height:100%;display:block"><path d="M24.5 20C24.5 22.54 22.54 24.5 20 24.5C17.46 24.5 15.5 22.54 15.5 20C15.5 17.46 17.46 15.5 20 15.5C22.54 15.5 24.5 17.46 24.5 20Z"></path><path d="M31 20C31 26.21 26.21 31 20 31C13.79 31 9 26.21 9 20C9 13.79 13.79 9 20 9C26.21 9 31 13.79 31 20Z"></path></svg></span>
          <div style="font-family:'Cormorant Garamond',serif;font-size:var(--t-scr);line-height:1.5;color:var(--ivory);max-width:22rem">Qui non c'è ancora niente: è la porta d'ingresso. Lascia la tua orma.</div>
          <button style="border:1px solid var(--oro);background:rgba(200,160,85,0.14);color:var(--ivory);border-radius:999px;padding:0.55rem 1.2rem;font-family:'DM Sans',sans-serif;font-size:var(--t-tas);cursor:pointer">[ in attesa ]</button>
        </div>
    </div>
  </section>

  <!-- LA LEGENDA · quattro più tre -->
  <section style="order:2;margin-top:1.1rem">
    <div data-leg="1" style="display:grid;gap:0.8rem 1.6rem">

        <div style="display:grid;grid-template-columns:2.9rem minmax(0,1fr);gap:0.8rem;align-items:center;min-width:0">
          <span style="width:2.4rem;height:2.4rem;color:var(--oro-ch)"><svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" style="width:100%;height:100%;display:block"><path d="M24.5 20C24.5 22.54 22.54 24.5 20 24.5C17.46 24.5 15.5 22.54 15.5 20C15.5 17.46 17.46 15.5 20 15.5C22.54 15.5 24.5 17.46 24.5 20Z"></path><path d="M31 20C31 26.21 26.21 31 20 31C13.79 31 9 26.21 9 20C9 13.79 13.79 9 20 9C26.21 9 31 13.79 31 20Z"></path></svg></span>
          <span><b style="display:block;font-size:var(--t-tas);font-weight:500;line-height:1.25">orma</b><i style="display:block;font-family:'Cormorant Garamond',serif;font-size:var(--t-cor);color:rgba(245,240,230,0.82);line-height:1.35">le tracce del sentiero</i></span>
        </div>

        <div style="display:grid;grid-template-columns:2.9rem minmax(0,1fr);gap:0.8rem;align-items:center;min-width:0">
          <span style="width:2.4rem;height:2.4rem;color:var(--oro-ch)"><svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" style="width:100%;height:100%;display:block"><path d="M14 20C14 22.26 12.26 24 10 24C7.74 24 6 22.26 6 20C6 17.74 7.74 16 10 16C12.26 16 14 17.74 14 20Z"></path><path d="M34 20C34 22.26 32.26 24 30 24C27.74 24 26 22.26 26 20C26 17.74 27.74 16 30 16C32.26 16 34 17.74 34 20Z"></path><path d="M14 20L26 20"></path></svg></span>
          <span><b style="display:block;font-size:var(--t-tas);font-weight:500;line-height:1.25">connessione</b><i style="display:block;font-family:'Cormorant Garamond',serif;font-size:var(--t-cor);color:rgba(245,240,230,0.82);line-height:1.35">espandere la rete</i></span>
        </div>

        <div style="display:grid;grid-template-columns:2.9rem minmax(0,1fr);gap:0.8rem;align-items:center;min-width:0">
          <span style="width:2.4rem;height:2.4rem;color:var(--oro-ch)"><svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" style="width:100%;height:100%;display:block"><path d="M12.5 20C12.5 21.97 10.97 23.5 9 23.5C7.03 23.5 5.5 21.97 5.5 20C5.5 18.03 7.03 16.5 9 16.5C10.97 16.5 12.5 18.03 12.5 20Z"></path><path d="M34.5 20C34.5 21.97 32.97 23.5 31 23.5C29.03 23.5 27.5 21.97 27.5 20C27.5 18.03 29.03 16.5 31 16.5C32.97 16.5 34.5 18.03 34.5 20Z"></path><path d="M13 16L27 16M27 16L23.5 12.5M27 24L13 24M13 24L16.5 27.5"></path></svg></span>
          <span><b style="display:block;font-size:var(--t-tas);font-weight:500;line-height:1.25">scambio</b><i style="display:block;font-family:'Cormorant Garamond',serif;font-size:var(--t-cor);color:rgba(245,240,230,0.82);line-height:1.35">nutrire l'esistenza</i></span>
        </div>

        <div style="display:grid;grid-template-columns:2.9rem minmax(0,1fr);gap:0.8rem;align-items:center;min-width:0">
          <span style="width:2.4rem;height:2.4rem;color:var(--oro-ch)"><svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" style="width:100%;height:100%;display:block"><path d="M23.4 10C23.4 11.92 21.92 13.4 20 13.4C18.08 13.4 16.6 11.92 16.6 10C16.6 8.08 18.08 6.6 20 6.6C21.92 6.6 23.4 8.08 23.4 10Z"></path><path d="M13.9 27C13.9 28.92 12.42 30.4 10.5 30.4C8.58 30.4 7.1 28.92 7.1 27C7.1 25.08 8.58 23.6 10.5 23.6C12.42 23.6 13.9 25.08 13.9 27Z"></path><path d="M32.9 27C32.9 28.92 31.42 30.4 29.5 30.4C27.58 30.4 26.1 28.92 26.1 27C26.1 25.08 27.58 23.6 29.5 23.6C31.42 23.6 32.9 25.08 32.9 27Z"></path><path d="M20 13.4L20 19M13 25.2L17.4 20.8M27 25.2L22.6 20.8"></path><path d="M22 20C22 21.13 21.13 22 20 22C18.87 22 18 21.13 18 20C18 18.87 18.87 18 20 18C21.13 18 22 18.87 22 20Z" fill="currentColor" stroke="none"></path></svg></span>
          <span><b style="display:block;font-size:var(--t-tas);font-weight:500;line-height:1.25">vicinato</b><i style="display:block;font-family:'Cormorant Garamond',serif;font-size:var(--t-cor);color:rgba(245,240,230,0.82);line-height:1.35">la forza comune</i></span>
        </div>

        <div style="display:grid;grid-template-columns:2.9rem minmax(0,1fr);gap:0.8rem;align-items:center;min-width:0">
          <span style="width:2.4rem;height:2.4rem;color:var(--oro-ch)"><svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" style="width:100%;height:100%;display:block"><path d="M33 20C33 27.33 27.33 33 20 33C12.67 33 7 27.33 7 20C7 12.67 12.67 7 20 7C27.33 7 33 12.67 33 20Z"></path><path d="M22.4 7C22.4 8.35 21.35 9.4 20 9.4C18.65 9.4 17.6 8.35 17.6 7C17.6 5.65 18.65 4.6 20 4.6C21.35 4.6 22.4 5.65 22.4 7Z" fill="currentColor" stroke="none"></path><path d="M33.7 26.5C33.7 27.85 32.65 28.9 31.3 28.9C29.95 28.9 28.9 27.85 28.9 26.5C28.9 25.15 29.95 24.1 31.3 24.1C32.65 24.1 33.7 25.15 33.7 26.5Z" fill="currentColor" stroke="none"></path><path d="M11.1 26.5C11.1 27.85 10.05 28.9 8.7 28.9C7.35 28.9 6.3 27.85 6.3 26.5C6.3 25.15 7.35 24.1 8.7 24.1C10.05 24.1 11.1 25.15 11.1 26.5Z" fill="currentColor" stroke="none"></path><path d="M23.2 20C23.2 21.81 21.81 23.2 20 23.2C18.19 23.2 16.8 21.81 16.8 20C16.8 18.19 18.19 16.8 20 16.8C21.81 16.8 23.2 18.19 23.2 20Z"></path></svg></span>
          <span><b style="display:block;font-size:var(--t-tas);font-weight:500;line-height:1.25">ritmo</b><i style="display:block;font-family:'Cormorant Garamond',serif;font-size:var(--t-cor);color:rgba(245,240,230,0.82);line-height:1.35">feste, formazioni, esperienze</i></span>
        </div>

        <div style="display:grid;grid-template-columns:2.9rem minmax(0,1fr);gap:0.8rem;align-items:center;min-width:0">
          <span style="width:2.4rem;height:2.4rem;color:var(--oro-ch)"><svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" style="width:100%;height:100%;display:block"><path d="M23 20C23 25.08 19.08 29 14 29C8.92 29 5 25.08 5 20C5 14.92 8.92 11 14 11C19.08 11 23 14.92 23 20Z"></path><path d="M35 20C35 25.08 31.08 29 26 29C20.92 29 17 25.08 17 20C17 14.92 20.92 11 26 11C31.08 11 35 14.92 35 20Z"></path><path d="M20 12.9C22 17.63 22 22.37 20 27.1C18 22.37 18 17.63 20 12.9Z"></path></svg></span>
          <span><b style="display:block;font-size:var(--t-tas);font-weight:500;line-height:1.25">incontro</b><i style="display:block;font-family:'Cormorant Garamond',serif;font-size:var(--t-cor);color:rgba(245,240,230,0.82);line-height:1.35">relazione tra vicinati</i></span>
        </div>

        <div style="display:grid;grid-template-columns:2.9rem minmax(0,1fr);gap:0.8rem;align-items:center;min-width:0">
          <span style="width:2.4rem;height:2.4rem;color:var(--oro-ch)"><svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" style="width:100%;height:100%;display:block"><path d="M4 14L20 5L36 14Z"></path><path d="M5 16.5L35 16.5M8.5 19L8.5 31M16 19L16 31M24 19L24 31M31.5 19L31.5 31M5 33.5L35 33.5"></path><path d="M20 29.5C17.67 26.83 17.33 23.67 19 20C19.4 22.27 20 23.6 20.8 24C22.13 22.8 22.63 21.47 22.3 20C23.97 22.67 24.37 25.07 23.5 27.2C22.9 28.47 21.73 29.23 20 29.5Z" fill="currentColor" stroke="none"></path></svg></span>
          <span><b style="display:block;font-size:var(--t-tas);font-weight:500;line-height:1.25">tempio</b><i style="display:block;font-family:'Cormorant Garamond',serif;font-size:var(--t-cor);color:rgba(245,240,230,0.82);line-height:1.35">luoghi sacri custoditi</i></span>
        </div>

    </div>
  </section>

  <!-- LE SETTE DOMANDE -->
  <section style="order:6;margin-top:4rem">
    <h2 style="font-family:'Cinzel',serif;font-weight:500;font-size:var(--t-tit);margin:0 0 0.9rem">Le domande dei nuovi arrivati</h2>

    <details style="border-top:1px solid var(--line)">
      <summary style="display:flex;gap:0.7rem;padding:0.9rem 0.1rem;cursor:pointer;font-family:'Cinzel',serif;font-size:var(--t-cor);line-height:1.4;list-style:none">
        <span style="color:var(--oro)">›</span><span>Cos'è la Comunità Eterna?</span>
      </summary>
      <div style="padding:0 0.1rem 1.1rem 1.4rem;font-family:'Cormorant Garamond',serif;font-size:var(--t-cor);line-height:1.62;color:rgba(245,240,230,0.88);display:flex;flex-direction:column;gap:0.7rem">
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
      <div style="padding:0 0.1rem 1.1rem 1.4rem;font-family:'Cormorant Garamond',serif;font-size:var(--t-cor);line-height:1.62;color:rgba(245,240,230,0.88);display:flex;flex-direction:column;gap:0.7rem">
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
      <div style="padding:0 0.1rem 1.1rem 1.4rem;font-family:'Cormorant Garamond',serif;font-size:var(--t-cor);line-height:1.62;color:rgba(245,240,230,0.88);display:flex;flex-direction:column;gap:0.7rem">
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
      <div style="padding:0 0.1rem 1.1rem 1.4rem;font-family:'Cormorant Garamond',serif;font-size:var(--t-cor);line-height:1.62;color:rgba(245,240,230,0.88);display:flex;flex-direction:column;gap:0.7rem">
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
      <div style="padding:0 0.1rem 1.1rem 1.4rem;font-family:'Cormorant Garamond',serif;font-size:var(--t-cor);line-height:1.62;color:rgba(245,240,230,0.88);display:flex;flex-direction:column;gap:0.7rem">
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
      <div style="padding:0 0.1rem 1.1rem 1.4rem;font-family:'Cormorant Garamond',serif;font-size:var(--t-cor);line-height:1.62;color:rgba(245,240,230,0.88);display:flex;flex-direction:column;gap:0.7rem">
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
      <div style="padding:0 0.1rem 1.1rem 1.4rem;font-family:'Cormorant Garamond',serif;font-size:var(--t-cor);line-height:1.62;color:rgba(245,240,230,0.88);display:flex;flex-direction:column;gap:0.7rem">
        <p style="margin:0">Tutto questo progetto nasce come progetto educativo: educare l'umanità a una cultura che indirizza verso una civiltà che evolve.</p>
        <p style="margin:0">Questo indirizzo lo si può dare partendo proprio dai bambini, che hanno bisogno di esempi. E gli esempi li si danno con adulti che mostrano il buon senso, che mostrano il reciproco aiuto, che gioiscono con la musica e con il buon cibo — un cibo naturale, raccolto con le mani dopo essersene presi cura.</p>
        <p style="margin:0">Il bambino impara a prendersi cura dell'esistenza grazie ad adulti che hanno imparato a loro volta.</p>
        <p style="margin:0">È questa la Comunità Eterna.</p>
      </div>
    </details>
  </section>


</div>`;

function home(c){
  c.innerHTML = CASA;
  avviaCasa();
  contaOrme();          /* il cenno delle orme vive nella barra, non nella casa */
}

/* ── il codice della casa, come l'ha scritto Design: non si tocca ──
   Chiede al guscio window.SpazioVivo.apriMappa(), e se non la trova
   lancia 'spazio-vivo:apri-mappa' sul documento. Il guscio espone la
   prima. */
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

  /* ③ il libro: i tasti stringono e allargano, il trascinamento sposta,
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
