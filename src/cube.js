import {Quaternion} from "three";

const THREE = require('three');


class RubikCubePiece extends THREE.Object3D {

    constructor(cube, pieceKey) {
        super();
        
        this.cube = cube;
        this.pieceKey = pieceKey;
        this.sides = [];
        this.currentRotation = null;

        let geometry = new THREE.BoxGeometry(.95, .95, .95);
        let material = new THREE.MeshBasicMaterial({color: 0x101010});
        let mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.name = "piece cube";
        this.add(mesh);
    }

    addPieceFace(face, color, position, rotation) {
        let faceGeometry = new THREE.PlaneGeometry(.9, .9);
        let faceMaterial = new THREE.MeshPhongMaterial({color: color});
        let faceMesh = new THREE.Mesh(faceGeometry, faceMaterial);
        faceMesh.position.copy(position);
        faceMesh.setRotationFromQuaternion(rotation);
        faceMesh.name = "piece side";

        faceMesh.pieceRef = this;

        this.add(faceMesh);
        this.sides.push({
            side: face,
            currentFace: face,
            mesh: faceMesh
        })
    }
    
    setCurrentRotation(startTime, endTime, face, clockwise) {
        if (this.currentRotation !== null) {
            this.finishRotation();
        }
        let angle = clockwise ? (-this.cube.conf.singleRotation) : (this.cube.conf.singleRotation);
        let pivotPoint = this.cube.conf.faces[face].center;
        this.currentRotation = {
            startTime: startTime,
            startPosition: this.position.clone(),
            startRotation: new Quaternion().setFromEuler(this.rotation),
            endPosition: this.position.clone().applyAxisAngle(pivotPoint, angle),
            endRotation: new Quaternion().setFromAxisAngle(pivotPoint.clone().normalize(), angle).multiply( 
                new Quaternion().setFromEuler(this.rotation)),
            endTime: endTime,
            face: face,
            clockwise: clockwise,
            pivotPoint: pivotPoint,
        }
    }
    
    update(time) {
        if (this.currentRotation === null) {
            return;
        }
        if (time >= this.currentRotation.endTime) {
            this.finishRotation();
            return;
        }
        if (time <= this.currentRotation.startTime) {
            return;
        }
        
        let rotationPhase = (time - this.currentRotation.startTime) / (this.currentRotation.endTime - this.currentRotation.startTime); 
        let startVectorLength = this.currentRotation.startPosition.distanceTo(this.currentRotation.pivotPoint);
        let endVectorLength = this.currentRotation.endPosition.distanceTo(this.currentRotation.pivotPoint);
        let currentVectorLength = (endVectorLength - startVectorLength) * rotationPhase + startVectorLength;
        if (currentVectorLength > 0) {
            let currentVector = this.currentRotation.endPosition.clone()
                .multiplyScalar(rotationPhase)
                .add(this.currentRotation.startPosition.clone().multiplyScalar(1 - rotationPhase))
                .sub(this.currentRotation.pivotPoint)
                .normalize()
                .multiplyScalar(currentVectorLength)
                .add(this.currentRotation.pivotPoint);
            this.position.copy(currentVector);
        }
        
        this.rotation.setFromQuaternion(
            this.currentRotation.startRotation.clone().slerp(this.currentRotation.endRotation, rotationPhase)
        );
        
    }

    finishRotation() {
        if (this.currentRotation === null) {
            return;
        }
        this.position.copy(this.currentRotation.endPosition);
        this.rotation.setFromQuaternion(this.currentRotation.endRotation);
        
        this.sides.forEach(side => {
           side.currentFace = this.cube.getColorAfterRotation(side.currentFace, this.currentRotation.face, this.currentRotation.clockwise); 
        });
        this.currentRotation = null;
    }
    
    isConnectedToFace(face) {
        let result = false;
        this.sides.forEach(side => {
            if (side.currentFace === face) {
                result = true;
            }
        });
        return result;
    }
}

class RubikCube extends THREE.Object3D {

    constructor(conf) {
        super();
        this.conf = conf;
        this.pieces = {};

        for (let pieceKey in conf.pieces) {
            if (conf.pieces.hasOwnProperty(pieceKey)) {
                let piece = new RubikCubePiece(this, pieceKey);
                piece.position.copy(conf.pieces[pieceKey].position);
                conf.pieces[pieceKey].faces.forEach(face => piece.addPieceFace(face, conf.faces[face].color, conf.faces[face].position, conf.faces[face].rotation));
                this.pieces[pieceKey] = piece;

                this.add(piece);
            }
        }
        
        this.currentRotation = null;
        this.queuedRotations = [];

        this.scale.setScalar(.5);
    }
    
    queueRotation(face, clockwise, rotationTime) {
        this.queuedRotations.push({
            face: face,
            clockwise: clockwise,
            rotationTime: rotationTime
        })
    }
    
    startRotation(startTime, endTime, face, clockwise) {
        this.currentRotation = {
            endTime: endTime
        };
        let piecesToRotate = [];
        for (let pieceKey in this.pieces) {
            if (this.pieces.hasOwnProperty(pieceKey)) {
                if (this.pieces[pieceKey].isConnectedToFace(face)) {
                    piecesToRotate.push(this.pieces[pieceKey]);
                }
            }
        }
        piecesToRotate.forEach(piece => piece.setCurrentRotation(startTime, endTime, face, clockwise));
    }


    getRotationDirection(rotateAround, fromFace, toFace) {
        console.log("rotating "+rotateAround+" from "+fromFace+" to "+toFace);
        if (this.conf.rotations.hasOwnProperty(rotateAround)) {
            if (this.conf.rotations[rotateAround].includes(fromFace)
                && this.conf.rotations[rotateAround].includes(toFace)) {
                let colorIndex = this.conf.rotations[rotateAround].indexOf(fromFace);
                let clockwiseColor = colorIndex + 1;
                if (clockwiseColor >= this.conf.rotations[rotateAround].length) {
                    clockwiseColor -= this.conf.rotations[rotateAround].length;
                }
                let counterClockwiseColor = colorIndex - 1;
                if (counterClockwiseColor < 0) {
                    counterClockwiseColor += this.conf.rotations[rotateAround].length;
                }
                if (this.conf.rotations[rotateAround][clockwiseColor] === toFace) {
                    return true;
                }
                if (this.conf.rotations[rotateAround][counterClockwiseColor] === toFace) {
                    return false;
                }
                return null;
            } else {
                return null;
            }
        } else {
            return null;
        }
    }
    getColorAfterRotation(colorToRotate, rotateAround, clockwise) {
        if (this.conf.rotations.hasOwnProperty(rotateAround)) {
            if (this.conf.rotations[rotateAround].includes(colorToRotate)) {
                let colorIndex = this.conf.rotations[rotateAround].indexOf(colorToRotate);
                if (clockwise) {
                    colorIndex++;
                } else {
                    colorIndex--;
                }
                if (colorIndex < 0) {
                    colorIndex += this.conf.rotations[rotateAround].length;
                } else if (colorIndex >= this.conf.rotations[rotateAround].length) {
                    colorIndex -= this.conf.rotations[rotateAround].length;
                }
                return this.conf.rotations[rotateAround][colorIndex];
            } else {
                return colorToRotate;
            }
        } else {
            return colorToRotate;
        }
    }
    
    update(time) {
        for (let pieceKey in this.pieces) {
            if (this.pieces.hasOwnProperty(pieceKey)) {
                this.pieces[pieceKey].update(time);
            }
        }

        if (this.currentRotation !== null) {
            if (time >= this.currentRotation.endTime) {
                this.currentRotation = null;
            }
        }

        if (this.currentRotation === null && this.queuedRotations.length > 0) {
            let nextRotation = this.queuedRotations.shift();
            this.startRotation(time, time + nextRotation.rotationTime, nextRotation.face, nextRotation.clockwise);
        }
    }

    cubeIsCurrentlyRotating() {
        if (this.currentRotation !== null) {
            return true;
        } 
        if (this.queuedRotations.length > 0) {
            return true;
        }
        return false;
    }

}


export default RubikCube;

