/* BENVENUTO KARMA YOGA · 8/11/2026. Gab 19:05: «un messaggio d entrata per chi entra la prima volta con la voce karma yoga»;
   19:06 testo: «benvenuto in Feli.... seguire gli obiettivi attivamente ti consente di seguire le dirette del praticantato, ogni lunedi ore 19»;
   19:08: «e potrai tenerti ricevere gli aggiornamenti dai vicinati, sul giornale»;
   19:10: «puoi leggere gli aggiornamenti del giornale e partecipare all'espansione del cervello digitale evoluto» (al posto della frase sui vicinati);
   19:11: «come lo farebbero su apple^ ? troppe frasi» → tre righe con icona (Praticantato, Giornale, Cervello Digitale Evoluto) e «Continua».
   Solo chi non è nel nucleo, non ha ruoli ed è accolto nel karma yoga (fm_karma_mio = "puoi"). Una volta per persona su questo telefono. */
function benvenutoKarma(){
  if(!io.id||io.nucleo||(io.ruoli||[]).length)return;
  var k="fm_benvenuto_karma_"+io.id;try{if(localStorage.getItem(k))return;}catch(e){return;}
  db.rpc("fm_karma_mio").then(function(r){if(!r||r.error||r.data!=="puoi")return;
    try{localStorage.setItem(k,"1");}catch(e){}
    var f=document.createElement("div");f.id="tc-foglio";document.body.appendChild(f);
    if(!document.getElementById("bk-css")){var st=document.createElement("style");st.id="bk-css";st.textContent='.bk{list-style:none;margin:18px 0 22px;padding:0}.bk li{display:flex;gap:14px;align-items:flex-start;margin:0 0 16px}.bk svg{flex:0 0 34px;width:34px;height:34px;stroke:#D4AF6A;fill:none;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}.bk b{display:block;font-size:19px;color:#F5F0E6;font-weight:600}.bk span{display:block;font-size:18px;color:rgba(245,240,230,.72)}.bk-sotto{font-size:18px;color:rgba(245,240,230,.72);margin:0 0 14px}';document.head.appendChild(st);}
    f.innerHTML='<div class="tc-velo" data-chiudi-f></div><div class="tc-foglio" role="dialog" aria-modal="true"><div class="tc-presa"></div><h2>Benvenuto in FelicitasMundi</h2><ul class="bk"><li><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M10 8.5l5 3.5-5 3.5z"/></svg><div><b>Praticantato</b><span>Dirette ogni lunedì alle 19</span></div></li><li><svg viewBox="0 0 24 24"><path d="M4 5h13v14H6a2 2 0 0 1-2-2z"/><path d="M17 9h3v8a2 2 0 0 1-2 2"/><path d="M7 9h7M7 12h7M7 15h4"/></svg><div><b>Giornale</b><span>Gli aggiornamenti</span></div></li><li><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="2.2"/><circle cx="5" cy="6" r="1.6"/><circle cx="19" cy="6" r="1.6"/><circle cx="5" cy="18" r="1.6"/><circle cx="19" cy="18" r="1.6"/><path d="M6.3 7l4 3.6M17.7 7l-4 3.6M6.3 17l4-3.6M17.7 17l-4-3.6"/></svg><div><b>Cervello Digitale Evoluto</b><span>Partecipa all\'espansione</span></div></li></ul><p class="bk-sotto">Segui gli obiettivi attivamente.</p><button type="button" class="tc-btn" data-chiudi-f>Continua</button></div>';
    f.querySelectorAll("[data-chiudi-f]").forEach(function(b){b.onclick=function(){f.remove();};});
  },function(){});
}

/* avvio */
if(!db){$("#corpo").innerHTML='<div class="vuoto">La pagina non riesce a collegarsi. Controlla la connessione e ricarica.</div>';return;}
chiSono().then(function(){
  testa();
  benvenutoKarma();
  try{var q=new URLSearchParams(location.search).get("v");if(q&&/^(oggi|giornale|megafono|obiettivi|cartelle|dati|cervello|coscienza|azione|compra|assistenza|staff|persone)$/.test(q))vista=q;}catch(e){}
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
  if(ev==="SIGNED_IN"){var prima=io.id;chiSono().then(function(){if(io.id!==prima){cache.obiettivi=null;testa();disegna();}});}
});
})();
