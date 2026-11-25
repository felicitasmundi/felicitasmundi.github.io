/* ESPANDI PER FASE · 6/11/2026 (thread «Rifare Azione per il nucleo e lo staff»). Gab 6/11 12:14: «l aspetto elementi deve essere piu visibile
   nel cervello, mentre espandi è un aspetto pratico che deve avere però il riferimengto a seconda della fase in cui ci si trova».
   Ospite: tre blocchi (Vicinati del cibo · Assistenza comunitaria integrata · Cervello Digitale Evoluto). Ruoli e nucleo: prima i loro team.
   Gab 12:15: «c'è una differenza tra ciò che si comunica e il modo in cui i dati vengono archiviati»: ogni scelta apre una richiesta d'assistenza
   con la voce già scritta; il team che la riceve lo decide la tavola dei motivi nel database. */
var ESP_BLOCCHI=[
  {sopra:"FelicitasFestival",tit:"Vicinati del cibo",voci:[["Attiva punto di ritiro"],["Attiva vicinato"],["Proponi il tuo prodotto","prod"]]},
  {tit:"Assistenza comunitaria integrata",voci:[["Praticantato","prat"],["Spiritualità"],["Percorsi"],["Trattamenti"],["Consulenze"]]},
  {tit:"Cervello Digitale Evoluto",d:"attiva per azienda, associazione, organizzazione, ente",voci:[["Azienda col proprio sistema gestionale interno, collegato a Felicitas","","dichiara il tuo interesse"]],link:"cervello-digitale-evoluto.html"}
];
var ESP_STAMPA=[["carta","Carta stampata","volantini, manifesti, locandine, biglietti da visita, cartelline, adesivi","volantino.jpg"],
  ["libri","Libri e cataloghi","libri, riviste, cataloghi, fascicoli","rivista.jpg"],["agende","Agende e calendari","agende, calendari, quaderni e taccuini","agenda.jpg"],
  ["fiere","Esposizione e fiere","totem, roll-up, striscioni, stand, insegne, pellicole per vetrine","rollup.jpg"],["confezioni","Confezioni e imballaggi","shopper, imballaggi, bicchieri, tovaglioli, confezioni regalo","scatola.jpg"],
  ["gadget","Gadget e regali","penne, cordini, portabadge, borse, borracce","penne.jpg"],["abiti","Abbigliamento","magliette, felpe, tessuti personalizzati","tshirt.jpg"],
  ["foto","Album fotografico","fotolibri, foto da parete, calendari fotografici","rivista.jpg"]];
/* 25/11/2026, Gab 17:14 «esatto» sull'anteprima del menu nuovo: «Espandi diventa l'Assistenza comunitaria integrata» · 21:15 «si per espandi».
   Espandi ora è la pagina dell'Assistenza comunitaria integrata (vAssistenza dentro Espandi). Quello che c'era prima (chat, gesti dei ruoli,
   vicinati, iscritti) è in «Chat e strumenti» (vista "strumenti", da Obiettivi); le Voci dell'indice sono in Coscienza; l'Emporio ha la sua voce nel menu. */
function vAzione(){vAssistenza(true);}
function vStrumenti(){
  if(!io.id){vai("azione");return;}

  var c=$("#corpo");
  function g(t,attr,ruolo,sotto){var a=attr.indexOf("href=")===0;
    return '<'+(a?'a ':'button type="button" ')+'class="esp-g'+(ruolo?' r':'')+'" '+attr+'><b>'+esc(t)+'</b>'+(sotto?'<small>'+sotto+'</small>':'')+(ruolo?'<i>ruolo</i>':'')+'</'+(a?'a':'button')+'>';}
  var ruolo=!!(io.id&&(io.nucleo||(io.ruoli||[]).length));
  var log=io.coordina||(io.ruoli||[]).some(function(r){return r.funzione==="logistica";});
  var gr=[].concat(io.nucleo||(io.ruoli||[]).length?[g("Aggiungi una persona",'data-vai="staff"',true)]:[]).concat(io.nucleo?[g("Crea team",'data-vai="createam"',true)]:[])
    .concat(log?[g("Cassa",'data-vai="cassa"',true)]:[]).concat(io.id?[g("Scrivi un articolo",'data-mega="articolo"',true)]:[]).concat(io.coordina?[g("Crea diretta",'data-mega="diretta"',true)]:[]).concat(io.id?[g("Fissa un incontro",'data-esp-fissa="1"',false)]:[])
    /* 8/11 Gab: «Produttore è karma yoga» · «No I prodotti li metterei in espandi» (SQL 216) */
    .concat(io.id?[g("I miei prodotti",'data-esp-prod="1" style="display:none"',false)]:[])
    /* 16/11 Gab: proposte di prodotti, le vedono karma yoga e ruoli dei Vicinati del Cibo; confermano nucleo e ruoli Logistica (SQL 282) */
    .concat(io.id?[g("Da confermare",'data-esp-conf="1" style="display:none"',false,'<span id="esp-conf-n"></span>')]:[]);
  var team=io.id?'<section class="esp-el" style="--e:#D4AF6A"><p class="esp-nm">'+(ruolo?'I TUOI TEAM':'LE TUE CHAT')+'</p>'+
      (ruolo?'':'<div class="esp-gg">'+g("I team",'data-esp-team="1"',false,'<span id="esp-team-nomi">Un momento…</span>')+'</div>')+
      '<div id="esp-team"><div id="tm-box"></div><div id="tm-attesa"></div><div id="tm-chat"></div></div>'+
      
      ((gr.length||ruolo)?'<div class="esp-riga">'+(ruolo?g("Nuova chat",'data-esp-chat="1"'):'')+gr.join("")+'</div>':'')+'</section>':'';
  /* 8/11 Gab: «dovrei avere un quadrante con "iscritti festival felicitas"» · «lo vede anche chi ha l ruolo eventi» (SQL 224) */
  var iscr=!!(io.id&&(io.nucleo||(io.ruoli||[]).some(function(r){return r.ruolo==="eventi";})));
  var iscrH=iscr?'<section class="esp-el" id="esp-iscr-s" style="--e:#8DBF5E"><p class="esp-nm">FELICITAS FESTIVAL</p><h2>Iscritti Felicitas Festival</h2>'+
      '<div id="esp-iscr"><p class="esp-d">Un momento…</p></div><div id="esp-iscr-l"></div></section>':'';
  var vicH=io.id?'<section class="esp-el" id="esp-vic-s" style="--e:#8DBF5E" hidden><p class="esp-nm">VICINATI <span id="esp-vic-n"></span></p><div id="esp-vic"></div></section>':'';
  c.innerHTML='<p><button class="mini" data-vai="obiettivi">‹ Obiettivi</button></p><h1 class="esp-tit">[Chat e strumenti]</h1>'+team+vicH+iscrH;
  legaVai(c);
  c.querySelectorAll("[data-mega]").forEach(function(b){b.onclick=function(){M.tipo=b.getAttribute("data-mega");M.msg="";vai("megafono");};});
  var bt=c.querySelector("[data-esp-team]");if(bt){if(ruolo)bt.classList.add("aperto");bt.onclick=function(){var p=$("#esp-team");p.hidden=!p.hidden;bt.classList.toggle("aperto",!p.hidden);if(!p.hidden)p.scrollIntoView({behavior:"smooth",block:"start"});};}
  var bc=c.querySelector("[data-esp-chat]");if(bc)bc.onclick=function(){nuovaChat();};
  var bfi=c.querySelector("[data-esp-fissa]");if(bfi)bfi.onclick=function(){agFissa(null,null);};
  var bpr=c.querySelector("[data-esp-prod]");if(bpr)bpr.onclick=function(){mieiProdotti();};
  var bcf=c.querySelector("[data-esp-conf]");if(bcf)bcf.onclick=function(){prodottiDaConfermare();};
  c.querySelectorAll("[data-pd-cond]").forEach(function(b){b.onclick=function(){pdCondividi(b);};});
  c.querySelectorAll("[data-esp-v]").forEach(function(b){b.onclick=function(){var ij=b.getAttribute("data-esp-v").split("."),k=ESP_BLOCCHI[+ij[0]],v=k.voci[+ij[1]];
    if(v[1]==="emporio"){location.href="emporio.html?c=10182300";return;}
    if(v[1]==="prat"&&io.id){apriPrat();return;}
    if(v[1]==="prod"){if(io.id)formProdotto(null);else location.href="accesso.html?torna="+encodeURIComponent("strumento.html?prodotto=1");return;}
    vai("assistenza");var t=$("#ass-t");if(t){t.value=k.tit+" · "+v[0]+"\n\n";try{t.focus();t.setSelectionRange(t.value.length,t.value.length);}catch(e){}}};});
  if(iscr)iscritti();
  if(io.id&&window.fmVicinatiEspandi)fmVicinatiEspandi(db);
  if(io.id){mieiTeam();mieChat();numerini();if(io.nucleo)daApprovare();contaProposte();
    leggiTeam().then(function(l){var bp=$("[data-esp-prod]");if(bp&&(l||[]).some(function(t){return t.nome==="Vicinati del Cibo"||t.nome==="Felicitas Festival";}))bp.style.display="";
      var n=$("#esp-team-nomi");if(!n)return;
      if(!l||!l.length){n.textContent="Ancora nessun team";return;}
      var nl=l.reduce(function(a,t){return a+(+t.non_letti||0);},0);
      n.innerHTML=(l.length===1?"1 team":l.length+" team")+(nl?' <em class="esp-nl" aria-label="'+nl+' da leggere">'+nl+'</em>':'');});}
}
