<script>
	import RoomList from '$lib/components/layout/RoomList.svelte';
	import { debugRooms } from '$lib/state/debug.svelte';
</script>

<div class="flex h-full">
	<div class="h-full w-65 border-r border-border">
		<RoomList rooms={debugRooms} />
	</div>

	<div class="flex flex-1">
		<span class="w-full content-center text-center text-secondary select-none"
			>Select a room to view!</span
		>
	</div>
</div>
