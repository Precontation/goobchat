<script lang="ts">
	import type { UIRoom } from '$lib/types/room';
	import { flip } from 'svelte/animate';
	import RoomButton from '../ui/RoomButton.svelte';

	let { rooms }: { rooms: UIRoom[] } = $props();
</script>

<div class="flex w-full flex-col gap-theme">
	{#each rooms as room, i (room.roomId)}
		<div animate:flip class="h-15">
			<RoomButton {room} isLast={i === rooms.length - 1} />
		</div>
	{/each}
</div>
