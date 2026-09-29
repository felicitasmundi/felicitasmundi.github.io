/* ═══════════════════════════════════════════════════════════════
   FM-VICINATI — la stanza Vicinati, pensata come casa dell'app
   (l'elemento terra: le radici). Si costruisce con Gab, un pezzo alla volta.

   29 settembre, nell'ordine dato da Gab:
     il quadrante — il giorno · la luna · il santo
     ① ora in onda (le fasce della radio) · prossimi appuntamenti
     ② novità dai vicinati
     ③ calendario — i sette giorni
     ④ karma yoga — i bisogni, dal più vicino al più lontano
     ⑤ il tuo vicinato — la mappa, raggio fisso di 20 km, con le cinque
        famiglie di luoghi: operatori · ospitalità · aziende agricole ·
        scuole · templi
   ⚠️ La tavola dei luoghi non esiste ancora: «aggiungi un luogo» lo dice.

   Vuole:   fm-piatto.js · fm-orma-mia.js (la luna) · `db` · FASCE e vai del guscio
   Espone:  SpazioVivo.vicinati(dove)
   ═══════════════════════════════════════════════════════════════ */
(function () {
  "use strict";
  var INDIRIZZO = "APP.FELICITASMUNDI/piatti/vicinati-piatto.html";
  var MESI = ["gennaio","febbraio","marzo","aprile","maggio","giugno","luglio","agosto","settembre","ottobre","novembre","dicembre"];
  var GIORNI = ["domenica","lunedì","martedì","mercoledì","giovedì","venerdì","sabato"];
  var BREVI = ["dom","lun","mar","mer","gio","ven","sab"];
  var RAGGIO_KM = 20;

  function vaiA(r, x) { if (typeof window.vai === "function") window.vai(r, x); }
  function apri(id) {
    if (window.SpazioVivo && typeof window.SpazioVivo.apriOrma === "function") return window.SpazioVivo.apriOrma(id);
    vaiA("orma", { id: id });
  }
  function oraTx(h) {
    var o = Math.floor(h), m = Math.round((h - o) * 60);
    return (o < 10 ? "0" : "") + o + ":" + (m < 10 ? "0" : "") + m;
  }
  function quando(d) {
    var x = new Date(d); if (isNaN(x)) return "";
    return x.getDate() + " " + MESI[x.getMonth()].slice(0, 3);
  }
  function titolo(o) {
    if (o && o.titolo) return o.titolo;
    var s = String((o && o.contenuto) || "").trim().split("\n")[0];
    return s.length > 70 ? s.slice(0, 68).trim() + "…" : (s || "senza titolo");
  }
  function km(a, b) {
    var R = 6371, r = Math.PI / 180;
    var dl = (b.lat - a.lat) * r, dg = (b.lon - a.lon) * r;
    var h = Math.sin(dl / 2) * Math.sin(dl / 2) + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dg / 2) * Math.sin(dg / 2);
    return 2 * R * Math.asin(Math.sqrt(h));
  }

  /* ── il quadrante ── */
  async function quadrante(P, R) {
    var oggi = new Date();
    var lu = (window.FMOrmaMia && window.FMOrmaMia.luna) ? window.FMOrmaMia.luna() : { nome: "", segno: "" };
    var santo = "";
    try {
      var sa = await db.from("santi").select("intero").eq("mese", oggi.getMonth() + 1).eq("giorno", oggi.getDate()).limit(1);
      if (!sa.error && sa.data && sa.data[0]) santo = sa.data[0].intero;
    } catch (e) {}
    P.riempi(R, { giorno: { data: oggi.getDate() + " " + MESI[oggi.getMonth()], settimana: GIORNI[oggi.getDay()],
                            luna: lu.segno || "", fase: lu.nome || "", santo: santo } });
  }

  /* ── ① ora in onda: le fasce del palinsesto del guscio ── */
  function inOnda(P, R) {
    var F = window.FASCE || [];
    if (!F.length) return;
    var d = new Date(), h = d.getHours() + d.getMinutes() / 60, i = 0;
    for (var k = 0; k < F.length; k++) {
      var f = F[k];
      if (f.da < f.a ? (h >= f.da && h < f.a) : (h >= f.da || h < f.a)) { i = k; break; }
    }
    P.riempi(R, { onda: { nome: F[i].n, desc: F[i].d } });
    var dopo = [F[(i + 1) % F.length], F[(i + 2) % F.length]];
    P.stampa(R, "fascia", dopo, function (c, f) { P.riempi(c, { fascia: { ora: oraTx(f.da), nome: f.n } }); });
    P.gesto(R, "ascolta", function () {
      var play = document.querySelector(".r-play, #r-play, [data-g='ascolta-radio']");
      if (play) play.click();
    });
  }

  /* ── prossimi appuntamenti · novità ── */
  async function appuntamenti(P, R) {
    var ora = new Date().toISOString(), app = [], nov = [];
    try {
      var a = await db.from("orme").select("id,titolo,contenuto,inizio_il,luogo")
        .gte("inizio_il", ora).order("inizio_il").limit(4);
      app = a.error ? [] : (a.data || []);
      var n = await db.from("orme").select("id,titolo,contenuto,momento,visibilita")
        .in("visibilita", ["pubblico", "vicinato"]).order("momento", { ascending: false }).limit(12);
      nov = (n.error ? [] : (n.data || [])).filter(function (o) { return o.titolo || o.contenuto; }).slice(0, 4);
    } catch (e) { console.warn("vicinati:", e); }
    P.stato(R, "app-vuoto", app.length === 0);
    P.stampa(R, "app", app, function (c, o) {
      P.riempi(c, { app: { quando: quando(o.inizio_il), titolo: titolo(o), dove: o.luogo || "" } });
      P.gesto(c, "apri-app", function () { apri(o.id); });
    });
    P.stato(R, "nov-vuoto", nov.length === 0);
    P.stampa(R, "nov", nov, function (c, o) {
      P.riempi(c, { nov: { quando: quando(o.momento), titolo: titolo(o) } });
      P.gesto(c, "apri-nov", function () { apri(o.id); });
    });
    return app;
  }

  /* ── ③ calendario: i sette giorni da oggi ── */
  function calendario(P, R, app) {
    var oggi = new Date(); oggi.setHours(0, 0, 0, 0);
    var pieni = {};
    (app || []).forEach(function (o) { var x = new Date(o.inizio_il); x.setHours(0, 0, 0, 0); pieni[x.getTime()] = true; });
    var sette = [];
    for (var k = 0; k < 7; k++) { var x = new Date(oggi); x.setDate(x.getDate() + k); sette.push(x); }
    P.stampa(R, "giorno7", sette, function (c, x, k) {
      P.riempi(c, { g7: { nome: BREVI[x.getDay()], num: String(x.getDate()) } });
      if (k === 0) c.classList.add("oggi");
      if (pieni[x.getTime()]) c.classList.add("pieno");
    });
    P.gesto(R, "apri-calendario", function () { vaiA("calendario"); });
  }

  /* ── dove sono: il comune della persona ── */
  async function doveSono() {
    try {
      var u = await db.auth.getUser();
      var id = u && u.data && u.data.user && u.data.user.id;
      if (!id) return null;
      var p = await db.from("persone").select("comune_cod").eq("id", id).single();
      var cod = p && p.data && p.data.comune_cod;
      if (!cod) return null;
      var t = await db.from("territori").select("nome,lat,lon").eq("codice", cod).limit(1);
      var r = t && t.data && t.data[0];
      return (r && r.lat != null) ? { nome: r.nome, lat: +r.lat, lon: +r.lon } : null;
    } catch (e) { return null; }
  }

  /* ── ④ karma yoga: i bisogni, dal più vicino ── */
  async function bisogni(P, R, io) {
    var lista = [];
    try {
      var b = await db.from("bisogni").select("*").limit(40);
      lista = b.error ? [] : (b.data || []);
    } catch (e) {}
    lista.forEach(function (x) {
      x._km = (io && x.lat != null && x.lon != null) ? km(io, { lat: +x.lat, lon: +x.lon }) : null;
    });
    lista.sort(function (a, b) {
      if (a._km == null && b._km == null) return 0;
      if (a._km == null) return 1; if (b._km == null) return -1;
      return a._km - b._km;
    });
    P.stato(R, "bis-vuoto", lista.length === 0);
    P.stampa(R, "bis", lista.slice(0, 6), function (c, x) {
      P.riempi(c, { bis: { titolo: x.titolo || "bisogno", dove: x._km != null ? Math.round(x._km) + " km" : (x.luogo || "") } });
    });
  }

  /* ── ⑤ la mappa: il vicinato, 20 km ── */
  function mappa(P, R, io) {
    var W = R.ownerDocument.defaultView, box = R.querySelector("#vc-map");
    P.riempi(R, { mappa: { dove: (io ? io.nome : "dove sei?") + " · " + RAGGIO_KM + " km" } });
    P.stato(R, "map-senza-comune", !io);
    Array.prototype.forEach.call(R.querySelectorAll(".vc-cat button"), function (b) {
      b.onclick = function () { b.classList.toggle("on"); };
    });
    P.gesto(R, "aggiungi-luogo", function () {
      var n = R.querySelector('[data-stato="luoghi-nota"]');
      if (n) { n.textContent = "Per aggiungere i luoghi serve la tavola dei luoghi nel database: è il prossimo passo."; n.hidden = false; }
    });
    if (!box) return;
    (function pronta(t) {
      if (!W.L) { if (t < 60) setTimeout(function () { pronta(t + 1); }, 150); return; }
      var L = W.L, c = io ? [io.lat, io.lon] : [41.9, 12.5];
      var m = L.map(box, { zoomControl: false, attributionControl: true, scrollWheelZoom: false });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 18, attribution: "© OpenStreetMap" }).addTo(m);
      if (io) {
        var cer = L.circle(c, { radius: RAGGIO_KM * 1000, color: "#D4AF6A", weight: 1, opacity: .6, dashArray: "4 6", fill: false }).addTo(m);
        L.circleMarker(c, { radius: 6, color: "#F5F0E6", weight: 2, fillColor: "#D4AF6A", fillOpacity: 1 }).addTo(m).bindTooltip("sei qui");
        m.fitBounds(cer.getBounds(), { padding: [8, 8] });
      } else m.setView(c, 5);
      [300, 900, 2000].forEach(function (ms) { setTimeout(function () { m.invalidateSize(); }, ms); });
    })(0);
  }

  async function vicinati(dove) {
    var box = typeof dove === "string" ? document.querySelector(dove) : dove;
    if (!box || !window.FMPiatto) return;
    var P = window.FMPiatto;
    var R = await P.monta(box, INDIRIZZO);
    if (R && R.body) R = R.body;
    await quadrante(P, R);
    inOnda(P, R);
    var app = await appuntamenti(P, R);
    calendario(P, R, app);
    var io = await doveSono();
    await bisogni(P, R, io);
    mappa(P, R, io);
  }
  window.SpazioVivo = window.SpazioVivo || {};
  window.SpazioVivo.vicinati = vicinati;
})();
