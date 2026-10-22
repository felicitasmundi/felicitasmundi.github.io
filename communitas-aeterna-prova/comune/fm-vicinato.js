/* I tasti dei vicinati — 22/10/2026, Gabriele Dettori: «i bottoni di vicinati dovrebbero essere legati all proporre vicinato,
   sapere come si entra, proporre festival» · «attiviamo mail per modulo vicinati».
   Uso: <div data-fm-vicinato></div> dove vanno i tasti. Serve lo SQL 106 (fm_proponi_vicinato) per il modulo
   e lo SQL 103 (fm_prenota, «gruppo_festival») per proporre il festival.
   I testi vengono dalle fonti: i quattro passi (Gab, 18/10 11:46-11:48) e l'adesione (Gab, 19/10 11:39). */
(function(){
  if(window.fmVicinato) return; window.fmVicinato = 1;
  var URL_SB = "https://gfnveesogkfvkrdudpfg.supabase.co", CHIAVE = "sb_publishable_4_kJlYwWuqsahMBw7Um2mg_lsYH9ogU";
  var CSS = '.fv-tasti{display:flex;flex-direction:column;gap:12px;margin-top:6px}'+
    '.fv-tasti button{width:100%;font-family:inherit;cursor:pointer;border:0}'+
    '.fv-tasti button.vuoto{border:2px solid var(--oro,#d6b56c)}'+
    '.fv-pannello{margin-top:14px;border:1px solid var(--riga,rgba(214,181,108,.28));border-radius:20px;padding:18px;background:rgba(15,18,38,.6)}'+
    '.fv-pannello h3{margin:0 0 10px;font-size:26px;line-height:1.2}'+
    '.fv-pannello p,.fv-pannello li{font-size:20px;line-height:1.5;margin:0 0 8px}'+
    '.fv-pannello ol{margin:0 0 8px;padding-left:24px}'+
    '.fv-pannello label{display:block;font-size:18px;margin:12px 0 4px}'+
    '.fv-pannello input[type=text],.fv-pannello textarea{width:100%;box-sizing:border-box;font:inherit;font-size:19px;padding:12px;border-radius:12px;border:1px solid var(--riga,rgba(214,181,108,.4));background:rgba(245,240,230,.06);color:inherit}'+
    '.fv-pannello textarea{min-height:90px}'+
    '.fv-scelte{display:flex;flex-direction:column;gap:8px}'+
    '.fv-scelte label{display:flex;gap:10px;align-items:flex-start;margin:0;font-size:19px}'+
    '.fv-scelte input{width:22px;height:22px;flex:none;margin-top:3px}'+
    '.fv-esito{font-size:19px;margin-top:10px;min-height:1em}';
  var st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);

  var db = null;
  function client(){
    if(db) return Promise.resolve(db);
    function crea(){ db = window.supabase.createClient(URL_SB, CHIAVE, {auth:{flowType:"implicit"}}); return db; }
    if(window.supabase && window.supabase.createClient) return Promise.resolve(crea());
    return new Promise(function(ok, no){
      var s = document.createElement('script'); s.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.min.js";
      s.onload = function(){ ok(crea()); }; s.onerror = no; document.head.appendChild(s);
    });
  }
  function sessione(){ return client().then(function(c){ return c.auth.getSession(); }).then(function(r){ return r.data && r.data.session; }).catch(function(){ return null; }); }
  function entra(q){ location.href = "accesso.html?torna=" + encodeURIComponent(location.pathname + "?" + q); }

  var COME = '<h3>Come si entra in un vicinato</h3>'+
    '<p>Si aderisce col vicinato in cui si vive, oppure ci si propone per entrare in un vicinato. Ogni richiesta arriva come notifica e mail ai coordinatori del villaggio.</p>'+
    '<p>Per entrare servono quattro passi:</p>'+
    '<ol><li>essere conosciuti di persona a un incontro;</li><li>un garante che è già nel vicinato;</li>'+
    '<li>il sì di chi coordina il vicinato, mai automatico;</li><li>la dichiarazione d\'ingresso firmata.</li></ol>'+
    ''; 
  var MODULO = '<h3>Proponi il tuo vicinato</h3>'+
    '<div class="fv-scelte" role="radiogroup">'+
      '<label><input type="radio" name="fv-modo" value="mio">Aderisco col vicinato in cui vivo</label>'+
      '<label><input type="radio" name="fv-modo" value="entrare">Mi propongo per entrare in un vicinato</label></div>'+
    '<label for="fv-dove">Paese o città</label><input type="text" id="fv-dove" maxlength="80" autocomplete="address-level2">'+
    '<label for="fv-nome">Il nome del vicinato, se ce l\'ha</label><input type="text" id="fv-nome" maxlength="80">'+
    '<label for="fv-chi">Chi sei, in due righe</label><textarea id="fv-chi" maxlength="600"></textarea>'+
    '<p style="margin:14px 0 6px;font-size:18px">Il mio vicinato può offrire:</p>'+
    '<div class="fv-scelte">'+
      '<label><input type="checkbox" name="fv-offre" value="punto_ritiro">punto di ritiro</label>'+
      '<label><input type="checkbox" name="fv-offre" value="magazzino">magazzino</label>'+
      '<label><input type="checkbox" name="fv-offre" value="mensa">mensa</label>'+
      '<label><input type="checkbox" name="fv-offre" value="produzione">produzione</label></div>'+
    '<label for="fv-note">Note</label><textarea id="fv-note" maxlength="600"></textarea>'+
    '<p style="margin-top:14px"><button class="tasto" type="button" id="fv-manda">Proponi il mio vicinato</button></p>'+
    '<p class="fv-esito" id="fv-esito" aria-live="polite"></p>';

  function monta(box){
    box.innerHTML = '<div class="fv-tasti">'+
      '<button class="tasto" type="button" data-fv="proponi" data-conta="tasto:proponi_vicinato">Proponi il tuo vicinato</button>'+
      '<button class="tasto vuoto" type="button" data-fv="come" data-conta="tasto:come_si_entra">Come si entra in un vicinato</button>'+
      '<button class="tasto vuoto" type="button" data-fv="festival" data-conta="tasto:gruppo_festival">Proponi un festival nel tuo territorio</button></div>'+
      '<div class="fv-pannello" data-fv-pan hidden></div><p class="fv-esito" data-fv-fest aria-live="polite"></p>';
    var pan = box.querySelector('[data-fv-pan]'), fest = box.querySelector('[data-fv-fest]');
    function mostra(html){ if(!pan.hidden && pan.getAttribute('data-c') === html.slice(0,40)){ pan.hidden = true; return false; }
      pan.innerHTML = html; pan.setAttribute('data-c', html.slice(0,40)); pan.hidden = false; pan.scrollIntoView({behavior:'smooth', block:'nearest'}); return true; }
    box.querySelector('[data-fv="come"]').onclick = function(){ mostra(COME); };
    box.querySelector('[data-fv="proponi"]').onclick = function(){ proponi(); };
    box.querySelector('[data-fv="festival"]').onclick = function(){ festival(); };
    function proponi(){
      sessione().then(function(s){
        if(!s){ entra("vicinato=proponi"); return; }
        if(!mostra(MODULO)) return;
        pan.querySelector('#fv-manda').onclick = function(){
          var b = this, e = pan.querySelector('#fv-esito');
          var m = pan.querySelector('input[name=fv-modo]:checked');
          if(!m){ e.textContent = "Scegli se aderisci col tuo vicinato o se ti proponi per entrare."; return; }
          var offre = [].slice.call(pan.querySelectorAll('input[name=fv-offre]:checked')).map(function(x){ return x.value; });
          b.disabled = true; e.textContent = "Un momento…";
          db.rpc("fm_proponi_vicinato", {p_modo:m.value, p_nome:pan.querySelector('#fv-nome').value, p_dove:pan.querySelector('#fv-dove').value,
              p_chi:pan.querySelector('#fv-chi').value, p_offre:offre, p_note:pan.querySelector('#fv-note').value})
            .then(function(r){ b.disabled = false;
              if(r && r.error){ e.textContent = "Non è stata salvata. Si può riprovare."; return; }
              e.textContent = r && r.data === "ok" ? "Proposta arrivata ai coordinatori del villaggio." : (r && r.data) || ""; },
              function(){ b.disabled = false; e.textContent = "Non è stata salvata. Si può riprovare."; });
        };
      });
    }
    function festival(){
      sessione().then(function(s){
        if(!s){ entra("vicinato=festival"); return; }
        var d = prompt("Dove? Paese o città", ""); if(d === null) return;
        fest.textContent = "Un momento…";
        db.rpc("fm_prenota", {p_cosa:"gruppo_festival", p_dove:d}).then(function(r){
          if(r && r.error){ fest.textContent = "Non è stata salvata. Si può riprovare."; return; }
          fest.textContent = r && r.data === "ok" ? "Proposta arrivata: un festival nel tuo territorio" + (d.trim() ? " · " + d.trim() : "") + "." : (r && r.data) || "";
        }, function(){ fest.textContent = "Non è stata salvata. Si può riprovare."; });
      });
    }
    /* tornando dall'accesso il gesto si completa */
    var q = new URLSearchParams(location.search).get('vicinato');
    if(q === 'proponi') proponi(); else if(q === 'festival') festival();
  }
  function avvia(){ document.querySelectorAll('[data-fm-vicinato]').forEach(function(b){ if(!b._fv){ b._fv = 1; monta(b); } }); }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', avvia); else avvia();
})();
