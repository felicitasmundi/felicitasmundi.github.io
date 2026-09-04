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
   guscio ha già — .occhio .sotto .orma .meta .vuoto .segna. Il giorno
   che la consegna arriva, questo blocco se ne va con lei.
   ⛔ Misure in rem. Nessun px. */
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
  + ".orma-dove{margin-top:0.6rem;font-family:'DM Sans',sans-serif;"
  +   "font-size:var(--t-eti);color:rgba(245,240,230,0.78)}"
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

  db.from("orme")
    .select("id,titolo,sottotitolo,contenuto,tipo,destinazione,"
          + "momento,accaduto_il,luogo,persona_id")
    .eq("id", id)
    .maybeSingle()
    .then(function(r){
      /* ⛔ l'errore e il vuoto finiscono nello STESSO posto: una regola di
         riga che nasconde una riga non torna come errore, torna come
         niente — e le due risposte non devono distinguersi qui. */
      if(!r || r.error || !r.data){ ormaNonCe(); return; }
      disegnaLOrma(r.data);
    })
    .catch(function(){ ormaNonCe(); });
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

  /* il giorno e l'ora: le stesse due funzioni della stanza delle orme,
     così un'orma dice la stessa data dovunque la si guardi */
  var riga = document.createElement("div");
  riga.className = "orma";
  if(q) riga.style.setProperty("--oc", "var(" + q.c + ")");
  riga.innerHTML = '<div class="meta"></div><p></p>';
  var quando = "";
  if(typeof giornoDi === "function" && typeof nomeDelGiorno === "function")
    quando = nomeDelGiorno(giornoDi(o));
  var ora = new Date(o.momento).toLocaleTimeString("it-IT",
              {hour:"2-digit", minute:"2-digit"});
  riga.querySelector(".meta").textContent =
    (quando ? quando + " · " : "") + ora
    + (q ? " · " + q.n : "") + " → " + (o.destinazione || "—");
  riga.querySelector("p").textContent = o.contenuto || "";
  corpo.appendChild(riga);

  if(o.luogo){
    var d = document.createElement("p");
    d.className = "orma-dove";
    d.textContent = o.luogo;
    corpo.appendChild(d);
  }

  /* ── chi c'è dentro ──
     ⭐ Decisione di Gab: chi è nominato e ha confermato vede TUTTI i nomi.
        È lì il senso — entri e vedi con chi stai lavorando. */
  var h = document.createElement("h2");
  h.style.marginTop = "1.6rem";
  h.textContent = "Chi c'è";
  var box = document.createElement("div");
  box.id = "orma-chi";
  corpo.appendChild(h);
  corpo.appendChild(box);

  /* il campo per nominare: solo su un'orma PROPRIA. Dal `?c=` la
     risposta può non dire di chi è l'orma — allora non compare, e
     niente si rompe. */
  if(typeof io !== "undefined" && io && io.id && o.persona_id === io.id)
    nominaDentroLOrma(o, corpo);

  leggiChiCe(o.id, function(righe){
    versaChiCe(box, righe, o);
    /* ⭐ la chat si apre in ogni caso: «Chi c'è» vuoto non vuol dire
       che non ci siano messaggi — da ospite col codice è la norma. */
    chatDentroLOrma(o.id, corpo, righe);
  });
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

/* i nomi dentro il riquadro — e sulla PROPRIA riga proposta, il tasto */
function versaChiCe(box, righe, o){
  if(!box) return;
  if(!righe.length){
    box.innerHTML = '<span class="segna">[ in attesa ]</span>';
    return;
  }
  box.innerHTML = "";
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
  var box = document.getElementById("orma-chi");
  if(!box) return;
  leggiChiCe(o.id, function(righe){
    versaChiCe(box, righe, o);
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
  h.textContent = "La chat";
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
