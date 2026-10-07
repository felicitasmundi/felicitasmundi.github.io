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
  /* ⭐ 7 ottobre, Gab: «brandizzi ogni forma» — le immagini sono nostre (disegnate apposta, col Nexus e il nome),
     una per tipo di prodotto. Il nome del prodotto sceglie l'immagine; se non ne trova una, vale quella della famiglia. */
  var IMG = [
    [/biglietti da visita|business card/i, "biglietti"], [/roll|display|pop.?up|fondal|banner|insegn|stand|bancon|desk/i, "rollup"],
    [/bandier|stendard|flag|vela/i, "bandiera"], [/poster|manifest|locandin/i, "poster"], [/pieghevol|depliant|leaflet/i, "pieghevole"],
    [/volantin|flyer|cartolin/i, "volantino"], [/adesiv|etichett|sticker/i, "adesivi"], [/agend|quadern|calendar|blocc|notes|block/i, "agenda"],
    [/rivist|opuscol|brochure|catalog|libr|magazin/i, "rivista"], [/scatol|confezion|imballag|box/i, "scatola"],
    [/borsa|borse|shopper|sacchett|bust/i, "shopper"], [/tazz|bicchier|coppett|mug/i, "tazza"],
    [/maglie|t-shirt|felp|abbigliam|cappell|tessut|polo|grembiul/i, "tshirt"], [/penn|matit|portachiav|gadget/i, "penne"]
  ];
  /* le immagini stanno in <radice dell'app>/stampa/, dovunque sia la pagina che carica questo file */
  var BASE_IMG = ((document.currentScript && document.currentScript.src) || "").replace(/APP\.FELICITASMUNDI\/piatti\/[^\/]*$/, "");
  var FAM_IMG = { carta: "volantino", libri: "rivista", agende: "agenda", fiere: "rollup", confezioni: "scatola", gadget: "penne", abiti: "tshirt" };
  function immagine(nome, fam) {
    for (var i = 0; i < IMG.length; i++) if (IMG[i][0].test(nome || "")) return BASE_IMG + "stampa/" + IMG[i][1] + ".jpg?v=1007";
    return BASE_IMG + "stampa/" + (FAM_IMG[fam] || "volantino") + ".jpg?v=1007";
  }
  /* ⭐ Gab: «8 quadranti in alto e poi devi scendere giù a vedere cosa hai schiacciato, è la cosa meno saggia».
     Come fa Apple nello Store: toccata una famiglia, le otto diventano una striscia che scorre di lato,
     e i prodotti si aprono subito sotto. Toccando di nuovo la stessa, si richiude.
     ⭐ «non avremo usato cose con scritto flyeralarm»: niente foto loro — schede nostre, fondo blu e il Nexus. */
  (function () {
    var st = document.createElement("style");
    st.textContent =
      ".fa-striscia{display:flex!important;overflow-x:auto;gap:.5rem!important;padding:.2rem 0 .5rem;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch}" +
      ".fa-striscia>[data-famiglia]{flex:0 0 auto;min-height:0!important;padding:.55rem .9rem!important;scroll-snap-align:start;border-radius:999px!important}" +
      ".fa-striscia>[data-famiglia] span{display:none}" +
      ".fa-striscia>[data-famiglia] b{font-size:.85rem!important;white-space:nowrap}" +
      ".fa-striscia>[data-famiglia][aria-pressed=true]{background:color-mix(in srgb,var(--c) 30%,transparent)!important;border-color:var(--c)!important}" +
      ".fa-scheda{display:flex;flex-direction:column;justify-content:space-between;gap:.6rem;min-height:9.5rem;padding:.9rem .8rem;border-radius:.9rem;" +
      "background:radial-gradient(circle at 50% 0%,#2b5f9e 0%,#163a6b 55%,#0e2549 100%);border:1px solid rgba(212,175,106,.35);color:#F5F0E6}" +
      ".fa-scheda img{width:100%;height:auto;aspect-ratio:1;object-fit:cover;border-radius:.6rem;align-self:center}" +
      ".fa-scheda b{font-family:'Cormorant Garamond',serif;font-weight:400;font-size:1.08rem;line-height:1.25;text-align:center}" +
      ".fa-riga{min-height:0!important;padding:.75rem .9rem!important;justify-content:center!important;background:rgba(43,95,158,.18)!important}" +
      ".fa-riga b{text-align:left!important;font-size:1.05rem!important}" +
      ".fa-scheda small{font-family:'Cinzel',serif;font-size:.55rem;letter-spacing:.22em;text-align:center;color:rgba(212,175,106,.85)}";
    document.head.appendChild(st);
  })();
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
    /* ⭐ 7 ottobre 22:05, Gab: «procedi» — tutti i prodotti in una volta, e un campo per cercare */
    box.innerHTML =
      '<input id="fa-cerca" type="search" placeholder="cerca in ' + lista.length + ' prodotti" ' +
      'style="grid-column:1/-1;width:100%;min-height:2.8rem;padding:0 1rem;border-radius:999px;border:1px solid rgba(212,175,106,.5);' +
      'background:rgba(8,11,26,.6);color:#F5F0E6;font:inherit;font-size:1rem;box-sizing:border-box">' +
      lista.map(function (g) {
        return '<div class="fa-scheda fa-riga" data-nome="' + esc(String(g.name || "").toLowerCase()) + '"><b>' + esc(g.name) + '</b></div>';
      }).join("");
    var cerca = document.getElementById("fa-cerca");
    if (cerca) cerca.oninput = function () {
      var q = cerca.value.trim().toLowerCase();
      Array.prototype.forEach.call(box.querySelectorAll(".fa-riga"), function (r) { r.style.display = !q || r.getAttribute("data-nome").indexOf(q) >= 0 ? "" : "none"; });
    };
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-famiglia]");
    if (!b) return;
    var fam = b.getAttribute("data-famiglia");
    var aut = document.querySelector('[data-stato="in-autunno"]');
    if (!FAMIGLIE[fam]) { var v = document.getElementById("fa-prodotti"); if (v) v.remove(); b.parentNode.classList.remove("fa-striscia"); return; }
    setTimeout(function () { if (aut) aut.hidden = true; }, 0);
    var griglia = b.parentNode, era = b.getAttribute("aria-pressed") === "true" && griglia.classList.contains("fa-striscia");
    if (era) {   /* la stessa famiglia: si richiude */
      griglia.classList.remove("fa-striscia");
      b.setAttribute("aria-pressed", "false");
      var v2 = document.getElementById("fa-prodotti"); if (v2) v2.remove();
      return;
    }
    Array.prototype.forEach.call(document.querySelectorAll("[data-famiglia]"), function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
    griglia.classList.add("fa-striscia");
    try { b.scrollIntoView({ block: "nearest", inline: "center" }); griglia.scrollIntoView({ block: "start", behavior: "smooth" }); } catch (er) {}
    mostra(b, fam, 0);
  });
})();
