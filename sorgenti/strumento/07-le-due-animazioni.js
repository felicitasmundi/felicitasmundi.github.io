/* LE DUE ANIMAZIONI · 21 ott 11:32-11:36, Gab: «rendere questi video una costante della piattaforma […] che non si disperdano e restino visibili» · «ok per tutto, rendi operativa».
   I file in video/ li aggiorna il thread «Due animazioni per il Festival». 22 ott, Gab: niente «Guarda», partono da sole quando si vedono e crescono mentre si scorre (comune/fm-video.js). */
var VIDEO={cervello:["il-cervello-digitale","Il cervello digitale"],villaggi:["villaggi-e-vicinati","Villaggi e vicinati"]};
function videoHTML(k){var v=VIDEO[k];return '<div class="vid169 fm-vid"><iframe data-fm-video="video/'+v[0]+'.html" title="'+esc(v[1])+'" allow="fullscreen" allowfullscreen></iframe></div>';}
/* 21 ott 12:59 e 13:09, Gab: sotto il video del cervello «Attiva il cervello digitale evoluto della tua azienda» e «Organizza una conferenza nel tuo territorio» (SQL 103): arrivano al ruolo Eventi, con «dove». */
var NOME_R={attivazione_cervello:"Attivazione del Cervello Digitale Evoluto",conferenza:"Conferenza nel tuo territorio"};
function ricTasti(){return '<div class="vid-tasti"><button class="btn" data-ric="attivazione_cervello" data-conta="tasto:attivazione_cervello">Attiva il Cervello Digitale Evoluto della tua azienda</button><button class="btn" data-ric="conferenza" data-conta="tasto:conferenza">Organizza una conferenza nel tuo territorio</button></div><p class="ric-esito" aria-live="polite"></p>';}
document.addEventListener("click",function(e){var b=e.target.closest("[data-ric]");if(!b)return;var cosa=b.getAttribute("data-ric");if(!NOME_R[cosa])return;
  var es=b.parentNode.nextElementSibling;function di(t){if(es&&es.classList.contains("ric-esito"))es.textContent=t||"";}
  if(!io.id){location.href="accesso.html?torna="+encodeURIComponent("strumento.html?v=cervello");return;}
  var d=prompt("Dove? Paese o città (si può lasciare vuoto)","");if(d===null)return;
  di("Un momento…");
  db.rpc("fm_prenota",{p_cosa:cosa,p_dove:d}).then(function(r){
    if(r&&r.error){di("Non è stato salvato. Si può riprovare.");return;}
    di(r&&r.data==="ok"?"Richiesta arrivata: "+NOME_R[cosa]+(d.trim()?" · "+d.trim():"")+".":(r&&r.data)||"");
  },function(){di("Non è stato salvato. Si può riprovare.");});});
/* la luna di oggi: ciclo sinodico medio */
function luna(){
  var f=(((Date.now()-Date.UTC(2000,0,6,18,14))/864e5)/29.530588853)%1;if(f<0)f+=1;
  var nome=f<.034||f>.966?"luna nuova":f<.466?"luna crescente":f<.534?"luna piena":"luna calante"; /* 19 ott 23:30, Gab: «metti solo luna piena nuova calante crescente» */
  var r=15,cos=Math.cos(2*Math.PI*f),rx=Math.abs(cos)*r,s1=f<.5?1:0,s2=cos>0?s1:1-s1;
  var d="M20 "+(20-r)+" A "+r+" "+r+" 0 0 "+s1+" 20 "+(20+r)+" A "+rx.toFixed(2)+" "+r+" 0 0 "+s2+" 20 "+(20-r);
  return {nome:nome,svg:'<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="15.5" fill="none" stroke="currentColor" stroke-opacity=".35"/><path d="'+d+'" fill="currentColor"/></svg>'};
}

/* ── i dati ── */
var cache={santo:null,lezioni:null,dirette:null,obiettivi:null,bisogni:null};
function santo(){
  if(cache.santo!==null||!db)return Promise.resolve(cache.santo);
  var d=new Date();
  return db.rpc("fm_santo",{p_mese:d.getMonth()+1,p_giorno:d.getDate()}).then(function(r){cache.santo=(r&&!r.error&&r.data)?String(r.data):"";return cache.santo;},function(){cache.santo="";return "";});
}
function lezioni(){
  if(cache.lezioni||!db)return Promise.resolve(cache.lezioni||[]);
  return db.rpc("fm_lezioni_prossime",{p_giorni:15}).then(function(r){cache.lezioni=(r&&!r.error&&r.data)||[];return cache.lezioni;},function(){return [];});
}
/* 8/11 · dirette del team (SQL 221): fm_dirette_del_team, fm_attiva_diretta, fm_cancella_diretta. Senza le funzioni il riquadro non compare. */
var DT_CSS='#tc-dt:empty{display:none}#tc-dt{margin:10px 0 0;display:grid;gap:8px}'+
'.dt-r{display:flex;gap:10px;align-items:center;flex-wrap:wrap;padding:10px 14px;border-radius:14px;background:#1a2148;border:1px solid rgba(212,175,106,.45);color:#F5F0E6;font-size:17px}'+
'.dt-r .dt-t{flex:1 1 180px;min-width:0;overflow-wrap:anywhere}.dt-r small{display:block;opacity:.75;font-size:15px}.dt-on{color:#ff6b6b;font-weight:600}'+
'.dt-r a{color:#0a1430;background:#D4AF6A;border-radius:12px;padding:6px 12px;font-weight:600;text-decoration:none}'+
'.dt-b{justify-self:start;padding:8px 14px;border-radius:12px;border:1px solid rgba(212,175,106,.6);background:none;color:#D4AF6A;font:600 16px "DM Sans",system-ui,sans-serif;cursor:pointer}'+
'.dt-f{display:flex;flex-direction:column;gap:8px;padding:12px 14px;border-radius:14px;background:#1a2148;border:1px solid rgba(212,175,106,.45);color:#F5F0E6;font-size:17px}'+
'.dt-f input[type=text],.dt-f input[type=datetime-local]{font-size:17px;padding:10px 12px;border-radius:12px;border:1px solid rgba(212,175,106,.45);background:#122050;color:#F5F0E6}'+
'.dt-f fieldset{border:0;padding:0;margin:0;display:flex;gap:14px;flex-wrap:wrap}.dt-f .dt-e{margin:0;color:#E07A5F;font-size:15px}.dt-f .dt-e:empty{display:none}';
document.head.insertAdjacentHTML("beforeend","<style>"+DT_CSS+"</style>");
function diretteTeam(id){
  var box=$("#tc-dt");if(!box||!db)return;
  db.rpc("fm_dirette_del_team",{p_team:id}).then(function(r){
    var box=$("#tc-dt");if(!box||vista!=="team"||team.id!==id)return;
    if(!r||r.error){box.innerHTML="";return;}
    var l=r.data||[];
    box.innerHTML=(l.length?'<h3 class="dt-pa">Prossimo appuntamento</h3>':'')+l.map(function(d){var q=d.inizio_il?new Date(d.inizio_il).toLocaleString("it-IT",{weekday:"short",day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"}):"";
      return '<div class="dt-r"><span class="dt-t">'+(d.in_onda?'<span class="dt-on">● in onda</span> · ':'')+'<b>'+esc(d.titolo||"")+'</b>'+(d.sottotitolo?'<small>'+esc(d.sottotitolo)+'</small>':'')+(!d.in_onda&&q?'<small>'+esc(q)+'</small>':'')+'</span>'+
        '<a href="diretta-bozza.html?puntata='+encodeURIComponent(d.id)+'">Entra ›</a>'+((io.nucleo||(io.ruoli||[]).length)?'<button type="button" class="dt-b" data-dt-inv="'+esc(d.id)+'">Invita</button>':'')+(d.mia&&!d.in_onda?'<button type="button" class="dt-b" data-dt-canc="'+esc(d.id)+'">Cancella</button>':'')+'</div>';}).join("")+
      '<button type="button" class="dt-b" id="dt-attiva">Attiva diretta</button>';
    box.querySelectorAll("[data-dt-canc]").forEach(function(b){b.onclick=function(){if(!confirm("Cancellare la diretta?"))return;b.disabled=true;
      db.rpc("fm_cancella_diretta",{p_id:b.getAttribute("data-dt-canc")}).then(function(x){if(x&&x.error){b.disabled=false;$("#tc-err").textContent=dtErr(x.error);return;}cache.dirette=null;diretteTeam(id);},function(z){b.disabled=false;$("#tc-err").textContent=errore(z);});};});
    box.querySelectorAll("[data-dt-inv]").forEach(function(b){b.onclick=function(){var d=l.filter(function(x){return x.id===b.getAttribute("data-dt-inv");})[0];if(d)dtInvita(id,d,b);};});
    $("#dt-attiva").onclick=function(){diretteForm(id);};
  },function(){var box=$("#tc-dt");if(box)box.innerHTML="";});
}
function dtInvita(id,d,b){
  var vec=document.getElementById("dt-inv");if(vec){var era=vec.getAttribute("data-d");vec.remove();if(era===d.id)return;}
  var riga=b.closest(".dt-r"),w=document.createElement("div");w.className="dt-f";w.id="dt-inv";w.setAttribute("data-d",d.id);
  w.innerHTML='<p class="dt-e">Un momento…</p>';riga.insertAdjacentElement("afterend",w);b.disabled=true;
  var t=(team.lista||[]).filter(function(x){return x.team_id===id;})[0],nome=t?t.nome:"";
  var q=d.inizio_il?new Date(d.inizio_il).toLocaleString("it-IT",{weekday:"long",day:"numeric",month:"long",hour:"2-digit",minute:"2-digit"}):"adesso";
  var ld=new URL("diretta-bozza.html?puntata="+encodeURIComponent(d.id),location.href).href;
  db.rpc("fm_link_team",{p_squadra:id,p_funzione:null,p_ruolo:null,p_karma:true}).then(function(r){b.disabled=false;
    var lt=(r&&!r.error&&r.data)?new URL("../communitas-aeterna/invito-ruolo.html?c="+encodeURIComponent(r.data),location.href).href:"";
    var msg=(d.titolo||"")+(d.sottotitolo?"\n"+d.sottotitolo:"")+"\n"+q+" · diretta nel team "+nome+
      (lt?"\n\nEntra nel team: "+lt:"")+"\n"+(lt?"Poi entra nella diretta: ":"Entra nella diretta: ")+ld;
    w.innerHTML='<label for="dt-inv-t">Il messaggio</label><textarea id="dt-inv-t" rows="7" style="font:inherit;font-size:17px;width:100%;box-sizing:border-box;border-radius:10px;padding:10px;background:#0a1430;color:#F5F0E6;border:1px solid rgba(212,175,106,.35);resize:vertical"></textarea>'+
      '<div style="display:flex;gap:10px;flex-wrap:wrap">'+(navigator.share?'<button type="button" class="dt-b" id="dt-inv-c">Condividi</button>':'')+'<button type="button" class="dt-b" id="dt-inv-w">WhatsApp</button><button type="button" class="dt-b" id="dt-inv-k">Copia</button></div>'+
      (lt?'<p class="dt-e" style="color:#c9cbe3">Il link del team vale per chiunque lo riceva: entra come karma yoga.</p>':'<p class="dt-e">'+esc(r&&r.error?dtErr(r.error):"")+'</p>');
    var ta=$("#dt-inv-t");ta.value=msg;
    $("#dt-inv-w").onclick=function(){window.open("https://wa.me/?text="+encodeURIComponent(ta.value),"_blank","noopener");};
    var k=$("#dt-inv-k");k.onclick=function(){var v=ta.value;(navigator.clipboard?navigator.clipboard.writeText(v):Promise.reject()).then(function(){k.textContent="Copiato";},function(){prompt("Copia il messaggio",v);});};
    var c=$("#dt-inv-c");if(c)c.onclick=function(){navigator.share({text:ta.value}).catch(function(){});};
  },function(z){b.disabled=false;w.innerHTML='<p class="dt-e">'+esc(errore(z))+'</p>';});
}
function dtErr(e){var m=String((e&&e.message)||"");return m&&!/PGRST|function|schema|JWT/i.test(m)?m:errore(e);}
function diretteForm(id){
  var b=$("#dt-attiva");if(!b)return;
  var f=document.createElement("div");f.className="dt-f";
  f.innerHTML='<label for="dt-tit">Titolo</label><input type="text" id="dt-tit" maxlength="140">'+
    '<label for="dt-sot">Sottotitolo</label><input type="text" id="dt-sot" maxlength="200">'+
    '<fieldset><label><input type="radio" name="dt-q" value="ora" checked> Adesso</label><label><input type="radio" name="dt-q" value="poi"> Programma</label></fieldset>'+
    '<input type="datetime-local" id="dt-quando" hidden aria-label="Data e ora">'+
    '<fieldset><label><input type="radio" name="dt-v" value="team" checked> Solo il team</label><label><input type="radio" name="dt-v" value="pubblica"> Pubblica</label></fieldset>'+
    '<div style="display:flex;gap:10px"><button type="button" class="dt-b" id="dt-ok">Attiva diretta</button><button type="button" class="dt-b" id="dt-no">Annulla</button></div><p class="dt-e" id="dt-e" aria-live="polite"></p>';
  b.replaceWith(f);$("#dt-tit").focus();
  f.querySelectorAll('input[name="dt-q"]').forEach(function(x){x.onchange=function(){var poi=f.querySelector('input[name="dt-q"]:checked').value==="poi",w=$("#dt-quando");w.hidden=!poi;
    /* 10/11 09:57, Gab: «fai in modo che in tutte le dirette se le programmo, mi dia di default il giorno d oggi e io da li poi posso cambiare la data» → oggi, alla prossima ora piena */
    if(poi&&!w.value){var d=new Date(),g=d.getDate();d.setMinutes(0,0,0);d.setHours(d.getHours()+1);if(d.getDate()!==g){d.setDate(g);d.setHours(23,59);}var z=function(n){return String(n).padStart(2,"0");};w.value=d.getFullYear()+"-"+z(d.getMonth()+1)+"-"+z(d.getDate())+"T"+z(d.getHours())+":"+z(d.getMinutes());}};});
  $("#dt-no").onclick=function(){diretteTeam(id);};
  $("#dt-ok").onclick=function(){var s=this,e=$("#dt-e"),t=$("#dt-tit").value.trim(),poi=f.querySelector('input[name="dt-q"]:checked').value==="poi",q=$("#dt-quando").value,pub=f.querySelector('input[name="dt-v"]:checked').value==="pubblica";
    if(!t){e.textContent="Scrivi il titolo.";return;}
    if(poi&&!q){e.textContent="Scegli data e ora.";return;}
    if(poi&&new Date(q).getTime()<Date.now()){e.textContent="Scegli un momento che deve ancora venire.";return;}
    s.disabled=true;e.textContent="";
    db.rpc("fm_attiva_diretta",{p_titolo:t,p_sottotitolo:$("#dt-sot").value.trim()||null,p_inizio:poi?new Date(q).toISOString():null,p_team:pub?null:id}).then(function(x){
      if(x&&x.error){s.disabled=false;e.textContent=dtErr(x.error);return;}
      cache.dirette=null;
      if(!poi&&x&&x.data){location.href="diretta-bozza.html?puntata="+encodeURIComponent(x.data);return;}
      diretteTeam(id);},function(z){s.disabled=false;e.textContent=errore(z);});};
}
function dirette(){
  if(cache.dirette||!db)return Promise.resolve(cache.dirette||[]);
  return db.rpc("fm_dirette_in_onda").then(function(r){cache.dirette=(r&&!r.error&&r.data)||[];return cache.dirette;},function(){return [];});
}
var CAMPI="id,titolo,contenuto,tipo,visibilita,momento,accaduto_il,inizio_il,persona_id,stadio,entro_il,orma_file(nome,indirizzo,tipo)";
function ormeDelGiorno(da,a){
  if(!db)return Promise.resolve([]);
  var A=new Date(da).toISOString(),B=new Date(a).toISOString();
  function q(col){return db.from("orme").select(CAMPI).in("tipo",TIPI_G).gte(col,A).lt(col,B).order(col).limit(200)
    .then(function(r){if(r&&!r.error)return r.data||[];
      /* senza gli allegati, se il legame non si legge */
      return db.from("orme").select(CAMPI.replace(/,orma_file\([^)]*\)/,"")).in("tipo",TIPI_G).gte(col,A).lt(col,B).order(col).limit(200)
        .then(function(x){return x&&!x.error?(x.data||[]):[];});},function(){return [];});}
  return Promise.all([q("momento"),q("inizio_il")]).then(function(v){
    var visti={},tutte=[];v[0].concat(v[1]).forEach(function(o){if(visti[o.id])return;visti[o.id]=1;tutte.push(o);});
    var ids=tutte.map(function(o){return o.id;});
    if(!ids.length)return tutte;
    return db.from("orme").select("id,link").in("id",ids).then(function(r){
      var m={};((r&&!r.error&&r.data)||[]).forEach(function(x){m[x.id]=x.link;});
      tutte.forEach(function(o){o.link=m[o.id]||null;});
      /* l'immagine in cima all'articolo (SQL 101 del thread Giornale); senza il 101 la lettura non riesce e l'articolo resta com'è */
      return db.from("orme").select("id,immagine_url,immagine_alt").in("id",ids).then(function(q){
        var im={};((q&&!q.error&&q.data)||[]).forEach(function(x){if(x.immagine_url)im[x.id]=x;});
        tutte.forEach(function(o){if(im[o.id]){o.immagine_url=im[o.id].immagine_url;o.immagine_alt=im[o.id].immagine_alt||"";}});return tutte;
      },function(){return tutte;});
    },function(){return tutte;});
  });
}
function firmaURL(files){
  var p=files.filter(function(f){return f&&f.indirizzo;}).map(function(f){return f.indirizzo;});
  if(!p.length||!db||!io.id)return Promise.resolve({});
  return db.storage.from("riservato").createSignedUrls(p,3600).then(function(r){
    var m={};((r&&r.data)||[]).forEach(function(x){if(x&&x.signedUrl)m[x.path]=x.signedUrl;});return m;
  },function(){return {};});
}

/* ── chi è dentro ── */
function chiSono(){
  if(!db)return Promise.resolve();
  return db.auth.getSession().then(function(s){
    var u=s&&s.data&&s.data.session&&s.data.session.user;if(!u)return;
    io.id=u.id;
    setTimeout(function(){ytChiedi(null);},4000); /* i video già inseriti senza titolo (SQL 98) */
    return Promise.all([
      db.from("persone").select("id,nome,grado,nucleo").eq("id",u.id).maybeSingle().then(function(r){if(r&&r.data){io.nome=r.data.nome||"";io.grado=r.data.grado||"ospite";io.nucleo=!!r.data.nucleo;nomi[io.id]=io.nome;}}).catch(function(){}),
      /* SQL 290 · 17/11/2026, Gab: «dobbiamo mettere obbligo di nome e cognome» · «Esatto» (anche «Di dove sei», alla prossima entrata) */
      db.from("persone").select("cognome,luogo").eq("id",u.id).maybeSingle().then(function(r){if(r&&!r.error){io.luogoC=true;io.cognome=(r.data&&r.data.cognome)||"";io.luogo=(r.data&&r.data.luogo)||"";}}).catch(function(){}),
      db.rpc("fm_coordina",{p_villaggio:VILLAGGIO}).then(function(r){io.coordina=!!(r&&!r.error&&r.data===true);}).catch(function(){}),
      db.rpc("fm_miei_ruoli").then(function(r){io.ruoli=(r&&!r.error&&r.data)||[];}).catch(function(){})
    ]);
  }).catch(function(){});
}
function testa(){
  /* 30/10/2026 19:45, Gab: «non posso avere la barra in alto con 7 pulsanti / è inguardabile» → in alto il logo e un solo cerchio;
     dentro il cerchio: i ruoli, Invita, Piani, I miei dati, Esci (thread «Rifare Azione per il nucleo e lo staff»). */
  var ru=[];
  if(io.id){
    if(io.nucleo)ru.push("Nucleo");
    io.ruoli.forEach(function(r){ru.push(nomeRuolo(r.funzione,r.ruolo));});
    if(!io.nucleo&&!io.ruoli.length)ru.push(io.grado==="ospite"?"Ospite":io.grado.replace("_"," "));
  }
  $("#testa").innerHTML=io.id?'':'<a class="mini oro" href="'+ENTRA+'">Entra</a>';
  $("#alto").innerHTML='<button type="button" class="io-cerchio" id="io-cerchio" aria-haspopup="true" aria-expanded="false" aria-label="Il tuo menu">'+esc(io.id?iniziale(io.nome):"✦")+'</button>'+
    '<div class="io-menu" id="io-menu" hidden>'+(ru.length?'<p class="io-ruoli">'+ru.map(esc).join(" · ")+'</p>':'')+
    '<button type="button" data-invita="1">Invita</button><button type="button" data-piani="1">Piani</button>'+
    (io.id?'<button type="button" data-alto="dati">I miei dati</button><button type="button" id="esci">Esci</button>':'<a href="'+ENTRA+'">Entra</a>')+'</div>';
  var cer=$("#io-cerchio"),men=$("#io-menu");
  function chiudiMenu(){men.hidden=true;cer.setAttribute("aria-expanded","false");}
  cer.onclick=function(ev){ev.stopPropagation();men.hidden=!men.hidden;cer.setAttribute("aria-expanded",men.hidden?"false":"true");};
  document.addEventListener("click",function(ev){if(!men.contains(ev.target))chiudiMenu();});
  document.querySelectorAll("[data-alto]").forEach(function(b){b.onclick=function(){chiudiMenu();vai(b.getAttribute("data-alto"));};});
  /* 23 ott 17:59, Gab: «aggiungi il tasto invita in alto» · come l'Invita del Festival: WhatsApp, Telegram, Mail, copia il link dell'app. Testo: le parole di Gab in Oggi. */
  var ib=document.querySelector("[data-invita]");if(ib)ib.onclick=function(){
    chiudiMenu();
    var v=$("#invita-scelta");if(v){v.remove();return;}
    var url=location.origin+location.pathname,msg="FelicitasMundi è una rete di villaggi diffusi. Il primo è la Sardegna.";
    document.querySelector("header.top").insertAdjacentHTML("afterend",'<div class="invita-scelta" id="invita-scelta">'+
      '<a class="alto-b" target="_blank" rel="noopener" href="https://wa.me/?text='+encodeURIComponent(msg+"\n"+url)+'">WhatsApp</a>'+
      '<a class="alto-b" target="_blank" rel="noopener" href="https://t.me/share/url?url='+encodeURIComponent(url)+'&text='+encodeURIComponent(msg)+'">Telegram</a>'+
      '<a class="alto-b" href="mailto:?subject='+encodeURIComponent("FelicitasMundi")+'&body='+encodeURIComponent(msg+"\n"+url)+'">Mail</a>'+
      '<button class="alto-b" type="button" id="inv-copia">Copia il link</button></div>');
    $("#inv-copia").onclick=function(){var b=this;(navigator.clipboard?navigator.clipboard.writeText(url):Promise.reject()).then(function(){b.textContent="Link copiato";},function(){prompt("Copia il link",url);});};
  };
  var pb=document.querySelector("[data-piani]");/* 25/10, Gab «su piani non c e nulla» → «vai»: il loghetto apre la pagina Piani (thread «Il cervello come gestionale») */if(pb)pb.onclick=function(){location.href="piani.html";};
  var e=$("#esci");if(e)e.onclick=function(){db.auth.signOut().then(function(){location.href="strumento.html";});};
}

/* ── disegno ── */
function vai(v){window.fmObTutti=false;if(typeof spazioFerma==="function")spazioFerma();if(typeof cassaFerma==="function")cassaFerma();if(typeof teamFerma==="function")teamFerma();vista=v;if(v!=="cerchio")cerchio=null;if(v==="giornale")giorno=0;disegna();window.scrollTo(0,0);}
/* 25/10, Gab: «coscienza non ha l'impostazione visiva su cui avevamo lavorato» → il menu Coscienza apre la pagina della Coscienza; il suo tasto porta al Cervello */
document.querySelectorAll("#nav button").forEach(function(b){b.onclick=function(){var v=b.getAttribute("data-v");if(v==="emporio"){location.href="emporio.html?c=10182300";return;}vai(v==="cervello"?"coscienza":v);};});
/* 31/10, Gab: «coscienza è una pagina che esce fuori» → Coscienza si apre dentro l'app, con la barra in basso che resta */
/* 8/11, Gab: «quindi nell app schiaccio coscienza ed esce questo» → il Cervello come libro antico (indice SQL 160) */
function vCoscienza(){
  var c=$("#corpo");
  if(typeof libroCervello!=="function"||!db){c.innerHTML='<iframe class="cos-in" src="coscienza.html?in=app" title="Coscienza"></iframe>';return;}
  c.innerHTML='<div id="lc-box"></div>';
  /* la mappa della Coscienza dentro Base filosofica: si apre dentro l'app, con «‹ Indice» per tornare */
  $("#lc-box").addEventListener("click",function(ev){var m=ev.target.closest("[data-mappa]");if(!m)return;ev.preventDefault();
    c.innerHTML='<div style="max-width:680px;margin:0 auto;padding:10px 16px 0"><button class="btn" id="lc-mappa-torna">‹ Indice</button></div><iframe class="cos-in" src="coscienza.html?in=app" title="La mappa della Coscienza"></iframe>';
    $("#lc-mappa-torna").onclick=vCoscienza;});
  function righeCap(id){return db.from("cervello_righe").select("id,testo,scritta_il").eq("capitolo_id",id).order("scritta_il").then(function(q){
    return ((q&&!q.error&&q.data)||[]).map(function(g){return {id:g.id,titolo:String(g.testo||"").trim().split("\n")[0],scritta_il:g.scritta_il};});});}
  libroCervello($("#lc-box"),{
    avviso:!!io.id, /* Gab 8/11: l'avviso dell'autunno «lo si fa vedere solo con accesso» */
    indice:function(){return db.rpc("fm_cervello_indice").then(function(r){return (r&&!r.error&&r.data)||[];});},
    carte:function(id){return db.rpc("fm_capitolo_indice",{p_capitolo:id}).then(function(r){if(r&&!r.error&&Array.isArray(r.data))return r.data;return righeCap(id);},function(){return righeCap(id);});},
    extra:function(sz){return /base filosofica/i.test(sz.sezione_nome||"")?'<div class="lc-mappa"><a class="lc-riga" data-mappa="1" href="coscienza.html?in=app" style="color:inherit;text-decoration:none"><span class="lc-tit">La mappa della Coscienza</span><span class="lc-punti"></span><span class="lc-freccia">›</span></a></div>':"";},
    collegamenti:function(v){var t=String(v.titolo||"").toLowerCase();return (window.FM_INDICE_LINK||[]).filter(function(k){return k.voce&&t.indexOf(k.voce)>=0&&(!k.guida||io.nucleo||(io.ruoli||[]).length);});},
    apri:function(k){c.innerHTML='<div style="max-width:680px;margin:0 auto;padding:10px 16px 0"><button class="btn" id="lc-link-torna">‹ Indice</button></div><iframe class="cos-in" src="'+esc(k.url)+'" title="'+esc(k.titolo)+'"></iframe>';$("#lc-link-torna").onclick=vCoscienza;window.scrollTo(0,0);},
    versioni:function(w,id,ricarica){if(!io.id||!db||!w)return; /* 9/11 Gab «si»: «Versioni» anche nel libro (SQL 209) */
      w.innerHTML='<button type="button" class="corr-b" style="margin-top:14px">Versioni</button>';
      w.querySelector("button").onclick=function(){
        if(w.querySelector(".ver-l")){w.querySelector(".ver-l").remove();return;}
        w.insertAdjacentHTML("beforeend",'<div class="ver-l"><p class="nota">Un momento…</p></div>');var L=w.querySelector(".ver-l");
        db.rpc("fm_card_versioni",{p_riga:id}).then(function(q){
          if(!q||q.error){L.innerHTML='<p class="nota">Le versioni non si leggono adesso.</p>';return;}
          var l=q.data||[];
          L.innerHTML=l.length?l.map(function(v){return verRiga(v,"salvata_il",v.azione==="cancellata"?null:"id");}).join(""):'<p class="nota">Nessuna versione precedente.</p>';
          L.querySelectorAll("[data-ripristina]").forEach(function(b){b.onclick=function(){b.disabled=true;
            db.rpc("fm_card_ripristina",{p_versione:b.getAttribute("data-ripristina")}).then(function(r){
              if(r&&!r.error&&r.data==="ok"){ricarica();return;}
              b.disabled=false;b.insertAdjacentHTML("afterend",'<p class="corr-e">'+esc((r&&!r.error&&r.data)||errore(r&&r.error))+'</p>');},
              function(x){b.disabled=false;alert(errore(x));});};});
        },function(){L.innerHTML='<p class="nota">Le versioni non si leggono adesso.</p>';});};},
    pagina:function(id){return db.from("cervello_righe").select("testo").eq("id",id).maybeSingle().then(function(q){return {testo:(q&&q.data&&q.data.testo)||"",media:[],uscite:[]};});}
  });
}
function legaVai(c){c.querySelectorAll("[data-vai]").forEach(function(b){b.onclick=function(){vai(b.getAttribute("data-vai"));};});}
function disegna(){
  document.querySelectorAll("#nav button,[data-alto]").forEach(function(b){var v=b.getAttribute("data-v")||b.getAttribute("data-alto");if(v===vista||((vista==="cerchio"||vista==="coscienza")&&v==="cervello")||((vista==="team"||vista==="cassa"||vista==="strumenti")&&v==="obiettivi")||(vista==="assistenza"&&v==="azione"))b.setAttribute("aria-current","page");else b.removeAttribute("aria-current");});
  /* 31/10, Gab: «mentre vedo espandi blu le altrre pagine sono bianche» → tutte le pagine in blu cosmo, come Espandi */
  document.body.classList.add("notte");
  document.body.classList.add("cosmo-az");
  ({coscienza:vCoscienza,azione:vAzione,team:vTeam,cassa:vCassa,compra:vCompra,assistenza:vAssistenza,oggi:vOggi,giornale:vGiornale,megafono:vMegafono,obiettivi:vObiettivi,cartelle:vCartelle,dati:vDati,cervello:vCervello,cerchio:vCerchio,staff:vStaffPagina,createam:vCreaTeam,plancia:vPlancia,persone:vPersone,strumenti:vStrumenti})[vista]();
}

