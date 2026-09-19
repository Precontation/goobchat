<script>
	import RoomList from '$lib/components/layout/RoomList.svelte';
	import { matrixState } from '$lib/state/matrixClient.svelte';
</script>

<div class="flex h-full">
	<div class="h-full w-65 border-r border-border">
		<RoomList rooms={matrixState.rooms} />
	</div>

	<div class="flex flex-1">
		<span class="w-full content-center text-center text-secondary select-none"
			>Select a room to view!</span
		>
	</div>
</div>
