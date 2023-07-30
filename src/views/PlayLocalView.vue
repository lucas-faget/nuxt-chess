<script lang="ts">
	import Background from '@/components/Background.vue'
	import Chessboard from '@/components/Chessboard.vue'
	import PlayerBar from '@/components/PlayerBar.vue'
	import Actions from '@/components/Actions.vue'
	import Options from '@/components/Options.vue'
	import { SquareColor } from '@/enums/SquareColor';
	import { ChessLocal } from '../chess/ChessLocal'
	import json from "@/json/classic-chessboard.json";
	import { Blacks, Whites } from '@/chess/players/Players'
	import { ChessVariant } from '@/enums/ChessVariant'

	export default {
		components: { Chessboard, Actions, PlayerBar, Options, Background },
		props: {
			variant: {
				type: String as () => ChessVariant,
				default: ChessVariant.Standard
			}
		},
		data() {
			return {
				chess: new ChessLocal(json, [Whites, Blacks]),
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
				{{ variant }}
				<PlayerBar :name="topPlayerName" :advantage="topAdvantage" />
			</div>
			<div class="chessboard">
				<Chessboard :chess="chess" :squareColor="squareColor" />
			</div>
			<div>
				<PlayerBar :name="bottomPlayerName" :advantage="bottomAdvantage" />
			</div>
			<div>
				<Actions :chess="chess" />
			</div>
			<div>
				<Options :squareColor="squareColor" @change-square-color="setSquareColor" />
			</div>
		</div>
	</div>
</template>

<style scoped>
	.chess {
		padding-block: 30px;
		display: flex;
		justify-content: center;

	}

	.chess > div {
		width: min(100vw, 520px);
	}

	.chessboard {
        aspect-ratio: 1 / 1;
	}
</style>
