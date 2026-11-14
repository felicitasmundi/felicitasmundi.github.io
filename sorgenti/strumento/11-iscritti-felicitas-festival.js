/* ISCRITTI FELICITAS FESTIVAL · SQL 224: i numeri per voce, e toccando la voce l'elenco con «Rispondi» (fm_prenotazione_rispondi, SQL 171).
   Mail e telefono non escono dal database. Senza l'SQL 224 il quadrante non si vede. */
var ISCR_VOCI=[["ci_saro","Ci sarò"],["pranzo","Pranzo"],["cena","Cena"],["workshop","Workshop"],["laboratori_bambini","Laboratori bambini"],["alloggio","Alloggio"]];
var iscr={dati:null,voce:null};
function iscritti(){
  var box=$("#esp-iscr");if(!box)return;
  db.rpc("fm_iscritti_festival").then(function(r){
    if(!box.isConnected)return;
    if(!r||r.error){var sz=$("#esp-iscr-s");if(sz)sz.hidden=true;return;}
    var l=r.data||[];iscr.dati=l;
    if(!l.length){box.innerHTML='<p class="esp-d">Ancora nessun iscritto.</p>';$("#esp-iscr-l").innerHTML="";return;}
    var vv=ISCR_VOCI.filter(function(v){return l.some(function(x){return x.cosa===v[0];});});
    box.innerHTML='<div class="esp-gg">'+vv.map(function(v){var z=l.filter(function(x){return x.cosa===v[0];}),p=z.reduce(function(a,x){return a+(+x.persone||1);},0);
      return '<button type="button" class="esp-g'+(iscr.voce===v[0]?' aperto':'')+'" data-iscr="'+v[0]+'"><b>'+esc(v[1])+'</b><small>'+(p===1?'1 persona':p+' persone')+' · '+(z.length===1?'1 prenotazione':z.length+' prenotazioni')+'</small></button>';}).join("")+'</div>';
    box.querySelectorAll("[data-iscr]").forEach(function(b){b.onclick=function(){var k=b.getAttribute("data-iscr");iscr.voce=iscr.voce===k?null:k;
      box.querySelectorAll("[data-iscr]").forEach(function(y){y.classList.toggle("aperto",y.getAttribute("data-iscr")===iscr.voce);});iscrElenco();};});
    iscrElenco();
  },function(){var sz=$("#esp-iscr-s");if(sz)sz.hidden=true;});
}
function iscrElenco(){
  var w=$("#esp-iscr-l");if(!w)return;
  if(!iscr.voce||!iscr.dati){w.innerHTML="";return;}
  var paga={pranzo:1,cena:1,workshop:1,alloggio:1};
  var z=iscr.dati.filter(function(x){return x.cosa===iscr.voce;});
  w.innerHTML=z.map(function(x){var id=esc(x.riga||"");
    return '<div class="esp-v" style="display:block;cursor:default"><b>'+esc(x.nome||"")+'</b>'+
      '<small>'+((+x.persone||1)===1?'1 persona':(+x.persone)+' persone')+' · '+esc(new Date(x.creato_il).toLocaleDateString("it-IT",{day:"numeric",month:"long"}))+
        (x.pagato===true?' · pagato':(x.pagato===false&&paga[x.cosa]?' · da pagare':''))+(x.via==="app"?' · dall\'app':'')+
        (+x.risposte?' · '+(x.risposte==1?'1 risposta':x.risposte+' risposte'):'')+'</small>'+
      (x.dettaglio?'<small style="white-space:pre-wrap">'+esc(x.dettaglio)+'</small>':'')+
      (x.riga?'<div class="fine" style="margin-top:8px"><button class="mini oro" data-iscr-r="'+id+'">Rispondi</button></div><div id="iscr-r-'+id+'"></div>':'')+'</div>';}).join("");
  w.querySelectorAll("[data-iscr-r]").forEach(function(b){b.onclick=function(){var id=b.getAttribute("data-iscr-r"),q=$("#iscr-r-"+id);if(!q)return;
    if(q.innerHTML){q.innerHTML="";return;}q.innerHTML='<p class="nota">Un momento…</p>';
    db.rpc("fm_prenotazione_risposte",{p_riga:id}).then(function(r){var l=(r&&!r.error&&r.data)||[];
      q.innerHTML=l.map(function(x){return '<div class="bc-r"><span class="m">'+esc(x.chi||"")+' · '+esc(new Date(x.scritto_il).toLocaleDateString("it-IT",{day:"numeric",month:"long"}))+' · '+(x.via==="mail"?"per mail":"nell'app")+'</span><span class="t" style="white-space:pre-wrap">'+esc(x.testo)+'</span></div>';}).join("")+
        '<label class="tre-label">La tua risposta<textarea id="iscr-t-'+id+'" rows="4" maxlength="2000"></textarea></label>'+
        '<div class="fine"><button class="mini oro" id="iscr-b-'+id+'">Invia</button></div><p class="nota" id="iscr-x-'+id+'"></p>';
      $("#iscr-b-"+id).onclick=function(){var t=$("#iscr-t-"+id).value.trim(),x=$("#iscr-x-"+id),bb=this;if(!t){x.textContent="Scrivi la risposta.";return;}bb.disabled=true;
        db.rpc("fm_prenotazione_rispondi",{p_riga:id,p_testo:t}).then(function(r){var v=r&&!r.error?r.data:null;
          if(v&&String(v).indexOf("ok:")===0){x.textContent=v==="ok:mail"?"Mandata per mail.":"Arrivata nell'app.";setTimeout(iscritti,1200);return;}
          bb.disabled=false;x.textContent=v||(r&&r.error?errore(r.error):"Non è partita. Si può riprovare.");},
          function(){bb.disabled=false;x.textContent="Non è partita. Si può riprovare.";});};
    },function(){q.innerHTML='<p class="nota">Non si è aperto. Si può riprovare.</p>';});};});
}
