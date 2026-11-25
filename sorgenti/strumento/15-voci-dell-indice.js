/* VOCI DELL'INDICE · SQL 274 (15/11/2026, thread «Costruire il ponte verso il Cervello»).
   Le card senza team in attesa: quelle del ponte (controllo-ai, azione «card») e le card della sera (azione «cervello»).
   Conferma → fm_ponte_decidi: la card entra nel Cervello; se la voce non c'è, nasce nella sua sezione.
   Modifica → il testo si cambia prima di confermare (e per una voce nuova senza sezione si sceglie la sezione). Elimina → scartata. */
var VI_SEZ=[["base_filosofica","Base filosofica"],["tecnologia","Tecnologia"],["comunita","Comunità"],["logistica","Logistica"]];
function vociIndice(){
  var sec=$("#esp-voci-s"),box=$("#esp-voci");if(!sec||!box)return;
  db.from("cervello_proposte").select("id,capitolo_id,capitolo_nuovo,testo,proposta_il,sera,ponte,voce_sezione").eq("stato","in_attesa").is("squadra_id",null).order("proposta_il").limit(60).then(function(r){
    var l=(r&&!r.error&&r.data)||[];if(!box.isConnected)return;
    if(!l.length){sec.hidden=true;box.innerHTML="";return;}
    var caps=l.map(function(p){return p.capitolo_id;}).filter(Boolean);
    (caps.length?db.from("cervello_capitoli").select("id,titolo,sezione").in("id",caps).then(function(x){return (x&&!x.error&&x.data)||[];},function(){return [];}):Promise.resolve([])).then(function(cv){
      var tit={};cv.forEach(function(x){tit[x.id]=x;});
      var sez={};VI_SEZ.forEach(function(z){sez[z[0]]=z[1];});
      function righe(t){var i=String(t||"").indexOf("\n");return i<0?[t||"",""]:[t.slice(0,i),t.slice(i+1).replace(/^\n+/,"")];}
      sec.hidden=false;$("#esp-voci-n").textContent="· "+l.length;
      box.innerHTML='<div class="vi-scorri">'+l.map(function(p){
        var c=p.capitolo_id&&tit[p.capitolo_id],nuova=!p.capitolo_id,z=nuova?p.voce_sezione:(c&&c.sezione);
        var meta=esc(c?c.titolo:p.capitolo_nuovo)+(z&&sez[z]?' · '+esc(sez[z]):'')+(nuova?' · <em>voce nuova</em>':'')+(p.sera?' · card della sera':'');
        var rr=righe(p.testo);
        return '<div class="vi-card" data-vi="'+esc(p.id)+'" data-nuova="'+(nuova&&!p.voce_sezione?'1':'')+'"><p class="m">'+meta+'</p>'+
          '<div class="vi-corpo"><b class="t">'+esc(rr[0])+'</b><p class="x">'+esc(rr[1])+'</p></div>'+
          '<div class="tc-az"><button type="button" class="cerv" data-vi-si="1">Conferma</button><button type="button" data-vi-mod="1">Modifica</button><button type="button" class="el" data-vi-no="1">Elimina</button></div>'+
          '<p class="vi-esito" aria-live="polite"></p></div>';}).join("")+'</div>';
      box.querySelectorAll(".vi-card").forEach(function(k){
        var id=k.getAttribute("data-vi"),p=l.filter(function(x){return x.id===id;})[0],esito=k.querySelector(".vi-esito");
        function manda(si){
          var bb=k.querySelectorAll("button");bb.forEach(function(b){b.disabled=true;});esito.textContent="";
          var ta=k.querySelector("textarea"),se=k.querySelector("select");
          var arg={p_proposta:id,p_conferma:si};
          if(si&&ta&&ta.value.trim()&&ta.value!==p.testo)arg.p_testo=ta.value;
          if(si&&se&&se.value)arg.p_sezione=se.value;
          db.rpc("fm_ponte_decidi",arg).then(function(x){
            if(x&&!x.error&&x.data==="ok"){vociIndice();return;}
            bb.forEach(function(b){b.disabled=false;});esito.textContent=(x&&x.data)||errore(x&&x.error);},
            function(){bb.forEach(function(b){b.disabled=false;});});
        }
        k.querySelector("[data-vi-si]").onclick=function(){manda(true);};
        k.querySelector("[data-vi-no]").onclick=function(){manda(false);};
        k.querySelector("[data-vi-mod]").onclick=function(){
          var corpo=k.querySelector(".vi-corpo");if(k.querySelector("textarea"))return;
          corpo.innerHTML='<textarea aria-label="Testo della card">'+esc(p.testo)+'</textarea>'+
            (!p.capitolo_id?'<select aria-label="Sezione"><option value="">'+esc(p.voce_sezione&&sez[p.voce_sezione]||"Sezione")+'</option>'+VI_SEZ.map(function(z){return '<option value="'+z[0]+'"'+(z[0]===p.voce_sezione?' selected':'')+'>'+esc(z[1])+'</option>';}).join("")+'</select>':'');
          var ta=corpo.querySelector("textarea");try{ta.focus();}catch(e){}};
      });
    });
  },function(){});
}
/* foto, audio e file della chat stanno nello spazio privato «chat»: si vedono con un link che dura un'ora */
function fotoUrl(paths){
  paths=paths.filter(function(p,i,a){return p&&a.indexOf(p)===i&&!team.url[p];});
  if(!paths.length||!db.storage)return Promise.resolve();
  return db.storage.from("chat").createSignedUrls(paths,3600).then(function(r){
    ((r&&!r.error&&r.data)||[]).forEach(function(x){if(x.signedUrl&&x.path)team.url[x.path]=x.signedUrl;});},function(){});
}

/* 31/10/2026 · thread «Il Praticantato», Gab 14:33 «ok chat»: tasti «Come funziona» e «In diretta» nella chat del team Praticantato */
/* ═══ Praticantato · tasto «Come funziona» nella chat del team Praticantato (thread «Il Praticantato», 31/10/2026) ═══
   Gab 31/10 13:56: «non mi piace, è una cosa piu pratica, deve essere una chat, con un tasto in alto che ti mostra il funzionamento».
   Gab 31/10 14:31: «dove c e scritto come funziona, metti di fianco un altra finestra che mostra "in diretta" che dovrebbe essere un tasto
     che annuncia la diretta del lunedi e che fa entrare nelal diretta».
   Il tasto «In diretta»: prima della lezione annuncia «Lunedì alle 19»; quando la diretta è in onda (fm_dirette_in_onda) si accende
   e porta nella sala: diretta-bozza.html?puntata=<id della diretta in onda>.
   Per il Tour (strumento.html, da fare sul file online):
   1 · CSS: aggiungere le regole PRAT_CSS qui sotto nello <style>.
   2 · vTeam(): subito dopo '</div>' della .tc-testa, se il team è il Praticantato, inserire PRAT_TASTO:
         (t.nome==="Praticantato"?PRAT_TASTO:"")+
       e dopo i collegamenti dei tasti:  if($("#tc-prat"))tastiPrat();
       (nel team Praticantato la striscia #tc-dir «In diretta · entra ›» si può togliere: la fa il tasto).
   3 · Espandi › Etere › «Praticantato»: apre la chat del team Praticantato invece di Obiettivi.
   4 · «Che cos'è il praticantato» (invito-prat) apre lo stesso foglio o la chat.
   Testi: Gab 27/10 (definizione, verbatim, tre refusi corretti), 24/10, 19/10; decisioni 31/10.
   Il tasto per pagare compare solo quando LINK_PRAT ha il link buy.stripe.com (abbonamento mensile, uno per account). */

var PRAT_CSS =
'.tc-prat2{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:10px 0 0}'+
'.tc-prat,.tc-live{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;min-height:64px;padding:10px 12px;border:1px solid #D4AF6A;border-radius:20px;background:#1a2148;color:#D4AF6A;font:600 18px "DM Sans",system-ui,sans-serif;cursor:pointer;text-decoration:none;text-align:center}'+
'.tc-live small{font-weight:400;font-size:15px;color:rgba(245,240,230,.75)}'+
'.tc-live .pt{display:inline-block;width:10px;height:10px;border-radius:50%;background:rgba(245,240,230,.4);margin-right:8px;vertical-align:1px}'+
'.tc-live.on{background:#D4AF6A;color:#0a1430}.tc-live.on small{color:#0a1430}'+
'.tc-live.on .pt{background:#E5484D;box-shadow:0 0 0 0 rgba(229,72,77,.6);animation:prpt 1.6s infinite}'+
'@keyframes prpt{70%{box-shadow:0 0 0 10px rgba(229,72,77,0)}100%{box-shadow:0 0 0 0 rgba(229,72,77,0)}}'+
'.pr-def{font-size:19px!important;line-height:1.55;color:#F5F0E6!important;border-left:3px solid #D4AF6A;padding-left:14px}'+
'.pr-fir{font-size:15px!important;margin-top:-2px!important}'+
'.pr-passo{display:flex;gap:14px;align-items:flex-start;padding:14px 0;border-bottom:1px solid rgba(245,240,230,.09)}'+
'.pr-n{flex:none;width:36px;height:36px;border-radius:50%;display:grid;place-items:center;background:#D4AF6A;color:#0a1430;font-weight:700;font-size:18px}'+
'.pr-passo b{display:block;font-size:19px;font-weight:600;color:#F5F0E6}'+
'.pr-passo div>span{display:block;font-size:17px;color:rgba(245,240,230,.75);margin-top:2px}'+
'.pr-paga{display:block;text-align:center;text-decoration:none;margin:18px 0 0;padding:16px;border-radius:28px;background:#D4AF6A;color:#0a1430;font-weight:700;font-size:19px}';

var PRAT_TASTO = '<div class="tc-prat2"><button type="button" class="tc-prat" id="tc-prat">Come funziona</button>'+
  '<a class="tc-live" id="tc-live" role="button"><span><span class="pt" aria-hidden="true"></span>In diretta</span><small>lunedì alle 19</small></a></div>';

/* quanto manca alla prossima lezione: lunedì alle 19, ora di Roma */
function prossimaLezionePrat(){
  var r=new Date(new Date().toLocaleString("en-US",{timeZone:"Europe/Rome"})),g=(8-r.getDay())%7;
  if(g===0&&r.getHours()>=19)g=7;
  return g===0?"oggi alle 19":g===1?"domani alle 19":"lunedì alle 19";
}
function tastiPrat(){
  $("#tc-prat").onclick=comeFunzionaPrat;
  var b=$("#tc-live");b.querySelector("small").textContent=prossimaLezionePrat();
  b.onclick=function(){foglioTeam('<h2>La lezione del lunedì</h2><p>Lunedì alle 19 · con Gabriele Dettori</p>'+
    '<p>Quando la lezione parte, il tasto «In diretta» si accende: toccalo ed entri nella sala.</p>');};
  dirette().then(function(d){if(!d||!d.length||!$("#tc-live"))return;
    b.classList.add("on");b.querySelector("small").textContent="ora · entra ›";
    b.href="diretta-bozza.html?puntata="+encodeURIComponent(d[0].id);b.onclick=null;});
}

var LINK_PRAT = 'https://buy.stripe.com/5kQdRaffm7gCdsW2MN5EY0c'; /* link Stripe dell'abbonamento: lo dà Gab. Ritorno: strumento.html?v=azione&pagato=praticantato */

function comeFunzionaPrat(){
  foglioTeam(
    '<h2>Praticantato Antaḥkaraṇa</h2>'+
    '<p class="pr-def">Il praticantato FelicitasMundi, definito Antaḥkaraṇa, è un progetto che punta alla valorizzazione del talento intrinseco di ogni individuo in ogni fascia d\'età, in modo che possa valorizzare, riconoscere e portare a terra la propria capacità intrinseca, la propria creatività, riconoscere i propri bisogni per poter poi sviluppare il proprio sogno, il proprio progetto senso. E trovare attraverso la comunità, attraverso gli strumenti di FelicitasMundi, la strada per poter poi rendere distribuibile, vendibile o proponibile alla comunità ciò che porta.</p>'+
    '<p class="pr-fir">Gabriele Dettori · 27 ottobre</p>'+
    '<div class="pr-passo"><span class="pr-n">1</span><div><b>La lezione del lunedì alle 19</b><span>In diretta qui, nella chat del team: quando parte, il tasto «In diretta» in alto si accende.</span></div></div>'+
    '<div class="pr-passo"><span class="pr-n">2</span><div><b>Karma yoga</b><span>Per chi fa karma yoga la lezione è compresa. «inizia il karma yoga e poi segue lo studentato»</span></div></div>'+
    '<div class="pr-passo"><span class="pr-n">3</span><div><b>Il praticantato · 80 € al mese</b><span>«il praticantato che unisce sia l\'aspetto introspettivo che l\'utilizzo dell\'applicazione»</span></div></div>'+
    (LINK_PRAT?'<a class="pr-paga" href="'+LINK_PRAT+'">Inizia il praticantato · 80 € al mese</a>':'')+
    '<div id="pr-karma"></div>'
  );
  karmaPrat();
}

document.head.insertAdjacentHTML("beforeend","<style>"+PRAT_CSS+"</style>");
/* Espandi › Etere › Praticantato: apre la chat del team Praticantato */
function apriPrat(){leggiTeam().then(function(l){var t=(l||[]).filter(function(x){return x.nome==="Praticantato";})[0];
  if(t){team.id=t.team_id;vai("team");}else vai("obiettivi");});}
/* 31/10, Gab: ritorno da Stripe strumento.html?v=azione&pagato=praticantato → «pagamento ricevuto» */
(function(){if(!/[?&]pagato=praticantato(&|$)/.test(location.search))return;var n=0,t=setInterval(function(){n++;
  var c=document.getElementById("corpo");if(n>40){clearInterval(t);return;}
  if(!c||typeof vista==="undefined"||vista!=="azione"||!c.firstElementChild||document.getElementById("fm-pagato"))return;
  clearInterval(t);c.insertAdjacentHTML("afterbegin",'<div class="card" id="fm-pagato" style="border:1px solid #D4AF6A;background:#1a2148;text-align:center;padding:18px;border-radius:20px;margin-bottom:14px"><b style="font-size:20px;color:#D4AF6A">Pagamento ricevuto</b><span class="t" style="display:block;font-size:18px;color:#F5F0E6">Praticantato · 80 € al mese</span></div>');},250);})();

/* 31/10/2026 · thread «Il Praticantato», Gab 21:07 «esatto era quello che avrei voluto» · SQL 140 lanciato: obiettivi nella chat dei team */
/* ═══ Obiettivi nella chat dei team · per il Tour (strumento.html online, MD5 b828228e…) · thread «Il Praticantato», 31/10/2026 ═══
   Gab 31/10 21:07: «esatto era quello che avrei voluto» (tocchi un messaggio → «Fai obiettivo»; nei tre puntini gli obiettivi;
   nel Praticantato quelli di tutti i team, col nome del team). Serve lo SQL 140 (fm_fai_obiettivo, fm_team_obiettivi).
   1 · azioniMsg(m): dopo il tasto «Apri argomento»/«Chiudi argomento» aggiungere
         (team.tipo==="team"?'<button type="button" data-az="obiettivo">Fai obiettivo</button>':'')+
   2 · legaAzioniMsg: dentro il click dei bottoni, prima di  if(a==="apri"){  aggiungere
         if(a==="obiettivo"){faiObiettivo(box,m,esito);return;}
   3 · menuChat: subito dopo ARG_H aggiungere  (duo?'':OB_H)+   e dopo riempiArgomenti(id);  aggiungere  if(!duo)riempiObiettivi(id);
   4 · CSS: OB_CSS nello <style>.
   21:14 Gab: «un obiettivo sarà "far girare il modulo produttori per incrementare i prodotti in emporio", rendilo pratico» ·
   «e mettilo anche in praticantato» → l'obiettivo porta un link: nella scheda «Apri» e «Invia» (come il tasto del modulo produttore);
   nel Praticantato si vede con gli obiettivi di tutti i team. */

var OB_CSS='.ob-c{padding:12px 0;border-bottom:1px solid rgba(245,240,230,.09)}'+
'.ob-c b{display:block;font-size:19px;font-weight:500;color:#F5F0E6}'+
'.ob-c small{display:block;font-size:15px;color:rgba(245,240,230,.68);margin-top:2px}'+
'.ob-c .ob-team{display:inline-block;font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:#D4AF6A;margin-bottom:2px}'+
'.ob-c .fine{display:flex;justify-content:flex-end;margin-top:8px}'+
'.ob-c button{font:600 16px "DM Sans",system-ui,sans-serif;border-radius:16px;padding:9px 16px;border:1px solid #D4AF6A;background:#D4AF6A;color:#0a1430;cursor:pointer}'+
'.ob-c button.las,.ob-c a.ob-l,.ob-c button.ob-l{background:transparent;color:#D4AF6A}'+
'.ob-c .fine{gap:8px;flex-wrap:wrap}.ob-c a.ob-l{font:600 16px "DM Sans",system-ui,sans-serif;border-radius:16px;padding:9px 16px;border:1px solid #D4AF6A;text-decoration:none}'+
'.ob-tap{display:block;width:100%;text-align:left;background:transparent;border:0;border-bottom:1px solid rgba(245,240,230,.09);color:inherit;cursor:pointer;font:inherit}'+
'.ob-riga{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:4px}'+
'.ob-st{border-radius:999px;padding:2px 10px;font:600 14px "DM Sans",system-ui,sans-serif;color:#0a1430;white-space:nowrap}'+
'.s-fare{background:#C9C2B2}.s-corso{background:#8FB8E8}.s-attesa{background:#E8B86A}.s-fatto{background:#9CCB9A}'+
'.ob-prog{display:block;height:8px;border-radius:999px;background:#222b5a;overflow:hidden;margin:8px 0 4px}.ob-prog span{display:block;height:100%;background:#D4AF6A;border-radius:999px}'+
'.ob-tasti{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}'+
'.ob-tasti button,.ob-tasti a,.ob-f button,.ob-avviso button{font:600 16px "DM Sans",system-ui,sans-serif;border-radius:16px;padding:9px 16px;border:1px solid #D4AF6A;background:#D4AF6A;color:#0a1430;cursor:pointer;text-decoration:none}'+
'.ob-tasti .ob-l{background:transparent;color:#D4AF6A}'+
'.ob-avviso{border:2px solid #D4AF6A;border-radius:16px;padding:14px;margin-top:12px}.ob-avviso p{margin:6px 0 10px}'+
'.ob-passi{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:12px}'+
'.ob-passo{display:grid;grid-template-columns:30px 1fr;gap:10px;font-size:18px}.ob-passo small{display:block;font-size:15px;color:rgba(245,240,230,.68)}'+
'.ob-pal{width:26px;height:26px;border-radius:50%;border:2px solid #C9C2B2;display:grid;place-items:center;font-size:14px;font-weight:600}'+
'.ob-passo.fatto .ob-pal{background:#9CCB9A;border-color:#9CCB9A;color:#0a1430}.ob-passo.attesa .ob-pal{border-color:#E8B86A;color:#E8B86A}.ob-passo.corso .ob-pal{border-color:#8FB8E8;color:#8FB8E8}'+
'.ob-ok{display:flex;align-items:center;gap:8px;font-size:16px}'+
'.ob-storia{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px;font-size:16px}.ob-storia li{display:grid;grid-template-columns:64px 1fr;gap:8px;color:rgba(245,240,230,.68)}.ob-storia b{color:#F5F0E6;font-weight:600}'+
'.ob-f input{min-height:48px}';

var OB_H='<h2 style="margin-top:26px">Obiettivi</h2><p>Tocca «Lo prendo» e l\'obiettivo entra tra le tue cose da fare.</p><div id="mc-ob"><p class="nota">Un momento…</p></div>';

/* 1/11 Gab (thread «Capire il Company brain con i team»): «si disegna avanzamento» · «uno per prendere obiettivo deve passare dal karma yoga,
   quanto meno da una pagina dove ci sia la base» · «procedi». SQL 143: passi con l'ok, storia, karma yoga. */
function obStato(o){
  if(o.stadio==="sviluppato")return ["s-fatto","Fatto"];
  if(o.da_approvare>0)return ["s-attesa","Da approvare"];
  if(o.stadio==="in_avanzamento"||o.passi_fatti>0||o.presi>0)return ["s-corso","In corso"];
  return ["s-fare","Da fare"];
}
function obData(d){return new Date(d+"T12:00").toLocaleDateString("it-IT",{day:"numeric",month:"long"});}
function riempiObiettivi(id){
  db.rpc("fm_team_obiettivi",{p_team:id}).then(function(r){var e=$("#mc-ob");if(!e)return;
    var l=(r&&!r.error&&r.data)||[];
    if(!l.length){e.innerHTML='<p>Ancora nessun obiettivo. Tocca un messaggio e scegli «Fai obiettivo».</p>';return;}
    var altri=l.some(function(o){return o.team!==l[0].team;})||(team.lista||[]).some(function(t){return t.team_id===id&&t.nome==="Praticantato";});
    e.innerHTML=l.map(function(o){var st=obStato(o),p=o.passi||0,f=o.passi_fatti||0;
      return '<button type="button" class="ob-c ob-tap" data-ob-apri="'+esc(o.id)+'">'+
        '<span class="ob-riga">'+(altri?'<span class="ob-team">'+esc(o.team)+'</span>':'<span></span>')+'<span class="ob-st '+st[0]+'">'+st[1]+'</span></span>'+
        '<b>'+esc(o.titolo)+'</b>'+
        '<span class="ob-prog" aria-hidden="true"><span style="width:'+(p?Math.round(f*100/p):0)+'%"></span></span>'+
        '<small>'+(p?f+" di "+p+" passi":"passi da scrivere")+' · '+
        (o.quanti_servono?o.presi+" di "+o.quanti_servono+" persone":(o.presi===1?"1 persona":o.presi?o.presi+" persone":"nessuno l'ha preso"))+
        (o.entro_il?" · entro il "+esc(obData(o.entro_il)):"")+'</small></button>';}).join("");
    e.querySelectorAll("[data-ob-apri]").forEach(function(b){b.onclick=function(){
      var o=l.filter(function(x){return x.id===b.getAttribute("data-ob-apri");})[0];if(o)apriObiettivo(o,id);};});
  },function(){var e=$("#mc-ob");if(e)e.innerHTML='<p>Gli obiettivi non si aprono adesso.</p>';});
}
function apriObiettivo(o,teamId){
  var f=foglioTeam('<div id="ob-sc"><p class="nota">Un momento…</p></div>');if(!f)return;
  Promise.all([db.rpc("fm_team_obiettivi",{p_team:teamId}),db.rpc("fm_obiettivo_passi",{p_orma:o.id}),db.rpc("fm_obiettivo_storia",{p_orma:o.id}),db.rpc("fm_karma_mio")]).then(function(rr){
    var e=$("#ob-sc");if(!e)return;
    o=((rr[0]&&rr[0].data)||[]).filter(function(x){return x.id===o.id;})[0]||o;
    var passi=(rr[1]&&rr[1].data)||[],storia=(rr[2]&&rr[2].data)||[],karma=(rr[3]&&rr[3].data)||"";
    var st=obStato(o),p=o.passi||0,fa=o.passi_fatti||0,lavoro=o.mio||(passi[0]&&passi[0].posso_lavorare);
    var h='<span class="ob-riga"><span class="ob-team">'+esc(o.team)+'</span><span class="ob-st '+st[0]+'">'+st[1]+'</span></span>'+
      '<h2 style="margin-top:6px">'+esc(o.titolo)+'</h2>'+
      '<span class="ob-prog" aria-hidden="true"><span style="width:'+(p?Math.round(fa*100/p):0)+'%"></span></span>'+
      '<p class="tc-nota">'+(p?fa+" di "+p+" passi":"passi da scrivere")+' · '+(o.quanti_servono?o.presi+" di "+o.quanti_servono+" persone":(o.presi===1?"1 persona":o.presi?o.presi+" persone":"nessuno l'ha preso"))+(o.entro_il?" · entro il "+esc(obData(o.entro_il)):"")+'</p>'+
      '<div class="ob-tasti">'+(o.link?'<a class="ob-l" href="'+esc(o.link)+'" target="_blank" rel="noopener">Apri</a><button type="button" class="ob-l" id="ob-inv">Invia</button>':'')+
        (o.mio?'<button type="button" class="ob-l" id="ob-las">Lo lascio</button>':'<button type="button" id="ob-pre">Lo prendo</button>')+'</div>'+
      '<div id="ob-karma"></div>'+
      '<h2 style="margin-top:22px">I passi</h2>'+
      (passi.length?'<ol class="ob-passi">'+passi.map(function(x,i){
        var cl=x.stato==="fatto"?"fatto":x.stato==="da_approvare"?"attesa":x.stato==="preso"?"corso":"";
        var sotto=x.stato==="fatto"?"fatto da "+(x.chi||"una persona"):x.stato==="da_approvare"?"aspetta l'ok"+(x.chi?" · "+x.chi:""):x.stato==="preso"?"lo sta facendo "+(x.chi||"una persona"):(x.serve_ok?"chiede l'ok alla fine":"da fare");
        var t='';
        if(x.stato==="da_approvare"&&x.posso_approvare)t='<button type="button" data-pc="approvo" data-r="'+esc(x.id)+'">Approva</button><button type="button" class="ob-l" data-pc="rimando" data-r="'+esc(x.id)+'">Rimanda indietro</button>';
        else if((x.stato==="aperto"||x.stato==="preso")&&x.posso_lavorare)t=(x.stato==="aperto"?'<button type="button" class="ob-l" data-pc="prendo" data-r="'+esc(x.id)+'">Lo faccio io</button>':'')+'<button type="button" data-pc="fatto" data-r="'+esc(x.id)+'">Fatto</button>'+(x.serve_ok?'':'<button type="button" class="ob-l" data-pc="chiedo_ok" data-r="'+esc(x.id)+'">Chiedi l\'ok</button>');
        return '<li class="ob-passo '+cl+'"><span class="ob-pal">'+(x.stato==="fatto"?"✓":x.stato==="da_approvare"?"!":(i+1))+'</span><div>'+esc(x.testo)+
          '<small>'+esc(sotto)+(x.scritto_da_praticante?' · scritto da un praticante':'')+'</small>'+(t?'<span class="ob-tasti">'+t+'</span>':'')+'</div></li>';}).join("")+'</ol>':'<p>Ancora nessun passo.</p>')+
      (lavoro?'<div class="ob-f" style="display:flex;flex-wrap:wrap;gap:8px;margin-top:10px"><input type="text" id="ob-np" maxlength="600" placeholder="Un passo" aria-label="Un passo" style="flex:1 1 100%">'+
        '<label class="ob-ok"><input type="checkbox" id="ob-nok"> chiede l\'ok alla fine</label><button type="button" id="ob-agg">Aggiungi un passo</button></div>':'')+
      (storia.length?'<h2 style="margin-top:22px">La storia</h2><ul class="ob-storia">'+storia.map(function(s){
        return '<li><span>'+esc(new Date(s.quando).toLocaleDateString("it-IT",{day:"numeric",month:"short"}))+'</span><span><b>'+esc(s.chi)+'</b> '+esc(s.cosa)+'</span></li>';}).join("")+'</ul>':'')+
      '<p class="tc-nota" id="ob-esito" aria-live="polite"></p>';
    e.innerHTML=h;
    function rifai(){cache.obiettivi=null;apriObiettivo(o,teamId);riempiObiettivi(teamId);}
    function esito(r){if(r&&r.error){$("#ob-esito").textContent=errore(r.error);return false;}if(r&&typeof r.data==="string"&&r.data!=="ok"){$("#ob-esito").textContent=r.data;return false;}return true;}
    function karmaBox(){var k=$("#ob-karma");if(!k)return;
      k.innerHTML='<div class="ob-avviso"><b>Per prendere un obiettivo si passa dal karma yoga.</b>'+
        (karma==="chiesto"?'<p>Hai chiesto di entrare: aspetta «Accolto» dal nucleo.</p>':'<p>Leggi la base nel «Come funziona» del Praticantato, poi chiedi di entrare.</p><button type="button" id="ob-base">Leggi la base</button>')+'</div>';
      var bb=$("#ob-base");if(bb)bb.onclick=function(){comeFunzionaPrat();};}
    var pre=$("#ob-pre");if(pre)pre.onclick=function(){
      pre.disabled=true;db.rpc("fm_prendi_orma",{p_orma:o.id}).then(function(r){pre.disabled=false;
        if(r&&r.error&&/karma yoga/i.test(r.error.message||"")){karmaBox();return;}if(esito(r))rifai();},function(x){pre.disabled=false;$("#ob-esito").textContent=errore(x);});};
    var las=$("#ob-las");if(las)las.onclick=function(){las.disabled=true;db.rpc("fm_lascia_orma",{p_orma:o.id}).then(function(r){if(esito(r))rifai();});};
    var inv=$("#ob-inv");if(inv)inv.onclick=function(){var u=o.link,t=o.titolo;
      if(navigator.share){navigator.share({title:t,url:u}).catch(function(){});return;}
      (navigator.clipboard?navigator.clipboard.writeText(u):Promise.reject()).then(function(){$("#ob-esito").textContent="Link copiato.";},
        function(){location.href="https://wa.me/?text="+encodeURIComponent(t+" "+u);});};
    e.querySelectorAll("[data-pc]").forEach(function(b){b.onclick=function(){b.disabled=true;
      db.rpc("fm_passo_cambia",{p_riga:b.getAttribute("data-r"),p_cosa:b.getAttribute("data-pc")}).then(function(r){b.disabled=false;if(esito(r))rifai();},function(x){b.disabled=false;$("#ob-esito").textContent=errore(x);});};});
    var agg=$("#ob-agg");if(agg)agg.onclick=function(){var v=$("#ob-np").value.trim();if(!v){$("#ob-np").focus();return;}agg.disabled=true;
      db.rpc("fm_passo_aggiungi",{p_orma:o.id,p_testo:v,p_serve_ok:$("#ob-nok").checked}).then(function(r){agg.disabled=false;if(esito(r))rifai();},function(x){agg.disabled=false;$("#ob-esito").textContent=errore(x);});};
  },function(){var e=$("#ob-sc");if(e)e.innerHTML='<p>L\'obiettivo non si apre adesso.</p>';});
}
/* karma yoga in fondo al «Come funziona»: chiedo di entrare · il nucleo accoglie */
function karmaPrat(){
  var k=$("#pr-karma");if(!k)return;
  Promise.all([db.rpc("fm_karma_mio"),db.rpc("fm_karma_richieste")]).then(function(rr){var k=$("#pr-karma");if(!k)return;
    var mio=(rr[0]&&rr[0].data)||"",ri=(rr[1]&&!rr[1].error&&rr[1].data)||[];
    var h=mio==="puoi"?'':mio==="chiesto"?'<p class="tc-nota">Hai chiesto di entrare nel karma yoga: aspetta «Accolto» dal nucleo.</p>':
      '<button type="button" class="pr-paga" id="pr-chiedo" style="border:0;cursor:pointer">Chiedo di entrare nel karma yoga</button>';
    if(ri.length)h+='<h2 style="margin-top:22px">Chiedono di entrare nel karma yoga</h2>'+ri.map(function(x){
      return '<div class="ob-c"><b>'+esc(x.nome)+'</b><small>'+esc(assQuando(x.chiesto_il))+'</small><div class="fine"><button type="button" data-acc="'+esc(x.persona_id)+'">Accolto</button></div></div>';}).join("");
    k.innerHTML=h;
    var c=$("#pr-chiedo");if(c)c.onclick=function(){c.disabled=true;db.rpc("fm_karma_chiedo").then(function(){karmaPrat();},function(){c.disabled=false;});};
    k.querySelectorAll("[data-acc]").forEach(function(b){b.onclick=function(){b.disabled=true;db.rpc("fm_karma_accolgo",{p_persona:b.getAttribute("data-acc")}).then(function(){karmaPrat();},function(){b.disabled=false;});};});
  },function(){});
}

function faiObiettivo(box,m,esito){
  box.innerHTML='<div class="ob-f" style="display:flex;flex-wrap:wrap;gap:8px;flex:1 1 100%">'+
    '<input type="text" id="ob-t" maxlength="120" placeholder="L\'obiettivo" aria-label="L\'obiettivo" style="flex:1 1 100%" value="'+esc((m.testo||"").replace(/https:\/\/\S+/g,"").trim().slice(0,120))+'">'+
    '<input type="number" id="ob-q" min="1" max="99" inputmode="numeric" placeholder="Quanti servono" aria-label="Quante persone servono" style="flex:1 1 40%">'+
    '<input type="date" id="ob-e" aria-label="Entro quando" style="flex:1 1 40%">'+
    '<input type="url" id="ob-l" inputmode="url" placeholder="Link (facoltativo): https://…" aria-label="Link" style="flex:1 1 100%" value="'+esc(((m.testo||"").match(/https:\/\/\S+/)||[""])[0])+'">'+
    '<button type="button" class="cerv" id="ob-ok">Fai obiettivo</button><button type="button" id="ob-no">Annulla</button></div>';
  var t=$("#ob-t");t.focus();
  $("#ob-no").onclick=function(){team.scelto=null;disegnaTeam();};
  $("#ob-ok").onclick=function(){var v=t.value.trim();if(!v){t.focus();return;}var b=this;b.disabled=true;
    var q=+$("#ob-q").value||null,en=$("#ob-e").value||null,li=$("#ob-l").value.trim()||null;
    db.rpc("fm_fai_obiettivo",{p_messaggio:m.id,p_titolo:v,p_quanti:q,p_entro:en,p_link:li}).then(function(r){b.disabled=false;cache.obiettivi=null;esito(r);},
      function(e){b.disabled=false;$("#tc-err").textContent=errore(e);});};
}

document.head.insertAdjacentHTML("beforeend","<style>"+OB_CSS+"</style>");
function vTeam(){
  var c=$("#corpo"),id=team.id;
  if(!io.id||!id){vai("azione");return;}
  var t=(team.lista||[]).filter(function(x){return x.team_id===id;})[0];
  var ch=(team.chat||[]).filter(function(x){return x.chat_id===id&&x.stato==="aperta";})[0];
  if(t)team.tipo="team";else if(ch){team.tipo="chat";t={team_id:id,nome:nomi[ch.altra_persona]||""};}
  if(!t){
    c.innerHTML='<p class="nota" style="text-align:center;padding:30px 0">Un momento…</p>';
    Promise.all([leggiTeam(),leggiChat()]).then(function(v){if(vista!=="team"||team.id!==id)return;
      var ok=(v[0]||[]).some(function(x){return x.team_id===id;})||(v[1]||[]).some(function(x){return x.chat_id===id&&x.stato==="aperta";});
      if(!ok){vai("azione");return;}
      leggiNomi((v[1]||[]).map(function(x){return x.altra_persona;})).then(function(){if(vista==="team"&&team.id===id)vTeam();});});
    return;
  }
  var duo=team.tipo==="chat";
  c.innerHTML='<div class="tc-testa"><button type="button" class="tc-ind" id="tc-ind" aria-label="Torna ad Azione">‹</button><span class="tm-seg" aria-hidden="true">'+esc(iniziale(t.nome))+'</span>'+
      '<div class="tc-nome"><b>'+esc(t.nome)+'</b><small>'+(duo?"chat a due":"chat del team")+'</small></div>'+
      '<button type="button" class="tc-menu" id="tc-menu" aria-label="Argomenti e notifiche'+(duo?' e chiusura':'')+'">⋯</button></div>'+
    '<div id="tc-stanze"></div><div id="tc-chatparte"><div id="tc-pres"></div><div id="tc-dt"></div>'+(t.nome==="Praticantato"?PRAT_TASTO:"")+'<div id="tc-agenda"></div><div id="tc-ass"></div><div id="tc-stfiss"></div><div id="tc-pv"></div><div id="tc-fiss"></div><div id="tc-dir"></div><div class="tc-msg" id="tc-msg"><p class="nota" style="text-align:center">Un momento…</p></div>'+
    '<p class="tc-err" id="tc-err" aria-live="polite"></p>'+
    '<div class="tc-piede"><button type="button" class="tc-piu" id="tc-piu" aria-label="Foto, vocale, file o posizione">+</button><input type="file" id="tc-file" accept="image/*" hidden>'+
      '<input type="file" id="tc-doc" accept=".pdf,.txt,.rtf,.doc,.docx,.odt,.xls,.xlsx,.ods,.ppt,.pptx,.odp,application/pdf" hidden>'+
      '<textarea id="tc-testo" maxlength="2000" rows="1" placeholder="'+(duo?"Scrivi…":"Scrivi al team…")+'" aria-label="Scrivi"></textarea><button type="button" class="tc-manda" id="tc-manda" aria-label="Manda">↑</button></div>'+
    '</div><div id="tc-foglio"></div>';
  $("#tc-ind").onclick=function(){vai("azione");};
  /* 31/10 21:00, Gab: «metti argomenti tra le cose che trovi nei tre puntini, mettilo tra i primi input» → il tasto Argomenti esce dalla testa */
  $("#tc-menu").onclick=menuChat;
  $("#tc-piu").onclick=allega;
  if($("#tc-prat"))tastiPrat();
  var ta=$("#tc-testo");ta.oninput=function(){ta.style.height="auto";ta.style.height=Math.min(160,ta.scrollHeight)+"px";};
  $("#tc-manda").onclick=function(){var x=ta.value.trim();if(!x)return;var b=this;b.disabled=true;
    db.from("gruppo_messaggi").insert({cerchio_id:id,testo:x,scritto_da:io.id}).then(function(r){b.disabled=false;
      if(r&&r.error){$("#tc-err").textContent=errore(r.error);return;}ta.value="";ta.style.height="";$("#tc-err").textContent="";ricaricaTeam(true);},
      function(e){b.disabled=false;$("#tc-err").textContent=errore(e);});};
  $("#tc-file").onchange=function(e){var f=e.target.files&&e.target.files[0];e.target.value="";if(f)mandaFoto(id,f);};
  $("#tc-doc").onchange=function(e){var f=e.target.files&&e.target.files[0];e.target.value="";if(f)mandaAllegato(id,f,"file",f.name);};
  trascinaInChat();
  dirette().then(function(d){var e=$("#tc-dir");if(!e||!d||!d.length||$("#tc-prat"))return;
    e.innerHTML=d.map(function(x){return '<a class="sp-diretta" href="diretta-bozza.html?puntata='+encodeURIComponent(x.id)+'"><span class="sp-punto" aria-hidden="true"></span><span><b>In diretta</b> · '+esc(x.titolo||"")+'</span><span>entra ›</span></a>';}).join("");});
  if(!duo)diretteTeam(id);team.evento=null;team.stanzeSu=false;team.inAlto=false;if(!duo){stanzeTeam(id);presTeam(id);}
  team.msg=[];team.prop={};
  ricaricaTeam(true);team.guido=false;guidoChat(id);agendaTeam(id);ass.rispondo=null;ass.stat=false;assTeam(id);
  /* 16/11 SQL 283: proposte di vicinato come card nel team Vicinati del Cibo */
  if(!duo&&t.nome==="Vicinati del Cibo"&&window.fmProposteVicinato)fmProposteVicinato(db,id);
  /* la chat si aggiorna da sola: realtime se c'è, altrimenti ogni 20 secondi */
  try{if(db.channel){team.sub=db.channel("team-"+id).on("postgres_changes",{event:"*",schema:"public",table:"gruppo_messaggi",filter:"cerchio_id=eq."+id},function(){ricaricaTeam(false);}).subscribe();}}catch(e){}
  team.timer=setInterval(function(){ricaricaTeam(false);},20000);
}
function ricaricaTeam(giu){
  var id=team.id;if(vista!=="team"||!id){teamFerma();return;}
  var q=db.from("gruppo_messaggi").select("id,testo,foto,audio,file,file_nome,lat,lon,scritto_da,scritto_il,registro_id,argomento,argomento_da,fissato_il,modificato_il,assistenza_id").eq("cerchio_id",id);
  if(team.dal)q=q.gte("scritto_il",team.dal);
  q.order("scritto_il",{ascending:false}).limit(team.dal?500:80).then(function(r){
    if(vista!=="team"||team.id!==id)return;
    if(!r||r.error){var e=$("#tc-msg");if(e&&!team.msg.length)e.innerHTML='<p class="nota" style="text-align:center">La chat non si apre adesso. Si può riprovare.</p>';return;}
    var l=(r.data||[]).reverse();if(ass.team&&id===ass.team)l=l.filter(function(m){return !m.assistenza_id;});var ids=l.map(function(m){return m.id;});
    var nuovi=l.length&&(!team.msg.length||l[l.length-1].id!==team.msg[team.msg.length-1].id);
    Promise.all([
      ids.length?db.from("cervello_proposte").select("messaggio_id,stato").in("messaggio_id",ids).neq("stato","scartata").then(function(x){return (x&&!x.error&&x.data)||[];},function(){return [];}):Promise.resolve([]),
      fotoUrl(l.map(function(m){return m.foto;}).concat(l.map(function(m){return m.audio;}),l.map(function(m){return m.file;}))),
      nomiCerchio(id).then(function(){return leggiNomi(l.map(function(m){return m.scritto_da;}));})
    ]).then(function(v){
      if(vista!=="team"||team.id!==id)return;
      team.prop={};v[0].forEach(function(p){team.prop[p.messaggio_id]=p.stato;});
      var basso=window.innerHeight+window.scrollY>=document.body.scrollHeight-120;
      team.msg=l;if(!document.getElementById("md-t")&&!document.getElementById("tc-arg-t"))disegnaTeam();
      if(((giu&&!team.inAlto)||(nuovi&&basso))&&!team.stanzeSu&&id!==ass.team){window.scrollTo(0,document.body.scrollHeight);
        /* le foto arrivano dopo: quando si caricano, si torna in fondo */
        [].forEach.call(document.querySelectorAll("#tc-msg img"),function(im){if(!im.complete)im.addEventListener("load",function(){if(!team.scelto&&!team.stanzeSu&&!team.inAlto)window.scrollTo(0,document.body.scrollHeight);},{once:true});});}
      if(nuovi||giu)segnaLetto(id);if(nuovi)assAperte();
    });
  },function(){});
}
function segnaLetto(id){
  if(Date.now()-team.letto<30000)return;team.letto=Date.now();
  db.rpc("fm_team_letto",{p_team:id}).then(function(){(team.lista||[]).forEach(function(t){if(t.team_id===id)t.non_letti=0;});(team.chat||[]).forEach(function(t){if(t.chat_id===id)t.non_letti=0;});numerini();},function(){});
}
function disegnaTeam(){
  var e=$("#tc-msg");if(!e)return;
  disegnaFissati();
  var giorno="",h=[];
  team.msg.forEach(function(m){
    var g=giornoRoma(m.scritto_il);if(g!==giorno){giorno=g;h.push('<div class="tc-giorno">'+esc(giornoTm(m.scritto_il))+'</div>');}
    var mio=m.scritto_da===io.id,p=team.prop[m.id];
    h.push((team.scelto===m.id?'<div class="tc-riga'+(mio?' mio':'')+'">':'')+'<div class="tc-m'+(mio?' mio':'')+(m.argomento||m.assistenza_id?' apre':'')+(team.scelto===m.id?' scelto':'')+'" data-m="'+esc(m.id)+'" role="button" tabindex="0" aria-expanded="'+(team.scelto===m.id)+'">'+
      (m.argomento?'<div class="arg"><span class="tc-segno" aria-hidden="true"></span>'+esc(m.argomento)+'</div>':'')+
      (mio?'':'<div class="chi">'+esc(nomi[m.scritto_da]||"")+'</div>')+
      (m.foto?(team.url[m.foto]?'<img src="'+esc(team.url[m.foto])+'" alt="Foto" loading="lazy">':'<div class="t" style="opacity:.7">Foto</div>'):'')+
      (m.audio?(team.url[m.audio]?'<audio controls preload="none" src="'+esc(team.url[m.audio])+'"></audio>':'<div class="t" style="opacity:.7">Vocale</div>'):'')+
      (m.file?'<a class="tc-file"'+(team.url[m.file]?' href="'+esc(team.url[m.file])+'" target="_blank" rel="noopener"':'')+'>'+ICO_AZ.file.replace('<svg ','<svg width="26" height="26" ')+'<span>'+esc(m.file_nome||"File")+'</span></a>':'')+
      (m.lat!=null&&m.lon!=null?mappaHTML(m.lat,m.lon):'')+
      (m.testo?testoLink(m.testo,"t","div"):'')+
      (m.registro_id?'<span class="pill-o">→ nel registro</span>':'')+
      (p?'<span class="pill-o">'+(p==="approvata"?"nel Cervello":"contenuto su cervello")+'</span>':'')+
      '<div class="ora">'+esc(hhmm(m.scritto_il))+(m.modificato_il?' · modificato':'')+'</div></div>'+(team.scelto===m.id?latoMsg(m)+'</div>':''));
    if(team.scelto===m.id)h.push(azioniMsg(m));
  });
  e.innerHTML=h.length?h.join(""):'<p class="nota" style="text-align:center;padding:20px 0">Ancora nessun messaggio. Scrivi il primo.</p>';
  e.querySelectorAll("[data-m]").forEach(function(d){
    function tocca(){var i=d.getAttribute("data-m");team.scelto=team.scelto===i?null:i;disegnaTeam();}
    d.onclick=function(ev){if(ev.target.closest("a,audio,iframe"))return;tocca();};
    d.onkeydown=function(ev){if(ev.key==="Enter"||ev.key===" "){ev.preventDefault();tocca();}};
  });
  legaAzioniMsg(e);
}
/* ═══ Chat dei team: Elimina · Fissa in alto · Fai uscire · per Company brain (strumento.html online) · thread «Il Praticantato», 1/11/2026 ═══
   Serve lo SQL 146 (fm_chat_guido, fm_elimina_messaggio, fm_fissa_messaggio, fm_fai_uscire, colonna fissato_il).
   Gab 31/10: ospite e karma yoga eliminano solo i propri; chi ha un ruolo (ed è nel team) e il nucleo eliminano anche quelli
   degli altri, fissano in alto (max 3) e fanno uscire dalla chat. 1/11 13:09 «s».
   Innesti (si cercano per testo, non per riga):
   1 · leggi dei messaggi: nel select di gruppo_messaggi aggiungere ",fissato_il".
   2 · vTeam: subito prima di  '<div id="tc-dir"></div>'  aggiungere  '<div id="tc-fiss"></div>'+
       e dopo  ricaricaTeam(true);  aggiungere  team.guido=false;guidoChat(id);
   3 · disegnaTeam: come prima riga dopo  var e=$("#tc-msg");if(!e)return;  aggiungere  disegnaFissati();
   4 · azioniMsg(m): prima di  '</div>';  finale aggiungere  +azioniRuolo(m)
   5 · legaAzioniMsg(e): dopo  var m=team.msg.filter(...)[0];if(!m)return;  aggiungere  legaAzioniRuolo(box,m);
   6 · CSS: FISS_CSS nello <style>. */

var FISS_CSS='#tc-fiss:empty{display:none}#tc-fiss{margin:10px 0 0;display:grid;gap:6px}'+
'.tc-fs{display:flex;gap:10px;align-items:flex-start;width:100%;text-align:left;padding:10px 14px;border-radius:14px;background:#1a2148;border:1px solid rgba(212,175,106,.45);color:#F5F0E6;font:400 16px "DM Sans",system-ui,sans-serif;cursor:pointer}'+
'.tc-fs .pin{flex:none;color:#D4AF6A;font-size:16px;line-height:1.4}'+
'.tc-fs .tx{flex:1;min-width:0;overflow-wrap:anywhere;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}'+
'.tc-fs a.ap{flex:none;color:#0a1430;background:#D4AF6A;border-radius:12px;padding:4px 10px;font-weight:600;text-decoration:none;align-self:center}'+
'.tc-az .el{border-color:#E07A5F;color:#E07A5F}';

function conLink(t){return esc(t).replace(/https:\/\/[^\s<]+/g,function(u){return '<a href="'+u+'" target="_blank" rel="noopener">'+u+'</a>';});}

function guidoChat(id){
  if(team.tipo!=="team")return;
  db.rpc("fm_chat_guido",{p_cerchio:id}).then(function(r){if(team.id!==id)return;team.guido=!!(r&&!r.error&&r.data);if(team.scelto)disegnaTeam();},function(){});
}

function disegnaFissati(){
  var f=$("#tc-fiss");if(!f)return;
  var l=team.msg.filter(function(m){return m.fissato_il;}).sort(function(a,b){return a.fissato_il<b.fissato_il?-1:1;});
  f.innerHTML=l.map(function(m){var u=((m.testo||"").match(/https:\/\/[^\s<]+/)||[""])[0],t=(m.testo||"").replace(/https:\/\/[^\s<]+/g,"").replace(/[\s·]+$/,"").trim();
    return '<div class="tc-fs" role="button" tabindex="0" data-fs="'+esc(m.id)+'"><span class="pin" aria-hidden="true">📌</span><span class="tx">'+
    (t?esc(t):u?"Link":(m.foto?"Foto":m.audio?"Vocale":m.file?esc(m.file_nome||"File"):"Posizione"))+'</span>'+
    (u?'<a class="ap" href="'+esc(u)+'"'+(u.indexOf(location.origin+"/")===0?'':' target="_blank" rel="noopener"')+'>Apri ›</a>':'')+'</div>';}).join("");
  f.querySelectorAll("[data-fs]").forEach(function(b){b.onclick=function(ev){if(ev.target.closest("a"))return;
    var d=document.querySelector('[data-m="'+b.getAttribute("data-fs")+'"]');if(d)d.scrollIntoView({behavior:"smooth",block:"center"});};});
}

function azioniRuolo(m){
  var mio=m.scritto_da===io.id,g=team.tipo==="team"&&team.guido,base=(team.lista||[]).some(function(t){return t.team_id===team.id&&t.nome==="Praticantato";});
  return (mio?'<button type="button" data-az="modifica">Modifica</button>':'')+(g?(m.fissato_il?'<button type="button" data-az="sfissa">Togli da in alto</button>':'<button type="button" data-az="fissa">Fissa in alto</button>'):'')+
    (g&&String(m.testo||"").trim()?'<button type="button" data-az="giornale">Pubblica nel Giornale</button>':'')+
    (mio||g?'<button type="button" class="el" data-az="elimina">Elimina</button>':'')+
    (g&&!mio&&!base&&m.scritto_da?'<button type="button" data-az="esci">Fai uscire '+esc(nomi[m.scritto_da]||"")+'</button>':'');
}

function legaAzioniRuolo(box,m){
  function esito(r){if(r&&!r.error&&r.data==="ok"){team.scelto=null;ricaricaTeam(false);return;}$("#tc-err").textContent=(r&&r.data)||errore(r&&r.error);}
  function chiedi(b,testo,fai){b.onclick=function(){if(b.getAttribute("data-sicuro")!=="1"){b.setAttribute("data-sicuro","1");b.textContent=testo;return;}
    b.disabled=true;fai().then(esito,function(e){b.disabled=false;$("#tc-err").textContent=errore(e);});};}
  function su(az,fai){var b=box.querySelector('[data-az="'+az+'"]');if(b)fai(b);}
  su("fissa",function(b){b.onclick=function(){b.disabled=true;db.rpc("fm_fissa_messaggio",{p_messaggio:m.id,p_si:true}).then(esito,function(){b.disabled=false;});};});
  su("sfissa",function(b){b.onclick=function(){b.disabled=true;db.rpc("fm_fissa_messaggio",{p_messaggio:m.id,p_si:false}).then(esito,function(){b.disabled=false;});};});
  su("elimina",function(b){chiedi(b,"Tocca ancora: sparisce per tutti",function(){return db.rpc("fm_elimina_messaggio",{p_messaggio:m.id});});});
  su("esci",function(b){chiedi(b,"Tocca ancora per farla uscire",function(){return db.rpc("fm_fai_uscire",{p_squadra:team.id,p_persona:m.scritto_da});});});
  su("modifica",function(b){b.onclick=function(){modificaMsg(box,m);};});
  /* 8/11 · SQL 214 · Gab 09:58 «ok pubblica nel giornale tasto»: il messaggio diventa un articolo del Giornale, per i vicinati o per tutti */
  su("giornale",function(b){b.onclick=function(){
    var w=document.createElement("span");w.className="tc-gio";
    w.innerHTML='<b>Nel Giornale, per chi?</b><button type="button" data-gv="vicinato">Vicinati</button><button type="button" data-gv="pubblico">Tutti</button><button type="button" data-gv="">Annulla</button>';
    b.replaceWith(w);
    w.querySelectorAll("[data-gv]").forEach(function(x){x.onclick=function(){var v=x.getAttribute("data-gv");
      if(!v){team.scelto=null;disegnaTeam();return;}
      w.querySelectorAll("button").forEach(function(y){y.disabled=true;});$("#tc-err").textContent="Un momento…";
      db.rpc("fm_giornale_dal_messaggio",{p_messaggio:m.id,p_vis:v}).then(function(q){
        if(q&&q.error){w.querySelectorAll("button").forEach(function(y){y.disabled=false;});$("#tc-err").textContent=(q.error.message&&!/PGRST|function|schema/i.test(q.error.message))?q.error.message:errore(q.error);return;}
        w.innerHTML='<b>È nel Giornale di oggi · '+(v==="pubblico"?"per tutti":"per i vicinati")+'</b>';$("#tc-err").textContent="";
      },function(x2){w.querySelectorAll("button").forEach(function(y){y.disabled=false;});$("#tc-err").textContent=errore(x2);});};});
  };});
}
var GIO_CSS='.tc-gio{display:inline-flex;flex-wrap:wrap;gap:8px;align-items:center}.tc-gio b{color:#D4AF6A;font-weight:600}'+
'.g4-cerv{display:inline-block;margin:8px 8px 0 0;padding:6px 12px;border-radius:12px;border:1px solid rgba(212,175,106,.55);color:#D4AF6A;text-decoration:none;font-weight:600}';
document.head.insertAdjacentHTML("beforeend","<style>"+GIO_CSS+"</style>");
/* ═══ Modifica del proprio messaggio · 1 novembre 2026 · thread «Capire il Company brain con i team» ═══
   Gab 1/11 13:35: «aggiungi anche la possibilità di modificare il post, in modo che io possa aggiungere anche altro testo
   o allegati, al link appena condiviso». Serve lo SQL 149 (fm_modifica_messaggio, colonna modificato_il).
   Solo chi ha scritto il messaggio vede «Modifica»: cambia il testo, aggiunge una foto e/o un file se non ci sono già.
   Prima si salva la riga (il percorso dell'allegato deve esistere perché lo spazio «chat» accetti il caricamento), poi si
   carica; se il caricamento fallisce l'allegato si toglie e il testo salvato resta. Accanto all'ora compare «modificato». */
var MOD_CSS='#md-t{flex:1 1 100%;min-height:72px;border-radius:14px;border:1px solid rgba(212,175,106,.45);background:#122050;color:#F5F0E6;font:400 17px "DM Sans",system-ui,sans-serif;padding:10px 12px;resize:vertical}'+
'.md-al{flex:1 1 100%;display:flex;gap:10px;align-items:center;flex-wrap:wrap}'+
'.md-lab{display:inline-flex;align-items:center;gap:6px;padding:8px 12px;border-radius:12px;border:1px solid rgba(212,175,106,.45);color:#D4AF6A;cursor:pointer;font-size:16px}.md-lab svg{width:22px;height:22px}'+
'.md-nome{font-size:15px;opacity:.8;overflow-wrap:anywhere}.md-err{flex:1 1 100%;margin:0;font-size:15px;color:#E07A5F}.md-err:empty{display:none}';
var MD_ACCETTA=".pdf,.txt,.rtf,.doc,.docx,.odt,.xls,.xlsx,.ods,.ppt,.pptx,.odp,application/pdf";
function modificaMsg(box,m){
  box.innerHTML='<textarea id="md-t" maxlength="2000" aria-label="Il testo del messaggio"></textarea>'+
    '<div class="md-al">'+
    (m.foto?'':'<label for="md-foto" class="md-lab">'+ICO_AZ.foto.replace(' width="26" height="26"','')+'Aggiungi foto</label><input type="file" id="md-foto" accept="image/*" hidden>')+
    (m.file?'':'<label for="md-file" class="md-lab">'+ICO_AZ.file+'Aggiungi file</label><input type="file" id="md-file" accept="'+MD_ACCETTA+'" hidden>')+
    '<span id="md-nome" class="md-nome"></span></div>'+
    '<button type="button" class="cerv" id="md-ok">Salva</button><button type="button" id="md-no">Annulla</button><p class="md-err" id="md-err" aria-live="polite"></p>';
  var t=$("#md-t");t.value=m.testo||"";t.focus();
  var foto=null,file=null;
  function nomi_(){var l=[];if(foto)l.push("Foto: "+(foto.name||""));if(file)l.push(file.name||"File");$("#md-nome").textContent=l.join(" · ");}
  if($("#md-foto"))$("#md-foto").onchange=function(e){foto=(e.target.files&&e.target.files[0])||null;nomi_();};
  if($("#md-file"))$("#md-file").onchange=function(e){file=(e.target.files&&e.target.files[0])||null;nomi_();};
  $("#md-no").onclick=function(){team.scelto=null;disegnaTeam();};
  $("#md-ok").onclick=function(){
    var b=this,e=$("#md-err"),testo=t.value.trim();
    if(!testo&&!m.foto&&!m.audio&&!m.file&&m.lat==null&&!foto&&!file){e.textContent="Scrivi qualcosa, o elimina il messaggio.";t.focus();return;}
    if(file&&file.size>26214400){e.textContent="Il file supera i 25 MB.";return;}
    b.disabled=true;e.textContent="Salvo…";
    var args={p_messaggio:m.id,p_testo:testo},pf=null,pd=null,blobF=null;
    function percorso(est){est=String(est||"bin").toLowerCase().replace(/[^a-z0-9]/g,"").slice(0,6)||"bin";return team.id+"/"+io.id+"/"+Date.now()+"-"+Math.random().toString(36).slice(2,8)+"."+est;}
    (foto?riduciFoto(foto):Promise.resolve(null)).then(function(bl){
      if(bl){if(bl.size>10485760)throw {msg:"La foto supera i 10 MB."};blobF=bl;pf=percorso(bl.type==="image/jpeg"?"jpg":(bl.type.split("/")[1]||"jpg"));args.p_foto=pf;}
      if(file){pd=percorso(String(file.name||"").split(".").pop());args.p_file=pd;args.p_file_nome=String(file.name||"File").slice(0,200);}
      return db.rpc("fm_modifica_messaggio",args);
    }).then(function(r){
      if(r&&r.error)throw {msg:errore(r.error)};
      if(r.data!=="ok")throw {msg:r.data};
      var su=[];
      if(blobF)su.push(db.storage.from("chat").upload(pf,blobF,{contentType:blobF.type||"image/jpeg",upsert:false}).then(function(u){
        if(u&&u.error)return db.rpc("fm_modifica_messaggio",{p_messaggio:m.id,p_togli:"foto"}).then(function(){throw {msg:"La foto non è stata caricata. Il testo è salvato: riprova la foto."};});}));
      if(file)su.push(db.storage.from("chat").upload(pd,file,{contentType:file.type||"application/octet-stream",upsert:false}).then(function(u){
        if(u&&u.error)return db.rpc("fm_modifica_messaggio",{p_messaggio:m.id,p_togli:"file"}).then(function(){throw {msg:"Il file non è stato caricato. Il testo è salvato: riprova il file."};});}));
      return Promise.all(su);
    }).then(function(){team.scelto=null;box.innerHTML="";disegnaTeam();ricaricaTeam(false);},function(x){b.disabled=false;e.textContent=(x&&x.msg)||errore(x);ricaricaTeam(false);});
  };
}
document.head.insertAdjacentHTML("beforeend","<style>"+MOD_CSS+"</style>");
