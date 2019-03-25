import * as THREE from "three";

class MouseHandler {

    constructor(scene, camera, rubikCube) {
        this.scene = scene;
        this.camera = camera;
        this.rubikCube = rubikCube;
        this.raycaster = new THREE.Raycaster();

        this.isMousePressed = false;
        this.currentlyDraggedPieceSide = null;
        this.currentlyDraggedCursorPosition = null;
    }

    cubeIsCurrentlyRotating() {
        return this.rubikCube.cubeIsCurrentlyRotating();
    }

    onMouseDown(event) {
        event.preventDefault();
        this.doOnMouseDown(new THREE.Vector2((event.clientX / window.innerWidth) * 2 - 1, 1 - (event.clientY / window.innerHeight) * 2));
    }

    onMouseMove(event) {
        event.preventDefault();
        this.doOnMouseMove(new THREE.Vector2((event.clientX / window.innerWidth) * 2 - 1, 1 - (event.clientY / window.innerHeight) * 2));
    }

    onMouseUp(event) {
        event.preventDefault();
        this.doOnMouseUp(new THREE.Vector2((event.clientX / window.innerWidth) * 2 - 1, 1 - (event.clientY / window.innerHeight) * 2));
    }

    onTouchStart(event) {
        event.preventDefault();
        this.doOnMouseDown(new THREE.Vector2((event.changedTouches[0].clientX / window.innerWidth) * 2 - 1, 1 - (event.changedTouches[0].clientY / window.innerHeight) * 2));
    }

    onTouchMove(event) {
        event.preventDefault();
        this.doOnMouseMove(new THREE.Vector2((event.changedTouches[0].clientX / window.innerWidth) * 2 - 1, 1 - (event.changedTouches[0].clientY / window.innerHeight) * 2));
    }

    onTouchEnd(event) {
        event.preventDefault();
        this.doOnMouseUp(new THREE.Vector2((event.changedTouches[0].clientX / window.innerWidth) * 2 - 1, 1 - (event.changedTouches[0].clientY / window.innerHeight) * 2));
    }
    
    doOnMouseDown(cursorPosition) {
        if (this.cubeIsCurrentlyRotating()) {
            return;
        }
        this.isMousePressed = true;
        this.dragStart = cursorPosition.clone();
        this.currentlyDraggedCursorPosition = cursorPosition.clone();

        this.raycaster.setFromCamera(this.dragStart, this.camera);

        this.currentlyDraggedPieceSide = this.getPieceSideUnderCursor(cursorPosition);
    }
    
    doOnMouseMove(cursorPosition) {
        if (this.cubeIsCurrentlyRotating()) {
            return;
        }
        if (this.currentlyDraggedPieceSide === null) {
            return;
        }
        if (this.rubikCube.pieces[this.currentlyDraggedPieceSide.pieceKey].sides.length === 1) {

            let dragVector = new THREE.Vector2(cursorPosition.x - this.currentlyDraggedCursorPosition.x, cursorPosition.y - this.currentlyDraggedCursorPosition.y);
            let rotationAxis = new THREE.Vector2(-dragVector.y, dragVector.x);
            let rotationAxis3 = new THREE.Vector3(rotationAxis.x, rotationAxis.y, 0).applyQuaternion(this.camera.getWorldQuaternion(new THREE.Quaternion())).normalize();
            this.rubikCube.rotateOnWorldAxis(rotationAxis3, rotationAxis.length() * 2);

            // dragging center piece
            this.currentlyDraggedCursorPosition = cursorPosition;
            return;
        }
        let pieceSideUnderCursor = this.getPieceSideUnderCursor(cursorPosition);
        if (pieceSideUnderCursor === null) {
            return;
        }
        if (this.currentlyDraggedPieceSide.pieceKey !== pieceSideUnderCursor.pieceKey ||
            this.currentlyDraggedPieceSide.currentFace !== pieceSideUnderCursor.currentFace) {
            this.tryRotate(this.currentlyDraggedPieceSide, pieceSideUnderCursor);
        }
    }
    
    doOnMouseUp(cursorPosition) {
        if (this.cubeIsCurrentlyRotating()) {
            return;
        }
        if (this.currentlyDraggedPieceSide === null) {
            return;
        }
        let pieceSideUnderCursor = this.getPieceSideUnderCursor(cursorPosition);
        if (pieceSideUnderCursor === null) {
            this.resetDrag();
            return;
        }
        if (this.currentlyDraggedPieceSide !== pieceSideUnderCursor) {
            this.tryRotate(this.currentlyDraggedPieceSide, pieceSideUnderCursor);
        }
        this.resetDrag();
    }

    tryRotate(fromPieceSide, toPieceSide) {
        if (fromPieceSide.currentFace !== toPieceSide.currentFace) {
            // pieces are not on the same side!
            this.resetDrag();
            return;
        }

        let fromPiece = this.rubikCube.pieces[fromPieceSide.pieceKey];
        let toPiece = this.rubikCube.pieces[toPieceSide.pieceKey];

        if (fromPiece.sides.length === 3) {
            // dragging corner piece
            let fromPieceFaces = fromPiece.sides.map(side => side.currentFace);
            let toPieceFaces = toPiece.sides.map(side => side.currentFace);

            let rotatingFace = null;
            for (let face of fromPieceFaces) {
                if (face !== fromPieceSide.currentFace && toPieceFaces.includes(face)) {
                    rotatingFace = face;
                }
            }
            if (rotatingFace === null) {
                // WTF?
                this.resetDrag();
                return;
            }
            let fromFace = null;
            for (let face of fromPieceFaces) {
                if (face !== fromPieceSide.currentFace && face !== rotatingFace) {
                    fromFace = face;
                }
            }
            let direction = this.rubikCube.getRotationDirection(rotatingFace, fromFace, fromPieceSide.currentFace);
            if (direction === null) {
                return;
            }
            this.rubikCube.queueRotation(rotatingFace, direction, 0.5);
            this.resetDrag();
        } else if (fromPiece.sides.length === 2) {
            // dragging edge piece
            let fromPieceFaces = fromPiece.sides.map(side => side.currentFace);
            let toPieceFaces = toPiece.sides.map(side => side.currentFace);

            let rotatingFace = null;
            for (let face of fromPieceFaces) {
                if (face !== fromPieceSide.currentFace && toPieceFaces.includes(face)) {
                    rotatingFace = face;
                }
            }
            if (rotatingFace === null) {
                // WTF?
                this.resetDrag();
                return;
            }
            let fromFace = fromPieceSide.currentFace;
            let toFace = null;
            for (let face of toPieceFaces) {
                if (face !== rotatingFace && face !== fromFace) {
                    toFace = face;
                }
            }
            let direction = this.rubikCube.getRotationDirection(rotatingFace, fromFace, toFace);
            if (direction === null) {
                return;
            }
            this.rubikCube.queueRotation(rotatingFace, direction, 0.5);
            this.resetDrag();
        }
    }

    resetDrag() {
        this.currentlyDraggedPieceSide = null;
        this.currentlyDraggedCursorPosition = null;
    }

    getPieceSideUnderCursor(cursorPosition) {
        this.raycaster.setFromCamera(cursorPosition, this.camera);

        let intersects = this.raycaster.intersectObject(this.scene, true);
        let closestIntersect = null;
        intersects.forEach(intersect => {
            if (closestIntersect === null || closestIntersect.distance > intersect.distance) {
                closestIntersect = intersect;
            }
        });
        if (!(closestIntersect === null)) {
            if (closestIntersect.object.name === 'piece side') {
                let piece = closestIntersect.object.pieceRef;
                for (let side of piece.sides) {
                    if (side.mesh === closestIntersect.object) {
                        return {
                            pieceKey: closestIntersect.object.pieceRef.pieceKey,
                            currentFace: side.currentFace
                        };
                    }
                }
            }
        }

        return null;
    }
}

export default MouseHandler;