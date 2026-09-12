<script lang="ts">
	import Avatar from '$lib/components/ui/Avatar.svelte';
	import type { Message } from '$lib/types/message';
	import Content from './Content.svelte';

	let {
		message,
		prevMessage,
		reversed = false
	}: { message: Message; prevMessage: Message | null; reversed?: boolean } = $props();
</script>

<div class="w-full">
	<div class="message" class:reversed>
		{#if message.sender.userId === prevMessage?.sender.userId}
			<div class="mx-7 w-full">
				<Content {message} />
			</div>
		{:else}
			<Avatar
				src={message.sender.avatarSrc}
				displayName={message.sender.displayName}
				randomizeInput={message.sender.userId}
			/>
			<div class="username-and-message">
				<!-- TODO: colored username -->
				<span>{message.sender.displayName}</span>

				<Content {message} />
			</div>
		{/if}
	</div>
</div>

<style>
	.message {
		display: flex;
		width: fit-content;
		max-width: 75%;
	}

	.reversed {
		flex-direction: row-reverse;
		justify-self: end;
	}

	.username-and-message {
		margin-inline: -0.75rem;
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	.reversed .username-and-message {
		text-align: end;
	}

	.username-and-message span {
		margin-inline: 1rem;
	}
</style>
