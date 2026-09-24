/* ═══════════════════════════════════════════════════════════════
   FM-ACCESSO — l'ingresso, dalla versione piatta di Design.

   ⭐ Disegno di Design: accesso-piatto.html.
   ⭐ Si entra colla mail e un codice di sei cifre. NOME e COGNOME sono
      obbligatori e viaggiano coll'invio del codice: il database li
      raccoglie quando la persona nasce. ⛔ Prima nascevano senza nome.

   L'INVITO: ?invito=<il nome-indirizzo di chi invita>. Si mostra chi ti
   aspetta, e dopo l'ingresso si chiama fm_accetta_invito, che scrive
   chi ti ha invitato e ti mette nella sua rubrica.
   IL RITORNO: ?torna=<dove si era> — dopo l'ingresso si torna lì.

   ⭐ I TRE COLLEGAMENTI del patto portano alle pagine della casa:
      condizioni.html · privacy.html · cookie.html, in una scheda nuova,
      così non si perde quello che si è scritto.

   ⚠️ IL NOME DEL PARAMETRO DI fm_accetta_invito non l'ho verificato:
      qui è p_slug. Se il database lo chiama in un altro modo, è una
      riga sola — la costante INVITO_P qui sotto.

   ⭐ IL PATTO sta FRA l'ingresso e il bivio: si guardano le due colonne
      di `persone` — condizioni_accettate e condizioni_versione — e si
      entra solo se la versione accettata è quella di oggi. Quando la
      versione cambia, tutti riaccettano.
      ⛔ Se la verifica non riesce, NON si entra al buio: si chiede il patto.

   Vuole:   fm-piatto.js prima · `db` (Supabase)
   Espone:  SpazioVivo.accesso(dove)
   ═══════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  var INDIRIZZO = "APP.FELICITASMUNDI/piatti/accesso-piatto.html";
  var INVITO_P = "p_slug";              /* ⚠️ da confermare col database */
  /* ⭐ dopo l'ingresso, se non si torna da nessuna parte:
     chi non ha ancora un talento va alla SOGLIA, non alla home —
     se no si trova una pagina che non gli dice cosa fare. */
  var PATTO_VERSIONE = "2026-09-23";    /* la versione delle condizioni */
  var SOGLIA = "index.html?p=soglia";
  var ORME   = "index.html?p=orme";

  var F = function () { return window.FMPiatto; };

  function param(n) {
    try { return new URLSearchParams(location.search).get(n) || ""; }
    catch (e) { return ""; }
  }
  function vale(R, nome) {
    var el = R.querySelector('[data-c="' + nome + '"]');
    return el ? String(el.value || "").trim() : "";
  }
  function errore(R, t) {
    var el = R.querySelector('[data-stato="errore"]');
    if (el) { el.textContent = t || ""; el.hidden = !t; }
  }

  /* ⭐ dire cosa è successo davvero: «riprova» da solo non aiuta nessuno */
  function perche(err) {
    var m = String((err && (err.message || err.error_description)) || "").toLowerCase();
    var n = (err && err.status) || 0;
    if (n === 429 || m.indexOf("rate limit") >= 0 || m.indexOf("too many") >= 0 ||
        m.indexOf("security purposes") >= 0) {
      /* ⭐ Supabase dice quanti secondi mancano: si riportano */
      var s = m.match(/after (\d+) second/);
      return s ? "Un altro codice fra " + s[1] + " secondi: \u00e8 una pausa di sicurezza."
               : "Aspetta un minuto prima di chiederne un altro.";
    }
    if (m.indexOf("invalid") >= 0 && m.indexOf("email") >= 0)
      return "Quella mail non sembra valida: controllala.";
    if (m.indexOf("signups not allowed") >= 0 || m.indexOf("disabled") >= 0)
      return "Le nuove iscrizioni sono chiuse in questo momento.";
    if (m.indexOf("smtp") >= 0 || m.indexOf("send") >= 0 || m.indexOf("mail") >= 0)
      return "La posta non \u00e8 partita dal nostro lato. Riprova fra qualche minuto.";
    if (!navigator.onLine) return "Il telefono non \u00e8 in rete.";
    return "Il codice non \u00e8 partito" + (m ? " (" + m.slice(0, 80) + ")" : "") + ".";
  }

  /* ⭐ la sessione, se c'è. Chi arriva dal collegamento della mail porta il
     gettone nell'indirizzo: Supabase lo raccoglie, ma non all'istante —
     si guarda due volte, a un quarto di secondo di distanza. */
  async function sessioneViva() {
    for (var i = 0; i < 8; i++) {
      try {
        var s = await db.auth.getSession();
        if (s && s.data && s.data.session) return true;
      } catch (e) {}
      /* se nell'indirizzo non c'è nessun gettone, non c'è niente da aspettare */
      if (i === 0 && !/access_token|[?&]code=|type=magiclink|token_hash/.test(
            location.hash + location.search)) return false;
      await new Promise(function (ok) { setTimeout(ok, 250); });
    }
    return false;
  }

  /* ⭐ perché il codice non torna: le ragioni sono diverse, e si dicono */
  function percheCodice(err) {
    var m = String((err && (err.message || err.error_description)) || "").toLowerCase();
    if (m.indexOf("expired") >= 0)
      return "Quel codice \u00e8 scaduto. Tocca \u00abmandane un altro\u00bb qui sopra.";
    if (m.indexOf("invalid") >= 0 || m.indexOf("not found") >= 0)
      return "Quel codice non vale pi\u00f9: vale solo l\u2019ultimo arrivato. " +
             "Tocca \u00abmandane un altro\u00bb qui sopra e usa quello nuovo.";
    if (m.indexOf("rate") >= 0 || (err && err.status === 429))
      return "Troppi tentativi: aspetta qualche minuto.";
    if (!navigator.onLine) return "Il telefono non \u00e8 in rete.";
    return "Il codice non torna" + (m ? " (" + m.slice(0, 80) + ")" : "") + ".";
  }

  /* il patto: true se è accettato nella versione di oggi.
     ⛔ in caso di dubbio torna false — non si entra al buio. */
  async function pattoFatto() {
    try {
      var u = await db.auth.getUser();
      var id = u && u.data && u.data.user && u.data.user.id;
      if (!id) return false;
      var r = await db.from("persone")
        .select("condizioni_accettate,condizioni_versione").eq("id", id).maybeSingle();
      if (r.error) return false;
      var d = r.data;
      return !!(d && d.condizioni_accettate && d.condizioni_versione === PATTO_VERSIONE);
    } catch (e) { return false; }
  }
  async function accettaPatto() {
    var u = await db.auth.getUser();
    var id = u && u.data && u.data.user && u.data.user.id;
    if (!id) throw new Error("nessuna sessione");
    var r = await db.from("persone").update({
      condizioni_accettate: new Date().toISOString(),
      condizioni_versione: PATTO_VERSIONE
    }).eq("id", id);
    if (r.error) throw r.error;
  }

  /* vero se chi è appena entrato non ha ancora nessun talento */
  async function primaVolta() {
    try {
      var u = await db.auth.getUser();
      var id = u && u.data && u.data.user && u.data.user.id;
      if (!id) return true;
      var r = await db.from("orme").select("id", { count: "exact", head: true })
        .eq("persona_id", id).not("talento_id", "is", null);
      return !r.count;
    } catch (e) { return true; }
  }

  /* dopo il patto: chi non ha talenti va alla soglia */
  async function dentro(R, torna) {
    location.href = torna || (await primaVolta() ? SOGLIA : ORME);
  }

  async function accesso(dove) {
    var box = typeof dove === "string" ? document.querySelector(dove) : dove;
    if (!box || !window.FMPiatto) return;
    var R = await F().monta(box, INDIRIZZO);
    if (R && R.body) R = R.body;
    var P = F();

    var invito = param("invito"), torna = param("torna");

    /* ⛔ il tasto «entra» è type=submit dentro un <form>: il primo clic
       prova a inviare il modulo invece di eseguire il gesto. Si ferma
       l'invio a monte, così il primo clic vale. */
    Array.prototype.forEach.call(R.querySelectorAll("form"), function (f) {
      f.addEventListener("submit", function (e) { e.preventDefault(); });
    });

    /* ⭐ i tre collegamenti del patto: le pagine vere della casa */
    P.riempi(R, { patto: { condizioni: "condizioni.html", privacy: "privacy.html",
                           cookie: "cookie.html" } });
    Array.prototype.forEach.call(
      R.querySelectorAll('[data-c^="patto."]'), function (a) { a.target = "_blank"; });

    /* chi ti ha invitato: il nome si vede anche senza account */
    if (invito) {
      P.stato(R, "da-invito", true);
      try {
        var q = await db.from("persone_pubbliche").select("nome")
          .eq("nome_url", invito).limit(1);
        var chi = (!q.error && q.data && q.data[0] && q.data[0].nome) || "";
        var n = R.querySelector('[data-stato="da-invito"]');
        if (n && chi) n.textContent = chi + " ti aspetta: nome e cognome servono anche a te.";
      } catch (e) {}
    }

    /* ⭐ CHI ARRIVA DAL COLLEGAMENTO DELLA MAIL è già entrato: Supabase
       raccoglie il gettone dall'indirizzo e apre la sessione da sé. La
       pagina non deve rifargli scrivere niente — prosegue il giro.
       ⚠️ La sessione non compare all'istante: si aspetta un momento. */
    var seiGiaDentro = await sessioneViva();
    if (seiGiaDentro) {
      if (invito) {
        try {
          var pi = {}; pi[INVITO_P] = invito;
          await db.rpc("fm_accetta_invito", pi);
        } catch (e3) { console.warn("invito:", e3); }
      }
      if (!(await pattoFatto())) P.stato(R, "patto", true);
      else { await dentro(R, torna); return; }
    }

    /* ── manda il codice ── */
    P.gesto(R, "manda-codice", async function (e, b) {
      var email = vale(R, "accesso.email"),
          nome = vale(R, "persona.nome"),
          cognome = vale(R, "persona.cognome");
      errore(R, "");
      if (!email || email.indexOf("@") < 0) return errore(R, "Serve una mail che funziona.");
      if (!nome) return errore(R, "Serve il nome.");
      if (!cognome) return errore(R, "Serve il cognome.");

      b.disabled = true;
      var era = b.textContent; b.textContent = "un momento\u2026";
      try {
        var r = await db.auth.signInWithOtp({
          email: email,
          options: {
            shouldCreateUser: true,
            data: { nome: nome, cognome: cognome },
            /* ⭐ se qualcuno tocca il collegamento nella mail, torna QUI —
               non alla casa. ⛔ E quel collegamento BRUCIA il codice: è lo
               stesso gettone, si spende una volta sola. */
            emailRedirectTo: location.href
          }
        });
        if (r.error) throw r.error;
        P.riempi(R, { accesso: { email: email } });
        P.stato(R, "codice-mandato", true);
        /* ⭐ il tasto resta, e cambia parola: da qui si chiede un altro codice */
        b.textContent = "mandane un altro";
        var c = R.querySelector('[data-c="accesso.codice"]');
        if (c) { c.value = ""; if (c.focus) c.focus(); }
        errore(R, "");
      } catch (err) {
        errore(R, perche(err));
        console.warn("accesso:", err);
      }
      b.textContent = era; b.disabled = false;
    });

    /* ── il patto: si accetta e si entra ── */
    P.gesto(R, "accetto", async function (e, b) {
      errore(R, "");
      b.disabled = true;
      var era = b.textContent; b.textContent = "un momento\u2026";
      try { await accettaPatto(); await dentro(R, torna); }
      catch (err) {
        errore(R, "Non \u00e8 stato possibile registrare l\u2019accettazione. Riprova.");
        b.textContent = era; b.disabled = false;
      }
    });

    /* ── entra ── */
    P.gesto(R, "entra", async function (e, b) {
      var email = vale(R, "accesso.email"), codice = vale(R, "accesso.codice");
      errore(R, "");
      /* ⭐ il codice incollato si porta dietro spazi e segni: si ripulisce */
      codice = String(codice || "").replace(/[^0-9]/g, "");
      /* ⛔ se la pagina è stata ricaricata, la mail è sparita: il codice
         verrebbe verificato contro nessuno */
      if (!email || email.indexOf("@") < 0)
        return errore(R, "Riscrivi la tua mail qui sopra: serve per riconoscere il codice.");
      if (!/^[0-9]{6}$/.test(codice)) return errore(R, "Il codice \u00e8 di sei cifre.");

      b.disabled = true;
      var era = b.textContent; b.textContent = "un momento\u2026";
      try {
        var r = await db.auth.verifyOtp({ email: email, token: codice, type: "email" });
        if (r.error) throw r.error;
        /* ⭐ il codice è passato (verify 200). Da qui in poi, se qualcosa
           va storto NON è «scaduto»: si mostra l'errore vero, così si vede
           dov'è invece di dare la colpa al codice. */
        if (invito) {
          try {
            var p = {}; p[INVITO_P] = invito;
            await db.rpc("fm_accetta_invito", p);
          } catch (e2) { console.warn("invito:", e2); }
        }
        var haPatto;
        try { haPatto = await pattoFatto(); }
        catch (ep) { errore(R, "dopo l'ingresso, non riesco a leggere il patto (" +
                     String(ep && ep.message || ep).slice(0,90) + ")");
                     b.textContent = era; b.disabled = false; return; }
        if (!haPatto) {
          P.stato(R, "patto", true);
          b.textContent = era; b.disabled = false;
          return;
        }
        try { await dentro(R, torna); }
        catch (ed) { errore(R, "sei entrato, ma non riesco a proseguire (" +
                     String(ed && ed.message || ed).slice(0,90) + ")");
                     b.textContent = era; b.disabled = false; }
      } catch (err) {
        /* solo QUI è davvero il verify del codice */
        errore(R, percheCodice(err));
        console.warn("accesso verify:", err);
        b.textContent = era; b.disabled = false;
      }
    });
  }

  window.SpazioVivo = window.SpazioVivo || {};
  window.SpazioVivo.accesso = accesso;
  window.FMAccesso = { accesso: accesso };
})();
