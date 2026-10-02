/* ═══════════════════════════════════════════════════════════════
   FM-CHAT — le conversazioni, tutte in un posto.
   ⭐ 2 ottobre 2026, Gab: «un tasto che ti porta direttamente a tutte le conversazioni …
      sotto il carrello metti la posta, la chat … ogni chat poi riporta all'orma».
      12:40: «in generale l'area dove metti le chat, il gruppo di appartenenza ai villaggi
      Felicitas e sotto metti Civiltà Sarda, Civiltà Tuscia perché poi uno sotto quel gruppo
      può trovare la chat del proprio gruppo … il messaggio a tutti lo posso mandare solo io».
   Legge fm_mie_chat() (SQL 27). Senza quella, il tasto non compare.
   ⭐ 15:44, Gab: «villaggi felicitas dentro un quadrante, casa radice va messo fuori · quando entri non devi
      entrare dentro orma … ma devi vedere la stessa cosa che leggi in orma, anche in questa chat · poi con un
      tasto puoi andare nell'orma … se schiacci il logo chat, ti si apre la lista delle civiltà e da lì entri,
      ma vedi prima la lista degli argomenti trattati e poi tutta la chat».
   Tocchi una chat → la chat si apre QUI: prima gli argomenti, poi tutti i messaggi, e si scrive.
   «apri l'orma ›» porta all'orma, dove c'è la stessa conversazione.
   Espone: window.FMChat = { aggiorna }
   ═══════════════════════════════════════════════════════════════ */
(function () {
  "use strict";
  var GAB = "352bb184-43cf-4795-92ff-2fa18993f994";
  var MESI = ["gen", "feb", "mar", "apr", "mag", "giu", "lug", "ago", "set", "ott", "nov", "dic"];
  var stato = { io: null, righe: [], aperto: false };

  function esc(x) { return String(x == null ? "" : x).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function ora(s) {
    if (!s) return ""; var d = new Date(s); if (isNaN(d)) return "";
    var oggi = new Date(); oggi.setHours(0, 0, 0, 0);
    if (d >= oggi) return String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
    if (d >= new Date(oggi.getTime() - 864e5)) return "ieri";
    return d.getDate() + " " + MESI[d.getMonth()];
  }
  function civ(t) { var p = String(t || "").split(/\s[–—-]\s/); return (p[1] || p[0] || "").trim(); }

  var CSS =
    "#sv-chat{position:fixed;top:.9rem;right:4rem;z-index:73;display:inline-flex;align-items:center;justify-content:center;height:2.5rem;min-width:2.5rem;padding:0 .55rem;background:rgba(6,9,22,.85);border:1px solid rgba(200,160,85,.5);border-radius:.6rem;color:#E3C58A;cursor:pointer}" +
    "#sv-chat[hidden]{display:none}" +
    "#sv-chat svg{width:1.3rem;height:1.3rem;display:block}" +
    "#sv-chat.on{background:rgba(212,175,106,.18);border-color:#D4AF6A}" +
    "#sv-chat .bol{position:absolute;top:-.45rem;right:-.45rem;min-width:1.25rem;height:1.25rem;padding:0 .3rem;border-radius:999px;background:#D4AF6A;color:#0A0C1A;font:500 .72rem 'DM Sans',system-ui,sans-serif;display:grid;place-items:center}" +
    "#sv-chat .bol:empty{display:none}" +
    "#sv-chat-p{position:fixed;z-index:72;top:0;right:0;bottom:0;width:min(26rem,100vw);background:#080B1A;border-left:1px solid rgba(212,175,106,.3);display:flex;flex-direction:column;box-shadow:-1rem 0 2rem rgba(0,0,0,.45);color:#F5F0E6;font-family:'DM Sans',system-ui,sans-serif}" +
    "#sv-chat-p[hidden],#sv-chat-p [hidden]{display:none!important}" +
    "@media (max-width:40rem){#sv-chat-p{width:100vw;border-left:0}}" +
    "#sv-chat-p .testa{padding:1.1rem 7.5rem .8rem 1rem;min-height:4.2rem;box-sizing:border-box;border-bottom:1px solid rgba(212,175,106,.3)}" +
    "#sv-chat-p h2{margin:0;font-family:'Cinzel',serif;font-weight:500;font-size:1rem;letter-spacing:.18em;text-transform:uppercase;color:#D4AF6A}" +
    "#sv-chat-p .lista{flex:1;overflow:auto;padding:.3rem .6rem 1.4rem}" +
    "#sv-chat-p .gr{font-family:'Cinzel',serif;font-size:.7rem;letter-spacing:.2em;text-transform:uppercase;color:#D4AF6A;padding:1rem .5rem .3rem}" +
    "#sv-chat-p .riga{all:unset;box-sizing:border-box;cursor:pointer;width:100%;display:grid;grid-template-columns:1fr auto;gap:.8rem;align-items:center;padding:.7rem .6rem;border-radius:.8rem}" +
    "#sv-chat-p .riga:hover{background:rgba(245,240,230,.04)}" +
    "#sv-chat-p .riga.fi{padding-left:1.6rem}" +
    "#sv-chat-p .t{display:block;font-family:'Cinzel',serif;font-size:.86rem;letter-spacing:.08em;margin-bottom:.15rem}" +
    "#sv-chat-p .riga.nuova .t{color:#E3C58A}" +
    "#sv-chat-p .u{display:block;font-family:'Cormorant Garamond',serif;font-size:1.05rem;color:rgba(245,240,230,.6);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:17rem}" +
    "#sv-chat-p .dx{display:flex;flex-direction:column;align-items:flex-end;gap:.3rem;font-size:.72rem;color:rgba(245,240,230,.45)}" +
    "#sv-chat-p .n{min-width:1.3rem;height:1.3rem;padding:0 .35rem;border-radius:999px;background:#D4AF6A;color:#0A0C1A;font-weight:500;display:grid;place-items:center}" +
    "#sv-chat-p .vuoto{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1.05rem;color:rgba(245,240,230,.5);padding:.4rem .6rem}" +
    "#sv-chat-p .ak{margin:.8rem .6rem 0;padding:.9rem;border:1px solid rgba(212,175,106,.5);border-radius:1rem;background:rgba(212,175,106,.06);display:flex;flex-direction:column;gap:.5rem}" +
    "#sv-chat-p .ak b{font-family:'Cinzel',serif;font-weight:400;font-size:.75rem;letter-spacing:.18em;text-transform:uppercase;color:#D4AF6A}" +
    "#sv-chat-p .ak textarea{background:rgba(2,4,12,.6);border:1px solid rgba(212,175,106,.3);border-radius:.7rem;color:#F5F0E6;padding:.6rem .8rem;font:inherit;resize:vertical;min-height:4.5rem}" +
    "#sv-chat-p .ak button{all:unset;cursor:pointer;align-self:flex-start;min-height:2.6rem;padding:0 1.1rem;border-radius:999px;background:#D4AF6A;color:#0A0C1A;font-family:'Cinzel',serif;font-size:.78rem;letter-spacing:.12em;text-transform:uppercase;display:inline-grid;place-items:center}" +
    "#sv-chat-p .ak small{font-size:.8rem;color:rgba(245,240,230,.55)}" +
    /* il quadrante dei villaggi */
    "#sv-chat-p .quad{margin:.9rem .2rem .2rem;border:1px solid rgba(212,175,106,.45);border-radius:1.1rem;background:linear-gradient(180deg,rgba(245,240,230,.05),rgba(245,240,230,.015));padding:.2rem .3rem .5rem}" +
    "#sv-chat-p .quad>.gr{padding-top:.8rem}" +
    /* dentro una chat */
    "#sv-chat-p .testa{display:flex;align-items:center;gap:.4rem}" +
    "#sv-chat-p .indietro{all:unset;cursor:pointer;min-width:2.4rem;min-height:2.4rem;display:grid;place-items:center;color:#D4AF6A;font-size:1.6rem;margin-left:-.5rem}" +
    "#sv-chat-p .vc{flex:1;display:flex;flex-direction:column;min-height:0}" +
    "#sv-chat-p .vai-orma{all:unset;cursor:pointer;align-self:flex-start;margin:.6rem 1rem .2rem;font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1.08rem;color:#D4AF6A}" +
    "#sv-chat-p .corpo{flex:1;overflow:auto;padding:.2rem 1rem 1rem}" +
    "#sv-chat-p .args{display:flex;flex-wrap:wrap;gap:.35rem;padding:.4rem 0 .8rem;border-bottom:1px solid rgba(212,175,106,.2);margin-bottom:.6rem}" +
    "#sv-chat-p .args button{all:unset;cursor:pointer;padding:.35rem .75rem;border-radius:999px;border:1px solid rgba(212,175,106,.45);color:#E3C58A;font-size:.82rem}" +
    "#sv-chat-p .args i{font-style:normal;opacity:.6;margin-left:.3rem}" +
    "#sv-chat-p .arg{font-family:'Cinzel',serif;font-size:.68rem;letter-spacing:.18em;text-transform:uppercase;color:#D4AF6A;margin:.9rem 0 .4rem;text-align:center}" +
    "#sv-chat-p .m{max-width:85%;margin:.35rem 0;padding:.55rem .8rem;border-radius:.9rem;background:rgba(245,240,230,.06);font-size:.95rem;line-height:1.4;white-space:pre-wrap;word-wrap:break-word}" +
    "#sv-chat-p .m b{display:block;font-size:.72rem;letter-spacing:.06em;color:#D4AF6A;font-weight:500;margin-bottom:.15rem}" +
    "#sv-chat-p .m b span{color:rgba(245,240,230,.45);font-weight:400;margin-left:.4rem}" +
    "#sv-chat-p .m.mio{margin-left:auto;background:rgba(212,175,106,.15)}" +
    "#sv-chat-p .m.ak-m{border:1px solid rgba(212,175,106,.6);background:rgba(212,175,106,.1)}" +
    "#sv-chat-p .scrivi{padding:.7rem 1rem 1rem;border-top:1px solid rgba(212,175,106,.3)}" +
    "#sv-chat-p .scrivi .r{display:flex;gap:.5rem}" +
    "#sv-chat-p .scrivi input{flex:1;min-width:0;background:rgba(2,4,12,.6);border:1px solid rgba(212,175,106,.3);border-radius:999px;color:#F5F0E6;padding:.7rem 1rem;font:inherit}" +
    "#sv-chat-p .scrivi button{all:unset;cursor:pointer;width:2.8rem;height:2.8rem;border-radius:999px;background:#D4AF6A;color:#0A0C1A;display:grid;place-items:center;font-size:1.1rem}" +
    "#sv-chat-p .scrivi p{margin:.45rem 0 0;font-family:'Cormorant Garamond',serif;font-style:italic;font-size:.95rem;line-height:1.35;color:rgba(245,240,230,.55)}";

  var ICONA = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5.5h16a1.5 1.5 0 0 1 1.5 1.5v9a1.5 1.5 0 0 1-1.5 1.5H10l-4.5 3.5V17.5H4A1.5 1.5 0 0 1 2.5 16V7A1.5 1.5 0 0 1 4 5.5z"/><path d="M7 10h10M7 13.2h6"/></svg>';

  function tasto() {
    var t = document.getElementById("sv-chat"); if (t) return t;
    var s = document.createElement("style"); s.textContent = CSS; document.head.appendChild(s);
    t = document.createElement("button"); t.id = "sv-chat"; t.type = "button"; t.hidden = true;
    t.setAttribute("aria-label", "Le conversazioni");
    t.innerHTML = ICONA + '<span class="bol"></span>';
    t.onclick = function () { apri(!stato.aperto); };
    document.body.appendChild(t);
    posa();
    window.addEventListener("resize", posa);
    try { var c = document.getElementById("sv-carrello"); if (c && window.ResizeObserver) new ResizeObserver(posa).observe(c); } catch (e) {}
    var p = document.createElement("aside"); p.id = "sv-chat-p"; p.hidden = true;
    p.innerHTML = '<div class="testa"><button type="button" class="indietro" hidden aria-label="torna alle conversazioni">&lsaquo;</button><h2>Conversazioni</h2></div>' +
      '<div class="lista"></div><div class="vc" hidden></div>';
    p.querySelector(".indietro").onclick = function () { elenco(); };
    document.body.appendChild(p);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && stato.aperto) apri(false); });
    return t;
  }

  /* ⭐ 2 ottobre 13:14, Gab: «il simbolo chat mettilo di fianco al carrello» — si misura il carrello e ci si mette accanto */
  function posa() {
    var t = document.getElementById("sv-chat"), c = document.getElementById("sv-carrello");
    if (!t) return;
    var r = c && c.getBoundingClientRect();
    if (!r || !r.width) { t.style.top = ".9rem"; t.style.right = "4rem"; return; }
    t.style.top = r.top + "px"; t.style.height = r.height + "px";
    t.style.right = Math.round(window.innerWidth - r.left + 8) + "px";
  }

  function apri(si) {
    stato.aperto = si;
    var t = tasto(), p = document.getElementById("sv-chat-p");
    p.hidden = !si; t.classList.toggle("on", si);
    if (si) { elenco(); aggiorna(); } else fermaChat();
  }

  function riga(r, fi) {
    var nuova = r.non_letti > 0;
    var u = r.ultimo_testo ? (r.ultimo_nome ? r.ultimo_nome + ": " : "") + r.ultimo_testo : "ancora nessun messaggio";
    return '<button type="button" class="riga' + (fi === true ? " fi" : "") + (nuova ? " nuova" : "") + '" data-o="' + esc(r.orma_id) + '">' +
      '<span><span class="t">' + esc(fi === "vil" ? civ(r.titolo) : r.titolo) + '</span><span class="u">' + esc(u) + '</span></span>' +
      '<span class="dx">' + esc(ora(r.ultimo_momento)) + (nuova ? '<span class="n">' + r.non_letti + '</span>' : '') + '</span></button>';
  }

  function disegna() {
    var p = document.getElementById("sv-chat-p"); if (!p) return;
    var L = p.querySelector(".lista"), R = stato.righe;
    var dopo = function (a, b) { return (b.non_letti > 0) - (a.non_letti > 0) || String(b.ultimo_momento || "").localeCompare(String(a.ultimo_momento || "")); };
    var villaggi = R.filter(function (r) { return r.tipo === "micelio"; })
      .sort(function (a, b) { return ((b.orma_id === stato.radice) - (a.orma_id === stato.radice)) || (b.dentro - a.dentro) || String(a.titolo).localeCompare(String(b.titolo)); });   /* prima le tue radici */
    /* le orme in cui sei dentro, sotto il loro villaggio; quelle senza messaggi non compaiono */
    var mie = R.filter(function (r) { return r.tipo !== "micelio" && !r.casa && r.dentro && r.ultimo_momento; }).sort(dopo);
    var casa = R.filter(function (r) { return r.casa; })[0];
    var h = "";
    if (stato.io === GAB) h += '<div class="ak"><b>messaggio a tutti · Antaḥkaraṇa</b>' +
      '<textarea placeholder="esce in tutte le chat dei villaggi"></textarea>' +
      '<button type="button" data-ak>manda a tutti</button><small></small></div>';
    /* ⭐ Casa Radice (Gab, 13:14 e 15:40): «va messo fuori da villaggi felicitas, non lo deve vedere nessuno se non io».
       Solo chi ci è dentro (oggi Gab) la vede; gli altri le scrivono solo da «+ un'altra» nelle radici. */
    h += '<div class="quad"><div class="gr">Villaggi Felicitas</div>';
    villaggi.forEach(function (v) {
      h += riga(v, "vil");
      mie.filter(function (m) { return m.villaggio_id === v.orma_id; }).forEach(function (m) { h += riga(m, true); });
    });
    h += '</div>';
    if (casa && casa.dentro) h += '<div class="gr">Casa Radice</div>' + riga(casa);
    var altre = mie.filter(function (m) { return !m.villaggio_id || !villaggi.some(function (v) { return v.orma_id === m.villaggio_id; }); });
    if (altre.length) { h += '<div class="gr">Le altre conversazioni</div>'; altre.forEach(function (m) { h += riga(m); }); }
    if (!villaggi.length && !altre.length) h += '<div class="vuoto">ancora nessuna conversazione</div>';
    L.innerHTML = h;
    Array.prototype.forEach.call(L.querySelectorAll("[data-o]"), function (b) {
      b.onclick = function () { entra(b.getAttribute("data-o")); };
    });
    var dc = L.querySelector("[data-casa]");
    if (dc) dc.onclick = function () { var b = L.querySelector("#casa-scrivi"); b.hidden = !b.hidden; if (!b.hidden) b.querySelector("textarea").focus(); };
    var cm = L.querySelector("[data-casa-manda]");
    if (cm) cm.onclick = async function () {
      var box = cm.parentNode, ta = box.querySelector("textarea"), sm = box.querySelector("small"), testo = ta.value.trim();
      if (!testo) { sm.textContent = "scrivi il messaggio"; return; }
      cm.textContent = "un momento…";
      var r = await window.db.rpc("fm_scrivi_casa_radice", { p_testo: testo });
      cm.textContent = "manda";
      if (r.error) { sm.textContent = /FM_NO_LINK/.test(r.error.message || "") ? "niente link esterni: la chat è operativa" : "non partito: riprova"; return; }
      ta.value = ""; sm.textContent = "arrivato a Casa Radice";
    };
    var ak = L.querySelector("[data-ak]");
    if (ak) ak.onclick = async function () {
      var box = ak.parentNode, ta = box.querySelector("textarea"), sm = box.querySelector("small"), testo = ta.value.trim();
      if (!testo) { sm.textContent = "scrivi il messaggio"; return; }
      ak.textContent = "un momento…";
      try {
        var r = await window.db.rpc("fm_annuncio", { p_testo: testo });
        if (r.error) throw r.error;
        ta.value = ""; sm.textContent = "uscito in " + r.data + " chat"; ak.textContent = "manda a tutti";
        aggiorna();
      } catch (e) { ak.textContent = "manda a tutti"; sm.textContent = "non uscito: " + ((e && e.message) || "riprova"); }
    };
  }

  /* ── la lista e la chat dentro il pannello ───────────────────── */
  function elenco() {
    fermaChat();
    var p = document.getElementById("sv-chat-p"); if (!p) return;
    p.querySelector(".lista").hidden = false; p.querySelector(".vc").hidden = true;
    p.querySelector(".indietro").hidden = true; p.querySelector("h2").textContent = "Conversazioni";
    disegna();
  }
  function fermaChat() { if (stato.giro) { clearInterval(stato.giro); stato.giro = null; } stato.chat = null; }

  var REGOLA = "La chat è operativa: un link, un evento o altro si pubblica attraverso FelicitasMundi, nel suo contesto, non nella chat.";
  var LINK = /(https?:\/\/|www\.|\b[a-z0-9-]+\.(com|it|org|net|eu|info|io|me|ly|be|gl|co|app|shop|store|link)\b)/i;

  function entra(id) {
    var p = document.getElementById("sv-chat-p"), r = stato.righe.filter(function (x) { return x.orma_id === id; })[0] || { orma_id: id, titolo: "" };
    fermaChat(); stato.chat = id;
    p.querySelector(".lista").hidden = true;
    var V = p.querySelector(".vc"); V.hidden = false;
    p.querySelector(".indietro").hidden = false;
    p.querySelector("h2").textContent = r.tipo === "micelio" ? civ(r.titolo) : (r.titolo || "");
    V.innerHTML = '<button type="button" class="vai-orma">apri l’orma &rsaquo;</button>' +
      '<div class="corpo"><div class="vuoto">un momento…</div></div>' +
      '<div class="scrivi"><div class="r"><input type="text" placeholder="scrivi" autocomplete="off"><button type="button" aria-label="manda">&#8593;</button></div><p>' + esc(REGOLA) + '</p></div>';
    V.querySelector(".vai-orma").onclick = function () {
      window.ormaApriChat = id; apri(false);
      if (window.SpazioVivo && typeof window.SpazioVivo.apriOrma === "function") window.SpazioVivo.apriOrma(id);
      else if (typeof window.vai === "function") window.vai("orma", { id: id });
    };
    var inp = V.querySelector("input"), regola = V.querySelector(".scrivi p");
    var manda = async function () {
      var t = inp.value.trim(); if (!t) return;
      if (LINK.test(t.replace(/(https?:\/\/)?([a-z0-9-]+\.)*felicitasmundi\.com\S*/gi, ""))) { regola.style.color = "#E8A07A"; return; }
      regola.style.color = ""; inp.value = "";
      var w = await window.db.from("orma_messaggi").insert({ orma_id: id, testo: t });
      if (w && w.error) {
        inp.value = t;
        if (/FM_NO_LINK/.test(w.error.message || "")) regola.style.color = "#E8A07A";
        else regola.textContent = "Non è partito: forse in questa chat non sei ancora dentro. Apri l’orma ed entra.";
        return;
      }
      await messaggi(id, true);
    };
    inp.onkeydown = function (e) { if (e.key === "Enter") manda(); };
    V.querySelector(".scrivi button").onclick = manda;
    messaggi(id, true);
    stato.giro = setInterval(function () { if (stato.chat === id && !document.hidden) messaggi(id, false); }, 15000);
  }

  /* prima gli argomenti trattati, poi tutta la chat — come nell'orma */
  async function messaggi(id, giu) {
    var V = document.querySelector("#sv-chat-p .vc"); if (!V || stato.chat !== id) return;
    var C = V.querySelector(".corpo");
    var r = await window.db.from("orma_messaggi").select("id,persona_id,testo,momento,argomento").eq("orma_id", id).order("momento").limit(300);
    if (stato.chat !== id) return;
    var M = (r && !r.error && r.data) || [];
    var pids = M.map(function (m) { return m.persona_id; }).filter(function (x, i, a) { return x && a.indexOf(x) === i; }), nomi = {};
    if (pids.length) { try { var pn = await window.db.from("persone_pubbliche").select("id,nome").in("id", pids); (pn.data || []).forEach(function (x) { nomi[x.id] = x.nome || ""; }); } catch (e) {} }
    var args = [];
    M.forEach(function (m) { if (!m.argomento) return; var a = args.filter(function (x) { return x.nome === m.argomento; })[0]; if (a) a.n++; else args.push({ nome: m.argomento, n: 1 }); });
    var h = '<div class="gr" style="padding-left:0">di cosa si è parlato</div>' +
      (args.length ? '<div class="args">' + args.map(function (a, i) { return '<button type="button" data-arg="' + i + '">' + esc(a.nome) + '<i>' + a.n + '</i></button>'; }).join("") + '</div>'
                   : '<div class="vuoto" style="padding-left:0">nessun argomento ancora</div>');
    if (!M.length) h += '<div class="vuoto" style="padding-left:0">nessun messaggio ancora</div>';
    var prima = null;
    M.forEach(function (m) {
      if (m.argomento && m.argomento !== prima) { h += '<div class="arg" data-a="' + esc(m.argomento) + '">' + esc(m.argomento) + '</div>'; prima = m.argomento; }
      var mio = m.persona_id === stato.io, ak = m.argomento === "Antaḥkaraṇa";
      h += '<div class="m' + (mio ? " mio" : "") + (ak ? " ak-m" : "") + '"><b>' + esc(mio ? "tu" : (nomi[m.persona_id] || "")) + '<span>' + esc(ora(m.momento)) + '</span></b>' + esc(m.testo) + '</div>';
    });
    var inFondo = C.scrollHeight - C.scrollTop - C.clientHeight < 60;
    C.innerHTML = h;
    Array.prototype.forEach.call(C.querySelectorAll("[data-arg]"), function (b) {
      b.onclick = function () { var nome = args[+b.getAttribute("data-arg")].nome; var t = Array.prototype.filter.call(C.querySelectorAll(".arg"), function (x) { return x.getAttribute("data-a") === nome; })[0]; if (t) C.scrollTop = t.offsetTop - C.offsetTop - 8; };
    });
    if (giu || inFondo) C.scrollTop = C.scrollHeight;
    /* letto fin qui: il numerino si azzera, e l'app toglie la notifica */
    try { await window.db.from("letture").upsert({ persona_id: stato.io, orma_id: id, letto_fino: new Date().toISOString() }); } catch (e) {}
    try { if (window.FelicitasApp && typeof window.FelicitasApp.letti === "function") window.FelicitasApp.letti(id); } catch (e) {}
  }

  async function aggiorna() {
    if (!window.db) return;
    try {
      var u = await window.db.auth.getUser();
      stato.io = u && u.data && u.data.user && u.data.user.id;
      var t = tasto();
      if (!stato.io) { t.hidden = true; return; }
      try { var pr = await window.db.from("persone").select("radice_id").eq("id", stato.io).maybeSingle(); stato.radice = (pr && pr.data && pr.data.radice_id) || null; } catch (e) {}
      var r = await window.db.rpc("fm_mie_chat");
      if (r.error) { t.hidden = true; return; }     /* senza SQL 27 il tasto non c'è */
      stato.righe = r.data || [];
      var n = stato.righe.reduce(function (s, x) { return s + (x.non_letti || 0); }, 0);
      t.querySelector(".bol").textContent = n ? String(n) : "";
      t.hidden = false; posa();
      if (stato.aperto && !stato.chat) disegna();
    } catch (e) { console.warn("chat:", e); }
  }

  function parti() {
    tasto();
    setTimeout(aggiorna, 1500); setTimeout(posa, 400); setTimeout(posa, 1800);
    setInterval(function () { if (!document.hidden) aggiorna(); }, 60000);
    document.addEventListener("visibilitychange", function () { if (!document.hidden) aggiorna(); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", parti); else parti();
  window.FMChat = { aggiorna: aggiorna };
})();
