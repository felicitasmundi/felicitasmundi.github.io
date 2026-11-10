/* ═══════════════════════════════════════════════════════════════
   FELICITASMUNDI · LA RIGA DELLE STANZE · comune/fm-riga.js
   Gab, 12 ottobre 2026 (20:25): «a me piace l'idea di non aver la barra laterale e
   mostrare direttamente in alto di ogni pagina la riga con emporio mutuo aiuto edizione
   scuola, con l'aggiunta dei simboli» · «in questo caso la bacheca è il vicinato, e quindi
   possiamo mettere logo vicinati in quella voce».

   Cinque voci, i cinque solidi della tavola «stanze»:
     cubo → Vicinati (la Bacheca) · icosaedro → Emporio · tetraedro → Mutuo aiuto ·
     ottaedro → Edizione · dodecaedro → Scuola.
   Niente ☰, niente barra laterale. A destra la foto: i miei dati.

   In una pagina:  <div id="fm-stanze" data-attiva="emporio"></div>  in cima a .app,
   poi  <script src="comune/fm-riga.js"></script>
   ═══════════════════════════════════════════════════════════════ */
(function () {
  var S = {
    cubo:       '<svg viewBox="0 0 24 24"><path d="M12 3 20 7.5v9L12 21 4 16.5v-9L12 3Z"/><path d="M4 7.5 12 12l8-4.5M12 12v9"/></svg>',
    icosaedro:  '<svg viewBox="0 0 24 24"><path d="M12 2 21 8v8l-9 6-9-6V8l9-6Z"/><path d="M12 2 7 10h10L12 2ZM3 8l4 2M21 8l-4 2M7 10l-4 6M17 10l4 6M7 10l5 12M17 10l-5 12M3 16h18"/></svg>',
    tetraedro:  '<svg viewBox="0 0 24 24"><path d="M12 3 21 19H3L12 3Z"/><path d="M12 3v10M3 19l9-6M21 19l-9-6"/></svg>',
    ottaedro:   '<svg viewBox="0 0 24 24"><path d="M12 2 21 12l-9 10L3 12 12 2Z"/><path d="M3 12h18M12 2 7.5 12 12 22M12 2l4.5 10L12 22"/></svg>',
    stampante:  '<svg viewBox="0 0 24 24"><path d="M7 8V3h10v5"/><rect x="3" y="8" width="18" height="9" rx="2"/><path d="M7 13h10v8H7z"/><path d="M17 11h1"/></svg>',
    dodecaedro: '<svg viewBox="0 0 24 24"><path d="M12 2.5 21 9l-3.4 10.5H6.4L3 9l9-6.5Z"/><path d="M12 8.5 16 11.5l-1.5 4.5h-5L8 11.5l4-3Z"/><path d="M12 2.5v6M21 9l-5 2.5M3 9l5 2.5M6.4 19.5l3.1-3.5M17.6 19.5l-3.1-3.5"/></svg>',
    /* 13 ott, Gab: «sistemiamo un loghetto per accedere ai piani» — il seme: un cerchio con il punto, apre «Come funziona» */
    seme:       '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="2.2" fill="currentColor" stroke="none"/><path d="M12 3.5v3M12 17.5v3M3.5 12h3M17.5 12h3"/></svg>'
  };
  /* 20:38, Gab: in alto Emporio · Mutuo aiuto · Edizione · Scuola, vicini; «come ultimo simbolo a destra scrivi stampa, con la forma
     della stampante», leggermente staccato. Vicinati non sta qui: è la Bacheca, nel piede, col cubo. */
  var VOCI = [
    ["emporio",  "Emporio",     "icosaedro",  "acqua", "stanze-bozza.html?s=emporio"],
    ["mutuo",    "Assistenza comunitaria integrata", "tetraedro",  "fuoco", "stanze-bozza.html?s=mutuo"],
    ["edizione", "Edizione",    "ottaedro",   "aria",  "stanze-bozza.html?s=edizione"],
    ["scuola",   "Scuola",      "dodecaedro", "etere", "stanze-bozza.html?s=scuola"],
    ["stampa",   "Stampa",      "stampante",  "aria",  "stampa-bozza.html"]
  ];
  window.FM_CUBO = S.cubo;
  var css = ".fm-stanze{position:sticky;top:0;z-index:30;background:linear-gradient(180deg,var(--notte) 82%,transparent);padding:10px 10px 6px}" +
    ".fm-stanze .capo{display:flex;align-items:center;justify-content:space-between;padding:0 8px 8px}" +
    ".fm-stanze .capo .marca{font-family:'Cinzel',serif;font-size:12px;letter-spacing:.14em;color:var(--oro)}" +
    ".fm-stanze .capo .io{width:30px;height:30px;border-radius:50%;overflow:hidden;border:1px solid var(--oro);display:block}.fm-stanze .capo .io img{width:100%;height:100%;object-fit:cover}" +
    ".fm-stanze .capo .destra{display:flex;align-items:center;gap:12px}" +
    ".fm-stanze .capo .seme{width:30px;height:30px;border-radius:50%;display:grid;place-items:center;color:var(--oro)}.fm-stanze .capo .seme svg{width:22px;height:22px;fill:none;stroke:currentColor;stroke-width:1.3;stroke-linecap:round}.fm-stanze .capo .seme.on{background:rgba(212,175,106,.14)}" +
    ".fm-stanze .voci{display:flex;gap:2px}.fm-stanze .voci a.staccata{margin-left:6px;flex:0 0 auto;padding-left:10px;padding-right:10px;border-left:1px solid var(--riga);border-radius:0 12px 12px 0}" +
    ".fm-stanze .voci a{flex:1 1 0;display:flex;flex-direction:column;align-items:center;gap:4px;padding:6px 2px 7px;border-radius:12px;color:var(--grigio);text-decoration:none;min-width:0}" +
    ".fm-stanze .voci a svg{width:24px;height:24px;fill:none;stroke:currentColor;stroke-width:1.3;stroke-linejoin:round;stroke-linecap:round}" +
    ".fm-stanze .voci a span{font-family:'Cinzel',serif;font-size:min(9.5px, 2.35vw);letter-spacing:.02em;line-height:1.1;text-align:center;white-space:nowrap;max-width:100%;overflow:hidden;text-overflow:ellipsis}" +
    /* 13 ott 20:12, Gab: «nel telefono i simboli si sovrappongono … aggiusta a livello sistemico»: la scritta si stringe con lo schermo e non esce mai dalla sua casella */
    ".fm-stanze .voci a.on{color:var(--c);background:color-mix(in srgb,var(--c) 14%,transparent)}" +
    ".fm-stanze .voci a:hover{color:var(--c)}" +
    "@media (min-width:700px){.fm-stanze .voci a{flex-direction:row;gap:8px;padding:8px 10px}.fm-stanze .voci a span{font-size:11.5px}}";
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  /* 13 ott: il cosmo dietro tutto — la rete neuronale di Design (fm-cosmo.js), in un livello fisso sotto la pagina */
  try {
    if (!document.querySelector(".fm-cosmo")) {
      var fondo = document.createElement("div"); fondo.className = "fm-cosmo"; fondo.setAttribute("aria-hidden", "true");
      fondo.innerHTML = "<ak-cosmo></ak-cosmo>";
      document.body.insertBefore(fondo, document.body.firstChild);
      if (!(window.customElements && customElements.get("ak-cosmo"))) {
        var sc = document.createElement("script"); sc.src = "fm-cosmo.js?v=10131605"; document.head.appendChild(sc);
      }
    }
  } catch (e) { console.log("cosmo", e); }

  /* 13 ott 20:38, Gab: «se uno si muove dalla pagina chat, finisce la conversazione.. tienila sempre attiva» —
     se nella sala della diretta è rimasto il segno (fm_diretta), la diretta ti segue: comune/fm-diretta.js rientra in sala
     e mette in alto la pillola «● titolo» con play/pausa e microfono. Si carica solo se il segno c'è. */
  function diretta() { try { if (!localStorage.getItem("fm_diretta")) return; if (window.FM_DIRETTA) { window.FM_DIRETTA.avvia(); return; } var sd = document.createElement("script"); sd.src = "comune/fm-diretta.js?v=10150925"; document.head.appendChild(sd); } catch (e) { } }
  diretta();
  /* 21:05: tornando indietro, il navigatore può ridare la pagina dalla sua cache senza rieseguire gli script — si ricontrolla il segno */
  window.addEventListener("pageshow", function (e) { if (e.persisted) diretta(); });

  var box = document.getElementById("fm-stanze"); if (!box) return;
  var attiva = box.getAttribute("data-attiva") || "";
  var foto = box.getAttribute("data-foto") || "../communitas-aeterna/persone/gabriele-dettori.jpg";
  var quiPag = location.pathname.split("/").pop();
  /* 18 ott 22:24 e 22:36, Gab: «può essere interessante creare le pagine interne delle stanze, in modo che sia da oggi che da giornale si possa entrare
     nella visione completa dei prodotti e assistenza» · «stanze da rifare con quella grafica […] le foto e i dati della pagina stanza rimangono uguali,
     si tratta solo di riadattare il design della pagina». Nelle pagine delle stanze: barra in alto «FelicitasMundi» in cosmo e, in basso, il menu dell'app. */
  var APP = /^(stanze-bozza|stampa|servizi|servizio|come-funziona)/.test(quiPag);
  var C = "c=10182300";
  if (APP) {
    var cssA = ".fm-stanze{background:#0A0C1A radial-gradient(120% 140% at 50% 0%,#1a1440 0%,#0d1026 60%,#0A0C1A 100%);border-bottom:1px solid rgba(212,175,106,.25);padding-top:12px}" +
      ".fm-stanze .capo .marca{font-size:15px;letter-spacing:.08em;text-decoration:none}" +
      ".fm-stanze .voci a svg{width:26px;height:26px}.fm-stanze .voci a span{font-size:min(11px,2.7vw)}" +
      ".fm-app{position:fixed;left:0;right:0;bottom:0;z-index:30;display:grid;grid-template-columns:repeat(5,1fr);background:#0A0C1A radial-gradient(120% 140% at 50% 0%,#1a1440 0%,#0d1026 60%,#0A0C1A 100%);border-top:1px solid rgba(212,175,106,.25);padding-bottom:env(safe-area-inset-bottom,0px)}" +
      ".fm-app a{font:600 12.5px 'DM Sans',system-ui,sans-serif;color:#A8A49B;text-decoration:none;padding:11px 1px 13px;display:flex;flex-direction:column;align-items:center;gap:4px}" +
      ".fm-app a .ic{font-size:22px;line-height:1}.fm-app a .ic svg{width:22px;height:22px;display:block}" +
      ".fm-app a.console .ic{background:#D4AF6A;color:#1A1405;width:42px;height:42px;border-radius:50%;display:grid;place-items:center;margin-top:-22px;box-shadow:0 0 0 3px rgba(212,175,106,.18),0 3px 12px rgba(212,175,106,.45)}" +
      "body{padding-bottom:calc(84px + env(safe-area-inset-bottom,0px))}" +
      "@media (min-width:700px){.fm-stanze .capo .marca{font-size:18px}.fm-stanze .voci a svg{width:28px;height:28px}.fm-stanze .voci a span{font-size:13.5px}.fm-app a{font-size:15px;padding:13px 1px 15px}.fm-app a .ic{font-size:28px}.fm-app a.console .ic{width:50px;height:50px;margin-top:-26px}}";
    var sa = document.createElement("style"); sa.textContent = cssA; document.head.appendChild(sa);
  }
  var h = '<div class="capo"><a class="marca" href="' + 'strumento.html?v=oggi&' + C + '">' + (APP ? 'FelicitasMundi' : 'FELICITASMUNDI') + '</a><div class="destra"><a class="seme' + (quiPag === "come-funziona-bozza.html" ? " on" : "") + '" href="come-funziona-bozza.html" aria-label="come funziona" data-s="riga come funziona">' + S.seme + '</a><a class="io" href="account-bozza.html" aria-label="i miei dati"><img src="' + foto + '" alt=""></a></div></div><nav class="voci" aria-label="le stanze">';
  VOCI.forEach(function (v) {
    h += '<a href="' + v[4] + '" style="--c:var(--' + v[3] + ')" class="' + (v[0] === attiva ? "on" : "") + (v[0] === "stampa" ? " staccata" : "") + '" data-s="riga ' + v[0] + '">' + S[v[2]] + '<span>' + v[1] + '</span></a>';
  });
  h += "</nav>";
  box.className = "fm-stanze"; box.innerHTML = h;

  /* 20:50, Gab: «dovrebbe comunque rimanere fissa in basso la barra con scritto bacheca ed orma» —
     il piede in ogni pagina. La Bacheca ha già il suo (coi due tasti che cambiano vista): lì non si aggiunge. */
  if (APP) {
    var menu = document.createElement("nav"); menu.className = "fm-app"; menu.setAttribute("aria-label", "Parti dell'app");
    /* 10/11, Gab: «da dove arrivava quel rimando vecchio? … fai un chek completo» → il menu era una copia del 18/10 (Oggi · Obiettivi · Megafono · Giornale · Cervello):
       ora è lo stesso di strumento.html: Giornale · Oggi · Espandi · Obiettivi · Coscienza */
    menu.innerHTML = '<a href="strumento.html?v=giornale&' + C + '">' + "<span class=\"ic\"><svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" aria-hidden=\"true\" focusable=\"false\" fill=\"currentColor\"><g transform=\"translate(0.599 17.067) scale(0.01431)\"><path d=\"M587 -708Q583 -658 581.5 -611.5Q580 -565 580 -540Q580 -519 581.0 -500.0Q582 -481 583 -468H560Q543 -551 513.0 -598.5Q483 -646 447.5 -665.5Q412 -685 376 -685H363Q337 -685 324.0 -680.5Q311 -676 306.5 -663.0Q302 -650 302 -622V-116Q302 -76 310.5 -55.5Q319 -35 343.0 -29.0Q367 -23 413 -23V0Q379 -1 324.0 -2.0Q269 -3 207 -3Q161 -3 115.0 -2.0Q69 -1 28 0V-20Q59 -22 74.0 -28.0Q89 -34 94.0 -52.0Q99 -70 99 -106V-602Q99 -639 94.0 -656.5Q89 -674 73.5 -680.5Q58 -687 28 -688V-708Q72 -707 121.5 -706.5Q171 -706 219.5 -705.5Q268 -705 309.5 -705.0Q351 -705 378 -705Q424 -705 482.5 -705.5Q541 -706 587 -708ZM442 -366Q442 -366 442.0 -356.0Q442 -346 442 -346H272Q272 -346 272.0 -356.0Q272 -366 272 -366ZM471 -498Q467 -441 467.5 -411.0Q468 -381 468 -356Q468 -331 469.0 -301.0Q470 -271 474 -214H451Q445 -251 426.5 -281.0Q408 -311 379.0 -328.5Q350 -346 312 -346V-366Q340 -366 363.0 -378.0Q386 -390 403.5 -410.0Q421 -430 432.5 -453.0Q444 -476 448 -498Z M1565 -708V-688Q1535 -687 1519.5 -680.5Q1504 -674 1499.0 -656.5Q1494 -639 1494 -602V-106Q1494 -70 1499.5 -52.0Q1505 -34 1520.0 -28.0Q1535 -22 1565 -20V0Q1534 -2 1486.0 -2.5Q1438 -3 1388 -3Q1334 -3 1286.5 -2.5Q1239 -2 1210 0V-20Q1244 -22 1261.5 -28.0Q1279 -34 1285.0 -52.0Q1291 -70 1291 -106V-641L1301 -643L1050 -1H1034L752 -643V-196Q752 -129 757.5 -93.5Q763 -58 784.5 -42.5Q806 -27 853 -20V0Q833 -2 801.0 -2.5Q769 -3 741 -3Q719 -3 696.0 -2.5Q673 -2 658 0V-20Q689 -27 704.0 -41.5Q719 -56 724.0 -88.0Q729 -120 729 -176V-602Q729 -639 724.0 -656.5Q719 -674 703.5 -680.5Q688 -687 658 -688V-708Q673 -707 696.0 -706.0Q719 -705 741 -705Q799 -705 852.0 -706.0Q905 -707 948 -708L1146 -262L1116 -229L1301 -705Q1321 -705 1344.0 -705.0Q1367 -705 1388 -705Q1438 -705 1486.0 -706.0Q1534 -707 1565 -708Z\"/></g></svg></span>Giornale" + '</a>' +
      '<a href="strumento.html?v=oggi&' + C + '">' + "<span class=\"ic\">☼</span>Oggi" + '</a>' +
      '<a href="strumento.html?v=azione&' + C + '" class="console">' + "<span class=\"ic\">✦</span>Espandi" + '</a>' +
      '<a href="strumento.html?v=obiettivi&' + C + '">' + "<span class=\"ic\"><svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" aria-hidden=\"true\" focusable=\"false\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"12\" cy=\"12\" r=\"10\" opacity=\".45\"/><path d=\"M12 12V7.3M12 12l4.1 2.4M12 12l-4.1 2.4\"/><circle cx=\"12\" cy=\"5.2\" r=\"2.1\"/><circle cx=\"17.9\" cy=\"15.4\" r=\"2.1\"/><circle cx=\"6.1\" cy=\"15.4\" r=\"2.1\"/><circle cx=\"12\" cy=\"12\" r=\"1.3\" fill=\"currentColor\" stroke=\"none\"/></svg></span>Obiettivi" + '</a>' +
      '<a href="strumento.html?v=cervello&' + C + '">' + "<span class=\"ic\"><svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" aria-hidden=\"true\" focusable=\"false\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M11 3.2C8.6 2.4 6.3 3.4 5.6 5.4 3.7 5.9 2.8 7.8 3.4 9.6 2.2 11 2.4 13.3 3.8 14.4 3.4 16.6 4.8 18.6 7 18.8 7.8 20.6 9.6 21.4 11 20.8Z\"/><path d=\"M13 3.2C15.4 2.4 17.7 3.4 18.4 5.4 20.3 5.9 21.2 7.8 20.6 9.6 21.8 11 21.6 13.3 20.2 14.4 20.6 16.6 19.2 18.6 17 18.8 16.2 20.6 14.4 21.4 13 20.8Z\"/><path d=\"M5.6 5.4C7 6 8 7.2 8 8.6M3.6 11.8C5.4 11.4 7.4 12 8.4 13.4M7 18.8C7.2 17 8.4 15.8 9.8 15.6\" opacity=\".75\"/><path d=\"M18.4 5.4C17 6 16 7.2 16 8.6M20.4 11.8C18.6 11.4 16.6 12 15.6 13.4M17 18.8C16.8 17 15.6 15.8 14.2 15.6\" opacity=\".75\"/></svg></span>Coscienza" + '</a>';
    document.body.appendChild(menu);
  } else if (!document.querySelector(".piede")) {
    var cssP = ".fm-piede{position:fixed;left:0;right:0;bottom:0;z-index:30;display:flex;justify-content:center;pointer-events:none}" +
      ".fm-piede .in{pointer-events:auto;width:100%;max-width:var(--fm-larghezza,430px);display:flex;background:rgba(10,12,26,.92);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border-top:1px solid var(--riga);padding:8px 0 calc(8px + env(safe-area-inset-bottom))}" +
      ".fm-piede a{flex:1;font-size:12px;letter-spacing:.08em;color:var(--grigio);display:flex;flex-direction:column;align-items:center;gap:3px;text-decoration:none}" +
      ".fm-piede a i{font-style:normal;font-size:18px;line-height:22px}.fm-piede a i svg{width:22px;height:22px;fill:none;stroke:currentColor;stroke-width:1.3;stroke-linejoin:round}" +
      ".fm-piede a.on{color:var(--oro)}" +
      "@media (min-width:700px){.fm-piede .in{border-radius:0 0 28px 28px}}";
    var sp = document.createElement("style"); sp.textContent = cssP; document.head.appendChild(sp);
    var piede = document.createElement("div"); piede.className = "fm-piede";
    var qui = location.pathname.split("/").pop();
    piede.innerHTML = '<div class="in"><a href="bacheca-bozza.html" class="' + (qui === "bacheca-bozza.html" ? "on" : "") + '" data-s="piede bacheca"><i>' + S.cubo + '</i>Bacheca</a><a href="bacheca-bozza.html?vista=mia" data-s="piede la mia orma"><i>◉</i>La mia orma</a></div>';
    document.body.appendChild(piede);
  }
})();
