<script lang="ts">
	let { file }: { file: File } = $props();
	let imagePreview = $derived(URL.createObjectURL(file));
</script>

<img
	src={imagePreview}
	alt="Selected preview"
	class="max-h-32 min-h-32 w-auto rounded-lg object-contain shadow-sm"
/>
