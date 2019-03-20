const THREE = require('three');


class RubikCubePiece extends THREE.Object3D {

    constructor() {
        super();

        let geometry = new THREE.BoxGeometry(.95, .95, .95);
        let material = new THREE.MeshBasicMaterial({color: 0x101010});
        let cube = new THREE.Mesh(geometry, material);
        this.add(cube);
    }

    addPieceFace(color, position, rotation) {
        let faceGeometry = new THREE.PlaneGeometry(.9, .9);
        let faceMaterial = new THREE.MeshBasicMaterial({color: color});
        let faceMesh = new THREE.Mesh(faceGeometry, faceMaterial);
        faceMesh.position.copy(position);
        faceMesh.setRotationFromQuaternion(rotation);

        this.add(faceMesh);
    }
}

class RubikCube extends THREE.Object3D {

    constructor(conf) {
        super();
        this.conf = conf;
        this.pieces = {};

        for (let pieceKey in conf.pieces) {
            if (conf.pieces.hasOwnProperty(pieceKey)) {
                let piece = new RubikCubePiece();
                console.log(JSON.stringify(conf.pieces[pieceKey].position));
                piece.position.copy(conf.pieces[pieceKey].position);
                conf.pieces[pieceKey].faces.forEach(face => piece.addPieceFace(conf.faces[face].color, conf.faces[face].position, conf.faces[face].rotation));
                this.pieces[pieceKey] = piece;

                this.add(piece);
            }
        }

        this.scale.setScalar(.5)
    }

}


export default RubikCube;
