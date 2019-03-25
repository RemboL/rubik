const THREE = require('three');

let initializeScene = function (scene) {
    scene.add(new THREE.AmbientLight(0xffffff, 0.3));

    let light = new THREE.DirectionalLight(0xffffff, 0.7);
    light.position.set(0, 10, 0);
    light.castShadow = true;
    scene.add(light);

    let floorGeometry = new THREE.PlaneGeometry(30, 30);
    let floorTexture = new THREE.TextureLoader().load('img/floor.jpg');
    floorTexture.wrapS = THREE.MirroredRepeatWrapping;
    floorTexture.wrapT = THREE.MirroredRepeatWrapping;
    floorTexture.repeat.set(5, 5);
    let floorMaterial = new THREE.MeshPhongMaterial({map: floorTexture});
    let floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
    floorMesh.rotateX(-Math.PI / 2);
    floorMesh.position.y = -5;
    floorMesh.receiveShadow = true;
    floorMesh.name = "floor";
    scene.add(floorMesh);
    
    for (let i = 0; i < 4; ++i) {
        let wallGeometry = new THREE.PlaneGeometry(30, 30);
        let wallTexture = new THREE.TextureLoader().load('img/wall.jpg');
        wallTexture.wrapS = THREE.MirroredRepeatWrapping;
        wallTexture.wrapT = THREE.MirroredRepeatWrapping;
        wallTexture.repeat.set(5, 5);
        let wallMaterial = new THREE.MeshPhongMaterial({map: wallTexture});
        let wallMesh = new THREE.Mesh(wallGeometry, wallMaterial);
        let rotation = i * Math.PI / 2;
        wallMesh.position.set(-Math.sin(rotation) * 15, 10, -Math.cos(rotation) * 15);
        wallMesh.rotateY(rotation);
        wallMesh.name = "wall";
        scene.add(wallMesh);
    }

    let tableGeometry = new THREE.BoxGeometry(10, 0.5, 6);
    let tableTexture = new THREE.TextureLoader().load('img/wood.jpg');
    let tableMaterial = new THREE.MeshPhongMaterial({map: tableTexture});
    let tableMesh = new THREE.Mesh(tableGeometry, tableMaterial);
    tableMesh.position.y = -2;
    tableMesh.receiveShadow = true;
    tableMesh.name = "table";
    scene.add(tableMesh);
};

export default initializeScene;