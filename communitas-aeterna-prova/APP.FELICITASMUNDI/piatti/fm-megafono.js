/* ═══════════════════════════════════════════════════════════════
   FM-MEGAFONO — dove nasce ogni orma, dalla versione piatta.

   ⭐ Disegno di Design: megafono-piatto.html. Lo script della pagina fa
      i pannelli che si aprono, il calendarietto e la freccia che si
      accende. ⛔ Qui non si rifanno: si mettono i dati e si scrive.

   DA DOVE SI APRE, CAMBIA COSA SCRIVE:
     dal nulla        → un'orma sciolta
     da dentro un'orma → una figlia di quell'orma (orma_madre_id)
     ⭐ IL FILO lo scrive il database, non questo file: così vale da
        qualsiasi parte nasca un'orma.

   ⛔ LE FIGLIE LE FA CHI È DAL KARMA YOGA IN SU. Un ospite scrive orme
      sue: il cartellino «dentro» non compare, e l'orma nasce sciolta.

   ⭐ IL TITOLO: se lo si lascia vuoto, si prende la prima riga del testo.
      Prima il Megafono non lo scriveva, e le orme restavano righe vuote.

   Vuole:   fm-piatto.js prima · `db` · `vai`
   Espone:  SpazioVivo.megafono(dove, { madre })
   ═══════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  var INDIRIZZO = "APP.FELICITASMUNDI/piatti/megafono-piatto.html";
  var MESI = ["gennaio","febbraio","marzo","aprile","maggio","giugno","luglio",
              "agosto","settembre","ottobre","novembre","dicembre"];
  var STANZE = { terra: "I Vicinati", acqua: "L\u2019Emporio", fuoco: "L\u2019Assistenza",
                 aria: "L\u2019Edizione", etere: "La Scuola", nexus: "Organizzazione e sviluppo" };
  var TIPI = { karma_yoga: "karma yoga", obiettivo: "obiettivo", contatto: "contatto",
               spesa: "spesa", racconto: "racconto" };
  var SU = ["karma_yoga", "studente", "praticante", "operatore", "nucleo"];  /* può fare figlie */
  var F = function () { return window.FMPiatto; };

  function corto(s) {
    var r = String(s || "").trim().split("\n")[0];
    return r.length > 70 ? r.slice(0, 68).trim() + "\u2026" : r;
  }

  /* ── leggere ───────────────────────────────────────────────────── */
  async function leggi(madreId) {
    var d = { io: null, grado: "ospite", talenti: [], radici: 0, madre: null };
    try {
      var u = await db.auth.getUser();
      d.io = u && u.data && u.data.user && u.data.user.id;
      if (!d.io) return d;

      var p = await db.from("persone").select("grado").eq("id", d.io).single();
      if (!p.error && p.data) d.grado = p.data.grado || "ospite";

      /* i miei talenti: le radici, coi loro segni */
      var o = await db.from("orme").select("id,talento_id,tipo")
        .eq("persona_id", d.io).eq("tipo", "talento_radice");
      var righe = o.error ? [] : (o.data || []);
      d.radici = righe.length;      /* ⭐ quante radici ha aperto in tutta la sua vita */
      var ids = righe.map(function (r) { return r.talento_id; }).filter(Boolean);
      if (ids.length) {
        var t = await db.from("talenti").select("id,nome,svg,elemento,stanza").in("id", ids);
        d.talenti = t.error ? [] : (t.data || []);
      }

      if (madreId) {
        var m = await db.from("orme").select("id,titolo,contenuto,elemento,visibilita")
          .eq("id", madreId).single();
        if (!m.error) d.madre = m.data;
      }
    } catch (e) { console.warn("megafono:", e); }
    return d;
  }

  /* ── disegnare ─────────────────────────────────────────────────── */
  function disegna(R, d, s) {
    var P = F();
    var puo = SU.indexOf(d.grado) >= 0;

    /* il cartellino della madre */
    P.stato(R, "dentro", !!(s.madre && puo));
    P.stato(R, "non-puo-figlia", !!(s.madre && !puo));
    if (s.madre) P.riempi(R, { madre: { titolo: s.madre.titolo || corto(s.madre.contenuto) } });

    /* i talenti, e il caso di chi non ne ha */
    /* ⭐ due cose diverse: chi i talenti li ha LASCIATI, e chi non li ha MAI scelti */
    P.stato(R, "ha-talenti", d.talenti.length > 0);
    P.stato(R, "senza-talenti", d.talenti.length === 0 && d.radici > 0);
    P.stato(R, "mai-talenti", d.talenti.length === 0 && !d.radici);
    P.stampa(R, "talento", d.talenti, function (c, t) {
      P.riempi(c, { talento: { nome: t.nome, svg: t.svg, elemento: t.elemento } });
      c.setAttribute("data-v", t.id);
      c.setAttribute("aria-pressed", s.talento === t.id ? "true" : "false");
      /* ⭐ il tasto sta SULLA riga copiata: si collega qui, non da fuori */
      c.onclick = function () { s.talento = t.id; disegna(R, d, s); };
    });
    P.stato(R, "ha-talento", !!s.talento);

    /* il tondino: il tipo, e la stanza dove va a finire */
    P.riempi(R, {
      orma: { tipo: TIPI[s.tipo] || s.tipo || "" },
      contesto: { nome: STANZE[s.contesto] || "" }
    });
    P.stato(R, "ha-contesto", !!s.contesto);
    var pt = R.querySelector(".mg-tipo");
    if (pt && s.contesto) pt.style.setProperty("--c", "var(--" + s.contesto + ")");
    Array.prototype.forEach.call(R.querySelectorAll('[data-g="scegli-contesto"]'), function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-v") === s.contesto ? "true" : "false");
    });
    Array.prototype.forEach.call(R.querySelectorAll('[data-g="scegli-tipo"][data-v]'), function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-v") === s.tipo ? "true" : "false");
    });

    /* quando · dove · con chi: si vedono nel titolo del loro segno */
    var q = R.querySelector('[data-g="quando"]');
    if (q) q.setAttribute("title", s.quando
      ? new Date(s.quando).getDate() + " " + MESI[new Date(s.quando).getMonth()] : "quando");
    var dv = R.querySelector('[data-g="dove"]');
    if (dv) dv.setAttribute("title", s.luogo || "dove");
    var ch = R.querySelector('[data-g="chi"]');
    if (ch) ch.setAttribute("title", s.persone.length ? s.persone.length + " persone" : "con chi");

    /* il mese del calendarietto */
    var oggi = new Date();
    P.riempi(R, { mese: { nome: MESI[oggi.getMonth()] + " " + oggi.getFullYear() } });

    /* gli allegati scelti */
    P.stato(R, "ha-file", s.file.length > 0);
    P.stampa(R, "file", s.file, function (c, f) { P.riempi(c, { file: { nome: f.name } }); });
  }

  /* ── scrivere l'orma ───────────────────────────────────────────── */
  async function manda(R, d, s) {
    var testo = (R.querySelector('[data-c="orma.contenuto"]') || {}).value || "";
    var titolo = (R.querySelector('[data-c="orma.titolo"]') || {}).value || "";
    testo = testo.trim();
    if (!testo) return null;

    var riga = {
      persona_id: d.io,
      titolo: titolo.trim() || corto(testo),
      contenuto: testo,
      tipo: s.tipo || "karma_yoga",
      elemento: s.contesto || (s.madre && s.madre.elemento) || null,
      visibilita: s.madre ? (s.madre.visibilita || "solo_me") : "solo_me",
      inizio_il: s.quando || null,
      luogo: s.luogo || null,
      territorio_cod: s.comune || null
    };
    /* ⭐ la madre: il filo e il talento li mette il database */
    if (s.madre && SU.indexOf(d.grado) >= 0) riga.orma_madre_id = s.madre.id;
    /* ⭐ scegliere un talento senza madre: l'orma nasce sotto la sua radice */
    else if (s.talento && s.radici[s.talento]) riga.orma_madre_id = s.radici[s.talento];

    var n = await db.from("orme").insert(riga).select("id").single();
    if (n.error) throw n.error;
    var id = n.data.id;

    /* chi è stato chiamato */
    for (var i = 0; i < s.persone.length; i++) {
      try { await db.rpc("fm_chiama_orma", { p_orma: id, p_persona: s.persone[i].persona_id }); }
      catch (e) { console.warn("megafono, chiamo:", e); }
    }
    /* gli allegati: restano riservati */
    for (var k = 0; k < s.file.length; k++) {
      try {
        var f = s.file[k];
        var su = await db.storage.from("riservato").upload(id + "/" + f.name, f);
        if (su.error) throw su.error;
        await db.from("orma_file").insert({ orma_id: id, nome: f.name, tipo: f.type,
                                            indirizzo: id + "/" + f.name });
      } catch (e) { console.warn("megafono, allegato:", e); }
    }
    return id;
  }

  /* ── i gesti ───────────────────────────────────────────────────── */
  function gesti(R, d, s, dopo) {
    var P = F();

    P.gesto(R, "scegli-tipo", function () {});     /* il pannello lo apre Design */
    Array.prototype.forEach.call(R.querySelectorAll('[data-g="scegli-tipo"][data-v]'), function (b) {
      b.onclick = function () { s.tipo = b.getAttribute("data-v"); disegna(R, d, s); };
    });
    P.gesto(R, "scegli-contesto", function (e, b) {
      s.contesto = b.getAttribute("data-v"); disegna(R, d, s);
    });
    /* «nessuno · va in Da collegare» è fisso nella pagina, non una copia */
    P.gesto(R, "scegli-talento", function (e, b) {
      if (!b.hasAttribute("data-stampo")) { s.talento = b.getAttribute("data-v") || null; disegna(R, d, s); }
    });
    P.gesto(R, "esci-dalla-madre", function () { s.madre = null; disegna(R, d, s); });
    P.gesto(R, "vai-talenti", function () {
      if (typeof window.vai === "function") window.vai("talenti");
    });

    /* il calendarietto: i giorni li disegna Design */
    var g = R.querySelector("#gg2");
    if (g) g.addEventListener("click", function (e) {
      var b = e.target && e.target.closest && e.target.closest("button");
      if (!b || !b.textContent.trim()) return;
      var o = new Date();
      s.quando = new Date(o.getFullYear(), o.getMonth(), parseInt(b.textContent, 10), 9, 0).toISOString();
      Array.prototype.forEach.call(g.querySelectorAll("button"), function (x) {
        x.setAttribute("aria-pressed", x === b ? "true" : "false");
      });
      disegna(R, d, s);
    });

    /* dove: i comuni si cercano scrivendo */
    var cd = R.querySelector("#pan-dove input");
    if (cd) cd.oninput = function () {
      clearTimeout(s.tDove);
      var q = cd.value.trim();
      s.tDove = setTimeout(async function () {
        var t = [];
        if (q.length >= 2) {
          try {
            var r = await db.from("territori").select("codice,nome,provincia")
              .eq("tipo", "comune").ilike("nome", q + "%").order("nome").limit(8);
            t = r.error ? [] : (r.data || []);
          } catch (e) {}
        }
        P.stampa(R, "comune", t, function (c, x) {
          P.riempi(c, { comune: { nome: x.nome, prov: x.provincia || "" } });
          P.gesto(c, "scegli-comune", function () {
            s.comune = x.codice; s.luogo = x.nome; cd.value = x.nome; disegna(R, d, s);
          });
        });
      }, 250);
    };

    /* con chi: dalla rubrica */
    var cc = R.querySelector("#pan-chi input");
    if (cc) cc.oninput = function () {
      clearTimeout(s.tChi);
      var q = cc.value.trim();
      s.tChi = setTimeout(async function () {
        var t = [];
        if (q.length >= 2) {
          try {
            var r = await db.from("contatti").select("nome,persona_id")
              .eq("proprietario_id", d.io).not("persona_id", "is", null)
              .ilike("nome", "%" + q + "%").order("nome").limit(8);
            t = r.error ? [] : (r.data || []);
          } catch (e) {}
        }
        P.stampa(R, "dentro", t, function (c, x) {
          P.riempi(c, { dentro: { nome: x.nome, iniziale: "" } });
          P.gesto(c, "scegli-persona", function () {
            if (!s.persone.some(function (y) { return y.persona_id === x.persona_id; }))
              s.persone.push(x);
            cc.value = ""; disegna(R, d, s);
          });
        });
      }, 250);
    };

    /* allegare */
    P.gesto(R, "allega", function () {
      var i = R.ownerDocument.createElement("input");
      i.type = "file"; i.multiple = true;
      i.onchange = function () {
        Array.prototype.forEach.call(i.files || [], function (f) { s.file.push(f); });
        disegna(R, d, s);
      };
      i.click();
    });

    /* la freccia */
    P.gesto(R, "manda", async function (e, b) {
      b.disabled = true;
      P.stato(R, "manda", true);
      try {
        var id = await manda(R, d, s);
        if (!id) throw new Error("niente da mandare");
        P.stato(R, "manda", false);
        P.stato(R, "nata", true);
        var campo = R.querySelector('[data-c="orma.contenuto"]');
        if (campo) campo.value = "";
        var tit = R.querySelector('[data-c="orma.titolo"]');
        if (tit) tit.value = "";
        s.quando = null; s.luogo = null; s.comune = null; s.persone = []; s.file = [];
        disegna(R, d, s);
        if (typeof dopo === "function") await dopo(id);
      } catch (err) {
        console.warn("megafono:", err);
        P.stato(R, "manda", false);
        b.disabled = false;
      }
    });
  }

  /* ── la porta ──────────────────────────────────────────────────── */
  async function megafono(dove, cosa) {
    cosa = cosa || {};
    var box = typeof dove === "string" ? document.querySelector(dove) : dove;
    if (!box || !window.FMPiatto) return;
    var R = await F().monta(box, INDIRIZZO);
    if (R && R.body) R = R.body;
    var d = await leggi(cosa.madre || null);

    /* le radici dei miei talenti: servono per appendere l'orma al talento */
    var radici = {};
    try {
      var o = await db.from("orme").select("id,talento_id")
        .eq("persona_id", d.io).not("talento_id", "is", null);
      (o.error ? [] : o.data || []).forEach(function (r) { radici[r.talento_id] = r.id; });
    } catch (e) {}

    var s = { tipo: "karma_yoga", contesto: (d.madre && d.madre.elemento) || null,
              talento: null, madre: d.madre, quando: null, luogo: null, comune: null,
              persone: [], file: [], radici: radici };
    disegna(R, d, s);
    gesti(R, d, s, cosa.dopo);
  }

  window.SpazioVivo = window.SpazioVivo || {};
  window.SpazioVivo.megafono = megafono;
  window.SpazioVivo.nuovaOrma = function (madre) { return megafono("#centro", { madre: madre }); };
  window.FMMegafono = { disegna: disegna, gesti: gesti };
})();
