/* ═══════════════════════════════════════════════════════════════
   L'EMPORIO — la stanza dell'acqua.

   ⛔ IL DISEGNO E LA LOGICA SONO DI DESIGN, presi verbatim da
      `stanza-emporio.html`: il corpo col suo linguaggio
      (sc-for, sc-if, {{ }}) e il renderVals tale e quale.
      ⭐ Un piccolo motore qui sotto lo interpreta: così nessuna
         riga è riscritta a mano, e non si perde un bagliore.

   ⭐ LE NOVE CATEGORIE, colle percentuali che restano a
      FelicitasMundi: alimenti 5 · rimedi 8 · cosmesi 10 ·
      oggettistica 10 · abbigliamento 10 · arredo 10 ·
      oggetti sacri 10 · libri e stampati 15 · digitale 20.

   ⭐ I TRE GRUPPI: Antahkarana · più vicino · più lontano.
      Nella pagina generale i primi sono sempre gli stessi — la
      Bhagavad-gītā, il Nexus — poi il resto in ordine di
      inserimento. ⚠️ Dentro una categoria, Antahkarana cambia.

   ⭐ SCRIVI: si comprano, ma l'accordo si fa fuori dalla piattaforma,
      col responsabile. La parola è «scrivi», e si apre la posta o un
      messaggio. ⛔ Non passano dal carrello — non perché non si
      vendano, ma perché il prezzo e la consegna si accordano parlando.

   ⭐ LE QUATTRO LINGUETTE si aprono solo se hanno qualcosa: a chi
      guarda una vuota non compare, a chi lo fa compare come gesto.

   Espone: SpazioVivo.emporio(dove)
   ═══════════════════════════════════════════════════════════════ */

"use strict";

var EMP_CORPO = "<div data-screen-label=\"L'Emporio\" style=\"position:relative;isolation:isolate;font-size:16px;min-height:100vh;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,24rem),1fr));align-items:start;gap:2rem 3rem;padding:2rem clamp(1.25rem,5vw,5rem);box-sizing:border-box;font-family:'DM Sans',system-ui,sans-serif;color:#F5F0E6;background:radial-gradient(ellipse at 22% 20%,rgba(38,64,120,.5),transparent 58%),radial-gradient(ellipse at 84% 84%,rgba(60,44,110,.42),transparent 60%),radial-gradient(ellipse at 40% 45%,#0a1428 0%,#060c1c 46%,#02040c 100%)\">\n  <ak-cosmo aria-hidden=\"true\" style=\"position:absolute;inset:0;z-index:0;pointer-events:none\"></ak-cosmo>\n  <div aria-hidden=\"true\" style=\"position:absolute;inset:0;z-index:0;pointer-events:none;background:radial-gradient(ellipse 55% 70% at 50% 50%,rgba(2,4,12,.55),transparent 100%)\"></div>\n\n  <!-- sinistra: il giorno, il cubo coll'icosaedro, l'invito -->\n  <div style=\"position:sticky;top:2rem;z-index:1;display:grid;grid-template-columns:minmax(0,1fr);justify-items:center;gap:1.2rem;width:100%;justify-self:center\">\n    <div style=\"display:flex;gap:.55rem;width:100%;max-width:24rem\">\n      <div style=\"flex:1;border:1px solid rgba(184,150,62,.22);border-radius:.75rem;background:rgba(8,11,26,.4);padding:.65rem .5rem;text-align:center\">\n        <b style=\"display:block;font-family:'Cinzel',serif;font-weight:400;font-size:1rem;line-height:1.2;color:#D4AF6A\">[ giorno ]</b>\n        <span style=\"display:block;font-size:.84rem;color:rgba(245,240,230,.45);margin-top:.25rem\">[ mese ]</span>\n      </div>\n      <div style=\"flex:1;border:1px solid rgba(184,150,62,.22);border-radius:.75rem;background:rgba(8,11,26,.4);padding:.65rem .5rem;text-align:center\">\n        <b style=\"display:block;font-family:'Cinzel',serif;font-weight:400;font-size:1.4rem;line-height:1.2;color:#D4AF6A\">\ud83c\udf11</b>\n        <span style=\"display:block;font-size:.84rem;color:rgba(245,240,230,.45);margin-top:.25rem\">[ la luna ]</span>\n      </div>\n      <div style=\"flex:1;border:1px solid rgba(184,150,62,.22);border-radius:.75rem;background:rgba(8,11,26,.4);padding:.65rem .5rem;text-align:center\">\n        <b style=\"display:block;font-family:'Cinzel',serif;font-weight:400;font-size:1rem;line-height:1.2;color:#D4AF6A\">[ il santo ]</b>\n        <span style=\"display:block;font-size:.84rem;color:rgba(245,240,230,.45);margin-top:.25rem\">il santo</span>\n      </div>\n    </div>\n\n    <div style=\"position:relative;width:100%;max-width:min(24rem,58vh);aspect-ratio:1\">\n      <div style=\"position:absolute;inset:8%;pointer-events:none;background:radial-gradient(circle at 50% 50%,rgba(74,136,184,.18),transparent 70%)\"></div>\n      <svg sc-camel-view-box=\"-128 -128 256 256\" aria-hidden=\"true\" style=\"position:absolute;inset:0;width:100%;height:100%;overflow:visible\">\n        <g fill=\"none\" stroke=\"#D4AF6A\" stroke-linejoin=\"round\">\n          <g stroke-width=\".7\" opacity=\".34\">\n            <sc-for list=\"{{ linee }}\" as=\"l\" hint-placeholder-count=\"0\"><line x1=\"{{ l.x1 }}\" y1=\"{{ l.y1 }}\" x2=\"{{ l.x2 }}\" y2=\"{{ l.y2 }}\"></line></sc-for>\n          </g>\n          <g stroke-width=\"1\" opacity=\".3\" stroke=\"#C9A6E0\">\n            <sc-for list=\"{{ centri }}\" as=\"c\" hint-placeholder-count=\"0\"><circle cx=\"{{ c.x }}\" cy=\"{{ c.y }}\" r=\"23\"></circle></sc-for>\n          </g>\n          <circle r=\"115\" stroke-width=\"1\" opacity=\".5\"></circle>\n          <rect x=\"-115\" y=\"-115\" width=\"230\" height=\"230\" stroke-width=\".8\" stroke-dasharray=\"3 3.6\" opacity=\".34\"></rect>\n        </g>\n      </svg>\n      <ak-solido tipo=\"icosaedro\" colore=\"#4A88B8\" aria-hidden=\"true\"></ak-solido>\n    </div>\n    <div style=\"font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1.15rem;color:#7FB4DC;text-align:center;margin-top:-.4rem\">icosaedro \u00b7 acqua</div>\n\n    <div style=\"display:flex;justify-content:center;width:100%;max-width:24rem\">\n      <a href=\"invito.html\" style=\"min-height:3.5rem;min-width:16rem;padding:.7rem 1rem;border-radius:.9rem;border:1px solid rgba(212,175,106,.45);background:rgba(8,11,26,.5);color:#F5F0E6;text-decoration:none;font-family:'Cinzel',serif;font-size:.95rem;letter-spacing:.1em;line-height:1.3;display:flex;align-items:center;justify-content:space-between;gap:.6rem;transition:border-color .3s,background .3s\" style-hover=\"border-color:#D4AF6A;background:rgba(212,175,106,.1)\">\n        <span>invita produttori</span>\n        <svg aria-hidden=\"true\" sc-camel-view-box=\"0 0 24 24\" fill=\"none\" stroke=\"#D4AF6A\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"flex:none;width:1.5rem;height:1.5rem\"><path d=\"M4 12h15\"></path><path d=\"M13 5l7 7-7 7\"></path></svg>\n      </a>\n    </div>\n  </div>\n\n  <!-- destra: l'Emporio -->\n  <div style=\"position:relative;z-index:1;display:flex;flex-direction:column;gap:1.3rem;max-width:34rem;width:100%;min-width:0;justify-self:start\">\n\n    <!-- \u2460 la pagina dell'Emporio: un elenco, non nove scaffali -->\n    <sc-if value=\"{{ elenco }}\" hint-placeholder-val=\"{{ true }}\">\n      <div style=\"display:flex;flex-wrap:wrap;align-items:baseline;gap:.4rem 1.4rem\">\n        <h1 style=\"margin:0;font-family:'Cinzel',serif;font-weight:400;font-size:clamp(2rem,3.6vw,2.9rem);line-height:1.1;letter-spacing:.06em;color:#F5F0E6\">L\u2019Emporio</h1>\n        <div style=\"font-family:'Cinzel',serif;font-size:.84rem;letter-spacing:.28em;text-transform:uppercase;color:#7FB4DC\">acqua</div>\n      </div>\n\n      <!-- gli scaffali restano come filtro: spenti finch\u00e9 vuoti -->\n      <div style=\"display:flex;flex-wrap:wrap;gap:.4rem\">\n        <button type=\"button\" sc-camel-on-click=\"{{ tuttiVai }}\" style=\"min-height:2.75rem;padding:0 .9rem;border-radius:999px;border:1px solid {{ tuttiBordo }};background:{{ tuttiFondo }};color:{{ tuttiColore }};cursor:pointer;font-family:'Cinzel',serif;font-size:.84rem;letter-spacing:.08em;display:inline-flex;align-items:center;gap:.5rem;transition:border-color .3s,background .3s\" style-hover=\"border-color:rgba(74,136,184,.9)\"><span>tutti</span><span style=\"font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1rem;letter-spacing:0;opacity:.7\">{{ tuttiQuanti }}</span></button>\n        <sc-for list=\"{{ scaffali }}\" as=\"s\" hint-placeholder-count=\"9\">\n          <button type=\"button\" sc-camel-on-click=\"{{ s.vai }}\" disabled=\"{{ s.spento }}\" style=\"min-height:2.75rem;padding:0 .9rem;border-radius:999px;border:1px solid {{ s.bordo }};background:{{ s.fondo }};color:{{ s.colore }};cursor:{{ s.cursore }};font-family:'Cinzel',serif;font-size:.84rem;letter-spacing:.08em;display:inline-flex;align-items:center;gap:.5rem;transition:border-color .3s,background .3s\" style-hover=\"border-color:rgba(74,136,184,.9)\"><span>{{ s.nome }}</span><span style=\"font-family:'DM Sans',system-ui,sans-serif;font-size:.84rem;letter-spacing:0;opacity:.55\">{{ s.pc }}</span><span style=\"font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1rem;letter-spacing:0;opacity:.7\">{{ s.quanti }}</span></button>\n        </sc-for>\n      </div>\n\n      <div style=\"display:flex;flex-direction:column;gap:1.2rem\">\n        <!-- i gruppi: praticantato \u2192 pi\u00f9 vicino \u2192 pi\u00f9 lontano; tre per gruppo -->\n        <sc-for list=\"{{ gruppi }}\" as=\"g\" hint-placeholder-count=\"3\">\n          <div style=\"display:flex;flex-direction:column;gap:.5rem\">\n            <div style=\"display:flex;align-items:center;gap:.7rem;margin-top:.2rem\">\n              <span style=\"font-family:'Cinzel',serif;font-size:.84rem;letter-spacing:.2em;text-transform:uppercase;color:{{ g.colore }};white-space:nowrap\">{{ g.nome }}</span>\n              <span style=\"flex:1;height:1px;background:{{ g.riga }}\"></span>\n              <span style=\"font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1rem;color:rgba(245,240,230,.4)\">{{ g.quanti }}</span>\n            </div>\n            <sc-for list=\"{{ g.righe }}\" as=\"r\" hint-placeholder-count=\"3\">\n              <button type=\"button\" class=\"ak-riga\" sc-camel-on-click=\"{{ r.apri }}\" style=\"display:grid;grid-template-columns:4.2rem minmax(0,1fr) minmax(0,auto);gap:.9rem;align-items:center;padding:.6rem .8rem .6rem .6rem;border-radius:.9rem;border:1px solid {{ r.bordo }};border-left:3px solid {{ r.bordoForte }};background:{{ r.fondo }};color:inherit;cursor:pointer;text-align:left;font:inherit\" style-hover=\"background:rgba(245,240,230,.05)\">\n                <span role=\"img\" aria-label=\"{{ r.titolo }}\" style=\"width:4.2rem;height:4.2rem;border-radius:.6rem;overflow:hidden;background-image:{{ r.fotoCss }};background-size:cover;background-position:center;background-color:rgba(8,11,26,.6);border:1px solid rgba(245,240,230,.1);display:grid;place-items:center;font-family:'Cormorant Garamond',serif;font-style:italic;font-size:.84rem;color:rgba(245,240,230,.4)\"><sc-if value=\"{{ r.senzaFoto }}\" hint-placeholder-val=\"{{ true }}\">[ foto ]</sc-if></span>\n                <span style=\"min-width:0;display:flex;flex-direction:column;gap:.2rem\">\n                  <span style=\"display:flex;align-items:center;gap:.5rem;flex-wrap:wrap\">\n                    <span style=\"font-family:'Cormorant Garamond',serif;font-size:1.35rem;line-height:1.25;color:#F5F0E6\">{{ r.titolo }}</span>\n                    <sc-if value=\"{{ r.pratica }}\" hint-placeholder-val=\"{{ false }}\"><span style=\"display:inline-flex;align-items:center;gap:.3rem;padding:.05rem .55rem;border-radius:1rem;border:1px solid rgba(212,175,106,.55);font-family:'Cinzel',serif;font-size:.84rem;letter-spacing:.08em;color:#D4AF6A\"><span style=\"width:.4rem;height:.4rem;border-radius:50%;background:#D4AF6A\"></span>Anta\u1e25kara\u1e47a</span></sc-if>\n                  </span>\n                  <span style=\"font-size:.95rem;color:rgba(245,240,230,.7)\">{{ r.chi }}</span>\n                  <span style=\"font-size:.9rem;color:{{ r.luogoColore }}\">{{ r.dove }}</span>\n                </span>\n                <span style=\"display:flex;flex-direction:column;align-items:flex-end;gap:.3rem;max-width:7rem;text-align:right\">\n                  <span style=\"font-family:{{ r.prezzoFont }};font-style:{{ r.prezzoStile }};font-size:1.05rem;line-height:1.2;color:{{ r.prezzoColore }}\">{{ r.prezzo }}</span>\n                  </span></button><button type=\"button\" sc-camel-on-click=\"{{ r.gestoVai }}\" style=\"border:0;background:transparent;padding:0;cursor:pointer;font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1rem;line-height:1.2;color:{{ r.gestoColore }}\" style-hover=\"text-decoration:underline\">{{ r.gesto }}</button>\n                \n              \n            </sc-for>\n            <sc-if value=\"{{ g.altri }}\" hint-placeholder-val=\"{{ false }}\">\n              <button type=\"button\" style=\"align-self:flex-start;min-height:2.75rem;padding:0 1rem;border-radius:999px;border:1px dashed rgba(212,175,106,.4);background:transparent;color:rgba(212,175,106,.9);cursor:pointer;font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1.1rem\" style-hover=\"border-color:#D4AF6A;background:rgba(212,175,106,.06)\">{{ g.altriTesto }}</button>\n            </sc-if>\n          </div>\n        </sc-for>\n      </div>\n    </sc-if>\n\n    <!-- il carrello -->\n    <sc-if value=\"{{ carrello }}\" hint-placeholder-val=\"{{ false }}\">\n      <div style=\"display:flex;align-items:center;justify-content:space-between;gap:1rem\">\n        <button type=\"button\" sc-camel-on-click=\"{{ carrelloChiudi }}\" style=\"min-height:2.75rem;padding:0 .9rem 0 .5rem;border-radius:999px;border:1px solid rgba(212,175,106,.35);background:transparent;color:#D4AF6A;cursor:pointer;font-family:'Cinzel',serif;font-size:.84rem;letter-spacing:.1em;display:inline-flex;align-items:center;gap:.4rem\" style-hover=\"border-color:#D4AF6A;background:rgba(212,175,106,.08)\"><svg aria-hidden=\"true\" sc-camel-view-box=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"width:1.2rem;height:1.2rem\"><path d=\"M20 12H5\"></path><path d=\"M11 5l-7 7 7 7\"></path></svg>l\u2019Emporio</button>\n      </div>\n      <h1 style=\"margin:0;font-family:'Cinzel',serif;font-weight:400;font-size:clamp(1.6rem,2.8vw,2.2rem);line-height:1.1;letter-spacing:.06em;color:#F5F0E6\">Il carrello</h1>\n      <div style=\"display:flex;flex-direction:column;gap:.9rem\">\n        <div style=\"display:grid;grid-template-columns:4.2rem minmax(0,1fr) auto;gap:.9rem;align-items:center;padding:.6rem .8rem .6rem .6rem;border-radius:.9rem;border:1px solid rgba(74,136,184,.3);background:rgba(74,136,184,.07)\">\n          <span role=\"img\" aria-label=\"{{ c.titolo }}\" style=\"width:4.2rem;height:4.2rem;border-radius:.6rem;background-image:{{ c.fotoCss }};background-size:cover;background-position:center;background-color:rgba(8,11,26,.6);border:1px solid rgba(245,240,230,.1);display:block\"></span>\n          <span style=\"min-width:0;display:flex;flex-direction:column;gap:.2rem\">\n            <span style=\"font-family:'Cormorant Garamond',serif;font-size:1.35rem;line-height:1.25;color:#F5F0E6\">{{ c.titolo }}</span>\n            <span style=\"font-size:.95rem;color:rgba(245,240,230,.7)\">{{ c.chi }}</span>\n            <span style=\"display:inline-flex;align-items:center;gap:.5rem;font-size:.9rem;color:rgba(245,240,230,.55)\">quantit\u00e0 <span style=\"display:inline-grid;place-items:center;min-width:1.75rem;height:1.75rem;border-radius:.5rem;border:1px solid rgba(245,240,230,.2)\">1</span></span>\n          </span>\n          <span style=\"font-family:'Cinzel',serif;font-size:1.05rem;color:#F5F0E6\">{{ c.prezzo }}</span>\n        </div>\n        <div style=\"display:flex;flex-direction:column;gap:.45rem;padding:.9rem 1rem;border-radius:.9rem;border:1px solid rgba(212,175,106,.25);background:rgba(8,11,26,.5);font-size:.95rem;color:rgba(245,240,230,.7)\">\n          <div style=\"display:flex;justify-content:space-between;gap:1rem\"><span>prodotto</span><span>{{ c.prezzo }}</span></div>\n          <div style=\"display:flex;justify-content:space-between;gap:1rem\"><span>trasporto</span><span>[ costo, e come arriva ]</span></div>\n          <div style=\"display:flex;justify-content:space-between;gap:1rem;font-family:'Cormorant Garamond',serif;font-style:italic;color:rgba(245,240,230,.5)\"><span>a FelicitasMundi resta</span><span>{{ c.quota }}</span></div>\n          <div style=\"display:flex;justify-content:space-between;gap:1rem;padding-top:.5rem;margin-top:.2rem;border-top:1px solid rgba(212,175,106,.22);font-family:'Cinzel',serif;font-size:1.15rem;color:#F5F0E6\"><span>totale</span><span>[ totale ]</span></div>\n        </div>\n        <div style=\"display:flex;flex-direction:column;gap:.5rem\">\n          <span style=\"font-family:'Cinzel',serif;font-size:.84rem;letter-spacing:.2em;text-transform:uppercase;color:rgba(212,175,106,.75)\">dove arriva</span>\n          <input type=\"text\" placeholder=\"[ nome e indirizzo ]\" style=\"width:100%;box-sizing:border-box;min-height:2.75rem;padding:.6rem .9rem;border-radius:.7rem;border:1px solid rgba(212,175,106,.35);background:rgba(8,11,26,.6);color:#F5F0E6;font-family:'DM Sans',system-ui,sans-serif;font-size:1rem;outline:none\" style-focus=\"border-color:#D4AF6A\">\n        </div>\n        <button type=\"button\" style=\"min-height:3.25rem;padding:0 1.3rem;border-radius:.9rem;border:1px solid rgba(74,136,184,.9);background:rgba(74,136,184,.3);color:#F5F0E6;cursor:pointer;font-family:'Cinzel',serif;font-size:.95rem;letter-spacing:.12em;text-transform:uppercase\" style-hover=\"filter:brightness(1.2)\">[ paga ]</button>\n        <div style=\"font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1.05rem;line-height:1.4;color:rgba(245,240,230,.5);text-wrap:pretty\">Il pagamento passa dal gestore: nessun dato di carta resta qui.</div>\n      </div>\n    </sc-if>\n\n    <!-- \u2461 la scheda del prodotto -->\n    <sc-if value=\"{{ scheda }}\" hint-placeholder-val=\"{{ false }}\">\n      <div style=\"display:flex;align-items:center;justify-content:space-between;gap:1rem\">\n        <button type=\"button\" sc-camel-on-click=\"{{ chiudi }}\" style=\"min-height:2.75rem;padding:0 .9rem 0 .5rem;border-radius:999px;border:1px solid rgba(212,175,106,.35);background:transparent;color:#D4AF6A;cursor:pointer;font-family:'Cinzel',serif;font-size:.84rem;letter-spacing:.1em;display:inline-flex;align-items:center;gap:.4rem\" style-hover=\"border-color:#D4AF6A;background:rgba(212,175,106,.08)\"><svg aria-hidden=\"true\" sc-camel-view-box=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"width:1.2rem;height:1.2rem\"><path d=\"M20 12H5\"></path><path d=\"M11 5l-7 7 7 7\"></path></svg>l\u2019Emporio</button>\n        <!-- \u2462 chi guarda / chi lo fa: solo per la prova -->\n        <button type=\"button\" sc-camel-on-click=\"{{ scambiaRuolo }}\" style=\"min-height:2.75rem;padding:0 .9rem;border-radius:999px;border:1px dashed rgba(245,240,230,.2);background:transparent;color:rgba(245,240,230,.55);cursor:pointer;font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1rem\" style-hover=\"color:#F5F0E6\">{{ ruoloTesto }}</button>\n      </div>\n\n      <div style=\"display:flex;flex-direction:column;gap:1.1rem\">\n        <!-- in cima: quello che c'\u00e8 gi\u00e0 dalla vetrina -->\n        <div style=\"display:grid;grid-template-columns:minmax(0,9rem) minmax(0,1fr);gap:1rem;align-items:start\">\n          <span role=\"img\" aria-label=\"{{ p.titolo }}\" style=\"aspect-ratio:{{ p.ratio }};border-radius:.8rem;overflow:hidden;background-image:{{ p.fotoCss }};background-size:cover;background-position:center;background-color:rgba(8,11,26,.6);border:1px solid rgba(245,240,230,.1);display:grid;place-items:center;font-family:'Cormorant Garamond',serif;font-style:italic;font-size:.95rem;color:rgba(245,240,230,.4)\"><sc-if value=\"{{ p.senzaFoto }}\" hint-placeholder-val=\"{{ true }}\">[ la foto ]</sc-if></span>\n          <div style=\"display:flex;flex-direction:column;gap:.45rem;min-width:0\">\n            <sc-if value=\"{{ p.pratica }}\" hint-placeholder-val=\"{{ false }}\"><span style=\"align-self:flex-start;display:inline-flex;align-items:center;gap:.3rem;padding:.05rem .55rem;border-radius:1rem;border:1px solid rgba(212,175,106,.55);font-family:'Cinzel',serif;font-size:.84rem;letter-spacing:.08em;color:#D4AF6A\"><span style=\"width:.4rem;height:.4rem;border-radius:50%;background:#D4AF6A\"></span>Anta\u1e25kara\u1e47a</span></sc-if>\n            <h1 style=\"margin:0;font-family:'Cinzel',serif;font-weight:400;font-size:clamp(1.5rem,2.6vw,2rem);line-height:1.15;letter-spacing:.04em;color:#F5F0E6\">{{ p.titolo }}</h1>\n            <span style=\"font-size:.95rem;color:rgba(245,240,230,.7)\">{{ p.chi }} \u00b7 <span style=\"color:{{ p.luogoColore }}\">{{ p.dove }}</span></span>\n            <span style=\"font-family:'Cinzel',serif;font-size:.84rem;letter-spacing:.2em;text-transform:uppercase;color:rgba(127,180,220,.9)\">{{ p.categoria }}</span>\n          </div>\n        </div>\n        <!-- le parole del cuore stanno sopra il prezzo -->\n        <div style=\"font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1.3rem;line-height:1.45;color:rgba(245,240,230,.85);text-wrap:pretty;padding:.9rem 1.1rem;border-left:2px solid rgba(74,136,184,.6);background:rgba(74,136,184,.06);border-radius:0 .8rem .8rem 0\">{{ p.cuore }}</div>\n        <sc-if value=\"{{ p.haGalleria }}\" hint-placeholder-val=\"{{ false }}\">\n          <div style=\"display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.5rem\">\n            <sc-for list=\"{{ p.galleria }}\" as=\"g\" hint-placeholder-count=\"3\">\n              <span role=\"img\" aria-label=\"{{ p.titolo }}\" style=\"aspect-ratio:1;border-radius:.7rem;background-image:{{ g.css }};background-size:cover;background-position:center;background-color:rgba(8,11,26,.6);border:1px solid rgba(245,240,230,.1);display:grid;place-items:center;font-family:'Cormorant Garamond',serif;font-style:italic;font-size:.9rem;color:rgba(245,240,230,.35)\"><sc-if value=\"{{ g.vuota }}\" hint-placeholder-val=\"{{ false }}\">[ un\u2019altra foto ]</sc-if></span>\n            </sc-for>\n          </div>\n        </sc-if>\n\n        <!-- le linguette: si aprono solo se piene; vuote, a chi lo fa mostrano il gesto, a chi guarda non compaiono -->\n        <div style=\"display:flex;flex-direction:column;gap:.5rem;margin-top:.3rem\">\n          <sc-for list=\"{{ linguette }}\" as=\"l\" hint-placeholder-count=\"5\">\n            <div style=\"display:flex;flex-direction:column;border-radius:.9rem;border:1px solid {{ l.bordo }};background:{{ l.fondo }};overflow:hidden\">\n              <sc-if value=\"{{ l.piena }}\" hint-placeholder-val=\"{{ true }}\">\n                <button type=\"button\" sc-camel-on-click=\"{{ l.apri }}\" style=\"display:flex;align-items:center;justify-content:space-between;gap:1rem;min-height:3.25rem;padding:.6rem 1rem;border:0;background:transparent;color:#F5F0E6;cursor:pointer;text-align:left;font:inherit\" style-hover=\"background:rgba(245,240,230,.04)\">\n                  <span style=\"font-family:'Cinzel',serif;font-size:1rem;letter-spacing:.06em\">{{ l.nome }}</span>\n                  <svg aria-hidden=\"true\" sc-camel-view-box=\"0 0 24 24\" fill=\"none\" stroke=\"#D4AF6A\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"flex:none;width:1.2rem;height:1.2rem;transform:{{ l.freccia }};transition:transform .3s\"><path d=\"M6 9l6 6 6-6\"></path></svg>\n                </button>\n                <sc-if value=\"{{ l.aperta }}\" hint-placeholder-val=\"{{ false }}\">\n                  <div style=\"padding:0 1rem 1rem;display:flex;flex-direction:column;gap:.6rem;animation:ak-alza .3s ease both\">\n                    <sc-for list=\"{{ l.blocchi }}\" as=\"b\" hint-placeholder-count=\"2\">\n                      <div style=\"display:flex;flex-direction:column;gap:.25rem\">\n                        <span style=\"font-family:'Cinzel',serif;font-size:.84rem;letter-spacing:.2em;text-transform:uppercase;color:rgba(212,175,106,.7)\">{{ b.et }}</span>\n                        <span style=\"font-family:'Cormorant Garamond',serif;font-size:1.2rem;line-height:1.4;color:rgba(245,240,230,.8)\">{{ b.testo }}</span>\n                      </div>\n                    </sc-for>\n                  </div>\n                </sc-if>\n              </sc-if>\n              <sc-if value=\"{{ l.gestoVisibile }}\" hint-placeholder-val=\"{{ false }}\">\n                <button type=\"button\" style=\"display:flex;align-items:center;gap:.8rem;min-height:3.25rem;padding:.6rem 1rem;border:0;background:transparent;color:rgba(212,175,106,.9);cursor:pointer;text-align:left;font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1.15rem\" style-hover=\"background:rgba(212,175,106,.06)\">\n                  <span style=\"flex:none;width:1.7rem;height:1.7rem;border-radius:50%;border:1px solid rgba(212,175,106,.6);display:grid;place-items:center;font-style:normal;font-family:'DM Sans',system-ui,sans-serif;font-size:1rem;color:#D4AF6A\">+</span>\n                  <span>{{ l.gesto }}</span>\n                </button>\n              </sc-if>\n            </div>\n          </sc-for>\n        </div>\n        <!-- richiedi al responsabile: la riga in corsivo e a fianco il tasto -->\n        <div style=\"display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap;padding:.8rem 1rem;border-radius:.9rem;border:1px solid rgba(74,136,184,.3);background:rgba(8,11,26,.5)\">\n          <div style=\"display:flex;flex-direction:column;gap:.15rem\">\n            <span style=\"font-family:{{ p.prezzoFont }};font-style:{{ p.prezzoStile }};font-size:1.4rem;color:{{ p.prezzoColore }}\">{{ p.prezzo }}</span>\n            <span style=\"font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1rem;color:rgba(245,240,230,.5)\">{{ p.sottoPrezzo }}</span>\n          </div>\n          <button type=\"button\" sc-camel-on-click=\"{{ p.gestoVai }}\" style=\"min-height:2.75rem;padding:0 1.3rem;border-radius:999px;border:1px solid {{ p.gestoBordo }};background:{{ p.gestoFondo }};color:#F5F0E6;cursor:pointer;font-family:'Cinzel',serif;font-size:.9rem;letter-spacing:.12em;text-transform:uppercase;white-space:nowrap\" style-hover=\"filter:brightness(1.2)\">{{ p.gesto }}</button>\n        </div>\n        <!-- il finale di colonna: condividi -->\n        <div style=\"display:flex;align-items:center;gap:.8rem;padding-top:1rem;margin-top:.4rem;border-top:1px solid rgba(212,175,106,.22);font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1.1rem;color:rgba(245,240,230,.55)\">\n          <span style=\"font-family:'Cinzel',serif;font-style:normal;font-size:.84rem;letter-spacing:.2em;text-transform:uppercase;color:rgba(212,175,106,.75)\">condividi</span>\n          <span>su <a href=\"#\" style=\"color:#D4AF6A\">mail</a> o <a href=\"#\" style=\"color:#D4AF6A\">messaggio</a></span>\n        </div>\n      </div>\n    </sc-if>\n  </div>\n</div>\n</x-dc>\n";

/* ── il motore che legge il linguaggio di Design ─────────────────
   ⭐ sc-for list="{{ x }}" as="v"  ·  sc-if value="{{ x }}"
   ⭐ {{ espressione }} dentro testi e attributi
   ⭐ sc-camel-view-box → viewBox · sc-camel-on-click → il gesto
   ⛔ Niente eval su dati esterni: si legge solo dall'oggetto che
      renderVals ha appena costruito. */

function empVal(esp, d){
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
function empTesto(t, d){
  return String(t).replace(/\{\{([^}]*)\}\}/g, function(_, e){
    var v = empVal(e, d);
    return (v === undefined || v === null) ? "" : String(v);
  });
}

function empNodo(n, d, doc){
  /* il testo */
  if(n.nodeType === 3){
    var t = empTesto(n.nodeValue, d);
    return t.trim() === "" && n.nodeValue.indexOf("{{") > -1
      ? null : doc.createTextNode(t);
  }
  if(n.nodeType !== 1) return null;
  var tag = n.tagName.toLowerCase();

  /* ⭐ sc-for: ripete il contenuto per ogni voce */
  if(tag === "sc-for"){
    var lista = empVal((n.getAttribute("list") || "")
      .replace(/[{}]/g, ""), d) || [];
    var nome = n.getAttribute("as") || "v";
    var f = doc.createDocumentFragment();
    lista.forEach(function(voce){
      var d2 = Object.create(d);
      d2[nome] = voce;
      for(var i = 0; i < n.childNodes.length; i++){
        var c = empNodo(n.childNodes[i], d2, doc);
        if(c) f.appendChild(c);
      }
    });
    return f;
  }

  /* ⭐ sc-if: mostra solo se vero */
  if(tag === "sc-if"){
    var v = empVal((n.getAttribute("value") || "").replace(/[{}]/g, ""), d);
    if(!v) return null;
    var f2 = doc.createDocumentFragment();
    for(var j = 0; j < n.childNodes.length; j++){
      var c2 = empNodo(n.childNodes[j], d, doc);
      if(c2) f2.appendChild(c2);
    }
    return f2;
  }

  /* un nodo vero */
  var el = (n.namespaceURI === "http://www.w3.org/2000/svg" ||
            ["svg","g","line","circle","path","rect","text","polygon",
             "polyline","ellipse","defs","use","clipPath"].indexOf(tag) > -1)
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
        var f3 = empVal(val.replace(/[{}]/g, ""), d);
        if(typeof f3 === "function") el.onclick = f3;
        continue;
      }
      el.setAttribute(vero, empTesto(val, d));
      continue;
    }
    el.setAttribute(nome2, empTesto(val, d));
  }
  for(var m = 0; m < n.childNodes.length; m++){
    var c4 = empNodo(n.childNodes[m], d, doc);
    if(c4) el.appendChild(c4);
  }
  return el;
}

/* ── la logica di Design, verbatim ──────────────────────────────── */
function EmpLogica(){
  this.state = { scaffale: null, aperto: null, ruolo: "guarda", chiuse: {} };
  this.setState = function(x){
    var n = typeof x === "function" ? x(this.state) : x;
    for(var k in n) this.state[k] = n[k];
    if(this.suDisegna) this.suDisegna();
  };
}
EmpLogica.prototype.renderVals = function() {
    const d = 46, N = v => Math.round(v * 100) / 100;
    const C = [[0, 0]];
    for (let k = 0; k < 6; k++) { const a = (-90 + k * 60) * Math.PI / 180; C.push([N(d * Math.cos(a)), N(d * Math.sin(a))]); }
    for (let k = 0; k < 6; k++) { const a = (-90 + k * 60) * Math.PI / 180; C.push([N(2 * d * Math.cos(a)), N(2 * d * Math.sin(a))]); }
    const linee = [];
    for (let i = 0; i < C.length; i++) for (let j = i + 1; j < C.length; j++) linee.push({ x1: C[i][0], y1: C[i][1], x2: C[j][0], y2: C[j][1] });

    const A = '#4A88B8', rgba = (hex, a) => { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };
    const { scaffale, aperto, ruolo } = this.state;

    // le nove categorie: gli scaffali, come filtro
    const CAT = [['alimenti', '5%'], ['rimedi', '8%'], ['cosmesi', '10%'], ['oggettistica', '10%'], ['abbigliamento', '10%'], ['arredo', '10%'], ['oggetti sacri', '10%'], ['libri e stampati', '15%'], ['digitale', '20%']];
    // i prodotti: g = 0 praticantato · 1 più vicino · 2 più lontano
    const PROD = [
      { g: 0, cat: 'libri e stampati', titolo: 'La Bhagavad-gītā Così com’è', chi: 'A.C. Bhaktivedānta Swāmī Prabhupāda', foto: 'bhagavad-gita.jpg', dove: 'Villaggio Hare Krishna - Bergamo', pratica: true, piene: ['nasce'], prezzo: 'richiedi al responsabile',
        cuore: '“Se un merito personale mi dev’essere riconosciuto, è quello di aver presentato la Bhagavad-gītā così com’è, senza alterarla in alcun modo.” — A. C. Bhaktivedānta Swāmī Prabhupāda',
        testi: {
          nasce: [
            ['il libro', 'La Bhagavad-gītā (“il canto del Signore”) è universalmente riconosciuta come il gioiello di saggezza spirituale e filosofica dell’India. In questo dialogo di settecento versi, tra Krishna e Arjuna, il Signore Supremo fornisce una guida chiara e sintetica a chiunque desideri intraprendere il cammino della realizzazione spirituale. Per la natura degli argomenti trattati (l’essenza dell’essere umano, la struttura del mondo in cui vive e l’eterna relazione con Dio) non esiste al mondo altra opera che le si possa anche lontanamente paragonare.'],
            ['questa edizione', '“La Bhagavad-gītā così com’è” rappresenta la più fedele e la più completa versione fra quelle oggi esistenti. A differenza di tutte le altre infatti, l’edizione trascritta, tradotta e curata da Sua Divina Grazia A.C. Bhaktivedanta Swami Prabhupada trasmette il profondo messaggio di Krishna senza la minima distorsione o variazione. Illustrata con sedici tavole a colori, questa nuova edizione stimolerà e illuminerà il lettore con la sua antichissima e sempre attuale saggezza.'],
            ['i dettagli', 'The Bhaktivedanta Book Trust (BBT), 2019 · copertina flessibile · 691 pagine · 15×21 cm'],
            ['in copertina', 'Kṛṣṇa, la Persona Suprema, conduce il carro di Arjuna sul campo di battaglia di Kurukṣetra.']
          ],
          arrivato: [
            ['Mahātmā Gāndhī', '“Quando lo sconforto mi assale e nella solitudine nessun raggio di luce m’illumina, l’unica mia fonte di sollievo è la Bhagavad-gītā.”'],
            ['Arthur Schopenhauer', '“Si tratta dell’opera più istruttiva e sublime al mondo.”']
          ]
        } },
      { g: 0, cat: 'oggetti sacri', titolo: 'Nexus', chi: 'Strumenti di Coscienza', dove: 'San Lazzaro di Savena', pratica: true, prezzo: 'richiedi al responsabile', foto: 'nexus-mano.jpg',
        galleria: ['nexus-scatola.jpg', 'nexus-riccardo.jpg', 'nexus-gabriele.jpg'],
        cuore: 'Nexus, dal latino “connessione”, unisce simbolicamente il Cubo di Metatron e l’Antakarana: insieme migliorano l’effetto dei simboli come ponte tra dimensione materiale e spirituale. È pensato come strumento di riequilibrio e armonizzazione.',
        piene: ['nasce', 'arrivato'],
        testi: {
          nasce: [
            ['il processo', 'Nexus è uno Strumento di Coscienza che, come il Fiore di Mais, misurato con telecamere multispettrali ad alta efficienza quantistica, emana decine di migliaia di biofotoni con migliaia di informazioni coerenti, le quali aiutano gli oggetti, i liquidi, i gas e gli esseri viventi ad avere o aumentare a loro volta la loro luminosità e Coerenza. Questo migliora tutti i parametri vitali degli esseri viventi e alcune caratteristiche di oggetti, liquidi o gas. Nel processo informativo coerente, quando lo stato di Coscienza è Amore, Gioia, Illuminazione, permette di portare lo Spirito nella Materia e così, quando in equilibrio, a stare nel Cuore, oltre a redimere e migliorare le tecnologie che ne entrano in contatto.'],
            ['le misure · test muscolari', 'Armonia 100% · Coerenza 100% · Coscienza Hawkins 935/1000 · Coscienza Solare 875/1000 · Stabilità 98,6% · Energia (Bovis) 19M · Raggio campo 826 m · Tempo informazione (1 l) 8 s · Miglioramento medio comunicazione verbale +185% · Tempo medio di riequilibrio <10 s · Biofotoni previsti >196K (da confermare con strumento). Alcuni valori stanno ancora aumentando.']
          ],
          arrivato: [
            ['cosa rappresenta', 'Rappresenta l’unione attraverso l’Amore e l’integrazione tra mente, cuore e spirito. È indicato per chi desidera un simbolo di centratura profonda e connessione consapevole.'],
            ['in casa', 'Può essere collocato in uno spazio personale, come la camera o l’angolo meditazione.'],
            ['in gruppo', 'Aiuta nel dialogo mettendo in sintonia i partecipanti nella comunicazione e riducendo le eventuali divergenze.'],
            ['orecchino o collana', 'Diventa un segno distintivo di apertura e connessione interiore.']
          ]
        } },
      { g: 0, cat: 'libri e stampati', titolo: 'Anima vagabonda', chi: 'Parabhakti dāsa', dove: 'Villa Vrindavana - Firenze', pratica: true, foto: 'anima-vagabonda.jpg', sotto: 'Pellegrini senza memoria alla ricerca della strada verso casa · Libreria Editrice Psiche', piene: ['nasce', 'arrivato', 'chi', 'legato'], prezzo: 'richiedi al responsabile' },
      { g: 1, cat: 'alimenti', titolo: '[ il miele amaro ]', chi: '[ chi lo fa ]', dove: '[ il tuo vicinato ]', prezzo: '[ prezzo ]', piene: ['nasce', 'arrivato', 'chi', 'legato'] },
      { g: 1, cat: 'cosmesi', titolo: '[ un sapone ]', chi: '[ chi lo fa ]', dove: '[ il tuo vicinato ]', prezzo: '[ prezzo ]', piene: ['nasce'] },
      { g: 1, cat: 'alimenti', titolo: '[ un olio ]', chi: '[ chi lo fa ]', dove: '[ il tuo micelio ]', prezzo: '[ prezzo ]', piene: [] },
      { g: 1, cat: 'oggettistica', titolo: '[ una ceramica ]', chi: '[ chi lo fa ]', dove: '[ il tuo micelio ]', prezzo: '[ prezzo ]', piene: ['chi'] },
      { g: 2, cat: 'alimenti', titolo: '[ le arance di Palermo ]', chi: '[ chi lo fa ]', dove: '[ Palermo ]', prezzo: '[ prezzo ]', piene: ['nasce', 'chi'] },
      { g: 2, cat: 'libri e stampati', titolo: '[ un libro ]', chi: '[ chi lo fa ]', dove: '[ Bologna ]', prezzo: '[ prezzo ]', piene: ['nasce', 'arrivato', 'chi', 'legato'] }
    ];
    const conta = c => PROD.filter(p => p.cat === c).length;
    const scaffali = CAT.map(([c, pc]) => { const q = conta(c), on = scaffale === c, spento = q === 0; return {
      nome: c, pc, quanti: spento ? '' : q, spento, cursore: spento ? 'default' : 'pointer',
      vai: () => this.setState({ scaffale: on ? null : c }),
      bordo: on ? rgba(A, .95) : spento ? 'rgba(245,240,230,.08)' : 'rgba(212,175,106,.35)',
      fondo: on ? rgba(A, .22) : 'rgba(4,8,20,.5)',
      colore: on ? '#F5F0E6' : spento ? 'rgba(245,240,230,.28)' : 'rgba(245,240,230,.7)' }; });

    const GR = [['Antaḥkaraṇa', 1], ['più vicino', .8], ['più lontano', .45]];
    const riga = p => ({
      titolo: p.titolo, chi: p.chi, dove: p.dove, prezzo: p.prezzo, pratica: !!p.pratica, quota: ((CAT.find(c => c[0] === p.cat) || [])[1] || '') + ' del prezzo', senzaFoto: !p.foto, fotoCss: p.foto ? `url("${p.foto}")` : 'linear-gradient(135deg,rgba(74,136,184,.28),rgba(8,11,26,.6))',
      prezzoFont: p.pratica ? "'Cormorant Garamond',serif" : "'Cinzel',serif", prezzoStile: p.pratica ? 'italic' : 'normal', prezzoColore: p.pratica ? 'rgba(245,240,230,.75)' : '#F5F0E6',
      luogoColore: `rgba(245,240,230,${(.3 + .4 * GR[p.g][1]).toFixed(2)})`,
      gesto: p.pratica ? 'scrivi' : 'vendi', gestoColore: p.pratica ? '#D4AF6A' : '#7FB4DC',
      bordo: p.pratica ? 'rgba(212,175,106,.3)' : rgba(A, .22), bordoForte: p.pratica ? 'rgba(212,175,106,.7)' : rgba(A, .65), fondo: p.pratica ? 'rgba(212,175,106,.05)' : rgba(A, .07),
      apri: () => this.setState({ aperto: p, chiuse: {}, carrello: false }),
      gestoVai: e => { e.stopPropagation(); if (p.pratica) location.href = `mailto:felicitasmundi@protonmail.com?subject=${encodeURIComponent(p.titolo)}&body=${encodeURIComponent('Buongiorno, scrivo per «' + p.titolo + '» (' + p.dove + ').\
\
')}`; else this.setState({ carrello: true, aperto: null, nelCarrello: p }); }
    });
    const filtrati = scaffale ? PROD.filter(p => p.cat === scaffale) : PROD;
    const gruppi = GR.map(([n, a], i) => { const tutti = filtrati.filter(p => p.g === i); return {
      nome: n, colore: `rgba(212,175,106,${(.35 + .5 * a).toFixed(2)})`, riga: `rgba(212,175,106,${(.1 + .2 * a).toFixed(2)})`,
      quanti: tutti.length, righe: tutti.slice(0, 3).map(riga), altri: tutti.length > 3, altriTesto: `[ ${tutti.length - 3} altri ]` }; }).filter(g => g.righe.length);

    // ② la scheda
    const p = aperto, fa = ruolo === 'fa';
    const LING = [
      ['nasce', 'Come nasce', 'racconta come nasce', [['il processo', '[ come viene fatto ]'], ['i dettagli', '[ formato, peso, editore, ISBN… ]']]],
      ['arrivato', 'Come ci sono arrivato', 'racconta come ci sei arrivato', [['l’incontro', '[ la storia ]'], ['dice chi lo fa', '[ una citazione ]']]],
      ['chi', 'Chi lo fa', 'racconta chi lo fa', [['la storia', '[ chi produce, e da quanto ]']]],
      ['legato', 'Collegato a', 'collega una ricerca o un libro', [['ricerche', '[ una ricerca collegata ]'], ['libri', '[ un libro collegato ]']]]
    ];
    const linguette = p ? LING.map(([k, nome, gesto, blocchi]) => { const piena = p.piene.includes(k), ap = !this.state.chiuse[k]; return {
      nome, piena, aperta: ap, blocchi: ((p.testi && p.testi[k]) || blocchi).map(([et, testo]) => ({ et, testo })),
      gestoVisibile: !piena && fa && !!gesto, gesto,
      apri: () => this.setState(s => ({ chiuse: { ...s.chiuse, [k]: !s.chiuse[k] } })),
      freccia: ap ? 'rotate(180deg)' : 'none',
      bordo: piena ? rgba(A, ap ? .6 : .28) : 'rgba(212,175,106,.3)', fondo: piena ? 'rgba(8,11,26,.45)' : 'transparent' }; }).filter(l => l.piena || l.gestoVisibile) : [];

    return {
      linee, centri: C.map(q => ({ x: q[0], y: q[1] })),
      elenco: !p && !this.state.carrello, scheda: !!p, carrello: this.state.carrello, scaffali, gruppi,
      c: this.state.nelCarrello ? riga(this.state.nelCarrello) : {},
      carrelloChiudi: () => this.setState({ carrello: false, scaffale: null }),
      tuttiVai: () => this.setState({ scaffale: null, aperto: null, carrello: false }), tuttiQuanti: PROD.length,
      tuttiBordo: !scaffale ? rgba(A, .95) : 'rgba(212,175,106,.35)', tuttiFondo: !scaffale ? rgba(A, .22) : 'rgba(4,8,20,.5)', tuttiColore: !scaffale ? '#F5F0E6' : 'rgba(245,240,230,.7)',
      p: p ? { ...riga(p), categoria: p.cat + ' · ' + ((CAT.find(c => c[0] === p.cat) || [])[1] || ''), haGalleria: !!p.foto, galleria: [p.foto, ...(p.galleria || [])].filter(Boolean).map(g => ({ css: `url("${g}")` })).concat(Array.from({ length: Math.max(0, 3 - 1 - (p.galleria || []).length) }, () => ({ css: 'none', vuota: true }))), ratio: p.foto ? (p.cat === 'libri e stampati' ? '5 / 7' : '1') : '1', cuore: p.cuore || '[ le parole del cuore — perché questo, e cosa c’è dietro ]', sottoPrezzo: p.pratica ? '' : '[ trasporto, e come arriva ]',
        gestoBordo: p.pratica ? 'rgba(212,175,106,.8)' : rgba(A, .9), gestoFondo: p.pratica ? 'rgba(212,175,106,.18)' : rgba(A, .3) } : {},
      linguette, chiudi: () => this.setState({ aperto: null, scaffale: null }),
      ruoloTesto: fa ? 'lo vedi come chi lo fa' : 'lo vedi come chi guarda',
      scambiaRuolo: () => this.setState({ ruolo: fa ? 'guarda' : 'fa' })
    };
};

/* ── i prodotti, dal database ────────────────────────────────────
   ⚠️ I tre di Antahkarana hanno `pratica: true`: il gesto diventa
      «scrivi», il prezzo «richiedi al responsabile», e il colore
      passa dall'azzurro dell'acqua all'oro. */
async function empLeggi(){
  var fuori = [];
  try{
    var r = await db.from("prodotti")
      .select("id,nome,sottotitolo,scaffale,autore,persona_id,foto," +
              "prezzo,praticantato,si_compra,creato_il,descrizione_cuore")
      .eq("stato", "pubblico").order("creato_il");
    if(r.error) throw r.error;
    (r.data || []).forEach(function(p){
      fuori.push({
        g: p.praticantato ? 0 : 1,
        cat: p.scaffale || "",
        titolo: p.nome || "",
        chi: p.autore || "",
        dove: "",
        foto: p.foto || "",
        pratica: !!p.praticantato,
        /* \u2b50 si comprano, ma l\u2019accordo si fa col responsabile */
        prezzo: p.si_compra === false
          ? "richiedi al responsabile"
          : (p.prezzo ? p.prezzo + " \u20ac" : ""),
        cuore: p.descrizione_cuore || "",
        piene: []
      });
    });
  }catch(e){ console.warn("emporio:", e); }
  return fuori;
}

var empBox = null, empLog = null;

function empDisegna(){
  if(!empBox || !empLog) return;
  var d = empLog.renderVals();
  var doc = document;
  var tmp = doc.createElement("div");
  tmp.innerHTML = EMP_CORPO;
  empBox.innerHTML = "";
  for(var i = 0; i < tmp.childNodes.length; i++){
    var n = empNodo(tmp.childNodes[i], d, doc);
    if(n) empBox.appendChild(n);
  }
}

async function emporio(dove){
  var box = typeof dove === "string" ? document.querySelector(dove) : dove;
  if(!box) return;
  empBox = box;
  empLog = new EmpLogica();
  empLog.suDisegna = empDisegna;
  empDisegna();
  /* ⭐ e poi i prodotti veri, che si aggiungono a quelli fissi */
  var veri = await empLeggi();
  if(veri.length){
    empLog.daiDatabase = veri;
    empDisegna();
  }
}

window.SpazioVivo = window.SpazioVivo || {};
window.SpazioVivo.emporio = emporio;
