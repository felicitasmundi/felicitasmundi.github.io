/* <ak-nexus3d> — il Nexus vero, in 3D, che gira.
   ⭐ 30 settembre, Gab: «possiamo creare il solido nexus in movimento» — il modello è il suo,
      metatron-frame.glb (qui nexus.glb): cubo grafite, tetraedri vermiglio, ottaedro azzurro,
      nodi magenta e azzurri con gli anelli. I colori sono quelli del modello.
   Motore: three.js r160, tenuto qui accanto in ./tre/ (nessun servizio esterno).
   Attributi: src (il .glb, predefinito ./nexus.glb). Fermo con prefers-reduced-motion. */
import * as THREE from './tre/three.module.min.js';
import { GLTFLoader } from './tre/loaders/GLTFLoader.js';
import { RoomEnvironment } from './tre/environments/RoomEnvironment.js';

const QUI = new URL('.', import.meta.url);
const ASSE = new THREE.Vector3(1, 1, 0).normalize();
const BASE = new THREE.Quaternion().setFromEuler(new THREE.Euler(.5, .6, 0));

class AkNexus3d extends HTMLElement {
  connectedCallback() {
    if (this.r) return;
    const sh = this.attachShadow({ mode: 'open' });
    sh.innerHTML = '<style>:host{display:block;position:absolute;inset:0;pointer-events:none}canvas{width:100%;height:100%;display:block}</style>';
    const r = this.r = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    r.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
    r.outputColorSpace = THREE.SRGBColorSpace;
    r.toneMapping = THREE.ACESFilmicToneMapping; r.toneMappingExposure = 1.15;
    sh.appendChild(r.domElement);
    const sc = this.sc = new THREE.Scene();
    const pm = new THREE.PMREMGenerator(r);
    sc.environment = pm.fromScene(new RoomEnvironment(r), .04).texture;
    const cam = this.cam = new THREE.PerspectiveCamera(32, 1, .1, 20);
    cam.position.set(0, 0, 2.6);
    sc.add(new THREE.AmbientLight(0xfff4e0, .6));
    const k = new THREE.DirectionalLight(0xffffff, 1.4); k.position.set(2, 3, 4); sc.add(k);
    const o = new THREE.DirectionalLight(0xd4af6a, .9); o.position.set(-3, -1, -2); sc.add(o);   // un filo d'oro dietro
    this.g = new THREE.Group(); sc.add(this.g);
    this.fermo = matchMedia('(prefers-reduced-motion: reduce)').matches;
    new GLTFLoader().load(new URL(this.getAttribute('src') || 'nexus.glb', QUI).href, gl => {
      const m = gl.scene;
      const box = new THREE.Box3().setFromObject(m), c = box.getCenter(new THREE.Vector3()), s = box.getSize(new THREE.Vector3());
      m.position.sub(c); const f = 1 / Math.max(s.x, s.y, s.z); m.scale.setScalar(f); m.position.multiplyScalar(f);
      m.traverse(x => {
        if (!x.isMesh) return;
        const mt = x.material;
        // la grafite sul fondo notte sparirebbe: resta scura, ma con un velo di luce che la disegna
        if (mt.name === 'graphite') { mt.emissive = new THREE.Color(0x3a3f3c); mt.emissiveIntensity = .9; mt.metalness = .6; mt.roughness = .35; }
        else { mt.emissive = mt.color.clone(); mt.emissiveIntensity = .18; }
      });
      this.g.add(m);
    });
    this.ro = new ResizeObserver(() => this.mis()); this.ro.observe(this); this.mis();
    const t0 = performance.now();
    const loop = now => {
      if (!this.isConnected) return;
      const t = (now - t0) / 1000;
      // ⭐ 30 settembre, Gab: «un giro completo in diagonale» — ruota intero attorno alla diagonale
      //    dello schermo (dal basso a sinistra all'alto a destra): un giro ogni 15,6 secondi (17:43, Gab: «10% meno veloci»).
      if (!this.fermo) this.g.quaternion.setFromAxisAngle(ASSE, t * (Math.PI * 2 / 15.6)).multiply(BASE);
      r.render(sc, cam);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }
  mis() {
    const b = this.getBoundingClientRect(), w = Math.max(1, b.width), h = Math.max(1, b.height);
    this.r.setSize(w, h, false); this.cam.aspect = w / h; this.cam.updateProjectionMatrix();
  }
  disconnectedCallback() { if (this.ro) this.ro.disconnect(); }
}
if (!customElements.get('ak-nexus3d')) customElements.define('ak-nexus3d', AkNexus3d);
