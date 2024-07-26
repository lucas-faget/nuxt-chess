<script setup lang="ts">
import { useChessStore } from "~/stores/chess";
import { VChessVariant, VSquareColor, type VPlayer } from "@/types";

const chessStore = useChessStore();

const variant: VChessVariant = VChessVariant.Standard;

const lightSquareColor = ref<VSquareColor>(VSquareColor.Brown);
const darkSquareColor = ref<VSquareColor>(VSquareColor.Brown);

const bottomPlayer = computed<VPlayer>(() => {
    return chessStore.players[chessStore.playerInFrontIndex];
});

const topPlayer = computed<VPlayer>(() => {
    return chessStore.players[(chessStore.playerInFrontIndex + 1) % chessStore.players.length];
});

function setLightSquareColor(squareColor: VSquareColor): void {
    lightSquareColor.value = squareColor;
}

function setDarkSquareColor(squareColor: VSquareColor): void {
    darkSquareColor.value = squareColor;
}

function handleMove(fromSquareName: string, toSquareName: string): void {
    console.log("move");
    chessStore.tryMove(fromSquareName, toSquareName);
}

onMounted(() => {
    if (!chessStore.gameExists(variant)) {
        chessStore.createChessGame(variant);
    }
});

watch(
    () => chessStore.variant,
    async (newVariant, oldVariant) => {
        if (newVariant && newVariant !== oldVariant) {
            chessStore.createChessGame(newVariant);
        }
    }
);
</script>

<template>
    <div class="flex justify-center">
        <div class="flex flex-col w-96">
            <div class="h-96">
                <Chessboard
                    v-if="chessStore.variant && chessStore.chessboard"
                    :variant="chessStore.variant"
                    :playerInFrontIndex="chessStore.playerInFrontIndex"
                    :chessboard="chessStore.chessboard"
                    :legalMoves="chessStore.legalMoves"
                    :canPlay="chessStore.isActiveMoveTheLast"
                    @handle-move="handleMove"
                />
            </div>
            <div class="flex flex-col">
                <button @click="chessStore.spinChessboard">Spin</button>
                <button @click="chessStore.goToFirstMove">First move</button>
                <button @click="chessStore.goToPreviousMove">Previous move</button>
                <button @click="chessStore.goToNextMove">Next move</button>
                <button @click="chessStore.goToLastMove">Last move</button>
                <button @click="chessStore.cancelLastMove">Cancel move</button>
            </div>
        </div>
    </div>
</template>
