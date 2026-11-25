/* ═══ LA LOGISTICA DEL VILLAGGIO ═══
   20 ott 12:16, Gab: «io non posso vendere fuori qualcosa che non faccio dentro […] cosa stiamo proponendo fuori lo dobbiamo avere dentro, al massimo del livello» · 12:21 «Ok».
   20 ott 07:11, Gab: il Cervello è il gestionale: «chi c'è, chi sta facendo cosa, quanti sono i prodotti in uscita, quanti sono i prodotti in entrata, chi è stato pagato».
   Solo SQL già lanciati: 74 (merce_lotti, logistica_compiti, fm_compito_*, fm_giacenze, fm_rendiconto) e 75 (fm_luoghi_del_villaggio).
   Chi vede cosa lo decidono le regole del 74: ognuno i compiti del suo ruolo, chi coordina tutto; il rendiconto a chi coordina, all'Emporio e ai Produttori. */
var RUOLI_LOG=[["emporio","Emporio"],["magazzino","Magazzino"],["produttori","Produttori"],["eventi","Eventi"]];
var MOVIMENTI=[["arrivo","Arrivo dal produttore"],["vendita","Vendita"],["consegna","Consegna a una persona"],["reso_persona","Reso di una persona"],["riconsegna_produttore","Riconsegna al produttore"],["uscita_verso_punto","Uscita verso un altro punto"],["entrata_da_punto","Entrata da un altro punto"],["scarto","Scarto"]];
var lgFiltro="tutti";
function lgData(t){return t?new Date(t).toLocaleDateString("it-IT",{day:"numeric",month:"short"}):"";}
function lgNum(n){n=+n||0;return (Math.round(n*1000)/1000).toLocaleString("it-IT");}
function lgEuro(n){return (+n||0).toLocaleString("it-IT",{style:"currency",currency:"EUR"});}
function vLogistica(){
  var box=$("#lg");if(!box)return;
  var questo=cerchio;
  box.innerHTML='<p class="et" style="margin-top:12px">La logistica · per chi ci lavora</p><p class="nota">Un momento…</p>';
  var dal=new Date(Date.now()-30*864e5).toISOString();
  function ok(r){return r&&!r.error?(r.data||[]):[];}
  function no(){return [];}
  Promise.all([
    db.from("logistica_compiti").select("id,punto_id,ruolo,titolo,nota,entro_il,movimento,lotto_id,quantita,preso_da,preso_il,fatto_da,fatto_il,annullato_il,creato_il").is("annullato_il",null).order("creato_il",{ascending:false}).limit(300).then(ok,no),
    db.from("merce_lotti").select("id,partner_id,nome,unita,prezzo_vendita,prezzo_produttore,lotto,scade_il,chiuso_il").order("creato_il",{ascending:false}).then(ok,no),
    db.rpc("fm_luoghi_del_villaggio",{p_villaggio:VILLAGGIO}).then(ok,no),
    db.rpc("fm_giacenze").then(ok,no),
    db.rpc("fm_rendiconto").then(ok,no),
    db.from("partner").select("id,nome").order("nome").then(ok,no),
    db.from("orme").select("id,titolo").eq("id",FEST_ID).then(ok,no)
  ]).then(function(v){
    if(cerchio!==questo||!$("#lg"))return;
    var comp=v[0].filter(function(c){return !c.fatto_il||c.fatto_il>=dal;}),lotti=v[1],luoghi=v[2],gia=v[3],ren=v[4],partner=v[5],feste=v[6];
    var punti={},lot={};
    luoghi.forEach(function(l){punti[l.id]=l.titolo;});feste.forEach(function(f){punti[f.id]=f.titolo;});
    lotti.forEach(function(l){lot[l.id]=l;});
    var ids=[];comp.forEach(function(c){ids.push(c.preso_da,c.fatto_da);});
    leggiNomi(ids).then(function(){
      if(cerchio!==questo||!$("#lg"))return;
      var aperti=comp.filter(function(c){return !c.preso_da&&!c.fatto_il;}),presi=comp.filter(function(c){return c.preso_da&&!c.fatto_il;}),fatti=comp.filter(function(c){return c.fatto_il;});
      var nei=gia.filter(function(g){return +g.giacenza>0;});
      function filtra(l){return lgFiltro==="tutti"?l:l.filter(function(c){return c.ruolo===lgFiltro;});}
      function scheda(c){
        var l=lot[c.lotto_id],q=c.movimento?(c.quantita!=null?lgNum(c.quantita)+" "+((l&&l.unita)||"")+" · ":"")+((l&&l.nome)||"merce"):"";
        var mov=c.movimento?(MOVIMENTI.filter(function(m){return m[0]===c.movimento;})[0]||[0,c.movimento])[1]:"";
        var chi=c.fatto_il?"fatto da "+(nomi[c.fatto_da]||"—")+" · "+lgData(c.fatto_il):c.preso_da?"preso da "+(c.preso_da===io.id?"te":(nomi[c.preso_da]||"—"))+" · "+lgData(c.preso_il):"";
        var mio=(io.ruoli||[]).some(function(r){return r.funzione==="logistica"&&r.ruolo===c.ruolo;})||io.coordina;
        return '<div class="card"><span class="t">'+esc(c.titolo)+'</span>'+
          '<span class="m">'+esc(nomeRuolo("logistica",c.ruolo))+' · '+esc(punti[c.punto_id]||"un punto")+(c.entro_il&&!c.fatto_il?' · entro il '+esc(lgData(c.entro_il)):'')+'</span>'+
          (q?'<span class="m">'+esc(mov)+' · '+esc(q)+'</span>':'')+
          (c.nota?'<span class="m">'+esc(c.nota)+'</span>':'')+
          (chi?'<span class="m">'+esc(chi)+'</span>':'')+
          (!c.fatto_il&&mio?'<div class="fine">'+(!c.preso_da?'<button class="mini oro" data-lprendo="'+esc(c.id)+'">Lo prendo</button>':'')+
            '<button class="mini" data-lfatto="'+esc(c.id)+'"'+(c.movimento?' data-q="'+esc(c.quantita==null?"":c.quantita)+'"':'')+'>Fatto</button>'+
            (io.coordina?'<button class="mini" data-lannullo="'+esc(c.id)+'">Annulla</button>':'')+'</div>':'')+
          '</div>';}
      function colonna(tit,l,vuoto){return '<div class="lg-col"><p class="et">'+tit+' · '+l.length+'</p>'+(l.length?l.map(scheda).join(""):'<div class="vuoto">'+vuoto+'</div>')+'</div>';}
      /* giacenze per punto */
      var perPunto={};nei.forEach(function(g){(perPunto[g.punto]=perPunto[g.punto]||[]).push(g);});
      var giaH=Object.keys(perPunto).length?Object.keys(perPunto).map(function(p){return '<div class="card"><b>'+esc(p)+'</b><div class="lg-scroll"><table class="lg-tab"><thead><tr><th>Merce</th><th>Produttore</th><th class="n">C\'è</th><th class="n">Scade</th></tr></thead><tbody>'+
        perPunto[p].map(function(g){return '<tr><td>'+esc(g.merce)+'</td><td>'+esc(g.produttore||"")+'</td><td class="n">'+lgNum(g.giacenza)+' '+esc(g.unita||"")+'</td><td class="n">'+esc(g.scade_il?lgData(g.scade_il):"")+'</td></tr>';}).join("")+'</tbody></table></div></div>';}).join("")
        :'<div class="vuoto">Nei punti non c\'è merce. Si riempie quando un compito con la merce è fatto.</div>';
      /* rendiconto per produttore */
      var perProd={};ren.forEach(function(r){(perProd[r.produttore]=perProd[r.produttore]||[]).push(r);});
      var renH=Object.keys(perProd).length?Object.keys(perProd).map(function(p){var tot=0;perProd[p].forEach(function(r){if(!r.chiuso_il)tot+=+r.da_pagare||0;});
        return '<div class="card"><div class="riga-m"><b>'+esc(p)+'</b><span class="m">da pagare '+lgEuro(tot)+'</span></div><div class="lg-scroll"><table class="lg-tab"><thead><tr><th>Merce</th><th class="n">Arrivato</th><th class="n">Venduto</th><th class="n lg-meno">Tornato</th><th class="n">Nei punti</th><th class="n">Da pagare</th></tr></thead><tbody>'+
          perProd[p].map(function(r){return '<tr><td>'+esc(r.merce)+(r.chiuso_il?' <span class="m">· chiuso il '+esc(lgData(r.chiuso_il))+'</span>':'')+'</td><td class="n">'+lgNum(r.arrivato)+' '+esc(r.unita||"")+'</td><td class="n">'+lgNum(r.venduto)+'</td><td class="n lg-meno">'+lgNum(r.tornato)+'</td><td class="n">'+lgNum(r.nei_punti)+'</td><td class="n">'+lgEuro(r.da_pagare)+'</td></tr>';}).join("")+'</tbody></table></div></div>';}).join("")
        :'<div class="vuoto">Ancora nessun produttore con merce in conto vendita.</div>';
      var puoLotto=io.coordina||(io.ruoli||[]).some(function(r){return r.funzione==="logistica"&&(r.ruolo==="emporio"||r.ruolo==="produttori");});
      var luoghiOpt=luoghi.map(function(l){return '<option value="'+esc(l.id)+'">'+esc(l.titolo)+'</option>';}).join("")+feste.map(function(f){return '<option value="'+esc(f.id)+'">'+esc(f.titolo)+'</option>';}).join("");
      var lottiAperti=lotti.filter(function(l){return !l.chiuso_il;});
      $("#lg").innerHTML='<p class="et" style="margin-top:12px">La logistica · per chi ci lavora</p>'+
        '<div class="lg-conta"><div><b>'+aperti.length+'</b><small>da prendere</small></div><div><b>'+presi.length+'</b><small>in corso</small></div><div><b>'+fatti.length+'</b><small>fatti in 30 giorni</small></div><div><b>'+nei.length+'</b><small>merci nei punti</small></div></div>'+
        '<p class="et">Il banco dei compiti</p>'+
        '<div class="lg-filtri">'+[["tutti","Tutti"]].concat(RUOLI_LOG).map(function(r){return '<button class="chip'+(lgFiltro===r[0]?' on':'')+'" data-lgf="'+r[0]+'" aria-pressed="'+(lgFiltro===r[0])+'">'+r[1]+'</button>';}).join("")+'</div>'+
        '<div class="lg-banco">'+colonna("Da prendere",filtra(aperti),"Niente da prendere.")+colonna("In corso",filtra(presi),"Nessuno ci sta lavorando.")+colonna("Fatti",filtra(fatti),"Ancora niente di fatto negli ultimi 30 giorni.")+'</div>'+
        (luoghi.length||feste.length?'<details class="lg-nuovo"><summary>Nuovo compito</summary><div class="modulo">'+
          '<label>Cosa c\'è da fare<input type="text" id="lg-tit" maxlength="140" autocomplete="off"></label>'+
          '<div class="due"><label>Dove<select id="lg-punto">'+luoghiOpt+'</select></label><label>Per quale ruolo<select id="lg-ruolo">'+RUOLI_LOG.map(function(r){return '<option value="'+r[0]+'">'+r[1]+'</option>';}).join("")+'</select></label></div>'+
          '<div class="due"><label>Entro il<input type="date" id="lg-entro"></label><label>Muove la merce?<select id="lg-mov"><option value="">no</option>'+MOVIMENTI.map(function(m){return '<option value="'+m[0]+'">'+m[1]+'</option>';}).join("")+'</select></label></div>'+
          '<div class="due" id="lg-merce" hidden><label>Quale merce<select id="lg-lotto">'+lottiAperti.map(function(l){return '<option value="'+esc(l.id)+'">'+esc(l.nome)+(l.lotto?' · '+esc(l.lotto):'')+'</option>';}).join("")+'</select></label><label>Quanta<input type="number" id="lg-q" min="0" step="any"></label></div>'+
          '<label>Una nota<textarea id="lg-nota" maxlength="600"></textarea></label>'+
          '<p class="nota">Gli indirizzi delle case non si scrivono qui.</p>'+
          '<div class="azioni"><button class="btn pieno" id="lg-crea">Crea il compito</button></div><div class="toast" id="lg-ok" hidden></div></div></details>'
          :'<p class="nota" style="margin-top:8px">Per creare compiti serve almeno un luogo con una funzione (punto di ritiro, magazzino, mensa, produzione).</p>')+
        '<p class="et" style="margin-top:14px">La merce nei punti</p>'+giaH+
        (ren.length||puoLotto?'<p class="et" style="margin-top:14px">Il rendiconto dei produttori</p>'+renH:'')+
        (puoLotto?'<details class="lg-nuovo"><summary>Nuova merce in conto vendita</summary><div class="modulo">'+
          (partner.length?'<label>Produttore<select id="ll-p">'+partner.map(function(x){return '<option value="'+esc(x.id)+'">'+esc(x.nome)+'</option>';}).join("")+'</select></label>'+
          '<div class="due"><label>Cosa<input type="text" id="ll-nome" maxlength="120" autocomplete="off"></label><label>Unità<select id="ll-u"><option>kg</option><option>g</option><option>l</option><option>pz</option><option>conf</option></select></label></div>'+
          '<div class="due"><label>Prezzo a chi compra, per unità (€)<input type="number" id="ll-pv" min="0" step="0.01"></label><label>Al produttore, per unità (€)<input type="number" id="ll-pp" min="0" step="0.01"></label></div>'+
          '<div class="due"><label>Lotto<input type="text" id="ll-lotto" maxlength="60" autocomplete="off"></label><label>Scade il<input type="date" id="ll-scade"></label></div>'+
          '<p class="nota">La merce entra nei punti quando il compito «Arrivo dal produttore» è fatto.</p>'+
          '<div class="azioni"><button class="btn pieno" id="ll-crea">Aggiungi la merce</button></div><div class="toast" id="ll-ok" hidden></div>'
          :'<p class="nota">Prima il produttore va aggiunto tra i partner.</p>')+'</div></details>':'');
      var e=$("#lg");
      function dopo(x){if(x&&x.error)alert(errore(x.error));vLogistica();}
      e.querySelectorAll("[data-lgf]").forEach(function(b){b.onclick=function(){lgFiltro=b.getAttribute("data-lgf");vLogistica();};});
      e.querySelectorAll("[data-lprendo]").forEach(function(b){b.onclick=function(){b.disabled=true;db.rpc("fm_compito_prendo",{p_compito:b.getAttribute("data-lprendo")}).then(dopo,dopo);};});
      e.querySelectorAll("[data-lannullo]").forEach(function(b){b.onclick=function(){if(!confirm("Annullare questo compito?"))return;b.disabled=true;db.rpc("fm_compito_annullo",{p_compito:b.getAttribute("data-lannullo")}).then(dopo,dopo);};});
      e.querySelectorAll("[data-lfatto]").forEach(function(b){b.onclick=function(){var a={p_compito:b.getAttribute("data-lfatto")};
        if(b.hasAttribute("data-q")){var x=prompt("Quanta merce, davvero?",b.getAttribute("data-q"));if(x===null)return;x=parseFloat(String(x).replace(",","."));if(x>0)a.p_quantita=x;}
        b.disabled=true;db.rpc("fm_compito_fatto",a).then(dopo,dopo);};});
      var mv=$("#lg-mov");if(mv)mv.onchange=function(){$("#lg-merce").hidden=!mv.value;};
      var cr=$("#lg-crea");if(cr)cr.onclick=function(){
        var t=$("#lg-tit").value.trim(),m=$("#lg-mov").value,a={p_punto:$("#lg-punto").value,p_ruolo:$("#lg-ruolo").value,p_titolo:t};
        if(!t)return mostra("#lg-ok","Scrivi cosa c'è da fare.",true);
        if($("#lg-entro").value)a.p_entro=new Date($("#lg-entro").value+"T18:00:00").toISOString();
        if($("#lg-nota").value.trim())a.p_nota=$("#lg-nota").value.trim();
        if(m){var qq=parseFloat(String($("#lg-q").value).replace(",","."));if(!$("#lg-lotto").value)return mostra("#lg-ok","Prima va aggiunta la merce, qui sotto.",true);if(!(qq>0))return mostra("#lg-ok","Scrivi quanta merce.",true);a.p_movimento=m;a.p_lotto=$("#lg-lotto").value;a.p_quantita=qq;}
        cr.disabled=true;db.rpc("fm_logistica_compito",a).then(function(x){cr.disabled=false;if(x&&x.error)return mostra("#lg-ok",errore(x.error),true);vLogistica();},function(){cr.disabled=false;});};
      var lc=$("#ll-crea");if(lc)lc.onclick=function(){
        var n=$("#ll-nome").value.trim();if(!n)return mostra("#ll-ok","Scrivi cosa arriva.",true);
        var r={partner_id:$("#ll-p").value,nome:n,unita:$("#ll-u").value,villaggio_id:VILLAGGIO};
        var pv=parseFloat($("#ll-pv").value),pp=parseFloat($("#ll-pp").value);if(pv>=0)r.prezzo_vendita=pv;if(pp>=0)r.prezzo_produttore=pp;
        if($("#ll-lotto").value.trim())r.lotto=$("#ll-lotto").value.trim();if($("#ll-scade").value)r.scade_il=$("#ll-scade").value;
        lc.disabled=true;db.from("merce_lotti").insert(r).then(function(x){lc.disabled=false;if(x&&x.error)return mostra("#ll-ok",errore(x.error),true);vLogistica();},function(){lc.disabled=false;});};
    });
  });
}
