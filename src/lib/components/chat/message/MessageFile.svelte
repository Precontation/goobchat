<script lang="ts">
	import { loadMedia } from '$lib/apis/matrix/media';
	import type { AttachmentData } from '$lib/types/event';

	let {
		file
	}: {
		file: AttachmentData;
	} = $props();

	let downloadElement = $state<HTMLAnchorElement>();

	const clickDownload = async () => {
		if (!downloadElement) return;
		if (downloadElement.href) URL.revokeObjectURL(downloadElement.href);

		const loaded = await loadMedia(file.src);
		if (!loaded) return;

		downloadElement.href = loaded;
		downloadElement.download = file.filename;
		downloadElement.click();
	};
</script>

<div class="relative h-fit w-fit p-theme">
	<button
		class="flex aspect-square h-30 w-30 cursor-pointer flex-col items-center justify-center rounded-lg border-4 border-border shadow-sm"
		onclick={clickDownload}
	>
		<span>{file.filename}</span>
		<!-- TODO: size doesn't actually show up in the matrix message so you may have to do some annoying stuff to get it working -->
		<!-- <span>{formatBytes(file.size ?? 0)}</span> -->
	</button>

	<!-- TODO: download info and stuff -->
	<!-- <div class="absolute top-5 right-5">
		<ProgressAndCancelCircle {loaded} {total} onXButton={() => onXButton(file)} />
	</div> -->
</div>

<a class="hidden" bind:this={downloadElement} title={null} href={null}></a>
