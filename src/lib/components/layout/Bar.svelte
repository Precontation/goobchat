<!-- @component Reusable bar both vertically and horizontally. -->

<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
		direction?: 'horizontal' | 'vertical';
		class?: string;
	};

	let { children, direction = 'horizontal', class: className }: Props = $props();
</script>

<div
	class:horizontal={direction === 'horizontal'}
	class:vertical={direction === 'vertical'}
	class="flex w-full {className}"
>
	{@render children()}
</div>

<style>
	div {
		background-color: var(--color-background);
		border-color: var(--color-border);
	}

	.horizontal {
		width: 100%;
		height: 4rem;
		border-bottom: 1px solid var(--color-border);
	}

	.vertical {
		width: 4rem;
		height: 100%;
		border-right: 1px solid var(--color-border);
	}
</style>
