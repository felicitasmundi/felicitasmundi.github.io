/* ═══════════════════════════════════════════════════════════════
   FM-ORMA-TEMPIO — «La mia orma» col rito del tempio.
   ⭐ 1 ottobre, Gab: «mi fai vedere come possiamo rifare la mia orma ora che abbiamo settato
      le 5 stanze?» → «per me questa visibilità orma puoi già pubblicarla».
   Disegno: la-mia-orma-tempio-piatto.html. Chi sei in alto, le tue orme nelle cinque stanze
   (i cinque solidi: toccandone uno le porte mostrano solo quella stanza), la frase, e le porte:
   Settimana · Talenti · Squadre · Da collegare · Conti.
   ⭐ 3 ottobre, Gab: «rendiamolo molto più semplice a livello visivo» — gli obiettivi in tre gruppi
   (in coda · in avanzamento · sviluppato) con stato, persona e barretta sulla riga; il karma yoga
   chiuso; talenti, squadre, da collegare, le cinque stanze, conti e invita in «la tua rete», a tessere.
   La settimana la legge fm-settimana.js (obiettivi + karma yoga in cui sei dentro).
   Vuole: fm-piatto.js · fm-settimana.js · `db` · `vai`
   Espone: SpazioVivo.ormaTempio(dove)
   ═══════════════════════════════════════════════════════════════ */
(function () {
  "use strict";
  var INDIRIZZO = "APP.FELICITASMUNDI/piatti/la-mia-orma-tempio-piatto.html";
  var MESI = ["gennaio","febbraio","marzo","aprile","maggio","giugno","luglio","agosto","settembre","ottobre","novembre","dicembre"];
  var STANZE = [
    { el: "terra", nome: "Vicinati",   solido: "cubo",       c: "#AA8844" },
    { el: "acqua", nome: "Emporio",    solido: "icosaedro",  c: "#4488BB" },
    { el: "fuoco", nome: "Assistenza", solido: "tetraedro",  c: "#CC6644" },
    { el: "aria",  nome: "Edizione",   solido: "ottaedro",   c: "#669944" },
    { el: "etere", nome: "Scuola",     solido: "dodecaedro", c: "#9966CC" }
  ];
  var COL = { terra: "#AA8844", acqua: "#4488BB", fuoco: "#CC6644", aria: "#669944", etere: "#9966CC", nexus: "#8C2F39", karma: "#8C2F39", sviluppo: "#D4AF6A" };
  var NOME_EL = { terra: "I Vicinati", acqua: "L’Emporio", fuoco: "L’Assistenza", aria: "L’Edizione", etere: "La Scuola", nexus: "Sviluppo", sviluppo: "Sviluppo" };
  var LUNE = [[1.84566,"luna nuova","🌑"],[5.53699,"crescente","🌒"],[9.22831,"primo quarto","🌓"],[12.91963,"gibbosa crescente","🌔"],[16.61096,"luna piena","🌕"],[20.30228,"gibbosa calante","🌖"],[23.99361,"ultimo quarto","🌗"],[27.68493,"calante","🌘"],[29.53059,"luna nuova","🌑"]];

  function esc(x) { return String(x == null ? "" : x).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function titolo(o) {
    if (o && o.titolo) return o.titolo;
    var s = String((o && o.contenuto) || "").trim().split("\n")[0];
    return s.length > 80 ? s.slice(0, 78).trim() + "…" : s;
  }
  function giornoMese(s) { if (!s) return ""; var x = new Date(s); return isNaN(x) ? "" : x.getDate() + " " + MESI[x.getMonth()]; }
  function luna(q) {
    var g = ((q || new Date()) - Date.UTC(2000, 0, 6, 18, 14)) / 86400000;
    var e = ((g % 29.530588853) + 29.530588853) % 29.530588853;
    for (var i = 0; i < LUNE.length; i++) if (e < LUNE[i][0]) return LUNE[i];
    return LUNE[0];
  }
  function stadio(s) { return s === "sviluppato" ? "fatti" : s === "in_avanzamento" ? "in corso" : "da fare"; }
  function apri(id) {
    if (!id) return;
    if (window.SpazioVivo && typeof window.SpazioVivo.apriOrma === "function") return window.SpazioVivo.apriOrma(id);
    if (typeof window.vai === "function") window.vai("orma", { id: id });
  }
  function vaiA(r) { if (typeof window.vai === "function") window.vai(r); }

  /* ── leggere ───────────────────────────────────────────────────── */
  async function leggi() {
    var d = { io: null, persona: {}, orme: [], talenti: {}, squadre: [], settimana: null, santo: "", ore: 0 };
    try {
      var u = await db.auth.getUser();
      d.io = u && u.data && u.data.user && u.data.user.id;
      if (!d.io) return d;
      var pp = await db.from("persone").select("nome,grado,foto_url").eq("id", d.io).single();
      if (!pp.error) d.persona = pp.data || {};
      var o = await db.from("orme")
        .select("id,titolo,contenuto,tipo,elemento,stadio,luogo,accaduto_il,inizio_il,talento_id,orma_madre_id,filo_id,momento,dorme_dal")
        .eq("persona_id", d.io).order("momento", { ascending: false }).limit(400);
      d.orme = o.error ? [] : (o.data || []).filter(function (x) { return !x.dorme_dal; });
      var tid = d.orme.filter(function (x) { return x.talento_id; }).map(function (x) { return x.talento_id; });
      if (tid.length) {
        var t = await db.from("talenti").select("id,nome,elemento,stanza").in("id", tid);
        (t.error ? [] : t.data || []).forEach(function (r) { d.talenti[r.id] = r; });
      }
      var oggi = new Date();
      var sa = await db.from("santi").select("intero").eq("mese", oggi.getMonth() + 1).eq("giorno", oggi.getDate()).limit(1);
      if (!sa.error && sa.data && sa.data[0]) d.santo = sa.data[0].intero;

      /* le squadre: le orme dove sei dentro con almeno un'altra persona */
      var sq = await db.rpc("fm_mie_squadre_dettaglio");
      d.squadre = sq.error ? [] : (sq.data || []);
      /* ⭐ i miceli e gli eventi che hai aperto tu sono squadre anche quando ci sei solo tu */
      var gia = {}; d.squadre.forEach(function (s) { gia[s.id] = 1; });
      d.orme.filter(function (o) { return (o.tipo === "micelio" || o.tipo === "festa") && !gia[o.id]; }).forEach(function (o) {
        d.squadre.push({ id: o.id, titolo: titolo(o), esiste_dal: o.momento, quanti_dentro: null });
      });
      var senzaConto = d.squadre.filter(function (s) { return s.quanti_dentro == null; }).map(function (s) { return s.id; });
      if (senzaConto.length) {
        var cc = await db.from("orma_persone").select("orma_id").in("orma_id", senzaConto).not("preso_il", "is", null).is("lasciato_il", null);
        var n = {}; (cc.error ? [] : cc.data || []).forEach(function (r) { n[r.orma_id] = (n[r.orma_id] || 0) + 1; });
        d.squadre.forEach(function (s) { if (s.quanti_dentro == null) s.quanti_dentro = n[s.id] || 0; });
      }
      if (d.squadre.length) {
        var ids = d.squadre.map(function (s) { return s.id; });
        var so = await db.from("orme").select("id,tipo,orma_madre_id,elemento,inizio_il,accaduto_il,luogo").in("id", ids);
        var info = {}; (so.error ? [] : so.data || []).forEach(function (r) { info[r.id] = r; });
        var ru = await db.from("orma_persone").select("orma_id,ruolo").eq("persona_id", d.io).in("orma_id", ids).is("lasciato_il", null);
        var ruolo = {}; (ru.error ? [] : ru.data || []).forEach(function (r) { if (r.ruolo) ruolo[r.orma_id] = r.ruolo; });
        d.squadre.forEach(function (s) { var i = info[s.id] || {}; s.tipo = i.tipo; s.madre = i.orma_madre_id; s.elemento = i.elemento;
          s.quando = i.inizio_il || i.accaduto_il; s.luogo = i.luogo; s.ruolo = ruolo[s.id]; });
      }
      /* le ore messe, da sempre */
      var or = await db.from("orma_persone").select("ore").eq("persona_id", d.io).not("ore", "is", null);
      (or.error ? [] : or.data || []).forEach(function (r) { d.ore += Number(r.ore) || 0; });

      /* la settimana */
      var S = window.FMSettimana;
      if (S && S.leggi) {
        var lun = new Date(); lun.setHours(0, 0, 0, 0); lun.setDate(lun.getDate() - ((lun.getDay() + 6) % 7));
        d.lun = lun; d.settimana = await S.leggi(lun);
      }
      /* ⭐ 3 ottobre — chi c'è su ogni obiettivo (dentro o proposto), e la rubrica per «proponi a…» */
      d.chi = {}; d.rubrica = [];
      var obIds = ((d.settimana && d.settimana.obiettivi) || []).map(function (x) { return x.id; });
      if (obIds.length) {
        var op = await db.from("orma_persone").select("orma_id,persona_id,nome,stato,preso_il,lasciato_il").in("orma_id", obIds);
        (op.error ? [] : op.data || []).forEach(function (r) {
          if (r.lasciato_il || r.stato === "rifiutato") return;
          if (r.stato !== "proposto" && !r.preso_il) return;
          (d.chi[r.orma_id] = d.chi[r.orma_id] || []).push({ nome: r.nome || "", attesa: !r.preso_il, persona: r.persona_id });
        });
      }
      var rb = await db.from("contatti").select("nome,persona_id").eq("proprietario_id", d.io).not("persona_id", "is", null).order("nome");
      d.rubrica = rb.error ? [] : (rb.data || []);
      /* e chi lavora con te nelle squadre (il lavoro del team), anche se non è in rubrica */
      if (d.squadre.length) {
        var gp = await db.from("orma_persone").select("persona_id,nome").in("orma_id", d.squadre.map(function (s) { return s.id; }))
          .not("persona_id", "is", null).not("preso_il", "is", null).is("lasciato_il", null);
        var visto = {}; d.rubrica.forEach(function (r) { visto[r.persona_id] = 1; });
        (gp.error ? [] : gp.data || []).forEach(function (r) {
          if (visto[r.persona_id] || r.persona_id === d.io) return;
          visto[r.persona_id] = 1; d.rubrica.push({ nome: r.nome || "", persona_id: r.persona_id });
        });
        d.rubrica.sort(function (x, y) { return String(x.nome).localeCompare(String(y.nome)); });
      }
    } catch (e) { console.warn("la mia orma:", e); }
    return d;
  }

  /* ── disegnare ─────────────────────────────────────────────────── */
  /* ⭐ 3 ottobre, Gab: «voglio mettere se qualcosa è già fatto, o a che punto sia arrivato, senza dover entrare».
     I tre stati sono quelli del database, con le loro parole: in coda · in avanzamento · sviluppato. */
  var STADI = [["in_coda", "in coda"], ["in_avanzamento", "in avanzamento"], ["sviluppato", "sviluppato"]];
  function stadioDi(o) { return o.stadio === "sviluppato" || o.stadio === "in_avanzamento" ? o.stadio : "in_coda"; }
  function parolaStadio(s) { for (var i = 0; i < STADI.length; i++) if (STADI[i][0] === s) return STADI[i][1]; return "in coda"; }
  function iniziali(n) {
    var p = String(n || "").trim().split(/\s+/).filter(Boolean);
    if (!p.length) return "·";
    return (p[0].charAt(0) + (p[1] ? p[1].charAt(0) : (p[0].charAt(1) || ""))).toUpperCase().slice(0, 2);
  }
  function riga(o, opz) {
    opz = opz || {};
    var c = COL[opz.colore || o.elemento] || "#D4AF6A";
    return '<a class="riga' + (opz.figlia ? " figlia" : "") + '" href="#" data-id="' + esc(o.id) + '" style="--c:' + c + '">' +
      '<span class="pt"></span>' +
      '<span class="tx"><b>' + esc(opz.titolo || titolo(o)) + '</b>' + (opz.sotto ? '<small>' + esc(opz.sotto) + '</small>' : "") + '</span>' +
      (opz.tag ? '<span class="tag">' + esc(opz.tag) + '</span>' : "") + '<span class="fr">›</span></a>';
  }

  /* una riga d'obiettivo: stato · persona · barretta, senza entrare */
  function rigaObiettivo(o, d, aperto) {
    var S = d.settimana || { passi: {} };
    var st = stadioDi(o), mio = o.persona_id === d.io;
    var passi = (S.passi && S.passi[o.id]) || [];
    var fatti = passi.filter(function (x) { return x.stadio === "sviluppato"; }).length;
    var pieno = passi.length ? Math.round(fatti / passi.length * 100) : (st === "sviluppato" ? 100 : st === "in_avanzamento" ? 50 : 0);
    if (st === "sviluppato") pieno = 100;
    var oggi = new Date(); oggi.setHours(0, 0, 0, 0);
    var tardi = o.entro_il && new Date(o.entro_il) < oggi && st !== "sviluppato";
    var sotto = [];
    if (o.gruppo !== "karma" && NOME_EL[o.elemento]) sotto.push(esc(NOME_EL[o.elemento]));
    if (o.entro_il) sotto.push(tardi ? '<span class="tardi">entro ' + esc(giornoMese(o.entro_il)) + '</span>' : "entro " + esc(giornoMese(o.entro_il)));
    if (passi.length) sotto.push(fatti + "/" + passi.length + " passi");
    var chi = (d.chi && d.chi[o.id]) || [];
    var volti = chi.slice(0, 3).map(function (p) { return '<span class="' + (p.attesa ? "attesa" : "") + '" title="' + esc(p.nome) + (p.attesa ? " · proposto" : "") + '">' + esc(iniziali(p.nome)) + '</span>'; }).join("");
    if (!volti) volti = mio ? '<span class="vuoto">+</span>' : "";
    var c = COL[o.gruppo === "karma" ? "karma" : o.elemento] || "#D4AF6A";
    var h = '<div class="ob ' + st + '" style="--c:' + c + '" data-ob="' + esc(o.id) + '">' +
      '<span class="pt"></span>' +
      '<a class="tx" href="#" data-id="' + esc(o.id) + '"><b>' + esc(titolo(o)) + '</b>' +
        (sotto.length ? '<small>' + sotto.join(" · ") + '</small>' : "") +
        '<span class="bar"><i style="width:' + pieno + '%"></i></span></a>' +
      '<button type="button" class="stato ' + st + '" data-stato="' + esc(o.id) + '"' + (mio ? "" : ' aria-disabled="true"') + '>' + parolaStadio(st) + '</button>' +
      (volti ? '<button type="button" class="chi" data-chi="' + esc(o.id) + '"' + (mio ? ' aria-label="proponi a"' : ' aria-disabled="true"') + '>' + volti + '</button>' : "") +
      '</div>';
    if (aperto === o.id && mio) {
      var gia = {}; chi.forEach(function (p) { if (p.persona) gia[p.persona] = 1; });
      var lib = (d.rubrica || []).filter(function (r) { return !gia[r.persona_id] && r.persona_id !== d.io; });
      h += '<div class="scegli">' + (lib.length
        ? '<span class="nota">proponi a</span>' + lib.map(function (r) { return '<button type="button" data-proponi="' + esc(o.id) + '" data-persona="' + esc(r.persona_id) + '">' + esc(r.nome) + '</button>'; }).join("")
        : '<span class="nota">Nella tua rubrica e nelle tue squadre non c’è ancora nessuno con un account.</span>') + '</div>';
    }
    return h;
  }

  function disegna(D, d, filtro, stato) {
    stato = stato || {};
    var pe = d.persona || {};
    var oggi = new Date(), L = luna(oggi);

    /* chi sei */
    D.getElementById("io-telefono").innerHTML =
      '<div class="vo">' + (pe.foto_url ? '<img src="' + esc(pe.foto_url) + '" alt="">' : esc(String(pe.nome || "·").trim().charAt(0).toLowerCase())) + '</div>' +
      '<div><div class="grado">' + esc((pe.grado || "").replace("_", " ")) + '</div><h1>La mia orma</h1>' +
      '<div class="sotto">' + esc(oggi.getDate() + " " + MESI[oggi.getMonth()]) + ' · <span title="' + esc(L[1]) + '">' + L[2] + '</span>' + (d.santo ? " · " + esc(d.santo) : "") + '</div></div>';
    D.documentElement.style.setProperty("--el", filtro ? COL[filtro] : "#D4AF6A");
    var passa = function (o) { return !filtro || o.elemento === filtro; };

    /* gli obiettivi, in tre gruppi */
    var S = d.settimana || { obiettivi: [], passi: {} };
    var ob = S.obiettivi.filter(passa);
    var nonKy = ob.filter(function (o) { return o.gruppo !== "karma"; });
    var ky = ob.filter(function (o) { return o.gruppo === "karma"; });
    var h = "";
    if (filtro) h += '<div class="filtro">solo ' + esc(NOME_EL[filtro] || "") + '<button type="button" data-togli-filtro>mostra tutto</button></div>';
    STADI.forEach(function (s) {
      var qui = nonKy.filter(function (o) { return stadioDi(o) === s[0]; });
      h += '<div class="gr">' + s[1] + '<span>' + qui.length + '</span></div>';
      qui.forEach(function (o) { h += rigaObiettivo(o, d, stato.aperto); });
      if (!qui.length) h += '<div class="vuoto-tx">—</div>';
    });
    if (!S.obiettivi.length) h = '<div class="vuoto-tx">Nessun obiettivo per questa settimana. Scrivi il primo nello spazio in basso.</div>';
    D.getElementById("obiettivi").innerHTML = h;

    var K = D.getElementById("ky");
    K.hidden = ky.length === 0;
    K.querySelector("summary .n").textContent = ky.length ? String(ky.length) : "";
    K.querySelector(".dentro").innerHTML = ky.map(function (o) { return rigaObiettivo(o, d, stato.aperto); }).join("");

    /* la tua rete: tessere */
    var radici = d.orme.filter(function (o) { return o.tipo === "talento_radice"; });
    var sq = d.squadre;
    var att = d.orme.filter(function (o) { return !o.talento_id && !o.filo_id && !o.orma_madre_id &&
      ["talento_radice", "micelio", "festa", "obiettivo", "karma_yoga"].indexOf(o.tipo) < 0 && passa(o); });
    var nStanze = d.orme.filter(function (o) { return o.tipo !== "talento_radice" && STANZE.some(function (s) { return s.el === o.elemento; }); }).length;
    var TES = [
      { k: "talenti", n: radici.length, t: "talenti" },
      { k: "squadre", n: sq.length, t: "squadre" },
      { k: "collegare", n: att.length, t: "da collegare" },
      { k: "stanze", n: nStanze, t: "orme negli elementi" },
      { k: "conti", ic: "€", t: "conti" },
      { k: "invita", ic: "☉", t: "invita" }
    ];
    D.getElementById("tessere").innerHTML = TES.map(function (x) {
      return '<button type="button" class="tes" data-tes="' + x.k + '" aria-pressed="' + (stato.tessera === x.k) + '"><b>' + (x.ic ? x.ic : x.n) + '</b><span>' + esc(x.t) + '</span></button>';
    }).join("");

    var pan = D.getElementById("pan");
    pan.hidden = !stato.tessera;
    h = "";
    if (stato.tessera === "talenti") {
      radici.forEach(function (r) {
        var t = d.talenti[r.talento_id] || {};
        var sue = d.orme.filter(function (o) { return o.id !== r.id && (o.filo_id === r.id || o.orma_madre_id === r.id); });
        h += riga(r, { titolo: t.nome || titolo(r), colore: t.elemento, sotto: [t.stanza || NOME_EL[t.elemento] || "", sue.length ? (sue.length === 1 ? "1 orma" : sue.length + " orme") : ""].filter(Boolean).join(" · ") });
        sue.slice(0, 3).forEach(function (o) { h += riga(o, { figlia: true, colore: o.elemento, sotto: [o.luogo, giornoMese(o.accaduto_il)].filter(Boolean).join(" · ") }); });
      });
      h += '<button class="gesto" type="button" data-rotta="talenti"><i>+</i>aggiungi un talento</button>';
    } else if (stato.tessera === "squadre") {
      var perId = {}; sq.forEach(function (s) { perId[s.id] = s; });
      var radiciSq = sq.filter(function (s) { return !s.madre || !perId[s.madre]; });
      radiciSq.sort(function (a, b) { return (b.tipo === "micelio") - (a.tipo === "micelio"); });
      var fatta = {};
      var giu = function (s, liv) {
        var info = liv === 0
          ? [s.quanti_dentro === 1 ? "1 persona" : (s.quanti_dentro || 0) + " persone", s.esiste_dal ? "dal " + giornoMese(s.esiste_dal) : ""]
          : [s.quando ? giornoMese(s.quando) : "", s.luogo, s.quanti_dentro === 1 ? "1 persona" : (s.quanti_dentro || 0) + " persone"];
        h += riga({ id: s.id, titolo: s.titolo, elemento: s.elemento }, { figlia: liv > 0, colore: s.tipo === "festa" ? "sviluppo" : s.elemento,
          sotto: info.filter(Boolean).join(" · "), tag: s.ruolo === "coordinatore" ? "coordini" : (liv > 0 && s.tipo === "festa" ? "evento" : "") });
        sq.filter(function (x) { return x.madre === s.id; }).forEach(function (x) { giu(x, liv + 1); });
      };
      radiciSq.forEach(function (s) {
        var f = s.tipo === "micelio" ? "micelio" : "le altre squadre";
        if (!fatta[f]) { h += '<div class="fascia">' + f + '</div>'; fatta[f] = 1; }
        giu(s, 0);
      });
      if (!sq.length) h = '<div class="vuoto-tx">Qua vengono segnate le squadre a cui partecipi.</div>';
    } else if (stato.tessera === "collegare") {
      att.forEach(function (o) { h += riga(o, { colore: "#5A7A8C", sotto: [String(o.tipo || "").replace("_", " "), giornoMese(o.accaduto_il)].filter(Boolean).join(" · ") }); });
    } else if (stato.tessera === "stanze") {
      h = '<div class="anello" id="anello"><div class="giro-l"></div><div class="centro"><img src="nexus-fermo.webp?v=10010900" alt=""></div></div>';
    } else if (stato.tessera === "conti") {
      h = '<a class="riga" href="#" data-rotta="costi"><span class="tx"><b>' + String(Math.round(d.ore * 10) / 10).replace(".", ",") + ' ore messe</b><small>entrate e uscite</small></span><span class="fr">›</span></a>';
    }
    pan.innerHTML = h;
    var A = D.getElementById("anello");
    if (A) STANZE.forEach(function (s, i) {
      var a = -Math.PI / 2 + i * 2 * Math.PI / 5, r = 38;
      var n = d.orme.filter(function (o) { return o.elemento === s.el && o.tipo !== "talento_radice"; }).length;
      var b = D.createElement("button"); b.className = "st"; b.type = "button"; b.setAttribute("aria-pressed", filtro === s.el ? "true" : "false");
      b.style.left = (50 + r * Math.cos(a)) + "%"; b.style.top = (50 + r * Math.sin(a)) + "%"; b.style.setProperty("--c", s.c);
      b.innerHTML = '<span class="so"><ak-solido tipo="' + s.solido + '" colore="' + s.c + '"></ak-solido></span><b>' + s.nome + '</b><em>' + (n === 1 ? "1 orma" : n + " orme") + '</em>';
      b.onclick = function () { disegna(D, d, filtro === s.el ? null : s.el, stato); };
      A.appendChild(b);
    });

    /* i tocchi */
    var ridisegna = function (nuovo) { disegna(D, d, filtro, nuovo); };
    Array.prototype.forEach.call(D.querySelectorAll("a[data-id]"), function (a) {
      a.onclick = function (e) { e.preventDefault(); apri(a.getAttribute("data-id")); };
    });
    Array.prototype.forEach.call(D.querySelectorAll("[data-rotta]"), function (a) {
      a.onclick = function (e) { e.preventDefault(); vaiA(a.getAttribute("data-rotta")); };
    });
    var tf = D.querySelector("[data-togli-filtro]"); if (tf) tf.onclick = function () { disegna(D, d, null, stato); };
    Array.prototype.forEach.call(D.querySelectorAll("[data-tes]"), function (b) {
      b.onclick = function () {
        var k = b.getAttribute("data-tes");
        if (k === "invita") {
          if (window.SpazioVivo && typeof window.SpazioVivo.invito === "function") return window.SpazioVivo.invito({});
          return vaiA("invito");
        }
        ridisegna({ aperto: stato.aperto, tessera: stato.tessera === k ? null : k });
      };
    });
    /* lo stato: si tocca e passa al successivo — solo sulle proprie orme */
    Array.prototype.forEach.call(D.querySelectorAll("button[data-stato]"), function (b) {
      if (b.getAttribute("aria-disabled") === "true") return;
      b.onclick = async function () {
        var id = b.getAttribute("data-stato");
        var o = S.obiettivi.filter(function (x) { return x.id === id; })[0]; if (!o) return;
        var prima = o.stadio, i = STADI.map(function (s) { return s[0]; }).indexOf(stadioDi(o));
        o.stadio = STADI[(i + 1) % STADI.length][0];
        ridisegna(stato);
        var r = await db.from("orme").update({ stadio: o.stadio }).eq("id", id).select("id");
        if (r.error || !r.data || !r.data.length) { console.warn("lo stato non si è salvato:", r.error); o.stadio = prima; ridisegna(stato); }
      };
    });
    /* la persona: si apre l'elenco della rubrica, si tocca un nome */
    Array.prototype.forEach.call(D.querySelectorAll("button[data-chi]"), function (b) {
      if (b.getAttribute("aria-disabled") === "true") return;
      b.onclick = function () { var id = b.getAttribute("data-chi"); ridisegna({ tessera: stato.tessera, aperto: stato.aperto === id ? null : id }); };
    });
    Array.prototype.forEach.call(D.querySelectorAll("button[data-proponi]"), function (b) {
      b.onclick = async function () {
        var id = b.getAttribute("data-proponi"), pid = b.getAttribute("data-persona");
        b.disabled = true;
        var r = await db.rpc("fm_chiama_orma", { p_orma: id, p_persona: pid });
        if (r.error || r.data === false) { console.warn("la proposta non è partita:", r.error); b.disabled = false; return; }
        var nome = ((d.rubrica || []).filter(function (x) { return x.persona_id === pid; })[0] || {}).nome || "";
        (d.chi[id] = d.chi[id] || []).push({ nome: nome, attesa: true, persona: pid });
        ridisegna({ tessera: stato.tessera, aperto: null });
      };
    });
    D.getElementById("prat").onclick = function (e) { e.preventDefault(); vaiA("anthakarana"); };
  }

  /* ── la porta ──────────────────────────────────────────────────── */
  async function ormaTempio(dove) {
    var box = typeof dove === "string" ? document.querySelector(dove) : dove;
    if (!box || !window.FMPiatto) return;
    var R = await window.FMPiatto.monta(box, INDIRIZZO);
    var D = R && R.body ? R : (R && R.ownerDocument) || null;
    if (!D) return;
    disegna(D, await leggi(), null);
  }

  window.SpazioVivo = window.SpazioVivo || {};
  window.SpazioVivo.ormaTempio = ormaTempio;
})();
