<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import TWEEN from "@tweenjs/tween.js";

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

            files: ["a", "b", "c", "d", "e", "f", "g", "h"],
            ranks: ["1", "2", "3", "4", "5", "6", "7", "8"],
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
        this.addChessboard(squareGroup);
        this.addPiecesFromFEN(pieceGroup, "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR");

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
        init(scene) {
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.setClearColor(0x000000, 0);
            this.$refs.container.appendChild(this.renderer.domElement);

            // this.controls.enablePan = false;
            this.controls.enableDamping = true;
            this.controls.dampingFactor = 0.05;
            this.controls.screenSpacePanning = false;
            this.controls.minDistance = 50;
            this.controls.maxDistance = 150;
            this.controls.maxPolarAngle = Math.PI / 2.5;

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
        addChessboard(group) {
            const geometry = new THREE.BoxGeometry(
                this.squareSize,
                this.squareHeight,
                this.squareSize
            );

            for (let row = 0; row < this.ranks.length; row++) {
                for (let col = 0; col < this.files.length; col++) {
                    const color = (row + col) % 2 == 0 ? this.lightColor : this.darkColor;
                    const material = new THREE.MeshPhongMaterial({ color });
                    const square = new THREE.Mesh(geometry, material);
                    const x = this.squareSize * (col - this.files.length / 2 + 0.5);
                    const z = this.squareSize * (row - this.ranks.length / 2 + 0.5);
                    square.position.set(x, -this.squareHeight / 2, z);
                    const id = this.files[col] + this.ranks[this.ranks.length - 1 - row];
                    square.name = id;
                    square.data = {
                        type: "square",
                        color: color,
                    };
                    group.add(square);
                }
            }
        },
        addPiecesFromFEN(group, fen) {
            const board = this.FENtoBoard(fen);

            for (let row = 0; row < this.ranks.length; row++) {
                for (let col = 0; col < this.files.length; col++) {
                    const piece = board[row][col];
                    if (piece !== ".") {
                        const geometry = new THREE.BoxGeometry(
                            this.pieceSize,
                            this.pieceHeight[piece.toLowerCase()],
                            this.pieceSize
                        );
                        const color =
                            piece === piece.toUpperCase() ? this.whiteColor : this.blackColor;
                        const material = new THREE.MeshPhongMaterial({ color });
                        const cube = new THREE.Mesh(geometry, material);
                        const x = (col - 3.5) * this.squareSize;
                        const z = (row - 3.5) * this.squareSize;
                        cube.position.set(x, this.pieceHeight[piece.toLowerCase()] / 2, z);
                        const id = this.files[col] + this.ranks[this.ranks.length - 1 - row];
                        cube.name = id;
                        cube.data = {
                            type: "piece",
                            color: color,
                        };
                        group.add(cube);
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
                        this.play(squareGroup, pieceGroup, this.selectedPiece.name, object.name);
                    } else {
                        this.moveObject(
                            this.selectedPiece,
                            this.selectedPiecePosition.x,
                            this.selectedPiecePosition.z
                        );
                    }
                    this.unselectPiece();
                } else {
                    const piece =
                        object.data.type === "piece"
                            ? object
                            : pieceGroup.getObjectByName(object.name);
                    if (piece) {
                        this.selectPiece(piece);
                    }
                }
            } else {
                if (this.selectedPiece) {
                    this.moveObject(
                        this.selectedPiece,
                        this.selectedPiecePosition.x,
                        this.selectedPiecePosition.z
                    );
                    this.unselectPiece();
                }
            }
        },
        hoverObject(object) {
            this.hoveredObject = object;
            object.material.color.set(this.hoverColor);
        },
        removeHoveredObject() {
            if (this.hoveredObject) {
                this.hoveredObject.material.color.set(this.hoveredObject.data.color);
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
                    fromPiece.position.x = this.selectedPiecePosition.x;
                    fromPiece.position.z = this.selectedPiecePosition.z;

                    const targetX = toSquare.position.x;
                    const targetZ = toSquare.position.z;

                    this.moveObject(fromPiece, targetX, targetZ);

                    if (toPiece) {
                        pieceGroup.remove(toPiece);
                    }

                    fromPiece.name = toSquare.name;
                }
            } else {
                console.log("Invalid move");
            }
        },
        FENtoBoard(fen) {
            const board = [];
            const rows = fen.split(" ")[0].split("/");

            for (let row of rows) {
                const rank = [];
                for (let char of row) {
                    if (isNaN(char)) {
                        rank.push(char);
                    } else {
                        for (let i = 0; i < parseInt(char); i++) {
                            rank.push(".");
                        }
                    }
                }
                board.push(rank);
            }
            return board;
        },
    },
};
</script>

<template>
    <div ref="container"></div>
</template>

<style scoped></style>
