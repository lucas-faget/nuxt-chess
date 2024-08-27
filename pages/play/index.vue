<script setup lang="ts">
import { useChessStore } from "~/stores/chess";
import { VSquareColor, type VPlayer } from "@/types";

definePageMeta({
    layout: "aside",
});

const chessStore = useChessStore();

const value = ref("1");
const options = ref(["0", "1"]);

const lightSquareColor = ref<VSquareColor>(VSquareColor.Brown);
const darkSquareColor = ref<VSquareColor>(VSquareColor.Brown);

const bottomPlayer = computed<VPlayer>(() => {
    return chessStore.players[chessStore.playerInFrontIndex];
});

const topPlayer = computed<VPlayer>(() => {
    return chessStore.players[(chessStore.playerInFrontIndex + 1) % chessStore.players.length];
});

function setLightSquareColor(squareColor: VSquareColor): void {
    lightSquareColor.value = squareColor;
}

function setDarkSquareColor(squareColor: VSquareColor): void {
    darkSquareColor.value = squareColor;
}

function handleMove(fromSquareName: string, toSquareName: string): void {
    chessStore.tryMove(fromSquareName, toSquareName);
}

onBeforeMount(() => {
    if (!chessStore.gameExists()) {
        navigateTo("/");
    }
});
</script>

<template>
    <div class="w-full flex max-lg:flex-col">
        <div class="w-full h-full flex justify-center">
            <div
                class="w-full max-w-[calc(100vh-2*var(--chessboard-head-h))] min-w-[20rem] flex flex-col p-2"
            >
                <div class="h-[var(--chessboard-head-h)] flex items-start shrink-0">
                    <div class="flex items-center gap-4">
                        <Avatar
                            icon="pi pi-user"
                            size="large"
                            style="
                                background-color: var(--p-neutral-200);
                                color: var(--p-neutral-800);
                            "
                            shape="circle"
                        />
                        <span>Player 1</span>
                    </div>
                </div>
                <div class="aspect-square">
                    <Chessboard
                        v-if="chessStore.variant && chessStore.chessboard"
                        :variant="chessStore.variant"
                        :playerInFrontIndex="chessStore.playerInFrontIndex"
                        :chessboard="chessStore.chessboard"
                        :legalMoves="chessStore.legalMoves"
                        :canPlay="chessStore.isActiveMoveTheLast"
                        @handle-move="handleMove"
                    />
                </div>
                <div class="h-[var(--chessboard-head-h)] flex items-end shrink-0">
                    <div class="flex items-center gap-4">
                        <Avatar
                            icon="pi pi-user"
                            size="large"
                            style="
                                background-color: var(--p-neutral-800);
                                color: var(--p-neutral-200);
                            "
                            shape="circle"
                        />
                        <span>Player 2</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="w-96 max-lg:w-full md:min-h-screen shrink-0 p-2 flex flex-col gap-2">
            <Panel class="flex-1 overflow-hidden">
                <template #header>
                    <Tabs value="0" class="w-full">
                        <TabList>
                            <Tab value="0">Moves</Tab>
                            <Tab value="1">Game</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel value="0">
                                <p class="m-0">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                    eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                                    enim ad minim veniam, quis nostrud exercitation ullamco laboris
                                    nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                                    in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                                    nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                                    sunt in culpa qui officia deserunt mollit anim id est laborum.
                                </p>
                            </TabPanel>
                            <TabPanel value="1" class="">
                                <div class="flex flex-col">
                                    <div class="flex justify-center items-center gap-8 py-8">
                                        <div class="flex flex-col items-center gap-2">
                                            <Avatar
                                                icon="pi pi-user"
                                                size="xlarge"
                                                style="
                                                    background-color: var(--p-neutral-200);
                                                    color: var(--p-neutral-800);
                                                "
                                                shape="circle"
                                            />
                                            <span>Player 1</span>
                                        </div>
                                        <SelectButton v-model="value" :options="options" disabled />
                                        <div class="flex flex-col items-center gap-2">
                                            <Avatar
                                                icon="pi pi-user"
                                                size="xlarge"
                                                style="
                                                    background-color: var(--p-neutral-800);
                                                    color: var(--p-neutral-200);
                                                "
                                                shape="circle"
                                            />
                                            <span>Player 2</span>
                                        </div>
                                    </div>

                                    <Divider />

                                    <div class="flex justify-between">
                                        <span class="text-surface-500">Variant</span>
                                        <Tag
                                            icon="pi pi-tag"
                                            value="Standard"
                                            severity="secondary"
                                        ></Tag>
                                    </div>

                                    <Divider />

                                    <div class="flex justify-between">
                                        <span class="text-surface-500">Speed</span>
                                        <Tag
                                            icon="pi pi-clock"
                                            value="Unlimited"
                                            severity="secondary"
                                        ></Tag>
                                    </div>
                                </div>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </template>
            </Panel>
            <div class="flex flex-col gap-3">
                <div class="flex gap-2">
                    <Button
                        class="flex-1"
                        icon="pi pi-step-backward"
                        aria-label="First move"
                        severity="secondary"
                        v-tooltip.top="'First move'"
                        type="text"
                        placeholder="Top"
                        @click="chessStore.goToFirstMove"
                    />
                    <Button
                        class="flex-1"
                        icon="pi pi-caret-left"
                        aria-label="Previous move"
                        severity="secondary"
                        v-tooltip.top="'Previous move'"
                        type="text"
                        placeholder="Top"
                        @click="chessStore.goToPreviousMove"
                    />
                    <Button
                        class="flex-1"
                        icon="pi pi-caret-right"
                        aria-label="Next move"
                        severity="secondary"
                        v-tooltip.top="'Next move'"
                        type="text"
                        placeholder="Top"
                        @click="chessStore.goToNextMove"
                    />
                    <Button
                        class="flex-1"
                        icon="pi pi-step-forward"
                        aria-label="Last move"
                        severity="secondary"
                        v-tooltip.top="'Last move'"
                        type="text"
                        placeholder="Top"
                        @click="chessStore.goToLastMove"
                    />
                </div>
                <div class="flex gap-2">
                    <Button
                        class="flex-1"
                        icon="pi pi-sync"
                        aria-label="Spin"
                        severity="contrast"
                        v-tooltip.top="'Spin chessboard'"
                        type="text"
                        placeholder="Top"
                        @click="chessStore.spinChessboard"
                    />
                    <Button
                        outlined
                        class="flex-1"
                        icon="pi pi-undo"
                        aria-label="Undo move"
                        severity="contrast"
                        v-tooltip.top="'Undo move'"
                        type="text"
                        placeholder="Top"
                        @click="chessStore.cancelLastMove"
                    />
                </div>
            </div>
        </div>
    </div>
</template>
