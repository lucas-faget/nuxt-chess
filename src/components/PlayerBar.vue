<script lang="ts">
    export default {
        props: ['name', 'advantage'],
    }
</script>

<template>
	<div class="player-bar">
		<span>
            {{ name }}
        </span>
        <span>
            {{ advantage }}
        </span>
	</div>
</template>

<style>
    .player-bar {
        color: var(--color-black);
        background-color: var(--color-white);
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 60px;
        padding-inline: 30px;
        font-size: 20px;
    }
</style>
