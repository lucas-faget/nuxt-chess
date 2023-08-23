<script lang="ts">
    import type { Square } from '@/chess/Square';
    import { SquareColor } from '@/enums/SquareColor';

    export default {
        props: {
			square: {
                type: Object as () => (Square|null),
                required: true,
            },
            lightSquareColor: {
                type: String as () => SquareColor,
                default: SquareColor.Gray
            },
            darkSquareColor: {
                type: String as () => SquareColor,
                default: SquareColor.Gray
            },
            isLegal: {
                type: Boolean,
                default: false
            },
            isFogged: {
                type: Boolean,
                default: false
            }
		},
        computed: {
            bgColor(): string {
                return this.square ?
                       this.square.isDark() ? 'square-dark-' + this.darkSquareColor : 'square-light-' + this.lightSquareColor
                       : 'void';
            },
            color(): string|undefined {
                return this.square?.getPiece()?.color ?? undefined;
            },
            bgPiece() {
                return this.square && !this.square.isEmpty() ? {
                    backgroundImage: this.color ? `url(/assets/piece/${this.color}/${this.square.getPiece()?.getName()}.svg)` : 'none',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'contain',
                } : '';
            }
        }
    }
</script>

<template>
	<div :style="bgPiece" :class="['square', bgColor, { 'is-legal': isLegal, 'is-fogged': isFogged }]">
		
	</div>
</template>

<style scoped>
    .void {
        background-color: var(--color-white);
    }

    .is-fogged {
        background-color: #000;
    }

    .is-legal {
        opacity: 0.7;
    }
</style>
