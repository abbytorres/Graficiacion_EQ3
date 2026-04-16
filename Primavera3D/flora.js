import * as THREE from 'three';

export function createDetailedFlower(scene, x, z, scale = 1) {
    const flower = new THREE.Group();
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.04, 0.6, 8), new THREE.MeshStandardMaterial({color: 0x33691e}));
    stem.position.y = 0.3; stem.castShadow = true; flower.add(stem);

    const center = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), new THREE.MeshStandardMaterial({color: 0xffb300}));
    center.position.y = 0.6; flower.add(center);

    const colors = [0xff5252, 0x448aff, 0xe040fb, 0xffeb3b, 0xffffff];
    const petalMat = new THREE.MeshStandardMaterial({color: colors[Math.floor(Math.random()*colors.length)], roughness: 0.4, side: THREE.DoubleSide});
    
    for(let i=0; i<6; i++) {
        const petalGeo = new THREE.SphereGeometry(0.15, 16, 16);
        petalGeo.scale(1, 0.2, 2.5); petalGeo.translate(0, 0, 0.3);
        const petal = new THREE.Mesh(petalGeo, petalMat);
        petal.position.y = 0.6;
        petal.rotation.y = (i / 6) * Math.PI * 2;
        petal.rotation.x = 0.2; petal.castShadow = true;
        flower.add(petal);
    }
    
    flower.position.set(x, 0, z);
    flower.scale.set(scale, scale, scale);
    scene.add(flower);
    return flower;
}

export function populateFlora(scene) {
    // Árboles
    for(let i=0; i<60; i++) {
        const tree = new THREE.Group();
        // CORRECCIÓN: Tronco más largo y ligeramente más enterrado
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.6, 4.5, 12), new THREE.MeshStandardMaterial({color: 0x5d4037, roughness: 1.0}));
        trunk.position.y = 1.0; // Antes estaba en 1.5, al bajarlo nos aseguramos que toque el fondo del terreno irregular
        trunk.castShadow = true; tree.add(trunk);

        const leaves = new THREE.Group();
        const leafMat = new THREE.MeshStandardMaterial({color: [0x2e7d32, 0x388e3c, 0x4caf50][Math.floor(Math.random()*3)], roughness: 0.9});
        const pos = [ [0,3,0], [1,2.5,0.5], [-1,2.8,-0.5], [0.5,3.5,-1], [-0.5,2.5,1] ];
        pos.forEach(p => {
            const puff = new THREE.Mesh(new THREE.DodecahedronGeometry(1.5 + Math.random()*0.5, 1), leafMat);
            puff.position.set(p[0], p[1]+1, p[2]); puff.castShadow = true; leaves.add(puff);
        });
        tree.add(leaves);
        
        tree.position.set(Math.random()*160-80, 0, Math.random()*160-80);
        tree.rotation.y = Math.random() * Math.PI;
        const scale = 0.8 + Math.random() * 0.6; tree.scale.set(scale, scale, scale);
        scene.add(tree);
    }

    // Pasto
    for(let i=0; i<300; i++) {
        const x = Math.random()*150-75, z = Math.random()*150-75;
        const tuft = new THREE.Group();
        const bGeo = new THREE.ConeGeometry(0.05, 0.5, 3); bGeo.translate(0, 0.25, 0); // Pasto un poco más alto
        const bMat = new THREE.MeshStandardMaterial({color: 0x558b2f, roughness: 0.8});
        for(let j=0; j<5; j++) {
            const b = new THREE.Mesh(bGeo, bMat);
            b.rotation.set((Math.random()-0.5)*0.5, Math.random()*Math.PI, (Math.random()-0.5)*0.5);
            tuft.add(b);
        }
        tuft.position.set(x, -0.2, z); // Hundimos el pasto ligeramente
        scene.add(tuft);
    }
    for(let i=0; i<100; i++) createDetailedFlower(scene, Math.random()*100-50, Math.random()*100-50, 0.5 + Math.random()*0.5);
}