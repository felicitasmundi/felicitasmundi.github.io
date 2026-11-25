
(function(){
"use strict";
var URL_SB="https://gfnveesogkfvkrdudpfg.supabase.co", KEY="sb_publishable_4_kJlYwWuqsahMBw7Um2mg_lsYH9ogU";
var VILLAGGIO="5839d11d-9901-49bb-9b2f-f94236bbe2a1";
var db=(window.supabase&&supabase.createClient)?supabase.createClient(URL_SB,KEY,{auth:{flowType:"implicit"}}):null;
var ENTRA="accesso.html?torna="+encodeURIComponent("strumento.html");

function $(s){return document.querySelector(s);}
function esc(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];});}
function hhmm(t){return new Date(t).toLocaleTimeString("it-IT",{hour:"2-digit",minute:"2-digit",timeZone:"Europe/Rome"});}
function oggiISO(){var d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");}

var FUNZIONI={tecnologica:"Tecnologia",logistica:"Logistica",comunitaria:"Comunità"};
/* 19 ott 23:48, Gab: «logistica ok emporio magazzino produttori eventi / tecnologia piattaforma giornale radio gestionale / comunità vicinati e villaggi, formazione ed assistenza comunitaria integrata» (SQL 84)
   Settimanale 19 ott: «Alla tecnologia va aggiunta anche la voce sicurezza» · «economia sia da mettere nell'aspetto comunità» · 23:34: «contabilità mettila in logistica» (SQL 85) */
/* 22 ott, Gab: «queste voci sulle 3 tipologie sono da inserire nel cervello … per organizzare le risorse umane» · «eventi e festival è giusto stiano in logistica» (SQL 108) */
var RUOLI={tecnologica:[["attivazione","Installazione e attivazione del Cervello Digitale Evoluto"],["sicurezza","Sicurezza e dati"],["formazione_app","Formazione all'uso dell'app"],["sviluppo_piattaforma","Sviluppo piattaforma"]],
  logistica:[["produttori","Produttori"],["magazzino","Punti di ritiro e magazzino"],["trasporto","Trasporto"],["progettazione","Progettazione e sviluppo"],["emporio","Emporio e ordini"],["contabilita","Contabilità"],["eventi","Eventi e Festival"],["cucina","Cucina"]],
  comunitaria:[["villaggio","Coordinatore di villaggio"],["vicinati","Coordinatori di vicinato"],["formazioni","Formazione e scuola"],["economia","Economia"],["assistenza","Assistenza comunitaria integrata"],["edizione","Edizione e programmazione"]]};
function nomeRuolo(f,r){var x=(RUOLI[f]||[]).filter(function(y){return y[0]===r;})[0];return x?x[1]:r;}
var VIS={solo_me:"solo io",vicinato:"il vicinato",pubblico:"tutti"};
/* 19 ott 16:14, Gab: «oggi è rischioso usare pubblicamente il nome degli elementi in cartelle, meglio tenerlo per il praticantato» → si vedono i nomi delle stanze; nel database restano terra, acqua, fuoco, aria, etere */
var ELEMENTI=[["terra","Vicinati"],["acqua","Emporio"],["fuoco","Assistenza"],["aria","Stampa"],["etere","Scuola"]];
var STADI={in_coda:"da fare",in_avanzamento:"in corso",sviluppato:"fatto"};
var DOPO={in_coda:"in_avanzamento",in_avanzamento:"sviluppato",sviluppato:"in_coda"};
var TIPI_G=["karma_yoga","articolo","festa","diretta","obiettivo","antakarana"];
var TIPO_NOME={karma_yoga:"dono · scambio",articolo:"articolo",festa:"festa",diretta:"diretta",obiettivo:"obiettivo",antakarana:"a tutti"};

/* chi guarda */
var io={id:null,nome:"",grado:"ospite",nucleo:false,coordina:false,ruoli:[]};
var vista="azione", giorno=0;
var nomi={};

function errore(e){
  var m=String((e&&e.message)||e||"");
  if(/karma yoga/i.test(m))return "Per prendere un obiettivo si passa dal karma yoga: apri «Come funziona» nel Praticantato.";
  if(/non è aperto adesso/i.test(m))return "Questo tipo si apre con il praticantato: per ora scegli Dono · scambio.";
  if(/row-level security|permission denied|not allowed/i.test(m))return "Con questo accesso non si può: lo fa chi ne ha il permesso.";
  if(/too large|payload|25/i.test(m)&&/file|size|large/i.test(m))return "Il file supera i 25 MB.";
  if(/orme_link_con_didascalia/.test(m))return "Scrivi una didascalia insieme al link.";
  if(/JWT|session|auth/i.test(m))return "L'accesso è scaduto: entra di nuovo.";
  return "Non è stato salvato. Si può riprovare."+(m?" ("+m.slice(0,90)+")":"");
}
function mostra(sel,t,err){var el=$(sel);if(!el)return;el.textContent=t;el.hidden=!t;el.classList.toggle("err",!!err);}

/* nomi delle persone, dalla vista aperta */
function leggiNomi(ids){
  ids=ids.filter(function(x,i,a){return x&&a.indexOf(x)===i&&!(x in nomi);});
  if(!ids.length||!db)return Promise.resolve();
  return db.from("persone_pubbliche").select("id,nome").in("id",ids).then(function(r){
    (r.data||[]).forEach(function(p){nomi[p.id]=p.nome||"";});
    ids.forEach(function(id){if(!(id in nomi))nomi[id]="";});
  }).catch(function(){});
}

/* YouTube e link */
function ytId(u){var m=String(u||"").match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);return m?m[1]:null;}
function primoLink(t){return (String(t||"").match(/https:\/\/[^\s<>"]+/)||[])[0]||null;}
/* ═══ Anteprima dei link · 1 novembre 2026 · thread «Capire il Company brain con i team» ═══
   Gab 1/11 13:14-13:15: «trova modo di far vedere anteprima link (quindi un immagine di riferimento con descrizione e titolo link»
   · «questo deve valere per ogni link in ogni chat, deve sempre vedersi qualcosa di piu d un url incollato».
   Ogni link diventa una scheda: subito il nome del sito; poi titolo, descrizione e immagine dalla tavola link_anteprime (SQL 147),
   e quelli mai letti li chiede alla funzione «link-info». Un osservatore riempie le schede ovunque compaiano. */
var LK_CSS='.lk{display:flex;flex-direction:column;margin:8px 0 2px;border:1px solid rgba(212,175,106,.45);border-radius:14px;overflow:hidden;text-decoration:none;color:#F5F0E6;background:#1a2148;max-width:420px}'+
'.lk-img{display:block;aspect-ratio:1.91/1;max-width:100%;background:#122050;overflow:hidden}.lk-img img{width:100%;height:100%;object-fit:cover;display:block}'+
'.lk-c{display:flex;flex-direction:column;gap:3px;padding:10px 12px}'+
'.lk-sito{font-size:13px;letter-spacing:.1em;text-transform:uppercase;color:#D4AF6A}'+
'.lk-tit{font-size:17px;font-weight:600;line-height:1.3;overflow-wrap:anywhere}'+
'.lk-des{font-size:15px;line-height:1.35;color:rgba(245,240,230,.75);display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}';
document.head.insertAdjacentHTML("beforeend","<style>"+LK_CSS+"</style>");
function lkSito(u){try{return new URL(u).hostname.replace(/^www\./,"");}catch(_){return "";}}
function anteprimaLink(u){
  if(!u||!/^https:\/\//.test(u))return "";
  var s=lkSito(u),r=u.replace(/^https:\/\/(www\.)?/,"").replace(/\/$/,"");
  return '<a class="lk" data-lk="'+esc(u)+'" href="'+esc(u)+'" target="_blank" rel="noopener noreferrer">'+
    '<span class="lk-img" hidden><img alt="" loading="lazy"></span>'+
    '<span class="lk-c"><span class="lk-sito">'+esc(s)+'</span><span class="lk-tit">'+esc(r.length>70?r.slice(0,70)+"…":r)+'</span><span class="lk-des" hidden></span></span></a>';
}
/* il testo di un messaggio: il link esce dal testo e diventa la scheda */
function testoLink(t,cls,tag){
  t=String(t||"");var u=primoLink(t),resto=u?t.replace(u,"").replace(/[ \t]+/g," ").trim():t;tag=tag||"div";
  return (resto?'<'+tag+' class="'+(cls||"t")+'">'+esc(resto)+'</'+tag+'>':'')+(u?anteprimaLink(u):'');
}
var lkCache={},lkInVolo={};
function lkMetti(a,x){
  if(!x)return;a.setAttribute("data-lk-ok","1");
  if(x.titolo){a.querySelector(".lk-tit").textContent=x.titolo;}
  if(x.sito){a.querySelector(".lk-sito").textContent=x.sito;}
  if(x.descrizione){var d=a.querySelector(".lk-des");d.textContent=x.descrizione;d.hidden=false;}
  if(x.immagine){var b=a.querySelector(".lk-img"),im=b.querySelector("img");im.onerror=function(){b.hidden=true;};im.src=x.immagine;b.hidden=false;}
}
function lkRiempi(){
  if(typeof db==="undefined"||!db)return;
  var el=[].slice.call(document.querySelectorAll("a.lk[data-lk]:not([data-lk-ok])"));if(!el.length)return;
  var serve=[];
  el.forEach(function(a){var u=a.getAttribute("data-lk");if(lkCache[u])lkMetti(a,lkCache[u]);else if(!lkInVolo[u]&&serve.indexOf(u)<0)serve.push(u);});
  if(!serve.length)return;
  serve=serve.slice(0,30);serve.forEach(function(u){lkInVolo[u]=1;});
  function metti(l){(l||[]).forEach(function(x){lkCache[x.url]=x;});
    document.querySelectorAll("a.lk[data-lk]:not([data-lk-ok])").forEach(function(a){var x=lkCache[a.getAttribute("data-lk")];if(x)lkMetti(a,x);});}
  db.from("link_anteprime").select("url,titolo,descrizione,immagine,sito").in("url",serve).then(function(r){
    var l=(r&&!r.error&&r.data)||[];metti(l);
    var mancano=serve.filter(function(u){return !lkCache[u];});
    for(var i=0;i<mancano.length;i+=10)(function(g){
      db.functions.invoke("link-info",{body:{urls:g}}).then(function(r){metti(r&&r.data&&r.data.anteprime);},function(){});
    })(mancano.slice(i,i+10));
  },function(){});
}
var lkTimer=null;
new MutationObserver(function(){if(lkTimer)return;lkTimer=setTimeout(function(){lkTimer=null;lkRiempi();},250);})
  .observe(document.body||document.documentElement,{childList:true,subtree:true});

function linkHTML(u){
  if(!u||!/^https:\/\//.test(u))return "";
  var y=ytId(u);
  /* 21 ott 09:14, Gab: «se mettiamo un video di YouTube, almeno prendiamo il titolo, l'anteprima della foto». L'anteprima viene dal video; titolo e canale dall'SQL 98 (funzione youtube-info). Il lettore si apre al tocco. */
  if(y)return '<button type="button" class="video yt" data-yt="'+y+'" aria-label="Guarda il video"><img src="https://i.ytimg.com/vi/'+y+'/hqdefault.jpg" alt="" loading="lazy" onerror="this.remove()"><span class="yt-play" aria-hidden="true">▶</span></button><p class="yt-tit" data-yt-link="'+esc(u)+'" hidden></p>';
  return anteprimaLink(u);
}

document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("button.yt[data-yt]");if(!b)return;
  var f=document.createElement("div");f.className="video";
  f.innerHTML='<iframe src="https://www.youtube-nocookie.com/embed/'+b.getAttribute("data-yt")+'?autoplay=1" title="video" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen></iframe>';b.replaceWith(f);});
var ytInfo={};
function ytTitoli(){
  if(!db)return;
  var el=[].slice.call(document.querySelectorAll("p.yt-tit[hidden]:not([data-chiesto])"));if(!el.length)return;
  function metti(){document.querySelectorAll("p.yt-tit[hidden]").forEach(function(p){var x=ytInfo[p.getAttribute("data-yt-link")];if(x&&x.link_titolo){p.textContent=x.link_titolo+(x.link_canale?" · "+x.link_canale:"");p.hidden=false;}});}
  var manca=el.map(function(p){p.setAttribute("data-chiesto","1");return p.getAttribute("data-yt-link");}).filter(function(u,i,a){return !(u in ytInfo)&&a.indexOf(u)===i;});
  if(!manca.length)return metti();
  manca.forEach(function(u){ytInfo[u]=null;});
  /* senza l'SQL 98 la lettura non riesce e resta solo l'anteprima */
  db.from("orme").select("link,link_titolo,link_canale").in("link",manca).limit(100).then(function(r){((r&&!r.error&&r.data)||[]).forEach(function(x){if(x.link_titolo)ytInfo[x.link]=x;});metti();},function(){});
}
(function(){var t=null,c=document.getElementById("corpo");if(c&&window.MutationObserver)new MutationObserver(function(){clearTimeout(t);t=setTimeout(ytTitoli,250);}).observe(c,{childList:true,subtree:true});})();
function ytChiedi(orma){try{if(db&&db.functions)db.functions.invoke("youtube-info",{body:orma?{orma:orma}:{}}).then(function(){},function(){});}catch(e){}}

