/* ═══════════════════════════════════════════════════════════════
   LA SCUOLA — la stanza dell'etere.

   ⛔ IL DISEGNO E LA LOGICA SONO DI DESIGN, presi verbatim da
      `stanza-scuola.html`. ⭐ Il motore qui sotto legge il suo
      linguaggio: nessuna riga riscritta, nessun bagliore perso.

   ⭐ LE LEZIONI VIVONO IN `servizi`, col tipo `formazione`: la
      Scuola non ha una tavola sua, e non le serve.

   ⚠️ CHI HA UN LUOGO SI ORDINA PER VICINANZA, chi è a distanza no:
      una lezione online non ha gradini, sta ovunque. Lo dice
      `servizi.a_distanza`.

   Espone: SpazioVivo.scuola(dove)
   ═══════════════════════════════════════════════════════════════ */

"use strict";

var SC_CORPO = "<div data-screen-label=\"La Scuola\" style=\"position:relative;isolation:isolate;font-size:16px;min-height:100vh;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,24rem),1fr));align-items:start;gap:2rem 3rem;padding:2rem clamp(1.25rem,5vw,5rem);box-sizing:border-box;font-family:'DM Sans',system-ui,sans-serif;color:#F5F0E6;background:radial-gradient(ellipse at 22% 20%,rgba(38,64,120,.5),transparent 58%),radial-gradient(ellipse at 84% 84%,rgba(60,44,110,.42),transparent 60%),radial-gradient(ellipse at 40% 45%,#0a1428 0%,#060c1c 46%,#02040c 100%)\">\n  <ak-cosmo aria-hidden=\"true\" style=\"position:absolute;inset:0;z-index:0;pointer-events:none\"></ak-cosmo>\n  <div aria-hidden=\"true\" style=\"position:absolute;inset:0;z-index:0;pointer-events:none;background:radial-gradient(ellipse 55% 70% at 50% 50%,rgba(2,4,12,.55),transparent 100%)\"></div>\n\n  <!-- sinistra: il giorno, il cubo coll'icosaedro, l'invito -->\n  <div style=\"position:sticky;top:2rem;z-index:1;display:grid;grid-template-columns:minmax(0,1fr);justify-items:center;gap:1.2rem;width:100%;justify-self:center\">\n    <div style=\"display:flex;gap:.55rem;width:100%;max-width:24rem\">\n      <div style=\"flex:1;border:1px solid rgba(184,150,62,.22);border-radius:.75rem;background:rgba(8,11,26,.4);padding:.65rem .5rem;text-align:center\">\n        <b style=\"display:block;font-family:'Cinzel',serif;font-weight:400;font-size:1rem;line-height:1.2;color:#D4AF6A\">[ giorno ]</b>\n        <span style=\"display:block;font-size:.84rem;color:rgba(245,240,230,.45);margin-top:.25rem\">[ mese ]</span>\n      </div>\n      <div style=\"flex:1;border:1px solid rgba(184,150,62,.22);border-radius:.75rem;background:rgba(8,11,26,.4);padding:.65rem .5rem;text-align:center\">\n        <b style=\"display:block;font-family:'Cinzel',serif;font-weight:400;font-size:1.4rem;line-height:1.2;color:#D4AF6A\">\ud83c\udf11</b>\n        <span style=\"display:block;font-size:.84rem;color:rgba(245,240,230,.45);margin-top:.25rem\">[ la luna ]</span>\n      </div>\n      <div style=\"flex:1;border:1px solid rgba(184,150,62,.22);border-radius:.75rem;background:rgba(8,11,26,.4);padding:.65rem .5rem;text-align:center\">\n        <b style=\"display:block;font-family:'Cinzel',serif;font-weight:400;font-size:1rem;line-height:1.2;color:#D4AF6A\">[ il santo ]</b>\n        <span style=\"display:block;font-size:.84rem;color:rgba(245,240,230,.45);margin-top:.25rem\">il santo</span>\n      </div>\n    </div>\n\n    <div style=\"position:relative;width:100%;max-width:min(24rem,58vh);aspect-ratio:1\">\n      <div style=\"position:absolute;inset:8%;pointer-events:none;background:radial-gradient(circle at 50% 50%,rgba(153,102,204,.18),transparent 70%)\"></div>\n      <svg sc-camel-view-box=\"-128 -128 256 256\" aria-hidden=\"true\" style=\"position:absolute;inset:0;width:100%;height:100%;overflow:visible\">\n        <g fill=\"none\" stroke=\"#D4AF6A\" stroke-linejoin=\"round\">\n          <g stroke-width=\".7\" opacity=\".34\">\n            <sc-for list=\"{{ linee }}\" as=\"l\" hint-placeholder-count=\"0\"><line x1=\"{{ l.x1 }}\" y1=\"{{ l.y1 }}\" x2=\"{{ l.x2 }}\" y2=\"{{ l.y2 }}\"></line></sc-for>\n          </g>\n          <g stroke-width=\"1\" opacity=\".3\" stroke=\"#C9A6E0\">\n            <sc-for list=\"{{ centri }}\" as=\"c\" hint-placeholder-count=\"0\"><circle cx=\"{{ c.x }}\" cy=\"{{ c.y }}\" r=\"23\"></circle></sc-for>\n          </g>\n          <circle r=\"115\" stroke-width=\"1\" opacity=\".5\"></circle>\n          <rect x=\"-115\" y=\"-115\" width=\"230\" height=\"230\" stroke-width=\".8\" stroke-dasharray=\"3 3.6\" opacity=\".34\"></rect>\n        </g>\n      </svg>\n      <ak-solido tipo=\"dodecaedro\" colore=\"#9966CC\" aria-hidden=\"true\"></ak-solido>\n    </div>\n    <div style=\"font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1.15rem;color:#C9A6E0;text-align:center;margin-top:-.4rem\">dodecaedro \u00b7 etere</div>\n\n    <div style=\"display:flex;justify-content:center;width:100%;max-width:24rem\">\n      <a href=\"invito.html\" style=\"min-height:3.5rem;min-width:16rem;padding:.7rem 1rem;border-radius:.9rem;border:1px solid rgba(212,175,106,.45);background:rgba(8,11,26,.5);color:#F5F0E6;text-decoration:none;font-family:'Cinzel',serif;font-size:.95rem;letter-spacing:.1em;line-height:1.3;display:flex;align-items:center;justify-content:space-between;gap:.6rem;transition:border-color .3s,background .3s\" style-hover=\"border-color:#D4AF6A;background:rgba(212,175,106,.1)\">\n        <span>invita chi insegna</span>\n        <svg aria-hidden=\"true\" sc-camel-view-box=\"0 0 24 24\" fill=\"none\" stroke=\"#D4AF6A\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"flex:none;width:1.5rem;height:1.5rem\"><path d=\"M4 12h15\"></path><path d=\"M13 5l7 7-7 7\"></path></svg>\n      </a>\n    </div>\n  </div>\n\n  <!-- destra: la Scuola itinerante -->\n  <div style=\"position:relative;z-index:1;display:flex;flex-direction:column;gap:1.3rem;max-width:34rem;width:100%;min-width:0;justify-self:start\">\n    <div style=\"display:flex;flex-wrap:wrap;align-items:baseline;gap:.4rem 1.4rem\">\n      <h1 style=\"margin:0;font-family:'Cinzel',serif;font-weight:400;font-size:clamp(2rem,3.6vw,2.9rem);line-height:1.1;letter-spacing:.06em;color:#F5F0E6\">La Scuola itinerante</h1>\n      <div style=\"font-family:'Cinzel',serif;font-size:.84rem;letter-spacing:.28em;text-transform:uppercase;color:#C9A6E0\">etere</div>\n    </div>\n\n    <!-- le tre voci -->\n    <div style=\"display:flex;gap:.45rem\">\n      <sc-for list=\"{{ voci }}\" as=\"v\" hint-placeholder-count=\"2\">\n        <button type=\"button\" sc-camel-on-click=\"{{ v.vai }}\" style=\"flex:1;min-height:3.25rem;padding:.5rem .4rem;border-radius:.7rem;border:1px solid {{ v.bordo }};background:{{ v.fondo }};color:{{ v.colore }};cursor:pointer;text-align:center;display:flex;flex-direction:column;gap:.1rem;align-items:center;transition:background .3s,border-color .3s,color .3s\" style-hover=\"border-color:rgba(153,102,204,.9);color:#F5F0E6\"><b style=\"font-family:'Cinzel',serif;font-weight:400;font-size:1rem\">{{ v.nome }}</b><span style=\"font-family:'Cormorant Garamond',serif;font-style:italic;font-size:.95rem;opacity:.72\">{{ v.sotto }}</span></button>\n      </sc-for>\n    </div>\n\n    <!-- Anta\u1e25kara\u1e47a: il gruppo che c'\u00e8 sempre -->\n    <div style=\"display:flex;flex-direction:column;gap:.5rem\">\n      <div style=\"display:flex;align-items:center;gap:.7rem\">\n        <span style=\"font-family:'Cinzel',serif;font-size:.84rem;letter-spacing:.2em;text-transform:uppercase;color:rgba(212,175,106,.85);white-space:nowrap\">Anta\u1e25kara\u1e47a</span>\n        <span style=\"flex:1;height:1px;background:rgba(212,175,106,.3)\"></span>\n      </div>\n      <a href=\"#\" style=\"display:grid;grid-template-columns:4.2rem minmax(0,1fr) auto;gap:.9rem;align-items:center;padding:.6rem .8rem .6rem .6rem;border-radius:.9rem;border:1px solid rgba(212,175,106,.3);border-left:3px solid rgba(212,175,106,.7);background:rgba(212,175,106,.05);color:inherit;text-decoration:none\" style-hover=\"background:rgba(245,240,230,.05)\">\n        <span style=\"width:4.2rem;height:4.2rem;border-radius:.6rem;background:linear-gradient(135deg,rgba(153,102,204,.28),rgba(8,11,26,.6));border:1px solid rgba(245,240,230,.1);display:grid;place-items:center;font-family:'Cormorant Garamond',serif;font-style:italic;font-size:.84rem;color:rgba(245,240,230,.4)\">[ foto ]</span>\n        <span style=\"min-width:0;display:flex;flex-direction:column;gap:.2rem\">\n          <span style=\"display:flex;align-items:center;gap:.5rem;flex-wrap:wrap\">\n            <span style=\"font-family:'Cormorant Garamond',serif;font-size:1.35rem;line-height:1.25;color:#F5F0E6\">Anta\u1e25kara\u1e47a</span>\n            <span style=\"display:inline-flex;align-items:center;gap:.3rem;padding:.05rem .55rem;border-radius:1rem;border:1px solid rgba(212,175,106,.55);font-family:'Cinzel',serif;font-size:.84rem;letter-spacing:.08em;color:#D4AF6A\"><span style=\"width:.4rem;height:.4rem;border-radius:50%;background:#D4AF6A\"></span>Anta\u1e25kara\u1e47a</span>\n          </span>\n          <span style=\"font-size:.95rem;color:rgba(245,240,230,.7)\">[ chi lo tiene ]</span>\n          <span style=\"font-size:.9rem;color:rgba(245,240,230,.6)\">[ dove ]</span>\n        </span>\n        <span style=\"display:flex;flex-direction:column;align-items:flex-end;gap:.3rem;max-width:7rem;text-align:right\">\n          <span style=\"font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1.05rem;line-height:1.2;color:rgba(245,240,230,.75)\">richiedi al responsabile</span>\n          <span style=\"font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1rem;line-height:1.2;color:#D4AF6A\">scrivi</span>\n        </span>\n      </a>\n    </div>\n\n    <!-- pi\u00f9 vicino \u00b7 pi\u00f9 lontano: le lezioni dal vivo -->\n    <sc-for list=\"{{ fasce }}\" as=\"g\" hint-placeholder-count=\"2\">\n      <div style=\"display:flex;flex-direction:column;gap:.5rem\">\n        <div style=\"display:flex;align-items:center;gap:.7rem\">\n          <span style=\"font-family:'Cinzel',serif;font-size:.84rem;letter-spacing:.2em;text-transform:uppercase;color:{{ g.colore }};white-space:nowrap\">{{ g.nome }}</span>\n          <span style=\"flex:1;height:1px;background:{{ g.riga }}\"></span>\n          <span style=\"font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1rem;color:rgba(245,240,230,.4)\">{{ g.quanti }}</span>\n        </div>\n        <sc-for list=\"{{ g.righe }}\" as=\"r\" hint-placeholder-count=\"3\">\n          <a href=\"#\" class=\"ak-riga\" style=\"display:grid;grid-template-columns:4.2rem minmax(0,1fr) minmax(0,auto);gap:.9rem;align-items:center;padding:.6rem .8rem .6rem .6rem;border-radius:.9rem;border:1px solid rgba(153,102,204,.22);border-left:3px solid rgba(153,102,204,.65);background:rgba(153,102,204,.07);color:inherit;text-decoration:none\" style-hover=\"background:rgba(245,240,230,.05)\">\n            <span style=\"width:4.2rem;height:4.2rem;border-radius:.6rem;background:linear-gradient(135deg,rgba(153,102,204,.28),rgba(8,11,26,.6));border:1px solid rgba(245,240,230,.1);display:grid;place-items:center;font-family:'Cormorant Garamond',serif;font-style:italic;font-size:.84rem;color:rgba(245,240,230,.4)\">[ foto ]</span>\n            <span style=\"min-width:0;display:flex;flex-direction:column;gap:.2rem\">\n              <span style=\"font-family:'Cormorant Garamond',serif;font-size:1.35rem;line-height:1.25;color:#F5F0E6\">{{ r.titolo }}</span>\n              <span style=\"font-size:.95rem;color:rgba(245,240,230,.7)\">{{ r.chi }}</span>\n              <span style=\"font-size:.9rem;color:{{ r.luogoColore }}\">{{ r.dove }} \u00b7 {{ r.quando }}</span>\n            </span>\n            <span style=\"display:flex;flex-direction:column;align-items:flex-end;gap:.3rem;max-width:7rem;text-align:right\">\n              <span style=\"font-family:'Cinzel',serif;font-size:1.05rem;line-height:1.2;color:#F5F0E6\">{{ r.prezzo }}</span>\n              <span style=\"font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1rem;line-height:1.2;color:#C9A6E0\">mi iscrivo</span>\n            </span>\n          </a>\n        </sc-for>\n      </div>\n    </sc-for>\n\n    <!-- ricerca: la tesi, i tre modi, il fondamento, l'indice analitico -->\n    <sc-if value=\"{{ voceRicerca }}\" hint-placeholder-val=\"{{ false }}\">\n      <div style=\"display:flex;flex-direction:column;gap:.8rem;padding:1.2rem 1.3rem 1.1rem;border-radius:1rem;border:1px solid rgba(140,47,57,.4);border-left:3px solid rgba(140,47,57,.75);background:rgba(140,47,57,.1)\">\n        <div style=\"font-family:'Cormorant Garamond',serif;font-size:clamp(1.3rem,2.6vw,1.75rem);line-height:1.3;color:#F5F0E6;text-wrap:pretty\">Qui il valore non \u00e8 quanto paghi. \u00c8 quanti si muovono insieme.</div>\n        <p style=\"margin:0;font-family:'Cormorant Garamond',serif;font-size:1.15rem;line-height:1.5;color:rgba(245,240,230,.78);text-wrap:pretty\">Una persona che paga un abbonamento vale quanto il suo abbonamento. Centinaia di persone che cooperano all\u2019unisono valgono qualcosa che non si conta cos\u00ec.</p>\n        <p style=\"margin:0;font-family:'Cormorant Garamond',serif;font-size:1.15rem;line-height:1.5;color:rgba(245,240,230,.78);text-wrap:pretty\">Per questo quello che si pu\u00f2 fare qui non \u00e8 un listino di permessi: \u00e8 una base. Chi risponde a un bisogno sta cooperando, in qualunque voce lo faccia \u2014 e in molti sono pieni di risorse.</p>\n      </div>\n\n      <div style=\"display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,10rem),1fr));gap:.5rem\">\n        <sc-for list=\"{{ modi }}\" as=\"m\" hint-placeholder-count=\"3\">\n          <div style=\"display:flex;flex-direction:column;gap:.35rem;padding:.9rem 1rem;border-radius:.8rem;border:1px solid rgba(245,240,230,.09);border-left:2px solid {{ m.colore }};background:rgba(2,4,12,.42)\">\n            <b style=\"font-family:'Cinzel',serif;font-weight:400;font-size:.84rem;letter-spacing:.14em;text-transform:uppercase;color:{{ m.colore }};filter:brightness(1.35)\">{{ m.nome }}</b>\n            <span style=\"font-family:'Cormorant Garamond',serif;font-size:1.1rem;line-height:1.45;color:rgba(245,240,230,.82)\">{{ m.testo }}</span>\n          </div>\n        </sc-for>\n      </div>\n\n      <div style=\"display:flex;align-items:baseline;gap:.7rem;flex-wrap:wrap;margin-top:.4rem;padding-bottom:.45rem;border-bottom:1px solid rgba(245,240,230,.1)\">\n        <b style=\"font-family:'Cinzel',serif;font-weight:400;font-size:.9rem;letter-spacing:.14em;text-transform:uppercase;color:#D4AF6A\">Il fondamento</b>\n        <span style=\"font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1.05rem;color:rgba(245,240,230,.4)\">si legge prima di tutto il resto</span>\n      </div>\n      <div style=\"display:flex;flex-direction:column;gap:.55rem;padding:1.1rem 1.2rem;border-radius:.9rem;border:1px solid rgba(153,102,204,.3);border-left:3px solid rgba(153,102,204,.6);background:rgba(153,102,204,.09)\">\n        <b style=\"font-family:'Cinzel',serif;font-weight:400;font-size:.9rem;letter-spacing:.12em;color:#C9A6E0\">La rete ha un centro</b>\n        <p style=\"margin:0;font-family:'Cormorant Garamond',serif;font-size:1.15rem;line-height:1.5;color:rgba(245,240,230,.82)\">Ed \u00e8 un centro eterno, cosciente e beato: \u00e8 Dio. L\u2019origine, la fonte, ci\u00f2 da cui tutto inizia e ci\u00f2 in cui tutto finisce. Un\u2019esistenza eterna.</p>\n        <p style=\"margin:0;font-family:'Cormorant Garamond',serif;font-size:1.15rem;line-height:1.5;color:rgba(245,240,230,.82)\">Su questo il progetto non parla di ipotesi. Parla della visione dell\u2019anima, del Param\u0101tm\u0101, e dell\u2019interazione sottile fra tutti gli individui che insieme fanno parte di una coscienza \u2014 non che la formano, perch\u00e9 la coscienza cosmica \u00e8 indipendente dalla materia e dalle forme.</p>\n        <p style=\"margin:0;font-family:'Cormorant Garamond',serif;font-size:1.15rem;line-height:1.5;color:rgba(245,240,230,.82)\">La fonte \u00e8 la Bhagavad-g\u012bt\u0101.</p>\n        <p style=\"margin:0;font-family:'Cormorant Garamond',serif;font-size:1.15rem;line-height:1.5;color:rgba(245,240,230,.56)\">Tutto ci\u00f2 che segue descrive come le cose si manifestano, non da dove vengono. La ricerca contemporanea sta sotto questo punto, non sopra.</p>\n      </div>\n\n      <!-- l'indice analitico: si estende -->\n      <div style=\"display:flex;align-items:baseline;gap:.7rem;flex-wrap:wrap;margin-top:.4rem;padding-bottom:.45rem;border-bottom:1px solid rgba(245,240,230,.1)\">\n        <b style=\"font-family:'Cinzel',serif;font-weight:400;font-size:.9rem;letter-spacing:.14em;text-transform:uppercase;color:#D4AF6A\">L\u2019indice</b>\n        <span style=\"font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1.05rem;color:rgba(245,240,230,.4)\">tocca per aprire</span>\n        <span style=\"margin-left:auto;font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1.05rem;color:rgba(245,240,230,.4)\">{{ quanteVoci }}</span>\n      </div>\n      <div style=\"display:flex;flex-direction:column;gap:.42rem\">\n        <sc-for list=\"{{ voci_indice }}\" as=\"q\" hint-placeholder-count=\"10\">\n          <div style=\"border-radius:.75rem;overflow:hidden;background:rgba(2,4,12,.4);border:1px solid {{ q.bordo }}\">\n            <button type=\"button\" sc-camel-on-click=\"{{ q.apri }}\" style=\"display:flex;align-items:flex-start;gap:.7rem;width:100%;min-height:2.75rem;padding:.75rem .9rem;border:0;background:transparent;color:#F5F0E6;cursor:pointer;text-align:left;font:inherit\" style-hover=\"background:rgba(245,240,230,.04)\">\n              <i style=\"flex:none;font-style:normal;font-family:'Cinzel',serif;font-size:.9rem;color:#D4AF6A;opacity:.75;margin-top:.15rem\">{{ q.n }}</i>\n              <b style=\"flex:1;min-width:0;font-weight:400;font-family:'Cormorant Garamond',serif;font-size:1.2rem;line-height:1.4\">{{ q.titolo }}</b>\n              <em style=\"flex:none;font-style:normal;color:rgba(245,240,230,.3);font-size:1.1rem;transform:{{ q.freccia }};transition:transform .25s\">\u203a</em>\n            </button>\n            <sc-if value=\"{{ q.aperta }}\" hint-placeholder-val=\"{{ false }}\">\n              <div style=\"padding:0 .9rem .9rem 2.6rem;display:flex;flex-direction:column;gap:.5rem;font-family:'Cormorant Garamond',serif;font-size:1.1rem;line-height:1.5;animation:ak-alza .3s ease both\">\n                <span style=\"color:rgba(245,240,230,.72)\">{{ q.ricerca }}</span>\n                <span style=\"padding-left:.7rem;border-left:2px solid rgba(212,175,106,.4);color:rgba(245,240,230,.88)\">{{ q.qui }}</span>\n              </div>\n            </sc-if>\n          </div>\n        </sc-for>\n        <!-- l'indice si estende: la voce nuova -->\n        <button type=\"button\" style=\"display:flex;align-items:center;gap:.8rem;min-height:3rem;padding:.6rem .9rem;border-radius:.75rem;border:1px dashed rgba(212,175,106,.4);background:transparent;color:rgba(212,175,106,.9);cursor:pointer;text-align:left;font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1.15rem\" style-hover=\"border-color:#D4AF6A;background:rgba(212,175,106,.06)\">\n          <span style=\"flex:none;width:1.7rem;height:1.7rem;border-radius:50%;border:1px solid rgba(212,175,106,.6);display:grid;place-items:center;font-style:normal;font-family:'DM Sans',system-ui,sans-serif;font-size:1rem;color:#D4AF6A\">+</span>\n          <span>[ una voce nuova nell\u2019indice ]</span>\n        </button>\n      </div>\n\n      <div style=\"margin-top:.4rem;padding-top:.9rem;border-top:1px solid rgba(245,240,230,.1);font-family:'Cormorant Garamond',serif;font-size:.95rem;line-height:1.7;color:rgba(245,240,230,.4)\">Da <b style=\"font-weight:400;color:rgba(245,240,230,.6)\">La base di ricerca</b> \u00b7 seconda stesura, 2 agosto 2026<br>Il Cruscotto tiene le decisioni. Questo tiene le ragioni.</div>\n    </sc-if>\n  </div>\n</div>\n\n</x-dc>\n";

/* ── il motore che legge il linguaggio di Design ─────────────
   ⭐ Lo stesso dell’Emporio: sc-for · sc-if · {{ }} ·
      sc-camel-view-box → viewBox · sc-camel-on-click → il gesto.
   ⛔ Niente eval su dati esterni: si legge solo dall’oggetto che
      renderVals ha appena costruito. */

function scVal(esp, d){
  esp = String(esp).trim();
  if(esp === "true") return true;
  if(esp === "false") return false;
  if(/^-?[\d.]+$/.test(esp)) return Number(esp);
  var neg = false;
  if(esp.charAt(0) === "!"){ neg = true; esp = esp.slice(1).trim(); }
  var v = d, pezzi = esp.split(".");
  for(var i = 0; i < pezzi.length; i++){
    if(v === null || v === undefined) return neg ? true : undefined;
    v = v[pezzi[i]];
  }
  return neg ? !v : v;
}
function scTesto(t, d){
  return String(t).replace(/\{\{([^}]*)\}\}/g, function(_, e){
    var v = scVal(e, d);
    return (v === undefined || v === null) ? "" : String(v);
  });
}

function scNodo(n, d, doc, dentroSvg){
  /* il testo */
  if(n.nodeType === 3){
    var t = scTesto(n.nodeValue, d);
    return t.trim() === "" && n.nodeValue.indexOf("{{") > -1
      ? null : doc.createTextNode(t);
  }
  if(n.nodeType !== 1) return null;
  var tag = n.tagName.toLowerCase();

  /* ⭐ sc-for: ripete il contenuto per ogni voce */
  if(tag === "sc-for"){
    var lista = scVal((n.getAttribute("list") || "")
      .replace(/[{}]/g, ""), d) || [];
    var nome = n.getAttribute("as") || "v";
    var f = doc.createDocumentFragment();
    lista.forEach(function(voce){
      var d2 = Object.create(d);
      d2[nome] = voce;
      for(var i = 0; i < n.childNodes.length; i++){
        var c = scNodo(n.childNodes[i], d2, doc, dentroSvg || tag === "svg");
        if(c) f.appendChild(c);
      }
    });
    return f;
  }

  /* ⭐ sc-if: mostra solo se vero */
  if(tag === "sc-if"){
    var v = scVal((n.getAttribute("value") || "").replace(/[{}]/g, ""), d);
    if(!v) return null;
    var f2 = doc.createDocumentFragment();
    for(var j = 0; j < n.childNodes.length; j++){
      var c2 = scNodo(n.childNodes[j], d, doc, dentroSvg || tag === "svg");
      if(c2) f2.appendChild(c2);
    }
    return f2;
  }

  /* un nodo vero */
  /* \u2b50 dentro un <svg> TUTTO \u00e8 SVG: un <symbol> o un <image>
     creati come HTML non si disegnano mai. */
  var el = (dentroSvg || tag === "svg" ||
            n.namespaceURI === "http://www.w3.org/2000/svg" ||
            ["svg","g","line","circle","path","rect","text","polygon",
             "polyline","ellipse","defs","use","clipPath","symbol","image",
             "marker","pattern","mask","filter","linearGradient",
             "radialGradient","stop","tspan","textPath","foreignObject",
             "animate","animateTransform","desc","title","switch","view",
             "feGaussianBlur","feOffset","feMerge","feMergeNode","feBlend",
             "feColorMatrix","feFlood","feComposite"].indexOf(tag) > -1)
    ? doc.createElementNS("http://www.w3.org/2000/svg", tag)
    : doc.createElement(tag);

  for(var k = 0; k < n.attributes.length; k++){
    var a = n.attributes[k], nome2 = a.name, val = a.value;
    if(nome2.indexOf("hint-") === 0) continue;
    /* ⭐ sc-camel-view-box → viewBox */
    if(nome2.indexOf("sc-camel-") === 0){
      var vero = nome2.slice(9).replace(/-([a-z])/g, function(_, c3){
        return c3.toUpperCase();
      });
      if(vero === "onClick"){
        var f3 = scVal(val.replace(/[{}]/g, ""), d);
        if(typeof f3 === "function") el.onclick = f3;
        continue;
      }
      el.setAttribute(vero, scTesto(val, d));
      continue;
    }
    el.setAttribute(nome2, scTesto(val, d));
  }
  for(var m = 0; m < n.childNodes.length; m++){
    var c4 = scNodo(n.childNodes[m], d, doc, dentroSvg || tag === "svg");
    if(c4) el.appendChild(c4);
  }
  return el;
}

/* ── la logica di Design, verbatim ───────────────────────── */
function ScLogica(){
  /* ⛔ lo stato di partenza è quello di Design, non quello
     dell’Emporio: qui si chiama voce, non scaffale. */
  this.state = { voce: 'lezioni', aperte: {} };
  this.setState = function(x){
    var n = typeof x === "function" ? x(this.state) : x;
    for(var k in n) this.state[k] = n[k];
    if(this.suDisegna) this.suDisegna();
  };
}
ScLogica.prototype.renderVals = function() {
    const d = 46, N = v => Math.round(v * 100) / 100;
    const C = [[0, 0]];
    for (let k = 0; k < 6; k++) { const a = (-90 + k * 60) * Math.PI / 180; C.push([N(d * Math.cos(a)), N(d * Math.sin(a))]); }
    for (let k = 0; k < 6; k++) { const a = (-90 + k * 60) * Math.PI / 180; C.push([N(2 * d * Math.cos(a)), N(2 * d * Math.sin(a))]); }
    const linee = [];
    for (let i = 0; i < C.length; i++) for (let j = i + 1; j < C.length; j++) linee.push({ x1: C[i][0], y1: C[i][1], x2: C[j][0], y2: C[j][1] });

    const E = '#9966CC', rgba = (hex, a) => { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };
    const voce = this.state.voce;
    const VOCI = [['lezioni', 'lezioni', 'di persona'], ['online', 'online', 'a distanza']];
    const PIENE = { lezioni: false, online: false, ricerca: true };
    const voci = VOCI.map(([k, n, s]) => { const piena = PIENE[k], on = voce === k; return { nome: n, sotto: piena ? s : '[ vuota ]', vai: () => this.setState({ voce: k }), bordo: on ? rgba(E, .95) : piena ? 'rgba(212,175,106,.35)' : 'rgba(245,240,230,.1)', fondo: on ? rgba(E, .22) : 'rgba(4,8,20,.6)', colore: on ? '#F5F0E6' : piena ? 'rgba(245,240,230,.65)' : 'rgba(245,240,230,.32)' }; });

    const R = window.AK_RICERCA || { modi: [], domande: [] };
    const modi = R.modi.map(m => ({ colore: m[0], nome: m[1], testo: m[2] }));
    const voci_indice = R.domande.map((q, i) => { const ap = !!this.state.aperte[i]; return { n: q[0], titolo: q[1], ricerca: q[2], qui: q[3], aperta: ap, freccia: ap ? 'rotate(90deg)' : 'none', bordo: ap ? rgba(E, .45) : 'rgba(245,240,230,.08)', apri: () => this.setState(s => ({ aperte: { ...s.aperte, [i]: !s.aperte[i] } })) }; });

    return {
      linee, centri: C.map(q => ({ x: q[0], y: q[1] })),
      voci, voceNome: VOCI.find(v => v[0] === voce)[1], voceVuota: !PIENE[voce], voceRicerca: voce === 'ricerca',
      fasce: (() => {
        const LEZ = [
          [0, 'Astrologia', 'Ferrara'], [0, 'Simbologia', 'Ferrara'], [0, 'Agricoltura naturale', 'Livorno'],
          [1, 'Cristalloterapia', 'Livorno'], [1, 'Reiki', 'Giulianova'], [1, 'Astrologia', 'Giulianova']
        ];
        return [['più vicino', .8], ['più lontano', .45]].map(([n, a], i) => { const righe = LEZ.filter(l => l[0] === i).map(l => ({ titolo: l[1], chi: '[ chi insegna ]', dove: l[2], quando: '[ quando ]', prezzo: '[ euro ]', luogoColore: `rgba(245,240,230,${(.3 + .4 * a).toFixed(2)})` }));
          return { nome: n, quanti: righe.length, righe, colore: `rgba(212,175,106,${(.35 + .5 * a).toFixed(2)})`, riga: `rgba(212,175,106,${(.1 + .2 * a).toFixed(2)})` }; });
      })(),
      modi, voci_indice, quanteVoci: voci_indice.length ? voci_indice.length + ' voci' : ''
    };
  };

/* ── le lezioni, dal database ────────────────────────────────────
   ⭐ Da `servizi`, col tipo `formazione`. ⚠️ `a_distanza` dice chi
      non ha luogo: quelli non si ordinano per vicinanza. */
async function scLeggi(){
  var fuori = [];
  try{
    var r = await db.from("servizi")
      .select("id,titolo,descrizione,durata_minuti,a_distanza," +
              "prezzo_euro,dono,persona_id,vicinato_id,creato_il")
      .eq("tipo", "formazione").eq("attivo", true).order("creato_il");
    if(!r.error) (r.data || []).forEach(function(s){
      fuori.push({
        g: 1, cat: s.a_distanza ? "online" : "dal vivo",
        titolo: s.titolo || "", chi: "",
        dove: s.a_distanza ? "da dovunque" : "",
        prezzo: s.dono ? "in dono"
          : (s.prezzo_euro ? s.prezzo_euro + " \u20ac" : ""),
        pratica: false, piene: []
      });
    });
  }catch(e){ console.warn("scuola:", e); }
  return fuori;
}

var scBox = null, scLog = null;

function scDisegna(){
  if(!scBox || !scLog) return;
  var d = scLog.renderVals();
  var tmp = document.createElement("div");
  tmp.innerHTML = SC_CORPO;
  scBox.innerHTML = "";
  /* \u26d4 la griglia sta sul div di Design, ma dentro il guscio quel
     div perde il posto: la si porta sul nodo che la contiene, cos\u00ec
     le due colonne restano affiancate sul computer e una sopra
     l\u2019altra sul telefono. */
  for(var i = 0; i < tmp.childNodes.length; i++){
    var n = scNodo(tmp.childNodes[i], d, document);
    if(n) scBox.appendChild(n);
  }
  /* \u26d4 la griglia sta sul div di Design, ma dentro il guscio quel div
     si ritrova in un contenitore che gliela toglie, e le due colonne
     finiscono una sopra l\u2019altra. Si porta la griglia sul nodo che lo
     contiene e il div dentro sparisce: i suoi figli diventano le
     colonne vere. Sul computer affiancate, sul telefono in fila. */
  var d1 = scBox.firstElementChild;
  if(d1 && d1.getAttribute && (d1.getAttribute("style") || "").indexOf("grid") > -1){
    scBox.setAttribute("style", d1.getAttribute("style"));
    while(d1.firstChild) scBox.appendChild(d1.firstChild);
    scBox.removeChild(d1);
  }
}

async function scuola(dove){
  var box = typeof dove === "string" ? document.querySelector(dove) : dove;
  if(!box) return;
  scBox = box;
  scLog = new ScLogica();
  scLog.suDisegna = scDisegna;
  scDisegna();
  var veri = await scLeggi();
  if(veri.length){ scLog.daiDatabase = veri; scDisegna(); }
}

window.SpazioVivo = window.SpazioVivo || {};
window.SpazioVivo.scuola = scuola;
