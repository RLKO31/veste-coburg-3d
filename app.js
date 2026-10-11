import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';

// --- STATE MANAGEMENT ---
const state = {
  activeModelFile: 'Druckmodell.stl',
  currentShader: 'sandstone',
  wireframe: false,
  autoRotate: true,
  isLightTheme: false
};

// Shader / Material Presets
const SHADER_CONFIGS = {
  sandstone: {
    color: 0xd4a373,
    roughness: 0.85,
    metalness: 0.05,
    specular: 0x222222
  },
  clay: {
    color: 0xe2e8f0,
    roughness: 0.65,
    metalness: 0.1,
    specular: 0x333333
  },
  bronze: {
    color: 0xb45309,
    roughness: 0.45,
    metalness: 0.65,
    specular: 0xdd9944
  }
};

// --- THREE.JS GLOBALS ---
let scene, camera, renderer, controls;
let currentMesh = null;
let wireframeMesh = null;
let modelGroup = null;
let gridHelper = null;
let dirLight1, dirLight2, hemiLight, ambientLight;

// Cache loaded geometries to switch instantly between models
const geometryCache = new Map();

// --- INITIALIZATION ---
function init() {
  const container = document.getElementById('canvas-container');

  // 1. Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x070b14);
  scene.fog = new THREE.FogExp2(0x070b14, 0.0035);

  // 2. Camera (Perspective)
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000);
  camera.position.set(160, 110, 180);

  // 3. Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  container.appendChild(renderer.domElement);

  // 4. Orbit Controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.minDistance = 20;
  controls.maxDistance = 550;
  controls.maxPolarAngle = Math.PI / 2 - 0.02; // Prevent going beneath ground floor
  controls.autoRotate = state.autoRotate;
  controls.autoRotateSpeed = 0.8;
  controls.target.set(0, 0, 0);

  // 5. Lighting Setup
  setupLighting();

  // 6. Baseplate Grid and Pedestal Ring
  setupEnvironment();

  // 7. Group for Models
  modelGroup = new THREE.Group();
  scene.add(modelGroup);

  // 8. Event Listeners
  setupEventListeners();
  window.addEventListener('resize', onWindowResize);

  // 9. Load Initial 3D Model
  loadModel(state.activeModelFile);

  // 10. Start Animation Loop
  animate();
}

// --- LIGHTING ---
function setupLighting() {
  ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
  scene.add(ambientLight);

  hemiLight = new THREE.HemisphereLight(0x7dd3fc, 0x1e293b, 0.6);
  hemiLight.position.set(0, 200, 0);
  scene.add(hemiLight);

  // Sun Light (Key Light)
  dirLight1 = new THREE.DirectionalLight(0xfff7ed, 1.4);
  dirLight1.position.set(150, 220, 120);
  dirLight1.castShadow = true;
  dirLight1.shadow.mapSize.width = 2048;
  dirLight1.shadow.mapSize.height = 2048;
  dirLight1.shadow.camera.near = 10;
  dirLight1.shadow.camera.far = 600;
  dirLight1.shadow.camera.left = -150;
  dirLight1.shadow.camera.right = 150;
  dirLight1.shadow.camera.top = 150;
  dirLight1.shadow.camera.bottom = -150;
  dirLight1.shadow.bias = -0.0003;
  scene.add(dirLight1);

  // Fill Light (Cool sky bounce)
  dirLight2 = new THREE.DirectionalLight(0x38bdf8, 0.5);
  dirLight2.position.set(-140, 100, -120);
  scene.add(dirLight2);
}

// --- ENVIRONMENT & GROUND ---
function setupEnvironment() {
  // Ground Radial Grid
  gridHelper = new THREE.GridHelper(300, 30, 0x0284c7, 0x1e293b);
  gridHelper.position.y = -0.1;
  gridHelper.material.opacity = 0.35;
  gridHelper.material.transparent = true;
  scene.add(gridHelper);

  // Base circular contact shadow receiver
  const shadowGeo = new THREE.CircleGeometry(160, 64);
  shadowGeo.rotateX(-Math.PI / 2);
  const shadowMat = new THREE.ShadowMaterial({ opacity: 0.45 });
  const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
  shadowMesh.position.y = -0.05;
  shadowMesh.receiveShadow = true;
  scene.add(shadowMesh);
}

// --- MODEL LOADING & CENTERING ---
function loadModel(filename) {
  updateLoader(true, `Lade 3D-Modell (${filename})...`, 35);

  if (geometryCache.has(filename)) {
    applyGeometry(geometryCache.get(filename), filename);
    updateLoader(false);
    return;
  }

  const loader = new STLLoader();
  loader.load(
    filename,
    (geometry) => {
      updateLoader(true, 'Zentriere & skaliere Koordinaten...', 80);

      // 1. Compute bounds & normals
      geometry.computeVertexNormals();
      geometry.computeBoundingBox();

      const bbox = geometry.boundingBox;
      const size = new THREE.Vector3();
      bbox.getSize(size);
      const center = new THREE.Vector3();
      bbox.getCenter(center);

      // Model coordinates:
      // X = Ostwert (~500m span)
      // Y = Hochwert (~500m span)
      // Z = Geodätische Höhe (~140m span: 345m bis 485m)
      // Center XY to (0, 0) and place minimum Z on ground (Z=0)
      geometry.translate(-center.x, -center.y, -bbox.min.z);

      // STL in GIS export has Z as UP. In Three.js, Y is UP.
      // Rotate around X axis by -90° so Z becomes Y:
      geometry.rotateX(-Math.PI / 2);

      // Re-scale so 500m corresponds to a clean 100 units in 3D scene (1:5 factor)
      const scaleFactor = 100 / Math.max(size.x, size.y);
      geometry.scale(scaleFactor, scaleFactor, scaleFactor);

      geometry.computeBoundingBox();
      geometry.computeVertexNormals();

      // Store in memory cache
      geometryCache.set(filename, geometry);

      applyGeometry(geometry, filename);
      updateLoader(false);
    },
    (xhr) => {
      if (xhr.lengthComputable) {
        const percent = Math.round((xhr.loaded / xhr.total) * 75);
        updateLoader(true, `Herunterladen: ${percent}%`, percent);
      }
    },
    (err) => {
      console.error('Fehler beim Laden der STL:', err);
      updateLoader(true, 'Fehler beim Laden des Modells!', 100);
      setTimeout(() => updateLoader(false), 2000);
    }
  );
}

// --- APPLY GEOMETRY TO SCENE ---
function applyGeometry(geometry, filename) {
  // Clear previous mesh
  while (modelGroup.children.length > 0) {
    const child = modelGroup.children[0];
    modelGroup.remove(child);
  }

  // Update UI Stats
  const triCount = geometry.attributes.position.count / 3;
  const triEl = document.getElementById('val-triangles');
  if (triEl) triEl.textContent = triCount.toLocaleString('de-DE');

  const indEl = document.getElementById('model-indicator-text');
  if (indEl) {
    const label = filename.includes('Druck') ? '3D-Druckmodell (Solid)' : 'Gesamt-Ensemble';
    indEl.textContent = `Modell: ${label} (${triCount.toLocaleString('de-DE')} Polygone)`;
  }

  // Create Material
  const material = createMaterial(state.currentShader, geometry);
  currentMesh = new THREE.Mesh(geometry, material);
  currentMesh.castShadow = true;
  currentMesh.receiveShadow = true;
  modelGroup.add(currentMesh);

  // Wireframe Overlay
  const wireGeo = new THREE.WireframeGeometry(geometry);
  const wireMat = new THREE.LineBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.35,
    linewidth: 1
  });
  wireframeMesh = new THREE.LineSegments(wireGeo, wireMat);
  wireframeMesh.visible = state.wireframe;
  modelGroup.add(wireframeMesh);
}

// --- SHADERS & MATERIALS ---
function createMaterial(shaderKey, geometry) {
  if (shaderKey === 'elevation') {
    return createElevationShader(geometry);
  }

  const cfg = SHADER_CONFIGS[shaderKey] || SHADER_CONFIGS.sandstone;
  return new THREE.MeshStandardMaterial({
    color: cfg.color,
    roughness: cfg.roughness,
    metalness: cfg.metalness,
    flatShading: false
  });
}

/**
 * Creates custom height-ramp gradient shader based on vertex Y elevation.
 */
function createElevationShader(geometry) {
  const bbox = geometry.boundingBox;
  const minY = bbox.min.y;
  const maxY = bbox.max.y;

  const customMaterial = new THREE.MeshStandardMaterial({
    roughness: 0.75,
    metalness: 0.1
  });

  customMaterial.onBeforeCompile = (shader) => {
    shader.uniforms.minElevation = { value: minY };
    shader.uniforms.maxElevation = { value: maxY };

    shader.vertexShader = `
      varying float vElevation;
      ${shader.vertexShader}
    `.replace(
      '#include <begin_vertex>',
      `
      #include <begin_vertex>
      vElevation = position.y;
      `
    );

    shader.fragmentShader = `
      uniform float minElevation;
      uniform float maxElevation;
      varying float vElevation;
      
      vec3 getElevationColor(float h) {
        // Normalisierter Höhenbereich 0.0 bis 1.0
        float t = clamp((h - minElevation) / (maxElevation - minElevation), 0.0, 1.0);
        
        // 5-stufige hypsometrische Farbrampe:
        // Tal / Sockel (Dunkelgrün) -> Hang (Grün/Gelb) -> Veste Mauerwerk (Sandstein) -> Burgspitze (Rotbraun)
        vec3 col0 = vec3(0.09, 0.40, 0.22); // Talsohle 345m
        vec3 col1 = vec3(0.35, 0.65, 0.28); // Hang 380m
        vec3 col2 = vec3(0.85, 0.75, 0.45); // Vorburg 420m
        vec3 col3 = vec3(0.78, 0.42, 0.20); // Hohe Bastei 455m
        vec3 col4 = vec3(0.92, 0.25, 0.20); // Burgspitze 485m
        
        if (t < 0.25) return mix(col0, col1, t / 0.25);
        if (t < 0.50) return mix(col1, col2, (t - 0.25) / 0.25);
        if (t < 0.75) return mix(col2, col3, (t - 0.50) / 0.25);
        return mix(col3, col4, (t - 0.75) / 0.25);
      }
      ${shader.fragmentShader}
    `.replace(
      '#include <color_fragment>',
      `
      #include <color_fragment>
      diffuseColor.rgb = getElevationColor(vElevation);
      `
    );
  };

  return customMaterial;
}

function updateShader(newShaderKey) {
  state.currentShader = newShaderKey;
  if (currentMesh && currentMesh.geometry) {
    currentMesh.material.dispose();
    currentMesh.material = createMaterial(newShaderKey, currentMesh.geometry);
  }
}

// --- CAMERA VIEWPOINTS ---
function setCameraView(viewKey) {
  const targetCamPos = new THREE.Vector3();
  const targetLookAt = new THREE.Vector3(0, 12, 0);

  switch (viewKey) {
    case 'iso':
      targetCamPos.set(160, 110, 180);
      break;
    case 'top':
      targetCamPos.set(0, 230, 2);
      break;
    case 'south':
      targetCamPos.set(0, 45, 180);
      break;
    case 'detail':
      targetCamPos.set(50, 40, 50);
      break;
  }

  // Smooth tween transition
  let step = 0;
  const totalSteps = 30;
  function animateCam() {
    if (step < totalSteps) {
      camera.position.lerp(targetCamPos, 0.1);
      controls.target.lerp(targetLookAt, 0.1);
      controls.update();
      step++;
      requestAnimationFrame(animateCam);
    }
  }
  animateCam();
}

// --- UI EVENT LISTENERS ---
function setupEventListeners() {
  // Model selection buttons
  const btnDruck = document.getElementById('btn-model-druck');
  const btnGesamt = document.getElementById('btn-model-gesamt');

  if (btnDruck && btnGesamt) {
    btnDruck.addEventListener('click', () => {
      btnDruck.classList.add('active');
      btnGesamt.classList.remove('active');
      state.activeModelFile = 'Druckmodell.stl';
      loadModel('Druckmodell.stl');
    });

    btnGesamt.addEventListener('click', () => {
      btnGesamt.classList.add('active');
      btnDruck.classList.remove('active');
      state.activeModelFile = 'GesamtVeste.stl';
      loadModel('GesamtVeste.stl');
    });
  }

  // Shader chip buttons
  const shaderBtns = document.querySelectorAll('#shading-buttons .chip-btn');
  shaderBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      shaderBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const shaderKey = btn.dataset.shader;
      updateShader(shaderKey);
    });
  });

  // Wireframe toggle
  const wireToggle = document.getElementById('toggle-wireframe');
  if (wireToggle) {
    wireToggle.addEventListener('change', (e) => {
      state.wireframe = e.target.checked;
      if (wireframeMesh) wireframeMesh.visible = state.wireframe;
    });
  }

  // Auto-rotate toggle
  const autoRotateToggle = document.getElementById('toggle-autorotate');
  if (autoRotateToggle) {
    autoRotateToggle.addEventListener('change', (e) => {
      state.autoRotate = e.target.checked;
      controls.autoRotate = state.autoRotate;
    });
  }

  // Camera preset buttons
  const camBtns = document.querySelectorAll('.cam-btn');
  camBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      setCameraView(btn.dataset.cam);
    });
  });

  // Theme Toggle (Dark / Light)
  const themeBtn = document.getElementById('btn-theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', toggleTheme);
  }

  // Legal Modal open/close
  const legalModal = document.getElementById('legal-modal');
  const openLegalBtn = document.getElementById('btn-open-legal');
  const closeLegalBtn = document.getElementById('btn-close-modal');
  const ackLegalBtn = document.getElementById('btn-modal-ack');
  const linkLegalFooter = document.getElementById('link-legal-modal');

  const openModal = () => { if (legalModal) legalModal.classList.add('active'); };
  const closeModal = () => { if (legalModal) legalModal.classList.remove('active'); };

  if (openLegalBtn) openLegalBtn.addEventListener('click', openModal);
  if (linkLegalFooter) linkLegalFooter.addEventListener('click', (e) => { e.preventDefault(); openModal(); });
  if (closeLegalBtn) closeLegalBtn.addEventListener('click', closeModal);
  if (ackLegalBtn) ackLegalBtn.addEventListener('click', closeModal);

  if (legalModal) {
    legalModal.addEventListener('click', (e) => {
      if (e.target === legalModal) closeModal();
    });
  }
}

// --- THEME TOGGLE (DARK / LIGHT) ---
function toggleTheme() {
  state.isLightTheme = !state.isLightTheme;
  document.body.classList.toggle('theme-light', state.isLightTheme);

  if (state.isLightTheme) {
    scene.background.set(0xe2e8f0);
    scene.fog.color.set(0xe2e8f0);
    ambientLight.intensity = 0.75;
    dirLight1.intensity = 1.2;
    hemiLight.color.set(0xffffff);
    hemiLight.groundColor.set(0x94a3b8);
    if (gridHelper) gridHelper.material.opacity = 0.2;
  } else {
    scene.background.set(0x070b14);
    scene.fog.color.set(0x070b14);
    ambientLight.intensity = 0.45;
    dirLight1.intensity = 1.4;
    hemiLight.color.set(0x7dd3fc);
    hemiLight.groundColor.set(0x1e293b);
    if (gridHelper) gridHelper.material.opacity = 0.35;
  }
}

// --- LOADER PROGRESS ---
function updateLoader(show, text = '', progress = 0) {
  const overlay = document.getElementById('loader-overlay');
  const statusEl = document.getElementById('loader-status');
  const barEl = document.getElementById('loader-progress-bar');

  if (statusEl && text) statusEl.textContent = text;
  if (barEl && progress) barEl.style.width = `${progress}%`;

  if (overlay) {
    if (show) {
      overlay.classList.remove('fade-out');
    } else {
      overlay.classList.add('fade-out');
    }
  }
}

// --- RESIZE ---
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// --- RENDER LOOP ---
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

// Start application
init();
