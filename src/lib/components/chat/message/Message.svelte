<script lang="ts">
	import Avatar from '$lib/components/ui/Avatar.svelte';
	import type { Message } from '$lib/types/message';
	import Content from './Content.svelte';

	let { message, reversed = false }: { message: Message; reversed?: boolean } = $props();
</script>

<div class="w-full">
	<div class="message" class:reversed>
		<Avatar src={message.sender.avatarSrc} displayName={message.sender.displayName} />
		<div class="username-and-message">
			<!-- TODO: colored username -->
			<span>{message.sender.displayName}</span>

			<Content {message} />
		</div>
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
		z-index: -1;
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
