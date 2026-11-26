/* GIORNALE: l'edizione del giorno, a tre fasce, che finisce */
var FASCE=[["Mattina",0,13],["Pomeriggio",13,19],["Sera",19,24]];
var apriF={},apriA={};
function vGiornale(){
  var c=$("#corpo"),g=new Date();g.setHours(0,0,0,0);g.setDate(g.getDate()+giorno);
  var da=g.getTime(),a=da+864e5;
  var nome=giorno===0?"Oggi":giorno===-1?"Ieri":giorno===1?"Domani":"";
  var data=g.toLocaleDateString("it-IT",{weekday:"long",day:"numeric",month:"long",year:"numeric"});
  /* 25/11 · Gab: «questi due quadranti potrebbero essere molto piu piccoli, un remind va piu che bene» */
  c.innerHTML='<div id="g4-oggi"></div><div id="g4-arg"></div><div id="g4-fissi"><a class="gr" href="praticantato.html"><span class="et">Praticantato</span><span class="tx">Percorso online ogni lunedì alle 19&nbsp;&gt;</span></a><a class="gr-s" href="strumento.html?v=assistenza&amp;motivo=karma_yoga">Oppure mettiti al servizio col Karma Yoga&nbsp;&gt;</a><a class="gr" href="attiva-un-vicinato.html#serve"><span class="et">Attiva un vicinato</span><span class="tx">Aderisci col vicinato in cui vivi&nbsp;&gt;</span></a></div>'+g4Testa(g)+'<p class="g4-occ" style="margin:8px 6px 0">La giornata</p><div class="foglio-g"><div class="testata"><h4>GIORNALE FELICITAS</h4><p>'+(nome?esc(nome)+" · ":"")+esc(data)+'</p></div><div id="g-corpo"><p class="nota" style="padding:14px 0;text-align:center">Un momento…</p></div></div>'+
    (io.id?'':'<div class="chiuso">Il nexus apre la piazza: qui si legge quello che è per tutti. Le notizie dei vicinati si aprono dopo l\'ingresso nel vicinato.</div>')+
    '<div class="giro"><button class="btn" data-giorno="-1">← Giorno prima</button>'+(giorno!==0?'<button class="mini" data-giorno="0">Oggi</button>':'')+'<button class="btn" data-giorno="1" '+(giorno>=14?"disabled":"")+'>Giorno dopo →</button></div>'+
    '<div class="g4-vid" style="margin-top:18px">'+videoHTML("villaggi")+videoHTML("cervello")+'</div>';
  c.querySelectorAll("[data-giorno]").forEach(function(b){b.onclick=function(){var n=+b.getAttribute("data-giorno");giorno=n===0?0:giorno+n;vGiornale();window.scrollTo(0,0);};});
  var questo=giorno;
  var artRpc=db?db.rpc("fm_giornale_articoli",{p_da:new Date(da).toISOString(),p_a:new Date(a).toISOString()}).then(function(r){return r&&!r.error&&Array.isArray(r.data)?r.data:null;},function(){return null;}):Promise.resolve(null);
  Promise.all([ormeDelGiorno(da,a),lezioni(),artRpc,dirette()]).then(function(v){
    if(vista!=="giornale"||giorno!==questo)return;
    var voci=v[0].map(function(o){return {o:o,t:new Date(o.inizio_il||o.momento).getTime()};}).filter(function(x){return x.t>=da&&x.t<a;});
    v[1].forEach(function(l){var t=new Date(l.inizio_il).getTime();if(t>=da&&t<a)voci.push({l:l,t:t});});
    var arti=voci.filter(function(x){return x.o&&x.o.tipo==="articolo";});voci=voci.filter(function(x){return !(x.o&&x.o.tipo==="articolo");});
    if(v[2])arti=v[2].filter(function(o){return o.tipo==="articolo";}).map(function(o){o.orma_file=o.orma_file||[];return {o:o,t:new Date(o.inizio_il||o.momento).getTime()};}).filter(function(x){return x.t>=da&&x.t<a;});
    var files=[];voci.concat(arti).forEach(function(x){if(x.o)(x.o.orma_file||[]).forEach(function(f){if(/image|audio/.test(f.tipo||"")||/\.(jpe?g|png|webp|gif|heic|m4a|mp3|ogg|webm|wav|aac)$/i.test(f.nome||""))files.push(f);});});
    return Promise.all([leggiNomi(voci.concat(arti).filter(function(x){return x.o;}).map(function(x){return x.o.persona_id;})),firmaURL(files)]).then(function(w){
      if(vista!=="giornale"||giorno!==questo)return;
      var firme=w[1];
      g4Articoli(arti,firme);
      var sez=FASCE.map(function(F){
        var vv=voci.filter(function(x){var h=new Date(x.t).getHours();return h>=F[1]&&h<F[2];})
          .sort(function(p,q){return ((q.o&&q.o.tipo==="articolo")?1:0)-((p.o&&p.o.tipo==="articolo")?1:0)||p.t-q.t;});
        if(!vv.length)return "";
        var k=da+F[0],tutto=apriF[k],vis=tutto?vv:vv.slice(0,4);
        var art=vis.filter(function(x){return x.o&&x.o.tipo==="articolo";}),onda=vis.filter(function(x){return x.l||(x.o&&x.o.tipo==="diretta");}),brevi=vis.filter(function(x){return x.o&&x.o.tipo!=="articolo"&&x.o.tipo!=="diretta";});
        return '<div class="sez"><b>'+F[0]+'</b><span>'+(vv.length===1?"1 voce":vv.length+" voci")+'</span></div>'+
          art.map(function(x){return voce(x,firme);}).join("")+onda.map(function(x){return voce(x,firme);}).join("")+
          (brevi.length?'<div class="brevi">'+brevi.map(function(x){return voce(x,firme);}).join("")+'</div>':"")+
          (vv.length>4?'<button class="leggi" data-apri="'+k+'">'+(tutto?"Mostra meno":"Vedi tutte ("+vv.length+")")+'</button>':"");
      }).join("");
      var gc=$("#g-corpo");
      gc.innerHTML=sez?sez+'<p class="finito">Hai visto tutto per '+(giorno===0?"oggi":"questo giorno")+'.</p>':
        '<p class="nota" style="padding:14px 0;text-align:center">'+(giorno>0?"Ancora niente in programma per questo giorno.":"Questo giorno non ha ancora niente.")+'</p>';
      gc.querySelectorAll("[data-apri]").forEach(function(b){b.onclick=function(){apriF[b.getAttribute("data-apri")]=!apriF[b.getAttribute("data-apri")];vGiornale();};});
      gc.querySelectorAll("[data-art]").forEach(function(b){b.onclick=function(){apriA[b.getAttribute("data-art")]=!apriA[b.getAttribute("data-art")];vGiornale();};});
      legaVis(gc);
    });
  });
  g4Riempi(da,a,questo);
  g4VideoOggi();g4Argomenti();
}
function mediaHTML(o,firme){
  return (o.orma_file||[]).map(function(f){var u=firme[f.indirizzo];if(!u)return "";
    if(/image/.test(f.tipo||"")||/\.(jpe?g|png|webp|gif|heic)$/i.test(f.nome||""))return '<img class="foto" src="'+esc(u)+'" alt="'+esc(f.nome||"foto")+'" loading="lazy">';
    return '<audio controls preload="none" src="'+esc(u)+'"></audio>';}).join("");
}
function visGio(o){return o.tipo==="articolo"||o.tipo==="diretta";}
function visTeam(o){return !!o.squadra_id&&visGio(o)&&(team.lista||[]).some(function(t){return t.team_id===o.squadra_id;});}
function visPuo(o){return !!io.id&&(o.persona_id===io.id||(io.nucleo&&visGio(o))||visTeam(o));}
function visCanc(o){return visPuo(o)&&visGio(o)?'<button type="button" class="mini" data-canc="'+esc(o.id)+'" style="margin-top:8px">Cancella</button>':'';}
function apriCerv(o){return io.id&&o.da_riga&&o.capitolo_id&&o.tipo==="articolo"?'<a class="g4-cerv" href="strumento.html?v=cervello&cap='+encodeURIComponent(o.capitolo_id)+'">Apri nel Cervello ›</a>':'';}
function visHTML(o){
  if(!visPuo(o))return o.visibilita&&o.visibilita!=="pubblico"?'<span class="etv">'+esc(VIS[o.visibilita]||o.visibilita)+'</span>':"";
  return '<span class="vis" style="margin-top:4px">'+["solo_me","vicinato","pubblico"].map(function(v){return '<button data-vis="'+esc(o.id)+'|'+v+'|'+esc(o.tipo||"")+'" aria-pressed="'+(o.visibilita===v)+'">'+VIS[v]+'</button>';}).join("")+'</span>'+visCanc(o);
}
function legaVis(c){c.querySelectorAll("[data-vis]").forEach(function(b){b.onclick=function(){var p=b.getAttribute("data-vis").split("|");b.disabled=true;
  function diretto(){return db.from("orme").update({visibilita:p[1]}).eq("id",p[0]);}
  /* articoli e dirette: SQL 211 (l'update diretto non cambia nulla per chi non è l'autore); senza la funzione, come prima */
  var q=(p[2]==="articolo"||p[2]==="diretta")?db.rpc("fm_giornale_visibilita",{p_articolo:p[0],p_vis:p[1]}).then(function(r){
    if(r&&r.error&&(r.error.code==="PGRST202"||/fm_giornale_visibilita/.test(r.error.message||"")))return diretto();return r;}):diretto();
  q.then(function(r){if(r&&r.error){alert(errore(r.error));b.disabled=false;return;}cache.obiettivi=null;disegna();},function(x){b.disabled=false;alert(errore(x));});};});
  c.querySelectorAll("[data-canc]").forEach(function(b){b.onclick=function(){if(!confirm("Cancellare? Non si torna indietro."))return;b.disabled=true;
    db.rpc("fm_giornale_elimina",{p_id:b.getAttribute("data-canc")}).then(function(r){if(r&&r.error){alert(errore(r.error));b.disabled=false;return;}disegna();},function(x){b.disabled=false;alert(errore(x));});};});}
function direttaInOnda(id){var ora=Date.now();return (cache.dirette||[]).some(function(d){return d.id===id&&(!d.inizio_il||new Date(d.inizio_il).getTime()<=ora);});}
function voce(x,firme){
  if(x.l){var l=x.l;return '<div class="onda"><b>Lezione · ore '+hhmm(l.inizio_il)+'</b><p>'+esc(l.titolo)+'</p>'+(l.sottotitolo?'<span>'+esc(l.sottotitolo)+'</span>':'')+(l.luogo?'<span>'+esc(l.luogo)+'</span>':'')+(l.link?linkHTML(l.link):'')+'</div>';}
  var o=x.o,chi=nomi[o.persona_id]||"",link=o.link||primoLink(o.contenuto),testo=String(o.contenuto||"");
  if(!o.link&&link)testo=testo.replace(link,"").trim();
  var firma=hhmm(x.t)+" · "+esc(TIPO_NOME[o.tipo]||o.tipo)+(chi?" · "+esc(chi):"");
  if(o.tipo==="diretta"&&direttaInOnda(o.id))return '<a class="onda" href="diretta-bozza.html?puntata='+encodeURIComponent(o.id)+'"><b>Diretta · ore '+hhmm(x.t)+'</b><p>'+esc(o.titolo||testo)+'</p>'+(o.titolo&&testo?'<span>'+esc(testo)+'</span>':'')+'<span>entra ›</span></a>';
  /* 14/11 Gab: «rimane la diretta non la stanza dove si è fatta la diretta» → finita: titolo, testo e registrazione, senza la sala */
  if(o.tipo==="diretta")return '<div class="onda"><b>Diretta · ore '+hhmm(x.t)+'</b><p>'+esc(o.titolo||testo)+'</p>'+(o.titolo&&testo?'<span>'+esc(testo)+'</span>':'')+mediaHTML(o,firme)+visHTML(o)+'</div>';
  if(o.tipo==="articolo"){var lungo=testo.length>320,tutto=apriA[o.id];
    var imm=o.immagine_url&&/^(https:\/\/|giornale\/img\/)[^\s"'<>]+$/.test(o.immagine_url)?'<img class="art-img" src="'+esc(o.immagine_url)+'" alt="'+esc(o.immagine_alt||"")+'" decoding="async">':'';
    return '<article class="art">'+imm+(o.titolo?'<h5>'+esc(o.titolo)+'</h5>':'')+'<p class="firma">'+firma+'</p>'+linkHTML(link)+mediaHTML(o,firme)+
      (testo?'<p class="testo">'+esc(lungo&&!tutto?testo.slice(0,320)+"…":testo)+'</p>':'')+(lungo?'<button class="leggi" data-art="'+esc(o.id)+'">'+(tutto?"Chiudi":"Leggi tutto")+'</button>':'')+apriCerv(o)+visHTML(o)+'</article>';}
  return '<div class="breve">'+(o.titolo?'<p><b>'+esc(o.titolo)+'</b></p>':'')+linkHTML(link)+mediaHTML(o,firme)+(testo?'<p>'+esc(testo)+'</p>':'')+'<span>'+firma+'</span>'+visHTML(o)+'</div>';
}

