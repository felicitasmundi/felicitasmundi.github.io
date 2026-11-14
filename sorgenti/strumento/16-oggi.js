/* OGGI */
function appuntamentiHTML(lez,dir,da,a){
  var ora=Date.now(),r=[];
  lez.forEach(function(l){var t=new Date(l.inizio_il).getTime();if(t<da||t>=a)return;if(t+(l.durata_min||60)*6e4<ora)return;
    r.push({t:t,h:'<span><span class="ora">'+hhmm(l.inizio_il)+'</span> · '+esc(l.titolo)+(l.luogo?' · '+esc(l.luogo):'')+'</span>',link:l.link});});
  dir.forEach(function(d){var t=new Date(d.inizio_il).getTime();if(t<da||t>=a)return;var gia=t<=ora;
    r.push({t:t,h:'<span>'+(gia?'<span class="rosso">● in onda</span>':'<span class="ora">'+hhmm(d.inizio_il)+'</span> · diretta')+' · '+esc(d.titolo)+'</span>',link:"diretta-bozza.html?puntata="+encodeURIComponent(d.id)});});
  /* 18 ott 20:46, Gab: «su oggi non mi riappare la chiamata in corso» → se sei entrato in una diretta (il segno fm_diretta, valido 3 ore), Oggi la rimette in cima */
  try{var sg=JSON.parse(localStorage.getItem("fm_diretta")||"null");
    if(sg&&sg.puntata&&sg.t&&ora-sg.t<3*3600e3&&!dir.some(function(d){return String(d.id)===String(sg.puntata);}))
      r.push({t:0,h:'<span><span class="rosso">● in onda</span> · '+esc(sg.titolo||"la diretta")+' · rientra</span>',link:"diretta-bozza.html?puntata="+encodeURIComponent(sg.puntata)+"&c=10182300"});}catch(e){}
  r.sort(function(x,y){return x.t-y.t;});
  return r.map(function(x){return x.link?'<a href="'+esc(x.link)+'"'+(/^https:/.test(x.link)?' target="_blank" rel="noopener noreferrer"':'')+'>'+x.h+'<span>›</span></a>':'<div>'+x.h+'</div>';}).join("");
}
/* 19 ott 12:37, Gab: «il paniere su oggi va nel quadrante "di cosa hai bisogno" nell ambito dell emporio» · «180 pacco per il gruppo»
   · «il paniere sarebbe il contesto prodotto da prendere col gruppo». Esempio; il database si collega dopo. */
var PANIERE_O={titolo:"L'altra storia d'Italia",autore:"Lamberto Rimondini",editore:"Macro",pacco:180,copie:7}; /* 19 ott 12:50, Gab: «ora scrivi che le copie sono 7, poi ti do conferma col dato reale su database» */
function paniereHTML(){var p=PANIERE_O;
  return '<div class="paniere-o" id="o-paniere"><span class="sopra">Emporio · il paniere del gruppo</span><b>'+esc(p.titolo)+'</b><span class="m">'+esc(p.autore)+' · '+esc(p.editore)+'</span>'+
    '<span class="prezzo">'+esc(p.pacco)+' € <small>il pacco per il gruppo · '+esc(p.copie)+' copie</small></span>'+
    '<div class="fine"><button class="mini oro" data-pan="si">Partecipo</button><button class="mini" data-pan="come">Come funziona</button></div><div class="sotto" id="o-pan-sotto" hidden></div></div>';}
function legaPaniere(c){var box=c.querySelector("#o-paniere");if(!box)return;var sotto=box.querySelector("#o-pan-sotto");
  box.querySelector('[data-pan="come"]').onclick=function(){
    if(!sotto.hidden&&sotto.getAttribute("data-c")==="come"){sotto.hidden=true;return;}
    sotto.setAttribute("data-c","come");sotto.hidden=false;
    sotto.innerHTML='<span class="t">Il paniere è il prodotto da prendere col gruppo. Il prezzo è quello del pacco per il gruppo.</span><span class="t">Ogni paniere va prima al nucleo per essere confermato.</span><span class="m">Il primo punto di ritiro è il Festival Felicitas, 21 novembre, Baratili San Pietro.</span>';};
  box.querySelector('[data-pan="si"]').onclick=function(){
    if(!io.id){location.href=ENTRA;return;}
    sotto.setAttribute("data-c","si");sotto.hidden=false;
    sotto.innerHTML='<span class="m">Dove lo ritiri?</span><select id="o-pan-dove"><option value="festival">Festival Felicitas · 21 novembre</option><option value="portami">Me lo porta un vicino</option></select>'+
      '<div class="fine"><button class="mini oro" id="o-pan-ok">Confermo</button><button class="mini" id="o-pan-no">Annulla</button></div>';
    sotto.querySelector("#o-pan-no").onclick=function(){sotto.hidden=true;};
    sotto.querySelector("#o-pan-ok").onclick=function(){var d=sotto.querySelector("#o-pan-dove");
      sotto.innerHTML='<span class="t">Ci sei. Ritiro: '+esc(d.options[d.selectedIndex].text)+'.</span>';};};
}
var STANZE_O=[["Emporio","emporio.html?c=10182300","#4488BB","emporio"],["Stampa","emporio.html?c=10182300","#669944","stampa"],["Assistenza comunitaria integrata","stanze-bozza.html?s=mutuo&c=10182300","#CC6644","assistenza"],["Scuola","stanze-bozza.html?s=scuola&c=10182300","#9966CC","scuola"]];
/* Le file di «Di cosa hai bisogno?»: solo cose vere. Emporio: gli ultimi prodotti pubblici del database; se non ce ne sono, i prodotti con foto già nell'Emporio.
   Stampa: il kit fiera e le categorie con foto della pagina Stampa. Assistenza e Scuola: i servizi attivi del database. Una fila vuota non si vede. */
var EMP_FISSI=[["La Bhagavad-gītā Così com’è","A.C. Bhaktivedānta Swāmī Prabhupāda","APP.FELICITASMUNDI/piatti/bhagavad-gita.jpg"],["Anima vagabonda","Parabhakti dāsa","APP.FELICITASMUNDI/piatti/anima-vagabonda.jpg"]];
var STAMPA_O=[["Kit fiera","2500 volantini A5 · 1 roll-up · 2 striscioni · 30 maglie","casa/kit-volantino.jpg","stampa-kit-fiera.html"],["Carta stampata","volantini, manifesti, locandine, biglietti da visita","stampa/volantino.jpg?v=10132030","stampa-carta-stampata.html"],["Esposizione e fiere","totem, roll-up, striscioni, stand","stampa/rollup.jpg?v=10132030","stampa-esposizione-fiere.html"]];
function cartaO(t,sotto,img,link){return '<a href="'+esc(link)+'"'+(img?'':' class="senza"')+'>'+(img?'<img src="'+esc(img)+'" alt="" loading="lazy">':'')+'<span class="tt"><b>'+esc(t)+'</b>'+(sotto?'<small>'+esc(sotto)+'</small>':'')+'</span></a>';}
function fotoProdotto(f){f=String(f||"");if(/^https:\/\//.test(f))return f;if(f&&f.indexOf("/")<0)return "APP.FELICITASMUNDI/piatti/"+f;return "";}
function prezzoServizio(x){return x.dono?"in dono":(x.prezzo_euro!=null?x.prezzo_euro+" €":"");}
function fileOggi(){
  function metti(id,h){var e=$("#fila-"+id);if(!e)return;e.innerHTML=h;if(!h)e.style.display="none";}
  var emp=STANZE_O[0][1],ass=STANZE_O[2][1],scu=STANZE_O[3][1];
  metti("stampa",STAMPA_O.map(function(x){return cartaO(x[0],x[1],x[2],x[3]);}).join(""));
  if(!db){metti("emporio",EMP_FISSI.map(function(x){return cartaO(x[0],x[1],x[2],emp);}).join(""));metti("assistenza","");metti("scuola","");return;}
  db.from("prodotti").select("id,nome,autore,foto,prezzo,si_compra,creato_il").eq("stato","pubblico").order("creato_il",{ascending:false}).limit(2).then(function(r){
    var l=(r&&!r.error&&r.data)||[];
    metti("emporio",l.length?l.map(function(p){return cartaO(p.nome||"",(p.si_compra===false?"richiedi al responsabile":(p.prezzo?p.prezzo+" €":""))||p.autore||"",fotoProdotto(p.foto),emp);}).join(""):
      EMP_FISSI.map(function(x){return cartaO(x[0],x[1],x[2],emp);}).join(""));
  },function(){metti("emporio",EMP_FISSI.map(function(x){return cartaO(x[0],x[1],x[2],emp);}).join(""));});
  db.from("servizi").select("id,titolo,tipo,durata_minuti,a_distanza,prezzo_euro,dono,creato_il").eq("attivo",true).order("creato_il",{ascending:false}).limit(20).then(function(r){
    var l=(r&&!r.error&&r.data)||[];
    var a=l.filter(function(x){return ["assistenza_spirituale","consulenza","percorso"].indexOf(x.tipo)>=0;}).slice(0,3),s=l.filter(function(x){return x.tipo==="formazione";}).slice(0,3);
    metti("assistenza",a.map(function(x){return cartaO(x.titolo||"",[prezzoServizio(x),x.a_distanza?"a distanza":""].filter(Boolean).join(" · "),"",ass);}).join(""));
    metti("scuola",s.map(function(x){return cartaO(x.titolo||"",[x.a_distanza?"online":"dal vivo",prezzoServizio(x)].filter(Boolean).join(" · "),"",scu);}).join(""));
  },function(){metti("assistenza","");metti("scuola","");});
}
/* I compiti presi da chi entra, con a che punto sono (Gab 18:05). Una riga per compito; il quadro intero sta in Obiettivi. */
