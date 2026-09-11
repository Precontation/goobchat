<!-- @component Displays an avatar for a user, room, or anything else that needs it. If no image provided, falls back to a name-derived background -->

<script lang="ts">
	let { displayName, src }: { displayName: string; src?: string } = $props();

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
	style="background-color: hsl({generateHash(displayName) % 360}, 70%, 30%)"
>
	{#if src}
		<img {src} alt={displayName} />
	{:else}
		<span class="select-none">{displayName?.[0]?.toUpperCase() ?? '?'}</span>
	{/if}
</div>
