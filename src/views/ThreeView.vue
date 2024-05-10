<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import TWEEN from "@tweenjs/tween.js";
import { mapState, mapGetters, mapActions } from "vuex";
import { PlayerColor } from "@/chess/types/PlayerColor";

export default {
    data() {
        return {
            fov: 75,
            aspect: window.innerWidth / window.innerHeight,
            near: 0.1,
            far: 1000,

            lightColor: 0xeeeeee,
            darkColor: 0x444444,
            whiteColor: 0xcccccc,
            blackColor: 0x222222,

            hoverColor: 0xff0000,
            selectColor: 0x0000ff,
            legalColor: 0x00ff00,

            squareSize: 10,
            squareHeight: 2,
            pieceSize: 4,
            pieceHeight: {
                p: 4,
                r: 8,
                n: 6,
                b: 7,
                q: 10,
                k: 12,
            },

            camera: undefined,
            renderer: undefined,
            controls: undefined,
            raycaster: undefined,
            mouse: undefined,
            plane: undefined,

            squareGroup: undefined,
            pieceGroup: undefined,

            hoveredObject: undefined,
            selectedPiece: undefined,
            selectedPiecePosition: undefined,
        };
    },
    mounted() {
        const scene = new THREE.Scene();
        const squareGroup = new THREE.Group();
        const pieceGroup = new THREE.Group();
        scene.add(squareGroup);
        scene.add(pieceGroup);

        this.camera = new THREE.PerspectiveCamera(this.fov, this.aspect, this.near, this.far);
        this.renderer = new THREE.WebGLRenderer({ alpha: true });
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.mouse = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();
        this.plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

        this.init(scene);
        this.addAxis(scene);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(1, 1, 1).normalize();
        scene.add(directionalLight);

        const loader = new GLTFLoader();

        loader.load(
            "/models/chessboard.glb",
            function (gltf) {
                const group = gltf.scene;
                console.log(group);
                group.scale.multiplyScalar(100);
                scene.add(group);
            },
            undefined,
            function (error) {
                console.error(error);
            }
        );

        // this.gameExists(ChessVariant.Standard).then((exists) => {
        //     if (exists) {
        //         this.addChessboard(squareGroup);
        //         this.addPieces(pieceGroup);
        //     } else {
        //         this.createTwoPlayerChessGame(ChessVariant.Standard).then(() => {
        //             this.addChessboard(squareGroup);
        //             this.addPieces(pieceGroup);
        //         });
        //     }
        // });

        this.animate(scene);

        this.$refs.container.addEventListener("mousemove", (event) => {
            this.handleMouseMove(event, squareGroup, pieceGroup);
        });

        this.$refs.container.addEventListener("click", (event) => {
            this.handleMouseClick(event, squareGroup, pieceGroup);
        });

        window.addEventListener("resize", this.onWindowResize);
    },
    methods: {
        ...mapState(["chessboard", "legalMoves"]),
        ...mapGetters([]),
        ...mapActions(["gameExists", "createTwoPlayerChessGame", "checkLegalMove", "move"]),
        hasLegalMove(squareName) {
            return squareName in this.legalMoves();
        },
        isLegalMove(fromSquareName, toSquareName) {
            return (
                this.hasLegalMove(fromSquareName) &&
                toSquareName in this.legalMoves()[fromSquareName]
            );
        },

        init(scene) {
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.setClearColor(0x000000, 0);
            this.$refs.container.appendChild(this.renderer.domElement);

            // this.controls.enablePan = false;
            this.controls.enableDamping = true;
            this.controls.dampingFactor = 0.05;
            this.controls.screenSpacePanning = false;
            // this.controls.minDistance = 50;
            // this.controls.maxDistance = 150;
            // this.controls.maxPolarAngle = Math.PI / 2.5;

            this.camera.position.set(50, 50, 50);
            this.camera.lookAt(0, 0, 0);

            const light = new THREE.DirectionalLight(0xffffff, 5);
            light.position.set(0, 50, 0);
            this.camera.add(light);

            const cameraPole = new THREE.Object3D();
            cameraPole.add(this.camera);
            scene.add(cameraPole);
        },
        animate(scene) {
            requestAnimationFrame(() => {
                this.animate(scene);
            });
            this.controls.update();
            TWEEN.update();
            this.renderer.render(scene, this.camera);
        },
        onWindowResize() {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        },
        addAxis(scene) {
            const axesHelper = new THREE.AxesHelper(100);
            scene.add(axesHelper);
        },
        addChessboard(squareGroup) {
            const geometry = new THREE.BoxGeometry(
                this.squareSize,
                this.squareHeight,
                this.squareSize
            );

            for (const [rankIndex, rank] of this.chessboard().reversedRanks.entries()) {
                for (const [fileIndex, file] of this.chessboard().files.entries()) {
                    const color =
                        (fileIndex + rankIndex) % 2 == 0 ? this.lightColor : this.darkColor;

                    const material = new THREE.MeshPhongMaterial({ color });
                    const square = new THREE.Mesh(geometry, material);

                    const x =
                        this.squareSize * (fileIndex - this.chessboard().files.length / 2 + 0.5);
                    const z =
                        this.squareSize * (rankIndex - this.chessboard().ranks.length / 2 + 0.5);

                    square.position.set(x, -this.squareHeight / 2, z);
                    square.name = file + rank;
                    square.data = {
                        type: "square",
                        color: color,
                    };
                    squareGroup.add(square);
                }
            }
        },
        addPieces(pieceGroup) {
            for (const [rankIndex, rank] of this.chessboard().reversedRanks.entries()) {
                for (const [fileIndex, file] of this.chessboard().files.entries()) {
                    const squareName = file + rank;
                    const piece = this.chessboard().squares.get(squareName);
                    if (piece) {
                        const geometry = new THREE.BoxGeometry(
                            this.pieceSize,
                            this.pieceHeight[piece.name],
                            this.pieceSize
                        );
                        const color =
                            piece.color === PlayerColor.White ? this.whiteColor : this.blackColor;

                        const material = new THREE.MeshPhongMaterial({ color });
                        const cube = new THREE.Mesh(geometry, material);

                        const x =
                            this.squareSize *
                            (fileIndex - this.chessboard().files.length / 2 + 0.5);
                        const z =
                            this.squareSize *
                            (rankIndex - this.chessboard().ranks.length / 2 + 0.5);

                        cube.position.set(x, this.pieceHeight[piece.name] / 2, z);
                        cube.name = squareName;
                        cube.data = {
                            type: "piece",
                            color: color,
                        };
                        pieceGroup.add(cube);
                    }
                }
            }
        },
        handleMouseMove(event, squareGroup, pieceGroup) {
            const containerRect = this.$refs.container.getBoundingClientRect();
            const offsetX = event.clientX - containerRect.left;
            const offsetY = event.clientY - containerRect.top;

            this.mouse.x = (offsetX / containerRect.width) * 2 - 1;
            this.mouse.y = -(offsetY / containerRect.height) * 2 + 1;

            this.raycaster.setFromCamera(this.mouse, this.camera);

            const objects = squareGroup.children.concat(pieceGroup.children);
            const intersections = this.raycaster.intersectObjects(objects);

            let object = undefined;
            if (intersections.length > 0) {
                object = intersections[0].object;
                if (this.selectedPiece && object.uuid === this.selectedPiece.uuid) {
                    object = intersections.length > 1 ? intersections[1].object : undefined;
                }
            }

            this.removeHoveredObject();
            if (object) {
                this.hoverObject(object);
            }

            this.dragSelectedPiece();
        },
        handleMouseClick(event, squareGroup, pieceGroup) {
            const containerRect = this.$refs.container.getBoundingClientRect();
            const offsetX = event.clientX - containerRect.left;
            const offsetY = event.clientY - containerRect.top;

            this.mouse.x = (offsetX / containerRect.width) * 2 - 1;
            this.mouse.y = -(offsetY / containerRect.height) * 2 + 1;

            this.raycaster.setFromCamera(this.mouse, this.camera);

            const objects = squareGroup.children.concat(pieceGroup.children);
            const intersections = this.raycaster.intersectObjects(objects);

            let object = undefined;
            if (intersections.length > 0) {
                object = intersections[0].object;
                if (this.selectedPiece && object.uuid === this.selectedPiece.uuid) {
                    object = intersections.length > 1 ? intersections[1].object : undefined;
                }
            }

            if (object) {
                if (this.selectedPiece) {
                    if (object.name !== this.selectedPiece.name) {
                        const fromSquareName = this.selectedPiece.name;
                        const toSquareName = object.name;
                        this.checkLegalMove({ fromSquareName, toSquareName }).then(
                            (isLegalMove) => {
                                if (isLegalMove) {
                                    this.play(
                                        squareGroup,
                                        pieceGroup,
                                        fromSquareName,
                                        toSquareName
                                    );
                                } else {
                                    this.putBackSelectedPieceToItsPosition();
                                }
                                this.removeLegalSquares(squareGroup);
                                this.unselectPiece();
                            }
                        );
                    } else {
                        this.removeLegalSquares(squareGroup);
                        this.putBackSelectedPieceToItsPosition();
                        this.unselectPiece();
                    }
                } else {
                    const piece =
                        object.data.type === "piece"
                            ? object
                            : pieceGroup.getObjectByName(object.name);
                    if (piece) {
                        if (this.hasLegalMove(object.name)) {
                            this.selectPiece(piece);
                            this.revealLegalSquares(squareGroup);
                        }
                    }
                }
            } else {
                if (this.selectedPiece) {
                    this.removeLegalSquares(squareGroup);
                    this.putBackSelectedPieceToItsPosition();
                    this.unselectPiece();
                }
            }
        },
        revealLegalSquares(squareGroup) {
            if (this.selectedPiece) {
                for (const square of squareGroup.children) {
                    if (this.isLegalMove(this.selectedPiece.name, square.name)) {
                        square.material.color.set(this.legalColor);
                    }
                }
            }
        },
        removeLegalSquares(squareGroup) {
            for (const square of squareGroup.children) {
                square.material.color.set(square.data.color);
            }
        },
        hoverObject(object) {
            this.hoveredObject = object;
            object.material.color.set(this.hoverColor);
        },
        removeHoveredObject() {
            if (this.hoveredObject) {
                if (
                    this.selectedPiece &&
                    this.isLegalMove(this.selectedPiece.name, this.hoveredObject.name)
                ) {
                    this.hoveredObject.material.color.set(this.legalColor);
                } else {
                    this.hoveredObject.material.color.set(this.hoveredObject.data.color);
                }
                this.hoveredObject = undefined;
            }
        },
        selectPiece(piece) {
            this.removeHoveredObject();
            this.selectedPiece = piece;
            this.selectedPiecePosition = {
                x: piece.position.x,
                z: piece.position.z,
            };
            piece.material.color.set(this.selectColor);
        },
        putBackSelectedPieceToItsPosition() {
            this.moveObject(
                this.selectedPiece,
                this.selectedPiecePosition.x,
                this.selectedPiecePosition.z
            );
        },
        unselectPiece() {
            if (this.selectedPiece) {
                this.selectedPiece.material.color.set(this.selectedPiece.data.color);
                this.selectedPiece = undefined;
                this.selectedPiecePosition = undefined;
            }
        },
        dragSelectedPiece() {
            if (this.selectedPiece) {
                var point = new THREE.Vector3();
                this.raycaster.ray.intersectPlane(this.plane, point);

                this.selectedPiece.position.x = point.x;
                this.selectedPiece.position.z = point.z;
            }
        },
        moveObject(object, targetX, targetZ) {
            new TWEEN.Tween(object.position)
                .to({ x: targetX, z: targetZ }, 500)
                .easing(TWEEN.Easing.Quadratic.Out)
                .start();
        },
        play(squareGroup, pieceGroup, fromSquareName, toSquareName) {
            const fromSquare = squareGroup.getObjectByName(fromSquareName);
            const fromPiece = pieceGroup.getObjectByName(fromSquareName);
            const toSquare = squareGroup.getObjectByName(toSquareName);
            const toPiece = pieceGroup.getObjectByName(toSquareName);

            if (fromSquare && toSquare) {
                if (!fromPiece) {
                    console.log("No piece to move");
                } else {
                    // fromPiece.position.x = this.selectedPiecePosition.x;
                    // fromPiece.position.z = this.selectedPiecePosition.z;

                    const targetX = toSquare.position.x;
                    const targetZ = toSquare.position.z;

                    this.moveObject(fromPiece, targetX, targetZ);

                    if (toPiece) {
                        pieceGroup.remove(toPiece);
                    }

                    fromPiece.name = toSquare.name;

                    this.move({ fromSquareName, toSquareName });
                }
            }
        },
    },
};
</script>

<template>
    <div ref="container"></div>
</template>

<style scoped></style>
