import * as THREE from 'three';

// ==================== CONFIGURACIÓN ====================
const CELL_SIZE = 4;
const WALL_HEIGHT = 4;
const PLAYER_HEIGHT = 1.6;
const PLAYER_RADIUS = 0.35;
const MOVE_SPEED = 0.1;
const ROT_SPEED = 0.04;
const MOUSE_SENSITIVITY = 0.002;

// ==================== NIVELES ====================
const LEVELS = [
    { // Nivel 1 - Fácil (11x11)
        name: 'El Jardín Perdido',
        maze: [
            [1,1,1,1,1,1,1,1,1,1,1],
            [1,2,0,0,1,0,0,0,0,0,1],
            [1,0,1,0,1,0,1,1,1,0,1],
            [1,0,1,0,0,0,0,0,1,0,1],
            [1,0,1,1,1,1,1,0,1,0,1],
            [1,0,0,0,0,0,1,0,0,0,1],
            [1,1,1,0,1,0,1,1,1,0,1],
            [1,0,0,0,1,0,0,0,1,0,1],
            [1,0,1,1,1,1,1,0,1,0,1],
            [1,0,0,0,0,0,0,0,0,3,1],
            [1,1,1,1,1,1,1,1,1,1,1],
        ],
        fog: 0.035,
        wallColor: { r: 130, g: 60, b: 20 },
        floorColor: '#555',
        goalColor: 0x00ff88,
    },
    { // Nivel 2 - Medio (15x15)
        name: 'Catacumbas Oscuras',
        maze: [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,2,0,0,1,0,0,0,1,0,0,0,0,0,1],
            [1,0,1,0,1,0,1,0,1,0,1,1,1,0,1],
            [1,0,1,0,0,0,1,0,0,0,0,0,1,0,1],
            [1,0,1,1,1,1,1,0,1,1,1,0,1,0,1],
            [1,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
            [1,1,1,0,1,1,1,1,1,0,1,1,1,0,1],
            [1,0,0,0,1,0,0,0,1,0,0,0,0,0,1],
            [1,0,1,1,1,0,1,0,1,1,1,1,1,1,1],
            [1,0,1,0,0,0,1,0,0,0,0,0,0,0,1],
            [1,0,1,0,1,1,1,1,1,0,1,1,1,0,1],
            [1,0,0,0,1,0,0,0,0,0,1,0,0,0,1],
            [1,1,1,0,1,0,1,1,1,1,1,0,1,1,1],
            [1,0,0,0,0,0,1,0,0,0,0,0,0,3,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        ],
        fog: 0.05,
        wallColor: { r: 80, g: 80, b: 90 },
        floorColor: '#3a3a3a',
        goalColor: 0xff8800,
    },
    { // Nivel 3 - Difícil (19x19)
        name: 'La Fortaleza Final',
        maze: [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,2,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,1],
            [1,0,0,1,0,1,0,1,0,1,0,1,0,1,1,1,1,0,1],
            [1,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,1],
            [1,0,0,1,1,1,1,1,0,1,1,1,0,1,0,1,1,1,1],
            [1,0,1,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,1],
            [1,0,1,0,1,1,0,1,1,1,0,1,1,1,1,1,1,0,1],
            [1,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,1,0,1],
            [1,1,1,0,1,0,1,1,0,1,0,1,1,1,1,0,1,0,1],
            [1,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,1],
            [1,0,1,1,1,1,1,0,1,1,1,1,0,1,1,1,1,1,1],
            [1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1],
            [1,1,1,1,1,0,1,1,1,1,0,1,1,1,0,1,1,0,1],
            [1,0,0,0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1],
            [1,0,1,0,1,1,1,1,0,1,1,1,1,1,1,1,0,1,1],
            [1,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
            [1,0,1,1,1,0,1,1,1,1,0,1,1,1,1,1,1,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        ],
        fog: 0.06,
        wallColor: { r: 60, g: 30, b: 30 },
        floorColor: '#2a2020',
        goalColor: 0xff2266,
    },
];

// ==================== ESTADO DEL JUEGO ====================
let scene, camera, renderer;
let gameRunning = false;
let gameWon = false;
let startTime = 0;
let playerAngle = 0;
let goalMesh;
let minimapCanvas, minimapCtx;
let currentLevel = 0;
let currentMaze = null;
let inputMode = 'keyboard'; // 'keyboard' o 'xbox'

const player = { x: 0, z: 0 };
const keys = {};
let goalPos = { x: 0, z: 0 };

// ==================== TEXTURAS PROCEDURALES ====================
function createBrickTexture(wallColor) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#7a7a7a';
    ctx.fillRect(0, 0, 256, 256);

    const brickW = 64, brickH = 32, mortar = 3;
    for (let row = 0; row < 8; row++) {
        const offset = (row % 2) * (brickW / 2);
        for (let col = -1; col < 5; col++) {
            const x = col * brickW + offset;
            const y = row * brickH;
            const r = wallColor.r + Math.random() * 40 - 20;
            const g = wallColor.g + Math.random() * 20 - 10;
            const b = wallColor.b + Math.random() * 20 - 10;
            ctx.fillStyle = `rgb(${r},${g},${b})`;
            ctx.fillRect(x + mortar, y + mortar, brickW - mortar * 2, brickH - mortar * 2);
            for (let i = 0; i < 15; i++) {
                ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.12})`;
                ctx.fillRect(
                    x + mortar + Math.random() * (brickW - mortar * 2),
                    y + mortar + Math.random() * (brickH - mortar * 2), 2, 2
                );
            }
        }
    }

    ctx.fillStyle = '#999';
    for (let row = 0; row <= 8; row++) {
        ctx.fillRect(0, row * brickH, 256, mortar);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    return tex;
}

function createFloorTexture(baseColor) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, 256, 256);

    const tile = 64;
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            const g = 70 + Math.random() * 30;
            ctx.fillStyle = `rgb(${g},${g + 5},${g})`;
            ctx.fillRect(c * tile + 2, r * tile + 2, tile - 4, tile - 4);
            for (let i = 0; i < 20; i++) {
                ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.15})`;
                ctx.fillRect(
                    c * tile + 2 + Math.random() * (tile - 4),
                    r * tile + 2 + Math.random() * (tile - 4), 3, 3
                );
            }
        }
    }

    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    for (let i = 0; i <= 4; i++) {
        ctx.beginPath(); ctx.moveTo(i * tile, 0); ctx.lineTo(i * tile, 256); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i * tile); ctx.lineTo(256, i * tile); ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    return tex;
}

function createCeilingTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 80; i++) {
        ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.08})`;
        ctx.fillRect(Math.random() * 256, Math.random() * 256, 4, 4);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    return tex;
}

// ==================== INICIALIZACIÓN ====================
function initLevel(levelIndex) {
    const level = LEVELS[levelIndex];
    currentMaze = level.maze;
    currentLevel = levelIndex;

    // Limpiar escena anterior
    if (scene) {
        while (scene.children.length > 0) scene.remove(scene.children[0]);
    } else {
        scene = new THREE.Scene();
    }
    scene.background = new THREE.Color(0x0a0a0a);
    scene.fog = new THREE.FogExp2(0x0a0a0a, level.fog);

    if (!camera) {
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
        camera.rotation.order = 'YXZ';
    }

    if (!renderer) {
        renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('game-canvas'), antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
    }

    // Luz ambiental tenue
    scene.add(new THREE.AmbientLight(0x222222));

    // Linterna del jugador
    const flashlight = new THREE.SpotLight(0xffffcc, 3, CELL_SIZE * 10, Math.PI / 5, 0.4, 1);
    flashlight.position.set(0, 0, 0);
    const target = new THREE.Object3D();
    target.position.set(0, -0.2, -1);
    camera.add(flashlight);
    camera.add(target);
    flashlight.target = target;
    scene.add(camera);

    // Construir laberinto
    const brickTex = createBrickTexture(level.wallColor);
    const floorTex = createFloorTexture(level.floorColor);
    const ceilingTex = createCeilingTexture();
    buildMaze(brickTex, floorTex, ceilingTex);

    // Encontrar inicio y meta
    let startPos = null;
    for (let r = 0; r < currentMaze.length; r++) {
        for (let c = 0; c < currentMaze[r].length; c++) {
            if (currentMaze[r][c] === 2) startPos = { x: c * CELL_SIZE + CELL_SIZE / 2, z: r * CELL_SIZE + CELL_SIZE / 2 };
            if (currentMaze[r][c] === 3) goalPos = { x: c * CELL_SIZE + CELL_SIZE / 2, z: r * CELL_SIZE + CELL_SIZE / 2 };
        }
    }

    // Posición del jugador
    player.x = startPos.x;
    player.z = startPos.z;
    playerAngle = Math.PI;
    camera.position.set(player.x, PLAYER_HEIGHT, player.z);
    camera.rotation.y = playerAngle;

    // Esfera de meta (brillante)
    const goalGeo = new THREE.SphereGeometry(0.5, 32, 32);
    const goalMat = new THREE.MeshStandardMaterial({ color: level.goalColor, emissive: level.goalColor, emissiveIntensity: 0.7 });
    goalMesh = new THREE.Mesh(goalGeo, goalMat);
    goalMesh.position.set(goalPos.x, 1.5, goalPos.z);
    scene.add(goalMesh);

    // Luz en la meta
    const goalLight = new THREE.PointLight(level.goalColor, 3, CELL_SIZE * 4);
    goalLight.position.set(goalPos.x, 2.5, goalPos.z);
    scene.add(goalLight);

    // Partículas de la meta
    const particlesGeo = new THREE.BufferGeometry();
    const pCount = 40;
    const pPositions = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
        const angle = (i / pCount) * Math.PI * 2;
        pPositions[i * 3] = goalPos.x + Math.cos(angle) * 1.2;
        pPositions[i * 3 + 1] = 1.5;
        pPositions[i * 3 + 2] = goalPos.z + Math.sin(angle) * 1.2;
    }
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    const particlesMat = new THREE.PointsMaterial({ color: level.goalColor, size: 0.12 });
    scene.add(new THREE.Points(particlesGeo, particlesMat));

    // Minimap
    minimapCanvas = document.getElementById('minimap');
    minimapCtx = minimapCanvas.getContext('2d');

    // Mostrar nombre del nivel
    document.getElementById('level-name').textContent = `Nivel ${levelIndex + 1}: ${level.name}`;

    startTime = Date.now();
}

function buildMaze(brickTex, floorTex, ceilingTex) {
    const rows = currentMaze.length;
    const cols = currentMaze[0].length;

    // Suelo
    floorTex.repeat.set(cols * 2, rows * 2);
    const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(cols * CELL_SIZE, rows * CELL_SIZE),
        new THREE.MeshStandardMaterial({ map: floorTex, roughness: 0.9 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(cols * CELL_SIZE / 2, 0, rows * CELL_SIZE / 2);
    scene.add(floor);

    // Techo
    ceilingTex.repeat.set(cols * 2, rows * 2);
    const ceiling = new THREE.Mesh(
        new THREE.PlaneGeometry(cols * CELL_SIZE, rows * CELL_SIZE),
        new THREE.MeshStandardMaterial({ map: ceilingTex, roughness: 1 })
    );
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.set(cols * CELL_SIZE / 2, WALL_HEIGHT, rows * CELL_SIZE / 2);
    scene.add(ceiling);

    // Muros
    const wallGeo = new THREE.BoxGeometry(CELL_SIZE, WALL_HEIGHT, CELL_SIZE);
    const wallMat = new THREE.MeshStandardMaterial({ map: brickTex, roughness: 0.8 });

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (currentMaze[r][c] === 1) {
                const wall = new THREE.Mesh(wallGeo, wallMat);
                wall.position.set(c * CELL_SIZE + CELL_SIZE / 2, WALL_HEIGHT / 2, r * CELL_SIZE + CELL_SIZE / 2);
                scene.add(wall);
            }
        }
    }
}

// ==================== CONTROLES ====================

// Teclado
window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) e.preventDefault();
    if (e.key === 'Escape' && gameRunning) returnToMenu();
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Mouse (pointer lock para mirar) — solo en modo laptop
document.addEventListener('click', (e) => {
    if (gameRunning && !gameWon && e.target.id === 'game-canvas' && inputMode === 'keyboard') {
        document.getElementById('game-canvas').requestPointerLock();
    }
});

document.addEventListener('mousemove', (e) => {
    if (inputMode === 'keyboard' && document.pointerLockElement === document.getElementById('game-canvas')) {
        playerAngle -= e.movementX * MOUSE_SENSITIVITY;
    }
});

// Gamepad
function processGamepad() {
    if (inputMode !== 'xbox') return { dx: 0, dz: 0 };

    const gamepads = navigator.getGamepads();
    if (!gamepads[0]) return { dx: 0, dz: 0 };

    const gp = gamepads[0];
    const fwd = { x: -Math.sin(playerAngle), z: -Math.cos(playerAngle) };
    const right = { x: Math.cos(playerAngle), z: -Math.sin(playerAngle) };
    let dx = 0, dz = 0;

    // Stick izquierdo: moverse
    if (Math.abs(gp.axes[1]) > 0.15) {
        dx -= fwd.x * gp.axes[1] * MOVE_SPEED;
        dz -= fwd.z * gp.axes[1] * MOVE_SPEED;
    }
    if (Math.abs(gp.axes[0]) > 0.15) {
        dx += right.x * gp.axes[0] * MOVE_SPEED;
        dz += right.z * gp.axes[0] * MOVE_SPEED;
    }

    // Stick derecho: girar (ejes 2 y 3 en Xbox)
    if (gp.axes.length > 2 && Math.abs(gp.axes[2]) > 0.15) {
        playerAngle -= gp.axes[2] * ROT_SPEED;
    }

    // Botón B (1): volver al menú
    if (gp.buttons[1] && gp.buttons[1].pressed) {
        returnToMenu();
    }
    // Botón Start/Menu (9)
    if (gp.buttons[9] && gp.buttons[9].pressed) {
        returnToMenu();
    }

    return { dx, dz };
}

// ==================== COLISIONES ====================
function isWall(x, z) {
    const col = Math.floor(x / CELL_SIZE);
    const row = Math.floor(z / CELL_SIZE);
    if (row < 0 || row >= currentMaze.length || col < 0 || col >= currentMaze[0].length) return true;
    return currentMaze[row][col] === 1;
}

function tryMove(dx, dz) {
    const nx = player.x + dx;
    if (!isWall(nx - PLAYER_RADIUS, player.z - PLAYER_RADIUS) &&
        !isWall(nx + PLAYER_RADIUS, player.z - PLAYER_RADIUS) &&
        !isWall(nx - PLAYER_RADIUS, player.z + PLAYER_RADIUS) &&
        !isWall(nx + PLAYER_RADIUS, player.z + PLAYER_RADIUS)) {
        player.x = nx;
    }
    const nz = player.z + dz;
    if (!isWall(player.x - PLAYER_RADIUS, nz - PLAYER_RADIUS) &&
        !isWall(player.x + PLAYER_RADIUS, nz - PLAYER_RADIUS) &&
        !isWall(player.x - PLAYER_RADIUS, nz + PLAYER_RADIUS) &&
        !isWall(player.x + PLAYER_RADIUS, nz + PLAYER_RADIUS)) {
        player.z = nz;
    }
}

// ==================== LÓGICA POR FRAME ====================
function updateMovement() {
    if (!gameRunning || gameWon) return;

    const fwd = { x: -Math.sin(playerAngle), z: -Math.cos(playerAngle) };
    const right = { x: Math.cos(playerAngle), z: -Math.sin(playerAngle) };
    let dx = 0, dz = 0;

    if (inputMode === 'keyboard') {
        // WASD: adelante/atrás/strafe
        if (keys['w'] || keys['W'] || keys['ArrowUp']) { dx += fwd.x * MOVE_SPEED; dz += fwd.z * MOVE_SPEED; }
        if (keys['s'] || keys['S'] || keys['ArrowDown']) { dx -= fwd.x * MOVE_SPEED; dz -= fwd.z * MOVE_SPEED; }
        if (keys['a'] || keys['A']) { dx -= right.x * MOVE_SPEED; dz -= right.z * MOVE_SPEED; }
        if (keys['d'] || keys['D']) { dx += right.x * MOVE_SPEED; dz += right.z * MOVE_SPEED; }

        // Flechas izq/der: rotar
        if (keys['ArrowLeft']) playerAngle += ROT_SPEED;
        if (keys['ArrowRight']) playerAngle -= ROT_SPEED;
    }

    // Gamepad
    const gp = processGamepad();
    dx += gp.dx;
    dz += gp.dz;

    tryMove(dx, dz);

    camera.position.set(player.x, PLAYER_HEIGHT, player.z);
    camera.rotation.y = playerAngle;
}

function checkGoal() {
    if (gameWon) return;
    const dist = Math.sqrt((player.x - goalPos.x) ** 2 + (player.z - goalPos.z) ** 2);
    if (dist < 1.2) {
        gameWon = true;
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        document.getElementById('win-time').textContent = elapsed;
        document.getElementById('win-level-name').textContent = LEVELS[currentLevel].name;

        // Mostrar botón de siguiente nivel solo si no es el último
        const nextBtn = document.getElementById('btn-next-level');
        if (currentLevel < LEVELS.length - 1) {
            nextBtn.style.display = 'inline-block';
            nextBtn.textContent = `NIVEL ${currentLevel + 2} →`;
        } else {
            nextBtn.style.display = 'none';
        }

        document.getElementById('win-screen').style.display = 'flex';
        document.getElementById('hit-sound').play();
        if (document.pointerLockElement) document.exitPointerLock();
    }
}

// ==================== MINIMAP ====================
function drawMinimap() {
    if (!minimapCtx || !currentMaze) return;
    const rows = currentMaze.length;
    const cols = currentMaze[0].length;
    const cellPx = minimapCanvas.width / Math.max(rows, cols);

    minimapCtx.fillStyle = 'rgba(0,0,0,0.8)';
    minimapCtx.fillRect(0, 0, minimapCanvas.width, minimapCanvas.height);

    const level = LEVELS[currentLevel];
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (currentMaze[r][c] === 1) {
                minimapCtx.fillStyle = '#555';
            } else if (currentMaze[r][c] === 3) {
                minimapCtx.fillStyle = '#' + level.goalColor.toString(16).padStart(6, '0');
            } else {
                minimapCtx.fillStyle = '#1a1a1a';
            }
            minimapCtx.fillRect(c * cellPx, r * cellPx, cellPx - 0.5, cellPx - 0.5);
        }
    }

    // Jugador
    const px = (player.x / CELL_SIZE) * cellPx;
    const pz = (player.z / CELL_SIZE) * cellPx;

    minimapCtx.fillStyle = '#ffcc00';
    minimapCtx.beginPath();
    minimapCtx.arc(px, pz, 3, 0, Math.PI * 2);
    minimapCtx.fill();

    // Dirección
    minimapCtx.strokeStyle = '#ffcc00';
    minimapCtx.lineWidth = 2;
    minimapCtx.beginPath();
    minimapCtx.moveTo(px, pz);
    minimapCtx.lineTo(px - Math.sin(playerAngle) * 10, pz - Math.cos(playerAngle) * 10);
    minimapCtx.stroke();
}

// ==================== TIMER ====================
function updateTimer() {
    if (!gameRunning || gameWon) return;
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    document.getElementById('timer').textContent = elapsed + 's';
}

// ==================== LOOP PRINCIPAL ====================
function animate() {
    if (!gameRunning) return;
    requestAnimationFrame(animate);

    updateMovement();
    checkGoal();
    drawMinimap();
    updateTimer();

    if (goalMesh) {
        goalMesh.rotation.y += 0.02;
        goalMesh.position.y = 1.5 + Math.sin(Date.now() * 0.003) * 0.3;
    }

    renderer.render(scene, camera);
}

// ==================== UI ====================

// Selección de dispositivo
window.selectDevice = (mode) => {
    inputMode = mode;
    document.getElementById('device-select').style.display = 'none';
    document.getElementById('main-menu').style.display = 'block';

    // Actualizar controles visibles
    document.getElementById('controls-keyboard').style.display = mode === 'keyboard' ? 'block' : 'none';
    document.getElementById('controls-xbox').style.display = mode === 'xbox' ? 'block' : 'none';

    // Actualizar hint del HUD
    document.getElementById('hud-hint').textContent = mode === 'keyboard'
        ? 'Click para capturar el mouse | ESC para salir'
        : 'Usa el control de Xbox | B para menú';
};

// Iniciar juego con nivel seleccionado
window.startLevel = (levelIndex) => {
    document.getElementById('ui-layer').style.display = 'none';
    document.getElementById('win-screen').style.display = 'none';
    document.getElementById('hud').style.display = 'block';
    gameRunning = true;
    gameWon = false;
    initLevel(levelIndex);
    animate();
};

// Siguiente nivel
window.nextLevel = () => {
    if (currentLevel < LEVELS.length - 1) {
        document.getElementById('win-screen').style.display = 'none';
        document.getElementById('hud').style.display = 'block';
        gameRunning = true;
        gameWon = false;
        initLevel(currentLevel + 1);
        animate();
    }
};

// Reiniciar nivel actual
window.restartLevel = () => {
    document.getElementById('win-screen').style.display = 'none';
    document.getElementById('hud').style.display = 'block';
    gameRunning = true;
    gameWon = false;
    initLevel(currentLevel);
    animate();
};

function returnToMenu() {
    gameRunning = false;
    gameWon = false;
    document.getElementById('ui-layer').style.display = 'flex';
    document.getElementById('win-screen').style.display = 'none';
    document.getElementById('hud').style.display = 'none';
    if (document.pointerLockElement) document.exitPointerLock();
}
window.returnToMenu = returnToMenu;

// Volver a la selección del dispositivo
window.backToDeviceSelect = () => {
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('device-select').style.display = 'block';
};

window.addEventListener('resize', () => {
    if (!camera || !renderer) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});