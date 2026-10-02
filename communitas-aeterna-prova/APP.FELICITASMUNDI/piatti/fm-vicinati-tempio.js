/* ═══════════════════════════════════════════════════════════════
   FM-VICINATI-TEMPIO — la stanza dei Vicinati, dentro il tempio.
   ⭐ 1 ottobre, Gab (dopo l'incontro con Manuela): «non riesco a far arrivare il senso effettivo
      di cosa si possa fare partendo da quella pagina».
      0 · Dove sei — prima di tutto, con due righe sul perché; sparisce quando l'account ha scelto
      1 · Karma yoga — le richieste vicino a te, quello che hai preso, le tue richieste
      2 · Villaggio Felicitas — l'area attiva, legata alla civiltà e alla radice linguistica (il micelio)
      3 · Oggi / calendario — oggi, i prossimi giorni, l'archivio · propongo un incontro
      4 · Novità — Antaḥkaraṇa · vicino · lontano; si leggono e si scrivono (dal karma yoga)
   Quello che non è pronto resta semitrasparente (Gab: «le cose le mettiamo semi trasparenti
   finché non sono pronte»). «Vicino» = entro circa 20 km dal tuo comune.
   Vuole: dentro il guscio `window.parent.db` e `window.parent.vai`.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  "use strict";
  var RAGGIO = 20;   /* km */
  /* ⭐ 1 ottobre 15:51, Gab: «oggi dobbiamo creare ciò che c'è: civiltà tuscia (toscana umbro laziale), romagnola,
        emiliana, piceni (marche abruzzo)» — e la sarda. Regione (codice ISO) → civiltà; l'Emilia-Romagna si divide
        per provincia (le prime tre cifre del comune: Ravenna 039, Forlì-Cesena 040, Rimini 099 → romagnola).
     Il villaggio (l'orma micelio) si riconosce dal nome. */
  var CIV = {
    sarda:     { nome: "Civiltà Sarda",     cerca: /sard/i },
    tuscia:    { nome: "Civiltà Tuscia",    cerca: /tuscia/i },
    romagnola: { nome: "Civiltà Romagnola", cerca: /romagnol/i },
    emiliana:  { nome: "Civiltà Emiliana",  cerca: /emilian/i },
    piceni:    { nome: "Civiltà Piceni",    cerca: /picen/i }
  };
  function civilta(c) {
    if (!c) return null;
    var r = c.regione_cod, pr = String(c.codice || "").slice(0, 3);
    if (r === "IT-88") return CIV.sarda;
    if (r === "IT-52" || r === "IT-55" || r === "IT-62") return CIV.tuscia;
    if (r === "IT-45") return (pr === "039" || pr === "040" || pr === "099") ? CIV.romagnola : CIV.emiliana;
    if (r === "IT-57" || r === "IT-65") return CIV.piceni;
    return null;
  }
  var MESI = ["gennaio","febbraio","marzo","aprile","maggio","giugno","luglio","agosto","settembre","ottobre","novembre","dicembre"];
  var GIORNI = ["domenica","lunedì","martedì","mercoledì","giovedì","venerdì","sabato"];
  var W = window.parent !== window ? window.parent : window;

  function esc(x) { return String(x == null ? "" : x).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function titolo(o) { if (o.titolo) return o.titolo; var s = String(o.contenuto || "").trim().split("\n")[0]; return s.length > 80 ? s.slice(0, 78) + "…" : s; }
  function km(a, b) {
    if (!a || !b || a.lat == null || b.lat == null) return null;
    var R = 6371, dLa = (b.lat - a.lat) * Math.PI / 180, dLo = (b.lon - a.lon) * Math.PI / 180;
    var x = Math.sin(dLa / 2) * Math.sin(dLa / 2) + Math.cos(a.lat * Math.PI / 180) * Math.cos(b.lat * Math.PI / 180) * Math.sin(dLo / 2) * Math.sin(dLo / 2);
    return 2 * R * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  }
  function quando(o) {
    var s = o.inizio_il || o.accaduto_il; if (!s) return "";
    var x = new Date(s); if (isNaN(x)) return "";
    var t = GIORNI[x.getDay()] + " " + x.getDate() + " " + MESI[x.getMonth()];
    if (o.inizio_il) t += ", " + String(x.getHours()).padStart(2, "0") + ":" + String(x.getMinutes()).padStart(2, "0");
    return t;
  }
  function vai(r, x) { try { W.vai(r, x); } catch (e) {} }
  function apriOrma(id) { try { if (W.SpazioVivo && W.SpazioVivo.apriOrma) return W.SpazioVivo.apriOrma(id); } catch (e) {} vai("orma", { id: id }); }
  function scrivi(opz) { try { if (W.SpazioVivo && W.SpazioVivo.scriviOrma) return W.SpazioVivo.scriviOrma(opz); } catch (e) {} }

  async function db() {
    try { if (W.db) return W.db; } catch (e) {}
    return null;
  }

  /* ── leggere ───────────────────────────────────────────────────── */
  async function leggi() {
    var d = { io: null, centro: null, comune: null, karma: [], presi: [], mie: [], villaggi: [], luoghi: [], eventi: [], novita: [], dentro: {}, coord: {} };
    var b = await db(); if (!b) return d;
    try {
      var u = await b.auth.getUser(); d.io = u && u.data && u.data.user && u.data.user.id;
      if (d.io) {
        var p = await b.from("persone").select("comune_cod,radice_id").eq("id", d.io).maybeSingle();
        if (p && p.error) p = await b.from("persone").select("comune_cod").eq("id", d.io).maybeSingle();   /* prima dell'SQL 27 */
        var cc = p && p.data && p.data.comune_cod;
        d.radice = (p && p.data && p.data.radice_id) || null;
        if (cc) {
          var t = await b.from("territori").select("codice,nome,lat,lon,regione_cod").eq("codice", cc).limit(1);
          if (t.data && t.data[0]) { d.comune = t.data[0]; d.centro = { lat: t.data[0].lat, lon: t.data[0].lon }; }
        }
      }
      var COL = "id,titolo,contenuto,tipo,stadio,entro_il,luogo,luogo_lat,luogo_lon,territorio_cod,persona_id,quanti_servono,momento,dorme_dal,inizio_il,accaduto_il,categoria,visibilita";
      var k = await b.from("orme").select(COL).eq("tipo", "karma_yoga").is("dorme_dal", null).order("momento", { ascending: false }).limit(120);
      d.karma = k.data || [];
      var v = await b.from("orme").select(COL).eq("tipo", "micelio").is("dorme_dal", null).limit(20);
      d.villaggi = v.data || [];
      /* i luoghi dentro i villaggi */
      var vid = d.villaggi.map(function (x) { return x.id; });
      if (vid.length) { var lu = await b.from("orme").select(COL + ",orma_madre_id").eq("tipo", "luogo").in("orma_madre_id", vid).is("dorme_dal", null).limit(100); d.luoghi = lu.data || []; }
      var e = await b.from("orme").select(COL).eq("tipo", "festa").eq("visibilita", "pubblico").is("dorme_dal", null).limit(200);
      d.eventi = e.data || [];
      /* ⭐ 1 ottobre, Gab: tutte le novità; se ne vedono tre, poi «leggi tutto», divise per mesi e anni */
      var n = await b.from("orme").select(COL + ",articolo_url,regione_cod").in("tipo", ["articolo", "rubrica_radio"]).eq("visibilita", "pubblico").is("dorme_dal", null).order("accaduto_il", { ascending: false, nullsFirst: false }).limit(200);
      d.novita = n.data || [];

      /* chi c'è dentro, e cosa ho preso io */
      var ids = d.karma.map(function (x) { return x.id; }).concat(d.villaggi.map(function (x) { return x.id; }));
      if (ids.length) {
        var op = await b.from("orma_persone").select("orma_id,persona_id,nome,preso_il,lasciato_il,ruolo").in("orma_id", ids);
        (op.data || []).forEach(function (r) {
          if (!r.preso_il || r.lasciato_il) return;
          (d.dentro[r.orma_id] = d.dentro[r.orma_id] || []).push(r);
        });
      }
      /* le coordinate dei comuni delle orme che non hanno un punto */
      var cods = {};
      [].concat(d.karma, d.eventi, d.novita).forEach(function (o) { if (o.luogo_lat == null && o.territorio_cod) cods[o.territorio_cod] = 1; });
      var lista = Object.keys(cods);
      if (lista.length) {
        var tc = await b.from("territori").select("codice,lat,lon").in("codice", lista.slice(0, 300));
        (tc.data || []).forEach(function (r) { d.coord[r.codice] = { lat: r.lat, lon: r.lon }; });
      }
    } catch (x) { console.warn("vicinati:", x); }
    return d;
  }
  function dove(d, o) {
    if (o.luogo_lat != null) return { lat: o.luogo_lat, lon: o.luogo_lon };
    return d.coord[o.territorio_cod] || null;
  }
  /* vicino se entro il raggio; senza luogo o senza «dove sei» resta vicino (non si nasconde niente) */
  function vicino(d, o) {
    var p = dove(d, o);
    if (!d.centro) return true;                 /* senza «dove sei» non si nasconde niente */
    if (!p) return !o.regione_cod || !d.comune || o.regione_cod === d.comune.regione_cod;   /* solo la regione: vicino se è la tua */
    return km(d.centro, p) <= RAGGIO;
  }

  /* ── disegnare ─────────────────────────────────────────────────── */
  function riga(o, sotto, tag, attr) {
    return '<a class="voce va" href="#" ' + (attr || ('data-orma="' + esc(o.id) + '"')) + '>' + esc(titolo(o)) +
      (sotto ? '<small>' + esc(sotto) + '</small>' : '') + (tag ? '<span class="tg">' + esc(tag) + '</span>' : '') + '<i>›</i></a>';
  }
  function fascia(nome, html, vuoto) {
    if (!html && !vuoto) return "";
    return '<div class="fascia"><em>' + esc(nome) + '</em>' + (html || '<div class="vuoto">' + esc(vuoto) + '</div>') + '</div>';
  }
  function tasto(testo, attr, spento) {
    return '<button type="button" class="gesto' + (spento ? ' presto' : '') + '" ' + (attr || '') + (spento ? ' disabled' : '') + '><b>+</b>' + esc(testo) + '</button>';
  }
  function porta(ic, nome, n, dentro) {
    return '<details><summary><span class="ic">' + ic + '</span><b>' + esc(nome) + '</b><span class="n">' + esc(n || "") + '</span><i>›</i></summary><div class="dentro">' + dentro + '</div></details>';
  }

  function disegna(d) {
    var D = document;
    /* 0 · Dove sei */
    var ds = D.getElementById("dove-sei");
    if (ds) ds.hidden = !!d.comune || !d.io;

    /* 1 · Karma yoga */
    var presiId = {}, richieste = [], lontane = [], presi = [], mie = [], fatti = [];
    d.karma.forEach(function (o) {
      var den = d.dentro[o.id] || [];
      var mio = den.some(function (r) { return r.persona_id === d.io; });
      /* ⭐ 1 ottobre, Gab: karma yoga = «la richiesta di cosa c'è bisogno»; quando è fatto (sviluppato) non è più una richiesta */
      if (o.persona_id === d.io) (o.stadio === "sviluppato" ? fatti : mie).push(o);
      else if (mio) presi.push(o);
      else if (o.stadio !== "sviluppato") (vicino(d, o) ? richieste : lontane).push(o);
    });
    var rk = function (o) {
      var den = (d.dentro[o.id] || []).length, serve = o.quanti_servono;
      var s = [o.luogo, o.entro_il ? "entro " + o.entro_il.split("-").reverse().slice(0, 2).join("/") : "", serve ? den + " su " + serve : (den ? den + " dentro" : "")].filter(Boolean).join(" · ");
      return riga(o, s);
    };
    /* ⭐ 1 ottobre, Gab — le sue parole: */
    var hK = '<p class="intro">il karma yoga è l’azione disinteressata, messa a disposizione per la comunità, attività che ripulisce dalle azioni del passato, ponendoti in un senso di servizio</p>' +
             fascia("richieste vicino a te", richieste.map(rk).join(""), "nessuna richiesta aperta qui vicino") +
             fascia("richieste lontano", lontane.map(rk).join(""), "") +
             fascia("quello che hai preso", presi.map(rk).join(""), "") +
             fascia("le tue richieste", mie.map(rk).join(""), "") +
             fascia("il tuo karma yoga fatto", fatti.map(rk).join(""), "") +
             '<div class="gesti">' + tasto("chiedo una mano", 'data-scrivi="karma_yoga"') + '</div>';
    /* 2 · Villaggio Felicitas
       ⭐ 1 ottobre, Gab: «villaggio felicitas acquisisce la scritta - Civiltà Sarda - nel momento in cui dici di dove sei …
          nell'elenco ci sarà chi coordina, i partecipanti, i luoghi, e la possibilità di attivare un vicinato».
       ⛔ La regione → civiltà per ora vale solo per la Sardegna: le aree/civiltà si definiscono dopo.
          Il villaggio (l'orma micelio) si riconosce dal nome finché non è legato alla civiltà nel database. */
    var civ = civilta(d.comune);
    var vil = civ ? d.villaggi.filter(function (v) { return civ.cerca.test(titolo(v)); })[0] || null : null;
    /* ⭐ 2 ottobre 12:40, Gab: «non è solo dici dove sei, ma dici qual è la tua identità di radice» —
       le radici scelte valgono più del comune */
    var vilR = d.radice ? d.villaggi.filter(function (v) { return v.id === d.radice; })[0] : null;
    if (vilR) { vil = vilR; civ = { nome: String(titolo(vilR)).split(/\s[–—-]\s/)[1] || titolo(vilR) }; }
    radici(d, civilta(d.comune));
    var hV = "";
    if (civ) {
      var den = vil ? (d.dentro[vil.id] || []) : [];
      var nome = function (r) { return '<span class="pers">' + esc(r.nome || "( )") + '</span>'; };
      var coordV = den.filter(function (r) { return r.ruolo === "coordinatore"; });
      var partV = den.filter(function (r) { return r.ruolo !== "coordinatore"; });
      var luV = vil ? d.luoghi.filter(function (l) { return l.orma_madre_id === vil.id; }) : [];
      hV += (vil ? riga(vil, den.length === 1 ? "1 persona" : den.length + " persone") : "") +
            fascia("chi coordina", coordV.map(nome).join(" "), "( )") +
            fascia("i partecipanti", partV.map(nome).join(" "), "( )") +
            fascia("i luoghi", luV.map(function (l) { return riga(l, l.luogo || ""); }).join(""), "( )");
    } else if (d.comune) hV += '<div class="vuoto">area da attivare in felicitas</div>';   /* ⭐ 1 ottobre, Gab: le sue parole, per chi è in una zona senza civiltà */
    else hV += '<div class="vuoto">( )</div>';   /* ⭐ Gab: «l'importante è che non esca civiltà sarda per chi non è di quella» — senza civiltà, nessun villaggio altrui */
    /* ⭐ 1 ottobre, Gab: «attiva un vicinato» crea un'orma dentro il villaggio della sua civiltà, visibile nelle orme del villaggio.
       Dove il villaggio non c'è ancora, resta spento. */
    if (d.radice) hV += '<a class="voce va" href="#" data-cambia-radici>cambia le tue radici<i>›</i></a>';
    hV += '<div class="gesti">' + (vil ? tasto("attiva un vicinato", 'data-vicinato="' + esc(vil.id) + '"') : tasto("attiva un vicinato", "", true)) + '</div>';

    /* 3 · Oggi / calendario */
    var oggi = new Date(); oggi.setHours(0, 0, 0, 0);
    var domani = new Date(oggi.getTime() + 864e5);
    var data = function (o) { var s = o.inizio_il || o.accaduto_il; return s ? new Date(s) : null; };
    var ev = d.eventi.filter(function (o) { return data(o); });
    var futuri = ev.filter(function (o) { return data(o) >= oggi; }).sort(function (a, b) { return data(a) - data(b); });
    var passati = ev.filter(function (o) { return data(o) < oggi; }).sort(function (a, b) { return data(b) - data(a); });
    var re = function (o) { return riga(o, [quando(o), o.luogo].filter(Boolean).join(" · "), o.categoria === "riunione" ? "riunione" : "", 'data-evento="' + esc(o.id) + '"'); };
    var diOggi = futuri.filter(function (o) { return data(o) < domani; });
    var prossimi = futuri.filter(function (o) { return data(o) >= domani; });
    var hC = fascia("oggi", diOggi.filter(function (o) { return vicino(d, o); }).map(re).join(""), "niente oggi qui vicino") +
             fascia("i prossimi giorni", prossimi.filter(function (o) { return vicino(d, o); }).map(re).join(""), "") +
             fascia("più lontano", futuri.filter(function (o) { return !vicino(d, o); }).map(re).join(""), "") +
             (passati.length ? '<details class="archivio"><summary>archivio · ' + passati.length + '</summary>' + passati.slice(0, 20).map(re).join("") + '</details>' : "") +
             '<div class="gesti">' + tasto("propongo un incontro", 'data-scrivi="festa"') + '</div>';

    /* 4 · Novità — Antaḥkaraṇa solo quando c'è qualcosa */
    var nv = d.novita;
    var rn = function (o) {
      var att = o.articolo_url ? 'data-url="' + esc(o.articolo_url) + '"' : null;
      return riga(o, [o.tipo === "rubrica_radio" ? "radio" : "articolo", o.luogo, giornoMese(o.accaduto_il || o.momento)].filter(Boolean).join(" · "), "", att);
    };
    /* tre in vista; il resto dietro «leggi tutto», per mese e anno */
    var aMesi = function (lista) {
      if (lista.length <= 3) return lista.map(rn).join("");
      var h = lista.slice(0, 3).map(rn).join(""), g = {}, ord = [];
      lista.slice(3).forEach(function (o) {
        var x = new Date(o.accaduto_il || o.momento), k = isNaN(x) ? "" : MESI[x.getMonth()] + " " + x.getFullYear();
        if (!g[k]) { g[k] = []; ord.push(k); } g[k].push(o);
      });
      return h + '<details class="archivio"><summary>leggi tutto · ' + (lista.length - 3) + '</summary>' +
        ord.map(function (k) { return '<div class="mese">' + esc(k) + '</div>' + g[k].map(rn).join(""); }).join("") + '</details>';
    };
    var hN = fascia("vicino a te", aMesi(nv.filter(function (o) { return vicino(d, o); })), "ancora niente qui vicino") +
             fascia("lontano", aMesi(nv.filter(function (o) { return !vicino(d, o); })), "") +
             '<div class="gesti">' + tasto("scrivo un articolo", 'data-scrivi="articolo"') +
             tasto("chiedo uno spazio radio", "", true) + tasto("inserisco una puntata", "", true) + '</div>' +
             '<p class="nota-r">Le puntate: solo vostre o di cui avete i diritti. Chi fa la regia carica l’mp3 della puntata, oppure il suo link.</p>';

    D.getElementById("porte").innerHTML =
      porta("◇", "Karma yoga", richieste.length ? richieste.length + (richieste.length === 1 ? " richiesta" : " richieste") : "", hK) +
      porta("◎", "Villaggio Felicitas" + (civ ? " – " + civ.nome : ""), "", hV) +
      porta("☾", "Oggi / calendario", futuri.length ? futuri.length + " in arrivo" : "", hC) +
      porta("✦", "Novità", nv.length ? String(nv.length) : "", hN);

    Array.prototype.forEach.call(D.querySelectorAll("#porte [data-orma]"), function (a) { a.onclick = function (e) { e.preventDefault(); apriOrma(a.getAttribute("data-orma")); }; });
    Array.prototype.forEach.call(D.querySelectorAll("#porte [data-url]"), function (a) { a.onclick = function (e) { e.preventDefault(); try { W.open(a.getAttribute("data-url"), "_blank", "noopener"); } catch (x) {} }; });
    Array.prototype.forEach.call(D.querySelectorAll("#porte [data-evento]"), function (a) { a.onclick = function (e) { e.preventDefault(); vai("evento", { id: a.getAttribute("data-evento") }); }; });
    Array.prototype.forEach.call(D.querySelectorAll("#porte [data-vicinato]"), function (a) { a.onclick = function () {
      try { if (W.SpazioVivo && W.SpazioVivo.nuovaOrma) W.SpazioVivo.nuovaOrma(a.getAttribute("data-vicinato"), { tipo: "contatto" }); } catch (e) {}
    }; });
    Array.prototype.forEach.call(D.querySelectorAll("#porte [data-cambia-radici]"), function (a) { a.onclick = function (e) {
      e.preventDefault(); cambiaRadici = true; radici(d, civilta(d.comune));
      var rb = D.getElementById("radici"); if (rb) rb.scrollIntoView({ behavior: "smooth", block: "center" });
    }; });
    Array.prototype.forEach.call(D.querySelectorAll("#porte [data-scrivi]"), function (a) { a.onclick = function () { scrivi({ tipo: a.getAttribute("data-scrivi") }); }; });
    if (typeof window.legaPorte === "function") window.legaPorte();
  }
  function giornoMese(s) { if (!s) return ""; var x = new Date(s); return isNaN(x) ? "" : x.getDate() + " " + MESI[x.getMonth()]; }

  /* ── 0 · le tue radici: la civiltà in cui ti senti risuonare ───────
     ⭐ 2 ottobre 12:40, Gab: «In che contesto ti senti risuonare? Qual è la tua civiltà d'origine?
        In cosa senti essere le tue radici?» — chi sceglie entra nella chat di quel villaggio. */
  var cambiaRadici = false;
  function radici(d, suggerita) {
    var D = document, box = D.getElementById("radici");
    if (!box) {
      var ds = D.getElementById("dove-sei"); if (!ds) return;
      box = D.createElement("div"); box.className = "dove-sei"; box.id = "radici";
      ds.parentNode.insertBefore(box, ds);
    }
    var vill = d.villaggi.slice().sort(function (a, b) { return String(titolo(a)).localeCompare(String(titolo(b))); });
    box.hidden = !d.io || !vill.length || (!!d.radice && !cambiaRadici);
    if (box.hidden) return;
    var nome = function (v) { return String(titolo(v)).split(/\s[–—-]\s/)[1] || titolo(v); };
    /* ⭐ 13:14, Gab: «una sola domanda: qual è la civiltà d'origine. Diamo la possibilità di aggiungere altre non presenti» —
       chi non trova la sua la scrive, e arriva a Casa Radice */
    box.innerHTML = '<b>le tue radici</b>' +
      '<p>Qual è la tua civiltà d’origine?</p>' +
      '<div class="esiti">' + vill.map(function (v) {
        var s = (suggerita && suggerita.cerca && suggerita.cerca.test(titolo(v))) || v.id === d.radice;
        return '<button type="button" data-radice="' + esc(v.id) + '"' + (s ? ' style="background:rgba(212,175,106,.18)"' : '') + '>' + esc(nome(v)) + '</button>';
      }).join("") + '<button type="button" data-altra>+ un’altra</button></div>' +
      '<div data-altra-box style="display:none;flex-direction:column;gap:.45rem"><input type="text" placeholder="la tua civiltà d’origine" autocomplete="off">' +
      '<button type="button" data-altra-manda style="all:unset;cursor:pointer;align-self:flex-start;padding:.35rem .9rem;border-radius:999px;background:#D4AF6A;color:#0A0C1A;font-size:.85rem">manda</button><small style="color:rgba(245,240,230,.6)"></small></div>';
    var ab = box.querySelector("[data-altra-box]");
    box.querySelector("[data-altra]").onclick = function () { var su = ab.style.display === "none"; ab.style.display = su ? "flex" : "none"; if (su) ab.querySelector("input").focus(); };
    box.querySelector("[data-altra-manda]").onclick = async function () {
      var inp = ab.querySelector("input"), sm = ab.querySelector("small"), v = inp.value.trim();
      if (!v) { sm.textContent = "scrivi il nome"; return; }
      var b = await db(); if (!b) return;
      var r = await b.rpc("fm_scrivi_casa_radice", { p_testo: "civiltà d’origine da aggiungere: " + v });
      if (r.error) { sm.textContent = "non partito: riprova"; console.warn("radici:", r.error); return; }
      inp.value = ""; sm.textContent = "arrivato a Casa Radice";
    };
    Array.prototype.forEach.call(box.querySelectorAll("[data-radice]"), function (bt) {
      bt.onclick = async function () {
        var b = await db(); if (!b) return;
        bt.textContent = "un momento…";
        var r = await b.rpc("fm_mia_radice", { p_orma: bt.getAttribute("data-radice") });
        if (r.error) { bt.textContent = "non riuscito: riprova"; console.warn("radici:", r.error); return; }
        cambiaRadici = false;
        try { if (W.FMChat) W.FMChat.aggiorna(); } catch (e) {}
        disegna(await leggi());
      };
    });
  }

  /* ── 0 · dove sei: cerca il comune, o la posizione ─────────────── */
  function doveSei(ricarica) {
    var box = document.getElementById("dove-sei"); if (!box) return;
    var inp = box.querySelector("input"), lis = box.querySelector(".esiti"), geo = box.querySelector("[data-geo]");
    async function salva(cod) {
      var b = await db(); if (!b) return;
      var u = await b.auth.getUser(); var id = u && u.data && u.data.user && u.data.user.id; if (!id) return;
      var r = await b.from("persone").update({ comune_cod: cod }).eq("id", id);
      if (!r.error) ricarica();
    }
    var T = null;
    inp.oninput = function () {
      clearTimeout(T); var q = inp.value.trim(); if (q.length < 2) { lis.innerHTML = ""; return; }
      T = setTimeout(async function () {
        var b = await db(); if (!b) return;
        var r = await b.from("territori").select("codice,nome").eq("tipo", "comune").ilike("nome", q + "%").order("nome").limit(8);
        lis.innerHTML = (r.data || []).map(function (c) { return '<button type="button" data-cod="' + esc(c.codice) + '">' + esc(c.nome) + '</button>'; }).join("");
        Array.prototype.forEach.call(lis.querySelectorAll("button"), function (bt) { bt.onclick = function () { salva(bt.getAttribute("data-cod")); }; });
      }, 250);
    };
    geo.onclick = function () {
      if (!navigator.geolocation) return;
      geo.textContent = "un momento…";
      navigator.geolocation.getCurrentPosition(async function (p) {
        var b = await db(); if (!b) return;
        var la = p.coords.latitude, lo = p.coords.longitude;
        var r = await b.from("territori").select("codice,nome,lat,lon").eq("tipo", "comune")
          .gte("lat", la - .2).lte("lat", la + .2).gte("lon", lo - .25).lte("lon", lo + .25).limit(400);
        var best = null, bd = 1e9;
        (r.data || []).forEach(function (c) { var k = km({ lat: la, lon: lo }, c); if (k != null && k < bd) { bd = k; best = c; } });
        if (best) salva(best.codice); else geo.textContent = "non trovo il comune: scrivilo";
      }, function () { geo.textContent = "posizione non disponibile: scrivi il comune"; });
    };
  }

  async function avvia() {
    var giro = async function () { disegna(await leggi()); };
    doveSei(giro);
    await giro();
  }
  window.FMVicinatiTempio = { avvia: avvia };
})();
