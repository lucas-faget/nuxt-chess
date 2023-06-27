<script lang="ts">
	import Background from '@/components/Background.vue'
	import Chessboard from '@/components/Chessboard.vue'
	import PlayerBar from '@/components/PlayerBar.vue'
	import Buttons from '@/components/Buttons.vue'
	import Options from '@/components/Options.vue'
	import { SquareColor } from '../components/enums/SquareColor';
	import { ChessLocal } from '../chess/ChessLocal'
	import { ChessSocket } from '../chess/ChessSocket'

	export default {
		components: { Chessboard, Buttons, PlayerBar, Options, Background },
		props: ['isLocal'],
		data() {
			return {
				chess: this.isLocal ? new ChessLocal() : new ChessSocket(),
				squareColor: this.isLocal ? SquareColor.Brown : SquareColor.Gray,
			}
		},
		computed: {
			topPlayerName(): string {
				return this.chess.isChessboardSpun ? this.chess.players[0].name : this.chess.players[1].name;
			},
			bottomPlayerName(): string {
				return this.chess.isChessboardSpun ? this.chess.players[1].name : this.chess.players[0].name;
			},
			topAdvantage(): number {
				return this.chess.isChessboardSpun ? this.chess.players[0].advantage : this.chess.players[1].advantage;
			},
			bottomAdvantage(): number {
				return this.chess.isChessboardSpun ? this.chess.players[1].advantage : this.chess.players[0].advantage;
			}
		},
		methods: {
			setSquareColor(squareColor: SquareColor) {
				this.squareColor = squareColor;
			}
		}
	}
</script>

<template>
	<Background />

	<div class="chess">
		<div>
			<div>
				<PlayerBar :name="topPlayerName" :advantage="topAdvantage" />
			</div>
			<div>
				<Chessboard :chess="chess" :squareColor="squareColor" />
			</div>
			<div>
				<PlayerBar :name="bottomPlayerName" :advantage="bottomAdvantage" />
			</div>
			<div>
				<Buttons :chess="chess" />
			</div>
			<div>
				<Options :squareColor="squareColor" @change-square-color="setSquareColor" />
			</div>
		</div>
	</div>
</template>

<style>
	.chess {
		display: flex;
		justify-content: center;
		padding-block: 30px;
	}
</style>
