<script lang="ts">
	import { load } from '$lib/apis/matrix/client';
	import favicon from '$lib/assets/favicon.svg';
	import LoginForm from '$lib/components/login/LoginForm.svelte';
	import SettingsPanel from '$lib/components/settings/SettingsPanel.svelte';
	import Verification from '$lib/components/settings/verification/Verification.svelte';
	import { matrixState } from '$lib/state/matrixClient.svelte';
	import { Menu, menusOpened } from '$lib/state/menus.svelte';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import './layout.css';

	let { children } = $props();

	onMount(() => {
		load();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{#if menusOpened.length > 0}
	<div class="fixed h-full w-full bg-background/80">
		{#each menusOpened as menu, i (i)}
			<div class="fixed top-24 right-24 bottom-24 left-24 z-{i}">
				{#if menu == Menu.SETTINGS}
					<SettingsPanel />
				{:else if menu === Menu.VERIFICATION}
					<Verification />
				{/if}
			</div>
		{/each}
	</div>
{/if}

{#if !matrixState.loadingSession}
	{#if !matrixState.loading}
		{#if matrixState.loggedIn}
			{@render children()}
		{:else}
			<div
				out:fade={{
					duration: 100
				}}
				class="flex h-dvh w-full items-center justify-center"
				// TODO: make not h-dvh thats bad code i think
			>
				<LoginForm />
			</div>
		{/if}
	{:else}
		<div
			out:fade={{
				duration: 100
			}}
			class="flex h-dvh w-full items-center justify-center"
			// TODO: make not h-dvh thats bad code i think
		>
			<span class="animate-pulse select-none">Loading...</span>
		</div>
	{/if}
{/if}
