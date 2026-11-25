/* GESTIONE PRODOTTI · SQL 282 (16/11/2026). Gab 11:22: «un contesto di passaggio da quando un produttore propone il prodotto,
   che permette ai responsabili di confermare e mettere su emporio/giornale/cervello» · 11:38 confermano nucleo e ruoli Logistica ·
   11:44 margine e processo di produzione · 11:45 il margine può essere aumentato · 11:50 libri 25, oggettistica 15 (le altre dalla R74). */
var PD_CAT=[["alimenti","Alimenti",5],["rimedi","Rimedi",8],["cosmesi","Cosmesi",10],["oggettistica","Oggettistica",15],["abbigliamento","Abbigliamento",10],
  ["arredo","Arredo",10],["oggetti sacri","Oggetti sacri",10],["libri e stampati","Libri e stampati",25],["strumenti di coscienza","Strumenti di coscienza",0],["digitale","Digitale",20]];
function pdMin(c){var x=PD_CAT.filter(function(k){return k[0]===c;})[0];return x?x[2]:0;}
function pdNomeCat(c){var x=PD_CAT.filter(function(k){return k[0]===c;})[0];return x?x[1]:(c||"");}
var PD_LINK="https://app.felicitasmundi.com/communitas-aeterna-prova/strumento.html?prodotto=1";
function pdCondividi(b){
  var dopo=function(t){if(!b)return;var v=b.textContent;b.textContent=t;setTimeout(function(){b.textContent=v;},2500);};
  if(navigator.share){navigator.share({title:"Proponi il tuo prodotto",url:PD_LINK}).catch(function(){});return;}
  if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(PD_LINK).then(function(){dopo("Link copiato");},function(){prompt("",PD_LINK);});return;}
  prompt("",PD_LINK);
}
function prodottoDaLink(){
  var q=null;try{q=new URLSearchParams(location.search).get("prodotto");}catch(e){}
  if(q!=="1")return;
  if(!io.id){location.replace("accesso.html?torna="+encodeURIComponent("strumento.html?prodotto=1"));return;}
  setTimeout(function(){if(!document.getElementById("tc-foglio"))formProdotto(null);},700);
}
function contaProposte(){
  db.rpc("fm_prodotti_proposte").then(function(r){var b=$("[data-esp-conf]");if(!b)return;
    var l=(r&&!r.error&&r.data)||[];if(!l.length){b.style.display="none";return;}
    b.style.display="";var n=$("#esp-conf-n");if(n)n.innerHTML='<em class="esp-nl">'+l.length+'</em>';},function(){});
}
function formProdotto(p){
  p=p||{};var f=document.createElement("div");f.id="tc-foglio";document.body.appendChild(f);
  function chiudi(){f.remove();}
  var marg=p.margine!=null?+p.margine:pdMin(p.categoria||"alimenti"),foto=p.foto||"",blob=null;
  f.innerHTML='<div class="tc-velo" data-chiudi-f></div><div class="tc-foglio" role="dialog" aria-modal="true"><div class="tc-presa"></div>'+
    '<h2>'+(p.id?'Correggi il prodotto':'Aggiungi un prodotto')+'</h2>'+(p.id?'':'<p><button type="button" class="pd-cond" id="pd-cond">Condividi ›</button></p>')+(p.nota?'<p class="pd-nota">'+esc(p.nota)+'</p>':'')+
    '<label>Foto</label><div class="pd-foto" id="pd-foto">'+(foto?'<img src="'+esc(foto)+'" alt="">':'+ Aggiungi foto')+'</div><input type="file" id="pd-file" accept="image/*" hidden>'+
    '<label for="pd-nome">Nome</label><input type="text" id="pd-nome" maxlength="200" value="'+esc(p.nome||"")+'">'+
    '<label for="pd-desc">Descrizione</label><textarea class="pd-t" id="pd-desc" maxlength="4000">'+esc(p.descrizione||"")+'</textarea>'+
    '<label for="pd-cat">Categoria</label><select id="pd-cat">'+PD_CAT.map(function(k){return '<option value="'+k[0]+'"'+((p.categoria||"alimenti")===k[0]?' selected':'')+'>'+k[1]+'</option>';}).join("")+'</select>'+
    '<label for="pd-proc">Processo di produzione</label><textarea class="pd-t" id="pd-proc" maxlength="4000">'+esc(p.processo||"")+'</textarea>'+
    '<div class="ag-due"><div><label for="pd-prezzo">Prezzo €</label><input type="number" id="pd-prezzo" min="0" step="0.01" inputmode="decimal" value="'+(p.prezzo!=null?esc(String(p.prezzo)):'')+'"></div>'+
    '<div><label for="pd-q">Quantità</label><div class="ag-due"><input type="number" id="pd-q" min="0" step="1" inputmode="numeric" value="'+(p.quantita!=null?esc(String(p.quantita)):'')+'">'+
    '<select id="pd-u" aria-label="Unità">'+["pz","kg","g","l","conf"].map(function(u){return '<option'+(p.unita===u?' selected':'')+'>'+u+'</option>';}).join("")+'</select></div></div></div>'+
    '<label>Margine riconosciuto a Felicitas</label><div class="pd-marg"><button type="button" id="pd-meno" aria-label="Meno">−</button><b id="pd-m"></b><button type="button" id="pd-piu" aria-label="Più">+</button></div>'+
    '<label class="pd-dir"><input type="checkbox" id="pd-dir"><span>Dichiaro di avere il diritto di pubblicare questa immagine, comprese le persone che vi compaiono.</span></label>'+
    '<button type="button" class="tc-btn" id="pd-invia">Proponi</button><p class="tc-nota" id="pd-esito" aria-live="polite"></p></div>';
  f.querySelector("[data-chiudi-f]").onclick=chiudi;
  if($("#pd-cond"))$("#pd-cond").onclick=function(){pdCondividi(this);};
  function mostra(){var m=pdMin($("#pd-cat").value);if(marg<m)marg=m;if(marg>100)marg=100;$("#pd-m").textContent=marg+"%";$("#pd-meno").disabled=marg<=m;}
  $("#pd-cat").onchange=function(){marg=pdMin(this.value);mostra();};
  $("#pd-meno").onclick=function(){marg-=1;mostra();};$("#pd-piu").onclick=function(){marg+=1;mostra();};mostra();
  $("#pd-foto").onclick=function(){$("#pd-file").click();};
  $("#pd-file").onchange=function(){var x=this.files&&this.files[0];if(!x)return;
    riduciFoto(x).then(function(b){blob=b;$("#pd-foto").innerHTML='<img src="'+URL.createObjectURL(b)+'" alt="">';});};
  $("#pd-invia").onclick=function(){var b=this,e=$("#pd-esito");
    if(!foto&&!blob){e.textContent="Manca: foto.";return;}
    if(!$("#pd-dir").checked){e.textContent="Manca: dichiarazione sulla foto.";return;}
    b.disabled=true;e.textContent="Un momento…";
    var su=blob?db.storage.from("vetrina").upload("proposte/"+io.id+"/"+Date.now()+"-"+Math.random().toString(36).slice(2,8)+".jpg",blob,{contentType:blob.type||"image/jpeg",upsert:false}).then(function(u){
        if(u&&u.error)throw {msg:"La foto non è stata caricata. Riprova."};
        return db.storage.from("vetrina").getPublicUrl(u.data.path).data.publicUrl;}):Promise.resolve(foto);
    su.then(function(url){foto=url;blob=null;
      return db.rpc("fm_prodotto_proponi",{p:{id:p.id||null,nome:$("#pd-nome").value,descrizione:$("#pd-desc").value,foto:url,categoria:$("#pd-cat").value,
        processo:$("#pd-proc").value,prezzo:$("#pd-prezzo").value,quantita:$("#pd-q").value,unita:$("#pd-u").value,margine:marg,diritti:$("#pd-dir").checked}});
    }).then(function(r){b.disabled=false;
      if(r&&r.error){e.textContent=errore(r.error);return;}
      if(r.data!=="ok"){e.textContent=r.data;return;}
      chiudi();contaProposte();mieiProdotti();
    },function(x){b.disabled=false;e.textContent=(x&&x.msg)||errore(x);});
  };
}
function prodottiDaConfermare(){
  var f=document.createElement("div");f.id="tc-foglio";document.body.appendChild(f);
  function chiudi(){f.remove();contaProposte();}
  f.innerHTML='<div class="tc-velo" data-chiudi-f></div><div class="tc-foglio" role="dialog" aria-modal="true"><div class="tc-presa"></div>'+
    '<h2>Da confermare</h2><div id="pd-lista"><p>Un momento…</p></div></div>';
  f.querySelector("[data-chiudi-f]").onclick=chiudi;
  function disegna(){
    db.rpc("fm_prodotti_proposte").then(function(r){var box=$("#pd-lista");if(!box)return;
      if(!r||r.error){box.innerHTML='<p>'+esc(errore(r&&r.error))+'</p>';return;}
      var l=r.data||[];if(!l.length){box.innerHTML='<p>Niente da confermare.</p>';return;}
      box.innerHTML=l.map(function(p,i){
        return '<div class="tm-ric pd-c">'+(p.foto?'<img src="'+esc(/^https?:/.test(p.foto)?p.foto:"../communitas-aeterna/"+p.foto)+'" alt="" loading="lazy">':'')+'<b>'+esc(p.nome)+'</b>'+
          '<span class="m">'+esc(p.produttore)+(p.luogo?' · '+esc(p.luogo):'')+(p.il?' · '+esc(assQuando(p.il)):'')+' · '+esc(String(p.prezzo))+' € · '+esc(String(p.quantita))+' '+esc(p.unita||"")+'</span>'+
          '<p>'+esc(p.descrizione||"")+'</p><p class="m">'+esc(pdNomeCat(p.categoria))+' · margine a Felicitas '+esc(String(p.margine))+'%</p>'+
          '<p>'+esc(p.processo||"")+'</p>'+(p.nota?'<p class="pd-nota">'+esc(p.nota)+'</p>':'')+
          (p.conferma?'<label class="pd-sw">Nell\'Emporio<input type="checkbox" data-pd-e="'+i+'" checked></label>'+
            '<label class="pd-sw">Nel Cervello, visibile a tutti<input type="checkbox" data-pd-c="'+i+'" checked></label>':'')+
          '<div class="pd-due">'+(p.conferma?'<button type="button" class="tc-btn" data-pd-ok="'+i+'">Conferma</button>':'')+
          (p.risponde?'<button type="button" class="tc-btn sec" data-pd-no="'+i+'">Da correggere</button>':'')+
          (p.mio&&p.nota?'<button type="button" class="tc-btn sec" data-pd-mio="'+i+'">Correggi</button>':'')+'</div>'+
          '<div data-pd-box="'+i+'"></div><p class="tc-nota" data-pd-es="'+i+'" aria-live="polite"></p></div>';}).join("");
      box.querySelectorAll("[data-pd-ok]").forEach(function(b){b.onclick=function(){var i=b.getAttribute("data-pd-ok"),p=l[i],es=box.querySelector('[data-pd-es="'+i+'"]');
        var em=box.querySelector('[data-pd-e="'+i+'"]').checked,ce=box.querySelector('[data-pd-c="'+i+'"]').checked;
        if(!em&&!ce){es.textContent="Scegli Emporio, Cervello o tutti e due.";return;}
        b.disabled=true;es.textContent=em?"Creo il pagamento su Stripe…":"Un momento…";
        var fine=function(t){b.disabled=false;if(t)es.textContent=t;else disegna();};
        var cerv=function(){return ce?db.rpc("fm_prodotto_conferma",{p_id:p.id,p_emporio:false,p_cervello:true}).then(function(x){if(x&&x.error)return errore(x.error);return x.data==="ok"?"":x.data;}):Promise.resolve("");};
        (em?db.functions.invoke("fm-prodotto-stripe",{body:{azione:"conferma",id:p.id}}).then(function(x){var d=x&&x.data;
            if(!d||!d.ok)return (d&&d.msg)||"Stripe non risponde. Riprova tra poco.";return cerv();}):cerv()).then(fine,function(){fine("Riprova tra poco.");});};});
      box.querySelectorAll("[data-pd-no]").forEach(function(b){b.onclick=function(){var i=b.getAttribute("data-pd-no"),p=l[i],c=box.querySelector('[data-pd-box="'+i+'"]');
        c.innerHTML='<textarea class="pd-t" maxlength="1000" aria-label="Cosa va corretto"></textarea><button type="button" class="tc-btn">Invia</button>';
        var t=c.querySelector("textarea"),bi=c.querySelector("button"),es=box.querySelector('[data-pd-es="'+i+'"]');t.focus();
        bi.onclick=function(){bi.disabled=true;db.rpc("fm_prodotto_correggi",{p_id:p.id,p_nota:t.value}).then(function(x){bi.disabled=false;
          if(x&&x.error){es.textContent=errore(x.error);return;}if(x.data!=="ok"){es.textContent=x.data;return;}disegna();},function(){bi.disabled=false;es.textContent="Riprova tra poco.";});};};});
      box.querySelectorAll("[data-pd-mio]").forEach(function(b){b.onclick=function(){var p=l[b.getAttribute("data-pd-mio")];f.remove();formProdotto(p);};});
    },function(){var box=$("#pd-lista");if(box)box.innerHTML='<p>Riprova tra poco.</p>';});
  }
  disegna();
}
var PROD_STATI={pubblico:"nell'Emporio",proposto:"da confermare",nel_team:"nel team",da_controllare:"da controllare",in_controllo:"in controllo",da_confermare:"da confermare",respinta:"respinta"};
function mieiProdotti(){
  var f=document.createElement("div");f.id="tc-foglio";document.body.appendChild(f);
  function chiudi(){f.remove();}
  f.innerHTML='<div class="tc-velo" data-chiudi-f></div><div class="tc-foglio" role="dialog" aria-modal="true"><div class="tc-presa"></div>'+
    '<h2>I miei prodotti</h2><div id="mp-lista"><p>Un momento…</p></div>'+
    '<button type="button" class="tc-btn" id="mp-nuovo">Aggiungi un prodotto</button><p class="tc-nota" id="mp-esito" aria-live="polite"></p></div>';
  f.querySelector("[data-chiudi-f]").onclick=chiudi;
  var fest=(team.lista||[]).filter(function(t){return t.nome==="Vicinati del Cibo"||t.nome==="Felicitas Festival";})[0];
  $("#mp-nuovo").onclick=function(){chiudi();formProdotto(null);};
  function disegna(){
    db.rpc("fm_miei_prodotti").then(function(r){var box=$("#mp-lista");if(!box)return;
      if(!r||r.error){box.innerHTML='<p>'+esc(errore(r&&r.error))+'</p>';return;}
      var l=r.data||[];
      if(!l.length){box.innerHTML='<p>Ancora nessun prodotto</p>';return;}
      box.innerHTML=l.map(function(p){var st=esc(PROD_STATI[p.stato]||p.stato||"");
        if(p.tipo==="card")return '<div class="tm-ric"><b>'+esc(p.nome)+'</b><span class="m">'+st+'</span></div>';
        return '<div class="tm-ric"><b>'+esc(p.nome)+'</b><span class="m">'+st+(p.prezzo!=null?' · '+esc(String(p.prezzo))+' €':'')+'</span>'+
          '<div class="ag-due" style="margin-top:8px"><input type="number" min="0" step="1" inputmode="numeric" data-mp-q="'+esc(p.id)+'" value="'+(p.quantita!=null?esc(String(p.quantita)):'')+'" aria-label="Quantità">'+
          '<select data-mp-u="'+esc(p.id)+'" aria-label="Unità">'+["kg","g","l","pz","conf"].map(function(u){return '<option'+(p.unita===u?' selected':'')+'>'+u+'</option>';}).join("")+'</select></div>'+
          '<div class="tc-az" style="margin:8px 0 0"><button type="button" class="cerv" data-mp-salva="'+esc(p.id)+'">Salva</button>'+
          '</div></div>';}).join("");
      box.querySelectorAll("[data-mp-salva]").forEach(function(b){b.onclick=function(){var id=b.getAttribute("data-mp-salva"),
          q=box.querySelector('[data-mp-q="'+id+'"]'),u=box.querySelector('[data-mp-u="'+id+'"]'),e=$("#mp-esito");
        b.disabled=true;db.rpc("fm_mia_quantita",{p_prodotto:id,p_quantita:q.value===""?null:parseInt(q.value,10),p_unita:u.value}).then(function(x){b.disabled=false;
          e.textContent=x&&!x.error?(x.data==="ok"?"Salvato.":x.data):errore(x&&x.error);},function(){b.disabled=false;e.textContent="Riprova tra poco.";});};});
    },function(){var box=$("#mp-lista");if(box)box.innerHTML='<p>Riprova tra poco.</p>';});
  }
  disegna();
}
/* nuova chat · 8 nov, Gab: «quella lista è impensabile […] io preferirei che in tutti i casi si crea qualcosa creando un link che poi va all invitato»
   → niente elenco «Con chi»: due righe di presentazione, «Crea il link», lo si manda; chi lo apre entra e si trova in chat (SQL 223) */
function nuovaChat(){
  var box=$("#tm-chat");if(!box)return;
  var f=document.createElement("div");f.id="tc-foglio";document.body.appendChild(f);
  function chiudi(){f.remove();}
  f.innerHTML='<div class="tc-velo" data-chiudi-f></div><div class="tc-foglio" role="dialog" aria-modal="true"><div class="tc-presa"></div>'+
    '<h2>Nuova chat</h2><p>Scrivi due righe per presentarti e crea il link. Mandalo alla persona con cui vuoi parlare: quando lo apre, vi trovate in chat.</p>'+
    '<label for="nc-pres">Presentati in due righe</label><textarea id="nc-pres" maxlength="1000"></textarea>'+
    '<button type="button" class="tc-btn" id="nc-ok">Crea il link</button><div id="nc-link"></div><p class="tc-nota" id="nc-esito" aria-live="polite"></p></div>';
  f.querySelector("[data-chiudi-f]").onclick=chiudi;
  $("#nc-ok").onclick=function(){var b=this,e=$("#nc-esito"),t=$("#nc-pres").value.trim();
    if(!t){e.textContent="Scrivi due righe per presentarti.";return;}
    b.disabled=true;e.textContent="Un momento…";
    db.rpc("fm_chat_link",{p_presentazione:t}).then(function(r){
      if(!r||r.error||!r.data){b.disabled=false;e.textContent=errore(r&&r.error);return;}
      var u=new URL("strumento.html?chatlink="+encodeURIComponent(r.data),location.href).href;
      var msg=t+"\n"+u;
      e.textContent="Il link vale 7 giorni, per una persona.";b.hidden=true;
      $("#nc-link").innerHTML='<p style="word-break:break-all;font-size:14px;margin:10px 0">'+esc(u)+'</p>'+
        '<a class="tc-btn" style="display:flex;align-items:center;justify-content:center;box-sizing:border-box;text-decoration:none;margin-bottom:8px;padding-top:0;padding-bottom:0" target="_blank" rel="noopener" href="https://wa.me/?text='+encodeURIComponent(msg)+'">Manda con WhatsApp</a>'+
        '<button type="button" class="tc-btn" id="nc-copia">Copia il link</button>';
      $("#nc-copia").onclick=function(){var c=this;function ok(){c.textContent="Copiato";}
        try{navigator.clipboard.writeText(u).then(ok,function(){prompt("Copia il link:",u);});}catch(x){prompt("Copia il link:",u);}};
    },function(x){b.disabled=false;e.textContent=errore(x);});};
}
function leggiTeam(){
  return db.rpc("fm_miei_team").then(function(r){if(!r||r.error||!r.data)return null;team.lista=r.data;return r.data;},function(){return null;});
}
function mieiTeam(){
  leggiTeam().then(function(l){
    var box=$("#tm-box");if(!box||vista!=="azione")return;
    if(!l){box.innerHTML="";var h=$(".tm-tit");if(h)h.remove();return;}
    leggiNomi(l.map(function(t){return t.ultimo_da;})).then(function(){
      if(!box.isConnected)return;
      /* 7/11 Gab: «la prima card, da sola, Praticantato» · «i team FELICITASMUNDI» · «i team specifici» (SQL 201) */
      function ulT(t){var chi=t.ultimo_da?(t.ultimo_da===io.id?"Tu":(nomi[t.ultimo_da]||"")):"";
        return t.ultimo_il?(chi?chi+": ":"")+(t.ultimo_testo||(t.ultimo_foto?"Foto":"")):"Ancora nessun messaggio";}
      function riga(t){
        var de=t.descrizione?'<span class="tm-de">'+esc(t.descrizione)+'</span>':(io.nucleo&&t.quadrante==="felicitasmundi"?'<span class="tm-scrivi" role="button" tabindex="0" data-tm-desc="'+esc(t.team_id)+'">Scrivi la descrizione</span>':'');
        return '<button type="button" class="tm-ch'+(t.base?' base':'')+'" data-team="'+esc(t.team_id)+'"><span class="tm-seg" aria-hidden="true">'+esc(iniziale(t.nome))+'</span>'+
          '<span class="tm-mezzo"><b>'+esc(t.nome)+(t.base&&!t.quadrante?'<span class="tm-base">per tutti</span>':'')+'</b>'+de+'<span class="tm-ul">'+esc(ulT(t))+'</span></span>'+
          '<span class="tm-dx">'+(t.ultimo_il?esc(quandoTm(t.ultimo_il)):'')+(t.non_letti?'<br><em aria-label="'+t.non_letti+' da leggere">'+t.non_letti+'</em>':'')+'</span></button>';}
      var qu=l.some(function(t){return !!t.quadrante;});
      if(!qu){box.innerHTML='<div class="tm-lista">'+l.map(riga).join("")+'</div>';}
      else{
        var pr=l.filter(function(t){return t.quadrante==="praticantato";}),fm=l.filter(function(t){return t.quadrante==="felicitasmundi";}),sp=l.filter(function(t){return t.quadrante!=="praticantato"&&t.quadrante!=="felicitasmundi";});
        box.innerHTML='<div class="tm-giro">'+pr.map(function(t){return '<button type="button" class="tm-pr" data-team="'+esc(t.team_id)+'"><b>'+esc(t.nome)+'</b>'+
            /* 16/11/2026, Gab: «in espandi non serve avere tutta la presentazione di cosa sia praticantato.. bastano 2 frasi» (frasi di praticantato.html) */
            '<span class="tm-def">Riconosci il tuo talento e trasformalo in un progetto che la comunità può accogliere.</span><span class="tm-def">Percorso online ogni lunedì alle 19 con Gabriele Dettori.</span>'+
            '<span class="tm-ul">'+esc(ulT(t))+(t.non_letti?' · <em aria-label="'+t.non_letti+' da leggere">'+t.non_letti+'</em>':'')+'</span><span class="tm-entra">Entra nel Praticantato ›</span></button>';}).join("")+
          fm.map(riga).join("")+sp.map(riga).join("")+'</div>';
      }
      box.querySelectorAll("[data-tm-desc]").forEach(function(d){function scrivi(e){e.stopPropagation();e.preventDefault();
        var id=d.getAttribute("data-tm-desc"),v=prompt("La descrizione del team, con le tue parole");if(v==null||!v.trim())return;
        db.rpc("fm_team_descrizione",{p_squadra:id,p_testo:v.trim()}).then(function(x){if(x&&x.error){alert(errore(x.error));return;}mieiTeam();},function(){});}
        d.onclick=scrivi;d.onkeydown=function(e){if(e.key==="Enter")scrivi(e);};});
      box.querySelectorAll("[data-team]").forEach(function(b){b.onclick=function(){team.id=b.getAttribute("data-team");vai("team");};});
    });
  });
}
/* le proposte «Metti nel Cervello» in attesa: le decide il nucleo o chi ha un ruolo nel team (fm_proposta_decidi, SQL 165).
   6/11/2026 · agente AI (SQL 156/165): se l'agente ha impaginato (agente_stato «pronta») si vedono le sue card e il capitolo proposto;
   «Pubblica» e «Scarta». Gab 4/11: «se uno condivide la foto di un testo, deve esserci scritto subito "contenuto su cervello"». */
function daApprovare(){
  var box=$("#tm-attesa");if(!box)return;
  var CAMPI="id,squadra_id,capitolo_id,capitolo_nuovo,testo,foto,autore_id,proposta_il";
  db.from("cervello_proposte").select(CAMPI+",agente_stato,agente_capitolo_id,agente_capitolo_nuovo,agente_card,agente_nota").eq("stato","in_attesa").not("squadra_id","is",null).order("proposta_il").limit(30).then(function(r){
    if(r&&r.error)return db.from("cervello_proposte").select(CAMPI).eq("stato","in_attesa").not("squadra_id","is",null).order("proposta_il").limit(30);return r;}).then(function(r){
    var l=(r&&!r.error&&r.data)||[];if(!l.length||!box.isConnected){box.innerHTML="";return;}
    var caps=l.map(function(p){return p.capitolo_id;}).concat(l.map(function(p){return p.agente_capitolo_id;})).filter(Boolean);
    Promise.all([
      caps.length?db.from("cervello_capitoli").select("id,titolo").in("id",caps).then(function(x){return (x&&!x.error&&x.data)||[];},function(){return [];}):Promise.resolve([]),
      fotoUrl(l.map(function(p){return p.foto;})),
      leggiNomi(l.map(function(p){return p.autore_id;}))
    ]).then(function(v){
      var tit={};v[0].forEach(function(x){tit[x.id]=x.titolo;});
      var nt={};(team.lista||[]).forEach(function(t){nt[t.team_id]=t.nome;});
      box.innerHTML='<p class="tm-et">Da mettere nel Cervello</p><div class="tm-giro">'+l.map(function(p){
        var pronta=p.agente_stato==="pronta"&&Array.isArray(p.agente_card)&&p.agente_card.length,lavora=p.agente_stato==="da_fare"||p.agente_stato==="in_corso";
        var cap=pronta&&(p.agente_capitolo_id||p.agente_capitolo_nuovo)?(p.agente_capitolo_id?tit[p.agente_capitolo_id]:p.agente_capitolo_nuovo+" · capitolo nuovo"):(p.capitolo_id?tit[p.capitolo_id]:(p.capitolo_nuovo?p.capitolo_nuovo+" · capitolo nuovo":""));
        return '<div class="tm-prop"><span class="m">'+esc([nt[p.squadra_id],cap,nomi[p.autore_id]].filter(Boolean).join(" · "))+'</span>'+
          (pronta?p.agente_card.map(function(c){return '<div class="ag-card">'+(c&&c.titolo?'<b>'+esc(c.titolo)+'</b>':'')+'<p>'+esc((c&&c.testo)||"")+'</p></div>';}).join("")+'</div>':(p.testo?'<div class="tc-citato">'+esc(p.testo)+'</div>':''))+
          (p.foto&&team.url[p.foto]?'<img src="'+esc(team.url[p.foto])+'" alt="">':'')+
          (lavora?'<p class="ag-nota">L\'agente la sta lavorando.</p>':'')+
          ((p.agente_stato==="errore"||pronta)&&p.agente_nota?'<p class="ag-nota">'+esc(p.agente_nota)+'</p>':'')+
          '<div class="tc-az"><button type="button" class="cerv" data-decidi="'+esc(p.id)+'" data-si="1"'+(lavora?' disabled':'')+'>Pubblica</button><button type="button" data-decidi="'+esc(p.id)+'">Scarta</button></div></div>';}).join("")+'<p class="az-esito" id="tm-att-esito" aria-live="polite"></p>';
      box.querySelectorAll("[data-decidi]").forEach(function(b){b.onclick=function(){b.disabled=true;
        db.rpc("fm_proposta_decidi",{p_proposta:b.getAttribute("data-decidi"),p_si:b.hasAttribute("data-si")}).then(function(x){
          if(x&&!x.error&&x.data==="ok"){daApprovare();return;}b.disabled=false;$("#tm-att-esito").textContent=(x&&x.data)||errore(x&&x.error);},
          function(){b.disabled=false;});};});
    });
  },function(){});
}
