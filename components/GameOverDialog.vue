<script setup lang="ts">
import { type VPlayer, type VPiece } from "@/types";

const visible = ref<boolean>(false);

const props = withDefaults(
    defineProps<{
        players: VPlayer[];
        gameOver?: boolean;
        checkmatePiece?: VPiece | undefined;
        winnerPlayerIndex?: number | undefined;
    }>(),
    {
        gameOver: false,
        winnerPlayerIndex: undefined,
        checkmatePiece: undefined,
    }
);

watch(
    () => props.gameOver,
    (gameOver) => {
        if (gameOver === true) {
            visible.value = true;
        }
    },
    { immediate: true }
);
</script>

<template>
    <Dialog v-model:visible="visible" modal header="Game over">
        <div class="flex flex-col gap-4">
            <img src="/images/chess_banner.png" alt="Image" class="w-full" />

            <div class="flex flex-col text-center">
                <template v-if="winnerPlayerIndex !== undefined">
                    <span class="text-2xl font-medium">
                        {{ players[winnerPlayerIndex].name }} won
                    </span>
                    <span class="text-lg text-muted-color">by checkmate</span>
                </template>

                <template v-else>
                    <span class="text-2xl font-medium">Draw</span>
                    <span class="text-lg text-muted-color">by stalemate</span>
                </template>
            </div>

            <GameResult
                :players="players"
                :gameOver="gameOver"
                :winnerPlayerIndex="winnerPlayerIndex"
            />
        </div>
    </Dialog>
</template>
