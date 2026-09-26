/* ═══════════════════════════════════════════════════════════════
   IL TUO ACCOUNT — si apre dal piede della barra.

   ⭐ OGNI VOCE PORTA A QUALCOSA. I fogli scrivono in `persone` e
      rileggono: quello che scrivi oggi lo ritrovi domani.

   ⛔ LE COLONNE, verificate il 13 settembre:
        nome · biografia · telefono · lingua · foto_url
        consenso_bio · consenso_contatto · colore_sito
        grado · livello_n · talenti · comune_cod · nome_url

   ⭐ LA LUCENTEZZA — l'arco attorno al volto è lo splendore, e
      cresce da sé: chi entra oggi non ne ha, e più uno porta più
      brilla, fino al nucleo.
      ⛔ Il numero del livello NON si mostra: si vede la luce, non
         la cifra.

   ⭐ LE LINGUE vengono da `miceli`: tutti i filamenti del mondo,
      non le poche in cui la piattaforma è tradotta. Dice con chi
      uno si può capire.

   ⚠️ TRE VOCI NON HANNO ANCORA CASA, e lo dicono aperto invece di
      fingere: il comune (si mette dalla mappa), la pagina pubblica
      (nome_url è vuota per tutti), l'invito (invitato_da non c'è).

   ⭐ I cinque in fondo chiamano `fm-account.js` del 7 agosto.

   Espone: SpazioVivo.account(dove)
   ═══════════════════════════════════════════════════════════════ */

"use strict";

/* ── i fogli: ognuno dice quale colonna scrive ──────────────────── */
var AC_FOGLI = {
  nome: { tit:"Nome", col:"nome", tipo:"riga", max:60,
    sot:"Come compari in tutta la comunit\u00e0.",
    posto:"il tuo nome" },
  foto: { tit:"Foto", col:"foto_url", tipo:"riga",
    sot:"L\u2019indirizzo di un\u2019immagine. Il caricamento dal telefono arriva dopo.",
    posto:"https://\u2026" },
  bio: { tit:"Biografia", col:"biografia", tipo:"lungo", max:600,
    sot:"Chi sei, in poche righe. Viaggia con quello che porti, se lo accendi qui sotto.",
    posto:"scrivi\u2026" },
  tel: { tit:"Telefono", col:"telefono", tipo:"riga",
    sot:"Non compare mai su nessuna pagina. Serve a chi tiene il vicinato.",
    posto:"+39\u2026" },
  lin: { tit:"Che lingua parli", col:"lingua", tipo:"lingua",
    sot:"Non in che lingua leggi la piattaforma: quella che parli. Dice con chi ti puoi capire." }
};

var acIo = null, acLingue = null, acAperto = null, acBox = null;

function acVeste(){
  if(document.getElementById("fm-ac-veste")) return;
  var s = document.createElement("style");
  s.id = "fm-ac-veste";
  s.textContent =
    ".fm-ac{width:100%;max-width:26rem;margin:0 auto;min-height:100vh;" +
      "background:#0F1226;padding-bottom:3rem;" +
      "font-family:'DM Sans',system-ui,sans-serif;color:#F5F0E6}" +
    ".fm-ac *{box-sizing:border-box}" +

    ".fm-ac .capo{background:#1B2140;padding:1.3rem 1.1rem;display:flex;" +
      "align-items:center;gap:.9rem;border-bottom:1px solid rgba(245,240,230,.06)}" +
    ".fm-ac .torna{flex:none;width:2.4rem;height:2.4rem;border-radius:.55rem;" +
      "cursor:pointer;border:1px solid rgba(245,240,230,.16);" +
      "background:rgba(245,240,230,.06);color:#F5F0E6;font-size:1.1rem;" +
      "display:grid;place-items:center}" +
    ".fm-ac .segno{flex:none;width:3.8rem;height:3.8rem;position:relative;" +
      "display:grid;place-items:center}" +
    ".fm-ac .segno svg{position:absolute;inset:0;width:100%;height:100%}" +
    ".fm-ac .volto{width:2.8rem;height:2.8rem;border-radius:50%;overflow:hidden;" +
      "border:1px dashed rgba(245,240,230,.2);background:rgba(245,240,230,.04)}" +
    ".fm-ac .volto img{width:100%;height:100%;object-fit:cover}" +
    ".fm-ac .io{flex:1;min-width:0}" +
    ".fm-ac .io b{display:block;font-family:'Cinzel',serif;font-weight:400;" +
      "font-size:1.18rem;line-height:1.15}" +
    ".fm-ac .io .gd{display:block;font-family:'Cormorant Garamond',serif;" +
      "font-style:italic;font-size:.96rem;color:#C8A055;opacity:.9;margin-top:.12rem}" +
    ".fm-ac .io .tl{display:block;font-size:.82rem;color:rgba(245,240,230,.4);margin-top:.1rem}" +

    ".fm-ac .gr{padding:1.3rem 1.1rem .4rem;font-size:.68rem;letter-spacing:.2em;" +
      "text-transform:uppercase;color:rgba(245,240,230,.3)}" +
    ".fm-ac .righe{padding:0 1.1rem}" +
    ".fm-ac .r{display:flex;align-items:center;gap:.8rem;width:100%;min-height:3.2rem;" +
      "padding:.65rem .85rem;margin-bottom:.35rem;cursor:pointer;text-align:left;" +
      "border-radius:.7rem;border:1px solid rgba(245,240,230,.08);" +
      "background:rgba(245,240,230,.02);color:inherit;font-family:inherit;transition:.18s}" +
    ".fm-ac .r:hover,.fm-ac .r:focus-visible{background:rgba(245,240,230,.05);" +
      "border-color:rgba(200,160,85,.32)}" +
    ".fm-ac .r .tx{flex:1;min-width:0}" +
    ".fm-ac .r .tx b{display:block;font-weight:400;font-size:.98rem;" +
      "color:rgba(245,240,230,.88)}" +
    ".fm-ac .r .val{flex:none;font-family:'Cormorant Garamond',serif;font-style:italic;" +
      "font-size:.92rem;color:rgba(245,240,230,.45);max-width:9rem;" +
      "overflow:hidden;text-overflow:ellipsis;white-space:nowrap}" +
    ".fm-ac .r .val.no{color:rgba(245,240,230,.28);font-style:normal;font-size:.84rem}" +
    ".fm-ac .r .fr{flex:none;color:rgba(245,240,230,.22);font-size:.9rem}" +
    ".fm-ac .r.attesa{border-style:dashed;opacity:.72;cursor:default}" +
    ".fm-ac .r.attesa:hover{background:rgba(245,240,230,.02);" +
      "border-color:rgba(245,240,230,.08)}" +
    ".fm-ac .r.attesa .val{color:rgba(212,175,106,.55);font-size:.82rem;font-style:normal}" +

    ".fm-ac .sw{display:flex;align-items:center;gap:.8rem;padding:.7rem .85rem;" +
      "margin-bottom:.35rem;border-radius:.7rem;" +
      "border:1px solid rgba(245,240,230,.08);background:rgba(245,240,230,.02);cursor:pointer}" +
    ".fm-ac .sw .tx{flex:1}" +
    ".fm-ac .sw .tx b{display:block;font-weight:400;font-size:.96rem}" +
    ".fm-ac .sw .tx span{display:block;font-family:'Cormorant Garamond',serif;" +
      "font-size:.88rem;color:rgba(245,240,230,.42);line-height:1.45;margin-top:.12rem}" +
    ".fm-ac .tas{flex:none;width:2.7rem;height:1.5rem;border-radius:1rem;position:relative;" +
      "background:rgba(245,240,230,.09);border:1px solid rgba(245,240,230,.13);transition:.2s}" +
    ".fm-ac .tas::after{content:'';position:absolute;top:.15rem;left:.15rem;" +
      "width:1.05rem;height:1.05rem;border-radius:50%;" +
      "background:rgba(245,240,230,.5);transition:.2s}" +
    ".fm-ac .sw.on .tas{background:rgba(200,160,85,.28);border-color:#C8A055}" +
    ".fm-ac .sw.on .tas::after{left:1.5rem;background:#D4AF6A}" +

    ".fm-ac .esci{display:block;width:calc(100% - 2.2rem);margin:1.5rem 1.1rem 0;" +
      "min-height:2.9rem;border-radius:1.4rem;cursor:pointer;" +
      "border:1px solid rgba(201,112,122,.35);background:transparent;" +
      "color:#C9707A;font-size:.94rem;font-family:inherit}" +
    ".fm-ac .pie{margin:1.3rem 1.1rem 0;padding-top:.85rem;" +
      "border-top:1px solid rgba(184,150,62,.18);" +
      "font-family:'Cormorant Garamond',serif;font-size:.84rem;" +
      "color:rgba(245,240,230,.33);line-height:1.6}" +

    "#fm-ac-velo{position:fixed;inset:0;z-index:80;background:rgba(4,6,14,.6);" +
      "opacity:0;pointer-events:none;transition:opacity .2s}" +
    "#fm-ac-velo.si{opacity:1;pointer-events:auto}" +
    "#fm-ac-fg{position:fixed;left:50%;bottom:0;transform:translate(-50%,100%);" +
      "z-index:81;width:100%;max-width:26rem;background:#1B2140;color:#F5F0E6;" +
      "border-radius:1.1rem 1.1rem 0 0;padding:1.1rem 1.1rem 1.6rem;" +
      "box-shadow:0 -.4rem 2rem rgba(0,0,0,.5);transition:transform .24s ease;" +
      "max-height:88vh;overflow-y:auto;font-family:'DM Sans',sans-serif}" +
    "#fm-ac-fg.si{transform:translate(-50%,0)}" +
    "#fm-ac-fg .maniglia{width:2.6rem;height:.22rem;border-radius:1rem;" +
      "background:rgba(245,240,230,.18);margin:0 auto .9rem}" +
    "#fm-ac-fg h2{font-family:'Cinzel',serif;font-weight:400;font-size:1.1rem;" +
      "color:#D4AF6A;margin:0 0 .2rem}" +
    "#fm-ac-fg .sot{font-family:'Cormorant Garamond',serif;font-style:italic;" +
      "font-size:.92rem;color:rgba(245,240,230,.45);line-height:1.45;margin-bottom:.9rem}" +
    "#fm-ac-fg input,#fm-ac-fg textarea,#fm-ac-fg select{width:100%;" +
      "font-family:'DM Sans',sans-serif;font-size:.98rem;color:#F5F0E6;" +
      "background:rgba(8,11,26,.55);border:1px solid rgba(245,240,230,.14);" +
      "border-radius:.65rem;padding:.7rem .8rem;min-height:2.9rem;resize:vertical}" +
    "#fm-ac-fg textarea{min-height:7rem;line-height:1.5;" +
      "font-family:'Cormorant Garamond',serif;font-size:1.02rem}" +
    "#fm-ac-fg input:focus,#fm-ac-fg textarea:focus,#fm-ac-fg select:focus{" +
      "outline:0;border-color:rgba(200,160,85,.55)}" +
    "#fm-ac-fg .conta{font-size:.8rem;color:rgba(245,240,230,.35);" +
      "text-align:right;margin-top:.3rem}" +
    "#fm-ac-fg .tasti{display:flex;gap:.5rem;margin-top:1rem}" +
    "#fm-ac-fg .tasti button{flex:1;min-height:2.9rem;border-radius:1.4rem;" +
      "cursor:pointer;font-size:.94rem;font-family:inherit;" +
      "border:1px solid rgba(245,240,230,.16);background:transparent;" +
      "color:rgba(245,240,230,.6)}" +
    "#fm-ac-fg .tasti button.si{border-color:#C8A055;" +
      "background:rgba(200,160,85,.16);color:#D4AF6A}" +
    "#fm-ac-fg .tasti button[disabled]{opacity:.5;cursor:default}" +
    "#fm-ac-fg .esito{font-size:.86rem;margin-top:.6rem;min-height:1.2rem}" +
    "#fm-ac-fg .esito.ok{color:#6E9E5A;filter:brightness(1.2)}" +
    "#fm-ac-fg .esito.no{color:#C9707A}" +
    "@media (prefers-reduced-motion:reduce){.fm-ac *,#fm-ac-fg{transition:none}}";
  document.head.appendChild(s);
}

/* ── leggere ────────────────────────────────────────────────────── */
async function acLeggi(){
  try{
    var u = await db.auth.getUser();
    var id = u && u.data && u.data.user && u.data.user.id;
    if(!id) return null;
    var r = await db.from("persone")
      .select("id,nome,biografia,telefono,lingua,foto_url,grado,livello_n," +
              "talenti,consenso_bio,consenso_contatto,colore_sito,comune_cod,nome_url")
      .eq("id", id).single();
    if(r.error) throw r.error;
    return r.data;
  }catch(e){ console.warn("account:", e); return null; }
}

async function acLeggiLingue(){
  if(acLingue) return acLingue;
  try{
    var r = await db.from("miceli").select("micelio,ramo")
      .eq("attivo", true).order("micelio");
    acLingue = r.error ? [] : (r.data || []);
  }catch(e){ acLingue = []; }
  return acLingue;
}

/* ⭐ scrivere: una colonna sola, e si rilegge da quello che torna */
async function acScrivi(col, val){
  var u = await db.auth.getUser();
  var id = u && u.data && u.data.user && u.data.user.id;
  if(!id) throw new Error("nessuna sessione");
  var d = {}; d[col] = (val === "" ? null : val);
  var r = await db.from("persone").update(d).eq("id", id)
    .select(col).single();
  if(r.error) throw r.error;
  return r.data ? r.data[col] : null;
}

/* ── il foglio ──────────────────────────────────────────────────── */
function acFoglio(){
  var v = document.getElementById("fm-ac-velo");
  if(v) return;
  v = document.createElement("div"); v.id = "fm-ac-velo";
  v.onclick = acChiudi;
  var f = document.createElement("div");
  f.id = "fm-ac-fg"; f.setAttribute("role","dialog"); f.setAttribute("aria-modal","true");
  f.innerHTML = '<div class="maniglia" aria-hidden="true"></div>' +
    '<h2 id="fm-ac-tit"></h2><div class="sot" id="fm-ac-sot"></div>' +
    '<div id="fm-ac-corpo"></div><div class="esito" id="fm-ac-esito"></div>' +
    '<div class="tasti"><button type="button" id="fm-ac-no">Lascia stare</button>' +
    '<button type="button" class="si" id="fm-ac-si">Salva</button></div>';
  document.body.appendChild(v); document.body.appendChild(f);
  document.getElementById("fm-ac-no").onclick = acChiudi;
  document.getElementById("fm-ac-si").onclick = acSalva;
  document.addEventListener("keydown", function(e){
    if(e.key === "Escape" && acAperto) acChiudi();
  });
}

async function acApri(k){
  var f = AC_FOGLI[k];
  if(!f) return;
  acFoglio();
  acAperto = k;
  document.getElementById("fm-ac-tit").textContent = f.tit;
  document.getElementById("fm-ac-sot").textContent = f.sot;
  var e = document.getElementById("fm-ac-esito");
  e.textContent = ""; e.className = "esito";
  var c = document.getElementById("fm-ac-corpo");
  var ora = acIo ? (acIo[f.col] || "") : "";

  if(f.tipo === "lungo"){
    c.innerHTML = '<textarea id="fm-ac-c" maxlength="' + f.max + '"></textarea>' +
      '<div class="conta"><span id="fm-ac-n">0</span>/' + f.max + '</div>';
    var t = document.getElementById("fm-ac-c");
    t.value = ora; t.placeholder = f.posto;
    var n = document.getElementById("fm-ac-n");
    n.textContent = t.value.length;
    t.oninput = function(){ n.textContent = t.value.length; };
  }else if(f.tipo === "lingua"){
    c.innerHTML = '<input type="text" id="fm-ac-cerca" ' +
      'placeholder="cerca una lingua\u2026" style="margin-bottom:.5rem">' +
      '<select id="fm-ac-c" size="7" style="min-height:12rem"></select>';
    var el = await acLeggiLingue();
    function versa(q){
      var s = document.getElementById("fm-ac-c");
      if(!s) return;
      var f2 = (q || "").toLowerCase().trim();
      s.innerHTML = "";
      el.filter(function(l){
        return !f2 || (l.micelio || "").toLowerCase().indexOf(f2) > -1 ||
               (l.ramo || "").toLowerCase().indexOf(f2) > -1;
      }).forEach(function(l){
        var o = document.createElement("option");
        o.value = l.micelio;
        o.textContent = l.micelio + (l.ramo ? "  \u00b7  " + l.ramo : "");
        if(l.micelio === ora) o.selected = true;
        s.appendChild(o);
      });
    }
    versa("");
    var cc = document.getElementById("fm-ac-cerca");
    cc.oninput = function(){ versa(cc.value); };
  }else{
    c.innerHTML = '<input type="text" id="fm-ac-c"' +
      (f.max ? ' maxlength="' + f.max + '"' : '') + '>';
    var i = document.getElementById("fm-ac-c");
    i.value = ora; i.placeholder = f.posto || "";
  }

  document.getElementById("fm-ac-velo").classList.add("si");
  document.getElementById("fm-ac-fg").classList.add("si");
  setTimeout(function(){
    var x = document.getElementById(f.tipo === "lingua" ? "fm-ac-cerca" : "fm-ac-c");
    if(x) x.focus();
  }, 260);
}

function acChiudi(){
  var v = document.getElementById("fm-ac-velo");
  var f = document.getElementById("fm-ac-fg");
  if(v) v.classList.remove("si");
  if(f) f.classList.remove("si");
  acAperto = null;
}

async function acSalva(){
  var k = acAperto; if(!k) return;
  var f = AC_FOGLI[k];
  var c = document.getElementById("fm-ac-c");
  var val = c ? String(c.value).trim() : "";
  var e = document.getElementById("fm-ac-esito");
  var b = document.getElementById("fm-ac-si");
  b.disabled = true;
  e.textContent = "Un momento\u2026"; e.className = "esito";
  try{
    var tornato = await acScrivi(f.col, val);
    if(acIo) acIo[f.col] = tornato;          /* ⭐ si rilegge da quello che torna */
    e.textContent = "Salvato."; e.className = "esito ok";
    acDisegna(acBox);
    setTimeout(acChiudi, 700);
  }catch(err){
    e.textContent = "Non si \u00e8 salvato. Riprova.";
    e.className = "esito no";
    console.warn("account:", err);
  }
  b.disabled = false;
}

/* ── gli interruttori ───────────────────────────────────────────── */
async function acInterruttore(nodo, col){
  var era = nodo.classList.contains("on");
  nodo.classList.toggle("on");
  try{
    var t = await acScrivi(col, !era);
    if(acIo) acIo[col] = t;
  }catch(e){
    nodo.classList.toggle("on");             /* ⛔ torna indietro se non passa */
    console.warn("account:", e);
  }
}

/* ── il disegno ─────────────────────────────────────────────────── */
function acRiga(box, tit, val, gesto){
  var b = document.createElement("button");
  b.type = "button"; b.className = "r";
  var t = document.createElement("span");
  t.className = "tx";
  var n = document.createElement("b"); n.textContent = tit;
  t.appendChild(n); b.appendChild(t);
  var v = document.createElement("span");
  v.className = "val" + (val ? "" : " no");
  v.textContent = val || "non c\u2019\u00e8";
  b.appendChild(v);
  var fr = document.createElement("span");
  fr.className = "fr"; fr.setAttribute("aria-hidden","true"); fr.textContent = "\u203a";
  b.appendChild(fr);
  b.onclick = gesto;
  box.appendChild(b);
  return b;
}
function acAttesa(box, tit, dice){
  var d = document.createElement("div");
  d.className = "r attesa";
  d.innerHTML = '<span class="tx"><b></b></span><span class="val"></span>';
  d.querySelector("b").textContent = tit;
  d.querySelector(".val").textContent = dice;
  box.appendChild(d);
}
function acSw(box, tit, spiega, col, acceso){
  var d = document.createElement("div");
  d.className = "sw" + (acceso ? " on" : "");
  d.innerHTML = '<span class="tx"><b></b><span></span></span><span class="tas"></span>';
  d.querySelector("b").textContent = tit;
  d.querySelector(".tx span").textContent = spiega;
  d.onclick = function(){ acInterruttore(d, col); };
  box.appendChild(d);
}
function acGruppo(box, nome){
  var g = document.createElement("div");
  g.className = "gr"; g.textContent = nome;
  box.appendChild(g);
  var r = document.createElement("div");
  r.className = "righe"; box.appendChild(r);
  return r;
}

function acDisegna(box){
  if(!box) return;
  var io = acIo || {};
  box.className = "fm-ac";
  box.innerHTML = "";

  /* ⭐ la lucentezza: l'arco cresce col livello, ma il numero non si vede */
  var luce = Math.max(0, Math.min(1, (io.livello_n || 0) / 7));
  var capo = document.createElement("div");
  capo.className = "capo";
  var tr = document.createElement("button");
  tr.type = "button"; tr.className = "torna";
  tr.setAttribute("aria-label", "Chiudi"); tr.textContent = "\u2190";
  tr.onclick = function(){ if(typeof vai === "function") vai("orme"); };
  capo.appendChild(tr);
  var sg = document.createElement("span");
  sg.className = "segno";
  sg.innerHTML = '<svg viewBox="0 0 100 100" aria-hidden="true">' +
    '<circle cx="50" cy="50" r="44" fill="none" stroke="rgba(245,240,230,.08)" stroke-width="3"/>' +
    '<circle cx="50" cy="50" r="44" fill="none" stroke="#C8A055" stroke-width="3"' +
    ' stroke-linecap="round" transform="rotate(-90 50 50)" stroke-dasharray="276"' +
    ' stroke-dashoffset="' + (276 - 276 * luce).toFixed(0) + '"' +
    ' style="filter:drop-shadow(0 0 3px rgba(212,175,106,.55))"/></svg>' +
    '<span class="volto">' +
    (io.foto_url ? '<img src="' + io.foto_url + '" alt="">' : '') + '</span>';
  capo.appendChild(sg);
  var mio = document.createElement("div");
  mio.className = "io";
  var mn = document.createElement("b"); mn.textContent = io.nome || "Il tuo account";
  mio.appendChild(mn);
  if(io.grado){
    var mg = document.createElement("span");
    mg.className = "gd"; mg.textContent = io.grado;
    mio.appendChild(mg);
  }
  if(io.talenti){
    var mt = document.createElement("span");
    mt.className = "tl";
    mt.textContent = io.talenti + (io.talenti === 1 ? " talento" : " talenti");
    mio.appendChild(mt);
  }
  capo.appendChild(mio);
  box.appendChild(capo);

  var g1 = acGruppo(box, "Chi sei");
  acRiga(g1, "Nome", io.nome, function(){ acApri("nome"); });
  acRiga(g1, "Foto", io.foto_url ? "c\u2019\u00e8" : "", function(){ acApri("foto"); });
  acRiga(g1, "Biografia", io.biografia, function(){ acApri("bio"); });
  acRiga(g1, "Telefono", io.telefono, function(){ acApri("tel"); });
  acRiga(g1, "Lingua", io.lingua, function(){ acApri("lin"); });
  /* ⚠️ il comune si mette dalla mappa, non da qui */
  acAttesa(g1, "Comune", io.comune_cod ? "\u00e8 messo" : "si mette dalla mappa");

  var g2 = acGruppo(box, "Cosa vedono gli altri");
  acSw(g2, "La biografia viaggia con me",
    "Compare accanto a quello che porti: prodotti, ricerche, bacheca. " +
    "Se la togli, resta vuota \u2014 mai un dato finto.",
    "consenso_bio", !!io.consenso_bio);
  acSw(g2, "Possono scrivermi",
    "Il tuo recapito non compare mai su nessuna pagina: si apre un contatto, " +
    "e sei tu a rispondere.",
    "consenso_contatto", !!io.consenso_contatto);
  acRiga(g2, "Quello che hai pubblicato", "", function(){
    if(typeof vai === "function") vai("emporio"); });
  acAttesa(g2, "La tua pagina", "l\u2019indirizzo non c\u2019\u00e8 ancora");

  var g3 = acGruppo(box, "Chiama qualcuno");
  acAttesa(g3, "Il tuo invito", "in costruzione");

  /* ⭐ i cinque di fm-account.js, che esistono dal 7 agosto */
  var g4 = acGruppo(box, "Le tue cose");
  function chiama(f){ return function(){
    if(typeof window[f] === "function") window[f]();
    else console.warn("manca " + f);
  }; }
  acRiga(g4, "Privacy e consensi", "", chiama("apriPrivacy"));
  acRiga(g4, "Fatturazione", "", chiama("apriFatturazione"));
  acRiga(g4, "Autorizzazioni", "", chiama("apriAutorizzazioni"));
  acRiga(g4, "Colore del tuo sito", io.colore_sito, chiama("apriColore"));
  acRiga(g4, "Segnala qualcosa", "", chiama("apriSegnala"));

  var es = document.createElement("button");
  es.type = "button"; es.className = "esci"; es.textContent = "Esci";
  es.onclick = async function(){
    try{ await db.auth.signOut(); location.reload(); }
    catch(e){ console.warn("account:", e); }
  };
  box.appendChild(es);

  var pie = document.createElement("div");
  pie.className = "pie";
  pie.textContent = "Comunit\u00e0 Eterna FelicitasMundi \u00b7 " +
    "Felicitas Omnia S.r.l.s. \u00b7 P.IVA 03075740906";
  box.appendChild(pie);
}

/* ── la porta ───────────────────────────────────────────────────── */
async function account(dove){
  var box = typeof dove === "string" ? document.querySelector(dove) : dove;
  if(!box) return;
  acVeste();
  acBox = box;
  acDisegna(box);              /* ⭐ si disegna subito, anche vuoto */
  acIo = await acLeggi();
  acDisegna(box);
}

window.SpazioVivo = window.SpazioVivo || {};
window.SpazioVivo.account = account;
