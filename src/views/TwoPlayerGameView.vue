<script lang="ts">
import { mapState, mapGetters, mapActions } from "vuex";

import { ChessVariant } from "../chess/types/ChessVariant";
import { SquareColor } from "../types/SquareColor";
import type { Player } from "../chess/players/Player";

import Background from "../components/Background.vue";
import Chessboard from "../components/Chessboard.vue";
import PlayerCard from "../components/PlayerCard.vue";
import Actions from "../components/Actions.vue";
import Options from "../components/Options.vue";

export default {
    components: {
        Chessboard,
        Actions,
        PlayerCard,
        Options,
        Background,
    },
    props: {
        variant: {
            type: String as () => ChessVariant,
            default: ChessVariant.Standard,
        },
    },
    data() {
        return {
            isLoaded: false,
            lightSquareColor: SquareColor.Brown,
            darkSquareColor: SquareColor.Brown,
        };
    },
    mounted() {
        this.gameExists(this.variant).then((exists) => {
            if (exists) {
                this.isLoaded = true;
            } else {
                this.createTwoPlayerChessGame(this.variant).then(() => {
                    this.isLoaded = true;
                });
            }
        });
    },
    computed: {
        bottomPlayer(): Player {
            return this.players()[this.playerInFrontIndex()];
        },
        topPlayer(): Player {
            return this.players()[(this.playerInFrontIndex() + 1) % this.players().length];
        },
    },
    methods: {
        ...mapState(["players", "activePlayerIndex", "playerInFrontIndex"]),
        ...mapGetters(["isPlayerActive"]),
        ...mapActions(["gameExists", "createTwoPlayerChessGame"]),

        setLightSquareColor(squareColor: SquareColor): void {
            this.lightSquareColor = squareColor;
        },
        setDarkSquareColor(squareColor: SquareColor): void {
            this.darkSquareColor = squareColor;
        },
    },
    watch: {
        variant(newVariant: ChessVariant, oldVariant: ChessVariant) {
            if (newVariant !== oldVariant) {
                this.createTwoPlayerChessGame(newVariant);
            }
        },
    },
};
</script>

<template>
    <div class="chess">
        <div v-if="isLoaded">
            <PlayerCard
                :playerName="topPlayer.name"
                :playerColor="topPlayer.color"
                :isPlayerActive="activePlayerIndex() === 1"
                style="border-radius: 10px 10px 0 0"
            />
            <div class="chessboard">
                <Chessboard
                    :lightSquareColor="lightSquareColor"
                    :darkSquareColor="darkSquareColor"
                />
            </div>
            <PlayerCard
                :playerName="bottomPlayer.name"
                :playerColor="bottomPlayer.color"
                :isPlayerActive="activePlayerIndex() === 0"
            />
            <Actions />
            <Options
                :lightSquareColor="lightSquareColor"
                :darkSquareColor="darkSquareColor"
                @update-light-square-color="setLightSquareColor"
                @update-dark-square-color="setDarkSquareColor"
                style="border-radius: 0 0 10px 10px"
            />
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
    width: min(95vw, 520px);
}

.chessboard {
    aspect-ratio: 1/1;
}
</style>
