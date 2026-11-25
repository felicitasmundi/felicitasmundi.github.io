/* ═══ GIORNALE · modello 4 ═══
   Gab 20 ott 01:42 sul modello 4: «bello». 01:48: «ok anteprima si è giusto».
   Gab 20 ott 10:32: il Settimanale del 20/10 è «troppo approssimativo», «non lo devo far leggere a nessuno» → nessun testo del Settimanale qui.
   Testi fissi solo da fonti già approvate: pagina del Festival, SQL 77 (le voci, audio 20/10 01:31), SQL 84-85 (le tre funzioni), Cervello (i prezzi).
   Gli articoli del giorno si leggono dal database: i pubblici in tessere grandi, gli altri in «Solo per i villaggi».
   Bolli del palinsesto e «dall'ultima volta» dall'SQL 77 (fm_giornale_entro, fm_giornale_voci_mosse); senza, le voci sono tutte uguali. */
var FEST_ID="bfff97a1-3431-4939-b15e-304f14087509";
var VOCI_G4=[["pratiche_risveglio","Pratiche di risveglio",1],["bambini","Contenuti per bambini",2],["sapere_mondo","Sapere del mondo",5],["storie","Storie",3],["musica","Bella musica",4],["maestrie","Le maestrie",3],["insegnamenti","Insegnamenti",5],["creativita","Creatività",1],["notte","Programmi della notte",4],["tecnologia","Tecnologia",5],["economia","Economia",3]];
var DATE_G4=[["2026-10-25","25 ottobre","L'incontro dei vicinati · Baratili · dalle 11"],["2026-11-21","21 novembre","Felicitas Festival · Baratili San Pietro · dalle 10:00"]]; /* dalla pagina del Festival */
var g4Entro;
function g4Testa(g){
  var fest=Date.now()<new Date("2026-11-22T00:00:00").getTime(),L=luna();
  var giorni=Math.max(0,Math.ceil((new Date("2026-11-21T00:00:00").getTime()-new Date().setHours(0,0,0,0))/864e5));
  var ico=function(d){return '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" aria-hidden="true">'+d+'</svg>';};
  var s1=function(x){return ' g4-sale';};
  return '<div class="gz"><div class="gz-riga"><span>'+esc(g.toLocaleDateString("it-IT",{weekday:"long",day:"numeric",month:"long",year:"numeric"}))+'</span><span>Edizione delle 9</span></div>'+
      '<p class="gz-occ0">Giornale</p><p class="gz-nome">FelicitasMundi</p><div class="gz-doppio"></div><p class="gz-quanti" id="gz-quanti" hidden></p>'+
      '<div id="g4-art"></div><div class="gz-doppio"></div></div>'+
    '<div class="g4-apre"><p class="grande" id="g4-mosse" hidden></p></div>'+
    '<div id="g4-radio"></div>'+
    (fest?'<div class="g4-t g4-prog'+s1()+'"><a href="/felicitas-festival-21-novembre-baratili/?c=10182300"><img src="casa/festival-trame-banda.jpg" alt="Felicitas Festival, TRAME, la forza di essere connessi, 21 novembre 2026, Baratili San Pietro"></a><div class="in">'+
      '<div class="g4-occ">In evidenza</div><h2>Felicitas Festival</h2>'+
      '<p>TRAME · la forza di essere connessi<br>Sabato 21 novembre 2026 · dalle 10:00<br>Centro Sociale + Centro polifunzionale, ex Cantina Madau · Baratili San Pietro (OR)</p>'+
      '<div class="g4-num"><div><b>'+giorni+'</b><small>giorni</small></div><div id="g4-fatti" hidden><b></b><small>compiti fatti</small></div><div id="g4-servono" hidden><b></b><small>cose che servono</small></div></div>'+
      '<div class="g4-serve" id="g4-serve" hidden><div class="g4-occ">Cosa serve</div></div>'+
      '<a class="g4-tasto" href="/felicitas-festival-21-novembre-baratili/?c=10182300">Il programma</a></div></div>':'')+
    '<div id="g4-palb" hidden><div class="g4-sale" style="padding:6px 6px 0"><div class="g4-occ">Il palinsesto</div></div>'+
    '<div class="g4-pal" id="g4-pal">'+VOCI_G4.map(function(v){return '<div class="g4-p g4-c'+v[2]+' g4-sale" data-voce="'+v[0]+'"><h4>'+esc(v[1])+'</h4></div>';}).join("")+'</div><div id="g4-pal-lista"></div></div>'+
    '<div class="g4-t g4-sale"><div class="in" id="g4-date"><div class="g4-occ">Le date</div>'+g4Date([])+'</div></div>'+
    '<div id="g4-vil"></div>';
}
function g4Date(lez){
  var oggi=new Date();oggi.setHours(0,0,0,0);var r=[];
  lez.forEach(function(l){var t=new Date(l.inizio_il);if(t<Date.now()-36e5)return;var d=new Date(t);d.setHours(0,0,0,0);
    r.push({t:t.getTime(),b:(d.getTime()===oggi.getTime()?"oggi":t.toLocaleDateString("it-IT",{day:"numeric",month:"long"}))+", "+hhmm(l.inizio_il),s:l.titolo+(l.luogo?" · "+l.luogo:"")});});
  DATE_G4.forEach(function(x){var t=new Date(x[0]+"T00:00:00").getTime();if(t>=oggi.getTime())r.push({t:t,b:x[1],s:x[2]});});
  r.sort(function(p,q){return p.t-q.t;});
  return r.slice(0,8).map(function(x){return '<div class="g4-d"><b>'+esc(x.b)+'</b><span>'+esc(x.s)+'</span></div>';}).join("");
}
function g4Sale(){
  var el=[].slice.call(document.querySelectorAll("#corpo .g4-sale:not(.visto)"));
  if(!("IntersectionObserver" in window)){el.forEach(function(e){e.classList.add("visto");});return;}
  var o=new IntersectionObserver(function(v){v.forEach(function(x){if(x.isIntersecting){x.target.classList.add("visto");o.unobserve(x.target);}});},{rootMargin:"0px 0px -8% 0px"});
  el.forEach(function(e){o.observe(e);});
}
/* un articolo = una lastra di vetro del colore del suo elemento (SQL 163, orme.elemento; vuoto o prima del 163 = oro), come la mail delle 9 */
var GZ_EL={terra:"201,161,90",acqua:"111,168,214",fuoco:"224,122,85",aria:"141,191,94",etere:"176,138,224"};
function gzArticolo(x,firme,apre){
  var o=x.o,link=o.link||primoLink(o.contenuto),testo=String(o.contenuto||"");if(!o.link&&link)testo=testo.replace(link,"").trim();
  var par=testo.split(/\n\s*\n/).map(function(p){return p.trim();}).filter(Boolean);
  if(par.length<2)par=testo.split(/\n/).map(function(p){return p.trim();}).filter(Boolean);
  var el=GZ_EL[o.elemento]?o.elemento:"";
  var occ=(el?el.charAt(0).toUpperCase()+el.slice(1)+" · ":"")+(o.orma_madre_id===FEST_ID?"Felicitas Festival · ":"")+(o.visibilita==="pubblico"?"🌐 Per tutti":"🏡 Solo per i vicinati");
  var imm=o.immagine_url&&/^(https:\/\/|giornale\/img\/)[^\s"'<>]+$/.test(o.immagine_url)?'<img class="gz-img" src="'+esc(o.immagine_url)+'" alt="'+esc(o.immagine_alt||"")+'" decoding="async">':'';
  var t=par.map(function(p){return '<p class="gz-t">'+esc(p).replace(/«([^«»]{1,800})»/g,"<strong>«$1»</strong>")+'</p>';}).join("");
  return '<article class="gz-lastra"'+(el?' style="--el:'+GZ_EL[el]+'"':'')+'><p class="gz-occ"><i></i>'+esc(occ)+'</p>'+(o.titolo?(apre?'<h2>':'<h3>')+esc(o.titolo)+(apre?'</h2>':'</h3>'):'')+imm+t+linkHTML(link)+mediaHTML(o,firme)+apriCerv(o)+gzCondividiB(o)+visHTML(o)+'</article>';
}
/* 14/11 · «Condividi» solo sugli articoli per tutti: la pagina giornale/<id>.html (SQL 260, si rigenera ogni mezz'ora) */
function gzCondividiB(o){return o&&o.id&&o.visibilita==="pubblico"?'<button type="button" class="mini" data-gz-cond="'+esc(o.id)+'" data-gz-cond-t="'+esc(o.titolo||"")+'" style="margin-top:8px">Condividi</button>':'';}
function gzCondividi(id,tit){var u="https://app.felicitasmundi.com/giornale/"+encodeURIComponent(id)+".html";
  if(navigator.share){navigator.share({title:tit||"FelicitasMundi",url:u}).catch(function(){});return;}
  window.open("https://wa.me/?text="+encodeURIComponent((tit?tit+" ":"")+u),"_blank","noopener");}
document.addEventListener("click",function(ev){var b=ev.target.closest&&ev.target.closest("[data-gz-cond]");if(!b)return;gzCondividi(b.getAttribute("data-gz-cond"),b.getAttribute("data-gz-cond-t"));});
/* elemento e Festival si leggono a parte: se lo SQL 163 non c'è ancora, restano oro */
function gzDettagli(tutti,firme){
  var ids=tutti.map(function(x){return x.o.id;});if(!db||!ids.length||tutti.gzLetti)return;tutti.gzLetti=1;
  db.from("orme").select("id,elemento,orma_madre_id").in("id",ids).then(function(r){
    if(r&&!r.error)return r.data||[];
    return db.from("orme").select("id,orma_madre_id").in("id",ids).then(function(x){return x&&!x.error?(x.data||[]):[];});
  }).then(function(d){var m={};(d||[]).forEach(function(z){m[z.id]=z;});var cambia=0;
    tutti.forEach(function(x){var z=m[x.o.id];if(z){if(z.elemento&&!x.o.elemento){x.o.elemento=z.elemento;cambia=1;}if(z.orma_madre_id&&!x.o.orma_madre_id){x.o.orma_madre_id=z.orma_madre_id;cambia=1;}}});
    if(cambia&&vista==="giornale"){gzMetti(tutti,firme);g4Lavora();}
  },function(){});
}
function gzMetti(tutti,firme){
  var A=$("#g4-art");if(!A)return;
  A.innerHTML=tutti.length?gzArticolo(tutti[0],firme,true)+(tutti.length>1?'<div class="gz-col">'+tutti.slice(1).map(function(x){return gzArticolo(x,firme,false);}).join("")+'</div>':""):"";
  A.querySelectorAll("[data-art]").forEach(function(b){b.onclick=function(){apriA[b.getAttribute("data-art")]=!apriA[b.getAttribute("data-art")];vGiornale();};});legaVis(A);
}
var g4TeamLetti=0;
function g4Articoli(arti,firme){
  var pub=arti.filter(function(x){return x.o.visibilita==="pubblico";}),dentro=arti.filter(function(x){return x.o.visibilita!=="pubblico";});
  var tutti=pub.concat(io.id?dentro:[]),A=$("#g4-art"),Q=$("#gz-quanti");
  if(Q){Q.textContent=tutti.length===1?"1 articolo in questo numero":tutti.length+" articoli in questo numero";Q.hidden=!tutti.length;}
  gzMetti(tutti,firme);gzDettagli(tutti,firme);
  if(io.id&&db&&!team.lista&&!g4TeamLetti&&tutti.some(function(x){return x.o.squadra_id;})){g4TeamLetti=1;leggiTeam().then(function(l){if(l&&vista==="giornale"){gzMetti(tutti,firme);g4Lavora();}});}
  var V=$("#g4-vil");if(V)V.innerHTML="";
  [A,V].forEach(function(c){if(!c)return;
    c.querySelectorAll("[data-art]").forEach(function(b){b.onclick=function(){apriA[b.getAttribute("data-art")]=!apriA[b.getAttribute("data-art")];vGiornale();};});legaVis(c);});
  g4Sale();  g4Lavora();
}
