/* IL CERVELLO PER VOCE · il sistema di coscienza: il cosa e il perché.
   20 ott 12:01, Gab: «sistema di coscienza è il contesto che integra il cosa e il perchè».
   Si legge solo quello che le regole del registro fanno vedere: chi è nel gruppo, chi ha il ruolo, il villaggio; «solo io» resta di chi l'ha scritto. */
function vVociRegistro(box,cerchioId){
  if(!box)return;
  var A=new Date(Date.now()-90*864e5).toISOString();
  var qy=db.from("registro").select("*").gte("scritto_il",A).order("scritto_il",{ascending:false}).limit(400);
  Promise.all([qy.then(function(r){return r&&!r.error?(r.data||[]):null;},function(){return null;}),regCerchi()]).then(function(v){
    if(!box.isConnected)return;
    var l=v[0];if(l===null){box.innerHTML="";return;}
    l=l.filter(function(x){return x.stato!=="annullato"&&(!cerchioId||regCerchioDi(x)===cerchioId);});
    var ids=[];l.forEach(function(x){ids.push(x.scritto_da,x.preso_da);});
    leggiNomi(ids).then(function(){
      /* le sette voci si vedono sempre, anche vuote (schema approvato il 20/10 alle 14:37, sezione 6; Gab 10:31) */
      var per={};REG_VOCI.forEach(function(k){per[k]=[];});
      l.forEach(function(x){var k=x.voce||"Senza voce",t=REG_VOCI.filter(function(v){return v.toLowerCase()===String(k).toLowerCase();})[0];(per[t||k]=per[t||k]||[]).push(x);});
      var chiavi=REG_VOCI.concat(Object.keys(per).filter(function(k){return REG_VOCI.indexOf(k)<0&&k!=="Senza voce";}).sort()).concat(per["Senza voce"]?["Senza voce"]:[]);
      box.innerHTML='<p class="et" style="margin-top:14px">Il registro per voce</p>'+chiavi.map(function(k){var z=per[k];
        var chi={};z.forEach(function(x){[x.scritto_da,x.preso_da].forEach(function(p){if(p&&nomi[p])chi[nomi[p]]=1;});});
        var suc=z.filter(function(x){return x.stato==="aperto"||x.stato==="preso"||x.tipo==="fatto"||x.tipo==="incontro"||x.tipo==="chiamata";}).slice(0,6);
        var dec=z.filter(function(x){return x.tipo==="decisione"||x.perche;}).slice(0,6);
        if(!z.length)return '<div class="card rg-voce rg-vuota"><b>'+esc(k)+'</b><span class="m">ancora nessuna riga</span></div>';
        return '<details class="card rg-voce"><summary><b>'+esc(k)+'</b><span class="m">'+z.length+(z.length===1?" riga":" righe")+'</span></summary>'+
          '<div class="rg-blocchi"><div><p class="et">Chi c\'è</p><span class="t">'+(Object.keys(chi).map(esc).join(", ")||"—")+'</span></div>'+
          '<div><p class="et">Cosa succede</p>'+(suc.length?'<ul>'+suc.map(function(x){return '<li>'+esc(x.testo)+(x.stato?' <span class="pill '+REG_STATO_C[x.stato]+'">'+REG_STATO[x.stato]+'</span>':'')+'</li>';}).join("")+'</ul>':'<span class="m">—</span>')+'</div>'+
          '<div><p class="et">Perché · decisioni</p>'+(dec.length?'<ul>'+dec.map(function(x){return '<li>'+esc(x.tipo==="decisione"?x.testo:x.perche)+'<span class="m"> · '+esc(new Date(x.scritto_il).toLocaleDateString("it-IT",{day:"numeric",month:"short"}))+'</span></li>';}).join("")+'</ul>':'<span class="m">—</span>')+'</div></div>'+
          '<p class="nota" style="margin-top:6px">'+esc(Object.keys(z.reduce(function(a,x){a[REG_VIS_N[x.visibilita]]=1;return a;},{})).join(" · "))+'</p></details>';}).join("");
    });
  });
}

