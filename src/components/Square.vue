<script lang="ts">
import { getPieceImageSrc } from "@/utils/images";
import { SquareColor } from "@/types/SquareColor";
import type { Piece } from "@/types/Piece";

import type { PlayerColor } from "@/chess/types/PlayerColor";
import type { PieceName } from "@/chess/types/PieceName";

export default {
    props: {
        name: {
            type: String,
            required: false,
        },
        piece: {
            type: Object as () => Piece | null,
            default: null,
        },
        lightSquareColor: {
            type: String as () => SquareColor,
            default: SquareColor.Gray,
        },
        darkSquareColor: {
            type: String as () => SquareColor,
            default: SquareColor.Gray,
        },
        isDark: {
            type: Boolean,
            required: true,
        },
        isLegal: {
            type: Boolean,
            default: false,
        },
        isFogged: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        squareColorStyle(): string {
            return this.isDark
                ? "square-dark-" + this.darkSquareColor
                : "square-light-" + this.lightSquareColor;
        },
        pieceBackgroundStyle() {
            return this.piece
                ? {
                      backgroundImage: `url(${getPieceImageSrc(
                          this.piece.color as PlayerColor,
                          this.piece.name as PieceName
                      )})`,
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "contain",
                  }
                : "";
        },
    },
};
</script>

<template>
    <div v-if="isFogged" class="fogged"></div>
    <div v-else :style="pieceBackgroundStyle" :class="[squareColorStyle, { legal: isLegal }]">
        <span v-if="name" style="color: black">{{ name }}</span>
    </div>
</template>

<style scoped>
.fogged {
    background: #000;
}

.legal {
    opacity: 0.7;
}
</style>
