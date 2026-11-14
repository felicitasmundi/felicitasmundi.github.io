#!/usr/bin/env python3
"""Controlli automatici prima di pubblicare.

Guarda tutto il sito e segnala:
1. link e file interni che non esistono (pagine, immagini, script, fogli di stile);
2. errori di scrittura nei file JavaScript e negli script dentro le pagine.

I link gia' rotti prima di questi controlli stanno in link-noti.txt e non fanno fallire.
Uso: python3 .github/controlli/controlla.py   (dalla cartella principale del sito)
"""
import os, re, subprocess, sys, tempfile, urllib.parse
from html.parser import HTMLParser

DOMINIO = "https://app.felicitasmundi.com/"
QUI = os.path.dirname(os.path.abspath(__file__))
SALTA = re.compile(r"^(https?:|mailto:|tel:|sms:|data:|blob:|javascript:|whatsapp:|#|//)")


class Pagina(HTMLParser):
    def __init__(self):
        super().__init__()
        self.link, self.base = [], None

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "base" and a.get("href"):
            self.base = a["href"]
        for k in ("href", "src"):
            if a.get(k):
                self.link.append(a[k].strip())


def file_del_sito():
    out = subprocess.check_output(["git", "ls-files"]).decode().splitlines()
    return [f for f in out if not f.startswith(".github/")]


def link_noti():
    p = os.path.join(QUI, "link-noti.txt")
    if not os.path.exists(p):
        return set()
    return {r.strip() for r in open(p, encoding="utf-8") if r.strip() and not r.startswith("#")}


def controlla_link(files):
    esistono = set(files)
    rotti = []
    for p in files:
        if not p.endswith(".html"):
            continue
        testo = open(p, encoding="utf-8", errors="replace").read()
        pg = Pagina()
        try:
            pg.feed(testo)
        except Exception as e:  # pagina che non si legge
            rotti.append(f"{p}  -> pagina illeggibile ({e})")
            continue
        cartella = os.path.dirname(p)
        if pg.base and pg.base.startswith("/"):
            cartella = pg.base.strip("/")
        for u in pg.link:
            if u.startswith(DOMINIO):
                u = "/" + u[len(DOMINIO):]
            if SALTA.match(u) or "${" in u or "{{" in u or "'+" in u or '"+' in u or "+'" in u:
                continue
            q = urllib.parse.unquote(u.split("#")[0].split("?")[0])
            if not q:
                continue
            dest = os.path.normpath(q.lstrip("/") if q.startswith("/") else os.path.join(cartella, q))
            if dest in (".", ""):
                dest = "index.html"
            if dest in esistono or os.path.join(dest, "index.html") in esistono:
                continue
            voce = f"{p}  -> {u}"
            if voce not in rotti:
                rotti.append(voce)
    return rotti


def controlla_script(files):
    errori = []
    for p in files:
        if p.endswith((".js", ".mjs")):
            r = subprocess.run(["node", "--check", p], capture_output=True, text=True)
            if r.returncode:
                errori.append(f"{p}  -> {primo_errore(r.stderr)}")
        elif p.endswith(".html"):
            testo = open(p, encoding="utf-8", errors="replace").read()
            for i, m in enumerate(re.finditer(r"<script(\s[^>]*)?>(.*?)</script>", testo, re.S | re.I)):
                attr, codice = m.group(1) or "", m.group(2)
                if "src=" in attr or not codice.strip():
                    continue
                t = re.search(r"type=[\"']?([^\"'\s>]+)", attr)
                tipo = t.group(1).lower() if t else ""
                if tipo and tipo not in ("module", "text/javascript", "application/javascript"):
                    continue
                with tempfile.NamedTemporaryFile("w", suffix=".mjs" if tipo == "module" else ".js", delete=False) as f:
                    f.write(codice)
                r = subprocess.run(["node", "--check", f.name], capture_output=True, text=True)
                os.unlink(f.name)
                if r.returncode:
                    riga = testo[: m.start()].count("\n") + 1
                    errori.append(f"{p} (script alla riga {riga})  -> {primo_errore(r.stderr)}")
    return errori


def primo_errore(s):
    for r in s.splitlines():
        if "Error" in r:
            return r.strip()
    return s.strip().splitlines()[-1] if s.strip() else "errore"


def main():
    files = file_del_sito()
    noti = link_noti()
    rotti = controlla_link(files)
    nuovi = [r for r in rotti if r not in noti]
    script = controlla_script(files)
    print(f"Pagine guardate: {sum(f.endswith('.html') for f in files)} · file JavaScript: {sum(f.endswith('.js') for f in files)}")
    print(f"Link rotti gia' noti (non bloccano): {len(rotti) - len(nuovi)}")
    if nuovi:
        print("\nLINK ROTTI NUOVI:")
        print("\n".join("  " + r for r in nuovi))
    if script:
        print("\nERRORI NEGLI SCRIPT:")
        print("\n".join("  " + r for r in script))
    if nuovi or script:
        sys.exit(1)
    print("Tutto a posto.")


if __name__ == "__main__":
    main()
