/* PERSONE E RUOLI: solo per chi coordina il villaggio (SQL 69) */
var tutteLePersone=null;
function vRuoli(){
  var box=$("#o-ruoli");if(!box)return;
  Promise.all([
    db.from("ruoli").select("id,persona_id,funzione,ruolo,dal").is("fino_al",null).order("dal",{ascending:false}).limit(300).then(function(r){return r&&!r.error?(r.data||[]):null;},function(){return null;}),
    tutteLePersone?Promise.resolve(tutteLePersone):db.from("persone_pubbliche").select("id,nome").order("nome").limit(1000).then(function(r){tutteLePersone=(r&&!r.error&&r.data)||[];tutteLePersone.forEach(function(p){nomi[p.id]=p.nome||"";});return tutteLePersone;},function(){return [];})
  ]).then(function(v){
    var rr=v[0];if(rr===null){box.innerHTML="";return;}
    return leggiNomi(rr.map(function(x){return x.persona_id;})).then(function(){
      box.innerHTML='<p class="et" style="margin-top:10px">Persone e ruoli · per chi coordina</p><div class="card modulo">'+
        (rr.length?rr.map(function(x){return '<div class="persona"><div><b>'+esc(nomi[x.persona_id]||"—")+'</b><small>'+esc(FUNZIONI[x.funzione]||x.funzione)+' · '+esc(nomeRuolo(x.funzione,x.ruolo))+'</small></div><button class="mini" data-chiudi-r="'+esc(x.id)+'">Chiudi</button></div>';}).join(""):'<p class="nota">Ancora nessuno ha un ruolo.</p>')+
        '<label>Dai un ruolo a<input type="search" id="r-cerca" list="r-persone" autocomplete="off" placeholder="Nome"></label><datalist id="r-persone">'+(tutteLePersone||[]).map(function(p){return '<option value="'+esc(p.nome)+'">';}).join("")+'</datalist>'+
        ruoliSceltaHTML("r-rr")+
        '<div class="azioni"><button class="btn pieno" id="r-dai">Dai i ruoli</button></div><div class="toast" id="r-ok" hidden></div></div>';
      regRuoliExtra(box);
      box.querySelectorAll("[data-chiudi-r]").forEach(function(b){b.onclick=function(){b.disabled=true;db.from("ruoli").update({fino_al:oggiISO()}).eq("id",b.getAttribute("data-chiudi-r")).then(function(r){if(r.error){mostra("#r-ok",errore(r.error),true);b.disabled=false;return;}vRuoli();});};});
      $("#r-dai").onclick=function(){
        var n=val("r-cerca").toLowerCase(),p=(tutteLePersone||[]).filter(function(x){return String(x.nome||"").toLowerCase()===n;});
        if(!n)return mostra("#r-ok","Scrivi il nome.",true);
        if(p.length!==1)return mostra("#r-ok",p.length?"Ci sono più persone con questo nome: scrivilo intero.":"Nessuno con questo nome tra chi è entrato.",true);
        var sc=ruoliScelti("r-rr");if(!sc.length)return mostra("#r-ok","Scegli almeno un ruolo.",true);
        var ha=rr.filter(function(x){return x.persona_id===p[0].id;}).map(function(x){return x.ruolo;});
        var nuovi=sc.filter(function(a){return ha.indexOf(a[1])<0;});
        if(!nuovi.length)return mostra("#r-ok","Questa persona ha già questi ruoli.",true);
        var b=$("#r-dai");b.disabled=true;
        db.from("ruoli").insert(nuovi.map(function(a){return {persona_id:p[0].id,funzione:a[0],ruolo:a[1],dato_da:io.id};})).then(function(r){
          b.disabled=false;
          if(r.error)return mostra("#r-ok",/duplicate|unique/i.test(r.error.message||"")?"Questa persona ha già uno di questi ruoli.":errore(r.error),true);
          vRuoli();
        });
      };
    });
  });
}

