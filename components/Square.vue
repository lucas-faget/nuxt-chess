<script setup lang="ts">
import type { VPiece } from "@/types";
import { useSettings } from "~/composables/useSettings";
const { getChessboardColor } = useSettings();

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
                    ? 'bg-neutral-600'
                    : getChessboardColor().darkClassName
                : isLegal
                ? 'bg-neutral-500'
                : getChessboardColor().lightClassName,
        ]"
    >
        <img
            v-if="piece !== null"
            class="h-full w-full aspect-square"
            :src="getPieceImage(piece.color, piece.name)"
            :alt="piece.name"
        />
    </div>
</template>
