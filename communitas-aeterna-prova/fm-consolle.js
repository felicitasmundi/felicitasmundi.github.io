/* ═══════════════════════════════════════════════════════════════
   fm-consolle.js
   Comunità Eterna FelicitasMundi · la consolle radio: lo stato, la coda, il Web DJ
   Staccato da spazio-vivo-nuovo.html (MD5 e82f836b22edb46f485538c9244fef26)
   il 7 agosto 2026. Il codice è identico all'originale, carattere per
   carattere: si carica prima del guscio, che porta le cose comuni.
   ═══════════════════════════════════════════════════════════════ */
"use strict";

  /* ══ LA CONSOLLE RADIO — la regia, e la voce ══
     Legge da AzuraCast quello che accade. Il microfono passa dal Web DJ,
     che è una pagina e vive qui dentro: nessun secondo server.            */
  var FM_RADIO_BASE = "https://radio.felicitasmundi.com";
  var FM_STAZIONE   = "radio_felicitasmundi";
  var FM_WEBDJ      = FM_RADIO_BASE + "/public/" + FM_STAZIONE + "/dj";

  function consolle(c){
    c.innerHTML =
      '<div class="occhio">Come natura crea fm</div>'
    + '<h1>La consolle</h1>'
    + '<p class="sotto">Cosa sta accadendo in onda, e da dove si parla.</p>'

    + '<div class="cn-stato" id="cn-stato">'
    +   '<div class="cn-riq"><span class="cn-et">In onda</span>'
    +     '<b id="cn-brano">&nbsp;</b><small id="cn-chi">&nbsp;</small></div>'
    +   '<div class="cn-riq"><span class="cn-et">Chi ascolta</span>'
    +     '<b id="cn-asc">&mdash;</b><small>persone collegate adesso</small></div>'
    +   '<div class="cn-riq"><span class="cn-et">Chi trasmette</span>'
    +     '<b id="cn-dj">&mdash;</b><small id="cn-dj-s">la playlist, o una voce</small></div>'
    + '</div>'

    + '<h2 style="margin-top:1.6rem">Cosa viene dopo</h2>'
    + '<div class="cn-coda" id="cn-coda"><p class="vuoto">Un momento…</p></div>'

    + '<h2 style="margin-top:1.6rem">Andare in onda</h2>'
    + '<p class="sotto">La consolle di trasmissione vive qui dentro. '
    +   'Serve un account che trasmette: se non ce l\u2019hai, chiedilo al nucleo.</p>'
    + '<div class="cn-dj"><iframe id="cn-webdj" title="La consolle di trasmissione" '
    +   'allow="microphone" src="' + FM_WEBDJ + '"></iframe></div>'
    + '<p class="cn-nota">Se questo riquadro resta vuoto, la consolle non si lascia '
    +   'ancora aprire da qui: <a href="' + FM_WEBDJ + '" target="_blank" rel="noopener">'
    +   'si apre a parte</a> mentre si sistema.</p>';

    leggiConsolle();
    if(window.fmConsolle) clearInterval(window.fmConsolle);
    window.fmConsolle = setInterval(function(){
      if(vista === "consolle") leggiConsolle(); else { clearInterval(window.fmConsolle); }
    }, 10000);
  }

  function leggiConsolle(){
    fetch(FM_ADESSO, {cache:"no-store"})
      .then(function(r){ return r.json(); })
      .then(function(d){
        var np = d && d.now_playing, sg = np && np.song;
        var b=$("cn-brano"), ch=$("cn-chi"), a=$("cn-asc"), dj=$("cn-dj"), ds=$("cn-dj-s");
        if(b)  b.textContent  = (sg && sg.title)  || "\u2014";
        if(ch) ch.textContent = (sg && sg.artist) || "\u00a0";
        if(a)  a.textContent  = (d && d.listeners && d.listeners.current != null)
                                ? d.listeners.current : "\u2014";
        var live = d && d.live;
        if(dj) dj.textContent = (live && live.is_live)
                                ? (live.streamer_name || "una voce dal vivo")
                                : "la playlist";
        if(ds) ds.textContent = (live && live.is_live)
                                ? "in diretta adesso"
                                : "nessuno &egrave; in onda dal vivo";

        var box = $("cn-coda"); if(!box) return;
        var coda = (d && d.playing_next) ? [d.playing_next] : [];
        if(d && d.song_history && d.song_history.length){ /* storia disponibile, non mostrata */ }
        if(!coda.length){ box.innerHTML = '<p class="vuoto">Nessun brano annunciato.</p>'; return; }
        box.innerHTML = "";
        coda.forEach(function(x){
          var s2 = x.song || {};
          var d2 = document.createElement("div");
          d2.className = "stato-riga";
          d2.innerHTML = "<b></b><i></i>";
          d2.querySelector("b").textContent = s2.title || "\u2014";
          d2.querySelector("i").textContent = s2.artist || "";
          box.appendChild(d2);
        });
      })
      .catch(function(){
        var box = $("cn-coda");
        if(box) box.innerHTML = '<p class="vuoto">La radio non risponde in questo momento.</p>';
      });
  }
