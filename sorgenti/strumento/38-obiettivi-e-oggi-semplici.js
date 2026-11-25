/* ═══ OBIETTIVI E OGGI SEMPLICI · thread «Semplificare la pagina Obiettivi» ═══
   Gab 14/11: «un muro di roba che mette ansia» · «troppo difficile anche per me che sono il fondatore» · 15/11 «intanto costruisci» · «ok oggi».
   Ognuno vede le sue cose della settimana (3 in vista) con «Fatto»; chi guida vede una riga per persona, fatte su quante (SQL 278).
   Tutto il resto (bacheca dell'area, stanze, numeri, elenco di tutti, Lo prendo) sta in «Tutti gli obiettivi ›». */
function settGuido(){return !!(io.nucleo||io.coordina||(io.ruoli||[]).length);}
function settMie(){
  return Promise.all([db.rpc("fm_mie_cose").then(function(r){return r&&!r.error?(r.data||[]):[];},function(){return [];}),
    leggiObiettivi().catch(function(){return [];})]).then(function(v){
    var l=v[0].map(function(x){return {fonte:x.fonte,id:x.id,titolo:x.titolo,entro_il:x.entro_il,ferma:x.ferma};});
    (cache.obiettivi||[]).filter(function(o){return o.stadio!=="sviluppato"&&dentroO(o).some(function(p){return p.persona_id===io.id;});})
      .forEach(function(o){l.push({fonte:"orma",id:o.id,titolo:o.titolo||o.contenuto,entro_il:o.entro_il,ferma:false});});
    l.sort(function(a,b){var x=a.entro_il||"9999",y=b.entro_il||"9999";return x<y?-1:x>y?1:0;});
    return l;});
}
function settPersone(){
  return db.rpc("fm_obiettivi_settimana").then(function(r){if(r&&!r.error)return {l:r.data||[],conta:true};throw 0;}).catch(function(){
    /* senza l'SQL 278: le persone con quante cose hanno in corso */
    return db.rpc("fm_la_mia_area").then(function(r){var m={};((r&&!r.error&&r.data)||[]).forEach(function(x){if(!x.preso_da)return;
        var k=m[x.preso_da]||(m[x.preso_da]={persona_id:x.preso_da,nome:x.chi,fatte:0,totale:0,ferme:0});k.totale++;if(x.ferma)k.ferme++;});
      return {l:Object.keys(m).map(function(k){return m[k];}),conta:false};},function(){return {l:[],conta:false};});});
}
function settVoce(x){
  var tasto=x.fonte==="assistenza"?'<button class="mini" data-vai="azione">Rispondi</button>':'<button class="btn pieno" style="flex:none" data-sett-fatto="'+esc(x.fonte+"|"+x.id)+'">Fatto</button>';
  return '<div class="card sett-v"><div class="sett-tt"><span class="t">'+esc(x.titolo||"")+'</span>'+(x.entro_il?'<span class="m"'+(x.ferma?' style="color:#E07A55"':'')+'>entro il '+esc(dataBreve(x.entro_il))+'</span>':'')+'</div>'+tasto+'</div>';
}
function settLista(box,l,tre){
  if(!box)return;
  if(!l.length){box.innerHTML='<div class="card"><span class="m">Nessun obiettivo preso, per ora. In Obiettivi c\'è quello di cui il villaggio ha bisogno.</span></div>';return;}
  box.innerHTML=(tre?l.slice(0,3):l).map(settVoce).join("")+(tre&&l.length>3?'<button class="mini" data-sett-tutte style="margin-top:4px">I miei obiettivi · '+l.length+' ›</button>':'');
  legaVai(box);
  var t=box.querySelector("[data-sett-tutte]");if(t)t.onclick=function(){settLista(box,l,false);};
  box.querySelectorAll("[data-sett-fatto]").forEach(function(b){b.onclick=function(){var p=b.getAttribute("data-sett-fatto").split("|");b.disabled=true;
    var q=p[0]==="registro"?db.rpc("fm_registro_fatto",{p_riga:p[1]}):p[0]==="logistica"?db.rpc("fm_compito_fatto",{p_compito:p[1]}):db.rpc("fm_cambia_stadio",{p_orma:p[1],p_stadio:"sviluppato"});
    q.then(function(r){if(r&&r.error){b.disabled=false;alert(errore(r.error));return;}
      var cd=b.closest(".sett-v");if(cd)cd.classList.add("fatto");b.outerHTML='<span class="pill s-sviluppato">fatto ✓</span>';cache.obiettivi=null;},
      function(e){b.disabled=false;alert(errore(e));});};});
}
function settRiga(x,conta){
  return '<div class="card"><div class="sett-r"><span class="t">'+esc(x.nome||"")+'</span><b>'+(conta?(+x.fatte)+' su '+(+x.totale):(+x.totale)+' in corso')+'</b></div>'+
    (conta?'<div class="barra-ob"><i style="width:'+Math.round(100*(+x.fatte)/Math.max(1,+x.totale))+'%"></i></div>':'')+
    (x.ferme?'<span class="m" style="color:#E07A55">in ritardo · '+(+x.ferme)+'</span>':'')+'</div>';
}
function settApriTutti(crea){window.fmObTutti=true;vObiettiviTutti();window.scrollTo(0,0);if(crea)setTimeout(function(){var b=$("#cr-apri");if(b)b.click();},50);}
/* 25/11/2026, Gab: «vorrei inoltre che ci fosse una dashboard dove dentro uno abbia gli obiettivi (quindi togliere oggi) e al posto di quello mettere emporio» · «esatto quindi carica questo».
   Obiettivi per chi è entrato: appuntamenti di oggi, Questa settimana, i tuoi team; chi guida vede anche le persone. */
function vObiettivi(){
  if(!io.id||window.fmObTutti){vObiettiviTutti();return;}
  var c=$("#corpo"),guido=settGuido(),d=new Date(),oggi=d.toLocaleDateString("sv-SE",{timeZone:"Europe/Rome"});
  c.innerHTML='<p class="et">Obiettivi</p><h3>'+esc(d.toLocaleDateString("it-IT",{weekday:"long",day:"numeric",month:"long",timeZone:"Europe/Rome"}))+'</h3><div id="sett-app"></div>'+
    '<p class="et" style="margin:14px 0 6px">Questa settimana</p><div id="sett-mie"><p class="nota">Un momento…</p></div>'+
    '<div class="fine" style="margin-top:6px"><button class="mini oro" id="sett-fissa">Fissa un incontro</button><button class="mini" id="sett-7">Prossimi 7 giorni ›</button></div><div id="o-agenda" hidden></div>'+
    '<div id="sett-tm"></div>'+
    (guido?'<p class="et" style="margin:14px 0 6px">Persone</p><div id="sett-pers"><p class="nota">Un momento…</p></div>'+
      (io.nucleo?'<div class="fine"><button class="mini" id="sett-rt">Ruoli e team ›</button></div><div class="fine" id="sett-rt-l" hidden><button class="mini oro" data-vai="persone">Persone</button><button class="mini oro" data-vai="staff">Aggiungi una persona</button><button class="mini" data-vai="createam">Crea un team</button><button class="mini" data-vai="plancia">Chi vede cosa</button></div>':''):'')+
    '<div class="fine" style="margin-top:12px">'+(guido?'<button class="mini oro" id="sett-crea">Crea un obiettivo</button>':'')+'<button class="mini" id="sett-tutti">Tutti gli obiettivi ›</button>'+
    /* 25/11/2026: quello che stava in Espandi (chat, gesti dei ruoli, vicinati, iscritti) ora è qui */
    '<button class="mini" data-vai="strumenti">[Chat e strumenti] ›</button></div>';
  legaVai(c);
  var a7=$("#sett-7"),visto=false;a7.onclick=function(){var g=$("#o-agenda");g.hidden=!g.hidden;if(!visto){visto=true;agendaOggi();}};
  $("#sett-fissa").onclick=function(){agFissa(null,vObiettivi);};
  $("#sett-tutti").onclick=function(){settApriTutti(false);};
  if(guido)$("#sett-crea").onclick=function(){settApriTutti(true);};
  var rt=$("#sett-rt");if(rt)rt.onclick=function(){var l=$("#sett-rt-l");l.hidden=!l.hidden;};
  agLeggi().then(function(l){var e=$("#sett-app");if(!e||vista!=="obiettivi"||!l)return;var q=l.filter(function(x){return x.giorno===oggi;});
    e.innerHTML=q.length?'<p class="et" style="margin:4px 0 6px">Appuntamenti di oggi</p>'+q.map(agRiga).join(""):'';agLegaAnnulla(e,vObiettivi);});
  settMie().then(function(l){var e=$("#sett-mie");if(!e||vista!=="obiettivi")return;settLista(e,l,true);});
  if(guido)settPersone().then(function(v){var e=$("#sett-pers");if(!e||vista!=="obiettivi")return;
    e.innerHTML=v.l.length?v.l.map(function(x){return settRiga(x,v.conta);}).join(""):'<div class="card"><span class="m">Niente qui.</span></div>';});
  if(db)leggiTeam().then(function(l){var e=$("#sett-tm");if(!e||vista!=="obiettivi"||!l||!l.length)return;
    e.innerHTML='<p class="et" style="margin:14px 0 6px">I tuoi team</p><div class="tm-lista">'+l.map(function(t){
      return '<button type="button" class="tm-ch" data-team="'+esc(t.team_id)+'"><span class="tm-seg" aria-hidden="true">'+esc(iniziale(t.nome))+'</span><span class="tm-mezzo"><b>'+esc(t.nome)+'</b></span>'+
        '<span class="tm-dx">'+(t.non_letti?'<em aria-label="'+t.non_letti+' da leggere">'+t.non_letti+'</em>':'')+'</span></button>';}).join("")+'</div>';
    e.querySelectorAll("[data-team]").forEach(function(b){b.onclick=function(){team.id=b.getAttribute("data-team");vai("team");};});});
}
function oggiSemplice(){vista="obiettivi";vObiettivi();}
function vObiettiviTutti(){
  var c=$("#corpo");
  /* 19 ott 23:29, Gab: «Obiettivi è pieno di roba, ma non si capisce come funziona obiettivi. Non c'è nulla che identifichi lo stato delle cose.»
     Come funziona: la frase già approvata della bacheca (bacheca-bozza.html). Lo stato: quanti da fare, in corso, fatti; ogni obiettivo con quanti l'hanno preso su quanti servono. */
  c.innerHTML=(io.id?'<button class="mini" id="ob-indietro">‹ Questa settimana</button><div id="o-tre" style="margin-top:10px"></div>':'')+'<p class="et">Obiettivi</p><h3>Quello di cui il villaggio ha bisogno</h3>'+
    '<div class="card"><span class="t">Quello di cui il villaggio ha bisogno, per chi può fare. Si tocca «lo prendo» e la cosa entra tra le tue cose da fare.</span><span class="m">Chi l\'ha preso tocca lo stato per spostarlo avanti: da fare, in corso, fatto.</span></div>'+
    '<div class="stato-ob" id="ob-stato"></div>'+(io.id&&(io.nucleo||io.coordina||(io.ruoli||[]).length)?'<div class="card" id="cr-ob"><button class="btn pieno" id="cr-apri" style="align-self:flex-start">Crea un obiettivo</button><div id="cr-form" hidden>'+
      '<label class="m" for="cr-tit">Cosa c\'è da fare</label><input type="text" id="cr-tit" maxlength="200">'+
      '<label class="m" for="cr-desc" style="margin-top:6px">Più dettagli (facoltativo)</label><textarea id="cr-desc" style="min-height:70px"></textarea>'+
      '<label class="m" for="cr-team" style="margin-top:6px">Per quale team (facoltativo)</label><select id="cr-team"><option value="">Per tutto il villaggio</option></select>'+
      '<label class="m" for="cr-quanti" style="margin-top:6px">Quante persone servono (facoltativo)</label><input type="number" id="cr-quanti" min="1" max="999" inputmode="numeric">'+
      '<label class="m" for="cr-entro" style="margin-top:6px">Entro il (facoltativo)</label><input type="date" id="cr-entro">'+
      '<label class="m" for="cr-link" style="margin-top:6px">Un link (facoltativo)</label><input type="url" id="cr-link">'+
      '<div class="azioni" style="margin-top:8px"><button class="btn pieno" id="cr-ok">Crea</button><button class="btn" id="cr-annulla">Annulla</button><span class="m" id="cr-esito" role="status"></span></div></div></div>':'')+cardInvitoPrat()+'<div id="ob" style="margin-top:10px"><p class="nota">Un momento…</p></div>';
  invitoPrat=false;
  var obi=$("#ob-indietro");if(obi)obi.onclick=function(){window.fmObTutti=false;vObiettivi();window.scrollTo(0,0);};if(io.id)treOggi();
  /* 5 nov 15:47, Gab conferma: il banco dei compiti si fonde nella bacheca di Oggi */
  legaVai(c);
  /* 5 nov, Gab: «allora crea sql nuova, è importante dare autonomia a chi ha un ruolo e lavora in questo» (SQL 173 fm_crea_obiettivo) */
  if($("#cr-ob"))(function(){
    var f=$("#cr-form"),ap=$("#cr-apri"),es=$("#cr-esito");
    ap.onclick=function(){f.hidden=false;ap.hidden=true;$("#cr-tit").focus();
      leggiTeam().then(function(l){var s=$("#cr-team");if(!s||!l||s.options.length>1)return;l.forEach(function(t){var o=document.createElement("option");o.value=t.team_id;o.textContent=t.nome;s.appendChild(o);});});};
    $("#cr-tit").oninput=function(){es.textContent="";};
    $("#cr-annulla").onclick=function(){f.hidden=true;ap.hidden=false;es.textContent="";};
    $("#cr-ok").onclick=function(){var b=this,t=$("#cr-tit").value.trim();
      if(!t){es.textContent="Scrivi cosa c'è da fare.";return;}
      var q=parseInt($("#cr-quanti").value,10);
      b.disabled=true;es.textContent="Un momento…";
      db.rpc("fm_crea_obiettivo",{p_titolo:t,p_descrizione:$("#cr-desc").value.trim()||null,p_team:$("#cr-team").value||null,p_quanti:q>0?q:null,p_entro:$("#cr-entro").value||null,p_link:$("#cr-link").value.trim()||null}).then(function(r){
        b.disabled=false;
        if(r&&!r.error&&r.data==="ok"){cache.obiettivi=null;vObiettivi();var n=$("#cr-esito");if(n){n.textContent="";}var ap2=$("#cr-apri");if(ap2)ap2.insertAdjacentHTML("afterend",'<span class="m">Obiettivo creato. È tra quelli Da fare.</span>');return;}
        es.textContent=(r&&r.data)||errore(r&&r.error);},function(x){b.disabled=false;es.textContent=errore(x);});};
  })();
  leggiObiettivi().then(function(lista){
    if(!io.id||!lista.length)return lista;
    return db.rpc("fm_obiettivi_avanzamento",{p_obiettivi:lista.map(function(o){return o.id;})}).then(function(r){cache.avanz={};((r&&!r.error&&r.data)||[]).forEach(function(x){cache.avanz[x.obiettivo_id]=x;});return lista;},function(){return lista;});
  }).then(function(lista){
    var e=$("#ob");if(!e||vista!=="obiettivi")return;
    var ord={in_avanzamento:0,in_coda:1,sviluppato:2};
    lista=lista.slice().sort(function(a,b){return ord[a.stadio||"in_coda"]-ord[b.stadio||"in_coda"];});
    var bis=cache.bisogni||[],conta={in_avanzamento:0,in_coda:0,sviluppato:0};lista.forEach(function(o){conta[o.stadio||"in_coda"]++;});
    var st=$("#ob-stato");if(st)st.innerHTML=["in_coda","in_avanzamento","sviluppato"].map(function(k){return '<span class="s-'+k+'">'+STADI[k]+' · '+conta[k]+'</span>';}).join("");
    var gruppi=[["in_avanzamento","In corso"],["in_coda","Da fare"],["sviluppato","Fatti"]];
    e.innerHTML=(gruppi.map(function(g){var q=lista.filter(function(o){return (o.stadio||"in_coda")===g[0];});
      return q.length?'<p class="et" style="margin-top:8px">'+g[1]+' · '+q.length+'</p>'+q.map(cardObiettivo).join(""):'';}).join("")||'<div class="vuoto">Nessun obiettivo qui, per ora.</div>')+
      (bis.length?'<p class="et" style="margin-top:8px">I bisogni del villaggio</p>'+bis.map(function(x){return '<div class="card"><span class="t">'+esc(x.titolo)+'</span>'+(x.dettaglio?'<span class="m">'+esc(x.dettaglio)+'</span>':'')+
        '<div class="fine">'+(x.entro?'<span class="m">entro il '+esc(new Date(x.entro).toLocaleDateString("it-IT",{day:"numeric",month:"long"}))+'</span>':'')+(io.id?'<button class="mini oro" data-bisogno="'+esc(x.id)+'">Lo prendo</button>':'<a class="mini" href="'+ENTRA+'">Entra per prenderlo</a>')+'</div></div>';}).join(""):"")+
      '';
    legaVai(e);legaObiettivi(e);
  });
}

