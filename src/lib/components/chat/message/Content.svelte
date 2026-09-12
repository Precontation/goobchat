<script lang="ts">
	import type { Message } from '$lib/types/message';
	import Content from './Content.svelte';

	let { message, showReply = true }: { message: Message; showReply?: boolean } = $props();
</script>

<div
	class="flex flex-col gap-theme self-end rounded-bubble p-theme {showReply
		? 'w-fit bg-surface'
		: 'w-full bg-message-background'}"
>
	{#if message.replyToMessage && showReply}
		<Content message={message.replyToMessage} showReply={false} />
	{/if}
	{#if message.data.kind === 'text'}
		<p class="whitespace-pre-wrap">
			{message.data.content}
		</p>
	{/if}
</div>
