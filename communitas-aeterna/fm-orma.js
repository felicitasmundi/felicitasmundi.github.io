/* ═══════════════════════════════════════════════════════════════
   Comunità Eterna FelicitasMundi · UNA SOLA ORMA — `?o=<id>`

   Fin qui `?p=orme` portava alla stanza di tutte le proprie orme, e
   non c'era modo di mandare a qualcuno QUELLA orma. Adesso ogni orma
   ha un indirizzo suo, e questo file disegna quello che ci si trova.

   ⛔ E CHI LA APRE NON È CHIUNQUE ABBIA IL COLLEGAMENTO. L'indirizzo
      non è la chiave: la chiave è essere nominati dentro quell'orma,
      in `orma_persone`, e averlo confermato. Chi non c'è non vede.

   ⭐ E IL CONTROLLO NON È QUI. Questo file chiede l'orma e disegna
      quello che torna: se il database non la manda, non la manda, e
      la pagina lo dice senza sapere perché. La difesa sta nelle
      regole di riga, dove nessuno può aggirarla con un navigatore
      aperto. Qui non c'è nessun «se sei» da togliere.

   ⭐ LE REGOLE DI RIGA SU `orma_persone` SONO IN PIEDI dal 1
      settembre 2026, tutte e quattro. Su di loro si appoggiano i
      due gesti di questo file: proporre un legame su un'orma
      propria, e confermare il proprio con «sì, c'ero». Il trigger
      che impedisce a un nominato di spostare la riga di un altro
      sta al terminale ②: qui ogni comando tocca solo la propria
      riga, e un rifiuto del database finisce in console.

   ══ I QUATTRO STATI ══
     ⓪ si arriva con `?c=<codice>` ............ l'orma, ANCHE da ospite.
        ⛔ Comanda su tutti gli altri: se c'è un codice, si guarda solo lui.
     ① sei entrato e l'orma ti arriva ......... l'orma
     ② sei entrato e non arriva ............... la stessa pagina che
        si vede quando l'orma non esiste più. ⛔ Devono essere IDENTICHE:
        due pagine diverse direbbero a chiunque quali id esistono.
     ③ non sei entrato ........................ la porta

   ⛔ LE PAROLE DELLO ② E DELLO ③ SONO DI GAB, e ci sono dall'1 settembre
      2026: entrano esatte, e non se ne inventano altre.

   ⛔ Niente involucro (function(){ … })() attorno al file: il guscio
      mette tutto in comune e questo file legge da lì.
   ═══════════════════════════════════════════════════════════════ */

"use strict";

/* ⚠️ VESTE PROVVISORIA. Design non ha consegnato la pagina di una sola
   orma: qui c'è il minimo perché si legga, e riusa le classi che il
   guscio ha già — .occhio .sotto .orma .vuoto .segna. Il giorno che la
   consegna arriva, questo blocco se ne va con lei.
   ⭐ La FORMA dell'orma invece è fissata: `orma-la-forma.html`, 3
      settembre 2026. La scorza — costola, fondo, angoli, i tre pixel al
      passaggio — sta già nel guscio; qui sotto ci sono la TESTA e il
      PIEDE, che il guscio dice per iscritto di lasciare a questo file.
   ⛔ Misure in rem. Nessun px. Niente sotto --t-eti. */
(function vesteProvvisoriaDellOrma(){
  if(document.getElementById("fm-orma-veste")) return;
  var s = document.createElement("style");
  s.id = "fm-orma-veste";
  s.textContent =
    "#orma-chi{display:flex;flex-wrap:wrap;gap:0.4rem;margin-top:0.6rem}"
  + "#orma-chi .nome{border:1px solid var(--line);border-radius:1rem;"
  +   "padding:0.25rem 0.7rem;font-family:'DM Sans',sans-serif;"
  +   "font-size:var(--t-eti);color:var(--ivory)}"
  + "#orma-chi .nome.attesa{opacity:0.5}"
  + "#orma-chi .mini{margin-left:0.1rem}"
  /* il campo del nominare: misure in rem, la stessa mano del resto */
  + "#orma-nomina{margin-top:0.9rem}"
  + "#orma-nomina .fs{font-family:'Cormorant Garamond',serif;font-style:italic;"
  +   "font-size:var(--t-cor);color:rgba(245,240,230,0.6);max-width:34rem}"
  + "#orma-nomina input{display:block;margin-top:0.6rem;width:100%;max-width:22rem;"
  +   "background:transparent;border:1px solid var(--line);border-radius:0.6rem;"
  +   "padding:0.55rem 0.8rem;color:var(--ivory);"
  +   "font-family:'DM Sans',sans-serif;font-size:var(--t-eti)}"
  + "#orma-nomina .trovati{display:flex;gap:0.4rem;flex-wrap:wrap;margin-top:0.5rem}"
  + "#orma-nomina .trovati:empty{display:none}"
  + "#orma-nomina > .mini{margin-top:0.6rem}"
  /* ── LA TESTA E IL PIEDE DELL'ORMA — da `orma-la-forma.html` ───────
     ⛔ `.cer` ESISTE GIÀ nel guscio, ed è un'altra cosa: i cerchietti
        del filo, 2.1rem, bordo tratteggiato, margine e z-index propri.
        Qui si scrive sempre scopato — `.orma .da .cer` — e si azzerano
        a mano margine, posizione e stile del bordo, o i cerchi della
        testa ereditano quelli del filo.
     ⛔ E i caratteri non scendono mai sotto `--t-eti`. La forma, che è
        una pagina a sé e non ha `--scala`, arriva a .58rem: qui non si
        può, e la testa arretra col colore invece che con la misura. */
  /* ⚠️ La riga va a capo: su una colonna stretta, con tre cerchi e un
     nome lungo, il quando scende sotto invece di finire addosso al
     nome. Misurato in una colonna da 20rem, dove senza questo il nome
     debordava di 12 punti. */
  + ".orma .da{display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem;"
  +   "margin-bottom:0.5rem}"
  /* ⚠️ Il cerchio è più largo di quello della forma — 2.5rem invece di
     1.5rem — perché le iniziali qui stanno a `--t-eti` e non possono
     scendere. La forma tiene il cerchio 2,6 volte il carattere: questo
     ne tiene 2,2, che è il più stretto in cui due lettere respirano. */
  + ".orma .da .cer{position:static;flex:none;width:2.5rem;height:2.5rem;"
  +   "margin:0;border-radius:50%;"
  +   "border:1px solid color-mix(in srgb,var(--c) 55%,transparent);"
  +   "background:color-mix(in srgb,var(--c) 16%,transparent);"
  +   "display:grid;place-items:center;line-height:1;"
  +   "font-family:'DM Sans',sans-serif;font-size:var(--t-eti);"
  +   "color:color-mix(in srgb,var(--c) 85%,var(--ivory))}"
  /* quando la mettono in più i cerchi si accavallano: è la forma */
  + ".orma .da .cer.pi{margin-left:-0.9rem}"
  + ".orma .da .nm{flex:1 1 auto;min-width:0;overflow-wrap:anywhere;"
  +   "font-family:'DM Sans',sans-serif;"
  +   "font-size:var(--t-eti);color:rgba(245,240,230,0.62);line-height:1.25}"
  + ".orma .da .nm i{font-style:normal;color:rgba(245,240,230,0.34)}"
  + ".orma .da .qd{margin-left:auto;font-family:'DM Sans',sans-serif;"
  +   "font-size:var(--t-eti);color:rgba(245,240,230,0.34);white-space:nowrap}"
  + ".orma .tt{font-family:'Cormorant Garamond',serif;font-size:var(--t-cor);"
  +   "line-height:1.4;color:rgba(245,240,230,0.94)}"
  + ".orma .rg{display:flex;gap:0.4rem;flex-wrap:wrap;align-items:center;"
  +   "margin-top:0.4rem;font-family:'DM Sans',sans-serif;"
  +   "font-size:var(--t-eti);color:rgba(245,240,230,0.44)}"
  + ".orma .rg:empty{display:none}"
  + ".orma .rg .sep{color:rgba(245,240,230,0.18)}"
  + ".orma .rg .el{color:var(--c);filter:brightness(1.3)}"
  /* lo stadio: in fondo, mai in cima, e col suo colore.
     ⚠️ `--nexus` NON sta in `:root` del guscio — solo dentro `.sv-tal` —
        quindi qui va col ripiego, che è il valore che il guscio e la
        forma scrivono identico. */
  + ".orma .stadio{display:inline-flex;align-items:center;gap:0.4rem;"
  +   "font-family:'DM Sans',sans-serif;font-size:var(--t-eti);"
  +   "letter-spacing:0.1em;padding:0.1rem 0.5rem;border-radius:999px;"
  +   "border:1px solid color-mix(in srgb,var(--s) 44%,transparent);"
  +   "color:color-mix(in srgb,var(--s) 78%,var(--ivory))}"
  + ".orma .stadio i{flex:none;width:0.4rem;height:0.4rem;border-radius:50%;"
  +   "background:var(--s);filter:brightness(1.3)}"
  + ".orma .stadio.in-coda{--s:var(--nexus,#8C2F39)}"
  + ".orma .stadio.in-avanzamento{--s:var(--terra)}"
  + ".orma .stadio.sviluppato{--s:var(--etere)}"
  + ".orma-porta{margin-top:1.2rem}"
  /* ⛔ `.tasto` sta in invito.html e accesso.html, NON nel guscio: qui
     non esiste, e appoggiarcisi darebbe un collegamento nudo. La porta
     si veste da sé, con le stesse misure di .mini che il guscio ha già. */
  + ".orma-porta a{display:inline-block;background:var(--oro);color:var(--navy);"
  +   "border-radius:0.7rem;padding:0.7rem 1.4rem;text-decoration:none;"
  +   "font-family:'DM Sans',sans-serif;font-size:var(--t-tas)}";
  document.head.appendChild(s);
})();

/* ── l'unica porta d'ingresso: la chiama vai("orma") ──
   `window.ormaChiesta` la posa il guscio, leggendola da `?o=`. */
function unaOrma(c){
  var id = window.ormaChiesta || null;

  c.innerHTML = '<div class="occhio">Comunità Eterna FelicitasMundi</div>'
    + '<h1 id="orma-titolo"></h1>'
    + '<p class="sotto" id="orma-sotto"></p>'
    + '<div id="orma-corpo"></div>';

  /* ── ⓪ IL CODICE COMANDA ──
     `window.codiceChiesto` la posa il guscio, leggendola da `?c=`. Se
     c'è, l'orma si legge da lui e `?o=` non conta: è un altro modo di
     arrivare alla stessa orma, e vince perché dice anche CHI sei. */
  var codice = window.codiceChiesto || null;
  if(codice){ ormaColCodice(codice); return; }

  /* ⛔ un id che non ha la forma di un id non si manda al database:
     si risponde con la stessa pagina del «non c'è», e basta. */
  if(!id || !/^[0-9a-fA-F-]{8,40}$/.test(id)){ ormaNonCe(); return; }

  /* ── ③ da fuori: la porta ── */
  if(typeof ospite !== "undefined" && ospite){ ormaPorta(id); return; }

  var corpo = document.getElementById("orma-corpo");
  if(corpo) corpo.innerHTML = '<p class="vuoto">…</p>';

  chiediLOrma(id, function(d){
    /* ⛔ l'errore e il vuoto finiscono nello STESSO posto: una regola di
       riga che nasconde una riga non torna come errore, torna come
       niente — e le due risposte non devono distinguersi qui. */
    if(!d){ ormaNonCe(); return; }
    disegnaLOrma(d);
  });
}

/* ── la lettura dell'orma, e la colonna che forse non c'è ───────────

   ⛔ La forma vuole lo STADIO in fondo. Su `orme` quella colonna oggi
      NON risulta: nello schema del magazzino non c'è, e `stadio` si
      trova solo su `task`. Chiederla a vuoto farebbe rifiutare TUTTA
      la lettura, e l'orma sparirebbe dietro la pagina del «non c'è» —
      che qui è il danno peggiore che si possa fare.

   ⭐ Quindi si chiede, e se il database la rifiuta si rilegge senza.
      Lo stadio si disegna solo se torna: un campo che non arriva resta
      vuoto, non si inventa. Il giorno che il ② dice se `orme.stadio`
      c'è o non ci va, questo ripiego si toglie e resta una lettura
      sola — la domanda è in `agenti/posta/per-database.md`.

   ⛔ E le due strade tornano NELLO STESSO MODO — `null` — perché una
      regola di riga che nasconde una riga non torna come errore,
      torna come niente. */
var ORMA_CAMPI = "id,titolo,sottotitolo,contenuto,tipo,destinazione,"
               + "momento,accaduto_il,luogo,visibilita,persona_id";

function chiediLOrma(id, poi){
  db.from("orme").select(ORMA_CAMPI + ",stadio")
    .eq("id", id)
    .maybeSingle()
    .then(function(r){
      if(r && r.error){ ormaSenzaLoStadio(id, poi); return; }
      poi((r && r.data) || null);
    })
    .catch(function(){ ormaSenzaLoStadio(id, poi); });
}

function ormaSenzaLoStadio(id, poi){
  db.from("orme").select(ORMA_CAMPI)
    .eq("id", id)
    .maybeSingle()
    .then(function(r){ poi((r && !r.error && r.data) || null); })
    .catch(function(){ poi(null); });
}

/* ── ⓪ IL CODICE PER PERSONA: `?c=<codice>` ─────────────────────────

   ⛔ IL LINK È LA CHIAVE. Chi riceve questo indirizzo e lo gira, gira
      anche l'accesso: chiunque lo apra legge quell'orma senza entrare.
      Quindi IL CODICE NON ESCE MAI — non in un log, non in un titolo,
      non in un `og:`, non in un indirizzo che porta a una pagina
      pubblica. Il guscio lo tiene in `MIEI_PARAMETRI` apposta: appena
      si esce dall'orma sparisce dalla barra, e non si riscrive mai in
      coda. Qui dentro non finisce in nessun messaggio di console.

   ⭐ E SI LEGGE PRIMA DI ENTRARE — decisione di Gab, 1 settembre 2026.
      Per questo la lettura NON passa da `orme`: quella tavola è chiusa
      ad `anon` anche in lettura, e da fuori tornerebbe vuota a tutti.
      Passa solo da `fm_orma_col_codice()`, che guarda da sopra le
      regole di riga.
      ✅ La concessione c'è: `anon=X` su fm_orma_col_codice e su
         fm_collega_codice, verificato il 1 settembre 2026.

   ⛔ E QUANDO IL CODICE NON TORNA NIENTE si finisce in ormaNonCe(): la
      stessa pagina di sempre, mai una diversa. Due risposte distinte
      direbbero a chi prova quali codici esistono. */
function ormaColCodice(codice){
  var corpo = document.getElementById("orma-corpo");
  if(corpo) corpo.innerHTML = '<p class="vuoto">…</p>';

  /* ⛔ Nessun controllo sulla FORMA del codice: non la conosciamo, e
     inventarla spegnerebbe i link veri. Il solo limite è la lunghezza —
     e il codice viaggia come parametro legato, mai concatenato. */
  if(typeof codice !== "string" || !codice || codice.length > 200){
    ormaNonCe();
    return;
  }

  db.rpc("fm_orma_col_codice", { p_codice: codice })
    .then(function(r){
      /* ⛔ l'errore e il vuoto finiscono nello STESSO posto, come per `?o=` */
      if(!r || r.error){ ormaNonCe(); return; }
      var d = r.data;
      if(Object.prototype.toString.call(d) === "[object Array]") d = d[0];
      if(!d){ ormaNonCe(); return; }

      /* la funzione torna `orma_id`; disegnaLOrma() cerca `id` */
      if(!d.id && d.orma_id) d.id = d.orma_id;
      disegnaLOrma(d);

      /* ⭐ chi è entrato attacca il suo conto a quella riga. Da ospite non
         si può, e non è un errore: l'orma si è già letta. */
      if(typeof ospite !== "undefined" && !ospite && !d.gia_collegato)
        collegaIlCodice(codice);
    })
    .catch(function(){ ormaNonCe(); });
}

/* ── attacca il conto di chi è entrato alla riga di quel codice ──
   ⛔ Gli errori in console, non a schermo: l'orma è già disegnata, e un
      collegamento mancato non deve toglierla di mezzo.
   ⛔ E in console va il motivo, MAI il codice. */
function collegaIlCodice(codice){
  function nonHaPreso(m){
    console.warn("fm-orma: il codice non si è collegato — " + (m || "senza motivo"));
  }
  db.rpc("fm_collega_codice", { p_codice: codice })
    .then(function(r){
      if(!r || r.error) nonHaPreso(r && r.error && r.error.message);
    })
    .catch(function(e){ nonHaPreso(e && e.message); });
}

/* ── ① l'orma ── */
function disegnaLOrma(o){
  var t = document.getElementById("orma-titolo");
  var s = document.getElementById("orma-sotto");
  var corpo = document.getElementById("orma-corpo");
  if(!corpo) return;

  /* ⛔ il titolo è quello dell'orma. Se non ce l'ha, la prima riga di
     quello che c'è scritto — le parole sono già sue, non se ne aggiungono. */
  var q = (typeof DOVE !== "undefined")
    ? DOVE.filter(function(x){ return x.tipo === o.tipo; })[0] : null;
  if(t) t.textContent = o.titolo || (o.contenuto || "").split("\n")[0].slice(0,80);
  if(s) s.textContent = o.sottotitolo || (q ? q.n : (o.tipo || ""));

  corpo.innerHTML = "";

  /* ── LA FORMA DELL'ORMA — `orma-la-forma.html`, 3 settembre 2026 ──
     Tre pezzi, in quest'ordine e mai in un altro:
       ① LA TESTA — i cerchi con le iniziali, il nome di chi l'ha
         lasciata, e il quando. ⛔ PRIMA del contenuto, sempre:
         «la prima riga dice sempre da chi viene».
       ② il contenuto.
       ③ la riga in fondo — dove sta la cosa, il luogo, e LO STADIO
         col suo colore. ⛔ Lo stadio in fondo, mai in cima.
     ⛔ Il nome non sta in `orme`: quella tavola porta `persona_id`. Si
        legge da `persone_pubbliche`, la vista aperta — `persone` è
        chiusa e non si tocca. È una seconda lettura e arriva dopo: la
        testa nasce subito col cerchio e il quando, e il nome ci si
        posa quando torna. */
  var riga = document.createElement("div");
  riga.id = "orma-riga";
  riga.className = "orma";
  if(q) riga.style.setProperty("--oc", "var(" + q.c + ")");
  riga.innerHTML = '<div class="da"><span class="nm"></span>'
                 + '<span class="qd"></span></div>'
                 + '<div class="tt"></div><div class="rg"></div>';

  /* il giorno e l'ora: le stesse due funzioni della stanza delle orme,
     così un'orma dice la stessa data dovunque la si guardi */
  var quando = "";
  if(typeof giornoDi === "function" && typeof nomeDelGiorno === "function")
    quando = nomeDelGiorno(giornoDi(o));
  var ora = new Date(o.momento).toLocaleTimeString("it-IT",
              {hour:"2-digit", minute:"2-digit"});
  riga.querySelector(".qd").textContent = (quando ? quando + " · " : "") + ora;

  riga.querySelector(".tt").textContent = o.contenuto || "";

  /* ── ③ la riga in fondo ──
     📌 La `destinazione` non si scrive più accanto alla stanza: le due
        escono dalla stessa riga di DOVE e dicevano la stessa cosa due
        volte. Resta come ripiego, se il tipo non si riconosce.
     ⭐ Dove non c'è lo stadio, in coda va l'apertura — «solo me», «il
        mio vicinato», «tutti»: sono le tre parole del velo «E chi la
        vede?» che il guscio ha già, non se ne scrivono di nuove. */
  var voci = [];
  var dove = q ? q.n : (o.tipo || o.destinazione || "");
  if(dove) voci.push({ t: dove, c: "el" });
  if(o.luogo) voci.push({ t: o.luogo });
  var stadio = segnoDelloStadio(o.stadio);
  if(stadio) voci.push({ e: stadio });
  else if(parolaDellApertura(o.visibilita))
    voci.push({ t: parolaDellApertura(o.visibilita) });

  var rg = riga.querySelector(".rg");
  voci.forEach(function(v, i){
    if(i){
      var sp = document.createElement("span");
      sp.className = "sep";
      sp.textContent = "\u00B7";
      rg.appendChild(sp);
    }
    if(v.e){ rg.appendChild(v.e); return; }
    var e = document.createElement("span");
    if(v.c) e.className = v.c;
    e.textContent = v.t;
    rg.appendChild(e);
  });

  corpo.appendChild(riga);
  nomeDellaTesta(riga, o);

  /* ── chi c'è dentro ──
     ⭐ Decisione di Gab: chi è nominato e ha confermato vede TUTTI i nomi.
        È lì il senso — entri e vedi con chi stai lavorando.
     ⛔ E QUANDO NON C'È NESSUNO IL RIQUADRO NON SI DISEGNA: niente
        titolo, niente segnaposto — la stessa regola della riga dei
        bisogni, decisa da Gab l'1 settembre 2026 e chiesta da STANZE
        in `agenti/posta/per-orma.md` il 3 settembre. Qui resta solo il
        posto vuoto dove il riquadro nasce se qualcuno arriva — e serve
        anche al ridisegno dopo i due gesti. */
  var blocco = document.createElement("div");
  blocco.id = "orma-chi-blocco";
  corpo.appendChild(blocco);

  /* il campo per nominare: solo su un'orma PROPRIA. Dal `?c=` la
     risposta può non dire di chi è l'orma — allora non compare, e
     niente si rompe. */
  if(typeof io !== "undefined" && io && io.id && o.persona_id === io.id)
    nominaDentroLOrma(o, corpo);

  leggiChiCe(o.id, function(righe){
    versaChiCe(blocco, righe, o);
    /* ⭐ e la testa impara chi altro c'è dentro: la forma dice che
       «quando la mettono in più» i cerchi si affiancano e il nome
       diventa «e altri due». Il corpo resta identico. */
    testaDellOrma(riga).righe = righe;
    posaLaTesta(riga);
    /* ⭐ la chat si apre in ogni caso: «Chi c'è» vuoto non vuol dire
       che non ci siano messaggi — da ospite col codice è la norma. */
    chatDentroLOrma(o.id, corpo, righe);
  });
}

/* ── LO STADIO — le tre parole, e i tre colori ──────────────────────

   ⭐ Parole e colori vengono dalla forma, e sono tre: «in coda» col
      rosso del Nexus, «in avanzamento» col colore della terra,
      «sviluppato» con quello dell'etere. ⛔ Non se ne inventano altre:
      uno stadio che non è uno di questi tre non si disegna affatto.

   ⚠️ Nel database lo stadio si scrive con la lineetta bassa — `in_coda`,
      come su `task`. Qui si accettano tutte e due le grafie e si mostra
      sempre quella con lo spazio, che è quella della forma. */
var ORMA_STADI = ["in coda", "in avanzamento", "sviluppato"];

function segnoDelloStadio(v){
  if(typeof v !== "string" || !v) return null;
  var parola = v.replace(/_/g, " ").trim().toLowerCase();
  if(ORMA_STADI.indexOf(parola) < 0) return null;
  var e = document.createElement("span");
  e.className = "stadio " + parola.replace(/ /g, "-");
  e.appendChild(document.createElement("i"));
  e.appendChild(document.createTextNode(parola));
  return e;
}

/* le tre parole dell'apertura sono quelle del velo «E chi la vede?» del
   guscio — solo me · il mio vicinato · tutti. Non se ne scrivono altre. */
var ORMA_APERTURA = { solo_me: "solo me", vicinato: "il mio vicinato",
                      pubblico: "tutti" };
function parolaDellApertura(v){
  return (typeof v === "string" && ORMA_APERTURA[v]) || "";
}

/* ── LA TESTA: i cerchi, il nome, il quando ─────────────────────────

   Due letture la riempiono e arrivano quando arrivano: il nome di chi
   ha lasciato l'orma, da `persone_pubbliche`, e le righe di «Chi c'è»,
   già lette per il riquadro. Ognuna posa la sua parte e chiama il
   ridisegno: l'ordine fra le due non conta.

   ⛔ E se un nome non torna non se ne inventa uno: resta il segnaposto
      spento, e il cerchio senza iniziali. */
function testaDellOrma(riga){
  if(!riga._testa) riga._testa = { autore: "", autoreId: "", righe: [] };
  return riga._testa;
}

/* ⛔ I nomi da `persone_pubbliche`, MAI da `persone`: quella è chiusa.
   ⭐ Dal `?c=` la risposta può non dire di chi è l'orma: allora non si
      chiede niente, e la testa resta col solo quando. */
function nomeDellaTesta(riga, o){
  var t = testaDellOrma(riga);
  posaLaTesta(riga);
  if(!o || !o.persona_id) return;
  t.autoreId = o.persona_id;
  db.from("persone_pubbliche").select("id,nome")
    .eq("id", o.persona_id)
    .maybeSingle()
    .then(function(r){
      t.autore = (r && !r.error && r.data && r.data.nome) || "";
      posaLaTesta(riga);
    })
    .catch(function(){ posaLaTesta(riga); });
}

function posaLaTesta(riga){
  if(!riga) return;
  var t  = testaDellOrma(riga);
  var da = riga.querySelector(".da");
  var nm = riga.querySelector(".nm");
  if(!da || !nm) return;

  /* ⛔ Solo chi ha CONFERMATO entra nella testa: una proposta non è
     ancora un fatto, e la testa dice chi l'orma l'ha messa. Chi è
     ancora in attesa resta nel riquadro «Chi c'è», visibile e spento. */
  var altri = (t.righe || []).filter(function(x){
    if(!x || !x.nome || x.stato !== "confermato") return false;
    if(t.autoreId && x.persona_id === t.autoreId) return false;
    if(t.autore  && x.nome === t.autore) return false;
    return true;
  }).map(function(x){ return x.nome; });

  /* i cerchi: prima chi l'ha lasciata, poi gli altri, accavallati.
     ⭐ Se ne disegnano al massimo tre, quanti la forma ne mostra: il
        conto vero resta nelle parole, che non arrotondano. */
  var nomi   = (t.autore ? [t.autore] : [""]).concat(altri);
  var vecchi = da.querySelectorAll(".cer");
  for(var i = 0; i < vecchi.length; i++) da.removeChild(vecchi[i]);
  var quanti = Math.min(nomi.length, 3);
  for(var k = 0; k < quanti; k++){
    var c = document.createElement("span");
    c.className = "cer" + (k ? " pi" : "");
    c.textContent = inizialiDi(nomi[k]);
    da.insertBefore(c, nm);
  }

  nm.textContent = "";
  if(!t.autore){
    /* ⛔ Il nome manca: segnaposto visibile, mai un nome inventato. */
    var v = document.createElement("i");
    v.textContent = "[ in attesa ]";
    nm.appendChild(v);
    return;
  }
  nm.appendChild(document.createTextNode(t.autore));
  if(!altri.length) return;
  var coda = document.createElement("i");
  coda.textContent = (altri.length === 1)
    ? " e " + primoNomeDi(altri[0])
    : " e altri " + quantiInParole(altri.length);
  nm.appendChild(coda);
}

/* le iniziali: la prima lettera del nome e quella del secondo pezzo,
   se c'è. Un nome che non arriva lascia il cerchio vuoto. */
function inizialiDi(n){
  var p = String(n || "").trim().split(/\s+/).filter(Boolean);
  if(!p.length) return "";
  return (p[0].charAt(0) + (p.length > 1 ? p[1].charAt(0) : "")).toUpperCase();
}

function primoNomeDi(n){
  return String(n || "").trim().split(/\s+/)[0] || "";
}

var ORMA_CONTA = ["", "", "due", "tre", "quattro", "cinque",
                  "sei", "sette", "otto", "nove", "dieci"];
function quantiInParole(n){
  return ORMA_CONTA[n] || String(n);
}

/* ── I DUE GESTI SUL LEGAME ─────────────────────────────────────────

   «Il legame si propone, non si impone»: nasce `proposto`, e diventa
   `confermato` solo per mano di chi è stato nominato. Le parole qui
   dentro sono quelle già in uso nel guscio — il velo «Con chi» — e
   «sì, c'ero» viene dal Cruscotto: non ne nascono di nuove.
   ⚠️ Il gesto del RITIRO non c'è: le parole di quel tasto non sono
      state date, e restano [ in attesa ]. Lo stato `ritirato` esiste
      già nella tavola, e il disegno già lo mostra spento. */

/* la lettura di chi c'è: una forma sola, per il primo disegno e per i
   ridisegni. L'errore e il vuoto tornano uguali, come sempre qui. */
function leggiChiCe(ormaId, poi){
  db.from("orma_persone")
    .select("id,nome,stato,persona_id")
    .eq("orma_id", ormaId)
    .then(function(r){ poi((r && !r.error && r.data) || []); })
    .catch(function(){ poi([]); });
}

/* i nomi dentro il riquadro — e sulla PROPRIA riga proposta, il tasto.

   ⛔ CON ZERO RIGHE IL RIQUADRO NON SI DISEGNA: niente titolo, niente
      segnaposto. È la stessa regola della riga dei bisogni, decisa da
      Gab l'1 settembre 2026 e chiesta da STANZE il 3 settembre. Si
      svuota il posto e si esce.
   ⭐ Il campo del nominare non sta qui dentro e resta comunque: quello
      non è il riquadro dei nomi. */
function versaChiCe(blocco, righe, o){
  if(!blocco) return;
  blocco.innerHTML = "";
  if(!righe.length) return;

  var h = document.createElement("h2");
  h.style.marginTop = "1.6rem";
  h.textContent = "Chi c'è";
  blocco.appendChild(h);

  var box = document.createElement("div");
  box.id = "orma-chi";
  blocco.appendChild(box);

  righe.forEach(function(x){
    var e = document.createElement("span");
    /* ⛔ «confermato» è l'unico stato che vale. `proposto` e `ritirato`
       restano visibili e spenti: chi è stato nominato non sparisce
       dall'orma solo perché non ha ancora risposto. */
    e.className = "nome" + (x.stato === "confermato" ? "" : " attesa");
    e.textContent = x.nome || "";
    box.appendChild(e);

    /* ── «ricevo una proposta»: il tasto «sì, c'ero» ──
       Solo la propria riga, solo se è ancora una proposta. */
    if(x.id && x.persona_id && typeof io !== "undefined" && io &&
       x.persona_id === io.id && x.stato === "proposto"){
      var b = document.createElement("button");
      b.type = "button";
      b.className = "mini";
      b.textContent = "sì, c'ero";
      b.addEventListener("click", function(){ confermaIlLegame(x.id, o); });
      box.appendChild(b);
    }
  });
}

/* da `proposto` a `confermato` — la propria riga e basta.
   ⛔ Il filtro su `persona_id` è la cintura oltre le regole di riga: il
      trigger che blocca le righe altrui sta al ②, ma questo comando
      non gli dà comunque niente da fermare. */
function confermaIlLegame(rigaId, o){
  if(typeof io === "undefined" || !io || !io.id) return;
  db.from("orma_persone")
    .update({ stato: "confermato" })
    .eq("id", rigaId)
    .eq("persona_id", io.id)
    .then(function(r){
      if(r && r.error){
        console.warn("fm-orma: il legame non si è confermato — " + r.error.message);
        return;
      }
      rileggiChiCe(o);
    })
    .catch(function(e){
      console.warn("fm-orma: il legame non si è confermato — " + (e && e.message));
    });
}

/* il ridisegno dopo un gesto: il riquadro, il tag @ della chat, e la
   penna — che deve conoscere i nomi nuovi per le chiamate */
function rileggiChiCe(o){
  /* ⛔ il posto fisso è il BLOCCO, non il riquadro: con zero righe il
     riquadro non esiste, e cercare `orma-chi` fermerebbe il ridisegno
     proprio quando serve — subito dopo la prima proposta. */
  var blocco = document.getElementById("orma-chi-blocco");
  if(!blocco) return;
  leggiChiCe(o.id, function(righe){
    versaChiCe(blocco, righe, o);
    /* e la testa si rifà con chi ha confermato adesso */
    var riga = document.getElementById("orma-riga");
    if(riga){ testaDellOrma(riga).righe = righe; posaLaTesta(riga); }
    var SV = window.SpazioVivo || {};
    var elenco = [], perNome = {};
    righe.forEach(function(x){
      if(!x || !x.nome) return;
      elenco.push({ nome: x.nome });
      if(x.persona_id) perNome[x.nome] = x.persona_id;
    });
    var mioNome = (typeof io !== "undefined" && io && io.nome) || "";
    if(typeof SV.chatChi === "function") SV.chatChi(elenco, mioNome);
    attaccaLaPenna(o.id, perNome);
  });
}

/* ── «propongo un legame» — nominare dentro un'orma già lasciata ──
   Le stesse strade del Megafono: il nome si cerca in `persone_pubbliche`
   e se corrisponde la riga porta anche `persona_id`; se no il nome
   basta, e diventerà un collegamento vero il giorno che quella persona
   entra. La riga nasce `proposto` — mai altro.
   ⛔ LA REGOLA DEL CANONE vale anche qui: un'orma che nomina qualcuno
      che non ha confermato resta privata. Dopo la proposta l'orma
      torna `solo_me`, qualunque apertura avesse — la stessa regola
      che il Megafono applica alla nascita. */
function nominaDentroLOrma(o, corpo){
  var q = document.createElement("div");
  q.id = "orma-nomina";
  q.innerHTML =
      '<div class="fs">Un\u2019orma che nomina un\u2019altra persona resta privata '
    + 'finch\u00e9 quella persona non conferma. Il legame si propone, non si impone.</div>'
    + '<input placeholder="il nome di chi c\u2019era">'
    + '<div class="trovati"></div>'
    + '<button type="button" class="mini">Aggiungi</button>';
  corpo.appendChild(q);

  var campo   = q.querySelector("input");
  var trovati = q.querySelector(".trovati");
  var agg     = q.querySelector("button.mini");
  var scelto  = null;   /* {nome, persona_id} se preso dai suggerimenti */

  campo.addEventListener("input", function(){
    scelto = null;
    var v = campo.value.trim();
    trovati.innerHTML = "";
    if(v.length < 2) return;
    /* ⛔ i nomi da `persone_pubbliche`, MAI da `persone`: quella è chiusa */
    db.from("persone_pubbliche").select("id,nome")
      .ilike("nome", "%" + v + "%").limit(5)
      .then(function(r){
        ((r && r.data) || []).forEach(function(pp){
          var b = document.createElement("button");
          b.type = "button";
          b.className = "mini";
          b.textContent = pp.nome;
          b.addEventListener("click", function(){
            scelto = { nome: pp.nome, persona_id: pp.id };
            campo.value = pp.nome;
            trovati.innerHTML = "";
          });
          trovati.appendChild(b);
        });
      }).catch(function(){});
  });

  agg.addEventListener("click", function(){
    var v = campo.value.trim();
    if(!v) return;
    var riga = (scelto && scelto.nome === v)
      ? { orma_id: o.id, nome: scelto.nome, persona_id: scelto.persona_id,
          stato: "proposto" }
      : { orma_id: o.id, nome: v, persona_id: null, stato: "proposto" };
    db.from("orma_persone").insert(riga)
      .then(function(r){
        if(r && r.error){
          console.warn("fm-orma: il legame non si è proposto — " + r.error.message);
          return;
        }
        campo.value = "";
        trovati.innerHTML = "";
        scelto = null;
        rileggiChiCe(o);
        /* ⛔ e l'orma torna privata, finché il nominato non conferma */
        db.from("orme").update({ visibilita: "solo_me" }).eq("id", o.id)
          .then(function(u){
            if(u && u.error)
              console.warn("fm-orma: la privacy non si è stretta — " + u.error.message);
          })
          .catch(function(e){
            console.warn("fm-orma: la privacy non si è stretta — " + (e && e.message));
          });
      })
      .catch(function(e){
        console.warn("fm-orma: il legame non si è proposto — " + (e && e.message));
      });
  });
}

/* ── ④ LA CHAT DENTRO L'ORMA ────────────────────────────────────────

   Il pezzo di Design vive in `#sv-parcheggio` dentro il guscio. Qui si
   sposta dentro l'orma, e riponiLaChat() lo rimette a casa PRIMA che il
   guscio svuoti `#centro` — la chiamata sta in vai(), segnata.
   ⛔ Se restasse dentro se ne andrebbe con lo svuotamento, e la volta
      dopo l'orma sarebbe muta senza modo di accorgersene.

   ⚠️ Si sposta il FONDO `.sv-chat-fondo`, non `#svChat`: il pezzo porta
      il proprio sfondo in un involucro esterno che id non ne ha, e
      spostando solo il figlio lo sfondo resterebbe nel parcheggio. È la
      stessa ragione per cui il nucleo sposta `.sv-spec-fondo`.

   ⛔ E NON È LA CHAT DELLO SVILUPPO: quella è chat(c) nel guscio e legge
      da `sviluppo`. Questa legge da `orma_messaggi`, e sono due cose. */
function riponiLaChat(){
  var casa  = document.getElementById("sv-parcheggio");
  var pezzo = document.querySelector(".sv-chat-fondo");
  if(casa && pezzo && pezzo.parentNode !== casa) casa.appendChild(pezzo);
}

/* le stesse due forme che il pezzo usa in oggi() e adesso(): se non
   combaciassero, un messaggio di oggi aprirebbe una seconda giornata */
var CHAT_GIORNI = ["Domenica","Lunedì","Martedì","Mercoledì",
                   "Giovedì","Venerdì","Sabato"];
var CHAT_MESI   = ["gennaio","febbraio","marzo","aprile","maggio","giugno",
                   "luglio","agosto","settembre","ottobre","novembre","dicembre"];
function chatGiorno(d){
  return CHAT_GIORNI[d.getDay()] + " " + d.getDate() + " " + CHAT_MESI[d.getMonth()];
}
function chatOra(d){
  return ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
}

/* `gente` sono le righe di `orma_persone` già lette per «Chi c'è»: si
   riusano invece di richiederle. Da ospite arriva vuota, e allora il
   tag @ non propone nessuno e il campo non manda — giusto così. */
function chatDentroLOrma(ormaId, corpo, gente){
  var pezzo = document.querySelector(".sv-chat-fondo");
  var SV = window.SpazioVivo || {};
  /* ⛔ se il pezzo non c'è, l'orma resta com'è: niente errori a schermo */
  if(!pezzo || !corpo || typeof SV.chat !== "function"){
    if(!pezzo) console.warn("fm-orma: il pezzo della chat non è nel parcheggio");
    return;
  }

  var h = document.createElement("h2");
  h.style.marginTop = "1.6rem";
  /* ⭐ «La conversazione»: è la parola della fonte e del mandato — il
     file scriveva «La chat». Segnalato da STANZE il 3 settembre. */
  h.textContent = "La conversazione";
  corpo.appendChild(h);
  corpo.appendChild(pezzo);

  /* ── chi c'è, e chi sono io ── */
  var perNome = {};
  var elenco  = [];
  (gente || []).forEach(function(x){
    if(!x || !x.nome) return;
    elenco.push({ nome: x.nome });
    if(x.persona_id) perNome[x.nome] = x.persona_id;
  });
  var mioNome = (typeof io !== "undefined" && io && io.nome) || "";
  if(typeof SV.chatChi === "function") SV.chatChi(elenco, mioNome);

  /* ── le righe vere ── */
  db.from("orma_messaggi")
    .select("id,persona_id,testo,argomento,elemento,momento")
    .eq("orma_id", ormaId)
    .order("momento", { ascending: true })
    .then(function(r){
      /* ⛔ una regola di riga che nasconde tutto torna come vuoto, non come
         errore: in tutti e due i casi la chat si apre senza righe. */
      var righe = (r && r.data) || [];
      if(!righe.length){ SV.chat([]); attaccaLaPenna(ormaId, perNome); return; }

      var ids = righe.map(function(m){ return m.persona_id; })
                     .filter(function(v, i, a){ return v && a.indexOf(v) === i; });

      /* ⛔ i nomi da `persone_pubbliche`, MAI da `persone`: quella è chiusa */
      db.from("persone_pubbliche").select("id,nome").in("id", ids)
        .then(function(pr){
          var nome = {};
          ((pr && pr.data) || []).forEach(function(x){ nome[x.id] = x.nome; });
          versaLeRighe(righe, nome, ormaId, perNome);
        })
        .catch(function(){ versaLeRighe(righe, {}, ormaId, perNome); });
    })
    .catch(function(e){
      console.warn("fm-orma: la chat non ha letto i messaggi — " + (e && e.message));
      SV.chat([]);
    });
}

/* ⭐ `apre` marca dove l'argomento cambia: è il capitolo, e il pezzo lo
   usa per la colonna di lato. Si calcola qui perché solo qui si vede
   l'ordine intero. */
function versaLeRighe(messaggi, nome, ormaId, perNome){
  var SV = window.SpazioVivo || {};
  var precedente = null;
  var righe = messaggi.map(function(m){
    var d = new Date(m.momento);
    var riga = {
      giorno: chatGiorno(d),
      ora: chatOra(d),
      /* ⛔ un nome che non torna resta vuoto: non si inventa */
      chi: nome[m.persona_id] || "",
      testo: m.testo || "",
      argomento: m.argomento || null,
      elemento: m.elemento || null,
      apre: !!(m.argomento && m.argomento !== precedente)
    };
    if(m.argomento) precedente = m.argomento;
    return riga;
  });
  SV.chat(righe);
  segnaLetteLeChiamate(messaggi);
  attaccaLaPenna(ormaId, perNome);
}

/* ── le chiamate lette ──
   ⚠️ È un `update`, e ha tre paletti: solo le MIE righe, solo quelle non
      ancora lette, solo i messaggi di QUESTA orma. Senza il terzo si
      segnerebbero lette anche le chiamate di orme mai aperte. */
function segnaLetteLeChiamate(messaggi){
  if(typeof io === "undefined" || !io || !io.id) return;
  var ids = messaggi.map(function(m){ return m.id; }).filter(Boolean);
  if(!ids.length) return;
  db.from("messaggio_chiamati")
    .update({ letto_il: new Date().toISOString() })
    .eq("persona_id", io.id)
    .is("letto_il", null)
    .in("messaggio_id", ids)
    .then(function(r){
      if(r && r.error)
        console.warn("fm-orma: le chiamate non si sono segnate lette — " + r.error.message);
    })
    .catch(function(e){
      console.warn("fm-orma: le chiamate non si sono segnate lette — " + (e && e.message));
    });
}

/* ── quello che si scrive finisce in `orma_messaggi` ──
   Il pezzo chiama questo gancio DOPO riconosci(), quindi `argomento` ed
   `elemento` sono già posati sulla riga.
   ⛔ Da ospite non si scrive: senza `io` il campo non manda nemmeno. */
function attaccaLaPenna(ormaId, perNome){
  window.SpazioVivo = window.SpazioVivo || {};
  window.SpazioVivo.chatMandaGancio = function(riga){
    if(typeof io === "undefined" || !io || !io.id) return;
    db.from("orma_messaggi")
      .insert({
        orma_id: ormaId,
        persona_id: io.id,
        testo: riga.testo,
        argomento: riga.argomento || null,
        elemento: riga.elemento || null
      })
      .select("id")
      .then(function(r){
        if(!r || r.error){
          console.warn("fm-orma: il messaggio non è entrato — "
                       + (r && r.error && r.error.message));
          return;
        }
        var m = r.data && r.data[0];
        if(m) chiamaINominati(m.id, riga.testo, perNome);
      })
      .catch(function(e){
        console.warn("fm-orma: il messaggio non è entrato — " + (e && e.message));
      });
  };
}

/* ⭐ le `@` dentro il testo diventano righe di `messaggio_chiamati`.
   ⛔ Si chiama solo chi è DAVVERO nell'orma: `perNome` viene da
      `orma_persone`, e un nome che non sta lì non produce nessuna riga. */
function chiamaINominati(messaggioId, testo, perNome){
  var visti = {}, righe = [];
  (String(testo || "").match(/@[A-Za-zÀ-ſ]+/g) || []).forEach(function(t){
    var n = t.slice(1);
    var pid = perNome && perNome[n];
    if(!pid || visti[pid]) return;
    visti[pid] = 1;
    righe.push({ messaggio_id: messaggioId, persona_id: pid });
  });
  if(!righe.length) return;
  db.from("messaggio_chiamati").insert(righe)
    .then(function(r){
      if(r && r.error)
        console.warn("fm-orma: i chiamati non sono entrati — " + r.error.message);
    })
    .catch(function(e){
      console.warn("fm-orma: i chiamati non sono entrati — " + (e && e.message));
    });
}

/* ── ② non c'è, o non è tua: LA STESSA PAGINA ──
   ⛔ Non si dice quale delle due, mai. Se le due risposte fossero diverse,
      questo indirizzo diventerebbe il modo di scoprire quali orme esistono. */
function ormaNonCe(){
  var t = document.getElementById("orma-titolo");
  var s = document.getElementById("orma-sotto");
  var corpo = document.getElementById("orma-corpo");
  if(t) t.textContent = "Benvenuto su Felicitas";
  if(s) s.textContent = "";
  if(!corpo) return;
  corpo.innerHTML = '<p>'
    + 'torna a casa per tracciare le tue orme e conoscere il tracciato della comunità eterna'
    + '</p>';
  var b = document.createElement("button");
  b.className = "mini";
  b.style.marginTop = "1rem";
  b.textContent = "Torna a casa";
  b.addEventListener("click", function(){ vai("spazio"); });
  corpo.appendChild(b);
}

/* ── ③ la porta, per chi non è entrato ──
   ⭐ Decisione di Gab: chi ritira il consenso chiude la SUA porta senza
      toccare le altre. Quindi la porta vera non è questo indirizzo — è il
      codice che ogni riga di `orma_persone` avrà, uno per persona.
   ⭐ QUEL CODICE ADESSO ESISTE: è `orma_persone.codice`, e si arriva
      con `?c=`. Chi ha il codice non passa mai di qui — legge l'orma
      da fuori. Questa porta resta per chi apre un `?o=` nudo senza
      essere entrato: dopo il Nexus si torna a QUESTO indirizzo, e
      l'orma si apre se il database dice che è tua.
   ⛔ Nessuna parola su cosa c'è dentro: da fuori non si sa nemmeno se
      quest'orma esiste, e la porta non deve dirlo. */
function ormaPorta(id){
  var t = document.getElementById("orma-titolo");
  var s = document.getElementById("orma-sotto");
  var corpo = document.getElementById("orma-corpo");
  if(t) t.textContent = "Benvenuto";
  if(s) s.textContent = "";
  if(!corpo) return;

  corpo.innerHTML = '<p>'
    + 'stai per sperimentare come comunichiamo su FelicitasMundi'
    + '</p>';

  var dove = document.createElement("div");
  dove.className = "orma-porta";
  var a = document.createElement("a");
  /* la veste sta in .orma-porta a, qui sopra */
  a.textContent = "Entra";
  /* il ritorno: accesso.html accetta solo le pagine di questa cartella, e
     `spazio-vivo.html?o=<id>` le passa — la prova è sul percorso, non
     sulla coda. Dopo il Nexus si riapre quest'orma. */
  var qui = "spazio-vivo.html?o=" + encodeURIComponent(id);
  a.href = "accesso.html?torna=" + encodeURIComponent(qui);
  dove.appendChild(a);
  corpo.appendChild(dove);
}
