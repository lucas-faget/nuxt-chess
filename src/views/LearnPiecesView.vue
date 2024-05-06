<script lang="ts">
import CustomButton from "@/components/CustomButton.vue";
import Chessboard from "@/components/Chessboard.vue";
import { PlayerColor } from "@/chess/types/PlayerColor";
import { PieceName } from "@/chess/types/PieceName";
import { ChessVariant } from "@/chess/types/ChessVariant";
import { Whites } from "@/chess/players/Players";
import { TwoPlayerChess } from "@/chess/games/TwoPlayerChess";
import { SquareColor } from "@/types/SquareColor";
import { getPieceImageSrc } from "@/utils/images";

export default {
    components: { Chessboard, CustomButton },
    data() {
        return {
            articles: [
                {
                    title: "Pawn",
                    text: "A pawn can move forward to the unoccupied square immediately in front of it on the same file, or on its first move it can advance two squares along the same file, provided both squares are unoccupied.",
                    pieceName: PieceName.Pawn,
                    chess: new TwoPlayerChess(
                        ChessVariant.Standard,
                        "8/8/8/8/2P5/8/5P2/8 w - - 0 1",
                        [Whites]
                    ),
                    playerColor: PlayerColor.White,
                    squareColor: SquareColor.Brown,
                },
                {
                    title: "Knight",
                    text: "A knight moves to any of the closest squares that are not on the same rank, file, or diagonal. Thus the move forms an L-shape: two squares vertically and one square horizontally, or two squares horizontally and one square vertically. The knight is the only piece that can leap over other pieces.",
                    pieceName: PieceName.Knight,
                    chess: new TwoPlayerChess(
                        ChessVariant.Standard,
                        "8/8/8/3N4/8/8/8/8 w - - 0 1",
                        [Whites]
                    ),
                    playerColor: PlayerColor.White,
                    squareColor: SquareColor.Gray,
                },
                {
                    title: "Bishop",
                    text: "A bishop can move any number of squares diagonally, but cannot leap over other pieces.",
                    pieceName: PieceName.Bishop,
                    chess: new TwoPlayerChess(
                        ChessVariant.Standard,
                        "8/8/8/8/3B4/8/8/8 w - - 0 1",
                        [Whites]
                    ),
                    playerColor: PlayerColor.White,
                    squareColor: SquareColor.Blue,
                },
                {
                    title: "Rook",
                    text: "A rook can move any number of squares along a rank or file, but cannot leap over other pieces.",
                    pieceName: PieceName.Rook,
                    chess: new TwoPlayerChess(
                        ChessVariant.Standard,
                        "8/8/8/3R4/8/8/8/8 w - - 0 1",
                        [Whites]
                    ),
                    playerColor: PlayerColor.White,
                    squareColor: SquareColor.Green,
                },
                {
                    title: "Queen",
                    text: "A queen combines the power of a rook and bishop and can move any number of squares along a rank, file, or diagonal, but cannot leap over other pieces.",
                    pieceName: PieceName.Queen,
                    chess: new TwoPlayerChess(
                        ChessVariant.Standard,
                        "8/8/8/8/3Q4/8/8/8 w - - 0 1",
                        [Whites]
                    ),
                    playerColor: PlayerColor.White,
                    squareColor: SquareColor.Red,
                },
                {
                    title: "King",
                    text: "The king moves one square in any direction.",
                    pieceName: PieceName.King,
                    chess: new TwoPlayerChess(
                        ChessVariant.Standard,
                        "8/8/8/5K2/8/8/8/8 w - - 0 1",
                        [Whites]
                    ),
                    playerColor: PlayerColor.White,
                    squareColor: SquareColor.Brown,
                },
            ],
        };
    },
    methods: {
        getPieceImageSrc(color: PlayerColor, pieceName: PieceName): string {
            return getPieceImageSrc(color, pieceName);
        },
    },
};
</script>

<template>
    <div class="articles">
        <article v-for="(article, index) in articles" :key="index">
            <div class="section">
                <div class="section-header">
                    <img
                        :src="getPieceImageSrc(article.playerColor, article.pieceName)"
                        alt="Piece"
                    />
                    <div class="title">{{ article.title }}</div>
                </div>
                <div class="section-content">
                    <div class="text">{{ article.text }}</div>
                    <div class="flex">
                        <CustomButton @click="article.chess.resetGame()" text="Reset chessboard" />
                    </div>
                </div>
            </div>
            <div class="section">
                <div class="chessboard">
                    <Chessboard
                        :chess="article.chess"
                        :light-square-color="article.squareColor"
                        :dark-square-color="article.squareColor"
                    />
                </div>
            </div>
        </article>
    </div>
</template>

<style scoped>
.chessboard {
    width: min(100%, 520px);
    aspect-ratio: 1 / 1;
}
</style>
