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
      if (this.getAttribute('tipo') === 'nexus') return this.nexus();
      const g = this.ctx, W = this.W, H = this.H, s = S[this.getAttribute('tipo') || 'cubo'] || S.cubo;
      const col = this.getAttribute('colore') || '#AA8844';
      const n = parseInt(col.slice(1), 16), R = n >> 16, G = (n >> 8) & 255, B = n & 255;
      const rgba = a => `rgba(${R},${G},${B},${a})`;
      this.t += .006;
      // ⭐ la posa isometrica: vista lungo la diagonale, il cubo coincide col reticolo di Metatron
      //    (i 6 vertici esterni + il centro). Da lì si solleva e oscilla appena, restando ancorato.
      // ⭐ 30 settembre, Gab: «il movimento diagonale di tutti i solidi» — dalla posa isometrica
      //    ogni solido fa un giro completo attorno alla diagonale dello schermo (dal basso a
      //    sinistra all'alto a destra), come il Nexus: un giro ogni 15,6 secondi (17:43, Gab: «10% meno veloci»).
      const alza = 1, th = this.t0 === undefined ? (this.t0 = performance.now(), 0) : (performance.now() - this.t0) / 1000 * (Math.PI * 2 / 15.6);
      const ct = Math.cos(th), st = Math.sin(th), k = Math.SQRT1_2;
      const ay = Math.PI / 4, ax = Math.atan(1 / Math.sqrt(2));
      const rc = Math.min(W, H) / 2 * (115 / 128);
      // raggio del cubo di Metatron (2·d su 128 → 92/128 del cerchio interno): il cubo isometrico ci entra esatto
      const scala = rc * (92 / 115) / Math.sqrt(8 / 9);   // i 6 vertici esterni cadono sui 6 centri esterni del reticolo
      const cy = Math.cos(ay), sy = Math.sin(ay), cx = Math.cos(ax), sx = Math.sin(ax);
      const prof = .16;
      const P = s.v.map(([x, y, z]) => {
        let X = x * cy + z * sy, Z = -x * sy + z * cy, Y = y;
        const Y1 = Y * cx - Z * sx, Z1 = Y * sx + Z * cx;
        // Rodrigues attorno a (k, k, 0)
        const kv = k * X + k * Y1;
        const X2 = X * ct + (k * Z1) * st + k * kv * (1 - ct);
        const Y2 = Y1 * ct + (-k * Z1) * st + k * kv * (1 - ct);
        const Z2 = Z1 * ct + (k * Y1 - k * X) * st;
        const per = 1 / (1 + Z2 * prof);
        return [W / 2 + X2 * scala * per, H / 2 - Y2 * scala * per, Z2];
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

    /* ⭐ 30 settembre, Gab: «possiamo creare il solido nexus in movimento».
       Preso da metatron-frame.obj (il modello del Nexus): il cubo (grafite), i due tetraedri
       intrecciati (vermiglio), l'ottaedro (azzurro), i nodi coi loro anelli — magenta sugli
       otto vertici, azzurro sulle sei facce e al centro. Colori dal .mtl. Ruota intero, lento. */
    nexus() {
      const g = this.ctx, W = this.W, H = this.H;
      this.t += .005;
      const C = { cubo: [245,240,230], rosso: [199,53,36], blu: [36,116,199], mag: [167,55,139] };
      const col = (c, a) => `rgba(${C[c][0]},${C[c][1]},${C[c][2]},${a})`;
      const ay = this.t, ax = .42 + Math.sin(this.t * .6) * .18, az = Math.sin(this.t * .4) * .08;
      const cy = Math.cos(ay), sy = Math.sin(ay), cx = Math.cos(ax), sx = Math.sin(ax), cz = Math.cos(az), sz = Math.sin(az);
      const sc = Math.min(W, H) * .78;
      const pr = ([x, y, z]) => {
        let X = x * cy + z * sy, Z = -x * sy + z * cy, Y = y;
        let Y2 = Y * cx - Z * sx, Z2 = Y * sx + Z * cx;
        let X3 = X * cz - Y2 * sz, Y3 = X * sz + Y2 * cz;
        const per = 1 / (1 + Z2 * .9);
        return [W / 2 + X3 * sc * per, H / 2 - Y3 * sc * per, Z2];
      };
      const h = .3, V = [];
      for (const x of [-h, h]) for (const y of [-h, h]) for (const z of [-h, h]) V.push([x, y, z]);
      const lin = [], nod = [];
      // il cubo: spigoli fra vertici che differiscono in una coordinata sola
      for (let i = 0; i < 8; i++) for (let j = i + 1; j < 8; j++) {
        const d = [0,1,2].filter(k => V[i][k] !== V[j][k]).length;
        if (d === 1) lin.push([V[i], V[j], 'cubo', 1.3]);
        if (d === 2) lin.push([V[i], V[j], 'rosso', 1.6]);          // le diagonali delle facce: i due tetraedri
      }
      const F = [[h,0,0],[-h,0,0],[0,h,0],[0,-h,0],[0,0,h],[0,0,-h]];
      for (let i = 0; i < 6; i++) for (let j = i + 1; j < 6; j++)
        if (F[i].some((v, k) => v !== 0 && F[j][k] === -v) === false) lin.push([F[i], F[j], 'blu', 1.2]);   // l'ottaedro
      V.forEach(v => nod.push([v, 'mag', v.map(x => Math.sign(x) / Math.sqrt(3)), .075, 5.5]));
      F.forEach(f => nod.push([f, 'blu', f.map(x => Math.sign(x)), .075, 4.5]));
      nod.push([[0,0,0], 'blu', [0,1,0], .085, 5]);
      const cose = [];
      lin.forEach(([a, b, c, w]) => { const A = pr(a), B = pr(b); cose.push({ z: (A[2] + B[2]) / 2, f: () => {
        g.strokeStyle = col(c, c === 'cubo' ? .55 : .85); g.lineWidth = w; g.shadowColor = col(c, .6); g.shadowBlur = 5;
        g.beginPath(); g.moveTo(A[0], A[1]); g.lineTo(B[0], B[1]); g.stroke(); } }); });
      nod.forEach(([p, c, n, r, pt]) => {
        // l'anello: un cerchio nel piano perpendicolare a n
        const u = Math.abs(n[1]) < .9 ? [0,1,0] : [1,0,0];
        let a = [n[1]*u[2]-n[2]*u[1], n[2]*u[0]-n[0]*u[2], n[0]*u[1]-n[1]*u[0]]; const la = Math.hypot(...a); a = a.map(x => x / la);
        const b = [n[1]*a[2]-n[2]*a[1], n[2]*a[0]-n[0]*a[2], n[0]*a[1]-n[1]*a[0]];
        const ring = []; for (let k = 0; k <= 40; k++) { const t = k / 40 * 6.2832;
          ring.push(pr([0,1,2].map(i => p[i] + r * (Math.cos(t) * a[i] + Math.sin(t) * b[i])))); }
        const P0 = pr(p);
        cose.push({ z: P0[2] + .01, f: () => {
          g.shadowColor = col(c, .7); g.shadowBlur = 8;
          g.strokeStyle = col(c, .9); g.lineWidth = 1.4; g.beginPath(); ring.forEach((q, k) => k ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1])); g.stroke();
          g.fillStyle = col(c, .95); g.beginPath(); g.arc(P0[0], P0[1], pt * (1 + P0[2] * .3), 0, 6.2832); g.fill(); } });
      });
      g.clearRect(0, 0, W, H); g.lineCap = 'round'; g.lineJoin = 'round';
      cose.sort((u, v) => u.z - v.z).forEach(o => { g.globalAlpha = .55 + (o.z + .5) * .45; o.f(); });
      g.globalAlpha = 1; g.shadowBlur = 0;
    }
  }
  if (!customElements.get('ak-solido')) customElements.define('ak-solido', AkSolido);
})();
