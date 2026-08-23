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
    +   'si apre a parte</a> mentre si sistema.</p>'

    /* ⭐ LA SALA — la diretta audio, che non passa dalla radio.
       Sentire e' libero: chi non e' entrato entra lo stesso. Il microfono
       lo apre solo chi ha una voce viva in `sala_voci`, e lo dice il
       gettone, non questa pagina. */
    + '<h2 style="margin-top:1.6rem">La sala</h2>'
    + '<p class="sotto">[ in attesa ]</p>'
    + '<div class="cn-stato">'
    +   '<div class="cn-riq"><span class="cn-et">La sala</span>'
    +     '<b id="sa-stato">fuori</b><small id="sa-riga">&nbsp;</small></div>'
    +   '<div class="cn-riq"><span class="cn-et">Chi ascolta</span>'
    +     '<b id="sa-quanti">&mdash;</b><small>persone nella sala adesso</small></div>'
    +   '<div class="cn-riq"><span class="cn-et">Chi parla</span>'
    +     '<b id="sa-voci">&mdash;</b><small id="sa-voci-s">&nbsp;</small></div>'
    + '</div>'
    + '<div class="ord-fai" style="margin-top:0.9rem">'
    +   '<button class="mini" id="sa-entra">Entra e ascolta</button>'
    +   '<button class="mini" id="sa-microfono" hidden>Apri il microfono</button>'
    +   '<button class="mini" id="sa-esci" hidden>Esci dalla sala</button>'
    +   '<div class="mod-esito" id="sa-esito"></div>'
    + '</div>'
    + '<div id="sa-suoni" aria-hidden="true"></div>';

    $("sa-entra").addEventListener("click", salaEntra);
    $("sa-microfono").addEventListener("click", salaMicrofono);
    $("sa-esci").addEventListener("click", salaEsci);

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


  /* ══════════════════════════════════════════════════════════════
     LA SALA — la diretta audio

     Il gettone lo firma la funzione `sala-gettone` di Supabase, che
     guarda chi sei e decide:
       chi non e' entrato   -> sente
       chi e' entrato       -> sente
       chi ha una voce      -> puo' andare in onda

     ⛔ Qui dentro non si decide niente: il permesso viaggia dentro il
        gettone, e il server lo fa rispettare. Nascondere il tasto del
        microfono e' cortesia, non sicurezza.

     ⚠️ Il suono parte solo dopo un tocco: i navigatori non lasciano
        suonare una pagina che nessuno ha toccato. Per questo si entra
        con un tasto, e non da soli.
     ══════════════════════════════════════════════════════════════ */

  var salaStanza = null;      /* la stanza LiveKit, quando si e' dentro */

  function salaDice(testo, male){
    var e = $("sa-esito"); if(!e) return;
    e.className = "mod-esito" + (male ? " err" : "");
    e.textContent = testo || "";
  }

  function salaConta(){
    if(!salaStanza) return;
    var q = $("sa-quanti"), v = $("sa-voci"), vs = $("sa-voci-s");
    /* se stessi compresi: chi c'e' e' chi ascolta */
    var tutti = salaStanza.numParticipants + 1;
    if(q) q.textContent = String(tutti);

    var nomi = [];
    salaStanza.remoteParticipants.forEach(function(p){
      if(p.audioTrackPublications.size > 0) nomi.push(p.name || p.identity);
    });
    if(salaStanza.localParticipant.isMicrophoneEnabled){
      nomi.push(salaStanza.localParticipant.name || "tu");
    }
    if(v)  v.textContent = nomi.length ? String(nomi.length) : "—";
    if(vs) vs.textContent = nomi.length ? nomi.join(" · ") : "nessuno sta parlando";
  }

  function salaEntra(){
    if(typeof LivekitClient === "undefined"){
      salaDice("La sala non si e’ caricata. Ricarica la pagina.", true);
      return;
    }
    salaDice("Un momento…");
    $("sa-entra").disabled = true;

    /* invoke porta da se' il gettone di chi e' entrato, o la chiave
       pubblica di chi non lo e': la funzione riconosce tutti e due */
    db.functions.invoke("sala-gettone").then(function(r){
      if(r.error) throw r.error;
      var d = r.data || {};
      if(!d.gettone) throw new Error("nessun gettone");

      salaStanza = new LivekitClient.Room({ adaptiveStream: true });

      salaStanza.on(LivekitClient.RoomEvent.TrackSubscribed, function(track){
        if(track.kind !== "audio") return;
        var e = track.attach();
        e.autoplay = true;
        $("sa-suoni").appendChild(e);
        salaConta();
      });
      salaStanza.on(LivekitClient.RoomEvent.TrackUnsubscribed, function(track){
        track.detach().forEach(function(e){ e.remove(); });
        salaConta();
      });
      ["ParticipantConnected","ParticipantDisconnected","TrackPublished","TrackUnpublished"]
        .forEach(function(q){ salaStanza.on(LivekitClient.RoomEvent[q], salaConta); });
      salaStanza.on(LivekitClient.RoomEvent.Disconnected, function(){ salaFuori(); });

      return salaStanza.connect(d.dove, d.gettone).then(function(){
        /* il tocco di poco fa e' il permesso che il navigatore aspetta */
        return salaStanza.startAudio().catch(function(){});
      }).then(function(){
        $("sa-stato").textContent = "dentro";
        $("sa-riga").textContent  = d.entrato ? " " : "senza account";
        $("sa-entra").hidden = true;
        $("sa-esci").hidden  = false;
        $("sa-microfono").hidden = !d.parla;   /* cortesia, non sicurezza */
        salaDice("");
        salaConta();
      });
    }).catch(function(e){
      $("sa-entra").disabled = false;
      salaDice("La sala non si apre: " + (e && e.message ? e.message : "—"), true);
    });
  }

  function salaMicrofono(){
    if(!salaStanza) return;
    var acceso = salaStanza.localParticipant.isMicrophoneEnabled;
    salaDice(acceso ? "Chiudo…" : "Apro…");
    salaStanza.localParticipant.setMicrophoneEnabled(!acceso).then(function(){
      $("sa-microfono").textContent = acceso ? "Apri il microfono" : "Chiudi il microfono";
      $("sa-stato").textContent = acceso ? "dentro" : "in onda";
      salaDice("");
      salaConta();
    }).catch(function(e){
      /* il no del navigatore al microfono e' la ragione piu' comune */
      salaDice("Il microfono non si apre: " + (e && e.message ? e.message : "—"), true);
    });
  }

  function salaEsci(){
    if(salaStanza) salaStanza.disconnect();
    salaFuori();
  }

  function salaFuori(){
    salaStanza = null;
    var s = $("sa-suoni"); if(s) s.innerHTML = "";
    if(!$("sa-stato")) return;      /* si e' gia' cambiata stanza */
    $("sa-stato").textContent = "fuori";
    $("sa-riga").textContent  = " ";
    $("sa-quanti").textContent = "—";
    $("sa-voci").textContent   = "—";
    $("sa-voci-s").textContent = " ";
    $("sa-entra").hidden = false;
    $("sa-entra").disabled = false;
    $("sa-esci").hidden = true;
    $("sa-microfono").hidden = true;
    $("sa-microfono").textContent = "Apri il microfono";
  }
