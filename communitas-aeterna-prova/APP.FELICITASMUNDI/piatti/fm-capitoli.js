/* ═══════════════════════════════════════════════════════════════
   FM-CAPITOLI — il racconto di un'orma in capitoli: titolo d'oro, testo chiaro.
   ⭐ 2 ottobre 2026, Gab: «non abbiamo settato il modello manuale per scrivere
      capitoli con questo settaggio (titolo dorato, paragrafo bianco)» — chi ha
      aperto l'orma scrive i capitoli a mano: un'apertura, poi «+ capitolo»
      (titolo e testo), li sposta su e giù, li toglie, salva. Nessun segno da
      imparare: dentro il database resta un testo semplice («## Titolo»).
   Espone: window.FMCapitoli = { leggi, componi, editor }
   ═══════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  function leggi(testo) {
    testo = String(testo || "");
    var parti = testo.split(/^##\s+/m), testa = (parti.shift() || "").trim();
    var capitoli = parti.map(function (p) {
      var r = p.split("\n"), t = (r.shift() || "").trim();
      return { t: t, c: r.join("\n").trim() };
    });
    return { testa: testa, capitoli: capitoli };
  }
  function componi(testa, capitoli) {
    var out = String(testa || "").trim();
    (capitoli || []).forEach(function (k) {
      var t = String(k.t || "").trim(), c = String(k.c || "").trim();
      if (!t && !c) return;
      out += (out ? "\n\n" : "") + "## " + (t || "( senza titolo )") + (c ? "\n" + c : "");
    });
    return out;
  }

  var STILE =
    ".cap-ed{display:flex;flex-direction:column;gap:.9rem;padding:1.1rem;border:1px solid rgba(212,175,106,.5);border-radius:1rem;background:rgba(8,11,26,.75)}" +
    ".cap-ed .et{font-family:'Cinzel',serif;font-size:.72rem;letter-spacing:.2em;text-transform:uppercase;color:rgba(245,240,230,.5)}" +
    ".cap-ed textarea,.cap-ed input{width:100%;box-sizing:border-box;background:rgba(2,4,12,.6);border:1px solid rgba(212,175,106,.3);border-radius:.7rem;color:#F5F0E6;padding:.7rem .8rem;font-family:'DM Sans',system-ui,sans-serif;font-size:1rem;line-height:1.5;resize:vertical}" +
    ".cap-ed textarea.ap{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1.2rem}" +
    ".cap-ed input.tit{font-family:'Cinzel',serif;letter-spacing:.12em;text-transform:uppercase;color:#D4AF6A;font-size:.95rem}" +
    ".cap-ed .cap{display:flex;flex-direction:column;gap:.5rem;padding:.8rem;border:1px solid rgba(212,175,106,.3);border-radius:.9rem;background:rgba(245,240,230,.03)}" +
    ".cap-ed .riga{display:flex;gap:.4rem;align-items:center}" +
    ".cap-ed .riga input{flex:1}" +
    ".cap-ed button{all:unset;cursor:pointer;min-height:2.6rem;min-width:2.6rem;display:inline-grid;place-items:center;border-radius:999px;border:1px solid rgba(212,175,106,.45);color:#D4AF6A;font-family:'Cinzel',serif;font-size:.8rem;letter-spacing:.12em;text-transform:uppercase;padding:0 .9rem}" +
    ".cap-ed button.pieno{background:#D4AF6A;color:#0A0C1A;border-color:#D4AF6A}" +
    ".cap-ed button.pic{padding:0;width:2.6rem;font-family:'DM Sans',sans-serif;font-size:1rem}" +
    ".cap-ed .gesti{display:flex;gap:.6rem;flex-wrap:wrap;align-items:center}" +
    ".cap-ed .aiuto{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1rem;color:rgba(245,240,230,.5)}" +
    ".cap-apri{all:unset;cursor:pointer;align-self:flex-start;min-height:2.8rem;display:inline-flex;align-items:center;gap:.5rem;padding:0 1.2rem;border-radius:999px;border:1px solid rgba(212,175,106,.5);color:#D4AF6A;font-family:'Cinzel',serif;font-size:.82rem;letter-spacing:.12em;text-transform:uppercase}";

  function veste(doc) {
    if (doc.getElementById("cap-stile")) return;
    var s = doc.createElement("style"); s.id = "cap-stile"; s.textContent = STILE;
    (doc.head || doc.documentElement).appendChild(s);
  }

  /* l'editor: si monta dopo «dopo», salva con salva(testo) — una promessa */
  function editor(doc, dopo, testo, salva, chiudi) {
    veste(doc);
    var st = leggi(testo);
    if (!st.capitoli.length) st.capitoli.push({ t: "", c: "" });
    var w = doc.createElement("div"); w.className = "cap-ed";
    function disegna() {
      w.innerHTML = "";
      var e1 = doc.createElement("span"); e1.className = "et"; e1.textContent = "l'apertura";
      var ap = doc.createElement("textarea"); ap.className = "ap"; ap.rows = 2; ap.value = st.testa;
      ap.oninput = function () { st.testa = ap.value; };
      w.appendChild(e1); w.appendChild(ap);
      st.capitoli.forEach(function (k, i) {
        var c = doc.createElement("div"); c.className = "cap";
        var r = doc.createElement("div"); r.className = "riga";
        var t = doc.createElement("input"); t.className = "tit"; t.placeholder = "titolo del capitolo"; t.value = k.t;
        t.oninput = function () { k.t = t.value; };
        r.appendChild(t);
        [["↑", function () { if (i > 0) { var x = st.capitoli[i - 1]; st.capitoli[i - 1] = k; st.capitoli[i] = x; disegna(); } }],
         ["↓", function () { if (i < st.capitoli.length - 1) { var x = st.capitoli[i + 1]; st.capitoli[i + 1] = k; st.capitoli[i] = x; disegna(); } }],
         ["×", function () { st.capitoli.splice(i, 1); disegna(); }]].forEach(function (b) {
          var bt = doc.createElement("button"); bt.type = "button"; bt.className = "pic"; bt.textContent = b[0]; bt.onclick = b[1]; r.appendChild(bt);
        });
        var tx = doc.createElement("textarea"); tx.rows = 4; tx.placeholder = "il testo del capitolo"; tx.value = k.c;
        tx.oninput = function () { k.c = tx.value; };
        c.appendChild(r); c.appendChild(tx); w.appendChild(c);
      });
      var g = doc.createElement("div"); g.className = "gesti";
      var piu = doc.createElement("button"); piu.type = "button"; piu.textContent = "+ capitolo";
      piu.onclick = function () { st.capitoli.push({ t: "", c: "" }); disegna(); var ii = w.querySelectorAll("input.tit"); if (ii.length) ii[ii.length - 1].focus(); };
      var sv = doc.createElement("button"); sv.type = "button"; sv.className = "pieno"; sv.textContent = "salva";
      sv.onclick = async function () {
        sv.textContent = "un momento…";
        try { await salva(componi(st.testa, st.capitoli)); } catch (e) { sv.textContent = "non salvato: riprova"; console.warn("capitoli:", e); }
      };
      var an = doc.createElement("button"); an.type = "button"; an.textContent = "annulla";
      an.onclick = function () { w.remove(); if (chiudi) chiudi(); };
      g.appendChild(piu); g.appendChild(sv); g.appendChild(an);
      var aiuto = doc.createElement("span"); aiuto.className = "aiuto";
      aiuto.textContent = "Per un elenco, comincia ogni riga con «-».";
      w.appendChild(g); w.appendChild(aiuto);
    }
    disegna();
    dopo.parentNode.insertBefore(w, dopo.nextSibling);
    return w;
  }

  window.FMCapitoli = { leggi: leggi, componi: componi, editor: editor, veste: veste };
})();
