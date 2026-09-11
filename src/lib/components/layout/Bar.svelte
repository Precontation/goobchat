<!-- @component Reusable bar both vertically and horizontally. -->

<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
		direction?: 'horizontal' | 'vertical';
	};

	let { children, direction = 'horizontal' }: Props = $props();
</script>

<div class:horizontal={direction === 'horizontal'} class:vertical={direction === 'vertical'}>
	{@render children()}
</div>

<style>
	div {
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
