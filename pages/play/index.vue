<script setup lang="ts">
import { useChessStore } from "~/stores/chess";
import { type VPlayer } from "@/types";

definePageMeta({
    layout: "aside",
});

const chessStore = useChessStore();

const value = ref("1");
const options = ref(["0", "0"]);

const bottomPlayer = computed<VPlayer>(() => {
    return chessStore.players[chessStore.playerInFrontIndex];
});

const topPlayer = computed<VPlayer>(() => {
    return chessStore.players[(chessStore.playerInFrontIndex + 1) % chessStore.players.length];
});

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
                        <Avatar icon="pi pi-user" size="large" shape="circle" />
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
                        <Avatar icon="pi pi-user" size="large" shape="circle" />
                        <span>Player 2</span>
                    </div>
                </div>
            </div>
        </div>

        <div
            class="w-96 max-lg:w-full lg:min-h-screen shrink-0 p-2 flex lg:flex-col flex-col-reverse gap-2"
        >
            <Panel class="flex-1 overflow-hidden">
                <template #header>
                    <Tabs value="0" class="w-full">
                        <TabList>
                            <Tab value="0">Moves</Tab>
                            <Tab value="1">Game</Tab>
                            <Tab value="2">Settings</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel value="0">
                                <div class="flex">
                                    <Button
                                        class="flex-1"
                                        type="button"
                                        label="Cancel last move"
                                        severity="danger"
                                        @click="chessStore.cancelLastMove"
                                    ></Button>
                                </div>
                            </TabPanel>
                            <TabPanel value="1" class="">
                                <div class="flex flex-col">
                                    <div class="flex justify-center items-center gap-8 py-8">
                                        <div class="flex flex-col items-center gap-2">
                                            <Avatar
                                                icon="pi pi-user"
                                                size="xlarge"
                                                shape="circle"
                                            />
                                            <span>Player 1</span>
                                        </div>
                                        <SelectButton v-model="value" :options="options" disabled />
                                        <div class="flex flex-col items-center gap-2">
                                            <Avatar
                                                icon="pi pi-user"
                                                size="xlarge"
                                                shape="circle"
                                            />
                                            <span>Player 2</span>
                                        </div>
                                    </div>

                                    <Divider />

                                    <div class="flex justify-between">
                                        <span class="text-muted-color">Variant</span>
                                        <Tag
                                            icon="pi pi-tag"
                                            value="Standard"
                                            severity="secondary"
                                        ></Tag>
                                    </div>

                                    <Divider />

                                    <div class="flex justify-between">
                                        <span class="text-muted-color">Speed</span>
                                        <Tag
                                            icon="pi pi-clock"
                                            value="Unlimited"
                                            severity="secondary"
                                        ></Tag>
                                    </div>
                                </div>
                            </TabPanel>
                            <TabPanel value="2">
                                <Settings />
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </template>
            </Panel>

            <Controls
                @go-to-first-move="chessStore.goToFirstMove"
                @go-to-previous-move="chessStore.goToPreviousMove"
                @spin-chessboard="chessStore.spinChessboard"
                @go-to-next-move="chessStore.goToNextMove"
                @go-to-last-move="chessStore.goToLastMove"
            />
        </div>
    </div>
</template>
