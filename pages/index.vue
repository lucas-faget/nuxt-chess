<script setup lang="ts">
interface GameCreationDialog {
    open: () => void;
    close: () => void;
}

const gameCreationDialog = ref<GameCreationDialog | null>(null);

const play = (): void => {
    if (gameCreationDialog.value) {
        gameCreationDialog.value.open();
    }
};
</script>

<template>
    <div class="flex justify-center items-center min-h-screen">
        <div class="flex flex-col gap-8">
            <span class="text-5xl font-semibold">Play Chess</span>
            <span class="w-full max-w-[32rem] text-lg text-muted-color">
                Play chess online alone or with your friends. Choose from various chess variants,
                select your favourite time control, then dive into the match. May the best player
                win!
            </span>
            <Button
                label="Play"
                @click="play"
                severity="contrast"
                icon="pi pi-arrow-right"
                iconPos="right"
                class="w-32"
            />
        </div>
    </div>

    <GameCreationDialog ref="gameCreationDialog" />
</template>
