<script lang="ts">
    import { SquareColor } from './enums/SquareColor';

    export default {
        components: { },
        props: ['chess', 'squareColor'],
        data() {
            return {
                squareColors: Object.values(SquareColor)
            }
        },
        methods: {
            changeColor(event: any): void {
                this.$emit('change-square-color', event.target.value);
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
            <div>Change chessboard color :</div>
            <div>
                <select @change="changeColor" class="select">
                    <option v-for="color in squareColors" :key="color" :value="color" :selected="color === squareColor">
                        {{ color }}
                    </option>
                </select>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .options
    {
        color: #000;
        background-color: var(--color-light);
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

    .option .select
    {
        padding: 10px;
        border-radius: 20px;
    }
</style>
