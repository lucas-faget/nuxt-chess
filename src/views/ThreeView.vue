<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import TWEEN from "@tweenjs/tween.js";
import { mapState, mapGetters, mapActions } from "vuex";
import { ChessVariant } from "@/chess/types/ChessVariant";
import { PlayerColor } from "@/chess/types/PlayerColor";

export default {
    data() {
        return {
            fov: 75,
            aspect: window.innerWidth / window.innerHeight,
            near: 0.1,
            far: 1000,

            squareSize: 0.05,

            whiteColor: 0xffffff,
            blackColor: 0x000000,
            hoverColor: 0xff0000,
            selectColor: 0x0000ff,
            legalColor: 0x00ff00,

            whiteMaterial: undefined,
            blackMaterial: undefined,
            hoverMaterial: undefined,
            selectMaterial: undefined,
            legalMaterial: undefined,

            camera: undefined,
            renderer: undefined,
            controls: undefined,
            raycaster: undefined,
            mouse: undefined,
            plane: undefined,
            loader: undefined,

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
        this.loader = new GLTFLoader();

        this.init(scene);
        this.addAxis(scene);

        this.gameExists(ChessVariant.Standard).then((exists) => {
            if (exists) {
                this.loadChessboard(scene, squareGroup);
                this.addPieces(pieceGroup);
            } else {
                this.createTwoPlayerChessGame(ChessVariant.Standard).then(() => {
                    this.loadChessboard(scene, squareGroup);
                    this.addPieces(pieceGroup);
                });
            }
        });

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
        ...mapActions(["gameExists", "createTwoPlayerChessGame", "checkLegalMove", "tryMove"]),

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
            this.whiteMaterial = new THREE.MeshStandardMaterial({ color: this.whiteColor });
            this.blackMaterial = new THREE.MeshStandardMaterial({ color: this.blackColor });
            this.hoverMaterial = new THREE.MeshStandardMaterial({ color: this.hoverColor });
            this.selectMaterial = new THREE.MeshStandardMaterial({ color: this.selectColor });
            this.legalMaterial = new THREE.MeshStandardMaterial({ color: this.legalColor });

            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.setClearColor(0x000000, 0);
            this.$refs.container.appendChild(this.renderer.domElement);

            // this.controls.enablePan = false;
            this.controls.enableDamping = true;
            this.controls.dampingFactor = 0.05;
            this.controls.screenSpacePanning = false;
            // this.controls.minDistance = 0.3;
            this.controls.maxDistance = 1;
            // this.controls.maxPolarAngle = Math.PI / 2.5;

            this.camera.position.set(0.3, 0.3, 0.3);
            this.camera.lookAt(0, 0, 0);

            const light = new THREE.DirectionalLight(0xffffff, 5);
            light.position.set(0, 0.5, 0);
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
            const axesHelper = new THREE.AxesHelper(1);
            scene.add(axesHelper);
        },
        loadChessboard(scene, squareGroup) {
            this.loader.load(
                "/models/chessboard.glb",
                function (gltf) {
                    const chessboard = gltf.scene.children[0];
                    chessboard.children.forEach((child, index) => {
                        child.position.x -= 0.2;
                        child.position.z += 0.2;

                        if (index > 1) {
                            const square = child.clone();
                            square.name = child.name.toLowerCase();
                            square.userData.type = "square";
                            square.userData.material = child.material;
                            squareGroup.add(square);
                        } else {
                            scene.add(child.clone());
                        }
                    });
                },
                undefined,
                function (error) {
                    console.error(error);
                }
            );
        },
        addPieces(pieceGroup) {
            for (const [rankIndex, rank] of this.chessboard().reversedRanks.entries()) {
                for (const [fileIndex, file] of this.chessboard().files.entries()) {
                    const squareName = file + rank;
                    const piece = this.chessboard().squares.get(squareName);
                    if (piece) {
                        const cubeSize = 0.02;
                        const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
                        const material =
                            piece.color === PlayerColor.White
                                ? this.whiteMaterial
                                : this.blackMaterial;

                        const cube = new THREE.Mesh(geometry, material);
                        const x =
                            this.squareSize *
                            (fileIndex - this.chessboard().files.length / 2 + 0.5);
                        const z =
                            this.squareSize *
                            (rankIndex - this.chessboard().ranks.length / 2 + 0.5);

                        cube.position.set(x, cubeSize / 2, z);
                        cube.name = squareName;
                        cube.userData.type = "piece";
                        cube.userData.material = material;
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
                        object.userData?.type === "piece"
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
                        square.material = this.legalMaterial;
                    }
                }
            }
        },
        removeLegalSquares(squareGroup) {
            for (const square of squareGroup.children) {
                square.material = square.userData.material;
            }
        },
        hoverObject(object) {
            this.hoveredObject = object;
            object.material = this.hoverMaterial;
        },
        removeHoveredObject() {
            if (this.hoveredObject) {
                if (
                    this.selectedPiece &&
                    this.hoveredObject.userData.type === "square" &&
                    this.isLegalMove(this.selectedPiece.name, this.hoveredObject.name)
                ) {
                    this.hoveredObject.material = this.legalMaterial;
                } else {
                    this.hoveredObject.material = this.hoveredObject.userData.material;
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
            piece.material = this.selectMaterial;
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
                this.selectedPiece.material = this.selectedPiece.userData.material;
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

                    this.tryMove({ fromSquareName, toSquareName });
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
