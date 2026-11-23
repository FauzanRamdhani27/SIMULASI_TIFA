import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const on = (id, event, handler) => {
  const el = document.getElementById(id);
  if (el) el.addEventListener(event, handler);
};

// ==========================================
// 1. INISIALISASI SCENE, RENDERER & KAMERA
// ==========================================
const canvas = document.getElementById('sim-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1e293b);
scene.fog = new THREE.Fog(0x1e293b, 18, 40);

const mainCamera = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.1, 100);
mainCamera.position.set(6.2, 4.8, -1.5);

const controls = new OrbitControls(mainCamera, canvas);
controls.target.set(-0.4, 1.0, 1.5);
controls.maxPolarAngle = Math.PI / 2 - 0.04;
controls.enableDamping = true;

scene.add(new THREE.AmbientLight(0xf8fafc, 0.8));

const windowSunLight = new THREE.DirectionalLight(0xffffff, 1.1);
windowSunLight.position.set(-9, 8, 2);
windowSunLight.castShadow = true;
windowSunLight.shadow.mapSize.set(1024, 1024);
scene.add(windowSunLight);

const cafeWarmLight1 = new THREE.PointLight(0xffedd5, 1.1, 14);
cafeWarmLight1.position.set(0, 3.6, -3.5);
scene.add(cafeWarmLight1);

const cafeWarmLight2 = new THREE.PointLight(0xffedd5, 1.2, 14);
cafeWarmLight2.position.set(0.5, 3.6, 5.2);
scene.add(cafeWarmLight2);

// ==========================================
// 2. KATALOG MENU & STOK TEL-U COFFEE
// ==========================================
const MENU_CATALOG = [
  { id: 'kopi_hitam', keywords: ['kopi hitam', 'americano', 'black coffee'], name: 'Kopi Hitam', price: '15K', inStock: true },
  { id: 'kopi_susu', keywords: ['es kopi susu', 'kopi susu'], name: 'Es Kopi Susu Tel-U', price: '18K', inStock: true },
  { id: 'cappuccino', keywords: ['cappuccino', 'kapucino'], name: 'Cappuccino', price: '20K', inStock: true },
  { id: 'latte', keywords: ['latte', 'kopi latte'], name: 'Caffe Latte', price: '20K', inStock: true },
  { id: 'matcha', keywords: ['matcha', 'green tea'], name: 'Matcha Latte', price: '16K', inStock: false },
  { id: 'es_teh', keywords: ['es teh', 'teh manis'], name: 'Es Teh Manis', price: '10K', inStock: true },
  { id: 'nasgor', keywords: ['nasi goreng', 'nasgor'], name: 'Nasi Goreng Spesial', price: '25K', inStock: true }
];

function getAvailableMenuNames() {
  return MENU_CATALOG.filter((m) => m.inStock).map((m) => m.name);
}

// ==========================================
// 3. TEKSTUR PROSEDURAL TEL-U COFFEE
// ==========================================
function createMarbleFloorTexture() {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 512;
  const ctx = c.getContext('2d');

  ctx.fillStyle = '#525b66';
  ctx.fillRect(0, 0, 512, 512);

  for (let i = 0; i < 45; i++) {
    ctx.strokeStyle = i % 2 === 0 ? 'rgba(203, 213, 225, 0.12)' : 'rgba(30, 41, 59, 0.16)';
    ctx.lineWidth = 2 + (i % 4);
    ctx.beginPath();
    ctx.moveTo(Math.random() * 512, Math.random() * 512);
    ctx.bezierCurveTo(
      Math.random() * 512, Math.random() * 512,
      Math.random() * 512, Math.random() * 512,
      Math.random() * 512, Math.random() * 512
    );
    ctx.stroke();
  }

  ctx.strokeStyle = 'rgba(15, 23, 42, 0.35)';
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, 256, 256);
  ctx.strokeRect(256, 0, 256, 256);
  ctx.strokeRect(0, 256, 256, 256);
  ctx.strokeRect(256, 256, 256, 256);

  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(7, 8);
  return tex;
}

function createMuralWallTexture() {
  const c = document.createElement('canvas');
  c.width = 1024;
  c.height = 512;
  const ctx = c.getContext('2d');

  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, '#bae6fd');
  grad.addColorStop(0.65, '#38bdf8');
  grad.addColorStop(1, '#22c55e');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 512);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  [[130, 110, 55], [185, 100, 65], [240, 115, 50], [780, 120, 55], [840, 105, 65], [895, 125, 48]].forEach(
    ([x, y, r]) => {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  );

  ctx.fillStyle = '#15803d';
  ctx.beginPath();
  ctx.arc(140, 460, 170, Math.PI, 0);
  ctx.arc(880, 460, 180, Math.PI, 0);
  ctx.fill();

  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(475, 42);
  ctx.lineTo(549, 42);
  ctx.lineTo(549, 105);
  ctx.quadraticCurveTo(512, 138, 475, 105);
  ctx.closePath();
  ctx.stroke();

  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(285, 155, 454, 340);

  ctx.fillStyle = '#dc2626';
  ctx.font = 'bold 46px Georgia, serif';
  ctx.fillText('3', 385, 212);
  ctx.fillStyle = '#334155';
  ctx.font = '14px sans-serif';
  ctx.fillText('rd', 413, 192);
  ctx.font = 'bold 18px sans-serif';
  ctx.fillText('Anniversary', 435, 196);
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText('TEL-U COFFEE', 435, 222);

  return new THREE.CanvasTexture(c);
}

function createRightWallTexture() {
  const c = document.createElement('canvas');
  c.width = 1024;
  c.height = 512;
  const ctx = c.getContext('2d');

  ctx.fillStyle = '#374151';
  ctx.fillRect(0, 0, 1024, 512);

  ctx.fillStyle = '#f1f5f9';
  ctx.font = 'bold 26px sans-serif';
  ctx.textAlign = 'center';
  const labels = ['Peningkatan\nPendidikan', 'Peningkatan\nPenelitian', 'Perluasan\nKerjasama'];
  labels.forEach((txt, idx) => {
    const x = 220 + idx * 290;
    ctx.beginPath();
    ctx.arc(x, 105, 34, 0, Math.PI * 2);
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 4;
    ctx.stroke();

    const lines = txt.split('\n');
    ctx.fillText(lines[0], x, 175);
    ctx.fillText(lines[1], x, 208);
  });

  return new THREE.CanvasTexture(c);
}

const menuBoardCanvas = document.createElement('canvas');
menuBoardCanvas.width = 1024;
menuBoardCanvas.height = 512;
const menuBoardCtx = menuBoardCanvas.getContext('2d');
const menuBoardTexture = new THREE.CanvasTexture(menuBoardCanvas);

function updateCoffeeMenuBoardTexture() {
  const ctx = menuBoardCtx;
  ctx.fillStyle = '#1f2937';
  ctx.fillRect(0, 0, 1024, 512);

  ctx.fillStyle = '#090d16';
  ctx.fillRect(105, 55, 814, 255);
  ctx.strokeStyle = '#b45309';
  ctx.lineWidth = 8;
  ctx.strokeRect(105, 55, 814, 255);

  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 28px sans-serif';
  ctx.fillText('TEL-U COFFEE BAR & CASHIER', 295, 105);

  ctx.font = 'bold 18px monospace';
  MENU_CATALOG.forEach((item, idx) => {
    const col = idx < 4 ? 0 : 1;
    const row = idx < 4 ? idx : idx - 4;
    const x = col === 0 ? 135 : 535;
    const y = 152 + row * 40;

    ctx.fillStyle = item.inStock ? '#f8fafc' : '#f87171';
    const text = item.inStock
      ? `• ${item.name} .. ${item.price}`
      : `• ${item.name} [KOSONG]`;
    ctx.fillText(text, x, y);
  });

  menuBoardTexture.needsUpdate = true;
}
updateCoffeeMenuBoardTexture();

// ==========================================
// 4. BANGUNAN & INTERIOR TEL-U COFFEE
// ==========================================
const ROOM_W = 14;
const ROOM_D = 16;
const ROOM_H = 4.6;

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(ROOM_W, ROOM_D),
  new THREE.MeshStandardMaterial({
    map: createMarbleFloorTexture(),
    roughness: 0.28,
    metalness: 0.15
  })
);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

const ceiling = new THREE.Mesh(
  new THREE.PlaneGeometry(ROOM_W, ROOM_D),
  new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.9 })
);
ceiling.rotation.x = Math.PI / 2;
ceiling.position.y = ROOM_H;
scene.add(ceiling);

const redPipe = new THREE.Mesh(
  new THREE.CylinderGeometry(0.035, 0.035, ROOM_D - 1, 12),
  new THREE.MeshStandardMaterial({ color: 0xdc2626 })
);
redPipe.rotation.x = Math.PI / 2;
redPipe.position.set(3.2, ROOM_H - 0.25, 0);
scene.add(redPipe);

[[-2.2, -3.5], [2.2, -3.5], [-2.2, 1.5], [2.2, 1.5], [0, 5.2]].forEach(([lx, lz]) => {
  const cord = new THREE.Mesh(
    new THREE.CylinderGeometry(0.015, 0.015, 1.1, 8),
    new THREE.MeshStandardMaterial({ color: 0x0f172a })
  );
  cord.position.set(lx, ROOM_H - 0.55, lz);
  const shade = new THREE.Mesh(
    new THREE.ConeGeometry(0.22, 0.2, 16),
    new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.7, roughness: 0.3 })
  );
  shade.position.set(lx, ROOM_H - 1.1, lz);
  scene.add(cord, shade);
});

const pillarMat = new THREE.MeshStandardMaterial({ color: 0x374151, roughness: 0.7 });
const redPillarMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.4 });

const muralWall = new THREE.Mesh(
  new THREE.PlaneGeometry(8.4, ROOM_H),
  new THREE.MeshStandardMaterial({ map: createMuralWallTexture(), roughness: 0.6 })
);
muralWall.position.set(0.3, ROOM_H / 2, -ROOM_D / 2 + 0.02);
scene.add(muralWall);

const tvFrame = new THREE.Mesh(
  new THREE.BoxGeometry(2.3, 1.3, 0.08),
  new THREE.MeshStandardMaterial({ color: 0x090d16 })
);
tvFrame.position.set(0.3, 1.55, -ROOM_D / 2 + 0.08);
const tvScreen = new THREE.Mesh(
  new THREE.PlaneGeometry(2.16, 1.18),
  new THREE.MeshBasicMaterial({ color: 0x0284c7 })
);
tvScreen.position.set(0.3, 1.55, -ROOM_D / 2 + 0.13);
scene.add(tvFrame, tvScreen);

const barBackWall = new THREE.Mesh(
  new THREE.PlaneGeometry(ROOM_W, ROOM_H),
  new THREE.MeshStandardMaterial({ map: menuBoardTexture, roughness: 0.7 })
);
barBackWall.rotation.y = Math.PI;
barBackWall.position.set(0, ROOM_H / 2, ROOM_D / 2 - 0.02);
scene.add(barBackWall);

const backColLeft = new THREE.Mesh(new THREE.BoxGeometry(0.65, ROOM_H, 0.55), pillarMat);
backColLeft.position.set(-4.1, ROOM_H / 2, -ROOM_D / 2 + 0.25);
const backColRight = new THREE.Mesh(new THREE.BoxGeometry(0.65, ROOM_H, 0.55), pillarMat);
backColRight.position.set(4.7, ROOM_H / 2, -ROOM_D / 2 + 0.25);
const redCornerPillar = new THREE.Mesh(new THREE.BoxGeometry(0.75, ROOM_H, 0.75), redPillarMat);
redCornerPillar.position.set(-6.5, ROOM_H / 2, -ROOM_D / 2 + 0.4);
scene.add(backColLeft, backColRight, redCornerPillar);

const glassPane = new THREE.Mesh(
  new THREE.PlaneGeometry(ROOM_D, ROOM_H),
  new THREE.MeshBasicMaterial({ color: 0xe0f2fe })
);
glassPane.rotation.y = Math.PI / 2;
glassPane.position.set(-ROOM_W / 2, ROOM_H / 2, 0);
scene.add(glassPane);

const frameMat = new THREE.MeshStandardMaterial({ color: 0x111827, metalness: 0.5 });
for (let z = -7.5; z <= 7.5; z += 1.5) {
  const vMullion = new THREE.Mesh(new THREE.BoxGeometry(0.12, ROOM_H, 0.08), frameMat);
  vMullion.position.set(-ROOM_W / 2 + 0.05, ROOM_H / 2, z);
  scene.add(vMullion);
}
for (let y = 0.9; y < ROOM_H; y += 0.95) {
  const hMullion = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, ROOM_D), frameMat);
  hMullion.position.set(-ROOM_W / 2 + 0.05, y, 0);
  scene.add(hMullion);
}

const leftMidCol = new THREE.Mesh(new THREE.BoxGeometry(0.55, ROOM_H, 0.65), pillarMat);
leftMidCol.position.set(-ROOM_W / 2 + 0.25, ROOM_H / 2, -1.8);
scene.add(leftMidCol);

const rightWall = new THREE.Mesh(
  new THREE.PlaneGeometry(ROOM_D, ROOM_H),
  new THREE.MeshStandardMaterial({ map: createRightWallTexture(), roughness: 0.75 })
);
rightWall.rotation.y = -Math.PI / 2;
rightWall.position.set(ROOM_W / 2, ROOM_H / 2, 0);
scene.add(rightWall);

const acUnit = new THREE.Mesh(
  new THREE.BoxGeometry(0.32, 0.34, 1.35),
  new THREE.MeshStandardMaterial({ color: 0xf8fafc })
);
acUnit.position.set(ROOM_W / 2 - 0.18, 2.85, -2.5);
scene.add(acUnit);

// ==========================================
// 5. MEJA KASIR, KOMPUTER POS & COFFEE BAR
// ==========================================
const woodMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.45 });
const darkWoodMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.5 });
const blackMetalMat = new THREE.MeshStandardMaterial({ color: 0x111827, metalness: 0.5, roughness: 0.4 });
const steelMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, metalness: 0.85, roughness: 0.2 });

const cashierBarGroup = new THREE.Group();
scene.add(cashierBarGroup);

const mainCounterBody = new THREE.Mesh(
  new THREE.BoxGeometry(9.6, 1.0, 0.85),
  new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6 })
);
mainCounterBody.position.set(0.4, 0.5, 6.1);
mainCounterBody.castShadow = true;

const mainCounterTop = new THREE.Mesh(
  new THREE.BoxGeometry(9.8, 0.07, 0.95),
  woodMat
);
mainCounterTop.position.set(0.4, 1.035, 6.1);
mainCounterTop.castShadow = true;
cashierBarGroup.add(mainCounterBody, mainCounterTop);

const backPrepCounter = new THREE.Mesh(
  new THREE.BoxGeometry(9.6, 0.95, 0.65),
  darkWoodMat
);
backPrepCounter.position.set(0.4, 0.475, 7.55);
cashierBarGroup.add(backPrepCounter);

// Komputer Kasir (POS Monitor 3D)
const posCanvas = document.createElement('canvas');
posCanvas.width = 512;
posCanvas.height = 320;
const posCtx = posCanvas.getContext('2d');
const posTexture = new THREE.CanvasTexture(posCanvas);

const posStand = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.24, 0.14), blackMetalMat);
posStand.position.set(3.2, 1.18, 6.15);

const posMonitorBody = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.44, 0.05), blackMetalMat);
posMonitorBody.position.set(3.2, 1.38, 6.15);
posMonitorBody.rotation.x = 0.15;

const posScreenMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(0.62, 0.38),
  new THREE.MeshBasicMaterial({ map: posTexture })
);
posScreenMesh.position.set(3.2, 1.38, 6.12);
posScreenMesh.rotation.y = Math.PI;
posScreenMesh.rotation.x = -0.15;

const cashDrawer = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.1, 0.42), blackMetalMat);
cashDrawer.position.set(4.1, 1.12, 6.12);
const receiptPrinter = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.14, 0.2), new THREE.MeshStandardMaterial({ color: 0xf8fafc }));
receiptPrinter.position.set(2.55, 1.14, 6.1);

cashierBarGroup.add(posStand, posMonitorBody, posScreenMesh, cashDrawer, receiptPrinter);

// Tempat Buat Kopi (Espresso Machine, Grinder & Cups)
const espressoMachine = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.48, 0.52), steelMat);
espressoMachine.position.set(-2.2, 1.31, 6.12);
const espressoAccent = new THREE.Mesh(new THREE.BoxGeometry(0.87, 0.1, 0.54), redPillarMat);
espressoAccent.position.set(-2.2, 1.52, 6.12);

[-2.38, -2.02].forEach((px) => {
  const groupHead = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.08, 12), blackMetalMat);
  groupHead.position.set(px, 1.25, 5.86);
  cashierBarGroup.add(groupHead);
});

const grinderBase = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.34, 0.28), blackMetalMat);
grinderBase.position.set(-1.35, 1.24, 6.12);
const beanHopper = new THREE.Mesh(
  new THREE.CylinderGeometry(0.11, 0.05, 0.22, 16),
  new THREE.MeshStandardMaterial({ color: 0x451a03, transparent: true, opacity: 0.85 })
);
beanHopper.position.set(-1.35, 1.51, 6.12);

[-0.45, -0.25, -0.05].forEach((cx, idx) => {
  const cup = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.04, 0.13, 12),
    new THREE.MeshStandardMaterial({ color: idx === 1 ? 0xd97706 : 0xf8fafc })
  );
  cup.position.set(cx, 1.135, 6.05);
  cashierBarGroup.add(cup);
});

cashierBarGroup.add(espressoMachine, espressoAccent, grinderBase, beanHopper);

function createStaffMember(x, z, shirtColor) {
  const staff = new THREE.Group();
  staff.position.set(x, 0, z);
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.22, 0.25, 1.1, 16),
    new THREE.MeshStandardMaterial({ color: shirtColor })
  );
  body.position.y = 0.85;
  const apron = new THREE.Mesh(
    new THREE.BoxGeometry(0.36, 0.65, 0.08),
    new THREE.MeshStandardMaterial({ color: 0x78350f })
  );
  apron.position.set(0, 0.85, -0.21);
  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.17, 16, 16),
    new THREE.MeshStandardMaterial({ color: 0xfde68a })
  );
  head.position.y = 1.56;
  staff.add(body, apron, head);
  cashierBarGroup.add(staff);
}

createStaffMember(3.2, 6.85, 0x0f172a);
createStaffMember(-2.1, 6.85, 0x1e3a8a);

// ==========================================
// 6. FURNITUR & 5 PELANGGAN YANG BISA ANGKAT TANGAN
// ==========================================
const blackChairMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6 });
const redStoolMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.35 });

const deliveredCupsGroup = new THREE.Group();
scene.add(deliveredCupsGroup);

const longBarGroup = new THREE.Group();
longBarGroup.position.set(-0.6, 0, -1.0);
scene.add(longBarGroup);

const longBarTop = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.07, 0.72), woodMat);
longBarTop.position.y = 1.05;
longBarGroup.add(longBarTop);

[-2.05, 0, 2.05].forEach((px) => {
  const frame = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.05, 0.66), blackMetalMat);
  frame.position.set(px, 0.525, 0);
  longBarGroup.add(frame);
});

[-1.4, -0.3, 0.8].forEach((bx) => {
  [-0.42, 0.42].forEach((bz) => {
    const bStool = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.72, 0.32), blackMetalMat);
    bStool.position.set(bx, 0.36, bz);
    longBarGroup.add(bStool);
  });
});

const windowCounter = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.06, 5.2), woodMat);
windowCounter.position.set(-6.55, 1.02, 1.4);
scene.add(windowCounter);

[-0.4, 0.8, 2.0, 3.2].forEach((sz) => {
  const stool = new THREE.Group();
  stool.position.set(-6.05, 0, sz);
  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.05, 0.34), redStoolMat);
  seat.position.y = 0.72;
  stool.add(seat);
  [[-0.13, -0.13], [0.13, -0.13], [-0.13, 0.13], [0.13, 0.13]].forEach(([lx, lz]) => {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.024, 0.72, 8), redStoolMat);
    leg.position.set(lx, 0.36, lz);
    stool.add(leg);
  });
  scene.add(stool);
});

function createBlackDesk(x, z) {
  const grp = new THREE.Group();
  grp.position.set(x, 0, z);
  const top = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.05, 0.85), blackMetalMat);
  top.position.y = 0.74;
  grp.add(top);

  [[-0.6, -0.36], [0.6, -0.36], [-0.6, 0.36], [0.6, 0.36]].forEach(([lx, lz]) => {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.74, 8), blackMetalMat);
    leg.position.set(lx, 0.37, lz);
    grp.add(leg);
  });

  const laptopBase = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.02, 0.22), new THREE.MeshStandardMaterial({ color: 0x94a3b8 }));
  laptopBase.position.set(-0.2, 0.775, 0);
  const laptopScreen = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.21, 0.015), new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
  laptopScreen.position.set(-0.2, 0.87, -0.1);
  laptopScreen.rotation.x = -0.2;
  grp.add(laptopBase, laptopScreen);
  scene.add(grp);
}
createBlackDesk(-2.6, 2.3);
createBlackDesk(3.6, 2.2);

[
  new THREE.Vector3(-3.6, 0, -4.8),
  new THREE.Vector3(3.6, 0, -4.8)
].forEach((pos) => {
  const tableMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.72, 0.05, 24), woodMat);
  tableMesh.position.set(pos.x, 0.74, pos.z);
  const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.32, 0.74, 16), darkWoodMat);
  pedestal.position.set(pos.x, 0.37, pos.z);
  scene.add(tableMesh, pedestal);
});

function createInteractiveCustomer(id, name, custPos, servicePos, tableTopPos, shirtColor, isHighStool = false) {
  const group = new THREE.Group();
  group.position.copy(custPos);

  const seatY = isHighStool ? 0.72 : 0.44;
  if (!isHighStool) {
    const chair = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.44, 0.4), blackChairMat);
    chair.position.y = 0.22;
    group.add(chair);
  }

  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.19, 0.23, 0.62, 16),
    new THREE.MeshStandardMaterial({ color: shirtColor })
  );
  body.position.y = seatY + 0.28;

  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.15, 16, 16),
    new THREE.MeshStandardMaterial({ color: 0xfde68a })
  );
  head.position.y = seatY + 0.72;

  const arm = new THREE.Mesh(
    new THREE.BoxGeometry(0.11, 0.52, 0.11),
    new THREE.MeshStandardMaterial({ color: 0xfde68a })
  );
  const restArmY = seatY + 0.38;
  arm.position.set(0, restArmY, 0.23);

  const badgeMesh = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.14, 0),
    new THREE.MeshBasicMaterial({ color: 0xfbbf24 })
  );
  badgeMesh.position.y = seatY + 1.18;
  badgeMesh.visible = false;

  group.add(body, head, arm, badgeMesh);
  scene.add(group);

  return {
    id,
    name,
    pos: custPos.clone(),
    servicePos: servicePos.clone(),
    tableTopPos: tableTopPos.clone(),
    arm,
    restArmY,
    badgeMesh,
    raisingHand: false
  };
}

const customers = [
  createInteractiveCustomer(1, 'Meja 1 (Bundar Kiri)',   new THREE.Vector3(-4.45, 0, -4.8), new THREE.Vector3(-2.1, 0, -4.2), new THREE.Vector3(-3.6, 0.765, -4.8), 0xea580c, false),
  createInteractiveCustomer(2, 'Meja 2 (Bundar Kanan)',  new THREE.Vector3(4.45, 0, -4.8),  new THREE.Vector3(2.1, 0, -4.2),  new THREE.Vector3(3.6, 0.765, -4.8),  0x0ea5e9, false),
  createInteractiveCustomer(3, 'Meja 3 (Belajar Kiri)',  new THREE.Vector3(-2.85, 0, 2.85), new THREE.Vector3(-0.9, 0, 2.3),  new THREE.Vector3(-2.3, 0.765, 2.3),  0x1e293b, false),
  createInteractiveCustomer(4, 'Meja 4 (Belajar Kanan)', new THREE.Vector3(3.35, 0, 2.75),  new THREE.Vector3(1.9, 0, 2.2),   new THREE.Vector3(3.85, 0.765, 2.2),  0x0284c7, false),
  createInteractiveCustomer(5, 'Meja 5 (Bar Jendela)',   new THREE.Vector3(-6.05, 0, 2.0),  new THREE.Vector3(-4.6, 0, 2.0),  new THREE.Vector3(-6.55, 1.05, 2.0),  0x10b981, true)
];

function placeDeliveredCoffeeOnTable(tableId) {
  const cust = customers.find((c) => c.id === tableId);
  if (!cust) return;
  const cup = new THREE.Mesh(
    new THREE.CylinderGeometry(0.065, 0.05, 0.16, 16),
    new THREE.MeshStandardMaterial({ color: 0x92400e })
  );
  cup.position.set(cust.tableTopPos.x, cust.tableTopPos.y + 0.08, cust.tableTopPos.z);

  const lid = new THREE.Mesh(
    new THREE.CylinderGeometry(0.068, 0.068, 0.02, 16),
    new THREE.MeshStandardMaterial({ color: 0xf8fafc })
  );
  lid.position.set(cust.tableTopPos.x, cust.tableTopPos.y + 0.165, cust.tableTopPos.z);

  deliveredCupsGroup.add(cup, lid);
}

const obstacleMesh = new THREE.Mesh(
  new THREE.BoxGeometry(0.75, 0.95, 0.75),
  new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.4 })
);
obstacleMesh.position.set(2.5, 0.475, -1.8);
obstacleMesh.visible = false;
obstacleMesh.castShadow = true;
scene.add(obstacleMesh);

// ==========================================
// 7. RAKITAN 3D ROBOT TIFA & DUAL-CAMERA
// ==========================================
const robotTifa = new THREE.Group();
robotTifa.position.set(0.4, 0, 4.4);
robotTifa.rotation.y = Math.PI;
scene.add(robotTifa);

const baseMesh = new THREE.Mesh(
  new THREE.CylinderGeometry(0.4, 0.43, 0.24, 24),
  new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.6, roughness: 0.3 })
);
baseMesh.position.y = 0.12;
robotTifa.add(baseMesh);

const pillarMesh = new THREE.Mesh(
  new THREE.BoxGeometry(0.34, 0.95, 0.28),
  new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 })
);
pillarMesh.position.set(0, 0.7, -0.1);
robotTifa.add(pillarMesh);

const trayGroup = new THREE.Group();
trayGroup.position.set(0, 0.65, 0.18);
robotTifa.add(trayGroup);

const trayPlate = new THREE.Mesh(
  new THREE.BoxGeometry(0.56, 0.045, 0.46),
  new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.4 })
);
trayGroup.add(trayPlate);

const manualDrinkGroup = new THREE.Group();
const foodPlate = new THREE.Mesh(
  new THREE.CylinderGeometry(0.13, 0.1, 0.02, 20),
  new THREE.MeshStandardMaterial({ color: 0xf8fafc })
);
foodPlate.position.set(-0.11, 0.035, 0.02);

const foodMound = new THREE.Mesh(
  new THREE.SphereGeometry(0.085, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2),
  new THREE.MeshStandardMaterial({ color: 0xd97706 })
);
foodMound.position.set(-0.11, 0.04, 0.02);

manualDrinkGroup.add(foodPlate, foodMound);
manualDrinkGroup.visible = false;
trayGroup.add(manualDrinkGroup);

const trayCupsGroup = new THREE.Group();
trayGroup.add(trayCupsGroup);
const trayCupMeshes = new Map();

const TRAY_SLOTS = {
  1: { x: -0.16, z: -0.10 },
  2: { x:  0.16, z: -0.10 },
  3: { x:  0.00, z:  0.00 },
  4: { x: -0.16, z:  0.11 },
  5: { x:  0.16, z:  0.11 }
};

function createLabeledCoffeeCup(tableId) {
  const cupGrp = new THREE.Group();
  const slot = TRAY_SLOTS[tableId] || { x: 0, z: 0 };
  cupGrp.position.set(slot.x, 0.022, slot.z);

  const cup = new THREE.Mesh(
    new THREE.CylinderGeometry(0.058, 0.045, 0.15, 16),
    new THREE.MeshStandardMaterial({ color: 0x92400e })
  );
  cup.position.y = 0.075;

  const lid = new THREE.Mesh(
    new THREE.CylinderGeometry(0.061, 0.061, 0.018, 16),
    new THREE.MeshStandardMaterial({ color: 0xf8fafc })
  );
  lid.position.y = 0.155;

  const tagCanvas = document.createElement('canvas');
  tagCanvas.width = 128;
  tagCanvas.height = 128;
  const tCtx = tagCanvas.getContext('2d');
  tCtx.fillStyle = '#0284c7';
  tCtx.beginPath();
  tCtx.arc(64, 64, 58, 0, Math.PI * 2);
  tCtx.fill();
  tCtx.fillStyle = '#ffffff';
  tCtx.font = 'bold 52px sans-serif';
  tCtx.textAlign = 'center';
  tCtx.textBaseline = 'middle';
  tCtx.fillText(`M${tableId}`, 64, 68);

  const tagMesh = new THREE.Mesh(
    new THREE.CircleGeometry(0.052, 16),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(tagCanvas) })
  );
  tagMesh.rotation.x = -Math.PI / 2;
  tagMesh.position.y = 0.166;

  cupGrp.add(cup, lid, tagMesh);
  return cupGrp;
}

const faceCanvas = document.createElement('canvas');
faceCanvas.width = 512;
faceCanvas.height = 256;
const fCtx = faceCanvas.getContext('2d');
const faceTexture = new THREE.CanvasTexture(faceCanvas);

const headBox = new THREE.Mesh(
  new THREE.BoxGeometry(0.45, 0.29, 0.31),
  new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 })
);
headBox.position.set(0, 1.32, 0.02);
robotTifa.add(headBox);

const screenMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(0.39, 0.21),
  new THREE.MeshBasicMaterial({ map: faceTexture })
);
screenMesh.position.set(0, 1.32, 0.18);
robotTifa.add(screenMesh);

const eyeCamera = new THREE.PerspectiveCamera(65, 220 / 140, 0.1, 22);
eyeCamera.rotation.order = 'YXZ';
eyeCamera.position.set(0, 1.44, 0.22);
eyeCamera.rotation.y = Math.PI;
eyeCamera.rotation.x = -0.14;
robotTifa.add(eyeCamera);

const trayCamera = new THREE.PerspectiveCamera(56, 220 / 140, 0.05, 3);
trayCamera.position.set(0, 1.12, 0.56);
trayCamera.rotation.x = -0.88;
robotTifa.add(trayCamera);

// ==========================================
// 8. STATE SIMULASI, EKSPRESI & LAYAR KOMPUTER KASIR (POS)
// ==========================================
const BARISTA_DOCK_POS = new THREE.Vector3(0.4, 0, 4.75);

const state = {
  mode: 'TASK',
  cruiseActive: false,
  waypointIndex: 0,
  targetPos: null,
  pathQueue: [],
  manualTrayLoad: false,
  stabilizerOn: true,
  obstacleActive: false,
  respondingCustomerId: null,
  recallingToBarista: false,
  pendingBaristaDispatch: false,
  selectedDestTables: new Set(),
  deliveryQueue: [],
  waitingCustomerPickup: null,
  activeTableId: 2,
  expression: 'WELCOME',
  chatActive: false,
  chatSeconds: 0,
  currentSpeed: 0,
  prevSpeed: 0,
  stuckTimer: 0,
  lastCheckPos: new THREE.Vector3(0.4, 0, 4.4),
  posOrders: [],
  nextOrderId: 1
};

const cruiseWaypoints = [
  new THREE.Vector3(0.4, 0, 4.4),
  new THREE.Vector3(1.9, 0, 1.8),
  new THREE.Vector3(2.6, 0, -0.4),
  new THREE.Vector3(2.6, 0, -3.4),
  new THREE.Vector3(2.1, 0, -4.2),
  new THREE.Vector3(-2.1, 0, -4.2),
  new THREE.Vector3(-4.6, 0, -2.0),
  new THREE.Vector3(-4.6, 0, 2.0),
  new THREE.Vector3(-4.6, 0, 4.2),
  new THREE.Vector3(-0.9, 0, 2.3)
];

function renderMenuStockControls() {
  const container = document.getElementById('menu-stock-controls');
  if (!container) return;
  container.innerHTML = MENU_CATALOG.map(
    (item) => `
      <button type="button" class="stock-chip ${item.inStock ? '' : 'empty'}" data-stock-id="${item.id}">
        ${item.name}: ${item.inStock ? 'Tersedia' : 'KOSONG'}
      </button>`
  ).join('');
}
renderMenuStockControls();

function hasAnyTrayLoad() {
  return state.manualTrayLoad || trayCupMeshes.size > 0;
}

function syncTrayUIStatus() {
  const trayTxt = document.getElementById('tray-status-text');
  if (!trayTxt) return;
  if (trayCupMeshes.size > 0) {
    const mejaList = Array.from(trayCupMeshes.keys()).map((id) => `M${id}`).join(', ');
    trayTxt.textContent = `${trayCupMeshes.size} Kopi (${mejaList})`;
  } else if (state.manualTrayLoad) {
    trayTxt.textContent = 'Muatan Uji (< 0.6 m/s)';
  } else {
    trayTxt.textContent = 'Kosong';
  }
}

function setTrayCupsForTables(tableIds) {
  trayCupsGroup.clear();
  trayCupMeshes.clear();
  tableIds.forEach((id) => {
    const cupGrp = createLabeledCoffeeCup(id);
    trayCupsGroup.add(cupGrp);
    trayCupMeshes.set(id, cupGrp);
  });
  syncTrayUIStatus();
}

function removeSingleCupFromTray(tableId) {
  const cupGrp = trayCupMeshes.get(tableId);
  if (cupGrp) {
    trayCupsGroup.remove(cupGrp);
    trayCupMeshes.delete(tableId);
  }
  syncTrayUIStatus();
}

function syncBaristaSelectorUI() {
  document.querySelectorAll('[data-dest-table]').forEach((btn) => {
    const tId = Number(btn.getAttribute('data-dest-table'));
    btn.classList.toggle('selected', state.selectedDestTables.has(tId));
  });
  const dispatchBtn = document.getElementById('btn-load-and-deliver');
  if (dispatchBtn) {
    const count = state.selectedDestTables.size;
    dispatchBtn.textContent = `Taruh Kopi di Tray & Antar (${count} Meja)`;
  }
}

function updatePosSystemUI() {
  posCtx.fillStyle = '#090d16';
  posCtx.fillRect(0, 0, 512, 320);

  posCtx.fillStyle = '#0284c7';
  posCtx.fillRect(0, 0, 512, 46);
  posCtx.fillStyle = '#ffffff';
  posCtx.font = 'bold 20px sans-serif';
  posCtx.fillText('TEL-U COFFEE - POS KOMPUTER KASIR', 20, 30);

  if (state.posOrders.length === 0) {
    posCtx.fillStyle = '#64748b';
    posCtx.font = '18px monospace';
    posCtx.fillText('> Menunggu pesanan dari Robot TIFA...', 24, 100);
  } else {
    state.posOrders.slice(0, 5).forEach((ord, idx) => {
      const y = 78 + idx * 46;
      posCtx.fillStyle = '#1e293b';
      posCtx.fillRect(16, y - 24, 480, 38);

      const statusColors = {
        DIPROSES: '#fbbf24',
        DIANTAR_TIFA: '#38bdf8',
        SELESAI: '#4ade80'
      };
      posCtx.fillStyle = statusColors[ord.status] || '#4ade80';
      posCtx.font = 'bold 16px monospace';
      posCtx.fillText(`[MEJA ${ord.table}] ${ord.qty}x ${ord.item}`, 24, y);
      posCtx.fillText(ord.status, 365, y);
    });
  }
  posTexture.needsUpdate = true;

  const listEl = document.getElementById('pos-order-list');
  if (!listEl) return;
  if (state.posOrders.length === 0) {
    listEl.innerHTML = '<div class="pos-empty">Belum ada pesanan masuk dari TIFA...</div>';
    return;
  }

  listEl.innerHTML = state.posOrders
    .map((ord) => {
      if (ord.status === 'DIPROSES') {
        return `
          <div class="pos-item processing">
            <span><strong>Meja ${ord.table}:</strong> ${ord.qty}x ${ord.item}</span>
            <span class="pos-badge pending">DIPROSES BARISTA</span>
          </div>`;
      }
      if (ord.status === 'DIANTAR_TIFA') {
        return `
          <div class="pos-item delivering">
            <span><strong>Meja ${ord.table}:</strong> ${ord.qty}x ${ord.item}</span>
            <span class="pos-badge delivering">DI TRAY TIFA</span>
          </div>`;
      }
      return `
        <div class="pos-item">
          <span><strong>Meja ${ord.table}:</strong> ${ord.qty}x ${ord.item}</span>
          <span class="pos-badge">DIAMBIL (${ord.time})</span>
        </div>`;
    })
    .join('');
}
updatePosSystemUI();

function drawFaceExpression(type) {
  state.expression = type;
  const expEl = document.getElementById('expression-display');
  if (expEl) expEl.textContent = type;

  fCtx.fillStyle = '#090d16';
  fCtx.fillRect(0, 0, 512, 256);

  const isAngry = type.startsWith('ANGRY');
  const isSorry = type === 'SORRY' || type === 'NOT_ON_MENU';

  fCtx.strokeStyle = isAngry ? '#ef4444' : isSorry ? '#fbbf24' : '#38bdf8';
  fCtx.fillStyle = isAngry ? '#ef4444' : isSorry ? '#fbbf24' : '#38bdf8';
  fCtx.lineWidth = 10;

  if (type === 'WELCOME') {
    fCtx.beginPath(); fCtx.arc(160, 110, 35, Math.PI, 0); fCtx.stroke();
    fCtx.beginPath(); fCtx.arc(352, 110, 35, Math.PI, 0); fCtx.stroke();
    fCtx.beginPath(); fCtx.arc(256, 145, 50, 0.15 * Math.PI, 0.85 * Math.PI); fCtx.stroke();
  } else if (type === 'TALKING') {
    fCtx.beginPath(); fCtx.arc(160, 100, 22, 0, Math.PI * 2); fCtx.fill();
    fCtx.beginPath(); fCtx.arc(352, 100, 22, 0, Math.PI * 2); fCtx.fill();
    fCtx.fillRect(206, 155, 100, 32);
  } else if (isSorry) {
    fCtx.beginPath(); fCtx.moveTo(125, 92); fCtx.lineTo(195, 72); fCtx.stroke();
    fCtx.beginPath(); fCtx.moveTo(387, 92); fCtx.lineTo(317, 72); fCtx.stroke();
    fCtx.beginPath(); fCtx.arc(160, 122, 18, 0, Math.PI * 2); fCtx.fill();
    fCtx.beginPath(); fCtx.arc(352, 122, 18, 0, Math.PI * 2); fCtx.fill();
    fCtx.beginPath(); fCtx.arc(256, 195, 36, 1.2 * Math.PI, 1.8 * Math.PI); fCtx.stroke();
  } else if (isAngry) {
    fCtx.beginPath(); fCtx.moveTo(120, 75); fCtx.lineTo(205, 105); fCtx.stroke();
    fCtx.beginPath(); fCtx.moveTo(392, 75); fCtx.lineTo(307, 105); fCtx.stroke();
    fCtx.beginPath(); fCtx.arc(160, 120, 18, 0, Math.PI * 2); fCtx.fill();
    fCtx.beginPath(); fCtx.arc(352, 120, 18, 0, Math.PI * 2); fCtx.fill();
    fCtx.beginPath(); fCtx.arc(256, 205, 45, 1.15 * Math.PI, 1.85 * Math.PI); fCtx.stroke();
  }

  faceTexture.needsUpdate = true;
}
drawFaceExpression('WELCOME');

// ==========================================
// 9. A* GRID PATHFINDER (ANTI-NABRAK & ANTI-STUCK)
// ==========================================
const GRID_MIN_X = -5.6;
const GRID_MAX_X = 6.2;
const GRID_MIN_Z = -7.0;
const GRID_MAX_Z = 5.2;
const GRID_STEP = 0.35;
const GRID_COLS = Math.ceil((GRID_MAX_X - GRID_MIN_X) / GRID_STEP) + 1;
const GRID_ROWS = Math.ceil((GRID_MAX_Z - GRID_MIN_Z) / GRID_STEP) + 1;

function isPointBlocked(x, z, margin = 0.54) {
  if (x < -5.35 || x > 5.95 || z < -6.8 || z > 5.0) return true;

  if (Math.abs(x - -0.6) < 2.22 + margin && Math.abs(z - -1.0) < 0.58 + margin) return true;
  if (Math.abs(x - -2.6) < 0.72 + margin && Math.abs(z - 2.3) < 0.52 + margin) return true;
  if (Math.abs(x - 3.6) < 0.72 + margin && Math.abs(z - 2.2) < 0.52 + margin) return true;

  if (Math.hypot(x - -3.6, z - -4.8) < 0.74 + margin) return true;
  if (Math.hypot(x - 3.6, z - -4.8) < 0.74 + margin) return true;

  for (const c of customers) {
    if (Math.hypot(x - c.pos.x, z - c.pos.z) < 0.28 + margin) return true;
  }

  if (state.obstacleActive) {
    if (
      Math.abs(x - obstacleMesh.position.x) < 0.4 + margin &&
      Math.abs(z - obstacleMesh.position.z) < 0.4 + margin
    ) {
      return true;
    }
  }

  return false;
}

function worldToGrid(x, z) {
  const col = THREE.MathUtils.clamp(Math.round((x - GRID_MIN_X) / GRID_STEP), 0, GRID_COLS - 1);
  const row = THREE.MathUtils.clamp(Math.round((z - GRID_MIN_Z) / GRID_STEP), 0, GRID_ROWS - 1);
  return { col, row };
}

function gridToWorld(col, row) {
  return new THREE.Vector3(GRID_MIN_X + col * GRID_STEP, 0, GRID_MIN_Z + row * GRID_STEP);
}

function findNearestWalkableCell(col, row, blockedGrid) {
  if (!blockedGrid[row][col]) return { col, row };
  for (let r = 1; r <= 6; r++) {
    for (let dr = -r; dr <= r; dr++) {
      for (let dc = -r; dc <= r; dc++) {
        const nr = row + dr;
        const nc = col + dc;
        if (nr >= 0 && nr < GRID_ROWS && nc >= 0 && nc < GRID_COLS && !blockedGrid[nr][nc]) {
          return { col: nc, row: nr };
        }
      }
    }
  }
  return { col, row };
}

function hasLineOfSight(ax, az, bx, bz) {
  const dist = Math.hypot(bx - ax, bz - az);
  const steps = Math.max(2, Math.ceil(dist / 0.15));
  for (let i = 1; i < steps; i++) {
    const t = i / steps;
    if (isPointBlocked(ax + (bx - ax) * t, az + (bz - az) * t, 0.52)) return false;
  }
  return true;
}

function computeAStarPath(startVec, goalVec) {
  const blocked = Array.from({ length: GRID_ROWS }, (_, r) =>
    Array.from({ length: GRID_COLS }, (_, c) => {
      const w = gridToWorld(c, r);
      return isPointBlocked(w.x, w.z, 0.54);
    })
  );

  const startCell = findNearestWalkableCell(...Object.values(worldToGrid(startVec.x, startVec.z)), blocked);
  const goalCell = findNearestWalkableCell(...Object.values(worldToGrid(goalVec.x, goalVec.z)), blocked);

  const open = [{ ...startCell, g: 0, f: 0 }];
  const cameFrom = new Map();
  const gScore = new Map();
  const key = (c, r) => `${c},${r}`;
  gScore.set(key(startCell.col, startCell.row), 0);

  const dirs = [
    [1, 0, 1], [-1, 0, 1], [0, 1, 1], [0, -1, 1],
    [1, 1, 1.414], [1, -1, 1.414], [-1, 1, 1.414], [-1, -1, 1.414]
  ];

  let found = null;
  while (open.length > 0) {
    open.sort((a, b) => a.f - b.f);
    const curr = open.shift();
    if (curr.col === goalCell.col && curr.row === goalCell.row) {
      found = curr;
      break;
    }

    for (const [dc, dr, cost] of dirs) {
      const nc = curr.col + dc;
      const nr = curr.row + dr;
      if (nc < 0 || nc >= GRID_COLS || nr < 0 || nr >= GRID_ROWS) continue;
      if (blocked[nr][nc]) continue;
      if (dc !== 0 && dr !== 0 && (blocked[curr.row][nc] || blocked[nr][curr.col])) continue;

      const tentativeG = curr.g + cost;
      const nKey = key(nc, nr);
      if (tentativeG < (gScore.get(nKey) ?? Infinity)) {
        cameFrom.set(nKey, curr);
        gScore.set(nKey, tentativeG);
        const h = Math.hypot(goalCell.col - nc, goalCell.row - nr);
        open.push({ col: nc, row: nr, g: tentativeG, f: tentativeG + h });
      }
    }
  }

  if (!found) return [goalVec.clone()];

  const rawPoints = [];
  let curr = found;
  while (curr) {
    rawPoints.unshift(gridToWorld(curr.col, curr.row));
    curr = cameFrom.get(key(curr.col, curr.row));
  }
  rawPoints.push(goalVec.clone());

  const smoothed = [rawPoints[0]];
  let anchorIdx = 0;
  while (anchorIdx < rawPoints.length - 1) {
    let furthestIdx = anchorIdx + 1;
    for (let testIdx = rawPoints.length - 1; testIdx > anchorIdx + 1; testIdx--) {
      if (
        hasLineOfSight(
          rawPoints[anchorIdx].x,
          rawPoints[anchorIdx].z,
          rawPoints[testIdx].x,
          rawPoints[testIdx].z
        )
      ) {
        furthestIdx = testIdx;
        break;
      }
    }
    smoothed.push(rawPoints[furthestIdx]);
    anchorIdx = furthestIdx;
  }

  if (smoothed.length > 1) smoothed.shift();
  return smoothed;
}

function setRouteToGoal(goalVec) {
  state.targetPos = goalVec.clone();
  state.pathQueue = computeAStarPath(robotTifa.position, goalVec);
  state.stuckTimer = 0;
}

function resumePatrolAfterTask() {
  if (state.recallingToBarista || state.deliveryQueue.length > 0) return;

  state.cruiseActive = true;
  const cruiseBtn = document.getElementById('btn-toggle-cruise');
  if (cruiseBtn) cruiseBtn.textContent = 'Hentikan Cruise Mode';

  for (let i = 1; i <= cruiseWaypoints.length; i++) {
    const nextIdx = (state.waypointIndex + i) % cruiseWaypoints.length;
    if (robotTifa.position.distanceTo(cruiseWaypoints[nextIdx]) > 1.2) {
      state.waypointIndex = nextIdx;
      break;
    }
  }

  setRouteToGoal(cruiseWaypoints[state.waypointIndex]);
}

// ==========================================
// 10. FITUR PANGGIL ROBOT KEMBALI & PENGANTARAN MULTI-MEJA
// ==========================================
function orderTablesByNearestRoute(startPos, tableIds) {
  const remaining = [...tableIds];
  const ordered = [];
  let currentRef = startPos.clone();

  while (remaining.length > 0) {
    let bestIdx = 0;
    let bestDist = Infinity;
    remaining.forEach((tId, idx) => {
      const cust = customers.find((c) => c.id === tId);
      if (!cust) return;
      const d = currentRef.distanceTo(cust.servicePos);
      if (d < bestDist) {
        bestDist = d;
        bestIdx = idx;
      }
    });
    const nextId = remaining.splice(bestIdx, 1)[0];
    ordered.push(nextId);
    const nextCust = customers.find((c) => c.id === nextId);
    if (nextCust) currentRef = nextCust.servicePos.clone();
  }
  return ordered;
}

function recallRobotToBarista() {
  state.respondingCustomerId = null;
  state.waitingCustomerPickup = null;
  state.chatActive = false;
  state.chatSeconds = 0;
  stopListeningVoice();

  const timerEl = document.getElementById('chat-timer-display');
  if (timerEl) timerEl.textContent = '0 / 20 dtk';

  const pickupBanner = document.getElementById('pickup-banner');
  if (pickupBanner) pickupBanner.style.display = 'none';

  const distToBarista = robotTifa.position.distanceTo(BARISTA_DOCK_POS);
  if (distToBarista <= 0.45) {
    state.recallingToBarista = false;
    state.targetPos = null;
    state.pathQueue = [];
    robotTifa.rotation.y = 0;
    document.getElementById('robot-state-desc').textContent =
      'Status: TIFA di Meja Barista (Siap Taruh Kopi di Tray)';
    appendChat('TIFA', 'TIFA sudah di depan meja barista. Silakan taruh kopi di tray dan pilih meja tujuan.', 'bot');
    return;
  }

  state.recallingToBarista = true;
  document.getElementById('robot-state-desc').textContent =
    'Status: Dipanggil Barista -> Kembali ke Meja Kasir';
  appendChat('Barista', 'Memanggil Robot TIFA kembali ke meja barista...', 'user');
  setRouteToGoal(BARISTA_DOCK_POS);
}

function startBaristaMultiTableDelivery() {
  const chosenTables = Array.from(state.selectedDestTables);
  if (chosenTables.length === 0) {
    appendChat('Barista', 'Pilih minimal 1 meja tujuan (Meja 1 - Meja 5) sebelum mengantar kopi!', 'warn');
    return;
  }

  const distToBarista = robotTifa.position.distanceTo(BARISTA_DOCK_POS);
  if (distToBarista > 0.65) {
    state.pendingBaristaDispatch = true;
    recallRobotToBarista();
    appendChat('Barista', `Menunggu TIFA tiba di meja barista untuk memuat ${chosenTables.length} kopi...`, 'pos');
    return;
  }

  state.recallingToBarista = false;
  state.pendingBaristaDispatch = false;
  state.respondingCustomerId = null;

  const orderedRoute = orderTablesByNearestRoute(robotTifa.position, chosenTables);
  state.deliveryQueue = [...orderedRoute];

  setTrayCupsForTables(orderedRoute);

  state.posOrders.forEach((ord) => {
    if (orderedRoute.includes(ord.table) && ord.status === 'DIPROSES') {
      ord.status = 'DIANTAR_TIFA';
    }
  });
  updatePosSystemUI();

  state.selectedDestTables.clear();
  syncBaristaSelectorUI();

  const firstTableId = state.deliveryQueue[0];
  const firstCust = customers.find((c) => c.id === firstTableId);
  const routeLabel = orderedRoute.map((id) => `Meja ${id}`).join(' -> ');

  document.getElementById('robot-state-desc').textContent =
    `Status: Mengantar Kopi (${routeLabel})`;
  appendChat('Barista', `Menaruh ${orderedRoute.length} kopi di tray untuk rute: ${routeLabel}.`, 'pos');

  speakTifa(
    `Baik, ${orderedRoute.length} pesanan kopi sudah di tray. TIFA berangkat mengantar ke ${routeLabel}.`,
    'WELCOME'
  );

  if (firstCust) {
    setRouteToGoal(firstCust.servicePos);
  }
}

// ==========================================
// 11. KONTROL ANGKAT TANGAN & DETEKSI FOV KAMERA MATA
// ==========================================
function setCustomerHandState(custId, raise) {
  const cust = customers.find((c) => c.id === custId);
  if (!cust) return;
  cust.raisingHand = raise;
  cust.badgeMesh.visible = raise;
  cust.badgeMesh.material.color.setHex(0xfbbf24);

  if (raise) {
    cust.arm.position.y = cust.restArmY + 0.44;
    cust.arm.rotation.x = -0.35;
  } else {
    cust.arm.position.y = cust.restArmY;
    cust.arm.rotation.x = 0;
  }

  const btn = document.getElementById(`btn-hand-${custId}`);
  if (btn) btn.classList.toggle('hand-active', raise);
}

function scanEyeCameraForRaisedHands() {
  const eyeStatusEl = document.getElementById('eye-cam-status');
  if (
    state.respondingCustomerId !== null ||
    state.recallingToBarista ||
    state.deliveryQueue.length > 0 ||
    state.waitingCustomerPickup !== null
  ) {
    return;
  }

  const forwardX = Math.sin(robotTifa.rotation.y);
  const forwardZ = Math.cos(robotTifa.rotation.y);
  const cosHalfFov = Math.cos(THREE.MathUtils.degToRad(48));

  let spottedCustomer = null;
  let closestDist = Infinity;

  for (const cust of customers) {
    if (!cust.raisingHand) continue;

    const dx = cust.pos.x - robotTifa.position.x;
    const dz = cust.pos.z - robotTifa.position.z;
    const dist = Math.hypot(dx, dz);

    if (dist < 9.5) {
      const dirX = dx / (dist || 0.001);
      const dirZ = dz / (dist || 0.001);
      const dot = forwardX * dirX + forwardZ * dirZ;

      if (dot >= cosHalfFov && dist < closestDist) {
        closestDist = dist;
        spottedCustomer = cust;
      }
    }
  }

  if (spottedCustomer) {
    spottedCustomer.badgeMesh.material.color.setHex(0x22c55e);
    state.respondingCustomerId = spottedCustomer.id;
    state.activeTableId = spottedCustomer.id;
    setRouteToGoal(spottedCustomer.servicePos);

    if (eyeStatusEl) eyeStatusEl.textContent = `TERDETEKSI: Meja ${spottedCustomer.id}!`;
    document.getElementById('robot-state-desc').textContent =
      `Kamera Mata: Mendeteksi Tangan di Meja ${spottedCustomer.id}!`;
  } else {
    const waitingCount = customers.filter((c) => c.raisingHand).length;
    if (eyeStatusEl) {
      eyeStatusEl.textContent =
        waitingCount > 0 ? `Memantau (${waitingCount} menunggu di luar FOV)` : 'Memantau';
    }
  }
}

// ==========================================
// 12. AI INTERAKTIF: PARSER PESANAN, STOK KOSONG & MENU TIDAK ADA
// ==========================================
function appendChat(sender, text, cls = 'bot') {
  const chatLog = document.getElementById('chat-log');
  if (!chatLog) return;
  const div = document.createElement('div');
  div.className = `msg ${cls}`;
  div.textContent = `${sender}: ${text}`;
  chatLog.appendChild(div);
  chatLog.scrollTop = chatLog.scrollHeight;
}

function parseCustomerOrder(rawText) {
  const text = rawText.toLowerCase();
  const wordNums = { satu: 1, dua: 2, tiga: 3, empat: 4, lima: 5, enam: 6, tujuh: 7, delapan: 8, sembilan: 9, sepuluh: 10 };

  const availableOrders = [];
  const outOfStockOrders = [];

  MENU_CATALOG.forEach((menu) => {
    for (const kw of menu.keywords) {
      if (text.includes(kw)) {
        let qty = 1;
        const afterRegex = new RegExp(`${kw}\\s+(\\d+|satu|dua|tiga|empat|lima)`);
        const beforeRegex = new RegExp(`(\\d+|satu|dua|tiga|empat|lima)\\s+(?:gelas|porsi|cup)?\\s*${kw}`);

        const mAfter = text.match(afterRegex);
        const mBefore = text.match(beforeRegex);
        const rawQty = mAfter ? mAfter[1] : mBefore ? mBefore[1] : null;

        if (rawQty) {
          qty = isNaN(Number(rawQty)) ? wordNums[rawQty] || 1 : Number(rawQty);
        }

        if (menu.inStock) {
          availableOrders.push({ item: menu.name, qty });
        } else {
          outOfStockOrders.push({ item: menu.name, qty });
        }
        break;
      }
    }
  });

  return { availableOrders, outOfStockOrders };
}

function detectUnlistedOrderIntent(rawText) {
  const lower = rawText.toLowerCase().trim();

  if (
    lower.includes('menu apa') ||
    lower.includes('daftar menu') ||
    lower.includes('list menu') ||
    lower === 'menu'
  ) {
    return null;
  }

  const orderVerbs = ['pesan', 'pesen', 'beli', 'order', 'mau', 'minta', 'ada', 'punya', 'jual', 'tambah', 'bungkus'];
  const unlistedFoodKeywords = [
    'boba', 'thai tea', 'taro', 'coklat', 'chocolate', 'jus', 'juice', 'jeruk', 'alpukat', 'mangga',
    'air mineral', 'aqua', 'kopi tubruk', 'espresso', 'vietnam drip', 'mocha',
    'mie', 'indomie', 'ayam', 'geprek', 'kentang', 'french fries', 'roti', 'pisang',
    'burger', 'pizza', 'bakso', 'soto', 'rendang', 'es krim', 'ice cream', 'kue', 'cake', 'donat', 'croissant', 'dimsum', 'seblak'
  ];

  const hasOrderVerb = orderVerbs.some((v) => new RegExp(`\\b${v}\\b`).test(lower));
  const matchedUnlistedWord = unlistedFoodKeywords.find((w) => lower.includes(w));

  if (!hasOrderVerb && !matchedUnlistedWord) return null;

  let cleaned = lower
    .replace(/\b(saya|aku|gue|gua|kak|tifa|tolong|dong|ya|deh|mau|ingin|pesan|pesen|beli|order|minta|ada|punya|jual|gak|ga|tidak|nggak|engga|kah|\d+|satu|dua|tiga|empat|lima|gelas|porsi|cup|piring|mangkok)\b/g, ' ')
    .replace(/[?!.,]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (cleaned.length < 2 && matchedUnlistedWord) {
    cleaned = matchedUnlistedWord;
  }
  return cleaned || 'menu tersebut';
}

function speakTifa(text, endExpression = 'WELCOME', onDoneCallback = null) {
  const isWarning = endExpression.startsWith('ANGRY') || endExpression === 'SORRY' || endExpression === 'NOT_ON_MENU';
  appendChat('TIFA', text, isWarning ? 'warn' : 'bot');

  if (!('speechSynthesis' in window)) {
    drawFaceExpression(endExpression);
    if (onDoneCallback) onDoneCallback();
    return;
  }

  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'id-ID';
  utter.rate = 1.05;

  utter.onstart = () => {
    if (!endExpression.startsWith('ANGRY')) drawFaceExpression('TALKING');
  };
  utter.onend = () => {
    drawFaceExpression(endExpression);
    if (onDoneCallback) onDoneCallback();
  };
  window.speechSynthesis.speak(utter);
}

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let activeRecognition = null;

function stopListeningVoice() {
  if (activeRecognition) {
    try {
      activeRecognition.abort();
    } catch (_) {}
    activeRecognition = null;
  }
  const micBtn = document.getElementById('btn-mic');
  if (micBtn) micBtn.textContent = 'Bicara (Mic STT)';
}

function startListeningVoice() {
  const micBtn = document.getElementById('btn-mic');
  if (!SpeechRecognition) {
    appendChat('Sistem', 'Browser tidak mendukung STT Mic, gunakan ketik / tombol Tes.', 'warn');
    return;
  }

  if (activeRecognition) {
    stopListeningVoice();
    return;
  }

  try {
    const recognition = new SpeechRecognition();
    recognition.lang = 'id-ID';
    recognition.interimResults = false;
    activeRecognition = recognition;
    recognition.start();
    if (micBtn) micBtn.textContent = 'Mendengarkan... (Klik Stop)';

    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript?.trim();
      if (transcript) {
        handleCustomerMessage(transcript);
      }
    };
    recognition.onerror = () => {
      activeRecognition = null;
      if (micBtn) micBtn.textContent = 'Bicara (Mic STT)';
    };
    recognition.onend = () => {
      activeRecognition = null;
      if (micBtn) micBtn.textContent = 'Bicara (Mic STT)';
    };
  } catch (err) {
    activeRecognition = null;
    if (micBtn) micBtn.textContent = 'Bicara (Mic STT)';
  }
}

function handleCustomerMessage(userText) {
  if (!userText || !userText.trim()) return;
  const cleanText = userText.trim();
  const lower = cleanText.toLowerCase();

  appendChat(`Pelanggan (Meja ${state.activeTableId})`, cleanText, 'user');
  state.chatActive = true;

  if (state.chatSeconds >= 20) {
    state.chatActive = false;
    state.chatSeconds = 0;
    const timerEl = document.getElementById('chat-timer-display');
    if (timerEl) timerEl.textContent = '0 / 20 dtk';
    drawFaceExpression('ANGRY_TIMEOUT');
    speakTifa('Maaf, waktu obrolan sudah terlalu lama. Saya harus melayani meja lain!', 'ANGRY_TIMEOUT');
    resumePatrolAfterTask();
    return;
  }

  const { availableOrders, outOfStockOrders } = parseCustomerOrder(cleanText);
  const availableListStr = getAvailableMenuNames().join(', ');

  // KASUS 1: Ada menu valid yang dipesan & tersedia
  if (availableOrders.length > 0) {
    const nowTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const summaryText = availableOrders.map((o) => `${o.qty} ${o.item}`).join(' dan ');

    availableOrders.forEach((o) => {
      state.posOrders.unshift({
        id: state.nextOrderId++,
        table: state.activeTableId,
        item: o.item,
        qty: o.qty,
        time: nowTime,
        status: 'DIPROSES'
      });
    });

    state.selectedDestTables.add(state.activeTableId);
    syncBaristaSelectorUI();
    updatePosSystemUI();

    appendChat('POS Kasir', `Pesanan masuk -> Meja ${state.activeTableId}: ${summaryText}`, 'pos');

    if (outOfStockOrders.length > 0) {
      const emptyNames = outOfStockOrders.map((o) => o.item).join(' dan ');
      document.getElementById('robot-state-desc').textContent =
        `Status: Sebagian Menu Kosong (${emptyNames})`;
      speakTifa(
        `Pesanan ${summaryText} sudah saya catat ke kasir. Namun mohon maaf Kak, untuk ${emptyNames} saat ini sedang kosong. Mau tambah menu lain yang tersedia seperti ${availableListStr}?`,
        'SORRY'
      );
      return;
    }

    state.chatActive = false;
    state.chatSeconds = 0;
    document.getElementById('chat-timer-display').textContent = '0 / 20 dtk';
    document.getElementById('robot-state-desc').textContent =
      'Status: Pesanan Terkirim ke Kasir -> Lanjut Patroli';

    resumePatrolAfterTask();

    speakTifa(
      `Baik Kak, pesanan ${summaryText} untuk Meja ${state.activeTableId} sudah masuk ke kasir. TIFA lanjut patroli ya!`,
      'WELCOME'
    );
    return;
  }

  // KASUS 2: Pelanggan memesan makanan/minuman yang ADA di menu tetapi stoknya LAGI KOSONG
  if (outOfStockOrders.length > 0) {
    const emptyNames = outOfStockOrders.map((o) => o.item).join(' dan ');
    document.getElementById('robot-state-desc').textContent =
      `Status: Stok ${emptyNames} Sedang Kosong!`;

    speakTifa(
      `Mohon maaf Kak, untuk ${emptyNames} saat ini sedang kosong atau habis. Menu yang masih tersedia adalah ${availableListStr}. Mau ganti pesan menu yang lain Kak?`,
      'SORRY'
    );
    return;
  }

  // KASUS 3: Pelanggan memesan makanan/minuman yang TIDAK ADA di daftar menu Tel-U Coffee
  const unlistedItem = detectUnlistedOrderIntent(cleanText);
  if (unlistedItem !== null) {
    document.getElementById('robot-state-desc').textContent =
      'Status: Menu Tidak Tersedia di Daftar!';

    speakTifa(
      `Maaf Kak, menu ${unlistedItem} tidak tersedia di daftar menu Tel-U Coffee. Menu yang tersedia saat ini adalah ${availableListStr}. Silakan pilih dari menu tersebut ya Kak!`,
      'NOT_ON_MENU'
    );
    return;
  }

  // KASUS 4: Sapaan atau pertanyaan daftar menu
  let reply = `Silakan sebutkan menu yang tersedia (${availableListStr}), misalnya: saya mau pesan kopi hitam 1.`;
  if (lower.includes('menu') || lower.includes('apa aja')) {
    reply = `Di Tel-U Coffee saat ini tersedia ${availableListStr}. Mau pesan apa Kak?`;
  } else if (lower.includes('halo') || lower.includes('hai')) {
    reply = 'Halo Kak! Ada yang bisa TIFA bantu? Silakan sebutkan pesanannya.';
  }
  speakTifa(reply, 'WELCOME');
}

setInterval(() => {
  if (state.chatActive) {
    state.chatSeconds++;
    const timerEl = document.getElementById('chat-timer-display');
    if (timerEl) timerEl.textContent = `${state.chatSeconds} / 20 dtk`;

    if (state.chatSeconds >= 20) {
      state.chatActive = false;
      state.chatSeconds = 0;
      if (timerEl) timerEl.textContent = '0 / 20 dtk';
      stopListeningVoice();
      drawFaceExpression('ANGRY_TIMEOUT');
      speakTifa('Mohon maaf, obrolan terlalu lama! Saya harus kembali bertugas.', 'ANGRY_TIMEOUT');
      resumePatrolAfterTask();
    }
  }
}, 1000);

// ==========================================
// 13. EVENT TOMBOL KONTROL UI
// ==========================================
on('menu-stock-controls', 'click', (e) => {
  const chip = e.target.closest('[data-stock-id]');
  if (!chip) return;
  const stockId = chip.getAttribute('data-stock-id');
  const menuItem = MENU_CATALOG.find((m) => m.id === stockId);
  if (!menuItem) return;

  menuItem.inStock = !menuItem.inStock;
  renderMenuStockControls();
  updateCoffeeMenuBoardTexture();

  appendChat(
    'Barista / Stok',
    `Stok ${menuItem.name} diubah menjadi: ${menuItem.inStock ? 'TERSEDIA' : 'KOSONG (HABIS)'}.`,
    menuItem.inStock ? 'pos' : 'warn'
  );
});

on('btn-recall-robot', 'click', () => {
  recallRobotToBarista();
});

on('barista-table-selector', 'click', (e) => {
  const btn = e.target.closest('[data-dest-table]');
  if (!btn) return;
  const tableId = Number(btn.getAttribute('data-dest-table'));
  if (state.selectedDestTables.has(tableId)) {
    state.selectedDestTables.delete(tableId);
  } else {
    state.selectedDestTables.add(tableId);
  }
  syncBaristaSelectorUI();
});

on('btn-load-and-deliver', 'click', () => {
  startBaristaMultiTableDelivery();
});

[1, 2, 3, 4, 5].forEach((id) => {
  on(`btn-hand-${id}`, 'click', () => {
    const cust = customers.find((c) => c.id === id);
    if (!cust) return;
    const nextState = !cust.raisingHand;
    setCustomerHandState(id, nextState);
    if (nextState) {
      document.getElementById('robot-state-desc').textContent =
        `Meja ${id} Angkat Tangan (Menunggu Kamera Mata Menghadap)`;
    }
  });
});

on('btn-mic', 'click', () => startListeningVoice());

on('btn-sample-order', 'click', () => {
  handleCustomerMessage('saya mau pesan kopi hitam 1');
});

on('btn-sample-empty', 'click', () => {
  const emptyItem = MENU_CATALOG.find((m) => !m.inStock);
  if (emptyItem) {
    handleCustomerMessage(`saya mau pesan ${emptyItem.name.toLowerCase()} 1`);
  } else {
    MENU_CATALOG[4].inStock = false;
    renderMenuStockControls();
    updateCoffeeMenuBoardTexture();
    handleCustomerMessage('saya mau pesan matcha latte 1');
  }
});

on('btn-sample-unlisted', 'click', () => {
  handleCustomerMessage('saya mau pesan boba brown sugar 1');
});

on('btn-focus-cashier', 'click', () => {
  mainCamera.position.set(1.2, 2.3, 2.6);
  controls.target.set(0.6, 1.2, 6.2);
});

on('btn-mode-task', 'click', (e) => {
  state.mode = 'TASK';
  e.target.classList.add('active');
  document.getElementById('btn-mode-direct')?.classList.remove('active');
});

on('btn-mode-direct', 'click', (e) => {
  state.mode = 'DIRECT';
  e.target.classList.add('active');
  document.getElementById('btn-mode-task')?.classList.remove('active');
});

on('btn-toggle-cruise', 'click', (e) => {
  state.cruiseActive = !state.cruiseActive;
  e.target.textContent = state.cruiseActive ? 'Hentikan Cruise Mode' : 'Mulai Cruise Mode (Patroli)';
  const desc = document.getElementById('robot-state-desc');
  if (state.cruiseActive) {
    if (
      !state.recallingToBarista &&
      state.deliveryQueue.length === 0 &&
      state.respondingCustomerId === null &&
      state.waitingCustomerPickup === null
    ) {
      setRouteToGoal(cruiseWaypoints[state.waypointIndex]);
    }
    if (desc) desc.textContent = 'Status: Cruise Mode (Patroli Tel-U Coffee)';
  } else if (
    !state.recallingToBarista &&
    state.deliveryQueue.length === 0 &&
    state.respondingCustomerId === null &&
    state.waitingCustomerPickup === null
  ) {
    state.targetPos = null;
    state.pathQueue = [];
    if (desc) desc.textContent = 'Status: Berhenti';
  }
});

on('btn-toggle-load', 'click', (e) => {
  state.manualTrayLoad = !state.manualTrayLoad;
  manualDrinkGroup.visible = state.manualTrayLoad;
  e.target.textContent = state.manualTrayLoad ? 'Hapus Muatan Manual' : 'Uji Muatan Manual';
  syncTrayUIStatus();
});

on('btn-toggle-stabilizer', 'click', (e) => {
  state.stabilizerOn = !state.stabilizerOn;
  e.target.textContent = `Stabilizer: ${state.stabilizerOn ? 'ON' : 'OFF'}`;
  e.target.classList.toggle('active', state.stabilizerOn);
});

on('btn-toggle-obstacle', 'click', (e) => {
  state.obstacleActive = !state.obstacleActive;
  obstacleMesh.visible = state.obstacleActive;
  if (state.targetPos) setRouteToGoal(state.targetPos);
  e.target.textContent = state.obstacleActive ? 'Hapus Rintangan' : 'Munculkan Rintangan di Jalur';
});

on('btn-wrong-order', 'click', () => {
  drawFaceExpression('ANGRY_WRONG_ORDER');
  const descEl = document.getElementById('robot-state-desc');
  if (descEl) descEl.textContent = 'PERINGATAN: Pelanggan Salah Ambil Pesanan!';

  if (state.waitingCustomerPickup) {
    state.waitingCustomerPickup.timer = 0;
  }

  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(520, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.35);
  } catch (_) {}

  const targetTable =
    state.waitingCustomerPickup?.tableId ||
    state.deliveryQueue[0] ||
    state.activeTableId;

  speakTifa(
    `Peringatan! Pesanan ini khusus untuk Meja ${targetTable}. Mohon kembalikan pesanan ke tray!`,
    'ANGRY_WRONG_ORDER'
  );
});

on('btn-long-chat', 'click', () => {
  state.chatActive = true;
  state.chatSeconds = 19;
});

on('chat-form', 'submit', (e) => {
  e.preventDefault();
  const input = document.getElementById('chat-input');
  if (!input || !input.value.trim()) return;
  handleCustomerMessage(input.value.trim());
  input.value = '';
});

on('btn-reset', 'click', () => {
  stopListeningVoice();
  robotTifa.position.set(0.4, 0, 4.4);
  robotTifa.rotation.y = Math.PI;
  state.cruiseActive = false;
  state.waypointIndex = 0;
  state.targetPos = null;
  state.pathQueue = [];
  state.respondingCustomerId = null;
  state.recallingToBarista = false;
  state.pendingBaristaDispatch = false;
  state.selectedDestTables.clear();
  state.deliveryQueue = [];
  state.waitingCustomerPickup = null;
  state.manualTrayLoad = false;
  manualDrinkGroup.visible = false;
  trayCupsGroup.clear();
  trayCupMeshes.clear();
  state.chatActive = false;
  state.chatSeconds = 0;
  state.posOrders = [];
  syncTrayUIStatus();
  syncBaristaSelectorUI();
  updatePosSystemUI();
  deliveredCupsGroup.clear();
  const pickupBanner = document.getElementById('pickup-banner');
  if (pickupBanner) pickupBanner.style.display = 'none';
  [1, 2, 3, 4, 5].forEach((id) => setCustomerHandState(id, false));
  document.getElementById('chat-timer-display').textContent = '0 / 20 dtk';
  document.getElementById('btn-toggle-cruise').textContent = 'Mulai Cruise Mode (Patroli)';
  document.getElementById('robot-state-desc').textContent = 'Status: Standby di Depan Kasir';
  drawFaceExpression('WELCOME');
});

// ==========================================
// 14. WEBCAM MEDIAPIPE HANDS
// ==========================================
let handLandmarker = null;
let webcamRunning = false;
let lastVideoTime = -1;
let lastHandTrigger = 0;

const videoEl = document.getElementById('webcam');
const overlayCanvas = document.getElementById('webcam-overlay');
const overlayCtx = overlayCanvas ? overlayCanvas.getContext('2d') : null;
const webcamStatus = document.getElementById('webcam-status');

async function initMediaPipe() {
  const { FilesetResolver, HandLandmarker } = await import('@mediapipe/tasks-vision');
  const vision = await FilesetResolver.forVisionTasks(
    'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm'
  );
  handLandmarker = await HandLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
      delegate: 'GPU'
    },
    runningMode: 'VIDEO',
    numHands: 1
  });
  if (webcamStatus) webcamStatus.textContent = 'Siap! Angkat tangan ke kamera';
}

on('btn-webcam-hand', 'click', async (e) => {
  const container = document.getElementById('webcam-container');
  if (!container) return;

  if (!webcamRunning) {
    container.style.display = 'block';
    e.target.textContent = 'Matikan Webcam';
    try {
      if (!handLandmarker) await initMediaPipe();
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoEl.srcObject = stream;
      webcamRunning = true;
    } catch (err) {
      if (webcamStatus) webcamStatus.textContent = 'Kamera tidak tersedia / ditolak';
    }
  } else {
    webcamRunning = false;
    container.style.display = 'none';
    e.target.textContent = 'Aktifkan Webcam (Deteksi Tangan)';
    if (videoEl && videoEl.srcObject) {
      videoEl.srcObject.getTracks().forEach((track) => track.stop());
    }
  }
});

function detectHandFromWebcam() {
  if (!webcamRunning || !handLandmarker || !videoEl || videoEl.readyState < 2) return;

  if (videoEl.currentTime !== lastVideoTime) {
    lastVideoTime = videoEl.currentTime;
    overlayCanvas.width = videoEl.videoWidth;
    overlayCanvas.height = videoEl.videoHeight;

    const results = handLandmarker.detectForVideo(videoEl, performance.now());
    overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

    if (results.landmarks && results.landmarks.length > 0) {
      const landmarks = results.landmarks[0];
      overlayCtx.fillStyle = '#22c55e';
      for (const pt of landmarks) {
        overlayCtx.beginPath();
        overlayCtx.arc(pt.x * overlayCanvas.width, pt.y * overlayCanvas.height, 4, 0, Math.PI * 2);
        overlayCtx.fill();
      }

      if (landmarks[8].y < landmarks[0].y) {
        if (webcamStatus) webcamStatus.textContent = 'Tangan Terdeteksi! Meja 2 Angkat Tangan';
        const now = Date.now();
        if (now - lastHandTrigger > 6000) {
          lastHandTrigger = now;
          setCustomerHandState(2, true);
        }
      }
    } else if (webcamStatus) {
      webcamStatus.textContent = 'Memantau area... (Angkat tangan)';
    }
  }
}

// ==========================================
// 15. COLLISION GUARD & LOOP ANIMASI
// ==========================================
const ROBOT_RADIUS = 0.44;

function resolveCircleAABB(pos, radius, cx, cz, halfW, halfD) {
  const closestX = THREE.MathUtils.clamp(pos.x, cx - halfW, cx + halfW);
  const closestZ = THREE.MathUtils.clamp(pos.z, cz - halfD, cz + halfD);
  const dx = pos.x - closestX;
  const dz = pos.z - closestZ;
  const distSq = dx * dx + dz * dz;

  if (distSq < radius * radius) {
    const dist = Math.sqrt(distSq) || 0.001;
    const overlap = radius - dist;
    pos.x += (dx / dist) * overlap;
    pos.z += (dz / dist) * overlap;
  }
}

function resolveCircleCircle(pos, radius, cx, cz, cRadius) {
  const dx = pos.x - cx;
  const dz = pos.z - cz;
  const dist = Math.hypot(dx, dz);
  const minDist = radius + cRadius;

  if (dist < minDist) {
    const safeDist = dist || 0.001;
    const overlap = minDist - safeDist;
    pos.x += (dx / safeDist) * overlap;
    pos.z += (dz / safeDist) * overlap;
  }
}

function applyCafeCollisions() {
  robotTifa.position.x = THREE.MathUtils.clamp(robotTifa.position.x, -5.5, 6.2);
  robotTifa.position.z = THREE.MathUtils.clamp(robotTifa.position.z, -7.1, 5.2);

  resolveCircleAABB(robotTifa.position, ROBOT_RADIUS, 0.4, 6.1, 4.95, 0.52);
  resolveCircleAABB(robotTifa.position, ROBOT_RADIUS, -0.6, -1.0, 2.22, 0.56);
  resolveCircleAABB(robotTifa.position, ROBOT_RADIUS, -2.6, 2.3, 0.72, 0.52);
  resolveCircleAABB(robotTifa.position, ROBOT_RADIUS, 3.6, 2.2, 0.72, 0.52);

  resolveCircleCircle(robotTifa.position, ROBOT_RADIUS, -3.6, -4.8, 0.74);
  resolveCircleCircle(robotTifa.position, ROBOT_RADIUS, 3.6, -4.8, 0.74);

  customers.forEach((c) => {
    resolveCircleCircle(robotTifa.position, ROBOT_RADIUS, c.pos.x, c.pos.z, 0.28);
  });

  if (state.obstacleActive) {
    resolveCircleAABB(
      robotTifa.position,
      ROBOT_RADIUS,
      obstacleMesh.position.x,
      obstacleMesh.position.z,
      0.4,
      0.4
    );
  }
}

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.1);
  controls.update();
  detectHandFromWebcam();
  scanEyeCameraForRaisedHands();

  let targetSpeed = 0;
  let zoneLabel = 'Area Normal';
  let angularVel = 0;

  if (state.waitingCustomerPickup !== null) {
    const pickup = state.waitingCustomerPickup;
    pickup.timer += dt;
    const cust = customers.find((c) => c.id === pickup.tableId);

    if (cust && !cust.raisingHand) {
      cust.arm.position.y = cust.restArmY + 0.24;
      cust.arm.rotation.x = -0.85;
    }

    if (pickup.timer >= pickup.duration) {
      if (cust && !cust.raisingHand) {
        cust.arm.position.y = cust.restArmY;
        cust.arm.rotation.x = 0;
      }

      removeSingleCupFromTray(pickup.tableId);
      placeDeliveredCoffeeOnTable(pickup.tableId);

      state.posOrders.forEach((ord) => {
        if (ord.table === pickup.tableId && ord.status !== 'SELESAI') {
          ord.status = 'SELESAI';
        }
      });
      updatePosSystemUI();

      appendChat(
        `Pelanggan (Meja ${pickup.tableId})`,
        `Mengambil kopi Meja ${pickup.tableId} dari tray TIFA.`,
        'user'
      );

      state.waitingCustomerPickup = null;
      const pickupBanner = document.getElementById('pickup-banner');
      if (pickupBanner) pickupBanner.style.display = 'none';

      state.deliveryQueue.shift();
      if (state.deliveryQueue.length > 0) {
        const nextTableId = state.deliveryQueue[0];
        const nextCust = customers.find((c) => c.id === nextTableId);
        const sisaLabel = state.deliveryQueue.map((id) => `Meja ${id}`).join(' -> ');

        document.getElementById('robot-state-desc').textContent =
          `Status: Lanjut Mengantar ke ${sisaLabel}`;
        speakTifa(
          `Terima kasih Kak! TIFA lanjut mengantar pesanan berikutnya ke Meja ${nextTableId}.`,
          'WELCOME'
        );
        if (nextCust) setRouteToGoal(nextCust.servicePos);
      } else {
        document.getElementById('robot-state-desc').textContent =
          'Status: Semua Pesanan Diambil -> Kembali Patroli';
        speakTifa(
          'Semua pesanan kopi sudah diambil pelanggan. TIFA lanjut patroli!',
          'WELCOME'
        );
        resumePatrolAfterTask();
      }
    }
  } else if (state.targetPos) {
    if (state.pathQueue.length === 0) {
      setRouteToGoal(state.targetPos);
    }

    while (state.pathQueue.length > 1) {
      const wp = state.pathQueue[0];
      if (Math.hypot(wp.x - robotTifa.position.x, wp.z - robotTifa.position.z) < 0.34) {
        state.pathQueue.shift();
      } else {
        break;
      }
    }

    const activeGoal = state.pathQueue[0] || state.targetPos;
    const dx = activeGoal.x - robotTifa.position.x;
    const dz = activeGoal.z - robotTifa.position.z;
    const distToFinalGoal = Math.hypot(
      state.targetPos.x - robotTifa.position.x,
      state.targetPos.z - robotTifa.position.z
    );

    if (distToFinalGoal > 0.28) {
      targetSpeed = state.mode === 'DIRECT' ? 1.15 : 0.55;
      if (hasAnyTrayLoad()) targetSpeed = Math.min(targetSpeed, 0.55);

      if (state.obstacleActive) {
        const distObs = Math.hypot(
          obstacleMesh.position.x - robotTifa.position.x,
          obstacleMesh.position.z - robotTifa.position.z
        );
        if (distObs < 2.4) {
          targetSpeed *= 0.52;
          zoneLabel = 'Menghindar Rintangan!';
        }
      }

      const targetAngle = Math.atan2(dx, dz);
      const angleDiff = Math.atan2(
        Math.sin(targetAngle - robotTifa.rotation.y),
        Math.cos(targetAngle - robotTifa.rotation.y)
      );
      angularVel = THREE.MathUtils.clamp(angleDiff * 4.5, -3.4, 3.4);
      robotTifa.rotation.y += angularVel * dt;

      if (Math.abs(angleDiff) > 0.45 && zoneLabel === 'Area Normal') {
        targetSpeed *= 0.52;
        zoneLabel = 'Tikungan (Perlambatan)';
      }

      const moveFactor = Math.abs(angleDiff) > 0.75 ? 0.04 : Math.max(0.25, Math.cos(angleDiff));
      robotTifa.position.x += Math.sin(robotTifa.rotation.y) * targetSpeed * moveFactor * dt;
      robotTifa.position.z += Math.cos(robotTifa.rotation.y) * targetSpeed * moveFactor * dt;

      applyCafeCollisions();

      if (Math.abs(angleDiff) <= 0.75) {
        const moved = robotTifa.position.distanceTo(state.lastCheckPos);
        if (moved < 0.02) {
          state.stuckTimer += dt;
          if (state.stuckTimer > 0.7) {
            state.stuckTimer = 0;
            setRouteToGoal(state.targetPos);
          }
        } else {
          state.stuckTimer = 0;
          state.lastCheckPos.copy(robotTifa.position);
        }
      }
    } else {
      state.pathQueue = [];

      if (state.recallingToBarista) {
        state.recallingToBarista = false;
        state.targetPos = null;
        robotTifa.rotation.y = 0;

        if (state.pendingBaristaDispatch) {
          startBaristaMultiTableDelivery();
        } else {
          document.getElementById('robot-state-desc').textContent =
            'Status: TIFA di Meja Barista (Siap Taruh Kopi di Tray)';
          speakTifa(
            'TIFA sudah kembali di meja barista. Silakan taruh kopi di tray dan pilih meja tujuan.',
            'WELCOME'
          );
        }
      } else if (state.deliveryQueue.length > 0) {
        const currentTableId = state.deliveryQueue[0];
        const targetCust = customers.find((c) => c.id === currentTableId);
        state.targetPos = null;

        if (targetCust) {
          robotTifa.rotation.y = Math.atan2(
            targetCust.pos.x - robotTifa.position.x,
            targetCust.pos.z - robotTifa.position.z
          );
        }

        state.waitingCustomerPickup = {
          tableId: currentTableId,
          timer: 0,
          duration: 2.0
        };

        const pickupBanner = document.getElementById('pickup-banner');
        const pickupText = document.getElementById('pickup-banner-text');
        if (pickupBanner && pickupText) {
          pickupText.textContent = `Pelanggan Meja ${currentTableId} sedang mengambil kopi di tray...`;
          pickupBanner.style.display = 'block';
        }

        document.getElementById('robot-state-desc').textContent =
          `Status: Tiba di Meja ${currentTableId} (Menunggu Pelanggan Ambil di Tray)`;

        speakTifa(
          `Permisi Kak di Meja ${currentTableId}, ini pesanan kopi Anda. Silakan ambil sendiri di tray.`,
          'WELCOME'
        );
      } else if (state.respondingCustomerId !== null) {
        const servedId = state.respondingCustomerId;
        const targetCust = customers.find((c) => c.id === servedId);
        state.respondingCustomerId = null;
        state.targetPos = null;
        setCustomerHandState(servedId, false);

        state.chatSeconds = 0;
        state.chatActive = true;
        const timerEl = document.getElementById('chat-timer-display');
        if (timerEl) timerEl.textContent = '0 / 20 dtk';

        if (targetCust) {
          robotTifa.rotation.y = Math.atan2(
            targetCust.pos.x - robotTifa.position.x,
            targetCust.pos.z - robotTifa.position.z
          );
        }

        document.getElementById('robot-state-desc').textContent =
          `Status: Mengobrol & Catat Pesanan Meja ${servedId}`;
        drawFaceExpression('WELCOME');

        speakTifa(
          `Halo Kak di Meja ${servedId}, ada yang bisa saya bantu? Silakan sebutkan pesanan Anda.`,
          'WELCOME'
        );
      } else if (state.cruiseActive) {
        state.waypointIndex = (state.waypointIndex + 1) % cruiseWaypoints.length;
        setRouteToGoal(cruiseWaypoints[state.waypointIndex]);
      } else {
        state.targetPos = null;
        document.getElementById('robot-state-desc').textContent = 'Status: Standby di Depan Kasir';
      }
    }
  }

  state.prevSpeed = state.currentSpeed;
  state.currentSpeed = THREE.MathUtils.lerp(state.currentSpeed, targetSpeed, 6 * dt);
  const accel = (state.currentSpeed - state.prevSpeed) / dt;

  const rawPitch = THREE.MathUtils.clamp(accel * 0.45, -0.35, 0.35);
  const rawRoll = THREE.MathUtils.clamp(-angularVel * 0.14, -0.35, 0.35);

  if (state.stabilizerOn) {
    trayGroup.rotation.x = THREE.MathUtils.lerp(trayGroup.rotation.x, rawPitch * 0.08, 12 * dt);
    trayGroup.rotation.z = THREE.MathUtils.lerp(trayGroup.rotation.z, rawRoll * 0.08, 12 * dt);
  } else {
    const vibration = state.currentSpeed > 0.1 ? Math.sin(clock.elapsedTime * 35) * 0.05 * state.currentSpeed : 0;
    trayGroup.rotation.x = THREE.MathUtils.lerp(trayGroup.rotation.x, rawPitch + vibration, 8 * dt);
    trayGroup.rotation.z = THREE.MathUtils.lerp(trayGroup.rotation.z, rawRoll - vibration, 8 * dt);
  }

  document.getElementById('speed-display').innerHTML = `${state.currentSpeed.toFixed(2)} <small>m/s</small>`;
  document.getElementById('zone-display').textContent = zoneLabel;

  const w = window.innerWidth;
  const h = window.innerHeight;

  renderer.setScissorTest(true);

  renderer.setViewport(0, 0, w, h);
  renderer.setScissor(0, 0, w, h);
  renderer.render(scene, mainCamera);

  renderer.setViewport(16, 16, 220, 140);
  renderer.setScissor(16, 16, 220, 140);
  renderer.render(scene, eyeCamera);

  renderer.setViewport(248, 16, 220, 140);
  renderer.setScissor(248, 16, 220, 140);
  renderer.render(scene, trayCamera);

  renderer.setScissorTest(false);
}

window.addEventListener('resize', () => {
  mainCamera.aspect = window.innerWidth / window.innerHeight;
  mainCamera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();