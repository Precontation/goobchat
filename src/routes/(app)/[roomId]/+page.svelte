<script lang="ts">
	import { page } from '$app/state';
	import { client } from '$lib/apis/matrix/client';
	import { setupMessages } from '$lib/apis/matrix/messages';
	import { getRoomCaption } from '$lib/apis/matrix/rooms';
	import Input from '$lib/components/chat/Input.svelte';
	import MessageList from '$lib/components/chat/MessageList.svelte';
	import { matrixState } from '$lib/state/matrixClient.svelte';
	import type { TimelineMessage } from '$lib/types/event';

	let name = $state<string>();

	$effect(() => {
		if (page.params.roomId && matrixState.loggedIn && !matrixState.loading) {
			setupMessages(page.params.roomId);
			let room = client?.getRoom(page.params.roomId);
			if (!room) {
				matrixState.currentRoom = undefined;
				return;
			}

			matrixState.currentRoom = {
				avatarSrc: room.getMxcAvatarUrl(),
				caption: getRoomCaption(room),
				name: room.name,
				roomId: room.roomId
			};
		}
	});
</script>

<svelte:head>
	<title>{name ? 'goobchat | ' + name : 'goobchat'}</title>
</svelte:head>

<div class="flex h-full flex-col gap-theme">
	<MessageList
		messages={matrixState.events.filter((event): event is TimelineMessage => event !== null)}
	/>

	<div class="bg-background p-theme pt-0">
		<Input />
	</div>
</div>
