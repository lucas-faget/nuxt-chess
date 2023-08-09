<script lang="ts">
    import type { PlayerColor } from '@/chess/enums/PlayerColor'
    import type { PieceName } from '@/chess/enums/PieceName';

    export default {
        props: {
            name: {
                type: String,
                default: "",
                required: false
            },
            playerColor: {
                type: String as () => PlayerColor,
                required: true
            },
            opponentPlayerColor: {
                type: String as () => PlayerColor,
                required: true
            },
            capturedPiecesByPieceName: {
                type: Map<PieceName, number>,
                required: false
            },
            advantage: {
                type: Number,
                default: 0,
                required: false
            }
        },
        computed: {
            allCapturedPieces(): string[][] {
                let allCapturedPieces: string[][] = [];

                if (this.capturedPiecesByPieceName) {
                    for (const [pieceName, count] of this.capturedPiecesByPieceName.entries()) {
                        if (count > 0) {
                            allCapturedPieces.push(Array<string>(count as number).fill(pieceName as string));
                        }
                    }
                }

                return allCapturedPieces;
            }
        },
        methods: {
            pieceImageSrc(pieceName: any): string {
                return `/assets/piece/${this.opponentPlayerColor}/${pieceName}.svg`;
            }
        }
    }
</script>

<template>
	<div class="player-bar">
        <div class="left">
            <div :class="['sphere', 'player-color-' +  playerColor]"></div>
            <div v-if="name || playerColor">
                <span v-if="name">{{ name }}</span>
                <span v-else>{{ playerColor }}</span>
            </div>
            <div v-if="allCapturedPieces && allCapturedPieces.length > 0" :class="['captured-pieces', 'player-color-' + playerColor]">
                <div v-for="(capturedPiecesGroup, index) in allCapturedPieces" :key="index" class="captured-piece-group">
                    <img v-for="(pieceName, index2) in capturedPiecesGroup" :key="index2" class="piece-image" :src="pieceImageSrc(pieceName)" alt="piece" />
                </div>
            </div>
            <div v-if="advantage && advantage !== 0"><span>{{ advantage }}</span></div>
        </div>
        <div class="right">

        </div>
	</div>
</template>

<style scoped>
    .player-bar {
        color: var(--color-light);
        background-color: var(--color-dark-gray);
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 60px;
        padding-inline: 30px;
        font-size: 20px;
    }

    .left {
        display: flex;
        align-items: center;
        gap: 20px;
    }

    .sphere {
        width: 25px;
        aspect-ratio: 1/1;
        border-radius: 100%;
    }

    .captured-pieces {
        padding: 3px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 5px;
    }

    .captured-piece-group {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 12px;
    }

    .piece-image {
        width: 25px;
        height: 25px;
        margin-right: -12px;
    }
</style>
