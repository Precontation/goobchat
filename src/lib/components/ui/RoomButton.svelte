<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Room } from '$lib/types/room';
	import Avatar from './Avatar.svelte';

	let { room, isLast = false }: { room: Room; isLast?: boolean } = $props();
</script>

<a
	class="flex h-full w-full cursor-pointer items-center gap-theme p-theme hover:bg-surface active:bg-surface-active"
	href={resolve('/(app)/[roomId]', { roomId: room.roomId })}
>
	<Avatar src={room.avatarSrc} displayName={room.displayName} randomizeInput={room.roomId} />
	<div class="flex min-w-0 flex-1 flex-col items-start">
		<span class="w-full text-start text-nowrap">{room.displayName}</span>
		<span class="w-full truncate text-start text-nowrap text-ellipsis text-secondary"
			>{room.caption}</span
		>
	</div>
</a>

{#if !isLast}
	<div class="ml-15 border border-border"></div>
{/if}
