# L'app a pezzi

`communitas-aeterna-prova/strumento.html` (l'app) si scrive qui, un pezzo per parte.

Per cambiare l'app:
1. modifica il pezzo giusto in `sorgenti/strumento/` (per esempio `24-giornale.js`);
2. dalla cartella principale lancia `python3 .github/controlli/pezzi.py assembla`;
3. pubblica insieme il pezzo e `strumento.html`.

Se si cambia `strumento.html` a mano senza cambiare il pezzo, i controlli lo fermano
prima che vada online e il sito resta com'era.
Per una parte nuova: un file nuovo in `sorgenti/strumento/` e una riga in `ordine.txt`.
