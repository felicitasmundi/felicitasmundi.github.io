#!/usr/bin/env python3
"""Pagine degli articoli pubblici del Giornale.

Chiede al database solo gli articoli 'pubblico' (funzione fm_giornale_articoli_pubblici, SQL 260)
e scrive una pagina per articolo in <cartella>/giornale/<id>.html, con titolo e immagine
per l'anteprima quando il link si condivide (WhatsApp, Telegram, Facebook...).
Niente nomi di persone: la funzione non li dà.

Uso: python3 .github/controlli/giornale.py <cartella del sito da pubblicare>
Variabili: FM_SUPABASE_URL, FM_SUPABASE_CHIAVE (la chiave pubblica che usa gia' l'app).
Se il database non risponde o la funzione non c'e' ancora, non scrive nulla e non fa fallire.
"""
import hashlib, html, json, os, re, sys, urllib.request
from datetime import datetime, timezone
from zoneinfo import ZoneInfo

SITO = "https://app.felicitasmundi.com"
IMMAGINE_BASE = SITO + "/communitas-aeterna-prova/icona-felicitas-512.png"
ENTRA = "/communitas-aeterna-prova/accesso.html?torna=strumento.html%3Fv%3Dgiornale"
MESI = ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio",
        "agosto", "settembre", "ottobre", "novembre", "dicembre"]
ID_OK = re.compile(r"^[0-9a-fA-F-]{8,64}$")


def leggi_articoli():
    url = os.environ.get("FM_SUPABASE_URL", "").rstrip("/")
    chiave = os.environ.get("FM_SUPABASE_CHIAVE", "")
    if not url or not chiave:
        print("Manca l'indirizzo del database: nessuna pagina articolo.")
        return None
    req = urllib.request.Request(
        url + "/rest/v1/rpc/fm_giornale_articoli_pubblici",
        data=json.dumps({"p_limite": 500}).encode(),
        headers={"apikey": chiave, "Authorization": "Bearer " + chiave,
                 "Content-Type": "application/json"}, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            dati = json.load(r)
    except Exception as e:
        print(f"Il database non ha dato gli articoli ({e}): nessuna pagina articolo.")
        return None
    return [a for a in dati if isinstance(a, dict) and ID_OK.match(str(a.get("id", "")))]


def youtube_id(link):
    m = re.search(r"(?:youtu\.be/|youtube\.com/(?:watch\?(?:.*&)?v=|embed/|shorts/|live/))([A-Za-z0-9_-]{11})", link or "")
    return m.group(1) if m else None


def data_it(s):
    if not s:
        return ""
    try:
        d = datetime.fromisoformat(s.replace("Z", "+00:00")).astimezone(ZoneInfo("Europe/Rome"))
    except ValueError:
        return ""
    return f"{d.day} {MESI[d.month - 1]} {d.year}"


def corto(t, n):
    t = re.sub(r"\s+", " ", t or "").strip()
    return t if len(t) <= n else t[: n - 1].rsplit(" ", 1)[0] + "…"


def paragrafi(t):
    e = lambda x: html.escape(x)
    blocchi = [b.strip() for b in re.split(r"\n\s*\n", t or "") if b.strip()]
    out = []
    for b in blocchi:
        b = e(b).replace("\n", "<br>")
        b = re.sub(r"(https?://[^\s<]+)", r'<a href="\1" rel="noopener" target="_blank">\1</a>', b)
        out.append(f"<p>{b}</p>")
    return "\n".join(out)


def js(x):
    return json.dumps(x).replace("<", "\\u003c").replace(">", "\\u003e")


def pagina(a):
    aid = a["id"]
    link = (a.get("link") or "").strip()
    yt = youtube_id(link) or youtube_id(a.get("contenuto"))
    testo = a.get("contenuto") or ""
    titolo = (a.get("titolo") or "").strip() or corto(testo, 70) or "FelicitasMundi"
    descr = corto(testo, 180) if testo.strip() else "FelicitasMundi"
    img = (a.get("immagine_url") or "").strip()
    if not img.startswith("https://"):
        img = f"https://i.ytimg.com/vi/{yt}/hqdefault.jpg" if yt else IMMAGINE_BASE
    alt = (a.get("immagine_alt") or "").strip() or titolo
    indirizzo = f"{SITO}/giornale/{aid}.html"
    E = html.escape
    video = (f'<div class="video"><iframe src="https://www.youtube-nocookie.com/embed/{yt}" title="{E(titolo)}" '
             f'allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen" loading="lazy"></iframe></div>') if yt else (
             f'<img class="foto" src="{E(img)}" alt="{E(alt)}">' if img != IMMAGINE_BASE else "")
    altro = f'<p class="link"><a href="{E(link)}" rel="noopener" target="_blank">{E(link)}</a></p>' if link and not youtube_id(link) else ""
    return f"""<!doctype html>
<html lang="it"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>{E(titolo)} · FelicitasMundi</title>
<meta name="description" content="{E(descr)}">
<link rel="canonical" href="{indirizzo}">
<meta property="og:type" content="article">
<meta property="og:site_name" content="FelicitasMundi">
<meta property="og:locale" content="it_IT">
<meta property="og:title" content="{E(titolo)}">
<meta property="og:description" content="{E(descr)}">
<meta property="og:url" content="{indirizzo}">
<meta property="og:image" content="{E(img)}">
<meta property="og:image:alt" content="{E(alt)}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/communitas-aeterna-prova/favicon-felicitas-48.png">
<style>
:root{{--fondo:#122050;--carta:#1a2148;--oro:#D4AF6A;--testo:#F5F0E6}}
*{{box-sizing:border-box}}
body{{margin:0;background:linear-gradient(#1d2f66,#122050 40%,#0a1430);background-color:var(--fondo);color:var(--testo);
font:24px/1.55 Georgia,"Times New Roman",serif;min-height:100vh}}
main{{max-width:760px;margin:0 auto;padding:28px 16px 48px}}
.marchio{{display:flex;align-items:center;gap:10px;color:var(--oro);text-decoration:none;font:600 20px system-ui,sans-serif;letter-spacing:.04em}}
.marchio img{{width:36px;height:36px;border-radius:8px}}
article{{background:var(--carta);border:1px solid rgba(212,175,106,.35);border-radius:16px;padding:22px 20px;margin-top:22px}}
h1{{font-size:34px;line-height:1.2;margin:0 0 6px}}
.data{{color:var(--oro);font:18px system-ui,sans-serif;margin:0 0 16px}}
.video{{position:relative;padding-top:56.25%;margin:0 0 18px;border-radius:12px;overflow:hidden;background:#000}}
.video iframe{{position:absolute;inset:0;width:100%;height:100%;border:0}}
.foto{{width:100%;border-radius:12px;margin:0 0 18px;display:block}}
a{{color:var(--oro);word-break:break-word}}
.tasti{{display:flex;flex-wrap:wrap;gap:12px;margin-top:24px}}
.tasto{{font:600 19px system-ui,sans-serif;border-radius:999px;padding:13px 22px;text-decoration:none;border:0;cursor:pointer}}
.entra{{background:var(--oro);color:#0a1430}}
.condividi{{background:transparent;color:var(--oro);border:1px solid var(--oro)}}
</style>
</head><body><main>
<a class="marchio" href="/communitas-aeterna-prova/accoglienza.html"><img src="/communitas-aeterna-prova/icona-felicitas-192.png" alt="">FelicitasMundi</a>
<article>
<h1>{E(titolo)}</h1>
<p class="data">{E(data_it(a.get("momento")))}</p>
{video}
{paragrafi(testo)}
{altro}
<div class="tasti">
<a class="tasto entra" href="{ENTRA}">Entra su FelicitasMundi ›</a>
<button class="tasto condividi" type="button" id="condividi">Condividi</button>
</div>
</article>
</main>
<script>
document.getElementById("condividi").onclick=function(){{
  var d={{title:{js(titolo)},url:{js(indirizzo)}}};
  if(navigator.share){{navigator.share(d).catch(function(){{}});return;}}
  location.href="https://wa.me/?text="+encodeURIComponent(d.title+" "+d.url);
}};
</script>
</body></html>
"""


def main():
    if len(sys.argv) != 2:
        sys.exit("Uso: giornale.py <cartella del sito>")
    cartella = os.path.join(sys.argv[1], "giornale")
    articoli = leggi_articoli()
    if articoli is None:
        return
    os.makedirs(cartella, exist_ok=True)
    for a in articoli:
        with open(os.path.join(cartella, a["id"] + ".html"), "w", encoding="utf-8") as f:
            f.write(pagina(a))
    # impronta: cambia solo se cambia un articolo pubblico (serve a non ripubblicare per niente)
    dati = json.dumps(sorted(articoli, key=lambda x: x["id"]), ensure_ascii=False, sort_keys=True)
    with open(os.path.join(cartella, "elenco.json"), "w", encoding="utf-8") as f:
        json.dump({"impronta": hashlib.sha256(dati.encode()).hexdigest(),
                   "articoli": sorted(a["id"] for a in articoli)}, f, indent=0)
    print(f"Pagine articolo scritte: {len(articoli)}")


if __name__ == "__main__":
    main()
