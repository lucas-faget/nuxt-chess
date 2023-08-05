<script lang="ts">
    import { SquareColor } from '@/enums/SquareColor';

    export default {
        props: {
            lightSquareColor: {
                type: String as () => SquareColor,
                default: SquareColor.Gray
            },
            darkSquareColor: {
                type: String as () => SquareColor,
                default: SquareColor.Gray
            }
        },
        data() {
            return {
                squareColors: Object.values(SquareColor)
            }
        },
        methods: {
            changeLightColor(squareColor: SquareColor): void {
                this.$emit('change-light-square-color', squareColor);
            },
            changeDarkColor(squareColor: SquareColor): void {
                this.$emit('change-dark-square-color', squareColor);
            }
        }
    }
</script>

<template>
    <div class="options">
        <div class="title">
            Options
        </div>
        <div class="option">
            <div>Change square color :</div>
            <div class="color-squares">
                <div style="position: relative">
                    <div :class="['color-square', 'light-' + lightSquareColor]"></div>
                    <div class="dropdown">
                        <div 
                            v-for="squareColor in squareColors"
                            :key="squareColor"
                            :class="['color-square', 'light-' + squareColor]"
                            @click="changeLightColor(squareColor)"
                        ></div>
                    </div>
                </div>
                <div style="position: relative">
                    <div :class="['color-square', 'dark-' + darkSquareColor]"></div>
                    <div class="dropdown">
                        <div 
                            v-for="squareColor in squareColors"
                            :key="squareColor"
                            :class="['color-square', 'dark-' + squareColor]"
                            @click="changeDarkColor(squareColor)"
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .options
    {
        color: var(--color-light);
        background-color: var(--color-dark-gray);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 20px;
        padding-block: 20px;
    }

    .options > .title
    {
        font-size: 25px;
    }

    .options > .option
    {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .color-squares
    {
        display: flex;
        gap: 10px;
    }

    .color-square
    {
        width: 30px;
        aspect-ratio: 1/1;
        cursor: pointer;
    }

    .dropdown
    {
        position: absolute;
        top: 100%;
        left: 0;
        z-index: 1000;
        display: flex;
        flex-direction: column;
    }
</style>
