/* ════════════════════════════════════════════════════════════════
   Comunità Eterna FelicitasMundi · I CAMPI IN PIÙ DELLA PAGINA

   Si aggiunge a fm-pagina.js senza toccarlo: va caricato DOPO di lui.

   Riempie quello che il disegnatore non legge ancora:
      le domande · il testo lungo · la nota · la biografia
      il ritratto dell'autore · la miniatura del video

   ⭐ E tiene l'indirizzo: ?p=pagina&n=... resta scritto, così una
      pagina si può mandare a qualcuno.

   ⛔ Niente involucro (function(){ … })(): il guscio mette tutto in
      comune e questo file legge da lì.
   ════════════════════════════════════════════════════════════════ */


/* ══ IL DISEGNATORE, ALLARGATO ═════════════════════════════════ */

var paginaRiempiPrima = paginaRiempi;

paginaRiempi = function(pag, d){
  paginaRiempiPrima(pag, d);
  paginaInPiu(pag, d);
};


/* ══ I CAMPI IN PIÙ ════════════════════════════════════════════ */

function paginaInPiu(pag, d){
  if(!d || !d.nome_url) return;

  db.from("prodotti")
    .select("domande,testo_lungo,nota,biografia,foto_autore," +
            "video_url,video_titolo,quadrante_uno," +
            "occhiello_corpo,occhiello_come,occhiello_domande")
    .eq("nome_url", d.nome_url).single().then(function(r){

    if(r.error || !r.data) return;
    var x = r.data;

    var q  = function(s){ return pag.querySelector(s); };
    var qq = function(s){ return [].slice.call(pag.querySelectorAll(s)); };
    var schede = qq("[data-scheda]");

    /* ① il testo lungo e la nota */
    paginaPosa(schede, "testo_lungo", x.testo_lungo);
    paginaPosa(schede, "nota", x.nota);

    /* la nota va letta come gli altri testi, non in corsivo piccolo */
    var nt = paginaCerca(schede, "nota");
    if(nt){
      var pn = nt.querySelector("p") || nt;
      pn.style.fontStyle = "normal";
      pn.style.fontSize  = "var(--t-cor)";
      pn.style.color     = "var(--ivory)";
      pn.style.lineHeight= "1.62";
    }

    /* ② le domande — una riga per capoverso */
    if(x.domande){
      var el = paginaCerca(schede, "domande");
      if(el){
        var dove = el.querySelector("ul") || el;
        dove.innerHTML = String(x.domande).split("\n")
          .filter(function(r){ return r.trim(); })
          .map(function(r){
            return '<li style="font-family:\'Cinzel\',serif;' +
              'font-size:var(--t-cor);color:var(--oro-ch);' +
              'padding:0.5rem 0 0.5rem 1.2rem;line-height:1.45;' +
              'list-style:none">' + paginaSalva(r.trim()) + '</li>';
          }).join("");
        el.removeAttribute("hidden");
      }
    }

    /* ③ il ritratto e la biografia */
    var bio = paginaCerca(schede, "bio");
    if(bio){
      if(x.foto_autore){
        var rit = bio.querySelector("[data-im]") ||
                  bio.querySelector("[data-copertina]");
        if(rit) rit.innerHTML = '<img src="' + paginaSalva(x.foto_autore) +
          '" alt="" style="display:block;width:100%;height:100%;' +
          'object-fit:cover;border-radius:inherit">';
      }
      if(x.biografia){
        var pb = bio.querySelector("[data-bio]") || bio.querySelector("p");
        if(pb){ pb.textContent = x.biografia; pb.removeAttribute("hidden"); }
        bio.removeAttribute("hidden");
      } else {
        bio.setAttribute("hidden", "");
      }
    }

    /* ④ il racconto, accanto alla copertina */
    var cop = paginaCerca(schede, "racconto");
    if(cop && d.racconto){
      var testi = [].slice.call(cop.querySelectorAll("p"))
        .filter(function(e){ return !e.closest("ul, ol"); });
      if(testi.length){
        var capo = String(d.racconto).split(/\n\s*\n/)
          .filter(function(r){ return r.trim(); });
        testi.forEach(function(e, i){
          if(capo[i]){ e.textContent = capo[i].trim(); e.removeAttribute("hidden"); }
          else if(i > 0){ e.setAttribute("hidden", ""); }
        });
        /* se i capoversi sono più dei paragrafi, il resto va nell'ultimo */
        if(capo.length > testi.length){
          var ult = testi[testi.length - 1];
          ult.textContent = capo.slice(testi.length - 1).join("\n\n");
        }
      }
    }

    /* ⑤ il nome e i dati sopra il prezzo */
    var pz = paginaCerca(schede, "prezzo");
    if(pz){
      var nm = pz.querySelector("span");
      if(nm){
        var pic = nm.querySelector("small");
        var righe = [d.autore, d.editore, d.formato]
          .filter(function(x){ return x; }).join(" · ");
        if(pic){
          nm.childNodes[0] && (nm.childNodes[0].nodeValue = d.nome + " ");
          pic.textContent = righe;
        }
      }
      var ts = pz.querySelector("[data-tasto]");
      if(ts && (!ts.textContent || ts.textContent.indexOf("attesa") >= 0))
        ts.textContent = "Ordina";
    }

    /* i dati tecnici scendono sotto il prezzo */
    var cop2 = paginaCerca(schede, "racconto");
    var pz2  = paginaCerca(schede, "prezzo");
    if(cop2 && pz2){
      var lista = cop2.querySelector("ul");
      if(lista){
        lista.style.marginTop = "0.9rem";
        lista.style.paddingTop = "0.9rem";
        lista.style.borderTop = "1px solid var(--line)";
        pz2.appendChild(lista);
      }
    }

    /* la biografia a piena larghezza, non in colonna stretta */
    var bio2 = paginaCerca(schede, "bio");
    if(bio2){
      var tx = bio2.querySelector("[data-bio]");
      if(tx){
        var madre = tx.parentNode;
        if(madre && madre !== bio2){
          madre.style.minWidth = "0";
          madre.style.flex = "1 1 100%";
        }
        tx.style.maxWidth = "none";
      }
      var rit2 = bio2.querySelector("[data-im]");
      if(rit2){
        rit2.style.flex = "0 0 7rem";
        rit2.style.height = "7rem";
      }
    }

    /* ⑥ i cinque quadranti — quattro fissi, il primo dal contenuto */
    var barra = pag.querySelector("[data-quad]");
    if(barra){
      var voci = [].slice.call(barra.querySelectorAll("a"));
      var nomi = [ x.quadrante_uno || d.nome, "Ordina", "Chi scrive",
                   "Collegamenti", "Condividi" ];
      voci.forEach(function(a, i){
        if(nomi[i]) a.textContent = nomi[i];
      });
      /* niente prezzo, niente «Ordina» */
      if(!(d.si_compra && d.prezzo) && voci[1]) voci[1].setAttribute("hidden", "");
    }

    /* ⑦ gli occhielli delle sezioni — ognuno cercato per nome */
    var occhielli = {
      corpo:     x.occhiello_corpo,
      come:      x.occhiello_come,
      domande:   x.occhiello_domande,
      prezzo:    "Emporio",
      chi:       "Chi scrive",
      collegato: "A cosa è collegato",
      condividi: "Condividi"
    };
    Object.keys(occhielli).forEach(function(k){
      var e = pag.querySelector("[data-occhiello-sez='" + k + "']");
      if(!e) return;
      if(occhielli[k]){ e.textContent = occhielli[k]; e.removeAttribute("hidden"); }
      else e.setAttribute("hidden", "");
    });

    /* ⑧ il video */
    var vid = q("[data-video]") || paginaCerca(schede, "video");
    if(vid){
      if(x.video_url){
        var a = (vid.tagName === "A") ? vid : vid.querySelector("a");
        if(a) a.setAttribute("href", x.video_url);

        var idv = (String(x.video_url).match(/[?&]v=([A-Za-z0-9_-]{6,})/) || [])[1];
        if(idv && a){
          var im = a.querySelector("img");
          if(!im){
            im = document.createElement("img");
            im.style.cssText = "display:block;width:100%;height:100%;" +
                               "object-fit:cover;border-radius:inherit";
            a.insertBefore(im, a.firstChild);
          }
          im.src = "https://i.ytimg.com/vi/" + idv + "/maxresdefault.jpg";
          im.alt = x.video_titolo || "";
        }
        var sv = (vid.closest ? vid.closest("[data-scheda]") : null);
        if(sv) sv.removeAttribute("hidden");
      } else {
        var sn = (vid.closest ? vid.closest("[data-scheda]") : vid);
        if(sn) sn.setAttribute("hidden", "");
      }
    }
  });
}


/* ══ MINUZIE ═══════════════════════════════════════════════════ */

function paginaCerca(schede, quale){
  for(var i = 0; i < schede.length; i++){
    if(schede[i].getAttribute("data-scheda") === quale) return schede[i];
  }
  return null;
}

function paginaPosa(schede, quale, testo){
  var el = paginaCerca(schede, quale);
  if(!el) return;
  if(testo === null || testo === undefined || testo === ""){
    el.setAttribute("hidden", ""); return;
  }
  var p = el.querySelector("p") || el;
  p.textContent = testo;
  p.removeAttribute("hidden");
  el.removeAttribute("hidden");
}

function paginaSalva(s){
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
                  .replace(/"/g, "&quot;");
}


/* ══ L'INDIRIZZO RESTA ═════════════════════════════════════════ */
/* Una pagina di contenuto si manda a qualcuno: l'indirizzo deve
   restare scritto. Per tornare a casa c'è il tasto nella barra.   */

(function(){
  var m = location.search.match(/[?&]n=([A-Za-z0-9_-]{1,60})/);
  if(!m) return;
  var nome = m[1];

  function riscrivi(){
    if(location.search.indexOf("n=") >= 0) return;
    try{
      history.replaceState({}, "",
        location.origin + location.pathname + "?p=pagina&n=" + nome);
    }catch(e){}
  }

  /* il guscio pulisce l'indirizzo all'avvio: lo si rimette dopo */
  setTimeout(riscrivi, 400);
  setTimeout(riscrivi, 1400);
})();
