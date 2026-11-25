/* ═══ STANZE DELL'EVENTO in testa al team · SQL 225 (fm_evento_pagina, fm_passo_lascio, fm_evento_archivia) · thread «Mettere ordine a ruoli e team», 9/11/2026 ═══
   Gab 9/11 11:13 «creiamo un contesto visivo che faccia vedere le cose da fare per ogni stanza e permett di prendere gli obiettivi e segnare l avanzamento»
   · 11:16 «questo poi sarà la pagina concreta in primo piano nel team, prima della chat» · 11:20 «dopo il 21 quella parte della planimetria
   non ci sarà piu e sarà archiviata» · 11:21 «si». Ogni fase è un obiettivo del team (stanza + evento); le attività sono i suoi passi.
   La planimetria è la stessa della pagina del Festival. */
var ST_PIANTE=(function(){
  var R=function(a,b,c,d){return [[a,b],[c,b],[c,d],[a,d]];};
  var P1=function(x,y){return [170.6+0.62*x,652.5+0.62*y];};
  var R1=function(a,b,c,d){return [P1(a,b),P1(c,b),P1(c,d),P1(a,d)];};
  return {"festival-21-11":[
   {titolo:"Piano terra e cortile",
    neutre:[R(380,1100,850,1150),R(380,1150,545,1222),R(710,1105,765,1165),R(765,1105,850,1170),R(245,1100,335,1280),R(245,1280,340,1365),R(335,1150,380,1365),R(245,885,400,1095),R(130,720,275,880),R(130,885,245,1020)],
    aree:[{nome:"Ingresso",col:"#C99A5B",pol:R(550,1150,715,1365)},
          {nome:"Scambio semi tra vicinati",col:"#E0498A",pol:R(380,1235,545,1365)},
          {nome:"Emporio",col:"#8ED06B",pol:R(720,1170,915,1365)},
          {nome:"Sala Agorà",col:"#F39A3A",pol:R(385,940,845,1095)},
          {nome:"Cortile",col:"#F2C94C",aperto:1,pol:[[140,285],[560,285],[790,920],[400,920],[400,885],[275,885],[275,715],[140,715]]}],
    ingresso:[632,1395]},
   {titolo:"Primo piano",
    neutre:[R1(345,700,640,975),R1(345,795,465,890),R1(465,795,585,890),R1(120,890,320,975),R1(810,775,1025,870)],
    aree:[{nome:"Sala mensa \"Krishna Prema\"",col:"#2BB3C9",pol:R1(120,375,380,890)},
          {nome:"Area trattamenti",col:"#B48CFF",pol:R1(380,495,570,700)},
          {nome:"Artigiani ed esposizioni artistiche",col:"#FF8A3D",pol:R1(570,495,840,870)},
          {nome:"Area Educazione",col:"#6FD3A0",pol:R1(840,485,1025,775)}]},
   {titolo:"Sala polifunzionale",
    neutre:[R(140,195,240,265),R(240,180,280,265)],
    aree:[{nome:"Sala polifunzionale",col:"#F5D27A",num:[300,150],pol:[[140,95],[385,95],[385,265],[280,265],[280,195],[140,195]]}]}
  ]};
})();
var ST_CSS='#tc-stanze:empty{display:none}.st-via{display:none!important}'+
'.st-schede{display:flex;gap:8px;margin:12px 0 4px}.st-schede button{flex:1;font:600 18px "DM Sans",system-ui,sans-serif;color:#F5F0E6;background:transparent;border:1px solid rgba(212,175,106,.45);border-radius:22px;padding:9px 12px;cursor:pointer}'+
'.st-schede button[aria-pressed="true"]{background:#D4AF6A;border-color:#D4AF6A;color:#0a1430}'+
'.st-pag{display:flex;flex-direction:column;gap:16px;margin-top:10px;color:#F5F0E6}'+
'.st-ev{background:#1a2148;border:1px solid rgba(212,175,106,.3);border-radius:20px;padding:16px;display:flex;flex-direction:column;gap:8px}'+
'.st-ev h2{margin:0;font-size:24px;color:#F5F0E6}.st-ev .d{color:#c9cbe3;font-size:17px}'+
'.st-barra{height:10px;border-radius:6px;background:rgba(245,240,230,.12);overflow:hidden}.st-barra span{display:block;height:100%;background:#D4AF6A;border-radius:6px}'+
'.st-n{font-size:17px;color:#c9cbe3;font-variant-numeric:tabular-nums}'+
'.st-piani{display:flex;gap:8px;flex-wrap:wrap}.st-piani button{font:500 17px "DM Sans",system-ui,sans-serif;color:#F5F0E6;background:transparent;border:1px solid rgba(212,175,106,.3);border-radius:22px;padding:8px 14px;cursor:pointer}'+
'.st-piani button[aria-pressed="true"]{background:#D4AF6A;color:#0a1430;border-color:#D4AF6A;font-weight:700}'+
'.st-mappa{background:#1a2148;border:1px solid rgba(212,175,106,.3);border-radius:20px;padding:12px}.st-mappa svg{width:100%;height:auto;display:block;max-height:52svh}.st-mappa .ar{cursor:pointer}'+
'.st-elenco{list-style:none;margin:10px 0 0;padding:0;display:flex;flex-direction:column;gap:6px}'+
'.st-elenco button{width:100%;display:grid;grid-template-columns:38px 1fr auto;gap:12px;align-items:center;text-align:left;font:inherit;color:#F5F0E6;background:transparent;border:1px solid transparent;border-radius:14px;padding:7px;cursor:pointer}'+
'.st-elenco button[aria-pressed="true"]{border-color:#D4AF6A;background:rgba(212,175,106,.08)}'+
'.st-num{width:38px;height:38px;border-radius:50%;display:grid;place-items:center;font-weight:700;font-size:19px;color:#0a1430;background:var(--c)}'+
'.st-elenco b{display:block;font-size:19px;line-height:1.2}.st-elenco small{display:block;font-size:16px;color:#c9cbe3}.st-conta{font-size:16px;color:#c9cbe3;white-space:nowrap;font-variant-numeric:tabular-nums}'+
'.st-testa{display:flex;align-items:center;gap:12px}.st-testa h2{margin:0;font-size:24px;color:#D4AF6A}'+
'.st-fase{background:#1a2148;border:1px solid rgba(212,175,106,.3);border-radius:20px;padding:16px;display:flex;flex-direction:column;gap:10px}'+
'.st-ft{display:flex;justify-content:space-between;align-items:flex-start;gap:10px}.st-ft h3{margin:0;font-size:21px;line-height:1.2}'+
'.st-st{font-size:15px;font-weight:700;border-radius:12px;padding:3px 10px;white-space:nowrap;color:#0a1430;background:#c9cbe3}.st-st.corso{background:#6FA8D6}.st-st.fatto{background:#8ED06B}.st-st.attesa{background:#E0A955}'+
'.st-att{list-style:none;margin:2px 0 0;padding:0;display:flex;flex-direction:column;gap:10px}'+
'.st-att li{display:grid;grid-template-columns:30px 1fr;gap:10px;align-items:start;border-top:1px solid rgba(212,175,106,.3);padding-top:10px}'+
'.st-pal{width:30px;height:30px;border-radius:50%;border:2px solid #c9cbe3;display:grid;place-items:center;font-size:15px;font-weight:700;color:#c9cbe3}'+
'.st-att li.corso .st-pal{border-color:#6FA8D6;color:#6FA8D6}.st-att li.attesa .st-pal{border-color:#E0A955;color:#E0A955}.st-att li.fatto .st-pal{border-color:#8ED06B;background:#8ED06B;color:#0a1430}'+
'.st-att li.fatto .tx{text-decoration:line-through;text-decoration-color:rgba(245,240,230,.4);color:#c9cbe3}'+
'.st-att .tx{font-size:18px;overflow-wrap:anywhere}.st-att .chi{display:block;font-size:16px;color:#c9cbe3}.st-dett{margin:6px 0 2px;padding-left:20px;font-size:17px;line-height:1.45}.st-att .st-dett li{display:list-item;border:0;padding:2px 0;list-style:disc}.st-nx{display:block;font-size:16px;color:#c9cbe3;line-height:1.4;margin-top:2px}.st-nf{margin:0 0 4px;font-size:17px;color:#c9cbe3;line-height:1.45}.st-sp{border:1px solid rgba(212,175,106,.35);border-radius:14px;padding:10px 14px;margin:0 0 12px}.st-sp summary{cursor:pointer;color:#D4AF6A;font-weight:700}.st-sp p{margin:8px 0 0;font-size:17px;color:#c9cbe3;line-height:1.45}.st-el{margin:6px 0 4px;padding-left:22px;font-size:18px;line-height:1.5}'+
'.st-tasti{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}.st-tasti button{font:500 16px "DM Sans",system-ui,sans-serif;border-radius:20px;padding:7px 14px;cursor:pointer;border:1px solid #D4AF6A;background:transparent;color:#F5F0E6}'+
'.st-tasti button.pieno{background:#D4AF6A;color:#0a1430;font-weight:700}'+
'.st-apri{align-self:flex-start;font:500 16px "DM Sans",system-ui,sans-serif;color:#D4AF6A;background:none;border:0;padding:4px 0;cursor:pointer}'+
'.tp-pres{background:#1a2148;border:1px solid rgba(212,175,106,.35);border-radius:16px;padding:16px 18px;margin:0 0 12px;display:flex;flex-direction:column;gap:10px}'+
'.tp-pres p{margin:0;font:400 19px/1.45 "Cormorant Garamond",Georgia,serif;color:#F5F0E6;white-space:pre-line}'+
'.tp-pres p.tp-frase{font-size:21px;color:#D4AF6A}'+
'.tp-esp{border-top:1px solid rgba(212,175,106,.3);padding-top:10px}.tp-esp summary{cursor:pointer;font:600 15px "DM Sans",system-ui,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#D4AF6A;padding:4px 0}'+
'.tp-esp p{margin-top:10px}'+
'.dt-pa{margin:0 0 6px;font:600 15px "DM Sans",system-ui,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#D4AF6A}'+
'.st-fs{cursor:pointer}.st-indietro{font:600 17px "DM Sans",system-ui,sans-serif;color:#D4AF6A;background:none;border:0;padding:6px 0 10px;cursor:pointer}'+
'.st-nota{font-size:16px;color:#c9cbe3;margin:0}.st-err{font-size:16px;color:#E07A5F;margin:0;min-height:1em}';
document.head.insertAdjacentHTML("beforeend","<style>"+ST_CSS+"</style>");

function stanzeTeam(id){
  if(team.tipo!=="team")return;
  db.rpc("fm_evento_pagina",{p_team:id}).then(function(r){
    if(vista!=="team"||team.id!==id)return;
    var ev=(r&&!r.error&&r.data)||null,box=$("#tc-stanze");if(!box)return;
    if(!ev||!ST_PIANTE[ev.planimetria]){var era=team.stanzeSu;team.evento=null;team.stanzeSu=false;box.innerHTML="";var sf0=$("#tc-stfiss");if(sf0)sf0.innerHTML="";
      var cp=$("#tc-chatparte");if(cp)cp.classList.remove("st-via");if(era)window.scrollTo(0,document.body.scrollHeight);return;}
    if(!team.evento||team.evento.id!==ev.id){team.stanzeSu=false;team.stPiano=null;team.stScelta=null;stInAlto();}
    team.evento=ev;disegnaStanze(id);
  },function(){});
}
function stInAlto(){if(!team.inAlto){team.inAlto=true;window.scrollTo(0,0);}}
function presTeam(id){
  var box=$("#tc-pres");if(!box||!db)return;
  db.rpc("fm_team_presentazione",{p_team:id}).then(function(r){
    var box=$("#tc-pres");if(!box||vista!=="team"||team.id!==id)return;
    var l=(r&&!r.error&&r.data)||[];
    box.innerHTML=l.length?'<section class="tp-pres"><p class="tp-frase">'+esc(l[0])+'</p>'+(l.length>2?'<details class="tp-esp"><summary>'+esc(l[1])+'</summary>'+l.slice(2).map(function(t){var k=String(t).split("\n");return '<p>'+(k.length>1?'<b>'+esc(k[0])+'</b>\n'+esc(k.slice(1).join("\n")):esc(t))+'</p>';}).join("")+'</details>':'')+'</section>':'';
    if(l.length)stInAlto();
  },function(){});
}
function stFasi(ev,nome){return (ev.fasi||[]).filter(function(f){return f.stanza===nome;});}
function stConta(fasi){var n=0,d=0,c=0;fasi.forEach(function(f){(f.passi||[]).forEach(function(x){n++;if(x.stato==="fatto")d++;else if(x.stato==="preso"||x.stato==="da_approvare")c++;});});return {n:n,d:d,c:c};}
function disegnaStanze(id){
  var box=$("#tc-stanze"),ev=team.evento;if(!box||!ev)return;
  var viste=ST_PIANTE[ev.planimetria],su=team.stanzeSu;
  if(team.stPiano==null){team.stPiano=0;team.stScelta={v:0,a:0};
    viste.some(function(v,vi){return v.aree.some(function(a,ai){if(stFasi(ev,a.nome).length){team.stPiano=vi;team.stScelta={v:vi,a:ai};return true;}});});}
  var cp=$("#tc-chatparte");if(cp)cp.classList.toggle("st-via",su);
  var h=su?'<button type="button" class="st-indietro" data-st="0">‹ Chat</button>':'';
  var sf=$("#tc-stfiss"),tt=stConta(ev.fasi||[]);
  if(sf)sf.innerHTML=su?'':'<div class="tc-fs st-fs" role="button" tabindex="0" data-st="1"><span class="pin" aria-hidden="true">📌</span><span class="tx">Le stanze del festival · '+tt.d+' di '+tt.n+' fatte</span><span class="ap">Apri ›</span></div>';
  if(su){
    var tot=stConta(ev.fasi||[]),pv=viste[team.stPiano],sc=team.stScelta;
    h+='<div class="st-pag"><section class="st-ev"><h2>'+esc(ev.nome)+'</h2>'+(ev.il?'<span class="d">'+esc(obData(ev.il))+'</span>':'')+
      '<div class="st-barra" aria-hidden="true"><span style="width:'+(tot.n?Math.round(tot.d*100/tot.n):0)+'%"></span></div>'+
      '<span class="st-n">'+tot.d+' di '+tot.n+' attività fatte'+(tot.c?' · '+tot.c+' in corso':'')+'</span></section>'+
      '<div class="st-piani" role="group" aria-label="Piano">'+viste.map(function(v,i){return '<button type="button" data-sp="'+i+'" aria-pressed="'+(i===team.stPiano)+'">'+esc(v.titolo)+'</button>';}).join("")+'</div>'+
      '<div class="st-mappa">'+stDisegno(pv,team.stPiano,sc)+'<ul class="st-elenco">'+pv.aree.map(function(a,i){var f=stFasi(ev,a.nome),k=stConta(f);
        return '<li><button type="button" data-sa="'+i+'" aria-pressed="'+(sc.v===team.stPiano&&sc.a===i)+'"><span class="st-num" style="--c:'+a.col+'">'+(i+1)+'</span><span><b>'+esc(a.nome)+'</b><small>'+(f.length?f.length+(f.length===1?' fase':' fasi'):'nessuna fase')+'</small></span><span class="st-conta">'+(k.n?k.d+' di '+k.n:'')+'</span></button></li>';}).join("")+'</ul></div>'+
      stStanza(ev,viste[sc.v].aree[sc.a],sc.a)+
      (ev.archivio&&ev.il&&ev.il<new Date().toLocaleDateString("sv-SE",{timeZone:"Europe/Rome"})?'<div id="st-arch"><button type="button" class="st-apri" id="st-arch-b">Archivia l\'evento</button></div>':'')+
      '<p class="st-err" id="st-err" aria-live="polite"></p></div>';
  }
  box.innerHTML=h;
  document.querySelectorAll("#tc-stanze [data-st],#tc-stfiss [data-st]").forEach(function(b){b.onclick=function(){team.stanzeSu=b.getAttribute("data-st")==="1";disegnaStanze(id);window.scrollTo(0,0);};
    b.onkeydown=function(e){if(e.key==="Enter"||e.key===" "){e.preventDefault();b.click();}};});
  box.querySelectorAll("[data-sp]").forEach(function(b){b.onclick=function(){team.stPiano=+b.getAttribute("data-sp");team.stScelta={v:team.stPiano,a:0};disegnaStanze(id);};});
  box.querySelectorAll("[data-sa]").forEach(function(b){b.onclick=function(){team.stScelta={v:team.stPiano,a:+b.getAttribute("data-sa")};disegnaStanze(id);
    var s=$("#st-stanza");if(s)s.scrollIntoView({behavior:"smooth",block:"start"});};});
  box.querySelectorAll("[data-sx]").forEach(function(b){b.onclick=function(){b.disabled=true;var c=b.getAttribute("data-sx"),r=b.getAttribute("data-r");
    (c==="lascio"?db.rpc("fm_passo_lascio",{p_riga:r}):db.rpc("fm_passo_cambia",{p_riga:r,p_cosa:c})).then(function(x){
      if(x&&x.error){b.disabled=false;$("#st-err").textContent=errore(x.error);return;}
      if(x&&typeof x.data==="string"&&x.data!=="ok"){b.disabled=false;$("#st-err").textContent=x.data;return;}
      cache.obiettivi=null;stanzeTeam(id);},function(e){b.disabled=false;$("#st-err").textContent=errore(e);});};});
  box.querySelectorAll("[data-sf]").forEach(function(b){b.onclick=function(){var f=(ev.fasi||[]).filter(function(x){return x.id===b.getAttribute("data-sf");})[0];if(!f)return;
    var k=stConta([f]);apriObiettivo({id:f.id,titolo:f.titolo,team:f.team,stadio:f.stadio,entro_il:f.entro_il,passi:k.n,passi_fatti:k.d,presi:0,da_approvare:0},id);};});
  var ab=$("#st-arch-b");if(ab)ab.onclick=function(){var a=$("#st-arch");
    a.innerHTML='<p class="st-nota">Dopo l\'archivio la pagina Stanze esce dal team. Le fasi e la loro storia restano.</p><div class="st-tasti"><button type="button" class="pieno" id="st-arch-si">Archivia</button><button type="button" id="st-arch-no">Annulla</button></div>';
    $("#st-arch-no").onclick=function(){disegnaStanze(id);};
    $("#st-arch-si").onclick=function(){this.disabled=true;db.rpc("fm_evento_archivia",{p_evento:ev.id}).then(function(x){
      if(x&&x.error){$("#st-err").textContent=errore(x.error);return;}if(x&&x.data!=="ok"){$("#st-err").textContent=x.data;return;}stanzeTeam(id);},function(e){$("#st-err").textContent=errore(e);});};};
  box.querySelectorAll("svg .ar").forEach(function(g){g.addEventListener("click",function(){team.stScelta={v:team.stPiano,a:+g.getAttribute("data-a")};disegnaStanze(id);
    var s=$("#st-stanza");if(s)s.scrollIntoView({behavior:"smooth",block:"start"});});});
}
function stDisegno(v,vi,sc){
  var H=46,AC=Math.cos(0.42),AS=Math.sin(0.42);
  var pr=function(x,y,z){return [x*AC-y*AS,(x*AS+y*AC)*0.62-z];},prof=function(x,y){return x*AS+y*AC;};
  var pts=function(a){return a.map(function(p){return p.map(function(n){return n.toFixed(1);}).join(",");}).join(" ");};
  function scatola(pol,h,col,fo,wo,extra){
    var s='<g'+(extra||'')+'><polygon points="'+pts(pol.map(function(p){return pr(p[0],p[1],0);}))+'" fill="'+col+'" fill-opacity="'+fo+'" stroke="'+col+'" stroke-opacity=".95" stroke-width="2.5"/>';
    if(h){var f=[];for(var i=0;i<pol.length;i++){var a=pol[i],b=pol[(i+1)%pol.length];
        f.push({d:prof(a[0],a[1])+prof(b[0],b[1]),p:[pr(a[0],a[1],0),pr(b[0],b[1],0),pr(b[0],b[1],h),pr(a[0],a[1],h)]});}
      f.sort(function(u,w){return u.d-w.d;}).forEach(function(x){s+='<polygon points="'+pts(x.p)+'" fill="'+col+'" fill-opacity="'+wo+'" stroke="'+col+'" stroke-opacity=".6" stroke-width="1.5"/>';});
      s+='<polygon points="'+pts(pol.map(function(p){return pr(p[0],p[1],h);}))+'" fill="none" stroke="#F5F0E6" stroke-opacity=".55" stroke-width="2"/>';}
    return s+'</g>';}
  var g='';v.neutre.forEach(function(r){g+=scatola(r,H,"#9aa0c8",.10,.06);});
  v.aree.forEach(function(ar,i){var on=sc.v===vi&&sc.a===i;g+=scatola(ar.pol,ar.aperto?0:H,ar.col,on?(ar.aperto?.6:.8):(ar.aperto?.25:.35),on?.3:.12,' class="ar" data-a="'+i+'"');});
  var x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;
  v.neutre.concat(v.aree.map(function(x){return x.pol;})).forEach(function(pol){pol.forEach(function(p){[0,H].forEach(function(z){var q=pr(p[0],p[1],z);x0=Math.min(x0,q[0]);y0=Math.min(y0,q[1]);x1=Math.max(x1,q[0]);y1=Math.max(y1,q[1]);});});});
  if(v.ingresso){var qi=pr(v.ingresso[0],v.ingresso[1],0);y1=Math.max(y1,qi[1]+30);}
  var w=x1-x0,hh=y1-y0,pad=Math.max(w,hh)*0.08,r=Math.max(w,hh)/17;
  v.aree.forEach(function(ar,i){var ce=ar.num;if(!ce){var cx=0,cy=0;ar.pol.forEach(function(p){cx+=p[0];cy+=p[1];});ce=[cx/ar.pol.length,cy/ar.pol.length];}
    var q=pr(ce[0],ce[1],ar.aperto?0:H/2);
    g+='<g class="ar" data-a="'+i+'"><circle cx="'+q[0].toFixed(1)+'" cy="'+q[1].toFixed(1)+'" r="'+r.toFixed(1)+'" fill="'+ar.col+'" stroke="#0a1430" stroke-width="'+(r/8).toFixed(1)+'"/>'+
       '<text x="'+q[0].toFixed(1)+'" y="'+q[1].toFixed(1)+'" text-anchor="middle" dominant-baseline="central" font-family="DM Sans,system-ui,sans-serif" font-weight="700" font-size="'+(r*1.15).toFixed(1)+'" fill="#0a1430">'+(i+1)+'</text></g>';});
  if(v.ingresso){var q2=pr(v.ingresso[0],v.ingresso[1],0);
    g+='<path d="M'+(q2[0]-r*.7)+','+(q2[1]-r*.2)+' L'+q2[0]+','+(q2[1]-r)+' L'+(q2[0]+r*.7)+','+(q2[1]-r*.2)+'" fill="none" stroke="#D4AF6A" stroke-width="'+(r/4).toFixed(1)+'" stroke-linecap="round" stroke-linejoin="round"/>';}
  return '<svg viewBox="'+(x0-pad).toFixed(0)+' '+(y0-pad).toFixed(0)+' '+(w+2*pad).toFixed(0)+' '+(hh+2*pad).toFixed(0)+'" role="img" aria-label="'+esc(v.titolo)+'">'+g+'</svg>';
}
function stStanza(ev,ar,ai){
  var f=stFasi(ev,ar.nome);
  return '<section id="st-stanza" class="st-pag" style="margin-top:0"><div class="st-testa"><span class="st-num" style="--c:'+ar.col+'">'+(ai+1)+'</span><h2>'+esc(ar.nome)+'</h2></div>'+((ev.note&&ev.note[ar.nome]&&ev.note[ar.nome].length)?'<details class="st-sp"><summary>Note della stanza</summary>'+ev.note[ar.nome].map(function(t){return '<p>'+esc(t)+'</p>';}).join("")+'</details>':'')+
    (f.length?f.map(function(fa){var k=stConta([fa]),pa=fa.passi||[];
      var at=pa.some(function(x){return x.stato==="da_approvare";});
      var st=k.n&&k.d===k.n?["fatto","Fatto"]:at?["attesa","Da approvare"]:(k.d||k.c)?["corso","In corso"]:["","Da fare"];
      var tit=String(fa.titolo||"");if(tit.indexOf(ar.nome+" · ")===0)tit=tit.slice(ar.nome.length+3);
      return '<article class="st-fase"><div class="st-ft"><h3>'+esc(tit)+'</h3><span class="st-st '+st[0]+'">'+st[1]+'</span></div>'+
        '<div class="st-barra" aria-hidden="true"><span style="width:'+(k.n?Math.round(k.d*100/k.n):0)+'%"></span></div>'+
        '<span class="st-n">'+(k.n?k.d+' di '+k.n+' attività fatte'+(k.c?' · '+k.c+' in corso':''):((fa.elenco||[]).length?'':'attività da scrivere'))+(fa.entro_il?' · entro il '+esc(obData(fa.entro_il)):'')+'</span>'+(fa.note||[]).map(function(t){return '<p class="st-nf">'+esc(t)+'</p>';}).join("")+((fa.elenco||[]).length?'<ul class="st-el">'+fa.elenco.map(function(t){return '<li>'+esc(t)+'</li>';}).join("")+'</ul>':'')+
        (pa.length?'<ul class="st-att">'+pa.map(function(x,i){
          var cl=x.stato==="fatto"?"fatto":x.stato==="da_approvare"?"attesa":x.stato==="preso"?"corso":"";
          var sotto=x.stato==="fatto"?"fatta da "+(x.chi||"una persona"):x.stato==="da_approvare"?"aspetta l'ok"+(x.chi?" · "+x.chi:""):x.stato==="preso"?(x.mio?"la stai facendo tu":"la sta facendo "+(x.chi||"una persona")):"libera";
          var t="";
          if(x.stato==="aperto"&&x.posso_lavorare)t='<button type="button" data-sx="prendo" data-r="'+esc(x.id)+'">Lo faccio io</button>';
          else if(x.stato==="preso"&&x.mio)t='<button type="button" class="pieno" data-sx="fatto" data-r="'+esc(x.id)+'">Fatto</button><button type="button" data-sx="lascio" data-r="'+esc(x.id)+'">Lo lascio</button>';
          else if(x.stato==="da_approvare"&&x.posso_approvare)t='<button type="button" class="pieno" data-sx="approvo" data-r="'+esc(x.id)+'">Approva</button><button type="button" data-sx="rimando" data-r="'+esc(x.id)+'">Rimanda indietro</button>';
          return '<li class="'+cl+'"><span class="st-pal">'+(x.stato==="fatto"?"✓":x.stato==="da_approvare"?"!":(i+1))+'</span><div><span class="tx">'+esc(x.testo)+'</span>'+((x.dettagli||[]).length?'<ul class="st-dett">'+x.dettagli.map(function(t){return '<li>'+esc(t)+'</li>';}).join("")+'</ul>':'')+(x.note||[]).map(function(t){return '<span class="st-nx">'+esc(t)+'</span>';}).join("")+'<span class="chi">'+esc(sotto)+'</span>'+(t?'<div class="st-tasti">'+t+'</div>':'')+'</div></li>';}).join("")+'</ul>':'')+
        '<button type="button" class="st-apri" data-sf="'+esc(fa.id)+'">Apri la fase ›</button></article>';}).join(""):'<p class="st-nota">Ancora nessuna fase in questa stanza.</p>')+'</section>';
}


/* ═══ Tasti a lato della bolla · 1 novembre 2026 · thread «Capire il Company brain con i team» ═══
   Gab 1/11 14:03: «puoi mettere i tasti rispondi, apri argomento, fai obiettivo, di lato al quadrante della chat, mettendo dei loghetti?»
   · 14:04 «va bene per design». Toccando un messaggio, Rispondi, Apri/Chiudi argomento e Fai obiettivo stanno in una colonna
   a lato della bolla (a destra per i messaggi degli altri, a sinistra per i propri), icona con la parola sotto.
   Metti nel Cervello, Segna nel registro, Modifica, Fissa in alto, Elimina, Fai uscire restano nella riga sotto. */
var LATO_CSS='.tc-riga{display:flex;align-items:flex-start;gap:6px;margin:0 0 10px}.tc-riga.mio{flex-direction:row-reverse}'+
'.tc-riga .tc-m{margin:0;flex:1;min-width:0}'+
'.tc-lato{flex:none;width:64px;display:flex;flex-direction:column;gap:6px}'+
'.tc-lato button{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;min-height:58px;padding:6px 2px;border-radius:14px;border:1px solid rgba(212,175,106,.5);background:#1a2148;color:#D4AF6A;font:600 12px "DM Sans",system-ui,sans-serif;line-height:1.1;text-align:center;cursor:pointer}'+
'.tc-lato button svg{width:24px;height:24px;flex:none}.tc-lato button .tc-segno{width:14px;height:14px;border-radius:8px 8px 2px 8px;margin:5px 0}'+
'#tc-az:empty{display:none}';
var ICO_LATO={
  rispondi:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 14 4 9l5-5"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/></svg>',
  argomento:'<span class="tc-segno" aria-hidden="true"></span>',
  obiettivo:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none"/></svg>'
};
function latoMsg(m){
  var chiude=m.argomento&&(m.argomento_da===io.id||io.nucleo);
  function b(az,ico,parola){return '<button type="button" data-az="'+az+'">'+ico+'<span>'+parola+'</span></button>';}
  return '<div class="tc-lato">'+b("rispondi",ICO_LATO.rispondi,"Rispondi")+
    (m.argomento?(chiude?b("chiudi",ICO_LATO.argomento,"Chiudi argomento"):''):b("apri",ICO_LATO.argomento,"Apri argomento"))+
    (team.tipo==="team"?b("obiettivo",ICO_LATO.obiettivo,"Fai obiettivo"):'')+'</div>';
}
document.head.insertAdjacentHTML("beforeend","<style>"+LATO_CSS+"</style>");

document.head.insertAdjacentHTML("beforeend","<style>"+FISS_CSS+"</style>");
/* toccando un messaggio: Rispondi · Apri argomento · Metti nel Cervello (disegno 4), e «segna nel registro» che c'era già dal 92 */
function azioniMsg(m){
  var chiude=m.argomento&&(m.argomento_da===io.id||io.nucleo);
  return '<div class="tc-az" id="tc-az">'+
    (team.prop[m.id]||team.tipo==="chat"||m.assistenza_id?'':'<button type="button" class="cerv" data-az="cervello">Metti nel Cervello</button>')+
    (m.registro_id||!m.testo||team.tipo==="chat"?'':'<select data-az="registro" aria-label="Segna nel registro"><option value="">Segna nel registro…</option><option value="da_fare">da fare</option><option value="decisione">decisione</option><option value="chiamata">chiamata</option><option value="incontro">incontro</option><option value="idea">idea</option></select>')+azioniRuolo(m)+
    '</div>';
}
function legaAzioniMsg(e){
  var box=e.querySelector("#tc-az");if(!box)return;
  var m=team.msg.filter(function(x){return x.id===team.scelto;})[0];if(!m)return;
  function esito(r){if(r&&!r.error&&r.data==="ok"){team.scelto=null;ricaricaTeam(false);return;}$("#tc-err").textContent=(r&&r.data)||errore(r&&r.error);}
  e.querySelectorAll("#tc-az button[data-az], .tc-lato button[data-az]").forEach(function(b){b.onclick=function(){var a=b.getAttribute("data-az");
    if(a==="rispondi"&&m.assistenza_id&&ass.team===team.id){assApriRisposta(m.assistenza_id);return;}
    if(a==="rispondi"){team.scelto=null;disegnaTeam();var t=$("#tc-testo");if(t){t.focus();t.scrollIntoView({block:"center"});}return;}
    if(a==="cervello"){mettiNelCervello(m);return;}
    if(a==="chiudi"){b.disabled=true;db.rpc("fm_messaggio_argomento",{p_messaggio:m.id,p_titolo:""}).then(esito,function(e){b.disabled=false;$("#tc-err").textContent=errore(e);});return;}
    if(a==="obiettivo"){faiObiettivo(box,m,esito);return;}
    if(a==="apri"){
      box.innerHTML='<input type="text" id="tc-arg-t" maxlength="80" placeholder="Il nome dell\'argomento" aria-label="Il nome dell\'argomento" style="flex:1 1 100%"><button type="button" class="cerv" id="tc-arg-ok">Apri</button><button type="button" id="tc-arg-no">Annulla</button>';
      var i=$("#tc-arg-t");i.focus();
      $("#tc-arg-no").onclick=function(){team.scelto=null;disegnaTeam();};
      $("#tc-arg-ok").onclick=function(){var v=i.value.trim();if(!v){i.focus();return;}this.disabled=true;
        db.rpc("fm_messaggio_argomento",{p_messaggio:m.id,p_titolo:v}).then(esito,function(e){$("#tc-err").textContent=errore(e);});};
      i.onkeydown=function(ev){if(ev.key==="Enter")$("#tc-arg-ok").click();};
    }};});
  legaAzioniRuolo(box,m);
  var s=box.querySelector("select[data-az]");if(s)s.onchange=function(){if(!s.value)return;s.disabled=true;
    db.rpc("fm_messaggio_segna",{p_messaggio:m.id,p_tipo:s.value}).then(function(r){cache.obiettivi=null;esito(r);},function(){s.disabled=false;});};
}
/* 10/11 Gab: «un amico ha scritto nel team praticantato, ed io … non leggere il suo nome» → i nomi di chi è nel team, anche ospiti (SQL 237),
   quelli scritti all'accesso. */
var nomiFatti={};
function nomiCerchio(id){
  if(nomiFatti[id])return Promise.resolve();
  return db.rpc("fm_nomi_cerchio",{p_cerchio:id}).then(function(r){
    if(!r||r.error)return;nomiFatti[id]=1;
    (r.data||[]).forEach(function(x){if(x.nome)nomi[x.persona_id]=x.nome;});
  },function(){});
}
function foglioTeam(h){
  var f=$("#tc-foglio");if(!f)return null;
  f.innerHTML='<div class="tc-velo" data-chiudi-f></div><div class="tc-foglio" role="dialog" aria-modal="true"><div class="tc-presa"></div>'+h+'</div>';
  f.querySelector("[data-chiudi-f]").onclick=function(){f.innerHTML="";};
  return f.querySelector(".tc-foglio");
}
function argomenti(){
  var id=team.id,f=foglioTeam(ARG_H);if(!f)return;riempiArgomenti(id);
}
/* 1/11 22:39, Gab: «voglio trovarmi nel team e avere gia un tasto da qualche parte, anche nel menu a destra» → nel foglio ⋯ del team: Aggiungi una persona, col team già scelto */
var staffTeamPre=null;
/* 2-3/11, Gab: «io non riesco ad aggiungere nessuno da dentro i team» · 3/11 10:24 «nel riquadro vedi i 3 puntini a destra, li dovrebbe esserci sia scritto aggiungi persone e invia link invito (solo per nucleo e ruoli)»
   → in cima al foglio ⋯: «Aggiungi persone» (fm_staff_invita col team già dato, SQL 144: mail già iscritta = entra subito; altrimenti link personale) e «Invia link invito» (fm_link_team). Senza ruolo: entra nel team, il ruolo si dà dopo. */
/* 7/11 Gab: «chi li inserisce deve scrivere in che ruolo.. chi non ha ruolo va in default in karma yoga» → un ruolo dei 17 oppure «Karma yoga» (SQL 197) */
function peRuoliOpz(){return '<option value="">Scegli il ruolo</option><option value="karma|">Karma yoga</option>'+
    Object.keys(RUOLI).map(function(f){return '<optgroup label="'+esc(FUNZIONI[f]||f)+'">'+RUOLI[f].map(function(x){return '<option value="'+f+'|'+x[0]+'">'+esc(x[1])+'</option>';}).join("")+'</optgroup>';}).join("");}
function persH(){return '<button type="button" class="tc-btn" id="mc-apri" style="margin-top:6px">Aggiungi persone</button>'+
  '<div id="mc-modulo" hidden>'+
  '<input type="text" class="tc-campo" id="mc-nome" autocomplete="off" placeholder="Nome e cognome" aria-label="Nome e cognome" style="margin-top:12px">'+
  '<input type="email" class="tc-campo" id="mc-mail" autocomplete="off" inputmode="email" placeholder="Mail" aria-label="Mail" style="margin-top:8px">'+
  '<input type="tel" class="tc-campo" id="mc-tel" autocomplete="off" inputmode="tel" placeholder="Numero di telefono" aria-label="Numero di telefono" style="margin-top:8px">'+
  '<select class="tc-campo" id="mc-ruolo" aria-label="Ruolo" style="margin-top:8px">'+peRuoliOpz()+'</select>'+
  '<button type="button" class="tc-btn" id="mc-aggiungi" style="margin-top:12px">Aggiungi</button></div>'+
  '<button type="button" class="tc-btn" id="mc-link" style="margin-top:12px;background:transparent;color:#D4AF6A;border:1px solid #D4AF6A">Invia link invito</button>'+
  '<div id="mc-link-m" hidden><select class="tc-campo" id="mc-lruolo" aria-label="Ruolo di chi entra dal link" style="margin-top:8px">'+peRuoliOpz()+'</select>'+
  '<button type="button" class="tc-btn" id="mc-link-crea" style="margin-top:8px">Crea il link</button></div>'+
  '<button type="button" class="tc-btn" id="mc-part" style="margin-top:12px;background:transparent;color:#D4AF6A;border:1px solid #D4AF6A">Partecipanti</button><div id="mc-part-l"></div>'+
  '<p id="mc-pe-esito" aria-live="polite" style="margin:10px 0 0"></p>';}
var ARG_H='<h2>Argomenti</h2><p>Tocca un argomento: la chat torna al messaggio che l\'ha aperto.</p><div id="tc-ar"><p class="nota">Un momento…</p></div>';
function riempiArgomenti(id){
  db.rpc("fm_team_argomenti",{p_team:id}).then(function(r){var e=$("#tc-ar");if(!e)return;
    var l=(r&&!r.error&&r.data)||[];
    if(!l.length){e.innerHTML='<p>Ancora nessun argomento. Tocca un messaggio e scegli «Apri argomento».</p>';return;}
    var oggi=giornoRoma(new Date());
    e.innerHTML=l.map(function(a){return '<button type="button" class="tc-ar'+(giornoRoma(a.aperto_il)===oggi?'':' vecchio')+'" data-vai-m="'+esc(a.messaggio_id)+'" data-dal="'+esc(a.aperto_il)+'"><span class="tc-segno" aria-hidden="true"></span><b>'+esc(a.argomento)+'</b><small>'+esc(quandoTm(a.aperto_il))+' · '+a.messaggi+'</small></button>';}).join("");
    e.querySelectorAll("[data-vai-m]").forEach(function(b){b.onclick=function(){var mid=b.getAttribute("data-vai-m"),dal=b.getAttribute("data-dal");
      $("#tc-foglio").innerHTML="";
      function vaiA(){var d=document.querySelector('[data-m="'+mid+'"]');if(!d)return false;team.scelto=mid;disegnaTeam();d=document.querySelector('[data-m="'+mid+'"]');d.scrollIntoView({block:"center"});return true;}
      if(vaiA())return;
      team.dal=dal;ricaricaTeamPoi(vaiA);};});
  },function(){var e=$("#tc-ar");if(e)e.innerHTML='<p>Gli argomenti non si aprono adesso.</p>';});
}
function ricaricaTeamPoi(fn){
  var n=0,t=setInterval(function(){n++;if(fn()||n>20)clearInterval(t);},150);
  ricaricaTeam(false);
}
function mettiNelCervello(m){
  var id=team.id;
  var f=foglioTeam('<h2>Metti nel Cervello</h2><p>Diventa una voce del wiki del team.</p>'+
    (m.testo?'<div class="tc-citato">'+esc(m.testo)+'</div>':'')+
    '<label for="tc-cap">Capitolo del Cervello</label><select id="tc-cap"><option value="">Un momento…</option></select>'+
    '<div id="tc-cap-nuovo" hidden><label for="tc-cap-t">Titolo del capitolo nuovo</label><input type="text" id="tc-cap-t" maxlength="200"></div>'+
    '<label>Foto (se c\'è)</label>'+(m.foto&&team.url[m.foto]?'<img src="'+esc(team.url[m.foto])+'" alt="" style="max-width:100%;max-height:220px;border-radius:12px">':'<div class="tc-campo">'+(m.foto?"la foto del messaggio":"nessuna foto")+'</div>')+
    (m.audio||m.file||m.lat!=null?'<label>Va anche nel Cervello</label><div class="tc-campo">'+esc([m.audio?"il vocale":"",m.file?(m.file_nome||"il file"):"",m.lat!=null?"la posizione":""].filter(Boolean).join(" · "))+'</div>':'')+
    '<button type="button" class="tc-btn" id="tc-cerv-ok">Manda al Cervello</button><p class="tc-nota" id="tc-cerv-esito" aria-live="polite">Entra nel Cervello da sola: l\'agente le dà solo il titolo, le parole restano le tue.</p>');
  if(!f)return;
  var s=$("#tc-cap"),nb=$("#tc-cap-nuovo");
  db.from("cervello_capitoli").select("id,titolo").eq("squadra_id",id).order("ordine").then(function(r){
    var l=(r&&!r.error&&r.data)||[];
    s.innerHTML=l.map(function(c){return '<option value="'+esc(c.id)+'">'+esc(c.titolo)+'</option>';}).join("")+'<option value="nuovo">Un capitolo nuovo…</option>';
    if(!l.length){s.value="nuovo";nb.hidden=false;}
  },function(){s.innerHTML='<option value="nuovo">Un capitolo nuovo…</option>';nb.hidden=false;});
  s.onchange=function(){nb.hidden=s.value!=="nuovo";if(!nb.hidden)$("#tc-cap-t").focus();};
  $("#tc-cerv-ok").onclick=function(){var b=this,e=$("#tc-cerv-esito"),nuovo=s.value==="nuovo",tt=$("#tc-cap-t").value.trim();
    if(!s.value)return;
    if(nuovo&&!tt){e.textContent="Scrivi il titolo del capitolo nuovo.";return;}
    b.disabled=true;e.textContent="Un momento…";
    db.rpc("fm_metti_nel_cervello",{p_messaggio:m.id,p_capitolo:nuovo?null:s.value,p_capitolo_nuovo:nuovo?tt:null}).then(function(r){
      if(r&&!r.error&&r.data==="ok"){e.textContent="Mandato. Entra nel Cervello appena l'agente gli dà il titolo.";team.scelto=null;
        setTimeout(function(){var x=$("#tc-foglio");if(x)x.innerHTML="";ricaricaTeam(false);},1600);return;}
      b.disabled=false;e.textContent=(r&&r.data)||errore(r&&r.error);},function(x){b.disabled=false;e.textContent=errore(x);});};
}
/* SQL 129 · il tasto «+»: Foto · Vocale · File · Posizione */
function allega(){
  var f=foglioTeam('<h2>Manda</h2><div class="tc-allega"><label for="tc-file">'+ICO_AZ.foto.replace(' width="26" height="26"','')+'Foto</label>'+
    '<button type="button" id="al-voc">'+ICO_AZ.vocale+'Vocale</button><label for="tc-doc">'+ICO_AZ.file+'File</label>'+
    '<button type="button" id="al-pos">'+ICO_AZ.posizione+'Posizione</button></div>');
  if(!f)return;
  f.querySelectorAll("label").forEach(function(l){l.addEventListener("click",function(){setTimeout(function(){var x=$("#tc-foglio");if(x)x.innerHTML="";},300);});});
  $("#al-voc").onclick=vocale;
  $("#al-pos").onclick=posizione;
}
/* il vocale: si registra col microfono del telefono, si ascolta solo nella chat */
function vocale(){
  var id=team.id;
  var f=foglioTeam('<h2>Vocale</h2><div class="tc-rec"><i></i><span id="vc-t">0:00</span></div><p id="vc-n">Parla: quando hai finito tocca «Manda».</p>'+
    '<button type="button" class="tc-btn" id="vc-ok">Manda</button><button type="button" class="tc-btn" id="vc-no" style="background:transparent;color:#F5F0E6;border:1px solid rgba(212,175,106,.5)">Annulla</button>');
  if(!f)return;
  if(!navigator.mediaDevices||!window.MediaRecorder){$("#vc-n").textContent="Il microfono qui non si apre.";$("#vc-ok").disabled=true;return;}
  var pezzi=[],t0=Date.now(),tm=null;
  navigator.mediaDevices.getUserMedia({audio:true}).then(function(st){
    var rec=new MediaRecorder(st);team.rec=rec;
    rec.ondataavailable=function(e){if(e.data.size)pezzi.push(e.data);};
    rec.onstop=function(){clearInterval(tm);st.getTracks().forEach(function(x){x.stop();});var x=$("#tc-foglio");if(x)x.innerHTML="";
      if(rec.annulla||!pezzi.length)return;
      var tipo=(rec.mimeType||"audio/webm").split(";")[0],est=/mp4/.test(tipo)?"m4a":/ogg/.test(tipo)?"ogg":"webm";
      mandaAllegato(id,new Blob(pezzi,{type:tipo}),"audio","vocale."+est);};
    rec.start();
    tm=setInterval(function(){var s=Math.floor((Date.now()-t0)/1000),e=$("#vc-t");if(e)e.textContent=Math.floor(s/60)+":"+String(s%60).padStart(2,"0");
      if(s>=600&&rec.state==="recording")rec.stop();},500);
    $("#vc-ok").onclick=function(){if(rec.state==="recording")rec.stop();};
    $("#vc-no").onclick=function(){rec.annulla=true;if(rec.state==="recording")rec.stop();else{var x=$("#tc-foglio");if(x)x.innerHTML="";}};
    f.parentNode.querySelector("[data-chiudi-f]").onclick=function(){rec.annulla=true;if(rec.state==="recording")rec.stop();};
  }).catch(function(){$("#vc-n").textContent="Il microfono qui non si apre: va dato il permesso al telefono.";$("#vc-ok").disabled=true;});
}
/* la posizione: si chiede una volta sola, si vede su OpenStreetMap, nessun tracciamento */
function mappaHTML(lat,lon){
  var la=+lat,lo=+lon,d=0.004;
  var bb=[(lo-d).toFixed(5),(la-d/1.6).toFixed(5),(lo+d).toFixed(5),(la+d/1.6).toFixed(5)].join(",");
  return '<iframe class="tc-mappa" loading="lazy" title="Mappa" src="https://www.openstreetmap.org/export/embed.html?bbox='+bb+'&amp;layer=mapnik&amp;marker='+la.toFixed(5)+','+lo.toFixed(5)+'"></iframe>'+
    '<a class="tc-mappa-l" href="https://www.openstreetmap.org/?mlat='+la.toFixed(5)+'&amp;mlon='+lo.toFixed(5)+'#map=17/'+la.toFixed(5)+'/'+lo.toFixed(5)+'" target="_blank" rel="noopener">apri la mappa ›</a>';
}
function posizione(){
  var id=team.id;
  var f=foglioTeam('<h2>Posizione</h2><p>Si manda una volta sola, solo a questa chat. Mai la posizione di una casa privata.</p><div id="ps-m"><p class="tc-nota">Cerco dove sei…</p></div>'+
    '<button type="button" class="tc-btn" id="ps-ok" disabled>Manda questa posizione</button>');
  if(!f)return;
  if(!navigator.geolocation){$("#ps-m").innerHTML='<p class="tc-nota">Questo telefono non dà la posizione.</p>';return;}
  navigator.geolocation.getCurrentPosition(function(p){
    var la=+p.coords.latitude.toFixed(5),lo=+p.coords.longitude.toFixed(5),e=$("#ps-m");if(!e)return;
    e.innerHTML=mappaHTML(la,lo);var b=$("#ps-ok");b.disabled=false;
    b.onclick=function(){b.disabled=true;
      db.from("gruppo_messaggi").insert({cerchio_id:id,lat:la,lon:lo,scritto_da:io.id}).then(function(r){
        if(r&&r.error){b.disabled=false;$("#tc-err").textContent=errore(r.error);return;}
        var x=$("#tc-foglio");if(x)x.innerHTML="";ricaricaTeam(true);},function(x){b.disabled=false;$("#tc-err").textContent=errore(x);});};
  },function(){var e=$("#ps-m");if(e)e.innerHTML='<p class="tc-nota">La posizione non è arrivata: va dato il permesso al telefono.</p>';},{enableHighAccuracy:true,timeout:15000,maximumAge:60000});
}
/* audio e file: si scrive il messaggio che li nomina, poi si carica (le regole dello spazio «chat» lo chiedono in quest'ordine) */
function mandaAllegato(id,blob,campo,nome){
  var e=$("#tc-err"),b=$("#tc-manda");
  if(blob.size>26214400){e.textContent="Il file supera i 25 MB.";return;}
  e.textContent=campo==="audio"?"Mando il vocale…":"Carico il file…";if(b)b.disabled=true;
  var est=(String(nome||"").split(".").pop()||"bin").toLowerCase().replace(/[^a-z0-9]/g,"").slice(0,6)||"bin";
  var path=id+"/"+io.id+"/"+Date.now()+"-"+Math.random().toString(36).slice(2,8)+"."+est;
  var riga={cerchio_id:id,scritto_da:io.id};riga[campo]=path;if(campo==="file")riga.file_nome=String(nome||"file").slice(0,200);
  db.from("gruppo_messaggi").insert(riga).select("id").single().then(function(r){
    if(r&&r.error){e.textContent=errore(r.error);if(b)b.disabled=false;return;}
    var mid=r.data&&r.data.id;
    db.storage.from("chat").upload(path,blob,{contentType:blob.type||"application/octet-stream",upsert:false}).then(function(u){
      if(b)b.disabled=false;
      if(u&&u.error){e.textContent="Non è stato caricato. Si può riprovare.";if(mid)db.from("gruppo_messaggi").delete().eq("id",mid).then(function(){ricaricaTeam(false);},function(){});return;}
      e.textContent="";ricaricaTeam(true);
    },function(){if(b)b.disabled=false;e.textContent="Non è stato caricato. Si può riprovare.";});
  },function(x){if(b)b.disabled=false;e.textContent=errore(x);});
}
/* il tasto «⋯»: le notifiche di questa chat (fm_chat_avvisi) e, nella chat a due, «Chiudi la conversazione» */
function menuChat(){
  var id=team.id,duo=team.tipo==="chat";
  var pe=!duo&&(io.nucleo||(io.ruoli||[]).length);
  /* 6/11 Gab 10:54 «ok»: la riga fissa sul Cervello in cima alle info di ogni team (non nella chat a due; non per Assistenza comunitaria integrata, che non va all'agente: SQL 165) */
  var cerv=duo||(typeof ass!=="undefined"&&ass.team===id)?'':'<div class="tc-cerv-info">Foto, file e testi di almeno 300 caratteri condivisi qui entrano da soli nel Cervello: sul messaggio compare «contenuto su cervello». Per un testo più corto, tocca il messaggio e scegli «Metti nel Cervello».</div>';
  var f=foglioTeam(cerv+(pe?persH()+ARG_H.replace('<h2>','<h2 style="margin-top:26px">'):ARG_H)+(duo?'':OB_H)+'<h2 style="margin-top:26px">Notifiche di questa chat</h2><p>Il suono e la vibrazione li decide il telefono: qui scegli quante notifiche ricevere.</p><div class="tc-scelte" id="mc-sc">'+
    [["ogni","A ogni messaggio",""],["ora","Una all'ora","se arrivano più messaggi, una sola notifica"],["mai","Mai","i messaggi li vedi quando apri l'app"]].map(function(x){
      return '<button type="button" data-avv="'+x[0]+'" aria-pressed="false">'+x[1]+(x[2]?'<small>'+x[2]+'</small>':'')+'</button>';}).join("")+'</div>'+
    (duo?'<label>La conversazione</label><button type="button" class="tc-btn" id="mc-chiudi" style="background:transparent;color:#F5F0E6;border:1px solid rgba(212,175,106,.5)">Chiudi la conversazione</button>'+
      '<p class="tc-nota">Si chiude per tutti e due. Per riaprirla serve una nuova richiesta, dopo 30 giorni.</p>':'')+
    '<p class="tc-nota" id="mc-esito" aria-live="polite"></p>');
  if(!f)return;
  riempiArgomenti(id);if(!duo)riempiObiettivi(id);
  /* 3/11 17:35-17:36, Gab: «una finestra che quando fai invita team, prepara un messaggio presettato con scritta "sei stato invitato al team…"» · «con l aimmagine della piuma» · «un link che apre ad una pagina di soglia» → il link porta a communitas-aeterna/invito-team.html (piuma, i tre passi), il messaggio è già scritto e si corregge */
  function peNomeTeam(){var t=(team.lista||[]).filter(function(x){return x.team_id===id;})[0];return t?t.nome:"";}
  /* 7/11 Gab: l'invito personale porta alla pagina con il ruolo, le spunte e «Scarica l'app» (SQL 186); il link del team resta invito-team */
  function peLinkP(c){return new URL("../communitas-aeterna/invito-ruolo.html?c="+encodeURIComponent(c),location.href).href;}
  function peLink(c){return new URL("../communitas-aeterna/invito-team.html?c="+encodeURIComponent(c)+"&t="+encodeURIComponent(peNomeTeam())+"&s="+encodeURIComponent(id),location.href).href;}
  function peFinestra(u,tel,nota){
    var es=$("#mc-pe-esito"),msg="Sei stato invitato al team "+peNomeTeam()+"\n"+u;
    es.innerHTML=(nota?'<span>'+esc(nota)+'</span>':'')+'<textarea class="tc-campo" id="mc-msg" rows="4" aria-label="Messaggio" style="margin-top:8px;resize:vertical"></textarea>'+
      '<span style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px">'+(navigator.share?'<button type="button" class="mini oro" id="mc-cond">Condividi con la piuma</button>':'')+
      '<button type="button" class="mini oro" id="mc-wa">WhatsApp</button><button type="button" class="mini" id="mc-copia">Copia</button></span>';
    $("#mc-msg").value=msg;
    function testo(){return $("#mc-msg").value;}
    $("#mc-wa").onclick=function(){window.open("https://wa.me/"+peWa(tel)+"?text="+encodeURIComponent(testo()),"_blank","noopener");};
    var cb=$("#mc-copia");cb.onclick=function(){var v=testo();(navigator.clipboard?navigator.clipboard.writeText(v):Promise.reject()).then(function(){cb.textContent="Copiato";},function(){prompt("Copia il messaggio",v);});};
    var sh=$("#mc-cond");if(sh)sh.onclick=function(){var v=testo();
      fetch("icona-felicitas-512.png?v=1102").then(function(r){return r.blob();}).then(function(b){
        var f=new File([b],"felicitasmundi.png",{type:"image/png"});
        if(navigator.canShare&&navigator.canShare({files:[f]}))return navigator.share({files:[f],text:v});
        return navigator.share({text:v});
      }).catch(function(){});};
  }
  function peWa(t){var d=String(t||"").replace(/[^0-9]/g,"");if(!d)return "";if(/^0039/.test(d))d=d.slice(2);if(/^39[0-9]{9,10}$/.test(d))return d;if(/^3/.test(d))return "39"+d;return d;}
  var ap=$("#mc-apri");if(ap)ap.onclick=function(){var mo=$("#mc-modulo");mo.hidden=!mo.hidden;if(!mo.hidden)$("#mc-nome").focus();};
  var ab=$("#mc-aggiungi");if(ab)ab.onclick=function(){
    var es=$("#mc-pe-esito"),n=val("mc-nome"),m=val("mc-mail"),tel=val("mc-tel"),ru=($("#mc-ruolo").value||"").split("|"),kar=ru[0]==="karma";
    if(!n){es.textContent="Scrivi il nome.";return;}
    if(!kar&&!ru[1]){es.textContent="Scegli il ruolo.";return;}
    if(!m&&!tel){es.textContent="Scrivi la mail o il numero.";return;}
    if(m&&m.indexOf("@")<1){es.textContent="Questa mail non sembra giusta.";return;}
    if(tel&&!/^\+?[0-9 ]{6,20}$/.test(tel)){es.textContent="Il numero ha solo cifre, con + davanti se serve.";return;}
    ab.disabled=true;es.textContent="Un momento…";
    db.rpc("fm_staff_invita",{p_nome:n,p_mail:m,p_villaggio:null,p_funzione:kar?null:ru[0],p_ruolo:kar?null:ru[1],p_telefono:tel||null,p_altri:[],p_squadra:id,p_karma:kar}).then(function(r){
      if(r&&r.error){ab.disabled=false;es.textContent=errore(r.error);return;}
      var c=r.data||"",u=peLinkP(c);
      db.from("inviti_staff").select("usato_il").eq("codice",c).limit(1).then(function(q){ab.disabled=false;
        var gia=q&&!q.error&&q.data&&q.data[0]&&q.data[0].usato_il;
        ["mc-nome","mc-mail","mc-tel","mc-ruolo"].forEach(function(k){$("#"+k).value="";});
        if(gia){es.textContent=n+" era già iscritto: ora è nel team "+(kar?"in karma yoga":"con il ruolo "+nomeRuolo(ru[0],ru[1]))+".";return;}
        peFinestra(u,tel,'');
      },function(){ab.disabled=false;es.textContent="Fatto.";});
    },function(x){ab.disabled=false;es.textContent=errore(x);});};
  /* 3/11 20:07-20:09, Gab: «ho inserito un account nel team giornale ma non è visibile» · «e non si vede» → l'elenco di chi è nel team (SQL 157) */
  var pb=$("#mc-part");if(pb)pb.onclick=function(){
    var l=$("#mc-part-l");if(l.innerHTML){l.innerHTML="";return;}
    l.innerHTML='<p style="margin:10px 0 0">Un momento…</p>';
    db.rpc("fm_team_partecipanti",{p_squadra:id}).then(function(r){
      if(r&&r.error){l.innerHTML='<p style="margin:10px 0 0">'+esc(/fm_team_partecipanti|function/i.test(r.error.message||"")?"Si apre con l'SQL 157.":errore(r.error))+'</p>';return;}
      var d=(r&&r.data)||[];
      l.innerHTML=d.length?'<div style="margin-top:10px;border:1px solid rgba(212,175,106,.35);border-radius:14px;overflow:hidden">'+d.map(function(x,i){
        return '<div style="padding:12px 14px;background:#1a2148;'+(i?'border-top:1px solid rgba(212,175,106,.2);':'')+'font-size:18px">'+esc(x.nome)+(x.responsabile?' <span style="color:#D4AF6A;font-size:15px">· responsabile</span>':'')+'</div>';}).join("")+'</div>'+
        '<p style="margin:6px 0 0;color:#cfc8b8;font-size:16px">'+d.length+(d.length===1?' persona':' persone')+'</p>':'<p style="margin:10px 0 0">Ancora nessuno.</p>';
    },function(x){l.innerHTML='<p style="margin:10px 0 0">'+esc(errore(x))+'</p>';});};
  /* 7/11 Gab: «invita link invito va reso possibile solo da nucleo e ruoli, e chi li inserisce deve scrivere in che ruolo» (SQL 197) */
  var lb=$("#mc-link");if(lb)lb.onclick=function(){var lm=$("#mc-link-m");lm.hidden=!lm.hidden;};
  var lc=$("#mc-link-crea");if(lc)lc.onclick=function(){
    var es=$("#mc-pe-esito"),ru=($("#mc-lruolo").value||"").split("|"),kar=ru[0]==="karma";
    if(!kar&&!ru[1]){es.textContent="Scegli il ruolo di chi entra dal link.";return;}
    lc.disabled=true;es.textContent="Un momento…";
    db.rpc("fm_link_team",{p_squadra:id,p_funzione:kar?null:ru[0],p_ruolo:kar?null:ru[1],p_karma:kar}).then(function(r){lc.disabled=false;
      if(r&&r.error){es.textContent=/fm_link_team|function/i.test(r.error.message||"")?"Si apre con l'SQL 197.":errore(r.error);return;}
      peFinestra(peLinkP(r.data),'','Vale per chiunque lo riceva, con il ruolo '+(kar?'Karma yoga':nomeRuolo(ru[0],ru[1]))+'.');
    },function(x){lc.disabled=false;es.textContent=errore(x);});};
  function segna(v){f.querySelectorAll("[data-avv]").forEach(function(b){b.setAttribute("aria-pressed",String(b.getAttribute("data-avv")===v));});}
  db.rpc("fm_mia_scelta_avvisi",{p_cerchio:id}).then(function(r){if(r&&!r.error)segna(r.data||"ora");},function(){});
  f.querySelectorAll("[data-avv]").forEach(function(b){b.onclick=function(){var v=b.getAttribute("data-avv");
    db.rpc("fm_chat_avvisi",{p_cerchio:id,p_avvisi:v}).then(function(r){if(r&&!r.error&&r.data==="ok"){segna(v);$("#mc-esito").textContent="Fatto.";}else $("#mc-esito").textContent=(r&&r.data)||errore(r&&r.error);},function(){});};});
  var cb=$("#mc-chiudi");if(cb)cb.onclick=function(){
    if(cb.getAttribute("data-sicuro")!=="1"){cb.setAttribute("data-sicuro","1");cb.textContent="Tocca ancora per chiuderla";return;}
    cb.disabled=true;db.rpc("fm_chat_chiudi",{p_chat:id}).then(function(r){if(r&&!r.error&&r.data==="ok"){team.chat=null;vai("azione");return;}
      cb.disabled=false;$("#mc-esito").textContent=(r&&r.data)||errore(r&&r.error);},function(){cb.disabled=false;});};
}
/* la foto: si rimpicciolisce sul telefono (lato lungo 1600), si scrive il messaggio che la nomina, poi si carica (le regole dello spazio «chat» lo chiedono in quest'ordine) */
function riduciFoto(f){
  return new Promise(function(ok){
    if(!/^image\//.test(f.type)||/gif$/.test(f.type)){ok(f);return;}
    var u=URL.createObjectURL(f),im=new Image();
    im.onload=function(){var k=Math.min(1,1600/Math.max(im.naturalWidth,im.naturalHeight)),cv=document.createElement("canvas");
      cv.width=Math.round(im.naturalWidth*k);cv.height=Math.round(im.naturalHeight*k);cv.getContext("2d").drawImage(im,0,0,cv.width,cv.height);URL.revokeObjectURL(u);
      cv.toBlob(function(b){ok(b&&b.size<f.size?b:f);},"image/jpeg",0.82);};
    im.onerror=function(){URL.revokeObjectURL(u);ok(f);};
    im.src=u;
  });
}
/* 10/11 Gab: «ho preso un mio file da download e l ho trascinato nella barra, e non l ha inserito» → un file trascinato sulla chat del team parte da solo;
   fuori dalla chat il browser non apre più il file in un'altra finestra. */
var AUDIO_EST=/\.(m4a|mp3|ogg|oga|opus|webm|wav|aac|flac|amr|3gp)$/i;
function mandaTrascinato(id,f){
  if(/^image\//.test(f.type||""))return mandaFoto(id,f);
  if(/^audio\//.test(f.type||"")||AUDIO_EST.test(f.name||""))return mandaAllegato(id,f,"audio",f.name);
  return mandaAllegato(id,f,"file",f.name);
}
var trascinaPronto=false;
function trascinaInChat(){
  if(trascinaPronto)return;trascinaPronto=true;
  function haFile(e){var t=e.dataTransfer&&e.dataTransfer.types;return !!t&&Array.prototype.indexOf.call(t,"Files")>=0;}
  function zona(){return vista==="team"&&team.id?$("#tc-chatparte"):null;}
  function spegni(){var z=$("#tc-chatparte");if(z)z.style.outline="";}
  document.addEventListener("dragover",function(e){if(!haFile(e))return;e.preventDefault();var z=zona();
    if(z&&z.contains(e.target)){e.dataTransfer.dropEffect="copy";z.style.outline="2px dashed #D4AF6A";}else{e.dataTransfer.dropEffect="none";spegni();}});
  document.addEventListener("dragleave",function(e){if(!e.relatedTarget)spegni();});
  document.addEventListener("drop",function(e){if(!haFile(e))return;e.preventDefault();spegni();
    var z=zona();if(!z||!z.contains(e.target))return;
    var id=team.id,l=Array.prototype.slice.call(e.dataTransfer.files||[]);
    l.forEach(function(f,i){setTimeout(function(){if(team.id===id)mandaTrascinato(id,f);},i*1500);});});
}
function mandaFoto(id,f){
  var e=$("#tc-err"),ta=$("#tc-testo"),b=$("#tc-manda");
  e.textContent="Carico la foto…";if(b)b.disabled=true;
  riduciFoto(f).then(function(blob){
    if(blob.size>10485760){e.textContent="La foto supera i 10 MB.";if(b)b.disabled=false;return;}
    var est=blob.type==="image/jpeg"?"jpg":((blob.type.split("/")[1]||"jpg").replace(/[^a-z0-9]/g,"")||"jpg");
    var path=id+"/"+io.id+"/"+Date.now()+"-"+Math.random().toString(36).slice(2,8)+"."+est,testo=ta.value.trim()||null;
    db.from("gruppo_messaggi").insert({cerchio_id:id,testo:testo,foto:path,scritto_da:io.id}).select("id").single().then(function(r){
      if(r&&r.error){e.textContent=errore(r.error);if(b)b.disabled=false;return;}
      var mid=r.data&&r.data.id;
      db.storage.from("chat").upload(path,blob,{contentType:blob.type||"image/jpeg",upsert:false}).then(function(u){
        if(b)b.disabled=false;
        if(u&&u.error){e.textContent="La foto non è stata caricata. Si può riprovare.";if(mid)db.from("gruppo_messaggi").delete().eq("id",mid).then(function(){ricaricaTeam(false);},function(){});return;}
        e.textContent="";if(testo){ta.value="";ta.style.height="";}ricaricaTeam(true);
      },function(){if(b)b.disabled=false;e.textContent="La foto non è stata caricata. Si può riprovare.";});
    },function(x){if(b)b.disabled=false;e.textContent=errore(x);});
  });
}
function moduloAz(tit,campi,rpc,args){
  var c=$("#corpo");
  if(!io.id){c.innerHTML='<h2 class="az-tit">'+esc(tit)+'</h2><div class="az-filo"></div><div class="card"><span class="t">Per mandare la richiesta serve entrare.</span><div class="fine"><a class="btn pieno" href="'+ENTRA+'">Entra</a></div></div><p><button class="mini" data-vai="azione">‹ Azione</button></p>';legaVai(c);return;}
  c.innerHTML='<h2 class="az-tit">'+esc(tit)+'</h2><div class="az-filo"></div>'+campi+
    '<p style="margin-top:18px"><button class="btn pieno az-invia" type="button" id="az-invia">Invia la richiesta</button></p><p class="az-esito" id="az-esito" aria-live="polite"></p>'+
    '<p><button class="mini" data-vai="azione">‹ Azione</button></p>';
  legaVai(c);
  $("#az-invia").onclick=function(){var b=this,e=$("#az-esito"),a=args();if(typeof a==="string"){e.textContent=a;return;}
    b.disabled=true;e.textContent="Un momento…";
    db.rpc(rpc,a).then(function(r){b.disabled=false;
      if(r&&r.error){e.textContent="Non è stata salvata. Si può riprovare.";return;}
      if(r&&r.data==="ok"){e.textContent="Richiesta arrivata.";c.querySelectorAll("input,textarea").forEach(function(x){x.value=x.type==="number"?"1":"";});}else e.textContent=(r&&r.data)||"";},
      function(){b.disabled=false;e.textContent="Non è stata salvata. Si può riprovare.";});};
}
function vCompra(){
  moduloAz("Compra",
    '<label class="az-l" for="az-p">Cosa vuoi comprare</label><input type="text" id="az-p" maxlength="200">'+
    '<label class="az-l" for="az-q">Quanti</label><input type="number" id="az-q" min="1" max="999" value="1">'+
    '<label class="az-l" for="az-r">Dove lo ritiri</label><input type="text" id="az-r" maxlength="200">'+
    '<label class="az-l" for="az-n">Note</label><textarea id="az-n" maxlength="1000"></textarea>',
    "fm_chiedi_acquisto",
    function(){var p=$("#az-p").value.trim();if(!p)return "Scrivi cosa vuoi comprare.";
      return {p_prodotto:p,p_quanti:Math.max(1,parseInt($("#az-q").value,10)||1),p_ritiro:$("#az-r").value,p_note:$("#az-n").value};});
}
