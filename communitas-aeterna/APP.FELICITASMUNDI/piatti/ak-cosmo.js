/* <ak-cosmo> — sfondo: cosmo di nodi collegati come una rete neuronale, con impulsi di luce che viaggiano lungo i collegamenti. */
(function () {
  class AkCosmo extends HTMLElement {
    connectedCallback() {
      if (this.cv) return;
      this.style.cssText += ';position:absolute;inset:0;overflow:hidden;pointer-events:none;display:block';
      this.cv = document.createElement('canvas');
      this.cv.style.cssText = 'position:absolute;inset:0;width:100%;height:100%';
      this.appendChild(this.cv);
      this.g = this.cv.getContext('2d');
      this.fermo = matchMedia('(prefers-reduced-motion: reduce)').matches;
      this.t = 0;
      this.mis();
      this.ro = new ResizeObserver(() => this.mis());
      this.ro.observe(this);
      const loop = () => { if (!this.isConnected) return; this.dis(); if (!this.fermo) requestAnimationFrame(loop); };
      loop();
    }
    disconnectedCallback() { if (this.ro) this.ro.disconnect(); }

    mis() {
      const r = this.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 1.5);
      const w = Math.max(1, Math.round(r.width)), h = Math.max(1, Math.round(r.height));
      if (w === this.W && h === this.H) return;
      this.W = w; this.H = h;
      this.cv.width = w * d; this.cv.height = h * d;
      this.g.setTransform(d, 0, 0, d, 0, 0);
      this.semina();
    }

    semina() {
      const W = this.W, H = this.H, vivo = this.hasAttribute('vivo'), n = Math.round(Math.min(vivo ? 260 : 150, (W * H) / (vivo ? 6500 : 11000)));
      const rnd = (a, b) => a + Math.random() * (b - a);
      this.nodi = [];
      for (let i = 0; i < n; i++) this.nodi.push({
        x: rnd(0, W), y: rnd(0, H), z: rnd(.35, 1),
        vx: rnd(-.05, .05), vy: rnd(-.05, .05),
        f: rnd(0, 6.28), r: rnd(.8, 2.2) * (vivo ? 1.5 : 1)
      });
      // collegamenti ai 2-3 vicini più prossimi
      const L = Math.min(W, H) * (vivo ? .3 : .22);
      this.archi = [];
      const visti = new Set();
      this.nodi.forEach((a, i) => {
        const v = this.nodi.map((b, j) => ({ j, d: Math.hypot(a.x - b.x, a.y - b.y) }))
          .filter(o => o.j !== i && o.d < L).sort((p, q) => p.d - q.d).slice(0, vivo ? 4 : 3);
        v.forEach(o => { const k = i < o.j ? i + '-' + o.j : o.j + '-' + i; if (!visti.has(k)) { visti.add(k); this.archi.push([i, o.j]); } });
      });
      this.impulsi = [];
    }

    dis() {
      const g = this.g, W = this.W, H = this.H, N = this.nodi, A = this.archi;
      this.t++;
      g.clearRect(0, 0, W, H);
      // la quiete: solo dove c'è l'attributo vivo (la soglia di Antahkarana) il cosmo entra acceso (~6 s) e in ~8 s si assesta;
      // altrove è soffuso da subito. q: 1 = vivo, 0 = quieto
      if (this.t0 === undefined) this.t0 = performance.now();
      const el = (performance.now() - this.t0) / 1000;
      const q = (this.fermo || !this.hasAttribute('vivo')) ? 0 : Math.max(0, Math.min(1, 1 - (el - 10) / 10));
      const e = q * q * (3 - 2 * q);
      const mot = .1 + .9 * e, dim = .45 + 1.3 * e;

      // moto lento dei nodi
      N.forEach(p => {
        p.x += p.vx * p.z * mot; p.y += p.vy * p.z * mot;
        if (p.x < -20) p.x = W + 20; if (p.x > W + 20) p.x = -20;
        if (p.y < -20) p.y = H + 20; if (p.y > H + 20) p.y = -20;
      });

      // nuovi impulsi
      if (!this.fermo && Math.random() < (.003 + .12 * e) && this.impulsi.length < (1 + 21 * e)) {
        const a = A[Math.floor(Math.random() * A.length)];
        if (a) this.impulsi.push({ a, s: 0, v: (.006 + Math.random() * .008) * (.25 + .75 * e), viola: Math.random() < .35 });
      }

      // archi
      g.lineWidth = .7 + .6 * e;
      A.forEach(([i, j]) => {
        const a = N[i], b = N[j], z = (a.z + b.z) / 2;
        g.strokeStyle = 'rgba(160,140,220,' + Math.min(1, (.05 + z * .08) * dim * (1 + e)).toFixed(3) + ')';
        g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke();
      });

      // impulsi con scia
      this.impulsi = this.impulsi.filter(im => im.s <= 1.15);
      this.impulsi.forEach(im => {
        im.s += im.v;
        const a = N[im.a[0]], b = N[im.a[1]], s = Math.min(1, im.s);
        const x = a.x + (b.x - a.x) * s, y = a.y + (b.y - a.y) * s;
        const s0 = Math.max(0, s - .22), x0 = a.x + (b.x - a.x) * s0, y0 = a.y + (b.y - a.y) * s0;
        const col = im.viola ? '163,112,214' : '212,175,106';
        const gr = g.createLinearGradient(x0, y0, x, y);
        gr.addColorStop(0, 'rgba(' + col + ',0)'); gr.addColorStop(1, 'rgba(' + col + ',' + Math.min(1, .9 * dim).toFixed(3) + ')');
        g.strokeStyle = gr; g.lineWidth = 1.4 + e;
        g.beginPath(); g.moveTo(x0, y0); g.lineTo(x, y); g.stroke();
        const rg = g.createRadialGradient(x, y, 0, x, y, 9);
        rg.addColorStop(0, 'rgba(' + col + ',' + Math.min(1, .95 * dim).toFixed(3) + ')'); rg.addColorStop(.35, 'rgba(' + col + ',' + Math.min(1, .35 * dim).toFixed(3) + ')'); rg.addColorStop(1, 'rgba(' + col + ',0)');
        g.fillStyle = rg; g.beginPath(); g.arc(x, y, 9, 0, 6.2832); g.fill();
        // il nodo di arrivo si accende
        if (s > .92) b.acc = Math.min(1, dim);
      });

      // nodi
      N.forEach(p => {
        p.f += .02 * (.2 + .8 * e);
        const puls = .55 + (.1 + .35 * e) * Math.sin(p.f);
        const acc = p.acc || 0; if (acc > 0) p.acc = acc - .012;
        const al = ((.25 + .45 * puls) * p.z + acc * .5) * dim;
        const r = p.r * p.z + acc * 3;
        if (acc > 0) {
          const rg = g.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 5);
          rg.addColorStop(0, 'rgba(212,175,106,' + (acc * .55).toFixed(3) + ')'); rg.addColorStop(1, 'rgba(212,175,106,0)');
          g.fillStyle = rg; g.beginPath(); g.arc(p.x, p.y, r * 5, 0, 6.2832); g.fill();
        }
        g.fillStyle = 'rgba(232,224,250,' + Math.min(1, al).toFixed(3) + ')';
        g.beginPath(); g.arc(p.x, p.y, r, 0, 6.2832); g.fill();
      });
    }
  }
  if (!customElements.get('ak-cosmo')) customElements.define('ak-cosmo', AkCosmo);
})();
