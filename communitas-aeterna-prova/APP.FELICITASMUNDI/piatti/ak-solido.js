/* <ak-solido> — un solido platonico in filo di luce che ruota sopra il cubo di Metatron,
   come se la figura 3D nascesse dal reticolo. Attributi: tipo (cubo|tetraedro|ottaedro|
   icosaedro|dodecaedro), colore (#hex). Fermo con prefers-reduced-motion. */
(function () {
  const PHI = (1 + Math.sqrt(5)) / 2;
  function solidi() {
    const cubo = { v: [[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]],
      e: [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]],
      f: [[0,1,2,3],[4,5,6,7],[0,1,5,4],[1,2,6,5],[2,3,7,6],[3,0,4,7]] };
    const tetra = { v: [[1,1,1],[1,-1,-1],[-1,1,-1],[-1,-1,1]], e: [[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]] };
    const otta = { v: [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]],
      e: [[0,2],[0,3],[0,4],[0,5],[1,2],[1,3],[1,4],[1,5],[2,4],[2,5],[3,4],[3,5]] };
    const ico = { v: [], e: [] };
    [[0,1,PHI],[0,-1,PHI],[0,1,-PHI],[0,-1,-PHI],[1,PHI,0],[-1,PHI,0],[1,-PHI,0],[-1,-PHI,0],[PHI,0,1],[-PHI,0,1],[PHI,0,-1],[-PHI,0,-1]].forEach(p => ico.v.push(p));
    const dode = { v: [], e: [] };
    [[1,1,1],[1,1,-1],[1,-1,1],[1,-1,-1],[-1,1,1],[-1,1,-1],[-1,-1,1],[-1,-1,-1]].forEach(p => dode.v.push(p));
    [[0,PHI,1/PHI],[0,PHI,-1/PHI],[0,-PHI,1/PHI],[0,-PHI,-1/PHI],[1/PHI,0,PHI],[-1/PHI,0,PHI],[1/PHI,0,-PHI],[-1/PHI,0,-PHI],[PHI,1/PHI,0],[PHI,-1/PHI,0],[-PHI,1/PHI,0],[-PHI,-1/PHI,0]].forEach(p => dode.v.push(p));
    // spigoli = coppie alla distanza minima
    [ico, dode].forEach(s => {
      let min = Infinity; const d = (a, b) => Math.hypot(a[0]-b[0], a[1]-b[1], a[2]-b[2]);
      for (let i = 0; i < s.v.length; i++) for (let j = i + 1; j < s.v.length; j++) min = Math.min(min, d(s.v[i], s.v[j]));
      for (let i = 0; i < s.v.length; i++) for (let j = i + 1; j < s.v.length; j++) if (Math.abs(d(s.v[i], s.v[j]) - min) < 1e-6) s.e.push([i, j]);
    });
    // normalizza al raggio 1
    [cubo, tetra, otta, ico, dode].forEach(s => { const r = Math.hypot(...s.v[0]); s.v = s.v.map(p => p.map(x => x / r)); });
    return { cubo, tetraedro: tetra, ottaedro: otta, icosaedro: ico, dodecaedro: dode };
  }
  const S = solidi();
  class AkSolido extends HTMLElement {
    connectedCallback() {
      if (this.cv) return;
      const sh = this.attachShadow({ mode: 'open' });
      sh.innerHTML = '<style>:host{display:block;position:absolute;inset:0;pointer-events:none}canvas{width:100%;height:100%;display:block}</style>';
      this.cv = document.createElement('canvas'); sh.appendChild(this.cv);
      this.ctx = this.cv.getContext('2d'); this.t = 0;
      this.fermo = matchMedia('(prefers-reduced-motion: reduce)').matches;
      this.ro = new ResizeObserver(() => this.mis()); this.ro.observe(this);
      this.mis();
      const loop = () => { if (!this.isConnected) return; this.dis(); if (!this.fermo) requestAnimationFrame(loop); };
      loop();
    }
    disconnectedCallback() { if (this.ro) this.ro.disconnect(); }
    mis() {
      const d = Math.min(devicePixelRatio || 1, 2), r = this.getBoundingClientRect();
      this.W = Math.max(1, Math.round(r.width)); this.H = Math.max(1, Math.round(r.height));
      this.cv.width = this.W * d; this.cv.height = this.H * d; this.ctx.setTransform(d, 0, 0, d, 0, 0);
    }
    dis() {
      const g = this.ctx, W = this.W, H = this.H, s = S[this.getAttribute('tipo') || 'cubo'] || S.cubo;
      const col = this.getAttribute('colore') || '#AA8844';
      const n = parseInt(col.slice(1), 16), R = n >> 16, G = (n >> 8) & 255, B = n & 255;
      const rgba = a => `rgba(${R},${G},${B},${a})`;
      this.t += .006;
      // ⭐ la posa isometrica: vista lungo la diagonale, il cubo coincide col reticolo di Metatron
      //    (i 6 vertici esterni + il centro). Da lì si solleva e oscilla appena, restando ancorato.
      const oscilla = Math.sin(this.t) * .10, alza = (Math.sin(this.t * .5) + 1) / 2;   // 0..1: quanto è "nato"
      const ay = Math.PI / 4 + oscilla, ax = Math.atan(1 / Math.sqrt(2)) + oscilla * .5;
      const rc = Math.min(W, H) / 2 * (115 / 128);
      // raggio del cubo di Metatron (2·d su 128 → 92/128 del cerchio interno): il cubo isometrico ci entra esatto
      const scala = rc * (92 / 115) / Math.sqrt(8 / 9);   // i 6 vertici esterni cadono sui 6 centri esterni del reticolo
      const cy = Math.cos(ay), sy = Math.sin(ay), cx = Math.cos(ax), sx = Math.sin(ax);
      const prof = .04 + alza * .16;   // piatto quando è nel disegno, profondo quando si solleva
      const P = s.v.map(([x, y, z]) => {
        let X = x * cy + z * sy, Z = -x * sy + z * cy, Y = y;
        const Y2 = Y * cx - Z * sx, Z2 = Y * sx + Z * cx;
        const per = 1 / (1 + Z2 * prof);
        return [W / 2 + X * scala * per, H / 2 - Y2 * scala * per, Z2];
      });
      g.clearRect(0, 0, W, H);
      g.lineCap = 'round'; g.lineJoin = 'round';
      const dis = s.e.map(([a, b]) => ({ a: P[a], b: P[b], z: (P[a][2] + P[b][2]) / 2 })).sort((u, v) => u.z - v.z);
      if (s.f) s.f.forEach(fc => { const zs = fc.reduce((q, i) => q + P[i][2], 0) / fc.length; if (zs <= 0) return;
        g.fillStyle = rgba((.04 + zs * .08) * alza); g.beginPath(); fc.forEach((i, k) => k ? g.lineTo(P[i][0], P[i][1]) : g.moveTo(P[i][0], P[i][1])); g.closePath(); g.fill(); });
      dis.forEach(e => {
        const dav = e.z > 0, a = .35 + (e.z + 1) / 2 * .5 * (.4 + alza * .6);
        g.strokeStyle = rgba(a); g.lineWidth = dav ? 1.8 + alza * .6 : 1.1;
        g.shadowColor = rgba(dav ? .5 + alza * .4 : 0); g.shadowBlur = dav ? 6 + alza * 8 : 0;
        g.beginPath(); g.moveTo(e.a[0], e.a[1]); g.lineTo(e.b[0], e.b[1]); g.stroke();
      });
      g.shadowBlur = 0;
      P.forEach(p => { const a = .5 + (p[2] + 1) / 2 * .45; g.fillStyle = rgba(a); g.beginPath(); g.arc(p[0], p[1], 1.8 + (p[2] + 1) * .7, 0, 6.2832); g.fill(); });
    }
  }
  if (!customElements.get('ak-solido')) customElements.define('ak-solido', AkSolido);
})();
