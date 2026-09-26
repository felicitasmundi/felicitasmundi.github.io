/* ═══════════════════════════════════════════════════════════════
   FM-CALENDARIO — le orme che hanno un giorno, dalla piatta.

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

  async function leggi() {
    var d = { io: null, orme: [], madri: {}, santo: "" };
    try {
      var u = await db.auth.getUser();
      d.io = u && u.data && u.data.user && u.data.user.id;

      var da = new Date(); da.setMonth(da.getMonth() - 1); da.setDate(1);
      var o = await db.from("orme")
        .select("id,titolo,contenuto,elemento,luogo,visibilita,accaduto_il,inizio_il," +
                "entro_il,orma_madre_id")
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

      var x = new Date();
      var mmgg = String(x.getMonth() + 1).padStart(2, "0") + "-" + String(x.getDate()).padStart(2, "0");
      var sa = await db.from("santi").select("nome").eq("giorno", mmgg).limit(1);
      if (!sa.error && sa.data && sa.data[0]) d.santo = sa.data[0].nome;
    } catch (e) { console.warn("calendario:", e); }
    return d;
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
    var P = F(), l = window.FMOrmaMia && window.FMOrmaMia.luna ? window.FMOrmaMia.luna() : null;
    P.riempi(R, { giorno: { data: oggi(), luna: l ? l.nome : "", santo: d.santo } });

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

  async function calendario(dove) {
    var box = typeof dove === "string" ? document.querySelector(dove) : dove;
    if (!box || !window.FMPiatto) return;
    var R = await F().monta(box, INDIRIZZO);
    if (R && R.body) R = R.body;
    var d = await leggi();
    disegna(R, d, { mese: null });
  }

  window.SpazioVivo = window.SpazioVivo || {};
  window.SpazioVivo.calendario = calendario;
  window.FMCalendario = { disegna: disegna };
})();
