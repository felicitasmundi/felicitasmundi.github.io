/* IL PERCORSO DEL TALENTO · Gab, 19/10: «non è il tuo spazio, è il percorso del talento». Lo legge solo chi lo scrive (SQL 81). */
function vPercorso(){
  var c=$("#corpo");
  c.innerHTML='<div class="giro" style="margin-bottom:4px"><button class="btn" id="ce-indietro">← Torna al Cervello</button></div><div id="lb"></div>';
  $("#ce-indietro").onclick=function(){vai("cervello");};
  fondoIndietro(c);
  libro($("#lb"),{campo:"persona_id",id:io.id,occ:"Il percorso del talento",titolo:io.nome||"Il percorso del talento",
    apertura:'<blockquote class="lb-gab"><p>«il percorso del talento con il praticantato applicato alle cose che si desidera fare e si mettono assieme»</p><cite>Gabriele Dettori · 19 ottobre</cite></blockquote>'});
}
