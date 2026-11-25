/* ═══ LO SPAZIO DEL GRUPPO · SQL 92 ═══
   20 ott 12:27, Gab: «Per me un gruppo può avere un area diretta dove può usare la chat / Quindi quella diventa la situazione di utilizzo dello strumento»
   12:31: «nulla toglie al registro di essere proprio il contesto diretta e chat» · 14:34: il nome «La facciamo scegliere al gruppo in base alla tematica».
   23:45: «si» a costruirlo adesso. La chat resta chat: un messaggio diventa riga del registro solo quando qualcuno lo segna.
   La diretta resta del thread delle dirette (diretta-bozza.html, comune/fm-diretta.js): qui c'è solo il passaggio verso la diretta in onda.
   Senza l'SQL 92 lo spazio non compare. */
var spazio={sub:null,timer:null,id:null};
function spazioFerma(){
  try{if(spazio.sub&&db.removeChannel)db.removeChannel(spazio.sub);}catch(e){}
  if(spazio.timer)clearInterval(spazio.timer);
  spazio.sub=null;spazio.timer=null;spazio.id=null;
}
function vSpazio(box,id,x){
  if(!box)return;
  spazioFerma();
  Promise.all([
    db.from("gruppo_messaggi").select("id,testo,scritto_da,scritto_il,registro_id").eq("cerchio_id",id).order("scritto_il",{ascending:false}).limit(60).then(function(r){return r&&!r.error?(r.data||[]):null;},function(){return null;}),
    db.from("spazi_gruppo").select("nome").eq("cerchio_id",id).maybeSingle().then(function(r){return (r&&!r.error&&r.data&&r.data.nome)||"";},function(){return "";}),
    dirette(),
    db.from("registro").select("id,voce,obiettivo_id,stato,vicinato_id,squadra_id,azienda_id").or("vicinato_id.eq."+id+",squadra_id.eq."+id+",azienda_id.eq."+id).limit(400).then(function(r){return r&&!r.error?(r.data||[]):[];},function(){return [];}),
    leggiObiettivi()
  ]).then(function(v){
    if(!box.isConnected||cerchio!==id)return;
    var msg=v[0];if(msg===null){box.innerHTML="";return;}
    var nome=v[1],dir=v[2]||[],righe=v[3],guida=x.guido||io.nucleo||io.coordina;
    var voci={};righe.forEach(function(g){if(g.voce)voci[g.voce]=(voci[g.voce]||0)+1;});
    var obs={};righe.forEach(function(g){if(g.obiettivo_id&&g.stato){var o=obs[g.obiettivo_id]=obs[g.obiettivo_id]||{c:0,f:0};o.c++;if(g.stato==="fatto")o.f++;}});
    var tit={};(cache.obiettivi||[]).forEach(function(o){tit[o.id]=o.titolo||o.contenuto;});
    box.innerHTML='<div class="sp-capo"><p class="et">Lo spazio del gruppo</p><h3>'+esc(nome||x.nome)+'</h3>'+
        (guida?'<details class="rg-altro"><summary>'+(nome?"Cambia il nome dello spazio":"Il nome lo sceglie il gruppo")+'</summary><div class="azioni" style="margin-top:6px"><input type="text" id="sp-nome" maxlength="80" value="'+esc(nome)+'" style="flex:1;min-width:0"><button class="mini oro" id="sp-nome-ok">Salva</button></div></details>':'')+'</div>'+
      (dir.length?dir.map(function(d){return '<a class="sp-diretta" href="diretta-bozza.html?puntata='+encodeURIComponent(d.id)+'"><span class="sp-punto" aria-hidden="true"></span><span><b>In diretta</b> · '+esc(d.titolo||"")+'</span><span>entra ›</span></a>';}).join(""):'')+
      '<div class="sp-due"><div class="card sp-chat"><p class="et">Chat del gruppo</p><div class="sp-msg" id="sp-msg"></div>'+
        '<div class="sp-scrivi"><textarea id="sp-testo" maxlength="2000" aria-label="Scrivi nella chat del gruppo"></textarea><button class="btn pieno" id="sp-invia">Invia</button></div><div class="toast" id="sp-ok" hidden></div></div>'+
      '<div class="sp-lato"><div class="card"><p class="et">Argomenti trattati</p>'+(Object.keys(voci).length?'<div class="rg-meta">'+Object.keys(voci).sort(function(a,b){return voci[b]-voci[a];}).map(function(k){return '<span class="chip">'+esc(k)+' · '+voci[k]+'</span>';}).join("")+'</div>':'<span class="m">Le voci delle righe del registro di questo gruppo.</span>')+'</div>'+
        '<div class="card"><p class="et">Gli obiettivi del gruppo</p>'+(Object.keys(obs).length?Object.keys(obs).map(function(k){var o=obs[k];return '<div class="sp-ob"><span class="t">'+esc(tit[k]||"Obiettivo")+'</span><span class="m">'+o.f+' di '+o.c+' compiti fatti</span><div class="barra-ob"><i style="width:'+Math.round(100*o.f/Math.max(1,o.c))+'%"></i></div></div>';}).join(""):'<span class="m">Gli obiettivi a cui sono legati i compiti di questo gruppo.</span>')+'</div></div></div>';
    spazio.id=id;
    disegnaMsg(msg.reverse());
    $("#sp-invia").onclick=function(){var t=val("sp-testo");if(!t)return;var b=this;b.disabled=true;
      db.from("gruppo_messaggi").insert({cerchio_id:id,testo:t,scritto_da:io.id}).then(function(r){b.disabled=false;
        if(r&&r.error)return mostra("#sp-ok",errore(r.error),true);$("#sp-testo").value="";mostra("#sp-ok","");ricarica();},function(e){b.disabled=false;mostra("#sp-ok",errore(e),true);});};
    var nb=$("#sp-nome-ok");if(nb)nb.onclick=function(){var n=val("sp-nome");if(!n)return;nb.disabled=true;
      db.from("spazi_gruppo").upsert({cerchio_id:id,nome:n,scritto_da:io.id,scritto_il:new Date().toISOString()}).then(function(r){nb.disabled=false;if(r&&r.error){alert(errore(r.error));return;}vSpazio(box,id,x);},function(){nb.disabled=false;});};
    function ricarica(){
      if(spazio.id!==id||cerchio!==id||vista!=="cerchio"){spazioFerma();return;}
      db.from("gruppo_messaggi").select("id,testo,scritto_da,scritto_il,registro_id").eq("cerchio_id",id).order("scritto_il",{ascending:false}).limit(60).then(function(r){if(r&&!r.error)disegnaMsg((r.data||[]).reverse());},function(){});
    }
    function disegnaMsg(l){
      leggiNomi(l.map(function(m){return m.scritto_da;})).then(function(){
        var e=$("#sp-msg");if(!e)return;var giu=e.scrollHeight-e.scrollTop-e.clientHeight<40;
        e.innerHTML=l.length?l.map(function(m){return '<div class="sp-m'+(m.scritto_da===io.id?" mio":"")+'"><span class="m">'+esc(nomi[m.scritto_da]||"")+' · '+esc(hhmm(m.scritto_il))+'</span>'+testoLink(m.testo,"t","span")+
          (m.registro_id?'<span class="m sp-segnato">→ nel registro</span>':'<select class="sp-segna" data-segna="'+esc(m.id)+'" aria-label="Segna nel registro"><option value="">segna nel registro…</option><option value="da_fare">da fare</option><option value="decisione">decisione</option><option value="chiamata">chiamata</option><option value="incontro">incontro</option><option value="idea">idea</option></select>')+'</div>';}).join(""):'<p class="nota" style="text-align:center;padding:10px 0">Ancora nessun messaggio.</p>';
        if(giu||!e.dataset.visto){e.scrollTop=e.scrollHeight;e.dataset.visto="1";}
        e.querySelectorAll("[data-segna]").forEach(function(s){s.onchange=function(){if(!s.value)return;s.disabled=true;
          db.rpc("fm_messaggio_segna",{p_messaggio:s.getAttribute("data-segna"),p_tipo:s.value}).then(function(r){
            if(r&&r.error){alert(errore(r.error));s.disabled=false;return;}if(r.data!=="ok"){alert(r.data);s.disabled=false;return;}
            cache.obiettivi=null;ricarica();vBanco($("#ce-banco"),id);vVociRegistro($("#ce-voci"),id);},function(){s.disabled=false;});};});
      });
    }
    /* la chat si aggiorna da sola: realtime se c'è, altrimenti ogni 20 secondi */
    try{if(db.channel){spazio.sub=db.channel("chat-"+id).on("postgres_changes",{event:"INSERT",schema:"public",table:"gruppo_messaggi",filter:"cerchio_id=eq."+id},ricarica).subscribe();}}catch(e){}
    spazio.timer=setInterval(ricarica,20000);
  });
}

