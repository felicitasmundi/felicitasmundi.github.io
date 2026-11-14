/* GESTIONALE A TRE PIANI (SQL 168). 5 nov 2026, Gab: «applica subito il dirsorso dei tre piani» · 11:40 «io come nucleo, che chi ha ruoli responsabili e poi gli operativi, dovrebbero tutti usare lo strumento che mostra cosa c e da fare oggi e l avanzamento» · 11:41 «ok» (Oggi = i tre piani, Obiettivi = dove si creano e si prendono).
   In cima a Oggi, per chi è entrato: piano 3 «I numeri di oggi» (nucleo) · piano 2 «La mia area» (chi ha un ruolo, il nucleo) · piano 1 «Le mie cose da fare» (tutti). */
var tre={aperta:{},tipi:{}};
function nomeArea(r){for(var f in RUOLI){var x=RUOLI[f].filter(function(y){return y[0]===r;})[0];if(x)return x[1];}return r==="senza area"?"Senza area":r;}
function dataBreve(d){return d?new Date(d+"T12:00").toLocaleDateString("it-IT",{day:"numeric",month:"long"}):"";}
function legaRispondi(box,di){
  /* SQL 171 · 5 nov, Gab: «se rispondo li arriva la mail al client» · le risposte del cliente arrivano a mentecreativa@ */
  box.querySelectorAll("[data-bcrisp]").forEach(function(b){b.onclick=function(){var id=b.getAttribute("data-bcrisp"),w=$("#bcr-"+id);if(!w)return;
    if(w.innerHTML){w.innerHTML="";return;}w.innerHTML='<p class="nota">Un momento…</p>';
    db.rpc("fm_prenotazione_risposte",{p_riga:id}).then(function(r){var l=(r&&!r.error&&r.data)||[];
      w.innerHTML=l.map(function(x){return '<div class="bc-r"><span class="m">'+esc(x.chi||"")+' · '+esc(new Date(x.scritto_il).toLocaleDateString("it-IT",{day:"numeric",month:"long"}))+' · '+(x.via==="mail"?"per mail":"nell'app")+'</span><span class="t" style="white-space:pre-wrap">'+esc(x.testo)+'</span></div>';}).join("")+
        '<label class="tre-label">La tua risposta<textarea id="bcr-t-'+esc(id)+'" rows="4" maxlength="2000"></textarea></label>'+
        '<div class="fine"><button class="mini oro" id="bcr-b-'+esc(id)+'">Invia</button></div><p class="nota" id="bcr-x-'+esc(id)+'"></p>';
      $("#bcr-b-"+id).onclick=function(){var t=$("#bcr-t-"+id).value.trim(),x=$("#bcr-x-"+id),bb=this;if(!t){x.textContent="Scrivi la risposta.";return;}bb.disabled=true;
        db.rpc("fm_prenotazione_rispondi",{p_riga:id,p_testo:t}).then(function(r){var v=r&&!r.error?r.data:null;
          if(v&&String(v).indexOf("ok:")===0){x.textContent=v==="ok:mail"?"Mandata per mail.":"Arrivata nell'app.";setTimeout(di,1200);return;}
          bb.disabled=false;x.textContent=v||(r&&r.error?errore(r.error):"Non è partita. Si può riprovare.");},
          function(){bb.disabled=false;x.textContent="Non è partita. Si può riprovare.";});};
    },function(){w.innerHTML='<p class="nota">Non si è aperto. Si può riprovare.</p>';});};});
}
function treOggi(){
  var box=$("#o-tre");if(!box||!io.id)return;
  var guido=io.nucleo||io.coordina||(io.ruoli||[]).length>0;
  Promise.all([
    io.nucleo?db.rpc("fm_gestionale_oggi").then(function(r){return r&&!r.error?r.data:null;},function(){return null;}):Promise.resolve(null),
    guido?db.rpc("fm_la_mia_area").then(function(r){return r&&!r.error?(r.data||[]):null;},function(){return null;}):Promise.resolve([]),
    guido?db.rpc("fm_gestionale_stanze").then(function(r){return r&&!r.error?(r.data||[]):[];},function(){return [];}):Promise.resolve([]),
    db.rpc("fm_mie_cose").then(function(r){return r&&!r.error?(r.data||[]):null;},function(){return null;})
  ]).then(function(v){
    var ids=(v[1]||[]).filter(function(x){return x.fonte==="registro";}).map(function(x){return x.id;});
    return Promise.all([ids.length?db.from("registro").select("id,tipo").in("id",ids).then(function(r){return (r&&!r.error&&r.data)||[];},function(){return [];}):Promise.resolve([]),
      leggiObiettivi().catch(function(){return [];})]).then(function(w){tre.tipi={};w[0].forEach(function(x){tre.tipi[x.id]=x.tipo;});return v;});
  }).then(function(v){
    var box=$("#o-tre");if(!box||vista!=="oggi")return;
    if(v[3]===null&&v[1]===null){box.innerHTML=io.nucleo?'<p class="nota" style="margin:0 2px 10px">I tre piani di Oggi si aprono con l\'SQL 168.</p>':'';return;}
    var area=v[1]||[],stanze=v[2]||[],mie=(v[3]||[]),n=v[0],h="";
    /* 5 nov 14:54, Gab: «sarebbe molto piu bello avere delle card che scorrono» · 15:06 «è il nuove senza soggetto che mi crea disagio […] questi sono obiettivi» · 15:08 «per me è ok» → bacheca a colonne, card che scorrono di lato */
    function num(v,t,r){return '<div class="tre-num'+(r&&v?' r':'')+'"><b>'+(+v||0)+'</b><span>'+t+'</span></div>';}
    function etich(x){return x.fonte==="assistenza"?"Assistenza comunitaria integrata":x.fonte==="logistica"?"logistica":tre.tipi[x.id]==="richiesta"?"prenotazione":"obiettivo";}
    function cardA(x,col){return '<div class="tre-card" style="--tc:'+col+'"><span class="tre-chip">'+(x.ferma?'in ritardo · '+(+x.da_giorni)+(x.da_giorni==1?' giorno':' giorni'):esc(etich(x)))+'</span><span class="t">'+esc(x.titolo)+'</span>'+
      '<span class="m">'+esc(nomeArea(x.ruolo))+(x.chi?' · '+esc(x.chi):'')+(x.entro_il?' · entro il '+esc(dataBreve(x.entro_il)):'')+'</span>'+
      (x.fonte!=="logistica"?'<div class="tre-tasti"><button class="mini" data-tre-ass="'+esc(x.fonte+"|"+x.id+"|"+x.ruolo)+'">'+(x.stato==="aperta"?'Assegna':'Riassegna')+'</button>'+(tre.tipi[x.id]==="richiesta"?'<button class="mini oro" data-bcrisp="'+esc(x.id)+'">Rispondi</button>':'')+'</div><div class="tre-scegli" id="tre-s-'+esc(x.id)+'"></div>'+(tre.tipi[x.id]==="richiesta"?'<div class="bc-risp" id="bcr-'+esc(x.id)+'"></div>':''):(x.stato==="aperta"?'<button class="mini oro" data-tre-cprendo="'+esc(x.id)+'">Lo prendo</button>':''))+'</div>';}
    /* piano 3 · nucleo */
    if(n){
      var rs={t:0,l:0};(n.stanze||[]).forEach(function(s){rs.t+=+s.totale;rs.l+=+s.libere;});
      h+='<p class="et">Gli obiettivi di oggi</p><div class="tre-fila">'+
        num(n.entrate_oggi,n.entrate_oggi==1?'obiettivo nuovo oggi':'obiettivi nuovi oggi')+num(n.aperte,n.aperte==1?'obiettivo non assegnato':'obiettivi non assegnati')+num(n.prese,n.prese==1?'obiettivo in corso':'obiettivi in corso')+
        '<button type="button" class="tre-num'+(n.ferme?' r':'')+'" id="tre-ferme" aria-expanded="false"><b>'+(+n.ferme)+'</b><span>'+(n.ferme==1?'obiettivo in ritardo':'obiettivi in ritardo')+'</span></button>'+
        num(n.chiuse_oggi,n.chiuse_oggi==1?'obiettivo chiuso oggi':'obiettivi chiusi oggi')+(rs.t?num(rs.t,'stanze · '+rs.l+(rs.l==1?' libera':' libere')):'')+'</div><div id="tre-ferme-l" hidden></div>'+
        '<div class="card tre-rt"><b>Ruoli e team</b><span class="m">Le persone, i ruoli, i team e chi vede cosa.</span><div class="fine"><button class="mini oro" data-vai="persone">Persone</button><button class="mini oro" data-vai="staff">Aggiungi una persona</button><button class="mini" data-vai="createam">Crea un team</button><button class="mini" data-vai="plancia">Chi vede cosa</button></div></div>';
    }
    /* piano 2 · chi ha un ruolo */
    if(area.length||stanze.length){
      var cols=[["Da fare · non assegnati",area.filter(function(x){return !x.ferma&&x.stato==="aperta";}),"#6FA8D6"],
                ["In corso",area.filter(function(x){return !x.ferma&&x.stato==="presa";}),"#D4AF6A"],
                ["In ritardo",area.filter(function(x){return x.ferma;}),"#E07A55"]];
      h+='<p class="et" style="margin-top:8px">Gli obiettivi della mia area</p><div class="tre-bacheca">'+cols.map(function(c){
        return '<div class="tre-col"><p class="tre-colt">'+c[0]+' <i>'+c[1].length+'</i></p><div class="tre-fila">'+
          (c[1].length?c[1].slice(0,30).map(function(x){return cardA(x,c[2]);}).join(""):'<div class="tre-card tre-vuota"><span class="m">Niente qui.</span></div>')+'</div></div>';}).join("")+'</div>';
      if(stanze.length)h+='<p class="tre-colt" style="margin-top:6px">Stanze <i>'+stanze.length+'</i></p><div class="tre-fila">'+stanze.map(function(s){
        var col=s.stato==="libera"?"#8DBF5E":s.stato==="occupata"?"#D4AF6A":"#E07A55";
        return '<div class="tre-card" style="--tc:'+col+'"><span class="tre-chip">'+esc(s.stato)+'</span><span class="t">'+esc(s.nome)+'</span><span class="m">'+(s.luogo?esc(s.luogo)+' · ':'')+(+s.posti)+' posti'+(s.bloccata_perche?' · '+esc(s.bloccata_perche):'')+'</span>'+
          (s.stato!=="occupata"?'<button class="mini" data-tre-stanza="'+esc(s.id)+'" data-blocca="'+(s.stato==="libera"?1:0)+'">'+(s.stato==="libera"?'Blocca':'Sblocca')+'</button>':'')+'</div>';}).join("")+'</div>';
    }
    /* piano 1 · tutti */
    h+='<p class="et" style="margin-top:8px">I miei obiettivi'+(mie.length?' · '+mie.length:'')+'</p>'+
      (mie.length?'<div class="tre-fila">'+mie.map(function(x){
        return '<div class="tre-card" style="--tc:'+(x.ferma?'#E07A55':'#8DBF5E')+'"><span class="tre-chip">'+(x.ferma?'in ritardo · '+(+x.da_giorni)+(x.da_giorni==1?' giorno':' giorni'):esc(etich(x)))+'</span><span class="t">'+esc(x.titolo)+'</span>'+
          '<span class="m">'+esc(nomeArea(x.ruolo||""))+(x.entro_il?' · entro il '+esc(dataBreve(x.entro_il)):'')+'</span>'+
          (x.fonte==="registro"?'<button class="mini oro" data-tre-fatto="'+esc(x.id)+'">Fatto</button>':x.fonte==="logistica"?'<button class="mini oro" data-tre-cfatto="'+esc(x.id)+'">Fatto</button>':'<button class="mini" data-vai="azione">Rispondi nell’Assistenza comunitaria integrata</button>')+'</div>';}).join("")+'</div>':
        '<div class="card"><span class="m">Nessun obiettivo preso, per ora. In Obiettivi c\'è quello di cui il villaggio ha bisogno.</span></div>');
    var presi=(cache.obiettivi||[]).filter(function(o){return o.stadio!=="sviluppato"&&dentroO(o).some(function(p){return p.persona_id===io.id;});});
    if(presi.length)h+='<p class="tre-colt">Obiettivi del villaggio che hai preso <i>'+presi.length+'</i></p><div class="tre-fila">'+presi.map(function(o){var st=o.stadio||"in_coda";
      return '<div class="tre-card" style="--tc:#8DBF5E"><span class="tre-chip">obiettivo</span><span class="t">'+esc(o.titolo||o.contenuto)+'</span>'+(o.entro_il?'<span class="m">entro il '+esc(dataBreve(o.entro_il))+'</span>':'')+
        '<button class="pill s-'+st+'" data-stadio="'+esc(o.id)+'" style="border:0;cursor:pointer;align-self:flex-start" aria-label="Cambia stato">'+STADI[st]+'</button></div>';}).join("")+'</div>';
    h+='<div class="fine" style="margin-top:4px"><button class="mini" data-vai="obiettivi">Tutti gli obiettivi ›</button></div>';
    box.innerHTML=h;legaVai(box);
    function dopo(x){if(x&&x.error)alert(errore(x.error));treOggi();}
    legaObiettivi(box);legaRispondi(box,treOggi);
    box.querySelectorAll("[data-tre-cprendo]").forEach(function(b){b.onclick=function(){b.disabled=true;db.rpc("fm_compito_prendo",{p_compito:b.getAttribute("data-tre-cprendo")}).then(dopo,dopo);};});
    box.querySelectorAll("[data-tre-cfatto]").forEach(function(b){b.onclick=function(){b.disabled=true;db.rpc("fm_compito_fatto",{p_compito:b.getAttribute("data-tre-cfatto")}).then(dopo,dopo);};});
    var fb=$("#tre-ferme");if(fb)fb.onclick=function(){var l=$("#tre-ferme-l");if(!l)return;
      if(!l.hidden){l.hidden=true;fb.setAttribute("aria-expanded","false");return;}
      l.hidden=false;fb.setAttribute("aria-expanded","true");l.innerHTML='<p class="nota">Un momento…</p>';
      db.rpc("fm_gestionale_ferme").then(function(r){var d=(r&&!r.error&&r.data)||[];
        l.innerHTML=d.length?d.map(function(x){return '<div class="card tre-ferma"><span class="t">'+esc(x.titolo)+'</span><span class="m">'+esc(nomeArea(x.ruolo||""))+' · '+(x.chi?'in mano a '+esc(x.chi):'non assegnato')+' · in ritardo da '+(+x.da_giorni)+(x.da_giorni==1?' giorno':' giorni')+'</span></div>';}).join(""):'<p class="nota">Nessun obiettivo in ritardo.</p>';},
        function(){l.innerHTML='<p class="nota">Non si è aperta. Si può riprovare.</p>';});};
    box.querySelectorAll("[data-tre-fatto]").forEach(function(b){b.onclick=function(){b.disabled=true;db.rpc("fm_registro_fatto",{p_riga:b.getAttribute("data-tre-fatto")}).then(dopo,dopo);};});
    box.querySelectorAll("[data-tre-stanza]").forEach(function(b){b.onclick=function(){b.disabled=true;var id=b.getAttribute("data-tre-stanza");
      (b.getAttribute("data-blocca")==="1"?db.rpc("fm_stanza_blocca",{p_stanza:id,p_perche:null}):db.rpc("fm_stanza_sblocca",{p_stanza:id})).then(dopo,dopo);};});
    box.querySelectorAll("[data-tre-ass]").forEach(function(b){b.onclick=function(){var p=b.getAttribute("data-tre-ass").split("|"),s=$("#tre-s-"+p[1]);if(!s)return;
      if(s.innerHTML){s.innerHTML="";return;}s.innerHTML='<p class="nota">Un momento…</p>';
      db.rpc("fm_area_persone",{p_ruolo:p[2]}).then(function(r){var l=(r&&!r.error&&r.data)||[];
        s.innerHTML='<label class="tre-label">A chi<select id="tre-sel-'+esc(p[1])+'"><option value="'+esc(io.id)+'">A me</option>'+l.filter(function(x){return x.id!==io.id;}).map(function(x){return '<option value="'+esc(x.id)+'">'+esc(x.nome)+'</option>';}).join("")+'<option value="">Nessuno (torna libera)</option></select></label>'+
          '<div class="fine"><button class="mini oro" id="tre-ok-'+esc(p[1])+'">Assegna</button></div>';
        $("#tre-ok-"+p[1]).onclick=function(){var v=$("#tre-sel-"+p[1]).value||null;this.disabled=true;
          db.rpc(p[0]==="assistenza"?"fm_assistenza_assegna":"fm_registro_assegna",p[0]==="assistenza"?{p_richiesta:p[1],p_persona:v}:{p_riga:p[1],p_persona:v}).then(dopo,dopo);};
      },function(){s.innerHTML='<p class="nota">Non si è aperto. Si può riprovare.</p>';});};});
  });
}
function mieiOggi(){
  leggiObiettivi().then(function(){var e=$("#o-miei");if(!e||vista!=="oggi")return;
    var m=(cache.obiettivi||[]).filter(function(o){return o.stadio!=="sviluppato"&&dentroO(o).some(function(p){return p.persona_id===io.id;});});
    e.innerHTML=m.length?'<p class="et" style="margin-top:6px">I compiti che hai preso</p><div class="miei-o">'+m.map(function(o){var s=o.stadio||"in_coda";
      return '<div class="card"><div class="riga-m"><span class="t">'+esc(o.titolo||o.contenuto)+'</span><button class="pill s-'+s+'" data-stadio="'+esc(o.id)+'" style="border:0;cursor:pointer" aria-label="Cambia stato">'+STADI[s]+'</button></div>'+
        (o.entro_il?'<span class="m">entro il '+esc(new Date(o.entro_il+"T12:00").toLocaleDateString("it-IT",{day:"numeric",month:"long"}))+'</span>':'')+'</div>';}).join("")+
      '<button class="mini" data-vai="obiettivi" style="align-self:flex-start">Tutti gli obiettivi ›</button></div>':
      '<div class="miei-o"><button class="mini" data-vai="obiettivi" style="align-self:flex-start">Obiettivi: quello di cui il villaggio ha bisogno ›</button></div>';
    legaVai(e);legaObiettivi(e);});
}
function vOggi(){
  var c=$("#corpo"),l=luna(),d=new Date();
  /* 5 nov 15:15, Gab: «a me oggi sembra confusionario» · 15:47 «ok tutto / oggi e obiettivo confermo» → per chi è entrato Oggi è solo il lavoro (i tre piani).
     Festival, Come funziona, Di cosa hai bisogno passano a Espandi (thread Espandi). L'ospite trova Oggi come prima. */
  if(io.id){c.innerHTML='<div id="o-agenda"></div><div id="o-tre"><p class="nota">Un momento…</p></div>';agendaOggi();treOggi();return;}
  var prima=false;try{prima=!localStorage.getItem("fm-come-visto");localStorage.setItem("fm-come-visto","1");}catch(e){}
  setTimeout(function(){var d=$("#o-come");if(d&&prima)d.open=true;},0);
  var g0=new Date();g0.setHours(0,0,0,0);var da=g0.getTime(),a=da+864e5;
  /* 19 ott 16:21, Gab: «aprendo l app […] anche oggi non è comprensibile» da chi arriva da fuori → in cima chi siamo (parole dell'invito al Festival) e il Festival in evidenza, voce fissa fino al 21 novembre
     20 ott 01:44, Gab: «puoi mettere la copertina dell evento nel festival in evidenza in oggi?» */
  var fest=Date.now()<new Date("2026-11-22T00:00:00").getTime();
  /* 23 ott, Gab: «La lezione è lunedì alle 19» · in cima a Oggi la prima lezione del praticantato (non ancora nel database) */
  c.innerHTML=(io.id?'<div id="o-tre"></div>':'')+'<p class="et">Praticantato</p><div class="card lezione-1"><b>La prima lezione</b><span class="t">lunedì alle 19 · con Gabriele Dettori</span></div>'+(io.id?'':'<div class="evid"><small>FelicitasMundi</small><p>FelicitasMundi è una rete di villaggi diffusi. Il primo è la Sardegna. Il villaggio diffuso è composto da tanti vicinati. Ogni vicinato rappresenta e porta nel villaggio la sua anima, la sua indipendenza, i suoi talenti, i suoi prodotti, le sue peculiarità e anche i suoi bisogni.</p><a class="vai" href="'+ENTRA+'">Entra</a> <a class="vai" style="background:transparent;color:var(--cosmo-oro);border:1px solid var(--cosmo-oro)" href="come-funziona-bozza.html?c=10182300">Come funziona</a></div>')+
    (fest?'<a class="evid" href="/felicitas-festival-21-novembre-baratili/?c=10182300"><img class="copertina" src="casa/festival-trame.jpg?v=4" alt="Felicitas Festival · TRAME: la forza di essere connessi"><small>In evidenza</small><b>Felicitas Festival</b><span>Sabato 21 novembre 2026 · dalle 10:00 · Baratili San Pietro</span><p>TRAME · la forza di essere connessi</p><span class="vai">Il programma</span></a>':'')+
    '<details class="card vid-come" id="o-come"><summary>Come funziona</summary><p class="et">Villaggi e vicinati</p>'+videoHTML("villaggi")+'<p class="et">Il cervello digitale</p>'+videoHTML("cervello")+'</details>'+
    '<p class="et">Oggi · Felicitas</p>'+
    '<div class="card"><div class="giorno">'+l.svg+'<div><b>'+esc(d.toLocaleDateString("it-IT",{weekday:"long",day:"numeric",month:"long"}))+'</b><span id="o-cielo">'+esc(l.nome)+'</span></div></div></div>'+
    '<div id="o-appunt"></div>'+
    /* 18 ott 20:36 e 22:36, Gab: «oggi può essere anche il contesto "di cosa hai bisogno?"» · da oggi «si possa entrare nella visione completa dei prodotti e assistenza» */
    /* 19 ott 18:05, Gab: «prima di cosa hai bisogno, forse vanno segnati i task che uno ha accettato, per ricordare a che punto si trova» */
    (io.id?'<div id="o-staff"></div><div id="o-reg"></div><div id="o-miei"></div><div id="o-logistica"></div>':'')+
    /* 19 ott 18:05, Gab: ogni voce scritta come parola, sotto una fila di rettangolini; 23:32 «per ora rendi visibile ciò che c e permetendo a tutto il resto di entrare una volta inserito» */
    '<p class="et" style="margin-top:6px">Di cosa hai bisogno?</p>'+STANZE_O.map(function(s){return '<div class="voce-o" style="--c:'+s[2]+'"><a class="capo-o" href="'+s[1]+'"><b>'+esc(s[0])+'</b><span>tutto ›</span></a><div class="fila-o" id="fila-'+s[3]+'"></div>'+(s[3]==="emporio"?paniereHTML():'')+'</div>';}).join("")+
    (io.id?'':'<div class="card"><b>Cosa si può fare</b><span class="t">Leggere il giornale del giorno, venire agli eventi, ascoltare le dirette, dare una mano con i bisogni del villaggio.</span></div>');
  legaVai(c);legaPaniere(c);
  santo().then(function(s){var e=$("#o-cielo");if(e&&s)e.textContent=s+" · "+l.nome;});
  Promise.all([lezioni(),dirette()]).then(function(v){var e=$("#o-appunt");if(!e)return;var h=appuntamentiHTML(v[0],v[1],da,a);
    e.innerHTML=h?'<p class="et" style="margin:4px 0 6px">Appuntamenti di oggi</p><div class="appunt">'+h+'</div>':'';});
  fileOggi();vOggiStaff();
  if(io.id)vRegistroOggi();
  if(io.id)treOggi();
  if(io.id)mieiOggi();
  if(io.id)logisticaOggi();
}
