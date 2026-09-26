# IL VOCABOLARIO — i nomi dei buchi nelle pagine piatte

**FelicitasMundi · 17 settembre 2026 · aggiornato il 23 settembre**

⭐ Questo foglio si allega a **ogni** richiesta di versione piatta.
⛔ Design non inventa un nome: se un buco non è qui, lo chiede.

---

## ① I quattro segni, e nessun altro

| segno | cosa vuol dire |
|---|---|
| `data-c="…"` | **un buco da riempire.** Il codice capisce da sé se è un'immagine, un collegamento o un testo |
| `data-stampo="…"` | **la riga da copiare.** Ce n'è **una sola** nel file |
| `data-stato="…"` + `hidden` | **un pezzo che a volte c'è e a volte no** |
| `data-g="…"` | **un tasto** |

⛔ **E niente altro.** Nessun `sc-for`, `sc-if`, `{{ }}`, `style-hover`, `sc-camel-view-box`.
⭐ Gli effetti in **CSS puro** — transizioni, keyframes. L'hover è `:hover` vero. Il `viewBox` è `viewBox`.
⛔ **Nessuna riga d'esempio oltre allo stampo.** Chi collega dimentica di cancellarle.

---

## ② La regola dei nomi

⭐ **Il nome di un buco è il nome del dato nel database, preceduto dalla cosa.**

    data-c="orma.titolo"        data-c="persona.nome"        data-c="talento.svg"

⭐ **Si scrive esattamente come la colonna:** minuscolo, lineetta bassa — `orma.entro_il`, non `orma.entro-il`.

⛔ **Il nome dice cosa contiene, mai come si vede.** `orma.accaduto_il`, non `riga-oro`: se cambia il colore, il nome deve restare buono.

⭐ **Da qui viene la coerenza fra le pagine.** Una persona si chiama `persona.nome` nell'evento, dentro un'orma, nella rubrica e nell'Emporio — **quattro pagine, un nome solo**, e Design la disegna diversa ogni volta.

---

## ③ Le quattro cose

### persona

Compare nei volti di un evento, in chi è dentro un'orma, in «chi lo fa» di un prodotto, nella rubrica.

    persona.nome           il nome
    persona.cognome        ⚠️ colonna in arrivo
    persona.foto_url       la foto            <img>
    persona.nome_url       porta al profilo   <a>
    persona.biografia          la sua storia
    persona.descrizione_cuore  le parole del cuore
    persona.ruolo              che ruolo ha
    persona.comune_cod     dove vive
    persona.iniziale       ⭐ CALCOLATA dal nome: la lettera che si vede
                           quando manca la foto. Non è una colonna
    persona.grado          la lucentezza dell'arco attorno al volto
    persona.livello_n      la lucentezza — ⛔ il numero non si mostra MAI

⛔ **Se la foto manca si vede l'iniziale del nome**, non un vuoto. Va disegnato.

### talento

Nella testata di «La mia orma», nei cinque solidi, sulla radice di ogni orma.

    talento.nome           il nome del talento
    talento.svg            il segno disegnato          dentro un <svg>
    talento.simbolo        il segno come carattere
    talento.famiglia_id    la famiglia
    talento.gruppo_id      il gruppo
    talento.ordine         in che ordine sta

### orma

In «La mia orma», nelle figlie dentro un'altra orma, nell'evento, nelle stanze.

    orma.titolo            il titolo
    orma.sottotitolo       il sottotitolo
    orma.contenuto         il racconto, il testo
    orma.tipo              festa · karma yoga · prodotto · lezione… (29 tipi)
    orma.stadio            a che punto è
    orma.visibilita        chi la può vedere
    orma.luogo             dove
    orma.accaduto_il       quando è accaduta
    orma.entro_il          la scadenza
    orma.elemento          terra · acqua · fuoco · aria · etere
    orma.segno             il simbolo
    orma.destinazione      dove va
    orma.quanti_servono    quante persone servono per un compito
    orma.immagine_url      la foto                     <img>
    orma.momento           quando l'orma è stata scritta
    orma.persona_id        chi l'ha aperta
    orma.talento_id        il talento della radice
    orma.orma_madre_id     la madre
    orma.filo_id           il filo che la lega alla radice

⚠️ **`orma.accaduto_il` è una DATA, non un orario:** tiene il giorno, non l'ora. Se una festa ha un orario, oggi va scritto dentro il racconto.

### dentro — una persona dentro un'orma

Nei volti di un evento, in chi sta dentro un'orma. ⚠️ **Non è `persona`:** viene da `orma_persone`, e può essere anche chi non ha un account.

    dentro.nome            il nome — ⭐ c'è SEMPRE, account o no
    dentro.foto_url        la foto — ⛔ solo se ha l'account
    dentro.nome_url        porta al profilo — ⛔ solo se ha l'account
    dentro.stato           proposto · confermato · rifiutato
    dentro.preso_il        quando è entrato
    dentro.ore             le ore che ha messo
    dentro.iniziale        ⭐ CALCOLATA dal nome, come sopra

⚠️ Il nome della cosa — `dentro` — è una proposta della penna: la tavola si chiama `orma_persone`.

### argomento — i capitoli della conversazione

⚠️ **Non è una tavola:** si ricava da `messaggio.argomento`, raccogliendo i messaggi che portano lo stesso titolo.

    argomento.nome         il titolo dell'argomento
    argomento.quanti       quanti messaggi ci stanno sotto — ⭐ è un conto

⭐ **Si può rinominare:** toccare il titolo e cambiarlo. ⛔ Vuol dire riscrivere tutti i messaggi che lo portano — il gesto nel database non esiste ancora.

### giorno · squadra · stanza · micelio · comune — nati coi fogli

    giorno.data · giorno.luna · giorno.santo          ⭐ calcolati, tranne il santo
    squadra.nome · squadra.dal · squadra.progetto     ⭐ una squadra è un'orma con più persone dentro
    stanza.nome · stanza.elemento                     le cinque stanze
    micelio.elemento                                  chi lavora colle mie orme
    comune.nome · comune.prov                         la ricerca del comune

### accesso — i campi dell'ingresso

    accesso.email · accesso.codice                    ⭐ non sono colonne: sono le caselle dell'ingresso
    persona.nome · persona.cognome                    ⭐ anche loro caselle, qui

---

## ③bis Le cose delle stanze — dal database, 23 settembre

⭐ **Ogni stanza ha la sua tavola, e la sua cosa.** Lo stampo si chiama come la cosa.

### prodotto — l'Emporio · tavola `prodotti`

    prodotto.nome              prodotto.sottotitolo       prodotto.racconto
    prodotto.prezzo            prodotto.foto  <img>       prodotto.foto_secondaria <img>
    prodotto.scaffale          prodotto.sottoscaffale     prodotto.stato
    prodotto.autore            prodotto.editore           prodotto.isbn
    prodotto.formato           prodotto.nome_url  <a>     prodotto.accetto
    prodotto.quanti_talenti    prodotto.testo_lungo       prodotto.nota
    prodotto.domande           prodotto.biografia         prodotto.foto_autore <img>
    prodotto.video_url         prodotto.video_titolo      prodotto.quadrante_uno
    prodotto.occhiello_a       prodotto.occhiello_corpo   prodotto.occhiello_come
    prodotto.occhiello_domande
    prodotto.disponibilita     ⚠️ in arrivo: disponibile · su ordinazione · esaurito

⭐ **Si compra, si scambia, si dona** non sono buchi: sono **stati** — `si-compra`, `si-scambia`, `si-dona`.
⭐ **Chi lo fa** è `persona.*`.

### scaffale — gli scaffali dell'Emporio

    data-stampo="scaffale"  →  scaffale.nome
      data-stampo="prodotto"  dentro

### classe e incontro — la Scuola · tavole `classi`, `classi_incontri`

    classe.titolo      classe.occhiello   classe.racconto
    classe.chi_entra   classe.prezzo      classe.stato
    incontro.titolo    incontro.quando    incontro.durata_min
    incontro.sala      incontro.ordine    incontro.stato      incontro.registrazione

⭐ Una classe ha i suoi incontri dentro: `data-stampo="classe"` → `data-stampo="incontro"`. **Chi insegna** è `persona.*`.

### opera e pezzo — l'Edizione · tavole `opere`, `opera_pezzi`

    opera.titolo    opera.occhiello   opera.racconto   opera.genere
    opera.copertina <img>             opera.isbn       opera.prezzo
    opera.stato     opera.pubblicata_il
    pezzo.titolo    pezzo.contenuto   pezzo.immagine <img>   pezzo.didascalia   pezzo.tipo

### proposta — il Configuratore della stampa · tavola `edizione_proposte`

    proposta.tipo      proposta.famiglia   proposta.formato   proposta.carta
    proposta.pagine    proposta.copie      proposta.prezzo_copertina   proposta.costo

### servizio — l'Assistenza · tavola `servizi`

    servizio.titolo        servizio.descrizione   servizio.tipo
    servizio.durata_minuti servizio.prezzo_euro   servizio.quanti_talenti
    servizio.nome_url <a>

⭐ **A distanza, in dono, si paga in talenti, attivo** non sono buchi: sono **stati** —
`a-distanza`, `dono`, `accetta-talenti`, `attivo`. **Chi lo offre** è `persona.*`.

---

### conto — i numeri che non sono colonne

⭐ **Non stanno nel database: si contano.** Per questo hanno una parola loro.

    conto.aderenti         quante persone sono dentro l'orma
    conto.figlie           quante orme sono nate da questa
    conto.ore              le ore messe insieme

⛔ **`orma.quanti` non esiste e non esisterà.**

⭐ **E `.iniziale` è l'altro valore calcolato:** la lettera del nome, per quando la foto manca. ⛔ Ovunque ci sia una foto di persona, accanto va disegnata anche l'iniziale — **è il caso normale, non l'eccezione**: oggi nessuno ha una foto.

---

## ④ Gli stampi si annidano, e i nomi non cambiano

    data-stampo="talento"
      data-c="talento.nome"
      data-stampo="orma"
        data-c="orma.titolo"
        data-stampo="persona"
          data-c="persona.foto_url"

⭐ **Tre livelli, e il codice fa sempre lo stesso gesto.**

---

# LA PAGINA: `evento-pubblico`

⚠️ Si apre **senza account**, a chiunque abbia il collegamento.

## I buchi

    data-c="orma.immagine_url"   la foto grande                <img>
    data-c="orma.tipo"           festa · i Vicinati
    data-c="orma.titolo"         il titolo
    data-c="orma.accaduto_il"    quando
    data-c="orma.luogo"          dove
    data-c="orma.contenuto"      il racconto

**Chi organizza — si vede anche da fuori:**

    data-c="persona.foto_url"    la sua foto                   <img>
    data-c="persona.iniziale"    la lettera, se la foto manca
    data-c="persona.nome"        il nome
    data-c="persona.cognome"     il cognome
    data-c="persona.nome_url"    porta al suo profilo          <a>
    data-c="organizzazione"      ⚠️ la descrizione — nome in attesa

**Chi ha aderito:**

    data-c="conto.aderenti"      il numero

## Lo stampo dei volti

⛔ **Una riga sola, non tre.**

    data-stampo="dentro"
      data-c="dentro.foto_url"
      data-c="dentro.iniziale"
      data-c="dentro.nome"
      data-c="dentro.nome_url"

⚠️ **I volti si vedono solo a chi ha l'account.** A chi guarda da fuori resta il numero: lo stampo c'è, e il codice lo lascia chiuso.

⛔ **E dentro un'orma può esserci chi NON ha un account** — un contatto della rubrica. Per lui: **niente foto** (si vede l'iniziale) e **il nome non porta da nessuna parte**. Va disegnato anche quello.

## Gli stati

    data-stato="nessuno"      nessuno ha ancora aderito
    data-stato="senza-foto"   l'evento non ha immagine
    data-stato="passato"      la data è passata
    data-stato="gia-dentro"   chi ha l'account ed è già dentro l'orma
    data-stato="da-fuori"     chi guarda senza account: niente volti
    data-stato="pieno"        ⚠️ oggi non serve. Disegnalo lo stesso, spento

## Il tasto

    data-g="ci-saro"          la parola è «ci sarò»

⛔ **Un tasto solo.** Non due per chi ha l'account e chi no: dove porta lo decide il codice.

## I testi che non sono buchi — parole di Gab, verbatim

Restano scritti nell'HTML. ⛔ **Il codice non li tocca mai.**

Il numero degli aderenti:

> **Chi ha aderito all'evento**

Sotto il tasto:

> *Toccando entri nell'orma della festa. Là c'è:*
> *· la conversazione, e quello che serve sapere*
> *· i bisogni aperti — e chi lo sente può dare una mano*
> *· gli aggiornamenti dalla squadra organizzativa*

In fondo, «cos'è FelicitasMundi»:

> *Questa festa è un'orma: qualcuno l'ha aperta, e chi entra ci lavora dentro.*
> *Toccando «ci sarò» entri dove si parla — chi viene, cosa portare, cosa serve ancora. E se qualcosa manca, lo puoi fare tu.*
> *È il modo in cui FelicitasMundi tiene traccia di quello che si fa insieme.*

⛔ **La riga tecnica è stata tolta il 16 settembre e non torna:** *«chi ha l'account entra subito · chi non ce l'ha passa dal Nexus»*.

---

# COSA RESTA COME OGGI

⭐ Il disegno, i colori, i caratteri, le distanze, gli effetti: **tutto quello che c'è nella pagina attuale si tiene.**

Il cubo col solido terra a sinistra, il cosmo dietro, il tasto «invita chi risuona», la voce «cubo · terra · i Vicinati», il rimando alla soglia.

⛔ **Cambia solo come sono segnati i pezzi.**

---

# LE ALTRE PAGINE

Le quattordici da rifare:

**Disegnate da Design, da rendere piatte:** la-mia-orma · dentro-orma-esempio · evento-pubblico · stanza-emporio · stanza-assistenza · stanza-scuola · stanza-edizione · configuratore-stampa

**Mai disegnate da Design:** la barra · l'account · Antahkarana · l'invito · gli strumenti · la soglia

**E i Vicinati**, mai arrivati aggiornati.

⭐ **Per ognuna arriva un foglio come questo**, con i suoi buchi, i suoi stati e i suoi tasti. Le quattro cose — persona, talento, orma, dentro — più conto e argomento restano identiche in tutte.

⭐ **E foglio e pagina stanno insieme:** in `APP.FELICITASMUNDI`, dentro `SPAZIO VIVO`. Chi apre la cartella trova la pagina e le sue note.

## Le pagine già fatte

· `la-mia-orma-piatto.html` — `e8830b30…` ✅ col codice
· `dentro-orma-piatto.html` — `955ff46e…` ✅ col codice
· `evento-pubblico-piatto.html` — `11818e17…` ✅ col codice
· `testata-guscio.html` ✅ col codice
· ⚠️ **Emporio, Assistenza, Scuola, Edizione, Configuratore: piatte ma fatte PRIMA del vocabolario** — da risegnare

---

# ⚠️ COSA MANCA ANCORA, E PERCHÉ

⭐ **Il dump del database è arrivato: `talenti` e la foto dell'orma sono risolti.**

Resta **un nome solo** in attesa, e non va inventato:

· **`organizzazione`** — la descrizione di chi organizza. ⛔ **Nessuna colonna adatta esiste:** va creata. Si chiede dentro l'orma organizzativa e si ricopia di default nell'evento.

⚠️ **E una decisione aperta:** `orma.accaduto_il` è una data senza ora. Se le feste devono avere un orario, cambia il database — non il disegno.
