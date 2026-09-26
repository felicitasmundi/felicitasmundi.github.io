/* ═══════════════════════════════════════════════════════════════
   Comunità Eterna FelicitasMundi · IL CALENDARIO — la matrice

   Il disegno è quello di `calendario-matrice.html` (consegna del
   10 settembre, 7.805 · af516267ffeb1734067fd488f6f5ead2, MD5
   verificato prima di leggere). Si disegna DENTRO il contenitore
   che il guscio gli passa: niente pagina, niente fondo, niente
   caratteri — ci sono già.

   ⛔ LA REGOLA DELLA PAGINA: un evento è un'orma con un quando.
      Non c'è un posto dove scrivere gli eventi — scrivi un'orma,
      le metti una data, e compare qui.

   COSA DISEGNA: il riquadro del tempo · il tasto verso il telefono
   nei due stati (acceso dentro l'app, tratteggiato senza) · i mesi
   · le date col colore della stanza, ognuna con «↳ da …» se ha
   un'orma madre.

   ⭐ I LEGAMI PROPOSTI COMPAIONO SPENTI — parola di Gab, 10
      settembre: «una data che ti riguarda», tratteggiata come la
      proposta spenta del canone. Nel telefono invece vanno SOLO
      le orme proprie e le confermate.

   ⭐ IL PONTE DELL'APP — dalla posta dell'APP, 8 settembre:
      dentro l'app (navigator.userAgent contiene `FelicitasApp/`)
      il tasto è acceso e AL TOCCO chiama
      window.FelicitasApp.calendario(JSON.stringify(voci)) —
      ogni chiamata riconcilia, è idempotente. ⛔ Si chiama al
      gesto, mai all'avvio: il permesso lo chiede l'app lì.

   ⭐ FUORI DALL'APP c'è IL FEED — in linea dal 10 settembre, dalla
      posta del database: al tocco `db.rpc("fm_calendario_gettone")`
      dà il gettone della persona (richiamarlo non lo cambia), e
      l'indirizzo da mostrare è
      webcal://gfnveesogkfvkrdudpfg.supabase.co/functions/v1/calendario-ics?g=<gettone>.
      Una direzione sola; nel feed vanno solo i confermati, e quello
      lo fa il database. Chi ha girato l'indirizzo a chi non doveva
      lo rifà con `fm_calendario_gettone_rifai` (gesto non di qui).
   ⚠️ La frase del modello per lo stato spento — «da computer non
      si può: serve l'app» — è superata dal feed vivo: qui non
      c'è più, e se serve una riga nuova sono parole di Gab.

   ⚠️ [ in attesa ] LA DATA CHIUSA COLLA SOGLIA — «si apre da che
      livello» — aspetta la forma dal database (quali eventi, che
      soglia): finché manca, non si disegna. La cucitura è una
      (calChiuse).

   ⛔ Da ospite si vedono solo la data e il riquadro del tempo.
   ⛔ Niente involucro (function(){ … })(): il guscio mette tutto
      in comune e questo file legge da lì.
   ═══════════════════════════════════════════════════════════════ */

"use strict";

/* i cinque elementi → la stanza e il colore: la mappa versata */
var CAL_STANZE = {
  terra: { stanza: "Vicinati",   colore: "#AA8844" },
  acqua: { stanza: "Emporio",    colore: "#4488BB" },
  aria:  { stanza: "Edizione",   colore: "#669944" },
  etere: { stanza: "Scuola",     colore: "#9966CC" },
  fuoco: { stanza: "Assistenza", colore: "#CC6644" }
};

function calVeste(){
  if(document.getElementById("fm-cal-veste")) return;
  var s = document.createElement("style");
  s.id = "fm-cal-veste";
  s.textContent =
    ".fm-cal{width:100%;max-width:37rem;margin:0 auto;" +
      "padding:1.8rem 1.2rem 3.6rem;" +
      "font-family:'DM Sans',system-ui,sans-serif;color:#F5F0E6}" +
    ".fm-cal *{box-sizing:border-box}" +
    ".fm-cal .oc{font-size:.77rem;letter-spacing:.2em;text-transform:uppercase;" +
      "color:#C8A055;margin-bottom:.36rem}" +
    ".fm-cal h1{font-family:'Cinzel',serif;font-weight:400;font-size:1.7rem;" +
      "line-height:1.2;margin:0 0 1.08rem}" +

    ".fm-cal .tempo{display:flex;gap:.48rem;margin-bottom:1.08rem}" +
    ".fm-cal .tempo .q{flex:1;border:1px solid rgba(184,150,62,.22);" +
      "border-radius:.9rem;background:rgba(8,11,26,.4);" +
      "padding:.66rem .36rem;text-align:center}" +
    ".fm-cal .tempo .q b{display:block;font-family:'Cinzel',serif;font-weight:400;" +
      "font-size:1.2rem;color:#D4AF6A;line-height:1.1}" +
    ".fm-cal .tempo .q span{display:block;font-size:.72rem;" +
      "color:rgba(245,240,230,.42);margin-top:.24rem}" +

    /* il tasto verso il telefono, nei due stati */
    ".fm-cal .tel{display:flex;align-items:center;gap:.84rem;" +
      "border:1px solid rgba(110,158,90,.45);border-radius:1.02rem;" +
      "background:rgba(110,158,90,.1);padding:.84rem 1.02rem;" +
      "margin-bottom:.6rem;cursor:pointer}" +
    ".fm-cal .tel .sg{width:2.52rem;height:2.52rem;border-radius:50%;flex:none;" +
      "display:grid;place-items:center;border:1px solid rgba(110,158,90,.5);" +
      "color:#6E9E5A;filter:brightness(1.2);font-size:1.2rem}" +
    ".fm-cal .tel .tx{flex:1}" +
    ".fm-cal .tel .tx b{display:block;font-weight:400;font-size:1.14rem}" +
    ".fm-cal .tel .tx i{display:block;font-style:normal;font-size:.96rem;" +
      "color:rgba(245,240,230,.5);margin-top:.12rem;line-height:1.4}" +
    ".fm-cal .tel .fr{flex:none;color:rgba(245,240,230,.3)}" +
    ".fm-cal .tel.spento{border-style:dashed;border-color:rgba(245,240,230,.18);" +
      "background:rgba(8,11,26,.3);cursor:default}" +
    ".fm-cal .tel.spento .sg{border-color:rgba(245,240,230,.2);" +
      "color:rgba(245,240,230,.3);filter:none}" +
    ".fm-cal .tel.spento .tx b{color:rgba(245,240,230,.45)}" +

    ".fm-cal .mesi{display:flex;gap:.36rem;overflow-x:auto;margin-bottom:.96rem;" +
      "padding-bottom:.24rem;scrollbar-width:none}" +
    ".fm-cal .mesi::-webkit-scrollbar{display:none}" +
    ".fm-cal .mesi button{font-family:'DM Sans',sans-serif;font-size:.94rem;" +
      "padding:.36rem .96rem;border-radius:1.68rem;cursor:pointer;" +
      "background:transparent;white-space:nowrap;" +
      "border:1px solid rgba(245,240,230,.16);color:rgba(245,240,230,.55)}" +
    ".fm-cal .mesi button.on{border-color:#C8A055;background:rgba(200,160,85,.18);" +
      "color:#D4AF6A}" +

    ".fm-cal .gg{font-size:.82rem;letter-spacing:.1em;text-transform:uppercase;" +
      "color:rgba(245,240,230,.32);margin:1.2rem 0 .42rem .12rem}" +
    ".fm-cal .dt{display:flex;align-items:stretch;gap:.84rem;margin-bottom:.42rem}" +
    ".fm-cal .dt .qd{flex:none;width:3.36rem;border-radius:.78rem;display:flex;" +
      "flex-direction:column;align-items:center;justify-content:center;" +
      "padding:.48rem 0;" +
      "border:1px solid color-mix(in srgb,var(--c,#C8A055) 35%,transparent);" +
      "background:color-mix(in srgb,var(--c,#C8A055) 12%,transparent)}" +
    ".fm-cal .dt .qd b{font-family:'Cinzel',serif;font-size:1.38rem;line-height:1;" +
      "color:var(--c,#C8A055);filter:brightness(1.3);font-weight:400}" +
    ".fm-cal .dt .qd span{font-size:.7rem;letter-spacing:.08em;" +
      "color:rgba(245,240,230,.4);margin-top:.18rem}" +
    ".fm-cal .dt .cr{flex:1;min-width:0;" +
      "border:1px solid color-mix(in srgb,var(--c,#C8A055) 24%,transparent);" +
      "border-left:3px solid color-mix(in srgb,var(--c,#C8A055) 55%,transparent);" +
      "border-radius:.9rem;" +
      "background:color-mix(in srgb,var(--c,#C8A055) 6%,rgba(8,11,26,.42));" +
      "padding:.72rem .9rem}" +
    ".fm-cal .dt .cr .et{font-size:.74rem;letter-spacing:.1em;" +
      "text-transform:uppercase;color:var(--c,#C8A055);filter:brightness(1.3)}" +
    ".fm-cal .dt .cr b{display:block;font-family:'Cormorant Garamond',serif;" +
      "font-weight:400;font-size:1.3rem;line-height:1.3;margin-top:.06rem}" +
    ".fm-cal .dt .cr .me{display:flex;gap:.42rem;align-items:center;flex-wrap:wrap;" +
      "margin-top:.3rem;font-size:.91rem;color:rgba(245,240,230,.44)}" +
    ".fm-cal .dt .cr .da{display:block;font-size:.89rem;" +
      "color:rgba(245,240,230,.4);margin-top:.3rem;line-height:1.35}" +
    ".fm-cal .dt .cr .da em{font-style:normal;color:rgba(245,240,230,.62)}" +

    /* la proposta spenta: una data che ti riguarda */
    ".fm-cal .dt.spenta .cr{border-style:dashed;background:rgba(8,11,26,.3)}" +
    ".fm-cal .dt.spenta .qd{border-style:dashed;opacity:.5}" +
    ".fm-cal .dt.spenta .cr b{color:rgba(245,240,230,.42)}";
  document.head.appendChild(s);
}

/* ── lo stato del modulo ── */
var calParti = null;
var calMese  = null;     /* "AAAA-MM" del mese guardato */
var calRighe = null;     /* {o, stato} — stato: null (mia) · confermato · proposto */
var calMadri = {};       /* id → titolo dell'orma madre */

function calGiornoDi(o){
  return String(o.accaduto_il || "").slice(0,10);
}
function calMeseDi(o){ return calGiornoDi(o).slice(0,7); }
function calOggiMese(){
  var d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,"0");
}
function calNomeMese(m){
  return new Date(m + "-15T12:00:00").toLocaleDateString("it-IT",
    { month: "long", year: "numeric" });
}
function calDentroLApp(){
  return typeof navigator !== "undefined" &&
    /FelicitasApp\//.test(navigator.userAgent || "");
}
function calStanzaDi(o){
  if(typeof DOVE === "undefined" || !DOVE || !o.tipo) return null;
  var q = DOVE.filter(function(x){ return x.tipo === o.tipo; })[0];
  return (q && q.el && CAL_STANZE[q.el]) || null;
}

/* ⚠️ [ in attesa ] le date chiuse colla soglia: la forma arriva dal
   database — quali eventi, e da che livello si aprono */
function calChiuse(){ return []; }

/* ── l'unica porta: la chiama il guscio da vai() ── */
function ilCalendario(c){
  calVeste();
  var r = document.createElement("div");
  r.className = "fm-cal";
  c.appendChild(r);
  calParti = { radice: r, caselle: null, lista: null, mesi: null };

  var oc = document.createElement("div");
  oc.className = "oc";
  oc.textContent = "le orme che hanno un giorno";
  r.appendChild(oc);
  var h1 = document.createElement("h1");
  h1.textContent = "Il calendario";
  r.appendChild(h1);

  var tempo = document.createElement("div");
  tempo.className = "tempo";
  var caselle = {};
  ["data","luna","santo"].forEach(function(k){
    var q = document.createElement("div"); q.className = "q";
    var b = document.createElement("b");
    var s = document.createElement("span");
    q.appendChild(b); q.appendChild(s); tempo.appendChild(q);
    caselle[k] = { b: b, s: s };
  });
  r.appendChild(tempo);
  calParti.caselle = caselle;
  var oggi = new Date();
  caselle.data.b.textContent = String(oggi.getDate());
  caselle.data.s.textContent = oggi.toLocaleDateString("it-IT", { month: "long" });
  calTempo(typeof GIORNO !== "undefined" ? GIORNO : null);
  calAscolta();

  /* ⛔ da ospite si vedono solo la data e il riquadro del tempo */
  if(typeof ospite !== "undefined" && ospite) return;
  if(typeof io === "undefined" || !io || !io.id) return;

  /* il tasto verso il telefono: dentro l'app il ponte, fuori il feed */
  var tel = document.createElement("div");
  var app = calDentroLApp();
  tel.className = "tel";
  var tsg = document.createElement("span"); tsg.className = "sg"; tsg.textContent = "⊕";
  var ttx = document.createElement("span"); ttx.className = "tx";
  var ttb = document.createElement("b"); ttb.textContent = "Porta le date nel telefono";
  var tti = document.createElement("i");
  if(app) tti.textContent = "l’app le scrive nel calendario di sistema";
  ttx.appendChild(ttb); ttx.appendChild(tti);
  tel.appendChild(tsg); tel.appendChild(ttx);
  var tfr = document.createElement("span"); tfr.className = "fr"; tfr.textContent = "›";
  tel.appendChild(tfr);
  if(app){
    /* ⛔ il ponte si chiama AL GESTO, mai all'avvio: il permesso
       lo chiede l'app lì. Ogni chiamata riconcilia, è idempotente. */
    tel.addEventListener("click", function(){ calAlTelefono(); });
  } else {
    tel.addEventListener("click", function(){ calFeed(tti); });
  }
  r.appendChild(tel);

  var mesi = document.createElement("div");
  mesi.className = "mesi";
  r.appendChild(mesi);
  calParti.mesi = mesi;

  var lista = document.createElement("div");
  r.appendChild(lista);
  calParti.lista = lista;

  if(calMese == null) calMese = calOggiMese();
  calLeggi();
}

function calTempo(g){
  var p = calParti;
  if(!p || !p.caselle) return;
  p.caselle.luna.b.textContent = "🌑";
  p.caselle.luna.s.textContent = (g && g.fase) || "—";
  p.caselle.santo.b.textContent = (g && g.santo) || "—";
  p.caselle.santo.s.textContent = "il santo";
}
function calAscolta(){
  window.SpazioVivo = window.SpazioVivo || {};
  var prima = window.SpazioVivo.oggi;
  if(!prima || !prima.fmCal){
    var mio = function(g){
      if(typeof prima === "function") prima(g);
      calTempo(g);
    };
    mio.fmCal = true;
    window.SpazioVivo.oggi = mio;
  }
  if(typeof riempiIlGiorno === "function") riempiIlGiorno();
}

/* ── le letture: le mie orme col giorno, e quelle in cui sono chiamato ── */
function calLeggi(){
  if(typeof db === "undefined" || !db) return;
  db.from("orme")
    .select("id,titolo,contenuto,tipo,momento,accaduto_il,luogo,orma_madre_id")
    .eq("persona_id", io.id)
    .not("accaduto_il", "is", null)
    .then(function(r){
      if(!r || r.error){
        console.warn("fm-calendario: le orme non rispondono — " +
          (r && r.error && r.error.message || "senza motivo"));
        return;
      }
      var righe = ((r.data) || []).map(function(o){ return { o: o, stato: null }; });
      /* le orme in cui sono chiamato: confermate piene, proposte spente */
      db.from("orma_persone").select("orma_id,stato")
        .eq("persona_id", io.id)
        .then(function(rp){
          var stati = {};
          ((rp && rp.data) || []).forEach(function(x){
            if(x.stato === "confermato" || x.stato === "proposto")
              stati[x.orma_id] = x.stato;
          });
          var ids = Object.keys(stati);
          if(!ids.length){ calRighe = righe; calMadriLeggi(); return; }
          db.from("orme")
            .select("id,titolo,contenuto,tipo,momento,accaduto_il,luogo,orma_madre_id")
            .in("id", ids)
            .not("accaduto_il", "is", null)
            .then(function(ra){
              /* quello che le regole di riga non mandano, non c'è: giusto così */
              ((ra && ra.data) || []).forEach(function(o){
                if(righe.some(function(x){ return x.o.id === o.id; })) return;
                righe.push({ o: o, stato: stati[o.id] });
              });
              calRighe = righe; calMadriLeggi();
            })
            .catch(function(){ calRighe = righe; calMadriLeggi(); });
        })
        .catch(function(){ calRighe = righe; calMadriLeggi(); });
    })
    .catch(function(e){
      console.warn("fm-calendario: le orme non rispondono — " + (e && e.message));
    });
}

function calMadriLeggi(){
  var ids = [];
  (calRighe || []).forEach(function(x){
    var m = x.o.orma_madre_id;
    if(m && !calMadri[m] && ids.indexOf(m) < 0) ids.push(m);
  });
  if(!ids.length){ calDisegna(); return; }
  db.from("orme").select("id,titolo,contenuto").in("id", ids)
    .then(function(r){
      ((r && r.data) || []).forEach(function(o){
        calMadri[o.id] = o.titolo || String(o.contenuto || "").split("\n")[0].slice(0, 60);
      });
      calDisegna();
    })
    .catch(function(){ calDisegna(); });
}

/* ── il disegno ── */
function calDisegna(){
  var p = calParti;
  if(!p || !calRighe) return;

  /* i mesi che hanno date, più quello di oggi */
  var mesi = [calOggiMese()];
  calRighe.forEach(function(x){
    var m = calMeseDi(x.o);
    if(m && mesi.indexOf(m) < 0) mesi.push(m);
  });
  mesi.sort();
  if(mesi.indexOf(calMese) < 0) calMese = calOggiMese();

  p.mesi.innerHTML = "";
  mesi.forEach(function(m){
    var b = document.createElement("button");
    b.type = "button";
    b.textContent = (m === calOggiMese()) ? "questo mese" : calNomeMese(m);
    if(m === calMese) b.className = "on";
    b.addEventListener("click", function(){ calMese = m; calDisegna(); });
    p.mesi.appendChild(b);
  });

  p.lista.innerHTML = "";
  var delMese = calRighe.filter(function(x){ return calMeseDi(x.o) === calMese; })
    .sort(function(a, b){
      var ga = String(a.o.accaduto_il), gb = String(b.o.accaduto_il);
      return ga < gb ? -1 : 1;
    });
  /* ⚠️ [ in attesa ] qui entreranno anche le date chiuse colla soglia */
  calChiuse().forEach(function(x){ delMese.push(x); });

  if(!delMese.length) return;   /* un mese senza date non mostra righe */

  var gg = document.createElement("div");
  gg.className = "gg";
  gg.textContent = calNomeMese(calMese);
  p.lista.appendChild(gg);

  delMese.forEach(function(x){
    var o = x.o;
    var stanza = calStanzaDi(o);
    var dt = document.createElement("div");
    dt.className = "dt" + (x.stato === "proposto" ? " spenta" : "");
    if(stanza) dt.style.setProperty("--c", stanza.colore);
    var qd = document.createElement("span");
    qd.className = "qd";
    var g = calGiornoDi(o);
    var qb = document.createElement("b");
    qb.textContent = String(parseInt(g.slice(8,10), 10) || "");
    var qs = document.createElement("span");
    qs.textContent = new Date(g + "T12:00:00")
      .toLocaleDateString("it-IT", { weekday: "short" });
    qd.appendChild(qb); qd.appendChild(qs);
    var cr = document.createElement("span");
    cr.className = "cr";
    if(stanza){
      var et = document.createElement("span");
      et.className = "et";
      et.textContent = stanza.stanza;
      cr.appendChild(et);
    }
    var b = document.createElement("b");
    b.textContent = o.titolo || String(o.contenuto || "").split("\n")[0].slice(0, 80);
    cr.appendChild(b);
    var acc = String(o.accaduto_il || "");
    var ora = acc.length > 10 ? acc.slice(11, 16) : "";
    if(ora || o.luogo){
      var me = document.createElement("span");
      me.className = "me";
      if(ora){
        var s1 = document.createElement("span"); s1.textContent = ora;
        me.appendChild(s1);
      }
      if(ora && o.luogo){
        var pu = document.createElement("span"); pu.textContent = "·";
        me.appendChild(pu);
      }
      if(o.luogo){
        var s2 = document.createElement("span"); s2.textContent = o.luogo;
        me.appendChild(s2);
      }
      cr.appendChild(me);
    }
    if(x.stato === "proposto"){
      /* parola di Gab, 10 settembre */
      var rig = document.createElement("span");
      rig.className = "da";
      rig.textContent = "una data che ti riguarda";
      cr.appendChild(rig);
    } else if(o.orma_madre_id && calMadri[o.orma_madre_id]){
      var da = document.createElement("span");
      da.className = "da";
      da.appendChild(document.createTextNode("↳ da "));
      var em = document.createElement("em");
      em.textContent = calMadri[o.orma_madre_id];
      da.appendChild(em);
      cr.appendChild(da);
    }
    dt.appendChild(qd); dt.appendChild(cr);
    dt.addEventListener("click", function(){
      window.ormaChiesta = o.id;
      if(typeof vai === "function") vai("orma");
    });
    p.lista.appendChild(dt);
  });
}

/* ── il feed, fuori dall'app: al gesto si chiede il gettone e
   compare l'indirizzo che il telefono legge da sé ── */
var calFeedInCorso = false;
function calFeed(dove){
  if(calFeedInCorso || !dove) return;
  if(typeof db === "undefined" || !db || typeof db.rpc !== "function"){
    console.warn("fm-calendario: il database non c’è — niente gettone");
    return;
  }
  calFeedInCorso = true;
  db.rpc("fm_calendario_gettone")
    .then(function(r){
      calFeedInCorso = false;
      if(!r || r.error || !r.data){
        console.warn("fm-calendario: il gettone non è arrivato — " +
          (r && r.error && r.error.message || "senza motivo"));
        return;
      }
      var indirizzo = "webcal://gfnveesogkfvkrdudpfg.supabase.co" +
        "/functions/v1/calendario-ics?g=" + encodeURIComponent(String(r.data));
      dove.innerHTML = "";
      var a = document.createElement("a");
      a.href = indirizzo;
      a.textContent = indirizzo;
      a.style.color = "#D4AF6A";
      a.style.wordBreak = "break-all";
      dove.appendChild(a);
    })
    .catch(function(e){
      calFeedInCorso = false;
      console.warn("fm-calendario: il gettone non è arrivato — " + (e && e.message));
    });
}

/* ── il ponte verso il telefono: solo al gesto, solo il vero ──
   Le voci sono le mie orme col giorno e le confermate — le proposte
   NON escono. Ogni chiamata riconcilia: manda la verità intera. */
function calAlTelefono(){
  if(typeof window === "undefined" || !window.FelicitasApp ||
     typeof window.FelicitasApp.calendario !== "function"){
    console.warn("fm-calendario: il ponte dell’app non c’è");
    return;
  }
  var voci = (calRighe || [])
    .filter(function(x){ return x.stato !== "proposto"; })
    .map(function(x){
      var o = x.o;
      var acc = String(o.accaduto_il || "");
      var voce = {
        id: o.id,
        titolo: o.titolo || String(o.contenuto || "").split("\n")[0].slice(0, 80)
      };
      if(acc.length > 10){
        voce.inizio = new Date(acc).getTime();
      } else {
        voce.inizio = Date.UTC(+acc.slice(0,4), +acc.slice(5,7) - 1, +acc.slice(8,10));
        voce.giornata = true;
      }
      if(o.luogo) voce.luogo = o.luogo;
      return voce;
    });
  try{
    window.FelicitasApp.calendario(JSON.stringify(voci));
  }catch(e){
    console.warn("fm-calendario: il ponte non ha preso — " + (e && e.message));
  }
}
