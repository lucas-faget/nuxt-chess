<script lang="ts">
    import { PlayerColor } from '../chess/enums/PlayerColor'

    export default {
        props: ['square', 'squareColor', 'isLegal'],
        computed: {
            bgColor(): string {
                return this.square.position.y % 2 === 0 ? this.square.position.x % 2 === 0 ? 'dark-' + this.squareColor : 'light-' + this.squareColor : 
                       this.square.position.x % 2 === 0 ? 'light-' + this.squareColor : 'dark-' + this.squareColor;
            },
            color(): string {
                return this.square.getPiece()?.color === PlayerColor.White ? 'white' : 'black' ?? '';
            },
            bgPiece() {
                return this.square.isEmpty() ? '' : { 
                    backgroundImage: 'url(src/assets/svg/pieces/' + this.color + '/' + this.square.getPiece().getName() + '.svg)',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'contain',
                };
            }
        }
    }
</script>

<template>
	<div :style="bgPiece" :class="['square', bgColor, { 'is-legal': isLegal }]">
		
	</div>
</template>

<style scoped>
    .light-brown {
        background-color: wheat;
    }

    .dark-brown {
        background-color: burlywood;
    }

    .light-gray {
        background-color: lightgray;
    }

    .dark-gray {
        background-color: darkgray;
    }

    .light-blue {
        background-color: hsl(240,100%,90%);
    }

    .dark-blue {
        background-color: hsl(240,100%,70%);
    }

    .light-green {
        background-color: hsl(120,50%,90%);
    }

    .dark-green {
        background-color: hsl(120,50%,70%);
    }

    .light-red {
        background-color: hsl(0,100%,90%);
    }

    .dark-red {
        background-color: hsl(0,100%,70%);
    }

    .is-legal {
        opacity: 0.7;
    }
</style>
