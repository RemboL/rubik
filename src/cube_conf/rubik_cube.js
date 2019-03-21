const THREE = require('three');

let rubik_cube = {
    singleRotation: Math.PI / 2, 
    faces: {
        'blue': {
            color: 0x0000ff,
            center: new THREE.Vector3(0, 0, 1),
            position: new THREE.Vector3(0, 0, .5),
            rotation: new THREE.Quaternion()
        },
        'green': {
            color: 0x00ff00,
            center: new THREE.Vector3(0, 0, -1),
            position: new THREE.Vector3(0, 0, -.5),
            rotation: new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI)
        },
        'red': {
            color: 0xff0000,
            center: new THREE.Vector3(-1, 0, 0),
            position: new THREE.Vector3(-.5, 0, 0),
            rotation: new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI / 2)
        },
        'orange': {
            color: 0xff8c00,
            center: new THREE.Vector3(1, 0, 0),
            position: new THREE.Vector3(.5, 0, 0),
            rotation: new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2)
        },
        'white': {
            color: 0xffffff,
            center: new THREE.Vector3(0, 1, 0),
            position: new THREE.Vector3(0, .5, 0),
            rotation: new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2)
        },
        'yellow': {
            color: 0xffff00,
            center: new THREE.Vector3(0, -1, 0),
            position: new THREE.Vector3(0, -.5, 0),
            rotation: new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2)
        },
    },
    rotations: {
        'blue': ['white', 'orange', 'yellow', 'red'],
        'green': ['red', 'yellow', 'orange', 'white'],
        'red': ['white', 'blue', 'yellow', 'green'],
        'orange': ['green', 'yellow', 'blue', 'white'],
        'white': ['green', 'orange', 'blue', 'red'],
        'yellow': ['red', 'blue', 'orange', 'green']
    },
    pieces: {
        '1_1_1': {
            position: new THREE.Vector3(-1, 1, 1),
            faces: ['red', 'blue', 'white']
        },
        '2_1_1': {
            position: new THREE.Vector3(0, 1, 1),
            faces: ['blue', 'white']
        },
        '3_1_1': {
            position: new THREE.Vector3(1, 1, 1),
            faces: ['blue', 'orange', 'white']
        },
        '1_2_1': {
            position: new THREE.Vector3(-1, 0, 1),
            faces: ['red', 'blue']
        },
        '2_2_1': {
            position: new THREE.Vector3(0, 0, 1),
            faces: ['blue']
        },
        '3_2_1': {
            position: new THREE.Vector3(1, 0, 1),
            faces: ['blue', 'orange']
        },
        '1_3_1': {
            position: new THREE.Vector3(-1, -1, 1),
            faces: ['red', 'blue', 'yellow']
        },
        '2_3_1': {
            position: new THREE.Vector3(0, -1, 1),
            faces: ['blue', 'yellow']
        },
        '3_3_1': {
            position: new THREE.Vector3(1, -1, 1),
            faces: ['blue', 'orange', 'yellow']
        },

        '1_1_2': {
            position: new THREE.Vector3(-1, 1, 0),
            faces: ['red', 'white']
        },
        '2_1_2': {
            position: new THREE.Vector3(0, 1, 0),
            faces: ['white']
        },
        '3_1_2': {
            position: new THREE.Vector3(1, 1, 0),
            faces: ['orange', 'white']
        },
        '1_2_2': {
            position: new THREE.Vector3(-1, 0, 0),
            faces: ['red']
        },
        '3_2_2': {
            position: new THREE.Vector3(1, 0, 0),
            faces: ['orange']
        },
        '1_3_2': {
            position: new THREE.Vector3(-1, -1, 0),
            faces: ['red', 'yellow']
        },
        '2_3_2': {
            position: new THREE.Vector3(0, -1, 0),
            faces: ['yellow']
        },
        '3_3_2': {
            position: new THREE.Vector3(1, -1, 0),
            faces: ['orange', 'yellow']
        },

        '1_1_3': {
            position: new THREE.Vector3(-1, 1, -1),
            faces: ['red', 'green', 'white']
        },
        '2_1_3': {
            position: new THREE.Vector3(0, 1, -1),
            faces: ['green', 'white']
        },
        '3_1_3': {
            position: new THREE.Vector3(1, 1, -1),
            faces: ['green', 'orange', 'white']
        },
        '1_2_3': {
            position: new THREE.Vector3(-1, 0, -1),
            faces: ['red', 'green']
        },
        '2_2_3': {
            position: new THREE.Vector3(0, 0, -1),
            faces: ['green']
        },
        '3_2_3': {
            position: new THREE.Vector3(1, 0, -1),
            faces: ['green', 'orange']
        },
        '1_3_3': {
            position: new THREE.Vector3(-1, -1, -1),
            faces: ['red', 'green', 'yellow']
        },
        '2_3_3': {
            position: new THREE.Vector3(0, -1, -1),
            faces: ['green', 'yellow']
        },
        '3_3_3': {
            position: new THREE.Vector3(1, -1, -1),
            faces: ['green', 'orange', 'yellow']
        },
        
    }
};

export default rubik_cube;