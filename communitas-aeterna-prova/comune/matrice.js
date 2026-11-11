/* LA MATRICE · 11 nov 2026
   Gab 11/11 18:59: «è l indice del cervello la matrice».
   Un solo posto per i nomi e i testi brevi delle pagine. Le pagine li leggono da qui e non li scrivono dentro.
   Si carica nella <head>, prima degli altri script: così la pagina mostra subito il nome giusto e mai un nome vecchio.
   Ogni pagina dichiara chi è con <meta name="fm-pagina" content="<chiave>">.
   voce = la voce dell'indice del Cervello (Base filosofica · Tecnologia · Comunità · Logistica).
   I testi vengono dalle parole di Gab nelle fonti; quelli che mancano restano [ ] e non vanno in pubblico. */
window.FM_MATRICE = {
  marchio: "FelicitasMundi",
  pagine: {
    /* la sala delle dirette: il titolo vero arriva dalla puntata (database o elenco della pagina) */
    "diretta": {
      voce: "[ voce dell'indice da confermare ]",
      nome: "FelicitasMundi"
    },
    /* 3 nov 2026 13:50, Gab: «rinominarlo adesso» */
    "festival-intervista": {
      voce: "Logistica › Eventi e festival",
      nome: "Felicitas Festival Intervista",
      puntata: "festival-intervista"
    }
  },
  /* le puntate della sala delle dirette (diretta-bozza.html?puntata=<chiave>), spostate qui l'11/11 con le parole di Gab.
     Le dirette nuove stanno nel database (?puntata=<id>): questo elenco resta per i link già mandati. */
  puntate: {
    /* 3 nov 13:46, Gab: «la chat si chiama Felicitas Festival Intervista. E poi mando l'invito a degli ospiti che possono accedere e parlare senza problemi» — solo col link */
    'festival-intervista':{titolo:'Felicitas Festival Intervista', chi:'diretta audio con gli ospiti del Festival'},
    /* 19 ott 23:50, Gab: «fare una diretta radio in cui racconto della settimana conclusa, e la registro mentre la faccio / mandami link» */
    /* 21:54, Gab: «racconti e tisane / appuntamento settimanale con Gabriele, / tema del giorno, il ritorno alla radio» */
    'settimana-19-ott':{titolo:'racconti e tisane', chi:'appuntamento settimanale con Gabriele · tema del giorno, il ritorno alla radio'},
    /* 19 ott 09:44, Gab: «ore 17 / Assistenza Spirituale - Corsi Usci / solo per chi ha il link» — martedì 20, solo col link */
    'usci-20-ott':{titolo:'Assistenza Spirituale - Corsi Usci', chi:'martedì 20 ottobre · ore 17', quando:'2026-10-20T17:00:00+02:00'},
    /* 18 ott 20:36, Gab: «tema: felicitas festival 21 nov / con marco e ivano» · 20:40 «mandami il link della diretta» — solo col link */
    'festival-21-nov':{titolo:'Felicitas Festival 21 nov', chi:'domenica 18 ottobre · con Marco e Ivano'},
    /* 15 ott 13:01, Gab: «crea diretta prova con stefano» · «non ho tempo crea tu il link» — solo col link, non in Bacheca */
    'stefano':{titolo:'prova con stefano', chi:'giovedì 15 ottobre'},
    /* 15 ott 08:45, Gab: «creami la stessa cosa con monica» · «diretta con monica» — solo col link, non in Bacheca */
    'monica':{titolo:'diretta con monica', chi:'giovedì 15 ottobre'},
    /* 14 ott 11:51, Gab: «prova con giovanni / 14 vai» — solo col link, non in Bacheca */
    'prova-giovanni':{titolo:'prova con giovanni', chi:'mercoledì 14 ottobre · ore 14'},
    'surra':{titolo:'Felicitas Festival · incontro con Surra', chi:'martedì 13 ottobre · ore 21 · con Marco e Gabriele'},
    'mutuo-credito':{titolo:'Mutuo credito cooperativo', chi:'giovedì 16 ottobre · ore 19 · con Guido Grossi e Vittorino Crivello · a cura di Gabriele Dettori e Marco Caddeo'}
  },
  /* la pagina che sta leggendo */
  qui: function () {
    var m = document.querySelector('meta[name="fm-pagina"]');
    var k = m && m.getAttribute("content");
    return (k && this.pagine[k]) || { nome: this.marchio };
  }
};
