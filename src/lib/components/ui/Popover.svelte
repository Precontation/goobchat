<script lang="ts">
	let { popoverId, children } = $props();
</script>

<div popover id={popoverId} class="info-popover">
	{@render children()}
</div>

<style>
	.info-popover {
		margin: 0;
		inset: auto;
		max-width: 300px;

		position-area: bottom right;
		position-try-fallbacks: flip-block;

		background-color: var(--color-surface);
		border: 0.5px solid var(--color-primary);
	}
</style>
