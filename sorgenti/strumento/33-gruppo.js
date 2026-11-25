/* GRUPPO · aggiungere una persona (SQL 83): la aggiunge il nucleo o il capofila, con la mail con cui è entrata; «capofila» può aggiungere altri */
function gruppoAggiungi(sq){
  var box=$("#gr-aggiungi");if(!box)return;
  box.innerHTML='<label class="m" for="gr-mail">Mail della persona (deve essere già entrata)</label><input type="email" id="gr-mail">'+
    '<label class="m" style="margin-top:8px;display:flex;flex-direction:row;gap:8px;align-items:center;text-align:left"><input type="checkbox" id="gr-capo" style="width:18px;height:18px;flex:none;display:inline-block;margin:0">Capofila: può aggiungere altre persone</label>'+
    '<div class="azioni" style="margin-top:8px"><button class="btn pieno" id="gr-agg">Aggiungi</button><span class="m" id="gr-agg-esito"></span></div>';
  $("#gr-agg").onclick=function(){var b=this,m=$("#gr-mail").value.trim();if(!m)return;b.disabled=true;
    db.rpc("fm_squadra_aggiungi",{p_squadra:sq,p_mail:m,p_responsabile:$("#gr-capo").checked}).then(function(r){b.disabled=false;
      if(r&&r.error){$("#gr-agg-esito").textContent=/fm_squadra_aggiungi|function/i.test(r.error.message||"")?"Si apre con l'SQL 83.":errore(r.error);return;}
      if(r.data!=="ok"){$("#gr-agg-esito").textContent=r.data;return;}
      vCerchio();},function(){b.disabled=false;});};
}
function chipRuolo(x){var p=x.split(":");return '<span class="chip f-'+esc(p[0])+'">'+esc(nomeRuolo(p[0],p[1]))+'</span>';}
function vCerchio(){
  var c=$("#corpo"),x=cerchiCache&&cerchiCache[cerchio];
  if(!x){vai("cervello");return;}
  var testa='<div class="giro" style="margin-bottom:4px"><button class="btn" id="ce-indietro">← Torna al Cervello</button></div><p class="et">'+({villaggio:"Il villaggio",vicinato:"Il vicinato",gruppo:"Il gruppo",azienda:"L'azienda",io:"Solo per te"})[x.tipo]+'</p><h3>'+esc(x.nome)+'</h3>'+(x.territorio?'<p class="nota">'+esc(x.territorio)+'</p>':'');
  if(x.tipo==="villaggio"){
    /* Gab, 19/10 20:18, verbatim (refuso corretto): «villaggio è un team operativo organizzato in vicinati, con l intento di portare avanti i progetti logistici e tecnologici legati a felicitas» */
    var vv=Object.keys(cerchiCache).map(function(k){return cerchiCache[k];}).filter(function(y){return y.tipo==="vicinato";});
    var inLog=io.coordina||(io.ruoli||[]).some(function(r){return r.funzione==="logistica";});
    c.innerHTML=testa+'<div class="card" style="margin-top:8px"><span class="t">Un team operativo organizzato in vicinati, con l\'intento di portare avanti i progetti logistici e tecnologici legati a Felicitas.</span></div>'+videoHTML("villaggi")+
      '<div id="ce-banco" style="margin-top:12px"></div><div id="ce-voci"></div>'+
      (inLog?'<div id="lg"></div>':'')+
      (vv.length?'<p class="et" style="margin-top:12px">I vicinati</p><div class="cerchi">'+vv.map(function(y){return '<button class="cerchio-b" data-cerchio="'+esc(y.id)+'"><span><b>'+esc(y.nome)+'</b><small>'+(y.territorio?esc(y.territorio)+' · ':'')+(+y.persone===1?'1 persona':(+y.persone)+' persone')+'</small></span><span>›</span></button>';}).join("")+'</div>':'')+
      (io.coordina?'<div id="o-ruoli"></div>':'');
    $("#ce-indietro").onclick=function(){vai("cervello");};
    legaCerchi(c);
    if(io.coordina)vRuoli();
    if(inLog)vLogistica();
    vBanco($("#ce-banco"),VILLAGGIO);vVociRegistro($("#ce-voci"),VILLAGGIO);
    fondoIndietro(c);
    return;
  }
  if(x.tipo==="io"){vPercorso();return;}
  var vic=x.tipo==="vicinato";
  if(vic&&!x.dentro&&!x.guido&&!io.coordina){
    /* dal cervello, «Entrare in un vicinato» (approvato 18/10 11:48) */
    c.innerHTML=testa+'<div class="card" style="margin-top:8px"><b>Come si entra</b><span class="t">Il vicinato si apre con quattro passi:</span><ol class="passi"><li>conosciuto di persona, a un incontro;</li><li>un garante: qualcuno già nel vicinato dice «lo conosco»;</li><li>il sì di chi coordina il vicinato, mai automatico;</li><li>la dichiarazione d\'ingresso firmata.</li></ol></div>';
    $("#ce-indietro").onclick=function(){vai("cervello");};fondoIndietro(c);return;
  }
  var conLibro=x.tipo!=="azienda"&&(x.dentro||x.guido);
  var conSpazio=x.dentro||x.guido||io.nucleo;
  c.innerHTML=(conLibro?'<div class="giro" style="margin-bottom:4px"><button class="btn" id="ce-indietro">← Torna al Cervello</button></div>'+(conSpazio?'<div id="ce-spazio"></div>':'')+'<div id="lb"></div>':testa+(conSpazio?'<div id="ce-spazio"></div>':''))+
    '<p class="et" style="margin-top:12px">Chi c\'è</p><div class="card" id="ce-persone"><p class="nota">Un momento…</p></div>'+
    (vic&&(x.guido||io.coordina)?'<p class="et" style="margin-top:12px">Dai un ruolo · per chi guida</p><div class="card modulo" id="ce-ruoli"></div>':'')+
    (x.tipo==="azienda"&&(x.guido||io.nucleo)?'<p class="et" style="margin-top:12px">Aggiungi una persona · per il referente</p><div class="card modulo" id="az-aggiungi"></div>':'')+
    (x.tipo==="gruppo"&&(x.guido||io.nucleo)?'<p class="et" style="margin-top:12px">Aggiungi una persona · per il capofila</p><div class="card modulo" id="gr-aggiungi"></div>':'')+
    '<div id="ce-banco" style="margin-top:12px"></div><div id="ce-voci"></div>'+
    (x.tipo!=="azienda"?'<p class="et" style="margin-top:12px">Il giornale del '+(vic?'vicinato':'gruppo')+'</p><div class="foglio-g" id="ce-giornale"><p class="nota">Un momento…</p></div>':'');
  if(x.tipo==="azienda"&&(x.guido||io.nucleo))aziendaAggiungi(cerchio);
  if(x.tipo==="gruppo"&&(x.guido||io.nucleo))gruppoAggiungi(cerchio);
  if(conLibro)libro($("#lb"),{campo:vic?"vicinato_id":"squadra_id",id:cerchio,occ:(vic?"Il cervello del vicinato":"Il cervello del gruppo")+(x.territorio?" · "+x.territorio:""),titolo:x.nome});
  fondoIndietro(c);
  $("#ce-indietro").onclick=function(){vai("cervello");};
  vBanco($("#ce-banco"),cerchio);vVociRegistro($("#ce-voci"),cerchio);
  if(conSpazio)vSpazio($("#ce-spazio"),cerchio,x);
  var questo=cerchio;
  db.rpc("fm_cerchio_persone",{p_vicinato:questo}).then(function(r){
    var e=$("#ce-persone");if(!e||cerchio!==questo)return;var l=(r&&!r.error&&r.data)||[];
    e.innerHTML=l.length?l.map(function(p){return '<div class="persona"><div><b>'+esc(p.nome||"—")+'</b><small>'+(vic?(p.posto==="guida"?"guida il vicinato":"nel vicinato"):esc(p.posto||(x.tipo==="azienda"?"team":"nel gruppo")))+'</small></div><div class="fine" style="margin:0;justify-content:flex-end">'+(p.ruoli||[]).map(chipRuolo).join("")+'</div></div>';}).join(""):'<p class="nota">'+(vic?'Ancora nessuno è entrato con i quattro passi.':'Ancora nessuno.')+'</p>';
    if(vic&&(x.guido||io.coordina))ruoliCerchio(questo,l);
  },function(){});
  var A=new Date(Date.now()-60*864e5).toISOString();
  if(x.tipo==="azienda")return;
  db.from("orme").select(CAMPI).eq(vic?"vicinato_id":"squadra_id",questo).in("tipo",TIPI_G).gte("momento",A).order("momento",{ascending:false}).limit(30).then(function(r){
    var g=$("#ce-giornale");if(!g||cerchio!==questo)return;var l=(r&&!r.error&&r.data)||[];
    if(!l.length){g.innerHTML=(vic?'<p class="nota" style="padding:10px 0;text-align:center">Ancora niente per questo vicinato. Si scrive dal megafono, scegliendo «il vicinato».</p>':'<p class="nota" style="padding:10px 0;text-align:center">Ancora niente per questo gruppo.</p>');return;}
    var files=[];l.forEach(function(o){(o.orma_file||[]).forEach(function(f){files.push(f);});});
    Promise.all([leggiNomi(l.map(function(o){return o.persona_id;})),firmaURL(files)]).then(function(w){
      if(cerchio!==questo)return;
      g.innerHTML=l.map(function(o){return voce({o:o,t:new Date(o.inizio_il||o.momento).getTime()},w[1]);}).join("");
      g.querySelectorAll("[data-art]").forEach(function(b){b.onclick=function(){apriA[b.getAttribute("data-art")]=!apriA[b.getAttribute("data-art")];vCerchio();};});
      legaVis(g);
    });
  },function(){});
}
