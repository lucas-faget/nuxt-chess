<script lang="ts">
import type { PlayerColor } from "@/chess/types/PlayerColor";
import type { Player } from "@/chess/players/Player";
import { getFullLetterColor } from "@/utils/images";

export default {
    props: {
        playerName: {
            type: String,
            required: true,
        },
        playerColor: {
            type: String as () => PlayerColor,
            required: true,
        },
        isPlayerActive: {
            type: Boolean,
            default: false,
        },
    },
    methods: {
        getFullLetterColor(color: PlayerColor): string {
            return getFullLetterColor(color);
        },
    },
};
</script>

<template>
    <div class="player-card">
        <div class="left">
            <div :class="['left', 'sphere-and-name', { blink: isPlayerActive }]">
                <div :class="['sphere', 'player-color-' + getFullLetterColor(playerColor)]"></div>
                <div>
                    <span v-if="playerName">{{ playerName }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.player-card {
    color: var(--color-light);
    background-color: var(--color-dark-gray);
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding-block: 10px;
    padding-inline: 1vw;
    font-size: 20px;
}

.left {
    display: flex;
    align-items: center;
    gap: 10px;
}

.sphere-and-name {
    padding: 5px 10px;
    border-radius: 10px;
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
