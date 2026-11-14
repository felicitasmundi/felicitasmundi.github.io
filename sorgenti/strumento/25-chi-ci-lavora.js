/* CHI CI LAVORA · SQL 94 (thread «Giornale e logistica insieme»)
   20 ott 23:51, Gab: «quando potrò vedere anche il riferimento dei team sotto gli articoli con le task e lo sviluppo?» · 23:52 «ok94».
   Sotto ogni articolo le righe del registro legate, coi permessi di chi guarda. Lega una riga chi l'ha scritta, il nucleo o chi coordina.
   Senza l'SQL 94, o per chi non è entrato, il riquadro non compare. */
function g4Lavora(){return; /* 8/11 Gab: tolto dal Giornale */
  var box=[].slice.call(document.querySelectorAll("[data-lavora]"));if(!io.id||!db||!box.length)return;
  var ids=box.map(function(e){return e.getAttribute("data-lavora");});
  var puoi=io.nucleo||io.coordina;
  Promise.all([
    db.rpc("fm_giornale_registro",{p_articoli:ids}).then(function(r){return r&&!r.error?(r.data||[]):null;},function(){return null;}),
    db.from("registro").select("id,testo,tipo,stato,scritto_da,articolo_id").is("articolo_id",null).or("stato.is.null,stato.neq.annullato").order("scritto_il",{ascending:false}).limit(40).then(function(r){return r&&!r.error?(r.data||[]):[];},function(){return [];})
  ]).then(function(v){
    var righe=v[0];if(righe===null)return;
    var libere=v[1].filter(function(g){return puoi||g.scritto_da===io.id;});
    leggiNomi(righe.map(function(g){return g.preso_da;}).filter(Boolean)).then(function(){
      box.forEach(function(e){if(!e.isConnected)return;var id=e.getAttribute("data-lavora");
        var mie=righe.filter(function(g){return g.articolo_id===id;});
        if(!mie.length&&!libere.length){e.hidden=true;return;}
        var fatte=mie.filter(function(g){return g.stato==="fatto";}).length,conStato=mie.filter(function(g){return g.stato;}).length;
        e.innerHTML='<p class="g4-occ">Chi ci lavora</p>'+
          (conStato?'<p class="m">'+fatte+' di '+conStato+' fatti</p><div class="barra-ob"><i style="width:'+Math.round(100*fatte/conStato)+'%"></i></div>':'')+
          (mie.length?mie.map(function(g){
            return '<div class="g4-lr"><span class="t">'+esc(g.testo)+'</span><div class="rg-meta">'+
              (g.stato?'<span class="chip '+(REG_STATO_C[g.stato]||"")+'">'+esc(REG_STATO[g.stato]||g.stato)+'</span>':'<span class="chip">'+esc(REG_TIPO[g.tipo]||g.tipo)+'</span>')+
              (g.ruolo?'<span class="chip">'+esc(regNomeRuolo(g.ruolo))+'</span>':g.funzione?'<span class="chip">'+esc(FUNZIONI[g.funzione]||g.funzione)+'</span>':'')+
              (g.stato==="preso"&&g.preso_da&&nomi[g.preso_da]?'<span class="m">preso da '+esc(nomi[g.preso_da])+'</span>':'')+(g.stato==="fatto"&&g.fatto_il?'<span class="m">fatto il '+esc(new Date(g.fatto_il).toLocaleDateString("it-IT",{day:"numeric",month:"long"}))+'</span>':'')+
              (g.entro_il?'<span class="m">entro il '+esc(new Date(g.entro_il).toLocaleDateString("it-IT",{day:"numeric",month:"long"}))+'</span>':'')+
              (g.prossimo?'<span class="m">poi: '+esc(g.prossimo)+'</span>':'')+'</div></div>';}).join(""):'<p class="m">Ancora nessuna riga del registro legata a questo articolo.</p>')+
          (libere.length?'<details class="rg-altro"><summary>Lega una riga del registro</summary><div class="azioni" style="margin-top:6px"><select class="g4-lega" aria-label="Riga del registro da legare"><option value="">scegli…</option>'+
            libere.map(function(g){return '<option value="'+esc(g.id)+'">'+esc(String(g.testo).slice(0,80))+'</option>';}).join("")+'</select><button class="mini oro">Lega</button></div></details>':'');
        e.hidden=false;
        var bt=e.querySelector(".g4-lega+button");if(bt)bt.onclick=function(){var s=e.querySelector(".g4-lega");if(!s.value)return;bt.disabled=true;
          db.rpc("fm_registro_articolo",{p_riga:s.value,p_articolo:id}).then(function(r){bt.disabled=false;if(r&&r.error){alert(errore(r.error));return;}g4Lavora();},function(){bt.disabled=false;});};
      });
    });
  });
}
function g4Riempi(da,a,questo){
  g4Sale();
  function ok(){return vista==="giornale"&&giorno===questo;}
  lezioni().then(function(l){var d=$("#g4-date");if(ok()&&d)d.innerHTML='<div class="g4-occ">Le date</div>'+g4Date(l);});
  if(!db)return;
  /* la puntata radio: l'ultima diretta fino a questo giorno */
  db.from("orme").select(CAMPI+",link").eq("tipo","diretta").lt("momento",new Date(a).toISOString()).order("momento",{ascending:false}).limit(1).then(function(r){
    var o=r&&!r.error&&r.data&&r.data[0];if(!o||!ok())return;
    var au=(o.orma_file||[]).filter(function(f){return /audio/.test(f.tipo||"")||/\.(m4a|mp3|ogg|webm|wav|aac)$/i.test(f.nome||"");});
    return firmaURL(au).then(function(fm){if(!ok())return;var u=au.length&&fm[au[0].indirizzo];
      var onda='<div class="g4-onda" aria-hidden="true">'+[30,60,45,90,70,40,80,55,35,75,50,65,30,85,45,60].map(function(h){return '<i style="height:'+h+'%"></i>';}).join("")+'</div>';
      $("#g4-radio").innerHTML='<div class="g4-t g4-radio g4-sale"><div class="in"><div class="g4-occ">Radio Felicitas · '+esc(new Date(o.inizio_il||o.momento).toLocaleDateString("it-IT",{day:"numeric",month:"long"}))+'</div>'+
        (o.titolo?'<h2>'+esc(o.titolo)+'</h2>':'')+(o.contenuto?'<p>'+esc(String(o.contenuto).slice(0,600))+'</p>':'')+onda+
        (u?'<audio controls preload="none" src="'+esc(u)+'"></audio>':'')+
        '<a class="g4-tasto" href="diretta-bozza.html?puntata='+encodeURIComponent(o.id)+'&c=10182300">▶ Ascolta</a>'+visCanc(o)+'</div></div>';legaVis($("#g4-radio"));g4Sale();});
  },function(){});
  /* il Festival: cosa serve, dagli articoli pubblici del Festival (SQL 76) */
  if($("#g4-serve"))db.from("orme").select("id").eq("tipo","articolo").eq("visibilita","pubblico").eq("orma_madre_id",FEST_ID).limit(5).then(function(r){
    var ids=((r&&!r.error&&r.data)||[]).map(function(x){return x.id;});if(!ids.length)return;
    return Promise.all(ids.map(function(id){return db.rpc("fm_giornale_compiti_fuori",{p_articolo:id}).then(function(x){return (x&&!x.error&&x.data)||[];},function(){return [];});})).then(function(v){
      if(!ok())return;var tutti=[].concat.apply([],v),fatti=tutti.filter(function(c){return c.stato==="fatto";}),servono=tutti.filter(function(c){return c.stato==="da_prendere";});
      if(!tutti.length)return;
      var F=$("#g4-fatti"),S=$("#g4-servono"),C=$("#g4-serve");
      F.querySelector("b").textContent=fatti.length;F.hidden=false;S.querySelector("b").textContent=servono.length;S.hidden=false;
      if(servono.length){C.hidden=false;C.insertAdjacentHTML("beforeend",servono.slice(0,5).map(function(c){
        return '<div class="g4-cp"><span>'+esc(c.titolo)+'<small>'+esc([c.luogo,c.entro_il?"entro il "+new Date(c.entro_il).toLocaleDateString("it-IT",{day:"numeric",month:"long"}):""].filter(Boolean).join(" · "))+'</small></span>'+
          (io.id?'<button class="g4-mini" data-mano="'+esc(c.id)+'">Do una mano</button>':'<a class="g4-mini" href="'+ENTRA+'">Do una mano</a>')+'</div>';}).join(""));
        C.querySelectorAll("[data-mano]").forEach(function(b){b.onclick=function(){b.disabled=true;
          db.rpc("fm_compito_do_una_mano",{p_compito:b.getAttribute("data-mano")}).then(function(x){if(x&&x.error){alert(errore(x.error));b.disabled=false;return;}b.textContent="✓";},function(){b.disabled=false;});};});}
    });
  },function(){});
  /* 7/11 · palinsesto: si vede se almeno una card ha contenuti; toccando una card si aprono i suoi contenuti (orme.voce) */
  if(db)db.from("orme").select("voce").in("voce",VOCI_G4.map(function(v){return v[0];})).limit(1000).then(function(r){
    if(!ok()||!r||r.error)return;var n={};(r.data||[]).forEach(function(x){n[x.voce]=(n[x.voce]||0)+1;});
    var PB=$("#g4-palb");if(!PB)return;PB.hidden=!(r.data||[]).length;
    PB.querySelectorAll("[data-voce]").forEach(function(t){var k=t.getAttribute("data-voce");if(!n[k])return;t.style.cursor="pointer";t.setAttribute("role","button");t.tabIndex=0;
      t.onclick=function(){g4Voce(k,t);};});
  },function(){});
  /* palinsesto e «dall'ultima volta» (SQL 77): l'ultima visita si legge una volta sola a ogni apertura dell'app */
  var entro=g4Entro!==undefined?Promise.resolve(g4Entro):io.id?db.rpc("fm_giornale_entro").then(function(x){g4Entro=x&&!x.error?(x.data||null):null;return g4Entro;},function(){g4Entro=null;return null;}):Promise.resolve(null);
  entro.then(function(dal){return db.rpc("fm_giornale_voci_mosse",{p_dal:dal}).then(function(x){
    if(!ok()||!x||x.error||!x.data)return;var tot=0,m={};x.data.forEach(function(v){m[v.voce]=+v.nuove||0;tot+=m[v.voce];});
    document.querySelectorAll("#g4-pal [data-voce]").forEach(function(t){var n=m[t.getAttribute("data-voce")]||0;
      t.classList.toggle("ferma",!n);t.insertAdjacentHTML(n?"afterbegin":"beforeend",n?'<span class="g4-bollo">'+n+(n===1?" novità":" novità")+'</span>':'<p>niente di nuovo</p>');});
    var M=$("#g4-mosse");if(io.id&&dal&&tot&&M){M.innerHTML="Dall'ultima volta che sei entrato "+(tot===1?"si è mossa <b>1 cosa</b>.":"si sono mosse <b>"+tot+" cose</b>.");M.hidden=false;}
  });},function(){});
}
function g4Voce(k,t){
  var L=$("#g4-pal-lista");if(!L)return;
  if(L.getAttribute("data-voce")===k){L.removeAttribute("data-voce");L.innerHTML="";return;}
  L.setAttribute("data-voce",k);var nome=(VOCI_G4.filter(function(v){return v[0]===k;})[0]||[k,k])[1];
  L.innerHTML='<div class="g4-t" style="margin-top:10px"><div class="in"><div class="g4-occ">'+esc(nome)+'</div><p class="nota">Un momento…</p></div></div>';
  db.from("orme").select("id,titolo,contenuto,link,momento").eq("voce",k).order("momento",{ascending:false}).limit(30).then(function(r){
    if(L.getAttribute("data-voce")!==k)return;var l=(r&&!r.error&&r.data)||[];
    L.querySelector(".in").innerHTML='<div class="g4-occ">'+esc(nome)+'</div>'+l.map(function(o){
      return '<div class="g4-vo" style="margin:12px 0 0">'+(o.titolo?'<h3 style="margin:0 0 4px">'+esc(o.titolo)+'</h3>':'')+linkHTML(o.link)+
        (o.contenuto&&o.contenuto!==o.link?'<p style="margin:6px 0 0">'+esc(o.contenuto).replace(/\n/g,"<br>")+'</p>':'')+'</div>';}).join("");
    L.scrollIntoView({behavior:"smooth",block:"start"});
  },function(){});
}
/* 7/11 · il video di oggi in cima al Giornale (SQL 199) · 8/11 Gab 09:14 «il metti video, mi dovrebbe permettere anche di inserire un file audio e un testo descrittivo.. l inserimento dovrebbe mandare autonomamente su una voce dell indice collegara» · 09:16 «potrei scegliere io la voce dell indice» · «il video in alto, potrebbe essere sostituito dalle dirette pubbliche, e poi al termine della diretta torna il video» (SQL 212) */
var g4CimaT=null;
document.addEventListener("visibilitychange",function(){if(!document.hidden&&vista==="giornale"&&$("#g4-oggi")&&!$("#g4-cima-f"))g4VideoOggi();});
function g4VideoOggi(){
  var B=$("#g4-oggi");if(!B||!db)return;clearTimeout(g4CimaT);
  var vid=db.from("giornale_video").select("id,link,audio,testo,capitolo_id,riga_id,link_titolo,link_canale,titolo_corretto,link_descrizione").order("messo_il",{ascending:false}).limit(1).then(function(r){
    if(r&&r.error)return db.from("giornale_video").select("id,link,audio,testo,capitolo_id,riga_id,link_titolo,link_canale,titolo_corretto").order("messo_il",{ascending:false}).limit(1);return r;}).then(function(r){
    if(r&&r.error)return db.from("giornale_video").select("link,audio,testo,capitolo_id,riga_id").order("messo_il",{ascending:false}).limit(1);return r;}).then(function(r){
    if(r&&r.error)return db.from("giornale_video").select("link,audio,testo,capitolo_id").order("messo_il",{ascending:false}).limit(1);return r;}).then(function(r){
    if(r&&r.error)return db.from("giornale_video").select("link").order("messo_il",{ascending:false}).limit(1);return r;});
  var dir=db.rpc("fm_dirette_in_onda").then(function(r){var ora=Date.now();return ((r&&!r.error&&r.data)||[]).filter(function(d){return d.inizio_il&&new Date(d.inizio_il).getTime()<=ora;})[0]||null;},function(){return null;});
  /* SQL 220: dirette YouTube seguite (le aggiorna il db ogni 5 minuti) */
  var ytd=db.from("giornale_dirette_youtube").select("video,titolo,in_onda").eq("in_onda",true).limit(1).then(function(r){return (r&&!r.error&&r.data&&r.data[0]&&ytId("https://youtu.be/"+r.data[0].video))?r.data[0]:null;},function(){return null;});
  Promise.all([vid,dir,ytd]).then(function(v){
    var B=$("#g4-oggi");if(!B||$("#g4-cima-f"))return;var r=v[0],d=v[1],yl=v[2];
    var x=(r&&!r.error&&r.data&&r.data[0])||{},y=ytId(x.link);
    var tasto=io.nucleo?'<div id="g4-oggi-c" style="margin:0 0 14px"><button type="button" class="mini" id="g4-oggi-b">Metti in cima</button> <button type="button" class="mini" id="g4-oggi-dc">Dal Cervello</button></div>':'';
    if(d){B.innerHTML='<a class="sp-diretta" href="diretta-bozza.html?puntata='+encodeURIComponent(d.id)+'" style="display:flex;gap:10px;align-items:center;margin:0 0 14px;padding:16px;border:1px solid var(--oro,#D4AF6A);border-radius:18px;text-decoration:none;color:inherit"><span style="color:#ff6b6b;font-weight:600">● in onda</span><span>'+esc(d.titolo||"")+'</span><b style="margin-left:auto">Entra ›</b></a>'+tasto;}
    else if(yl){B.innerHTML='<p style="margin:0 0 8px"><span style="color:#ff6b6b;font-weight:600">● in onda</span>'+(yl.titolo?' · '+esc(yl.titolo):'')+'</p>'+
      '<div class="video" style="margin:0 0 14px"><iframe src="https://www.youtube-nocookie.com/embed/'+ytId("https://youtu.be/"+yl.video)+'" title="'+esc(yl.titolo||"diretta")+'" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen loading="lazy"></iframe></div>'+tasto;}
    else{var tit=x.link_titolo||"";
      B.innerHTML=(y?'<div class="video" style="margin:0 0 10px"><iframe src="https://www.youtube-nocookie.com/embed/'+y+'" title="video" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen loading="lazy"></iframe></div>':'')+
      (y&&(tit||io.nucleo)&&x.id?'<div id="g4-oggi-yt" style="margin:0 0 10px">'+(tit?'<p style="margin:0;font-size:18px"><b>'+esc(tit)+'</b>'+(x.link_canale?' · '+esc(x.link_canale):'')+'</p>':'')+
        (io.nucleo?'<button type="button" class="mini" id="g4-oggi-ct" style="margin-top:6px">Correggi titolo</button>':'')+'</div>':'')+
      '<div id="g4-oggi-f"></div><div id="g4-oggi-a"></div>'+((x.testo||x.link_descrizione)?'<div id="g4-oggi-t" style="margin:0 0 6px">'+g4Desc(x.testo||x.link_descrizione)+'</div>':'')+'<p class="nota" id="g4-oggi-v" style="margin:0 0 14px" hidden></p>'+
      '<div id="g4-pass" style="margin:0 0 14px"><button type="button" class="mini" id="g4-pass-b">Video passati</button><div id="g4-pass-l"></div></div>'+tasto;
      if(x.audio&&io.id)db.storage.from("chat").createSignedUrl(x.audio,3600).then(function(u){var A=$("#g4-oggi-a");if(A&&u&&u.data&&u.data.signedUrl)A.innerHTML='<audio controls preload="none" src="'+esc(u.data.signedUrl)+'" style="width:100%;margin:0 0 10px"></audio>';},function(){});
      if(x.riga_id&&io.id)db.from("cervello_righe").select("foto").eq("id",x.riga_id).maybeSingle().then(function(q){var ft=q&&q.data&&q.data.foto;if(!ft)return;
        return db.storage.from("chat").createSignedUrl(ft,3600).then(function(u){var Fo=$("#g4-oggi-f");if(Fo&&u&&u.data&&u.data.signedUrl)Fo.innerHTML='<img class="foto" src="'+esc(u.data.signedUrl)+'" alt="" style="margin:0 0 10px">';});}).catch(function(){});
      if(x.capitolo_id)db.from("cervello_capitoli").select("titolo").eq("id",x.capitolo_id).maybeSingle().then(function(c){var V=$("#g4-oggi-v");if(V&&c&&c.data&&c.data.titolo){V.textContent=c.data.titolo;V.hidden=false;}},function(){});}
    var ct=$("#g4-oggi-ct");if(ct)ct.onclick=function(){clearTimeout(g4CimaT);var W=$("#g4-oggi-yt");
      W.innerHTML='<div id="g4-cima-f" style="display:flex;flex-direction:column;gap:8px"><label for="g4-ct-t">Titolo</label><input type="text" id="g4-ct-t" maxlength="300" style="font-size:18px;padding:10px 12px;border-radius:12px">'+
        '<div style="display:flex;gap:10px"><button type="button" class="btn" id="g4-ct-s">Salva</button><button type="button" class="mini" id="g4-ct-x">Annulla</button></div><p class="nota" id="g4-ct-e" aria-live="polite"></p></div>';
      $("#g4-ct-t").value=x.link_titolo||"";$("#g4-ct-t").focus();
      $("#g4-ct-x").onclick=function(){var f=$("#g4-cima-f");if(f)f.remove();g4VideoOggi();};
      $("#g4-ct-s").onclick=function(){var s2=this,e=$("#g4-ct-e");s2.disabled=true;e.textContent="Un momento…";
        db.rpc("fm_giornale_video_titolo",{p_id:x.id,p_titolo:$("#g4-ct-t").value.trim()}).then(function(q){if(q&&q.error){s2.disabled=false;e.textContent=(q.error.message&&!/PGRST|function|schema/i.test(q.error.message))?q.error.message:errore(q.error);return;}
          var f=$("#g4-cima-f");if(f)f.remove();g4VideoOggi();},function(z){s2.disabled=false;e.textContent=errore(z);});};};
    var pb=$("#g4-pass-b");if(pb)pb.onclick=function(){g4Passati(x.id);};
    var b=$("#g4-oggi-b");if(b)b.onclick=g4CimaForm;
    var bc=$("#g4-oggi-dc");if(bc)bc.onclick=g4DalCervello;
    g4CimaT=setTimeout(function(){if(vista==="giornale"&&$("#g4-oggi")&&!$("#g4-cima-f"))g4VideoOggi();},60000);
  },function(){});
}
/* 8/11 · Dal Cervello al Giornale (SQL 213): una card scelta va in cima o tra gli articoli di oggi, per i vicinati o per tutti */
function g4DalCervello(){
  var w=$("#g4-oggi-c");if(!w)return;clearTimeout(g4CimaT);
  var sel='font-size:18px;padding:10px 12px;border-radius:12px';
  w.innerHTML='<div id="g4-cima-f" style="display:flex;flex-direction:column;gap:8px">'+
    '<label for="g4-dc-v">Voce dell\'indice</label><select id="g4-dc-v" style="'+sel+'"><option value="">Un momento…</option></select>'+
    '<div id="g4-dc-c" style="display:flex;flex-direction:column;gap:6px"></div>'+
    '<fieldset style="border:0;padding:0;margin:0;display:flex;gap:14px;flex-wrap:wrap"><legend style="margin-bottom:4px">Dove</legend><label><input type="radio" name="g4-dc-d" value="cima" checked> In cima</label><label><input type="radio" name="g4-dc-d" value="articolo"> Tra gli articoli di oggi</label></fieldset>'+
    '<fieldset style="border:0;padding:0;margin:0;display:flex;gap:14px;flex-wrap:wrap"><legend style="margin-bottom:4px">Per chi</legend><label><input type="radio" name="g4-dc-p" value="vicinato" checked> Vicinati</label><label><input type="radio" name="g4-dc-p" value="pubblico"> Tutti</label></fieldset>'+
    '<div style="display:flex;gap:10px"><button type="button" class="btn" id="g4-dc-s">Porta nel Giornale</button><button type="button" class="mini" id="g4-dc-x">Annulla</button></div><p class="nota" id="g4-dc-e" aria-live="polite"></p></div>';
  db.rpc("fm_cervello_indice").then(function(r){var S=$("#g4-dc-v");if(!S)return;var l=(r&&!r.error&&r.data)||[],per={},ord=[];
    l.forEach(function(c){var k=c.sezione_nome||"Altre voci";if(!per[k]){per[k]=[];ord.push([k,c.sezione_ordine||99]);}per[k].push(c);});
    ord.sort(function(a,b){return a[1]-b[1];});
    S.innerHTML='<option value="">scegli la voce…</option>'+ord.map(function(o){return '<optgroup label="'+esc(o[0])+'">'+per[o[0]].map(function(c){return '<option value="'+esc(c.id)+'">'+Array((c.profondita||0)+1).join("— ")+esc(c.titolo)+'</option>';}).join("")+'</optgroup>';}).join("");
  },function(){});
  $("#g4-dc-v").onchange=function(){var C=$("#g4-dc-c"),cap=this.value;C.innerHTML=cap?'<p class="nota">Un momento…</p>':'';if(!cap)return;
    db.from("cervello_righe").select("id,testo").eq("capitolo_id",cap).order("scritta_il").then(function(q){if($("#g4-dc-v").value!==cap)return;var l=(q&&!q.error&&q.data)||[];
      C.innerHTML=l.length?'<p style="margin:0">Card</p>'+l.map(function(g){var t=String(g.testo||"").trim(),h=t.split("\n")[0],rest=t.slice(h.length).trim();
        return '<label style="display:flex;gap:10px;align-items:flex-start;padding:10px;border:1px solid rgba(212,175,106,.35);border-radius:12px"><input type="radio" name="g4-dc-r" value="'+esc(g.id)+'" style="margin-top:5px"><span><b>'+esc(h.slice(0,120))+'</b>'+(rest?'<br><small>'+esc(rest.slice(0,160))+(rest.length>160?"…":"")+'</small>':'')+'</span></label>';}).join(""):'<p class="nota">Questa voce non ha ancora card.</p>';},function(){C.innerHTML='<p class="nota">Le card non si leggono adesso.</p>';});};
  $("#g4-dc-x").onclick=function(){var f=$("#g4-cima-f");if(f)f.remove();g4VideoOggi();};
  $("#g4-dc-s").onclick=function(){var s=this,e=$("#g4-dc-e"),rg=document.querySelector('input[name="g4-dc-r"]:checked'),dv=document.querySelector('input[name="g4-dc-d"]:checked'),pv=document.querySelector('input[name="g4-dc-p"]:checked');
    if(!rg){e.textContent="Scegli una card.";return;}
    s.disabled=true;e.textContent="Un momento…";
    db.rpc("fm_giornale_dal_cervello",{p_riga:rg.value,p_dove:dv.value,p_vis:pv.value}).then(function(r){if(r&&r.error){s.disabled=false;e.textContent=errore(r.error);return;}
      var f=$("#g4-cima-f");if(f)f.remove();vGiornale();},function(x){s.disabled=false;e.textContent=errore(x);});};
}
function g4CimaForm(){
  var w=$("#g4-oggi-c");if(!w)return;clearTimeout(g4CimaT);
  w.innerHTML='<div id="g4-cima-f" style="display:flex;flex-direction:column;gap:8px">'+
    '<label for="g4-cima-g">Giorno</label><input type="date" id="g4-cima-g" style="font-size:18px;padding:10px 12px;border-radius:12px">'+
    '<label for="g4-cima-l">Link YouTube</label><input type="url" id="g4-cima-l" placeholder="https://www.youtube.com/…" style="font-size:18px;padding:10px 12px;border-radius:12px">'+
    '<div id="g4-cima-oggi" style="display:flex;flex-direction:column;gap:8px">'+
    '<label for="g4-cima-au">oppure un file audio</label><input type="file" id="g4-cima-au" accept="audio/*">'+
    '<label for="g4-cima-t">Testo che lo descrive</label><textarea id="g4-cima-t" rows="4" maxlength="4000" style="font-size:18px;padding:10px 12px;border-radius:12px"></textarea>'+
    '<label for="g4-cima-v">Voce dell\'indice</label><select id="g4-cima-v" style="font-size:18px;padding:10px 12px;border-radius:12px"><option value="">Un momento…</option></select></div>'+
    '<div style="display:flex;gap:10px"><button type="button" class="btn" id="g4-cima-s">Metti in cima</button><button type="button" class="mini" id="g4-cima-x">Annulla</button></div><p class="nota" id="g4-cima-e" aria-live="polite"></p><div id="g4-prog"></div></div>';
  var oggiG=g4Oggi();$("#g4-cima-g").value=oggiG;$("#g4-cima-g").min=oggiG;
  $("#g4-cima-g").onchange=function(){var altro=this.value&&this.value!==oggiG;$("#g4-cima-oggi").hidden=altro;$("#g4-cima-s").textContent=altro?"Programma":"Metti in cima";};
  g4Programmati();
  db.rpc("fm_cervello_indice").then(function(r){var S=$("#g4-cima-v");if(!S)return;var l=(r&&!r.error&&r.data)||[],per={},ord=[];
    l.forEach(function(c){var k=c.sezione_nome||"Altre voci";if(!per[k]){per[k]=[];ord.push([k,c.sezione_ordine||99]);}per[k].push(c);});
    ord.sort(function(a,b){return a[1]-b[1];});
    S.innerHTML='<option value="">scegli la voce…</option>'+ord.map(function(o){return '<optgroup label="'+esc(o[0])+'">'+per[o[0]].map(function(c){return '<option value="'+esc(c.id)+'">'+Array((c.profondita||0)+1).join("— ")+esc(c.titolo)+'</option>';}).join("")+'</optgroup>';}).join("");
  },function(){});
  $("#g4-cima-x").onclick=function(){var f=$("#g4-cima-f");if(f)f.remove();g4VideoOggi();};
  $("#g4-cima-s").onclick=function(){var s=this,e=$("#g4-cima-e"),link=$("#g4-cima-l").value.trim(),fl=$("#g4-cima-au").files[0],t=$("#g4-cima-t").value.trim(),cap=$("#g4-cima-v").value;
    var gg=$("#g4-cima-g").value||oggiG;
    if(gg!==oggiG){if(!link){e.textContent="Metti il link YouTube.";return;}
      s.disabled=true;e.textContent="Un momento…";
      db.rpc("fm_giornale_programma_video",{p_link:link,p_giorno:gg}).then(function(r){if(r&&r.error){s.disabled=false;e.textContent=errore(r.error);return;}
        var f=$("#g4-cima-f");if(f)f.remove();g4VideoOggi();},function(x){s.disabled=false;e.textContent=errore(x);});return;}
    if(!link&&!fl){e.textContent="Metti un link YouTube o scegli un file audio.";return;}
    if(!t){e.textContent="Scrivi il testo che lo descrive.";return;}
    if(!cap){e.textContent="Scegli la voce dell'indice.";return;}
    s.disabled=true;e.textContent="Un momento…";
    var su=Promise.resolve(null);
    if(fl){var ext=(String(fl.name).split(".").pop()||"").toLowerCase().replace(/[^a-z0-9]/g,"").slice(0,5)||"m4a";
      var id=(window.crypto&&crypto.randomUUID)?crypto.randomUUID():Date.now().toString(36)+Math.random().toString(36).slice(2);
      var path="giornale/"+id+"."+ext;
      su=db.storage.from("chat").upload(path,fl,{contentType:fl.type||"audio/mpeg",upsert:false}).then(function(u){if(u&&u.error)throw u.error;return path;});}
    su.then(function(path){return db.rpc("fm_giornale_metti_in_cima",{p_link:link||null,p_audio:path,p_testo:t,p_capitolo:cap});})
      .then(function(r){if(r&&r.error){s.disabled=false;e.textContent=errore(r.error);return;}var f=$("#g4-cima-f");if(f)f.remove();g4VideoOggi();},
        function(x){s.disabled=false;e.textContent=errore(x);});};
}
/* 10/11 · Video passati e programmati (SQL 240). Gab 9/11 «archivia i video che mettiamo nel giornale, poi mi confermi dove» · 10/11 «ok» */
function g4Oggi(){try{return new Date().toLocaleDateString("sv-SE",{timeZone:"Europe/Rome"});}catch(e){var d=new Date();return d.getFullYear()+"-"+("0"+(d.getMonth()+1)).slice(-2)+"-"+("0"+d.getDate()).slice(-2);}}
function g4Giorno(g){var p=String(g||"").split("-");if(p.length<3)return "";return new Date(+p[0],+p[1]-1,+p[2]).toLocaleDateString("it-IT",{day:"numeric",month:"long",year:"numeric"});}
function g4VideoTit(v){return v.link_titolo?(v.link_titolo+(v.link_canale?" · "+v.link_canale:"")):(v.link||"");}
/* 12/11 · descrizione (SQL 248): il testo di YouTube non è fidato, va solo come testo */
function g4Desc(t){t=String(t||"").trim();if(!t)return "";var lungo=t.length>220||t.split("\n").length>3;
  return '<p class="g4-desc" style="margin:0;font-size:18px;line-height:1.55;white-space:pre-line;overflow-wrap:anywhere'+(lungo?';display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden':'')+'">'+esc(t)+'</p>'+
    (lungo?'<button type="button" class="mini g4-altro" style="margin-top:4px">altro</button>':'');}
document.addEventListener("click",function(ev){var b=ev.target.closest&&ev.target.closest(".g4-altro");if(!b)return;var p=b.previousElementSibling;if(!p)return;
  var aperto=p.style.display!=="-webkit-box";p.style.display=aperto?"-webkit-box":"block";p.style.overflow=aperto?"hidden":"visible";b.textContent=aperto?"altro":"meno";});
function g4Passati(inCima){
  var L=$("#g4-pass-l");if(!L)return;if(L.innerHTML){L.innerHTML="";return;}clearTimeout(g4CimaT);
  L.innerHTML='<p class="nota">Un momento…</p>';
  db.from("giornale_video").select("id,link,link_titolo,link_canale,mostra_dal,testo,link_descrizione").order("mostra_dal",{ascending:false}).order("messo_il",{ascending:false}).limit(61).then(function(r){
    if(r&&r.error)return db.from("giornale_video").select("id,link,link_titolo,link_canale,mostra_dal,testo").order("mostra_dal",{ascending:false}).order("messo_il",{ascending:false}).limit(61);return r;}).then(function(r){
    var L=$("#g4-pass-l");if(!L)return;
    if(!r||r.error){L.innerHTML='<p class="nota">I video passati non si leggono adesso.</p>';return;}
    var l=(r.data||[]).filter(function(v){return v.id!==inCima&&ytId(v.link);}).slice(0,60);
    if(!l.length){L.innerHTML='<p class="nota">Non ci sono ancora video passati.</p>';return;}
    L.innerHTML='<div style="display:flex;flex-direction:column;gap:8px;margin-top:10px">'+l.map(function(v,i){
      return '<div><button type="button" class="mini" data-pv="'+i+'" style="text-align:left;width:100%"><small>'+esc(g4Giorno(v.mostra_dal))+'</small><br>'+esc(g4VideoTit(v))+'</button><div data-pv-box="'+i+'"></div>'+((v.testo||v.link_descrizione)?'<div style="margin:6px 4px 0">'+g4Desc(v.testo||v.link_descrizione)+'</div>':'')+'</div>';}).join("")+'</div>';
    L.querySelectorAll("[data-pv]").forEach(function(b){b.onclick=function(){var i=b.getAttribute("data-pv"),W=L.querySelector('[data-pv-box="'+i+'"]');
      if(W.innerHTML){W.innerHTML="";return;}
      W.innerHTML='<div class="video" style="margin:8px 0 4px"><iframe src="https://www.youtube-nocookie.com/embed/'+ytId(l[+i].link)+'" title="video" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen loading="lazy"></iframe></div>';};});
  },function(){var L=$("#g4-pass-l");if(L)L.innerHTML='<p class="nota">I video passati non si leggono adesso.</p>';});
}
function g4Programmati(){
  db.rpc("fm_giornale_video_programmati").then(function(r){var P=$("#g4-prog");if(!P||!r||r.error)return;var l=r.data||[];if(!l.length)return;
    P.innerHTML='<p style="margin:10px 0 4px"><b>Programmati</b></p>'+l.map(function(v){return '<p style="margin:0 0 6px;font-size:17px"><small>'+esc(g4Giorno(v.mostra_dal))+'</small><br>'+esc(g4VideoTit(v))+'</p>';}).join("");
  },function(){});
}
