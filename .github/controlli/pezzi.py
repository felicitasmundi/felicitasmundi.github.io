#!/usr/bin/env python3
"""L'app a pezzi: strumento.html diviso in tanti file piccoli, uno per parte.

  python3 .github/controlli/pezzi.py dividi     strumento.html -> sorgenti/strumento/*
  python3 .github/controlli/pezzi.py assembla   sorgenti/strumento/* -> strumento.html
  python3 .github/controlli/pezzi.py verifica   i pezzi rimessi insieme sono identici a strumento.html?

I pezzi si rimettono insieme uno dopo l'altro, nell'ordine di ordine.txt, senza cambiare
nemmeno un carattere: la pagina che arriva al telefono e' identica a quella di prima.
Cosi' chi lavora sul Giornale tocca solo il pezzo del Giornale, e chi lavora sulla
chat solo quello della chat.
"""
import os, re, sys, unicodedata

APP = "communitas-aeterna-prova/strumento.html"
PEZZI = "sorgenti/strumento"
ORDINE = os.path.join(PEZZI, "ordine.txt")
TITOLO = re.compile(r"^/\* (?:═══ )?(?!SQL\b)([A-ZÀ-Ý][A-ZÀ-Ý' ]{3,})", re.M)
STILE_GRANDE = 4000  # i fogli di stile piu' lunghi di cosi' diventano un pezzo a se'


def nome(s):
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode().lower()
    return re.sub(r"[^a-z0-9]+", "-", s).strip("-")[:40] or "parte"


def tagli(t):
    """Dove tagliare: inizio e fine dei fogli di stile grandi e dello script grande,
    e dentro lo script ai titoli delle parti (/* GIORNALE ..., /* ═══ ASSISTENZA ...)."""
    punti, dentro = [], []  # dentro: tratti gia' presi da uno script grande
    for m in re.finditer(r"<(style|script)(\s[^>]*)?>", t, re.I):
        if "src=" in (m.group(2) or "") or any(a <= m.start() < b for a, b in dentro):
            continue
        fine = t.find("</" + m.group(1), m.end())
        if m.group(1).lower() == "script":
            dentro.append((m.end(), fine))
        if fine - m.end() < STILE_GRANDE:
            continue
        if m.group(1).lower() == "style":
            punti.append((m.end(), "css", "stile"))
        else:
            punti.append((m.end(), "js", "inizio"))
            punti += [(h.start(), "js", nome(h.group(1))) for h in TITOLO.finditer(t, m.end(), fine)]
        punti.append((fine, "html", "pagina"))
    return sorted(set(punti))


def dividi():
    t = open(APP, encoding="utf-8", newline="").read()
    pos = [(0, "html", "testa")] + tagli(t)
    os.makedirs(PEZZI, exist_ok=True)
    for f in os.listdir(PEZZI):
        os.remove(os.path.join(PEZZI, f))
    elenco, usati = [], set()
    for i, (inizio, ext, n) in enumerate(pos):
        fine = pos[i + 1][0] if i + 1 < len(pos) else len(t)
        if fine == inizio:
            continue
        if (n, ext) in usati and ext == "js":
            n += "-2"
        usati.add((n, ext))
        f = f"{len(elenco) + 1:02d}-{n}.{ext}"
        with open(os.path.join(PEZZI, f), "w", encoding="utf-8", newline="") as o:
            o.write(t[inizio:fine])
        elenco.append(f)
    with open(ORDINE, "w", encoding="utf-8") as o:
        o.write("# I pezzi di strumento.html, nell'ordine in cui si rimettono insieme.\n")
        o.write("# Per aggiungere una parte nuova: un file nuovo qui e una riga qui sotto.\n")
        o.write("\n".join(elenco) + "\n")
    print(f"{APP}: {len(t)} caratteri in {len(elenco)} pezzi")


def insieme():
    elenco = [r.strip() for r in open(ORDINE, encoding="utf-8") if r.strip() and not r.startswith("#")]
    return "".join(open(os.path.join(PEZZI, f), encoding="utf-8", newline="").read() for f in elenco)


def assembla():
    t = insieme()
    with open(APP, "w", encoding="utf-8", newline="") as o:
        o.write(t)
    print(f"{APP} rimesso insieme: {len(t)} caratteri")


def verifica():
    if not os.path.exists(ORDINE):
        print("L'app non e' ancora a pezzi: niente da verificare.")
        return
    if insieme() != open(APP, encoding="utf-8", newline="").read():
        print(f"{APP} e' diverso dai suoi pezzi.\n"
              f"Le modifiche all'app vanno fatte nei file di {PEZZI}/, poi «pezzi.py assembla».")
        sys.exit(1)
    print("L'app e' identica ai suoi pezzi.")


if __name__ == "__main__":
    {"dividi": dividi, "assembla": assembla, "verifica": verifica}[sys.argv[1] if len(sys.argv) > 1 else "verifica"]()
