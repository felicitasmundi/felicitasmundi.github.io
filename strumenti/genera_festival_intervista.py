#!/usr/bin/env python3
"""Rigenera villaggio-felicitas-sardegna/festival-intervista.html da communitas-aeterna-prova/diretta-bozza.html.
Una sola sala (diretta-bozza.html), le altre sono copie generate: non si correggono a mano.
Uso: python3 genera_festival_intervista.py <cartella del sito>"""
import sys, os
radice = sys.argv[1] if len(sys.argv) > 1 else "."
sala = open(os.path.join(radice, "communitas-aeterna-prova/diretta-bozza.html"), encoding="utf-8").read()

CAMBI = [
    # chi è la pagina per la matrice + indirizzo base + anteprima del link
    ('<meta name="fm-pagina" content="diretta">\n<script src="comune/matrice.js?v=11112000"></script>\n<title>FelicitasMundi</title>',
     '<base href="/communitas-aeterna-prova/">\n'
     '<!-- 3 nov 2026 13:50, Gab: rinominarlo adesso. COPIA GENERATA della sala (diretta-bozza.html) con indirizzo pulito; '
     'parte sulla puntata «Felicitas Festival Intervista». Si rigenera con strumenti/genera_festival_intervista.py: non correggerla a mano. -->\n'
     '<meta property="og:title" content="Felicitas Festival Intervista, la diretta audio">\n'
     '<meta property="og:description" content="La diretta audio di FelicitasMundi: entri con il tuo accesso.">\n'
     '<meta property="og:image" content="https://app.felicitasmundi.com/communitas-aeterna/inviti/felicitas.jpg">\n'
     '<meta name="twitter:card" content="summary_large_image">\n'
     '<meta name="fm-pagina" content="festival-intervista">\n'
     '<script src="comune/matrice.js?v=11112000"></script>\n'
     '<title>Felicitas Festival Intervista</title>'),
    # parte sulla puntata scritta nella matrice
    ("var k=new URLSearchParams(location.search).get('puntata');",
     "var k=new URLSearchParams(location.search).get('puntata')||FM_MATRICE.qui().puntata;"),
]
for a, b in CAMBI:
    assert sala.count(a) == 1, a[:60]
    sala = sala.replace(a, b)
open(os.path.join(radice, "villaggio-felicitas-sardegna/festival-intervista.html"), "w", encoding="utf-8").write(sala)
print("rigenerata festival-intervista.html")
