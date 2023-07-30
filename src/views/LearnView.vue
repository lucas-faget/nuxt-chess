<script lang="ts">
    import Chessboard from '@/components/Chessboard.vue'
    import CustomButton from '@/components/CustomButton.vue';
    import { SquareColor } from '@/enums/SquareColor';
    import { ChessLocal } from '@/chess/ChessLocal';
    import PawnJson from "@/json/pawn-chessboard.json";
    import KnightJson from "@/json/knight-chessboard.json";
    import BishopJson from "@/json/bishop-chessboard.json";
    import RookJson from "@/json/rook-chessboard.json";
    import QueenJson from "@/json/queen-chessboard.json";
    import KingJson from "@/json/king-chessboard.json";
    import { Whites } from '@/chess/players/Players';

	export default {
        components: { Chessboard, CustomButton },
        data() {
            return {
                articles: [
                    {
                        index: 0,
                        chess: new ChessLocal(PawnJson, [Whites]),
                        title: "Pawn",
                        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.",
                        squareColor: SquareColor.Brown
                    },
                    {
                        index: 1,
                        chess: new ChessLocal(KnightJson, [Whites]),
                        title: "Knight",
                        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.",
                        squareColor: SquareColor.Gray
                    },
                    {
                        index: 2,
                        chess: new ChessLocal(BishopJson, [Whites]),
                        title: "Bishop",
                        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.",
                        squareColor: SquareColor.Blue
                    },
                    {
                        index: 3,
                        chess: new ChessLocal(RookJson, [Whites]),
                        title: "Rook",
                        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.",
                        squareColor: SquareColor.Green
                    },
                    {
                        index: 4,
                        chess: new ChessLocal(QueenJson, [Whites]),
                        title: "Queen",
                        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.",
                        squareColor: SquareColor.Red
                    },
                    {
                        index: 5,
                        chess: new ChessLocal(KingJson, [Whites]),
                        title: "King",
                        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.",
                        squareColor: SquareColor.Brown
                    }
                ]
            };
        },
        methods: {
            resetChessboard(index: number) {
                const article = this.articles[index];
                article.chess.resetChessboard();
            }
        }
}
</script>

<template>
	<div class="learn">
		<article v-for="article in articles" :key="article.index" :class="[article.index % 2 === 0 ? 'flex-row' : 'flex-row-reverse']">
            <div class="section">
                <div class="text">
                    <div class="title">{{ article.title }}</div>
                    <div class="description">{{ article.text }}</div>
                    <div style="display: flex;">  
                        <CustomButton 
                            text="Reset chessboard" 
                            :leftIcon="article.index % 2 === 0 ? '' : 'chevron-left.svg'"
                            :rightIcon="article.index % 2 === 0 ? 'chevron-right.svg' : ''"
                            @click="resetChessboard(article.index)" />
                    </div>
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
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        gap: 60px;
    }

    @media screen and (max-width: 1000px) {
        .learn {
            margin-block: 60px;
            gap: 60px;
        }

        article {
            flex-direction: column !important;
        }
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

    .chessboard {
        width: min(100%, 520px);
        aspect-ratio: 1 / 1;
    }

    .title {
        font-size: 50px;
    }

    .description {
        color: var(--color-gray);
        font-size: 18px;
    }
</style>
