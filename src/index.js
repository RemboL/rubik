import rubik_cube from "./cube_conf/rubik_cube";

const THREE = require('three');
import initializeScene from './initialize_scene';
import RubikCube from "./cube";
import MouseHandler from "./mouse_handler";

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

let renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

document.body.appendChild( renderer.domElement );

initializeScene(scene);


let rubikCube = new RubikCube(rubik_cube);
scene.add(rubikCube);

let mouseHandler = new MouseHandler(scene, camera, rubikCube);
document.addEventListener('mousedown', event => mouseHandler.onMouseDown(event), false);
document.addEventListener('mouseup', event => mouseHandler.onMouseUp(event), false);
document.addEventListener('mousemove', event => mouseHandler.onMouseMove(event), false);

let rotation = Math.PI / 4;
let clock = new THREE.Clock();

let animate = function () {
	requestAnimationFrame( animate );
	
	let elapsed = clock.getElapsedTime(); // in seconds

	rubikCube.update(elapsed);
	// rotation += 0.005;
	
	camera.position.x = Math.cos(rotation) * 3;
	camera.position.z = Math.sin(rotation) * 3;
	camera.position.y = 3;
	camera.lookAt(0, 0, 0);
	
	renderer.render( scene, camera );
};

animate();
