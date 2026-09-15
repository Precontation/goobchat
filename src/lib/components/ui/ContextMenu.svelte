<script lang="ts">
	import type { ContextMenuItem } from '$lib/types/ui/contextMenuItem';
	import Popover from './Popover.svelte';

	let { elements }: { elements: ContextMenuItem[] } = $props();
</script>

<Popover popoverId="user-summary">
	{#each elements as element, i (i)}
		<button
			class={elements.length - 1 != i ? 'border-b border-border' : ''}
			onclick={element.action}
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

	button:hover {
		background-color: var(--color-surface-hover);
	}

	button:active {
		background-color: var(--color-surface-active);
	}
</style>
