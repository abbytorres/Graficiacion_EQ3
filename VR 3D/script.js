// ── Clock ──────────────────────────────────────────────
function updateClock() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    document.getElementById('clock').textContent = h + ':' + m;
}
updateClock();
setInterval(updateClock, 10000);

// ── Hide loading ───────────────────────────────────────
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loading-screen').classList.add('hidden');
        setTimeout(() => document.getElementById('loading-screen').remove(), 900);
    }, 2200);
});

// ── Generate grid ──────────────────────────────────────
const scene = document.querySelector('a-scene');

scene.addEventListener('loaded', () => {

    // Grid lines
    const gridEl = document.getElementById('grid');
    const gridSize = 60;
    const step = 4;

    for (let i = -gridSize; i <= gridSize; i += step) {
        // lines along Z
        const lx = document.createElement('a-cylinder');
        lx.setAttribute('position', `${i} 0.005 0`);
        lx.setAttribute('radius', '0.015');
        lx.setAttribute('height', String(gridSize * 2));
        lx.setAttribute('rotation', '90 0 0');
        lx.setAttribute('color', '#ffffff');
        lx.setAttribute('material', 'transparent: true; opacity: 0.06; emissive: #4040ff; emissiveIntensity: 0.3');
        gridEl.appendChild(lx);

        // lines along X
        const lz = document.createElement('a-cylinder');
        lz.setAttribute('position', `0 0.005 ${i}`);
        lz.setAttribute('radius', '0.015');
        lz.setAttribute('height', String(gridSize * 2));
        lz.setAttribute('rotation', '90 90 0');
        lz.setAttribute('color', '#ffffff');
        lz.setAttribute('material', 'transparent: true; opacity: 0.06; emissive: #4040ff; emissiveIntensity: 0.3');
        gridEl.appendChild(lz);
    }

    // Particles
    const particlesEl = document.getElementById('particles');
    const colors = ['#00ffe7', '#7c3aed', '#ff6b35', '#f59e0b', '#f472b6', '#34d399'];
    for (let i = 0; i < 50; i++) {
        const p = document.createElement('a-box');
        const x = (Math.random() - 0.5) * 40;
        const y = Math.random() * 8 + 0.5;
        const z = (Math.random() - 0.5) * 40;
        const size = Math.random() * 0.12 + 0.04;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const dur = Math.floor(Math.random() * 4000 + 2000);
        const yTo = y + Math.random() * 1.5 + 0.5;

        p.setAttribute('position', `${x} ${y} ${z}`);
        p.setAttribute('width', String(size));
        p.setAttribute('height', String(size));
        p.setAttribute('depth', String(size));
        p.setAttribute('color', color);
        p.setAttribute('material', `emissive: ${color}; emissiveIntensity: 0.9; transparent: true; opacity: 0.8`);
        p.setAttribute('animation__float', `property: position; from: ${x} ${y} ${z}; to: ${x} ${yTo} ${z}; dir: alternate; dur: ${dur}; loop: true; easing: easeInOutSine`);
        p.setAttribute('animation__spin', `property: rotation; to: ${Math.random() * 360} ${Math.random() * 360} ${Math.random() * 360}; dur: ${dur * 2}; loop: true; easing: linear`);

        particlesEl.appendChild(p);
    }

    // Stars
    const starsEl = document.getElementById('stars');
    for (let i = 0; i < 200; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const r = 120;
        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.cos(phi);
        const z = r * Math.sin(phi) * Math.sin(theta);
        const s = Math.random() * 0.15 + 0.05;

        const star = document.createElement('a-sphere');
        star.setAttribute('position', `${x} ${y} ${z}`);
        star.setAttribute('radius', String(s));
        star.setAttribute('color', '#ffffff');
        star.setAttribute('material', `emissive: #ffffff; emissiveIntensity: ${Math.random() * 0.8 + 0.2}; transparent: true; opacity: ${Math.random() * 0.5 + 0.5}`);
        starsEl.appendChild(star);
    }
});

// ── Mobile touch controls ──────────────────────────────
(function () {
    // Detect if mobile device
    const isMobile = () => {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               window.innerWidth < 768;
    };

    const isTouch = () => window.matchMedia('(pointer: coarse)').matches;
    const mobile = isMobile() || isTouch();

    if (!mobile) return; // Skip if not mobile

    // Initialize mobile controls UI
    const mobileControlsEl = document.getElementById('mobile-controls');
    const controlsHint = document.getElementById('controls-hint');
    const mobileHint = document.getElementById('mobile-hint');

    if (mobileControlsEl) {
        mobileControlsEl.classList.add('active');
    }
    if (controlsHint) {
        controlsHint.style.display = 'none';
    }
    if (mobileHint) {
        mobileHint.style.display = 'block';
    }

    // ==================== JOYSTICK SYSTEM ====================
    const joystickBase = document.getElementById('joystick-base');
    const joystickStick = document.getElementById('joystick-stick');
    
    if (!joystickBase || !joystickStick) {
        console.warn('Joystick elements not found');
        return;
    }

    const joystickRadius = 60; // Base radius in pixels
    const stickRadius = 25; // Stick radius

    let joystickActive = false;
    let joystickTouchId = null;
    const joystickInput = { x: 0, y: 0 }; // Normalized -1 to 1

    // Joystick touch handlers
    joystickBase.addEventListener('touchstart', (e) => {
        if (joystickActive) return;
        joystickActive = true;
        joystickTouchId = e.touches[0].identifier;
        updateJoystick(e.touches[0]);
        e.preventDefault();
    }, { passive: false });

    document.addEventListener('touchmove', (e) => {
        if (!joystickActive || joystickTouchId === null) return;

        for (let touch of e.touches) {
            if (touch.identifier === joystickTouchId) {
                updateJoystick(touch);
                e.preventDefault();
                break;
            }
        }
    }, { passive: false });

    document.addEventListener('touchend', (e) => {
        for (let touch of e.changedTouches) {
            if (touch.identifier === joystickTouchId) {
                joystickActive = false;
                joystickTouchId = null;
                joystickInput.x = 0;
                joystickInput.y = 0;
                joystickStick.style.transform = 'translate(-50%, -50%)';
                break;
            }
        }
    }, { passive: true });

    function updateJoystick(touch) {
        const rect = joystickBase.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        let deltaX = touch.clientX - centerX;
        let deltaY = touch.clientY - centerY;

        // Clamp to circle
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const maxDistance = joystickRadius - stickRadius;

        if (distance > maxDistance) {
            const angle = Math.atan2(deltaY, deltaX);
            deltaX = Math.cos(angle) * maxDistance;
            deltaY = Math.sin(angle) * maxDistance;
        }

        // Store input
        joystickInput.x = distance > 5 ? deltaX / maxDistance : 0;
        joystickInput.y = distance > 5 ? deltaY / maxDistance : 0;

        // Update visual position
        const posX = 50 + (deltaX / maxDistance) * 35; // 35% of container for visual offset
        const posY = 50 + (deltaY / maxDistance) * 35;
        joystickStick.style.transform = `translate(${posX}%, ${posY}%)`;
    }

    // ==================== CAMERA CONTROL SYSTEM ====================
    const cameraZone = document.getElementById('camera-control-zone');
    
    if (!cameraZone) {
        console.warn('Camera control zone not found');
        return;
    }

    let cameraActive = false;
    let cameraTouchId = null;
    let cameraLastX = 0, cameraLastY = 0;

    const sensitivity = 0.6; // Adjust for faster/slower camera rotation

    cameraZone.addEventListener('touchstart', (e) => {
        if (cameraActive) return;
        cameraActive = true;
        cameraTouchId = e.touches[0].identifier;
        cameraLastX = e.touches[0].clientX;
        cameraLastY = e.touches[0].clientY;
        e.preventDefault();
    }, { passive: false });

    document.addEventListener('touchmove', (e) => {
        if (!cameraActive || cameraTouchId === null) return;

        for (let touch of e.touches) {
            if (touch.identifier === cameraTouchId) {
                const deltaX = touch.clientX - cameraLastX;
                const deltaY = touch.clientY - cameraLastY;

                // Only rotate if meaningful delta
                if (Math.abs(deltaX) > 0.5 || Math.abs(deltaY) > 0.5) {
                    rotateCameraByTouch(deltaX, deltaY);
                }

                cameraLastX = touch.clientX;
                cameraLastY = touch.clientY;
                e.preventDefault();
                break;
            }
        }
    }, { passive: false });

    document.addEventListener('touchend', (e) => {
        for (let touch of e.changedTouches) {
            if (touch.identifier === cameraTouchId) {
                cameraActive = false;
                cameraTouchId = null;
                break;
            }
        }
    }, { passive: true });

    function rotateCameraByTouch(deltaX, deltaY) {
        const camera = document.querySelector('a-camera');
        if (!camera) return;

        // Get current rotation
        let rotation = camera.getAttribute('rotation');
        if (!rotation) {
            rotation = { x: 0, y: 0, z: 0 };
        } else if (typeof rotation === 'string') {
            const parts = rotation.split(' ');
            rotation = { 
                x: parseFloat(parts[0]) || 0, 
                y: parseFloat(parts[1]) || 0, 
                z: parseFloat(parts[2]) || 0 
            };
        } else if (rotation instanceof Object && typeof rotation.x === 'undefined') {
            rotation = { x: rotation.x || 0, y: rotation.y || 0, z: rotation.z || 0 };
        }

        // Apply delta with sensitivity
        rotation.y = (rotation.y || 0) - deltaX * sensitivity;
        rotation.x = (rotation.x || 0) - deltaY * sensitivity;

        // Clamp X rotation to prevent flip
        rotation.x = Math.max(-89, Math.min(89, rotation.x));

        // Normalize Y rotation
        rotation.y = rotation.y % 360;

        camera.setAttribute('rotation', `${rotation.x} ${rotation.y} ${rotation.z}`);
    }

    // ==================== MOVEMENT SYSTEM ====================
    const rig = document.getElementById('rig');
    if (!rig) {
        console.warn('RIG element not found');
        return;
    }

    const movementSpeed = 0.18; // Adjust speed if needed

    function updateMovement() {
        const pos = rig.getAttribute('position');
        if (!pos) return;

        // Get camera rotation to calculate forward direction
        const camera = document.querySelector('a-camera');
        let cameraRot = camera ? camera.getAttribute('rotation') : null;
        
        if (!cameraRot) {
            cameraRot = { x: 0, y: 0, z: 0 };
        } else if (typeof cameraRot === 'string') {
            const parts = cameraRot.split(' ');
            cameraRot = { x: parseFloat(parts[0]) || 0, y: parseFloat(parts[1]) || 0, z: parseFloat(parts[2]) || 0 };
        }

        const yaw = (cameraRot.y || 0) * Math.PI / 180;

        // Calculate direction vectors
        const moveDir = { x: 0, z: 0 };

        // Joystick input: treat as WASD
        // X axis = left/right (A/D), Y axis = forward/backward (W/S)
        const joyX = joystickInput.x || 0;
        const joyY = joystickInput.y || 0;

        if (Math.abs(joyX) > 0.02 || Math.abs(joyY) > 0.02) {
            // Forward/backward relative to camera direction
            moveDir.x += Math.sin(yaw) * joyY;
            moveDir.z += Math.cos(yaw) * joyY;

            // Left/right relative to camera direction
            moveDir.x += -Math.cos(yaw) * joyX;
            moveDir.z += Math.sin(yaw) * joyX;

            // Apply movement
            pos.x += moveDir.x * movementSpeed;
            pos.z += moveDir.z * movementSpeed;

            rig.setAttribute('position', pos);
        }
    }

    // Animation loop for movement
    function mobileGameLoop() {
        updateMovement();
        requestAnimationFrame(mobileGameLoop);
    }

    // Start game loop when scene is ready
    const mobileScene = document.querySelector('a-scene');
    if (mobileScene && mobileScene.hasLoaded) {
        mobileGameLoop();
    } else if (mobileScene) {
        mobileScene.addEventListener('loaded', mobileGameLoop);
    } else {
        window.addEventListener('load', mobileGameLoop);
    }

    // Prevent unwanted default touch behaviors on specific elements
    ['joystick-base', 'joystick-stick', 'camera-control-zone'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.style.touchAction = 'none';
        }
    });

    console.log('Mobile controls initialized');
})();