<script lang="ts">
	import { load } from '$lib/apis/client';
	import favicon from '$lib/assets/favicon.svg';
	import LoginForm from '$lib/components/login/LoginForm.svelte';
	import { matrixState } from '$lib/state/matrixClient.svelte';
	import './layout.css';

	let { children } = $props();

	load();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

{#if !matrixState.loading}
	{#if matrixState.loggedIn}
		{@render children()}
	{:else}
		<LoginForm />
	{/if}
{:else}
	Loading...
{/if}
