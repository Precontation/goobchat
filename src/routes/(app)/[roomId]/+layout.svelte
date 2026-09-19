<script>
	import RoomList from '$lib/components/layout/RoomList.svelte';
	import { matrixState } from '$lib/state/matrixClient.svelte';

	let { children } = $props();
</script>

<div class="flex h-full">
	<div class="h-full w-65 border-r border-border">
		<RoomList rooms={matrixState.rooms} />
	</div>

	<div class="flex-1">
		{@render children()}
	</div>
</div>
