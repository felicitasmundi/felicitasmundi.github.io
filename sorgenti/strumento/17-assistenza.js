/* ═══ ASSISTENZA · team Assistenza comunitaria integrata · SQL 166 · thread «Aprire un canale di assistenza nell'app», 5/11/2026 ═══
   Gab 4/11: «per scrivere su assistenza fai comunque loggin» · «un gruppo interno di assistenza /mutuo aiuto che riceva il messaggio
   in chat e che poi rispondendo lì gli arriva in automatico» · «non scrivere i motivi come obblico, ma come possibilità» ·
   «il team può avere i messaggi fissati come richieste d assistenza a cui rispondere , ma mano che qualcuno risponde ,qieste vengono archiviate».
   Chi scrive non entra nel team: vede solo le sue richieste. Il team risponde dalla sua chat (richieste in cima, «Rispondi»). */
var ASS_MOTIVI=[["vicinati","Vicinati"],["produttore","Produttore"],["operatore","Operatore"],["eventi","Prossimi eventi"],["interviste","Interviste"],["praticantato","Praticantato"],["karma_yoga","Mettiti al servizio col Karma Yoga"],["coscienza_tecnologia","Ricevere assistenza tra coscienza e tecnologia"],["azienda","Attivare la propria azienda"]]; /* 12/11 Gab, SQL 246 */
function assMotivo(m){var x=ASS_MOTIVI.filter(function(a){return a[0]===m;})[0];return x?x[1]:"Senza motivo";}
/* SQL 290 · nome, cognome e «Di dove sei» obbligatori: chi non li ha ancora scritti li scrive qui, una volta, prima di tutto il resto */
function datiObbligatori(){
  if(!io.id||!io.luogoC||document.getElementById("do-velo"))return;
  if(String(io.nome||"").trim()&&String(io.cognome||"").trim()&&String(io.luogo||"").trim())return;
  if(!document.getElementById("do-css")){var st=document.createElement("style");st.id="do-css";st.textContent='#do-velo{position:fixed;inset:0;z-index:10050;background:rgba(5,10,30,.85);display:flex;align-items:center;justify-content:center;padding:16px;box-sizing:border-box;overflow-y:auto}#do-velo *{box-sizing:border-box}.do{width:100%;max-width:420px;background:#1a2148;border:1px solid rgba(212,175,106,.7);border-radius:22px;padding:26px 22px 22px;color:#F5F0E6;margin:auto}.do h2{font-family:Georgia,serif;font-size:26px;font-weight:600;margin:0 0 6px;color:#F5F0E6}.do label{display:block;font-size:18px;margin:14px 0 6px;color:#D4AF6A}.do input{width:100%;font:inherit;font-size:18px;padding:12px 14px;border-radius:12px;border:1px solid rgba(245,240,230,.3);background:#0f1638;color:#F5F0E6}.do button{display:block;width:100%;margin-top:20px;padding:15px;border-radius:999px;background:#D4AF6A;color:#0a1430;font-weight:700;font-size:18px;border:0;font-family:inherit;cursor:pointer}.do p{font-size:17px;min-height:1em;margin:10px 0 0;color:#f0b8a6}';document.head.appendChild(st);}
  var v=document.createElement("div");v.id="do-velo";
  v.innerHTML='<div class="do" role="dialog" aria-modal="true" aria-labelledby="do-tit"><h2 id="do-tit">I miei dati</h2>'+
    '<label for="do-nome">Nome</label><input id="do-nome" autocomplete="given-name" maxlength="80" value="'+esc(io.nome||"")+'">'+
    '<label for="do-cognome">Cognome</label><input id="do-cognome" autocomplete="family-name" maxlength="80" value="'+esc(io.cognome||"")+'">'+
    '<label for="do-luogo">Di dove sei</label><input id="do-luogo" autocomplete="address-level2" maxlength="120" value="'+esc(io.luogo||"")+'">'+
    '<button type="button" id="do-salva">Salva</button><p id="do-esito" aria-live="polite"></p></div>';
  document.body.appendChild(v);
  try{v.querySelector(String(io.nome||"").trim()?(String(io.cognome||"").trim()?"#do-luogo":"#do-cognome"):"#do-nome").focus();}catch(e){}
  $("#do-salva").onclick=function(){var b=this,e=$("#do-esito"),riga={nome:$("#do-nome").value.trim(),cognome:$("#do-cognome").value.trim(),luogo:$("#do-luogo").value.trim()};
    if(!riga.nome||!riga.cognome||!riga.luogo){e.textContent="Servono nome, cognome e di dove sei.";return;}
    b.disabled=true;e.textContent="";
    db.from("persone").update(riga).eq("id",io.id).then(function(x){b.disabled=false;
      if(x&&x.error){e.textContent=errore(x.error);return;}
      io.nome=riga.nome;io.cognome=riga.cognome;io.luogo=riga.luogo;nomi[io.id]=io.nome;v.remove();},function(x){b.disabled=false;e.textContent=errore(x);});};
}
function assQuando(t){return giornoTm(t)+" · "+hhmm(t);}
var ass={motivo:null,aperta:null,team:null,stat:false,rispondo:null};
/* 25/11/2026: Espandi è l'Assistenza comunitaria integrata → vAzione() chiama vAssistenza(true): chi non è entrato vede le scelte e passa dall'accesso quando ne tocca una */
function vAssistenza(inEsp){
  var c=$("#corpo");
  /* 5/11 10:54, Gab: «gli possiamo prima far toccare e segnare di cosa ha bisogna e schiacciando invia, entra col nexus» (SQL 167):
     chi non è entrato scrive anche la mail; il messaggio aspetta sul server 7 giorni e parte quando entra con quella mail. */
  var fuori=!io.id;
  ass.motivo=null;
  /* 12/11/2026, Gab: «tutti i tasti che portano verso assistenza devono portare quindi verso l'accesso» → chi non è entrato
     passa dall'accesso e torna qui con la voce già scelta (?motivo=). */
  var qm0=null;try{qm0=new URLSearchParams(location.search).get("motivo");}catch(e){}
  if(qm0&&!ASS_MOTIVI.some(function(a){return a[0]===qm0;}))qm0=null;
  if(fuori&&!inEsp){location.replace("accesso.html?torna="+encodeURIComponent("strumento.html?v=assistenza"+(qm0?"&motivo="+qm0:"")));return;}
  /* 15/11 Gab: una finestra per ogni voce, con le altre scelte sotto. Righe verbatim da Piani e accoglienza. */
  var RIGHE={karma_yoga:"Dai il tuo tempo alla comunità: ricevi ospitalità, formazione e una rete di persone.",
    praticantato:"Riconosci il tuo talento e trasformalo in un progetto che la comunità può accogliere. Percorso online ogni lunedì alle 19 con Gabriele Dettori.",
    coscienza_tecnologia:"Prima di scegliere uno strumento, capire chi lo usa e perché.",
    azienda:"Il tuo gestionale, collegato a FelicitasMundi.",
    vicinati:"Aderisci col vicinato in cui vivi, oppure proponiti per entrare in un vicinato."};
  var ORDINE=["karma_yoga","praticantato","coscienza_tecnologia","azienda","vicinati","produttore","operatore","eventi","interviste"];
  c.innerHTML=(inEsp?'<h1 class="esp-tit">Assistenza comunitaria integrata</h1>'+(fuori?'<p style="margin:0 0 14px"><a class="btn pieno" href="'+ENTRA+'">Entra</a></p>':'<div id="ass-op"></div>'):'')+'<div id="ass-testa"></div><div id="ass-form" hidden>'+
    '<label class="az-l" for="ass-t">Il tuo messaggio</label><textarea id="ass-t" maxlength="2000" style="min-height:160px"></textarea>'+
    (fuori?'<label class="az-l" for="ass-mail">La tua mail</label><input type="email" id="ass-mail" maxlength="254" autocomplete="email" inputmode="email">'+
      '<p class="ass-nota">Dopo «Invia» entri in Felicitas con questa mail: il messaggio parte quando sei dentro.</p>':'')+
    '<p style="margin-top:18px"><button class="btn pieno az-invia" type="button" id="ass-invia">Invia all’Assistenza comunitaria integrata</button></p><p class="az-esito" id="ass-esito" aria-live="polite"></p></div>'+
    '<div id="ass-coda"></div>'+
    (fuori?'':'<h3 class="ass-h">Le mie richieste</h3><div id="ass-mie"><p class="nota">Un momento…</p></div>')+
    (inEsp?'':'<p><button class="mini" data-vai="azione">‹ Espandi</button></p>');
  legaVai(c);
  /* chi risponde (team dell'Assistenza comunitaria integrata e nucleo): in cima le richieste da seguire, apre la coda del team */
  if(inEsp&&!fuori&&db)Promise.all([db.rpc("fm_team_mutuo_aiuto"),leggiTeam()]).then(function(v){var tid=v[0]&&!v[0].error&&v[0].data,l=v[1]||[];
    if(!tid||!(io.nucleo||l.some(function(t){return t.team_id===tid;})))return;ass.team=tid;
    return db.rpc("fm_assistenza_coda").then(function(r){var e=$("#ass-op");if(!e||vista!=="azione")return;var q=(r&&!r.error&&r.data)||[];
      var nu=q.filter(function(x){return !x.seguita_da&&!x.letta;}).length,pr=q.filter(function(x){return !!x.seguita_da;}).length;
      e.innerHTML='<button type="button" class="ass-gia" id="ass-op-b" style="margin:0 0 14px"><b>Le richieste da seguire</b> Nuove · '+nu+' · In carico · '+pr+' ›</button>';
      $("#ass-op-b").onclick=function(){team.id=tid;team.tipo="team";vai("team");};});}).catch(function(){});
  function scelta(){
    var t=$("#ass-testa"),f=$("#ass-form"),k=$("#ass-coda"),m=ass.motivo;
    if(!m){
      t.innerHTML='<h2 class="az-tit">Di cosa hai bisogno?</h2><div class="az-filo"></div><p class="ass-int">Tocca una scelta: si apre la sua finestra.</p>'+
        '<div class="ass-griglia">'+(fuori?'':'<button type="button" class="ass-sc su" data-vai="obiettivi"><b>Sei già in un team?</b><span>Scrivi nella chat del tuo team ›</span></button>')+
        ORDINE.map(function(x){return '<button type="button" class="ass-sc" data-mot="'+x+'"><b>'+esc(assMotivo(x))+'</b>'+(RIGHE[x]?'<span>'+esc(RIGHE[x])+'</span>':'')+'</button>';}).join("")+'</div>';
      f.hidden=true;k.innerHTML="";
    }else{
      t.innerHTML='<p><button type="button" class="mini" id="ass-tutte">‹ Tutte le scelte</button></p><h2 class="az-tit">'+esc(assMotivo(m))+'</h2><div class="az-filo"></div>'+
        (RIGHE[m]?'<p class="ass-int">'+esc(RIGHE[m])+'</p>':'')+'<p class="ass-int">Ti risponde il team Assistenza comunitaria integrata.</p>';
      f.hidden=false;
      k.innerHTML=(m==="karma_yoga"?'<button type="button" class="ass-gia" data-vai="obiettivi"><b>Sei già nel Karma Yoga?</b> Scrivi nella chat del tuo team ›</button>':'')+
        '<p class="az-l">Altre scelte</p><div class="ass-chips">'+ORDINE.filter(function(x){return x!==m;}).map(function(x){return '<button type="button" class="ass-chip" data-mot="'+x+'">'+esc(assMotivo(x))+'</button>';}).join("")+'</div>';
    }
    legaVai(t);legaVai(k);
    c.querySelectorAll("#ass-testa [data-mot],#ass-coda [data-mot]").forEach(function(b){b.onclick=function(){
      if(fuori){location.href="accesso.html?torna="+encodeURIComponent("strumento.html?v=assistenza&motivo="+b.getAttribute("data-mot"));return;}
      ass.motivo=b.getAttribute("data-mot");scelta();window.scrollTo(0,0);};});
    var tu=$("#ass-tutte");if(tu)tu.onclick=function(){ass.motivo=null;scelta();window.scrollTo(0,0);};
  }
  /* 12/11: dai tasti di home, Piani e Praticantato la voce arriva già scelta (?motivo=): si apre la sua finestra */
  if(qm0)ass.motivo=qm0;
  scelta();
  $("#ass-invia").onclick=function(){var b=this,e=$("#ass-esito"),t=$("#ass-t").value.trim();if(!t){e.textContent="Scrivi il messaggio.";return;}
    if(fuori){var ml=$("#ass-mail").value.trim();if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(ml)){e.textContent="Scrivi la tua mail.";return;}
      b.disabled=true;e.textContent="Un momento…";
      db.rpc("fm_assistenza_prima",{p_mail:ml,p_testo:t,p_motivo:ass.motivo}).then(function(r){b.disabled=false;
        if(r&&!r.error&&r.data==="ok"){e.textContent="Messaggio salvato. Ora entra in Felicitas con "+ml+".";
          setTimeout(function(){location.href="accesso.html?torna="+encodeURIComponent("strumento.html?v=assistenza");},1200);return;}
        e.textContent=(r&&r.data)||"Non è partito. Si può riprovare.";},function(){b.disabled=false;e.textContent="Non è partito. Si può riprovare.";});
      return;}
    b.disabled=true;e.textContent="Un momento…";
    /* 12/11: finché il database non conosce le voci nuove (SQL 246) la richiesta parte lo stesso, con la voce scritta nel testo */
    var nuovi=["karma_yoga","coscienza_tecnologia","azienda"],mo=ass.motivo;
    function manda(tt,mm){return db.rpc("fm_assistenza_scrivi",{p_testo:tt,p_motivo:mm});}
    manda(t,mo).then(function(r){
      if(mo&&nuovi.indexOf(mo)>-1&&(!r||r.error||r.data!=="ok")){var et=(ASS_MOTIVI.filter(function(a){return a[0]===mo;})[0]||[,""])[1];return manda("["+et+"] "+t,null);}
      return r;}).then(function(r){b.disabled=false;
      if(r&&r.error){e.textContent="Non è partita. Si può riprovare.";return;}
      if(r&&r.data==="ok"){e.textContent="Inviata. Quando ti rispondiamo arriva una notifica.";$("#ass-t").value="";assMie();}
      else e.textContent=(r&&r.data)||"";},function(){b.disabled=false;e.textContent="Non è partita. Si può riprovare.";});};
  if(fuori)return;
  /* appena entrati: i messaggi scritti prima di entrare (SQL 167) partono adesso */
  db.rpc("fm_assistenza_porta").then(function(r){var n=(r&&!r.error&&+r.data)||0;
    if(n&&$("#ass-esito"))$("#ass-esito").textContent=n===1?"Il tuo messaggio è arrivato all’Assistenza comunitaria integrata.":"I tuoi "+n+" messaggi sono arrivati all’Assistenza comunitaria integrata.";assMie();},function(){assMie();});
}
function assMie(){
  /* 15/11/2026, Gab: chi ha scritto vede lo stato in parole semplici: Ricevuta · Ti sta seguendo … · Risolta, la risposta sotto e cosa succede dopo */
  var box=$("#ass-mie");if(!box)return;
  db.rpc("fm_mie_richieste_stato").then(function(r){if(r&&!r.error)return r;
    return db.rpc("fm_mie_richieste").then(function(q){if(q&&!q.error&&q.data)q.data=q.data.map(function(x){x.stato=x.stato==="aperta"?"ricevuta":"risolta";return x;});return q;});
  }).then(function(r){if((vista!=="assistenza"&&vista!=="azione")||!$("#ass-mie"))return;
    if(!r||r.error){box.innerHTML='<p class="nota">Le richieste non si aprono adesso. Si può riprovare.</p>';return;}
    var l=r.data||[];
    if(!l.length){box.innerHTML='<p class="nota">Ancora nessuna richiesta.</p>';return;}
    box.innerHTML=l.map(function(x){var ap=ass.aperta===x.richiesta_id;
      var st=x.stato==="risolta"?'<span class="ass-st ok">Risolta</span>':x.stato==="seguita"?'<span class="ass-st pr">Ti sta seguendo'+(x.seguita_da?' '+esc(x.seguita_da):'')+'</span>':'<span class="ass-st da">Ricevuta</span>';
      var dopo=x.stato==="risolta"?'Ti abbiamo risposto. Se serve, scrivi ancora qui.':'La risposta arriva qui e nella tua mail.';
      return '<div class="ass-c ass-mia'+(ap?' ap':'')+'">'+st+'<div class="ass-bis">'+esc(assMotivo(x.motivo))+'</div>'+
        (x.ultimo_testo?(x.ultimo_dal_team?'<div class="ass-rx">'+esc(x.ultimo_testo)+'</div>':'<div class="ass-tx">'+esc(x.ultimo_testo)+'</div>'):'')+
        '<small class="ass-dopo">'+esc(dopo)+' · '+esc(assQuando(x.ultima_il))+'</small>'+
        '<button type="button" class="ass-bt vuoto" data-ric="'+esc(x.richiesta_id)+'" aria-expanded="'+ap+'">'+(ap?'Chiudi':'Apri la conversazione')+'</button>'+
        (ap?'<div class="ass-conv" id="ass-conv"><p class="nota">Un momento…</p></div>':'')+'</div>';}).join("");
    box.querySelectorAll("[data-ric]").forEach(function(b){b.onclick=function(){var i=b.getAttribute("data-ric");ass.aperta=ass.aperta===i?null:i;assMie();};});
    if(ass.aperta&&$("#ass-conv"))assConv(ass.aperta);
  },function(){box.innerHTML='<p class="nota">Le richieste non si aprono adesso. Si può riprovare.</p>';});
}
function assConv(id){
  db.rpc("fm_assistenza_conversazione",{p_richiesta:id}).then(function(r){var e=$("#ass-conv");if(!e||ass.aperta!==id)return;
    var l=(r&&!r.error&&r.data)||[];
    e.innerHTML=l.map(function(m){return '<div class="ass-f '+(m.dal_team?"team":"mio")+'">'+testoLink(m.testo,"t","div")+'<small>'+(m.dal_team?esc(m.chi||"Assistenza comunitaria integrata")+" · ":"")+esc(assQuando(m.scritto_il))+'</small></div>';}).join("")+
      '<label class="az-l" for="ass-ancora">Scrivi ancora</label><textarea id="ass-ancora" maxlength="2000" style="min-height:100px"></textarea>'+
      '<p><button class="btn pieno" type="button" id="ass-ancora-b">Invia</button></p><p class="az-esito" id="ass-ancora-e" aria-live="polite"></p>';
    $("#ass-ancora-b").onclick=function(){var b=this,t=$("#ass-ancora").value.trim(),x=$("#ass-ancora-e");if(!t){x.textContent="Scrivi il messaggio.";return;}
      b.disabled=true;x.textContent="Un momento…";
      db.rpc("fm_assistenza_scrivi",{p_testo:t,p_motivo:null,p_richiesta:id}).then(function(r){b.disabled=false;
        if(r&&!r.error&&r.data==="ok"){assMie();return;}x.textContent=(r&&r.data)||"Non è partito. Si può riprovare.";},
        function(){b.disabled=false;x.textContent="Non è partito. Si può riprovare.";});};
  },function(){});
}
/* nella chat del team Assistenza comunitaria integrata: le richieste aperte in cima, con «Rispondi» (la risposta arriva a chi ha scritto e la richiesta va in archivio) */
function assTeam(id){
  if(!$("#tc-ass"))return;
  (ass.team?Promise.resolve(ass.team):db.rpc("fm_team_mutuo_aiuto").then(function(r){ass.team=(r&&!r.error&&r.data)||"-";return ass.team;},function(){return "-";}))
  .then(function(t){if(t!==id||team.id!==id)return;ass.rank=null;assAperte();ricaricaTeam();});
}
function assAperte(){
  /* 15/11/2026 19:22, Gab: una coda sola, card con tre stati: Nuova · Presa in carico · Chiusa; in cima le più vecchie */
  var f=$("#tc-ass");if(!f||ass.team!==team.id)return;
  if(ass.rispondo&&document.activeElement&&document.activeElement.id==="ass-risp")return;
  if(!ass.scheda||ass.scheda==="da")ass.scheda="nuove";
  var coda=db.rpc("fm_assistenza_coda").then(function(r){if(r&&!r.error)return r;return db.rpc("fm_assistenza_aperte");});
  Promise.all([coda,ass.scheda==="chiuse"?db.rpc("fm_assistenza_risposte",{p_quante:30}):Promise.resolve(null)]).then(function(v){
    var f=$("#tc-ass");if(!f||ass.team!==team.id)return;
    if(ass.rispondo&&document.activeElement&&document.activeElement.id==="ass-risp")return;
    var tutte=(v[0]&&!v[0].error&&v[0].data)||[],lf=(v[1]&&!v[1].error&&v[1].data)||[];
    /* 25/11/2026 21:59, Gab: «si in cima la piu recente» (SQL 318): prima quelle che non hai ancora letto, poi dalla più recente; aprendo una richiesta diventa «Letta» per te */
    tutte.sort(function(a,b){return ((a.letta?1:0)-(b.letta?1:0))||(new Date(b.ultima_il)-new Date(a.ultima_il));});
    /* mentre la coda è aperta l'ordine resta fermo (una richiesta appena letta non salta in fondo sotto gli occhi); quelle arrivate dopo vanno in cima */
    if(ass.rank){var rk=ass.rank;tutte.forEach(function(x,k){x._k=rk[x.richiesta_id]!=null?rk[x.richiesta_id]:k-1e6;});tutte.sort(function(a,b){return a._k-b._k;});}
    ass.rank={};tutte.forEach(function(x,k){ass.rank[x.richiesta_id]=k;});
    var nuove=tutte.filter(function(x){return !x.seguita_da;}),prese=tutte.filter(function(x){return !!x.seguita_da;});
    var nonLette=nuove.filter(function(x){return !x.letta;}).length;
    var sch=ass.scheda,lista=sch==="nuove"?nuove:sch==="prese"?prese:lf;
    function aspetta(t){var m=Math.max(0,Math.round((Date.now()-new Date(t))/60000));
      return m<60?"aspetta da "+m+" min":m<1440?"aspetta da "+Math.round(m/60)+(Math.round(m/60)===1?" ora":" ore"):"aspetta da "+Math.round(m/1440)+(Math.round(m/1440)===1?" giorno":" giorni");}
    function card(x,senzaTesta){
      var testa=senzaTesta?'':'<div class="ass-chi"><b>'+esc(x.nome||"Una persona")+'</b>'+(x.luogo?'<small>'+esc(x.luogo)+'</small>':'')+
        '<small>'+esc(sch==="chiuse"?assQuando(x.aperta_il||x.risposto_il):assQuando(x.ultima_il)+" · "+aspetta(x.ultima_il))+'</small></div>'+
        '<div class="ass-bis">'+esc(x.motivo?assMotivo(x.motivo):"Senza motivo")+'</div>';
      if(senzaTesta&&x.luogo)testa='<small class="ass-luogo">'+esc(x.luogo)+'</small>';
      if(sch==="chiuse")return '<div class="ass-c">'+(senzaTesta?'':'<span class="ass-st ok">Chiusa</span>')+testa+'<div class="ass-tx">'+esc(x.richiesta||"")+'</div>'+(x.risposta?'<div class="ass-rx">'+esc(x.risposta)+'</div>':'')+'</div>';
      var ri=ass.rispondo===x.richiesta_id,presa=!!x.seguita_da;
      return '<div class="ass-c" data-q="'+esc(x.richiesta_id)+'">'+(senzaTesta?'':presa?'<span class="ass-st pr">Presa in carico</span>':x.letta?'<span class="ass-st le">Letta</span>':'<span class="ass-st da">Nuova</span>')+testa+
        (presa?'<div class="ass-seg-da">'+(x.seguita_da_me?'La segui tu':'La segue '+esc(x.seguita_da))+'</div>':'')+
        (ass.tconv===x.richiesta_id?'<div class="ass-conv" id="ass-tconv"><p class="nota">Un momento…</p></div>':'<div class="ass-tx">'+esc(x.ultimo_testo||"")+'</div>')+
        '<button type="button" class="ass-bt vuoto" data-tconv="'+esc(x.richiesta_id)+'">'+(ass.tconv===x.richiesta_id?'Chiudi la conversazione':'Apri la conversazione')+'</button>'+
        (ri?'<textarea id="ass-risp" maxlength="2000" aria-label="La risposta" placeholder="La risposta"></textarea><button type="button" class="ass-bt" id="ass-risp-b">Manda la risposta</button><button type="button" class="ass-bt vuoto" id="ass-risp-no">Annulla</button><p class="tc-err" id="ass-risp-e" aria-live="polite"></p>'
            :(presa?'':'<button type="button" class="ass-bt vuoto" data-prendo="'+esc(x.richiesta_id)+'">Prendo io</button>')+'<button type="button" class="ass-bt" data-risp="'+esc(x.richiesta_id)+'">Rispondi</button>')+'</div>';
    }
    /* 25/11/2026 22:29, Gab: «questi quadranti sono enormi» → una riga piccola per richiesta (stato, nome, motivo, quando); toccandola si apre sotto */
    function stato(x){return sch==="chiuse"?'<span class="ass-st ok">Chiusa</span>':x.seguita_da?'<span class="ass-st pr">In carico</span>':x.letta?'<span class="ass-st le">Letta</span>':'<span class="ass-st da">Nuova</span>';}
    function riga(x,k){var id=x.richiesta_id||("c"+k),ap=ass.sel===id;
      return '<div class="ass-rg'+(ap?' ap':'')+'"><button type="button" class="ass-rb2" data-sel="'+esc(id)+'" aria-expanded="'+ap+'">'+stato(x)+
        '<span class="ass-rn"><b>'+esc(x.nome||"Una persona")+'</b><span>'+esc(x.motivo?assMotivo(x.motivo):"Senza motivo")+'</span></span>'+
        '<small>'+esc(sch==="chiuse"?giornoTm(x.risposto_il||x.aperta_il):aspetta(x.ultima_il).replace("aspetta da ",""))+'</small><i aria-hidden="true">›</i></button>'+
        (ap?'<div class="ass-det">'+card(x,true)+'</div>':'')+'</div>';}
    f.innerHTML='<div class="ass-cima"><b>Assistenza comunitaria integrata</b><button type="button" class="mini" id="ass-stat-b">Statistiche</button></div>'+
      '<div class="ass-seg" role="tablist"><button type="button" role="tab" data-sch="nuove" aria-selected="'+(sch==="nuove")+'">Nuove · '+nonLette+'</button><button type="button" role="tab" data-sch="prese" aria-selected="'+(sch==="prese")+'">In carico · '+prese.length+'</button><button type="button" role="tab" data-sch="chiuse" aria-selected="'+(sch==="chiuse")+'">Chiuse</button></div>'+
      (lista.length?'<div class="ass-elenco">'+lista.map(riga).join("")+'</div>'
        :'<p class="nota">'+(sch==="nuove"?'Nessuna richiesta nuova.':sch==="prese"?'Nessuna richiesta in carico.':'Nessuna richiesta chiusa.')+'</p>')+
      (ass.stat?'<div id="ass-stat"><p class="nota">Un momento…</p></div>':'');
    f.querySelectorAll("[data-sch]").forEach(function(b){b.onclick=function(){ass.scheda=b.getAttribute("data-sch");ass.rispondo=null;ass.tconv=null;ass.sel=null;assAperte();};});
    f.querySelectorAll("[data-sel]").forEach(function(b){b.onclick=function(){var i=b.getAttribute("data-sel");ass.sel=ass.sel===i?null:i;ass.rispondo=null;ass.tconv=null;if(ass.sel&&sch!=="chiuse")segnaLetta(i);assAperte();};});
    /* 16/11/2026, Gab: la risposta resta collegata alla richiesta di chi ha scritto, non nella chat del team */
    function segnaLetta(i){var x=tutte.filter(function(q){return q.richiesta_id===i;})[0];if(!x||x.letta)return;x.letta=true;
      db.rpc("fm_assistenza_letta",{p_richiesta:i}).then(function(){},function(){});}
    f.querySelectorAll("[data-tconv]").forEach(function(b){b.onclick=function(){var i=b.getAttribute("data-tconv");ass.tconv=ass.tconv===i?null:i;if(ass.tconv)segnaLetta(i);assAperte();};});
    if(ass.tconv&&$("#ass-tconv")){var tq=ass.tconv;db.rpc("fm_assistenza_conversazione",{p_richiesta:tq}).then(function(r){var e=$("#ass-tconv");if(!e||ass.tconv!==tq)return;
      var l=(r&&!r.error&&r.data)||[];
      e.innerHTML=l.length?l.map(function(m){return '<div class="ass-f '+(m.dal_team?"mio":"team")+'">'+testoLink(m.testo,"t","div")+'<small>'+esc(m.chi||"")+" · "+esc(assQuando(m.scritto_il))+'</small></div>';}).join(""):'<p class="nota">La conversazione non si apre adesso.</p>';},function(){});}
    var g=$("#ass-giro");if(g){var pu=f.querySelectorAll(".ass-punti i");
      g.addEventListener("scroll",function(){var w=g.firstElementChild?g.firstElementChild.offsetWidth+12:1,k=Math.round(g.scrollLeft/w);pu.forEach(function(p,n){p.className=n===k?"on":"";});},{passive:true});
      if(ass.rispondo){var c=g.querySelector('[data-q="'+ass.rispondo+'"]');if(c)g.scrollLeft=c.offsetLeft-g.offsetLeft-18;}}
    f.querySelectorAll("[data-prendo]").forEach(function(b){b.onclick=function(){b.disabled=true;db.rpc("fm_assistenza_prendo",{p_richiesta:b.getAttribute("data-prendo")}).then(function(r){
      b.disabled=false;if(r&&!r.error&&(r.data==null||r.data==="ok")){ass.scheda="prese";assAperte();return;}b.textContent=(r&&r.error&&r.error.message)||(r&&r.data)||"Si può riprovare.";},function(){b.disabled=false;b.textContent="Si può riprovare.";});};});
    f.querySelectorAll("[data-risp]").forEach(function(b){b.onclick=function(){ass.rispondo=b.getAttribute("data-risp");segnaLetta(ass.rispondo);assAperte();setTimeout(function(){var t=$("#ass-risp");if(t)t.focus();},300);};});
    var no=$("#ass-risp-no");if(no)no.onclick=function(){ass.rispondo=null;if(document.activeElement)document.activeElement.blur();assAperte();};
    var ok=$("#ass-risp-b");if(ok)ok.onclick=function(){var t=$("#ass-risp").value.trim(),e=$("#ass-risp-e");if(!t){e.textContent="Scrivi la risposta.";return;}
      ok.disabled=true;db.rpc("fm_assistenza_rispondi",{p_richiesta:ass.rispondo,p_testo:t}).then(function(r){ok.disabled=false;
        if(r&&!r.error&&r.data==="ok"){ass.rispondo=null;if(document.activeElement)document.activeElement.blur();assAperte();ricaricaTeam(true);return;}
        e.textContent=(r&&r.data)||errore(r&&r.error);},function(x){ok.disabled=false;e.textContent=errore(x);});};
    $("#ass-stat-b").onclick=function(){ass.stat=!ass.stat;assAperte();};
    if(ass.stat)db.rpc("fm_assistenza_statistiche",{}).then(function(r){var e=$("#ass-stat");if(!e)return;var l=(r&&!r.error&&r.data)||[];
      e.innerHTML=l.length?'<div class="ass-tab"><table><thead><tr><th>Motivo</th><th>Richieste</th><th>In archivio</th><th>Ore alla risposta</th></tr></thead><tbody>'+
        l.map(function(x){return '<tr><td>'+esc(x.motivo==="senza motivo"?"Senza motivo":assMotivo(x.motivo))+'</td><td>'+x.richieste+'</td><td>'+x.in_archivio+'</td><td>'+(x.ore_medie_prima_risposta==null?"–":esc(String(x.ore_medie_prima_risposta).replace(".",",")))+'</td></tr>';}).join("")+
        '</tbody></table></div><p class="nota">Solo numeri: niente nomi, niente testi.</p>':'<p class="nota">Ancora nessuna richiesta.</p>';},function(){});
  },function(){});
}
function assApriRisposta(rid){ass.rispondo=rid;ass.sel=rid;team.scelto=null;disegnaTeam();assAperte();var f=$("#tc-ass");if(f)f.scrollIntoView({behavior:"smooth",block:"start"});}
var ASS_CSS='.ass-nota{font-size:16px;color:#c9c3d6;margin:8px 0 0}#ass-mail{width:100%;box-sizing:border-box;background:rgba(245,240,230,.06);color:#F5F0E6;border:1px solid rgba(214,181,108,.4);border-radius:12px;font-size:18px;padding:12px}.ass-int{text-align:center;font-size:18px;color:#c9c3d6;margin:0 0 6px}.ass-fac{font-size:15px;opacity:.8}'+
'.ass-chips{display:flex;flex-wrap:wrap;gap:8px}.ass-chip{font:600 16px "DM Sans",system-ui,sans-serif;padding:8px 14px;border-radius:99px;border:1px solid #D4AF6A;background:transparent;color:#F5F0E6;cursor:pointer}'+
'.ass-chip[aria-pressed="true"]{background:#D4AF6A;color:#0a1430}.ass-chip:focus-visible,.ass-rt:focus-visible{outline:2px solid #D4AF6A;outline-offset:2px}'+
'.ass-h{font-family:"Cinzel",Georgia,serif;font-weight:500;font-size:22px;color:#D4AF6A;margin:28px 0 10px}'+
'#ass-mie{display:grid;gap:10px;margin-bottom:16px}.ass-r{border:1px solid rgba(212,175,106,.35);border-radius:14px;background:#1a2148;overflow:hidden}'+
'.ass-rt{display:grid;gap:4px;width:100%;text-align:left;background:transparent;border:0;color:#F5F0E6;padding:12px 14px;font:400 17px "DM Sans",system-ui,sans-serif;cursor:pointer}'+
'.ass-rc{display:flex;justify-content:space-between;gap:8px;align-items:center}.ass-rc b{color:#D4AF6A}'+
'.ass-ru{overflow-wrap:anywhere;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.ass-rt small,.ass-f small,.ass-qt small{color:rgba(245,240,230,.65);font-size:14px}'+
'.ass-st{font-size:13px;letter-spacing:.05em;text-transform:uppercase;border-radius:99px;padding:2px 10px;white-space:nowrap}.ass-st.att{background:#D4AF6A;color:#0a1430}.ass-st.ok{border:1px solid rgba(245,240,230,.5);color:rgba(245,240,230,.8)}'+
'.ass-conv{display:grid;gap:8px;padding:0 14px 12px}.ass-f{border-radius:14px;padding:10px 12px;max-width:90%;font-size:17px;display:grid;gap:4px}'+
'.ass-f.mio{background:#232c5c;justify-self:end}.ass-f.team{border:1px solid #D4AF6A;justify-self:start}'+
'#tc-ass:empty{display:none}#tc-ass{margin:10px 0 0;padding:12px;border:1px solid #D4AF6A;border-radius:16px;background:#1a2148;display:grid;gap:10px}'+
'.ass-cima{display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap}.ass-cima b{color:#D4AF6A;font-size:17px}'+
'.ass-q{border-top:1px solid rgba(212,175,106,.3);padding-top:10px;display:grid;gap:6px}.ass-qt{display:flex;flex-wrap:wrap;gap:6px;align-items:baseline}.ass-qt small{margin-left:auto}'+
'.ass-qx{white-space:pre-wrap;overflow-wrap:anywhere;font-size:17px}.ass-rb{justify-self:start}.ass-qb{display:flex;gap:10px;align-items:center;flex-wrap:wrap}'+
'#ass-risp{width:100%;box-sizing:border-box;min-height:110px;background:#232c5c;color:#F5F0E6;border:1px solid rgba(212,175,106,.4);border-radius:12px;padding:12px;font:400 18px "DM Sans",system-ui,sans-serif}'+
'.ass-tab{overflow-x:auto}.ass-tab table{border-collapse:collapse;width:100%;font-size:15px;font-variant-numeric:tabular-nums}.ass-tab th,.ass-tab td{text-align:left;padding:6px 4px;border-bottom:1px solid rgba(212,175,106,.3)}.ass-tab th{color:#D4AF6A;font-weight:600}'+
/* 15/11 card scorrevoli */'.ass-seg{display:flex;background:rgba(245,240,230,.08);border-radius:12px;padding:3px;margin:10px 0 14px}.ass-seg button{flex:1;border:0;background:none;color:#c9c3d6;font:600 17px "DM Sans",system-ui,sans-serif;padding:10px 6px;border-radius:10px;cursor:pointer}.ass-seg button[aria-selected="true"]{background:#D4AF6A;color:#1A1405}.ass-seg button:focus-visible{outline:2px solid #D4AF6A;outline-offset:2px}.ass-giro{display:flex;gap:12px;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;margin:0 -4px;padding:0 4px 4px}.ass-giro::-webkit-scrollbar{display:none}.ass-c{flex:0 0 88%;scroll-snap-align:center;background:#1a2148;border:1px solid rgba(212,175,106,.35);border-radius:20px;padding:18px;display:flex;flex-direction:column;gap:10px;box-sizing:border-box;min-width:0}.ass-giro .ass-c:only-child{flex-basis:100%}.ass-st{align-self:flex-start;font-size:15px;font-weight:700;padding:4px 12px;border-radius:99px;color:#1A1405;text-transform:none;letter-spacing:0}.ass-st.da{background:#E07A55}.ass-st.ok{background:#8DBF5E}.ass-chi b{display:block;font-size:21px;line-height:1.2}.ass-chi small{display:block;font-size:16px;color:#c9c3d6;margin-top:3px}.ass-mo{align-self:flex-start;font-size:15px;border:1px solid #D4AF6A;color:#D4AF6A;padding:3px 11px;border-radius:99px}.ass-tx{font-size:19px;line-height:1.5;white-space:pre-wrap;overflow-wrap:anywhere;flex:1}.ass-rx{border-left:4px solid #8DBF5E;padding:8px 12px;background:rgba(141,191,94,.08);border-radius:8px;font-size:18px;white-space:pre-wrap;overflow-wrap:anywhere}.ass-bt{border:0;border-radius:99px;padding:14px;font:700 19px "DM Sans",system-ui,sans-serif;background:#D4AF6A;color:#1A1405;cursor:pointer}.ass-bt.vuoto{background:none;border:2px solid #D4AF6A;color:#D4AF6A}.ass-bt:focus-visible{outline:2px solid #F5F0E6;outline-offset:2px}.ass-punti{display:flex;justify-content:center;gap:7px;margin-top:12px}.ass-punti i{width:8px;height:8px;border-radius:50%;background:rgba(245,240,230,.3)}.ass-punti i.on{background:#D4AF6A}'+
'.ass-griglia{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px;margin:6px 0 18px}.ass-sc{display:flex;flex-direction:column;gap:6px;text-align:left;background:#1a2148;border:1px solid rgba(214,181,108,.35);border-radius:18px;padding:14px;color:#F5F0E6;cursor:pointer;font:inherit;min-height:84px}.ass-sc b{font-size:18px;line-height:1.25}.ass-sc span{font-size:16px;line-height:1.35;color:#c9c3d6}.ass-sc.su{grid-column:1/-1;border-color:#6FA8D6;background:rgba(111,168,214,.12)}.ass-sc.su b{color:#6FA8D6}.ass-sc:focus-visible,.ass-gia:focus-visible{outline:2px solid #D4AF6A;outline-offset:2px}.ass-gia{display:block;width:100%;text-align:left;background:rgba(111,168,214,.12);border:1px solid #6FA8D6;border-radius:14px;padding:12px 14px;margin:18px 0 6px;color:#F5F0E6;font:inherit;font-size:17px;line-height:1.35;cursor:pointer}.ass-gia b{color:#6FA8D6}'+
'/* 15/11 riordino */.ass-st.pr{background:#6FA8D6}.ass-st.le{background:#c9c3d6}.ass-elenco{display:grid;gap:6px}.ass-rg{background:#1a2148;border:1px solid rgba(212,175,106,.3);border-radius:14px}.ass-rg.ap{border-color:#D4AF6A}.ass-rb2{display:flex;align-items:center;gap:10px;width:100%;background:none;border:0;color:#F5F0E6;font:inherit;text-align:left;padding:10px 12px;cursor:pointer;min-height:56px}.ass-rb2:focus-visible{outline:2px solid #D4AF6A;outline-offset:2px;border-radius:14px}.ass-rb2 .ass-st{font-size:13px;padding:3px 9px;flex:none;align-self:center}.ass-rn{flex:1;min-width:0;display:grid}.ass-rn b{font-size:17px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ass-rn span{font-size:15px;color:#D4AF6A;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ass-rb2 small{font-size:14px;color:#c9c3d6;flex:none}.ass-rb2 i{font-style:normal;color:#D4AF6A;transition:transform .2s}.ass-rg.ap .ass-rb2 i{transform:rotate(90deg)}.ass-det .ass-c{background:none;border:0;border-top:1px solid rgba(212,175,106,.25);border-radius:0;padding:12px;flex:none}.ass-det .ass-tx{font-size:18px}.ass-luogo{font-size:15px;color:#c9c3d6}.ass-bis{font-size:20px;font-weight:700;color:#D4AF6A;line-height:1.3}.ass-seg-da{font-size:17px;color:#6FA8D6;font-weight:600}.ass-mia{margin:0 0 14px}.ass-dopo{display:block;font-size:16px;color:#c9c3d6}';
document.head.insertAdjacentHTML("beforeend","<style>"+ASS_CSS+"</style>");

