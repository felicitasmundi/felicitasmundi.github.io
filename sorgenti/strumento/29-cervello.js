/* CERVELLO · il libro Felicitas e i cerchi
   19 ott 17:59, Gab: «Vorrei rendere così operativi i cerchi dei vicinati oggi coinvolti, in modo da dare ruoli tra logistica comunità e tecnologia».
   Schema da «Attiva il tuo cervello» (sezione 8): in cima il libro, sotto i cerchi; toccando un cerchio si entra.
   Dati: SQL 79 (fm_cerchi, fm_cerchio_persone, ruoli.vicinato_id). Senza il 79 si vede solo il libro. */
var cerchio=null,cerchiCache=null;
/* 1 nov, Gab: «non è un discorso di team ma di ruoli, questo non lo leggono gli ospiti gli altri si» · «è un nome di un capitolo nel cervello».
   Capitoli del Cervello con livello «non_ospiti» (SQL 142): li legge chi è entrato e non è ospite; solo lettura. Senza lo SQL 142 non compare nulla. */
function capDaLink(){
  var q=new URLSearchParams(location.search),id=q.get("cap");if(!id||!io.id)return;
  try{q.delete("cap");history.replaceState(null,"",location.pathname+"?"+q.toString());}catch(e){}
  db.from("cervello_capitoli").select("id,titolo,squadra_id").eq("id",id).maybeSingle().then(function(r){
    if(!r||r.error||!r.data||vista!=="cervello")return;
    if(r.data.squadra_id){team.id=r.data.squadra_id;team.tipo="team";}
    leggiCapLivello(r.data,!!r.data.squadra_id);},function(){});
}
function capLivello(){
  capDaLink();
  var box=$("#ce-livello");if(!box||!io.id)return;
  db.from("cervello_capitoli").select("id,titolo").not("livello","is",null).order("ordine").order("aperto_il").then(function(r){
    if(!document.body.contains(box)||!r||r.error||!(r.data||[]).length)return;
    box.innerHTML='<div style="margin-top:14px;display:flex;flex-direction:column;gap:8px">'+r.data.map(function(k){
      return '<button class="cerchio-b" data-cap-l="'+k.id+'"><span><b>'+esc(k.titolo)+'</b></span><span>›</span></button>';}).join("")+'</div>';
    box.querySelectorAll("[data-cap-l]").forEach(function(b){b.onclick=function(){
      var id=b.getAttribute("data-cap-l"),k=r.data.filter(function(x){return x.id===id;})[0];leggiCapLivello(k);};});
  },function(){});
}
/* 6/11/2026 · Gab: «possiamo però avere un tasto da mettere nel cervello per indicare le cose che sono state inserite e che potrebbero necessitare di una correzione, di un editing» · «Corregge va al team di riferimento, come obiettivo». SQL 181 fm_cervello_da_correggere */
function corrTasto(g){
  if(!g||!g.id||!io.id||!(io.nucleo||io.grado!=="ospite")||!("da_correggere" in g))return '';
  return '<div class="corr" data-corr-box="'+esc(g.id)+'">'+(g.da_correggere?'<span class="corr-si">Segnalata da correggere · è tra gli obiettivi del team</span>':'<button type="button" class="corr-b" data-corr="'+esc(g.id)+'">Da correggere</button>')+'</div>';
}
function corrLega(box){
  box.querySelectorAll("[data-corr]").forEach(function(b){b.onclick=function(){
    var id=b.getAttribute("data-corr"),w=box.querySelector('[data-corr-box="'+id+'"]');
    w.innerHTML='<label class="corr-l">Cosa va corretto? (se vuoi)</label><input type="text" maxlength="300" class="corr-t"><div class="corr-az"><button type="button" class="corr-b pieno">Segnala</button><button type="button" class="corr-b">Annulla</button></div><p class="corr-e" aria-live="polite"></p>';
    var t=w.querySelector("input"),bs=w.querySelectorAll("button"),e=w.querySelector(".corr-e");t.focus();
    bs[1].onclick=function(){w.innerHTML='<button type="button" class="corr-b" data-corr="'+esc(id)+'">Da correggere</button>';corrLega(box);};
    bs[0].onclick=function(){bs[0].disabled=true;e.textContent="Un momento…";
      db.rpc("fm_cervello_da_correggere",{p_riga:id,p_motivo:t.value.trim()||null}).then(function(r){
        if(r&&!r.error&&r.data==="ok"){w.innerHTML='<span class="corr-si">Segnalata da correggere · è tra gli obiettivi del team</span>';return;}
        bs[0].disabled=false;e.textContent=(r&&r.data)||errore(r&&r.error);},function(x){bs[0].disabled=false;e.textContent=errore(x);});};
  };});
}
/* 7/11/2026 · storico versioni delle card (SQL 209): fm_card_versioni, fm_card_ripristina, fm_card_cancellate. Senza le funzioni il tasto non c'è. */
var VER_AZ={modifica:"Modificata",cancellata:"Cancellata",ripristino:"Ripristinata"};
function verQuando(t){return new Date(t).toLocaleString("it-IT",{day:"numeric",month:"long",hour:"2-digit",minute:"2-digit"});}
function verRiga(v,idk,tasto){
  return '<div class="ver-v"><small>'+esc(VER_AZ[v.azione]||v.azione||"")+' · '+esc(verQuando(v[idk]))+(v.chi_nome?' · '+esc(v.chi_nome):'')+'</small>'+
    '<p>'+esc(v.testo||"").replace(/\n/g,"<br>")+'</p>'+(tasto?'<button type="button" class="corr-b" data-ripristina="'+esc(v[tasto])+'">Ripristina</button>':'')+'</div>';
}
function verRipristina(w,k,daTeam){
  w.querySelectorAll("[data-ripristina]").forEach(function(b){b.onclick=function(){b.disabled=true;
    db.rpc("fm_card_ripristina",{p_versione:b.getAttribute("data-ripristina")}).then(function(r){
      if(r&&!r.error&&r.data==="ok"){leggiCapLivello(k,daTeam);return;}
      b.disabled=false;b.insertAdjacentHTML("afterend",'<p class="corr-e">'+esc((r&&!r.error&&r.data)||errore(r&&r.error))+'</p>');},
      function(x){b.disabled=false;alert(errore(x));});};});
}
function verLega(box,k,daTeam){
  if(!io.id||!db)return;
  db.rpc("fm_card_cancellate",{p_capitolo:k.id}).then(function(r){
    if(!r||r.error||!$("#cl-righe"))return;
    box.querySelectorAll("[data-ver-box]").forEach(function(w){var id=w.getAttribute("data-ver-box");
      w.innerHTML='<button type="button" class="corr-b" data-ver="'+esc(id)+'" style="margin-top:10px">Versioni</button>';
      w.querySelector("[data-ver]").onclick=function(){
        if(w.querySelector(".ver-l")){w.querySelector(".ver-l").remove();return;}
        w.insertAdjacentHTML("beforeend",'<div class="ver-l"><p class="nota">Un momento…</p></div>');var L=w.querySelector(".ver-l");
        db.rpc("fm_card_versioni",{p_riga:id}).then(function(q){
          var l=(q&&!q.error&&q.data)||[];
          L.innerHTML=l.length?l.map(function(v){return verRiga(v,"salvata_il",v.azione==="cancellata"?null:"id");}).join(""):'<p class="nota">Nessuna versione precedente.</p>';
          verRipristina(L,k,daTeam);},function(){L.innerHTML='<p class="nota">Le versioni non si leggono adesso.</p>';});};});
    var c=r.data||[];if(!c.length)return;
    box.insertAdjacentHTML("beforeend",'<section class="card ver-canc" style="padding:18px;border-radius:18px"><h2 style="font-family:var(--display);font-weight:600;font-size:21px;color:var(--oro);margin:0 0 8px">Card cancellate</h2>'+
      c.map(function(v){v.azione=v.azione||"cancellata";return verRiga(v,"cancellata_il","versione_id");}).join("")+'</section>');
    verRipristina(box.querySelector(".ver-canc"),k,daTeam);
  },function(){});
}
function leggiCapLivello(k,daTeam){
  var c=$("#corpo");window.scrollTo(0,0);
  var lk=new URL("strumento.html?v=cervello&cap="+encodeURIComponent(k.id),location.href).href;
  c.innerHTML='<div style="margin-bottom:4px;display:flex;gap:10px;flex-wrap:wrap"><button class="btn" id="ce-indietro">'+(daTeam?'← Torna al team':'← Torna al Cervello')+'</button><button class="btn pieno" id="cl-invia">Invia</button></div><p class="nota" id="cl-fatto" hidden>Link copiato.</p>'+
    '<p class="et">Cervello</p><h1 style="font-family:var(--display);font-weight:400;font-size:28px;letter-spacing:.05em;margin:4px 2px 12px">'+esc(k.titolo)+'</h1>'+
    '<div id="cl-righe" style="display:flex;flex-direction:column;gap:12px"><p class="nota">Un momento…</p></div>';
  $("#ce-indietro").onclick=function(){vai(daTeam?"team":(window.fmCapDa||"cervello"));};
  /* 1 nov, Gab: il link da mandare a chi è nel team; lo apre solo chi può leggere il capitolo */
  $("#cl-invia").onclick=function(){
    if(navigator.share){navigator.share({title:k.titolo,url:lk}).catch(function(){});return;}
    (navigator.clipboard?navigator.clipboard.writeText(lk):Promise.reject()).then(function(){$("#cl-fatto").hidden=false;},function(){prompt("Copia il link",lk);});};
  db.from("cervello_righe").select("id,testo,scritta_il,da_correggere,file,file_nome").eq("capitolo_id",k.id).order("scritta_il").then(function(q){
    if(q&&q.error)return db.from("cervello_righe").select("id,testo,scritta_il").eq("capitolo_id",k.id).order("scritta_il");return q;}).then(function(q){
    var box=$("#cl-righe");if(!box)return;
    if(!q||q.error){box.innerHTML='<p class="nota">Il capitolo non si legge adesso.</p>';return;}
    box.innerHTML=(q.data||[]).map(function(g){
      var p=String(g.testo||"").split(/\n\s*\n/),h=p.shift();
      return '<section class="card" style="padding:18px;border-color:var(--oro);border-radius:18px">'+
        '<h2 style="font-family:var(--display);font-weight:600;font-size:21px;color:var(--oro);margin:0 0 8px">'+esc(h)+'</h2>'+
        p.map(function(x){return '<p style="margin:0 0 10px;font-size:18px;line-height:1.55">'+esc(x).replace(/\n/g,"<br>")+'</p>';}).join("")+
        /* 25/11/2026, Gab: «e mettere dentro proprio il pdf» · solo documenti del sito (cartella documenti/) */
        (g.file&&/^documenti\/[a-z0-9-]+\.pdf$/.test(g.file)?'<div class="fine"><a class="mini oro" href="'+esc(g.file)+'" target="_blank" rel="noopener">Apri il PDF</a></div>':'')+corrTasto(g)+'<div data-ver-box="'+esc(g.id)+'"></div></section>';}).join("");
    corrLega(box);verLega(box,k,daTeam);
  },function(){var box=$("#cl-righe");if(box)box.innerHTML='<p class="nota">Il capitolo non si legge adesso.</p>';});
}
function vCervello(){
  var c=$("#corpo");
  /* 23 ott, Gab: «Schiacci coscienza e si apre il tasto che ti porta nel cervello digitale Felicitas»; le Cartelle vanno dentro Coscienza */
  setTimeout(capLivello,0);
  setTimeout(function(){if(vista!=="cervello"||$("#cos-cima"))return;c.insertAdjacentHTML("afterbegin",'<div id="cos-cima" class="cos-cima"><a class="evid" href="coscienza.html"><small>Coscienza</small><b>La mappa della Coscienza ›</b></a>'+(io.id?'<button class="alto-b" data-vai="cartelle">\u25a4 Cartelle</button>':'')+'</div>');legaVai($("#cos-cima"));},0);
  /* 19 ott 20:16-20:20, Gab: cosa puoi fare, con e senza AI. «10 euro al mese […]» · «ok 10 o karma yoga».
     19 ott 21:07-21:08, Gab (thread «Attiva il tuo cervello»): il percorso «20 euro a settimana», «o paghi 80 euro al mese o fai il karma yoga» · «per l integrazione sono 26». I 10 € non includono più la base del praticantato.
     20 ott, Gab: «abbiamo superato il discorso 10 e 26»: i due prezzi sono tolti finché il prezzo per la singola persona non è deciso.
     I quattro punti sono le sue parole (20:17), così come le ha scritte. */
  /* 20 ott, Gab: «sistema integrato che mi mostri visivamente il punto della situazione»; 21 ott 00:08: «avevamo detto che cervello diventava un contesto piu chiaro legato ai gruppi e alla gestion del registro con tanto di area chat e dirette».
     In cima i gruppi (lo spazio: chat, diretta, registro), poi il registro per voce, poi il percorso del talento; il libro e cosa puoi fare in fondo. */
  var coscienzaH=''+
    /* Gab, 15/10, ripreso il 19/10 19:35 */
    '<p class="nota" style="margin:8px 2px 0">Il Cervello è open source, senza rivendita dei dati, e l\'esportazione completa resta sempre disponibile.</p>'+
    /* 20 ott 12:01-12:03, Gab: «sistema di coscienza è il contesto che integra il cosa e il perchè» · «nella pagina cervello va aggiunto sotto, dove c e anche open source, sistema di coscienza» */
    '<p class="nota" style="margin:6px 2px 0"><b>Sistema di coscienza</b>: «il contesto che integra il cosa e il perché».</p>';
  var libroH=''+
    '<a class="rimando" href="cervello.html?c=10182300"><span><b style="font-family:var(--serif);font-size:22px">Il cervello Felicitas</b><br><small style="font-weight:400;color:var(--tenue)">Il libro che resta.</small></span><span>›</span></a>'+
    '<p class="nota" style="margin:10px 2px 0"><a href="piani.html" style="color:#D4AF6A">I prezzi sono nella pagina Piani.</a></p>';
  c.innerHTML='<p class="et">Cervello</p>'+cercaHTML()+videoHTML("cervello")+ricTasti()+
    (io.id?
      '<div id="ce-onda"></div>'+
      '<p class="et" style="margin-top:10px">I tuoi gruppi</p><div class="cerchi" id="ce-lista"><p class="nota">Un momento…</p></div>'+
      '<div id="ce-voci"></div>'+'<div id="ce-livello"></div>'+
      '<p class="et" style="margin-top:14px">Il cervello digitale</p>'+
      '<button class="cerchio-b" data-cerchio="io"><span><b>Il percorso del talento</b><small>i capitoli di '+esc(io.nome||"chi entra")+' · li legge solo chi li scrive</small></span><span>›</span></button>'+
      /* 20 ott 12:00, Gab: «i prodotti e le stanze vanno resi visibili in cervello» */
      '<p class="et" style="margin-top:14px">Prodotti e stanze</p><div class="stanze-o">'+STANZE_O.map(function(x){return '<a href="'+x[1]+'" style="--c:'+x[2]+'">'+esc(x[0])+'</a>';}).join("")+'</div><div id="ce-prodotti"></div>'+
      coscienzaH+
      '<details class="ce-libro"><summary>Il libro Felicitas e cosa puoi fare nel Cervello</summary>'+libroH+'</details>'
    :coscienzaH+libroH+'<div class="card" style="margin-top:14px"><span class="t">Il percorso del talento e i cerchi, cioè il villaggio, i vicinati, i gruppi e le aziende, si vedono dopo l\'accesso.</span><div class="fine"><a class="mini oro" href="'+ENTRA+'">Entra</a></div></div>')+
    (io.id&&io.nucleo?'<p class="et" style="margin-top:14px">Porta un\'azienda nel Cervello · per il nucleo</p><div class="card modulo" id="az-apri">'+
      /* dal file dei costi (Attiva il tuo cervello, 19/10), riga Azienda; la consegna a domicilio non è pronta (Gab 19:33) */
      '<span class="t">L\'azienda trova: gestionale e logistica, cervello aggiornato, comunicazione tra i team (mail delle 9 e delle 22 con la parte di ciascuno), visibilità su Felicitas.</span>'+
      '<label class="m" for="az-nome" style="margin-top:8px">Nome dell\'azienda</label><input type="text" id="az-nome">'+
      '<label class="m" for="az-terr" style="margin-top:6px">Territorio</label><input type="text" id="az-terr">'+
      '<label class="m" for="az-ref" style="margin-top:6px">Mail del referente (deve essere già entrato)</label><input type="email" id="az-ref">'+
      '<div class="azioni" style="margin-top:8px"><button class="btn pieno" id="az-vai">Apri lo spazio dell\'azienda</button><span class="m" id="az-esito"></span></div></div>':'');
  cercaLega();
  if(!io.id)return;
  cerchiCache={io:{id:"io",tipo:"io",nome:"Il percorso del talento",dentro:true}};
  legaCerchi(c);
  vVociRegistro($("#ce-voci"));
  db.from("prodotti").select("id,nome,autore,prezzo,si_compra").eq("stato","pubblico").order("creato_il",{ascending:false}).limit(6).then(function(r){
    var e=$("#ce-prodotti"),l=(r&&!r.error&&r.data)||[];if(!e||!l.length)return;
    e.innerHTML='<div class="card"><p class="et">Gli ultimi prodotti nell\'Emporio</p>'+l.map(function(x){return '<div class="persona"><div><b>'+esc(x.nome||"")+'</b><small>'+esc(x.si_compra===false?"richiedi al responsabile":(x.prezzo?x.prezzo+" €":(x.autore||"")))+'</small></div></div>';}).join("")+
      '<div class="fine"><a class="mini" href="emporio.html?c=10182300">Tutto l\'Emporio ›</a></div></div>';},function(){});
  if(io.nucleo)$("#az-vai").onclick=function(){var b=this,n=$("#az-nome").value.trim();if(n.length<2){$("#az-esito").textContent="Il nome serve.";return;}
    b.disabled=true;db.rpc("fm_azienda_apri",{p_nome:n,p_territorio:$("#az-terr").value.trim(),p_mail_referente:$("#az-ref").value.trim()}).then(function(r){b.disabled=false;
      if(r&&r.error){$("#az-esito").textContent=errore(r.error);return;}
      if(r.data!=="ok"){$("#az-esito").textContent=r.data;if(!/^Azienda aperta/.test(r.data))return;}
      vCervello();},function(){b.disabled=false;});};
  dirette().then(function(d){var e=$("#ce-onda");if(!e||vista!=="cervello"||!d.length)return;
    e.innerHTML=d.map(function(x){return '<a class="sp-diretta" href="diretta-bozza.html?puntata='+encodeURIComponent(x.id)+'"><span class="sp-punto" aria-hidden="true"></span><span><b>In diretta</b> · '+esc(x.titolo||"")+'</span><span>entra ›</span></a>';}).join("");});
  Promise.all([
    db.rpc("fm_cerchi").then(function(r){return r&&!r.error?(r.data||[]):null;},function(){return null;}),
    db.from("orme").select("id,titolo").eq("id",VILLAGGIO).maybeSingle().then(function(r){return (r&&r.data&&r.data.titolo)||"Il villaggio";},function(){return "Il villaggio";}),
    /* lo spazio di ogni gruppo (SQL 92): il nome scelto, l'ultimo messaggio della chat */
    db.from("spazi_gruppo").select("cerchio_id,nome").then(function(r){return r&&!r.error?(r.data||[]):[];},function(){return [];}),
    db.from("gruppo_messaggi").select("cerchio_id,scritto_il").order("scritto_il",{ascending:false}).limit(300).then(function(r){return r&&!r.error?(r.data||[]):[];},function(){return [];}),
    /* i compiti aperti del registro per gruppo (SQL 90) */
    db.from("registro").select("vicinato_id,squadra_id,azienda_id,stato").in("stato",["aperto","preso"]).limit(1000).then(function(r){return r&&!r.error?(r.data||[]):[];},function(){return [];})
  ]).then(function(v){
    var e=$("#ce-lista");if(!e||vista!=="cervello")return;
    var l=v[0];
    if(l===null){e.innerHTML='<div class="vuoto">I gruppi non si leggono adesso.</div>';return;}
    cerchiCache[VILLAGGIO]={id:VILLAGGIO,tipo:"villaggio",nome:v[1],dentro:true,guido:io.coordina};
    l.forEach(function(x){cerchiCache[x.id]=x;});
    var nomeSp={},ultimo={},aperti={},presi={};
    v[2].forEach(function(x){nomeSp[x.cerchio_id]=x.nome;});
    v[3].forEach(function(x){if(!ultimo[x.cerchio_id])ultimo[x.cerchio_id]=x.scritto_il;});
    v[4].forEach(function(g){var k=g.vicinato_id||g.squadra_id||g.azienda_id||VILLAGGIO;aperti[k]=(aperti[k]||0)+(g.stato==="aperto"?1:0);presi[k]=(presi[k]||0)+(g.stato==="preso"?1:0);});
    var vic=l.filter(function(x){return x.tipo==="vicinato";});
    function quando(t){var d=new Date(t),o=new Date();return d.toDateString()===o.toDateString()?"oggi alle "+hhmm(t):d.toLocaleDateString("it-IT",{day:"numeric",month:"long"});}
    function bott(x,sotto){
      var k=x.id,stato=[];
      if(aperti[k])stato.push(aperti[k]+(aperti[k]===1?" da prendere":" da prendere"));
      if(presi[k])stato.push(presi[k]+" in corso");
      if(ultimo[k])stato.push("chat: "+quando(ultimo[k]));
      return '<button class="cerchio-b ce-gr" data-cerchio="'+esc(k)+'"><span><b>'+esc(nomeSp[k]||x.nome)+'</b><small>'+esc(sotto)+'</small>'+
        (stato.length?'<small class="ce-stato">'+esc(stato.join(" · "))+'</small>':'')+'</span>'+
        (x.guido?'<span class="chip on">'+(x.tipo==="azienda"?"referente":"guidi")+'</span>':x.dentro?'<span class="chip on">dentro</span>':'<span>›</span>')+'</button>';}
    function sottoDi(x){return (nomeSp[x.id]&&nomeSp[x.id]!==x.nome?x.nome+' · ':'')+x.tipo+(x.territorio?' · '+x.territorio:'')+' · '+(+x.persone===1?'1 persona':(+x.persone)+' persone');}
    /* Gab, 19/10 20:18: «villaggio è un team operativo organizzato in vicinati» */
    var vil=bott(cerchiCache[VILLAGGIO],'il villaggio, un team operativo organizzato in vicinati · '+vic.length+(vic.length===1?' vicinato':' vicinati'));
    var ordine=["gruppo","vicinato","azienda"];
    function lista(f){return ordine.map(function(t){return l.filter(function(x){return x.tipo===t&&f(x);}).map(function(x){return bott(x,sottoDi(x));}).join("");}).join("");}
    var miei=lista(function(x){return x.dentro||x.guido;}),altri=lista(function(x){return !(x.dentro||x.guido);});
    e.innerHTML=(miei||'<p class="nota">Non sei ancora in un gruppo: ti aggiunge chi guida il gruppo, con la mail con cui sei entrato.</p>')+vil+
      (altri?'<details class="ce-altri"><summary>Gli altri gruppi'+(io.nucleo?' · li vedi perché sei nel nucleo':'')+'</summary><div class="cerchi">'+altri+'</div></details>':'');
    legaCerchi(e);
  });
}
/* 25/11/2026 · Gab: «ok partiamo dalle parole» · «chi non è entrato vede le cose pubbliche» ·
   «quello degli elementi è il primo strato di suddivisione / poi abbiamo gli ambiti».
   Ricerca per parole nel Cervello (SQL 315, fm_cervello_cerca_parole): ognuno trova solo ciò che può leggere.
   Elementi con i nomi delle stanze (regola 19 ott 16:14) e il simbolo del menu; ambiti = i sei della home. */
var CERCA_EL=[["terra","obiettivi"],["acqua","emporio"],["fuoco","azione"],["aria","giornale"],["etere","cervello"]];
var CERCA_AMB=[["rete_territorio","Rete e territorio"],["produzione_lavoro","Produzione e lavoro"],["alimentazione","Alimentazione consapevole"],["comunita","Comunità"],["conoscenza_formazione","Conoscenza e formazione"],["innovazione_cervello","Innovazione e Cervello Digitale Evoluto"]];
var cercaStato={el:null,amb:null,testo:""};
function cercaHTML(){
  function ico(v){var b=document.querySelector('nav [data-v="'+v+'"] .ic');return b?b.innerHTML:"";}
  return '<div class="ce-cerca"><form id="cc-f" role="search"><label for="cc-q" class="cc-lab">Cerca nel Cervello</label>'+
    '<div class="cc-riga"><input type="search" id="cc-q" placeholder="Una o più parole" autocomplete="off" value="'+esc(cercaStato.testo)+'"><button class="btn pieno" type="submit">Cerca</button></div></form>'+
    '<div class="cc-filtri" id="cc-el">'+CERCA_EL.map(function(e){var n=(ELEMENTI.filter(function(x){return x[0]===e[0];})[0]||[e[0],e[0]])[1];
      return '<button type="button" class="cc-ch" data-el="'+e[0]+'" aria-pressed="'+(cercaStato.el===e[0])+'"><span class="cc-ic" aria-hidden="true">'+ico(e[1])+'</span>'+esc(n)+'</button>';}).join("")+'</div>'+
    '<div class="cc-filtri" id="cc-amb"'+(cercaStato.el?'':' hidden')+'>'+CERCA_AMB.map(function(a){
      return '<button type="button" class="cc-ch" data-amb="'+a[0]+'" aria-pressed="'+(cercaStato.amb===a[0])+'">'+esc(a[1])+'</button>';}).join("")+'</div>'+
    '<div id="cc-esito" aria-live="polite"></div></div>';
}
function cercaLega(){
  var f=$("#cc-f");if(!f)return;
  f.onsubmit=function(e){e.preventDefault();cercaStato.testo=$("#cc-q").value.trim();cercaVai();};
  $("#cc-el").querySelectorAll("[data-el]").forEach(function(b){b.onclick=function(){var v=b.getAttribute("data-el");
    cercaStato.el=cercaStato.el===v?null:v;if(!cercaStato.el)cercaStato.amb=null;
    $("#cc-el").querySelectorAll("[data-el]").forEach(function(x){x.setAttribute("aria-pressed",String(x.getAttribute("data-el")===cercaStato.el));});
    $("#cc-amb").querySelectorAll("[data-amb]").forEach(function(x){x.setAttribute("aria-pressed",String(x.getAttribute("data-amb")===cercaStato.amb));});
    $("#cc-amb").hidden=!cercaStato.el;if(cercaStato.testo)cercaVai();};});
  $("#cc-amb").querySelectorAll("[data-amb]").forEach(function(b){b.onclick=function(){var v=b.getAttribute("data-amb");
    cercaStato.amb=cercaStato.amb===v?null:v;
    $("#cc-amb").querySelectorAll("[data-amb]").forEach(function(x){x.setAttribute("aria-pressed",String(x.getAttribute("data-amb")===cercaStato.amb));});
    if(cercaStato.testo)cercaVai();};});
  if(cercaStato.testo)cercaVai();
}
function cercaVai(){
  var e=$("#cc-esito");if(!e)return;var t=cercaStato.testo;
  if(t.length<2){e.innerHTML='<p class="nota">Scrivi almeno due lettere.</p>';return;}
  if(!db){e.innerHTML='<p class="nota">La ricerca non risponde adesso.</p>';return;}
  e.innerHTML='<p class="nota">Un momento…</p>';
  db.rpc("fm_cervello_cerca_parole",{p_testo:t,p_elemento:cercaStato.el,p_ambito:cercaStato.amb,p_quanti:40}).then(function(r){
    if(!document.body.contains(e)||t!==cercaStato.testo)return;
    if(!r||r.error){e.innerHTML='<p class="nota">La ricerca non risponde adesso.</p>';return;}
    var ord=[],per={};
    (r.data||[]).forEach(function(x){if(!per[x.voce_id]){per[x.voce_id]={id:x.voce_id,titolo:x.voce,fr:[]};ord.push(per[x.voce_id]);}
      if(x.riga_id&&x.frammento&&per[x.voce_id].fr.length<2)per[x.voce_id].fr.push(x.frammento);});
    if(!ord.length){e.innerHTML='<p class="nota">Nessuna voce trovata.</p>';return;}
    e.innerHTML=ord.map(function(v){return '<button type="button" class="cc-voce" data-cc-voce="'+esc(v.id)+'"><b>'+esc(v.titolo)+'</b>'+
      v.fr.map(function(f){return '<span>'+esc(f).replace(/\n+/g," · ")+'</span>';}).join("")+'</button>';}).join("");
    e.querySelectorAll("[data-cc-voce]").forEach(function(b){b.onclick=function(){var v=per[b.getAttribute("data-cc-voce")];leggiCapLivello({id:v.id,titolo:v.titolo});};});
  },function(){if(document.body.contains(e))e.innerHTML='<p class="nota">La ricerca non risponde adesso.</p>';});
}
function legaCerchi(e){e.querySelectorAll("[data-cerchio]").forEach(function(b){b.onclick=function(){cerchio=b.getAttribute("data-cerchio");vai("cerchio");};});}
/* in fondo a ogni cerchio, il ritorno ben visibile (Gab 20:16: «non c e il bottone per tornare indietro») */
function fondoIndietro(c){
  c.insertAdjacentHTML("beforeend",'<div class="azioni" style="margin-top:18px"><button class="btn" id="ce-indietro2" style="width:100%">← Torna al Cervello</button></div>');
  $("#ce-indietro2").onclick=function(){vai("cervello");};
}
