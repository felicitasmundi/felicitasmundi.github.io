/* ═══════════════════════════════════════════════════════════════
   FM-VICINATI — la stanza Vicinati, la casa dell'app (l'elemento terra).

   ⛔⛔ Le regole di coerenza di Gab, 29 settembre (Cruscotto 24_63):
     · sotto il nome «FelicitasMundi · Comunità Eterna»
     · giorno · luna · santo solo qui, senza scritte e senza la fase
     · due quadranti: il calendario e la rubrica
     · ora in onda · prossimi appuntamenti
     · novità dai vicinati: tre articoli in riga (copertina, titolo, due frasi)
       — dal «Diario di bordo» di felicitasmundi.com
     · karma yoga col modello dell'Emporio: Antahkarana (i bisogni di sviluppo),
       più vicino, più lontano — tre per gruppo, poi «n altri»; si aggiunge un bisogno
     · il tuo vicinato: la mappa, 20 km, si ingrandisce e si allarga; le cinque
       famiglie di realtà coi loro segni, e si aggiungono
     · in fondo il cubo col simbolo della terra
   ⚠️ Servono nel database: la tavola `luoghi` e la colonna `bisogni.antahkarana`
      (fm_vicinati_01_luoghi.sql). Senza, la pagina lo dice e non si rompe.

   Vuole:   fm-piatto.js · fm-orma-mia.js (la luna) · `db` · FASCE e vai del guscio
   Espone:  SpazioVivo.vicinati(dove)
   ═══════════════════════════════════════════════════════════════ */
(function () {
  "use strict";
  var INDIRIZZO = "APP.FELICITASMUNDI/piatti/vicinati-piatto.html";
  var MESI = ["gennaio","febbraio","marzo","aprile","maggio","giugno","luglio","agosto","settembre","ottobre","novembre","dicembre"];
  var GIORNI = ["domenica","lunedì","martedì","mercoledì","giovedì","venerdì","sabato"];
  var RAGGIO_KM = 20;
  var ARTICOLI = "https://www.felicitasmundi.com/wp-json/wp/v2/posts?categories=399&per_page=3&_fields=id,title,excerpt,link,content,date";
  var ICONE = {"operatori": "<path d=\"M12 21s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.6-7 10-7 10z\"/>", "ospitalita": "<path d=\"M3 11l9-7 9 7\"/><path d=\"M5 10v10h14V10\"/><path d=\"M10 20v-6h4v6\"/>", "aziende": "<path d=\"M12 21V8\"/><path d=\"M12 12c-3 0-5-2-5-5 3 0 5 2 5 5z\"/><path d=\"M12 12c3 0 5-2 5-5-3 0-5 2-5 5z\"/><path d=\"M12 17c-3 0-5-2-5-5 3 0 5 2 5 5z\"/><path d=\"M12 17c3 0 5-2 5-5-3 0-5 2-5 5z\"/>", "scuole": "<path d=\"M3 6c3-1.5 6-1.5 9 0v14c-3-1.5-6-1.5-9 0z\"/><path d=\"M21 6c-3-1.5-6-1.5-9 0v14c3-1.5 6-1.5 9 0z\"/>", "templi": "<path d=\"M4 9l8-5 8 5\"/><path d=\"M4 9h16\"/><path d=\"M6 9v9M10 9v9M14 9v9M18 9v9\"/><path d=\"M3 20h18\"/>"};

  function vaiA(r, x) { if (typeof window.vai === "function") window.vai(r, x); }
  function apri(id) {
    if (window.SpazioVivo && typeof window.SpazioVivo.apriOrma === "function") return window.SpazioVivo.apriOrma(id);
    vaiA("orma", { id: id });
  }
  function oraTx(h) { var o = Math.floor(h), m = Math.round((h - o) * 60); return (o < 10 ? "0" : "") + o + ":" + (m < 10 ? "0" : "") + m; }
  function quando(d) { var x = new Date(d); return isNaN(x) ? "" : x.getDate() + " " + MESI[x.getMonth()].slice(0, 3); }
  function titolo(o) {
    if (o && o.titolo) return o.titolo;
    var s = String((o && o.contenuto) || "").trim().split("\n")[0];
    return s.length > 70 ? s.slice(0, 68).trim() + "…" : (s || "senza titolo");
  }
  function testo(html) { var d = document.createElement("div"); d.innerHTML = html || ""; return (d.textContent || "").replace(/\s+/g, " ").trim(); }
  function km(a, b) {
    var R = 6371, r = Math.PI / 180, dl = (b.lat - a.lat) * r, dg = (b.lon - a.lon) * r;
    var h = Math.sin(dl / 2) * Math.sin(dl / 2) + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dg / 2) * Math.sin(dg / 2);
    return 2 * R * Math.asin(Math.sqrt(h));
  }
  async function chiSono() {
    try { var u = await db.auth.getUser(); return u && u.data && u.data.user && u.data.user.id; } catch (e) { return null; }
  }
  async function comuneDi(cod) {
    if (!cod) return null;
    try {
      var t = await db.from("territori").select("codice,nome,lat,lon").eq("codice", cod).limit(1);
      var r = t && t.data && t.data[0];
      return (r && r.lat != null) ? { cod: r.codice, nome: r.nome, lat: +r.lat, lon: +r.lon } : null;
    } catch (e) { return null; }
  }

  /* ── il quadrante, senza scritte ── */
  async function quadrante(P, R) {
    var oggi = new Date(), santo = "";
    var lu = (window.FMOrmaMia && window.FMOrmaMia.luna) ? window.FMOrmaMia.luna() : { segno: "" };
    try {
      var sa = await db.from("santi").select("intero").eq("mese", oggi.getMonth() + 1).eq("giorno", oggi.getDate()).limit(1);
      if (!sa.error && sa.data && sa.data[0]) santo = sa.data[0].intero;
    } catch (e) {}
    P.riempi(R, { giorno: { data: oggi.getDate() + " " + MESI[oggi.getMonth()], settimana: GIORNI[oggi.getDay()], luna: lu.segno || "", santo: santo } });
  }

  /* ── calendario · rubrica ── */
  async function dueQuadranti(P, R, io, app) {
    var prossimo = (app && app[0]) || null, rub = null;
    try {
      if (io) {
        var rb = await db.from("contatti").select("nome,creato_il").eq("proprietario_id", io).order("creato_il", { ascending: false }).limit(1);
        rub = rb && rb.data && rb.data[0];
      }
    } catch (e) {}
    P.riempi(R, {
      cal: { data: prossimo ? quando(prossimo.inizio_il) : "niente in programma", cosa: prossimo ? titolo(prossimo) : "" },
      rub: { contatto: rub ? (rub.nome || "") : "nessun contatto", quando: rub ? quando(rub.creato_il) : "" } });
    P.gesto(R, "apri-calendario", function () { vaiA("calendario"); });
    P.gesto(R, "apri-rubrica", function () { vaiA("rubrica"); });
  }

  /* ── ora in onda ── */
  function inOnda(P, R) {
    var F = window.FASCE || []; if (!F.length) return;
    var d = new Date(), h = d.getHours() + d.getMinutes() / 60, i = 0;
    for (var k = 0; k < F.length; k++) { var f = F[k]; if (f.da < f.a ? (h >= f.da && h < f.a) : (h >= f.da || h < f.a)) { i = k; break; } }
    P.riempi(R, { onda: { nome: F[i].n, desc: F[i].d } });
    P.stampa(R, "fascia", [F[(i + 1) % F.length], F[(i + 2) % F.length]], function (c, f) { P.riempi(c, { fascia: { ora: oraTx(f.da), nome: f.n } }); });
    P.gesto(R, "ascolta", function () { var b = document.getElementById("b-play"); if (b) b.click(); });
  }

  /* ── prossimi appuntamenti ── */
  async function appuntamenti(P, R) {
    var app = [];
    try {
      var a = await db.from("orme").select("id,titolo,contenuto,inizio_il,luogo").gte("inizio_il", new Date().toISOString()).order("inizio_il").limit(4);
      app = a.error ? [] : (a.data || []);
    } catch (e) {}
    P.stato(R, "app-vuoto", app.length === 0);
    P.stampa(R, "app", app, function (c, o) {
      P.riempi(c, { app: { quando: quando(o.inizio_il), titolo: titolo(o), dove: o.luogo || "" } });
      P.gesto(c, "apri-app", function () { apri(o.id); });
    });
    return app;
  }

  /* ── novità: tre articoli ── */
  async function articoli(P, R) {
    var lista = [];
    try { var r = await fetch(ARTICOLI); if (r.ok) lista = await r.json(); } catch (e) { lista = []; }
    P.stato(R, "art-vuoto", !lista.length);
    P.stampa(R, "art", lista.slice(0, 3), function (c, a) {
      var m = /<img[^>]+src="([^"]+)"/i.exec((a.content && a.content.rendered) || "");
      var frasi = testo(a.excerpt && a.excerpt.rendered).replace(/\s*(\u2026|\[\u2026\]|\.\.\.)?\s*Leggi tutto\s*$/i, "").split(/(?<=[.!?])\s+/).filter(Boolean).slice(0, 2).join(" ");
      /* ⭐ in basso, in giallo: la zona (il «Vicinato …» scritto nell'articolo) e la data — Gab, 29 settembre */
      var tutto = testo(a.excerpt && a.excerpt.rendered) + " " + testo(a.content && a.content.rendered).slice(0, 400);
      var zm = /Vicinato\s+([A-ZÀ-Ý][\wÀ-ÿ'’ ]{1,40}?)(?=\s*(?:·|—|-|\||,|\.|$))/.exec(tutto);
      var dd = a.date ? new Date(a.date) : null;
      P.riempi(c, { art: { titolo: testo(a.title && a.title.rendered), sotto: frasi,
        zona: zm ? "Vicinato " + zm[1].trim() : "",
        data: dd && !isNaN(dd) ? dd.getDate() + " " + MESI[dd.getMonth()] + " " + dd.getFullYear() : "" } });
      var cop = c.querySelector(".cop"); if (cop && m) cop.style.backgroundImage = "url('" + m[1] + "')";
      c.setAttribute("href", a.link || "#"); c.setAttribute("target", "_blank"); c.setAttribute("rel", "noopener");
      c.onclick = function (e) { e.preventDefault(); if (a.link) window.open(a.link, "_blank", "noopener"); };
    });
  }

  /* ── karma yoga: il modello dell'Emporio ── */
  async function bisogni(P, R, io, dove) {
    var lista = [], persone = {}, comuni = {};
    try {
      var b = await db.from("bisogni").select("*").limit(80);
      lista = (b.error ? [] : (b.data || [])).filter(function (x) { return x.stato !== "chiuso" && x.stato !== "spento"; });
      var chi = lista.map(function (x) { return x.aperto_da; }).filter(Boolean);
      if (chi.length) {
        var pp = await db.from("persone_pubbliche").select("id,nome").in("id", chi);
        (pp.data || []).forEach(function (p) { persone[p.id] = { nome: p.nome }; });
        var pc = await db.from("persone").select("id,comune_cod").in("id", chi);
        (pc.data || []).forEach(function (p) { (persone[p.id] = persone[p.id] || {}).cod = p.comune_cod; });
        var cods = Object.keys(persone).map(function (k) { return persone[k].cod; }).filter(Boolean);
        if (cods.length) {
          var tt = await db.from("territori").select("codice,nome,lat,lon").in("codice", cods);
          (tt.data || []).forEach(function (t) { comuni[t.codice] = { nome: t.nome, lat: +t.lat, lon: +t.lon }; });
        }
      }
    } catch (e) { console.warn("karma yoga:", e); }
    lista.forEach(function (x) {
      var p = persone[x.aperto_da] || {}, c = comuni[p.cod];
      x._chi = p.nome || ""; x._comune = c ? c.nome : "";
      x._km = (dove && c) ? km(dove, c) : null;
    });
    lista.sort(function (a, b) { return (a._km == null ? 1e9 : a._km) - (b._km == null ? 1e9 : b._km); });
    var G = {
      a: lista.filter(function (x) { return x.antahkarana === true; }),
      v: lista.filter(function (x) { return x.antahkarana !== true && x._km != null && x._km <= RAGGIO_KM; }),
      l: lista.filter(function (x) { return x.antahkarana !== true && !(x._km != null && x._km <= RAGGIO_KM); })
    };
    P.riempi(R, { conto: { antahkarana: String(G.a.length), vicino: String(G.v.length), lontano: String(G.l.length) } });
    ["a", "v", "l"].forEach(function (g) {
      var tutti = false;
      function disegna() {
        P.stampa(R, "bis-" + g, tutti ? G[g] : G[g].slice(0, 3), function (c, x) {
          P.riempi(c, { bis: { titolo: x.titolo || "bisogno", chi: [x._chi, x._comune].filter(Boolean).join(" · "),
                               dove: x._km != null ? Math.round(x._km) + " km" : "" } });
        });
        var al = R.querySelector('[data-g="altri-' + g + '"]');
        if (al) { al.textContent = tutti ? "meno" : "[ " + (G[g].length - 3) + " altri ]"; }
        P.stato(R, "altri-" + g, G[g].length > 3);
      }
      P.stato(R, "vuoto-" + g, G[g].length === 0);
      disegna();
      P.gesto(R, "altri-" + g, function () { tutti = !tutti; disegna(); });
    });
    /* aggiungere un bisogno */
    var form = function (on) { P.stato(R, "form-bisogno", on); };
    P.gesto(R, "apri-bisogno", function () { form(true); var i = R.querySelector("#vc-bis-titolo"); if (i) i.focus(); });
    P.gesto(R, "annulla-bisogno", function () { form(false); });
    P.gesto(R, "salva-bisogno", async function () {
      var i = R.querySelector("#vc-bis-titolo"), t = i ? i.value.trim() : "";
      var esito = R.querySelector('[data-c="bisogno.esito"]');
      if (!t) { if (i) i.focus(); return; }
      try {
        var r = await db.from("bisogni").insert({ titolo: t, aperto_da: io });
        if (r.error) throw r.error;
        if (esito) esito.textContent = "Aggiunto.";
        i.value = ""; form(false);
        bisogni(P, R, io, dove);
      } catch (e) { if (esito) esito.textContent = "Non si è potuto aggiungere: " + (e.message || e); }
    });
  }

  /* ── il tuo vicinato: la mappa ── */
  function mappa(P, R, io, dove) {
    var W = R.ownerDocument.defaultView, box = R.querySelector("#vc-map");
    var m = null, cerchio = null, qui = null, strato = null, luoghi = [], filtri = {}, scelta = null, nuovo = null, mettendo = false;
    P.riempi(R, { mappa: { dove: dove ? dove.nome : "dove sei?" } });

    function icona(f) {
      return W.L.divIcon({ className: "", iconSize: [30, 30], iconAnchor: [15, 15],
        html: '<div class="vc-pin"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + (ICONE[f] || "") + "</svg></div>" });
    }
    function disegnaLuoghi() {
      if (!strato) return;
      strato.clearLayers();
      var accesi = Object.keys(filtri).filter(function (k) { return filtri[k]; });
      luoghi.forEach(function (x) {
        if (x.lat == null || (accesi.length && accesi.indexOf(x.famiglia) < 0)) return;
        W.L.marker([+x.lat, +x.lon], { icon: icona(x.famiglia) }).addTo(strato)
          .bindPopup("<b>" + String(x.nome || "").replace(/</g, "&lt;") + "</b>" + (x.descrizione ? "<br>" + String(x.descrizione).replace(/</g, "&lt;") : ""));
      });
    }
    async function leggiLuoghi() {
      try { var r = await db.from("luoghi").select("*").limit(500); luoghi = r.error ? [] : (r.data || []); } catch (e) { luoghi = []; }
      disegnaLuoghi();
    }
    function centra(d) {
      if (!m) return;
      if (cerchio) { m.removeLayer(cerchio); cerchio = null; }
      if (qui) { m.removeLayer(qui); qui = null; }
      if (!d) { m.setView([41.9, 12.5], 5); return; }
      var c = [d.lat, d.lon];
      m.fitBounds(W.L.latLng(c).toBounds(RAGGIO_KM * 2000), { padding: [6, 6] });
      cerchio = W.L.circle(c, { radius: RAGGIO_KM * 1000, color: "#D4AF6A", weight: 1, opacity: .6, dashArray: "4 6", fill: false, interactive: false }).addTo(m);
      qui = W.L.circleMarker(c, { radius: 6, color: "#F5F0E6", weight: 2, fillColor: "#D4AF6A", fillOpacity: 1 }).addTo(m).bindTooltip("sei qui");
    }

    /* le famiglie: filtro, e scelta quando si aggiunge */
    Array.prototype.forEach.call(R.querySelectorAll(".vc-cat button"), function (b) {
      b.onclick = function () {
        var f = b.getAttribute("data-cat");
        if (mettendo) {
          scelta = f;
          Array.prototype.forEach.call(R.querySelectorAll(".vc-cat button"), function (x) { x.classList.toggle("on", x === b); });
          var p = R.querySelector('[data-c="luogo.passo"]'); if (p) p.textContent = "ora tocca la mappa dove si trova";
          return;
        }
        filtri[f] = !filtri[f]; b.classList.toggle("on", !!filtri[f]); disegnaLuoghi();
      };
    });

    /* il comune */
    P.gesto(R, "apri-dove", function () { P.stato(R, "dove-aperto", true); var i = R.querySelector("#vc-cerca"); if (i) i.focus(); });
    var campo = R.querySelector("#vc-cerca"), tempo = null;
    if (campo) campo.oninput = function () {
      clearTimeout(tempo);
      var q = campo.value.trim();
      tempo = setTimeout(async function () {
        var trovati = [];
        if (q.length >= 2) {
          try { var r = await db.from("territori").select("codice,nome").eq("tipo", "comune").ilike("nome", q + "%").order("nome").limit(8); trovati = r.data || []; } catch (e) {}
        }
        P.stampa(R, "comune", trovati, function (c, x) {
          P.riempi(c, { comune: { nome: x.nome } });
          P.gesto(c, "scegli-comune", async function () {
            try {
              if (io) await db.from("persone").update({ comune_cod: x.codice }).eq("id", io);
              dove = await comuneDi(x.codice);
              P.riempi(R, { mappa: { dove: x.nome } });
              P.stato(R, "dove-aperto", false);
              centra(dove);
            } catch (e) { console.warn("dove sei:", e); }
          });
        });
      }, 250);
    };

    /* aggiungere una realtà */
    function fine() {
      mettendo = false; scelta = null;
      if (nuovo && m) { m.removeLayer(nuovo); nuovo = null; }
      if (box) box.classList.remove("metti");
      P.stato(R, "form-luogo", false);
      Array.prototype.forEach.call(R.querySelectorAll(".vc-cat button"), function (x) { x.classList.toggle("on", !!filtri[x.getAttribute("data-cat")]); });
    }
    P.gesto(R, "apri-luogo", function () {
      mettendo = true; scelta = null;
      if (box) box.classList.add("metti");
      Array.prototype.forEach.call(R.querySelectorAll(".vc-cat button"), function (x) { x.classList.remove("on"); });
      var p = R.querySelector('[data-c="luogo.passo"]'); if (p) p.textContent = "scegli la famiglia qui sopra, poi tocca la mappa dove si trova";
      var e = R.querySelector('[data-c="luogo.esito"]'); if (e) e.textContent = "";
      P.stato(R, "form-luogo", true);
    });
    P.gesto(R, "annulla-luogo", fine);
    P.gesto(R, "salva-luogo", async function () {
      var esito = R.querySelector('[data-c="luogo.esito"]');
      var nome = (R.querySelector("#vc-luogo-nome") || {}).value || "", desc = (R.querySelector("#vc-luogo-desc") || {}).value || "";
      if (!scelta) { if (esito) esito.textContent = "Scegli prima la famiglia."; return; }
      if (!nuovo) { if (esito) esito.textContent = "Tocca la mappa dove si trova."; return; }
      if (!nome.trim()) { if (esito) esito.textContent = "Scrivi il nome."; return; }
      var ll = nuovo.getLatLng();
      try {
        var r = await db.from("luoghi").insert({ famiglia: scelta, nome: nome.trim(), descrizione: desc.trim() || null,
                                                 lat: ll.lat, lon: ll.lng, comune_cod: dove ? dove.cod : null });
        if (r.error) throw r.error;
        R.querySelector("#vc-luogo-nome").value = ""; R.querySelector("#vc-luogo-desc").value = "";
        fine(); leggiLuoghi();
      } catch (e) {
        var msg = String((e && e.message) || e);
        if (esito) esito.textContent = /luoghi/.test(msg) && /exist|relation|schema cache/i.test(msg)
          ? "Manca ancora la tavola dei luoghi nel database: va lanciato fm_vicinati_01_luoghi.sql."
          : "Non si è potuto aggiungere: " + msg;
      }
    });

    if (!box) return;
    (function pronta(t) {
      if (!W.L) { if (t < 60) setTimeout(function () { pronta(t + 1); }, 150); return; }
      var L = W.L;
      m = L.map(box, { zoomControl: true, scrollWheelZoom: true, attributionControl: true });
      L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
        { maxZoom: 16, attribution: "Esri, HERE, Garmin, © OpenStreetMap" }).addTo(m);
      L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}", { maxZoom: 16 }).addTo(m);
      strato = L.layerGroup().addTo(m);
      centra(dove);
      m.on("click", function (e) {
        if (!mettendo) return;
        if (!scelta) { var p = R.querySelector('[data-c="luogo.passo"]'); if (p) p.textContent = "prima scegli la famiglia qui sopra"; return; }
        if (nuovo) m.removeLayer(nuovo);
        nuovo = L.marker(e.latlng, { icon: icona(scelta), draggable: true }).addTo(m);
        var p2 = R.querySelector('[data-c="luogo.passo"]'); if (p2) p2.textContent = "ecco il punto: scrivi il nome e aggiungi";
        var n = R.querySelector("#vc-luogo-nome"); if (n) n.focus();
      });
      leggiLuoghi();
      [300, 900, 2000].forEach(function (ms) { setTimeout(function () { m.invalidateSize(); }, ms); });
    })(0);
  }

  async function vicinati(dove) {
    var box = typeof dove === "string" ? document.querySelector(dove) : dove;
    if (!box || !window.FMPiatto) return;
    var P = window.FMPiatto;
    var R = await P.monta(box, INDIRIZZO);
    if (R && R.body) R = R.body;
    var io = await chiSono(), cod = null;
    try { if (io) { var p = await db.from("persone").select("comune_cod").eq("id", io).single(); cod = p && p.data && p.data.comune_cod; } } catch (e) {}
    var qui = await comuneDi(cod);
    await quadrante(P, R);
    inOnda(P, R);
    var app = await appuntamenti(P, R);
    await dueQuadranti(P, R, io, app);
    articoli(P, R);
    await bisogni(P, R, io, qui);
    mappa(P, R, io, qui);
  }
  window.SpazioVivo = window.SpazioVivo || {};
  window.SpazioVivo.vicinati = vicinati;
})();
