/* ═══════════════════════════════════════════════════════════════
   FM-EVENTO — la pagina pubblica di un evento, dalla versione piatta.

   ⭐ Il disegno è tutto di Design: evento-pubblico-piatto.html.
      Si apre SENZA account: è uno dei quattro spiragli del muro
      (?p=evento&e=<id>). Chi arriva da un invito o da un QR la vede.

   CHI VEDE COSA — decisioni di Gab:
     · chi organizza si vede anche da fuori
     · chi ha aderito: DA FUORI solo il numero, niente volti
       (fm_orma_dentro_conta); CON L'ACCOUNT i volti
     · il numero non promette quanti verranno: dice quanti sono
       entrati — «Chi ha aderito all'evento»

   IL TASTO «ci sarò»:
     · senza account → accesso.html?torna=… e poi si torna qui
     · con l'account → fm_prendi_orma, e si entra nell'orma della festa
     · già dentro → si entra nell'orma

   ⚠️ ASPETTANO:
     · il COGNOME di chi organizza: la vista delle persone non lo porta
       ancora (arriva col revoke). Resta vuoto.
     · «il gruppo» sotto chi organizza: la pagina del gruppo non esiste.
       Resta vuoto.
     · ✅ le quattro frasi degli stati sono quelle di Design senza le quadre:
       approvate da Gab il 23 settembre.

   Vuole:   fm-piatto.js prima · `db` (Supabase) · `vai`
   Espone:  SpazioVivo.evento(dove, idEvento)
   ═══════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  var INDIRIZZO = "APP.FELICITASMUNDI/piatti/evento-pubblico-piatto.html";
  var GIORNI = ["domenica","lunedì","martedì","mercoledì","giovedì","venerdì","sabato"];
  var MESI = ["gennaio","febbraio","marzo","aprile","maggio","giugno","luglio",
              "agosto","settembre","ottobre","novembre","dicembre"];
  var TIPI = { festa: "festa", luogo: "luogo", mercato: "mercato",
               karma_yoga: "karma yoga", obiettivo: "obiettivo" };

  var F = function () { return window.FMPiatto; };

  /* «sabato 21 novembre, 10:00» — l'ora solo se c'è */
  function quando(o) {
    var s = o.inizio_il || o.accaduto_il;
    if (!s) return "";
    var x = new Date(s);
    if (isNaN(x)) return "";
    var t = GIORNI[x.getDay()] + " " + x.getDate() + " " + MESI[x.getMonth()];
    if (o.inizio_il) t += ", " + String(x.getHours()).padStart(2, "0") + ":" +
                               String(x.getMinutes()).padStart(2, "0");
    return t;
  }
  function passato(o) {
    var s = o.inizio_il || o.accaduto_il;
    if (!s) return false;
    var x = new Date(s), oggi = new Date();
    if (!o.inizio_il) { x.setHours(23, 59, 59); }
    return x < oggi;
  }

  /* ── leggere ───────────────────────────────────────────────────── */
  async function leggi(id) {
    var d = { orma: null, io: null, autore: null, aderenti: 0, volti: [], dentro: false };
    try {
      var u = await db.auth.getUser();
      d.io = u && u.data && u.data.user && u.data.user.id;

      var o = await db.from("orme")
        .select("id,titolo,contenuto,tipo,elemento,luogo,accaduto_il,inizio_il," +
                "immagine_url,persona_id,quanti_servono")
        .eq("id", id).single();
      if (o.error) return d;
      d.orma = o.data;

      /* chi organizza: si vede anche da fuori */
      var a = await db.rpc("fm_orma_autore", { p_orma: id });
      var au = a.error ? null : (Array.isArray(a.data) ? a.data[0] : a.data);
      if (au) d.autore = { id: au.id, nome: au.nome || "" };
      if (d.io && d.autore) {
        var pp = await db.from("persone_pubbliche").select("foto_url,nome_url")
          .eq("id", d.autore.id).limit(1);
        if (!pp.error && pp.data && pp.data[0]) {
          d.autore.foto_url = pp.data[0].foto_url;
          d.autore.nome_url = pp.data[0].nome_url;
        }
      }

      /* quanti hanno aderito: da fuori solo il numero */
      var n = await db.rpc("fm_orma_dentro_conta", { p_orma: id });
      d.aderenti = n.error ? 0 : (Number(n.data) || 0);

      /* i volti, solo a chi ha l'account */
      if (d.io) {
        var op = await db.from("orma_persone").select("persona_id,nome")
          .eq("orma_id", id).not("preso_il", "is", null).is("lasciato_il", null);
        d.volti = op.error ? [] : (op.data || []);
        d.dentro = d.volti.some(function (v) { return v.persona_id === d.io; });
        var pid = d.volti.map(function (v) { return v.persona_id; }).filter(Boolean);
        if (pid.length) {
          var pv = await db.from("persone_pubbliche").select("id,foto_url,nome_url").in("id", pid);
          var per = {};
          (pv.error ? [] : pv.data || []).forEach(function (r) { per[r.id] = r; });
          d.volti.forEach(function (v) { v.profilo = per[v.persona_id] || {}; });
        }
      }
    } catch (e) { console.warn("evento:", e); }
    return d;
  }

  /* ── dove si va ────────────────────────────────────────────────── */
  /* ⚠️ accesso.html conserva «da dove si veniva» e riporta qui */
  function accesso() {
    return "accesso.html?torna=" + encodeURIComponent(location.pathname + location.search);
  }
  function entra(id) {
    if (window.SpazioVivo && typeof window.SpazioVivo.apriOrma === "function")
      return window.SpazioVivo.apriOrma(id);
    if (typeof window.vai === "function") window.vai("orma", { id: id });
  }

  /* ── disegnare ─────────────────────────────────────────────────── */
  function disegna(R, d, id, ricarica) {
    var P = F(), o = d.orma || {}, au = d.autore || {};
    var pieno = !!(o.quanti_servono && d.aderenti >= o.quanti_servono);

    P.riempi(R, {
      orma: { titolo: o.titolo || "", contenuto: o.contenuto || "",
              tipo: TIPI[o.tipo] || o.tipo || "", luogo: o.luogo || "",
              accaduto_il: quando(o), immagine_url: o.immagine_url || "" },
      persona: { nome: au.nome || "", cognome: "", foto_url: au.foto_url || "",
                 nome_url: au.nome_url ? "?p=" + au.nome_url : "" },
      conto: { aderenti: String(d.aderenti) }
    });
    /* «il gruppo»: la pagina del gruppo non c'è ancora */
    Array.prototype.forEach.call(R.querySelectorAll('[data-c="organizzazione"]'),
      function (el) { el.textContent = ""; el.removeAttribute("href"); });

    /* le quattro frasi degli stati: parole di Gab, quelle di Design senza
       le quadre — «nessuno ancora · ci sei anche tu · al completo · è passata».
       ⚠️ Quando Design toglie le quadre dal disegno, questo non fa più niente. */
    ["nessuno", "gia-dentro", "pieno", "passato"].forEach(function (s) {
      Array.prototype.forEach.call(R.querySelectorAll('[data-stato="' + s + '"]'), function (el) {
        if (!el.children.length) el.textContent = el.textContent.replace(/\[\s*([^\]]*?)\s*\]/g, "$1");
      });
    });

    P.stato(R, "senza-foto", !o.immagine_url);
    P.stato(R, "passato", passato(o));
    P.stato(R, "da-fuori", !d.io);
    P.stato(R, "gia-dentro", !!d.dentro);
    P.stato(R, "nessuno", d.aderenti === 0);
    P.stato(R, "pieno", pieno);

    /* i volti: solo con l'account */
    P.stampa(R, "dentro", d.io ? d.volti : [], function (c, v) {
      var pr = v.profilo || {};
      P.riempi(c, { dentro: { nome: v.nome || "", foto_url: pr.foto_url || "",
                              nome_url: pr.nome_url ? "?p=" + pr.nome_url : "" } });
    });

    /* «ci sarò» */
    P.gesto(R, "ci-saro", async function () {
      if (!d.io) { location.href = accesso(); return; }
      if (!d.dentro && !pieno) {
        try {
          var r = await db.rpc("fm_prendi_orma", { p_orma: id });
          if (r.error) throw r.error;
        } catch (e) { console.warn("evento:", e); return; }
      }
      entra(id);
    });
  }

  /* ── la porta ──────────────────────────────────────────────────── */
  async function evento(dove, id) {
    var box = typeof dove === "string" ? document.querySelector(dove) : dove;
    if (!box || !id || !window.FMPiatto) return;
    var R = await F().monta(box, INDIRIZZO);
    if (R && R.body) R = R.body;           /* monta torna il documento: si lavora sul corpo */
    async function ricarica() { disegna(R, await leggi(id), id, ricarica); }
    await ricarica();
  }

  window.SpazioVivo = window.SpazioVivo || {};
  window.SpazioVivo.evento = evento;
  window.FMEvento = { disegna: disegna, accesso: accesso };   /* per le prove */
})();
