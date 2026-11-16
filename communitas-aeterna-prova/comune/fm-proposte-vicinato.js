/* FM · PROPOSTE DI VICINATO COME CARD nel team «I Vicinati del Cibo» (16/11/2026, SQL 283).
   Gab 16/11 10:48: «le devi rendere visibili su vicinati del cibo, come card.. nella stessa maniera in cui sono visibili i prodotti»
   10:50 «tutti possono vedere sia proposte di vicinato sia proposte di prodotti» · 10:51 «solo ruoli e nucleo possono rispondere».
   Le dati li decide il database (fm_proposte_vicinato): telefono e «Sei già in connessione…» solo a ruoli e nucleo.
   Si chiama da vTeam: window.fmProposteVicinato(db, teamId) disegna in #tc-pv. */
(function(){
  var CSS='#tc-pv:empty{display:none}#tc-pv{margin:10px 0 0;display:grid;gap:10px}'+
  '.pv-et{font:500 13px "DM Sans",system-ui,sans-serif;letter-spacing:.2em;color:#D4AF6A;display:flex;align-items:center;gap:8px;margin:4px 0 0;cursor:pointer;background:none;border:0;padding:0;text-align:left}'+
  '.pv-et .n{background:#D4AF6A;color:#0a1430;border-radius:10px;padding:1px 9px;font-weight:700;letter-spacing:0}'+
  '.pv-lista{display:flex;gap:12px;overflow-x:auto;scroll-snap-type:x mandatory;padding-bottom:6px}'+
  '.pv-card{flex:0 0 min(88%,420px);scroll-snap-align:start;border:1px solid rgba(212,175,106,.45);border-radius:16px;background:#1a2148;padding:16px;display:flex;flex-direction:column;gap:8px;color:#F5F0E6;font:400 16px/1.4 "DM Sans",system-ui,sans-serif}'+
  '.pv-card h3{margin:0;font-size:20px;font-weight:700}.pv-sub{color:#c9c2b3;font-size:15px}'+
  '.pv-tag{display:flex;flex-wrap:wrap;gap:6px}.pv-tag span{border:1px solid #D4AF6A;color:#D4AF6A;border-radius:12px;padding:2px 9px;font-size:13px}'+
  '.pv-r{border-top:1px solid rgba(212,175,106,.25);padding-top:7px;overflow-wrap:anywhere;white-space:pre-wrap}.pv-r b{display:block;color:#D4AF6A;font-weight:500;font-size:13px;letter-spacing:.03em;white-space:normal}'+
  '.pv-ris{background:#0a1430;border-radius:12px;padding:8px 10px;white-space:pre-wrap;overflow-wrap:anywhere}.pv-ris small{display:block;color:#c9c2b3;font-size:12px}'+
  '.pv-card textarea{font:inherit;color:#F5F0E6;background:#0a1430;border:1px solid rgba(212,175,106,.45);border-radius:12px;padding:10px;min-height:70px;resize:vertical;width:100%;box-sizing:border-box}'+
  '.pv-card button.pv-manda{font:700 16px "DM Sans",system-ui,sans-serif;background:#D4AF6A;color:#0a1430;border:0;border-radius:999px;padding:12px;cursor:pointer}'+
  '.pv-esito{color:#c9c2b3;font-size:14px;min-height:1em}';
  var ZONA=[['ritiro','Punto di ritiro'],['magazzino','Magazzino'],['mensa','Mensa'],['produttori','Produttori'],['operatori','Operatori'],['studio','Luoghi di studio e di cultura'],['assistenza','Assistenza comunitaria integrata']];
  function esc(t){return String(t==null?"":t).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];});}
  function riga(et,v){return v?'<div class="pv-r"><b>'+esc(et)+'</b>'+esc(v)+'</div>':'';}
  function quando(d){try{return new Date(d).toLocaleString("it-IT",{dateStyle:"short",timeStyle:"short"});}catch(e){return "";}}
  function card(a,rispondo){
    var z=ZONA.map(function(x){return riga(x[1],a.zona&&a.zona[x[0]]);}).join("");
    var ris=(a.risposte||[]).map(function(r){return '<div class="pv-ris"><small>'+esc(r.chi)+' · '+esc(quando(r.il))+'</small>'+esc(r.testo)+'</div>';}).join("");
    return '<div class="pv-card" data-pv="'+esc(a.id)+'"><h3>'+esc(a.dove)+'</h3>'+
      '<div class="pv-sub">'+esc(a.nome)+(a.vicinato?' · '+esc(a.vicinato):'')+' · '+esc(quando(a.il))+'</div>'+
      '<div class="pv-tag"><span>'+(a.modo==="mio"?"Aderisco col vicinato in cui vivo":"Mi propongo per entrare in un vicinato")+'</span>'+
        '<span>'+(a.gruppo?"C'è già un gruppo":"Sono solo a proporre")+'</span>'+(a.laboratorio?'<span>Laboratorio di attivazione</span>':'')+'</div>'+
      riga("Telefono",a.telefono)+riga("Sei già in connessione con altri amici di Felicitas?",a.amici)+
      riga("Due righe su di te",a.chi)+riga("Chi c'è nel gruppo",a.nomi_gruppo)+z+riga("Altro che vuoi dirci",a.note)+ris+
      (rispondo?'<textarea aria-label="Risposta" maxlength="2000"></textarea><button type="button" class="pv-manda">Rispondi</button><p class="pv-esito" aria-live="polite"></p>':'')+
      '</div>';
  }
  window.fmProposteVicinato=function(db,teamId){
    if(!db||!teamId)return;
    if(!document.getElementById("pv-css")){var s=document.createElement("style");s.id="pv-css";s.textContent=CSS;document.head.appendChild(s);}
    function disegna(){
      db.rpc("fm_proposte_vicinato",{p_team:teamId}).then(function(r){
        var box=document.getElementById("tc-pv");if(!box)return;
        var d=r&&!r.error&&r.data;var l=(d&&d.proposte)||[];
        if(!l.length){box.innerHTML="";return;}
        box.innerHTML='<p class="pv-et">PROPOSTE DI VICINATO <span class="n">'+l.length+'</span></p><div class="pv-lista">'+l.map(function(a){return card(a,d.rispondo);}).join("")+'</div>';
        box.querySelectorAll(".pv-manda").forEach(function(b){b.onclick=function(){
          var c=b.closest("[data-pv]"),ta=c.querySelector("textarea"),es=c.querySelector(".pv-esito"),t=ta.value.trim();
          if(!t){es.textContent="Scrivi la risposta.";return;}
          b.disabled=true;es.textContent="Un momento…";
          db.rpc("fm_rispondi_proposta_vicinato",{p_id:c.getAttribute("data-pv"),p_testo:t}).then(function(x){b.disabled=false;
            if(x.error){es.textContent="Non è stata mandata. Si può riprovare.";return;}
            if(x.data!=="ok"){es.textContent=x.data||"Non è stata mandata. Si può riprovare.";return;}
            disegna();},function(){b.disabled=false;es.textContent="Non è stata mandata. Si può riprovare.";});};});
      },function(){});
    }
    disegna();
  };
})();
