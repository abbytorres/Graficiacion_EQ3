import * as THREE from 'three';

let scene, camera, renderer, avatar, obstacle;
let gameRunning = false;
const clock = new THREE.Clock();

function init() {
    // 1. Escena y Cámara (Perspectiva)
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 10);
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('game-canvas'), antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // 2. Luces
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 10, 7.5);
    scene.add(light, new THREE.AmbientLight(0x404040));

    // 3. Suelo con Textura (Material)
    const loader = new THREE.TextureLoader();
    const groundTexture = loader.load('https://threejs.org/examples/textures/grid.png');
    const groundMat = new THREE.MeshPhongMaterial({ map: groundTexture });
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(50, 50), groundMat);
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    // 4. Avatar
    const avatarGeo = new THREE.BoxGeometry(1, 1, 1);
    const avatarMat = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    avatar = new THREE.Mesh(avatarGeo, avatarMat);
    avatar.position.y = 0.5;
    scene.add(avatar);

    // 5. Obstáculo (Para colisiones)
    const obsGeo = new THREE.SphereGeometry(1, 32, 32);
    const obsMat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    obstacle = new THREE.Mesh(obsGeo, obsMat);
    obstacle.position.set(0, 1, -5);
    scene.add(obstacle);

    animate();
}

// Control de Xbox (Gamepad API)
function updateGamepad() {
    const gamepads = navigator.getGamepads();
    if (!gamepads[0]) return;

    const gp = gamepads[0];
    const speed = 0.15;

    // Sticks analógicos (Ejes 0 y 1)
    if (Math.abs(gp.axes[0]) > 0.1) avatar.position.x += gp.axes[0] * speed;
    if (Math.abs(gp.axes[1]) > 0.1) avatar.position.z += gp.axes[1] * speed;

    // Botón para volver al menú (Ejemplo: Botón "B" o Start)
    if (gp.buttons[1].pressed || gp.buttons[9].pressed) {
        returnToMenu();
    }
}
/**
 * Funcion para pro controller
 * function updateGamepad() {
    const gamepads = navigator.getGamepads();
    const gp = gamepads[0]; // Tomamos el primer control detectado

    if (!gp) return;

    const speed = 0.15;
    const threshold = 0.2; // Aumentamos un poco el umbral para evitar "drift"

    // Eje Horizontal (Stick Izquierdo)
    if (Math.abs(gp.axes[0]) > threshold) {
        avatar.position.x += gp.axes[0] * speed;
    }

    // Eje Vertical (Stick Izquierdo)
    if (Math.abs(gp.axes[1]) > threshold) {
        avatar.position.z += gp.axes[1] * speed;
    }

    // Botones (Mapeo Estándar)
    // En Switch, gp.buttons[0] suele ser el botón 'B' (posición inferior)
    // y gp.buttons[1] es el botón 'A' (posición derecha)
    if (gp.buttons[0].pressed) {
        console.log("Presionaste el botón de acción");
    }

    // Botón '+' o Home para regresar al menú
    if (gp.buttons[9].pressed || gp.buttons[16].pressed) {
        returnToMenu();
    }
}
 */
function checkCollisions() {
    const avatarBox = new THREE.Box3().setFromObject(avatar);
    const obstacleBox = new THREE.Box3().setFromObject(obstacle);

    if (avatarBox.intersectsBox(obstacleBox)) {
        document.getElementById('hit-sound').play();
        avatar.position.set(0, 0.5, 0); // Reset posición tras choque
    }
}

function animate() {
    if (!gameRunning) return;
    requestAnimationFrame(animate);
    
    updateGamepad();
    checkCollisions();
    
    renderer.render(scene, camera);
}

// Funciones de UI
window.startGame = () => {
    document.getElementById('ui-layer').style.display = 'none';
    gameRunning = true;
    if (!scene) init();
    animate();
};

function returnToMenu() {
    gameRunning = false;
    document.getElementById('ui-layer').style.display = 'flex';
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

/**
 * window.addEventListener("gamepadconnected", (e) => {
    console.log("Control conectado:", e.gamepad.id);
    // Aquí verás algo como "Pro Controller (Vendor: 057e Product: 2009)"
});
 */