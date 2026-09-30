/* ═══════════════════════════════════════════════════════════════
   FM-CALENDARIO — i tuoi appuntamenti, e le voci per vicinanza.

   ⭐ 29 settembre, Gab: prima i tuoi appuntamenti; poi feste · trattamenti · corsi ·
      incontri di luna · riunioni · ricorrenze, ognuna come il karma yoga:
      Antahkarana · più vicino · più lontano. «Vicino» si misura da «Dove ti trovi».

   ⭐ Disegno di Design: calendario-piatto.html.
   ⭐ Una data è un'orma con una data: accaduto_il, inizio_il o entro_il.
      Il giorno, il giorno della settimana e l'ora li calcola il codice.
   ⭐ Si vedono le orme che si possono vedere: le proprie, quelle dove si
      è dentro, e quelle aperte. Quelle che il database non fa leggere
      non arrivano nemmeno — nessuna riga chiusa da mostrare.

   ⚠️ «Porta le date nel telefono» funziona solo dentro l'app: da computer
      il tasto resta spento, come l'ha disegnato Design.

   Vuole:   fm-piatto.js prima · `db` · `vai`
   Espone:  SpazioVivo.calendario(dove)
   ═══════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  var INDIRIZZO = "APP.FELICITASMUNDI/piatti/calendario-piatto.html";
  var MESI = ["gennaio","febbraio","marzo","aprile","maggio","giugno","luglio",
              "agosto","settembre","ottobre","novembre","dicembre"];
  var GIORNI = ["dom","lun","mar","mer","gio","ven","sab"];
  var STANZE = { terra: "I Vicinati", acqua: "L\u2019Emporio", fuoco: "L\u2019Assistenza",
                 aria: "L\u2019Edizione", etere: "La Scuola" };
  var F = function () { return window.FMPiatto; };

  function quandoDi(o) { return o.inizio_il || o.accaduto_il || o.entro_il || null; }
  function oggi() { var d = new Date(); return d.getDate() + " " + MESI[d.getMonth()]; }

  /* ── i tuoi: le orme con un giorno che hai scritto tu, o dove sei dentro ── */
  async function leggi() {
    var d = { io: null, orme: [], madri: {} };
    try {
      var u = await db.auth.getUser();
      d.io = u && u.data && u.data.user && u.data.user.id;
      if (!d.io) return d;

      var dentro = [];
      try {
        var op = await db.from("orma_persone").select("orma_id,preso_il,lasciato_il").eq("persona_id", d.io);
        dentro = (op.error ? [] : op.data || []).filter(function (r) { return r.preso_il && !r.lasciato_il; })
          .map(function (r) { return r.orma_id; });
      } catch (e) {}

      var da = new Date(); da.setMonth(da.getMonth() - 1); da.setDate(1);
      var chi = "persona_id.eq." + d.io + (dentro.length ? ",id.in.(" + dentro.join(",") + ")" : "");
      var o = await db.from("orme")
        .select("id,titolo,contenuto,elemento,luogo,visibilita,accaduto_il,inizio_il," +
                "entro_il,orma_madre_id")
        .or(chi)
        .or("accaduto_il.gte." + da.toISOString().slice(0, 10) +
            ",inizio_il.gte." + da.toISOString() +
            ",entro_il.gte." + da.toISOString().slice(0, 10))
        .limit(300);
      d.orme = (o.error ? [] : (o.data || [])).filter(quandoDi);

      var mid = d.orme.map(function (x) { return x.orma_madre_id; }).filter(Boolean);
      if (mid.length) {
        var m = await db.from("orme").select("id,titolo").in("id", mid);
        (m.error ? [] : m.data || []).forEach(function (r) { d.madri[r.id] = r.titolo; });
      }
    } catch (e) { console.warn("calendario:", e); }
    return d;
  }

  /* ── una voce: le orme di quella voce da oggi in poi, per vicinanza ──
     Le orme di tipo festa / assistenza / lezione entrano da sole; le altre con orme.categoria.
     Antahkarana = le orme dell'elemento nexus (lo sviluppo). */
  var TIPO_DI = { festa: "festa", trattamento: "assistenza", corso: "lezione" };
  async function leggiVoce(voce, luoghi) {
    var oggi = new Date(); oggi.setHours(0, 0, 0, 0);
    var campi = "id,titolo,contenuto,tipo,elemento,luogo,inizio_il,accaduto_il,entro_il,persona_id";
    var lista = [];
    try {
      var quando = "inizio_il.gte." + oggi.toISOString() + ",accaduto_il.gte." + oggi.toISOString().slice(0, 10);
      var q = db.from("orme").select(campi + ",categoria").or(quando);
      q = TIPO_DI[voce] ? q.or("tipo.eq." + TIPO_DI[voce] + ",categoria.eq." + voce) : q.eq("categoria", voce);
      var r = await q.limit(300);
      if (r.error && TIPO_DI[voce]) {        /* la colonna categoria non c'è ancora: solo il tipo */
        r = await db.from("orme").select(campi).or(quando).eq("tipo", TIPO_DI[voce]).limit(300);
      }
      lista = (r.error ? [] : r.data || []).filter(quandoDi);

      var chi = lista.map(function (x) { return x.persona_id; }).filter(Boolean);
      var cod = {}, com = {};
      if (chi.length) {
        var pc = await db.from("persone").select("id,comune_cod").in("id", chi);
        ((pc && pc.data) || []).forEach(function (p) { cod[p.id] = p.comune_cod; });
        var cods = Object.keys(cod).map(function (k) { return cod[k]; }).filter(Boolean);
        if (cods.length) {
          var tt = await db.from("territori").select("codice,nome,lat,lon").in("codice", cods);
          ((tt && tt.data) || []).forEach(function (t) { com[t.codice] = { nome: t.nome, lat: +t.lat, lon: +t.lon }; });
        }
      }
      var misura = window.FMDove && window.FMDove.kmMin;
      lista.forEach(function (x) {
        var c = com[cod[x.persona_id]];
        x._comune = c ? c.nome : "";
        x._km = (misura && c) ? misura(luoghi, c) : null;
      });
    } catch (e) { console.warn("calendario, " + voce + ":", e); }
    lista.sort(function (a, b) { return new Date(quandoDi(a)) - new Date(quandoDi(b)); });
    var R = (window.FMDove && window.FMDove.raggio) || 20;
    return {
      a: lista.filter(function (x) { return x.elemento === "nexus"; }),
      v: lista.filter(function (x) { return x.elemento !== "nexus" && x._km != null && x._km <= R; }),
      l: lista.filter(function (x) { return x.elemento !== "nexus" && !(x._km != null && x._km <= R); })
        .sort(function (a, b) { return (a._km == null ? 1e9 : a._km) - (b._km == null ? 1e9 : b._km); })
    };
  }

  /* ── le ricorrenze: le nostre (feste_felicitas) e quelle indiane, nei prossimi tre mesi ── */
  async function leggiRicorrenze() {
    var oggi = new Date(); oggi.setHours(0, 0, 0, 0);
    var fino = new Date(oggi); fino.setMonth(fino.getMonth() + 3);
    var iso = function (x) { return x.getFullYear() + "-" + String(x.getMonth() + 1).padStart(2, "0") + "-" + String(x.getDate()).padStart(2, "0"); };
    var out = [];
    try {
      var f = await db.from("feste_felicitas").select("*").limit(400);
      ((f && f.data) || []).forEach(function (r) {
        if (!r.nome) return;
        var x = null;
        if (r.mese && r.giorno) {
          x = new Date(oggi.getFullYear(), r.mese - 1, r.giorno);
          if (x < oggi) x.setFullYear(x.getFullYear() + 1);
        } else if (r.data) x = new Date(r.data);
        if (x && !isNaN(x) && x >= oggi && x <= fino) out.push({ x: x, nome: r.nome, fonte: "FelicitasMundi" });
      });
      var i = await db.from("feste_indiane").select("*").gte("data", iso(oggi)).lte("data", iso(fino)).limit(200);
      ((i && i.data) || []).forEach(function (r) {
        if (r.nome && r.data) out.push({ x: new Date(r.data), nome: r.nome, fonte: "tradizione indiana" });
      });
    } catch (e) { console.warn("ricorrenze:", e); }
    return out.sort(function (a, b) { return a.x - b.x; });
  }

  function perMese(orme) {
    var mesi = [];
    orme.slice().sort(function (a, b) { return new Date(quandoDi(a)) - new Date(quandoDi(b)); })
      .forEach(function (o) {
        var x = new Date(quandoDi(o));
        var k = x.getFullYear() + "-" + x.getMonth();
        var m = mesi.filter(function (y) { return y.k === k; })[0];
        if (!m) { m = { k: k, nome: MESI[x.getMonth()] + " " + x.getFullYear(), dentro: [] }; mesi.push(m); }
        m.dentro.push(o);
      });
    return mesi;
  }

  function disegna(R, d, stato) {
    var P = F();
    P.gesto(R, "indietro", function () { if (typeof window.vai === "function") window.vai("vicinati"); });

    var mesi = perMese(d.orme);
    if (!stato.mese && mesi.length) stato.mese = mesi[0].k;

    P.stampa(R, "mese", mesi, function (c, m) {
      P.riempi(c, { mese: { nome: m.nome } });
      c.setAttribute("aria-pressed", stato.mese === m.k ? "true" : "false");
      P.gesto(c, "scegli-mese", function () { stato.mese = m.k; disegna(R, d, stato); });
    });

    var visti = mesi.filter(function (m) { return m.k === stato.mese; });
    P.stato(R, "senza-date", !visti.length || !visti[0].dentro.length);

    P.stampa(R, "mese-date", visti, function (c, m) {
      P.riempi(c, { mese: { nome: m.nome } });
      P.stampa(c, "orma", m.dentro, function (oc, o) {
        var x = new Date(quandoDi(o));
        var ora = o.inizio_il ? String(x.getHours()).padStart(2, "0") + ":" +
                                String(x.getMinutes()).padStart(2, "0") : "";
        P.riempi(oc, {
          orma: { titolo: o.titolo || (o.contenuto || "").split("\n")[0].slice(0, 60),
                  giorno: String(x.getDate()), giorno_settimana: GIORNI[x.getDay()],
                  ora: ora, luogo: o.luogo || "", elemento: o.elemento,
                  madre_titolo: d.madri[o.orma_madre_id] || "",
                  visibilita: o.visibilita || "" },
          stanza: { nome: STANZE[o.elemento] || "" }
        });
        P.stato(oc, "ha-luogo", !!o.luogo);
        P.stato(oc, "ha-madre", !!d.madri[o.orma_madre_id]);
        P.stato(oc, "aperta", true);
        P.stato(oc, "chiusa", false);
        P.gesto(oc, "apri-orma", function () {
          if (window.SpazioVivo && typeof window.SpazioVivo.apriOrma === "function")
            return window.SpazioVivo.apriOrma(o.id);
          if (typeof window.vai === "function") window.vai("orma", { id: o.id });
        });
      });
    });

    /* il telefono: solo dentro l'app */
    var inApp = !!(window.Capacitor || window.cordova ||
                   /FelicitasMundi|wv\)|Android.*Version\/\d/.test(navigator.userAgent || ""));
    P.stato(R, "in-app", inApp);
    P.stato(R, "da-computer", !inApp);
    P.gesto(R, "porta-nel-telefono", function () {
      if (window.SpazioVivo && typeof window.SpazioVivo.porteDate === "function")
        window.SpazioVivo.porteDate(d.orme);
    });
  }

  /* ── una voce disegnata: tre gruppi, tre righe l'uno, «[n] altri» ── */
  function disegnaVoce(R, G) {
    var P = F();
    ["a", "v", "l"].forEach(function (g) {
      var tutti = false;
      function giro() {
        P.stampa(R, "ev-" + g, tutti ? G[g] : G[g].slice(0, 3), function (c, o) {
          var x = new Date(quandoDi(o));
          var ora = o.inizio_il ? String(x.getHours()).padStart(2, "0") + ":" + String(x.getMinutes()).padStart(2, "0") : "";
          var km = o._km != null ? Math.round(o._km) + " km" : "";
          P.riempi(c, { ev: { giorno: String(x.getDate()), mese: MESI[x.getMonth()].slice(0, 3),
                              titolo: o.titolo || (o.contenuto || "").split("\n")[0].slice(0, 60),
                              dove: [ora, o.luogo || o._comune, km].filter(Boolean).join(" \u00b7 ") } });
          c.style.setProperty("--c", "var(--" + (o.elemento || "terra") + ")");
          P.gesto(c, "apri-ev", function () {
            if (window.SpazioVivo && typeof window.SpazioVivo.apriOrma === "function") return window.SpazioVivo.apriOrma(o.id);
            if (typeof window.vai === "function") window.vai("orma", { id: o.id });
          });
        });
        var n = G[g].length - 3;
        P.stato(R, "vuoto-" + g, G[g].length === 0);
        P.stato(R, "altri-" + g, n > 0);
        var b = R.querySelector('[data-g="altri-' + g + '"]');
        if (b) b.textContent = tutti ? "meno \u2039" : n + " altri \u203a";
      }
      var c2 = {}; c2[g] = String(G[g].length); P.riempi(R, { conto: c2 });
      P.gesto(R, "altri-" + g, function () { tutti = !tutti; giro(); });
      giro();
    });
  }

  async function calendario(dove) {
    var box = typeof dove === "string" ? document.querySelector(dove) : dove;
    if (!box || !window.FMPiatto) return;
    var P = F();
    var R = await P.monta(box, INDIRIZZO);
    if (R && R.body) R = R.body;
    var luoghi = (window.FMDove && window.FMDove.luoghi) ? await window.FMDove.luoghi() : [];
    P.riempi(R, { zona: { nomi: luoghi.map(function (l) { return l.nome; }).join(", ") } });

    async function scegli(t) {
      Array.prototype.forEach.call(R.querySelectorAll('[data-g="scheda"]'), function (b) {
        b.setAttribute("aria-pressed", b.getAttribute("data-t") === t ? "true" : "false");
      });
      P.stato(R, "vista-tuoi", t === "tuoi");
      P.stato(R, "vista-gruppi", t !== "tuoi" && t !== "ricorrenze");
      P.stato(R, "vista-ric", t === "ricorrenze");
      P.stato(R, "ha-zona", t !== "tuoi" && t !== "ricorrenze" && luoghi.length > 0);
      if (t === "tuoi") { disegna(R, await leggi(), { mese: null }); return; }
      if (t === "ricorrenze") {
        var r = await leggiRicorrenze();
        P.stampa(R, "ric", r, function (c, x) {
          P.riempi(c, { ric: { giorno: String(x.x.getDate()), mese: MESI[x.x.getMonth()].slice(0, 3), nome: x.nome, fonte: x.fonte } });
          c.onclick = function (e) { e.preventDefault(); };
        });
        P.stato(R, "ric-vuoto", r.length === 0);
        return;
      }
      disegnaVoce(R, await leggiVoce(t, luoghi));
    }
    Array.prototype.forEach.call(R.querySelectorAll('[data-g="scheda"]'), function (b) {
      b.onclick = function () { scegli(b.getAttribute("data-t")); };
    });
    P.gesto(R, "indietro", function () { if (typeof window.vai === "function") window.vai("vicinati"); });
    await scegli("tuoi");
  }

  window.SpazioVivo = window.SpazioVivo || {};
  window.SpazioVivo.calendario = calendario;
  window.FMCalendario = { disegna: disegna };
})();
