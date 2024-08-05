<script setup lang="ts">
import { useChessStore } from "~/stores/chess";
import { VChessVariant, VSquareColor, type VPlayer } from "@/types";

const chessStore = useChessStore();

const value = ref("1");
const options = ref(["0", "1"]);

const variant: VChessVariant = VChessVariant.Standard;

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
    console.log("move");
    chessStore.tryMove(fromSquareName, toSquareName);
}

onMounted(() => {
    if (!chessStore.gameExists(variant)) {
        chessStore.createChessGame(variant);
    }
});

watch(
    () => chessStore.variant,
    async (newVariant, oldVariant) => {
        if (newVariant && newVariant !== oldVariant) {
            chessStore.createChessGame(newVariant);
        }
    }
);
</script>

<template>
    <div class="w-full flex max-md:flex-col">
        <div
            class="w-full h-full max-h-screen min-h-[calc(20rem+8rem)] max-w-full flex justify-center"
        >
            <div class="w-full max-w-[calc(100vh-8rem)] min-w-[20rem] h-full flex flex-col">
                <div class="h-16 flex items-center gap-4 shrink-0">
                    <Avatar
                        icon="pi pi-user"
                        size="large"
                        style="background-color: var(--p-neutral-200); color: var(--p-neutral-800)"
                        shape="circle"
                    />
                    <span>Player 1</span>
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
                <div class="h-16 flex items-center gap-4 shrink-0">
                    <Avatar
                        icon="pi pi-user"
                        size="large"
                        style="background-color: var(--p-neutral-800); color: var(--p-neutral-200)"
                        shape="circle"
                    />
                    <span>Player 2</span>
                </div>
            </div>
        </div>

        <div class="w-min max-md:w-full md:min-h-screen p-2">
            <Card class="w-full h-full overflow-hidden">
                <template #header>
                    <Tabs value="0">
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
                            <TabPanel value="1">
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
                <template #footer>
                    <div class="flex justify-center gap-2">
                        <Button
                            style="height: 3rem; width: 3rem"
                            icon="pi pi-sync"
                            aria-label="Spin"
                            severity="contrast"
                            v-tooltip.top="'Spin chessboard'"
                            type="text"
                            placeholder="Top"
                            @click="chessStore.spinChessboard"
                        />
                        <Button
                            style="height: 3rem; width: 3rem"
                            icon="pi pi-step-backward"
                            aria-label="First move"
                            severity="secondary"
                            v-tooltip.top="'First move'"
                            type="text"
                            placeholder="Top"
                            @click="chessStore.goToFirstMove"
                        />
                        <Button
                            style="height: 3rem; width: 3rem"
                            icon="pi pi-caret-left"
                            aria-label="Previous move"
                            severity="secondary"
                            v-tooltip.top="'Previous move'"
                            type="text"
                            placeholder="Top"
                            @click="chessStore.goToPreviousMove"
                        />
                        <Button
                            style="height: 3rem; width: 3rem"
                            icon="pi pi-caret-right"
                            aria-label="Next move"
                            severity="secondary"
                            v-tooltip.top="'Next move'"
                            type="text"
                            placeholder="Top"
                            @click="chessStore.goToNextMove"
                        />
                        <Button
                            style="height: 3rem; width: 3rem"
                            icon="pi pi-step-forward"
                            aria-label="Last move"
                            severity="secondary"
                            v-tooltip.top="'Last move'"
                            type="text"
                            placeholder="Top"
                            @click="chessStore.goToLastMove"
                        />
                        <Button
                            style="height: 3rem; width: 3rem"
                            icon="pi pi-undo"
                            aria-label="Undo move"
                            severity="danger"
                            v-tooltip.top="'Undo move'"
                            type="text"
                            placeholder="Top"
                            @click="chessStore.cancelLastMove"
                        />
                    </div>
                </template>
            </Card>
        </div>
    </div>
</template>
