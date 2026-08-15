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

/* ⭐ La pagina nasce VELATA, non da quando arrivano i dati: il
   disegnatore posa prima il modello coi segnaposti e legge dopo,
   e in mezzo la pagina sarebbe già visibile. */
var paginaPrima = pagina;

pagina = function(c, nome){
  paginaPrima(c, nome);
  var pag = c.querySelector(".fm-pag");
  if(pag){
    pag.style.opacity = "0";
    pag.style.transition = "opacity .28s ease";
    paginaAttesa(c);
    /* rete lenta o lettura fallita: si vede comunque */
    setTimeout(function(){ paginaSvela(pag); }, 3000);
  }
};


/* ══ L'ATTESA — la rete che respira mentre i dati arrivano ═════ */

function paginaAttesa(c){
  if(c.querySelector("[data-attesa-rete]")) return;

  var v = document.createElement("div");
  v.setAttribute("data-attesa-rete", "1");
  v.style.cssText = "position:absolute;inset:0;z-index:5;pointer-events:none;" +
    "transition:opacity .4s ease";
  if(getComputedStyle(c).position === "static") c.style.position = "relative";

  var cv = document.createElement("canvas");
  cv.style.cssText = "width:100%;height:100%;display:block";
  v.appendChild(cv);
  c.appendChild(v);

  var cx = cv.getContext("2d"), W = 0, H = 0, punti = [], t = 0, vivo = true;
  var fermo = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function misura(){
    var r = c.getBoundingClientRect();
    var d = window.devicePixelRatio || 1;
    W = r.width; H = Math.min(r.height, window.innerHeight);
    cv.width = W * d; cv.height = H * d;
    cx.setTransform(d, 0, 0, d, 0, 0);
    punti = [];
    var quanti = Math.max(18, Math.min(52, Math.round(W * H / 14000)));
    for(var i = 0; i < quanti; i++){
      punti.push({
        x: Math.random()*W, y: Math.random()*H,
        vx: (Math.random()-0.5)*0.13, vy: (Math.random()-0.5)*0.13,
        r: 0.9 + Math.random()*1.4,
        f: 0.4 + Math.random()*0.9,
        s: Math.random()*Math.PI*2
      });
    }
  }

  function disegna(){
    if(!vivo) return;
    t += 0.006;
    cx.clearRect(0, 0, W, H);

    for(var i = 0; i < punti.length; i++){
      var a = punti[i];
      for(var j = i+1; j < punti.length; j++){
        var b = punti[j];
        var dx = a.x-b.x, dy = a.y-b.y, d2 = dx*dx + dy*dy;
        if(d2 < 20000){
          var op = (1 - d2/20000) * 0.26;
          var onda = 0.55 + 0.45*Math.sin(t*1.6 + (a.x+a.y)*0.006);
          cx.strokeStyle = "rgba(200,160,85," + (op*onda).toFixed(3) + ")";
          cx.lineWidth = 0.6;
          cx.beginPath(); cx.moveTo(a.x,a.y); cx.lineTo(b.x,b.y); cx.stroke();
        }
      }
    }

    for(var k = 0; k < punti.length; k++){
      var p = punti[k];
      var battito = 0.5 + 0.5*Math.sin(t*p.f*2 + p.s);
      var rr = p.r * (0.8 + battito*0.5);

      var g = cx.createRadialGradient(p.x,p.y,0,p.x,p.y,rr*5);
      g.addColorStop(0,  "rgba(212,175,106," + (0.45 + battito*0.35).toFixed(3) + ")");
      g.addColorStop(0.4,"rgba(200,160,85,"  + (0.10 + battito*0.08).toFixed(3) + ")");
      g.addColorStop(1,  "rgba(200,160,85,0)");
      cx.fillStyle = g;
      cx.beginPath(); cx.arc(p.x,p.y,rr*5,0,Math.PI*2); cx.fill();

      cx.fillStyle = "rgba(245,240,230," + (0.3 + battito*0.4).toFixed(3) + ")";
      cx.beginPath(); cx.arc(p.x,p.y,rr,0,Math.PI*2); cx.fill();

      if(!fermo){
        p.x += p.vx; p.y += p.vy;
        if(p.x < -20) p.x = W+20; if(p.x > W+20) p.x = -20;
        if(p.y < -20) p.y = H+20; if(p.y > H+20) p.y = -20;
      }
    }
    requestAnimationFrame(disegna);
  }

  misura(); disegna();

  v.spegni = function(){
    v.style.opacity = "0";
    setTimeout(function(){
      vivo = false;
      if(v.parentNode) v.parentNode.removeChild(v);
    }, 420);
  };
}

var paginaRiempiPrima = paginaRiempi;

paginaRiempi = function(pag, d){
  paginaRiempiPrima(pag, d);
  paginaInPiu(pag, d);
};

function paginaSvela(pag){
  if(!pag) return;
  pag.style.opacity = "1";
  var madre = pag.parentNode;
  var v = madre && madre.querySelector("[data-attesa-rete]");
  if(v && v.spegni) v.spegni();
}


/* ══ I CAMPI IN PIÙ ════════════════════════════════════════════ */

function paginaInPiu(pag, d){
  if(!d || !d.nome_url){ paginaSvela(pag); return; }

  db.from("prodotti")
    .select("domande,testo_lungo,nota,biografia,foto_autore," +
            "video_url,video_titolo,quadrante_uno," +
            "occhiello_corpo,occhiello_come,occhiello_domande")
    .eq("nome_url", d.nome_url).single().then(function(r){

    if(r.error || !r.data){ paginaSvela(pag); return; }
    var x = r.data;

    var q  = function(s){ return pag.querySelector(s); };
    var qq = function(s){ return [].slice.call(pag.querySelectorAll(s)); };
    var schede = qq("[data-scheda]");

    /* ① il testo lungo e la nota */
    paginaPosa(schede, "testo_lungo", x.testo_lungo);
    paginaPosa(schede, "nota", x.nota);

    /* la nota vive dentro la biografia: senza testo, sparisce */
    var nota = paginaCerca(schede, "nota");
    if(nota && !x.nota) nota.setAttribute("hidden", "");

    /* ⛔ La scheda «testo_lungo» porta anche data-racconto: senza
       testo_lungo il disegnatore ci riscrive il racconto, e si legge
       due volte. Sparisce lei e il suo occhiello. */
    if(!x.testo_lungo){
      var tl = paginaCerca(schede, "testo_lungo");
      if(tl){
        tl.setAttribute("hidden", "");
        var occ = pag.querySelector("[data-occhiello-sez='come']");
        if(occ) occ.setAttribute("hidden", "");
      }
    }

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

    /* ③ il ritratto e la biografia
       La scheda «bio» è fatta così:
         [data-bio] > div (il ritratto) + div (i testi: due <p> più la nota) */
    var bio = paginaCerca(schede, "bio");
    var dentroBio = bio && bio.querySelector("[data-bio]");
    if(dentroBio){
      var colonne = [].slice.call(dentroBio.children);
      var quadro  = colonne[0];
      var testi   = colonne[1];

      /* il ritratto */
      if(quadro){
        if(x.foto_autore){
          quadro.innerHTML = '<img src="' + paginaSalva(x.foto_autore) +
            '" alt="" style="display:block;width:100%;height:100%;' +
            'object-fit:cover;border-radius:inherit">';
          quadro.style.flex = "0 0 8rem";
          quadro.style.width = "8rem";
          quadro.style.height = "8rem";
          quadro.style.overflow = "hidden";
        } else {
          quadro.setAttribute("hidden", "");
        }
      }

      /* la biografia, a piena larghezza: un capoverso per <p> */
      if(testi){
        testi.style.flex = "1 1 auto";
        testi.style.minWidth = "0";
        testi.style.maxWidth = "none";
        var pp = [].slice.call(testi.querySelectorAll("p"))
          .filter(function(e){ return e.getAttribute("data-scheda") !== "nota"; });
        if(x.biografia && pp.length){
          var capiB = String(x.biografia).split(/\n\s*\n/)
            .filter(function(r){ return r.trim(); });
          if(capiB.length === 1) capiB = [x.biografia];
          pp.forEach(function(e, i){
            if(capiB[i]){ e.textContent = capiB[i].trim(); e.removeAttribute("hidden"); }
            else e.setAttribute("hidden", "");
          });
          if(capiB.length > pp.length)
            pp[pp.length-1].textContent = capiB.slice(pp.length-1).join(" ");
        } else if(pp.length){
          pp.forEach(function(e){ e.setAttribute("hidden", ""); });
        }
      }

      if(dentroBio.style) dentroBio.style.alignItems = "flex-start";
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
      /* il nome sta nel primo <span> che contiene un <small> */
      var nm = null, tutti = [].slice.call(pz.querySelectorAll("span"));
      for(var k = 0; k < tutti.length; k++){
        if(tutti[k].querySelector("small")){ nm = tutti[k]; break; }
      }
      if(nm){
        var pic = nm.querySelector("small");
        var righe = [d.autore, d.editore, d.formato]
          .filter(function(v){ return v; }).join(" · ");
        /* via ogni testo che c'era, poi il nome e il resto sotto */
        [].slice.call(nm.childNodes).forEach(function(nd){
          if(nd.nodeType === 3) nm.removeChild(nd);
        });
        nm.insertBefore(document.createTextNode(d.nome), nm.firstChild);
        if(pic) pic.textContent = righe;
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
        var velo = vid.querySelector("[data-velo]");
        if(velo) velo.parentNode.removeChild(velo);
        vid.removeAttribute("hidden");
      } else {
        vid.setAttribute("hidden", "");
      }
    }

    paginaSvela(pag);
  }, function(){ paginaSvela(pag); });
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
