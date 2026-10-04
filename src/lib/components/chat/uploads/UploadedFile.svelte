<script lang="ts">
	import { uploadFile } from '$lib/apis/matrix/media';
	import { formatBytes } from '$lib/utils/formatBytes';
	import ProgressAndCancelCircle from './ProgressAndCancelCircle.svelte';
	import UploadedImage from './UploadedImage.svelte';

	let loaded = $state<number>(0);
	let total = $state<number>(0);

	const uploadFileToClient = async (file: File) => {
		try {
			const result = await uploadFile(file, (uploadLoaded, uploadTotal) => {
				loaded = uploadLoaded;
				total = uploadTotal;
			});

			if (result) uri = result.content_uri;
			else uri = null;
		} catch {
			uri = null;
		}
	};

	let {
		file,
		uri = $bindable(),
		onXButton
	}: {
		file: File;
		uri: string | null | undefined;
		onXButton: (file: File) => void;
	} = $props();

	$effect(() => {
		uploadFileToClient(file);
	});
</script>

<div class="relative h-fit w-fit p-theme">
	{#if file.type.startsWith('image/')}
		<UploadedImage {file} />
	{:else}
		<div
			class="flex aspect-square h-30 w-30 flex-col items-center justify-center rounded-lg bg-background shadow-sm"
		>
			<span>{file.name}</span>
			<span>{formatBytes(file.size)}</span>
		</div>
	{/if}

	<div class="absolute top-5 right-5">
		<ProgressAndCancelCircle {loaded} {total} onXButton={() => onXButton(file)} />
	</div>
</div>
