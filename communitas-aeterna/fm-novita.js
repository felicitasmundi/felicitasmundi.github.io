/* fm-novita.js — la finestra delle novità, all'accesso.
   ⭐ 30 settembre, Gab: «vorrei anche una finestra che si apre all accesso quando ci sono novità».
   Legge l'ultima riga attiva di `novita` (la scrive public.fm_annuncia dall'SQL Editor, che manda
   anche la notifica all'app). Si apre una volta sola per ogni novità: quelle già viste restano
   ricordate in questo browser. Niente da mostrare → non compare niente. */
(function () {
  "use strict";
  var CHIAVE = "fm_novita_viste";
  function viste() { try { return JSON.parse(localStorage.getItem(CHIAVE) || "[]"); } catch (e) { return []; } }
  function segna(id) { try { var v = viste(); v.push(id); localStorage.setItem(CHIAVE, JSON.stringify(v.slice(-50))); } catch (e) {} }
  function esc(x) { return String(x || "").replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  function mostra(n) {
    var st = document.createElement("style");
    st.textContent =
      "#fm-nov{position:fixed;inset:0;z-index:2147483100;display:grid;place-items:center;padding:1rem;background:rgba(2,4,12,.72);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);animation:fmNovIn .5s ease both}" +
      "@keyframes fmNovIn{from{opacity:0}to{opacity:1}}" +
      "#fm-nov .q{width:min(30rem,100%);border:1px solid rgba(212,175,106,.5);border-radius:1.3rem;padding:1.8rem 1.5rem 1.4rem;text-align:center;color:#F5F0E6;" +
      "background:radial-gradient(ellipse at 50% 0%,rgba(212,175,106,.16),transparent 60%),#0A0C1A;box-shadow:0 1.5rem 3rem rgba(0,0,0,.5);font-family:'DM Sans',system-ui,sans-serif}" +
      "#fm-nov .o{font-family:'Cinzel',serif;font-size:.72rem;letter-spacing:.26em;text-transform:uppercase;color:rgba(212,175,106,.85);padding-bottom:.6rem;border-bottom:1px solid rgba(212,175,106,.3);display:inline-block}" +
      "#fm-nov h2{margin:1rem 0 .6rem;font-family:'Cinzel',serif;font-weight:400;font-size:1.5rem;letter-spacing:.04em}" +
      "#fm-nov p{margin:0 0 1.2rem;font-family:'Cormorant Garamond',serif;font-size:1.2rem;line-height:1.5;color:rgba(245,240,230,.82);white-space:pre-line}" +
      "#fm-nov .b{display:flex;gap:.6rem;justify-content:center;flex-wrap:wrap}" +
      "#fm-nov a,#fm-nov button{all:unset;cursor:pointer;font-family:'Cinzel',serif;font-size:.78rem;letter-spacing:.16em;text-transform:uppercase;padding:.75rem 1.3rem;border-radius:999px;border:1px solid rgba(212,175,106,.55);color:#D4AF6A}" +
      "#fm-nov a{background:#D4AF6A;color:#0A0C1A}";
    document.head.appendChild(st);
    var d = document.createElement("div");
    d.id = "fm-nov"; d.setAttribute("role", "dialog"); d.setAttribute("aria-modal", "true");
    d.innerHTML = '<div class="q"><div class="o">novità</div><h2>' + esc(n.titolo) + '</h2>' +
      (n.testo ? '<p>' + esc(n.testo) + '</p>' : '') +
      '<div class="b">' + (n.link ? '<a href="' + esc(n.link) + '">apri</a>' : '') + '<button type="button">chiudi</button></div></div>';
    function via() { segna(n.id); d.remove(); }
    d.querySelector("button").addEventListener("click", via);
    var a = d.querySelector("a"); if (a) a.addEventListener("click", function () { segna(n.id); });
    d.addEventListener("click", function (e) { if (e.target === d) via(); });
    document.body.appendChild(d);
  }

  async function guarda() {
    try {
      var cli = window.db || (window.supabase && window.FM_URL && window.supabase.createClient(window.FM_URL, window.FM_CHIAVE));
      if (!cli) return;
      var r = await cli.from("novita").select("id,titolo,testo,link").eq("attiva", true)
        .order("creata_il", { ascending: false }).limit(1);
      var n = r && !r.error && r.data && r.data[0];
      if (n && viste().indexOf(n.id) < 0) mostra(n);
    } catch (e) { /* nessuna novità da mostrare */ }
  }
  if (window.top !== window.self) return;           // mai dentro una cornice
  if (document.readyState === "complete") setTimeout(guarda, 1500);
  else window.addEventListener("load", function () { setTimeout(guarda, 1500); });
})();
