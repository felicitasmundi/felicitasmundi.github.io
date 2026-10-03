/* ═══════════════════════════════════════════════════════════════
   FM-EVENTO — la pagina pubblica di un evento, dalla versione piatta.

   ⭐ Il disegno è tutto di Design: evento-pubblico-piatto.html.
      Si apre SENZA account: è uno dei quattro spiragli del muro
      (?p=evento&e=<id>). Chi arriva da un invito o da un QR la vede.

   CHI VEDE COSA — decisioni di Gab:
     · chi organizza si vede anche da fuori
     · chi ha aderito: DA FUORI solo il numero, niente volti
       (fm_orma_dentro_conta); CON L'ACCOUNT i volti
     · il numero non promette quanti verranno: dice quanti sono
       entrati — «Chi ha aderito all'evento»

   IL TASTO «ci sarò»:
     · senza account → accesso.html?torna=… e poi si torna qui
     · con l'account → fm_prendi_orma, e si entra nell'orma della festa
     · già dentro → si entra nell'orma

   ⚠️ ASPETTANO:
     · il COGNOME di chi organizza: la vista delle persone non lo porta
       ancora (arriva col revoke). Resta vuoto.
     · «il gruppo» sotto chi organizza: la pagina del gruppo non esiste.
       Resta vuoto.
     · ✅ le quattro frasi degli stati sono quelle di Design senza le quadre:
       approvate da Gab il 23 settembre.

   Vuole:   fm-piatto.js prima · `db` (Supabase) · `vai`
   Espone:  SpazioVivo.evento(dove, idEvento)
   ═══════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  var INDIRIZZO = "APP.FELICITASMUNDI/piatti/evento-pubblico-piatto.html";
  var GIORNI = ["domenica","lunedì","martedì","mercoledì","giovedì","venerdì","sabato"];
  var MESI = ["gennaio","febbraio","marzo","aprile","maggio","giugno","luglio",
              "agosto","settembre","ottobre","novembre","dicembre"];
  var TIPI = { festa: "festa", luogo: "luogo", mercato: "mercato",
               karma_yoga: "karma yoga", obiettivo: "obiettivo" };

  var F = function () { return window.FMPiatto; };

  /* «sabato 21 novembre, 10:00» — l'ora solo se c'è */
  function quando(o) {
    var s = o.inizio_il || o.accaduto_il;
    if (!s) return "";
    var x = new Date(s);
    if (isNaN(x)) return "";
    var t = GIORNI[x.getDay()] + " " + x.getDate() + " " + MESI[x.getMonth()];
    if (o.inizio_il) t += ", " + String(x.getHours()).padStart(2, "0") + ":" +
                               String(x.getMinutes()).padStart(2, "0");
    return t;
  }
  function passato(o) {
    var s = o.inizio_il || o.accaduto_il;
    if (!s) return false;
    var x = new Date(s), oggi = new Date();
    if (!o.inizio_il) { x.setHours(23, 59, 59); }
    return x < oggi;
  }

  /* ── leggere ───────────────────────────────────────────────────── */
  async function leggi(id) {
    var d = { orma: null, io: null, autore: null, aderenti: 0, volti: [], dentro: false };
    try {
      var u = await db.auth.getUser();
      d.io = u && u.data && u.data.user && u.data.user.id;

      var o = await db.from("orme")
        .select("id,titolo,contenuto,tipo,elemento,luogo,accaduto_il,inizio_il," +
                "immagine_url,persona_id,quanti_servono,orma_madre_id,visibilita")
        .eq("id", id).single();
      if (o.error) return d;
      d.orma = o.data;

      /* ⭐ 1 ottobre, Gab: l'incontro dell'11 «è una task dentro festival», e chi entra
         entra anche nel festival e nel micelio. Si risale la catena delle madri. */
      d.madri = [];
      var su = d.orma.orma_madre_id;
      for (var k = 0; su && k < 4; k++) {
        var m = await db.from("orme").select("id,titolo,tipo,orma_madre_id").eq("id", su).limit(1);
        if (m.error || !m.data || !m.data[0]) break;
        d.madri.push(m.data[0]); su = m.data[0].orma_madre_id;
      }

      /* ⭐ 2 ottobre 16:36, Gab: nei villaggi gli eventi sono del gruppo — chi coordina scrive e lancia */
      d.villaggio = d.orma.tipo === "micelio" ? d.orma.id : ((d.madri.filter(function (m) { return m.tipo === "micelio"; })[0] || {}).id || null);
      d.coordina = false;
      if (d.io && d.villaggio) { try { var fc = await db.rpc("fm_coordina", { p_villaggio: d.villaggio }); d.coordina = !fc.error && fc.data === true; } catch (e) {} }
      /* chi organizza: si vede anche da fuori */
      var a = await db.rpc("fm_orma_autore", { p_orma: id });
      var au = a.error ? null : (Array.isArray(a.data) ? a.data[0] : a.data);
      if (au) d.autore = { id: au.id, nome: au.nome || "" };
      if (d.autore) {   /* ⭐ 2 ottobre: anche da fuori, per la scheda di chi organizza */
        var pp = await db.from("persone_pubbliche").select("foto_url,nome_url")
          .eq("id", d.autore.id).limit(1);
        if (!pp.error && pp.data && pp.data[0]) {
          d.autore.foto_url = pp.data[0].foto_url;
          d.autore.nome_url = pp.data[0].nome_url;
        }
      }

      /* quanti hanno aderito: da fuori solo il numero */
      var n = await db.rpc("fm_orma_dentro_conta", { p_orma: id });
      d.aderenti = n.error ? 0 : (Number(n.data) || 0);

      /* i volti, solo a chi ha l'account */
      if (d.io) {
        var op = await db.from("orma_persone").select("persona_id,nome")
          .eq("orma_id", id).not("preso_il", "is", null).is("lasciato_il", null);
        d.volti = op.error ? [] : (op.data || []);
        d.dentro = d.volti.some(function (v) { return v.persona_id === d.io; });
        var pid = d.volti.map(function (v) { return v.persona_id; }).filter(Boolean);
        if (pid.length) {
          var pv = await db.from("persone_pubbliche").select("id,foto_url,nome_url").in("id", pid);
          var per = {};
          (pv.error ? [] : pv.data || []).forEach(function (r) { per[r.id] = r; });
          d.volti.forEach(function (v) { v.profilo = per[v.persona_id] || {}; });
        }
      }
    } catch (e) { console.warn("evento:", e); }
    return d;
  }

  /* ── dove si va ────────────────────────────────────────────────── */
  /* ⚠️ accesso.html conserva «da dove si veniva» e riporta qui */
  /* ⭐ 2 ottobre, Gab: chi arriva da un invito sull'evento (…&invito=<nome>) porta l'invito all'accesso */
  function invitoQui() {
    try { var v = new URLSearchParams(location.search).get("invito"); return v ? "&invito=" + encodeURIComponent(v) : ""; }
    catch (e) { return ""; }
  }
  function accesso(torna) {
    return "accesso.html?torna=" + encodeURIComponent(torna || (location.pathname + location.search)) + invitoQui();
  }
  function entra(id) {
    if (window.SpazioVivo && typeof window.SpazioVivo.apriOrma === "function")
      return window.SpazioVivo.apriOrma(id);
    if (typeof window.vai === "function") window.vai("orma", { id: id });
  }

  function quadranti(R, testo) {
    var doc = R.ownerDocument || document;
    var box = R.querySelector('[data-c="orma.contenuto"]'); if (!box) return;
    var vecchi = R.querySelector("#ev-quadranti"); if (vecchi) vecchi.remove();
    if (!/^##\s+/m.test(testo)) { box.hidden = !testo.trim(); return; }
    var parti = testo.split(/^##\s+/m), testa = parti.shift().trim();
    box.textContent = testa; box.hidden = !testa;
    var esc = function (x) { return String(x).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
    var w = doc.createElement("div"); w.id = "ev-quadranti";
    w.innerHTML = parti.map(function (p, i) {
      var righe = p.split("\n"), tit = righe.shift().trim(), corpo = righe.join("\n").trim();
      var html = corpo.split(/\n\s*\n/).map(function (par) {
        var l = par.split("\n");
        if (l.every(function (x) { return /^\s*[-·•]\s+/.test(x); }))
          return "<ul>" + l.map(function (x) { return "<li>" + esc(x.replace(/^\s*[-·•]\s+/, "")) + "</li>"; }).join("") + "</ul>";
        return "<p>" + esc(par).replace(/\n/g, "<br>") + "</p>";
      }).join("");
      return '<details class="ev-q"' + (i === 0 ? " open" : "") + '><summary>' + esc(tit) + '</summary><div>' + html + '</div></details>';
    }).join("");
    var dopo = R.querySelector("#ev-invita") || box;   /* ⭐ 2 ottobre: i capitoli vengono dopo «invita chi risuona» */
    dopo.parentNode.insertBefore(w, dopo.nextSibling);
  }

  /* ── disegnare ─────────────────────────────────────────────────── */
  function disegna(R, d, id, ricarica) {
    var P = F(), o = d.orma || {}, au = d.autore || {};
    var pieno = !!(o.quanti_servono && d.aderenti >= o.quanti_servono);

    P.riempi(R, {
      orma: { titolo: o.titolo || "", contenuto: o.contenuto || "",
              tipo: TIPI[o.tipo] || o.tipo || "", luogo: o.luogo || "",
              accaduto_il: quando(o), immagine_url: o.immagine_url || "" },
      persona: { nome: au.nome || "", cognome: "", foto_url: au.foto_url || "",
                 nome_url: au.nome_url ? "?p=" + au.nome_url : "" },
      conto: { aderenti: String(d.aderenti) },
      madre: { titolo: d.madri && d.madri[0] ? (d.madri[0].titolo || "") : "" }
    });
    /* ⭐ 1 ottobre 21:14, Gab: «ok pubblica i testi nell'evento» — la descrizione in quadranti con titolo.
       Nel testo dell'evento ogni riga «## Titolo» apre un quadrante; quello che sta prima resta in alto. */
    quadranti(R, o.contenuto || "");
    /* ⭐ 2 ottobre 16:51, Gab: «inserisci anche un quadrante con la descrizione di felicitas, prendendo i dati
       dall'attuale format … perché le persone vogliono sapere anche cosa è» — in ogni evento, dopo i capitoli.
       Le parole sono di Gab (il racconto del Felicitas Festival, «L'iniziativa»). */
    (function () {
      var doc = R.ownerDocument || document, vec = R.querySelector("#ev-felicitas"); if (vec) vec.remove();
      var w = doc.createElement("details"); w.className = "ev-q"; w.id = "ev-felicitas"; w.style.marginTop = ".6rem";
      w.innerHTML = '<summary>Cos’è FelicitasMundi</summary><div>' +
        '<p>FelicitasMundi è una piattaforma che connette e supporta lo sviluppo economico e sociale di comunità contadine e spirituali dei territori nazionali.</p>' +
        '<p>Permette la facilitazione della connessione tra comunità, famiglie, aziende agricole, operatori terapeutici e insegnanti che vivono in contesti rurali e contadini, e che difficilmente riescono a entrare in connessione, se non attraverso le ordinarie piattaforme virtuali.</p>' +
        '<p>Noi invece cerchiamo di proporre uno strumento innovativo che unisce coscienza e tecnologia, e che tende a facilitare l’acquisto di beni — prodotti alimentari, rimedi e oggettistica —, l’acquisto di trattamenti, assistenza e consulenza, l’acquisto di lezioni; e a facilitare l’interscambio di doni, di prodotti, di rimedi naturali, per trovare un modo di sostenere e accompagnare all’autosufficienza alimentare ed energetica.</p></div>';
      var dopo = R.querySelector("#ev-quadranti") || R.querySelector("#ev-invita") || R.querySelector('[data-c="orma.contenuto"]');
      if (dopo) dopo.parentNode.insertBefore(w, dopo.nextSibling);
    })();
    /* ⭐ 2 ottobre, Gab: chi ha aperto l'evento scrive i capitoli a mano (titolo d'oro, testo chiaro) */
    (function () {
      var vecchio = R.querySelector("#cap-apri"); if (vecchio) vecchio.remove();
      var vl = R.querySelector("#ev-lancia"); if (vl) vl.remove();
      if (!window.FMCapitoli || !d.io || (o.persona_id !== d.io && !d.coordina)) return;
      var doc = R.ownerDocument; window.FMCapitoli.veste(doc);
      var b = doc.createElement("button"); b.type = "button"; b.id = "cap-apri"; b.className = "cap-apri";
      b.textContent = "scrivi i capitoli";
      var dopo = R.querySelector("#ev-quadranti") || R.querySelector("#ev-invita") || R.querySelector('[data-c="orma.contenuto"]');
      if (!dopo) return;
      dopo.parentNode.insertBefore(b, dopo.nextSibling);
      /* ⭐ «la presentazione evento rimondini la facciamo partire subito dopo»: un'orma del villaggio ancora
         nascosta si lancia da qui, solo chi coordina */
      if (d.coordina && d.villaggio && o.visibilita && o.visibilita !== "pubblico") {
        var L = doc.createElement("button"); L.type = "button"; L.id = "ev-lancia"; L.className = "cap-apri";
        L.textContent = "lancia: rendila visibile a tutti";
        b.parentNode.insertBefore(L, b.nextSibling);
        L.onclick = async function () {
          L.textContent = "un momento…";
          var rl = await db.rpc("fm_lancia", { p_orma: id });
          if (rl.error) { L.textContent = "non riuscito: riprova"; console.warn("lancia:", rl.error); return; }
          await ricarica();
        };
      }
      b.onclick = function () {
        var box = R.querySelector('[data-c="orma.contenuto"]'), q = R.querySelector("#ev-quadranti");
        if (box) box.hidden = true; if (q) q.hidden = true; b.hidden = true;
        window.FMCapitoli.editor(doc, b, o.contenuto || "", async function (testo) {
          var r = await db.rpc("fm_scrivi_capitoli", { p_orma: id, p_testo: testo });
          if (r.error) { r = await db.from("orme").update({ contenuto: testo }).eq("id", id); }   /* prima dell'SQL 30 */
          if (r.error) throw r.error;
          await ricarica();
        }, function () { if (box) box.hidden = false; if (q) q.hidden = false; b.hidden = false; });
      };
    })();
    P.stato(R, "ha-madre", !!(d.madri && d.madri[0]));
    if (d.madri && d.madri[0]) P.gesto(R, "apri-madre", function () {
      /* ⭐ 3 ottobre 13:59, Gab: il villaggio non si apre come un evento («è passata», «senza immagine»):
         si va nei Vicinati, sul villaggio vero */
      if (d.madri[0].tipo === "micelio" && typeof window.vai === "function") { window.vicinatiApri = d.madri[0].id; return window.vai("vicinati"); }
      if (typeof window.vai === "function") window.vai("evento", { id: d.madri[0].id });
    });
    var W = R.ownerDocument && R.ownerDocument.defaultView;
    if (W && W.fmVeste) W.fmVeste(o.elemento);
    /* ⭐ 2 ottobre 16:35, Gab: «non compare neanche chi lo organizza … è un default di felicitasmundi» —
       sugli eventi dei villaggi nessun organizzatore, a livello di matrice */
    Array.prototype.forEach.call(R.querySelectorAll("a.ev-organizza"), function (el) { el.style.display = d.villaggio ? "none" : ""; });
    /* «il gruppo»: la pagina del gruppo non c'è ancora */
    Array.prototype.forEach.call(R.querySelectorAll('[data-c="organizzazione"]'),
      function (el) { el.textContent = ""; el.removeAttribute("href"); });

    /* le quattro frasi degli stati: parole di Gab, quelle di Design senza
       le quadre — «nessuno ancora · ci sei anche tu · al completo · è passata».
       ⚠️ Quando Design toglie le quadre dal disegno, questo non fa più niente. */
    ["nessuno", "gia-dentro", "pieno", "passato"].forEach(function (s) {
      Array.prototype.forEach.call(R.querySelectorAll('[data-stato="' + s + '"]'), function (el) {
        if (!el.children.length) el.textContent = el.textContent.replace(/\[\s*([^\]]*?)\s*\]/g, "$1");
      });
    });

    P.stato(R, "senza-foto", !o.immagine_url);
    P.stato(R, "passato", passato(o));
    P.stato(R, "da-fuori", !d.io);
    P.stato(R, "gia-dentro", !!d.dentro);
    P.stato(R, "nessuno", d.aderenti === 0);
    P.stato(R, "pieno", pieno);

    /* i volti: solo con l'account */
    P.stampa(R, "dentro", d.io ? d.volti : [], function (c, v) {
      var pr = v.profilo || {};
      P.riempi(c, { dentro: { nome: v.nome || "", foto_url: pr.foto_url || "",
                              nome_url: pr.nome_url ? "?p=" + pr.nome_url : "" } });
    });

    /* ⭐ 2 ottobre 09:11, Gab: «se schiaccio organizza gabriele non si apre una finestra con bio e foto»
       — come «aperta da» dentro l'orma: foto, nome e biografia (se la biografia viaggia). */
    var org = R.querySelector("a.ev-organizza");
    if (org && d.autore) org.onclick = async function (e) {
      e.preventDefault(); e.stopPropagation();
      var doc = R.ownerDocument, vecchia = doc.getElementById("chi-scheda"); if (vecchia) { vecchia.remove(); return; }
      var c = { nome: d.autore.nome || "", foto_url: d.autore.foto_url || "", biografia: "", cognome: "" };
      try { if (d.autore.nome_url) { var r = await db.rpc("fm_chi_invita", { p_nome_url: d.autore.nome_url }); var x = !r.error && r.data && (Array.isArray(r.data) ? r.data[0] : r.data); if (x) { c.cognome = x.cognome || ""; c.biografia = x.biografia || ""; if (x.foto_url) c.foto_url = x.foto_url; } } } catch (er) {}
      var w = doc.createElement("div"); w.id = "chi-scheda";
      var esc = function (t) { return String(t).replace(/[&<>"]/g, function (k) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[k]; }); };
      w.innerHTML = (c.foto_url ? '<img alt="" src="' + esc(c.foto_url) + '">' : '') + '<div><b>' + esc([c.nome, c.cognome].filter(Boolean).join(" ")) + '</b>' + (c.biografia ? '<p>' + esc(c.biografia).replace(/\n/g, "<br>") + '</p>' : '') + '</div><button type="button" aria-label="chiudi">&times;</button>';
      org.parentNode.insertBefore(w, org.nextSibling);
      w.querySelector("button").onclick = function () { w.remove(); };
    };

    /* ⭐ 2 ottobre, Gab — «invita chi risuona» e «entra nel villaggio»
       Matrice (Gab): «è sbagliato dire entra nel vicinato, meglio entra nel villaggio -
       civiltà sarda». Il villaggio è l'orma micelio fra le madri (o l'orma stessa);
       il nome viene dal suo titolo: «Villaggio Felicitas – Civiltà Sarda» → «entra nel
       villaggio – civiltà sarda». Senza villaggio, il tasto non c'è. */
    P.gesto(R, "invita", function () {
      /* ⭐ 3 ottobre 13:59, Gab: toccando il tasto si legge «copia» o «condividi via WhatsApp», col link dell'evento */
      if (window.FMInvito && window.FMInvito.condividi) {
        var m = window.FMInvito.perEvento(id, o.titolo);
        return window.FMInvito.condividi(R.querySelector('[data-g="invita"]'), { url: m.url, testo: m.testo, titolo: o.titolo });
      }
      /* ⭐ 2 ottobre 09:12, Gab: l'invito porta all'evento, e «chiudi» riporta qui */
      if (window.SpazioVivo && typeof window.SpazioVivo.invito === "function") return window.SpazioVivo.invito({ evento: id });
      location.href = "invito.html";
    });
    var vil = o.tipo === "micelio" ? o : (d.madri || []).filter(function (m) { return m.tipo === "micelio"; })[0];
    var tVil = R.querySelector('[data-g="entra-villaggio"]');
    if (tVil) {
      if (!vil || o.tipo === "micelio") tVil.hidden = true;
      else {
        var civ = String(vil.titolo || "").split(/\s[–—-]\s/)[1];
        tVil.firstChild.nodeValue = "entra nel villaggio" + (civ ? " – " + civ.trim().toLowerCase() : "") + " ";
      }
    }
    /* ⭐ 2 ottobre 09:13, Gab: «scarica l'app» prima di «entra nel villaggio», e dopo si torna qui */
    if (window.FMScarica) window.FMScarica.metti(R, "index.html?p=evento&e=" + id + invitoQui(), tVil || R.querySelector("#ev-invita"));
    /* ⭐ 2 ottobre 15:54, Gab: «entra in vicinato sardo, ti dovrebbe portare nella pagina vicinati, si apre la tendina
       e ti fa mettere foto e bio e figuri tra le persone visibili nella finestra villaggio felicitas civiltà sarda» */
    P.gesto(R, "entra-villaggio", async function () {
      if (!vil) return;
      if (!d.io) { location.href = accesso("index.html?p=vicinati&entra=" + vil.id); return; }
      try { await db.rpc("fm_mia_radice", { p_orma: vil.id }); } catch (e) {}
      window.vicinatiEntra = vil.id;
      if (typeof window.vai === "function") window.vai("vicinati");
    });
    /* «ci sarò» */
    P.gesto(R, "ci-saro", async function () {
      if (!d.io) { location.href = accesso(); return; }
      if (!d.dentro && !pieno) {
        try {
          var r = await db.rpc("fm_prendi_orma", { p_orma: id });
          if (r.error) throw r.error;
        } catch (e) { console.warn("evento:", e); return; }
        /* ⭐ chi entra nell'incontro entra anche nelle orme madri: il festival, il micelio.
           Se una non lo accetta (è già dentro, o è chiusa) si va avanti lo stesso. */
        for (var k = 0; k < (d.madri || []).length; k++) {
          try { await db.rpc("fm_prendi_orma", { p_orma: d.madri[k].id }); } catch (e) {}
        }
      }
      /* ⭐ Gab: «il link 11 … porta comunque dentro orma festival» — si entra nella prima madre
         che è una festa; se non c'è, nell'orma stessa */
      var festa = (d.madri || []).filter(function (m) { return m.tipo === "festa"; })[0];
      entra(festa ? festa.id : id);
    });
  }

  /* ── la porta ──────────────────────────────────────────────────── */
  async function evento(dove, id) {
    var box = typeof dove === "string" ? document.querySelector(dove) : dove;
    if (box && !id && window.FMChiuso) { var se = await window.db.auth.getSession(); return window.FMChiuso(box, se && se.data && se.data.session); }
    if (!box || !id || !window.FMPiatto) return;
    /* ⭐ 2 ottobre 21:54, Gab: «prima ti mostra la pagina matrice e poi mette le parole giuste» — i dati si leggono
       mentre la pagina si monta, e la pagina resta nascosta finché non è riempita */
    var primi = leggi(id);
    var R = await F().monta(box, INDIRIZZO);
    if (R && R.body) R = R.body;           /* monta torna il documento: si lavora sul corpo */
    var vela = R && R.style; if (vela) vela.visibility = "hidden";
    /* ⭐ 2 ottobre 21:41, Gab: mai una pagina vuota — se l'evento non si può leggere, la finestra del praticantato */
    async function ricarica(pronti) {
      var d = (pronti && typeof pronti === "object" && "orma" in pronti) ? pronti : await leggi(id);
      try { if (!d.orma && window.FMChiuso) return window.FMChiuso(R, d.io); disegna(R, d, id, ricarica); }
      finally { if (vela) vela.visibility = ""; }
    }
    await ricarica(await primi);
  }

  window.SpazioVivo = window.SpazioVivo || {};
  window.SpazioVivo.evento = evento;
  window.FMEvento = { disegna: disegna, accesso: accesso };   /* per le prove */
})();
