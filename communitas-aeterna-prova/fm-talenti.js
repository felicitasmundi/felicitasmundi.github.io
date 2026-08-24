/* ═══════════════════════════════════════════════════════════════════════
   FM-TALENTI.JS — lo scambio comune
   Comunità Eterna FelicitasMundi · 13 agosto 2026

   Si carica come gli altri fm-*.js, dopo il guscio.
   Usa del guscio: db · io · ospite · parla() · chiediAccesso()
                   caricaOrme() · contaOrme() · vista

   Nel Megafono serve una voce «talenti» che chiami talentiApri().
   ═══════════════════════════════════════════════════════════════════════ */

(function(){

  /* ── le due librerie, caricate quando servono ──────────────────────── */

  var LIB_QR   = "https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js";
  var LIB_LEGGI= "https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js";
  var caricate = {};

  function carica(url, poi){
    if(caricate[url]){ poi(); return; }
    var s = document.createElement("script");
    s.src = url;
    s.onload = function(){ caricate[url] = true; poi(); };
    s.onerror= function(){ parla("Non si è caricato lo strumento del codice."); };
    document.head.appendChild(s);
  }

  /* ── stato ─────────────────────────────────────────────────────────── */

  var saldo = 0, mioCodice = null, timer = null, trovato = null, flusso = null;

  var BASE = location.origin + location.pathname;

  /* ═══ LA VESTE ═══════════════════════════════════════════════════════ */

  function veste(){
    if(document.getElementById("v-talenti")) return;

    var st = document.createElement("style");
    st.textContent = [
      "#v-talenti{position:fixed;inset:0;z-index:80;display:none;",
      "  background:rgba(2,4,12,.95);overflow-y:auto;padding:22px 16px}",
      "#v-talenti.on{display:block}",
      ".tal-w{max-width:520px;margin:0 auto}",
      ".tal-h{display:flex;align-items:center;gap:12px;margin-bottom:18px;",
      "  padding-bottom:14px;border-bottom:1px solid rgba(184,150,62,.22)}",
      ".tal-h b{font-family:'Cinzel',serif;font-weight:500;flex:1;",
      "  font-size:calc(.76rem*var(--scala,1.4));color:var(--gold,#D4AF6A)}",
      ".tal-x{background:none;border:1px solid rgba(184,150,62,.28);border-radius:999px;",
      "  color:rgba(245,240,230,.6);padding:6px 14px;cursor:pointer;",
      "  font-family:'DM Sans',sans-serif;font-size:calc(.58rem*var(--scala,1.4))}",
      ".tal-x:hover{border-color:var(--gold,#D4AF6A);color:var(--gold,#D4AF6A)}",

      ".tal-s{display:flex;gap:12px;align-items:center;border:1px solid rgba(184,150,62,.3);",
      "  border-radius:12px;background:rgba(10,12,26,.6);padding:14px 16px;margin-bottom:18px}",
      ".tal-s .n{flex:1}",
      ".tal-s .k{font-size:calc(.58rem*var(--scala,1.4));letter-spacing:.13em;",
      "  text-transform:uppercase;color:var(--gold,#D4AF6A)}",
      ".tal-s .v{font-family:'Cinzel',serif;font-weight:500;",
      "  font-size:calc(.9rem*var(--scala,1.4));color:#F5F0E6;margin-top:2px}",

      ".tal-b{display:block;width:100%;background:none;cursor:pointer;text-align:left;",
      "  border:1px solid rgba(184,150,62,.3);border-radius:12px;padding:15px 17px;",
      "  margin-bottom:9px;color:#F5F0E6;font-family:'DM Sans',sans-serif;",
      "  font-size:calc(.67rem*var(--scala,1.4));transition:border-color .18s}",
      ".tal-b:hover{border-color:var(--gold,#D4AF6A)}",
      ".tal-b i{display:block;font-family:'Cormorant Garamond',serif;font-style:italic;",
      "  font-size:calc(.58rem*var(--scala,1.4));color:rgba(245,240,230,.5);margin-top:3px}",

      ".tal-c{display:block;width:100%;background:rgba(2,4,12,.5);color:#F5F0E6;",
      "  border:1px solid rgba(184,150,62,.3);border-radius:9px;padding:12px 14px;",
      "  font-family:'Cormorant Garamond',serif;margin-bottom:10px;",
      "  font-size:calc(.67rem*var(--scala,1.4))}",
      ".tal-c:focus{outline:0;border-color:var(--gold,#D4AF6A)}",
      ".tal-e{font-size:calc(.58rem*var(--scala,1.4));letter-spacing:.1em;",
      "  text-transform:uppercase;color:rgba(245,240,230,.42);margin-bottom:6px}",

      ".tal-ok{background:var(--gold,#C8A055);color:#0A0C1A;border:0;border-radius:999px;",
      "  padding:13px 24px;font-weight:500;cursor:pointer;width:100%;",
      "  font-family:'DM Sans',sans-serif;font-size:calc(.67rem*var(--scala,1.4))}",
      ".tal-no{background:none;border:1px solid rgba(184,150,62,.28);border-radius:999px;",
      "  color:rgba(245,240,230,.55);padding:11px 20px;cursor:pointer;margin-top:9px;",
      "  width:100%;font-family:'DM Sans',sans-serif;font-size:calc(.58rem*var(--scala,1.4))}",

      /* il sigillo */
      ".tal-sig{position:relative;width:260px;height:260px;margin:4px auto 14px;",
      "  border-radius:50%;background:#F5F0E6;display:flex;align-items:center;",
      "  justify-content:center;box-shadow:0 0 0 2px #C8A055, 0 0 0 12px rgba(2,4,12,0)}",
      ".tal-sig canvas{width:190px;height:190px;image-rendering:pixelated}",
      ".tal-sig .nx{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);",
      "  width:52px;height:52px;background:#F5F0E6;border-radius:50%;",
      "  display:flex;align-items:center;justify-content:center}",
      ".tal-cod{font-family:'Cinzel',serif;font-size:calc(1.1rem*var(--scala,1.4));",
      "  letter-spacing:.22em;color:var(--gold,#D4AF6A);text-align:center;margin-bottom:6px}",
      ".tal-q{font-family:'Cormorant Garamond',serif;font-style:italic;text-align:center;",
      "  color:rgba(245,240,230,.6);font-size:calc(.67rem*var(--scala,1.4));margin-bottom:16px}",
      ".tal-att{text-align:center;color:rgba(245,240,230,.45);",
      "  font-family:'Cormorant Garamond',serif;font-style:italic;",
      "  font-size:calc(.58rem*var(--scala,1.4));line-height:1.6}",

      "#tal-video{width:100%;max-width:400px;border-radius:12px;display:block;",
      "  margin:0 auto 12px;border:1px solid rgba(184,150,62,.3)}",
      ".tal-riga{display:flex;justify-content:space-between;gap:12px;padding:11px 0;",
      "  border-top:1px solid rgba(184,150,62,.13);",
      "  font-size:calc(.58rem*var(--scala,1.4));color:rgba(245,240,230,.82)}",
      ".tal-riga:first-of-type{border-top:0}",
      ".tal-riga b{color:var(--gold,#D4AF6A)}",
      ".tal-box{border:1px solid rgba(184,150,62,.3);border-radius:12px;",
      "  padding:15px 17px;margin-bottom:14px;background:rgba(10,12,26,.5)}",
      ".tal-fat{text-align:center;padding:26px 10px}",
      ".tal-fat .g{font-family:'Cinzel',serif;color:var(--gold,#D4AF6A);",
      "  font-size:calc(.9rem*var(--scala,1.4));margin-bottom:8px}"
    ].join("");
    document.head.appendChild(st);

    var d = document.createElement("div");
    d.id = "v-talenti";
    d.innerHTML =
    '<div class="tal-w">'+
      '<div class="tal-h"><b>talenti</b>'+
        '<button class="tal-x" id="tal-chiudi">chiudi</button></div>'+

      '<div class="tal-s">'+
        '<svg viewBox="0 0 40 40" width="38" height="38" fill="none" stroke="#D4AF6A" '+
        'stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">'+
        '<circle cx="20" cy="20" r="14"/><circle cx="20" cy="20" r="11.2"/>'+
        '<path d="M20 12.5 L26 15.7 L26 24.3 L20 27.5 L14 24.3 L14 15.7 Z"/>'+
        '<path d="M20 12.5 L20 20 M20 20 L26 15.7 M20 20 L14 15.7 M20 20 L20 27.5"/></svg>'+
        '<div class="n"><span class="k">i tuoi talenti</span>'+
          '<div class="v"><span id="tal-saldo">—</span></div></div>'+
      '</div>'+

      /* ① la scelta */
      '<div id="tal-scelta">'+
        '<button class="tal-b" id="tal-vai-gen">Ho ricevuto qualcosa'+
          '<i>generi il sigillo, e chi ti ha dato il servizio lo inquadra</i></button>'+
        '<button class="tal-b" id="tal-vai-leg">Ho dato qualcosa'+
          '<i>inquadri il sigillo, o scrivi il codice</i></button>'+
        '<button class="tal-b" id="tal-vai-mov">I miei scambi'+
          '<i>quello che è passato</i></button>'+
      '</div>'+

      /* ② genera */
      '<div id="tal-genera" style="display:none">'+
        '<div id="tal-gen-form">'+
          '<div class="tal-e">quanti talenti</div>'+
          '<input class="tal-c" id="tal-quanti" type="number" min="1" step="1" '+
            'inputmode="numeric" placeholder="0">'+
          '<div class="tal-e">cosa hai ricevuto</div>'+
          '<input class="tal-c" id="tal-cosa" type="text" placeholder="">'+
          '<button class="tal-ok" id="tal-fai">Genera il sigillo</button>'+
          '<button class="tal-no" id="tal-gen-back">indietro</button>'+
        '</div>'+
        '<div id="tal-gen-esce" style="display:none">'+
          '<div class="tal-sig"><canvas id="tal-canvas"></canvas>'+
            '<div class="nx"><svg viewBox="0 0 40 40" width="40" height="40" fill="none" '+
            'stroke="#0A0C1A" stroke-width="1.6" stroke-linejoin="round">'+
            '<path d="M20 9 L29 14.5 L29 25.5 L20 31 L11 25.5 L11 14.5 Z"/>'+
            '<path d="M20 9 L20 20 M20 20 L29 14.5 M20 20 L11 14.5 M20 20 L20 31"/>'+
            '</svg></div></div>'+
          '<div class="tal-cod" id="tal-cod">——————</div>'+
          '<div class="tal-q"><span id="tal-q-n">0</span> talenti</div>'+
          '<div class="tal-att" id="tal-att">Fallo inquadrare a chi ti ha dato il servizio.<br>'+
            'Il sigillo vale trenta minuti.</div>'+
          '<button class="tal-no" id="tal-annulla">annulla lo scambio</button>'+
        '</div>'+
      '</div>'+

      /* ③ leggi */
      '<div id="tal-leggi" style="display:none">'+
        '<video id="tal-video" playsinline muted></video>'+
        '<div class="tal-e">oppure scrivi il codice</div>'+
        '<input class="tal-c" id="tal-inserito" type="text" maxlength="6" '+
          'placeholder="——————" style="text-align:center;letter-spacing:.3em;'+
          'text-transform:uppercase">'+
        '<button class="tal-ok" id="tal-cerca">Cerca</button>'+
        '<div id="tal-trovato" style="display:none;margin-top:16px">'+
          '<div class="tal-box">'+
            '<div class="tal-riga"><span>ti ha proposto</span><b id="tal-t-chi">—</b></div>'+
            '<div class="tal-riga"><span>per</span><b id="tal-t-cosa">—</b></div>'+
            '<div class="tal-riga"><span>talenti</span><b id="tal-t-q">—</b></div>'+
          '</div>'+
          '<button class="tal-ok" id="tal-conf">Conferma lo scambio</button>'+
        '</div>'+
        '<button class="tal-no" id="tal-leg-back">indietro</button>'+
      '</div>'+

      /* ④ movimenti */
      '<div id="tal-mov" style="display:none">'+
        '<div id="tal-mov-lista"></div>'+
        '<button class="tal-no" id="tal-mov-back">indietro</button>'+
      '</div>'+

      /* ⑤ fatto */
      '<div id="tal-fatto" style="display:none">'+
        '<div class="tal-fat"><div class="g" id="tal-fat-t">Scambio confermato</div>'+
          '<div class="tal-att" id="tal-fat-s"></div></div>'+
        '<button class="tal-ok" id="tal-fat-ok">Torna</button>'+
      '</div>'+

    '</div>';
    document.body.appendChild(d);
    aggancia();
  }

  function aggancia(){
    var q = function(i){ return document.getElementById(i); };
    q("tal-chiudi").onclick   = chiudi;
    q("tal-vai-gen").onclick  = function(){ schermo("genera"); resetGen(); };
    q("tal-vai-leg").onclick  = function(){ schermo("leggi"); avviaCamera(); };
    q("tal-vai-mov").onclick  = function(){ schermo("mov"); movimenti(); };
    q("tal-fai").onclick      = genera;
    q("tal-gen-back").onclick = function(){ schermo("scelta"); };
    q("tal-annulla").onclick  = annulla;
    q("tal-cerca").onclick    = function(){ cerca(q("tal-inserito").value); };
    q("tal-conf").onclick     = conferma;
    q("tal-leg-back").onclick = function(){ fermaCamera(); schermo("scelta"); };
    q("tal-mov-back").onclick = function(){ schermo("scelta"); };
    q("tal-fat-ok").onclick   = function(){ schermo("scelta"); };
    q("tal-inserito").addEventListener("keydown", function(e){
      if(e.key === "Enter") cerca(this.value);
    });
  }

  function schermo(n){
    ["scelta","genera","leggi","mov","fatto"].forEach(function(x){
      var e = document.getElementById("tal-"+x);
      if(e) e.style.display = (x === n) ? "block" : "none";
    });
    if(n !== "leggi") fermaCamera();
  }

  /* ═══ IL SALDO ═══════════════════════════════════════════════════════ */

  function leggiSaldo(poi){
    db.from("persone").select("talenti").eq("id", io.id).single().then(function(r){
      saldo = r.error ? 0 : Number(r.data.talenti || 0);
      var s = document.getElementById("tal-saldo");
      if(s) s.textContent = String(saldo).replace(/\.00$/,"");
      if(poi) poi(saldo);
    });
  }

  /* ═══ ① CHI RICEVE — genera il sigillo ═══════════════════════════════ */

  function resetGen(){
    document.getElementById("tal-gen-form").style.display = "block";
    document.getElementById("tal-gen-esce").style.display = "none";
    document.getElementById("tal-quanti").value = "";
    document.getElementById("tal-cosa").value = "";
  }

  function genera(){
    var q = parseFloat(document.getElementById("tal-quanti").value);
    var c = document.getElementById("tal-cosa").value.trim();
    if(!q || q <= 0){ parla("Scrivi quanti talenti."); return; }
    if(!c){ parla("Scrivi cosa hai ricevuto."); return; }

    leggiSaldo(function(s){
      if(s < q){ parla("Hai " + s + " talenti, ne servono " + q + "."); return; }

      var alf = "ACDEFGHJKLMNPQRTUVWXY3456789", cod = "";
      for(var i=0;i<6;i++) cod += alf.charAt(Math.floor(Math.random()*alf.length));

      db.from("talenti_movimenti").insert({
        da_persona: io.id, a_persona: io.id,
        quantita: q, motivo: c, stato: "proposto", codice: cod,
        codice_scade_il: new Date(Date.now() + 30*60*1000).toISOString()
      }).select("id,codice,quantita").single().then(function(r){
        if(r.error){ parla("Non è stato creato: " + r.error.message); return; }
        mioCodice = r.data;
        document.getElementById("tal-gen-form").style.display = "none";
        document.getElementById("tal-gen-esce").style.display = "block";
        document.getElementById("tal-cod").textContent = cod;
        document.getElementById("tal-q-n").textContent = q;
        disegnaSigillo(cod);
        timer = setInterval(controlla, 4000);
      });
    });
  }

  function disegnaSigillo(cod){
    carica(LIB_QR, function(){
      var cv = document.getElementById("tal-canvas");
      window.QRCode.toCanvas(cv, BASE + "?t=" + cod, {
        errorCorrectionLevel: "H",
        margin: 1, width: 380,
        color: { dark: "#C8A055", light: "#F5F0E6" }
      }, function(err){ if(err) parla("Il sigillo non si è disegnato."); });
    });
  }

  function controlla(){
    if(!mioCodice) return;
    db.from("talenti_movimenti").select("stato").eq("id", mioCodice.id).single()
      .then(function(r){
        if(r.error || !r.data) return;
        if(r.data.stato === "confermato"){
          clearInterval(timer); timer = null;
          document.getElementById("tal-fat-t").textContent = "Scambio confermato";
          document.getElementById("tal-fat-s").innerHTML =
            "Sono passati <b>" + mioCodice.quantita + "</b> talenti.<br>Resta un'orma.";
          schermo("fatto"); leggiSaldo(); mioCodice = null;
          if(typeof caricaOrme === "function" && vista === "orme") caricaOrme();
          else if(typeof contaOrme === "function") contaOrme();
        }
      });
  }

  function annulla(){
    if(!mioCodice){ schermo("scelta"); return; }
    db.from("talenti_movimenti").update({ stato: "rifiutato" })
      .eq("id", mioCodice.id).eq("stato","proposto").then(function(){
        if(timer){ clearInterval(timer); timer = null; }
        mioCodice = null; schermo("scelta"); parla("Scambio annullato.");
      });
  }

  /* ═══ ② CHI DÀ — legge il sigillo ════════════════════════════════════ */

  var stream = null, raf = null;

  function avviaCamera(){
    document.getElementById("tal-trovato").style.display = "none";
    document.getElementById("tal-inserito").value = "";
    if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;

    carica(LIB_LEGGI, function(){
      navigator.mediaDevices.getUserMedia({ video:{ facingMode:"environment" } })
      .then(function(s){
        stream = s;
        var v = document.getElementById("tal-video");
        v.srcObject = s; v.setAttribute("playsinline", true); v.play();
        var cv = document.createElement("canvas"), cx = cv.getContext("2d");

        (function guarda(){
          raf = requestAnimationFrame(guarda);
          if(v.readyState !== v.HAVE_ENOUGH_DATA) return;
          cv.width = v.videoWidth; cv.height = v.videoHeight;
          cx.drawImage(v, 0, 0, cv.width, cv.height);
          var d = cx.getImageData(0, 0, cv.width, cv.height);
          var r = window.jsQR(d.data, d.width, d.height,
                    { inversionAttempts: "dontInvert" });
          if(r && r.data){
            var m = r.data.match(/[?&]t=([A-Z0-9]{6})/i);
            var cod = m ? m[1] : (r.data.length === 6 ? r.data : null);
            if(cod){ fermaCamera(); cerca(cod); }
          }
        })();
      })
      .catch(function(){ /* niente fotocamera: resta il codice a mano */ });
    });
  }

  function fermaCamera(){
    if(raf){ cancelAnimationFrame(raf); raf = null; }
    if(stream){ stream.getTracks().forEach(function(t){ t.stop(); }); stream = null; }
    var v = document.getElementById("tal-video");
    if(v) v.srcObject = null;
  }

  function cerca(cod){
    cod = String(cod || "").trim().toUpperCase();
    if(cod.length !== 6){ parla("Il codice ha sei caratteri."); return; }

    db.from("talenti_movimenti")
      .select("id,quantita,motivo,da_persona,stato,codice_scade_il")
      .eq("codice", cod).single().then(function(r){

      if(r.error || !r.data){ parla("Codice non trovato."); return; }
      var m = r.data;
      if(m.stato !== "proposto"){ parla("Questo sigillo è già stato usato."); return; }
      if(m.da_persona === io.id){ parla("È il tuo sigillo: lo inquadra l'altra persona."); return; }
      if(m.codice_scade_il && new Date(m.codice_scade_il) < new Date()){
        parla("Il sigillo è scaduto."); return;
      }

      db.from("persone").select("nome").eq("id", m.da_persona).single().then(function(p){
        trovato = m;
        document.getElementById("tal-inserito").value = cod;
        document.getElementById("tal-trovato").style.display = "block";
        document.getElementById("tal-t-chi").textContent  = p.error ? "—" : p.data.nome;
        document.getElementById("tal-t-cosa").textContent = m.motivo || "—";
        document.getElementById("tal-t-q").textContent    = m.quantita;
      });
    });
  }

  function conferma(){
    if(!trovato) return;
    db.from("talenti_movimenti")
      .update({ a_persona: io.id, stato: "confermato" })
      .eq("id", trovato.id).eq("stato","proposto")
      .select("id,quantita,motivo").single().then(function(r){

      if(r.error){ parla("Non è passato: " + r.error.message); return; }

      db.from("orme").insert({
        persona_id: io.id, contenuto: r.data.motivo,
        tipo: "talenti", destinazione: "emporio",
        visibilita: "vicinato", elemento: "acqua"
      }).select("id").single().then(function(o){
        if(!o.error){
          db.from("talenti_movimenti").update({ orma_id: o.data.id })
            .eq("id", trovato.id).then(function(){});
        }
        document.getElementById("tal-fat-t").textContent = "Ricevuti";
        document.getElementById("tal-fat-s").innerHTML =
          "<b>" + r.data.quantita + "</b> talenti sono tuoi.<br>Resta un'orma.";
        schermo("fatto"); leggiSaldo(); trovato = null;
        if(typeof caricaOrme === "function" && vista === "orme") caricaOrme();
        else if(typeof contaOrme === "function") contaOrme();
      });
    });
  }

  /* ═══ ③ I MOVIMENTI ══════════════════════════════════════════════════ */

  function movimenti(){
    var l = document.getElementById("tal-mov-lista");
    l.innerHTML = '<div class="tal-att">…</div>';

    db.from("talenti_movimenti")
      .select("id,quantita,motivo,stato,da_persona,a_persona,confermato_il,proposto_il")
      .or("da_persona.eq." + io.id + ",a_persona.eq." + io.id)
      .eq("stato","confermato")
      .order("confermato_il", { ascending:false }).limit(40)
      .then(function(r){
        if(r.error || !r.data || !r.data.length){
          l.innerHTML = '<div class="tal-att">Nessuno scambio, per ora.</div>'; return;
        }
        var h = '<div class="tal-box">';
        r.data.forEach(function(m){
          var esce = (m.da_persona === io.id);
          var qd = new Date(m.confermato_il || m.proposto_il)
                    .toLocaleDateString("it-IT",{day:"numeric",month:"long"});
          h += '<div class="tal-riga"><span>' + (m.motivo || "—") +
               '<br><span style="opacity:.45">' + qd + '</span></span>' +
               '<b style="color:' + (esce ? "#E8A79E" : "#9CC177") + '">' +
               (esce ? "−" : "+") + m.quantita + '</b></div>';
        });
        l.innerHTML = h + '</div>';
      });
  }

  /* ═══ APRI E CHIUDI ══════════════════════════════════════════════════ */

  function apri(){
    if(typeof ospite !== "undefined" && ospite){
      if(typeof chiediAccesso === "function")
        chiediAccesso("Per scambiare talenti serve l'accesso");
      return;
    }
    veste();
    document.getElementById("v-talenti").classList.add("on");
    leggiSaldo(); schermo("scelta");
  }

  function chiudi(){
    var v = document.getElementById("v-talenti");
    if(v) v.classList.remove("on");
    if(timer){ clearInterval(timer); timer = null; }
    fermaCamera(); mioCodice = null; trovato = null;
  }

  /* chi arriva da un sigillo inquadrato col telefono */
  function daIndirizzo(){
    var m = location.search.match(/[?&]t=([A-Za-z0-9]{6})/);
    if(!m) return;
    /* ⛔ IL GETTONE SPARISCE APPENA LETTO — si consuma una volta, e non
       deve restare in un indirizzo che si manda in giro.
       ⚠️ Ma sparisce SOLO LUI. Prima si azzerava l'indirizzo intero, e
       così un sigillo si portava via anche `?p=`, la stanza in cui si è.
       `p` e `n` sono del guscio: qui non si toccano. */
    var coda = "";
    try{
      var q = new URLSearchParams(location.search);
      q.delete("t");
      coda = q.toString();
    }catch(e){ coda = ""; }
    history.replaceState({}, "", BASE + (coda ? "?" + coda : ""));
    setTimeout(function(){
      if(typeof ospite !== "undefined" && ospite) return;
      apri(); schermo("leggi"); cerca(m[1]);
    }, 1200);
  }

  document.addEventListener("keydown", function(e){
    if(e.key === "Escape") chiudi();
  });

  if(document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", daIndirizzo);
  else daIndirizzo();

  /* il Megafono chiama questa */
  window.talentiApri = apri;
  window.talentiChiudi = chiudi;

})();
