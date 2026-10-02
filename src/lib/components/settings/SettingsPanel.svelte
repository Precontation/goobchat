<script>
	import { Menu, menusOpened } from '$lib/state/menus.svelte';
</script>

<div class="h-full w-full border-4 border-border bg-background p-theme">
	<h1>Settings!</h1>
	<button onclick={() => menusOpened.push(Menu.VERIFICATION)}>Start verification</button>
</div>

<style>
	h1 {
		font-size: xx-large;
	}

	button {
		border: 2px solid var(--color-border);
		padding: 0.5rem;
	}
</style>
