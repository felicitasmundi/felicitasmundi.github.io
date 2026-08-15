/* ════════════════════════════════════════════════════════════════
   Comunità Eterna FelicitasMundi · I CAMPI IN PIÙ DELLA PAGINA

   Si aggiunge a fm-pagina.js senza toccarlo: va caricato DOPO di lui.

   ⭐ Fa TRE cose, e nessuna è una correzione al disegno di Design:

      ① il velo d'attesa — la rete che respira mentre i dati arrivano
      ② l'indirizzo che resta scritto, così una pagina si può mandare
      ③ la seconda lettura — i campi che fm-pagina.js non chiede:
         domande · testo lungo · note · biografia · ritratto · video
         quadranti · occhielli di sezione

   ⛔ Tutte le toppe alla forma sono state tolte il 15/8/2026: quelle
      le fa il modello. Se una cosa non si vede come deve, si corregge
      LÌ, non qui.

   ⛔ Niente involucro (function(){ … })(): il guscio mette tutto in
      comune e questo file legge da lì.

   Gli agganci del modello che questo file usa:
      [data-quad-voce] · [data-occhiello-sez] · [data-domanda]
      [data-nota="domande"] · [data-nota="bio"] · [data-ritratto]
      [data-bio-testo] · [data-nome-prod] · [data-dati-prod]
      [data-video] · [data-video-dove] · [data-scheda]
   ════════════════════════════════════════════════════════════════ */


/* ══ ① IL VELO D'ATTESA ════════════════════════════════════════ */

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

function paginaSvela(pag){
  if(!pag) return;
  pag.style.opacity = "1";
  var madre = pag.parentNode;
  var v = madre && madre.querySelector("[data-attesa-rete]");
  if(v && v.spegni) v.spegni();
}

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


/* ══ ② LA SECONDA LETTURA ══════════════════════════════════════ */

var paginaRiempiPrima = paginaRiempi;

paginaRiempi = function(pag, d){
  paginaRiempiPrima(pag, d);
  paginaInPiu(pag, d);
};

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

    /* ─ il racconto: fm-pagina.js riempie solo il primo capoverso ─ */
    var capiRac = qq("[data-racconto]");
    if(capiRac.length && d.racconto){
      var capoR = String(d.racconto).split(/\n\s*\n/)
        .filter(function(r){ return r.trim(); });
      capiRac.forEach(function(e, i){
        if(capoR[i]){ e.textContent = capoR[i].trim(); e.removeAttribute("hidden"); }
        else e.setAttribute("hidden", "");
      });
      if(capoR.length > capiRac.length)
        capiRac[capiRac.length-1].textContent =
          capoR.slice(capiRac.length-1).join(" ");
    }

    /* ─ il testo lungo e le due note ─────────────────────────── */
    paginaPosa(schede, "testo_lungo", x.testo_lungo);
    paginaScrivi(q("[data-nota='domande']"), x.nota);
    paginaScrivi(q("[data-nota='bio']"), null);

    /* ─ le domande: una riga per capoverso ───────────────────── */
    var stampo = q("[data-domanda]");
    if(stampo){
      var dove = stampo.parentNode;
      qq("[data-domanda]").forEach(function(e){
        if(e !== stampo) e.parentNode.removeChild(e);
      });
      if(x.domande){
        var righe = String(x.domande).split("\n")
          .filter(function(r){ return r.trim(); });
        righe.forEach(function(testo, i){
          var e = (i === 0) ? stampo : stampo.cloneNode(true);
          var dentro = e.querySelector("span, b, i") || e;
          dentro.textContent = testo.trim();
          e.removeAttribute("hidden");
          if(i > 0) dove.appendChild(e);
        });
      } else {
        var sd = stampo.closest ? stampo.closest("[data-scheda]") : null;
        if(sd) sd.setAttribute("hidden", "");
      }
    }

    /* ─ il ritratto e la biografia ───────────────────────────── */
    var rit = q("[data-ritratto]");
    if(rit){
      if(x.foto_autore){
        rit.innerHTML = '<img src="' + paginaSalva(x.foto_autore) +
          '" alt="" style="display:block;width:100%;height:100%;' +
          'object-fit:cover;border-radius:inherit">';
        rit.removeAttribute("hidden");
      } else rit.setAttribute("hidden", "");
    }

    var capiBio = qq("[data-bio-testo]");
    if(capiBio.length){
      if(x.biografia){
        var capi = String(x.biografia).split(/\n\s*\n/)
          .filter(function(r){ return r.trim(); });
        capiBio.forEach(function(e, i){
          if(capi[i]){ e.textContent = capi[i].trim(); e.removeAttribute("hidden"); }
          else e.setAttribute("hidden", "");
        });
        if(capi.length > capiBio.length)
          capiBio[capiBio.length-1].textContent =
            capi.slice(capiBio.length-1).join(" ");
      } else {
        capiBio.forEach(function(e){ e.setAttribute("hidden", ""); });
      }
    }

    /* ⛔ fm-pagina.js nasconde [data-bio] — la griglia intera, ritratto
       e testi — perché «biografia» non è fra i campi che chiede.
       Qui si riapre: il campo c'è, e si nasconde solo il ritratto. */
    var grigliaBio = q("[data-bio]");
    if(grigliaBio && x.biografia){
      grigliaBio.removeAttribute("hidden");
      var sb2 = paginaCerca(schede, "bio");
      if(sb2) sb2.removeAttribute("hidden");
    }

    /* ─ il nome e i dati sopra il prezzo ─────────────────────── */
    paginaScrivi(q("[data-nome-prod]"), d.nome);
    paginaScrivi(q("[data-dati-prod]"),
      [d.autore, d.editore, d.formato]
        .filter(function(v){ return v; }).join(" · "));
    paginaScrivi(q("[data-nota-prezzo]"), null);

    /* ─ il video ─────────────────────────────────────────────── */
    var vid = q("[data-video]");
    if(vid){
      if(x.video_url){
        var a = (vid.tagName === "A") ? vid : (vid.querySelector("a") || vid);
        a.setAttribute("href", x.video_url);

        var idv = (String(x.video_url).match(/[?&]v=([A-Za-z0-9_-]{6,})/) || [])[1];
        if(idv){
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
        paginaScrivi(q("[data-video-dove]"), x.video_titolo || "guarda su YouTube");
        var att = vid.querySelector("[data-attesa]");
        if(att) att.setAttribute("hidden", "");
        vid.removeAttribute("hidden");
      } else {
        vid.setAttribute("hidden", "");
      }
    }

    /* ─ i cinque quadranti: quattro fissi, il primo dal contenuto ─ */
    var voci = qq("[data-quad-voce]");
    if(voci.length){
      var nomi = [ x.quadrante_uno || d.nome, "Ordina", "Chi scrive",
                   "Collegamenti", "Condividi" ];
      voci.forEach(function(e, i){
        if(nomi[i]){ e.textContent = nomi[i]; e.removeAttribute("hidden"); }
      });
      if(!(d.si_compra && d.prezzo) && voci[1]) voci[1].setAttribute("hidden", "");
    }

    /* ─ gli occhielli delle sezioni ──────────────────────────── */
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
      var e = q("[data-occhiello-sez='" + k + "']");
      if(!e) return;
      if(occhielli[k]){ e.textContent = occhielli[k]; e.removeAttribute("hidden"); }
      else e.setAttribute("hidden", "");
    });

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

function paginaScrivi(e, testo){
  if(!e) return;
  if(testo === null || testo === undefined || testo === ""){
    e.setAttribute("hidden", ""); return;
  }
  e.textContent = testo;
  e.removeAttribute("hidden");
}

function paginaSalva(s){
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
                  .replace(/"/g, "&quot;");
}


/* ══ ③ L'INDIRIZZO RESTA ═══════════════════════════════════════ */
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

  setTimeout(riscrivi, 400);
  setTimeout(riscrivi, 1400);
})();
