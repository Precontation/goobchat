<script lang="ts">
	import type { UIRoom } from '$lib/types/room';
	import RoomButton from '../ui/RoomButton.svelte';

	let { rooms }: { rooms: UIRoom[] } = $props();
</script>

<div class="flex w-full flex-col gap-theme">
	{#each rooms as room, i}
		<RoomButton {room} isLast={i === rooms.length - 1} />
	{/each}
</div>
