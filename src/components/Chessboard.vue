<script lang="ts">
import { mapState, mapGetters, mapActions } from "vuex";
import { ChessVariant } from "../chess/types/ChessVariant";
import { SquareColor } from "../types/SquareColor";
import Square from "./Square.vue";

export default {
    components: { Square },
    props: {
        lightSquareColor: {
            type: String as () => SquareColor,
            default: SquareColor.Gray,
        },
        darkSquareColor: {
            type: String as () => SquareColor,
            default: SquareColor.Gray,
        },
    },
    data() {
        return {
            fromSquareName: null as string | null,
        };
    },
    computed: {
        rows(): string[] {
            switch (this.playerInFrontIndex()) {
                case 1:
                    return this.variant() === ChessVariant.FourPlayer
                        ? this.chessboard().reversedFiles
                        : this.chessboard().ranks;
                case 2:
                    return this.chessboard().ranks;
                case 3:
                    return this.chessboard().files;
                case 0:
                default:
                    return this.chessboard().reversedRanks;
            }
        },
        columns(): string[] {
            switch (this.playerInFrontIndex()) {
                case 1:
                    return this.variant() === ChessVariant.FourPlayer
                        ? this.chessboard().reversedRanks
                        : this.chessboard().reversedFiles;
                case 2:
                    return this.chessboard().reversedFiles;
                case 3:
                    return this.chessboard().ranks;
                case 0:
                default:
                    return this.chessboard().files;
            }
        },
        isPerpendicular(): boolean {
            return (
                (this.variant() === ChessVariant.FourPlayer && this.playerInFrontIndex() === 1) ||
                this.playerInFrontIndex() === 3
            );
        },
        gridStyle() {
            return {
                gridTemplateColumns: `repeat(${this.chessboard().files.length}, ${
                    100 / this.chessboard().files.length
                }%)`,
                gridTemplateRows: `repeat(${this.chessboard().ranks.length}, ${
                    100 / this.chessboard().ranks.length
                }%)`,
            };
        },
    },
    methods: {
        ...mapState(["variant", "chessboard", "playerInFrontIndex", "legalMoves"]),
        ...mapGetters(["isActiveMoveTheLast"]),
        ...mapActions(["checkLegalMove", "tryMove"]),

        getSquareName(column: string, row: string): string {
            return this.isPerpendicular ? row + column : column + row;
        },
        hasLegalMove(squareName: string) {
            return squareName in this.legalMoves();
        },
        isLegalMove(fromSquareName: string, toSquareName: string): boolean {
            return (
                this.hasLegalMove(fromSquareName) &&
                toSquareName in this.legalMoves()[fromSquareName]
            );
        },
        handleSquareClick(squareName: string): void {
            if (this.isActiveMoveTheLast()) {
                if (this.hasLegalMove(squareName) && this.fromSquareName !== squareName) {
                    this.fromSquareName = squareName;
                } else {
                    if (this.fromSquareName) {
                        const fromSquareName: string = this.fromSquareName;
                        const toSquareName: string = squareName;
                        this.checkLegalMove({ fromSquareName, toSquareName }).then(
                            (isLegalMove) => {
                                if (isLegalMove) {
                                    this.tryMove({
                                        fromSquareName,
                                        toSquareName,
                                    });
                                }
                            }
                        );
                        this.fromSquareName = null;
                    }
                }
            }
        },
        isDarkSquare(x: number, y: number): boolean {
            return this.isPerpendicular ? (x + y) % 2 === 0 : (x + y) % 2 !== 0;
        },
        isLegalSquare(squareName: string): boolean {
            return (
                this.isActiveMoveTheLast() &&
                this.fromSquareName &&
                this.isLegalMove(this.fromSquareName, squareName)
            );
        },
        isFoggedSquare(squareName: string): boolean {
            return false;
        },
    },
};
</script>

<template>
    <div class="chessboard" :style="gridStyle">
        <template v-for="(row, y) in rows" :key="row">
            <template v-for="(column, x) in columns" :key="column">
                <Square
                    :name="getSquareName(column, row)"
                    :piece="chessboard().squares.get(getSquareName(column, row))"
                    :lightSquareColor="lightSquareColor"
                    :darkSquareColor="darkSquareColor"
                    :isDark="isDarkSquare(x, y)"
                    :isLegal="isLegalSquare(getSquareName(column, row))"
                    :isFogged="isFoggedSquare(getSquareName(column, row))"
                    @click="handleSquareClick(getSquareName(column, row))"
                />
            </template>
        </template>
    </div>
</template>

<style scoped>
.chessboard {
    display: grid;
}
</style>
