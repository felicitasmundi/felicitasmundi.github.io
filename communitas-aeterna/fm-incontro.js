/* ═══════════════════════════════════════════════════════════════
   fm-incontro.js
   Comunità Eterna FelicitasMundi · cosa incontro · le porte · gli articoli · il Sentiero · l'Annale
   Staccato da spazio-vivo-nuovo.html (MD5 e82f836b22edb46f485538c9244fef26)
   il 7 agosto 2026. Il codice è identico all'originale, carattere per
   carattere: si carica prima del guscio, che porta le cose comuni.
   ═══════════════════════════════════════════════════════════════ */
"use strict";

  /* ⭐ L'ANNALE NON ABITA PIÙ QUI, e non c'è più nessun iframe.
     Era una stanza col telaio di Annale_FelicitasMundi_dc.html dentro.
     Ora è la SESTA FINESTRA DEL NUCLEO: il disegno sta in fm-annale.js
     e ci si arriva da lì, dietro il controllo del nucleo.
     Con la voce fuori da `stanze`, `?p=annale` non è più una rotta
     conosciuta — apriRotta() la rifiuta e si parte da casa — e il guscio
     non nomina più questa funzione in vai(). Non resta niente da tenere.
     ⛔ Annale_FelicitasMundi_dc.html non si usa più. */

  /* ── cosa incontro: cinque porte, una aperta per volta ── */
  /* ⭐ LE PORTE VENGONO DA `STANZE.incontri`, cioè dalla tavola `stanze`.
     Prima venivano da `BARRA[incontro].sotto`: la vecchia barra annidata,
     che non esiste più. BARRA oggi è un vocabolario piatto — id, nome,
     riga — e quel `.sotto` era `undefined`: `vai("incontro", …)` sollevava
     prima ancora di scrivere una riga, e la stanza non si apriva.
     `elemento` porta il colore E il segno, e arriva dal database: la
     colonna `stanze.elemento` c'è già, ed è la stessa che il seme dichiara.
     ⛔ Nessun nome, nessuna riga e nessun colore scritti qui. */
  function incontro(c, sub){
    var p = (typeof STANZE !== "undefined" && STANZE.incontri) || [];
    c.innerHTML='<div class="occhio">Comunità Eterna FelicitasMundi</div>'
      +'<h1>Cosa incontro</h1>'
      +'<p class="sotto">[ la riga di questa stanza — in attesa ]</p>'
      +'<div class="campo-cerca"><input id="cerca" placeholder="[ la riga della ricerca — in attesa ]"></div>'
      +'<div class="porte" id="porte"></div><div id="dentro-porta"></div>';
    var box=$("porte");
    p.forEach(function(x){
      var b=document.createElement("button");
      b.className="porta";
      /* il segno e il colore li tiene chi ha un elemento. Chi non ce l'ha
         resta una porta a sé: bordo d'oro, e nessun segno inventato */
      if(x.elemento) b.style.setProperty("--pc","var(--"+x.elemento+")");
      b.innerHTML='<span class="sg">'+(x.elemento ? sg(x.elemento) : '')+'</span>'
                 +'<span><b></b><small></small></span>';
      b.querySelector("b").textContent=x.nome;
      b.querySelector("small").textContent=x.riga;
      b.addEventListener("click", function(){ apriPorta(x); });
      box.appendChild(b);
    });
    if(sub){ var q=p.filter(function(x){return x.id===sub;})[0]; if(q) apriPorta(q); }
  }

  /* ── la ricerca: indice analitico e capitoli che si aprono ── */
  function ricerca(d){
    var h = '<h2 style="margin-top:1.4rem">La ricerca</h2>'
          + '<p class="sotto">Le fondamenta su cui il progetto poggia. '
          + 'Il documento vivo si aggiorna quando emergono nuovi riferimenti.</p>'
          + '<div class="idx"><h3>Indice</h3><div id="idx-voci"></div></div>'
          + '<div id="capitoli"></div>';
    d.insertAdjacentHTML("beforeend", h);   /* si aggiunge: non cancella il titolo della porta */

    var idx = $("idx-voci"), box = $("capitoli");
    RICERCA.forEach(function(c, n){
      var a = document.createElement("a");
      a.textContent = (n+1) + " · " + c.t;
      a.addEventListener("click", function(){ apriCap(n, true); });
      idx.appendChild(a);

      var r = document.createElement("div"); r.className = "cap"; r.id = "cap-"+n;
      var t = document.createElement("button"); t.className = "cap-t";
      t.innerHTML = '<span class="cap-f">\u203A</span><span></span>';
      t.querySelector("span:last-child").textContent = c.t;
      var cc = document.createElement("div"); cc.className = "cap-c";
      var dd = document.createElement("div"); dd.className = "dentro";
      c.p.forEach(function(par){
        var p = document.createElement("p"); p.innerHTML = par; dd.appendChild(p);
      });
      cc.appendChild(dd); r.appendChild(t); r.appendChild(cc);
      t.addEventListener("click", function(){ apriCap(n); });
      box.appendChild(r);
    });
  }

  function apriCap(n, vaiLi){
    var r = $("cap-"+n); if(!r) return;
    var era = r.classList.contains("aperto");
    document.querySelectorAll(".cap").forEach(function(x){
      x.classList.remove("aperto"); x.querySelector(".cap-c").style.maxHeight = null;
    });
    if(!era || vaiLi){
      r.classList.add("aperto");
      var cc = r.querySelector(".cap-c");
      cc.style.maxHeight = cc.scrollHeight + "px";
      if(vaiLi) r.scrollIntoView({behavior:"smooth", block:"start"});
    }
  }

  function apriPorta(x){
    var d=$("dentro-porta");
    var suoi = ARTICOLI.filter(function(a){ return a.stanza === x.id; });

    d.innerHTML='<h2 style="margin-top:1.4rem"></h2>'
      + (suoi.length ? '<div class="lettura" id="lettura"></div>'
         : x.id==="scuola" ? ''   /* la Scuola porta le sue tre voci: non aspetta */
         : '<p><span class="segna">questa porta aspetta il suo contenuto</span></p>');
    /* ⭐ `nome` e `elemento`: la forma che STANZE dà a una riga di `stanze` */
    d.querySelector("h2").textContent=x.nome;
    if(x.elemento) d.querySelector("h2").style.color="var(--"+x.elemento+")";

    if(suoi.length){
      var box = $("lettura");
      suoi.forEach(function(a){
        var b = document.createElement("button");
        b.className = "copertina";
        b.style.setProperty("--cc", "var(--" + a.el + ")");
        b.innerHTML =
            '<span class="cp-foto"><img alt="" loading="lazy"></span>'
          + '<span class="cp-tx">'
          +   '<span class="cp-occ"></span>'
          +   '<b></b>'
          +   '<small></small>'
          + '</span>';
        b.querySelector("img").src = a.foto;
        b.querySelector(".cp-occ").textContent = a.occhiello;
        b.querySelector("b").textContent = a.titolo;
        b.querySelector("small").textContent = a.cappello;
        b.addEventListener("click", function(){ apriArticolo(a); });
        box.appendChild(b);
      });
    }

    if(x.id==="scuola"){ porteScuola(d); }
  }

  /* ── le tre voci della Scuola: la stessa forma delle porte, un livello sotto ── */
  var SCUOLA = [
    {id:"formazione", n:"formazione"},
    {id:"maestri",    n:"maestri autentici"},
    {id:"ricerca",    n:"ricerca felicitas"}
  ];

  function porteScuola(d){
    d.insertAdjacentHTML("beforeend",
      '<div class="porte" id="porte-scuola"></div><div id="dentro-scuola"></div>');
    var box = $("porte-scuola");
    SCUOLA.forEach(function(v){
      var b = document.createElement("button");
      b.className = "porta";
      b.style.setProperty("--pc", "var(--etere)");
      /* niente segno: il bordo etere e il titolo dicono già dove sei */
      b.innerHTML = '<span><b></b></span>';
      b.querySelector("b").textContent = v.n;
      b.addEventListener("click", function(){ apriVoceScuola(v); });
      box.appendChild(b);
    });
  }

  function apriVoceScuola(v){
    var d = $("dentro-scuola"); if(!d) return;
    d.innerHTML = "";
    if(v.id === "ricerca"){ ricerca(d); return; }
    d.innerHTML = '<p><span class="segna">[ in attesa ]</span></p>';
  }

  /* ── l'articolo si apre nel quadrante centrale: barra e Megafono restano ── */
  function apriArticolo(a){
    var c = $("centro");
    c.innerHTML =
      '<button class="torna" id="art-torna">&#8592; Torna</button>'
    + '<div class="art-testa">'
    +   '<div class="occhio" style="color:var(--' + a.el + ')">' + a.occhiello + '</div>'
    +   '<h1>' + esc(a.titolo) + '</h1>'
    +   '<p class="sotto">' + esc(a.cappello) + '</p>'
    + '</div>'
    + '<div class="art-guscio"><iframe id="art-f" title="' + esc(a.titolo) + '"></iframe></div>'
    + '<button class="porta-ed grande" id="art-pubblica">Pubblica o stampa</button>';

    $("art-f").src = a.file;
    window.scrollTo(0,0);
    $("art-torna").addEventListener("click", function(){ vai("incontro", a.stanza); });
    $("art-pubblica").addEventListener("click", function(){
      portaInEdizione({ titolo: a.titolo, contenuto: null, orma_id: null, da: "un articolo" });
    });

    /* il Megafono si accorda all'articolo: cosa puoi portare da qui */
    perArticolo(a);
  }

  /* le destinazioni sensate davanti a un articolo */
  function perArticolo(a){
    var quale = permessi.indexOf("ricerca") >= 0 ? "ricerca" : "testimonianza";
    var o = DOVE.filter(function(x){ return x.tipo === quale; })[0]
         || DOVE.filter(function(x){ return x.tipo === "testimonianza"; })[0];
    if(!o) return;
    scelta = o;
    $("s-dove").style.setProperty("--tc","var("+o.c+")");
    $("dove-tx").textContent = o.n;
    $("dove-sg").innerHTML = bollo(o);
    campo.placeholder = (quale === "ricerca")
      ? "Amplia la ricerca, o lascia una testimonianza\u2026"
      : "Condividi una testimonianza\u2026";
  }

  /* Il praticantato ha un file suo: fm-praticantato.js */
