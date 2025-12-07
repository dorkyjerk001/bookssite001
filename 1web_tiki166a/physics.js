html

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Tikki from Miraculous Ladybug</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700&display=swap');
    html, body {
      margin: 0; padding: 0;
      height: 100%;
      background: radial-gradient(circle at center, #0b0b1a 0%, #000000 90%);
      font-family: 'Orbitron', monospace, sans-serif;
      color: #ff2a2a;
      user-select: none;
      overflow: hidden;
    }
    h1 {
      font-size: 3rem;
      text-shadow:
        0 0 10px #ff1a1a,
        0 0 20px #ff4d4d,
        0 0 40px #ff6600;
      margin: 2rem 0 1rem 0;
      text-align: center;
      z-index: 2;
      position: relative;
    }
    #physics-canvas {
      display: block;
      margin: 0 auto;
      background: transparent;
      z-index: 1;
      position: absolute;
      top: 0; left: 0;
    }
    /* Fullscreen modal */
    #modal {
      position: fixed;
      top: 0; left: 0;
      width: 100vw; height: 100vh;
      background: rgba(0,0,0,0.95);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      cursor: zoom-out;
    }
    #modal.active {
      display: flex;
    }
    #modal img {
      max-width: 90vw;
      max-height: 90vh;
      border-radius: 20px;
      box-shadow:
        0 0 60px #ff6600aa;
      transition: transform 0.3s ease;
    }
    /* Hide scrollbars */
    ::-webkit-scrollbar { width: 0 !important }
    body { -ms-overflow-style: none; scrollbar-width: none; }
  </style>
</head>
<body>
  <h1>Tikki from Miraculous Ladybug</h1>
  <canvas id="physics-canvas"></canvas>
  <div id="modal" role="dialog" aria-modal="true" aria-label="Fullscreen image viewer" tabindex="-1">
    <img src="" alt="" />
  </div>
  <!-- Matter.js from CDN -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.19.0/matter.min.js"></script>
  <!-- Your physics logic -->
  <script src="physics.js"></script>
</body>
</html>

2. physics.js
javascript

// === CONFIGURATION ===
const images = [
  { src: '1screen001.jpg', alt: 'Tikki action shot' },
  { src: '1totem001.jpg', alt: 'Tikki close up' }
];
const IMG_SIZE = 220; // px, square for physics
const AIR_RESISTANCE = 0.02;
const FRICTION = 0.3;
const WALL_THICKNESS = 100;
const TURBULENCE_FORCE = 0.002;
const TURBULENCE_TORQUE = 0.0008;

// === SETUP CANVAS ===
const canvas = document.getElementById('physics-canvas');
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// === MATTER.JS SETUP ===
const { Engine, Render, Runner, World, Bodies, Body, Events, Mouse, MouseConstraint, Composite } = Matter;

const engine = Engine.create();
const world = engine.world;
world.gravity.y = 0.7; // gentle gravity

// We'll use our own renderer for images, so no need for Matter.Render
const runner = Runner.create();
Runner.run(runner, engine);

// === WALLS ===
function createWalls() {
  const w = canvas.width, h = canvas.height, t = WALL_THICKNESS;
  return [
    // left, right, top, bottom
    Bodies.rectangle(-t/2, h/2, t, h, { isStatic: true }),
    Bodies.rectangle(w + t/2, h/2, t, h, { isStatic: true }),
    Bodies.rectangle(w/2, -t/2, w, t, { isStatic: true }),
    Bodies.rectangle(w/2, h + t/2, w, t, { isStatic: true })
  ];
}
let walls = createWalls();
World.add(world, walls);

window.addEventListener('resize', () => {
  // Remove old walls
  World.remove(world, walls);
  // Add new walls
  walls = createWalls();
  World.add(world, walls);
});

// === IMAGE BODIES ===
const imageBodies = [];
const loadedImages = [];
let loadedCount = 0;

images.forEach((img, i) => {
  const image = new window.Image();
  image.src = img.src;
  image.alt = img.alt;
  loadedImages.push(image);
  image.onload = () => {
    loadedCount++;
    if (loadedCount === images.length) {
      initBodies();
      requestAnimationFrame(renderLoop);
    }
  };
});

function initBodies() {
  // Place images in a row, centered
  const startX = canvas.width/2 - ((images.length-1) * (IMG_SIZE+30))/2;
  for (let i = 0; i < images.length; i++) {
    const x = startX + i * (IMG_SIZE + 30);
    const y = canvas.height/2;
    const body = Bodies.rectangle(x, y, IMG_SIZE, IMG_SIZE, {
      restitution: 0.7,
      friction: FRICTION,
      frictionAir: AIR_RESISTANCE,
      angle: Math.random() * Math.PI * 2,
      inertia: Infinity // We'll set this below for realism
    });
    body.label = 'image';
    body.imgIndex = i;
    Body.setInertia(body, Body._inertiaScale * (IMG_SIZE * IMG_SIZE) / 6); // square inertia
    imageBodies.push(body);
  }
  World.add(world, imageBodies);
}

// === MOUSE DRAG ===
const mouse = Mouse.create(canvas);
const mouseConstraint = MouseConstraint.create(engine, {
  mouse: mouse,
  constraint: {
    stiffness: 0.2,
    render: { visible: false }
  },
  collisionFilter: { mask: 0xFFFFFFFF }
});
World.add(world, mouseConstraint);

// === MODAL LOGIC ===
const modal = document.getElementById('modal');
const modalImg = modal.querySelector('img');
function openModal(img) {
  modalImg.src = img.src;
  modalImg.alt = img.alt;
  modal.classList.add('active');
  modal.focus();
}
modal.addEventListener('click', e => {
  if (e.target === modal) {
    modal.classList.remove('active');
    modalImg.src = '';
    modalImg.alt = '';
  }
});
window.addEventListener('keydown', e => {
  if (modal.classList.contains('active') && (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ')) {
    modal.classList.remove('active');
    modalImg.src = '';
    modalImg.alt = '';
  }
});

// === IMAGE CLICK HANDLING ===
canvas.addEventListener('mousedown', function(e) {
  // On click, check if an image is under the mouse and open modal
  const mousePos = mouse.position;
  for (let i = 0; i < imageBodies.length; i++) {
    const body = imageBodies[i];
    if (Matter.Bounds.contains(body.bounds, mousePos)) {
      // More precise: check rotated rectangle
      const dx = mousePos.x - body.position.x;
      const dy = mousePos.y - body.position.y;
      const angle = -body.angle;
      const rx = dx * Math.cos(angle) - dy * Math.sin(angle);
      const ry = dx * Math.sin(angle) + dy * Math.cos(angle);
      if (Math.abs(rx) < IMG_SIZE/2 && Math.abs(ry) < IMG_SIZE/2) {
        openModal(loadedImages[body.imgIndex]);
        break;
      }
    }
  }
});

// === TURBULENCE ===
let turbulenceOn = true;
function applyTurbulence() {
  if (!turbulenceOn) return;
  for (const body of imageBodies) {
    const fx = (Math.random() - 0.5) * TURBULENCE_FORCE * body.mass;
    const fy = (Math.random() - 0.5) * TURBULENCE_FORCE * body.mass;
    const torque = (Math.random() - 0.5) * TURBULENCE_TORQUE * body.mass;
    Body.applyForce(body, body.position, { x: fx, y: fy });
    Body.setAngularVelocity(body, body.angularVelocity + torque);
  }
}
Events.on(engine, 'beforeUpdate', applyTurbulence);

// === KEYBOARD CONTROLS ===
window.addEventListener('keydown', e => {
  if (modal.classList.contains('active')) return;
  if (e.code === 'Space') {
    // Apply upward force to all images
    for (const body of imageBodies) {
      Body.applyForce(body, body.position, { x: 0, y: -0.05 * body.mass });
    }
  }
  if (e.key.toLowerCase() === 'r') {
    // Reset positions
    const startX = canvas.width/2 - ((images.length-1) * (IMG_SIZE+30))/2;
    for (let i = 0; i < imageBodies.length; i++) {
      Body.setPosition(imageBodies[i], { x: startX + i * (IMG_SIZE + 30), y: canvas.height/2 });
      Body.setVelocity(imageBodies[i], { x: 0, y: 0 });
      Body.setAngularVelocity(imageBodies[i], 0);
      Body.setAngle(imageBodies[i], Math.random() * Math.PI * 2);
    }
  }
  if (e.key.toLowerCase() === 't') {
    turbulenceOn = !turbulenceOn;
  }
});

// === RENDER LOOP ===
function renderLoop() {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw images
  for (const body of imageBodies) {
    const img = loadedImages[body.imgIndex];
    ctx.save();
    ctx.translate(body.position.x, body.position.y);
    ctx.rotate(body.angle);
    ctx.drawImage(
      img,
      -IMG_SIZE/2, -IMG_SIZE/2,
      IMG_SIZE, IMG_SIZE
    );
    // Optional: draw border
    ctx.strokeStyle = '#ff6600';
    ctx.lineWidth = 4;
    ctx.strokeRect(-IMG_SIZE/2, -IMG_SIZE/2, IMG_SIZE, IMG_SIZE);
    ctx.restore();
  }

  requestAnimationFrame(renderLoop);
}