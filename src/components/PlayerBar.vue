<script lang="ts">
    export default {
        props: ['name', 'advantage'],
    }
</script>

<template>
	<div class="player-bar">
        <div class="left">
            <div class="sphere"></div>
            <div><span>{{ name }}</span></div>
        </div>
        <div>
            <div><span>{{ advantage }}</span></div>
        </div>
	</div>
</template>

<style>
    .player-bar {
        color: var(--color-light);
        background-color: var(--color-dark-gray);
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 60px;
        padding-inline: 30px;
        font-size: 20px;
    }

    .left {
        display: flex;
        align-items: center;
        gap: 20px;
    }

    .sphere {
        background: var(--color-white);
        width: 25px;
        aspect-ratio: 1/1;
        border-radius: 100%;
    }
</style>
