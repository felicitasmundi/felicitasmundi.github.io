/* ═══════════════════════════════════════════════════════════════
   FM-ORMA-TEMPIO — «La mia orma» col rito del tempio.
   ⭐ 1 ottobre, Gab: «mi fai vedere come possiamo rifare la mia orma ora che abbiamo settato
      le 5 stanze?» → «per me questa visibilità orma puoi già pubblicarla».
   Disegno: la-mia-orma-tempio-piatto.html. Chi sei in alto, le tue orme nelle cinque stanze
   (i cinque solidi: toccandone uno le porte mostrano solo quella stanza), la frase, e le porte:
   Settimana · Talenti · Squadre · Da collegare · Conti.
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
    } catch (e) { console.warn("la mia orma:", e); }
    return d;
  }

  /* ── disegnare ─────────────────────────────────────────────────── */
  function riga(o, opz) {
    opz = opz || {};
    var c = COL[opz.colore || o.elemento] || "#D4AF6A";
    return '<a class="riga' + (opz.figlia ? " figlia" : "") + (opz.chiusa ? " chiusa" : "") + '" href="#" data-id="' + esc(o.id) + '" data-el="' + esc(o.elemento || "") + '" style="--c:' + c + (opz.rientro ? ";margin-left:" + opz.rientro + "rem" : "") + '">' +
      (opz.figlia ? "" : '<span class="pt"></span>') +
      '<span class="tx"><b>' + esc(opz.titolo || titolo(o)) + '</b>' + (opz.sotto ? '<small>' + esc(opz.sotto) + '</small>' : "") + '</span>' +
      (opz.tag ? '<span class="tag">' + esc(opz.tag) + '</span>' : "") + (opz.figlia ? "" : '<span class="fr">›</span>') + '</a>';
  }
  function porta(D, id, n, html, vuota) {
    var p = D.getElementById(id); if (!p) return;
    p.querySelector("summary .n").textContent = n || "";
    p.querySelector(".dentro").innerHTML = html || '<div class="vuoto">' + esc(vuota || "") + '</div>';
  }

  function disegna(D, d, filtro) {
    var pe = d.persona || {};
    var vo = D.getElementById("vo");
    vo.innerHTML = pe.foto_url ? '<img src="' + esc(pe.foto_url) + '" alt="">' : esc(String(pe.nome || "·").trim().charAt(0).toLowerCase());
    D.getElementById("grado").textContent = (pe.grado || "").replace("_", " ");
    var oggi = new Date(); D.getElementById("giorno").textContent = oggi.getDate() + " " + MESI[oggi.getMonth()];
    var L = luna(oggi); var lu = D.getElementById("luna"); lu.textContent = L[2]; lu.title = L[1];
    D.getElementById("santo").textContent = d.santo || "";

    /* le cinque stanze */
    var A = D.getElementById("anello");
    if (!A.querySelector(".st")) STANZE.forEach(function (s, i) {
      var a = -Math.PI / 2 + i * 2 * Math.PI / 5, r = 38;
      var b = D.createElement("button"); b.className = "st"; b.type = "button"; b.setAttribute("aria-pressed", "false"); b.dataset.el = s.el;
      b.style.left = (50 + r * Math.cos(a)) + "%"; b.style.top = (50 + r * Math.sin(a)) + "%"; b.style.setProperty("--c", s.c);
      b.innerHTML = '<span class="so"><ak-solido tipo="' + s.solido + '" colore="' + s.c + '"></ak-solido></span><b>' + s.nome + '</b><em></em>';
      b.onclick = function () { disegna(D, d, filtro === s.el ? null : s.el); };
      A.appendChild(b);
    });
    Array.prototype.forEach.call(A.querySelectorAll(".st"), function (b) {
      var n = d.orme.filter(function (o) { return o.elemento === b.dataset.el && o.tipo !== "talento_radice"; }).length;
      b.querySelector("em").textContent = n === 1 ? "1 orma" : n + " orme";
      b.setAttribute("aria-pressed", filtro === b.dataset.el ? "true" : "false");
    });
    D.documentElement.style.setProperty("--el", filtro ? COL[filtro] : "#D4AF6A");
    var passa = function (o) { return !filtro || o.elemento === filtro; };

    /* Settimana */
    var S = d.settimana || { obiettivi: [], passi: {} };
    var ob = S.obiettivi.filter(passa);
    var grp = { "da fare": [], "in corso": [], "fatti": [], "karma yoga": [] };
    ob.forEach(function (o) { (o.gruppo === "karma" ? grp["karma yoga"] : grp[stadio(o.stadio)]).push(o); });
    var h = "";
    ["da fare", "in corso", "fatti", "karma yoga"].forEach(function (k) {
      if (!grp[k].length) return;
      h += '<div class="fascia">' + k + '</div>';
      grp[k].forEach(function (o) {
        var passi = (S.passi && S.passi[o.id]) || [];
        var sotto = [NOME_EL[o.elemento] || ""];
        if (o.entro_il) sotto.push("entro " + giornoMese(o.entro_il));
        if (passi.length) sotto.push(passi.length + (passi.length === 1 ? " passo" : " passi"));
        if (k === "karma yoga") sotto.push(stadio(o.stadio) === "fatti" ? "chiuso" : stadio(o.stadio));
        h += riga(o, { colore: k === "karma yoga" ? "karma" : o.elemento, sotto: sotto.filter(Boolean).join(" · "), tag: k === "karma yoga" ? "karma yoga" : "", chiusa: k === "fatti" });
      });
    });
    var nS = ["da fare", "in corso", "fatti", "karma yoga"].map(function (k) { return grp[k].length ? k + " · " + grp[k].length : ""; }).filter(Boolean).join(" · ");
    porta(D, "p-sett", nS, h ? h + '<a class="riga" href="#" data-rotta="settimana"><span class="tx"><b>tutta la settimana, coi passi</b></span><span class="fr">›</span></a>' : "",
      "Nessun obiettivo per questa settimana. Scrivi il primo nello spazio in basso.");

    /* Talenti: le radici e le orme sotto */
    var radici = d.orme.filter(function (o) { return o.tipo === "talento_radice"; });
    h = "";
    radici.forEach(function (r) {
      var t = d.talenti[r.talento_id] || {};
      if (filtro && t.elemento !== filtro) return;
      var sue = d.orme.filter(function (o) { return o.id !== r.id && (o.filo_id === r.id || o.orma_madre_id === r.id); });
      h += riga(r, { titolo: t.nome || titolo(r), colore: t.elemento, sotto: (t.stanza || NOME_EL[t.elemento] || "") + " · " + (sue.length ? sue.length + (sue.length === 1 ? " orma" : " orme") : "senza orme") });
      sue.slice(0, 3).forEach(function (o) { h += riga(o, { figlia: true, colore: o.elemento, sotto: [o.luogo, giornoMese(o.accaduto_il)].filter(Boolean).join(" · "), tag: stadio(o.stadio) }); });
    });
    h += '<button class="gesto" type="button" data-rotta="talenti"><i>+</i>aggiungi un talento</button>';
    porta(D, "p-tal", radici.length ? (radici.length === 1 ? "1 talento" : radici.length + " talenti") : "", h);

    /* Squadre: i miceli in cima, sotto di loro le orme figlie che sono squadre anche loro */
    var sq = d.squadre, perId = {};
    sq.forEach(function (s) { perId[s.id] = s; });
    var radiciSq = sq.filter(function (s) { return !s.madre || !perId[s.madre]; });
    radiciSq.sort(function (a, b) { return (b.tipo === "micelio") - (a.tipo === "micelio"); });
    h = ""; var fasciaFatta = {};
    function sotto(s, liv) {
      var q = s.quando ? giornoMese(s.quando) : "";
      var info = liv === 0
        ? [s.quanti_dentro === 1 ? "1 persona" : (s.quanti_dentro || 0) + " persone", s.esiste_dal ? "dal " + giornoMese(s.esiste_dal) : ""]
        : [q, s.luogo, s.quanti_dentro === 1 ? "1 persona" : (s.quanti_dentro || 0) + " persone"];
      h += riga({ id: s.id, titolo: s.titolo, elemento: s.elemento }, { figlia: liv > 0, rientro: liv > 1 ? (liv - 1) * 1.2 : 0,
        colore: s.tipo === "festa" ? "sviluppo" : s.elemento, sotto: info.filter(Boolean).join(" · "),
        tag: s.ruolo === "coordinatore" ? "coordini" : (liv > 0 && s.tipo === "festa" ? "evento" : "") });
      sq.filter(function (x) { return x.madre === s.id; }).forEach(function (x) { sotto(x, liv + 1); });
    }
    radiciSq.forEach(function (s) {
      if (filtro && s.elemento !== filtro) return;
      var f = s.tipo === "micelio" ? "micelio" : "le altre squadre";
      if (!fasciaFatta[f]) { h += '<div class="fascia">' + f + '</div>'; fasciaFatta[f] = 1; }
      sotto(s, 0);
    });
    porta(D, "p-sq", sq.length ? (sq.length === 1 ? "1 squadra" : sq.length + " squadre") : "", h, "Qua vengono segnate le squadre a cui partecipi.");

    /* Da collegare */
    var att = d.orme.filter(function (o) { return !o.talento_id && !o.filo_id && !o.orma_madre_id &&
      ["talento_radice", "micelio", "festa"].indexOf(o.tipo) < 0 && passa(o); });
    var pc = D.getElementById("p-col"); pc.hidden = att.length === 0;
    h = ""; att.slice(0, 12).forEach(function (o) { h += riga(o, { colore: "#5A7A8C", sotto: [String(o.tipo || "").replace("_", " "), giornoMese(o.accaduto_il)].filter(Boolean).join(" · ") }); });
    porta(D, "p-col", att.length === 1 ? "1 orma" : att.length + " orme", h);
    Array.prototype.forEach.call(pc.querySelectorAll(".riga .pt"), function (x) { x.style.background = "#5A7A8C"; x.style.boxShadow = "none"; });

    /* Conti */
    porta(D, "p-conti", "", '<div class="conti"><span><b>' + String(Math.round(d.ore * 10) / 10).replace(".", ",") + '</b>ore messe</span></div>' +
      '<a class="riga" href="#" data-rotta="costi"><span class="tx"><b>entrate e uscite</b></span><span class="fr">›</span></a>');

    /* i tocchi */
    Array.prototype.forEach.call(D.querySelectorAll("a.riga[data-id]"), function (a) {
      a.onclick = function (e) { e.preventDefault(); apri(a.getAttribute("data-id")); };
    });
    Array.prototype.forEach.call(D.querySelectorAll("[data-rotta]"), function (a) {
      a.onclick = function (e) { e.preventDefault(); vaiA(a.getAttribute("data-rotta")); };
    });
    D.getElementById("prat").onclick = function (e) { e.preventDefault(); vaiA("anthakarana"); };
    D.getElementById("invita").onclick = function (e) { e.preventDefault(); vaiA("invito"); };
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
