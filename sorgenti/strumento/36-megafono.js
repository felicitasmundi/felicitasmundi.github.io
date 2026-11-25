/* MEGAFONO: tutti sono editori */
var M={tipo:"karma_yoga",vis:"pubblico",el:"",file:[],audio:null,rec:null,msg:""};
var TIPI_M=[["karma_yoga","Dono · scambio","descrivere, mettere foto, archiviare documenti o audio"],["articolo","Articolo","in evidenza nel giornale"],["festa","Festa","un evento, con giorno e ora"],["obiettivo","Obiettivo","cosa c'è da fare, entro quando"]];
function vMegafono(){
  var c=$("#corpo");
  if(!io.id){c.innerHTML='<p class="et">Megafono · tutti sono editori</p><h3>Cosa fai?</h3><p class="nota" style="margin:-4px 0 12px;font-style:italic">In questo spazio il nostro dare diventa un\'offerta all\'esistenza.</p><div class="card"><span class="t">Per scrivere nel giornale si entra con il codice che arriva per mail.</span><div class="fine"><a class="btn pieno" href="'+ENTRA+'">Entra</a></div></div>';return;}
  var tipi=TIPI_M.slice();
  if(io.coordina){tipi.push(["diretta","Diretta","radio, con giorno e ora"]);tipi.push(["lezione","Lezione","ogni settimana, stesso giorno e ora"]);}
  var t=M.tipo,area="";
  if(t==="diretta"){
    area='<label>Titolo della diretta<input type="text" id="m-titolo" maxlength="120" autocomplete="off"></label><label>Con chi<input type="text" id="m-sotto" maxlength="300" autocomplete="off"></label>'+
      '<div class="due"><label>Giorno<input type="date" id="m-data" value="'+oggiISO()+'"></label><label>Ora<input type="time" id="m-ora"></label></div>';
  }else if(t==="lezione"){
    area='<label>Titolo della lezione<input type="text" id="m-titolo" maxlength="120" autocomplete="off"></label><label>Chi la tiene, o di cosa parla<input type="text" id="m-sotto" maxlength="300" autocomplete="off"></label>'+
      '<div class="due"><label>Giorno della settimana<select id="m-gs">'+["lunedì","martedì","mercoledì","giovedì","venerdì","sabato","domenica"].map(function(n,i){return '<option value="'+(i+1)+'">'+n+'</option>';}).join("")+'</select></label><label>Ora<input type="time" id="m-ora"></label></div>'+
      '<div class="due"><label>Durata, in minuti<input type="number" id="m-durata" value="60" min="5" max="600"></label><label>Dal giorno<input type="date" id="m-dal" value="'+oggiISO()+'"></label></div>'+
      '<label>Dove (mai l\'indirizzo di una casa)<input type="text" id="m-luogo" maxlength="200" autocomplete="off"></label><label>Link per collegarsi (https://)<input type="url" id="m-link" autocomplete="off" inputmode="url"></label>';
  }else{
    /* 19 ott 12:04, Gab: «togli il tasto karma yoga / metti dono scambio come primo bottone, dando la possibilità di descrivere, mettere foto, archiviare documenti o audio». Nel database il tipo resta karma_yoga. */
    area=(t==="articolo"?'<label>Titolo<input type="text" id="m-titolo" maxlength="120" autocomplete="off"></label>':'')+
      '<label><span id="m-testo-l">'+(t==="obiettivo"?"Cosa c'è da fare":"Il testo, o la didascalia")+'</span><textarea id="m-testo"></textarea></label>'+
      (t==="festa"?'<div class="due"><label>Giorno<input type="date" id="m-data" value="'+oggiISO()+'"></label><label>Ora<input type="time" id="m-ora"></label></div>':'')+
      (t==="obiettivo"?'<div class="due"><label>Entro il<input type="date" id="m-entro"></label><label>Quante persone servono<input type="number" id="m-quanti" min="1" max="999"></label></div>':'')+
      '<label>Un link, anche YouTube (https://)<input type="url" id="m-link" autocomplete="off" inputmode="url" placeholder="https://"></label>'+
      '<div class="azioni"><label class="btn" for="m-file">Foto, documenti o audio</label><input class="file" type="file" id="m-file" accept="image/*,audio/*,.m4a,.mp3,.ogg,.wav,.pdf,.doc,.docx,.odt,.txt,.rtf,.xls,.xlsx,.ods,.ppt,.pptx,.odp" multiple>'+
      '<button class="btn" id="m-reg" type="button">'+(M.rec?'<span class="reg"><span class="punto"></span>Ferma</span>':'Registra un vocale')+'</button></div>'+
      '<div class="allegati" id="m-allegati"></div>'+(M.msg?'<p class="nota">'+esc(M.msg)+'</p>':'')+
      '<label>In quale cartella va<select id="m-el"><option value="">nessuna</option>'+ELEMENTI.map(function(e){return '<option value="'+e[0]+'"'+(M.el===e[0]?' selected':'')+'>'+e[1]+'</option>';}).join("")+'</select></label>'+
      '<p class="et" style="margin-top:6px">Chi lo legge</p><div class="vis">'+["solo_me","vicinato","pubblico"].map(function(v){return '<button type="button" data-mv="'+v+'" aria-pressed="'+(M.vis===v)+'">'+VIS[v]+'</button>';}).join("")+'</div>'+
      '<p class="nota">Con un link o un allegato la didascalia serve sempre. Gli indirizzi delle case non si scrivono qui.</p>';
  }
  c.innerHTML='<p class="et">Megafono · tutti sono editori</p><h3>Cosa fai?</h3><p class="nota" style="margin:-4px 0 12px;font-style:italic">In questo spazio il nostro dare diventa un\'offerta all\'esistenza.</p>'+
    '<div class="scelte">'+tipi.map(function(x){return '<button class="scelta" data-tipo="'+x[0]+'" aria-pressed="'+(x[0]===t)+'">'+x[1]+'<small>'+esc(x[2])+'</small></button>';}).join("")+'</div>'+
    '<div class="card modulo">'+area+'<div class="azioni"><button class="btn pieno" id="m-manda">'+(t==="diretta"?"Crea la diretta":t==="lezione"?"Metti la lezione":"Manda")+'</button></div><div class="toast" id="m-ok" hidden></div></div>';
  c.querySelectorAll("[data-tipo]").forEach(function(b){b.onclick=function(){if(M.rec)return;M.tipo=b.getAttribute("data-tipo");M.msg="";vMegafono();};});
  c.querySelectorAll("[data-mv]").forEach(function(b){b.onclick=function(){M.vis=b.getAttribute("data-mv");c.querySelectorAll("[data-mv]").forEach(function(x){x.setAttribute("aria-pressed",x===b);});};});
  var me=$("#m-el");if(me)me.onchange=function(){M.el=me.value;};
  var fi=$("#m-file");if(fi)fi.onchange=function(e){[].forEach.call(e.target.files,function(f){if(M.file.length<10)M.file.push(f);});fi.value="";allegati();};
  var rb=$("#m-reg");if(rb)rb.onclick=registra;
  /* 21 ott 09:15, Gab: «chi mette un video lo fa perché c'è un motivo» */
  var mlk=$("#m-link"),mtl=$("#m-testo-l");if(mlk&&mtl&&t!=="obiettivo"){var mt0=mtl.textContent;mlk.oninput=function(){mtl.textContent=ytId(mlk.value)?"Perché lo condividi":mt0;};}
  allegati();
  $("#m-manda").onclick=manda;
}
function allegati(){
  var el=$("#m-allegati");if(!el)return;
  el.innerHTML=M.file.map(function(f,i){return '<span>'+esc(f.name)+'<button class="mini" data-via="'+i+'" type="button">togli</button></span>';}).join("");
  el.querySelectorAll("[data-via]").forEach(function(b){b.onclick=function(){M.file.splice(+b.getAttribute("data-via"),1);allegati();};});
}
function registra(){
  if(M.rec){M.rec.stop();return;}
  if(!navigator.mediaDevices||!window.MediaRecorder){M.msg="Il microfono qui non si apre: si può scegliere un file audio.";vMegafono();return;}
  navigator.mediaDevices.getUserMedia({audio:true}).then(function(s){
    var pezzi=[];M.rec=new MediaRecorder(s);
    M.rec.ondataavailable=function(e){if(e.data.size)pezzi.push(e.data);};
    M.rec.onstop=function(){var tipo=(M.rec.mimeType||"audio/webm").split(";")[0],est=/mp4/.test(tipo)?"m4a":/ogg/.test(tipo)?"ogg":"webm";
      var d=new Date(),n="vocale-"+d.getFullYear()+String(d.getMonth()+1).padStart(2,"0")+String(d.getDate()).padStart(2,"0")+"-"+String(d.getHours()).padStart(2,"0")+String(d.getMinutes()).padStart(2,"0")+"."+est;
      try{M.file.push(new File(pezzi,n,{type:tipo}));}catch(e){var b=new Blob(pezzi,{type:tipo});b.name=n;M.file.push(b);}
      s.getTracks().forEach(function(x){x.stop();});M.rec=null;M.msg="";vMegafono();};
    M.rec.start();M.msg="";vMegafono();
  }).catch(function(){M.rec=null;M.msg="Il microfono qui non si apre: si può scegliere un file audio.";vMegafono();});
}
function val(id){var e=$("#"+id);return e?String(e.value||"").trim():"";}
function manda(){
  var b=$("#m-manda"),t=M.tipo;
  function fine(msg,err){b.disabled=false;mostra("#m-ok",msg,err);}
  if(t==="diretta"){
    var tt=val("m-titolo"),g=val("m-data"),h=val("m-ora");
    if(!tt)return fine("Manca il titolo.",true);if(!g||!h)return fine("Manca il giorno o l'ora.",true);
    b.disabled=true;
    return db.rpc("fm_crea_diretta",{p_titolo:tt,p_sottotitolo:val("m-sotto"),p_inizio:new Date(g+"T"+h).toISOString(),p_pubblica:true}).then(function(r){
      if(r.error)return fine(errore(r.error),true);cache.dirette=null;
      M.msg="";vMegafono();mostra("#m-ok","Creata: compare in Oggi e nel giornale, da un'ora prima.");
    });
  }
  if(t==="lezione"){
    var lt=val("m-titolo"),lo=val("m-ora"),ll=val("m-link");
    if(!lt)return fine("Manca il titolo.",true);if(!lo)return fine("Manca l'ora.",true);
    if(ll&&!/^https:\/\/\S+$/.test(ll))return fine("Il link deve cominciare con https://",true);
    b.disabled=true;
    return db.rpc("fm_crea_lezione",{p_titolo:lt,p_sottotitolo:val("m-sotto"),p_giorno_settimana:+val("m-gs"),p_ora:lo,p_durata_min:+val("m-durata")||60,p_luogo:val("m-luogo"),p_link:ll,p_pubblica:true,p_dal:val("m-dal")||null}).then(function(r){
      if(r.error)return fine(errore(r.error),true);cache.lezioni=null;
      vMegafono();mostra("#m-ok","Fatto: la lezione compare ogni settimana in Oggi e nel giornale.");
    });
  }
  var testo=val("m-testo"),titolo=val("m-titolo"),link=val("m-link");
  if(!link){var dentro=primoLink(testo);if(dentro){link=dentro;testo=testo.replace(dentro,"").replace(/[ \t]+/g," ").trim();}}
  if(link&&!/^https:\/\/\S+$/.test(link))return fine("Il link deve cominciare con https://",true);
  if(!testo&&!titolo)return fine(link||M.file.length?"Scrivi una didascalia: due parole su cosa si vede o si ascolta.":"Scrivi qualcosa prima.",true);
  if(!testo&&(link||M.file.length))return fine("Scrivi una didascalia: due parole su cosa si vede o si ascolta.",true);
  var riga={persona_id:io.id,contenuto:testo||titolo,tipo:t,visibilita:M.vis,accaduto_il:oggiISO()};
  if(titolo)riga.titolo=titolo.slice(0,120);
  if(t==="festa"){var fg=val("m-data"),fh=val("m-ora");if(fg){riga.accaduto_il=fg;if(fh)riga.inizio_il=new Date(fg+"T"+fh).toISOString();}}
  if(t==="obiettivo"){riga.stadio="in_coda";var en=val("m-entro"),qn=+val("m-quanti");if(en)riga.entro_il=en;if(qn>0)riga.quanti_servono=qn;}
  if(link)riga.link=link;
  if(M.el)riga.elemento=M.el;
  b.disabled=true;b.textContent="Salvo…";
  var prima=db.from("orme").insert(riga).select("id").single();
  /* prima dell'SQL 72 la colonna `link` non c'è: si riprova col link dentro il testo */
  if(link)prima=prima.then(function(r){if(r&&r.error&&/link/i.test(r.error.message||"")&&!/didascalia/.test(r.error.message||"")){delete riga.link;riga.contenuto=(riga.contenuto+"\n"+link).trim();return db.from("orme").insert(riga).select("id").single();}return r;});
  prima.then(function(r){
    if(r.error){b.textContent="Manda";return fine(errore(r.error),true);}
    var id=r.data.id,file=M.file.slice(),male=0;
    if(t==="festa"){db.rpc("fm_prendi_orma",{p_orma:id}).then(function(){},function(){});}
    if(ytId(link))ytChiedi(id);
    return file.reduce(function(fila,f){return fila.then(function(){
      var nome=String(f.name||"file").replace(/[^\w.\-]+/g,"_").slice(-80);
      if(f.size>25*1024*1024){male++;return;}
      return db.storage.from("riservato").upload(id+"/"+nome,f,{contentType:f.type||undefined}).then(function(u){
        if(u&&u.error){male++;console.warn("allegato:",f.name,u.error);M.perche=(u.error.message||"");return;}
        return db.from("orma_file").insert({orma_id:id,nome:nome,indirizzo:id+"/"+nome,dimensione:f.size,chi_lo_ha_messo:io.id,da_conversazione:false}).then(function(q){if(q&&q.error)male++;});
      });
    }).catch(function(){male++;});},Promise.resolve()).then(function(){
      M.file=[];M.msg="";cache.obiettivi=null;vMegafono();
      mostra("#m-ok","Salvato: "+(t==="obiettivo"?"negli obiettivi":"nel giornale di oggi")+", "+({solo_me:"lo leggi solo tu",vicinato:"lo legge il vicinato",pubblico:"lo leggono tutti"})[M.vis]+"."+(male?" "+(male===1?"Un allegato non è passato":male+" allegati non sono passati")+(M.perche?" ("+M.perche+").":"."):""));M.perche="";
    });
  });
}

