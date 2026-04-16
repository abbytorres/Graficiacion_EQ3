import * as THREE from 'three';

export function setupFauna(scene) {
    const bees = [];
    
    for(let i=0; i<15; i++) {
        const bee = new THREE.Group();
        const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.12, 0.25, 8, 16), new THREE.MeshStandardMaterial({color: 0xffc107}));
        body.rotation.z = Math.PI / 2; bee.add(body);

        const blackMat = new THREE.MeshStandardMaterial({color: 0x111111});
        [-1, 1].forEach(dir => {
            const stripe = new THREE.Mesh(new THREE.TorusGeometry(0.125, 0.03, 8, 16), blackMat);
            stripe.position.x = dir * 0.08; stripe.rotation.y = Math.PI / 2; bee.add(stripe);
        });

        const head = new THREE.Mesh(new THREE.SphereGeometry(0.1), blackMat);
        head.position.x = 0.25; bee.add(head);

        const wingMat = new THREE.MeshStandardMaterial({color: 0xffffff, transparent: true, opacity: 0.4, side: THREE.DoubleSide});
        const wingGeo = new THREE.PlaneGeometry(0.3, 0.2); wingGeo.translate(0, 0.1, 0);
        
        const wingL = new THREE.Mesh(wingGeo, wingMat); wingL.position.set(0, 0.1, 0.05); wingL.rotation.x = Math.PI / 2;
        const wingR = new THREE.Mesh(wingGeo, wingMat); wingR.position.set(0, 0.1, -0.05); wingR.rotation.x = -Math.PI / 2;
        bee.add(wingL, wingR); bee.castShadow = true;

        bee.userData = {
            wingL, wingR,
            speed: 0.2 + Math.random() * 0.15, // MÁS RÁPIDAS
            heightOffset: Math.random() * Math.PI,
            center: new THREE.Vector3(Math.random()*40-20, 2, Math.random()*40-20)
        };
        bee.position.copy(bee.userData.center);
        scene.add(bee); bees.push(bee);
    }
    return bees;
}

export function animateBees(bees, elapsed) {
    bees.forEach(bee => {
        const t = elapsed * bee.userData.speed;
        bee.position.x = bee.userData.center.x + Math.sin(t) * 8;
        bee.position.z = bee.userData.center.z + Math.cos(t * 0.8) * 8;
        bee.position.y = 2 + Math.sin(t * 3 + bee.userData.heightOffset) * 0.5;
        
        bee.lookAt(bee.position.x + Math.cos(t)*0.1, bee.position.y, bee.position.z - Math.sin(t*0.8)*0.1);
        
        // Aleteo supersónico
        const flap = Math.sin(elapsed * 120) * 0.6; 
        bee.userData.wingL.rotation.y = flap;
        bee.userData.wingR.rotation.y = -flap;
    });
}