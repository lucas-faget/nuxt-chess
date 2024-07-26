<script setup lang="ts">
import type { VPiece } from "@/types";

defineProps<{
    name?: string;
    piece: VPiece | null;
    isDark: boolean;
    isLegal: boolean;
}>();
</script>

<template>
    <div
        :class="[
            isDark
                ? isLegal
                    ? 'bg-gray-200'
                    : 'bg-neutral-400'
                : isLegal
                ? 'bg-gray-100'
                : 'bg-neutral-300',
        ]"
    >
        <img
            v-if="piece !== null"
            class="h-full w-full"
            :src="getPieceImage(piece.color, piece.name)"
            :alt="piece.name"
        />
    </div>
</template>
