import rubik_cube from "./cube_conf/rubik_cube";

const THREE = require('three');
import initializeScene from './initialize_scene';
import RubikCube from "./cube";

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

let renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

document.body.appendChild( renderer.domElement );


camera.position.y = 5;

initializeScene(scene);


let rubikCube = new RubikCube(rubik_cube);

// let geometry = new THREE.BoxGeometry( 1, 1, 1 );
// let material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// let cube = new THREE.Mesh( geometry, material );
// cube.castShadow = true;
// scene.add( cube );
scene.add(rubikCube);

let rotation = 0;
let clock = new THREE.Clock();

let animate = function () {
	requestAnimationFrame( animate );
	
	
	let elapsed = clock.getElapsedTime(); // in seconds
	// console.log(elapsed);

	rotation += 0.01;
	
	camera.position.x = Math.cos(rotation) * 5;
	camera.position.z = Math.sin(rotation) * 5;
	camera.lookAt(0, 0, 0);
	
	// cube.rotation.x += 0.01;
	// cube.rotation.y += 0.01;

	renderer.render( scene, camera );
};

animate();
