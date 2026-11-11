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
  /* la pagina che sta leggendo */
  qui: function () {
    var m = document.querySelector('meta[name="fm-pagina"]');
    var k = m && m.getAttribute("content");
    return (k && this.pagine[k]) || { nome: this.marchio };
  }
};
