<script lang="ts">
	import Background from '@/components/Background.vue'
	import Chessboard from '@/components/Chessboard.vue'
	import PlayerBar from '@/components/PlayerBar.vue'
	import Actions from '@/components/Actions.vue'
	import Options from '@/components/Options.vue'
	import { SquareColor } from '@/enums/SquareColor';
	import { ChessLocal } from '../chess/ChessLocal'
	import { ChessVariant } from '@/enums/ChessVariant'
	import type { PlayerColor } from '@/chess/enums/PlayerColor'
import type { PieceName } from '@/chess/enums/PieceName'

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
				chess: new ChessLocal(this.variant),
				lightSquareColor: SquareColor.Gray,
				darkSquareColor: SquareColor.Gray,
			}
		},
		computed: {
			topPlayerName(): string {
				return this.chess.isChessboardSpun ? this.chess.players[0].name : this.chess.players[1].name;
			},
			bottomPlayerName(): string {
				return this.chess.isChessboardSpun ? this.chess.players[1].name : this.chess.players[0].name;
			},
			topPlayerColor(): PlayerColor {
				return this.chess.isChessboardSpun ? this.chess.players[0].color : this.chess.players[1].color;
			},
			bottomPlayerColor(): PlayerColor {
				return this.chess.isChessboardSpun ? this.chess.players[1].color : this.chess.players[0].color;
			},
			topOpponentPlayerColor(): PlayerColor {
				return this.chess.isChessboardSpun ? this.chess.players[1].color : this.chess.players[0].color;
			},
			bottomOpponentPlayerColor(): PlayerColor {
				return this.chess.isChessboardSpun ? this.chess.players[0].color : this.chess.players[1].color;
			},
			topAdvantage(): number {
				return this.chess.isChessboardSpun ? this.chess.players[0].advantage : this.chess.players[1].advantage;
			},
			bottomAdvantage(): number {
				return this.chess.isChessboardSpun ? this.chess.players[1].advantage : this.chess.players[0].advantage;
			},
			topCapturedPieces(): Map<PieceName, number> {
				return this.chess.isChessboardSpun ? this.chess.players[1].capturedPieces : this.chess.players[0].capturedPieces;
			},
			bottomCapturedPieces(): Map<PieceName, number> {
				return this.chess.isChessboardSpun ? this.chess.players[0].capturedPieces : this.chess.players[1].capturedPieces;
			}
		},
		methods: {
			setLightSquareColor(squareColor: SquareColor) {
				this.lightSquareColor = squareColor;
			},
			setDarkSquareColor(squareColor: SquareColor) {
				this.darkSquareColor = squareColor;
			}
		}
	}
</script>

<template>
	<div class="chess">
		<div>
			<div>
				<PlayerBar 
					:name="topPlayerName"
					:playerColor="topPlayerColor"
					:opponentPlayerColor="topOpponentPlayerColor"
					:capturedPiecesByPieceName="topCapturedPieces"
					:advantage="topAdvantage"
					style="border-radius: 10px 10px 0 0;"
				/>
			</div>
			<div class="chessboard">
				<Chessboard 
					:chess="chess"
					:lightSquareColor="lightSquareColor"
					:darkSquareColor="darkSquareColor"
				/>
			</div>
			<div>
				<PlayerBar 
					:name="bottomPlayerName"
					:playerColor="bottomPlayerColor"
					:opponentPlayerColor="bottomOpponentPlayerColor"
					:capturedPiecesByPieceName="bottomCapturedPieces"
					:advantage="bottomAdvantage"
				/>
			</div>
			<div>
				<Actions :chess="chess" />
			</div>
			<div>
				<Options 
					:lightSquareColor="lightSquareColor"
					:darkSquareColor="darkSquareColor"
					@change-light-square-color="setLightSquareColor"
					@change-dark-square-color="setDarkSquareColor"
					style="border-radius: 0 0 10px 10px;"
				/>
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
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.chess > div > div {
		width: min(100vw, 520px);
	}

	.chessboard {
        aspect-ratio: 1 / 1;
	}
</style>
