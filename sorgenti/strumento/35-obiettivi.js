/* OBIETTIVI e bisogni del villaggio */
function leggiObiettivi(){
  if(cache.obiettivi||!db)return Promise.resolve(cache.obiettivi||[]);
  return Promise.all([
    db.from("orme").select("id,titolo,contenuto,stadio,entro_il,quanti_servono,persona_id,visibilita,orma_persone(persona_id,preso_il,lasciato_il)").eq("tipo","obiettivo").order("momento",{ascending:false}).limit(120)
      .then(function(r){if(r&&!r.error)return r.data||[];
        /* se il legame con orma_persone non si legge, gli obiettivi si vedono lo stesso */
        return db.from("orme").select("id,titolo,contenuto,stadio,entro_il,quanti_servono,persona_id,visibilita").eq("tipo","obiettivo").order("momento",{ascending:false}).limit(120)
          .then(function(q){return q&&!q.error?(q.data||[]):[];});},function(){return [];}),
    db.from("bisogni").select("id,titolo,dettaglio,entro,quanti,presi").is("preso_da",null).order("entro").limit(20)
      .then(function(r){return r&&!r.error?(r.data||[]):[];},function(){return [];})
  ]).then(function(v){cache.obiettivi=v[0];cache.bisogni=v[1];
    var ids=[];v[0].forEach(function(o){(o.orma_persone||[]).forEach(function(p){ids.push(p.persona_id);});});
    return leggiNomi(ids).then(function(){return cache.obiettivi;});});
}
function dentroO(o){return (o.orma_persone||[]).filter(function(p){return p.preso_il&&!p.lasciato_il&&p.persona_id;});}
function cardObiettivo(o){
  var s=o.stadio||"in_coda",chi=dentroO(o),mio=chi.some(function(p){return p.persona_id===io.id;});
  var nomiChi=chi.map(function(p){return nomi[p.persona_id];}).filter(Boolean);
  return '<div class="card"><div class="riga"><div><span class="t">'+esc(o.titolo||o.contenuto)+'</span><br><span class="m">'+
    (nomiChi.length?esc(nomiChi.join(", ")):(chi.length?(chi.length===1?"1 persona":chi.length+" persone"):"nessuno l'ha preso"))+
    (o.quanti_servono?" · "+chi.length+" su "+o.quanti_servono:"")+(o.entro_il?" · entro il "+esc(new Date(o.entro_il+"T12:00").toLocaleDateString("it-IT",{day:"numeric",month:"long"})):"")+'</span></div></div>'+
    (o.quanti_servono?'<div class="barra-ob"><i style="width:'+Math.min(100,Math.round(100*chi.length/o.quanti_servono))+'%"></i></div>':'')+
    /* SQL 90: l'avanzamento si calcola dai compiti fatti, nessuno lo scrive a mano */
    (cache.avanz&&cache.avanz[o.id]?'<span class="m">'+cache.avanz[o.id].fatti+' di '+cache.avanz[o.id].compiti+' compiti fatti</span><div class="barra-ob"><i style="width:'+Math.round(100*cache.avanz[o.id].fatti/Math.max(1,cache.avanz[o.id].compiti))+'%"></i></div>':'')+
    '<div class="fine">'+(io.id&&(mio||o.persona_id===io.id||io.coordina)?'<button class="pill s-'+s+'" data-stadio="'+esc(o.id)+'" style="border:0;cursor:pointer" aria-label="Cambia stato">'+STADI[s]+'</button>':'<span class="pill s-'+s+'">'+STADI[s]+'</span>')+
    (io.id?(mio?'<button class="mini" data-lascia="'+esc(o.id)+'">Lo lascio</button>':(s!=="sviluppato"?'<button class="mini oro" data-prendo="'+esc(o.id)+'">Lo prendo</button>':'')):'<a class="mini" href="'+ENTRA+'">Entra per prenderlo</a>')+'</div></div>';
}
/* 19 ott 19:12, Gab: «per poter accedere agli obiettivi col karma yoga, si dovrebbe comunque partecipare al praticantato.. è aperto a tutti, ma tutti dovrebbero essere invitati al praticantato» → invito, non vincolo (scelta di Gab, 19:13) */
var invitoPrat=false;
function cardInvitoPrat(){
  return '<div class="card" id="invito-prat"'+(invitoPrat?' style="border-color:var(--oro,#D4AF6A)"':'')+'><b>Praticantato</b>'+
    (invitoPrat?'<span class="t">Preso. Il karma yoga è aperto a tutti, e tutti sono invitati al praticantato.</span>':'')+
    '<span class="t">Dal progetto sogno alla cooperazione per una civiltà evoluta.</span>'+
    '<span class="m">L\'accompagnamento segue il ritmo dei cicli lunari (luna nuova — luna piena). Gli incontri di gruppo avvengono in diretta con Gabriele.</span>'+
    '<div class="fine"><a class="mini oro" href="cervello.html#praticantato">Che cos\'è il praticantato</a></div></div>';
}
function primaVolta(){var k="fm_invito_prat",v=null;try{v=localStorage.getItem(k);localStorage.setItem(k,"1");}catch(e){}return !v;}
function legaObiettivi(c){
  function dopo(r){if(r&&r.error){alert(errore(r.error));}cache.obiettivi=null;disegna();}
  function dopoPreso(r){if(!(r&&r.error)&&primaVolta())invitoPrat=true;dopo(r);
    if(invitoPrat)setTimeout(function(){var i=$("#invito-prat");if(i)i.scrollIntoView({behavior:"smooth",block:"center"});},400);}
  c.querySelectorAll("[data-prendo]").forEach(function(b){b.onclick=function(){b.disabled=true;db.rpc("fm_prendi_orma",{p_orma:b.getAttribute("data-prendo")}).then(dopoPreso,dopo);};});
  c.querySelectorAll("[data-lascia]").forEach(function(b){b.onclick=function(){b.disabled=true;db.rpc("fm_lascia_orma",{p_orma:b.getAttribute("data-lascia")}).then(dopo,dopo);};});
  c.querySelectorAll("[data-stadio]").forEach(function(b){b.onclick=function(){var id=b.getAttribute("data-stadio"),o=(cache.obiettivi||[]).filter(function(x){return x.id===id;})[0];if(!o)return;b.disabled=true;
    db.rpc("fm_cambia_stadio",{p_orma:id,p_stadio:DOPO[o.stadio||"in_coda"]}).then(dopo,dopo);};});
  c.querySelectorAll("[data-bisogno]").forEach(function(b){b.onclick=function(){b.disabled=true;db.rpc("fm_prendi_bisogno",{p_bisogno:b.getAttribute("data-bisogno")}).then(dopoPreso,dopo);};});
}
function vObiettivi(){
  var c=$("#corpo");
  /* 19 ott 23:29, Gab: «Obiettivi è pieno di roba, ma non si capisce come funziona obiettivi. Non c'è nulla che identifichi lo stato delle cose.»
     Come funziona: la frase già approvata della bacheca (bacheca-bozza.html). Lo stato: quanti da fare, in corso, fatti; ogni obiettivo con quanti l'hanno preso su quanti servono. */
  c.innerHTML='<p class="et">Obiettivi</p><h3>Quello di cui il villaggio ha bisogno</h3>'+
    '<div class="card"><span class="t">Quello di cui il villaggio ha bisogno, per chi può fare. Si tocca «lo prendo» e la cosa entra tra le tue cose da fare.</span><span class="m">Chi l\'ha preso tocca lo stato per spostarlo avanti: da fare, in corso, fatto.</span></div>'+
    '<div class="stato-ob" id="ob-stato"></div>'+(io.id&&(io.nucleo||io.coordina||(io.ruoli||[]).length)?'<div class="card" id="cr-ob"><button class="btn pieno" id="cr-apri" style="align-self:flex-start">Crea un obiettivo</button><div id="cr-form" hidden>'+
      '<label class="m" for="cr-tit">Cosa c\'è da fare</label><input type="text" id="cr-tit" maxlength="200">'+
      '<label class="m" for="cr-desc" style="margin-top:6px">Più dettagli (facoltativo)</label><textarea id="cr-desc" style="min-height:70px"></textarea>'+
      '<label class="m" for="cr-team" style="margin-top:6px">Per quale team (facoltativo)</label><select id="cr-team"><option value="">Per tutto il villaggio</option></select>'+
      '<label class="m" for="cr-quanti" style="margin-top:6px">Quante persone servono (facoltativo)</label><input type="number" id="cr-quanti" min="1" max="999" inputmode="numeric">'+
      '<label class="m" for="cr-entro" style="margin-top:6px">Entro il (facoltativo)</label><input type="date" id="cr-entro">'+
      '<label class="m" for="cr-link" style="margin-top:6px">Un link (facoltativo)</label><input type="url" id="cr-link">'+
      '<div class="azioni" style="margin-top:8px"><button class="btn pieno" id="cr-ok">Crea</button><button class="btn" id="cr-annulla">Annulla</button><span class="m" id="cr-esito" role="status"></span></div></div></div>':'')+(io.id?'<div class="card"><span class="m">Quello che hai preso e il lavoro della tua area sono in Oggi.</span><div class="fine"><button class="mini" data-vai="oggi">Oggi ›</button></div></div>':'')+cardInvitoPrat()+'<div id="ob" style="margin-top:10px"><p class="nota">Un momento…</p></div>';
  invitoPrat=false;
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

