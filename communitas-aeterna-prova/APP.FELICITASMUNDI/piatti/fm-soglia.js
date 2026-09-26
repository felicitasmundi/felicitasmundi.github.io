/* ═══════════════════════════════════════════════════════════════
   FM-SOGLIA — la soglia di Antaḥkaraṇa, dalla versione piatta.

   ⭐ Disegno di Design: soglia-piatto.html. Qui solo i dati e i tasti.
   CHI LA VEDE: la prima volta chi non ha ancora un talento; chi ne ha
   già vede «riprendi da dove eri» — anche da un altro telefono, perché
   lo dice il database, non il telefono.

   Vuole:   fm-piatto.js prima · `db` · `vai`
   Espone:  SpazioVivo.soglia(dove) · SpazioVivo.sogliaServe()
   ═══════════════════════════════════════════════════════════════ */
(function () {
  "use strict";
  var INDIRIZZO = "APP.FELICITASMUNDI/piatti/soglia-piatto.html";
  var F = function () { return window.FMPiatto; };
  function vaiA(r) { if (typeof window.vai === "function") window.vai(r); }

  /* vero se chi è entrato non ha ancora nessun talento */
  async function sogliaServe() {
    try {
      var u = await db.auth.getUser();
      var id = u && u.data && u.data.user && u.data.user.id;
      if (!id) return true;
      var r = await db.from("orme").select("id", { count: "exact", head: true })
        .eq("persona_id", id).not("talento_id", "is", null);
      return !r.count;
    } catch (e) { return true; }
  }

  async function soglia(dove) {
    var box = typeof dove === "string" ? document.querySelector(dove) : dove;
    if (!box || !window.FMPiatto) return;
    var R = await F().monta(box, INDIRIZZO);
    if (R && R.body) R = R.body;
    var prima = await sogliaServe(), P = F();
    P.stato(R, "prima-volta", prima);
    P.stato(R, "torna", !prima);
    P.gesto(R, "inizia", function () { vaiA("cammino"); });
    P.gesto(R, "riprendi", function () { vaiA("orme"); });
  }

  window.SpazioVivo = window.SpazioVivo || {};
  window.SpazioVivo.soglia = soglia;
  window.SpazioVivo.sogliaServe = sogliaServe;
})();
