<script lang="ts">
    import Chessboard from '@/components/Chessboard.vue'
    import { SquareColor } from '@/components/enums/SquareColor';
    import { ChessLocal } from '@/chess/ChessLocal';
    import PawnJson from "@/assets/json/pawn-chessboard.json";
    import KnightJson from "@/assets/json/knight-chessboard.json";
    import BishopJson from "@/assets/json/bishop-chessboard.json";
    import RookJson from "@/assets/json/rook-chessboard.json";
    import QueenJson from "@/assets/json/queen-chessboard.json";
    import KingJson from "@/assets/json/king-chessboard.json";

	export default {
        components: { Chessboard },
        data() {
            return {
                articles: [
                    {
                        index: 0,
                        chess: new ChessLocal(PawnJson),
                        title: "Pawn",
                        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.",
                        squareColor: SquareColor.Brown
                    },
                    {
                        index: 1,
                        chess: new ChessLocal(KnightJson),
                        title: "Knight",
                        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.",
                        squareColor: SquareColor.Gray
                    },
                    {
                        index: 2,
                        chess: new ChessLocal(BishopJson),
                        title: "Bishop",
                        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.",
                        squareColor: SquareColor.Blue
                    },
                    {
                        index: 3,
                        chess: new ChessLocal(RookJson),
                        title: "Rook",
                        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.",
                        squareColor: SquareColor.Green
                    },
                    {
                        index: 4,
                        chess: new ChessLocal(QueenJson),
                        title: "Queen",
                        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.",
                        squareColor: SquareColor.Red
                    },
                    {
                        index: 5,
                        chess: new ChessLocal(KingJson),
                        title: "King",
                        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.",
                        squareColor: SquareColor.Brown
                    }
                ]
            };
        },
}
</script>

<template>
	<div class="learn">
		<article v-for="article in articles" :key="article.index" :class="[article.index % 2 === 0 ? 'flex-row' : 'flex-row-reverse']">
            <div class="section">
                <div class="text">
                    <div class="title">{{ article.title }}</div>
                    <div class="description">{{ article.text }}</div>
                </div>
            </div>
            <div class="section">
                <div class="chessboard">
                    <Chessboard :chess="article.chess" :squareColor="article.squareColor" />
                </div>
            </div>
        </article>
	</div>
</template>

<style scoped>
    .learn {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

	article {
        width: 85vw;
        height: 100vh;
        display: flex;
        gap: 60px;
    }

    .flex-row {
        flex-direction: row;
    }

    .flex-row-reverse {
        flex-direction: row-reverse;
    }

    .section {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .text {
        display: flex;
        flex-direction: column;
        gap: 30px;
    }

    .title {
        font-size: 50px;
    }

    .description {
        color: var(--color-gray);
        font-size: 18px;
    }
</style>
