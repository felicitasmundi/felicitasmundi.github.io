/* ═══════════════════════════════════════════════════════════════
   FM-PANIERE — il paniere del villaggio.
   ⭐ 2 ottobre 2026, Gab: «stiamo cercando di creare un contesto logistico per gestire la domanda
      di raccolta di un territorio … dove poi i partecipanti si suddividono il costo». 21:18: «ok grafica»
      (paniere-bozza.html). Tavole: panieri, paniere_righe (SQL 34).
   Tre momenti: nell'Emporio «aggiungi al paniere del villaggio» · il paniere, la mia parte ·
   chi coordina, l'ordine unico e gli stati (in raccolta → ordinato → arrivato → chiuso).
   ⛔ Il pagamento in rete non c'è ancora: il tasto resta semitrasparente; il coordinatore segna chi ha pagato.
   Espone: window.FMPaniere = { aggiungi(prodotto), apri(villaggioId?), apriNuovo(villaggioId), stato(villaggioId?) }
   ═══════════════════════════════════════════════════════════════ */
(function () {
  "use strict";
  var STATI = [["in_raccolta", "in raccolta"], ["ordinato", "ordinato"], ["arrivato", "arrivato al punto"], ["chiuso", "ritirato"]];
  function esc(x) { return String(x == null ? "" : x).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function euro(n) { return n == null || isNaN(n) ? "( )" : Number(n).toLocaleString("it-IT", { style: "currency", currency: "EUR" }); }
  function data(s) { if (!s) return ""; var d = new Date(s); return isNaN(d) ? "" : d.toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long" }); }
  function db() { return window.db; }
  async function io() { var s = await db().auth.getSession(); return s && s.data && s.data.session && s.data.session.user && s.data.session.user.id; }
  function dice(t) { try { if (typeof window.parla === "function") return window.parla(t); } catch (e) {} alert(t); }

  var CSS =
    "#fm-paniere{position:fixed;inset:0;z-index:95;background:rgba(4,6,14,.72);display:flex;align-items:flex-start;justify-content:center;overflow:auto;padding:4.5rem .7rem 2rem}" +
    "#fm-paniere[hidden]{display:none}" +
    "#fm-paniere .pn{width:min(34rem,100%);background:#0A0C1A;border:1px solid rgba(212,175,106,.45);border-radius:1.2rem;padding:1.1rem;display:flex;flex-direction:column;gap:.75rem;color:#F5F0E6;font-family:'DM Sans',system-ui,sans-serif;box-shadow:0 1.5rem 3rem rgba(0,0,0,.6)}" +
    "#fm-paniere .x{all:unset;cursor:pointer;align-self:flex-end;font-size:1.4rem;color:rgba(245,240,230,.6);margin:-.4rem -.2rem -.6rem}" +
    "#fm-paniere .t{font-family:'Cinzel',serif;letter-spacing:.08em;font-size:1.05rem}" +
    "#fm-paniere .ch{display:flex;justify-content:space-between;gap:.6rem;flex-wrap:wrap;font-size:.86rem;color:rgba(245,240,230,.7)}" +
    "#fm-paniere .ch b{color:#E3C58A;font-weight:500}" +
    "#fm-paniere .barra{height:.45rem;border-radius:999px;background:rgba(245,240,230,.08);overflow:hidden}" +
    "#fm-paniere .barra i{display:block;height:100%;background:linear-gradient(90deg,#9C7A4A,#D4AF6A)}" +
    "#fm-paniere .et{font-family:'Cinzel',serif;font-size:.68rem;letter-spacing:.18em;text-transform:uppercase;color:#D4AF6A;margin-top:.3rem}" +
    "#fm-paniere .r{display:flex;justify-content:space-between;align-items:center;gap:.6rem;padding:.5rem 0;border-bottom:1px solid rgba(245,240,230,.08);font-size:.92rem}" +
    "#fm-paniere .r:last-child{border-bottom:0}" +
    "#fm-paniere .q{display:inline-flex;align-items:center;gap:.35rem;white-space:nowrap}" +
    "#fm-paniere .q button{all:unset;cursor:pointer;width:1.8rem;height:1.8rem;border-radius:50%;border:1px solid rgba(212,175,106,.45);display:grid;place-items:center;color:#D4AF6A}" +
    "#fm-paniere select,#fm-paniere input{background:rgba(2,4,12,.6);border:1px solid rgba(212,175,106,.3);border-radius:.7rem;color:#F5F0E6;padding:.6rem .7rem;font:inherit;width:100%;box-sizing:border-box}" +
    "#fm-paniere .tot{display:flex;justify-content:space-between;font-size:1rem}#fm-paniere .tot b{color:#E3C58A;font-weight:500}" +
    "#fm-paniere .tasto{all:unset;cursor:pointer;text-align:center;padding:.75rem 1rem;border-radius:999px;font-family:'Cinzel',serif;font-size:.78rem;letter-spacing:.12em;text-transform:uppercase}" +
    "#fm-paniere .pieno{background:#D4AF6A;color:#0A0C1A}#fm-paniere .vuoto{border:1px solid rgba(212,175,106,.55);color:#D4AF6A}" +
    "#fm-paniere .spento{opacity:.42;cursor:default}" +
    "#fm-paniere .stati{display:flex;gap:.3rem;flex-wrap:wrap}" +
    "#fm-paniere .stati span{font-size:.72rem;padding:.25rem .6rem;border-radius:999px;border:1px solid rgba(245,240,230,.15);color:rgba(245,240,230,.5)}" +
    "#fm-paniere .stati span.on{border-color:#D4AF6A;color:#D4AF6A;background:rgba(212,175,106,.1)}" +
    "#fm-paniere .pic{font-size:.8rem;color:rgba(245,240,230,.55)}" +
    "#fm-paniere .coord{border-top:1px solid rgba(212,175,106,.3);padding-top:.8rem;display:flex;flex-direction:column;gap:.6rem}" +
    "#fm-paniere label.si{display:flex;gap:.5rem;align-items:center;font-size:.85rem;cursor:pointer}#fm-paniere label.si input{width:auto}";

  function guscio() {
    var w = document.getElementById("fm-paniere"); if (w) return w;
    var s = document.createElement("style"); s.textContent = CSS; document.head.appendChild(s);
    w = document.createElement("div"); w.id = "fm-paniere"; w.hidden = true;
    w.innerHTML = '<div class="pn"></div>';
    w.addEventListener("click", function (e) { if (e.target === w) w.hidden = true; });
    document.body.appendChild(w);
    return w;
  }

  /* il villaggio delle mie radici e il suo paniere aperto */
  async function mioVillaggio(me) {
    var p = await db().from("persone").select("radice_id").eq("id", me).maybeSingle();
    return (p && p.data && p.data.radice_id) || null;
  }
  async function panieroAperto(vil) {
    var r = await db().from("panieri").select("*").eq("villaggio_id", vil).in("stato", ["in_raccolta", "ordinato", "arrivato"])
      .order("creato_il", { ascending: false }).limit(1);
    return (r && !r.error && r.data && r.data[0]) || null;
  }

  async function aggiungi(prodotto) {
    var me = await io();
    if (!me) { location.href = "accesso.html?torna=" + encodeURIComponent(location.pathname + location.search); return; }
    var vil = await mioVillaggio(me);
    if (!vil) { dice("Per il paniere serve il tuo villaggio: nei Vicinati scegli le tue radici."); return; }
    var pa = await panieroAperto(vil);
    if (!pa || pa.stato !== "in_raccolta" || (pa.chiude_il && new Date(pa.chiude_il) < new Date())) { dice("Il paniere del tuo villaggio adesso non è aperto."); return; }
    var c = await db().from("paniere_righe").select("id,quante").eq("paniere_id", pa.id).eq("persona_id", me).eq("prodotto_id", prodotto.id).limit(1);
    var r = (c.data && c.data[0])
      ? await db().from("paniere_righe").update({ quante: (c.data[0].quante || 1) + 1 }).eq("id", c.data[0].id)
      : await db().from("paniere_righe").insert({ paniere_id: pa.id, prodotto_id: prodotto.id, nome: prodotto.nome || "", quante: 1, prezzo: prodotto.prezzo == null ? null : prodotto.prezzo });
    if (r.error) { dice("Non è entrato nel paniere: " + r.error.message); return; }
    apri(vil);
  }

  async function apri(vilId) {
    var w = guscio(), B = w.querySelector(".pn");
    w.hidden = false; B.innerHTML = '<button class="x" type="button" aria-label="chiudi">&times;</button><div class="pic">un momento…</div>';
    B.querySelector(".x").onclick = function () { w.hidden = true; };
    var me = await io(); if (!me) { w.hidden = true; return; }
    var vil = vilId || await mioVillaggio(me);
    if (!vil) { B.innerHTML += '<div>Per il paniere serve il tuo villaggio: nei Vicinati scegli le tue radici.</div>'; return; }
    var pa = await panieroAperto(vil);
    var vt = await db().from("orme").select("titolo").eq("id", vil).maybeSingle();
    var nomeVil = (vt && vt.data && vt.data.titolo) || "";
    var coord = false; try { var fc = await db().rpc("fm_coordina", { p_villaggio: vil }); coord = !fc.error && fc.data === true; } catch (e) {}
    if (!pa) {
      B.innerHTML = '<button class="x" type="button" aria-label="chiudi">&times;</button><div class="t">Il paniere del villaggio</div>' +
        '<div class="pic">Adesso nel ' + esc(nomeVil) + ' non c’è un paniere aperto.</div>' +
        (coord ? '<button class="tasto pieno" type="button" data-nuovo>apri un paniere</button>' : '');
      B.querySelector(".x").onclick = function () { w.hidden = true; };
      var bn = B.querySelector("[data-nuovo]"); if (bn) bn.onclick = function () { apriNuovo(vil); };
      return;
    }
    /* i dati */
    var tutte = await db().from("paniere_righe").select("*").eq("paniere_id", pa.id).order("creato_il");
    var righe = (tutte && tutte.data) || [];
    var mie = righe.filter(function (r) { return r.persona_id === me; });
    var conto = await db().rpc("fm_paniere_conto", { p_paniere: pa.id });
    var cn = (conto && conto.data && (Array.isArray(conto.data) ? conto.data[0] : conto.data)) || { partecipanti: 0, raccolto: 0 };
    var pr = await db().from("orme").select("id,titolo,luogo,ritiro_orari").eq("tipo", "luogo").eq("orma_madre_id", vil).eq("punto_ritiro", true);
    var punti = (pr && !pr.error && pr.data) || [];
    var aperto = pa.stato === "in_raccolta" && !(pa.chiude_il && new Date(pa.chiude_il) < new Date());
    var miaSped = pa.spedizione && cn.partecipanti ? pa.spedizione / cn.partecipanti : null;
    var mioTot = mie.reduce(function (s, r) { return s + r.quante * (r.prezzo || 0); }, 0) + (mie.length && miaSped ? miaSped : 0);
    var scelto = mie[0] ? (mie[0].portami ? "portami" : (mie[0].punto_ritiro_id || "")) : "";
    var h = '<button class="x" type="button" aria-label="chiudi">&times;</button>' +
      '<div class="t">' + esc(pa.titolo || ("Paniere del " + nomeVil.replace(/^Villaggio Felicitas\s*[–—-]\s*/, "Villaggio "))) + '</div>' +
      '<div class="ch"><span><b>' + cn.partecipanti + '</b> partecipanti · <b>' + euro(cn.raccolto) + '</b> raccolti</span><span>' + (pa.chiude_il ? "chiude " + esc(data(pa.chiude_il)) : "") + '</span></div>' +
      (pa.chiude_cifra ? '<div class="barra"><i style="width:' + Math.min(100, Math.round(100 * cn.raccolto / pa.chiude_cifra)) + '%"></i></div><span class="pic">chiude a ' + euro(pa.chiude_cifra) + '</span>' : '') +
      '<div class="et">quello che ho preso</div><div>' +
      (mie.length ? mie.map(function (r) {
        return '<div class="r"><span>' + esc(r.nome) + '</span><span class="q">' +
          (aperto && !r.pagato_il ? '<button type="button" data-meno="' + r.id + '">−</button>' + r.quante + '<button type="button" data-piu="' + r.id + '">+</button>' : '× ' + r.quante) +
          ' · ' + euro(r.quante * (r.prezzo || 0)) + '</span></div>';
      }).join("") : '<div class="pic">Ancora niente: si aggiunge dall’Emporio, con «aggiungi al paniere del villaggio».</div>') +
      (mie.length && miaSped ? '<div class="r"><span>la mia parte della spedizione</span><span>' + euro(miaSped) + '</span></div>' : '') + '</div>' +
      (mie.length ? '<div class="et">dove lo ritiro</div><select data-ritiro' + (aperto ? '' : ' disabled') + '><option value="">scegli</option>' +
        punti.map(function (p) { return '<option value="' + p.id + '"' + (scelto === p.id ? ' selected' : '') + '>' + esc(p.titolo + (p.ritiro_orari ? " · " + p.ritiro_orari : "")) + '</option>'; }).join("") +
        '<option value="portami"' + (scelto === "portami" ? ' selected' : '') + '>me lo porta un vicino (karma yoga)</option></select>' +
        '<div class="tot"><span>la mia parte</span><b>' + euro(mioTot) + '</b></div>' +
        '<button class="tasto pieno spento" type="button" disabled title="il pagamento in rete arriva">paga la mia parte</button>' +
        '<span class="pic">' + (mie.every(function (r) { return r.pagato_il; }) ? "pagato ✓" : "") + '</span>' : '') +
      '<div class="stati">' + STATI.map(function (s) { return '<span' + (pa.stato === s[0] ? ' class="on"' : '') + '>' + s[1] + '</span>'; }).join("") + '</div>';

    /* chi coordina */
    if (coord) {
      var perProd = {}, perPunto = {}, chi = {};
      righe.forEach(function (r) {
        var k = r.nome; perProd[k] = (perProd[k] || 0) + r.quante;
        var pk = r.portami ? "da portare (karma yoga)" : ((punti.filter(function (p) { return p.id === r.punto_ritiro_id; })[0] || {}).titolo || "senza punto di ritiro");
        (perPunto[pk] = perPunto[pk] || {})[r.persona_id] = 1;
        (chi[r.persona_id] = chi[r.persona_id] || []).push(r);
      });
      var pids = Object.keys(chi), nomi = {};
      if (pids.length) { try { var pn = await db().from("persone_pubbliche").select("id,nome").in("id", pids); (pn.data || []).forEach(function (x) { nomi[x.id] = x.nome; }); } catch (e) {} }
      var tot = righe.reduce(function (s, r) { return s + r.quante * (r.prezzo || 0); }, 0);
      h += '<div class="coord"><div class="et">chi coordina · l’ordine unico</div><div>' +
        (Object.keys(perProd).length ? Object.keys(perProd).map(function (k) { return '<div class="r"><span>' + esc(k) + '</span><span>' + perProd[k] + (perProd[k] === 1 ? ' pezzo' : ' pezzi') + '</span></div>'; }).join("") : '<div class="pic">ancora nessuna richiesta</div>') +
        '</div><div class="et">per punto di ritiro</div><div>' +
        Object.keys(perPunto).map(function (k) { return '<div class="r"><span>' + esc(k) + '</span><span>' + Object.keys(perPunto[k]).length + (Object.keys(perPunto[k]).length === 1 ? ' pacco' : ' pacchi') + '</span></div>'; }).join("") +
        '</div><div class="et">chi ha pagato</div><div>' +
        pids.map(function (p) {
          var rr = chi[p], pag = rr.every(function (r) { return r.pagato_il; }), sub = rr.reduce(function (s, r) { return s + r.quante * (r.prezzo || 0); }, 0);
          return '<label class="si r"><span><input type="checkbox" data-pagato="' + rr.map(function (r) { return r.id; }).join(",") + '"' + (pag ? " checked" : "") + '> ' + esc(nomi[p] || "( )") + '</span><span>' + euro(sub) + '</span></label>';
        }).join("") +
        '</div><div class="tot"><span>totale</span><b>' + euro(tot + (pa.spedizione || 0)) + '</b></div>' +
        (pa.stato === "in_raccolta" ? '<button class="tasto pieno" type="button" data-stato="ordinato">chiudi e manda l’ordine</button>' : '') +
        (pa.stato === "ordinato" ? '<button class="tasto pieno" type="button" data-stato="arrivato">segna: arrivato al punto</button>' : '') +
        (pa.stato === "arrivato" ? '<button class="tasto vuoto" type="button" data-stato="chiuso">chiudi il paniere: tutto ritirato</button>' : '') +
        '<span class="pic">Ad «arrivato al punto», ognuno riceve l’avviso «il tuo ordine è al punto di ritiro».</span></div>';
    }
    B.innerHTML = h;
    B.querySelector(".x").onclick = function () { w.hidden = true; };
    var ricarica = function () { apri(vil); };
    Array.prototype.forEach.call(B.querySelectorAll("[data-piu],[data-meno]"), function (b) {
      b.onclick = async function () {
        var id = b.getAttribute("data-piu") || b.getAttribute("data-meno"), r = mie.filter(function (x) { return x.id === id; })[0]; if (!r) return;
        var n = r.quante + (b.hasAttribute("data-piu") ? 1 : -1);
        var q = n <= 0 ? await db().from("paniere_righe").delete().eq("id", id) : await db().from("paniere_righe").update({ quante: n }).eq("id", id);
        if (q.error) dice("Non riuscito: " + q.error.message); ricarica();
      };
    });
    var sel = B.querySelector("[data-ritiro]");
    if (sel) sel.onchange = async function () {
      var v = sel.value, up = v === "portami" ? { portami: true, punto_ritiro_id: null } : { portami: false, punto_ritiro_id: v || null };
      var q = await db().from("paniere_righe").update(up).eq("paniere_id", pa.id).eq("persona_id", me);
      if (q.error) dice("Non riuscito: " + q.error.message); ricarica();
    };
    Array.prototype.forEach.call(B.querySelectorAll("[data-pagato]"), function (c) {
      c.onchange = async function () {
        var ids = c.getAttribute("data-pagato").split(",");
        for (var i = 0; i < ids.length; i++) { var q = await db().rpc("fm_paniere_pagato", { p_riga: ids[i], p_si: c.checked }); if (q.error) { dice("Non riuscito: " + q.error.message); break; } }
        ricarica();
      };
    });
    Array.prototype.forEach.call(B.querySelectorAll("[data-stato]"), function (b) {
      b.onclick = async function () {
        b.textContent = "un momento…";
        var q = await db().rpc("fm_paniere_stato", { p_paniere: pa.id, p_stato: b.getAttribute("data-stato") });
        if (q.error) dice("Non riuscito: " + q.error.message); ricarica();
      };
    });
  }

  /* il coordinatore apre un paniere nuovo */
  function apriNuovo(vil) {
    var w = guscio(), B = w.querySelector(".pn"); w.hidden = false;
    B.innerHTML = '<button class="x" type="button" aria-label="chiudi">&times;</button><div class="t">Apri un paniere</div>' +
      '<input type="text" data-t placeholder="nome del paniere (facoltativo)">' +
      '<div class="et">chiude il</div><input type="date" data-d>' +
      '<div class="et">oppure a una cifra (€)</div><input type="number" min="0" step="1" data-c placeholder="facoltativo">' +
      '<div class="et">spedizione da dividere (€)</div><input type="number" min="0" step="0.5" data-s placeholder="facoltativo">' +
      '<button class="tasto pieno" type="button" data-ok>apri il paniere</button><span class="pic"></span>';
    B.querySelector(".x").onclick = function () { w.hidden = true; };
    B.querySelector("[data-ok]").onclick = async function () {
      var g = function (k) { return B.querySelector("[data-" + k + "]").value.trim(); };
      var riga = { villaggio_id: vil, titolo: g("t") || null,
        chiude_il: g("d") ? new Date(g("d") + "T23:59:00").toISOString() : null,
        chiude_cifra: g("c") ? Number(g("c")) : null, spedizione: g("s") ? Number(g("s")) : null };
      var q = await db().from("panieri").insert(riga);
      if (q.error) { B.querySelector(".pic").textContent = "Non aperto: " + q.error.message; return; }
      apri(vil);
    };
  }

  /* per il prodotto e per i Vicinati: c'è un paniere aperto nel mio villaggio? → { vil, paniere } */
  async function stato(vilId) {
    try {
      var me = await io(); if (!me) return null;
      var vil = vilId || await mioVillaggio(me); if (!vil) return null;
      return { vil: vil, paniere: await panieroAperto(vil) };
    } catch (e) { return null; }
  }

  window.FMPaniere = { aggiungi: aggiungi, apri: apri, apriNuovo: apriNuovo, stato: stato, data: data };
})();
