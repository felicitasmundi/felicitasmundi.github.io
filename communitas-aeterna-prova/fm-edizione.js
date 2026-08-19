/* ═══════════════════════════════════════════════════════════════
   fm-edizione.js
   Comunità Eterna FelicitasMundi · la stanza Edizione: ordina · stampa · pubblica e distribuisci
   Staccato da spazio-vivo-nuovo.html (MD5 e82f836b22edb46f485538c9244fef26)
   il 7 agosto 2026. Il codice è identico all'originale, carattere per
   carattere: si carica prima del guscio, che porta le cose comuni.
   ═══════════════════════════════════════════════════════════════ */
"use strict";

  function edizione(c){
    var venuto = daPubblicare; daPubblicare = null;

    c.innerHTML =
      '<div class="occhio">Comunità Eterna FelicitasMundi</div>'
    + '<h1>Edizione</h1>'

    /* ── la presentazione: sempre visibile ── */
    + '<div class="ed-perche">'
    +   '<p>In questa era di continui dati, di costante digitalizzazione, si sta perdendo '
    +     'il gusto di archiviare, di leggere, di mettere da parte le informazioni e i ricordi '
    +     'che poi potranno tornare utili. Che potranno raccontare una storia: una storia '
    +     'personale, di un gruppo, di un intero popolo. Essere partecipi alla raccolta '
    +     'culturale dell\u2019epoca che si sta vivendo.</p>'
    +   '<p>L\u2019Edizione FelicitasMundi punta a portare ordine l&igrave; dove per anni '
    +     'gli utenti di qualunque piattaforma hanno messo quotidianamente dei contenuti che '
    +     'avevano un valore nel momento in cui sono stati messi, ma che poi non hanno la '
    +     'possibilit&agrave; di essere contestualizzati a un filo logico, a un filo narrativo.</p>'
    +   '<p>Con le orme e con la struttura che sta impostando, FelicitasMundi pu&ograve; '
    +     'tornare a dare <b>ordine ai contenuti, ordine alle storie delle persone, ordine '
    +     'alle proprie ricerche</b>.</p>'
    + '</div>'
    + '<div class="ed-scopo"><p>FelicitasMundi &egrave; un\u2019edizione che salvaguarda, '
    +   '<b>come una grande biblioteca collettiva</b>, la cultura dell\u2019umanit&agrave;.</p></div>'

    + (venuto ? '<div class="ed-venuto"><span class="ev-et">Stai portando qui</span>'
        + '<b>' + esc(venuto.titolo) + '</b><small>' + esc(venuto.da) + '</small></div>' : '')

    /* ── l'indice analitico: tre voci che si aprono ── */
    + '<div class="ind">'

    +   '<div class="ind-v" data-v="ordina">'
    +     '<button class="ind-t"><span class="ind-n">Ordina</span>'
    +       '<span class="ind-s">[ in attesa ]</span><span class="ind-x">+</span></button>'
    +     '<div class="ind-d" id="d-ordina"></div>'
    +   '</div>'

    +   '<div class="ind-v" data-v="stampa">'
    +     '<button class="ind-t"><span class="ind-n">Stampa</span>'
    +       '<span class="ind-s">[ in attesa ]</span><span class="ind-x">+</span></button>'
    +     '<div class="ind-d" id="d-stampa"></div>'
    +   '</div>'

    +   '<div class="ind-v" data-v="distribuisci">'
    +     '<button class="ind-t"><span class="ind-n">Pubblica e distribuisci</span>'
    +       '<span class="ind-s">[ in attesa ]</span><span class="ind-x">+</span></button>'
    +     '<div class="ind-d" id="d-distribuisci"></div>'
    +   '</div>'

    + '</div>'

    + '<h2 style="margin-top:1.8rem">Quello che stai facendo</h2>'
    + '<div id="ed-opere"><p class="vuoto">Un momento…</p></div>';

    /* i tre pannelli si riempiono la prima volta che si aprono */
    document.querySelectorAll(".ind-v").forEach(function(v){
      v.querySelector(".ind-t").addEventListener("click", function(){
        var aperto = v.classList.toggle("su");
        v.querySelector(".ind-x").textContent = aperto ? "\u2212" : "+";
        if(aperto && !v.dataset.pieno){
          v.dataset.pieno = "1";
          if(v.dataset.v === "ordina")            pannelloOrdina();
          else if(v.dataset.v === "stampa")       pannelloStampa();
          else                                    pannelloDistribuisci();
        }
      });
    });

    mieOpere();
  }

  /* ══ ORDINA ══ */
  function pannelloOrdina(){
    var d = $("d-ordina");
    d.innerHTML =
      '<p class="ed-riga">[ in attesa: cosa significa ordinare ]</p>'
    + '<div class="ord-due">'
    +   '<div class="ord-c">'
    +     '<b>Le tue orme</b>'
    +     '<div id="ord-mie"><p class="vuoto">Un momento…</p></div>'
    +   '</div>'
    +   '<div class="ord-c">'
    +     '<b>Cerca altre orme</b>'
    +     '<small>Anche di altre persone. Se scegli qualcosa di qualcun altro, '
    +       'gli si chiede il permesso.</small>'
    +     '<input id="ord-cerca" placeholder="erbe spontanee, pane, un luogo…">'
    +     '<div id="ord-trovate"></div>'
    +   '</div>'
    + '</div>'

    + '<div class="ord-fai">'
    +   '<button class="mini" id="ord-crea">Raccogli le orme scelte in un\u2019opera</button>'
    +   '<span class="ord-conto" id="ord-conto">nessuna scelta</span>'
    +   '<div class="mod-esito" id="ord-esito"></div>'
    + '</div>'

    + '<div class="ord-agg">'
    +   '<b>Oppure aggiungi qualcosa di nuovo</b>'
    +   '<small>Quello che aggiungi qui diventa anche una tua orma.</small>'
    +   '<div class="mod">'
    +     '<div><label>La descrizione</label><textarea id="ag-testo"></textarea></div>'
    +     '<div class="due">'
    +       '<div><label>Il luogo</label><input id="ag-luogo"></div>'
    +       '<div><label>L\u2019anno</label><input id="ag-anno" inputmode="numeric"></div>'
    +     '</div>'
    +     '<button class="mini" id="ag-metti">Aggiungi</button>'
    +     '<div class="mod-esito" id="ag-esito"></div>'
    +   '</div>'
    + '</div>';

    if(ospite){ $("ord-mie").innerHTML = '<p class="vuoto">Le tue orme si vedono con l\'accesso.</p>'; }
    else mieOrmeScelta();

    $("ord-cerca").addEventListener("input", function(){
      var q = this.value.trim();
      if(q.length < 3){ $("ord-trovate").innerHTML = ""; return; }
      cercaOrme(q);
    });

    $("ag-metti").addEventListener("click", aggiungiPezzo);

    /* il conto delle scelte si aggiorna a ogni spunta */
    d.addEventListener("change", function(e){
      if(e.target.type !== "checkbox") return;
      contaScelte();
    });

    $("ord-crea").addEventListener("click", creaDaOrme);
  }

  function ormeScelte(){
    var out = [];
    document.querySelectorAll("#d-ordina input[type=checkbox]:checked").forEach(function(c){
      out.push({
        id: c.dataset.orma,
        di: c.dataset.di,
        testo: c.dataset.testo || ""
      });
    });
    return out;
  }

  function contaScelte(){
    var n = ormeScelte().length, e = $("ord-conto");
    if(!e) return;
    e.textContent = n === 0 ? "nessuna scelta"
                  : n === 1 ? "una orma scelta"
                  : n + " orme scelte";
  }

  /* ⭐ le orme scelte diventano un'opera, coi pezzi collegati alle orme vere */
  function creaDaOrme(){
    var e = $("ord-esito"); e.className = "mod-esito";
    if(ospite){ vaiAdEntrare("edizione"); return; }
    var scelte = ormeScelte();
    if(!scelte.length){ e.className="mod-esito err"; e.textContent="Scegli almeno un'orma."; return; }

    e.textContent = "Raccolgo…";
    db.from("opere").insert({
      persona_id: io.id,
      titolo: "Senza titolo",
      genere: "libro",
      nata_da: "le orme"
    }).select("id").single().then(function(r){
      if(r.error){ e.className="mod-esito err"; e.textContent=r.error.message; return; }
      var opera = r.data.id;

      var pezzi = scelte.map(function(x, i){
        return { opera_id: opera, ordine: i, tipo: "testo",
                 orma_id: x.id, autore_id: x.di, contenuto: x.testo };
      });

      db.from("opera_pezzi").insert(pezzi).then(function(rr){
        if(rr.error){ e.className="mod-esito err"; e.textContent=rr.error.message; return; }

        /* per le orme di altri, si chiede il permesso */
        var altrui = scelte.filter(function(x){ return x.di && x.di !== io.id; });
        if(altrui.length){
          var chieste = {};
          var permessi = [];
          altrui.forEach(function(x){
            if(chieste[x.di]) return;
            chieste[x.di] = 1;
            permessi.push({ opera_id: opera, a_chi: x.di, chiesto_da: io.id });
          });
          db.from("opera_permessi").insert(permessi).then(function(){
            e.textContent = "Raccolte. Il permesso &egrave; stato chiesto a chi ha lasciato "
                          + "le orme che non sono tue.";
            mieOpere();
          });
        } else {
          e.textContent = "Raccolte in un'opera.";
          mieOpere();
        }

        document.querySelectorAll("#d-ordina input[type=checkbox]").forEach(function(c){
          c.checked = false;
        });
        contaScelte();
      });
    });
  }

  function rigaOrma(o, altrui){
    var d = document.createElement("label");
    d.className = "orm-s";
    d.innerHTML = '<input type="checkbox"><span class="tx"><b></b><i></i></span>';
    d.querySelector("b").textContent = o.contenuto.slice(0,90) + (o.contenuto.length>90?"…":"");
    var q = DOVE.filter(function(x){ return x.tipo === o.tipo; })[0];
    d.querySelector("i").textContent = (q ? q.n : o.tipo)
      + (altrui ? " · di un\u2019altra persona — servir&agrave; il permesso" : "");
    var c = d.querySelector("input");
    c.dataset.orma  = o.id;
    c.dataset.di    = o.persona_id || (io && io.id) || "";
    c.dataset.testo = o.contenuto;
    return d;
  }

  function mieOrmeScelta(){
    db.from("orme").select("id,contenuto,tipo,persona_id").eq("persona_id", io.id)
      .order("momento", {ascending:false}).limit(30)
      .then(function(r){
        var o = (r && r.data) || [], box = $("ord-mie");
        if(!o.length){ box.innerHTML = '<p class="vuoto">Non hai ancora orme.</p>'; return; }
        box.innerHTML = "";
        o.forEach(function(x){ box.appendChild(rigaOrma(x, false)); });
      });
  }

  function cercaOrme(q){
    db.from("orme").select("id,contenuto,tipo,persona_id")
      .eq("visibilita","pubblico").ilike("contenuto", "%"+q+"%").limit(20)
      .then(function(r){
        var o = (r && r.data) || [], box = $("ord-trovate");
        if(!o.length){ box.innerHTML = '<p class="vuoto">Nulla con queste parole.</p>'; return; }
        box.innerHTML = "";
        o.forEach(function(x){ box.appendChild(rigaOrma(x, x.persona_id !== (io && io.id))); });
      });
  }

  function aggiungiPezzo(){
    var e = $("ag-esito"); e.className = "mod-esito";
    if(ospite){ vaiAdEntrare("edizione"); return; }
    var t = $("ag-testo").value.trim();
    if(!t){ e.className="mod-esito err"; e.textContent="Scrivi qualcosa."; return; }
    var anno = $("ag-anno").value.trim();
    e.textContent = "Aggiungo…";
    db.from("orme").insert({
      persona_id: io.id, contenuto: t, tipo: "racconto",
      destinazione: "Edizione", visibilita: "solo_me",
      accaduto_il: anno && anno.length === 4 ? anno + "-01-01" : null
    }).then(function(r){
      if(r.error){ e.className="mod-esito err"; e.textContent=r.error.message; return; }
      e.textContent = "Aggiunto, ed &egrave; anche una tua orma.";
      $("ag-testo").value=""; $("ag-luogo").value=""; $("ag-anno").value="";
      mieOrmeScelta();
    });
  }

  /* ══ STAMPA ══ */
  function pannelloStampa(){
    $("d-stampa").innerHTML =
      '<p class="ed-riga"><b>Stampare &egrave; ci&ograve; che tiene traccia:</b> ci permette di '
    + 'toccare con mano quelle parole, quelle foto, quelle grafiche, quei ricordi e quelle '
    + 'intuizioni. Non sono pi&ugrave; codici binari dentro un\u2019interfaccia visiva, '
    + 'ma <b>testi e linguaggi che rimangono</b>.</p>'

    + '<div class="ed-tre">'
    +   '<button class="ed-c" data-e="libro" style="--ec:var(--terra)"><b>Un libro</b></button>'
    +   '<button class="ed-c" data-e="magazine" style="--ec:var(--aria)"><b>Un magazine</b></button>'
    +   '<button class="ed-c" data-e="opuscolo" style="--ec:var(--fuoco)"><b>Un opuscolo</b></button>'
    +   '<button class="ed-c" data-e="foto" style="--ec:var(--acqua)"><b>Le tue fotografie</b></button>'
    +   '<button class="ed-c" data-e="agenda" style="--ec:var(--terra)"><b>Un\u2019agenda</b></button>'
    +   '<button class="ed-c" data-e="calendario" style="--ec:var(--aria)"><b>Un calendario</b></button>'
    +   '<button class="ed-c" data-e="esposizione" style="--ec:var(--etere)"><b>Materiali per esporre</b></button>'
    + '</div>'

    + '<div class="ed-nat">Fra tutto quello che si potrebbe stampare, '
    +   '<b>proponiamo solo ci&ograve; che &egrave; fatto di materiali naturali</b>. '
    +   '&Egrave; una scelta di coerenza.</div>'

    + '<p class="ed-riga" style="margin-top:0.9rem">I formati e le carte disponibili '
    +   'arrivano dallo stampatore. [ in attesa del collegamento ]</p>';

    document.querySelectorAll("#d-stampa .ed-c").forEach(function(b){
      b.addEventListener("click", function(){ nuovaOpera(b.dataset.e, null); });
    });
  }

  /* ══ PUBBLICA E DISTRIBUISCI ══ */
  function pannelloDistribuisci(){
    $("d-distribuisci").innerHTML =
      '<p class="ed-riga">Metti in vendita la tua opera nell\u2019Emporio, presentala, '
    + 'rendila trovabile. E per portarla fuori, stampi su misura anche i materiali di '
    + 'esposizione, quelli utili alle fiere e agli incontri.</p>'
    + '<p class="ed-riga">&Egrave; un <b>supporto a trecentosessanta gradi dell\u2019artista</b>, '
    + 'che trova anche <b>una comunit&agrave; viva</b>, aperta ad ascoltare, integrare e '
    + 'strutturare assieme \u2014 nei vicinati, negli incontri dove presentare quella ricerca '
    + 'e <b>renderla funzionale all\u2019evoluzione collettiva</b>.</p>'

    + '<h3 class="ed-h3">Come si entra nell\u2019Emporio</h3>'
    + '<p class="ed-riga">Si comincia da un incontro con un nostro consulente: '
    + 'serve a conoscersi e a capire quali opere si vogliono proporre. '
    + '<b>Con il suo assenso, le opere entrano.</b></p>'

    + '<h3 class="ed-h3">Due strade</h3>'
    + '<div class="ed-due">'
    +   '<div class="ed-str"><b>Te la impagini tu</b>'
    +     '<div class="pz">26 &euro; al mese</div>'
    +     '<small>Lo strumento &egrave; tuo: componi, impagini e stampi da solo. '
    +       'E puoi organizzarti in squadra con altri.</small></div>'
    +   '<div class="ed-str"><b>Te la impaginiamo noi</b>'
    +     '<div class="pz">[ in attesa ]</div>'
    +     '<small>Il consulente concorda il servizio secondo la quantit&agrave; di lavoro. '
    +       'Per le realt&agrave; editoriali e gli autori con pi&ugrave; opere, '
    +       'si parte dal servizio per le squadre.</small></div>'
    + '</div>';
  }

  function mieOpere(){
    var box = $("ed-opere"); if(!box) return;
    if(ospite){ box.innerHTML = '<p class="vuoto">Le tue opere si vedono con l\'accesso.</p>'; return; }
    db.from("opere").select("id,titolo,genere,stato,creata_il")
      .order("creata_il", {ascending:false}).limit(20)
      .then(function(r){
        var o = (r && r.data) || [];
        if(!o.length){ box.innerHTML = '<p class="vuoto">Non hai ancora cominciato nulla.</p>'; return; }
        box.innerHTML = "";
        o.forEach(function(x){
          var d = document.createElement("div");
          d.className = "stato-riga";
          d.innerHTML = "<b></b><i></i>";
          d.querySelector("b").textContent = x.titolo;
          d.querySelector("i").textContent = x.genere + " · " + x.stato;
          box.appendChild(d);
        });
      }).catch(function(){ box.innerHTML = '<p class="vuoto">—</p>'; });
  }

  /* si comincia un'opera, con dentro quello che si è portato */
  function nuovaOpera(genere, venuto){
    if(ospite){ vaiAdEntrare("edizione"); return; }
    var titolo = venuto ? venuto.titolo : "Senza titolo";
    db.from("opere").insert({
      persona_id: io.id, titolo: titolo, genere: genere,
      nata_da: venuto ? venuto.da : "edizione"
    }).select("id").single().then(function(r){
      if(r.error){ parla(r.error.message); return; }
      if(venuto && venuto.orma_id){
        db.from("opera_pezzi").insert({
          opera_id: r.data.id, tipo: "testo",
          orma_id: venuto.orma_id, autore_id: io.id,
          contenuto: venuto.contenuto || null
        }).then(function(){ mieOpere(); });
      } else { mieOpere(); }
      parla("Cominciata.");
    });
  }
