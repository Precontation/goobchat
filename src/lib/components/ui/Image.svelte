<script lang="ts">
	import { loadThumbnail } from '$lib/apis/matrix/media';

	let {
		src,
		alt,
		width,
		height,
		class: className,
		imageSrc = $bindable()
	}: {
		src: string;
		alt?: string;
		width?: number;
		height?: number;
		class?: string;
		imageSrc?: string | null | undefined;
	} = $props();

	$effect(() => {
		imageSrc = undefined;
		if (!src) return;

		let cancelled = false;
		loadThumbnail(src)
			.then((loaded) => {
				if (!cancelled) imageSrc = loaded;
			})
			.catch(() => {
				// Null means something failed (vs undefined meaning still loading)
				imageSrc == null;
			});

		return () => {
			cancelled = true;
		};
	});
</script>

<img src={imageSrc} {alt} class={className} />
