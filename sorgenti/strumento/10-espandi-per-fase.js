/* ESPANDI PER FASE · 6/11/2026 (thread «Rifare Azione per il nucleo e lo staff»). Gab 6/11 12:14: «l aspetto elementi deve essere piu visibile
   nel cervello, mentre espandi è un aspetto pratico che deve avere però il riferimengto a seconda della fase in cui ci si trova».
   Ospite: tre blocchi (Vicinati del cibo · Assistenza comunitaria integrata · Cervello Digitale Evoluto). Ruoli e nucleo: prima i loro team.
   Gab 12:15: «c'è una differenza tra ciò che si comunica e il modo in cui i dati vengono archiviati»: ogni scelta apre una richiesta d'assistenza
   con la voce già scritta; il team che la riceve lo decide la tavola dei motivi nel database. */
var ESP_BLOCCHI=[
  {sopra:"FelicitasFestival",tit:"Vicinati del cibo",voci:[["Attiva punto di ritiro"],["Attiva vicinato"],["Proponi prodotto"]]},
  {tit:"Assistenza comunitaria integrata",voci:[["Praticantato","prat"],["Spiritualità"],["Percorsi"],["Trattamenti"],["Consulenze"]]},
  {tit:"Cervello Digitale Evoluto",d:"attiva per azienda, associazione, organizzazione, ente",voci:[["Azienda col proprio sistema gestionale interno, collegato a Felicitas","","dichiara il tuo interesse"]],link:"cervello-digitale-evoluto.html"}
];
var ESP_STAMPA=[["carta","Carta stampata","volantini, manifesti, locandine, biglietti da visita, cartelline, adesivi","volantino.jpg"],
  ["libri","Libri e cataloghi","libri, riviste, cataloghi, fascicoli","rivista.jpg"],["agende","Agende e calendari","agende, calendari, quaderni e taccuini","agenda.jpg"],
  ["fiere","Esposizione e fiere","totem, roll-up, striscioni, stand, insegne, pellicole per vetrine","rollup.jpg"],["confezioni","Confezioni e imballaggi","shopper, imballaggi, bicchieri, tovaglioli, confezioni regalo","scatola.jpg"],
  ["gadget","Gadget e regali","penne, cordini, portabadge, borse, borracce","penne.jpg"],["abiti","Abbigliamento","magliette, felpe, tessuti personalizzati","tshirt.jpg"],
  ["foto","Album fotografico","fotolibri, foto da parete, calendari fotografici","rivista.jpg"]];
function vAzione(){
  var c=$("#corpo");
  function g(t,attr,ruolo,sotto){var a=attr.indexOf("href=")===0;
    return '<'+(a?'a ':'button type="button" ')+'class="esp-g'+(ruolo?' r':'')+'" '+attr+'><b>'+esc(t)+'</b>'+(sotto?'<small>'+sotto+'</small>':'')+(ruolo?'<i>ruolo</i>':'')+'</'+(a?'a':'button')+'>';}
  var ruolo=!!(io.id&&(io.nucleo||(io.ruoli||[]).length));
  var log=io.coordina||(io.ruoli||[]).some(function(r){return r.funzione==="logistica";});
  var gr=[].concat(io.nucleo||(io.ruoli||[]).length?[g("Aggiungi una persona",'data-vai="staff"',true)]:[]).concat(io.nucleo?[g("Crea team",'data-vai="createam"',true)]:[])
    .concat(log?[g("Cassa",'data-vai="cassa"',true)]:[]).concat(io.id?[g("Scrivi un articolo",'data-mega="articolo"',true)]:[]).concat(io.coordina?[g("Crea diretta",'data-mega="diretta"',true)]:[]).concat(io.id?[g("Fissa un incontro",'data-esp-fissa="1"',false)]:[])
    /* 8/11 Gab: «Produttore è karma yoga» · «No I prodotti li metterei in espandi» (SQL 216) */
    .concat(io.id?[g("I miei prodotti",'data-esp-prod="1" style="display:none"',false)]:[]);
  var team=io.id?'<section class="esp-el" style="--e:#D4AF6A"><p class="esp-nm">'+(ruolo?'I TUOI TEAM':'LE TUE CHAT')+'</p>'+
      '<div class="esp-gg">'+g("I team",'data-esp-team="1"',false,'<span id="esp-team-nomi">Un momento…</span>')+(ruolo?g("Nuova chat",'data-esp-chat="1"'):'')+'</div>'+
      '<div id="esp-team"'+(ruolo?'':' hidden')+'><div id="tm-box"></div><div id="tm-attesa"></div><div id="tm-chat"></div></div>'+
      (ruolo?'<p class="esp-d" style="margin-top:12px">I tuoi obiettivi e le scadenze sono in Oggi.</p>':'')+
      (gr.length?'<div class="esp-gg" style="margin-top:12px">'+gr.join("")+'</div>':'')+'</section>':'';
  /* 8/11 Gab: «dovrei avere un quadrante con "iscritti festival felicitas"» · «lo vede anche chi ha l ruolo eventi» (SQL 224) */
  var iscr=!!(io.id&&(io.nucleo||(io.ruoli||[]).some(function(r){return r.ruolo==="eventi";})));
  var iscrH=iscr?'<section class="esp-el" id="esp-iscr-s" style="--e:#8DBF5E"><p class="esp-nm">FELICITAS FESTIVAL</p><h2>Iscritti Felicitas Festival</h2>'+
      '<div id="esp-iscr"><p class="esp-d">Un momento…</p></div><div id="esp-iscr-l"></div></section>':'';
  /* l'Emporio: oggi i prodotti sono la Stampa; ogni famiglia apre il configuratore della pagina Emporio (emporio.html#famiglia) */
  var empH='<section class="esp-el esp-emp" style="--e:#6FA8D6"><p class="esp-nm">EMPORIO</p><h2>2000 prodotti ed espositori fieristici</h2>'+
      '<p class="esp-d">Oltre alla stampa proponiamo supporti per l\'esposizione fieristica e altri prodotti utili alla comunicazione. Scegli la famiglia, poi il formato, la carta e quante copie.</p>'+
      '<div class="esp-fam">'+ESP_STAMPA.map(function(f){return '<a href="emporio.html?c=10182300#'+f[0]+'"><img src="stampa/'+f[3]+'?v=10132030" alt="" loading="lazy"><span><b>'+esc(f[1])+'</b><small>'+esc(f[2])+'</small></span></a>';}).join("")+'</div>'+
      '<p class="esp-d" style="margin-top:10px"><a href="emporio.html?c=10182300" style="color:#6FA8D6">Tutto l\'Emporio ›</a></p></section>';
  var blocchi=ESP_BLOCCHI.map(function(k,i){
    return '<section class="esp-el esp-b" style="--e:#D4AF6A">'+(k.sopra?'<p class="esp-nm">'+esc(k.sopra)+'</p>':'')+'<h2>'+esc(k.tit)+'</h2>'+(k.d?'<p class="esp-d">'+esc(k.d)+'</p>':'')+
      k.voci.map(function(v,j){return '<button type="button" class="esp-v" data-esp-v="'+i+'.'+j+'"><span><b>'+esc(v[0])+'</b>'+(v[2]?'<small>'+esc(v[2])+'</small>':'')+'</span><em>Scegli</em></button>';}).join("")+
      (k.link?'<p class="esp-d" style="margin-top:10px"><a href="'+k.link+'" style="color:#D4AF6A">Il Cervello Digitale Evoluto ›</a></p>':'')+'</section>';}).join("");
  c.innerHTML='<h1 class="esp-tit">Espandi</h1>'+(io.id?'':'<p style="margin:0 0 14px"><a class="btn pieno" href="'+ENTRA+'">Entra</a></p>')+
    (ruolo?team+iscrH+empH+'<p class="esp-nm" style="margin:22px 0 10px;color:#D4AF6A">DI COSA HAI BISOGNO?</p>'+blocchi:empH+blocchi+team+iscrH)+
    /* 24/10, Gab: l'utente possa «scaricare l'app» · su iPhone un tasto coi gesti di Safari (comune/fm-installa.js) */
    '<div data-fm-installa></div>';
  legaVai(c);
  c.querySelectorAll("[data-mega]").forEach(function(b){b.onclick=function(){M.tipo=b.getAttribute("data-mega");M.msg="";vai("megafono");};});
  var bt=c.querySelector("[data-esp-team]");if(bt){if(ruolo)bt.classList.add("aperto");bt.onclick=function(){var p=$("#esp-team");p.hidden=!p.hidden;bt.classList.toggle("aperto",!p.hidden);if(!p.hidden)p.scrollIntoView({behavior:"smooth",block:"start"});};}
  var bc=c.querySelector("[data-esp-chat]");if(bc)bc.onclick=function(){nuovaChat();};
  var bfi=c.querySelector("[data-esp-fissa]");if(bfi)bfi.onclick=function(){agFissa(null,null);};
  var bpr=c.querySelector("[data-esp-prod]");if(bpr)bpr.onclick=function(){mieiProdotti();};
  c.querySelectorAll("[data-esp-v]").forEach(function(b){b.onclick=function(){var ij=b.getAttribute("data-esp-v").split("."),k=ESP_BLOCCHI[+ij[0]],v=k.voci[+ij[1]];
    if(v[1]==="emporio"){location.href="emporio.html?c=10182300";return;}
    if(v[1]==="prat"&&io.id){apriPrat();return;}
    vai("assistenza");var t=$("#ass-t");if(t){t.value=k.tit+" · "+v[0]+"\n\n";try{t.focus();t.setSelectionRange(t.value.length,t.value.length);}catch(e){}}};});
  if(window.fmInstallaAvvia)fmInstallaAvvia();
  if(iscr)iscritti();
  if(io.id){mieiTeam();mieChat();numerini();if(io.nucleo)daApprovare();
    leggiTeam().then(function(l){var bp=$("[data-esp-prod]");if(bp&&(l||[]).some(function(t){return t.nome==="Vicinati del Cibo"||t.nome==="Felicitas Festival";}))bp.style.display="";
      var n=$("#esp-team-nomi");if(!n)return;
      if(!l||!l.length){n.textContent="Ancora nessun team";return;}
      var nl=l.reduce(function(a,t){return a+(+t.non_letti||0);},0);
      n.innerHTML=(l.length===1?"1 team":l.length+" team")+(nl?' <em class="esp-nl" aria-label="'+nl+' da leggere">'+nl+'</em>':'');});}
}
