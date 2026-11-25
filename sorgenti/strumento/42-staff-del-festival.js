/* STAFF DEL FESTIVAL: solo il nucleo (SQL 116). 23 ott 13:54, Gab: «Ho bisogno della pagina per inserire le persone del festival e parlarne domenica».
   22 ott 21:54: un link d'invito per persona, col ruolo già dato. Il link vale una volta e solo con la mail scritta qui. */
function vStaff(box){
  var w=document.createElement("div");box.appendChild(w);
  w.innerHTML='<div class="card modulo" style="margin-top:14px">'+
    '<div id="st-lista"><p class="nota">Un momento…</p></div>'+
    '<label>Nome e cognome<input type="text" id="st-nome" autocomplete="off"></label>'+
    '<label>Numero di telefono<input type="tel" id="st-tel" autocomplete="off" inputmode="tel" placeholder="+39 …"></label>'+
    '<label>Mail (se ce l\'hai: allora il link vale solo con quella)<input type="email" id="st-mail" autocomplete="off" inputmode="email"></label>'+
    '<label>Villaggio<input type="text" id="st-vill" autocomplete="off"></label>'+
    '<label>Team<select id="st-team"><option value="">'+(io.nucleo?'Nessun team':'Scegli il team')+'</option></select></label>'+
    (io.nucleo?'':'<p class="nota" style="margin:6px 0 0">Il ruolo che scegli resta proposto: lo conferma il nucleo.</p>')+
    ruoliSceltaHTML("st-rr")+
    '<div class="azioni"><button class="btn pieno" id="st-crea">Crea il link</button></div><div class="toast" id="st-ok" hidden></div></div>';
  /* 7/11, Gab: «posso mandare un link a Riccardo e a tutti gli altri … col ruolo che si sta dando» → l'invito personale apre communitas-aeterna/invito-ruolo.html (ruolo con «cosa fa», spunte, Scarica l'app; SQL 186) */
  function link(c){return new URL("../communitas-aeterna/invito-ruolo.html?c="+encodeURIComponent(c),location.href).href;}
  function waNum(t){var d=String(t||"").replace(/[^0-9]/g,"");if(!d)return "";if(/^0039/.test(d))d=d.slice(2);if(/^39[0-9]{9,10}$/.test(d))return d;if(/^3/.test(d))return "39"+d;return d;}
  (io.nucleo?db.from("squadre").select("id,nome").order("nome").then(function(r){return (r&&!r.error&&r.data)||[];}):
    db.rpc("fm_miei_team").then(function(r){return ((r&&!r.error&&r.data)||[]).map(function(t){return {id:t.team_id,nome:t.nome};});})).then(function(l){
    var e=$("#st-team");if(!e)return;e.insertAdjacentHTML("beforeend",l.map(function(t){return '<option value="'+esc(t.id)+'">'+esc(t.nome)+'</option>';}).join(""));if(staffTeamPre){e.value=staffTeamPre;staffTeamPre=null;}},function(){});
  function lista(){
    db.from("inviti_staff").select("id,codice,nome,telefono,villaggio,funzione,ruolo,altri_ruoli,da_confermare,usato_il,annullato_il,creato_il").is("annullato_il",null).order("creato_il",{ascending:false}).limit(200).then(function(r){
      var e=$("#st-lista");if(!e)return;
      if(r.error){e.innerHTML='<p class="nota">'+(/inviti_staff|relation|schema cache/i.test(r.error.message||"")?"Si apre con l'SQL 116.":esc(errore(r.error)))+'</p>';return;}
      var d=r.data||[];
      e.innerHTML=d.length?d.map(function(x){var u=link(x.codice);
        return '<div class="persona"><div><b>'+esc(x.nome)+'</b><small>'+esc(ruoliTesto(x))+(x.villaggio?' · '+esc(x.villaggio):'')+' · '+(x.usato_il?'entrato':'non ancora entrato')+'</small></div>'+
          (x.usato_il?'':'<span class="rg-az"><a class="mini oro" href="https://wa.me/'+waNum(x.telefono)+'?text='+encodeURIComponent(u)+'" target="_blank" rel="noopener noreferrer">WhatsApp</a><button class="mini" data-st-copia="'+esc(u)+'">Copia</button><button class="mini" data-st-annulla="'+esc(x.id)+'">Annulla</button></span>')+'</div>';}).join(""):'<p class="nota">Ancora nessun invito.</p>';
      e.querySelectorAll("[data-st-copia]").forEach(function(b){b.onclick=function(){var u=b.getAttribute("data-st-copia");(navigator.clipboard?navigator.clipboard.writeText(u):Promise.reject()).then(function(){b.textContent="Copiato";},function(){prompt("Copia il link",u);});};});
      e.querySelectorAll("[data-st-annulla]").forEach(function(b){b.onclick=function(){b.disabled=true;db.from("inviti_staff").update({annullato_il:new Date().toISOString()}).eq("id",b.getAttribute("data-st-annulla")).then(function(x){if(x.error){mostra("#st-ok",errore(x.error),true);b.disabled=false;return;}lista();});};});
    },function(){});
  }
  lista();
  $("#st-crea").onclick=function(){
    var n=val("st-nome"),m=val("st-mail"),tel=val("st-tel");
    if(!n)return mostra("#st-ok","Scrivi il nome.",true);
    if(!tel&&!m)return mostra("#st-ok","Scrivi il numero.",true);
    if(tel&&!/^\+?[0-9 ]{6,20}$/.test(tel))return mostra("#st-ok","Il numero ha solo cifre, con + davanti se serve.",true);
    if(m&&m.indexOf("@")<1)return mostra("#st-ok","Questa mail non sembra giusta.",true);
    var sc=ruoliScelti("st-rr"),team=val("st-team");
    if(!io.nucleo&&!team)return mostra("#st-ok","Scegli il team.",true);
    var b=this;b.disabled=true;
    db.rpc("fm_staff_invita",{p_nome:n,p_mail:m,p_villaggio:val("st-vill"),p_funzione:sc.length?sc[0][0]:null,p_ruolo:sc.length?sc[0][1]:null,p_telefono:tel||null,
      p_altri:sc.slice(1).map(function(a){return {funzione:a[0],ruolo:a[1]};}),p_squadra:team||null}).then(function(r){
      b.disabled=false;
      if(r.error)return mostra("#st-ok",/fm_staff_invita|function|p_telefono|p_altri|p_squadra/i.test(r.error.message||"")?"Si apre con l'SQL 144.":errore(r.error),true);
      ["st-nome","st-tel","st-mail","st-vill","st-team"].forEach(function(k){$("#"+k).value="";});
      document.querySelectorAll("#st-rr input:checked").forEach(function(i){i.checked=false;});
      lista();var u=link(r.data||""),ok=$("#st-ok");
      db.from("inviti_staff").select("usato_il").eq("codice",r.data||"").limit(1).then(function(q){
        var gia=q&&!q.error&&q.data&&q.data[0]&&q.data[0].usato_il;if(!ok)return;ok.hidden=false;ok.classList.remove("err");
        ok.innerHTML=gia?esc(n)+' era già dentro con questa mail: ha già il ruolo'+(team?' e il team':'')+'. Niente da mandare.'
          :'Link creato per '+esc(n)+'. <a class="mini oro" href="https://wa.me/'+waNum(tel)+'?text='+encodeURIComponent(u)+'" target="_blank" rel="noopener noreferrer">WhatsApp</a> <button type="button" class="mini" id="st-copia-nuovo">Copia il link</button>';
        var cb=$("#st-copia-nuovo");if(cb)cb.onclick=function(){(navigator.clipboard?navigator.clipboard.writeText(u):Promise.reject()).then(function(){cb.textContent="Copiato";},function(){prompt("Copia il link",u);});};
      },function(){if(ok){ok.hidden=false;ok.textContent="Link creato per "+n+": lo trovi qui sopra, nella riga col suo nome.";}});
    },function(){b.disabled=false;});
  };
}

