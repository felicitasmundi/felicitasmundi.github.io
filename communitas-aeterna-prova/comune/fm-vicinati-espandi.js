/* FM · VICINATI IN ESPANDI (16/11/2026, SQL 287). Gab 16/11: «non ho nessun posto dove vedo tutti i vicinati attivati o in attivazione,
   con i dati all interno» · «li vedono tutti dal karma yoga in poi» · «ogni cosa va conessa nel cervello, e poi su espandi trovi il riflesso».
   Card scorrevoli con filtri Tutti / Attivati / In attivazione; «Attivato» lo premono ruoli e nucleo; «Apri nel Cervello» porta alla voce
   Comunità › Villaggi e vicinati. Cosa si vede lo decide il database (fm_vicinati_tutti): telefono solo a ruoli e nucleo.
   Si chiama da vAzione: window.fmVicinatiEspandi(db) disegna in #esp-vic e mostra #esp-vic-s solo se ci sono vicinati. */
(function(){
  var CSS='.vx-filtri{display:flex;gap:8px;flex-wrap:wrap;margin:8px 0 10px}.vx-filtri button{font:500 15px "DM Sans",system-ui,sans-serif;border:1px solid #D4AF6A;color:#D4AF6A;background:none;border-radius:999px;padding:6px 14px;cursor:pointer}'+
  '.vx-filtri button.on{background:#D4AF6A;color:#0a1430}'+
  '.vx-lista{display:flex;gap:12px;overflow-x:auto;scroll-snap-type:x mandatory;padding-bottom:6px}'+
  '.vx-card{flex:0 0 min(88%,420px);scroll-snap-align:start;border:1px solid rgba(212,175,106,.45);border-radius:16px;background:#121a3d;padding:16px;display:flex;flex-direction:column;gap:8px;color:#F5F0E6;font:400 16px/1.4 "DM Sans",system-ui,sans-serif}'+
  '.vx-card h3{margin:0;font-size:20px;font-weight:700}.vx-sub{color:#c9c2b3;font-size:15px}'+
  '.vx-st{align-self:flex-start;border-radius:12px;padding:2px 10px;font-size:13px;font-weight:700}.vx-st.att{background:#8DBF5E;color:#0a1430}.vx-st.in{border:1px solid #D4AF6A;color:#D4AF6A}'+
  '.vx-r{border-top:1px solid rgba(212,175,106,.25);padding-top:7px;overflow-wrap:anywhere;white-space:pre-wrap}.vx-r b{display:block;color:#D4AF6A;font-weight:500;font-size:13px;letter-spacing:.03em;white-space:normal}'+
  '.vx-card a.vx-cerv{color:#D4AF6A;font-weight:700;text-decoration:none}'+
  '.vx-card button.vx-att{font:700 16px "DM Sans",system-ui,sans-serif;background:#D4AF6A;color:#0a1430;border:0;border-radius:999px;padding:12px;cursor:pointer}'+
  '.vx-esito{color:#c9c2b3;font-size:14px;min-height:1em;margin:0}';
  var ZONA=[['ritiro','Punto di ritiro'],['magazzino','Magazzino'],['mensa','Mensa'],['produttori','Produttori'],['operatori','Operatori'],['studio','Luoghi di studio e di cultura'],['assistenza','Assistenza comunitaria integrata']];
  function esc(t){return String(t==null?"":t).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];});}
  /* SQL 290 · Gab 16/11: «di dove sono, l'orario in cui è stato scritto il messaggio e il giorno» */
  function quando(t){try{var d=new Date(t),z={timeZone:"Europe/Rome"};return d.toLocaleDateString("it-IT",Object.assign({weekday:"short",day:"2-digit",month:"2-digit"},z))+" · "+d.toLocaleTimeString("it-IT",Object.assign({hour:"2-digit",minute:"2-digit"},z));}catch(e){return "";}}
  function riga(et,v){return v?'<div class="vx-r"><b>'+esc(et)+'</b>'+esc(v)+'</div>':'';}
  function card(a,d){
    var att=a.stato==="attivato";
    return '<div class="vx-card" data-vx="'+esc(a.id)+'"><span class="vx-st '+(att?'att':'in')+'">'+(att?'Attivato':'In attivazione')+'</span>'+
      '<h3>'+esc(a.vicinato||a.dove)+'</h3><div class="vx-sub">'+esc((a.vicinato?a.dove+' · ':'')+a.nome+(a.luogo&&a.luogo!==a.dove?' · '+a.luogo:'')+(a.il?' · '+quando(a.il):''))+'</div>'+
      riga("Telefono",a.telefono)+riga("Sei già in connessione con altri amici di Felicitas?",a.amici)+
      riga("Due righe su di te",a.chi)+riga("Chi c'è nel gruppo",a.gruppo?a.nomi_gruppo:"")+
      ZONA.map(function(z){return riga(z[1],a.zona&&a.zona[z[0]]);}).join("")+
      riga("Laboratorio di attivazione del vicinato",a.laboratorio?"Sì":"")+riga("Altro che vuoi dirci",a.note)+
      (d.cervello?'<a class="vx-cerv" href="strumento.html?v=cervello&cap='+encodeURIComponent(d.cervello)+'">Apri nel Cervello ›</a>':'')+
      (d.rispondo&&!att?'<button type="button" class="vx-att">Attivato</button><p class="vx-esito" aria-live="polite"></p>':'')+'</div>';
  }
  window.fmVicinatiEspandi=function(db){
    if(!db)return;
    if(!document.getElementById("vx-css")){var s=document.createElement("style");s.id="vx-css";s.textContent=CSS;document.head.appendChild(s);}
    var filtro="tutti";
    function disegna(){
      db.rpc("fm_vicinati_tutti").then(function(r){
        var sez=document.getElementById("esp-vic-s"),box=document.getElementById("esp-vic");if(!sez||!box)return;
        var d=r&&!r.error&&r.data;var l=(d&&d.vicinati)||[];
        if(!l.length){sez.hidden=true;return;}
        var n=document.getElementById("esp-vic-n");if(n)n.textContent=l.length;
        var vis=l.filter(function(a){return filtro==="tutti"||(filtro==="attivati"?a.stato==="attivato":a.stato!=="attivato");});
        box.innerHTML='<div class="vx-filtri">'+[["tutti","Tutti"],["attivati","Attivati"],["in","In attivazione"]].map(function(f){
            return '<button type="button" data-vxf="'+f[0]+'"'+(filtro===f[0]?' class="on"':'')+'>'+f[1]+'</button>';}).join("")+'</div>'+
          (vis.length?'<div class="vx-lista">'+vis.map(function(a){return card(a,d);}).join("")+'</div>':'<p class="esp-d">Nessuno, per ora.</p>');
        sez.hidden=false;
        box.querySelectorAll("[data-vxf]").forEach(function(b){b.onclick=function(){filtro=b.getAttribute("data-vxf");disegna();};});
        box.querySelectorAll(".vx-att").forEach(function(b){b.onclick=function(){
          var c=b.closest("[data-vx]"),es=c.querySelector(".vx-esito");b.disabled=true;es.textContent="Un momento…";
          db.rpc("fm_vicinato_attivato",{p_id:c.getAttribute("data-vx")}).then(function(x){b.disabled=false;
            if(x.error){es.textContent="Non è stato salvato. Si può riprovare.";return;}
            if(x.data!=="ok"){es.textContent=x.data||"Non è stato salvato. Si può riprovare.";return;}
            disegna();},function(){b.disabled=false;es.textContent="Non è stato salvato. Si può riprovare.";});};});
      },function(){});
    }
    disegna();
  };
})();
