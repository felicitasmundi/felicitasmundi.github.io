/* <ak-nexus3d> — il Nexus vero, in 3D, che gira.
   ⭐ 30 settembre, Gab: «possiamo creare il solido nexus in movimento» — il modello è il suo,
      metatron-frame.glb (qui nexus.glb): cubo grafite, tetraedri vermiglio, ottaedro azzurro,
      nodi magenta e azzurri con gli anelli. I colori sono quelli del modello.
   ⭐ 1 ottobre, Gab: «continuo a vedere che la pagina anthakarana rallenta» — ora:
      · si vede SUBITO un'immagine ferma del Nexus (nexus-fermo.webp, 34 KB), nella stessa posa
        in cui il 3D parte: quando il 3D è pronto prende il suo posto senza salti;
      · il motore 3D (three.js) si carica solo dopo che la pagina è ferma, non all'apertura;
      · mentre il dito scorre la pagina il 3D si ferma, e riparte da dove era quando ci si ferma;
      · meno pixel sul telefono.
   Motore: three.js r160, tenuto qui accanto in ./tre/ (nessun servizio esterno).
   Attributi: src (il .glb, predefinito ./nexus.glb). Fermo con prefers-reduced-motion. */

const QUI = new URL('.', import.meta.url);

class AkNexus3d extends HTMLElement {
  connectedCallback() {
    if (this.sh) return;
    const sh = this.sh = this.attachShadow({ mode: 'open' });
    sh.innerHTML =
      '<style>:host{display:block;position:absolute;inset:0;pointer-events:none}' +
      'img,canvas{position:absolute;inset:0;width:100%;height:100%;display:block}' +
      'img{object-fit:contain;transition:opacity .6s}canvas{opacity:0;transition:opacity .6s}' +
      ':host(.vivo) canvas{opacity:1}:host(.vivo) img{opacity:0}</style>' +
      '<img alt="" src="' + new URL('nexus-fermo.webp?v=10010900', QUI).href + '">';
    this.fermo = matchMedia('(prefers-reduced-motion: reduce)').matches;
    /* ⭐ 1 ottobre 10:29, Gab: «è sempre come se rimbalza e rimane fisso» (nell'app).
       Sul telefono il motore 3D tiene occupata la pagina mentre si prepara: lì il Nexus
       gira in un video già girato dal modello vero (stessa posa, stesso giro diagonale,
       15,6 s), che il telefono decodifica da sé senza fermare lo scorrimento. Il fondo nero
       del video sparisce sul fondo notte (mix-blend-mode: screen). Sul computer resta il 3D. */
    if (matchMedia('(pointer: coarse)').matches || this.hasAttribute('video')) {
      const img = sh.querySelector('img'); if (img) img.remove();
      const v = document.createElement('video');
      v.muted = true; v.loop = true; v.autoplay = !this.fermo; v.playsInline = true;
      v.setAttribute('muted', ''); v.setAttribute('playsinline', ''); v.setAttribute('preload', 'auto');
      v.poster = new URL('nexus-giro.jpg?v=10011035', QUI).href;
      v.src = new URL('nexus-giro.mp4?v=10011035', QUI).href;
      v.setAttribute('style', 'position:absolute;inset:0;width:100%;height:100%;object-fit:contain;mix-blend-mode:screen;pointer-events:none');
      sh.appendChild(v);
      if (!this.fermo) { const pp = v.play(); if (pp && pp.catch) pp.catch(() => {}); }
      return;
    }
    /* il 3D parte quando la pagina ha finito di caricarsi e il telefono respira */
    const via = () => { if (this.isConnected) this.accendi(); };
    const dopo = () => ('requestIdleCallback' in window) ? requestIdleCallback(via, { timeout: 2500 }) : setTimeout(via, 900);
    if (document.readyState === 'complete') setTimeout(dopo, 400); else addEventListener('load', () => setTimeout(dopo, 400), { once: true });
  }

  async accendi() {
    if (this.r) return;
    const [THREE, { GLTFLoader }, { RoomEnvironment }] = await Promise.all([
      import('./tre/three.module.min.js'),
      import('./tre/loaders/GLTFLoader.js'),
      import('./tre/environments/RoomEnvironment.js')
    ]);
    if (!this.isConnected) return;
    const ASSE = new THREE.Vector3(1, 1, 0).normalize();
    const BASE = new THREE.Quaternion().setFromEuler(new THREE.Euler(.5, .6, 0));
    const r = this.r = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
    r.setPixelRatio(Math.min(devicePixelRatio || 1, 1.25));   // ⭐ leggero sul telefono
    r.outputColorSpace = THREE.SRGBColorSpace;
    r.toneMapping = THREE.ACESFilmicToneMapping; r.toneMappingExposure = 1.15;
    this.sh.appendChild(r.domElement);
    const sc = new THREE.Scene();
    const pm = new THREE.PMREMGenerator(r);
    sc.environment = pm.fromScene(new RoomEnvironment(r), .04).texture;
    const cam = this.cam = new THREE.PerspectiveCamera(32, 1, .1, 20);
    cam.position.set(0, 0, 2.6);
    sc.add(new THREE.AmbientLight(0xfff4e0, .6));
    const k = new THREE.DirectionalLight(0xffffff, 1.4); k.position.set(2, 3, 4); sc.add(k);
    const o = new THREE.DirectionalLight(0xd4af6a, .9); o.position.set(-3, -1, -2); sc.add(o);   // un filo d'oro dietro
    const g = new THREE.Group(); sc.add(g);
    g.quaternion.copy(BASE);
    let pronto = false;
    new GLTFLoader().load(new URL(this.getAttribute('src') || 'nexus.glb?v=leggero', QUI).href, gl => {
      const m = gl.scene;
      m.updateMatrixWorld(true);   // il modello leggero porta le misure sui nodi: vanno contate prima
      const box = new THREE.Box3().setFromObject(m, true), c = box.getCenter(new THREE.Vector3()), s = box.getSize(new THREE.Vector3());
      m.position.sub(c); const f = 1 / Math.max(s.x, s.y, s.z); m.scale.setScalar(f); m.position.multiplyScalar(f);
      m.traverse(x => {
        if (!x.isMesh) return;
        const mt = x.material;
        // la grafite sul fondo notte sparirebbe: resta scura, ma con un velo di luce che la disegna
        if (mt.name === 'graphite') { mt.emissive = new THREE.Color(0x3a3f3c); mt.emissiveIntensity = .9; mt.metalness = .6; mt.roughness = .35; }
        else { mt.emissive = mt.color.clone(); mt.emissiveIntensity = .18; }
      });
      g.add(m);
      r.render(sc, cam);
      pronto = true;
      requestAnimationFrame(() => this.classList.add('vivo'));
    });
    this.ro = new ResizeObserver(() => this.mis()); this.ro.observe(this); this.mis();

    /* ⭐ mentre si scorre, il 3D si ferma: il dito ha la precedenza */
    let fermoFino = 0;
    const tocco = () => { fermoFino = performance.now() + 350; };
    const ascolta = w => { try {
      ['touchstart', 'touchmove', 'wheel'].forEach(e => w.addEventListener(e, tocco, { passive: true }));
      w.addEventListener('scroll', tocco, { passive: true, capture: true });
    } catch (e) {} };
    ascolta(window); try { if (window.parent !== window) ascolta(window.parent); } catch (e) {}

    let visibile = true, ultimo = 0, angolo = 0;
    if (window.IntersectionObserver) new IntersectionObserver(v => { visibile = v[0].isIntersecting; }).observe(this);
    const loop = now => {
      if (!this.isConnected) return;
      requestAnimationFrame(loop);
      if (!pronto || !visibile || document.hidden || now < fermoFino) { ultimo = now; return; }
      if (now - ultimo < 33) return;
      const dt = Math.min(.1, (now - ultimo) / 1000); ultimo = now;
      // ⭐ 30 settembre, Gab: «un giro completo in diagonale» — un giro ogni 15,6 secondi.
      //    L'angolo avanza solo mentre gira: dopo una pausa riparte da dov'era.
      if (!this.fermo) { angolo += dt * (Math.PI * 2 / 15.6); g.quaternion.setFromAxisAngle(ASSE, angolo).multiply(BASE); }
      r.render(sc, cam);
    };
    requestAnimationFrame(loop);
  }
  mis() {
    if (!this.r) return;
    const b = this.getBoundingClientRect(), w = Math.max(1, b.width), h = Math.max(1, b.height);
    this.r.setSize(w, h, false); this.cam.aspect = w / h; this.cam.updateProjectionMatrix();
  }
  disconnectedCallback() { if (this.ro) this.ro.disconnect(); }
}
if (!customElements.get('ak-nexus3d')) customElements.define('ak-nexus3d', AkNexus3d);
