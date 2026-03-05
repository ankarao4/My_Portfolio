/**
 * three-bg.js
 * Three.js animated cyber background for the hero section
 * Particles + rotating wireframe geometry + neon grid
 */

(function () {
  const canvas = document.getElementById('three-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  // ── Renderer ────────────────────────────────────────────────
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  // ── Scene & Camera ──────────────────────────────────────────
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
  camera.position.set(0, 0, 7);

  // ── Colours ─────────────────────────────────────────────────
  const C_BLUE   = new THREE.Color(0x00d4ff);
  const C_PURPLE = new THREE.Color(0xa855f7);
  const C_GREEN  = new THREE.Color(0x00ff88);

  // ── Particle System ─────────────────────────────────────────
  const PARTICLE_COUNT = 4000;
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const colors    = new Float32Array(PARTICLE_COUNT * 3);
  const palette   = [C_BLUE, C_PURPLE, C_GREEN];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 30;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
    const col = palette[Math.floor(Math.random() * palette.length)];
    colors[i * 3]     = col.r;
    colors[i * 3 + 1] = col.g;
    colors[i * 3 + 2] = col.b;
  }

  const pgeo = new THREE.BufferGeometry();
  pgeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  pgeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const pmat = new THREE.PointsMaterial({
    size: 0.04,
    sizeAttenuation: true,
    vertexColors: true,
    transparent: true,
    opacity: 0.7,
  });

  const particles = new THREE.Points(pgeo, pmat);
  scene.add(particles);

  // ── Wireframe Torus Knot ─────────────────────────────────────
  const tgeo = new THREE.TorusKnotGeometry(2.2, 0.55, 120, 18, 2, 3);
  const tmat = new THREE.MeshBasicMaterial({
    color: 0x00d4ff,
    wireframe: true,
    opacity: 0.18,
    transparent: true,
  });
  const torusKnot = new THREE.Mesh(tgeo, tmat);
  scene.add(torusKnot);

  // ── Outer Wireframe Sphere ────────────────────────────────────
  const sgeo = new THREE.IcosahedronGeometry(3.5, 1);
  const smat = new THREE.MeshBasicMaterial({
    color: 0xa855f7,
    wireframe: true,
    opacity: 0.08,
    transparent: true,
  });
  const sphere = new THREE.Mesh(sgeo, smat);
  scene.add(sphere);

  // ── Grid Plane ───────────────────────────────────────────────
  const gridHelper = new THREE.GridHelper(40, 40, 0x00d4ff, 0x00d4ff);
  gridHelper.material.opacity = 0.04;
  gridHelper.material.transparent = true;
  gridHelper.position.y = -6;
  scene.add(gridHelper);

  // ── Mouse parallax ───────────────────────────────────────────
  const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  window.addEventListener('mousemove', (e) => {
    mouse.targetX = (e.clientX / window.innerWidth  - 0.5) * 2;
    mouse.targetY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // ── Resize ───────────────────────────────────────────────────
  window.addEventListener('resize', () => {
    const w = window.innerWidth, h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });

  // ── Animation loop ───────────────────────────────────────────
  let clock = { t: 0 };
  let lastTime = performance.now();

  function animate(now) {
    requestAnimationFrame(animate);
    const delta = (now - lastTime) / 1000;
    lastTime = now;
    clock.t += delta;
    const t = clock.t;

    // Smooth mouse parallax
    mouse.x += (mouse.targetX - mouse.x) * 0.04;
    mouse.y += (mouse.targetY - mouse.y) * 0.04;

    // Torus knot rotation
    torusKnot.rotation.x = t * 0.15;
    torusKnot.rotation.y = t * 0.25;

    // Sphere slow rotation
    sphere.rotation.x = t * 0.05;
    sphere.rotation.y = t * 0.08;

    // Particle slow drift
    particles.rotation.y = t * 0.03;
    particles.rotation.x = t * 0.015;

    // Camera follows mouse gently
    camera.position.x += (mouse.x * 0.8 - camera.position.x) * 0.03;
    camera.position.y += (-mouse.y * 0.5 - camera.position.y) * 0.03;
    camera.lookAt(scene.position);

    // Pulse torus opacity
    tmat.opacity = 0.12 + Math.sin(t * 0.8) * 0.06;

    renderer.render(scene, camera);
  }

  animate(performance.now());
})();
