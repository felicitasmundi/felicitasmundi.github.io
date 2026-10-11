/* ═══════════════════════════════════════════════════════════════
   FELICITASMUNDI · LA LINGUA DELLA PAGINA · comune/fm-lingua.js
   Una pagina scrive il suo dizionario (italiano → inglese) in window.FM_EN,
   poi carica questo file. I tasti con data-lingua="it" / "en" cambiano la
   lingua: ogni pezzo di testo che sta nel dizionario viene tradotto, il
   resto resta com'è. La scelta si ricorda nel navigatore; «?lang=en»
   nell'indirizzo apre la pagina in inglese.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  var EN = window.FM_EN || {};
  var IT = {}; Object.keys(EN).forEach(function (k) { IT[EN[k]] = k; });
  var lingua = "it";

  function traduci(verso) {
    var diz = verso === "en" ? EN : IT;
    var w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        var p = n.parentNode; if (!p) return NodeFilter.FILTER_REJECT;
        var tag = p.nodeName; if (tag === "SCRIPT" || tag === "STYLE" || tag === "IFRAME") return NodeFilter.FILTER_REJECT;
        if (p.closest && p.closest("[data-lingua-ferma]")) return NodeFilter.FILTER_REJECT;
        return n.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
      }
    });
    var nodi = []; while (w.nextNode()) nodi.push(w.currentNode);
    nodi.forEach(function (n) {
      var v = n.nodeValue, t = v.trim();
      if (Object.prototype.hasOwnProperty.call(diz, t)) {
        var pre = v.slice(0, v.indexOf(t)), post = v.slice(v.indexOf(t) + t.length);
        n.nodeValue = pre + diz[t] + post;
      }
    });
    /* le etichette dei tasti e i segnaposti */
    document.querySelectorAll("[aria-label],[placeholder]").forEach(function (el) {
      ["aria-label", "placeholder"].forEach(function (a) { var x = el.getAttribute(a); if (x && diz[x]) el.setAttribute(a, diz[x]); });
    });
    document.documentElement.lang = verso;
    document.querySelectorAll("[data-lingua]").forEach(function (b) { b.classList.toggle("on", b.getAttribute("data-lingua") === verso); });
    document.querySelectorAll("[data-solo-lingua]").forEach(function (el) { el.hidden = el.getAttribute("data-solo-lingua") !== verso; });
    lingua = verso;
    try { localStorage.setItem("fm_lingua", verso); } catch (e) {}
    document.dispatchEvent(new CustomEvent("fm-lingua", { detail: verso }));
  }

  document.querySelectorAll("[data-lingua]").forEach(function (b) { b.addEventListener("click", function () { if (b.getAttribute("data-lingua") !== lingua) traduci(b.getAttribute("data-lingua")); }); });

  var voluta = null;
  try { voluta = new URLSearchParams(location.search).get("lang"); } catch (e) {}
  if (!voluta) { try { voluta = localStorage.getItem("fm_lingua"); } catch (e) {} }
  if (voluta === "en") traduci("en");
  window.fmLingua = function () { return lingua; };
})();
