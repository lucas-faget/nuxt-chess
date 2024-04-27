<script>
	import * as THREE from 'three';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
	
	export default
	{
		data()
		{
			return {
				fov: 75,
				aspect: window.innerWidth / window.innerHeight,
				near: 0.1,
				far: 1000,

				lightColor: 0xeeeeee,
				darkColor: 0x444444,
				whiteColor: 0xcccccc,
				blackColor: 0x222222,

				files: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
				ranks: ['8', '7', '6', '5', '4', '3', '2', '1'],
				squareSize: 10,
				squareHeight: 2,
				pieceSize: 4,
				pieceHeight: {
					'p': 4,
					'r': 8,
					'n': 6,
					'b': 7,
					'q': 10,
					'k': 12,
				},

				mouse: new THREE.Vector2(),
      			raycaster: new THREE.Raycaster()
			}
		},
		mounted()
		{
			const scene = new THREE.Scene();
			const camera = new THREE.PerspectiveCamera(this.fov, this.aspect, this.near, this.far);
			const renderer = new THREE.WebGLRenderer({ alpha: true });
			const controls = new OrbitControls(camera, renderer.domElement);

			this.init(scene, camera, renderer, controls);

			this.addAxis(scene);
			this.addChessboard(scene);
			this.addPiecesFromFEN(scene, "rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR");

			this.animate(scene, camera, renderer, controls);

			this.$refs.container.addEventListener('mousemove', (event) => {
				this.handleMouseMove(event, scene, camera);
			});

			window.addEventListener('resize', () => {
				this.onWindowResize(camera, renderer);
			});
		},
		methods:
		{
			init(scene, camera, renderer, controls)
			{
				renderer.setSize(window.innerWidth, window.innerHeight);
				renderer.setClearColor(0x000000, 0);
				this.$refs.container.appendChild(renderer.domElement);

				// controls.enablePan = false;
				controls.enableDamping = true;
				controls.dampingFactor = 0.05;
				controls.screenSpacePanning = false;
				controls.minDistance = 50;
				controls.maxDistance = 150;
				controls.maxPolarAngle = Math.PI / 2.5;

				camera.position.set(50, 50, 50);
				camera.lookAt(0, 0, 0);

				const light = new THREE.DirectionalLight(0xffffff, 5);
				light.position.set(0, 50, 0);
				camera.add(light);

				const cameraPole = new THREE.Object3D();
				cameraPole.add(camera);
				scene.add(cameraPole);
			},
			animate(scene, camera, renderer, controls)
			{
				requestAnimationFrame(() => {
					this.animate(scene, camera, renderer, controls);
				});
				controls.update();
				renderer.render(scene, camera);
			},
			onWindowResize(camera, renderer)
			{
				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize(window.innerWidth, window.innerHeight);
			},
			addAxis(scene)
			{
				const axesHelper = new THREE.AxesHelper(100);
				scene.add(axesHelper);
			},
			addChessboard(scene)
			{
				const geometry = new THREE.BoxGeometry(this.squareSize, this.squareHeight, this.squareSize);

				for (let row = 0; row < this.ranks.length; row++) {
					for (let col = 0; col < this.files.length; col++) {
						const color = (row + col) % 2 == 0 ? this.lightColor : this.darkColor;
						const material = new THREE.MeshPhongMaterial({ color });
						const square = new THREE.Mesh(geometry, material);
						const x = this.squareSize * (row - this.ranks.length / 2 + 0.5);
						const y = this.squareSize * (col - this.ranks.length / 2 + 0.5);
						square.position.set(x, - this.squareHeight / 2, y);
						scene.add(square);
					}
				}
			},
			addPiecesFromFEN(scene, fen)
			{
				const board = this.FENtoBoard(fen);

				for (let row = 0; row < this.ranks.length; row++) {
					for (let col = 0; col < this.files.length; col++) {
						const piece = board[row][col];
						if (piece !== '.') {
							const geometry = new THREE.BoxGeometry(this.pieceSize, this.pieceHeight[piece.toLowerCase()], this.pieceSize);
							const color = piece === piece.toUpperCase() ? this.whiteColor : this.blackColor;
							const material = new THREE.MeshPhongMaterial({ color });	
							const cube = new THREE.Mesh(geometry, material);
							cube.position.set((col - 3.5) * this.squareSize, this.pieceHeight[piece.toLowerCase()] / 2, (row - 3.5) * this.squareSize);
							const id = this.files[col] + this.ranks[row];
							cube.data = {
								type: "piece",
								id,
								color
							};
							scene.add(cube);
						}
					}
				}
			},
			handleMouseMove(event, scene, camera)
			{
				const containerRect = this.$refs.container.getBoundingClientRect();
				const offsetX = event.clientX - containerRect.left;
				const offsetY = event.clientY - containerRect.top;

				this.mouse.x = (offsetX / containerRect.width) * 2 - 1;
				this.mouse.y = - (offsetY / containerRect.height) * 2 + 1;

				this.raycaster.setFromCamera(this.mouse, camera);

				const intersects = this.raycaster.intersectObjects(scene.children);

				scene.children.forEach((child) => {
					if (child.data?.type === "piece") {
						child.material.color.set(child.data.color);
					}
				});

				if (intersects.length > 0) {
					const data = intersects[0].object.data;
					if (data?.type === "piece") {
						console.log("Pièce d'ID: ", data.id);
						intersects[0].object.material.color.set(0xff0000);
					}
				}
			},
			FENtoBoard(fen)
			{
				const board = [];
				const rows = fen.split(' ')[0].split('/');

				for (let row of rows) {
					const rank = [];
					for (let char of row) {
						if (isNaN(char)) {
							rank.push(char);
						} else {
							for (let i = 0; i < parseInt(char); i++) {
								rank.push('.');
							}
						}
					}
					board.push(rank);
				}
				return board;
			}
		}
	}
</script>

<template>
	<div ref="container"></div>
</template>

<style scoped>

</style>
