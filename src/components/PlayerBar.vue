<script lang="ts">
    import type { PlayerColor } from '@/chess/enums/PlayerColor'

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
            capturedPieces: {
                type: Map,
                required: false
            },
            advantage: {
                type: Number,
                default: 0,
                required: false
            }
        },
        computed: {
            capturedPiecesArray(): string[] {
                let capturedPiecesArray: string[] = [];

                if (this.capturedPieces) {
                    for (const [pieceName, count] of this.capturedPieces.entries()) {
                        capturedPiecesArray = [...capturedPiecesArray, ...Array<string>(count as number).fill(pieceName as string)];
                    }
                }

                return capturedPiecesArray
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
            <div v-if="capturedPiecesArray && capturedPiecesArray.length > 0" :class="['captured-pieces', 'player-color-' + playerColor]">
                <template v-for="pieceName in capturedPiecesArray" :key="pieceName">
                    <img class="piece-image" :src="pieceImageSrc(pieceName)" alt="piece" />
                </template>
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
        padding: 5px 5px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 5px;
    }

    .piece-image {
        width: 20px;
        height: 20px;
    }
</style>
