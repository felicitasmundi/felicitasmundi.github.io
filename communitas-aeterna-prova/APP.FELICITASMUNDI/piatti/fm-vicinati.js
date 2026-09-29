/* ═══════════════════════════════════════════════════════════════
   FM-VICINATI — la stanza Vicinati, pensata come casa dell'app
   (l'elemento terra: le radici). Si costruisce con Gab, un pezzo alla volta.
   29 settembre: il quadrante — il giorno · la luna · il santo.

   Vuole:   fm-piatto.js · fm-orma-mia.js (per la luna) · `db`
   Espone:  SpazioVivo.vicinati(dove)
   ═══════════════════════════════════════════════════════════════ */
(function () {
  "use strict";
  var INDIRIZZO = "APP.FELICITASMUNDI/piatti/vicinati-piatto.html";
  var MESI = ["gennaio","febbraio","marzo","aprile","maggio","giugno","luglio","agosto","settembre","ottobre","novembre","dicembre"];
  var GIORNI = ["domenica","lunedì","martedì","mercoledì","giovedì","venerdì","sabato"];

  async function vicinati(dove) {
    var box = typeof dove === "string" ? document.querySelector(dove) : dove;
    if (!box || !window.FMPiatto) return;
    var P = window.FMPiatto;
    var R = await P.monta(box, INDIRIZZO);
    if (R && R.body) R = R.body;
    var oggi = new Date();
    var lu = (window.FMOrmaMia && window.FMOrmaMia.luna) ? window.FMOrmaMia.luna() : { nome: "", segno: "" };
    var santo = "";
    try {
      var sa = await db.from("santi").select("intero").eq("mese", oggi.getMonth() + 1).eq("giorno", oggi.getDate()).limit(1);
      if (!sa.error && sa.data && sa.data[0]) santo = sa.data[0].intero;
    } catch (e) { console.warn("vicinati:", e); }
    P.riempi(R, { giorno: { data: oggi.getDate() + " " + MESI[oggi.getMonth()], settimana: GIORNI[oggi.getDay()],
                            luna: lu.segno || "", fase: lu.nome || "", santo: santo } });
  }
  window.SpazioVivo = window.SpazioVivo || {};
  window.SpazioVivo.vicinati = vicinati;
})();
