/* AZIONE · 29/10/2026, SQL 128 (thread «Chat interna dei team in Azione»; disegno azione-chat/bozza-azione, Gab 28/10: «Comunque per me va bene / fai sql e pubblichiamo»;
   29/10 07:52: «voglio che rendi operative le info chat, oggi attivo il team festival»).
   Sopra i team dove sei (fm_miei_team: il team base «Praticantato» per primo), sotto le azioni: per tutti Emporio, Assistenza comunitaria integrata, Stampa;
   per chi ha il ruolo Scrivi un articolo e Crea diretta, che aprono i moduli del Megafono. Festival e Prenota non stanno in Azione (Gab 28/10).
   Senza l'SQL 128 l'elenco dei team non compare. */
var ICO_AZ={
  emporio:'<svg viewBox="0 0 60 60" fill="none" stroke="#4488BB" stroke-width="2.2" stroke-linejoin="round" aria-hidden="true"><path d="M30 6l21 12v24L30 54 9 42V18z"/><path d="M30 6L18 30h24zM18 30L9 18M42 30l9-12M18 30l12 24 12-24M18 30L9 42M42 30l9 12"/></svg>',
  mutuo:'<svg viewBox="0 0 60 60" fill="none" stroke="#CC6644" stroke-width="2.2" stroke-linejoin="round" aria-hidden="true"><path d="M30 8l24 42H6z"/><path d="M30 8l-6 42M30 8l6 42"/></svg>',
  stampa:'<svg viewBox="0 0 60 60" fill="none" stroke="#669944" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M18 22V10h24v12"/><path d="M10 22h40v18H10z"/><path d="M18 34h24v16H18z"/></svg>',
  articolo:'<svg viewBox="0 0 60 60" fill="none" stroke="#D4AF6A" stroke-width="2.2" stroke-linejoin="round" aria-hidden="true"><path d="M30 6l20 24-20 24-20-24z"/><path d="M10 30h40M30 6l-8 24 8 24 8-24z"/></svg>',
  diretta:'<svg viewBox="0 0 60 60" fill="none" stroke="#D4AF6A" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="30" cy="30" r="5"/><path d="M19 19a16 16 0 0 0 0 22M41 19a16 16 0 0 1 0 22M12 12a26 26 0 0 0 0 36M48 12a26 26 0 0 1 0 36"/></svg>',
  cassa:'<svg viewBox="0 0 60 60" fill="none" stroke="#4488BB" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 14v32M14 14v32M20 14v32M26 14v32M34 14v32M40 14v32M46 14v32M52 14v32" stroke-width="2.6"/><path d="M4 30h52" stroke="#D4AF6A"/></svg>',
  persona:'<svg viewBox="0 0 60 60" fill="none" stroke="#E8C77A" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="30" cy="20" r="9"/><path d="M12 52c2-11 9-17 18-17s16 6 18 17"/><path d="M46 10v12M40 16h12"/></svg>',
  foto:'<svg width="26" height="26" viewBox="0 0 60 60" fill="none" stroke="#D4AF6A" stroke-width="3" stroke-linecap="round" aria-hidden="true"><path d="M8 18h12l4-6h12l4 6h12v30H8z"/><circle cx="30" cy="32" r="9"/></svg>',
  vocale:'<svg viewBox="0 0 60 60" fill="none" stroke="#D4AF6A" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><rect x="22" y="8" width="16" height="28" rx="8"/><path d="M14 30a16 16 0 0 0 32 0M30 46v8M22 54h16"/></svg>',
  file:'<svg viewBox="0 0 60 60" fill="none" stroke="#D4AF6A" stroke-width="2.6" stroke-linejoin="round" aria-hidden="true"><path d="M16 6h20l10 10v38H16z"/><path d="M36 6v10h10M22 28h16M22 36h16M22 44h10"/></svg>',
  posizione:'<svg viewBox="0 0 60 60" fill="none" stroke="#D4AF6A" stroke-width="2.6" stroke-linejoin="round" aria-hidden="true"><path d="M30 54S12 36 12 24a18 18 0 0 1 36 0c0 12-18 30-18 30z"/><circle cx="30" cy="24" r="6"/></svg>'
};
var team={lista:null,chat:null,tipo:"team",id:null,sub:null,timer:null,letto:0,msg:[],prop:{},url:{},scelto:null,dal:null,foglio:null,rec:null};
function teamFerma(){
  try{if(team.sub&&db.removeChannel)db.removeChannel(team.sub);}catch(e){}
  if(team.timer)clearInterval(team.timer);
  try{if(team.rec&&team.rec.state!=="inactive"){team.rec.annulla=true;team.rec.stop();}}catch(e){}
  team.sub=null;team.timer=null;team.scelto=null;team.dal=null;team.foglio=null;team.rec=null;
}
/* i numerini sull'icona dell'app (SQL 129): messaggi non letti e richieste di chat in attesa. Funziona dove il telefono lo permette (app installata). */
function numerini(){
  if(!io.id||!db||!("setAppBadge" in navigator))return;
  db.rpc("fm_non_letti_totale").then(function(r){if(!r||r.error)return;var n=+r.data||0;
    try{if(n>0)navigator.setAppBadge(n);else navigator.clearAppBadge();}catch(e){}},function(){});
}
document.addEventListener("visibilitychange",function(){if(document.visibilityState==="visible")numerini();});
function giornoRoma(t){return new Date(t).toLocaleDateString("it-IT",{timeZone:"Europe/Rome"});}
function quandoTm(t){
  var d=new Date(t),ora=new Date(),ieri=new Date(ora.getTime()-864e5);
  if(giornoRoma(d)===giornoRoma(ora))return hhmm(t);
  if(giornoRoma(d)===giornoRoma(ieri))return "ieri";
  if(ora-d<6*864e5)return d.toLocaleDateString("it-IT",{weekday:"short",timeZone:"Europe/Rome"}).replace(".","");
  return d.toLocaleDateString("it-IT",{day:"numeric",month:"short",timeZone:"Europe/Rome"}).replace(".","");
}
function giornoTm(t){
  var d=new Date(t),ora=new Date();
  if(giornoRoma(d)===giornoRoma(ora))return "oggi";
  if(giornoRoma(d)===giornoRoma(new Date(ora.getTime()-864e5)))return "ieri";
  return d.toLocaleDateString("it-IT",{weekday:"long",day:"numeric",month:"long",timeZone:"Europe/Rome"});
}
function iniziale(n){return (String(n||"").trim().charAt(0)||"·").toUpperCase();}
