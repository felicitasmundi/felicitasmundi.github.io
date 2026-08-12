/* ════════════════════════════════════════════════════════════════
   Comunità Eterna FelicitasMundi · IL PRATICANTATO — come funziona

   Il disegno è di Design: praticantato.html
   18.362 byte · MD5 b62abe38c51ae10076955d770b30b7a8

   ⭐ Aggiornare la pagina vuol dire sostituire questo file, e basta.

   Non contiene: la barra, la plancia della radio, il Megafono, il
   piede. Quelle sono del guscio.

   Sostituisce sentiero(), che stava in fm-incontro.js.

   ⚠️ UN SOLO PUNTO DIVERGE dal file di Design, ed è segnato sul posto:
      l'indice scorre il quadrante centrale invece della finestra.
      Nel guscio la finestra non scorre, quindi window.scrollTo non
      portava da nessuna parte. Il disegno della pagina non cambia.

   ⛔ Niente involucro (function(){ … })(): il guscio mette tutto in
      comune e questo file legge da lì. Rimettendolo, praticantato()
      non vede più le variabili del guscio e la stanza non si apre.
   ════════════════════════════════════════════════════════════════ */

/* il disegno, come consegnato: lo stile della pagina e il suo corpo */
var PRATICANTATO = `<style>
  .sv-prat .idx{border:1px solid var(--line);border-radius:0.7rem;padding:0.9rem 1rem;margin:1rem 0}
  .sv-prat .idx h3{font-family:'Cinzel',serif;font-size:var(--t-eti);letter-spacing:0.16em;
    text-transform:uppercase;color:var(--oro-ch);margin-bottom:0.6rem}
  .sv-prat .idx a{display:block;padding:0.3rem 0;font-family:'DM Sans',sans-serif;
    font-size:var(--t-eti);color:rgba(245,240,230,0.84);cursor:pointer}
  .sv-prat .idx a:hover{color:var(--oro-ch)}
  .sv-prat .idx-voci{display:grid;grid-template-columns:1fr 1fr;grid-template-rows:repeat(3,auto);grid-auto-flow:column;gap:0 1.6rem}
  .sv-prat .idx-voci a{display:flex;gap:0.6rem;align-items:baseline}
  .sv-prat .idx-voci a span{flex:0 0 auto;color:var(--oro);font-family:'Cinzel',serif}
  .sv-prat .cap{border-top:1px solid var(--line)}
  .sv-prat .cap:last-of-type{border-bottom:1px solid var(--line)}
  .sv-prat .cap-t{display:flex;align-items:flex-start;gap:0.7rem;width:100%;background:none;border:0;
    text-align:left;cursor:pointer;padding:0.85rem 0.1rem;color:var(--ivory);
    font-family:'Cinzel',serif;font-size:var(--t-cor);font-weight:400;line-height:1.35}
  .sv-prat .cap-t:hover{color:var(--oro-ch)}
  .sv-prat .cap-f{flex:0 0 auto;color:var(--oro);font-size:var(--t-eti);line-height:1.5;
    transition:transform .22s ease}
  .sv-prat .cap.aperto .cap-f{transform:rotate(90deg)}
  .sv-prat .cap-c{overflow:hidden;max-height:0;transition:max-height .34s ease}
  .sv-prat .cap-c .dentro{padding:0 0.1rem 1rem 1.4rem;display:flex;flex-direction:column;gap:0.7rem}
  .sv-prat .cap-c p:last-child{margin-bottom:0}
  .sv-prat [data-tocca]{cursor:pointer;transition:border-color .18s ease}
  .sv-prat [data-tocca]:hover{border-color:rgba(200,160,85,0.5)}
  .sv-prat button{font-family:'DM Sans',sans-serif}
  .sv-prat [data-vetro]{display:flex;align-items:center;justify-content:center}
  .sv-prat [data-vetro][hidden]{display:none !important}
  @media(max-width:52rem){
    .sv-prat{padding-left:1.1rem;padding-right:1.1rem}
    .sv-prat .idx-voci{grid-template-columns:1fr;grid-template-rows:none;grid-auto-flow:row}
  }
</style>

<div class="sv-prat" style="--scala:1.4;--navy:#0A0C1A;--oro:#C8A055;--oro-ch:#D4AF6A;--ivory:#F5F0E6;--line:rgba(184,150,62,0.2);--t-eti:calc(0.8125rem * var(--scala));--t-tas:calc(0.9375rem * var(--scala));--t-cor:calc(1.0625rem * var(--scala));--t-scr:calc(1.125rem * var(--scala));--t-tit:calc(1.5rem * var(--scala));--t-big:calc(1.9rem * var(--scala));max-width:56rem;margin:0 auto;display:flex;flex-direction:column;color:#F5F0E6;font-family:'DM Sans',sans-serif;-webkit-font-smoothing:antialiased">

  <!-- LA TESTA -->
  <header style="margin-top:0.6rem">
    <div style="font-family:'Cinzel',serif;font-size:var(--t-eti);letter-spacing:0.22em;text-transform:uppercase;color:var(--oro-ch);margin-bottom:0.5rem">Comunità Eterna FelicitasMundi</div>
    <h1 style="font-family:'Cinzel',serif;font-weight:500;font-size:var(--t-big);line-height:1.2;color:var(--ivory);margin:0 0 0.4rem">Praticantato</h1>
  </header>

  <!-- L'INDICE ANALITICO -->
  <div class="idx">
    <h3>Indice</h3>
    <div class="idx-voci">
      <a data-va="prat-c1"><span>1</span>Come funziona l'orma</a>
      <a data-va="prat-c2"><span>2</span>Evolvere col Praticantato — tutti i servizi pro</a>
      <a data-va="prat-c3"><span>3</span>Metti in circolo l'Opera dell'Anima</a>
      <a data-va="prat-c4"><span>4</span>Unisci prodotti, consulenze e argomenti di ricerca</a>
      <a data-va="prat-c5"><span>5</span>Felicitas + API = Usa l'AI con consapevolezza</a>
    </div>
  </div>

  <!-- LA RICERCA — in cima, prima dei capitoli. Si apre sopra la pagina. -->
  <section style="margin-top:0.6rem;margin-bottom:1.6rem">
    <div data-tocca="1" id="prat-ricerca" role="button" tabindex="0" style="display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap;border:1px solid rgba(200,160,85,0.5);border-radius:0.9rem;padding:1.1rem 1.2rem;background:linear-gradient(160deg,rgba(30,24,16,0.55),rgba(10,12,26,0.5))">
      <div style="min-width:0;display:flex;flex-direction:column;gap:0.25rem">
        <b style="font-family:'Cinzel',serif;font-weight:500;font-size:var(--t-tit);color:var(--ivory);line-height:1.25">la ricerca</b>
        <i style="font-family:'Cormorant Garamond',serif;font-size:var(--t-cor);color:rgba(245,240,230,0.82);line-height:1.4">[ in attesa ]</i>
      </div>
      <span style="flex:0 0 auto;border:1px solid var(--oro);background:rgba(200,160,85,0.14);color:var(--ivory);border-radius:999px;padding:0.5rem 1.1rem;font-size:var(--t-tas);letter-spacing:0.04em">[ in attesa ]</span>
    </div>
  </section>

  <!-- I SEI CAPITOLI -->
  <section id="prat-capitoli">

    <div class="cap" id="prat-c1">
      <button class="cap-t"><span class="cap-f">›</span><span>Come funziona l'orma</span></button>
      <div class="cap-c">
        <div class="dentro">
          <p style="font-family:'Cormorant Garamond',serif;font-size:var(--t-cor);line-height:1.62;color:rgba(245,240,230,0.88);margin:0">[ in attesa ]</p>
          <blockquote style="margin:0;padding-left:0.9rem;border-left:1px solid var(--line);font-family:'Cormorant Garamond',serif;font-style:italic;font-size:var(--t-cor);line-height:1.55;color:var(--ivory)">«il gioco della mia orma, che ti consente di rivedere energeticamente il passato, ricapitolare, osservare le ferite emotive»</blockquote>
        </div>
      </div>
    </div>

    <div class="cap" id="prat-c2">
      <button class="cap-t"><span class="cap-f">›</span><span>Evolvere col Praticantato — tutti i servizi pro</span></button>
      <div class="cap-c">
        <div class="dentro">
          <p style="font-family:'Cormorant Garamond',serif;font-size:var(--t-cor);line-height:1.62;color:rgba(245,240,230,0.88);margin:0">[ in attesa ]</p>
        </div>
      </div>
    </div>

    <div class="cap" id="prat-c3">
      <button class="cap-t"><span class="cap-f">›</span><span>Metti in circolo l'Opera dell'Anima</span></button>
      <div class="cap-c">
        <div class="dentro">
          <p style="font-family:'Cormorant Garamond',serif;font-size:var(--t-cor);line-height:1.62;color:rgba(245,240,230,0.88);margin:0">[ in attesa ]</p>
        </div>
      </div>
    </div>

    <div class="cap" id="prat-c4">
      <button class="cap-t"><span class="cap-f">›</span><span>Unisci prodotti, consulenze e argomenti di ricerca</span></button>
      <div class="cap-c">
        <div class="dentro">
          <p style="font-family:'Cormorant Garamond',serif;font-size:var(--t-cor);line-height:1.62;color:rgba(245,240,230,0.88);margin:0">[ in attesa ]</p>
          <div style="display:flex;gap:0.45rem;flex-wrap:wrap">
            <span style="border:1px solid var(--line);border-radius:999px;padding:0.34rem 0.8rem;font-family:'Cinzel',serif;font-size:var(--t-tas);color:var(--ivory)">600 €</span>
            <span style="border:1px solid var(--line);border-radius:999px;padding:0.34rem 0.8rem;font-family:'Cinzel',serif;font-size:var(--t-tas);color:var(--ivory)">1.200 €</span>
            <span style="border:1px solid var(--line);border-radius:999px;padding:0.34rem 0.8rem;font-family:'Cinzel',serif;font-size:var(--t-tas);color:var(--ivory)">2.800 €</span>
          </div>
          <blockquote style="margin:0;padding-left:0.9rem;border-left:1px solid var(--line);font-family:'Cormorant Garamond',serif;font-style:italic;font-size:var(--t-cor);line-height:1.55;color:var(--ivory)">«se uno lo paga a un'azienda che non c'entra nulla diventa un problema — noi stessi prima di far pagare facciamo un'analisi»</blockquote>
          <button style="align-self:flex-start;border:1px solid var(--oro);background:rgba(200,160,85,0.14);color:var(--ivory);border-radius:999px;padding:0.55rem 1.2rem;font-size:var(--t-tas);cursor:pointer">Prenota una call</button>
        </div>
      </div>
    </div>

    <div class="cap" id="prat-c5">
      <button class="cap-t"><span class="cap-f">›</span><span>Felicitas + API = Usa l'AI con consapevolezza</span></button>
      <div class="cap-c">
        <div class="dentro">
          <p style="font-family:'Cormorant Garamond',serif;font-size:var(--t-cor);line-height:1.62;color:rgba(245,240,230,0.88);margin:0">[ in attesa ]</p>
        </div>
      </div>
    </div>

  </section>

  <!-- LE TRE AZIONI -->
  <section style="display:flex;gap:0.6rem;flex-wrap:wrap;margin-top:2.4rem">
    <button style="display:flex;align-items:baseline;gap:0.7rem;border:1px solid var(--line);background:rgba(245,240,230,0.03);color:var(--ivory);border-radius:999px;padding:0.7rem 1.2rem;font-size:var(--t-tas);cursor:pointer;text-align:left" data-tocca="1">
      <span>Scarica l'app</span>
      <span style="font-family:ui-monospace,monospace;font-size:var(--t-eti);color:rgba(245,240,230,0.6)">[ in attesa ]</span>
    </button>
    <button style="display:flex;align-items:baseline;gap:0.7rem;border:1px solid var(--line);background:rgba(245,240,230,0.03);color:var(--ivory);border-radius:999px;padding:0.7rem 1.2rem;font-size:var(--t-tas);cursor:pointer;text-align:left" data-tocca="1">
      <span>Invita una persona al praticantato e collegala alla tua orma</span>
      <span style="font-family:ui-monospace,monospace;font-size:var(--t-eti);color:rgba(245,240,230,0.6)">[ in attesa ]</span>
    </button>
    <button id="prat-regalo" style="display:flex;align-items:baseline;gap:0.7rem;border:1px solid var(--oro);background:rgba(200,160,85,0.14);color:var(--ivory);border-radius:999px;padding:0.7rem 1.2rem;font-size:var(--t-tas);cursor:pointer;text-align:left">
      <span>Regala il praticantato</span>
      <span style="font-family:ui-monospace,monospace;font-size:var(--t-eti);color:rgba(245,240,230,0.7)">1 mese · 3 mesi · 6 mesi · 1 anno</span>
    </button>
  </section>

  <!-- LA FINESTRA DELLA RICERCA -->
  <div data-vetro="1" id="prat-v-ricerca" hidden style="position:fixed;inset:0;z-index:120;background:rgba(2,4,12,0.72);backdrop-filter:blur(0.4rem);padding:1.2rem">
    <div role="dialog" aria-modal="true" style="position:relative;width:min(44rem,100%);max-height:82vh;overflow:auto;border:1px solid rgba(200,160,85,0.45);border-radius:1rem;background:linear-gradient(160deg,rgba(16,16,30,0.98),rgba(6,9,22,0.98));padding:1.6rem 1.4rem 1.8rem;box-shadow:0 1.6rem 3.6rem rgba(2,4,12,0.7)">
      <button data-chiudi="prat-v-ricerca" aria-label="Chiudi" style="position:absolute;top:0.7rem;right:0.7rem;width:2.4rem;height:2.4rem;border-radius:50%;border:1px solid var(--line);background:none;color:var(--ivory);font-size:var(--t-tas);line-height:1;cursor:pointer">×</button>
      <h3 style="font-family:'Cinzel',serif;font-weight:500;font-size:var(--t-tit);color:var(--ivory);margin:0 0 0.8rem">[ in attesa ]</h3>
      <p style="font-family:'Cormorant Garamond',serif;font-size:var(--t-cor);line-height:1.62;color:rgba(245,240,230,0.88);margin:0">[ in attesa ]</p>
    </div>
  </div>

  <!-- LA FINESTRA DEL REGALO -->
  <div data-vetro="1" id="prat-v-regalo" hidden style="position:fixed;inset:0;z-index:120;background:rgba(2,4,12,0.72);backdrop-filter:blur(0.4rem);padding:1.2rem">
    <div role="dialog" aria-modal="true" style="position:relative;width:min(34rem,100%);max-height:86vh;overflow:auto;border:1px solid rgba(200,160,85,0.45);border-radius:1rem;background:linear-gradient(160deg,rgba(16,16,30,0.98),rgba(6,9,22,0.98));box-shadow:0 1.6rem 3.6rem rgba(2,4,12,0.7)">
      <button data-chiudi="prat-v-regalo" aria-label="Chiudi" style="position:absolute;top:0.7rem;right:0.7rem;z-index:2;width:2.4rem;height:2.4rem;border-radius:50%;border:1px solid var(--line);background:rgba(10,12,26,0.8);color:var(--ivory);font-size:var(--t-tas);line-height:1;cursor:pointer">×</button>
      <div style="height:11rem;background:repeating-linear-gradient(135deg,rgba(245,240,230,0.05) 0 8px,rgba(245,240,230,0.02) 8px 16px);display:flex;align-items:center;justify-content:center">
        <span style="font-family:ui-monospace,monospace;font-size:var(--t-eti);color:rgba(245,240,230,0.55)">[ in attesa ]</span>
      </div>
      <div style="padding:1.2rem 1.3rem 1.4rem;display:flex;flex-direction:column;gap:0.9rem">
        <h3 style="font-family:'Cinzel',serif;font-weight:500;font-size:var(--t-tit);color:var(--ivory);margin:0">Regala il praticantato</h3>
        <div id="prat-durate" style="display:flex;gap:0.45rem;flex-wrap:wrap">
          <button data-durata="1" style="border:1px solid var(--oro);background:rgba(200,160,85,0.18);color:var(--ivory);border-radius:999px;padding:0.45rem 1rem;font-size:var(--t-tas);cursor:pointer">1 mese</button>
          <button data-durata="3" style="border:1px solid var(--line);background:none;color:rgba(245,240,230,0.86);border-radius:999px;padding:0.45rem 1rem;font-size:var(--t-tas);cursor:pointer">3 mesi</button>
          <button data-durata="6" style="border:1px solid var(--line);background:none;color:rgba(245,240,230,0.86);border-radius:999px;padding:0.45rem 1rem;font-size:var(--t-tas);cursor:pointer">6 mesi</button>
          <button data-durata="12" style="border:1px solid var(--line);background:none;color:rgba(245,240,230,0.86);border-radius:999px;padding:0.45rem 1rem;font-size:var(--t-tas);cursor:pointer">1 anno</button>
        </div>
        <div style="display:flex;align-items:baseline;justify-content:space-between;gap:1rem;border-top:1px solid var(--line);padding-top:0.9rem">
          <span style="font-size:var(--t-eti);letter-spacing:0.16em;text-transform:uppercase;color:var(--oro-ch)">totale</span>
          <b id="prat-totale" style="font-family:'Cinzel',serif;font-weight:500;font-size:var(--t-tit);color:var(--ivory)">[ in attesa ]</b>
        </div>
        <button style="align-self:stretch;border:1px solid var(--oro);background:rgba(200,160,85,0.14);color:var(--ivory);border-radius:999px;padding:0.65rem 1.2rem;font-size:var(--t-tas);cursor:pointer">Avanti</button>
      </div>
    </div>
  </div>

</div>`;

function praticantato(c){
  c.innerHTML = PRATICANTATO;
  avviaPraticantato();
}

/* ── il codice della pagina, come l'ha scritto Design: non si tocca ── */
function avviaPraticantato(){
(function () {
  "use strict";
  var casa = document.querySelector(".sv-prat");
  if (!casa) return;

  /* ── i capitoli: uno aperto alla volta, l'altezza cresce ── */
  var capitoli = [].slice.call(casa.querySelectorAll(".cap"));

  function chiudiTutti(tranne){
    capitoli.forEach(function(c){
      if (c === tranne) return;
      c.classList.remove("aperto");
      var q = c.querySelector(".cap-c");
      if (q) q.style.maxHeight = "0px";
    });
  }

  function apriCap(c){
    var q = c.querySelector(".cap-c");
    if (!q) return;
    var era = c.classList.contains("aperto");
    chiudiTutti(c);
    if (era) { c.classList.remove("aperto"); q.style.maxHeight = "0px"; return; }
    c.classList.add("aperto");
    q.style.maxHeight = q.scrollHeight + "px";
  }

  capitoli.forEach(function(c){
    var t = c.querySelector(".cap-t");
    if (t) t.addEventListener("click", function(){ apriCap(c); });
  });

  /* l'altezza si riadatta se la finestra cambia */
  window.addEventListener("resize", function(){
    capitoli.forEach(function(c){
      if (!c.classList.contains("aperto")) return;
      var q = c.querySelector(".cap-c");
      if (q) q.style.maxHeight = q.scrollHeight + "px";
    });
  });

  /* ── l'indice: porta al capitolo e lo apre ── */
  casa.querySelectorAll(".idx-voci a").forEach(function(a){
    a.addEventListener("click", function(){
      var c = casa.querySelector("#" + a.getAttribute("data-va"));
      if (!c) return;
      if (!c.classList.contains("aperto")) apriCap(c);
      /* ⭐ L'UNICO PUNTO CHE DIVERGE DA praticantato.html.
         Nel guscio la finestra non scorre — `body` è alto quanto lo
         schermo e `overflow:hidden` — a scorrere è il quadrante
         centrale. La misura si prende da lì: quanto il centro è già
         sceso, più la distanza fra il capitolo e il bordo alto del
         centro. Senza il guscio, `#centro` non c'è e si torna a
         scorrere la pagina: la pagina da sola continua a funzionare. */
      var q = document.getElementById("centro") || document.scrollingElement;
      var y = q.scrollTop
            + c.getBoundingClientRect().top
            - q.getBoundingClientRect().top - 12;
      q.scrollTo({ top: y, behavior: "smooth" });
    });
  });

  /* ── le due finestre ── */
  function apri(id){ var v = casa.querySelector("#" + id); if (v) v.hidden = false; }
  function chiudi(v){ if (v) v.hidden = true; }

  var tastoRicerca = casa.querySelector("#prat-ricerca");
  if (tastoRicerca) {
    tastoRicerca.addEventListener("click", function(){ apri("prat-v-ricerca"); });
    tastoRicerca.addEventListener("keydown", function(e){
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); apri("prat-v-ricerca"); }
    });
  }

  var tastoRegalo = casa.querySelector("#prat-regalo");
  if (tastoRegalo) tastoRegalo.addEventListener("click", function(){ apri("prat-v-regalo"); });

  casa.querySelectorAll("[data-chiudi]").forEach(function(b){
    b.addEventListener("click", function(){ chiudi(casa.querySelector("#" + b.getAttribute("data-chiudi"))); });
  });

  casa.querySelectorAll("[data-vetro]").forEach(function(v){
    v.addEventListener("click", function(e){ if (e.target === v) chiudi(v); });
  });

  document.addEventListener("keydown", function(e){
    if (e.key === "Escape") casa.querySelectorAll("[data-vetro]").forEach(chiudi);
  });

  /* ── le durate: si sceglie una sola pastiglia. Il totale resta [ in attesa ] ── */
  var durate = casa.querySelector("#prat-durate");
  if (durate) {
    durate.addEventListener("click", function(e){
      var b = e.target.closest("[data-durata]");
      if (!b) return;
      durate.querySelectorAll("[data-durata]").forEach(function(o){
        o.style.border = "1px solid var(--line)";
        o.style.background = "none";
        o.style.color = "rgba(245,240,230,0.86)";
      });
      b.style.border = "1px solid var(--oro)";
      b.style.background = "rgba(200,160,85,0.18)";
      b.style.color = "var(--ivory)";
    });
  }
})();
}
