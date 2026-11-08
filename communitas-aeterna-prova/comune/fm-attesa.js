/* FM · LIMITE D'ATTESA (8/11/2026). Gab 21:31: «esatto in ogni contesto, non solo in questa pagina» · 21:34 «ok allora imposta cosi».
   Ogni richiesta al database che non risponde entro 20 secondi viene interrotta: la pagina mostra il suo messaggio d'errore
   e il tasto torna libero. Foto, file e funzioni: 3 minuti. Chat e dirette in tempo reale non passano di qui.
   Si carica SUBITO DOPO supabase-js e PRIMA degli script della pagina:
   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
   <script src="comune/fm-attesa.js?v=11082140"></script> */
(function(){
  var sb=window.supabase;
  if(!sb||typeof sb.createClient!=="function"||sb.__fmAttesa||typeof AbortController!=="function")return;
  var RICHIESTA=20000,FILE=180000;
  var prova=window.FM_ATTESA||{};if(prova.richiesta)RICHIESTA=prova.richiesta;if(prova.file)FILE=prova.file;
  function scaduto(){try{return new DOMException("nessuna risposta","TimeoutError");}catch(_){var e=new Error("nessuna risposta");e.name="TimeoutError";return e;}}
  function conLimite(base){
    return function(input,init){
      var url=typeof input==="string"?input:((input&&input.url)||String(input||""));
      var ms=/\/(storage|functions)\/v1\//.test(url)?FILE:RICHIESTA;
      var c=new AbortController(),opz={},k;init=init||{};
      for(k in init)opz[k]=init[k];
      var su=init.signal;
      if(su){if(su.aborted)c.abort(su.reason);else su.addEventListener("abort",function(){c.abort(su.reason);},{once:true});}
      var t=setTimeout(function(){c.abort(scaduto());},ms);
      opz.signal=c.signal;
      return base(input,opz).then(function(r){
        /* il tempo vale fino alla fine della risposta: lo sgancio quando il corpo è letto */
        if(r&&r.body&&typeof r.clone==="function"){r.clone().arrayBuffer().then(function(){clearTimeout(t);},function(){clearTimeout(t);});}
        else clearTimeout(t);
        return r;
      },function(e){clearTimeout(t);if(c.signal.aborted&&c.signal.reason&&c.signal.reason.name==="TimeoutError")throw c.signal.reason;throw e;});
    };
  }
  var crea=sb.createClient;
  sb.createClient=function(url,key,opz){
    opz=opz||{};var o={},k;for(k in opz)o[k]=opz[k];
    var g={};if(opz.global)for(k in opz.global)g[k]=opz.global[k];
    g.fetch=conLimite(g.fetch||function(a,b){return window.fetch(a,b);});
    o.global=g;
    return crea.call(this,url,key,o);
  };
  sb.__fmAttesa=true;
})();
