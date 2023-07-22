<script lang="ts">
	import RoundButton from '@/components/RoundButton.vue';
	import { routes } from '../router/routes'
	
	export default {
		components: { RoundButton },
		data() {
			return {
				routes: routes
			}
		},
	}
</script>

<template>
	<div class="home">
		
	</div>
</template>

<style scoped>
	.home {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: 30px;
	}

	.menu {
		display: flex;
	}
</style>
