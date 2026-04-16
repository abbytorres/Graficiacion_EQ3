import * as THREE from 'three';

export function setupCore() {
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x87CEEB, 0.015);

    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 1.6, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    document.body.appendChild(renderer.domElement);

    // Luces
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.4);
    const sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.set(2048, 2048);
    sunLight.shadow.camera.near = 0.5; sunLight.shadow.camera.far = 150;
    sunLight.shadow.camera.left = -50; sunLight.shadow.camera.right = 50;
    sunLight.shadow.camera.top = 50; sunLight.shadow.camera.bottom = -50;
    
    scene.add(ambientLight, hemiLight, sunLight);

    // SOL
    const sunSphere = new THREE.Mesh(
        new THREE.SphereGeometry(4, 32, 32),
        new THREE.MeshBasicMaterial({ color: 0xffffee, fog: false })
    );
    scene.add(sunSphere);

    // --- AÑADIR LUNA ---
    const moonSphere = new THREE.Mesh(
        new THREE.SphereGeometry(2.5, 32, 32), // Un poco más pequeña que el sol
        new THREE.MeshBasicMaterial({ color: 0xe0e0e0, fog: false }) // Color grisáceo pálido
    );
    moonSphere.visible = false; // Oculta al inicio (día)
    scene.add(moonSphere);
    // ------------------

    // NUBES
    function createCloud(x, y, z) {
        const cloud = new THREE.Group();
        const mat = new THREE.MeshLambertMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 });
        for(let i=0; i<4; i++) {
            const s = new THREE.Mesh(new THREE.SphereGeometry(3 + Math.random()*2, 8, 8), mat);
            s.position.set(i * 2.5, Math.random(), Math.random());
            s.scale.set(1, 0.6, 1);
            cloud.add(s);
        }
        cloud.position.set(x, y, z);
        scene.add(cloud);
    }
    for(let i=0; i<20; i++) {
        createCloud(Math.random()*160-80, 25 + Math.random()*10, Math.random()*160-80);
    }

    // ESTRELLAS
    const starsGeo = new THREE.BufferGeometry();
    const starsPos = new Float32Array(1000 * 3);
    for(let i=0; i<3000; i++) starsPos[i] = (Math.random() - 0.5) * 400;
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starsPos, 3));
    const stars = new THREE.Points(starsGeo, new THREE.PointsMaterial({color: 0xffffff, size: 0.5, transparent: true, fog: false}));
    scene.add(stars);

    // Suelo
    const groundGeo = new THREE.PlaneGeometry(300, 300, 64, 64);
    const posAtrib = groundGeo.attributes.position;
    for(let i=0; i<posAtrib.count; i++) {
        posAtrib.setZ(i, Math.sin(posAtrib.getX(i)*0.1) * Math.cos(posAtrib.getY(i)*0.1) * 0.5);
    }
    groundGeo.computeVertexNormals();
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x41752b, roughness: 0.9, metalness: 0.1 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Exportamos moonSphere también
    return { scene, camera, renderer, ambientLight, sunLight, sunSphere, stars, moonSphere };
}