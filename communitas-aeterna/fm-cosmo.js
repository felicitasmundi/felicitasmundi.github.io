/* ═══════════════════════════════════════════════════════════════
   IL COSMO — la rete neuronale dello sfondo.

   ⛔ Numeri di Design, presi alla lettera: nodi = area/11000 (max
      150), raggio .8–2.2, profondità z .35–1, deriva ±.05 px per
      fotogramma per z, tre vicini entro il 22% del lato minore,
      archi lilla 160,140,220 fra .05 e .13, impulsi nuovi al 7%
      per fotogramma fino a 14, velocità .006–.014, 65% oro
      212,175,106 e 35% viola 163,112,214, il nodo d'arrivo si
      accende e si spegne in 80 fotogrammi, i nodi respirano in
      avorio-lilla 232,224,250.

   Si registra da sé come <ak-cosmo>: basta metterlo in un
   contenitore con position:relative.
   ═══════════════════════════════════════════════════════════════ */

(function () {
  "use strict";
  if (window.customElements && customElements.get("ak-cosmo")) return;

  var FERMO = window.matchMedia &&
    matchMedia("(prefers-reduced-motion: reduce)").matches;

  function AkCosmo() {
    return Reflect.construct(HTMLElement, [], AkCosmo);
  }
  AkCosmo.prototype = Object.create(HTMLElement.prototype);
  AkCosmo.prototype.constructor = AkCosmo;
  Object.setPrototypeOf(AkCosmo, HTMLElement);

  AkCosmo.prototype.connectedCallback = function () {
    var host = this;
    if (host._su) return;
    host._su = 1;
    host.style.display = "block";
    host.style.pointerEvents = "none";

    var cv = document.createElement("canvas");
    cv.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block";
    host.appendChild(cv);
    var ct = cv.getContext("2d");

    var L = 0, A = 0, dpr = 1, nodi = [], impulsi = [], t = null;

    function misura() {
      var r = host.getBoundingClientRect();
      L = r.width || host.offsetWidth || 0;
      A = r.height || host.offsetHeight || 0;
      if (!L || !A) return false;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.round(L * dpr);
      cv.height = Math.round(A * dpr);
      ct.setTransform(dpr, 0, 0, dpr, 0, 0);
      return true;
    }

    function semina() {
      var quanti = Math.min(150, Math.round((L * A) / 11000));
      nodi = [];
      for (var i = 0; i < quanti; i++) {
        var z = 0.35 + Math.random() * 0.65;
        nodi.push({
          x: Math.random() * L, y: Math.random() * A, z: z,
          r: 0.8 + Math.random() * 1.4,
          vx: (Math.random() - 0.5) * 0.1 * z,
          vy: (Math.random() - 0.5) * 0.1 * z,
          f: Math.random() * Math.PI * 2,     /* il respiro */
          acc: 0, vicini: []
        });
      }
      var soglia = Math.min(L, A) * 0.22;
      nodi.forEach(function (n, i) {
        var d = [];
        nodi.forEach(function (m, j) {
          if (i === j) return;
          var dx = n.x - m.x, dy = n.y - m.y;
          var q = Math.sqrt(dx * dx + dy * dy);
          if (q < soglia) d.push({ j: j, q: q });
        });
        d.sort(function (a, b) { return a.q - b.q; });
        n.vicini = d.slice(0, 3).map(function (x) { return x.j; });
      });
      impulsi = [];
    }

    function passo() {
      nodi.forEach(function (n) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > L) { n.vx *= -1; n.x = Math.max(0, Math.min(L, n.x)); }
        if (n.y < 0 || n.y > A) { n.vy *= -1; n.y = Math.max(0, Math.min(A, n.y)); }
        n.f += 0.01;
        if (n.acc > 0) n.acc -= 1 / 80;
      });

      /* impulsi nuovi: 7% per fotogramma, non più di 14 insieme */
      if (impulsi.length < 14 && Math.random() < 0.07 && nodi.length > 1) {
        var i = (Math.random() * nodi.length) | 0;
        var vv = nodi[i].vicini;
        if (vv.length) {
          var oro = Math.random() < 0.65;
          impulsi.push({
            a: i, b: vv[(Math.random() * vv.length) | 0], p: 0,
            v: 0.006 + Math.random() * 0.008,
            c: oro ? "212,175,106" : "163,112,214"
          });
        }
      }
      impulsi = impulsi.filter(function (im) {
        im.p += im.v;
        if (im.p >= 1) { nodi[im.b].acc = 1; return false; }
        return true;
      });
    }

    function disegna() {
      ct.clearRect(0, 0, L, A);

      /* gli archi */
      ct.lineWidth = 0.6;
      nodi.forEach(function (n) {
        n.vicini.forEach(function (j) {
          var m = nodi[j];
          var op = 0.05 + ((n.z + m.z) / 2) * 0.08;
          ct.strokeStyle = "rgba(160,140,220," + op.toFixed(3) + ")";
          ct.beginPath(); ct.moveTo(n.x, n.y); ct.lineTo(m.x, m.y); ct.stroke();
        });
      });

      /* gli impulsi, colla scia */
      impulsi.forEach(function (im) {
        var a = nodi[im.a], b = nodi[im.b];
        var x = a.x + (b.x - a.x) * im.p, y = a.y + (b.y - a.y) * im.p;
        var q = Math.max(0, im.p - 0.22);
        var sx = a.x + (b.x - a.x) * q, sy = a.y + (b.y - a.y) * q;
        var g = ct.createLinearGradient(sx, sy, x, y);
        g.addColorStop(0, "rgba(" + im.c + ",0)");
        g.addColorStop(1, "rgba(" + im.c + ",.55)");
        ct.strokeStyle = g; ct.lineWidth = 1.1;
        ct.beginPath(); ct.moveTo(sx, sy); ct.lineTo(x, y); ct.stroke();

        var al = ct.createRadialGradient(x, y, 0, x, y, 5);
        al.addColorStop(0, "rgba(" + im.c + ",.5)");
        al.addColorStop(1, "rgba(" + im.c + ",0)");
        ct.fillStyle = al;
        ct.beginPath(); ct.arc(x, y, 5, 0, 6.284); ct.fill();
      });

      /* i nodi, che respirano */
      nodi.forEach(function (n) {
        var resp = 0.5 + 0.5 * Math.sin(n.f);
        var op = (0.18 + n.z * 0.3) * (0.7 + resp * 0.3) + n.acc * 0.45;
        var r = n.r * (1 + n.acc * 0.7);
        ct.fillStyle = "rgba(232,224,250," + Math.min(1, op).toFixed(3) + ")";
        ct.beginPath(); ct.arc(n.x, n.y, r, 0, 6.284); ct.fill();
        if (n.acc > 0) {
          var g2 = ct.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 5);
          g2.addColorStop(0, "rgba(212,175,106," + (n.acc * 0.32).toFixed(3) + ")");
          g2.addColorStop(1, "rgba(212,175,106,0)");
          ct.fillStyle = g2;
          ct.beginPath(); ct.arc(n.x, n.y, r * 5, 0, 6.284); ct.fill();
        }
      });
    }

    function giro() { passo(); disegna(); t = requestAnimationFrame(giro); }

    function avvia() {
      if (!misura()) { setTimeout(avvia, 60); return; }
      semina();
      if (t) cancelAnimationFrame(t);
      if (FERMO) disegna(); else giro();          /* \u26d4 fermo se richiesto */
    }
    avvia();

    var att;
    host._ro = new ResizeObserver(function () {
      clearTimeout(att); att = setTimeout(avvia, 180);
    });
    host._ro.observe(host);
    host._stop = function () { if (t) cancelAnimationFrame(t); };
  };

  AkCosmo.prototype.disconnectedCallback = function () {
    if (this._stop) this._stop();
    if (this._ro) this._ro.disconnect();
    this._su = 0;
  };

  customElements.define("ak-cosmo", AkCosmo);
})();
