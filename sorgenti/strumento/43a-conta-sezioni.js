/* CONTA LE SEZIONI E I CONTENUTI DEL GIORNALE · 26/11/2026 (SQL 326, thread «Contare letture e ingressi»).
   Gab: «Mi fai sapere se il giornale la mattina lo leggono anche quelli di Karma Yoga e Ruoli?» · «In giornale voglio anche i contenuti come i link video inseriti».
   Solo conteggi: dal telefono parte il nome della sezione o del video/link, mai chi sei; il livello lo decide il database.
   Una volta per sezione (e per contenuto) per fascia del giorno e per sessione del browser: ricaricare non gonfia i numeri. */
(function(){
  function fascia(){var h=+new Date().toLocaleString("en-GB",{timeZone:"Europe/Rome",hour:"2-digit",hour12:false})%24;return h>=5&&h<12?"m":h>=12&&h<18?"p":"s";}
  function unaVolta(k){try{if(sessionStorage.getItem(k))return false;sessionStorage.setItem(k,"1");}catch(e){}return true;}
  function conta(tipo,cosa){cosa=String(cosa||"").replace(/\s+/g," ").trim().slice(0,80);if(!db||!cosa)return;
    if(!unaVolta("fm-liv:"+tipo+":"+cosa+":"+fascia()+":"+(io.id||"")))return;
    try{db.rpc("fm_conta_livello",{p_tipo:tipo,p_cosa:cosa}).then(function(){},function(){});}catch(e){}}
  window.fmContaLivello=conta;

  /* le sezioni: ogni volta che cambia quella sullo schermo */
  var ultima=null,prima=disegna;
  disegna=function(){var r=prima.apply(this,arguments);if(vista!==ultima){ultima=vista;conta("sezione",vista);}return r;};

  /* nel Giornale: i video che partono e i link che si aprono */
  function nomeLink(a){var t=(a.textContent||"").replace(/\s+/g," ").trim();if(t)return t;try{return new URL(a.href,location.href).hostname;}catch(e){return "link";}}
  document.addEventListener("click",function(ev){
    if(vista!=="giornale")return;var c=$("#corpo");if(!c||!ev.target.closest||!c.contains(ev.target))return;
    var yt=ev.target.closest("button.yt[data-yt]");
    if(yt){var t=yt.nextElementSibling,tit=t&&t.classList.contains("yt-tit")?(t.textContent||"").trim():"";conta("contenuto",tit||("Video "+yt.getAttribute("data-yt")));return;}
    var a=ev.target.closest("a[href]");if(!a)return;var h=a.getAttribute("href")||"";
    if(!h||h.charAt(0)==="#"||/^javascript:/i.test(h))return;
    conta("contenuto",nomeLink(a));
  },true);
  /* i video già nella pagina (l'intervista, le due animazioni): il tocco entra nel video e la pagina perde il fuoco */
  window.addEventListener("blur",function(){setTimeout(function(){
    var f=document.activeElement;if(vista!=="giornale"||!f||f.tagName!=="IFRAME")return;var c=$("#corpo");if(!c||!c.contains(f))return;
    conta("contenuto",f.getAttribute("title")&&f.getAttribute("title")!=="video"?f.getAttribute("title"):"Video del Giornale");
  },0);});
})();

