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
    let touchStartX = 0, touchStartY = 0;
    let isTouching = false;

    document.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        isTouching = true;
    }, { passive: true });

    document.addEventListener('touchend', () => { isTouching = false; }, { passive: true });
})();