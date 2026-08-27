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

   ⚠️ LE REGOLE DI RIGA SU `orma_persone` NON SONO ANCORA IN PIEDI:
      la tavola è accesa e vuota, quindi oggi non legge nessuno. Con
      le regole che ci sono adesso funziona metà — chi ha lasciato
      l'orma la vede, chi è stato nominato no — e la metà che manca
      si accende dal database, senza toccare questo file.

   ══ I TRE STATI ══
     ① sei entrato e l'orma ti arriva ......... l'orma
     ② sei entrato e non arriva ............... la stessa pagina che
        si vede quando l'orma non esiste più. ⛔ Devono essere IDENTICHE:
        due pagine diverse direbbero a chiunque quali id esistono.
     ③ non sei entrato ........................ la porta

   ⛔ LE PAROLE DELLO ② E DELLO ③ SONO DI GAB, e non ci sono ancora:
      stanno come [ in attesa ]. Non se ne inventano altre.

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
        È lì il senso — entri e vedi con chi stai lavorando.
     ⚠️ Finché `orma_persone` non ha le sue regole, questa lettura torna
        vuota per tutti e il riquadro non si disegna. Non è un errore. */
  var h = document.createElement("h2");
  h.style.marginTop = "1.6rem";
  h.textContent = "Chi c'è";
  var box = document.createElement("div");
  box.id = "orma-chi";
  corpo.appendChild(h);
  corpo.appendChild(box);

  db.from("orma_persone")
    .select("nome,stato,persona_id")
    .eq("orma_id", o.id)
    .then(function(r){
      var righe = (r && r.data) || [];
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
      });
    })
    .catch(function(){ box.innerHTML = '<span class="segna">[ in attesa ]</span>'; });
}

/* ── ② non c'è, o non è tua: LA STESSA PAGINA ──
   ⛔ Non si dice quale delle due, mai. Se le due risposte fossero diverse,
      questo indirizzo diventerebbe il modo di scoprire quali orme esistono. */
function ormaNonCe(){
  var t = document.getElementById("orma-titolo");
  var s = document.getElementById("orma-sotto");
  var corpo = document.getElementById("orma-corpo");
  if(t) t.textContent = "[ in attesa ]";
  if(s) s.textContent = "";
  if(!corpo) return;
  corpo.innerHTML = '<p><span class="segna">'
    + '[ in attesa ]'
    + '</span></p>';
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
   ⚠️ Quel codice non esiste ancora. Finché non c'è, da qui si entra e
      basta: dopo il Nexus si torna esattamente a QUESTO indirizzo, e
      l'orma si apre se il database dice che è tua.
   ⛔ Nessuna parola su cosa c'è dentro: da fuori non si sa nemmeno se
      quest'orma esiste, e la porta non deve dirlo. */
function ormaPorta(id){
  var t = document.getElementById("orma-titolo");
  var s = document.getElementById("orma-sotto");
  var corpo = document.getElementById("orma-corpo");
  if(t) t.textContent = "[ in attesa ]";
  if(s) s.textContent = "";
  if(!corpo) return;

  corpo.innerHTML = '<p><span class="segna">'
    + '[ in attesa ]'
    + '</span></p>';

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
