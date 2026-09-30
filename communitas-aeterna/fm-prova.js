/* ════════════════════════════════════════════════════════════════
   Comunità Eterna FelicitasMundi · LA STANZA DI PROVA

   Questo file esiste SOLO nella stanza di prova.
   ⛔ Non va mai in linea. `/pubblica` si rifiuta di portarlo.

   Fa tre cose, e nient'altro:

   ① LA FASCIA — in cima, su ogni pagina, sempre. Più il titolo
      della scheda del navigatore e una cornice sul bordo: tre segni,
      così non ci si confonde nemmeno di sfuggita.

   ② IL NOINDEX — i motori di ricerca non raccolgono la prova.

   ③ LO SCUDO — il database è quello vero, uno solo. Quindi qui
      dentro due gesti sono spenti:
        · confermare un movimento di talenti
          ⛔ un movimento confermato non si modifica e non si
             cancella: se partisse per prova, resterebbe per sempre
        · mandare qualcosa a una persona vera
          ⚠️ messaggi, notifiche, richieste, inviti: partiti, sono
             partiti

      ⭐ Tutto il resto funziona davvero: si legge, si naviga, si
         scrivono le proprie orme, si genera il sigillo.

   ⛔ Niente involucro (function(){ … })(): il guscio mette tutto in
      comune e questo file legge da lì. Per non pestare i piedi a
      nessuno, ogni nome qui dentro comincia per `prova`.
   ════════════════════════════════════════════════════════════════ */

"use strict";

/* dentro un telaio (la mappa) la fascia non ci va: lì non si naviga */
var provaIncorniciato = (function(){
  try { return window.top !== window.self; } catch(e){ return true; }
})();

var PROVA_ALTA  = "2.2rem";                 /* quanto è alta la fascia */
var PROVA_SEGNO = "#8E2B1E";                /* il rosso dell'avviso    */
var PROVA_SU    = "#F5F0E6";                /* avorio, come il canone  */


/* ═══ ① LA FASCIA, IL TITOLO, LA CORNICE ═══════════════════════════ */

function provaVeste(){
  if(provaIncorniciato) return;

  var s = document.createElement("style");
  s.id = "prova-veste";
  s.textContent =
    ":root{--prova-alta:" + PROVA_ALTA + "}" +
    "body{padding-top:var(--prova-alta) !important}" +
    /* la barra è fissa a top:0 — la spingo giù della stessa altezza */
    "#barra,.sv-barra{top:var(--prova-alta) !important}" +
    "#apri-barra,#sv-apri-barra{top:calc(0.9rem + var(--prova-alta)) !important}" +
    "#prova-fascia{position:fixed;top:0;left:0;right:0;height:var(--prova-alta);" +
      "z-index:99999;background:" + PROVA_SEGNO + ";color:" + PROVA_SU + ";" +
      "display:flex;align-items:center;justify-content:center;gap:0.6rem;" +
      "font-family:'DM Sans',system-ui,sans-serif;font-size:0.78rem;" +
      "letter-spacing:0.08em;text-transform:uppercase;text-align:center;" +
      "padding:0 0.8rem;box-shadow:0 0.1rem 0.5rem rgba(0,0,0,0.45);" +
      "pointer-events:none;user-select:none}" +
    "#prova-fascia b{font-weight:700;letter-spacing:0.12em}" +
    "#prova-fascia i{font-style:normal;opacity:0.85;letter-spacing:0.05em;" +
      "text-transform:none;font-size:0.72rem}" +
    "#prova-cornice{position:fixed;inset:0;z-index:99998;pointer-events:none;" +
      "border:0.18rem solid " + PROVA_SEGNO + ";" +
      "border-top-width:0}" +
    "#prova-avvisi{position:fixed;top:calc(var(--prova-alta) + 0.7rem);right:0.9rem;" +
      "z-index:99999;display:flex;flex-direction:column;gap:0.4rem;max-width:22rem}" +
    ".prova-avviso{background:" + PROVA_SEGNO + ";color:" + PROVA_SU + ";" +
      "font-family:'DM Sans',system-ui,sans-serif;font-size:0.8rem;line-height:1.4;" +
      "padding:0.6rem 0.8rem;border-radius:0.3rem;" +
      "box-shadow:0 0.2rem 0.8rem rgba(0,0,0,0.5)}" +
    "@media print{#prova-fascia,#prova-cornice,#prova-avvisi{display:none !important}}" +
    "@media (max-width:600px){#prova-fascia{font-size:0.68rem;letter-spacing:0.05em}" +
      "#prova-fascia i{display:none}}";
  document.head.appendChild(s);

  var f = document.createElement("div");
  f.id = "prova-fascia";
  f.innerHTML = "<b>⚠ Stanza di prova — non è in linea</b>" +
                "<i>il database però è quello vero</i>";

  var c = document.createElement("div");
  c.id = "prova-cornice";

  var a = document.createElement("div");
  a.id = "prova-avvisi";

  document.body.appendChild(f);
  document.body.appendChild(c);
  document.body.appendChild(a);
}

/* il titolo della scheda: la fascia si dimentica scendendo, questo no */
function provaTitolo(){
  var t = document.title || "";
  if(t.indexOf("PROVA · ") !== 0) document.title = "PROVA · " + t;
}

/* i motori di ricerca stiano fuori */
function provaNoindex(){
  var m = document.createElement("meta");
  m.name = "robots";
  m.content = "noindex, nofollow, noarchive";
  document.head.appendChild(m);
}

function provaAvvisa(testo){
  var cassetto = document.getElementById("prova-avvisi");
  if(!cassetto){ return; }
  var d = document.createElement("div");
  d.className = "prova-avviso";
  d.textContent = "⛔ " + testo;
  cassetto.appendChild(d);
  setTimeout(function(){ if(d.parentNode) d.parentNode.removeChild(d); }, 7000);
}


/* ═══ ② LO SCUDO ═══════════════════════════════════════════════════ */

/* tavole che arrivano a una persona vera: qui non si scrive */
var PROVA_CHIUSE = [
  "messaggi", "notifiche", "conversazioni", "scambi_richieste",
  "vicinati", "ordini", "inviti", "segnalazioni"
];

/* comandi del database che non si lanciano dalla prova */
var PROVA_COMANDI_NO = /conferm|talent|messagg|notific|invit|vicinat|ordin/i;

var PROVA_DETTO = "nella stanza di prova questo gesto è spento";

/* una risposta finta che si comporta come quella vera: si può
   incatenare .eq().select().single() e finisce in un errore gentile,
   così l'avviso lo dà la pagina stessa e non sembra un guasto */
function provaFermo(tavola, gesto, perche){
  provaAvvisa(perche);
  var esito = {
    data: null, count: null, status: 403, statusText: "prova",
    error: { message: PROVA_DETTO, details: perche,
             hint: "stanza di prova", code: "PROVA_SPENTO" }
  };
  var f = {};
  var incatenabili = ["select","eq","neq","gt","gte","lt","lte","like","ilike",
    "is","in","contains","containedBy","or","not","filter","match","order",
    "limit","range","abortSignal","single","maybeSingle","csv","geojson",
    "explain","rollback","returns","throwOnError","overrideTypes"];
  incatenabili.forEach(function(m){ f[m] = function(){ return f; }; });
  f.then    = function(ok, ko){ return Promise.resolve(esito).then(ok, ko); };
  f.catch   = function(ko){ return Promise.resolve(esito).catch(ko); };
  f.finally = function(fn){ return Promise.resolve(esito).finally(fn); };
  return f;
}

function provaScudo(){
  if(!window.db || !window.db.from) return false;
  if(window.db.__prova) return true;

  var fromVero = window.db.from.bind(window.db);

  window.db.from = function(tavola){
    var q = fromVero(tavola);

    /* ① quello che arriva a una persona vera */
    if(PROVA_CHIUSE.indexOf(tavola) > -1){
      ["insert","update","upsert","delete"].forEach(function(gesto){
        q[gesto] = function(){
          return provaFermo(tavola, gesto,
            "«" + tavola + "» arriva a una persona vera: nella prova non parte.");
        };
      });
      return q;
    }

    /* ② la conferma dei talenti — quella che non si torna indietro.
       La proposta resta viva: scade da sola in mezz'ora e si annulla. */
    if(tavola === "talenti_movimenti"){
      q.delete = function(){
        return provaFermo(tavola, "delete",
          "un movimento di talenti non si cancella: è una regola del database.");
      };
      var updVero = q.update.bind(q);
      q.update = function(dati, opz){
        if(dati && dati.stato === "confermato"){
          return provaFermo(tavola, "conferma",
            "confermare un movimento è per sempre: nella prova è spento.");
        }
        return updVero(dati, opz);
      };
    }

    return q;
  };

  /* ③ i comandi del database, se un giorno ce ne fossero di quelli */
  if(window.db.rpc){
    var rpcVero = window.db.rpc.bind(window.db);
    window.db.rpc = function(nome, dati, opz){
      if(PROVA_COMANDI_NO.test(String(nome || ""))){
        return provaFermo(nome, "rpc",
          "il comando «" + nome + "» non si lancia dalla prova.");
      }
      return rpcVero(nome, dati, opz);
    };
  }

  window.db.__prova = true;
  return true;
}


/* ═══ ③ SI ACCENDE ═════════════════════════════════════════════════ */

function provaAccendi(){
  provaNoindex();
  provaVeste();
  provaTitolo();

  /* il titolo cambia mentre si naviga: lo si rimette ogni volta */
  if(!provaIncorniciato && window.MutationObserver){
    var t = document.querySelector("title");
    if(t) new MutationObserver(provaTitolo).observe(t, { childList: true });
  }
  setInterval(provaTitolo, 2000);

  /* il guscio crea `db` nel suo script: se non c'è ancora, si aspetta */
  if(!provaScudo()){
    var tentativi = 0;
    var attesa = setInterval(function(){
      if(provaScudo() || ++tentativi > 100) clearInterval(attesa);
    }, 100);
  }
}

if(document.readyState === "loading")
  document.addEventListener("DOMContentLoaded", provaAccendi);
else
  provaAccendi();
