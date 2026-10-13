/* ═══ FM-CASSA · la finestra del pagamento, una sola per tutte le pagine · 13 ottobre 2026 ═══
   Gab, 15:50: «3» (la finestra è nostra, dentro c'è il riquadro della carta di Stripe) · 18:32: «la struttura necessaria per acquistare».
   Uso:  FMCassa.apri({ azione:"stampa"|"lavoro"|"avvia", corpo:{…}, titolo:"…", righe:["…"], dopo:function(d){} })
         FMCassa.sessione().then(function(sess){ … })   → null se non si è entrati
   Serve: supabase-js e Stripe.js caricati prima; la chiave pubblicabile (pk_…) è pubblica. */
(function () {
  "use strict";
  var PK = "pk_test_51UNBS0GhYmQedeGgpnrfiYlouqLbGbZ8jhT1cWCQX9RBsZVqf7AAPlAodkI66aXUnTzFNRDoW9kwsYQlXDawwl1l00LIvTffnB";
  var URL = "https://gfnveesogkfvkrdudpfg.supabase.co", ANON = "sb_publishable_4_kJlYwWuqsahMBw7Um2mg_lsYH9ogU";
  var db = null, stripe = null, elements = null, corrente = null;
  function client() { if (!db && window.supabase) { try { db = supabase.createClient(URL, ANON, { auth: { flowType: "implicit" } }); } catch (e) {} } return db; }
  function sessione() { var c = client(); if (!c) return Promise.resolve(null); return c.auth.getSession().then(function (r) { return (r && r.data && r.data.session) || null; }).catch(function () { return null; }); }
  function eur(n) { return Number(n).toLocaleString("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €"; }
  function css() {
    if (document.getElementById("fm-cassa-css")) return;
    var s = document.createElement("style"); s.id = "fm-cassa-css";
    s.textContent =
      ".fmc-velo{position:fixed;inset:0;z-index:70;background:rgba(4,6,14,.72);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);display:none}.fmc-velo.vivo{display:block}" +
      ".fmc{position:fixed;left:0;right:0;bottom:0;z-index:80;margin:0 auto;max-width:var(--fm-larghezza,430px);background:#10132a;border-radius:24px 24px 0 0;padding:16px 18px calc(18px + env(safe-area-inset-bottom));box-shadow:0 -20px 60px rgba(0,0,0,.6);transform:translateY(105%);transition:transform .35s;max-height:92dvh;overflow:auto;color:var(--avorio,#F5F0E6);font-family:'DM Sans',system-ui,sans-serif}" +
      ".fmc.vivo{transform:none}" +
      "@media (min-width:700px){.fmc{bottom:auto;top:50%;transform:translateY(-50%) scale(.98);opacity:0;pointer-events:none;border-radius:24px;max-width:520px;max-height:90dvh}.fmc.vivo{transform:translateY(-50%);opacity:1;pointer-events:auto}}" +
      ".fmc .capo{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}.fmc .capo .fm-occ{color:var(--oro,#D4AF6A)}" +
      ".fmc h2{font-family:'Cormorant Garamond',serif;font-weight:500;font-size:26px;line-height:1.1;margin:4px 0 0}" +
      ".fmc .chiudi{flex:none;width:34px;height:34px;border-radius:50%;border:1px solid var(--riga,rgba(245,240,230,.14));color:var(--grigio,#9A978F);display:grid;place-items:center;font-size:18px;background:none;cursor:pointer}" +
      ".fmc .prezzo{font-family:'Cormorant Garamond',serif;font-size:34px;color:var(--oro,#D4AF6A);line-height:1;margin-top:10px}.fmc .prezzo small{font-family:'DM Sans',sans-serif;font-size:12px;color:var(--grigio,#9A978F);margin-left:6px}" +
      ".fmc ul{list-style:none;margin:10px 0 0;padding:0;display:flex;flex-direction:column;gap:4px}.fmc li{font-size:13px;line-height:1.4;padding-left:14px;position:relative;color:rgba(245,240,230,.9)}.fmc li::before{content:'·';position:absolute;left:3px;color:var(--oro,#D4AF6A)}" +
      ".fmc .carta{margin-top:14px;min-height:120px}.fmc .attesa{font-size:13px;color:var(--grigio,#9A978F);padding:18px 0;text-align:center}" +
      ".fmc .err{margin-top:10px;font-size:13px;color:#e08a80;line-height:1.45}" +
      ".fmc .paga{margin-top:14px;display:flex;width:100%;justify-content:center;align-items:center;font:600 15px 'DM Sans',system-ui,sans-serif;padding:13px 18px;border-radius:980px;background:var(--oro,#D4AF6A);color:#0A0C1A;border:0;cursor:pointer}.fmc .paga:disabled{opacity:.5;cursor:default}" +
      ".fmc .riga-f{font-size:11.5px;color:var(--grigio,#9A978F);line-height:1.5;margin-top:10px;text-align:center}.fmc .riga-f a{color:var(--oro,#D4AF6A)}" +
      ".fmc .sicuro{display:flex;justify-content:center;gap:6px;font-size:10.5px;letter-spacing:.14em;color:var(--grigio,#9A978F);margin-top:12px}" +
      ".fmc .fatto{margin-top:14px;padding:12px 14px;border:1px solid var(--oro,#D4AF6A);border-radius:14px;font-size:14px;line-height:1.5}";
    document.head.appendChild(s);
  }
  function dom() {
    css();
    var v = document.getElementById("fmc-velo"), c = document.getElementById("fmc");
    if (c) return { v: v, c: c };
    v = document.createElement("div"); v.id = "fmc-velo"; v.className = "fmc-velo";
    c = document.createElement("div"); c.id = "fmc"; c.className = "fmc"; c.setAttribute("role", "dialog"); c.setAttribute("aria-modal", "true");
    c.innerHTML = '<div class="capo"><div><div class="fm-occ">IL PAGAMENTO</div><h2 id="fmc-titolo"></h2></div><button class="chiudi" id="fmc-chiudi" aria-label="chiudi">×</button></div>' +
      '<div class="prezzo" id="fmc-prezzo"></div><ul id="fmc-righe"></ul><div class="carta" id="fmc-carta"></div><div class="err" id="fmc-err" hidden></div>' +
      '<button class="paga" id="fmc-paga" disabled>Paga</button>' +
      '<div class="riga-f" id="fmc-nota">Il pagamento va a Felicitas Omnia S.r.l.s. · <a href="../communitas-aeterna/condizioni.html">condizioni</a> · <a href="../communitas-aeterna/privacy.html">privacy</a></div>' +
      '<div class="sicuro">PAGAMENTO SICURO · LA CARTA LA VEDE SOLO STRIPE</div>';
    document.body.appendChild(v); document.body.appendChild(c);
    var chiudi = function () { c.classList.remove("vivo"); v.classList.remove("vivo"); corrente = null; };
    document.getElementById("fmc-chiudi").onclick = chiudi; v.onclick = chiudi;
    document.getElementById("fmc-paga").onclick = paga;
    return { v: v, c: c };
  }
  function errore(t) { var e = document.getElementById("fmc-err"); e.hidden = false; e.textContent = t; }
  function apri(opz) {
    var d = dom(); corrente = opz;
    document.getElementById("fmc-titolo").textContent = opz.titolo || "";
    document.getElementById("fmc-prezzo").innerHTML = opz.prezzo ? opz.prezzo : "";
    var ul = document.getElementById("fmc-righe"); ul.innerHTML = ""; (opz.righe || []).forEach(function (t) { var li = document.createElement("li"); li.textContent = t; ul.appendChild(li); });
    document.getElementById("fmc-carta").innerHTML = '<div class="attesa">preparo il pagamento…</div>';
    document.getElementById("fmc-err").hidden = true;
    var b = document.getElementById("fmc-paga"); b.disabled = true; b.textContent = "Paga"; b.hidden = false;
    d.c.classList.add("vivo"); d.v.classList.add("vivo");
    sessione().then(function (sess) {
      if (!sess) { location.href = "accesso.html"; return; }
      var corpo = Object.assign({ azione: opz.azione, torna: location.origin + location.pathname }, opz.corpo || {});
      return client().functions.invoke("stripe-cassa", { body: corpo }).then(function (r) {
        var x = (r && r.data) || {};
        if (!x.segreto) { errore((x.errore || "non riesco a preparare il pagamento") + ". Scrivi a chi coordina."); return; }
        if (x.totale != null) document.getElementById("fmc-prezzo").innerHTML = eur(x.totale) + "<small>" + (opz.sotto || "IVA inclusa") + "</small>";
        if (!window.Stripe) { errore("Stripe non si è caricato: ricarica la pagina"); return; }
        stripe = stripe || window.Stripe(PK, { locale: "it" });
        elements = stripe.elements({ clientSecret: x.segreto, appearance: { theme: "night", labels: "floating", variables: { colorPrimary: "#D4AF6A", colorBackground: "#0A0C1A", colorText: "#F5F0E6", colorTextSecondary: "#9A978F", colorDanger: "#B4574A", fontFamily: "'DM Sans', system-ui, sans-serif", borderRadius: "12px", spacingUnit: "4px" }, rules: { ".Input": { border: "1px solid rgba(245,240,230,.14)", boxShadow: "none" }, ".Input:focus": { border: "1px solid #D4AF6A", boxShadow: "0 0 0 1px rgba(212,175,106,.35)" }, ".Tab": { border: "1px solid rgba(245,240,230,.14)" }, ".Tab--selected": { border: "1px solid #D4AF6A", color: "#F5F0E6" } } }, fonts: [{ cssSrc: "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap" }] });
        document.getElementById("fmc-carta").innerHTML = "";
        var el = elements.create("payment", { layout: "tabs" }); el.mount("#fmc-carta");
        corrente.dati = x;
        el.on("ready", function () { b.disabled = false; b.textContent = "Paga " + (x.totale != null ? eur(x.totale) : ""); });
        el.on("change", function (ev) { if (ev.error) errore(ev.error.message); else document.getElementById("fmc-err").hidden = true; });
      });
    }).catch(function (e) { errore("non riesco a preparare il pagamento: " + (e && e.message || e)); });
  }
  function paga() {
    if (!stripe || !elements || !corrente) return;
    var b = document.getElementById("fmc-paga"); var t = b.textContent; b.disabled = true; b.textContent = "un momento…";
    var torna = location.origin + location.pathname + (location.search ? location.search + "&" : "?") + "pagato=1";
    stripe.confirmPayment({ elements: elements, confirmParams: { return_url: torna }, redirect: "if_required" }).then(function (r) {
      if (r.error) { b.disabled = false; b.textContent = t; errore(r.error.message || "il pagamento non è andato"); return; }
      b.hidden = true; document.getElementById("fmc-carta").innerHTML = "";
      var f = document.createElement("div"); f.className = "fatto"; f.textContent = (corrente.grazie || "Pagato. La richiesta è arrivata a chi coordina, che ti scrive.");
      document.getElementById("fmc-carta").appendChild(f);
      if (typeof corrente.dopo === "function") { try { corrente.dopo(corrente.dati || {}); } catch (e) {} }
    });
  }
  /* gli indirizzi di consegna: al massimo tre, in persone.indirizzi (SQL 62), col tasto «aggiungi» (Gab, 13 ott 20:21).
     indirizzi(contenitore, quandoScelto) disegna le scelte e chiama quandoScelto(testo) a ogni scelta. */
  function indirizzi(cont, cb) {
    cont.innerHTML = "";
    var st = document.createElement("style"); st.textContent = ".fmi .scelte{display:flex;flex-direction:column;gap:6px}.fmi label{display:flex;gap:8px;align-items:flex-start;font-size:13px;line-height:1.4;padding:8px 10px;border:1px solid rgba(245,240,230,.14);border-radius:12px;cursor:pointer}.fmi label.on{border-color:#D4AF6A}.fmi input[type=radio]{margin-top:3px}.fmi .nuovo{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:8px}.fmi .nuovo input{min-height:38px;padding:0 10px;border-radius:10px;border:1px solid rgba(245,240,230,.2);background:#0A0C1A;color:#F5F0E6;font:13px 'DM Sans',system-ui,sans-serif}.fmi .nuovo input.largo{grid-column:1/-1}.fmi .agg{margin-top:8px;font:600 13px 'DM Sans',system-ui,sans-serif;color:#D4AF6A;background:none;border:1px solid rgba(212,175,106,.5);border-radius:980px;padding:8px 14px;cursor:pointer}.fmi .nota{font-size:12px;color:#9A978F;margin-top:6px;line-height:1.45}";
    cont.appendChild(st); cont.className = (cont.className || "") + " fmi";
    var lista = document.createElement("div"); lista.className = "scelte"; cont.appendChild(lista);
    var sotto = document.createElement("div"); cont.appendChild(sotto);
    var salvati = [], scelto = -1, uid = null;
    function testo(a) { return [a.nome, a.via, (a.cap || "") + " " + (a.citta || "") + (a.prov ? " (" + a.prov + ")" : ""), a.tel ? "tel. " + a.tel : ""].filter(function (x) { return x && x.trim(); }).join(" · "); }
    function disegna() {
      lista.innerHTML = "";
      salvati.forEach(function (a, i) {
        var l = document.createElement("label"); l.className = i === scelto ? "on" : "";
        l.innerHTML = '<input type="radio" name="fmi-ind"' + (i === scelto ? " checked" : "") + '><span>' + testo(a).replace(/[&<>]/g, function (k) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[k]; }) + '</span>';
        l.querySelector("input").onchange = function () { scelto = i; disegna(); cb(testo(a)); };
        lista.appendChild(l);
      });
      sotto.innerHTML = "";
      if (!salvati.length) sotto.appendChild(Object.assign(document.createElement("div"), { className: "nota", textContent: "Dove va consegnato: aggiungi un indirizzo." }));
      if (salvati.length < 3) {
        var b = document.createElement("button"); b.type = "button"; b.className = "agg"; b.textContent = salvati.length ? "+ aggiungi un indirizzo" : "+ aggiungi l'indirizzo"; sotto.appendChild(b);
        b.onclick = function () {
          b.hidden = true;
          var f = document.createElement("div"); f.className = "nuovo";
          f.innerHTML = '<input class="largo" placeholder="nome e cognome (o l\'attività)"><input class="largo" placeholder="via e numero"><input placeholder="CAP"><input placeholder="città"><input placeholder="provincia"><input placeholder="telefono per il corriere"><button type="button" class="agg largo">Salva questo indirizzo</button>';
          sotto.appendChild(f);
          var inp = f.querySelectorAll("input");
          f.querySelector("button").onclick = function () {
            var a = { nome: inp[0].value.trim(), via: inp[1].value.trim(), cap: inp[2].value.trim(), citta: inp[3].value.trim(), prov: inp[4].value.trim(), tel: inp[5].value.trim() };
            if (!a.nome || !a.via || !a.cap || !a.citta) { alert("servono nome, via, CAP e città"); return; }
            salvati.push(a); scelto = salvati.length - 1; disegna(); cb(testo(a));
            if (uid) client().from("persone").update({ indirizzi: salvati }).eq("id", uid).then(function (r) { if (r.error) console.log("indirizzi", r.error.message); });
          };
        };
      } else sotto.appendChild(Object.assign(document.createElement("div"), { className: "nota", textContent: "Al massimo tre indirizzi: per cambiarne uno, scrivi a chi coordina." }));
    }
    sessione().then(function (sess) {
      if (!sess) { disegna(); return; }
      uid = sess.user.id;
      return client().from("persone").select("indirizzi").eq("id", uid).maybeSingle().then(function (r) {
        salvati = (r && r.data && Array.isArray(r.data.indirizzi)) ? r.data.indirizzi.slice(0, 3) : [];
        if (salvati.length) { scelto = 0; cb(testo(salvati[0])); }
        disegna();
      }, function () { disegna(); });
    });
  }
  window.FMCassa = { apri: apri, sessione: sessione, client: client, eur: eur, indirizzi: indirizzi };
})();
