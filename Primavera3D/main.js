import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

import { setupCore } from './core.js';
import { populateFlora, createDetailedFlower } from './flora.js';
import { setupFauna, animateBees } from './fauna.js';

// CORRECCIÓN: Importar moonSphere
const { scene, camera, renderer, ambientLight, sunLight, sunSphere, stars, moonSphere } = setupCore();
populateFlora(scene);
const bees = setupFauna(scene);

const controls = new PointerLockControls(camera, document.body);
const overlay = document.getElementById('instrucciones');
const crosshair = document.getElementById('crosshair');

document.querySelector('.btn-start').addEventListener('click', () => controls.lock());
controls.addEventListener('lock', () => { overlay.style.display = 'none'; crosshair.style.display = 'block'; });
controls.addEventListener('unlock', () => { overlay.style.display = 'block'; crosshair.style.display = 'none'; });

let move = { f: false, b: false, l: false, r: false };
document.addEventListener('keydown', (e) => {
    if(e.code==='KeyW') move.f=true; if(e.code==='KeyS') move.b=true;
    if(e.code==='KeyA') move.l=true; if(e.code==='KeyD') move.r=true;
});
document.addEventListener('keyup', (e) => {
    if(e.code==='KeyW') move.f=false; if(e.code==='KeyS') move.b=false;
    if(e.code==='KeyA') move.l=false; if(e.code==='KeyD') move.r=false;
});

let fCount = 0;
const plantedFlowers = [];
document.addEventListener('mousedown', (e) => {
    if(controls.isLocked && e.button === 0) {
        const dir = new THREE.Vector3();
        camera.getWorldDirection(dir);
        dir.y = 0; dir.normalize();
        
        const distance = 3; 
        const spawnX = camera.position.x + dir.x * distance;
        const spawnZ = camera.position.z + dir.z * distance;
        
        const flower = createDetailedFlower(scene, spawnX, spawnZ, 0);
        plantedFlowers.push(flower);
        fCount++; document.getElementById('contador').innerText = fCount;
        
        camera.position.y -= 0.1; setTimeout(() => camera.position.y += 0.1, 100);
    }
});

const clock = new THREE.Clock();
const velocity = new THREE.Vector3(), direction = new THREE.Vector3();
let timeOfDay = 8; 

const clockUI = document.getElementById('hora');
const iconUI = document.getElementById('icono-clima');

const cDawn = { sky: new THREE.Color(0xffb7b2), fog: new THREE.Color(0xffb7b2), amb: new THREE.Color(0xaa5555), sun: new THREE.Color(0xff8844) };
const cDay =  { sky: new THREE.Color(0x87CEEB), fog: new THREE.Color(0xaaccff), amb: new THREE.Color(0xffffff), sun: new THREE.Color(0xffffee) };
const cDusk = { sky: new THREE.Color(0xff7b54), fog: new THREE.Color(0xcc6655), amb: new THREE.Color(0x663344), sun: new THREE.Color(0xff5522) };
const cNight = { sky: new THREE.Color(0x050515), fog: new THREE.Color(0x0a0a2a), amb: new THREE.Color(0x111133), sun: new THREE.Color(0x223355) };

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta(), elapsed = clock.getElapsedTime();

    timeOfDay += delta * (10 / 60); 
    if(timeOfDay >= 24) timeOfDay = 0;

    const h = Math.floor(timeOfDay);
    const m = Math.floor((timeOfDay % 1) * 60);
    clockUI.innerText = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;

    // --- LÓGICA DE DÍA/NOCHE CORREGIDA ---
    let tFade = 0;
    let currentColors, nextColors;
    
    if (timeOfDay >= 5 && timeOfDay < 6.5) {
        // 5:00 a 6:30 - Transición: Noche -> Amanecer
        tFade = (timeOfDay - 5) / 1.5; currentColors = cNight; nextColors = cDawn; iconUI.innerText = "🌅"; stars.material.opacity = 1 - tFade;
    } else if (timeOfDay >= 6.5 && timeOfDay < 8) {
        // 6:30 a 8:00 - Transición: Amanecer -> Día
        tFade = (timeOfDay - 6.5) / 1.5; currentColors = cDawn; nextColors = cDay; iconUI.innerText = "🌅"; stars.material.opacity = 0;
    } else if (timeOfDay >= 8 && timeOfDay < 17) {
        // 8:00 a 17:00 - Día Puro (Fijo)
        tFade = 1; currentColors = cDay; nextColors = cDay; iconUI.innerText = "☀️"; stars.material.opacity = 0;
    } else if (timeOfDay >= 17 && timeOfDay < 18.5) {
        // 17:00 a 18:30 - Transición: Día -> Atardecer
        tFade = (timeOfDay - 17) / 1.5; currentColors = cDay; nextColors = cDusk; iconUI.innerText = "🌇"; stars.material.opacity = 0;
    } else if (timeOfDay >= 18.5 && timeOfDay < 20) {
        // 18:30 a 20:00 - Transición: Atardecer -> Noche
        tFade = (timeOfDay - 18.5) / 1.5; currentColors = cDusk; nextColors = cNight; iconUI.innerText = "🌇"; stars.material.opacity = tFade;
    } else {
        // 20:00 a 5:00 - Noche Pura (Fijo)
        tFade = 1; currentColors = cNight; nextColors = cNight; iconUI.innerText = "🌃"; stars.material.opacity = 1;
    }
    
    scene.background = currentColors.sky.clone().lerp(nextColors.sky, tFade);
    scene.fog.color.copy(scene.background);
    ambientLight.color = currentColors.amb.clone().lerp(nextColors.amb, tFade);
    sunLight.color = currentColors.sun.clone().lerp(nextColors.sun, tFade);

    // Posicionamiento del Sol
    const sunAngle = ((timeOfDay - 6) / 12) * Math.PI; // 6 AM = 0, 6 PM = PI
    const orbitalRadius = 100; // Radio de órbita
    sunSphere.position.set(Math.cos(sunAngle) * orbitalRadius, Math.sin(sunAngle) * orbitalRadius, -50);
    sunLight.position.copy(sunSphere.position);
    sunLight.intensity = Math.max(0.1, Math.sin(sunAngle) * 2.0);
    sunSphere.material.color.copy(sunLight.color);

    // --- POSICIONAMIENTO Y VISIBILIDAD DE LA LUNA ---
    const moonAngle = sunAngle + Math.PI; // La luna está en el lado opuesto orbital al sol
    moonSphere.position.set(Math.cos(moonAngle) * orbitalRadius, Math.sin(moonAngle) * orbitalRadius, -50);

    // Visibilidad de la luna (solo de noche: antes de las 6 AM o después de las 6 PM)
    if(timeOfDay < 6 || timeOfDay > 18) {
        moonSphere.visible = true;
    } else {
        moonSphere.visible = false;
    }
    // -----------------------------------------------

    animateBees(bees, elapsed);

    plantedFlowers.forEach(f => { if(f.scale.x < 1.2) { const s = f.scale.x + (delta*2); f.scale.set(s,s,s); }});

    if (controls.isLocked) {
        velocity.x -= velocity.x * 10.0 * delta; velocity.z -= velocity.z * 10.0 * delta;
        direction.z = Number(move.f) - Number(move.b); direction.x = Number(move.r) - Number(move.l);
        direction.normalize();
        if (move.f || move.b) velocity.z -= direction.z * 40.0 * delta;
        if (move.l || move.r) velocity.x -= direction.x * 40.0 * delta;
        controls.moveRight(-velocity.x * delta); controls.moveForward(-velocity.z * delta);
    }

    renderer.render(scene, camera);
}
animate();