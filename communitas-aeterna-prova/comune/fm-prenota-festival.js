/* Prenotazioni del Festival con i dati — 28/10/2026, Gab: «per ora prenotiamo la presenza, coi dati, poi mettiamo i costi»;
   «pranzo e cena … uno prenota nome cognome telefono mail»; workshop: «il modello di acquisto prenotazione, che porta al pagamento dei 50 euro».
   Salva con fm_prenota_festival (SQL 130): funziona anche per chi non è entrato; il database manda la mail di conferma.
   Uso:
     <div data-fm-prenota="ci_saro,pranzo,cena,workshop,laboratori_bambini"></div>  → disegna il modulo (la prima voce è già scelta;
       ?prenota=<voce> nell'indirizzo la sceglie, ?presenza=1 sceglie «Ci sarò» e porta al modulo;
       un link <a href="#prenota" data-fm-scegli="<voce>"> sceglie la voce e scorre al modulo)
     FMPrenotaFestival.invia({cosa, nome, cognome, telefono, email, persone, privacy}) → Promise {ok, id, errore}
   Pagamento: con un link Stripe in LINK_STRIPE la voce, dopo il salvataggio, porta al pagamento
   (client_reference_id = id della prenotazione, così in Stripe si ritrova). Senza link si prenota e basta. */
(function(){
  if (window.FMPrenotaFestival) return;
  var URL = "https://gfnveesogkfvkrdudpfg.supabase.co", KEY = "sb_publishable_4_kJlYwWuqsahMBw7Um2mg_lsYH9ogU";
  var EVENTO = "bfff97a1-3431-4939-b15e-304f14087509";
  var LINK_STRIPE = { workshop: "", pranzo: "", cena: "", laboratori_bambini: "" };
  var PREZZO = { workshop: "50 €" };
  var NOMI = { ci_saro: "Ci sarò", pranzo: "Pranzo", cena: "Cena", workshop: "Workshop Tra Coscienza e Tecnologia",
               laboratori_bambini: "Laboratori didattici per bimbi e ragazzi" };

  /* d.dettaglio (laboratori, camera) e d.fattura (partita IVA o codice fiscale) vanno con lo SQL 133; finché non è lanciato si riprova senza, così la prenotazione si salva comunque */
  function invia(d){
    var corpo = { p_cosa: d.cosa, p_nome: d.nome, p_cognome: d.cognome, p_telefono: d.telefono, p_email: d.email,
                  p_persone: parseInt(d.persone, 10) || 1, p_privacy: !!d.privacy, p_evento: EVENTO };
    if (d.dettaglio) corpo.p_dettaglio = String(d.dettaglio).slice(0, 500);
    if (d.fattura) corpo.p_fattura = String(d.fattura).slice(0, 20);
    function manda(c){
      return fetch(URL + "/rest/v1/rpc/fm_prenota_festival", {
        method: "POST",
        headers: { "apikey": KEY, "Authorization": "Bearer " + KEY, "Content-Type": "application/json" },
        body: JSON.stringify(c)
      });
    }
    return manda(corpo).then(function(r){
      if (!r.ok && (corpo.p_dettaglio || corpo.p_fattura) && r.status === 404){ delete corpo.p_dettaglio; delete corpo.p_fattura; return manda(corpo); }
      return r;
    }).then(function(r){ return r.json().then(function(j){ return r.ok ? j : { ok: false, errore: "Non è stato salvato. Si può riprovare." }; }); })
      .catch(function(){ return { ok: false, errore: "Non è stato salvato. Controlla la connessione e riprova." }; });
  }
  function aPagamento(cosa, id, email){
    var l = LINK_STRIPE[cosa]; if (!l) return false;
    location.href = l + (l.indexOf("?") < 0 ? "?" : "&") + "client_reference_id=" + encodeURIComponent(id) + "&prefilled_email=" + encodeURIComponent(email);
    return true;
  }

  var CSS = ".fp{max-width:560px;margin:0 auto;background:#1a2148;border:1px solid rgba(212,175,106,.35);border-radius:20px;padding:22px 20px;color:#F5F0E6;font:400 19px/1.5 'DM Sans',system-ui,sans-serif;text-align:left}"
    + ".fp h3{font:600 24px/1.25 'Cormorant Garamond',Georgia,serif;margin:0 0 14px;color:#F5F0E6}"
    + ".fp .voci{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 16px}"
    + ".fp .voci label{display:inline-flex;align-items:center;gap:8px;border:1.5px solid rgba(245,240,230,.3);border-radius:999px;padding:9px 15px;cursor:pointer;font-size:17px}"
    + ".fp .voci input{position:absolute;opacity:0;pointer-events:none}"
    + ".fp .voci label.on{background:#D4AF6A;border-color:#D4AF6A;color:#1A1405;font-weight:600}"
    + ".fp .voci label:focus-within{outline:2px solid #D4AF6A;outline-offset:2px}"
    + ".fp .riga{display:grid;grid-template-columns:1fr 1fr;gap:10px}@media(max-width:480px){.fp .riga{grid-template-columns:1fr}}"
    + ".fp .campo{display:block;margin:0 0 12px}.fp .campo span{display:block;font-size:16px;color:#C9CCE0;margin:0 0 4px}"
    + ".fp input[type=text],.fp input[type=tel],.fp input[type=email],.fp input[type=number]{width:100%;box-sizing:border-box;font:inherit;font-size:19px;padding:12px 14px;border-radius:12px;border:1.5px solid rgba(245,240,230,.3);background:#122050;color:#F5F0E6}"
    + ".fp input:focus{outline:2px solid #D4AF6A;outline-offset:1px}"
    + ".fp .privacy{display:flex;gap:10px;align-items:flex-start;font-size:16px;margin:4px 0 16px}.fp .privacy input{width:22px;height:22px;margin-top:2px;accent-color:#D4AF6A}"
    + ".fp .privacy a{color:#D4AF6A}"
    + ".fp button{width:100%;font:600 19px 'DM Sans',system-ui,sans-serif;padding:15px 18px;border-radius:999px;border:0;background:#D4AF6A;color:#1A1405;cursor:pointer}"
    + ".fp button[disabled]{opacity:.6;cursor:wait}"
    + ".fp .esito{min-height:1.5em;margin:12px 0 0;font-size:18px}.fp .esito.ok{color:#BFE3A0}.fp .esito.no{color:#FFB4A8}";

  function disegna(box){
    var voci = (box.getAttribute("data-fm-prenota") || "ci_saro").split(",").map(function(s){ return s.trim(); }).filter(function(v){ return NOMI[v]; });
    if (!voci.length) return;
    var q = new URLSearchParams(location.search), scelta = q.get("prenota");
    if (q.get("presenza") === "1") scelta = "ci_saro";
    if (voci.indexOf(scelta) < 0) scelta = voci[0];
    var id = "fp" + Math.random().toString(36).slice(2, 7);
    box.innerHTML = '<form class="fp" novalidate>'
      + '<h3>Prenota</h3>'
      + (voci.length > 1 ? '<div class="voci" role="radiogroup" aria-label="Cosa prenoti">' + voci.map(function(v){
          return '<label' + (v === scelta ? ' class="on"' : '') + '><input type="radio" name="cosa" value="' + v + '"' + (v === scelta ? ' checked' : '') + '>' + NOMI[v] + '</label>';
        }).join("") + '</div>' : '<input type="hidden" name="cosa" value="' + voci[0] + '">')
      + '<div class="riga"><label class="campo"><span>Nome</span><input type="text" name="nome" autocomplete="given-name" required></label>'
      + '<label class="campo"><span>Cognome</span><input type="text" name="cognome" autocomplete="family-name" required></label></div>'
      + '<div class="riga"><label class="campo"><span>Telefono</span><input type="tel" name="telefono" autocomplete="tel" required></label>'
      + '<label class="campo"><span>Mail</span><input type="email" name="email" autocomplete="email" required></label></div>'
      + '<label class="campo" style="max-width:200px"><span>Quante persone</span><input type="number" name="persone" min="1" max="20" value="1" inputmode="numeric"></label>'
      + '<label class="privacy"><input type="checkbox" name="privacy" id="' + id + 'p"><span>Ho letto l\'<a href="privacy.html" target="_blank" rel="noopener">informativa privacy</a> e acconsento all\'uso di questi dati per la prenotazione.</span></label>'
      + '<button type="submit">Prenota</button>'
      + '<p class="esito" aria-live="polite"></p></form>';
    var f = box.querySelector("form"), tasto = f.querySelector("button"), esito = f.querySelector(".esito");
    function cosa(){ var r = f.querySelector('input[name=cosa]:checked') || f.querySelector('input[name=cosa]'); return r.value; }
    function aggiorna(){
      var c = cosa();
      tasto.textContent = LINK_STRIPE[c] && PREZZO[c] ? "Prenota e paga " + PREZZO[c] : "Prenota";
      [].forEach.call(f.querySelectorAll(".voci label"), function(l){ l.classList.toggle("on", l.querySelector("input").checked); });
    }
    f.addEventListener("change", aggiorna); aggiorna();
    f.addEventListener("submit", function(e){
      e.preventDefault();
      var d = { cosa: cosa(), nome: f.nome.value, cognome: f.cognome.value, telefono: f.telefono.value, email: f.email.value.trim(),
                persone: f.persone.value, privacy: f.privacy.checked };
      esito.className = "esito"; esito.textContent = "Un momento…"; tasto.disabled = true;
      invia(d).then(function(r){
        tasto.disabled = false;
        if (!r || !r.ok){ esito.className = "esito no"; esito.textContent = (r && r.errore) || "Non è stato salvato. Si può riprovare."; return; }
        if (aPagamento(d.cosa, r.id, d.email)){ esito.className = "esito ok"; esito.textContent = "Prenotazione salvata. Ti porto al pagamento…"; return; }
        esito.className = "esito ok";
        esito.textContent = "Prenotato: " + NOMI[d.cosa] + ", " + (parseInt(d.persone, 10) || 1) + ((parseInt(d.persone, 10) || 1) === 1 ? " persona" : " persone") + ". Ti arriva una mail di conferma.";
      });
    });
    if (q.get("presenza") === "1" || q.get("prenota")) setTimeout(function(){ box.scrollIntoView({ behavior: "smooth", block: "start" }); }, 300);
    if (q.get("pagato") === "1"){ esito.className = "esito ok"; esito.textContent = "Pagamento ricevuto. Grazie!"; }
  }
  function avvia(){
    if (!document.getElementById("fp-stile")){ var s = document.createElement("style"); s.id = "fp-stile"; s.textContent = CSS; document.head.appendChild(s); }
    [].forEach.call(document.querySelectorAll("[data-fm-prenota]"), disegna);
    document.addEventListener("click", function(e){
      var a = e.target.closest && e.target.closest("[data-fm-scegli]"); if (!a) return;
      var r = document.querySelector('[data-fm-prenota] input[name=cosa][value="' + a.getAttribute("data-fm-scegli") + '"]');
      if (r){ r.checked = true; r.dispatchEvent(new Event("change", { bubbles: true })); }
    });
  }
  window.FMPrenotaFestival = { invia: invia, aPagamento: aPagamento, LINK_STRIPE: LINK_STRIPE, NOMI: NOMI };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", avvia); else avvia();
})();
