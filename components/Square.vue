<script setup lang="ts">
import type { VPiece } from "@/types";
import { useSettings } from "~/composables/useSettings";
const { getChessboardColor } = useSettings();

withDefaults(
    defineProps<{
        name?: string;
        piece: VPiece | null;
        isDark: boolean;
        isActive: boolean;
        isLegal?: boolean;
    }>(),
    {
        isActive: false,
        isLegal: false,
    }
);
</script>

<template>
    <div
        :class="[
            isDark
                ? isLegal
                    ? getChessboardColor().darkLegal
                    : isActive
                    ? getChessboardColor().darkActive
                    : getChessboardColor().dark
                : isLegal
                ? getChessboardColor().lightLegal
                : isActive
                ? getChessboardColor().lightActive
                : getChessboardColor().light,
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
