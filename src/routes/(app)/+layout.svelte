<script lang="ts">
	import DesktopTopBar from '$lib/components/layout/DesktopTopBar.svelte';

	let { children } = $props();
</script>

<div class="flex h-dvh w-dvw flex-col">
	<DesktopTopBar />

	<div class="app-shell">
		{@render children()}
	</div>
</div>

<style>
	.app-shell {
		flex: 1;
		overflow: hidden;
	}
</style>
