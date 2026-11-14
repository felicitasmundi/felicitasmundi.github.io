/* PERSONE · 6 nov, Gab: «a me servirebbe che nel admin panel possa vedere tutti quelli che lavorano in felicitas, chiunque abbia un ruolo,
   ed io toccando su un tasto potrei aggiungere ruoli, o toglierlo, o inserirlo in un team o dargli accesso ad altre aree» (SQL 182) */
var pers={lista:[],team:[],aperta:null,cerca:""};
function vPersone(){
  var c=$("#corpo");
  if(!io.nucleo){vista="azione";vAzione();return;}
  c.innerHTML='<h2 class="az-tit">Persone</h2><p class="nota" style="text-align:center">Chi ha un ruolo o è in un team. Tocca una persona per i suoi ruoli, i suoi team e cosa vede. Solo per il nucleo.</p>'+
    '<label style="display:block;margin:10px 0">Cerca<input type="search" id="pe-cerca" autocomplete="off" placeholder="Nome"></label>'+
    '<div id="pe-lista"><p class="nota">Un momento…</p></div>'+
    '<p style="margin-top:16px"><button class="mini" data-vai="plancia">‹ Admin panel</button> <button class="mini" data-vai="oggi">‹ Oggi</button></p>';
  legaVai(c);
  var q=$("#pe-cerca");q.value=pers.cerca;q.oninput=function(){pers.cerca=q.value;peLista();};
  peCarica();
}
function peCarica(){
  Promise.all([
    db.rpc("fm_persone_lavoro").then(function(r){return r&&!r.error?(r.data||[]):null;},function(){return null;}),
    db.from("squadre").select("id,nome").order("nome").then(function(r){return (r&&!r.error&&r.data)||[];},function(){return [];}),
    tutteLePersone?Promise.resolve(tutteLePersone):db.from("persone_pubbliche").select("id,nome").order("nome").limit(1000).then(function(r){tutteLePersone=(r&&!r.error&&r.data)||[];tutteLePersone.forEach(function(p){nomi[p.id]=p.nome||"";});return tutteLePersone;},function(){return [];})
  ]).then(function(v){
    if(vista!=="persone")return;
    if(v[0]===null){$("#pe-lista").innerHTML='<p class="nota">L\'elenco si apre con l\'SQL 182.</p>';return;}
    pers.lista=v[0];pers.team=v[1].filter(function(t){return t.nome!=="Praticantato";});peLista();
  });
}
function peLista(){
  var box=$("#pe-lista");if(!box)return;
  var n=String(pers.cerca||"").trim().toLowerCase();
  /* 6 nov 18:19, Gab: «io vedo che c e riccardo ma non è riportato in persone» → la ricerca trova anche chi è entrato senza ruolo né team */
  var dentro={};pers.lista.forEach(function(p){dentro[p.persona_id]=1;});
  if(pers.nuova&&!dentro[pers.nuova.persona_id]){pers.lista.unshift(pers.nuova);dentro[pers.nuova.persona_id]=1;}
  var ll=pers.lista.filter(function(p){return !n||String(p.nome||"").toLowerCase().indexOf(n)>=0;});
  var altri=n?(tutteLePersone||[]).filter(function(p){return !dentro[p.id]&&String(p.nome||"").toLowerCase().indexOf(n)>=0;}).slice(0,20):[];
  var conta=pers.lista.filter(function(p){return p!==pers.nuova;}),senza=conta.filter(function(p){return p.senza_ruolo&&(p.team||[]).length;}).length;
  var ch='display:inline-block;margin:4px 6px 0 0;padding:2px 8px;border-radius:10px;font-size:13px;border:1px solid rgba(212,175,106,.45)';
  box.innerHTML='<p class="et">'+conta.length+(conta.length==1?' persona':' persone')+(senza?' · '+senza+' in un team senza ruolo':'')+'</p>'+
    (ll.length?ll.map(function(p){
      var ap=pers.aperta===p.persona_id;
      return '<div class="card modulo" style="margin-bottom:10px"><button type="button" class="pe-p" data-pe="'+esc(p.persona_id)+'" aria-expanded="'+ap+'" style="all:unset;cursor:pointer;display:block;width:100%">'+
        '<b style="font-size:18px">'+esc(p.nome)+'</b>'+(p.senza_ruolo?' <span style="'+ch+';border-color:#E07A55;color:#E07A55">senza ruolo</span>':'')+
        '<div>'+(p.ruoli||[]).map(function(x){return '<span style="'+ch+'">'+esc(FUNZIONI[x.funzione]||x.funzione)+' · '+esc(nomeRuolo(x.funzione,x.ruolo))+'</span>';}).join("")+'</div>'+
        '<div>'+(p.team||[]).map(function(t){return '<span style="'+ch+';border-style:dashed">Team '+esc(t.nome)+(t.responsabile?' · responsabile':'')+'</span>';}).join("")+'</div></button>'+
        (ap?peScheda(p):'')+'</div>';
    }).join(""):(altri.length?'':'<p class="nota">Nessuno con questo nome.</p>'))+
    (altri.length?'<p class="et" style="margin-top:12px">Entrati, senza ruolo né team</p>'+altri.map(function(p){return '<div class="persona"><div><b>'+esc(p.nome||"senza nome")+'</b></div><button class="mini oro" data-pe-nuova="'+esc(p.id)+'">Apri la scheda</button></div>';}).join(""):
      (n?'':'<p class="nota" style="margin-top:12px">Chi è entrato ma non ha ancora ruolo né team: scrivi il nome in «Cerca».</p>'));
  box.querySelectorAll("[data-pe-nuova]").forEach(function(b){b.onclick=function(){var id=b.getAttribute("data-pe-nuova");
    pers.nuova={persona_id:id,nome:nomi[id]||"senza nome",ruoli:[],team:[],senza_ruolo:true};pers.aperta=id;peLista();};});
  box.querySelectorAll("[data-pe]").forEach(function(b){b.onclick=function(){var id=b.getAttribute("data-pe");pers.aperta=pers.aperta===id?null:id;peLista();};});
  var p=pers.lista.filter(function(x){return x.persona_id===pers.aperta;})[0];if(p)peLega(box,p);
}
function peScheda(p){
  var tf=Object.keys(FUNZIONI)[0];
  var fuori=pers.team.filter(function(t){return !(p.team||[]).some(function(x){return x.squadra_id===t.id;});});
  return '<div style="margin-top:12px;border-top:1px solid rgba(212,175,106,.3);padding-top:10px">'+
    '<p class="et">Ruoli</p>'+((p.ruoli||[]).length?(p.ruoli||[]).map(function(x){return '<div class="persona"><div><b>'+esc(nomeRuolo(x.funzione,x.ruolo))+'</b><small>'+esc(FUNZIONI[x.funzione]||x.funzione)+'</small></div><button class="mini" data-pe-rt="'+esc(x.funzione+"|"+x.ruolo)+'">Togli</button></div>';}).join(""):'<p class="nota">Nessun ruolo.</p>')+
    '<div class="due"><label>Funzione<select id="pe-f">'+Object.keys(FUNZIONI).map(function(f){return '<option value="'+f+'">'+FUNZIONI[f]+'</option>';}).join("")+'</select></label>'+
    '<label>Ruolo<select id="pe-r">'+RUOLI[tf].map(function(x){return '<option value="'+x[0]+'">'+x[1]+'</option>';}).join("")+'</select></label></div>'+
    '<div class="azioni"><button class="btn pieno" id="pe-dai">Dai il ruolo</button></div>'+
    '<p class="et" style="margin-top:12px">Team</p>'+((p.team||[]).length?(p.team||[]).map(function(t){return '<div class="persona"><div><b>'+esc(t.nome)+'</b>'+(t.responsabile?'<small>responsabile</small>':'')+'</div><button class="mini" data-pe-tt="'+esc(t.squadra_id)+'">Togli</button></div>';}).join(""):'<p class="nota">In nessun team.</p>')+
    (fuori.length?'<label>Metti nel team<select id="pe-t">'+fuori.map(function(t){return '<option value="'+esc(t.id)+'">'+esc(t.nome)+'</option>';}).join("")+'</select></label><div class="azioni"><button class="btn pieno" id="pe-metti">Metti nel team</button></div>':'')+
    '<p class="et" style="margin-top:12px">Cosa vede</p><p class="nota">Chi ha un ruolo legge i capitoli del Cervello per chi ha un ruolo. I capitoli si scelgono in <button class="mini" data-vai="plancia">Chi vede cosa</button>. Le altre aree: [da definire].</p>'+
    '<div class="toast" id="pe-ok" hidden></div></div>';
}
function peLega(box,p){
  legaVai(box);
  var f=$("#pe-f");if(f)f.onchange=function(){$("#pe-r").innerHTML=RUOLI[f.value].map(function(x){return '<option value="'+x[0]+'">'+x[1]+'</option>';}).join("");};
  function fatto(r,b){if(b)b.disabled=false;if(r&&r.error)return mostra("#pe-ok",errore(r.error),true);if(r&&r.data&&r.data!=="ok")return mostra("#pe-ok",r.data,true);peCarica();}
  var d=$("#pe-dai");if(d)d.onclick=function(){d.disabled=true;db.rpc("fm_persona_ruolo",{p_persona:p.persona_id,p_funzione:$("#pe-f").value,p_ruolo:$("#pe-r").value,p_dai:true}).then(function(r){fatto(r,d);},function(){d.disabled=false;});};
  box.querySelectorAll("[data-pe-rt]").forEach(function(b){b.onclick=function(){
    var a=b.getAttribute("data-pe-rt").split("|");if(!confirm("Togliere il ruolo «"+nomeRuolo(a[0],a[1])+"» a "+p.nome+"?"))return;
    b.disabled=true;db.rpc("fm_persona_ruolo",{p_persona:p.persona_id,p_funzione:a[0],p_ruolo:a[1],p_dai:false}).then(function(r){fatto(r,b);},function(){b.disabled=false;});};});
  var m=$("#pe-metti");if(m)m.onclick=function(){m.disabled=true;db.rpc("fm_persona_team",{p_persona:p.persona_id,p_squadra:$("#pe-t").value,p_dentro:true}).then(function(r){fatto(r,m);},function(){m.disabled=false;});};
  box.querySelectorAll("[data-pe-tt]").forEach(function(b){b.onclick=function(){
    if(!confirm("Togliere "+p.nome+" da questo team?"))return;
    b.disabled=true;db.rpc("fm_persona_team",{p_persona:p.persona_id,p_squadra:b.getAttribute("data-pe-tt"),p_dentro:false}).then(function(r){fatto(r,b);},function(){b.disabled=false;});};});
}
function vPlancia(){
  var c=$("#corpo");
  if(!io.nucleo){vista="azione";vAzione();return;}
  c.innerHTML='<h2 class="az-tit">Admin panel</h2><p class="nota" style="text-align:center">Chi vede cosa, cosa aspetta un sì, cosa costa. Solo per il nucleo.</p>'+
    '<div class="pl-sez"><p class="et">Persone</p><p><button class="btn pieno" data-vai="persone">Chi ha un ruolo o è in un team</button></p></div>'+
    '<div class="pl-sez"><p class="et">Chi vede cosa · i capitoli del Cervello</p><div id="pl-cap" class="pl-cap"><p class="nota">Un momento…</p></div><div id="pl-nuovo"></div></div>'+
    '<div class="pl-sez"><p class="et">Approvazioni in attesa</p><div id="pl-app" class="card modulo"><p class="nota">Un momento…</p></div></div>'+
    '<div class="pl-sez"><p class="et">Costi</p><div id="pl-costi" class="card modulo"><p class="nota">Un momento…</p></div></div>'+
    '<p style="margin-top:16px"><button class="mini" data-vai="staff">‹ Aggiungi una persona</button> <button class="mini" data-vai="azione">‹ Espandi</button></p>';
  legaVai(c);
  Promise.all([
    db.rpc("fm_capitoli_plancia").then(function(r){return (r&&!r.error&&r.data)||[];},function(){return [];}),
    db.from("squadre").select("id,nome").order("nome").then(function(r){return (r&&!r.error&&r.data)||[];},function(){return [];}),
    tutteLePersone?Promise.resolve(tutteLePersone):db.from("persone_pubbliche").select("id,nome").order("nome").limit(1000).then(function(r){tutteLePersone=(r&&!r.error&&r.data)||[];tutteLePersone.forEach(function(p){nomi[p.id]=p.nome||"";});return tutteLePersone;},function(){return [];})
  ]).then(function(v){if(vista!=="plancia")return;plancia.cap=v[0];plancia.team=v[1];plCapitoli();plNuovo();});
  plApprovazioni();plCosti();
}
function plCapitoli(){
  var box=$("#pl-cap");if(!box)return;
  var l=plancia.cap,gr=[["tecnico","Cervello tecnico"],["creativo","Cervello creativo"],[null,"Senza sezione"]];
  if(!l.length){box.innerHTML='<p class="nota">Nessun capitolo, a parte quelli personali.</p>';return;}
  box.innerHTML=gr.map(function(g){var k=l.filter(function(x){return (x.sezione||null)===g[0];});if(!k.length)return "";
    return '<p class="et" style="margin-top:8px">'+g[1]+'</p>'+k.map(function(x){
      return '<button type="button" class="pl-c" data-pl="'+esc(x.id)+'"><span><b>'+esc(x.titolo)+'</b><small>'+esc(plChi(x))+(x.responsabile?' · responsabile '+esc(x.responsabile):' · nessun responsabile')+'</small></span><span class="n">'+x.righe+(x.righe==1?' card':' card')+'</span></button>'+
        (plancia.aperto===x.id?plEditor(x):'');}).join("");}).join("");
  box.querySelectorAll("[data-pl]").forEach(function(b){b.onclick=function(){var id=b.getAttribute("data-pl");plancia.aperto=plancia.aperto===id?null:id;plCapitoli();};});
  if(plancia.aperto)plLegaEditor(l.filter(function(x){return x.id===plancia.aperto;})[0]);
}
function plOpzTeam(sel){return '<option value="">—</option>'+plancia.team.map(function(t){return '<option value="'+esc(t.id)+'"'+(t.id===sel?' selected':'')+'>'+esc(t.nome||"")+'</option>';}).join("");}
function plOpzPersone(){return '<datalist id="pl-persone">'+(tutteLePersone||[]).map(function(p){return '<option value="'+esc(p.nome)+'">';}).join("")+'</datalist>';}
function plEditor(x){
  var liv=x.livello?'<label>Chi legge<select id="pl-liv">'+Object.keys(PL_LIVELLI).map(function(k){return '<option value="'+k+'"'+(x.livello===k?' selected':'')+'>'+PL_LIVELLI[k]+'</option>';}).join("")+'</select></label>'+
      '<label>Lo legge anche il team<select id="pl-anche">'+plOpzTeam(x.anche_squadra)+'</select></label>':'<p class="nota">'+esc(plChi(x))+': lo leggono loro.</p>';
  return '<div class="pl-ed" id="pl-ed">'+liv+
    '<label>Responsabile<input type="search" id="pl-resp" list="pl-persone" autocomplete="off" placeholder="Nome" value="'+esc(x.responsabile||"")+'"></label>'+plOpzPersone()+
    '<label>Sezione<select id="pl-sez"><option value="">—</option>'+Object.keys(PL_SEZ).map(function(k){return '<option value="'+k+'"'+(x.sezione===k?' selected':'')+'>'+PL_SEZ[k]+'</option>';}).join("")+'</select></label>'+
    '<label>Titolo<input type="text" id="pl-tit" maxlength="200" value="'+esc(x.titolo)+'"></label>'+
    '<div class="azioni"><button class="btn pieno" id="pl-salva">Salva</button><button class="btn" id="pl-chiudi">Chiudi</button></div><p class="pl-err" id="pl-err"></p></div>';
}
function plLegaEditor(x){
  if(!x||!$("#pl-ed"))return;
  $("#pl-chiudi").onclick=function(){plancia.aperto=null;plCapitoli();};
  $("#pl-salva").onclick=function(){
    var b=this,e=$("#pl-err"),args={p_capitolo:x.id},togli=[];
    var liv=$("#pl-liv"),anche=$("#pl-anche"),resp=val("pl-resp"),sez=$("#pl-sez").value,tit=val("pl-tit");
    if(liv&&liv.value!==x.livello)args.p_livello=liv.value;
    if(anche){if(anche.value&&anche.value!==(x.anche_squadra||""))args.p_anche_squadra=anche.value;if(!anche.value&&x.anche_squadra)togli.push("anche_squadra");}
    if(resp){var p=(tutteLePersone||[]).filter(function(q){return String(q.nome||"").toLowerCase()===resp.toLowerCase();})[0];
      if(!p){e.textContent="Non trovo questa persona: scegli un nome dall'elenco.";return;}
      if(p.id!==x.responsabile_id)args.p_responsabile=p.id;}
    else if(x.responsabile_id)togli.push("responsabile");
    if(sez&&sez!==(x.sezione||""))args.p_sezione=sez;if(!sez&&x.sezione)togli.push("sezione");
    if(tit&&tit!==x.titolo)args.p_titolo=tit;
    var chiamate=[];
    if(Object.keys(args).length>1)chiamate.push(args);
    togli.forEach(function(t){chiamate.push({p_capitolo:x.id,p_togli:t});});
    if(!chiamate.length){plancia.aperto=null;plCapitoli();return;}
    b.disabled=true;e.textContent="Salvo…";
    chiamate.reduce(function(pr,a){return pr.then(function(ok){if(ok!=="ok")return ok;return db.rpc("fm_capitolo_imposta",a).then(function(r){return r&&r.error?errore(r.error):r.data;});});},Promise.resolve("ok"))
      .then(function(r){if(r!=="ok"){b.disabled=false;e.textContent=r;return;}
        db.rpc("fm_capitoli_plancia").then(function(q){plancia.cap=(q&&!q.error&&q.data)||plancia.cap;plancia.aperto=null;plCapitoli();});},
        function(x2){b.disabled=false;e.textContent=errore(x2);});
  };
}
function plNuovo(){
  var box=$("#pl-nuovo");if(!box)return;
  box.innerHTML='<p class="et" style="margin-top:12px">Capitolo nuovo</p><div class="pl-ed">'+
    '<label>Titolo<input type="text" id="pn-tit" maxlength="200" placeholder="Il titolo del capitolo"></label>'+
    '<label>Sezione<select id="pn-sez"><option value="">—</option>'+Object.keys(PL_SEZ).map(function(k){return '<option value="'+k+'">'+PL_SEZ[k]+'</option>';}).join("")+'</select></label>'+
    '<label>Chi legge<select id="pn-chi">'+Object.keys(PL_LIVELLI).map(function(k){return '<option value="'+k+'">'+PL_LIVELLI[k]+'</option>';}).join("")+'<option value="team">Un team (il suo capitolo)</option></select></label>'+
    '<label id="pn-l-team">Team<select id="pn-team">'+plOpzTeam("")+'</select></label>'+
    '<label>Responsabile<input type="search" id="pn-resp" list="pl-persone" autocomplete="off" placeholder="Nome (facoltativo)"></label>'+plOpzPersone()+
    '<div class="azioni"><button class="btn pieno" id="pn-crea">Crea il capitolo</button></div><p class="pl-err" id="pn-err"></p></div>';
  var chi=$("#pn-chi"),lt=$("#pn-l-team");function agg(){lt.firstChild.textContent=chi.value==="team"?"Il team":"Lo legge anche il team";}agg();chi.onchange=agg;
  $("#pn-crea").onclick=function(){
    var b=this,e=$("#pn-err"),tit=val("pn-tit"),sez=$("#pn-sez").value||null,c=chi.value,team=$("#pn-team").value||null,resp=val("pn-resp"),pid=null;
    if(!tit){e.textContent="Scrivi il titolo.";$("#pn-tit").focus();return;}
    if(c==="team"&&!team){e.textContent="Scegli il team.";return;}
    if(resp){var p=(tutteLePersone||[]).filter(function(q){return String(q.nome||"").toLowerCase()===resp.toLowerCase();})[0];if(!p){e.textContent="Non trovo questa persona: scegli un nome dall'elenco.";return;}pid=p.id;}
    b.disabled=true;e.textContent="Creo…";
    var args=c==="team"?{p_titolo:tit,p_sezione:sez,p_livello:null,p_squadra:team,p_anche_squadra:null,p_responsabile:pid}:{p_titolo:tit,p_sezione:sez,p_livello:c,p_squadra:null,p_anche_squadra:team,p_responsabile:pid};
    db.rpc("fm_capitolo_nuovo",args).then(function(r){b.disabled=false;
      if(r&&r.error){e.textContent=errore(r.error);return;}if(r.data!=="ok"){e.textContent=r.data;return;}
      e.textContent="";db.rpc("fm_capitoli_plancia").then(function(q){plancia.cap=(q&&!q.error&&q.data)||plancia.cap;plCapitoli();plNuovo();});},
      function(x){b.disabled=false;e.textContent=errore(x);});
  };
}
function plApprovazioni(){
  var box=$("#pl-app");if(!box)return;
  db.rpc("fm_approvazioni_in_attesa").then(function(r){if(!document.body.contains(box))return;
    var l=(r&&!r.error&&r.data)||[];
    if(!l.length){box.innerHTML='<p class="nota">Niente in attesa.</p>';return;}
    box.innerHTML=l.map(function(a){return '<div class="pl-riga"><div><b>'+esc(PL_TIPI[a.tipo]||a.tipo)+'</b> · '+esc(a.titolo||"")+'<small>'+esc(a.chi||"—")+' · '+esc(plQuando(a.quando))+' · si decide '+esc(PL_DOVE[a.dove]||a.dove||"")+'</small></div>'+
      (a.tipo==="ruolo"?'<button class="mini oro" data-vai="staff">Apri</button>':a.tipo==="cervello"?'<button class="mini" data-vai="cervello">Apri</button>':'')+'</div>';}).join("");
    legaVai(box);
  },function(){box.innerHTML='<p class="nota">Non si legge adesso.</p>';});
}
function plCosti(){
  var box=$("#pl-costi");if(!box)return;
  Promise.all([
    db.from("costi").select("id,voce,importo,periodo,dal,fino_al,note").order("voce").then(function(r){return (r&&!r.error&&r.data)||[];},function(){return [];}),
    db.rpc("fm_costi_mese").then(function(r){return r&&!r.error?r.data:null;},function(){return null;})
  ]).then(function(v){if(!document.body.contains(box))return;
    var l=v[0].filter(function(x){return !x.fino_al||x.fino_al>=oggiISO();}),per={mese:"al mese",anno:"all'anno",una_volta:"una volta"};
    box.innerHTML=(l.length?l.map(function(x){return '<div class="pl-riga"><div><b>'+esc(x.voce)+'</b><small>'+esc(String(x.importo))+' € '+per[x.periodo]+(x.note?' · '+esc(x.note):'')+'</small></div><button class="mini" data-cx="'+esc(x.id)+'">Chiudi</button></div>';}).join(""):'<p class="nota">Nessun costo scritto.</p>')+
      (v[1]!=null?'<p class="pl-tot">'+esc(String(v[1]))+' € al mese</p>':'')+
      '<div class="pl-ed" style="margin-top:10px"><label>Voce<input type="text" id="pc-voce" maxlength="120" placeholder="Es. Supabase"></label>'+
      '<div class="azioni"><label style="flex:1">Importo in €<input type="number" id="pc-imp" min="0" step="0.01" inputmode="decimal"></label><label style="flex:1">Periodo<select id="pc-per"><option value="mese">al mese</option><option value="anno">all\'anno</option><option value="una_volta">una volta</option></select></label></div>'+
      '<label>Nota<input type="text" id="pc-note" maxlength="600" placeholder="Facoltativa"></label>'+
      '<div class="azioni"><button class="btn pieno" id="pc-agg">Aggiungi</button></div><p class="pl-err" id="pc-err"></p></div>';
    box.querySelectorAll("[data-cx]").forEach(function(b){b.onclick=function(){b.disabled=true;db.from("costi").update({fino_al:oggiISO()}).eq("id",b.getAttribute("data-cx")).then(function(){plCosti();},function(){b.disabled=false;});};});
    $("#pc-agg").onclick=function(){var b=this,e=$("#pc-err"),voce=val("pc-voce"),imp=parseFloat(String($("#pc-imp").value).replace(",","."));
      if(!voce){e.textContent="Scrivi la voce.";return;}if(!(imp>=0)){e.textContent="Scrivi l'importo.";return;}
      b.disabled=true;db.from("costi").insert({voce:voce,importo:imp,periodo:$("#pc-per").value,note:val("pc-note")||null,scritto_da:io.id}).then(function(r){b.disabled=false;if(r&&r.error){e.textContent=errore(r.error);return;}plCosti();},function(x){b.disabled=false;e.textContent=errore(x);});};
  });
}
document.head.insertAdjacentHTML("beforeend","<style>"+PL_CSS+"</style>");

function vStaffPagina(){
  var c=$("#corpo");
  /* 1 nov 12:19-12:29, Gab: «lo devono poter usare anche le persone che hanno un ruolo/operatore» · «sono io però a riconoscere il ruolo» (SQL 144) */
  if(!io.nucleo&&!(io.ruoli||[]).length){vista="azione";vAzione();return;}
  /* 25 ott 15:22, Gab: «Che differenza c è tra il dare ruolo qua su azione? Secondo me qua su oggi nn ci fa nulla» · «Vai» → Persone e ruoli esce da Oggi e sta qui */
  c.innerHTML='<h2 class="az-tit">Aggiungi una persona</h2>'+(io.nucleo?'<p style="text-align:center;margin:0 0 12px"><button class="btn pieno" data-vai="plancia">Admin panel · chi vede cosa</button></p><div id="st-conferma"></div>':'')+'<div id="st-box"></div><div id="o-ruoli"></div><p style="margin-top:14px"><button class="mini" data-vai="azione">‹ Azione</button></p>';
  legaVai(c);if(io.nucleo)ruoliDaConfermare($("#st-conferma"));vStaff($("#st-box"));if(io.nucleo||io.coordina)vRuoli();
}
/* 25 ott 19:09, Gab: «manca la possibilità di fare piu ruoli, sennò siamo rigidi» → i ruoli si scelgono con le spunte, anche più di uno (SQL 124) */
function ruoliSceltaHTML(id){
  return '<div class="ruoli-scelta" id="'+id+'"><span class="m">Ruoli (anche più di uno)</span>'+Object.keys(FUNZIONI).map(function(f){
    return '<fieldset style="border:0;margin:6px 0 0;padding:0"><legend class="m" style="font-weight:600;padding:0">'+esc(FUNZIONI[f])+'</legend>'+RUOLI[f].map(function(x){
      return '<label style="flex-direction:row;align-items:center;gap:8px;font-size:14px;color:inherit;margin:4px 0"><input type="checkbox" value="'+f+':'+x[0]+'" style="width:18px;height:18px;margin:0;flex:none">'+esc(x[1])+'</label>';}).join("")+'</fieldset>';}).join("")+'</div>';
}
function ruoliScelti(id){return [].slice.call(document.querySelectorAll("#"+id+" input:checked")).map(function(i){return i.value.split(":");});}
function ruoliTesto(x){
  var l=[[x.funzione,x.ruolo]].concat((x.altri_ruoli||[]).map(function(a){return [a.funzione,a.ruolo];})).filter(function(a){return a[0]&&a[1];});
  if(!l.length)return "senza ruolo";
  return (x.da_confermare?"proposto: ":"")+[[x.funzione,x.ruolo]].concat((x.altri_ruoli||[]).map(function(a){return [a.funzione,a.ruolo];})).map(function(a){return (FUNZIONI[a[0]]||a[0])+' · '+nomeRuolo(a[0],a[1]);}).join(", ");
}
/* in Oggi: «Hai aggiunto …» per le persone aggiunte oggi, e chi è entrato oggi dal link */
function vOggiStaff(){
  var box=$("#o-staff");if(!box||!io.nucleo)return;
  var da=new Date();da.setHours(0,0,0,0);var d=da.toISOString();
  db.from("inviti_staff").select("nome,funzione,ruolo,altri_ruoli,creato_il,usato_il").is("annullato_il",null).or("creato_il.gte."+d+",usato_il.gte."+d).order("creato_il",{ascending:false}).limit(50).then(function(r){
    if(vista!=="oggi"||!$("#o-staff"))return;
    var l=(r&&!r.error&&r.data)||[];
    box.innerHTML=l.length?'<p class="et" style="margin:4px 0 6px">Persone aggiunte</p><div class="card">'+l.map(function(x){
      return '<div class="persona"><div><b>Hai aggiunto '+esc(x.nome)+'</b><small>'+esc(ruoliTesto(x))+' · '+(x.usato_il?'è entrato':'link da mandare o non ancora usato')+'</small></div></div>';}).join("")+
      '<div class="fine"><button class="mini" data-vai="staff">Apri</button></div></div>':'';
    legaVai(box);
  },function(){});
}
