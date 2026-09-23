/* ═══════════════════════════════════════════════════════════════
   FM-ORMA-DENTRO — «dentro un'orma», dalla versione piatta di Design.

   ⭐ Il disegno è tutto di Design: dentro-orma-piatto.html.
      Questo file apre la pagina in una finestra dentro il guscio,
      legge il database e mette i dati nei buchi.

   COSA C'È: l'orma e chi l'ha aperta · chi c'è dentro · le figlie,
   e chi ha preso ognuna · la conversazione · gli allegati.
   I GESTI: prendo · lascio · chiudo colle ore · chiamo qualcuno ·
   allego un file · scrivo nella conversazione · torno a «La mia orma».

   ⛔ LA VETRINA NON È IN QUESTO GIRO: sabato non si vende niente, ed è
      la parte più grossa. La sua parte di pagina resta com'è.
   ⭐ La vetrina si vede solo a chi può pubblicare (fm_puo_pubblicare):
      l'interruttore sta sulla sola vetrina, spostato da Design il 23.
   ⭐ GLI ARGOMENTI: si ricavano dai messaggi, raccogliendo quelli che
      portano lo stesso titolo. Toccarne uno porta al suo primo messaggio;
      rinominarlo riscrive tutti i messaggi che lo portano
      (fm_rinomina_argomento — ⚠️ scritto, da lanciare).

   ⚠️ DUE GESTI ASPETTANO UNA RISPOSTA:
      · «Apri un'orma dentro questa» — da dove nasce una figlia lo dice il
        GUSCIO. Oggi prova SpazioVivo.nuovaOrma(madre), poi il Megafono.
      · «togli» su chi è stato chiamato — il gesto nel database non c'è:
        va chiesto al DATABASE.

   Vuole:   fm-piatto.js prima · `db` (Supabase) · `vai`
   Espone:  SpazioVivo.ormaDentro(dove, idOrma)
   ═══════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  var INDIRIZZO = "APP.FELICITASMUNDI/piatti/dentro-orma-piatto.html";
  var MESI = ["gennaio","febbraio","marzo","aprile","maggio","giugno","luglio",
              "agosto","settembre","ottobre","novembre","dicembre"];
  var TETTO_MB = 25, TETTO_FILE = 10;

  var F = function () { return window.FMPiatto; };

  function giornoMese(d) {
    if (!d) return "";
    var x = new Date(d);
    return isNaN(x) ? "" : x.getDate() + " " + MESI[x.getMonth()];
  }
  function ora(d) {
    if (!d) return "";
    var x = new Date(d);
    return isNaN(x) ? "" :
      String(x.getHours()).padStart(2, "0") + ":" + String(x.getMinutes()).padStart(2, "0");
  }
  /* ⭐ il Megafono scrive il testo e non il titolo: dove il titolo manca,
     si vede l'inizio del testo — la prima riga, al massimo 70 caratteri */
  function titolo(o) {
    if (o && o.titolo) return o.titolo;
    var s = String((o && o.contenuto) || "").trim().split("\n")[0];
    return s.length > 70 ? s.slice(0, 68).trim() + "\u2026" : s;
  }

  function stadio(s) {
    return s === "sviluppato" ? "chiuso" : s === "in_avanzamento" ? "in corso" : "in coda";
  }
  /* ⭐ solo il numero: la parola «ore» la scrive già il disegno */
  function ore(n) {
    if (n === null || n === undefined || n === "") return "";
    return String(n).replace(".", ",");
  }

  /* ── leggere ───────────────────────────────────────────────────── */
  async function leggi(id) {
    var d = { orma: null, autore: null, dentro: [], figlie: [], file: [],
              chat: [], io: null, puoPubblicare: false };
    try {
      var u = await db.auth.getUser();
      d.io = u && u.data && u.data.user && u.data.user.id;

      var o = await db.from("orme")
        .select("id,titolo,sottotitolo,contenuto,tipo,elemento,stadio,luogo," +
                "accaduto_il,inizio_il,entro_il,destinazione,persona_id,quanti_servono")
        .eq("id", id).single();
      if (o.error) return d;
      d.orma = o.data;

      /* chi l'ha aperta */
      if (d.orma.persona_id) {
        var a = await db.from("persone_pubbliche")
          .select("id,nome,foto_url,nome_url").eq("id", d.orma.persona_id).limit(1);
        if (!a.error && a.data && a.data[0]) d.autore = a.data[0];
      }

      /* chi c'è dentro: i lasciati restano come storia, ma non contano */
      var p = await db.from("orma_persone")
        .select("id,persona_id,nome,stato,preso_il,chiuso_il,ore,lasciato_il")
        .eq("orma_id", id);
      d.dentro = p.error ? [] : (p.data || []).filter(function (x) { return !x.lasciato_il; });

      /* le loro foto e i loro profili, per chi ha un account */
      var pid = d.dentro.map(function (x) { return x.persona_id; }).filter(Boolean);
      if (pid.length) {
        var pp = await db.from("persone_pubbliche")
          .select("id,foto_url,nome_url").in("id", pid);
        var per = {};
        (pp.error ? [] : pp.data || []).forEach(function (r) { per[r.id] = r; });
        d.dentro.forEach(function (x) { x.profilo = per[x.persona_id] || null; });
      }

      /* le figlie, in ordine di tempo, e chi ha preso ognuna */
      var f = await db.from("orme")
        .select("id,titolo,contenuto,elemento,stadio,entro_il,luogo,destinazione")
        .eq("orma_madre_id", id).order("momento");
      d.figlie = f.error ? [] : (f.data || []);
      if (d.figlie.length) {
        var fp = await db.from("orma_persone")
          .select("orma_id,nome,persona_id,preso_il,chiuso_il,ore,lasciato_il")
          .in("orma_id", d.figlie.map(function (x) { return x.id; }));
        var pr = {};
        (fp.error ? [] : fp.data || []).forEach(function (r) {
          if (r.lasciato_il || !r.preso_il) return;
          (pr[r.orma_id] = pr[r.orma_id] || []).push(r);
        });
        d.figlie.forEach(function (x) { x.presa = pr[x.id] || []; });
      }

      /* gli allegati, coi permessi che scadono */
      try {
        var fl = await db.rpc("fm_file_orma", { p_orma: id });
        if (!fl.error) d.file = fl.data || [];
      } catch (e) {}

      /* la conversazione */
      var c = await db.from("orma_messaggi")
        .select("id,persona_id,nome,testo,momento,argomento")
        .eq("orma_id", id).order("momento").limit(80);
      d.chat = c.error ? [] : (c.data || []);

      /* chi può pubblicare vede la vetrina */
      try {
        var pb = await db.rpc("fm_puo_pubblicare");
        d.puoPubblicare = !pb.error && pb.data === true;
      } catch (e) {}
    } catch (e) { console.warn("dentro l\u2019orma:", e); }
    return d;
  }

  /* ── dove si va ────────────────────────────────────────────────── */
  function vaiA(rotta, x) { if (typeof window.vai === "function") window.vai(rotta, x); }
  function apri(id) {
    if (window.SpazioVivo && typeof window.SpazioVivo.apriOrma === "function")
      return window.SpazioVivo.apriOrma(id);
    vaiA("orma", { id: id });
  }

  /* ── disegnare ─────────────────────────────────────────────────── */
  function disegna(R, d, id, ricarica) {
    var P = F(), o = d.orma || {};
    var io = d.io;
    var mia = d.dentro.filter(function (x) { return x.persona_id === io && x.preso_il; })[0];
    var presenti = d.dentro.filter(function (x) { return x.preso_il; });
    var oggi = new Date(); oggi.setHours(0, 0, 0, 0);
    var scaduta = o.entro_il && new Date(o.entro_il) < oggi && o.stadio !== "sviluppato";

    /* l'orma */
    P.riempi(R, {
      orma: { titolo: titolo(o), sottotitolo: o.sottotitolo || "",
              contenuto: o.contenuto || "", tipo: o.tipo || "",
              elemento: o.elemento, stadio: stadio(o.stadio),
              luogo: o.luogo || "", accaduto_il: giornoMese(o.accaduto_il),
              inizio_il: o.inizio_il ? giornoMese(o.inizio_il) + ", " + ora(o.inizio_il) : "",
              entro_il: giornoMese(o.entro_il), destinazione: o.destinazione || "",
              quanti_servono: o.quanti_servono ? String(o.quanti_servono) : "" },
      persona: d.autore ? { nome: d.autore.nome || "", foto_url: d.autore.foto_url || "",
                            nome_url: d.autore.nome_url ? "?p=" + d.autore.nome_url : "" }
                        : { nome: "", foto_url: "" },
      conto: { aderenti: String(presenti.length), figlie: String(d.figlie.length) }
    });

    /* la parola del tasto cambia col tipo */
    Array.prototype.forEach.call(R.querySelectorAll('[data-g="prendo"]'), function (b) {
      b.textContent = o.tipo === "obiettivo" ? "me ne occupo io" : "lo prendo";
    });

    P.stato(R, "sono-dentro", !!mia);
    P.stato(R, "non-sono-dentro", !mia && o.stadio !== "sviluppato");
    P.stato(R, "chiusa", o.stadio === "sviluppato");
    P.stato(R, "scaduta", !!scaduta);
    P.stato(R, "posso-pubblicare", !!d.puoPubblicare);

    /* chi c'è dentro */
    P.stampa(R, "dentro", d.dentro, function (c, x) {
      var pr = x.profilo || {};
      P.riempi(c, { dentro: {
        nome: x.nome || "", foto_url: pr.foto_url || "",
        nome_url: pr.nome_url ? "?p=" + pr.nome_url : "",
        preso_il: x.preso_il ? "dal " + giornoMese(x.preso_il) : "",
        ore: ore(x.ore), chiuso_il: x.chiuso_il ? giornoMese(x.chiuso_il) : "" } });
      P.stato(c, "in-attesa", x.stato === "proposto" && !x.preso_il);
    });

    /* le figlie */
    P.stato(R, "senza-figlie", d.figlie.length === 0);
    P.stampa(R, "figlia", d.figlie, function (c, x) {
      P.riempi(c, { figlia: { titolo: titolo(x), contenuto: x.contenuto || "",
        elemento: x.elemento, stadio: stadio(x.stadio), entro_il: giornoMese(x.entro_il),
        luogo: x.luogo || "", destinazione: x.destinazione || "" } });
      P.stato(c, "presa-vuota", !x.presa.length);
      P.stampa(c, "presa", x.presa, function (pc, r) {
        P.riempi(pc, { presa: { nome: r.nome || "", preso_il: giornoMese(r.preso_il),
          ore: ore(r.ore), chiuso_il: r.chiuso_il ? giornoMese(r.chiuso_il) : "" } });
      });
      Array.prototype.forEach.call(c.querySelectorAll("a[href]"), function (a) {
        a.onclick = function (e) { e.preventDefault(); apri(x.id); };
      });
    });

    /* la conversazione: l'argomento si vede solo quando cambia */
    P.stato(R, "senza-chat", d.chat.length === 0);
    var prima = null;
    P.stampa(R, "messaggio", d.chat, function (c, m) {
      var arg = (m.argomento && m.argomento !== prima) ? m.argomento : "";
      if (m.argomento) prima = m.argomento;
      P.riempi(c, { messaggio: { nome: m.nome || "", testo: m.testo || "",
        momento: giornoMese(m.momento) + (m.momento ? ", " + ora(m.momento) : ""),
        argomento: arg } });
    });

    /* gli argomenti: i titoli dei messaggi, nell'ordine in cui nascono */
    var args = [];
    d.chat.forEach(function (m) {
      if (!m.argomento) return;
      var a = args.filter(function (x) { return x.nome === m.argomento; })[0];
      if (a) a.quanti++; else args.push({ nome: m.argomento, quanti: 1 });
    });
    P.stato(R, "senza-argomenti", args.length === 0);
    P.stampa(R, "argomento", args, function (c, a) {
      P.riempi(c, { argomento: { nome: a.nome, quanti: String(a.quanti) } });
      P.gesto(c, "apri-argomento", function () {
        var m = Array.prototype.filter.call(R.querySelectorAll('[data-fm-copia="messaggio"]'),
          function (x) { var e = x.querySelector('[data-c="messaggio.argomento"]');
                         return e && e.textContent === a.nome; })[0];
        if (m && m.scrollIntoView) m.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      P.gesto(c, "rinomina-argomento", async function () {
        var nuovo = prompt("Il nuovo titolo dell\u2019argomento", a.nome);
        if (nuovo === null) return;
        nuovo = nuovo.trim();
        if (!nuovo || nuovo === a.nome) return;
        try {
          var r = await db.rpc("fm_rinomina_argomento",
            { p_orma: id, p_vecchio: a.nome, p_nuovo: nuovo });
          if (r.error) throw r.error;
          await ricarica();
        } catch (e) { console.warn("argomento:", e); }
      });
    });

    /* gli allegati */
    P.stato(R, "senza-file", d.file.length === 0);
    P.stampa(R, "file", d.file, function (c, f) {
      P.riempi(c, { file: { nome: f.nome || "file" } });
      c.style.cursor = "pointer";
      c.onclick = async function (e) {
        if (e) e.preventDefault();
        try {
          var s = await db.storage.from("riservato").createSignedUrl(f.indirizzo, 3600);
          if (s.data && s.data.signedUrl) window.open(s.data.signedUrl, "_blank");
        } catch (err) { console.warn("allegato:", err); }
      };
    });

    /* ─ i gesti ─ */
    function occupato(b, fai) {
      return async function () {
        var era = b.textContent; b.disabled = true; b.textContent = "un momento\u2026";
        try { await fai(); await ricarica(); }
        catch (e) { b.textContent = era; b.disabled = false; console.warn("dentro l\u2019orma:", e); }
      };
    }
    P.gesto(R, "prendo", function (e, b) {
      occupato(b, async function () {
        var r = await db.rpc("fm_prendi_orma", { p_orma: id });
        if (r.error || r.data === false) throw r.error || new Error("non presa");
      })();
    });
    P.gesto(R, "lascio", function (e, b) {
      occupato(b, async function () { await db.rpc("fm_lascia_orma", { p_orma: id }); })();
    });
    /* ⭐ chiudere: le ore si scrivono a mano, nella casella accanto */
    P.gesto(R, "chiudo", function (e, b) {
      var campo = R.querySelector('input[data-c="dentro.ore"]');
      var n = campo ? parseFloat(String(campo.value).replace(",", ".")) : NaN;
      if (isNaN(n) || n < 0) { if (campo) campo.focus(); return; }
      occupato(b, async function () {
        await db.rpc("fm_chiudi_orma", { p_orma: id, p_ore: n });
      })();
    });
    P.gesto(R, "chiamo", async function () {
      try {
        var r = await db.from("contatti").select("nome,persona_id")
          .eq("proprietario_id", io).not("persona_id", "is", null).order("nome");
        var chi = r.error ? [] : (r.data || []);
        if (!chi.length) {
          alert("Nella tua rubrica non c\u2019\u00e8 ancora nessuno con un account. " +
                "Prima passa dall\u2019invito.");
          return;
        }
        var el = chi.map(function (c, k) { return (k + 1) + " \u00b7 " + c.nome; }).join("\n");
        var sc = prompt("Chi chiami?\n\n" + el);
        if (sc === null) return;
        var k = parseInt(sc, 10) - 1;
        if (isNaN(k) || !chi[k]) return;
        await db.rpc("fm_chiama_orma", { p_orma: id, p_persona: chi[k].persona_id });
        await ricarica();
      } catch (e) { console.warn("chiamare:", e); }
    });
    /* ⭐ allegare: bucket riservato, <orma>/<nome> · 25 MB · 10 per orma */
    P.gesto(R, "allega", function () {
      if (d.file.length >= TETTO_FILE) return;
      var i = R.ownerDocument.createElement("input");
      i.type = "file";
      i.onchange = async function () {
        var f = i.files && i.files[0];
        if (!f) return;
        if (f.size > TETTO_MB * 1024 * 1024) { alert("Il file non pu\u00f2 superare i 25 MB."); return; }
        try {
          var su = await db.storage.from("riservato").upload(id + "/" + f.name, f);
          if (su.error) throw su.error;
          await db.from("orma_file").insert({ orma_id: id, nome: f.name, tipo: f.type,
                                              indirizzo: id + "/" + f.name });
          await ricarica();
        } catch (e) { console.warn("allegato:", e); }
      };
      i.click();
    });
    P.gesto(R, "apri-figlia", function () {
      if (window.SpazioVivo && typeof window.SpazioVivo.nuovaOrma === "function")
        return window.SpazioVivo.nuovaOrma(id);
      vaiA("megafono", id);
    });
    P.gesto(R, "torna", function () { vaiA("orme"); });

    /* la conversazione: si scrive e si manda con Invio */
    var scrivi = R.querySelector('input[type="text"]');
    if (scrivi) {
      scrivi.placeholder = "scrivi";
      scrivi.onkeydown = async function (e) {
        if (e.key !== "Enter") return;
        var t = scrivi.value.trim();
        if (!t) return;
        scrivi.value = "";
        try { await db.from("orma_messaggi").insert({ orma_id: id, testo: t }); await ricarica(); }
        catch (err) { console.warn("chat:", err); }
      };
    }
  }

  /* ── la porta ──────────────────────────────────────────────────── */
  async function ormaDentro(dove, id) {
    var box = typeof dove === "string" ? document.querySelector(dove) : dove;
    if (!box || !id || !window.FMPiatto) return;
    var R = await F().monta(box, INDIRIZZO);
    if (R && R.body) R = R.body;           /* monta torna il documento: si lavora sul corpo */
    async function ricarica() { disegna(R, await leggi(id), id, ricarica); }
    await ricarica();
  }

  window.SpazioVivo = window.SpazioVivo || {};
  window.SpazioVivo.ormaDentro = ormaDentro;
  window.FMOrmaDentro = { disegna: disegna };   /* per le prove */
})();
