/* IL CERVELLO DIGITALE · 19 ott, Gab: «anche alle persone si crea cervello digitale evoluto» · «io ho bisogno di vedere lo stesso layot usato per felicitas, anche per utenti e team»
   · «basta usare un tasto che aggiunge una riga, direttamente sullo schermo». Capitoli e righe nel database (SQL 81). Stessa carta e stesso ordine del Cervello Felicitas: testata, indice, capitoli. */
var LB_CERCHI='<svg class="lb-cerchi" viewBox="0 0 56 56" aria-hidden="true"><circle cx="28" cy="28" r="9" class="on"/><circle cx="28" cy="28" r="17"/><circle cx="28" cy="28" r="25"/><circle cx="28" cy="28" r="3.2" class="punto"/></svg>';
function libro(box,chi){
  if(!box)return;
  var nomiL={};
  function carica(){
    var p1=db.from("cervello_capitoli").select("id,titolo,ordine,aperto_il").eq(chi.campo,chi.id).order("ordine").order("aperto_il");
    var p2=chi.campo==="persona_id"?Promise.resolve(null):db.rpc("fm_cerchio_persone",{p_vicinato:chi.id}).then(function(r){((r&&r.data)||[]).forEach(function(p){nomiL[p.persona_id]=p.nome;});},function(){});
    Promise.all([p1,p2]).then(function(v){
      var r=v[0];if(!document.body.contains(box))return;
      if(!r||r.error){box.innerHTML='<div class="vuoto">Il cervello si apre con l\'SQL 81.</div>';return;}
      var caps=r.data||[],ids=caps.map(function(k){return k.id;});
      (ids.length?db.from("cervello_righe").select("id,capitolo_id,testo,scritta_da,scritta_il,da_correggere").in("capitolo_id",ids).order("scritta_il").then(function(q){
        if(q&&q.error)return db.from("cervello_righe").select("id,capitolo_id,testo,scritta_da,scritta_il").in("capitolo_id",ids).order("scritta_il");return q;}):Promise.resolve({data:[]})).then(function(q){
        var righe=(q&&q.data)||[],rid=righe.map(function(g){return g.id;});
        if(chi.campo==="persona_id"||!rid.length){if(document.body.contains(box))disegnaL(caps,righe,[],{});return;}
        /* commenti e audio sotto ogni riga (SQL 83); se l'83 non c'è, il libro si vede lo stesso, senza commenti */
        db.from("cervello_commenti").select("id,riga_id,testo,audio,scritto_da,scritto_il").in("riga_id",rid).order("scritto_il").then(function(c){
          var com=(c&&!c.error&&c.data)||[],pa=com.filter(function(x){return x.audio;}).map(function(x){return x.audio;});
          (pa.length?db.storage.from("cervello").createSignedUrls(pa,3600).then(function(u){var m={};((u&&u.data)||[]).forEach(function(x){if(x&&x.signedUrl)m[x.path]=x.signedUrl;});return m;},function(){return {};}):Promise.resolve({})).then(function(url){
            if(document.body.contains(box))disegnaL(caps,righe,c&&c.error?null:com,url);});
        },function(){if(document.body.contains(box))disegnaL(caps,righe,null,{});});});
    },function(){box.innerHTML='<div class="vuoto">Il cervello non si legge adesso.</div>';});
  }
  function disegnaL(caps,righe,com,url){
    var per={},cpr={};righe.forEach(function(g){(per[g.capitolo_id]=per[g.capitolo_id]||[]).push(g);});
    (com||[]).forEach(function(x){(cpr[x.riga_id]=cpr[x.riga_id]||[]).push(x);});
    function quando(t){return esc(new Date(t).toLocaleDateString("it-IT",{day:"numeric",month:"long"}));}
    function commenti(g){if(!com)return '';
      return '<div class="lb-com">'+(cpr[g.id]||[]).map(function(x){
        return '<div class="lb-c">'+(x.testo?'<p>'+esc(x.testo)+'</p>':'')+(x.audio&&url[x.audio]?'<audio controls preload="none" src="'+esc(url[x.audio])+'"></audio>':'')+
          '<small>'+quando(x.scritto_il)+(nomiL[x.scritto_da]?' · '+esc(nomiL[x.scritto_da]):'')+(x.scritto_da===io.id?' · <button class="lb-togli" data-togli-c="'+x.id+'">togli</button>':'')+'</small></div>';}).join("")+
        '<div data-cbox="'+g.id+'"><button class="lb-commenta" data-commenta="'+g.id+'">Commenta · scrivi o registra un audio</button></div></div>';}
    var sq=chi.campo!=="persona_id";
    box.innerHTML='<div class="libro">'+
      '<header class="lb-testa"><p class="lb-occ">'+esc(chi.occ)+'</p><h1>'+esc(chi.titolo)+'</h1>'+(chi.apertura||'')+'</header>'+
      (caps.length?'<nav class="lb-indice" aria-label="Indice"><h2>Indice</h2><ol>'+caps.map(function(k){var n=(per[k.id]||[]).length;
        return '<li><button data-vai-cap="'+k.id+'">'+esc(k.titolo)+'</button><small>'+(n===1?'1 riga':n+' righe')+'</small></li>';}).join("")+'</ol></nav>':'')+
      caps.map(function(k,i){
        return '<section class="lb-passo" id="cap-'+k.id+'">'+LB_CERCHI+'<div class="lb-corpo"><p class="lb-occ">Capitolo '+(i+1)+'</p><h2>'+esc(k.titolo)+'</h2>'+
          '<div class="lb-righe">'+(per[k.id]||[]).map(function(g){
            return '<div class="lb-riga"><p>'+esc(g.testo)+'</p><small>'+esc(new Date(g.scritta_il).toLocaleDateString("it-IT",{day:"numeric",month:"long"}))+
              (sq&&nomiL[g.scritta_da]?' · '+esc(nomiL[g.scritta_da]):'')+(g.scritta_da===io.id?' · <button class="lb-togli" data-togli="'+g.id+'">togli</button>':'')+'</small>'+(sq?corrTasto(g):'')+commenti(g)+'</div>';}).join("")+'</div>'+
          '<div class="lb-nuova" data-box="'+k.id+'"><button class="mini oro" data-riga="'+k.id+'">+ Aggiungi una riga</button></div></div></section>';}).join("")+
      '<section class="lb-passo lb-apri">'+LB_CERCHI+'<div class="lb-corpo"><p class="lb-occ">'+(caps.length?'Capitolo '+(caps.length+1):'Il primo capitolo')+'</p>'+
        '<div class="modulo"><label for="lb-tit">Titolo del capitolo</label><input type="text" id="lb-tit" maxlength="200">'+
        '<div class="azioni"><button class="btn pieno" id="lb-apri">Apri il capitolo</button><span class="m" id="lb-esito"></span></div></div></div></section>'+
    '</div>';
    box.querySelectorAll("[data-vai-cap]").forEach(function(b){b.onclick=function(){var s=document.getElementById("cap-"+b.getAttribute("data-vai-cap"));if(s)s.scrollIntoView({behavior:"smooth"});};});
    box.querySelectorAll("[data-riga]").forEach(function(b){b.onclick=function(){
      var id=b.getAttribute("data-riga"),w=box.querySelector('[data-box="'+id+'"]');
      w.innerHTML='<textarea aria-label="Nuova riga" maxlength="4000"></textarea><div class="azioni"><button class="btn pieno">Salva</button><button class="btn">Annulla</button></div>';
      var t=w.querySelector("textarea"),bs=w.querySelectorAll("button");t.focus();
      bs[1].onclick=function(){disegnaL(caps,righe,com,url);};
      bs[0].onclick=function(){var s=t.value.trim();if(!s)return;bs[0].disabled=true;
        db.from("cervello_righe").insert({capitolo_id:id,testo:s}).then(function(r){if(r&&r.error){bs[0].disabled=false;w.insertAdjacentHTML("beforeend",'<p class="nota">'+esc(errore(r.error))+'</p>');return;}carica();},function(){bs[0].disabled=false;});};};});
    box.querySelectorAll("[data-togli-c]").forEach(function(b){b.onclick=function(){b.disabled=true;
      db.from("cervello_commenti").delete().eq("id",b.getAttribute("data-togli-c")).then(function(){carica();},function(){b.disabled=false;});};});
    box.querySelectorAll("[data-commenta]").forEach(function(b){b.onclick=function(){commentaBox(b.getAttribute("data-commenta"));};});
    corrLega(box);
    box.querySelectorAll("[data-togli]").forEach(function(b){b.onclick=function(){b.disabled=true;
      db.from("cervello_righe").delete().eq("id",b.getAttribute("data-togli")).then(function(){carica();},function(){b.disabled=false;});};});
    $("#lb-apri").onclick=function(){var b=this,t=$("#lb-tit").value.trim();if(!t){$("#lb-esito").textContent="Il titolo serve.";return;}b.disabled=true;
      var riga={titolo:t,ordine:caps.length};riga[chi.campo]=chi.id;
      db.from("cervello_capitoli").insert(riga).then(function(r){if(r&&r.error){b.disabled=false;$("#lb-esito").textContent=errore(r.error);return;}carica();},function(){b.disabled=false;});};
  }
  /* il commento: testo, audio registrato o file audio, o tutti e due. L'audio va nello spazio «cervello» (SQL 83), in una cartella col numero del commento. */
  function commentaBox(rid){
    var w=box.querySelector('[data-cbox="'+rid+'"]'),C={file:null,rec:null};
    function disegna(){
      w.innerHTML='<div class="lb-cnuovo"><textarea aria-label="Commento" maxlength="4000" placeholder="Il commento"></textarea>'+
        '<div class="azioni"><button class="mini'+(C.rec?' oro':'')+'" data-a="reg">'+(C.rec?'■ Ferma la registrazione':'● Registra un audio')+'</button>'+
        '<label class="mini">Scegli un file audio<input type="file" accept="audio/*" class="file"></label></div>'+
        (C.file?'<p class="nota">Audio pronto: '+esc(C.file.name||"vocale")+' · <button class="lb-togli" data-a="via">togli</button></p>':'')+
        '<div class="azioni"><button class="btn pieno" data-a="ok">Salva</button><button class="btn" data-a="no">Annulla</button><span class="m" data-a="esito"></span></div></div>';
      var t=w.querySelector("textarea");if(C.testo)t.value=C.testo;t.oninput=function(){C.testo=t.value;};
      w.querySelector('input[type=file]').onchange=function(){if(this.files[0]){C.file=this.files[0];disegna();}};
      w.querySelector('[data-a="reg"]').onclick=registraC;
      var via=w.querySelector('[data-a="via"]');if(via)via.onclick=function(){C.file=null;disegna();};
      w.querySelector('[data-a="no"]').onclick=function(){if(C.rec)C.rec.stop();carica();};
      w.querySelector('[data-a="ok"]').onclick=salvaC;
    }
    function registraC(){
      if(C.rec){C.rec.stop();return;}
      if(!navigator.mediaDevices||!window.MediaRecorder){w.querySelector('[data-a="esito"]').textContent="Il microfono qui non si apre: si può scegliere un file audio.";return;}
      navigator.mediaDevices.getUserMedia({audio:true}).then(function(st){
        var pezzi=[];C.rec=new MediaRecorder(st);
        C.rec.ondataavailable=function(e){if(e.data.size)pezzi.push(e.data);};
        C.rec.onstop=function(){var tipo=(C.rec.mimeType||"audio/webm").split(";")[0],est=/mp4/.test(tipo)?"m4a":/ogg/.test(tipo)?"ogg":"webm",n="vocale."+est;
          try{C.file=new File(pezzi,n,{type:tipo});}catch(e){C.file=new Blob(pezzi,{type:tipo});C.file.name=n;}
          st.getTracks().forEach(function(x){x.stop();});C.rec=null;disegna();};
        C.rec.start();disegna();
      }).catch(function(){w.querySelector('[data-a="esito"]').textContent="Il microfono qui non si apre: si può scegliere un file audio.";});
    }
    function salvaC(){
      var b=w.querySelector('[data-a="ok"]'),e=w.querySelector('[data-a="esito"]'),t=(C.testo||"").trim();
      if(!t&&!C.file){e.textContent="Scrivi qualcosa o aggiungi un audio.";return;}
      if(C.file&&C.file.size>25*1024*1024){e.textContent="L'audio è troppo grande: al massimo 25 MB.";return;}
      b.disabled=true;e.textContent="Un momento…";
      var id=(window.crypto&&crypto.randomUUID)?crypto.randomUUID():null;
      var nome=C.file?String(C.file.name||"vocale").replace(/[^\w.\-]+/g,"-"):null,riga={riga_id:rid,testo:t||null};
      if(id)riga.id=id;if(C.file&&id)riga.audio=id+"/"+nome;
      db.from("cervello_commenti").insert(riga).then(function(r){
        if(r&&r.error){b.disabled=false;e.textContent=errore(r.error);return;}
        if(!riga.audio){carica();return;}
        db.storage.from("cervello").upload(riga.audio,C.file,{contentType:C.file.type||undefined}).then(function(u){
          if(u&&u.error){db.from("cervello_commenti").update({audio:null}).eq("id",id).then(function(){},function(){});e.textContent="Il commento è salvato, l'audio no: "+errore(u.error);b.disabled=false;return;}
          carica();},function(){b.disabled=false;e.textContent="L'audio non è partito.";});
      },function(){b.disabled=false;e.textContent="Non è partito.";});
    }
    disegna();w.querySelector("textarea").focus();
  }
  box.innerHTML='<p class="nota">Un momento…</p>';
  carica();
}
