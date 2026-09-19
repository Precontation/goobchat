<script lang="ts">
	import { page } from '$app/state';
	import { setupMessages } from '$lib/apis/matrix/messages';
	import Input from '$lib/components/chat/Input.svelte';
	import MessageList from '$lib/components/chat/MessageList.svelte';
	import { matrixState } from '$lib/state/matrixClient.svelte';
	import type { TimelineMessage } from '$lib/types/event';

	$effect(() => {
		if (page.params.roomId) setupMessages(page.params.roomId);
	});
</script>

<div class="flex h-full flex-col gap-theme">
	<MessageList
		messages={matrixState.events.filter((event): event is TimelineMessage => event !== null)}
	/>

	<div class="bg-background p-theme pt-0">
		<Input />
	</div>
</div>
