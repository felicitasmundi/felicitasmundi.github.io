/* ═══════════════════════════════════════════════════════════════
   FM-FLYERALARM — le famiglie dell'Edizione mostrano il catalogo vero di Flyeralarm.
   ⭐ 3 ottobre, Gab: «ok flyeralarm» · abbinamento famiglie → categorie deciso con Gab
      («metti anche borse e shopper, opuscoli»). «I servizi» sono nostri: non si toccano.
   ⛔ Solo lettura: catalogo e foto. Niente ordini (il token è DEMO, sta nei segreti del server).
   Si aggancia da sé: ascolta i tocchi su [data-famiglia] nella pagina.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  "use strict";
  var URL_FA = "https://gfnveesogkfvkrdudpfg.supabase.co/functions/v1/flyeralarm?p=";
  var FAMIGLIE = {
    carta:      { cat: ["prodotti di stampa", "pieghevoli, depliant e opuscoli", "adesivi"] },
    libri:      { cat: ["riviste", "pieghevoli, depliant e opuscoli", "accessori per prodotti di stampa e articoli da scrivania"] },
    agende:     { cat: ["quaderni e blocchi per appunti"], nome: /calendar|agend/i },
    fiere:      { cat: ["elementi per stand fieristici", "roll-up e display", "bandiere & stendardi", "banconi / desk promozionali", "fondali e pop up per fiere", "display pubblicitari", "insegne e pannelli pubblicitari"] },
    confezioni: { cat: ["scatole e confezioni", "imballaggi per prodotti", "sacchetti e buste in carta", "bicchieri in carta e coppette", "borse, buste e shopper"] },
    gadget:     { cat: ["gadget pubblicitari", "tazze", "penne e matite", "portachiavi", "borse, buste e shopper"] },
    abiti:      { cat: ["abbigliamento & tessuti", "abbigliamento promozionale"] }
  };
  var TUTTI = null;
  function esc(t) { return String(t == null ? "" : t).replace(/[&<>"]/g, function (k) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[k]; }); }
  async function mostra(btn, fam, gia) {
    var griglia = btn.parentNode, box = document.getElementById("fa-prodotti");
    if (!box) {
      box = document.createElement("div"); box.id = "fa-prodotti";
      box.setAttribute("style", "display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,10.5rem),1fr));gap:.7rem;margin-top:.8rem");
    }
    if (box.previousSibling !== griglia) griglia.parentNode.insertBefore(box, griglia.nextSibling);
    if (!gia) box.innerHTML = '<div style="grid-column:1/-1;font-family:\'Cormorant Garamond\',serif;font-style:italic;color:rgba(245,240,230,.6)">un momento…</div>';
    try {
      if (!TUTTI) { var r = await fetch(URL_FA + "/v2/catalog/groups"); var j = await r.json(); TUTTI = (j && j.data) || []; }
    } catch (e) { console.warn("flyeralarm:", e); box.innerHTML = ""; return; }
    var F = FAMIGLIE[fam];
    var lista = TUTTI.filter(function (g) {
      var c = (g.categories || []).some(function (x) { return F.cat.indexOf(String(x.name || "").trim().toLowerCase()) >= 0; });
      return c || (F.nome && F.nome.test(g.name || ""));
    });
    var fino = (gia || 0) + 24;
    box.innerHTML = lista.slice(0, fino).map(function (g) {
      return '<div style="display:flex;flex-direction:column;gap:.35rem;padding:.6rem;border-radius:.8rem;border:1px solid rgba(212,175,106,.25);background:rgba(8,11,26,.45)">' +
        (g.image ? '<img alt="" loading="lazy" src="' + esc(g.image) + '" style="width:100%;aspect-ratio:1;object-fit:contain;background:#fff;border-radius:.5rem">' : "") +
        '<b style="font-family:\'Cormorant Garamond\',serif;font-weight:400;font-size:1.05rem;line-height:1.25;color:#F5F0E6">' + esc(g.name) + '</b></div>';
    }).join("") + (lista.length > fino
      ? '<button type="button" id="fa-altri" style="all:unset;grid-column:1/-1;cursor:pointer;justify-self:center;padding:.6rem 1.2rem;border-radius:999px;border:1px solid rgba(212,175,106,.5);color:#D4AF6A;font-family:\'Cormorant Garamond\',serif;font-size:1.05rem">altri ' + Math.min(24, lista.length - fino) + ' · ' + lista.length + ' in tutto</button>'
      : "");
    var al = document.getElementById("fa-altri"); if (al) al.onclick = function () { mostra(btn, fam, fino); };
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-famiglia]");
    if (!b) return;
    var fam = b.getAttribute("data-famiglia");
    var aut = document.querySelector('[data-stato="in-autunno"]');
    if (!FAMIGLIE[fam]) { var v = document.getElementById("fa-prodotti"); if (v) v.remove(); return; }
    setTimeout(function () { if (aut) aut.hidden = true; }, 0);
    Array.prototype.forEach.call(document.querySelectorAll("[data-famiglia]"), function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
    mostra(b, fam, 0);
  });
})();
