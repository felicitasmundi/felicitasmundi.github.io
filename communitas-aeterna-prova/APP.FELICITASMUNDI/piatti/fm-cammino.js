/* ═══════════════════════════════════════════════════════════════
   FM-CAMMINO — «A che punto sei?», dalla versione piatta.

   ⭐ Disegno di Design: cammino-piatto.html. La scelta finisce in
      persone.cammino: 'primi_passi' o 'in_cammino'.
   ⭐ Lo script di Design fa l'eco della scelta dentro la pagina; qui si
      salva, e se la scelta c'era già la si ritrova accesa.

   Vuole:   fm-piatto.js prima · `db` · `vai`
   Espone:  SpazioVivo.cammino(dove) · SpazioVivo.camminoDi()
   ═══════════════════════════════════════════════════════════════ */
(function () {
  "use strict";
  var INDIRIZZO = "APP.FELICITASMUNDI/piatti/cammino-piatto.html";
  var PAROLE = { primi_passi: "primi passi", in_cammino: "in cammino" };
  var F = function () { return window.FMPiatto; };
  function vaiA(r) { if (typeof window.vai === "function") window.vai(r); }

  async function io() {
    var u = await db.auth.getUser();
    return u && u.data && u.data.user && u.data.user.id;
  }
  async function camminoDi() {
    try {
      var id = await io(); if (!id) return null;
      var r = await db.from("persone").select("cammino").eq("id", id).single();
      return (r.data && r.data.cammino) || null;
    } catch (e) { return null; }
  }

  function accendi(R, v) {
    Array.prototype.forEach.call(R.querySelectorAll('[data-g="scegli-cammino"]'), function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-v") === v ? "true" : "false");
    });
    F().stato(R, "scelto", !!v);
    Array.prototype.forEach.call(R.querySelectorAll('.ak-eco [data-c="persona.cammino"]'),
      function (el) { el.textContent = PAROLE[v] || ""; });
  }

  async function cammino(dove) {
    var box = typeof dove === "string" ? document.querySelector(dove) : dove;
    if (!box || !window.FMPiatto) return;
    var R = await F().monta(box, INDIRIZZO);
    if (R && R.body) R = R.body;
    var P = F();
    accendi(R, await camminoDi());

    P.gesto(R, "scegli-cammino", async function (e, b) {
      var v = b.getAttribute("data-v");
      accendi(R, v);
      try {
        var id = await io(); if (!id) return;
        var r = await db.from("persone").update({ cammino: v }).eq("id", id);
        if (r.error) throw r.error;
      } catch (err) { console.warn("cammino:", err); }
    });
    P.gesto(R, "avanti", function () { vaiA("talenti"); });
  }

  window.SpazioVivo = window.SpazioVivo || {};
  window.SpazioVivo.cammino = cammino;
  window.SpazioVivo.camminoDi = camminoDi;
})();
