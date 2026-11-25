/* BENVENUTO KARMA YOGA · 8/11/2026. Gab 19:05: «un messaggio d entrata per chi entra la prima volta con la voce karma yoga»;
   19:06 testo: «benvenuto in Feli.... seguire gli obiettivi attivamente ti consente di seguire le dirette del praticantato, ogni lunedi ore 19»;
   19:08: «e potrai tenerti ricevere gli aggiornamenti dai vicinati, sul giornale»;
   19:10: «puoi leggere gli aggiornamenti del giornale e partecipare all'espansione del cervello digitale evoluto» (al posto della frase sui vicinati);
   19:11: «come lo farebbero su apple^ ? troppe frasi» → tre righe con icona (Praticantato, Giornale, Cervello Digitale Evoluto) e «Continua».
   Solo chi non è nel nucleo, non ha ruoli ed è accolto nel karma yoga (fm_karma_mio = "puoi"). Una volta per persona su questo telefono. */
/* 24/11/2026, Gab: «ci sono altre finestre che si aprono […] un altra che già spiega il contesto, quindi trovale e poi cambiale»
   → la stessa finestra si apre a chiunque entri la prima volta (prima solo karma yoga); le tre righe portano dove dicono;
   «Segui gli obiettivi attivamente» resta solo per il karma yoga. Si chiude prima che parta la finestra del Praticantato. */
function benvenutoKarma(){
  if(!io.id||io.nucleo||(io.ruoli||[]).length)return;
  var k="fm_benvenuto_karma_"+io.id;try{if(localStorage.getItem(k))return;}catch(e){return;}
  try{localStorage.setItem(k,"1");}catch(e){}
  var f0=document.createElement("div");f0.id="tc-foglio";document.body.appendChild(f0);
  db.rpc("fm_karma_mio").then(function(r){return r&&!r.error&&r.data==="puoi";},function(){return false;}).then(function(karma){
    f0.remove();
    var f=document.createElement("div");f.id="tc-foglio";document.body.appendChild(f);
    if(!document.getElementById("bk-css")){var st=document.createElement("style");st.id="bk-css";st.textContent='.bk{list-style:none;margin:18px 0 22px;padding:0}.bk li{display:flex;gap:14px;align-items:flex-start;margin:0 0 16px}.bk svg{flex:0 0 34px;width:34px;height:34px;stroke:#D4AF6A;fill:none;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}.bk b{display:block;font-size:19px;color:#F5F0E6;font-weight:600}.bk span{display:block;font-size:18px;color:rgba(245,240,230,.72)}.bk-sotto{font-size:18px;color:rgba(245,240,230,.72);margin:0 0 14px}.bk a.bk-va{display:flex;gap:14px;align-items:flex-start;color:inherit;text-decoration:none;width:100%}';document.head.appendChild(st);}
    f.innerHTML='<div class="tc-velo" data-chiudi-f></div><div class="tc-foglio" role="dialog" aria-modal="true"><div class="tc-presa"></div><h2>Benvenuto in FelicitasMundi</h2><ul class="bk"><li><a class="bk-va" href="praticantato.html"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M10 8.5l5 3.5-5 3.5z"/></svg><div><b>Praticantato</b><span>Dirette ogni lunedì alle 19</span></div></a></li><li><a class="bk-va" href="strumento.html?v=giornale"><svg viewBox="0 0 24 24"><path d="M4 5h13v14H6a2 2 0 0 1-2-2z"/><path d="M17 9h3v8a2 2 0 0 1-2 2"/><path d="M7 9h7M7 12h7M7 15h4"/></svg><div><b>Giornale</b><span>Gli aggiornamenti</span></div></a></li><li><a class="bk-va" href="cervello-digitale-evoluto.html"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="2.2"/><circle cx="5" cy="6" r="1.6"/><circle cx="19" cy="6" r="1.6"/><circle cx="5" cy="18" r="1.6"/><circle cx="19" cy="18" r="1.6"/><path d="M6.3 7l4 3.6M17.7 7l-4 3.6M6.3 17l4-3.6M17.7 17l-4-3.6"/></svg><div><b>Cervello Digitale Evoluto</b><span>Partecipa all\'espansione</span></div></a></li></ul>'+(karma?'<p class="bk-sotto">Segui gli obiettivi attivamente.</p>':'')+'<button type="button" class="tc-btn" data-chiudi-f>Continua</button></div>';
    f.querySelectorAll("[data-chiudi-f]").forEach(function(b){b.onclick=function(){f.remove();};});
  },function(){});
}

/* 15/11 · finestra del Praticantato all'accesso, una volta per persona (Gab 15/11 00:30Z) */
function finestraPraticantato(){
  if(!io.id||document.getElementById("fp-velo"))return;
  var k="fm-praticantato-finestra-1";try{if(localStorage.getItem(k))return;}catch(e){return;}
  if(document.getElementById("tc-foglio")){setTimeout(finestraPraticantato,1500);return;}
  var oggi="";try{oggi=new Intl.DateTimeFormat("en-CA",{timeZone:"Europe/Rome",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date());}catch(e){}
  var prima=!oggi||oggi<="2026-11-16";
  if(!document.getElementById("fp-css")){var st=document.createElement("style");st.id="fp-css";st.textContent='#fp-velo{position:fixed;inset:0;z-index:9999;background:rgba(5,10,30,.72);display:flex;align-items:center;justify-content:center;padding:16px;box-sizing:border-box;overflow-y:auto}#fp-velo *{box-sizing:border-box}.fp{width:100%;max-width:420px;background:#1a2148;border:1px solid rgba(212,175,106,.7);border-radius:22px;padding:28px 22px 24px;color:#F5F0E6;margin:auto}.fp .et{font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:#D4AF6A;margin:0 0 12px}.fp h2{font-family:Georgia,serif;font-size:26px;line-height:1.2;font-weight:600;margin:0 0 16px;color:#F5F0E6}.fp p{font-size:18px;line-height:1.5;margin:0 0 12px}.fp a.t{display:block;text-align:center;margin-top:20px;padding:15px;border-radius:999px;background:#D4AF6A;color:#0a1430;font-weight:700;font-size:18px;text-decoration:none}.fp button{display:block;width:100%;margin-top:12px;padding:14px;border-radius:999px;background:transparent;border:1px solid rgba(245,240,230,.35);color:#F5F0E6;font-size:18px;font-family:inherit;cursor:pointer}';document.head.appendChild(st);}
  var v=document.createElement("div");v.id="fp-velo";
  v.innerHTML='<div class="fp" role="dialog" aria-modal="true" aria-labelledby="fp-tit"><p class="et">Praticantato</p>'+
    (prima?'<h2 id="fp-tit">Lunedì parte il Praticantato</h2><p>Lunedì 16 novembre, ore 19, in diretta: fare assieme gli intenti del ciclo lunare legato ai 5 elementi.</p>':'<h2 id="fp-tit">Il praticantato ogni lunedì in diretta, ore 19</h2>')+
    '<p>Percorso online ogni lunedì alle 19 con Gabriele Dettori.</p><a class="t" href="praticantato.html#partecipa">Partecipa lunedì &gt;</a><button type="button" id="fp-chiudi">Chiudi</button></div>';
  var segna=function(){try{localStorage.setItem(k,"1");}catch(e){}};
  var esc1=function(e){if(e.key==="Escape")chiudi();};
  var chiudi=function(){segna();v.remove();document.removeEventListener("keydown",esc1);};
  document.body.appendChild(v);document.addEventListener("keydown",esc1);
  v.onclick=function(e){if(e.target===v)chiudi();};
  v.querySelector("#fp-chiudi").onclick=chiudi;
  v.querySelector("a.t").onclick=segna;
  try{v.querySelector("#fp-chiudi").focus();}catch(e){}
}
/* 15/11 · la campanella con il numerino (Gab 15/11 01:54Z: «Si campanella con numerino»). Gli avvisi sono quelli di notifiche_coda (SQL 117),
   letti con fm_miei_avvisi / fm_avvisi_da_leggere / fm_avvisi_letti (SQL 267). Finché la 267 non c'è, la campanella non si vede.
   Solo per chi è entrato. Aprendo l'elenco gli avvisi si segnano letti e il numerino sparisce; i nuovi restano col punto d'oro. */
var cmp={timer:null,ok:false};
function campanella(){
  var alto=document.getElementById("alto");
  if(!alto)return;
  var b=document.getElementById("cmp-b");
  if(!io.id||!db){if(b)b.remove();return;}
  if(!document.getElementById("cmp-css")){var st=document.createElement("style");st.id="cmp-css";st.textContent='#cmp-b{position:relative;width:44px;height:44px;border-radius:50%;border:1.5px solid rgba(212,175,106,.6);background:#1a2148;color:#D4AF6A;cursor:pointer;display:grid;place-items:center;padding:0}#cmp-b[hidden]{display:none}#cmp-b svg{width:22px;height:22px;stroke:#D4AF6A;fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}#cmp-n{position:absolute;top:-4px;right:-4px;min-width:22px;height:22px;padding:0 6px;border-radius:11px;background:#E07A55;color:#fff;font:700 13px/22px "DM Sans",system-ui,sans-serif;text-align:center;box-sizing:border-box}#cmp-n[hidden]{display:none}'+
    '#cmp-velo{position:fixed;inset:0;background:rgba(10,20,48,.72);z-index:30}#cmp-f{position:fixed;left:0;right:0;bottom:0;max-height:85vh;overflow-y:auto;background:#122050;border-top:2px solid #D4AF6A;border-radius:22px 22px 0 0;padding:14px 16px calc(24px + env(safe-area-inset-bottom,0px));z-index:31;color:#F5F0E6;max-width:720px;margin:0 auto;box-sizing:border-box}#cmp-f h2{font-family:Georgia,serif;font-size:24px;font-weight:600;margin:0 0 10px}'+
    '.cmp-l{list-style:none;margin:0;padding:0}.cmp-l li{border-top:1px solid rgba(212,175,106,.22)}.cmp-l a,.cmp-l div.cmp-i{display:block;padding:14px 4px 14px 22px;color:#F5F0E6;text-decoration:none;position:relative;overflow-wrap:anywhere}.cmp-l .nuovo::before{content:"";position:absolute;left:4px;top:22px;width:9px;height:9px;border-radius:50%;background:#D4AF6A}.cmp-l b{display:block;font-size:18px;font-weight:600}.cmp-l span{display:block;font-size:17px;line-height:1.45;color:rgba(245,240,230,.78);margin-top:2px}.cmp-l small{display:block;font-size:15px;color:rgba(245,240,230,.55);margin-top:4px}.cmp-vuoto{font-size:18px;color:rgba(245,240,230,.72);padding:14px 0}#cmp-chiudi{display:block;width:100%;margin-top:14px;padding:14px;border-radius:999px;background:transparent;border:1px solid rgba(245,240,230,.35);color:#F5F0E6;font-size:18px;font-family:inherit;cursor:pointer}';document.head.appendChild(st);}
  if(!b){
    alto.insertAdjacentHTML("afterbegin",'<button type="button" id="cmp-b" hidden aria-label="Notifiche"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/></svg><span id="cmp-n" hidden></span></button>');
    b=document.getElementById("cmp-b");
  }
  b.onclick=function(ev){ev.stopPropagation();campanellaApri();};
  campanellaConta();
  if(!cmp.timer){
    cmp.timer=setInterval(function(){if(document.visibilityState==="visible")campanellaConta();},180000);
    document.addEventListener("visibilitychange",function(){if(document.visibilityState==="visible")campanellaConta();});
  }
}
function campanellaConta(){
  if(!io.id||!db)return;
  db.rpc("fm_avvisi_da_leggere").then(function(r){
    var b=document.getElementById("cmp-b"),n=document.getElementById("cmp-n");
    if(!b||!n)return;
    if(!r||r.error){if(!cmp.ok)b.hidden=true;return;}
    cmp.ok=true;b.hidden=false;
    var k=+r.data||0;
    n.hidden=k<1;n.textContent=k>99?"99+":String(k);
    b.setAttribute("aria-label",k>0?"Notifiche, "+k+" da leggere":"Notifiche");
  },function(){});
}
function campanellaLink(u){
  u=String(u||"");
  if(/^[a-z0-9\-]+\.html([?#][^"'<>\s]*)?$/i.test(u))return u;
  if(/^https:\/\/app\.felicitasmundi\.com\/[^"'<>\s]*$/i.test(u))return u;
  return "";
}
function campanellaApri(){
  if(document.getElementById("cmp-f"))return;
  var v=document.createElement("div");v.id="cmp-velo";
  var f=document.createElement("div");f.id="cmp-f";f.setAttribute("role","dialog");f.setAttribute("aria-modal","true");f.setAttribute("aria-labelledby","cmp-tit");
  f.innerHTML='<div class="tc-presa"></div><h2 id="cmp-tit">Notifiche</h2><div id="cmp-c"><p class="cmp-vuoto">Un momento…</p></div><button type="button" id="cmp-chiudi">Chiudi</button>';
  document.body.appendChild(v);document.body.appendChild(f);
  var esc1=function(e){if(e.key==="Escape")chiudi();};
  var chiudi=function(){v.remove();f.remove();document.removeEventListener("keydown",esc1);};
  v.onclick=chiudi;f.querySelector("#cmp-chiudi").onclick=chiudi;document.addEventListener("keydown",esc1);
  try{f.querySelector("#cmp-chiudi").focus();}catch(e){}
  db.rpc("fm_miei_avvisi").then(function(r){
    var c=document.getElementById("cmp-c");if(!c)return;
    var l=(r&&!r.error&&r.data)||[];
    if(!l.length){c.innerHTML='<p class="cmp-vuoto">Nessuna notifica.</p>';}
    else c.innerHTML='<ul class="cmp-l">'+l.map(function(a){
      var u=campanellaLink(a.indirizzo),cl=a.letta?'':' nuovo';
      var d=(a.creata_il?quandoTm(a.creata_il):'');
      var dentro='<b>'+esc(a.titolo)+'</b>'+(a.testo?'<span>'+esc(a.testo)+'</span>':'')+(d?'<small>'+esc(d)+'</small>':'');
      return '<li>'+(u?'<a class="cmp-i'+cl+'" href="'+esc(u)+'">'+dentro+'</a>':'<div class="cmp-i'+cl+'">'+dentro+'</div>')+'</li>';
    }).join("")+'</ul>';
    if(l.some(function(a){return !a.letta;}))db.rpc("fm_avvisi_letti",{p_id:null}).then(function(){campanellaConta();},function(){});
  },function(){var c=document.getElementById("cmp-c");if(c)c.innerHTML='<p class="cmp-vuoto">Non si riesce a leggere adesso. Si può riprovare.</p>';});
}
/* avvio */
if(!db){$("#corpo").innerHTML='<div class="vuoto">La pagina non riesce a collegarsi. Controlla la connessione e ricarica.</div>';return;}
chiSono().then(function(){
  testa();
  campanella();
  /* 15/11: qui db non è window.db, quindi la domanda automatica delle notifiche (fm-notifiche.js, 8/11) non partiva mai da sola: la si avvia da qui */
  if(io.id&&window.fmNotifiche)fmNotifiche(db);
  datiObbligatori();
  benvenutoKarma();
  finestraPraticantato();
  prodottoDaLink();
  try{var q=new URLSearchParams(location.search).get("v");if(q&&/^(oggi|giornale|megafono|obiettivi|cartelle|dati|cervello|coscienza|azione|compra|assistenza|staff|persone|strumenti)$/.test(q))vista=(q==="oggi"?"obiettivi":q);}catch(e){}
  /* le notifiche della chat aprono strumento.html?v=azione&team=<id> (SQL 128) */
  try{var tq=new URLSearchParams(location.search).get("team");if(io.id&&tq&&/^[0-9a-f-]{36}$/i.test(tq)){team.id=tq;team.tipo="team";vista="team";}}catch(e){}
  /* 8 nov · il link di una chat a due (SQL 223): chi lo apre entra, e si trova in chat con chi l'ha creato */
  try{var lk=new URLSearchParams(location.search).get("chatlink");if(lk&&/^[0-9a-f]{16,64}$/i.test(lk)){
    if(!io.id){location.href="accesso.html?torna="+encodeURIComponent("strumento.html?chatlink="+lk);return;}
    db.rpc("fm_chat_link_entra",{p_codice:lk}).then(function(x){var id=x&&!x.error?String(x.data||""):"";
      try{history.replaceState(null,"","strumento.html");}catch(e){}
      if(/^[0-9a-f-]{36}$/i.test(id)){team.id=id;team.tipo="chat";vista="team";}else{vista="azione";alert(id||errore(x&&x.error));}
      disegna();},function(){disegna();});
    return;}}catch(e){}
  /* le notifiche delle chat a due aprono strumento.html?v=azione&chat=<id> (SQL 129): se è ancora una richiesta, si resta in Azione a rispondere */
  try{var cq=new URLSearchParams(location.search).get("chat");if(io.id&&cq&&/^[0-9a-f-]{36}$/i.test(cq)){team.id=cq;team.tipo="chat";vista="team";}}catch(e){}
  disegna();
});
db.auth.onAuthStateChange(function(ev){
  if(ev==="SIGNED_OUT"&&io.id){location.href="strumento.html";return;}
  if(ev==="SIGNED_IN"){var prima=io.id;chiSono().then(function(){if(io.id!==prima){cache.obiettivi=null;testa();campanella();if(window.fmNotifiche)fmNotifiche(db);disegna();datiObbligatori();finestraPraticantato();}});}
});
})();
