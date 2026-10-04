<!-- TODO: make derived from MessageFile or maybe never use this except in MessageFile and simplify this -->
<script lang="ts">
	import Image from '$lib/components/ui/Image.svelte';
	import type { ImageMessage } from '$lib/types/event';

	let {
		file
	}: {
		file: ImageMessage;
	} = $props();
</script>

<Image
	src={file.src}
	alt={file.caption}
	width={file.width}
	height={file.height}
	class="max-h-64 min-h-32 w-auto max-w-full rounded-lg object-contain shadow-sm"
/>

<!-- TODO: download info and stuff -->
<!-- <div class="absolute top-5 right-5">
		<ProgressAndCancelCircle {loaded} {total} onXButton={() => onXButton(file)} />
	</div> -->
