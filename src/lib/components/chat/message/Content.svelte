<script lang="ts">
	import type { TimelineMessage } from '$lib/types/event';
	import { EventStatus } from 'matrix-js-sdk';
	import Content from './Content.svelte';
	import MessageFile from './MessageFile.svelte';
	import MessageImage from './MessageImage.svelte';

	let { message, showReply = true }: { message: TimelineMessage; showReply?: boolean } = $props();
</script>

<div
	class="flex flex-col gap-theme self-end rounded-bubble p-theme {showReply
		? 'w-fit bg-surface'
		: 'w-full bg-message-background'} {message.status === EventStatus.SENDING ||
	message.status === EventStatus.QUEUED
		? 'text-message-text-sending'
		: ''}"
>
	{#if message.replyToMessage && showReply}
		<Content message={message.replyToMessage} showReply={false} />
	{/if}
	{#if message.data.kind === 'text'}
		<p class="whitespace-pre-wrap">
			{message.data.content}
		</p>
	{:else if message.data.kind === 'image'}
		<MessageImage file={message.data} />
	{:else if message.data.kind === 'file'}
		<MessageFile file={message.data} />
	{/if}
</div>
