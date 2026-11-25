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
