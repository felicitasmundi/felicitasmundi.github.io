/* LE CHAT A DUE · SQL 129. Gab 29/10 07:59: «preferisco che uno riceva una richiesta di chat, con un messaggio di presentazione»;
   08:00 niente «blocca» in Felicitas: c'è «Chiudi la conversazione». */
function leggiChat(){
  return db.rpc("fm_mie_chat").then(function(r){if(!r||r.error||!r.data)return null;team.chat=r.data;return r.data;},function(){return null;});
}
function mieChat(){
  leggiChat().then(function(l){
    var box=$("#tm-chat");if(!box||vista!=="strumenti")return;
    if(!l){box.innerHTML="";return;}
    leggiNomi(l.map(function(c){return c.altra_persona;}).concat(l.map(function(c){return c.ultimo_da;}))).then(function(){
      if(!box.isConnected)return;
      var ric=l.filter(function(c){return c.stato==="richiesta"&&!c.ho_chiesto;}),
          mie=l.filter(function(c){return c.stato==="richiesta"&&c.ho_chiesto;}),
          ap=l.filter(function(c){return c.stato==="aperta";});
      box.innerHTML=(ric.length||ap.length||mie.length?'<p class="tm-et">Le tue chat</p>':'')+
        ric.map(function(c){return '<div class="tm-ric"><b>'+esc(nomi[c.altra_persona]||"Una persona di Felicitas")+'</b><span class="m">vuole parlarti</span>'+
          '<span class="t">'+esc(c.presentazione)+'</span><div class="tc-az" style="margin:0"><button type="button" class="cerv" data-ris="'+esc(c.chat_id)+'" data-si="1">Accetta</button><button type="button" data-ris="'+esc(c.chat_id)+'">No grazie</button></div></div>';}).join("")+
        (ap.length?'<div class="tm-lista">'+ap.map(function(c){var n=nomi[c.altra_persona]||"";
          var ul=c.ultimo_il?((c.ultimo_da===io.id?"Tu: ":"")+(c.ultimo_testo||"Allegato")):"Chat aperta: scrivi il primo messaggio";
          return '<button type="button" class="tm-ch" data-chat="'+esc(c.chat_id)+'"><span class="tm-seg" aria-hidden="true">'+esc(iniziale(n))+'</span>'+
            '<span class="tm-mezzo"><b>'+esc(n)+'</b><span class="tm-ul">'+esc(ul)+'</span></span>'+
            '<span class="tm-dx">'+(c.ultimo_il?esc(quandoTm(c.ultimo_il)):'')+(c.non_letti?'<br><em aria-label="'+c.non_letti+' da leggere">'+c.non_letti+'</em>':'')+'</span></button>';}).join("")+'</div>':'')+
        mie.map(function(c){return '<div class="tm-ric"><b>'+esc(nomi[c.altra_persona]||"")+'</b><span class="m">la tua richiesta aspetta una risposta</span>'+
          '<div class="tc-az" style="margin:8px 0 0"><button type="button" data-ritira="'+esc(c.chat_id)+'">Ritira la richiesta</button></div></div>';}).join("")+
        ((io.id&&(io.nucleo||(io.ruoli||[]).length))?'<button type="button" class="tm-nuova" id="tm-nuova">Nuova chat</button>':'')+'<p class="az-esito" id="tm-chat-esito" aria-live="polite"></p>';
      box.querySelectorAll("[data-chat]").forEach(function(b){b.onclick=function(){team.id=b.getAttribute("data-chat");team.tipo="chat";vai("team");};});
      box.querySelectorAll("[data-ris]").forEach(function(b){b.onclick=function(){b.disabled=true;
        db.rpc("fm_chat_rispondi",{p_chat:b.getAttribute("data-ris"),p_si:b.hasAttribute("data-si")}).then(function(r){
          if(r&&!r.error&&r.data==="ok"){mieChat();numerini();return;}b.disabled=false;$("#tm-chat-esito").textContent=(r&&r.data)||errore(r&&r.error);},function(){b.disabled=false;});};});
      box.querySelectorAll("[data-ritira]").forEach(function(b){b.onclick=function(){b.disabled=true;
        db.rpc("fm_chat_chiudi",{p_chat:b.getAttribute("data-ritira")}).then(function(){mieChat();},function(){b.disabled=false;});};});
      if($("#tm-nuova"))$("#tm-nuova").onclick=nuovaChat;
    });
  });
}
