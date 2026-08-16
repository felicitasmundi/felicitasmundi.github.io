/* ════════════════════════════════════════════════════════════════
   Comunità Eterna FelicitasMundi · IL DATO CHE LEGGONO LE MACCHINE

   Aggiunge a ogni pagina un blocco invisibile che dice a un motore
   di ricerca o a un agente CHE COSA è quello che sta leggendo.

   ⭐ Non cambia niente di quello che si vede: nessuno stile, nessun
      testo, nessuna riga a schermo. Solo un blocco nascosto.

   ⭐⭐ E i dati sono già tutti nel database: nome, autore, editore,
      isbn, formato, prezzo, e il vicinato con lat e lon.
      Qui si dicono in un modo che la macchina capisce.

   Va caricato DOPO fm-pagina.js e fm-pagina-piu.js.

   ⛔ Niente involucro (function(){ … })(): il guscio mette tutto in
      comune e questo file legge da lì.
   ⛔ E non tocca il disegno di Design: se ne sta per conto suo.
   ════════════════════════════════════════════════════════════════ */

var FM_CASA = "https://felicitasmundi.github.io/communitas-aeterna/";

/* chi pubblica — vale per ogni pagina */
var FM_CHI = {
  "@type": "Organization",
  "@id": FM_CASA + "#organizzazione",
  "name": "Comunità Eterna FelicitasMundi",
  "url": FM_CASA,
  "legalName": "Felicitas Omnia S.r.l.s.",
  "vatID": "IT03075740906"
};

/* gli scaffali, detti come li dice il resto del mondo */
var FM_TIPO = {
  "libri":        "Book",
  "musicali":     "Product",
  "alimenti":     "Product",
  "bevande":      "Product",
  "cosmesi":      "Product",
  "abbigliamento":"Product",
  "accessori":    "Product",
  "casa":         "Product",
  "oggettistica": "Product",
  "devozionale":  "Product",
  "coscienza":    "Product"
};


/* ══ SI AGGANCIA AL DISEGNATORE ════════════════════════════════ */

var paginaRiempiSenzaDato = paginaRiempi;

paginaRiempi = function(pag, d){
  paginaRiempiSenzaDato(pag, d);
  try{ fmPosaIlDato(d); }catch(e){}
};


/* ══ IL BLOCCO ═════════════════════════════════════════════════ */

function fmPosaIlDato(d){
  if(!d || !d.nome_url) return;
  fmVia();

  var indirizzo = FM_CASA + "?p=pagina&n=" + encodeURIComponent(d.nome_url);
  var pezzi = [FM_CHI];

  /* ── ① la cosa: un libro, o un prodotto ── */
  var tipo = FM_TIPO[d.scaffale] || "Product";
  var cosa = {
    "@type": tipo,
    "@id": indirizzo + "#cosa",
    "name": d.nome,
    "url": indirizzo
  };

  if(d.sottotitolo)  cosa.alternativeName = d.sottotitolo;
  if(d.racconto)     cosa.description = fmCorto(d.racconto, 480);
  if(d.foto)         cosa.image = FM_CASA + d.foto;
  if(d.autore)       cosa.author = { "@type": "Person", "name": d.autore };
  if(d.editore)      cosa.publisher = { "@type": "Organization", "name": d.editore };
  if(d.isbn)         cosa.isbn = d.isbn;
  if(d.formato)      cosa.size = d.formato;
  if(d.sottoscaffale) cosa.genre = d.sottoscaffale;
  else if(d.scaffale) cosa.genre = d.scaffale;
  if(tipo === "Book") cosa.inLanguage = "it";

  /* ── ② il prezzo, se si compra ── */
  if(d.si_compra && d.prezzo){
    cosa.offers = {
      "@type": "Offer",
      "price": Number(d.prezzo).toFixed(2),
      "priceCurrency": "EUR",
      "availability": "https://schema.org/InStock",
      "url": indirizzo,
      "seller": { "@id": FM_CASA + "#organizzazione" }
    };
  }
  pezzi.push(cosa);

  /* ── ③ i luoghi a cui la cosa è collegata ── */
  (d.porte || []).forEach(function(p, i){
    if(!p.luogo || !p.luogo.lat || !p.luogo.lon) return;
    var luogo = {
      "@type": "Place",
      "@id": indirizzo + "#luogo-" + i,
      "name": p.luogo.nome,
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": p.luogo.lat,
        "longitude": p.luogo.lon
      }
    };
    if(p.luogo.territorio)
      luogo.address = { "@type": "PostalAddress",
                        "addressLocality": p.luogo.territorio,
                        "addressCountry": "IT" };
    if(p.testo) luogo.description = fmCorto(p.testo, 300);
    pezzi.push(luogo);
    if(!cosa.spatialCoverage) cosa.spatialCoverage = { "@id": luogo["@id"] };
  });

  /* ── ④ la pagina stessa ── */
  pezzi.push({
    "@type": "WebPage",
    "@id": indirizzo,
    "url": indirizzo,
    "name": d.nome,
    "isPartOf": { "@type": "WebSite", "@id": FM_CASA + "#sito",
                  "url": FM_CASA, "name": "Comunità Eterna FelicitasMundi",
                  "inLanguage": "it" },
    "publisher": { "@id": FM_CASA + "#organizzazione" },
    "primaryImageOfPage": d.foto ? FM_CASA + d.foto : undefined
  });

  fmScrivi({ "@context": "https://schema.org", "@graph": pezzi });

  /* ── ⑤ e le tre righe che leggono i motori e chi condivide ── */
  fmTesta("description", fmCorto(d.racconto || d.sottotitolo || "", 300));
  fmMeta("og:title", d.nome);
  fmMeta("og:description", fmCorto(d.racconto || d.sottotitolo || "", 300));
  fmMeta("og:url", indirizzo);
  fmMeta("og:type", "website");
  fmMeta("og:site_name", "Comunità Eterna FelicitasMundi");
  if(d.foto) fmMeta("og:image", FM_CASA + d.foto);
  fmMeta("twitter:card", d.foto ? "summary_large_image" : "summary");

  /* il titolo della finestra */
  document.title = d.nome + " · Comunità Eterna FelicitasMundi";

  /* l'indirizzo canonico: uno solo, sempre lo stesso */
  fmCanonico(indirizzo);
}


/* ══ MINUZIE ═══════════════════════════════════════════════════ */

function fmScrivi(oggetto){
  var s = document.createElement("script");
  s.type = "application/ld+json";
  s.setAttribute("data-fm-dato", "1");
  s.textContent = JSON.stringify(oggetto, function(k, v){
    return v === undefined ? undefined : v;
  }, 0);
  document.head.appendChild(s);
}

function fmVia(){
  [].slice.call(document.querySelectorAll("[data-fm-dato]"))
    .forEach(function(e){ e.parentNode.removeChild(e); });
}

function fmTesta(nome, testo){
  if(!testo) return;
  var e = document.head.querySelector('meta[name="' + nome + '"]');
  if(!e){
    e = document.createElement("meta");
    e.setAttribute("name", nome);
    e.setAttribute("data-fm-dato", "1");
    document.head.appendChild(e);
  }
  e.setAttribute("content", testo);
}

function fmMeta(prop, testo){
  if(!testo) return;
  var e = document.head.querySelector('meta[property="' + prop + '"]');
  if(!e){
    e = document.createElement("meta");
    e.setAttribute("property", prop);
    e.setAttribute("data-fm-dato", "1");
    document.head.appendChild(e);
  }
  e.setAttribute("content", testo);
}

function fmCanonico(indirizzo){
  var e = document.head.querySelector('link[rel="canonical"]');
  if(!e){
    e = document.createElement("link");
    e.setAttribute("rel", "canonical");
    e.setAttribute("data-fm-dato", "1");
    document.head.appendChild(e);
  }
  e.setAttribute("href", indirizzo);
}

function fmCorto(testo, quanto){
  if(!testo) return "";
  testo = String(testo).replace(/\s+/g, " ").trim();
  if(testo.length <= quanto) return testo;
  var t = testo.slice(0, quanto);
  var i = t.lastIndexOf(" ");
  return (i > 40 ? t.slice(0, i) : t) + "…";
}
