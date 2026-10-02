/* ═══════════════════════════════════════════════════════════════
   FM-CHAT — le conversazioni, tutte in un posto.
   ⭐ 2 ottobre 2026, Gab: «un tasto che ti porta direttamente a tutte le conversazioni …
      sotto il carrello metti la posta, la chat … ogni chat poi riporta all'orma».
      12:40: «in generale l'area dove metti le chat, il gruppo di appartenenza ai villaggi
      Felicitas e sotto metti Civiltà Sarda, Civiltà Tuscia perché poi uno sotto quel gruppo
      può trovare la chat del proprio gruppo … il messaggio a tutti lo posso mandare solo io».
   Legge fm_mie_chat() (SQL 27). Senza quella, il tasto non compare.
   Tocchi una chat → si apre l'orma con «La conversazione» già aperta.
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
    "#sv-chat{position:fixed;top:3.9rem;right:1rem;z-index:71;display:inline-flex;align-items:center;justify-content:center;height:2.5rem;min-width:2.5rem;padding:0 .55rem;background:rgba(6,9,22,.85);border:1px solid rgba(200,160,85,.5);border-radius:.6rem;color:#E3C58A;cursor:pointer}" +
    "#sv-chat[hidden]{display:none}" +
    "#sv-chat svg{width:1.3rem;height:1.3rem;display:block}" +
    "#sv-chat.on{background:rgba(212,175,106,.18);border-color:#D4AF6A}" +
    "#sv-chat .bol{position:absolute;top:-.45rem;right:-.45rem;min-width:1.25rem;height:1.25rem;padding:0 .3rem;border-radius:999px;background:#D4AF6A;color:#0A0C1A;font:500 .72rem 'DM Sans',system-ui,sans-serif;display:grid;place-items:center}" +
    "#sv-chat .bol:empty{display:none}" +
    "#sv-chat-p{position:fixed;z-index:70;top:0;right:0;bottom:0;width:min(26rem,100vw);background:#080B1A;border-left:1px solid rgba(212,175,106,.3);display:flex;flex-direction:column;box-shadow:-1rem 0 2rem rgba(0,0,0,.45);color:#F5F0E6;font-family:'DM Sans',system-ui,sans-serif}" +
    "#sv-chat-p[hidden]{display:none}" +
    "@media (max-width:40rem){#sv-chat-p{width:100vw;border-left:0}}" +
    "#sv-chat-p .testa{padding:1.1rem 4rem .8rem 1rem;border-bottom:1px solid rgba(212,175,106,.3)}" +
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
    "@media (max-width:40rem){#sv-chat-p .ak{margin-right:3.4rem}}";

  var ICONA = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5.5h16a1.5 1.5 0 0 1 1.5 1.5v9a1.5 1.5 0 0 1-1.5 1.5H10l-4.5 3.5V17.5H4A1.5 1.5 0 0 1 2.5 16V7A1.5 1.5 0 0 1 4 5.5z"/><path d="M7 10h10M7 13.2h6"/></svg>';

  function tasto() {
    var t = document.getElementById("sv-chat"); if (t) return t;
    var s = document.createElement("style"); s.textContent = CSS; document.head.appendChild(s);
    t = document.createElement("button"); t.id = "sv-chat"; t.type = "button"; t.hidden = true;
    t.setAttribute("aria-label", "Le conversazioni");
    t.innerHTML = ICONA + '<span class="bol"></span>';
    t.onclick = function () { apri(!stato.aperto); };
    document.body.appendChild(t);
    var p = document.createElement("aside"); p.id = "sv-chat-p"; p.hidden = true;
    p.innerHTML = '<div class="testa"><h2>Conversazioni</h2></div><div class="lista"></div>';
    document.body.appendChild(p);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && stato.aperto) apri(false); });
    return t;
  }

  function apri(si) {
    stato.aperto = si;
    var t = tasto(), p = document.getElementById("sv-chat-p");
    p.hidden = !si; t.classList.toggle("on", si);
    if (si) aggiorna();
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
      .sort(function (a, b) { return (b.dentro - a.dentro) || String(a.titolo).localeCompare(String(b.titolo)); });
    /* le orme in cui sei dentro, sotto il loro villaggio; quelle senza messaggi non compaiono */
    var mie = R.filter(function (r) { return r.tipo !== "micelio" && r.dentro && r.ultimo_momento; }).sort(dopo);
    var h = "";
    if (stato.io === GAB) h += '<div class="ak"><b>messaggio a tutti · Antaḥkaraṇa</b>' +
      '<textarea placeholder="esce in tutte le chat dei villaggi"></textarea>' +
      '<button type="button" data-ak>manda a tutti</button><small></small></div>';
    h += '<div class="gr">Villaggi Felicitas</div>';
    villaggi.forEach(function (v) {
      h += riga(v, "vil");
      mie.filter(function (m) { return m.villaggio_id === v.orma_id; }).forEach(function (m) { h += riga(m, true); });
    });
    var altre = mie.filter(function (m) { return !m.villaggio_id || !villaggi.some(function (v) { return v.orma_id === m.villaggio_id; }); });
    if (altre.length) { h += '<div class="gr">Le altre conversazioni</div>'; altre.forEach(function (m) { h += riga(m); }); }
    if (!villaggi.length && !altre.length) h += '<div class="vuoto">ancora nessuna conversazione</div>';
    L.innerHTML = h;
    Array.prototype.forEach.call(L.querySelectorAll("[data-o]"), function (b) {
      b.onclick = function () {
        var id = b.getAttribute("data-o");
        window.ormaApriChat = id; apri(false);
        if (window.SpazioVivo && typeof window.SpazioVivo.apriOrma === "function") window.SpazioVivo.apriOrma(id);
        else if (typeof window.vai === "function") window.vai("orma", { id: id });
      };
    });
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

  async function aggiorna() {
    if (!window.db) return;
    try {
      var u = await window.db.auth.getUser();
      stato.io = u && u.data && u.data.user && u.data.user.id;
      var t = tasto();
      if (!stato.io) { t.hidden = true; return; }
      var r = await window.db.rpc("fm_mie_chat");
      if (r.error) { t.hidden = true; return; }     /* senza SQL 27 il tasto non c'è */
      stato.righe = r.data || [];
      var n = stato.righe.reduce(function (s, x) { return s + (x.non_letti || 0); }, 0);
      t.querySelector(".bol").textContent = n ? String(n) : "";
      t.hidden = false;
      if (stato.aperto) disegna();
    } catch (e) { console.warn("chat:", e); }
  }

  function parti() {
    tasto();
    setTimeout(aggiorna, 1500);
    setInterval(function () { if (!document.hidden) aggiorna(); }, 60000);
    document.addEventListener("visibilitychange", function () { if (!document.hidden) aggiorna(); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", parti); else parti();
  window.FMChat = { aggiorna: aggiorna };
})();
