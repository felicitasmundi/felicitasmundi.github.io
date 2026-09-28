#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ragionamento.py — rigenera «Il ragionamento» dal Cruscotto.

Uso, ogni lunedì:
    python3 ragionamento.py CRUSCOTTO.md settimane.html > ragionamento-<settimana>.html

  CRUSCOTTO.md     il Cruscotto vivo (la fonte: ⛔ nessuna sintesi, si estrae e basta)
  settimane.html   i blocchi in cima — «la settimana che comincia», «la settimana
                   prima» — scritti a mano il lunedì (un frammento HTML, niente <html>)

Cosa fa:
  · legge il Cruscotto riga per riga e raccoglie le FRASI di Gab:
      blocco  — la riga comincia con « : un dettato riportato per intero
      citata  — una frase fra «virgolette» dentro una riga
      marcata — una riga segnata come sua («Gab:», «(Gab)», «Parole di Gab») senza virgolette
  · ogni frase sta sotto il suo ARGOMENTO — il titolo (#, ##, ###, ####) più vicino
    sopra di lei — e porta il numero di riga del Cruscotto
  · ogni argomento va in un ELEMENTO: se sta sotto un titolo di elemento del
    Cruscotto (⊕ NEXUS · 🟤 TERRA · …) prende quello; altrimenti lo dicono le
    parole del titolo e delle sue righe (le regole sono in ELEMENTI, qui sotto);
    se nessuna regola parla, va in Nexus
  · scrive una pagina sola: le settimane in cima, la plancia (elementi · mesi ·
    cerca), poi gli argomenti per elemento colle loro frasi
Lo script non contiene testi: i contenuti stanno nel Cruscotto e in settimane.html.
"""

import re, sys, html, collections

# ── gli elementi, nell'ordine della plancia ─────────────────────────────────
ELEMENTI = [
  # chiave, etichetta, colore, sottotitolo, parole che lo riconoscono (regex, peso)
  ("nexus", "⊕ NEXUS",     "#8C2F39", "Antahkarana — lo sviluppo applicato al lavoro individuale e di gruppo · le orme, le squadre",
     [(r"\bnexus\b",3),(r"antahkarana|anthakarana",3),(r"\borm[ae]\b",1),(r"\bsquadr",2),(r"praticantato",2),
      (r"\btalent",1),(r"karma yoga",2),(r"\bsoglia\b",1),(r"\bnucleo\b",1),(r"\bquota\b",1),(r"virt[uù]",1),(r"megafono",1)]),
  ("terra", "🟤 TERRA",     "#AA8844", "i Vicinati — i luoghi, chi c’è vicino",
     [(r"vicinat",3),(r"\bmicel",2),(r"\bceppo\b",2),(r"\bcomun[ei]\b",1),(r"territor",2),(r"\bmappa\b",1),
      (r"festival",2),(r"baratili",3),(r"sardegna|toscana",1),(r"\bluog[ho]",1),(r"mestier",1)]),
  ("acqua", "🔵 ACQUA",     "#4488BB", "l’Emporio — vendita, dono e scambio",
     [(r"empori",3),(r"prodott",2),(r"vetrina",2),(r"carrell",2),(r"\bprezz",1),(r"\bvend",1),(r"fornitor",2),
      (r"magazzin",2),(r"\bordin[ei]\b",1),(r"cartoleria|fabriano|desktoo",3),(r"\bdono\b",1),(r"flyeralarm",1)]),
  ("fuoco", "🔴 FUOCO",     "#CC6644", "l’assistenza — chi accompagna",
     [(r"assistenz",3),(r"operator",1),(r"trattament",2),(r"iridolog",3),(r"massagg",2),(r"accompagn",1),(r"\bcur[ae]\b",1)]),
  ("aria",  "🟢 ARIA",      "#669944", "l’Edizione — la voce, la stampa, la radio",
     [(r"edizion",3),(r"\blibr[oi]\b",1),(r"\bstamp",2),(r"\bradio\b",2),(r"editor",2),(r"pubblic",1),
      (r"trascrizion",2),(r"instagram|podcast|newsletter",1),(r"\bvoce\b",1),(r"aplomb",2)]),
  ("etere", "🟣 ETERE",     "#9966CC", "la Scuola — chi insegna, chi cerca",
     [(r"\bscuol",3),(r"\bcors[oi]\b",2),(r"\blezion",2),(r"insegn",2),(r"formazion",2),(r"universit|accademi",1),(r"\bstud[io]\b",1)]),
  ("svil",  "⚙️ SVILUPPO",  "#5A7A8C", "il sistema, i terminali, il database",
     [(r"database|supabase|\bsql\b|policy|tavol[ae]|colonn[ae]|trigger|\brls\b",3),(r"terminal",2),(r"\bguscio\b",2),
      (r"\bpiatt[oi]\b",2),(r"\bscript\b",1),(r"\bfile\b",1),(r"\bjson\b|\bhtml\b|\bcss\b|\bjs\b|javascript",2),
      (r"github|\brepo\b|commit|pubblica",1),(r"codice|\bcode\b|design",1),(r"\bbug\b|errore|rott[oa]",1),
      (r"\bcache\b|cdn|dominio|dns|aruba|wordpress|vps|plugin|manifest",2),(r"md5|byte",1),(r"cruscotto|specifica",1)]),
]
COLORE = {k: c for k, _, c, _, _ in ELEMENTI}
TITOLO_ELEMENTO = {  # i titoli di elemento che il Cruscotto usa nelle settimane archiviate
  "nexus": r"⊕\s*NEXUS", "terra": r"🟤\s*TERRA", "acqua": r"🔵\s*ACQUA", "fuoco": r"🔴\s*FUOCO",
  "aria": r"🟢\s*ARIA", "etere": r"🟣\s*ETERE", "svil": r"⚙️?\s*SVILUPPO",
}
MESI = ["gennaio","febbraio","marzo","aprile","maggio","giugno","luglio","agosto",
        "settembre","ottobre","novembre","dicembre"]
RE_MESE = re.compile(r"\b(" + "|".join(MESI) + r")\b", re.I)
RE_DATA = re.compile(r"\b(\d{1,2})\s+(" + "|".join(MESI) + r")\b", re.I)

# ── markdown in linea → html ────────────────────────────────────────────────
def inline(t):
    t = html.escape(t, quote=False)
    t = re.sub(r"`([^`]+)`", r"<code>\1</code>", t)
    t = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", t)
    t = re.sub(r"(?<![\w*])\*(?!\s)(.+?)(?<!\s)\*(?![\w*])", r"<i>\1</i>", t)
    return t

def pulisci(riga):
    """toglie i segni di lista e di citazione in testa alla riga"""
    r = riga.strip()
    r = re.sub(r"^(?:>\s*)+", "", r)
    r = re.sub(r"^(?:[-*·•]\s+)+", "", r)
    r = re.sub(r"^\d+[.)]\s+", "", r)
    return r.strip()

def classe(r):
    """blocco · citata · marcata · None"""
    nudo = re.sub(r"^[\s*_~]+", "", r)          # via grassetti e corsivi aperti in testa
    nudo = re.sub(r"^(?:[\U0001F300-\U0001FAFF☀-➿⭐⛔✅❌⬆⚙️•·\s]+)", "", nudo)
    if nudo.startswith("«"):
        return "blocco"
    if "«" in r:
        return "citata"
    if re.search(r"\bGab\b\s*[:(]|\(Gab\)|Parole di Gab|\bda Gab\b|\bdi Gab\b", r):
        return "marcata"
    return None

# ── leggere il Cruscotto ────────────────────────────────────────────────────
def leggi(percorso):
    righe = open(percorso, encoding="utf-8").read().split("\n")
    argomenti = []           # in ordine di apparizione
    corrente = None
    elemento_sopra = []      # pila (livello, elemento) dei titoli di elemento
    in_codice = False
    for n, riga in enumerate(righe, 1):
        if riga.strip().startswith("```"):
            in_codice = not in_codice
            continue
        if in_codice:
            continue
        m = re.match(r"^(#{1,4})\s+(.*)$", riga)
        if m:
            liv, tit = len(m.group(1)), m.group(2).strip()
            # è un titolo di elemento?
            el = None
            for k, rx in TITOLO_ELEMENTO.items():
                if re.match(r"^\s*" + rx, tit):
                    el = k
            while elemento_sopra and elemento_sopra[-1][0] >= liv:
                elemento_sopra.pop()
            if el:
                elemento_sopra.append((liv, el))
            eredita = elemento_sopra[-1][1] if elemento_sopra else None
            corrente = {"titolo": tit, "riga": n, "livello": liv, "eredita": eredita,
                        "frasi": [], "testo": [tit]}
            argomenti.append(corrente)
            continue
        if corrente is None or not riga.strip():
            continue
        corrente["testo"].append(riga)
        r = pulisci(riga)
        c = classe(r)
        if c:
            corrente["frasi"].append({"c": c, "riga": n, "testo": r})
    return [a for a in argomenti if a["frasi"]]

def elemento_di(a):
    if a["eredita"]:
        return a["eredita"]
    corpo = "\n".join(a["testo"]).lower()
    tit = a["titolo"].lower()
    punti = {}
    for k, _, _, _, regole in ELEMENTI:
        p = 0
        for rx, peso in regole:
            p += 3 * peso * len(re.findall(rx, tit)) + peso * min(len(re.findall(rx, corpo)), 6)
        punti[k] = p
    migliore = max(punti, key=lambda k: punti[k])
    return migliore if punti[migliore] > 0 else "nexus"

def mesi_di(a):
    trovati = []
    for m in RE_MESE.findall(" ".join(a["testo"])):
        m = m.lower()
        if m not in trovati:
            trovati.append(m)
    return trovati

def data_di(a):
    m = RE_DATA.search(a["titolo"])
    return (m.group(1) + " " + m.group(2).lower()) if m else "—"

# ── scrivere la pagina ──────────────────────────────────────────────────────
CSS = r"""
:root{--fondo:#0A0C1A;--ivory:#F5F0E6;--oro:#C8A055;--oro-ch:#D4AF6A;
 --terra:#AA8844;--acqua:#4488BB;--fuoco:#CC6644;--aria:#669944;
 --etere:#9966CC;--nexus:#8C2F39}
*{box-sizing:border-box;margin:0;padding:0}
body{background:var(--fondo);color:var(--ivory);
 font-family:'DM Sans',system-ui,sans-serif;font-size:17px;line-height:1.6;
 padding:1.6rem 1rem 5rem;-webkit-text-size-adjust:100%}
body::before{content:'';position:fixed;inset:0;z-index:-1;pointer-events:none;
 background:radial-gradient(ellipse at 22% 10%,rgba(38,64,120,.42),transparent 58%),
 radial-gradient(ellipse at 84% 84%,rgba(60,44,110,.34),transparent 60%)}
.f{max-width:54rem;margin:0 auto}
.occ{font-family:'Cinzel',serif;font-size:.72rem;letter-spacing:.32em;
 text-transform:uppercase;color:var(--oro);margin-bottom:.5rem}
h1{font-family:'Cormorant Garamond',serif;font-weight:300;font-size:2.4rem;
 line-height:1.1;margin-bottom:.4rem}
.sot{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1.25rem;
 color:rgba(245,240,230,.8);margin-bottom:1.2rem}
.avviso{border:1px solid rgba(200,160,85,.35);border-radius:10px;padding:.8rem 1rem;
 font-size:.92rem;color:rgba(245,240,230,.85);margin-bottom:1.6rem;
 background:rgba(200,160,85,.06)}
.avviso b{color:var(--oro-ch)}
.sett{border:1px solid rgba(245,240,230,.14);border-radius:14px;padding:1.1rem 1.2rem;
 margin-bottom:1.4rem;background:rgba(245,240,230,.035)}
.sett .capo{display:flex;align-items:center;gap:.8rem;margin-bottom:.7rem}
.sett .cerchio{width:2.4rem;height:2.4rem;border-radius:50%;border:1px solid var(--oro);
 display:grid;place-items:center;font-family:'Cinzel',serif;color:var(--oro);
 font-size:.95rem;flex:none}
.sett .tx b{display:block;font-family:'Cormorant Garamond',serif;font-size:1.35rem;
 font-weight:400}
.sett .tx span{font-size:.85rem;color:rgba(245,240,230,.65)}
.sett .ap{margin-bottom:.8rem}
.sett .el{padding:.55rem 0;border-top:1px solid rgba(245,240,230,.1)}
.sett .el>b{display:block;font-family:'Cinzel',serif;font-size:.72rem;
 letter-spacing:.16em;color:var(--oro-ch);margin-bottom:.25rem}
.sett .el p{font-size:.97rem}
.plancia{position:sticky;top:0;z-index:5;display:flex;flex-wrap:wrap;gap:.4rem;
 align-items:center;padding:.7rem 0;margin:0 0 1rem;
 background:linear-gradient(var(--fondo) 85%,transparent)}
.plancia .t,.plancia .m{font-family:'Cinzel',serif;font-size:.66rem;letter-spacing:.14em;
 padding:.42rem .7rem;border:1px solid rgba(245,240,230,.22);border-radius:999px;
 background:transparent;color:rgba(245,240,230,.75);cursor:pointer}
.plancia .t.on{border-color:var(--oro);color:var(--oro)}
.plancia .m{text-transform:none;letter-spacing:.05em;font-family:'DM Sans',sans-serif;
 font-size:.8rem}
.plancia .m.on{border-color:var(--oro-ch);color:var(--oro-ch);background:rgba(200,160,85,.12)}
.plancia input{flex:1;min-width:9rem;padding:.45rem .8rem;border-radius:999px;
 border:1px solid rgba(245,240,230,.22);background:rgba(245,240,230,.06);
 color:var(--ivory);font:inherit;font-size:.9rem}
.plancia .conto{font-size:.8rem;color:rgba(245,240,230,.55);margin-left:auto}
.ele{margin:0 0 1.8rem}
.ele>.capo{display:flex;flex-wrap:wrap;align-items:baseline;gap:.6rem;
 padding:.5rem 0 .6rem;border-bottom:2px solid var(--c);margin-bottom:.7rem}
.ele>.capo b{font-family:'Cinzel',serif;letter-spacing:.14em;font-size:.9rem;color:var(--c)}
.ele>.capo span{font-size:.9rem;color:rgba(245,240,230,.7)}
.ele>.capo em{margin-left:auto;font-style:normal;font-size:.78rem;color:rgba(245,240,230,.5)}
.arg{border-left:2px solid var(--c);margin:0 0 .5rem;border-radius:0 8px 8px 0;
 background:rgba(245,240,230,.03)}
.arg>.testa{display:flex;align-items:baseline;gap:.6rem;padding:.55rem .8rem;cursor:pointer}
.arg>.testa b{font-weight:500;font-size:.98rem}
.arg>.testa i{font-style:normal;font-size:.78rem;color:rgba(245,240,230,.5);white-space:nowrap}
.arg>.testa em{margin-left:auto;font-style:normal;color:var(--oro);transition:transform .2s}
.arg.on>.testa em{transform:rotate(90deg)}
.arg>.dentro{display:none;padding:.2rem .8rem .7rem}
.arg.on>.dentro{display:block}
.fr{padding:.5rem 0;border-top:1px solid rgba(245,240,230,.08)}
.fr .meta{display:flex;gap:.6rem;font-size:.72rem;letter-spacing:.08em;
 color:rgba(245,240,230,.45);margin-bottom:.15rem}
.fr .meta .c{color:var(--oro-ch);text-transform:uppercase}
.fr p{font-size:.95rem}
.fr code{font-size:.85em;background:rgba(245,240,230,.08);padding:.05em .3em;border-radius:4px}
@media (max-width:600px){body{font-size:16px;padding:1.2rem .8rem 4rem}h1{font-size:2rem}}
"""

JS = r"""(function(){"use strict";
document.querySelectorAll(".arg>.testa").forEach(function(t){
 t.addEventListener("click",function(){t.parentNode.classList.toggle("on");});});
var b=document.querySelectorAll(".t"),e=document.querySelectorAll(".ele"),
 cerca=document.getElementById("cerca"),conto=document.getElementById("conto");
function conta(){var n=0;
 document.querySelectorAll(".arg").forEach(function(a){
  if(a.style.display!=="none"&&a.closest(".ele").style.display!=="none")
   n+=a.querySelectorAll(".fr").length;});
 conto.textContent=n+" frasi";}
b.forEach(function(x){x.addEventListener("click",function(){
 b.forEach(function(y){y.classList.remove("on");});x.classList.add("on");
 var q=x.dataset.e;e.forEach(function(y){
  y.style.display=(q==="tutti"||y.dataset.ele===q)?"":"none";});conta();});});
document.querySelectorAll(".plancia .m").forEach(function(x){
 x.addEventListener("click",function(){
  x.classList.toggle("on");
  var vivi=[].slice.call(document.querySelectorAll(".plancia .m.on"))
    .map(function(y){return y.dataset.m;});
  document.querySelectorAll(".arg").forEach(function(a){
   if(!vivi.length){a.style.display="";return;}
   var mm=(a.dataset.mesi||"").split(" ");
   a.style.display=vivi.some(function(v){return mm.indexOf(v)>=0;})?"":"none";});
  e.forEach(function(y){
   var n=y.querySelectorAll('.arg:not([style*="none"])').length;
   if(vivi.length)y.style.display=n?"":"none";});
  conta();});});
var attesa;
cerca.addEventListener("input",function(){
 clearTimeout(attesa);
 attesa=setTimeout(function(){
  var q=cerca.value.trim().toLowerCase();
  document.querySelectorAll(".arg").forEach(function(a){
   if(!q){a.style.display="";a.classList.remove("on");return;}
   var v=a.textContent.toLowerCase().indexOf(q)>=0;
   a.style.display=v?"":"none";
   if(v)a.classList.add("on");});
  e.forEach(function(y){
   if(y.style.display==="none"&&!q)return;
   var vive=y.querySelectorAll('.arg:not([style*="none"])').length;
   if(q)y.style.display=vive?"":"none";});
  conta();},220);});
conta();})();"""

def pagina(argomenti, settimane, titolo):
    per = collections.OrderedDict((k, []) for k, *_ in ELEMENTI)
    for a in argomenti:
        per[elemento_di(a)].append(a)
    mesi_tutti = []
    for a in argomenti:
        for m in mesi_di(a):
            if m not in mesi_tutti:
                mesi_tutti.append(m)
    mesi_tutti.sort(key=lambda m: MESI.index(m))
    tot = sum(len(a["frasi"]) for a in argomenti)

    o = []
    o.append("<!doctype html>\n<html lang=\"it\"><head><meta charset=\"utf-8\">\n"
             "<meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">\n"
             "<title>" + html.escape(titolo) + "</title>\n"
             "<link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">\n"
             "<link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>\n"
             "<link rel=\"stylesheet\" href=\"https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,400&family=DM+Sans:wght@400;500&display=swap\">\n"
             "<style>" + CSS + "</style></head>\n<body><div class=\"f\">\n")
    o.append("<div class=\"occ\">Comunità Eterna FelicitasMundi &middot; il nucleo</div>\n<h1>Il ragionamento</h1>\n")
    o.append("<p class=\"sot\">Tutte le frasi di Gab estratte dal Cruscotto, raccolte per argomento dentro il loro elemento. Serve a vedere quali ragionamenti hanno portato a quali scelte.</p>\n")
    o.append("<div class=\"avviso\"><b>Da dove vengono.</b> <b>blocco</b> è un dettato riportato per intero &middot; <b>citata</b> è una frase fra virgolette dentro una decisione &middot; <b>marcata</b> è una riga segnata come sua. ⛔ Non c’è nessuna sintesi: quello che si legge è quello che è scritto nel Cruscotto. "
             "<b>" + str(tot) + " frasi</b> in <b>" + str(len(argomenti)) + " argomenti</b>, rigenerato da <code>ragionamento.py</code>.</div>\n")
    o.append(settimane.strip() + "\n")
    # plancia
    o.append("<div class=\"plancia\"><button class=\"t on\" data-e=\"tutti\">tutti</button>")
    for k, et, *_ in ELEMENTI:
        o.append("<button class=\"t\" data-e=\"" + k + "\">" + et + "</button>")
    for m in mesi_tutti:
        o.append("<button class=\"m\" data-m=\"" + m + "\">" + m + "</button>")
    o.append("<input type=\"search\" id=\"cerca\" placeholder=\"cerca una parola\" aria-label=\"cerca\"><span class=\"conto\" id=\"conto\"></span></div>\n")
    # elementi
    for k, et, col, sotto, _ in ELEMENTI:
        lst = per[k]
        nf = sum(len(a["frasi"]) for a in lst)
        o.append("<div class=\"ele\" data-ele=\"" + k + "\" style=\"--c:" + col + "\">\n")
        o.append("<div class=\"capo\"><b>" + et + "</b><span>" + html.escape(sotto) + "</span><em>" +
                 str(nf) + " frasi &middot; " + str(len(lst)) + " argomenti</em></div>\n")
        for a in lst:
            o.append("<div class=\"arg\" data-mesi=\"" + " ".join(mesi_di(a)) + "\"><div class=\"testa\"><b>" +
                     inline(a["titolo"]) + "</b><i>" + html.escape(data_di(a)) + " &middot; " + str(len(a["frasi"])) +
                     "</i><em>&rsaquo;</em></div><div class=\"dentro\">\n")
            for f in a["frasi"]:
                o.append("<div class=\"fr\"><div class=\"meta\"><span class=\"c\">" + f["c"] + "</span><span>riga " +
                         str(f["riga"]) + "</span></div><p>" + inline(f["testo"]) + "</p></div>\n")
            o.append("</div></div>\n")
        o.append("</div>\n")
    o.append("</div>\n<script>" + JS + "</script></body></html>\n")
    return "".join(o)

def main():
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    cruscotto, settimane = sys.argv[1], sys.argv[2]
    titolo = sys.argv[3] if len(sys.argv) > 3 else "Il ragionamento · Comunità Eterna FelicitasMundi"
    argomenti = leggi(cruscotto)
    frag = open(settimane, encoding="utf-8").read()
    sys.stdout.write(pagina(argomenti, frag, titolo))
    per = collections.Counter(elemento_di(a) for a in argomenti)
    cls = collections.Counter(f["c"] for a in argomenti for f in a["frasi"])
    sys.stderr.write("argomenti: %d · frasi: %s · per elemento: %s\n" % (len(argomenti), dict(cls), dict(per)))

if __name__ == "__main__":
    main()
