<script lang="ts">
    import Square from '@/components/Square.vue'

    export default {
        components: { Square },
        props: ['chess', 'squareColor'],
        data() {
            return {
                fromSquareName: ""
            }
        },
        computed: {
            ranks(): string[] {
                return this.chess.isChessboardSpun ? this.chess.chessboard.ranks : this.chess.chessboard.reverseRanks;
            },
            files(): string[] {
                return this.chess.isChessboardSpun ? this.chess.chessboard.reverseFiles : this.chess.chessboard.files;
            }
        },
        methods: {
            clickSquare(squareName: string): void
            {
                if (this.chess.canPlay()) {
                    if (this.chess.controller.hasLegalMove(this.fromSquareName, squareName)) {
                        let move = this.chess.controller.getLegalMove(this.fromSquareName, squareName);
                        this.chess.saveMove(move);
                        this.fromSquareName = "";
                    } else {
                        if (this.fromSquareName !== squareName) {
                            this.fromSquareName = squareName;
                        } else {
                            this.fromSquareName = "";
                        }
                    }
                }
            },
            isLegal(squareName: string): boolean
            {
                return this.chess.canPlay() && this.chess.controller.hasLegalMove(this.fromSquareName, squareName);
            },
        }
    }
</script>

<template>
	<div class="chessboard">
		<template v-for="rank in ranks" :key="rank">
            <template v-for="file in files" :key="file">
                <Square :square="chess.chessboard.getSquareByName(file + rank)" 
                        :squareColor="squareColor"
                        :isLegal="isLegal(file + rank)" 
                        @click="clickSquare(file + rank)" 
                />
            </template>
        </template>
	</div>
</template>

<style>
    :root {
        --square-size: min(calc(100vw / 8), 65px);
    }

    .chessboard {
        display: grid;
        grid-template-columns: repeat(8, var(--square-size));
        grid-template-rows: repeat(8, var(--square-size));
    }
</style>
