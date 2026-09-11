<script lang="ts">
	import MessageDisplay from '$lib/components/chat/message/Message.svelte';
	import type { Message as MessageData } from '$lib/types/message';

	import DesktopTopBar from '$lib/components/layout/DesktopTopBar.svelte';
	import { fly } from 'svelte/transition';

	const exampleReply: MessageData = {
		id: '$reply',
		sender: {
			displayName: 'Reply usernmame',
			userId: 'reply:matrix.org'
			// avatarSrc: ""
		},
		data: {
			kind: 'text',
			content: 'this should be a reply'
		}
	};

	const exampleMessage: MessageData = {
		id: '$message',
		replyToMessage: exampleReply,
		sender: {
			displayName: 'Example usernmame',
			userId: 'example:matrix.org'
			// avatarSrc: ""
		},
		data: {
			kind: 'text',
			content: 'example message. the quick brown fox jumps over the lazy dog! qwerty lorem ipsum :D'
		}
	};

	let exampleMessages: MessageData[] = $state([]);
</script>

<DesktopTopBar />

<div class="flex flex-col gap-messages">
	<MessageDisplay message={exampleMessage} reversed={true} />
	{#each exampleMessages as message}
		<div transition:fly={{ y: 40, duration: 300 }}>
			<MessageDisplay {message} reversed={true} />
		</div>
	{/each}
</div>

<button
	class="cursor-pointer rounded-bubble bg-surface p-theme"
	onclick={() => {
		exampleMessages.push(exampleMessage);
	}}>send message</button
>
