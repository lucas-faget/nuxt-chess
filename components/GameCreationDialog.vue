<script setup lang="ts">
import { useConfirm } from "primevue/useconfirm";
import { useChessStore } from "~/stores/chess";
import { VChessVariant } from "@/types";
import ConfirmDialog from "primevue/confirmdialog";

const { isSmallScreen } = useMediaQuery();

const chessStore = useChessStore();
const confirm = useConfirm();

const visible = ref<boolean>(false);

const opponents = [
    { name: "Anybody", icon: "pi-users" },
    { name: "Computer", icon: "pi-microchip-ai" },
    { name: "Friend", icon: "pi-face-smile" },
];

const variants = [
    { name: "Standard", type: VChessVariant.Standard },
    { name: "Fischer random", type: VChessVariant.FischerRandom },
    { name: "Fog of War", type: VChessVariant.FogOfWar },
    { name: "Four Player chess", type: VChessVariant.FourPlayer },
];

const speeds = [{ name: "10+0" }, { name: "5+0" }, { name: "3+0" }, { name: "1+0" }];

const selectedOpponent = ref(opponents[0]);
const selectedVariant = ref(variants[0]);
const selectedSpeed = ref(speeds[0]);

const openConfirmDialog = (): void => {
    confirm.require({
        message:
            "It seems that a game already exists. If you start a new game, the current game will be removed. Are you sure you want to continue ?",
        header: "Game already exists",
        icon: "pi pi-exclamation-circle",
        rejectProps: {
            label: "Return to game",
            severity: "secondary",
            outlined: true,
        },
        acceptProps: {
            label: "Create new game",
            severity: "contrast",
        },
        reject: () => {
            navigateTo("/play");
        },
        accept: () => {
            visible.value = true;
        },
    });
};

const open = (): void => {
    if (chessStore.gameExists()) {
        openConfirmDialog();
    } else {
        visible.value = true;
    }
};

const close = (): void => {
    visible.value = false;
};

const createChessGame = (): void => {
    chessStore.createChessGame(selectedVariant.value.type);
    navigateTo("/play");
};

defineExpose({
    open,
    close,
});
</script>

<template>
    <ConfirmDialog :style="{ maxWidth: '32rem' }"></ConfirmDialog>
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

            <div class="flex-1 flex flex-col gap-4">
                <img src="/images/game_creation.png" alt="Image" class="w-full mb-4" />

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
                icon="pi pi-angle-left"
                iconPos="left"
                @click="close"
            ></Button>
            <Button
                type="button"
                label="Create"
                severity="contrast"
                icon="pi pi-angle-right"
                iconPos="right"
                @click="createChessGame"
            ></Button>
        </div>
    </Dialog>
</template>
