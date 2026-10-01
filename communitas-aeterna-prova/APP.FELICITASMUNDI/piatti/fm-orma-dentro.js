/* ═══════════════════════════════════════════════════════════════
   FM-ORMA-DENTRO — «dentro un'orma», dalla versione piatta di Design.

   ⭐ Il disegno è tutto di Design: dentro-orma-piatto.html.
      Questo file apre la pagina in una finestra dentro il guscio,
      legge il database e mette i dati nei buchi.

   COSA C'È: l'orma e chi l'ha aperta · chi c'è dentro · le figlie,
   e chi ha preso ognuna · la conversazione · gli allegati.
   I GESTI: prendo · lascio · chiudo colle ore · chiamo qualcuno ·
   allego un file · scrivo nella conversazione · torno a «La mia orma».

   ⭐ LA VETRINA la scrive fm-vetrina.js, che va caricato dopo questo.

   ⭐ CHI HA APERTO L'ORMA può fare tre cose, e nessun altro: cambiare chi
      la vede · CHIUDERLA, e allora resta scritta ma esce dalla vista ·
      CANCELLARLA davvero — ⛔ e il database rifiuta se qualcun altro ci ha
      lavorato: in quel caso si chiude, non si cancella.
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
                "accaduto_il,inizio_il,entro_il,destinazione,persona_id,quanti_servono," +
                "visibilita,dorme_dal,orma_madre_id")
        .eq("id", id).single();
      if (o.error) return d;
      d.orma = o.data;

      /* ⭐ 1 ottobre, Gab: «mettere felicitas festival dentro micelio» — chi ha aperto l'orma
         può metterla dentro un micelio o un evento suo */
      if (d.io && d.orma.persona_id === d.io) {
        var cand = await db.from("orme").select("id,titolo,contenuto,tipo,talento_id")
          .eq("persona_id", d.io).in("tipo", ["micelio", "festa", "talento_radice"]).neq("id", id)
          .order("momento", { ascending: false }).limit(40);
        d.candidate = cand.error ? [] : (cand.data || []);
        /* il talento si chiama col suo nome, non col testo della radice */
        var tid = d.candidate.map(function (c) { return c.talento_id; }).filter(Boolean);
        if (tid.length) {
          var tn = await db.from("talenti").select("id,nome").in("id", tid);
          var nomi = {}; (tn.error ? [] : tn.data || []).forEach(function (t) { nomi[t.id] = t.nome; });
          d.candidate.forEach(function (c) { if (c.tipo === "talento_radice" && nomi[c.talento_id]) c.titolo = nomi[c.talento_id]; });
        }
      }

      /* ⭐ 1 ottobre, Gab: l'evento dell'11 è «una task dentro festival» — ogni orma dice di chi è figlia */
      if (d.orma.orma_madre_id) {
        var md = await db.from("orme").select("id,titolo,tipo").eq("id", d.orma.orma_madre_id).limit(1);
        if (!md.error && md.data && md.data[0]) d.madre = md.data[0];
      }

      /* chi l'ha aperta */
      if (d.orma.persona_id) {
        var a = await db.from("persone_pubbliche")
          .select("id,nome,foto_url,nome_url").eq("id", d.orma.persona_id).limit(1);
        if (!a.error && a.data && a.data[0]) d.autore = a.data[0];
      }

      /* chi c'è dentro: i lasciati restano come storia, ma non contano */
      /* ⭐ 1 ottobre — il ruolo (coordinatore) nelle squadre; se la colonna non c'è ancora, senza */
      var p = await db.from("orma_persone")
        .select("id,persona_id,nome,stato,preso_il,chiuso_il,ore,lasciato_il,ruolo")
        .eq("orma_id", id);
      if (p.error) p = await db.from("orma_persone")
        .select("id,persona_id,nome,stato,preso_il,chiuso_il,ore,lasciato_il")
        .eq("orma_id", id);
      d.dentro = p.error ? [] : (p.data || []).filter(function (x) { return !x.lasciato_il; });
      d.dentro.sort(function (a, b) { return (b.ruolo === "coordinatore") - (a.ruolo === "coordinatore"); });

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
        .select("id,titolo,contenuto,elemento,stadio,entro_il,luogo,destinazione,tipo,categoria,inizio_il,accaduto_il")
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
      /* ⭐ 1 ottobre 20:44, Gab: «un numerino che indica l'avanzamento della chat» — fin dove ho letto */
      if (d.io) { try { var lt = await db.from("letture").select("letto_fino").eq("orma_id", id).eq("persona_id", d.io).maybeSingle(); d.lettoFino = (lt && lt.data && lt.data.letto_fino) || null; } catch (e) {} }

      try { var mt = await db.rpc("fm_miei_tipi"); d.aperti = (!mt.error && mt.data) || []; } catch (e) { d.aperti = []; }

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
  function disegna(R, d, id, ricarica, stato) {
    var P = F(), o = d.orma || {};
    stato = stato || {};
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
              luogo: o.luogo || "", accaduto_il: o.inizio_il ? "" : giornoMese(o.accaduto_il),
              inizio_il: o.inizio_il ? giornoMese(o.inizio_il) + ", " + ora(o.inizio_il) : "",
              entro_il: giornoMese(o.entro_il), destinazione: o.destinazione || "",
              quanti_servono: o.quanti_servono ? String(o.quanti_servono) : "" },
      persona: d.autore ? { nome: d.autore.nome || "", foto_url: d.autore.foto_url || "",
                            nome_url: d.autore.nome_url ? "?p=" + d.autore.nome_url : "" }
                        : { nome: "", foto_url: "" },
      conto: { aderenti: String(presenti.length), figlie: String(d.figlie.length) },
      madre: { titolo: d.madre ? (d.madre.titolo || "") : "" }
    });
    P.stato(R, "ha-madre", !!d.madre);
    if (d.madre) P.gesto(R, "apri-madre", function () { apri(d.madre.id); });
    /* il colore e il solido seguono l'elemento dell'orma, come nei templi */
    if (R.ownerDocument && R.ownerDocument.defaultView && R.ownerDocument.defaultView.fmVeste)
      R.ownerDocument.defaultView.fmVeste(o.elemento);

    /* ⭐ 1 ottobre 22:57, Gab: «elimina per sempre me ne occupo io dal racconto» — il tasto non c'è più */

    /* ⭐ chi ha aperto l'orma: le tre cose che può fare */
    var padrone = !!(io && o.persona_id === io);
    var dorme = !!o.dorme_dal;
    P.stato(R, "sono-io", padrone && !dorme);
    P.stato(R, "chiusa-da-me", padrone && dorme);
    P.stato(R, "conferma-cancella", !!stato.confermaCancella);
    Array.prototype.forEach.call(R.querySelectorAll('[data-g="cambia-visibilita"]'), function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-v") === (o.visibilita || "solo_me")
        ? "true" : "false");
    });

    P.stato(R, "sono-dentro", !!mia);
    P.stato(R, "non-sono-dentro", !mia && o.stadio !== "sviluppato");
    P.stato(R, "chiusa", o.stadio === "sviluppato");
    P.stato(R, "scaduta", !!scaduta);

    /* ⭐ 1 ottobre — la pulizia: quello che non c'è non si vede (né i segnaposti, né le carte vuote) */
    (function () {
      var NOMI_TIPO = { festa: "evento", micelio: "micelio", karma_yoga: "karma yoga", talento_radice: "talento" };
      Array.prototype.forEach.call(R.querySelectorAll('[data-c="orma.tipo"]'), function (e) { if (o.tipo) e.textContent = NOMI_TIPO[o.tipo] || String(o.tipo).replace(/_/g, " "); });
      var occ = R.querySelector(".occ");
      if (occ && !o.elemento) Array.prototype.forEach.call(occ.childNodes, function (n) {
        if (n.nodeType === 1 && n.getAttribute("data-c") === "orma.elemento") n.hidden = true;
        if (n.nodeType === 3 && /·\s*$/.test(n.nodeValue) && n.nextSibling && n.nextSibling.nodeType === 1 && n.nextSibling.getAttribute("data-c") === "orma.elemento") n.nodeValue = n.nodeValue.replace(/\s*·\s*$/, " ");
      });
      Array.prototype.forEach.call(R.querySelectorAll(".dati > span"), function (sp) {
        if (sp.querySelector(".fl")) return;                       /* gli allegati restano: c'è il +  */
        var vl = sp.querySelector(".vl"); var t = vl ? (vl.innerText || vl.textContent).replace(/persone/, "").trim() : "";
        sp.hidden = !t || /^\[.*\]$/.test(t);
      });
      var doc = R.ownerDocument; if (doc && doc.documentElement) doc.documentElement.classList.add("pronta");
    })();
    P.stato(R, "posso-pubblicare", !!d.puoPubblicare);
    /* ⭐ la vetrina: la costruisce Design, la scrive fm-vetrina.js */
    if (window.SpazioVivo && typeof window.SpazioVivo.vetrina === "function")
      window.SpazioVivo.vetrina(R, id, ricarica);

    /* chi c'è dentro */
    P.stampa(R, "dentro", d.dentro, function (c, x) {
      var pr = x.profilo || {};
      P.riempi(c, { dentro: {
        nome: x.nome || "", foto_url: pr.foto_url || "",
        nome_url: pr.nome_url ? "?p=" + pr.nome_url : "",
        preso_il: x.preso_il ? "dal " + giornoMese(x.preso_il) : "",
        ore: ore(x.ore), chiuso_il: x.chiuso_il ? giornoMese(x.chiuso_il) : "" } });
      P.stato(c, "in-attesa", x.stato === "proposto" && !x.preso_il);
      P.stato(c, "coordina", x.ruolo === "coordinatore");
    });

    /* le figlie */
    P.stato(R, "senza-figlie", d.figlie.length === 0);
    /* ⭐ 1 ottobre — obiettivi, eventi, riunioni: la parte pratica, raggruppata */
    var GRUPPO = function (x) { return x.categoria === "riunione" ? "riunioni" : x.tipo === "festa" ? "eventi" : x.tipo === "obiettivo" ? "obiettivi" : "altro"; };
    var ORD = { obiettivi: 0, eventi: 1, riunioni: 2, altro: 3 };
    d.figlie.sort(function (a, b) { return ORD[GRUPPO(a)] - ORD[GRUPPO(b)]; });
    var copieF = P.stampa(R, "figlia", d.figlie, function (c, x) {
      c.style.cursor = "pointer"; c.onclick = function () { apri(x.id); };
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

    (function () {
      var visto = {};
      (copieF || []).forEach(function (c, i) {
        var g = GRUPPO(d.figlie[i]); if (visto[g]) return; visto[g] = 1;
        var h = c.ownerDocument.createElement("div"); h.className = "fascia-f"; h.setAttribute("data-fm-copia", "figlia");
        h.textContent = g; c.parentNode.insertBefore(h, c);
      });
      /* l'inizio del racconto, nella porta chiusa */
      var ri = R.querySelector("#racconto-inizio");
      if (ri) ri.textContent = String(o.contenuto || "").trim().split("\n")[0].slice(0, 60);
      var pr = R.querySelector("#p-racconto"); if (pr) pr.hidden = !String(o.contenuto || "").trim();
      /* il link per entrare: un evento si apre dalla sua pagina pubblica, il resto dall'orma */
      var base = location.origin + location.pathname;
      var link = base + (o.tipo === "festa" ? "?p=evento&e=" : "?p=orma&o=") + id;
      var cp = R.querySelector('[data-g="copia-invito"]');
      if (cp) cp.onclick = function () { try { navigator.clipboard.writeText(link); cp.textContent = "copiato"; } catch (e) {} };
      var wa = R.querySelector('[data-g="wa-invito"]');
      if (wa) wa.setAttribute("href", "https://wa.me/?text=" + encodeURIComponent((titolo(o) || "") + " \u2014 " + link));
      /* evento e riunione solo a chi ha lo strumento aperto */
      P.stato(R, "apre-evento", (d.aperti || []).indexOf("festa") >= 0);
    })();

    /* ⭐ 1 ottobre 20:44, Gab: il numero dei messaggi nuovi sulla porta «La conversazione»; aprendola si azzera,
       e l'app toglie la notifica di quest'orma (così il numero sull'icona resta uguale) */
    (function () {
      var pc = R.querySelector("#p-chat"); if (!pc) return;
      var n = d.io ? d.chat.filter(function (m) { return m.persona_id && m.persona_id !== d.io && (!d.lettoFino || m.momento > d.lettoFino); }).length : 0;
      var sn = pc.querySelector("summary .n");
      if (sn) { sn.textContent = n ? String(n) : ""; sn.classList.toggle("nuovi", n > 0); }
      var segna = async function () {
        if (!d.io) return;
        try { await db.from("letture").upsert({ persona_id: d.io, orma_id: id, letto_fino: new Date().toISOString() }); } catch (e) {}
        try { if (window.FelicitasApp && typeof window.FelicitasApp.letti === "function") window.FelicitasApp.letti(id); } catch (e) {}
        if (sn) { sn.textContent = ""; sn.classList.remove("nuovi"); }
      };
      if (!pc._segna) { pc._segna = 1; pc.addEventListener("toggle", function () { if (pc.open) segna(); }); }
      if (pc.open) segna();
    })();

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
    function nuova(opz) {
      if (window.SpazioVivo && typeof window.SpazioVivo.nuovaOrma === "function") return window.SpazioVivo.nuovaOrma(id, opz);
    }
    P.gesto(R, "nuovo-obiettivo", function () { nuova({ tipo: "obiettivo" }); });
    P.gesto(R, "nuovo-evento", function () { nuova({ tipo: "festa" }); });
    P.gesto(R, "nuova-riunione", function () { nuova({ tipo: "festa", categoria: "riunione" }); });
    P.gesto(R, "apri-figlia", function () {
      if (window.SpazioVivo && typeof window.SpazioVivo.nuovaOrma === "function")
        return window.SpazioVivo.nuovaOrma(id);
      vaiA("megafono", id);
    });
    /* ⭐ 1 ottobre, Gab: «quando torno indietro mi riporta a orme, non a vicinati» — si torna da dove si è entrati */
    var DA = window.ormaDa || "orme";
    var NOMI_DA = { orme: "la mia orma", vicinati: "vicinati", emporio: "emporio", assistenza: "assistenza", edizione: "edizione", scuola: "scuola", anthakarana: "antaḥkaraṇa", settimana: "la settimana", calendario: "calendario", evento: "l'evento" };
    var tn = R.querySelector('[data-g="torna"]'); if (tn) tn.innerHTML = "&larr; " + (NOMI_DA[DA.replace(/-piena$/, "")] || "indietro");
    P.gesto(R, "torna", function () { vaiA(DA); });

    /* ─ le tre cose di chi ha aperto l'orma ─ */
    /* fa parte di: la scelta della madre */
    var sm = R.querySelector('[data-g="scegli-madre"]');
    P.stato(R, "puo-madre", !!(d.candidate && d.candidate.length));
    if (sm && d.candidate) {
      sm.innerHTML = '<option value="">— nessuna —</option>' + d.candidate.map(function (c) {
        var t = String(titolo(c)).replace(/[&<>"]/g, function (x) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[x]; });
        /* ⭐ 1 ottobre 21:33, Gab: «togli le scritte micelio da fa parte di» — il villaggio si chiama da sé */
        var et = c.tipo === "micelio" ? "" : c.tipo === "talento_radice" ? "talento · " : "evento · ";
        return '<option value="' + c.id + '">' + et + t + '</option>';
      }).join("");
      sm.value = o.orma_madre_id || "";
      sm.onchange = async function () {
        try {
          var r = await db.from("orme").update({ orma_madre_id: sm.value || null }).eq("id", id);
          if (r.error) throw r.error;
          await ricarica();
        } catch (err) { console.warn("fa parte di:", err); alert("Non è stato possibile: " + (err.message || err)); }
      };
    }
    P.gesto(R, "cambia-visibilita", async function (e, b) {
      try {
        var r = await db.from("orme").update({ visibilita: b.getAttribute("data-v") }).eq("id", id);
        if (r.error) throw r.error;
        await ricarica();
      } catch (err) { console.warn("visibilit\u00e0:", err); }
    });
    /* ⭐ 1 ottobre 22:56, Gab — la scadenza e l'archivio di chi ha aperto l'orma */
    var sc = R.querySelector('[data-g="scadenza"]');
    if (sc) {
      sc.value = o.entro_il ? String(o.entro_il).slice(0, 10) : "";
      sc.onchange = async function () {
        var r = await db.from("orme").update({ entro_il: sc.value || null }).eq("id", id);
        if (r.error) { console.warn("scadenza:", r.error); alertino(r.error.message); return; }
        await ricarica();
      };
    }
    P.stato(R, "aperta-mia", o.stadio !== "sviluppato");
    function alertino(t) { var n = R.querySelector('[data-g="concludi"]'); if (n) { n.textContent = "non riesco: " + String(t).slice(0, 80); } }
    P.gesto(R, "concludi", function (e, b) {
      occupato(b, async function () {
        var r = await db.from("orme").update({ stadio: "sviluppato" }).eq("id", id);
        if (r.error) throw r.error;
      })();
    });
    P.gesto(R, "riprendi", function (e, b) {
      occupato(b, async function () {
        var r = await db.from("orme").update({ stadio: "in_avanzamento" }).eq("id", id);
        if (r.error) throw r.error;
      })();
    });
    P.gesto(R, "chiudi-questa-orma", function (e, b) {
      occupato(b, async function () {
        var r = await db.rpc("fm_chiudi_questa_orma", { p_orma: id });
        if (r.error) throw r.error;
      })();
    });
    P.gesto(R, "riapri-orma", function (e, b) {
      occupato(b, async function () {
        var r = await db.rpc("fm_riapri_orma", { p_orma: id });
        if (r.error) throw r.error;
      })();
    });
    /* ⭐ il primo tocco chiede conferma, il secondo cancella */
    P.gesto(R, "cancella-orma", function (e, b) {
      if (!stato.confermaCancella) {
        stato.confermaCancella = true;
        P.stato(R, "conferma-cancella", true);
        return;
      }
      occupato(b, async function () {
        var r = await db.rpc("fm_cancella_orma", { p_orma: id });
        if (r.error) throw r.error;     /* ⛔ altri ci hanno lavorato: si chiude, non si cancella */
        vaiA("orme");
      })();
    });
    P.gesto(R, "annulla-cancella", function () {
      stato.confermaCancella = false;
      P.stato(R, "conferma-cancella", false);
    });

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
    var stato = {};
    async function ricarica() { disegna(R, await leggi(id), id, ricarica, stato); }
    await ricarica();
  }

  window.SpazioVivo = window.SpazioVivo || {};
  window.SpazioVivo.ormaDentro = ormaDentro;
  window.FMOrmaDentro = { disegna: disegna };   /* per le prove */
})();
