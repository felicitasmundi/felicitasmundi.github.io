/* ═══════════════════════════════════════════════════════════════
   DENTRO L'ORMA — la pagina di una sola orma.

   ⛔ LA FORMA È DI DESIGN, presa riga per riga da
      `dentro-orma-esempio.html`: la veste sotto è la sua, verbatim,
      solo chiusa dentro .fm-do perché non tocchi il resto.
      Nessun bagliore ridisegnato a mano, nessuna distanza rifatta.

   ⭐ TUTTO QUELLO CHE DIVENTA UN'ORMA HA QUESTA FORMA. Un prodotto,
      una festa, un karma yoga, una lezione: sono tutte orme, e si
      aprono tutte da qui. Chi mostra un'orma non la ridisegna:
      chiama questo file.

   ⭐ COSA LEGGE DAL DATABASE, tutto verificato il 14 settembre:
      · l'orma — titolo, luogo, accaduto_il, entro_il, stadio
      · chi c'è dentro — orma_persone, coi lasciati esclusi
      · le figlie — orma_madre_id, con chi l'ha presa e le ore
      · gli allegati — fm_file_orma, coi permessi che scadono
      · la conversazione — orma_messaggi

   ⭐ I GESTI, che il database sa fare:
      fm_prendi_orma · fm_lascia_orma · fm_chiudi_orma

   ⚠️ Le ore si scrivono a mano quando si chiude: niente cronometro.

   Espone: SpazioVivo.ormaDentro(dove, id)
   ═══════════════════════════════════════════════════════════════ */

"use strict";

var DO_CSS = ":root{\n  --fondo:#0A0C1A; --ivory:#F5F0E6; --oro:#C8A055; --oro-ch:#D4AF6A;\n  --terra:#AA8844; --acqua:#4488BB; --fuoco:#CC6644;\n  --aria:#669944; --etere:#9966CC; --nexus:#8C2F39;\n  --riga:rgba(245,240,230,0.10);\n}\n.fm-do * {box-sizing:border-box;margin:0;padding:0}\n.fm-do .f {max-width:46rem;margin:0 auto}\n/* \u2550\u2550\u2550 la testa dell'orma \u2550\u2550\u2550 */\n.capo{display:flex;align-items:flex-start;gap:1rem;margin-bottom:1.1rem}\n.fm-do .segno {flex:none;width:3.2rem;color:var(--terra);filter:brightness(1.15)}\n.fm-do .segno svg {width:100%;aspect-ratio:1;display:block}\n.fm-do .capo .tx {flex:1;min-width:0}\n.fm-do .occ {font-size:11.5px;letter-spacing:.24em;text-transform:uppercase;\n  color:var(--oro-ch);margin-bottom:.4rem}\n.fm-do h1 {font-family:'Cormorant Garamond',serif;font-weight:400;\n  font-size:clamp(1.5rem,5.2vw,2.3rem);line-height:1.2}\n/* i tre dati */\n.dati{display:flex;gap:.5rem 1.4rem;flex-wrap:wrap;\n  padding:.85rem 0;border-top:1px solid var(--riga);\n  border-bottom:1px solid var(--riga);margin-bottom:1.2rem}\n.fm-do .dati > span {display:block}\n.fm-do .dati .et {display:block;font-size:10.5px;letter-spacing:.2em;\n  text-transform:uppercase;color:rgba(245,240,230,.4);margin-bottom:.15rem}\n.fm-do .dati .vl {font-family:'Cormorant Garamond',serif;font-size:1.02rem;\n  color:rgba(245,240,230,.9)}\n.fm-do .dati .vl a {color:inherit;text-decoration:none;\n  border-bottom:1px solid rgba(212,175,106,.4)}\n/* lo stadio */\n.stadio{display:inline-flex;align-items:center;gap:.45rem;\n  padding:.24rem .8rem;border-radius:999px;font-size:12px;\n  letter-spacing:.08em;margin-bottom:1.2rem;\n  border:1px solid color-mix(in srgb,var(--c) 52%,transparent);\n  background:color-mix(in srgb,var(--c) 14%,transparent);\n  color:color-mix(in srgb,var(--c) 76%,#F5F0E6)}\n.fm-do .stadio i {width:.45rem;height:.45rem;border-radius:50%;background:var(--c);\n  font-style:normal;flex:none;filter:brightness(1.3)}\n.fm-do .testo {font-family:'Cormorant Garamond',serif;font-size:1.12rem;\n  line-height:1.62;color:rgba(245,240,230,.92);margin-bottom:1.8rem}\n.fm-do .testo em {color:rgba(245,240,230,.6)}\n/* \u2550\u2550\u2550 i titoli di sezione \u2550\u2550\u2550 */\n.sez{display:flex;align-items:baseline;gap:.7rem;flex-wrap:wrap;\n  margin:2rem 0 .9rem}\n.fm-do .sez b {font-family:'Cinzel',serif;font-weight:500;font-size:.94rem;\n  letter-spacing:.16em;text-transform:uppercase;color:var(--oro-ch)}\n.fm-do .sez span {font-family:'Cormorant Garamond',serif;font-style:italic;\n  font-size:.98rem;color:rgba(245,240,230,.42)}\n/* \u2550\u2550\u2550 le figlie \u2550\u2550\u2550 */\n.figlia{display:flex;align-items:flex-start;gap:.85rem;\n  padding:.95rem 1rem;border-radius:.9rem;margin-bottom:.45rem;\n  background:color-mix(in srgb,var(--c) 8%,rgba(2,4,12,.42));\n  border:1px solid color-mix(in srgb,var(--c) 26%,transparent);\n  border-left:3px solid color-mix(in srgb,var(--c) 62%,transparent);\n  cursor:pointer;transition:transform .2s ease,border-color .2s ease}\n.fm-do .figlia:hover {transform:translateX(3px);\n  border-color:color-mix(in srgb,var(--c) 56%,transparent)}\n.fm-do .figlia .filo {flex:none;width:1.1rem;height:1.1rem;margin-top:.2rem;\n  position:relative}\n.fm-do .figlia .filo::before {content:'';position:absolute;inset:0;\n  border-left:1px solid color-mix(in srgb,var(--c) 60%,transparent);\n  border-bottom:1px solid color-mix(in srgb,var(--c) 60%,transparent);\n  border-bottom-left-radius:.5rem;\n  left:.35rem;top:-1.1rem;right:0;bottom:.4rem}\n.fm-do .figlia .tx {flex:1;min-width:0}\n.fm-do .figlia .tx b {display:block;font-weight:400;\n  font-family:'Cormorant Garamond',serif;font-size:1.08rem;line-height:1.36}\n.fm-do .figlia .tx .sot {display:flex;gap:.45rem;flex-wrap:wrap;align-items:center;\n  margin-top:.35rem;font-size:12px;color:rgba(245,240,230,.46)}\n.fm-do .figlia .tx .sot .sep {color:rgba(245,240,230,.2)}\n.fm-do .figlia .tx .sot .sc {color:var(--fuoco);filter:brightness(1.25)}\n.fm-do .figlia .st {flex:none;font-size:10.5px;letter-spacing:.1em;\n  padding:.14rem .55rem;border-radius:999px;white-space:nowrap;\n  border:1px solid color-mix(in srgb,var(--c) 44%,transparent);\n  color:color-mix(in srgb,var(--c) 74%,#F5F0E6)}\n/* \u2550\u2550\u2550 la chat \u2550\u2550\u2550 */\n.chat{border:1px solid var(--riga);border-radius:.9rem;overflow:hidden;\n  background:rgba(2,4,12,.4)}\n.fm-do .msg {display:flex;gap:.7rem;padding:.7rem .9rem;position:relative;\n  border-bottom:1px solid rgba(245,240,230,.05)}\n.fm-do .msg:last-of-type {border-bottom:0}\n.fm-do .msg:hover {background:rgba(245,240,230,.03)}\n.fm-do .msg .chi {flex:none;width:1.6rem;height:1.6rem;border-radius:50%;\n  display:grid;place-items:center;font-size:11px;font-weight:500;\n  color:#04060F;margin-top:.1rem}\n.fm-do .msg .cn {flex:1;min-width:0}\n.fm-do .msg .cn .testa {display:flex;align-items:baseline;gap:.5rem;\n  flex-wrap:wrap;margin-bottom:.15rem}\n.fm-do .msg .cn .testa b {font-weight:500;font-size:13px;\n  color:rgba(245,240,230,.86)}\n.fm-do .msg .cn .testa span {font-size:11px;color:rgba(245,240,230,.32)}\n.fm-do .msg .cn p {font-family:'Cormorant Garamond',serif;font-size:1.04rem;\n  line-height:1.5;color:rgba(245,240,230,.88)}\n.fm-do .msg .mano {flex:none;align-self:center;opacity:0;transition:opacity .2s ease;\n  background:transparent;border:1px solid rgba(212,175,106,.34);\n  color:var(--oro-ch);border-radius:999px;padding:.16rem .6rem;\n  font-family:'DM Sans',sans-serif;font-size:11px;letter-spacing:.08em;\n  cursor:pointer;white-space:nowrap}\n.fm-do .msg:hover .mano,.fm-do .msg:focus-within .mano {opacity:1}\n.fm-do .msg .mano:hover {background:rgba(212,175,106,.16)}\n.fm-do .msg.presa {background:rgba(212,175,106,.08)}\n.fm-do .msg.presa .mano {opacity:1;border-color:var(--oro-ch);\n  background:rgba(212,175,106,.18)}\n.fm-do .scrivi {display:flex;gap:.6rem;align-items:center;\n  padding:.7rem .9rem;border-top:1px solid rgba(245,240,230,.08);\n  background:rgba(2,4,12,.6)}\n.fm-do .scrivi input {flex:1;min-width:0;background:transparent;border:0;\n  outline:none;color:var(--ivory);font-family:'Cormorant Garamond',serif;\n  font-size:1.04rem;min-height:2.4rem}\n.fm-do .scrivi input::placeholder {color:rgba(245,240,230,.3);font-style:italic}\n.fm-do .scrivi button {flex:none;width:2.2rem;height:2.2rem;border-radius:50%;\n  border:0;background:var(--oro-ch);color:#0A0C1A;cursor:pointer;\n  display:grid;place-items:center;font-size:1rem}\n.fm-do .nota {margin-top:.7rem;font-family:'Cormorant Garamond',serif;\n  font-style:italic;font-size:.96rem;line-height:1.55;\n  color:rgba(245,240,230,.44)}\n/* \u2550\u2550\u2550 i cinque gesti \u2550\u2550\u2550 */\n.gesti{display:flex;gap:.4rem;flex-wrap:wrap;margin-top:2rem;\n  padding-top:1.1rem;border-top:1px solid var(--riga)}\n.fm-do .gesti button {background:transparent;border:1px solid rgba(245,240,230,.16);\n  color:rgba(245,240,230,.6);border-radius:999px;padding:.3rem .9rem;\n  cursor:pointer;font-family:'DM Sans',sans-serif;font-size:13px;\n  letter-spacing:.06em;min-height:2.2rem}\n.fm-do .gesti button:hover {border-color:rgba(212,175,106,.5);color:var(--oro-ch)}\n.fm-do .pie {margin-top:2.4rem;padding-top:1rem;border-top:1px solid var(--riga);\n  font-family:'Cormorant Garamond',serif;font-size:13px;\n  color:rgba(245,240,230,.3);line-height:1.7}\n@media(max-width:34rem){\n  \n  .segno{width:2.4rem}\n.fm-do .dati {gap:.5rem 1rem}\n}\n.fm-do .dati .fl {display:flex;flex-wrap:wrap;gap:.3rem;margin-top:.1rem}\n.fm-do .dati .ff {display:inline-flex;align-items:center;gap:.3rem;font-size:.8rem;\n    padding:.16rem .55rem;border-radius:1rem;\n    border:1px solid rgba(245,240,230,.18);color:rgba(245,240,230,.7)}\n.fm-do .dati .ff::before {content:'\\25a4';font-size:.72rem;color:rgba(245,240,230,.38)}\n.fm-do .dati .ff.pi {border-style:dashed;border-color:rgba(200,160,85,.45);\n    color:var(--oro-ch);cursor:pointer}\n.fm-do .dati .ff.pi::before {content:none}\n/* i volti di chi c'\u00e8 dentro, e il chiamato in attesa */\n  .volti{display:flex;align-items:center;flex-wrap:wrap;gap:.35rem .25rem}\n.fm-do .vo {width:1.75rem;height:1.75rem;border-radius:50%;display:grid;place-items:center;\n    font-size:.84rem;color:var(--ivory);border:1px solid color-mix(in srgb,var(--c,var(--oro)) 70%,transparent);\n    background:color-mix(in srgb,var(--c,var(--oro)) 30%,transparent);margin-left:-.45rem}\n.fm-do .vo:first-child {margin-left:0}\n.fm-do .vo.piu {border:1px dashed rgba(245,240,230,.35);background:transparent;color:rgba(245,240,230,.6);font-size:.84rem}\n.fm-do .chiamato {display:inline-flex;align-items:center;gap:.45rem;margin-left:.4rem}\n.fm-do .chiamato .piu-g {margin-left:0}\n.fm-do .vo.attesa {border:1px dashed rgba(212,175,106,.6);background:transparent;color:rgba(245,240,230,.6);margin-left:0}\n.fm-do .vo.attesa b {font-weight:400}\n.fm-do .chiamato i {font-family:'Cormorant Garamond',serif;font-style:italic;font-size:.9rem;color:rgba(212,175,106,.75);white-space:nowrap}\n.fm-do .piu-g {width:1.75rem;height:1.75rem;border-radius:50%;display:grid;place-items:center;cursor:pointer;\n    border:1px dashed rgba(212,175,106,.6);background:transparent;color:var(--oro-ch);font:inherit;font-size:1rem;\n    margin-left:.4rem;padding:0;position:relative}\n.fm-do .piu-g::after {content:'';position:absolute;inset:-.5rem}\n/* tocco 2.75rem */\n  .piu-g:hover{border-color:var(--oro-ch);background:rgba(212,175,106,.1)}\n.fm-do .dati .fl {display:flex;align-items:center;flex-wrap:wrap;gap:.3rem}\n.fm-do .dati .ff.piu-g {padding:0;min-height:0;width:1.75rem;height:1.75rem;border-radius:50%;margin-left:.2rem}\n.fm-do .dati .ff.piu-g::before {content:none}\n.fm-do .ffn {width:100%;font-family:'Cormorant Garamond',serif;font-style:italic;font-size:.84rem;color:rgba(245,240,230,.4)}\n.fm-do .nuova {display:flex;align-items:center;gap:.7rem;width:100%;text-align:left;\n    border:1px dashed rgba(200,160,85,.45);border-radius:.8rem;\n    background:rgba(200,160,85,.06);padding:.75rem .85rem;margin-bottom:.5rem;\n    cursor:pointer;font-family:'Cormorant Garamond',serif;font-size:1rem;\n    color:rgba(245,240,230,.7);line-height:1.4}\n.fm-do .nuova .pi {width:1.8rem;height:1.8rem;border-radius:50%;flex:none;display:grid;\n    place-items:center;border:1px solid rgba(200,160,85,.5);color:var(--oro-ch);font-size:1.1rem}\n.fm-do .figlia .dd {display:flex;flex-wrap:wrap;gap:.15rem .9rem;margin-top:.3rem}\n/* chi ha preso il lavoro, quando, e le ore */\n  .figlia .presa{display:flex;align-items:center;flex-wrap:wrap;gap:.3rem .4rem;margin-top:.5rem;\n    padding-top:.45rem;border-top:1px dashed color-mix(in srgb,var(--c) 30%,transparent);\n    font-size:.78rem;color:rgba(245,240,230,.6)}\n.fm-do .figlia .presa .ce {width:1.35rem;height:1.35rem;border-radius:50%;display:grid;place-items:center;\n    font-size:.6rem;color:var(--ivory);border:1px solid color-mix(in srgb,var(--c) 55%,transparent);\n    background:color-mix(in srgb,var(--c) 18%,transparent)}\n.fm-do .figlia .presa .sep {color:rgba(245,240,230,.2)}\n.fm-do .figlia .presa .ore {color:var(--oro-ch)}\n.fm-do .figlia .presa .fatta {color:var(--verde,#6E9E5A)}\n.fm-do .figlia .presa.vuota {color:rgba(245,240,230,.35);font-style:italic}\n.fm-do .figlia .presa.vuota .ce {border-style:dashed;opacity:.6}\n.fm-do .figlia .dd span {font-size:.78rem;color:rgba(245,240,230,.55)}\n.fm-do .figlia .dd i {font-style:normal;font-size:.6rem;letter-spacing:.1em;\n    text-transform:uppercase;color:rgba(245,240,230,.3);margin-right:.3rem}\n.fm-do .docs {display:flex;flex-direction:column;gap:.35rem;margin-bottom:.5rem}\n.fm-do .doc {border:1px solid rgba(245,240,230,.1);border-radius:.7rem;\n    background:rgba(8,11,26,.4);padding:.55rem .7rem}\n.fm-do .doc .tp {display:block;font-size:.6rem;letter-spacing:.1em;text-transform:uppercase;\n    color:rgba(245,240,230,.32)}\n.fm-do .doc b {display:block;font-family:'Cormorant Garamond',serif;font-weight:400;font-size:1rem}\n.fm-do .doc.vuoto {border-style:dashed;font-family:'Cormorant Garamond',serif;font-style:italic;\n    font-size:.9rem;color:rgba(245,240,230,.32)}\n.fm-do .sv-chat-fondo {background:#0A0C1A;\n    background-image:\n      radial-gradient(ellipse at 22% 10%,rgba(38,64,120,.42),transparent 58%),\n      radial-gradient(ellipse at 84% 84%,rgba(60,44,110,.34),transparent 60%);\n    padding:1.6rem 1rem 2.4rem;border-radius:1.1rem;min-height:100vh}\n.fm-do .sv-chat {--scala:1.4;\n    --t-eti:calc(0.60rem * var(--scala));\n    --t-cor:calc(0.76rem * var(--scala));\n    --oro-a:#D4AF6A;\n    max-width:58rem;margin:0 auto;\n    font-family:'DM Sans',system-ui,sans-serif;color:#F5F0E6}\n.fm-do .sv-chat * {box-sizing:border-box}\n.fm-do .sv-chat .capo {display:flex;align-items:baseline;gap:.8rem;\n    flex-wrap:wrap;margin-bottom:1rem}\n.fm-do .sv-chat .capo h2 {font-family:'Cinzel',serif;font-weight:500;\n    font-size:calc(1.04rem * var(--scala));letter-spacing:.05em}\n.fm-do .sv-chat .capo span {font-family:'Cormorant Garamond',serif;\n    font-style:italic;font-size:var(--t-cor);color:rgba(245,240,230,.42)}\n/* due colonne: la chat, e gli argomenti */\n  .sv-chat .due{display:grid;gap:1rem;\n    grid-template-columns:minmax(0,1fr) 15rem;align-items:start}\n/* \u2500\u2500 la chat \u2500\u2500 */\n  .sv-chat .flusso{border-radius:1rem;overflow:hidden;\n    background:rgba(2,4,12,.42);border:1px solid rgba(245,240,230,.09)}\n.fm-do .sv-chat .scorri {max-height:32rem;overflow-y:auto;scroll-behavior:smooth}\n.fm-do .sv-chat .giorno {position:sticky;top:0;z-index:3;\n    padding:.42rem .95rem;font-size:10px;letter-spacing:.22em;\n    text-transform:uppercase;color:rgba(245,240,230,.44);\n    background:rgba(6,9,20,.94);backdrop-filter:blur(6px);\n    border-bottom:1px solid rgba(245,240,230,.07)}\n/* il capitolo: dove comincia un argomento */\n  .sv-chat .cap{display:flex;align-items:center;gap:.55rem;\n    padding:.7rem .95rem .3rem;scroll-margin-top:2.4rem}\n.fm-do .sv-chat .cap i {width:.42rem;height:.42rem;border-radius:50%;\n    background:var(--c);flex:none;font-style:normal;\n    filter:brightness(1.35)}\n.fm-do .sv-chat .cap b {font-family:'Cormorant Garamond',serif;font-weight:400;\n    font-size:1.04rem;color:var(--c);filter:brightness(1.35)}\n.fm-do .sv-chat .cap em {font-style:normal;font-size:10px;letter-spacing:.16em;\n    text-transform:uppercase;color:rgba(245,240,230,.28)}\n.fm-do .sv-chat .msg {display:flex;gap:.65rem;padding:.5rem .95rem;\n    position:relative}\n.fm-do .sv-chat .msg:hover {background:rgba(245,240,230,.03)}\n.fm-do .sv-chat .msg .chi {flex:none;width:1.55rem;height:1.55rem;\n    border-radius:50%;display:grid;place-items:center;font-size:11px;\n    font-weight:500;color:#04060F;margin-top:.1rem}\n.fm-do .sv-chat .msg .cn {flex:1;min-width:0}\n.fm-do .sv-chat .msg .testa {display:flex;align-items:baseline;gap:.5rem;\n    flex-wrap:wrap;margin-bottom:.1rem}\n.fm-do .sv-chat .msg .testa b {font-weight:500;font-size:12.5px;\n    color:rgba(245,240,230,.84)}\n.fm-do .sv-chat .msg .testa span {font-size:10.5px;color:rgba(245,240,230,.3)}\n.fm-do .sv-chat .msg p {font-family:'Cormorant Garamond',serif;font-size:1.02rem;\n    line-height:1.5;color:rgba(245,240,230,.88)}\n.fm-do .sv-chat .msg p .tag {color:var(--oro-a);font-style:normal}\n.fm-do .sv-chat .msg .mano {flex:none;align-self:center;opacity:0;\n    transition:opacity .2s ease;background:transparent;\n    border:1px solid rgba(212,175,106,.32);color:var(--oro-a);\n    border-radius:999px;padding:.14rem .58rem;font-size:10.5px;\n    letter-spacing:.06em;cursor:pointer;white-space:nowrap;\n    font-family:'DM Sans',sans-serif}\n.fm-do .sv-chat .msg:hover .mano,.fm-do .sv-chat .msg:focus-within .mano {opacity:1}\n.fm-do .sv-chat .msg.presa {background:rgba(212,175,106,.08)}\n.fm-do .sv-chat .msg.presa .mano {opacity:1;border-color:var(--oro-a);\n    background:rgba(212,175,106,.18)}\n/* \u2500\u2500 si scrive \u2500\u2500 */\n  .sv-chat .scrivi{border-top:1px solid rgba(245,240,230,.08);\n    background:rgba(2,4,12,.62);padding:.6rem .9rem;position:relative}\n.fm-do .sv-chat .riga1 {display:flex;gap:.5rem;align-items:center}\n.fm-do .sv-chat .riga1 input {flex:1;min-width:0;background:transparent;\n    border:0;outline:none;color:#F5F0E6;\n    font-family:'Cormorant Garamond',serif;font-size:1.02rem;\n    min-height:2.3rem}\n.fm-do .sv-chat .riga1 input::placeholder {color:rgba(245,240,230,.28);\n    font-style:italic}\n.fm-do .sv-chat .riga1 button {flex:none;width:2.1rem;height:2.1rem;\n    border-radius:50%;border:0;background:var(--oro-a);color:#0A0C1A;\n    cursor:pointer;display:grid;place-items:center;font-size:1rem}\n/* la riga dell'argomento */\n  .sv-chat .riga2{display:flex;gap:.4rem;align-items:center;\n    flex-wrap:wrap;margin-top:.42rem;padding-top:.42rem;\n    border-top:1px solid rgba(245,240,230,.06)}\n.fm-do .sv-chat .riga2 .et {font-size:10px;letter-spacing:.16em;\n    text-transform:uppercase;color:rgba(245,240,230,.3)}\n.fm-do .sv-chat .riga2 input {background:rgba(245,240,230,.05);\n    border:1px solid rgba(245,240,230,.12);border-radius:999px;\n    padding:.24rem .7rem;color:#F5F0E6;outline:none;min-width:8rem;\n    font-family:'Cormorant Garamond',serif;font-size:.96rem;\n    min-height:1.9rem}\n.fm-do .sv-chat .riga2 input:focus {border-color:rgba(212,175,106,.42)}\n.fm-do .sv-chat .riga2 .ele {display:flex;gap:.24rem;flex-wrap:wrap}\n.fm-do .sv-chat .riga2 .ele button {background:transparent;\n    border:1px solid rgba(245,240,230,.14);color:rgba(245,240,230,.44);\n    border-radius:999px;padding:.16rem .58rem;cursor:pointer;\n    font-family:'DM Sans',sans-serif;font-size:10.5px;\n    letter-spacing:.1em;text-transform:uppercase;min-height:1.9rem}\n.fm-do .sv-chat .riga2 .ele button.on {border-color:var(--c);color:var(--c);\n    filter:brightness(1.35);background:color-mix(in srgb,var(--c) 12%,transparent)}\n.fm-do .sv-chat .riga2 .ora {font-family:'Cormorant Garamond',serif;\n    font-size:1rem;color:rgba(245,240,230,.62);flex:1;min-width:0;\n    white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n.fm-do .sv-chat .riga2 .ele button {pointer-events:none;opacity:.9}\n.fm-do .sv-chat .cap b[contenteditable=\"true\"] {outline:none;\n    border-bottom:1px dashed rgba(212,175,106,.55);cursor:text}\n.fm-do .sv-chat .cap .corr {background:none;border:0;cursor:pointer;\n    color:rgba(245,240,230,.24);font-size:10px;letter-spacing:.1em;\n    text-transform:uppercase;font-family:'DM Sans',sans-serif;\n    padding:.1rem .3rem;opacity:0;transition:opacity .2s ease}\n.fm-do .sv-chat .cap:hover .corr {opacity:1}\n.fm-do .sv-chat .cap .corr:hover {color:var(--oro-a)}\n.fm-do .sv-chat .prop {position:absolute;left:.9rem;right:.9rem;bottom:100%;\n    z-index:4;margin-bottom:.4rem;border-radius:.7rem;overflow:hidden;\n    background:#131A2C;border:1px solid rgba(212,175,106,.26)}\n.fm-do .sv-chat .prop:empty {display:none}\n.fm-do .sv-chat .prop button {display:flex;align-items:center;gap:.5rem;\n    width:100%;min-height:2.4rem;padding:.3rem .8rem;background:none;\n    border:0;cursor:pointer;color:rgba(245,240,230,.86);text-align:left;\n    font-family:'Cormorant Garamond',serif;font-size:1rem;\n    border-bottom:1px solid rgba(245,240,230,.06)}\n.fm-do .sv-chat .prop button:last-child {border-bottom:0}\n.fm-do .sv-chat .prop button:hover {background:rgba(212,175,106,.14)}\n.fm-do .sv-chat .prop button i {width:1.25rem;height:1.25rem;border-radius:50%;\n    display:grid;place-items:center;font-size:10.5px;font-weight:500;\n    color:#04060F;font-style:normal;flex:none}\n/* \u2500\u2500 la colonna degli argomenti \u2500\u2500 */\n  .sv-chat .lato{position:sticky;top:.6rem;border-radius:1rem;\n    padding:.9rem .85rem;background:rgba(2,4,12,.42);\n    border:1px solid rgba(245,240,230,.09);\n    max-height:32rem;overflow-y:auto}\n.fm-do .sv-chat .lato > .et {font-size:10px;letter-spacing:.2em;\n    text-transform:uppercase;color:var(--oro-a);opacity:.8;\n    margin-bottom:.6rem}\n.fm-do .sv-chat .lato .gg {font-size:10px;letter-spacing:.18em;\n    text-transform:uppercase;color:rgba(245,240,230,.3);\n    margin:.8rem 0 .35rem;padding-bottom:.2rem;\n    border-bottom:1px solid rgba(245,240,230,.07)}\n.fm-do .sv-chat .lato .gg:first-of-type {margin-top:0}\n.fm-do .sv-chat .lato .vc {display:flex;align-items:flex-start;gap:.5rem;\n    width:100%;padding:.4rem .5rem;border-radius:.5rem;cursor:pointer;\n    background:none;border:0;text-align:left;\n    border-left:2px solid transparent}\n.fm-do .sv-chat .lato .vc:hover {background:rgba(245,240,230,.05)}\n.fm-do .sv-chat .lato .vc.qui {background:color-mix(in srgb,var(--c) 12%,transparent);\n    border-left-color:var(--c)}\n.fm-do .sv-chat .lato .vc i {width:.4rem;height:.4rem;border-radius:50%;\n    background:var(--c);flex:none;margin-top:.5rem;font-style:normal;\n    filter:brightness(1.35)}\n.fm-do .sv-chat .lato .vc span {flex:1;min-width:0;\n    font-family:'Cormorant Garamond',serif;font-size:.98rem;\n    line-height:1.35;color:rgba(245,240,230,.78)}\n.fm-do .sv-chat .lato .vc.qui span {color:#F5F0E6}\n.fm-do .sv-chat .lato .vc em {flex:none;font-style:normal;font-size:10px;\n    color:rgba(245,240,230,.26)}\n.fm-do .sv-chat .nota {margin-top:.9rem;font-family:'Cormorant Garamond',serif;\n    font-style:italic;font-size:var(--t-cor);line-height:1.55;\n    color:rgba(245,240,230,.4)}\n@media (max-width:52rem){\n    .sv-chat{--scala:1.15}\n.fm-do .sv-chat .due {grid-template-columns:1fr}\n.fm-do .sv-chat .lato {position:static;max-height:14rem;order:-1}\n}\n/* \u2b50 LA RIGA CHE PUBBLICA \u2014 sotto la chat.\n   Chiusa non disturba; aperta mostra i cinque tipi e SOLO i campi\n   che l'orma non sa gi\u00e0. Il vaglio viene prima: a chi non l'ha\n   passato la riga non compare, e al suo posto c'\u00e8 l'invito. */\n.pubb{border:1px solid rgba(200,160,85,.4);border-radius:.9rem;\nbackground:rgba(200,160,85,.08);margin:1.2rem 0 .6rem;overflow:hidden}\n.fm-do .pubb .cap2 {padding:.7rem .85rem .3rem}\n.fm-do .pubb .cap2 .sot2 {display:block;font-family:'Cormorant Garamond',serif;font-style:italic;\n  font-size:.86rem;color:rgba(245,240,230,.42);margin-top:.05rem}\n.fm-do .pubb .cap2 b {flex:1;font-weight:400;font-size:1rem;color:var(--oro-ch)}\n.fm-do .pubb .cap2 .fr {color:rgba(245,240,230,.35);font-size:.8rem}\n.fm-do .pubb .dnt {padding:.2rem .85rem .85rem}\n.fm-do .pubb .pil {display:flex;flex-wrap:wrap;gap:.4rem;padding:0 .85rem .8rem}\n.fm-do .pubb .pil span.su {border-color:var(--c);\n  background:color-mix(in srgb,var(--c) 22%,transparent);\n  box-shadow:0 0 .5rem color-mix(in srgb,var(--c) 30%,transparent)}\n.fm-do .pubb .pil span {font-size:.86rem;padding:0 .9rem;min-height:2.2rem;\n  display:inline-flex;align-items:center;border-radius:1.2rem;\nborder:1px solid color-mix(in srgb,var(--c) 45%,transparent);\ncolor:var(--c);filter:brightness(1.3);\nbackground:color-mix(in srgb,var(--c) 9%,transparent);cursor:pointer}\n.fm-do .pubb .sa {margin-top:.7rem;padding-top:.6rem;border-top:1px solid rgba(245,240,230,.08)}\n.fm-do .pubb .sa .r {display:flex;justify-content:space-between;align-items:baseline;\npadding:.24rem 0;font-size:.88rem;color:rgba(245,240,230,.55)}\n.fm-do .pubb .sa .r b {color:rgba(245,240,230,.82);font-weight:400}\n.fm-do .pubb .sa .r.man b {color:var(--rosso,#C9707A);filter:brightness(1.2)}\n.fm-do .pubb .sa .cm {font-family:'Cormorant Garamond',serif;font-style:italic;\nfont-size:.86rem;color:rgba(245,240,230,.32);margin-top:.5rem}\n/* \u26d4 chi non ha il vaglio vede questa, non quella sopra */\n.vag{border:1px dashed rgba(140,47,57,.55);border-radius:.9rem;\nbackground:rgba(140,47,57,.1);padding:.8rem .85rem;margin:1.2rem 0 .6rem}\n.fm-do .vag b {display:block;font-family:'Cormorant Garamond',serif;font-size:1.06rem;\ncolor:#C9707A;filter:brightness(1.2);margin-bottom:.2rem}\n.fm-do .vag p {font-size:.88rem;line-height:1.5;color:rgba(245,240,230,.6);margin:0}\n.fm-do .vag .ts {display:inline-block;margin-top:.6rem;font-size:.84rem;padding:.32rem .9rem;\nborder-radius:1.2rem;border:1px solid rgba(200,160,85,.5);color:var(--oro-ch);\nbackground:rgba(200,160,85,.1);cursor:pointer}\n.fm-do .vag .pass {margin-top:.7rem;padding-top:.6rem;border-top:1px solid rgba(245,240,230,.08)}\n.fm-do .vag .pass .r {display:flex;gap:.55rem;align-items:flex-start;\npadding:.22rem 0;font-size:.86rem;color:rgba(245,240,230,.6);line-height:1.45}\n.fm-do .vag .pass .r i {flex:none;font-style:normal;font-family:'Cinzel',serif;\nfont-size:.76rem;color:rgba(200,160,85,.75);width:1rem}\n.fm-do .pubb .qd {display:flex;gap:.28rem;margin:.55rem 0 .1rem}\n.fm-do .pubb .qd span {flex:1;text-align:center;font-family:'Cinzel',serif;font-size:.86rem;\npadding:.32rem;border-radius:.45rem;border:1px solid rgba(245,240,230,.15);\ncolor:rgba(245,240,230,.45);cursor:pointer}\n.fm-do .pubb .qd span.min {border-color:var(--oro,#C8A055);color:var(--oro-ch,#D4AF6A);\nbackground:rgba(200,160,85,.16)}\n.fm-do .pubb .et2 {font-size:.6rem;letter-spacing:.14em;text-transform:uppercase;\ncolor:rgba(245,240,230,.3);margin-top:.7rem}\n.fm-do .pubb .fam {display:flex;flex-wrap:wrap;gap:.28rem;margin-top:.4rem}\n.fm-do .pubb .fam span {font-size:.78rem;padding:.26rem .6rem;border-radius:.5rem;\nborder:1px solid rgba(245,240,230,.14);color:rgba(245,240,230,.5);cursor:pointer}\n.fm-do .pubb .tre {display:flex;gap:.28rem;margin-top:.4rem}\n.fm-do .pubb .tre span {flex:1;text-align:center;font-size:.82rem;padding:.32rem;\nborder-radius:.5rem;border:1px solid rgba(245,240,230,.15);\ncolor:rgba(245,240,230,.45);cursor:pointer}\n.fm-do .pubb .tre span.on {border-color:rgba(110,158,90,.55);color:#6E9E5A;\nbackground:rgba(110,158,90,.14)}\n.fm-do .pubb .pil span.on {background:color-mix(in srgb,var(--c) 26%,transparent);\nbox-shadow:0 0 .6rem color-mix(in srgb,var(--c) 30%,transparent)}\n.fm-do .pubb .ts2 {color:var(--oro-ch,#D4AF6A);cursor:pointer;\nborder-bottom:1px dotted rgba(212,175,106,.45)}\n.fm-do .pubb .cm {font-family:'Cormorant Garamond',serif;font-style:italic;\nfont-size:.86rem;color:rgba(245,240,230,.32);margin-top:.5rem;line-height:1.45}\n.fm-do .pubb .vai {margin-top:.9rem;padding-top:.7rem;\nborder-top:1px solid rgba(200,160,85,.25);text-align:center}\n.fm-do .pubb .ts3 {display:inline-block;font-size:.92rem;padding:.5rem 1.4rem;\nborder-radius:1.4rem;background:var(--oro,#C8A055);color:#0A0C1A;\nfont-weight:500;cursor:pointer;font-family:'DM Sans',sans-serif}\n.fm-do .pubb .vai .cm {margin-top:.45rem;text-align:center}\n.fm-do .vetr-f {--verde:#6E9E5A;--rosso:#C9707A;--line:rgba(184,150,62,.22);margin:1.6rem 0 1.2rem;padding:1.2rem 0 0;border-top:1px solid var(--line)}\n.fm-do .vetr-f .oc {font-family:'Cinzel',serif;font-size:.84rem;letter-spacing:.24em;text-transform:uppercase;color:rgba(212,175,106,.72);margin-bottom:.35rem}\n.fm-do .vetr-f .oc {font-family:'Cinzel',serif;font-size:.84rem;letter-spacing:.24em;text-transform:uppercase;\ncolor:rgba(212,175,106,.72);margin-bottom:.45rem}\n.fm-do .vetr-f h1 {font-family:'Cinzel',serif;font-weight:400;font-size:clamp(1.6rem,3vw,2.2rem);\nletter-spacing:.06em;line-height:1.15;margin-bottom:.3rem}\n.fm-do .vetr-f .sot {font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1.2rem;\ncolor:rgba(245,240,230,.6);line-height:1.5;margin-bottom:1.4rem}\n/* i cinque tipi */\n.vetr-f .pil{display:flex;flex-wrap:wrap;gap:.5rem;margin-bottom:1.6rem}\n.fm-do .vetr-f .pil button {min-height:2.75rem;padding:0 1.2rem;border-radius:999px;cursor:pointer;\nfont-family:'Cinzel',serif;font-size:.9rem;letter-spacing:.1em;text-transform:uppercase;\nbackground:rgba(4,8,20,.55);transition:.22s;\nborder:1px solid color-mix(in srgb,var(--c) 45%,transparent);\ncolor:var(--ivory)}\n.fm-do .vetr-f .pil button:hover {border-color:var(--c);background:color-mix(in srgb,var(--c) 14%,transparent)}\n.fm-do .vetr-f .pil button.su {background:color-mix(in srgb,var(--c) 24%,transparent);\nborder-color:var(--c);box-shadow:0 0 1rem color-mix(in srgb,var(--c) 40%,transparent)}\n/* le due colonne */\n.vetr-f .due{display:grid;grid-template-columns:1fr;gap:1.6rem}\n@media(min-width:48rem){.vetr-f .due{grid-template-columns:1.15fr 1fr;align-items:start;gap:2.2rem}\n}\n.fm-do .vetr-f .col > .et {font-family:'Cinzel',serif;font-size:.84rem;letter-spacing:.2em;text-transform:uppercase;\ncolor:rgba(212,175,106,.6);margin-bottom:.7rem}\n/* \u2500\u2500 a sinistra: si impagina \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */\n.vetr-f .quad{display:grid;grid-template-columns:repeat(3,1fr);gap:.5rem;margin-bottom:1rem}\n.fm-do .vetr-f .qd {display:flex;flex-direction:column;align-items:center;text-align:center;\nmin-height:5rem;padding:.7rem .4rem;cursor:pointer;font-family:inherit;\nborder-radius:.8rem;transition:.2s;color:inherit;justify-content:center;\nborder:1px solid rgba(212,175,106,.2);background:rgba(8,11,26,.5)}\n.fm-do .vetr-f .qd:hover {background:color-mix(in srgb,var(--c) 12%,transparent);\nborder-color:color-mix(in srgb,var(--c) 50%,transparent)}\n.fm-do .vetr-f .qd.su {border-color:var(--c);background:color-mix(in srgb,var(--c) 18%,transparent);\nbox-shadow:0 0 .8rem color-mix(in srgb,var(--c) 30%,transparent)}\n.fm-do .vetr-f .qd svg {width:2.1rem;height:2.1rem;flex:none;margin-bottom:.35rem;\ncolor:var(--c);filter:brightness(1.3)}\n.fm-do .vetr-f .qd b {display:block;font-weight:400;font-size:.9rem;line-height:1.25;\ncolor:rgba(245,240,230,.9)}\n.fm-do .vetr-f .qd i {display:block;font-family:'Cormorant Garamond',serif;font-style:italic;font-size:.95rem;line-height:1.3;\ncolor:rgba(245,240,230,.5);margin-top:.15rem}\n.fm-do .vetr-f .qd .pc {display:block;font-family:'Cinzel',serif;font-size:.84rem;color:var(--c);filter:brightness(1.35);\nmargin-top:.25rem;letter-spacing:.04em}\n.fm-do .vetr-f .campo {display:flex;align-items:center;gap:.8rem;padding:.6rem .9rem;min-height:3rem;\nmargin-bottom:.45rem;border-radius:.75rem;\nborder:1px solid rgba(212,175,106,.18);background:rgba(8,11,26,.5);transition:border-color .2s}\n.fm-do .vetr-f .campo:focus-within {border-color:rgba(212,175,106,.6)}\n.fm-do .vetr-f .campo > span:first-child {flex:none;width:8.5rem;font-family:'Cinzel',serif;font-size:.84rem;letter-spacing:.06em;\ncolor:rgba(245,240,230,.6)}\n.fm-do .vetr-f .campo input,.fm-do .campo .vv {flex:1;min-width:0;background:transparent;border:0;\ncolor:var(--ivory);font-family:'Cormorant Garamond',serif;font-size:1.15rem;text-align:right;\nmin-height:1.9rem}\n.fm-do .vetr-f .campo input:focus {outline:0}\n.fm-do .vetr-f .campo input::placeholder,.fm-do .campo .vv.no {color:rgba(212,175,106,.55);font-style:italic}\n.fm-do .vetr-f .campo .un {flex:none;font-size:.84rem;color:rgba(245,240,230,.45)}\n.fm-do .vetr-f .foto {display:flex;align-items:center;gap:.9rem;padding:.75rem .9rem;\nmargin-bottom:.45rem;border-radius:.75rem;cursor:pointer;\nborder:1px dashed rgba(212,175,106,.3);background:rgba(8,11,26,.4)}\n.fm-do .vetr-f .foto:hover {border-color:rgba(212,175,106,.6)}\n.fm-do .vetr-f .foto.gal {flex-wrap:wrap;gap:.5rem}\n.fm-do .vetr-f .foto .mini {position:relative;flex:none;width:3.2rem;height:3.2rem;border-radius:.55rem;background-size:cover;background-position:center;\nborder:1px solid rgba(245,240,230,.15);font-size:.6rem;line-height:1;color:var(--oro-ch);display:grid;align-items:end;justify-items:center;padding-bottom:.2rem;text-shadow:0 0 .3rem #000}\n.fm-do .vetr-f .foto .mini.prima {border-color:rgba(212,175,106,.7)}\n.fm-do .vetr-f .vetrina .gal2 {display:grid;grid-template-columns:repeat(4,1fr);gap:.3rem;padding:.4rem .7rem 0}\n.fm-do .vetr-f .vetrina .gal2 span {aspect-ratio:1;border-radius:.4rem;background-size:cover;background-position:center;border:1px solid rgba(245,240,230,.1)}\n.fm-do .vetr-f .vetrina .dove2 {font-size:.84rem;color:rgba(245,240,230,.5);margin-top:.15rem}\n.fm-do .vetr-f .vetrina .inc {font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1rem;color:rgba(212,175,106,.8);margin-top:.15rem}\n.fm-do .vetr-f .foto .qq {flex:none;width:3.2rem;height:3.2rem;border-radius:.55rem;\nborder:1px dashed rgba(212,175,106,.35);display:grid;place-items:center;\ncolor:rgba(212,175,106,.6);font-size:1.3rem}\n.fm-do .vetr-f .foto b {display:block;font-family:'Cinzel',serif;font-weight:400;font-size:.9rem;letter-spacing:.06em}\n.fm-do .vetr-f .foto i {display:block;font-family:'Cormorant Garamond',serif;font-style:italic;\nfont-size:1rem;color:rgba(245,240,230,.5);margin-top:.1rem}\n.fm-do .vetr-f .et2 {font-family:'Cinzel',serif;font-size:.84rem;letter-spacing:.16em;text-transform:uppercase;\ncolor:rgba(212,175,106,.6);margin:1rem 0 .45rem .1rem}\n.fm-do .vetr-f .scelte {display:flex;gap:.4rem;flex-wrap:wrap;margin-bottom:.6rem}\n.fm-do .vetr-f .scelte button {min-height:2.75rem;padding:0 1rem;border-radius:999px;\ncursor:pointer;font-family:inherit;font-size:.9rem;background:rgba(8,11,26,.45);\nborder:1px solid rgba(245,240,230,.16);color:rgba(245,240,230,.65);transition:.2s}\n.fm-do .vetr-f .scelte button:hover {border-color:rgba(212,175,106,.5);color:var(--ivory)}\n.fm-do .vetr-f .scelte button.su {border-color:var(--c);color:var(--ivory);\nbackground:color-mix(in srgb,var(--c) 20%,transparent);box-shadow:0 0 .6rem color-mix(in srgb,var(--c) 28%,transparent)}\n.fm-do .vetr-f .conto {display:flex;justify-content:space-between;align-items:baseline;gap:1rem;\npadding:.65rem .9rem;margin-top:.6rem;border-radius:.75rem;\nborder:1px solid rgba(200,160,85,.3);background:rgba(200,160,85,.07)}\n.fm-do .vetr-f .conto span {font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1.05rem;color:rgba(245,240,230,.6)}\n.fm-do .vetr-f .conto b {font-family:'Cinzel',serif;font-weight:400;font-size:1.15rem;color:var(--oro-ch)}\n.fm-do .vetr-f .esce {display:block;width:100%;min-height:3.25rem;margin-top:1.3rem;\nborder-radius:999px;cursor:pointer;font-family:'Cinzel',serif;font-size:.95rem;\nletter-spacing:.14em;text-transform:uppercase;transition:.25s;\nborder:1px solid color-mix(in srgb,var(--c) 70%,transparent);\nbackground:linear-gradient(180deg,color-mix(in srgb,var(--c) 26%,transparent),color-mix(in srgb,var(--c) 10%,transparent));\ncolor:var(--ivory)}\n.fm-do .vetr-f .esce:hover {box-shadow:0 0 1.6rem color-mix(in srgb,var(--c) 40%,transparent);border-color:var(--c)}\n/* \u2500\u2500 a destra: la vetrina \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */\n.vetr-f .vetrina{border-radius:1rem;overflow:hidden;position:sticky;top:1.2rem;\nborder:1px solid color-mix(in srgb,var(--c) 35%,transparent);\nbackground:color-mix(in srgb,var(--c) 7%,rgba(8,11,26,.7));\nbox-shadow:0 1rem 3rem rgba(0,0,0,.45),0 0 2rem color-mix(in srgb,var(--c) 12%,transparent)}\n.fm-do .vetr-f .vetrina .cap {padding:.65rem 1rem;font-family:'Cinzel',serif;font-size:.84rem;letter-spacing:.16em;\ntext-transform:uppercase;color:var(--c);filter:brightness(1.35);\nborder-bottom:1px solid color-mix(in srgb,var(--c) 25%,transparent);\nbackground:color-mix(in srgb,var(--c) 10%,transparent)}\n.fm-do .vetr-f .vetrina .im {aspect-ratio:4/3;display:grid;place-items:center;position:relative;\nbackground:radial-gradient(ellipse at 50% 40%,\n  color-mix(in srgb,var(--c) 14%,rgba(8,11,26,.6)),rgba(8,11,26,.75));\ncolor:rgba(245,240,230,.28);font-size:1.05rem;\nfont-family:'Cormorant Garamond',serif;font-style:italic}\n.fm-do .vetr-f .vetrina .im::after {content:'';position:absolute;inset:auto 0 0;height:3.5rem;\nbackground:linear-gradient(transparent,rgba(8,11,26,.6))}\n.fm-do .vetr-f .vetrina .dt {padding:1.1rem 1.1rem 1.2rem}\n.fm-do .vetr-f .vetrina .dt h3 {font-family:'Cormorant Garamond',serif;font-weight:400;\nfont-size:1.6rem;line-height:1.2;margin-bottom:.15rem}\n.fm-do .vetr-f .vetrina .dt h3.no {color:rgba(245,240,230,.3);font-style:italic}\n.fm-do .vetr-f .vetrina .chi {font-family:'Cinzel',serif;font-size:.84rem;letter-spacing:.06em;color:rgba(245,240,230,.5);margin-bottom:.8rem}\n.fm-do .vetr-f .lungo {margin-bottom:.45rem}\n.fm-do .vetr-f .lungo textarea {width:100%;min-height:6rem;resize:vertical;\nbackground:rgba(8,11,26,.5);border:1px solid rgba(212,175,106,.18);\nborder-radius:.75rem;padding:.7rem .9rem;color:var(--ivory);\nfont-family:'Cormorant Garamond',serif;font-size:1.15rem;line-height:1.5}\n.fm-do .vetr-f .lungo textarea:focus {outline:0;border-color:rgba(212,175,106,.6);box-shadow:0 0 .8rem rgba(212,175,106,.18)}\n.fm-do .vetr-f .lungo textarea::placeholder {color:rgba(212,175,106,.5);font-style:italic}\n.fm-do .vetr-f .lungo .cnt {font-size:.84rem;color:rgba(245,240,230,.35);text-align:right;margin-top:.25rem}\n.fm-do .vetr-f .vetrina .rac {font-family:'Cormorant Garamond',serif;font-size:1.15rem;\nline-height:1.5;color:rgba(245,240,230,.72);margin-bottom:.9rem;white-space:pre-wrap}\n.fm-do .vetr-f .vetrina .rac.no {color:rgba(245,240,230,.25);font-style:italic}\n.fm-do .vetr-f .vetrina .pz {display:flex;align-items:baseline;gap:.5rem;margin-bottom:.6rem}\n.fm-do .vetr-f .vetrina .pz b {font-family:'Cinzel',serif;font-weight:400;font-size:1.7rem;\ncolor:var(--c);filter:brightness(1.35)}\n.fm-do .vetr-f .vetrina .pz b.no {color:rgba(245,240,230,.25);font-size:1.3rem}\n.fm-do .vetr-f .vetrina .pz span {font-size:.84rem;color:rgba(245,240,230,.4)}\n.fm-do .vetr-f .vetrina .st {display:inline-flex;align-items:center;gap:.35rem;font-size:.84rem;letter-spacing:.04em;\npadding:.25rem .8rem;border-radius:1rem;margin-bottom:.7rem;\nborder:1px solid rgba(110,158,90,.5);color:var(--verde);filter:brightness(1.2)}\n.fm-do .vetr-f .vetrina .st::before {content:'';width:.4rem;height:.4rem;border-radius:50%;background:currentColor}\n.fm-do .vetr-f .vetrina .st.giu {border-color:rgba(201,112,122,.45);color:var(--rosso)}\n.fm-do .vetr-f .vetrina .st.mezzo {border-color:rgba(200,160,85,.45);color:var(--oro-ch)}\n.fm-do .vetr-f .vetrina .qd2 {font-family:'Cormorant Garamond',serif;font-size:1.15rem;\ncolor:var(--c);filter:brightness(1.25);margin-bottom:.35rem}\n.fm-do .vetr-f .vetrina .sp {font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1.05rem;\ncolor:rgba(245,240,230,.5);padding-top:.6rem;\nborder-top:1px solid rgba(245,240,230,.1)}\n.fm-do .vetr-f .vetrina .comp {display:block;width:100%;min-height:3rem;margin-top:1rem;\nborder-radius:999px;font-family:'Cinzel',serif;font-size:.9rem;letter-spacing:.12em;text-transform:uppercase;cursor:default;\nborder:1px solid color-mix(in srgb,var(--c) 60%,transparent);\nbackground:color-mix(in srgb,var(--c) 16%,transparent);\ncolor:var(--ivory)}\n.fm-do .vetr-f .vuoto {font-family:'Cormorant Garamond',serif;font-style:italic;\nfont-size:1.2rem;color:rgba(245,240,230,.4);padding:2.4rem 1rem;text-align:center;\nborder:1px dashed rgba(212,175,106,.25);border-radius:1rem;background:rgba(8,11,26,.3)}\n/* legato a */\n.vetr-f .leg,.lege{display:flex;align-items:center;gap:.7rem;padding:.55rem .8rem;min-height:3rem;margin-bottom:.4rem;\nborder-radius:.75rem;border:1px solid color-mix(in srgb,var(--c) 40%,transparent);background:rgba(8,11,26,.5);\nwidth:100%;text-align:left;color:inherit;font-family:inherit;cursor:pointer}\n.fm-do .vetr-f .leg {cursor:default}\n.fm-do .vetr-f .lege:hover {background:color-mix(in srgb,var(--c) 12%,transparent);border-color:var(--c)}\n.fm-do .vetr-f .lt {flex:none;font-family:'Cinzel',serif;font-size:.84rem;letter-spacing:.08em;text-transform:uppercase;\ncolor:var(--c);filter:brightness(1.35);min-width:5.4rem}\n.fm-do .vetr-f .ln {flex:1;min-width:0;display:flex;flex-direction:column}\n.fm-do .vetr-f .ln b {font-family:'Cormorant Garamond',serif;font-weight:400;font-size:1.15rem;line-height:1.25;color:var(--ivory)}\n.fm-do .vetr-f .ln i {font-family:'Cormorant Garamond',serif;font-style:italic;font-size:.98rem;color:rgba(245,240,230,.5)}\n.fm-do .vetr-f .lx,.fm-do .lf {flex:none;width:2.2rem;height:2.2rem;border-radius:50%;border:1px solid rgba(212,175,106,.35);\nbackground:transparent;color:var(--oro-ch);font-size:1.1rem;display:grid;place-items:center;cursor:pointer}\n.fm-do .vetr-f .lx:hover {border-color:var(--rosso);color:var(--rosso)}\n.fm-do .vetr-f .legpiu {display:block;width:100%;min-height:2.9rem;padding:0 1rem;border-radius:.75rem;cursor:pointer;\nborder:1px dashed rgba(212,175,106,.35);background:transparent;color:rgba(212,175,106,.85);\nfont-family:'Cormorant Garamond',serif;font-style:italic;font-size:1.1rem;text-align:left}\n.fm-do .vetr-f .legpiu:hover {border-color:var(--oro-ch);background:rgba(212,175,106,.06)}\n.fm-do .vetr-f .legc {padding:.7rem .8rem .4rem;border-radius:.9rem;border:1px solid rgba(212,175,106,.25);background:rgba(4,8,20,.45)}\n.fm-do .vetr-f .legc .scelte {margin-bottom:.5rem}\n.fm-do .vetr-f .legrel button {font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1.05rem}\n.fm-do .vetr-f .legesiti {max-height:16rem;overflow:auto;margin-top:.4rem}\n.fm-do .vetr-f .legn {font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1.05rem;color:rgba(245,240,230,.4);padding:.6rem .2rem}\n/* nella vetrina: sotto il racconto, sopra il prezzo */\n.vetr-f .vleg{display:flex;flex-direction:column;gap:.35rem;margin:-.2rem 0 .9rem}\n.fm-do .vetr-f .vleg .vet {font-family:'Cinzel',serif;font-size:.84rem;letter-spacing:.16em;text-transform:uppercase;color:rgba(212,175,106,.6)}\n.fm-do .vetr-f .vleg .vl {display:flex;align-items:center;gap:.6rem;padding:.5rem .7rem;border-radius:.7rem;text-decoration:none;color:inherit;\nborder:1px solid color-mix(in srgb,var(--c) 35%,transparent);background:color-mix(in srgb,var(--c) 8%,transparent)}\n.fm-do .vetr-f .vleg .vl:hover {border-color:var(--c)}\n.fm-do .vetr-f .vleg .vt {flex:none;font-family:'Cinzel',serif;font-size:.84rem;letter-spacing:.08em;text-transform:uppercase;color:var(--c);filter:brightness(1.35)}\n.fm-do .vetr-f .vleg .vn {flex:1;min-width:0;display:flex;flex-direction:column}\n.fm-do .vetr-f .vleg .vn b {font-family:'Cormorant Garamond',serif;font-weight:400;font-size:1.1rem;line-height:1.25}\n.fm-do .vetr-f .vleg .vn i {font-family:'Cormorant Garamond',serif;font-style:italic;font-size:.95rem;color:rgba(245,240,230,.5)}\n.fm-do .vetr-f .vleg .vf {color:rgba(245,240,230,.35)}";

var EL_DO = { terra:"#AA8844", acqua:"#4488BB", fuoco:"#CC6644",
              aria:"#669944", etere:"#9966CC", nexus:"#8C2F39" };
var MESI_DO = ["gennaio","febbraio","marzo","aprile","maggio","giugno","luglio",
               "agosto","settembre","ottobre","novembre","dicembre"];

var doBox = null, doId = null, doOrma = null, doDentro = [],
    doFiglie = [], doFile = [], doChat = [], doIo = null;

function doVeste(){
  if(document.getElementById("fm-do-veste")) return;
  var s = document.createElement("style");
  s.id = "fm-do-veste";
  s.textContent = DO_CSS;
  document.head.appendChild(s);
}

function doEl(t, c, x){
  var n = document.createElement(t);
  if(c) n.className = c;
  if(x !== undefined) n.innerHTML = x;
  return n;
}
function doData(d, lungo){
  if(!d) return "";
  var g = new Date(d);
  return g.getDate() + " " + (lungo ? MESI_DO[g.getMonth()]
                                    : MESI_DO[g.getMonth()].slice(0,3));
}
function doStadio(s){
  return s === "sviluppato" ? "chiuso" :
         s === "in_avanzamento" ? "in corso" : "in coda";
}
function doIniz(n){
  return (n || "?").trim().charAt(0).toUpperCase();
}

/* ── leggere ────────────────────────────────────────────────────── */
async function doLeggi(id){
  var d = { orma:null, dentro:[], figlie:[], file:[], chat:[], io:null };
  try{
    var u = await db.auth.getUser();
    d.io = u && u.data && u.data.user && u.data.user.id;

    var o = await db.from("orme")
      .select("id,titolo,contenuto,sottotitolo,elemento,stadio,luogo," +
              "accaduto_il,entro_il,destinazione,persona_id,quanti_servono")
      .eq("id", id).single();
    if(o.error) return d;
    d.orma = o.data;

    /* chi c'è dentro: i lasciati restano come storia, ma non contano */
    var p = await db.from("orma_persone")
      .select("id,persona_id,nome,preso_il,chiuso_il,ore,lasciato_il")
      .eq("orma_id", id);
    if(!p.error) d.dentro = (p.data || []).filter(function(x){ return !x.lasciato_il; });

    /* ⭐ le figlie, in ordine di tempo */
    var f = await db.from("orme")
      .select("id,titolo,contenuto,elemento,stadio,entro_il,luogo,destinazione")
      .eq("orma_madre_id", id).order("momento");
    d.figlie = f.error ? [] : (f.data || []);

    /* per ogni figlia: chi l'ha presa, quando, quante ore */
    if(d.figlie.length){
      var ids = d.figlie.map(function(x){ return x.id; });
      var fp = await db.from("orma_persone")
        .select("orma_id,nome,persona_id,preso_il,chiuso_il,ore,lasciato_il")
        .in("orma_id", ids);
      var per = {};
      (fp.error ? [] : fp.data || []).forEach(function(r){
        if(r.lasciato_il) return;
        (per[r.orma_id] = per[r.orma_id] || []).push(r);
      });
      d.figlie.forEach(function(x){ x.presa = per[x.id] || []; });
    }

    /* gli allegati, coi permessi che scadono */
    try{
      var fl = await db.rpc("fm_file_orma", { p_orma: id });
      if(!fl.error) d.file = fl.data || [];
    }catch(e){}

    var c = await db.from("orma_messaggi")
      .select("id,persona_id,nome,testo,momento,argomento")
      .eq("orma_id", id).order("momento").limit(80);
    d.chat = c.error ? [] : (c.data || []);
  }catch(e){ console.warn("dentro l\u2019orma:", e); }
  return d;
}

/* ── i gesti ────────────────────────────────────────────────────── */
async function doPrendi(id, tasto){
  tasto.disabled = true;
  var era = tasto.textContent;
  tasto.textContent = "un momento\u2026";
  try{
    var r = await db.rpc("fm_prendi_orma", { p_orma: id });
    if(r.error || r.data === false) throw r.error || new Error("non presa");
    await ormaDentro(doBox, doId);
  }catch(e){
    tasto.textContent = era; tasto.disabled = false;
    console.warn("dentro l\u2019orma:", e);
  }
}
async function doLascia(id, tasto){
  tasto.disabled = true;
  try{
    await db.rpc("fm_lascia_orma", { p_orma: id });
    await ormaDentro(doBox, doId);
  }catch(e){ tasto.disabled = false; console.warn("dentro l\u2019orma:", e); }
}
/* ⭐ chiudere: le ore si scrivono a mano, niente cronometro */
async function doChiudi(id){
  var ore = prompt("Quante ore ci hai messo?");
  if(ore === null) return;
  var n = parseFloat(String(ore).replace(",", "."));
  if(isNaN(n) || n < 0) return;
  try{
    await db.rpc("fm_chiudi_orma", { p_orma: id, p_ore: n });
    await ormaDentro(doBox, doId);
  }catch(e){ console.warn("dentro l\u2019orma:", e); }
}

/* ⭐ CARICARE UN FILE: va in Supabase Storage, bucket riservato,
   col percorso <orma_id>/<nome>. ⚠️ I tetti sono decisi: 25 MB per
   file, 10 per orma. Al decimo il «+» non compare più. */
function doPiuFile(dove){
  if(doFile.length >= 10) return;
  var b = doEl("span", "ff pi", "+ aggiungi");
  b.onclick = function(){
    var i = document.createElement("input");
    i.type = "file";
    i.onchange = async function(){
      var f = i.files && i.files[0];
      if(!f) return;
      if(f.size > 25 * 1024 * 1024){
        alert("Il file non pu\u00f2 superare i 25 MB."); return;
      }
      b.textContent = "un momento\u2026";
      try{
        var su = await db.storage.from("riservato")
          .upload(doId + "/" + f.name, f);
        if(su.error) throw su.error;
        await db.from("orma_file").insert({
          orma_id: doId, nome: f.name, tipo: f.type,
          indirizzo: doId + "/" + f.name
        });
        await ormaDentro(doBox, doId);
      }catch(e){
        b.textContent = "+ aggiungi";
        console.warn("allegato:", e);
      }
    };
    i.click();
  };
  dove.appendChild(b);
}

/* ⭐ CHIAMARE QUALCUNO: nasce una riga in attesa, e chi è chiamato
   non è dentro finché non risponde. ⛔ Chi non è ancora un account
   non si può chiamare: prima passa dall'invito. */
async function doChiama(){
  try{
    var u = await db.auth.getUser();
    var id = u && u.data && u.data.user && u.data.user.id;
    var r = await db.from("contatti")
      .select("nome,persona_id").eq("proprietario_id", id)
      .not("persona_id", "is", null).order("nome");
    var chi = r.error ? [] : (r.data || []);
    if(!chi.length){
      alert("Nella tua rubrica non c\u2019\u00e8 ancora nessuno con un account. " +
        "Prima passa dall\u2019invito.");
      return;
    }
    var el = chi.map(function(c, n){ return (n+1) + " \u00b7 " + c.nome; }).join("\n");
    var sc = prompt("Chi chiami?\n\n" + el);
    if(sc === null) return;
    var n = parseInt(sc, 10) - 1;
    if(isNaN(n) || !chi[n]) return;
    await db.rpc("fm_chiama_orma", { p_orma: doId, p_persona: chi[n].persona_id });
    await ormaDentro(doBox, doId);
  }catch(e){ console.warn("chiamare:", e); }
}

/* ── la testa ───────────────────────────────────────────────────── */
function doTesta(box){
  var o = doOrma;
  var capo = doEl("div", "capo");
  var sg = doEl("span", "segno");
  sg.style.color = EL_DO[o.elemento] || EL_DO.terra;
  sg.innerHTML = '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor"' +
    ' stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">' +
    '<circle cx="24" cy="24" r="21"/><circle cx="24" cy="24" r="8"/>' +
    '<path d="M24 3v13M24 32v13M3 24h13M32 24h13"/></svg>';
  capo.appendChild(sg);
  var tx = doEl("div", "tx");
  tx.appendChild(doEl("div", "occ",
    "Un\u2019orma" + (o.destinazione ? " \u00b7 " + o.destinazione : "")));
  var h = doEl("h1");
  h.textContent = o.titolo || o.contenuto || "";
  tx.appendChild(h);
  capo.appendChild(tx);
  box.appendChild(capo);

  /* i dati: quando, dove, chi, scadenza, allegati */
  var dt = doEl("div", "dati");
  function dato(et, vl){
    var s = doEl("span");
    s.appendChild(doEl("span", "et", et));
    var v = doEl("span", "vl"); v.textContent = vl;
    s.appendChild(v); dt.appendChild(s);
  }
  if(o.accaduto_il || o.luogo){
    if(o.accaduto_il) dato("Quando", doData(o.accaduto_il, true));
    if(o.luogo) dato("Dove", o.luogo);
  }
  /* ⭐ i volti: chi c'è dentro, chi è in attesa, e il gesto per chiamare */
  var sv = doEl("span");
  sv.appendChild(doEl("span", "et", "Chi c\u2019\u00e8 dentro"));
  var vl = doEl("span", "vl volti");
  var veri = doDentro.filter(function(x){ return x.preso_il; });
  var attesa = doDentro.filter(function(x){ return !x.preso_il && !x.deciso_il; });
  veri.slice(0, 3).forEach(function(x){
    var v = doEl("span", "vo", doIniz(x.nome));
    v.style.setProperty("--c", EL_DO[o.elemento] || EL_DO.terra);
    vl.appendChild(v);
  });
  if(veri.length > 3)
    vl.appendChild(doEl("span", "vo piu", "+" + (veri.length - 3)));
  /* ⚠️ chi è chiamato non è dentro finché non risponde */
  attesa.forEach(function(x){
    var v = doEl("span", "vo attesa", doIniz(x.nome));
    v.title = "in attesa di risposta";
    vl.appendChild(v);
  });
  var chm = doEl("span", "chiamato");
  var pg = doEl("button", "vo piu-g", "+");
  pg.type = "button";
  pg.setAttribute("aria-label", "aggiungi persone all\u2019orma");
  pg.onclick = doChiama;
  chm.appendChild(pg);
  chm.appendChild(doEl("i", null, "aggiungi persone all\u2019orma"));
  vl.appendChild(chm);
  sv.appendChild(vl);
  dt.appendChild(sv);
  if(o.entro_il) dato("Scadenza", "entro il " + doData(o.entro_il, true));

  if(doFile.length){
    var s2 = doEl("span");
    s2.appendChild(doEl("span", "et", "File allegati"));
    var fl = doEl("span", "fl");
    doFile.forEach(function(f){
      var a = doEl("span", "ff");
      a.textContent = f.nome || "file";
      a.style.cursor = "pointer";
      a.onclick = async function(){
        try{
          var u = await db.storage.from("riservato")
            .createSignedUrl(f.indirizzo, 3600);
          if(u.data && u.data.signedUrl) window.open(u.data.signedUrl, "_blank");
        }catch(e){ console.warn("allegato:", e); }
      };
      fl.appendChild(a);
    });
    doPiuFile(fl);
    s2.appendChild(fl); dt.appendChild(s2);
  }else{
    var s3 = doEl("span");
    s3.appendChild(doEl("span", "et", "File allegati"));
    var fl2 = doEl("span", "fl");
    doPiuFile(fl2);
    s3.appendChild(fl2); dt.appendChild(s3);
  }
  if(dt.children.length) box.appendChild(dt);

  var st = doEl("div", "stadio");
  st.style.setProperty("--c", EL_DO[o.elemento] || EL_DO.terra);
  st.innerHTML = "<i></i>";
  st.appendChild(document.createTextNode(doStadio(o.stadio)));
  box.appendChild(st);

  if(o.contenuto && o.titolo){
    var t = doEl("div", "testo");
    t.textContent = o.contenuto;
    box.appendChild(t);
  }
}

/* ── le figlie ──────────────────────────────────────────────────── */
function doFiglieSez(box){
  var s = doEl("div", "sez");
  s.appendChild(doEl("b", null, "Quello che ne \u00e8 nato"));
  if(doFiglie.length)
    s.appendChild(doEl("span", null,
      doFiglie.length + " \u00b7 in ordine di tempo"));
  box.appendChild(s);

  doFiglie.forEach(function(f){
    var d = doEl("div", "figlia");
    d.style.setProperty("--c", EL_DO[f.elemento] || EL_DO.terra);
    d.appendChild(doEl("span", "filo"));
    var tx = doEl("div", "tx");
    var b = doEl("b"); b.textContent = f.titolo || f.contenuto || "";
    tx.appendChild(b);

    var dd = doEl("div", "dd");
    if(f.entro_il){
      var e1 = doEl("span");
      e1.innerHTML = "<i>scadenza</i>";
      e1.appendChild(document.createTextNode(doData(f.entro_il, true)));
      dd.appendChild(e1);
    }
    if(f.luogo){
      var e2 = doEl("span");
      e2.innerHTML = "<i>dove</i>";
      e2.appendChild(document.createTextNode(f.luogo));
      dd.appendChild(e2);
    }
    if(dd.children.length) tx.appendChild(dd);

    /* ⭐ chi ha preso, quando, e le ore */
    var pr = doEl("div", "presa" + (f.presa && f.presa.length ? "" : " vuota"));
    if(f.presa && f.presa.length){
      f.presa.forEach(function(p, n){
        if(n) pr.appendChild(doEl("span", "sep", "\u00b7"));
        pr.appendChild(doEl("span", "ce", doIniz(p.nome)));
        var chiuso = !!p.chiuso_il;
        pr.appendChild(doEl("span", null,
          (chiuso ? "eseguito da " : "presa da ") + (p.nome || "\u2014")));
        if(p.preso_il || p.chiuso_il){
          pr.appendChild(doEl("span", "sep", "\u00b7"));
          pr.appendChild(doEl("span", null,
            doData(p.chiuso_il || p.preso_il, true)));
        }
        if(p.ore !== null && p.ore !== undefined){
          pr.appendChild(doEl("span", "sep", "\u00b7"));
          pr.appendChild(doEl("span", "ore",
            p.ore + (p.ore === 1 ? " ora" : " ore") + (chiuso ? "" : " finora")));
        }
        if(chiuso){
          pr.appendChild(doEl("span", "sep", "\u00b7"));
          pr.appendChild(doEl("span", "fatta", "\u2713 chiusa"));
        }
      });
    }else{
      pr.appendChild(doEl("span", "ce", "?"));
      pr.appendChild(doEl("span", null, "nessuno l\u2019ha ancora presa"));
    }
    tx.appendChild(pr);
    d.appendChild(tx);

    var st = doEl("span", "st");
    st.textContent = doStadio(f.stadio);
    d.appendChild(st);

    d.onclick = function(){
      if(typeof vai === "function") vai("orma", { id: f.id });
    };
    box.appendChild(d);
  });

  /* ⭐ un'orma nuova nasce da qui */
  var n = doEl("button", "nuova");
  n.type = "button";
  n.innerHTML = '<span class="pi">+</span>';
  n.appendChild(document.createTextNode(
    "Apri un\u2019orma dentro questa"));
  n.onclick = function(){
    if(typeof vai === "function") vai("orma-nuova", { madre: doId });
  };
  box.appendChild(n);
}

/* ── la conversazione ───────────────────────────────────────────── */
function doChatSez(box){
  var s = doEl("div", "sez");
  s.appendChild(doEl("b", null, "La conversazione"));
  s.appendChild(doEl("span", null,
    "gli argomenti della giornata stanno a lato"));
  box.appendChild(s);

  var ch = doEl("div", "chat");
  if(!doChat.length){
    var v = doEl("div", "msg");
    v.innerHTML = '<div class="cn"><p style="color:rgba(245,240,230,.4);' +
      'font-style:italic">Qui compaiono le parole di chi lavora ' +
      'a questa orma.</p></div>';
    ch.appendChild(v);
  }else doChat.forEach(function(m){
    var d = doEl("div", "msg");
    var c = doEl("div", "chi");
    c.textContent = doIniz(m.nome);
    c.style.background = EL_DO[doOrma.elemento] || EL_DO.terra;
    d.appendChild(c);
    var cn = doEl("div", "cn");
    var t = doEl("div", "testa");
    var b = doEl("b"); b.textContent = m.nome || "";
    t.appendChild(b);
    if(m.momento){
      var g = new Date(m.momento);
      var sp = doEl("span");
      sp.textContent = String(g.getHours()).padStart(2,"0") + ":" +
                       String(g.getMinutes()).padStart(2,"0");
      t.appendChild(sp);
    }
    cn.appendChild(t);
    var p = doEl("p"); p.textContent = m.testo || "";
    cn.appendChild(p);
    d.appendChild(cn);
    ch.appendChild(d);
  });

  var sc = doEl("div", "scrivi");
  var i = document.createElement("input");
  i.type = "text";
  i.placeholder = "scrivi, e @ per chiamare qualcuno";
  sc.appendChild(i);
  var b2 = doEl("button", null, "\u2191");
  b2.type = "button";
  b2.onclick = async function(){
    var t = i.value.trim();
    if(!t) return;
    i.value = "";
    try{
      await db.from("orma_messaggi").insert({ orma_id: doId, testo: t });
      await ormaDentro(doBox, doId);
    }catch(e){ console.warn("chat:", e); }
  };
  i.onkeydown = function(e){ if(e.key === "Enter") b2.onclick(); };
  sc.appendChild(b2);
  ch.appendChild(sc);
  box.appendChild(ch);
  /* ⭐ la conversazione resta anche da soli: sono le note del lavoro,
     e chi arriva dopo le trova. */
  var soli = doDentro.filter(function(x){ return x.preso_il; }).length < 2;
  box.appendChild(doEl("div", "nota", soli
    ? "Qui lo spazio delle tue note, con le tematiche aggiornate " +
      "in automatico."
    : "Gli argomenti si aprono da s\u00e9, mentre parlate. Li ritrovi a lato " +
      "quando ti servono, e se un titolo non torna lo tocchi e lo cambi."));
}

/* ── i gesti in fondo ───────────────────────────────────────────── */
function doGesti(box){
  var mio = doDentro.filter(function(x){ return x.persona_id === doIo; })[0];
  var g = doEl("div", "gesti");

  if(!mio){
    var p = doEl("button", null, "la prendo");
    p.type = "button";
    p.onclick = function(){ doPrendi(doId, p); };
    g.appendChild(p);
  }else{
    if(!mio.chiuso_il){
      var c = doEl("button", null, "l\u2019ho finita");
      c.type = "button";
      c.onclick = function(){ doChiudi(doId); };
      g.appendChild(c);
      var l = doEl("button", null, "la lascio");
      l.type = "button";
      l.onclick = function(){ doLascia(doId, l); };
      g.appendChild(l);
    }
  }
  if(g.children.length) box.appendChild(g);
}

/* ── il disegno ─────────────────────────────────────────────────── */
function doDisegna(){
  var box = doBox;
  if(!box) return;
  box.className = "fm-do";
  box.innerHTML = "";
  var f = doEl("div", "f");

  if(!doOrma){
    f.appendChild(doEl("div", "testo",
      "<em>Questa orma non c\u2019\u00e8, o non \u00e8 tua.</em>"));
    box.appendChild(f);
    return;
  }

  var t = doEl("div", "occ");
  t.style.cssText = "cursor:pointer;margin-bottom:1rem";
  t.textContent = "\u2190 la mia orma";
  t.onclick = function(){ if(typeof vai === "function") vai("orme"); };
  f.appendChild(t);

  doTesta(f);
  doFiglieSez(f);
  doChatSez(f);
  doGesti(f);
  /* ⭐ la riga che pubblica: sotto tutto, e solo a chi ha il vaglio.
     ⚠️ Il riquadro nasce subito, e la vetrina si disegna dentro
        quando il vaglio ha risposto: così querySelector trova. */
  var pb = doEl("div");
  f.appendChild(pb);

  var pie = doEl("div", "pie");
  pie.textContent = "Comunit\u00e0 Eterna FelicitasMundi \u00b7 " +
    "Felicitas Omnia S.r.l.s. \u00b7 P.IVA 03075740906";
  f.appendChild(pie);
  box.appendChild(f);
  doPubblica(pb);
}

/* ═══════════════════════════════════════════════════════════════
   LA VETRINA — «questo lavoro può uscire».

   ⛔ Presa da `vetrina.html` TALE E QUALE: nessun nome rinominato,
      nessuna riga riscritta. Sta dentro un involucro suo, così i
      suoi nomi non si scontrano con quelli dell'orma.

   ⛔ IL LIBRO NON È UN TIPO A SÉ: è un prodotto, e «libri e
      stampati» c'è già.
   ⛔ LA STAMPA non si pubblica: si stampa. Tasto verde, parola
      diversa.
   ⚠️ IL VAGLIO VIENE PRIMA: a chi non l'ha passato la riga non
      compare, e al suo posto c'è l'invito a chiederlo.
   ═══════════════════════════════════════════════════════════════ */

var fmVetrina = (function(){
  "use strict";
var TIPI = [
  { k:"prodotto",   c:"--acqua", dove:"Emporio",    gesto:"pubblica in Emporio" },
  { k:"lezione",    c:"--etere", dove:"Scuola",     gesto:"pubblica nella Scuola" },
  { k:"assistenza", c:"--fuoco", dove:"Assistenza", gesto:"pubblica in Assistenza" },
  { k:"stampa",     c:"--verde", dove:"Edizione",   gesto:"stampa" },
  /* \u26d4 VICINATI \u00e8 diverso dagli altri: non si vende niente.
     Dentro ci sono tre cose \u2014 chi chiede una mano, cosa succede
     e quando, dove sta un luogo. */
  { k:"vicinato",   c:"--terra", dove:"Vicinati",   gesto:"metti nel vicinato" }
];

/* \u2b50 le quattro forme del vicinato */
var VIC = [
  { k:"karma yoga", i:"chiedo, o do" },
  { k:"festa",      i:"quando, e dove" },
  { k:"luogo",      i:"un posto che accoglie" },
  { k:"mercato",    i:"dove, ogni quanto, cosa si scambia" }
];

var CAT = [
  ["alimenti","5%"],["rimedi","8%"],["cosmesi","10%"],
  ["oggettistica","10%"],["abbigliamento","10%"],["arredo","10%"],
  ["oggetti sacri","10%"],["libri e stampati","15%"],["digitale","20%"]
];

var STAMPA_HTML = "<button type=\"button\" class=\"qd\" data-f=\"0\"><svg viewBox=\"0 0 60 60\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.3\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M17 13 L43 13 L43 44 L17 44Z\" opacity=\".9\"/> <path d=\"M23 22 L37 22 M23 29 L37 29 M23 36 L32 36\" opacity=\".45\"/> <path d=\"M30 13 L30 8\" opacity=\".6\"/> <circle cx=\"30\" cy=\"7\" r=\"2.2\"/> <path d=\"M43 44 C41 48 38 51 34 52 L26 52 C22 51 19 48 17 44\" opacity=\".5\"/> <path d=\"M11 52 L49 52\" opacity=\".3\"/></svg><b>Carta stampata</b><i>volantini, manifesti</i></button><button type=\"button\" class=\"qd\" data-f=\"1\"><svg viewBox=\"0 0 60 60\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.3\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M9 40 C14 37 26 37 31 40 C36 37 48 37 53 40\"/> <path d=\"M9 40 L9 48 C14 45 26 45 31 48 C36 45 48 45 53 48 L53 40\" opacity=\".8\"/> <path d=\"M31 40 L31 48\" opacity=\".55\"/> <path d=\"M40 33 C43 25 45 15 44 8 C41 13 38 23 37 32\"/> <path d=\"M44 8 C46 11 46 15 44 18\" opacity=\".55\"/> <path d=\"M37 32 L34 36\"/> <path d=\"M15 43 C18 42 24 42 27 43\" opacity=\".35\"/></svg><b>Libri e cataloghi</b><i>brossura, copertina</i></button><button type=\"button\" class=\"qd\" data-f=\"2\"><svg viewBox=\"0 0 60 60\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.3\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"30\" cy=\"30\" r=\"21\" opacity=\".55\"/> <circle cx=\"30\" cy=\"30\" r=\"14\" opacity=\".28\"/> <circle cx=\"30\" cy=\"9\" r=\"3\" fill=\"currentColor\" stroke=\"none\"/> <path d=\"M51 30 A3 3 0 0 0 45 30 A3 3 0 0 0 51 30\" opacity=\".85\"/> <path d=\"M30 51 A3 3 0 0 1 30 45 A3 3 0 0 1 30 51\" fill=\"currentColor\" stroke=\"none\" opacity=\".5\"/> <circle cx=\"9\" cy=\"30\" r=\"3\" opacity=\".85\"/> <path d=\"M30 16 L30 30 L38 35\"/> <g opacity=\".3\"><path d=\"M45 15 L41 19 M15 45 L19 41 M45 45 L41 41 M15 15 L19 19\"/></g></svg><b>Agende e calendari</b><i>planner, da parete</i></button><button type=\"button\" class=\"qd\" data-f=\"3\"><svg viewBox=\"0 0 60 60\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.3\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M19 52 L19 8\"/> <path d=\"M19 10 C27 7 37 13 45 10 L45 30 C37 33 27 27 19 30Z\"/> <path d=\"M19 20 C27 17 37 23 45 20\" opacity=\".4\"/> <path d=\"M19 6 C17 4 17 1 19 -1 C21 1 21 4 19 6Z\"/> <path d=\"M11 55 C14 51 24 51 27 55\" opacity=\".55\"/> <path d=\"M33 48 L33 30\" opacity=\".3\"/> <path d=\"M28 52 C31 49 36 49 39 52\" opacity=\".25\"/></svg><b>Esposizione e fiere</b><i>totem, banner</i></button><button type=\"button\" class=\"qd\" data-f=\"4\"><svg viewBox=\"0 0 60 60\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.3\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M23 18 C15 24 13 35 18 44 C22 50 38 50 42 44 C47 35 45 24 37 18\"/> <path d=\"M23 18 L37 18\"/> <path d=\"M25 18 L25 13 C25 11 35 11 35 13 L35 18\"/> <path d=\"M25 14 C21 15 18 19 19 23\" opacity=\".6\"/> <path d=\"M35 14 C39 15 42 19 41 23\" opacity=\".6\"/> <path d=\"M30 11 C27 8 27 4 30 1 C33 4 33 8 30 11Z\" opacity=\".75\"/> <path d=\"M20 36 C25 33 35 33 40 36\" opacity=\".38\"/> <path d=\"M22 52 L38 52\" opacity=\".3\"/></svg><b>Confezioni e imballaggi</b><i>scatole, etichette</i></button><button type=\"button\" class=\"qd\" data-f=\"5\"><svg viewBox=\"0 0 60 60\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.3\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M11 36 C13 33 18 31 24 32 L36 34 C41 35 45 38 46 42 C46 46 41 48 36 47 L20 45 C14 44 11 41 11 36Z\"/> <path d=\"M17 40 C21 38 27 38 32 40\" opacity=\".35\"/> <path d=\"M30 27 C26 27 22 24 23 20 C25 16 30 19 30 27Z\"/> <path d=\"M30 27 C34 27 38 24 37 20 C35 16 30 19 30 27Z\"/> <circle cx=\"30\" cy=\"18\" r=\"2.4\"/> <path d=\"M30 12 L30 6\" opacity=\".45\"/> <path d=\"M23 13 L20 8 M37 13 L40 8\" opacity=\".3\"/></svg><b>Gadget e regali</b><i>penne, borse</i></button><button type=\"button\" class=\"qd\" data-f=\"6\"><svg viewBox=\"0 0 60 60\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.3\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 8 L12 52 M48 8 L48 52\"/> <path d=\"M9 11 L51 11 M9 49 L51 49\" opacity=\".7\"/> <g opacity=\".55\"><path d=\"M19 11 L19 49 M26 11 L26 49 M34 11 L34 49 M41 11 L41 49\"/></g> <path d=\"M12 24 C19 21 26 27 34 24 C41 21 48 27 48 24\" opacity=\".85\"/> <path d=\"M12 31 C19 34 26 28 34 31 C41 34 48 28 48 31\" opacity=\".85\"/> <path d=\"M12 38 C19 35 26 41 34 38 C41 35 48 41 48 38\" opacity=\".6\"/> <circle cx=\"30\" cy=\"4\" r=\"2.2\" opacity=\".6\"/></svg><b>Abbigliamento</b><i>magliette, felpe</i></button><button type=\"button\" class=\"qd\" data-f=\"7\"><svg viewBox=\"0 0 60 60\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.3\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M15 27 C13 22 14 17 17 15 C20 14 22 17 23 21 L25 27\"/> <path d=\"M25 27 L22 15 C21 12 25 10 27 13 L31 26\"/> <path d=\"M31 26 L30 14 C30 11 34 11 35 14 L37 27\"/> <path d=\"M37 27 L38 19 C39 16 42 17 42 20 L43 33 C43 41 38 46 32 46 L24 46 C18 46 14 41 13 35 C12 31 13 28 15 27Z\"/> <path d=\"M18 52 C23 49 33 49 38 52\" opacity=\".4\"/> <path d=\"M28 34 C31 34 33 36 32 38 C31 40 27 39 27 36 C27 33 32 32 34 35\" opacity=\".7\"/></svg><b>I servizi</b><i>impatto ridotto</i></button>";

var tipo = null, cat = null, fam = null, vic = null;
var dati = { titolo:"", chi:"", racconto:"", prezzo:"", stato:"disponibile",
  spedisce:"io", quando:"", dove:"", quanti:"", incassa:"FelicitasMundi", foto:[] };
/* ⭐ il dove viene dal comune di chi pubblica: non si chiede, si cambia solo se sta altrove */
var COMUNE_MIO = "[ il tuo comune ]";
function dovePost(){ return dati.dovep || COMUNE_MIO; }

function el(t,c,x){ var n=document.createElement(t); if(c) n.className=c;
  if(x!==undefined) n.innerHTML=x; return n; }
function col(){ var t=TIPI.filter(function(x){return x.k===tipo;})[0];
  return t ? "var(" + t.c + ")" : "var(--oro)"; }
function ora(){ return TIPI.filter(function(x){return x.k===tipo;})[0]; }

/* ── i cinque tipi ───────────────────────────────────────────── */
function pil(){
  var d=document.getElementById("pil"); d.innerHTML="";
  TIPI.forEach(function(t){
    var b=el("button"); b.type="button"; b.textContent=t.k;
    b.style.setProperty("--c","var("+t.c+")");
    if(tipo===t.k) b.className="su";
    b.onclick=function(){ tipo=(tipo===t.k?null:t.k); cat=null; fam=null; vic=null;
      dati={titolo:"",chi:"",racconto:"",prezzo:"",stato:"disponibile",
        spedisce:"io",quando:"",dove:"",quanti:"",incassa:"FelicitasMundi",foto:[]};
      disegna(); };
    d.appendChild(b);
  });
}

/* ── a sinistra ──────────────────────────────────────────────── */
/* \u2b50 IL RACCONTO \u2014 non una scheda tecnica: le parole con cui
   uno dice alla comunit\u00e0 cos\u2019\u00e8 quello che ha fatto. */
function racconto(){
  var d=el("div","lungo");
  d.appendChild(el("div","et2","raccontalo alla comunit\u00e0"));
  var t=document.createElement("textarea");
  t.placeholder="[ le parole del cuore ]";
  t.maxLength=400; t.value=dati.racconto||"";
  t.oninput=function(){ dati.racconto=t.value;
    d.querySelector(".cnt").textContent=t.value.length+"/400"; vetrina(); };
  d.appendChild(t);
  d.appendChild(el("div","cnt",(dati.racconto||"").length+"/400"));
  return d;
}
function campo(et, chiave, posto, unita){
  var d=el("div","campo");
  d.appendChild(el("span",null,et));
  var i=document.createElement("input");
  i.type="text"; i.placeholder=posto; i.value=dati[chiave]||"";
  i.oninput=function(){ dati[chiave]=i.value; vetrina(); };
  d.appendChild(i);
  if(unita) d.appendChild(el("span","un",unita));
  return d;
}
function scelte(et, chiave, voci){
  var w=document.createElement("div");
  w.appendChild(el("div","et2",et));
  var s=el("div","scelte");
  voci.forEach(function(v){
    var b=el("button"); b.type="button"; b.textContent=v;
    b.style.setProperty("--c",col());
    if(dati[chiave]===v) b.className="su";
    b.onclick=function(){ dati[chiave]=v; disegna(); };
    s.appendChild(b);
  });
  w.appendChild(s); return w;
}

function sinistra(){
  var d=document.getElementById("sx"); d.innerHTML="";
  if(!tipo){ d.appendChild(el("div","vuoto","Tocca cosa stai facendo uscire."));
    return; }
  d.appendChild(el("div","et","lo impagini"));

  /* i quadranti: le categorie per il prodotto, le famiglie per la stampa */
  if(tipo==="prodotto"){
    var q=el("div","quad");
    CAT.forEach(function(c,i){
      var b=el("button","qd"+(cat===i?" su":"")); b.type="button";
      b.style.setProperty("--c",col());
      b.appendChild(el("b",null,c[0]));
      b.appendChild(el("span","pc","a FelicitasMundi "+c[1]));
      b.onclick=function(){ cat=(cat===i?null:i); disegna(); };
      q.appendChild(b);
    });
    d.appendChild(q);
    if(cat===null) return;
  }
  if(tipo==="vicinato"){
    var qv=el("div","quad"); qv.style.gridTemplateColumns="repeat(4,1fr)";
    VIC.forEach(function(v,i){
      var b=el("button","qd"+(vic===i?" su":"")); b.type="button";
      b.style.setProperty("--c",col());
      b.appendChild(el("b",null,v.k));
      b.appendChild(el("i",null,v.i));
      b.onclick=function(){ vic=(vic===i?null:i); disegna(); };
      qv.appendChild(b);
    });
    d.appendChild(qv);
    if(vic===null) return;
  }
  if(tipo==="stampa"){
    var q2=el("div","quad",STAMPA_HTML);
    q2.style.gridTemplateColumns="repeat(4,1fr)";
    q2.querySelectorAll(".qd").forEach(function(b,i){
      b.style.setProperty("--c",col());
      if(fam===i) b.classList.add("su");
      b.onclick=function(){ fam=(fam===i?null:i); disegna(); };
    });
    d.appendChild(q2);
    if(fam===null) return;
  }

  d.appendChild(campo("il titolo","titolo","[ come si chiama ]"));

  /* \u2b50 la galleria: la prima si vede in elenco, le altre nella scheda */
  var f=el("div","foto gal");
  (dati.foto=dati.foto||[]).forEach(function(x,i){
    var m=el("span","mini"+(i===0?" prima":""),i===0?"in elenco":"");
    m.style.backgroundImage="url("+x+")";
    m.title="togli"; m.onclick=function(e){e.stopPropagation();dati.foto.splice(i,1);disegna();};
    f.appendChild(m);
  });
  f.appendChild(el("span","qq","+"));
  f.appendChild(el("span",null,"<b>"+((dati.foto||[]).length?"un\u2019altra foto":"le foto")+"</b><i>"+((dati.foto||[]).length?(dati.foto||[]).length+" \u00b7 la prima si vede in elenco":"dagli allegati dell\u2019orma, o ne aggiungi")+"</i>"));
  f.onclick=function(){ document.getElementById("fotoin").click(); };
  var fin=document.createElement("input"); fin.type="file"; fin.id="fotoin"; fin.accept="image/*"; fin.hidden=true;
  fin.onchange=function(){ var x=this.files&&this.files[0]; if(!x) return; dati.foto.push(URL.createObjectURL(x)); this.value=""; disegna(); };
  f.appendChild(fin);
  d.appendChild(f);

  d.appendChild(campo("chi lo fa","chi","[ il nome della squadra ]"));
  if(tipo!=="vicinato" && tipo!=="stampa"){
    /* \u2b50 il dove: dal comune di chi pubblica, si cambia solo se sta altrove */
    d.appendChild(campo("dove sta","dovep",COMUNE_MIO));
    /* \u2b50 chi incassa: chi pubblica, chi fa e chi incassa non sono sempre la stessa persona */
    d.appendChild(scelte("chi incassa","incassa",["FelicitasMundi","il produttore","nessuno"]));
  }
  d.appendChild(racconto());
  d.appendChild(legami());

  if(tipo==="vicinato"){
    /* \u2b50 il karma yoga chiede quante persone, la festa quando,
       il luogo dove. Non tutti hanno gli stessi campi. */
    if(vic===0){
      d.appendChild(scelte("verso","verso",["chiedo","do"]));
      if((dati.verso||"chiedo")==="chiedo"){
        d.appendChild(campo("entro quando","quando","[ la scadenza ]"));
        d.appendChild(campo("quante persone","quanti","[ quante ne servono ]"));
      }else{
        d.appendChild(campo("fino a quando","quando","[ fino a quando ]"));
        d.appendChild(campo("cosa do","quanti","[ tempo, ospitalit\u00e0, trasporti, alimenti, rimedi, ascolto ]"));
      }
    }
    if(vic===1){
      d.appendChild(campo("quando","quando","[ il giorno e l\u2019ora ]"));
      d.appendChild(campo("dove","dove","[ il luogo ]"));
    }
    if(vic===2){
      d.appendChild(campo("dove","dove","[ l\u2019indirizzo ]"));
      d.appendChild(scelte("cosa offre","stato",
        ["ospitalit\u00e0","laboratori","un banco","incontri"]));
    }
  }
  else if(tipo!=="stampa"){
    d.appendChild(campo("quanto costa","prezzo","0","\u20ac + IVA"));
    var c=ora(), q=(cat!==null?CAT[cat][1]:"\u2014");
    var cn=el("div","conto");
    cn.appendChild(el("span",null,"la quota per FelicitasMundi"));
    cn.appendChild(el("b",null,q));
    d.appendChild(cn);
    d.appendChild(scelte("com\u2019\u00e8","stato",
      ["disponibile","su ordinazione","esaurito"]));
    d.appendChild(scelte("il trasporto","spedisce",
      ["me ne occupo io","la fate voi"]));
    d.appendChild(campo("costo del trasporto","trasporto","[ quanto ]","€"));
  }else{
    d.appendChild(campo("quante copie","prezzo","[ fra quelle possibili ]"));
    d.appendChild(scelte("la consegna","stato",
      ["standard","espresso","domani","in giornata"]));
  }

  var t=ora();
  var b=el("button","esce"); b.type="button"; b.textContent=t.gesto;
  b.style.setProperty("--c",col());
  d.appendChild(b);
}

/* ── a destra: la vetrina ────────────────────────────────────── */
function vetrina(){
  var d=document.getElementById("dx"); d.innerHTML="";
  if(!tipo){ return; }
  var t=ora();
  d.appendChild(el("div","et","cos\u00ec esce in " + t.dove));

  var v=el("div","vetrina");
  v.style.setProperty("--c",col());
  v.appendChild(el("div","cap", t.dove + " \u00b7 " +
    (cat!==null ? CAT[cat][0] :
     tipo==="stampa" ? "stampa" : tipo)));
  var im=el("div","im", (dati.foto||[]).length ? "" : "la foto");
  if((dati.foto||[]).length){ im.style.backgroundImage="url("+dati.foto[0]+")"; im.style.backgroundSize="cover"; im.style.backgroundPosition="center"; }
  v.appendChild(im);
  if((dati.foto||[]).length>1){
    var ga=el("div","gal2");
    (dati.foto||[]).slice(1).forEach(function(x){ var s=el("span"); s.style.backgroundImage="url("+x+")"; ga.appendChild(s); });
    v.appendChild(ga);
  }

  var dt=el("div","dt");
  var h3=el("h3", dati.titolo ? null : "no",
    dati.titolo || "[ il titolo ]");
  dt.appendChild(h3);
  dt.appendChild(el("div","chi", dati.chi || "[ chi lo fa ]"));
  if(tipo!=="vicinato" && tipo!=="stampa"){
    dt.appendChild(el("div","dove2", dovePost()));
    dt.appendChild(el("div","inc", (dati.incassa||"FelicitasMundi")==="nessuno" ? "non si compra: ci si scrive" : "incassa " + (dati.incassa||"FelicitasMundi")));
  }

  if(dati.racconto)
    dt.appendChild(el("div","rac", dati.racconto));
  else
    dt.appendChild(el("div","rac no","[ le parole del cuore ]"));
  legamiVetrina(dt);

  if(tipo==="vicinato"){
    if(dati.quando) dt.appendChild(el("div","qd2",
      (vic===0 ? "entro " : "") + dati.quando));
    if(dati.dove) dt.appendChild(el("div","qd2","\u25cf " + dati.dove));
    if(vic===0){
      if((dati.verso||"chiedo")==="chiedo"){
        dt.appendChild(el("span","st mezzo",
          (dati.quanti ? "0 su " + dati.quanti : "nessuno ancora")));
        dt.appendChild(el("button","comp","lo prendo"));
      }else{
        if(dati.quanti) dt.appendChild(el("div","qd2", dati.quanti));
        dt.appendChild(el("button","comp","[ segnaposto ]"));
      }
    }
    if(vic===1) dt.appendChild(el("button","comp","ci sar\u00f2"));
    if(vic===2){
      dt.appendChild(el("span","st", dati.stato));
      dt.appendChild(el("button","comp","scrivi a chi lo tiene"));
    }
    if(vic===3){
      if(dati.stato) dt.appendChild(el("div","qd2", dati.stato));
      dt.appendChild(el("button","comp","[ segnaposto ]"));
    }
  }
  else if(tipo!=="stampa" && (dati.incassa||"FelicitasMundi")==="nessuno"){
    dt.appendChild(el("button","comp","scrivi"));
  }
  else if(tipo!=="stampa"){
    var pz=el("div","pz");
    pz.appendChild(el("b", dati.prezzo ? null : "no",
      dati.prezzo ? dati.prezzo + " \u20ac" : "\u2014 \u20ac"));
    pz.appendChild(el("span",null,"IVA inclusa"));
    dt.appendChild(pz);
    var cl = dati.stato==="disponibile" ? "" :
             dati.stato==="esaurito" ? " giu" : " mezzo";
    dt.appendChild(el("span","st"+cl, dati.stato));
    dt.appendChild(el("div","sp","Trasporto " + (dati.trasporto ? dati.trasporto + " €" : "[ quanto ] €")
      + (dati.spedisce==="me ne occupo io" ? " · a cura di chi lo fa" : " · a cura di FelicitasMundi")));
    /* \u2b50 il gesto segue chi incassa: «vendi» → il carrello; «scrivi» → la posta a chi lo tiene */
    dt.appendChild(el("button","comp", (dati.incassa||"FelicitasMundi")==="nessuno" ? "scrivi" : "vendi"));
  }else{
    dt.appendChild(el("div","sp","Va in stampa: non compare in nessuna vetrina. " +
      "L\u2019ordine resta dentro questa orma."));
  }
  v.appendChild(dt);
  d.appendChild(v);
}

/* ⭐ LEGATO A — tavola unica dei legami (da_tipo, da_id, a_tipo, a_id, relazione).
   Un legame solo, si legge da tutte e due le parti. Le orme non sono sorgente
   ma possono essere bersaglio. Lega solo chi ha pubblicato una delle due cose:
   qui la vetrina è la propria, quindi si può. */
var LEG_C = { prodotto:"--acqua", ricerca:"--aria", proposta:"--aria", lezione:"--etere", assistenza:"--fuoco", stampa:"--aria", orma:"--terra" };
var LEG_REL = ["nasce da","racconta","serve a","accompagna"];
var STANZE_L = [["vicinati","Vicinati","--terra"],["emporio","Emporio","--acqua"],["assistenza","Assistenza","--fuoco"],["edizione","Edizione","--aria"],["scuola","Scuola","--etere"]];
/* la vista unica sopra le tavole delle cose pubblicate — qui d'esempio */
var PUBBLICATE = [
  {tipo:"ricerca", id:"r1", titolo:"[ una ricerca sulle api ]", st:"edizione", chi:"[ chi ]"},
  {tipo:"proposta", id:"p1", titolo:"[ una proposta dell’Edizione ]", st:"edizione", chi:"[ chi ]"},
  {tipo:"prodotto", id:"m1", titolo:"[ un prodotto dell’Emporio ]", st:"emporio", chi:"[ chi ]"},
  {tipo:"prodotto", id:"m2", titolo:"[ un altro prodotto ]", st:"emporio", chi:"[ chi ]"},
  {tipo:"lezione", id:"l1", titolo:"[ una lezione della Scuola ]", st:"scuola", chi:"[ chi ]"},
  {tipo:"assistenza", id:"a1", titolo:"[ un’assistenza ]", st:"assistenza", chi:"[ chi ]"},
  {tipo:"orma", id:"o1", titolo:"[ un’orma dei Vicinati ]", st:"vicinati", chi:"[ chi ]"},
  {tipo:"orma", id:"o2", titolo:"[ un’altra orma ]", st:"vicinati", chi:"[ chi ]"}
];
var leg = { aperto:false, st:null, q:"", rel:"nasce da", lista:[] };
function nomeStanza(k){ for(var i=0;i<STANZE_L.length;i++) if(STANZE_L[i][0]===k) return STANZE_L[i][1]; return k; }

function legami(){
  var w=document.createElement("div");
  w.appendChild(el("div","et2","legato a"));
  leg.lista.forEach(function(L,i){
    var r=el("div","leg"); r.style.setProperty("--c","var("+(LEG_C[L.tipo]||"--oro")+")");
    r.appendChild(el("span","lt",L.tipo));
    r.appendChild(el("span","ln","<b>"+L.titolo+"</b><i>"+L.rel+" · "+nomeStanza(L.st)+" · "+L.chi+"</i>"));
    var x=el("button","lx","×"); x.type="button"; x.setAttribute("aria-label","togli il legame");
    x.onclick=function(){ leg.lista.splice(i,1); disegna(); };
    r.appendChild(x); w.appendChild(r);
  });
  if(!leg.aperto){
    var b=el("button","legpiu","+ collega a una cosa già pubblicata"); b.type="button";
    b.onclick=function(){ leg.aperto=true; disegna(); };
    w.appendChild(b); return w;
  }
  var c=el("div","legc");
  var s=el("div","scelte");
  STANZE_L.forEach(function(z){
    var b=el("button",leg.st===z[0]?"su":""); b.type="button"; b.textContent=z[1];
    b.style.setProperty("--c","var("+z[2]+")");
    b.onclick=function(){ leg.st=z[0]; leg.q=""; disegna(); var i=document.getElementById("legq"); if(i) i.focus(); };
    s.appendChild(b);
  });
  c.appendChild(s);
  var cp=el("div","campo"); cp.appendChild(el("span",null,"cerca"));
  var i=document.createElement("input"); i.type="text"; i.id="legq";
  i.placeholder = leg.st ? "[ il titolo, o chi l’ha pubblicato ]" : "prima la stanza";
  i.disabled=!leg.st; i.value=leg.q;
  i.oninput=function(){ leg.q=i.value; var e=document.getElementById("legesiti"); if(e){ e.innerHTML=""; legEsiti(e); } };
  cp.appendChild(i); c.appendChild(cp);
  var rr=el("div","scelte legrel");
  LEG_REL.forEach(function(r){
    var b=el("button",leg.rel===r?"su":""); b.type="button"; b.textContent=r;
    b.style.setProperty("--c",col()); b.onclick=function(){ leg.rel=r; disegna(); };
    rr.appendChild(b);
  });
  c.appendChild(rr);
  var e=el("div","legesiti"); e.id="legesiti"; legEsiti(e); c.appendChild(e);
  w.appendChild(c); return w;
}
function legEsiti(e){
  if(!leg.st){ e.appendChild(el("div","legn","scegli la stanza, poi cerca fra le sue cose")); return; }
  var q=leg.q.toLowerCase().trim(), gia=leg.lista.map(function(L){return L.id;});
  var hit=PUBBLICATE.filter(function(p){ return p.st===leg.st && gia.indexOf(p.id)<0 && (!q || (p.titolo+" "+p.chi+" "+p.tipo).toLowerCase().indexOf(q)>=0); });
  if(!hit.length){ e.appendChild(el("div","legn","niente in questa stanza"+(q?" per «"+q+"»":""))); return; }
  hit.forEach(function(p){
    var b=el("button","lege"); b.type="button"; b.style.setProperty("--c","var("+(LEG_C[p.tipo]||"--oro")+")");
    b.appendChild(el("span","lt",p.tipo));
    b.appendChild(el("span","ln","<b>"+p.titolo+"</b><i>"+nomeStanza(p.st)+" · "+p.chi+"</i>"));
    b.appendChild(el("span","lf","+"));
    b.onclick=function(){ leg.lista.push({id:p.id,tipo:p.tipo,titolo:p.titolo,st:p.st,chi:p.chi,rel:leg.rel}); leg.aperto=false; leg.q=""; disegna(); };
    e.appendChild(b);
  });
}
/* nella vetrina: sotto il racconto, sopra il prezzo */
function legamiVetrina(dt){
  if(!leg.lista.length) return;
  var w=el("div","vleg"); w.appendChild(el("span","vet","legato a"));
  leg.lista.forEach(function(L){
    var a=el("a","vl"); a.href="#"; a.style.setProperty("--c","var("+(LEG_C[L.tipo]||"--oro")+")");
    a.appendChild(el("span","vt",L.tipo));
    a.appendChild(el("span","vn","<b>"+L.titolo+"</b><i>"+L.rel+" · "+nomeStanza(L.st)+"</i>"));
    a.appendChild(el("span","vf","›"));
    w.appendChild(a);
  });
  dt.appendChild(w);
}

function disegna(){ pil(); sinistra(); vetrina(); }
/* è un esempio: si guarda, non si scrive */


/* ⭐ la riga sotto la conversazione: cambia se si è soli. La conversazione resta comunque: sono le note del lavoro. */
(function(){
  var r = document.getElementById('convRiga'); if(!r) return;
  var persone = document.querySelectorAll('.volti .vo:not(.piu):not(.piu-g)').length;   // chi c'è dentro (oltre a te)
  var soli = persone <= 1;
  r.innerHTML = soli ? r.dataset.soli : r.dataset.insieme;
})();
/* ⭐ gli allegati: 25 MB per file, 10 per orma. A dieci il «+» non compare più. */

  return function(radice, titolo){
    /* ⭐ il titolo dell'orma entra da sé nella vetrina */
    if(titolo) dati.titolo = titolo;
    tipo = null; cat = null; fam = null; vic = null;
    document.getElementById = (function(vero){
      return function(id){
        var n = radice.querySelector("#" + id);
        return n || vero.call(document, id);
      };
    })(document.getElementById);
    disegna();
  };
})();


/* ⛔ chi non ha il vaglio vede questa, non la vetrina */
function doVaglio(box){
  var v = doEl("div", "vag");
  v.appendChild(doEl("b", null,
    "Questo lavoro pu\u00f2 uscire, ma prima serve il vaglio"));
  v.appendChild(doEl("p", null,
    "Il nucleo del ceppo guarda quello che fai e apre la porta. " +
    "Da quel momento questa riga compare in tutte le tue orme."));
  var t = doEl("span", "ts", "chiedi il vaglio");
  t.onclick = function(){ if(typeof vai === "function") vai("anthakarana"); };
  v.appendChild(t);
  box.appendChild(v);
}

async function doPubblica(box){
  /* ⛔ LA VETRINA COMPARE SOLO SE L’ORMA È TUA. Chi entra
     nell’orma di un altro non può pubblicare una cosa sua: chi
     partecipa a un evento sta in un’orma figlia per parlare,
     non per autopubblicarsi. */
  if(!doOrma || !doIo || doOrma.persona_id !== doIo) return;

  var puo = false;
  try{
    var r = await db.rpc("fm_puo_pubblicare");
    puo = !r.error && r.data === true;
  }catch(e){}
  if(!puo){ doVaglio(box); return; }

  var w = doEl("div", "vetr-f");
  w.innerHTML = '<div class="oc">questo lavoro pu\u00f2 uscire</div>' +
    '<div class="sot">A sinistra lo impagini, a destra vedi come esce.</div>' +
    '<div class="pil" id="pil"></div>' +
    '<div class="due"><div class="col" id="sx"></div>' +
    '<div class="col" id="dx"></div></div>';
  box.appendChild(w);
  fmVetrina(w, doOrma && doOrma.titolo);
  /* \u26d4 i tasti dei campi non escono dalla vetrina */
  w.addEventListener("input", function(e){ e.stopPropagation(); }, true);
}

async function ormaDentro(dove, id){
  var box = typeof dove === "string" ? document.querySelector(dove) : dove;
  if(!box) return;
  doVeste();
  doBox = box; doId = id;
  var d = await doLeggi(id);
  doOrma = d.orma; doDentro = d.dentro; doFiglie = d.figlie;
  doFile = d.file; doChat = d.chat; doIo = d.io;
  doDisegna();
}

window.SpazioVivo = window.SpazioVivo || {};
window.SpazioVivo.ormaDentro = ormaDentro;
