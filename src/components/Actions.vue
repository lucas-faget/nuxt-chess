<script lang="ts">
    import Tooltip from '@/components/Tooltip.vue';
    import { ActionType } from '@/enums/ActionType';

    export default {
        components: { Tooltip },
        props: ['chess'],
        data() {
            return {
                actionList: [
                    { index: 0, type: ActionType.Spin, tooltipText: "Spin chessboard", isTooltipVisible: false },
                    { index: 1, type: ActionType.First, tooltipText: "First move", isTooltipVisible: false },
                    { index: 2, type: ActionType.Previous, tooltipText: "Previous move", isTooltipVisible: false },
                    { index: 3, type: ActionType.Next, tooltipText: "Next move", isTooltipVisible: false },
                    { index: 4, type: ActionType.Last, tooltipText: "Last move", isTooltipVisible: false },
                    { index: 5, type: ActionType.Cancel, tooltipText: "Cancel move", isTooltipVisible: false }
                ]
            }
        },
        methods: {
            src(type: string): string
            {
                return "/assets/icon/" + type + ".png";
            },
            performAction(type: ActionType): void
            {
                switch (type) {
                    case ActionType.Spin:
                        this.chess.spinChessboard();
                        break;
                    case ActionType.First:
                        this.chess.showFirstMove();
                        break;
                    case ActionType.Previous:
                        this.chess.showPreviousMove();
                        break;
                    case ActionType.Next:
                        this.chess.showNextMove();
                        break;
                    case ActionType.Last:
                        this.chess.goToLastMove();
                        break;
                    case ActionType.Cancel:
                        this.chess.deleteLastMove();
                        break;
                }
            },
            isBlinking(actionType: ActionType): boolean
            {
                return actionType === ActionType.Last && !this.chess.isCurrentMoveTheLast();
            }
        }
    }
</script>

<template>
    <div class="buttons">
        <div v-for="action in actionList" :key="action.index" 
                    @mouseover="action.isTooltipVisible = true" 
                    @mouseout="action.isTooltipVisible = false" 
                    @click="performAction(action.type)" 
                    :class="['button', { 'blink': isBlinking(action.type) }]"
        >
            <img v-bind:src="src(action.type)" draggable="false" />
            <Tooltip :text="action.tooltipText" :isVisible="action.isTooltipVisible" />
        </div>
    </div>
</template>

<style scoped>
    .buttons
    {
        background-color: var(--color-light);
        display: flex;
        justify-content: center;
    }

    .button
    {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        width: min(calc(100vw / 6), 65px);
        aspect-ratio: 1/1;
    }

    .button:hover
    {
        cursor: pointer;
        background: hsl(240, 50%, 80%);
    }

    .blink
    {
        animation-name: blink;
        animation-duration: 1s;
        animation-timing-function: ease-in-out;
        animation-iteration-count: infinite;
        animation-direction: alternate;
    }

    @keyframes blink {
        0% {
            background: hsla(240, 50%, 80%, 0);
        }
        100% {
            background: hsla(240, 50%, 80%, 1);
        }
    }
</style>
