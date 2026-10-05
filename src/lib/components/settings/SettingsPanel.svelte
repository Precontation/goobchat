<script>
	import { Menu, menusOpened, openMenu } from '$lib/state/menus.svelte';
	import CloseIcon from '../ui/CloseIcon.svelte';
</script>

<div class="h-full w-full border-4 border-border bg-background p-theme">
	<h1>Settings!</h1>
	<button onclick={() => openMenu(Menu.VERIFICATION)}>Start verification</button>
	<button onclick={() => menusOpened.pop()} class="absolute top-5 right-4 h-10 w-10"
		><CloseIcon /></button
	>
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
