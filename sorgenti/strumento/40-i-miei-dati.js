/* I MIEI DATI · 19 ott 12:37, Gab: «i dati account va inserita […] mostrami la finestra e all ok rendi tutto operativo, nessuna voce deve portare al vuoto».
   Scrive solo nella mia riga di persone (colonne già usate da fm-account-mio.js e account-bozza.html). */
function vDati(){
  var c=$("#corpo");
  if(!io.id){c.innerHTML='<p class="et">I miei dati</p><div class="card"><span class="t">I tuoi dati si vedono dopo l\'accesso.</span><div class="fine"><a class="mini oro" href="'+ENTRA+'">Entra con il codice via mail</a></div></div>';return;}
  c.innerHTML='<p class="et">I miei dati</p><div id="d-corpo"><p class="nota">Un momento…</p></div>';
  db.from("persone").select("nome,cognome,biografia,telefono,lingua,avvisi_mail,vicinato_id,radice_id"+(io.luogoC?",luogo":"")).eq("id",io.id).maybeSingle().then(function(r){
    var d=(r&&r.data)||{},e=$("#d-corpo");if(!e||vista!=="dati")return;
    function campo(k,et,tipo){return '<label class="m" for="d-'+k+'" style="display:block;margin-top:8px">'+et+'</label>'+(tipo==="area"?'<textarea id="d-'+k+'">'+esc(d[k]||"")+'</textarea>':'<input type="'+(tipo||"text")+'" id="d-'+k+'" value="'+esc(d[k]||"")+'">');}
    e.innerHTML='<div class="card"><b>Chi sono</b>'+campo("nome","Nome")+campo("cognome","Cognome")+(io.luogoC?campo("luogo","Di dove sei"):"")+campo("biografia","Biografia","area")+campo("telefono","Telefono","tel")+campo("lingua","Che lingua parli")+
      '<div class="azioni" style="margin-top:10px"><button class="btn pieno" id="d-salva">Salva</button><span class="m" id="d-esito"></span></div></div>'+
      '<div class="card" style="margin-top:10px"><b>Il mio villaggio e il mio vicinato</b><span class="t" id="d-luoghi">Un momento…</span><div class="fine"><a class="mini" href="cervello.html?c=10182300#ingresso">Come si entra in un vicinato</a></div></div>'+
      '<div class="card" style="margin-top:10px"><b>Mail</b><label class="t" style="display:flex;gap:8px;align-items:center;cursor:pointer"><input type="checkbox" id="d-avvisi"'+(d.avvisi_mail===false?'':' checked')+'> Avvisi</label><label class="t" id="d-mg-r" hidden style="display:flex;gap:8px;align-items:center;cursor:pointer"><input type="checkbox" id="d-mg" checked> Giornale la mattina</label><label class="t" id="d-ms-r" hidden style="display:flex;gap:8px;align-items:center;cursor:pointer"><input type="checkbox" id="d-ms" checked> Resoconto serale</label><span class="m" id="d-avvisi-esito"></span></div>'+
      /* 31/10: le notifiche del telefono stanno qui, non più in fondo a Espandi */'<div data-fm-notifiche style="margin-top:10px"></div>'+
      '<div class="card" style="margin-top:10px"><b>Segnala un problema tecnico</b><span class="m">Un pagamento che non si vede, una pagina che non si apre, una cosa che non funziona.</span><textarea id="d-segnala" style="min-height:70px"></textarea><div class="azioni"><button class="btn" id="d-manda">Manda</button><span class="m" id="d-segnala-esito"></span></div></div>'+
      '<div class="card" style="margin-top:10px"><b>Account</b><span class="t">Entri con la tua mail e un codice.</span><div class="fine"><a class="mini" href="privacy.html" target="_blank">Privacy</a><a class="mini" href="privacy.html#condizioni" target="_blank">Condizioni</a><a class="mini" href="privacy.html#cookie" target="_blank">Cookie</a><button class="mini" id="d-esci">Esci</button></div></div>';
    if(window.fmNotifiche)fmNotifiche(db);
    $("#d-salva").onclick=function(){var b=this,riga={};["nome","cognome","biografia","telefono","lingua"].concat(io.luogoC?["luogo"]:[]).forEach(function(k){riga[k]=$("#d-"+k).value.trim()||null;});
      if(!riga.nome){$("#d-esito").textContent="Il nome serve.";return;}
      if(io.luogoC&&(!riga.cognome||!riga.luogo)){$("#d-esito").textContent="Servono nome, cognome e di dove sei.";return;}
      b.disabled=true;db.from("persone").update(riga).eq("id",io.id).then(function(x){b.disabled=false;
        if(x&&x.error){$("#d-esito").textContent=errore(x.error);return;}io.nome=riga.nome;nomi[io.id]=riga.nome;$("#d-esito").textContent="Salvato.";});};
    $("#d-avvisi").onchange=function(){var v=this.checked;db.from("persone").update({avvisi_mail:v}).eq("id",io.id).then(function(x){$("#d-avvisi-esito").textContent=x&&x.error?errore(x.error):"Salvato.";});};
    /* 15/11 · Gab: «puoi anche mettere in impostazioni la possibilità che uno possa disattivare i singoli componenti mail» (SQL 268: mail_giornale, mail_sera). Senza la 268 le due righe restano nascoste. */
    db.from("persone").select("mail_giornale,mail_sera").eq("id",io.id).maybeSingle().then(function(m){
      if(!m||m.error||!m.data)return;
      [["d-mg","mail_giornale"],["d-ms","mail_sera"]].forEach(function(x){
        var c=document.getElementById(x[0]);if(!c)return;
        c.checked=m.data[x[1]]!==false;document.getElementById(x[0]+"-r").hidden=false;
        c.onchange=function(){var o={};o[x[1]]=c.checked;db.from("persone").update(o).eq("id",io.id).then(function(y){$("#d-avvisi-esito").textContent=y&&y.error?errore(y.error):"Salvato.";});};
      });
    },function(){});
    $("#d-manda").onclick=function(){var t=$("#d-segnala").value.trim(),b=this;if(!t)return;b.disabled=true;
      db.from("segnalazioni").insert({persona_id:io.id,tipo:"tecnico",testo:t,riferimento:"i miei dati · "+new Date().toISOString().slice(0,10),stato:"aperta"}).then(function(x){b.disabled=false;
        if(x&&x.error){$("#d-segnala-esito").textContent=errore(x.error);return;}$("#d-segnala").value="";$("#d-segnala-esito").textContent="Mandata. Arriva a chi tiene Felicitas.";});};
    $("#d-esci").onclick=function(){db.auth.signOut().then(function(){location.href="strumento.html";});};
    var ids=[d.radice_id,d.vicinato_id].filter(Boolean);
    (ids.length?db.from("orme").select("id,titolo").in("id",ids):Promise.resolve({data:[]})).then(function(o){var t={};((o&&o.data)||[]).forEach(function(x){t[x.id]=x.titolo;});
      var l=$("#d-luoghi");if(!l)return;
      l.textContent=(d.radice_id&&t[d.radice_id]?"Villaggio: "+t[d.radice_id]:"Non hai ancora scelto un villaggio.")+"\n"+(d.vicinato_id&&t[d.vicinato_id]?"Vicinato: "+t[d.vicinato_id]:"Non sei ancora in un vicinato.");},function(){});
  },function(){var e=$("#d-corpo");if(e)e.innerHTML='<div class="vuoto">Non riesco a leggere i tuoi dati adesso.</div>';});
}
function vCartelle(){
  var c=$("#corpo");
  if(!io.id){c.innerHTML='<p class="et">Cartelle</p><h3>Documenti, foto, audio</h3><div class="card"><span class="t">Le cartelle si aprono a chi è entrato.</span><div class="fine"><a class="btn pieno" href="'+ENTRA+'">Entra</a></div></div>';return;}
  /* 19 ott 16:04, Gab: «se io avessi come possibilità nell app di poter caricare lì un immagine che poi mi ritrovo nell archivio, sarebbe gia uno stra lavoro» */
  c.innerHTML='<p class="et">Cartelle</p><h3>Documenti, foto, audio</h3>'+
    '<div class="card" id="ca-carica"><b>Carica qui</b><div class="azioni"><label class="btn pieno" for="ca-file">Scegli foto o file</label><input class="file" type="file" id="ca-file" accept="image/*,audio/*,.m4a,.mp3,.ogg,.wav,.pdf,.doc,.docx,.odt,.txt,.rtf,.xls,.xlsx,.ods,.ppt,.pptx,.odp" multiple><span class="m" id="ca-scelti"></span></div>'+
    '<label class="m" for="ca-el" style="margin-top:6px">In quale cartella</label><select id="ca-el">'+ELEMENTI.map(function(k){return '<option value="'+k[0]+'"'+(k[0]===cartella?' selected':'')+'>'+esc(k[1])+'</option>';}).join("")+'</select>'+
    '<label class="m" for="ca-vis" style="margin-top:6px">Chi lo vede</label><select id="ca-vis"><option value="solo_me">Solo io</option><option value="vicinato">Il vicinato</option><option value="pubblico">Tutti</option></select>'+
    '<label class="m" for="ca-testo" style="margin-top:6px">Due parole su cosa si vede (facoltativo)</label><input type="text" id="ca-testo">'+
    '<div class="azioni" style="margin-top:8px"><button class="btn pieno" id="ca-vai" disabled>Carica</button><span class="m" id="ca-esito"></span></div></div>'+
    '<div id="ca"><p class="nota">Un momento…</p></div>';
  (function(){var inp=$("#ca-file"),vai=$("#ca-vai"),es=$("#ca-esito");
    inp.onchange=function(){var n=inp.files.length;$("#ca-scelti").textContent=n?(n===1?inp.files[0].name:n+" file scelti"):"";vai.disabled=!n;es.textContent="";};
    vai.onclick=function(){
      var fl=[].slice.call(inp.files);if(!fl.length)return;
      var grandi=fl.filter(function(f){return f.size>25*1024*1024;});if(grandi.length){es.textContent="Troppo grande (più di 25 MB): "+grandi[0].name;return;}
      var t=$("#ca-testo").value.trim();
      vai.disabled=true;vai.textContent="Carico…";es.textContent="";
      db.from("orme").insert({persona_id:io.id,contenuto:t||fl.map(function(f){return f.name;}).join(", "),tipo:"karma_yoga",visibilita:$("#ca-vis").value,elemento:$("#ca-el").value,accaduto_il:oggiISO()}).select("id").single().then(function(r){
        if(r.error){vai.disabled=false;vai.textContent="Carica";es.textContent="Non salvato: "+errore(r.error);return;}
        var id=r.data.id,male=[];
        return fl.reduce(function(fila,f){return fila.then(function(){
          var nome=String(f.name||"file").replace(/[^\w.\-]+/g,"_").slice(-80);
          return db.storage.from("riservato").upload(id+"/"+nome,f,{contentType:f.type||undefined}).then(function(u){
            if(u&&u.error){male.push(f.name+": "+(u.error.message||"non passato"));return;}
            return db.from("orma_file").insert({orma_id:id,nome:nome,indirizzo:id+"/"+nome,dimensione:f.size,chi_lo_ha_messo:io.id,da_conversazione:false}).then(function(q){if(q&&q.error)male.push(f.name+": "+errore(q.error));});
          });}).catch(function(e){male.push(f.name+": "+((e&&e.message)||"non passato"));});},Promise.resolve()).then(function(){
          cartella=$("#ca-el").value;vCartelle();
          setTimeout(function(){var e=$("#ca-esito");if(e)e.textContent=male.length?"Non è passato: "+male.join(" · "):"Caricato. Lo trovi qui sotto.";},50);
        });
      });
    };})();
  var Q="id,titolo,contenuto,elemento,visibilita,momento,persona_id,orma_file!inner(nome,indirizzo,tipo,dimensione)";
  db.from("orme").select(Q).order("momento",{ascending:false}).limit(300).then(function(r){
    if(r&&!r.error)return r.data||[];
    return db.from("orme").select(Q.replace("!inner","")).order("momento",{ascending:false}).limit(300).then(function(x){return ((x&&!x.error&&x.data)||[]).filter(function(o){return (o.orma_file||[]).length;});});
  },function(){return [];}).then(function(orme){
    var file=[];orme.forEach(function(o){(o.orma_file||[]).forEach(function(f){file.push({f:f,o:o});});});
    return Promise.all([firmaURL(file.map(function(x){return x.f;})),leggiNomi(orme.map(function(o){return o.persona_id;}))]).then(function(w){
      var e=$("#ca");if(!e||vista!=="cartelle")return;var firme=w[0];
      function conta(k){return file.filter(function(x){return k==="tutte"||x.o.elemento===k;}).length;}
      var lista=file.filter(function(x){return cartella==="tutte"||x.o.elemento===cartella;});
      e.innerHTML='<div class="cartelle">'+[["tutte","Tutte"]].concat(ELEMENTI).map(function(k){var n=conta(k[0]);return '<button class="cartella" data-cartella="'+k[0]+'" aria-pressed="'+(k[0]===cartella)+'">'+esc(k[1])+'<small>'+(n===1?"1 file":n+" file")+'</small></button>';}).join("")+'</div>'+
        (lista.map(function(x){var u=firme[x.f.indirizzo],o=x.o,chi=nomi[o.persona_id]||"";
          return '<div class="card"><div class="riga"><div><span class="t">'+esc(x.f.nome||"file")+'</span><br><span class="m">'+esc(String(o.titolo||o.contenuto||"").split("\n")[0].slice(0,80))+(chi?" · "+esc(chi):"")+" · "+esc(new Date(o.momento).toLocaleDateString("it-IT",{day:"numeric",month:"short"}))+'</span></div><span class="pill v-'+esc(o.visibilita||"solo_me")+'">'+esc(VIS[o.visibilita]||"")+'</span></div>'+
            (u?'<div class="fine"><a class="mini oro" href="'+esc(u)+'" target="_blank" rel="noopener noreferrer">Apri</a></div>':'<span class="m">Questo file da qui non si apre.</span>')+'</div>';}).join("")||'<div class="vuoto">Nessun file in questa cartella. Si aggiungono dal Megafono: foto o audio, e la cartella scelta.</div>');
      e.querySelectorAll("[data-cartella]").forEach(function(b){b.onclick=function(){cartella=b.getAttribute("data-cartella");vCartelle();};});
      legaVai(e);
    });
  });
}


/* 1 nov 12:29, Gab: «bisogna trovare il metodo perchè poi il nucleo possa confermare il ruolo che magari viene proposto dall operatore» (SQL 144) */
function ruoliDaConfermare(box){
  if(!box||!io.nucleo)return;
  db.rpc("fm_ruoli_da_confermare").then(function(r){
    if(!document.body.contains(box))return;
    var l=(r&&!r.error&&r.data)||[];
    box.innerHTML=l.length?'<p class="et" style="margin-top:14px">Ruoli da confermare</p><div class="card modulo">'+l.map(function(x){
      return '<div class="persona"><div><b>'+esc(x.nome||"—")+'</b><small>'+esc((FUNZIONI[x.funzione]||x.funzione)+' · '+nomeRuolo(x.funzione,x.ruolo))+(x.team?' · '+esc(x.team):'')+(x.proposto_da?' · da '+esc(x.proposto_da):'')+'</small></div>'+
        '<span class="rg-az"><button class="mini oro" data-rc="'+esc(x.id)+'" data-si="1">Conferma</button><button class="mini" data-rc="'+esc(x.id)+'" data-si="0">No</button></span></div>';}).join("")+'</div>':'';
    box.querySelectorAll("[data-rc]").forEach(function(b){b.onclick=function(){b.disabled=true;
      db.rpc("fm_ruolo_decidi",{p_id:b.getAttribute("data-rc"),p_si:b.getAttribute("data-si")==="1"}).then(function(){ruoliDaConfermare(box);if($("#o-ruoli"))vRuoli();},function(){b.disabled=false;});};});
  },function(){});
}
/* 1 nov 12:19, Gab: «crea team ora riguarda nucleo e va messo in espandi»; 12:10: il link del team da mandare per far entrare le persone (SQL 144) */
function vCreaTeam(){
  var c=$("#corpo");
  if(!io.nucleo){vista="azione";vAzione();return;}
  c.innerHTML='<h2 class="az-tit">Crea team</h2><div class="card modulo"><label>Nome del team<input type="text" id="ct-nome" maxlength="80" autocomplete="off"></label>'+
    '<div class="azioni"><button class="btn pieno" id="ct-crea">Crea</button></div><div class="toast" id="ct-ok" hidden></div></div>'+
    '<p class="et" style="margin-top:14px">I team e il loro link d\'invito</p><div class="card modulo" id="ct-lista"><p class="nota">Un momento…</p></div>'+
    '<p style="margin-top:14px"><button class="mini" data-vai="azione">‹ Azione</button></p>';
  legaVai(c);
  function link(k){return new URL("accesso.html?staff="+encodeURIComponent(k)+"&torna=strumento.html",location.href).href;}
  function lista(){
    Promise.all([db.from("squadre").select("id,nome").order("nome"),db.from("inviti_link").select("squadra_id,codice,entrati").is("spento_il",null)]).then(function(v){
      var e=$("#ct-lista");if(!e)return;
      if(v[0].error){e.innerHTML='<p class="nota">'+esc(errore(v[0].error))+'</p>';return;}
      var ln={};((v[1]&&!v[1].error&&v[1].data)||[]).forEach(function(x){ln[x.squadra_id]=x;});
      e.innerHTML=(v[0].data||[]).map(function(t){var x=ln[t.id];
        return '<div class="persona"><div><b>'+esc(t.nome)+'</b><small>'+(x?'link acceso · '+(x.entrati===1?'1 entrato':x.entrati+' entrati'):'nessun link')+'</small></div><span class="rg-az">'+
          (x?'<a class="mini oro" href="https://wa.me/?text='+encodeURIComponent(link(x.codice))+'" target="_blank" rel="noopener noreferrer">WhatsApp</a><button class="mini" data-ct-copia="'+esc(link(x.codice))+'">Copia</button><button class="mini" data-ct-spegni="'+esc(t.id)+'">Spegni</button>'
            :'<button class="mini oro" data-ct-link="'+esc(t.id)+'">Link d\'invito</button>')+'</span></div>';}).join("")||'<p class="nota">Ancora nessun team.</p>';
      e.querySelectorAll("[data-ct-copia]").forEach(function(b){b.onclick=function(){var u=b.getAttribute("data-ct-copia");(navigator.clipboard?navigator.clipboard.writeText(u):Promise.reject()).then(function(){b.textContent="Copiato";},function(){prompt("Copia il link",u);});};});
      e.querySelectorAll("[data-ct-link]").forEach(function(b){b.onclick=function(){b.disabled=true;db.rpc("fm_link_team",{p_squadra:b.getAttribute("data-ct-link")}).then(function(r){if(r&&r.error){b.disabled=false;mostra("#ct-ok",/fm_link_team|function/i.test(r.error.message||"")?"Si apre con l'SQL 144.":errore(r.error),true);return;}lista();},function(){b.disabled=false;});};});
      e.querySelectorAll("[data-ct-spegni]").forEach(function(b){b.onclick=function(){b.disabled=true;db.rpc("fm_link_spegni",{p_squadra:b.getAttribute("data-ct-spegni")}).then(function(){lista();},function(){b.disabled=false;});};});
    },function(){});
  }
  lista();
  $("#ct-crea").onclick=function(){var n=val("ct-nome");if(!n)return mostra("#ct-ok","Scrivi il nome del team.",true);var b=this;b.disabled=true;
    db.rpc("fm_team_crea",{p_nome:n}).then(function(r){b.disabled=false;
      if(r&&r.error)return mostra("#ct-ok",/fm_team_crea|function/i.test(r.error.message||"")?"Si apre con l'SQL 144.":errore(r.error),true);
      $("#ct-nome").value="";mostra("#ct-ok","Team creato: "+n+".");lista();},function(){b.disabled=false;});};
}
/* la pagina di Azione «Aggiungi una persona»: il nucleo e chi ha un ruolo (SQL 144) */
/* ═══ Admin panel («plancia» nel codice) · «Chi vede cosa» · 1 novembre 2026 · thread «Capire il Company brain con i team» ═══
   Gab 1/11 14:00: «il pannello delle aturizzazioni admin, in modo che io possa definire in autonomia chi vede cosa direttamente usando l app»
   · 14:26 «pannello admin con ruoli e accessi gestiti da me.. è ciò che mesi fa chiamavamo plancia» · 14:29 «si fai il pannello chi vede cosa ecc».
   Serve lo SQL 150 (fm_capitoli_plancia, fm_capitolo_imposta, fm_capitolo_nuovo, fm_approvazioni_in_attesa, tavola costi, fm_costi_mese).
   Solo nucleo. Si apre da Espandi › Terra › Aggiungi una persona › «Admin panel · chi vede cosa». Tre parti: Chi vede cosa (i capitoli del
   Cervello: livello, team in più, responsabile, sezione; capitolo nuovo), Approvazioni in attesa, Costi. Persone e ruoli resta dov'è. */
var PL_CSS='.pl-sez{margin-top:16px}.pl-cap{display:flex;flex-direction:column;gap:6px}'+
'.pl-c{display:flex;justify-content:space-between;align-items:center;gap:10px;text-align:left;border:1px solid var(--linea);border-radius:12px;padding:12px 14px;background:var(--foglio);cursor:pointer;font:inherit;color:inherit;width:100%}'+
'.pl-c small{display:block;font-size:13px;color:var(--tenue);margin-top:2px}.pl-c .n{flex:none;font-size:13px;color:var(--tenue)}'+
'.pl-ed{border:1px solid rgba(212,175,106,.5);border-radius:12px;padding:12px;display:flex;flex-direction:column;gap:10px;background:var(--foglio)}'+
'.pl-ed label{font-size:13px;color:var(--tenue);display:flex;flex-direction:column;gap:4px}.pl-ed select,.pl-ed input{width:100%;font:16px/1.4 var(--sans);color:var(--inchiostro);background:var(--carta);border:1px solid var(--linea);border-radius:10px;padding:9px 12px;min-height:44px}'+
'.pl-riga{display:flex;justify-content:space-between;gap:8px;align-items:center;font-size:15px;padding:8px 0;border-bottom:1px solid var(--linea)}.pl-riga:last-child{border-bottom:0}.pl-riga small{display:block;font-size:13px;color:var(--tenue)}'+
'.pl-tot{font-size:17px;font-weight:600;margin:8px 0 0;text-align:right}.pl-err{font-size:14px;color:#E07A5F;margin:4px 0 0}.pl-err:empty{display:none}';
var PL_LIVELLI={non_ospiti:"Tutti tranne gli ospiti",ruolo:"Chi ha un ruolo",nucleo:"Solo il nucleo"};
var PL_SEZ={tecnico:"Cervello tecnico",creativo:"Cervello creativo"};
var PL_TIPI={cervello:"Metti nel Cervello",ruolo:"Ruolo proposto",karma:"Karma yoga",passo:"Passo di un obiettivo"};
var PL_DOVE={team:"nel team",persone:"in Aggiungi una persona",praticantato:"nel Praticantato",obiettivo:"nell'obiettivo"};
var plancia={cap:[],team:[],aperto:null};
function plChi(k){
  if(k.squadra_id)return "Team "+(k.squadra||"");
  if(k.vicinato_id)return "Vicinato";
  return (PL_LIVELLI[k.livello]||k.livello||"")+(k.anche_team?" · anche il team "+k.anche_team:"");
}
function plQuando(t){if(!t)return "";var d=new Date(t);return d.toLocaleDateString("it-IT",{day:"numeric",month:"short"})+" "+d.toLocaleTimeString("it-IT",{hour:"2-digit",minute:"2-digit"});}
