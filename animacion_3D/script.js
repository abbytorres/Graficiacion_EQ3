import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.0/three.module.min.js';

// 1. Escena y Cámara (Perspectiva)
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a2e); // Fondo oscuro
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 2. Elementos del mundo
// Plano (Suelo) con rejilla para enfatizar la perspectiva
const gridHelper = new THREE.GridHelper(100, 50, 0x00ff00, 0x444444);
scene.add(gridHelper);

// Avatar (El "Jugador")
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshPhongMaterial({ color: 0x00aaff });
const avatar = new THREE.Mesh(geometry, material);
avatar.position.y = 0.5; // Apoyado sobre el plano
scene.add(avatar);

// Objeto 3D - Enemigo (Esfera)
const enemyGeometry = new THREE.SphereGeometry(0.7, 32, 32);
const enemyMaterial = new THREE.MeshPhongMaterial({ color: 0xff3333 });
const enemy = new THREE.Mesh(enemyGeometry, enemyMaterial);
enemy.position.set(15, 0.7, 0);
scene.add(enemy);

// Parámetros de colisión
const collisionDistance = 2; // Distancia de colisión
let colliding = false;
let collisionCount = 0;

// Iluminación
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5).normalize();
scene.add(light);
scene.add(new THREE.AmbientLight(0x404040));

// 3. Lógica de Movimiento
const keys = { w: false, a: false, s: false, d: false, ArrowLeft: false, ArrowRight: false };
const speed = 0.15;
const rotationSpeed = 0.05;
let cameraAngle = 0; // Ángulo de la cámara alrededor del avatar

window.addEventListener('keydown', (e) => {
    if (['w', 'a', 's', 'd', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        keys[e.key] = true;
    }
});
window.addEventListener('keyup', (e) => {
    if (['w', 'a', 's', 'd', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        keys[e.key] = false;
    }
});

// 4. Animación y Renderizado
function animate() {
    requestAnimationFrame(animate);

    // Control de rotación de cámara con flechas
    if (keys.ArrowRight) cameraAngle += rotationSpeed;
    if (keys.ArrowLeft) cameraAngle -= rotationSpeed;

    // Control de desplazamiento del avatar (WASD)
    // Movimiento independiente del avatar (sin rotación)
    if (keys.w) avatar.position.z -= speed;
    if (keys.s) avatar.position.z += speed;
    if (keys.a) avatar.position.x -= speed;
    if (keys.d) avatar.position.x += speed;

    // Movimiento del enemigo (patrón circular)
    const time = Date.now() * 0.001;
    enemy.position.x = 15 + Math.cos(time) * 10;
    enemy.position.z = Math.sin(time) * 10;
    enemy.rotation.x += 0.01;
    enemy.rotation.y += 0.01;

    // Detección de colisión
    const distance = avatar.position.distanceTo(enemy.position);
    if (distance < collisionDistance) {
        colliding = true;
        collisionCount++;
        enemy.material.color.setHex(0xffff00); // Amarillo al colisionar
    } else {
        colliding = false;
        enemy.material.color.setHex(0xff3333); // Rojo normal
    }

    // Mostrar estado de colisión en consola
    if (colliding && collisionCount % 30 === 0) {
        console.log(`¡Colisión! Distancia: ${distance.toFixed(2)}`);
    }

    // Actualizar contador en pantalla
    document.getElementById('colisionInfo').innerText = `Colisiones: ${collisionCount}`;

    // Cámara libre: sigue al avatar girando alrededor de él
    const cameraDistance = 6;
    const cameraHeight = 3;
    camera.position.x = avatar.position.x + Math.sin(cameraAngle) * cameraDistance;
    camera.position.y = avatar.position.y + cameraHeight;
    camera.position.z = avatar.position.z + Math.cos(cameraAngle) * cameraDistance;
    camera.lookAt(avatar.position);

    renderer.render(scene, camera);
}

animate();

// Ajuste de ventana
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});