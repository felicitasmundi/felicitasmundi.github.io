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
   vicinati, iscritti) è in «Chat e strumenti» (vista "strumenti", da Obiettivi); le Voci dell'indice sono una riga di «Chat e strumenti»; l'Emporio ha la sua voce nel menu. */
function vAzione(){vAssistenza(true);}
function vStrumenti(){
  /* 25/11/2026 21:45, Gab: «chat e strumenti continua ad aver troppi testi. non è piu necessario mettere la descrizione di praticantato ecc.. meflio un elenco da aprire»
     → un elenco di righe: ogni riga si apre toccandola; i team solo col nome. */
  if(!io.id){vai("azione");return;}
  var c=$("#corpo");
  var ruolo=!!(io.nucleo||(io.ruoli||[]).length);
  var log=io.coordina||(io.ruoli||[]).some(function(r){return r.funzione==="logistica";});
  var iscr=!!(io.nucleo||(io.ruoli||[]).some(function(r){return r.ruolo==="eventi";}));
  function g(t,attr,sotto){return '<button type="button" class="st-g" '+attr+'><b>'+esc(t)+'</b>'+(sotto||'')+'<span aria-hidden="true">›</span></button>';}
  function apri(id,tit,dentro,nascosta){return '<details class="st-r" id="'+id+'"'+(nascosta?' hidden':'')+'><summary><b>'+tit+'</b><span aria-hidden="true">›</span></summary><div class="st-in">'+dentro+'</div></details>';}
  var gesti=[].concat(ruolo?[g("Aggiungi una persona",'data-vai="staff"')]:[]).concat(io.nucleo?[g("Crea team",'data-vai="createam"')]:[])
    .concat(ruolo?[g("Nuova chat",'data-esp-chat="1"')]:[]).concat([g("Fissa un incontro",'data-esp-fissa="1"'),g("Scrivi un articolo",'data-mega="articolo"')])
    .concat(io.coordina?[g("Crea diretta",'data-mega="diretta"')]:[]).concat(log?[g("Cassa",'data-vai="cassa"')]:[])
    /* 8/11 Gab: «No I prodotti li metterei in espandi» (SQL 216) · 16/11 proposte di prodotti (SQL 282) */
    .concat([g("I miei prodotti",'data-esp-prod="1" style="display:none"'),g("Da confermare",'data-esp-conf="1" style="display:none"',' <span id="esp-conf-n"></span>')]);
  c.innerHTML='<p><button class="mini" data-vai="obiettivi">‹ Obiettivi</button></p><h1 class="esp-tit">[Chat e strumenti]</h1><div class="st-el" style="padding:0;margin:0;width:100%;max-width:none;box-sizing:border-box">'+
    apri("st-team",'I tuoi team <span id="st-team-n"></span>','<div id="st-team-l"><p class="nota">Un momento…</p></div>')+
    apri("st-chat",'Le tue chat','<div id="tm-chat"><p class="nota">Un momento…</p></div>')+
    (io.nucleo?apri("st-att",'Da mettere nel Cervello','<div id="tm-attesa"></div>',true):'')+
    /* Voci dell'indice (SQL 274, solo nucleo): le card del ponte e della sera da confermare; la riga c'è solo quando ce ne sono */
    (io.nucleo?'<details class="st-r" id="esp-voci-s" hidden><summary><b>Voci dell\'indice <span id="esp-voci-n"></span></b><span aria-hidden="true">›</span></summary><div class="st-in" id="esp-voci"></div></details>':'')+
    '<section id="esp-vic-s" hidden>'+apri("st-vic",'Vicinati <span id="esp-vic-n"></span>','<div id="esp-vic"></div>')+'</section>'+
    (iscr?apri("st-iscr",'Iscritti Felicitas Festival','<div id="esp-iscr"><p class="nota">Un momento…</p></div><div id="esp-iscr-l"></div>'):'')+
    gesti.join("")+'</div>';
  legaVai(c);
  c.querySelectorAll("[data-mega]").forEach(function(b){b.onclick=function(){M.tipo=b.getAttribute("data-mega");M.msg="";vai("megafono");};});
  var bc=c.querySelector("[data-esp-chat]");if(bc)bc.onclick=function(){nuovaChat();};
  var bfi=c.querySelector("[data-esp-fissa]");if(bfi)bfi.onclick=function(){agFissa(null,null);};
  var bpr=c.querySelector("[data-esp-prod]");if(bpr)bpr.onclick=function(){mieiProdotti();};
  var bcf=c.querySelector("[data-esp-conf]");if(bcf)bcf.onclick=function(){prodottiDaConfermare();};
  if(iscr)iscritti();
  if(window.fmVicinatiEspandi)fmVicinatiEspandi(db);
  mieChat();numerini();contaProposte();
  if(io.nucleo){vociIndice();daApprovare();var at=$("#tm-attesa");if(at&&window.MutationObserver)new MutationObserver(function(){var d=$("#st-att");if(d)d.hidden=!at.innerHTML.trim();}).observe(at,{childList:true});}
  leggiTeam().then(function(l){var bp=$("[data-esp-prod]");if(bp&&(l||[]).some(function(t){return t.nome==="Vicinati del Cibo"||t.nome==="Felicitas Festival";}))bp.style.display="";
    var e=$("#st-team-l");if(!e||vista!=="strumenti")return;
    if(!l||!l.length){e.innerHTML='<p class="nota">Ancora nessun team.</p>';return;}
    var nl=l.reduce(function(a,t){return a+(+t.non_letti||0);},0);$("#st-team-n").innerHTML='· '+l.length+(nl?' <em class="esp-nl" aria-label="'+nl+' da leggere">'+nl+'</em>':'');
    e.innerHTML=l.map(function(t){return '<button type="button" class="st-g" data-team="'+esc(t.team_id)+'"><b>'+esc(t.nome)+'</b>'+(t.non_letti?' <em class="esp-nl" aria-label="'+t.non_letti+' da leggere">'+t.non_letti+'</em>':'')+'<span aria-hidden="true">›</span></button>';}).join("");
    e.querySelectorAll("[data-team]").forEach(function(b){b.onclick=function(){team.id=b.getAttribute("data-team");team.tipo="team";vai("team");};});});
}
document.head.insertAdjacentHTML("beforeend","<style>.st-el{display:grid;gap:8px;padding:0;margin:0}.st-r{background:#1a2148;border:1px solid rgba(212,175,106,.35);border-radius:14px}.st-r>summary{list-style:none;display:flex;justify-content:space-between;align-items:center;gap:10px;padding:14px 16px;cursor:pointer;font-size:18px;color:#F5F0E6}.st-r>summary::-webkit-details-marker{display:none}.st-r>summary>span{color:#D4AF6A;transition:transform .2s}.st-r[open]>summary>span{transform:rotate(90deg)}.st-r>summary:focus-visible,.st-g:focus-visible{outline:2px solid #D4AF6A;outline-offset:2px}.st-in{padding:0 12px 12px;display:grid;gap:6px}.st-in .tm-et{display:none}.st-g{display:flex;align-items:center;gap:8px;width:100%;text-align:left;background:#1a2148;border:1px solid rgba(212,175,106,.35);border-radius:14px;padding:14px 16px;color:#F5F0E6;font:inherit;font-size:18px;cursor:pointer}.st-g>b{font-weight:500;flex:1}.st-g>span[aria-hidden]{color:#D4AF6A}.st-in .st-g{background:#232c5c;border-color:transparent}</style>");
