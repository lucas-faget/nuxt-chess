<script setup lang="ts">
import { VChessVariant } from "@/types";

const { isSmallScreen } = useMediaQuery();

const visible = ref<boolean>(false);

const opponents = ref([
    { name: "Anybody", icon: "pi-users" },
    { name: "Computer", icon: "pi-microchip-ai" },
    { name: "Friend", icon: "pi-face-smile" },
]);

const variants = [
    { name: "Standard", type: VChessVariant.Standard },
    { name: "Fischer random", type: VChessVariant.FischerRandom },
    { name: "Fof of War", type: VChessVariant.FogOfWar },
    { name: "Four Player chess", type: VChessVariant.FourPlayer },
];

const speeds = [{ name: "10+0" }, { name: "5+0" }, { name: "3+0" }, { name: "1+0" }];

const selectedOpponent = ref();
const selectedVariant = ref(variants[0]);
const selectedSpeed = ref(speeds[0]);
</script>

<template>
    <Button label="Play" @click="visible = true" />

    <Dialog
        v-model:visible="visible"
        modal
        header="Create a game"
        :style="{ width: 'min(100vw,46rem)' }"
        class="app-font"
    >
        <div class="flex max-sm:flex-col mb-8 gap-4">
            <div class="flex flex-col gap-4">
                <span class="text-surface-500 dark:text-surface-400"> Select your opponent. </span>

                <Listbox
                    v-model="selectedOpponent"
                    :options="opponents"
                    optionLabel="name"
                    class="w-48 max-sm:w-full"
                >
                    <template #option="slotProps">
                        <div class="flex items-center gap-2">
                            <i :class="`pi ${slotProps.option.icon}`"></i>
                            <span>{{ slotProps.option.name }}</span>
                        </div>
                    </template>
                </Listbox>
            </div>

            <Divider :layout="`${isSmallScreen ? 'horizontal' : 'vertical'}`" />

            <!-- <div class="max-sm:hidden">
                <Divider layout="vertical" />
            </div>

            <div class="sm:hidden">
                <Divider layout="horizontal" />
            </div> -->

            <div class="flex-1 flex flex-col gap-4">
                <img src="/images/chess.png" alt="Image" class="w-full mb-4" />

                <span class="text-surface-500 dark:text-surface-400"> Set up your game. </span>

                <div class="flex justify-between items-center gap-4">
                    <span class="text-surface-500 dark:text-surface-400"> Variant </span>

                    <Select
                        v-model="selectedVariant"
                        :options="variants"
                        optionLabel="name"
                        placeholder="Select a Variant"
                        class="w-40"
                    />
                </div>

                <div class="flex justify-between items-center gap-4">
                    <span class="text-surface-500 dark:text-surface-400"> Speed </span>

                    <Select
                        v-model="selectedSpeed"
                        :options="speeds"
                        optionLabel="name"
                        placeholder="Select a Variant"
                        class="w-40"
                    />
                </div>
            </div>
        </div>

        <Divider />

        <div class="flex justify-end gap-2">
            <Button
                type="button"
                label="Cancel"
                severity="secondary"
                @click="visible = false"
            ></Button>
            <Button
                type="button"
                label="Create"
                @click="visible = false"
                severity="contrast"
            ></Button>
        </div>
    </Dialog>
</template>
