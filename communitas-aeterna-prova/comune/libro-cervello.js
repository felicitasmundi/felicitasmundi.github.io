/* Il Cervello come libro antico · indice a glossario.
   8/11/2026, Gab: «meglio un indice stile libro antico, che apre le voci come se fossero un vecchio glossario, che mostra le pagine che possono includere anche testi e media»
   · «il cervello è il contesto da cui partono i contenuti che poi vanno all emporio o giornale o ovunque sia settato» · «blu cosmo ccon oro».
   Uso: libroCervello(contenitore, fonte)
     fonte.indice()        → Promise di righe fm_cervello_indice (id, titolo, sezione, sezione_nome, sezione_ordine, padre_id, profondita, ordine, elemento, descrizione, card, ultima)
     fonte.carte(capId)    → Promise di righe fm_capitolo_indice (id, titolo, scritta_il, modificata_il, chi)
     fonte.pagina(cardId)  → Promise di {testo, media:[{tipo:'foto'|'video'|'audio', url, didascalia}], uscite:[{dove, url}]}
     fonte.vai(url)        → facoltativo, apre un'uscita (Giornale, Emporio…) */
(function(){
var COL={terra:"#C9A15A",acqua:"#6FA8D6",fuoco:"#E07A55",aria:"#8DBF5E",etere:"#B08AE0"};
/* Gab 8/11 21:30: «da definire nella parte iniziale che il nostro lavoro è prevalentemente quello di guidare lo sviluppo del cervello digitale evoluto, realizzato con l'intento in comune di partecipare a FelicitasMundi» (sue parole, nomi con le maiuscole delle sue regole) */
/* 8/11 22:01 Gab sceglie la frase 1 tra le sue, «ma non tuo cervello» (tolto «tuo») */
var APERTURA='<p class="lc-apre">Il cervello digitale è connesso alla realtà di FelicitasMundi. È un cervello digitale comunitario, funziona come internet, ma dentro il mondo di FelicitasMundi. Il cervello è connesso alle realtà coinvolte e le informazioni si parlano tra loro.</p>';
/* 8/11 21:52-21:57 Gab: «manca un tasto per indicare che l indice sarà visibile pubblicamente, nel corso dell autunno.. per ora sono visibili solo alcune pagine» · «lo si fa vedere solo con accesso» */
var AVVISO='<p class="lc-avviso">L\'indice sarà visibile pubblicamente nel corso dell\'autunno. Per ora sono visibili solo alcune pagine.</p>';
var ROMANI=["","I","II","III","IV","V","VI","VII","VIII","IX","X"];
function esc(t){return String(t==null?"":t).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];});}
function nuovo(r){return r.ultima&&(Date.now()-new Date(r.ultima).getTime())<7*864e5;}
function yt(u){var m=/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/.exec(u||"");return m?m[1]:null;}

window.libroCervello=function(box,fonte){
  box.classList.add("lc");
  box.innerHTML='<div class="lc-indice"><p class="lc-vuoto">Un momento…</p></div><div class="lc-pagina" hidden></div>';
  var ind=box.querySelector(".lc-indice"),pag=box.querySelector(".lc-pagina");
  var righe=[],figli={},cacheCarte={},pienoDi={};

  fonte.indice().then(function(r){righe=(r||[]).slice().sort(function(a,b){return a.ordine-b.ordine;});
    righe.forEach(function(x){var p=x.padre_id||"_"+x.sezione;(figli[p]=figli[p]||[]).push(x);});pienoDi={};righe.forEach(function(x){if(+x.card>0){var r=x;while(r){pienoDi[r.id]=1;var pid=r.padre_id;r=pid?righe.filter(function(y){return y.id===pid;})[0]:null;}}});disegnaIndice();},
    function(){ind.innerHTML='<p class="lc-vuoto">L\'indice non si legge adesso.</p>';});

  function disegnaIndice(){
    var sez=[],vis={};righe.forEach(function(r){if(!vis[r.sezione]){vis[r.sezione]=1;sez.push(r);}});
    sez.sort(function(a,b){return a.sezione_ordine-b.sezione_ordine;});
    ind.innerHTML='<header class="lc-front"><p class="lc-orn">❦</p><h1>Cervello</h1>'+APERTURA+(fonte.avviso?AVVISO:'')+'<p class="lc-sotto">Indice</p><div class="lc-filetto"></div></header>'+
      sez.map(function(s){
        return '<section class="lc-parte"><h2><span class="lc-num">'+ROMANI[s.sezione_ordine]+'</span>'+esc(s.sezione_nome)+'</h2>'+
          (figli["_"+s.sezione]||[]).filter(function(v){return !v.padre_id;}).map(voceH).join("")+(fonte.extra?(fonte.extra(s)||""):"")+'</section>';
      }).join("")+'<p class="lc-orn lc-fine">❦</p>';
    legaVoci(ind);
  }
  /* 8/11 Gab: «rendi riconoscibili le pagine con contenuti all interno»: voce piena = ha card (o le ha una sua sottovoce); vuota = sbiadita, senza freccia, non si apre */
  function voceH(v){
    var el=COL[v.elemento],pieno=!!pienoDi[v.id];
    return '<div class="lc-voce'+(v.profondita?' lc-sotto-v':'')+(pieno?' lc-piena':' lc-vuota')+'" data-voce="'+esc(v.id)+'">'+
      '<button class="lc-riga" aria-expanded="false"'+(pieno?'':' disabled')+'><span class="lc-tit">'+(el?'<i class="lc-el" style="background:'+el+'"></i>':'')+esc(v.titolo)+
      (nuovo(v)?'<i class="lc-nuovo" title="novità"></i>':'')+'</span><span class="lc-punti"></span><span class="lc-freccia">'+(pieno?'›':'')+'</span></button>'+
      '<div class="lc-dentro" hidden></div></div>';
  }
  function legaVoci(c){
    c.querySelectorAll(".lc-voce").forEach(function(d){if(d._legata)return;d._legata=1;
      var b=d.querySelector(".lc-riga"),dentro=d.querySelector(".lc-dentro");
      if(b.disabled)return;b.onclick=function(){var aperta=b.getAttribute("aria-expanded")==="true";
        b.setAttribute("aria-expanded",aperta?"false":"true");dentro.hidden=aperta;
        if(!aperta&&!dentro._pieno){dentro._pieno=1;riempi(d.getAttribute("data-voce"),dentro);}};});
  }
  function riempi(id,dentro){
    var v=righe.filter(function(r){return r.id===id;})[0]||{},sub=figli[id]||[];
    dentro.innerHTML=(v.descrizione?'<p class="lc-desc">'+esc(v.descrizione)+'</p>':'')+sub.map(voceH).join("")+'<div class="lc-carte"><p class="lc-vuoto">Un momento…</p></div>';
    legaVoci(dentro);
    var box=dentro.querySelector(".lc-carte");
    carte(id).then(function(l){
      if(!l.length){box.innerHTML=sub.length?'':'';return;}
      box.innerHTML='<ol class="lc-gloss">'+l.map(function(k,i){
        var t=k.titolo||"",prima=t.charAt(0);
        return '<li><button data-carta="'+esc(k.id)+'" data-cap="'+esc(id)+'" data-i="'+i+'"><b class="lc-ini">'+esc(prima)+'</b>'+esc(t.slice(1))+'</button></li>';}).join("")+'</ol>';
      box.querySelectorAll("[data-carta]").forEach(function(b){b.onclick=function(){apriPagina(id,+b.getAttribute("data-i"));};});
    },function(){box.innerHTML='<p class="lc-vuoto">Le pagine non si leggono adesso.</p>';});
  }
  function carte(id){if(!cacheCarte[id])cacheCarte[id]=fonte.carte(id).then(function(l){return l||[];});return cacheCarte[id];}
  function via(id){var out=[],r=righe.filter(function(x){return x.id===id;})[0];if(!r)return out;out.unshift(r.titolo);
    while(r&&r.padre_id){r=righe.filter(function(x){return x.id===r.padre_id;})[0];if(r)out.unshift(r.titolo);}
    var s=righe.filter(function(x){return x.id===id;})[0];if(s)out.unshift(s.sezione_nome);return out;}

  var sy=0;
  function apriPagina(capId,i){
    carte(capId).then(function(l){var k=l[i];if(!k)return;
      sy=sy||window.scrollY;ind.hidden=true;pag.hidden=false;window.scrollTo(0,0);
      pag.innerHTML='<p class="lc-vuoto">Un momento…</p>';
      fonte.pagina(k.id).then(function(p){p=p||{};
        var righeT=String(p.testo||"").split("\n"),tit=righeT.shift()||k.titolo,corpo=righeT.join("\n").trim();
        var par=corpo.split(/\n+/).filter(Boolean);
        pag.innerHTML='<button class="lc-torna">‹ Indice</button>'+
          '<p class="lc-via">'+esc(via(capId).join(" › "))+'</p>'+
          '<h1 class="lc-ptit">'+esc(tit)+'</h1><div class="lc-filetto"></div>'+
          '<div class="lc-testo">'+par.map(function(x,j){return '<p'+(j===0?' class="lc-capo"':'')+'>'+esc(x)+'</p>';}).join("")+'</div>'+
          ((p.media||[]).map(mediaH).join(""))+
          ((p.uscite||[]).length?'<div class="lc-uscite"><p class="lc-et">Dove è uscita</p>'+p.uscite.map(function(u,j){return '<button class="lc-usc" data-u="'+j+'">'+esc(u.dove)+' ›</button>';}).join("")+'</div>':'')+
          '<nav class="lc-sfoglia">'+(i>0?'<button data-s="'+(i-1)+'">‹ pagina prima</button>':'<span></span>')+
          '<span class="lc-orn">❦</span>'+(i<l.length-1?'<button data-s="'+(i+1)+'">pagina dopo ›</button>':'<span></span>')+'</nav>';
        pag.querySelector(".lc-torna").onclick=chiudiPagina;
        pag.querySelectorAll("[data-s]").forEach(function(b){b.onclick=function(){apriPagina(capId,+b.getAttribute("data-s"));};});
        pag.querySelectorAll("[data-u]").forEach(function(b){b.onclick=function(){var u=p.uscite[+b.getAttribute("data-u")];if(fonte.vai)fonte.vai(u.url);else location.href=u.url;};});
      },function(){pag.innerHTML='<button class="lc-torna">‹ Indice</button><p class="lc-vuoto">La pagina non si legge adesso.</p>';pag.querySelector(".lc-torna").onclick=chiudiPagina;});
    });
  }
  function mediaH(m){
    var d=m.didascalia?'<figcaption>'+esc(m.didascalia)+'</figcaption>':'';
    if(m.tipo==="foto")return '<figure class="lc-media">'+(m.url?'<img src="'+esc(m.url)+'" alt="'+esc(m.didascalia||"")+'" loading="lazy">':'<div class="lc-segna">[ foto ]</div>')+d+'</figure>';
    if(m.tipo==="video"){var id=yt(m.url);return '<figure class="lc-media">'+(id?'<div class="lc-video"><iframe src="https://www.youtube-nocookie.com/embed/'+id+'" allowfullscreen loading="lazy" title="video"></iframe></div>':'<div class="lc-segna">[ video ]</div>')+d+'</figure>';}
    if(m.tipo==="audio")return '<figure class="lc-media">'+(m.url?'<audio controls preload="none" src="'+esc(m.url)+'"></audio>':'<div class="lc-segna lc-segna-b">[ audio ]</div>')+d+'</figure>';
    return '';
  }
  function chiudiPagina(){pag.hidden=true;ind.hidden=false;window.scrollTo(0,sy);sy=0;}
  return {apriPagina:apriPagina,apriVoce:function(id){var d=box.querySelector('[data-voce="'+id+'"] > .lc-riga');if(d&&d.getAttribute("aria-expanded")!=="true")d.click();}};
};
})();
