/* ─────────────────────────────────────────────
   genai.hub // divergent99
   js/warp.js — hyperspeed Three.js background
────────────────────────────────────────────── */

(function () {
  const canvas = document.getElementById('warp');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x050508, 1);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
  camera.position.z = 1;

  // indigo / cyan / violet / white / orange
  const palette = [
    [0.39, 0.40, 0.95],
    [0.13, 0.83, 0.93],
    [0.65, 0.54, 0.98],
    [1.00, 1.00, 1.00],
    [0.97, 0.57, 0.24],
  ];

  /* ── STAR POINTS ── */
  const N   = 7000;
  const pos = new Float32Array(N * 3);
  const vel = new Float32Array(N);
  const col = new Float32Array(N * 3);

  for (let i = 0; i < N; i++) {
    pos[i * 3]     = (Math.random() - 0.5) * 2000;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 2000;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 2000;
    vel[i]         = 0.4 + Math.random() * 2.2;
    const c        = palette[Math.floor(Math.random() * palette.length)];
    col[i * 3] = c[0]; col[i * 3 + 1] = c[1]; col[i * 3 + 2] = c[2];
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color',    new THREE.BufferAttribute(col, 3));

  const mat = new THREE.PointsMaterial({
    size: 1.1,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    sizeAttenuation: true,
  });

  scene.add(new THREE.Points(geo, mat));

  /* ── STREAK LINES ── */
  const SN = 300;
  const sp = new Float32Array(SN * 6);
  const sc = new Float32Array(SN * 6);

  for (let i = 0; i < SN; i++) {
    const x   = (Math.random() - 0.5) * 900;
    const y   = (Math.random() - 0.5) * 900;
    const z   = (Math.random() - 0.5) * 1200 - 300;
    const len = 15 + Math.random() * 70;

    sp[i * 6]     = x; sp[i * 6 + 1] = y; sp[i * 6 + 2] = z;
    sp[i * 6 + 3] = x; sp[i * 6 + 4] = y; sp[i * 6 + 5] = z + len;

    const c = palette[Math.floor(Math.random() * palette.length)];
    sc[i * 6]     = c[0];       sc[i * 6 + 1] = c[1];       sc[i * 6 + 2] = c[2];
    sc[i * 6 + 3] = c[0] * .15; sc[i * 6 + 4] = c[1] * .15; sc[i * 6 + 5] = c[2] * .15;
  }

  const sgeo = new THREE.BufferGeometry();
  sgeo.setAttribute('position', new THREE.BufferAttribute(sp, 3));
  sgeo.setAttribute('color',    new THREE.BufferAttribute(sc, 3));

  scene.add(new THREE.LineSegments(sgeo, new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0.3,
  })));

  /* ── ANIMATE ── */
  let speed = 0;
  let targetSpeed = 8;

  window.addEventListener('scroll', () => {
    targetSpeed = 8 + window.scrollY * 0.0008;
  });

  (function animate() {
    requestAnimationFrame(animate);
    speed += (targetSpeed - speed) * 0.05;

    // move star points
    const pa = geo.attributes.position.array;
    for (let i = 0; i < N; i++) {
      pa[i * 3 + 2] += vel[i] * speed * 0.05;
      if (pa[i * 3 + 2] > 600) {
        pa[i * 3 + 2] = -1800;
        pa[i * 3]     = (Math.random() - 0.5) * 2000;
        pa[i * 3 + 1] = (Math.random() - 0.5) * 2000;
      }
    }
    geo.attributes.position.needsUpdate = true;

    // move streaks
    const sa = sgeo.attributes.position.array;
    for (let i = 0; i < SN; i++) {
      sa[i * 6 + 2] += speed * 0.18;
      sa[i * 6 + 5] += speed * 0.18;
      if (sa[i * 6 + 2] > 500) {
        const x   = (Math.random() - 0.5) * 900;
        const y   = (Math.random() - 0.5) * 900;
        const len = 15 + Math.random() * 70;
        sa[i * 6]     = x; sa[i * 6 + 1] = y; sa[i * 6 + 2] = -1400;
        sa[i * 6 + 3] = x; sa[i * 6 + 4] = y; sa[i * 6 + 5] = -1400 + len;
      }
    }
    sgeo.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
  })();

  /* ── RESIZE ── */
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();
