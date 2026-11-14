/* RUOLI · cambiare un ruolo in un passo, e scrivere cosa fa chi lo ha (SQL 90) */
function regRuoliExtra(box){
  if(!box)return;
  box.querySelectorAll("[data-chiudi-r]").forEach(function(b){
    var s=document.createElement("select");s.className="rg-cambia";s.setAttribute("aria-label","Cambia ruolo");
    s.innerHTML='<option value="">cambia in…</option>'+regTuttiRuoli().map(function(r){return '<option value="'+esc(r[0]+":"+r[1])+'">'+esc(r[2])+'</option>';}).join("");
    s.onchange=function(){if(!s.value)return;var p=s.value.split(":");s.disabled=true;
      db.rpc("fm_ruolo_cambia",{p_ruolo:b.getAttribute("data-chiudi-r"),p_funzione:p[0],p_nuovo:p[1]}).then(function(r){s.disabled=false;
        if(r&&r.error)return mostra("#r-ok",/fm_ruolo_cambia|function/i.test(r.error.message||"")?"Si apre con l'SQL 90.":errore(r.error),true);
        if(r.data!=="ok")return mostra("#r-ok",r.data,true);
        reg.cosaFa=null;vRuoli();},function(){s.disabled=false;});};
    var w=document.createElement("div");w.className="rg-az";b.parentNode.insertBefore(w,b);w.appendChild(s);w.appendChild(b);
  });
  var k=document.createElement("div");k.className="card modulo";k.style.marginTop="10px";
  k.innerHTML='<b>Cosa fa chi ha il ruolo</b><label>Ruolo<select id="cf-r">'+regTuttiRuoli().map(function(r){return '<option value="'+esc(r[0]+":"+r[1])+'">'+esc(r[2])+'</option>';}).join("")+'</select></label>'+
    '<label>Cosa fa<textarea id="cf-t" maxlength="2000" style="min-height:70px"></textarea></label><div class="azioni"><button class="btn pieno" id="cf-salva">Salva</button></div><div class="toast" id="cf-ok" hidden></div>';
  box.appendChild(k);
  function carica(){var p=val("cf-r").split(":"),c=(reg.cosaFa||[]).filter(function(x){return x.funzione===p[0]&&x.ruolo===p[1];})[0];$("#cf-t").value=c?c.cosa_fa:"";}
  (reg.cosaFa?Promise.resolve(reg.cosaFa):db.from("ruoli_cosa_fa").select("funzione,ruolo,cosa_fa").then(function(r){if(r&&r.error){k.remove();return null;}reg.cosaFa=r.data||[];return reg.cosaFa;},function(){k.remove();return null;})).then(function(x){if(x)carica();});
  $("#cf-r").onchange=carica;
  $("#cf-salva").onclick=function(){var p=val("cf-r").split(":"),t=val("cf-t");if(!t)return mostra("#cf-ok","Scrivi cosa fa.",true);var b=this;b.disabled=true;
    db.from("ruoli_cosa_fa").upsert({funzione:p[0],ruolo:p[1],cosa_fa:t,scritto_da:io.id,scritto_il:new Date().toISOString()}).then(function(r){b.disabled=false;
      if(r&&r.error)return mostra("#cf-ok",errore(r.error),true);reg.cosaFa=null;mostra("#cf-ok","Salvato.");},function(e){b.disabled=false;mostra("#cf-ok",errore(e),true);});};
}

