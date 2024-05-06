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
    components: { Chessboard, Actions, PlayerCard, Options, Background },
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
                this.createFourPlayerChessGame().then(() => {
                    this.isLoaded = true;
                });
            }
        });
    },
    computed: {
        bottomPlayer(): Player {
            return this.players()[this.playerInFrontIndex()];
        },
        leftPlayer(): Player {
            return this.players()[(this.playerInFrontIndex() + 1) % this.players().length];
        },
        topPlayer(): Player {
            return this.players()[(this.playerInFrontIndex() + 2) % this.players().length];
        },
        rightPlayer(): Player {
            return this.players()[(this.playerInFrontIndex() + 3) % this.players().length];
        },
    },
    methods: {
        ...mapState(["players", "playerInFrontIndex"]),
        ...mapGetters(["isPlayerActive"]),
        ...mapActions(["gameExists", "createFourPlayerChessGame"]),

        setLightSquareColor(squareColor: SquareColor) {
            this.lightSquareColor = squareColor;
        },
        setDarkSquareColor(squareColor: SquareColor) {
            this.darkSquareColor = squareColor;
        },
    },
    watch: {
        variant(newVariant: ChessVariant, oldVariant: ChessVariant) {
            if (newVariant !== oldVariant) {
                this.createFourPlayerChessGame();
            }
        },
    },
};
</script>

<template>
    <div class="chess">
        <div v-if="isLoaded">
            <div class="chessboard">
                <Chessboard
                    :lightSquareColor="lightSquareColor"
                    :darkSquareColor="darkSquareColor"
                />
            </div>
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
    position: relative;
    aspect-ratio: 1/1;
}
</style>
