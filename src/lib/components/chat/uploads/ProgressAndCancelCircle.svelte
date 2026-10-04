<script lang="ts">
	import { cubicOut } from 'svelte/easing';
	import { Tween } from 'svelte/motion';
	import { fade } from 'svelte/transition';

	let { loaded, total, onXButton }: { loaded: number; total: number; onXButton: () => void } =
		$props();

	let progressPercent: number = $derived((total > 0 ? loaded / total : 0) * 100);

	const size = 6;
	const ringSize = 8;

	const timeoutAfterSubmitted = 1250;

	let progress = new Tween(0, {
		duration: 400,
		easing: cubicOut
	});

	let finishedUploadAnimation = $state(false);
	$effect(() => {
		progress.target = progressPercent;

		if (progressPercent === 100) {
			setTimeout(() => {
				finishedUploadAnimation = true;
			}, timeoutAfterSubmitted);
		}
	});
</script>

<div
	class="relative flex h-{ringSize} w-{ringSize} items-center justify-center rounded-full"
	style="
		background: conic-gradient(
			var(--color-border) calc(var(--progress) * 1%), 
			transparent calc(var(--progress) * 1%)
		);
		--progress: {progress.current};
	"
>
	<!-- This inner circle cuts out the center to turn the gradient into a ring -->
	<div
		class="flex h-{size} w-{size} items-center justify-center rounded-full bg-background text-xs font-bold outline-border"
	>
		{#if progressPercent == 100 && !finishedUploadAnimation}
			<span in:fade out:fade>✓</span>
		{/if}
	</div>

	<button
		class="group absolute top-0 right-0 bottom-0 left-0 rounded-full {finishedUploadAnimation
			? 'opacity-100 transition-opacity duration-300'
			: 'opacity-0 hover:opacity-100 active:opacity-100'}"
		onclick={onXButton}
	>
		<span class="text-primary">X</span>
	</button>
</div>
