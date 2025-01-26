<script setup lang="ts">
import { ChessVariant } from "@shared/chess/types/ChessVariant.ts";
import { useChessStore } from "~/stores/chess";

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
    if (!chessStore.gameExists() || chessStore.variant !== ChessVariant.Standard) {
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
