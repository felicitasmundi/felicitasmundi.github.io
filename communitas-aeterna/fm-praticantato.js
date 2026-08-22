/* ═══════════════════════════════════════════════════════════════
   Comunità Eterna FelicitasMundi · IL PRATICANTATO — come funziona

   Il disegno è di Design: praticantato-spazio-vivo.html
   18.474 byte · MD5 84bcb853e1ccf8ff815f231e1a73ce7a

   ⭐ Aggiornare la pagina vuol dire sostituire questo file, e basta.

   Non contiene: la barra, la plancia della radio, il Megafono, il
   piede. Quelle sono del guscio.

   Ci si arriva dalla seconda voce della barra: la riga `sentiero`
   della tabella `stanze`, che il guscio porta a vai("sentiero").

   ⭐ NESSUN PREZZO SCRITTO QUI. Li porta il dato, per la strada che
      Design dichiara:

        window.SpazioVivo.praticantato({
          fasi: {
            start:   {prezzo},
            pratica: {prezzo, pacchetti:[{nome, cifra, riga, spicca}]},
            ritiri:  {prezzo}
          },
          prossimo: "quando è il prossimo incontro",
          rotta:    "dove porta il tasto Entra"
        })

   ⚠️ OGGI QUELLA CHIAMATA NON PARTE, ed è giusto così: la tabella
      dei prezzi non esiste ancora. La pagina si disegna vuota e dice
      [ in attesa ] dove mancano le cifre. Il giorno che la tabella
      c’è, si accende `dalDatabase()` qui sotto — e nient’altro.

   ⛔ Niente involucro (function(){ … })() attorno al file: il guscio
      mette tutto in comune e questo file legge da lì. L’involucro di
      Design resta dov’è, dentro avviaPraticantato().
   ═══════════════════════════════════════════════════════════════ */

"use strict";

/* il disegno, come consegnato: lo stile della pagina e il suo corpo */
var PRATICANTATO = `<style>
  .sv-prat,.sv-prat *,.sv-prat *::before,.sv-prat *::after{box-sizing:border-box}
  .sv-prat{--oro:#C8A055;--oro-ch:#D4AF6A;--ivory:#F5F0E6;
    --nexus:#8C2F39;--terra:#AA8844;--acqua:#4488BB;--fuoco:#CC6644;
    --aria:#669944;--etere:#9966CC;--verde:#6E9E5A;--rosso:#C9707A;
    --line:rgba(184,150,62,0.2);--riga:rgba(245,240,230,0.09);
    --scala:1.4;
    --t-eti:calc(0.8125rem * var(--scala));--t-tas:calc(0.9375rem * var(--scala));
    --t-cor:calc(1.0625rem * var(--scala));--t-scr:calc(1.125rem * var(--scala));
    --t-tit:calc(1.5rem * var(--scala));--t-big:calc(1.9rem * var(--scala));
    max-width:52rem;width:100%;margin:0 auto;min-width:0;
    color:var(--ivory);font-family:'DM Sans',system-ui,sans-serif;font-size:var(--t-eti);
    -webkit-font-smoothing:antialiased}

  .sv-prat a{color:var(--oro-ch);text-decoration:none}
  .sv-prat a:hover{color:var(--ivory)}

  /* la testa */
  .sv-prat .testa{text-align:center;padding-bottom:1.6rem;margin-bottom:1.6rem;
    border-bottom:1px solid var(--line)}
  .sv-prat .occ{font-size:var(--t-eti);letter-spacing:0.24em;text-transform:uppercase;
    color:var(--oro-ch);margin-bottom:0.6rem}
  .sv-prat h1{font-family:'Cinzel',serif;font-weight:500;font-size:var(--t-big);
    line-height:1.15;margin:0 0 0.85rem}
  .sv-prat .arco{font-family:'Cinzel',serif;font-size:var(--t-eti);letter-spacing:0.16em;
    text-transform:uppercase;line-height:1.65;color:rgba(212,175,106,0.85);
    max-width:32rem;margin:0 auto}

  /* il riquadro che porta il peso */
  .sv-prat .perno{border:1px solid rgba(140,47,57,0.5);border-radius:0.9rem;
    background:rgba(140,47,57,0.09);padding:1.6rem 1.5rem;text-align:center;
    margin-bottom:1.6rem}
  .sv-prat .perno p{font-family:'Cormorant Garamond',serif;font-size:var(--t-cor);
    line-height:1.5;max-width:30rem;margin:0 auto}
  .sv-prat .perno b{font-weight:400;color:var(--oro-ch)}

  .sv-prat .sez{margin-bottom:2rem;min-width:0}
  .sv-prat .sh{display:flex;align-items:baseline;gap:0.7rem;flex-wrap:wrap;
    margin-bottom:0.7rem;padding-bottom:0.5rem;border-bottom:1px solid var(--riga)}
  .sv-prat .sh .pt{width:0.55rem;height:0.55rem;border-radius:0.12rem;
    background:var(--c);flex:none;align-self:center}
  .sv-prat .sh b{font-family:'Cinzel',serif;font-weight:500;font-size:var(--t-cor);
    color:var(--c);filter:brightness(1.2)}
  .sv-prat .sh i{margin-left:auto;font-family:'Cormorant Garamond',serif;
    font-size:var(--t-eti);color:rgba(245,240,230,0.4)}

  .sv-prat p.c{font-family:'Cormorant Garamond',serif;font-size:var(--t-tas);
    line-height:1.62;color:rgba(245,240,230,0.84);margin:0 0 0.7rem;max-width:40rem}
  .sv-prat p.c b{color:var(--ivory);font-weight:400}
  .sv-prat blockquote{font-family:'Cormorant Garamond',serif;font-style:italic;
    font-size:var(--t-tas);line-height:1.6;color:rgba(245,240,230,0.72);
    border-left:2px solid var(--oro);padding-left:1.1rem;margin:0 0 0.8rem;max-width:38rem}
  .sv-prat blockquote b{font-style:normal;color:var(--ivory);font-weight:400}

  /* i cinque passaggi */
  .sv-prat .passi{display:flex;flex-direction:column;gap:0.5rem}
  .sv-prat .ps{display:flex;gap:0.9rem;align-items:flex-start;min-width:0;
    border-left:2px solid var(--nexus);border-radius:0 0.75rem 0.75rem 0;
    background:rgba(10,12,26,0.5);padding:0.9rem 1.05rem}
  .sv-prat .ps .n{flex:none;width:2rem;height:2rem;border-radius:50%;
    border:1px solid var(--nexus);color:var(--nexus);display:grid;place-items:center;
    font-family:'Cinzel',serif;font-size:var(--t-eti);filter:brightness(1.35)}
  .sv-prat .ps .tx{min-width:0}
  .sv-prat .ps .tx b{display:block;font-family:'Cinzel',serif;font-weight:500;
    font-size:var(--t-eti);line-height:1.3;margin-bottom:0.25rem}
  .sv-prat .ps .tx span{display:block;font-family:'Cormorant Garamond',serif;
    font-size:var(--t-eti);line-height:1.55;color:rgba(245,240,230,0.62)}

  /* gli esercizi, in elenco */
  .sv-prat ul.lista{list-style:none;margin:0;padding:0;max-width:38rem}
  .sv-prat ul.lista li{font-family:'Cormorant Garamond',serif;font-size:var(--t-tas);
    line-height:1.6;color:rgba(245,240,230,0.8);padding-left:1.1rem;position:relative;
    margin-bottom:0.35rem}
  .sv-prat ul.lista li::before{content:'\\00B7';position:absolute;left:0.15rem;
    color:var(--etere);filter:brightness(1.3)}

  /* il tempo dell'incontro */
  .sv-prat .tempi{display:flex;flex-direction:column;gap:0.45rem}
  .sv-prat .tp{display:flex;gap:0.9rem;align-items:flex-start;min-width:0;
    background:rgba(10,12,26,0.45);border-radius:0.7rem;padding:0.85rem 1rem;
    border-left:2px solid var(--etere)}
  .sv-prat .tp .q{flex:none;width:2.8rem;font-family:'Cinzel',serif;
    font-size:var(--t-eti);color:var(--oro-ch)}
  .sv-prat .tp .d{flex:1;min-width:0;font-family:'Cormorant Garamond',serif;
    font-size:var(--t-eti);line-height:1.55;color:rgba(245,240,230,0.78)}
  .sv-prat .tp .d b{font-family:'DM Sans',sans-serif;font-weight:500;color:var(--ivory)}

  /* le tre fasi */
  .sv-prat .fasi{display:flex;flex-direction:column;gap:0.7rem}
  .sv-prat .fa{border:1px solid var(--riga);border-top:2px solid var(--c);
    border-radius:0 0 0.8rem 0.8rem;background:rgba(10,12,26,0.55);padding:1.05rem 1.15rem;min-width:0}
  .sv-prat .fh{display:flex;align-items:baseline;gap:0.7rem;flex-wrap:wrap;margin-bottom:0.55rem}
  .sv-prat .fh .n{flex:none;font-family:'Cinzel',serif;font-size:var(--t-tas);
    color:var(--c);filter:brightness(1.3)}
  .sv-prat .fh b{font-family:'Cinzel',serif;font-weight:500;font-size:var(--t-tas)}
  .sv-prat .fh .pr{margin-left:auto;font-family:'Cinzel',serif;font-size:var(--t-eti);
    color:var(--oro-ch);text-align:right;line-height:1.45}
  .sv-prat .fa ul{list-style:none;margin:0;padding:0}
  .sv-prat .fa li{font-family:'Cormorant Garamond',serif;font-size:var(--t-eti);
    line-height:1.6;color:rgba(245,240,230,0.75);padding-left:0.9rem;position:relative;
    margin-bottom:0.2rem}
  .sv-prat .fa li::before{content:'\\2022';position:absolute;left:0;color:var(--c);opacity:0.75}
  .sv-prat .fa li b{color:var(--ivory);font-weight:400}

  /* i pacchetti */
  .sv-prat .pacchi{display:grid;grid-template-columns:repeat(auto-fit,minmax(11rem,1fr));
    gap:0.6rem;margin-top:0.7rem}
  .sv-prat .pk{border:1px solid rgba(184,150,62,0.3);border-radius:0.75rem;
    background:rgba(200,160,85,0.05);padding:0.9rem 0.95rem;text-align:center;min-width:0}
  .sv-prat .pk.spicca{border-color:rgba(200,160,85,0.6);background:rgba(200,160,85,0.11)}
  .sv-prat .pk b{display:block;font-family:'Cinzel',serif;font-weight:500;
    font-size:var(--t-eti);margin-bottom:0.25rem}
  .sv-prat .pk .cif{display:block;font-family:'Cinzel',serif;font-size:var(--t-cor);
    color:var(--oro-ch);line-height:1.2;margin-bottom:0.25rem}
  .sv-prat .pk span{font-family:'Cormorant Garamond',serif;font-style:italic;
    font-size:var(--t-eti);color:rgba(245,240,230,0.5);line-height:1.4}

  /* la porta */
  .sv-prat .porta{text-align:center;margin-top:2.2rem;padding-top:1.6rem;
    border-top:1px solid var(--line)}
  .sv-prat .porta a{display:inline-block;border-radius:999px;background:var(--oro);
    color:#0A0C1A;padding:0.95rem 2.4rem;font-family:'Cinzel',serif;
    font-size:var(--t-tas);letter-spacing:0.08em}
  .sv-prat .porta a:hover{background:var(--oro-ch);color:#0A0C1A}
  .sv-prat .porta .sotto{font-family:'Cormorant Garamond',serif;font-style:italic;
    font-size:var(--t-eti);color:rgba(245,240,230,0.45);margin:0.75rem 0 0}

  @media(max-width:40rem){
    .sv-prat .fh .pr{margin-left:0;text-align:left;width:100%}
    .sv-prat .tp .q{width:2.4rem}
  }
</style>

<div class="sv-prat">

  <div class="testa">
    <div class="occ">Comunità Eterna FelicitasMundi</div>
    <h1>Praticantato</h1>
    <p class="arco">dal progetto sogno<br>alla cooperazione per una civiltà evoluta</p>
  </div>

  <div class="sez">
    <div class="sh" style="--c:var(--nexus)"><span class="pt"></span><b>Che cos&rsquo;è</b></div>
    <div class="perno" style="margin-bottom:1.1rem">
      <p>Il praticantato guarda <b>la natura del nostro essere</b>, propone
        <b>strumenti di centratura</b> che facilitino la realizzazione del progetto
        dell&rsquo;anima in una <b>visione di cooperazione</b>.</p>
    </div>

    <blockquote>Ci troviamo ad avere <b>l&rsquo;esigenza di riallinearci</b> &mdash;
      allineare la mente, il cervello e l&rsquo;anima.<br><br>
      Riconnettiamoci tra di noi, valorizziamo gli scambi autentici, segnamo le orme
      del nostro percorso, perchè possano essere <b>i solchi del cammino
      dell&rsquo;altro</b> e <b>il tracciato assoluto di un anima che unisce tutte le
      anime</b>, e che viene nutrita dall&rsquo;esperienza della vita.</blockquote>
  </div>

  <p class="c" style="margin:0 auto 2rem;text-align:center;max-width:34rem">Il
    praticantato è un percorso <b>introspettivo, creativo, spirituale</b>, per
    facilitare le relazioni genuine.</p>

  <div class="sez">
    <div class="sh" style="--c:var(--etere)"><span class="pt"></span>
      <b>Il ritmo: il ciclo della luna</b><i>luna nuova &mdash; luna piena</i></div>
    <p class="c">L&rsquo;accompagnamento segue il <b>ritmo dei cicli lunari</b><br>
      (luna nuova &mdash; luna piena).</p>
    <p class="c">Gli incontri di gruppo avvengono <b>in diretta con Gabriele</b>, tutor
      e ideatore di felicitas.</p>
    <p class="c">Dentro ogni ciclo vengono proposti <b>esercizi</b>, che ognuno sviluppa
      da solo nel proprio quotidiano, <b>contenuti di ricerca</b> (appunti, video di
      lezioni, link utili) e <b>gli incontri</b>, che si fanno insieme.</p>
    <p class="c">Vengono inoltre dati <b>suggerimenti pratici per l&rsquo;utilizzo degli
      strumenti di Felicitas</b> (integrator, le orme, il megafono, la stampa di opere),
      per l&rsquo;utilizzo da parte dei team e vicinati.</p>

    <p class="c" style="margin-top:1.2rem"><b>Come si sviluppa la diretta:</b></p>

    <div class="tempi">
      <div class="tp"><span class="q">10&prime;</span><span class="d">
        <b>L&rsquo;apertura &mdash; il tema della luna.</b> Da dove nasce, e perché
        adesso.</span></div>
      <div class="tp"><span class="q">50&prime;</span><span class="d">
        <b>La centratura dentro i cinque elementi.</b> In che modo la propria memoria e
        la propria focalizzazione si inquadrano grazie agli elementi e al disegno della
        geometria sacra. E la formula da cui tutto nasce.<br>
        Dentro, il testo che regge il tema &mdash; vedico, esoterico, o dalla nostra
        ricerca.<br>
        E la parte concreta: <b>dove segni la tua orma, come apri un bisogno, cosa
        succede quando qualcuno lo prende.</b></span></div>
      <div class="tp"><span class="q">20&prime;</span><span class="d">
        <b>Gli esercizi fino alla luna successiva.</b> Quello che ognuno porta a casa e
        fa da solo.</span></div>
    </div>
  </div>

  <div class="sez">
    <div class="sh" style="--c:var(--etere)"><span class="pt"></span>
      <b>Gli esercizi</b><i>si fanno da soli</i></div>
    <p class="c">Sono <b>modi di guardarsi mentre si vive</b>.</p>

    <ul class="lista">
      <li>l&rsquo;attenzione a come si muovono i pensieri</li>
      <li>l&rsquo;utilizzo delle parole</li>
      <li>il respiro</li>
      <li>il corpo nello spazio</li>
      <li>e rendersi conto di quante cose si iniziano nel quotidiano che poi non si
        portano a termine</li>
    </ul>

    <p class="c" style="margin-top:0.9rem"><b>E gli esercizi si scrivono nelle proprie
      orme.</b> Le orme diventano il quaderno. Alla luna successiva sono già lì, in
      ordine di tempo, e si legge il cammino invece di ricordarlo.</p>
  </div>

  <div class="sez">
    <div class="sh" style="--c:var(--nexus)"><span class="pt"></span>
      <b>Il percorso, in cinque passaggi</b></div>
    <p class="c">Il lavoro è ramificato. <b>Comincia dentro una persona sola, e arriva a
      tenere in piedi la comunità.</b></p>

    <div class="passi">
      <div class="ps"><span class="n">&#9312;</span><span class="tx">
        <b>La centratura dentro i cinque elementi</b>
        <span>In che modo la propria memoria e la propria focalizzazione si inquadrano
          grazie all&rsquo;utilizzo degli elementi, e al disegno della geometria
          sacra.</span></span></div>
      <div class="ps"><span class="n">&#9313;</span><span class="tx">
        <b>Lo sviluppo del progetto sogno</b>
        <span>Da qui nasce quello che poi porterai alla comunità, o vengono dati
          suggerimenti per il tuo servizio già in essere.</span></span></div>
      <div class="ps"><span class="n">&#9314;</span><span class="tx">
        <b>L&rsquo;interazione con la comunità</b>
        <span>Le ore di praticantato, il karma yoga, aiutare nel luogo, dare una mano
          online. Si conosce la comunità, si vengono a conoscere i bisogni, e si
          interagisce cooperando con questi.</span></span></div>
      <div class="ps"><span class="n">&#9315;</span><span class="tx">
        <b>Si inseriscono persone dentro un team</b>
        <span>Quello che hai cominciato da solo diventa il lavoro di un
          gruppo.</span></span></div>
      <div class="ps"><span class="n">&#9316;</span><span class="tx">
        <b>E quel team alimenta le aree centrali</b>
        <span>Emporio, Assistenza, Scuola, Edizione, Vicinati. Il percorso arriva a
          tenere in piedi la comunità.</span></span></div>
    </div>
  </div>

  <div class="sez">
    <div class="sh" style="--c:var(--oro)"><span class="pt"></span>
      <b>Le tre fasi</b><i>e cosa costano</i></div>

    <div class="fasi">

      <div class="fa" style="--c:var(--nexus)">
        <div class="fh"><span class="n">&#9312;</span><b>Start &mdash; usare lo
          strumento</b><span class="pr" data-pr="start"></span></div>
        <ul>
          <li>l&rsquo;accesso pieno: <b>creare team, partecipare alle classi, scambiare,
            collegare, fare le orme</b></li>
          <li>la base per l&rsquo;utilizzo dello strumento</li>
          <li>l&rsquo;accesso al tour come contesto di scambio</li>
        </ul>
      </div>

      <div class="fa" style="--c:var(--etere)">
        <div class="fh"><span class="n">&#9313;</span><b>La pratica &mdash; il percorso
          alla cooperazione</b><span class="pr" data-pr="pratica"></span></div>
        <ul>
          <li><b>l&rsquo;incontro di ogni fase lunare</b>, in diretta</li>
          <li>gli esercizi del ciclo</li>
          <li>la centratura dentro i cinque elementi</li>
          <li>lo sviluppo del progetto sogno</li>
        </ul>
        <div class="pacchi" data-pacchi="1"></div>
      </div>

      <div class="fa" style="--c:var(--fuoco)">
        <div class="fh"><span class="n">&#9314;</span><b>Ritiri, viaggi e tour</b>
          <span class="pr" data-pr="ritiri"></span></div>
        <ul>
          <li><b>chi già partecipa al percorso online paga solo i costi vivi</b></li>
          <li>il tour di lancio, portando la propria musica, i propri scambi</li>
        </ul>
      </div>

    </div>
  </div>
  </div>

  <div class="porta">
    <a id="sv-prat-entra" href="#">Entra nel praticantato</a>
    <p class="sotto" id="sv-prat-prossimo"></p>
  </div>

</div>`;

function praticantato(c){
  c.innerHTML = PRATICANTATO;
  avviaPraticantato();
  dalDatabase();
}

/* ── il codice della pagina, come l'ha scritto Design: non si tocca ──
   Si registra su window.SpazioVivo.praticantato e disegna il vuoto
   da sé, così la pagina si legge intera anche senza un solo prezzo. */
function avviaPraticantato(){
(function () {
  "use strict";

  var ATTESA = "[ in attesa ]";
  var vuoto = function (v) { return v === undefined || v === null || v === ""; };
  var testo = function (v) { return vuoto(v) ? ATTESA : String(v); };
  function svuota(n) { while (n && n.firstChild) n.removeChild(n.firstChild); }

  /* i prezzi possono avere più righe: le porta il dato, separate da \n */
  function scrivi(nodo, valore) {
    if (!nodo) return;
    svuota(nodo);
    String(testo(valore)).split("\n").forEach(function (r, i) {
      if (i) nodo.appendChild(document.createElement("br"));
      nodo.appendChild(document.createTextNode(r));
    });
  }

  function riempi(dati) {
    dati = dati || {};
    var fasi = dati.fasi || {};

    ["start", "pratica", "ritiri"].forEach(function (k) {
      scrivi(document.querySelector('[data-pr="' + k + '"]'), (fasi[k] || {}).prezzo);
    });

    /* i pacchetti: quanti ne arrivano. Nessuno? il posto scompare. */
    var box = document.querySelector("[data-pacchi]");
    svuota(box);
    var pk = ((fasi.pratica || {}).pacchetti) || [];
    box.style.display = pk.length ? "" : "none";
    pk.forEach(function (p) {
      var e = document.createElement("div");
      e.className = "pk" + (p.spicca ? " spicca" : "");
      var b = document.createElement("b"); b.textContent = testo(p.nome); e.appendChild(b);
      var c = document.createElement("span"); c.className = "cif"; c.textContent = testo(p.cifra); e.appendChild(c);
      var s = document.createElement("span"); scrivi(s, p.riga); e.appendChild(s);
      box.appendChild(e);
    });

    var pr = document.getElementById("sv-prat-prossimo");
    pr.textContent = vuoto(dati.prossimo)
      ? "Il prossimo incontro è " + ATTESA + "."
      : String(dati.prossimo);

    if (!vuoto(dati.rotta)) document.getElementById("sv-prat-entra").setAttribute("href", dati.rotta);
  }

  /* a vuoto la pagina si legge intera */
  riempi({});

  window.SpazioVivo = window.SpazioVivo || {};
  window.SpazioVivo.praticantato = riempi;
})();
}

/* ── i prezzi e il prossimo incontro ──
   ⚠️ In attesa della tabella. Finché non c’è, non si chiama niente:
      la pagina resta com’è e dice [ in attesa ] dove manca la cifra.
   ⛔ Non si inventano né tabella né colonne: si chiede. */
function dalDatabase(){
  return;
}
