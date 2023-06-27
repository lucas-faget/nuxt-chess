<script lang="ts">export default {
        props: ['name', 'advantage'],
    }
</script>

<template>
	<div class="player-bar">
		<div class="text">
            {{ name }}
        </div>
        <div class="text">
            {{ advantage }}
        </div>
	</div>
</template>

<style>
    .player-bar {
        background-color: var(--color-light);
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 60px;
        padding-inline: 30px;
    }

    .player-bar > .text {
        color: #000;
        font-size: 20px;
    }
</style>
