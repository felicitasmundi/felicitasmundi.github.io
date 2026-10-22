// fm-numeri.js · FelicitasMundi · 22 ottobre 2026 (SQL 105, thread «Numeri veri ogni sera»)
// Conta, senza sapere chi: visite alle pagine dell'app, condivisioni (video, audio, pagine), tasti, installazioni, aperture dall'icona.
// Manda a Supabase solo: il tipo, l'indirizzo della pagina (senza ? e #) e il nome di cosa è stato condiviso o premuto.
// Niente cookie, niente identificativi, niente IP salvati. Se qualcosa non va, la pagina funziona come prima.
//
// Come si usa (Company brain): in ogni pagina dell'app, prima di </body>:
//   <script src="fm-numeri.js" defer></script>      (percorso giusto rispetto alla pagina)
// Da sole si contano: la visita, navigator.share (con il titolo di cosa si condivide), i link a WhatsApp/Telegram/Facebook,
//   l'installazione (solo Android/Chrome), l'apertura dall'icona (tutti i telefoni).
// A mano, sugli elementi che servono:
//   data-conta="condivisione:Video Radhanath Swami"   su un tasto di condivisione di un video o di un audio
//   data-conta="tasto:Partecipa"                       su un tasto da contare
//   window.fmConta("condivisione", "Audio diretta 22 ottobre")   da codice
(function () {
  var URL_SB = "https://gfnveesogkfvkrdudpfg.supabase.co";
  var KEY = "sb_publishable_4_kJlYwWuqsahMBw7Um2mg_lsYH9ogU";
  var TIPI = { visita: 1, condivisione: 1, tasto: 1, installazione: 1, apertura_app: 1 };

  function conta(tipo, oggetto) {
    if (!TIPI[tipo]) return;
    try {
      fetch(URL_SB + "/rest/v1/rpc/fm_conta", {
        method: "POST",
        keepalive: true,
        headers: { apikey: KEY, "Content-Type": "application/json" },
        body: JSON.stringify({ p_tipo: tipo, p_pagina: location.pathname, p_oggetto: String(oggetto || "").slice(0, 80) })
      }).catch(function () {});
    } catch (e) {}
  }

  // una volta per pagina e per sessione del browser (ricaricare non gonfia il numero)
  function unaVolta(chiave, fn) {
    try {
      if (sessionStorage.getItem(chiave)) return;
      sessionStorage.setItem(chiave, "1");
    } catch (e) {}
    fn();
  }

  window.fmConta = conta;

  // visita
  unaVolta("fm-visita:" + location.pathname, function () { conta("visita"); });

  // apertura dall'icona installata
  var daIcona = (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) || window.navigator.standalone === true;
  if (daIcona) unaVolta("fm-apertura", function () { conta("apertura_app"); });

  // installazione (Android/Chrome; iPhone non lo dice)
  window.addEventListener("appinstalled", function () { conta("installazione"); });

  // condivisione dal tasto del telefono
  if (navigator.share) {
    var share = navigator.share.bind(navigator);
    navigator.share = function (dati) {
      var p = share(dati);
      Promise.resolve(p).then(function () { conta("condivisione", (dati && (dati.title || dati.text)) || document.title); }, function () {});
      return p;
    };
  }

  // tasti con data-conta e link di condivisione
  document.addEventListener("click", function (ev) {
    var el = ev.target && ev.target.closest ? ev.target.closest("[data-conta],a[href]") : null;
    if (!el) return;
    var dc = el.getAttribute("data-conta");
    if (dc) {
      var i = dc.indexOf(":");
      conta(i > 0 ? dc.slice(0, i) : dc, i > 0 ? dc.slice(i + 1) : "");
      return;
    }
    var h = el.getAttribute("href") || "";
    if (/^(https?:\/\/)?(wa\.me|api\.whatsapp\.com|web\.whatsapp\.com|t\.me|telegram\.me|www\.facebook\.com\/sharer)/i.test(h) || /^whatsapp:/i.test(h)) {
      conta("condivisione", el.getAttribute("data-titolo") || document.title);
    }
  }, true);
})();
