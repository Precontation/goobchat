<script lang="ts">
	import type { ContextMenuItem } from '$lib/types/ui/contextMenuItem';
	import Popover from './Popover.svelte';

	let { elements }: { elements: ContextMenuItem[] } = $props();

	const id = 'user-summary';
</script>

<Popover popoverId={id}>
	{#each elements as element, i (i)}
		<button
			class={elements.length - 1 != i ? 'border-b border-border' : ''}
			onclick={() => {
				const popover = document.getElementById(id);
				if (popover) popover.hidePopover();

				element.action();
			}}
		>
			{#if element.icon}
				<element.icon />
			{/if}
			<span>{element.name}</span>
		</button>
	{/each}
</Popover>

<style>
	button {
		display: flex;
		color: var(--color-primary);
		cursor: pointer;

		padding: var(--padding-theme);
	}
</style>
