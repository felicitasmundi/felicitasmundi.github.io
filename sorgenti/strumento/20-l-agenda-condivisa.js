/* ═══ L'AGENDA CONDIVISA · SQL 190 ═══
   7 nov 07:45, Gab: «Ok su agenda e a questa visione di svoluppo sviluppo / Procedi in questo»: un solo elenco di eventi,
   «prossimi 7 giorni» in Oggi con filtro per team, «Fissa un incontro» nella chat del team e in Espandi. Senza l'SQL 190 non compare niente. */
var AG_FONTE={incontro:["incontro","#D4AF6A"],diretta:["diretta","#E07A55"],lezione:["lezione","#B08AE0"],evento:["evento","#8DBF5E"],scadenza:["scadenza","#6FA8D6"]};
var ag={filtro:"",dati:null};
function agLeggi(){return db.rpc("fm_agenda",{p_giorni:7}).then(function(r){return r&&!r.error?(r.data||[]):null;},function(){return null;});}
function agTeam(){return team.lista?Promise.resolve(team.lista):leggiTeam().then(function(l){return l||[];});}
function agGiorno(g){var o=new Date();o.setHours(12,0,0,0);var d=new Date(g+"T12:00"),n=Math.round((d-o)/864e5);
  return n===0?"Oggi":n===1?"Domani":d.toLocaleDateString("it-IT",{weekday:"long",day:"numeric",month:"long"});}
function agNomeTeam(id){var t=(team.lista||[]).filter(function(x){return x.team_id===id;})[0];return t?t.nome:"";}
function agRiga(x){
  var f=AG_FONTE[x.fonte]||[x.fonte,"#D4AF6A"],tn=x.cerchio_id?agNomeTeam(x.cerchio_id):"";
  var link=x.fonte==="diretta"?"diretta-bozza.html?puntata="+encodeURIComponent(x.id):(x.link&&/^https:/.test(x.link)?x.link:"");
  var annullo=x.fonte==="incontro"&&(x.mio||io.nucleo);
  return '<div class="ag-r" style="--tc:'+f[1]+'"><span class="ag-ora">'+(x.inizio_il?esc(hhmm(x.inizio_il)):'entro')+'</span>'+
    '<span class="ag-mezzo"><b>'+esc(x.titolo||"")+'</b><small>'+esc([f[0],tn,x.luogo].filter(Boolean).join(" · "))+'</small>'+
    (x.dettaglio&&x.fonte!=="diretta"?'<small>'+esc(x.dettaglio)+'</small>':'')+
    (link?'<a href="'+esc(link)+'"'+(/^https:/.test(link)?' target="_blank" rel="noopener noreferrer"':'')+'>'+(x.fonte==="diretta"?'entra ›':'apri il link ›')+'</a>':'')+'</span>'+
    (annullo?'<button class="mini" data-ag-annulla="'+esc(x.id)+'">Annulla</button>':'')+'</div>';
}
function agElenco(l){
  var h="",g=null;
  l.forEach(function(x){if(x.giorno!==g){g=x.giorno;h+='<p class="ag-g">'+esc(agGiorno(g))+'</p>';}h+=agRiga(x);});
  return h||'<p class="ag-vuoto">Niente in agenda nei prossimi 7 giorni.</p>';
}
function agLegaAnnulla(box,dopo){
  box.querySelectorAll("[data-ag-annulla]").forEach(function(b){b.onclick=function(){
    if(!confirm("Annullare questo incontro? Nella chat del team arriva l'avviso."))return;b.disabled=true;
    db.rpc("fm_agenda_annulla",{p_incontro:b.getAttribute("data-ag-annulla")}).then(function(r){if(r&&!r.error&&r.data!=="ok")alert(r.data);if(r&&r.error)alert(errore(r.error));dopo();},function(e){alert(errore(e));dopo();});};});
}
function agendaOggi(){
  if(!io.id||!$("#o-agenda"))return;
  Promise.all([agLeggi(),agTeam()]).then(function(v){
    var box=$("#o-agenda");if(!box||(vista!=="oggi"&&vista!=="obiettivi"))return;
    if(v[0]===null){box.innerHTML="";return;}
    ag.dati=v[0];var tl=v[1]||[];
    if(ag.filtro&&!tl.some(function(t){return t.team_id===ag.filtro;}))ag.filtro="";
    box.innerHTML='<p class="et" style="margin:4px 0 6px">Prossimi 7 giorni</p>'+
      (tl.length>1?'<div class="ag-filtri">'+[["","Tutti"]].concat(tl.map(function(t){return [t.team_id,t.nome];})).map(function(t){
        return '<button type="button" data-ag-f="'+esc(t[0])+'" aria-pressed="'+(ag.filtro===t[0])+'">'+esc(t[1])+'</button>';}).join("")+'</div>':'')+
      '<div id="ag-lista"></div><div class="fine" style="margin:0 0 12px">'+'<button class="mini oro" id="ag-fissa">Fissa un incontro</button>'+'<button class="mini" id="ag-cal">Aggiungi al calendario</button></div>';
    function disegna(){var e=$("#ag-lista");if(!e)return;
      e.innerHTML=agElenco(ag.filtro?ag.dati.filter(function(x){return x.cerchio_id===ag.filtro;}):ag.dati);agLegaAnnulla(e,agendaOggi);}
    disegna();
    box.querySelectorAll("[data-ag-f]").forEach(function(b){b.onclick=function(){ag.filtro=b.getAttribute("data-ag-f");
      box.querySelectorAll("[data-ag-f]").forEach(function(x){x.setAttribute("aria-pressed",String(x===b));});disegna();};});
    var bf=$("#ag-fissa");if(bf)bf.onclick=function(){agFissa(ag.filtro||null,agendaOggi);};
    var bc=$("#ag-cal");if(bc)bc.onclick=agCalendario;
  });
}
/* 7 nov 09:52, Gab: «in che modo posso vederlo nel calendario del mio telefono?» (modello del 7/11, punto 5: link personale, solo in lettura). SQL 195 + funzione agenda-calendario. */
function agCalendario(){
  var w=document.createElement("div");w.className="ag-foglio-w";document.body.appendChild(w);
  function chiudi(){w.remove();}
  w.innerHTML='<div class="tc-velo" data-ag-chiudi></div><div class="tc-foglio" role="dialog" aria-modal="true" aria-labelledby="ag-ch"><div class="tc-presa"></div>'+
    '<h2 id="ag-ch">L\'agenda nel calendario del telefono</h2><p>Il link è solo tuo: il calendario del telefono lo rilegge da solo e mostra gli incontri dei tuoi team, le lezioni, le dirette e gli eventi. Non va condiviso.</p>'+
    '<div id="ag-cal-box"><p class="tc-nota">Un momento…</p></div></div>';
  w.querySelector("[data-ag-chiudi]").onclick=chiudi;
  function mostra(cod){
    var box=w.querySelector("#ag-cal-box");if(!box)return;
    if(!cod){box.innerHTML='<p class="tc-nota">Il link non si apre adesso. Si può riprovare.</p>';return;}
    var u=URL_SB+"/functions/v1/agenda-calendario?c="+cod,wc=u.replace(/^https:/,"webcal:");
    box.innerHTML='<label for="ag-cal-u">Il tuo link</label><input type="text" id="ag-cal-u" readonly>'+
      '<button type="button" class="tc-btn" id="ag-cal-copia">Copia il link</button>'+
      '<a class="tc-btn" style="display:flex;align-items:center;justify-content:center;text-decoration:none;background:transparent;color:#D4AF6A;border:1px solid #D4AF6A" href="'+esc(wc)+'">Apri nel calendario (iPhone)</a>'+
      '<label>Su Android</label><p>Apri Google Calendar dal browser, su calendar.google.com. A sinistra: Altri calendari › + › Da URL, incolla il link e conferma. Gli incontri compaiono anche nel calendario del telefono; quelli nuovi possono arrivare con qualche ora di ritardo, perché Google rilegge il link ogni tanto.</p>'+
      '<label>Se il link finisce in mani sbagliate</label><button type="button" class="tc-btn" id="ag-cal-nuovo" style="background:transparent;color:#F5F0E6;border:1px solid rgba(212,175,106,.5)">Cambia il link</button>'+
      '<p class="tc-nota" id="ag-cal-esito" aria-live="polite"></p>';
    box.querySelector("#ag-cal-u").value=u;
    box.querySelector("#ag-cal-copia").onclick=function(){var b=this;
      (navigator.clipboard?navigator.clipboard.writeText(u):Promise.reject()).then(function(){b.textContent="Copiato";},function(){var i=box.querySelector("#ag-cal-u");i.focus();i.select();$("#ag-cal-esito").textContent="Tieni premuto sul link e scegli Copia.";});};
    box.querySelector("#ag-cal-nuovo").onclick=function(){
      if(!confirm("Cambiare il link? Il vecchio smette di funzionare e va aggiunto di nuovo nel calendario."))return;this.disabled=true;
      db.rpc("fm_agenda_link_nuovo").then(function(r){mostra(r&&!r.error?r.data:null);},function(){mostra(null);});};
  }
  db.rpc("fm_agenda_link").then(function(r){mostra(r&&!r.error?r.data:null);},function(){mostra(null);});
}
function agendaTeam(id){
  if(team.tipo==="chat"||!$("#tc-agenda"))return;
  agLeggi().then(function(l){
    var e=$("#tc-agenda");if(!e||vista!=="team"||team.id!==id)return;
    if(l===null){e.innerHTML="";return;}
    var m=l.filter(function(x){return x.fonte==="incontro"&&x.cerchio_id===id;})[0];
    e.innerHTML='<div class="ag-team"><span>'+(m?'<b>Prossimo incontro</b> · '+esc(m.titolo)+' · '+esc(agGiorno(m.giorno).toLowerCase())+' alle '+esc(hhmm(m.inizio_il))+(m.luogo?' · '+esc(m.luogo):''):'Nessun incontro fissato nei prossimi 7 giorni.')+'</span>'+
      '<button class="mini oro" id="tc-ag-fissa">Fissa un incontro</button></div>';
    $("#tc-ag-fissa").onclick=function(){agFissa(id,function(){agendaTeam(id);ricaricaTeam(true);});};
  });
}
/* 25 nov 22:23, Gab: «io ho bisogno di segnare un agenda, che mi manda la mail e che possa decidere quale team la riceva, segnando un tasto».
   22:28 sull'anteprima: «ok pubblica». Tasti «Solo io» o un team (uno solo); la mail un'ora prima arriva sempre a chi fissa (SQL 321). */
function agFissa(cerchio,dopo){
  agTeam().then(function(tl){
    tl=tl||[];var scelto=cerchio&&tl.some(function(t){return t.team_id===cerchio;})?cerchio:"";
    var w=document.createElement("div");w.className="ag-foglio-w";document.body.appendChild(w);
    function chiudi(){w.remove();}
    var dom=new Date(Date.now()+864e5),dd=dom.getFullYear()+"-"+String(dom.getMonth()+1).padStart(2,"0")+"-"+String(dom.getDate()).padStart(2,"0");
    w.innerHTML='<div class="tc-velo" data-ag-chiudi></div><div class="tc-foglio" role="dialog" aria-modal="true" aria-labelledby="ag-h"><div class="tc-presa"></div>'+
      '<h2 id="ag-h">Fissa un incontro</h2><p>A te arriva la mail un\'ora prima.</p>'+
      '<label id="ag-chi">Chi lo riceve</label><div class="ag-filtri ag-chi" role="radiogroup" aria-labelledby="ag-chi" style="flex-wrap:wrap">'+
      [["","Solo io"]].concat(tl.map(function(t){return [t.team_id,t.nome];})).map(function(t){
        return '<button type="button" role="radio" data-ag-chi="'+esc(t[0])+'" aria-pressed="'+(scelto===t[0])+'" aria-checked="'+(scelto===t[0])+'">'+esc(t[1])+'</button>';}).join("")+'</div>'+
      '<label for="ag-t">Di cosa si parla</label><input type="text" id="ag-t" maxlength="120" autocomplete="off">'+
      '<div class="ag-due"><div><label for="ag-g">Giorno</label><input type="date" id="ag-g" value="'+dd+'"></div><div><label for="ag-o">Ora</label><input type="time" id="ag-o"></div></div>'+
      '<label for="ag-d">Quanto dura</label><select id="ag-d"><option value="30">mezz\'ora</option><option value="60" selected>un\'ora</option><option value="90">un\'ora e mezza</option><option value="120">due ore</option><option value="240">mezza giornata</option></select>'+
      '<label for="ag-l">Dove</label><input type="text" id="ag-l" maxlength="200" placeholder="Posto o stanza, niente indirizzi di casa" autocomplete="off">'+
      '<label for="ag-k">Link, se è online</label><input type="text" id="ag-k" maxlength="300" placeholder="https://" autocomplete="off" inputmode="url">'+
      '<button type="button" class="tc-btn" id="ag-ok">Fissa l\'incontro</button>'+
      '<p class="tc-nota" id="ag-esito" aria-live="polite"></p></div>';
    w.querySelector("[data-ag-chiudi]").onclick=chiudi;
    w.querySelectorAll("[data-ag-chi]").forEach(function(b){b.onclick=function(){scelto=b.getAttribute("data-ag-chi");
      w.querySelectorAll("[data-ag-chi]").forEach(function(x){var on=String(x===b);x.setAttribute("aria-pressed",on);x.setAttribute("aria-checked",on);});};});
    var ok=w.querySelector("#ag-ok");if(!ok)return;
    ok.onclick=function(){
      var g=$("#ag-g").value,o=$("#ag-o").value,es=$("#ag-esito");
      if(!$("#ag-t").value.trim()){es.textContent="Scrivi di cosa si parla.";return;}
      if(!g||!o){es.textContent="Scegli il giorno e l'ora.";return;}
      var t=new Date(g+"T"+o);if(isNaN(t)){es.textContent="Il giorno o l'ora non si leggono.";return;}
      ok.disabled=true;es.textContent="";
      db.rpc("fm_agenda_fissa",{p_cerchio:scelto||null,p_titolo:$("#ag-t").value,p_inizio:t.toISOString(),p_durata:+$("#ag-d").value,
        p_luogo:$("#ag-l").value||null,p_link:$("#ag-k").value||null}).then(function(r){ok.disabled=false;
        if(r&&!r.error&&r.data==="ok"){chiudi();if(dopo)dopo();return;}
        es.textContent=(r&&r.data)||errore(r&&r.error);},function(e){ok.disabled=false;es.textContent=errore(e);});
    };
  });
}
/* 18 ott 23:05, Gab: «alla fine le task sono legate al sistema logistico» (thread «Gestionale della logistica», SQL 74).
   I compiti del mio ruolo logistico, in Oggi. Finché il 74 non c'è, o se non ho compiti, non compare niente. */
function logisticaOggi(){
  db.rpc("fm_logistica_oggi").then(function(r){
    var e=$("#o-logistica");if(!e||vista!=="oggi")return;
    var l=(r&&!r.error&&r.data)||[];if(!l.length){e.innerHTML="";return;}
    e.innerHTML='<p class="et" style="margin-top:6px">Compiti della logistica</p>'+l.map(function(c){
      var q=c.merce?(c.quantita!=null?c.quantita+" "+(c.unita||"")+" · ":"")+c.merce:"";
      return '<div class="card"><span class="t">'+esc(c.titolo)+'</span><span class="m" style="display:block;margin-top:4px">'+esc(c.punto||"")+(q?" · "+esc(q):"")+
        (c.entro_il?" · entro il "+esc(new Date(c.entro_il).toLocaleDateString("it-IT",{day:"numeric",month:"long"})):"")+(c.per_me?" · per te":"")+'</span>'+
        (c.nota?'<span class="m" style="display:block">'+esc(c.nota)+'</span>':'')+
        '<div class="fine">'+(c.preso_da_me?'<span class="pill s-in_avanzamento">Preso da te</span>':'<button class="mini oro" data-cprendo="'+esc(c.id)+'">Lo prendo</button>')+
        '<button class="mini" data-cfatto="'+esc(c.id)+'"'+(c.merce?' data-q="'+esc(c.quantita==null?"":c.quantita)+'"':'')+'>Fatto</button></div></div>';}).join("");
    function dopo(x){if(x&&x.error)alert(errore(x.error));logisticaOggi();}
    e.querySelectorAll("[data-cprendo]").forEach(function(b){b.onclick=function(){b.disabled=true;db.rpc("fm_compito_prendo",{p_compito:b.getAttribute("data-cprendo")}).then(dopo,dopo);};});
    e.querySelectorAll("[data-cfatto]").forEach(function(b){b.onclick=function(){var a={p_compito:b.getAttribute("data-cfatto")};
      if(b.hasAttribute("data-q")){var v=prompt("Quanta merce, davvero?",b.getAttribute("data-q"));if(v===null)return;v=parseFloat(String(v).replace(",","."));if(v>0)a.p_quantita=v;}
      b.disabled=true;db.rpc("fm_compito_fatto",a).then(dopo,dopo);};});
  },function(){});
}

