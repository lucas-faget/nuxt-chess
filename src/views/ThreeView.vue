<script lang="ts">
	import * as THREE from 'three';
	import { MapControls } from 'three/examples/jsm/controls/MapControls.js';
	
	export default {
		mounted() {
			const scene = new THREE.Scene();
			const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
			const renderer = new THREE.WebGLRenderer({ alpha: true });
			const controls = new MapControls(camera, renderer.domElement);

			renderer.setSize(window.innerWidth, window.innerHeight);
			renderer.setClearColor(0x000000, 0);
			this.$refs.container.appendChild(renderer.domElement);

			controls.mouseButtons = {
				LEFT: THREE.MOUSE.LEFT,
				RIGHT: THREE.MOUSE.LEFT
			};
			controls.enablePan = false;
			controls.enableDamping = true;
			controls.dampingFactor = 0.05;
			controls.screenSpacePanning = false;
			controls.minDistance = 50;
			controls.maxDistance = 150;
			controls.maxPolarAngle = Math.PI / 2.5;

			this.addAxis(scene);
			this.addChessboard(scene);
			this.addChessPieces(scene);

			camera.position.set(50, 50, 50);
			camera.lookAt(0, 0, 0);

			function animate() {
				requestAnimationFrame(animate);
				controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
				renderer.render(scene, camera);
			}

			function onWindowResize() {
				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize(window.innerWidth, window.innerHeight);
			}

			window.addEventListener('resize', onWindowResize);

			animate();
		},
		methods: {
			addAxis(scene) {
				const axesHelper = new THREE.AxesHelper(100);
				scene.add(axesHelper);
			},
			addChessboard(scene) {
				const squareNumber = 8;
				const squareSize = 10;
				const squareY = 2;

				const geometry = new THREE.BoxGeometry(squareSize, squareY, squareSize);
				const lightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
				const darkMaterial = new THREE.MeshBasicMaterial({ color: 0x666666 });

				for (let x = 0; x < 8; x++) {
					for (let y = 0; y < 8; y++) {
						let material = (x + y) % 2 == 0 ? lightMaterial : darkMaterial;
						let square = new THREE.Mesh(geometry, material);
						let xx = squareSize * (x - squareNumber / 2 + 0.5);
						let yy = squareSize * (y - squareNumber / 2 + 0.5);
						square.position.set(xx, - squareY / 2, yy);
						scene.add(square);
					}
				}
			},
			addChessPieces(scene) {
				const pieceSize: number = 6;
				const pieceY: number = 10;

				const geometry = new THREE.BoxGeometry(pieceSize, pieceY, pieceSize);
				const whiteMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
				const blackMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
			}
		}
	}
</script>

<template>
	<div ref="container"></div>
</template>

<style scoped>

</style>
