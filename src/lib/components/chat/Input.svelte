<script lang="ts">
	import { sendTextMessage } from '$lib/apis/matrix/messages';
	import { onMount } from 'svelte';

	let textAreaRef = $state<HTMLTextAreaElement>();

	const onSubmit = () => {
		if (!textAreaRef) return;

		sendTextMessage(textAreaRef.value);
	};

	const handleKeydown = (event: KeyboardEvent) => {
		if (!textAreaRef) return;

		const MODIFIER_KEYS = [
			'Shift',
			'Meta',
			'Control',
			'Alt',
			'CapsLock',
			'ArrowDown',
			'ArrowUp',
			'ArrowRight',
			'ArrowLeft',
			'Tab',
			'Escape',
			'F1',
			'F2',
			'F3',
			'F4',
			'F5',
			'F6',
			'F7',
			'F8',
			'F9',
			'F10',
			'F11',
			'F12',
			'Home',
			'End',
			'PageUp',
			'PageDown',
			'Insert',
			' '
		];

		const isPaste = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'v';

		if (
			isPaste ||
			!(MODIFIER_KEYS.includes(event.key) || event.ctrlKey || event.metaKey || event.altKey)
		) {
			textAreaRef.focus();
		}

		if (event.key == 'Enter' && !event.shiftKey) {
			if (textAreaRef.value.trim() !== '') {
				onSubmit();
				textAreaRef.value = '';
			}

			event.preventDefault();
		}
	};

	onMount(() => {
		window.addEventListener('keydown', handleKeydown);

		return () => {
			window.removeEventListener('keydown', handleKeydown);
		};
	});
</script>

<form class="flex h-fit w-full gap-theme rounded-bubble bg-surface">
	<!-- TODO: custom icon -->
	<div class="h-15 w-15 p-theme">
		<button
			class="h-full w-full cursor-pointer rounded-bubble hover:bg-surface-hover active:bg-surface-active"
		>
			<div class="flex h-full w-full items-center justify-center text-3xl leading-none select-none">
				+
			</div>
		</button>
	</div>

	<!-- TODO: `Message (room name)` -->
	<textarea
		bind:this={textAreaRef}
		name="content"
		class="field-sizing-content max-h-50 min-h-15 w-full resize-none content-center border-0 bg-transparent"
		placeholder="Send message"></textarea>
</form>
