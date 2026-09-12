<script lang="ts">
	import Input from '$lib/components/chat/Input.svelte';
	import MessageList from '$lib/components/chat/MessageList.svelte';
	import { debugMessages } from '$lib/state/debug.svelte';
</script>

<div class="flex h-full flex-col gap-theme">
	<MessageList messages={debugMessages} />

	<div class="bg-background p-theme pt-0">
		<Input />
	</div>
</div>
