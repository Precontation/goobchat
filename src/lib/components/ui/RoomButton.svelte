<script lang="ts">
	import { resolve } from '$app/paths';
	import type { UIRoom } from '$lib/types/room';
	import Avatar from './Avatar.svelte';

	let { room, isLast = false }: { room: UIRoom; isLast?: boolean } = $props();
</script>

<a href={resolve('/(app)/[roomId]', { roomId: room.roomId })}>
	<Avatar src={room.avatarSrc ?? undefined} displayName={room.name} randomizeInput={room.roomId} />
	<div class="flex min-w-0 flex-1 flex-col items-start">
		<span class="w-full text-start text-nowrap">{room.name}</span>
		<span class="w-full truncate text-start text-nowrap text-ellipsis text-secondary"
			>{room.caption}</span
		>
	</div>
</a>

{#if !isLast}
	<div class="ml-15 border border-border"></div>
{/if}

<style>
	a {
		display: flex;
		width: 100%;
		height: 100%;
		cursor: pointer;
		align-items: center;
		gap: var(--gap-theme);
		padding: var(--padding-theme);
		user-select: none;

		-webkit-user-drag: none;
		-khtml-user-drag: none;
		-moz-user-drag: none;
		-o-user-drag: none;
	}

	a:hover {
		background-color: var(--color-surface);
	}

	a:active {
		background-color: var(--color-surface-active);
	}
</style>
