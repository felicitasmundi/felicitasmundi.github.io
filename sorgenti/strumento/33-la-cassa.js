/* ═══ LA CASSA · SQL 136, 30/10/2026 (thread «Chat interna dei team in Azione») ═══
   Gab 30/10 05:33: «a me serve un apparecchio che riconosca che è uscito un libro, e che tenga il conto di cosa c è e cosa è stato dato / Poi faccio ricevite fiscali».
   05:38: le ricevute sono di carta, le scrive chi ha timbro e registro contabile. 11:23: «non useremo sumup»: la carta passa dal POS, qui si segna solo «carta».
   Ogni vendita ha un id fatto dal telefono: se la rete cade resta in coda e riparte da sola, senza raddoppiare (fm_cassa_vendi).
   La giacenza scende da sola (righe = compiti «vendita» del 74). Punti: i punti di ritiro del villaggio e il Festival. */
var CS={punto:null,punti:null,carrello:[],trovati:null,codiceNuovo:null,lotti:null,stream:null,timer:null,giorno:null,esito:"",err:false};
function csLeggi(k){try{return localStorage.getItem(k);}catch(e){return null;}}
function csScrivi(k,v){try{if(v==null)localStorage.removeItem(k);else localStorage.setItem(k,v);}catch(e){}}
function csCoda(){try{return JSON.parse(csLeggi("fm_cassa_coda")||"[]")||[];}catch(e){return [];}}
function csCodaSalva(l){csScrivi("fm_cassa_coda",l.length?JSON.stringify(l):null);}
function csId(){if(window.crypto&&crypto.randomUUID)return crypto.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(c){var r=Math.random()*16|0;return (c==="x"?r:(r&3|8)).toString(16);});}
function csPuoRicevute(){return io.coordina||(io.ruoli||[]).some(function(r){return r.funzione==="logistica"&&(r.ruolo==="contabilita"||r.ruolo==="emporio");});}
function csPuoLegare(){return io.coordina||(io.ruoli||[]).some(function(r){return r.funzione==="logistica"&&(r.ruolo==="emporio"||r.ruolo==="produttori");});}
function cassaFerma(){
  if(CS.timer){clearInterval(CS.timer);CS.timer=null;}
  if(CS.stream){CS.stream.getTracks().forEach(function(t){t.stop();});CS.stream=null;}
  var f=$("#cs-foglio");if(f)f.remove();
}
/* manda le vendite in coda, una alla volta; se manca la rete restano lì */
var csInVolo=false;
function csMando(){
  if(csInVolo||!db)return Promise.resolve();
  var v=csCoda().filter(function(x){return !x.err;})[0];if(!v)return Promise.resolve();
  csInVolo=true;
  return db.rpc("fm_cassa_vendi",{p_id:v.id,p_punto:v.punto,p_pagamento:v.pagamento,p_righe:v.righe}).then(function(r){
    csInVolo=false;
    if(r&&r.error){
      if(/fetch|network|Failed|Load failed|timeout/i.test(r.error.message||""))return;
      csCodaSalva(csCoda().map(function(x){if(x.id===v.id)x.err=errore(r.error);return x;}));return csMando();
    }
    csCodaSalva(csCoda().filter(function(x){return x.id!==v.id;}));return csMando();
  },function(){csInVolo=false;});
}
window.addEventListener("online",function(){csMando().then(function(){if(vista==="cassa"){csDisegna();csGiorno();}});});
function vCassa(){
  var c=$("#corpo");
  if(!io.id){vai("azione");return;}
  var puo=io.coordina||(io.ruoli||[]).some(function(r){return r.funzione==="logistica";});
  c.innerHTML='<div class="giro" style="margin-bottom:4px"><button class="btn" id="cs-indietro">← Azione</button></div>'+
    '<h2 class="tm-tit" style="margin-top:12px">Cassa</h2>'+
    (puo?'<div id="cs-corpo"><p class="cs-nota">Un momento…</p></div>':'<p class="cs-nota">La cassa la tiene chi ha un ruolo nella logistica.</p>');
  $("#cs-indietro").onclick=function(){vai("azione");};
  if(!puo)return;
  var pr=CS.punti?Promise.resolve(CS.punti):Promise.all([
      db.rpc("fm_luoghi_del_villaggio",{p_villaggio:VILLAGGIO}).then(function(r){return (r&&!r.error&&r.data)||[];},function(){return [];}),
      db.from("orme").select("id,titolo").eq("id",FEST_ID).then(function(r){return (r&&!r.error&&r.data)||[];},function(){return [];})
    ]).then(function(v){
      var l=v[1].map(function(f){return {id:f.id,titolo:f.titolo};}).concat(
        v[0].filter(function(x){return (x.funzioni||[]).indexOf("punto_ritiro")>=0;}).map(function(x){return {id:x.id,titolo:x.titolo};}));
      CS.punti=l;return l;});
  pr.then(function(l){
    if(vista!=="cassa")return;
    if(!CS.punto||!l.some(function(x){return x.id===CS.punto;})){var s=csLeggi("fm_cassa_punto");CS.punto=l.some(function(x){return x.id===s;})?s:(l[0]&&l[0].id)||null;}
    csDisegna();csMando().then(function(){if(vista==="cassa"){csDisegnaCoda();csGiorno();}});
  });
}
function csTotale(){return CS.carrello.reduce(function(t,r){return t+Math.round(r.q*(r.prezzo||0)*100)/100;},0);}
function csDisegna(){
  var b=$("#cs-corpo");if(!b)return;
  if(!CS.punti||!CS.punti.length){b.innerHTML='<p class="cs-nota">Non c\'è ancora un punto dove vendere: serve un luogo segnato come punto di ritiro, o la festa del Festival.</p>';return;}
  b.innerHTML=
    (CS.punti.length>1?'<label class="cs-lab" for="cs-punto">Dove sei</label><select class="cs-sel" id="cs-punto">'+CS.punti.map(function(p){return '<option value="'+esc(p.id)+'"'+(p.id===CS.punto?' selected':'')+'>'+esc(p.titolo)+'</option>';}).join("")+'</select>'
      :'<p class="cs-nota">Sei a: <b>'+esc(CS.punti[0].titolo)+'</b></p>')+
    '<button type="button" class="cs-leggi" id="cs-leggi">'+ICO_AZ.foto.replace(/#D4AF6A/g,"#0a1430")+'Leggi il codice a barre</button>'+
    '<div class="cs-riga"><input class="cs-in" id="cs-q" type="search" inputmode="search" autocomplete="off" placeholder="Numero del codice o nome" aria-label="Numero del codice o nome della merce"><button type="button" class="cs-b" id="cs-cerca">Cerca</button></div>'+
    '<div id="cs-trovati"></div>'+
    '<div id="cs-vendita"></div>'+
    '<div id="cs-coda"></div>'+
    '<div class="cs-riga" style="justify-content:space-between;margin-top:18px"><p class="tm-et" style="margin:0">Le vendite del giorno</p><input type="date" class="cs-in" id="cs-data" style="flex:0 0 auto;width:auto" value="'+esc(CS.giorno||oggiISO())+'" aria-label="Giorno"></div>'+
    '<div id="cs-giorno"><p class="cs-nota">Un momento…</p></div>';
  var p=$("#cs-punto");if(p)p.onchange=function(){CS.punto=p.value;csScrivi("fm_cassa_punto",p.value);CS.carrello=[];CS.trovati=null;csDisegna();csGiorno();};
  $("#cs-leggi").onclick=csCamera;
  var q=$("#cs-q");
  $("#cs-cerca").onclick=function(){csCerca(q.value);};
  q.onkeydown=function(e){if(e.key==="Enter"){e.preventDefault();csCerca(q.value);}};
  $("#cs-data").onchange=function(){CS.giorno=$("#cs-data").value||null;csGiorno();};
  csCarrello();csDisegnaTrovati();csDisegnaCoda();
}
function csCarrello(){
  var b=$("#cs-vendita");if(!b)return;
  var tot=csTotale(),vuoto=!CS.carrello.length,manca=CS.carrello.some(function(r){return r.prezzo==null||isNaN(r.prezzo);});
  b.innerHTML=
    '<p class="tm-et">La vendita</p>'+
    (vuoto?'<p class="cs-nota">Leggi un codice o cerca una merce: entra qui.</p>':
      CS.carrello.map(function(r,i){
        return '<div class="cs-carta"><b>'+esc(r.merce)+'</b>'+(r.giacenza!=null&&r.giacenza-r.q<0?'<span class="cs-m sotto">Qui ne risultano '+lgNum(r.giacenza)+': l\'arrivo forse non è stato segnato</span>':'')+
          '<div class="cs-q"><button type="button" data-meno="'+i+'" aria-label="Uno in meno">−</button><span aria-live="polite">'+lgNum(r.q)+'</span><button type="button" data-piu="'+i+'" aria-label="Uno in più">+</button>'+
          '<label class="cs-m" style="margin:0 0 0 6px">€ l\'uno</label><input type="number" min="0" step="0.01" inputmode="decimal" data-prezzo="'+i+'" value="'+(r.prezzo==null?'':r.prezzo)+'" aria-label="Prezzo per unità in euro" placeholder="€">'+
          '<button type="button" class="cs-x" data-togli="'+i+'">Togli</button></div></div>';}).join(""))+
    '<div class="cs-tot"><span>Totale</span><b id="cs-tot">'+lgEuro(tot)+'</b></div>'+
    (manca?'<p class="cs-nota">Scrivi il prezzo dove manca.</p>':'')+
    '<div class="cs-paga"><button type="button" id="cs-contanti"'+(vuoto||manca?' disabled':'')+'>Contanti</button><button type="button" id="cs-cartaP"'+(vuoto||manca?' disabled':'')+'>Carta</button></div>'+
    '<p class="cs-nota">Con la carta: batti il totale sul POS, poi tocca «Carta».</p>'+
    '<p class="cs-esito'+(CS.err?' err':'')+'" id="cs-esito" aria-live="polite">'+esc(CS.esito)+'</p>';
  b.querySelectorAll("[data-piu]").forEach(function(x){x.onclick=function(){CS.carrello[+x.getAttribute("data-piu")].q+=1;CS.esito="";csCarrello();};});
  b.querySelectorAll("[data-meno]").forEach(function(x){x.onclick=function(){var r=CS.carrello[+x.getAttribute("data-meno")];if(r.q>1)r.q-=1;csCarrello();};});
  b.querySelectorAll("[data-togli]").forEach(function(x){x.onclick=function(){CS.carrello.splice(+x.getAttribute("data-togli"),1);csCarrello();};});
  b.querySelectorAll("[data-prezzo]").forEach(function(x){x.onchange=function(){var v=parseFloat(String(x.value).replace(",","."));CS.carrello[+x.getAttribute("data-prezzo")].prezzo=v>=0?Math.round(v*100)/100:null;csCarrello();};});
  $("#cs-contanti").onclick=function(){csVendi("contanti");};
  $("#cs-cartaP").onclick=function(){csVendi("carta");};
}
function csAggiungi(m){
  var r=CS.carrello.filter(function(x){return x.lotto===m.lotto_id;})[0];
  if(r)r.q+=1;else CS.carrello.push({lotto:m.lotto_id,merce:m.merce,q:1,prezzo:m.prezzo==null?null:+m.prezzo,listino:m.prezzo==null?null:+m.prezzo,giacenza:m.giacenza==null?null:+m.giacenza});
  CS.trovati=null;CS.codiceNuovo=null;CS.esito="";CS.err=false;
  csDisegnaTrovati();csCarrello();
}
function csCerca(t){
  t=String(t||"").trim();if(!t)return;
  var codice=/^[0-9]{6,32}$/.test(t);
  var a={p_punto:CS.punto,p_villaggio:VILLAGGIO};if(codice)a.p_codice=t;else a.p_testo=t;
  CS.esito="";CS.err=false;
  db.rpc("fm_cassa_cerca",a).then(function(r){
    if(r&&r.error){CS.trovati=[];CS.esito=errore(r.error);CS.err=true;csDisegnaTrovati();csCarrello();return;}
    var l=(r&&r.data)||[];
    if(codice&&l.length===1){csAggiungi(l[0]);return;}
    CS.trovati=l;CS.codiceNuovo=codice&&!l.length?t:null;
    csDisegnaTrovati();
  },function(){});
}
function csDisegnaTrovati(){
  var b=$("#cs-trovati");if(!b)return;
  if(CS.codiceNuovo){
    var puo=csPuoLegare();
    b.innerHTML='<div class="cs-carta"><b>Il codice '+esc(CS.codiceNuovo)+' non è ancora legato a una merce</b>'+
      (puo?'<label class="cs-lab" for="cs-lotto">A quale merce lo lego?</label><select class="cs-sel" id="cs-lotto"><option value="">Un momento…</option></select>'+
        '<div class="cs-riga" style="margin-top:10px"><button type="button" class="cs-b oro" id="cs-lega" disabled>Lega il codice</button><button type="button" class="cs-b" id="cs-lascia">Lascia stare</button></div>'
        :'<span class="cs-m">Cerca la merce per nome. Il codice lo lega chi ha il ruolo Emporio o Produttori.</span>')+'</div>';
    if(!puo)return;
    $("#cs-lascia").onclick=function(){CS.codiceNuovo=null;CS.trovati=null;csDisegnaTrovati();};
    db.from("merce_lotti").select("id,nome,lotto,codice_barre").is("chiuso_il",null).eq("villaggio_id",VILLAGGIO).order("nome").then(function(r){
      var s=$("#cs-lotto");if(!s)return;
      var l=((r&&!r.error&&r.data)||[]).filter(function(x){return !x.codice_barre;});
      s.innerHTML=l.length?l.map(function(x){return '<option value="'+esc(x.id)+'">'+esc(x.nome)+(x.lotto?' · '+esc(x.lotto):'')+'</option>';}).join(""):'<option value="">Nessuna merce senza codice</option>';
      var g=$("#cs-lega");g.disabled=!l.length;
      g.onclick=function(){g.disabled=true;var cod=CS.codiceNuovo;
        db.from("merce_lotti").update({codice_barre:cod}).eq("id",s.value).then(function(x){
          if(x&&x.error){g.disabled=false;CS.esito=errore(x.error);CS.err=true;var e=$("#cs-esito");if(e){e.textContent=CS.esito;e.className="cs-esito err";}return;}
          CS.codiceNuovo=null;csCerca(cod);},function(){g.disabled=false;});};
    },function(){});
    return;
  }
  if(!CS.trovati){b.innerHTML="";return;}
  b.innerHTML=CS.trovati.length?CS.trovati.map(function(m,i){
      return '<button type="button" class="cs-carta" data-scegli="'+i+'"><b>'+esc(m.merce)+'</b>'+
        '<span class="cs-m">'+(m.prezzo!=null?lgEuro(m.prezzo)+' · ':'senza prezzo · ')+'qui ne risultano '+lgNum(m.giacenza)+' '+esc(m.unita||"")+(m.produttore?' · '+esc(m.produttore):'')+'</span></button>';}).join("")
    :'<p class="cs-nota">Nessuna merce con questo nome.</p>';
  b.querySelectorAll("[data-scegli]").forEach(function(x){x.onclick=function(){csAggiungi(CS.trovati[+x.getAttribute("data-scegli")]);};});
}
/* la fotocamera legge il codice (BarcodeDetector: Chrome su Android). Dove non c'è, si scrive il numero sotto le barre. */
function csCamera(){
  cassaFerma();
  var f=document.createElement("div");f.id="cs-foglio";document.body.appendChild(f);
  var ok="BarcodeDetector" in window&&navigator.mediaDevices&&navigator.mediaDevices.getUserMedia;
  f.innerHTML='<div class="tc-velo" id="cs-velo"></div><div class="tc-foglio" role="dialog" aria-modal="true" aria-label="Leggi il codice a barre"><div class="tc-presa"></div>'+
    '<h2>Leggi il codice</h2>'+
    (ok?'<p>Inquadra le barre, da vicino e con luce.</p><video class="cs-video" id="cs-video" playsinline muted autoplay></video><p class="cs-esito" id="cs-cam-esito"></p>'
       :'<p>Questo telefono non legge i codici dall\'app. Scrivi il numero stampato sotto le barre.</p>')+
    '<div class="cs-riga" style="margin-top:12px"><button type="button" class="cs-b" id="cs-chiudi" style="width:100%">Chiudi</button></div></div>';
  $("#cs-velo").onclick=cassaFerma;$("#cs-chiudi").onclick=function(){cassaFerma();var q=$("#cs-q");if(q)q.focus();};
  if(!ok)return;
  var formati=["ean_13","ean_8","upc_a","upc_e","code_128","code_39"];
  Promise.resolve(BarcodeDetector.getSupportedFormats?BarcodeDetector.getSupportedFormats():formati).then(function(sup){
    var usa=formati.filter(function(x){return sup.indexOf(x)>=0;});
    var det=new BarcodeDetector(usa.length?{formats:usa}:undefined);
    return navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"},audio:false}).then(function(st){
      if(!$("#cs-foglio")){st.getTracks().forEach(function(t){t.stop();});return;}
      CS.stream=st;var v=$("#cs-video");v.srcObject=st;
      var occupato=false;
      CS.timer=setInterval(function(){
        if(occupato||!v.videoWidth)return;occupato=true;
        det.detect(v).then(function(l){occupato=false;
          var c=l&&l[0]&&String(l[0].rawValue||"").trim();
          if(c){if(navigator.vibrate)navigator.vibrate(60);cassaFerma();var q=$("#cs-q");if(q)q.value=c;csCerca(c);}
        },function(){occupato=false;});
      },280);
    });
  }).catch(function(){var e=$("#cs-cam-esito");if(e){e.className="cs-esito err";e.textContent="La fotocamera non si apre: controlla il permesso, o scrivi il numero sotto le barre.";}});
}
function csVendi(pag){
  if(!CS.carrello.length||!CS.punto)return;
  var righe=CS.carrello.map(function(r){var x={lotto:r.lotto,quantita:r.q};if(r.prezzo!==r.listino)x.prezzo=r.prezzo;return x;});
  var tot=csTotale();
  var v={id:csId(),punto:CS.punto,pagamento:pag,righe:righe,totale:tot,il:Date.now(),
         testo:CS.carrello.map(function(r){return lgNum(r.q)+" × "+r.merce;}).join(" · ")};
  var l=csCoda();l.push(v);csCodaSalva(l);
  CS.carrello=[];CS.trovati=null;CS.codiceNuovo=null;CS.esito="Un momento…";CS.err=false;csCarrello();csDisegnaTrovati();csDisegnaCoda();
  csMando().then(function(){
    var ancora=csCoda().filter(function(x){return x.id===v.id;})[0];
    CS.err=!!(ancora&&ancora.err);
    CS.esito=!ancora?"Venduto: "+lgEuro(tot)+(pag==="carta"?" con la carta.":" in contanti."):
      ancora.err?"La vendita non è passata: "+ancora.err:"Segnata sul telefono: parte da sola appena c'è rete.";
    if(vista==="cassa"){csCarrello();csDisegnaTrovati();csDisegnaCoda();csGiorno();}
  });
}
function csDisegnaCoda(){
  var b=$("#cs-coda");if(!b)return;
  var l=csCoda();
  if(!l.length){b.innerHTML="";return;}
  b.innerHTML='<p class="tm-et">In attesa di rete · '+l.length+'</p>'+l.map(function(v){
    return '<div class="cs-carta"><b>'+lgEuro(v.totale)+' · '+(v.pagamento==="carta"?"carta":"contanti")+'</b><span class="cs-m">'+esc(hhmm(v.il))+' · '+esc(v.testo||"")+'</span>'+
      (v.err?'<span class="cs-m sotto">Non passata: '+esc(v.err)+'</span><div class="cs-riga" style="margin-top:8px"><button type="button" class="cs-b" data-riprova="'+esc(v.id)+'">Riprova</button><button type="button" class="cs-x" data-scarta="'+esc(v.id)+'">Togli</button></div>':'')+'</div>';}).join("")+
    '<button type="button" class="cs-b" id="cs-manda" style="width:100%;margin-top:6px">Manda adesso</button>';
  $("#cs-manda").onclick=function(){csMando().then(function(){csDisegnaCoda();csGiorno();});};
  b.querySelectorAll("[data-riprova]").forEach(function(x){x.onclick=function(){var id=x.getAttribute("data-riprova");csCodaSalva(csCoda().map(function(v){if(v.id===id)delete v.err;return v;}));csMando().then(function(){csDisegnaCoda();csGiorno();});};});
  b.querySelectorAll("[data-scarta]").forEach(function(x){x.onclick=function(){if(!confirm("Togliere questa vendita? Non sarà segnata."))return;var id=x.getAttribute("data-scarta");csCodaSalva(csCoda().filter(function(v){return v.id!==id;}));csDisegnaCoda();};});
}
/* le vendite del giorno: da qui chi ha timbro e registro scrive le ricevute e segna il numero */
function csGiorno(){
  var b=$("#cs-giorno");if(!b||!CS.punto)return;
  var a={p_punto:CS.punto};if(CS.giorno&&CS.giorno!==oggiISO())a.p_giorno=CS.giorno;
  var punto=CS.punto;
  db.rpc("fm_cassa_giorno",a).then(function(r){
    var b=$("#cs-giorno");if(!b||CS.punto!==punto)return;
    if(r&&r.error){b.innerHTML='<p class="cs-nota">'+esc(errore(r.error))+'</p>';return;}
    var l=(r&&r.data)||[],valide=l.filter(function(v){return !v.annullata;});
    var con=0,car=0,senza=0;valide.forEach(function(v){if(v.pagamento==="carta")car+=+v.totale;else con+=+v.totale;if(!v.ricevuta_numero)senza++;});
    var ric=csPuoRicevute();
    b.innerHTML=(l.length?'<div class="cs-somme"><div><b>'+lgEuro(con)+'</b><small>contanti</small></div><div><b>'+lgEuro(car)+'</b><small>carta</small></div></div>'+
        (senza?'<p class="cs-nota">'+(senza===1?'1 vendita aspetta':senza+' vendite aspettano')+' la ricevuta.</p>':'<p class="cs-nota">Tutte le vendite hanno la ricevuta.</p>'):
        '<p class="cs-nota">Nessuna vendita in questo giorno.</p>')+
      l.map(function(v){
        return '<div class="cs-carta'+(v.annullata?' cs-via':'')+'"><b>'+lgEuro(v.totale)+' · '+(v.pagamento==="carta"?"carta":"contanti")+'</b>'+
          '<span class="cs-m">'+esc(hhmm(v.ora))+' · '+esc(v.righe||"")+'</span>'+
          (v.annullata?'<span class="cs-m">Annullata</span>':
            v.ricevuta_numero?'<span class="cs-m">Ricevuta n. '+esc(v.ricevuta_numero)+'</span>':
            (ric?'<div class="cs-riga" style="margin-top:8px"><input class="cs-in" data-nric="'+esc(v.vendita_id)+'" inputmode="numeric" maxlength="40" placeholder="Numero della ricevuta" aria-label="Numero della ricevuta"><button type="button" class="cs-b oro" data-ric="'+esc(v.vendita_id)+'">Segna</button></div>':'<span class="cs-m">Senza ricevuta</span>'))+
          (!v.annullata&&!v.ricevuta_numero&&(v.venduta_da===io.id||io.coordina)?'<div class="cs-riga"><button type="button" class="cs-x" style="margin-left:0" data-annulla="'+esc(v.vendita_id)+'">Annulla la vendita</button></div>':'')+
          '</div>';}).join("");
    b.querySelectorAll("[data-ric]").forEach(function(x){x.onclick=function(){
      var id=x.getAttribute("data-ric"),n=b.querySelector('[data-nric="'+id+'"]').value.trim();if(!n)return;
      x.disabled=true;db.rpc("fm_cassa_ricevuta",{p_vendita:id,p_numero:n}).then(function(r){if(r&&r.error){x.disabled=false;alert(errore(r.error));return;}csGiorno();},function(){x.disabled=false;});};});
    b.querySelectorAll("[data-annulla]").forEach(function(x){x.onclick=function(){
      if(!confirm("Annullare questa vendita? La merce torna nel punto."))return;
      x.disabled=true;db.rpc("fm_cassa_annulla",{p_vendita:x.getAttribute("data-annulla")}).then(function(r){if(r&&r.error){x.disabled=false;alert(errore(r.error));return;}csGiorno();},function(){x.disabled=false;});};});
  },function(){});
}
/* i ruoli di un vicinato · li dà chi guida il vicinato, chi coordina, il nucleo (SQL 79) */
function ruoliCerchio(vic,persone){
  var box=$("#ce-ruoli");if(!box)return;
  db.from("ruoli").select("id,persona_id,funzione,ruolo").eq("vicinato_id",vic).is("fino_al",null).then(function(r){
    var rr=(r&&!r.error&&r.data)||[],nome={};persone.forEach(function(p){nome[p.persona_id]=p.nome;});
    box.innerHTML=(rr.length?rr.map(function(x){return '<div class="persona"><div><b>'+esc(nome[x.persona_id]||"—")+'</b><small>'+esc(FUNZIONI[x.funzione]||x.funzione)+' · '+esc(nomeRuolo(x.funzione,x.ruolo))+'</small></div><button class="mini" data-chiudi-cr="'+esc(x.id)+'">Chiudi</button></div>';}).join(""):'')+
      (persone.length?'<label>Persona<select id="cr-p">'+persone.map(function(p){return '<option value="'+esc(p.persona_id)+'">'+esc(p.nome||"—")+'</option>';}).join("")+'</select></label>'+
      '<div class="due"><label>Funzione<select id="cr-f">'+Object.keys(FUNZIONI).map(function(f){return '<option value="'+f+'">'+FUNZIONI[f]+'</option>';}).join("")+'</select></label><label>Ruolo<select id="cr-r"></select></label></div>'+
      '<div class="azioni"><button class="btn pieno" id="cr-dai">Dai il ruolo</button></div>':'<p class="nota">I ruoli si danno a chi è già nel vicinato.</p>')+'<div class="toast" id="cr-ok" hidden></div>';
    function ruoliDi(f){var s=$("#cr-r");if(s)s.innerHTML=RUOLI[f].map(function(x){return '<option value="'+x[0]+'">'+x[1]+'</option>';}).join("");}
    if($("#cr-f")){ruoliDi("tecnologica");$("#cr-f").onchange=function(e){ruoliDi(e.target.value);};}
    box.querySelectorAll("[data-chiudi-cr]").forEach(function(b){b.onclick=function(){b.disabled=true;db.from("ruoli").update({fino_al:oggiISO()}).eq("id",b.getAttribute("data-chiudi-cr")).then(function(x){if(x.error){mostra("#cr-ok",errore(x.error),true);b.disabled=false;return;}vCerchio();});};});
    var d=$("#cr-dai");if(d)d.onclick=function(){d.disabled=true;
      db.from("ruoli").insert({persona_id:$("#cr-p").value,funzione:$("#cr-f").value,ruolo:$("#cr-r").value,vicinato_id:vic,dato_da:io.id}).then(function(x){
        d.disabled=false;if(x.error)return mostra("#cr-ok",/duplicate|unique/i.test(x.error.message||"")?"Questa persona ha già questo ruolo nel vicinato.":errore(x.error),true);vCerchio();});};
  },function(){box.innerHTML="";});
}

