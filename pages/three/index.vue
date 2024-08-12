<script setup lang="ts">
import { useChessStore } from "~/stores/chess";
import { VChessVariant, type VMove } from "@/types";

const chessStore = useChessStore();

const lastMove = ref<VMove | null>(null);

const handleMove = (fromSquareName: string, toSquareName: string): void => {
    let move: VMove | null = chessStore.getLegalMove(fromSquareName, toSquareName);
    if (move !== null) {
        chessStore.tryMove(fromSquareName, toSquareName);
        lastMove.value = move;
    }
};

onBeforeMount(() => {
    if (!chessStore.gameExists() || chessStore.variant !== VChessVariant.Standard) {
        chessStore.createChessGame();
    }
});
</script>

<template>
    <ThreeChessboard
        :chessboard="chessStore.chessboard"
        :legalMoves="chessStore.legalMoves"
        :lastMove="lastMove"
        @handle-move="handleMove"
    />
</template>
