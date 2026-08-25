/* ═══════════════════════════════════════════════════════════════
   fm-account.js
   Comunità Eterna FelicitasMundi · privacy · fatturazione · autorizzazioni · segnala · colore
   Staccato da spazio-vivo-nuovo.html (MD5 e82f836b22edb46f485538c9244fef26)
   il 7 agosto 2026. Il codice è identico all'originale, carattere per
   carattere: si carica prima del guscio, che porta le cose comuni.
   ═══════════════════════════════════════════════════════════════ */
"use strict";

  /* ── ① Privacy e consensi ── */
  function apriPrivacy(){
    var c = $("priv-corpo");
    c.innerHTML = '<p class="vuoto">Un momento…</p>';
    $("v-priv").classList.add("on");

    db.from("persone")
      .select("consenso_bio,consenso_contatto,condizioni_accettate,condizioni_versione")
      .eq("id", io.id).maybeSingle()
      .then(function(r){
        var p = (r && r.data) || {};
        var quando = dataIt(p.condizioni_accettate);
        /* ⭐ LE CONDIZIONI SI LEGGONO DA QUI.
           Questa riga è il solo posto dentro lo Spazio Vivo in cui le
           Condizioni d'uso si mostrano — e mostrava soltanto la data in
           cui erano state accettate, senza un modo per leggerle.
           Ora il nome della riga è la porta. Si apre in una scheda a
           parte, come fa già accesso.html: chi sta guardando i propri
           consensi non perde il posto in cui era.
           ⛔ Nessuna parola nuova: «Condizioni d'uso» era già lì. */
        c.innerHTML =
          '<div class="stato-riga"><b><a href="condizioni.html" target="_blank" '
        +   'rel="noopener">Condizioni d\u2019uso</a></b><i>'
        +   (quando ? "accettate il " + quando : "[ non risulta ]") + '</i></div>'
        + '<div class="stato-riga"><b>Versione accettata</b><i>'
        +   (p.condizioni_versione || "[ non risulta ]") + '</i></div>'

        + '<div class="mod" style="margin-top:1rem">'
        +   '<label class="spunta"><input type="checkbox" id="cs-bio"'
        +     (p.consenso_bio ? " checked" : "") + '>'
        +     '<span class="tx">La mia biografia pu&ograve; viaggiare con quello che porto'
        +     '<small>Compare accanto ai tuoi contributi: prodotti, ricerche, bacheca. '
        +     'Se la togli, resta vuota — mai un dato finto.</small></span></label>'

        +   '<label class="spunta"><input type="checkbox" id="cs-cont"'
        +     (p.consenso_contatto ? " checked" : "") + '>'
        +     '<span class="tx">Le persone della comunit&agrave; possono scrivermi'
        +     '<small>Il tuo recapito non compare mai su nessuna pagina: si apre un contatto, '
        +     'e sei tu a rispondere.</small></span></label>'
        + '</div>'

        + '<div class="mod-esito" id="priv-esito"></div>'

        + '<div class="avviso"><b>Ci&ograve; che scrivi come &laquo;solo me&raquo; lo leggi soltanto tu.</b> '
        +   'Nessun grado vi accede, nemmeno chi amministra.</div>'

        + '<div class="mod" style="margin-top:0.9rem">'
        +   '<button class="mini" id="priv-scarica">Scarica i miei dati</button>'
        +   '<button class="mini" id="priv-doc">Leggi l\u2019informativa</button>'
        + '</div>'

        + '<div class="avviso" style="border-left-color:var(--oro)">'
        +   '<b>Cancellare l\u2019account.</b> [ in attesa: la lista precisa di cosa sparisce, '
        +   'cosa resta e per quanto. Le condizioni d\u2019uso dicono che la licenza sulle opere '
        +   'pubblicate sopravvive alla cancellazione. ]<br>'
        +   'Per ora si chiede scrivendo dalla voce <b>Segnala</b>.</div>';

        function salva(campo, valore){
          var e = $("priv-esito"); e.className = "mod-esito";
          var riga = {}; riga[campo] = valore;
          db.from("persone").update(riga).eq("id", io.id).then(function(rr){
            if(rr.error){ e.className="mod-esito err"; e.textContent = rr.error.message; return; }
            e.textContent = "Salvato.";
            setTimeout(function(){ if(e.textContent==="Salvato.") e.textContent=""; }, 2200);
          });
        }
        $("cs-bio").addEventListener("change", function(){ salva("consenso_bio", this.checked); });
        $("cs-cont").addEventListener("change", function(){ salva("consenso_contatto", this.checked); });
        $("priv-doc").addEventListener("click", function(){ location.href = "privacy.html"; });
        $("priv-scarica").addEventListener("click", scaricaDati);
      })
      .catch(function(e){
        c.innerHTML = '<p class="vuoto" style="color:#f0b0a6">' + (e.message||e) + '</p>';
      });
  }

  /* i propri dati, in un file leggibile */
  function scaricaDati(){
    var e = $("priv-esito"); e.className = "mod-esito"; e.textContent = "Sto raccogliendo…";
    Promise.all([
      db.from("persone").select("*").eq("id", io.id).maybeSingle(),
      db.from("orme").select("*").eq("persona_id", io.id),
      db.from("fatturazione").select("*").eq("persona_id", io.id).maybeSingle()
    ]).then(function(r){
      var tutto = {
        raccolto_il: new Date().toISOString(),
        persona: (r[0] && r[0].data) || null,
        orme: (r[1] && r[1].data) || [],
        fatturazione: (r[2] && r[2].data) || null
      };
      var b = new Blob([JSON.stringify(tutto, null, 2)], {type:"application/json"});
      var a = document.createElement("a");
      a.href = URL.createObjectURL(b);
      a.download = "felicitasmundi-i-miei-dati.json";
      a.click();
      URL.revokeObjectURL(a.href);
      e.textContent = "Scaricato.";
    }).catch(function(x){
      e.className = "mod-esito err"; e.textContent = (x.message||x);
    });
  }

  /* ── ② Fatturazione ── */
  function apriFatturazione(){
    var c = $("fatt-corpo");
    c.innerHTML = '<p class="vuoto">Un momento…</p>';
    $("v-fatt").classList.add("on");

    db.from("fatturazione").select("*").eq("persona_id", io.id).maybeSingle()
      .then(function(r){
        var f = (r && r.data) || {};
        function v(k){ return f[k] ? String(f[k]).replace(/"/g,"&quot;") : ""; }
        c.innerHTML =
          '<div class="mod">'
        + '<div><label>Chi sei, per la ricevuta</label>'
        +   '<select id="fa-tipo">'
        +     '<option value="privato">Una persona</option>'
        +     '<option value="professionista">Un professionista con partita IVA</option>'
        +     '<option value="societa">Una societ&agrave;</option>'
        +   '</select></div>'
        + '<div><label>Nome e cognome, o ragione sociale</label>'
        +   '<input id="fa-den" value="'+v("denominazione")+'"></div>'
        + '<div><label>Indirizzo</label><input id="fa-ind" value="'+v("indirizzo")+'"></div>'
        + '<div class="due">'
        +   '<div><label>CAP</label><input id="fa-cap" value="'+v("cap")+'"></div>'
        +   '<div><label>Citt&agrave;</label><input id="fa-cit" value="'+v("citta")+'"></div>'
        + '</div>'
        + '<div class="due">'
        +   '<div><label>Provincia</label><input id="fa-pro" value="'+v("provincia")+'"></div>'
        +   '<div><label>Paese</label><input id="fa-pae" value="'+(v("paese")||"IT")+'"></div>'
        + '</div>'
        + '<div class="due">'
        +   '<div><label>Codice fiscale</label><input id="fa-cf" value="'+v("codice_fiscale")+'"></div>'
        +   '<div><label>Partita IVA</label><input id="fa-piva" value="'+v("partita_iva")+'"></div>'
        + '</div>'
        + '<div class="due">'
        +   '<div><label>Codice destinatario</label><input id="fa-cd" value="'+v("codice_dest")+'"></div>'
        +   '<div><label>PEC</label><input id="fa-pec" value="'+v("pec")+'"></div>'
        + '</div>'
        + '<button class="mini" id="fa-salva">Conserva questi dati</button>'
        + '<div class="mod-esito" id="fa-esito"></div>'
        + '</div>'
        + '<div class="avviso">[ in attesa: quali campi sono obbligatori per ciascun tipo. '
        +   'Fino ad allora nessun campo &egrave; richiesto. ]</div>';

        if(f.tipo) $("fa-tipo").value = f.tipo;

        $("fa-salva").addEventListener("click", function(){
          var e = $("fa-esito"); e.className = "mod-esito"; e.textContent = "Conservo…";
          db.from("fatturazione").upsert({
            persona_id: io.id,
            tipo: $("fa-tipo").value,
            denominazione: $("fa-den").value.trim() || null,
            indirizzo: $("fa-ind").value.trim() || null,
            cap: $("fa-cap").value.trim() || null,
            citta: $("fa-cit").value.trim() || null,
            provincia: $("fa-pro").value.trim() || null,
            paese: $("fa-pae").value.trim() || null,
            codice_fiscale: $("fa-cf").value.trim() || null,
            partita_iva: $("fa-piva").value.trim() || null,
            codice_dest: $("fa-cd").value.trim() || null,
            pec: $("fa-pec").value.trim() || null,
            aggiornato_il: new Date().toISOString()
          }).then(function(rr){
            if(rr.error){ e.className="mod-esito err"; e.textContent = rr.error.message; return; }
            e.textContent = "Conservati.";
          });
        });
      })
      .catch(function(e){
        c.innerHTML = '<p class="vuoto" style="color:#f0b0a6">' + (e.message||e) + '</p>';
      });
  }

  /* ── ③ Autorizzazioni ── */
  function apriAutorizzazioni(){
    var c = $("aut-corpo");
    c.innerHTML = '<p class="vuoto">Un momento…</p>';
    $("v-aut").classList.add("on");

    db.from("persone").select("pref_posizione,pref_calendario").eq("id", io.id).maybeSingle()
      .then(function(r){
        var p = (r && r.data) || {};
        c.innerHTML =
          '<div class="mod">'
        + '<label class="spunta"><input type="checkbox" id="au-pos"'
        +   (p.pref_posizione ? " checked" : "") + '>'
        +   '<span class="tx">FelicitasMundi pu&ograve; usare la mia posizione'
        +   '<small>Per trovare il vicinato attorno a te e i bisogni vicini.</small></span></label>'
        + '<label class="spunta"><input type="checkbox" id="au-cal"'
        +   (p.pref_calendario ? " checked" : "") + '>'
        +   '<span class="tx">FelicitasMundi pu&ograve; usare il mio calendario'
        +   '<small>Per gli appuntamenti e gli incontri.</small></span></label>'
        + '<div class="mod-esito" id="au-esito"></div>'
        + '</div>'
        + '<h3 style="margin-top:1.2rem;font-size:var(--t-cor)">E il tuo dispositivo?</h3>'
        + '<div id="au-sistema"></div>'
        + '<div class="avviso">Sono due cose diverse e servono entrambe: '
        +   'la prima &egrave; il permesso che dai a noi, la seconda quello che dai al dispositivo. '
        +   '<b>Il secondo si cambia solo dalle impostazioni del telefono o del navigatore.</b></div>';

        function salva(campo, valore){
          var e = $("au-esito"); e.className = "mod-esito";
          var riga = {}; riga[campo] = valore;
          db.from("persone").update(riga).eq("id", io.id).then(function(rr){
            if(rr.error){ e.className="mod-esito err"; e.textContent = rr.error.message; return; }
            e.textContent = "Salvato.";
            setTimeout(function(){ if(e.textContent==="Salvato.") e.textContent=""; }, 2200);
          });
        }
        $("au-pos").addEventListener("change", function(){ salva("pref_posizione", this.checked); });
        $("au-cal").addEventListener("change", function(){ salva("pref_calendario", this.checked); });

        var box = $("au-sistema");
        function riga(nome, stato){
          var cl = (stato === "concesso") ? "" : " no";
          box.innerHTML += '<div class="stato-riga"><b>'+nome+'</b><i class="'+cl+'">'+stato+'</i></div>';
        }
        if(navigator.permissions && navigator.permissions.query){
          navigator.permissions.query({name:"geolocation"}).then(function(st){
            riga("Posizione", st.state === "granted" ? "concesso"
                            : st.state === "denied" ? "negato" : "lo chiede al momento");
          }).catch(function(){ riga("Posizione", "[ non leggibile ]"); });
        } else {
          riga("Posizione", "[ non leggibile ]");
        }
        riga("Calendario", "[ non ancora collegato ]");
      })
      .catch(function(e){
        c.innerHTML = '<p class="vuoto" style="color:#f0b0a6">' + (e.message||e) + '</p>';
      });
  }

  /* ── ④ Segnala ── */
  function apriSegnala(){
    var c = $("segn-corpo");
    $("v-segn").classList.add("on");
    c.innerHTML =
      '<div class="mod">'
    + '<div><label>Di cosa si tratta</label>'
    +   '<select id="sg-tipo">'
    +     '<option value="piattaforma">Qualcosa non funziona nella piattaforma</option>'
    +     '<option value="prodotto">Un ordine o un prodotto</option>'
    +   '</select></div>'
    + '<div><label>Racconta cosa &egrave; successo</label>'
    +   '<textarea id="sg-testo" placeholder="dove eri, cosa hai fatto, cosa &egrave; successo"></textarea></div>'
    + '<div><label>Un riferimento, se ce l\u2019hai</label>'
    +   '<input id="sg-rif" placeholder="il numero dell\u2019ordine, o la pagina"></div>'
    + '<button class="mini" id="sg-manda">Manda la segnalazione</button>'
    + '<div class="mod-esito" id="sg-esito"></div>'
    + '</div>'
    + '<div id="sg-mie" style="margin-top:1.2rem"></div>';

    $("sg-manda").addEventListener("click", function(){
      var t = $("sg-testo").value.trim();
      var e = $("sg-esito"); e.className = "mod-esito";
      if(!t){ e.className="mod-esito err"; e.textContent="Scrivi cosa è successo."; return; }
      e.textContent = "Mando…";
      db.from("segnalazioni").insert({
        persona_id: io.id,
        tipo: $("sg-tipo").value,
        testo: t,
        riferimento: $("sg-rif").value.trim() || null
      }).then(function(rr){
        if(rr.error){ e.className="mod-esito err"; e.textContent = rr.error.message; return; }
        e.textContent = "Arrivata. Ti rispondono appena possibile.";
        $("sg-testo").value = ""; $("sg-rif").value = "";
        mieSegnalazioni();
      });
    });
    mieSegnalazioni();
  }

  function mieSegnalazioni(){
    var box = $("sg-mie"); if(!box) return;
    db.from("segnalazioni").select("tipo,testo,stato,momento")
      .order("momento", {ascending:false}).limit(10)
      .then(function(r){
        var righe = (r && r.data) || [];
        if(!righe.length){ box.innerHTML = ""; return; }
        var h = '<h3 style="font-size:var(--t-cor);margin-bottom:0.4rem">Le tue segnalazioni</h3>';
        righe.forEach(function(x){
          var d = new Date(x.momento).toLocaleDateString("it-IT",
                    {day:"numeric", month:"short", year:"numeric"});
          h += '<div class="stato-riga"><b>' + esc(x.testo.slice(0,70))
             + (x.testo.length>70 ? "…" : "") + '</b><i>' + d + " · " + x.stato + '</i></div>';
        });
        box.innerHTML = h;
      }).catch(function(){ box.innerHTML = ""; });
  }

  /* ── ⑤ Colore del sito ── */
  function apriColore(){
    var c = $("col-corpo");
    $("v-col").classList.add("on");
    c.innerHTML =
      '<div class="stato-riga"><b>Notturno</b><i>in uso</i></div>'
    + '<div class="stato-riga"><b>Diurno</b><i class="no">[ arriva pi&ugrave; avanti ]</i></div>'
    + '<div class="avviso">La versione chiara non esiste ancora: tutta la piattaforma &egrave; '
    +   'costruita sul fondo cosmico. Quando ci sar&agrave;, la scelta si ricorder&agrave; '
    +   'da una visita all\u2019altra.</div>';
  }
