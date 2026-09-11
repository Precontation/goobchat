<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import DesktopTopBar from '$lib/components/layout/DesktopTopBar.svelte';
	import './layout.css';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

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
