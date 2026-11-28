/* Pagine fisse delle voci: Scarica il PDF, Stampa, Copia il link, Condividi, Cerca.
   I dati della pagina sono nello script #fm-dati, scritto da .github/controlli/voci.py */
(function(){
"use strict";
var D={};try{D=JSON.parse(document.getElementById("fm-dati").textContent);}catch(e){}
var avviso=document.querySelector(".avviso");
function dici(t){if(avviso){avviso.textContent=t;clearTimeout(dici.t);dici.t=setTimeout(function(){avviso.textContent="";},3000);}}
function nomeFile(t){return (String(t||"felicitasmundi").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,60)||"felicitasmundi")+".pdf";}
function caricaJsPDF(){if(window.jspdf)return Promise.resolve(window.jspdf);
  return new Promise(function(ok,no){var s=document.createElement("script");s.src="/communitas-aeterna-prova/comune/jspdf.umd.min.js?v=251";
    s.onload=function(){window.jspdf?ok(window.jspdf):no();};s.onerror=no;document.head.appendChild(s);});}
function immagine(url){return new Promise(function(ok){var im=new Image();im.crossOrigin="anonymous";
  im.onload=function(){try{var c=document.createElement("canvas"),k=Math.min(1,1400/Math.max(im.naturalWidth,im.naturalHeight));
    c.width=Math.round(im.naturalWidth*k);c.height=Math.round(im.naturalHeight*k);c.getContext("2d").drawImage(im,0,0,c.width,c.height);
    ok({d:c.toDataURL("image/jpeg",.85),w:c.width,h:c.height});}catch(e){ok(null);}};
  im.onerror=function(){ok(null);};im.src=url;});}
function pdf(){var doc=D.doc||[];return caricaJsPDF().then(function(J){
  return Promise.all(doc.map(function(d){return Promise.all((d.foto||[]).map(immagine));})).then(function(imgs){
    var P=new J.jsPDF({unit:"mm",format:"a5"}),W=148,H=210,M=16,L=W-2*M,y=M,prima=true;
    function nuova(){if(!prima)P.addPage();prima=false;y=M;}
    function spazio(h){if(y+h>H-M-6){P.addPage();y=M;}}
    function righe(t,stile,size,lh,col){P.setFont("times",stile);P.setFontSize(size);P.setTextColor.apply(P,col||[20,20,20]);
      P.splitTextToSize(String(t),L).forEach(function(r){spazio(lh);P.text(r,M,y+lh*.75);y+=lh;});}
    if(doc.length>1){nuova();y=60;righe(D.titolo,"bold",22,10);y+=6;righe("Indice","italic",13,7,[120,95,40]);y+=2;
      doc.forEach(function(d,i){righe((i+1)+".  "+d.titolo,"normal",12,6.2);});}
    doc.forEach(function(d,i){nuova();
      if(d.via)righe(d.via,"italic",10,5,[120,95,40]);y+=2;
      righe(d.titolo,"bold",18,8.5);y+=2;
      if(d.firma){righe(d.firma,"italic",11,5.6,[120,95,40]);}y+=3;
      (d.par||[]).forEach(function(x){righe(x,"normal",11.5,5.6);y+=2.4;});
      (imgs[i]||[]).forEach(function(im){if(!im)return;var w=L,h=im.h*w/im.w;if(h>120){h=120;w=im.w*h/im.h;}y+=3;spazio(h);P.addImage(im.d,"JPEG",M+(L-w)/2,y,w,h);y+=h+3;});
      righe(D.url,"italic",8,4,[140,140,140]);});
    var n=P.getNumberOfPages();for(var k=1;k<=n;k++){P.setPage(k);P.setFont("times","normal");P.setFontSize(9);P.setTextColor(120,120,120);P.text(String(k),W/2,H-8,{align:"center"});}
    P.save(nomeFile(D.titolo));});});}
function copia(){var u=D.url||location.href;
  (navigator.clipboard&&navigator.clipboard.writeText?navigator.clipboard.writeText(u):Promise.reject()).then(function(){dici("Link copiato.");},function(){
    var t=document.createElement("textarea");t.value=u;document.body.appendChild(t);t.select();try{document.execCommand("copy");dici("Link copiato.");}catch(e){dici(u);}t.remove();});}
function condividi(){var d={title:D.titolo,url:D.url||location.href};
  if(navigator.share){navigator.share(d).catch(function(){});return;}
  location.href="https://wa.me/?text="+encodeURIComponent(d.title+" "+d.url);}
document.addEventListener("click",function(e){var b=e.target.closest("[data-fai]");if(!b)return;var f=b.getAttribute("data-fai");
  if(f==="copia")return copia();if(f==="condividi")return condividi();if(f==="stampa")return window.print();
  if(f==="pdf"){var l=b.textContent;b.disabled=true;b.textContent="Un momento…";
    pdf().then(function(){b.disabled=false;b.textContent=l;},function(){b.disabled=false;b.textContent=l;dici("Non riesco adesso. Riprova.");});}});
/* Cerca, nell'elenco delle voci */
var q=document.getElementById("fm-cerca");
if(q&&D.cerca){var out=document.getElementById("fm-trovati"),voci=document.getElementById("fm-voci");
  function norm(s){return String(s||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"");}
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];});}
  var tutti=D.cerca.map(function(x){return {x:x,t:norm(x.t),c:norm(x.t+" "+x.v+" "+x.x)};});
  function cerca(){var p=norm(q.value).trim().split(/\s+/).filter(Boolean);
    if(!p.length){out.hidden=true;voci.hidden=false;return;}
    var r=tutti.filter(function(o){return p.every(function(w){return o.c.indexOf(w)>=0;});})
      .sort(function(a,b){return (p.every(function(w){return b.t.indexOf(w)>=0;})?1:0)-(p.every(function(w){return a.t.indexOf(w)>=0;})?1:0);});
    out.innerHTML=r.length?r.map(function(o){return '<li><a href="'+esc(o.x.u)+'">'+esc(o.x.t)+'</a><small>'+esc(o.x.v)+'</small></li>';}).join(""):'<li class="nulla">Nessuna pagina con queste parole.</li>';
    out.hidden=false;voci.hidden=true;}
  q.addEventListener("input",cerca);
  var par=new URLSearchParams(location.search).get("q");if(par){q.value=par;cerca();}}
})();
