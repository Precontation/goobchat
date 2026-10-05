<script lang="ts">
	import DesktopTopBar from '$lib/components/layout/DesktopTopBar.svelte';
	import Titlebar from '$lib/components/tauri/Titlebar.svelte';
	import { requestNotifications } from '$lib/services/notifications';
	import { setupTauri } from '$lib/tauri/main';
	import { isTauri } from '@tauri-apps/api/core';
	import { onMount } from 'svelte';

	let { children } = $props();

	onMount(async () => {
		if (isTauri()) {
			setupTauri();
		}

		// TODO: replace this with a "enable notifications" button
		const permission = await requestNotifications(); // Only request when signed in!
		// TODO: if the notification is false give a lil banner

		console.log('Notifications requested: ' + permission);
	});
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
