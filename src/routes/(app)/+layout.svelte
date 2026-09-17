<script lang="ts">
	import DesktopTopBar from '$lib/components/layout/DesktopTopBar.svelte';
	import Titlebar from '$lib/components/tauri/Titlebar.svelte';
	import { isTauri } from '@tauri-apps/api/core';

	let { children } = $props();
</script>

<div class="flex h-dvh w-dvw flex-col">
	{#if isTauri()}
		<Titlebar />
	{/if}
	<DesktopTopBar />

	<div class="app-shell">
		{@render children()}
	</div>
</div>

<style>
	.app-shell {
		flex: 1;
		overflow: hidden;

		overscroll-behavior: none;
	}
</style>
