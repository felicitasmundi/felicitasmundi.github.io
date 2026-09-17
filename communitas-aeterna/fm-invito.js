/* ═══════════════════════════════════════════════════════════════
   L'INVITO — la finestra che si apre da «invita su Felicitas».

   ⭐ NON È UN'ORMA. Un invito non è lavoro: è una persona che manca.

   ⛔ IL COLLEGAMENTO PORTA IL NOME, non un codice a caso:
      ?invito=gabriele-dettori — è `persone.nome_url`, lo slug.

   ⭐ COSA FA IL GESTO, in un colpo (fm_accetta_invito):
      · scrive chi ha invitato chi — persone.invitato_da
      · mette chi arriva nella rubrica di chi invita — contatti
      E il conto viene da fm_miei_invitati_conta.

   ⭐ Le parole della presentazione sono di Gab, verbatim: quelle
      scritte per Cesena. Il Nexus è `nexus.png`, non ridisegnato.

   ⚠️ Chi non ha ancora lo slug non può invitare: la finestra lo
      dice invece di dare un collegamento rotto.

   Espone: SpazioVivo.invito()
   ═══════════════════════════════════════════════════════════════ */

"use strict";

var invIo = null;

function invVeste(){
  if(document.getElementById("fm-inv-veste")) return;
  var s = document.createElement("style");
  s.id = "fm-inv-veste";
  s.textContent = "#fm-inv-velo{position:fixed;inset:0;background:rgba(4,6,14,.62)} #fm-inv-fg{position:fixed;left:50%;bottom:0;z-index:91;transform:translate(-50%,100%);transition:transform .24s ease;width:100%;max-width:27rem;background:var(--alto); border-radius:1.1rem 1.1rem 0 0;padding:1rem 1.2rem 1.8rem; box-shadow:0 -.4rem 2rem rgba(0,0,0,.5);max-height:92vh;overflow-y:auto} #fm-inv-fg .maniglia{width:2.6rem;height:.22rem;border-radius:1rem; background:rgba(245,240,230,.18);margin:0 auto 1rem} h1{font-family:'Cinzel',serif;font-weight:400;font-size:1.24rem; color:var(--oro-ch);line-height:1.2} .sot{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:.98rem; color:rgba(245,240,230,.5);line-height:1.5;margin:.2rem 0 1.1rem} /* ── il collegamento ────────────────────────────────────────── */ #fm-inv-fg .link{display:flex;align-items:center;gap:.55rem;padding:.6rem .75rem; border-radius:.7rem;background:rgba(8,11,26,.6); border:1px solid rgba(200,160,85,.28)} #fm-inv-fg .link code{flex:1;min-width:0;font-size:.86rem;color:rgba(245,240,230,.65); overflow:hidden;text-overflow:ellipsis;white-space:nowrap; font-family:'DM Sans',monospace} #fm-inv-fg .link button{flex:none;min-height:2.5rem;padding:0 1rem;border-radius:1.2rem; cursor:pointer;font-family:inherit;font-size:.86rem; border:1px solid var(--oro);background:rgba(200,160,85,.16);color:var(--oro-ch)} #fm-inv-fg .link button.fatto{border-color:rgba(110,158,90,.6); background:rgba(110,158,90,.15);color:var(--verde)} #fm-inv-fg .dice{font-size:.84rem;color:rgba(245,240,230,.4);margin-top:.5rem;line-height:1.5} #fm-inv-fg .dice b{color:var(--oro-ch);font-weight:400} /* ── i modi per mandarlo ────────────────────────────────────── */ #fm-inv-fg .modi{display:grid;grid-template-columns:repeat(auto-fit,minmax(7rem,1fr)); gap:.45rem;margin-top:.8rem} #fm-inv-fg .modi button{min-height:2.7rem;border-radius:1.2rem;cursor:pointer; font-family:inherit;font-size:.88rem; border:1px solid rgba(245,240,230,.14);background:rgba(245,240,230,.03); color:rgba(245,240,230,.75)} #fm-inv-fg .modi button:hover{background:rgba(245,240,230,.07);border-color:rgba(200,160,85,.4)} #fm-inv-fg .modi button.fatto{border-color:rgba(110,158,90,.55); background:rgba(110,158,90,.14);color:var(--verde)} /* ── l'anteprima: cosa vede chi arriva ──────────────────────── */ #fm-inv-fg .et{font-size:.64rem;letter-spacing:.2em;text-transform:uppercase; color:rgba(245,240,230,.3);margin:1.5rem 0 .5rem; padding-top:1.1rem;border-top:1px solid var(--line)} #fm-inv-fg .ant{border:1px solid rgba(184,150,62,.22);border-radius:.9rem;font-size:1.02rem; background:linear-gradient(165deg,rgba(20,23,43,.9),rgba(8,11,26,.7)); padding:1.3rem 1.15rem;position:relative;overflow:hidden} #fm-inv-fg .ant::before{content:'';position:absolute;inset:0;pointer-events:none; background:radial-gradient(ellipse at 24% 8%,rgba(58,88,160,.22),transparent 56%), radial-gradient(ellipse at 84% 96%,rgba(70,52,120,.18),transparent 58%)} #fm-inv-fg .ant > *{position:relative} #fm-inv-fg .ant .nx{width:4.4rem;height:4.4rem;margin:0 auto .7rem;display:block; object-fit:contain;opacity:.92} #fm-inv-fg .ant .chi{font-family:'Cormorant Garamond',serif;font-style:italic; font-size:1.06rem;color:var(--oro);text-align:center;margin-bottom:.15rem} #fm-inv-fg .ant h2{font-family:'Cinzel',serif;font-weight:400;font-size:1.46rem; text-align:center;line-height:1.2;margin-bottom:.1rem} #fm-inv-fg .ant h2 .cme{display:block;font-size:1.04rem;color:var(--oro); opacity:.85;margin-top:.1rem} #fm-inv-fg .ant .occ{font-family:'Cormorant Garamond',serif;font-style:italic; font-size:1.04rem;color:rgba(245,240,230,.48);text-align:center; margin-bottom:.9rem;padding-bottom:.8rem; border-bottom:1px solid rgba(184,150,62,.16)} #fm-inv-fg .ant p + p{margin-top:.55rem} /* ⭐ lo spazio dopo «luoghi che esistono»: la frase respira */ #fm-inv-fg .ant .respiro{margin-bottom:1.1rem} #fm-inv-fg .ant p b{color:rgba(245,240,230,.85);font-weight:400} #fm-inv-fg .ant .orma{margin-top:1rem;padding-top:.9rem; border-top:1px solid rgba(184,150,62,.16)} #fm-inv-fg .ant .orma .oc2{font-size:.62rem;letter-spacing:.2em;text-transform:uppercase; color:rgba(245,240,230,.3);text-align:center} #fm-inv-fg .ant .orma > b{display:block;font-family:'Cinzel',serif;font-weight:400; font-size:1.32rem;color:var(--oro-ch);text-align:center;margin:.1rem 0 .5rem} #fm-inv-fg .ant .orma p{color:rgba(245,240,230,.58)} #fm-inv-fg .ant p{font-family:'Cormorant Garamond',serif;font-size:1.12rem;line-height:1.62; color:rgba(245,240,230,.7);text-align:center} #fm-inv-fg .ant .cinque{display:flex;justify-content:center;flex-wrap:wrap; gap:.3rem;margin:.9rem 0 .8rem} #fm-inv-fg .ant .cinque span{font-size:.84rem;padding:.3rem .8rem;border-radius:1rem; border:1px solid color-mix(in srgb,var(--c) 45%,transparent); color:var(--c);filter:brightness(1.3); background:color-mix(in srgb,var(--c) 10%,transparent)} #fm-inv-fg .ant .entra{display:block;width:100%;min-height:2.8rem;border-radius:1.4rem; cursor:default;font-family:inherit;font-size:.94rem; border:1px solid rgba(200,160,85,.5);background:rgba(200,160,85,.14); color:var(--oro-ch)} #fm-inv-fg .ant .pie2{font-family:'Cormorant Garamond',serif;font-style:italic; font-size:.84rem;color:rgba(245,240,230,.3);text-align:center;margin-top:.6rem} .fm-inv .nota{font-family:'Cormorant Garamond',serif;font-size:.92rem;line-height:1.55; color:rgba(245,240,230,.42);margin-top:.9rem} .fm-inv .nota b{color:rgba(245,240,230,.6);font-weight:400} #fm-inv-fg .chiudi{display:block;width:100%;min-height:2.9rem;margin-top:1.2rem; border-radius:1.4rem;cursor:pointer;font-family:inherit;font-size:.94rem; border:1px solid rgba(245,240,230,.16);background:transparent; color:rgba(245,240,230,.6)} @media (prefers-reduced-motion:reduce){*{transition:none!important}}";
  /* ⛔ le due regole che fanno salire il foglio: senza queste
     il contenuto c'è ma resta fuori dallo schermo. */
  s.textContent += "#fm-inv-velo{position:fixed;inset:0;z-index:90;" +
    "background:rgba(4,6,14,.62);opacity:0;pointer-events:none;" +
    "transition:opacity .2s}" +
    "#fm-inv-velo.si{opacity:1;pointer-events:auto}" +
    "#fm-inv-fg.si{transform:translate(-50%,0)}";
  document.head.appendChild(s);
}

async function invLeggi(){
  var d = { nome_url:null, quanti:0 };
  try{
    var u = await db.auth.getUser();
    var id = u && u.data && u.data.user && u.data.user.id;
    if(!id) return d;
    var p = await db.from("persone").select("nome,nome_url").eq("id", id).single();
    if(!p.error && p.data) d.nome_url = p.data.nome_url;
    var c = await db.rpc("fm_miei_invitati_conta");
    if(!c.error) d.quanti = c.data || 0;
  }catch(e){ console.warn("invito:", e); }
  return d;
}

function invCosa(){
  var u = document.getElementById("fm-inv-url");
  var t = u ? u.textContent.trim() : "";
  if(t.indexOf("http") !== 0) t = "https://" + t;
  return { url:t,
    tit:"FelicitasMundi \u00b7 Comunit\u00e0 Eterna",
    txt:"Ti invito su FelicitasMundi \u2014 uno strumento pratico per " +
        "tenere traccia di ci\u00f2 che si fa insieme.\n\n" + t };
}

function invChiudi(){
  var v = document.getElementById("fm-inv-velo");
  var f = document.getElementById("fm-inv-fg");
  if(v) v.classList.remove("si");
  if(f) f.classList.remove("si");
}

/* ⭐ L’INVITO PUÒ PORTARE A UN EVENTO: chiamato da un evento, il
   collegamento porta lo slug di chi invita E l’id della festa, così
   chi arriva entra col tuo nome e su quella festa.
   ⛔ Senza, l’invito manda alla casa e l’evento si perde. */
var invEvento = null;

async function invito(cosa){
  invEvento = (cosa && cosa.evento) || null;
  invVeste();
  var v = document.getElementById("fm-inv-velo");
  if(!v){
    v = document.createElement("div");
    v.id = "fm-inv-velo"; v.setAttribute("aria-hidden","true");
    v.onclick = invChiudi;
    var f = document.createElement("div");
    f.id = "fm-inv-fg";
    f.setAttribute("role","dialog"); f.setAttribute("aria-modal","true");
    f.setAttribute("aria-label","Invita qualcuno");
    f.innerHTML = "<div class=\"maniglia\" aria-hidden=\"true\"></div>\n\n  <h1>Invita chi risuona</h1>\n  <div class=\"sot\">Espandi la rete con amici, vicini, produttori, operatori,\n    custodi di luoghi, famiglie, e chiunque possa trovarne beneficio</div>\n\n  <div class=\"link\">\n    <code id=\"fm-inv-url\">felicitasmundi.com/?invito=[ il tuo nome ]</code>\n    <button type=\"button\" id=\"fm-inv-copia\">copia</button>\n  </div>\n  <div class=\"dice\">\n    Sono arrivate <b id=\"fm-inv-quanti\">0</b> persone dal tuo invito.\n    Chi entra da qui compare nella tua rubrica: da l&igrave; puoi metterlo nelle tue orme.\n  </div>\n\n  <!-- ⭐ i tre modi funzionano davvero: nessuno è un tasto morto.\n       «condividi» apre il pannello del telefono e copre tutto —\n       messaggi, posta, quello che uno ha. Gli altri due servono\n       sul computer, dove navigator.share spesso non c'è. -->\n  <div class=\"modi\" id=\"fm-inv-modi\">\n    <button type=\"button\" id=\"fm-inv-msg\">manda per messaggio</button>\n    <button type=\"button\" id=\"fm-inv-post\">manda per posta</button>\n    <button type=\"button\" id=\"fm-inv-cond\">condividi</button>\n  </div>\n\n  <div class=\"et\">Cosa vede chi arriva</div>\n\n  <div class=\"ant\">\n    <!-- il Nexus: il segno che si vede per primo -->\n    <!-- ⛔ il Nexus è QUELLO, non ridisegnato a mano.\n         Stesso file che usa la barra. -->\n    <img class=\"nx\" alt=\"\" aria-hidden=\"true\"\n      src=\"https://www.felicitasmundi.com/wp-content/uploads/2026/05/nexus.png\">\n\n    <div class=\"chi\">ti ha invitato [ nome ]</div>\n    <!-- ⭐ Le parole sono di Gab, verbatim: la presentazione scritta\n         per Cesena, accorciata da lui a quello che serve qui. -->\n    <h2>FelicitasMundi<span class=\"cme\">Comunit&agrave; Eterna</span></h2>\n    <p class=\"occ\">uno strumento pratico per tenere traccia di ci&ograve;\n      che si fa insieme</p>\n\n    <p>Viviamo un tempo di grande confusione, in cui parte della Comunit&agrave;\n      ha perso i propri valori umani e la capacit&agrave; di riconoscere\n      ci&ograve; che nutre.</p>\n    <p class=\"respiro\"><b>FelicitasMundi &egrave; uno strumento pratico, oltre l&rsquo;idea:</b>\n      persone vere, che si trovano in luoghi che esistono.</p>\n\n\n    <p>&Egrave; uno strumento solo, fondato su conoscenze universali, che\n      appartengono alle radici dei popoli, e che facilita la connessione fra\n      gruppi di persone in territori distanti partendo dalla lingua &mdash;\n      dai ceppi linguistici che ci legano pi&ugrave; dei confini. E che\n      sostiene in concreto le assistenze terapeutiche, alimentari\n      ed educative.</p>\n\n    <div class=\"orma\">\n      <div class=\"oc2\">al centro c&rsquo;&egrave;</div>\n      <b>L&rsquo;Orma</b>\n      <p>&Egrave; il rendersi conto di far parte di un tracciato comune, di un\n        percorso collettivo verso l&rsquo;Evoluzione della Specie &mdash; e\n        insieme &egrave; lo strumento che ne tiene traccia.</p>\n      <p>Le orme aiutano le persone a stabilizzarsi, a sostenersi, a fare\n        gruppo, e a portare il proprio talento alla Comunit&agrave; Eterna.</p>\n    </div>\n\n    <div class=\"cinque\">\n      <span style=\"--c:var(--terra)\">Vicinati</span>\n      <span style=\"--c:var(--acqua)\">Emporio</span>\n      <span style=\"--c:var(--fuoco)\">Assistenza</span>\n      <span style=\"--c:var(--aria)\">Edizione</span>\n      <span style=\"--c:var(--etere)\">Scuola</span>\n    </div>\n\n    <button class=\"entra\" type=\"button\" tabindex=\"-1\">entra</button>\n    <div class=\"pie2\">riconosci i tuoi talenti</div>\n  </div>\n\n  <button class=\"chiudi\" type=\"button\" id=\"fm-inv-chiudi\">Chiudi</button>";
    document.body.appendChild(v); document.body.appendChild(f);

    document.getElementById("fm-inv-copia").onclick = function(){
      var a = invCosa(), b = this;
      function ok(){
        b.textContent = "copiato"; b.className = "fatto";
        setTimeout(function(){ b.textContent = "copia"; b.className = ""; }, 1800);
      }
      if(navigator.clipboard) navigator.clipboard.writeText(a.url).then(ok, ok);
      else ok();
    };
    document.getElementById("fm-inv-msg").onclick = function(){
      location.href = "sms:?&body=" + encodeURIComponent(invCosa().txt);
    };
    document.getElementById("fm-inv-post").onclick = function(){
      var a = invCosa();
      location.href = "mailto:?subject=" + encodeURIComponent(a.tit) +
        "&body=" + encodeURIComponent(a.txt);
    };
    document.getElementById("fm-inv-cond").onclick = function(){
      var a = invCosa(), b = this;
      if(navigator.share){
        navigator.share({ title:a.tit, text:a.txt, url:a.url }).catch(function(){});
      }else{
        if(navigator.clipboard) navigator.clipboard.writeText(a.txt);
        b.textContent = "copiato"; b.className = "fatto";
        setTimeout(function(){ b.textContent = "condividi"; b.className = ""; }, 1800);
      }
    };
    document.getElementById("fm-inv-chiudi").onclick = invChiudi;
    document.addEventListener("keydown", function(e){
      var g = document.getElementById("fm-inv-fg");
      if(e.key === "Escape" && g && g.classList.contains("si")) invChiudi();
    });
  }

  document.getElementById("fm-inv-velo").classList.add("si");
  document.getElementById("fm-inv-fg").classList.add("si");

  invIo = await invLeggi();
  var u = document.getElementById("fm-inv-url");
  var q = document.getElementById("fm-inv-quanti");
  var m = document.getElementById("fm-inv-modi");
  if(invIo.nome_url){
    /* ⭐ il collegamento porta ad accesso.html, non alla casa: chi
       arriva deve entrare, e accesso.html chiama fm_accetta_invito
       col nome_url che trova nell’indirizzo. */
    u.textContent = "felicitasmundi.com/accesso.html?invito=" + invIo.nome_url +
      (invEvento ? "&evento=" + invEvento : "");
    if(m) m.style.display = "";
  }else{
    /* ⚠️ senza slug non c'è maniglia: si dice, non si finge */
    u.textContent = "il tuo indirizzo non c\u2019\u00e8 ancora";
    if(m) m.style.display = "none";
  }
  if(q) q.textContent = invIo.quanti;
}

window.SpazioVivo = window.SpazioVivo || {};
window.SpazioVivo.invito = invito;
