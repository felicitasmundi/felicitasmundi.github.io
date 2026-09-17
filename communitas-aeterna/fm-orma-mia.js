/* ═══════════════════════════════════════════════════════════════
   LA MIA ORMA — le tre soglie, il micelio, gli strumenti.

   ⛔ RIFATTO il 16 settembre: la prima versione aveva la veste
      scritta a mano da me, e si vedeva — font diversi, effetti
      mancanti, bagliori persi. ⭐ La regola era già scritta nella
      specifica, e l'avevo tradita solo qui: la veste di chi disegna
      si prende verbatim, non si riscrive.

   ⭐ Ora è come tutte le altre: il corpo e la logica di Design presi
      tali e quali, e un motore che legge il suo linguaggio.

   ⭐ IL COLORE DEI NODI viene dall'ORMA che lega, non dalla persona:
      una persona può avere tre elementi, e ne mostreresti uno a caso.

   ⭐ L'ORMA D'ESEMPIO sparisce colla prima orma vera, non col primo
      talento: chi sceglie un talento e non ha ancora scritto niente
      è il primo giorno di TUTTI, e deve trovare com'è fatta un'orma.

   ⚠️ LA MAPPA È VUOTA finché nessuno dichiara il comune: il gesto
      «dove sei?» lo posa, e da lì ogni orma nasce col suo punto.

   Espone: SpazioVivo.ormaMia(dove)
   ═══════════════════════════════════════════════════════════════ */

"use strict";

var OM_CORPO = "<div data-screen-label=\"La mia orma\" style=\"position:relative;isolation:isolate;font-size:16px;min-height:100vh;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,24rem),1fr));align-items:start;gap:2rem 3rem;padding:2rem clamp(1.25rem,5vw,5rem);box-sizing:border-box;font-family:'DM Sans',system-ui,sans-serif;color:#F5F0E6;background:radial-gradient(ellipse at 22% 20%,rgba(38,64,120,.5),transparent 58%),radial-gradient(ellipse at 84% 84%,rgba(60,44,110,.42),transparent 60%),radial-gradient(ellipse at 40% 45%,#0a1428 0%,#060c1c 46%,#02040c 100%)\">\n  <ak-cosmo aria-hidden=\"true\" style=\"position:absolute;inset:0;z-index:0;pointer-events:none\"></ak-cosmo>\n  <div aria-hidden=\"true\" style=\"position:absolute;inset:0;z-index:0;pointer-events:none;background:radial-gradient(ellipse 55% 70% at 50% 50%,rgba(2,4,12,.55),transparent 100%)\"></div>\n\n  <!-- il cubo: un radar, fermo -->\n  <div style=\"position:sticky;top:2rem;z-index:1;display:grid;grid-template-columns:minmax(0,1fr);justify-items:center;gap:1.2rem;width:100%;justify-self:center\">\n    <!-- il riquadro del tempo: la giornata, in cima al grafico -->\n    <div style=\"display:flex;gap:.55rem;width:100%;max-width:24rem\">\n      <div style=\"flex:1;border:1px solid rgba(184,150,62,.22);border-radius:.75rem;background:rgba(8,11,26,.3);padding:.5rem .5rem;text-align:center\">\n        <b style=\"display:block;font-family:'Cinzel',serif;font-weight:400;font-size:1rem;line-height:1.2;color:#D4AF6A\">[ giorno ]</b>\n        <span style=\"display:block;font-size:.84rem;color:rgba(245,240,230,.45);margin-top:.25rem\">[ mese ]</span>\n      </div>\n      <div style=\"flex:1;border:1px solid rgba(184,150,62,.22);border-radius:.75rem;background:rgba(8,11,26,.3);padding:.5rem .5rem;text-align:center\">\n        <b style=\"display:block;font-family:'Cinzel',serif;font-weight:400;font-size:1.4rem;line-height:1.2;color:#D4AF6A\">\ud83c\udf11</b>\n        <span style=\"display:block;font-size:.84rem;color:rgba(245,240,230,.45);margin-top:.25rem\">[ la luna ]</span>\n      </div>\n      <div style=\"flex:1;border:1px solid rgba(184,150,62,.22);border-radius:.75rem;background:rgba(8,11,26,.3);padding:.5rem .5rem;text-align:center\">\n        <b style=\"display:block;font-family:'Cinzel',serif;font-weight:400;font-size:1rem;line-height:1.2;color:#D4AF6A\">[ il santo ]</b>\n        <span style=\"display:block;font-size:.84rem;color:rgba(245,240,230,.45);margin-top:.25rem\">il santo</span>\n      </div>\n    </div>\n\n    <div style=\"position:relative;width:100%;max-width:min(24rem,58vh);aspect-ratio:1\">\n      <div style=\"position:absolute;inset:8%;pointer-events:none;background:radial-gradient(circle at 50% 50%,{{ aloneColore }},transparent 70%)\"></div>\n      <svg sc-camel-view-box=\"-128 -128 256 256\" aria-hidden=\"true\" style=\"position:absolute;inset:0;width:100%;height:100%;overflow:visible\">\n        <!-- la griglia, sempre uguale -->\n        <g fill=\"none\" stroke=\"#D4AF6A\" stroke-linejoin=\"round\">\n          <g stroke-width=\".7\" opacity=\"{{ grigliaOpacita }}\">\n            <sc-for list=\"{{ linee }}\" as=\"l\" hint-placeholder-count=\"0\"><line x1=\"{{ l.x1 }}\" y1=\"{{ l.y1 }}\" x2=\"{{ l.x2 }}\" y2=\"{{ l.y2 }}\"></line></sc-for>\n          </g>\n          <g stroke-width=\"1\" opacity=\"{{ cerchiOpacita }}\" stroke=\"#C9A6E0\">\n            <sc-for list=\"{{ centri }}\" as=\"c\" hint-placeholder-count=\"0\"><circle cx=\"{{ c.x }}\" cy=\"{{ c.y }}\" r=\"23\"></circle></sc-for>\n          </g>\n          <circle r=\"115\" stroke-width=\"1\" opacity=\".5\"></circle>\n          <rect x=\"-115\" y=\"-115\" width=\"230\" height=\"230\" stroke-width=\".8\" stroke-dasharray=\"3 3.6\" opacity=\".34\"></rect>\n        </g>\n        <!-- le linee: orme legate fra loro -->\n        <g stroke-width=\"1.4\" stroke-linecap=\"round\">\n          <sc-for list=\"{{ legami }}\" as=\"lg\" hint-placeholder-count=\"0\"><line x1=\"{{ lg.x1 }}\" y1=\"{{ lg.y1 }}\" x2=\"{{ lg.x2 }}\" y2=\"{{ lg.y2 }}\" stroke=\"{{ lg.col }}\" opacity=\".7\" style=\"filter:drop-shadow(0 0 2px {{ lg.col }})\"></line></sc-for>\n        </g>\n        <!-- i punti: le orme, col colore del loro elemento -->\n        <g>\n          <sc-for list=\"{{ punti }}\" as=\"p\" hint-placeholder-count=\"0\"><circle cx=\"{{ p.x }}\" cy=\"{{ p.y }}\" r=\"{{ p.r }}\" fill=\"{{ p.col }}\" style=\"filter:drop-shadow(0 0 6px {{ p.col }})\"></circle></sc-for>\n        </g>\n        <!-- il centro: i talenti -->\n        <sc-if value=\"{{ centroAcceso }}\" hint-placeholder-val=\"{{ false }}\">\n          <circle r=\"5\" fill=\"#F5F0E6\" style=\"filter:drop-shadow(0 0 8px #D4AF6A) drop-shadow(0 0 16px #D4AF6A)\"></circle>\n        </sc-if>\n        <!-- le orme senza posto: pulsano fuori dalla figura -->\n        <g fill=\"rgba(245,240,230,.85)\">\n          <sc-for list=\"{{ attese }}\" as=\"a\" hint-placeholder-count=\"0\"><circle class=\"ak-attesa\" cx=\"{{ a.x }}\" cy=\"{{ a.y }}\" r=\"3.2\" style=\"filter:drop-shadow(0 0 5px rgba(245,240,230,.9))\"></circle></sc-for>\n        </g>\n      </svg>\n    </div>\n\n    <!-- sotto la mappa: i due gesti -->\n    <div style=\"display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.7rem;width:100%;max-width:24rem\">\n      <button type=\"button\" sc-camel-on-click=\"{{ apriComune }}\" style=\"min-height:3.5rem;padding:.7rem 1rem;border-radius:.9rem;border:1px solid {{ comuneBordo }};background:{{ comuneFondo }};color:#F5F0E6;cursor:pointer;text-align:left;font-family:'Cinzel',serif;font-size:.95rem;letter-spacing:.1em;line-height:1.3;display:flex;align-items:center;justify-content:space-between;gap:.6rem;transition:border-color .3s,background .3s\" style-hover=\"border-color:#D4AF6A;background:rgba(212,175,106,.1)\">\n        <span style=\"min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap\">{{ comuneTesto }}</span>\n        <svg aria-hidden=\"true\" sc-camel-view-box=\"0 0 24 24\" fill=\"none\" stroke=\"#D4AF6A\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"flex:none;width:1.5rem;height:1.5rem\"><path d=\"M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z\"></path><circle cx=\"12\" cy=\"10\" r=\"2.5\"></circle></svg>\n      </button>\n      <a href=\"invito.html\" style=\"position:relative;overflow:hidden;min-height:3.5rem;padding:.7rem 1rem;border-radius:.9rem;border:1px solid rgba(212,175,106,.45);background:rgba(8,11,26,.5);color:#F5F0E6;text-align:left;cursor:pointer;text-decoration:none;font-family:'Cinzel',serif;font-size:.95rem;letter-spacing:.1em;line-height:1.3;display:flex;align-items:center;justify-content:space-between;gap:.6rem;transition:border-color .3s,background .3s\" style-hover=\"border-color:#D4AF6A;background:rgba(212,175,106,.1)\">\n        <span>invita chi risuona</span>\n        <svg aria-hidden=\"true\" sc-camel-view-box=\"0 0 24 24\" fill=\"none\" stroke=\"#D4AF6A\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"flex:none;width:1.5rem;height:1.5rem\"><path d=\"M4 12h15\"></path><path d=\"M13 5l7 7-7 7\"></path></svg>\n      </a>\n    </div>\n    <div style=\"font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1.15rem;line-height:1.4;color:rgba(245,240,230,.6);text-align:center;max-width:24rem;margin-top:-.4rem\">Inizi a scrivere le orme e attivarti nel vicinato</div>\n\n    <!-- la scelta del comune: si cerca scrivendo, sono 7.896 -->\n    <sc-if value=\"{{ comuneAperto }}\" hint-placeholder-val=\"{{ false }}\">\n      <div style=\"width:100%;max-width:24rem;display:flex;flex-direction:column;gap:.5rem;padding:.9rem;border-radius:.9rem;border:1px solid rgba(212,175,106,.4);background:rgba(4,8,20,.85);animation:ak-alza .4s ease both\">\n        <label style=\"font-family:'Cinzel',serif;font-size:.84rem;letter-spacing:.2em;text-transform:uppercase;color:rgba(212,175,106,.72)\">dove sei \u00b7 scegli il comune</label>\n        <input type=\"search\" value=\"{{ comuneQ }}\" sc-camel-on-change=\"{{ cercaComune }}\" placeholder=\"scrivi il nome del comune\" sc-camel-auto-focus=\"{{ true }}\" style=\"width:100%;box-sizing:border-box;min-height:3rem;padding:.7rem .9rem;border-radius:.7rem;border:1px solid rgba(212,175,106,.5);background:rgba(8,11,26,.8);color:#F5F0E6;font-family:'DM Sans',system-ui,sans-serif;font-size:1.05rem;outline:none\" style-focus=\"border-color:#D4AF6A;box-shadow:0 0 .8rem rgba(212,175,106,.25)\">\n        <div style=\"display:flex;flex-direction:column;max-height:13rem;overflow:auto\">\n          <sc-for list=\"{{ esiti }}\" as=\"e\" hint-placeholder-count=\"0\">\n            <button type=\"button\" sc-camel-on-click=\"{{ e.scegli }}\" style=\"display:flex;justify-content:space-between;gap:1rem;min-height:2.75rem;padding:.5rem .7rem;border:0;border-radius:.5rem;background:transparent;color:#F5F0E6;cursor:pointer;text-align:left;font-family:'DM Sans',system-ui,sans-serif;font-size:1rem\" style-hover=\"background:rgba(212,175,106,.12)\"><span>{{ e.nome }}</span><span style=\"font-family:'Cormorant Garamond',serif;font-style:italic;color:rgba(245,240,230,.45)\">{{ e.prov }}</span></button>\n          </sc-for>\n        </div>\n        <div style=\"font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1rem;color:rgba(245,240,230,.4)\">{{ comuneNota }}</div>\n      </div>\n    </sc-if>\n  </div>\n\n  <!-- la colonna: da collegare, poi i talenti con le loro orme -->\n  <div style=\"position:relative;z-index:1;display:flex;flex-direction:column;gap:1.4rem;max-width:34rem;width:100%;min-width:0;justify-self:start;max-height:calc(100vh - 4rem);overflow:hidden\">\n    <div style=\"display:flex;flex-wrap:wrap;align-items:baseline;gap:.4rem 1.4rem\">\n      <h1 style=\"margin:0;font-family:'Cinzel',serif;font-weight:400;font-size:clamp(2.2rem,3.8vw,3.1rem);line-height:1.1;letter-spacing:.06em;color:#F5F0E6\">La mia orma</h1>\n      <nav style=\"display:flex;flex-wrap:wrap;gap:.4rem 1.2rem;font-family:'Cinzel',serif;font-size:1rem;letter-spacing:.24em;text-transform:uppercase\">\n        <sc-for list=\"{{ soglie }}\" as=\"s\" hint-placeholder-count=\"3\">\n          <button type=\"button\" sc-camel-on-click=\"{{ s.vai }}\" style=\"min-height:2.75rem;padding:0 .2rem;background:none;border:0;border-bottom:1px solid {{ s.riga }};color:{{ s.col }};font:inherit;letter-spacing:inherit;text-transform:inherit;cursor:pointer\" style-hover=\"color:#F5F0E6\">{{ s.nome }}</button>\n        </sc-for>\n      </nav>\n    </div>\n\n    <sc-if value=\"{{ mostraVuota }}\" hint-placeholder-val=\"{{ false }}\">\n      <div style=\"display:flex;flex-direction:column;gap:1.2rem;border-left:1px solid rgba(212,175,106,.28);padding-left:1.4rem;animation:ak-alza .6s ease both\">\n                <button type=\"button\" style=\"align-self:flex-start;min-height:3.25rem;padding:0 2.2rem;border-radius:999px;border:1px solid rgba(212,175,106,.7);background:linear-gradient(180deg,rgba(212,175,106,.18),rgba(212,175,106,.06));color:#F5F0E6;font-family:'Cinzel',serif;font-size:.95rem;letter-spacing:.16em;text-transform:uppercase;cursor:pointer\" style-hover=\"background:linear-gradient(180deg,rgba(212,175,106,.32),rgba(212,175,106,.12));box-shadow:0 0 1.6rem rgba(212,175,106,.28)\">{{ tastoTalento }}</button>\n      </div>\n    </sc-if>\n\n    <sc-if value=\"{{ mostraTalenti }}\" hint-placeholder-val=\"{{ true }}\">\n      <div class=\"ak-lista\" style=\"overflow:auto;padding-right:.6rem;display:flex;flex-direction:column;gap:1.6rem;border-left:1px solid rgba(212,175,106,.28);padding-left:1.4rem;min-height:0\">\n\n        <sc-if value=\"{{ inizio }}\" hint-placeholder-val=\"{{ true }}\">\n          <div style=\"display:flex;flex-direction:column;gap:.35rem;padding:1.1rem 1.2rem;margin-left:-1.4rem;padding-left:1.4rem;border:1px solid rgba(212,175,106,.35);border-radius:.9rem;background:rgba(212,175,106,.06);animation:ak-alza .6s ease both\">\n            <span style=\"font-family:'Cinzel',serif;font-size:.84rem;letter-spacing:.24em;text-transform:uppercase;color:rgba(212,175,106,.8)\">una nota da Anta\u1e25kara\u1e47a</span>\n            <span style=\"font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1.4rem;line-height:1.4;color:rgba(245,240,230,.82)\">Per scrivere la tua prima orma usa lo spazio in basso.</span>\n          </div>\n        </sc-if>\n\n        <!-- da collegare: orme dettate dal Megafono, senza talento -->\n        <sc-if value=\"{{ haAttese }}\" hint-placeholder-val=\"{{ true }}\">\n          <div style=\"display:flex;flex-direction:column;gap:.5rem\">\n            <div style=\"display:flex;align-items:center;gap:.6rem;padding:.6rem .9rem;border:1px dashed rgba(90,122,140,.7);border-radius:.8rem;background:rgba(90,122,140,.1)\">\n              <span class=\"ak-attesa-p\" style=\"flex:none;width:.5rem;height:.5rem;border-radius:50%;background:#5A7A8C\"></span>\n              <span style=\"flex:1;font-family:'Cinzel',serif;font-size:1.05rem;letter-spacing:.06em;color:#8FB0C4\">Da collegare</span>\n              <span style=\"font-size:.84rem;color:rgba(245,240,230,.45)\">{{ quanteAttese }}</span>\n            </div>\n            <div style=\"position:relative;padding-left:1.4rem;margin-left:.9rem;display:flex;flex-direction:column;gap:.45rem;border-left:1px solid rgba(90,122,140,.5)\">\n              <sc-for list=\"{{ attese }}\" as=\"a\" hint-placeholder-count=\"1\">\n                <div style=\"display:flex;flex-direction:column;gap:.35rem;padding:.85rem 1rem;border-radius:.9rem;border:1px solid {{ a.bordo }};border-left:3px solid {{ a.bordoForte }};background:{{ a.fondo }}\">\n                  <div style=\"display:flex;align-items:center;gap:.5rem\">\n                    <span style=\"flex:none;width:1.6rem;height:1.6rem;border-radius:50%;border:1px solid {{ a.bordoForte }};background:{{ a.fondo }};display:grid;place-items:center;font-size:.84rem;color:rgba(245,240,230,.8)\">\u2014</span>\n                    <span style=\"flex:1;min-width:0;font-size:.95rem;color:rgba(245,240,230,.72);white-space:nowrap;overflow:hidden;text-overflow:ellipsis\">{{ a.chi }}</span>\n                    <span style=\"flex:none;font-size:.84rem;color:rgba(245,240,230,.45)\">{{ a.dove }}</span>\n                  </div>\n                  <div style=\"font-family:'Cormorant Garamond',serif;font-size:1.35rem;line-height:1.3;color:#F5F0E6\">{{ a.titolo }}</div>\n                  <div style=\"font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1.1rem;line-height:1.35;color:rgba(245,240,230,.5)\">{{ a.sub }}</div>\n                  <div style=\"display:flex;align-items:center;flex-wrap:wrap;gap:.4rem;margin-top:.3rem;font-size:.9rem;color:rgba(245,240,230,.55)\">\n                    <span style=\"color:{{ a.col }};filter:brightness(1.3)\">{{ a.stanza }}</span>\n                    <span>\u00b7</span>\n                    <span style=\"display:inline-flex;align-items:center;gap:.35rem;font-size:.84rem;letter-spacing:.05em;padding:.1rem .55rem;border-radius:1rem;border:1px solid rgba(245,240,230,.18);color:rgba(245,240,230,.8)\"><span style=\"width:.4rem;height:.4rem;border-radius:50%;background:rgba(245,240,230,.4)\"></span>{{ a.stato }}</span>\n                    <span>\u00b7</span>\n                    <span>{{ a.nate }}</span>\n                    <span style=\"margin-left:auto;color:rgba(245,240,230,.3)\">\u203a</span>\n                  </div>\n                  <sc-if value=\"{{ a.haDa }}\" hint-placeholder-val=\"{{ false }}\">\n                    <div style=\"margin-top:.3rem;font-size:.9rem;line-height:1.4;color:{{ a.daColore }};border:{{ a.daBordo }};border-radius:1rem;padding:{{ a.daPad }};align-self:flex-start\">{{ a.da }}</div>\n                  </sc-if>\n                </div>\n              </sc-for>\n            </div>\n          </div>\n        </sc-if>\n\n        <!-- una radice per talento, e sotto tutto quello che ne \u00e8 venuto -->\n        <sc-for list=\"{{ talenti }}\" as=\"t\" hint-placeholder-count=\"2\">\n          <div style=\"display:flex;flex-direction:column;gap:.5rem\">\n            <div style=\"display:flex;align-items:center;gap:.7rem;padding:.6rem .9rem;border:1.5px solid {{ t.bordo }};border-radius:.8rem;background:{{ t.fondo }};box-shadow:0 0 .8rem {{ t.ombra }}\">\n              <span style=\"flex:none;width:2.4rem;height:2.4rem;display:grid;place-items:center;color:{{ t.col }};filter:brightness(1.25)\"><svg sc-camel-view-box=\"0 0 60 60\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.3\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"width:2.4rem;height:2.4rem\" sc-camel-dangerously-set-inner-h-t-m-l=\"{{ t.svg }}\"></svg></span>\n              <span style=\"flex:1;min-width:0;display:flex;flex-direction:column\"><span style=\"font-family:'Cinzel',serif;font-size:1.15rem;letter-spacing:.06em;color:{{ t.col }};filter:brightness(1.35);line-height:1.2\">{{ t.nome }}</span><span style=\"font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1.05rem;color:rgba(245,240,230,.5)\">{{ t.stanza }}</span></span>\n              <span style=\"flex:none;font-size:.84rem;color:rgba(245,240,230,.45)\">{{ t.quante }}</span>\n            </div>\n            <sc-if value=\"{{ t.mostraEsempio }}\" hint-placeholder-val=\"{{ false }}\">\n              <div style=\"position:relative;padding-left:1.4rem;margin-left:.9rem;border-left:1px dashed {{ t.bordo }}\">\n        <div style=\"display:flex;flex-direction:column;gap:.4rem\">\n          <div style=\"font-family:'Cinzel',serif;font-size:.84rem;letter-spacing:.2em;text-transform:uppercase;color:rgba(245,240,230,.4)\">cos\u00ec sar\u00e0 la tua</div>\n          <a href=\"dentro-orma-esempio.html\" style=\"display:flex;flex-direction:column;gap:.45rem;padding:1rem 1.1rem;border-radius:.9rem;border:1px dashed rgba(245,240,230,.22);border-left:3px solid rgba(170,136,68,.5);background:rgba(245,240,230,.04);opacity:.62;color:inherit;text-decoration:none;transition:opacity .3s\" style-hover=\"opacity:.9\">\n            <div style=\"display:flex;align-items:center;gap:.6rem\">\n              <span style=\"display:flex;flex:none\">\n                <span style=\"width:1.6rem;height:1.6rem;border-radius:50%;border:1px solid rgba(170,136,68,.7);background:rgba(170,136,68,.3);display:grid;place-items:center;font-size:.84rem;color:#F5F0E6\">g</span>\n                <span style=\"width:1.6rem;height:1.6rem;border-radius:50%;border:1px solid rgba(68,136,187,.7);background:rgba(68,136,187,.3);display:grid;place-items:center;font-size:.84rem;color:#F5F0E6;margin-left:-.5rem\">l</span>\n                <span style=\"width:1.6rem;height:1.6rem;border-radius:50%;border:1px solid rgba(204,102,68,.7);background:rgba(204,102,68,.3);display:grid;place-items:center;font-size:.84rem;color:#F5F0E6;margin-left:-.5rem\">r</span>\n                <span style=\"width:1.6rem;height:1.6rem;border-radius:50%;border:1px dashed rgba(245,240,230,.35);display:grid;place-items:center;font-size:.78rem;color:rgba(245,240,230,.6);margin-left:-.5rem\">+3</span>\n              </span>\n              <span style=\"flex:1;min-width:0;font-size:.95rem;color:rgba(245,240,230,.6)\">sei persone</span>\n            </div>\n            <div style=\"font-size:.95rem;line-height:1.4;color:rgba(245,240,230,.6)\">piazza del paese \u00b7 sabato 14 dicembre, dalle 10 alle 19</div>\n            <div style=\"font-family:'Cormorant Garamond',serif;font-size:1.35rem;line-height:1.3;color:rgba(245,240,230,.85)\">Mercatino di dicembre</div>\n            <div style=\"font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1.05rem;line-height:1.35;color:rgba(245,240,230,.45)\">le adesioni entro il 30 novembre</div>\n            <div style=\"display:flex;align-items:center;flex-wrap:wrap;gap:.4rem;margin-top:.3rem;font-size:.9rem;color:rgba(245,240,230,.5)\">\n              <span style=\"color:#C9A45E\">I Vicinati</span><span>\u00b7</span>\n              <span style=\"display:inline-flex;align-items:center;gap:.35rem;font-size:.84rem;letter-spacing:.05em;padding:.1rem .55rem;border-radius:1rem;border:1px solid rgba(170,136,68,.5)\"><span style=\"width:.4rem;height:.4rem;border-radius:50%;background:#AA8844\"></span>in corso</span>\n              <span>\u00b7</span><span>4 orme figlie</span>\n              <span style=\"margin-left:auto;color:rgba(245,240,230,.3)\">\u203a</span>\n            </div>\n          </a>\n        </div>\n              </div>\n            </sc-if>\n            <sc-if value=\"{{ t.vuoto }}\" hint-placeholder-val=\"{{ false }}\">\n              <div style=\"position:relative;padding-left:1.4rem;margin-left:.9rem;border-left:1px dashed {{ t.bordo }};display:flex;flex-direction:column;gap:.45rem\">\n                <!-- \u2461 il gesto: la stessa forma di \u00abApri un'orma dentro questa\u00bb -->\n                <button type=\"button\" style=\"display:flex;align-items:center;gap:.8rem;min-height:3rem;padding:.6rem .9rem;border-radius:.9rem;border:1px dashed rgba(212,175,106,.45);background:transparent;color:rgba(212,175,106,.9);cursor:pointer;text-align:left;font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1.15rem\" style-hover=\"border-color:#D4AF6A;background:rgba(212,175,106,.06)\">\n                  <span style=\"flex:none;width:1.7rem;height:1.7rem;border-radius:50%;border:1px solid rgba(212,175,106,.6);display:grid;place-items:center;font-style:normal;font-family:'DM Sans',system-ui,sans-serif;font-size:1rem;color:#D4AF6A\">+</span>\n                  <span>Apri la prima orma di questo talento</span>\n                </button>\n              </div>\n            </sc-if>\n            <sc-if value=\"{{ t.haOrme }}\" hint-placeholder-val=\"{{ false }}\">\n              <div style=\"position:relative;padding-left:1.4rem;margin-left:.9rem;display:flex;flex-direction:column;gap:.45rem;border-left:1px solid {{ t.bordo }}\">\n                <sc-if value=\"{{ t.haAltre }}\" hint-placeholder-val=\"{{ false }}\"><div style=\"order:9;font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1.05rem;color:rgba(245,240,230,.45);padding:.2rem 0\">{{ t.altre }}</div></sc-if>\n              <sc-for list=\"{{ t.orme }}\" as=\"o\" hint-placeholder-count=\"1\">\n                <div style=\"display:flex;flex-direction:column;gap:.35rem;padding:.85rem 1rem;border-radius:.9rem;border:1px solid {{ o.bordo }};border-left:3px solid {{ o.bordoForte }};background:{{ o.fondo }}\">\n                  <div style=\"display:flex;align-items:center;gap:.5rem\">\n                    <span style=\"flex:none;width:1.6rem;height:1.6rem;border-radius:50%;border:1px solid {{ o.bordoForte }};background:{{ o.fondo }};display:grid;place-items:center;font-size:.84rem;color:rgba(245,240,230,.8)\">\u2014</span>\n                    <span style=\"flex:1;min-width:0;font-size:.95rem;color:rgba(245,240,230,.72);white-space:nowrap;overflow:hidden;text-overflow:ellipsis\">{{ o.chi }}</span>\n                    <span style=\"flex:none;font-size:.84rem;color:rgba(245,240,230,.45)\">{{ o.dove }}</span>\n                  </div>\n                  <div style=\"font-family:'Cormorant Garamond',serif;font-size:1.35rem;line-height:1.3;color:#F5F0E6\">{{ o.titolo }}</div>\n                  <div style=\"font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1.1rem;line-height:1.35;color:rgba(245,240,230,.5)\">{{ o.sub }}</div>\n                  <div style=\"display:flex;align-items:center;flex-wrap:wrap;gap:.4rem;margin-top:.3rem;font-size:.9rem;color:rgba(245,240,230,.55)\">\n                    <span style=\"color:{{ o.col }};filter:brightness(1.3)\">{{ o.stanza }}</span>\n                    <span>\u00b7</span>\n                    <span style=\"display:inline-flex;align-items:center;gap:.35rem;font-size:.84rem;letter-spacing:.05em;padding:.1rem .55rem;border-radius:1rem;border:1px solid rgba(245,240,230,.18);color:rgba(245,240,230,.8)\"><span style=\"width:.4rem;height:.4rem;border-radius:50%;background:rgba(245,240,230,.4)\"></span>{{ o.stato }}</span>\n                    <span>\u00b7</span>\n                    <span>{{ o.nate }}</span>\n                    <span style=\"margin-left:auto;color:rgba(245,240,230,.3)\">\u203a</span>\n                  </div>\n                  <sc-if value=\"{{ o.haDa }}\" hint-placeholder-val=\"{{ false }}\">\n                    <div style=\"margin-top:.3rem;font-size:.9rem;line-height:1.4;color:{{ o.daColore }};border:{{ o.daBordo }};border-radius:1rem;padding:{{ o.daPad }};align-self:flex-start\">{{ o.da }}</div>\n                  </sc-if>\n                </div>\n              </sc-for>\n              </div>\n            </sc-if>\n          </div>\n        </sc-for>\n\n        <sc-if value=\"{{ haFerme }}\" hint-placeholder-val=\"{{ false }}\">\n          <div style=\"padding:.7rem .9rem;border:1px dashed rgba(245,240,230,.18);border-radius:.8rem;background:rgba(8,11,26,.35)\">\n            <div style=\"font-size:1rem;color:rgba(245,240,230,.6)\">{{ fermeTitolo }}</div>\n            <div style=\"font-family:'Cormorant Garamond',serif;font-size:1.05rem;color:rgba(245,240,230,.35);margin-top:.15rem\">{{ fermeNomi }}</div>\n          </div>\n        </sc-if>\n\n        <a href=\"#stanze\" style=\"align-self:flex-start;display:inline-flex;align-items:center;min-height:3.25rem;padding:0 2.2rem;border-radius:999px;border:1px solid rgba(212,175,106,.7);background:linear-gradient(180deg,rgba(212,175,106,.18),rgba(212,175,106,.06));color:#F5F0E6;font-family:'Cinzel',serif;font-size:.95rem;letter-spacing:.16em;text-transform:uppercase;cursor:pointer;text-decoration:none\" style-hover=\"background:linear-gradient(180deg,rgba(212,175,106,.32),rgba(212,175,106,.12));box-shadow:0 0 1.6rem rgba(212,175,106,.28)\">{{ tastoTalento }}</a>\n      </div>\n    </sc-if>\n\n    <!-- \u2461 squadre -->\n    <sc-if value=\"{{ mostraSquadre }}\" hint-placeholder-val=\"{{ false }}\">\n      <div class=\"ak-lista\" style=\"overflow:auto;padding-right:.6rem;display:flex;flex-direction:column;gap:1.4rem;border-left:1px solid rgba(212,175,106,.28);padding-left:1.4rem;min-height:0\">\n        <sc-if value=\"{{ senzaSquadre }}\" hint-placeholder-val=\"{{ true }}\">\n          <div style=\"display:flex;flex-direction:column;gap:1.2rem;animation:ak-alza .6s ease both\">\n            <div style=\"display:flex;flex-direction:column;gap:.35rem;padding:1rem 1.2rem;border:1px dashed rgba(212,175,106,.3);border-radius:.9rem;background:rgba(212,175,106,.04)\">\n              <span style=\"font-family:'Cinzel',serif;font-size:.84rem;letter-spacing:.24em;text-transform:uppercase;color:rgba(212,175,106,.8)\">una nota da Anta\u1e25kara\u1e47a</span>\n              <span style=\"font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1.4rem;line-height:1.4;color:rgba(245,240,230,.82)\">Qua vengono segnate le squadre a cui partecipi.</span>\n            </div>\n          </div>\n        </sc-if>\n        <sc-if value=\"{{ conSquadre }}\" hint-placeholder-val=\"{{ false }}\">\n          <sc-for list=\"{{ gruppiSquadre }}\" as=\"g\" hint-placeholder-count=\"3\">\n            <div style=\"display:flex;flex-direction:column;gap:.4rem\">\n              <div style=\"display:flex;align-items:center;gap:.45rem;font-size:.84rem;letter-spacing:.15em;text-transform:uppercase;color:{{ g.col }};filter:brightness(1.35)\"><span style=\"width:.4rem;height:.4rem;border-radius:50%;background:{{ g.col }}\"></span>{{ g.nome }}<span style=\"margin-left:auto;color:rgba(245,240,230,.32);letter-spacing:.06em;filter:none\">{{ g.quante }}</span></div>\n              <sc-for list=\"{{ g.squadre }}\" as=\"q\" hint-placeholder-count=\"1\">\n                <div style=\"display:flex;flex-direction:column;gap:.25rem;padding:.7rem .85rem;border-radius:.75rem;border:1px solid {{ g.bordo }};border-left:3px solid {{ g.bordoForte }};background:{{ g.fondo }}\">\n                  <div style=\"display:flex;align-items:center;gap:.5rem;flex-wrap:wrap\">\n                    <span style=\"flex:none;width:.65rem;height:.65rem;border-radius:50%;border:1.5px solid {{ g.col }};background:{{ q.lume }};box-shadow:{{ q.lumeOmbra }}\"></span>\n                    <span style=\"flex:1;font-family:'Cormorant Garamond',serif;font-size:1.3rem;line-height:1.3;color:#F5F0E6\">{{ q.nome }}</span>\n                    <span style=\"flex:none;font-size:.84rem;color:rgba(245,240,230,.4)\">{{ q.dal }}</span>\n                  </div>\n                  <div style=\"font-size:.95rem;color:rgba(245,240,230,.55)\">{{ q.chi }}</div>\n                  <div style=\"display:flex;gap:.35rem;flex-wrap:wrap;margin-top:.2rem\">\n                    <sc-for list=\"{{ q.stanze }}\" as=\"z\" hint-placeholder-count=\"1\"><span style=\"font-size:.84rem;padding:.1rem .55rem;border-radius:1rem;border:1px solid {{ z.bordo }};color:{{ z.col }};filter:brightness(1.3)\">{{ z.nome }}</span></sc-for>\n                  </div>\n                </div>\n              </sc-for>\n            </div>\n          </sc-for>\n        </sc-if>\n      </div>\n    </sc-if>\n\n    <!-- \u2462 strumenti: quattro quadranti, un dato ciascuno -->\n    <sc-if value=\"{{ mostraStrumenti }}\" hint-placeholder-val=\"{{ false }}\">\n      <div style=\"display:flex;flex-direction:column;gap:.9rem\">\n        <sc-for list=\"{{ strumenti }}\" as=\"u\" hint-placeholder-count=\"4\">\n          <a href=\"{{ u.href }}\" style=\"display:flex;flex-direction:column;gap:.35rem;min-height:5.5rem;padding:1rem 1.2rem;border-radius:1rem;border:1px solid rgba(212,175,106,.35);background:rgba(8,11,26,.5);color:#F5F0E6;text-decoration:none;transition:border-color .25s,background .25s\" style-hover=\"border-color:rgba(212,175,106,.8);background:rgba(212,175,106,.08)\">\n            <span style=\"display:flex;align-items:center;gap:.5rem;font-family:'Cinzel',serif;font-size:1rem;letter-spacing:.14em;text-transform:uppercase;color:#D4AF6A\"><span style=\"font-size:1.1rem;line-height:1;color:rgba(212,175,106,.8)\">{{ u.segno }}</span>{{ u.nome }}</span>\n            <span style=\"font-family:'Cormorant Garamond',serif;font-size:1.45rem;line-height:1.25;color:#F5F0E6;margin-top:auto\">{{ u.dato }}</span>\n            <span style=\"font-size:.84rem;color:rgba(245,240,230,.45)\">{{ u.sotto }}</span>\n          </a>\n        </sc-for>\n      </div>\n    </sc-if>\n  </div>\n</div>\n\n</x-dc>\n";

/* ── il motore che legge il linguaggio di Design ───────────────── */

function omVal(esp, d){
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
function omTesto(t, d){
  return String(t).replace(/\{\{([^}]*)\}\}/g, function(_, e){
    var v = omVal(e, d);
    return (v === undefined || v === null) ? "" : String(v);
  });
}

function omNodo(n, d, doc, dentroSvg){
  /* il testo */
  if(n.nodeType === 3){
    var t = omTesto(n.nodeValue, d);
    return t.trim() === "" && n.nodeValue.indexOf("{{") > -1
      ? null : doc.createTextNode(t);
  }
  if(n.nodeType !== 1) return null;
  var tag = n.tagName.toLowerCase();

  /* ⭐ sc-for: ripete il contenuto per ogni voce */
  if(tag === "sc-for"){
    var lista = omVal((n.getAttribute("list") || "")
      .replace(/[{}]/g, ""), d) || [];
    var nome = n.getAttribute("as") || "v";
    var f = doc.createDocumentFragment();
    lista.forEach(function(voce){
      var d2 = Object.create(d);
      d2[nome] = voce;
      for(var i = 0; i < n.childNodes.length; i++){
        var c = omNodo(n.childNodes[i], d2, doc, dentroSvg || tag === "svg");
        if(c) f.appendChild(c);
      }
    });
    return f;
  }

  /* ⭐ sc-if: mostra solo se vero */
  if(tag === "sc-if"){
    var v = omVal((n.getAttribute("value") || "").replace(/[{}]/g, ""), d);
    if(!v) return null;
    var f2 = doc.createDocumentFragment();
    for(var j = 0; j < n.childNodes.length; j++){
      var c2 = omNodo(n.childNodes[j], d, doc, dentroSvg || tag === "svg");
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
        var f3 = omVal(val.replace(/[{}]/g, ""), d);
        if(typeof f3 === "function") el.onclick = f3;
        continue;
      }
      el.setAttribute(vero, omTesto(val, d));
      continue;
    }
    el.setAttribute(nome2, omTesto(val, d));
  }
  for(var m = 0; m < n.childNodes.length; m++){
    var c4 = omNodo(n.childNodes[m], d, doc, dentroSvg || tag === "svg");
    if(c4) el.appendChild(c4);
  }
  return el;
}

/* ── la logica di Design, verbatim ──────────────────────────────── */
function OmLogica(){
  /* ⛔ Design legge anche this.props: senza, renderVals si ferma
     alla prima riga. ⭐ I valori veri li mette omDisegna. */
  this.props = {};
  this.state = { soglia: 'Talenti', comune: null, comuneAperto: false, comuneQ: '' };
  this.setState = function(x){
    var n = typeof x === "function" ? x(this.state) : x;
    for(var k in n) this.state[k] = n[k];
    if(this.suDisegna) this.suDisegna();
  };
}
/* ⭐ il metodo che disegna i simboli — di Design, verbatim */
OmLogica.prototype.simbolo = function(nome) {
    for (const s of (window.AK_STANZE || [])) for (const g of s.gruppi) for (const t of g.talenti) if (t.nome === nome) return { __html: t.svg };
    return { __html: '<circle cx="30" cy="30" r="6"/>' };
  };

OmLogica.prototype.renderVals = function() {
    const d = 46, N = v => Math.round(v * 100) / 100;
    const C = [[0, 0]];
    for (let k = 0; k < 6; k++) { const a = (-90 + k * 60) * Math.PI / 180; C.push([N(d * Math.cos(a)), N(d * Math.sin(a))]); }
    for (let k = 0; k < 6; k++) { const a = (-90 + k * 60) * Math.PI / 180; C.push([N(2 * d * Math.cos(a)), N(2 * d * Math.sin(a))]); }
    const linee = [];
    for (let i = 0; i < C.length; i++) for (let j = i + 1; j < C.length; j++) linee.push({ x1: C[i][0], y1: C[i][1], x2: C[j][0], y2: C[j][1] });

    const EL = { terra: '#AA8844', acqua: '#4488BB', fuoco: '#CC6644', aria: '#669944', etere: '#9966CC', svil: '#5A7A8C' };
    const stato = this.props.stato ?? 'appena scelti';
    const vuota = stato === 'vuota', inizio = stato === 'appena scelti';
    const nAttese = (vuota || inizio) ? 0 : Math.max(0, Math.min(3, this.props.ormeDaCollegare ?? 2));

    // la matrice: una radice per talento, e sotto le orme; la scheda di ogni orma segue lo schema di Gab
    const orma = (o) => ({ chi: '[ chi c’è dentro ]', dove: '[ dove, o quando ]', sub: '[ la riga sotto, se serve ]', stato: 'in coda', nate: '[ quante nate ]', ...o });
    const talenti = vuota ? [] : [
      { nome: 'Talento 1', simbolo: 'Mi prendo cura delle piante', stanza: 'I Vicinati', el: 'terra', orme: inizio ? [] : [
        orma({ titolo: '[ il titolo dell’orma ]', stanza: 'Vicinati', el: 'terra' }),
        orma({ titolo: '[ un’altra orma, nata da quella sopra ]', sub: '[ la riga sotto ]', stanza: 'Emporio', el: 'acqua', da: '↳ nata da [ il titolo dell’orma madre ]' }),
        orma({ titolo: '[ un’orma che ne contiene altre ]', sub: '[ la riga sotto ]', stanza: 'Vicinati', el: 'terra', nate: '[ n ] dentro' }),
        orma({ titolo: '[ un’orma che sta a cavallo ]', sub: '[ la riga sotto ]', stanza: 'Edizione', el: 'aria', da: '⚓ ancorata anche a [ un altro talento ]' })
      ] },
      { nome: 'Talento 2', simbolo: 'Accompagno la comunicazione empatica e la gestione dei conflitti', stanza: 'Assistenza', el: 'fuoco', orme: inizio ? [] : [
        orma({ titolo: '[ un’orma sotto questa radice ]', sub: '[ la riga sotto ]', stanza: 'Assistenza', el: 'fuoco' })
      ] },
      { nome: 'Talento 3', simbolo: 'Agricoltura', stanza: 'La Scuola', el: 'etere', orme: [] }
    ];
    const attesaBase = { titolo: '[ un’orma dettata dal Megafono ]', stanza: '[ la stanza ]', el: 'svil', da: '↳ da collegare a un talento', daVuoto: true };
    const tutteAttese = inizio ? [orma({ ...attesaBase })] : [orma({ ...attesaBase }), orma({ ...attesaBase }), orma({ ...attesaBase })].slice(0, nAttese);

    // il micelio: io al centro, ogni persona con cui ho un'orma è un nodo, le linee sono le orme condivise.
    // ⛔ il colore NON è della persona: è dell'ORMA che ci lega (la stanza dove lavoriamo insieme).
    //    Se ci legano più orme in stanze diverse, vale la più recente.
    const ORME = (vuota || inizio) ? [] : [
      { id: 'o1', el: 'terra', quando: 3, con: ['p1', 'p2'] },
      { id: 'o2', el: 'terra', quando: 5, con: ['p1', 'p6'] },
      { id: 'o3', el: 'fuoco', quando: 4, con: ['p3', 'p4'] },
      { id: 'o4', el: 'etere', quando: 7, con: ['p4'] },          // p4: fuoco poi etere → etere (più recente)
      { id: 'o5', el: 'etere', quando: 2, con: ['p5'] },
      { id: 'o6', el: 'acqua', quando: 6, con: ['p7'] }
    ];
    const perPersona = {};
    ORME.forEach(o => o.con.forEach(p => {
      if (!perPersona[p]) perPersona[p] = { id: p, orme: [], el: o.el, quando: o.quando };
      perPersona[p].orme.push(o.id);
      if (o.quando > perPersona[p].quando) { perPersona[p].el = o.el; perPersona[p].quando = o.quando; }
    }));
    const persone = Object.values(perPersona).sort((x, y) => x.id < y.id ? -1 : 1);
    // prima il primo anello (1..6), poi il secondo (7..12)
    const posto = {}; persone.forEach((p, i) => { posto[p.id] = C[1 + (i % 12)]; });
    const punti = persone.map(p => ({ x: posto[p.id][0], y: posto[p.id][1], r: 4.2, col: EL[p.el] }));
    // linee: da me a ogni persona, nel colore dell'orma più recente; e fra due persone nella stessa orma, nel colore di quell'orma
    const legami = persone.map(p => ({ x1: 0, y1: 0, x2: posto[p.id][0], y2: posto[p.id][1], col: EL[p.el] }));
    ORME.forEach(o => { for (let i = 0; i < o.con.length; i++) for (let j = i + 1; j < o.con.length; j++)
      legami.push({ x1: posto[o.con[i]][0], y1: posto[o.con[i]][1], x2: posto[o.con[j]][0], y2: posto[o.con[j]][1], col: EL[o.el] }); });
    const orme = persone;
    const attese = tutteAttese.map((a, i) => { const ang = [-135, -45, 135][i] * Math.PI / 180; return { ...a, x: N(120 * Math.cos(ang)), y: N(120 * Math.sin(ang)) }; });

    const lettura = '[ le parole di Gab ]';

    const rgba = (hex, al) => { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${al})`; };
    const scheda = o => { const c = EL[o.el]; return {
      ...o, col: c, bordo: rgba(c, .28), bordoForte: rgba(c, .6), fondo: rgba(c, .09),
      haDa: !!o.da, daColore: o.daVuoto ? '#8FB0C4' : 'rgba(245,240,230,.55)',
      daBordo: o.daVuoto ? '1px dashed rgba(90,122,140,.6)' : '0', daPad: o.daVuoto ? '.15rem .6rem' : '0'
    }; };
    const ferme = talenti.filter(t => !t.orme.length && !inizio);
    const soglia = this.state.soglia;
    const soglie = ['Talenti', 'Squadre', 'Strumenti'].map(n => ({ nome: n, vai: () => this.setState({ soglia: n }), col: n === soglia ? '#D4AF6A' : 'rgba(245,240,230,.5)', riga: n === soglia ? 'rgba(212,175,106,.7)' : 'transparent' }));
    const STZ = { Vicinati: 'terra', Emporio: 'acqua', Assistenza: 'fuoco', Edizione: 'aria', Scuola: 'etere', Nexus: 'nexus' };
    const ELS = { ...EL, nexus: '#8C2F39' };
    const stanzeSq = arr => arr.map(n => ({ nome: n, col: ELS[STZ[n]], bordo: rgba(ELS[STZ[n]], .45) }));
    const lume = tipo => ({ ospite: ['transparent', 'none'], praticante: ['CUR', 'none'], operatore: ['CUR', '0 0 .5rem CUR'], nucleo: ['#C8A055', '0 0 .6rem rgba(200,160,85,.7)'] })[tipo];
    const gruppiSquadre = (inizio || vuota) ? [] : [
      { nome: 'Nuclei', el: 'nexus', squadre: [{ nome: '[ il nome del gruppo ]', tipo: 'nucleo', chi: '[ chi ne fa parte ]', stanze: ['Vicinati', 'Edizione'] }] },
      { nome: 'Nucleo', el: 'terra', squadre: [{ nome: '[ il nome del gruppo ]', tipo: 'operatore', chi: '[ chi ne fa parte ]', stanze: ['Vicinati'] }] },
      { nome: 'Progetti', el: 'aria', squadre: [{ nome: '[ il nome che ha messo la persona ]', tipo: 'praticante', chi: '[ chi ne fa parte ]', stanze: ['Scuola', 'Emporio'] }, { nome: '[ un altro nome ]', tipo: 'ospite', chi: '[ chi ne fa parte ]', stanze: ['Nexus'] }] }
    ].map(g => { const c = ELS[g.el]; return { nome: g.nome, col: c, bordo: rgba(c, .26), bordoForte: rgba(c, .58), fondo: rgba(c, .07), quante: '[ n ]',
      squadre: g.squadre.map(q => { const l = lume(q.tipo); return { nome: q.nome, chi: q.chi, dal: 'dal [ quando ]', lume: l[0].replace('CUR', c), lumeOmbra: l[1].replace('CUR', c), stanze: stanzeSq(q.stanze) }; }) }; });
    const strumenti = [
      { nome: 'Antahkarana', segno: '✦', dato: '[ il livello ]', sotto: '[ la prossima puntata ]', href: '#antahkarana' },
      { nome: 'Conti', segno: '€', dato: '[ entrate ] · [ uscite ]', sotto: 'aggiornato [ quando ]', href: '#conti' },
      { nome: 'Calendario', segno: '▤', dato: '[ la prossima data ]', sotto: '[ che cosa ]', href: '#calendario' },
      { nome: 'Rubrica', segno: '☉', dato: '[ l’ultimo contatto ]', sotto: '[ quando ]', href: '#rubrica' }
    ];
    return {
      comuneTesto: this.state.comune || 'dove sei?',
      comuneBordo: this.state.comune ? 'rgba(212,175,106,.75)' : 'rgba(212,175,106,.45)',
      comuneFondo: this.state.comune ? 'rgba(212,175,106,.12)' : 'rgba(8,11,26,.5)',
      comuneAperto: this.state.comuneAperto, comuneQ: this.state.comuneQ,
      apriComune: () => this.setState(s => ({ comuneAperto: !s.comuneAperto })),
      cercaComune: e => this.setState({ comuneQ: e.target.value }),
      esiti: (() => { const q = this.state.comuneQ.normalize('NFD').replace(/[\\u0300-\\u036f’']/g, '').toLowerCase().trim(); if (q.length < 2) return [];
        const norm = s => s.normalize('NFD').replace(/[\\u0300-\\u036f’']/g, '').toLowerCase();
        return Component.COMUNI.filter(c => norm(c[0]).includes(q)).slice(0, 8).map(c => ({ nome: c[0], prov: c[1], scegli: () => this.setState({ comune: c[0], comuneAperto: false, comuneQ: '' }) })); })(),
      comuneNota: this.state.comuneQ.trim().length < 2 ? '7.896 comuni · scrivi almeno due lettere' : '',
      soglie, mostraTalenti: soglia === 'Talenti' && !vuota, mostraVuota: soglia === 'Talenti' && vuota,
      mostraSquadre: soglia === 'Squadre', mostraStrumenti: soglia === 'Strumenti',
      senzaSquadre: gruppiSquadre.length === 0, conSquadre: gruppiSquadre.length > 0, gruppiSquadre, strumenti,
      linee, centri: C.map(q => ({ x: q[0], y: q[1] })),
      grigliaOpacita: vuota ? .22 : .38, cerchiOpacita: vuota ? .2 : .34,
      aloneColore: vuota ? 'rgba(212,175,106,.06)' : 'rgba(212,175,106,.16)',
      punti, legami, attese: attese.map(scheda), centroAcceso: talenti.length > 0,
      vuota, piena: !vuota, inizio, haAttese: attese.length > 0,
      quanteAttese: attese.length === 1 ? '1 orma' : attese.length + ' orme',
      tastoTalento: talenti.length ? 'aggiungi un talento' : 'scegli il primo talento',
      talenti: talenti.map((t, i) => ({
        nome: t.nome, stanza: t.stanza, col: EL[t.el], svg: this.simbolo(t.simbolo),
        bordo: rgba(EL[t.el], t.orme.length ? .55 : .3), fondo: rgba(EL[t.el], t.orme.length ? .14 : .05), ombra: rgba(EL[t.el], t.orme.length ? .22 : 0),
        quante: inizio ? '' : t.orme.length ? (t.orme.length === 1 ? '1 orma' : t.orme.length + ' orme') : 'senza orme',
        haOrme: t.orme.length > 0, vuoto: t.orme.length === 0, orme: t.orme.slice(-3).map(scheda),
        mostraEsempio: i === 0 && talenti.every(x => !x.orme.length),
        haAltre: t.orme.length > 3, altre: (t.orme.length - 3) + ' altre'
      })),
      haFerme: ferme.length > 0,
      fermeTitolo: ferme.length === 1 ? '1 talento non ha ancora un’orma' : ferme.length + ' talenti non hanno ancora un’orma',
      fermeNomi: ferme.map(t => t.nome).join(' · ')
    };
  };

var omBox = null, omLog = null, omDati = null;

/* ── leggere ────────────────────────────────────────────────────── */
async function omLeggi(){
  var d = { io:null, orme:[], talenti:[], micelio:[], santo:null, comuni:[] };
  try{
    var u = await db.auth.getUser();
    var id = u && u.data && u.data.user && u.data.user.id;
    if(!id) return d;

    var p = await db.from("persone")
      .select("id,nome,grado,livello_n,talenti,foto_url,comune_cod,vicinato_id")
      .eq("id", id).single();
    if(!p.error) d.io = p.data;

    var o = await db.from("orme")
      .select("id,titolo,contenuto,sottotitolo,elemento,stadio,luogo," +
              "accaduto_il,entro_il,talento_id,orma_madre_id,destinazione")
      .eq("persona_id", id).order("momento", { ascending:false }).limit(120);
    d.orme = o.error ? [] : (o.data || []);

    var t = await db.from("orme")
      .select("talento_id,talenti(id,nome,stanza,elemento)")
      .eq("persona_id", id).not("talento_id", "is", null);
    var visti = {};
    (t.error ? [] : t.data || []).forEach(function(r){
      if(r.talenti && !visti[r.talenti.id]) visti[r.talenti.id] = r.talenti;
    });
    d.talenti = Object.keys(visti).map(function(k){ return visti[k]; });

    /* ⭐ il micelio: chi lavora colle mie orme, COL COLORE DELL'ORMA */
    var ids = d.orme.map(function(x){ return x.id; }).slice(0, 60);
    if(ids.length){
      var op = await db.from("orma_persone")
        .select("persona_id,orma_id").in("orma_id", ids).is("lasciato_il", null);
      var per = {};
      (op.error ? [] : op.data || []).forEach(function(r){
        if(r.persona_id === id) return;
        var orm = d.orme.filter(function(x){ return x.id === r.orma_id; })[0];
        if(!per[r.persona_id])
          per[r.persona_id] = { id:r.persona_id,
            el: (orm && orm.elemento) || "terra", orme:[] };
        per[r.persona_id].orme.push(r.orma_id);
      });
      d.micelio = Object.keys(per).map(function(k){ return per[k]; });
    }

    var oggi = new Date();
    var mm2 = String(oggi.getMonth()+1).padStart(2,"0");
    var gg = String(oggi.getDate()).padStart(2,"0");
    var sa = await db.from("santi").select("nome").eq("giorno", mm2+"-"+gg).limit(1);
    if(!sa.error && sa.data && sa.data[0]) d.santo = sa.data[0].nome;
  }catch(e){ console.warn("la mia orma:", e); }
  return d;
}

/* ⭐ i comuni: si cercano scrivendo, e sono 7.896 */
async function omCercaComuni(q){
  if(!q || q.length < 2) return [];
  try{
    var r = await db.from("territori")
      .select("codice,nome").eq("tipo", "comune")
      .ilike("nome", q + "%").order("nome").limit(12);
    return r.error ? [] : (r.data || []);
  }catch(e){ return []; }
}

/* ⭐ posare il comune: da lì ogni orma nasce col suo punto */
async function omPosaComune(codice){
  try{
    var u = await db.auth.getUser();
    var id = u && u.data && u.data.user && u.data.user.id;
    if(!id) return;
    await db.from("persone").update({ comune_cod: codice }).eq("id", id);
    await ormaMia(omBox);
  }catch(e){ console.warn("dove sei:", e); }
}

function omDisegna(){
  if(!omBox || !omLog) return;
  var d = omLog.renderVals();
  /* ⭐ i dati veri prendono il posto dei segnaposti */
  if(omDati){
    if(omDati.io){
      d.nome = omDati.io.nome || d.nome;
      d.grado = omDati.io.grado || d.grado;
    }
    if(omDati.santo) d.santo = omDati.santo;
    d.cercaComuni = omCercaComuni;
    d.posaComune = omPosaComune;
  }
  var tmp = document.createElement("div");
  tmp.innerHTML = OM_CORPO;
  omBox.innerHTML = "";
  for(var i = 0; i < tmp.childNodes.length; i++){
    var n = omNodo(tmp.childNodes[i], d, document);
    if(n) omBox.appendChild(n);
  }
  /* ⛔ la griglia di Design si perde dentro il guscio: si porta fuori */
  var d1 = omBox.firstElementChild;
  if(d1 && d1.getAttribute && (d1.getAttribute("style") || "").indexOf("grid") > -1){
    omBox.setAttribute("style", d1.getAttribute("style"));
    while(d1.firstChild) omBox.appendChild(d1.firstChild);
    omBox.removeChild(d1);
  }
}

async function ormaMia(dove){
  var box = typeof dove === "string" ? document.querySelector(dove) : dove;
  if(!box) return;
  omBox = box;
  omLog = new OmLogica();
  omLog.suDisegna = omDisegna;
  omDisegna();
  omDati = await omLeggi();
  if(omDati.orme.length || omDati.talenti.length) omLog.daiDatabase = omDati;
  omDisegna();
}

window.SpazioVivo = window.SpazioVivo || {};
window.SpazioVivo.ormaMia = ormaMia;
