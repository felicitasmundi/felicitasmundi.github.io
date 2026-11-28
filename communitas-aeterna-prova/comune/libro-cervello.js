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

var fissiP=null;
window.fmIndirizziFissi=function(){if(!fissiP)fissiP=fetch("/voci/elenco.json",{cache:"no-cache"}).then(function(r){return r.ok?r.json():{};}).catch(function(){return {};});return fissiP;};
var indirizziFissi=window.fmIndirizziFissi;
window.libroCervello=function(box,fonte){
  box.classList.add("lc");
  box.innerHTML='<div class="lc-indice"><p class="lc-vuoto">Un momento…</p></div><div class="lc-pagina" hidden></div>';
  var ind=box.querySelector(".lc-indice"),pag=box.querySelector(".lc-pagina");
  var righe=[],figli={},cacheCarte={},pienoDi={};
  /* 28/11/2026, Gab: «ogni contenuto bisogna renderlo anche scaricabile.. stampare e scegliere piu voci da mettere in un unico contenuto da stampare o scaricare» */
  var racc=[];
  box.insertAdjacentHTML("beforeend",'<div class="lc-racc" hidden><span class="lc-racc-n"></span><button type="button" class="mini oro" data-racc="pdf">Scarica il PDF</button><button type="button" class="mini" data-racc="stampa">Stampa</button><button type="button" class="mini" data-racc="svuota">Svuota</button></div>');
  var barra=box.querySelector(".lc-racc");
  barra.querySelectorAll("[data-racc]").forEach(function(b){b.onclick=function(){var m=b.getAttribute("data-racc");
    if(m==="svuota"){racc=[];box.querySelectorAll("[data-sp]").forEach(function(x){x.checked=false;});segnaRacc();return;}
    esporta(racc.slice(),m,b);};});
  function segnaRacc(){barra.hidden=!racc.length;barra.querySelector(".lc-racc-n").textContent="Raccolta · "+racc.length+(racc.length===1?" pagina":" pagine");
    box.querySelectorAll("[data-sp]").forEach(function(x){var i=-1;racc.forEach(function(r,j){if(r.id===x.getAttribute("data-sp"))i=j;});x.checked=i>=0;
      var n=x.parentNode.querySelector(".lc-sp-n");if(n)n.textContent=i>=0?String(i+1):"";});}

  fonte.indice().then(function(r){righe=(r||[]).slice().sort(function(a,b){return a.ordine-b.ordine;});
    righe.forEach(function(x){var p=x.padre_id||"_"+x.sezione;(figli[p]=figli[p]||[]).push(x);});pienoDi={};righe.forEach(function(x){if(+x.card>0||coll(x).length){var r=x;while(r){pienoDi[r.id]=1;var pid=r.padre_id;r=pid?righe.filter(function(y){return y.id===pid;})[0]:null;}}});disegnaIndice();},
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
    dentro.innerHTML=(v.descrizione?'<p class="lc-desc">'+esc(v.descrizione)+'</p>':'')+collH(v)+sub.map(voceH).join("")+'<div class="lc-carte"><p class="lc-vuoto">Un momento…</p></div>';
    legaVoci(dentro);
    dentro.querySelectorAll("[data-link]").forEach(function(a){a.onclick=function(ev){var k=coll(v)[+a.getAttribute("data-link")];if(!k||!fonte.apri)return;ev.preventDefault();fonte.apri(k);};});
    var box=dentro.querySelector(".lc-carte");
    carte(id).then(function(l){
      if(!l.length){box.innerHTML=sub.length?'':'';return;}
      box.innerHTML='<ol class="lc-gloss">'+l.map(function(k,i){
        var t=k.titolo||"",prima=t.charAt(0);
        return '<li><label class="lc-sp" title="Metti nella raccolta"><input type="checkbox" data-sp="'+esc(k.id)+'" data-i="'+i+'" aria-label="Metti nella raccolta: '+esc(t)+'"><span class="lc-sp-n"></span></label><button data-carta="'+esc(k.id)+'" data-cap="'+esc(id)+'" data-i="'+i+'"><b class="lc-ini">'+esc(prima)+'</b>'+esc(t.slice(1))+'</button></li>';}).join("")+'</ol>';
      box.querySelectorAll("[data-carta]").forEach(function(b){b.onclick=function(){apriPagina(id,+b.getAttribute("data-i"));};});
      box.querySelectorAll("[data-sp]").forEach(function(x){x.onchange=function(){var cid=x.getAttribute("data-sp");
        racc=racc.filter(function(r){return r.id!==cid;});if(x.checked){var k=l[+x.getAttribute("data-i")];racc.push({id:cid,capId:id,titolo:k.titolo});}segnaRacc();};});
      segnaRacc();
    },function(){box.innerHTML='<p class="lc-vuoto">Le pagine non si leggono adesso.</p>';});
  }
  /* 9/11 Gab: «qualunque link faccio creare … vanno sempre messi nell indice… riconoscendone la voce adeguata» → fonte.collegamenti(voce) dà le pagine della voce */
  function coll(v){return (fonte.collegamenti&&fonte.collegamenti(v))||[];}
  function collH(v){return coll(v).map(function(k,i){return '<div class="lc-mappa"><a class="lc-riga" data-link="'+i+'" href="'+esc(k.url)+'" style="color:inherit;text-decoration:none"><span class="lc-tit">'+esc(k.titolo)+'</span><span class="lc-punti"></span><span class="lc-freccia">›</span></a></div>';}).join("");}
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
        /* 28/11: la riga «data · Autore: …» sotto il titolo, piccola, senza capolettera */
        var firma=par.length&&/·\s*Autore:/.test(par[0])&&par[0].length<120?par.shift():"";
        pag.innerHTML='<button class="lc-torna">‹ Indice</button>'+
          '<p class="lc-via">'+esc(via(capId).join(" › "))+'</p>'+
          '<h1 class="lc-ptit">'+esc(tit)+'</h1>'+(firma?'<p class="lc-firma">'+esc(firma)+'</p>':'')+'<div class="lc-filetto"></div>'+
          '<div class="lc-testo">'+par.map(function(x,j){return '<p'+(j===0?' class="lc-capo"':'')+'>'+esc(x)+'</p>';}).join("")+'</div>'+
          ((p.media||[]).map(mediaH).join(""))+
          '<div class="lc-azioni"><button type="button" class="mini oro" data-esp="pdf">Scarica il PDF</button><button type="button" class="mini" data-esp="stampa">Stampa</button></div>'+
          (fonte.versioni?'<div class="lc-ver"></div>':'')+
          ((p.uscite||[]).length?'<div class="lc-uscite"><p class="lc-et">Dove è uscita</p>'+p.uscite.map(function(u,j){return '<button class="lc-usc" data-u="'+j+'">'+esc(u.dove)+' ›</button>';}).join("")+'</div>':'')+
          '<nav class="lc-sfoglia">'+(i>0?'<button data-s="'+(i-1)+'">‹ pagina prima</button>':'<span></span>')+
          '<span class="lc-orn">❦</span>'+(i<l.length-1?'<button data-s="'+(i+1)+'">pagina dopo ›</button>':'<span></span>')+'</nav>';
        pag.querySelector(".lc-torna").onclick=chiudiPagina;
        pag.querySelectorAll("[data-esp]").forEach(function(b){b.onclick=function(){esporta([{id:k.id,capId:capId,titolo:k.titolo,p:p}],b.getAttribute("data-esp"),b);};});
        /* 28/11 Gab: ogni pagina visibile a tutti ha il suo indirizzo fisso (/voci/…), come un'enciclopedia */
        indirizziFissi().then(function(m){var u=m.righe&&m.righe[k.id],az=pag.querySelector(".lc-azioni");if(!u||!az||!document.body.contains(az))return;
          var b=document.createElement("button");b.type="button";b.className="mini";b.textContent="Copia il link";
          b.onclick=function(){copiaLink("https://app.felicitasmundi.com"+u,b);};az.appendChild(b);});
        /* 9/11 Gab «si»: il tasto «Versioni» anche nelle pagine del libro */
        if(fonte.versioni)fonte.versioni(pag.querySelector(".lc-ver"),k.id,function(){delete cacheCarte[capId];apriPagina(capId,i);});
        pag.querySelectorAll("[data-s]").forEach(function(b){b.onclick=function(){apriPagina(capId,+b.getAttribute("data-s"));};});
        pag.querySelectorAll("[data-u]").forEach(function(b){b.onclick=function(){var u=p.uscite[+b.getAttribute("data-u")];if(fonte.vai)fonte.vai(u.url);else location.href=u.url;};});
      },function(){pag.innerHTML='<button class="lc-torna">‹ Indice</button><p class="lc-vuoto">La pagina non si legge adesso.</p>';pag.querySelector(".lc-torna").onclick=chiudiPagina;});
    });
  }
  function mediaH(m){
    var d=m.didascalia?'<figcaption>'+esc(m.didascalia)+'</figcaption>':'';
    if(m.tipo==="foto")return '<figure class="lc-media">'+(m.url?'<img src="'+esc(m.url)+'" alt="'+esc(m.didascalia||"")+'" loading="lazy">':'<div class="lc-segna">[ foto ]</div>')+d+'</figure>';
    if(m.tipo==="video"){var id=yt(m.url);return '<figure class="lc-media">'+(id?'<div class="lc-video"><iframe src="https://www.youtube-nocookie.com/embed/'+id+'" allowfullscreen loading="lazy" title="video"></iframe></div>':'<div class="lc-segna">[ video ]</div>')+d+'</figure>';}
    if(m.tipo==="pdf")return '<p class="lc-media"><a class="mini oro" href="'+esc(m.url)+'" target="_blank" rel="noopener">Apri il PDF</a></p>'; /* 25/11: SINTOS col PDF anche nel libro */
    if(m.tipo==="audio")return '<figure class="lc-media">'+(m.url?'<audio controls preload="none" src="'+esc(m.url)+'"></audio>':'<div class="lc-segna lc-segna-b">[ audio ]</div>')+d+'</figure>';
    return '';
  }
  /* Scarica il PDF (A5, pronto anche per la tipografia) e Stampa, per una pagina o per la raccolta */
  var cachePag={};
  function leggiPag(it){if(it.p)return Promise.resolve(it.p);if(!cachePag[it.id])cachePag[it.id]=fonte.pagina(it.id);return cachePag[it.id];}
  function pezzi(it,p){var r=String((p&&p.testo)||"").split("\n"),tit=(r.shift()||it.titolo||"").trim();
    return {via:via(it.capId).join(" › "),titolo:tit,par:r.join("\n").split(/\n+/).map(function(x){return x.trim();}).filter(Boolean),
      foto:((p&&p.media)||[]).filter(function(m){return m.tipo==="foto"&&m.url;}).map(function(m){return m.url;})};}
  function nomeFile(t){return (String(t||"cervello").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,60)||"cervello")+".pdf";}
  function esporta(items,modo,btn){if(!items.length)return;var lab=btn?btn.textContent:"";if(btn){btn.disabled=true;btn.textContent="Un momento…";}
    function fine(err){if(btn){btn.disabled=false;btn.textContent=lab;}if(err&&btn)btn.insertAdjacentHTML("afterend",'<span class="lc-esp-e">Non riesco adesso. Riprova.</span>');}
    Promise.all(items.map(function(it){return leggiPag(it).then(function(p){return pezzi(it,p);});})).then(function(doc){
      return (modo==="stampa"?stampa(doc):pdf(doc)).then(function(){fine();});}).catch(function(){fine(1);});}
  function titoloRacc(doc){var v={};doc.forEach(function(d){v[d.via]=1;});var k=Object.keys(v);return k.length===1?k[0].split(" › ").pop():"Raccolta";}
  function caricaJsPDF(){if(window.jspdf)return Promise.resolve(window.jspdf);
    return new Promise(function(ok,no){var s=document.createElement("script");s.src="comune/jspdf.umd.min.js?v=251";s.onload=function(){window.jspdf?ok(window.jspdf):no();};s.onerror=no;document.head.appendChild(s);});}
  function immagine(url){return new Promise(function(ok){var im=new Image();im.onload=function(){try{var c=document.createElement("canvas"),k=Math.min(1,1400/Math.max(im.naturalWidth,im.naturalHeight));
      c.width=Math.round(im.naturalWidth*k);c.height=Math.round(im.naturalHeight*k);c.getContext("2d").drawImage(im,0,0,c.width,c.height);ok({d:c.toDataURL("image/jpeg",.85),w:c.width,h:c.height});}catch(e){ok(null);}};
    im.onerror=function(){ok(null);};im.src=url;});}
  function pdf(doc){return caricaJsPDF().then(function(J){
    return Promise.all(doc.map(function(d){return Promise.all(d.foto.map(immagine));})).then(function(imgs){
      var P=new J.jsPDF({unit:"mm",format:"a5"}),W=148,H=210,M=16,L=W-2*M,y=M,prima=true;
      function nuova(){if(!prima)P.addPage();prima=false;y=M;}
      function spazio(h){if(y+h>H-M-6){P.addPage();y=M;}}
      function righe(t,font,stile,size,lh,col){P.setFont(font,stile);P.setFontSize(size);P.setTextColor.apply(P,col||[20,20,20]);
        P.splitTextToSize(t,L).forEach(function(r){spazio(lh);P.text(r,M,y+lh*.75);y+=lh;});}
      if(doc.length>1){nuova();y=60;righe(titoloRacc(doc),"times","bold",22,10);y+=6;righe("Indice","times","italic",13,7,[120,95,40]);y+=2;
        doc.forEach(function(d,i){righe((i+1)+".  "+d.titolo,"times","normal",12,6.2);});}
      doc.forEach(function(d,i){nuova();
        if(d.via)righe(d.via,"times","italic",10,5,[120,95,40]);y+=2;
        righe(d.titolo,"times","bold",18,8.5);y+=4;
        d.par.forEach(function(x){righe(x,"times","normal",11.5,5.6);y+=2.4;});
        (imgs[i]||[]).forEach(function(im){if(!im)return;var w=L,h=im.h*w/im.w;if(h>120){h=120;w=im.w*h/im.h;}y+=3;spazio(h);P.addImage(im.d,"JPEG",M+(L-w)/2,y,w,h);y+=h+3;});});
      var n=P.getNumberOfPages();for(var k=1;k<=n;k++){P.setPage(k);P.setFont("times","normal");P.setFontSize(9);P.setTextColor(120,120,120);P.text(String(k),W/2,H-8,{align:"center"});}
      P.save(nomeFile(doc.length>1?titoloRacc(doc):doc[0].titolo));});});}
  function stampa(doc){return new Promise(function(ok){
    var old=document.getElementById("lc-stampa");if(old)old.remove();
    var s=document.createElement("div");s.id="lc-stampa";
    s.innerHTML=(doc.length>1?'<section class="lcs-cop"><h1>'+esc(titoloRacc(doc))+'</h1><p class="lcs-et">Indice</p><ol>'+doc.map(function(d){return '<li>'+esc(d.titolo)+'</li>';}).join("")+'</ol></section>':'')+
      doc.map(function(d){return '<article class="lcs-pag">'+(d.via?'<p class="lcs-via">'+esc(d.via)+'</p>':'')+'<h1>'+esc(d.titolo)+'</h1>'+d.par.map(function(x){return '<p>'+esc(x)+'</p>';}).join("")+
        d.foto.map(function(u){return '<img src="'+esc(u)+'" alt="">';}).join("")+'</article>';}).join("");
    document.body.appendChild(s);document.body.classList.add("lc-stampa-su");
    var imgs=[].slice.call(s.querySelectorAll("img"));
    Promise.all(imgs.map(function(im){return im.complete?1:new Promise(function(r){im.onload=im.onerror=r;});})).then(function(){
      var via=function(){document.body.classList.remove("lc-stampa-su");s.remove();window.removeEventListener("afterprint",via);};
      window.addEventListener("afterprint",via);setTimeout(function(){try{window.print();}catch(e){}ok();setTimeout(via,60000);},50);});});}
  function copiaLink(u,b){var ok=function(){var l=b.textContent;b.textContent="Link copiato";setTimeout(function(){b.textContent=l;},2000);};
    if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(u).then(ok,function(){prompt("Link",u);});}else{prompt("Link",u);}}
  function chiudiPagina(){pag.hidden=true;ind.hidden=false;window.scrollTo(0,sy);sy=0;}
  return {apriPagina:apriPagina,apriVoce:function(id){var d=box.querySelector('[data-voce="'+id+'"] > .lc-riga');if(d&&d.getAttribute("aria-expanded")!=="true")d.click();}};
};
})();
