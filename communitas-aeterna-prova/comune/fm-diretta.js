/* ═══════════════════════════════════════════════════════════════
   FELICITASMUNDI · LA DIRETTA CHE TI SEGUE · comune/fm-diretta.js
   13 ottobre 2026, 20:38 — Gab: «se uno si muove dalla pagina chat, finisce la conversazione.. tienila sempre attiva»;
   20:47: «sopra in alto può attivarsi un play/pausa perché la diretta si continui a sentire, e si possa usare il
   microfono, anche se si esce dalla schermata, o se si va in un'altra finestra».

   Quando entri nella sala (diretta-bozza.html) la sala lascia un segno (localStorage «fm_diretta»: puntata, titolo,
   microfono aperto o chiuso, pausa, quando). Ogni pagina con la riga (fm-riga.js) legge il segno: se c'è, rientra
   nella stessa sala e mostra IN ALTO, nella riga, la pillola «● titolo» con:
     ⏸/▶ (pausa: non senti e il microfono si chiude; play: senti di nuovo) · 🎙 (il microfono, se hai la parola) ·
     🔊 (solo se il navigatore vuole un tocco per far sentire il suono) · ✕ (esci: il segno si spegne).
   Toccando il titolo torni nella sala. Il suono passa dal lettore multimediale del telefono (Media Session):
   play/pausa anche a schermo spento o in un'altra finestra, per quanto il navigatore lo permette.
   Il segno dura 3 ore (la durata del gettone) e si spegne con ✕ o quando chi coordina ti manda fuori.
   Il gettone lo chiede a sala-gettone con il tuo accesso (se c'è in questo navigatore), altrimenti come ospite.
   21:05: la pagina può tornare dalla cache del navigatore (pageshow persisted): allora si riparte da avvia(). */
(function () {
  if (window.FM_DIRETTA) { window.FM_DIRETTA.avvia(); return; }
  var CH = "fm_diretta", FM_URL = "https://gfnveesogkfvkrdudpfg.supabase.co", FM_CHIAVE = "sb_publishable_4_kJlYwWuqsahMBw7Um2mg_lsYH9ogU";
  var LK = "https://cdn.jsdelivr.net/npm/livekit-client@2.22.0/dist/livekit-client.umd.min.js";
  var qui = location.pathname.split("/").pop();
  if (qui === "diretta-bozza.html") return;              /* la sala si governa da sola */
  var stanza = null, lasciando = false, tentativi = 0, parla = false, suoni = [], pill = null, segno = null, cssFatto = false;

  function leggi() { var g = null; try { g = JSON.parse(localStorage.getItem(CH) || "null"); } catch (e) { } if (!g || !g.t || Date.now() - g.t > 3 * 3600 * 1000) { try { localStorage.removeItem(CH); } catch (e) { } return null; } return g; }
  function salva() { try { localStorage.setItem(CH, JSON.stringify(segno)); } catch (e) { } }
  function dove() { return "diretta-bozza.html" + (segno && segno.puntata ? "?puntata=" + encodeURIComponent(segno.puntata) : ""); }
  function $(c) { return pill ? pill.querySelector("." + c) : null; }
  function dice(t) { var a = $("tit"); if (!a) return; a.textContent = t || segno.titolo || "la diretta del villaggio"; a.classList.toggle("esito", !!t); }

  /* avvia(): all'apertura della pagina, e quando torna dalla cache del navigatore — il segno può essere nato dopo */
  window.FM_DIRETTA = { avvia: function () { var g = leggi(); if (!g) return; if (pill && stanza) return; segno = g; if (!pill) costruisci(); lasciando = false; tentativi = 0; mostraPausa(); entra(); } };

  /* la pillola, in alto nella riga (o, senza riga, una striscia fissa in alto) */
  function costruisci() {
    if (!cssFatto) {
      cssFatto = true;
      var css = ".fm-dir{display:flex;align-items:center;gap:6px;min-width:0;margin:0 8px 8px;padding:4px 6px 4px 11px;border-radius:980px;border:1px solid rgba(255,107,107,.45);background:rgba(255,77,77,.1);position:relative}" +
        ".fm-dir.fissa{position:fixed;top:8px;left:12px;right:12px;z-index:40;margin:0;background:rgba(16,19,42,.96);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px)}" +
        ".fm-dir .led{width:7px;height:7px;border-radius:50%;background:#ff4d4d;flex:0 0 auto;animation:fmd-batte 1.4s infinite}" +
        ".fm-dir.pausa .led{animation:none;background:var(--grigio,#9a9aa8)}" +
        "@keyframes fmd-batte{0%,100%{opacity:1}50%{opacity:.3}}" +
        ".fm-dir .tit{flex:1 1 0;min-width:0;text-decoration:none;color:var(--avorio,#f5f0e6);font-family:'Cormorant Garamond',serif;font-size:13.5px;line-height:1.1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}" +
        ".fm-dir .b{flex:0 0 auto;width:26px;height:26px;border-radius:50%;background:transparent;border:1px solid var(--riga,rgba(212,175,106,.18));color:var(--avorio,#f5f0e6);display:flex;align-items:center;justify-content:center;font-size:12px;text-decoration:none;cursor:pointer;font-family:inherit;padding:0}" +
        ".fm-dir .b.on{background:var(--oro,#d4af6a);color:var(--inchiostro,#0a0c1a);border-color:var(--oro,#d4af6a)}" +
        ".fm-dir .b.suono{background:#ff4d4d;border-color:#ff4d4d;color:#fff;animation:fmd-batte 1.4s infinite}" +
        ".fm-dir .b[disabled]{opacity:.35;cursor:default}.fm-dir .b[hidden]{display:none}" +
        ".fm-dir .tit.esito{color:var(--grigio,#9a9aa8);font-size:12.5px}";
      var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
    }
    pill = document.createElement("div"); pill.className = "fm-dir";
    pill.innerHTML = '<span class="led"></span><a class="tit" href="' + dove() + '" title="torna nella sala"></a>' +
      '<button class="b suono" type="button" hidden title="tocca per sentire" aria-label="tocca per sentire">🔊</button>' +
      '<button class="b play" type="button" title="pausa" aria-label="pausa">❚❚</button>' +
      '<button class="b mic" type="button" disabled title="microfono" aria-label="microfono">🎙</button>' +
      '<button class="b esci" type="button" title="esci dalla diretta" aria-label="esci dalla diretta">✕</button>' +
      '<div class="suoni" hidden></div>';
    pill.querySelector(".tit").textContent = segno.titolo || "la diretta del villaggio";
    var capo = document.querySelector(".fm-stanze .capo");
    if (capo && capo.parentNode) { capo.parentNode.insertBefore(pill, capo.nextSibling); }   /* la sua riga, sotto il capo e sopra le stanze */
    else { pill.classList.add("fissa"); document.body.appendChild(pill); }
    $("esci").onclick = function () { spegni(""); };
    $("play").onclick = function () { pausa(!segno.pausa); };
    $("mic").onclick = micTocca;
    $("suono").onclick = function () { if (stanza) stanza.startAudio().then(function () { $("suono").hidden = true; }).catch(function () { }); };
  }

  /* spegnere */
  function spegni(t) {
    try { localStorage.removeItem(CH); } catch (e) { }
    lasciando = true; if (stanza) { try { stanza.disconnect(); } catch (e) { } } stanza = null;
    try { if (navigator.mediaSession) navigator.mediaSession.playbackState = "none"; } catch (e) { }
    var q = pill; if (!q) return;
    if (t) { dice(t); pill = null; setTimeout(function () { q.remove(); }, 1800); } else { pill = null; q.remove(); }
  }

  /* pausa / play: in pausa non senti e il microfono si chiude; la sala resta collegata */
  function mostraPausa() {
    if (!pill) return; var p = !!segno.pausa; pill.classList.toggle("pausa", p);
    $("play").textContent = p ? "▶" : "❚❚"; $("play").title = p ? "riprendi" : "pausa";
    try { if (navigator.mediaSession) navigator.mediaSession.playbackState = p ? "paused" : "playing"; } catch (e) { }
  }
  function pausa(si) {
    segno.pausa = !!si; salva(); mostraPausa();
    suoni.forEach(function (el) { el.muted = !!si; });
    if (stanza) {
      if (si) { if (stanza.localParticipant.isMicrophoneEnabled) stanza.localParticipant.setMicrophoneEnabled(false).then(micStato).catch(function () { }); }
      else { stanza.startAudio().catch(function () { }); if (segno.mic && parla) stanza.localParticipant.setMicrophoneEnabled(true).then(micStato).catch(function () { }); }
    }
  }

  /* il lettore del telefono: play/pausa anche a schermo spento o in un'altra finestra */
  function lettore() {
    try {
      if (!navigator.mediaSession) return;
      navigator.mediaSession.metadata = new MediaMetadata({ title: segno.titolo || "la diretta del villaggio", artist: "FelicitasMundi · la diretta del villaggio", album: "Civiltà Sarda" });
      navigator.mediaSession.setActionHandler("play", function () { pausa(false); });
      navigator.mediaSession.setActionHandler("pause", function () { pausa(true); });
      navigator.mediaSession.setActionHandler("stop", function () { spegni(""); });
      navigator.mediaSession.playbackState = segno.pausa ? "paused" : "playing";
    } catch (e) { }
  }

  /* il microfono */
  function micStato() {
    if (!stanza || !pill) return; var ok = !!(stanza.localParticipant.permissions && stanza.localParticipant.permissions.canPublish);
    $("mic").disabled = !ok; $("mic").classList.toggle("on", ok && stanza.localParticipant.isMicrophoneEnabled);
  }
  function micTocca() {
    if (!stanza) return; var acceso = stanza.localParticipant.isMicrophoneEnabled;
    if (!acceso && segno.pausa) pausa(false);
    stanza.localParticipant.setMicrophoneEnabled(!acceso).then(function () { segno.mic = !acceso; salva(); micStato(); dice(""); })
      .catch(function (e) { dice("Il microfono non si apre: " + (e && e.message ? e.message : "—")); });
  }

  /* entrare (di nuovo) nella sala */
  function accesso() {
    try { var s = JSON.parse(localStorage.getItem("sb-gfnveesogkfvkrdudpfg-auth-token") || "null"); if (s && s.access_token && (!s.expires_at || s.expires_at * 1000 > Date.now() + 15000)) return s.access_token; } catch (e) { }
    return null;
  }
  function entra() {
    if (!pill || stanza) return;
    if (typeof LivekitClient === "undefined") {
      var sc = document.createElement("script"); sc.src = LK; sc.onload = entra; sc.onerror = function () { dice("La sala non si è caricata."); }; document.head.appendChild(sc); return;
    }
    dice("Rientro…");
    var tok = accesso(), corpo = {};
    if (!tok) { try { corpo = JSON.parse(localStorage.getItem("fm_ospite") || "{}") || {}; } catch (e) { } }   /* l'ospite: come si chiama, da dove parla (solo nel gettone) */
    fetch(FM_URL + "/functions/v1/sala-gettone", { method: "POST", headers: { apikey: FM_CHIAVE, Authorization: "Bearer " + (tok || FM_CHIAVE), "Content-Type": "application/json" }, body: JSON.stringify(corpo) })
      .then(function (r) { return r.json(); }).then(function (d) {
        if (!d || !d.gettone) throw new Error((d && d.errore) || "nessun gettone");
        if (!pill) return;
        parla = !!d.parla;
        var sala = new LivekitClient.Room({ adaptiveStream: true }); stanza = sala;
        var E = LivekitClient.RoomEvent;
        sala.on(E.TrackSubscribed, function (track) { if (track.kind !== "audio") return; var el = track.attach(); el.autoplay = true; el.muted = !!segno.pausa; suoni.push(el); if ($("suoni")) $("suoni").appendChild(el); });
        sala.on(E.TrackUnsubscribed, function (track) { track.detach().forEach(function (el) { suoni = suoni.filter(function (x) { return x !== el; }); el.remove(); }); });
        sala.on(E.AudioPlaybackStatusChanged, function () { if ($("suono")) $("suono").hidden = sala.canPlaybackAudio; });
        ["ParticipantPermissionsChanged", "TrackMuted", "TrackUnmuted", "LocalTrackPublished", "LocalTrackUnpublished"].forEach(function (q) { if (E[q]) sala.on(E[q], micStato); });
        sala.on(E.Disconnected, function (perche) {
          if (stanza === sala) stanza = null;
          if (lasciando) return;
          var R = LivekitClient.DisconnectReason || {};
          if (perche === R.PARTICIPANT_REMOVED || perche === R.ROOM_DELETED || perche === R.DUPLICATE_IDENTITY) { spegni("Sei fuori dalla sala."); return; }
          if (tentativi++ < 3) { dice("Rientro…"); setTimeout(entra, 2500); } else dice("La sala non risponde.");
        });
        return sala.connect(d.dove, d.gettone).then(function () {
          tentativi = 0; dice(""); lettore(); mostraPausa();
          return sala.startAudio().then(function () { if ($("suono")) $("suono").hidden = true; }).catch(function () { if ($("suono")) $("suono").hidden = false; });
        }).then(function () {
          micStato();
          if (segno.mic && parla && !segno.pausa) {
            return sala.localParticipant.setMicrophoneEnabled(true).then(micStato).catch(function () { micStato(); dice("Tocca 🎙 per riaprire il microfono"); });
          }
        });
      }).catch(function (e) { stanza = null; dice("La sala non si apre: " + (e && e.message ? e.message : "—")); });
  }

  window.addEventListener("pagehide", function () { lasciando = true; if (stanza) { try { stanza.disconnect(); } catch (e) { } } stanza = null; });
  window.addEventListener("pageshow", function (e) { if (e.persisted) window.FM_DIRETTA.avvia(); });
  window.FM_DIRETTA.avvia();
})();
