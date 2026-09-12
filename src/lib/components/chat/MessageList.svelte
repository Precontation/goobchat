<script lang="ts">
	import MessageDisplay from '$lib/components/chat/message/Message.svelte';
	import type { Message as MessageData } from '$lib/types/message';

	import { fly } from 'svelte/transition';

	let { messages }: { messages: MessageData[] } = $props();

	let listRef = $state<HTMLDivElement>();

	$effect(() => {
		messages.length; // Read just for it to be reactive

		if (!listRef) return;

		listRef.scrollTo({
			top: listRef.scrollHeight,
			behavior: 'smooth'
		});
	});
</script>

<div class="message-list" bind:this={listRef}>
	{#each messages as message, i}
		<div transition:fly={{ y: 40, duration: 300 }}>
			<MessageDisplay {message} prevMessage={i > 0 ? messages[i - 1] : null} reversed={true} />
		</div>
	{/each}
</div>

<style>
	.message-list {
		flex: 1;

		border-radius: var(--radius-bubble);
		background-color: var(--color-message-background);

		display: flex;
		flex-direction: column;
		gap: var(--gap-messages);

		padding: var(--padding-theme);

		overflow-y: scroll; /* Intentionally not `auto` because you want the space always reserved for a scrollbar */
	}
</style>
