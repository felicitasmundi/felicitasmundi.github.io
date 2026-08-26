/* ════════════════════════════════════════════════════════════════
   Comunità Eterna FelicitasMundi · LE REGOLE — tutte in un posto solo

   Il disegno è di Design: le-regole.html
   19.217 byte · MD5 01f3d7fd04a4a00fc90aa12444c87b19
   (consegna del 27 agosto 2026 — la precedente era 2374f2be…,
    18.962 byte)

   ⭐ Aggiornare le regole vuol dire sostituire questo file, e basta.

   ⭐ QUELLO CHE PORTA DI NUOVO QUESTA CONSEGNA
     · UNA REGOLA SOLA, in cima al gruppo «Come si costruisce»:
       «Le feste della comunità le stabilisce il nucleo.»
     · È l'unica cosa che cambia, e non è a occhio: rifacendo il file
       dalla consegna, in avviaRegole() si muovono TRE righe — le tre
       della regola nuova. Il foglio di stile e il corpo tornano
       identici a quelli di prima, regola per regola.
     ⚠️ La regola porta l'etichetta «26 agosto», e COL non la conosce:
        le sette che conosce sono canone · nel database · nelle
        condizioni · nella privacy · detta a chi entra · in CLAUDE.md ·
        non ancora. Quindi quel cartellino nasce con `class="undefined"`
        e prende la veste comune invece del suo colore. Si vede e si
        legge — non si rompe niente — ma è una parola nuova che la
        legenda in fondo alla pagina non elenca.
        ⛔ Non l'ho cambiata: è testo di Design, e il testo non si tocca.
           Se «26 agosto» deve avere un colore, o diventare una delle
           sette, si cambia nella consegna e si rifà questo file.

   ══ DOVE VIVE ══
   Nel quadrante «regole» del nucleo — la finestra che si apre col tasto
   `data-fin="regole"`. Prima quella finestra mostrava i cinque elementi
   coi loro conti; ora porta questa pagina. Il controllo d'ingresso è
   quello del nucleo: si legge `persone.nucleo`, e chi non ne fa parte
   non vede nascere nemmeno un nodo. Qui dentro non c'è nessun secondo
   controllo, ed è voluto: il disegno nasce solo dentro una finestra
   già sorvegliata.

   ⚠️ La consegna è una PAGINA INTERA. Testa, caratteri e fondo restano
      fuori: quelli li porta il guscio, e metterli due volte li
      farebbe litigare.

   ══ LE SEI MANI SULLA CONSEGNA, e sono tutte qui ══
   ① `:root` → `.sv-regole`. Le misure di Design non devono uscire da
      questa pagina: `--scala:1.5` su `:root` avrebbe ringrandito TUTTO
      il guscio, barra e Megafono compresi.
   ② `body` → `.sv-regole`, senza `min-height:100vh` e senza il fondo
      pieno; `body::before` non entra affatto.
   ③ ogni altra regola del foglio si limita a `.sv-regole`.
   ④ il corpo entra dentro `<div class="sv-regole">`.
   ⑤ `#tasti` e `#tutto` diventano `#reg-tasti` e `#reg-tutto`: nel
      guscio quegli id vivono insieme a quelli di tutte le altre stanze.
   ⑥ `document.querySelector('.sot')` cerca dentro casa invece che in
      tutto il documento — `.sot` è un nome corto, e nel guscio ci sono
      altre finestre.
   ⛔ IL TESTO NON È STATO TOCCATO. Le regole, i perché e le etichette
      sono quelli della consegna, carattere per carattere.

   ⚠️ `--scala` qui è 1.5, e il canone dice 1.4. È una scelta di Design
      e non l'ho cambiata: si limita a questa pagina e non esce. Se va
      portata a 1.4, si cambia nella consegna e si rifà questo file.

   ⛔ Niente involucro (function(){ … })() attorno al file: il guscio
      mette tutto in comune e questo file legge da lì. L'involucro
      attorno al codice di Design serve invece a tenere dentro i suoi
      nomi corti — G, COL, n, t, ts, b0, mostra — che a spasso nel
      guscio si pesterebbero i piedi con qualcun altro.

   ════════════════════════════════════════════════════════════════ */

"use strict";

/* il foglio di stile, con le sole mani ① ② ③ */
var REGOLE_STILE = `<style>
.sv-regole{
  --fondo:#070a16; --ivory:#F5F0E6; --oro:#C8A055; --oro-ch:#D4AF6A;
  --verde:#6E9E5A; --rosso:#C9707A;
  --nexus:#8C2F39; --terra:#AA8844; --acqua:#4488BB;
  --fuoco:#CC6644; --aria:#669944; --etere:#9966CC; --svil:#B87333;
  --riga:rgba(245,240,230,0.09); --tenue:rgba(245,240,230,0.42);
  --scala:1.5;
  --t-eti:calc(0.58rem * var(--scala));
  --t-tas:calc(0.67rem * var(--scala));
  --t-cor:calc(0.76rem * var(--scala));
  --t-tit:calc(1.07rem * var(--scala));
}
.sv-regole *{box-sizing:border-box;margin:0;padding:0}
/* ⭐ TOCCATO — quello che era di «body» è della sola pagina delle regole.
   «min-height:100vh» cade: la pagina non è più alta quanto lo schermo,
   è alta quanto il suo contenuto dentro la finestra che la ospita.
   Il fondo scuro pieno cade: la finestra del nucleo ha già il suo, e
   un secondo fondo opaco coprirebbe i suoi angoli arrotondati.
   L'imbottitura resta, tolta quella di sotto: la finestra ce l'ha già. */
.sv-regole{color:var(--ivory);
  font-family:'DM Sans',Georgia,system-ui,sans-serif;font-size:var(--t-eti);
  padding:0}
/* ⛔ «body::before» non entra: il velo di stelle è del guscio, e metterlo
   due volte lo farebbe litigare con sé stesso. */
.sv-regole .f{max-width:56rem;margin:0 auto}

.sv-regole .occ{font-size:var(--t-eti);letter-spacing:.22em;text-transform:uppercase;
  color:var(--oro-ch);margin-bottom:6px}
.sv-regole h1{font-family:'Cinzel',Georgia,serif;font-weight:500;font-size:var(--t-tit);
  margin-bottom:7px}
.sv-regole .sot{font-family:'Cormorant Garamond',Georgia,serif;font-style:italic;
  font-size:var(--t-tas);color:rgba(245,240,230,.6);line-height:1.55;
  max-width:38rem;margin-bottom:22px}

/* i tasti dei gruppi */
.sv-regole .tasti{display:flex;gap:7px;flex-wrap:wrap;margin-bottom:22px;
  position:sticky;top:8px;z-index:8;padding:9px 0;
  background:linear-gradient(#070a16 70%,transparent)}
.sv-regole .tasti button{border:1px solid var(--riga);border-radius:999px;
  background:rgba(10,12,26,.7);color:rgba(245,240,230,.6);
  padding:7px 15px;cursor:pointer;font-family:'DM Sans',sans-serif;
  font-size:calc(var(--t-eti)*.94);backdrop-filter:blur(6px)}
.sv-regole .tasti button:hover{color:var(--ivory);border-color:rgba(200,160,85,.5)}
.sv-regole .tasti button.on{background:rgba(200,160,85,.18);border-color:var(--oro);
  color:var(--ivory)}

/* i gruppi */
.sv-regole .g{margin-bottom:26px}
.sv-regole .gh{display:flex;align-items:center;gap:10px;margin-bottom:11px;
  padding-bottom:8px;border-bottom:1px solid var(--riga)}
.sv-regole .gh .pt{width:9px;height:9px;border-radius:2px;background:var(--c);flex:none}
.sv-regole .gh b{font-family:'Cinzel',Georgia,serif;font-weight:500;
  font-size:var(--t-tas);letter-spacing:.06em;color:var(--c)}
.sv-regole .gh .n{margin-left:auto;font-family:'Cinzel',Georgia,serif;
  font-size:calc(var(--t-eti)*.9);color:rgba(245,240,230,.3)}

/* una regola */
.sv-regole .r{border-left:2px solid var(--c);border-radius:0 11px 11px 0;
  background:rgba(10,12,26,.45);padding:13px 16px;margin-bottom:7px}
.sv-regole .r .testo{font-size:var(--t-eti);line-height:1.55;
  color:rgba(245,240,230,.9);margin-bottom:6px}
.sv-regole .r .testo b{color:var(--ivory);font-weight:500}
.sv-regole .r .perche{font-family:'Cormorant Garamond',Georgia,serif;font-style:italic;
  font-size:calc(var(--t-eti)*.94);line-height:1.5;
  color:rgba(245,240,230,.5);margin-bottom:8px}
.sv-regole .r .dove{display:flex;gap:6px;flex-wrap:wrap}
.sv-regole .r .dove span{font-size:calc(var(--t-eti)*.84);letter-spacing:.06em;
  border-radius:999px;padding:2px 9px;border:1px solid}
.sv-regole .d-canone{color:rgba(245,240,230,.45);border-color:rgba(245,240,230,.16)}
.sv-regole .d-db{color:var(--verde);border-color:rgba(110,158,90,.4)}
.sv-regole .d-legge{color:var(--acqua);border-color:rgba(68,136,187,.4)}
.sv-regole .d-pagina{color:var(--oro-ch);border-color:rgba(212,175,106,.4)}
.sv-regole .d-code{color:var(--svil);border-color:rgba(184,115,51,.4)}
.sv-regole .d-aperta{color:var(--rosso);border-color:rgba(201,112,122,.4);
  border-style:dashed}

.sv-regole .pie{margin-top:30px;padding-top:16px;border-top:1px solid var(--riga);
  font-family:'Cormorant Garamond',Georgia,serif;font-size:var(--t-eti);
  color:rgba(245,240,230,.42);line-height:1.7}
.sv-regole .pie b{font-family:'DM Sans',sans-serif;color:var(--oro-ch);font-weight:400;
  font-size:calc(var(--t-eti)*.96)}
.sv-regole .leg{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}
</style>`;

/* il corpo, come consegnato, dentro il suo involucro */
var REGOLE_CORPO = `<div class="sv-regole">
<div class="f">

  <div class="occ">Comunità Eterna FelicitasMundi</div>
  <h1>Le regole</h1>
  <p class="sot">Tutte in un posto solo. <b>Da qui si copiano dove servono</b> —
     nelle condizioni, nella privacy, nel database, nelle pagine. L&rsquo;etichetta
     sotto ogni regola dice dove vive già, e dove manca ancora.</p>

  <div class="tasti" id="reg-tasti"></div>
  <div id="reg-tutto"></div>

  <div class="pie">
    <b>Le etichette.</b>
    <span class="leg">
      <span class="dove"><span class="d-canone">canone</span></span>
      <span class="dove"><span class="d-db">nel database</span></span>
      <span class="dove"><span class="d-legge">nelle condizioni</span></span>
      <span class="dove"><span class="d-pagina">detta a chi entra</span></span>
      <span class="dove"><span class="d-code">in CLAUDE.md</span></span>
      <span class="dove"><span class="d-aperta">non ancora</span></span>
    </span>
    <br>
    <b>Una regola vale davvero quando il database la fa rispettare.</b> Finché è
    solo scritta, è un impegno — e gli impegni si dimenticano.
  </div>

</div>
</div>`;

/* ⭐ lo stile entra una volta sola: la finestra si apre e si chiude
   quante volte si vuole, e il foglio non si accumula. */
function stileDelleRegole(){
  if(document.getElementById("sv-regole-stile")) return;
  var d = document.createElement("div");
  d.innerHTML = REGOLE_STILE;
  var st = d.firstElementChild;
  st.id = "sv-regole-stile";
  document.head.appendChild(st);
}

/* ══ LA PORTA ══
   `c` è il contenitore in cui le regole nascono: nel nucleo è il dentro
   della finestra «regole». Chi chiama è già passato dal controllo. */
function regoleDentro(c){
  if(!c) return;
  stileDelleRegole();
  c.innerHTML = REGOLE_CORPO;
  avviaRegole();
}

/* ── il codice della pagina, come l'ha scritto Design — con le sole
   mani ⑤ e ⑥. Nel disegno gira da sé appena la pagina è letta; qui la
   pagina nasce dentro regoleDentro(), quindi lo si chiama lì. ── */
function avviaRegole(){
(function () {
var G = [
 ["Chi entra e cosa vede","var(--nexus)",[
  ["<b>Guardare è libero.</b> Per pubblicare, connettere o scambiare: prima paghi, o dai quattro ore alla comunità.",
   "Non è un muro commerciale: è un filtro. Chi passa a insultare non dà quattro ore di lavoro.",
   ["canone","non ancora"]],
  ["Senza pagare si può entrare nell&rsquo;Emporio, acquistare, venire a una festa, mangiare prasāda.",
   "Ciò che è pubblico è pubblico.", ["canone"]],
  ["<b>Con l&rsquo;account si possono acquistare le lezioni a pagamento</b> e riceverne il codice.",
   "Comprare non è partecipare: anche una lezione è una cosa che si acquista. Senza account non si può nemmeno comprare.",
   ["canone","non ancora"]],
  ["<b>Il karma yoga paga la piattaforma, non il tempo di chi accompagna.</b> Quattro ore al mese valgono i 26 €. Gli incontri di ogni fase lunare si pagano in denaro, sempre.",
   "Se il tempo di chi guida si potesse comprare con le ore, bisognerebbe esserci per chiunque ne accumuli abbastanza.", ["canone","nelle condizioni"]],
  ["<b>Gli incontri di ogni fase lunare: 50 € l'uno, 100 € al mese.</b> Sei lune 510 €, un anno 900 € — pagati subito, non a rate.",
   "A rate è uguale al mensile, ma con dodici scadenze da inseguire — e chi smette a metà lascia un debito da rincorrere.", ["canone","non ancora"]],
  ["<b>Chi conduce non è un counselor né un terapeuta</b>, e non esercita professioni regolamentate: propone l'uso di strumenti propri.",
   "La scrittura, il metodo e l'impianto di FelicitasMundi sono opera dell'autore.", ["nelle condizioni"]],
  ["<b>Servire per almeno quattro ore dà accesso al praticantato e agli scambi.</b> Supportare in un bisogno pubblico è già servizio.",
   "Non è un pagamento in ore: è entrare facendo. E chi passa a insultare non prende un bisogno e non lo porta a termine.", ["canone","non ancora"]],
  ["<b>I bisogni aperti si vedono anche da fuori</b>, prima di entrare.",
   "Altrimenti la porta non si vede: è la prima cosa che chi arriva può fare.", ["canone","non ancora"]],
  ["<b>Chi non ha dato i due consensi non entra</b> in nessuna voce di Integrator.",
   "Dati e uso, con la data e la versione dei documenti.", ["nel database","nelle condizioni"]],
  ["Chi entra la prima volta passa sempre da «Come funziona».",
   "Se come_funziona_il è vuoto ci passa; se c&rsquo;è, entra diretto.", ["nel database"]],
  ["<b>Un consenso dato non si toglie</b> svuotando un campo: si revoca cancellando l&rsquo;account.",
   "Il database rifiuta chi ci prova.", ["nel database","nelle condizioni"]],
  ["Per entrare in Integrator serve essere in un team. Il primo team è il praticantato.",
   "Chi non ha un team resta nelle sue orme: non gli si mostra una barra vuota.", ["canone","non ancora"]],
  ["Possono esserci cose visibili solo a chi è del team di riferimento.",
   "", ["canone","non ancora"]]]],

 ["Chi vede cosa","var(--terra)",[
  ["<b>Un&rsquo;orma che nomina un&rsquo;altra persona resta privata finch&eacute; quella persona non conferma.</b> Il legame si propone, non si impone: chi lo riceve apre l&rsquo;invito e decide. Finch&eacute; non decide, il legame esiste solo dalla parte di chi l&rsquo;ha segnato, e non compare da nessun&rsquo;altra.",
   "Vale per le fotografie in cui compaiono altri e per ogni collegamento fra orme di persone diverse. Il consenso arriva quando quell&rsquo;orma viene connessa.",
   ["canone","non ancora"]],
  ["<b>Il nucleo vede il metadato, non il contenuto.</b> Che una squadra esiste, quante persone, quanto lavoro si muove, e ciò che pubblica.",
   "Nessuno userebbe uno strumento dove il fornitore legge dentro.", ["nella privacy","non ancora"]],
  ["Il nucleo <b>non vede</b>: le note dentro le task, i messaggi delle chat, i contatti dei clienti, i numeri privati.",
   "", ["nella privacy","non ancora"]],
  ["Chi ha la chiave d&rsquo;amministratore <b>tecnicamente vede tutto</b>. L&rsquo;impegno è a non farlo, e a scriverlo.",
   "Vale per qualunque piattaforma: sarebbe disonesto dire il contrario.", ["nella privacy"]],
  ["I dati interni di un team o di un&rsquo;azienda sono <b>privati e loro</b>. Se il rapporto finisce, restano a chi li ha inseriti.",
   "", ["nelle condizioni","non ancora"]],
  ["Chi guida un team decide chi, al suo interno, vede che cosa.",
   "", ["nelle condizioni","non ancora"]],
  ["<b>La chiave d&rsquo;amministratore non si dà</b> — nemmeno per una lettura.",
   "Se la prima volta che serve la si dà, la promessa nella privacy non vale niente.", ["canone","in CLAUDE.md"]]]],

 ["I talenti","var(--acqua)",[
  ["<b>Un movimento confermato non si modifica e non si cancella.</b> Un errore si corregge con un movimento contrario.",
   "È una garanzia per tutti: la storia resta leggibile.", ["nelle condizioni","non ancora"]],
  ["<b>Nessuno si attribuisce talenti da solo.</b> Ogni movimento ha due gesti, di due persone diverse.",
   "", ["nel database","nelle condizioni"]],
  ["<b>Non si va sotto zero.</b>", "", ["nel database"]],
  ["I talenti <b>non sono denaro</b> e non si convertono. Il saldo non è un credito verso la società.",
   "E oggi non è un limite nostro: è la legge. Serve un istituto autorizzato da Banca d&rsquo;Italia.", ["nelle condizioni"]],
  ["<b>Non tutto si paga in talenti.</b> Mettere le orme, invitare persone, unire chi si conosce: è il praticantato, non lavoro.",
   "Se ogni gesto paga, non è più una comunità: è un sistema a punti.", ["canone"]],
  ["I talenti nascono da un <b>lavoro concluso</b>: chi apre dichiara, chi prende porta a termine, chi ha aperto conferma.",
   "", ["nelle condizioni","non ancora"]]]],

 ["Vendere e vagliare","var(--acqua)",[
  ["<b>Il colloquio viene prima del pagamento.</b>", "", ["canone"]],
  ["<b>Il vaglio è un riconoscimento di coerenza, non una certificazione.</b> FelicitasMundi non è un ente di certificazione e non ne rilascia.",
   "Dire «certifichiamo» senza esserlo è contestabile. E se un cliente lo scambia per una certificazione, la responsabilità torna a noi.", ["nelle condizioni"]],
  ["<b>L'analisi non è la prova: è uno degli sguardi.</b> Insieme al colloquio, a chi lo fa, a dove sta, a come lavora.",
   "Trent'anni di certificazioni hanno insegnato a Vittorino che il bollino è una formalità pagata. Il vaglio nasce per non essere quello.", ["nelle condizioni"]],
  ["<b>Chi decide se un prodotto entra non guadagna dalla sua vendita.</b> Il vaglio si paga a campione.",
   "Se chi vaglia prendesse sul venduto, avrebbe interesse a far passare tutto — e il vaglio è ciò che ci distingue.",
   ["canone","non ancora"]],
  ["<b>L&rsquo;erboristeria resta chiusa</b> finché non c&rsquo;è un responsabile erborista.",
   "Non è una formalità: è la condizione per aprire lo scaffale.", ["canone"]],
  ["Il capo reparto prende <b>sul risultato del reparto</b>, non sul singolo prodotto.",
   "Se prende su ogni vendita, guadagna anche quando non fa niente.", ["canone","non ancora"]]]],

 ["Quello che si pubblica","var(--aria)",[
  ["<b>I campi necessari:</b> nome, descrizione, foto, e a quale luogo appartiene. Per chi vende: prezzo e disponibilità. Per un libro: autore ed editore.",
   "Un prodotto senza foto e senza descrizione esiste, ma per un motore di ricerca no — e non lo compra nessuno.",
   ["canone","non ancora"]],
  ["<b>La macchina misura, la persona giudica.</b> Sfocata, troppo piccola, storta: si blocca. «Asettica», «non c&rsquo;entra»: si segnala al vaglio.",
   "", ["canone","non ancora"]],
  ["<b>Si guardano solo le foto pubbliche</b>, e quelle che qualcuno segnala. Mai il resto.",
   "", ["nella privacy"]],
  ["<b>Le foto di persone riconoscibili o di minori</b> non si pubblicano senza liberatoria firmata.",
   "È una regola ferma della piattaforma.", ["nella privacy","nelle condizioni"]],
  ["<b>Un&rsquo;orma pubblica collegata a un luogo lo mostra sulla mappa.</b> Chi la rende pubblica lo sa.",
   "Una serie di orme nel tempo racconta dove sei stato e quando.", ["nella privacy"]]]],

 ["Insegnare e pubblicare","var(--etere)",[
  ["<b>70% all&rsquo;autore, 30% a FelicitasMundi</b> — lo stesso numero per la diretta e per la registrazione.",
   "Un numero solo si spiega in una riga e si ricorda: vale più della precisione.", ["nelle condizioni"]],
  ["<b>Senza codice non si entra</b> a una lezione. Non si entra e poi si chiede il codice.",
   "", ["nelle condizioni","non ancora"]],
  ["Chi arriva a lezione cominciata: <b>decide chi insegna</b> se farlo entrare.",
   "", ["nelle condizioni","non ancora"]],
  ["Chi resta fuori <b>si iscrive alla diretta successiva</b> su quell&rsquo;argomento.",
   "Un ritardatario non è un cliente perso: è un iscritto alla prossima.", ["canone"]],
  ["<b>La registrazione resta all&rsquo;autore.</b> Se lascia la piattaforma, se la porta via.",
   "", ["nelle condizioni"]],
  ["<b>Un libro nato da lezioni resta dell&rsquo;autore.</b> Il lavoro editoriale non ce ne dà la proprietà.",
   "Le condizioni si concordano per iscritto prima di cominciare.", ["nelle condizioni"]],
  ["Trascrizione, editing, impaginazione e stampa <b>sono servizi a parte</b>: si pagano come lavoro, non a percentuale.",
   "", ["nelle condizioni"]]]],

 ["La radio","var(--aria)",[
  ["<b>La diretta è libera per chiunque. L&rsquo;archivio no</b>: per riascoltare serve il karma yoga o il praticantato.",
   "", ["canone","non ancora"]],
  ["<b>I canti restano accessibili sempre.</b>", "", ["canone"]],
  ["<b>La registrazione vuole il consenso.</b> Chi entra sa prima che si registra, e la puntata esce solo se chi ha parlato dice sì.",
   "", ["nella privacy","non ancora"]],
  ["<b>I ruoli durano una diretta</b>: regia, ospite, in ascolto, co-regia. Chi ha la consolle comanda.",
   "", ["canone","non ancora"]],
  ["<b>Le due dirette del ciclo lunare sono un servizio</b>, non un dono. Hanno un orario, e vanno tenute anche con due persone.",
   "Se fossero un dono, il praticantato non avrebbe più un contenuto.", ["canone"]]]],

 ["Come si costruisce","var(--svil)",[
  ["<b>Le feste della comunit&agrave; le stabilisce il nucleo.</b>",
   "Si estraggono dal calendario, e valgono per tutti. Le feste dei santi e quelle della tradizione indiana restano quelle che sono; queste sono le nostre.",
   ["canone","26 agosto"]],
  ["<b>I file nuovi li scrive la penna, le modifiche dentro file esistenti le fa Code.</b>",
   "Code vede il file vivo per intero; la penna no.", ["in CLAUDE.md"]],
  ["<b>Mai sostituzioni automatiche larghe</b> su un file esistente: ancorare a una stringa esatta.",
   "Una sostituzione su «Ultimo aggiornamento» si è mangiata il riferimento al Regolamento UE.", ["in CLAUDE.md"]],
  ["<b>Prima di un delete o un update senza where: fermarsi e chiedere.</b>",
   "Una riga cancellata per sbaglio non torna.", ["in CLAUDE.md"]],
  ["<b>Le copie di sicurezza in COPIE/, fuori da git.</b> Le parole d&rsquo;ordine non si scrivono nei file né si chiedono in chat.",
   "", ["in CLAUDE.md","non ancora"]],
  ["<b>Le pagine legali vivono solo nel magazzino pubblico</b>, non nella cartella di lavoro.",
   "Due copie in due posti, con quella vecchia dove si pubblica, è come si perde il lavoro.", ["canone"]],
  ["<b>Ogni file consegnato porta byte e MD5</b>, nello stesso turno.", "", ["canone"]],
  ["<b>Nessun dato scritto a mano nelle pagine</b>: tutto dal database. E ogni pagina deve reggere il vuoto.",
   "", ["canone"]]]],

 ["Le parole","var(--nexus)",[
  ["<b>FelicitasMundi non è «un sito»</b>: è piattaforma, ecosistema, esperienza oltre la soglia.",
   "", ["canone"]],
  ["<b>Mai cura, terapia, diagnosi</b> o promesse cliniche.", "", ["canone"]],
  ["<b>Verbatim o segnaposto visibile.</b> Mai inventare prosa in nome di Gab.",
   "", ["canone"]],
  ["<b>Mai «non è X, è Y»</b>: affermare sempre in positivo.", "", ["canone"]],
  ["<b>Nei file consegnati non si parla a Gab.</b> Quei file vanno ai clienti.",
   "", ["canone"]]]]
];

var COL = {"canone":"d-canone","nel database":"d-db","nelle condizioni":"d-legge",
  "nella privacy":"d-legge","detta a chi entra":"d-pagina","in CLAUDE.md":"d-code",
  "non ancora":"d-aperta"};

var n = 0;
var t = document.getElementById('reg-tutto');
var ts = document.getElementById('reg-tasti');

var b0 = document.createElement('button');
b0.type = 'button'; b0.className = 'on'; b0.textContent = 'tutte';
b0.onclick = function(){ mostra(null, b0); };
ts.appendChild(b0);

G.forEach(function(g, i){
  var d = document.createElement('div');
  d.className = 'g'; d.style.setProperty('--c', g[1]);
  d.dataset.g = i;
  var h = '<div class="gh"><span class="pt"></span><b>' + g[0] +
          '</b><span class="n">' + g[2].length + '</span></div>';
  g[2].forEach(function(r){
    n++;
    h += '<div class="r"><div class="testo">' + r[0] + '</div>' +
      (r[1] ? '<div class="perche">' + r[1] + '</div>' : '') +
      '<div class="dove">' + r[2].map(function(x){
        return '<span class="' + COL[x] + '">' + x + '</span>'; }).join('') +
      '</div></div>';
  });
  d.innerHTML = h;
  t.appendChild(d);

  var b = document.createElement('button');
  b.type = 'button'; b.textContent = g[0];
  b.onclick = function(){ mostra(i, b); };
  ts.appendChild(b);
});

function mostra(i, b){
  [].slice.call(ts.querySelectorAll('button')).forEach(function(x){
    x.classList.remove('on'); });
  b.classList.add('on');
  [].slice.call(t.querySelectorAll('.g')).forEach(function(g){
    g.style.display = (i === null || +g.dataset.g === i) ? '' : 'none';
  });
}

t.parentNode.querySelector('.sot').innerHTML +=
  ' <b>' + n + ' regole in ' + G.length + ' gruppi.</b>';
})();
}

/* ⛔ Nessuna porta su window.SpazioVivo: chi chiama è fm-nucleo.js, che
   sta in comune col guscio e chiama `regoleDentro(dentro)` per nome —
   come chiama `annaleDentro(dentro)` e `nucleo(c)`. */
