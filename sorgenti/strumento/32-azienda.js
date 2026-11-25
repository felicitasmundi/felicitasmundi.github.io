/* AZIENDA · aggiungere una persona del team (SQL 80): la aggiunge il referente o il nucleo, con la mail con cui è entrata */
function aziendaAggiungi(az){
  var box=$("#az-aggiungi");if(!box)return;
  box.innerHTML='<label class="m" for="az-mail">Mail della persona (deve essere già entrata)</label><input type="email" id="az-mail">'+
    '<label class="m" for="az-ruolo" style="margin-top:6px">Ruolo</label><select id="az-ruolo"><option value="team">team</option><option value="referente">referente</option></select>'+
    '<div class="azioni" style="margin-top:8px"><button class="btn pieno" id="az-agg">Aggiungi</button><span class="m" id="az-agg-esito"></span></div>';
  $("#az-agg").onclick=function(){var b=this,m=$("#az-mail").value.trim();if(!m)return;b.disabled=true;
    db.rpc("fm_azienda_aggiungi",{p_azienda:az,p_mail:m,p_ruolo:$("#az-ruolo").value}).then(function(r){b.disabled=false;
      if(r&&r.error){$("#az-agg-esito").textContent=errore(r.error);return;}
      if(r.data!=="ok"){$("#az-agg-esito").textContent=r.data;return;}
      vCerchio();},function(){b.disabled=false;});};
}
