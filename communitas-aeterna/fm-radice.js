/* ═══════════════════════════════════════════════════════════════
   Comunità Eterna FelicitasMundi · L'ORMA RADICE — il talento scelto

   Scegliere il talento e far nascere l'orma radice sono LO STESSO
   GESTO, non due. Il pezzo dei talenti (già nel guscio) chiude il
   suo tasto su `window.SpazioVivo.apriLeMieOrme(scelti)`: questo
   file è quel gancio. Per ogni talento scelto nasce un'orma con
   tipo `talento_radice`, e da lì si va a «La mia orma».

   ⭐ DA OSPITE IL GESTO PASSA LA PORTA. Il percorso è: si sceglie,
      si entra, e la scelta si scrive. Niente localStorage: la
      scelta viaggia nell'indirizzo — `?scelta=<nomi>` — come già
      fa `?o=` per una sola orma. Al ritorno da accesso.html questo
      file rilegge il parametro e completa il gesto.

   ⭐ PRIMA DI SCRIVERE SI GUARDA COSA C'È GIÀ. Un ricaricamento con
      `?scelta=` ancora in barra rifarebbe il gesto: si leggono le
      radici esistenti e si scrivono solo quelle che mancano. Un
      talento ha UNA radice, mai due.

   ⚠️ IL TIPO `talento_radice` LO STA VERSANDO IL TERMINALE ②
      insieme agli 81 talenti. Finché non è nell'enum, il database
      rifiuta la scrittura: l'errore va in console, non a schermo,
      e il gesto si riprova quando il ② ha finito.

   ⭐ IL COLLEGAMENTO HA I SUOI NOMI — dal ②, 2 settembre 2026:
      la colonna è `orme.talento_id`, il segno della radice è
      `talento_id is not null`, e l'unicità sta su
      (persona_id, talento_id): una radice per talento, e una
      persona ne ha quante sono i suoi talenti. Gli id si pescano
      da `talenti` coi nomi scelti; un nome che la tavola non
      conosce non diventa niente — lo si dice in console.

   ⭐ L'ORMA RADICE NASCE PUBBLICA — deciso e versato il 2 settembre
      2026. Lo scopo dichiarato da Gab è dare visibilità a ogni
      talento, e i simboli sono lo spazio di connessione pubblica:
      chi tocca un segno deve vedere chi c'è. Se le radici
      nascessero `solo_me`, non ci sarebbe mai nessuno da vedere.
      ⛔ Vale SOLO per la radice: le orme figlie nascono come
         sempre, `solo_me` di partenza. Questo file ne scrive una
         sola specie, e la scrive aperta.

   ⛔ Niente involucro (function(){ … })(): il guscio mette tutto
      in comune e questo file legge da lì.
   ═══════════════════════════════════════════════════════════════ */

"use strict";

/* ── la scelta che ha passato la porta: `?scelta=<nome|nome|…>` ──
   Si legge subito, al carico: più tardi il guscio riscrive la barra
   degli indirizzi e il parametro non ci sarebbe più. */
var radiceChiesta = null;
try{
  var radiceQ = new URLSearchParams(location.search).get("scelta");
  if(radiceQ) radiceChiesta = radiceQ.split("|").filter(Boolean);
}catch(e){}

/* la briglia sul doppio gesto: un click impaziente non scrive due volte */
var radiceInCorso = false;

/* ── il gancio che il pezzo dei talenti chiama sul tasto «vai» ── */
window.SpazioVivo = window.SpazioVivo || {};
window.SpazioVivo.apriLeMieOrme = function(scelti){
  var nomi = (scelti || []).filter(Boolean);
  if(!nomi.length) return;

  /* da fuori: la scelta va nell'indirizzo e si passa dalla porta.
     accesso.html prova il percorso, non la coda: spazio-vivo.html
     coi suoi parametri passa — è la stessa strada di `?o=`. */
  if(typeof ospite !== "undefined" && ospite){
    var qui = "spazio-vivo.html?scelta=" + encodeURIComponent(nomi.join("|"));
    location.href = "accesso.html?torna=" + encodeURIComponent(qui);
    return;
  }

  if(typeof io !== "undefined" && io && io.id) radiciScrivi(nomi, io.id);
};

/* ── il ritorno dalla porta ──
   Al carico, se l'indirizzo porta una scelta, si aspetta che il
   gettone risponda e si completa il gesto. L'id viene dalla
   sessione stessa: non serve aspettare che il guscio posi `io`. */
window.addEventListener("load", function(){
  if(!radiceChiesta || !radiceChiesta.length) return;
  if(typeof db === "undefined" || !db || !db.auth) return;
  db.auth.getSession().then(function(r){
    var s = r && r.data && r.data.session;
    /* senza sessione non si scrive niente: la porta non è stata
       varcata, e la scelta non è di nessuno */
    if(!s || !s.user || !s.user.id) return;
    radiciScrivi(radiceChiesta, s.user.id);
  }).catch(function(){});
});

/* ── il gesto: le radici che mancano nascono, quelle che ci sono restano ── */
function radiciScrivi(nomi, personaId){
  if(radiceInCorso) return;
  radiceInCorso = true;

  /* ⭐ prima gli id: i nomi scelti diventano righe di `talenti`.
     Un nome che la tavola non conosce non diventa niente — in console,
     e non si inventa un id. */
  db.from("talenti")
    .select("id,nome")
    .in("nome", nomi)
    .then(function(rt){
      if(!rt || rt.error){
        radiceNonHaPreso(rt && rt.error && rt.error.message);
        return;
      }
      var trovati = (rt && rt.data) || [];
      if(trovati.length < nomi.length){
        var visti = {};
        trovati.forEach(function(x){ visti[x.nome] = 1; });
        nomi.forEach(function(n){
          if(!visti[n])
            console.warn("fm-radice: talento senza riga in `talenti` — " + n);
        });
      }
      if(!trovati.length){ radiceInCorso = false; return; }

      /* ⛔ poi si guarda cosa c'è: una radice per talento, chiave
         (persona_id, talento_id) — il database ha la stessa unicità,
         e questo controllo le evita anche l'urto. */
      db.from("orme")
        .select("talento_id")
        .eq("persona_id", personaId)
        .not("talento_id", "is", null)
        .then(function(r){
          if(!r || r.error){
            radiceNonHaPreso(r && r.error && r.error.message);
            return;
          }
          var gia = {};
          ((r && r.data) || []).forEach(function(x){
            if(x && x.talento_id) gia[x.talento_id] = 1;
          });
          var nuove = trovati.filter(function(x){ return !gia[x.id]; });

          /* c'erano già tutte: il gesto è compiuto, si va alle orme */
          if(!nuove.length){ radiceCompiuta(); return; }

          var righe = nuove.map(function(x){
            /* ⭐ la radice nasce PUBBLICA — decisione versata il 2
               settembre: i simboli sono lo spazio di connessione
               pubblica, e chi tocca un segno deve vedere chi c'è.
               Solo la radice: le figlie nascono `solo_me` come sempre. */
            return { persona_id: personaId, talento_id: x.id,
                     contenuto: x.nome, tipo: "talento_radice",
                     visibilita: "pubblico" };
          });

          db.from("orme").insert(righe)
            .then(function(q){
              /* qui cade anche l'enum che ancora non conosce il tipo:
                 si dice in console e non si scrive a metà */
              if(q && q.error){ radiceNonHaPreso(q.error.message); return; }
              radiceCompiuta();
            })
            .catch(function(e){ radiceNonHaPreso(e && e.message); });
        })
        .catch(function(e){ radiceNonHaPreso(e && e.message); });
    })
    .catch(function(e){ radiceNonHaPreso(e && e.message); });
}

/* le radici ci sono: si va a «La mia orma», che le mostra */
function radiceCompiuta(){
  radiceInCorso = false;
  radiceChiesta = null;
  if(typeof vai === "function") vai("orme");
}

/* ⛔ gli errori in console, non a schermo: chi legge la pagina non può
   risolverli, chi costruisce sì */
function radiceNonHaPreso(m){
  radiceInCorso = false;
  console.warn("fm-radice: la radice non è nata — " + (m || "senza motivo"));
}
