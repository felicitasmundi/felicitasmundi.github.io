#!/usr/bin/env python3
"""Pagine fisse delle voci del Cervello, come in un'enciclopedia.

Chiede al database solo quello che chiunque puo' gia' leggere senza accesso:
le voci di livello 'ospiti' (cervello_capitoli) e le pagine «visibili a tutti» (cervello_righe).
Scrive, dentro <cartella del sito>:
  voci/index.html                       elenco di tutte le voci, con Cerca
  voci/<voce>.html                      una pagina per voce, con le sue pagine
  voci/<voce>/<pagina>.html             una pagina per pagina del Cervello
  voci/elenco.json                      impronta + indirizzi (li usa l'app per «Copia il link»)
  sitemap.xml                           l'elenco per i motori di ricerca
Se il database non risponde, non scrive nulla e non fa fallire.

Uso: python3 .github/controlli/voci.py <cartella del sito>
Variabili: FM_SUPABASE_URL, FM_SUPABASE_CHIAVE (la chiave pubblica che usa gia' l'app).
"""
import hashlib, html, json, os, re, sys, unicodedata, urllib.request
from datetime import datetime
from zoneinfo import ZoneInfo

SITO = "https://app.felicitasmundi.com"
ICONA = SITO + "/communitas-aeterna-prova/icona-felicitas-512.png"
ENTRA = "/communitas-aeterna-prova/accesso.html?torna=strumento.html%3Fv%3Dcoscienza"
SEZIONI = [("base_filosofica", "Base filosofica"), ("tecnologia", "Tecnologia"),
           ("comunita", "Comunità"), ("logistica", "Logistica"), ("categorie", "Categorie di ricerca")]
NOME_SEZ = dict(SEZIONI)
MESI = ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio",
        "agosto", "settembre", "ottobre", "novembre", "dicembre"]
ID_OK = re.compile(r"^[0-9a-fA-F-]{8,64}$")
E = html.escape


def leggi(percorso):
    url = os.environ.get("FM_SUPABASE_URL", "").rstrip("/")
    chiave = os.environ.get("FM_SUPABASE_CHIAVE", "")
    req = urllib.request.Request(url + "/rest/v1/" + percorso,
                                 headers={"apikey": chiave, "Authorization": "Bearer " + chiave})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)


def slug(t, n=70):
    t = unicodedata.normalize("NFD", (t or "").lower().replace("’", "-").replace("'", "-"))
    t = "".join(c for c in t if not unicodedata.combining(c))
    t = re.sub(r"[^a-z0-9]+", "-", t).strip("-")[:n].strip("-")
    return t or "pagina"


def unico(s, usati):
    k, i = s, 2
    while k in usati:
        k, i = f"{s}-{i}", i + 1
    usati.add(k)
    return k


def data_it(s):
    try:
        d = datetime.fromisoformat((s or "").replace("Z", "+00:00")).astimezone(ZoneInfo("Europe/Rome"))
    except ValueError:
        return ""
    return f"{d.day} {MESI[d.month - 1]} {d.year}"


def corto(t, n):
    t = re.sub(r"\s+", " ", t or "").strip()
    return t if len(t) <= n else t[: n - 1].rsplit(" ", 1)[0] + "…"


def foto_url(x):
    x = (x or "").strip()
    if x.startswith("https://"):
        return x
    if re.match(r"^documenti/[A-Za-z0-9._-]+$", x):
        return "/communitas-aeterna-prova/" + x
    return None


def assoluto(u):
    return u if u.startswith("https://") else SITO + u


def js(x):
    return json.dumps(x, ensure_ascii=False).replace("<", "\\u003c").replace(">", "\\u003e")


def collega(t):
    return re.sub(r"(https?://[^\s<]+)", r'<a href="\1" rel="noopener" target="_blank">\1</a>', t)


def scomponi(r):
    righe = (r.get("testo") or "").split("\n")
    titolo = (righe.pop(0) if righe else "").strip() or "Pagina"
    par = [x.strip() for x in righe if x.strip()]
    firma = par.pop(0) if par and re.search(r"·\s*Autore:", par[0]) else ""
    foto = [u for u in (foto_url(f) for f in (r.get("foto") or "").split()) if u]
    file = foto_url(r.get("file")) if (r.get("file") or "").lower().endswith(".pdf") else None
    return titolo, firma, par, foto, file


def corpo(par):
    out, lista = [], []
    def chiudi():
        if lista:
            out.append("<ul>" + "".join(f"<li>{collega(E(x))}</li>" for x in lista) + "</ul>")
            lista.clear()
    for x in par:
        m = re.match(r"^[-•·]\s+(.*)$", x)
        if m:
            lista.append(m.group(1))
        else:
            chiudi()
            out.append(f"<p>{collega(E(x))}</p>")
    chiudi()
    return "\n".join(out)


STILE = """:root{--fondo:#122050;--carta:#1a2148;--oro:#D4AF6A;--testo:#F5F0E6;--tenue:rgba(245,240,230,.72)}
*{box-sizing:border-box}
body{margin:0;background:linear-gradient(#1d2f66,#122050 40%,#0a1430);background-color:var(--fondo);color:var(--testo);
font:21px/1.6 Georgia,"Times New Roman",serif;min-height:100vh}
main{max-width:760px;margin:0 auto;padding:24px 16px 56px}
a{color:var(--oro);word-break:break-word}
.marchio{display:inline-flex;align-items:center;gap:10px;color:var(--oro);text-decoration:none;font:600 19px system-ui,sans-serif;letter-spacing:.04em}
.marchio img{width:34px;height:34px;border-radius:8px}
.via{font:17px/1.5 system-ui,sans-serif;color:var(--tenue);margin:18px 0 0}
.via a{color:var(--tenue);text-decoration:none;border-bottom:1px solid rgba(212,175,106,.4)}
.carta{background:var(--carta);border:1px solid rgba(212,175,106,.35);border-radius:16px;padding:22px 20px;margin-top:16px}
h1{font-size:32px;line-height:1.2;margin:0 0 8px}
h2{font:600 19px system-ui,sans-serif;color:var(--oro);letter-spacing:.03em;margin:26px 0 10px}
.firma{color:var(--oro);font:italic 18px Georgia,serif;margin:0 0 16px}
.foto{width:100%;border-radius:12px;margin:14px 0;display:block}
ul{padding-left:1.2em}
.tasti{display:flex;flex-wrap:wrap;gap:10px;margin-top:22px}
.tasto{font:600 18px system-ui,sans-serif;border-radius:999px;padding:12px 20px;text-decoration:none;cursor:pointer;
background:transparent;color:var(--oro);border:1px solid var(--oro)}
.tasto.pieno{background:var(--oro);color:#0a1430;border-color:var(--oro)}
.tasto:disabled{opacity:.6}
.avviso{font:16px system-ui,sans-serif;color:var(--oro);min-height:1.2em;margin:8px 0 0}
.passi{display:flex;justify-content:space-between;gap:12px;margin-top:18px;font:17px/1.4 system-ui,sans-serif}
.passi a{text-decoration:none;max-width:48%}
.passi .dopo{text-align:right;margin-left:auto}
.elenco{list-style:none;padding:0;margin:0}
.elenco li{border-top:1px solid rgba(212,175,106,.2);padding:12px 0}
.elenco li:first-child{border-top:0}
.elenco a{text-decoration:none;font-size:21px}
.elenco small{display:block;color:var(--tenue);font:16px/1.45 system-ui,sans-serif;margin-top:3px}
.cerca{width:100%;font:19px system-ui,sans-serif;padding:13px 16px;border-radius:12px;border:1px solid rgba(212,175,106,.5);
background:#0a1430;color:var(--testo)}
.nulla{color:var(--tenue);font:17px system-ui,sans-serif}
@media print{body{background:#fff;color:#111;font-size:12pt}.marchio,.via,.tasti,.passi,.avviso,.entra,.cerca{display:none!important}
.carta{border:0;background:none;padding:0;margin:0}h1{color:#111}h2,.firma,a{color:#6b5320}.foto{max-height:120mm;width:auto;max-width:100%;margin:6mm auto;page-break-inside:avoid}
@page{size:A5;margin:16mm}}"""


def testa(titolo, descr, indirizzo, immagine, tipo, extra=""):
    return f"""<!doctype html>
<html lang="it"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{E(titolo)} · FelicitasMundi</title>
<meta name="description" content="{E(descr)}">
<link rel="canonical" href="{indirizzo}">
<meta property="og:type" content="{tipo}">
<meta property="og:site_name" content="FelicitasMundi">
<meta property="og:locale" content="it_IT">
<meta property="og:title" content="{E(titolo)}">
<meta property="og:description" content="{E(descr)}">
<meta property="og:url" content="{indirizzo}">
<meta property="og:image" content="{E(immagine)}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/communitas-aeterna-prova/favicon-felicitas-48.png">
<style>{STILE}</style>{extra}
</head><body><main>
<a class="marchio" href="/voci/"><img src="/communitas-aeterna-prova/icona-felicitas-192.png" alt="">FelicitasMundi</a>
"""


def coda(dati):
    return f"""<p class="tasti entra"><a class="tasto pieno" href="{ENTRA}">Entra su FelicitasMundi ›</a></p>
</main>
<script type="application/json" id="fm-dati">{js(dati)}</script>
<script src="/voci/voce.js?v=1" defer></script>
</body></html>
"""


def tasti_azione(pdf_etichetta):
    return f"""<div class="tasti">
<button class="tasto" type="button" data-fai="pdf">{pdf_etichetta}</button>
<button class="tasto" type="button" data-fai="stampa">Stampa</button>
<button class="tasto" type="button" data-fai="copia">Copia il link</button>
<button class="tasto" type="button" data-fai="condividi">Condividi</button>
</div>
<p class="avviso" aria-live="polite"></p>"""


def main():
    if len(sys.argv) != 2:
        sys.exit("Uso: voci.py <cartella del sito>")
    sito = sys.argv[1]
    if not os.environ.get("FM_SUPABASE_URL") or not os.environ.get("FM_SUPABASE_CHIAVE"):
        print("Manca l'indirizzo del database: nessuna pagina delle voci.")
        return
    try:
        capitoli = leggi("cervello_capitoli?select=id,titolo,sezione,padre_id,ordine,descrizione,parole_chiave&livello=eq.ospiti&order=ordine")
        righe = leggi("cervello_righe?select=id,capitolo_id,testo,foto,file,scritta_il,modificata_il&visibile_a_tutti=eq.true&order=scritta_il,id")
    except Exception as e:
        print(f"Il database non ha dato le voci ({e}): nessuna pagina delle voci.")
        return
    capitoli = [c for c in capitoli if isinstance(c, dict) and ID_OK.match(str(c.get("id", "")))]
    righe = [r for r in righe if isinstance(r, dict) and ID_OK.match(str(r.get("id", ""))) and r.get("testo")]
    impronta = hashlib.sha256(json.dumps([capitoli, righe], ensure_ascii=False, sort_keys=True).encode()).hexdigest()
    cap = {c["id"]: c for c in capitoli}
    per_voce = {}
    for r in righe:
        if r["capitolo_id"] in cap:
            per_voce.setdefault(r["capitolo_id"], []).append(r)
    ordine_sez = {k: i for i, (k, _) in enumerate(SEZIONI)}
    voci = sorted((cap[k] for k in per_voce), key=lambda c: (ordine_sez.get(c.get("sezione"), 99), c.get("ordine") or 0, c["titolo"] or ""))

    def via(c):
        out, x, giri = [], c, 0
        while x and giri < 5:
            out.insert(0, x)
            x, giri = cap.get(x.get("padre_id")), giri + 1
        return out

    cartella = os.path.join(sito, "voci")
    os.makedirs(cartella, exist_ok=True)
    usati_voci, mappa_righe, mappa_voci, sitemap, cerca = set(), {}, {}, [], []
    for c in voci:
        sv = unico(slug(c["titolo"]), usati_voci)
        c["_slug"], c["_url"] = sv, f"/voci/{sv}.html"
        mappa_voci[c["id"]] = c["_url"]
        usati = set()
        for r in per_voce[c["id"]]:
            r["_parti"] = scomponi(r)
            sp = unico(slug(r["_parti"][0]), usati)
            r["_url"] = f"/voci/{sv}/{sp}.html"
            mappa_righe[r["id"]] = r["_url"]

    for c in voci:
        pagine = per_voce[c["id"]]
        catena = via(c)
        sez = NOME_SEZ.get(c.get("sezione"), "")
        briciole = ['<a href="/voci/">Voci</a>'] + ([f'<a href="/voci/#{E(c.get("sezione") or "")}">{E(sez)}</a>'] if sez else []) + \
                   [(f'<a href="{x["_url"]}">{E(x["titolo"])}</a>' if x.get("_url") else E(x["titolo"] or "")) for x in catena]
        percorso = " › ".join([sez] + [x["titolo"] or "" for x in catena]) if sez else " › ".join(x["titolo"] or "" for x in catena)
        os.makedirs(os.path.join(cartella, c["_slug"]), exist_ok=True)
        for i, r in enumerate(pagine):
            titolo, firma, par, foto, file = r["_parti"]
            indirizzo = SITO + r["_url"]
            descr = corto(" ".join(par), 170) or corto(titolo, 170)
            img = assoluto(foto[0]) if foto else ICONA
            ld = {"@context": "https://schema.org", "@type": "Article", "headline": titolo[:110], "inLanguage": "it",
                  "datePublished": r.get("scritta_il"), "dateModified": r.get("modificata_il") or r.get("scritta_il"),
                  "image": img, "mainEntityOfPage": indirizzo,
                  "publisher": {"@type": "Organization", "name": "FelicitasMundi", "logo": {"@type": "ImageObject", "url": ICONA}}}
            prima = pagine[i - 1] if i > 0 else None
            dopo = pagine[i + 1] if i + 1 < len(pagine) else None
            passi = ('<nav class="passi">' +
                     (f'<a href="{prima["_url"]}">‹ {E(prima["_parti"][0])}</a>' if prima else "") +
                     (f'<a class="dopo" href="{dopo["_url"]}">{E(dopo["_parti"][0])} ›</a>' if dopo else "") + "</nav>") if (prima or dopo) else ""
            figure = "".join(f'<img class="foto" src="{E(u)}" alt="">' for u in foto)
            doc_pdf = f'<p><a href="{E(file)}" target="_blank" rel="noopener">Apri il documento (PDF)</a></p>' if file else ""
            dati = {"url": indirizzo, "titolo": titolo, "doc": [{"via": percorso, "titolo": titolo, "firma": firma, "par": par, "foto": foto}]}
            pagina = testa(titolo, descr, indirizzo, img, "article",
                           f'\n<script type="application/ld+json">{js(ld)}</script>') + f"""<p class="via">{" › ".join(briciole)}</p>
<article class="carta">
<h1>{E(titolo)}</h1>
{f'<p class="firma">{E(firma)}</p>' if firma else ''}
{corpo(par)}
{figure}
{doc_pdf}
{tasti_azione("Scarica il PDF")}
</article>
{passi}
""" + coda(dati)
            with open(os.path.join(sito, r["_url"].lstrip("/")), "w", encoding="utf-8") as f:
                f.write(pagina)
            sitemap.append((indirizzo, (r.get("modificata_il") or r.get("scritta_il") or "")[:10]))
            cerca.append({"t": titolo, "v": c["titolo"], "u": r["_url"], "x": " ".join(par)})

        # pagina della voce
        indirizzo = SITO + c["_url"]
        foto0 = next((p["_parti"][3][0] for p in pagine if p["_parti"][3]), None)
        descr = corto(c.get("descrizione") or " · ".join(p["_parti"][0] for p in pagine), 170)
        elenco = "\n".join(f'<li><a href="{p["_url"]}">{E(p["_parti"][0])}</a><small>{E(corto(" ".join(p["_parti"][2]), 160))}</small></li>' for p in pagine)
        dati = {"url": indirizzo, "titolo": c["titolo"],
                "doc": [{"via": percorso, "titolo": p["_parti"][0], "firma": p["_parti"][1], "par": p["_parti"][2], "foto": p["_parti"][3]} for p in pagine]}
        pagina = testa(c["titolo"], descr, indirizzo, assoluto(foto0) if foto0 else ICONA, "website") + f"""<p class="via">{" › ".join(briciole[:-1])}</p>
<section class="carta">
<h1>{E(c["titolo"])}</h1>
{f'<p class="firma">{E(c["descrizione"])}</p>' if c.get("descrizione") else ''}
<h2>{len(pagine)} {"pagina" if len(pagine) == 1 else "pagine"}</h2>
<ul class="elenco">
{elenco}
</ul>
{tasti_azione("Scarica il PDF della voce")}
</section>
""" + coda(dati)
        with open(os.path.join(sito, c["_url"].lstrip("/")), "w", encoding="utf-8") as f:
            f.write(pagina)
        sitemap.append((indirizzo, max((p.get("modificata_il") or "")[:10] for p in pagine)))

    # indice di tutte le voci, per parte
    blocchi = []
    for k, nome in SEZIONI:
        vv = [c for c in voci if c.get("sezione") == k]
        if not vv:
            continue
        righe_html = "\n".join(f'<li><a href="{c["_url"]}">{E(c["titolo"])}</a><small>{len(per_voce[c["id"]])} '
                               f'{"pagina" if len(per_voce[c["id"]]) == 1 else "pagine"}</small></li>' for c in vv)
        blocchi.append(f'<h2 id="{k}">{E(nome)}</h2>\n<ul class="elenco">\n{righe_html}\n</ul>')
    indirizzo = SITO + "/voci/"
    indice = testa("Le voci del Cervello", "Le voci del Cervello Digitale Evoluto di FelicitasMundi, pagina per pagina.",
                   indirizzo, ICONA, "website") + f"""<section class="carta">
<h1>Le voci del Cervello</h1>
<input class="cerca" id="fm-cerca" type="search" placeholder="Cerca una parola" aria-label="Cerca una parola" autocomplete="off">
<ul class="elenco" id="fm-trovati" hidden></ul>
<div id="fm-voci">
{chr(10).join(blocchi)}
</div>
</section>
""" + coda({"url": indirizzo, "titolo": "Le voci del Cervello", "cerca": cerca})
    with open(os.path.join(cartella, "index.html"), "w", encoding="utf-8") as f:
        f.write(indice)
    sitemap.insert(0, (indirizzo, max([d for _, d in sitemap] or [""])))

    with open(os.path.join(sito, "sitemap.xml"), "w", encoding="utf-8") as f:
        f.write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n')
        f.write(f"  <url><loc>{SITO}/</loc></url>\n")
        for u, d in sitemap:
            f.write(f"  <url><loc>{E(u)}</loc>" + (f"<lastmod>{d}</lastmod>" if d else "") + "</url>\n")
        f.write("</urlset>\n")

    with open(os.path.join(cartella, "elenco.json"), "w", encoding="utf-8") as f:
        json.dump({"impronta": impronta, "voci": mappa_voci, "righe": mappa_righe},
                  f, ensure_ascii=False, indent=0)
    print(f"Voci: {len(voci)} · pagine: {len(mappa_righe)}")


if __name__ == "__main__":
    main()
