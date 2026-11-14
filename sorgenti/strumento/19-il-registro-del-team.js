/* ═══ IL REGISTRO DEL TEAM · SQL 90 ═══
   Schema approvato da Gab il 20/10 alle 14:37 (cervello-felicitas/output/registro-del-team.html).
   20 ott 10:52, Gab: «Oggi dovrebbe essere il contesto dove tu segni gli appuntamenti e le cose che stanno succedendo oggi.»
   20 ott 13:40: «manca proprio questo registro unico del team […] E la banca dei compiti con lo Stato, quello è importantissimo.»
   20 ott 21:55: «tutto quello che abbiamo detto e che è scritto nel giornale della sera deve essere attivato adesso»
   Una tavola sola (registro): si scrive in Oggi, si muove nel banco dei compiti (Obiettivi), resta nel Cervello per voce.
   Senza l'SQL 90 queste parti non compaiono. */
var REG_TIPI=[["da_fare","da fare"],["chiamata","chiamata"],["incontro","incontro"],["fatto","fatto"],["decisione","decisione"],["idea","idea"]];
var REG_TIPO={richiesta:"prenotazione"};REG_TIPI.forEach(function(x){REG_TIPO[x[0]]=x[1];});
var REG_VOCI=["Villaggi","Festival","Economia","Zona franca","Assistenza spirituale","Cervello digitale","Sviluppo"];
var REG_STATO={aperto:"aperto",preso:"preso",fatto:"fatto",annullato:"annullato"};
var REG_STATO_C={aperto:"s-in_coda",preso:"s-in_avanzamento",fatto:"s-sviluppato",annullato:"s-in_coda"};
var REG_VIS=[["cerchio","il gruppo"],["villaggio","il villaggio"],["solo_me","solo io"]];
var REG_VIS_N={cerchio:"il gruppo",villaggio:"il villaggio",solo_me:"solo io",ruolo:"chi ha il ruolo"};
function regQuanti(n){return n?" · "+n+(n===1?" persona":" persone"):"";}
var reg={guardo:"tutto",tipo:"da_fare",cerchi:null,cosaFa:null,manca:false};
function regCerchi(){
  if(reg.cerchi)return Promise.resolve(reg.cerchi);
  return db.rpc("fm_cerchi").then(function(r){reg.cerchi=((r&&!r.error&&r.data)||[]).filter(function(x){return x.dentro||x.guido;});return reg.cerchi;},function(){reg.cerchi=[];return reg.cerchi;});
}
function regCerchioDi(g){return g.vicinato_id||g.squadra_id||g.azienda_id||VILLAGGIO;}
function regNomeCerchio(id){if(!id||id===VILLAGGIO)return "il villaggio";var x=(reg.cerchi||[]).filter(function(c){return c.id===id;})[0];return x?x.nome:"";}
function regTuttiRuoli(){var l=[];Object.keys(RUOLI).forEach(function(f){RUOLI[f].forEach(function(r){l.push([f,r[0],FUNZIONI[f]+" · "+r[1]]);});});return l;}
function regNomeRuolo(r){var x=regTuttiRuoli().filter(function(y){return y[1]===r;})[0];return x?x[2]:r;}
function regMioRuolo(r){return (io.ruoli||[]).some(function(x){return x.ruolo===r;});}
/* i tasti dello stato: chi può fare cosa lo decide il database; qui si mostrano solo quelli sensati */
function regTasti(g){
  if(!g.stato)return "";
  var mio=g.preso_da===io.id,autore=g.scritto_da===io.id,guida=io.coordina||io.nucleo,b=[];
  if(g.stato==="aperto"){b.push('<button class="mini oro" data-rg="prendo|'+esc(g.id)+'">Lo prendo</button>');b.push('<button class="mini" data-rg="fatto|'+esc(g.id)+'">Fatto</button>');}
  if(g.stato==="preso"&&(mio||autore||guida)){b.push('<button class="mini oro" data-rg="fatto|'+esc(g.id)+'">Fatto</button>');b.push('<button class="mini" data-rg="riapro|'+esc(g.id)+'">'+(mio?"Lo lascio":"Riapri")+'</button>');}
  if(g.stato==="fatto"&&(mio||autore||guida))b.push('<button class="mini" data-rg="riapro|'+esc(g.id)+'">Riapri</button>');
  if((g.stato==="aperto"||g.stato==="preso")&&(autore||guida))b.push('<button class="mini" data-rg="annullo|'+esc(g.id)+'">Annulla</button>');
  return b.length?'<div class="fine">'+b.join("")+'</div>':"";
}
function regRiga(g,conData){
  var chi=g.preso_da?(nomi[g.preso_da]||"qualcuno"):"",da=nomi[g.scritto_da]||"";
  var quando=conData?new Date(g.scritto_il).toLocaleDateString("it-IT",{day:"numeric",month:"short"})+" ":"";
  return '<div class="card rg-riga"><div class="rg-testa"><span class="m">'+esc(quando+hhmm(g.scritto_il))+'</span><span class="t">'+esc(g.testo+regQuanti(g.quanti))+'</span></div>'+
    '<div class="rg-meta"><span class="pill s-in_coda">'+esc(REG_TIPO[g.tipo]||g.tipo)+'</span>'+(g.stato?'<span class="pill '+REG_STATO_C[g.stato]+'">'+esc(REG_STATO[g.stato])+(chi&&g.stato!=="aperto"?" · "+esc(chi):"")+'</span>':'')+
      (g.voce?'<span class="chip">'+esc(g.voce)+'</span>':'')+(g.ruolo?'<span class="chip f-'+esc(g.funzione||"")+'">'+esc(regNomeRuolo(g.ruolo))+'</span>':'')+
      '<span class="chip">'+esc(g.visibilita==="cerchio"?regNomeCerchio(regCerchioDi(g)):REG_VIS_N[g.visibilita]||"")+'</span></div>'+
    (g.con_chi?'<span class="m">con '+esc(g.con_chi)+'</span>':'')+
    (g.perche?'<span class="m rg-perche">perché: '+esc(g.perche)+'</span>':'')+
    (g.prossimo?'<span class="m">prossimo passo: '+esc(g.prossimo)+'</span>':'')+
    (g.entro_il?'<span class="m">entro il '+esc(new Date(g.entro_il+"T12:00").toLocaleDateString("it-IT",{day:"numeric",month:"long"}))+'</span>':'')+
    (da&&g.scritto_da!==io.id?'<span class="m">scritto da '+esc(da)+'</span>':'')+
    regTasti(g)+'</div>';
}
function regLega(box,dopo){
  box.querySelectorAll("[data-rg]").forEach(function(b){b.onclick=function(){var p=b.getAttribute("data-rg").split("|");b.disabled=true;
    db.rpc("fm_registro_"+p[0],{p_riga:p[1]}).then(function(r){if(r&&r.error)alert(errore(r.error));cache.obiettivi=null;dopo();},function(e){alert(errore(e));dopo();});};});
}
function regModulo(obiettivi){
  var cer=[[VILLAGGIO,"Il villaggio"]].concat((reg.cerchi||[]).map(function(c){return [c.id,c.nome];}));
  var dove=reg.guardo!=="tutto"?reg.guardo:VILLAGGIO;
  return '<div class="card modulo rg-nuovo"><b>Aggiungi un\'informazione</b>'+
    '<textarea id="rg-testo" maxlength="2000" aria-label="Aggiungi un\'informazione"></textarea>'+
    '<div class="lg-filtri" role="radiogroup" aria-label="Tipo">'+REG_TIPI.map(function(t){return '<button type="button" class="chip'+(reg.tipo===t[0]?" on":"")+'" role="radio" aria-checked="'+(reg.tipo===t[0])+'" data-rgtipo="'+t[0]+'">'+t[1]+'</button>';}).join("")+'</div>'+
    '<div class="due"><label>Dove<select id="rg-dove">'+cer.map(function(c){return '<option value="'+esc(c[0])+'"'+(c[0]===dove?" selected":"")+'>'+esc(c[1])+'</option>';}).join("")+'</select></label>'+
    '<label>Chi la vede<select id="rg-vis">'+REG_VIS.map(function(v){return '<option value="'+v[0]+'">'+v[1]+'</option>';}).join("")+'</select></label></div>'+
    '<details class="rg-altro"><summary>Voce, ruolo, perché, prossimo passo</summary><div class="modulo" style="margin-top:8px">'+
      '<div class="due"><label>Voce<input type="text" id="rg-voce" list="rg-voci" maxlength="80"></label>'+
      '<label>Per il ruolo<select id="rg-ruolo"><option value="">nessuno</option>'+regTuttiRuoli().map(function(r){return '<option value="'+esc(r[0]+":"+r[1])+'">'+esc(r[2])+'</option>';}).join("")+'</select></label></div>'+
      '<datalist id="rg-voci"></datalist>'+
      '<label>Con chi<input type="text" id="rg-con" maxlength="300"></label>'+
      '<label>Perché<textarea id="rg-perche" maxlength="2000" style="min-height:60px"></textarea></label>'+
      '<label>Prossimo passo<input type="text" id="rg-prossimo" maxlength="600"></label>'+
      '<div class="due"><label>Entro il<input type="date" id="rg-entro"></label>'+
      '<label>Obiettivo<select id="rg-ob"><option value="">nessuno</option>'+(obiettivi||[]).filter(function(o){return o.stadio!=="sviluppato";}).map(function(o){return '<option value="'+esc(o.id)+'">'+esc(o.titolo||o.contenuto||"")+'</option>';}).join("")+'</select></label></div>'+
    '</div></details>'+
    '<div class="azioni"><button class="btn pieno" id="rg-salva">Salva</button></div><div class="toast" id="rg-ok" hidden></div></div>';
}
function regSalva(dopo){
  var t=val("rg-testo");if(!t)return mostra("#rg-ok","Scrivi cosa succede.",true);
  var dove=val("rg-dove"),c=(reg.cerchi||[]).filter(function(x){return x.id===dove;})[0],ru=val("rg-ruolo").split(":");
  var riga={testo:t,tipo:reg.tipo,visibilita:val("rg-vis")||"cerchio",voce:val("rg-voce")||null,con_chi:val("rg-con")||null,perche:val("rg-perche")||null,
    prossimo:val("rg-prossimo")||null,entro_il:val("rg-entro")||null,obiettivo_id:val("rg-ob")||null,funzione:ru[1]?ru[0]:null,ruolo:ru[1]||null};
  if(c)riga[{vicinato:"vicinato_id",gruppo:"squadra_id",azienda:"azienda_id"}[c.tipo]]=c.id;
  var b=$("#rg-salva");b.disabled=true;
  db.from("registro").insert(riga).then(function(r){b.disabled=false;
    if(r&&r.error)return mostra("#rg-ok",errore(r.error),true);
    $("#rg-testo").value="";mostra("#rg-ok","Salvato nel registro.");cache.obiettivi=null;setTimeout(dopo,600);
  },function(e){b.disabled=false;mostra("#rg-ok",errore(e),true);});
}
/* Oggi: «Stai guardando», «Aggiungi un'informazione», le cose di oggi e quelle aperte per me o per il mio ruolo */
function vRegistroOggi(){
  var box=$("#o-reg");if(!box)return;
  var oggi=oggiISO();
  Promise.all([
    regCerchi(),
    db.from("registro").select("*").or("giorno.eq."+oggi+",stato.in.(aperto,preso)").order("scritto_il",{ascending:false}).limit(200).then(function(r){return r&&!r.error?(r.data||[]):null;},function(){return null;}),
    leggiObiettivi(),
    reg.cosaFa?Promise.resolve(reg.cosaFa):db.from("ruoli_cosa_fa").select("funzione,ruolo,cosa_fa").then(function(r){reg.cosaFa=(r&&!r.error&&r.data)||[];return reg.cosaFa;},function(){return [];}),
    /* SQL 92: i totali delle prenotazioni del Festival, per chi ha il ruolo Cibo o Formazione e per chi coordina */
    (io.coordina||regMioRuolo("cucina")||regMioRuolo("formazioni"))?db.rpc("fm_prenotazioni_conta").then(function(r){return (r&&!r.error&&r.data)||[];},function(){return [];}):Promise.resolve([])
  ]).then(function(v){
    if(vista!=="oggi"||!$("#o-reg"))return;
    var righe=v[1];
    if(righe===null){reg.manca=true;box.innerHTML=io.nucleo?'<p class="nota" style="margin:0 2px 10px">Il registro del team si apre con l\'SQL 90.</p>':'';return;}
    reg.manca=false;
    var g=reg.guardo;
    if(g!=="tutto")righe=righe.filter(function(x){return regCerchioDi(x)===g;});
    var miei=righe.filter(function(x){return x.giorno===oggi||x.preso_da===io.id||x.scritto_da===io.id||(x.ruolo&&regMioRuolo(x.ruolo));});
    var ids=[];miei.forEach(function(x){ids.push(x.scritto_da,x.preso_da);});
    leggiNomi(ids).then(function(){
      var mieiRuoli=(io.ruoli||[]).map(function(r){var c=(reg.cosaFa||[]).filter(function(x){return x.ruolo===r.ruolo;})[0];return '<div class="card"><span class="chip f-'+esc(r.funzione)+'" style="align-self:flex-start">'+esc(nomeRuolo(r.funzione,r.ruolo))+'</span>'+
        (c?'<span class="t">'+esc(c.cosa_fa)+'</span>':'<span class="m">Cosa fa chi ha questo ruolo lo scrive chi coordina.</span>')+'</div>';}).join("");
      var PREN={pranzo:"Pranzo",cena:"Cena",laboratori_bambini:"Laboratori per i bambini"},pc=v[4]||[];
      if(pc.length)mieiRuoli+='<div class="card"><b>Prenotazioni del Festival</b><div class="lg-conta" style="grid-template-columns:repeat('+pc.length+',1fr);margin:6px 0 0">'+pc.map(function(x){return '<div><b>'+(+x.persone)+'</b><small>'+esc(PREN[x.prenota]||x.prenota)+' · persone</small></div>';}).join("")+'</div><span class="m">Le singole prenotazioni sono nel banco dei compiti, in Obiettivi.</span></div>';
      box.innerHTML='<p class="et">Stai guardando</p><div class="lg-filtri" style="margin-top:6px">'+
          [["tutto","Tutto"],[VILLAGGIO,"Il villaggio"]].concat((reg.cerchi||[]).map(function(c){return [c.id,c.nome];})).map(function(c){return '<button class="chip'+(g===c[0]?" on":"")+'" data-rgguardo="'+esc(c[0])+'">'+esc(c[1])+'</button>';}).join("")+'</div>'+
        regModulo(v[2])+
        '<p class="et" style="margin-top:12px">Le cose di oggi</p>'+
        (miei.length?'<div class="rg-lista">'+miei.map(function(x){return regRiga(x,x.giorno!==oggi);}).join("")+'</div>':'<div class="vuoto">Ancora niente oggi'+(g!=="tutto"?" qui":"")+'.</div>')+
        (mieiRuoli?'<p class="et" style="margin-top:12px">Il tuo ruolo</p><div class="rg-lista">'+mieiRuoli+'</div>':'');
      box.querySelectorAll("[data-rgguardo]").forEach(function(b){b.onclick=function(){reg.guardo=b.getAttribute("data-rgguardo");vRegistroOggi();};});
      box.querySelectorAll("[data-rgtipo]").forEach(function(b){b.onclick=function(){reg.tipo=b.getAttribute("data-rgtipo");
        box.querySelectorAll("[data-rgtipo]").forEach(function(y){var on=y===b;y.classList.toggle("on",on);y.setAttribute("aria-checked",on);});};});
      var voci={};(v[1]||[]).forEach(function(x){if(x.voce)voci[x.voce]=1;});
      REG_VOCI.forEach(function(k){voci[k]=1;});
      $("#rg-voci").innerHTML=Object.keys(voci).sort().map(function(x){return '<option value="'+esc(x)+'">';}).join("");
      $("#rg-salva").onclick=function(){regSalva(vRegistroOggi);};
      regLega(box,vRegistroOggi);
    });
  });
}

