/* IL BANCO DEI COMPITI · uno solo: le righe del registro con uno stato e i compiti della logistica (SQL 74), ognuno col suo stato */
var banco={filtro:"tutti"};
function vBanco(box,cerchioId){
  if(!box)return;
  db.rpc("fm_banco",{p_cerchio:cerchioId||null}).then(function(r){
    if(!box.isConnected)return;
    if(!r||r.error){box.innerHTML="";return;}
    var l=r.data||[],ids=[];l.forEach(function(x){ids.push(x.preso_da,x.scritto_da);});
    leggiNomi(ids).then(function(){
      var ruoli={};l.forEach(function(x){if(x.ruolo)ruoli[x.ruolo]=1;});
      var f=banco.filtro,q=l.filter(function(x){return f==="tutti"||(f==="miei"?(x.preso_da===io.id||x.scritto_da===io.id):x.ruolo===f);});
      var col=[["aperto","Aperto"],["preso","Preso"],["fatto","Fatto · 30 giorni"]];
      function carta(x){
        var t=x.fonte==="logistica"?{id:x.id,stato:x.stato,preso_da:x.preso_da,scritto_da:x.scritto_da}:x;
        var tasti=x.fonte==="logistica"?
          (x.stato==="aperto"?'<div class="fine"><button class="mini oro" data-bclog="prendo|'+esc(x.id)+'">Lo prendo</button></div>':x.stato==="preso"&&(x.preso_da===io.id||io.coordina)?'<div class="fine"><button class="mini oro" data-bclog="fatto|'+esc(x.id)+'">Fatto</button></div>':''):regTasti(t);
        return '<div class="card"><span class="t">'+esc(x.titolo+(/ person[ae]$/.test(x.titolo||"")?"":regQuanti(x.quanti)))+'</span><div class="rg-meta">'+
          (x.fonte==="logistica"?(x.ruolo?'':'<span class="chip f-logistica">logistica</span>'):'<span class="pill s-in_coda">'+esc(REG_TIPO[x.tipo]||x.tipo)+'</span>')+
          (x.ruolo?'<span class="chip f-'+esc(x.funzione||"")+'">'+esc(regNomeRuolo(x.ruolo))+'</span>':'')+(x.voce?'<span class="chip">'+esc(x.voce)+'</span>':'')+'</div>'+
          '<span class="m">'+(x.preso_da?esc(nomi[x.preso_da]||"preso"):"nessuno ancora")+(x.entro_il?" · entro il "+esc(new Date(x.entro_il+"T12:00").toLocaleDateString("it-IT",{day:"numeric",month:"long"})):"")+'</span>'+tasti+(x.fonte==='registro'&&x.tipo==='richiesta'&&(io.nucleo||io.coordina||regMioRuolo(x.ruolo))?'<div class="fine"><button class="mini oro" data-bcrisp="'+esc(x.id)+'">Rispondi</button></div><div class="bc-risp" id="bcr-'+esc(x.id)+'"></div>':'')+'</div>';}
      box.innerHTML='<p class="et">Il banco dei compiti</p>'+
        '<div class="lg-conta" style="grid-template-columns:repeat(3,1fr)">'+col.map(function(c){return '<div><b>'+q.filter(function(x){return x.stato===c[0];}).length+'</b><small>'+c[1].split(" ·")[0].toLowerCase()+'</small></div>';}).join("")+'</div>'+
        '<div class="lg-filtri">'+[["tutti","Tutti"],["miei","I miei"]].concat(Object.keys(ruoli).map(function(k){return [k,regNomeRuolo(k).split(" · ").pop()];})).map(function(c){return '<button class="chip'+(f===c[0]?" on":"")+'" data-bcf="'+esc(c[0])+'">'+esc(c[1])+'</button>';}).join("")+'</div>'+
        '<div class="lg-banco">'+col.map(function(c){var z=q.filter(function(x){return x.stato===c[0];});
          return '<div class="lg-col"><p class="et">'+c[1]+' · '+z.length+'</p>'+(z.length?z.map(carta).join(""):'<div class="vuoto" style="padding:10px">—</div>')+'</div>';}).join("")+'</div>';
      function di(){vBanco(box,cerchioId);}
      box.querySelectorAll("[data-bcf]").forEach(function(b){b.onclick=function(){banco.filtro=b.getAttribute("data-bcf");di();};});
      box.querySelectorAll("[data-bclog]").forEach(function(b){b.onclick=function(){var p=b.getAttribute("data-bclog").split("|"),a={p_compito:p[1]};b.disabled=true;
        db.rpc("fm_compito_"+p[0],a).then(function(x){if(x&&x.error)alert(errore(x.error));di();},function(){di();});};});
      legaRispondi(box,di);
      regLega(box,di);
    });
  },function(){box.innerHTML="";});
}

