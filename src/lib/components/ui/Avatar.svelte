<!-- @component Displays an avatar for a user, room, or anything else that needs it. If no image provided, falls back to a name-derived background -->

<script lang="ts">
	let {
		/** The display name of the image to use as an image alt or defaults if no image found */
		displayName,

		/** The image source */
		src,

		/** Usually some ID */
		randomizeInput
	}: { displayName: string; src?: string; randomizeInput: string } = $props();

	// https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
	const generateHash = (string: string) => {
		let hash = 0;
		for (const char of string) {
			hash = (hash << 5) - hash + char.charCodeAt(0);
			hash |= 0; // Constrain to 32bit integer
		}
		return hash;
	};
</script>

<div
	class="flex aspect-square h-10 w-10 items-center justify-center rounded-full"
	style="background-color: hsl({generateHash(randomizeInput) % 360}, 70%, 30%)"
>
	{#if src}
		<img {src} alt={displayName} />
	{:else}
		<span class="select-none">{displayName?.[0]?.toUpperCase() ?? '?'}</span>
	{/if}
</div>
