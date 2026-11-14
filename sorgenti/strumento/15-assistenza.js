/* ═══ ASSISTENZA · team Assistenza comunitaria integrata · SQL 166 · thread «Aprire un canale di assistenza nell'app», 5/11/2026 ═══
   Gab 4/11: «per scrivere su assistenza fai comunque loggin» · «un gruppo interno di assistenza /mutuo aiuto che riceva il messaggio
   in chat e che poi rispondendo lì gli arriva in automatico» · «non scrivere i motivi come obblico, ma come possibilità» ·
   «il team può avere i messaggi fissati come richieste d assistenza a cui rispondere , ma mano che qualcuno risponde ,qieste vengono archiviate».
   Chi scrive non entra nel team: vede solo le sue richieste. Il team risponde dalla sua chat (richieste in cima, «Rispondi»). */
var ASS_MOTIVI=[["vicinati","Vicinati"],["produttore","Produttore"],["operatore","Operatore"],["eventi","Prossimi eventi"],["interviste","Interviste"],["praticantato","Praticantato"],["karma_yoga","Mettiti al servizio col Karma Yoga"],["coscienza_tecnologia","Ricevere assistenza tra coscienza e tecnologia"],["azienda","Attivare la propria azienda"]]; /* 12/11 Gab, SQL 246 */
function assMotivo(m){var x=ASS_MOTIVI.filter(function(a){return a[0]===m;})[0];return x?x[1]:"Senza motivo";}
function assQuando(t){return giornoTm(t)+" · "+hhmm(t);}
var ass={motivo:null,aperta:null,team:null,stat:false,rispondo:null};
function vAssistenza(){
  var c=$("#corpo");
  /* 5/11 10:54, Gab: «gli possiamo prima far toccare e segnare di cosa ha bisogna e schiacciando invia, entra col nexus» (SQL 167):
     chi non è entrato scrive anche la mail; il messaggio aspetta sul server 7 giorni e parte quando entra con quella mail. */
  var fuori=!io.id;
  ass.motivo=null;
  /* 12/11/2026, Gab: «tutti i tasti che portano verso assistenza devono portare quindi verso l'accesso» → chi non è entrato
     passa dall'accesso e torna qui con la voce già scelta (?motivo=). */
  var qm0=null;try{qm0=new URLSearchParams(location.search).get("motivo");}catch(e){}
  if(qm0&&!ASS_MOTIVI.some(function(a){return a[0]===qm0;}))qm0=null;
  if(fuori){location.replace("accesso.html?torna="+encodeURIComponent("strumento.html?v=assistenza"+(qm0?"&motivo="+qm0:"")));return;}
  c.innerHTML='<h2 class="az-tit">Assistenza</h2><div class="az-filo"></div>'+
    '<p class="ass-int">Ti risponde il team Assistenza comunitaria integrata.</p>'+
    '<p class="az-l" id="ass-ml">Di cosa vuoi sapere? <span class="ass-fac">(facoltativo)</span></p>'+
    '<div class="ass-chips" role="group" aria-labelledby="ass-ml">'+ASS_MOTIVI.map(function(a){return '<button type="button" class="ass-chip" data-mot="'+a[0]+'" aria-pressed="false">'+esc(a[1])+'</button>';}).join("")+'</div>'+
    '<label class="az-l" for="ass-t">Il tuo messaggio</label><textarea id="ass-t" maxlength="2000" style="min-height:160px"></textarea>'+
    (fuori?'<label class="az-l" for="ass-mail">La tua mail</label><input type="email" id="ass-mail" maxlength="254" autocomplete="email" inputmode="email">'+
      '<p class="ass-nota">Dopo «Invia» entri in Felicitas con questa mail: il messaggio parte quando sei dentro.</p>':'')+
    '<p style="margin-top:18px"><button class="btn pieno az-invia" type="button" id="ass-invia">Invia all’Assistenza comunitaria integrata</button></p><p class="az-esito" id="ass-esito" aria-live="polite"></p>'+
    (fuori?'':'<h3 class="ass-h">Le mie richieste</h3><div id="ass-mie"><p class="nota">Un momento…</p></div>')+
    '<p><button class="mini" data-vai="azione">‹ Espandi</button></p>';
  legaVai(c);
  c.querySelectorAll("[data-mot]").forEach(function(b){b.onclick=function(){var m=b.getAttribute("data-mot");ass.motivo=ass.motivo===m?null:m;
    c.querySelectorAll("[data-mot]").forEach(function(x){x.setAttribute("aria-pressed",String(x.getAttribute("data-mot")===ass.motivo));});};});
  /* 12/11: dai tasti di home, Piani e Praticantato la voce arriva già scelta (strumento.html?v=assistenza&motivo=…) */
  if(qm0){ass.motivo=qm0;c.querySelectorAll("[data-mot]").forEach(function(x){x.setAttribute("aria-pressed",String(x.getAttribute("data-mot")===qm0));});}
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
      if(r&&r.data==="ok"){e.textContent="Inviata. Quando ti rispondiamo arriva una notifica.";$("#ass-t").value="";ass.motivo=null;
        c.querySelectorAll("[data-mot]").forEach(function(x){x.setAttribute("aria-pressed","false");});assMie();}
      else e.textContent=(r&&r.data)||"";},function(){b.disabled=false;e.textContent="Non è partita. Si può riprovare.";});};
  if(fuori)return;
  /* appena entrati: i messaggi scritti prima di entrare (SQL 167) partono adesso */
  db.rpc("fm_assistenza_porta").then(function(r){var n=(r&&!r.error&&+r.data)||0;
    if(n&&$("#ass-esito"))$("#ass-esito").textContent=n===1?"Il tuo messaggio è arrivato all’Assistenza comunitaria integrata.":"I tuoi "+n+" messaggi sono arrivati all’Assistenza comunitaria integrata.";assMie();},function(){assMie();});
}
function assMie(){
  var box=$("#ass-mie");if(!box)return;
  db.rpc("fm_mie_richieste").then(function(r){if(vista!=="assistenza"||!$("#ass-mie"))return;
    if(!r||r.error){box.innerHTML='<p class="nota">Le richieste non si aprono adesso. Si può riprovare.</p>';return;}
    var l=r.data||[];
    if(!l.length){box.innerHTML='<p class="nota">Ancora nessuna richiesta.</p>';return;}
    box.innerHTML=l.map(function(x){var ap=ass.aperta===x.richiesta_id;
      return '<div class="ass-r'+(ap?' ap':'')+'"><button type="button" class="ass-rt" data-ric="'+esc(x.richiesta_id)+'" aria-expanded="'+ap+'">'+
        '<span class="ass-rc"><b>'+esc(assMotivo(x.motivo))+'</b><span class="ass-st '+(x.stato==="aperta"?"att":"ok")+'">'+(x.stato==="aperta"?"in attesa":"risposta")+'</span></span>'+
        '<span class="ass-ru">'+(x.ultimo_dal_team?"Assistenza comunitaria integrata: ":"")+esc(x.ultimo_testo||"")+'</span><small>'+esc(assQuando(x.ultima_il))+'</small></button>'+
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
  .then(function(t){if(t!==id||team.id!==id)return;assAperte();});
}
function assAperte(){
  var f=$("#tc-ass");if(!f||ass.team!==team.id)return;
  if(ass.rispondo&&document.activeElement&&document.activeElement.id==="ass-risp")return;
  db.rpc("fm_assistenza_aperte").then(function(r){var f=$("#tc-ass");if(!f||ass.team!==team.id)return;
    if(ass.rispondo&&document.activeElement&&document.activeElement.id==="ass-risp")return;
    var l=(r&&!r.error&&r.data)||[];
    f.innerHTML='<div class="ass-cima"><b>Richieste d\'assistenza · '+l.length+'</b><button type="button" class="mini" id="ass-stat-b">Statistiche</button></div>'+
      (l.length?'':'<p class="nota">Nessuna richiesta in attesa.</p>')+
      l.map(function(x){var ri=ass.rispondo===x.richiesta_id;
        return '<div class="ass-q" data-q="'+esc(x.richiesta_id)+'"><div class="ass-qt"><b>'+esc(x.nome||"Una persona")+'</b>'+(x.motivo?' · '+esc(assMotivo(x.motivo)):'')+'<small>'+esc(assQuando(x.ultima_il))+'</small></div>'+
          '<div class="ass-qx">'+esc(x.ultimo_testo||"")+'</div>'+
          (ri?'<textarea id="ass-risp" maxlength="2000" aria-label="La risposta"></textarea><div class="ass-qb"><button type="button" class="btn pieno" id="ass-risp-b">Manda la risposta</button><button type="button" class="mini" id="ass-risp-no">Annulla</button></div><p class="tc-err" id="ass-risp-e" aria-live="polite"></p>'
              :'<button type="button" class="btn pieno ass-rb" data-risp="'+esc(x.richiesta_id)+'">Rispondi</button>')+'</div>';}).join("")+
      (ass.stat?'<div id="ass-stat"><p class="nota">Un momento…</p></div>':'');
    f.querySelectorAll("[data-risp]").forEach(function(b){b.onclick=function(){ass.rispondo=b.getAttribute("data-risp");assAperte();setTimeout(function(){var t=$("#ass-risp");if(t)t.focus();},300);};});
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
function assApriRisposta(rid){ass.rispondo=rid;team.scelto=null;disegnaTeam();assAperte();var f=$("#tc-ass");if(f)f.scrollIntoView({behavior:"smooth",block:"start"});}
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
'.ass-tab{overflow-x:auto}.ass-tab table{border-collapse:collapse;width:100%;font-size:15px;font-variant-numeric:tabular-nums}.ass-tab th,.ass-tab td{text-align:left;padding:6px 4px;border-bottom:1px solid rgba(212,175,106,.3)}.ass-tab th{color:#D4AF6A;font-weight:600}';
document.head.insertAdjacentHTML("beforeend","<style>"+ASS_CSS+"</style>");

